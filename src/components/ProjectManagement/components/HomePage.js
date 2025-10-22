import React, { useState, useEffect } from 'react';

const HomePage = ({ projects, user, systemSettings, onProjectSelect, isMobile }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) {
      setGreeting('夜深了');
    } else if (hour < 9) {
      setGreeting('早上好');
    } else if (hour < 12) {
      setGreeting('上午好');
    } else if (hour < 14) {
      setGreeting('中午好');
    } else if (hour < 18) {
      setGreeting('下午好');
    } else if (hour < 22) {
      setGreeting('晚上好');
    } else {
      setGreeting('夜深了');
    }
  }, []);

  // 获取项目状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#d4edda', color: '#155724', text: '✅ 进行中' };
      case 'completed': return { bg: '#d1ecf1', color: '#0c5460', text: '✓ 已完成' };
      case 'on_hold': return { bg: '#fff3cd', color: '#856404', text: '⏸️ 已暂停' };
      default: return { bg: '#f8d7da', color: '#721c24', text: '❌ 未知' };
    }
  };

  return (
    <div style={{ padding: isMobile ? '12px 0 80px 0' : '20px 0' }}>
      {/* 欢迎卡片 - 左右布局 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? '20px' : '32px',
        marginBottom: isMobile ? '20px' : '32px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '20px' : '40px',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {/* 装饰图案 */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%'
        }} />

        {/* 左侧：欢迎词 */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          flex: isMobile ? 'none' : 1,
          textAlign: isMobile ? 'center' : 'left',
          width: isMobile ? '100%' : 'auto'
        }}>
          {/* 问候语 */}
          <h1 style={{ 
            margin: '0 0 8px 0', 
            fontSize: isMobile ? '22px' : '32px', 
            fontWeight: '700',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            {greeting}, {user.full_name || user.username}!
            <span style={{ fontSize: isMobile ? '32px' : '48px' }}>👋</span>
          </h1>
          {/* 系统名称 */}
          <p style={{ 
            margin: 0, 
            fontSize: isMobile ? '14px' : '16px', 
            opacity: 0.95,
            fontWeight: '500'
          }}>
            欢迎使用 <strong>{systemSettings.site_name || '项目管理系统'}</strong>
          </p>
        </div>

        {/* 右侧：项目统计信息 */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          gap: isMobile ? '20px' : '32px',
          justifyContent: isMobile ? 'center' : 'flex-end',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            textAlign: 'center',
            minWidth: isMobile ? '80px' : '100px'
          }}>
            <div style={{ 
              fontSize: isMobile ? '28px' : '36px', 
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              {projects.length}
            </div>
            <div style={{ 
              fontSize: isMobile ? '12px' : '14px', 
              opacity: 0.9,
              fontWeight: '500'
            }}>
              项目总数
            </div>
          </div>
          <div style={{ 
            textAlign: 'center',
            minWidth: isMobile ? '80px' : '100px'
          }}>
            <div style={{ 
              fontSize: isMobile ? '28px' : '36px', 
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              {projects.filter(p => p.status === 'active').length}
            </div>
            <div style={{ 
              fontSize: isMobile ? '12px' : '14px', 
              opacity: 0.9,
              fontWeight: '500'
            }}>
              进行中
            </div>
          </div>
          <div style={{ 
            textAlign: 'center',
            minWidth: isMobile ? '80px' : '100px'
          }}>
            <div style={{ 
              fontSize: isMobile ? '28px' : '36px', 
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div style={{ 
              fontSize: isMobile ? '12px' : '14px', 
              opacity: 0.9,
              fontWeight: '500'
            }}>
              已完成
            </div>
          </div>
        </div>
      </div>

      {/* 项目列表标题 */}
      <div style={{
        marginBottom: isMobile ? '16px' : '24px'
      }}>
        <h2 style={{
          margin: '0',
          fontSize: isMobile ? '20px' : '28px',
          fontWeight: '700',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>📁</span>
          我的项目
        </h2>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: isMobile ? '13px' : '14px',
          color: '#6c757d'
        }}>
          点击项目卡片查看详细信息和任务进度
        </p>
      </div>

      {/* 项目卡片网格 */}
      {projects.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: isMobile ? '16px' : '24px'
        }}>
          {projects.map((project) => {
            const statusInfo = getStatusColor(project.status);
            
            return (
              <div
                key={project.id}
                onClick={() => onProjectSelect(project)}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: isMobile ? '16px' : '20px',
                  padding: isMobile ? '24px' : '28px',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.25)';
                    e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {/* 背景装饰 */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-20%',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
                  borderRadius: '50%'
                }} />

                {/* 顶部装饰条 */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite'
                }} />

                {/* 项目图标 */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  width: isMobile ? '56px' : '64px',
                  height: isMobile ? '56px' : '64px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '28px' : '32px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                  border: '3px solid rgba(255, 255, 255, 0.5)'
                }}>
                  📊
                </div>

                {/* 项目名称 */}
                <h3 style={{
                  position: 'relative',
                  zIndex: 1,
                  margin: '0 0 12px 0',
                  fontSize: isMobile ? '20px' : '22px',
                  fontWeight: '800',
                  color: '#1a202c',
                  lineHeight: '1.3',
                  letterSpacing: '-0.3px'
                }}>
                  {project.name}
                </h3>

                {/* 项目描述 */}
                <p style={{
                  position: 'relative',
                  zIndex: 1,
                  margin: '0 0 20px 0',
                  fontSize: isMobile ? '14px' : '15px',
                  color: '#718096',
                  lineHeight: '1.7',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: isMobile ? '42px' : '48px',
                  fontWeight: '400'
                }}>
                  {project.description || '暂无项目描述'}
                </p>

                {/* 底部信息 */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '2px solid rgba(0, 0, 0, 0.06)'
                }}>
                  {/* 左侧：状态标签和进度 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      padding: '8px 16px',
                      borderRadius: '24px',
                      background: statusInfo.bg,
                      color: statusInfo.color,
                      fontSize: isMobile ? '12px' : '13px',
                      fontWeight: '700',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      border: `1px solid ${statusInfo.color}20`
                    }}>
                      {statusInfo.text}
                    </span>
                    <span style={{
                      fontSize: isMobile ? '13px' : '14px',
                      fontWeight: '700',
                      color: '#667eea'
                    }}>
                      {project.progress || 0}%
                    </span>
                  </div>

                  {/* 右侧：查看详情箭头 */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    →
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // 空状态
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '12px' : '16px',
          padding: isMobile ? '40px 20px' : '60px 40px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: '16px' }}>
            📁
          </div>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: isMobile ? '18px' : '20px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            暂无项目
          </h3>
          <p style={{
            margin: 0,
            fontSize: isMobile ? '13px' : '14px',
            color: '#6c757d'
          }}>
            {user.role === 'admin' ? '请联系管理员创建项目' : '系统中还没有项目'}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
