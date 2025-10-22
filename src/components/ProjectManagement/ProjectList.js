import React from 'react';
import styles from './ProjectManagement.module.css';

const ProjectList = ({ projects, user, onProjectSelect, onRefresh }) => {
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

  const getPriorityColor = (priority) => {
    const colorMap = {
      'low': '#28a745',
      'medium': '#ffc107',
      'high': '#fd7e14',
      'urgent': '#dc3545'
    };
    return colorMap[priority] || '#6c757d';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <h3>暂无项目</h3>
        <p>
          {user.role === 'admin' 
            ? '点击"创建项目"开始添加新项目' 
            : '暂时没有分配给您的项目'
          }
        </p>
        <button className={styles.refreshButton} onClick={onRefresh}>
          刷新列表
        </button>
      </div>
    );
  }

  return (
    <div className={styles.projectList}>
      <div className={styles.listHeader}>
        <h2>项目列表</h2>
        <div className={styles.listActions}>
          <button className={styles.refreshButton} onClick={onRefresh}>
            🔄 刷新
          </button>
        </div>
      </div>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={styles.projectCard}
            onClick={() => onProjectSelect(project)}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.projectName}>{project.name}</h3>
              <div className={styles.cardBadges}>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {getStatusText(project.status)}
                </span>
                <span 
                  className={styles.priorityBadge}
                  style={{ backgroundColor: getPriorityColor(project.priority) }}
                >
                  {getPriorityText(project.priority)}
                </span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <p className={styles.projectDescription}>
                {project.description || '暂无描述'}
              </p>

              <div className={styles.progressSection}>
                <div className={styles.progressLabel}>
                  <span>进度</span>
                  <span>{project.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.projectMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>客户：</span>
                  <span>{project.client_name || '未分配'}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>经理：</span>
                  <span>{project.manager_name || '未分配'}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>开始时间：</span>
                  <span>{formatDate(project.start_date)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>结束时间：</span>
                  <span>{formatDate(project.end_date)}</span>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <small className={styles.createTime}>
                创建于 {formatDate(project.created_at)}
              </small>
              <div className={styles.cardActions}>
                <button className={styles.viewButton}>
                  查看详情 →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
