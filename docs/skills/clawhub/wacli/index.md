---
title: index
description: index 页面
---

# Wacli

**技能名**: `wacli`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Wacli 技能提供 WhatsApp 消息发送和搜索功能，支持批量发送和历史记录搜索。

### 核心功能

- 💬 **消息发送** - 发送 WhatsApp 消息
- 🔍 **历史搜索** - 搜索聊天记录
- 📊 **批量发送** - 批量发送消息
- 📬 **消息同步** - 同步消息历史

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install wacli
```

### 2. 配置认证

```bash
# 登录 WhatsApp
wacli login

# 验证状态
wacli status
```

---

## 💡 使用示例

### 发送消息

```bash
# 发送消息
wacli send --to "+8613800138000" --message "你好！"

# 发送带图片
wacli send --to "+8613800138000" --message "看这个" --image photo.jpg

# 批量发送
wacli send --to contacts.txt --message "活动通知"
```

### 搜索历史

```bash
# 搜索消息
wacli search --query "会议" --limit 10

# 搜索联系人
wacli search --query "张三" --type contact

# 导出历史
wacli export --contact "+8613800138000" --output chat.json
```

### 群组管理

```bash
# 列出群组
wacli groups list

# 群组发消息
wacli send --group "家庭群" --message "晚上好"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| send | 发送消息 | `wacli send --to x --message y` |
| search | 搜索 | `wacli search --query x` |
| export | 导出 | `wacli export --contact x` |
| groups | 群组管理 | `wacli groups list` |
| broadcast | 广播 | `wacli broadcast --list x --message y` |

### 自动化发送

```javascript
// 定时发送
cron.add({
  schedule: { kind: "cron", cron: "0 9 * * *" },
  payload: { 
    kind: "wacli", 
    action: "send",
    to: "+8613800138000",
    message: "早安！记得吃早餐"
  }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **获得同意** - 确保接收者同意接收
2. **内容适度** - 避免频繁发送
3. **隐私保护** - 不发送敏感信息
4. **遵守规则** - 遵守 WhatsApp 使用条款

### 避免踩坑

1. **不要 spam** - 避免被视为垃圾消息
2. **注意封号风险** - 控制发送频率
3. **隐私合规** - 遵守隐私法规

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 通知发送 | 中 | 高 |
| 客户联系 | 中 | 高 |
| 团队沟通 | 低 | 中 |
| 历史记录 | 低 | 中 |

---

## 🔗 相关资源

- [WhatsApp Business API](https://business.whatsapp.com/)
- [Wacli 文档](https://clawhub.ai/docs/wacli)
- [消息发送最佳实践](https://clawhub.ai/docs/messaging)

---

## 💬 用户评价

> "批量通知很方便"  
> —— 小企业主

> "历史搜索很实用"  
> —— 客服人员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
