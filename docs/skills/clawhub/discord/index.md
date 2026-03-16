# Discord

**技能名**: `discord`  
**作者**: @steipete  
**下载量**: 20.4k ⭐ **Stars**: 48  
**版本**: 2  
**来源**: [ClawHub](https://clawhub.ai/steipete/discord)

---

## 📖 技能介绍

Discord 技能让你能够直接控制 Discord，实现消息发送、频道管理、服务器操作等功能。

### 核心功能

- 💬 **消息发送** - 向频道/用户发送消息
- 📢 **频道管理** - 创建、删除、管理频道
- 👥 **服务器控制** - 管理服务器设置
- 🔔 **通知集成** - 接收 Discord 通知

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install discord
```

### 2. 配置认证

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置 Discord Token：

```json
{
  "discord": {
    "token": "YOUR_BOT_TOKEN",
    "guildId": "YOUR_SERVER_ID"
  }
}
```

---

## 💡 使用示例

### 发送消息到频道

```bash
# 发送文本消息
message send --channel general --message "大家好！"

# 发送带嵌入的消息
message send --channel announcements --embed "{\"title\":\"通知\",\"description\":\"新内容发布\"}"
```

### 获取频道成员

```bash
# 列出频道成员
discord members --channel general
```

### 创建频道

```bash
# 创建文本频道
discord channel create --name 讨论区 --type text
```

---

## 🔧 高级用法

### 消息类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 文本 | 普通消息 | `message send --text "Hello"` |
| 嵌入 | 富文本嵌入 | `message send --embed {...}` |
| 文件 | 发送文件 | `message send --file path.pdf` |
| 回复 | 回复消息 | `message send --reply-to msg_id` |

### 自动化场景

```javascript
// 定时发送提醒
cron.add({
  schedule: { kind: "every", everyMs: 3600000 },
  payload: { kind: "discord", text: "每小时提醒" }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **使用 Bot Token** - 不要用个人账户
2. **权限最小化** - 只给必要权限
3. **速率限制** - 遵守 Discord API 限制
4. **错误处理** - 处理网络/权限错误

### 避免踩坑

1. **不要频繁发送** - 避免被限流
2. **不要发送垃圾** - 遵守社区规则
3. **保护好 Token** - 不要泄露

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 社区管理 | 高 | 高 |
| 通知推送 | 中 | 高 |
| 自动化回复 | 中 | 中 |
| 数据分析 | 低 | 中 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/steipete/discord)
- [Discord API 文档](https://discord.com/developers/docs)
- [Bot 设置指南](https://discord.com/developers/applications)

---

## 💬 用户评价

> "社区管理必备工具，自动化省了很多时间"  
> —— 社区管理员

> "集成简单，功能强大"  
> —— 开发者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
