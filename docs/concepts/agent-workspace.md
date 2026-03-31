---
title: agent workspace
description: agent workspace 页面
---

# 代理工作空间

# 代理工作空间

工作空间是代理的家。它是用于文件工具和工作空间上下文的唯一工作目录。将其视为私有内存。

这与 `~/.openclaw/` 不同，后者存储配置、凭证和会话。

**重要：**工作空间是**默认 cwd**，不是硬沙盒。工具相对于工作空间解析相对路径，但绝对路径仍然可以到达主机上的其他地方，除非启用沙盒。如果需要隔离，请使用[`agents.defaults.sandbox`](/gateway/sandboxing)（和/或每代理沙盒配置）。启用沙盒且 `workspaceAccess` 不是 `"rw"` 时，工具在沙盒工作空间下操作，位于 `~/.openclaw/sandboxes`，而不是您的主机工作空间。

## 默认位置

* 默认：`~/.openclaw/workspace`
* 如果设置了 `OPENCLAW_PROFILE` 且不是 `"default"`，默认变为 `~/.openclaw/workspace-<profile>`。
* 在 `~/.openclaw/openclaw.json` 中覆盖：

```json5
{
  agent: {
    workspace: "~/.openclaw/workspace",
  },
}
```

`openclaw onboard`、`openclaw configure` 或 `openclaw setup` 将创建工作空间并在缺失时填充引导文件。沙盒种子复制只接受工作空间内的常规文件；解析到源工作空间外的符号链接/硬链接别名会被忽略。

如果您已经自己管理工作空间文件，可以禁用引导文件创建：

```json5
{ agent: { skipBootstrap: true } }
```

## 额外工作空间文件夹

旧版本安装可能创建了 `~/openclaw`。保留多个工作空间目录会导致混淆的认证或状态漂移，因为一次只有一个工作空间是活动的。

**建议：**保持单个活动工作空间。如果不再使用额外文件夹，请将它们存档或移至垃圾箱（例如 `trash ~/openclaw`）。如果您有意保留多个工作空间，请确保 `agents.defaults.workspace` 指向活动的那一个。

`openclaw doctor` 会在检测到额外工作空间目录时发出警告。

## 工作空间文件映射（每个文件的含义）

这些是 OpenClaw 在工作空间内期望的标准文件：

* `AGENTS.md`
  * 代理的操作说明以及它应该如何使用记忆。
  * 在每个会话开始时加载。
  * 是规则、优先级和"如何表现"细节的好地方。

* `SOUL.md`
  * 人设、语气和边界。
  * 每个会话都会加载。

* `USER.md`
  * 用户是谁以及如何称呼他们。
  * 每个会话都会加载。

* `IDENTITY.md`
  * 代理的名称、风格和表情。
  * 在引导仪式期间创建/更新。

* `TOOLS.md`
  * 关于本地工具和约定的笔记。
  * 不控制工具可用性；仅供参考。

* `HEARTBEAT.md`
  * 心跳运行的可选微小检查列表。
  * 保持简短以避免令牌消耗。

* `BOOT.md`
  * 网关重启时执行的可选启动检查列表（启用内部钩子时）。
  * 保持简短；使用消息工具进行出站发送。

* `BOOTSTRAP.md`
  * 一次性首次运行仪式。
  * 仅在为全新工作空间时创建。
  * 仪式完成后删除。

* `memory/YYYY-MM-DD.md`
  * 每日记忆日志（每天一个文件）。
  * 建议在会话开始时读取今天和昨天。

* `MEMORY.md`（可选）
  * 精选的长期记忆。
  * 仅在主、私有会话中加载（不在共享/群组上下文中）。

参见[记忆](/concepts/memory)了解工作流和自动记忆刷新。

* `skills/`（可选）
  * 工作空间特定的技能。
  * 名称冲突时覆盖托管/捆绑技能。

* `canvas/`（可选）
  * 节点显示的 Canvas UI 文件（例如 `canvas/index.html`）。

如果任何引导文件缺失，OpenClaw 会将"缺失文件"标记注入会话并继续。引导文件在注入时会截断；使用 `agents.defaults.bootstrapMaxChars`（默认：20000）和 `agents.defaults.bootstrapTotalMaxChars`（默认：150000）调整限制。
`openclaw setup` 可以在不覆盖现有文件的情况下重新创建缺失的默认值。

## 什么不在工作空间中

这些位于 `~/.openclaw/` 下，不应提交到工作空间仓库：

* `~/.openclaw/openclaw.json`（配置）
* `~/.openclaw/credentials/`（OAuth 令牌、API 密钥）
* `~/.openclaw/agents/<agentId>/sessions/`（会话记录 + 元数据）
* `~/.openclaw/skills/`（托管技能）

如果需要迁移会话或配置，请单独复制它们并保持不在版本控制中。

## Git 备份（推荐，私有）

将工作空间视为私有记忆。将其放在**私有**git 仓库中以便备份和可恢复。

在网关运行的机器上执行这些步骤（那里是工作空间所在）。

### 1) 初始化仓库

如果安装了 git，全新工作空间会自动初始化。如果此工作空间还不是仓库，请运行：

```bash
cd ~/.openclaw/workspace
git init
git add AGENTS.md SOUL.md TOOLS.md IDENTITY.md USER.md HEARTBEAT.md memory/
git commit -m "Add agent workspace"
```

### 2) 添加私有远程（适合初学者的选项）

选项 A：GitHub 网页界面

1. 在 GitHub 上创建一个新的**私有**仓库。
2. 不要用 README 初始化（避免合并冲突）。
3. 复制 HTTPS 远程 URL。
4. 添加远程并推送：

```bash
git branch -M main
git remote add origin <https-url>
git push -u origin main
```

选项 B：GitHub CLI（`gh`）

```bash
gh auth login
gh repo create openclaw-workspace --private --source . --remote origin --push
```

选项 C：GitLab 网页界面

1. 在 GitLab 上创建一个新的**私有**仓库。
2. 不要用 README 初始化（避免合并冲突）。
3. 复制 HTTPS 远程 URL。
4. 添加远程并推送：

```bash
git branch -M main
git remote add origin <https-url>
git push -u origin main
```

### 3) 持续更新

```bash
git status
git add .
git commit -m "Update memory"
git push
```

## 不要提交机密

即使在私有仓库中，也要避免在工作空间中存储机密：

* API 密钥、OAuth 令牌、密码或私人凭证。
* `~/.openclaw/` 下的任何内容。
* 聊天记录或敏感附件的原始转储。

如果必须存储敏感引用，请使用占位符并将真实机密保存在其他地方（密码管理器、环境变量或 `~/.openclaw/`）。

建议的 `.gitignore` 入门：

```gitignore
.DS_Store
.env
**/*.key
**/*.pem
**/secrets*
```

## 将工作空间移动到新机器

1. 将仓库克隆到所需路径（默认 `~/.openclaw/workspace`）。
2. 在 `~/.openclaw/openclaw.json` 中将 `agents.defaults.workspace` 设置为该路径。
3. 运行 `openclaw setup --workspace <path>` 以填充任何缺失的文件。
4. 如果需要会话，请单独从旧机器复制 `~/.openclaw/agents/<agentId>/sessions/`。

## 高级说明

* 多代理路由可以为每个代理使用不同的工作空间。参见[渠道路由](/channels/channel-routing)了解路由配置。
* 如果启用了 `agents.defaults.sandbox`，非主会话可以使用 `agents.defaults.sandbox.workspaceRoot`下的每会话沙盒工作空间。