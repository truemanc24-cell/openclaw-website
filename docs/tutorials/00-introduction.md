---
title: 00 introduction
description: 00 introduction 页面
---

# OpenClaw 🦞

**你的个人 AI 助手平台**

> "EXFOLIATE! EXFOLIATE!" — 一只太空龙虾，大概

---

## 什么是 OpenClaw？

OpenClaw 是一个**自托管网关**，将你最喜欢的聊天应用（WhatsApp、Telegram、Discord、iMessage 等）连接到 AI 编码助手。

你在自己的机器（或服务器）上运行一个 Gateway 进程，它成为你的 messaging 应用和随时待命的 AI 助手之间的桥梁。

### 适合谁？

开发者和高级用户，想要一个可以从任何地方发消息的个人 AI 助手——**无需放弃数据控制权或依赖托管服务**。

### 有什么不同？

- **自托管**: 在你的硬件上运行，你说了算
- **多渠道**: 一个 Gateway 同时服务 WhatsApp、Telegram、Discord 等
- **Agent 原生**: 为编码助手构建，支持工具使用、会话、记忆和多 agent 路由
- **开源**: MIT 许可，社区驱动

### 需要什么？

- Node 24（推荐）或 Node 22 LTS（`22.16+`）
- 你选择的 AI 提供商的 API key
- 5 分钟时间

为了最佳质量和安全性，使用最新的最强模型。

---

## 工作原理

```
聊天应用 + 插件 → Gateway → Pi agent
                ↓
            CLI / Web 控制面板 / macOS 应用 / iOS/Android 节点
```

**Gateway** 是会话、路由和渠道连接的单一事实来源。

---

## 核心功能

### 🌐 多渠道网关
WhatsApp、Telegram、Discord 和 iMessage，只需一个 Gateway 进程

### 🔌 插件渠道
通过扩展包添加 Mattermost 等更多平台

### 🤖 多 agent 路由
每个 agent、工作区或发送者的隔离会话

### 📎 媒体支持
发送和接收图片、音频和文档

### 🖥️ Web 控制面板
浏览器仪表盘，用于聊天、配置、会话和节点管理

### 📱 移动节点
配对 iOS 和 Android 节点，支持 Canvas、摄像头和语音功能

---

## 快速开始

### 1️⃣ 安装 OpenClaw

```bash
npm install -g openclaw@latest
```

### 2️⃣ 引导安装服务

```bash
openclaw onboard --install-daemon
```

### 3️⃣ 配对 WhatsApp 并启动 Gateway

```bash
openclaw channels login
openclaw gateway --port 18789
```

需要完整的安装和开发设置？查看 [快速开始指南](/start/quickstart)

---

## 控制面板

Gateway 启动后打开浏览器控制面板：

- **本地访问**: http://127.0.0.1:18789/
- **远程访问**: 查看 [Web surfaces](/web) 和 [Tailscale](/gateway/tailscale)

---

## 配置（可选）

配置文件位置：`~/.openclaw/openclaw.json`

- 如果**什么都不做**，OpenClaw 使用捆绑的 Pi 二进制文件（RPC 模式），每个发送者独立会话
- 如果想加强安全，从 `channels.whatsapp.allowFrom` 和（群组）mention 规则开始

**示例配置**：
```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": { "*": { "requireMention": true } }
    }
  },
  "messages": {
    "groupChat": { "mentionPatterns": ["@openclaw"] }
  }
}
```

---

## 从这里开始

### 📚 文档中心
[所有文档和指南](/start/hubs)，按使用场景分类

### ⚙️ 配置
[核心 Gateway 设置](/gateway/configuration)、令牌和提供商配置

### 🌍 远程访问
[SSH 和 Tailscale](/gateway/remote) 访问模式

### 📱 渠道
[渠道特定设置](/channels/telegram)：WhatsApp、Telegram、Discord 等

### 📲 节点
[iOS 和 Android 节点](/nodes)，支持配对、Canvas、摄像头和设备操作

### ❓ 帮助
[常见修复和故障排除](/help)

---

## 深入学习

- [完整功能列表](/concepts/features) - 完整的渠道、路由和媒体功能
- [多 agent 路由](/concepts/multi-agent) - 工作区隔离和每个 agent 的会话
- [安全性](/gateway/security) - 令牌、白名单和安全控制
- [故障排除](/gateway/troubleshooting) - Gateway 诊断和常见错误
- [关于和致谢](/reference/credits) - 项目起源、贡献者和许可

---

**社区**: [GitHub](https://github.com/openclaw/openclaw) | [Discord](https://discord.gg/clawd) | [官方文档](https://docs.openclaw.ai)

---

**翻译完成时间**: 2026-03-15 00:28  
**来源**: https://docs.openclaw.ai/  
**状态**: ✅ 已完成
