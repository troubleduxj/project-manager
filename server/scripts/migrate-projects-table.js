/**
 * 数据库迁移脚本 - 为projects表添加新字段
 * 运行: node server/scripts/migrate-projects-table.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'project_manager.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 开始迁移 projects 表...\n');

// 添加新字段的SQL语句
const alterTableStatements = [
  'ALTER TABLE projects ADD COLUMN type VARCHAR(50)',
  'ALTER TABLE projects ADD COLUMN department VARCHAR(50)',
  'ALTER TABLE projects ADD COLUMN team VARCHAR(100)',
  'ALTER TABLE projects ADD COLUMN customer VARCHAR(100)',
  'ALTER TABLE projects ADD COLUMN is_default BOOLEAN DEFAULT 0'
];

// 依次执行每个ALTER TABLE语句
let completed = 0;
let failed = 0;

alterTableStatements.forEach((sql, index) => {
  db.run(sql, (err) => {
    if (err) {
      // 如果字段已存在,会报错,这是正常的
      if (err.message.includes('duplicate column name')) {
        console.log(`⚠️  字段已存在,跳过: ${sql.match(/ADD COLUMN (\w+)/)[1]}`);
      } else {
        console.error(`❌ 执行失败: ${sql}`);
        console.error(`   错误: ${err.message}`);
        failed++;
      }
    } else {
      console.log(`✅ 字段已添加: ${sql.match(/ADD COLUMN (\w+)/)[1]}`);
      completed++;
    }

    // 最后一条语句执行完后关闭数据库
    if (index === alterTableStatements.length - 1) {
      setTimeout(() => {
        console.log('\n📊 迁移完成统计:');
        console.log(`   ✅ 成功添加: ${completed} 个字段`);
        console.log(`   ❌ 失败/已存在: ${failed} 个字段`);
        console.log('\n✨ 数据库迁移完成!\n');
        db.close();
      }, 100);
    }
  });
});

