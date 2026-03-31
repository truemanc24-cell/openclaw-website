---
title: agent loop
description: agent loop 页面
---

# 代理循环

# 代理循环 (OpenClaw)

代理循环是代理的完整"真实"运行：摄入 → 上下文组装 → 模型推理 → 工具执行 → 流式回复 → 持久化。它是将消息转化为行动和最终回复的权威路径，同时保持会话状态一致。

在 OpenClaw 中，循环是每个会话的单一序列化运行，它在模型思考、调用工具和流式输出时发出生命周期和流事件。本文档解释了这个真实循环是如何端到端接线的。

## 入口点

* 网关 RPC：`agent` 和 `agent.wait`。
* CLI：`agent` 命令。

## 工作原理（高层）

1. `agent` RPC 验证参数，解析会话（sessionKey/sessionId），持久化会话元数据，立即返回 `{ runId, acceptedAt }`。
2. `agentCommand` 运行代理：
   * 解析模型 + thinking/verbose 默认值
   * 加载技能快照
   * 调用 `runEmbeddedPiAgent`（pi-agent-core 运行时）
   * 如果嵌入式循环未发出，则发出**生命周期 end/error**
3. `runEmbeddedPiAgent`：
   * 通过每会话 + 全局队列序列化运行
   * 解析模型 + 认证配置文件并构建 pi 会话
   * 订阅 pi 事件并流式传输助手/工具增量
   * 强制超时 → 如果超出则中止运行
   * 返回负载 + 使用元数据
4. `subscribeEmbeddedPiSession` 将 pi-agent-core 事件桥接到 OpenClaw `agent` 流：
   * 工具事件 => `stream: "tool"`
   * 助手增量 => `stream: "assistant"`
   * 生命周期事件 => `stream: "lifecycle"`（`phase: "start" | "end" | "error"`）
5. `agent.wait` 使用 `waitForAgentJob`：
   * 等待 `runId` 的**生命周期 end/error**
   * 返回 `{ status: ok|error|timeout, startedAt, endedAt, error? }`

## 队列 + 并发

* 运行按会话键（会话通道）序列化，可选通过全局通道。
* 这防止了工具/会话竞争并保持会话历史一致。
* 消息渠道可以选择队列模式（collect/steer/followup）来供给这个通道系统。
  参见[命令队列](/concepts/queue)。

## 会话 + 工作空间准备

* 解析并创建工作空间；沙盒运行可能会重定向到沙盒工作空间根。
* 加载技能（或从快照重用）并注入到环境和提示中。
* 解析引导/上下文文件并注入到系统提示报告中。
* 获取会话写入锁；打开并准备 `SessionManager` 然后开始流式传输。

## 提示组装 + 系统提示

* 系统提示由 OpenClaw 的基础提示、技能提示、引导上下文和每轮覆盖构建。
* 强制执行模型特定限制和压缩保留令牌。
* 参见[系统提示](/concepts/system-prompt)了解模型看到的内容。

## 钩子点（你可以拦截的地方）

OpenClaw 有两个钩子系统：

* **内部钩子**（网关钩子）：用于命令和生命周期事件的事件驱动脚本。
* **插件钩子**：代理/工具生命周期和网关管道内的扩展点。

### 内部钩子（网关钩子）

* **`agent:bootstrap`**：在构建引导文件时运行，在系统提示最终确定之前。
  使用此钩子添加/删除引导上下文文件。
* **命令钩子**：`/new`、`/reset`、`/stop` 和其他命令事件（参见钩子文档）。

参见[钩子](/automation/hooks)了解设置和示例。

### 插件钩子（代理 + 网关生命周期）

这些在代理循环或网关管道内运行：

* **`before_model_resolve`**：在会话前运行（无 `messages`），在模型解析前确定性覆盖提供商/模型。
* **`before_prompt_build`**：在会话加载后运行（带 `messages`），在提示提交前注入 `prependContext`、`systemPrompt`、`prependSystemContext` 或 `appendSystemContext`。使用 `prependContext` 进行每轮动态文本，使用系统上下文字段进行应放在系统提示空间中的稳定指导。
* **`before_agent_start`**：旧版兼容性钩子，可能在任一阶段运行；优先使用上述明确钩子。
* **`agent_end`**：检查完成后的最终消息列表和运行元数据。
* **`before_compaction` / `after_compaction`**：观察或注释压缩周期。
* **`before_tool_call` / `after_tool_call`**：拦截工具参数/结果。
* **`tool_result_persist`**：在写入会话记录前同步转换工具结果。
* **`message_received` / `message_sending` / `message_sent`**：入站 + 出站消息钩子。
* **`session_start` / `session_end`**：会话生命周期边界。
* **`gateway_start` / `gateway_stop`**：网关生命周期事件。

参见[插件](/tools/plugin#plugin-hooks)了解钩子 API 和注册详情。

## 流式传输 + 部分回复

* 助手增量从 pi-agent-core 流式传输并作为 `assistant` 事件发出。
* 块流式传输可以在 `text_end` 或 `message_end` 时发出部分回复。
* 推理流式传输可以作为单独流或块回复发出。
* 参见[流式传输](/concepts/streaming)了解分块和块回复行为。

## 工具执行 + 消息工具

* 工具开始/更新/结束事件在 `tool` 流上发出。
* 工具结果在记录/发出前会进行大小和图像负载清理。
* 消息工具发送被跟踪以抑制重复的助手确认。

## 回复整形 + 抑制

* 最终负载由以下内容组装：
  * 助手文本（和可选推理）
  * 内联工具摘要（当 verbose + 允许时）
  * 模型错误时的助手错误文本
* `NO_REPLY` 被视为静默令牌，并从出站负载中过滤。
* 消息工具重复项从最终负载列表中删除。
* 如果没有可渲染的负载且工具出错，则发出回退工具错误回复（除非消息工具已发送用户可见回复）。

## 压缩 + 重试

* 自动压缩发出 `compaction` 流事件并可以触发重试。
* 在重试时，重置内存缓冲区和工具摘要以避免重复输出。
* 参见[压缩](/concepts/compaction)了解压缩管道。

## 事件流（当前）

* `lifecycle`：由 `subscribeEmbeddedPiAgent`（以及 `agentCommand` 作为回退）发出
* `assistant`：从 pi-agent-core 流式传输的增量
* `tool`：从 pi-agent-core 流式传输的工具事件

## 聊天渠道处理

* 助手增量被缓冲到聊天 `delta` 消息中。
* 聊天 `final` 在**生命周期结束/错误**时发出。

## 超时

* `agent.wait` 默认：30s（仅等待）。`timeoutMs` 参数覆盖。
* 代理运行时：`agents.defaults.timeoutSeconds` 默认 600s；在 `runEmbeddedPiAgent` 中强制执行中止计时器。

## 可能提前结束的地方

* 代理超时（中止）
* AbortSignal（取消）
* 网关断开或 RPC 超时
* `agent.wait` 超时（仅等待，不停止代理）