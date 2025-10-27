import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/api';
import styles from './ProjectManagement.module.css';

const CreateProject = ({ onProjectCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    manager: '',
    priority: 'medium',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: '',
    tags: ''
  });
  const [clients, setClients] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
    fetchManagers();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CLIENTS_LIST, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('获取客户列表失败:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7080/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const managerList = data.filter(u => 
          u.role === 'project_manager' || u.role === 'admin'
        );
        setManagers(managerList || []);
      }
    } catch (error) {
      console.error('获取项目经理列表失败:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 验证日期
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      setError('结束日期不能早于开始日期');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PROJECTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onProjectCreated();
      } else {
        const data = await response.json();
        setError(data.error || '创建项目失败');
      }
    } catch (error) {
      setError('创建项目失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 全屏遮罩层 */}
      <div 
        className={styles.fullscreenOverlay}
        onClick={onCancel}
      />
      
      {/* 全屏对话框 */}
      <div className={styles.fullscreenDialog}>
        <div className={styles.dialogHeader}>
          <h2>📝 创建新项目</h2>
          <button 
            className={styles.closeButton}
            onClick={onCancel}
            title="关闭"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.dialogForm}>
          <div className={styles.formSection}>
            <h3>📋 基本信息</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">
                  项目名称 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="请输入项目名称"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="clientId">
                  客户 <span className={styles.required}>*</span>
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">请选择客户</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.full_name || client.username} ({client.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="manager">项目经理</label>
                <select
                  id="manager"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="">请选择项目经理</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={`${manager.full_name || manager.username} (${manager.role === 'project_manager' ? '项目经理' : '管理员'})`}>
                      {manager.full_name || manager.username} ({manager.role === 'project_manager' ? '项目经理' : '管理员'})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status">项目状态</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="planning">📋 规划中</option>
                  <option value="in_progress">🚀 进行中</option>
                  <option value="completed">✅ 已完成</option>
                  <option value="on_hold">⏸️ 暂停</option>
                  <option value="cancelled">❌ 已取消</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">项目描述</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="请输入项目描述、目标、范围等详细信息"
                className={styles.formTextarea}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>📅 时间与预算</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate">开始日期</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endDate">结束日期</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="budget">项目预算（元）</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="请输入预算金额"
                  min="0"
                  step="0.01"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="priority">优先级</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="low">🟢 低</option>
                  <option value="medium">🟡 中</option>
                  <option value="high">🟠 高</option>
                  <option value="urgent">🔴 紧急</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tags">项目标签</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="用逗号分隔，例如：Web开发,移动应用,云服务"
                className={styles.formInput}
              />
              <small className={styles.formHint}>
                添加标签可以帮助更好地分类和搜索项目
              </small>
            </div>
          </div>

          <div className={styles.dialogActions}>
            <button 
              type="button" 
              className={styles.cancelBtn}
              onClick={onCancel}
              disabled={loading}
            >
              ✕ 取消
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? '⏳ 创建中...' : '✓ 创建项目'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
