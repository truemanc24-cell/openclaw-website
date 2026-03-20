# iMessage

# iMessage（传统：imsg）

<Warning>
  对于新的 iMessage 部署，请使用 [BlueBubbles](/channels/bluebubbles)。

  `imsg` 集成是传统的，可能在未来版本中移除。
</Warning>

状态：传统外部 CLI 集成。网关生成 `imsg rpc` 并通过 stdio 上的 JSON-RPC 通信（无单独的守护进程/端口）。

<CardGroup cols="3">
  <Card title="BlueBubbles（推荐）" icon="message-circle" href="/channels/bluebubbles">
    新设置的首选 iMessage 路径。
  </Card>

  <Card title="配对" icon="link" href="/channels/pairing">
    iMessage 私信默认采用配对模式。
  </Card>

  <Card title="配置参考" icon="settings" href="/gateway/configuration-reference#imessage">
    完整 iMessage 字段参考。
  </Card>
</CardGroup>

## 快速设置

<Tabs>
  <Tab title="本地 Mac（快速路径）">
    <Steps>
      <Step title="安装并验证 imsg">
        ```bash
        brew install steipete/tap/imsg
        imsg rpc --help
        ```
      </Step>

      <Step title="配置 OpenClaw">
        ```json5
        {
          channels: {
            imessage: {
              enabled: true,
              cliPath: "/usr/local/bin/imsg",
              dbPath: "/Users/<you>/Library/Messages/chat.db",
            },
          },
        }
        ```
      </Step>

      <Step title="启动网关">
        ```bash
        openclaw gateway
        ```
      </Step>

      <Step title="批准第一个私信配对（默认 dmPolicy）">
        ```bash
        openclaw pairing list imessage
        openclaw pairing approve imessage <CODE>
        ```

        配对请求在 1 小时后过期。
      </Step>
    </Steps>
  </Tab>

  <Tab title="通过 SSH 远程 Mac">
    OpenClaw 只需要 stdio 兼容的 `cliPath`，因此您可以将 `cliPath` 指向一个包装脚本，通过 SSH 连接到远程 Mac 并运行 `imsg`。

    ```bash
    #!/usr/bin/env bash
    exec ssh -T gateway-host imsg "$@"
    ```

    启用附件时的推荐配置：

    ```json5
    {
      channels: {
        imessage: {
          enabled: true,
          cliPath: "~/.openclaw/scripts/imsg-ssh",
          remoteHost: "user@gateway-host", // 用于 SCP 附件获取
          includeAttachments: true,
          // 可选：覆盖允许的附件根目录。
          // 默认包括 /Users/*/Library/Messages/Attachments
          attachmentRoots: ["/Users/*/Library/Messages/Attachments"],
          remoteAttachmentRoots: ["/Users/*/Library/Messages/Attachments"],
        },
      },
    }
    ```

    如果未设置 `remoteHost`，OpenClaw 会尝试通过解析 SSH 包装脚本自动检测它。
    `remoteHost` 必须是 `host` 或 `user@host`（无空格或 SSH 选项）。
    OpenClaw 对 SCP 使用严格的主机密钥检查，因此中继主机密钥必须已存在于 `~/.ssh/known_hosts` 中。
    附件路径根据允许的根目录（`attachmentRoots` / `remoteAttachmentRoots`）进行验证。
  </Tab>
</Tabs>

## 要求和权限（macOS）

* 消息必须在运行 `imsg` 的 Mac 上登录。
* 运行的 OpenClaw/`imsg` 进程上下文需要完全磁盘访问（消息数据库访问）。
* 需要自动化权限才能通过 Messages.app 发送消息。

<Tip>
  权限按进程上下文授予。如果网关无头运行（LaunchAgent/SSH），请在同一上下文运行一次交互式命令以触发提示：

  ```bash
  imsg chats --limit 1
  # 或
  imsg send <handle> "test"
  ```
</Tip>

## 访问控制和路由

<Tabs>
  <Tab title="私信策略">
    `channels.imessage.dmPolicy` 控制私信：

    * `pairing`（默认）
    * `allowlist`
    * `open`（需要 `allowFrom` 包含 `"*"`）
    * `disabled`

    白名单字段：`channels.imessage.allowFrom`。

    白名单条目可以是句柄或聊天目标（`chat_id:*`、`chat_guid:*`、`chat_identifier:*`）。
  </Tab>

  <Tab title="群组策略 + 提及">
    `channels.imessage.groupPolicy` 控制群组处理：

    * `allowlist`（配置时的默认）
    * `open`
    * `disabled`

    群组发送者白名单：`channels.imessage.groupAllowFrom`。

    运行时回退：如果 `groupAllowFrom` 未设置，iMessage 群组发送者检查在可用时回退到 `allowFrom`。
    运行时注意：如果完全缺少 `channels.imessage`，运行时回退到 `groupPolicy="allowlist"` 并记录警告（即使设置了 `channels.defaults.groupPolicy`）。

    群组提及门控：

    * iMessage 没有原生提及元数据
    * 提及检测使用正则表达式模式（`agents.list[].groupChat.mentionPatterns`，回退 `messages.groupChat.mentionPatterns`）
    * 未配置模式时，无法强制执行提及门控

    来自授权发送者的控制命令可以绕过群组中的提及门控。
  </Tab>

  <Tab title="会话和确定性回复">
    * 私信使用直接路由；群组使用群组路由。
    * 使用默认 `session.dmScope=main`，iMessage 私信合并到代理主会话。
    * 群组会话是隔离的（`agent:<agentId>:imessage:group:<chat_id>`）。
    * 回复使用原始渠道/目标元数据路由回 iMessage。

    群组式线程行为：

    一些多参与者 iMessage 线程可能以 `is_group=false` 到达。
    如果该 `chat_id` 明确配置在 `channels.imessage.groups` 下，OpenClaw 会将其视为群组流量（群组门控 + 群组会话隔离）。
  </Tab>
</Tabs>

## 部署模式

<AccordionGroup>
  <Accordion title="专用机器人 macOS 用户（独立 iMessage 身份）">
    使用专用的 Apple ID 和 macOS 用户，使机器人流量与您的个人消息配置文件隔离。

    典型流程：

    1. 创建/登录专用 macOS 用户。
    2. 在该用户中用机器人 Apple ID 登录消息。
    3. 在该用户中安装 `imsg`。
    4. 创建 SSH 包装脚本，以便 OpenClaw 可以在该用户上下文运行 `imsg`。
    5. 将 `channels.imessage.accounts.<id>.cliPath` 和 `.dbPath` 指向该用户配置。

    首次运行可能需要 GUI 批准（自动化 + 完全磁盘访问）在那 个机器人用户会话中。
  </Accordion>

  <Tab title="通过 Tailscale 远程 Mac（示例）">
    常见拓扑：

    * 网关在 Linux/VM 上运行
    * iMessage + `imsg` 在您的 tailnet 中的 Mac 上运行
    * `cliPath` 包装脚本使用 SSH 运行 `imsg`
    * `remoteHost` 启用 SCP 附件获取

    示例：

    ```json5
    {
      channels: {
        imessage: {
          enabled: true,
          cliPath: "~/.openclaw/scripts/imsg-ssh",
          remoteHost: "bot@mac-mini.tailnet-1234.ts.net",
          includeAttachments: true,
          dbPath: "/Users/bot/Library/Messages/chat.db",
        },
      },
    }
    ```

    ```bash
    #!/usr/bin/env bash
    exec ssh -T bot@mac-mini.tailnet-1234.ts.net imsg "$@"
    ```

    使用 SSH 密钥使 SSH 和 SCP 都是非交互式的。
    首先确保主机密钥被信任（例如 `ssh bot@mac-mini.tailnet-1234.ts.net`），以便填充 `known_hosts`。
  </Tab>

  <Tab title="多账户模式">
    iMessage 支持 `channels.imessage.accounts` 下的按账户配置。

    每个账户可以覆盖字段，如 `cliPath`、`dbPath`、`allowFrom`、`groupPolicy`、`mediaMaxMb`、历史设置和附件根目录白名单。
  </Tab>
</AccordionGroup>

## 媒体、分块和投递目标

<AccordionGroup>
  <Tab title="附件和媒体">
    * 入站附件获取是可选的：`channels.imessage.includeAttachments`
    * 当设置 `remoteHost` 时，可以通过 SCP 获取远程附件路径
    * 附件路径必须匹配允许的根目录：
      * `channels.imessage.attachmentRoots`（本地）
      * `channels.imessage.remoteAttachmentRoots`（远程 SCP 模式）
      * 默认根目录模式：`/Users/*/Library/Messages/Attachments`
    * SCP 使用严格的主机密钥检查（`StrictHostKeyChecking=yes`）
    * 出站媒体大小使用 `channels.imessage.mediaMaxMb`（默认 16 MB）
  </Tab>

  <Tab title="出站分块">
    * 文本块限制：`channels.imessage.textChunkLimit`（默认 4000）
    * 块模式：`channels.imessage.chunkMode`
      * `length`（默认）
      * `newline`（按段落优先拆分）
  </Tab>

  <Tab title="寻址格式">
    首选显式目标：

    * `chat_id:123`（推荐用于稳定路由）
    * `chat_guid:...`
    * `chat_identifier:...`

    也支持句柄目标：

    * `imessage:+1555...`
    * `sms:+1555...`
    * `user@example.com`

    ```bash
    imsg chats --limit 20
    ```
  </Tab>
</AccordionGroup>

## 配置写入

iMessage 默认允许渠道发起的配置写入（用于 `commands.config: true` 时的 `/config set|unset`）。

禁用：

```json5
{
  channels: {
    imessage: {
      configWrites: false,
    },
  },
}
```

## 故障排除

<AccordionGroup>
  <Tab title="imsg 未找到或 RPC 不支持">
    验证二进制文件和 RPC 支持：

    ```bash
    imsg rpc --help
    openclaw channels status --probe
    ```

    如果探测报告 RPC 不支持，请更新 `imsg`。
  </Tab>

  <Tab title="私信被忽略">
    检查：

    * `channels.imessage.dmPolicy`
    * `channels.imessage.allowFrom`
    * 配对批准（`openclaw pairing list imessage`）
  </Tab>

  <Tab title="群组消息被忽略">
    检查：

    * `channels.imessage.groupPolicy`
    * `channels.imessage.groupAllowFrom`
    * `channels.imessage.groups` 白名单行为
    * 提及模式配置（`agents.list[].groupChat.mentionPatterns`）
  </Tab>

  <Tab title="远程附件失败">
    检查：

    * `channels.imessage.remoteHost`
    * `channels.imessage.remoteAttachmentRoots`
    * 网关主机的 SSH/SCP 密钥认证
    * 网关主机上 `~/.ssh/known_hosts` 中的主机密钥
    * 运行消息的 Mac 上的远程路径可读性
  </Tab>

  <Tab title="macOS 权限提示被错过">
    在相同的用户/会话上下文中的交互式 GUI 终端中重新运行并批准提示：

    ```bash
    imsg chats --limit 1
    imsg send <handle> "test"
    ```

    确认运行 OpenClaw/`imsg` 的进程上下文被授予完全磁盘访问 + 自动化。
  </Tab>
</AccordionGroup>

## 配置参考指针

* [配置参考 - iMessage](/gateway/configuration-reference#imessage)
* [网关配置](/gateway/configuration)
* [配对](/channels/pairing)
* [BlueBubbles](/channels/bluebubbles)