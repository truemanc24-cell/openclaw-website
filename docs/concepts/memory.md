---
title: memory
description: memory 页面
---

# 记忆

# 记忆

OpenClaw 的记忆系统帮助代理在会话之间保留信息。

## 记忆类型

### 工作空间文件（短期记忆）

这些文件在每次会话开始时加载：

* `AGENTS.md` — 操作规则和优先级
* `SOUL.md` — 人设和边界
* `USER.md` — 用户资料
* `IDENTITY.md` — 代理身份

### 每日记忆日志

`memory/YYYY-MM-DD.md` 文件存储每日事件和笔记。

建议在会话开始时读取今天和昨天的内容。

### 长期记忆

`MEMORY.md` 存储精选的长期信息，仅在主私有会话中加载。

## 自动记忆刷新

在压缩之前，OpenClaw 可以运行静默记忆刷新轮次，将持久笔记写入磁盘。

配置：

```json5
{
  agents: {
    defaults: {
      memoryFlush: {
        enabled: true,
        thresholdTokens: 15000,
      },
    },
  },
}
```

## 查看记忆状态

使用 `/memory` 命令查看记忆统计和状态。