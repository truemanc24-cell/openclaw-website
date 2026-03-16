# Model Usage

**技能名**: `model-usage`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Model Usage 技能提供模型使用统计功能，支持按模型统计使用量和成本。

### 核心功能

- 📊 **使用统计** - 统计模型使用量
- 💰 **成本分析** - 分析使用成本
- 📈 **趋势分析** - 使用趋势分析
- 📋 **报告生成** - 生成使用报告

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install model-usage
```

### 2. 无需配置

本技能自动读取本地使用数据。

---

## 💡 使用示例

### 使用统计

```bash
# 查看总使用量
model-usage stats

# 按模型统计
model-usage stats --by-model

# 查看今日使用
model-usage stats --today
```

### 成本分析

```bash
# 查看总成本
model-usage cost

# 按模型分析成本
model-usage cost --by-model

# 月度成本
model-usage cost --month 2026-03
```

### 趋势分析

```bash
# 使用趋势
model-usage trend --days 30

# 成本趋势
model-usage cost-trend --days 30

# 导出报告
model-usage report --output usage-report.md
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| stats | 使用统计 | `model-usage stats` |
| cost | 成本分析 | `model-usage cost --by-model` |
| trend | 趋势分析 | `model-usage trend --days 30` |
| report | 报告 | `model-usage report --output x.md` |
| export | 导出 | `model-usage export --format csv` |

### 报告示例

```markdown
## 模型使用报告

### 总览
- 总调用次数：10,000
- 总 Token 数：5,000,000
- 总成本：$50.00

### 按模型
| 模型 | 调用次数 | Token 数 | 成本 |
|------|----------|----------|------|
| Claude | 5,000 | 3,000,000 | $30 |
| GPT-4 | 3,000 | 1,500,000 | $15 |
| Local | 2,000 | 500,000 | $5 |
```

---

## ⚠️ 注意事项

### 最佳实践

1. **定期查看** - 每周查看使用情况
2. **成本管控** - 设置成本预警
3. **优化使用** - 选择合适的模型
4. **记录分析** - 记录使用模式

### 避免踩坑

1. **不要超支** - 设置预算限制
2. **模型选择** - 根据需求选择模型
3. **Token 管理** - 优化 Token 使用

---

## 📊 效果评估

### 支持模型

| 模型 | 支持 | 成本跟踪 |
|------|------|----------|
| Claude | ✅ | ✅ |
| GPT-4 | ✅ | ✅ |
| Gemini | ✅ | ✅ |
| Local | ✅ | ✅ |

---

## 🔗 相关资源

- [成本优化指南](https://clawhub.ai/docs/cost-optimization)
- [模型选择指南](https://clawhub.ai/docs/model-selection)
- [使用统计 API](https://clawhub.ai/docs/usage-api)

---

## 💬 用户评价

> "成本分析很清晰"  
> —— 项目经理

> "帮助优化了模型使用"  
> —— 开发者

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
