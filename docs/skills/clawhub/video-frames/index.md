---
title: index
description: index 页面
---

# Video Frames

**技能名**: `video-frames`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Video Frames 技能使用 ffmpeg 从视频中提取帧或短片，支持多种格式和参数。

### 核心功能

- 🖼️ **帧提取** - 从视频提取单帧
- 🎬 **片段剪辑** - 提取视频片段
- 📊 **批量处理** - 批量处理视频
- 🎨 **格式转换** - 视频格式转换

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install video-frames
```

### 2. 安装 ffmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows
choco install ffmpeg
```

---

## 💡 使用示例

### 提取帧

```bash
# 提取单帧
video-frames extract --input video.mp4 --output frame.jpg --time 00:01:30

# 批量提取（每秒一帧）
video-frames extract --input video.mp4 --output frames/ --fps 1

# 提取特定帧
video-frames extract --input video.mp4 --output frame.png --frame-number 100
```

### 提取片段

```bash
# 提取片段
video-frames clip --input video.mp4 --output clip.mp4 --start 00:01:00 --end 00:01:30

# 提取 GIF
video-frames gif --input video.mp4 --output clip.gif --start 00:01:00 --duration 5
```

### 批量处理

```bash
# 批量提取帧
video-frames batch --input videos/*.mp4 --output frames/

# 批量生成缩略图
video-frames thumbnail --input videos/*.mp4 --output thumbs/
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| extract | 提取帧 | `video-frames extract --time 00:01:00` |
| clip | 提取片段 | `video-frames clip --start 00:00 --end 00:30` |
| gif | 生成 GIF | `video-frames gif --duration 5` |
| thumbnail | 缩略图 | `video-frames thumbnail --output x.jpg` |
| convert | 格式转换 | `video-frames convert --format mp4` |

### 参数说明

```bash
# 高质量提取
video-frames extract --input video.mp4 --output frame.png \
  --quality high --format png --scale 1920x1080
```

---

## ⚠️ 注意事项

### 最佳实践

1. **选择关键帧** - 提取有意义的帧
2. **格式选择** - PNG 质量高，JPG 体积小
3. **批量处理** - 大文件分批处理
4. **存储管理** - 帧文件占用空间大

### 避免踩坑

1. **版权问题** - 注意视频版权
2. **隐私保护** - 不提取敏感内容
3. **性能考虑** - 长视频耗时较长

---

## 📊 效果评估

### 支持格式

| 格式 | 输入 | 输出 |
|------|------|------|
| MP4 | ✅ | ✅ |
| MOV | ✅ | ✅ |
| AVI | ✅ | ✅ |
| MKV | ✅ | ✅ |
| WebM | ✅ | ✅ |

---

## 🔗 相关资源

- [ffmpeg 文档](https://ffmpeg.org/documentation.html)
- [视频处理指南](https://clawhub.ai/docs/video-processing)
- [帧提取最佳实践](https://clawhub.ai/docs/frame-extraction)

---

## 💬 用户评价

> "视频截图很方便"  
> —— 视频编辑

> "批量处理效率高"  
> —— 内容创作者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
