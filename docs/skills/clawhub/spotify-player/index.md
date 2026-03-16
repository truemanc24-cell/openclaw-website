# Spotify Player

**技能名**: `spotify-player`  
**作者**: @steipete  
**下载量**: 16.1k ⭐ **Stars**: 35  
**版本**: 1  
**来源**: [ClawHub](https://clawhub.ai/steipete/spotify-player)

---

## 📖 技能介绍

Spotify Player 技能让你能够控制 Spotify 音乐播放，实现播放列表管理、歌曲控制等功能。

### 核心功能

- 🎵 **播放控制** - 播放/暂停/跳过
- 📋 **播放列表** - 创建和管理播放列表
- 🔍 **音乐搜索** - 搜索歌曲、专辑、艺术家
- 📊 **播放统计** - 查看播放历史

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install spotify-player
```

### 2. 配置认证

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置 Spotify API：

```json
{
  "spotify": {
    "clientId": "YOUR_CLIENT_ID",
    "clientSecret": "YOUR_CLIENT_SECRET",
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }
}
```

---

## 💡 使用示例

### 播放控制

```bash
# 播放
spotify play

# 暂停
spotify pause

# 下一首
spotify next

# 上一首
spotify previous
```

### 搜索音乐

```bash
# 搜索歌曲
spotify search --type track --query "Shape of You"

# 搜索专辑
spotify search --type album --query "Midnights"

# 搜索艺术家
spotify search --type artist --query "Taylor Swift"
```

### 播放列表管理

```bash
# 创建播放列表
spotify playlist create --name "我的最爱"

# 添加歌曲
spotify playlist add --playlist "我的最爱" --track "track_id"

# 获取播放列表
spotify playlist get --name "我的最爱"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| play | 播放 | `spotify play` |
| pause | 暂停 | `spotify pause` |
| search | 搜索 | `spotify search --query "song"` |
| playlist | 播放列表 | `spotify playlist create --name x` |
| currently | 当前播放 | `spotify currently` |

### 自动化场景

```javascript
// 定时播放音乐
cron.add({
  schedule: { kind: "cron", cron: "0 9 * * *" },
  payload: { kind: "spotify", action: "play", playlist: "morning-vibes" }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **使用 Premium** - 某些功能需要 Premium 账户
2. **管理 Token** - 定期刷新访问令牌
3. **尊重版权** - 仅用于个人使用
4. **合理调用** - 遵守 API 速率限制

### 避免踩坑

1. **Token 过期** - 处理令牌刷新
2. **区域限制** - 某些内容在某些地区不可用
3. **网络问题** - 确保网络连接稳定

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 背景音乐 | 高 | 中 |
| 工作专注 | 高 | 高 |
| 派对播放 | 低 | 中 |
| 音乐发现 | 中 | 高 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/steipete/spotify-player)
- [Spotify API 文档](https://developer.spotify.com/documentation/web-api/)
- [Spotify 开发者控制台](https://developer.spotify.com/dashboard/)

---

## 💬 用户评价

> "工作时的背景音乐神器"  
> —— 开发者

> "自动化播放列表很方便"  
> —— 设计师

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
