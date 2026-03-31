---
title: index
description: index 页面
---

# Klaviyo

**技能名**: `klaviyo`  
**作者**: @byungkyu  
**下载量**: 14.7k ⭐ **Stars**: 3  
**版本**: 5  
**来源**: [ClawHub](https://clawhub.ai/byungkyu/klaviyo)

---

## 📖 技能介绍

Klaviyo 技能集成 Klaviyo 邮件营销平台 API，实现邮件营销自动化。

### 核心功能

- 📧 **邮件发送** - 发送营销邮件
- 👥 **用户管理** - 管理订阅用户
- 📊 **数据分析** - 跟踪邮件效果
- 🎯 **细分受众** - 创建用户细分

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install klaviyo
```

### 2. 配置 API Key

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置：

```json
{
  "klaviyo": {
    "apiKey": "YOUR_KLAVIYO_API_KEY",
    "accountId": "YOUR_ACCOUNT_ID"
  }
}
```

---

## 💡 使用示例

### 发送邮件

```bash
# 发送营销活动
klaviyo campaign send --name "新品发布" --list "订阅用户"

# 发送邮件模板
klaviyo email send --template "welcome" --to "user@example.com"
```

### 用户管理

```bash
# 添加订阅用户
klaviyo subscribe --email "user@example.com" --list "新闻通讯"

# 取消订阅
klaviyo unsubscribe --email "user@example.com"

# 获取用户信息
klaviyo profile get --email "user@example.com"
```

### 数据分析

```bash
# 获取活动统计
klaviyo metrics campaign --id "campaign_id"

# 获取列表统计
klaviyo metrics list --name "订阅用户"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| campaign | 营销活动 | `klaviyo campaign send --name x` |
| subscribe | 订阅 | `klaviyo subscribe --email x` |
| unsubscribe | 取消订阅 | `klaviyo unsubscribe --email x` |
| metrics | 数据统计 | `klaviyo metrics campaign --id x` |
| segment | 用户细分 | `klaviyo segment create --name x` |

### 自动化流程

```javascript
// 新用户欢迎流程
klaviyo.on('subscribe', async (user) => {
  await klaviyo.email.send({
    template: 'welcome',
    to: user.email,
    data: { name: user.name }
  });
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **遵守法规** - 遵循 GDPR/CAN-SPAM
2. **双确认订阅** - 使用双重确认
3. **清理列表** - 定期清理无效邮箱
4. **A/B 测试** - 测试不同邮件内容

### 避免踩坑

1. **不要 spam** - 控制发送频率
2. **注意退订** - 尊重用户选择
3. **监控送达率** - 关注邮件送达情况

---

## 📊 效果评估

### 营销指标

| 指标 | 行业平均 | 优秀水平 |
|------|----------|----------|
| 打开率 | 20% | 30%+ |
| 点击率 | 2.5% | 5%+ |
| 退订率 | <0.5% | <0.2% |
| 转化率 | 1-2% | 5%+ |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/byungkyu/klaviyo)
- [Klaviyo API 文档](https://developers.klaviyo.com/)
- [邮件营销最佳实践](https://klaviyo.com/resources)

---

## 💬 用户评价

> "邮件营销自动化太方便了"  
> —— 电商运营

> "用户细分功能很强大"  
> —— 营销人员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
