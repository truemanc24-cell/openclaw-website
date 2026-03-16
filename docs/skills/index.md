# 🛠️ 技能市场

**来源**: [ClawHub](https://clawhub.ai/) - OpenClaw 官方技能市场

---

## 📚 什么是技能？

技能是 OpenClaw 的功能扩展模块，让你可以轻松添加新功能，无需编写代码。

### 技能能做什么？

- 📱 **社交媒体** - 自动发布、内容创作
- 🔍 **网络搜索** - 获取实时信息
- 📊 **数据分析** - 处理表格、生成报告
- 🎨 **创意工具** - 图片生成、视频剪辑
- 💼 **工作效率** - 邮件管理、日程安排
- 🏠 **智能家居** - 控制灯光、温度

---

## 🔥 热门技能

### 1. Feishu 文档技能 📄

**功能**: 创建、编辑、管理飞书文档

**使用场景**:
- 自动创建会议纪要
- 批量生成报告
- 团队协作编辑

**配置方法**:
```bash
# 安装技能
clawhub install feishu-doc

# 在 openclaw.json 中配置
{
  "skills": {
    "feishu-doc": {
      "enabled": true
    }
  }
}
```

**经验技巧**:
- ✅ 批量操作时注意速率限制
- ✅ 大文档分块处理更稳定
- ✅ 敏感信息使用加密存储

---

### 2. GitHub 技能 💻

**功能**: 管理 GitHub 仓库、Issues、PRs

**使用场景**:
- 自动回复 Issue
- CI/CD 状态监控
- 代码审查辅助

**配置方法**:
```bash
# 需要先安装 gh CLI
brew install gh

# 认证 GitHub
gh auth login
```

**经验技巧**:
- ✅ 使用 Personal Access Token 更稳定
- ✅ 配置 webhook 实现自动触发
- ✅ 定期清理过时的 Session

---

### 3. 天气技能 🌤️

**功能**: 获取实时天气和预报

**使用场景**:
- 每日天气提醒
- 出行计划参考
- 农业/户外活动规划

**配置方法**:
```bash
clawhub install weather
```

**经验技巧**:
- ✅ 使用 wttr.in 无需 API key
- ✅ 配置多个地点自动切换
- ✅ 设置恶劣天气预警

---

### 4. 浏览器自动化技能 🌐

**功能**: 控制浏览器执行自动化任务

**使用场景**:
- 网页数据抓取
- 自动化测试
- 批量操作

**配置方法**:
```bash
clawhub install browser

# 安装浏览器扩展
openclaw browser extension install
```

**经验技巧**:
- ✅ 使用 Playwright 更稳定
- ✅ 配置 Headless 模式节省资源
- ✅ 注意网站的反爬虫策略

---

## 📖 技能使用指南

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

### 使用技能

在聊天中直接调用：

```
@agent 帮我用 weather 技能查一下北京的天气
```

---

## 🎯 技能开发

想创建自己的技能？

### 技能结构

```
my-skill/
├── SKILL.md          # 技能描述
├── package.json      # 依赖配置
├── src/
│   └── index.js      # 主逻辑
└── README.md         # 使用说明
```

### 发布到 ClawHub

```bash
# 初始化技能
clawhub init my-skill

# 发布技能
clawhub publish my-skill
```

### 技能开发资源

- [技能开发文档](https://clawhub.ai/docs)
- [技能模板](https://github.com/openclaw/skill-template)
- [示例技能库](https://github.com/openclaw/skills)

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

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
