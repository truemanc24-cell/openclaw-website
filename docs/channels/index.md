---
title: index
description: index 页面
---

# 聊天渠道

# 聊天渠道

OpenClaw 可以通过您正在使用的任何聊天应用与您对话。每个渠道都通过网关进行连接。
所有渠道都支持文本；媒体和表情反应因渠道而异。

## 支持的渠道

* [BlueBubbles](/channels/bluebubbles) — **推荐用于 iMessage**；使用 BlueBubbles macOS 服务器 REST API，支持完整功能（编辑、撤回、效果、表情反应、群组管理 — macOS 26 Tahoe 上编辑功能目前不可用）。
* [Discord](/channels/discord) — Discord 机器人 API + Gateway；支持服务器、频道和私信。
* [Feishu](/channels/feishu) — 飞书/钉钉机器人 via WebSocket（插件，需单独安装）。
* [Google Chat](/channels/googlechat) — Google Chat API 应用 via HTTP webhook。
* [iMessage（传统）](/channels/imessage) — 传统 macOS 集成 via imsg CLI（已弃用，新设置请使用 BlueBubbles）。
* [IRC](/channels/irc) — 经典 IRC 服务器；频道和私信，支持配对/白名单控制。
* [LINE](/channels/line) — LINE 消息 API 机器人（插件，需单独安装）。
* [Matrix](/channels/matrix) — Matrix 协议（插件，需单独安装）。
* [Mattermost](/channels/mattermost) — 机器人 API + WebSocket；频道、群组、私信（插件，需单独安装）。
* [Microsoft Teams](/channels/msteams) — 机器人框架；企业支持（插件，需单独安装）。
* [Nextcloud Talk](/channels/nextcloud-talk) — 自托管聊天 via Nextcloud Talk（插件，需单独安装）。
* [Nostr](/channels/nostr) — 去中心化私信 via NIP-04（插件，需单独安装）。
* [Signal](/channels/signal) — signal-cli；注重隐私。
* [Synology Chat](/channels/synology-chat) — 群晖 NAS Chat via 出站+入站 webhook（插件，需单独安装）。
* [Slack](/channels/slack) — Bolt SDK；工作区应用。
* [Telegram](/channels/telegram) — 机器人 API via grammY；支持群组。
* [Tlon](/channels/tlon) — 基于 Urbit 的 messenger（插件，需单独安装）。
* [Twitch](/channels/twitch) — Twitch 聊天 via IRC 连接（插件，需单独安装）。
* [WebChat](/web/webchat) — 网关 WebChat UI via WebSocket。
* [WhatsApp](/channels/whatsapp) — 最流行的聊天应用；使用 Baileys，需要二维码配对。
* [Zalo](/channels/zalo) — Zalo 机器人 API；越南流行的 messenger（插件，需单独安装）。
* [Zalo 个人](/channels/zalouser) — Zalo 个人账户 via 二维码登录（插件，需单独安装）。

## 注意事项

* 渠道可以同时运行；配置多个渠道后，OpenClaw 会根据聊天进行路由。
* 最快的设置通常是 **Telegram**（简单的机器人令牌）。WhatsApp 需要二维码配对，并在磁盘上存储更多状态。
* 群组行为因渠道而异；请参阅[群组](/channels/groups)。
* 私信配对和白名单强制执行以确保安全；请参阅[安全](/gateway/security)。
* 故障排除：[渠道故障排除](/channels/troubleshooting)。
* 模型提供商文档单独提供；请参阅[模型提供商](/providers/models)。