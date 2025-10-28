import React, { useCallback } from 'react';
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

  // 使用 useCallback 包装表单字段更新函数
  const updateFormField = useCallback((field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  }, [onChange]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'white',
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        borderRadius: '0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        animation: 'slideUp 0.3s ease'
      }}>
        {/* 对话框头部 */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '28px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid rgba(255,255,255,0.2)',
          boxShadow: '0 2px 20px rgba(102, 126, 234, 0.3)'
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>
              {editingProjectId ? '📝 编辑项目信息' : '✨ 添加新项目'}
            </h2>
            <p style={{ margin: 0, opacity: 0.95, fontSize: '15px', fontWeight: '400' }}>
              {editingProjectId ? '修改项目的详细信息，完善项目管理' : '填写项目基本信息，开启项目管理之旅'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              fontWeight: '300'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
            title="关闭对话框 (Esc)"
          >
            ✕
          </button>
        </div>

        {/* 对话框内容 - 分组优化版本 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: isMobile ? '24px' : '48px 60px',
          background: '#f8f9fa'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* 基本信息组 */}
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '2px solid #e9ecef'
            }}>
              <h3 style={{
                margin: '0 0 24px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '16px',
                borderBottom: '3px solid #667eea'
              }}>
                <span style={{ fontSize: '24px' }}>📋</span>
                基本信息
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '24px'
              }}>
                <FormField
                  label="项目名称"
                  value={editForm.name}
                  onChange={(value) => updateFormField('name', value)}
                  required
                />
                <FormField
                  label="项目类型"
                  value={editForm.type}
                  onChange={(value) => updateFormField('type', value)}
                />
                <FormField
                  label="项目状态"
                  value={editForm.status}
                  onChange={(value) => updateFormField('status', value)}
                  type="select"
                  options={['规划中', '进行中', '已完成', '已暂停', '已取消']}
                />
                <FormField
                  label="优先级"
                  value={editForm.priority}
                  onChange={(value) => updateFormField('priority', value)}
                  type="select"
                  options={['高', '中', '低']}
                />
              </div>
            </div>

            {/* 时间与预算组 */}
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '2px solid #e9ecef'
            }}>
              <h3 style={{
                margin: '0 0 24px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '16px',
                borderBottom: '3px solid #27ae60'
              }}>
                <span style={{ fontSize: '24px' }}>📅</span>
                时间与预算
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '24px'
              }}>
                <FormField
                  label="开始日期"
                  value={editForm.startDate}
                  onChange={(value) => updateFormField('startDate', value)}
                  type="date"
                />
                <FormField
                  label="结束日期"
                  value={editForm.endDate}
                  onChange={(value) => updateFormField('endDate', value)}
                  type="date"
                />
                <FormField
                  label="项目进度 (%)"
                  value={editForm.progress}
                  onChange={(value) => updateFormField('progress', value)}
                  type="number"
                  min="0"
                  max="100"
                />
                <FormField
                  label="项目预算（元）"
                  value={editForm.budget}
                  onChange={(value) => updateFormField('budget', value)}
                  type="number"
                />
              </div>
            </div>

            {/* 团队与组织组 */}
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '2px solid #e9ecef'
            }}>
              <h3 style={{
                margin: '0 0 24px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '16px',
                borderBottom: '3px solid #e74c3c'
              }}>
                <span style={{ fontSize: '24px' }}>👥</span>
                团队与组织
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '24px'
              }}>
                <FormField
                  label="项目经理"
                  value={editForm.manager}
                  onChange={(value) => updateFormField('manager', value)}
                  type="select"
                  options={managers.map(u => ({ 
                    value: `${u.full_name || u.username} (${u.role === 'admin' ? '管理员' : u.role === 'project_manager' ? '项目经理' : '普通用户'})`,
                    label: `${u.full_name || u.username} (${u.role === 'admin' ? '管理员' : u.role === 'project_manager' ? '项目经理' : '普通用户'})`
                  }))}
                />
                <FormField
                  label="所属部门"
                  value={editForm.department}
                  onChange={(value) => updateFormField('department', value)}
                />
                <FormField
                  label="项目团队"
                  value={editForm.team}
                  onChange={(value) => updateFormField('team', value)}
                />
                <FormField
                  label="客户名称"
                  value={editForm.customer}
                  onChange={(value) => updateFormField('customer', value)}
                />
              </div>
            </div>

            {/* 项目描述组 */}
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '2px solid #e9ecef'
            }}>
              <h3 style={{
                margin: '0 0 24px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: '16px',
                borderBottom: '3px solid #f39c12'
              }}>
                <span style={{ fontSize: '24px' }}>📝</span>
                项目描述
              </h3>
              <FormField
                label="项目描述"
                value={editForm.description}
                onChange={(value) => updateFormField('description', value)}
                type="textarea"
                rows={6}
              />
            </div>

            {/* 设置为默认项目 - 优化版 */}
            <div style={{
              background: 'white',
              padding: '28px 32px',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '2px solid #ffc107',
              background: 'linear-gradient(135deg, #fff8e1 0%, #ffffff 100%)'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={editForm.isDefault || false}
                  onChange={(e) => updateFormField('isDefault', e.target.checked)}
                  style={{
                    width: '22px',
                    height: '22px',
                    marginTop: '2px',
                    marginRight: '16px',
                    cursor: 'pointer',
                    accentColor: '#ffc107'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#2c3e50',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>⭐</span>
                    <span>设置为默认项目</span>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6c757d',
                    lineHeight: '1.6'
                  }}>
                    默认项目将在其他模块的项目选择器中默认选中，方便快速访问
                    <span style={{
                      display: 'inline-block',
                      marginLeft: '8px',
                      padding: '2px 10px',
                      background: '#ffc107',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      全局唯一
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 对话框底部 - 固定在底部 */}
        <div style={{
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          padding: '24px 40px',
          borderTop: '2px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 -2px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#6c757d',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <span>请填写完整的项目信息以便更好地管理</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '14px 36px',
                background: 'white',
                border: '2px solid #dee2e6',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                color: '#6c757d',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#adb5bd';
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#dee2e6';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>✕</span>
              <span>取消</span>
            </button>
            <button
              onClick={onSave}
              style={{
                padding: '14px 40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.35)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.35)';
              }}
            >
              <span style={{ fontSize: '18px' }}>✓</span>
              <span>{editingProjectId ? '保存更改' : '创建项目'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditDialog;
