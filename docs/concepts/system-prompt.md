---
title: system prompt
description: system prompt 页面
---

# 系统提示

# 系统提示

OpenClaw 为每个代理运行构建自定义系统提示。提示**由 OpenClaw 所有**，不使用 pi-coding-agent 默认提示。

提示由 OpenClaw 组装并注入每个代理运行。

## 结构

提示有意紧凑并使用固定部分：

* **工具**：当前工具列表 + 简短描述。
* **安全**：简短的护栏提醒，避免权力寻求行为或绕过监督。
* **技能**（当可用）：告诉模型如何按需加载技能说明。
* **OpenClaw 自我更新**：如何运行 `config.apply` 和 `update.run`。
* **工作空间**：工作目录（`agents.defaults.workspace`）。
* **文档**：OpenClaw 文档的本地路径（repo 或 npm 包）以及何时读取它们。
* **工作空间文件（注入）**：表示引导文件包含在下方。
* **沙盒**（启用时）：表示沙盒运行时、沙盒路径，以及是否可用提升执行。
* **当前日期和时间**：用户本地时间、时区和时间格式。
* **回复标签**：支持提供商的可选回复标签语法。
* **心跳**：心跳提示和确认行为。
* **运行时**：主机、操作系统、节点、模型、repo 根（检测到时）、推理级别（一行）。
* **推理**：当前可见性级别 + /reasoning 切换提示。

系统提示中的安全护栏是指导性的。它们指导模型行为，但不强制执行策略。使用工具策略、执行批准、沙盒和渠道白名单进行强制执行；运营商可以按设计禁用这些。

## 提示模式

OpenClaw 可以为子代理渲染较小的系统提示。运行时为每次运行设置一个 `promptMode`（不是用户面对的配置）：

* `full`（默认）：包含上述所有部分。
* `minimal`：用于子代理；省略**技能**、**记忆召回**、**OpenClaw 自我更新**、**模型别名**、**用户身份**、**回复标签**、**消息**、**静默回复**和**心跳**。工具、**安全**、工作空间、沙盒、当前日期和时间（已知时）、运行时和注入上下文保持可用。
* `none`：仅返回基本身份行。

当 `promptMode=minimal` 时，额外注入的提示标记为**子代理上下文**而不是**群组聊天上下文**。

## 工作空间引导注入

引导文件被修剪并附加在**项目上下文**下，以便模型看到身份和配置文件上下文，而无需显式读取：

* `AGENTS.md`
* `SOUL.md`
* `TOOLS.md`
* `IDENTITY.md`
* `USER.md`
* `HEARTBEAT.md`
* `BOOTSTRAP.md`（仅在全新工作空间）
* `MEMORY.md`（如果存在），否则 `memory.md` 作为小写回退

所有这些文件在每轮都**注入到上下文窗口中**，这意味着它们消耗令牌。保持简洁——特别是 `MEMORY.md`，它会随着时间增长并导致意外的更高上下文使用和更频繁的压缩。

> **注意：** `memory/*.md` 每日文件**不会**自动注入。它们通过 `memory_search` 和 `memory_get` 工具按需访问，因此除非模型明确读取它们，否则不会计入上下文窗口。

大文件会被截断并带有标记。最大每文件大小由 `agents.defaults.bootstrapMaxChars`（默认：20000）控制。文件间注入的引导内容总量由 `agents.defaults.bootstrapTotalMaxChars`（默认：150000）限制。缺失文件注入短缺失文件标记。发生截断时，OpenClaw 可以在项目上下文中注入警告块；使用 `agents.defaults.bootstrapPromptTruncationWarning`（`off`、`once`、`always`；默认：`once`）控制此行为。

子代理会话仅注入 `AGENTS.md` 和 `TOOLS.md`（其他引导文件被过滤掉以保持子代理上下文小）。

内部钩子可以通过 `agent:bootstrap` 拦截此步骤以改变或替换注入的引导文件（例如交换 `SOUL.md` 为替代人设）。

要检查每个注入文件的贡献大小（原始 vs 注入、截断，以及工具模式开销），使用 `/context list` 或 `/context detail`。参见[上下文](/concepts/context)。

## 时间处理

当用户时区已知时，系统提示包括专用的**当前日期和时间**部分。为了保持提示缓存稳定，它现在只包括**时区**（无动态时钟或时间格式）。

当代理需要当前时间时使用 `session_status`；状态卡包括时间戳行。

配置：

* `agents.defaults.userTimezone`
* `agents.defaults.timeFormat`（`auto` | `12` | `24`）

参见[日期和时间](/date-time)了解完整行为详情。

## 技能

当存在符合条件的技能时，OpenClaw 注入一个紧凑的**可用技能列表**（`formatSkillsForPrompt`），包括每个技能的**文件路径**。提示指示模型使用 `read` 在列出的位置加载 SKILL.md（工作空间、托管或捆绑）。如果没有符合条件的技能，则省略技能部分。

```
<available_skills>
  <skill>
    <name>...</name>
    <description>...</description>
    <location>...</location>
  </skill>
</available_skills>
```

这保持基础提示小，同时仍支持有针对性的技能使用。

## 文档

当可用时，系统提示包括一个**文档**部分，指向本地 OpenClaw 文档目录（repo 工作空间中的 `docs/` 或捆绑的 npm 包文档），还注明公共镜像、源代码仓库、社区 Discord 和 ClawHub（https://clawhub.com）用于技能发现。提示指示模型首先查阅本地文档以了解 OpenClaw 行为、命令、配置或架构，并在可能时自行运行 `openclaw status`（仅在无法访问时询问用户）。