# 多代理路由

# 多代理路由

目标：在单个运行的网关中，多个*隔离*代理（独立工作空间 + `agentDir` + 会话），加上多个渠道账户（例如两个 WhatsApp）。入站通过绑定路由到代理。

## 什么是一个"代理"？

一个**代理**是一个完整作用域的大脑，有自己的：

* **工作空间**（文件、AGENTS.md/SOUL.md/USER.md、本地笔记、人设规则）。
* **状态目录**（`agentDir`）用于认证配置文件、模型注册表和每代理配置。
* **会话存储**（聊天历史 + 路由状态）在 `~/.openclaw/agents/<agentId>/sessions`。

认证配置文件**是每代理的**。每个代理从自己的：

```text
~/.openclaw/agents/<agentId>/agent/auth-profiles.json
```

主代理凭证**不会**自动共享。切勿跨代理重用 `agentDir`（这会导致认证/会话冲突）。如果您想共享凭据，请将 `auth-profiles.json` 复制到其他代理的 `agentDir`。

技能通过每个工作空间的 `skills/` 文件夹是每代理的，共享技能可从 `~/.openclaw/skills` 获取。参见[技能：每代理 vs 共享](/tools/skills#per-agent-vs-shared-skills)。

网关可以托管**一个代理**（默认）或**多个代理**并排。

**工作空间注意：**每个代理的工作空间是**默认 cwd**，不是硬沙盒。相对路径在工作空间内解析，但绝对路径可以到达其他主机位置，除非启用沙盒。参见[沙盒](/gateway/sandboxing)。

## 路径（快速映射）

* 配置：`~/.openclaw/openclaw.json`（或 `OPENCLAW_CONFIG_PATH`）
* 状态目录：`~/.openclaw`（或 `OPENCLAW_STATE_DIR`）
* 工作空间：`~/.openclaw/workspace`（或 `~/.openclaw/workspace-<agentId>`）
* 代理目录：`~/.openclaw/agents/<agentId>/agent`（或 `agents.list[].agentDir`）
* 会话：`~/.openclaw/agents/<agentId>/sessions`

### 单代理模式（默认）

如果您不执行任何操作，OpenClaw 运行单个代理：

* `agentId` 默认为 **`main`**。
* 会话键为 `agent:main:<mainKey>`。
* 工作空间默认为 `~/.openclaw/workspace`（或设置 `OPENCLAW_PROFILE` 时为 `~/.openclaw/workspace-<profile>`）。
* 状态默认为 `~/.openclaw/agents/main/agent`。

## 代理辅助

使用代理向导添加新的隔离代理：

```bash
openclaw agents add work
```

然后添加 `bindings`（或让向导做）来路由入站消息。

验证：

```bash
openclaw agents list --bindings
```

## 快速开始

<Steps>
  <Step title="创建每个代理工作空间">
    使用向导或手动创建工作空间：

    ```bash
    openclaw agents add coding
    openclaw agents add social
    ```

    每个代理获得自己的带有 `SOUL.md`、`AGENTS.md` 和可选 `USER.md` 的工作空间，外加专用 `agentDir` 和 `~/.openclaw/agents/<agentId>` 下的会话存储。
  </Step>

  <Step title="创建渠道账户">
    为每个代理在您首选的渠道上创建一个账户：

    * Discord：每个代理一个机器人，启用 Message Content Intent，复制每个令牌。
    * Telegram：每个代理通过 BotFather 创建一个机器人，复制每个令牌。
    * WhatsApp：链接每个账户的电话号码。

    ```bash
    openclaw channels login --channel whatsapp --account work
    ```

    参见渠道指南：[Discord](/channels/discord)、[Telegram](/channels/telegram)、[WhatsApp](/channels/whatsapp)。
  </Step>

  <Step title="添加代理、账户和绑定">
    在 `agents.list` 下添加代理，在 `channels.<channel>.accounts` 下添加渠道账户，并使用 `bindings` 连接它们（示例如下）。
  </Step>

  <Step title="重启并验证">
    ```bash
    openclaw gateway restart
    openclaw agents list --bindings
    openclaw channels status --probe
    ```
  </Step>
</Steps>

## 多个代理 = 多人、多个性格

使用**多个代理**，每个 `agentId` 成为**完全隔离的人格**：

* **不同的电话号码/账户**（每个渠道 `accountId`）。
* **不同的人格**（每代理工作空间文件如 `AGENTS.md` 和 `SOUL.md`）。
* **独立的认证 + 会话**（除非明确启用，否则不会交叉）。

这允许多人共享一个网关服务器，同时保持他们的 AI"大脑"和数据隔离。

## 一个 WhatsApp 号码、多人（DM 分离）

您可以将**不同的 WhatsApp DM** 路由到不同的代理，同时保持在**一个 WhatsApp 账户**上。按发件人 E.164 匹配（如 `+15551234567`）和 `peer.kind: "direct"`。回复仍来自同一个 WhatsApp 号码（没有每代理发件人身份）。

重要细节：直接聊天合并为代理的**主会话键**，因此真正的隔离需要**每个用户一个代理**。

示例：

```json5
{
  agents: {
    list: [
      { id: "alex", workspace: "~/.openclaw/workspace-alex" },
      { id: "mia", workspace: "~/.openclaw/workspace-mia" },
    ],
  },
  bindings: [
    {
      agentId: "alex",
      match: { channel: "whatsapp", peer: { kind: "direct", id: "+15551230001" } },
    },
    {
      agentId: "mia",
      match: { channel: "whatsapp", peer: { kind: "direct", id: "+15551230002" } },
    },
  ],
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551230001", "+15551230002"],
    },
  },
}
```

注意：

* DM 访问控制是**每个 WhatsApp 账户的全局**（配对/白名单），不是每代理的。
* 对于共享群组，将群组绑定到一个代理或使用[广播群组](/channels/broadcast-groups)。

## 路由规则（消息如何选择代理）

绑定是**确定性的**且**最具体获胜**：

1. `peer` 匹配（精确 DM/群组/渠道 id）
2. `parentPeer` 匹配（线程继承）
3. `guildId + roles`（Discord 角色路由）
4. `guildId`（Discord）
5. `teamId`（Slack）
6. `accountId` 匹配某个渠道
7. 渠道级匹配（`accountId: "*"`）
8. 回退到默认代理（`agents.list[].default`，否则第一个列表条目，默认：`main`）

如果同一层有多个绑定匹配，按配置顺序第一个获胜。
如果绑定设置多个匹配字段（例如 `peer` + `guildId`），则所有指定字段都是必需的（`AND` 语义）。

重要的账户范围细节：

* 省略 `accountId` 的绑定仅匹配默认账户。
* 使用 `accountId: "*"` 进行所有账户的渠道级回退。
* 如果稍后为同一代理添加具有明确账户 id 的相同绑定，OpenClaw 将现有渠道级绑定升级为账户范围，而不是重复它。

## 多个账户 / 电话号码

支持**多个账户**的渠道（如 WhatsApp）使用 `accountId` 标识每个登录。每个 `accountId` 可以路由到不同的代理，因此一台服务器可以托管多个电话号码而不会混淆会话。

如果您想在省略 `accountId` 时设置渠道级默认账户，请设置 `channels.<channel>.defaultAccount`（可选）。未设置时，OpenClaw 如果存在则回退到 `default`，否则是第一个配置的账户 id（排序）。

支持此模式的常见渠道包括：

* `whatsapp`、`telegram`、`discord`、`slack`、`signal`、`imessage`
* `irc`、`line`、`googlechat`、`mattermost`、`matrix`、`nextcloud-talk`
* `bluebubbles`、`zalo`、`zalouser`、`nostr`、`feishu`

## 概念

* `agentId`：一个"大脑"（工作空间、每代理认证、每代理会话存储）。
* `accountId`：一个渠道账户实例（例如 WhatsApp 账户 `"personal"` vs `"biz"`）。
* `binding`：通过 `(channel, accountId, peer)`（以及可选的 guild/team id）将入站消息路由到 `agentId`。
* 直接聊天合并为 `agent:<agentId>:<mainKey>`（每代理"main"；`session.mainKey`）。

## 平台示例

### 每个代理的 Discord 机器人

每个 Discord 机器人账户映射到唯一的 `accountId`。将每个账户绑定到代理，并为每个机器人保留白名单。

```json5
{
  agents: {
    list: [
      { id: "main", workspace: "~/.openclaw/workspace-main" },
      { id: "coding", workspace: "~/.openclaw/workspace-coding" },
    ],
  },
  bindings: [
    { agentId: "main", match: { channel: "discord", accountId: "default" } },
    { agentId: "coding", match: { channel: "discord", accountId: "coding" } },
  ],
  channels: {
    discord: {
      groupPolicy: "allowlist",
      accounts: {
        default: {
          token: "DISCORD_BOT_TOKEN_MAIN",
          guilds: {
            "123456789012345678": {
              channels: {
                "222222222222222222": { allow: true, requireMention: false },
              },
            },
          },
        },
        coding: {
          token: "DISCORD_BOT_TOKEN_CODING",
          guilds: {
            "123456789012345678": {
              channels: {
                "333333333333333333": { allow: true, requireMention: false },
              },
            },
          },
        },
      },
    },
  },
}
```

注意：

* 将每个机器人邀请到 guild 并启用 Message Content Intent。
* 令牌位于 `channels.discord.accounts.<id>.token`（默认账户可以使用 `DISCORD_BOT_TOKEN`）。

### 每个代理的 Telegram 机器人

```json5
{
  agents: {
    list: [
      { id: "main", workspace: "~/.openclaw/workspace-main" },
      { id: "alerts", workspace: "~/.openclaw/workspace-alerts" },
    ],
  },
  bindings: [
    { agentId: "main", match: { channel: "telegram", accountId: "default" } },
    { agentId: "alerts", match: { channel: "telegram", accountId: "alerts" } },
  ],
  channels: {
    telegram: {
      accounts: {
        default: {
          botToken: "123456:ABC...",
          dmPolicy: "pairing",
        },
        alerts: {
          botToken: "987654:XYZ...",
          dmPolicy: "allowlist",
          allowFrom: ["tg:123456789"],
        },
      },
    },
  },
}
```

注意：

* 使用 BotFather 为每个代理创建一个机器人并复制每个令牌。
* 令牌位于 `channels.telegram.accounts.<id>.botToken`（默认账户可以使用 `TELEGRAM_BOT_TOKEN`）。

### 每个代理的 WhatsApp 号码

在启动网关之前链接每个账户：

```bash
openclaw channels login --channel whatsapp --account personal
openclaw channels login --channel whatsapp --account biz
```

`~/.openclaw/openclaw.json` (JSON5):

```js
{
  agents: {
    list: [
      {
        id: "home",
        default: true,
        name: "Home",
        workspace: "~/.openclaw/workspace-home",
        agentDir: "~/.openclaw/agents/home/agent",
      },
      {
        id: "work",
        name: "Work",
        workspace: "~/.openclaw/workspace-work",
        agentDir: "~/.openclaw/agents/work/agent",
      },
    ],
  },

  // 确定性路由：第一个匹配获胜（最具体在前）。
  bindings: [
    { agentId: "home", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "whatsapp", accountId: "biz" } },

    // 可选的每-peer 覆盖（示例：将特定群组发送到工作代理）。
    {
      agentId: "work",
      match: {
        channel: "whatsapp",
        accountId: "personal",
        peer: { kind: "group", id: "1203630...@g.us" },
      },
    },
  ],

  // 默认关闭：代理到代理消息必须明确启用 + 白名单。
  tools: {
    agentToAgent: {
      enabled: false,
      allow: ["home", "work"],
    },
  },

  channels: {
    whatsapp: {
      accounts: {
        personal: {
          // 可选覆盖。默认：~/.openclaw/credentials/whatsapp/personal
          // authDir: "~/.openclaw/credentials/whatsapp/personal",
        },
        biz: {
          // 可选覆盖。默认：~/.openclaw/credentials/whatsapp/biz
          // authDir: "~/.openclaw/credentials/whatsapp/biz",
        },
      },
    },
  },
}
```

## 示例：WhatsApp 日常聊天 + Telegram 深度工作

按渠道拆分：将 WhatsApp 路由到快速日常代理，将 Telegram 路由到 Opus 代理。

```json5
{
  agents: {
    list: [
      {
        id: "chat",
        name: "Everyday",
        workspace: "~/.openclaw/workspace-chat",
        model: "anthropic/claude-sonnet-4-5",
      },
      {
        id: "opus",
        name: "Deep Work",
        workspace: "~/.openclaw/workspace-opus",
        model: "anthropic/claude-opus-4-6",
      },
    ],
  },
  bindings: [
    { agentId: "chat", match: { channel: "whatsapp" } },
    { agentId: "opus", match: { channel: "telegram" } },
  ],
}
```

注意：

* 如果您有多个渠道账户，请将 `accountId` 添加到绑定（例如 `{ channel: "whatsapp", accountId: "personal" }`）。
* 要将单个 DM/群组路由到 Opus，同时保持其他在 chat 上，请为该 peer 添加 `match.peer` 绑定；peer 匹配始终优于渠道级规则。

## 示例：同一渠道，一个 peer 到 Opus

保持 WhatsApp 在快速代理上，但将一个 DM 路由到 Opus：

```json5
{
  agents: {
    list: [
      {
        id: "chat",
        name: "Everyday",
        workspace: "~/.openclaw/workspace-chat",
        model: "anthropic/claude-sonnet-4-5",
      },
      {
        id: "opus",
        name: "Deep Work",
        workspace: "~/.openclaw/workspace-opus",
        model: "anthropic/claude-opus-4-6",
      },
    ],
  },
  bindings: [
    {
      agentId: "opus",
      match: { channel: "whatsapp", peer: { kind: "direct", id: "+15551234567" } },
    },
    { agentId: "chat", match: { channel: "whatsapp" } },
  ],
}
```

Peer 绑定始终获胜，因此将它们保持在渠道级规则之上。

## 家庭代理绑定到 WhatsApp 群组

将专用家庭代理绑定到单个 WhatsApp 群组，带有提及门控和更严格的工具策略：

```json5
{
  agents: {
    list: [
      {
        id: "family",
        name: "Family",
        workspace: "~/.openclaw/workspace-family",
        identity: { name: "Family Bot" },
        groupChat: {
          mentionPatterns: ["@family", "@familybot", "@Family Bot"],
        },
        sandbox: {
          mode: "all",
          scope: "agent",
        },
        tools: {
          allow: [
            "exec",
            "read",
            "sessions_list",
            "sessions_history",
            "sessions_send",
            "sessions_spawn",
            "session_status",
          ],
          deny: ["write", "edit", "apply_patch", "browser", "canvas", "nodes", "cron"],
        },
      },
    ],
  },
  bindings: [
    {
      agentId: "family",
      match: {
        channel: "whatsapp",
        peer: { kind: "group", id: "120363999999999999@g.us" },
      },
    },
  ],
}
```

注意：

* 工具允许/拒绝列表是**工具**，不是技能。如果技能需要运行二进制文件，请确保 `exec` 被允许并且二进制文件存在于沙盒中。
* 要进行更严格的门控，请设置 `agents.list[].groupChat.mentionPatterns` 并保持渠道启用群组白名单。

## 每代理沙盒和工具配置

从 v2026.1.6 开始，每个代理可以有自己的沙盒和工具限制：

```js
{
  agents: {
    list: [
      {
        id: "personal",
        workspace: "~/.openclaw/workspace-personal",
        sandbox: {
          mode: "off",  // 个人代理无沙盒
        },
        // 无工具限制 - 所有工具可用
      },
      {
        id: "family",
        workspace: "~/.openclaw/workspace-family",
        sandbox: {
          mode: "all",     // 始终沙盒化
          scope: "agent",  // 每个代理一个容器
          docker: {
            // 容器创建后的一次性设置（可选）
            setupCommand: "apt-get update && apt-get install -y git curl",
          },
        },
        tools: {
          allow: ["read"],                    // 仅读工具
          deny: ["exec", "write", "edit", "apply_patch"],    // 拒绝其他
        },
      },
    ],
  },
}
```

注意：`setupCommand` 位于 `sandbox.docker` 下，在容器创建时运行一次。解析后的范围为 `"shared"` 时，忽略每代理 `sandbox.docker.*` 覆盖。

**好处：**

* **安全隔离**：限制不受信任代理的工具
* **资源控制**：在保持其他在主机上的同时对特定代理进行沙盒
* **灵活策略**：每个代理不同的权限

注意：`tools.elevated` 是**全局**且基于发件人的；它不是每代理可配置的。如果需要每代理边界，请使用 `agents.list[].tools` 拒绝 `exec`。
对于群组定位，使用 `agents.list[].groupChat.mentionPatterns`，以便 @mentions 干净地映射到预期的代理。

参见[多代理沙盒和工具](/tools/multi-agent-sandbox-tools)了解详细示例。