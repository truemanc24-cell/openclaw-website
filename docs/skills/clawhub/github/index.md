# GitHub

**技能名**: `github`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

GitHub 技能提供 GitHub 操作能力，支持 Issues、PRs、CI 查看、代码审查等功能。

### 核心功能

- 📝 **Issues 管理** - 创建/评论/关闭 Issues
- 🔀 **PR 操作** - 创建/审查/合并 PRs
- 🏃 **CI 查看** - 查看 CI 运行状态
- 📊 **仓库管理** - 仓库统计和信息

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install github
```

### 2. 配置认证

```bash
# 登录 GitHub
gh auth login

# 验证登录
gh auth status
```

---

## 💡 使用示例

### Issues 管理

```bash
# 创建 Issue
gh issue create --title "Bug 报告" --body "问题描述..."

# 列出 Issues
gh issue list --state open

# 评论 Issue
gh issue comment 123 --body "已修复"
```

### PR 操作

```bash
# 创建 PR
gh pr create --title "修复 bug" --body "修改内容..."

# 列出 PRs
gh pr list --state open

# 审查 PR
gh pr review 123 --approve
```

### CI 查看

```bash
# 查看 CI 运行
gh run list

# 查看运行详情
gh run view 12345

# 重新运行
gh run rerun 12345
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| issue | Issues 管理 | `gh issue create --title x` |
| pr | PR 操作 | `gh pr create --title x` |
| run | CI 运行 | `gh run list` |
| repo | 仓库管理 | `gh repo view` |
| api | API 调用 | `gh api /user` |

### 自动化流程

```javascript
// Issue 自动分配
gh.issue.on('opened', async (issue) => {
  if (issue.labels.includes('bug')) {
    await gh.issue.addAssignee(issue.number, '@dev-team');
  }
});
```

---

## ⚠️ 注意事项

### 最佳实践

1. **描述清晰** - Issue/PR 描述详细
2. **及时审查** - 快速响应 PR 审查
3. **CI 通过** - 确保 CI 通过再合并
4. **分支管理** - 使用功能分支

### 避免踩坑

1. **不要直接推 main** - 使用 PR 流程
2. **注意权限** - 确保有操作权限
3. **Token 安全** - 妥善保管 Token

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| Issue 跟踪 | 高 | 高 |
| PR 审查 | 高 | 高 |
| CI 监控 | 高 | 高 |
| 代码审查 | 高 | 高 |

---

## 🔗 相关资源

- [GitHub CLI 文档](https://cli.github.com/)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [OpenClaw GitHub 技能](https://clawhub.ai/skills/github)

---

## 💬 用户评价

> "GitHub 操作自动化效率高"  
> —— 开发者

> "CI 监控很方便"  
> —— DevOps 工程师

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
