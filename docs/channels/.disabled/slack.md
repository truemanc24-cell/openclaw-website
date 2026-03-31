---
title: slack
description: slack 页面
---

# Slack

# Slack

状态：通过 Slack 应用集成的私信和频道生产就绪。默认模式是 Socket 模式；也支持 HTTP Events API 模式。

<CardGroup cols={3}>
  <Card title="配对" icon="link" href="/channels/pairing">
    Slack 私信默认为配对模式。
  </Card>

  <Card title="斜杠命令" icon="terminal" href="/tools/slash-commands">
    原生命令行为和命令目录。
  </Card>

  <Card title="渠道故障排除" icon="wrench" href="/channels/troubleshooting">
    跨渠道诊断和修复手册。
  </Card>
</CardGroup>

## 快速设置

<Tabs>
  <Tab title="Socket 模式（默认）">
    <Steps>
      <Step title="创建 Slack 应用和令牌">
        在 Slack 应用设置中：

        * 启用 **Socket Mode**
        * 创建 **App Token**（`xapp-...`）带有 `connections:write`
        * 安装应用并复制 **Bot Token**（`xoxb-...`）
      </Step>

      <Step title="配置 OpenClaw">
        ```json5
        {
          channels: {
            slack: {
              enabled: true,
              mode: "socket",
              appToken: "xapp-...",
              botToken: "xoxb-...",
            },
          },
        }
        ```

        环境回退（仅默认账户）：

        ```bash
        SLACK_APP_TOKEN=xapp-...
        SLACK_BOT_TOKEN=xoxb-...
        ```
      </Step>

      <Step title="订阅应用事件">
        订阅机器人事件：

        * `app_mention`
        * `message.channels`、`message.groups`、`message.im`、`message.mpim`
        * `reaction_added`、`reaction_removed`
        * `member_joined_channel`、`member_left_channel`
        * `channel_rename`
        * `pin_added`、`pin_removed`

        还需要为私信启用应用首页 **Messages Tab**。
      </Step>

      <Step title="启动网关">
        ```bash
        openclaw gateway
        ```
      </Step>
    </Steps>
  </Tab>

  <Tab title="HTTP Events API 模式">
    <Steps>
      <Step title="为 HTTP 配置 Slack 应用">
        * 设置模式为 HTTP（`channels.slack.mode="http"`）
        * 复制 Slack **Signing Secret**
        * 将 Event Subscriptions + Interactivity + Slash command Request URL 设置为同一 webhook 路径（默认 `/slack/events`）
      </Step>

      <Step title="配置 OpenClaw HTTP 模式">
        ```json5
        {
          channels: {
            slack: {
              enabled: true,
              mode: "http",
              botToken: "xoxb-...",
              signingSecret: "your-signing-secret",
              webhookPath: "/slack/events",
            },
          },
        }
      ```
      </Step>

      <Step title="为多账户 HTTP 使用唯一 webhook 路径">
        支持每账户 HTTP 模式。

        给每个账户一个不同的 `webhookPath` 以避免注册冲突。
      </Step>
    </Steps>
  </Tab>
</Tabs>

## 令牌模型

* Socket 模式需要 `botToken` + `appToken`。
* HTTP 模式需要 `botToken` + `signingSecret`。
* 配置令牌覆盖环境回退。
* `SLACK_BOT_TOKEN` / `SLACK_APP_TOKEN` 环境回退仅适用于默认账户。
* `userToken`（`xoxp-...`）是仅配置的（无环境回退），默认为只读行为（`userTokenReadOnly: true`）。
* 可选：如果您希望出站消息使用活动代理身份（自定义 `username` 和图标），添加 `chat:write.customize`。`icon_emoji` 使用 `:emoji_name:` 语法。

<Tip>
  对于操作/目录读取，可以在配置时优先使用用户令牌。对于写入，机器人令牌保持优先；仅当 `userTokenReadOnly: false` 且机器人令牌不可用时才允许用户令牌写入。
</Tip>

## 访问控制和路由

<Tabs>
  <Tab title="私信策略">
    `channels.slack.dmPolicy` 控制私信访问（传统：`channels.slack.dm.policy`）：

    * `pairing`（默认）
    * `allowlist`
    * `open`（需要 `channels.slack.allowFrom` 包含 `"*"`；传统：`channels.slack.dm.allowFrom`）
    * `disabled`

    私信标志：

    * `dm.enabled`（默认 true）
    * `channels.slack.allowFrom`（首选）
    * `dm.allowFrom`（传统）
    * `dm.groupEnabled`（群组私信默认 false）
    * `dm.groupChannels`（可选 MPIM 白名单）

    多账户优先级：

    * `channels.slack.accounts.default.allowFrom` 仅适用于 `default` 账户。
    * 命名账户在设置自己的 `allowFrom` 时继承 `channels.slack.allowFrom`。
    * 命名账户不继承 `channels.slack.accounts.default.allowFrom`。

    私信中配对使用 `openclaw pairing approve slack <code>`。
  </Tab>

  <Tab title="频道策略">
    `channels.slack.groupPolicy` 控制频道处理：

    * `open`
    * `allowlist`
    * `disabled`

    频道白名单位于 `channels.slack.channels` 下，应使用稳定的频道 ID。

    运行时注意：如果完全缺少 `channels.slack`（仅环境变量设置），运行时回退到 `groupPolicy="allowlist"` 并记录警告（即使 `channels.defaults.groupPolicy` 已设置）。

    名称/ID 解析：

    * 频道白名单条目和私信白名单条目在启动时在令牌允许时解析
    * 未解析的频道名称条目保留为配置但默认情况下被忽略用于路由
    * 入站授权和频道路由默认优先 ID；直接用户名/标签匹配需要 `channels.slack.dangerouslyAllowNameMatching: true`
  </Tab>

  <Tab title="提及和频道用户">
    频道消息默认启用提及门控。

    提及来源：

    * 显式应用提及（`<@botId>`）
    * 提及正则表达式模式（`agents.list[].groupChat.mentionPatterns`，回退 `messages.groupChat.mentionPatterns`）
    * 隐式回复机器人线程行为

    按频道控制（`channels.slack.channels.<id>`；仅通过启动解析或 `dangerouslyAllowNameMatching` 的名称）：

    * `requireMention`
    * `users`（白名单）
    * `allowBots`
    * `skills`
    * `systemPrompt`
    * `tools`、`toolsBySender`
    * `toolsBySender` 键格式：`id:`、`e164:`、`username:`、`name:`，或 `"*"` 通配符
      （传统无前缀键仍仅映射到 `id:`）
  </Tab>
</Tabs>

## 命令和斜杠行为

* 原生命令自动模式 Slack **关闭**（`commands.native: "auto"` 不启用 Slack 原生命令）。
* 使用 `channels.slack.commands.native: true`（或全局 `commands.native: true`）启用原生命令处理程序。
* 启用原生命令时，在 Slack 中注册匹配的斜杠命令（`<command>` 名称），但有一个例外：
  * 为状态命令注册 `/agentstatus`（Slack 保留 `/status`）
* 如果未启用原生命令，您可以通过 `channels.slack.slashCommand` 运行单个配置的斜杠命令。
* 原生命令参数菜单现在调整其渲染策略：
  * 最多 5 个选项：按钮块
  * 6-100 个选项：静态选择菜单
  * 超过 100 个选项：外部选择菜单，在交互性选项处理程序可用时进行异步选项过滤
  * 如果编码选项值超过 Slack 限制，流程回退到按钮
* 对于长选项有效载荷，斜杠命令参数菜单在调度选值之前使用确认对话框。

## 交互式回复

Slack 可以渲染代理创作的交互式回复控件，但默认禁用此功能。

全局启用：

```json5
{
  channels: {
    slack: {
      capabilities: {
        interactiveReplies: true,
      },
    },
  },
}
```

或仅为一个 Slack 账户启用：

```json5
{
  channels: {
    slack: {
      accounts: {
        ops: {
          capabilities: {
            interactiveReplies: true,
          },
        },
      },
    },
  },
}
```

启用后，代理可以发出 Slack 专用的回复指令：

* `[[slack_buttons: Approve:approve, Reject:reject]]`
* `[[slack_select: Choose a target | Canary:canary, Production:production]]`

这些指令编译为 Slack Block Kit，并将点击或选择路由回现有 Slack 交互事件路径。

注意：

* 这是 Slack 特定的 UI。其他渠道不会将 Slack Block Kit 指令转换为其自己的按钮系统。
* 交互回调值是 OpenClaw 生成的 opaque 令牌，而不是原始代理创作的值。
* 如果生成的交互块将超过 Slack Block Kit 限制，OpenClaw 回退到原始文本回复而不是发送无效的块有效载荷。

默认斜杠命令设置：

* `enabled: false`
* `name: "openclaw"`
* `sessionPrefix: "slack:slash"`
* `ephemeral: true`

斜杠会话使用隔离键：

* `agent:<agentId>:slack:slash:<userId>`

仍然将命令执行路由到目标对话会话（`CommandTargetSessionKey`）。

## 线程、会话和回复标签

* 私信路由为 `direct`；频道为 `channel`；MPIM 为 `group`。
* 使用默认 `session.dmScope=main`，Slack 私信折叠到代理主会话。
* 频道会话：`agent:<agentId>:slack:channel:<channelId>`。
* 线程回复可以在适用时创建线程会话后缀（`:thread:<threadTs>`）。
* `channels.slack.thread.historyScope` 默认是 `thread`；`thread.inheritParent` 默认是 `false`。
* `channels.slack.thread.initialHistoryLimit` 控制新线程会话开始时获取多少现有线程消息（默认 `20`；设置 `0` 禁用）。

回复线程控制：

* `channels.slack.replyToMode`：`off|first|all`（默认 `off`）
* `channels.slack.replyToModeByChatType`：按 `direct|group|channel`
* 私信的传统回退：`channels.slack.dm.replyToMode`

支持手动回复标签：

* `[[reply_to_current]]`
* `[[reply_to:<id>]]`

注意：`replyToMode="off"` 禁用 Slack 中的**所有**回复线程，包括显式 `[[reply_to_*]]` 标签。这与 Telegram 不同，在 Telegram 中显式标签在 `"off"` 模式下仍被遵循。差异反映了平台线程模型：Slack 线程隐藏频道中的消息，而 Telegram 回复保持在主聊天流程中可见。

## 媒体、分块和投递

<AccordionGroup>
  <Accordion title="入站附件">
    Slack 文件附件从 Slack 托管的私有 URL 下载（令牌认证请求流程），并在获取成功且大小限制允许时写入媒体存储。

    运行时入站大小上限默认为 `20MB`，除非由 `channels.slack.mediaMaxMb` 覆盖。
  </Accordion>

  <Accordion title="出站文本和文件">
    * 文本块使用 `channels.slack.textChunkLimit`（默认 4000）
    * `channels.slack.chunkMode="newline"` 启用段落优先拆分
    * 文件发送使用 Slack 上传 API，可以包含线程回复（`thread_ts`）
    * 出站媒体上限遵循 `channels.slack.mediaMaxMb`（如果配置）；否则渠道发送使用媒体管道的 MIME 类型默认值
  </Accordion>

  <Accordion title="投递目标">
    首选明确目标：

    * `user:<id>` 用于私信
    * `channel:<id>` 用于频道

    Slack 私信在发送到用户目标时通过 Slack 对话 API 打开。
  </Accordion>
</AccordionGroup>

## 操作和门控

Slack 操作由 `channels.slack.actions.*` 控制。

当前 Slack 工具中的可用操作组：

| 组      | 默认 |
| ---------- | ------- |
| messages   | 启用 |
| reactions  | 启用 |
| pins       | 启用 |
| memberInfo | 启用 |
| emojiList  | 启用 |

## 事件和操作行为

* 消息编辑/删除/线程广播映射到系统事件。
* 反应添加/移除事件映射到系统事件。
* 成员加入/离开、频道创建/重命名和pin添加/移除事件映射到系统事件。
* 助手线程状态更新（用于线程中的"正在输入..."指示符）使用 `assistant.threads.setStatus` 并需要机器人范围 `assistant:write`。
* `channel_id_changed` 可以在 `configWrites` 启用时迁移频道配置键。
* 频道主题/目的元数据被视为不受信任的上下文，可以注入到路由上下文中。
* 块操作和模态交互发出结构化 `Slack interaction: ...` 系统事件，带有丰富的有效载荷字段：
  * 块操作：选值、标签、选择器值和 `workflow_*` 元数据
  * 模态 `view_submission` 和 `view_closed` 事件，带有路由频道元数据和表单输入

## 确认反应

`ackReaction` 在 OpenClaw 处理入站消息时发送确认 emoji。

解析顺序：

* `channels.slack.accounts.<accountId>.ackReaction`
* `channels.slack.ackReaction`
* `messages.ackReaction`
* 代理身份 emoji 回退（`agents.list[].identity.emoji`，否则"👀"）

注意：

* Slack 期望短代码（例如 `"eyes"`）。
* 使用 `""` 为 Slack 账户或全局禁用反应。

## 打字反应回退

`typingReaction` 在 OpenClaw 处理回复时向入站 Slack 消息添加临时反应，然后在运行完成后移除。当 Slack 原生助手打字在私信中不可用时，这是一个有用的回退。

解析顺序：

* `channels.slack.accounts.<accountId>.typingReaction`
* `channels.slack.typingReaction`

注意：

* Slack 期望短代码（例如 `"hourglass_flowing_sand"`）。
* 反应是尽最大努力的，并在回复或失败路径完成后自动尝试清理。

## 清单和范围清单

<AccordionGroup>
  <Accordion title="Slack 应用清单示例">
    ```json
    {
      "display_information": {
        "name": "OpenClaw",
        "description": "Slack connector for OpenClaw"
      },
      "features": {
        "bot_user": {
          "display_name": "OpenClaw",
          "always_online": false
        },
        "app_home": {
          "messages_tab_enabled": true,
          "messages_tab_read_only_enabled": false
        },
        "slash_commands": [
          {
            "command": "/openclaw",
            "description": "Send a message to OpenClaw",
            "should_escape": false
          }
        ]
      },
      "oauth_config": {
        "scopes": {
          "bot": [
            "chat:write",
            "channels:history",
            "channels:read",
            "groups:history",
            "im:history",
            "im:read",
            "im:write",
            "mpim:history",
            "mpim:read",
            "mpim:write",
            "users:read",
            "app_mentions:read",
            "assistant:write",
            "reactions:read",
            "reactions:write",
            "pins:read",
            "pins:write",
            "emoji:read",
            "commands",
            "files:read",
            "files:write"
          ]
        }
      },
      "settings": {
        "socket_mode_enabled": true,
        "event_subscriptions": {
          "bot_events": [
            "app_mention",
            "message.channels",
            "message.groups",
            "message.im",
            "message.mpim",
            "reaction_added",
            "reaction_removed",
            "member_joined_channel",
            "member_left_channel",
            "channel_rename",
            "pin_added",
            "pin_removed"
          ]
        }
      }
    }
    ```
  </Accordion>

  <Accordion title="可选用户令牌范围（读取操作）">
    如果您配置 `channels.slack.userToken`，典型读取范围是：

    * `channels:history`、`groups:history`、`im:history`、`mpim:history`
    * `channels:read`、`groups:read`、`im:read`、`mpim:read`
    * `users:read`
    * `reactions:read`
    * `pins:read`
    * `emoji:read`
    * `search:read`（如果您依赖 Slack 搜索读取）
  </Accordion>
</AccordionGroup>

## 故障排除

<AccordionGroup>
  <Accordion title="频道中无回复">
    按顺序检查：

    * `groupPolicy`
    * 频道白名单（`channels.slack.channels`）
    * `requireMention`
    * 每频道 `users` 白名单

    有用命令：

    ```bash
    openclaw channels status --follow
    openclaw logs --follow
    openclaw doctor
    ```
  </Accordion>

  <Accordion title="私信消息被忽略">
    检查：

    * `channels.slack.dm.enabled`
    * `channels.slack.dmPolicy`（或传统 `channels.slack.dm.policy`）
    * 配对批准 / 白名单条目

    ```bash
    openclaw pairing list slack
    ```
  </Accordion>

  <Tab title="Socket 模式未连接">
    验证 Slack 应用设置中的机器人和应用令牌以及 Socket Mode 启用。
  </Tab>

  <Tab title="HTTP 模式未接收事件">
    验证：

    * 签名密钥
    * webhook 路径
    * Slack 请求 URL（Events + Interactivity + Slash Commands）
    * 每个 HTTP 账户的唯一 `webhookPath`
  </Tab>

  <Tab title="原生命令/斜杠命令未触发">
    验证您是否打算：

    * 原命令模式（`channels.slack.commands.native: true`）配合在 Slack 中注册的匹配斜杠命令
    * 或单个斜杠命令模式（`channels.slack.slashCommand.enabled: true`）

    还要检查 `commands.useAccessGroups` 和频道/用户白名单。
  </Tab>
</AccordionGroup>

## 文本流式传输

OpenClaw 通过 Agents and AI Apps API 支持 Slack 原生文本流式传输。

`channels.slack.streaming` 控制实时预览行为：

* `off`：禁用实时预览流式传输。
* `partial`（默认）：用最新部分输出替换预览文本。
* `block`：附加分块预览更新。
* `progress`：在生成时显示进度状态文本，然后发送最终文本。

`channels.slack.nativeStreaming` 控制 Slack 原生流式传输 API（`chat.startStream` / `chat.appendStream` / `chat.stopStream`），当 `streaming` 是 `partial` 时（默认：`true`）。

禁用原生 Slack 流式传输（保持草稿预览行为）：

```yaml
channels:
  slack:
    streaming: partial
    nativeStreaming: false
```

传统键：

* `channels.slack.streamMode`（`replace | status_final | append`）自动迁移到 `channels.slack.streaming`。
* 布尔 `channels.slack.streaming` 自动迁移到 `channels.slack.nativeStreaming`。

### 要求

1. 在 Slack 应用设置中启用 **Agents and AI Apps**。
2. 确保应用有 `assistant:write` 范围。
3. 该消息必须有一个可用的回复线程。线程选择仍然遵循 `replyToMode`。

### 行为

* 第一个文本块启动流（`chat.startStream`）。
* 后续文本块附加到同一流（`chat.appendStream`）。
* 回复结束停止流（`chat.stopStream`）。
* 媒体和非文本有效载荷回退到正常投递。
* 如果流式传输在回复中途失败，OpenClaw 回退到正常投递以获取剩余有效载荷。

## 配置参考指针

主要参考：

* [配置参考 - Slack](/gateway/configuration-reference#slack)

  高信号 Slack 字段：

  * 模式/认证：`mode`、`botToken`、`appToken`、`signingSecret`、`webhookPath`、`accounts.*`
  * 私信访问：`dm.enabled`、`dmPolicy`、`allowFrom`（传统：`dm.policy`、`dm.allowFrom`）、`dm.groupEnabled`、`dm.groupChannels`
  * 兼容性切换：`dangerouslyAllowNameMatching`（紧急开关；保持关闭除非需要）
  * 频道访问：`groupPolicy`、`channels.*`、`channels.*.users`、`channels.*.requireMention`
  * 线程/历史：`replyToMode`、`replyToModeByChatType`、`thread.*`、`historyLimit`、`dmHistoryLimit`、`dms.*.historyLimit`
  * 投递：`textChunkLimit`、`chunkMode`、`mediaMaxMb`、`streaming`、`nativeStreaming`
  * 操作/功能：`configWrites`、`commands.native`、`slashCommand.*`、`actions.*`、`userToken`、`userTokenReadOnly`

## 相关

* [配对](/channels/pairing)
* [渠道路由](/channels/channel-routing)
* [故障排除](/channels/troubleshooting)
* [配置](/gateway/configuration)
* [斜杠命令](/tools/slash-commands)