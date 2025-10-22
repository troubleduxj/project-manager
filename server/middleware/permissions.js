const database = require('../database/db');

/**
 * 检查用户是否可以管理指定项目
 * @param {number} userId - 用户ID
 * @param {string} userRole - 用户角色
 * @param {number} projectId - 项目ID
 * @returns {Promise<boolean>}
 */
async function canManageProject(userId, userRole, projectId) {
  // 管理员可以管理所有项目
  if (userRole === 'admin') {
    return true;
  }
  
  // 项目经理只能管理自己的项目
  if (userRole === 'project_manager') {
    const project = await database.get(
      'SELECT manager_id FROM projects WHERE id = ?',
      [projectId]
    );
    
    if (project && project.manager_id == userId) {
      return true;
    }
  }
  
  return false;
}

/**
 * 检查用户是否可以查看指定项目
 * @param {number} userId - 用户ID
 * @param {string} userRole - 用户角色
 * @param {number} projectId - 项目ID
 * @returns {Promise<boolean>}
 */
async function canViewProject(userId, userRole, projectId) {
  // 管理员可以查看所有项目
  if (userRole === 'admin') {
    return true;
  }
  
  // 项目经理可以查看自己管理的项目
  if (userRole === 'project_manager') {
    const project = await database.get(
      'SELECT manager_id FROM projects WHERE id = ?',
      [projectId]
    );
    
    if (project && project.manager_id == userId) {
      return true;
    }
  }
  
  // 普通用户可以查看自己参与的项目
  const project = await database.get(
    'SELECT client_id FROM projects WHERE id = ?',
    [projectId]
  );
  
  if (project && project.client_id == userId) {
    return true;
  }
  
  return false;
}

/**
 * 项目管理权限中间件 - 要求用户有管理项目的权限
 */
async function requireProjectManagement(req, res, next) {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const projectId = req.params.id || req.body.project_id;
    
    if (!projectId) {
      return res.status(400).json({ error: '缺少项目ID' });
    }
    
    const hasPermission = await canManageProject(userId, userRole, projectId);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: '您没有权限管理此项目',
        detail: userRole === 'project_manager' 
          ? '项目经理只能管理自己负责的项目' 
          : '您没有管理项目的权限'
      });
    }
    
    // 将权限信息附加到请求对象
    req.projectPermission = {
      canManage: true,
      canView: true
    };
    
    next();
  } catch (error) {
    console.error('权限检查失败:', error);
    res.status(500).json({ error: '权限检查失败' });
  }
}

/**
 * 项目查看权限中间件 - 要求用户有查看项目的权限
 */
async function requireProjectView(req, res, next) {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const projectId = req.params.id || req.body.project_id || req.query.project_id;
    
    if (!projectId) {
      return res.status(400).json({ error: '缺少项目ID' });
    }
    
    const hasPermission = await canViewProject(userId, userRole, projectId);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: '您没有权限查看此项目' 
      });
    }
    
    // 将权限信息附加到请求对象
    req.projectPermission = {
      canManage: await canManageProject(userId, userRole, projectId),
      canView: true
    };
    
    next();
  } catch (error) {
    console.error('权限检查失败:', error);
    res.status(500).json({ error: '权限检查失败' });
  }
}

/**
 * 仅管理员权限中间件
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: '此操作需要管理员权限' 
    });
  }
  next();
}

/**
 * 管理员或项目经理权限中间件
 */
function requireManagerOrAdmin(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'project_manager') {
    return res.status(403).json({ 
      error: '此操作需要管理员或项目经理权限' 
    });
  }
  next();
}

module.exports = {
  canManageProject,
  canViewProject,
  requireProjectManagement,
  requireProjectView,
  requireAdmin,
  requireManagerOrAdmin
};

