---
title: session
description: session 页面
---

# 会话管理

# 会话管理

OpenClaw 将**每个代理的一个直接聊天会话**作为主要会话。直接聊天合并为 `agent:<agentId>:<mainKey>`（默认 `main`），而群组/渠道聊天获得自己的键。`session.mainKey` 被遵守。

使用 `session.dmScope` 控制**直接消息**的分组方式：

* `main`（默认）：所有 DM 共享主会话以保持连续性。
* `per-peer`：按跨渠道的发件人 ID 隔离。
* `per-channel-peer`：按渠道 + 发件人隔离（推荐用于多用户收件箱）。
* `per-account-channel-peer`：按账户 + 渠道 + 发件人隔离（推荐用于多账户收件箱）。
  使用 `session.identityLinks` 将提供商前缀的发件人 ID 映射到规范身份，以便使用 `per-peer`、`per-channel-peer` 或 `per-account-channel-peer` 时，同一个人可以跨渠道共享 DM 会话。

## 安全 DM 模式（推荐用于多用户设置）

> **安全警告：**如果您的代理可以接收来自**多个人**的 DM，您应该强烈考虑启用安全 DM 模式。否则，所有用户共享相同的对话上下文，这可能在用户之间泄露私人信息。

**默认设置的问题示例：**

* Alice（`<SENDER_A>`）向您的代理发送关于私人主题的消息（例如医疗预约）
* Bob（`<SENDER_B>`）向您的代理发送消息询问"我们之前在聊什么？"
* 因为两个 DM 共享同一个会话，模型可能会用 Alice 之前的上下文回答 Bob。

**修复方法：** 设置 `dmScope` 为每个用户隔离会话：

```json5
// ~/.openclaw/openclaw.json
{
  session: {
    // 安全 DM 模式：按渠道 + 发件人隔离 DM 上下文。
    dmScope: "per-channel-peer",
  },
}
```

**何时启用：**

* 您有多个发件人的配对批准
* 您使用带多个条目的 DM 白名单
* 您设置 `dmPolicy: "open"`
* 多个电话号码或账户可以向您的代理发送消息

注意：

* 默认是 `dmScope: "main"` 以保持连续性（所有 DM 共享主会话）。这对于单用户设置很好。
* 本地 CLI 入门在未设置时默认写入 `session.dmScope: "per-channel-peer"`（保留现有显式值）。
* 对于同一渠道上的多账户收件箱，优先使用 `per-account-channel-peer`。
* 如果同一个人通过多个渠道联系您，使用 `session.identityLinks` 将他们的 DM 会话折叠为一个规范身份。
* 您可以使用 `openclaw security audit` 验证您的 DM 设置（参见[安全](/cli/security)）。

## 网关是真理的来源

所有会话状态由**网关**（"主"OpenClaw）拥有。UI 客户端（macOS 应用、WebChat 等）必须查询网关获取会话列表和令牌计数，而不是读取本地文件。

* 在**远程模式**下，您关心的会话存储位于远程网关主机上，而不是您的 Mac。
* UI 中显示的令牌计数来自网关的存储字段（`inputTokens`、`outputTokens`、`totalTokens`、`contextTokens`）。客户端不会解析 JSONL 记录来"修复"总数。

## 状态所在位置

* 在**网关主机**上：
  * 存储文件：`~/.openclaw/agents/<agentId>/sessions/sessions.json`（每个代理）。
* 记录：`~/.openclaw/agents/<agentId>/sessions/<SessionId>.jsonl`（Telegram 主题会话使用 `.../<SessionId>-topic-<threadId>.jsonl`）。
* 存储是映射 `sessionKey -> { sessionId, updatedAt, ... }`。删除条目是安全的；它们按需重新创建。
* 群组条目可能包含 `displayName`、`channel`、`subject`、`room` 和 `space` 以便在 UI 中标记会话。
* 会话条目包含 `origin` 元数据（标签 + 路由提示），以便 UI 可以解释会话来自哪里。
* OpenClaw **不**读取旧的 Pi/Tau 会话文件夹。

## 维护

OpenClaw 应用会话存储维护以保持 `sessions.json` 和记录工件随时间有界。

### 默认值

* `session.maintenance.mode`: `warn`
* `session.maintenance.pruneAfter`: `30d`
* `session.maintenance.maxEntries`: `500`
* `session.maintenance.rotateBytes`: `10mb`
* `session.maintenance.resetArchiveRetention`: 默认为 `pruneAfter`（`30d`）
* `session.maintenance.maxDiskBytes`: 未设置（禁用）
* `session.maintenance.highWaterBytes`: 启用预算时默认为 `maxDiskBytes` 的 `80%`

### 工作原理

维护在会话存储写入期间运行，您可以使用 `openclaw sessions cleanup` 按需触发。

* `mode: "warn"`：报告将被驱逐的内容，但不改变条目/记录。
* `mode: "enforce"`：按以下顺序应用清理：
  1. 修剪早于 `pruneAfter` 的过时条目
  2. 将条目数量限制为 `maxEntries`（最旧的优先）
  3. 归档不再引用的已删除条目的记录文件
  4. 按保留策略清除旧的 `*.deleted.<timestamp>` 和 `*.reset.<timestamp>` 归档
  5. 当 `sessions.json` 超过 `rotateBytes` 时轮换
  6. 如果设置了 `maxDiskBytes`，执行磁盘预算到 `highWaterBytes`（最旧的工件优先，然后是最旧的会话）

### 大存储的性能警告

大会话存储在高音量设置中很常见。维护工作是写入路径工作，因此非常大的存储会增加写入延迟。

最增加成本的是：

* 非常高的 `session.maintenance.maxEntries` 值
* 保持过时条目的长 `pruneAfter` 窗口
* `~/.openclaw/agents/<agentId>/sessions/` 中的许多记录/归档工件
* 启用磁盘预算（`maxDiskBytes`）而没有合理的修剪/上限限制

要做什么：

* 在生产中使用 `mode: "enforce"` 以便自动限制增长
* 设置时间和数量限制（`pruneAfter` + `maxEntries`），而不仅仅是其中一个
* 在大型部署中设置 `maxDiskBytes` + `highWaterBytes` 以获得硬上限
* 保持 `highWaterBytes` 明显低于 `maxDiskBytes`（默认是 80%）
* 在配置更改后运行 `openclaw sessions cleanup --dry-run --json` 以在强制执行前验证预期影响
* 对于频繁活动的会话，在运行手动清理时传递 `--active-key`

### 自定义示例

使用保守的强制策略：

```json5
{
  session: {
    maintenance: {
      mode: "enforce",
      pruneAfter: "45d",
      maxEntries: 800,
      rotateBytes: "20mb",
      resetArchiveRetention: "14d",
    },
  },
}
```

为会话目录启用硬磁盘预算：

```json5
{
  session: {
    maintenance: {
      mode: "enforce",
      maxDiskBytes: "1gb",
      highWaterBytes: "800mb",
    },
  },
}
```

针对大型安装调整（示例）：

```json5
{
  session: {
    maintenance: {
      mode: "enforce",
      pruneAfter: "14d",
      maxEntries: 2000,
      rotateBytes: "25mb",
      maxDiskBytes: "2gb",
      highWaterBytes: "1.6gb",
    },
  },
}
```

从 CLI 预览或强制维护：

```bash
openclaw sessions cleanup --dry-run
openclaw sessions cleanup --enforce
```

## 会话修剪

默认情况下，OpenClaw 在 LLM 调用之前从内存中上下文修剪**旧工具结果**。
这**不会**重写 JSONL 历史。参见 [/concepts/session-pruning](/concepts/session-pruning)。

## 预压缩记忆刷新

当会话接近自动压缩时，OpenClaw 可以运行**静默记忆刷新**轮次，提醒模型将持久笔记写入磁盘。这仅在工作空间可写时运行。参见[记忆](/concepts/memory)和[压缩](/concepts/compaction)。

## 传输 → 会话键的映射

* 直接聊天遵循 `session.dmScope`（默认 `main`）。
  * `main`：`agent:<agentId>:<mainKey>`（跨设备/渠道的连续性）。
    * 多个电话号码和渠道可以映射到同一个代理主键；它们作为进入一个对话的传输。
  * `per-peer`：`agent:<agentId>:direct:<peerId>`。
  * `per-channel-peer`：`agent:<agentId>:<channel>:direct:<peerId>`。
  * `per-account-channel-peer`：`agent:<agentId>:<channel>:<accountId>:direct:<peerId>`（accountId 默认为 `default`）。
  * 如果 `session.identityLinks` 匹配提供商前缀的发件人 ID（例如 `telegram:123`），规范键替换 `<peerId>` 以便同一个人跨渠道共享会话。
* 群组聊天隔离状态：`agent:<agentId>:<channel>:group:<id>`（房间/渠道使用 `agent:<agentId>:<channel>:channel:<id>`）。
  * Telegram 论坛主题附加 `:topic:<threadId>` 到群组 ID 以隔离。
  * 旧的 `group:<id>` 键仍被识别用于迁移。
* 入站上下文可能仍使用 `group:<id>`；渠道从 `Provider` 推断并规范化为规范的 `agent:<agentId>:<channel>:group:<id>` 形式。
* 其他来源：
  * Cron 作业：`cron:<job.id>`（隔离）或自定义 `session:<custom-id>`（持久）
  * Webhooks：`hook:<uuid>`（除非钩子明确设置）
  * 节点运行：`node-<nodeId>`

## 生命周期

* 重置策略：会话被重用直到过期，过期在下一条入站消息时评估。
* 每日重置：默认为**网关主机当地时间凌晨 4:00**。会话一旦其最后更新早于最近的每日重置时间就过时。
* 空闲重置（可选）：`idleMinutes` 添加滑动空闲窗口。当同时配置每日和空闲重置时，**先到期的**强制新会话。
* 旧版仅空闲：如果您在没有 `session.reset`/`resetByType` 配置的情况下设置 `session.idleMinutes`，OpenClaw 保持仅空闲模式以保持向后兼容。
* 每类型覆盖（可选）：`resetByType` 允许覆盖 `direct`、`group` 和 `thread` 会话的策略（线程 = Slack/Discord 线程、Telegram 主题、矩阵线程（当连接器提供时））。
* 每渠道覆盖（可选）：`resetByChannel` 覆盖渠道的重置策略（适用于该渠道的所有会话类型，优先于 `reset`/`resetByType`）。
* 重置触发器：精确的 `/new` 或 `/reset`（加上 `resetTriggers` 中的任何额外项）启动新的会话 ID 并传递消息的剩余部分。`/new <model>` 接受模型别名、`provider/model` 或提供商名称（模糊匹配）以设置新会话模型。如果单独发送 `/new` 或 `/reset`，OpenClaw 运行简短的"hello"问候轮次以确认重置。
* 手动重置：从存储中删除特定键或移除 JSONL 记录；下一条消息会重新创建它们。
* 隔离的 cron 作业始终在每次运行中生成新的 `sessionId`（无空闲重用）。

## 发送策略（可选）

阻止特定会话类型的传递，而不列出各个 ID。

```json5
{
  session: {
    sendPolicy: {
      rules: [
        { action: "deny", match: { channel: "discord", chatType: "group" } },
        { action: "deny", match: { keyPrefix: "cron:" } },
        // 匹配原始会话键（包括 `agent:<id>:` 前缀）。
        { action: "deny", match: { rawKeyPrefix: "agent:main:discord:" } },
      ],
      default: "allow",
    },
  },
}
```

运行时覆盖（仅所有者）：

* `/send on` → 允许此会话
* `/send off` → 拒绝此会话
* `/send inherit` → 清除覆盖并使用配置规则
  将这些作为独立消息发送，以便它们注册。

## 配置（可选重命名示例）

```json5
// ~/.openclaw/openclaw.json
{
  session: {
    scope: "per-sender", // 保持群组键分离
    dmScope: "main", // DM 连续性（为共享收件箱设置 per-channel-peer/per-account-channel-peer）
    identityLinks: {
      alice: ["telegram:123456789", "discord:987654321012345678"],
    },
    reset: {
      // 默认值：mode=daily, atHour=4（网关主机当地时间）。
      // 如果还设置了 idleMinutes，先到期的获胜。
      mode: "daily",
      atHour: 4,
      idleMinutes: 120,
    },
    resetByType: {
      thread: { mode: "daily", atHour: 4 },
      direct: { mode: "idle", idleMinutes: 240 },
      group: { mode: "idle", idleMinutes: 120 },
    },
    resetByChannel: {
      discord: { mode: "idle", idleMinutes: 10080 },
    },
    resetTriggers: ["/new", "/reset"],
    store: "~/.openclaw/agents/{agentId}/sessions/sessions.json",
    mainKey: "main",
  },
}
```

## 检查

* `openclaw status` — 显示存储路径和最近会话。
* `openclaw sessions --json` — 转储每个条目（使用 `--active <minutes>` 过滤）。
* `openclaw gateway call sessions.list --params '{}'` — 从运行中的网关获取会话（使用 `--url`/`--token` 远程网关访问）。
* 在聊天中发送 `/status` 作为独立消息，以查看代理是否可访问、会话上下文使用了多少、当前 thinking/fast/verbose 切换，以及您的 WhatsApp web 凭据最后刷新时间（帮助发现重新链接需求）。
* 发送 `/context list` 或 `/context detail` 以查看系统提示和注入的工作空间文件中的内容（以及最大的上下文贡献者）。
* 发送 `/stop`（或独立的中止短语如 `stop`、`stop action`、`stop run`、`stop openclaw`）以中止当前运行、清除该会话的排队后续消息，并停止从它生成的任何子代理运行（回复包括停止计数）。
* 发送 `/compact`（可选说明）作为独立消息以总结旧上下文并释放窗口空间。参见 [/concepts/compaction](/concepts/compaction)。
* 可以直接打开 JSONL 记录以查看完整轮次。

## 提示

* 保持主键专用于 1:1 流量；让群组保持自己的键。
* 自动化清理时，删除单个键而不是整个存储，以保留其他地方的上下文。

## 会话来源元数据

每个会话条目记录它来自哪里（尽力而为）在 `origin` 中：

* `label`：人类标签（从对话标签 + 群组主题/渠道解析）
* `provider`：规范化渠道 ID（包括扩展）
* `from`/`to`：入站信封中的原始路由 ID
* `accountId`：提供商账户 ID（多账户时）
* `threadId`：渠道支持时的线程/主题 ID
  来源字段为直接消息、渠道和群组填充。如果连接器仅更新传递路由（例如保持 DM 主会话新鲜），它仍应提供入站上下文，以便会话保留其解释元数据。扩展可以通过在入站上下文中发送 `ConversationLabel`、`GroupSubject`、`GroupChannel`、`GroupSpace` 和 `SenderName` 并调用 `recordSessionMetaFromInbound`（或传递相同上下文到 `updateLastRoute`）来执行此操作。