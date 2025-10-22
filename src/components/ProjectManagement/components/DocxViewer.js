import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';

const DocxViewer = ({ fileUrl, title, onClose }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocx();
  }, [fileUrl]);

  const loadDocx = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 获取文件
      const token = localStorage.getItem('token');
      const response = await fetch(fileUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('文件加载失败');
      }
      
      // 获取 ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      
      // 使用 mammoth 转换为 HTML
      const result = await mammoth.convertToHtml(
        { arrayBuffer: arrayBuffer },
        {
          styleMap: [
            "p[style-name='Heading 1'] => h1.docx-heading:fresh",
            "p[style-name='Heading 2'] => h2.docx-heading:fresh",
            "p[style-name='Heading 3'] => h3.docx-heading:fresh",
            "p[style-name='Heading 4'] => h4.docx-heading:fresh",
            "r[style-name='Strong'] => strong:fresh",
            "p[style-name='List Paragraph'] => li:fresh"
          ]
        }
      );
      
      setHtmlContent(result.value);
      
      // 如果有警告，在控制台输出
      if (result.messages.length > 0) {
        console.log('Mammoth 转换警告:', result.messages);
      }
      
    } catch (err) {
      console.error('加载 DOCX 文件失败:', err);
      setError(err.message || 'DOCX 文件加载失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        gap: '16px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>正在加载 Word 文档...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#dc3545'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
        <h3 style={{ margin: '0 0 8px 0' }}>文档加载失败</h3>
        <p style={{ margin: 0, color: '#6c757d' }}>{error}</p>
        <button
          onClick={loadDocx}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="docx-viewer" style={{
      width: '100%',
      height: '100%',
      overflow: 'auto',
      background: 'white'
    }}>
      {/* 文档标题栏 */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: '#f8f9fa',
        padding: '16px 24px',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>📘</span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
            {title || 'Word 文档'}
          </h3>
        </div>
      </div>

      {/* 文档内容 */}
      <div 
        className="docx-content"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '40px 60px',
          fontSize: '14px',
          lineHeight: '1.8',
          color: '#2c3e50'
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <style>{`
        .docx-content {
          font-family: 'Calibri', 'Arial', sans-serif;
        }
        
        .docx-content h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 24px 0 16px 0;
          color: #1a202c;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }
        
        .docx-content h2 {
          font-size: 24px;
          font-weight: 600;
          margin: 20px 0 12px 0;
          color: #2d3748;
        }
        
        .docx-content h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 16px 0 10px 0;
          color: #4a5568;
        }
        
        .docx-content h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 12px 0 8px 0;
          color: #718096;
        }
        
        .docx-content p {
          margin: 0 0 12px 0;
          text-align: justify;
        }
        
        .docx-content strong {
          font-weight: 600;
          color: #2d3748;
        }
        
        .docx-content em {
          font-style: italic;
        }
        
        .docx-content ul, .docx-content ol {
          margin: 12px 0;
          padding-left: 30px;
        }
        
        .docx-content li {
          margin: 6px 0;
        }
        
        .docx-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
          border: 1px solid #e2e8f0;
        }
        
        .docx-content th, .docx-content td {
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          text-align: left;
        }
        
        .docx-content th {
          background: #f7fafc;
          font-weight: 600;
          color: #2d3748;
        }
        
        .docx-content tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .docx-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 16px 0;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .docx-content blockquote {
          border-left: 4px solid #667eea;
          padding-left: 16px;
          margin: 16px 0;
          color: #4a5568;
          font-style: italic;
        }
        
        .docx-content code {
          background: #f7fafc;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #e53e3e;
        }
        
        .docx-content pre {
          background: #2d3748;
          color: #f7fafc;
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 16px 0;
        }
        
        .docx-content pre code {
          background: none;
          color: inherit;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default DocxViewer;

