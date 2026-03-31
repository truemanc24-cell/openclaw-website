---
title: model failover
description: model failover 页面
---

# 模型故障转移

# 模型故障转移

模型故障转移处理认证配置文件轮换、冷却时间以及与回退的交互。

## 认证故障转移

当模型调用因认证问题失败时，OpenClaw 可以自动切换到下一个认证配置文件：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6",
        authFailover: {
          enabled: true,
          cooldownSeconds: 300,
        },
      },
    },
  },
}
```

## 冷却时间

失败后，配置文件的冷却期防止立即重试同一密钥。

配置：

```json5
{
  agents: {
    defaults: {
      model: {
        authFailover: {
          cooldownSeconds: 300,  // 默认 5 分钟
        },
      },
    },
  },
}
```

## 模型回退

模型回退在认证故障转移之后按顺序尝试：

1. 主模型
2. 回退列表中的模型

每个模型也可以有自己的认证配置文件列表。

## 状态查看

使用 `/model status` 查看当前模型和认证状态。

## 错误处理

故障转移时发生错误时，OpenClaw 会记录错误并尝试下一个选项。如果所有选项都失败，将返回最终错误。