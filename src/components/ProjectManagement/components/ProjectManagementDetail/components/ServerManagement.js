import React from 'react';
import ProjectSelector from './ProjectSelector';

const ServerManagement = ({ 
  servers, 
  projects,
  selectedProjectFilter,
  onProjectFilterChange,
  user, 
  isMobile,
  onAddServer 
}) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: isMobile ? '12px' : '16px',
      padding: isMobile ? '20px' : '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* 项目选择器 */}
      <ProjectSelector 
        projects={projects}
        selectedProjectFilter={selectedProjectFilter}
        onChange={onProjectFilterChange}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', color: '#2c3e50' }}>
          服务器信息 ({servers.length}台)
        </h3>
        {user.role === 'admin' && (
          <button
            onClick={onAddServer}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ➕ 添加服务器
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {servers.map(server => (
          <div key={server.id} style={{
            border: '2px solid #e1e5e9',
            borderRadius: '12px',
            padding: '20px',
            background: '#f8f9fa',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = '#667eea';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#e1e5e9';
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                  🖥️ {server.name}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>{server.purpose}</div>
              </div>
              <span style={{
                padding: '4px 12px',
                background: server.status === '运行中' ? '#27ae60' : '#e74c3c',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {server.status}
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#555', lineHeight: '2' }}>
              <div><strong>IP地址：</strong>{server.ip}</div>
              <div><strong>操作系统：</strong>{server.type}</div>
              <div><strong>CPU：</strong>{server.cpu}</div>
              <div><strong>内存：</strong>{server.memory}</div>
              <div><strong>硬盘：</strong>{server.disk}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerManagement;

