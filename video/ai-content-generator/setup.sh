#!/bin/bash
# AI Content Generator - 快速开始脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🎨 AI Content Generator - 快速开始"
echo "=================================="
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：需要 Python 3"
    echo "请安装 Python 3.10 或更高版本"
    exit 1
fi

echo "✅ Python 版本：$(python3 --version)"
echo ""

# 创建虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
    echo "✅ 虚拟环境已创建"
else
    echo "✅ 虚拟环境已存在"
fi
echo ""

# 激活虚拟环境
echo "🔌 激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo "📥 安装依赖..."
pip install -q -r requirements.txt
echo "✅ 依赖安装完成"
echo ""

# 初始化配置
if [ ! -f ".env" ]; then
    echo "🔧 初始化配置文件..."
    python main.py init
    echo ""
    echo "⚠️  请编辑 .env 文件，填入你的 API 密钥"
    echo ""
    echo "获取 API 密钥："
    echo "  • Playground AI: https://playgroundai.com/"
    echo "  • Leonardo.ai: https://leonardo.ai/"
    echo "  • 智谱 AI: https://open.bigmodel.cn/"
    echo "  • Replicate: https://replicate.com/"
    echo ""
else
    echo "✅ 配置文件已存在"
fi

echo ""
echo "=================================="
echo "🎉 安装完成！"
echo ""
echo "下一步："
echo "  1. 编辑 .env 文件，填入 API 密钥"
echo "  2. 运行：python main.py quota"
echo "  3. 生成图片：python main.py generate image --prompt '一只可爱的猫咪'"
echo "  4. 生成视频：python main.py generate video --prompt '海浪拍打沙滩'"
echo ""
echo "查看帮助：python main.py --help"
echo "=================================="
