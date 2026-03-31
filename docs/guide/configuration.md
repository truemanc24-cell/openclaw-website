---
title: configuration
description: configuration 页面
---

# 配置指南

## 核心配置文件

### openclaw.json

主配置文件，位于 `~/.openclaw/openclaw.json`：

```json
{
  "model": "bailian/qwen3.5-plus",
  "defaultModel": "bailian/qwen3.5-plus",
  "thinking": "off",
  "extensions": ["feishu"],
  "skills": {
    "enabled": ["github", "weather", "summarize"]
  }
}
```

## Agent 配置

每个 Agent 有自己的配置目录：

```
~/.openclaw/agents/
├── main/agent/       # Main Agent
├── deep-think/agent/ # Deep Think Agent
└── ...
```

### 核心文件

- **SOUL.md**: Agent 的核心人格和行为准则
- **IDENTITY.md**: Agent 的身份定义
- **USER.md**: 用户信息
- **AGENTS.md**: 工作区规则
- **TOOLS.md**: 本地工具和环境配置

## 技能配置

技能位于 `~/.openclaw/skills/` 目录，每个技能包含：
- `SKILL.md`: 技能说明和使用指南
- 相关脚本和配置文件

### 启用/禁用技能

在 `openclaw.json` 中配置：

```json
{
  "skills": {
    "enabled": ["github", "weather"],
    "disabled": ["twitter"]
  }
}
```

## 扩展配置

### Feishu 扩展

配置飞书集成：

```json
{
  "extensions": {
    "feishu": {
      "appId": "your-app-id",
      "appSecret": "your-app-secret"
    }
  }
}
```

## 环境变量

某些配置可以通过环境变量设置：

```bash
export OPENCLAW_MODEL=your-model
export OPENCLAW_API_KEY=your-key
```

## 最佳实践

1. **备份配置**: 修改前使用备份脚本
2. **版本控制**: 将配置纳入 Git 管理
3. **文档化**: 在 TOOLS.md 中记录环境特定配置
