# Cron 任务（网关调度器）

> **Cron 还是 Heartbeat？** 有关何时使用各自的指导，请参阅 [Cron vs Heartbeat](/automation/cron-vs-heartbeat)。

Cron 是网关的内置调度器。它会持久化任务，在正确的时间唤醒代理，并可选择将输出返回到聊天窗口。

如果你想要"每天早上运行这个"或"20分钟后提醒代理"，cron 就是这种机制。

故障排除：[/automation/troubleshooting](/automation/troubleshooting)

## 简明指南

* Cron 在**网关**内运行（不在模型内）。
* 任务持久化在 `~/.openclaw/cron/` 下，重启不会丢失计划。
* 两种执行方式：
  * **主会话**：加入系统事件队列，然后在下一个心跳时运行。
  * **隔离**：在 `cron:<jobId>` 或自定义会话中运行专用代理轮次，默认传递结果（announce）或无结果（none）。
  * **当前会话**：绑定到创建 cron 的会话（`sessionTarget: "current"`）。
  * **自定义会话**：在持久化命名会话中运行（`sessionTarget: "session:custom-id"`）。
* 唤醒是优先事项：任务可以请求"立即唤醒"vs"下一个心跳"。
* Webhook 发布通过 `delivery.mode = "webhook"` + `delivery.to = "<url>"` 每个任务单独配置。
* 对于已存储的带 `notify: true` 的旧任务，保留了对 `cron.webhook` 的回退支持，请将这些任务迁移到 webhook 投递模式。
* 对于升级，`openclaw doctor --fix` 可以在调度器处理之前规范化旧 cron 存储字段。

## 快速开始（可操作）

创建一次性提醒，验证它存在，并立即运行：

```bash
openclaw cron add \
  --name "Reminder" \
  --at "2026-02-01T16:00:00Z" \
  --session main \
  --system-event "Reminder: check the cron docs draft" \
  --wake now \
  --delete-after-run

openclaw cron list
openclaw cron run <job-id>
openclaw cron runs --id <job-id>
```

创建带投递的定期隔离任务：

```bash
openclaw cron add \
  --name "Morning brief" \
  --cron "0 7 * * *" \
  --tz "America/Los_Angeles" \
  --session isolated \
  --message "Summarize overnight updates." \
  --announce \
  --channel slack \
  --to "channel:C1234567890"
```

## 工具调用等效方式（网关 cron 工具）

有关规范的 JSON 格式和示例，请参阅[工具调用的 JSON 模式](/automation/cron-jobs#json-schema-for-tool-calls)。

## Cron 任务存储位置

Cron 任务默认持久化在网关主机的 `~/.openclaw/cron/jobs.json`。网关将文件加载到内存中并在更改时写回，因此手动编辑只在网关停止时才是安全的。优先使用 `openclaw cron add/edit` 或 cron 工具调用 API 进行更改。

## 入门级概述

把 Cron 任务想象成：**何时**运行 + **做什么**。

1. **选择计划**
   * 一次性提醒 → `schedule.kind = "at"`（CLI：`--at`）
   * 重复任务 → `schedule.kind = "every"` 或 `schedule.kind = "cron"`
   * 如果你的 ISO 时间戳缺少时区，则被视为**UTC**。

2. **选择运行位置**
   * `sessionTarget: "main"` → 在下一个心跳时使用主上下文运行。
   * `sessionTarget: "isolated"` → 在 `cron:<jobId>` 中运行专用代理轮次。
   * `sessionTarget: "current"` → 绑定到当前会话（在创建时解析为 `session:<sessionKey>`）。
   * `sessionTarget: "session:custom-id"` → 在持久化命名会话中运行，跨运行保持上下文。

   默认行为（不变）：
   * `systemEvent` 有效载荷默认为 `main`
   * `agentTurn` 有效载荷默认为 `isolated`

   要使用当前会话绑定，请明确设置 `sessionTarget: "current"`。

3. **选择有效载荷**
   * 主会话 → `payload.kind = "systemEvent"`
   * 隔离会话 → `payload.kind = "agentTurn"`

可选：一次性任务（`schedule.kind = "at"`）默认在成功后删除。设置 `deleteAfterRun: false` 保留它们（它们将在成功后禁用）。

## 概念

### 任务

Cron 任务是一条存储记录，包含：

* **计划**（何时运行），
* **有效载荷**（做什么），
* 可选的**投递模式**（`announce`、`webhook` 或 `none`）。
* 可选的**代理绑定**（`agentId`）：在特定代理下运行任务；如果缺失或未知，网关回退到默认代理。

任务由稳定的 `jobId` 标识（供 CLI/网关 API 使用）。在代理工具调用中，`jobId` 是规范形式；为兼容起见，也接受旧 `id`。一次性任务默认在成功后自动删除；设置 `deleteAfterRun: false` 保留它们。

### 计划

Cron 支持三种计划类型：

* `at`：通过 `schedule.at` 一次性时间戳（ISO 8601）。
* `every`：固定间隔（毫秒）。
* `cron`：5 字段 cron 表达式（或带秒的 6 字段），带可选的 IANA 时区。

Cron 表达式使用 `croner`。如果省略时区，则使用网关主机的本地时区。

为减少多个网关整点负载峰值，OpenClaw 对重复整点表达式（例如 `0 * * * *`、`0 */2 * * *`）应用确定性每个任务最多 5 分钟的分散窗口。固定小时表达式如 `0 7 * * *` 保持精确。

对于任何 cron 计划，你可以使用 `schedule.staggerMs` 设置明确的分散窗口（`0` 保持精确时间）。CLI 快捷方式：

* `--stagger 30s`（或 `1m`、`5m`）设置明确的分散窗口。
* `--exact` 强制 `staggerMs = 0`。

### 主会话 vs 隔离执行

#### 主会话任务（系统事件）

主任务将系统事件加入队列，可选地唤醒心跳运行器。它们必须使用 `payload.kind = "systemEvent"`。

* `wakeMode: "now"`（默认）：事件触发立即心跳运行。
* `wakeMode: "next-heartbeat"`：事件等待下一个计划心跳。

这是最合适的场景，你需要正常的心跳提示 + 主会话上下文。请参阅 [Heartbeat](/gateway/heartbeat)。

#### 隔离任务（专用 cron 会话）

隔离任务在会话 `cron:<jobId>` 或自定义会话中运行专用代理轮次。

关键行为：

* 提示前缀为 `[cron:<jobId> <job name>]` 以便追踪。
* 每次运行开始一个新的**会话 ID**（无先前对话延续），除非使用自定义会话。
* 自定义会话（`session:xxx`）跨运行保持上下文，支持每日站会等构建先前摘要的工作流。
* 默认行为：如果省略 `delivery`，隔离任务会公布摘要（`delivery.mode = "announce"`）。
* `delivery.mode` 选择：
  * `announce`：将摘要投递到目标渠道，并在主会话发布简要摘要。
  * `webhook`：当完成事件包含摘要时，将完成事件有效载荷 POST 到 `delivery.to`。
  * `none`：仅内部（无投递，无主会话摘要）。
* `wakeMode` 控制主会话摘要何时发布：
  * `now`：立即心跳。
  * `next-heartbeat`：等待下一个计划心跳。

将隔离任务用于嘈杂、频繁或"后台杂务"，这些不应该污染你的主聊天历史。

### 有效载荷形式（运行什么）

支持两种有效载荷类型：

* `systemEvent`：仅主会话，通过心跳提示路由。
* `agentTurn`：仅隔离会话，运行专用代理轮次。

常见 `agentTurn` 字段：

* `message`：必需的文本提示。
* `model` / `thinking`：可选覆盖（见下文）。
* `timeoutSeconds`：可选超时覆盖。
* `lightContext`：可选的轻量级引导模式，适用于不需要工作区引导文件注入的任务。

投递配置：

* `delivery.mode`：`none` | `announce` | `webhook`。
* `delivery.channel`：`last` 或特定渠道。
* `delivery.to`：渠道特定目标（announce）或 webhook URL（webhook 模式）。
* `delivery.bestEffort`：避免投递失败导致任务失败。

announce 投递抑制该运行的发送消息工具；使用 `delivery.channel`/`delivery.to` 定向聊天。当 `delivery.mode = "none"` 时，不向主会话发布摘要。

如果为隔离任务省略 `delivery`，OpenClaw 默认为 `announce`。

#### Announce 投递流程

当 `delivery.mode = "announce"` 时，cron 通过出站渠道适配器直接投递。主代理不会启动来制作或转发消息。

行为细节：

* 内容：投递使用隔离运行的出站有效载荷（文本/媒体），带正常分块和渠道格式。
* 仅心跳响应（`HEARTBEAT_OK` 无实际内容）不投递。
* 如果隔离运行已通过消息工具向同一目标发送了消息，则跳过投递以避免重复。
* 缺失或无效的投递目标会导致任务失败，除非 `delivery.bestEffort = true`。
* 简短摘要仅在 `delivery.mode = "announce"` 时发布到主会话。
* 主会话摘要尊重 `wakeMode`：`now` 触发立即心跳，`next-heartbeat` 等待下一个计划心跳。

#### Webhook 投递流程

当 `delivery.mode = "webhook"` 时，cron 在完成事件包含摘要时将完成事件有效载荷 POST 到 `delivery.to`。

行为细节：

* 端点必须是有效的 HTTP(S) URL。
* webhook 模式下不尝试渠道投递。
* webhook 模式下不在主会话发布摘要。
* 如果设置了 `cron.webhookToken`，则认证头为 `Authorization: Bearer <cron.webhookToken>`。
* 已弃用回退：带 `notify: true` 的已存储旧任务仍会发布到 `cron.webhook`（如果已配置），并显示警告以便你可以迁移到 `delivery.mode = "webhook"`。

### 模型和思维覆盖

隔离任务（`agentTurn`）可以覆盖模型和思维级别：

* `model`：提供商/模型字符串（例如 `anthropic/claude-sonnet-4-20250514`）或别名（例如 `opus`）
* `thinking`：思维级别（`off`、`minimal`、`low`、`medium`、`high`、`xhigh`；仅 GPT-5.2 + Codex 模型）

注意：你也可以在主会话任务上设置 `model`，但它会更改共享主会话模型。我们建议仅对隔离任务使用模型覆盖，以避免意外的上下文切换。

解析优先级：

1. 任务有效载荷覆盖（最高）
2. 钩子特定默认值（例如 `hooks.gmail.model`）
3. 代理配置默认

### 轻量级引导上下文

隔离任务（`agentTurn`）可以设置 `lightContext: true` 以使用轻量级引导上下文运行。

* 使用此选项用于不需要工作区引导文件注入的计划杂务。
* 在实践中，嵌入式运行时以 `bootstrapContextMode: "lightweight"` 运行，这有意保持 cron 引导上下文为空。
* CLI 等效：`openclaw cron add --light-context ...` 和 `openclaw cron edit --light-context`。

### 投递（渠道 + 目标）

隔离任务可以通过顶级 `delivery` 配置将输出投递到渠道：

* `delivery.mode`：`announce`（渠道投递）、`webhook`（HTTP POST）或 `none`。
* `delivery.channel`：`whatsapp` / `telegram` / `discord` / `slack` / `mattermost`（插件）/ `signal` / `imessage` / `last`。
* `delivery.to`：渠道特定收件人目标。

`announce` 投递仅对隔离任务有效（`sessionTarget: "isolated"`）。`webhook` 投递对主任务和隔离任务都有效。

如果省略 `delivery.channel` 或 `delivery.to`，cron 可以回退到主会话的"最后路由"（代理最后回复的位置）。

目标格式提醒：

* Slack/Discord/Mattermost（插件）目标应使用明确前缀（例如 `channel:<id>`、`user:<id>`）以避免歧义。
* Mattermost 纯 26 字符 ID 首先解析为**用户**（如果用户存在则为 DM，否则为频道）—— 使用 `user:<id>` 或 `channel:<id>` 以实现确定性路由。
* Telegram 主题应使用 `:topic:` 形式（见下文）。

#### Telegram 投递目标（主题/论坛主题）

Telegram 通过 `message_thread_id` 支持论坛主题。对于 cron 投递，你可以将主题/线程编码到 `to` 字段中：

* `-1001234567890`（仅聊天 ID）
* `-1001234567890:topic:123`（首选：明确主题标记）
* `-1001234567890:123`（简写：数字后缀）

也接受带前缀的目标如 `telegram:...` / `telegram:group:...`：

* `telegram:group:-1001234567890:topic:123`

## 工具调用的 JSON 模式

直接调用网关 `cron.*` 工具时使用这些格式（代理工具调用或 RPC）。CLI 标志接受人类可读的持续时间如 `20m`，但工具调用应该对 `schedule.at` 使用 ISO 8601 字符串，对 `schedule.everyMs` 使用毫秒。

### cron.add 参数

一次性主会话任务（系统事件）：

```json
{
  "name": "Reminder",
  "schedule": { "kind": "at", "at": "2026-02-01T16:00:00Z" },
  "sessionTarget": "main",
  "wakeMode": "now",
  "payload": { "kind": "systemEvent", "text": "Reminder text" },
  "deleteAfterRun": true
}
```

带投递的定期隔离任务：

```json
{
  "name": "Morning brief",
  "schedule": { "kind": "cron", "expr": "0 7 * * *", "tz": "America/Los_Angeles" },
  "sessionTarget": "isolated",
  "wakeMode": "next-heartbeat",
  "payload": {
    "kind": "agentTurn",
    "message": "Summarize overnight updates.",
    "lightContext": true
  },
  "delivery": {
    "mode": "announce",
    "channel": "slack",
    "to": "channel:C1234567890",
    "bestEffort": true
  }
}
```

绑定到当前会话的定期任务（创建时自动解析）：

```json
{
  "name": "Daily standup",
  "schedule": { "kind": "cron", "expr": "0 9 * * *" },
  "sessionTarget": "current",
  "payload": {
    "kind": "agentTurn",
    "message": "Summarize yesterday's progress."
  }
}
```

在自定义持久会话中的定期任务：

```json
{
  "name": "Project monitor",
  "schedule": { "kind": "every", "everyMs": 300000 },
  "sessionTarget": "session:project-alpha-monitor",
  "payload": {
    "kind": "agentTurn",
    "message": "Check project status and update the running log."
  }
}
```