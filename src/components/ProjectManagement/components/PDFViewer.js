import React, { useState, useEffect, useCallback } from 'react';
import styles from './PDFViewer.module.css';

// 动态导入 react-pdf 以避免 SSR 问题
let Document, Page, pdfjs;

const loadPDFComponents = async () => {
  if (typeof window !== 'undefined') {
    try {
      const reactPdf = await import('react-pdf');
      Document = reactPdf.Document;
      Page = reactPdf.Page;
      pdfjs = reactPdf.pdfjs;
      
      // 配置 PDF.js worker
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      
      return true;
    } catch (error) {
      console.error('Failed to load PDF components:', error);
      return false;
    }
  }
  return false;
};

const PDFViewer = ({ 
  fileUrl, 
  onClose, 
  title = 'PDF 文档预览',
  className = '' 
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageWidth, setPageWidth] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [pdfComponentsLoaded, setPdfComponentsLoaded] = useState(false);

  // 初始化 PDF 组件
  useEffect(() => {
    const initPDF = async () => {
      const loaded = await loadPDFComponents();
      if (loaded) {
        setPdfComponentsLoaded(true);
        setLoading(false);
      } else {
        setError('PDF 预览功能不可用，请使用下载功能查看文档');
        setLoading(false);
      }
    };
    
    initPDF();
  }, []);

  // 文档加载成功
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  // 文档加载失败
  const onDocumentLoadError = useCallback((error) => {
    console.error('PDF 加载失败:', error);
    setError('PDF 文档加载失败，请检查文件是否存在或格式是否正确');
    setLoading(false);
  }, []);

  // 页面渲染成功
  const onPageLoadSuccess = useCallback((page) => {
    if (!pageWidth) {
      setPageWidth(page.width);
    }
  }, [pageWidth]);

  // 导航到指定页面
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  }, [numPages]);

  // 缩放控制
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.2);
  }, []);

  // 全屏切换
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
          case '0':
            e.preventDefault();
            resetZoom();
            break;
          case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
        }
      } else {
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            goToPage(pageNumber - 1);
            break;
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            goToPage(pageNumber + 1);
            break;
          case 'Home':
            e.preventDefault();
            goToPage(1);
            break;
          case 'End':
            e.preventDefault();
            goToPage(numPages);
            break;
          case 'Escape':
            if (isFullscreen) {
              setIsFullscreen(false);
            } else {
              onClose?.();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages, isFullscreen, zoomIn, zoomOut, resetZoom, toggleFullscreen, goToPage, onClose]);

  // 搜索功能（简化版）
  const handleSearch = useCallback((text) => {
    setSearchText(text);
    // 这里可以实现更复杂的搜索功能
    // 目前只是一个占位符
    if (text.trim()) {
      // 模拟搜索结果
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  }, []);

  // 下载功能
  const handleDownload = useCallback(() => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_') + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [fileUrl, title]);

  // 打印功能
  const handlePrint = useCallback(() => {
    if (fileUrl) {
      const printWindow = window.open(fileUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  }, [fileUrl]);

  const containerClass = `${styles.pdfViewer} ${isFullscreen ? styles.fullscreen : ''} ${className}`;

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

        <div className={styles.toolbarCenter}>
          {/* 页面导航 */}
          <div className={styles.pageNavigation}>
            <button 
              className={styles.navBtn}
              onClick={() => goToPage(1)}
              disabled={pageNumber <= 1}
              title="第一页 (Home)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="19,20 9,12 19,4"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            <button 
              className={styles.navBtn}
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber <= 1}
              title="上一页 (←)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            
            <div className={styles.pageInfo}>
              <input 
                type="number" 
                value={pageNumber} 
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                min="1" 
                max={numPages || 1}
                className={styles.pageInput}
              />
              <span className={styles.pageTotal}>/ {numPages || 0}</span>
            </div>
            
            <button 
              className={styles.navBtn}
              onClick={() => goToPage(pageNumber + 1)}
              disabled={pageNumber >= numPages}
              title="下一页 (→)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
            <button 
              className={styles.navBtn}
              onClick={() => goToPage(numPages)}
              disabled={pageNumber >= numPages}
              title="最后一页 (End)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5,4 15,12 5,20"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          </div>

          {/* 缩放控制 */}
          <div className={styles.zoomControls}>
            <button 
              className={styles.zoomBtn}
              onClick={zoomOut}
              title="缩小 (Ctrl + -)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
            <button 
              className={styles.zoomBtn}
              onClick={zoomIn}
              title="放大 (Ctrl + +)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
            <button 
              className={styles.resetBtn}
              onClick={resetZoom}
              title="重置缩放 (Ctrl + 0)"
            >
              重置
            </button>
          </div>
        </div>

        <div className={styles.toolbarRight}>
          {/* 搜索框 */}
          <div className={styles.searchBox}>
            <input 
              type="text"
              placeholder="搜索文档..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>

          {/* 操作按钮 */}
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
          </button>
          <button 
            className={styles.actionBtn}
            onClick={handlePrint}
            title="打印文档"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 6,2 18,2 18,9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
          <button 
            className={styles.actionBtn}
            onClick={toggleFullscreen}
            title="全屏 (Ctrl + F)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isFullscreen ? (
                <>
                  <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                  <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
                </>
              ) : (
                <>
                  <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                  <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* PDF 内容区域 */}
      <div className={styles.pdfContent}>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <div>正在加载 PDF 文档...</div>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <div className={styles.errorMessage}>{error}</div>
            <button 
              className={styles.retryBtn}
              onClick={() => {
                setError(null);
                setLoading(true);
              }}
            >
              重试
            </button>
          </div>
        )}

        {!loading && !error && pdfComponentsLoaded && Document && Page && (
          <div className={styles.documentContainer}>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={null}
              error={null}
              className={styles.document}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                onLoadSuccess={onPageLoadSuccess}
                className={styles.page}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          </div>
        )}
        
        {!loading && !error && !pdfComponentsLoaded && (
          <div className={styles.fallback}>
            <div className={styles.fallbackContent}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              <h3>PDF 预览不可用</h3>
              <p>您的浏览器不支持 PDF 预览功能</p>
              <button 
                className={styles.downloadBtn}
                onClick={handleDownload}
              >
                下载文档
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 快捷键提示 */}
      <div className={styles.shortcuts}>
        <div className={styles.shortcutItem}>
          <kbd>←/→</kbd> 翻页
        </div>
        <div className={styles.shortcutItem}>
          <kbd>Ctrl</kbd> + <kbd>+/-</kbd> 缩放
        </div>
        <div className={styles.shortcutItem}>
          <kbd>Ctrl</kbd> + <kbd>F</kbd> 全屏
        </div>
        <div className={styles.shortcutItem}>
          <kbd>Esc</kbd> 退出
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
