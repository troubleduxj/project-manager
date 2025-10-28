import React, { useCallback } from 'react';
import FormField from './FormField';

const ResourceDialog = ({ show, editForm, projects, isMobile, onClose, onSave, onChange }) => {
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
              {isEdit ? '✏️ 编辑软件资料' : '📦 添加软件资料'}
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {isEdit ? '修改资料的详细信息' : '填写软件资料信息'}
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
              label="软件名称"
              type="text"
              value={editForm.name || ''}
              onChange={(value) => updateFormField('name', value)}
              placeholder="请输入软件名称"
              required
            />
            <FormField
              label="版本"
              type="text"
              value={editForm.version || ''}
              onChange={(value) => updateFormField('version', value)}
              placeholder="如: 1.0.0"
              required
            />
            <FormField
              label="类型"
              type="text"
              value={editForm.type || ''}
              onChange={(value) => updateFormField('type', value)}
              placeholder="如: 开发工具"
            />
            <FormField
              label="许可证"
              type="text"
              value={editForm.license || ''}
              onChange={(value) => updateFormField('license', value)}
              placeholder="如: MIT"
            />
            <FormField
              label="更新日期"
              type="date"
              value={editForm.updateDate || ''}
              onChange={(value) => updateFormField('updateDate', value)}
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
            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
              <FormField
                label="下载链接"
                type="text"
                value={editForm.downloadUrl || ''}
                onChange={(value) => updateFormField('downloadUrl', value)}
                placeholder="请输入下载链接"
              />
            </div>
            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
              <FormField
                label="说明"
                type="textarea"
                value={editForm.description || ''}
                onChange={(value) => updateFormField('description', value)}
                placeholder="请输入软件说明"
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
            {isEdit ? '保存更改' : '添加资料'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDialog;

