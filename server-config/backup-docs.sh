#!/bin/bash
#
# 文档系统自动备份脚本
# 保存路径: /root/scripts/backup-docs.sh
# 
# 使用方法:
# 1. 复制到服务器: scp backup-docs.sh user@server:/root/scripts/
# 2. 添加执行权限: chmod +x /root/scripts/backup-docs.sh
# 3. 添加到 crontab: 0 2 * * * /root/scripts/backup-docs.sh
#

# ============ 配置区域 ============
BACKUP_DIR="/backup/docs-web"
SOURCE_DIR="/var/www/docs-web"
NGINX_CONFIG_DIR="/etc/nginx"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7
LOG_FILE="/var/log/backup-docs.log"

# ============ 函数定义 ============
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# ============ 开始备份 ============
log "======================================"
log "开始备份文档系统"
log "======================================"

# 创建备份目录
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    log "创建备份目录: $BACKUP_DIR"
fi

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    log "错误：源目录不存在 - $SOURCE_DIR"
    exit 1
fi

# 备份网站文件
log "备份网站文件..."
WEBSITE_BACKUP="$BACKUP_DIR/docs-web-$DATE.tar.gz"
tar -czf "$WEBSITE_BACKUP" -C /var/www docs-web 2>&1 | tee -a "$LOG_FILE"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$WEBSITE_BACKUP" | cut -f1)
    log "✅ 网站文件备份成功: $WEBSITE_BACKUP (大小: $BACKUP_SIZE)"
else
    log "❌ 网站文件备份失败"
    exit 1
fi

# 备份 Nginx 配置
log "备份 Nginx 配置..."
NGINX_BACKUP="$BACKUP_DIR/nginx-config-$DATE.tar.gz"
tar -czf "$NGINX_BACKUP" -C "$NGINX_CONFIG_DIR" sites-available sites-enabled nginx.conf 2>&1 | tee -a "$LOG_FILE"

if [ $? -eq 0 ]; then
    NGINX_SIZE=$(du -h "$NGINX_BACKUP" | cut -f1)
    log "✅ Nginx 配置备份成功: $NGINX_BACKUP (大小: $NGINX_SIZE)"
else
    log "⚠️  Nginx 配置备份失败（非致命错误）"
fi

# 清理旧备份
log "清理旧备份文件（保留 $RETENTION_DAYS 天）..."
find "$BACKUP_DIR" -name "docs-web-*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "nginx-config-*.tar.gz" -mtime +$RETENTION_DAYS -delete

DELETED_COUNT=$(find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)
log "已删除 $DELETED_COUNT 个旧备份文件"

# 显示当前备份列表
log "当前备份文件列表:"
ls -lh "$BACKUP_DIR" | tail -n 10 | tee -a "$LOG_FILE"

# 计算总备份大小
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "备份目录总大小: $TOTAL_SIZE"

# 检查磁盘空间
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
log "当前磁盘使用率: $DISK_USAGE%"

if [ $DISK_USAGE -gt 80 ]; then
    log "⚠️  警告：磁盘使用率超过 80%！"
fi

log "======================================"
log "备份完成！"
log "======================================"

exit 0

