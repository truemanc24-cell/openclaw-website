---
名称: nano-banana-pro
描述: 使用 Nano Banana Pro（Gemini 3 Pro Image）生成/编辑图像。用于图像创建/修改请求，包括编辑。支持文本到图像 + 图像到图像；1K/2K/4K；使用 --input-image。
---

# Nano Banana Pro 图像生成与编辑

使用 Google 的 Nano Banana Pro API（Gemini 3 Pro Image）生成新图像或编辑现有图像。

## 使用方法

使用绝对路径运行脚本（不要先 cd 到技能目录）：

**生成新图像：**
```bash
uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py --prompt "您的图像描述" --filename "output-name.png" [--resolution 1K|2K|4K] [--api-key KEY]
```

**编辑现有图像：**
```bash
uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py --prompt "编辑指令" --filename "output-name.png" --input-image "path/to/input.png" [--resolution 1K|2K|4K] [--api-key KEY]
```

**重要：**始终从用户的当前工作目录运行，这样图像会保存在用户正在工作的位置，而不是技能目录中。

## 默认工作流（草稿 → 迭代 → 定稿）

目标：在提示正确之前快速迭代，避免在 4K 上浪费时间。

- 草稿（1K）：快速反馈循环
  - `uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py --prompt "<草稿提示>" --filename "yyyy-mm-dd-hh-mm-ss-draft.png" --resolution 1K`
- 迭代：小幅调整提示；每次运行保持文件名新颖
  - 如果是编辑：保持相同的 `--input-image` 进行每次迭代，直到满意为止。
- 定稿（4K）：仅当提示确定后
  - `uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py --prompt "<最终提示>" --filename "yyyy-mm-dd-hh-mm-ss-final.png" --resolution 4K`

## 分辨率选项

Gemini 3 Pro Image API 支持三种分辨率（需要大写 K）：

- **1K**（默认）- 约 1024px 分辨率
- **2K** - 约 2048px 分辨率
- **4K** - 约 4096px 分辨率

将用户请求映射到 API 参数：
- 未提及分辨率 → `1K`
- "低分辨率"、"1080"、"1080p"、"1K" → `1K`
- "2K"、"2048"、"正常"、"中等分辨率" → `2K`
- "高分辨率"、"高解析度"、"hi-res"、"4K"、"超高清" → `4K`

## API 密钥

脚本按以下顺序检查 API 密钥：
1. `--api-key` 参数（如果在聊天中提供了密钥）
2. `GEMINI_API_KEY` 环境变量

如果两者都不可用，脚本将退出并显示错误消息。

## 预检 + 常见失败（快速修复）

- 预检：
  - `command -v uv`（必须存在）
  - `test -n "$GEMINI_API_KEY"`（或传递 `--api-key`）
  - 如果是编辑：`test -f "path/to/input.png"`

- 常见失败：
  - `Error: No API key provided.` → 设置 `GEMINI_API_KEY` 或传递 `--api-key`
  - `Error loading input image:` → 路径错误/文件不可读；验证 `--input-image` 指向真实的图像
  - "quota/permission/403" 风格的 API 错误 → 密钥错误、无访问权限或配额超出；尝试不同的密钥/账户

## 文件名生成

使用模式生成文件名：`yyyy-mm-dd-hh-mm-ss-name.png`

**格式：**`{时间戳}-{描述性名称}.png`
- 时间戳：当前日期/时间，格式为 `yyyy-mm-dd-hh-mm-ss`（24 小时制）
- 名称：描述性的小写文本，用连字符
- 保持描述部分简洁（通常 1-5 个词）
- 使用用户提示或对话中的上下文
- 如果不清楚，使用随机标识符（例如 `x9k2`、`a7b3`）

示例：
- 提示 "A serene Japanese garden" → `2025-11-23-14-23-05-japanese-garden.png`
- 提示 "sunset over mountains" → `2025-11-23-15-30-12-sunset-mountains.png`
- 提示 "create an image of a robot" → `2025-11-23-16-45-33-robot.png`
- 上下文不清楚 → `2025-11-23-17-12-48-x9k2.png`

## 图像编辑

当用户想要修改现有图像时：
1. 检查他们是否提供了图像路径或引用了当前目录中的图像
2. 使用 `--input-image` 参数并提供图像路径
3. 提示应包含编辑指令（例如 "让天空更戏剧化"、"移除人物"、"改为卡通风格"）
4. 常见编辑任务：添加/删除元素、更改风格、调整颜色、模糊背景等

## 提示处理

**对于生成：**直接将用户的图像描述传递给 `--prompt`。只有明显不足时才重新修改。

**对于编辑：**在 `--prompt` 中传递编辑指令（例如 "在天空中添加彩虹"、"让它看起来像水彩画"）

在两种情况下都保留用户的创意意图。

## 高命中率的提示模板

当用户表达模糊或编辑必须精确时使用模板。

- 生成模板：
  - "创建图像：<主体>。风格：<风格>。构图：<相机/镜头>。光线：<光线>。背景：<背景>。配色：<调色板>。避免：<列表>。"

- 编辑模板（保留其他所有内容）：
  - "仅更改：<单一更改>。保持不变：主体、构图/裁剪、姿势、光线、配色、背景、文本和整体风格。不要添加新对象。如果存在文本，保持不变。"

## 输出

- 将 PNG 保存到当前目录（如果文件名包含目录，则保存到指定路径）
- 脚本输出生成的图像的完整路径
- **不要回读图像** - 只告知用户保存的路径

## 示例

**生成新图像：**
```bash
uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py --prompt "A serene Japanese garden with cherry blossoms" --filename "2025-11-23-14-23-05-japanese-garden.png" --resolution 4K
```

**编辑现有图像：**
```bash
uv run ~/.codex/skills/nano-banana-pro/scripts/generate_image.py --prompt "make the sky more dramatic with storm clouds" --filename "2025-11-23-14-25-30-dramatic-sky.png" --input-image "original-photo.jpg" --resolution 2K
```