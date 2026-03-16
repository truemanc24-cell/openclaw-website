# Slack

**技能名**: `slack`  
**作者**: @steipete  
**下载量**: 27.8k ⭐ **Stars**: 91  
**版本**: Latest  
**来源**: [ClawHub](https://clawhub.ai/steipete/slack)

---

## 📖 技能介绍

Slack 技能让你能够自动化管理 Slack，实现消息发送、频道管理、提醒通知等功能。

### 核心功能

- 💬 **消息发送** - 向频道/用户发送消息
- 📢 **频道管理** - 创建和管理频道
- 🔔 **提醒通知** - 定时提醒和通知
- 🤖 **Bot 集成** - Slack Bot 自动化

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install slack
```

### 2. 配置 Token

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置：

```json
{
  "slack": {
    "botToken": "xoxb-YOUR-BOT-TOKEN",
    "signingSecret": "YOUR-SIGNING-SECRET"
  }
}
```

---

## 💡 使用示例

### 发送消息

```bash
# 发送消息到频道
slack send --channel general --message "大家好！"

# 发送私信
slack dm --user @username --message "你好"

# 发送带附件
slack send --channel general --attachment file.pdf
```

### 频道管理

```bash
# 创建频道
slack channel create --name project-alpha --private

# 邀请成员
slack channel invite --channel project-alpha --user @user1,@user2

# 获取频道信息
slack channel info --name general
```

### 提醒设置

```bash
# 设置提醒
slack remind --channel general --time "10 minutes" --message "开会"

# 列出提醒
slack remind list
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| send | 发送消息 | `slack send --channel x --message y` |
| dm | 私信 | `slack dm --user @x --message y` |
| channel | 频道管理 | `slack channel create --name x` |
| remind | 提醒 | `slack remind --time 10m --message x` |
| reaction | 表情反应 | `slack reaction add --emoji 👍` |

### Bot 集成

```javascript
// Slack Bot 示例
const { App } = require('@slack/bolt');
const app = new App({ token: process.env.SLACK_BOT_TOKEN });

app.message('hello', async ({ message, say }) => {
  await say(`Hello, ${message.user}!`);
});

(async () => { await app.start(); })();
```

---

## ⚠️ 注意事项

### 最佳实践

1. **权限最小化** - 只请求必要权限
2. **消息格式** - 使用 Slack 格式语法
3. **速率限制** - 遵守 API 限制
4. **错误处理** - 处理发送失败

### 避免踩坑

1. **不要 spam** - 控制消息频率
2. **注意隐私** - 不发送敏感信息
3. **Token 安全** - 妥善保管 Token

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 团队通知 | 高 | 高 |
| 自动化提醒 | 高 | 高 |
| CI/CD 通知 | 高 | 高 |
| 客服机器人 | 中 | 中 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/steipete/slack)
- [Slack API 文档](https://api.slack.com/)
- [Slack Bot 指南](https://api.slack.com/bots)

---

## 💬 用户评价

> "团队通知自动化太方便了"  
> —— 团队负责人

> "CI/CD 集成很实用"  
> —— DevOps 工程师

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
