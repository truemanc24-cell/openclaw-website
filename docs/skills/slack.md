---
name: slack
description: 当你需要通过 slack 工具控制 Slack 时使用，包括在 Slack 渠道或 DM 中对消息进行反应或固定/取消固定项目。
metadata: { "openclaw": { "emoji": "💬", "requires": { "config": ["channels.slack"] } } }
---

# Slack 操作

## 概述

使用 `slack` 进行反应、管理固定、发送/编辑/删除消息以及获取成员信息。该工具使用为 OpenClaw 配置的 bot token。

## 需要收集的输入

- `channelId` 和 `messageId`（Slack 消息时间戳，例如 `1712023032.1234`）。
- 对于反应，一个 `emoji`（Unicode 或 `:name:`）。
- 对于消息发送，一个 `to` 目标（`channel:<id>` 或 `user:<id>`）和 `content`。

消息上下文字段包含你可以直接重用的 `slack message id` 和 `channel` 字段。

## 操作

### 操作组

| 操作组 | 默认 | 备注 |
| ------------ | ------- | ---------------------- |
| reactions    | enabled | 反应 + 列出反应 |
| messages     | enabled | 读取/发送/编辑/删除 |
| pins         | enabled | 固定/取消固定/列出 |
| memberInfo   | enabled | 成员信息 |
| emojiList    | enabled | 自定义 emoji 列表 |

### 对消息反应

```json
{
  "action": "react",
  "channelId": "C123",
  "messageId": "1712023032.1234",
  "emoji": "✅"
}
```

### 列出反应

```json
{
  "action": "reactions",
  "channelId": "C123",
  "messageId": "1712023032.1234"
}
```

### 发送消息

```json
{
  "action": "sendMessage",
  "to": "channel:C123",
  "content": "Hello from OpenClaw"
}
```

### 编辑消息

```json
{
  "action": "editMessage",
  "channelId": "C123",
  "messageId": "1712023032.1234",
  "content": "Updated text"
}
```

### 删除消息

```json
{
  "action": "deleteMessage",
  "channelId": "C123",
  "messageId": "1712023032.1234"
}
```

### 读取最近消息

```json
{
  "action": "readMessages",
  "channelId": "C123",
  "limit": 20
}
```

### 固定消息

```json
{
  "action": "pinMessage",
  "channelId": "C123",
  "messageId": "1712023032.1234"
}
```

### 取消固定消息

```json
{
  "action": "unpinMessage",
  "channelId": "C123",
  "messageId": "1712023032.1234"
}
```

### 列出固定项目

```json
{
  "action": "listPins",
  "channelId": "C123"
}
```

### 成员信息

```json
{
  "action": "memberInfo",
  "userId": "U123"
}
```

### Emoji 列表

```json
{
  "action": "emojiList"
}
```

## 尝试的想法

- 用 ✅ 反应标记完成的任务。
- 固定关键决策或每周状态更新。