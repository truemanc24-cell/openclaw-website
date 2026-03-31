---
title: index
description: index 页面
---

# Self-Improving Agent

**技能名**: `self-improving-agent`  
**作者**: @pskoett  
**下载量**: 232k ⭐ **Stars**: 2.1k  
**版本**: 16  
**来源**: [ClawHub](https://clawhub.ai/pskoett/self-improving-agent)

---

## 📖 技能介绍

Self-Improving Agent 是一个强大的自我改进技能，让 AI 助手能够从错误中学习，持续优化自己的行为。

### 核心功能

- 📝 **错误记录** - 自动捕获命令/操作失败
- 💡 **学习机制** - 从用户纠正中学习
- 🔄 **持续改进** - 不断提升表现
- 📊 **经验总结** - 提炼最佳实践

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install self-improving-agent
```

### 2. 配置（可选）

在 `~/.openclaw/skills/self-improving-agent/config.json` 中配置：

```json
{
  "enabled": true,
  "autoLog": true,
  "logPath": "~/.openclaw/learnings/"
}
```

---

## 💡 使用示例

### 自动记录错误

当操作失败时，自动记录：

```markdown
## [ERR-20260316-001]
**时间**: 2026-03-16T17:00:00Z
**错误**: 命令执行失败
**原因**: 权限不足
**解决方案**: 使用 sudo 或修改权限
```

### 用户纠正学习

当用户纠正你时：

```
用户：不对，应该用这个命令 xxx
助手：收到，已记录到学习系统
```

### 经验提升

定期review学习记录，提升到永久记忆：

```bash
# 查看最近学习
cat ~/.openclaw/learnings/LEARNINGS.md | tail -20
```

---

## 🔧 高级用法

### 分类记录

| 类型 | 文件 | 说明 |
|------|------|------|
| 错误 | `ERRORS.md` | 命令/操作失败 |
| 学习 | `LEARNINGS.md` | 用户纠正/新知识 |
| 功能请求 | `FEATURE_REQUESTS.md` | 用户想要的新功能 |

### 自动回顾

设置定时任务回顾学习：

```javascript
cron.add({
  schedule: { kind: "every", everyMs: 86400000 },
  payload: { kind: "systemEvent", text: "回顾今日学习" }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **及时记录** - 错误发生后立即记录
2. **详细描述** - 包含上下文和解决方案
3. **定期review** - 每周回顾提炼
4. **分享经验** - 贡献到社区

### 避免踩坑

1. **不要重复错误** - 记录后要避免再犯
2. **不要忽略纠正** - 用户纠正是宝贵学习机会
3. **不要过度记录** - 只记录有价值的

---

## 📊 效果评估

### 使用前 vs 使用后

| 指标 | 使用前 | 使用后 | 提升 |
|------|--------|--------|------|
| 重复错误 | 高 | 低 | -80% |
| 用户满意度 | 中 | 高 | +50% |
| 问题解决速度 | 慢 | 快 | +60% |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/pskoett/self-improving-agent)
- [GitHub 源码](https://github.com/pskoett/self-improving-agent)
- [使用文档](https://clawhub.ai/docs/self-improving)

---

## 💬 用户评价

> "这个技能让我的助手越来越聪明了！"  
> —— 开发者

> "不再重复犯同样的错误，效率提升明显"  
> —— 产品经理

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
