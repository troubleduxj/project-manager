import React, { useState, useEffect } from 'react';
import styles from './PDFViewer.module.css';

const SimplePDFViewer = ({ 
  fileUrl, 
  onClose, 
  title = 'PDF 文档预览',
  className = '' 
}) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取带认证的 PDF 数据
  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('需要登录才能查看 PDF');
          setLoading(false);
          return;
        }

        const response = await fetch(fileUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlob(blobUrl);
        setLoading(false);
      } catch (err) {
        console.error('获取 PDF 失败:', err);
        setError('加载 PDF 失败: ' + err.message);
        setLoading(false);
      }
    };

    if (fileUrl) {
      fetchPDF();
    }

    // 清理 blob URL
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [fileUrl]);

  // 清理 blob URL
  useEffect(() => {
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [pdfBlob]);
  // 下载功能
  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_') + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 在新窗口中打开
  const handleOpenInNewWindow = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const containerClass = `${styles.pdfViewer} ${className}`;

  return (
    <div className={containerClass}>
      {/* 工具栏 */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button 
            className={styles.toolbarBtn}
            onClick={onClose}
            title="关闭 (Esc)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className={styles.title}>{title}</div>
        </div>

        <div className={styles.toolbarRight}>
          <button 
            className={styles.actionBtn}
            onClick={handleDownload}
            title="下载文档"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            下载
          </button>
          <button 
            className={styles.actionBtn}
            onClick={handleOpenInNewWindow}
            title="在新窗口中打开"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15,3 21,3 21,9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            新窗口打开
          </button>
        </div>
      </div>

      {/* PDF 内容区域 */}
      <div className={styles.pdfContent}>
        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>正在加载 PDF...</p>
          </div>
        )}
        
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <h3>加载失败</h3>
              <p>{error}</p>
              <div className={styles.fallbackActions}>
                <button 
                  className={styles.downloadBtn}
                  onClick={handleDownload}
                >
                  下载文档
                </button>
                <button 
                  className={styles.downloadBtn}
                  onClick={handleOpenInNewWindow}
                >
                  新窗口打开
                </button>
              </div>
            </div>
          </div>
        )}
        
        {pdfBlob && !loading && !error && (
          <div className={styles.embedContainer}>
            <iframe
              src={pdfBlob}
              title={title}
              className={styles.pdfFrame}
              frameBorder="0"
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default SimplePDFViewer;
