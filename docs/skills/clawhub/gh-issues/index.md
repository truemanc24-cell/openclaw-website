---
title: index
description: index 页面
---

# GH Issues

**技能名**: `gh-issues`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

GH Issues 技能自动化处理 GitHub Issues，支持自动分配、修复和 PR 创建。

### 核心功能

- 📝 **Issue 管理** - 自动处理 Issues
- 🔧 **自动修复** - 自动修复 Bug
- 🔀 **PR 创建** - 自动创建 PR
- 📊 **进度跟踪** - 跟踪处理进度

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install gh-issues
```

### 2. 配置认证

```bash
# 登录 GitHub
gh auth login

# 验证状态
gh auth status
```

---

## 💡 使用示例

### Issue 处理

```bash
# 处理 Issues
gh-issues process --repo owner/repo

# 按标签过滤
gh-issues process --repo owner/repo --label bug

# 限制数量
gh-issues process --repo owner/repo --limit 5
```

### 自动修复

```bash
# 自动修复 Bug
gh-issues fix --repo owner/repo --issue 123

# 创建 PR
gh-issues pr --repo owner/repo --issue 123

# 监控进度
gh-issues monitor --repo owner/repo
```

### 批量处理

```bash
# 批量处理
gh-issues batch --repos "repo1,repo2,repo3"

# 定时处理
gh-issues cron --repo owner/repo --interval 60
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| process | 处理 Issues | `gh-issues process --repo x` |
| fix | 自动修复 | `gh-issues fix --issue 123` |
| pr | 创建 PR | `gh-issues pr --issue 123` |
| monitor | 监控 | `gh-issues monitor --repo x` |
| cron | 定时任务 | `gh-issues cron --interval 60` |

### 自动化流程

```javascript
// Issue 自动处理
ghIssues.on('issue', async (issue) => {
  if (issue.labels.includes('bug')) {
    await ghIssues.fix(issue);
    await ghIssues.createPR(issue);
  }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **代码审查** - 自动 PR 需要审查
2. **测试验证** - 修复后运行测试
3. **权限控制** - 限制自动操作权限
4. **通知设置** - 设置适当通知

### 避免踩坑

1. **不要全自动** - 重要修改需人工确认
2. **注意冲突** - 处理代码冲突
3. **CI 通过** - 确保 CI 通过

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| Bug 修复 | 高 | 高 |
| 文档更新 | 中 | 中 |
| 小功能 | 中 | 中 |
| 代码优化 | 低 | 中 |

---

## 🔗 相关资源

- [GitHub CLI](https://cli.github.com/)
- [GH Issues 文档](https://clawhub.ai/docs/gh-issues)
- [自动化最佳实践](https://clawhub.ai/docs/automation)

---

## 💬 用户评价

> "自动修复 Bug 很高效"  
> —— 开发者

> "减少了重复工作"  
> —— 维护者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
