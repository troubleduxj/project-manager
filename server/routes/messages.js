const express = require('express');
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取项目消息列表
router.get('/project/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { role, userId } = req.user;

    // 权限检查
    const project = await database.get('SELECT client_id, manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (role !== 'admin' && project.client_id !== userId && project.manager_id !== userId) {
      return res.status(403).json({ error: '无权访问此项目消息' });
    }

    const messages = await database.all(`
      SELECT m.*, u.full_name as sender_name, u.role as sender_role
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.project_id = ?
      ORDER BY m.created_at ASC
    `, [projectId]);

    // 标记消息为已读
    await database.run(`
      UPDATE messages 
      SET is_read = 1 
      WHERE project_id = ? AND sender_id != ?
    `, [projectId, userId]);

    res.json(messages);

  } catch (error) {
    console.error('获取消息列表错误:', error);
    res.status(500).json({ error: '获取消息列表失败' });
  }
});

// 发送消息
router.post('/project/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { role, userId } = req.user;
    const { message, messageType = 'text' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: '消息内容不能为空' });
    }

    // 权限检查
    const project = await database.get('SELECT client_id, manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (role !== 'admin' && project.client_id !== userId && project.manager_id !== userId) {
      return res.status(403).json({ error: '无权在此项目发送消息' });
    }

    const result = await database.run(`
      INSERT INTO messages (project_id, sender_id, message, message_type)
      VALUES (?, ?, ?, ?)
    `, [projectId, userId, message.trim(), messageType]);

    // 获取刚发送的消息详情
    const newMessage = await database.get(`
      SELECT m.*, u.full_name as sender_name, u.role as sender_role
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `, [result.id]);

    res.status(201).json({
      message: '消息发送成功',
      data: newMessage
    });

  } catch (error) {
    console.error('发送消息错误:', error);
    res.status(500).json({ error: '发送消息失败' });
  }
});

// 获取未读消息数量
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let query, params;

    if (role === 'admin') {
      // 管理员查看所有项目的未读消息
      query = `
        SELECT COUNT(*) as count
        FROM messages m
        JOIN projects p ON m.project_id = p.id
        WHERE m.sender_id != ? AND m.is_read = 0
      `;
      params = [userId];
    } else {
      // 客户只查看自己项目的未读消息
      query = `
        SELECT COUNT(*) as count
        FROM messages m
        JOIN projects p ON m.project_id = p.id
        WHERE p.client_id = ? AND m.sender_id != ? AND m.is_read = 0
      `;
      params = [userId, userId];
    }

    const result = await database.get(query, params);
    res.json({ unreadCount: result.count });

  } catch (error) {
    console.error('获取未读消息数量错误:', error);
    res.status(500).json({ error: '获取未读消息数量失败' });
  }
});

// 获取最近消息
router.get('/recent', authenticateToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    const limit = parseInt(req.query.limit) || 10;
    let query, params;

    if (role === 'admin') {
      // 管理员查看所有项目的最近消息
      query = `
        SELECT m.*, u.full_name as sender_name, u.role as sender_role,
               p.name as project_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        JOIN projects p ON m.project_id = p.id
        ORDER BY m.created_at DESC
        LIMIT ?
      `;
      params = [limit];
    } else {
      // 客户只查看自己项目的最近消息
      query = `
        SELECT m.*, u.full_name as sender_name, u.role as sender_role,
               p.name as project_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        JOIN projects p ON m.project_id = p.id
        WHERE p.client_id = ?
        ORDER BY m.created_at DESC
        LIMIT ?
      `;
      params = [userId, limit];
    }

    const messages = await database.all(query, params);
    res.json(messages);

  } catch (error) {
    console.error('获取最近消息错误:', error);
    res.status(500).json({ error: '获取最近消息失败' });
  }
});

// 标记消息为已读
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { userId } = req.user;

    // 检查消息是否存在以及权限
    const message = await database.get(`
      SELECT m.*, p.client_id, p.manager_id
      FROM messages m
      JOIN projects p ON m.project_id = p.id
      WHERE m.id = ?
    `, [messageId]);

    if (!message) {
      return res.status(404).json({ error: '消息不存在' });
    }

    // 只能标记别人发给自己的消息为已读
    if (message.sender_id === userId) {
      return res.status(400).json({ error: '不能标记自己的消息为已读' });
    }

    await database.run('UPDATE messages SET is_read = 1 WHERE id = ?', [messageId]);

    res.json({ message: '消息已标记为已读' });

  } catch (error) {
    console.error('标记消息已读错误:', error);
    res.status(500).json({ error: '标记消息已读失败' });
  }
});

// 删除消息（仅发送者或管理员）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const messageId = req.params.id;
    const { role, userId } = req.user;

    const message = await database.get('SELECT * FROM messages WHERE id = ?', [messageId]);
    if (!message) {
      return res.status(404).json({ error: '消息不存在' });
    }

    // 权限检查：只有发送者或管理员可以删除
    if (role !== 'admin' && message.sender_id !== userId) {
      return res.status(403).json({ error: '无权删除此消息' });
    }

    await database.run('DELETE FROM messages WHERE id = ?', [messageId]);

    res.json({ message: '消息删除成功' });

  } catch (error) {
    console.error('删除消息错误:', error);
    res.status(500).json({ error: '删除消息失败' });
  }
});

// 获取项目参与者列表（用于@功能）
router.get('/project/:id/participants', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { role, userId } = req.user;

    // 权限检查
    const project = await database.get('SELECT client_id, manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (role !== 'admin' && project.client_id !== userId && project.manager_id !== userId) {
      return res.status(403).json({ error: '无权访问此项目参与者' });
    }

    const participants = await database.all(`
      SELECT DISTINCT u.id, u.username, u.full_name, u.role
      FROM users u
      WHERE u.id = ? OR u.id = ?
      ORDER BY u.role DESC, u.full_name ASC
    `, [project.client_id, project.manager_id]);

    res.json(participants);

  } catch (error) {
    console.error('获取项目参与者错误:', error);
    res.status(500).json({ error: '获取项目参与者失败' });
  }
});

module.exports = router;
