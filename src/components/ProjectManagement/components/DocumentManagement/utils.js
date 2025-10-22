/**
 * 文档管理工具函数
 */

/**
 * 格式化文件大小
 * @param {number} bytes - 文件字节数
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '未知';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * 根据文件类型获取图标
 * @param {string} fileType - 文件类型
 * @returns {string} 对应的emoji图标
 */
export const getFileIcon = (fileType) => {
  if (!fileType) return '📄';
  
  if (fileType.includes('pdf')) return '📕';
  if (fileType.includes('word') || fileType.includes('document')) return '📘';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📗';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📙';
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('video')) return '🎥';
  if (fileType.includes('audio')) return '🎵';
  if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
  if (fileType.includes('text') || fileType.includes('markdown')) return '📝';
  return '📄';
};

/**
 * 根据文件类型获取渐变颜色
 * @param {string} fileType - 文件类型
 * @returns {string} CSS渐变颜色字符串
 */
export const getFileTypeColor = (fileType) => {
  if (!fileType) return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
  
  if (fileType.includes('pdf')) return 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
  if (fileType.includes('word') || fileType.includes('document')) return 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)';
  if (fileType.includes('image')) return 'linear-gradient(135deg, #e83e8c 0%, #d91a72 100%)';
  if (fileType.includes('video')) return 'linear-gradient(135deg, #6f42c1 0%, #59359a 100%)';
  if (fileType.includes('audio')) return 'linear-gradient(135deg, #20c997 0%, #17a085 100%)';
  if (fileType.includes('zip') || fileType.includes('rar')) return 'linear-gradient(135deg, #6c757d 0%, #545b62 100%)';
  if (fileType.includes('text') || fileType.includes('markdown')) return 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)';
  return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
};

/**
 * 文档分类定义
 */
export const documentCategories = [
  { id: 'all', name: '全部文档', icon: '📁' },
  { id: 'requirement', name: '需求文档', icon: '📋' },
  { id: 'design', name: '设计文档', icon: '🎨' },
  { id: 'technical', name: '技术文档', icon: '⚙️' },
  { id: 'test', name: '测试文档', icon: '🧪' },
  { id: 'manual', name: '用户手册', icon: '📖' },
  { id: 'other', name: '其他文档', icon: '📄' }
];

/**
 * 过滤文档列表
 * @param {Array} documents - 原始文档列表
 * @param {Object} filters - 过滤条件
 * @returns {Array} 过滤后的文档列表
 */
export const filterDocuments = (documents, filters) => {
  const { selectedFolderId, selectedCategory, searchTerm, sortBy } = filters;
  let filtered = [...documents];
  
  // 按文件夹过滤
  if (selectedFolderId) {
    filtered = filtered.filter(doc => doc.folder_id === selectedFolderId);
  }
  
  // 按分类筛选
  if (selectedCategory && selectedCategory !== 'all') {
    filtered = filtered.filter(doc => doc.category === selectedCategory);
  }
  
  // 按搜索词筛选
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(doc => 
      doc.title?.toLowerCase().includes(term) ||
      doc.content?.toLowerCase().includes(term) ||
      doc.category?.toLowerCase().includes(term)
    );
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.title || '').localeCompare(b.title || '');
      case 'size':
        return (b.file_size || 0) - (a.file_size || 0);
      case 'type':
        return (a.file_type || '').localeCompare(b.file_type || '');
      case 'date':
      default:
        return new Date(b.uploaded_at || 0) - new Date(a.uploaded_at || 0);
    }
  });
  
  return filtered;
};

