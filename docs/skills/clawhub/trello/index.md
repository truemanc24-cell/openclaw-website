---
title: index
description: index 页面
---

# Trello

**技能名**: `trello`  
**作者**: @steipete  
**下载量**: 25.8k ⭐ **Stars**: 106  
**版本**: Latest  
**来源**: [ClawHub](https://clawhub.ai/steipete/trello)

---

## 📖 技能介绍

Trello 技能让你能够自动化管理 Trello 看板，实现任务管理、卡片操作等功能。

### 核心功能

- 📋 **看板管理** - 创建和管理看板
- 📇 **卡片操作** - 创建/移动/更新卡片
- 👥 **团队协作** - 管理成员和权限
- 📊 **进度跟踪** - 跟踪任务进度

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install trello
```

### 2. 配置 API Key

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置：

```json
{
  "trello": {
    "apiKey": "YOUR_TRELLO_API_KEY",
    "token": "YOUR_TRELLO_TOKEN"
  }
}
```

---

## 💡 使用示例

### 看板管理

```bash
# 创建看板
trello board create --name "项目看板"

# 列出看板
trello board list

# 获取看板详情
trello board get --id "board_id"
```

### 卡片操作

```bash
# 创建卡片
trello card create --board "项目看板" --list "待办" --name "新任务"

# 移动卡片
trello card move --card "card_id" --list "进行中"

# 更新卡片
trello card update --card "card_id" --desc "任务描述"
```

### 标签管理

```bash
# 添加标签
trello label add --card "card_id" --label "紧急"

# 移除标签
trello label remove --card "card_id" --label "完成"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| board | 看板管理 | `trello board create --name x` |
| card | 卡片操作 | `trello card create --name x` |
| list | 列表管理 | `trello list create --name x` |
| label | 标签管理 | `trello label add --label x` |
| member | 成员管理 | `trello member add --user x` |

### 自动化流程

```javascript
// 新任务自动创建
trello.on('issue', async (issue) => {
  await trello.card.create({
    board: '项目看板',
    list: '待办',
    name: issue.title,
    desc: issue.body
  });
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **看板结构** - 设计清晰的看板结构
2. **标签使用** - 统一标签规范
3. **定期清理** - 归档已完成卡片
4. **权限管理** - 合理设置成员权限

### 避免踩坑

1. **不要过度复杂** - 保持看板简洁
2. **及时更新** - 保持卡片状态最新
3. **通知设置** - 合理配置通知

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 项目管理 | 高 | 高 |
| 任务跟踪 | 高 | 高 |
| 团队协作 | 高 | 高 |
| 个人待办 | 中 | 中 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/steipete/trello)
- [Trello API 文档](https://developer.atlassian.com/cloud/trello/)
- [看板最佳实践](https://trello.com/guide)

---

## 💬 用户评价

> "项目管理效率提升很多"  
> —— 项目经理

> "自动化卡片创建很实用"  
> —— 开发者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
