---
名称: self-improvement
描述: "捕获学习、错误和纠正，以实现持续改进。使用时机：(1) 命令或操作意外失败，(2) 用户纠正代理（'不，那不对...'，'实际上...'），(3) 用户请求不存在的功能，(4) 外部 API 或工具失败，(5) 代理意识到其知识过时或不正确，(6) 发现更好的方法处理 recurring 任务。在执行重要任务前也要复习学习内容。"
元数据:
---

# 自我改进技能

将学习和错误记录到 markdown 文件中以实现持续改进。编码代理稍后可以将这些处理成修复，重要的学习内容会被提升到项目记忆中。

## 快速参考

| 情况 | 操作 |
|-----------|--------|
| 命令/操作失败 | 记录到 `.learnings/ERRORS.md` |
| 用户纠正你 | 记录到 `.learnings/LEARNINGS.md`，类别为 `correction` |
| 用户想要缺失功能 | 记录到 `.learnings/FEATURE_REQUESTS.md` |
| API/外部工具失败 | 记录到 `.learnings/ERRORS.md`，包含集成详情 |
| 知识过时 | 记录到 `.learnings/LEARNINGS.md`，类别为 `knowledge_gap` |
| 发现更好的方法 | 记录到 `.learnings/LEARNINGS.md`，类别为 `best_practice` |
| 简化/强化 recurring 模式 | 记录/更新 `.learnings/LEARNINGS.md`，来源为 `simplify-and-harness`，并使用稳定的 `Pattern-Key` |
| 与现有条目相似 | 使用 `**另见**` 链接，考虑提升优先级 |
| 广泛适用的学习 | 提升到 `CLAUDE.md`、`AGENTS.md` 和/或 `.github/copilot-instructions.md` |
| 工作流改进 | 提升到 `AGENTS.md`（OpenClaw 工作区） |
| 工具陷阱 | 提升到 `TOOLS.md`（OpenClaw 工作区） |
| 行为模式 | 提升到 `SOUL.md`（OpenClaw 工作区） |

## OpenClaw 设置（推荐）

OpenClaw 是此技能的主要平台。它使用基于工作区的提示注入和自动技能加载。

### 安装

**通过 ClawdHub（推荐）：**
```bash
clawdhub install self-improving-agent
```

**手动：**
```bash
git clone https://github.com/peterskoett/self-improving-agent.git ~/.openclaw/skills/self-improving-agent
```

从原始仓库为 openclaw 重新制作：https://github.com/pskoett/pskoett-ai-skills - https://github.com/pskoett/pskoett-ai-skills/tree/main/skills/self-improvement

### 工作区结构

OpenClaw 将这些文件注入到每个会话中：

```
~/.openclaw/workspace/
├── AGENTS.md          # 多代理工作流、委托模式
├── SOUL.md            # 行为准则、个性、原则
├── TOOLS.md           # 工具能力、集成陷阱
├── MEMORY.md          # 长期记忆（仅主会话）
├── memory/            # 每日记忆文件
│   └── YYYY-MM-DD.md
└── .learnings/        # 此技能的日志文件
    ├── LEARNINGS.md
    ├── ERRORS.md
    └── FEATURE_REQUESTS.md
```

### 创建学习文件

```bash
mkdir -p ~/.openclaw/workspace/.learnings
```

然后创建日志文件（或从 `assets/` 复制）：
- `LEARNINGS.md` — 纠正、知识差距、最佳实践
- `ERRORS.md` — 命令失败、异常
- `FEATURE_REQUESTS.md` — 用户请求的功能

### 提升目标

当学习被证明广泛适用时，将其提升到工作区文件：

| 学习类型 | 提升到 | 示例 |
|---------------|------------|---------|
| 行为模式 | `SOUL.md` | "简洁明了，避免免责声明" |
| 工作流改进 | `AGENTS.md` | "为长时间任务生成子代理" |
| 工具陷阱 | `TOOLS.md` | "Git push 需要先配置认证" |

### 会话间通信

OpenClaw 提供跨会话共享学习的工具：

- **sessions_list** — 查看活动/最近会话
- **sessions_history** — 读取另一个会话的记录  
- **sessions_send** — 向另一个会话发送学习
- **sessions_spawn** — 生成子代理进行后台工作

### 可选：启用钩子

在会话开始时自动提醒：

```bash
# 将钩子复制到 OpenClaw 钩子目录
cp -r hooks/openclaw ~/.openclaw/hooks/self-improvement

# 启用它
openclaw hooks enable self-improvement
```

完整详情请参阅 `references/openclaw-integration.md`。

---

## 通用设置（其他代理）

对于 Claude Code、Codex、Copilot 或其他代理，在项目中创建 `.learnings/`：

```bash
mkdir -p .learnings
```

从 `assets/` 复制模板或创建带标题的文件。

### 在代理文件 AGENTS.md、CLAUDE.md 或 .github/copilot-instructions.md 中添加引用，提醒自己记录学习内容。（这是基于钩子提醒的替代方案）

#### 自我改进工作流

发生错误或纠正时：
1. 记录到 `.learnings/ERRORS.md`、`LEARNINGS.md` 或 `FEATURE_REQUESTS.md`
2. 审查并提升广泛适用的学习到：
   - `CLAUDE.md` - 项目事实和约定
   - `AGENTS.md` - 工作流和自动化
   - `.github/copilot-instructions.md` - Copilot 上下文

## 日志格式

### 学习条目

追加到 `.learnings/LEARNINGS.md`：

```markdown
## [LRN-YYYYMMDD-XXX] 类别

**记录时间**: ISO-8601 时间戳
**优先级**: low | medium | high | critical
**状态**: pending
**领域**: frontend | backend | infra | tests | docs | config

### 摘要
所学内容的单行描述

### 详情
完整上下文：发生了什么、哪里错了、什么是正确的

### 建议操作
具体要做的修复或改进

### 元数据
- 来源: conversation | error | user_feedback
- 相关文件: path/to/file.ext
- 标签: tag1, tag2
- 另见: LRN-20250110-001（如果与现有条目相关）
- 模式键: simplify.dead_code | harden.input_validation（可选，用于 recurring 模式跟踪）
- 出现次数: 1（可选）
- 首次出现: 2025-01-15（可选）
- 最后出现: 2025-01-15（可选）

---
```

### 错误条目

追加到 `.learnings/ERRORS.md`：

```markdown
## [ERR-YYYYMMDD-XXX] skill_or_command_name

**记录时间**: ISO-8601 时间戳
**优先级**: high
**状态**: pending
**领域**: frontend | backend | infra | tests | docs | config

### 摘要
失败内容的简要描述

### 错误
```
实际错误消息或输出
```

### 上下文
- 尝试的命令/操作
- 使用的输入或参数
- 相关环境详情

### 建议修复
如果可以识别，可能解决此问题的方法

### 元数据
- 可重现: yes | no | unknown
- 相关文件: path/to/file.ext
- 另见: ERR-20250110-001（如果 recurring）

---
```

### 功能请求条目

追加到 `.learnings/FEATURE_REQUESTS.md`：

```markdown
## [FEAT-YYYYMMDD-XXX] capability_name

**记录时间**: ISO-8601 时间戳
**优先级**: medium
**状态**: pending
**领域**: frontend | backend | infra | tests | docs | config

### 请求的功能
用户想要做什么

### 用户上下文
为什么需要它，他们要解决什么问题

### 复杂度估计
simple | medium | complex

### 建议实现
如何构建，可能扩展什么

### 元数据
- 频率: first_time | recurring
- 相关功能: existing_feature_name

---
```

## ID 生成

格式：`TYPE-YYYYMMDD-XXX`
- TYPE：`LRN`（学习）、`ERR`（错误）、`FEAT`（功能）
- YYYYMMDD：当前日期
- XXX：顺序号或随机 3 个字符（例如 `001`、`A7B`）

示例：`LRN-20250115-001`、`ERR-20250115-A3F`、`FEAT-20250115-002`

## 解决条目

当问题被修复时，更新条目：

1. 将 `**状态**: pending` 改为 `**状态**: resolved`
2. 在元数据后添加解决块：

```markdown
### 解决
- **已解决**: 2025-01-16T09:00:00Z
- **提交/PR**: abc123 或 #42
- **备注**: 所做工作的简要描述
```

其他状态值：
- `in_progress` - 正在积极处理
- `wont_fix` - 决定不处理（在解决备注中添加原因）
- `promoted` - 已提升到 CLAUDE.md、AGENTS.md 或 .github/copilot-instructions.md

## 提升到项目记忆

当学习广泛适用时（不是一次性修复），将其提升到永久项目记忆。

### 何时提升

- 学习适用于多个文件/功能
- 任何贡献者（人类或 AI）都应该知道的知识
- 防止 recurring 错误
- 记录项目特定的约定

### 提升目标

| 目标 | 什么内容属于那里 |
|--------|-------------------|
| `CLAUDE.md` | 项目事实、约定、所有 Claude 交互的陷阱 |
| `AGENTS.md` | 代理特定的工作流、工具使用模式、自动化规则 |
| `.github/copilot-instructions.md` | GitHub Copilot 的项目上下文和约定 |
| `SOUL.md` | 行为准则、沟通风格、原则（OpenClaw 工作区） |
| `TOOLS.md` | 工具能力、使用模式、集成陷阱（OpenClaw 工作区） |

### 如何提升

1. **提炼**学习内容为简洁的规则或事实
2. **添加**到目标文件的适当部分（如需要则创建文件）
3. **更新**原始条目：
   - 将 `**状态**: pending` 改为 `**状态**: promoted`
   - 添加 `**已提升**: CLAUDE.md`、`AGENTS.md` 或 `.github/copilot-instructions.md`

### 提升示例

**学习**（详细）：
> 项目使用 pnpm 工作区。尝试 `npm install` 但失败了。
> 锁文件是 `pnpm-lock.yaml`。必须使用 `pnpm install`。

**在 CLAUDE.md 中**（简洁）：
```markdown
## 构建和依赖
- 包管理器：pnpm（不是 npm）- 使用 `pnpm install`
```

**学习**（详细）：
> 修改 API 端点时，必须重新生成 TypeScript 客户端。
> 忘记这一点会导致运行时类型不匹配。

**在 AGENTS.md 中**（可操作）：
```markdown
## API 更改后
1. 重新生成客户端：`pnpm run generate:api`
2. 检查类型错误：`pnpm tsc --noEmit`
```

## Recurring 模式检测

如果记录的内容与现有条目相似：

1. **首先搜索**：`grep -r "keyword" .learnings/`
2. **链接条目**：在元数据中添加 `**另见**: ERR-20250110-001`
3. **提升优先级**如果问题持续出现
4. **考虑系统性修复**：Recurring 问题通常表示：
   - 缺少文档（→ 提升到 CLAUDE.md 或 .github/copilot-instructions.md）
   - 缺少自动化（→ 添加到 AGENTS.md）
   - 架构问题（→ 创建技术债务工单）

## 简化与强化提要

使用此工作流从 `simplify-and-harden` 技能获取 recurring 模式，并将其转化为持久的提示指导。

### 摄入工作流

1. 从任务摘要中读取 `simplify_and_harden.learning_loop.candidates`。
2. 对于每个候选项，使用 `pattern_key` 作为稳定的去重键。
3. 在 `.learnings/LEARNINGS.md` 中搜索具有该键的现有条目：
   - `grep -n "Pattern-Key: <pattern_key>" .learnings/LEARNINGS.md`
4. 如果找到：
   - 增加 `Recurrence-Count`
   - 更新 `Last-Seen`
   - 添加 `另见` 链接到相关条目/任务
5. 如果未找到：
   - 创建新的 `LRN-...` 条目
   - 设置来源：`simplify-and-harden`
   - 设置 Pattern-Key、Recurrence-Count: 1 和 First-Seen/Last-Seen

### 提升规则（系统提示反馈）

在满足以下所有条件时，将 recurring 模式提升到代理上下文/系统提示文件：

- `Recurrence-Count >= 3`
- 至少在 2 个不同任务中出现过
- 在 30 天内发生过

提升目标：
- `CLAUDE.md`
- `AGENTS.md`
- `.github/copilot-instructions.md`
- `SOUL.md` / `TOOLS.md`（适用于 OpenClaw 工作区级指导）

将提升的规则写为简短的预防规则（编码前/编码时做什么），而不是冗长的事件报告。

## 定期审查

在自然断点审查 `.learnings/`：

### 何时审查
- 开始新的大型任务之前
- 完成功能之后
- 在有过去学习的领域工作时
- 活跃开发期间每周

### 快速状态检查
```bash
# 统计待处理项目数
grep -h "状态\*\*: pending" .learnings/*.md | wc -l

# 列出待处理的高优先级项目
grep -B5 "优先级\*\*: high" .learnings/*.md | grep "^## \["

# 查找特定领域的学习
grep -l "领域\*\*: backend" .learnings/*.md
```

### 审查操作
- 解决已修复的项目
- 提升适用的学习
- 链接相关条目
- 升级 recurring 问题

## 检测触发器

自动记录您注意到的内容：

**纠正**（→ 类别为 `correction` 的学习）：
- "不，那不对..."
- "实际上，应该是..."
- "你错了..."
- "那过时了..."

**功能请求**（→ 功能请求）：
- "你也可以..."
- "希望你能够..."
- "有办法...吗？"
- "为什么你不能..."

**知识差距**（→ 类别为 `knowledge_gap` 的学习）：
- 用户提供您不知道的信息
- 您引用的文档已过时
- API 行为与您的理解不同

**错误**（→ 错误条目）：
- 命令返回非零退出代码
- 异常或堆栈跟踪
- 意外输出或行为
- 超时或连接失败

## 优先级指南

| 优先级 | 使用时机 |
|----------|-------------|
| `critical` | 阻塞核心功能、数据丢失风险、安全问题 |
| `high` | 重大影响、影响常见工作流、recurring 问题 |
| `medium` | 中等影响、存在解决方法 |
| `low` | 小不便、边缘情况、锦上添花 |

## 领域标签

用于按代码库区域过滤学习：

| 领域 | 范围 |
|------|-------|
| `frontend` | UI、组件、客户端代码 |
| `backend` | API、服务、服务器端代码 |
| `infra` | CI/CD、部署、Docker、云 |
| `tests` | 测试文件、测试工具、覆盖率 |
| `docs` | 文档、注释、README |
| `config` | 配置文件、环境、设置 |

## 最佳实践

1. **立即记录** - 问题发生后上下文最新鲜
2. **具体明确** - 未来代理需要快速理解
3. **包含复现步骤** - 特别是对于错误
4. **链接相关文件** - 使修复更容易
5. **建议具体修复** - 不要只是"调查"
6. **使用一致的类别** - 启用过滤
7. **积极提升** - 如果有疑问，添加到 CLAUDE.md 或 .github/copilot-instructions.md
8. **定期审查** - 过时的学习会失去价值

## Gitignore 选项

**保持学习本地化**（每个开发者）：
```gitignore
.learnings/
```

**在仓库中跟踪学习**（团队范围）：
不要添加到 .gitignore - 学习成为共享知识。

**混合**（跟踪模板，忽略条目）：
```gitignore
.learnings/*.md
!.learnings/.gitkeep
```

## 钩子集成

通过代理钩子启用自动提醒。这是**可选的** - 您必须明确配置钩子。

### 快速设置（Claude Code / Codex）

在项目中创建 `.claude/settings.json`：

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "./skills/self-improvement/scripts/activator.sh"
      }]
    }]
  }
}
```

这在每个提示后注入学习评估提醒（约 50-100 tokens 开销）。

### 完整设置（带错误检测）

```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "./skills/self-improvement/scripts/activator.sh"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "./skills/self-improvement/scripts/error-detector.sh"
      }]
    }]
  }
}
```

### 可用钩子脚本

| 脚本 | 钩子类型 | 目的 |
|--------|-----------|--------|
| `scripts/activator.sh` | UserPromptSubmit | 提醒在任务后评估学习 |
| `scripts/error-detector.sh` | PostToolUse (Bash) | 在命令错误时触发 |

详细配置和故障排除请参阅 `references/hooks-setup.md`。

## 自动技能提取

当学习足够有价值成为可重用技能时，使用提供的辅助工具提取。

### 技能提取标准

当学习符合以下任一条件时，有资格提取为技能：

| 标准 | 描述 |
|-----------|-------------|
| **Recurring** | 有 2+ 个类似问题的 `另见` 链接 |
| **Verified** | 状态为 `resolved`，有有效的修复 |
| **Non-obvious** | 需要实际调试/调查才能发现 |
| **Broadly applicable** | 不是项目特定的；跨代码库有用 |
| **User-flagged** | 用户说"保存为技能"或类似的话 |

### 提取工作流

1. **识别候选项**：学习符合提取条件
2. **运行辅助工具**（或手动创建）：
   ```bash
   ./skills/self-improvement/scripts/extract-skill.sh skill-name --dry-run
   ./skills/self-improvement/scripts/extract-skill.sh skill-name
   ```
3. **自定义 SKILL.md**：用学习内容填充模板
4. **更新学习**：将状态设为 `promoted_to_skill`，添加 `Skill-Path`
5. **验证**：在新会话中读取技能，确保它是独立的

### 手动提取

如果您更喜欢手动创建：

1. 创建 `skills/<skill-name>/SKILL.md`
2. 使用 `assets/SKILL-TEMPLATE.md` 中的模板
3. 遵循 [代理技能规范](https://agentskills.io/specification)：
   - YAML 前言部分包含 `name` 和 `description`
   - 名称必须与文件夹名称匹配
   - 技能文件夹内不要有 README.md

### 提取检测触发器

注意这些信号，表明学习应该成为技能：

**在对话中：**
- "保存为技能"
- "我经常遇到这个"
- "这对其他项目很有用"
- "记住这个模式"

**在学习条目中：**
- 多个 `另见` 链接（recurring 问题）
- 高优先级 + 已解决状态
- 类别：`best_practice`，广泛适用
- 用户反馈赞扬解决方案

### 技能质量门

提取前验证：

- [ ] 解决方案经过测试且有效
- [ ] 描述清晰，无需原始上下文
- [ ] 代码示例是独立的
- [ ] 没有项目特定的硬编码值
- [ ] 遵循技能命名约定（小写、连字符）

## 多代理支持

此技能可跨不同 AI 编码代理工作，具有代理特定的激活方式。

### Claude Code

**激活**：钩子（UserPromptSubmit、PostToolUse）
**设置**：`.claude/settings.json` 中的钩子配置
**检测**：通过钩子脚本自动进行

### Codex CLI

**激活**：钩子（与 Claude Code 相同模式）
**设置**：`.codex/settings.json` 中的钩子配置
**检测**：通过钩子脚本自动进行

### GitHub Copilot

**激活**：手动（无钩子支持）
**设置**：添加到 `.github/copilot-instructions.md`：

```markdown
## 自我改进

解决非显而易见的问题后，考虑记录到 `.learnings/`：
1. 使用自我改进技能格式
2. 使用另见链接相关条目
3. 将高价值学习提升为技能

在聊天中询问："我应该把这个记录为学习吗？"
```

**检测**：会话结束时的手动审查

### OpenClaw

**激活**：工作区注入 + 代理间消息
**设置**：请参阅上面的"OpenClaw 设置"部分
**检测**：通过会话工具和工作区文件

### 代理无关指导

无论代理如何，在以下情况下应用自我改进：

1. **发现非显而易见的内容** - 解决方案不是立即的
2. **纠正自己** - 初始方法错误
3. **学习项目约定** - 发现未记录的模式
4. **遇到意外错误** - 特别是诊断困难时
5. **找到更好的方法** - 改进了原始解决方案

### Copilot Chat 集成

对于 Copilot 用户，在相关提示中添加：

> 完成此任务后，评估是否有任何学习应该使用自我改进技能格式记录到 `.learnings/`。

或使用快速提示：
- "记录到学习"
- "从此解决方案创建技能"
- "检查 .learnings/ 中的相关问题"