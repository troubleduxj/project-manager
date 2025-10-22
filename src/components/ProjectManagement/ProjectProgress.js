import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProjectManagement.module.css';

const ProjectProgress = ({ project, user, onProgressUpdated }) => {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    assignedTo: '',
    startDate: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [project.id]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/projects/${project.id}/progress`);
      setTasks(response.data);
    } catch (error) {
      setError('获取任务列表失败');
      console.error('获取任务失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/api/projects/${project.id}/tasks`, newTask);
      setNewTask({
        taskName: '',
        description: '',
        assignedTo: '',
        startDate: '',
        dueDate: ''
      });
      setShowAddTask(false);
      fetchTasks();
      onProgressUpdated();
    } catch (error) {
      setError('添加任务失败');
      console.error('添加任务失败:', error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await axios.put(`http://localhost:3001/api/projects/${project.id}/tasks/${taskId}`, updates);
      fetchTasks();
      onProgressUpdated();
      setEditingTask(null);
    } catch (error) {
      setError('更新任务失败');
      console.error('更新任务失败:', error);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': '待开始',
      'in_progress': '进行中',
      'completed': '已完成',
      'on_hold': '暂停'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': '#6c757d',
      'in_progress': '#007bff',
      'completed': '#28a745',
      'on_hold': '#ffc107'
    };
    return colorMap[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const canEditTasks = user.role === 'admin' || project.manager_id === user.id;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>加载任务列表...</p>
      </div>
    );
  }

  return (
    <div className={styles.progressManager}>
      <div className={styles.progressHeader}>
        <h3>项目进度管理</h3>
        {canEditTasks && (
          <button 
            className={styles.addButton}
            onClick={() => setShowAddTask(true)}
          >
            ➕ 添加任务
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* 添加任务表单 */}
      {showAddTask && (
        <div className={styles.addTaskForm}>
          <h4>添加新任务</h4>
          <form onSubmit={handleAddTask}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>任务名称 *</label>
                <input
                  type="text"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({...newTask, taskName: e.target.value})}
                  required
                  placeholder="请输入任务名称"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>任务描述</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                rows="3"
                placeholder="请输入任务描述"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>开始日期</label>
                <input
                  type="date"
                  value={newTask.startDate}
                  onChange={(e) => setNewTask({...newTask, startDate: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>截止日期</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setShowAddTask(false)}
              >
                取消
              </button>
              <button type="submit" className={styles.submitButton}>
                添加任务
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 任务列表 */}
      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h4>暂无任务</h4>
            <p>点击"添加任务"开始创建项目任务</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={styles.taskCard}>
              {editingTask === task.id ? (
                <TaskEditForm 
                  task={task}
                  onSave={(updates) => handleUpdateTask(task.id, updates)}
                  onCancel={() => setEditingTask(null)}
                />
              ) : (
                <TaskDisplay 
                  task={task}
                  canEdit={canEditTasks}
                  onEdit={() => setEditingTask(task.id)}
                  onQuickUpdate={(updates) => handleUpdateTask(task.id, updates)}
                  getStatusText={getStatusText}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 任务显示组件
const TaskDisplay = ({ 
  task, 
  canEdit, 
  onEdit, 
  onQuickUpdate, 
  getStatusText, 
  getStatusColor, 
  formatDate 
}) => {
  const handleProgressChange = (e) => {
    const progress = parseInt(e.target.value);
    const status = progress === 100 ? 'completed' : 
                  progress > 0 ? 'in_progress' : 'pending';
    
    onQuickUpdate({
      ...task,
      progress,
      status
    });
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    const progress = status === 'completed' ? 100 : 
                    status === 'pending' ? 0 : task.progress;
    
    onQuickUpdate({
      ...task,
      status,
      progress
    });
  };

  return (
    <>
      <div className={styles.taskHeader}>
        <div className={styles.taskTitle}>
          <h4>{task.task_name}</h4>
          <span 
            className={styles.taskStatus}
            style={{ backgroundColor: getStatusColor(task.status) }}
          >
            {getStatusText(task.status)}
          </span>
        </div>
        {canEdit && (
          <button 
            className={styles.editButton}
            onClick={onEdit}
          >
            编辑
          </button>
        )}
      </div>

      <div className={styles.taskContent}>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}

        <div className={styles.taskProgress}>
          <div className={styles.progressLabel}>
            <span>进度</span>
            <span>{task.progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          {canEdit && (
            <input
              type="range"
              min="0"
              max="100"
              value={task.progress}
              onChange={handleProgressChange}
              className={styles.progressSlider}
            />
          )}
        </div>

        <div className={styles.taskMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>负责人:</span>
            <span>{task.assigned_name || '未分配'}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>开始时间:</span>
            <span>{formatDate(task.start_date)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>截止时间:</span>
            <span>{formatDate(task.due_date)}</span>
          </div>
          {canEdit && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>状态:</span>
              <select 
                value={task.status}
                onChange={handleStatusChange}
                className={styles.statusSelect}
              >
                <option value="pending">待开始</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="on_hold">暂停</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// 任务编辑表单组件
const TaskEditForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    taskName: task.task_name,
    description: task.description || '',
    status: task.status,
    progress: task.progress,
    startDate: task.start_date || '',
    dueDate: task.due_date || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.formGroup}>
        <label>任务名称</label>
        <input
          type="text"
          value={formData.taskName}
          onChange={(e) => setFormData({...formData, taskName: e.target.value})}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>任务描述</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="3"
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>状态</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="pending">待开始</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
            <option value="on_hold">暂停</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>进度 ({formData.progress}%)</label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>开始日期</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>截止日期</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
        </div>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          取消
        </button>
        <button type="submit" className={styles.submitButton}>
          保存
        </button>
      </div>
    </form>
  );
};

export default ProjectProgress;
