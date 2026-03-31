---
title: agent
description: agent 页面
---

# 代理运行时

# 代理运行时 🤖

OpenClaw 运行一个基于 **pi-mono** 的单一嵌入式代理运行时。

## 工作空间（必需）

OpenClaw 使用单个代理工作空间目录（`agents.defaults.workspace`）作为代理的**唯一**工作目录（`cwd`），用于工具和上下文。

建议：使用 `openclaw setup` 创建 `~/.openclaw/openclaw.json`（如果缺失）并初始化工作空间文件。

完整工作空间布局 + 备份指南：[代理工作空间](/concepts/agent-workspace)

如果启用了 `agents.defaults.sandbox`，非主会话可以使用 `agents.defaults.sandbox.workspaceRoot` 覆盖为每个会话的工作空间（参见[网关配置](/gateway/configuration)）。

## 引导文件（注入）

在 `agents.defaults.workspace` 中，OpenClaw 期望以下用户可编辑文件：

* `AGENTS.md` — 操作说明 + "记忆"
* `SOUL.md` — 人设、边界、语气
* `TOOLS.md` — 用户维护的工具笔记（如 `imsg`、`sag`、约定）
* `BOOTSTRAP.md` — 一次性首次运行仪式（完成后删除）
* `IDENTITY.md` — 代理名称/风格/表情
* `USER.md` — 用户资料 + 首选称呼

在新会话的第一轮，OpenClaw 会将这些文件的内容直接注入到代理上下文中。

空白文件会被跳过。大文件会被修剪和截断，并添加标记以保持提示简洁（读取文件以获取完整内容）。

如果文件缺失，OpenClaw 会注入一行单一的"缺失文件"标记（`openclaw setup` 将创建安全默认模板）。

`BOOTSTRAP.md` 仅在**全新工作空间**（无其他引导文件）时创建。如果在完成仪式后删除它，后续重启时不应重新创建。

要完全禁用引导文件创建（用于预填充的工作空间），请设置：

```json5
{ agent: { skipBootstrap: true } }
```

## 内置工具

核心工具（read/exec/edit/write 及相关系统工具）始终可用，但需遵守工具策略。`apply_patch` 是可选的，由 `tools.exec.applyPatch` 控制。`TOOLS.md` **不**控制存在哪些工具；它只是关于*你*希望如何使用它们的指导。

## 技能

OpenClaw 从三个位置加载技能（名称冲突时工作空间优先）：

* 捆绑（随安装一起分发）
* 托管/本地：`~/.openclaw/skills`
* 工作空间：`<workspace>/skills`

技能可以通过配置/环境限制（参见[网关配置](/gateway/configuration)中的 `skills`）。

## pi-mono 集成

OpenClaw 重用了 pi-mono 代码库的片段（模型/工具），但**会话管理、发现和工具接线由 OpenClaw 所有**。

* 无 pi-coding 代理运行时。
* 不读取 `~/.pi/agent` 或 `<workspace>/.pi` 设置。

## 会话

会话记录以 JSONL 格式存储在：

* `~/.openclaw/agents/<agentId>/sessions/<SessionId>.jsonl`

会话 ID 是稳定的，由 OpenClaw 选择。
旧的 Pi/Tau 会话文件夹**不会被读取**。

## 流式传输时转向

当队列模式为 `steer` 时，入站消息会被注入到当前运行中。队列在**每个工具调用后**检查；如果存在排队的消息，当前助手消息中的剩余工具调用会被跳过（带有"Skipped due to queued user message."的错误工具结果），然后在下一个助手响应之前注入排队的用户消息。

当队列模式为 `followup` 或 `collect` 时，入站消息会被保留直到当前轮次结束，然后新的代理轮次以排队的负载开始。参见[队列](/concepts/queue)了解模式 + 防抖/上限行为。

块流式传输会在完成的助手块完成后立即发送；它**默认关闭**（`agents.defaults.blockStreamingDefault: "off"`）。
通过 `agents.defaults.blockStreamingBreak`（`text_end` vs `message_end`；默认为 text\_end）调整边界。
使用 `agents.defaults.blockStreamingChunk` 控制软块分块（默认为 800-1200 字符；优先段落换行，然后是换行；最后是句子）。
使用 `agents.defaults.blockStreamingCoalesce` 合并流式块以减少单行垃圾（发送前基于空闲的合并）。非 Telegram 渠道需要显式 `*.blockStreaming: true` 才能启用块回复。
详细工具摘要在工具开始时发出（无防抖）；Control UI 在可用时通过代理事件流式传输工具输出。
更多详情：[流式传输 + 分块](/concepts/streaming)。

## 模型引用

配置中的模型引用（例如 `agents.defaults.model` 和 `agents.defaults.models`）通过在**第一个**`/` 处分割来解析。

* 配置模型时使用 `provider/model`。
* 如果模型 ID 本身包含 `/`（OpenRouter 风格），请包含提供商前缀（例如 `openrouter/moonshotai/kimi-k2`）。
* 如果省略提供商，OpenClaw 将输入视为别名或**默认提供商**的模型（仅在模型 ID 中没有 `/` 时有效）。

## 配置（最小）

至少设置：

* `agents.defaults.workspace`
* `channels.whatsapp.allowFrom`（强烈推荐）

***

*下一节：[群组消息](/channels/group-messages)* 🦞