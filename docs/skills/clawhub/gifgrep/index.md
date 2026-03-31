---
title: index
description: index 页面
---

# Gifgrep

**技能名**: `gifgrep`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Gifgrep 技能提供 GIF 搜索功能，支持多平台搜索、下载和提取。

### 核心功能

- 🔍 **GIF 搜索** - 搜索 GIF 图片
- 📥 **批量下载** - 下载搜索结果
- 🖼️ **帧提取** - 从 GIF 提取帧
- 📊 **GIF 制作** - 制作 GIF

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install gifgrep
```

### 2. 配置 API（可选）

某些平台需要 API Key：

```json
{
  "giphy": {
    "apiKey": "YOUR_GIPHY_API_KEY"
  }
}
```

---

## 💡 使用示例

### 搜索 GIF

```bash
# 搜索 GIF
gifgrep search --query "happy"

# 限制数量
gifgrep search --query "cat" --limit 10

# 指定平台
gifgrep search --query "reaction" --platform giphy
```

### 下载 GIF

```bash
# 下载单个
gifgrep download --url "https://giphy.com/gif/xxx"

# 批量下载
gifgrep download --query "funny" --limit 5 --output gifs/

# 下载最佳匹配
gifgrep download --query "celebration" --best
```

### GIF 处理

```bash
# 提取帧
gifgrep frames --input animation.gif --output frames/

# 制作 GIF
gifgrep make --frames frames/*.png --output animation.gif

# 压缩 GIF
gifgrep compress --input large.gif --output small.gif
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| search | 搜索 | `gifgrep search --query x` |
| download | 下载 | `gifgrep download --url x` |
| frames | 提取帧 | `gifgrep frames --input x.gif` |
| make | 制作 | `gifgrep make --frames x` |
| compress | 压缩 | `gifgrep compress --input x.gif` |

### 平台支持

| 平台 | 支持 | API 要求 |
|------|------|----------|
| GIPHY | ✅ | 可选 |
| Tenor | ✅ | 可选 |
| Gfycat | ✅ | 否 |
| 本地搜索 | ✅ | 否 |

---

## ⚠️ 注意事项

### 最佳实践

1. **版权注意** - 注意 GIF 版权
2. **大小控制** - 控制 GIF 文件大小
3. **合理使用** - 避免过度使用
4. **存储管理** - 定期清理 GIF 文件

### 避免踩坑

1. **不要商用** - 注意使用场景
2. **文件大小** - 大 GIF 影响性能
3. **隐私保护** - 不搜索敏感内容

---

## 📊 效果评估

### 性能指标

| 指标 | 数值 |
|------|------|
| 搜索速度 | <1 秒 |
| 结果数量 | 1000+ |
| 下载速度 | 取决于网络 |
| 支持格式 | GIF/WebP |

---

## 🔗 相关资源

- [GIPHY API](https://developers.giphy.com/)
- [GIF 最佳实践](https://clawhub.ai/docs/gif-best-practices)
- [动图制作指南](https://clawhub.ai/docs/gif-creation)

---

## 💬 用户评价

> "找 GIF 很方便"  
> —— 社交媒体运营

> "制作 GIF 很简单"  
> —— 内容创作者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
