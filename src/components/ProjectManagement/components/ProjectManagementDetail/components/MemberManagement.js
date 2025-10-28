import React from 'react';
import ProjectSelector from './ProjectSelector';
import { tableHeaderStyle, tableCellStyle, actionButtonStyle, deleteButtonStyle } from '../styles/tableStyles';

const MemberManagement = ({ 
  members, 
  projects,
  selectedProjectFilter,
  onProjectFilterChange,
  user, 
  isMobile,
  onAddMember,
  onEditMember,
  onDeleteMember
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
          项目成员 ({members.length}人)
        </h3>
        {user.role === 'admin' && (
          <button
            onClick={onAddMember}
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
            ➕ 添加成员
          </button>
        )}
      </div>

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {members.map(member => (
            <div key={member.id} style={{
              border: '1px solid #e1e5e9',
              borderRadius: '12px',
              padding: '16px',
              background: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{member.role}</div>
                </div>
                <span style={{
                  padding: '4px 12px',
                  background: '#27ae60',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {member.status}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <div>📞 {member.phone}</div>
                <div>📧 {member.email}</div>
                <div>🏢 {member.department}</div>
                <div>📅 入职：{member.joinDate}</div>
              </div>
              {user.role === 'admin' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => onEditMember(member)}
                    style={{...actionButtonStyle, flex: 1}}
                  >
                    ✏️ 编辑
                  </button>
                  <button 
                    onClick={() => onDeleteMember(member.id)}
                    style={{...deleteButtonStyle, flex: 1}}
                  >
                    🗑️ 删除
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={tableHeaderStyle}>姓名</th>
                <th style={tableHeaderStyle}>角色</th>
                <th style={tableHeaderStyle}>部门</th>
                <th style={tableHeaderStyle}>联系电话</th>
                <th style={tableHeaderStyle}>邮箱</th>
                <th style={tableHeaderStyle}>入职日期</th>
                <th style={tableHeaderStyle}>状态</th>
                {user.role === 'admin' && <th style={tableHeaderStyle}>操作</th>}
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={tableCellStyle}>{member.name}</td>
                  <td style={tableCellStyle}>{member.role}</td>
                  <td style={tableCellStyle}>{member.department}</td>
                  <td style={tableCellStyle}>{member.phone}</td>
                  <td style={tableCellStyle}>{member.email}</td>
                  <td style={tableCellStyle}>{member.joinDate}</td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 12px',
                      background: '#27ae60',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {member.status}
                    </span>
                  </td>
                  {user.role === 'admin' && (
                    <td style={tableCellStyle}>
                      <button 
                        onClick={() => onEditMember(member)}
                        style={actionButtonStyle}
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => onDeleteMember(member.id)}
                        style={deleteButtonStyle}
                      >
                        删除
                      </button>
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

export default MemberManagement;

