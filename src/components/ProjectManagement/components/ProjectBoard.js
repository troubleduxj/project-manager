import React, { useState, useEffect } from 'react';

// SVG 图标组件
const Icon = ({ name, size = 32, color = 'currentColor', className = '' }) => {
  const icons = {
    'task-list': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 11l2 2 4-4" />
        <line x1="7" y1="17" x2="17" y2="17" />
      </svg>
    ),
    'check-circle': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.1" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    ),
    'refresh': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
      </svg>
    ),
    'alert-circle': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.1" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    'trending-up': (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    )
  };
  
  return (
    <div className={className} style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
      {icons[name] || icons['task-list']}
    </div>
  );
};

const ProjectBoard = ({ selectedProject, projectTasks, user, isMobile, systemSettings }) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [subTasks, setSubTasks] = useState({});

  // 调试：打印接收到的 props
  console.log('📊 ProjectBoard 接收的数据:', {
    selectedProject: selectedProject?.name,
    projectTasksCount: projectTasks?.length || 0,
    projectTasks: projectTasks,
    user: user?.username,
    isMobile
  });

  // 获取主任务（没有parent_task_id的任务）
  const mainTasks = projectTasks.filter(task => !task.parent_task_id);
  
  console.log('📋 主任务筛选结果:', {
    原始任务数: projectTasks.length,
    主任务数: mainTasks.length,
    主任务: mainTasks.map(t => ({
      id: t.id,
      title: t.title,
      parent_task_id: t.parent_task_id,
      hasParent: !!t.parent_task_id
    }))
  });

  // 计算统计数据（只统计主任务）
  const totalTasks = mainTasks.length;
  const completedTasks = mainTasks.filter(task => task.status === 'done').length;
  const inProgressTasks = mainTasks.filter(task => task.status === 'in_progress').length;
  const todoTasks = mainTasks.filter(task => 
    task.status === 'todo' || 
    task.status === 'pending' || 
    task.status === 'not_started' ||
    !task.status
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 加载子任务
  useEffect(() => {
    if (projectTasks.length === 0) {
      console.log('⚠️ 没有任务数据');
      return;
    }
    
    const newSubTasks = {};
    // 在useEffect内部计算主任务，避免依赖循环
    const mainTasksList = projectTasks.filter(task => !task.parent_task_id);
    
    console.log('🎯 看板调试信息:', {
      项目名称: selectedProject?.name,
      总任务数: projectTasks.length,
      主任务数: mainTasksList.length,
      主任务列表: mainTasksList.map(t => ({ id: t.id, title: t.title }))
    });
    
    for (const task of mainTasksList) {
      const children = projectTasks.filter(t => t.parent_task_id === task.id);
      if (children.length > 0) {
        newSubTasks[task.id] = children;
      }
    }
    
    setSubTasks(newSubTasks);
    console.log('📊 子任务加载完成:', newSubTasks);
  }, [projectTasks, selectedProject]);

  // 切换任务展开/折叠
  const toggleTaskExpansion = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
      console.log('📁 折叠任务:', taskId);
    } else {
      newExpanded.add(taskId);
      console.log('📂 展开任务:', taskId, '子任务:', subTasks[taskId]);
    }
    setExpandedTasks(newExpanded);
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return '#28a745';
      case 'in_progress': return '#007bff';
      case 'blocked': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <Icon name="check-circle" size={20} color="#28a745" />;
      case 'in_progress': return <Icon name="refresh" size={20} color="#007bff" />;
      case 'blocked': return <Icon name="alert-circle" size={20} color="#dc3545" />;
      default: return <Icon name="task-list" size={20} color="#6c757d" />;
    }
  };

  // 获取优先级信息
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high': return { bg: '#f8d7da', color: '#721c24', text: '高' };
      case 'medium': return { bg: '#fff3cd', color: '#856404', text: '中' };
      case 'low': return { bg: '#d1ecf1', color: '#0c5460', text: '低' };
      default: return null;
    }
  };

  // 导出甘特图功能
  const handleExportGantt = () => {
    try {
      const ganttData = generateGanttChart();
      const svgContent = createGanttSVG(ganttData);
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `甘特图_${new Date().toISOString().split('T')[0]}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('✅ 甘特图导出成功！');
    } catch (error) {
      console.error('导出甘特图失败:', error);
      alert('❌ 导出甘特图失败：' + error.message);
    }
  };

  // 生成甘特图数据
  const generateGanttChart = () => {
    const tasks = [];
    const today = new Date();
    
    mainTasks.forEach((task, index) => {
      let startDate, endDate;
      
      if (task.start_date) {
        startDate = new Date(task.start_date);
      } else {
        switch (task.status) {
          case 'done':
          case 'completed':
            startDate = new Date(today.getTime() - (14 + index * 2) * 24 * 60 * 60 * 1000);
            break;
          case 'in_progress':
            startDate = new Date(today.getTime() - (7 + index) * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(today.getTime() + index * 24 * 60 * 60 * 1000);
        }
      }
      
      if (task.due_date || task.end_date) {
        endDate = new Date(task.due_date || task.end_date);
      } else {
        endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      }
      
      if (endDate <= startDate) {
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      }
      
      const taskName = task.task_name || task.name || task.title || '未命名任务';
      
      tasks.push({
        id: task.id,
        name: taskName,
        startDate,
        endDate,
        progress: task.progress || 0,
        status: task.status,
        level: 0
      });
      
      if (subTasks[task.id] && Array.isArray(subTasks[task.id]) && subTasks[task.id].length > 0) {
        subTasks[task.id].forEach((subTask, subIndex) => {
          let subStartDate, subEndDate;
          
          if (subTask.start_date) {
            subStartDate = new Date(subTask.start_date);
          } else {
            const taskDuration = endDate - startDate;
            const offset = (taskDuration / (subTasks[task.id].length + 1)) * (subIndex + 1);
            subStartDate = new Date(startDate.getTime() + offset);
          }
          
          if (subTask.due_date || subTask.end_date) {
            subEndDate = new Date(subTask.due_date || subTask.end_date);
          } else {
            subEndDate = new Date(subStartDate.getTime() + (3 + subIndex) * 24 * 60 * 60 * 1000);
          }
          
          if (subEndDate <= subStartDate) {
            subEndDate = new Date(subStartDate.getTime() + 24 * 60 * 60 * 1000);
          }
          
          const subTaskName = subTask.task_name || subTask.name || subTask.title || '未命名子任务';
          
          tasks.push({
            id: subTask.id,
            name: subTaskName,
            startDate: subStartDate,
            endDate: subEndDate,
            progress: subTask.progress || 0,
            status: subTask.status,
            level: 1
          });
        });
      }
    });
    
    return tasks;
  };

  // 创建甘特图SVG
  const createGanttSVG = (tasks) => {
    if (!tasks || !Array.isArray(tasks)) {
      throw new Error('任务数据格式错误');
    }
    if (tasks.length === 0) {
      throw new Error('没有任务数据可导出');
    }
    
    const systemName = systemSettings?.site_name || '项目管理系统';
    const maxWidth = 1800;
    const maxHeight = 900;
    const leftMargin = 220;
    const topMargin = 130;
    const taskHeight = 35;
    const taskSpacing = 50;
    
    const headerHeight = 90;
    const headerSpacing = 40;
    const bottomMargin = 30;
    const estimatedHeight = Math.min(maxHeight, Math.max(400, headerHeight + headerSpacing + tasks.length * taskSpacing + bottomMargin));
    const width = maxWidth;
    const height = estimatedHeight;
    
    const allDates = tasks.flatMap(task => [task.startDate, task.endDate]);
    const minDate = new Date(Math.min(...allDates));
    const maxDate = new Date(Math.max(...allDates));
    
    const startOfWeek = new Date(minDate);
    startOfWeek.setDate(minDate.getDate() - minDate.getDay());
    const endOfWeek = new Date(maxDate);
    endOfWeek.setDate(maxDate.getDate() + (6 - maxDate.getDay()));
    
    const totalDays = Math.ceil((endOfWeek - startOfWeek) / (1000 * 60 * 60 * 24)) + 1;
    const totalWeeks = Math.ceil(totalDays / 7);
    
    const rightMargin = 40;
    const timelineWidth = width - leftMargin - rightMargin;
    const dayWidth = timelineWidth / totalDays;
    
    const statusColors = {
      'done': '#28a745',
      'completed': '#28a745',
      'in_progress': '#007bff', 
      'blocked': '#dc3545',
      'todo': '#6c757d',
      'pending': '#6c757d'
    };
    
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .title { font-family: 'Microsoft YaHei', sans-serif; font-size: 22px; font-weight: bold; fill: #2c3e50; }
          .subtitle { font-family: 'Microsoft YaHei', sans-serif; font-size: 13px; fill: #7f8c8d; }
          .task-name { font-family: 'Microsoft YaHei', sans-serif; font-size: 14px; font-weight: 600; fill: #2c3e50; }
          .task-name-sub { font-family: 'Microsoft YaHei', sans-serif; font-size: 12px; font-weight: 500; fill: #5a6c7d; }
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
      
      <rect width="${width}" height="${height}" fill="#f8f9fa"/>
      <rect x="0" y="0" width="${width}" height="${headerHeight}" fill="url(#taskBgGradient)" stroke="#e9ecef" stroke-width="1"/>
      
      <text x="${width/2}" y="35" text-anchor="middle" class="title">📊 ${systemName} - 进度甘特图</text>
      <text x="${width/2}" y="60" text-anchor="middle" class="subtitle">生成时间: ${new Date().toLocaleString('zh-CN')}</text>
      
      <rect x="0" y="${headerHeight}" width="${leftMargin}" height="${height - headerHeight}" fill="url(#taskBgGradient)" stroke="#e9ecef" stroke-width="1"/>
      <line x1="${leftMargin}" y1="${topMargin}" x2="${leftMargin + timelineWidth}" y2="${topMargin}" stroke="#495057" stroke-width="2"/>
    `;
    
    for (let week = 0; week < totalWeeks; week++) {
      const weekStartDate = new Date(startOfWeek.getTime() + week * 7 * 24 * 60 * 60 * 1000);
      const weekEndDate = new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000);
      const x = leftMargin + (week * 7 * dayWidth);
      const weekDisplayWidth = 7 * dayWidth;
      
      if (x < leftMargin + timelineWidth) {
        svgContent += `<line x1="${x}" y1="${topMargin - 8}" x2="${x}" y2="${topMargin + 8}" stroke="#495057" stroke-width="2"/>`;
        
        if (weekDisplayWidth > 50) {
          const weekLabel = `${weekStartDate.getMonth() + 1}/${weekStartDate.getDate()}-${weekEndDate.getMonth() + 1}/${weekEndDate.getDate()}`;
          svgContent += `
            <text x="${x + weekDisplayWidth/2}" y="${topMargin - 12}" text-anchor="middle" class="date-label">第${week + 1}周</text>
            <text x="${x + weekDisplayWidth/2}" y="${topMargin - 25}" text-anchor="middle" class="date-label" style="font-size: 9px;">${weekLabel}</text>
          `;
        }
      }
    }
    
    // 确保tasks是有效的数组
    if (!Array.isArray(tasks)) {
      console.error('❌ tasks不是数组:', tasks);
      throw new Error('任务数据格式错误');
    }
    
    console.log('📊 甘特图任务数据:', tasks.length, '个任务');
    
    tasks.forEach((task, index) => {
      if (!task || !task.startDate || !task.endDate || !task.name) {
        console.error('❌ 任务数据不完整:', index, task);
        return;
      }
      
      const y = topMargin + 20 + index * taskSpacing;
      const startX = leftMargin + ((task.startDate - startOfWeek) / (1000 * 60 * 60 * 24)) * dayWidth;
      const taskWidth = Math.max(25, ((task.endDate - task.startDate) / (1000 * 60 * 60 * 24)) * dayWidth);
      const color = statusColors[task.status] || '#6c757d';
      const indent = task.level * 20;
      
      if (index > 0) {
        svgContent += `<line x1="0" y1="${y - 20}" x2="${width}" y2="${y - 20}" stroke="#e9ecef" stroke-width="1" stroke-dasharray="3,3"/>`;
      }
      
      const maxLength = task.level === 0 ? 20 : 18;
      const taskName = String(task.name || '未命名任务');
      const displayName = taskName.length > maxLength ? taskName.substring(0, maxLength - 3) + '...' : taskName;
      svgContent += `<text x="${indent + 10}" y="${y + 3}" class="${task.level === 0 ? 'task-name' : 'task-name-sub'}">${task.level === 1 ? '└ ' : ''}${displayName}</text>`;
      
      svgContent += `<rect x="${startX}" y="${y - 15}" width="${taskWidth}" height="${taskHeight}" fill="${color}20" stroke="${color}" stroke-width="1" rx="4"/>`;
      
      if (task.progress > 0) {
        const progressWidth = (taskWidth * task.progress) / 100;
        svgContent += `<rect x="${startX}" y="${y - 15}" width="${progressWidth}" height="${taskHeight}" fill="url(#progressGradient)" rx="4"/>`;
      }
      
      if (task.progress > 0 && taskWidth > 40) {
        svgContent += `<text x="${startX + taskWidth/2}" y="${y + 8}" text-anchor="middle" class="progress-text">${task.progress}%</text>`;
      }
      
      const statusText = {
        'done': '完成', 'completed': '完成', 'in_progress': '进行中', 
        'blocked': '受阻', 'todo': '待办', 'pending': '待办'
      }[task.status] || '待办';
      
      svgContent += `
        <rect x="${startX + taskWidth + 10}" y="${y - 10}" width="50" height="20" fill="${color}" rx="10"/>
        <text x="${startX + taskWidth + 35}" y="${y + 3}" text-anchor="middle" style="font-family: 'Microsoft YaHei', sans-serif; font-size: 10px; fill: white; font-weight: bold;">${statusText}</text>
      `;
    });
    
    svgContent += `</svg>`;
    return svgContent;
  };

  // 任务进度项组件
  const TaskProgressItem = ({ task, level = 0 }) => {
    const hasSubTasks = subTasks[task.id] && subTasks[task.id].length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const isMainTask = level === 0;
    const priorityInfo = getPriorityInfo(task.priority);
    
    return (
      <div style={{ marginBottom: isMobile ? '8px' : '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: isMobile ? '16px' : '20px 24px',
            background: level === 0 
              ? 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: `1px solid ${level === 0 ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
            borderRadius: level === 0 ? '12px' : '8px',
            cursor: isMainTask && hasSubTasks ? 'pointer' : 'default',
            marginLeft: isMobile ? level * 12 : level * 24,
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => isMainTask && hasSubTasks && toggleTaskExpansion(task.id)}
          onMouseEnter={(e) => {
            if (isMainTask && !isMobile) {
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (isMainTask && !isMobile) {
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
          
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            {/* 展开/折叠按钮 */}
            {isMainTask && hasSubTasks && (
              <div style={{ 
                marginRight: isMobile ? '8px' : '16px',
                width: isMobile ? '28px' : '32px',
                height: isMobile ? '28px' : '32px',
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
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
                flexShrink: 0
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

            {/* 状态图标 */}
            <div style={{
              marginRight: isMobile ? '8px' : '16px',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0
            }}>
              {getStatusIcon(task.status)}
            </div>

            {/* 任务信息 */}
            <div style={{ 
              flex: 1, 
              minWidth: isMobile ? '100%' : 0,
              marginBottom: isMobile ? '8px' : 0
            }}>
              {/* 任务标题 */}
              <div style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: isMainTask ? '600' : '500',
                color: '#2c3e50',
                marginBottom: '4px'
              }}>
                {task.title}
              </div>
              {/* 任务描述 */}
              {task.description && (
                <div style={{
                  fontSize: isMobile ? '12px' : '13px',
                  color: '#6c757d',
                  marginTop: '4px'
                }}>
                  {task.description}
                </div>
              )}
            </div>

            {/* 任务标签 */}
            <div style={{
              display: 'flex',
              gap: isMobile ? '6px' : '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginLeft: isMobile ? 0 : '16px'
            }}>
              {/* 优先级标签 */}
              {priorityInfo && (
                <span style={{
                  padding: isMobile ? '4px 10px' : '6px 12px',
                  borderRadius: '20px',
                  background: priorityInfo.bg,
                  color: priorityInfo.color,
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  {priorityInfo.text}
                </span>
              )}

              {/* 子任务数量 */}
              {hasSubTasks && (
                <span style={{
                  padding: isMobile ? '4px 10px' : '6px 12px',
                  borderRadius: '20px',
                  background: '#e7f3ff',
                  color: '#0066cc',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  {subTasks[task.id].length} 个子任务
                </span>
              )}

              {/* 进度百分比 */}
              {task.progress !== undefined && task.progress > 0 && (
                <span style={{
                  padding: isMobile ? '4px 10px' : '6px 12px',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${getStatusColor(task.status)}20, ${getStatusColor(task.status)}10)`,
                  color: getStatusColor(task.status),
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  {task.progress}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 子任务 */}
        {isExpanded && hasSubTasks && (
          <div style={{ marginTop: '8px' }}>
            {subTasks[task.id].map(subTask => (
              <TaskProgressItem key={subTask.id} task={subTask} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // 统计卡片组件
  const StatCard = ({ title, value, icon, color, description }) => (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: isMobile ? '12px' : '16px',
      padding: isMobile ? '20px' : '28px',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
    }}
    onMouseEnter={(e) => {
      if (!isMobile) {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isMobile) {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }}>
      {/* 装饰性背景 */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: isMobile ? '60px' : '80px',
        height: isMobile ? '60px' : '80px',
        background: `linear-gradient(135deg, ${color || '#495057'}20, ${color || '#495057'}10)`,
        borderRadius: '50%',
        opacity: 0.6
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <div style={{
            fontSize: isMobile ? '12px' : '14px',
            color: '#6c757d',
            marginBottom: isMobile ? '8px' : '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </div>
          <div style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: 'bold',
            color: color || '#495057',
            marginBottom: isMobile ? '4px' : '8px',
            lineHeight: '1'
          }}>
            {value}
          </div>
          {description && (
            <div style={{
              fontSize: isMobile ? '11px' : '12px',
              color: '#adb5bd',
              fontWeight: '500'
            }}>
              {description}
            </div>
          )}
        </div>
        <div style={{ marginLeft: '12px', flexShrink: 0 }}>
          <Icon name={icon} size={isMobile ? 36 : 44} color={color || '#495057'} />
        </div>
      </div>
    </div>
  );

  if (!selectedProject) {
    return (
      <div style={{
        textAlign: 'center',
        padding: isMobile ? '40px 20px' : '60px 20px',
        color: '#6c757d'
      }}>
        <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: '16px' }}>📊</div>
        <h3 style={{ fontSize: isMobile ? '18px' : '20px', marginTop: '16px' }}>请选择一个项目</h3>
        <p style={{ fontSize: isMobile ? '13px' : '14px' }}>选择一个项目来查看任务看板</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: isMobile ? '16px' : '24px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* 项目标题横幅 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '20px' : '32px',
        color: 'white',
        marginBottom: isMobile ? '20px' : '32px',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 装饰性背景元素 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: isMobile ? '120px' : '150px',
          height: isMobile ? '120px' : '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: isMobile ? '80px' : '100px',
          height: isMobile ? '80px' : '100px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>📊</span>
            {selectedProject.name}
          </h1>
          <p style={{
            margin: 0,
            fontSize: isMobile ? '14px' : '15px',
            opacity: 0.95
          }}>
            {selectedProject.description || '项目看板 - 任务汇总与进度跟踪'}
          </p>
        </div>
      </div>

      {/* 任务统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '12px' : '20px',
        marginBottom: isMobile ? '20px' : '32px'
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
          description={`完成率 ${completionRate}%`}
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
      </div>

      {/* 任务进度 */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '16px' : '24px',
        border: '1px solid rgba(102, 126, 234, 0.15)',
        boxShadow: '0 2px 12px rgba(102, 126, 234, 0.08)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: isMobile ? '12px' : '16px'
        }}>
          <h3 style={{ 
            margin: 0,
            color: '#495057',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Icon name="trending-up" size={20} color="#495057" />
            任务进度
          </h3>
          
          {/* 导出甘特图按钮 */}
          {mainTasks.length > 0 && (
            <button
              onClick={() => handleExportGantt()}
              style={{
                padding: isMobile ? '6px 12px' : '8px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              <Icon name="download" size={isMobile ? 14 : 16} color="white" />
              {!isMobile && '导出甘特图'}
            </button>
          )}
        </div>
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '8px' : '12px',
          padding: isMobile ? '12px' : '20px',
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
              padding: isMobile ? '30px 20px' : '40px 20px',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: isMobile ? '40px' : '48px', marginBottom: '12px' }}>📝</div>
              <h4 style={{ fontSize: isMobile ? '16px' : '18px', margin: '0 0 8px 0' }}>暂无任务</h4>
              <p style={{ fontSize: isMobile ? '12px' : '14px', margin: 0 }}>
                {user.role === 'admin' ? '点击"任务管理"创建新任务' : '系统中还没有任务'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;
