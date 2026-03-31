---
title: bluebubbles
description: bluebubbles 页面
---

# BlueBubbles

# BlueBubbles (macOS REST)

状态：捆绑插件，通过 HTTP 与 BlueBubbles macOS 服务器通信。由于其更丰富的 API 和比传统 imsg 渠道更简单的设置，**推荐用于 iMessage 集成**。

## 概述

* 通过 BlueBubbles 辅助应用（[bluebubbles.app](https://bluebubbles.app)）在 macOS 上运行。
* 推荐/测试版本：macOS Sequoia (15)。macOS Tahoe (26) 可用；目前在 Tahoe 上编辑功能不可用，群组图标更新可能报告成功但未同步。
* OpenClaw 通过其 REST API 与之通信（`GET /api/v1/ping`、`POST /message/text`、`POST /chat/:id/*`）。
* 传入消息通过 webhook 到达；传出回复、输入指示器、已读回执和 Tapback 通过 REST 调用发送。
* 附件和贴纸作为入站媒体获取（并在可能的情况下呈现给代理）。
* 配对/白名单的工作方式与其他渠道相同（`/channels/pairing` 等），使用 `channels.bluebubbles.allowFrom` + 配对代码。
* 反应作为系统事件呈现，与 Slack/Telegram 类似，以便代理可以在回复前提到它们。
* 高级功能：编辑、撤回、回复线程、消息效果、群组管理。

## 快速开始

1. 在您的 Mac 上安装 BlueBubbles 服务器（按照 [bluebubbles.app/install](https://bluebubbles.app/install) 的说明操作）。

2. 在 BlueBubbles 配置中，启用 web API 并设置密码。

3. 运行 `openclaw onboard` 并选择 BlueBubbles，或手动配置：

   ```json5
   {
     channels: {
       bluebubbles: {
         enabled: true,
         serverUrl: "http://192.168.1.100:1234",
         password: "example-password",
         webhookPath: "/bluebubbles-webhook",
       },
     },
   }
   ```

4. 将 BlueBubbles webhook 指向您的网关（示例：`https://your-gateway-host:3000/bluebubbles-webhook?password=<password>`）。

5. 启动网关；它将注册 webhook 处理器并开始配对。

安全说明：

* 始终设置 webhook 密码。
* 始终需要 webhook 身份验证。OpenClaw 拒绝不包含与 `channels.bluebubbles.password` 匹配的密码/guid 的 BlueBubbles webhook 请求（例如 `?password=<password>` 或 `x-password`），无论回环/代理拓扑如何。
* 密码身份验证在读取/解析完整 webhook 正文之前进行检查。

## 保持 Messages.app 活跃（VM / 无头设置）

某些 macOS VM / 始终在线设置可能导致 Messages.app 变为"空闲"（传入事件停止，直到应用被打开/前台）。一个简单的解决方案是**每 5 分钟戳一下 Messages**，使用 AppleScript + LaunchAgent。

### 1) 保存 AppleScript

保存为：

* `~/Scripts/poke-messages.scpt`

示例脚本（非交互式；不会夺取焦点）：

```applescript
try
  tell application "Messages"
    if not running then
      launch
    end if

    -- Touch the scripting interface to keep the process responsive.
    set _chatCount to (count of chats)
  end tell
on error
  -- Ignore transient failures (first-run prompts, locked session, etc).
end try
```

### 2) 安装 LaunchAgent

保存为：

* `~/Library/LaunchAgents/com.user.poke-messages.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.user.poke-messages</string>

    <key>ProgramArguments</key>
    <array>
      <string>/bin/bash</string>
      <string>-lc</string>
      <string>/usr/bin/osascript "$HOME/Scripts/poke-messages.scpt"</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>StartInterval</key>
    <integer>300</integer>

    <key>StandardOutPath</key>
    <string>/tmp/poke-messages.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/poke-messages.err</string>
  </dict>
</plist>
```

注意：

* 这每 **300 秒**运行一次，**以及登录时**。
* 第一次运行可能会触发 macOS **自动化**提示（`osascript` → Messages）。在与运行 LaunchAgent 的同一用户会话中批准它们。

加载它：

```bash
launchctl unload ~/Library/LaunchAgents/com.user.poke-messages.plist 2>/dev/null || true
launchctl load ~/Library/LaunchAgents/com.user.poke-messages.plist
```

## 配置

BlueBubbles 可在交互式配置中使用：

```
openclaw onboard
```

向导会提示：

* **服务器 URL**（必需）：BlueBubbles 服务器地址（例如 `http://192.168.1.100:1234`）
* **密码**（必需）：BlueBubbles 服务器设置中的 API 密码
* **Webhook 路径**（可选）：默认为 `/bluebubbles-webhook`
* **私信策略**：配对、白名单、开放或禁用
* **白名单**：电话号码、电子邮件或聊天目标

您也可以通过 CLI 添加 BlueBubbles：

```
openclaw channels add bluebubbles --http-url http://192.168.1.100:1234 --password <password>
```

## 访问控制（私信 + 群组）

私信：

* 默认值：`channels.bluebubbles.dmPolicy = "pairing"`。
* 未知发送者收到配对代码；消息在批准之前被忽略（代码在 1 小时后过期）。
* 批准方式：
  * `openclaw pairing list bluebubbles`
  * `openclaw pairing approve bluebubbles <CODE>`
* 配对是默认的令牌交换。详情：[配对](/channels/pairing)

群组：

* `channels.bluebubbles.groupPolicy = open | allowlist | disabled`（默认：`allowlist`）。
* 当设置 `allowlist` 时，`channels.bluebubbles.groupAllowFrom` 控制谁可以在群组中触发。

### 提及门控（群组）

BlueBubbles 支持群组聊天的提及门控，匹配 iMessage/WhatsApp 行为：

* 使用 `agents.list[].groupChat.mentionPatterns`（或 `messages.groupChat.mentionPatterns`）检测提及。
* 当为群组启用 `requireMention` 时，代理仅在收到提及时回复。
* 来自授权发送者的控制命令绕过提及门控。

按群组配置：

```json5
{
  channels: {
    bluebubbles: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15555550123"],
      groups: {
        "*": { requireMention: true }, // all groups default
        "iMessage;-;chat123": { requireMention: false }, // override for specific group
      },
    },
  },
}
```

### 命令门控

* 控制命令（例如 `/config`、`/model`）需要授权。
* 使用 `allowFrom` 和 `groupAllowFrom` 确定命令授权。
* 授权的发送者即使在群组中没有被提及也可以运行控制命令。

## 输入指示器 + 已读回执

* **输入指示器**：在响应生成之前和期间自动发送。
* **已读回执**：由 `channels.bluebubbles.sendReadReceipts` 控制（默认：`true`）。
* **输入指示器**：OpenClaw 发送输入开始事件；BlueBubbles 在发送或超时时自动清除输入（手动通过 DELETE 停止不可靠）。

```json5
{
  channels: {
    bluebubbles: {
      sendReadReceipts: false, // 禁用已读回执
    },
  },
}
```

## 高级操作

在配置中启用后，BlueBubbles 支持高级消息操作：

```json5
{
  channels: {
    bluebubbles: {
      actions: {
        reactions: true, // tapbacks（默认：true）
        edit: true, // 编辑已发送的消息（macOS 13+，在 macOS 26 Tahoe 上目前不可用）
        unsend: true, // 撤回消息（macOS 13+）
        reply: true, // 按消息 GUID 进行回复
        sendWithEffect: true, // 发送带 iMessage 效果的消息（slam、loud 等）
        renameGroup: true, // 重命名群组聊天
        setGroupIcon: true, // 设置群组聊天图标/照片（在 macOS 26 Tahoe 上不稳定）
        addParticipant: true, // 添加参与者到群组
        removeParticipant: true, // 从群组移除参与者
        leaveGroup: true, // 离开群组聊天
        sendAttachment: true, // 发送附件/媒体
      },
    },
  },
}
```

可用操作：

* **react**：添加/移除 tapback 反应（`messageId`、`emoji`、`remove`）
* **edit**：编辑已发送的消息（`messageId`、`text`）
* **unsend**：撤回消息（`messageId`）
* **reply**：回复特定消息（`messageId`、`text`、`to`）
* **sendWithEffect**：发送带 iMessage 效果的消息（`text`、`to`、`effectId`）
* **renameGroup**：重命名群组聊天（`chatGuid`、`displayName`）
* **setGroupIcon**：设置群组聊天的图标/照片（`chatGuid`、`media`）— 在 macOS 26 Tahoe 上不稳定（API 可能返回成功但图标未同步）。
* **addParticipant**：将某人添加到群组（`chatGuid`、`address`）
* **removeParticipant**：从群组中移除某人（`chatGuid`、`address`）
* **leaveGroup**：离开群组聊天（`chatGuid`）
* **sendAttachment**：发送媒体/文件（`to`、`buffer`、`filename`、`asVoice`）
  * 语音备忘录：设置 `asVoice: true` 并使用 **MP3** 或 **CAF** 音频作为 iMessage 语音消息发送。BlueBubbles 在发送语音备忘录时将 MP3 → CAF 转换。

### 消息 ID（短 ID 与完整 ID）

OpenClaw 可能会呈现*短*消息 ID（例如 `1`、`2`）以节省 token。

* `MessageSid` / `ReplyToId` 可以是短 ID。
* `MessageSidFull` / `ReplyToIdFull` 包含提供商的完整 ID。
* 短 ID 存储在内存中；它们可能在重启或缓存驱逐后过期。
* 操作接受短或完整 `messageId`，但如果短 ID 不再可用则会报错。

对于持久化自动化和存储，请使用完整 ID：

* 模板：`{{MessageSidFull}}`、`{{ReplyToIdFull}}`
* 上下文：入站负载中的 `MessageSidFull` / `ReplyToIdFull`

请参阅[配置](/gateway/configuration)了解模板变量。

## 阻止流式传输

控制响应是作为单条消息发送还是以块流式传输：

```json5
{
  channels: {
    bluebubbles: {
      blockStreaming: true, // 启用块流式传输（默认关闭）
    },
  },
}
```

## 媒体 + 限制

* 入站附件下载并存储在媒体缓存中。
* 通过 `channels.bluebubbles.mediaMaxMb` 限制入站和出站媒体（默认：8 MB）。
* 出站文本分块为 `channels.bluebubbles.textChunkLimit`（默认：4000 字符）。

## 配置参考

完整配置：[配置](/gateway/configuration)

提供商选项：

* `channels.bluebubbles.enabled`：启用/禁用渠道。
* `channels.bluebubbles.serverUrl`：BlueBubbles REST API 基础 URL。
* `channels.bluebubbles.password`：API 密码。
* `channels.bluebubbles.webhookPath`：Webhook 端点路径（默认：`/bluebubbles-webhook`）。
* `channels.bluebubbles.dmPolicy`：`pairing | allowlist | open | disabled`（默认：`pairing`）。
* `channels.bluebubbles.allowFrom`：私信白名单（句柄、电子邮件、E.164 号码、`chat_id:*`、`chat_guid:*`）。
* `channels.bluebubbles.groupPolicy`：`open | allowlist | disabled`（默认：`allowlist`）。
* `channels.bluebubbles.groupAllowFrom`：群组发送者白名单。
* `channels.bluebubbles.groups`：按群组配置（`requireMention` 等）。
* `channels.bluebubbles.sendReadReceipts`：发送已读回执（默认：`true`）。
* `channels.bluebubbles.blockStreaming`：启用块流式传输（默认：`false`；流式回复需要）。
* `channels.bluebubbles.textChunkLimit`：出站块大小（字符）（默认：4000）。
* `channels.bluebubbles.chunkMode`：`length`（默认）仅在超过 `textChunkLimit` 时拆分；`newline` 在长度分块之前按空行（段落边界）拆分。
* `channels.bluebubbles.mediaMaxMb`：入站/出站媒体上限（MB）（默认：8）。
* `channels.bluebubbles.mediaLocalRoots`：出站本地媒体路径允许的绝对本地目录显式白名单。默认情况下拒绝本地路径发送，除非配置此项。逐账户覆盖：`channels.bluebubbles.accounts.<accountId>.mediaLocalRoots`。
* `channels.bluebubbles.historyLimit`：群组消息上下文上限（0 禁用）。
* `channels.bluebubbles.dmHistoryLimit`：私信历史限制。
* `channels.bluebubbles.actions`：启用/禁用特定操作。
* `channels.bluebubbles.accounts`：多账户配置。

相关全局选项：

* `agents.list[].groupChat.mentionPatterns`（或 `messages.groupChat.mentionPatterns`）。
* `messages.responsePrefix`。

## 寻址/投递目标

优先使用 `chat_guid` 进行稳定路由：

* `chat_guid:iMessage;-;+15555550123`（推荐用于群组）
* `chat_id:123`
* `chat_identifier:...`
* 直接句柄：`+15555550123`、`user@example.com`
  * 如果直接句柄没有现有的私信聊天，OpenClaw 将通过 `POST /api/v1/chat/new` 创建一个。这需要启用 BlueBubbles 私有 API。

## 安全

* Webhook 请求通过将 `guid`/`password` 查询参数或标头与 `channels.bluebubbles.password` 进行比较来验证身份验证。也接受来自 `localhost` 的请求。
* 保持 API 密码和 webhook 端点秘密（将它们视为凭证）。
* Localhost 信任意味着同主机反向代理可能会意外绕过密码。如果代理网关，请在代理处要求身份验证并配置 `gateway.trustedProxies`。请参阅[网关安全](/gateway/security#reverse-proxy-configuration)。
* 如果将 BlueBubbles 服务器暴露在 LAN 外部，请启用 HTTPS + 防火墙规则。

## 故障排除

* 如果输入/已读事件停止工作，请检查 BlueBubbles webhook 日志并验证网关路径与 `channels.bluebubbles.webhookPath` 匹配。
* 配对代码在 1 小时后过期；使用 `openclaw pairing list bluebubbles` 和 `openclaw pairing approve bluebubbles <code>`。
* 反应需要 BlueBubbles 私有 API（`POST /api/v1/message/react`）；确保服务器版本公开它。
* 编辑/撤回需要 macOS 13+ 和兼容的 BlueBubbles 服务器版本。在 macOS 26 (Tahoe) 上，编辑目前因私有 API 更改而不可用。
* 群组图标更新在 macOS 26 (Tahoe) 上可能不稳定：API 可能返回成功但新图标未同步。
* OpenClaw 根据 BlueBubbles 服务器的 macOS 版本自动隐藏已知损坏的操作。如果编辑在 macOS 26 (Tahoe) 上仍然显示，请使用 `channels.bluebubbles.actions.edit=false` 手动禁用它。
* 状态/健康信息：`openclaw status --all` 或 `openclaw status --deep`。

有关常规渠道工作流参考，请参阅[渠道](/channels)和[插件](/tools/plugin)指南。