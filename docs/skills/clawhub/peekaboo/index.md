# Peekaboo

**技能名**: `peekaboo`  
**作者**: @steipete  
**下载量**: 17.8k ⭐ **Stars**: 51  
**版本**: 1  
**来源**: [ClawHub](https://clawhub.ai/steipete/peekaboo)

---

## 📖 技能介绍

Peekaboo 是 macOS UI 自动化技能，让你能够捕获屏幕、识别 UI 元素并实现自动化操作。

### 核心功能

- 📸 **屏幕捕获** - 捕获屏幕/窗口截图
- 🎯 **元素识别** - 识别按钮、文本框等 UI 元素
- ⚡ **自动化操作** - 点击、输入、拖拽等
- 🔍 **视觉搜索** - 基于图像查找元素

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install peekaboo
```

### 2. 授予权限

在 系统偏好设置 → 安全性与隐私 → 隐私 中授予：
- 屏幕录制
- 辅助功能
- 自动化

---

## 💡 使用示例

### 屏幕捕获

```bash
# 捕获整个屏幕
peekaboo snap --output screenshot.png

# 捕获特定窗口
peekaboo snap --window "Safari" --output safari.png

# 捕获选定区域
peekaboo snap --area "100,100,800,600" --output area.png
```

### UI 元素识别

```bash
# 识别屏幕上的按钮
peekaboo find --type button --text "提交"

# 识别输入框
peekaboo find --type textfield --label "用户名"
```

### 自动化操作

```bash
# 点击元素
peekaboo click --element "button.submit"

# 输入文本
peekaboo type --element "input.username" --text "hello"

# 拖拽操作
peekaboo drag --from "item1" --to "item2"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| snap | 屏幕捕获 | `peekaboo snap --output x.png` |
| find | 查找元素 | `peekaboo find --type button` |
| click | 点击元素 | `peekaboo click --element btn` |
| type | 输入文本 | `peekaboo type --text "hello"` |
| drag | 拖拽 | `peekaboo drag --from a --to b` |

### 脚本自动化

```javascript
// 自动化工作流
const ui = new Peekaboo();
ui.snap('before.png');
ui.click('button#submit');
ui.type('input#name', 'test');
ui.snap('after.png');
```

---

## ⚠️ 注意事项

### 最佳实践

1. **精确选择器** - 使用稳定的元素标识
2. **添加等待** - 操作间添加适当延迟
3. **错误处理** - 处理元素找不到的情况
4. **定期验证** - UI 变化后更新脚本

### 避免踩坑

1. **不要硬编码坐标** - 使用元素识别
2. **注意分辨率** - 不同分辨率可能影响识别
3. **权限问题** - 确保授予所有必要权限

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| UI 测试 | 高 | 高 |
| 重复操作自动化 | 高 | 高 |
| 屏幕监控 | 中 | 中 |
| 教程制作 | 低 | 中 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/steipete/peekaboo)
- [Peekaboo 文档](https://github.com/steipete/peekaboo)
- [macOS 自动化指南](https://developer.apple.com/documentation/applescript)

---

## 💬 用户评价

> "UI 自动化测试神器，比 Selenium 还好用"  
> —— 测试工程师

> "自动点击省了很多重复劳动"  
> —— 运营人员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
