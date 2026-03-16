# Excel / XLSX

**技能名**: `excel-xlsx`  
**作者**: @ivangdavila  
**下载量**: 15.5k ⭐ **Stars**: 39  
**版本**: 3  
**来源**: [ClawHub](https://clawhub.ai/ivangdavila/excel-xlsx)

---

## 📖 技能介绍

Excel / XLSX 技能让你能够 programmatically 创建、编辑和管理 Excel 表格，实现数据处理自动化。

### 核心功能

- 📊 **表格创建** - 创建新的 Excel 文件
- ✏️ **数据编辑** - 读写单元格数据
- 📈 **公式计算** - 支持 Excel 公式
- 🎨 **格式设置** - 设置样式和格式

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install excel-xlsx
```

### 2. 依赖安装

```bash
# 安装 Python 依赖
pip install openpyxl
```

---

## 💡 使用示例

### 创建表格

```bash
# 创建新表格
excel-xlsx create --output data.xlsx --sheet "数据"

# 添加表头
excel-xlsx write --file data.xlsx --row 1 --values "姓名，年龄，城市"
```

### 数据操作

```bash
# 写入数据
excel-xlsx write --file data.xlsx --row 2 --values "张三，25，北京"

# 读取数据
excel-xlsx read --file data.xlsx --range "A1:C10"

# 更新单元格
excel-xlsx update --file data.xlsx --cell B2 --value 26
```

### 公式计算

```bash
# 添加公式
excel-xlsx formula --file data.xlsx --cell C2 --formula "=A2+B2"

# 求和
excel-xlsx formula --file data.xlsx --cell D1 --formula "=SUM(D2:D100)"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| create | 创建表格 | `excel-xlsx create --output x.xlsx` |
| read | 读取数据 | `excel-xlsx read --range A1:B10` |
| write | 写入数据 | `excel-xlsx write --row 1 --values x` |
| formula | 公式 | `excel-xlsx formula --formula "=SUM(A1:A10)"` |
| format | 格式 | `excel-xlsx format --cell A1 --bold` |

### 数据处理

```javascript
// 批量导入数据
const wb = new ExcelWorkbook();
const sheet = wb.addSheet('数据');
data.forEach((row, i) => {
  sheet.getRow(i + 1).values = row;
});
wb.save('output.xlsx');
```

---

## ⚠️ 注意事项

### 最佳实践

1. **数据验证** - 导入前验证数据格式
2. **备份文件** - 编辑前先备份
3. **分批处理** - 大数据分批处理
4. **清理缓存** - 定期清理临时文件

### 避免踩坑

1. **注意数据类型** - 数字/文本/日期要正确
2. **公式引用** - 确保引用范围正确
3. **文件大小** - 避免单个文件过大

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 数据报表 | 高 | 高 |
| 数据导入导出 | 高 | 高 |
| 数据分析 | 中 | 高 |
| 自动化报告 | 中 | 高 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/ivangdavila/excel-xlsx)
- [openpyxl 文档](https://openpyxl.readthedocs.io/)
- [Excel 公式参考](https://support.microsoft.com/excel)

---

## 💬 用户评价

> "数据处理效率提升 10 倍不止"  
> —— 数据分析师

> "自动化报表太香了"  
> —— 财务人员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
