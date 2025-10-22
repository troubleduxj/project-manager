import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginForm from './Auth/LoginForm';
import RegisterForm from './Auth/RegisterForm';
import ProjectDashboard from './ProjectManagement/ProjectDashboard';
import '../css/app.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查是否有保存的登录状态
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // 设置axios默认header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('解析用户数据失败:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    // 可以显示成功消息
    alert('注册成功！请使用新账户登录。');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const switchToRegister = () => {
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#495057', fontSize: '16px' }}>系统初始化中...</p>
      </div>
    );
  }

  // 如果用户已登录，显示项目管理界面
  if (user) {
    return (
      <div className="project-management-app">
        <ProjectDashboard 
          user={user} 
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // 如果用户未登录，显示登录/注册界面
  return (
    <div className="project-management-app">
      {showRegister ? (
        <RegisterForm 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      ) : (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      )}
    </div>
  );
};

export default App;
