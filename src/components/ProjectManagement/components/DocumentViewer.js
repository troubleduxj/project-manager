import React, { useState, useEffect } from 'react';
import { renderMarkdownToHtml, parseDocumentOutline } from '../../../utils/markdownParser';
import SimplePDFViewer from './SimplePDFViewer';
import DocxViewer from './DocxViewer';
import ExcelViewer from './ExcelViewer';
import styles from './MarkdownViewer.module.css';

const DocumentViewer = ({ selectedDoc, onClose, documentType = 'system', projectDocuments = [] }) => {
  const [currentDocId, setCurrentDocId] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewerType, setViewerType] = useState('system'); // 'system' 或 'project'
  const [documentOutline, setDocumentOutline] = useState([]); // 文档大纲结构
  const [fileType, setFileType] = useState('markdown'); // 'markdown', 'pdf', 'image', 'text', 'docx', 'xlsx', 'pptx'
  const [pdfUrl, setPdfUrl] = useState(null); // PDF 文件 URL
  const [fileUrl, setFileUrl] = useState(null); // 通用文件 URL

  // 当前选中的标题ID
  const [selectedHeadingId, setSelectedHeadingId] = useState(null);

  // 检测文件类型
  const detectFileType = (fileName, mimeType, fileType) => {
    console.log('🔍 检测参数:', { fileName, mimeType, fileType });
    
    // 首先根据文件名扩展名判断（最可靠）
    if (fileName) {
      const extension = fileName.toLowerCase().split('.').pop();
      console.log('📁 文件扩展名:', extension);
      
      if (extension === 'pdf') {
        console.log('✅ 通过扩展名识别为 PDF');
        return 'pdf';
      } else if (['docx', 'doc'].includes(extension)) {
        console.log('✅ 通过扩展名识别为 DOCX');
        return 'docx';
      } else if (['xlsx', 'xls'].includes(extension)) {
        console.log('✅ 通过扩展名识别为 XLSX');
        return 'xlsx';
      } else if (['pptx', 'ppt'].includes(extension)) {
        console.log('⚠️ 通过扩展名识别为 PPT - 不支持预览');
        return 'unsupported';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
        return 'image';
      } else if (['md', 'markdown', 'mdx'].includes(extension)) {
        return 'markdown';
      } else if (['txt', 'log', 'json', 'xml', 'csv'].includes(extension)) {
        return 'text';
      }
    }
    
    // 然后使用 mimeType 或 fileType 字段
    if (mimeType === 'application/pdf' || fileType === 'application/pdf') {
      console.log('✅ 通过 MIME 类型识别为 PDF');
      return 'pdf';
    }
    
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('✅ 通过 MIME 类型识别为 DOCX');
      return 'docx';
    }
    
    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      console.log('✅ 通过 MIME 类型识别为 XLSX');
      return 'xlsx';
    }
    
    if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
        fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      console.log('⚠️ 通过 MIME 类型识别为 PPT - 不支持预览');
      return 'unsupported';
    }
    
    if (mimeType && mimeType.startsWith('image/')) {
      return 'image';
    }
    
    if (mimeType === 'text/markdown' || fileType === 'text/markdown') {
      return 'markdown';
    }
    
    // 对于 application/octet-stream，根据文件名再次判断
    if (fileType === 'application/octet-stream' && fileName) {
      const extension = fileName.toLowerCase().split('.').pop();
      if (extension === 'pdf') {
        console.log('✅ 通过 octet-stream + 扩展名识别为 PDF');
        return 'pdf';
      } else if (['docx', 'doc'].includes(extension)) {
        return 'docx';
      } else if (['xlsx', 'xls'].includes(extension)) {
        return 'xlsx';
      } else if (['pptx', 'ppt'].includes(extension)) {
        return 'unsupported';
      }
    }
    
    console.log('❌ 未识别特定类型，默认为 markdown');
    // 默认为 markdown
    return 'markdown';
  };

  useEffect(() => {
    if (selectedDoc) {
      setViewerType(documentType);
      
      // 检测文件类型
      const detectedType = detectFileType(
        selectedDoc.name || selectedDoc.title, 
        selectedDoc.mimeType, 
        selectedDoc.file_type
      );
      setFileType(detectedType);
      
      console.log('🔍 文件类型检测:', {
        fileName: selectedDoc.name || selectedDoc.title,
        mimeType: selectedDoc.mimeType,
        fileType: selectedDoc.file_type,
        detectedType,
        fullDoc: selectedDoc
      });
      
      if (documentType === 'project') {
        // 项目文档模式
        setCurrentDocId(selectedDoc.id);
        const docUrl = `http://localhost:7080/api/documents/${selectedDoc.id}/download`;
        
        if (detectedType === 'pdf') {
          // PDF 文件直接设置 URL
          setPdfUrl(docUrl);
          setLoading(false);
        } else if (detectedType === 'docx' || detectedType === 'xlsx') {
          // Word、Excel 文件设置 URL
          setFileUrl(docUrl);
          setLoading(false);
        } else if (detectedType === 'unsupported') {
          // 不支持的格式
          setFileUrl(docUrl); // 保存下载链接
          setLoading(false);
        } else {
          loadProjectDocumentContent(selectedDoc);
        }
      } else {
        // 系统文档模式
        const docId = selectedDoc.id || 'quick-start';
        setCurrentDocId(docId);
        loadDocumentContent(docId);
      }
    }
  }, [selectedDoc, documentType]);

  const loadDocumentContent = async (docId) => {
    setLoading(true);
    try {
      const content = getDocumentContent(docId);
      setContent(content);
    // 解析文档大纲
    const outline = parseDocumentOutline(content);
    setDocumentOutline(outline);
    } catch (error) {
      console.error('加载文档失败:', error);
      setContent('加载文档失败，请稍后重试。');
      setDocumentOutline([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDocumentContent = async (doc) => {
    setLoading(true);
    try {
      let documentContent = '';
      // 检查是否是Markdown文件
      if (doc.file_type === 'text/markdown' || doc.title?.endsWith('.md')) {
        // 调用预览API获取Markdown内容
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:7080/api/documents/${doc.id}/preview`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const previewData = await response.json();
          if (previewData.type === 'text') {
            documentContent = previewData.content;
          } else {
            documentContent = `# ${doc.title}\n\n文件类型: ${doc.file_type}\n文件大小: ${formatFileSize(doc.file_size)}\n\n此文件类型不支持预览，请下载后查看。`;
          }
        } else {
          throw new Error('获取文档内容失败');
        }
      } else {
        // 非Markdown文件，显示文件信息
        documentContent = `# ${doc.title}\n\n## 文件信息\n\n- **文件类型**: ${doc.file_type}\n- **文件大小**: ${formatFileSize(doc.file_size)}\n- **上传时间**: ${new Date(doc.created_at).toLocaleString('zh-CN')}\n- **描述**: ${doc.content || '无描述'}\n\n## 操作\n\n此文件类型不支持在线预览，请使用下载功能获取文件后查看。`;
      }
      
      setContent(documentContent);
      // 解析文档大纲
      const outline = parseDocumentOutline(documentContent);
      setDocumentOutline(outline);
    } catch (error) {
      console.error('加载项目文档失败:', error);
      const errorContent = `# 加载失败\n\n无法加载文档内容，请稍后重试。\n\n错误信息: ${error.message}`;
      setContent(errorContent);
      setDocumentOutline([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 滚动到指定标题
  const scrollToHeading = (headingId) => {
    const contentElement = document.querySelector('.document-content');
    if (contentElement) {
      // 查找对应的标题元素
      const headingElement = contentElement.querySelector(`[data-heading-id="${headingId}"]`);
      if (headingElement) {
        headingElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // 选择标题并滚动到对应位置
  const selectHeading = (headingId) => {
    setSelectedHeadingId(headingId);
    scrollToHeading(headingId);
  };

  // 获取标题图标
  const getHeadingIcon = (level) => {
    switch (level) {
      case 1: return '📖';
      case 2: return '📝';
      case 3: return '📄';
      case 4: return '📋';
      default: return '📄';
    }
  };

  const getDocumentContent = (docId) => {
    const documents = {
      'quick-start': `# 快速开始

欢迎使用项目管理系统！本指南将帮助您在5分钟内快速上手。

## 🚀 系统概述

项目管理系统是一个集成的解决方案，提供：

- **任务管理**：创建、分配和跟踪任务
- **进度监控**：实时查看项目进度
- **文档管理**：上传、预览和管理项目文档
- **团队协作**：评论、通知和用户管理

## 📋 快速开始步骤

### 1. 登录系统
- 默认管理员账号：\`admin\` / \`123456\`
- 默认用户账号：\`client\` / \`123456\`

### 2. 创建项目任务
1. 进入"任务管理"页面
2. 点击"添加任务"按钮
3. 填写任务信息并保存
4. 为任务添加子任务（可选）

### 3. 上传项目文档
1. 进入"项目文档"页面
2. 点击"上传文档"按钮
3. 选择文件并添加描述
4. 支持多种文件格式

### 4. 系统配置
管理员可以：
- 管理用户账号
- 配置系统设置
- 查看系统概览

## 🎯 下一步

- 查看[安装与配置](installation)了解详细配置
- 阅读[使用指南](usage-guide)学习高级功能
- 参考[部署指南](deployment)进行生产部署`,

      'installation': `# 安装与配置

本文档详细介绍了项目管理系统的安装和配置过程。

## 📋 系统要求

### 基础环境
- **Node.js**: 版本 16.0 或更高
- **npm**: 版本 7.0 或更高
- **操作系统**: Windows 10+, macOS 10.15+, Linux

### 推荐配置
- **内存**: 4GB RAM 或更多
- **存储**: 至少 2GB 可用空间
- **网络**: 稳定的互联网连接

## 🛠️ 安装步骤

### 1. 克隆项目
\`\`\`bash
git clone https://github.com/your-repo/project-management.git
cd project-management
\`\`\`

### 2. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 3. 初始化数据库
\`\`\`bash
npm run setup
\`\`\`

### 4. 启动服务
\`\`\`bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm start
\`\`\`

## ⚙️ 配置选项

### 环境变量
创建 \`.env\` 文件：

\`\`\`env
# 服务器配置
PORT=8080
NODE_ENV=production

# 数据库配置
DB_PATH=./server/database/project_management.db

# JWT密钥
JWT_SECRET=your-secret-key-here

# 文件上传配置
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./server/uploads
\`\`\`

## 🚨 常见问题

### 端口冲突
如果端口被占用，修改配置文件中的端口设置。

### 数据库初始化失败
删除现有数据库文件并重新初始化：

\`\`\`bash
rm server/database/project_management.db
npm run setup
\`\`\``
    };

    return documents[docId] || '文档内容未找到。';
  };

  if (!selectedDoc) {
    return null;
  }

  return (
    <div 
      className="document-viewer"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex'
      }}>
      {/* Docusaurus风格的布局 */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: 'white'
      }}>
        
        {/* 顶部导航栏 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: '#2e8555',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          color: 'white',
          zIndex: 1001
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              {viewerType === 'project' ? '📁 项目文档' : '📚 系统文档'}
            </h1>
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                title="收起文档大纲"
              >
                <span>◀</span>
                <span style={{ fontSize: '12px' }}>收起大纲</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕ 关闭
          </button>
        </div>

        {/* 左侧边栏 - 文档大纲 */}
        <div style={{
          width: sidebarCollapsed ? '0px' : '300px',
          background: '#f8f9fa',
          borderRight: sidebarCollapsed ? 'none' : '1px solid #e9ecef',
          marginTop: '60px',
          height: 'calc(100% - 60px)',
          overflow: sidebarCollapsed ? 'hidden' : 'auto',
          padding: sidebarCollapsed ? '0' : '20px 0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0
        }}>
            <div style={{
              padding: '0 20px 15px 20px',
              borderBottom: '1px solid #e9ecef',
              marginBottom: '15px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#495057',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📋 文档大纲
              </h3>
            </div>

            {documentOutline.length > 0 ? (
              <div>
                {documentOutline.map((heading, index) => (
                  <div
                    key={heading.id}
                    onClick={() => selectHeading(heading.id)}
                    style={{
                      padding: '8px 20px',
                      paddingLeft: `${20 + (heading.level - 1) * 16}px`, // 根据标题级别缩进
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: selectedHeadingId === heading.id ? '#2e8555' : '#6c757d',
                      background: selectedHeadingId === heading.id ? '#e8f5e8' : 'transparent',
                      borderRadius: '0 15px 15px 0',
                      marginRight: '10px',
                      fontSize: heading.level === 1 ? '14px' : '13px',
                      fontWeight: selectedHeadingId === heading.id ? '600' : (heading.level === 1 ? '600' : '400'),
                      borderLeft: selectedHeadingId === heading.id ? '3px solid #2e8555' : '3px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '12px' }}>
                      {getHeadingIcon(heading.level)}
                    </span>
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {heading.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6c757d',
                fontSize: '14px'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📄</div>
                <div>暂无文档大纲</div>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>
                  文档加载完成后将显示标题结构
                </div>
              </div>
            )}
          </div>

        {/* 浮动展开按钮 - 当侧边栏收起时显示 */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            style={{
              position: 'fixed',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(135deg, #2e8555 0%, #25a244 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0 8px 8px 0',
              padding: '12px 8px',
              cursor: 'pointer',
              fontSize: '18px',
              boxShadow: '0 4px 12px rgba(46, 133, 85, 0.3)',
              zIndex: 1002,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.3s ease',
              animation: 'slideInLeft 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) translateX(5px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 133, 85, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) translateX(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 133, 85, 0.3)';
            }}
            title="展开文档大纲"
          >
            <span>📋</span>
            <span style={{ fontSize: '12px', writingMode: 'vertical-rl' }}>大纲</span>
          </button>
        )}

        <style>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateY(-50%) translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(-50%) translateX(0);
            }
          }
        `}</style>

        {/* 右侧内容区域 */}
        <div 
          className="document-content"
          style={{
            flex: 1,
            marginTop: '60px',
            height: 'calc(100% - 60px)',
            overflow: 'auto',
            padding: '30px 40px',
            background: 'white'
          }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #2e8555',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            <div>
              
              {/* 根据文件类型渲染内容 */}
              {fileType === 'pdf' ? (
                <SimplePDFViewer 
                  fileUrl={pdfUrl}
                  onClose={onClose}
                  title={selectedDoc?.title || selectedDoc?.name || 'PDF 文档'}
                />
              ) : fileType === 'docx' ? (
                <DocxViewer 
                  fileUrl={fileUrl}
                  title={selectedDoc?.title || selectedDoc?.name || 'Word 文档'}
                  onClose={onClose}
                />
              ) : fileType === 'xlsx' ? (
                <ExcelViewer 
                  fileUrl={fileUrl}
                  title={selectedDoc?.title || selectedDoc?.name || 'Excel 文档'}
                  onClose={onClose}
                />
              ) : fileType === 'unsupported' ? (
                <div style={{
                  maxWidth: '800px',
                  margin: '60px auto',
                  padding: '40px',
                  background: 'linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%)',
                  borderRadius: '12px',
                  border: '2px solid #ff9800',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
                  <h2 style={{ 
                    color: '#e65100', 
                    marginBottom: '20px',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}>
                    PowerPoint 文件暂不支持在线预览
                  </h2>
                  <p style={{ 
                    color: '#666', 
                    fontSize: '16px', 
                    marginBottom: '30px',
                    lineHeight: '1.6'
                  }}>
                    由于浏览器技术限制，PPT/PPTX 格式文件无法直接在线预览。<br />
                    我们建议您将文件转换为 <strong>PDF 格式</strong>后重新上传，即可享受在线预览功能。
                  </p>
                  
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    textAlign: 'left'
                  }}>
                    <h3 style={{ 
                      color: '#333', 
                      fontSize: '18px', 
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>💡</span>
                      <span>如何转换为 PDF？</span>
                    </h3>
                    <ul style={{ 
                      color: '#666', 
                      fontSize: '14px', 
                      lineHeight: '1.8',
                      paddingLeft: '20px'
                    }}>
                      <li><strong>使用 Microsoft PowerPoint：</strong> 文件 → 另存为 → 选择 "PDF" 格式</li>
                      <li><strong>使用 WPS Office：</strong> 文件 → 输出为 PDF</li>
                      <li><strong>在线转换工具：</strong> 搜索 "PPT转PDF" 使用免费在线工具</li>
                    </ul>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <a
                      href={fileUrl}
                      download
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #2e8555 0%, #25a244 100%)',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(46, 133, 85, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 133, 85, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 133, 85, 0.3)';
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>下载原文件</span>
                    </a>
                    
                    <button
                      onClick={onClose}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: 'white',
                        color: '#666',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#999';
                        e.currentTarget.style.color = '#333';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.color = '#666';
                      }}
                    >
                      <span>关闭</span>
                    </button>
                  </div>
                  
                  <p style={{ 
                    marginTop: '30px', 
                    fontSize: '12px', 
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    提示：转换后的 PDF 文件将保持原有的布局和格式，便于在线查看和分享
                  </p>
                </div>
              ) : fileType === 'image' ? (
                <div className={styles.imageViewer}>
                  <img 
                    src={`http://localhost:7080/api/documents/${selectedDoc.id}/download`}
                    alt={selectedDoc.title || selectedDoc.name}
                    className={styles.previewImage}
                  />
                </div>
              ) : fileType === 'text' ? (
                <div className={styles.textViewer}>
                  <pre className={styles.textContent}>{content}</pre>
                </div>
              ) : (
                // Markdown 渲染 - 标准渲染器
                <div 
                  className={styles.markdownContent}
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdownToHtml(content)
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;