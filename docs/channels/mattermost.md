---
title: mattermost
description: mattermost 页面
---

# Mattermost

# Mattermost（插件）

状态：通过插件支持（机器人令牌 + WebSocket 事件）。支持频道、群组和私信。Mattermost 是一个可自托管的团队消息平台；详细信息和下载请访问官方站点 [mattermost.com](https://mattermost.com)。

## 需要插件

Mattermost 作为插件发货，未与核心安装捆绑。

通过 CLI 安装（npm 注册表）：

```bash
openclaw plugins install @openclaw/mattermost
```

本地检出（从 git 仓库运行时）：

```bash
openclaw plugins install ./extensions/mattermost
```

如果您在设置中选择 Mattermost 并且检测到 git 检出，OpenClaw 会自动提供本地安装路径。

详情：[插件](/tools/plugin)

## 快速设置

1. 安装 Mattermost 插件。
2. 创建 Mattermost 机器人账户并复制 **机器人令牌**。
3. 复制 Mattermost **基础 URL**（例如 `https://chat.example.com`）。
4. 配置 OpenClaw 并启动网关。

最小配置：

```json5
{
  channels: {
    mattermost: {
      enabled: true,
      botToken: "mm-token",
      baseUrl: "https://chat.example.com",
      dmPolicy: "pairing",
    },
  },
}
```

## 原生命令

原生命令是可选的。启用后，OpenClaw 通过 Mattermost API 注册 `oc_*` 斜杠命令，并在网关 HTTP 服务器上接收回调 POST。

```json5
{
  channels: {
    mattermost: {
      commands: {
        native: true,
        nativeSkills: true,
        callbackPath: "/api/channels/mattermost/command",
        // 当 Mattermost 无法直接到达网关时使用（反向代理/公共 URL）
        callbackUrl: "https://gateway.example.com/api/channels/mattermost/command",
      },
    },
  },
}
```

注意：

* `native: "auto"` 默认为 Mattermost 禁用。设置 `native: true` 启用。
* 如果省略 `callbackUrl`，OpenClaw 从网关主机/端口 + `callbackPath` 派生一个。
* 对于多账户设置，`commands` 可以设置在顶层或 `channels.mattermost.accounts.<id>.commands`（账户值覆盖顶层字段）。
* 命令回调使用每命令令牌验证，令牌检查失败时关闭。
* 可达性要求：回调端点必须可从 Mattermost 服务器到达。
  * 除非 Mattermost 与 OpenClaw 运行在同一主机/网络命名空间，否则不要将 `callbackUrl` 设置为 `localhost`。
  * 除非该 URL 将 `/api/channels/mattermost/command` 反向代理到 OpenClaw，否则不要将 `callbackUrl` 设置为您的 Mattermost 基础 URL。
  * 快速检查是 `curl https://<gateway-host>/api/channels/mattermost/command`；GET 应从 OpenClaw 返回 `405 Method Not Allowed`，而不是 `404`。
* Mattermost 出口白名单要求：
  * 如果您的回调目标是私有/tailnet/内部地址，请设置 Mattermost `ServiceSettings.AllowedUntrustedInternalConnections` 以包含回调主机/域名。
  * 使用主机/域名条目，而不是完整 URL。
    * 好：`gateway.tailnet-name.ts.net`
    * 坏：`https://gateway.tailnet-name.ts.net`

## 环境变量（默认账户）

如果在网关主机上更喜欢环境变量，请设置：

* `MATTERMOST_BOT_TOKEN=...`
* `MATTERMOST_URL=https://chat.example.com`

环境变量仅适用于 **默认**账户（`default`）。其他账户必须使用配置值。

## 聊天模式

Mattermost 自动回复私信。频道行为由 `chatmode` 控制：

* `oncall`（默认）：仅在频道中被 @提及 时回复。
* `onmessage`：回复每条频道消息。
* `onchar`：当消息以触发前缀开头时回复。

配置示例：

```json5
{
  channels: {
    mattermost: {
      chatmode: "onchar",
      oncharPrefixes: [">", "!"],
    },
  },
}
```

注意：

* `onchar` 仍然响应显式 @提及。
* `channels.mattermost.legacy` 配置支持 `chatmode`。

## 线程和会话

使用 `channels.mattermost.replyToMode` 控制频道和群组回复是在主频道中还是在线程中回复触发帖子。

* `off`（默认）：仅当入站帖子已在线程中时才在线程中回复。
* `first`：对于顶级频道/群组帖子，在该帖子下启动线程并将对话路由到线程作用域会话。
* `all`：与 Mattermost 今天的 `first` 行为相同。
* 私信忽略此设置，保持非线程化。

配置示例：

```json5
{
  channels: {
    mattermost: {
      replyToMode: "all",
    },
  },
}
```

注意：

* 线程作用域会话使用触发帖子 id 作为线程根。
* `first` 和 `all` 当前相同，因为一旦 Mattermost 有线程根，后续块和媒体继续在同一线程中。

## 访问控制（私信）

* 默认：`channels.mattermost.dmPolicy = "pairing"`（未知发送者收到配对代码）。
* 批准方式：
  * `openclaw pairing list mattermost`
  * `openclaw pairing approve mattermost <CODE>`
* 公开私信：`channels.mattermost.dmPolicy="open"` 加上 `channels.mattermost.allowFrom=["*"]`。

## 频道（群组）

* 默认：`channels.mattermost.groupPolicy = "allowlist"`（提及门控）。
* 使用 `channels.mattermost.groupAllowFrom` 白名单发送者（推荐用户 ID）。
* `@username` 匹配是可变的，仅在 `channels.mattermost.dangerouslyAllowNameMatching: true` 时启用。
* 开放频道：`channels.mattermost.groupPolicy="open"`（提及门控）。
* 运行时注意：如果完全缺少 `channels.mattermost`，运行时回退到 `groupPolicy="allowlist"` 进行群组检查（即使设置了 `channels.defaults.groupPolicy`）。

## 出站投递目标

将这些目标格式用于 `openclaw message send` 或 cron/webhook：

* `channel:<id>` 用于频道
* `user:<id>` 用于私信
* `@username` 用于私信（通过 Mattermost API 解析）

裸不透明 ID（如 `64ifufp...`）在 Mattermost 中是**模糊的**（用户 ID vs 频道 ID）。

OpenClaw **首先解析用户**：

* 如果 ID 作为用户存在（`GET /api/v4/users/<id>` 成功），OpenClaw 通过 `/api/v4/channels/direct` 解析直接频道并发送**私信**。
* 否则，ID 被视为**频道 ID**。

如果您需要确定性行为，请始终使用明确的前缀（`user:<id>` / `channel:<id>`）。

## 私信频道重试

当 OpenClaw 发送 Mattermost 私信目标并需要先解析直接频道时，它默认重试瞬态直接频道创建失败。

使用 `channels.mattermost.dmChannelRetry` 全局调整 Mattermost 插件的行为，或使用 `channels.mattermost.accounts.<id>.dmChannelRetry` 调整一个账户。

```json5
{
  channels: {
    mattermost: {
      dmChannelRetry: {
        maxRetries: 3,
        initialDelayMs: 1000,
        maxDelayMs: 10000,
        timeoutMs: 30000,
      },
    },
  },
}
```

注意：

* 这仅适用于私信频道创建（`/api/v4/channels/direct`），而不是每个 Mattermost API 调用。
* 重试适用于瞬态失败，如速率限制、5xx 响应和网络或超时错误。
* 4xx 客户端错误（除 `429` 外）被视为永久性的，不会重试。

## 反应（消息工具）

* 使用 `message action=react` 与 `channel=mattermost`。
* `messageId` 是 Mattermost 帖子 id。
* `emoji` 接受名称如 `thumbsup` 或 `:+1:`（冒号可选）。
* 设置 `remove=true`（布尔值）移除反应。
* 反应添加/移除事件作为系统事件转发到路由的代理会话。

示例：

```
message action=react channel=mattermost target=channel:<channelId> messageId=<postId> emoji=thumbsup
message action=react channel=mattermost target=channel:<channelId> messageId=<postId> emoji=thumbsup remove=true
```

配置：

* `channels.mattermost.actions.reactions`：启用/禁用反应操作（默认 true）。
* 按账户覆盖：`channels.mattermost.accounts.<id>.actions.reactions`。

## 交互式按钮（消息工具）

发送带有可点击按钮的消息。当用户点击按钮时，代理接收选择并可以回复。

通过将 `inlineButtons` 添加到渠道功能来启用按钮：

```json5
{
  channels: {
    mattermost: {
      capabilities: ["inlineButtons"],
    },
  },
}
```

使用带有 `buttons` 参数的 `message action=send`。按钮是 2D 数组（按钮行）：

```
message action=send channel=mattermost target=channel:<channelId> buttons=[[{"text":"Yes","callback_data":"yes"},{"text":"No","callback_data":"no"}]]
```

按钮字段：

* `text`（必需）：显示标签。
* `callback_data`（必需）：点击时发送回的值（用作操作 ID）。
* `style`（可选）：`"default"`、`"primary"` 或 `"danger"`。

当用户点击按钮时：

1. 所有按钮被替换为确认行（例如"✓ **Yes** selected by @user"）。
2. 代理将选择作为入站消息接收并回复。

注意：

* 按钮回调使用 HMAC-SHA256 验证（自动，无需配置）。
* Mattermost 从其 API 响应中剥离回调数据（安全功能），因此点击时所有按钮都被移除——无法部分移除。
* 包含连字符或下划线的操作 ID 会自动清理（Mattemost 路由限制）。

配置：

* `channels.mattermost.capabilities`：功能字符串数组。添加 `"inlineButtons"` 以在代理系统提示中启用按钮工具描述。
* `channels.mattermost.interactions.callbackBaseUrl`：按钮回调的可选外部基础 URL（例如 `https://gateway.example.com`）。当 Mattermost 无法直接在其绑定主机上到达网关时使用此选项。
* 在多账户设置中，您也可以在同一字段下设置 `channels.mattermost.accounts.<id>.interactions.callbackBaseUrl`。
* 如果省略 `interactions.callbackBaseUrl`，OpenClaw 从 `gateway.customBindHost` + `gateway.port` 派生回调 URL，然后回退到 `http://localhost:<port>`。
* 可达性规则：按钮回调 URL 必须可从 Mattermost 服务器到达。`localhost` 仅在 Mattermost 和 OpenClaw 运行在同一主机/网络命名空间时有效。
* 如果您的回调目标是私有/tailnet/内部，请将其主机/域名添加到 Mattermost `ServiceSettings.AllowedUntrustedInternalConnections`。

### 直接 API 集成（外部脚本）

外部脚本和 webhook 可以通过 Mattermost REST API 直接发送按钮，而不是通过代理的 `message` 工具。尽可能使用扩展中的 `buildButtonAttachments()`；如果发布原始 JSON，请遵循以下规则：

**有效载荷结构：**

```json5
{
  channel_id: "<channelId>",
  message: "Choose an option:",
  props: {
    attachments: [
      {
        actions: [
          {
            id: "mybutton01", // 仅字母数字 - 见下文
            type: "button", // 必需，否则点击被静默忽略
            name: "Approve", // 显示标签
            style: "primary", // 可选："default"、"primary"、"danger"
            integration: {
              url: "https://gateway.example.com/mattermost/interactions/default",
              context: {
                action_id: "mybutton01", // 必须匹配按钮 id（用于名称查找）
                action: "approve",
                // ... 任何自定义字段 ...
                _token: "<hmac>", // 见下文 HMAC 部分
              },
            },
          },
        ],
      },
    ],
  },
}
```

**关键规则：**

1. 附件放在 `props.attachments` 中，而不是顶层 `attachments`（静默忽略）。
2. 每个操作需要 `type: "button"` —— 没有它，点击被静默吞下。
3. 每个操作需要 `id` 字段 —— Mattermost 忽略没有 ID 的操作。
4. 操作 `id` 必须是**仅字母数字**（`[a-zA-Z0-9]`）。连字符和下划线会破坏 Mattermost 的服务器端操作路由（返回 404）。使用前剥离它们。
5. `context.action_id` 必须匹配按钮的 `id`，以便确认消息显示按钮名称（例如"Approve"）而不是原始 ID。
6. `context.action_id` 是必需的 —— 没有它，交互处理程序返回 400。

**HMAC 令牌生成：**

网关使用 HMAC-SHA256 验证按钮点击。外部脚本必须生成与网关验证逻辑匹配的令牌：

1. 从机器人令牌派生密钥：
   `HMAC-SHA256(key="openclaw-mattermost-interactions", data=botToken)`
2. 构建包含所有字段（**除** `_token` 之外）的上下文对象。
3. 使用**排序键**和**无空格**序列化（网关使用 `JSON.stringify` 和排序键，产生紧凑输出）。
4. 签名：`HMAC-SHA256(key=secret, data=serializedContext)`
5. 将生成的十六进制摘要作为 `_token` 添加到上下文中。

Python 示例：

```python
import hmac, hashlib, json

secret = hmac.new(
    b"openclaw-mattermost-interactions",
    bot_token.encode(), hashlib.sha256
).hexdigest()

ctx = {"action_id": "mybutton01", "action": "approve"}
payload = json.dumps(ctx, sort_keys=True, separators=(",", ":"))
token = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()

context = {**ctx, "_token": token}
```

常见 HMAC 陷阱：

* Python 的 `json.dumps` 默认添加空格（`{"key": "val"}`）。使用 `separators=(",", ":")` 来匹配 JavaScript 的紧凑输出（`{"key":"val"}`）。
* 始终签署**所有**上下文字段（减去 `_token`）。网关剥离 `_token` 然后签署剩余内容。签署子集会导致静默验证失败。
* 使用 `sort_keys=True` —— 网关在签名之前对键进行排序，存储有效载荷时 Mattermost 可能会重新排序上下文字段。
* 从机器人令牌派生密钥（确定性的），而不是随机字节。创建按钮和验证的网关必须使用相同的密钥。

## 目录适配器

Mattermost 插件包含一个目录适配器，通过 Mattermost API 解析频道和用户名。这使得 `openclaw message send` 和 cron/webhook 投递中的 `#channel-name` 和 `@username` 目标成为可能。

无需配置 —— 适配器使用账户配置中的机器人令牌。

## 多账户

Mattermost 支持在 `channels.mattermost.accounts` 下使用多个账户：

```json5
{
  channels: {
    mattermost: {
      accounts: {
        default: { name: "Primary", botToken: "mm-token", baseUrl: "https://chat.example.com" },
        alerts: { name: "Alerts", botToken: "mm-token-2", baseUrl: "https://alerts.example.com" },
      },
    },
  },
}
```

## 故障排除

* 频道中无回复：确保机器人在频道中并提及它（oncall），使用触发前缀（onchar），或设置 `chatmode: "onmessage"`。
* 认证错误：检查机器人令牌、基础 URL，以及账户是否启用。
* 多账户问题：环境变量仅适用于 `default` 账户。
* 按钮显示为白色框：代理可能发送了格式错误的按钮数据。检查每个按钮是否都有 `text` 和 `callback_data` 字段。
* 按钮渲染但点击无效：验证 Mattermost 服务器配置中的 `AllowedUntrustedInternalConnections` 包含 `127.0.0.1 localhost`，并且 `ServiceSettings` 中 `EnablePostActionIntegration` 为 `true`。
* 点击返回 404：按钮 `id` 可能包含连字符或下划线。Mattemost 的操作路由在非字母数字 ID 上中断。仅使用 `[a-zA-Z0-9]`。
* 网关日志 `invalid _token`：HMAC 不匹配。检查您是否签署了所有上下文字段（不是子集），使用排序键，并使用紧凑 JSON（无空格）。见上文 HMAC 部分。
* 网关日志 `missing _token in context`：`_token` 字段不在按钮的上下文中。确保在构建集成有效载荷时包含它。
* 确认显示原始 ID 而不是按钮名称：`context.action_id` 与按钮的 `id` 不匹配。将两者设置为相同的清理值。
* 代理不知道按钮：在 Mattermost 渠道配置中添加 `capabilities: ["inlineButtons"]`。