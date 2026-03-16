# Data Analysis

**技能名**: `data-analysis`  
**作者**: @ivangdavila  
**下载量**: 10.6k ⭐ **Stars**: 29  
**版本**: 3  
**来源**: [ClawHub](https://clawhub.ai/ivangdavila/data-analysis)

---

## 📖 技能介绍

Data Analysis 技能提供数据处理和分析能力，支持多种数据格式和统计方法。

### 核心功能

- 📊 **数据导入** - 支持 CSV/Excel/JSON 等格式
- 📈 **统计分析** - 描述统计、假设检验
- 📉 **数据可视化** - 生成图表和报告
- 🤖 **机器学习** - 基础 ML 模型支持

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install data-analysis
```

### 2. 依赖安装

```bash
# 安装 Python 依赖
pip install pandas numpy matplotlib seaborn scikit-learn
```

---

## 💡 使用示例

### 数据导入

```bash
# 导入 CSV
data-analysis load --file data.csv --format csv

# 导入 Excel
data-analysis load --file data.xlsx --format excel --sheet "Sheet1"

# 导入 JSON
data-analysis load --file data.json --format json
```

### 统计分析

```bash
# 描述统计
data-analysis stats --file data.csv --all

# 相关性分析
data-analysis correlate --file data.csv --columns col1,col2

# 假设检验
data-analysis test --file data.csv --test t-test
```

### 数据可视化

```bash
# 生成柱状图
data-analysis plot --file data.csv --type bar --x category --y value

# 生成折线图
data-analysis plot --file data.csv --type line --x date --y sales

# 生成散点图
data-analysis plot --file data.csv --type scatter --x col1 --y col2
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| load | 加载数据 | `data-analysis load --file x.csv` |
| stats | 统计分析 | `data-analysis stats --all` |
| plot | 可视化 | `data-analysis plot --type bar` |
| clean | 数据清洗 | `data-analysis clean --remove-na` |
| export | 导出结果 | `data-analysis export --format pdf` |

### 分析流程

```javascript
// 完整分析流程
const data = await loadCSV('data.csv');
const cleaned = await clean(data);
const stats = await analyze(cleaned);
const chart = await visualize(stats);
await export(chart, 'report.pdf');
```

---

## ⚠️ 注意事项

### 最佳实践

1. **数据清洗** - 先清洗再分析
2. **探索分析** - 先了解数据分布
3. **可视化** - 用图表展示结果
4. **文档记录** - 记录分析过程

### 避免踩坑

1. **数据质量** - 注意缺失值和异常值
2. **过拟合** - 机器学习注意验证
3. **隐私保护** - 脱敏敏感数据

---

## 📊 效果评估

### 支持格式

| 格式 | 读取 | 写入 |
|------|------|------|
| CSV | ✅ | ✅ |
| Excel | ✅ | ✅ |
| JSON | ✅ | ✅ |
| SQL | ✅ | ✅ |
| Parquet | ✅ | ✅ |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/ivangdavila/data-analysis)
- [Pandas 文档](https://pandas.pydata.org/docs/)
- [数据分析最佳实践](https://clawhub.ai/docs/data-analysis)

---

## 💬 用户评价

> "数据分析流程自动化，效率提升明显"  
> —— 数据分析师

> "可视化功能很强大"  
> —— 业务分析师

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
