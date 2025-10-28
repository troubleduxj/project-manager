const express = require('express');
const router = express.Router();
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// ==================== 项目成员管理 ====================

// 获取项目成员列表
router.get('/members/:projectId?', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    let query = 'SELECT * FROM project_members';
    let params = [];
    
    if (projectId && projectId !== 'all') {
      query += ' WHERE project_id = ?';
      params.push(projectId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const members = await database.all(query, params);
    res.json(members);
  } catch (error) {
    console.error('获取项目成员失败:', error);
    res.status(500).json({ error: '获取项目成员失败' });
  }
});

// 添加项目成员
router.post('/members', authenticateToken, async (req, res) => {
  try {
    const { project_id, user_id, name, role, department, phone, email, join_date, status } = req.body;
    
    if (!project_id || !name) {
      return res.status(400).json({ error: '项目ID和成员姓名是必填项' });
    }
    
    const result = await database.run(`
      INSERT INTO project_members (project_id, user_id, name, role, department, phone, email, join_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [project_id, user_id, name, role, department, phone, email, join_date, status || 'active']);
    
    const newMember = await database.get('SELECT * FROM project_members WHERE id = ?', [result.lastID]);
    res.status(201).json(newMember);
  } catch (error) {
    console.error('添加项目成员失败:', error);
    res.status(500).json({ error: '添加项目成员失败' });
  }
});

// 更新项目成员
router.put('/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, name, role, department, phone, email, join_date, status } = req.body;
    
    await database.run(`
      UPDATE project_members 
      SET user_id = ?, name = ?, role = ?, department = ?, phone = ?, email = ?, join_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [user_id, name, role, department, phone, email, join_date, status, id]);
    
    const updatedMember = await database.get('SELECT * FROM project_members WHERE id = ?', [id]);
    res.json(updatedMember);
  } catch (error) {
    console.error('更新项目成员失败:', error);
    res.status(500).json({ error: '更新项目成员失败' });
  }
});

// 删除项目成员
router.delete('/members/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await database.run('DELETE FROM project_members WHERE id = ?', [id]);
    res.json({ message: '项目成员已删除' });
  } catch (error) {
    console.error('删除项目成员失败:', error);
    res.status(500).json({ error: '删除项目成员失败' });
  }
});

// ==================== 服务器信息管理 ====================

// 获取服务器列表
router.get('/servers/:projectId?', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    let query = 'SELECT * FROM project_servers';
    let params = [];
    
    if (projectId && projectId !== 'all') {
      query += ' WHERE project_id = ?';
      params.push(projectId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const servers = await database.all(query, params);
    res.json(servers);
  } catch (error) {
    console.error('获取服务器列表失败:', error);
    res.status(500).json({ error: '获取服务器列表失败' });
  }
});

// 添加服务器
router.post('/servers', authenticateToken, async (req, res) => {
  try {
    const { project_id, name, ip, type, cpu, memory, disk, status, purpose, remark } = req.body;
    
    if (!project_id || !name) {
      return res.status(400).json({ error: '项目ID和服务器名称是必填项' });
    }
    
    const result = await database.run(`
      INSERT INTO project_servers (project_id, name, ip, type, cpu, memory, disk, status, purpose, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [project_id, name, ip, type, cpu, memory, disk, status || 'running', purpose, remark]);
    
    const newServer = await database.get('SELECT * FROM project_servers WHERE id = ?', [result.lastID]);
    res.status(201).json(newServer);
  } catch (error) {
    console.error('添加服务器失败:', error);
    res.status(500).json({ error: '添加服务器失败' });
  }
});

// 更新服务器
router.put('/servers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ip, type, cpu, memory, disk, status, purpose, remark } = req.body;
    
    await database.run(`
      UPDATE project_servers 
      SET name = ?, ip = ?, type = ?, cpu = ?, memory = ?, disk = ?, status = ?, purpose = ?, remark = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, ip, type, cpu, memory, disk, status, purpose, remark, id]);
    
    const updatedServer = await database.get('SELECT * FROM project_servers WHERE id = ?', [id]);
    res.json(updatedServer);
  } catch (error) {
    console.error('更新服务器失败:', error);
    res.status(500).json({ error: '更新服务器失败' });
  }
});

// 删除服务器
router.delete('/servers/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await database.run('DELETE FROM project_servers WHERE id = ?', [id]);
    res.json({ message: '服务器已删除' });
  } catch (error) {
    console.error('删除服务器失败:', error);
    res.status(500).json({ error: '删除服务器失败' });
  }
});

// ==================== 软件资料管理 ====================

// 获取软件资料列表
router.get('/resources/:projectId?', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    let query = 'SELECT * FROM project_resources';
    let params = [];
    
    if (projectId && projectId !== 'all') {
      query += ' WHERE project_id = ?';
      params.push(projectId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const resources = await database.all(query, params);
    res.json(resources);
  } catch (error) {
    console.error('获取软件资料失败:', error);
    res.status(500).json({ error: '获取软件资料失败' });
  }
});

// 添加软件资料
router.post('/resources', authenticateToken, async (req, res) => {
  try {
    const { project_id, name, version, type, license, update_date, description, download_url } = req.body;
    
    if (!project_id || !name) {
      return res.status(400).json({ error: '项目ID和资料名称是必填项' });
    }
    
    const result = await database.run(`
      INSERT INTO project_resources (project_id, name, version, type, license, update_date, description, download_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [project_id, name, version, type, license, update_date, description, download_url]);
    
    const newResource = await database.get('SELECT * FROM project_resources WHERE id = ?', [result.lastID]);
    res.status(201).json(newResource);
  } catch (error) {
    console.error('添加软件资料失败:', error);
    res.status(500).json({ error: '添加软件资料失败' });
  }
});

// 更新软件资料
router.put('/resources/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, version, type, license, update_date, description, download_url } = req.body;
    
    await database.run(`
      UPDATE project_resources 
      SET name = ?, version = ?, type = ?, license = ?, update_date = ?, description = ?, download_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, version, type, license, update_date, description, download_url, id]);
    
    const updatedResource = await database.get('SELECT * FROM project_resources WHERE id = ?', [id]);
    res.json(updatedResource);
  } catch (error) {
    console.error('更新软件资料失败:', error);
    res.status(500).json({ error: '更新软件资料失败' });
  }
});

// 删除软件资料
router.delete('/resources/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await database.run('DELETE FROM project_resources WHERE id = ?', [id]);
    res.json({ message: '软件资料已删除' });
  } catch (error) {
    console.error('删除软件资料失败:', error);
    res.status(500).json({ error: '删除软件资料失败' });
  }
});

module.exports = router;

