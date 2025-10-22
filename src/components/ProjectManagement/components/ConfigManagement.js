import React, { useState, useEffect } from 'react';
import SystemConfig from './ConfigManagement/SystemConfig';
import UserManagement from './ConfigManagement/UserManagement';
import EmailConfig from './ConfigManagement/EmailConfig';
import EmailTemplatesConfig from './ConfigManagement/EmailTemplatesConfig';
import ProjectConfig from './ConfigManagement/ProjectConfig';

const ConfigManagement = ({ user, initialTab = 'system' }) => {
  const [activeConfigTab, setActiveConfigTab] = useState(initialTab);
  const [systemSettings, setSystemSettings] = useState({
    site_name: '项目管理系统',
    site_description: '高效的项目管理和协作平台',
    admin_email: 'admin@example.com',
    max_users: 100,
    enable_notifications: true,
    backup_frequency: 'daily',
    theme: 'light'
  });

  // 获取系统设置
  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const response = await fetch('http://localhost:7080/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const settings = await response.json();
        setSystemSettings(settings);
      }
    } catch (error) {
      console.error('获取系统设置失败:', error);
    }
  };

  // 配置选项卡
  const configTabs = [
    { key: 'system', label: '系统配置', icon: '⚙️' },
    { key: 'users', label: '用户管理', icon: '👥' },
    { key: 'project', label: '项目配置', icon: '🎯' },
    { key: 'email', label: '邮件配置', icon: '📧' },
    { key: 'email-templates', label: '邮件模板配置', icon: '📝' }
  ];

  // 渲染配置内容
  const renderConfigContent = () => {
    switch (activeConfigTab) {
      case 'system':
        return (
          <SystemConfig 
            systemSettings={systemSettings}
            setSystemSettings={setSystemSettings}
            user={user}
          />
        );
      case 'users':
        return (
          <UserManagement 
            user={user}
          />
        );
      case 'project':
        return (
          <ProjectConfig 
            user={user}
          />
        );
      case 'email':
        return (
          <EmailConfig 
            user={user}
          />
        );
      case 'email-templates':
        return (
          <EmailTemplatesConfig 
            systemSettings={systemSettings}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      padding: '24px',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* 页面标题 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            color: '#1a73e8', 
            fontSize: '28px',
            fontWeight: '600'
          }}>
            ⚙️ 配置管理
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#666', 
            fontSize: '16px' 
          }}>
            管理系统配置、用户权限、项目设置和邮件通知
          </p>
        </div>

        {/* 配置选项卡 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* 选项卡导航 */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e0e0e0',
            background: '#fafafa'
          }}>
            {configTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveConfigTab(tab.key)}
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  border: 'none',
                  background: activeConfigTab === tab.key ? 'white' : 'transparent',
                  color: activeConfigTab === tab.key ? '#1a73e8' : '#666',
                  fontSize: '14px',
                  fontWeight: activeConfigTab === tab.key ? '600' : '400',
                  cursor: 'pointer',
                  borderBottom: activeConfigTab === tab.key ? '2px solid #1a73e8' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 配置内容 */}
          <div style={{ 
            padding: '32px',
            background: 'white',
            minHeight: '600px'
          }}>
            {renderConfigContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigManagement;