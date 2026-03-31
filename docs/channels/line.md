---
title: line
description: line 页面
---

# LINE

# LINE（插件）

LINE 通过 LINE 消息 API 连接到 OpenClaw。插件在网关上作为 webhook 接收器运行，使用您的频道访问令牌 + 频道密钥进行身份验证。

状态：通过插件支持。支持私信、群组聊天、媒体、位置、Flex 消息、模板消息和快捷回复。不支持反应和线程。

## 需要插件

安装 LINE 插件：

```bash
openclaw plugins install @openclaw/line
```

本地检出（从 git 仓库运行时）：

```bash
openclaw plugins install ./extensions/line
```

## 设置

1. 创建 LINE Developers 账户并打开控制台：
   [https://developers.line.biz/console/](https://developers.line.biz/console/)
2. 创建（或选择）一个 Provider 并添加 **Messaging API** 频道。
3. 从频道设置中复制 **Channel access token** 和 **Channel secret**。
4. 在 Messaging API 设置中启用 **Use webhook**。
5. 将 webhook URL 设置为您的网关端点（需要 HTTPS）：

```
https://gateway-host/line/webhook
```

网关响应 LINE 的 webhook 验证（GET）和入站事件（POST）。如果您需要自定义路径，请设置 `channels.line.webhookPath` 或 `channels.line.accounts.<id>.webhookPath` 并相应更新 URL。

安全说明：

* LINE 签名验证依赖于正文（原始正文的 HMAC），因此 OpenClaw 在验证之前应用严格的预认证正文限制和超时。

## 配置

最小配置：

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "LINE_CHANNEL_ACCESS_TOKEN",
      channelSecret: "LINE_CHANNEL_SECRET",
      dmPolicy: "pairing",
    },
  },
}
```

环境变量（仅默认账户）：

* `LINE_CHANNEL_ACCESS_TOKEN`
* `LINE_CHANNEL_SECRET`

令牌/密钥文件：

```json5
{
  channels: {
    line: {
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
    },
  },
}
```

`tokenFile` 和 `secretFile` 必须指向常规文件。符号链接被拒绝。

多账户：

```json5
{
  channels: {
    line: {
      accounts: {
        marketing: {
          channelAccessToken: "...",
          channelSecret: "...",
          webhookPath: "/line/marketing",
        },
      },
    },
  },
}
```

## 访问控制

私信默认是配对模式。未知发送者收到配对代码，其消息在被批准之前被忽略。

```bash
openclaw pairing list line
openclaw pairing approve line <CODE>
```

白名单和策略：

* `channels.line.dmPolicy`：`pairing | allowlist | open | disabled`
* `channels.line.allowFrom`：私信白名单 LINE 用户 ID
* `channels.line.groupPolicy`：`allowlist | open | disabled`
* `channels.line.groupAllowFrom`：群组白名单 LINE 用户 ID
* 按群组覆盖：`channels.line.groups.<groupId>.allowFrom`
* 运行时注意：如果完全缺少 `channels.line`，运行时回退到 `groupPolicy="allowlist"` 进行群组检查（即使设置了 `channels.defaults.groupPolicy`）。

LINE ID 区分大小写。有效 ID 格式：

* 用户：`U` + 32 个十六进制字符
* 群组：`C` + 32 个十六进制字符
* 房间：`R` + 32 个十六进制字符

## 消息行为

* 文本在 5000 字符处分块。
* Markdown 格式被剥离；代码块和表格在可能时转换为 Flex 卡。
* 流式回复被缓冲；LINE 在代理工作时接收带有加载动画的完整块。
* 媒体下载受 `channels.line.mediaMaxMb` 限制（默认 10）。

## 渠道数据（富消息）

使用 `channelData.line` 发送快捷回复、位置、Flex 卡或模板消息。

```json5
{
  text: "Here you go",
  channelData: {
    line: {
      quickReplies: ["Status", "Help"],
      location: {
        title: "Office",
        address: "123 Main St",
        latitude: 35.681236,
        longitude: 139.767125,
      },
      flexMessage: {
        altText: "Status card",
        contents: {
          /* Flex payload */
        },
      },
      templateMessage: {
        type: "confirm",
        text: "Proceed?",
        confirmLabel: "Yes",
        confirmData: "yes",
        cancelLabel: "No",
        cancelData: "no",
      },
    },
  },
}
```

LINE 插件还提供 `/card` 命令用于 Flex 消息预设：

```
/card info "Welcome" "Thanks for joining!"
```

## 故障排除

* **Webhook 验证失败：** 确保 webhook URL 是 HTTPS 并且 `channelSecret` 与 LINE 控制台匹配。
* **无入站事件：** 确认 webhook 路径与 `channels.line.webhookPath` 匹配并且网关可从 LINE 到达。
* **媒体下载错误：** 如果媒体超过默认限制，请提高 `channels.line.mediaMaxMb`。