# 在线状态

# 在线状态

OpenClaw "在线状态"是一个轻量级、尽力而为的视图，显示：

* **网关**本身，以及
* **连接到网关的客户端**（mac 应用、WebChat、CLI 等）

在线状态主要用于渲染 macOS 应用的**实例**选项卡并提供快速操作员可见性。

## 在线状态字段（显示什么）

在线状态条目是结构化对象，具有如下字段：

* `instanceId`（可选但强烈推荐）：稳定的客户端身份（通常为 `connect.client.instanceId`）
* `host`：友好主机名
* `ip`：尽力而为的 IP 地址
* `version`：客户端版本字符串
* `deviceFamily` / `modelIdentifier`：硬件提示
* `mode`：`ui`、`webchat`、`cli`、`backend`、`probe`、`test`、`node`、...
* `lastInputSeconds`："距离上次用户输入的秒数"（如果已知）
* `reason`：`self`、`connect`、`node-connected`、`periodic`、...
* `ts`：上次更新时间戳（自纪元以来的毫秒数）

## 生产者（在线状态来自哪里）

在线状态条目由多个来源产生并**合并**。

### 1) 网关自条目

网关总是在启动时种入一个"self"条目，以便 UI 在任何客户端连接之前显示网关主机。

### 2) WebSocket 连接

每个 WS 客户端以 `connect` 请求开始。成功握手后，网关为该连接 upsert 在线状态条目。

#### 为什么一次性 CLI 命令不显示

CLI 通常连接执行短期、一次性命令。为避免污染实例列表，`client.mode === "cli"` **不会**转换为在线状态条目。

### 3) `system-event` 信标

客户端可以通过 `system-event` 方法发送更丰富的周期性信标。mac 应用使用它来报告主机名、IP 和 `lastInputSeconds`。

### 4) 节点连接（角色：node）

当节点通过网关 WebSocket 连接并带有 `role: node` 时，网关为该节点 upsert 在线状态条目（与其他 WS 客户端相同流程）。

## 合并 + 去重规则（为什么 `instanceId` 很重要）

在线状态条目存储在单个内存映射中：

* 条目按键**在线状态键**。
* 最好的键是一个稳定的 `instanceId`（来自 `connect.client.instanceId`），它能在重启后存活。
* 键不区分大小写。

如果客户端重新连接而没有稳定的 `instanceId`，它可能会显示为**重复**行。

## TTL 和有界大小

在线状态故意是临时的：

* **TTL：** 超过 5 分钟的条目被清除
* **最大条目数：** 200（最旧的先丢弃）

这保持列表新鲜并避免无限制的内存增长。

## 远程/隧道注意事项（回环 IP）

当客户端通过 SSH 隧道 / 本地端口转发连接时，网关可能将远程地址视为 `127.0.0.1`。为避免覆盖良好的客户端报告 IP，忽略回环远程地址。

## 消费者

### macOS 实例选项卡

macOS 应用呈现 `system-presence` 的输出，并根据上次更新的年龄应用小的状态指示器（Active/Idle/Stale）。

## 调试提示

* 要查看原始列表，请对网关调用 `system-presence`。
* 如果看到重复项：
  * 确认客户端在握手中发送稳定的 `client.instanceId`
  * 确认定期信标使用相同的 `instanceId`
  * 检查连接派生条目是否缺少 `instanceId`（重复是预期的）