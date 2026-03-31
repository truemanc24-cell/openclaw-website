---
title: markdown formatting
description: markdown formatting 页面
---

# Markdown 格式化

# Markdown 格式化

OpenClaw 通过在渲染渠道特定输出之前将出站 Markdown 转换为共享中间表示（IR）来格式化。IR 保持源文本完整，同时携带样式/链接跨度，以便分块和渲染可以在渠道间保持一致。

## 目标

* **一致性**：一次解析，多个渲染器。
* **安全分块**：在渲染之前拆分文本，以便内联格式永远不会跨块断开。
* **渠道适配**：将相同的 IR 映射到 Slack mrkdwn、Telegram HTML 和 Signal 样式范围，而无需重新解析 Markdown。

## 管道

1. **解析 Markdown → IR**
   * IR 是纯文本加样式跨度（粗体/斜体/删除线/代码/剧透）和链接跨度。
   * 偏移量是 UTF-16 代码单元，以便 Signal 样式范围与其 API 对齐。
   * 仅在渠道选择加入表格转换时解析表格。
2. **分块 IR（格式优先）**
   * 分块在渲染之前的 IR 文本上发生。
   * 内联格式不会跨块拆分；范围按块切片。
3. **按渠道渲染**
   * **Slack**：mrkdwn 标记（粗体/斜体/删除线/代码），链接为 `<url|label>`。
   * **Telegram**：HTML 标签（`<b>`、`<i>`、`<s>`、`<code>`、`<pre><code>`、`<a href>`）。
   * **Signal**：纯文本 + `text-style` 范围；链接在标签与 URL 不同时变为 `label (url)`。

## IR 示例

输入 Markdown：

```markdown
Hello **world** — see [docs](https://docs.openclaw.ai).
```

IR（示意图）：

```json
{
  "text": "Hello world — see docs.",
  "styles": [{ "start": 6, "end": 11, "style": "bold" }],
  "links": [{ "start": 19, "end": 23, "href": "https://docs.openclaw.ai" }]
}
```

## 使用位置

* Slack、Telegram 和 Signal 出站适配器从 IR 渲染。
* 其他渠道（WhatsApp、iMessage、MS Teams、Discord）仍使用纯文本或自己的格式化规则，在启用时在分块前应用 Markdown 表格转换。

## 表格处理

Markdown 表格在聊天客户端中支持不一致。使用 `markdown.tables` 控制每个渠道（和每个账户）的转换。

* `code`：将表格渲染为代码块（大多数渠道的默认设置）。
* `bullets`：将每行转换为项目符号点（Signal + WhatsApp 的默认设置）。
* `off`：禁用表格解析和转换；原始表格文本通过。

配置键：

```yaml
channels:
  discord:
    markdown:
      tables: code
  accounts:
    work:
      markdown:
        tables: off
```

## 分块规则

* 分块限制来自渠道适配器/配置，并应用于 IR 文本。
* 代码围栏作为单个块保留，带尾随换行符，以便渠道正确渲染它们。
* 列表前缀和块引用前缀是 IR 文本的一部分，因此分块不会在中间前缀拆分。
* 内联样式（粗体/斜体/删除线/内联代码/剧透）永远不会跨块拆分；渲染器在每个块内重新打开样式。

如果您需要更多关于跨渠道分块行为的信息，请参阅[流式传输 + 分块](/concepts/streaming)。

## 链接策略

* **Slack**：`[label](url)` -> `<url|label>`；裸 URL 保持裸。自动链接在解析时禁用以避免重复链接。
* **Telegram**：`[label](url)` -> `<a href="url">label</a>`（HTML 解析模式）。
* **Signal**：`[label](url)` -> `label (url)`，除非标签与 URL 匹配。

## 剧透

剧透标记（`||spoiler||`）仅针对 Signal 解析，它们映射到 SPOILER 样式范围。其他渠道将它们视为纯文本。

## 如何添加或更新渠道格式化器

1. **一次解析**：使用共享的 `markdownToIR(...)` 辅助函数和渠道适当的选项（自动链接、标题样式、块引用前缀）。
2. **渲染**：使用 `renderMarkdownWithMarkers(...)` 和样式标记映射（或 Signal 样式范围）实现渲染器。
3. **分块**：在渲染前调用 `chunkMarkdownIR(...)`；渲染每个块。
4. **接线适配器**：更新渠道出站适配器以使用新的分块器和渲染器。
5. **测试**：添加或更新格式测试，如果渠道使用分块，则添加出站传递测试。

## 常见陷阱

* Slack 尖括号标记（`<@U123>`、`<#C123>`、`<https://...>`）必须保留；安全地转义原始 HTML。
* Telegram HTML 需要在标签外转义文本以避免破坏的标记。
* Signal 样式范围依赖于 UTF-16 偏移；不要使用代码点偏移。
* 保留围栏代码块的尾随换行符，以便关闭标记位于自己的行上。