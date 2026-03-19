---
name: bluebubbles
description: 当你需要通过 BlueBubbles（推荐的 iMessage 集成）发送或管理 iMessages 时使用。调用通过通用 message 工具进行，channel="bluebubbles"。
metadata: { "openclaw": { "emoji": "🫧", "requires": { "config": ["channels.bluebubbles"] } } }
---

# BlueBubbles 操作

## 概述

BlueBubbles 是 OpenClaw 推荐的 iMessage 集成。使用 `message` 工具，channel: "bluebubbles" 来发送消息和管理 iMessage 对话：发送短信和附件、反应（tapbacks）、编辑/撤回、在话题中回复以及管理群组参与者/名称/图标。

## 需要收集的输入

- `target`（优先使用 `chat_guid:...`；也支持 `+15551234567` 格式或 `user@example.com`）
- 发送/编辑/回复的 `message` 文本
- 反应/编辑/撤回/回复的 `messageId`
- 附件的本地文件 `path`，或 base64 的 `buffer` + `filename`

如果用户模糊（例如"给我妈妈发短信"），请询问接收者的 handle 或 chat guid 以及确切的消息内容。

## 操作

### 发送消息

```json
{
  "action": "send",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "message": "hello from OpenClaw"
}
```

### 反应（tapback）

```json
{
  "action": "react",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "messageId": "<message-guid>",
  "emoji": "❤️"
}
```

### 移除反应

```json
{
  "action": "react",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "messageId": "<message-guid>",
  "emoji": "❤️",
  "remove": true
}
```

### 编辑之前发送的消息

```json
{
  "action": "edit",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "messageId": "<message-guid>",
  "message": "updated text"
}
```

### 撤回消息

```json
{
  "action": "unsend",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "messageId": "<message-guid>"
}
```

### 回复特定消息

```json
{
  "action": "reply",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "replyTo": "<message-guid>",
  "message": "replying to that"
}
```

### 发送附件

```json
{
  "action": "sendAttachment",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "path": "/tmp/photo.jpg",
  "caption": "here you go"
}
```

### 发送带 iMessage 效果的消息

```json
{
  "action": "sendWithEffect",
  "channel": "bluebubbles",
  "target": "+15551234567",
  "message": "big news",
  "effect": "balloons"
}
```

## 备注

- 需要 gateway 配置 `channels.bluebubbles`（serverUrl/password/webhookPath）。
- 优先使用 `chat_guid` 目标（特别是对于群组聊天）。
- BlueBubbles 支持丰富的操作，但一些操作取决于 macOS 版本（例如，编辑在 macOS 26 Tahoe 上可能有问题）。
- gateway 可能同时暴露短和完整的消息 ID；完整 ID 在重启之间更持久。
- 底层插件的开发人员参考位于 `extensions/bluebubbles/README.md`。

## 尝试的想法

- 用 tapback 反应来确认请求。
- 当用户引用特定消息时在话题中回复。
- 发送带简短说明的文件附件。