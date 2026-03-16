# Camsnap

**技能名**: `camsnap`  
**作者**: @steipete  
**下载量**: 10.1k ⭐ **Stars**: 7  
**版本**: 1  
**来源**: [ClawHub](https://clawhub.ai/steipete/camsnap)

---

## 📖 技能介绍

Camsnap 技能让你能够控制摄像头进行拍照和录像，支持本地和网络摄像头。

### 核心功能

- 📸 **拍照** - 捕获摄像头画面
- 🎥 **录像** - 录制视频片段
- 📷 **多摄像头** - 支持多个摄像头
- ⏱️ **定时拍摄** - 定时自动拍照

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install camsnap
```

### 2. 查看摄像头

```bash
# 列出可用摄像头
camsnap list

# 测试摄像头
camsnap test --camera 0
```

---

## 💡 使用示例

### 拍照

```bash
# 拍摄照片
camsnap snap --output photo.jpg

# 使用指定摄像头
camsnap snap --camera 1 --output photo2.jpg

# 高分辨率
camsnap snap --resolution 1920x1080 --output hd.jpg
```

### 录像

```bash
# 录制视频
camsnap record --duration 10 --output video.mp4

# 录制指定时长
camsnap record --duration 30 --fps 30 --output clip.mp4
```

### 定时拍摄

```bash
# 定时拍照（每 5 分钟）
camsnap timelapse --interval 300 --count 12 --output timelapse/

# 运动检测
camsnap motion --output motion_clips/
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| list | 列出摄像头 | `camsnap list` |
| snap | 拍照 | `camsnap snap --output x.jpg` |
| record | 录像 | `camsnap record --duration 10` |
| timelapse | 延时摄影 | `camsnap timelapse --interval 300` |
| motion | 运动检测 | `camsnap motion --output x/` |

### 自动化场景

```javascript
// 门口监控
camsnap.watch({
  camera: 0,
  motion: true,
  output: '/security/clips/',
  notify: true
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **隐私保护** - 不要在隐私区域使用
2. **存储管理** - 定期清理旧文件
3. **光线充足** - 确保拍摄环境光线
4. **权限设置** - 正确设置摄像头权限

### 避免踩坑

1. **不要侵犯隐私** - 遵守法律法规
2. **注意存储** - 视频占用空间大
3. **网络摄像头** - 确保网络安全

---

## 📊 效果评估

### 支持格式

| 格式 | 拍照 | 录像 |
|------|------|------|
| JPG | ✅ | ❌ |
| PNG | ✅ | ❌ |
| MP4 | ❌ | ✅ |
| AVI | ❌ | ✅ |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/steipete/camsnap)
- [摄像头 API 文档](https://clawhub.ai/docs/camsnap)
- [隐私保护指南](https://clawhub.ai/docs/privacy)

---

## 💬 用户评价

> "延时摄影功能很有趣"  
> —— 摄影爱好者

> "运动检测很灵敏"  
> —— 家庭用户

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
