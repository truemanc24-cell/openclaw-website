# OpenClaw 核心概念解析：深入理解 Agent 架构

> **摘要**：本教程深入讲解 OpenClaw 的核心架构设计，包括 Agent 系统、会话模式、记忆系统和技能系统。理解这些概念后，你将能够更高效地配置和使用 OpenClaw，构建强大的 AI 工作流。
>
> **学习目标**：
> - 理解 Agent 架构和工作原理
> - 掌握会话模式的使用场景
> - 配置和管理记忆系统
> - 开发和扩展技能系统

---

## 一、Agent 架构

### 什么是 Agent？

Agent 是 OpenClaw 中的**智能体单元**，每个 Agent 都有独立的身份、记忆、技能和配置。你可以把 Agent 理解为具有不同专长的 AI 助手。

### 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Main      │  │    Dev      │  │   Social    │     │
│  │   Agent     │  │   Agent     │  │   Agent     │     │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤     │
│  │ • 通用任务  │  │ • 代码开发  │  │ • 社媒运营  │     │
│  │ • 任务分发  │  │ • 技能开发  │  │ • 内容创作  │     │
│  │ • 协调管理  │  │ • Bug 修复   │  │ • 粉丝互动  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Learning   │  │   Sales     │  │   Cece      │     │
│  │   Agent     │  │   Agent     │  │   Agent     │     │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤     │
│  │ • 学习助手  │  │ • 销售支持  │  │ • 增长策略  │     │
│  │ • 知识管理  │  │ • 客户跟进  │  │ • 数据分析  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│              Channels (飞书/微信/Telegram)               │
└─────────────────────────────────────────────────────────┘
```

### Agent 类型

| Agent | 职责 | 适用场景 |
|-------|------|---------|
| **Main** | 通用助手、任务分发 | 日常对话、复杂任务协调 |
| **Dev** | 代码开发、技能开发 | 编程、Debug、技能创作 |
| **Social** | 社交媒体运营 | 微博、Twitter、内容发布 |
| **Learning** | 学习助手、知识管理 | 学习笔记、资料整理 |
| **Sales** | 销售支持、客户跟进 | CRM、客户沟通 |
| **Cece** | 增长策略、数据分析 | 用户增长、运营分析 |

### Agent 配置文件

每个 Agent 都有独立的配置文件：

```
~/.openclaw/agents/main/agent/
├── SOUL.md           # 人格和行为规范
├── IDENTITY.md       # 身份定义
├── USER.md           # 用户信息
├── AGENTS.md         # 工作区规范
├── TOOLS.md          # 工具和本地配置
├── MEMORY.md         # 长期记忆
└── memory/           # 每日记忆日志
```

**SOUL.md 示例**：
```markdown
# SOUL.md — Who You Are

## Core Truths
Be genuinely helpful.
Skip filler phrases. Focus on real solutions.

## Boundaries
Private data stays private.
Ask before external actions.

## Vibe
Concise when possible.
Thorough when needed.
Not robotic. Not flattering.
Just competent.
```

### 任务分发机制

Main Agent 可以将任务分发给专业 Agent：

```bash
# 用户命令
@main 让 dev agent 帮我开发一个天气查询技能

# Main Agent 处理流程
1. 理解需求 → 识别需要 Dev Agent
2. 使用 sessions_spawn 分配任务
3. 追踪任务进度
4. 汇总结果 → 向用户汇报
```

**配置文件**：
```json
{
  "agents": {
    "main": {
      "enabled": true,
      "model": "qwen3.5-plus",
      "canDelegate": true,
      "subAgents": ["dev", "social", "learning"]
    },
    "dev": {
      "enabled": true,
      "model": "qwen3.5-plus",
      "specialties": ["coding", "debugging", "skill-development"]
    }
  }
}
```

---

## 二、会话模式

### 什么是会话？

会话（Session）是 OpenClaw 中**一次完整对话的上下文单元**。每次对话都有独立的会话 ID，包含完整的消息历史和状态。

### 会话类型

| 类型 | 说明 | 使用场景 |
|------|------|---------|
| **WebChat** | 浏览器控制 UI | 快速测试、个人使用 |
| **Channel** | 聊天渠道（飞书等） | 团队协作者、多人群聊 |
| **Subagent** | 子代理会话 | 任务分发、专业处理 |
| **Cron** | 定时任务会话 | 定时检查、周期性任务 |

### 会话生命周期

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  创建    │ ──→ │  活跃    │ ──→ │  空闲    │ ──→ │  清理    │
│  Session │     │  Active  │     │  Idle    │     │  Cleanup │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │                │                │                │
  用户发起         消息交互        超时 (30min)      释放资源
  新对话           上下文更新       无活动           清理内存
```

### 会话管理命令

```bash
# 查看当前会话
openclaw session list

# 查看会话详情
openclaw session info <session-id>

# 导出会话历史
openclaw session export <session-id> --format json

# 清理过期会话
openclaw session cleanup --older-than 7d
```

### 上下文管理

**上下文长度限制**：
- 默认：4000 tokens
- 可配置：1000-32000 tokens

**配置方法**：
```json
{
  "session": {
    "maxContextLength": 8000,
    "summaryThreshold": 6000,
    "autoSummary": true
  }
}
```

**当上下文接近限制时**：
1. 自动总结早期对话
2. 保留最新消息
3. 维护核心信息

---

## 三、记忆系统

### 记忆分层结构

OpenClaw 采用**分层记忆系统**，模拟人类的短期和长期记忆：

```
┌─────────────────────────────────────────────────────┐
│                  MEMORY.md                          │
│              (长期记忆 - 所有 Agent 共享)              │
│  • 架构原则                                         │
│  • 项目信息                                         │
│  • 配置信息                                         │
│  • 核心运营逻辑                                     │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│            memory/YYYY-MM-DD.md                     │
│              (短期记忆 - 每日日志)                    │
│  • 当日对话记录                                     │
│  • 临时上下文                                       │
│  • 待办事项                                         │
└─────────────────────────────────────────────────────┘
```

### 记忆文件位置

```
~/.openclaw/agents/main/agent/
├── MEMORY.md              # 长期记忆（手动维护）
└── memory/
    ├── 2026-03-28.md      # 今日记忆
    ├── 2026-03-27.md      # 昨日记忆
    └── heartbeat-state.json  # 心跳状态
```

### 记忆写入规则

| 信息类型 | 写入位置 | 示例 |
|---------|---------|------|
| 架构变更 | main MEMORY.md | Agent 架构调整 |
| 新项目启动 | main + agent MEMORY.md | 网站建设 2 天冲刺 |
| 个体任务 | 对应 agent MEMORY.md | dev 的教程开发任务 |
| 配置修改 | main + 对应 agent MEMORY.md | 模型配置变更 |

**决策检查点**：
> 在写入记忆前问自己：**"这个信息其他 Agent 需要知道吗？"**
> - 是 → 写入 main MEMORY.md
> - 否 → 写入对应 agent MEMORY.md

### 记忆管理命令

```bash
# 查看今日记忆
cat ~/.openclaw/agents/main/agent/memory/$(date +%Y-%m-%d).md

# 查看长期记忆
cat ~/.openclaw/agents/main/agent/MEMORY.md

# 搜索记忆内容
grep -r "项目名称" ~/.openclaw/agents/*/agent/memory/

# 清理过期记忆（保留最近 7 天）
find ~/.openclaw/agents/*/agent/memory/ -name "*.md" -mtime +7 -delete
```

### 心跳记忆维护

定期（每 2-4 小时）进行心跳检查，同时维护记忆：

```markdown
## 心跳检查清单 (HEARTBEAT.md)

- [ ] 检查未读邮件
- [ ] 查看日历事件（24-48h 内）
- [ ] 检查社交媒体提及
- [ ] 查看天气（如需外出）
- [ ] 更新 MEMORY.md（如有重要事件）
```

**心跳状态跟踪**：
```json
{
  "lastChecks": {
    "email": 1711699200,
    "calendar": 1711684800,
    "weather": 1711700000
  }
}
```

---

## 四、技能系统

### 什么是技能？

技能（Skill）是 OpenClaw 的**可扩展能力模块**，每个技能提供特定功能，如：
- 飞书文档操作
- GitHub Issue 管理
- 天气查询
- 图片分析
- 视频处理

### 技能架构

```
~/.openclaw/skills/
├── feishu-doc/
│   ├── SKILL.md          # 技能描述和触发规则
│   ├── skill.js          # 技能实现
│   └── README.md         # 使用说明
├── github/
│   ├── SKILL.md
│   ├── skill.js
│   └── scripts/
│       └── gh-issues.sh  # 辅助脚本
└── weather/
    ├── SKILL.md
    └── skill.js
```

### SKILL.md 结构

```markdown
# Skill: weather

## Description
Get current weather and forecasts via wttr.in or Open-Meteo.

## Triggers
Activate when:
- User asks about weather, temperature, or forecasts
- User mentions location + weather keywords

## NOT for:
- Historical weather data
- Severe weather alerts
- Detailed meteorological analysis

## Usage
```bash
curl wttr.in/Beijing
```

## Examples
User: "北京今天天气怎么样？"
→ Activate weather skill
→ Return: 北京今天晴，25°C...
```

### 技能调用流程

```
用户请求
   ↓
意图识别（匹配技能触发条件）
   ↓
加载技能（读取 SKILL.md）
   ↓
执行技能（运行 skill.js 或脚本）
   ↓
返回结果 → 格式化回复
```

### 常用技能列表

| 技能 | 功能 | 触发词 |
|------|------|-------|
| **feishu-doc** | 飞书文档读写 | "飞书文档"、"docx" |
| **feishu-wiki** | 知识库管理 | "知识库"、"wiki" |
| **github** | GitHub 操作 | "GitHub"、"issue"、"PR" |
| **weather** | 天气查询 | "天气"、"气温"、"预报" |
| **image** | 图片分析 | "分析这张图"、"图片里有什么" |
| **web_search** | 网络搜索 | "搜索"、"查一下"、"找找" |
| **summarize** | 内容总结 | "总结"、"摘要"、"提炼" |

### 技能开发

**创建新技能**：
```bash
# 使用技能创作助手
openclaw skill create my-skill

# 或使用模板
mkdir -p ~/.openclaw/skills/my-skill
cp ~/.openclaw/skills/template/* ~/.openclaw/skills/my-skill/
```

**技能开发流程**：
1. 创建技能目录
2. 编写 SKILL.md（定义触发规则）
3. 实现 skill.js（功能逻辑）
4. 测试技能触发
5. 提交到 ClawHub（可选）

**技能测试**：
```bash
# 测试技能触发
openclaw skill test my-skill --input "测试输入"

# 查看技能日志
openclaw logs skill my-skill
```

### 技能市场（ClawHub）

```bash
# 搜索技能
clawhub search weather

# 安装技能
clawhub install weather

# 更新技能
clawhub update weather

# 列出已安装技能
clawhub list

# 发布技能
clawhub publish ~/.openclaw/skills/my-skill
```

---

## 五、实战配置示例

### 示例 1：配置多 Agent 协作

```json
{
  "agents": {
    "main": {
      "enabled": true,
      "model": "qwen3.5-plus",
      "canDelegate": true,
      "delegationRules": {
        "coding": "dev",
        "social": "social",
        "learning": "learning"
      }
    },
    "dev": {
      "enabled": true,
      "model": "qwen3.5-plus",
      "workspace": "~/.openclaw/agents/dev/agent/",
      "skills": ["github", "skill-creator"]
    },
    "social": {
      "enabled": true,
      "model": "qwen3.5-plus",
      "workspace": "~/.openclaw/agents/social/agent/",
      "skills": ["xurl", "wacli"]
    }
  }
}
```

### 示例 2：配置记忆同步

```json
{
  "memory": {
    "syncEnabled": true,
    "syncInterval": "24h",
    "sharedMemoryPath": "~/.openclaw/agents/main/agent/MEMORY.md",
    "agentMemoryPaths": [
      "~/.openclaw/agents/dev/agent/MEMORY.md",
      "~/.openclaw/agents/social/agent/MEMORY.md"
    ]
  }
}
```

### 示例 3：配置技能权限

```json
{
  "skills": {
    "github": {
      "enabled": true,
      "requireApproval": ["push", "delete"],
      "rateLimit": {
        "windowMs": 60000,
        "maxRequests": 10
      }
    },
    "message": {
      "enabled": true,
      "allowedChannels": ["feishu", "telegram"],
      "blockedChannels": ["discord"]
    }
  }
}
```

---

## 六、调试与优化

### 日志级别

```bash
# 设置日志级别
openclaw config set logging.level debug

# 查看特定组件日志
openclaw logs agent main --level debug
openclaw logs skill github --level info
openclaw logs channel feishu --level warn
```

### 性能监控

```bash
# 查看资源使用
openclaw status --verbose

# 查看会话性能
openclaw session stats

# 查看技能调用统计
openclaw skills stats
```

### 常见问题排查

| 问题 | 排查命令 | 解决方案 |
|------|---------|---------|
| Agent 无响应 | `openclaw agent status` | 重启 Agent |
| 记忆丢失 | `ls ~/.openclaw/agents/*/agent/memory/` | 检查文件权限 |
| 技能不触发 | `openclaw skill test <name>` | 检查 SKILL.md |
| 会话超时 | `openclaw session list` | 调整超时配置 |

---

## 七、最佳实践

### Agent 配置建议

| 建议 | 说明 |
|------|------|
| 🎯 明确分工 | 每个 Agent 专注特定领域 |
| 📝 文档化 | 更新 SOUL.md 和 MEMORY.md |
| 🔄 定期同步 | 每周检查记忆同步 |
| 🔒 权限隔离 | 敏感操作需要审批 |

### 记忆管理建议

| 建议 | 说明 |
|------|------|
| 📅 每日清理 | 保留最近 7 天记忆 |
| 🧠 定期总结 | 每月整理长期记忆 |
| 🔍 标签化 | 使用标签分类记忆 |
| 📊 量化追踪 | 记录心跳检查状态 |

### 技能开发建议

| 建议 | 说明 |
|------|------|
| 📦 模块化 | 每个技能单一职责 |
| 🧪 充分测试 | 编写测试用例 |
| 📖 完善文档 | SKILL.md 清晰描述 |
| 🔄 版本管理 | 使用 ClawHub 发布 |

---

## 八、下一步

掌握核心概念后，可以：

1. 🛠 **开发自定义技能**：参考技能开发指南
2. 🤖 **配置专业 Agent**：创建领域专家 Agent
3. 📊 **搭建监控系统**：跟踪 Agent 性能
4. 🔄 **实现自动化**：配置定时任务和心跳

---

## 快速参考卡

```bash
# Agent 管理
openclaw agent list              # 列出所有 Agent
openclaw agent status <name>     # 查看 Agent 状态
openclaw agent restart <name>    # 重启 Agent

# 会话管理
openclaw session list            # 列出会话
openclaw session export <id>     # 导出会话

# 记忆管理
cat ~/.openclaw/agents/*/agent/MEMORY.md
cat ~/.openclaw/agents/*/agent/memory/$(date +%Y-%m-%d).md

# 技能管理
openclaw skills list             # 列出技能
openclaw skill test <name>       # 测试技能
clawhub install <name>           # 安装技能
```

---

**教程完成时间**：约 30-40 分钟
**难度等级**：⭐⭐⭐ 高级
**前置知识**：完成教程 1 和教程 2

> 💡 **提示**：理解核心概念后，阅读 `~/.openclaw/agents/main/agent/` 下的配置文件，结合实际配置加深理解。
