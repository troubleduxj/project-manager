const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const DB_PATH = path.join(__dirname, '..', 'project_management.db');

class Database {
  constructor() {
    this.db = null;
  }

  // 连接数据库
  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('数据库连接失败:', err.message);
          reject(err);
        } else {
          console.log('✅ SQLite 数据库连接成功');
          resolve();
        }
      });
    });
  }

  // 执行查询
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // 查询单条记录
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // 查询多条记录
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // 关闭数据库连接
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('数据库连接已关闭');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

// 创建数据库实例
const database = new Database();

module.exports = database;
