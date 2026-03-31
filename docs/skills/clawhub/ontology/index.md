---
title: index
description: index 页面
---

# Ontology

**技能名**: `ontology`  
**作者**: @oswalpalash  
**下载量**: 109k ⭐ **Stars**: 287  
**版本**: 4  
**来源**: [ClawHub](https://clawhub.ai/oswalpalash/ontology)

---

## 📖 技能介绍

Ontology 是一个类型化的知识图谱技能，用于结构化 agent 记忆和可组合技能。

### 核心功能

- 🧠 **知识图谱** - 结构化存储知识
- 🔗 **实体链接** - 关联人/项目/任务/事件
- 📊 **类型系统** - 强类型数据模型
- 🔍 **查询接口** - 高效检索信息

---

## 🚀 快速开始

### 安装

```bash
clawhub install ontology
```

### 使用示例

```javascript
// 创建实体
ontology.create('Person', {
  name: '张三',
  email: 'zhangsan@example.com'
});

// 查询实体
const persons = ontology.query('Person', { name: '张三' });
```

---

## 💡 使用场景

- 项目管理 - 跟踪项目、任务、人员
- 知识管理 - 组织文档、笔记、概念
- 关系网络 - 管理人脉、组织、事件

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
