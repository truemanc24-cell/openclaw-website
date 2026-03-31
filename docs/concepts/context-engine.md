---
title: context engine
description: context engine 页面
---

# 上下文引擎

# 上下文引擎

**上下文引擎**控制 OpenClaw 为每次运行构建模型上下文的方式。它决定包含哪些消息、如何总结旧历史以及如何管理子代理边界之间的上下文。

OpenClaw 附带内置的 `legacy` 引擎。插件可以注册替代引擎来替换活动的上下文引擎生命周期。

## 快速开始

检查活动的引擎：

```bash
openclaw doctor
# 或直接检查配置：
cat ~/.openclaw/openclaw.json | jq '.plugins.slots.contextEngine'
```

### 安装上下文引擎插件

上下文引擎插件的安装与任何其他 OpenClaw 插件相同。先安装，然后在槽中选择引擎：

```bash
# 从 npm 安装
openclaw plugins install @martian-engineering/lossless-claw

# 或从本地路径安装（用于开发）
openclaw plugins install -l ./my-context-engine
```

然后在配置中启用插件并将其选为活动引擎：

```json5
// openclaw.json
{
  plugins: {
    slots: {
      contextEngine: "lossless-claw", // 必须匹配插件注册的引擎 id
    },
    entries: {
      "lossless-claw": {
        enabled: true,
        // 插件特定的配置在这里（请参阅插件的文档）
      },
    },
  },
}
```

安装和配置后重启网关。

要切换回内置引擎，请将 `contextEngine` 设置为 `"legacy"`（或完全移除键 — `"legacy"` 是默认值）。

## 工作原理

每次 OpenClaw 运行模型提示时，上下文引擎在四个生命周期点参与：

1. **摄入** — 当新消息添加到会话时调用。引擎可以在自己的数据存储中存储或索引消息。
2. **组装** — 每次模型运行前调用。引擎返回适合令牌预算的有序消息集（和可选的 `systemPromptAddition`）。
3. **压缩** — 当上下文窗口满时，或用户运行 `/compress` 时调用。引擎总结旧历史以释放空间。
4. **轮次后** — 运行完成后调用。引擎可以持久化状态、触发后台压缩或更新索引。

### 子代理生命周期（可选）

OpenClaw 目前调用一个子代理生命周期钩子：

* **onSubagentEnded** — 当子代理会话完成或被清除时清理。

`prepareSubagentSpawn` 钩子是接口的一部分，但运行时尚未调用它。

### 系统提示补充

`assemble` 方法可以返回 `systemPromptAddition` 字符串。OpenClaw 在运行前将此前置到系统提示。这允许引擎注入动态召回指导、检索指令或上下文感知提示，而无需静态工作空间文件。

## 旧版引擎

内置的 `legacy` 引擎保留 OpenClaw 的原始行为：

* **摄入**：无操作（会话管理器直接处理消息持久化）。
* **组装**：直通（运行时中的现有清理 → 验证 → 限制管道处理上下文组装）。
* **压缩**：委托给内置摘要压缩，创建旧消息的单一摘要并保持最近消息完整。
* **轮次后**：无操作。

旧版引擎不注册工具或不提供 `systemPromptAddition`。

当未设置 `plugins.slots.contextEngine`（或设置为 `"legacy"`）时，此引擎自动使用。

## 插件引擎

插件可以使用插件 API 注册上下文引擎：

```ts
export default function register(api) {
  api.registerContextEngine("my-engine", () => ({
    info: {
      id: "my-engine",
      name: "My Context Engine",
      ownsCompaction: true,
    },

    async ingest({ sessionId, message, isHeartbeat }) {
      // 在您的数据存储中存储消息
      return { ingested: true };
    },

    async assemble({ sessionId, messages, tokenBudget }) {
      // 返回适合预算的消息
      return {
        messages: buildContext(messages, tokenBudget),
        estimatedTokens: countTokens(messages),
        systemPromptAddition: "Use lcm_grep to search history...",
      };
    },

    async compact({ sessionId, force }) {
      // 总结旧上下文
      return { ok: true, compacted: true };
    },
  }));
}
```

然后在配置中启用它：

```json5
{
  plugins: {
    slots: {
      contextEngine: "my-engine",
    },
    entries: {
      "my-engine": {
        enabled: true,
      },
    },
  },
}
```

### ContextEngine 接口

必需成员：

| 成员             | 类型     | 用途                                                  |
| ---------------- | -------- | ---------------------------------------------------- |
| `info`           | 属性     | 引擎 id、名称、版本以及是否拥有压缩                   |
| `ingest(params)` | 方法     | 存储单条消息                                         |
| `assemble(params)` | 方法   | 为模型运行构建上下文（返回 `AssembleResult`）         |
| `compact(params)` | 方法   | 总结/减少上下文                                       |

`assemble` 返回一个 `AssembleResult`，包含：

* `messages` — 发送给模型的有序消息。
* `estimatedTokens`（必需，`number`）— 引擎对组装上下文中总令牌的估计。OpenClaw 将此用于压缩阈值决策和诊断报告。
* `systemPromptAddition`（可选，`string`）— 前置到系统提示。

可选成员：

| 成员                         | 类型   | 用途                                                                                                         |
| ---------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `bootstrap(params)`          | 方法   | 初始化会话的引擎状态。引擎首次看到会话时调用一次（例如导入历史）。                                                |
| `ingestBatch(params)`        | 方法   | 批量摄入完成的轮次。运行完成后调用，携带该轮次的所有消息。                                                     |
| `afterTurn(params)`          | 方法   | 运行后生命周期工作（持久化状态、触发后台压缩）。                                                                |
| `prepareSubagentSpawn(params)` | 方法 | 为子会话设置共享状态。                                                                          |
| `onSubagentEnded(params)`    | 方法   | 子代理结束后清理。                                                                                 |
| `dispose()`                  | 方法   | 释放资源。在网关关闭或插件重新加载时调用 — 非每会话。                                                           |

### ownsCompaction

`ownsCompaction` 控制 Pi 的内置尝试内自动压缩是否保持启用：

* `true` — 引擎拥有压缩行为。OpenClaw 为该运行禁用 Pi 的内置自动压缩，引擎的 `compact()` 实现负责 `/compact`、溢出恢复压缩以及它在 `afterTurn()` 中想要的任何主动压缩。
* `false` 或未设置 — Pi 的内置自动压缩可能在提示执行期间仍然运行，但活动引擎的 `compact()` 方法仍为 `/compact` 和溢出恢复调用。

`ownsCompaction: false` 并不意味着 OpenClaw 自动回退到旧版引擎的压缩路径。

这意味着有两种有效的插件模式：

* **拥有模式** — 实现您自己的压缩算法并设置 `ownsCompaction: true`。
* **委托模式** — 设置 `ownsCompaction: false` 并让 `compact()` 从 `openclaw/plugin-sdk/core` 调用 `delegateCompactionToRuntime(...)` 以使用 OpenClaw 的内置压缩行为。

对于活动的非拥有引擎，无操作的 `compact()` 是不安全的，因为它禁用了该引擎槽的正常 `/compact` 和溢出恢复压缩路径。

## 配置参考

```json5
{
  plugins: {
    slots: {
      // 选择活动的上下文引擎。默认："legacy"。
      // 设置为插件 id 以使用插件引擎。
      contextEngine: "legacy",
    },
  },
}
```

该槽在运行时是独占的 — 只会解析一个注册的上下文引擎用于给定的运行或压缩操作。其他启用的 `kind: "context-engine"` 插件仍然可以加载和运行其注册代码；`plugins.slots.contextEngine` 只选择当 OpenClaw 需要上下文引擎时解析的注册引擎 id。

## 与压缩和记忆的关系

* **压缩**是上下文引擎的职责之一。旧版引擎委托给 OpenClaw 的内置摘要。插件引擎可以实现任何压缩策略（DAG 摘要、向量检索等）。
* **记忆插件**（`plugins.slots.memory`）与上下文引擎分开。记忆插件提供搜索/检索；上下文引擎控制模型看到什么。它们可以协同工作 — 上下文引擎可能在组装期间使用记忆插件数据。
* **会话修剪**（在内存中修剪旧工具结果）无论活动的上下文引擎是什么都会运行。

## 提示

* 使用 `openclaw doctor` 验证您的引擎加载正确。
* 如果切换引擎，现有会话将继续使用其当前历史记录。新引擎接管未来的运行。
* 引擎错误被记录并在诊断中显示。如果插件引擎注册失败或选定的引擎 id 无法解析，OpenClaw 不会自动回退；运行失败，直到您修复插件或将 `plugins.slots.contextEngine` 切换回 `"legacy"`。
* 对于开发，使用 `openclaw plugins install -l ./my-engine` 链接本地插件目录而不复制。

另见：[压缩](/concepts/compaction)、[上下文](/concepts/context)、[插件](/tools/plugin)、[插件清单](/plugins/manifest)。