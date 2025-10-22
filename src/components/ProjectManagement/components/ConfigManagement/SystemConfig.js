import React, { useState, useEffect } from 'react';

const SystemConfig = ({ systemSettings: initialSettings, setSystemSettings: updateParentSettings, user }) => {
  const [systemSettings, setSystemSettings] = useState(initialSettings || {
    site_name: '项目管理系统',
    site_description: '高效的项目管理解决方案',
    admin_email: 'admin@example.com',
    session_timeout: '30',
    enable_notifications: 'true',
    theme_color: '#1890ff',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai'
  });

  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalDocuments: 0,
    documentStorage: '0 MB',
    databaseSize: '0 MB',
    databasePath: 'N/A'
  });

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  // 预设主题颜色（目前仅支持蓝色）
  const themeColors = [
    { name: '蓝色（默认）', value: '#1890ff', supported: true },
    { name: '绿色', value: '#52c41a', supported: false },
    { name: '紫色', value: '#722ed1', supported: false },
    { name: '红色', value: '#f5222d', supported: false },
    { name: '橙色', value: '#fa8c16', supported: false },
    { name: '青色', value: '#13c2c2', supported: false },
    { name: '粉色', value: '#eb2f96', supported: false },
    { name: '黄色', value: '#fadb14', supported: false }
  ];

  // 当父组件的settings更新时，同步本地state
  useEffect(() => {
    if (initialSettings) {
      setSystemSettings(prev => ({ ...prev, ...initialSettings }));
    }
  }, [initialSettings]);

  // 组件挂载时获取系统配置和统计
  useEffect(() => {
    fetchSystemSettings();
    fetchSystemStats();
  }, []);

  // 获取系统配置
  const fetchSystemSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemSettings(prev => ({ ...prev, ...data }));
        if (updateParentSettings) {
          updateParentSettings(data);
        }
      }
    } catch (error) {
      console.error('获取系统配置失败:', error);
    }
  };

  // 获取系统统计信息
  const fetchSystemStats = async () => {
    setStatsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/system/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data);
      }
    } catch (error) {
      console.error('获取系统统计失败:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // 保存系统配置
  const handleSaveSystemSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // 批量更新设置
      const settingsToUpdate = {};
      Object.keys(systemSettings).forEach(key => {
        settingsToUpdate[key] = {
          value: systemSettings[key],
          description: getSettingDescription(key)
        };
      });
      
      const response = await fetch('http://localhost:7080/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsToUpdate)
      });
      
      if (response.ok) {
        alert('✅ 系统配置保存成功！');
        // 触发系统名称更新事件
        window.dispatchEvent(new CustomEvent('systemNameUpdated', {
          detail: { siteName: systemSettings.site_name }
        }));
        // 更新父组件状态
        if (updateParentSettings) {
          updateParentSettings(systemSettings);
        }
      } else {
        const errorData = await response.json();
        alert(`❌ 保存失败: ${errorData.error || '请重试'}`);
      }
    } catch (error) {
      console.error('保存系统配置失败:', error);
      alert('❌ 保存失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 获取设置项描述
  const getSettingDescription = (key) => {
    const descriptions = {
      site_name: '系统名称',
      site_description: '系统描述',
      admin_email: '管理员邮箱',
      session_timeout: '会话超时时间(分钟)',
      enable_notifications: '启用系统通知',
      theme_color: '主题颜色',
      language: '系统语言',
      timezone: '时区设置'
    };
    return descriptions[key] || key;
  };

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理语言变化
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    if (newLanguage === 'en-US') {
      alert('⚠️ 英文语言功能暂不支持，正在开发中...\n目前仅支持简体中文。');
      return;
    }
    handleInputChange('language', newLanguage);
  };

  // 处理主题颜色变化
  const handleThemeColorChange = (e) => {
    const newColor = e.target.value;
    const selectedTheme = themeColors.find(theme => theme.value === newColor);
    
    if (selectedTheme && !selectedTheme.supported) {
      alert(`⚠️ ${selectedTheme.name}主题暂不支持，功能开发中...\n目前仅支持蓝色主题。`);
      return;
    }
    handleInputChange('theme_color', newColor);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#1a73e8', 
          fontSize: '18px',
          fontWeight: '600'
        }}>
          ⚙️ 系统配置
        </h3>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#666', 
          fontSize: '14px' 
        }}>
          配置系统基本信息和全局设置
        </p>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {/* 基本信息 */}
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ 
            margin: '0 0 16px 0', 
            color: '#333',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🏢 基本信息
          </h4>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  系统名称 * <span style={{ fontSize: '12px', color: '#52c41a', marginLeft: '8px' }}>✓ 已实现</span>
                </label>
                <input
                  type="text"
                  value={systemSettings.site_name || ''}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                  placeholder="请输入系统名称"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  保存后将更新系统标题栏显示名称
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  管理员邮箱 <span style={{ fontSize: '12px', color: '#52c41a', marginLeft: '8px' }}>✓ 已实现</span>
                </label>
                <input
                  type="email"
                  value={systemSettings.admin_email || ''}
                  onChange={(e) => handleInputChange('admin_email', e.target.value)}
                  placeholder="admin@example.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  用于接收系统通知和管理员消息
                </div>
              </div>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#333'
              }}>
                系统描述 <span style={{ fontSize: '12px', color: '#52c41a', marginLeft: '8px' }}>✓ 已实现</span>
              </label>
              <textarea
                value={systemSettings.site_description || ''}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                rows={3}
                placeholder="请输入系统描述信息"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                系统的简要说明，将显示在登录页面
              </div>
            </div>
          </div>
        </div>

        {/* 系统设置 */}
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ 
            margin: '0 0 16px 0', 
            color: '#333',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🔧 系统设置
          </h4>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  会话超时 (分钟) <span style={{ fontSize: '12px', color: '#52c41a', marginLeft: '8px' }}>✓ 已实现</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={systemSettings.session_timeout || '30'}
                  onChange={(e) => handleInputChange('session_timeout', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  用户无操作后自动退出的时间
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  主题颜色 <span style={{ fontSize: '12px', color: '#fa8c16', marginLeft: '8px' }}>⚠ 部分支持</span>
                </label>
                <select
                  value={systemSettings.theme_color || '#1890ff'}
                  onChange={handleThemeColorChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {themeColors.map(theme => (
                    <option key={theme.value} value={theme.value}>
                      {theme.name} {theme.supported ? '✓' : '(开发中)'}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  当前预览色：
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    background: systemSettings.theme_color || '#1890ff',
                    marginLeft: '8px',
                    verticalAlign: 'middle',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}></span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  系统语言 <span style={{ fontSize: '12px', color: '#fa8c16', marginLeft: '8px' }}>⚠ 部分支持</span>
                </label>
                <select
                  value={systemSettings.language || 'zh-CN'}
                  onChange={handleLanguageChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="zh-CN">简体中文 ✓</option>
                  <option value="en-US">English (开发中)</option>
                </select>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  目前仅支持简体中文，英文正在开发中
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  时区设置 <span style={{ fontSize: '12px', color: '#52c41a', marginLeft: '8px' }}>✓ 已实现</span>
                </label>
                <select
                  value={systemSettings.timezone || 'Asia/Shanghai'}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                  <option value="UTC">世界标准时间 (UTC)</option>
                  <option value="America/New_York">纽约时间 (UTC-5)</option>
                  <option value="Europe/London">伦敦时间 (UTC+0)</option>
                  <option value="Asia/Tokyo">东京时间 (UTC+9)</option>
                </select>
              </div>
            </div>
            
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#333',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={systemSettings.enable_notifications === 'true' || systemSettings.enable_notifications === true}
                  onChange={(e) => handleInputChange('enable_notifications', e.target.checked ? 'true' : 'false')}
                  style={{ margin: 0 }}
                />
                启用系统通知 <span style={{ fontSize: '12px', color: '#52c41a', marginLeft: '8px' }}>✓ 已实现</span>
              </label>
              <div style={{ fontSize: '12px', color: '#999', marginLeft: '24px', marginTop: '4px' }}>
                启用后将显示系统重要消息和提醒
              </div>
            </div>
          </div>
        </div>

        {/* 系统统计 */}
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h4 style={{ 
              margin: 0, 
              color: '#333',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              📊 系统统计
            </h4>
            <button
              onClick={fetchSystemStats}
              disabled={statsLoading}
              style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                color: '#1976d2',
                cursor: statsLoading ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {statsLoading ? '刷新中...' : '🔄 刷新'}
            </button>
          </div>
          
          {statsLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#999'
            }}>
              加载统计数据中...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                padding: '16px',
                background: '#f0f7ff',
                borderRadius: '6px',
                border: '1px solid #bae7ff'
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: '#1976d2',
                  marginBottom: '4px'
                }}>
                  {systemStats.totalUsers}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  用户总数
                </div>
              </div>
              
              <div style={{
                padding: '16px',
                background: '#f6ffed',
                borderRadius: '6px',
                border: '1px solid #b7eb8f'
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: '#4caf50',
                  marginBottom: '4px'
                }}>
                  {systemStats.totalProjects}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  项目总数
                </div>
              </div>
              
              <div style={{
                padding: '16px',
                background: '#fff7e6',
                borderRadius: '6px',
                border: '1px solid #ffd591'
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: '#ff9800',
                  marginBottom: '4px'
                }}>
                  {systemStats.totalDocuments}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  文档总数
                </div>
              </div>
              
              <div style={{
                padding: '16px',
                background: '#f9f0ff',
                borderRadius: '6px',
                border: '1px solid #d3adf7'
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: '#9c27b0',
                  marginBottom: '4px'
                }}>
                  {systemStats.documentStorage}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  文档占用空间
                </div>
              </div>
              
              <div style={{
                padding: '16px',
                background: '#fff1f0',
                borderRadius: '6px',
                border: '1px solid #ffccc7'
              }}>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  color: '#f5222d',
                  marginBottom: '4px'
                }}>
                  {systemStats.databaseSize}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  数据库大小
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          paddingTop: '16px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <button
            onClick={() => {
              if (confirm('确定要重置为默认配置吗？')) {
                setSystemSettings({
                  site_name: '项目管理系统',
                  site_description: '高效的项目管理解决方案',
                  admin_email: 'admin@example.com',
                  session_timeout: '30',
                  enable_notifications: 'true',
                  theme_color: '#1890ff',
                  language: 'zh-CN',
                  timezone: 'Asia/Shanghai'
                });
              }
            }}
            disabled={loading}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              color: '#666',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            重置配置
          </button>
          <button
            onClick={handleSaveSystemSettings}
            disabled={loading}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              background: loading ? '#ccc' : '#1976d2',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? '保存中...' : '💾 保存配置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
