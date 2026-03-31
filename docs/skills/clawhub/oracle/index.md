---
title: index
description: index 页面
---

# Oracle

**技能名**: `oracle`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Oracle 技能提供 Oracle CLI 使用最佳实践，支持提示词优化、文件打包、引擎选择等功能。

### 核心功能

- 💬 **提示优化** - 优化提示词效果
- 📦 **文件打包** - 打包文件给 AI
- 🔧 **引擎选择** - 选择合适的 AI 引擎
- 📊 **会话管理** - 管理 AI 会话

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install oracle
```

### 2. 配置引擎

```bash
# 列出可用引擎
oracle engines list

# 设置默认引擎
oracle config set --engine claude-3.5
```

---

## 💡 使用示例

### 提示优化

```bash
# 优化提示词
oracle optimize --prompt "帮我写代码"

# 获取提示模板
oracle template --type "code-review"

# 提示词分析
oracle analyze --prompt "复杂提示词..."
```

### 文件打包

```bash
# 打包文件
oracle bundle --files src/*.py --output bundle.txt

# 打包并发送
oracle ask --bundle bundle.txt --prompt "分析这些代码"

# 智能打包
oracle bundle --smart --context "代码审查"
```

### 会话管理

```bash
# 创建会话
oracle session create --name "project-x"

# 列出会话
oracle session list

# 恢复会话
oracle session resume --name "project-x"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| optimize | 优化提示 | `oracle optimize --prompt x` |
| bundle | 文件打包 | `oracle bundle --files x` |
| ask | 提问 | `oracle ask --prompt x` |
| session | 会话管理 | `oracle session create --name x` |
| engines | 引擎管理 | `oracle engines list` |

### 最佳实践

```javascript
// 复杂任务分解
const tasks = [
  { step: 1, prompt: "分析需求" },
  { step: 2, prompt: "设计方案" },
  { step: 3, prompt: "实现代码" }
];
for (const task of tasks) {
  await oracle.ask({ prompt: task.prompt, session: 'project-x' });
}
```

---

## ⚠️ 注意事项

### 最佳实践

1. **清晰提示** - 提示词要清晰具体
2. **上下文充分** - 提供足够上下文
3. **分步处理** - 复杂任务分步
4. **结果验证** - 验证 AI 输出

### 避免踩坑

1. **不要过度依赖** - AI 可能出错
2. **注意隐私** - 不发送敏感信息
3. **Token 限制** - 注意上下文长度

---

## 📊 效果评估

### 支持引擎

| 引擎 | 特点 | 适用场景 |
|------|------|----------|
| Claude | 平衡 | 通用任务 |
| GPT-4 | 强大 | 复杂任务 |
| Gemini | 快速 | 简单任务 |
| Local | 隐私 | 敏感任务 |

---

## 🔗 相关资源

- [Oracle CLI 文档](https://clawhub.ai/docs/oracle)
- [提示词工程](https://clawhub.ai/docs/prompt-engineering)
- [AI 最佳实践](https://clawhub.ai/docs/ai-best-practices)

---

## 💬 用户评价

> "提示优化很有用"  
> —— 开发者

> "文件打包很方便"  
> —— 研究员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
