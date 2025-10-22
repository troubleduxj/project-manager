import React, { useState, useEffect } from 'react';
import DocumentViewer from './DocumentViewer';
import FolderTree from './FolderTree';
import FolderDialog from './FolderDialog';
import DocumentCard from './DocumentManagement/DocumentCard';
import DocumentToolbar from './DocumentManagement/DocumentToolbar';
import DocumentUploadForm from './DocumentManagement/DocumentUploadForm';
import DocumentEditForm from './DocumentManagement/DocumentEditForm';
import { 
  filterDocuments as utilFilterDocuments,
  documentCategories,
  formatFileSize,
  getFileIcon,
  getFileTypeColor
} from './DocumentManagement/utils';

const DocumentManagement = ({ 
  selectedProject,
  projectDocuments, 
  user,
  // 新增props用于局部刷新
  onDocumentUploaded,
  onDocumentDeleted
}) => {
  // 新增状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // grid 或 list
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocForViewing, setSelectedDocForViewing] = useState(null);
  const [editingProjectDoc, setEditingProjectDoc] = useState(null);
  const [showProjectDocEditForm, setShowProjectDocEditForm] = useState(false);
  
  // 文件夹相关状态
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [folderDialogMode, setFolderDialogMode] = useState('create');
  const [editingFolder, setEditingFolder] = useState(null);
  const [parentFolderId, setParentFolderId] = useState(null);
  
  // 加载文件夹树
  useEffect(() => {
    if (selectedProject) {
      loadFolders();
    }
  }, [selectedProject]);

  const loadFolders = async () => {
    if (!selectedProject) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/folders/project/${selectedProject.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      }
    } catch (error) {
      console.error('加载文件夹失败:', error);
    }
  };

  // 文件夹对话框处理
  const handleOpenCreateDialog = (parentId = null) => {
    setParentFolderId(parentId);
    setEditingFolder(null);
    setFolderDialogMode('create');
    setShowFolderDialog(true);
  };

  const handleOpenEditDialog = (folder) => {
    setEditingFolder(folder);
    setFolderDialogMode('edit');
    setShowFolderDialog(true);
  };

  const handleOpenDeleteDialog = (folder) => {
    setEditingFolder(folder);
    setFolderDialogMode('delete');
    setShowFolderDialog(true);
  };

  const handleOpenMoveDialog = (folder) => {
    setEditingFolder(folder);
    setFolderDialogMode('move');
    setShowFolderDialog(true);
  };

  // 文件夹CRUD操作
  const handleFolderConfirm = async (formData) => {
    const token = localStorage.getItem('token');
    
    try {
      if (folderDialogMode === 'create') {
        const response = await fetch(`http://localhost:7080/api/folders/project/${selectedProject.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            parent_folder_id: parentFolderId
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '创建失败');
        }
        
        await loadFolders();
        setShowFolderDialog(false);
        
      } else if (folderDialogMode === 'edit') {
        const response = await fetch(`http://localhost:7080/api/folders/${editingFolder.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '更新失败');
        }
        
        await loadFolders();
        setShowFolderDialog(false);
        
      } else if (folderDialogMode === 'delete') {
        // 先检查文件夹下是否有文档
        const docsInFolder = projectDocuments.filter(doc => doc.folder_id === editingFolder.id);
        if (docsInFolder.length > 0) {
          throw new Error(`该文件夹包含 ${docsInFolder.length} 个文档，请先移动或删除文档后再删除文件夹`);
        }

        const response = await fetch(`http://localhost:7080/api/folders/${editingFolder.id}?force=true`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '删除失败');
        }
        
        await loadFolders();
        if (selectedFolderId === editingFolder.id) {
          setSelectedFolderId(null);
        }
        setShowFolderDialog(false);
        
      } else if (folderDialogMode === 'move') {
        // 移动文件夹到新的父文件夹
        const response = await fetch(`http://localhost:7080/api/folders/${editingFolder.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: editingFolder.name,
            parent_folder_id: formData.parent_folder_id
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || '移动失败');
        }
        
        await loadFolders();
        setShowFolderDialog(false);
      }
    } catch (error) {
      throw error;
    }
  };
  
  // 格式化文件大小
  // 处理文档上传
  const handleDocumentUpload = async (formData) => {
    if (!selectedProject) {
      alert('请先选择项目');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              alert('✅ 文档上传成功！');
              setShowUploadForm(false);
              setUploading(false);
              setUploadProgress(0);
              // 调用回调函数进行局部刷新
              if (onDocumentUploaded) {
                onDocumentUploaded();
              }
              resolve(response);
            } catch (parseError) {
              console.error('解析成功响应失败:', parseError);
              alert('✅ 文档上传成功！');
              setShowUploadForm(false);
              setUploading(false);
              setUploadProgress(0);
              if (onDocumentUploaded) {
                onDocumentUploaded();
              }
              resolve({});
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              alert('❌ 上传失败: ' + (errorResponse.error || '未知错误'));
            } catch (parseError) {
              alert('❌ 上传失败: HTTP ' + xhr.status);
            }
            setUploading(false);
            setUploadProgress(0);
            reject(new Error('Upload failed'));
          }
        });
        
        xhr.addEventListener('error', () => {
          console.error('上传请求失败');
          alert('❌ 网络错误，上传失败');
          setUploading(false);
          setUploadProgress(0);
          reject(new Error('Network error'));
        });
        
        const token = localStorage.getItem('token');
        xhr.open('POST', `http://localhost:7080/api/documents/project/${selectedProject.id}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('上传文档失败:', error);
      alert('❌ 上传失败，请稍后重试');
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  // 处理文档下载
  const handleDocumentDownload = async (doc) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7080/api/documents/${doc.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = doc.title || 'document';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert('❌ 下载失败: ' + (error.error || '未知错误'));
      }
    } catch (error) {
      console.error('下载文档失败:', error);
      alert('❌ 下载失败: ' + error.message);
    }
  };
  
  // 处理文档预览
  const handleDocumentPreview = async (doc) => {
    // 使用 DocumentViewer 组件进行预览
    setSelectedDocForViewing(doc);
  };
  
  // 处理文档删除
  const handleDocumentDelete = async (doc) => {
    if (!window.confirm(`确定要删除文档 "${doc.title}" 吗？`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/documents/${doc.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
    if (response.ok) {
      alert('✅ 文档删除成功！');
      // 调用回调函数进行局部刷新
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } else {
        const error = await response.json();
        alert('❌ 删除失败: ' + (error.error || '未知错误'));
      }
    } catch (error) {
      console.error('删除文档失败:', error);
      alert('❌ 删除失败: ' + error.message);
    }
  };

  // 处理项目文档编辑
  const handleProjectDocEdit = (doc) => {
    setEditingProjectDoc(doc);
    setShowProjectDocEditForm(true);
  };

  // 处理项目文档更新
  const handleProjectDocUpdate = async (formData) => {
    if (!editingProjectDoc) return;
    
    try {
      const token = localStorage.getItem('token');
      const folder_id = formData.get('folder_id');
      const response = await fetch(`http://localhost:7080/api/documents/${editingProjectDoc.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.get('title'),
          content: formData.get('content'),
          category: formData.get('category'),
          folder_id: folder_id ? parseInt(folder_id) : null
        })
      });
      
      if (response.ok) {
        const newFolderId = folder_id ? parseInt(folder_id) : null;
        const oldFolderId = editingProjectDoc.folder_id;
        
        // 关闭编辑表单
        setShowProjectDocEditForm(false);
        setEditingProjectDoc(null);
        
        // 先刷新文档列表和文件夹列表
        if (onDocumentUploaded) {
          await onDocumentUploaded();
        }
        await loadFolders();
        
        // 使用 setTimeout 确保 React 状态更新完成后再切换文件夹
        // 这样可以确保显示的是最新的文档数据
        setTimeout(() => {
          if (newFolderId !== oldFolderId) {
            setSelectedFolderId(newFolderId);
          }
        }, 100);
        
        alert('✅ 文档信息更新成功！');
      } else {
        const errorData = await response.json();
        alert(`❌ 更新失败: ${errorData.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('更新文档失败:', error);
      alert('❌ 更新失败，请稍后重试');
    }
  };

  return (
    <div>
      {/* 页面标题 */}
      <div style={{
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          margin: 0,
          color: '#2c3e50',
          fontSize: '24px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          📁 项目文档管理
        </h2>
        <p style={{
          margin: '8px 0 0 0',
          color: '#6c757d',
          fontSize: '14px'
        }}>
          管理和查看项目相关的所有文档资料 ({projectDocuments.length} 个文档)
        </p>
      </div>

      {/* 搜索和筛选工具栏 */}
      <DocumentToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUpload={() => setShowUploadForm(true)}
        showUploadButton={user.role === 'admin'}
      />

      {/* 主内容区：文件夹树 + 文档列表 */}
      <div style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start'
      }}>
        {/* 左侧：文件夹树 */}
        <div style={{
          width: '280px',
          flexShrink: 0,
          position: 'sticky',
          top: '20px'
        }}>
          <FolderTree
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            onCreateFolder={handleOpenCreateDialog}
            onEditFolder={handleOpenEditDialog}
            onDeleteFolder={handleOpenDeleteDialog}
            onMoveFolder={handleOpenMoveDialog}
          />
          </div>

        {/* 右侧：项目文档列表 */}
        <div style={{ flex: 1 }}>
        {(() => {
            const filteredDocs = utilFilterDocuments(projectDocuments, {
              selectedFolderId,
              selectedCategory,
              searchTerm,
              sortBy
            });
          
          return (
            <>
              <div style={{
                marginBottom: '20px'
              }}>
                <h3 style={{ margin: 0, color: '#495057', fontSize: '18px' }}>
                  项目文档 ({filteredDocs.length})
                </h3>
              </div>

              {filteredDocs.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#6c757d',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px dashed #dee2e6'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>暂无文档</h3>
                  <p style={{ margin: 0 }}>
                    {user.role === 'admin' 
                      ? '点击上方"上传文档"按钮开始添加项目文档'
                      : '管理员尚未上传任何文档'
                    }
                  </p>
                </div>
              ) : (
                <div style={{
                  display: viewMode === 'grid' ? 'grid' : 'flex',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : 'none',
                  flexDirection: viewMode === 'list' ? 'column' : 'row',
                  gap: viewMode === 'grid' ? '24px' : '12px'
                }}>
                  {filteredDocs.map((doc) => (
                    viewMode === 'grid' ? (
                      // 网格视图 - 使用DocumentCard组件
                      <DocumentCard
                        key={doc.id}
                        doc={doc}
                        user={user}
                        onView={(doc) => {
                                // 检查是否是Markdown或文本文件，使用新的文档查看器
                                if (doc.file_type === 'text/markdown' || 
                                    doc.file_type === 'text/plain' || 
                                    doc.title?.endsWith('.md') || 
                                    doc.title?.endsWith('.txt')) {
                                  setSelectedDocForViewing(doc);
                                } else {
                                  handleDocumentPreview(doc);
                                }
                              }}
                        onDownload={handleDocumentDownload}
                        onEdit={handleProjectDocEdit}
                        onDelete={handleDocumentDelete}
                      />
                    ) : (
                      // 列表视图 - 表格模式（改进样式）
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 20px',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          marginRight: '16px',
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
                        }}>
                          {getFileIcon(doc.file_type)}
                        </div>
                        
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#2c3e50',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {doc.title}
                          </h4>
                          <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#5a6c7d',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {doc.content || '暂无描述'}
                          </p>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          fontSize: '12px',
                          color: '#7f8c8d'
                        }}>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '70px'
                          }}>
                            <span style={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {formatFileSize(doc.file_size)}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '80px'
                          }}>
                            <span style={{ fontSize: '11px' }}>
                              {new Date(doc.created_at).toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: '80px'
                          }}>
                            <span style={{
                              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                              color: '#1976d2',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              {documentCategories.find(cat => cat.id === doc.category)?.name || '其他'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                              }}
                              title="预览"
                              onClick={() => {
                                // 检查是否是Markdown或文本文件，使用新的文档查看器
                                if (doc.file_type === 'text/markdown' || 
                                    doc.file_type === 'text/plain' || 
                                    doc.title?.endsWith('.md') || 
                                    doc.title?.endsWith('.txt')) {
                                  setSelectedDocForViewing(doc);
                                } else {
                                  handleDocumentPreview(doc);
                                }
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              👁️
                            </button>
                            <button
                              style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                              }}
                              title="下载"
                              onClick={() => handleDocumentDownload(doc)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              ⬇️
                            </button>
                            {user.role === 'admin' && (
                              <>
                                <button
                                  style={{
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease'
                                  }}
                                  title="编辑"
                                  onClick={() => handleProjectDocEdit(doc)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  ✏️
                                </button>
                                
                                <button
                                  style={{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease'
                                  }}
                                  title="删除"
                                  onClick={() => handleDocumentDelete(doc)}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </div>
              </div>
              
      {/* 文档上传表单 */}
      <DocumentUploadForm
        isOpen={showUploadForm}
        onClose={() => {
                    setShowUploadForm(false);
                    setUploading(false);
                    setUploadProgress(0);
                  }}
        onSubmit={handleDocumentUpload}
        uploading={uploading}
        uploadProgress={uploadProgress}
        folders={folders}
        defaultFolderId={selectedFolderId}
      />

      {/* 项目文档编辑表单 */}
      <DocumentEditForm
        isOpen={showProjectDocEditForm}
        onClose={() => {
          setShowProjectDocEditForm(false);
          setEditingProjectDoc(null);
        }}
        onSubmit={handleProjectDocUpdate}
        editingDoc={editingProjectDoc}
        folders={folders}
      />

      {/* 文件夹对话框 */}
      <FolderDialog
        isOpen={showFolderDialog}
        mode={folderDialogMode}
        folder={editingFolder}
        parentFolderId={parentFolderId}
        folders={folders}
        onConfirm={handleFolderConfirm}
        onCancel={() => setShowFolderDialog(false)}
      />

      {selectedDocForViewing && (
        <DocumentViewer 
          selectedDoc={selectedDocForViewing}
          onClose={() => setSelectedDocForViewing(null)}
          documentType="project"
          projectDocuments={projectDocuments}
        />
      )}
    </div>
  );
};

export default DocumentManagement;