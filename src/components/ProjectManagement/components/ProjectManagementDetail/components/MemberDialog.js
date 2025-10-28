import React, { useCallback, useState } from 'react';
import FormField from './FormField';

const MemberDialog = ({ show, editForm, projects, allUsers = [], isMobile, onClose, onSave, onChange }) => {
  if (!show) return null;

  const isEdit = editForm.id;
  const [useExistingUser, setUseExistingUser] = useState(false);

  // 使用 useCallback 包装表单字段更新函数
  const updateFormField = useCallback((field, value) => {
    onChange(prev => ({ ...prev, [field]: value }));
  }, [onChange]);

  // 从用户列表选择用户时自动填充信息
  const handleUserSelect = (userInfo) => {
    if (!userInfo) return;
    
    // 从选择的文本中提取用户名
    const selectedUser = allUsers.find(u => 
      userInfo.includes(u.full_name || u.username)
    );
    
    if (selectedUser) {
      onChange(prev => ({
        ...prev,
        name: selectedUser.full_name || selectedUser.username,
        email: selectedUser.email || '',
        userId: selectedUser.id
      }));
    }
  };

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
        width: isMobile ? '100%' : '600px',
        maxHeight: '90vh',
        borderRadius: isMobile ? '0' : '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.3s ease'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600' }}>
              {isEdit ? '✏️ 编辑成员信息' : '👤 添加项目成员'}
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {isEdit ? '修改成员的详细信息' : '填写成员基本信息'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {/* 选择方式 */}
          {allUsers.length > 0 && !isEdit && (
            <div style={{ 
              marginBottom: '24px', 
              padding: '16px', 
              background: '#f0f7ff', 
              borderRadius: '8px',
              border: '1px solid #b3d9ff'
            }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                <input
                  type="checkbox"
                  checked={useExistingUser}
                  onChange={(e) => setUseExistingUser(e.target.checked)}
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <span>📋 从现有用户中选择（自动填充信息）</span>
              </label>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
            {useExistingUser && allUsers.length > 0 ? (
              <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                <FormField
                  label="选择用户"
                  type="select"
                  value=""
                  onChange={(value) => handleUserSelect(value)}
                  options={[
                    { value: '', label: '-- 请选择用户 --' },
                    ...allUsers.map(u => ({ 
                      value: `${u.full_name || u.username}`,
                      label: `${u.full_name || u.username} (${u.email || '无邮箱'})` 
                    }))
                  ]}
                />
              </div>
            ) : null}

            <FormField
              label="姓名"
              type="text"
              value={editForm.name || ''}
              onChange={(value) => updateFormField('name', value)}
              placeholder="请输入姓名"
              required
            />
            <FormField
              label="角色"
              type="text"
              value={editForm.role || ''}
              onChange={(value) => updateFormField('role', value)}
              placeholder="如: 开发工程师"
            />
            <FormField
              label="部门"
              type="text"
              value={editForm.department || ''}
              onChange={(value) => updateFormField('department', value)}
              placeholder="如: 技术部"
            />
            <FormField
              label="电话"
              type="text"
              value={editForm.phone || ''}
              onChange={(value) => updateFormField('phone', value)}
              placeholder="请输入电话号码"
            />
            <FormField
              label="邮箱"
              type="email"
              value={editForm.email || ''}
              onChange={(value) => updateFormField('email', value)}
              placeholder="请输入邮箱"
            />
            <FormField
              label="入职日期"
              type="date"
              value={editForm.joinDate || ''}
              onChange={(value) => updateFormField('joinDate', value)}
            />
            <FormField
              label="状态"
              type="select"
              value={editForm.status || '在职'}
              onChange={(value) => updateFormField('status', value)}
              options={['在职', '离职', '休假']}
            />
            <FormField
              label="所属项目"
              type="select"
              value={editForm.projectId || ''}
              onChange={(value) => updateFormField('projectId', parseInt(value))}
              options={[
                { value: '', label: '请选择项目' },
                ...projects.map(p => ({ value: p.id, label: p.name }))
              ]}
              required
            />
          </div>
        </div>
        <div style={{
          background: '#f8f9fa',
          padding: '16px 24px',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6c757d'
            }}
          >
            取消
          </button>
          <button
            onClick={onSave}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
          >
            {isEdit ? '保存更改' : '添加成员'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDialog;

