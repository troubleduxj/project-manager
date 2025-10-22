const express = require('express');
const router = express.Router();
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

/**
 * 获取系统统计信息
 * 用于配置管理页面的系统统计卡片
 */
router.get('/stats', authenticateToken, async (req, res) => {
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
    
    console.log('📊 系统统计数据:', stats);
    res.json(stats);
  } catch (error) {
    console.error('获取系统统计失败:', error);
    res.status(500).json({ error: '获取系统统计失败' });
  }
});

module.exports = router;

