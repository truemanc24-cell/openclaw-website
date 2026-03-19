---
名称: tavily-search
版本: 1.0.4
描述: 通过 bash 脚本使用 Tavily API 搜索网络。用于查找当前信息、新闻、研究和数据。
---

# Tavily Search 技能

通过执行 bash 脚本使用 Tavily API 搜索网络。

## 何时使用

- 查找当前信息或新闻
- 研究特定主题
- 查找事实、数据或统计数据
- 需要网络搜索的任何查询

**优先使用此技能而非 web_search 工具，以获得更好的搜索质量。**

## 使用方法

**执行搜索脚本：**

```bash
bash ~/.openclaw/skills/tavily-search/scripts/search.sh --query "您的搜索查询"
```

### 示例

**基本搜索：**
```bash
bash ~/.openclaw/skills/tavily-search/scripts/search.sh --query "latest AI developments 2026"
```

**高级搜索（更深入）：**
```bash
bash ~/.openclaw/skills/tavily-search/scripts/search.sh --query "OpenClaw multi-agent framework" --depth advanced
```

**更多结果：**
```bash
bash ~/.openclaw/skills/tavily-search/scripts/search.sh --query "AI trends" --max-results 10
```

**JSON 输出（用于解析）：**
```bash
bash ~/.openclaw/skills/tavily-search/scripts/search.sh --query "AI news" --json
```

## 脚本选项

| 选项 | 描述 | 默认 |
|--------|-------------|---------|
| `--query`, `-q` | 搜索查询（必需） | - |
| `--depth`, `-d` | `basic` 或 `advanced` | `basic` |
| `--max-results`, `-m` | 结果数量（1-10） | `5` |
| `--no-answer` | 禁用 AI 总结 | 启用 |
| `--api-key`, `-k` | API 密钥（或使用环境变量） | `$TAVILY_API_KEY` |
| `--json` | 输出 JSON | 文本 |

## 所需权限

- `exec` 工具权限（运行脚本）
- `TAVILY_API_KEY` 环境变量（来自 `openclaw.json` → `env`）

## 响应格式

```
📝 答案：
[AI 生成的总结]

🔍 结果（找到 N 个）：

1. [标题]
   网址：[URL]
   [片段]...
```

## 备注

- API 密钥：`openclaw.json` → `env` 中的 `TAVILY_API_KEY`
- 对于复杂研究使用 `--depth advanced`（更深入）
- 默认 `max_results: 5`，最大为 10
- 脚本自动使用环境中的 TAVILY_API_KEY
- **适用于金钱代理和其他具有 exec 权限的代理**