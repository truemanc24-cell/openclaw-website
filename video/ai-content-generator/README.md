# AI Content Generator CLI

为社交媒体免费生成图片和视频内容的命令行工具。

## 功能特性

- ✅ 支持多个免费 API 服务商
- ✅ 自动轮换服务商以最大化免费额度
- ✅ 简单的命令行界面
- ✅ 批量生成支持
- ✅ 自动下载和保存结果

## 支持的服务商

### 图片生成
| 服务商 | 免费额度 | 说明 |
|--------|----------|------|
| Playground AI | 500 张/天 | 基于 SDXL，质量好 |
| Leonardo.ai | 150 张/天 | 多种模型可选 |
| SeaArt.ai | 100 张/天 | 亚洲风格优秀 |
| Hugging Face | 无限（慢） | 需要排队 |

### 视频生成
| 服务商 | 免费额度 | 说明 |
|--------|----------|------|
| 智谱 AI CogVideo | 新用户赠送 | 5-10 秒视频 |
| Replicate | $5 试用 | SVD/AnimateDiff |
| Hugging Face | 免费（慢） | 需要排队 |

## 快速开始

### 1. 安装依赖

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. 配置 API 密钥

复制 `.env.example` 为 `.env` 并填写你的 API 密钥：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# Playground AI (https://playgroundai.com/)
PLAYGROUND_API_KEY=your_key_here

# Leonardo.ai (https://leonardo.ai/)
LEONARDO_API_KEY=your_key_here

# 智谱 AI (https://open.bigmodel.cn/)
ZHIPU_API_KEY=your_key_here

# Replicate (https://replicate.com/)
REPLICATE_API_TOKEN=your_token_here
```

### 3. 使用示例

#### 生成图片

```bash
# 简单生成
python main.py generate image --prompt "一只可爱的猫咪，高清"

# 指定服务商
python main.py generate image --prompt "赛博朋克城市夜景" --provider playground

# 批量生成
python main.py generate image --prompt "森林中的小屋" --count 5

# 指定尺寸
python main.py generate image --prompt "人物肖像" --width 1024 --height 1024
```

#### 生成视频

```bash
# 文本转视频
python main.py generate video --prompt "海浪拍打沙滩，4K 高清"

# 图片转视频
python main.py generate video --image input.jpg --prompt "微动效果"

# 指定时长
python main.py generate video --prompt "烟花绽放" --duration 5
```

#### 查看配额

```bash
# 查看所有服务商配额
python main.py quota

# 查看指定服务商
python main.py quota --provider playground
```

## 命令行参数

### 生成图片
```
usage: main.py generate image [-h] --prompt PROMPT [--provider PROVIDER]
                              [--count COUNT] [--width WIDTH] [--height HEIGHT]
                              [--output-dir OUTPUT_DIR]

options:
  -h, --help            show this help message and exit
  --prompt PROMPT       生成提示词（必填）
  --provider PROVIDER   服务商：playground, leonardo, seaart, auto (默认：auto)
  --count COUNT         生成数量（默认：1）
  --width WIDTH         图片宽度（默认：1024）
  --height HEIGHT       图片高度（默认：1024）
  --output-dir OUTPUT_DIR  输出目录（默认：./outputs/images）
```

### 生成视频
```
usage: main.py generate video [-h] --prompt PROMPT [--image IMAGE]
                              [--provider PROVIDER] [--duration DURATION]
                              [--output-dir OUTPUT_DIR]

options:
  -h, --help            show this help message and exit
  --prompt PROMPT       生成提示词（必填）
  --image IMAGE         输入图片路径（可选，用于图生视频）
  --provider PROVIDER   服务商：cogvideo, replicate, auto (默认：auto)
  --duration DURATION   视频时长（秒，默认：5）
  --output-dir OUTPUT_DIR  输出目录（默认：./outputs/videos）
```

### 查看配额
```
usage: main.py quota [-h] [--provider PROVIDER]

options:
  -h, --help            show this help message and exit
  --provider PROVIDER   服务商名称（可选，默认显示所有）
```

## 输出目录结构

```
outputs/
├── images/
│   ├── 2026-03-14/
│   │   ├── 20260314_031500_playground_可爱猫咪.png
│   │   └── 20260314_031600_leonardo_赛博朋克.png
│   └── 2026-03-15/
└── videos/
    ├── 2026-03-14/
    │   └── 20260314_032000_cogvideo_海浪.mp4
    └── 2026-03-15/
```

## 提示词技巧

### 高质量图片提示词模板

```
[主体描述]，[环境/背景]，[风格]，[光线]，[构图]，[质量词]

示例：
- 一只可爱的布偶猫，坐在窗台上，阳光洒在身上，写实风格，自然光，特写镜头，8K 高清
- 赛博朋克城市夜景，霓虹灯闪烁，未来主义，电影级光效，广角镜头，超精细细节
```

### 视频提示词模板

```
[场景描述]，[动作/变化]，[风格]，[时长感]

示例：
- 海浪轻柔拍打沙滩，水花飞溅，写实风格，慢动作
- 樱花花瓣随风飘落，旋转飞舞，唯美风格，5 秒循环
```

## 故障排除

### 常见问题

**Q: API 调用失败**
A: 检查 `.env` 文件中的 API 密钥是否正确，网络连接是否正常

**Q: 生成速度慢**
A: 免费服务可能需要排队，尝试切换到其他服务商

**Q: 图片质量不佳**
A: 尝试优化提示词，添加质量词如"8K"、"超精细"、"专业摄影"

**Q: 配额用尽**
A: 使用 `python main.py quota` 查看剩余额度，等待次日重置或切换到其他服务商

## 开发计划

- [ ] 添加更多免费 API 服务商
- [ ] 支持提示词优化建议
- [ ] 添加图片后处理（放大、修复）
- [ ] 支持批量任务队列
- [ ] Web UI 界面

## 许可证

MIT License

## 反馈与支持

如有问题或建议，请提交 Issue。
