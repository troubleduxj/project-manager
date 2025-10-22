const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../database/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, role = 'client' } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ error: '用户名、邮箱和密码都是必填项' });
    }

    // 检查用户是否已存在
    const existingUser = await database.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({ error: '用户名或邮箱已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const result = await database.run(`
      INSERT INTO users (username, email, password, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `, [username, email, hashedPassword, fullName, role]);

    res.status(201).json({
      message: '用户注册成功',
      userId: result.id
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码都是必填项' });
    }

    // 查找用户
    const user = await database.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;

    res.json({
      message: '登录成功',
      token,
      user: userInfo
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 验证token中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '访问令牌无效' });
    }
    req.user = user;
    next();
  });
};

// 获取当前用户信息
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await database.get(
      'SELECT id, username, email, full_name, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json(user);

  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户信息
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('📥 收到更新请求:', {
      userId: req.user.userId,
      bodyKeys: Object.keys(req.body),
      avatarLength: req.body.avatar ? req.body.avatar.length : 0
    });

    const { fullName, email, username, avatar } = req.body;
    const userId = req.user.userId;

    // 构建动态更新语句
    const updates = [];
    const params = [];

    if (username !== undefined) {
      console.log('🔄 更新用户名:', username);
      // 检查用户名是否已被使用
      const existingUser = await database.get('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
      if (existingUser) {
        return res.status(400).json({ error: '该用户名已被使用' });
      }
      updates.push('username = ?');
      params.push(username);
    }

    if (fullName !== undefined) {
      console.log('🔄 更新全名:', fullName);
      updates.push('full_name = ?');
      params.push(fullName);
    }

    if (email !== undefined) {
      console.log('🔄 更新邮箱:', email);
      updates.push('email = ?');
      params.push(email);
    }

    if (avatar !== undefined) {
      console.log('🔄 更新头像: 长度', avatar.length, '字符');
      updates.push('avatar = ?');
      params.push(avatar);
    }

    if (updates.length === 0) {
      console.log('❌ 没有要更新的字段');
      return res.status(400).json({ error: '没有要更新的字段' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(userId);

    console.log('🔧 执行SQL:', `UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
    console.log('🔧 参数数量:', params.length);

    await database.run(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = ?
    `, params);

    console.log('✅ 用户信息更新成功');
    res.json({ message: '用户信息更新成功' });

  } catch (error) {
    console.error('❌❌❌ 更新用户信息错误 ❌❌❌');
    console.error('错误类型:', error.constructor.name);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    console.error('请求体:', JSON.stringify(req.body).substring(0, 200));
    res.status(500).json({ 
      error: '更新用户信息失败',
      details: error.message,
      type: error.constructor.name
    });
  }
});

// 修改密码
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: '当前密码和新密码都是必填项' });
    }

    // 获取当前用户
    const user = await database.get('SELECT password FROM users WHERE id = ?', [userId]);
    
    // 验证当前密码
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '当前密码错误' });
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await database.run(`
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [hashedNewPassword, userId]);

    res.json({ message: '密码修改成功' });

  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ error: '修改密码失败' });
  }
});

// 获取所有用户（仅管理员）
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以查看用户列表' });
    }

    const users = await database.all(`
      SELECT id, username, email, full_name, role, created_at, 
             DATETIME(created_at, 'localtime') as created_at_local,
             CASE 
               WHEN created_at > datetime('now', '-1 day') THEN datetime(created_at, 'localtime')
               ELSE NULL 
             END as last_login
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(users);

  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

// 创建用户（仅管理员）
router.post('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以创建用户' });
    }

    const { username, password, email, full_name, role = 'client' } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: '用户名、密码和邮箱是必填项' });
    }

    // 检查用户名是否已存在
    const existingUser = await database.get('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    // 检查邮箱是否已存在
    const existingEmail = await database.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail) {
      return res.status(400).json({ error: '邮箱已被使用' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const result = await database.run(`
      INSERT INTO users (username, password, email, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `, [username, hashedPassword, email, full_name, role]);

    res.status(201).json({
      message: '用户创建成功',
      userId: result.id
    });

  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({ error: '创建用户失败' });
  }
});

// 更新用户（仅管理员）
router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以更新用户' });
    }

    const userId = req.params.id;
    const { username, email, full_name, role, password, status } = req.body;

    // 检查用户是否存在
    const existingUser = await database.get('SELECT id FROM users WHERE id = ?', [userId]);
    if (!existingUser) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 检查用户名是否被其他用户使用
    if (username) {
      const userWithSameName = await database.get('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
      if (userWithSameName) {
        return res.status(400).json({ error: '用户名已被其他用户使用' });
      }
    }

    // 检查邮箱是否被其他用户使用
    if (email) {
      const userWithSameEmail = await database.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
      if (userWithSameEmail) {
        return res.status(400).json({ error: '邮箱已被其他用户使用' });
      }
    }

    // 构建更新语句
    let updateFields = [];
    let updateValues = [];

    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (full_name !== undefined) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: '没有提供要更新的字段' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(userId);

    await database.run(`
      UPDATE users SET ${updateFields.join(', ')} WHERE id = ?
    `, updateValues);

    res.json({ message: '用户更新成功' });

  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ error: '更新用户失败' });
  }
});

// 删除用户（仅管理员）
router.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以删除用户' });
    }

    const userId = req.params.id;

    // 不能删除自己
    if (userId == req.user.userId) {
      return res.status(400).json({ error: '不能删除当前登录的用户' });
    }

    // 检查用户是否存在
    const existingUser = await database.get('SELECT id FROM users WHERE id = ?', [userId]);
    if (!existingUser) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 删除用户
    await database.run('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: '用户删除成功' });

  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ error: '删除用户失败' });
  }
});

// 重置用户密码（仅管理员）
router.post('/users/:id/reset-password', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以重置密码' });
    }

    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: '密码长度至少为6位' });
    }

    // 检查用户是否存在
    const existingUser = await database.get('SELECT id FROM users WHERE id = ?', [userId]);
    if (!existingUser) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await database.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, userId]
    );

    console.log(`管理员 ${req.user.username} 重置了用户 ${userId} 的密码`);
    res.json({ message: '密码重置成功' });

  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({ error: '重置密码失败' });
  }
});

// 获取用户通知设置
router.get('/users/:id/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 权限检查：只有管理员或用户本人可以查看通知设置
    if (req.user.role !== 'admin' && req.user.userId != userId) {
      return res.status(403).json({ error: '无权查看此用户的通知设置' });
    }

    let settings = await database.get(
      'SELECT * FROM user_notification_settings WHERE user_id = ?',
      [userId]
    );

    // 如果没有设置，创建默认设置
    if (!settings) {
      await database.run(`
        INSERT INTO user_notification_settings (user_id)
        VALUES (?)
      `, [userId]);
      
      settings = await database.get(
        'SELECT * FROM user_notification_settings WHERE user_id = ?',
        [userId]
      );
    }

    res.json(settings);

  } catch (error) {
    console.error('获取用户通知设置错误:', error);
    res.status(500).json({ error: '获取用户通知设置失败' });
  }
});

// 更新用户通知设置
router.put('/users/:id/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 权限检查：只有管理员或用户本人可以更新通知设置
    if (req.user.role !== 'admin' && req.user.userId != userId) {
      return res.status(403).json({ error: '无权修改此用户的通知设置' });
    }

    const {
      email_notifications,
      task_notifications,
      project_notifications,
      document_notifications,
      system_notifications,
      notification_frequency,
      quiet_hours_start,
      quiet_hours_end
    } = req.body;

    // 检查用户是否存在
    const user = await database.get('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 检查是否已有设置
    const existingSettings = await database.get(
      'SELECT id FROM user_notification_settings WHERE user_id = ?',
      [userId]
    );

    if (existingSettings) {
      // 更新现有设置
      await database.run(`
        UPDATE user_notification_settings 
        SET email_notifications = ?, task_notifications = ?, project_notifications = ?,
            document_notifications = ?, system_notifications = ?, notification_frequency = ?,
            quiet_hours_start = ?, quiet_hours_end = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [
        email_notifications, task_notifications, project_notifications,
        document_notifications, system_notifications, notification_frequency,
        quiet_hours_start, quiet_hours_end, userId
      ]);
    } else {
      // 创建新设置
      await database.run(`
        INSERT INTO user_notification_settings 
        (user_id, email_notifications, task_notifications, project_notifications,
         document_notifications, system_notifications, notification_frequency,
         quiet_hours_start, quiet_hours_end)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, email_notifications, task_notifications, project_notifications,
        document_notifications, system_notifications, notification_frequency,
        quiet_hours_start, quiet_hours_end
      ]);
    }

    res.json({ message: '通知设置更新成功' });

  } catch (error) {
    console.error('更新用户通知设置错误:', error);
    res.status(500).json({ error: '更新用户通知设置失败' });
  }
});

// 获取所有用户（仅管理员）
router.get('/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '未提供访问令牌' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await database.get('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以查看用户列表' });
    }

    const users = await database.all(`
      SELECT id, username, email, full_name, role, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(users);

  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

// 创建用户（仅管理员）
router.post('/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '未提供访问令牌' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUser = await database.get('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以创建用户' });
    }

    const { username, email, password, full_name, role = 'client' } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ error: '用户名、邮箱和密码都是必填项' });
    }

    // 检查用户是否已存在
    const existingUser = await database.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({ error: '用户名或邮箱已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const result = await database.run(`
      INSERT INTO users (username, email, password, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `, [username, email, hashedPassword, full_name, role]);

    res.status(201).json({
      message: '用户创建成功',
      userId: result.lastID
    });

  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({ error: '创建用户失败' });
  }
});

// 更新用户（仅管理员）
router.put('/users/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '未提供访问令牌' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUser = await database.get('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以更新用户' });
    }

    const userId = req.params.id;
    const { username, email, full_name, role, password } = req.body;

    // 检查用户是否存在
    const existingUser = await database.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!existingUser) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 检查用户名和邮箱是否被其他用户使用
    if (username || email) {
      const duplicateUser = await database.get(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
        [username || existingUser.username, email || existingUser.email, userId]
      );

      if (duplicateUser) {
        return res.status(400).json({ error: '用户名或邮箱已被其他用户使用' });
      }
    }

    // 构建更新语句
    let updateFields = [];
    let updateValues = [];

    if (username) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (full_name) {
      updateFields.push('full_name = ?');
      updateValues.push(full_name);
    }
    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: '没有提供要更新的字段' });
    }

    updateValues.push(userId);

    await database.run(`
      UPDATE users SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    res.json({ message: '用户更新成功' });

  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ error: '更新用户失败' });
  }
});

// 删除用户（仅管理员）
router.delete('/users/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '未提供访问令牌' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const adminUser = await database.get('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以删除用户' });
    }

    const userId = req.params.id;

    // 检查用户是否存在
    const existingUser = await database.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!existingUser) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 不能删除自己
    if (parseInt(userId) === decoded.userId) {
      return res.status(400).json({ error: '不能删除自己的账户' });
    }

    // 删除用户
    await database.run('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: '用户删除成功' });

  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ error: '删除用户失败' });
  }
});

module.exports = router;
