---
title: discord
description: discord 页面
---
allowed-tools: ["message"]
---

# Discord（通过 `message`）

使用 `message` 工具。没有向代理公开特定提供商的 `discord` 工具。

## 必须遵守的规则

- 始终设置：`channel: "discord"`。
- 遵守门控：`channels.discord.actions.*`（一些默认关闭：`roles`、`moderation`、`presence`、`channels`）。
- 优先使用明确 ID：`guildId`、`channelId`、`messageId`、`userId`。
- 多账户：可选 `accountId`。

## 指南

- 避免在出站 Discord 消息中使用 Markdown 表格。
- 用 `<@USER_ID>` 提及用户。
- 优先使用 Discord 组件 v2（`components`）实现丰富 UI；仅在必须时使用传统 `embeds`。

## 目标

- 发送类操作：`to: "channel:<id>"` 或 `to: "user:<id>"`。
- 消息特定操作：`channelId: "<id>"`（或 `to`）+ `messageId: "<id>"`。

## 常用操作（示例）

发送消息：

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "message": "hello",
  "silent": true
}
```

发送带媒体：

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "message": "see attachment",
  "media": "file:///tmp/example.png"
}
```

- 可选 `silent: true` 以抑制 Discord 通知。

发送带组件 v2（推荐用于丰富 UI）：

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "message": "Status update",
  "components": "[Carbon v2 components]"
}
```

- `components` 期望来自 JS/TS 集成的 Carbon 组件实例（Container、TextDisplay 等）。
- 不要将 `components` 与 `embeds` 组合（Discord 拒绝 v2 + embeds）。

传统 embeds（不推荐）：

```json
{
  "action": "send",
  "channel": "discord",
  "to": "channel:123",
  "message": "Status update",
  "embeds": [{ "title": "Legacy", "description": "Embeds are legacy." }]
}
```

- 当存在 v2 组件时，`embeds` 会被忽略。

反应：

```json
{
  "action": "react",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456",
  "emoji": "✅"
}
```

读取：

```json
{
  "action": "read",
  "channel": "discord",
  "to": "channel:123",
  "limit": 20
}
```

编辑 / 删除：

```json
{
  "action": "edit",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456",
  "message": "fixed typo"
}
```

```json
{
  "action": "delete",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456"
}
```

投票：

```json
{
  "action": "poll",
  "channel": "discord",
  "to": "channel:123",
  "pollQuestion": "Lunch?",
  "pollOption": ["Pizza", "Sushi", "Salad"],
  "pollMulti": false,
  "pollDurationHours": 24
}
```

固定：

```json
{
  "action": "pin",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456"
}
```

话题：

```json
{
  "action": "thread-create",
  "channel": "discord",
  "channelId": "123",
  "messageId": "456",
  "threadName": "bug triage"
}
```

搜索：

```json
{
  "action": "search",
  "channel": "discord",
  "guildId": "999",
  "query": "release notes",
  "channelIds": ["123", "456"],
  "limit": 10
}
```

在线状态（通常被门控）：

```json
{
  "action": "set-presence",
  "channel": "discord",
  "activityType": "playing",
  "activityName": "with fire",
  "status": "online"
}
```

## 写作风格（Discord）

- 简短、对话式、低仪式感。
- 无 Markdown 表格。
- 用 `<@USER_ID>` 提及用户。