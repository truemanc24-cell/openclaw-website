# Apple Reminders

**技能名**: `apple-reminders`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Apple Reminders 技能提供 Apple 提醒事项管理功能，支持列表、添加、编辑、完成等操作。

### 核心功能

- ✅ **提醒管理** - 添加/编辑/完成提醒
- 📋 **列表管理** - 管理提醒列表
- 📅 **日期过滤** - 按日期过滤提醒
- 🔔 **提醒设置** - 设置提醒时间

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install apple-reminders
```

### 2. 无需配置

本技能直接使用系统提醒事项。

---

## 💡 使用示例

### 添加提醒

```bash
# 添加提醒
reminders add --title "开会" --date "2026-03-16 14:00"

# 添加到指定列表
reminders add --title "购物" --list "个人" --date "tomorrow"

# 带优先级
reminders add --title "紧急任务" --priority high
```

### 查看提醒

```bash
# 列出所有提醒
reminders list

# 按列表查看
reminders list --list "工作"

# 查看今日提醒
reminders list --today

# 查看过期提醒
reminders list --overdue
```

### 管理提醒

```bash
# 完成提醒
reminders complete --id "reminder_id"

# 编辑提醒
reminders edit --id "reminder_id" --title "新标题"

# 删除提醒
reminders delete --id "reminder_id"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| add | 添加提醒 | `reminders add --title x` |
| list | 列出提醒 | `reminders list --today` |
| complete | 完成 | `reminders complete --id x` |
| edit | 编辑 | `reminders edit --id x` |
| delete | 删除 | `reminders delete --id x` |

### 列表管理

```bash
# 创建列表
reminders list create --name "项目 A"

# 删除列表
reminders list delete --name "旧项目"

# 列出所有列表
reminders lists
```

---

## ⚠️ 注意事项

### 最佳实践

1. **分类管理** - 使用不同列表分类
2. **设置优先级** - 重要事项设高优先级
3. **定期清理** - 清理已完成提醒
4. **合理提醒** - 设置适当提醒时间

### 避免踩坑

1. **不要过多** - 避免提醒过多
2. **及时完成** - 完成后标记
3. **同步问题** - 确保 iCloud 同步

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 工作任务 | 高 | 高 |
| 个人待办 | 高 | 高 |
| 购物清单 | 中 | 中 |
| 会议提醒 | 高 | 高 |

---

## 🔗 相关资源

- [Apple 提醒事项](https://support.apple.com/guide/reminders)
- [remindctl 文档](https://clawhub.ai/docs/remindctl)
- [时间管理最佳实践](https://clawhub.ai/docs/time-management)

---

## 💬 用户评价

> "提醒管理很方便"  
> —— 商务人士

> "不再忘记重要事项"  
> —— 学生

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
