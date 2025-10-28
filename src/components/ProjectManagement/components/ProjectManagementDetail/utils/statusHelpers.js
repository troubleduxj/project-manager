// 状态和优先级相关的工具函数

// 状态中文映射
export const getStatusText = (status) => {
  const statusMap = {
    'active': '进行中',
    'completed': '已完成',
    'on_hold': '已暂停',
    'cancelled': '已取消',
    'planning': '规划中',
    '进行中': '进行中',
    '已完成': '已完成',
    '已暂停': '已暂停',
    '已取消': '已取消',
    '规划中': '规划中'
  };
  return statusMap[status] || status;
};

// 状态颜色映射
export const getStatusColor = (status) => {
  // 先转换为中文
  const statusText = getStatusText(status);
  switch(statusText) {
    case '进行中': return '#3498db';
    case '已完成': return '#27ae60';
    case '已暂停': return '#f39c12';
    case '已取消': return '#e74c3c';
    case '规划中': return '#9b59b6';
    default: return '#95a5a6';
  }
};

// 优先级中文映射
export const getPriorityText = (priority) => {
  const priorityMap = {
    'high': '高',
    'medium': '中',
    'low': '低',
    '高': '高',
    '中': '中',
    '低': '低'
  };
  return priorityMap[priority] || priority;
};

// 优先级颜色映射
export const getPriorityColor = (priority) => {
  // 先转换为中文
  const priorityText = getPriorityText(priority);
  switch(priorityText) {
    case '高': return '#e74c3c';
    case '中': return '#f39c12';
    case '低': return '#3498db';
    default: return '#95a5a6';
  }
};

// 进度中文显示
export const getProgressText = (progress) => {
  if (progress === 0) return '未开始';
  if (progress === 100) return '已完成';
  if (progress < 30) return '刚开始';
  if (progress < 60) return '进行中';
  if (progress < 90) return '接近完成';
  return `${progress}%`;
};

