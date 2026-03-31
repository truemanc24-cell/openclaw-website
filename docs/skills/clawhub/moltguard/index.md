---
title: index
description: index 页面
---

# MoltGuard

**技能名**: `moltguard`  
**作者**: @ThomasLWang  
**下载量**: 15.7k ⭐ **Stars**: 77  
**版本**: 56  
**来源**: [ClawHub](https://clawhub.ai/ThomasLWang/moltguard)

---

## 📖 技能介绍

MoltGuard 是一个安全防护技能，为 OpenClaw 提供安全审计、风险检测和防护功能。

### 核心功能

- 🛡️ **安全审计** - 检查系统安全状态
- 🔒 **风险检测** - 识别潜在安全风险
- 🚫 **访问控制** - 限制敏感操作
- 📊 **安全报告** - 生成安全评分和报告

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install moltguard
```

### 2. 初始化配置

```bash
# 运行安全审计
moltguard audit

# 生成安全报告
moltguard report --output security-report.md
```

---

## 💡 使用示例

### 安全检查

```bash
# 全面安全检查
moltguard check --all

# 检查配置文件
moltguard check --config

# 检查权限
moltguard check --permissions
```

### 风险扫描

```bash
# 扫描敏感信息
moltguard scan --sensitive

# 扫描暴露的服务
moltguard scan --exposed

# 扫描过时依赖
moltguard scan --dependencies
```

### 防护规则

```bash
# 添加防护规则
moltguard rule add --name "no-rm" --pattern "rm -rf" --action block

# 列出规则
moltguard rule list

# 启用/禁用规则
moltguard rule toggle --id 1
```

---

## 🔧 高级用法

### 检查类型

| 类型 | 命令 | 说明 |
|------|------|------|
| 配置 | `check --config` | 检查配置文件安全 |
| 权限 | `check --permissions` | 检查权限设置 |
| 网络 | `check --network` | 检查网络暴露 |
| 依赖 | `check --deps` | 检查依赖安全 |
| 全部 | `check --all` | 全面检查 |

### 自动化防护

```javascript
// 在敏感操作前自动检查
const guard = new MoltGuard();
if (await guard.isSafe('rm -rf /tmp/*')) {
  exec('rm -rf /tmp/*');
} else {
  console.log('操作被阻止：不安全');
}
```

---

## ⚠️ 注意事项

### 最佳实践

1. **定期审计** - 每周运行安全检查
2. **及时更新** - 保持规则库最新
3. **最小权限** - 遵循最小权限原则
4. **日志记录** - 记录所有安全事件

### 避免踩坑

1. **不要禁用所有检查** - 保持基本防护
2. **不要忽略警告** - 认真处理每个警告
3. **不要过度限制** - 平衡安全和便利

---

## 📊 效果评估

### 安全指标

| 指标 | 使用前 | 使用后 | 提升 |
|------|--------|--------|------|
| 安全事件 | 高 | 低 | -90% |
| 风险发现 | 低 | 高 | +200% |
| 响应时间 | 慢 | 快 | +80% |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/ThomasLWang/moltguard)
- [安全最佳实践](https://clawhub.ai/docs/security)
- [OpenClaw 安全指南](https://openclaw.ai/security)

---

## 💬 用户评价

> "安全审计功能帮我们发现了很多隐患"  
> —— 安全工程师

> "防护规则很实用，避免了误操作"  
> —— 运维人员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
