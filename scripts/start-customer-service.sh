#!/bin/bash

# OpenClaw 客服 API v2 启动脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "🚀 启动 OpenClaw 智能客服 API v2..."
echo ""

# 检查索引文件
if [ ! -f "scripts/content-index.json" ]; then
  echo "⚠️  索引文件不存在，正在构建..."
  node scripts/content-indexer.js
  echo ""
fi

# 启动 API 服务
echo "📍 服务地址：http://localhost:3456"
echo "💡 健康检查：http://localhost:3456/health"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

node scripts/customer-service-api-v2.js
