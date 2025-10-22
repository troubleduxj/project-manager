// 项目筛选相关工具函数

// 获取默认项目
export const getDefaultProject = (projects) => {
  return projects.find(p => p.isDefault);
};

// 筛选成员数据
export const getFilteredMembers = (members, selectedProjectFilter) => {
  if (selectedProjectFilter === 'all') return members;
  if (!selectedProjectFilter) return members;
  return members.filter(m => m.projectId === Number(selectedProjectFilter));
};

// 筛选服务器数据
export const getFilteredServers = (servers, selectedProjectFilter) => {
  if (selectedProjectFilter === 'all') return servers;
  if (!selectedProjectFilter) return servers;
  return servers.filter(s => s.projectId === Number(selectedProjectFilter));
};

// 筛选资料数据
export const getFilteredResources = (resources, selectedProjectFilter) => {
  if (selectedProjectFilter === 'all') return resources;
  if (!selectedProjectFilter) return resources;
  return resources.filter(r => r.projectId === Number(selectedProjectFilter));
};

// 获取状态颜色
export const getStatusColor = (status) => {
  switch(status) {
    case '进行中': return '#3498db';
    case '已完成': return '#27ae60';
    case '已暂停': return '#f39c12';
    case '已取消': return '#e74c3c';
    case '规划中': return '#9b59b6';
    default: return '#95a5a6';
  }
};

// 获取优先级颜色
export const getPriorityColor = (priority) => {
  switch(priority) {
    case '高': return '#e74c3c';
    case '中': return '#f39c12';
    case '低': return '#3498db';
    default: return '#95a5a6';
  }
};

