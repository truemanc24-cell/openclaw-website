---
title: 101 quick start guide
description: 101 quick start guide 页面
---

# OpenClaw 快速开始指南：10 分钟让你的 AI 助手跑起来

> **摘要**：本教程带你从零开始，在 10 分钟内完成 OpenClaw 的安装、配置和第一次对话。无需编程基础，只需跟着步骤操作，即可拥有属于自己的本地 AI 助手。
>
> **学习目标**：
> - 理解 OpenClaw 是什么以及它能做什么
> - 完成环境准备和安装
> - 配置第一个聊天渠道
> - 成功发送第一条消息

---

## 一、什么是 OpenClaw？

OpenClaw 是一个**本地优先的 AI 助手框架**，让你能够在自己的电脑上运行强大的 AI 助手，同时连接到各种聊天平台（飞书、微信、Telegram 等）。

### 核心特点

| 特点 | 说明 |
|------|------|
| 🏠 本地优先 | 数据保存在本地，隐私可控 |
| 🔌 多渠道支持 | 飞书、微信、Telegram、Discord 等 |
| 🧠 智能体架构 | 支持多 Agent 协作，专业分工 |
| 🛠 技能系统 | 可扩展的工具和能力 |
| 💾 记忆系统 | 长期记忆，越用越懂你 |

### 适用场景

- **个人助手**：日程管理、信息查询、文档处理
- **团队协作**：飞书/钉钉机器人、自动回复
- **开发效率**：代码审查、Issue 处理、自动化工作流
- **内容创作**：社交媒体运营、文案生成

---

## 二、环境准备

### 系统要求

| 系统 | 版本要求 | 备注 |
|------|---------|------|
| macOS | 12.0+ | 推荐 M 系列芯片 |
| Linux | Ubuntu 20.04+ | 其他发行版需测试 |
| Windows | 10/11 | PowerShell 管理员权限 |

### 检查 Node.js 环境

OpenClaw 基于 Node.js 运行，需要 Node 22 LTS 或更高版本。

```bash
# 检查 Node 版本
node --version

# 检查 npm 版本
npm --version
```

**预期输出**：
```
v22.16.0  # 或更高版本
10.8.0    # 或更高版本
```

### 安装 Node.js（如未安装）

**macOS（使用 Homebrew）**：
```bash
# 安装 Homebrew（如未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node@22
```

**Linux（使用 NVM）**：
```bash
# 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node 22
nvm install 22
nvm use 22
```

**Windows**：
访问 [nodejs.org](https://nodejs.org/) 下载 LTS 版本安装。

---

## 三、安装步骤

### 方式一：一键安装脚本（推荐）

**macOS/Linux**：
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows（PowerShell）**：
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**安装过程**：
1. 下载 OpenClaw CLI 工具
2. 创建配置文件目录 `~/.openclaw/`
3. 安装依赖项
4. 配置环境变量

**验证安装**：
```bash
openclaw --version
```

**预期输出**：
```
openclaw v1.x.x
```

### 方式二：npm 安装（备选）

```bash
npm install -g openclaw
```

> ⚠️ **注意**：如遇到权限问题，在命令前加 `sudo`（macOS/Linux）或以管理员身份运行（Windows）。

---

## 四、初始配置

### 运行入门向导

安装完成后，运行向导进行初始配置：

```bash
openclaw onboard --install-daemon
```

**向导会引导你完成**：
1. ✅ 选择 AI 模型提供商（阿里云百炼、OpenAI 等）
2. ✅ 配置 API Key
3. ✅ 设置网关端口（默认 18789）
4. ✅ 选择是否安装后台服务

### 配置 AI 模型

OpenClaw 支持多种 AI 模型，推荐使用**阿里云百炼**（国内访问速度快）。

**获取 API Key**：
1. 访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/)
2. 登录/注册账号
3. 进入「API-KEY 管理」
4. 创建新的 API Key
5. 复制并保存（只显示一次）

**在向导中输入**：
```
? 选择模型提供商：阿里云百炼
? 输入 API Key：sk-xxxxxxxxxxxxxxxx
? 选择默认模型：qwen3.5-plus
```

### 验证配置

```bash
# 检查网关状态
openclaw gateway status

# 查看配置文件
cat ~/.openclaw/openclaw.json
```

**网关状态输出示例**：
```
Gateway: running
Port: 18789
PID: 12345
```

---

## 五、第一个聊天渠道

### 方式一：使用控制 UI（最快）

无需配置任何渠道，直接在浏览器中与 AI 对话。

```bash
# 打开控制 UI
openclaw dashboard
```

或手动访问：
```
http://127.0.0.1:18789/
```

**操作步骤**：
1. 在浏览器输入上述地址
2. 看到聊天界面
3. 输入「你好，测试一下」
4. 等待 AI 回复

> ✅ **成功标志**：收到 AI 的友好回复

### 方式二：配置飞书机器人（推荐用于团队）

**步骤 1：创建飞书应用**
1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 登录企业账号
3. 进入「企业应用」→「创建应用」
4. 选择「机器人」类型
5. 填写应用名称（如：OpenClaw 助手）

**步骤 2：获取凭证**
1. 进入应用管理页面
2. 复制「App ID」和「App Secret」
3. 进入「机器人」→「机器人设置」
4. 复制「Webhook 地址」

**步骤 3：配置到 OpenClaw**
```bash
# 编辑配置文件
openclaw config edit

# 或在 openclaw.json 中添加
{
  "channels": {
    "feishu": {
      "appId": "cli_xxxxxxxxxxxx",
      "appSecret": "xxxxxxxxxxxxxxxx",
      "encryptKey": "xxxxxxxxxxxxxxxx",
      "verificationToken": "xxxxxxxxxxxxxxxx"
    }
  }
}
```

**步骤 4：重启网关**
```bash
openclaw gateway restart
```

**步骤 5：测试对话**
在飞书中 @机器人 发送消息，应收到回复。

---

## 六、常见问题

### Q1: 安装时提示权限错误

**解决方案**：
```bash
# macOS/Linux
sudo npm install -g openclaw

# 或使用 nvm（无需 sudo）
nvm install 22
npm install -g openclaw
```

### Q2: 网关无法启动

**排查步骤**：
```bash
# 1. 检查端口占用
lsof -i :18789

# 2. 查看日志
openclaw gateway logs

# 3. 检查配置
openclaw health
```

### Q3: AI 回复超时

**可能原因**：
- API Key 无效
- 网络连接问题
- 模型配额不足

**解决方案**：
```bash
# 验证 API Key
openclaw config verify

# 检查网络
ping bailian.aliyun.com
```

### Q4: 飞书机器人无响应

**检查清单**：
- [ ] App ID 和 Secret 配置正确
- [ ] 机器人已添加到群聊
- [ ] 网关正在运行
- [ ] 飞书开放平台回调地址配置正确

---

## 七、下一步学习

恭喜你完成快速开始！接下来可以：

1. 📖 **深入配置**：阅读《如何配置第一个聊天渠道》
2. 🧠 **理解架构**：阅读《OpenClaw 核心概念解析》
3. 🛠 **探索技能**：查看可用技能列表 `openclaw skills list`
4. 💬 **加入社区**：访问官方文档和论坛

---

## 快速参考卡

```bash
# 常用命令
openclaw --version          # 查看版本
openclaw gateway status     # 检查网关
openclaw dashboard          # 打开控制 UI
openclaw config edit        # 编辑配置
openclaw health             # 健康检查
openclaw skills list        # 查看技能

# 配置文件位置
~/.openclaw/openclaw.json   # 主配置
~/.openclaw/agents/         # Agent 配置
```

---

**教程完成时间**：约 10-15 分钟
**难度等级**：⭐ 入门
**前置知识**：无需编程基础

> 💡 **提示**：遇到问题？查看 `openclaw health` 输出，或访问官方文档获取帮助。


---

## 📚 相关内容

- [什么是 OpenClaw](/tutorials/00-introduction)
- [安装指南](/tutorials/02-installation)
- [配置第一个频道](/tutorials/102-configure-first-channel)
- [核心概念](/tutorials/103-core-concepts)
- [故障排查](/tutorials/201-troubleshooting-guide)
