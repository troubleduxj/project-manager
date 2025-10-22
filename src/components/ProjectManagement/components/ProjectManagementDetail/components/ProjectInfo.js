import React from 'react';
import { getStatusColor, getPriorityColor } from '../utils/filterUtils';

const ProjectInfo = ({ projects, user, isMobile, onAddProject, onEditProject, onDeleteProject }) => {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: isMobile ? '18px' : '20px', color: '#2c3e50' }}>
          项目列表 ({projects.length}个)
        </h3>
        {user.role === 'admin' && (
          <button
            onClick={onAddProject}
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
            ➕ 添加项目
          </button>
        )}
      </div>

      {/* 项目卡片网格 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {projects.map(project => (
          <div key={project.id} style={{
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
            {/* 卡片头部 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>📋 {project.name}</span>
                  {project.isDefault && (
                    <span style={{
                      padding: '2px 8px',
                      background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      boxShadow: '0 2px 4px rgba(243, 156, 18, 0.3)',
                      whiteSpace: 'nowrap'
                    }}>
                      ⭐ 默认
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>{project.type}</div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '8px'
              }}>
                <span style={{
                  padding: '4px 12px',
                  background: getStatusColor(project.status),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  {project.status}
                </span>
                <span style={{
                  padding: '4px 12px',
                  background: getPriorityColor(project.priority),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  {project.priority}
                </span>
              </div>
            </div>

            {/* 项目描述 */}
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '16px',
              lineHeight: '1.6',
              height: '48px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {project.description}
            </div>

            {/* 进度条 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '12px',
                color: '#666'
              }}>
                <span>进度</span>
                <span style={{ fontWeight: '600', color: '#667eea' }}>{project.progress}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#ecf0f1',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${project.progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* 项目详细信息 */}
            <div style={{ fontSize: '14px', color: '#555', lineHeight: '2', marginBottom: '16px' }}>
              <div><strong>项目经理：</strong>{project.manager}</div>
              <div><strong>所属部门：</strong>{project.department}</div>
              <div><strong>开始日期：</strong>{project.startDate}</div>
              <div><strong>结束日期：</strong>{project.endDate}</div>
              <div><strong>项目预算：</strong>¥{project.budget}</div>
            </div>

            {/* 操作按钮 */}
            {user.role === 'admin' && (
              <div style={{
                display: 'flex',
                gap: '8px',
                paddingTop: '16px',
                borderTop: '1px solid #e1e5e9'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProject(project);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2980b9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#3498db'}
                >
                  ✏️ 编辑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProject(project);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#e74c3c'}
                >
                  🗑️ 删除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectInfo;

