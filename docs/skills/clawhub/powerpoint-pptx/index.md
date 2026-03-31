---
title: index
description: index 页面
---

# Powerpoint / PPTX

**技能名**: `powerpoint-pptx`  
**作者**: @ivangdavila  
**下载量**: 11.1k ⭐ **Stars**: 25  
**版本**: 2  
**来源**: [ClawHub](https://clawhub.ai/ivangdavila/powerpoint-pptx)

---

## 📖 技能介绍

Powerpoint / PPTX 技能让你能够 programmatically 创建、编辑和管理 PowerPoint 演示文稿。

### 核心功能

- 📊 **幻灯片创建** - 创建新的 PPT 文件
- 🎨 **模板应用** - 使用设计模板
- 📝 **内容添加** - 添加文本、图片、图表
- 🔄 **批量生成** - 批量创建演示文稿

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install powerpoint-pptx
```

### 2. 依赖安装

```bash
# 安装 Python 依赖
pip install python-pptx
```

---

## 💡 使用示例

### 创建演示文稿

```bash
# 创建新 PPT
pptx create --output presentation.pptx --title "项目汇报"

# 添加幻灯片
pptx slide add --file presentation.pptx --layout "title"

# 添加内容
pptx content add --file presentation.pptx --slide 1 --text "欢迎"
```

### 插入元素

```bash
# 插入图片
pptx image insert --file presentation.pptx --slide 2 --image logo.png

# 插入图表
pptx chart insert --file presentation.pptx --slide 3 --type bar

# 插入表格
pptx table insert --file presentation.pptx --slide 4 --rows 3 --cols 3
```

### 批量生成

```bash
# 从模板批量生成
for dept in sales marketing engineering; do
  pptx generate --template template.pptx --data ${dept}.json --output ${dept}_report.pptx
done
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| create | 创建 PPT | `pptx create --output x.pptx` |
| slide | 幻灯片管理 | `pptx slide add --layout title` |
| content | 内容添加 | `pptx content add --text "hello"` |
| image | 图片插入 | `pptx image insert --image x.png` |
| export | 导出 | `pptx export --format pdf` |

### 模板使用

```javascript
// 使用模板生成
const pptx = new PowerPoint('template.pptx');
pptx.fill({
  title: '项目汇报',
  date: '2026-03-16',
  content: slides
});
pptx.save('output.pptx');
```

---

## ⚠️ 注意事项

### 最佳实践

1. **使用模板** - 保持风格统一
2. **图片优化** - 压缩图片减小文件
3. **字体嵌入** - 确保跨设备显示
4. **版本兼容** - 测试不同 PowerPoint 版本

### 避免踩坑

1. **不要过大** - 控制文件大小
2. **注意版权** - 使用合法素材
3. **备份原文** - 编辑前先备份

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 工作汇报 | 高 | 高 |
| 培训材料 | 中 | 高 |
| 产品展示 | 中 | 高 |
| 学术会议 | 低 | 中 |

---

## 🔗 相关资源

- [ClawHub 页面](https://clawhub.ai/ivangdavila/powerpoint-pptx)
- [python-pptx 文档](https://python-pptx.readthedocs.io/)
- [PPT 设计指南](https://support.microsoft.com/powerpoint)

---

## 💬 用户评价

> "自动生成 PPT 节省了大量时间"  
> —— 项目经理

> "模板功能很实用"  
> —— 培训师

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
