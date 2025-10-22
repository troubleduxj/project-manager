import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProjectManagement.module.css';

const CreateProject = ({ onProjectCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    priority: 'medium',
    startDate: '',
    endDate: '',
    budget: ''
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/projects/clients/list');
      setClients(response.data);
    } catch (error) {
      console.error('获取客户列表失败:', error);
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

    try {
      await axios.post('http://localhost:3001/api/projects', formData);
      onProjectCreated();
    } catch (error) {
      setError(error.response?.data?.error || '创建项目失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createProject}>
      <div className={styles.createHeader}>
        <h2>创建新项目</h2>
        <button 
          className={styles.cancelButton}
          onClick={onCancel}
        >
          取消
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="name">项目名称 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="请输入项目名称"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="clientId">客户 *</label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
            >
              <option value="">请选择客户</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.full_name} ({client.email})
                </option>
              ))}
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
            placeholder="请输入项目描述"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="priority">优先级</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="urgent">紧急</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="budget">预算</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="请输入预算金额"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">开始日期</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
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
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            取消
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? '创建中...' : '创建项目'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
