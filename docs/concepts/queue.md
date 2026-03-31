---
title: queue
description: queue 页面
---

# 命令队列

# 命令队列 (2026-01-16)

我们通过一个微小的进程内队列序列化入站自动回复运行（所有渠道），以防止多个代理运行碰撞，同时仍允许跨会话安全并行。

## 为什么

* 自动回复运行可能很昂贵（LLM 调用），并且当多个入站消息同时到达时会碰撞。
* 序列化避免争夺共享资源（会话文件、日志、CLI stdin）并减少上游速率限制的可能性。

## 工作原理

* 通道感知的 FIFO 队列以可配置的并发上限排出每个通道（默认未配置通道为 1；main 默认为 4，subagent 默认为 8）。
* `runEmbeddedPiAgent` 按**会话键**入队（通道 `session:<key>`）以保证每个会话只有一个活动运行。
* 然后每个会话运行排队到**全局通道**（默认 `main`），以便总体并行度由 `agents.defaults.maxConcurrent` 限制。
* 启用详细日志时，排队的运行如果在开始前等待超过 ~2s 会发出简短通知。
* 排队的消息仍会在入队时立即触发打字指示器（当渠道支持时），因此在您等待轮次时用户体验不变。

## 队列模式（按渠道）

入站消息可以控制当前运行、等待后续轮次，或两者兼做：

* `steer`：立即注入当前运行（在下一个工具边界后取消挂起的工具调用）。如果不流式传输，回退到 followup。
* `followup`：在当前运行结束后排队到下一个代理轮次。
* `collect`：将所有排队的消息合并为**单个**后续轮次（默认）。如果消息针对不同渠道/线程，它们单独排出以保留路由。
* `steer-backlog`（又名 `steer+backlog`）：现在转向**并**保留消息以进行后续轮次。
* `interrupt`（旧版）：中止该会话的活动运行，然后运行最新消息。
* `queue`（旧版别名）：与 `steer` 相同。

Steer-backlog 意味着您可以在转向运行后获得后续回复，因此流式传输表面可能看起来像重复项。如果您希望每个入站消息有一个回复，请优先使用 `collect`/`steer`。
发送 `/queue collect` 作为独立命令（每会话）或设置 `messages.queue.byChannel.discord: "collect"`。

默认值（配置中未设置时）：

* 所有表面 → `collect`

通过 `messages.queue` 全局或按渠道配置：

```json5
{
  messages: {
    queue: {
      mode: "collect",
      debounceMs: 1000,
      cap: 20,
      drop: "summarize",
      byChannel: { discord: "collect" },
    },
  },
}
```

## 队列选项

选项适用于 `followup`、`collect` 和 `steer-backlog`（以及 `steer` 回退到 followup 时）：

* `debounceMs`：在开始后续轮次之前等待安静（防止"继续，继续"）。
* `cap`：每个会话的最大排队消息数。
* `drop`：溢出策略（`old`、`new`、`summarize`）。

Summarize 保留被丢弃消息的简短项目符号列表，并将其作为合成后续提示注入。
默认值：`debounceMs: 1000`、`cap: 20`、`drop: summarize`。

## 每会话覆盖

* 发送 `/queue <mode>` 作为独立命令以存储当前会话的模式。
* 可以组合选项：`/queue collect debounce:2s cap:25 drop:summarize`
* `/queue default` 或 `/queue reset` 清除会话覆盖。

## 范围和保证

* 适用于使用网关回复管道的所有入站渠道的自动回复代理运行（WhatsApp web、Telegram、Slack、Discord、Signal、iMessage、webchat 等）。
* 默认通道（`main`）对于入站 + 主心跳是进程范围的；设置 `agents.defaults.maxConcurrent` 以允许多个会话并行。
* 可能存在其他通道（例如 `cron`、`subagent`），因此后台作业可以并行运行而不会阻塞入站回复。
* 每会话通道保证一次只有一个代理运行接触给定会话。
* 无外部依赖或后台工作线程；纯 TypeScript + promises。

## 故障排除

* 如果命令看起来卡住了，启用详细日志并查找"queued for …ms"行以确认队列正在排出。
* 如果需要队列深度，启用详细日志并观察队列计时行。