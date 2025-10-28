const database = require('./database/db');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    await database.connect();
    
    console.log('🔧 开始初始化数据库...');

    // 创建用户表
    await database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'client',
        full_name VARCHAR(100),
        avatar VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建项目表
    await database.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'planning',
        priority VARCHAR(10) DEFAULT 'medium',
        type VARCHAR(50),
        start_date DATE,
        end_date DATE,
        client_id INTEGER,
        manager_id INTEGER,
        progress INTEGER DEFAULT 0,
        budget DECIMAL(10,2),
        department VARCHAR(50),
        team VARCHAR(100),
        customer VARCHAR(100),
        is_default BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users(id),
        FOREIGN KEY (manager_id) REFERENCES users(id)
      )
    `);

    // 创建项目进度表
    await database.run(`
      CREATE TABLE IF NOT EXISTS project_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        task_name VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'todo',
        progress INTEGER DEFAULT 0,
        assigned_to INTEGER,
        parent_task_id INTEGER,
        start_date DATE,
        due_date DATE,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (assigned_to) REFERENCES users(id),
        FOREIGN KEY (parent_task_id) REFERENCES project_progress(id)
      )
    `);

    // 创建文档文件夹表
    await database.run(`
      CREATE TABLE IF NOT EXISTS document_folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        color VARCHAR(50),
        parent_folder_id INTEGER,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_folder_id) REFERENCES document_folders(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 创建文档表
    await database.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT,
        file_path VARCHAR(500),
        file_type VARCHAR(50),
        file_size INTEGER,
        version VARCHAR(20) DEFAULT '1.0',
        category VARCHAR(50),
        is_public BOOLEAN DEFAULT 0,
        uploaded_by INTEGER,
        folder_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (uploaded_by) REFERENCES users(id),
        FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL
      )
    `);

    // 创建消息表
    await database.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        title VARCHAR(200),
        attachment_path VARCHAR(500),
        is_read BOOLEAN DEFAULT 0,
        read_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id)
      )
    `);

    // 创建系统设置表
    await database.run(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建项目成员表
    await database.run(`
      CREATE TABLE IF NOT EXISTS project_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        user_id INTEGER,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50),
        department VARCHAR(50),
        phone VARCHAR(20),
        email VARCHAR(100),
        join_date DATE,
        status VARCHAR(20) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 创建项目服务器表
    await database.run(`
      CREATE TABLE IF NOT EXISTS project_servers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name VARCHAR(100) NOT NULL,
        ip VARCHAR(50),
        type VARCHAR(50),
        cpu VARCHAR(50),
        memory VARCHAR(50),
        disk VARCHAR(50),
        status VARCHAR(20) DEFAULT 'running',
        purpose VARCHAR(200),
        remark TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    // 创建项目软件资料表
    await database.run(`
      CREATE TABLE IF NOT EXISTS project_resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name VARCHAR(100) NOT NULL,
        version VARCHAR(50),
        type VARCHAR(50),
        license VARCHAR(100),
        update_date DATE,
        description TEXT,
        download_url VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    // 创建用户通知设置表
    await database.run(`
      CREATE TABLE IF NOT EXISTS user_notification_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        email_notifications BOOLEAN DEFAULT 1,
        task_notifications BOOLEAN DEFAULT 1,
        project_notifications BOOLEAN DEFAULT 1,
        document_notifications BOOLEAN DEFAULT 1,
        system_notifications BOOLEAN DEFAULT 1,
        comment_notifications BOOLEAN DEFAULT 1,
        notification_frequency VARCHAR(20) DEFAULT 'immediate',
        quiet_hours_start TIME DEFAULT '22:00',
        quiet_hours_end TIME DEFAULT '08:00',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 创建任务评论表
    await database.run(`
      CREATE TABLE IF NOT EXISTS task_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        mentioned_users TEXT, -- JSON格式存储@的用户ID数组
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES project_progress (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('✅ 数据库表创建完成');

    // 创建默认管理员用户
    const adminExists = await database.get('SELECT id FROM users WHERE username = ?', ['admin']);
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await database.run(`
        INSERT INTO users (username, email, password, role, full_name)
        VALUES (?, ?, ?, ?, ?)
      `, ['admin', 'admin@example.com', hashedPassword, 'admin', '系统管理员']);
      
      console.log('✅ 默认管理员用户创建完成');
      console.log('   用户名: admin');
      console.log('   密码: admin123');
    }

    // 创建示例客户用户
    const clientExists = await database.get('SELECT id FROM users WHERE username = ?', ['client']);
    
    if (!clientExists) {
      const hashedPassword = await bcrypt.hash('client123', 10);
      await database.run(`
        INSERT INTO users (username, email, password, role, full_name)
        VALUES (?, ?, ?, ?, ?)
      `, ['client', 'client@example.com', hashedPassword, 'client', '示例客户']);
      
      console.log('✅ 示例客户用户创建完成');
      console.log('   用户名: client');
      console.log('   密码: client123');
    }

    // 插入系统设置
    const settings = [
      ['site_name', '项目管理系统', '网站名称'],
      ['site_description', '专业的项目管理与文档查看系统', '网站描述'],
      ['max_file_size', '10485760', '最大文件上传大小（字节）'],
      ['allowed_file_types', 'pdf,doc,docx,txt,md,jpg,png,gif', '允许的文件类型'],
      // 邮件配置
      ['smtp_host', 'smtp.exmail.qq.com', 'SMTP服务器地址'],
      ['smtp_port', '465', 'SMTP端口'],
      ['smtp_user', 'xj.du@hanatech.com.cn', 'SMTP用户名'],
      ['smtp_pass', 'Dxj19831010', 'SMTP密码'],
      ['from_name', '杜晓军', '发件人名称'],
      ['from_email', 'xj.du@hanatech.com.cn', '发件人邮箱'],
      ['test_email', 'duxiaojun1983@163.com', '测试邮箱'],
      ['enable_ssl', 'true', '启用SSL'],
      ['enable_tls', 'false', '启用TLS']
    ];

    for (const [key, value, description] of settings) {
      const exists = await database.get('SELECT id FROM settings WHERE key = ?', [key]);
      if (!exists) {
        await database.run(`
          INSERT INTO settings (key, value, description)
          VALUES (?, ?, ?)
        `, [key, value, description]);
      }
    }

    console.log('✅ 系统设置初始化完成');

    // 创建示例项目
    const projectExists = await database.get('SELECT id FROM projects WHERE name = ?', ['示例项目']);
    
    if (!projectExists) {
      const adminUser = await database.get('SELECT id FROM users WHERE username = ?', ['admin']);
      const clientUser = await database.get('SELECT id FROM users WHERE username = ?', ['client']);
      
      const result = await database.run(`
        INSERT INTO projects (name, description, status, priority, client_id, manager_id, progress, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        '示例项目',
        '这是一个示例项目，用于演示系统功能',
        'in_progress',
        'high',
        clientUser.id,
        adminUser.id,
        35,
        '2025-10-01',
        '2025-12-31'
      ]);

      // 创建示例任务
      const tasks = [
        ['需求分析', '收集和分析项目需求', 'completed', 100],
        ['系统设计', '设计系统架构和数据库', 'completed', 100],
        ['前端开发', '开发用户界面', 'in_progress', 60],
        ['后端开发', '开发API和业务逻辑', 'in_progress', 40],
        ['测试部署', '系统测试和部署上线', 'pending', 0]
      ];

      for (const [taskName, description, status, progress] of tasks) {
        await database.run(`
          INSERT INTO project_progress (project_id, task_name, description, status, progress, assigned_to)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [result.id, taskName, description, status, progress, adminUser.id]);
      }

      console.log('✅ 示例项目和任务创建完成');
    }

    console.log('🎉 数据库初始化完成！');
    console.log('');
    console.log('可以使用以下账户登录：');
    console.log('管理员 - 用户名: admin, 密码: admin123');
    console.log('客户   - 用户名: client, 密码: client123');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  } finally {
    await database.close();
  }
}

// 如果直接运行此文件，则执行初始化
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
