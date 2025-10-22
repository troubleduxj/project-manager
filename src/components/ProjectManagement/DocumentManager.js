import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProjectManagement.module.css';

const DocumentManager = ({ project, user }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'general',
    isPublic: false,
    file: null
  });

  useEffect(() => {
    fetchDocuments();
  }, [project.id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/documents/project/${project.id}`);
      setDocuments(response.data);
    } catch (error) {
      setError('获取文档列表失败');
      console.error('获取文档失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      setError('请选择要上传的文件');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title || uploadForm.file.name);
      formData.append('category', uploadForm.category);
      formData.append('isPublic', uploadForm.isPublic);

      await axios.post(
        `http://localhost:3001/api/documents/project/${project.id}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUploadForm({
        title: '',
        category: 'general',
        isPublic: false,
        file: null
      });
      setShowUploadForm(false);
      fetchDocuments();
    } catch (error) {
      setError(error.response?.data?.error || '文件上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/documents/${documentId}/download`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('文件下载失败');
      console.error('下载失败:', error);
    }
  };

  const handlePreview = async (documentId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/documents/${documentId}/preview`);
      setPreviewDocument(response.data);
    } catch (error) {
      setError('文件预览失败');
      console.error('预览失败:', error);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('确定要删除这个文档吗？')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/documents/${documentId}`);
      fetchDocuments();
    } catch (error) {
      setError('删除文档失败');
      console.error('删除失败:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'general': '常规文档',
      'requirement': '需求文档',
      'design': '设计文档',
      'technical': '技术文档',
      'test': '测试文档',
      'manual': '用户手册',
      'contract': '合同文档'
    };
    return categoryMap[category] || category;
  };

  const canUpload = user.role === 'admin' || project.manager_id === user.id;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>加载文档列表...</p>
      </div>
    );
  }

  return (
    <div className={styles.documentManager}>
      <div className={styles.documentHeader}>
        <h3>项目文档</h3>
        {canUpload && (
          <button 
            className={styles.uploadButton}
            onClick={() => setShowUploadForm(true)}
          >
            📤 上传文档
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* 上传表单 */}
      {showUploadForm && (
        <div className={styles.uploadForm}>
          <h4>上传新文档</h4>
          <form onSubmit={handleFileUpload}>
            <div className={styles.formGroup}>
              <label>选择文件 *</label>
              <input
                type="file"
                onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                required
                accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.zip,.rar"
              />
              <small>支持的文件类型: PDF, DOC, DOCX, TXT, MD, JPG, PNG, GIF, ZIP, RAR</small>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>文档标题</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  placeholder="留空则使用文件名"
                />
              </div>
              <div className={styles.formGroup}>
                <label>文档分类</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                >
                  <option value="general">常规文档</option>
                  <option value="requirement">需求文档</option>
                  <option value="design">设计文档</option>
                  <option value="technical">技术文档</option>
                  <option value="test">测试文档</option>
                  <option value="manual">用户手册</option>
                  <option value="contract">合同文档</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={uploadForm.isPublic}
                  onChange={(e) => setUploadForm({...uploadForm, isPublic: e.target.checked})}
                />
                公开文档（客户可见）
              </label>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setShowUploadForm(false)}
              >
                取消
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={uploading}
              >
                {uploading ? '上传中...' : '上传文档'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 文档列表 */}
      <div className={styles.documentList}>
        {documents.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📄</div>
            <h4>暂无文档</h4>
            <p>点击"上传文档"开始添加项目文档</p>
          </div>
        ) : (
          <div className={styles.documentGrid}>
            {documents.map(doc => (
              <div key={doc.id} className={styles.documentCard}>
                <div className={styles.documentIcon}>
                  {getFileIcon(doc.file_type)}
                </div>
                
                <div className={styles.documentInfo}>
                  <h4 className={styles.documentTitle}>{doc.title}</h4>
                  <div className={styles.documentMeta}>
                    <span className={styles.category}>
                      {getCategoryText(doc.category)}
                    </span>
                    <span className={styles.fileSize}>
                      {formatFileSize(doc.file_size)}
                    </span>
                    {doc.is_public && (
                      <span className={styles.publicBadge}>公开</span>
                    )}
                  </div>
                  <div className={styles.documentDetails}>
                    <small>
                      上传者: {doc.uploaded_by_name} | 
                      上传时间: {formatDate(doc.created_at)}
                    </small>
                  </div>
                </div>

                <div className={styles.documentActions}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handlePreview(doc.id)}
                    title="预览"
                  >
                    👁️
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleDownload(doc.id, doc.title)}
                    title="下载"
                  >
                    ⬇️
                  </button>
                  {canUpload && (
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleDeleteDocument(doc.id)}
                      title="删除"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 文档预览模态框 */}
      {previewDocument && (
        <div className={styles.previewModal}>
          <div className={styles.previewContent}>
            <div className={styles.previewHeader}>
              <h4>{previewDocument.filename}</h4>
              <button 
                className={styles.closeButton}
                onClick={() => setPreviewDocument(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.previewBody}>
              {previewDocument.type === 'text' ? (
                <pre className={styles.textPreview}>
                  {previewDocument.content}
                </pre>
              ) : (
                <div className={styles.fileInfo}>
                  <div className={styles.fileIcon}>
                    {getFileIcon(previewDocument.fileType)}
                  </div>
                  <p>文件类型: {previewDocument.fileType}</p>
                  <p>文件大小: {formatFileSize(previewDocument.fileSize)}</p>
                  <p>此文件类型不支持在线预览，请下载后查看。</p>
                  <a 
                    href={previewDocument.downloadUrl}
                    className={styles.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    点击下载
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 获取文件图标
const getFileIcon = (fileType) => {
  if (fileType?.includes('pdf')) return '📄';
  if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
  if (fileType?.includes('image')) return '🖼️';
  if (fileType?.includes('text')) return '📃';
  if (fileType?.includes('zip') || fileType?.includes('rar')) return '📦';
  return '📄';
};

export default DocumentManager;
