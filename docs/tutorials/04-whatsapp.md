# WhatsApp 渠道配置

> ## 文档索引
> 获取完整文档索引：https://docs.openclaw.ai/llms.txt

---

## 快速设置

### 步骤 1：配置 WhatsApp 访问策略

```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "pairing",
      allowFrom: ["+15551234567"],
      groupPolicy: "allowlist",
      groupAllowFrom: ["+15551234567"],
    },
  },
}
```

### 步骤 2：链接 WhatsApp（二维码）

```bash
openclaw channels login --channel whatsapp
```

指定账户：
```bash
openclaw channels login --channel whatsapp --account work
```

### 步骤 3：启动网关

```bash
openclaw gateway
```

### 步骤 4：批准第一个配对请求（如果使用配对模式）

```bash
openclaw pairing list whatsapp
openclaw pairing approve whatsapp <CODE>
```

配对请求 1 小时后过期。每个渠道待处理请求上限 3 个。

> 💡 OpenClaw 推荐在可能情况下使用**独立号码**运行 WhatsApp（渠道元数据和引导流程为此优化，但个人号码设置也支持）

---

## 部署模式

### 模式 1：专用号码（推荐）

最清晰的操作模式：
- 独立的 WhatsApp 身份用于 OpenClaw
- 更清晰的 DM 白名单和路由边界
- 更低自聊天混淆风险

最小策略模式：
```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551234567"],
    },
  },
}
```

### 模式 2：个人号码备用

引导支持个人号码模式并写入自聊天友好的基线配置：
- `dmPolicy: "allowlist"`
- `allowFrom` 包含你的个人号码
- `selfChatMode: true`

在运行时，自聊天保护基于链接的自号码和 `allowFrom`。

### 模式 3：WhatsApp Web 渠道范围

消息平台渠道是基于 WhatsApp Web（`Baileys`）的。当前内置聊天渠道注册表中没有单独的 Twilio WhatsApp 消息渠道。

---

## 运行时模型

- Gateway 拥有 WhatsApp socket 和重连循环
- 出站发送需要目标账户的活动 WhatsApp 监听器
- 状态和广播聊天被忽略（`@status`、`@broadcast`）
- 直接聊天使用 DM 会话规则（`session.dmScope`；默认 `main` 将 DM 折叠到 agent main 会话）
- 群组会话隔离（`agent:<agentId>:whatsapp:group:<jid>`）

---

## 访问控制和激活

### DM 策略

`channels.whatsapp.dmPolicy` 控制直接聊天访问：

- `pairing`（默认）
- `allowlist`
- `open`（需要 `allowFrom` 包含 `"*"`）
- `disabled`

`allowFrom` 接受 E.164 格式号码（内部标准化）。

多账户覆盖：`channels.whatsapp.accounts.<id>.dmPolicy`（和 `allowFrom`）优先于该账户的渠道级默认值。

**运行时行为**：
- 配对持久化在渠道允许存储中并与配置的 `allowFrom` 合并
- 如果没有配置白名单，链接的自号码默认允许
- 出站 `fromMe` DM 从不自配对

### 群组策略 + 白名单

群组访问有两层：

1. **群组成员白名单**（`channels.whatsapp.groups`）
   - 如果省略 `groups`，所有群组合格
   - 如果存在 `groups`，它作为群组白名单（允许 `"*"`）

2. **群组发送者策略**（`channels.whatsapp.groupPolicy` + `groupAllowFrom`）
   - `open`：发送者白名单绕过
   - `allowlist`：发送者必须匹配 `groupAllowFrom`（或 `*`）
   - `disabled`：阻止所有群组入站

发送者白名单回退：
- 如果 `groupAllowFrom` 未设置，运行时在可用时回退到 `allowFrom`
- 发送者白名单在提及/回复激活前评估

注意：如果根本不存在 `channels.whatsapp` 块，运行时群组策略回退是 `allowlist`（带警告日志），即使设置了 `channels.defaults.groupPolicy`。

### 提及 + /activation

群组回复默认需要提及。

提及检测包括：
- 明确的机器人身份 WhatsApp 提及
- 配置的提及正则模式（`agents.list[].groupChat.mentionPatterns`，回退 `messages.groupChat.mentionPatterns`）
- 隐式回复机器人检测（回复发送者匹配机器人身份）

**安全说明**：
- 引用/回复仅满足提及门控，**不**授予发送者授权
- 使用 `groupPolicy: "allowlist"`，非白名单发送者仍被阻止，即使他们回复白名单用户的消息

会话级激活命令：
- `/activation mention`
- `/activation always`

`activation` 更新会话状态（不是全局配置）。它是所有者门控的。

---

## 个人号码和自聊天行为

当链接的自号码也存在于 `allowFrom` 中时，WhatsApp 自聊天 safeguard 激活：

- 跳过自聊天回合的已读回执
- 忽略否则会自动 ping 你自己的提及-JID 自动触发行为
- 如果 `messages.responsePrefix` 未设置，自聊天回复默认 `[{identity.name}]` 或 `[openclaw]`

---

## 消息标准化和上下文

### 入站信封 + 回复上下文

入站 WhatsApp 消息包装在共享入站信封中。

如果存在引用回复，上下文以此形式附加：

```text
[Replying to <sender> id:<stanzaId>]
<quoted body or media placeholder>
[/Replying]
```

回复元数据字段在可用时也填充（`ReplyToId`、`ReplyToBody`、`ReplyToSender`、发送者 JID/E.164）。

### 媒体占位符和位置/联系人提取

仅媒体入站消息用占位符标准化：
- `<media:image>`
- `<media:video>`
- `<media:audio>`
- `<media:document>`
- `<media:sticker>`

位置和联系人负载在路由前标准化为文本上下文。

### 待处理群组历史注入

对于群组，未处理的消息可以缓冲并在机器人最终触发时注入为上下文。

- 默认限制：`50`
- 配置：`channels.whatsapp.historyLimit`
- 回退：`messages.groupChat.historyLimit`
- `0` 禁用

注入标记：
- `[Chat messages since your last reply - for context]`
- `[Current message - respond to this]`

### 已读回执

已读回执默认对接受的入站 WhatsApp 消息启用。

**全局禁用**：
```json5
{
  channels: {
    whatsapp: {
      sendReadReceipts: false,
    },
  },
}
```

**每个账户覆盖**：
```json5
{
  channels: {
    whatsapp: {
      accounts: {
        work: {
          sendReadReceipts: false,
        },
      },
    },
  },
}
```

自聊天回合即使全局启用也跳过已读回执。

---

## 交付、分块和媒体

### 文本分块

- 默认分块限制：`channels.whatsapp.textChunkLimit = 4000`
- `channels.whatsapp.chunkMode = "length" | "newline"`
- `newline` 模式偏好段落边界（空行），然后回退到长度安全分块

### 出站媒体行为

- 支持图片、视频、音频（PTT 语音笔记）和文档负载
- `audio/ogg` 重写为 `audio/ogg; codecs=opus` 以兼容语音笔记
- 动画 GIF 播放通过 `gifPlayback: true` 在视频发送上支持
- 标题应用于发送多媒体回复负载时的第一个媒体项
- 媒体源可以是 HTTP(S)、`file://` 或本地路径

### 媒体大小限制和回退行为

- 入站媒体保存上限：`channels.whatsapp.mediaMaxMb`（默认 `50`）
- 出站媒体发送上限：`channels.whatsapp.mediaMaxMb`（默认 `50`）
- 每个账户覆盖使用 `channels.whatsapp.accounts.<accountId>.mediaMaxMb`
- 图片自动优化（调整大小/质量扫描）以适应限制
- 媒体发送失败时，第一项回退发送文本警告而不是静默删除响应

---

## 确认反应

WhatsApp 支持通过 `channels.whatsapp.ackReaction` 在入站接收时立即确认反应。

```json5
{
  channels: {
    whatsapp: {
      ackReaction: {
        emoji: "👀",
        direct: true,
        group: "mentions", // always | mentions | never
      },
    },
  },
}
```

**行为说明**：
- 入站接受后立即发送（回复前）
- 失败记录但不阻止正常回复交付
- 群组模式 `mentions` 在提及触发的回合上反应；群组激活 `always` 作为绕过检查
- WhatsApp 使用 `channels.whatsapp.ackReaction`（不使用传统的 `messages.ackReaction`）

---

## 多账户和凭证

### 账户选择和默认值

- 账户 ID 来自 `channels.whatsapp.accounts`
- 默认账户选择：如果存在 `default`，否则第一个配置的账户 ID（排序）
- 账户 ID 在查找时内部标准化

### 凭证路径和传统兼容

- 当前认证路径：`~/.openclaw/credentials/whatsapp/<accountId>/creds.json`
- 备份文件：`creds.json.bak`
- `~/.openclaw/credentials/` 中的传统默认认证仍被识别/迁移用于默认账户流程

### 登出行为

`openclaw channels logout --channel whatsapp [--account <id>]` 清除该账户的 WhatsApp 认证状态。

在传统认证目录中，`oauth.json` 保留而 Baileys 认证文件被删除。

---

## 工具、动作和配置写入

- Agent 工具支持包括 WhatsApp 反应动作（`react`）
- 动作门控：
  - `channels.whatsapp.actions.reactions`
  - `channels.whatsapp.actions.polls`
- 渠道发起的配置写入默认启用（通过 `channels.whatsapp.configWrites=false` 禁用）

---

## 故障排除

### 未链接（需要二维码）

**症状**：渠道状态报告未链接

**修复**：
```bash
openclaw channels login --channel whatsapp
openclaw channels status
```

### 已链接但断开连接/重连循环

**症状**：链接账户重复断开或重连尝试

**修复**：
```bash
openclaw doctor
openclaw logs --follow
```

如需要，用 `channels login` 重新链接。

### 发送时没有活动监听器

出站发送在目标账户没有活动网关监听器时快速失败。

确保网关运行且账户已链接。

### 群组消息意外被忽略

按此顺序检查：
- `groupPolicy`
- `groupAllowFrom` / `allowFrom`
- `groups` 白名单条目
- 提及门控（`requireMention` + 提及模式）
- `openclaw.json` 中的重复键（JSON5）：后面的条目覆盖前面的条目，所以每个范围保持单个 `groupPolicy`

### Bun 运行时警告

WhatsApp 网关运行时应该使用 Node。Bun 被标记为不兼容稳定的 WhatsApp/Telegram 网关操作。

---

## 配置参考指针

**主要参考**：[配置参考 - WhatsApp](/gateway/configuration-reference#whatsapp)

**高信号 WhatsApp 字段**：
- 访问：`dmPolicy`、`allowFrom`、`groupPolicy`、`groupAllowFrom`、`groups`
- 交付：`textChunkLimit`、`chunkMode`、`mediaMaxMb`、`sendReadReceipts`、`ackReaction`
- 多账户：`accounts.<id>.enabled`、`accounts.<id>.authDir`、账户级覆盖
- 操作：`configWrites`、`debounceMs`、`web.enabled`、`web.heartbeatSeconds`、`web.reconnect.*`
- 会话行为：`session.dmScope`、`historyLimit`、`dmHistoryLimit`、`dms.<id>.historyLimit`

---

## 相关

- [配对](/channels/pairing)
- [渠道路由](/channels/channel-routing)
- [多 Agent 路由](/concepts/multi-agent)
- [故障排除](/channels/troubleshooting)

---

**翻译完成时间**: 2026-03-15 01:10  
**来源**: https://docs.openclaw.ai/channels/whatsapp  
**状态**: ✅ 已完成
