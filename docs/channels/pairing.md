# 配对

# 配对

"配对"是 OpenClaw 的明确**所有者批准**步骤。
它用于两个地方：

1. **私信配对**（谁允许与机器人交谈）
2. **节点配对**（哪些设备/节点允许加入网关网络）

安全上下文：[安全](/gateway/security)

## 1) 私信配对（入站聊天访问）

当渠道配置为 DM 策略 `pairing` 时，未知发送者收到短代码，并且他们的消息**不会被处理**直到您批准。

默认 DM 策略记录在：[安全](/gateway/security)

配对代码：

* 8 个字符，大写，无歧义字符（`0O1I`）。
* **1 小时后过期**。机器人仅在新请求创建时发送配对消息（大约每发送者每小时一次）。
* 待处理私信配对请求默认上限为**每个渠道 3 个**；额外请求被忽略直到一个过期或被批准。

### 批准发送者

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

支持的渠道：`telegram`、`whatsapp`、`signal`、`imessage`、`discord`、`slack`、`feishu`。

### 状态存储位置

存储在 `~/.openclaw/credentials/`：

* 待处理请求：`<channel>-pairing.json`
* 批准的白名单存储：
  * 默认账户：`<channel>-allowFrom.json`
  * 非默认账户：`<channel>-<accountId>-allowFrom.json`

账户作用域行为：

* 非默认账户仅读写其作用域的白名单文件。
* 默认账户使用通道作用域的非作用域白名单文件。

将这些视为敏感（它们控制对您助手的访问）。

## 2) 节点设备配对（iOS/Android/macOS/无头节点）

节点作为具有 `role: node` 的**设备**连接到网关。网关创建设备配对请求，必须被批准。

### 通过 Telegram 配对（推荐用于 iOS）

如果您使用 `device-pair` 插件，您可以完全从 Telegram 进行首次设备配对：

1. 在 Telegram 中，向您的机器人发送消息：`/pair`
2. 机器人回复两条消息：一条说明消息和一条单独的**设置代码**消息（在 Telegram 中易于复制/粘贴）。
3. 在您的手机上，打开 OpenClaw iOS 应用 → 设置 → 网关。
4. 粘贴设置代码并连接。
5. 回到 Telegram：`/pair approve`

设置代码是包含以下内容的 base64 编码 JSON 有效载荷：

* `url`：网关 WebSocket URL（`ws://...` 或 `wss://...`）
* `bootstrapToken`：用于初始配对握手的短期单设备引导令牌

在设置代码有效时，将其视为密码。

### 批准节点设备

```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw devices reject <requestId>
```

### 节点配对状态存储

存储在 `~/.openclaw/devices/`：

* `pending.json`（短期存在；待处理请求过期）
* `paired.json`（已配对设备 + 令牌）

注意：

* 传统 `node.pair.*` API（CLI：`openclaw nodes pending/approve`）是单独的网关拥有的配对存储。WS 节点仍然需要设备配对。

## 相关文档

* 安全模型 + 提示注入：[安全](/gateway/security)
* 安全更新（运行 doctor）：[更新](/install/updating)
* 渠道配置：
  * Telegram：[Telegram](/channels/telegram)
  * WhatsApp：[WhatsApp](/channels/whatsapp)
  * Signal：[Signal](/channels/signal)
  * BlueBubbles (iMessage)：[BlueBubbles](/channels/bluebubbles)
  * iMessage（传统）：[iMessage](/channels/imessage)
  * Discord：[Discord](/channels/discord)
  * Slack：[Slack](/channels/slack)