const database = require('./database/db');

async function seedData() {
  try {
    await database.connect();
    console.log('🌱 开始添加示例数据...');

    // 添加示例项目
    const project1 = await database.run(`
      INSERT INTO projects (name, description, start_date, end_date, status, priority, client_id, manager_id, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '企业网站重构',
      '对公司官网进行全面重构，采用现代化技术栈，提升用户体验和性能',
      '2024-01-15',
      '2024-03-15',
      'in_progress',
      'high',
      2, // client用户ID
      1, // admin用户ID
      65
    ]);

    const project2 = await database.run(`
      INSERT INTO projects (name, description, start_date, end_date, status, priority, client_id, manager_id, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '移动应用开发',
      '开发跨平台移动应用，支持iOS和Android系统',
      '2024-02-01',
      '2024-05-01',
      'planning',
      'medium',
      2, // client用户ID
      1, // admin用户ID
      25
    ]);

    const project3 = await database.run(`
      INSERT INTO projects (name, description, start_date, end_date, status, priority, client_id, manager_id, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '数据分析平台',
      '构建企业级数据分析和可视化平台',
      '2023-12-01',
      '2024-02-29',
      'completed',
      'high',
      2, // client用户ID
      1, // admin用户ID
      100
    ]);

    console.log('✅ 示例项目添加成功');

    // 为项目1添加任务
    const tasks1 = [
      {
        name: '需求分析和设计',
        description: '分析现有网站问题，设计新的架构和用户界面',
        status: 'done',
        progress: 100,
        start_date: '2024-01-15',
        due_date: '2024-01-25'
      },
      {
        name: '前端开发',
        description: '使用React和现代CSS框架开发响应式前端界面',
        status: 'in_progress',
        progress: 70,
        start_date: '2024-01-26',
        due_date: '2024-02-15'
      },
      {
        name: '后端API开发',
        description: '开发RESTful API和数据库设计',
        status: 'in_progress',
        progress: 60,
        start_date: '2024-02-01',
        due_date: '2024-02-20'
      },
      {
        name: '测试和部署',
        description: '进行全面测试并部署到生产环境',
        status: 'todo',
        progress: 0,
        start_date: '2024-02-21',
        due_date: '2024-03-15'
      }
    ];

    for (const task of tasks1) {
      await database.run(`
        INSERT INTO project_progress (project_id, task_name, description, status, progress, assigned_to, start_date, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [project1.id, task.name, task.description, task.status, task.progress, 1, task.start_date, task.due_date]);
    }

    // 为项目2添加任务
    const tasks2 = [
      {
        name: '市场调研',
        description: '分析目标用户需求和竞品情况',
        status: 'done',
        progress: 100,
        start_date: '2024-02-01',
        due_date: '2024-02-10'
      },
      {
        name: '原型设计',
        description: '设计应用原型和用户交互流程',
        status: 'in_progress',
        progress: 40,
        start_date: '2024-02-11',
        due_date: '2024-02-25'
      },
      {
        name: '技术选型',
        description: '选择合适的跨平台开发框架和工具',
        status: 'todo',
        progress: 0,
        start_date: '2024-02-26',
        due_date: '2024-03-05'
      }
    ];

    for (const task of tasks2) {
      await database.run(`
        INSERT INTO project_progress (project_id, task_name, description, status, progress, assigned_to, start_date, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [project2.id, task.name, task.description, task.status, task.progress, 1, task.start_date, task.due_date]);
    }

    // 为项目3添加任务
    const tasks3 = [
      {
        name: '数据源集成',
        description: '集成各种数据源和ETL流程',
        status: 'done',
        progress: 100,
        start_date: '2023-12-01',
        due_date: '2023-12-20'
      },
      {
        name: '可视化组件开发',
        description: '开发各种图表和仪表板组件',
        status: 'done',
        progress: 100,
        start_date: '2023-12-21',
        due_date: '2024-01-15'
      },
      {
        name: '用户权限系统',
        description: '实现多租户和权限管理功能',
        status: 'done',
        progress: 100,
        start_date: '2024-01-16',
        due_date: '2024-02-10'
      },
      {
        name: '性能优化和部署',
        description: '优化查询性能并部署到生产环境',
        status: 'done',
        progress: 100,
        start_date: '2024-02-11',
        due_date: '2024-02-29'
      }
    ];

    for (const task of tasks3) {
      await database.run(`
        INSERT INTO project_progress (project_id, task_name, description, status, progress, assigned_to, start_date, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [project3.id, task.name, task.description, task.status, task.progress, 1, task.start_date, task.due_date]);
    }

    console.log('✅ 示例任务添加成功');
    console.log('🎉 示例数据添加完成！');
    
  } catch (error) {
    console.error('❌ 添加示例数据失败:', error);
  } finally {
    await database.close();
  }
}

// 如果直接运行此文件
if (require.main === module) {
  seedData();
}

module.exports = { seedData };
