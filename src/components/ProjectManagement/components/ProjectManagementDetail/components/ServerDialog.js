import React, { useCallback } from 'react';
import FormField from './FormField';

const ServerDialog = ({ show, editForm, projects, isMobile, onClose, onSave, onChange }) => {
  if (!show) return null;

  const isEdit = editForm.id;

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
        width: isMobile ? '100%' : '700px',
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
              {isEdit ? '✏️ 编辑服务器信息' : '🖥️ 添加服务器'}
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {isEdit ? '修改服务器的详细信息' : '填写服务器基本信息'}
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
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
            <FormField
              label="服务器名称"
              type="text"
              value={editForm.name || ''}
              onChange={(value) => updateFormField('name', value)}
              placeholder="请输入服务器名称"
              required
            />
            <FormField
              label="IP地址"
              type="text"
              value={editForm.ip || ''}
              onChange={(value) => updateFormField('ip', value)}
              placeholder="如: 192.168.1.100"
              required
            />
            <FormField
              label="操作系统"
              type="text"
              value={editForm.type || ''}
              onChange={(value) => updateFormField('type', value)}
              placeholder="如: Linux/Windows"
            />
            <FormField
              label="用途"
              type="text"
              value={editForm.purpose || ''}
              onChange={(value) => updateFormField('purpose', value)}
              placeholder="如: 应用服务器"
            />
            <FormField
              label="CPU"
              type="text"
              value={editForm.cpu || ''}
              onChange={(value) => updateFormField('cpu', value)}
              placeholder="如: 8核"
            />
            <FormField
              label="内存"
              type="text"
              value={editForm.memory || ''}
              onChange={(value) => updateFormField('memory', value)}
              placeholder="如: 16GB"
            />
            <FormField
              label="硬盘"
              type="text"
              value={editForm.disk || ''}
              onChange={(value) => updateFormField('disk', value)}
              placeholder="如: 500GB SSD"
            />
            <FormField
              label="状态"
              type="select"
              value={editForm.status || '运行中'}
              onChange={(value) => updateFormField('status', value)}
              options={['运行中', '已停止', '维护中']}
            />
            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
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
            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
              <FormField
                label="备注"
                type="textarea"
                value={editForm.remark || ''}
                onChange={(value) => updateFormField('remark', value)}
                placeholder="请输入备注信息"
                rows={3}
              />
            </div>
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
            {isEdit ? '保存更改' : '添加服务器'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerDialog;

