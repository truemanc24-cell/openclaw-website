#!/usr/bin/env python3
"""
AI Content Generator CLI
为社交媒体免费生成图片和视频内容
"""

import typer
import yaml
import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = typer.Typer(help="AI 内容生成工具 - 为社交媒体免费生成图片和视频")

# 配置
CONFIG_FILE = Path(__file__).parent / "config.yaml"
OUTPUT_BASE = Path(__file__).parent / "outputs"


def load_config():
    """加载配置文件"""
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {}


def get_output_dir(type_: str):
    """获取输出目录"""
    today = datetime.now().strftime("%Y-%m-%d")
    output_dir = OUTPUT_BASE / type_ / today
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir


def generate_filename(provider: str, prompt: str, ext: str):
    """生成文件名"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    # 简化提示词作为文件名的一部分
    safe_prompt = "".join(c for c in prompt[:30] if c.isalnum() or c in " _-").strip()
    return f"{timestamp}_{provider}_{safe_prompt}.{ext}"


@app.command()
def quota(provider: str = typer.Option(None, help="服务商名称")):
    """查看 API 配额"""
    config = load_config()
    
    quotas = {
        "playground": {
            "name": "Playground AI",
            "daily_limit": 500,
            "type": "images",
            "reset": "每日 0 点重置"
        },
        "leonardo": {
            "name": "Leonardo.ai",
            "daily_limit": 150,
            "type": "images",
            "reset": "每日 0 点重置"
        },
        "seaart": {
            "name": "SeaArt.ai",
            "daily_limit": 100,
            "type": "images",
            "reset": "每日 0 点重置"
        },
        "cogvideo": {
            "name": "智谱 AI CogVideo",
            "daily_limit": "新用户赠送积分",
            "type": "videos",
            "reset": "一次性试用"
        },
        "replicate": {
            "name": "Replicate",
            "daily_limit": "$5 试用额度",
            "type": "videos",
            "reset": "一次性试用"
        }
    }
    
    if provider:
        if provider in quotas:
            q = quotas[provider]
            typer.echo(f"\n{q['name']}")
            typer.echo(f"  类型：{q['type']}")
            typer.echo(f"  免费额度：{q['daily_limit']}")
            typer.echo(f"  重置：{q['reset']}")
            
            # 检查 API 密钥
            key_var = f"{provider.upper()}_API_KEY"
            if provider == "replicate":
                key_var = "REPLICATE_API_TOKEN"
            
            if os.getenv(key_var):
                typer.echo(f"  ✅ API 密钥已配置")
            else:
                typer.echo(f"  ⚠️  API 密钥未配置（检查 .env 文件）")
        else:
            typer.echo(f"未知服务商：{provider}")
            typer.echo(f"可用服务商：{', '.join(quotas.keys())}")
    else:
        typer.echo("\n📊 API 配额总览\n")
        typer.echo("=" * 60)
        
        for key, q in quotas.items():
            typer.echo(f"\n{q['name']} ({key})")
            typer.echo(f"  类型：{q['type']}")
            typer.echo(f"  免费额度：{q['daily_limit']}")
            typer.echo(f"  重置：{q['reset']}")
        
        typer.echo("\n" + "=" * 60)
        typer.echo("\n💡 提示：使用 --provider 查看详细配置状态")


@app.command()
def generate(
    type_: str = typer.Argument(..., help="生成类型：image 或 video"),
    prompt: str = typer.Option(..., help="生成提示词"),
    provider: str = typer.Option("auto", help="服务商：auto, playground, leonardo, cogvideo, replicate"),
    count: int = typer.Option(1, help="生成数量（仅图片）"),
    width: int = typer.Option(1024, help="图片宽度（仅图片）"),
    height: int = typer.Option(1024, help="图片高度（仅图片）"),
    duration: int = typer.Option(5, help="视频时长（秒，仅视频）"),
    image: str = typer.Option(None, help="输入图片路径（图生视频）"),
    output_dir: str = typer.Option(None, help="输出目录"),
):
    """生成图片或视频"""
    
    if type_ not in ["image", "video"]:
        typer.echo(f"❌ 错误：类型必须是 image 或 video")
        raise typer.Exit(1)
    
    typer.echo(f"\n🎨 开始生成 {type_}")
    typer.echo(f"提示词：{prompt}")
    typer.echo(f"服务商：{provider}")
    
    # 确定输出目录
    if output_dir:
        out_path = Path(output_dir)
    else:
        out_path = get_output_dir(type_ + "s")
    
    typer.echo(f"输出目录：{out_path}")
    
    # TODO: 实现实际的 API 调用
    typer.echo("\n⚠️  注意：这是演示版本，需要配置 API 密钥后才能使用")
    typer.echo("\n配置步骤：")
    typer.echo("1. 复制 .env.example 为 .env")
    typer.echo("2. 编辑 .env 文件，填入你的 API 密钥")
    typer.echo("3. 重新运行此命令")
    typer.echo("\n获取 API 密钥：")
    typer.echo("  - Playground AI: https://playgroundai.com/")
    typer.echo("  - Leonardo.ai: https://leonardo.ai/")
    typer.echo("  - 智谱 AI: https://open.bigmodel.cn/")
    typer.echo("  - Replicate: https://replicate.com/")
    
    # 创建示例输出文件（演示用）
    if type_ == "image":
        filename = generate_filename("demo", prompt, "txt")
        output_file = out_path / filename
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(f"提示词：{prompt}\n")
            f.write(f"尺寸：{width}x{height}\n")
            f.write(f"数量：{count}\n")
            f.write(f"生成时间：{datetime.now().isoformat()}\n")
        typer.echo(f"\n✅ 演示文件已保存：{output_file}")
    else:
        filename = generate_filename("demo", prompt, "txt")
        output_file = out_path / filename
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(f"提示词：{prompt}\n")
            f.write(f"时长：{duration}秒\n")
            if image:
                f.write(f"输入图片：{image}\n")
            f.write(f"生成时间：{datetime.now().isoformat()}\n")
        typer.echo(f"\n✅ 演示文件已保存：{output_file}")


@app.command()
def providers():
    """列出所有支持的服务商"""
    typer.echo("\n📋 支持的服务商\n")
    typer.echo("=" * 60)
    
    typer.echo("\n🖼️  图片生成：")
    typer.echo("  • playground  - Playground AI (500 张/天)")
    typer.echo("  • leonardo    - Leonardo.ai (150 张/天)")
    typer.echo("  • seaart      - SeaArt.ai (100 张/天)")
    typer.echo("  • hf          - Hugging Face Spaces (免费，慢)")
    
    typer.echo("\n🎬 视频生成：")
    typer.echo("  • cogvideo    - 智谱 AI CogVideo (新用户赠送)")
    typer.echo("  • replicate   - Replicate ($5 试用)")
    typer.echo("  • hf          - Hugging Face Spaces (免费，慢)")
    
    typer.echo("\n" + "=" * 60)
    typer.echo("\n💡 使用 --provider auto 自动选择可用服务商")


@app.command()
def init():
    """初始化配置文件"""
    typer.echo("🔧 初始化配置...\n")
    
    # 创建 .env.example
    env_example = Path(__file__).parent / ".env.example"
    env_content = """# AI Content Generator - 环境变量配置
# 复制此文件为 .env 并填入你的 API 密钥

# Playground AI (https://playgroundai.com/)
# 免费额度：500 张/天
PLAYGROUND_API_KEY=your_playground_api_key_here

# Leonardo.ai (https://leonardo.ai/)
# 免费额度：150 张/天
LEONARDO_API_KEY=your_leonardo_api_key_here

# SeaArt.ai (https://www.seaart.ai/)
# 免费额度：100 张/天
SEAART_API_KEY=your_seaart_api_key_here

# 智谱 AI (https://open.bigmodel.cn/)
# 免费额度：新用户赠送积分
ZHIPU_API_KEY=your_zhipu_api_key_here

# Replicate (https://replicate.com/)
# 免费额度：$5 试用
REPLICATE_API_TOKEN=your_replicate_token_here
"""
    
    with open(env_example, "w", encoding="utf-8") as f:
        f.write(env_content)
    typer.echo(f"✅ 创建 {env_example}")
    
    # 创建 config.yaml
    config = {
        "providers": {
            "playground": {
                "enabled": True,
                "daily_limit": 500,
                "priority": 1
            },
            "leonardo": {
                "enabled": True,
                "daily_limit": 150,
                "priority": 2
            },
            "seaart": {
                "enabled": True,
                "daily_limit": 100,
                "priority": 3
            },
            "cogvideo": {
                "enabled": True,
                "trial_credits": 100,
                "priority": 1
            },
            "replicate": {
                "enabled": True,
                "trial_credits": 5.0,
                "priority": 2
            }
        },
        "defaults": {
            "image": {
                "width": 1024,
                "height": 1024,
                "provider": "auto"
            },
            "video": {
                "duration": 5,
                "provider": "auto"
            }
        },
        "output": {
            "base_dir": "./outputs",
            "organize_by_date": True
        }
    }
    
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        yaml.dump(config, f, allow_unicode=True, default_flow_style=False)
    typer.echo(f"✅ 创建 {CONFIG_FILE}")
    
    # 创建输出目录
    OUTPUT_BASE.mkdir(exist_ok=True)
    (OUTPUT_BASE / "images").mkdir(exist_ok=True)
    (OUTPUT_BASE / "videos").mkdir(exist_ok=True)
    typer.echo(f"✅ 创建输出目录：{OUTPUT_BASE}")
    
    typer.echo("\n✅ 初始化完成！")
    typer.echo("\n下一步：")
    typer.echo("1. 复制 .env.example 为 .env")
    typer.echo("2. 编辑 .env 文件，填入你的 API 密钥")
    typer.echo("3. 运行：python main.py quota")
    typer.echo("4. 开始生成：python main.py generate image --prompt '你的提示词'")


if __name__ == "__main__":
    app()
