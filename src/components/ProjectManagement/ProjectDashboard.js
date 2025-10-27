import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import CreateProject from './CreateProject';
import styles from './ProjectManagement.module.css';

const ProjectDashboard = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.PROJECTS);
      setProjects(response.data);
    } catch (error) {
      setError('获取项目列表失败');
      console.error('获取项目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowCreateProject(false);
  };

  const handleCreateProject = () => {
    setShowCreateProject(true);
    setSelectedProject(null);
  };

  const handleProjectCreated = () => {
    setShowCreateProject(false);
    fetchProjects(); // 刷新项目列表
  };

  const handleProjectUpdated = () => {
    fetchProjects(); // 刷新项目列表
    if (selectedProject) {
      // 重新获取选中项目的详情
      fetchProjectDetail(selectedProject.id);
    }
  };

  const fetchProjectDetail = async (projectId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.PROJECT_DETAIL(projectId));
      setSelectedProject(response.data);
    } catch (error) {
      console.error('获取项目详情失败:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setShowCreateProject(false);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.dashboard}>
        {/* 顶部导航栏 */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>项目管理系统</h1>
            <div className={styles.userInfo}>
              <span className={styles.welcome}>
                欢迎，{user.full_name || user.username}
              </span>
              <span className={styles.role}>
                ({user.role === 'admin' ? '管理员' : '客户'})
              </span>
              <button 
                className={styles.logoutButton}
                onClick={onLogout}
              >
                退出登录
              </button>
            </div>
          </div>
        </header>

        {/* 主要内容区域 */}
        <main className={styles.mainContent}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
              <button onClick={() => setError('')}>×</button>
            </div>
          )}

          {/* 侧边栏 */}
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              <button 
                className={`${styles.navButton} ${!selectedProject && !showCreateProject ? styles.active : ''}`}
                onClick={handleBackToList}
              >
                📊 项目列表
              </button>
              
              {user.role === 'admin' && (
                <button 
                  className={`${styles.navButton} ${showCreateProject ? styles.active : ''}`}
                  onClick={handleCreateProject}
                >
                  ➕ 创建项目
                </button>
              )}
              
              {selectedProject && (
                <div className={styles.selectedProject}>
                  <h4>当前项目</h4>
                  <p>{selectedProject.name}</p>
                </div>
              )}
            </nav>
          </aside>

          {/* 内容区域 */}
          <section className={styles.content}>
            {selectedProject ? (
              <ProjectDetail 
                project={selectedProject}
                user={user}
                onProjectUpdated={handleProjectUpdated}
                onBack={handleBackToList}
              />
            ) : (
              <ProjectList 
                projects={projects}
                user={user}
                onProjectSelect={handleProjectSelect}
                onRefresh={fetchProjects}
              />
            )}
          </section>
        </main>
      </div>

      {/* 全屏对话框 - 放在最外层 */}
      {showCreateProject && (
        <CreateProject 
          onProjectCreated={handleProjectCreated}
          onCancel={handleBackToList}
        />
      )}
    </>
  );
};

export default ProjectDashboard;
