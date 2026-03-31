---
title: index
description: index 页面
---

# Weather

**技能名**: `weather`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Weather 技能提供天气查询功能，支持全球城市，无需 API Key，使用 wttr.in 或 Open-Meteo。

### 核心功能

- 🌤️ **当前天气** - 查询实时天气
- 📅 **天气预报** - 多日天气预报
- 🌍 **全球支持** - 支持全球城市
- 📊 **详细数据** - 温度/湿度/风速等

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install weather
```

### 2. 无需配置

本技能无需 API Key，直接使用。

---

## 💡 使用示例

### 当前天气

```bash
# 查询当前天气
weather current --city "Beijing"

# 查询详细天气
weather current --city "Shanghai" --verbose

# 使用中文输出
weather current --city "广州" --lang zh
```

### 天气预报

```bash
# 3 天预报
weather forecast --city "Beijing" --days 3

# 7 天预报
weather forecast --city "Shanghai" --days 7

# 小时预报
weather forecast --city "Guangzhou" --hourly
```

### 多城市对比

```bash
# 对比多个城市
weather compare --cities "Beijing,Shanghai,Guangzhou"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| current | 当前天气 | `weather current --city x` |
| forecast | 天气预报 | `weather forecast --days 3` |
| compare | 城市对比 | `weather compare --cities x,y` |
| alert | 天气预警 | `weather alert --city x` |

### 自动化场景

```javascript
// 每日天气提醒
cron.add({
  schedule: { kind: "cron", cron: "0 8 * * *" },
  payload: { 
    kind: "weather", 
    city: "Beijing",
    action: "notify"
  }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **城市名称** - 使用标准城市名
2. **定时查询** - 避免频繁查询
3. **多源验证** - 重要决策多源验证
4. **预警关注** - 关注极端天气预警

### 避免踩坑

1. **数据延迟** - 天气数据有延迟
2. **位置精度** - 城市级别精度
3. **特殊地区** - 某些地区数据可能不完整

---

## 📊 效果评估

### 数据源

| 数据源 | 特点 | 适用场景 |
|--------|------|----------|
| wttr.in | 简洁 | 快速查询 |
| Open-Meteo | 详细 | 数据分析 |
| 多源融合 | 准确 | 重要决策 |

---

## 🔗 相关资源

- [wttr.in](https://wttr.in/)
- [Open-Meteo](https://open-meteo.com/)
- [天气 API 对比](https://clawhub.ai/docs/weather-apis)

---

## 💬 用户评价

> "每日天气提醒很实用"  
> —— 上班族

> "无需 API Key 很方便"  
> —— 开发者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
