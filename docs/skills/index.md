---
title: index
description: index 页面
---

# 🛠️ 技能市场 - Trueworld Labs

**来源**: [ClawHub](https://clawhub.ai/) - OpenClaw 官方技能市场

> **提示**: 技能让你的 AI 助手更强大！每个技能都是一个独立的能力模块，可以扩展 AI 的功能边界。

---

## 📋 热门技能推荐

### 🔥 新手必备
| 技能 | 用途 | 难度 |
|------|------|------|
| 天气 | 查询实时天气 | ⭐ 简单 |
| Tavily 搜索 | 搜索网络信息 | ⭐⭐ 中等 |
| 自我改进 | 记录学习，持续进步 | ⭐⭐ 中等 |

### 💼 工作效率
| 技能 | 用途 | 难度 |
|------|------|------|
| GitHub | 管理代码仓库 | ⭐⭐⭐ 进阶 |
| Feishu 文档 | 飞书文档管理 | ⭐⭐ 中等 |
| PDF 编辑 | PDF 文档处理 | ⭐⭐ 中等 |

### 🚀 高级用法
| 技能 | 用途 | 难度 |
|------|------|------|
| 浏览器自动化 | 网页自动化任务 | ⭐⭐⭐⭐ 高级 |
| 多搜索引擎 | 17 个引擎集成搜索 | ⭐⭐⭐ 进阶 |

---

## 📋 完整技能列表

| 技能名称 | 用途 | 评级指数 |
|---------|------|---------|
| [Feishu 文档](/skills/feishu-doc/) | 创建、编辑、管理飞书文档 | ⭐⭐⭐⭐⭐ |
| [GitHub](/skills/github/) | 管理 GitHub 仓库、Issues、PRs | ⭐⭐⭐⭐⭐ |
| [天气](/skills/weather/) | 获取实时天气和预报 | ⭐⭐⭐⭐ |
| [浏览器自动化](/skills/browser/) | 控制浏览器执行自动化任务 | ⭐⭐⭐⭐⭐ |
| [Tavily 搜索](/skills/tavily-search/) | 使用 Tavily API 搜索网络 | ⭐⭐⭐⭐⭐ |
| [PDF 编辑](/skills/nano-pdf/) | 编辑 PDF 文档，支持自然语言指令 | ⭐⭐⭐⭐ |
| [自我改进](/skills/self-improving-agent/) | 记录学习和错误，持续提升能力 | ⭐⭐⭐⭐⭐ |
| [技能推荐](/skills/skill-vetter/) | 推荐和验证 OpenClaw 技能 | ⭐⭐⭐⭐ |
| [多搜索引擎](/skills/multi-search-engine/) | 17 个搜索引擎集成搜索 | ⭐⭐⭐⭐⭐ |
| [内容总结](/skills/summarize/) | 总结 URL、播客、本地文件内容 | ⭐⭐⭐⭐ |

---

## 🔍 按类别浏览

### 📱 社交媒体
- Feishu 文档
- 技能推荐

### 🔍 搜索工具
- Tavily 搜索
- 多搜索引擎

### 💼 工作效率
- GitHub
- PDF 编辑
- 自我改进

### 🌐 网络工具
- 浏览器自动化
- 天气

---

## 📖 使用指南

### 安装技能

```bash
# 查看可用技能
clawhub list

# 安装技能
clawhub install <skill-name>

# 更新技能
clawhub update <skill-name>
```

### 配置技能

在 `~/.openclaw/openclaw.json` 中添加：

```json
{
  "skills": {
    "<skill-name>": {
      "enabled": true,
      "config": {
        // 技能特定配置
      }
    }
  }
}
```

---

## 💡 最佳实践

### ✅ 推荐做法

1. **从官方技能开始** - 质量有保证
2. **阅读文档** - 了解配置选项
3. **测试环境先行** - 避免影响生产
4. **定期更新** - 获取最新功能
5. **分享经验** - 在 ClawHub 评论

### ❌ 避免踩坑

1. **不要混用多个版本** - 可能冲突
2. **不要忽略错误日志** - 及时排查
3. **不要过度依赖** - 关键操作人工确认
4. **不要泄露 API Key** - 使用环境变量

---

## 🔗 相关链接

- [ClawHub 官网](https://clawhub.ai/)
- [技能开发文档](https://clawhub.ai/docs)
- [GitHub 仓库](https://github.com/openclaw/skills)
- [Discord 社区](https://discord.gg/clawd)

---

**最后更新**: 2026-03-21  
**维护**: OpenClaw 中文站
