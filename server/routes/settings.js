const express = require('express');
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取系统设置（所有已认证用户可读取）
router.get('/', authenticateToken, async (req, res) => {
  try {
    // 所有已认证用户都可以读取系统设置
    const settings = await database.all('SELECT * FROM settings ORDER BY key');
    
    // 转换为键值对格式
    const settingsObj = {};
    settings.forEach(setting => {
      try {
        settingsObj[setting.key] = JSON.parse(setting.value);
      } catch (e) {
        settingsObj[setting.key] = setting.value;
      }
    });

    res.json(settingsObj);

  } catch (error) {
    console.error('获取系统设置错误:', error);
    res.status(500).json({ error: '获取系统设置失败' });
  }
});

// 获取单个设置（所有已认证用户可读取）
router.get('/:key', authenticateToken, async (req, res) => {
  try {
    // 所有已认证用户都可以读取系统设置
    const setting = await database.get('SELECT * FROM settings WHERE key = ?', [req.params.key]);
    
    if (!setting) {
      return res.status(404).json({ error: '设置项不存在' });
    }

    let value;
    try {
      value = JSON.parse(setting.value);
    } catch (e) {
      value = setting.value;
    }

    res.json({
      key: setting.key,
      value: value,
      description: setting.description,
      updated_at: setting.updated_at
    });

  } catch (error) {
    console.error('获取设置项错误:', error);
    res.status(500).json({ error: '获取设置项失败' });
  }
});

// 更新系统设置（仅管理员）
router.put('/:key', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以修改系统设置' });
    }

    const { value, description } = req.body;
    const key = req.params.key;

    if (value === undefined) {
      return res.status(400).json({ error: '设置值不能为空' });
    }

    // 将值转换为JSON字符串存储
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

    // 检查设置是否存在
    const existingSetting = await database.get('SELECT id FROM settings WHERE key = ?', [key]);

    if (existingSetting) {
      // 更新现有设置
      await database.run(`
        UPDATE settings 
        SET value = ?, description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE key = ?
      `, [valueStr, description, key]);
    } else {
      // 创建新设置
      await database.run(`
        INSERT INTO settings (key, value, description)
        VALUES (?, ?, ?)
      `, [key, valueStr, description]);
    }

    res.json({ message: '设置更新成功' });

  } catch (error) {
    console.error('更新设置错误:', error);
    res.status(500).json({ error: '更新设置失败' });
  }
});

// 批量更新系统设置（仅管理员）
router.put('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以修改系统设置' });
    }

    const settings = req.body;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: '设置数据格式错误' });
    }

    // 开始事务
    await database.run('BEGIN TRANSACTION');

    try {
      for (const [key, config] of Object.entries(settings)) {
        const { value, description } = config;
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

        // 检查设置是否存在
        const existingSetting = await database.get('SELECT id FROM settings WHERE key = ?', [key]);

        if (existingSetting) {
          // 更新现有设置
          await database.run(`
            UPDATE settings 
            SET value = ?, description = ?, updated_at = CURRENT_TIMESTAMP
            WHERE key = ?
          `, [valueStr, description, key]);
        } else {
          // 创建新设置
          await database.run(`
            INSERT INTO settings (key, value, description)
            VALUES (?, ?, ?)
          `, [key, valueStr, description]);
        }
      }

      await database.run('COMMIT');
      res.json({ message: '设置批量更新成功' });

    } catch (error) {
      await database.run('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('批量更新设置错误:', error);
    res.status(500).json({ error: '批量更新设置失败' });
  }
});

// 删除设置项（仅管理员）
router.delete('/:key', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以删除系统设置' });
    }

    const key = req.params.key;

    // 检查设置是否存在
    const existingSetting = await database.get('SELECT id FROM settings WHERE key = ?', [key]);
    if (!existingSetting) {
      return res.status(404).json({ error: '设置项不存在' });
    }

    // 删除设置
    await database.run('DELETE FROM settings WHERE key = ?', [key]);

    res.json({ message: '设置删除成功' });

  } catch (error) {
    console.error('删除设置错误:', error);
    res.status(500).json({ error: '删除设置失败' });
  }
});

// 重置系统设置为默认值（仅管理员）
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以重置系统设置' });
    }

    // 默认设置
    const defaultSettings = [
      {
        key: 'system_name',
        value: '项目管理系统',
        description: '系统名称'
      },
      {
        key: 'system_logo',
        value: '/img/logo.png',
        description: '系统Logo路径'
      },
      {
        key: 'max_file_size',
        value: '10485760',
        description: '最大文件上传大小（字节）'
      },
      {
        key: 'allowed_file_types',
        value: JSON.stringify(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif']),
        description: '允许上传的文件类型'
      },
      {
        key: 'session_timeout',
        value: '24',
        description: '会话超时时间（小时）'
      },
      {
        key: 'enable_notifications',
        value: 'true',
        description: '是否启用通知功能'
      },
      {
        key: 'theme_color',
        value: '#1890ff',
        description: '主题颜色'
      },
      {
        key: 'backup_enabled',
        value: 'false',
        description: '是否启用自动备份'
      },
      {
        key: 'backup_interval',
        value: '24',
        description: '备份间隔（小时）'
      }
    ];

    // 清空现有设置
    await database.run('DELETE FROM settings');

    // 插入默认设置
    for (const setting of defaultSettings) {
      await database.run(`
        INSERT INTO settings (key, value, description)
        VALUES (?, ?, ?)
      `, [setting.key, setting.value, setting.description]);
    }

    res.json({ message: '系统设置已重置为默认值' });

  } catch (error) {
    console.error('重置设置错误:', error);
    res.status(500).json({ error: '重置设置失败' });
  }
});

// 获取系统统计信息（仅管理员）
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以查看系统统计' });
    }

    // 获取各种统计数据
    const [
      userCount,
      projectCount,
      taskCount,
      documentCount,
      completedTaskCount
    ] = await Promise.all([
      database.get('SELECT COUNT(*) as count FROM users'),
      database.get('SELECT COUNT(*) as count FROM projects'),
      database.get('SELECT COUNT(*) as count FROM project_progress'),
      database.get('SELECT COUNT(*) as count FROM documents'),
      database.get('SELECT COUNT(*) as count FROM project_progress WHERE status = "completed"')
    ]);

    // 获取最近7天的任务创建统计
    const recentTasks = await database.all(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM project_progress
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // 获取项目状态分布
    const projectStatus = await database.all(`
      SELECT status, COUNT(*) as count
      FROM projects
      GROUP BY status
    `);

    // 获取任务状态分布
    const taskStatus = await database.all(`
      SELECT status, COUNT(*) as count
      FROM project_progress
      GROUP BY status
    `);

    const stats = {
      overview: {
        totalUsers: userCount.count,
        totalProjects: projectCount.count,
        totalTasks: taskCount.count,
        totalDocuments: documentCount.count,
        completedTasks: completedTaskCount.count,
        taskCompletionRate: taskCount.count > 0 ? Math.round((completedTaskCount.count / taskCount.count) * 100) : 0
      },
      recentActivity: recentTasks,
      projectDistribution: projectStatus,
      taskDistribution: taskStatus
    };

    res.json(stats);

  } catch (error) {
    console.error('获取系统统计错误:', error);
    res.status(500).json({ error: '获取系统统计失败' });
  }
});

module.exports = router;
