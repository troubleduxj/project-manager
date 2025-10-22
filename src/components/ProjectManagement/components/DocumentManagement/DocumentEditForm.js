import React from 'react';
import { documentCategories } from './utils';

/**
 * 文档编辑表单组件
 * 用于编辑已有文档的信息
 */
const DocumentEditForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingDoc,
  folders = []
}) => {
  if (!isOpen || !editingDoc) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await onSubmit(formData);
  };

  // 扁平化文件夹树，用于下拉选择
  const flattenFolders = (folders, level = 0, result = []) => {
    folders.forEach(folder => {
      result.push({ ...folder, level });
      if (folder.children && folder.children.length > 0) {
        flattenFolders(folder.children, level + 1, result);
      }
    });
    return result;
  };

  const flatFolders = flattenFolders(folders);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        animation: 'slideUp 0.3s ease'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#495057',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          ✏️ 编辑文档信息
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* 文档标题 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500',
              color: '#495057'
            }}>
              文档标题 <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              defaultValue={editingDoc.title || ''}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>
          
          {/* 文档分类 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500',
              color: '#495057'
            }}>
              文档分类
            </label>
            <select
              name="category"
              defaultValue={editingDoc.category || 'other'}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              {documentCategories.filter(cat => cat.id !== 'all').map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 文件夹选择 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500',
              color: '#495057'
            }}>
              存放文件夹
            </label>
            <select
              name="folder_id"
              defaultValue={editingDoc.folder_id || ''}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="">根目录</option>
              {flatFolders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {'　'.repeat(folder.level)}
                  {folder.icon || '📁'} {folder.name}
                </option>
              ))}
            </select>
            <small style={{ 
              display: 'block', 
              marginTop: '4px', 
              color: '#6c757d',
              fontSize: '12px'
            }}>
              选择文档所在的文件夹位置
            </small>
          </div>
          
          {/* 文档描述 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500',
              color: '#495057'
            }}>
              文档描述
            </label>
            <textarea
              name="content"
              defaultValue={editingDoc.content || ''}
              rows="4"
              placeholder="请输入文档描述信息..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>
          
          {/* 按钮组 */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end' 
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                background: 'white',
                color: '#6c757d',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.borderColor = '#dee2e6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e9ecef';
              }}
            >
              取消
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s ease'
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
              💾 保存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentEditForm;

