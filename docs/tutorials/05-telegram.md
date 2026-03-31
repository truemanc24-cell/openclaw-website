---
title: 05 telegram
description: 05 telegram 页面
---

# Telegram 渠道配置

> ## 文档索引
> 获取完整文档索引：https://docs.openclaw.ai/llms.txt

---

## 快速设置

### 步骤 1：创建 Telegram Bot

1. 在 Telegram 中与 [@BotFather](https://t.me/BotFather) 聊天
2. 发送 `/newbot`
3. 按照提示设置 bot 名称和用户名
4. 保存 API token（格式如 `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`）

### 步骤 2：配置 Telegram

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
      dmPolicy: "pairing",
      allowFrom: ["tg:123456789"],
    },
  },
}
```

### 步骤 3：启动网关

```bash
openclaw gateway
```

### 步骤 4：批准配对请求

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

---

## 部署模式

### 模式 1：配对模式（默认）

适合个人使用：
- 用户发送 `/start` 给 bot
- 收到一次性配对码
- 管理员批准后可用

### 模式 2：白名单模式

适合受控环境：
```json5
{
  channels: {
    telegram: {
      dmPolicy: "allowlist",
      allowFrom: ["tg:123456789", "tg:987654321"],
    },
  },
}
```

### 模式 3：开放模式

公开 bot（谨慎使用）：
```json5
{
  channels: {
    telegram: {
      dmPolicy: "open",
      allowFrom: ["*"],
    },
  },
}
```

---

## 群组支持

### 启用群组访问

1. 将 bot 添加到群组
2. 设置群组管理员权限（可选但推荐）
3. 配置群组策略：

```json5
{
  channels: {
    telegram: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["tg:123456789"],
    },
  },
}
```

### 群组提及门控

群组消息默认需要提及 bot：
- `@botname` 提及
- 回复 bot 的消息

配置提及模式：
```json5
{
  agents: {
    list: [
      {
        id: "main",
        groupChat: {
          mentionPatterns: ["@mybot", "bot"],
        },
      },
    ],
  },
}
```

---

## 消息处理

### 入站消息标准化

- 文本消息直接传递
- 媒体消息用占位符：`<media:image>`、`<media:document>` 等
- 回复消息附带上下文

### 出站消息

- 支持文本、图片、文档
- 自动分块（长消息）
- Markdown 格式支持

---

## 高级配置

### 多 Bot 支持

```json5
{
  channels: {
    telegram: {
      accounts: {
        personal: {
          enabled: true,
          botToken: "TOKEN_1",
          dmPolicy: "allowlist",
        },
        work: {
          enabled: true,
          botToken: "TOKEN_2",
          dmPolicy: "pairing",
        },
      },
    },
  },
}
```

### 媒体限制

```json5
{
  channels: {
    telegram: {
      mediaMaxMb: 20,
    },
  },
}
```

### 已读回执

```json5
{
  channels: {
    telegram: {
      sendReadReceipts: false,
    },
  },
}
```

---

## 故障排除

### Bot 无响应

**检查**：
1. Bot token 是否正确
2. Gateway 是否运行
3. 用户是否在白名单中

**命令**：
```bash
openclaw channels status telegram
openclaw logs --follow
```

### 群组消息被忽略

**检查顺序**：
1. `groupPolicy` 配置
2. `groupAllowFrom` 白名单
3. 提及门控设置
4. Bot 是否在群组中

### 媒体发送失败

**原因**：
- 文件过大（超过 `mediaMaxMb`）
- 格式不支持
- 网络问题

**解决**：
- 增加 `mediaMaxMb` 限制
- 检查文件格式
- 查看日志错误

---

## 安全建议

1. **保护 Bot Token**：不要泄露到公开仓库
2. **使用白名单**：生产环境避免 `open` 模式
3. **限制群组访问**：配置 `groupPolicy`
4. **监控日志**：定期检查异常活动

---

## 相关文档

- [配对指南](/channels/pairing)
- [渠道路由](/channels/channel-routing)
- [多 Agent 路由](/concepts/multi-agent)
- [配置参考](/gateway/configuration-reference#telegram)

---

**翻译完成时间**: 2026-03-15 01:15  
**来源**: https://docs.openclaw.ai/channels/telegram  
**状态**: ✅ 已完成


---

## 📚 相关内容

- [快速开始](/tutorials/01-quick-start)
- [配置教程](/tutorials/03-configuration)
- [WhatsApp 集成](/tutorials/04-whatsapp)
- [频道列表](/channels/)
- [故障排查](/tutorials/201-troubleshooting-guide)
