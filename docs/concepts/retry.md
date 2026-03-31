---
title: retry
description: retry 页面
---

# 重试策略

# 重试策略

## 目标

* 每次 HTTP 请求重试，而不是每个多步骤流程。
* 仅重试当前步骤以保持顺序。
* 避免重复非幂等操作。

## 默认值

* 尝试次数：3
* 最大延迟上限：30000 ms
* 抖动：0.1（10%）
* 提供商默认值：
  * Telegram 最小延迟：400 ms
  * Discord 最小延迟：500 ms

## 行为

### Discord

* 仅在速率限制错误（HTTP 429）时重试。
* 优先使用 Discord 的 `retry_after`，否则使用指数退避。

### Telegram

* 在临时错误时重试（429、超时、连接/重置/关闭、暂时不可用）。
* 优先使用 `retry_after`，否则使用指数退避。
* Markdown 解析错误不会重试；回退到纯文本。

## 配置

在 `~/.openclaw/openclaw.json` 中按提供商设置重试策略：

```json5
{
  channels: {
    telegram: {
      retry: {
        attempts: 3,
        minDelayMs: 400,
        maxDelayMs: 30000,
        jitter: 0.1,
      },
    },
    discord: {
      retry: {
        attempts: 3,
        minDelayMs: 500,
        maxDelayMs: 30000,
        jitter: 0.1,
      },
    },
  },
}
```

## 注意

* 重试适用于每个请求（消息发送、媒体上传、反应、投票、贴纸）。
* 复合流程不会重试已完成的步骤。