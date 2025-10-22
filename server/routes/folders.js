const express = require('express');
const router = express.Router();
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// 获取项目的所有文件夹（树形结构）
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // 获取所有文件夹
    const folders = await database.all(
      `SELECT f.*, u.username as creator_name 
       FROM document_folders f 
       LEFT JOIN users u ON f.created_by = u.id
       WHERE f.project_id = ? 
       ORDER BY f.parent_folder_id, f.created_at`,
      [projectId]
    );
    
    // 构建树形结构
    const buildTree = (parentId = null) => {
      return folders
        .filter(folder => folder.parent_folder_id === parentId)
        .map(folder => ({
          ...folder,
          children: buildTree(folder.id)
        }));
    };
    
    const tree = buildTree();
    
    res.json(tree);
  } catch (error) {
    console.error('获取文件夹列表失败:', error);
    res.status(500).json({ error: '获取文件夹列表失败' });
  }
});

// 获取单个文件夹详情
router.get('/:folderId', authenticateToken, async (req, res) => {
  try {
    const { folderId } = req.params;
    
    const folder = await database.get(
      `SELECT f.*, u.username as creator_name 
       FROM document_folders f 
       LEFT JOIN users u ON f.created_by = u.id
       WHERE f.id = ?`,
      [folderId]
    );
    
    if (!folder) {
      return res.status(404).json({ error: '文件夹不存在' });
    }
    
    // 获取该文件夹下的文档数量
    const docCount = await database.get(
      'SELECT COUNT(*) as count FROM documents WHERE folder_id = ?',
      [folderId]
    );
    
    // 获取子文件夹数量
    const subFolderCount = await database.get(
      'SELECT COUNT(*) as count FROM document_folders WHERE parent_folder_id = ?',
      [folderId]
    );
    
    res.json({
      ...folder,
      document_count: docCount.count,
      subfolder_count: subFolderCount.count
    });
  } catch (error) {
    console.error('获取文件夹详情失败:', error);
    res.status(500).json({ error: '获取文件夹详情失败' });
  }
});

// 创建文件夹
router.post('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, parent_folder_id, description, color, icon } = req.body;
    const userId = req.user.id;
    
    // 验证必填字段
    if (!name) {
      return res.status(400).json({ error: '文件夹名称不能为空' });
    }
    
    // 检查同级目录下是否已存在同名文件夹
    const existing = await database.get(
      `SELECT id FROM document_folders 
       WHERE project_id = ? AND name = ? AND parent_folder_id ${parent_folder_id ? '= ?' : 'IS NULL'}`,
      parent_folder_id ? [projectId, name, parent_folder_id] : [projectId, name]
    );
    
    if (existing) {
      return res.status(400).json({ error: '该目录下已存在同名文件夹' });
    }
    
    // 创建文件夹
    const result = await database.run(
      `INSERT INTO document_folders 
       (project_id, name, parent_folder_id, description, color, icon, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        name,
        parent_folder_id || null,
        description || '',
        color || '#2e8555',
        icon || '📁',
        userId
      ]
    );
    
    // 获取创建的文件夹信息
    const folder = await database.get(
      `SELECT f.*, u.username as creator_name 
       FROM document_folders f 
       LEFT JOIN users u ON f.created_by = u.id
       WHERE f.id = ?`,
      [result.id]
    );
    
    res.status(201).json(folder);
  } catch (error) {
    console.error('创建文件夹失败:', error);
    res.status(500).json({ error: '创建文件夹失败' });
  }
});

// 更新文件夹
router.put('/:folderId', authenticateToken, async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name, description, color, icon, parent_folder_id } = req.body;
    
    // 检查文件夹是否存在
    const folder = await database.get(
      'SELECT * FROM document_folders WHERE id = ?',
      [folderId]
    );
    
    if (!folder) {
      return res.status(404).json({ error: '文件夹不存在' });
    }
    
    // 验证名称（如果提供）
    if (name) {
      // 检查同级目录下是否已存在同名文件夹
      const existing = await database.get(
        `SELECT id FROM document_folders 
         WHERE project_id = ? AND name = ? AND parent_folder_id ${folder.parent_folder_id ? '= ?' : 'IS NULL'} AND id != ?`,
        folder.parent_folder_id 
          ? [folder.project_id, name, folder.parent_folder_id, folderId]
          : [folder.project_id, name, folderId]
      );
      
      if (existing) {
        return res.status(400).json({ error: '该目录下已存在同名文件夹' });
      }
    }
    
    // 如果要移动文件夹，检查不能移动到自己或子文件夹
    if (parent_folder_id !== undefined && parent_folder_id !== folder.parent_folder_id) {
      if (parent_folder_id === parseInt(folderId)) {
        return res.status(400).json({ error: '不能将文件夹移动到自己下面' });
      }
      
      // 检查是否移动到子文件夹（递归检查）
      const isSubfolder = await checkIsSubfolder(folderId, parent_folder_id);
      if (isSubfolder) {
        return res.status(400).json({ error: '不能将文件夹移动到自己的子文件夹下' });
      }
    }
    
    // 更新文件夹
    await database.run(
      `UPDATE document_folders 
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           color = COALESCE(?, color),
           icon = COALESCE(?, icon),
           parent_folder_id = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name,
        description,
        color,
        icon,
        parent_folder_id !== undefined ? parent_folder_id : folder.parent_folder_id,
        folderId
      ]
    );
    
    // 获取更新后的文件夹信息
    const updatedFolder = await database.get(
      `SELECT f.*, u.username as creator_name 
       FROM document_folders f 
       LEFT JOIN users u ON f.created_by = u.id
       WHERE f.id = ?`,
      [folderId]
    );
    
    res.json(updatedFolder);
  } catch (error) {
    console.error('更新文件夹失败:', error);
    res.status(500).json({ error: '更新文件夹失败' });
  }
});

// 删除文件夹
router.delete('/:folderId', authenticateToken, async (req, res) => {
  try {
    const { folderId } = req.params;
    const { force } = req.query; // force=true 则级联删除
    
    // 检查文件夹是否存在
    const folder = await database.get(
      'SELECT * FROM document_folders WHERE id = ?',
      [folderId]
    );
    
    if (!folder) {
      return res.status(404).json({ error: '文件夹不存在' });
    }
    
    // 检查是否为根文件夹（根文件夹的 parent_folder_id 为 NULL）
    if (folder.parent_folder_id === null) {
      return res.status(400).json({ error: '不能删除项目根文件夹' });
    }
    
    // 检查是否有子文件夹
    const subFolders = await database.get(
      'SELECT COUNT(*) as count FROM document_folders WHERE parent_folder_id = ?',
      [folderId]
    );
    
    if (subFolders.count > 0 && !force) {
      return res.status(400).json({ 
        error: '该文件夹包含子文件夹，请先删除子文件夹或使用force=true参数强制删除',
        has_subfolders: true
      });
    }
    
    // 检查是否有文档
    const documents = await database.get(
      'SELECT COUNT(*) as count FROM documents WHERE folder_id = ?',
      [folderId]
    );
    
    if (documents.count > 0 && !force) {
      return res.status(400).json({ 
        error: '该文件夹包含文档，请先删除文档或使用force=true参数强制删除',
        has_documents: true,
        document_count: documents.count
      });
    }
    
    if (force) {
      // 强制删除：将文档移到父文件夹
      await database.run(
        'UPDATE documents SET folder_id = ? WHERE folder_id = ?',
        [folder.parent_folder_id, folderId]
      );
      
      // 将子文件夹移到父文件夹
      await database.run(
        'UPDATE document_folders SET parent_folder_id = ? WHERE parent_folder_id = ?',
        [folder.parent_folder_id, folderId]
      );
    }
    
    // 删除文件夹
    await database.run('DELETE FROM document_folders WHERE id = ?', [folderId]);
    
    res.json({ message: '文件夹删除成功', deleted_id: folderId });
  } catch (error) {
    console.error('删除文件夹失败:', error);
    res.status(500).json({ error: '删除文件夹失败' });
  }
});

// 移动文档到文件夹
router.post('/:folderId/documents/:documentId', authenticateToken, async (req, res) => {
  try {
    const { folderId, documentId } = req.params;
    
    // 检查文件夹和文档是否存在
    const folder = await database.get(
      'SELECT * FROM document_folders WHERE id = ?',
      [folderId]
    );
    
    if (!folder) {
      return res.status(404).json({ error: '文件夹不存在' });
    }
    
    const document = await database.get(
      'SELECT * FROM documents WHERE id = ?',
      [documentId]
    );
    
    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }
    
    // 检查文档和文件夹是否属于同一个项目
    if (folder.project_id !== document.project_id) {
      return res.status(400).json({ error: '文档和文件夹不属于同一个项目' });
    }
    
    // 移动文档
    await database.run(
      'UPDATE documents SET folder_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [folderId, documentId]
    );
    
    res.json({ message: '文档移动成功' });
  } catch (error) {
    console.error('移动文档失败:', error);
    res.status(500).json({ error: '移动文档失败' });
  }
});

// 辅助函数：检查是否为子文件夹
async function checkIsSubfolder(parentId, childId) {
  if (!childId) return false;
  
  const folder = await database.get(
    'SELECT parent_folder_id FROM document_folders WHERE id = ?',
    [childId]
  );
  
  if (!folder) return false;
  if (folder.parent_folder_id === parseInt(parentId)) return true;
  if (!folder.parent_folder_id) return false;
  
  return await checkIsSubfolder(parentId, folder.parent_folder_id);
}

module.exports = router;

