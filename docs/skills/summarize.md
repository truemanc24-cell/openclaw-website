---
name: summarize
description: 从 URL、播客和本地文件中总结或提取文本/转录文本（"转录此 YouTube/视频"的绝佳备选方案）。
homepage: https://summarize.sh
metadata:
  {
    "openclaw":
      {
        "emoji": "🧾",
        "requires": { "bins": ["summarize"] },
        "install":
          [
            {
              "id": "brew",
              "kind": "brew",
              "formula": "steipete/tap/summarize",
              "bins": ["summarize"],
              "label": "Install summarize (brew)",
            },
          ],
      },
  }
---

# 总结 (Summarize)

用于总结 URL、本地文件和 YouTube 链接的快速 CLI 工具。

## 使用时机（触发短语）

当用户提出以下任何请求时，立即使用此技能：

- "使用 summarize.sh"
- "这个链接/视频是关于什么的？"
- "总结此 URL/文章"
- "转录此 YouTube/视频"（尽力提取转录文本；无需 `yt-dlp`）

## 快速开始

```bash
summarize "https://example.com" --model google/gemini-3-flash-preview
summarize "/path/to/file.pdf" --model google/gemini-3-flash-preview
summarize "https://youtu.be/dQw4w9WgXcQ" --youtube auto
```

## YouTube：总结 vs 转录

尽力提取转录文本（仅限 URL）：

```bash
summarize "https://youtu.be/dQw4w9WgXcQ" --youtube auto --extract-only
```

如果用户要求转录文本但内容很长，先返回一个精简的总结，然后询问用户希望扩展哪个部分/时间范围。

## 模型 + 密钥

为您选择的提供商设置 API 密钥：

- OpenAI：`OPENAI_API_KEY`
- Anthropic：`ANTHROPIC_API_KEY`
- xAI：`XAI_API_KEY`
- Google：`GEMINI_API_KEY`（别名：`GOOGLE_GENERATIVE_AI_API_KEY`、`GOOGLE_API_KEY`）

默认模型为 `google/gemini-3-flash-preview`（如果未设置）。

## 有用的参数

- `--length short|medium|long|xl|xxl|<chars>`
- `--max-output-tokens <count>`
- `--extract-only`（仅限 URL）
- `--json`（机器可读）
- `--firecrawl auto|off|always`（备用提取）
- `--youtube auto`（如果设置了 `APIFY_API_TOKEN`，则使用 Apify 备用方案）

## 配置

可选配置文件：`~/.summarize/config.json`

```json
{ "model": "openai/gpt-5.2" }
```

可选服务：

- 阻止站点的 `FIRECRAWL_API_KEY`
- YouTube 备用方案的 `APIFY_API_TOKEN`