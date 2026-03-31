---
title: streaming
description: streaming 页面
---

# 流式传输 + 分块

# 流式传输 + 分块

OpenClaw 有两个独立的流式传输层：

* **块流式传输（渠道）：** 在助手编写时发出完成的**块**。这些是正常的渠道消息（不是令牌增量）。
* **预览流式传输（Telegram/Discord/Slack）：** 在生成时更新临时**预览消息**。

目前**没有真正的令牌增量流式传输**到渠道消息。预览流式传输是基于消息的（发送 + 编辑/追加）。

## 块流式传输（渠道消息）

块流式传输以粗块形式发送助手输出，因为它变得可用。

```
Model output
  └─ text_delta/events
       ├─ (blockStreamingBreak=text_end)
       │    └─ chunker emits blocks as buffer grows
       └─ (blockStreamingBreak=message_end)
            └─ chunker flushes at message_end
                   └─ channel send (block replies)
```

图例：

* `text_delta/events`：模型流事件（非流式模型可能稀疏）。
* `chunker`：`EmbeddedBlockChunker` 应用最小/最大边界 + 断点偏好。
* `channel send`：实际出站消息（块回复）。

**控制：**

* `agents.defaults.blockStreamingDefault`：`"on"`/`"off"`（默认关闭）。
* 渠道覆盖：`*.blockStreaming`（和每账户变体）强制每渠道 `"on"`/`"off"`。
* `agents.defaults.blockStreamingBreak`：`"text_end"` 或 `"message_end"`。
* `agents.defaults.blockStreamingChunk`：{ `minChars`, `maxChars`, `breakPreference?` }。
* `agents.defaults.blockStreamingCoalesce`：{ `minChars?`, `maxChars?`, `idleMs?` }（在发送前合并流式块）。
* 渠道硬上限：`*.textChunkLimit`（例如 `channels.whatsapp.textChunkLimit`）。
* 渠道分块模式：`*.chunkMode`（`length` 默认，`newline` 在长度分块前在空行（段落边界）处拆分）。
* Discord 软上限：`channels.discord.maxLinesPerMessage`（默认 17）拆分高回复以避免 UI 剪裁。

**边界语义：**

* `text_end`：chunker 发出时立即流式传输块；在每个 `text_end` 时刷新。
* `message_end`：等待助手消息完成，然后刷新缓冲输出。

`message_end` 仍使用 chunker 如果缓冲文本超过 `maxChars`，因此它可以在末尾发出多个块。

## 分块算法（低/高边界）

块分块由 `EmbeddedBlockChunker` 实现：

* **低边界：** 直到缓冲区 >= `minChars` 才发出（除非强制）。
* **高边界：** 优先在 `maxChars` 之前拆分；如强制，则在 `maxChars` 处拆分。
* **断点偏好：** `paragraph` → `newline` → `sentence` → `whitespace` → 硬断。
* **代码围栏：** 永远不在围栏内拆分；如在 `maxChars` 强制，关闭 + 重新打开围栏以保持 Markdown 有效。

`maxChars` 被限制为渠道 `textChunkLimit`，因此您不能超过每渠道上限。

## 合并（合并流式传输块）

启用块流式传输时，OpenClaw 可以在发送前**合并连续的块**。这减少了"单行垃圾"同时仍提供渐进输出。

* 合并等待**空闲间隙**（`idleMs`）后再刷新。
* 缓冲区以 `maxChars` 为上限，如果超过则会刷新。
* `minChars` 防止小片段发送直到积累足够文本（最终刷新总是发送剩余文本）。
* 连接器来自 `blockStreamingChunk.breakPreference`（`paragraph` → `\n\n`，`newline` → `\n`，`sentence` → space）。
* 渠道覆盖可通过 `*.blockStreamingCoalesce` 获得（包括每账户配置）。
* 默认合并 `minChars` 对于 Signal/Slack/Discord 增加到 1500，除非覆盖。

## 块之间的人性化节奏

启用块流式传输时，您可以在块回复之间添加**随机暂停**（第一个块之后）。这使多气泡响应感觉更自然。

* 配置：`agents.defaults.humanDelay`（通过 `agents.list[].humanDelay` 每代理覆盖）。
* 模式：`off`（默认）、`natural`（800-2500ms）、`custom`（`minMs`/`maxMs`）。
* 仅适用于**块回复**，而不是最终回复或工具摘要。

## "流式传输块或全部"

这映射到：

* **流式传输块：** `blockStreamingDefault: "on"` + `blockStreamingBreak: "text_end"`（边走边发出）。非 Telegram 渠道也需要 `*.blockStreaming: true`。
* **最后流式传输全部：** `blockStreamingBreak: "message_end"`（刷新一次，如果很长可能会多个块）。
* **无块流式传输：** `blockStreamingDefault: "off"`（仅最终回复）。

**渠道注意：** 块流式传输**关闭除非** `*.blockStreaming` 明确设置为 `true`。渠道可以在没有块回复的情况下流式传输实时预览（`channels.<channel>.streaming`）。

配置位置提醒：`blockStreaming*` 默认在 `agents.defaults` 下，而不是根配置。

## 预览流式传输模式

规范键：`channels.<channel>.streaming`

模式：

* `off`：禁用预览流式传输。
* `partial`：被最新文本替换的单个预览。
* `block`：分块/追加步骤的预览更新。
* `progress`：生成期间的进度/状态预览，完成时为最终答案。

### 渠道映射

| 渠道   | `off` | `partial` | `block` | `progress`        |
| ------ | ----- | --------- | ------- | ----------------- |
| Telegram | ✅     | ✅         | ✅       | 映射到 `partial` |
| Discord  | ✅     | ✅         | ✅       | 映射到 `partial` |
| Slack    | ✅     | ✅         | ✅       | ✅                 |

仅 Slack：

* `channels.slack.nativeStreaming` 在 `streaming=partial` 时切换 Slack 本地流式传输 API 调用（默认：`true`）。

旧键迁移：

* Telegram：`streamMode` + 布尔 `streaming` 自动迁移到 `streaming` 枚举。
* Discord：`streamMode` + 布尔 `streaming` 自动迁移到 `streaming` 枚举。
* Slack：`streamMode` 自动迁移到 `streaming` 枚举；布尔 `streaming` 自动迁移到 `nativeStreaming`。

### 运行时行为

Telegram：

* 使用 `sendMessage` + `editMessageText` 预览更新，跨 DM 和群组/主题。
* 当明确启用 Telegram 块流式传输时跳过预览流式传输（避免双重流式传输）。
* `/reasoning stream` 可以将推理写入预览。

Discord：

* 使用发送 + 编辑预览消息。
* `block` 模式使用草稿分块（`draftChunk`）。
* 当明确启用 Discord 块流式传输时跳过预览流式传输。

Slack：

* `partial` 可以在可用时使用 Slack 本地流式传输（`chat.startStream`/`append`/`stop`）。
* `block` 使用追加样式草稿预览。
* `progress` 使用状态预览文本，然后是最终答案。