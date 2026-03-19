# 功能特性

## 亮点

<Columns>
  <Card title="渠道" icon="message-square">
    通过单一网关支持 WhatsApp、Telegram、Discord 和 iMessage。
  </Card>

  <Card title="插件" icon="plug">
    通过扩展添加 Mattermost 等。
  </Card>

  <Card title="路由" icon="route">
    多代理路由，会话隔离。
  </Card>

  <Card title="媒体" icon="image">
    支持图像、音频和文档的输入输出。
  </Card>

  <Card title="应用和 UI" icon="monitor">
    网页控制 UI 和 macOS 伴侣应用。
  </Card>

  <Card title="移动节点" icon="smartphone">
    iOS 和 Android 节点，支持配对、语音/聊天和丰富的设备命令。
  </Card>
</Columns>

## 完整列表

* 通过 WhatsApp Web（Baileys）集成 WhatsApp
* Telegram 机器人支持（grammY）
* Discord 机器人支持（channels.discord.js）
* Mattermost 机器人支持（插件）
* 通过本地 imsg CLI 集成 iMessage（macOS）
* 代理桥接，用于 RPC 模式的 Pi，支持工具流式传输
* 长回复的流式传输和分块
* 多代理路由，每个工作空间或发件人隔离会话
* Anthropic 和 OpenAI 的订阅认证 via OAuth
* 会话：直接聊天合并为共享的 `main`；群组是隔离的
* 群组聊天支持，基于提及激活
* 图像、音频和文档的媒体支持
* 可选的语音笔记转录钩子
* WebChat 和 macOS 菜单栏应用
* iOS 节点，支持配对、Canvas、摄像头、屏幕录制、位置和语音功能
* Android 节点，支持配对、Connect 标签、聊天会话、语音标签、Canvas/摄像头，加上设备、通知、联系人/日历、运动、照片和 SMS 命令

<Note>
  旧的 Claude、Codex、Gemini 和 Opencode 路径已被移除。Pi 是唯一的编码代理路径。
</Note>