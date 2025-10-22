import React from 'react';
import ProjectSelector from './ProjectSelector';
import { tableHeaderStyle, tableCellStyle, actionButtonStyle, deleteButtonStyle } from '../styles/tableStyles';

const ResourceManagement = ({ 
  resources, 
  projects,
  selectedProjectFilter,
  onProjectFilterChange,
  user, 
  isMobile,
  onAddResource 
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
          软件资料 ({resources.length}项)
        </h3>
        {user.role === 'admin' && (
          <button
            onClick={onAddResource}
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
            ➕ 添加资料
          </button>
        )}
      </div>

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {resources.map(resource => (
            <div key={resource.id} style={{
              border: '1px solid #e1e5e9',
              borderRadius: '12px',
              padding: '16px',
              background: '#f8f9fa'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                📦 {resource.name} <span style={{ color: '#667eea' }}>v{resource.version}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <div><strong>类型：</strong>{resource.type}</div>
                <div><strong>许可证：</strong>{resource.license}</div>
                <div><strong>更新日期：</strong>{resource.updateDate}</div>
                <div><strong>说明：</strong>{resource.description}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={tableHeaderStyle}>软件名称</th>
                <th style={tableHeaderStyle}>版本</th>
                <th style={tableHeaderStyle}>类型</th>
                <th style={tableHeaderStyle}>许可证</th>
                <th style={tableHeaderStyle}>更新日期</th>
                <th style={tableHeaderStyle}>说明</th>
                {user.role === 'admin' && <th style={tableHeaderStyle}>操作</th>}
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={tableCellStyle}><strong>{resource.name}</strong></td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 8px',
                      background: '#667eea',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      v{resource.version}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{resource.type}</td>
                  <td style={tableCellStyle}>{resource.license}</td>
                  <td style={tableCellStyle}>{resource.updateDate}</td>
                  <td style={tableCellStyle}>{resource.description}</td>
                  {user.role === 'admin' && (
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle}>编辑</button>
                      <button style={deleteButtonStyle}>删除</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;

