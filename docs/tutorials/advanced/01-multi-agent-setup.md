---
title: 01 multi agent setup
description: 01 multi agent setup 页面
---
  - 多 Agent 配置
  - Agent 协作
  - OpenClaw 教程
  - AI 助手配置
  - 任务分配
  - Agent 路由
lastUpdated: 2026-03-24
contributors:
  - Trueman
---

# 多 Agent 配置实战：一人掌控多个 AI 助手

> 📅 更新时间：2026-03-22  
> ⏰ 阅读时长：15 分钟  
> 💡 难度：进阶

---

## 写在前面

你是否曾经想过：能不能让一个 AI 负责Coding，另一个 AI 负责处理日常事务，还有一个 AI 专门帮你搜索信息？

在 OpenClaw 中，这完全可以实现！**多 Agent 路由**功能让你在一台服务器上运行多个完全隔离的 AI 代理，每个代理有自己的个性、工作目录和对话历史。

本文将手把手教你如何配置多 Agent，从需求分析到完整配置，让你的效率翻倍！

---

## 一、为什么需要多 Agent？

### 1.1 单 Agent 的局限性

当你只有一个 Agent 时，它需要同时处理各种任务：

- 📝 写代码
- 📊 分析数据
- 💬 聊天解闷
- 🔍 搜索信息

这就像让一个员工同时做所有事情——结果是什么都做不好。

### 1.2 多 Agent 的优势

| 优势 | 说明 |
|------|------|
| **专业分工** | 每个 Agent 只专注一类任务 |
| **数据隔离** | 不同 Agent 的对话历史完全独立 |
| **个性定制** | 每个 Agent 可以有不同的性格设定 |
| **资源优化** | 可以为不同 Agent 分配不同的模型 |

### 1.3 典型使用场景

**场景一：工作与生活分开**
- `work` Agent：专业 Coding 助手，负责技术任务
- `life` Agent：生活助手，帮你安排日程、查找餐厅

**场景二：不同技能组合**
- `coder` Agent：擅长代码审查和重构
- `writer` Agent：擅长文案创作和内容策划
- `searcher` Agent：专门负责信息搜索和整理

**场景三：多用户共享**
- 一台服务器供多个团队成员使用，每人一个独立的 Agent

---

## 二、角色规划：设计你的 Agent 团队

在开始配置之前，需要先规划好每个 Agent 的角色和职责。

### 2.1 规划步骤

```
1. 列出你所有需求
      ↓
2. 按类型分组
      ↓
3. 为每组起个名字
      ↓
4. 确定每个 Agent 的配置文件
```

### 2.2 规划示例

假设你需要：
- 一个 Coding 助手（主要写代码）
- 一个写作助手（主要写文案）
- 一个搜索助手（专门搜索信息）

规划如下：

| Agent ID | 角色 | 主要功能 | 配置文件 |
|----------|------|----------|----------|
| `coder` | 首席工程师 | 代码编写、审查、重构 | `workspace-coder` |
| `writer` | 文案策划 | 文章创作、翻译、润色 | `workspace-writer` |
| `searcher` | 信息官 | 搜索、整理、汇总 | `workspace-searcher` |

### 2.3 配置文件说明

每个 Agent 需要以下配置文件（放在各自的工作目录下）：

```
~/.openclaw/workspace-coder/
├── AGENTS.md      # Agent 能力描述
├── SOUL.md        # Agent 性格设定
├── USER.md        # 用户偏好（可选）
└── skills/        # 技能文件夹（可选）
```

**AGENTS.md 示例：**
```markdown
# AGENTS.md - 首席工程师

## 模型配置
- 默认模型：claude-sonnet-4
- 擅长：代码重构、性能优化、技术架构

## 工作原则
1. 代码优先可读性
2. 注重最佳实践
3. 提供完整解决方案
```

**SOUL.md 示例：**
```markdown
# SOUL.md - 首席工程师的人设

你是 **CodeMaster**，一位经验丰富的软件架构师。

## 核心特质
- 🎯 专业严谨：对代码质量有高要求
- 📚 乐于分享：愿意解释技术原理
- ⚡ 高效执行：给出可直接使用的代码

## 沟通风格
- 技术术语使用准确
- 代码示例完整可运行
- 必要时提供多种方案供选择
```

---

## 三、配置步骤详解

### 3.1 第一步：创建 Agent 工作空间

使用 OpenClaw 自带的向导创建：

```bash
# 创建 Coding Agent
openclaw agents add coder

# 创建 Writer Agent  
openclaw agents add writer

# 创建 Searcher Agent
openclaw agents add searcher
```

执行后，OpenClaw 会：
1. 在 `~/.openclaw/agents/<agentId>/agent/` 创建配置目录
2. 在 `~/.openclaw/workspace-<agentId>/` 创建工作目录
3. 自动生成基础的 `AGENTS.md` 和 `SOUL.md`

### 3.2 第二步：创建渠道账号

每个 Agent 需要独立的渠道账号来接收消息。

**WhatsApp 示例：**
```bash
# 为 coder Agent 创建 WhatsApp 账号
openclaw channels login --channel whatsapp --account coder

# 为 writer Agent 创建 WhatsApp 账号
openclaw channels login --channel whatsapp --account writer

# 为 searcher Agent 创建 WhatsApp 账号
openclaw channels login --channel whatsapp --account searcher
```

**Telegram 示例：**
```bash
# 分别为每个 Agent 创建 Bot
# 1. 找 @BotFather 创建新 Bot
# 2. 获取 Token
# 3. 配置到 OpenClaw
openclaw channels login --channel telegram --account coder --token "xxx"
```

### 3.3 第三步：配置路由规则

编辑 `~/.openclaw/openclaw.json`：

```json5
{
  // Agent 列表
  agents: {
    list: [
      { 
        id: "coder", 
        workspace: "~/.openclaw/workspace-coder",
        default: true
      },
      { 
        id: "writer", 
        workspace: "~/.openclaw/workspace-writer" 
      },
      { 
        id: "searcher", 
        workspace: "~/.openclaw/workspace-searcher" 
      }
    ]
  },

  // 渠道配置
  channels: {
    whatsapp: {
      enabled: true,
      accounts: {
        coder: { phone: "+15551230001" },
        writer: { phone: "+15551230002" },
        searcher: { phone: "+15551230003" }
      }
    }
  },

  // 路由绑定
  bindings: [
    {
      // coder 处理来自 +15551230001 的消息
      agentId: "coder",
      match: { 
        channel: "whatsapp", 
        accountId: "coder",
        peer: { kind: "direct", id: "+15551230001" }
      }
    },
    {
      // writer 处理来自 +15551230002 的消息
      agentId: "writer",
      match: { 
        channel: "whatsapp", 
        accountId: "writer",
        peer: { kind: "direct", id: "+15551230002" }
      }
    },
    {
      // searcher 处理来自 +15551230003 的消息
      agentId: "searcher",
      match: { 
        channel: "whatsapp", 
        accountId: "searcher",
        peer: { kind: "direct", id: "+15551230003" }
      }
    }
  ]
}
```

### 3.4 第四步：重启 Gateway

```bash
# 重启 Gateway
openclaw gateway restart

# 查看 Agent 状态
openclaw agents list --bindings

# 查看渠道状态
openclaw channels status --probe
```

---

## 四、Agent 间通信示例

### 4.1 场景：搜索+写作工作流

用户发给 Writer 一篇文章写作需求，Writer 可以调用 Searcher 来获取相关资料。

**配置方式：**

在 Writer 的 `AGENTS.md` 中添加能力描述：
```markdown
## 可调用其他 Agent
- searcher: 进行信息搜索和整理
```

**调用方式：**
```
User: 帮我写一篇关于 AI Agent 的科普文章

Writer: 我先让 searcher 帮你搜索一些最新资料...
→ 调用 searcher 获取 AI Agent 相关资讯
→ 基于资料撰写文章
```

### 4.2 消息路由规则详解

OpenClaw 的路由规则是**确定性**的，匹配顺序如下：

1. `peer` 匹配（精确 DM/群组/频道 ID）
2. `parentPeer` 匹配（线程继承）
3. `guildId + roles`（Discord 角色路由）
4. `guildId`（Discord 服务器）
5. `teamId`（Slack 工作区）
6. `accountId` 匹配
7. 渠道级匹配
8. 回退到默认 Agent

**优先级示例：**
```json5
{
  bindings: [
    // 精确匹配最高优先级
    {
      agentId: "coder",
      match: { 
        channel: "whatsapp", 
        peer: { kind: "direct", id: "+15551230001" }
      }
    },
    // 账号匹配次之
    {
      agentId: "writer",
      match: { 
        channel: "whatsapp", 
        accountId: "writer"
      }
    },
    // 渠道级匹配最低
    {
      agentId: "searcher",
      match: { channel: "whatsapp" }
    }
  ]
}
```

---

## 五、实际应用场景

### 场景一：技术团队多人协作

**需求**：一个 3 人技术团队共享一台 OpenClaw 服务器

**配置**：
- `alex` Agent → 分配给 Alex（后端开发）
- `mia` Agent → 分配给 Mia（前端开发）
- `sam` Agent → 分配给 Sam（DevOps）

**路由规则**：
```json5
{
  bindings: [
    {
      agentId: "alex",
      match: { 
        channel: "telegram", 
        peer: { kind: "direct", id: "123456789" }
      }
    },
    {
      agentId: "mia", 
      match: { 
        channel: "telegram", 
        peer: { kind: "direct", id: "987654321" }
      }
    },
    {
      agentId: "sam",
      match: { 
        channel: "telegram", 
        peer: { kind: "direct", id: "456789123" }
      }
    }
  ]
}
```

**效果**：
- 每个人给 Bot 发消息，都只会看到与自己 Agent 的对话
- 对话历史完全隔离，互不干扰

### 场景二：企业客服分流

**需求**：企业有三个部门，需要将用户问题分流到对应部门

**配置**：
- `sales` Agent → 销售咨询
- `support` Agent → 技术支持
- `hr` Agent → 人力资源

**路由规则**（基于关键词）：
```json5
{
  bindings: [
    {
      agentId: "sales",
      match: { channel: "feishu" }
      // 可结合关键词路由插件
    }
  ]
}
```

### 场景三：一个 WhatsApp 号码，多个人

**需求**：一个公司客服用一个 WhatsApp 号码，但有多个人使用

**配置**：
```json5
{
  agents: {
    list: [
      { id: "alex", workspace: "~/.openclaw/workspace-alex" },
      { id: "mia", workspace: "~/.openclaw/workspace-mia" },
    ],
  },
  bindings: [
    {
      agentId: "alex",
      match: { 
        channel: "whatsapp", 
        peer: { kind: "direct", id: "+15551230001" }
      }
    },
    {
      agentId: "mia",
      match: { 
        channel: "whatsapp", 
        peer: { kind: "direct", id: "+15551230002" }
      }
    },
  ],
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551230001", "+15551230002"],
    },
  }
}
```

**注意**：DM 访问控制是**全局按 WhatsApp 账号**配置的（配对/白名单），不是按 Agent 配置。

---

## 六、故障排查

### 问题 1：消息没有路由到正确的 Agent

**检查步骤**：
```bash
# 1. 查看绑定状态
openclaw agents list --bindings

# 2. 查看消息日志
openclaw logs --follow

# 3. 测试路由规则
openclaw channels status --probe
```

**常见原因**：
- `accountId` 没有匹配
- `peer.id` 格式不对（需要 E.164 格式）
- 绑定规则顺序问题

### 问题 2：Agent 之间数据串了

**原因**：共享了相同的 `agentDir`

**解决方案**：
- 每个 Agent 使用独立的工作空间
- 不要复用 `~/.openclaw/agents/<agentId>/agent/`

### 问题 3：某个 Agent 无法登录渠道

**检查步骤**：
```bash
# 查看具体渠道状态
openclaw channels status --channel whatsapp

# 查看错误日志
openclaw logs | grep -i error
```

---

## 七、进阶技巧

### 7.1 为不同 Agent 分配不同模型

```json5
{
  agents: {
    list: [
      { 
        id: "coder", 
        model: "claude-sonnet-4"  // 使用 Sonnet 4
      },
      { 
        id: "writer", 
        model: "gpt-4o"  // 使用 GPT-4o
      },
      { 
        id: "searcher", 
        model: "claude-3-haiku"  // 使用 Haiku（便宜快速）
      }
    ]
  }
}
```

### 7.2 共享技能给所有 Agent

```json5
{
  skills: {
    load: {
      // 所有 Agent 都能使用的技能
      extraDirs: [
        "~/.openclaw/shared-skills"
      ]
    }
  }
}
```

### 7.3 按时间段切换 Agent

可以结合 Cron 和条件路由，实现：
- 工作时间：路由到 `work` Agent
- 非工作时间：路由到 `life` Agent

---

## 总结

多 Agent 配置是 OpenClaw 最强大的功能之一，它让你：

1. ✅ **一人掌控多个 AI 助手**：每个 Agent 专注一类任务
2. ✅ **数据完全隔离**：不同 Agent 的对话历史互不影响
3. ✅ **灵活路由**：基于账号、关键词、时间等多种方式分配
4. ✅ **独立配置**：每个 Agent 可以有不同模型、不同技能

**下一步**：
- 尝试创建你的第一个多 Agent 配置
- 为每个 Agent 定制独特的性格
- 探索 Agent 间协作的可能性

---

> 📍 **相关文档**
> - [核心概念：多 Agent 路由](/docs/concepts/multi-agent.md)
> - [渠道配置](/docs/channels/)
> - [配置文件参考](/docs/gateway/configuration-reference.md)

---

*[配图：多 Agent 架构示意图 - 展示一个 Gateway 连接多个 Agent，每个 Agent 有独立的工作空间和渠道账号]*

---

## 结构化数据（SEO）

<!--
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "多 Agent 配置实战 - 30 分钟搭建协作系统",
  "description": "学完这个教程，你将能够配置多 Agent 协作系统。包含角色分工、通信机制、任务分配实战示例。",
  "image": "https://trueworld-web.vercel.app/images/multi-agent-config.jpg",
  "author": {
    "@type": "Person",
    "name": "Trueman",
    "url": "https://trueworld-web.vercel.app/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OpenClaw 中文技术网",
    "logo": {
      "@type": "ImageObject",
      "url": "https://trueworld-web.vercel.app/logo.png"
    }
  },
  "datePublished": "2026-03-22",
  "dateModified": "2026-03-24",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://trueworld-web.vercel.app/tutorials/advanced/multi-agent-setup"
  },
  "articleSection": "教程",
  "keywords": ["多 Agent 配置", "Agent 协作", "OpenClaw 教程", "AI 助手"],
  "wordCount": "3500",
  "timeRequired": "PT30M",
  "difficulty": "Intermediate",
  "educationalLevel": "Intermediate",
  "learningResourceType": "Tutorial"
}
</script>
-->

---

## 📚 相关内容

- [多 Agent 协作](/concepts/agent)
- [子 Agent 配置](/concepts/agent-loop)
- [技能开发](/skills/)
- [高级配置](/tutorials/03-configuration)
- [浏览器自动化](/tutorials/advanced/04-browser-automation)
