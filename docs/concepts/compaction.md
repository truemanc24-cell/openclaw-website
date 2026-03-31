---
title: compaction
description: compaction 页面
---

# 压缩

# 上下文窗口与压缩

每个模型都有**上下文窗口**（它能看到的最大令牌数）。长时间运行的聊天会累积消息和工具结果；一旦窗口变得紧张，OpenClaw 会**压缩**旧历史以保持在其限制内。

## 什么是压缩

压缩将**旧对话总结**为一个紧凑的摘要条目，并保持最近的消息完整。摘要存储在会话历史中，因此未来的请求使用：

* 压缩摘要
* 压缩点之后的最近消息

压缩**持久化**在会话的 JSONL 历史中。

## 配置

在您的 `openclaw.json` 中使用 `agents.defaults.compaction` 设置来配置压缩行为（模式、目标令牌等）。
压缩摘要默认保留不透明标识符（`identifierPolicy: "strict"`）。您可以使用 `identifierPolicy: "off"` 覆盖此设置，或使用 `identifierPolicy: "custom"` 和 `identifierInstructions` 提供自定义文本。

您可以通过 `agents.defaults.compaction.model` 选择不同的模型进行压缩摘要。当您的主模型是本地或小型模型且希望由更有能力的模型生成压缩摘要时，这很有用。覆盖接受任何 `provider/model-id` 字符串：

```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "model": "openrouter/anthropic/claude-sonnet-4-5"
      }
    }
  }
}
```

这也可以与本地模型一起使用，例如专门用于摘要的第二个 Ollama 模型或微调的压缩专家：

```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "model": "ollama/llama3.1:8b"
      }
    }
  }
}
```

未设置时，压缩使用代理的主模型。

## 自动压缩（默认开启）

当会话接近或超过模型的上下文窗口时，OpenClaw 触发自动压缩，并可能使用压缩后的上下文重试原始请求。

您将看到：

* 详细模式中的 `🧹 Auto-compaction complete`
* `/status` 显示 `🧹 Compactions: <count>`

在压缩之前，OpenClaw 可以运行**静默记忆刷新**轮次以将持久笔记存储到磁盘。详见[记忆](/concepts/memory)和配置。

## 手动压缩

使用 `/compact`（可选择带说明）强制执行压缩过程：

```
/compact Focus on decisions and open questions
```

## 上下文窗口来源

上下文窗口是模型特定的。OpenClaw 使用配置的提供商目录中的模型定义来确定限制。

## 压缩 vs 修剪

* **压缩**：总结并**持久化**到 JSONL。
* **会话修剪**：仅修剪旧的**工具结果**，**在内存中**，按请求。

详见[/concepts/session-pruning](/concepts/session-pruning)了解修剪详情。

## OpenAI 服务端压缩

OpenClaw 还支持兼容的直接 OpenAI 模型的 OpenAI Responses 服务端压缩提示。这与本地 OpenClaw 压缩分开，可以同时运行。

* 本地压缩：OpenClaw 总结并持久化到会话 JSONL。
* 服务端压缩：当 `store` + `context_management` 启用时，OpenAI 在提供商端压缩上下文。

参见[OpenAI 提供商](/providers/openai)了解模型参数和覆盖。

## 自定义上下文引擎

压缩行为由活动的[上下文引擎](/concepts/context-engine)拥有。旧版引擎使用上述内置摘要。插件引擎（通过 `plugins.slots.contextEngine` 选择）可以实现任何压缩策略——DAG 摘要、向量检索、增量凝聚等。

当插件引擎设置 `ownsCompaction: true` 时，OpenClaw 将所有压缩决策委托给引擎，不运行内置自动压缩。

当 `ownsCompaction` 为 `false` 或未设置时，OpenClaw 仍可能使用 Pi 的内置尝试内自动压缩，但活动引擎的 `compact()` 方法仍处理 `/compact` 和溢出恢复。没有自动回退到旧版引擎的压缩路径。

如果您正在构建非拥有的上下文引擎，请从 `openclaw/plugin-sdk/core` 调用 `delegateCompactionToRuntime(...)` 来实现 `compact()`。

## 提示

* 当会话感觉陈旧或上下文臃肿时使用 `/compact`。
* 大工具输出已经被截断；修剪可以进一步减少工具结果积累。
* 如果需要全新开始，`/new` 或 `/reset` 会启动新会话 ID。