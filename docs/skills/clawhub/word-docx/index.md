---
title: index
description: index 页面
---

# Word / DOCX

**技能名**: `word-docx`  
**作者**: @ivangdavila  
**下载量**: 18.8k ⭐ **Stars**: 62  
**版本**: 3  
**来源**: [ClawHub](https://clawhub.ai/ivangdavila/word-docx)

---

## 📖 技能介绍

Word / DOCX 技能让你能够 programmatically 创建、编辑和管理 Word 文档，实现文档自动化。

### 核心功能

- 📄 **文档创建** - 创建新的 Word 文档
- ✏️ **内容编辑** - 添加/修改文本、表格、图片
- 📋 **表格操作** - 创建和编辑表格
- 🖼️ **图片插入** - 插入和管理图片

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install word-docx
```

### 2. 依赖安装

```bash
# 安装 Python 依赖
pip install python-docx
```

---

## 💡 使用示例

### 创建文档

```bash
# 创建新文档
word-docx create --output report.docx --title "月度报告"

# 添加内容
word-docx append --file report.docx --text "本月工作总结..."
```

### 编辑文档

```bash
# 替换文本
word-docx replace --file report.docx --find "旧文本" --replace "新文本"

# 添加表格
word-docx table --file report.docx --rows 5 --cols 3
```

### 批量处理

```bash
# 批量创建文档
for name in team1 team2 team3; do
  word-docx create --output ${name}_report.docx --title "${name}报告"
done
```

---

## 🔧 高级用法

### 文档元素

| 元素 | 命令 | 说明 |
|------|------|------|
| 标题 | `--heading` | 添加标题 |
| 段落 | `--paragraph` | 添加段落 |
| 表格 | `--table` | 添加表格 |
| 图片 | `--image` | 插入图片 |
| 列表 | `--list` | 添加列表 |

### 模板使用

```javascript
// 使用模板创建文档
const doc = new WordDocument('template.docx');
doc.fillTemplate({
  name: '张三',
  date: '2026-03-16',
  content: '报告内容...'
});
doc.save('output.docx');
```

---

## ⚠️ 注意事项

### 最佳实践

1. **使用模板** - 统一文档格式
2. **备份原文档** - 编辑前先备份
3. **测试输出** - 检查格式是否正确
4. **处理大文件** - 分批处理避免内存问题

### 避免踩坑

1. **注意编码** - 使用 UTF-8 避免乱码
2. **图片大小** - 压缩图片避免文件过大
3. **兼容性** - 测试在不同 Word 版本的表现

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 报告生成 | 高 | 高 |
| 合同创建 | 中 | 高 |
| 文档批量处理 | 中 | 高 |
| 模板填充 | 高 | 中 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/ivangdavila/word-docx)
- [python-docx 文档](https://python-docx.readthedocs.io/)
- [Word 格式规范](https://docs.microsoft.com/word)

---

## 💬 用户评价

> "自动生成报告太方便了，每天节省 1 小时"  
> —— 项目经理

> "模板填充功能很实用"  
> —— 行政人员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
