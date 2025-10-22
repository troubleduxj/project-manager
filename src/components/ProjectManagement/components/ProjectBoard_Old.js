import React, { useState, useEffect } from 'react';

// SVG 图标组件
const Icon = ({ name, size = 32, color = 'currentColor', className = '' }) => {
  const icons = {
    // 统计图表
    'chart': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    ),
    // 趋势向上
    'trending-up': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    // 任务清单
    'task-list': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 11l2 2 4-4" />
        <line x1="7" y1="17" x2="17" y2="17" />
      </svg>
    ),
    // 完成勾选
    'check-circle': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.1" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    ),
    // 文档
    'document': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    ),
    // 文件夹
    'folder': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill={color} fillOpacity="0.1" />
      </svg>
    ),
    // 用户组
    'users': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    // 进行中/刷新
    'refresh': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
      </svg>
    ),
    // 警告/受阻
    'alert-circle': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.1" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    // 设置
    'settings': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6M5.6 5.6l4.2 4.2m4.2 4.2l4.2 4.2M1 12h6m6 0h6m-14.4 6.4l4.2-4.2m4.2-4.2l4.2-4.2" />
      </svg>
    ),
    // 活动/闪电
    'activity': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    // 数据库
    'database': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    )
  };
  
  return (
    <div className={className} style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
      {icons[name] || icons['task-list']}
    </div>
  );
};

const ProjectBoard = ({ selectedProject, projectTasks, projectDocuments, user, systemSettings, onSwitchToDocuments, onSwitchToTasks, onSwitchToConfig, onSwitchToUserManagement }) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [subTasks, setSubTasks] = useState({});
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'login',
      message: `${user?.full_name || user?.username} 登录了系统`,
      time: new Date().toLocaleString(),
      icon: '👤'
    }
  ]);
  const [systemStats, setSystemStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // 获取主任务（没有parent_task_id的任务）
  const mainTasks = projectTasks.filter(task => !task.parent_task_id);

  // 计算统计数据（只统计主任务）
  const totalTasks = mainTasks.length;
  const completedTasks = mainTasks.filter(task => task.status === 'done').length;
  const inProgressTasks = mainTasks.filter(task => task.status === 'in_progress').length;
  // 待办任务包含：todo, pending, not_started 等状态
  const todoTasks = mainTasks.filter(task => 
    task.status === 'todo' || 
    task.status === 'pending' || 
    task.status === 'not_started' ||
    !task.status // 没有状态的任务也算待办
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 获取最近的文档（显示前3条，但保留完整列表用于"更多"功能）
  const allRecentDocuments = projectDocuments
    .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
  const recentDocuments = allRecentDocuments.slice(0, 3);
  const hasMoreDocuments = allRecentDocuments.length > 3;

  // 获取系统统计数据（仅管理员）
  const fetchSystemStats = async () => {
    if (user.role !== 'admin') return;
    
    setLoadingStats(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/stats/system', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data);
      } else {
        console.error('获取系统统计失败:', response.status);
      }
    } catch (error) {
      console.error('获取系统统计失败:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // 组件加载时获取统计数据
  useEffect(() => {
    if (user.role === 'admin') {
      fetchSystemStats();
    }
  }, [user.role]);

  // 格式化文件大小
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // 导出甘特图功能
  const handleExportGantt = () => {
    try {
      // 创建甘特图数据
      const ganttData = generateGanttChart();
      
      // 创建并下载SVG文件
      const svgContent = createGanttSVG(ganttData);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedProject?.name || '项目'}_甘特图_${new Date().toISOString().split('T')[0]}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // 显示成功提示
      alert('✅ 甘特图导出成功！');
    } catch (error) {
      console.error('导出甘特图失败:', error);
      alert('❌ 导出甘特图失败，请稍后重试');
    }
  };

  // 生成甘特图数据
  const generateGanttChart = () => {
    const tasks = [];
    const today = new Date();
    
    // 处理主任务
    mainTasks.forEach((task, index) => {
      let startDate, endDate;
      
      // 使用数据库中的实际日期字段：start_date 和 due_date
      if (task.start_date) {
        startDate = new Date(task.start_date);
      } else {
        // 如果没有开始日期，根据状态设置默认值
        switch (task.status) {
          case 'done':
            startDate = new Date(today.getTime() - (14 + index * 2) * 24 * 60 * 60 * 1000);
            break;
          case 'in_progress':
            startDate = new Date(today.getTime() - (7 + index) * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(today.getTime() + index * 24 * 60 * 60 * 1000);
            break;
        }
      }
      
      if (task.due_date) {
        endDate = new Date(task.due_date);
      } else {
        // 如果没有截止日期，根据开始日期和状态设置默认值
        const defaultDuration = 7; // 默认7天
        endDate = new Date(startDate.getTime() + defaultDuration * 24 * 60 * 60 * 1000);
      }
      
      // 确保结束日期不早于开始日期
      if (endDate <= startDate) {
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // 至少1天
      }
      
      tasks.push({
        id: task.id,
        name: task.task_name,
        startDate,
        endDate,
        progress: task.progress || 0,
        status: task.status,
        level: 0,
        parentId: null
      });
      
      // 处理子任务
      if (subTasks[task.id]) {
        subTasks[task.id].forEach((subTask, subIndex) => {
          let subStartDate, subEndDate;
          
          // 子任务也使用 start_date 和 due_date
          if (subTask.start_date) {
            subStartDate = new Date(subTask.start_date);
          } else {
            // 子任务默认在主任务时间范围内
            const taskDuration = endDate - startDate;
            const offset = (taskDuration / (subTasks[task.id].length + 1)) * (subIndex + 1);
            subStartDate = new Date(startDate.getTime() + offset);
          }
          
          if (subTask.due_date) {
            subEndDate = new Date(subTask.due_date);
          } else {
            // 子任务默认持续3-5天
            const defaultSubDuration = 3 + subIndex;
            subEndDate = new Date(subStartDate.getTime() + defaultSubDuration * 24 * 60 * 60 * 1000);
          }
          
          // 确保子任务结束日期不早于开始日期
          if (subEndDate <= subStartDate) {
            subEndDate = new Date(subStartDate.getTime() + 24 * 60 * 60 * 1000);
          }
          
          tasks.push({
            id: subTask.id,
            name: subTask.task_name,
            startDate: subStartDate,
            endDate: subEndDate,
            progress: subTask.progress || 0,
            status: subTask.status,
            level: 1,
            parentId: task.id
          });
        });
      }
    });
    
    return tasks;
  };

  // 创建甘特图SVG
  const createGanttSVG = (tasks) => {
    if (tasks.length === 0) {
      throw new Error('没有任务数据可导出');
    }
    
    // 获取系统名称（优先使用props传递的系统设置）
    const systemName = systemSettings?.site_name || '项目管理系统';
    console.log('甘特图使用的系统名称:', systemName);
    
    // 适配1920*1080屏幕，预留浏览器UI空间
    const maxWidth = 1800; // 最大宽度，适配1920屏幕
    const maxHeight = 900; // 最大高度，适配1080屏幕
    const leftMargin = 220; // 进一步减少左边距，给时间轴更多空间
    const topMargin = 130; // 增加顶部边距，在标题和甘特图之间留出更多空白
    const taskHeight = 35; // 减少任务条高度
    const taskSpacing = 50; // 减少任务间距
    
    // 计算实际尺寸（增大头部，减少底部空间）
    const headerHeight = 90; // 增大头部高度
    const headerSpacing = 40; // 头部和内容之间的间距
    const bottomMargin = 30; // 减少底部空白
    const estimatedHeight = Math.min(maxHeight, Math.max(400, headerHeight + headerSpacing + tasks.length * taskSpacing + bottomMargin));
    const width = maxWidth;
    const height = estimatedHeight;
    
    // 计算时间范围（按周显示）
    const allDates = tasks.flatMap(task => [task.startDate, task.endDate]);
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));
    
    // 调整到周的开始和结束
    const startOfWeek = new Date(minDate);
    startOfWeek.setDate(minDate.getDate() - minDate.getDay()); // 周日为一周开始
    const endOfWeek = new Date(maxDate);
    endOfWeek.setDate(maxDate.getDate() + (6 - maxDate.getDay())); // 周六为一周结束
    
    const totalDays = Math.ceil((endOfWeek - startOfWeek) / (1000 * 60 * 60 * 24)) + 1;
    const totalWeeks = Math.ceil(totalDays / 7);
    
    // 优化时间线宽度，按周显示
    const rightMargin = 40; // 减少右边距
    const timelineWidth = width - leftMargin - rightMargin;
    const weekWidth = Math.max(60, timelineWidth / totalWeeks); // 减少每周最小宽度，确保能显示更多周
    const actualTimelineWidth = timelineWidth; // 使用全部可用宽度
    const dayWidth = actualTimelineWidth / totalDays; // 基于总天数计算日宽度
    
    // 状态颜色映射
    const statusColors = {
      'done': '#28a745',
      'in_progress': '#007bff', 
      'blocked': '#dc3545',
      'todo': '#6c757d'
    };
    
    // 生成SVG内容
    let svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .title { font-family: 'Microsoft YaHei', sans-serif; font-size: 22px; font-weight: bold; fill: #2c3e50; }
            .subtitle { font-family: 'Microsoft YaHei', sans-serif; font-size: 13px; fill: #7f8c8d; }
            .task-name { 
              font-family: 'Microsoft YaHei', sans-serif; 
              font-size: 14px; 
              font-weight: 600;
              fill: #2c3e50; 
            }
            .task-name-sub { 
              font-family: 'Microsoft YaHei', sans-serif; 
              font-size: 12px; 
              font-weight: 500;
              fill: #5a6c7d; 
            }
            .date-label { font-family: 'Microsoft YaHei', sans-serif; font-size: 10px; fill: #7f8c8d; font-weight: 500; }
            .progress-text { font-family: 'Microsoft YaHei', sans-serif; font-size: 9px; fill: white; font-weight: bold; }
          </style>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="taskBgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- 背景 -->
        <rect width="${width}" height="${height}" fill="#f8f9fa"/>
        
        <!-- 标题背景 -->
        <rect x="0" y="0" width="${width}" height="${headerHeight}" fill="url(#taskBgGradient)" stroke="#e9ecef" stroke-width="1"/>
        
        <!-- 标题 -->
        <text x="${width/2}" y="35" text-anchor="middle" class="title">
          📊 ${systemName} - 进度甘特图
        </text>
        <text x="${width/2}" y="60" text-anchor="middle" class="subtitle">
          生成时间: ${new Date().toLocaleString('zh-CN')}
        </text>
        
        <!-- 任务名称区域背景 -->
        <rect x="0" y="${headerHeight}" width="${leftMargin}" height="${height - headerHeight}" fill="url(#taskBgGradient)" stroke="#e9ecef" stroke-width="1"/>
        
        <!-- 时间轴 -->
        <line x1="${leftMargin}" y1="${topMargin}" x2="${leftMargin + actualTimelineWidth}" y2="${topMargin}" stroke="#495057" stroke-width="2"/>
    `;
    
    // 绘制周标签
    for (let week = 0; week < totalWeeks; week++) {
      const weekStartDate = new Date(startOfWeek.getTime() + week * 7 * 24 * 60 * 60 * 1000);
      const weekEndDate = new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000);
      const x = leftMargin + (week * 7 * dayWidth); // 使用日宽度计算位置
      const weekDisplayWidth = 7 * dayWidth; // 每周显示宽度
      
      if (x < leftMargin + actualTimelineWidth) {
        // 周分隔线
        svgContent += `
          <line x1="${x}" y1="${topMargin - 8}" x2="${x}" y2="${topMargin + 8}" stroke="#495057" stroke-width="2"/>
        `;
        
        // 周标签（只在有足够空间时显示）
        if (weekDisplayWidth > 50) {
          const weekLabel = `${weekStartDate.getMonth() + 1}/${weekStartDate.getDate()}-${weekEndDate.getMonth() + 1}/${weekEndDate.getDate()}`;
          svgContent += `
            <text x="${x + weekDisplayWidth/2}" y="${topMargin - 12}" text-anchor="middle" class="date-label">
              第${week + 1}周
            </text>
            <text x="${x + weekDisplayWidth/2}" y="${topMargin - 25}" text-anchor="middle" class="date-label" style="font-size: 9px;">
              ${weekLabel}
            </text>
          `;
        }
      }
    }
    
    // 绘制任务条
    tasks.forEach((task, index) => {
      const y = topMargin + 20 + index * taskSpacing;
      const startX = leftMargin + ((task.startDate - startOfWeek) / (1000 * 60 * 60 * 24)) * dayWidth;
      const taskWidth = Math.max(25, ((task.endDate - task.startDate) / (1000 * 60 * 60 * 24)) * dayWidth);
      const color = statusColors[task.status] || '#6c757d';
      const indent = task.level * 20;
      
      // 任务分隔线（在每个任务上方）
      if (index > 0) {
        svgContent += `
          <line x1="0" y1="${y - 20}" x2="${width}" y2="${y - 20}" 
                stroke="#e9ecef" stroke-width="1" stroke-dasharray="3,3"/>
        `;
      }
      
      // 任务名称（去掉线框，直接显示，适应更小的左侧空间）
      const maxLength = task.level === 0 ? 20 : 18; // 主任务20字符，子任务18字符
      const displayName = task.name.length > maxLength ? task.name.substring(0, maxLength - 3) + '...' : task.name;
      svgContent += `
        <text x="${indent + 10}" y="${y + 3}" class="${task.level === 0 ? 'task-name' : 'task-name-sub'}">
          ${task.level === 1 ? '└ ' : ''}${displayName}
        </text>
      `;
      
      // 任务条背景
      svgContent += `
        <rect x="${startX}" y="${y - 15}" width="${taskWidth}" height="${taskHeight}" 
              fill="${color}20" stroke="${color}" stroke-width="1" rx="4"/>
      `;
      
      // 进度条
      if (task.progress > 0) {
        const progressWidth = (taskWidth * task.progress) / 100;
        svgContent += `
          <rect x="${startX}" y="${y - 15}" width="${progressWidth}" height="${taskHeight}" 
                fill="url(#progressGradient)" rx="4"/>
        `;
      }
      
      // 进度文字
      if (task.progress > 0 && taskWidth > 40) {
        svgContent += `
          <text x="${startX + taskWidth/2}" y="${y + 8}" text-anchor="middle" class="progress-text">
            ${task.progress}%
          </text>
        `;
      }
      
      // 状态标签
      const statusText = {
        'done': '完成',
        'in_progress': '进行中', 
        'blocked': '受阻',
        'todo': '待办',
        'pending': '待办',
        'not_started': '待办',
        'planning': '计划中'
      }[task.status] || '待办'; // 默认显示"待办"而不是"未知"
      
      svgContent += `
        <rect x="${startX + taskWidth + 10}" y="${y - 10}" width="50" height="20" 
              fill="${color}" rx="10"/>
        <text x="${startX + taskWidth + 35}" y="${y + 3}" text-anchor="middle" 
              style="font-family: 'Microsoft YaHei', sans-serif; font-size: 10px; fill: white; font-weight: bold;">
          ${statusText}
        </text>
      `;
    });
    
    // 图例（移到右上角，不占用底部空间）
    const legendStartX = Math.max(leftMargin + 50, leftMargin + actualTimelineWidth - 280); // 右上角位置，确保不超出边界
    const legendY = 55; // 标题区域内，适应新的头部高度
    const legendItems = [
      { color: '#28a745', text: '完成' },
      { color: '#007bff', text: '进行中' },
      { color: '#dc3545', text: '受阻' },
      { color: '#6c757d', text: '待办' }
    ];
    
    // 图例背景
    svgContent += `
      <rect x="${legendStartX - 10}" y="${legendY - 15}" width="310" height="25" 
            fill="rgba(255,255,255,0.9)" stroke="#e9ecef" stroke-width="1" rx="4"/>
    `;
    
    // 图例文字和图例项目使用相同的基线
    const legendTextY = legendY + 8; // 统一的文字基线
    const legendRectY = legendY + 2; // 色块垂直居中对齐文字
    
    svgContent += `<text x="${legendStartX}" y="${legendTextY}" class="task-name-sub">图例:</text>`;
    
    legendItems.forEach((item, index) => {
      const x = legendStartX + 35 + index * 65;
      svgContent += `
        <rect x="${x}" y="${legendRectY}" width="10" height="10" fill="${item.color}" rx="2"/>
        <text x="${x + 15}" y="${legendTextY}" class="task-name-sub" style="font-size: 10px;">${item.text}</text>
      `;
    });
    
    svgContent += '</svg>';
    return svgContent;
  };

  // 获取子任务
  const fetchSubTasks = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/projects/${selectedProject.id}/tasks/${taskId}/subtasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubTasks(prev => ({
          ...prev,
          [taskId]: data
        }));
      } else {
        console.error('获取子任务失败');
        setSubTasks(prev => ({
          ...prev,
          [taskId]: []
        }));
      }
    } catch (error) {
      console.error('获取子任务错误:', error);
      setSubTasks(prev => ({
        ...prev,
        [taskId]: []
      }));
    }
  };

  // 切换任务展开状态
  const toggleTaskExpansion = async (taskId) => {
    const newExpanded = new Set(expandedTasks);
    
    if (expandedTasks.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
      // 如果还没有获取过子任务，则获取
      if (!subTasks[taskId]) {
        await fetchSubTasks(taskId);
      }
    }
    
    setExpandedTasks(newExpanded);
  };

  // 统计卡片组件
  const StatCard = ({ title, value, icon, color, description, trend }) => (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '16px',
      padding: '28px',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      {/* 装饰性背景 */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '80px',
        height: '80px',
        background: `linear-gradient(135deg, ${color || '#495057'}20, ${color || '#495057'}10)`,
        borderRadius: '50%',
        opacity: 0.6
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <div style={{
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: color || '#495057',
            marginBottom: '8px',
            lineHeight: '1'
          }}>
            {value}
          </div>
          {description && (
            <div style={{
              fontSize: '13px',
              color: '#6c757d',
              fontWeight: '500'
            }}>
              {description}
            </div>
          )}
        </div>
        <div style={{
          opacity: 0.8,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}>
          <Icon name={icon} size={40} color={color || '#495057'} />
        </div>
      </div>
      {trend && (
        <div style={{
          marginTop: '16px',
          fontSize: '12px',
          color: trend > 0 ? '#28a745' : trend < 0 ? '#dc3545' : '#6c757d',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>
            {trend > 0 ? (
              <Icon name="trending-up" size={16} color="#28a745" />
            ) : trend < 0 ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                <polyline points="17 18 23 18 23 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </span>
          {trend > 0 ? '+' : ''}{Math.abs(trend)}% 较上期
        </div>
      )}
    </div>
  );

  // 任务进度项组件
  const TaskProgressItem = ({ task, level = 0 }) => {
    const hasSubTasks = subTasks[task.id] && subTasks[task.id].length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const isMainTask = level === 0; // 主任务可以展开
    
    const getStatusColor = (status) => {
      switch (status) {
        case 'done': return '#28a745';
        case 'in_progress': return '#007bff';
        case 'blocked': return '#dc3545';
        default: return '#6c757d';
      }
    };
    
    const getStatusIcon = (status) => {
      switch (status) {
        case 'done': return <Icon name="check-circle" size={20} color="#28a745" />;
        case 'in_progress': return <Icon name="refresh" size={20} color="#007bff" />;
        case 'blocked': return <Icon name="alert-circle" size={20} color="#dc3545" />;
        default: return <Icon name="task-list" size={20} color="#6c757d" />;
      }
    };
    
    return (
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px 24px',
            background: level === 0 
              ? 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: `1px solid ${level === 0 ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
            borderRadius: level === 0 ? '12px' : '8px',
            cursor: isMainTask ? 'pointer' : 'default',
            marginLeft: level * 24,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => isMainTask && toggleTaskExpansion(task.id)}
          onMouseEnter={(e) => {
            if (isMainTask) {
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (isMainTask) {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {/* 进度条背景装饰 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${task.progress || 0}%`,
            background: `linear-gradient(90deg, ${getStatusColor(task.status)}15, ${getStatusColor(task.status)}05)`,
            transition: 'width 0.5s ease',
            zIndex: 0
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
            {isMainTask && (
              <div style={{ 
                marginRight: '16px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                background: isExpanded 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: `2px solid ${isExpanded ? '#667eea' : '#dee2e6'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isExpanded 
                  ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none"
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path 
                    d="M4 2L8 6L4 10" 
                    stroke={isExpanded ? '#ffffff' : '#6c757d'} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{ 
                  fontWeight: level === 0 ? '700' : '600',
                  fontSize: level === 0 ? '16px' : '14px',
                  color: '#212529'
                }}>
                  {task.task_name}
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: getStatusColor(task.status),
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {task.status === 'done' ? '完成' :
                   task.status === 'in_progress' ? '进行' :
                   task.status === 'blocked' ? '受阻' : '待办'}
                </div>
              </div>
              {task.description && (
                <div style={{ 
                  fontSize: '13px', 
                  color: '#6c757d',
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  {task.description}
                </div>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', minWidth: '140px', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              flex: 1, 
              height: '8px', 
              background: 'rgba(0, 0, 0, 0.1)', 
              borderRadius: '4px',
              marginRight: '12px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                background: `linear-gradient(90deg, ${getStatusColor(task.status)}, ${getStatusColor(task.status)}CC)`,
                width: `${task.progress || 0}%`,
                borderRadius: '4px',
                transition: 'width 0.5s ease',
                boxShadow: `0 2px 4px ${getStatusColor(task.status)}40`
              }} />
            </div>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '700',
              minWidth: '45px',
              textAlign: 'right',
              color: getStatusColor(task.status)
            }}>
              {task.progress || 0}%
            </span>
          </div>
        </div>
        
        {/* 子任务 */}
        {isExpanded && (
          <div style={{ marginTop: '12px' }}>
            {hasSubTasks ? (
              subTasks[task.id].map(subtask => (
                <TaskProgressItem 
                  key={subtask.id} 
                  task={subtask} 
                  level={level + 1}
                />
              ))
            ) : (
              <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                marginLeft: 24,
                textAlign: 'center',
                color: '#6c757d',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                {subTasks[task.id] !== undefined ? (
                  <div>
                    <span style={{ fontSize: '20px', marginBottom: '8px', display: 'block' }}>📝</span>
                    暂无子任务
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: '20px', marginBottom: '8px', display: 'block' }}>⏳</span>
                    加载中...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 快速操作卡片组件（仅管理员可见）
  const QuickAction = ({ title, description, icon, color, onClick }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* 装饰性背景 */}
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '100px',
        height: '100px',
        background: `linear-gradient(135deg, ${color || '#495057'}20, ${color || '#495057'}10)`,
        borderRadius: '50%',
        opacity: 0.6
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          marginBottom: '16px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Icon name={icon} size={44} color={color || '#495057'} />
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: '700',
          color: color || '#495057',
          marginBottom: '8px'
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#6c757d',
          lineHeight: '1.5',
          fontWeight: '500'
        }}>
          {description}
        </div>
      </div>
    </div>
  );

  if (!selectedProject) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6c757d'
      }}>
        <Icon name="task-list" size={64} color="#6c757d" />
        <h3 style={{ marginTop: '16px' }}>请选择一个项目</h3>
        <p>选择一个项目来查看项目看板</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* 项目概览横幅 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        marginBottom: '32px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 装饰性背景元素 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%'
        }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '32px', 
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              👋 欢迎回来，{user?.full_name || user?.username}！
            </h1>
            <p style={{ 
              margin: '0 0 20px 0', 
              fontSize: '18px', 
              opacity: 0.95,
              lineHeight: '1.6',
              maxWidth: '600px'
            }}>
              这里是您的项目看板，您可以查看项目进度和最新动态
            </p>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '14px', opacity: 0.8, display: 'block', marginBottom: '4px' }}>项目状态</span>
                <div style={{ fontSize: '18px', fontWeight: '700' }}>
                  {completionRate === 100 ? '✅ 已完成' : '🟢 进行中'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '14px', opacity: 0.8, display: 'block', marginBottom: '4px' }}>完成率</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                  {completionRate}%
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              opacity: 0.8,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}>
              <Icon name="trending-up" size={64} color="#667eea" />
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatCard
          title="总任务数"
          value={totalTasks}
          icon="task-list"
          color="#495057"
          description={`${mainTasks.length} 个主任务`}
        />
        <StatCard
          title="已完成"
          value={completedTasks}
          icon="check-circle"
          color="#28a745"
          description="任务完成情况"
        />
        <StatCard
          title="进行中"
          value={inProgressTasks}
          icon="refresh"
          color="#007bff"
          description="正在执行的任务"
        />
        <StatCard
          title="待办事项"
          value={todoTasks}
          icon="task-list"
          color="#ffc107"
          description="等待开始的任务"
        />
        <StatCard
          title="项目文档"
          value={projectDocuments.length}
          icon="document"
          color="#6f42c1"
          description="已上传的文档"
        />
      </div>

      {/* 管理员操作面板（仅管理员可见） */}
      {user.role === 'admin' && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            marginBottom: '16px', 
            color: '#495057',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🛠️ 管理员操作
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <QuickAction
              title="任务管理"
              description="添加、编辑和管理项目任务"
              icon="task-list"
              color="#007bff"
              onClick={() => onSwitchToTasks && onSwitchToTasks()}
            />
            <QuickAction
              title="文档管理"
              description="上传和管理项目文档"
              icon="folder"
              color="#28a745"
              onClick={() => onSwitchToDocuments && onSwitchToDocuments()}
            />
            <QuickAction
              title="用户管理"
              description="管理系统用户和权限"
              icon="users"
              color="#6f42c1"
              onClick={() => onSwitchToUserManagement && onSwitchToUserManagement()}
            />
            <QuickAction
              title="系统设置"
              description="配置系统参数和选项"
              icon="settings"
              color="#fd7e14"
              onClick={() => onSwitchToConfig && onSwitchToConfig()}
            />
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px'
      }}>
        {/* 任务进度 */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(102, 126, 234, 0.15)',
          boxShadow: '0 2px 12px rgba(102, 126, 234, 0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              margin: 0,
              color: '#495057',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              <Icon name="trending-up" size={20} color="#495057" style={{ marginRight: '8px' }} />
              任务进度
            </h3>
            <button
              onClick={handleExportGantt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.2)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <polyline 
                  points="7,10 12,15 17,10"
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <line 
                  x1="12" 
                  y1="15" 
                  x2="12" 
                  y2="3"
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
              导出甘特图
            </button>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e9ecef'
          }}>
            {mainTasks.length > 0 ? (
              <div>
                {mainTasks.map((task) => (
                  <TaskProgressItem key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#6c757d'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h4>暂无任务</h4>
                <p>还没有创建任何任务，请先添加一些任务。</p>
              </div>
            )}
          </div>
        </div>

        {/* 系统状态面板（仅管理员可见） */}
        {user.role === 'admin' && (
          <div>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ 
                margin: 0,
                color: '#495057',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                <Icon name="chart" size={20} color="#495057" style={{ marginRight: '8px' }} />
                系统统计
              </h3>
              <button
                onClick={fetchSystemStats}
                disabled={loadingStats}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: loadingStats ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  opacity: loadingStats ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {loadingStats ? '刷新中...' : '🔄 刷新'}
              </button>
            </div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e9ecef'
            }}>
              {loadingStats && !systemStats ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                  <div>加载中...</div>
                </div>
              ) : systemStats ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '20px'
                }}>
                  {/* 用户统计 */}
                  <div style={{ 
                    textAlign: 'center',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    border: '1px solid #667eea30'
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Icon name="users" size={32} color="#667eea" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea', marginBottom: '4px' }}>
                      {systemStats.users.total}
                    </div>
                    <div style={{ fontSize: '13px', color: '#495057', fontWeight: '600', marginBottom: '8px' }}>
                      用户总数
                    </div>
                    {systemStats.users.todayNew > 0 && (
                      <div style={{ fontSize: '11px', color: '#28a745', fontWeight: '600' }}>
                        今日新增 +{systemStats.users.todayNew}
                      </div>
                    )}
                  </div>

                  {/* 任务统计 */}
                  <div style={{ 
                    textAlign: 'center',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #10b98115 0%, #05966915 100%)',
                    border: '1px solid #10b98130'
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Icon name="check-circle" size={32} color="#10b981" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                      {systemStats.tasks.total}
                    </div>
                    <div style={{ fontSize: '13px', color: '#495057', fontWeight: '600', marginBottom: '8px' }}>
                      任务总数
                    </div>
                    {systemStats.tasks.todayNew > 0 && (
                      <div style={{ fontSize: '11px', color: '#28a745', fontWeight: '600' }}>
                        今日新增 +{systemStats.tasks.todayNew}
                      </div>
                    )}
                  </div>

                  {/* 文档统计 */}
                  <div style={{ 
                    textAlign: 'center',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f59e0b15 0%, #d9770615 100%)',
                    border: '1px solid #f59e0b30'
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Icon name="document" size={32} color="#f59e0b" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                      {systemStats.documents.total}
                    </div>
                    <div style={{ fontSize: '13px', color: '#495057', fontWeight: '600', marginBottom: '8px' }}>
                      文档总数
                    </div>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>
                      {formatBytes(systemStats.documents.totalSize || 0)}
                    </div>
                  </div>

                  {/* 数据库统计 */}
                  <div style={{ 
                    textAlign: 'center',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #3b82f615 0%, #2563eb15 100%)',
                    border: '1px solid #3b82f630'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>💾</div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                      {formatBytes(systemStats.database.size)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#495057', fontWeight: '600', marginBottom: '8px' }}>
                      数据库大小
                    </div>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>
                      {systemStats.database.path}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>❌</div>
                  <div>暂无统计数据</div>
                  <button
                    onClick={fetchSystemStats}
                    style={{
                      marginTop: '16px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    点击加载
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 底部区域：最近更新和最近文档 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* 最近更新 */}
          <div>
            <h3 style={{ 
              marginBottom: '16px', 
              color: '#495057',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              🕒 最近更新
            </h3>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e9ecef'
            }}>
              {recentActivities.length > 0 ? (
                <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentActivities.slice(0, 3).map((activity) => (
                    <div key={activity.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontSize: '20px', marginRight: '12px' }}>
                        {activity.icon}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                          {activity.message}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                  {recentActivities.length > 3 && (
                    <div style={{
                      marginTop: '16px',
                      textAlign: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid #e9ecef'
                    }}>
                      <span style={{
                        color: '#2e8555',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0f9f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}>
                        <span>查看更多</span>
                        <span style={{ fontSize: '12px' }}>
                          ({recentActivities.length - 3}+)
                        </span>
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
                  <p>暂无最近活动</p>
                </div>
              )}
            </div>
          </div>

          {/* 最近文档 */}
          <div>
            <h3 style={{ 
              marginBottom: '16px', 
              color: '#495057',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              <Icon name="document" size={20} color="#495057" style={{ marginRight: '8px' }} />
              最近文档
            </h3>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e9ecef'
            }}>
              {recentDocuments.length > 0 ? (
                <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}>
                        <span style={{ marginRight: '12px' }}>
                          <Icon name="document" size={20} color="#667eea" />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '500',
                          marginBottom: '4px'
                        }}>
                          {doc.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>
                          {new Date(doc.uploaded_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                  {hasMoreDocuments && (
                    <div style={{
                      marginTop: '16px',
                      textAlign: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid #e9ecef'
                    }}>
                      <span style={{
                        color: '#2e8555',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => onSwitchToDocuments && onSwitchToDocuments()}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0f9f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}>
                        <span>查看更多</span>
                        <span style={{ fontSize: '12px' }}>
                          ({allRecentDocuments.length - 3}+)
                        </span>
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                  <Icon name="folder" size={48} color="#adb5bd" />
                  <p style={{ marginTop: '12px' }}>暂无文档</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;