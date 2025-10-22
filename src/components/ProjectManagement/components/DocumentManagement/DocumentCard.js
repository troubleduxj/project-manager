import React from 'react';
import { formatFileSize, getFileIcon, documentCategories } from './utils';

/**
 * 文档卡片组件
 * @param {Object} props
 * @param {Object} props.doc - 文档对象
 * @param {Object} props.user - 当前用户对象
 * @param {Function} props.onView - 查看文档回调
 * @param {Function} props.onDownload - 下载文档回调
 * @param {Function} props.onEdit - 编辑文档回调
 * @param {Function} props.onDelete - 删除文档回调
 */
const DocumentCard = ({ doc, user, onView, onDownload, onEdit, onDelete }) => {
  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '20px',
        padding: '28px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
      }}
    >
      {/* 装饰性渐变背景 */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: '50%',
        transform: 'translate(30px, -30px)'
      }}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 文件图标和基本信息 */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            marginRight: '16px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            {getFileIcon(doc.file_type)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#2c3e50',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {doc.title}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              <span style={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: '600'
              }}>
                {formatFileSize(doc.file_size)}
              </span>
              <span>
                {new Date(doc.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>
        
        {/* 文档描述 */}
        <p style={{
          margin: '0 0 20px 0',
          fontSize: '14px',
          color: '#5a6c7d',
          lineHeight: '1.6',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {doc.content || '暂无描述'}
        </p>
        
        {/* 分类标签 */}
        <div style={{
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            color: '#1976d2',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {documentCategories.find(cat => cat.id === doc.category)?.name || '其他文档'}
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onView(doc);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span>📖</span>
            <span>查看</span>
          </button>
          
          <button
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDownload(doc);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span>⬇️</span>
            <span>下载</span>
          </button>
          
          {user.role === 'admin' && (
            <>
              <button
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(doc);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>✏️</span>
                <span>编辑</span>
              </button>
              
              <button
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(doc);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>🗑️</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;

