import React from 'react';
import { documentCategories } from './utils';

/**
 * 文档上传表单组件
 * 用于上传新文档到项目
 */
const DocumentUploadForm = ({
  isOpen,
  onClose,
  onSubmit,
  uploading = false,
  uploadProgress = 0,
  folders = [],
  defaultFolderId = null
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await onSubmit(formData);
  };

  // Helper to flatten folders for dropdown display
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
          📤 上传文档
        </h3>
        
        <form onSubmit={handleSubmit}>
          {/* 文件选择 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500',
              color: '#495057'
            }}>
              选择文件 <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <input
              type="file"
              name="document"
              required
              accept=".pdf,.doc,.docx,.xlsx,.xls,.pptx,.ppt,.txt,.md,.jpg,.jpeg,.png,.gif,.zip,.rar"
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
            <small style={{ 
              display: 'block', 
              marginTop: '4px', 
              color: '#6c757d',
              fontSize: '12px'
            }}>
              支持的格式：PDF, Word, Excel, PowerPoint, 图片, 压缩包等
            </small>
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
          
          {/* 存放文件夹 */}
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
              defaultValue={defaultFolderId || ''}
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
              {defaultFolderId 
                ? '默认为当前文件夹，可根据需要修改' 
                : '选择文档的存放位置'}
            </small>
          </div>
          
          {/* 文档描述 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontWeight: '500',
              color: '#495057'
            }}>
              文档描述
            </label>
            <textarea
              name="description"
              rows="3"
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
          
          {/* 上传进度条 */}
          {uploading && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px', color: '#495057', fontWeight: '500' }}>
                    上传进度
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#667eea' }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    transition: 'width 0.3s ease',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            </div>
          )}
          
          {/* 按钮组 */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            marginTop: '20px'
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
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                opacity: uploading ? 0.5 : 1
              }}
              disabled={uploading}
              onMouseEnter={(e) => {
                if (!uploading) {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#dee2e6';
                }
              }}
              onMouseLeave={(e) => {
                if (!uploading) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e9ecef';
                }
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
                background: uploading 
                  ? 'linear-gradient(135deg, #94a3b8, #64748b)' 
                  : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: uploading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s ease'
              }}
              disabled={uploading}
              onMouseEnter={(e) => {
                if (!uploading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!uploading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {uploading ? '⏳ 上传中...' : '✅ 上传'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadForm;

