const express = require('express');
const router = express.Router();
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// 获取当前用户的消息列表
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, read_status, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        m.*,
        sender.full_name as sender_name,
        sender.avatar as sender_avatar,
        p.name as project_name
      FROM messages m
      LEFT JOIN users sender ON m.sender_id = sender.id
      LEFT JOIN projects p ON m.project_id = p.id
      WHERE m.receiver_id = ?
    `;

    const params = [userId];

    // 按消息类型筛选
    if (type) {
      query += ` AND m.message_type = ?`;
      params.push(type);
    }

    // 按已读状态筛选
    if (read_status) {
      if (read_status === 'unread') {
        query += ` AND m.is_read = 0`;
      } else if (read_status === 'read') {
        query += ` AND m.is_read = 1`;
      }
    }

    query += ` ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const messages = await database.all(query, params);

    // 获取未读消息数量
    const unreadCount = await database.get(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0',
      [userId]
    );

    res.json({
      messages,
      unreadCount: unreadCount.count,
      total: messages.length
    });
  } catch (error) {
    console.error('获取消息列表错误:', error);
    res.status(500).json({ error: '获取消息列表失败' });
  }
});

// 获取未读消息数量
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await database.get(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0',
      [userId]
    );

    res.json({ count: result.count });
  } catch (error) {
    console.error('获取未读消息数量错误:', error);
    res.status(500).json({ error: '获取未读消息数量失败' });
  }
});

// 标记消息为已读
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.id;

    // 验证消息是否属于当前用户
    const message = await database.get(
      'SELECT * FROM messages WHERE id = ? AND receiver_id = ?',
      [messageId, userId]
    );

    if (!message) {
      return res.status(404).json({ error: '消息不存在或无权访问' });
    }

    await database.run(
      'UPDATE messages SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE id = ?',
      [messageId]
    );

    res.json({ message: '消息已标记为已读' });
  } catch (error) {
    console.error('标记消息已读错误:', error);
    res.status(500).json({ error: '标记消息已读失败' });
  }
});

// 标记所有消息为已读
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await database.run(
      'UPDATE messages SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE receiver_id = ? AND is_read = 0',
      [userId]
    );

    res.json({ message: '所有消息已标记为已读' });
  } catch (error) {
    console.error('标记所有消息已读错误:', error);
    res.status(500).json({ error: '标记所有消息已读失败' });
  }
});

// 删除消息
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.id;

    // 验证消息是否属于当前用户
    const message = await database.get(
      'SELECT * FROM messages WHERE id = ? AND receiver_id = ?',
      [messageId, userId]
    );

    if (!message) {
      return res.status(404).json({ error: '消息不存在或无权访问' });
    }

    await database.run('DELETE FROM messages WHERE id = ?', [messageId]);

    res.json({ message: '消息删除成功' });
  } catch (error) {
    console.error('删除消息错误:', error);
    res.status(500).json({ error: '删除消息失败' });
  }
});

// 获取用户的通知设置
router.get('/notification-settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    let settings = await database.get(
      'SELECT * FROM user_notification_settings WHERE user_id = ?',
      [userId]
    );

    // 如果用户没有设置，创建默认设置
    if (!settings) {
      await database.run(`
        INSERT INTO user_notification_settings (
          user_id, email_notifications, task_notifications, 
          project_notifications, document_notifications, 
          system_notifications, comment_notifications
        ) VALUES (?, 1, 1, 1, 1, 1, 1)
      `, [userId]);

      settings = await database.get(
        'SELECT * FROM user_notification_settings WHERE user_id = ?',
        [userId]
      );
    }

    res.json(settings);
  } catch (error) {
    console.error('获取通知设置错误:', error);
    res.status(500).json({ error: '获取通知设置失败' });
  }
});

// 更新用户的通知设置
router.put('/notification-settings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      email_notifications,
      task_notifications,
      project_notifications,
      document_notifications,
      system_notifications,
      comment_notifications
    } = req.body;

    // 检查用户是否已有设置
    const existingSettings = await database.get(
      'SELECT * FROM user_notification_settings WHERE user_id = ?',
      [userId]
    );

    if (existingSettings) {
      // 更新现有设置
      const updateFields = [];
      const updateValues = [];

      if (email_notifications !== undefined) {
        updateFields.push('email_notifications = ?');
        updateValues.push(email_notifications ? 1 : 0);
      }
      if (task_notifications !== undefined) {
        updateFields.push('task_notifications = ?');
        updateValues.push(task_notifications ? 1 : 0);
      }
      if (project_notifications !== undefined) {
        updateFields.push('project_notifications = ?');
        updateValues.push(project_notifications ? 1 : 0);
      }
      if (document_notifications !== undefined) {
        updateFields.push('document_notifications = ?');
        updateValues.push(document_notifications ? 1 : 0);
      }
      if (system_notifications !== undefined) {
        updateFields.push('system_notifications = ?');
        updateValues.push(system_notifications ? 1 : 0);
      }
      if (comment_notifications !== undefined) {
        updateFields.push('comment_notifications = ?');
        updateValues.push(comment_notifications ? 1 : 0);
      }

      if (updateFields.length > 0) {
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(userId);

        await database.run(`
          UPDATE user_notification_settings 
          SET ${updateFields.join(', ')} 
          WHERE user_id = ?
        `, updateValues);
      }
    } else {
      // 创建新设置
      await database.run(`
        INSERT INTO user_notification_settings (
          user_id, email_notifications, task_notifications,
          project_notifications, document_notifications,
          system_notifications, comment_notifications
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        email_notifications ? 1 : 0,
        task_notifications ? 1 : 0,
        project_notifications ? 1 : 0,
        document_notifications ? 1 : 0,
        system_notifications ? 1 : 0,
        comment_notifications ? 1 : 0
      ]);
    }

    res.json({ message: '通知设置更新成功' });
  } catch (error) {
    console.error('更新通知设置错误:', error);
    res.status(500).json({ error: '更新通知设置失败' });
  }
});

// 创建系统消息(仅供管理员使用)
router.post('/system', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiver_id, title, message, message_type = 'system' } = req.body;

    if (!receiver_id || !message) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const result = await database.run(`
      INSERT INTO messages (sender_id, receiver_id, title, message, message_type)
      VALUES (?, ?, ?, ?, ?)
    `, [senderId, receiver_id, title || '系统通知', message, message_type]);

    res.status(201).json({
      message: '消息发送成功',
      messageId: result.id
    });
  } catch (error) {
    console.error('发送系统消息错误:', error);
    res.status(500).json({ error: '发送系统消息失败' });
  }
});

module.exports = router;
