import React from 'react';
import FormField from './FormField';
import styles from '../../../ProjectManagement.module.css';

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
    <>
      {/* 全屏遮罩层 */}
      <div className={styles.fullscreenOverlay} onClick={onClose} />
      
      {/* 全屏对话框 */}
      <div className={styles.fullscreenDialog} style={{ maxWidth: '1100px' }}>
        {/* 对话框头部 */}
        <div className={styles.dialogHeader}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
              {editingProjectId ? '📝 编辑项目信息' : '📝 添加新项目'}
            </h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
              {editingProjectId ? '修改项目的详细信息' : '创建一个新的项目'}
            </p>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        {/* 对话框内容 */}
        <div className={styles.dialogForm}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* 基本信息区 */}
            <div className={styles.formSection}>
              <h3>📋 基本信息</h3>
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
                  label="客户名称"
                  value={editForm.customer}
                  onChange={(value) => onChange({ ...editForm, customer: value })}
                  isMobile={isMobile}
                />
                <FormField
                  label="项目状态"
                  value={editForm.status}
                  onChange={(value) => onChange({ ...editForm, status: value })}
                  type="select"
                  options={['规划中', '进行中', '已完成', '已暂停', '已取消']}
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
                  label="项目进度 (%)"
                  value={editForm.progress}
                  onChange={(value) => onChange({ ...editForm, progress: value })}
                  type="number"
                  min="0"
                  max="100"
                  isMobile={isMobile}
                />
              </div>
            </div>

            {/* 时间与预算区 */}
            <div className={styles.formSection}>
              <h3>📅 时间与预算</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '24px'
              }}>
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
                  label="项目预算（元）"
                  value={editForm.budget}
                  onChange={(value) => onChange({ ...editForm, budget: value })}
                  type="number"
                  isMobile={isMobile}
                />
              </div>
            </div>

            {/* 团队与组织区 */}
            <div className={styles.formSection}>
              <h3>👥 团队与组织</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '24px'
              }}>
                <FormField
                  label="项目经理"
                  value={editForm.manager}
                  onChange={(value) => onChange({ ...editForm, manager: value })}
                  type="select"
                  options={managers.map(m => `${m.full_name || m.username} (${m.role === 'project_manager' ? '项目经理' : m.role})`)}
                  isMobile={isMobile}
                />
                <FormField
                  label="所属部门"
                  value={editForm.department}
                  onChange={(value) => onChange({ ...editForm, department: value })}
                  isMobile={isMobile}
                />
                <FormField
                  label="项目团队"
                  value={editForm.team}
                  onChange={(value) => onChange({ ...editForm, team: value })}
                  isMobile={isMobile}
                />
              </div>
            </div>
            
            {/* 项目描述 */}
            <div className={styles.formSection}>
              <h3>📝 项目描述</h3>
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
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e1e5e9' }}>
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

        {/* 对话框底部按钮 */}
        <div className={styles.dialogActions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            ✕ 取消
          </button>
          <button onClick={onSave} className={styles.submitBtn}>
            💾 保存{editingProjectId ? '更改' : '项目'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectEditDialog;

