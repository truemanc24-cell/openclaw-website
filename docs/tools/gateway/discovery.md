---
title: discovery
description: discovery 页面
---

# 发现

OpenClaw 支持多种发现机制来定位网关。

## 发现方法

### 1. 本地发现（Bonjour/mDNS）

在 LAN 上自动发现网关：

* 服务类型：`_openclaw-gw._tcp`
* 由 macOS、iOS 和 Android 节点使用
* 请参阅 [Bonjour Discovery](/gateway/bonjour) 了解详情

### 2. Tailnet 发现

通过 Tailscale 网络发现网关：

* 使用 MagicDNS（`hostname.tailscale.ts`）
* 直接 IP 连接
* 最适合远程访问

### 3. 手动连接

直接指定网关地址：

```bash
openclaw agent --gateway 192.168.1.100:18789
```

## 发现配置

```json5
{
  discovery: {
    // 启用/禁用Bonjour
    bonjour: {
      enabled: true,
      serviceType: "_openclaw-gw._tcp"
    },
    // 启用广域网DNS-SD
    wideArea: {
      enabled: false,
      domain: "openclaw.internal"
    }
  }
}
```

## 常见场景

### 在家使用（本地网络）

* 启用 Bonjour（默认）
* 节点通过局域网 IP 连接

### 远程使用（Tailscale）

* 启用 Tailnet 绑定：`gateway.bind: "tailnet"`
* 节点通过 MagicDNS 名称连接

### 混合场景

* 启用 Bonjour 用于本地
* 配置 Tailnet 用于远程
* 使用 split DNS 进行跨网络发现

## 故障排除

### Bonjour 不工作

* 检查防火墙是否允许 UDP 端口 5353
* 确保设备在同一网络上
* 请参阅 [Bonjour 调试](/gateway/bonjour#debugging-on-macos)

### Tailnet 连接问题

* 确保 Tailscale 登录
* 验证 MagicDNS 启用
* 检查网关绑定设置