#!/bin/bash
#
# 文档系统监控脚本
# 保存路径: /root/scripts/monitor.sh
#
# 使用方法:
# 1. 复制到服务器: scp monitor.sh user@server:/root/scripts/
# 2. 添加执行权限: chmod +x /root/scripts/monitor.sh
# 3. 添加到 crontab: */5 * * * * /root/scripts/monitor.sh
#

# ============ 配置区域 ============
WEBSITE_URL="https://yourdomain.com"  # 修改为你的域名
LOG_FILE="/var/log/monitor-docs.log"
ALERT_EMAIL="your-email@example.com"  # 告警邮箱（可选）

# ============ 函数定义 ============
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_alert() {
    local message="$1"
    log "⚠️  发送告警: $message"
    # 如果配置了邮件，可以在这里发送告警邮件
    # echo "$message" | mail -s "文档系统告警" "$ALERT_EMAIL"
}

# ============ 监控检查 ============

# 1. 检查 Nginx 状态
if ! systemctl is-active --quiet nginx; then
    log "❌ Nginx 服务已停止，尝试重启..."
    systemctl restart nginx
    
    if systemctl is-active --quiet nginx; then
        log "✅ Nginx 服务重启成功"
        send_alert "Nginx 服务已自动重启"
    else
        log "❌ Nginx 服务重启失败！"
        send_alert "Nginx 服务重启失败，需要人工介入！"
    fi
else
    log "✅ Nginx 服务运行正常"
fi

# 2. 检查网站可访问性
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$WEBSITE_URL")

if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "301" ] || [ "$HTTP_CODE" == "302" ]; then
    log "✅ 网站可访问 (HTTP $HTTP_CODE)"
else
    log "❌ 网站不可访问 (HTTP $HTTP_CODE)"
    send_alert "网站返回异常状态码: $HTTP_CODE"
fi

# 3. 检查磁盘空间
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
log "📊 磁盘使用率: $DISK_USAGE%"

if [ "$DISK_USAGE" -gt 90 ]; then
    log "⚠️  严重警告：磁盘使用率超过 90%！"
    send_alert "磁盘使用率过高: $DISK_USAGE%"
elif [ "$DISK_USAGE" -gt 80 ]; then
    log "⚠️  警告：磁盘使用率超过 80%"
fi

# 4. 检查内存使用
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
log "📊 内存使用率: $MEMORY_USAGE%"

if [ "$MEMORY_USAGE" -gt 90 ]; then
    log "⚠️  警告：内存使用率过高 ($MEMORY_USAGE%)"
fi

# 5. 检查 CPU 负载
CPU_LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
log "📊 CPU 负载: $CPU_LOAD"

# 6. 检查文档目录是否存在
if [ ! -d "/var/www/docs-web" ]; then
    log "❌ 错误：文档目录不存在！"
    send_alert "文档目录 /var/www/docs-web 不存在！"
fi

# 7. 检查 SSL 证书过期时间（如果使用了 Let's Encrypt）
if command -v certbot &> /dev/null; then
    CERT_EXPIRE=$(certbot certificates 2>/dev/null | grep "Expiry Date" | head -1 | awk '{print $3}')
    if [ ! -z "$CERT_EXPIRE" ]; then
        DAYS_LEFT=$(( ($(date -d "$CERT_EXPIRE" +%s) - $(date +%s)) / 86400 ))
        log "🔒 SSL 证书剩余天数: $DAYS_LEFT 天"
        
        if [ "$DAYS_LEFT" -lt 7 ]; then
            log "⚠️  警告：SSL 证书即将过期！"
            send_alert "SSL 证书将在 $DAYS_LEFT 天后过期"
        fi
    fi
fi

# 8. 检查 Nginx 错误日志
ERROR_COUNT=$(tail -100 /var/log/nginx/docs-web/error.log 2>/dev/null | wc -l)
if [ "$ERROR_COUNT" -gt 50 ]; then
    log "⚠️  Nginx 错误日志异常增多: $ERROR_COUNT 条"
fi

log "=========================================="

exit 0

