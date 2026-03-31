---
title: getting started
description: getting started 页面
---
---

# ⚡ 3 分钟快速开始

**从零到运行，只需 3 分钟！**

---

## 📋 前置要求

开始前，请确保你的电脑已安装：

- ✅ **Node.js** (v18 或更高版本)
- ✅ **npm** (随 Node.js 自动安装)
- ✅ **一个聊天账号** (微信/飞书/Telegram 等，可选)

**检查 Node.js 版本**:
```bash
node --version
# 应显示 v18.x.x 或更高
```

<details>
<summary>📥 还没有安装 Node.js？</summary>

**macOS**:
```bash
# 使用 Homebrew（推荐）
brew install node@20

# 或从官网下载
# https://nodejs.org/
```

**Windows**:
- 访问 https://nodejs.org/
- 下载 LTS 版本
- 运行安装程序

**Linux**:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
```

</details>

---

## 🎯 第一步：安装 OpenClaw

打开终端，运行：

```bash
npm install -g openclaw
```

**安装成功标志**:
```
✅ OpenClaw 安装完成！
版本：2026.3.x
位置：/usr/local/bin/openclaw
```

<details>
<summary>⚠️ 遇到权限错误？</summary>

**macOS/Linux**:
```bash
# 使用 sudo 安装
sudo npm install -g openclaw
```

**Windows**:
- 以管理员身份运行 PowerShell
- 再执行安装命令

**或使用 nvm（推荐）**:
```bash
# 使用 nvm 管理 Node.js 版本
nvm use 20
npm install -g openclaw
```

</details>

---

## 🎯 第二步：运行初始化向导

```bash
openclaw onboard
```

向导会带你完成：

1. **选择模型提供商**
   - 阿里云百炼（推荐，国内速度快）
   - OpenAI
   - 其他提供商

2. **输入 API Key**
   - 按照提示输入你的 API Key
   - 密钥会安全保存在本地

3. **选择聊天渠道**
   - 飞书（推荐，企业用户）
   - 微信
   - Telegram
   - WhatsApp
   - 跳过（稍后配置）

4. **配置第一个 Agent**
   - 选择默认模型
   - 设置工作空间

**完成!** 🎉

<details>
<summary>💡 还没有 API Key？</summary>

**阿里云百炼**（推荐）:
1. 访问 https://dashscope.console.aliyun.com/
2. 注册/登录阿里云账号
3. 开通 DashScope 服务
4. 创建 API Key
5. 复制 Key 到向导

**OpenAI**:
1. 访问 https://platform.openai.com/
2. 注册/登录账号
3. 创建 API Key
4. 复制 Key 到向导

**其他提供商**:
- 查看 [模型配置指南](/tutorials/03-configuration)

</details>

---

## 🎯 第三步：启动 Gateway

```bash
openclaw gateway start
```

**启动成功标志**:
```
✅ Gateway 已启动
监听端口：18800
访问：http://localhost:18800
```

**查看状态**:
```bash
openclaw gateway status
```

**查看日志**:
```bash
openclaw gateway logs
```

---

## 🎯 第四步：连接聊天渠道

### 选项 A：飞书（推荐）

1. **创建飞书应用**
   - 访问 https://open.feishu.cn/
   - 登录飞书管理后台
   - 创建企业自建应用

2. **配置应用权限**
   - 添加机器人权限
   - 添加消息发送权限
   - 添加事件订阅权限

3. **获取凭证**
   - App ID
   - App Secret

4. **在 OpenClaw 配置**
   ```bash
   openclaw channels feishu add
   ```

5. **发布应用到飞书**
   - 在飞书管理后台发布应用
   - 扫码测试

**完成!** 现在可以在飞书里和你的 AI 助手对话了！

<details>
<summary>📖 查看详细飞书配置教程</summary>

[飞书完整配置指南](/guide/configuration#feishu)

</details>

### 选项 B：其他渠道

- **微信**: [微信配置指南](/channels/wechat)
- **Telegram**: [Telegram 配置指南](/channels/telegram)
- **WhatsApp**: [WhatsApp 配置指南](/channels/whatsapp)
- **Discord**: [Discord 配置指南](/channels/discord)

---

## ✅ 验证安装

运行健康检查：

```bash
openclaw health
```

**预期输出**:
```
✅ Gateway: 运行中
✅ 模型配置：正常
✅ 渠道配置：正常
✅ 工作空间：正常
```

---

## 🎓 下一步

恭喜你完成安装！现在可以：

### 📖 学习更多

1. [什么是 OpenClaw？](/tutorials/00-introduction) - 了解核心概念
2. [配置指南](/tutorials/03-configuration) - 深入配置选项
3. [多 Agent 协作](/guide/introduction) - 配置多个专业 Agent
4. [技能市场](/skills/) - 从 ClawHub 安装技能

### 🛠️ 动手实践

- **创建第一个 Agent**: 配置你的工作助手
- **安装技能**: 从 ClawHub 安装实用技能
- **连接更多渠道**: 让 Agent 在多个平台服务

### 💬 获取帮助

- [常见问题](/about) - 查看 FAQ
- [GitHub Issues](https://github.com/openclaw/openclaw/issues) - 提交问题
- [Discord 社区](https://discord.gg/clawd) - 加入讨论
- [官方文档](https://docs.openclaw.ai) - 英文文档

---

## ⚡ 快速命令参考

```bash
# 安装
npm install -g openclaw

# 初始化向导
openclaw onboard

# 启动服务
openclaw gateway start

# 查看状态
openclaw gateway status

# 查看日志
openclaw gateway logs

# 健康检查
openclaw health

# 打开控制面板
openclaw dashboard

# 停止服务
openclaw gateway stop

# 重启服务
openclaw gateway restart
```

---

## 🆘 遇到问题？

### 常见问题

**Q: 安装时提示权限错误？**  
A: 使用 `sudo npm install -g openclaw` 或使用 nvm 管理 Node.js

**Q: Gateway 启动失败？**  
A: 检查端口 18800 是否被占用，或查看日志 `openclaw gateway logs`

**Q: API Key 无效？**  
A: 确认 API Key 复制正确，没有多余空格

**Q: 飞书机器人不响应？**  
A: 检查应用权限是否完整，确认已发布应用

### 获取更多帮助

- 查看 [故障排除指南](/about#troubleshooting)
- 提交 [GitHub Issue](https://github.com/openclaw/openclaw/issues)
- 加入 [Discord 社区](https://discord.gg/clawd)

---

**准备好了吗？** [开始配置你的第一个 Agent →](/tutorials/03-configuration)

---

**最后更新**: 2026-03-22  
**预计时间**: 3-5 分钟
