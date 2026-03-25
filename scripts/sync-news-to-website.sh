#!/bin/bash

# 新闻同步脚本 - 将每日新闻推送到网站
# 用法：./sync-news-to-website.sh

set -e

WEBSITE_DIR="$HOME/Desktop/Mark/2026-03-12_OpenClaw_Website"
NEWS_DIR="$WEBSITE_DIR/docs/news"
MEMORY_DIR="$HOME/.openclaw/agents/main/agent/memory"

echo "🔄 开始同步新闻到网站..."

# 查找最新的新闻文件
LATEST_NEWS=$(ls -t "$MEMORY_DIR"/ai-news-*.md 2>/dev/null | head -1)

if [ -z "$LATEST_NEWS" ]; then
    echo "❌ 未找到新闻文件"
    exit 1
fi

echo "📰 找到最新新闻：$LATEST_NEWS"

# 提取日期
NEWS_DATE=$(basename "$LATEST_NEWS" | sed 's/ai-news-\(.*\)\.md/\1/')
echo "📅 新闻日期：$NEWS_DATE"

# 更新 index.md
cat > "$NEWS_DIR/index.md" << EOF
# 📰 AI 新闻日报

**最后更新**: $NEWS_DATE

---

## 🔥 今日要闻

_新闻内容来自每日推送_

[查看历史新闻档案](/news/archive)
EOF

# 更新 archive.md - 添加新条目
TEMP_FILE=$(mktemp)
cat "$NEWS_DIR/archive.md" | head -3 > "$TEMP_FILE"
echo "" >> "$TEMP_FILE"
echo "### $NEWS_DATE" >> "$TEMP_FILE"
echo "- 新闻内容已更新" >> "$TEMP_FILE"
echo "" >> "$TEMP_FILE"
cat "$NEWS_DIR/archive.md" | tail -n +4 >> "$TEMP_FILE"
mv "$TEMP_FILE" "$NEWS_DIR/archive.md"

echo "✅ 新闻同步完成"
echo "📂 更新文件:"
echo "   - $NEWS_DIR/index.md"
echo "   - $NEWS_DIR/archive.md"

# 提交到 git（如果已初始化）
if [ -d "$WEBSITE_DIR/.git" ]; then
    cd "$WEBSITE_DIR"
    git add docs/news/
    git commit -m "docs: 同步新闻 $NEWS_DATE" || true
    echo "🚀 Git 提交完成"
fi

echo "✨ 完成！"
