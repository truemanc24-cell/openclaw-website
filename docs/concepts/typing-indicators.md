# 打字指示器

# 打字指示器

打字指示器在运行活跃时发送到聊天渠道。使用 `agents.defaults.typingMode` 控制**何时**开始打字，使用 `typingIntervalSeconds` 控制**多久**刷新一次。

## 默认值

当 `agents.defaults.typingMode` **未设置**时，OpenClaw 保持旧版行为：

* **直接聊天**：模型循环一旦开始，打字立即开始。
* **带提及的群组聊天**：打字立即开始。
* **不带提及的群组聊天**：仅当消息文本开始流式传输时，打字才开始。
* **心跳运行**：打字被禁用。

## 模式

将 `agents.defaults.typingMode` 设置为以下之一：

* `never` — 永远不显示打字指示器。
* `instant` — **模型循环一旦开始**就立即开始打字，即使运行稍后只返回静默回复令牌。
* `thinking` — 在**第一个推理增量**时开始打字（需要运行的 `reasoningLevel: "stream"`）。
* `message` — 在**第一个非静默文本增量**时开始打字（忽略 `NO_REPLY` 静默令牌）。

"多早触发"的顺序：
`never` → `message` → `thinking` → `instant`

## 配置

```json5
{
  agent: {
    typingMode: "thinking",
    typingIntervalSeconds: 6,
  },
}
```

您可以按会话覆盖模式或节奏：

```json5
{
  session: {
    typingMode: "message",
    typingIntervalSeconds: 4,
  },
}
```

## 注意事项

* `message` 模式不会为仅静默回复显示打字（例如用于抑制输出的 `NO_REPLY` 令牌）。
* `thinking` 仅在运行流式传输推理时触发（`reasoningLevel: "stream"`）。如果模型不发出推理增量，打字不会开始。
* 无论模式如何，心跳从不显示打字。
* `typingIntervalSeconds` 控制**刷新节奏**，而不是开始时间。默认是 6 秒。