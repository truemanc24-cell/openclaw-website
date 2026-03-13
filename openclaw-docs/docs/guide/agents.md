# Agent 配置指南

## 创建你的第一个 Agent

### Step 1: 创建 Agent 目录

```bash
mkdir -p ~/.openclaw/agents/my-agent/agent
```

### Step 2: 创建核心文件

创建以下 6 个核心文件：

1. **IDENTITY.md** - Agent 身份
2. **SOUL.md** - 核心原则
3. **AGENTS.md** - 工作空间
4. **USER.md** - 用户信息
5. **TOOLS.md** - 工具说明
6. **MEMORY.md** - 长期记忆

### Step 3: 配置 openclaw.json

编辑 `~/.openclaw/openclaw.json`，添加 Agent 配置。

### Step 4: 配置飞书 Bot

在飞书开放平台创建 Bot，获取 App ID 和 Secret。

### Step 5: 启动并测试

```bash
openclaw gateway restart
```

## 示例配置

参考我们的 11 个 Agent 配置：
- web-builder (小筑) - 网站开发
- seo-master (搜搜) - SEO 优化
- social - 社交运营
- lingling - 创意策划
- money (财叔) - 财务管理
- 等等...

## 下一步

- [技能开发](/guide/skills) - 开发自定义技能
- [Hook 系统](/guide/hooks) - 配置自动化
