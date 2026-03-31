---
title: cli backends
description: cli backends 页面
---

# CLI 后端（回退运行时）

OpenClaw 可以将**本地 AI CLI** 作为**纯文本回退**运行，当 API 提供商宕机、速率受限或临时表现异常时。这是刻意保守的：

* **工具被禁用**（无工具调用）。
* **文本进 → 文本出**（可靠）。
* **支持会话**（因此后续轮次保持连贯）。
* **如果 CLI 接受图像路径，可以传递图像**。

这是设计为**安全网**而非主要路径。当你想"总是有效"的文本响应而不依赖外部 API 时使用它。

## 入门友好快速开始

你可以**无需任何配置**使用 Claude Code CLI（OpenClaw 附带内置默认）：

```bash
openclaw agent --message "hi" --model claude-cli/opus-4.6
```

Codex CLI 也可以开箱即用：

```bash
openclaw agent --message "hi" --model codex-cli/gpt-5.4
```

如果你的网关在 launchd/systemd 下运行且 PATH 有限，只需添加命令路径：

```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "claude-cli": {
          command: "/opt/homebrew/bin/claude",
        },
      },
    },
  },
}
```

仅此而已。无需密钥，除 CLI 本身外不需要额外认证配置。

## 作为回退使用

将 CLI 后端添加到回退列表，以便它仅在主模型失败时运行：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["claude-cli/opus-4.6", "claude-cli/opus-4.5"],
      },
      models: {
        "anthropic/claude-opus-4-6": { alias: "Opus" },
        "claude-cli/opus-4.6": {},
        "claude-cli/opus-4.5": {},
      },
    },
  },
}
```

注意：

* 如果你使用 `agents.defaults.models`（允许列表），你必须包含 `claude-cli/...`。
* 如果主提供商失败（auth、速率限制、超时），OpenClaw 将尝试 CLI 后端。

## 配置概述

所有 CLI 后端位于：

```
agents.defaults.cliBackends
```

每个条目由**提供商 ID** 键控（例如 `claude-cli`、`my-cli`）。提供商 ID 成为你的模型引用的左侧：

```
<provider>/<model>
```

### 示例配置

```json5
{
  agents: {
    defaults: {
      cliBackends: {
        "claude-cli": {
          command: "/opt/homebrew/bin/claude",
        },
        "my-cli": {
          command: "my-cli",
          args: ["--json"],
          output: "json",
          input: "arg",
          modelArg: "--model",
          modelAliases: {
            "claude-opus-4-6": "opus",
            "claude-opus-4-5": "opus",
            "claude-sonnet-4-5": "sonnet",
          },
          sessionArg: "--session",
          sessionMode: "existing",
          sessionIdFields: ["session_id", "conversation_id"],
          systemPromptArg: "--system",
          systemPromptWhen: "first",
          imageArg: "--image",
          imageMode: "repeat",
          serialize: true,
        },
      },
    },
  },
}
```

## 工作原理

1. **选择后端** 基于提供商前缀（`claude-cli/...`）。
2. **构建系统提示** 使用相同的 OpenClaw 提示 + 工作区上下文。
3. **执行 CLI** 带会话 id（如果支持）以保持历史一致。
4. **解析输出**（JSON 或纯文本）并返回最终文本。
5. **持久化会话 id** 每个后端，以便后续重用相同的 CLI 会话。

## 会话

* 如果 CLI 支持会话，设置 `sessionArg`（例如 `--session-id`）或 `sessionArgs`（占位符 `{sessionId}`）当 ID 需要插入多个标志时。
* 如果 CLI 使用**恢复子命令**和不同标志，设置 `resumeArgs`（恢复时替换 `args`）和可选的 `resumeOutput`（用于非 JSON 恢复）。
* `sessionMode`：
  * `always`：始终发送会话 id（如果没有存储则新 UUID）。
  * `existing`：仅在之前存储了会话 id 时才发送会话 id。
  * `none`：永不发送会话 id。

## 图像（传递）

如果你的 CLI 接受图像路径，设置 `imageArg`：

```json5
imageArg: "--image",
imageMode: "repeat"
```

OpenClaw 会将 base64 图像写入临时文件。如果设置了 `imageArg`，这些路径作为 CLI 参数传递。如果缺少 `imageArg`，OpenClaw 将文件路径附加到提示中（路径注入），这对于从纯路径自动加载本地文件的 CLI 来说足够（Claude Code CLI 行为）。

## 输入/输出

* `output: "json"`（默认）尝试解析 JSON 并提取文本 + 会话 id。
* `output: "jsonl"` 解析 JSONL 流（Codex CLI `--json`）并在存在时提取最后一个代理消息加 `thread_id`。
* `output: "text"` 将 stdout 视为最终响应。

输入模式：

* `input: "arg"`（默认）将提示作为最后一个 CLI 参数传递。
* `input: "stdin"` 通过 stdin 发送提示。
* 如果提示很长且设置了 `maxPromptArgChars`，则使用 stdin。

## 默认（内置）

OpenClaw 为 `claude-cli` 附带默认：

* `command: "claude"`
* `args: ["-p", "--output-format", "json", "--permission-mode", "bypassPermissions"]`
* `resumeArgs: ["-p", "--output-format", "json", "--permission-mode", "bypassPermissions", "--resume", "{sessionId}"]`
* `modelArg: "--model"`
* `systemPromptArg: "--append-system-prompt"`
* `sessionArg: "--session-id"`
* `systemPromptWhen: "first"`
* `sessionMode: "always"`

OpenClaw 还为 `codex-cli` 附带默认：

* `command: "codex"`
* `args: ["exec","--json","--color","never","--sandbox","read-only","--skip-git-repo-check"]`
* `resumeArgs: ["exec","resume","{sessionId}","--color","never","--sandbox","read-only","--skip-git-repo-check"]`
* `output: "jsonl"`
* `resumeOutput: "text"`
* `modelArg: "--model"`
* `imageArg: "--image"`
* `sessionMode: "existing"`

仅在需要时覆盖（常见：绝对 `command` 路径）。

## 限制

* **无 OpenClaw 工具**（CLI 后端永远不会接收工具调用）。某些 CLI 可能仍运行自己的代理工具。
* **无流式传输**（收集 CLI 输出然后返回）。
* **结构化输出** 取决于 CLI 的 JSON 格式。
* **Codex CLI 会话** 通过文本输出恢复（无 JSONL），这不如初始 `--json` 运行结构化。OpenClaw 会话仍然正常工作。

## 故障排除

* **CLI 未找到**：将 `command` 设置为完整路径。
* **错误的模型名称**：使用 `modelAliases` 将 `provider/model` 映射到 CLI 模型。
* **无会话连续性**：确保设置了 `sessionArg` 且 `sessionMode` 不是 `none`（Codex CLI 当前无法使用 JSON 输出恢复）。
* **图像被忽略**：设置 `imageArg`（并验证 CLI 支持文件路径）。