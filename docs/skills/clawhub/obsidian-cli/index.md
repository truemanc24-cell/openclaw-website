---
title: index
description: index 页面
---

# Obsidian CLI

**技能名**: `obsidian-cli`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Obsidian CLI 技能提供 Obsidian 笔记自动化功能，支持笔记创建、搜索、链接等操作。

### 核心功能

- 📝 **笔记管理** - 创建/编辑/删除笔记
- 🔍 **笔记搜索** - 搜索笔记内容
- 🔗 **链接管理** - 管理笔记链接
- 📊 **图谱分析** - 分析笔记关系

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install obsidian-cli
```

### 2. 配置 Vault

```bash
# 设置 Vault 路径
obsidian config set --vault ~/ObsidianVault

# 验证配置
obsidian config show
```

---

## 💡 使用示例

### 笔记管理

```bash
# 创建笔记
obsidian note create --title "会议记录" --content "# 会议纪要\n\n内容..."

# 打开笔记
obsidian note open --title "会议记录"

# 删除笔记
obsidian note delete --title "草稿"
```

### 搜索笔记

```bash
# 搜索内容
obsidian search --query "项目计划"

# 按标签搜索
obsidian search --tag "#work"

# 搜索未链接笔记
obsidian search --orphans
```

### 链接管理

```bash
# 添加链接
obsidian link add --from "note1" --to "note2"

# 查看链接
obsidian link list --note "note1"

# 修复断链
obsidian link fix
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| note | 笔记管理 | `obsidian note create --title x` |
| search | 搜索 | `obsidian search --query x` |
| link | 链接管理 | `obsidian link add --from x` |
| graph | 图谱分析 | `obsidian graph --output graph.png` |
| tag | 标签管理 | `obsidian tag list` |

### 模板使用

```bash
# 使用模板创建
obsidian note create --template "meeting" --vars "title=周会,date=2026-03-16"

# 列出模板
obsidian template list
```

---

## ⚠️ 注意事项

### 最佳实践

1. **命名规范** - 使用一致的命名
2. **标签系统** - 建立标签体系
3. **定期备份** - 定期备份 Vault
4. **链接维护** - 维护笔记链接

### 避免踩坑

1. **不要过度组织** - 保持简单
2. **及时更新** - 保持笔记最新
3. **同步问题** - 注意多设备同步

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 知识管理 | 高 | 高 |
| 会议记录 | 高 | 高 |
| 项目管理 | 中 | 高 |
| 学习笔记 | 高 | 高 |

---

## 🔗 相关资源

- [Obsidian 官网](https://obsidian.md/)
- [Obsidian CLI 文档](https://clawhub.ai/docs/obsidian-cli)
- [知识管理最佳实践](https://clawhub.ai/docs/knowledge-management)

---

## 💬 用户评价

> "笔记自动化很方便"  
> —— 知识工作者

> "搜索功能很强大"  
> —— 研究员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
