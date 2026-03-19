# 上下文

# 上下文

"上下文"是**OpenClaw 发送给模型进行运行的所有内容**。它以模型的**上下文窗口**（令牌限制）为界。

初学者心智模型：

* **系统提示**（OpenClaw 构建）：规则、工具、技能列表、时间/运行时以及注入的工作空间文件。
* **对话历史**：您的消息 + 该会话中助手的回复。
* **工具调用/结果 + 附件**：命令输出、文件读取、图像/音频等。

上下文与"记忆"不同：记忆可以存储在磁盘上并在以后重新加载；上下文是模型当前窗口内的内容。

## 快速开始（检查上下文）

* `/status` → 快速"我的窗口有多满？"视图 + 会话设置。
* `/context list` → 注入的内容 + 粗略大小（每个文件 + 总计）。
* `/context detail` → 更深层次的分部：每个文件、每个工具模式大小、每个技能条目大小以及系统提示大小。
* `/usage tokens` → 将每回复使用情况追加到正常回复的页脚。
* `/compact` → 将旧历史总结为紧凑条目以释放窗口空间。

另见：[斜杠命令](/tools/slash-commands)、[令牌使用与成本](/reference/token-use)、[压缩](/concepts/compaction)。

## 示例输出

值因模型、提供商、工具策略以及工作空间中的内容而异。

### `/context list`

```
🧠 Context breakdown
Workspace: <workspaceDir>
Bootstrap max/file: 20,000 chars
Sandbox: mode=non-main sandboxed=false
System prompt (run): 38,412 chars (~9,603 tok) (Project Context 23,901 chars (~5,976 tok))

Injected workspace files:
- AGENTS.md: OK | raw 1,742 chars (~436 tok) | injected 1,742 chars (~436 tok)
- SOUL.md: OK | raw 912 chars (~228 tok) | injected 912 chars (~228 tok)
- TOOLS.md: TRUNCATED | raw 54,210 chars (~13,553 tok) | injected 20,962 chars (~5,241 tok)
- IDENTITY.md: OK | raw 211 chars (~53 tok) | injected 211 chars (~53 tok)
- USER.md: OK | raw 388 chars (~97 tok) | injected 388 chars (~97 tok)
- HEARTBEAT.md: MISSING | raw 0 | injected 0
- BOOTSTRAP.md: OK | raw 0 chars (~0 tok) | injected 0 chars (~0 tok)

Skills list (system prompt text): 2,184 chars (~546 tok) (12 skills)
Tools: read, edit, write, exec, process, browser, message, sessions_send, …
Tool list (system prompt text): 1,032 chars (~258 tok)
Tool schemas (JSON): 31,988 chars (~7,997 tok) (counts toward context; not shown as text)
Tools: (same as above)

Session tokens (cached): 14,250 total / ctx=32,000
```

### `/context detail`

```
🧠 Context breakdown (detailed)
…
Top skills (prompt entry size):
- frontend-design: 412 chars (~103 tok)
- oracle: 401 chars (~101 tok)
… (+10 more skills)

Top tools (schema size):
- browser: 9,812 chars (~2,453 tok)
- exec: 6,240 chars (~1,560 tok)
… (+N more tools)
```

## 什么计入上下文窗口

模型接收的所有内容都计入，包括：

* 系统提示（所有部分）。
* 对话历史。
* 工具调用 + 工具结果。
* 附件/记录（图像/音频/文件）。
* 压缩摘要和修剪产物。
* 提供商"包装器"或隐藏标头（不可见，仍计入）。

## OpenClaw 如何构建系统提示

系统提示**由 OpenClaw 所有**，每轮重新构建。它包括：

* 工具列表 + 简短描述。
* 技能列表（仅元数据；见下文）。
* 工作空间位置。
* 时间（UTC + 配置的用户转换时间）。
* 运行时元数据（主机/操作系统/模型/推理）。
* 在 **Project Context** 下注入的工作空间引导文件。

完整分解：[系统提示](/concepts/system-prompt)。

## 注入的工作空间文件（项目上下文）

默认情况下，OpenClaw 注入一组固定的工作空间文件（如果存在）：

* `AGENTS.md`
* `SOUL.md`
* `TOOLS.md`
* `IDENTITY.md`
* `USER.md`
* `HEARTBEAT.md`
* `BOOTSTRAP.md`（仅首次运行）

大文件使用 `agents.defaults.bootstrapMaxChars`（默认 `20000` 字符）按文件截断。OpenClaw 还使用 `agents.defaults.bootstrapTotalMaxChars`（默认 `150000` 字符）在文件间强制执行总引导注入上限。`/context` 显示**原始 vs 注入**大小以及是否发生截断。

发生截断时，运行时可以在 Project Context 下注入警告块。配置此使用 `agents.defaults.bootstrapPromptTruncationWarning`（`off`、`once`、`always`；默认 `once`）。

## 技能：按需注入 vs 加载

系统提示包含一个紧凑的**技能列表**（名称 + 描述 + 位置）。此列表有真实开销。

默认情况下，技能指令**不**包含。模型被期望在需要时 `read` 技能的 `SKILL.md`。

## 工具：有两种成本

工具以两种方式影响上下文：

1. 系统提示中的**工具列表**文本（如您所见的"Tooling"）。
2. **工具模式**（JSON）。这些被发送给模型以便它可以调用工具。它们计入上下文，尽管您看不到它们作为纯文本。

`/context detail` 分解最大的工具模式，以便您可以看到什么占主导。

## 命令、指令和"内联快捷方式"

斜杠命令由网关处理。有几种不同的行为：

* **独立命令**：仅是 `/...` 的消息作为命令运行。
* **指令**：`/think`、`/verbose`、`/reasoning`、`/elevated`、`/model`、`/queue` 在模型看到消息之前被剥离。
  * 仅指令消息持久化会话设置。
  * 正常消息中的内联指令作为每消息提示运行。
* **内联快捷方式**（仅允许列表中的发送者）：某些正常消息内的 `/...` 令牌可以立即运行（例如"hey /status"），并在模型看到剩余文本之前被剥离。

详情：[斜杠命令](/tools/slash-commands)。

## 会话、压缩和修剪（什么持久化）

什么在消息间持久化取决于机制：

* **正常历史**持久化在会话记录中，直到按策略压缩/修剪。
* **压缩**将摘要持久化到记录中，并保持最近的消息完整。
* **修剪**从运行的*内存中*提示中删除旧工具结果，但不重写记录。

文档：[会话](/concepts/session)、[压缩](/concepts/compaction)、[会话修剪](/concepts/session-pruning)。

默认情况下，OpenClaw 使用内置的 `legacy` 上下文引擎进行组装和压缩。如果您安装提供 `kind: "context-engine"` 的插件并使用 `plugins.slots.contextEngine` 选择它，OpenClaw 将上下文组装、`/compact` 和相关子代理上下文生命周期钩子委托给该引擎。`ownsCompaction: false` 不会自动回退到旧版引擎；活动引擎仍必须正确实现 `compact()`。请参阅[上下文引擎](/concepts/context-engine)了解完整的可插拔接口、生命周期钩子和配置。

## `/context` 实际报告什么

`/context` 优先使用最新的**运行构建的**系统提示报告（如果可用）：

* `System prompt (run)` = 从最后一个嵌入式（工具型）运行捕获并持久化在会话存储中。
* `System prompt (estimate)` = 在没有运行报告时或在运行不生成报告的 CLI 后端时动态计算。

无论哪种方式，它都报告大小和主要贡献者；它**不**转储完整的系统提示或工具模式。