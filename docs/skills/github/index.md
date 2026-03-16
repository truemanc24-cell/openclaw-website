# GitHub 技能

**技能名称**: `github`  
**版本**: 1.0.0  
**来源**: [ClawHub](https://clawhub.ai/)

---

## 📖 技能介绍

GitHub 技能让你可以通过自然语言管理 GitHub 仓库、Issues、PRs，实现自动化代码管理。

### 核心功能

- 📦 **仓库管理** - 创建、克隆、推送仓库
- 🐛 **Issue 管理** - 创建、评论、关闭 Issue
- 🔀 **PR 操作** - 创建、审查、合并 Pull Request
- 🏃 **CI/CD** - 查看构建状态、触发工作流
- 📊 **数据统计** - 仓库统计、贡献分析

---

## 🚀 快速开始

### 1. 安装 GitHub CLI

```bash
# macOS
brew install gh

# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Windows (PowerShell)
winget install --id GitHub.cli
```

### 2. 认证 GitHub

```bash
gh auth login
```

选择：
- GitHub.com
- HTTPS 协议
- Login with a web browser

### 3. 验证认证

```bash
gh auth status
```

应该显示：
```
✓ Logged in to github.com as your-username
```

---

## 💡 使用示例

### 创建仓库

```
@dev 帮我创建一个 GitHub 仓库，名字叫 my-project，公开的
```

### 查看 Issues

```
@dev 查看 openclaw/openclaw 的最新 Issues
```

### 创建 PR

```
@dev 帮我创建一个 PR，从 feature-branch 合并到 main
```

### 查看 CI 状态

```
@dev 查看最新一次 CI 构建的状态
```

### 代码审查

```
@dev 审查 PR #123 的代码变更
```

---

## 🔧 高级用法

### 自动化 Issue 回复

```javascript
// 自动回复特定标签的 Issue
gh issue list --label "bug" | while read issue; do
  gh issue comment $issue --body "已收到，正在处理..."
done
```

### 批量管理 PR

```bash
# 列出所有待审查的 PR
gh pr list --state open

# 批量添加标签
gh pr edit 123 --add-label "needs-review"
```

### CI/CD 集成

```bash
# 查看构建日志
gh run view --log

# 重新运行失败的构建
gh run rerun --failed
```

---

## ⚠️ 注意事项

### 认证方式

**推荐**: Personal Access Token (Fine-grained)

1. 访问 https://github.com/settings/tokens
2. 生成新 Token（Fine-grained）
3. 选择需要的权限：
   - `contents`: 仓库内容
   - `issues`: Issues 管理
   - `pull_requests`: PR 管理
   - `workflows`: CI/CD

### 速率限制

| 认证方式 | 限制 |
|---------|------|
| 未认证 | 60 次/小时 |
| 已认证 | 5000 次/小时 |

### 常见问题

**Q: gh auth login 失败？**  
A: 检查网络连接，或改用 Token 方式：`export GH_TOKEN=xxx`

**Q: 权限不足？**  
A: 检查 Token 权限配置，确保有所需 scope

**Q: 仓库找不到？**  
A: 确认仓库名称正确，且有访问权限

---

## 📊 最佳实践

### ✅ 推荐做法

1. **使用 Fine-grained Token** - 最小权限原则
2. **配置 Git 用户信息** - `git config user.name/email`
3. **使用 SSH 密钥** - 避免每次输入密码
4. **定期清理 Token** - 撤销不用的 Token

### ❌ 避免踩坑

1. **不要提交 Token** - 使用环境变量
2. **不要滥用 API** - 注意速率限制
3. **不要忽略错误** - 及时处理失败

---

## 🔗 相关资源

- [GitHub CLI 文档](https://cli.github.com/manual/)
- [GitHub API 文档](https://docs.github.com/en/rest)
- [ClawHub 技能页面](https://clawhub.ai/skills/github)

---

## 💬 用户反馈

> "用这个技能自动管理 Issue，效率提升太多！"  
> —— 开源项目维护者

> "CI 状态监控功能很实用，不用手动刷新页面了"  
> —— 全栈开发者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
