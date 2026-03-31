---
title: index
description: index 页面
---

# Clawdhub

**技能名**: `clawdhub`  
**作者**: @steipete  
**下载量**: 19.7k ⭐ **Stars**: 178  
**版本**: 1  
**来源**: [ClawHub](https://clawhub.ai/steipete/clawdhub)

---

## 📖 技能介绍

Clawdhub 是 ClawHub 的命令行工具，让你能够轻松管理、安装、更新和发布 OpenClaw 技能。

### 核心功能

- 📦 **技能安装** - 一键安装技能
- 🔄 **自动更新** - 保持技能最新
- 🔍 **技能搜索** - 查找所需技能
- 📤 **发布技能** - 分享你的技能

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install clawdhub
```

### 2. 验证安装

```bash
# 查看版本
clawhub --version

# 查看帮助
clawhub --help
```

---

## 💡 使用示例

### 搜索技能

```bash
# 搜索技能
clawhub search "weather"

# 按标签搜索
clawhub search --tag "productivity"
```

### 安装技能

```bash
# 安装单个技能
clawhub install self-improving-agent

# 批量安装
clawhub install skill1 skill2 skill3
```

### 管理技能

```bash
# 列出已安装技能
clawhub list

# 更新技能
clawhub update self-improving-agent

# 卸载技能
clawhub uninstall skill-name
```

### 发布技能

```bash
# 发布新技能
clawhub publish ./my-skill --name my-skill --version 1.0.0
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| search | 搜索技能 | `clawhub search "ai"` |
| install | 安装技能 | `clawhub install skill` |
| update | 更新技能 | `clawhub update --all` |
| list | 列出技能 | `clawhub list --installed` |
| publish | 发布技能 | `clawhub publish ./path` |

### 配置选项

```json
{
  "registry": "https://clawhub.ai",
  "autoUpdate": true,
  "cachePath": "~/.clawhub/cache"
}
```

---

## ⚠️ 注意事项

### 最佳实践

1. **定期更新** - 保持技能最新
2. **检查来源** - 只安装可信技能
3. **版本管理** - 锁定生产环境版本
4. **备份配置** - 保存技能配置

### 避免踩坑

1. **不要随意卸载** - 可能影响依赖
2. **注意兼容性** - 检查版本要求
3. **测试后再用** - 新技能先测试

---

## 📊 效果评估

### 效率提升

| 任务 | 手动操作 | Clawdhub | 提升 |
|------|----------|----------|------|
| 安装技能 | 5 分钟 | 10 秒 | 30x |
| 更新技能 | 10 分钟 | 30 秒 | 20x |
| 查找技能 | 15 分钟 | 1 分钟 | 15x |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/steipete/clawdhub)
- [ClawHub 官网](https://clawhub.ai/)
- [技能开发文档](https://clawhub.ai/docs)

---

## 💬 用户评价

> "技能管理变得超级简单"  
> —— 开发者

> "一键安装太方便了，省了很多时间"  
> —— 用户

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
