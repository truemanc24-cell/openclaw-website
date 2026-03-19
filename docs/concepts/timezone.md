# 时区

# 时区

OpenClaw 标准化时间戳，以便模型看到**单个参考时间**。

## 消息信封（默认本地）

入站消息包装在如下信封中：

```
[Provider ... 2026-01-05 16:26 PST] message text
```

信封中的时间戳**默认是主机本地**，精确到分钟。

您可以覆盖此设置：

```json5
{
  agents: {
    defaults: {
      envelopeTimezone: "local", // "utc" | "local" | "user" | IANA 时区
      envelopeTimestamp: "on", // "on" | "off"
      envelopeElapsed: "on", // "on" | "off"
    },
  },
}
```

* `envelopeTimezone: "utc"` 使用 UTC。
* `envelopeTimezone: "user"` 使用 `agents.defaults.userTimezone`（回退到主机时区）。
* 使用明确的 IANA 时区（例如 `"Europe/Vienna"`）以获得固定偏移。
* `envelopeTimestamp: "off"` 从信封头中移除绝对时间戳。
* `envelopeElapsed: "off"` 移除经过时间后缀（`+2m` 样式）。

### 示例

**本地（默认）：**

```
[Signal Alice +1555 2026-01-18 00:19 PST] hello
```

**固定时区：**

```
[Signal Alice +1555 2026-01-18 06:19 GMT+1] hello
```

**经过时间：**

```
[Signal Alice +1555 +2m 2026-01-18T05:19Z] follow-up
```

## 工具负载（原始提供商数据 + 规范化字段）

工具调用（`channels.discord.readMessages`、`channels.slack.readMessages` 等）返回**原始提供商时间戳**。
我们还附加了规范化字段以保持一致：

* `timestampMs`（UTC 纪元毫秒）
* `timestampUtc`（ISO 8601 UTC 字符串）

保留原始提供商字段。

## 系统提示的用户时区

设置 `agents.defaults.userTimezone` 以告诉模型用户的本地时区。如果未设置，OpenClaw 在运行时解析**主机时区**（无配置写入）。

```json5
{
  agents: { defaults: { userTimezone: "America/Chicago" } },
}
```

系统提示包括：

* `Current Date & Time` 部分，包含本地时间和时区
* `Time format: 12-hour` 或 `24-hour`

您可以使用 `agents.defaults.timeFormat`（`auto` | `12` | `24`）控制提示格式。

参见[日期和时间](/date-time)了解完整行为和示例。