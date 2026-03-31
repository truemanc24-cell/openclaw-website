---
title: index
description: index 页面
---

# Caldav Calendar

**技能名**: `caldav-calendar`  
**作者**: @Asleep123  
**下载量**: 19.5k ⭐ **Stars**: 173  
**版本**: Latest  
**来源**: [ClawHub](https://clawhub.ai/Asleep123/caldav-calendar)

---

## 📖 技能介绍

Caldav Calendar 技能集成 CalDAV 协议，让你能够管理各种日历服务（iCloud、Google Calendar、Nextcloud 等）。

### 核心功能

- 📅 **日历管理** - 创建和管理日历
- ⏰ **事件操作** - 创建/更新/删除事件
- 🔔 **提醒设置** - 事件提醒
- 🔄 **同步支持** - 多设备同步

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install caldav-calendar
```

### 2. 配置日历

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置：

```json
{
  "caldav": {
    "url": "https://caldav.icloud.com/",
    "username": "your@email.com",
    "password": "app-specific-password"
  }
}
```

---

## 💡 使用示例

### 事件管理

```bash
# 创建事件
calendar create --title "会议" --start "2026-03-16T14:00:00" --end "2026-03-16T15:00:00"

# 列出事件
calendar list --from today --to "next week"

# 更新事件
calendar update --id "event_id" --title "新标题"
```

### 提醒设置

```bash
# 创建带提醒的事件
calendar create --title "体检" --start "2026-03-20T09:00:00" --reminder 1d

# 查看提醒
calendar reminders --upcoming
```

### 日历管理

```bash
# 列出日历
calendar list-calendars

# 创建日历
calendar create-calendar --name "工作"

# 删除日历
calendar delete-calendar --name "旧日历"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| create | 创建事件 | `calendar create --title x` |
| list | 列出事件 | `calendar list --from today` |
| update | 更新事件 | `calendar update --id x` |
| delete | 删除事件 | `calendar delete --id x` |
| export | 导出日历 | `calendar export --format ics` |

### 重复事件

```javascript
// 创建每周会议
calendar.create({
  title: '周会',
  start: '2026-03-16T10:00:00',
  end: '2026-03-16T11:00:00',
  recurrence: 'FREQ=WEEKLY;BYDAY=MO'
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **时区设置** - 正确设置时区
2. **提醒合理** - 设置适当的提前提醒
3. **定期同步** - 保持日历同步
4. **隐私保护** - 敏感事件设私密

### 避免踩坑

1. **时间格式** - 使用 ISO 8601 格式
2. **冲突检测** - 检查时间冲突
3. **权限问题** - 确保有访问权限

---

## 📊 效果评估

### 支持服务

| 服务 | 支持 | 配置难度 |
|------|------|----------|
| iCloud | ✅ | 简单 |
| Google Calendar | ✅ | 简单 |
| Nextcloud | ✅ | 中等 |
| Exchange | ✅ | 中等 |
| Fastmail | ✅ | 简单 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/Asleep123/caldav-calendar)
- [CalDAV 协议](https://datatracker.ietf.org/doc/html/rfc4791)
- [日历最佳实践](https://clawhub.ai/docs/calendar)

---

## 💬 用户评价

> "多日历同步很方便"  
> —— 商务人士

> "提醒功能很实用"  
> —— 学生

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
