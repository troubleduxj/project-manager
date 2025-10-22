/**
 * 前端权限控制工具函数
 * 用于检查用户是否有权限执行特定操作
 */

/**
 * 检查用户是否可以管理指定项目
 * @param {Object} user - 当前用户对象 { userId, role, ... }
 * @param {Object} project - 项目对象 { id, manager_id, client_id, ... }
 * @returns {boolean}
 */
export function canManageProject(user, project) {
  if (!user || !project) return false;
  
  // 管理员可以管理所有项目
  if (user.role === 'admin') {
    return true;
  }
  
  // 项目经理只能管理自己负责的项目
  if (user.role === 'project_manager') {
    // 支持不同的字段名
    const managerId = project.manager_id || project.managerId;
    return managerId == user.userId || managerId == user.id;
  }
  
  return false;
}

/**
 * 检查用户是否可以查看指定项目
 * @param {Object} user - 当前用户对象
 * @param {Object} project - 项目对象
 * @returns {boolean}
 */
export function canViewProject(user, project) {
  if (!user || !project) return false;
  
  // 管理员可以查看所有项目
  if (user.role === 'admin') {
    return true;
  }
  
  // 项目经理可以查看自己管理的项目
  if (user.role === 'project_manager') {
    const managerId = project.manager_id || project.managerId;
    if (managerId == user.userId || managerId == user.id) {
      return true;
    }
  }
  
  // 普通用户可以查看自己参与的项目
  const clientId = project.client_id || project.clientId;
  if (clientId == user.userId || clientId == user.id) {
    return true;
  }
  
  return false;
}

/**
 * 检查用户是否可以创建项目
 * @param {Object} user - 当前用户对象
 * @returns {boolean}
 */
export function canCreateProject(user) {
  if (!user) return false;
  
  // 只有管理员可以创建项目
  return user.role === 'admin';
}

/**
 * 检查用户是否可以删除项目
 * @param {Object} user - 当前用户对象
 * @param {Object} project - 项目对象
 * @returns {boolean}
 */
export function canDeleteProject(user, project) {
  if (!user || !project) return false;
  
  // 只有管理员可以删除项目
  return user.role === 'admin';
}

/**
 * 检查用户是否可以管理任务
 * @param {Object} user - 当前用户对象
 * @param {Object} task - 任务对象
 * @param {Object} project - 项目对象（可选，如果task中没有project信息）
 * @returns {boolean}
 */
export function canManageTask(user, task, project = null) {
  if (!user || !task) return false;
  
  // 管理员可以管理所有任务
  if (user.role === 'admin') {
    return true;
  }
  
  // 项目经理可以管理自己项目的任务
  if (user.role === 'project_manager') {
    // 如果task有项目信息
    if (task.project) {
      return canManageProject(user, task.project);
    }
    // 如果传入了单独的project对象
    if (project) {
      return canManageProject(user, project);
    }
  }
  
  return false;
}

/**
 * 检查用户是否可以管理文档
 * @param {Object} user - 当前用户对象
 * @param {Object} document - 文档对象
 * @param {Object} project - 项目对象（可选）
 * @returns {boolean}
 */
export function canManageDocument(user, document, project = null) {
  if (!user || !document) return false;
  
  // 管理员可以管理所有文档
  if (user.role === 'admin') {
    return true;
  }
  
  // 项目经理可以管理自己项目的文档
  if (user.role === 'project_manager') {
    // 如果document有项目信息
    if (document.project) {
      return canManageProject(user, document.project);
    }
    // 如果传入了单独的project对象
    if (project) {
      return canManageProject(user, project);
    }
  }
  
  return false;
}

/**
 * 检查用户是否是管理员
 * @param {Object} user - 当前用户对象
 * @returns {boolean}
 */
export function isAdmin(user) {
  return user && user.role === 'admin';
}

/**
 * 检查用户是否是项目经理
 * @param {Object} user - 当前用户对象
 * @returns {boolean}
 */
export function isProjectManager(user) {
  return user && user.role === 'project_manager';
}

/**
 * 检查用户是否是管理员或项目经理
 * @param {Object} user - 当前用户对象
 * @returns {boolean}
 */
export function isManagerOrAdmin(user) {
  return user && (user.role === 'admin' || user.role === 'project_manager');
}

/**
 * 获取角色显示名称
 * @param {string} role - 角色代码
 * @returns {string}
 */
export function getRoleName(role) {
  const roleMap = {
    'admin': '管理员',
    'project_manager': '项目经理',
    'client': '普通用户'
  };
  return roleMap[role] || '普通用户';
}

/**
 * 获取角色颜色配置
 * @param {string} role - 角色代码
 * @returns {Object} { bg, color }
 */
export function getRoleColor(role) {
  const colorMap = {
    'admin': { bg: '#d4edda', color: '#155724' },          // 绿色 - 管理员
    'project_manager': { bg: '#fff3cd', color: '#856404' }, // 黄色 - 项目经理
    'client': { bg: '#e2e3e5', color: '#495057' }          // 灰色 - 普通用户
  };
  return colorMap[role] || colorMap['client'];
}

/**
 * 获取角色图标
 * @param {string} role - 角色代码
 * @returns {string}
 */
export function getRoleIcon(role) {
  const iconMap = {
    'admin': '👑',
    'project_manager': '📊',
    'client': '👤'
  };
  return iconMap[role] || '👤';
}

/**
 * 渲染角色徽章（返回样式对象）
 * @param {string} role - 角色代码
 * @returns {Object} 徽章样式和文本
 */
export function getRoleBadge(role) {
  const color = getRoleColor(role);
  const icon = getRoleIcon(role);
  const name = getRoleName(role);
  
  return {
    text: `${icon} ${name}`,
    style: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: color.bg,
      color: color.color,
      display: 'inline-block'
    }
  };
}

/**
 * 权限错误提示
 * @param {string} action - 操作类型（edit, delete, view等）
 * @param {string} resource - 资源类型（project, task, document等）
 * @returns {string} 错误提示信息
 */
export function getPermissionErrorMessage(action, resource) {
  const actionMap = {
    'edit': '编辑',
    'delete': '删除',
    'create': '创建',
    'view': '查看',
    'manage': '管理'
  };
  
  const resourceMap = {
    'project': '项目',
    'task': '任务',
    'document': '文档',
    'user': '用户'
  };
  
  const actionText = actionMap[action] || action;
  const resourceText = resourceMap[resource] || resource;
  
  return `您没有权限${actionText}此${resourceText}`;
}

// 默认导出所有函数
export default {
  canManageProject,
  canViewProject,
  canCreateProject,
  canDeleteProject,
  canManageTask,
  canManageDocument,
  isAdmin,
  isProjectManager,
  isManagerOrAdmin,
  getRoleName,
  getRoleColor,
  getRoleIcon,
  getRoleBadge,
  getPermissionErrorMessage
};

