---
title: configuration reference
description: configuration reference 页面
---

# 配置参考

这是 OpenClaw 配置的完整参考。配置以 JSON5 格式存储在 `~/.openclaw/openclaw.json` 中。

## 根级别

| 字段 | 类型 | 描述 |
|------|------|------|
| `$schema` | 字符串 | JSON Schema 元数据（可选） |
| `agents` | 对象 | 代理配置 |
| `channels` | 对象 | 渠道配置 |
| `gateway` | 对象 | 网关配置 |
| `hooks` | 对象 | 钩子配置 |
| `session` | 对象 | 会话配置 |
| `logging` | 对象 | 日志配置 |
| `plugins` | 对象 | 插件配置 |

## agents

| 字段 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `defaults` | 对象 | 见下文 | 默认代理配置 |
| `list` | 数组 | [] | 代理列表 |

### agents.defaults

| 字段 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `workspace` | 字符串 | "~/.openclaw/workspace" | 工作区目录 |
| `model` | 对象 | 见下文 | 模型配置 |
| `models` | 对象 | {} | 模型目录和别名 |
| `heartbeat` | 对象 | 见下文 | 心跳配置 |
| `sandbox` | 对象 | 见下文 | 沙箱配置 |
| `cliBackends` | 对象 | {} | CLI 后端配置 |

### agents.defaults.model

```json5
{
  primary: "anthropic/claude-sonnet-4-5",
  fallbacks: ["openai/gpt-5.2"]
}
```

### agents.defaults.heartbeat

```json5
{
  every: "30m",
  target: "last",
  activeHours: {
    start: "08:00",
    end: "22:00",
    timezone: "local"
  }
}
```

### agents.defaults.sandbox

```json5
{
  mode: "off", // "off" | "non-main" | "all"
  scope: "session", // "session" | "agent" | "shared"
  image: "openclaw-sandbox:latest",
  mountWorkspace: true,
  networkMode: "none"
}
```

## channels

每个渠道（whatsapp、telegram、discord、slack 等）有自己的配置部分。

### channels.whatsapp

```json5
{
  enabled: true,
  mode: "webhook", // "webhook" | "local"
  webhook: {
    publicUrl: "https://...",
    path: "/webhooks/whatsapp",
    token: "verify-token"
  },
  qrCode: {
    autoAccept: true,
    timeoutMinutes: 5
  },
  dmPolicy: "pairing", // "pairing" | "allowlist" | "open" | "disabled"
  allowFrom: ["+15551234567"]
}
```

### channels.telegram

```json5
{
  enabled: true,
  botToken: "123:ABC",
  dmPolicy: "pairing",
  groupPolicy: "allowlist",
  groupAllowFrom: ["-1001234567890"],
  allowFrom: ["tg:123456789"]
}
```

### channels.discord

```json5
{
  enabled: true,
  botToken: "xxx",
  dmPolicy: "pairing"
}
```

## gateway

| 字段 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `bind` | 字符串 | "loopback" | 绑定地址（loopback/tailnet/all） |
| `port` | 数字 | 18789 | 端口 |
| `auth` | 对象 | 见下文 | 认证配置 |
| `push` | 对象 | 见下文 | 推送配置 |

### gateway.auth

```json5
{
  required: true,
  allowedOrigins: ["https://your-domain.com"]
}
```

### gateway.push.apns

```json5
{
  relay: {
    baseUrl: "https://relay.example.com",
    timeoutMs: 10000
  }
}
```

## hooks

| 字段 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `enabled` | 布尔值 | false | 启用钩子 |
| `token` | 字符串 | - | Hook token（必需时） |
| `path` | 字符串 | "/hooks" | Hook 路径 |
| `presets` | 数组 | [] | 启用的预设 |
| `mappings` | 数组 | [] | 钩子映射 |

### hooks.mappings

```json5
{
  match: { path: "gmail" },
  action: "agent",
  wakeMode: "now",
  name: "Gmail",
  sessionKey: "hook:gmail:{{messages[0].id}}",
  messageTemplate: "...",
  model: "openai/gpt-5.2-mini",
  deliver: true,
  channel: "last"
}
```

## session

| 字段 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `dmScope` | 字符串 | "per-channel-peer" | DM 范围 |
| `threadBindings` | 对象 | 见下文 | 线程绑定 |
| `reset` | 对象 | 见下文 | 会话重置 |

### session.threadBindings

```json5
{
  enabled: true,
  idleHours: 24,
  maxAgeHours: 0
}
```

### session.reset

```json5
{
  mode: "daily", // "daily" | "weekly" | "idle" | "off"
  atHour: 4,
  idleMinutes: 120,
  dayOfWeek: 1
}
```

## logging

```json5
{
  level: "info", // "debug" | "info" | "warn" | "error"
  file: "/tmp/openclaw/openclaw.log",
  redactSensitive: true
}
```

## plugins

```json5
{
  entries: {
    brave: {
      config: {
        webSearch: {
          apiKey: "BRAVE_API_KEY"
        }
      }
    }
  }
}
```

## 自定义提供商和基础 URL

为自托管模型设置自定义提供商：

```json5
{
  agents: {
    defaults: {
      models: {
        "custom/model": {
          endpoint: "http://localhost:11434/v1",
          apiKey: "not-required",
          alias: "Local"
        }
      }
    }
  }
}
```

## DM 和群组访问

### 策略类型

* `pairing`（默认）：未知发送者获得一次性配对码
* `allowlist`：仅允许列表中的发送者
* `open`：允许所有 DM（需要 `allowFrom: ["*"]`）
* `disabled`：忽略所有 DM

### 群组提及 gating

```json5
{
  agents: {
    list: [
      {
        id: "main",
        groupChat: {
          mentionPatterns: ["@openclaw", "openclaw"],
        }
      }
    ]
  },
  channels: {
    whatsapp: {
      groups: {
        "*": { requireMention: true }
      }
    }
  }
}
```

## 工具配置

### tools.web.search

```json5
{
  tools: {
    web: {
      search: {
        provider: "brave",
        maxResults: 5,
        timeoutSeconds: 30
      }
    }
  }
}
```

## 诊断标志

```json5
{
  diagnostics: {
    flags: ["telegram.http", "gateway.*"]
  }
}
```