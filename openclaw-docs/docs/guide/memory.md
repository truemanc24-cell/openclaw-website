# 记忆系统指南

## 记忆架构

OpenClaw 的记忆系统分为两层：

### 1. 每日笔记 (memory/YYYY-MM-DD.md)

- 原始会话日志
- 每天一个文件
- 自动创建

### 2. 长期记忆 (MEMORY.md)

- 精选跨会话同步内容
- 所有 Agent 共享
- 手动 curated

## 自我改进系统

### 学习目录 (.learnings/)

```
.learnings/
├── LEARNINGS.md       # 纠正、最佳实践
├── ERRORS.md          # 命令失败、异常
└── FEATURE_REQUESTS.md # 功能请求
```

### 记录学习

当遇到以下情况时记录：

1. **用户纠正你** → LEARNINGS.md (correction)
2. **命令失败** → ERRORS.md
3. **发现更好方法** → LEARNINGS.md (best_practice)
4. **用户想要新功能** → FEATURE_REQUESTS.md

### 提升到永久文件

当学习具有广泛适用性时：

| 学习类型 | 提升到 |
|---------|--------|
| 行为模式 | SOUL.md |
| 工作流改进 | AGENTS.md |
| 工具技巧 | TOOLS.md |

## 全局共享

所有 Agent 通过符号链接共享同一份 .learnings/：

```bash
~/.openclaw/agents/*/agent/.learnings -> ~/.openclaw/workspace/.learnings/
```

**一个 Agent 学到，所有 Agent 受益！**
