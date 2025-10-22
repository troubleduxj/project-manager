const express = require('express');
const router = express.Router();
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

/**
 * 获取系统统计信息（简化版，用于配置管理页面）
 */
router.get('/system/stats', authenticateToken, async (req, res) => {
  try {
    // 1. 用户总数
    const userCount = await database.get('SELECT COUNT(*) as total FROM users');
    
    // 2. 项目总数
    const projectCount = await database.get('SELECT COUNT(*) as total FROM projects');
    
    // 3. 文档统计（总数和总大小）
    const documentStats = await database.get(`
      SELECT 
        COUNT(*) as total,
        COALESCE(SUM(file_size), 0) as totalSize
      FROM documents
    `);
    
    // 4. 数据库文件大小和路径
    let dbSize = 0;
    let dbPath = 'N/A';
    try {
      const dbFilePath = path.join(__dirname, '..', 'project_management.db');
      if (fs.existsSync(dbFilePath)) {
        const stats = fs.statSync(dbFilePath);
        dbSize = stats.size;
        dbPath = dbFilePath;
      }
    } catch (error) {
      console.error('获取数据库文件大小失败:', error);
    }
    
    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };
    
    // 返回前端期望的格式
    const stats = {
      totalUsers: userCount.total || 0,
      totalProjects: projectCount.total || 0,
      totalDocuments: documentStats.total || 0,
      documentStorage: formatFileSize(documentStats.totalSize || 0),
      databaseSize: formatFileSize(dbSize),
      databasePath: dbPath
    };
    
    res.json(stats);
  } catch (error) {
    console.error('获取系统统计失败:', error);
    res.status(500).json({ error: '获取系统统计失败' });
  }
});

/**
 * 获取系统统计信息（详细版）
 * 仅管理员可访问
 */
router.get('/system', authenticateToken, async (req, res) => {
  try {
    // 权限检查：只有管理员可以查看系统统计
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权访问系统统计信息' });
    }

    // 1. 用户统计
    const userStats = await database.get('SELECT COUNT(*) as total FROM users');
    const usersByRole = await database.all(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);

    // 2. 任务统计（包含所有主任务和子任务）
    const taskStatsTotal = await database.get('SELECT COUNT(*) as total FROM project_progress');
    const tasksByStatus = await database.all(`
      SELECT status, COUNT(*) as count 
      FROM project_progress 
      GROUP BY status
    `);

    // 3. 文档统计
    const documentStats = await database.get(`
      SELECT 
        COUNT(*) as total,
        SUM(file_size) as totalSize
      FROM documents
    `);

    // 4. 数据库文件大小
    let dbSize = 0;
    try {
      const dbPath = path.join(__dirname, '../database/project_management.db');
      if (fs.existsSync(dbPath)) {
        const stats = fs.statSync(dbPath);
        dbSize = stats.size;
      }
    } catch (error) {
      console.error('获取数据库文件大小失败:', error);
    }

    // 5. 今日统计（最近24小时）
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const todayUsers = await database.get(
      'SELECT COUNT(*) as count FROM users WHERE created_at > ?',
      [oneDayAgo]
    );
    
    const todayTasks = await database.get(
      'SELECT COUNT(*) as count FROM project_progress WHERE created_at > ?',
      [oneDayAgo]
    );
    
    const todayDocuments = await database.get(
      'SELECT COUNT(*) as count FROM documents WHERE created_at > ?',
      [oneDayAgo]
    );

    // 组装响应数据
    const stats = {
      users: {
        total: userStats.total || 0,
        byRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item.count;
          return acc;
        }, {}),
        todayNew: todayUsers.count || 0
      },
      tasks: {
        total: taskStatsTotal.total || 0,
        byStatus: tasksByStatus.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
        todayNew: todayTasks.count || 0
      },
      documents: {
        total: documentStats.total || 0,
        totalSize: documentStats.totalSize || 0,
        todayNew: todayDocuments.count || 0
      },
      database: {
        size: dbSize,
        path: 'project_management.db'
      },
      timestamp: new Date().toISOString()
    };

    res.json(stats);

  } catch (error) {
    console.error('获取系统统计失败:', error);
    res.status(500).json({ error: '获取系统统计失败' });
  }
});

module.exports = router;

