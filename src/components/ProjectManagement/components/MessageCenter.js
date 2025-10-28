import React, { useState, useEffect } from 'react';

const MessageCenter = ({ user, isMobile, onClose, onMessageRead }) => {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' 或 'settings'
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'system', 'project', 'task', 'document', 'comment'

  // 获取消息列表
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (filter !== 'all') params.append('read_status', filter);

      const response = await fetch(`http://localhost:7080/api/messages?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('获取消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取通知设置
  const fetchNotificationSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/messages/notification-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotificationSettings(data);
      }
    } catch (error) {
      console.error('获取通知设置失败:', error);
    }
  };

  // 标记消息为已读
  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchMessages(); // 刷新消息列表
        if (onMessageRead) onMessageRead(); // 刷新未读数量徽章
      }
    } catch (error) {
      console.error('标记消息已读失败:', error);
    }
  };

  // 标记所有消息为已读
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/messages/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ 所有消息已标记为已读');
        fetchMessages();
        if (onMessageRead) onMessageRead(); // 刷新未读数量徽章
      }
    } catch (error) {
      console.error('标记所有消息已读失败:', error);
      alert('❌ 操作失败');
    }
  };

  // 删除消息
  const deleteMessage = async (messageId) => {
    if (!window.confirm('确定要删除这条消息吗?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ 消息已删除');
        fetchMessages();
      }
    } catch (error) {
      console.error('删除消息失败:', error);
      alert('❌ 删除失败');
    }
  };

  // 更新通知设置
  const updateNotificationSettings = async (settings) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/messages/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('✅ 通知设置已更新');
        fetchNotificationSettings();
      }
    } catch (error) {
      console.error('更新通知设置失败:', error);
      alert('❌ 更新失败');
    }
  };

  // 初始化
  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'settings') {
      fetchNotificationSettings();
    }
  }, [activeTab, filter, typeFilter]);

  // 获取消息类型图标
  const getMessageTypeIcon = (type) => {
    const icons = {
      'system': '🔔',
      'project': '📊',
      'task': '📋',
      'document': '📄',
      'comment': '💬',
      'text': '✉️'
    };
    return icons[type] || '📩';
  };

  // 获取消息类型标签
  const getMessageTypeLabel = (type) => {
    const labels = {
      'system': '系统消息',
      'project': '项目消息',
      'task': '任务消息',
      'document': '文档消息',
      'comment': '评论消息',
      'text': '普通消息'
    };
    return labels[type] || '消息';
  };

  // 格式化时间
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
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
      padding: isMobile ? '0' : '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: isMobile ? '0' : '16px',
        width: isMobile ? '100%' : 'min(800px, 90%)',
        height: isMobile ? '100%' : 'min(700px, 90%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* 头部 */}
        <div style={{
          padding: isMobile ? '16px' : '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: isMobile ? '24px' : '28px' }}>📬</span>
            <div>
              <h2 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px' }}>消息中心</h2>
              {unreadCount > 0 && activeTab === 'messages' && (
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
                  您有 {unreadCount} 条未读消息
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>

        {/* Tab导航 */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e9ecef',
          background: '#f8f9fa'
        }}>
          <button
            onClick={() => setActiveTab('messages')}
            style={{
              flex: 1,
              padding: isMobile ? '12px' : '16px',
              border: 'none',
              background: activeTab === 'messages' ? 'white' : 'transparent',
              borderBottom: activeTab === 'messages' ? '3px solid #667eea' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'messages' ? '600' : '400',
              fontSize: isMobile ? '14px' : '15px',
              color: activeTab === 'messages' ? '#667eea' : '#6c757d',
              transition: 'all 0.3s'
            }}
          >
            📬 消息列表 {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              flex: 1,
              padding: isMobile ? '12px' : '16px',
              border: 'none',
              background: activeTab === 'settings' ? 'white' : 'transparent',
              borderBottom: activeTab === 'settings' ? '3px solid #667eea' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'settings' ? '600' : '400',
              fontSize: isMobile ? '14px' : '15px',
              color: activeTab === 'settings' ? '#667eea' : '#6c757d',
              transition: 'all 0.3s'
            }}
          >
            ⚙️ 通知设置
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, overflow: 'auto', background: '#f8f9fa' }}>
          {activeTab === 'messages' ? (
            <div style={{ padding: isMobile ? '12px' : '20px' }}>
              {/* 筛选器 */}
              <div style={{
                background: 'white',
                padding: isMobile ? '12px' : '16px',
                borderRadius: '12px',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '12px'
                }}>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">全部消息</option>
                    <option value="unread">未读消息</option>
                    <option value="read">已读消息</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">所有类型</option>
                    <option value="system">系统消息</option>
                    <option value="project">项目消息</option>
                    <option value="task">任务消息</option>
                    <option value="document">文档消息</option>
                    <option value="comment">评论消息</option>
                  </select>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      padding: '8px 16px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    ✓ 全部标记为已读
                  </button>
                )}
              </div>

              {/* 消息列表 */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  加载中...
                </div>
              ) : messages.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '60px 20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                  <p style={{ margin: 0, fontSize: '16px' }}>暂无消息</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        background: msg.is_read ? 'white' : '#f0f4ff',
                        padding: isMobile ? '14px' : '18px',
                        borderRadius: '12px',
                        borderLeft: msg.is_read ? '4px solid #e9ecef' : '4px solid #667eea',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'}
                      onClick={() => !msg.is_read && markAsRead(msg.id)}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span style={{ fontSize: '20px' }}>{getMessageTypeIcon(msg.message_type)}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: msg.is_read ? '500' : '600',
                              fontSize: isMobile ? '14px' : '15px',
                              color: '#212529',
                              marginBottom: '4px'
                            }}>
                              {msg.title || getMessageTypeLabel(msg.message_type)}
                            </div>
                            <div style={{
                              fontSize: '13px',
                              color: '#6c757d',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              flexWrap: 'wrap'
                            }}>
                              <span>👤 {msg.sender_name}</span>
                              <span>⏰ {formatTime(msg.created_at)}</span>
                              {msg.project_name && <span>📊 {msg.project_name}</span>}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(msg.id);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#fff5f5'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          title="删除"
                        >
                          🗑️
                        </button>
                      </div>
                      <div style={{
                        fontSize: isMobile ? '13px' : '14px',
                        color: '#495057',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // 通知设置
            <div style={{ padding: isMobile ? '12px' : '20px' }}>
              {notificationSettings ? (
                <div style={{
                  background: 'white',
                  padding: isMobile ? '16px' : '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#212529' }}>
                    🔔 消息通知订阅设置
                  </h3>
                  <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#6c757d' }}>
                    选择您希望接收的消息类型
                  </p>

                  {[
                    { key: 'email_notifications', label: '邮件通知', icon: '📧', desc: '接收邮件提醒' },
                    { key: 'task_notifications', label: '任务通知', icon: '📋', desc: '任务更新和分配通知' },
                    { key: 'project_notifications', label: '项目通知', icon: '📊', desc: '项目状态变更通知' },
                    { key: 'document_notifications', label: '文档通知', icon: '📄', desc: '文档上传和更新通知' },
                    { key: 'system_notifications', label: '系统通知', icon: '🔔', desc: '系统重要消息' },
                    { key: 'comment_notifications', label: '评论通知', icon: '💬', desc: '收到评论和@提醒' }
                  ].map(item => (
                    <div
                      key={item.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onClick={() => {
                        const newSettings = {
                          ...notificationSettings,
                          [item.key]: !notificationSettings[item.key]
                        };
                        updateNotificationSettings(newSettings);
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#e9ecef'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fa'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{item.icon}</span>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '15px', color: '#212529', marginBottom: '4px' }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6c757d' }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={!!notificationSettings[item.key]}
                        onChange={() => {}}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: '#667eea'
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  加载中...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;

