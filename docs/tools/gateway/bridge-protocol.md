# 桥接协议（遗留节点传输）

桥接协议是一个**遗留**节点传输（TCP JSONL）。新节点客户端应改用统一的网关 WebSocket 协议。

如果你正在构建 operator 或节点客户端，请使用 [Gateway protocol](/gateway/protocol)。

**注意：** 当前 OpenClaw 构建不再包含 TCP 桥接监听器；保留此文档用于历史参考。旧的 `bridge.*` 配置键不再是配置模式的一部分。

## 为什么两者都有

* **安全边界**：桥接暴露一个小允许列表而非完整网关 API 表面。
* **配对 + 节点身份**：节点 admission 由网关拥有并绑定到每个节点的令牌。
* **发现 UX**：节点可以通过 LAN 上的 Bonjour 或直接通过 tailnet 连接发现网关。
* **环回 WS**：完整 WS 控制平面保持本地，除非通过 SSH 隧道。

## 传输

* TCP，每行一个 JSON 对象（JSONL）。
* 可选 TLS（当 `bridge.tls.enabled` 为 true 时）。
* 遗留默认监听端口是 `18790`（当前构建不启动 TCP 桥接）。

启用 TLS 时，发现 TXT 记录包括 `bridgeTls=1` 加上 `bridgeTlsSha256` 作为非秘密提示。注意 Bonjour/mDNS TXT 记录是未认证的；客户端不得将广告的指纹视为权威固定，除非有明确的用户意图或其他带外验证。

## 握手 + 配对

1. 客户端发送带有节点元数据 + 令牌的 `hello`（如果已配对）。
2. 如果未配对，网关回复 `error`（`NOT_PAIRED`/`UNAUTHORIZED`）。
3. 客户端发送 `pair-request`。
4. 网关等待批准，然后发送 `pair-ok` 和 `hello-ok`。

`hello-ok` 返回 `serverName`，可能包括 `canvasHostUrl`。

## 帧

客户端 → 网关：

* `req` / `res`：作用域网关 RPC（chat、sessions、config、health、voicewake、skills.bins）
* `event`：节点信号（voice transcript、agent request、chat subscribe、exec lifecycle）

网关 → 客户端：

* `invoke` / `invoke-res`：节点命令（`canvas.*`、`camera.*`、`screen.record`、`location.get`、`sms.send`）
* `event`：订阅会话的聊天更新
* `ping` / `pong`：保活

遗留允许列表强制执行在 `src/gateway/server-bridge.ts` 中（已移除）。

## Exec 生命周期事件

节点可以发出 `exec.finished` 或 `exec.denied` 事件以浮现 system.run 活动。这些映射到网关中的系统事件。（遗留节点可能仍发出 `exec.started`。）

有效载荷字段（全部可选，除非注明）：

* `sessionKey`（必需）：接收系统事件的代理会话。
* `runId`：分组的唯一 exec id。
* `command`：原始或格式化的命令字符串。
* `exitCode`、`timedOut`、`success`、`output`：完成详情（仅 finished）。
* `reason`：拒绝原因（仅 denied）。

## Tailnet 使用

* 绑定桥接到 tailnet IP：在 `~/.openclaw/openclaw.json` 中设置 `bridge.bind: "tailnet"`。
* 客户端通过 MagicDNS 名称或 tailnet IP 连接。
* Bonjour **不**跨网络；需要时使用手动主机/端口或广域网 DNS-SD。

## 版本控制

桥接当前为**隐式 v1**（无 min/max 协商）。预期向后兼容；在任何重大更改之前添加桥接协议版本字段。