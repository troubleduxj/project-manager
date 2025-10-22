const database = require('../database/db');

async function migrateAddDocumentFolders() {
  try {
    await database.connect();
    
    console.log('🔧 开始迁移：添加文档文件夹功能...');

    // 创建文档文件夹表
    await database.run(`
      CREATE TABLE IF NOT EXISTS document_folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name VARCHAR(200) NOT NULL,
        parent_folder_id INTEGER,
        description TEXT,
        color VARCHAR(20) DEFAULT '#2e8555',
        icon VARCHAR(50) DEFAULT '📁',
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_folder_id) REFERENCES document_folders(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    console.log('✅ document_folders 表创建完成');

    // 检查 documents 表是否已有 folder_id 字段
    const tableInfo = await database.all(`PRAGMA table_info(documents)`);
    const hasFolderId = tableInfo.some(col => col.name === 'folder_id');

    if (!hasFolderId) {
      // 添加 folder_id 字段到 documents 表
      await database.run(`
        ALTER TABLE documents ADD COLUMN folder_id INTEGER REFERENCES document_folders(id) ON DELETE SET NULL
      `);
      
      console.log('✅ documents 表添加 folder_id 字段完成');
    } else {
      console.log('ℹ️  folder_id 字段已存在，跳过添加');
    }

    // 创建根文件夹（每个项目一个）并将现有文档移动到根文件夹
    const projects = await database.all('SELECT id, name FROM projects');
    
    for (const project of projects) {
      let rootFolder = await database.get(
        'SELECT id FROM document_folders WHERE project_id = ? AND parent_folder_id IS NULL AND name = ?',
        [project.id, '根目录']
      );

      if (!rootFolder) {
        const result = await database.run(`
          INSERT INTO document_folders (project_id, name, description, icon, parent_folder_id)
          VALUES (?, ?, ?, ?, NULL)
        `, [project.id, '根目录', `${project.name} 的根文件夹`, '🏠']);
        
        rootFolder = { id: result.lastID };
        console.log(`✅ 为项目 "${project.name}" 创建根文件夹 (ID: ${rootFolder.id})`);
      } else {
        console.log(`ℹ️  项目 "${project.name}" 的根文件夹已存在 (ID: ${rootFolder.id})`);
      }

      // 将该项目下所有没有 folder_id 的文档移动到根文件夹
      const result = await database.run(
        'UPDATE documents SET folder_id = ? WHERE project_id = ? AND folder_id IS NULL',
        [rootFolder.id, project.id]
      );
      
      if (result.changes > 0) {
        console.log(`✅ 将 ${result.changes} 个文档移动到项目 "${project.name}" 的根文件夹`);
      }
    }

    console.log('🎉 文档文件夹功能迁移完成！');

  } catch (error) {
    console.error('❌ 迁移失败:', error);
    throw error;
  } finally {
    await database.close();
  }
}

// 如果直接运行此文件，则执行迁移
if (require.main === module) {
  migrateAddDocumentFolders();
}

module.exports = migrateAddDocumentFolders;

