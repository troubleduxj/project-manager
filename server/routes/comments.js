const express = require('express');
const router = express.Router();
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// 获取任务的所有评论
router.get('/task/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const comments = await database.all(`
      SELECT 
        tc.*,
        u.username,
        u.full_name,
        u.role
      FROM task_comments tc
      LEFT JOIN users u ON tc.user_id = u.id
      WHERE tc.task_id = ?
      ORDER BY tc.created_at ASC
    `, [taskId]);
    
    // 解析mentioned_users JSON字符串
    const commentsWithMentions = comments.map(comment => ({
      ...comment,
      mentioned_users: comment.mentioned_users ? JSON.parse(comment.mentioned_users) : []
    }));
    
    res.json(commentsWithMentions);
  } catch (error) {
    console.error('获取任务评论失败:', error);
    res.status(500).json({ error: '获取任务评论失败' });
  }
});

// 添加任务评论
router.post('/task/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, mentionedUsers = [] } = req.body;
    const userId = req.user.userId;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: '评论内容不能为空' });
    }
    
    // 插入评论
    const result = await database.run(`
      INSERT INTO task_comments (task_id, user_id, content, mentioned_users)
      VALUES (?, ?, ?, ?)
    `, [taskId, userId, content.trim(), JSON.stringify(mentionedUsers)]);
    
    // 获取刚插入的评论详情
    const newComment = await database.get(`
      SELECT 
        tc.*,
        u.username,
        u.full_name,
        u.role
      FROM task_comments tc
      LEFT JOIN users u ON tc.user_id = u.id
      WHERE tc.id = ?
    `, [result.lastID]);
    
    // 解析mentioned_users
    if (newComment) {
      newComment.mentioned_users = newComment.mentioned_users ? JSON.parse(newComment.mentioned_users) : [];
    }
    
    // TODO: 发送通知给被@的用户
    if (mentionedUsers.length > 0) {
      // 这里可以实现通知逻辑
      console.log('需要通知的用户:', mentionedUsers);
    }
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error('添加任务评论失败:', error);
    res.status(500).json({ error: '添加任务评论失败' });
  }
});

// 获取任务评论数量
router.get('/task/:taskId/count', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const result = await database.get(`
      SELECT COUNT(*) as count
      FROM task_comments
      WHERE task_id = ?
    `, [taskId]);
    
    res.json({ count: result.count });
  } catch (error) {
    console.error('获取任务评论数量失败:', error);
    res.status(500).json({ error: '获取任务评论数量失败' });
  }
});

// 删除评论（仅评论作者或管理员可删除）
router.delete('/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    // 检查评论是否存在及权限
    const comment = await database.get('SELECT * FROM task_comments WHERE id = ?', [commentId]);
    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }
    
    if (comment.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: '无权删除此评论' });
    }
    
    await database.run('DELETE FROM task_comments WHERE id = ?', [commentId]);
    
    res.json({ message: '评论删除成功' });
  } catch (error) {
    console.error('删除评论失败:', error);
    res.status(500).json({ error: '删除评论失败' });
  }
});

// 获取所有用户列表（用于@功能）
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await database.all(`
      SELECT id, username, full_name, role
      FROM users
      WHERE id != ?
      ORDER BY full_name ASC
    `, [req.user.userId]);
    
    res.json(users);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

module.exports = router;
