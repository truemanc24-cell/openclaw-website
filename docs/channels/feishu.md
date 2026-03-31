---
title: feishu
description: feishu 页面
---

# 飞书

# 飞书机器人

飞书（ Lark ）是企业用于消息协作的团队聊天平台。此插件将 OpenClaw 连接到飞书/钉钉机器人，使用平台的 WebSocket 事件订阅，这样可以在不公开 webhook URL 的情况下接收消息。

***

## 捆绑插件

飞书与当前 OpenClaw 版本捆绑在一起，因此不需要单独安装插件。

如果您使用的是不包含捆绑飞书的旧版本或自定义安装，请手动安装：

```bash
openclaw plugins install @openclaw/feishu
```

***

## 快速开始

有两种方式添加飞书渠道：

### 方式 1：配置向导（推荐）

如果您刚安装 OpenClaw，请运行配置向导：

```bash
openclaw onboard
```

向导会引导您：

1. 创建飞书应用并收集凭证
2. 在 OpenClaw 中配置应用凭证
3. 启动网关

✅ **配置后**，检查网关状态：

* `openclaw gateway status`
* `openclaw logs --follow`

### 方式 2：CLI 设置

如果您已完成初始安装，请通过 CLI 添加渠道：

```bash
openclaw channels add
```

选择 **飞书**，然后输入 App ID 和 App Secret。

✅ **配置后**，管理网关：

* `openclaw gateway status`
* `openclaw gateway restart`
* `openclaw logs --follow`

***

## 步骤 1：创建飞书应用

### 1. 打开飞书开放平台

访问 [飞书开放平台](https://open.feishu.cn/app) 并登录。

Lark（国际版）租户应使用 [https://open.larksuite.com/app](https://open.larksuite.com/app) 并在飞书配置中设置 `domain: "lark"`。

### 2. 创建应用

1. 点击 **创建企业应用**
2. 填写应用名称 + 描述
3. 选择应用图标

### 3. 复制凭证

从 **凭证与基础信息**，复制：

* **App ID**（格式：`cli_xxx`）
* **App Secret**

❗ **重要：** 保持 App Secret 私密。

### 4. 配置权限

在 **权限**，点击 **批量导入** 并粘贴：

```json
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application:self_manage",
      "application:bot.menu:write",
      "cardkit:card:read",
      "cardkit:card:write",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "event:ip_list",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:resource"
    ],
    "user": ["aily:file:read", "aily:file:write", "im:chat.access_event.bot_p2p_chat:read"]
  }
}
```

### 5. 启用机器人能力

在 **应用能力** > **机器人**：

1. 启用机器人能力
2. 设置机器人名称

### 6. 配置事件订阅

⚠️ **重要：** 在设置事件订阅之前，请确保：

1. 您已经为飞书运行了 `openclaw channels add`
2. 网关正在运行（`openclaw gateway status`）

在 **事件订阅**：

1. 选择 **使用长连接接收事件**（WebSocket）
2. 添加事件：`im.message.receive_v1`

⚠️ 如果网关未运行，长连接设置可能会无法保存。

### 7. 发布应用

1. 在 **版本管理与发布** 中创建版本
2. 提交审核并发布
3. 等待管理员批准（企业应用通常自动批准）

***

## 步骤 2：配置 OpenClaw

### 通过向导配置（推荐）

```bash
openclaw channels add
```

选择 **飞书** 并粘贴您的 App ID + App Secret。

### 通过配置文件配置

编辑 `~/.openclaw/openclaw.json`：

```json5
{
  channels: {
    feishu: {
      enabled: true,
      dmPolicy: "pairing",
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
          botName: "My AI assistant",
        },
      },
    },
  },
}
```

如果您使用 `connectionMode: "webhook"`，请同时设置 `verificationToken` 和 `encryptKey`。飞书 webhook 服务器默认绑定到 `127.0.0.1`；仅在您故意需要不同的绑定地址时才设置 `webhookHost`。

#### 验证 Token 和加密 Key（ webhook 模式）

使用 webhook 模式时，请在配置中设置 `channels.feishu.verificationToken` 和 `channels.feishu.encryptKey`。获取方法：

1. 在飞书开放平台，打开您的应用
2. 进入 **开发配置** → **事件与回调**
3. 打开 **加密策略** 选项卡
4. 复制 **验证 Token** 和 **加密 Key**

### 通过环境变量配置

```bash
export FEISHU_APP_ID="cli_xxx"
export FEISHU_APP_SECRET="xxx"
```

### Lark（国际版）域名

如果您的租户使用 Lark（国际版），请将域名设置为 `lark`（或完整域名字符串）。您可以在 `channels.feishu.domain` 或按账户（`channels.feishu.accounts.<id>.domain`）设置。

```json5
{
  channels: {
    feishu: {
      domain: "lark",
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
        },
      },
    },
  },
}
```

### 配额优化标志

您可以使用两个可选标志来减少飞书 API 使用：

* `typingIndicator`（默认 `true`）：当 `false` 时，跳过输入反应调用。
* `resolveSenderNames`（默认 `true`）：当 `false` 时，跳过发送者个人资料查找调用。

在顶层或按账户设置：

```json5
{
  channels: {
    feishu: {
      typingIndicator: false,
      resolveSenderNames: false,
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
          typingIndicator: true,
          resolveSenderNames: false,
        },
      },
    },
  },
}
```

***

## 步骤 3：启动 + 测试

### 1. 启动网关

```bash
openclaw gateway
```

### 2. 发送测试消息

在飞书中，找到您的机器人并发送消息。

### 3. 批准配对

默认情况下，机器人会回复配对代码。批准它：

```bash
openclaw pairing approve feishu <CODE>
```

批准后，您可以正常聊天。

***

## 概述

* **飞书机器人渠道**：由网关管理的飞书机器人
* **确定性路由**：回复始终返回飞书
* **会话隔离**：私信共享主会话；群组隔离
* **WebSocket 连接**：通过飞书 SDK 的长连接，无需公共 URL

***

## 访问控制

### 私信

* **默认**：`dmPolicy: "pairing"`（未知用户收到配对代码）

* **批准配对**：

  ```bash
  openclaw pairing list feishu
  openclaw pairing approve feishu <CODE>
  ```

* **白名单模式**：在 `channels.feishu.allowFrom` 中设置允许的 Open ID

### 群组聊天

**1. 群组策略**（`channels.feishu.groupPolicy`）：

* `"open"` = 允许群组中的所有人（默认）
* `"allowlist"` = 仅允许 `groupAllowFrom`
* `"disabled"` = 禁用群组消息

**2. 提及要求**（`channels.feishu.groups.<chat_id>.requireMention`）：

* `true` = 需要 @提及（默认）
* `false` = 无需提及即可回复

***

## 群组配置示例

### 允许所有群组，需要 @提及（默认）

```json5
{
  channels: {
    feishu: {
      groupPolicy: "open",
      // 默认 requireMention: true
    },
  },
}
```

### 允许所有群组，无需 @提及

```json5
{
  channels: {
    feishu: {
      groups: {
        oc_xxx: { requireMention: false },
      },
    },
  },
}
```

### 仅允许特定群组

```json5
{
  channels: {
    feishu: {
      groupPolicy: "allowlist",
      // 飞书群组 ID（chat_id）格式：oc_xxx
      groupAllowFrom: ["oc_xxx", "oc_yyy"],
    },
  },
}
```

### 限制群组中哪些发送者可以发送消息（发送者白名单）

除了允许群组本身，该群组中的**所有消息**都按发送者 open_id 门控：只有列在 `groups.<chat_id>.allowFrom` 中的用户的消息会被处理；其他成员的消息会被忽略（这是完整的发送者级别门控，而不仅仅是控制命令如 /reset 或 /new）。

```json5
{
  channels: {
    feishu: {
      groupPolicy: "allowlist",
      groupAllowFrom: ["oc_xxx"],
      groups: {
        oc_xxx: {
          // 飞书用户 ID（open_id）格式：ou_xxx
          allowFrom: ["ou_user1", "ou_user2"],
        },
      },
    },
  },
}
```

***

## 获取群组/用户 ID

### 群组 ID（chat_id）

群组 ID 格式为 `oc_xxx`。

**方式 1（推荐）**

1. 启动网关并在群组中 @提及机器人
2. 运行 `openclaw logs --follow` 并查找 `chat_id`

**方式 2**

使用飞书 API 调试器列出群组聊天。

### 用户 ID（open_id）

用户 ID 格式为 `ou_xxx`。

**方式 1（推荐）**

1. 启动网关并私信机器人
2. 运行 `openclaw logs --follow` 并查找 `open_id`

**方式 2**

查看配对请求中的用户 Open ID：

```bash
openclaw pairing list feishu
```

***

## 常用命令

| 命令   | 描述           |
| ------ | -------------- |
| `/status` | 显示机器人状态 |
| `/reset` | 重置会话       |
| `/model` | 显示/切换模型 |

> 注意：飞书尚不支持原生命令菜单，因此命令必须作为文本发送。

## 网关管理命令

| 命令                    | 描述                   |
| --------------------- | --------------------- |
| `openclaw gateway status`  | 显示网关状态           |
| `openclaw gateway install` | 安装/启动网关服务     |
| `openclaw gateway stop`    | 停止网关服务           |
| `openclaw gateway restart` | 重启网关服务           |
| `openclaw logs --follow`   | 跟踪网关日志           |

***

## 故障排除

### 机器人在群组聊天中不响应

1. 确保机器人已添加到群组
2. 确保您 @提及了机器人（默认行为）
3. 检查 `groupPolicy` 未设置为 `"disabled"`
4. 检查日志：`openclaw logs --follow`

### 机器人收不到消息

1. 确保应用已发布并获得批准
2. 确保事件订阅包含 `im.message.receive_v1`
3. 确保 **长连接** 已启用
4. 确保应用权限完整
5. 确保网关正在运行：`openclaw gateway status`
6. 检查日志：`openclaw logs --follow`

### App Secret 泄露

1. 在飞书开放平台重置 App Secret
2. 在配置中更新 App Secret
3. 重启网关

### 消息发送失败

1. 确保应用有 `im:message:send_as_bot` 权限
2. 确保应用已发布
3. 检查日志以获取详细错误

***

## 高级配置

### 多账户

```json5
{
  channels: {
    feishu: {
      defaultAccount: "main",
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
          botName: "Primary bot",
        },
        backup: {
          appId: "cli_yyy",
          appSecret: "yyy",
          botName: "Backup bot",
          enabled: false,
        },
      },
    },
  },
}
```

`defaultAccount` 控制出站 API 未明确指定 `accountId` 时使用哪个飞书账户。

### 消息限制

* `textChunkLimit`：出站文本块大小（默认：2000 字符）
* `mediaMaxMb`：媒体上传/下载限制（默认：30MB）

### 流式传输

飞书通过交互式卡片支持流式回复。启用后，机器人在生成文本时更新卡片。

```json5
{
  channels: {
    feishu: {
      streaming: true, // 启用流式卡片输出（默认 true）
      blockStreaming: true, // 启用块级流式传输（默认 true）
    },
  },
}
```

设置 `streaming: false` 以等待完整回复后再发送。

### ACP 会话

飞书支持 ACP 用于：

* 私信
* 群组话题对话

飞书 ACP 是文本命令驱动的。没有原生斜杠命令菜单，因此直接在对话中使用 `/acp ...` 消息。

#### 持久化 ACP 绑定

使用顶层类型化 ACP 绑定将飞书私信或话题对话固定到持久化 ACP 会话。

```json5
{
  agents: {
    list: [
      {
        id: "codex",
        runtime: {
          type: "acp",
          acp: {
            agent: "codex",
            backend: "acpx",
            mode: "persistent",
            cwd: "/workspace/openclaw",
          },
        },
      },
    ],
  },
  bindings: [
    {
      type: "acp",
      agentId: "codex",
      match: {
        channel: "feishu",
        accountId: "default",
        peer: { kind: "direct", id: "ou_1234567890" },
      },
    },
    {
      type: "acp",
      agentId: "codex",
      match: {
        channel: "feishu",
        accountId: "default",
        peer: { kind: "group", id: "oc_group_chat:topic:om_topic_root" },
      },
      acp: { label: "codex-feishu-topic" },
    },
  ],
}
```

#### 从聊天中绑定 ACP 会话 spawn

在飞书私信或话题对话中，您可以 spawn 并就地绑定 ACP 会话：

```
/acp spawn codex --thread here
```

注意：

* `--thread here` 适用于私信和飞书话题。
* 绑定私信/话题中的后续消息直接路由到该 ACP 会话。
* v1 不针对通用非话题群组聊天。

### 多代理路由

使用 `bindings` 将飞书私信或群组路由到不同的代理。

```json5
{
  agents: {
    list: [
      { id: "main" },
      {
        id: "clawd-fan",
        workspace: "/home/user/clawd-fan",
        agentDir: "/home/user/.openclaw/agents/clawd-fan/agent",
      },
      {
        id: "clawd-xi",
        workspace: "/home/user/clawd-xi",
        agentDir: "/home/user/.openclaw/agents/clawd-xi/agent",
      },
    ],
  },
  bindings: [
    {
      agentId: "main",
      match: {
        channel: "feishu",
        peer: { kind: "direct", id: "ou_xxx" },
      },
    },
    {
      agentId: "clawd-fan",
      match: {
        channel: "feishu",
        peer: { kind: "direct", id: "ou_yyy" },
      },
    },
    {
      agentId: "clawd-xi",
      match: {
        channel: "feishu",
        peer: { kind: "group", id: "oc_zzz" },
      },
    },
  ],
}
```

路由字段：

* `match.channel`：`"feishu"`
* `match.peer.kind`：`"direct"` 或 `"group"`
* `match.peer.id`：用户 Open ID（`ou_xxx`）或群组 ID（`oc_xxx`）

请参阅[获取群组/用户 ID](#get-groupuser-ids) 获取查找提示。

***

## 配置参考

完整配置：[网关配置](/gateway/configuration)

关键选项：

| 设置                                           | 描述                             | 默认值          |
| ------------------------------------------------- | --------------------------------------- | ---------------- |
| `channels.feishu.enabled`                         | 启用/禁用渠道                  | `true`           |
| `channels.feishu.domain`                          | API 域名（`feishu` 或 `lark`）         | `feishu`         |
| `channels.feishu.connectionMode`                  | 事件传输模式                    | `websocket`      |
| `channels.feishu.defaultAccount`                  | 出站路由的默认账户 ID | `default`        |
| `channels.feishu.verificationToken`               | Webhook 模式必需               | -                |
| `channels.feishu.encryptKey`                      | Webhook 模式必需               | -                |
| `channels.feishu.webhookPath`                     | Webhook 路由路径                      | `/feishu/events` |
| `channels.feishu.webhookHost`                     | Webhook 绑定主机                       | `127.0.0.1`      |
| `channels.feishu.webhookPort`                     | Webhook 绑定端口                       | `3000`           |
| `channels.feishu.accounts.<id>.appId`             | App ID                                  | -                |
| `channels.feishu.accounts.<id>.appSecret`         | App Secret                              | -                |
| `channels.feishu.accounts.<id>.domain`            | 按账户 API 域名覆盖         | `feishu`         |
| `channels.feishu.dmPolicy`                        | 私信策略                               | `pairing`        |
| `channels.feishu.allowFrom`                       | 私信白名单（open_id 列表）            | -                |
| `channels.feishu.groupPolicy`                     | 群组策略                            | `open`           |
| `channels.feishu.groupAllowFrom`                  | 群组白名单                         | -                |
| `channels.feishu.groups.<chat_id>.requireMention` | 需要 @提及                        | `true`           |
| `channels.feishu.groups.<chat_id>.enabled`        | 启用群组                            | `true`           |
| `channels.feishu.textChunkLimit`                  | 消息块大小                      | `2000`           |
| `channels.feishu.mediaMaxMb`                      | 媒体大小限制                        | `30`             |
| `channels.feishu.streaming`                       | 启用流式卡片输出            | `true`           |
| `channels.feishu.blockStreaming`                  | 启用块流式传输                  | `true`           |

***

## dmPolicy 参考

| 值            | 行为                                                        |
| ------------- | --------------------------------------------------------------- |
| `"pairing"`   | **默认。** 未知用户收到配对代码；必须被批准 |
| `"allowlist"` | 仅允许列表中的用户可以聊天                              |
| `"open"`      | 允许所有用户（需要白名单中有 `"*"`）                   |
| `"disabled"`  | 禁用私信                                                     |

***

## 支持的消息类型

### 接收

* ✅ 文本
* ✅ 富文本（帖子）
* ✅ 图片
* ✅ 文件
* ✅ 音频
* ✅ 视频/媒体
* ✅ 贴纸

### 发送

* ✅ 文本
* ✅ 图片
* ✅ 文件
* ✅ 音频
* ✅ 视频/媒体
* ✅ 交互式卡片
* ⚠️ 富文本（帖子格式和卡片，不支持任意飞书创作功能）

### 线程和回复

* ✅ 内联回复
* ✅ 飞书公开 `reply_in_thread` 的话题-线程回复
* ✅ 媒体回复在回复线程/话题消息时保持线程感知

## 运行时操作

飞书目前公开这些运行时操作：

* `send`
* `read`
* `edit`
* `thread-reply`
* `pin`
* `list-pins`
* `unpin`
* `member-info`
* `channel-info`
* `channel-list`
* `reactions` 和 `reactions`（当在配置中启用反应时）