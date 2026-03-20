# Feishu 文档技能

**评级**: ⭐⭐⭐⭐⭐  
**类别**: 社交媒体  
**来源**: [ClawHub](https://clawhub.ai/)

---

## 📖 详细介绍

Feishu 文档技能是 OpenClaw 的飞书集成工具，让你可以通过自然语言指令创建、编辑、管理飞书文档。

### 核心功能

- ✅ 创建飞书文档
- ✅ 编辑文档内容
- ✅ 管理文档权限
- ✅ 批量操作文档
- ✅ 文档内容读取
- ✅ 表格操作支持

### 使用场景

| 场景 | 说明 |
|------|------|
| 会议纪要 | 自动创建会议纪要文档 |
| 报告生成 | 批量生成周报/月报 |
| 团队协作 | 多人协作编辑文档 |
| 知识库 | 自动整理知识库文档 |

---

## 📥 安装方式

### 方法 1：ClawHub 安装（推荐）

```bash
clawhub install feishu-doc
```

### 方法 2：手动安装

```bash
# 克隆技能仓库
git clone https://github.com/openclaw/skill-feishu-doc.git ~/.openclaw/skills/feishu-doc

# 安装依赖
cd ~/.openclaw/skills/feishu-doc
npm install
```

### 配置飞书认证

在 `~/.openclaw/openclaw.json` 中添加：

```json
{
  "skills": {
    "feishu-doc": {
      "enabled": true,
      "config": {
        "appId": "cli_xxxxxxxxxxxxx",
        "appSecret": "xxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

---

## 🔧 使用方法

### 基本命令

```bash
# 创建文档
@agent 帮我创建一个飞书文档，标题是"会议纪要"

# 编辑文档
@agent 在文档中添加以下内容：...

# 读取文档
@agent 读取这个飞书文档的内容

# 批量操作
@agent 帮我创建 5 个周报文档
```

### 高级用法

#### 1. 批量创建文档

```
@agent 帮我创建 10 个文档，标题分别是"周报 - 第 1 周"到"周报 - 第 10 周"
```

#### 2. 文档模板

```
@agent 用这个模板创建文档：[模板内容]
```

#### 3. 权限管理

```
@agent 把这个文档分享给 xxx@company.com，设置为可编辑
```

---

## 📊 技能参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | `false` | 是否启用技能 |
| `appId` | string | - | 飞书 App ID |
| `appSecret` | string | - | 飞书 App Secret |
| `timeout` | number | `30` | 请求超时时间（秒） |

---

## 🔗 下载链接

| 来源 | 链接 |
|------|------|
| **ClawHub** | [clawhub.ai/skills/feishu-doc](https://clawhub.ai/skills/feishu-doc) |
| **GitHub** | [github.com/openclaw/skill-feishu-doc](https://github.com/openclaw/skill-feishu-doc) |
| **npm** | [npmjs.com/package/@openclaw/skill-feishu-doc](https://npmjs.com/package/@openclaw/skill-feishu-doc) |

---

## 💡 经验技巧

### ✅ 最佳实践

1. **批量操作时注意速率限制** - 飞书 API 有请求频率限制
2. **大文档分块处理** - 超过 10MB 的文档建议分块处理
3. **敏感信息加密** - 使用飞书的加密存储功能
4. **定期清理缓存** - 避免缓存占用过多空间

### ❌ 常见问题

| 问题 | 解决方案 |
|------|---------|
| 认证失败 | 检查 App ID 和 App Secret 是否正确 |
| 权限不足 | 确保飞书应用有文档读写权限 |
| 速率限制 | 添加请求延迟，避免频繁调用 |
| 文档创建失败 | 检查标题是否包含特殊字符 |

---

## 📝 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.2.0 | 2026-03-15 | 添加批量操作支持 |
| v1.1.0 | 2026-03-01 | 添加表格操作功能 |
| v1.0.0 | 2026-02-15 | 初始版本发布 |

---

## 🤝 社区支持

- **问题反馈**: [GitHub Issues](https://github.com/openclaw/skill-feishu-doc/issues)
- **讨论区**: [Discord](https://discord.gg/clawd)
- **文档**: [ClawHub Docs](https://clawhub.ai/docs/skills/feishu-doc)

---

**最后更新**: 2026-03-21  
**维护者**: OpenClaw 中文站
