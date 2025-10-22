import React, { useState, useEffect } from 'react';
import styles from './FolderDialog.module.css';

const FolderDialog = ({ 
  isOpen, 
  mode = 'create', // 'create' | 'edit' | 'delete' | 'move'
  folder = null,
  parentFolderId = null,
  folders = [], // 所有文件夹列表（用于移动时选择目标）
  onConfirm, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#2e8555',
    icon: '📁'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [targetParentId, setTargetParentId] = useState(null); // 移动目标父文件夹ID

  // 预定义的图标选项
  const iconOptions = ['📁', '📂', '📄', '📋', '📊', '📈', '🎯', '⚙️', '🔧', '💼', '📦', '🎨', '🔒', '⭐'];
  
  // 预定义的颜色选项
  const colorOptions = [
    '#2e8555', // 默认绿色
    '#0ea5e9', // 蓝色
    '#8b5cf6', // 紫色
    '#f59e0b', // 橙色
    '#ef4444', // 红色
    '#ec4899', // 粉色
    '#6366f1', // 靛蓝
    '#10b981', // 翠绿
  ];

  // 扁平化文件夹树，添加层级信息
  const flattenFolders = (folders, level = 0, result = []) => {
    folders.forEach(folder => {
      result.push({ ...folder, level });
      if (folder.children && folder.children.length > 0) {
        flattenFolders(folder.children, level + 1, result);
      }
    });
    return result;
  };

  // 检查一个文件夹是否是另一个文件夹的子文件夹
  const isDescendant = (parentId, childId, allFolders) => {
    if (parentId === childId) return true;
    
    const flatFolders = flattenFolders(allFolders);
    const findChildren = (folderId) => {
      const children = flatFolders.filter(f => f.parent_folder_id === folderId);
      return children;
    };

    let toCheck = [parentId];
    while (toCheck.length > 0) {
      const currentId = toCheck.shift();
      if (currentId === childId) return true;
      const children = findChildren(currentId);
      toCheck.push(...children.map(c => c.id));
    }
    return false;
  };

  // 获取可用的目标文件夹列表（移动模式）
  const getAvailableFolders = () => {
    if (mode !== 'move' || !folder) return flattenFolders(folders);
    
    const flatFolders = flattenFolders(folders);
    // 过滤掉自己和自己的子文件夹
    return flatFolders.filter(f => 
      f.id !== folder.id && !isDescendant(folder.id, f.id, folders)
    );
  };

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && folder) {
        setFormData({
          name: folder.name || '',
          description: folder.description || '',
          color: folder.color || '#2e8555',
          icon: folder.icon || '📁'
        });
      } else if (mode === 'move' && folder) {
        // 移动模式下设置当前父文件夹为默认选中
        setTargetParentId(folder.parent_folder_id);
      } else {
        setFormData({
          name: '',
          description: '',
          color: '#2e8555',
          icon: '📁'
        });
      }
      setError('');
    }
  }, [isOpen, mode, folder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'delete') {
      handleDelete();
      return;
    }

    if (mode === 'move') {
      // 移动模式
      setLoading(true);
      setError('');
      try {
        await onConfirm({ parent_folder_id: targetParentId });
      } catch (err) {
        setError(err.message || '移动失败');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!formData.name.trim()) {
      setError('文件夹名称不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConfirm(formData);
    } catch (err) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      await onConfirm();
    } catch (err) {
      setError(err.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>
            {mode === 'create' && '📁 创建文件夹'}
            {mode === 'edit' && '✏️ 编辑文件夹'}
            {mode === 'delete' && '🗑️ 删除文件夹'}
            {mode === 'move' && '📦 移动文件夹'}
          </h3>
          <button className={styles.closeButton} onClick={onCancel}>✕</button>
        </div>

        {mode === 'delete' ? (
          // 删除确认
          <div className={styles.content}>
            <div className={styles.deleteWarning}>
              <div className={styles.warningIcon}>⚠️</div>
              <p>确定要删除文件夹 <strong>"{folder?.name}"</strong> 吗？</p>
              <p className={styles.warningText}>
                此操作将把该文件夹下的所有文件和子文件夹移动到上级目录。
              </p>
            </div>

            {error && (
              <div className={styles.error}>
                <span>❌</span>
                <span>{error}</span>
              </div>
            )}

            <div className={styles.actions}>
              <button 
                type="button" 
                className={styles.cancelButton} 
                onClick={onCancel}
                disabled={loading}
              >
                取消
              </button>
              <button 
                type="button" 
                className={styles.deleteButton} 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        ) : mode === 'move' ? (
          // 移动文件夹 - 选择目标父文件夹
          <form onSubmit={handleSubmit}>
            <div className={styles.content}>
              {error && (
                <div className={styles.error}>
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="targetFolder">
                  移动 <strong>"{folder?.name}"</strong> 到：
                </label>
                <select
                  id="targetFolder"
                  value={targetParentId || ''}
                  onChange={(e) => setTargetParentId(e.target.value ? parseInt(e.target.value) : null)}
                  className={styles.folderSelect}
                >
                  <option value="">根目录</option>
                  {getAvailableFolders().map(f => (
                    <option key={f.id} value={f.id}>
                      {'　'.repeat(f.level)}
                      {f.icon || '📁'} {f.name}
                    </option>
                  ))}
                </select>
                <p className={styles.hint}>
                  选择要移动到的目标文件夹
                </p>
              </div>

              <div className={styles.actions}>
                <button 
                  type="button" 
                  className={styles.cancelButton} 
                  onClick={onCancel}
                  disabled={loading}
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? '移动中...' : '确认移动'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          // 创建/编辑表单
          <form onSubmit={handleSubmit}>
            <div className={styles.content}>
              {error && (
                <div className={styles.error}>
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="name">
                  <span className={styles.required}>*</span> 文件夹名称
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入文件夹名称"
                  maxLength={50}
                  autoFocus
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">描述</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入文件夹描述（可选）"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className={styles.formGroup}>
                <label>图标</label>
                <div className={styles.iconPicker}>
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`${styles.iconButton} ${formData.icon === icon ? styles.selected : ''}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>颜色</label>
                <div className={styles.colorPicker}>
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`${styles.colorButton} ${formData.color === color ? styles.selected : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    >
                      {formData.color === color && <span className={styles.checkMark}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                type="button" 
                className={styles.cancelButton} 
                onClick={onCancel}
                disabled={loading}
              >
                取消
              </button>
              <button 
                type="submit" 
                className={styles.confirmButton}
                disabled={loading}
              >
                {loading ? '保存中...' : mode === 'create' ? '创建' : '保存'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FolderDialog;

