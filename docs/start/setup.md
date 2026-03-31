---
title: setup
description: setup 页面
---

# 设置

<Note>
  如果你是第一次设置，请从 [入门指南](/start/getting-started) 开始。
  有关入职引导的详细信息，请参阅 [入职引导 (CLI)](/start/wizard)。
</Note>

最后更新：2026-01-01

## 简而言之

* **定制内容在仓库外：** `~/.openclaw/workspace`（工作区）+ `~/.openclaw/openclaw.json`（配置）。
* **稳定工作流：** 安装 macOS 应用；让它运行捆绑的网关。
* **前沿工作流：** 通过 `pnpm gateway:watch` 自己运行网关，然后让 macOS 应用以本地模式附加。

## 前置要求（源码）

* Node `>=22`
* `pnpm`
* Docker（可选；仅用于容器化设置/e2e — 参见 [Docker](/install/docker)）

## 定制策略（以便更新不会影响）

如果你想要"100% 定制我的"并且希望方便更新，请将你的自定义内容保存在：

* **配置：** `~/.openclaw/openclaw.json`（JSON/JSON5-ish）
* **工作区：** `~/.openclaw/workspace`（技能、提示、记忆；将其设为私有 git 仓库）

引导一次：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw setup
```

在此仓库内，使用本地 CLI 入口：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw setup
```

如果你还没有全局安装，可以通过 `pnpm openclaw setup` 运行它。

## 从此仓库运行网关

在 `pnpm build` 后，你可以直接运行打包的 CLI：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
node openclaw.mjs gateway --port 18789 --verbose
```

## 稳定工作流（macOS 应用优先）

1. 安装并启动 **OpenClaw\.app**（菜单栏）。
2. 完成入职引导/权限清单（TCC 提示）。
3. 确保网关是**本地**且正在运行（应用管理它）。
4. 链接渠道（示例：WhatsApp）：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw channels login
```

5. 健全性检查：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw health
```

如果你的构建中没有入职引导：

* 运行 `openclaw setup`，然后 `openclaw channels login`，然后手动启动网关（`openclaw gateway`）。

## 前沿工作流（终端中的网关）

目标：开发 TypeScript 网关，获取热更新，保持 macOS 应用 UI 附加。

### 0)（可选）也从源码运行 macOS 应用

如果你也想在前沿版本上运行 macOS 应用：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
./scripts/restart-mac.sh
```

### 1) 启动开发网关

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
pnpm install
pnpm gateway:watch
```

`gateway:watch` 以监视模式运行网关，并在相关源代码、
配置和捆绑插件元数据更改时重新加载。

### 2) 将 macOS 应用指向你的运行中的网关

在 **OpenClaw\.app** 中：

* 连接模式：**本地**
  应用将附加到配置端口上运行中的网关。

### 3) 验证

* 应用内网关状态应显示**"正在使用现有网关 …"**
* 或通过 CLI：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
openclaw health
```

### 常见问题

* **端口错误：** 网关 WS 默认为 `ws://127.0.0.1:18789`；保持应用 + CLI 使用相同端口。
* **状态位置：**
  * 凭据：`~/.openclaw/credentials/`
  * 会话：`~/.openclaw/agents/<agentId>/sessions/`
  * 日志：`/tmp/openclaw/`

## 凭据存储映射

在调试认证或决定备份内容时使用此参考：

* **WhatsApp**：`~/.openclaw/credentials/whatsapp/<accountId>/creds.json`
* **Telegram bot token**：配置/环境或 `channels.telegram.tokenFile`（仅普通文件；拒绝符号链接）
* **Discord bot token**：配置/环境或 SecretRef（env/file/exec 提供商）
* **Slack tokens**：配置/环境（`channels.slack.*`）
* **配对白名单**：
  * `~/.openclaw/credentials/<channel>-allowFrom.json`（默认账户）
  * `~/.openclaw/credentials/<channel>-<accountId>-allowFrom.json`（非默认账户）
* **模型认证配置文件**：`~/.openclaw/agents/<agentId>/agent/auth-profiles.json`
* **文件支持的密钥负载（可选）**：`~/.openclaw/secrets.json`
* **传统 OAuth 导入**：`~/.openclaw/credentials/oauth.json`
  详情请参阅：[安全](/gateway/security#credential-storage-map)。

## 更新（不破坏你的设置）

* 保持 `~/.openclaw/workspace` 和 `~/.openclaw/` 作为"你的东西"；不要将个人提示/配置放入 `openclaw` 仓库。
* 更新源码：`git pull` + `pnpm install`（当 lockfile 更改时）+ 继续使用 `pnpm gateway:watch`。

## Linux（systemd 用户服务）

Linux 安装使用 systemd **用户**服务。默认情况下，systemd 在注销/空闲时停止用户
服务，这会杀死网关。入职引导会尝试为你启用 lingering（可能提示 sudo）。如果仍然关闭，请运行：

```bash  theme={"theme":{"light":"min-light","dark":"min-dark"}}
sudo loginctl enable-linger $USER
```

对于常开或多用户服务器，请考虑使用 **系统**服务而非
用户服务（不需要 lingering）。请参阅 [网关运维手册](/gateway) 中的 systemd 说明。

## 相关文档

* [网关运维手册](/gateway)（标志、监管、端口）
* [网关配置](/gateway/configuration)（配置模式 + 示例）
* [Discord](/channels/discord) 和 [Telegram](/channels/telegram)（回复标签 + replyToMode 设置）
* [OpenClaw 助手设置](/start/openclaw)
* [macOS 应用](/platforms/macOS)（网关生命周期）


Built with [Mintlify](https://mintlify.com).