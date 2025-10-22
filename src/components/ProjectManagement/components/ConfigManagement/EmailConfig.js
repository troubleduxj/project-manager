import React, { useState, useEffect } from 'react';

const EmailConfig = ({ user }) => {
  const [emailConfig, setEmailConfig] = useState({
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    from_name: '项目管理系统',
    from_email: '',
    test_email: '',
    enable_ssl: 'false',
    enable_tls: 'true'
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // 组件挂载时获取邮件配置
  useEffect(() => {
    fetchEmailConfig();
  }, []);

  // 获取邮件配置
  const fetchEmailConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // 从settings中提取邮件相关配置
        const emailSettings = {};
        Object.keys(data).forEach(key => {
          if (key.startsWith('smtp_') || key.startsWith('email_') || key.startsWith('from_') || key === 'test_email' || key === 'enable_ssl' || key === 'enable_tls') {
            emailSettings[key] = data[key];
          }
        });
        
        console.log('获取到的邮件配置:', emailSettings);
        if (Object.keys(emailSettings).length > 0) {
          setEmailConfig(prev => ({ ...prev, ...emailSettings }));
        }
      }
    } catch (error) {
      console.error('获取邮件配置失败:', error);
    }
  };

  // 保存邮件配置
  const handleSaveEmailConfig = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // 转换为settings API期望的格式
      const settingsToUpdate = {};
      Object.keys(emailConfig).forEach(key => {
        settingsToUpdate[key] = {
          value: emailConfig[key],
          description: getEmailSettingDescription(key)
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
        alert('✅ 邮件配置保存成功！');
      } else {
        const errorData = await response.json();
        alert(`❌ 保存失败: ${errorData.error || '请重试'}`);
      }
    } catch (error) {
      console.error('保存邮件配置失败:', error);
      alert('❌ 保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取邮件设置项描述
  const getEmailSettingDescription = (key) => {
    const descriptions = {
      smtp_host: 'SMTP服务器地址',
      smtp_port: 'SMTP端口',
      smtp_user: 'SMTP用户名',
      smtp_pass: 'SMTP密码',
      from_name: '发件人名称',
      from_email: '发件人邮箱',
      test_email: '测试邮箱',
      enable_ssl: '启用SSL',
      enable_tls: '启用TLS'
    };
    return descriptions[key] || key;
  };

  // 测试邮件发送
  const handleTestEmail = async () => {
    if (!emailConfig.smtp_host || !emailConfig.smtp_user || !emailConfig.smtp_pass || !emailConfig.from_email) {
      alert('请先完善邮件配置信息');
      return;
    }

    if (!emailConfig.test_email) {
      alert('请输入测试收件人邮箱地址');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(emailConfig)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`✅ 测试邮件发送成功！\n\n收件人：${emailConfig.test_email}\n主题：${result.subject}\n\n请检查收件箱。`);
      } else {
        throw new Error(result.error || '邮件发送失败');
      }
    } catch (error) {
      console.error('邮件测试失败:', error);
      alert(`❌ 邮件测试失败\n\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 一键配置腾讯企业邮箱
  const handleTencentEmailConfig = (port) => {
    setEmailConfig(prev => ({
      ...prev,
      smtp_host: 'smtp.exmail.qq.com',
      smtp_port: port.toString(),
      enable_ssl: port === 465 ? 'true' : 'false',
      enable_tls: port === 587 ? 'true' : 'false'
    }));

    // 显示成功通知
    setNotification({
      type: 'success',
      message: `✅ 腾讯企业邮箱配置已应用！\n端口：${port} (${port === 587 ? 'TLS' : 'SSL'})\n请填写您的邮箱账号和密码。`
    });

    // 3秒后自动隐藏通知
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    fetchEmailConfig();
  }, []);

  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>📧 邮件配置</h3>
      
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              SMTP 服务器 *
            </label>
            <input
              type="text"
              value={emailConfig.smtp_host}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_host: e.target.value }))}
              placeholder="例如: smtp.gmail.com"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              SMTP 端口 *
            </label>
            <input
              type="number"
              value={emailConfig.smtp_port}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_port: e.target.value }))}
              placeholder="587 或 465"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              邮箱账号 *
            </label>
            <input
              type="email"
              value={emailConfig.smtp_user}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_user: e.target.value }))}
              placeholder="your-email@example.com"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              邮箱密码 *
            </label>
            <input
              type="password"
              value={emailConfig.smtp_pass}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_pass: e.target.value }))}
              placeholder="邮箱密码或应用专用密码"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              发件人名称
            </label>
            <input
              type="text"
              value={emailConfig.from_name}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, from_name: e.target.value }))}
              placeholder="项目管理系统"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              发件人邮箱 *
            </label>
            <input
              type="email"
              value={emailConfig.from_email}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, from_email: e.target.value }))}
              placeholder="noreply@example.com"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              测试收件人邮箱
            </label>
            <input
              type="email"
              value={emailConfig.test_email}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, test_email: e.target.value }))}
              placeholder="输入用于测试的邮箱地址"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              用于测试邮件配置是否正确，不会保存此邮箱地址
            </div>
          </div>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
              <input
                type="checkbox"
                checked={emailConfig.enable_ssl === 'true'}
                onChange={(e) => setEmailConfig(prev => ({ 
                  ...prev, 
                  enable_ssl: e.target.checked ? 'true' : 'false' 
                }))}
                style={{ transform: 'scale(1.2)' }}
              />
              启用 SSL (端口 465)
            </label>
          </div>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
              <input
                type="checkbox"
                checked={emailConfig.enable_tls === 'true'}
                onChange={(e) => setEmailConfig(prev => ({ 
                  ...prev, 
                  enable_tls: e.target.checked ? 'true' : 'false' 
                }))}
                style={{ transform: 'scale(1.2)' }}
              />
              启用 TLS (端口 587)
            </label>
          </div>
        </div>
        
        {/* 快速配置按钮 */}
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h5 style={{ margin: '0 0 12px 0', color: '#495057' }}>🚀 快速配置</h5>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleTencentEmailConfig(587)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #00d4aa 0%, #00a085 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              📧 一键配置腾讯企业邮箱 (TLS)
            </button>
            
            <button
              onClick={() => handleTencentEmailConfig(465)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              🔒 一键配置腾讯企业邮箱 (SSL)
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={handleTestEmail}
            disabled={loading || !emailConfig.smtp_host}
            style={{
              padding: '12px 24px',
              background: loading || !emailConfig.smtp_host ? '#6c757d' : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading || !emailConfig.smtp_host ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
              opacity: loading || !emailConfig.smtp_host ? 0.6 : 1
            }}
          >
            {loading ? '发送中...' : '📧 发送测试邮件'}
          </button>
          
          <button
            onClick={handleSaveEmailConfig}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? '保存中...' : '💾 保存配置'}
          </button>
        </div>
      </div>

      {/* 通知组件 */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.type === 'success' ? '#d4edda' : '#f8d7da',
          color: notification.type === 'success' ? '#155724' : '#721c24',
          padding: '16px 20px',
          borderRadius: '8px',
          border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxWidth: '400px',
          animation: 'slideInRight 0.3s ease-out',
          whiteSpace: 'pre-line'
        }}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default EmailConfig;
