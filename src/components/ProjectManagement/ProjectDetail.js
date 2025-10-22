import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectProgress from './ProjectProgress';
import DocumentManager from './DocumentManager';
import MessageCenter from './MessageCenter';
import styles from './ProjectManagement.module.css';

const ProjectDetail = ({ project, user, onProjectUpdated, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projectData, setProjectData] = useState(project);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProjectData(project);
  }, [project]);

  const getStatusText = (status) => {
    const statusMap = {
      'planning': '规划中',
      'in_progress': '进行中',
      'completed': '已完成',
      'on_hold': '暂停',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'planning': '#6c757d',
      'in_progress': '#007bff',
      'completed': '#28a745',
      'on_hold': '#ffc107',
      'cancelled': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  };

  const getPriorityText = (priority) => {
    const priorityMap = {
      'low': '低',
      'medium': '中',
      'high': '高',
      'urgent': '紧急'
    };
    return priorityMap[priority] || priority;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `¥${parseFloat(amount).toLocaleString()}`;
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`确定要将项目状态更改为"${getStatusText(newStatus)}"吗？`)) {
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:3001/api/projects/${projectData.id}`, {
        ...projectData,
        status: newStatus
      });
      
      setProjectData({ ...projectData, status: newStatus });
      onProjectUpdated();
    } catch (error) {
      alert('更新项目状态失败');
      console.error('更新项目状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '项目概览', icon: '📊' },
    { id: 'progress', label: '进度管理', icon: '📈' },
    { id: 'documents', label: '文档管理', icon: '📄' },
    { id: 'messages', label: '项目沟通', icon: '💬' }
  ];

  return (
    <div className={styles.projectDetail}>
      {/* 项目头部 */}
      <div className={styles.projectHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={onBack}>
            ← 返回列表
          </button>
          <div className={styles.projectTitle}>
            <h1>{projectData.name}</h1>
            <div className={styles.projectMeta}>
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(projectData.status) }}
              >
                {getStatusText(projectData.status)}
              </span>
              <span className={styles.priority}>
                优先级: {getPriorityText(projectData.priority)}
              </span>
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className={styles.headerActions}>
            <select 
              value={projectData.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={loading}
              className={styles.statusSelect}
            >
              <option value="planning">规划中</option>
              <option value="in_progress">进行中</option>
              <option value="on_hold">暂停</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
        )}
      </div>

      {/* 标签页导航 */}
      <div className={styles.tabNavigation}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 标签页内容 */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overview}>
            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <h3>项目信息</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>项目描述:</span>
                    <span>{projectData.description || '暂无描述'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>客户:</span>
                    <span>{projectData.client_name}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>项目经理:</span>
                    <span>{projectData.manager_name}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>开始时间:</span>
                    <span>{formatDate(projectData.start_date)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>结束时间:</span>
                    <span>{formatDate(projectData.end_date)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>预算:</span>
                    <span>{formatCurrency(projectData.budget)}</span>
                  </div>
                </div>
              </div>

              <div className={styles.overviewCard}>
                <h3>项目进度</h3>
                <div className={styles.progressOverview}>
                  <div className={styles.progressCircle}>
                    <div className={styles.progressValue}>
                      {projectData.progress}%
                    </div>
                  </div>
                  <div className={styles.progressInfo}>
                    <p>当前进度: {projectData.progress}%</p>
                    <p>状态: {getStatusText(projectData.status)}</p>
                    {projectData.tasks && (
                      <p>任务数量: {projectData.tasks.length}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {projectData.tasks && projectData.tasks.length > 0 && (
              <div className={styles.overviewCard}>
                <h3>最近任务</h3>
                <div className={styles.recentTasks}>
                  {projectData.tasks.slice(0, 5).map(task => (
                    <div key={task.id} className={styles.taskItem}>
                      <div className={styles.taskInfo}>
                        <span className={styles.taskName}>{task.task_name}</span>
                        <span className={styles.taskProgress}>{task.progress}%</span>
                      </div>
                      <div className={styles.taskProgressBar}>
                        <div 
                          className={styles.taskProgressFill}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <ProjectProgress 
            project={projectData}
            user={user}
            onProgressUpdated={onProjectUpdated}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentManager 
            project={projectData}
            user={user}
          />
        )}

        {activeTab === 'messages' && (
          <MessageCenter 
            project={projectData}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
