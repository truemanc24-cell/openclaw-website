# Feishu Doc

**技能名**: `feishu-doc`  
**作者**: OpenClaw  
**下载量**: N/A ⭐ **Stars**: N/A  
**版本**: Latest  
**来源**: [OpenClaw](https://openclaw.ai/)

---

## 📖 技能介绍

Feishu Doc 技能提供飞书文档的读写操作能力，支持文档创建、编辑、表格操作等功能。

### 核心功能

- 📄 **文档操作** - 创建/读取/编辑文档
- 📊 **表格支持** - 表格创建和编辑
- 🖼️ **媒体上传** - 上传图片/文件
- 🎨 **格式设置** - 文本格式化

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install feishu-doc
```

### 2. 配置认证

在 `~/.openclaw/agents/main/agent/auth-profiles.json` 中配置飞书应用：

```json
{
  "feishu": {
    "appId": "YOUR_APP_ID",
    "appSecret": "YOUR_APP_SECRET"
  }
}
```

---

## 💡 使用示例

### 文档创建

```bash
# 创建文档
feishu_doc create --title "会议记录" --content "# 会议纪要\n\n## 内容..."

# 读取文档
feishu_doc read --token "doc_token"

# 更新文档
feishu_doc update --token "doc_token" --content "新内容"
```

### 表格操作

```bash
# 创建表格
feishu_doc table create --doc "doc_token" --rows 5 --cols 3

# 写入表格数据
feishu_doc table write --table "table_id" --values "[[A,B,C],[1,2,3]]"

# 插入行
feishu_doc table insert-row --table "table_id" --values "[4,5,6]"
```

### 媒体上传

```bash
# 上传图片
feishu_doc upload-image --file image.png --doc "doc_token"

# 上传文件
feishu_doc upload-file --file report.pdf --doc "doc_token"
```

---

## 🔧 高级用法

### 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| create | 创建文档 | `feishu_doc create --title x` |
| read | 读取文档 | `feishu_doc read --token x` |
| update | 更新文档 | `feishu_doc update --content x` |
| table | 表格操作 | `feishu_doc table create` |
| upload | 上传媒体 | `feishu_doc upload-image --file x` |

### 批量操作

```javascript
// 批量创建文档
const docs = ['doc1', 'doc2', 'doc3'];
for (const title of docs) {
  await feishuDoc.create({ title, content: '# ' + title });
}
```

---

## ⚠️ 注意事项

### 最佳实践

1. **权限管理** - 设置合适的文档权限
2. **版本控制** - 重要文档定期备份
3. **内容组织** - 使用清晰的文档结构
4. **协作设置** - 合理配置协作权限

### 避免踩坑

1. **Token 安全** - 妥善保管文档 Token
2. **API 限制** - 注意调用频率限制
3. **内容审核** - 遵守飞书内容规范

---

## 📊 效果评估

### 使用场景

| 场景 | 频率 | 价值 |
|------|------|------|
| 会议记录 | 高 | 高 |
| 文档协作 | 高 | 高 |
| 报告生成 | 中 | 高 |
| 知识沉淀 | 高 | 高 |

---

## 🔗 相关资源

- [飞书开放平台](https://open.feishu.cn/)
- [文档 API 文档](https://open.feishu.cn/document/ukTMukTMukTM/uEDO4UjLxgDM14SM4ATN)
- [OpenClaw 飞书插件](https://github.com/openclaw/feishu)

---

## 💬 用户评价

> "飞书文档自动化很方便"  
> —— 团队助理

> "批量创建文档效率高"  
> —— 项目经理

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
