import React from 'react';
import FormField from './FormField';

const ProjectEditDialog = ({ 
  show, 
  editForm, 
  editingProjectId, 
  isMobile, 
  managers = [], 
  onClose, 
  onSave, 
  onChange 
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'white',
        width: '95%',
        height: '95%',
        maxWidth: '1200px',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.3s ease'
      }}>
        {/* 对话框头部 */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
              {editingProjectId ? '编辑项目信息' : '添加新项目'}
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {editingProjectId ? '修改项目的详细信息' : '创建一个新的项目'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
        </div>

        {/* 对话框内容 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: isMobile ? '24px' : '40px'
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              <FormField
                label="项目名称"
                value={editForm.name}
                onChange={(value) => onChange({ ...editForm, name: value })}
                required
                isMobile={isMobile}
              />
              <FormField
                label="项目状态"
                value={editForm.status}
                onChange={(value) => onChange({ ...editForm, status: value })}
                type="select"
                options={['进行中', '已完成', '已暂停', '已取消', '规划中']}
                isMobile={isMobile}
              />
              <FormField
                label="优先级"
                value={editForm.priority}
                onChange={(value) => onChange({ ...editForm, priority: value })}
                type="select"
                options={['高', '中', '低']}
                isMobile={isMobile}
              />
              <FormField
                label="项目类型"
                value={editForm.type}
                onChange={(value) => onChange({ ...editForm, type: value })}
                isMobile={isMobile}
              />
              <FormField
                label="开始日期"
                value={editForm.startDate}
                onChange={(value) => onChange({ ...editForm, startDate: value })}
                type="date"
                isMobile={isMobile}
              />
              <FormField
                label="结束日期"
                value={editForm.endDate}
                onChange={(value) => onChange({ ...editForm, endDate: value })}
                type="date"
                isMobile={isMobile}
              />
              <FormField
                label="项目进度 (%)"
                value={editForm.progress}
                onChange={(value) => onChange({ ...editForm, progress: value })}
                type="number"
                min="0"
                max="100"
                isMobile={isMobile}
              />
              <FormField
                label="项目预算"
                value={editForm.budget}
                onChange={(value) => onChange({ ...editForm, budget: value })}
                type="number"
                isMobile={isMobile}
              />
              <FormField
                label="所属部门"
                value={editForm.department}
                onChange={(value) => onChange({ ...editForm, department: value })}
                isMobile={isMobile}
              />
              <FormField
                label="项目经理"
                value={editForm.manager}
                onChange={(value) => onChange({ ...editForm, manager: value })}
                type="select"
                options={managers.map(m => `${m.full_name || m.username} (${m.role === 'project_manager' ? '项目经理' : m.role})`)}
                isMobile={isMobile}
              />
              <FormField
                label="项目团队"
                value={editForm.team}
                onChange={(value) => onChange({ ...editForm, team: value })}
                isMobile={isMobile}
              />
              <FormField
                label="客户名称"
                value={editForm.customer}
                onChange={(value) => onChange({ ...editForm, customer: value })}
                isMobile={isMobile}
              />
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <FormField
                label="项目描述"
                value={editForm.description}
                onChange={(value) => onChange({ ...editForm, description: value })}
                type="textarea"
                rows={4}
                isMobile={isMobile}
              />
            </div>

            {/* 设置为默认项目 */}
            <div style={{ marginTop: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e1e5e9' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                <input
                  type="checkbox"
                  checked={editForm.isDefault || false}
                  onChange={(e) => onChange({ ...editForm, isDefault: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '12px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⭐</span>
                  <span>设置为默认项目</span>
                </span>
              </label>
              <div style={{
                marginTop: '8px',
                marginLeft: '32px',
                fontSize: '13px',
                color: '#666'
              }}>
                默认项目将在其他模块的项目选择器中默认选中（全局只能有一个默认项目）
              </div>
            </div>
          </div>
        </div>

        {/* 对话框底部 */}
        <div style={{
          background: '#f8f9fa',
          padding: '24px 32px',
          borderTop: '1px solid #e1e5e9',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 32px',
              background: 'white',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              color: '#555',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.color = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e1e5e9';
              e.currentTarget.style.color = '#555';
            }}
          >
            取消
          </button>
          <button
            onClick={onSave}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            💾 保存{editingProjectId ? '更改' : '项目'}
          </button>
        </div>
      </div>

      {/* CSS动画 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectEditDialog;

