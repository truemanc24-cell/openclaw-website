---
title: index
description: index 页面
---

# OpenHue

**技能名**: `openhue`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

OpenHue 技能控制 Philips Hue 智能灯光，实现灯光自动化和场景控制。

### 核心功能

- 💡 **灯光控制** - 开关/亮度/颜色
- 🎨 **场景管理** - 创建和应用场景
- ⏰ **定时任务** - 定时开关灯
- 🏠 **房间管理** - 按房间控制

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install openhue
```

### 2. 配置 Hue Bridge

```bash
# 发现 Bridge
openhue discover

# 连接 Bridge
openhue connect --bridge 192.168.1.100

# 列出灯光
openhue lights list
```

---

## 💡 使用示例

### 灯光控制

```bash
# 打开灯
openhue light on --name "客厅"

# 关闭灯
openhue light off --name "卧室"

# 设置亮度
openhue light brightness --name "客厅" --level 50

# 设置颜色
openhue light color --name "客厅" --color "#FF0000"
```

### 场景管理

```bash
# 创建场景
openhue scene create --name "阅读" --lights "客厅：50%,暖白"

# 应用场景
openhue scene apply --name "阅读"

# 列出场景
openhue scene list
```

### 自动化

```bash
# 日落开灯
openhue automate --action on --trigger sunset

# 日出关灯
openhue automate --action off --trigger sunrise
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| light | 灯光控制 | `openhue light on --name x` |
| scene | 场景管理 | `openhue scene create --name x` |
| room | 房间管理 | `openhue room list` |
| automate | 自动化 | `openhue automate --trigger sunset` |
| group | 群组控制 | `openhue group on --name x` |

### 场景脚本

```javascript
// 电影模式
await openhue.scene({
  lights: {
    '客厅主灯': { on: false },
    '客厅灯带': { on: true, color: '#4A00E0', brightness: 30 }
  }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **命名规范** - 使用清晰的灯光命名
2. **场景预设** - 预设常用场景
3. **自动化合理** - 避免频繁切换
4. **节能设置** - 不用时自动关闭

### 避免踩坑

1. **Bridge 连接** - 确保网络稳定
2. **灯光数量** - 注意 Bridge 负载
3. **颜色准确性** - 不同灯光颜色可能有差异

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 日常照明 | 高 | 高 |
| 氛围营造 | 中 | 高 |
| 安防模拟 | 低 | 中 |
| 节能管理 | 高 | 中 |

---

## 🔗 相关资源

- [Philips Hue API](https://developers.meethue.com/)
- [OpenHue 文档](https://clawhub.ai/docs/openhue)
- [智能灯光指南](https://clawhub.ai/docs/smart-lighting)

---

## 💬 用户评价

> "灯光自动化很方便"  
> —— 智能家居用户

> "场景功能很实用"  
> —— 家庭用户

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
