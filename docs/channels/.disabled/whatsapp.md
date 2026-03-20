# WhatsApp

# WhatsApp（Web 渠道）

状态：通过 WhatsApp Web（Baileys）生产就绪。网关拥有链接的会话。

<CardGroup cols={3}>
  <Card title="配对" icon="link" href="/channels/pairing">
    默认私信策略是针对未知发送者的配对模式。
  </Card>

  <Card title="渠道故障排除" icon="wrench" href="/channels/troubleshooting">
    跨渠道诊断和修复手册。
  </Card>

  <Card title="网关配置" icon="settings" href="/gateway/configuration">
    完整渠道配置模式和示例。
  </Card>
</CardGroup>

## 快速设置

<Steps>
  <Step title="配置 WhatsApp 访问策略">
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
  </Step>

  <Step title="链接 WhatsApp（QR）">
    ```bash
    openclaw channels login --channel whatsapp
    ```

    对于特定账户：

    ```bash
    openclaw channels login --channel whatsapp --account work
    ```
  </Step>

  <Step title="启动网关">
    ```bash
    openclaw gateway
    ```
  </Step>

  <Step title="批准第一个配对请求（如果使用配对模式）">
    ```bash
    openclaw pairing list whatsapp
    openclaw pairing approve whatsapp <CODE>
    ```

    配对请求在 1 小时后过期。待处理请求每个渠道上限为 3 个。
  </Step>
</Steps>

<Note>
  OpenClaw 建议尽可能在单独的数字上运行 WhatsApp。（渠道元数据和设置流程针对该设置进行了优化，但也支持个人号码设置。）
</Note>

## 部署模式

<AccordionGroup>
  <Tab title="专用号码（推荐）">
    这是最干净的操作模式：

    * OpenClaw 的独立 WhatsApp 身份
    * 更清晰的白名单和路由边界
    * 降低自聊天混淆的机会

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
  </Tab>

  <Tab title="个人号码后备">
    入站支持个人号码模式并写入自聊天友好的基线：

    * `dmPolicy: "allowlist"`
    * `allowFrom` 包括您的个人号码
    * `selfChatMode: true`

    在运行时，自聊天保护基于链接的自有号码和 `allowFrom`。
  </Tab>

  <Tab title="仅 WhatsApp Web 渠道范围">
    消息平台渠道是当前 OpenClaw 渠道架构中基于 WhatsApp Web（`Baileys`）。

    内置聊天渠道注册表中没有单独的 Twilio WhatsApp 消息渠道。
  </Tab>
</AccordionGroup>

## 运行时模型

* 网关拥有 WhatsApp 套接字和重新连接循环。
* 出站发送需要目标账户的活动 WhatsApp 监听器。
* 状态和广播聊天被忽略（`@status`、`@broadcast`）。
* 直接聊天使用私信会话规则（`session.dmScope`；默认 `main` 将私信折叠到代理主会话）。
* 群组会话是隔离的（`agent:<agentId>:whatsapp:group:<jid>`）。

## 访问控制和激活

<Tabs>
  <Tab title="私信策略">
    `channels.whatsapp.dmPolicy` 控制直接聊天访问：

    * `pairing`（默认）
    * `allowlist`
    * `open`（需要 `allowFrom` 包含 `"*"`）
    * `disabled`

    `allowFrom` 接受 E.164 格式号码（内部规范化）。

    多账户覆盖：`channels.whatsapp.accounts.<id>.dmPolicy`（和 `allowFrom`）优先于该账户的渠道级默认。

    运行时行为详情：

    * 配对持久化在渠道允许存储中并与配置的 `allowFrom` 合并
    * 如果未配置白名单，链接的自有号码默认被允许
    * 出站 `fromMe` 私信永远不会被自动配对
  </Tab>

  <Tab title="群组策略 + 白名单">
    群组访问有两个层：

    1. **群组成员白名单**（`channels.whatsapp.groups`）
       * 如果省略 `groups`，所有群组都符合条件
       * 如果存在 `groups`，它充当群组白名单（允许 `"*"`）

    2. **群组发送者策略**（`channels.whatsapp.groupPolicy` + `groupAllowFrom`）
       * `open`：绕过发送者白名单
       * `allowlist`：发送者必须匹配 `groupAllowFrom`（或 `*`）
       * `disabled`：阻止所有群组入站

    发送者白名单回退：

    * 如果未设置 `groupAllowFrom`，运行时回退到可用的 `allowFrom`
    * 发送者白名单在提及/回复激活之前评估

    注意：如果完全不存在 `channels.whatsapp` 块，运行时群组策略回退是 `allowlist`（带警告日志），即使 `channels.defaults.groupPolicy` 已设置。
  </Tab>

  <Tab title="提及 + /activation">
    群组回复默认需要提及。

    提及检测包括：

    * 对机器人身份的明确 WhatsApp 提及
    * 配置的提及正则表达式模式（`agents.list[].groupChat.mentionPatterns`，回退 `messages.groupChat.mentionPatterns`）
    * 隐式回复机器人检测（回复发送者匹配机器人身份）

    安全注意：

    * 引用/回复仅满足提及门控；它**不**授予发送者授权
    * 使用 `groupPolicy: "allowlist"` 时，非白名单发送者即使回复白名单用户的消息仍被阻止

    会话级激活命令：

    * `/activation mention`
    * `/activation always`

    `activation` 更新会话状态（不是全局配置）。它是所有者控制的。
  </Tab>
</Tabs>

## 个人号码和自聊天行为

当链接的自有号码也存在于 `allowFrom` 中时，WhatsApp 自聊天保护激活：

* 跳过自聊天轮次的已读回执
* 忽略否则会 ping 自己的提及 JID 自动触发行为
* 如果未设置 `messages.responsePrefix`，自聊天回复默认为 `[{identity.name}]` 或 `[openclaw]`

## 消息规范化和上下文

<AccordionGroup>
  <Accordion title="入站信封 + 回复上下文">
    入站 WhatsApp 消息包装在共享入站信封中。

    如果存在引用回复，上下文以以下形式附加：

    ```
    [Replying to <sender> id:<stanzaId>]
    <quoted body or media placeholder>
    [/Replying]
    ```

    回复元数据字段在可用时也会填充（`ReplyToId`、`ReplyToBody`、`ReplyToSender`、发送者 JID/E.164）。
  </Tab>

  <Tab title="媒体占位符和位置/联系人提取">
    仅媒体入站消息规范化为占位符，例如：

    * `<media:image>`
    * `<media:video>`
    * `<media:audio>`
    * `<media:document>`
    * `<media:sticker>`

    位置和联系人有效载荷在路由前规范化为文本上下文。
  </Tab>

  <Tab title="待处理群组历史注入">
    对于群组，未处理的消息可以缓冲并在机器人最终触发时注入为上下文。

    * 默认限制：`50`
    * 配置：`channels.whatsapp.historyLimit`
    * 回退：`messages.groupChat.historyLimit`
    * `0` 禁用

    注入标记：

    * `[Chat messages since your last reply - for context]`
    * `[Current message - respond to this]`
  </Tab>

  <Tab title="已读回执">
    默认对已接受的入站 WhatsApp 消息启用已读回执。

    全局禁用：

    ```json5
    {
      channels: {
        whatsapp: {
          sendReadReceipts: false,
        },
      },
    }
    ```

    每账户覆盖：

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

    自聊天轮次即使全局启用也会跳过已读回执。
  </Tab>
</AccordionGroup>

## 投递、分块和媒体

<AccordionGroup>
  <Tab title="文本分块">
    * 默认块限制：`channels.whatsapp.textChunkLimit = 4000`
    * `channels.whatsapp.chunkMode = "length" | "newline"`
    * `newline` 模式优先考虑段落边界（空行），然后回退到安全长度分块
  </Tab>

  <Tab title="出站媒体行为">
    * 支持图片、视频、音频（PTT 语音留言）和文档有效载荷
    * `audio/ogg` 重写为 `audio/ogg; codecs=opus` 以兼容语音留言
    * 通过视频发送的 `gifPlayback: true` 支持动画 GIF 播放
    * 标题应用于发送多媒体回复有效载荷时的第一个媒体项
    * 媒体源可以是 HTTP(S)、`file://` 或本地路径
  </Tab>

  <Tab title="媒体大小限制和回退行为">
    * 入站媒体保存上限：`channels.whatsapp.mediaMaxMb`（默认 `50`）
    * 出站媒体发送上限：`channels.whatsapp.mediaMaxMb`（默认 `50`）
    * 每账户覆盖使用 `channels.whatsapp.accounts.<accountId>.mediaMaxMb`
    * 图片自动优化（调整大小/质量扫描）以适应限制
    * 媒体发送失败时，第一项回退发送文本警告而不是静默丢弃响应
  </Tab>
</AccordionGroup>

## 确认反应

WhatsApp 通过 `channels.whatsapp.ackReaction` 支持入站收据的即时确认反应。

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

行为说明：

* 在入站被接受后立即发送（回复前）
* 失败被记录但不阻止正常回复投递
* 群组模式 `mentions` 对提及触发的轮次做出反应；群组激活 `always` 作为此检查的绕过
* WhatsApp 使用 `channels.whatsapp.ackReaction`（传统 `messages.ackReaction` 此处不使用）

## 多账户和凭据

<AccordionGroup>
  <Tab title="账户选择和默认值">
    * 账户 ID 来自 `channels.whatsapp.accounts`
    * 默认账户选择：如果存在 `default`，否则是第一个配置的账户 ID（排序）
    * 账户 ID 在内部规范化以供查找
  </Tab>

  <Tab title="凭据路径和传统兼容性">
    * 当前认证路径：`~/.openclaw/credentials/whatsapp/<accountId>/creds.json`
    * 备份文件：`creds.json.bak`
    * 传统默认认证在 `~/.openclaw/credentials/` 仍被识别/迁移用于默认账户流程
  </Tab>

  <Tab title="注销行为">
    `openclaw channels logout --channel whatsapp [--account <id>` 清除该账户的 WhatsApp 认证状态。

    在传统认证目录中，`oauth.json` 被保留而 Baileys 认证文件被删除。
  </Tab>
</AccordionGroup>

## 工具、操作和配置写入

* 代理工具支持包括 WhatsApp 反应操作（`react`）。
* 操作门控：
  * `channels.whatsapp.actions.reactions`
  * `channels.whatsapp.actions.polls`
* 渠道发起的配置写入默认启用（通过 `channels.whatsapp.configWrites=false` 禁用）。

## 故障排除

<AccordionGroup>
  <Tab title="未链接（需要 QR）">
    症状：渠道状态报告未链接。

    修复：

    ```bash
    openclaw channels login --channel whatsapp
    openclaw channels status
    ```
  </Tab>

  <Tab title="已链接但断开连接 / 重新连接循环">
    症状：链接账户带有重复断开或重新连接尝试。

    修复：

    ```bash
    openclaw doctor
    openclaw logs --follow
    ```

    如需要，使用 `channels login` 重新链接。
  </Tab>

  <Tab title="发送时无活动监听器">
    当目标账户不存在活动网关监听器时，出站发送快速失败。

    确保网关正在运行且账户已链接。
  </Tab>

  <Tab title="群组消息意外被忽略">
    按顺序检查：

    * `groupPolicy`
    * `groupAllowFrom` / `allowFrom`
    * `groups` 白名单条目
    * 提及门控（`requireMention` + 提及模式）
    * `openclaw.json`（JSON5）中的重复键：后面的条目覆盖前面的，因此每个作用域保留单个 `groupPolicy`
  </Tab>

  <Tab title="Bun 运行时警告">
    WhatsApp 网关运行时应使用 Node。Bun 被标记为与稳定 WhatsApp/Telegram 网关操作不兼容。
  </Tab>
</AccordionGroup>

## 配置参考指针

主要参考：

* [配置参考 - WhatsApp](/gateway/configuration-reference#whatsapp)

高信号 WhatsApp 字段：

* 访问：`dmPolicy`、`allowFrom`、`groupPolicy`、`groupAllowFrom`、`groups`
* 投递：`textChunkLimit`、`chunkMode`、`mediaMaxMb`、`sendReadReceipts`、`ackReaction`
* 多账户：`accounts.<id>.enabled`、`accounts.<id>.authDir`、账户级覆盖
* 操作：`configWrites`、`debounceMs`、`web.enabled`、`web.heartbeatSeconds`、`web.reconnect.*`
* 会话行为：`session.dmScope`、`historyLimit`、`dmHistoryLimit`、`dms.<id>.historyLimit`

## 相关

* [配对](/channels/pairing)
* [渠道路由](/channels/channel-routing)
* [多代理路由](/concepts/multi-agent)
* [故障排除](/channels/troubleshooting)