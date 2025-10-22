import React, { useState, useEffect } from 'react';

const ProjectBoard = ({ selected Project, projectTasks, user, isMobile }) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [subTasks, setSubTasks] = useState({});

  // 获取主任务（没有parent_task_id的任务）
  const mainTasks = projectTasks.filter(task => !task.parent_task_id);

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
    const loadSubTasks = async () => {
      const newSubTasks = {};
      for (const task of mainTasks) {
        const children = projectTasks.filter(t => t.parent_task_id === task.id);
        if (children.length > 0) {
          newSubTasks[task.id] = children;
        }
      }
      setSubTasks(newSubTasks);
    };

    if (projectTasks.length > 0) {
      loadSubTasks();
    }
  }, [projectTasks]);

  // 切换任务展开/折叠
  const toggleTaskExpansion = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  // 获取状态图标
  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return '✅';
      case 'in_progress': return '🔄';
      case 'blocked': return '🚫';
      default: return '📋';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return { bg: '#d4edda', color: '#155724', text: '已完成' };
      case 'in_progress': return { bg: '#d1ecf1', color: '#0c5460', text: '进行中' };
      case 'blocked': return { bg: '#f8d7da', color: '#721c24', text: '受阻' };
      default: return { bg: '#fff3cd', color: '#856404', text: '待办' };
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return { bg: '#f8d7da', color: '#721c24', text: '高' };
      case 'medium': return { bg: '#fff3cd', color: '#856404', text: '中' };
      case 'low': return { bg: '#d1ecf1', color: '#0c5460', text: '低' };
      default: return { bg: '#e2e3e5', color: '#383d41', text: '无' };
    }
  };

  // 任务进度项组件
  const TaskProgressItem = ({ task, level = 0 }) => {
    const hasSubTasks = subTasks[task.id] && subTasks[task.id].length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const isMainTask = level === 0;
    const statusInfo = getStatusColor(task.status);
    const priorityInfo = getPriorityColor(task.priority);
    
    return (
      <div style={{ marginBottom: isMobile ? '8px' : '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: isMobile ? '16px' : '20px 24px',
            background: level === 0 ? 'white' : '#f8f9fa',
            border: `1px solid ${level === 0 ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.05)'}',
            borderRadius: level === 0 ? '12px' : '8px',
            cursor: isMainTask && hasSubTasks ? 'pointer' : 'default',
            marginLeft: isMobile ? level * 12 : level * 24,
            transition: 'all 0.3s ease',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}
          onClick={() => isMainTask && hasSubTasks && toggleTaskExpansion(task.id)}
        >
          {/* 展开图标 */}
          {isMainTask && hasSubTasks && (
            <div style={{
              marginRight: '12px',
              fontSize: isMobile ? '14px' : '16px',
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              ▶
            </div>
          )}

          {/* 状态图标 */}
          <div style={{
            fontSize: isMobile ? '20px' : '24px',
            marginRight: isMobile ? '8px' : '16px'
          }}>
            {getStatusIcon(task.status)}
          </div>

          {/* 任务信息 */}
          <div style={{ 
            flex: 1, 
            minWidth: isMobile ? '100%' : 0,
            marginBottom: isMobile ? '8px' : 0
          }}>
            <div style={{
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: isMainTask ? '600' : '500',
              color: '#2c3e50',
              marginBottom: '4px'
            }}>
              {task.title}
            </div>
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

          {/* 标签信息 */}
          <div style={{
            display: 'flex',
            gap: isMobile ? '4px' : '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginLeft: isMobile ? 0 : '16px'
          }}>
            {/* 状态标签 */}
            <span style={{
              padding: isMobile ? '4px 8px' : '6px 12px',
              borderRadius: '20px',
              background: statusInfo.bg,
              color: statusInfo.color,
              fontSize: isMobile ? '10px' : '12px',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}>
              {statusInfo.text}
            </span>

            {/* 优先级标签 */}
            {task.priority && task.priority !== 'none' && (
              <span style={{
                padding: isMobile ? '4px 8px' : '6px 12px',
                borderRadius: '20px',
                background: priorityInfo.bg,
                color: priorityInfo.color,
                fontSize: isMobile ? '10px' : '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                {priorityInfo.text}
              </span>
            )}

            {/* 子任务数量 */}
            {hasSubTasks && (
              <span style={{
                padding: isMobile ? '4px 8px' : '6px 12px',
                borderRadius: '20px',
                background: '#e7f3ff',
                color: '#0066cc',
                fontSize: isMobile ? '10px' : '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                {subTasks[task.id].length} 个子任务
              </span>
            )}
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
  const StatCard = ({ icon, title, value, color, percentage }) => (
    <div style={{
      background: 'white',
      borderRadius: isMobile ? '12px' : '16px',
      padding: isMobile ? '20px' : '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: `2px solid ${color}15`,
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <span style={{ fontSize: isMobile ? '32px' : '40px' }}>{icon}</span>
        {percentage !== undefined && (
          <div style={{
            padding: '4px 8px',
            background: `${color}15`,
            color: color,
            borderRadius: '12px',
            fontSize: isMobile ? '11px' : '12px',
            fontWeight: '600'
          }}>
            {percentage}%
          </div>
        )}
      </div>
      <div style={{
        fontSize: isMobile ? '28px' : '32px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: isMobile ? '12px' : '13px',
        color: '#6c757d',
        fontWeight: '500'
      }}>
        {title}
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
      padding: isMobile ? '16px' : '24px'
    }}>
      {/* 项目标题 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '24px 20px' : '32px',
        color: 'white',
        marginBottom: isMobile ? '20px' : '32px',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: isMobile ? '20px' : '28px',
          fontWeight: '700'
        }}>
          📊 {selectedProject.name}
        </h1>
        <p style={{
          margin: 0,
          fontSize: isMobile ? '13px' : '15px',
          opacity: 0.95
        }}>
          {selectedProject.description || '项目看板 - 任务汇总与进度跟踪'}
        </p>
      </div>

      {/* 任务统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: isMobile ? '12px' : '20px',
        marginBottom: isMobile ? '20px' : '32px'
      }}>
        <StatCard 
          icon="📋"
          title="总任务"
          value={totalTasks}
          color="#667eea"
        />
        <StatCard 
          icon="✅"
          title="已完成"
          value={completedTasks}
          color="#28a745"
          percentage={completionRate}
        />
        <StatCard 
          icon="🔄"
          title="进行中"
          value={inProgressTasks}
          color="#007bff"
        />
        <StatCard 
          icon="⏳"
          title="待办"
          value={todoTasks}
          color="#ffc107"
        />
      </div>

      {/* 任务进度 */}
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '20px 16px' : '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? '16px' : '24px',
          paddingBottom: isMobile ? '12px' : '16px',
          borderBottom: '2px solid #f1f3f4'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: '700',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📈</span>
            任务进度
          </h2>
          <div style={{
            padding: isMobile ? '6px 12px' : '8px 16px',
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            borderRadius: '20px',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: '600',
            color: '#667eea'
          }}>
            {mainTasks.length} 个主任务
          </div>
        </div>

        {/* 任务列表 */}
        {mainTasks.length > 0 ? (
          <div>
            {mainTasks.map(task => (
              <TaskProgressItem key={task.id} task={task} level={0} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '40px 20px' : '60px 40px',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: isMobile ? '16px' : '18px' }}>暂无任务</h3>
            <p style={{ fontSize: isMobile ? '12px' : '14px' }}>
              {user.role === 'admin' ? '点击"任务管理"创建新任务' : '系统中还没有任务'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBoard;

