---
title: 01 quick start
description: 01 quick start 页面
---

# 入门指南

目标：以最少的设置从零到第一次聊天。

> 最快的聊天方式：打开控制 UI（无需设置频道）。运行 `openclaw dashboard` 并在浏览器中聊天，或在网关主机上打开 `http://127.0.0.1:18789/`。文档：Dashboard 和控制 UI。

## 前提条件
* 推荐 Node 24（Node 22 LTS，当前 `22.16+`，仍支持以保持兼容性）

> 如果不确定，请使用 `node --version` 检查你的 Node 版本。

## 快速设置（CLI）

1. **安装 OpenClaw（推荐）**
   - macOS/Linux：
   ```bash
   curl -fsSL https://openclaw.ai/install.sh | bash
   ```
   - Windows (PowerShell)：
   ```powershell
   iwr -useb https://openclaw.ai/install.ps1 | iex
   ```
   > 其他安装方法和要求请参阅安装指南。

2. **运行入门向导**
   ```bash
   openclaw onboard --install-daemon
   ```
   向导会配置认证、网关设置和可选频道。详细信息请参阅入门向导。

3. **检查网关**
   如果你安装了服务，它应该已经在运行：
   ```bash
   openclaw gateway status
   ```

4. **打开控制 UI**
   ```bash
   openclaw dashboard
   ```

> 如果控制 UI 能加载，说明你的网关已准备就绪。

## 可选的检查和额外功能

**在后台运行网关**
用于快速测试或故障排除：
```bash
openclaw gateway --port 18789
```

**发送测试消息**
需要已配置的频道：
```bash
openclaw message send --target +15555550123 --message "Hello from OpenClaw"
```

## 有用的环境变量
如果你以服务账户运行 OpenClaw 或想要自定义配置/状态位置：
* `OPENCLAW_HOME` - 设置用于内部路径解析的主目录
* `OPENCLAW_STATE_DIR` - 覆盖状态目录
* `OPENCLAW_CONFIG_PATH` - 覆盖配置文件路径

完整环境变量参考：环境变量。

## 深入了解
- 入门向导（详情）- CLI 向导参考和高级选项
- macOS 应用入门 - macOS 应用的首次运行流程

## 你将获得
* 运行中的网关
* 已配置的认证
* 控制 UI 访问或已连接的频道

## 下一步
* DM 安全和审批：配对
* 连接更多频道：频道
* 高级工作流和源码：设置


---

## 📚 相关内容

- [安装指南](/tutorials/02-installation)
- [配置教程](/tutorials/03-configuration)
- [核心概念](/tutorials/103-core-concepts)
- [快速开始指南](/tutorials/101-quick-start-guide)
- [故障排查](/tutorials/201-troubleshooting-guide)
