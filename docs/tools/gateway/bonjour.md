---
title: bonjour
description: bonjour 页面
---

# Bonjour / mDNS 发现

OpenClaw 使用 Bonjour（mDNS / DNS-SD）作为**仅 LAN 便利**来发现活动的网关（WebSocket 端点）。它是尽力而为的，不能替代 SSH 或 Tailnet 连接。

## 广域网 Bonjour（通过 Tailscale 单播 DNS-SD）

如果节点和网关在不同网络上，多播 mDNS 不会跨过边界。你可以通过切换到**单播 DNS-SD**（"广域网 Bonjour"）通过 Tailscale 保持相同的发现体验。

高层步骤：

1. 在网关主机上运行一个 DNS 服务器（通过 Tailnet 可达）。
2. 在专用区域下发布 `_openclaw-gw._tcp` 的 DNS-SD 记录（例如：`openclaw.internal.`）。
3. 配置 Tailscale **split DNS**，以便你的选定域通过该 DNS 服务器解析供客户端使用（包括 iOS）。

OpenClaw 支持任何发现域；`openclaw.internal.` 只是一个例子。iOS/Android 节点同时浏览 `local.` 和你配置的广域网域。

### 网关配置（推荐）

```json5
{
  gateway: { bind: "tailnet" }, // tailnet-only (recommended)
  discovery: { wideArea: { enabled: true } }, // enables wide-area DNS-SD publishing
}
```

### 一次性 DNS 服务器设置（网关主机）

```bash
openclaw dns setup --apply
```

这安装 CoreDNS 并配置它：

* 仅在网关的 Tailscale 接口上监听端口 53
* 从 `~/.openclaw/dns/<domain>.db` 提供你选择的域（例如 `openclaw.internal.`）

从 tailnet 连接的机器验证：

```bash
dns-sd -B _openclaw-gw._tcp openclaw.internal.
dig @<TAILNET_IPV4> -p 53 _openclaw-gw._tcp.openclaw.internal PTR +short
```

### Tailscale DNS 设置

在 Tailscale 管理控制台中：

* 添加一个名称服务器指向网关的 tailnet IP（UDP/TCP 53）。
* 添加 split DNS，以便你的发现域使用该名称服务器。

一旦客户端接受 tailnet DNS，iOS 节点可以在你的发现域中浏览 `_openclaw-gw._tcp`，而无需多播。

### 网关监听器安全（推荐）

网关 WS 端口（默认 `18789`）默认绑定到环回。对于 LAN/tailnet 访问，明确绑定并保持认证启用。

对于仅 tailnet 设置：

* 在 `~/.openclaw/openclaw.json` 中设置 `gateway.bind: "tailnet"`。
* 重启网关（或重启 macOS 菜单栏应用）。

## 什么在广播

只有网关广播 `_openclaw-gw._tcp`。

## 服务类型

* `_openclaw-gw._tcp` — 网关传输信标（由 macOS/iOS/Android 节点使用）。

## TXT 键（非秘密提示）

网关广播小的非秘密提示以使 UI 流程更方便：

* `role=gateway`
* `displayName=<friendly name>`
* `lanHost=<hostname>.local`
* `gatewayPort=<port>`（网关 WS + HTTP）
* `gatewayTls=1`（仅在启用 TLS 时）
* `gatewayTlsSha256=<sha256>`（仅在启用 TLS 且指纹可用时）
* `canvasPort=<port>`（仅在启用画布主机时；目前与 `gatewayPort` 相同）
* `sshPort=<port>`（默认 22 未覆盖时）
* `transport=gateway`
* `cliPath=<path>`（可选；可运行 `openclaw` 入口点的绝对路径）
* `tailnetDns=<magicdns>`（可选提示，当 Tailnet 可用时）

安全说明：

* Bonjour/mDNS TXT 记录是**未认证的**。客户端不得将 TXT 视为权威路由。
* 客户端应使用解析的服务端点（SRV + A/AAAA）进行路由。将 `lanHost`、`tailnetDns`、`gatewayPort` 和 `gatewayTlsSha256` 视为仅提示。
* TLS 固定不得允许广告的 `gatewayTlsSha256` 覆盖先前存储的固定。
* iOS/Android 节点应将基于发现的直接连接视为**仅 TLS** 并在信任首次指纹之前需要明确的用户确认。

## 在 macOS 上调试

有用的内置工具：

* 浏览实例：

  ```bash
  dns-sd -B _openclaw-gw._tcp local.
  ```

* 解析一个实例（替换 `<instance>`）：

  ```bash
  dns-sd -L "<instance>" _openclaw-gw._tcp local.
  ```

如果浏览工作但解析失败，你通常遇到 LAN 策略或 mDNS 解析器问题。

## 在网关日志中调试

网关写入滚动日志文件（在启动时打印为 `gateway log file: ...`）。查找 `bonjour:` 行，特别是：

* `bonjour: advertise failed ...`
* `bonjour: ... name conflict resolved` / `hostname conflict resolved`
* `bonjour: watchdog detected non-announced service ...`

## 在 iOS 节点上调试

iOS 节点使用 `NWBrowser` 发现 `_openclaw-gw._tcp`。

要捕获日志：

* 设置 → 网关 → 高级 → **发现调试日志**
* 设置 → 网关 → 高级 → **发现日志** → 复现 → **复制**

日志包括浏览器状态转换和结果集更改。

## 常见失败模式

* **Bonjour 不跨网络**：使用 Tailnet 或 SSH。
* **多播被阻止**：某些企业/公共 WiFi 阻止 mDNS。
* **防火墙阻止**：确保 UDP 端口 5353 对本地网络开放。