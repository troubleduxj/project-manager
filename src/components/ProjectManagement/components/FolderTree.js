import React, { useState } from 'react';
import styles from './FolderTree.module.css';

const FolderTree = ({ 
  folders = [], 
  selectedFolderId, 
  onSelectFolder,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  onMoveFolder,
  onMoveDocument
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);

  // 切换文件夹展开/折叠
  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // 右键菜单
  const handleContextMenu = (e, folder) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      folder,
      x: e.clientX,
      y: e.clientY
    });
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // 渲染单个文件夹节点
  const renderFolder = (folder, level = 0) => {
    const hasChildren = folder.children && folder.children.length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const isRoot = folder.parent_folder_id === null; // 根文件夹没有父文件夹

    return (
      <div key={folder.id} className={styles.folderNode}>
        <div
          className={`${styles.folderItem} ${isSelected ? styles.selected : ''} ${isRoot ? styles.rootFolder : ''}`}
          style={{ paddingLeft: `${level * 20 + 10}px` }}
          onClick={() => onSelectFolder(folder.id)}
          onContextMenu={(e) => handleContextMenu(e, folder)}
        >
          {/* 展开/折叠图标 */}
          {hasChildren && (
            <span 
              className={styles.expandIcon}
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className={styles.expandIcon}>　</span>}

          {/* 文件夹图标和名称 */}
          <span className={styles.folderIcon}>{folder.icon || '📁'}</span>
          <span className={styles.folderName}>{folder.name}</span>

          {/* 统计信息 */}
          {folder.document_count !== undefined && (
            <span className={styles.folderCount}>
              {folder.document_count}
            </span>
          )}
        </div>

        {/* 渲染子文件夹 */}
        {hasChildren && isExpanded && (
          <div className={styles.folderChildren}>
            {folder.children.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.folderTree} onClick={closeContextMenu}>
      {/* 树形结构头部 */}
      <div className={styles.treeHeader}>
        <h3>📂 文件夹</h3>
        <button
          className={styles.createButton}
          onClick={() => onCreateFolder(null)}
          title="创建文件夹"
        >
          ＋
        </button>
      </div>

      {/* 文件夹树 */}
      <div className={styles.treeContent}>
        {/* 全部文档选项 */}
        <div
          className={`${styles.folderItem} ${selectedFolderId === null ? styles.selected : ''}`}
          onClick={() => onSelectFolder(null)}
          style={{ paddingLeft: '10px' }}
        >
          <span className={styles.folderIcon}>📑</span>
          <span className={styles.folderName}>全部文档</span>
        </div>

        {/* 分隔线 */}
        {folders.length > 0 && (
          <div className={styles.divider}></div>
        )}

        {/* 文件夹列表 */}
        {folders.length > 0 ? (
          folders.map(folder => renderFolder(folder))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📁</div>
            <p>暂无文件夹</p>
          </div>
        )}
      </div>

      {/* 右键菜单 */}
      {contextMenu && (() => {
        const isRootFolder = contextMenu.folder.parent_folder_id === null;
        
        return (
          <div
            className={styles.contextMenu}
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`
            }}
            onClick={closeContextMenu}
          >
            {/* 新建子文件夹 - 所有文件夹都可以 */}
            <div
              className={styles.menuItem}
              onClick={() => {
                onCreateFolder(contextMenu.folder.id);
                closeContextMenu();
              }}
            >
              <span>➕</span>
              <span>新建子文件夹</span>
            </div>

            {/* 重命名 - 所有文件夹都可以 */}
            <div
              className={styles.menuItem}
              onClick={() => {
                onEditFolder(contextMenu.folder);
                closeContextMenu();
              }}
            >
              <span>✏️</span>
              <span>重命名</span>
            </div>

            {/* 移动 - 仅非根文件夹可以移动 */}
            {!isRootFolder && (
              <div
                className={styles.menuItem}
                onClick={() => {
                  onMoveFolder && onMoveFolder(contextMenu.folder);
                  closeContextMenu();
                }}
              >
                <span>📦</span>
                <span>移动到...</span>
              </div>
            )}

            {/* 删除 - 仅非根文件夹可以删除 */}
            {!isRootFolder && (
              <>
                <div className={styles.menuDivider}></div>
                <div
                  className={`${styles.menuItem} ${styles.danger}`}
                  onClick={() => {
                    onDeleteFolder(contextMenu.folder);
                    closeContextMenu();
                  }}
                >
                  <span>🗑️</span>
                  <span>删除文件夹</span>
                </div>
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default FolderTree;

