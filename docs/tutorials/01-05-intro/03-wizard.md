# 运行向导配置 - 10 分钟完成初始设置

**教程编号**: 03  
**优先级**: P0  
**预估阅读时间**: 15 分钟  
**目标读者**: 已完成安装，需要初始配置

---

## 3.1 向导模式介绍

### QuickStart vs Advanced 模式对比

运行 `openclaw onboard` 时，你会看到两个选项：

```
OpenClaw Onboarding Wizard
===========================

Choose setup mode:

  ❯ QuickStart (Recommended) - Complete setup in 5 minutes with sensible defaults
    Advanced (Full Control) - Configure every option manually
```

**QuickStart 模式**：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| 网关类型 | Local（本地） | 运行在本机 |
| 工作空间 | `~/.openclaw/workspace` | 默认位置 |
| 网关端口 | 18789 | 标准端口 |
| 认证方式 | Token | 自动生成令牌 |
| 工具策略 | `coding` | 允许常用开发命令 |
| 会话隔离 | `per-channel-peer` | 按渠道 + 用户隔离 |
| Tailscale 暴露 | Off | 仅本地访问 |
| 渠道策略 | Allowlist | 需要手动批准用户 |

**适合人群**：
- ✅ 第一次使用 OpenClaw
- ✅ 个人用户
- ✅ 快速体验功能
- ✅ 不需要特殊配置

**Advanced 模式**：

暴露所有配置选项：
- 自定义网关端口和绑定地址
- 选择认证模式（Token/Password/None）
- 配置远程网关连接
- 精细控制工具权限
- 自定义会话作用域
- 配置 Tailscale 远程访问
- 选择要安装的渠道

**适合人群**：
- ✅ 有经验的用户
- ✅ 企业部署
- ✅ 需要自定义配置
- ✅ 多实例部署

### 向导会配置什么？

运行向导后，OpenClaw 会自动完成以下配置：

```
1. 模型和认证 → 选择 AI 提供商，配置 API Key
2. 工作空间   → 创建 Agent 工作目录
3. 网关设置   → 配置端口、认证、绑定地址
4. 渠道配置   → 选择并配置聊天渠道
5. 守护进程   → 安装开机自启动服务
6. 健康检查   → 启动网关并验证
7. 技能安装   → 安装推荐的扩展技能
```

**生成的配置文件**：

```json
// ~/.openclaw/openclaw.json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "model": {
        "primary": "anthropic/claude-sonnet-4-5"
      }
    }
  },
  "gateway": {
    "port": 18789,
    "bind": "127.0.0.1",
    "auth": {
      "mode": "token",
      "token": "auto-generated-token-xyz"
    }
  },
  "session": {
    "dmScope": "per-channel-peer"
  },
  "tools": {
    "profile": "coding"
  }
}
```

### 何时使用向导 vs 手动配置？

**使用向导**：
- ✅ 第一次安装 OpenClaw
- ✅ 快速搭建可用环境
- ✅ 不确定如何配置
- ✅ 需要标准配置

**手动配置**：
- ✅ 已有配置文件，只需微调
- ✅ 需要非标准配置
- ✅ 自动化部署（脚本）
- ✅ 多实例管理

**手动配置命令**：

```bash
# 重新运行向导（不覆盖现有配置）
openclaw configure

# 配置特定部分
openclaw configure --section model      # 只配置模型
openclaw configure --section gateway    # 只配置网关
openclaw configure --section channels   # 只配置渠道
openclaw configure --section web        # 只配置网络搜索

# 添加新 Agent
openclaw agents add work
```

---

## 3.2 运行向导

### 启动命令

```bash
openclaw onboard
```

**带参数的命令**：

```bash
# 自动安装守护进程（开机自启动）
openclaw onboard --install-daemon

# 非交互模式（脚本使用）
openclaw onboard --non-interactive

# 重置现有配置
openclaw onboard --reset

# 指定重置范围
openclaw onboard --reset-scope full  # 包括工作空间
openclaw onboard --reset-scope config  # 仅配置
```

### 交互式界面 Walkthrough

运行向导后，你会看到以下界面：

```
╔═══════════════════════════════════════════════════════════╗
║           OpenClaw Onboarding Wizard                      ║
║           AI Gateway for Everyone                         ║
╚═══════════════════════════════════════════════════════════╝

Welcome! This wizard will help you set up OpenClaw.

? Choose setup mode: (Use arrow keys)
  ❯ QuickStart (Recommended)
    Advanced (Full Control)
```

**步骤 1：选择模式**

```
? Choose setup mode: QuickStart (Recommended)

✓ Setup mode: QuickStart
```

**步骤 2：选择 AI 提供商**

```
? Choose your AI provider: (Use arrow keys)
  ❯ Anthropic (Claude)
    OpenAI (GPT-4)
    Google (Gemini)
    Custom (OpenAI-compatible)
    Skip for now (configure later)
```

**步骤 3：输入 API Key**

```
? Enter your Anthropic API Key:
  [输入或粘贴 API Key]

✓ API Key validated successfully
```

**步骤 4：选择默认模型**

```
? Choose default model: (Use arrow keys)
  ❯ claude-sonnet-4-5 (Balanced performance and cost)
    claude-opus (Best performance, higher cost)
    claude-haiku (Fast and cheap)
```

**步骤 5：配置网关**

```
? Gateway port: (18789)
  [直接回车使用默认值]

✓ Gateway configured: port 18789, bind 127.0.0.1
```

**步骤 6：选择渠道**

```
? Configure channels? (Y/n)
  Y

? Which channels to configure? (Press space to select)
  ❯ ◉ Telegram
    ◉ WhatsApp
    ◯ Discord
    ◯ Slack
    ◯ Skip for now
```

**步骤 7：安装守护进程**

```
? Install daemon for auto-start? (Y/n)
  Y

✓ Daemon installed (launchctl)
✓ Gateway will start automatically on login
```

**步骤 8：健康检查**

```
Starting gateway...
✓ Gateway started on http://127.0.0.1:18789

Running health check...
✓ All systems operational
```

**步骤 9：完成**

```
╔═══════════════════════════════════════════════════════════╗
║              Setup Complete! 🎉                           ║
╚═══════════════════════════════════════════════════════════╝

Your OpenClaw instance is ready to use!

Next steps:
  • Run 'openclaw dashboard' to open the web UI
  • Run 'openclaw channels login telegram' to connect Telegram
  • Run 'openclaw pairing list' to see pending pairings

Documentation: https://docs.openclaw.ai
```

### 每个步骤的详细解释

#### 步骤 2：AI 提供商选择

**Anthropic (Claude)**：
- 优势：代码能力强，推理优秀，上下文理解好
- 适合：开发、写作、分析
- 价格：中等

**OpenAI (GPT-4)**：
- 优势：通用能力强，生态丰富
- 适合：通用任务、创意写作
- 价格：较高

**Google (Gemini)**：
- 优势：多模态能力强，免费额度
- 适合：图像理解、研究
- 价格：较低

**Custom (OpenAI-compatible)**：
- 优势：可使用本地模型（Ollama、vLLM）
- 适合：隐私敏感、成本敏感
- 价格：取决于提供商

#### 步骤 6：渠道选择

**Telegram**（推荐新手）：
- 免费、开源、隐私友好
- Bot API 简单
- 支持群组、频道

**WhatsApp**：
- 用户基数大
- 需要 WhatsApp Business API
- 配置稍复杂

**Discord**：
- 社区活跃
- 支持 Slash Commands
- 适合技术社区

#### 步骤 7：守护进程

**macOS**：使用 LaunchAgent
```bash
# 安装位置
~/Library/LaunchAgents/ai.openclaw.gateway.plist

# 管理命令
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

**Linux**：使用 systemd
```bash
# 安装位置
~/.config/systemd/user/openclaw-gateway.service

# 管理命令
systemctl --user start openclaw-gateway
systemctl --user stop openclaw-gateway
systemctl --user enable openclaw-gateway
```

### 跳过某些步骤的方法

**跳过渠道配置**：
```bash
openclaw onboard --skip-channels
```

**跳过守护进程安装**：
```bash
openclaw onboard --no-daemon
```

**仅配置模型**：
```bash
openclaw configure --section model
```

**非交互式配置（脚本）**：
```bash
openclaw onboard \
  --non-interactive \
  --model anthropic/claude-sonnet-4-5 \
  --api-key $ANTHROPIC_API_KEY \
  --gateway-port 18789 \
  --install-daemon
```

---

## 3.3 模型和认证配置

### 选择 AI 提供商

向导会列出所有支持的提供商：

```
? Choose your AI provider:
  ❯ Anthropic (Claude)
    OpenAI (GPT-4, GPT-4o, GPT-4o-mini)
    Google (Gemini Pro, Gemini Ultra)
    xAI (Grok)
    Custom Provider (OpenAI-compatible)
```

**各提供商特点**：

| 提供商 | 推荐模型 | 优势 | 价格 |
|--------|----------|------|------|
| Anthropic | claude-sonnet-4-5 | 代码、推理、长文本 | 中 |
| OpenAI | gpt-4o | 通用、创意、多模态 | 高 |
| Google | gemini-pro | 多模态、研究 | 低 |
| xAI | grok-beta | 实时信息、幽默 | 中 |

### API Key 配置方式

#### 方式 1：直接输入（推荐新手）

```
? Enter your Anthropic API Key:
  [输入 sk-ant-...]

✓ API Key validated successfully
✓ Saved to: ~/.openclaw/auth-profiles.json
```

**优点**：
- 简单直接
- 向导自动验证
- 适合个人使用

**缺点**：
- Key 明文存储在配置文件中
- 不适合共享配置

#### 方式 2：环境变量引用（推荐生产）

```
? Enter your Anthropic API Key:
  [输入 $ANTHROPIC_API_KEY]

✓ Using environment variable: ANTHROPIC_API_KEY
```

**配置文件内容**：
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "auth": {
          "apiKey": {
            "$env": "ANTHROPIC_API_KEY"
          }
        }
      }
    }
  }
}
```

**设置环境变量**：
```bash
# ~/.bashrc 或 ~/.zshrc
export ANTHROPIC_API_KEY=sk-ant-...

# 生效
source ~/.bashrc
```

**优点**：
- Key 不存储在配置文件
- 适合版本控制配置
- 符合安全最佳实践

**缺点**：
- 需要额外配置环境变量
- 多机器部署需同步环境变量

#### 方式 3：SecretRef 安全存储（高级）

```
? Choose API Key storage method:
  ❯ Plaintext (stored in config)
    SecretRef (encrypted storage)
    Environment Variable
```

**选择 SecretRef 后**：
```
? SecretRef type:
  ❯ file (encrypted file)
    exec (command to fetch)
    env (environment variable)
```

**配置文件内容**：
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "auth": {
          "apiKey": {
            "$secretRef": {
              "type": "file",
              "path": "~/.openclaw/secrets/anthropic.key"
            }
          }
        }
      }
    }
  }
}
```

**创建加密文件**：
```bash
echo "sk-ant-..." > ~/.openclaw/secrets/anthropic.key
chmod 600 ~/.openclaw/secrets/anthropic.key
```

**优点**：
- 最高安全性
- 支持多种后端（文件、命令、环境）
- 适合企业部署

**缺点**：
- 配置复杂
- 需要管理额外的密钥文件

### 选择默认模型

选择提供商后，向导会列出可用模型：

```
? Choose default model: (Use arrow keys)
  ❯ claude-sonnet-4-5 (Balanced performance and cost)
    claude-opus (Best performance, higher cost)
    claude-haiku (Fast and cheap, simple tasks)
```

**模型推荐**：

| 使用场景 | 推荐模型 | 说明 |
|----------|----------|------|
| 日常使用 | claude-sonnet-4-5 | 性能和成本平衡 |
| 复杂任务 | claude-opus | 最强推理能力 |
| 简单问答 | claude-haiku | 快速、便宜 |
| 代码开发 | claude-sonnet-4-5 | 代码理解优秀 |
| 长文档分析 | claude-sonnet-4-5 | 200K 上下文 |

### 配置备用模型（Failover）

向导会询问是否配置备用模型：

```
? Configure fallback model? (y/N)
  y

? Choose fallback provider:
  ❯ OpenAI
    Google
    Skip
```

**配置文件内容**：
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": [
          "openai/gpt-4o",
          "google/gemini-pro"
        ]
      }
    }
  }
}
```

**故障转移逻辑**：
1. 首先尝试 primary 模型
2. 如果失败（认证错误、超时、速率限制），尝试第一个 fallback
3. 如果继续失败，尝试下一个 fallback
4. 所有模型都失败，返回错误

**配置备用模型的场景**：
- ✅ 生产环境，需要高可用
- ✅ 依赖单一提供商有风险
- ✅ 成本优化（便宜模型作为 fallback）
- ✅ 地理限制（某些地区无法访问特定 API）

---

## 3.4 网关配置

### 端口设置

```
? Gateway port: (18789)
  [输入端口号或直接回车]
```

**推荐配置**：

| 场景 | 端口 | 说明 |
|------|------|------|
| 默认 | 18789 | OpenClaw 标准端口 |
| 开发 | 18790 | 避免与生产冲突 |
| 多实例 | 18789, 18790, 18791 | 每个实例不同端口 |

**端口冲突处理**：

```bash
# 检查端口是否被占用
lsof -i :18789

# 如果被占用，选择其他端口
# 或停止占用端口的服务
kill <PID>
```

### 绑定地址

```
? Bind address:
  ❯ 127.0.0.1 (Local only)
    0.0.0.0 (All interfaces)
    Custom
```

**127.0.0.1（推荐）**：
- 仅本机可访问
- 最安全
- 适合个人使用

**0.0.0.0**：
- 所有网络接口可访问
- 局域网内其他设备可连接
- 需要防火墙配置

**Custom（自定义）**：
- 指定特定 IP
- 适合多网卡服务器
- 企业部署场景

**配置文件内容**：
```json
{
  "gateway": {
    "port": 18789,
    "bind": "127.0.0.1"
  }
}
```

### 认证模式

```
? Authentication mode:
  ❯ Token (API token)
    Password (Username/Password)
    None (No authentication, insecure)
```

#### Token 认证（推荐）

```
? Generate new token or use existing?
  ❯ Generate new token
    Use existing token

✓ Token generated: oc_token_abc123xyz
✓ Saved to: ~/.openclaw/openclaw.json
```

**配置文件内容**：
```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "oc_token_abc123xyz"
    }
  }
}
```

**使用 Token**：
```bash
# API 调用
curl -H "Authorization: Bearer oc_token_abc123xyz" \
  http://127.0.0.1:18789/api/status

# CLI 自动使用配置文件中的 token
openclaw gateway status
```

#### Password 认证

```
? Enter username: admin
? Enter password: [隐藏输入]
```

**配置文件内容**：
```json
{
  "gateway": {
    "auth": {
      "mode": "password",
      "username": "admin",
      "passwordHash": "$2b$12$..."  // 密码已哈希
    }
  }
}
```

#### 无认证（不推荐）

```
⚠️  Warning: No authentication means anyone with network access
   can control your OpenClaw instance. Only use in isolated
   test environments.

? Continue without authentication? (y/N)
```

**配置文件内容**：
```json
{
  "gateway": {
    "auth": {
      "mode": "none"
    }
  }
}
```

### Tailscale 暴露选项

```
? Expose gateway via Tailscale? (y/N)
  y

✓ Tailscale configured
✓ Access your gateway at: https://your-hostname.tailnet.ts.net:18789
```

**什么是 Tailscale？**

Tailscale 是一个零配置的 VPN 服务，可以：
- 安全地暴露服务到互联网
- 无需配置防火墙
- 自动 HTTPS 加密
- 基于身份的访问控制

**配置前提**：
- 已安装 Tailscale
- 已登录 Tailscale 账号

**安装 Tailscale**：
```bash
# macOS
brew install tailscale

# Linux
curl -fsSL https://tailscale.com/install.sh | sh

# 登录
tailscale up
```

**适用场景**：
- ✅ 远程访问家庭 OpenClaw
- ✅ 多设备协同
- ✅ 安全地共享给团队成员
- ❌ 不需要远程访问（本地使用即可）

---

## 3.5 渠道配置

### 选择要连接的渠道

```
? Configure channels? (Y/n)
  Y

? Which channels to configure? (Press space to select)
  ❯ ◉ Telegram
    ◉ WhatsApp
    ◯ Discord
    ◯ Slack
    ◯ Google Chat
    ◯ Mattermost
    ◯ Signal
    ◯ BlueBubbles (iMessage)
    ◯ Skip for now
```

**推荐新手选择**：
- ✅ Telegram（最简单）
- ✅ WhatsApp（最常用）
- ⚠️ Discord（需要配置权限）
- ⚠️ iMessage（需要 macOS + 额外配置）

### Telegram 快速配置示例

```
? Configure Telegram? (Y/n)
  Y

ℹ️  To configure Telegram, you need a Bot Token.

Steps:
1. Open Telegram and search for @BotFather
2. Send /newbot command
3. Follow the instructions to create a bot
4. Copy the Bot Token

? Enter your Telegram Bot Token:
  [输入 123:abc-xyz...]

✓ Bot token validated
✓ Bot name: MyOpenClawBot
✓ Bot username: @MyOpenClawBot
```

**配置文件内容**：
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123:abc-xyz...",
      "dmPolicy": "pairing"
    }
  }
}
```

**详细配置教程**：参考 [教程 04: 连接第一个聊天渠道](./04-telegram.md)

### WhatsApp 配置要点

```
? Configure WhatsApp? (Y/n)
  Y

ℹ️  WhatsApp requires WhatsApp Business API.

Options:
1. Use Meta Cloud API (recommended)
2. Use third-party provider (Twilio, etc.)
3. Skip for now

? Choose option: 1

? Enter your Meta Business Account ID:
  [输入]

? Enter your WhatsApp Phone Number ID:
  [输入]

? Enter your WhatsApp API Token:
  [输入]
```

**配置文件内容**：
```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "provider": "meta-cloud",
      "businessAccountId": "123456",
      "phoneNumberId": "789012",
      "apiToken": "EAA...",
      "dmPolicy": "pairing"
    }
  }
}
```

**注意**：WhatsApp 配置较复杂，建议新手先配置 Telegram，后续再添加 WhatsApp。

### 稍后配置也可以

如果选择"Skip for now"：

```
✓ Channel configuration skipped

You can configure channels later:
  openclaw channels add telegram
  openclaw channels add whatsapp
  openclaw configure --section channels
```

**控制面板配置**：
```bash
# 打开控制面板
openclaw dashboard

# 在 Web 界面中配置渠道
# 导航到：Settings → Channels → Add Channel
```

---

## 3.6 守护进程安装

### LaunchAgent（macOS）

**安装过程**：

```
? Install daemon for auto-start? (Y/n)
  Y

✓ Creating LaunchAgent plist...
✓ Installed to: ~/Library/LaunchAgents/ai.openclaw.gateway.plist
✓ Loaded daemon
✓ Gateway will start automatically on login
```

**生成的 plist 文件**：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>ai.openclaw.gateway</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/openclaw</string>
    <string>gateway</string>
    <string>--daemon</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>~/Library/Logs/openclaw-gateway.log</string>
  <key>StandardErrorPath</key>
  <string>~/Library/Logs/openclaw-gateway-error.log</string>
</dict>
</plist>
```

**管理命令**：
```bash
# 查看状态
launchctl list | grep openclaw

# 停止
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist

# 启动
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist

# 重启
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

### systemd（Linux/WSL2）

**安装过程**：

```
? Install daemon for auto-start? (Y/n)
  Y

✓ Creating systemd user service...
✓ Installed to: ~/.config/systemd/user/openclaw-gateway.service
✓ Enabled service
✓ Started service
```

**生成的 service 文件**：
```ini
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/openclaw gateway --daemon
Restart=on-failure
RestartSec=5
Environment=PATH=/usr/local/bin:/usr/bin:/bin
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
```

**管理命令**：
```bash
# 查看状态
systemctl --user status openclaw-gateway

# 停止
systemctl --user stop openclaw-gateway

# 启动
systemctl --user start openclaw-gateway

# 重启
systemctl --user restart openclaw-gateway

# 开机自启
systemctl --user enable openclaw-gateway

# 查看日志
journalctl --user -u openclaw-gateway -f
```

### 开机自启动

**验证自启动配置**：

```bash
# macOS
launchctl list | grep openclaw
# 应该看到：ai.openclaw.gateway

# Linux
systemctl --user is-enabled openclaw-gateway
# 应该输出：enabled
```

**测试自启动**：
```bash
# 重启电脑
sudo reboot

# 重启后检查网关状态
openclaw gateway status
# 应该显示：running
```

### 后台运行验证

**检查网关是否运行**：

```bash
# 方法 1：CLI 命令
openclaw gateway status

# 输出示例：
# Gateway Status: running
# PID: 12345
# Port: 18789
# Bind: 127.0.0.1
# Uptime: 2h 35m

# 方法 2：进程检查
ps aux | grep openclaw

# 方法 3：端口检查
lsof -i :18789

# 方法 4：HTTP 请求
curl http://127.0.0.1:18789/api/status
```

**查看日志**：

```bash
# macOS
tail -f ~/Library/Logs/openclaw-gateway.log

# Linux
journalctl --user -u openclaw-gateway -f

# 通用（CLI）
openclaw logs --follow
```

---

## 小结

### 配置检查清单

- [ ] 已运行 `openclaw onboard`
- [ ] 已选择 AI 提供商并配置 API Key
- [ ] 已选择默认模型
- [ ] 已配置网关端口和认证
- [ ] 已选择至少一个渠道（或计划稍后配置）
- [ ] 已安装守护进程（可选但推荐）
- [ ] 网关正在运行（`openclaw gateway status`）
- [ ] 可以访问控制面板（`openclaw dashboard`）

### 配置文件位置

```
~/.openclaw/
├── openclaw.json           # 主配置
├── auth-profiles.json      # 认证信息
└── agents/
    └── main/
        └── agent/
            └── ...         # Agent 配置
```

### 下一步

配置完成后，连接第一个聊天渠道体验消息交互：

**阅读下一篇**：[教程 04: 连接第一个聊天渠道 - Telegram 实战](./04-telegram.md)

---

## 配图建议

### 图 1：向导界面截图集合

**内容**：
- 截图 1：模式选择界面（QuickStart vs Advanced）
- 截图 2：AI 提供商选择界面
- 截图 3：API Key 输入界面
- 截图 4：渠道选择界面
- 截图 5：完成界面

**用途**：3.2 节，展示实际向导界面

### 图 2：配置选项对比表

**内容**：
- 表格对比 QuickStart 和 Advanced 的默认配置
- 用颜色标注推荐选项

**用途**：3.1 节，帮助理解两种模式

### 图 3：认证流程图

**内容**：
```
用户请求 → 网关检查认证 → Token 验证 → 允许/拒绝
                     ↓
               检查 auth-profiles.json
                     ↓
               验证 API Key 有效性
```

**用途**：3.4 节，解释认证机制

### 图 4：守护进程架构图

**内容**：
- macOS: LaunchAgent 架构图
- Linux: systemd 服务架构图
- 标注配置文件位置和日志路径

**用途**：3.6 节，解释守护进程

---

## 代码示例汇总

### 1. 运行向导
```bash
openclaw onboard
```

### 2. 带参数运行
```bash
openclaw onboard --install-daemon
openclaw onboard --reset
openclaw onboard --skip-channels
```

### 3. 配置特定部分
```bash
openclaw configure --section model
openclaw configure --section gateway
openclaw configure --section channels
```

### 4. 添加 Agent
```bash
openclaw agents add work
openclaw agents add personal
```

### 5. 环境变量配置
```bash
export ANTHROPIC_API_KEY=sk-ant-...
echo 'export ANTHROPIC_API_KEY=sk-ant-...' >> ~/.bashrc
```

### 6. macOS 守护进程管理
```bash
launchctl list | grep openclaw
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

### 7. Linux 守护进程管理
```bash
systemctl --user status openclaw-gateway
systemctl --user start openclaw-gateway
systemctl --user enable openclaw-gateway
journalctl --user -u openclaw-gateway -f
```

### 8. 验证网关运行
```bash
openclaw gateway status
ps aux | grep openclaw
lsof -i :18789
curl http://127.0.0.1:18789/api/status
```

### 9. 非交互式配置（脚本）
```bash
openclaw onboard \
  --non-interactive \
  --model anthropic/claude-sonnet-4-5 \
  --api-key $ANTHROPIC_API_KEY \
  --gateway-port 18789 \
  --install-daemon
```

### 10. 配置文件示例
```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["openai/gpt-4o"]
      }
    }
  },
  "gateway": {
    "port": 18789,
    "bind": "127.0.0.1",
    "auth": {
      "mode": "token",
      "token": "oc_token_abc123"
    }
  },
  "session": {
    "dmScope": "per-channel-peer"
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123:abc-xyz",
      "dmPolicy": "pairing"
    }
  }
}
```

---

**字数统计**: 约 6,100 字  
**完成时间**: 2026-03-14  
**作者**: OpenClaw 文档团队  
**审阅状态**: 初稿
