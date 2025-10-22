const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const database = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectId = req.params.id || req.body.projectId;
    const projectDir = path.join(uploadDir, `project-${projectId}`);
    
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    
    cb(null, projectDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    
    // 处理中文文件名编码
    let safeName;
    try {
      // 尝试检测编码并转换
      safeName = Buffer.from(name, 'latin1').toString('utf8');
      // 验证转换结果是否包含有效字符
      if (safeName.includes('�') || safeName.length === 0) {
        // 如果转换失败，直接使用原始名称
        safeName = name;
      }
    } catch (error) {
      console.log('文件名编码转换失败，使用原始名称:', name);
      safeName = name;
    }
    
    // 清理文件名中的特殊字符
    safeName = safeName.replace(/[<>:"/\\|?*]/g, '_');
    
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|md|jpg|jpeg|png|gif|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // 更宽松的MIME类型检查
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/markdown',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/zip',
      'application/x-rar-compressed'
    ];
    
    const mimetypeAllowed = allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/');

    if (extname || mimetypeAllowed) {
      return cb(null, true);
    } else {
      console.log('文件类型不支持:', file.originalname, file.mimetype);
      cb(new Error(`不支持的文件类型: ${file.mimetype}`));
    }
  }
});

// 获取项目文档列表
router.get('/project/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { role, userId } = req.user;

    console.log('📄 获取项目文档请求:', {
      projectId,
      userId,
      role,
      userIdType: typeof userId
    });

    // 权限检查
    const project = await database.get('SELECT client_id, manager_id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    console.log('🔍 项目权限信息:', {
      projectClientId: project.client_id,
      projectManagerId: project.manager_id,
      clientIdType: typeof project.client_id,
      managerIdType: typeof project.manager_id,
      match: project.client_id == userId || project.manager_id == userId
    });

    if (role !== 'admin' && project.client_id != userId && project.manager_id != userId) {
      console.log('❌ 权限检查失败');
      return res.status(403).json({ error: '无权访问此项目文档' });
    }

    console.log('✅ 权限检查通过');

    const documents = await database.all(`
      SELECT d.*, u.full_name as uploaded_by_name
      FROM documents d
      LEFT JOIN users u ON d.uploaded_by = u.id
      WHERE d.project_id = ?
      ORDER BY d.created_at DESC
    `, [projectId]);

    res.json(documents);

  } catch (error) {
    console.error('获取文档列表错误:', error);
    res.status(500).json({ error: '获取文档列表失败' });
  }
});

// 上传文档 - 修改路径以匹配前端调用
router.post('/project/:id', authenticateToken, (req, res) => {
  upload.single('document')(req, res, async (err) => {
    if (err) {
      console.error('Multer错误:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: '文件大小超过限制（最大10MB）' });
        }
        return res.status(400).json({ error: `文件上传错误: ${err.message}` });
      }
      return res.status(400).json({ error: err.message });
    }

    try {
      const projectId = req.params.id;
      const { role, userId } = req.user;

      // 权限检查
      const project = await database.get('SELECT client_id, manager_id FROM projects WHERE id = ?', [projectId]);
      if (!project) {
        return res.status(404).json({ error: '项目不存在' });
      }

      if (role !== 'admin' && project.manager_id !== userId) {
        return res.status(403).json({ error: '无权上传文档' });
      }

      if (!req.file) {
        return res.status(400).json({ error: '请选择要上传的文件' });
      }

      const { category = 'other', description = '', folder_id } = req.body;
      
      // 确保中文文件名正确处理
      let originalName;
      try {
        // 尝试检测编码并转换
        originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        // 验证转换结果是否包含有效字符
        if (originalName.includes('�') || originalName.length === 0) {
          // 如果转换失败，直接使用原始名称
          originalName = req.file.originalname;
        }
      } catch (error) {
        console.log('文件名编码转换失败，使用原始名称:', req.file.originalname);
        originalName = req.file.originalname;
      }

      const result = await database.run(`
        INSERT INTO documents (
          project_id, title, content, file_path, file_type, file_size, 
          category, uploaded_by, folder_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        projectId,
        originalName,
        description,
        req.file.path,
        req.file.mimetype,
        req.file.size,
        category,
        userId,
        folder_id ? parseInt(folder_id) : null
      ]);

      res.status(201).json({
        message: '文档上传成功',
        documentId: result.lastID,
        filename: req.file.originalname
      });

    } catch (error) {
      console.error('上传文档错误:', error);
      res.status(500).json({ error: '上传文档失败: ' + error.message });
    }
  });
});

// 下载文档
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const documentId = req.params.id;
    const { role, userId } = req.user;

    const document = await database.get(`
      SELECT d.*, p.client_id, p.manager_id
      FROM documents d
      JOIN projects p ON d.project_id = p.id
      WHERE d.id = ?
    `, [documentId]);

    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }

    // 权限检查
    if (role !== 'admin' && 
        document.client_id !== userId && 
        document.manager_id !== userId &&
        !document.is_public) {
      return res.status(403).json({ error: '无权下载此文档' });
    }

    const filePath = document.file_path;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' });
    }

    res.download(filePath, document.title);

  } catch (error) {
    console.error('下载文档错误:', error);
    res.status(500).json({ error: '下载文档失败' });
  }
});

// 预览文档（用于在线查看）
router.get('/:id/preview', authenticateToken, async (req, res) => {
  try {
    const documentId = req.params.id;
    const { role, userId } = req.user;

    const document = await database.get(`
      SELECT d.*, p.client_id, p.manager_id
      FROM documents d
      JOIN projects p ON d.project_id = p.id
      WHERE d.id = ?
    `, [documentId]);

    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }

    // 权限检查
    if (role !== 'admin' && 
        document.client_id !== userId && 
        document.manager_id !== userId &&
        !document.is_public) {
      return res.status(403).json({ error: '无权预览此文档' });
    }

    const filePath = document.file_path;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: '文件不存在' });
    }

    // 对于文本文件，可以直接返回内容
    const ext = path.extname(filePath).toLowerCase();
    if (['.txt', '.md'].includes(ext)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.json({
        type: 'text',
        content: content,
        filename: document.title
      });
    } else {
      // 对于其他文件类型，返回文件信息
      res.json({
        type: 'file',
        filename: document.title,
        fileType: document.file_type,
        fileSize: document.file_size,
        downloadUrl: `/api/documents/${documentId}/download`
      });
    }

  } catch (error) {
    console.error('预览文档错误:', error);
    res.status(500).json({ error: '预览文档失败' });
  }
});

// 更新文档信息
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = req.params.id;
    const { role, userId } = req.user;

    const document = await database.get(`
      SELECT d.*, p.manager_id
      FROM documents d
      JOIN projects p ON d.project_id = p.id
      WHERE d.id = ?
    `, [documentId]);

    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }

    // 权限检查：只有管理员或项目经理可以修改
    if (role !== 'admin' && document.manager_id !== userId) {
      return res.status(403).json({ error: '无权修改此文档' });
    }

    const { title, category, content, isPublic, folder_id } = req.body;

    await database.run(`
      UPDATE documents 
      SET title = ?, category = ?, content = ?, is_public = ?, folder_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, category, content, isPublic ? 1 : 0, folder_id, documentId]);

    res.json({ message: '文档信息更新成功' });

  } catch (error) {
    console.error('更新文档错误:', error);
    res.status(500).json({ error: '更新文档失败' });
  }
});

// 删除文档
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = req.params.id;
    const { role, userId } = req.user;

    const document = await database.get(`
      SELECT d.*, p.manager_id
      FROM documents d
      JOIN projects p ON d.project_id = p.id
      WHERE d.id = ?
    `, [documentId]);

    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }

    // 权限检查：只有管理员或项目经理可以删除
    if (role !== 'admin' && document.manager_id !== userId) {
      return res.status(403).json({ error: '无权删除此文档' });
    }

    // 删除物理文件
    if (fs.existsSync(document.file_path)) {
      fs.unlinkSync(document.file_path);
    }

    // 删除数据库记录
    await database.run('DELETE FROM documents WHERE id = ?', [documentId]);

    res.json({ message: '文档删除成功' });

  } catch (error) {
    console.error('删除文档错误:', error);
    res.status(500).json({ error: '删除文档失败' });
  }
});

// 获取文档分类列表
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await database.all(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM documents
      GROUP BY category
      ORDER BY category ASC
    `);

    res.json(categories);

  } catch (error) {
    console.error('获取文档分类错误:', error);
    res.status(500).json({ error: '获取文档分类失败' });
  }
});

// 获取文档存储统计
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const db = await database.getDatabase();
    
    // 获取文档总数
    const totalDocsResult = await db.get(
      'SELECT COUNT(*) as count FROM documents'
    );
    
    // 获取总存储大小（字节）
    const totalSizeResult = await db.get(
      'SELECT COALESCE(SUM(file_size), 0) as size FROM documents'
    );
    
    // 获取本月上传数量
    const monthlyUploadsResult = await db.get(
      `SELECT COUNT(*) as count FROM documents 
       WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
    );
    
    res.json({
      totalDocuments: totalDocsResult?.count || 0,
      totalSize: totalSizeResult?.size || 0,
      monthlyUploads: monthlyUploadsResult?.count || 0,
      storageCapacity: 10 * 1024 * 1024 * 1024 // 10GB
    });
  } catch (error) {
    console.error('获取文档统计失败:', error);
    res.status(500).json({ error: '获取统计数据失败' });
  }
});

module.exports = router;
