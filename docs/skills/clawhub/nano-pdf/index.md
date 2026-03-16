# Nano PDF

**技能名**: `nano-pdf`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Nano PDF 技能提供 PDF 编辑功能，支持自然语言指令编辑 PDF 文档。

### 核心功能

- ✏️ **PDF 编辑** - 使用自然语言编辑
- 📄 **页面操作** - 添加/删除/旋转页面
- 📝 **文本编辑** - 添加/修改文本
- 🔒 **PDF 保护** - 加密/解密 PDF

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install nano-pdf
```

### 2. 无需配置

本技能无需额外配置，直接使用。

---

## 💡 使用示例

### 基础编辑

```bash
# 删除页面
nano-pdf edit --file doc.pdf --instruction "删除第 3 页"

# 旋转页面
nano-pdf edit --file doc.pdf --instruction "旋转第 1 页 90 度"

# 合并 PDF
nano-pdf merge --files doc1.pdf,doc2.pdf --output merged.pdf
```

### 文本操作

```bash
# 添加文本
nano-pdf edit --file doc.pdf --instruction "在第 1 页添加'机密'水印"

# 提取文本
nano-pdf extract --file doc.pdf --output text.txt

# 搜索文本
nano-pdf search --file doc.pdf --query "关键词"
```

### 页面管理

```bash
# 提取页面
nano-pdf extract-pages --file doc.pdf --pages 1-5 --output extracted.pdf

# 重新排序
nano-pdf reorder --file doc.pdf --order "2,1,3,4,5"

# 添加页眉页脚
nano-pdf edit --file doc.pdf --instruction "添加页眉'公司文档'"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| edit | 编辑 | `nano-pdf edit --instruction x` |
| merge | 合并 | `nano-pdf merge --files x,y` |
| split | 分割 | `nano-pdf split --file x.pdf` |
| extract | 提取 | `nano-pdf extract --pages 1-5` |
| protect | 加密 | `nano-pdf protect --password x` |

### 批量处理

```bash
# 批量添加水印
for file in docs/*.pdf; do
  nano-pdf edit --file "$file" --instruction "添加'草稿'水印"
done
```

---

## ⚠️ 注意事项

### 最佳实践

1. **备份原文** - 编辑前先备份
2. **预览确认** - 编辑后预览确认
3. **格式兼容** - 注意 PDF 版本兼容
4. **字体嵌入** - 确保字体正确嵌入

### 避免踩坑

1. **扫描件限制** - 扫描件可能无法编辑文本
2. **复杂格式** - 复杂格式可能失真
3. **版权问题** - 注意 PDF 版权

---

## 📊 效果评估

### 支持操作

| 操作 | 支持 | 准确率 |
|------|------|--------|
| 页面删除 | ✅ | 100% |
| 页面旋转 | ✅ | 100% |
| 文本添加 | ✅ | 95%+ |
| 水印添加 | ✅ | 95%+ |
| PDF 合并 | ✅ | 100% |

---

## 🔗 相关资源

- [PDF 编辑指南](https://clawhub.ai/docs/pdf-editing)
- [Nano PDF 文档](https://clawhub.ai/docs/nano-pdf)
- [PDF 最佳实践](https://clawhub.ai/docs/pdf-best-practices)

---

## 💬 用户评价

> "自然语言编辑很方便"  
> —— 办公人员

> "批量处理效率高"  
> —— 行政人员

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
