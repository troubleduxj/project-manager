import React, { useState } from 'react';
import { getUserAvatar } from '../../../utils/avatarGenerator';
import MessageCenter from './MessageCenter';

const PersonalCenter = ({ user, systemSettings, isMobile, onLogout, onUserUpdate, onMessageRead }) => {
  const [showDialog, setShowDialog] = useState(null); // 'username', 'password', 'email', 'avatar', 'message-center', null
  const [formData, setFormData] = useState({
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: '',
    avatarFile: null,
    avatarPreview: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      // 清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 调用父组件的登出方法
      if (onLogout) {
        onLogout();
      } else {
        // 如果没有传入onLogout，直接刷新页面
        window.location.reload();
      }
    }
  };

  const handleOpenDialog = (type) => {
    setShowDialog(type);
    setError('');
    // 预填充当前值
    if (type === 'username') {
      setFormData({ ...formData, username: user.username });
    } else if (type === 'email') {
      setFormData({ ...formData, email: user.email || '' });
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(null);
    setFormData({
      username: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      email: '',
      avatarFile: null,
      avatarPreview: null
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let body = {};

      if (showDialog === 'avatar') {
        if (!formData.avatarFile) {
          throw new Error('请选择要上传的头像图片');
        }
        
        // 检查文件大小（2MB限制）
        if (formData.avatarFile.size > 2 * 1024 * 1024) {
          throw new Error('图片大小不能超过 2MB');
        }
        
        // 将图片转为 base64
        const reader = new FileReader();
        reader.readAsDataURL(formData.avatarFile);
        
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64Avatar = reader.result;
              
              console.log('📤 准备上传头像，大小:', base64Avatar.length, '字符');
              
              const response = await fetch(`http://localhost:7080/api/auth/profile`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ avatar: base64Avatar })
              });

              console.log('📡 服务器响应状态:', response.status, response.statusText);

              const data = await response.json();
              console.log('📦 服务器响应数据:', data);

              if (!response.ok) {
                // 显示详细的错误信息
                let errorMsg = data.error || '头像上传失败';
                if (data.details) {
                  errorMsg += '\n详细信息: ' + data.details;
                }
                if (data.type) {
                  errorMsg += '\n错误类型: ' + data.type;
                }
                console.error('❌ 上传失败:', errorMsg);
                throw new Error(errorMsg);
              }

              alert('头像上传成功！');
              
              // 更新本地用户信息
              const updatedUser = { ...user, avatar: base64Avatar };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              if (onUserUpdate) {
                onUserUpdate(updatedUser);
              }

              handleCloseDialog();
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => reject(new Error('图片读取失败'));
        });
        
        return; // 直接返回，不执行后续代码
      } else if (showDialog === 'username') {
        if (!formData.username.trim()) {
          throw new Error('用户名不能为空');
        }
        endpoint = '/api/auth/profile';
        body = { username: formData.username.trim() };
      } else if (showDialog === 'password') {
        if (!formData.oldPassword || !formData.newPassword) {
          throw new Error('请填写所有密码字段');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('两次输入的新密码不一致');
        }
        if (formData.newPassword.length < 6) {
          throw new Error('新密码长度至少为6位');
        }
        endpoint = '/api/auth/change-password';
        body = { 
          currentPassword: formData.oldPassword, 
          newPassword: formData.newPassword 
        };
      } else if (showDialog === 'email') {
        if (!formData.email.trim()) {
          throw new Error('邮箱不能为空');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          throw new Error('邮箱格式不正确');
        }
        endpoint = '/api/auth/profile';
        body = { email: formData.email.trim() };
      }

      const response = await fetch(`http://localhost:7080${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '操作失败');
      }

      // 更新成功
      alert(data.message || '更新成功！');
      
      // 更新本地用户信息
      if (showDialog !== 'password') {
        const updatedUser = { ...user, ...body };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
      }

      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: isMobile ? '12px 0 80px 0' : '20px 0',
      maxWidth: '100%',
      margin: '0 auto'
    }}>
      {/* 用户信息卡片 - 左右布局 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '20px' : '32px',
        marginBottom: isMobile ? '16px' : '24px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '16px' : '24px',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {/* 左侧：头像 */}
        <div style={{
          width: isMobile ? '80px' : '100px',
          height: isMobile ? '80px' : '100px',
          borderRadius: '50%',
          background: `url(${getUserAvatar(user, isMobile ? 80 : 100)}) center/cover`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isMobile ? '40px' : '50px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
        </div>

        {/* 右侧：用户信息 */}
        <div style={{
          flex: 1,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          {/* 用户名 */}
          <h1 style={{ 
            margin: '0 0 8px 0', 
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: '700'
          }}>
            {user.username}
          </h1>

          {/* 角色和邮箱 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            {/* 角色标签 */}
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '500'
            }}>
              {user.role === 'admin' ? '👑 系统管理员' : user.role === 'client' ? '🏢 客户' : '👤 用户'}
            </div>

            {/* 邮箱 */}
            {user.email && (
              <div style={{ 
                fontSize: isMobile ? '13px' : '15px',
                opacity: 0.95,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📧</span>
                <span>{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 内容单列布局 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: isMobile ? '16px' : '24px'
      }}>
        {/* 账户设置卡片 */}
        <InfoCard title="⚙️ 账户设置" isMobile={isMobile}>
          <SettingItem 
            icon="👤" 
            label="修改用户名" 
            description="更新您的用户名"
            onClick={() => handleOpenDialog('username')}
            isMobile={isMobile}
          />
          <SettingItem 
            icon="🔐" 
            label="修改密码" 
            description="更新您的账户密码"
            onClick={() => handleOpenDialog('password')}
            isMobile={isMobile}
          />
          <SettingItem 
            icon="📧" 
            label="邮箱设置" 
            description="修改或验证邮箱地址"
            onClick={() => handleOpenDialog('email')}
            isMobile={isMobile}
          />
          <SettingItem 
            icon="🖼️" 
            label="头像设置" 
            description="上传自定义头像"
            onClick={() => handleOpenDialog('avatar')}
            isMobile={isMobile}
            isLast
          />
        </InfoCard>

        {/* 偏好设置卡片 */}
        <InfoCard title="🎨 偏好设置" isMobile={isMobile}>
          <SettingItem 
            icon="🌓" 
            label="主题模式" 
            description="浅色 / 深色主题"
            onClick={() => alert('主题设置功能开发中')}
            isMobile={isMobile}
          />
          <SettingItem 
            icon="🔔" 
            label="消息通知" 
            description="查看消息和管理通知偏好设置"
            onClick={() => setShowDialog('message-center')}
            isMobile={isMobile}
          />
          <SettingItem 
            icon="🌐" 
            label="语言设置" 
            description="选择界面语言"
            onClick={() => alert('语言设置功能开发中')}
            isMobile={isMobile}
            isLast
          />
        </InfoCard>
      </div>

      {/* 退出登录按钮 */}
      <div style={{
        margin: isMobile ? '24px 0 0 0' : '32px 0 0 0'
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: isMobile ? '14px 24px' : '16px 32px',
            background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
            color: 'white',
            border: 'none',
            borderRadius: isMobile ? '12px' : '16px',
            fontSize: isMobile ? '15px' : '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(245, 101, 101, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 101, 101, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 101, 101, 0.3)';
            }
          }}
        >
          <span style={{ fontSize: isMobile ? '18px' : '20px' }}>🚪</span>
          <span>退出登录</span>
        </button>
      </div>

      {/* 对话框 */}
      {showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={handleCloseDialog}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: isMobile ? '24px' : '32px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            {/* 对话框标题 */}
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: isMobile ? '20px' : '24px',
              color: '#2c3e50',
              fontWeight: '700'
            }}>
              {showDialog === 'username' && '📝 修改用户名'}
              {showDialog === 'password' && '🔐 修改密码'}
              {showDialog === 'email' && '📧 修改邮箱'}
              {showDialog === 'avatar' && '🖼️ 上传头像'}
            </h2>

            {/* 表单 */}
            <form onSubmit={handleSubmit}>
              {/* 修改用户名 */}
              {showDialog === 'username' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#495057',
                    fontWeight: '500'
                  }}>
                    新用户名
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="请输入新用户名"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>
              )}

              {/* 修改密码 */}
              {showDialog === 'password' && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#495057',
                      fontWeight: '500'
                    }}>
                      原密码
                    </label>
                    <input
                      type="password"
                      value={formData.oldPassword}
                      onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                      placeholder="请输入原密码"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#495057',
                      fontWeight: '500'
                    }}>
                      新密码
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="请输入新密码（至少6位）"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#495057',
                      fontWeight: '500'
                    }}>
                      确认新密码
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="请再次输入新密码"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>
                </>
              )}

              {/* 修改邮箱 */}
              {showDialog === 'email' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#495057',
                    fontWeight: '500'
                  }}>
                    新邮箱地址
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="请输入新邮箱地址"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  />
                </div>
              )}

              {/* 上传头像 */}
              {showDialog === 'avatar' && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      margin: '0 auto 16px',
                      borderRadius: '50%',
                      background: `url(${formData.avatarPreview || getUserAvatar(user, 120)}) center/cover`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '60px',
                      border: '4px solid #e9ecef',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      overflow: 'hidden'
                    }}>
                    </div>
                    <p style={{
                      fontSize: '13px',
                      color: '#6c757d',
                      margin: 0
                    }}>
                      {formData.avatarPreview ? '新头像预览' : user.avatar ? '当前头像' : '当前使用默认头像'}
                    </p>
                  </div>
                  
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: '#495057',
                    fontWeight: '500'
                  }}>
                    选择头像图片
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // 创建预览
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData({ 
                            ...formData, 
                            avatarFile: file,
                            avatarPreview: event.target.result
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px dashed #e9ecef',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  />
                  <p style={{
                    fontSize: '12px',
                    color: '#6c757d',
                    marginTop: '8px',
                    marginBottom: 0
                  }}>
                    支持 JPG、PNG、GIF 格式，建议尺寸 200x200 像素，大小不超过 2MB
                  </p>
                </div>
              )}

              {/* 错误提示 */}
              {error && (
                <div style={{
                  background: '#fee',
                  color: '#c33',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  border: '1px solid #fcc'
                }}>
                  {error}
                </div>
              )}

              {/* 按钮组 */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    background: '#f8f9fa',
                    color: '#6c757d',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MessageCenter组件 */}
      {showDialog === 'message-center' && (
        <MessageCenter
          user={user}
          isMobile={isMobile}
          onClose={() => setShowDialog(null)}
          onMessageRead={onMessageRead}
        />
      )}
    </div>
  );
};

// 卡片容器组件
const InfoCard = ({ title, children, isMobile }) => (
  <div style={{
    background: 'white',
    borderRadius: isMobile ? '12px' : '16px',
    padding: isMobile ? '16px' : '20px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e9ecef'
  }}>
    <h3 style={{
      margin: '0 0 16px 0',
      fontSize: isMobile ? '16px' : '18px',
      color: '#2c3e50',
      fontWeight: '600',
      paddingBottom: '12px',
      borderBottom: '2px solid #f1f3f4'
    }}>
      {title}
    </h3>
    {children}
  </div>
);

// 设置项组件
const SettingItem = ({ icon, label, description, onClick, isMobile, isLast }) => (
  <div 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '10px 0' : '12px 0',
      borderBottom: isLast ? 'none' : '1px solid #f1f3f4',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderRadius: '8px'
    }}
    onMouseEnter={(e) => {
      if (!isMobile) {
        e.currentTarget.style.background = '#f8f9fa';
        e.currentTarget.style.padding = isMobile ? '10px 8px' : '12px 8px';
      }
    }}
    onMouseLeave={(e) => {
      if (!isMobile) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.padding = isMobile ? '10px 0' : '12px 0';
      }
    }}
  >
    <span style={{ 
      fontSize: isMobile ? '20px' : '24px', 
      marginRight: isMobile ? '10px' : '12px',
      flexShrink: 0
    }}>
      {icon}
    </span>
    <div style={{ flex: 1 }}>
      <div style={{
        fontSize: isMobile ? '14px' : '15px',
        color: '#2c3e50',
        fontWeight: '500',
        marginBottom: '3px'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: isMobile ? '11px' : '12px',
        color: '#6c757d'
      }}>
        {description}
      </div>
    </div>
    <span style={{ 
      fontSize: isMobile ? '16px' : '18px', 
      color: '#adb5bd',
      flexShrink: 0
    }}>
      ›
    </span>
  </div>
);

export default PersonalCenter;

