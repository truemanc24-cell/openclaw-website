# 连接第一个聊天渠道 - Telegram 实战

**教程编号**: 04  
**优先级**: P0  
**预估阅读时间**: 12 分钟  
**目标读者**: 想快速体验消息交互

---

## 4.1 渠道概述

### 支持的渠道列表

OpenClaw 支持多种聊天渠道，每种渠道有其特点和适用场景。

| 渠道 | 类型 | 配置难度 | 推荐度 | 适用场景 |
|------|------|----------|--------|----------|
| **Telegram** | 即时通讯 | ⭐ | ⭐⭐⭐⭐⭐ | 个人使用、技术社区 |
| **WhatsApp** | 即时通讯 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 日常沟通、商务 |
| **Discord** | 社区聊天 | ⭐⭐ | ⭐⭐⭐⭐ | 技术社区、游戏 |
| **Slack** | 团队协作 | ⭐⭐ | ⭐⭐⭐ | 工作团队 |
| **iMessage** | 苹果短信 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 苹果生态用户 |
| **微信** | 即时通讯 | ⭐⭐⭐⭐⭐ | ⭐⭐ | 中国大陆用户 |
| **Signal** | 加密通讯 | ⭐⭐⭐ | ⭐⭐⭐ | 隐私敏感用户 |
| **Google Chat** | 团队协作 | ⭐⭐ | ⭐⭐⭐ | GSuite 用户 |

### 各渠道特点对比

#### Telegram（推荐新手）

**优势**：
- ✅ 完全免费
- ✅ Bot API 简单易用
- ✅ 开源客户端
- ✅ 隐私友好
- ✅ 支持群组、频道、机器人
- ✅ 跨平台（iOS/Android/Desktop/Web）

**劣势**：
- ❌ 中国大陆需要特殊网络
- ❌ 部分地区用户较少

**配置时间**：5-10 分钟

#### WhatsApp

**优势**：
- ✅ 用户基数大（20 亿+）
- ✅ 大多数人已安装
- ✅ 支持端到端加密

**劣势**：
- ❌ 需要 WhatsApp Business API
- ❌ 配置较复杂
- ❌ 有消息模板限制
- ❌ 按会话收费（Business API）

**配置时间**：20-30 分钟

#### Discord

**优势**：
- ✅ 社区活跃
- ✅ 支持 Slash Commands
- ✅ 丰富的权限管理
- ✅ 免费

**劣势**：
- ❌ 主要面向游戏/技术社区
- ❌ 配置权限较复杂
- ❌ 不适合一对一聊天

**配置时间**：10-15 分钟

### 推荐新手从 Telegram 开始

**原因**：
1. **配置最简单**：只需创建一个 Bot，获取 Token
2. **完全免费**：无使用限制，无费用
3. **功能完整**：支持文字、图片、文件、语音
4. **文档完善**：Telegram Bot API 文档详细
5. **快速验证**：5 分钟内完成配置并开始聊天

**本教程将详细讲解**：
- 创建 Telegram Bot
- 配置 OpenClaw 连接
- 配对流程详解
- 发送第一条消息
- 群组配置

---

## 4.2 创建 Telegram Bot

### 联系 @BotFather

**步骤 1：打开 Telegram**

在你的手机或电脑上打开 Telegram 应用。

**步骤 2：搜索 @BotFather**

在搜索框中输入 `@BotFather`，找到官方机器人（有蓝色认证标记）。

```
搜索结果：
✅ BotFather [@BotFather] - 官方机器人
❌ Bot Father [@bot_father_bot] - 山寨机器人（不要选）
```

**步骤 3：启动对话**

点击 @BotFather，然后点击"Start"或发送 `/start` 命令。

### /newbot 命令详解

**步骤 4：发送创建命令**

```
你：/newbot

BotFather: Alright, a new bot. How are we going to call it?
Please choose a name for your bot.
```

**步骤 5：设置 Bot 名称**

```
你：MyOpenClawBot

BotFather: Good. Now let's choose a username for your bot.
It must end in 'bot'. Like this, for example: TetrisBot or tetris_bot.
```

**名称 vs 用户名的区别**：

| 属性 | 名称（Name） | 用户名（Username） |
|------|-------------|-------------------|
| **用途** | 显示名称 | 唯一标识、@提及 |
| **格式** | 任意文本 | 必须以 `bot` 结尾 |
| **唯一性** | 可重复 | 全局唯一 |
| **可修改** | ✅ 是 | ❌ 否 |
| **示例** | MyOpenClawBot | @MyOpenClawBot |

**步骤 6：设置 Bot 用户名**

```
你：MyOpenClawBot

BotFather: Done! Congratulations on your new bot.
You will find it at t.me/MyOpenClawBot

You can now add a description, about section and profile photo for your bot,
see /help for a list of commands.

Use this token to access the HTTP API:
123456789:ABCdefGHIjklMNOpqrsTUVwxyz

For a description of the Bot API, see this page:
https://core.telegram.org/bots/api
```

### 保存 Bot Token（安全提示）

**重要**：立即复制并保存 Bot Token！

```
Token: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

**安全提示**：

| ⚠️ 注意事项 | 说明 |
|------------|------|
| **不要分享** | Token 相当于密码，不要发给任何人 |
| **不要上传** | 不要上传到 GitHub、公开论坛 |
| **立即保存** | 复制到密码管理器或安全位置 |
| **泄露处理** | 如果泄露，立即在 @BotFather 处撤销并重新生成 |

**保存方法**：

```bash
# 方法 1：环境变量（推荐）
echo 'export TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz' >> ~/.bashrc
source ~/.bashrc

# 方法 2：密码管理器
# 保存到 1Password、Bitwarden 等

# 方法 3：加密文件
echo "123456789:ABCdefGHIjklMNOpqrsTUVwxyz" > ~/.openclaw/secrets/telegram.token
chmod 600 ~/.openclaw/secrets/telegram.token
```

**撤销和重新生成 Token**：

如果 Token 泄露，在 @BotFather 中执行：

```
你：/revoke

BotFather: Select the bot to revoke the token for:
1. MyOpenClawBot

你：1

BotFather: Token revoked. Here's your new token:
987654321:ZYXwvuTSRqpoNMLKjihGFEDcba

⚠️ 旧 Token 立即失效，请更新配置！
```

### 测试 Bot

**步骤 7：找到你的 Bot**

在 Telegram 搜索框中输入你的 Bot 用户名（例如 `@MyOpenClawBot`）。

**步骤 8：启动 Bot**

点击"Start"或发送 `/start` 命令。

```
你：/start

Bot: （无响应，因为还没有配置后端）
```

现在 Bot 已经创建，但还没有连接到 OpenClaw。下一步配置 OpenClaw。

---

## 4.3 配置 Telegram 渠道

### 配置文件编辑

**方法 1：使用 CLI 命令（推荐）**

```bash
openclaw channels add telegram
```

**交互式配置**：

```
? Enter your Telegram Bot Token:
  [粘贴 Token: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz]

✓ Token validated
✓ Bot name: MyOpenClawBot
✓ Bot username: @MyOpenClawBot

? DM Policy (who can message the bot):
  ❯ pairing (Users must be approved via pairing code)
    allowlist (Only approved users can message)
    open (Anyone can message, not recommended)

? Select: pairing
```

**方法 2：手动编辑配置文件**

```bash
# 打开配置文件
nano ~/.openclaw/openclaw.json
```

**添加 Telegram 配置**：

```json5
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
      "dmPolicy": "pairing",
      "allowFrom": [],
      "groupPolicy": "mention",
      "privacyMode": false
    }
  }
}
```

**方法 3：使用环境变量**

```bash
# 设置环境变量
export TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# 配置文件引用环境变量
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": {
        "$env": "TELEGRAM_BOT_TOKEN"
      },
      "dmPolicy": "pairing"
    }
  }
}
```

### 配置项详解

#### enabled（必需）

```json
"enabled": true
```

- `true`: 启用 Telegram 渠道
- `false`: 禁用（不删除配置）

#### botToken（必需）

```json
"botToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
```

- Telegram Bot API Token
- 从 @BotFather 获取
- 可以使用环境变量引用

#### dmPolicy（推荐配置）

```json
"dmPolicy": "pairing"
```

**可选值**：

| 值 | 说明 | 推荐场景 |
|----|------|----------|
| `pairing` | 需要配对码批准 | 个人使用（推荐） |
| `allowlist` | 仅允许指定用户 | 小团队、家庭 |
| `open` | 任何人可发消息 | 公开服务（不推荐） |
| `disabled` | 禁用私信 | 仅群组使用 |

#### allowFrom（配合 allowlist）

```json
"dmPolicy": "allowlist",
"allowFrom": [
  "tg:123456789",
  "tg:987654321"
]
```

- 允许的用户 Telegram ID 列表
- 格式：`tg:<user_id>`
- 如何获取用户 ID？见下文

**获取用户 Telegram ID**：

```bash
# 方法 1：使用 @userinfobot
# 在 Telegram 中搜索 @userinfobot，发送任意消息
# 它会返回你的 ID

# 方法 2：查看配对请求
openclaw pairing list telegram
# 输出中会显示用户 ID

# 方法 3：使用 API
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates"
```

#### groupPolicy（群组配置）

```json
"groupPolicy": "mention"
```

**可选值**：

| 值 | 说明 |
|----|------|
| `mention` | 只有被 @提及时才响应 |
| `all` | 响应所有消息（可能骚扰） |
| `disabled` | 不在群组中响应 |

#### privacyMode（高级）

```json
"privacyMode": false
```

- `false`: Bot 可以看到所有群组消息（需要 @BotFather 关闭 Privacy Mode）
- `true`: Bot 只能看到 @提及的消息

**在 @BotFather 中关闭 Privacy Mode**：

```
你：/setprivacy

BotFather: Choose a bot to change group privacy settings:
1. MyOpenClawBot

你：1

BotFather: Disable privacy mode?
1. Yes

你：1

BotFather: Success! The new privacy mode is enabled for your bot.
```

### 配置验证

**检查配置语法**：

```bash
openclaw doctor

# 输出示例：
# ✓ Configuration file is valid
# ✓ Telegram channel is configured
# ✓ Bot token is present
# ⚠ Gateway is not running
```

**测试 Bot 连接**：

```bash
openclaw channels test telegram

# 输出示例：
# ✓ Bot token is valid
# ✓ Bot name: MyOpenClawBot
# ✓ Bot username: @MyOpenClawBot
# ✓ Can send messages
```

**重启网关应用配置**：

```bash
# 重启网关
openclaw gateway restart

# 或热重载配置
openclaw gateway reload
```

---

## 4.4 配对流程

### 什么是配对（pairing）？

**配对是 OpenClaw 的安全机制**，用于控制谁可以使用你的 Bot。

**流程**：
```
1. 用户给 Bot 发送第一条消息
2. OpenClaw 生成配对码
3. 用户在待批准列表
4. 管理员批准配对
5. 用户可以正常使用
```

**为什么需要配对？**
- ✅ 防止陌生人滥用
- ✅ 控制访问权限
- ✅ 审计用户访问
- ✅ 可随时撤销访问

### 启动网关

**确保网关正在运行**：

```bash
openclaw gateway status

# 如果未运行，启动网关
openclaw gateway start

# 或前台运行（调试用）
openclaw gateway --port 18789
```

**输出示例**：
```
Gateway Status: running
PID: 12345
Port: 18789
Bind: 127.0.0.1
Auth: token
Uptime: 2h 35m
```

### 获取配对码

**步骤 1：用户给 Bot 发消息**

在 Telegram 中给你的 Bot 发送任意消息：

```
你：Hello
```

**步骤 2：查看配对请求**

```bash
openclaw pairing list telegram
```

**输出示例**：
```
Pending Pairing Requests (Telegram):
=====================================

[1] User: Trueman (@trueman)
    User ID: tg:123456789
    First Message: "Hello"
    Received: 2026-03-14 15:30:25
    Pairing Code: ABC123

[2] User: Alice (@alice)
    User ID: tg:987654321
    First Message: "Hi there"
    Received: 2026-03-14 15:32:10
    Pairing Code: XYZ789

Total: 2 pending
```

**配对码有效期**：
- 默认：24 小时
- 可配置：`session.pairing.ttl`
- 过期后需重新配对

### 批准配对

**方法 1：使用配对码**

```bash
openclaw pairing approve telegram ABC123
```

**输出**：
```
✓ Pairing approved for: Trueman (@trueman)
✓ User ID: tg:123456789
✓ Can now message the bot
```

**方法 2：使用用户 ID**

```bash
openclaw pairing approve telegram tg:123456789
```

**方法 3：批量批准**

```bash
# 批准所有待处理请求
openclaw pairing approve telegram --all

# 或交互式选择
openclaw pairing approve telegram --interactive
```

**方法 4：在控制面板中批准**

```bash
openclaw dashboard
```

导航到：**Settings → Channels → Telegram → Pairing Requests**

点击"Approve"按钮。

### 配对有效期和续期

**查看已配对用户**：

```bash
openclaw pairing list telegram --approved
```

**输出示例**：
```
Approved Pairings (Telegram):
==============================

[1] User: Trueman (@trueman)
    User ID: tg:123456789
    Approved: 2026-03-14 15:35:00
    Expires: 2026-04-14 15:35:00
    Status: active

[2] User: Alice (@alice)
    User ID: tg:987654321
    Approved: 2026-03-10 10:00:00
    Expires: 2026-03-17 10:00:00
    Status: expiring soon (3 days)

Total: 2 approved
```

**续期配对**：

```bash
# 续期指定用户
openclaw pairing renew telegram tg:123456789

# 续期所有用户
openclaw pairing renew telegram --all

# 设置续期时长（默认 30 天）
openclaw pairing renew telegram tg:123456789 --days 60
```

**撤销配对**：

```bash
# 撤销指定用户
openclaw pairing revoke telegram tg:123456789

# 撤销所有用户
openclaw pairing revoke telegram --all
```

**配置配对有效期**：

```json
{
  "session": {
    "pairing": {
      "ttl": "30d",  // 默认 30 天
      "renewable": true,
      "maxRenewals": null  // 无限制续期
    }
  }
}
```

---

## 4.5 发送第一条消息

### 给 Bot 发消息

**配对批准后**，在 Telegram 中给 Bot 发消息：

```
你：Hello, OpenClaw!
```

**Bot 回复**：
```
Hello! I'm your OpenClaw AI assistant. How can I help you today?
```

**如果 Bot 没有回复**：

```bash
# 1. 检查网关状态
openclaw gateway status

# 2. 检查配对状态
openclaw pairing list telegram

# 3. 查看日志
openclaw logs --follow

# 4. 测试 Bot 连接
openclaw channels test telegram
```

### 查看网关日志

**实时查看日志**：

```bash
openclaw logs --follow
```

**输出示例**：
```
[2026-03-14 15:40:00] INFO  Gateway started on http://127.0.0.1:18789
[2026-03-14 15:40:05] INFO  Telegram channel connected
[2026-03-14 15:41:00] INFO  Received message from tg:123456789
[2026-03-14 15:41:00] INFO  Pairing check: approved
[2026-03-14 15:41:01] INFO  Sending to AI model: anthropic/claude-sonnet-4-5
[2026-03-14 15:41:03] INFO  Received response from AI
[2026-03-14 15:41:03] INFO  Sent response to tg:123456789
```

**查看历史日志**：

```bash
# 最近 100 行
openclaw logs --limit 100

# 搜索特定内容
openclaw logs --grep "telegram"

# 导出日志
openclaw logs --output ~/openclaw.log
```

### 测试回复

**简单问答测试**：

```
你：What is the weather today?

Bot: I don't have access to real-time weather data. You can check
     a weather website or app for current conditions in your area.
     Is there anything else I can help you with?
```

**启用网络搜索后**：

```json
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "brave",
        "apiKey": "YOUR_BRAVE_API_KEY"
      }
    }
  }
}
```

```
你：What is the weather today?

Bot: Let me search for current weather conditions...

[Searches web]

Based on current data, the weather in Beijing today is:
- Temperature: 15°C (59°F)
- Conditions: Partly cloudy
- Humidity: 45%
- Wind: 10 km/h NE
```

**代码相关问题测试**：

```
你：How do I read a file in Python?

Bot: Here's how to read a file in Python:

```python
# Method 1: Read entire file
with open('filename.txt', 'r') as f:
    content = f.read()

# Method 2: Read line by line
with open('filename.txt', 'r') as f:
    for line in f:
        print(line)

# Method 3: Read all lines into list
with open('filename.txt', 'r') as f:
    lines = f.readlines()
```

The `with` statement ensures the file is properly closed after reading.
```

### 常见问题排查

#### 问题 1：Bot 不回复

**可能原因**：
1. 网关未运行
2. 配对未批准
3. Bot Token 错误
4. 网络问题

**排查步骤**：

```bash
# 1. 检查网关
openclaw gateway status

# 2. 检查配对
openclaw pairing list telegram

# 3. 测试 Bot
openclaw channels test telegram

# 4. 查看日志
openclaw logs --grep "telegram"
```

#### 问题 2：配对码无效

**错误信息**：
```
Error: Invalid pairing code: ABC123
```

**解决方案**：

```bash
# 1. 重新获取配对码列表
openclaw pairing list telegram

# 2. 确认配对码正确（区分大小写）

# 3. 如果过期，让用户重新发消息生成新配对码

# 4. 或使用用户 ID 批准
openclaw pairing approve telegram tg:123456789
```

#### 问题 3：Bot Token 无效

**错误信息**：
```
Error: Invalid bot token
```

**解决方案**：

```bash
# 1. 检查 Token 是否正确复制（无多余空格）

# 2. 在 @BotFather 中重新生成 Token
/revoke

# 3. 更新配置
openclaw channels update telegram --token NEW_TOKEN

# 4. 重启网关
openclaw gateway restart
```

#### 问题 4：消息发送失败

**错误信息**：
```
Error: Failed to send message to Telegram API
```

**可能原因**：
- 网络问题
- Telegram API 限制
- Bot 被禁用

**解决方案**：

```bash
# 1. 检查网络连接
ping api.telegram.org

# 2. 检查 Bot 状态（在 Telegram 中搜索 Bot）

# 3. 等待几分钟后重试（可能触发速率限制）

# 4. 查看完整错误日志
openclaw logs --level debug
```

---

## 4.6 群组配置

### 将 Bot 添加到群组

**步骤 1：在 Telegram 中创建群组**

- 点击"New Message" → "New Group"
- 添加至少一个成员
- 设置群组名称

**步骤 2：添加 Bot 到群组**

- 点击群组信息
- 选择"Add Member"
- 搜索你的 Bot 用户名（@MyOpenClawBot）
- 添加到群组

**步骤 3：设置 Bot 为管理员（可选）**

- 点击 Bot 在群组中的名字
- 选择"Edit" → "Permissions"
- 授予必要权限：
  - ✅ 读取消息
  - ✅ 发送消息
  - ❌ 删除消息（可选）
  - ❌ 封禁用户（可选）

### 设置群组策略

**配置文件**：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123:abc-xyz",
      "groupPolicy": "mention",
      "privacyMode": false
    }
  }
}
```

**群组策略说明**：

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| `mention` | 只有被 @提及时响应 | 大型群组（推荐） |
| `all` | 响应所有消息 | 小型团队、家庭群 |
| `disabled` | 不响应群组消息 | 仅私聊使用 |

**使用示例**：

```
群组成员 A: 今天天气不错

Bot: （无响应，因为没有被 @提及）

群组成员 B: @MyOpenClawBot 今天天气怎么样？

Bot: 让我查一下... [搜索并回复]
```

### 提及模式配置

**配置特定群组**：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "groups": {
        "allow": [
          "tg:-1001234567890",  // 允许的群组 ID
          "tg:-1009876543210"
        ],
        "deny": [
          "tg:-1001111111111"  // 禁止的群组 ID
        ],
        "policy": "mention"
      }
    }
  }
}
```

**获取群组 ID**：

```bash
# 方法 1：转发群组消息到 @getmyid_bot
# 它会返回群组 ID

# 方法 2：查看日志
openclaw logs --grep "group"

# 方法 3：使用 API
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates"
```

### 隐私模式说明

**什么是隐私模式？**

Telegram Bot 有两种模式：

**隐私模式开启（默认）**：
- Bot 只能看到 @提及的消息
- 无法看到普通消息
- 无需管理员权限

**隐私模式关闭**：
- Bot 可以看到所有消息
- 需要管理员权限
- 可以自动响应

**在 @BotFather 中配置**：

```
你：/setprivacy

BotFather: Choose a bot:
1. MyOpenClawBot

你：1

BotFather: Choose privacy mode:
1. Enable - Bot only receives mentions
2. Disable - Bot receives all messages

你：2  # 关闭隐私模式

BotFather: Success! Privacy mode disabled.
```

**配置对应关系**：

| BotFather 设置 | OpenClaw 配置 |
|----------------|---------------|
| Privacy Enabled | `"privacyMode": true` |
| Privacy Disabled | `"privacyMode": false` |

**推荐配置**：

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "groupPolicy": "mention",  // 仅响应 @提及
      "privacyMode": true  // 隐私模式开启
    }
  }
}
```

---

## 小结

### 配置检查清单

- [ ] 已创建 Telegram Bot（@BotFather）
- [ ] 已保存 Bot Token（安全位置）
- [ ] 已配置 OpenClaw（`openclaw channels add telegram`）
- [ ] 已启动网关（`openclaw gateway start`）
- [ ] 已批准配对（`openclaw pairing approve`）
- [ ] 已发送测试消息
- [ ] Bot 正常回复
- [ ] （可选）已配置群组

### 常用命令汇总

```bash
# 添加渠道
openclaw channels add telegram

# 查看配对请求
openclaw pairing list telegram

# 批准配对
openclaw pairing approve telegram ABC123

# 测试渠道
openclaw channels test telegram

# 查看日志
openclaw logs --follow

# 重启网关
openclaw gateway restart
```

### 下一步

配置完 Telegram 后，可以探索 Web 控制面板：

**阅读下一篇**：[教程 05: 控制面板使用指南 - Web 界面操作](./05-dashboard.md)

---

## 配图建议

### 图 1：BotFather 对话截图

**内容**：
- 截图 1：/newbot 命令
- 截图 2：设置 Bot 名称
- 截图 3：设置 Bot 用户名
- 截图 4：显示 Bot Token

**用途**：4.2 节，展示创建 Bot 的过程

### 图 2：配置文件中 telegram 部分高亮

**内容**：
- 打开 openclaw.json 文件
- 高亮显示 telegram 配置部分
- 标注各配置项含义

**用途**：4.3 节，解释配置结构

### 图 3：配对流程图解

**内容**：
```
用户发消息 → 生成配对码 → 管理员批准 → 正常通信
     ↓            ↓             ↓            ↓
  Telegram    OpenClaw      CLI 命令     AI 回复
```

**用途**：4.4 节，解释配对机制

### 图 4：消息交互截图

**内容**：
- Telegram 对话界面
- 展示用户提问和 Bot 回复
- 包含代码示例的对话

**用途**：4.5 节，展示实际效果

---

## 代码示例汇总

### 1. 创建 Bot 后的配置
```bash
openclaw channels add telegram
# 输入 Bot Token
```

### 2. 配置文件示例
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "123:abc-xyz",
      "dmPolicy": "pairing",
      "groupPolicy": "mention",
      "privacyMode": false
    }
  }
}
```

### 3. 环境变量方式
```bash
export TELEGRAM_BOT_TOKEN=123:abc-xyz
```
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": { "$env": "TELEGRAM_BOT_TOKEN" }
    }
  }
}
```

### 4. 配对管理命令
```bash
# 查看待批准
openclaw pairing list telegram

# 批准配对
openclaw pairing approve telegram ABC123

# 查看已批准
openclaw pairing list telegram --approved

# 续期
openclaw pairing renew telegram tg:123456789

# 撤销
openclaw pairing revoke telegram tg:123456789
```

### 5. 测试和调试
```bash
# 测试渠道
openclaw channels test telegram

# 查看日志
openclaw logs --follow
openclaw logs --grep "telegram"
openclaw logs --limit 100

# 重启网关
openclaw gateway restart
openclaw gateway reload
```

### 6. 群组配置
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "groups": {
        "allow": ["tg:-1001234567890"],
        "policy": "mention"
      }
    }
  }
}
```

### 7. 获取用户/群组 ID
```bash
# 转发消息到 @getmyid_bot
# 或查看日志
openclaw logs --grep "from tg:"
```

### 8. 在 @BotFather 中配置
```
/newbot          # 创建 Bot
/revoke          # 撤销 Token
/setprivacy      # 设置隐私模式
/setcommands     # 设置命令列表
```

---

**字数统计**: 约 5,800 字  
**完成时间**: 2026-03-14  
**作者**: OpenClaw 文档团队  
**审阅状态**: 初稿
