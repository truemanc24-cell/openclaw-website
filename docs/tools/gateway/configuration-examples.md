---
title: configuration examples
description: configuration examples 页面
---

# 配置示例

以下是常见设置的可复制配置示例。

## WhatsApp 基本设置

```json5
{
  channels: {
    whatsapp: {
      enabled: true,
      // 生产：使用 webhook 模式用于公共访问
      mode: "webhook",
      webhook: {
        publicUrl: "https://your-domain.com",
        path: "/webhooks/whatsapp",
        token: "YOUR_WEBHOOK_VERIFY_TOKEN",
      },
      // 开发：使用本地模式
      // mode: "local",
      // qrCode: { autoAccept: true },
    },
  },
}
```

## Telegram Bot

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "YOUR_BOT_TOKEN",
      dmPolicy: "pairing",
      groupPolicy: "allowlist",
      groupAllowFrom: ["-1001234567890"],
    },
  },
}
```

## Discord Bot

```json5
{
  channels: {
    discord: {
      enabled: true,
      botToken: "YOUR_BOT_TOKEN",
      dmPolicy: "pairing",
    },
  },
}
```

## Slack Bot

```json5
{
  channels: {
    slack: {
      enabled: true,
      botToken: "xoxb-...",
      signingSecret: "YOUR_SIGNING_SECRET",
      dmPolicy: "pairing",
    },
  },
}
```

## 完整多渠道设置

```json5
{
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace",
      model: {
        primary: "anthropic/claude-sonnet-4-5",
        fallbacks: ["openai/gpt-5.2", "claude-cli/opus-4.6"],
      },
      models: {
        "anthropic/claude-sonnet-4-5": { alias: "Sonnet" },
        "openai/gpt-5.2": { alias: "GPT" },
      },
      heartbeat: {
        every: "30m",
        activeHours: { start: "08:00", end: "22:00" },
      },
    },
  },
  channels: {
    whatsapp: {
      enabled: true,
      mode: "webhook",
      webhook: {
        publicUrl: "https://your-domain.com",
        path: "/webhooks/whatsapp",
      },
    },
    telegram: {
      enabled: true,
      botToken: "YOUR_BOT_TOKEN",
      dmPolicy: "pairing",
    },
  },
  hooks: {
    enabled: true,
    token: "secret-token",
  },
}
```

## 带自动化的完整设置

```json5
{
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace",
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["openai/gpt-5.2"],
      },
      heartbeat: {
        every: "30m",
        target: "last",
      },
    },
  },
  channels: {
    whatsapp: { enabled: true },
    telegram: {
      enabled: true,
      botToken: "YOUR_BOT_TOKEN",
      dmPolicy: "pairing",
    },
  },
  hooks: {
    enabled: true,
    token: "hook-secret",
    presets: ["gmail"],
  },
  session: {
    dmScope: "per-channel-peer",
    reset: {
      mode: "daily",
      atHour: 4,
    },
  },
}
```

## 沙箱配置

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "agent",
        mountWorkspace: true,
      },
    },
  },
}
```

## 安全加固

```json5
{
  agents: {
    defaults: {
      tools: {
        profile: "strict",
        allowedPaths: ["~/.openclaw/workspace/${agentId}"],
        deniedCommands: ["rm -rf /", "sudo", "chmod 777"],
      },
    },
  },
  gateway: {
    auth: {
      required: true,
      allowedOrigins: ["https://your-domain.com"],
    },
  },
}
```

## 带有中继支持的 iOS 推送

```json5
{
  gateway: {
    push: {
      apns: {
        relay: {
          baseUrl: "https://relay.your-domain.com",
        },
      },
    },
  },
}
```