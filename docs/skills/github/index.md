# GitHub 技能

**评级**: ⭐⭐⭐⭐⭐  
**类别**: 工作效率  
**来源**: [ClawHub](https://clawhub.ai/)

---

## 📖 详细介绍

GitHub 技能是 OpenClaw 的 GitHub 集成工具，让你可以通过自然语言管理 GitHub 仓库、Issues、PRs 等。

### 核心功能

- ✅ 管理 GitHub 仓库
- ✅ 创建/回复 Issues
- ✅ 管理 Pull Requests
- ✅ CI/CD状态监控
- ✅ 代码审查辅助
- ✅ 仓库数据分析

### 使用场景

| 场景 | 说明 |
|------|------|
| Issue 管理 | 自动回复、分类、标签管理 |
| PR 审查 | 自动检查代码规范 |
| 仓库监控 | CI/CD状态通知 |
| 数据分析 | 仓库统计、贡献分析 |

---

## 📥 安装方式

### 前置要求

```bash
# 安装 GitHub CLI
brew install gh

# 认证 GitHub
gh auth login
```

### 安装技能

```bash
clawhub install github
```

### 配置认证

在 `~/.openclaw/openclaw.json` 中添加：

```json
{
  "skills": {
    "github": {
      "enabled": true,
      "config": {
        "token": "ghp_xxxxxxxxxxxxx"
      }
    }
  }
}
```

---

## 🔧 使用方法

### 基本命令

```bash
# 查看仓库信息
@agent 查看我的 xxx 仓库信息

# 创建 Issue
@agent 在 xxx 仓库创建一个 Issue，标题是"Bug 修复"

# 查看 PR 状态
@agent 查看 xxx 仓库的 PR 状态

# 回复 Issue
@agent 回复 Issue #123：这个问题已经修复
```

### 高级用法

#### 1. 自动回复 Issue

```
@agent 监控我的仓库，有新 Issue 时自动回复"收到，会尽快处理"
```

#### 2. PR 自动审查

```
@agent 审查 PR #456，检查代码规范和测试覆盖率
```

#### 3. CI/CD监控

```
@agent 监控 xxx 仓库的 CI 状态，失败时通知我
```

---

## 📊 技能参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | `false` | 是否启用技能 |
| `token` | string | - | GitHub Personal Access Token |
| `owner` | string | - | 默认仓库所有者 |
| `repo` | string | - | 默认仓库名 |

---

## 🔗 下载链接

| 来源 | 链接 |
|------|------|
| **ClawHub** | [clawhub.ai/skills/github](https://clawhub.ai/skills/github) |
| **GitHub** | [github.com/openclaw/skill-github](https://github.com/openclaw/skill-github) |
| **npm** | [npmjs.com/package/@openclaw/skill-github](https://npmjs.com/package/@openclaw/skill-github) |

---

## 💡 经验技巧

### ✅ 最佳实践

1. **使用 Personal Access Token** - 比密码更安全
2. **配置 webhook** - 实现自动触发
3. **定期清理 Session** - 避免 token 过期
4. **设置适当的权限** - 最小权限原则

### ❌ 常见问题

| 问题 | 解决方案 |
|------|---------|
| 认证失败 | 检查 token 是否有效 |
| 权限不足 | 确保 token 有所需权限 |
| 速率限制 | 添加请求延迟 |
| webhook 不触发 | 检查 webhook 配置 |

---

**最后更新**: 2026-03-21  
**维护者**: OpenClaw 中文站
