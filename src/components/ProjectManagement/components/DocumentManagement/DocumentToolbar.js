import React from 'react';
import { documentCategories } from './utils';

/**
 * 文档管理工具栏组件
 * 包含搜索框、分类筛选、排序选择和视图模式切换
 */
const DocumentToolbar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onUpload,
  showUploadButton = true
}) => {
  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* 左侧：搜索和筛选 */}
        <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          {/* 搜索框 */}
          <div style={{ position: 'relative', minWidth: '250px', flex: 1 }}>
            <input
              type="text"
              placeholder="搜索文档..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '16px',
              color: '#6c757d'
            }}>
              🔍
            </span>
          </div>

          {/* 分类筛选 */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white',
              minWidth: '150px',
              cursor: 'pointer'
            }}
          >
            {documentCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          {/* 排序选择 */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white',
              minWidth: '120px',
              cursor: 'pointer'
            }}
          >
            <option value="date">按日期排序</option>
            <option value="name">按名称排序</option>
            <option value="size">按大小排序</option>
            <option value="type">按类型排序</option>
          </select>
        </div>

        {/* 右侧：视图切换和上传按钮 */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* 视图模式切换 */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => onViewModeChange('grid')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'grid' ? '#667eea' : '#f8f9fa',
                color: viewMode === 'grid' ? 'white' : '#495057',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              title="网格视图"
              onMouseEnter={(e) => {
                if (viewMode !== 'grid') {
                  e.currentTarget.style.background = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'grid') {
                  e.currentTarget.style.background = '#f8f9fa';
                }
              }}
            >
              ⊞
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'list' ? '#667eea' : '#f8f9fa',
                color: viewMode === 'list' ? 'white' : '#495057',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              title="列表视图"
              onMouseEnter={(e) => {
                if (viewMode !== 'list') {
                  e.currentTarget.style.background = '#e9ecef';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'list') {
                  e.currentTarget.style.background = '#f8f9fa';
                }
              }}
            >
              ☰
            </button>
          </div>

          {/* 上传按钮 */}
          {showUploadButton && (
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onClick={onUpload}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              📤 上传文档
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentToolbar;

