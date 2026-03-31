---
title: index
description: index 页面
---

# Healthcheck

**技能名**: `healthcheck`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Healthcheck 技能提供主机安全加固和风险评估功能，支持安全审计和配置检查。

### 核心功能

- 🔒 **安全审计** - 系统安全检查
- 🛡️ **风险检测** - 识别安全风险
- 🔧 **配置加固** - 安全配置建议
- 📊 **报告生成** - 生成安全报告

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install healthcheck
```

### 2. 运行检查

```bash
# 全面检查
healthcheck audit

# 快速检查
healthcheck quick

# 生成报告
healthcheck report --output security-report.md
```

---

## 💡 使用示例

### 安全检查

```bash
# 检查防火墙
healthcheck check --firewall

# 检查 SSH
healthcheck check --ssh

# 检查更新
healthcheck check --updates

# 检查权限
healthcheck check --permissions
```

### 安全加固

```bash
# 加固配置
healthcheck harden --all

# 加固 SSH
healthcheck harden --ssh

# 加固防火墙
healthcheck harden --firewall
```

### 定时检查

```bash
# 设置定时检查
healthcheck cron --schedule "0 2 * * *"

# 检查计划
healthcheck schedule list
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| audit | 全面审计 | `healthcheck audit` |
| check | 单项检查 | `healthcheck check --ssh` |
| harden | 加固 | `healthcheck harden --all` |
| report | 报告 | `healthcheck report --output x.md` |
| cron | 定时任务 | `healthcheck cron --schedule x` |

### 风险等级

| 等级 | 颜色 | 说明 |
|------|------|------|
| Critical | 🔴 | 严重风险 |
| High | 🟠 | 高风险 |
| Medium | 🟡 | 中风险 |
| Low | 🟢 | 低风险 |

---

## ⚠️ 注意事项

### 最佳实践

1. **定期检查** - 每周运行安全检查
2. **及时修复** - 发现风险及时修复
3. **备份配置** - 加固前备份配置
4. **日志记录** - 记录所有更改

### 避免踩坑

1. **不要盲目加固** - 理解每个加固项
2. **测试环境** - 先在测试环境测试
3. **业务影响** - 评估对业务的影响

---

## 📊 效果评估

### 检查项目

| 项目 | 支持 | 重要性 |
|------|------|--------|
| 防火墙 | ✅ | 高 |
| SSH 配置 | ✅ | 高 |
| 系统更新 | ✅ | 高 |
| 文件权限 | ✅ | 中 |
| 用户权限 | ✅ | 中 |

---

## 🔗 相关资源

- [安全最佳实践](https://clawhub.ai/docs/security)
- [Linux 加固指南](https://clawhub.ai/docs/linux-hardening)
- [OpenClaw 安全](https://clawhub.ai/docs/openclaw-security)

---

## 💬 用户评价

> "安全检查很全面"  
> —— 运维工程师

> "发现了很多安全隐患"  
> —— 安全工程师

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
