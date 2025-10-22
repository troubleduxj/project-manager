#!/bin/bash

# 项目管理系统数据备份脚本

# 配置
PROJECT_DIR="/path/to/your/project"
BACKUP_DIR="/backup/project-management"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

echo "开始备份项目管理系统数据: $DATE"

# 备份数据库
echo "备份数据库..."
if [ -f "$PROJECT_DIR/server/database/project_management.db" ]; then
    cp "$PROJECT_DIR/server/database/project_management.db" "$BACKUP_DIR/database_$DATE.db"
    echo "数据库备份完成"
else
    echo "警告: 数据库文件不存在"
fi

# 备份上传的文件
echo "备份上传文件..."
if [ -d "$PROJECT_DIR/server/uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" -C "$PROJECT_DIR/server" uploads/
    echo "上传文件备份完成"
else
    echo "警告: 上传目录不存在"
fi

# 备份配置文件
echo "备份配置文件..."
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" -C "$PROJECT_DIR" \
    package.json \
    docusaurus.config.js \
    ecosystem.config.js \
    nginx.conf.example \
    env.example 2>/dev/null

echo "配置文件备份完成"

# 清理旧备份
echo "清理旧备份文件..."
find $BACKUP_DIR -name "database_*.db" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "config_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "备份完成！"
echo "备份文件位置: $BACKUP_DIR"
ls -lh $BACKUP_DIR | tail -n 10
