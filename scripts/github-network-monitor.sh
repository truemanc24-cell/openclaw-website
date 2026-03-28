#!/bin/bash

# GitHub 网络监听 + 自动推送脚本
# 每 5 分钟检查一次，网络恢复时自动推送

LOG_FILE="$HOME/Desktop/Mark/2026-03-12_OpenClaw_Website/network-monitor.log"
PROJECT_DIR="$HOME/Desktop/Mark/2026-03-12_OpenClaw_Website"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
  echo "$1"
}

log "🚀 启动 GitHub 网络监听..."

while true; do
  # 检查 GitHub 连接
  if curl -s -m 5 https://github.com > /dev/null 2>&1; then
    log "✅ GitHub 网络恢复！"
    
    cd "$PROJECT_DIR"
    
    # 检查 git 状态
    STATUS=$(git status --porcelain 2>&1)
    AHEAD=$(git rev-list --count HEAD ^origin/main 2>/dev/null || echo "0")
    
    if [ "$AHEAD" -gt 0 ] || [ -n "$STATUS" ]; then
      log "📦 有待推送内容 ($AHEAD commits)"
      
      # 添加并提交未提交的文件
      if [ -n "$STATUS" ]; then
        git add -A
        git commit -m "auto: 网络恢复自动提交"
        log "📝 已提交本地更改"
      fi
      
      # 推送
      if git push origin main 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ 推送成功！"
      else
        log "❌ 推送失败"
      fi
    else
      log "📦 无待推送内容"
    fi
    
    # 等待 5 分钟后退出（让 cron 重新调度）
    sleep 300
    break
  else
    log "⏳ GitHub 无法访问，5 分钟后重试..."
    sleep 300
  fi
done
