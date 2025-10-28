const express = require('express');
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const { 
  requireProjectManagement, 
  requireProjectView,
  requireAdmin 
} = require('../middleware/permissions');

const router = express.Router();

// 获取项目列表
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let query, params;

    if (role === 'admin') {
      // 管理员可以看到所有项目
      query = `
        SELECT p.*, 
               c.full_name as client_name,
               m.full_name as manager_name
        FROM projects p
        LEFT JOIN users c ON p.client_id = c.id
        LEFT JOIN users m ON p.manager_id = m.id
        ORDER BY p.created_at DESC
      `;
      params = [];
    } else if (role === 'project_manager') {
      // 项目经理只能看到自己管理的项目
      query = `
        SELECT p.*, 
               c.full_name as client_name,
               m.full_name as manager_name
        FROM projects p
        LEFT JOIN users c ON p.client_id = c.id
        LEFT JOIN users m ON p.manager_id = m.id
        WHERE p.manager_id = ?
        ORDER BY p.created_at DESC
      `;
      params = [userId];
    } else {
      // 普通用户只能看到自己的项目
      query = `
        SELECT p.*, 
               c.full_name as client_name,
               m.full_name as manager_name
        FROM projects p
        LEFT JOIN users c ON p.client_id = c.id
        LEFT JOIN users m ON p.manager_id = m.id
        WHERE p.client_id = ?
        ORDER BY p.created_at DESC
      `;
      params = [userId];
    }

    const projects = await database.all(query, params);
    res.json(projects);

  } catch (error) {
    console.error('获取项目列表错误:', error);
    res.status(500).json({ error: '获取项目列表失败' });
  }
});

// 获取单个项目详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { role, userId } = req.user;

    let query = `
      SELECT p.*, 
             c.full_name as client_name, c.email as client_email,
             m.full_name as manager_name, m.email as manager_email
      FROM projects p
      LEFT JOIN users c ON p.client_id = c.id
      LEFT JOIN users m ON p.manager_id = m.id
      WHERE p.id = ?
    `;

    const project = await database.get(query, [projectId]);

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    // 权限检查：客户只能查看自己的项目
    if (role !== 'admin' && project.client_id !== userId) {
      return res.status(403).json({ error: '无权访问此项目' });
    }

    // 获取项目任务
    const tasks = await database.all(`
      SELECT pt.*, u.full_name as assigned_name
      FROM project_progress pt
      LEFT JOIN users u ON pt.assigned_to = u.id
      WHERE pt.project_id = ? AND pt.parent_task_id IS NULL
      ORDER BY pt.created_at ASC
    `, [projectId]);

    project.tasks = tasks;

    res.json(project);

  } catch (error) {
    console.error('获取项目详情错误:', error);
    res.status(500).json({ error: '获取项目详情失败' });
  }
});

// 创建新项目（仅管理员）
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      clientId,
      managerId,  // 允许指定项目经理
      priority = 'medium',
      status = 'planning',
      type,
      startDate,
      endDate,
      budget,
      progress = 0,
      department,
      team,
      customer,
      isDefault = false
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: '项目名称是必填项' });
    }

    // 如果没有指定项目经理，默认为创建者
    const finalManagerId = managerId || req.user.userId;

    // 如果设置为默认项目,先将其他项目的默认状态取消
    if (isDefault) {
      await database.run('UPDATE projects SET is_default = 0');
    }

    const result = await database.run(`
      INSERT INTO projects (
        name, description, client_id, manager_id, priority, status, type,
        start_date, end_date, budget, progress, department, team, customer, is_default
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, description, clientId, finalManagerId, priority, status, type,
      startDate, endDate, budget, progress, department, team, customer, isDefault ? 1 : 0
    ]);

    // 获取刚创建的项目完整信息
    const newProject = await database.get(`
      SELECT p.*, 
             c.full_name as client_name,
             m.full_name as manager_name
      FROM projects p
      LEFT JOIN users c ON p.client_id = c.id
      LEFT JOIN users m ON p.manager_id = m.id
      WHERE p.id = ?
    `, [result.id]);

    res.status(201).json({
      message: '项目创建成功',
      projectId: result.id,
      ...newProject  // 返回完整的项目信息
    });

  } catch (error) {
    console.error('创建项目错误:', error);
    res.status(500).json({ error: '创建项目失败' });
  }
});

// 更新项目
router.put('/:id', authenticateToken, requireProjectManagement, async (req, res) => {
  try {
    const projectId = req.params.id;

    // 检查项目是否存在
    const project = await database.get('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    const {
      name,
      description,
      status,
      priority,
      type,
      startDate,
      endDate,
      budget,
      progress,
      managerId,  // 允许修改项目经理
      department,
      team,
      customer,
      isDefault
    } = req.body;

    // 如果设置为默认项目,先将其他项目的默认状态取消
    if (isDefault) {
      await database.run('UPDATE projects SET is_default = 0 WHERE id != ?', [projectId]);
    }

    // 构建更新字段
    let updateFields = [];
    let values = [];
    
    if (name !== undefined) { updateFields.push('name = ?'); values.push(name); }
    if (description !== undefined) { updateFields.push('description = ?'); values.push(description); }
    if (status !== undefined) { updateFields.push('status = ?'); values.push(status); }
    if (priority !== undefined) { updateFields.push('priority = ?'); values.push(priority); }
    if (type !== undefined) { updateFields.push('type = ?'); values.push(type); }
    if (startDate !== undefined) { updateFields.push('start_date = ?'); values.push(startDate); }
    if (endDate !== undefined) { updateFields.push('end_date = ?'); values.push(endDate); }
    if (budget !== undefined) { updateFields.push('budget = ?'); values.push(budget); }
    if (progress !== undefined) { updateFields.push('progress = ?'); values.push(progress); }
    if (managerId !== undefined) { updateFields.push('manager_id = ?'); values.push(managerId); }
    if (department !== undefined) { updateFields.push('department = ?'); values.push(department); }
    if (team !== undefined) { updateFields.push('team = ?'); values.push(team); }
    if (customer !== undefined) { updateFields.push('customer = ?'); values.push(customer); }
    if (isDefault !== undefined) { updateFields.push('is_default = ?'); values.push(isDefault ? 1 : 0); }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: '没有要更新的字段' });
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(projectId);

    console.log('📝 更新项目 ID:', projectId);
    console.log('📝 更新字段:', updateFields);
    console.log('📝 更新值:', values);

    await database.run(`
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, values);

    res.json({ message: '项目更新成功' });

  } catch (error) {
    console.error('❌ 更新项目错误:', error);
    console.error('❌ 错误详情:', error.message);
    res.status(500).json({ 
      error: '更新项目失败',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 删除项目（仅管理员）
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const projectId = req.params.id;

    // 检查项目是否存在
    const project = await database.get('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    // 删除相关数据
    await database.run('DELETE FROM project_progress WHERE project_id = ?', [projectId]);
    await database.run('DELETE FROM documents WHERE project_id = ?', [projectId]);
    await database.run('DELETE FROM messages WHERE project_id = ?', [projectId]);
    await database.run('DELETE FROM projects WHERE id = ?', [projectId]);

    res.json({ message: '项目删除成功' });

  } catch (error) {
    console.error('删除项目错误:', error);
    res.status(500).json({ error: '删除项目失败' });
  }
});

// 获取项目进度
router.get('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { role, userId } = req.user;

    // 权限检查
    const project = await database.get('SELECT client_id, manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (role !== 'admin' && project.client_id !== userId && project.manager_id !== userId) {
      return res.status(403).json({ error: '无权访问此项目进度' });
    }

    // ✅ 修复：返回所有任务（包括子任务），前端会自己筛选主任务和子任务
    const tasks = await database.all(`
      SELECT 
        pt.id,
        pt.project_id,
        pt.task_name as title,
        pt.description,
        pt.status,
        pt.progress,
        pt.assigned_to,
        pt.start_date,
        pt.due_date,
        pt.completed_at,
        pt.created_at,
        pt.updated_at,
        pt.parent_task_id,
        u.full_name as assigned_name
      FROM project_progress pt
      LEFT JOIN users u ON pt.assigned_to = u.id
      WHERE pt.project_id = ?
      ORDER BY 
        CASE WHEN pt.parent_task_id IS NULL THEN pt.id ELSE pt.parent_task_id END,
        pt.parent_task_id NULLS FIRST,
        pt.created_at ASC
    `, [projectId]);

    console.log(`📊 返回项目 ${projectId} 的任务数据:`, {
      总任务数: tasks.length,
      主任务数: tasks.filter(t => !t.parent_task_id).length,
      子任务数: tasks.filter(t => t.parent_task_id).length
    });

    res.json(tasks);

  } catch (error) {
    console.error('获取项目进度错误:', error);
    res.status(500).json({ error: '获取项目进度失败' });
  }
});

// 添加项目任务
router.post('/:id/tasks', authenticateToken, requireProjectManagement, async (req, res) => {
  try {
    const projectId = req.params.id;

    // 检查项目是否存在
    const project = await database.get('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    const {
      taskName,
      description,
      assignedTo,
      startDate,
      dueDate
    } = req.body;

    if (!taskName) {
      return res.status(400).json({ error: '任务名称是必填项' });
    }

    const result = await database.run(`
      INSERT INTO project_progress (project_id, task_name, description, assigned_to, start_date, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [projectId, taskName, description, assignedTo, startDate, dueDate]);

    res.status(201).json({
      message: '任务添加成功',
      taskId: result.id
    });

  } catch (error) {
    console.error('添加任务错误:', error);
    res.status(500).json({ error: '添加任务失败' });
  }
});

// 更新任务状态
router.put('/:id/tasks/:taskId', authenticateToken, requireProjectManagement, async (req, res) => {
  try {
    const { id: projectId, taskId } = req.params;

    // 检查项目是否存在
    const project = await database.get('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    const {
      taskName,
      description,
      status,
      progress,
      assignedTo,
      startDate,
      dueDate
    } = req.body;

    const completedAt = status === 'completed' ? new Date().toISOString() : null;

    await database.run(`
      UPDATE project_progress 
      SET task_name = ?, description = ?, status = ?, progress = ?, 
          assigned_to = ?, start_date = ?, due_date = ?, completed_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND project_id = ?
    `, [taskName, description, status, progress, assignedTo, startDate, dueDate, completedAt, taskId, projectId]);

    // 更新项目整体进度
    const tasks = await database.all('SELECT progress FROM project_progress WHERE project_id = ?', [projectId]);
    const totalProgress = tasks.length > 0 
      ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
      : 0;

    await database.run('UPDATE projects SET progress = ? WHERE id = ?', [totalProgress, projectId]);

    res.json({ message: '任务更新成功' });

  } catch (error) {
    console.error('更新任务错误:', error);
    res.status(500).json({ error: '更新任务失败' });
  }
});

// 删除任务
router.delete('/:projectId/tasks/:taskId', authenticateToken, requireProjectManagement, async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    
    // 检查项目是否存在
    const project = await database.get('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    // 先删除所有子任务
    await database.run('DELETE FROM project_progress WHERE parent_task_id = ?', [taskId]);
    
    // 删除主任务
    const result = await database.run('DELETE FROM project_progress WHERE id = ? AND project_id = ?', [taskId, projectId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: '任务不存在' });
    }

    res.json({ message: '任务删除成功' });

  } catch (error) {
    console.error('删除任务错误:', error);
    res.status(500).json({ error: '删除任务失败' });
  }
});

// 获取子任务列表
router.get('/:projectId/tasks/:taskId/subtasks', authenticateToken, async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    
    // 权限检查
    const project = await database.get('SELECT client_id, manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (req.user.role !== 'admin' && project.client_id !== req.user.userId && project.manager_id !== req.user.userId) {
      return res.status(403).json({ error: '无权访问此项目' });
    }

    const subtasks = await database.all(`
      SELECT st.*, u.full_name as assigned_name
      FROM project_progress st
      LEFT JOIN users u ON st.assigned_to = u.id
      WHERE st.project_id = ? AND st.parent_task_id = ?
      ORDER BY st.created_at ASC
    `, [projectId, taskId]);

    res.json(subtasks);

  } catch (error) {
    console.error('获取子任务列表错误:', error);
    res.status(500).json({ error: '获取子任务列表失败' });
  }
});

// 添加子任务
router.post('/:projectId/tasks/:taskId/subtasks', authenticateToken, async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { taskName, description, startDate, dueDate } = req.body;
    
    // 权限检查：使用自定义逻辑（因为路径参数名不是:id）
    const project = await database.get('SELECT manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    // 项目经理或管理员可以添加子任务
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({ error: '无权添加子任务' });
    }
    
    if (req.user.role === 'project_manager' && project.manager_id != req.user.userId) {
      return res.status(403).json({ error: '您只能管理自己负责的项目' });
    }

    // 检查父任务是否存在
    const parentTask = await database.get('SELECT id FROM project_progress WHERE id = ? AND project_id = ?', [taskId, projectId]);
    if (!parentTask) {
      return res.status(404).json({ error: '父任务不存在' });
    }

    const result = await database.run(`
      INSERT INTO project_progress (project_id, task_name, description, parent_task_id, assigned_to, start_date, due_date, status, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'todo', 0)
    `, [projectId, taskName, description, taskId, req.user.userId, startDate, dueDate]);

    res.status(201).json({
      message: '子任务添加成功',
      subtaskId: result.id
    });

  } catch (error) {
    console.error('添加子任务错误:', error);
    res.status(500).json({ error: '添加子任务失败' });
  }
});

// 更新子任务
router.put('/:projectId/tasks/:taskId/subtasks/:subtaskId', authenticateToken, async (req, res) => {
  try {
    const { projectId, taskId, subtaskId } = req.params;
    const { taskName, description, status, progress, startDate, dueDate } = req.body;
    
    // 权限检查
    const project = await database.get('SELECT manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    // 项目经理或管理员可以修改子任务
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({ error: '无权修改子任务' });
    }
    
    if (req.user.role === 'project_manager' && project.manager_id != req.user.userId) {
      return res.status(403).json({ error: '您只能管理自己负责的项目' });
    }

    // 检查子任务是否存在
    const subtask = await database.get('SELECT * FROM project_progress WHERE id = ? AND parent_task_id = ? AND project_id = ?', [subtaskId, taskId, projectId]);
    if (!subtask) {
      return res.status(404).json({ error: '子任务不存在' });
    }

    await database.run(`
      UPDATE project_progress 
      SET task_name = ?, description = ?, status = ?, progress = ?, 
          start_date = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND parent_task_id = ? AND project_id = ?
    `, [
      taskName || subtask.task_name,
      description !== undefined ? description : subtask.description,
      status || subtask.status,
      progress !== undefined ? progress : subtask.progress,
      startDate !== undefined ? startDate : subtask.start_date,
      dueDate !== undefined ? dueDate : subtask.due_date,
      subtaskId,
      taskId,
      projectId
    ]);

    res.json({ message: '子任务更新成功' });

  } catch (error) {
    console.error('更新子任务错误:', error);
    res.status(500).json({ error: '更新子任务失败' });
  }
});

// 删除子任务
router.delete('/:projectId/tasks/:taskId/subtasks/:subtaskId', authenticateToken, async (req, res) => {
  try {
    const { projectId, taskId, subtaskId } = req.params;
    
    // 权限检查
    const project = await database.get('SELECT manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    // 项目经理或管理员可以删除子任务
    if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
      return res.status(403).json({ error: '无权删除子任务' });
    }
    
    if (req.user.role === 'project_manager' && project.manager_id != req.user.userId) {
      return res.status(403).json({ error: '您只能管理自己负责的项目' });
    }

    // 删除子任务
    const result = await database.run('DELETE FROM project_progress WHERE id = ? AND parent_task_id = ? AND project_id = ?', [subtaskId, taskId, projectId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: '子任务不存在' });
    }

    res.json({ message: '子任务删除成功' });

  } catch (error) {
    console.error('删除子任务错误:', error);
    res.status(500).json({ error: '删除子任务失败' });
  }
});

// 获取所有客户（用于项目分配）
router.get('/clients/list', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员可以查看客户列表' });
    }

    const clients = await database.all(`
      SELECT id, username, email, full_name, created_at
      FROM users 
      WHERE role = 'client'
      ORDER BY full_name ASC
    `);

    res.json(clients);

  } catch (error) {
    console.error('获取客户列表错误:', error);
    res.status(500).json({ error: '获取客户列表失败' });
  }
});

module.exports = router;
