# Feishu 文档技能

**技能名称**: `feishu-doc`  
**版本**: 1.0.0  
**来源**: [ClawHub](https://clawhub.ai/)

---

## 📖 技能介绍

Feishu 文档技能让你可以通过自然语言操作飞书文档，实现自动化创建、编辑、管理文档。

### 核心功能

- 📄 **文档创建** - 自动创建飞书文档
- ✏️ **内容编辑** - 写入、追加、插入内容
- 📊 **表格操作** - 创建表格、写入单元格
- 🖼️ **媒体上传** - 上传图片、文件
- 🔍 **内容查询** - 列出文档块、获取内容

---

## 🚀 快速开始

### 1. 安装技能

```bash
clawhub install feishu-doc
```

### 2. 配置认证

在 `~/.openclaw/openclaw.json` 中添加：

```json
{
  "skills": {
    "feishu-doc": {
      "enabled": true,
      "config": {
        "appId": "cli_xxxxxxxxxxxxx",
        "appSecret": "xxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### 3. 获取认证信息

1. 登录 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 App ID 和 App Secret
4. 配置应用权限（文档读写权限）

---

## 💡 使用示例

### 创建文档

```
@main 帮我创建一个飞书文档，标题是"会议纪要"
```

### 写入内容

```
@main 在文档中写入以下内容：
# 会议纪要
时间：2026-03-16
参会人：张三、李四、王五
```

### 创建表格

```
@main 创建一个 3 行 4 列的表格，包含表头
```

### 上传图片

```
@main 把这张图片上传到飞书文档
```

---

## 🔧 高级用法

### 批量操作

```javascript
// 批量创建多个文档
feishu_doc.create({
  title: "日报",
  content: "# 日报\n..."
});

// 批量更新
feishu_doc.update({
  docToken: "xxx",
  content: "更新内容"
});
```

### 模板文档

创建常用文档模板，快速复用：

```json
{
  "templates": {
    "meeting-notes": {
      "title": "会议纪要",
      "content": "# 会议纪要\n\n## 时间\n\n## 参会人\n\n## 议题\n"
    },
    "daily-report": {
      "title": "日报",
      "content": "# 日报\n\n## 今日完成\n\n## 明日计划\n"
    }
  }
}
```

---

## ⚠️ 注意事项

### 速率限制

- 单个应用每分钟最多 1000 次 API 调用
- 批量操作时建议添加延迟
- 大文档分块处理更稳定

### 权限配置

必须配置的应用权限：

| 权限 | 说明 |
|------|------|
| `docx:doc` | 文档读写 |
| `docx:file` | 文件上传 |
| `drive:file` | 云盘操作 |

### 常见问题

**Q: 提示权限不足？**  
A: 检查飞书开放平台应用权限是否已配置并审核通过

**Q: 文档创建失败？**  
A: 确认 App ID 和 App Secret 配置正确

**Q: 上传图片失败？**  
A: 图片大小不能超过 10MB，格式支持 PNG/JPG

---

## 📊 性能优化

### ✅ 推荐做法

1. **批量操作** - 多次写入合并为一次
2. **分块处理** - 大文档分段写入
3. **缓存 Token** - 避免重复获取
4. **错误重试** - 网络问题自动重试

### ❌ 避免踩坑

1. **不要频繁创建文档** - 可能被限流
2. **不要忽略错误** - 及时处理失败
3. **不要硬编码凭证** - 使用环境变量

---

## 🔗 相关资源

- [飞书开放平台文档](https://open.feishu.cn/document/ukTMukTMukTM/uEjNwUjLxYDM14SM2ATN)
- [ClawHub 技能页面](https://clawhub.ai/skills/feishu-doc)
- [GitHub 源码](https://github.com/openclaw/skills/feishu-doc)

---

## 💬 用户反馈

> "用这个技能自动生成会议纪要，效率提升 10 倍！"  
> —— 某互联网公司产品经理

> "批量创建日报功能太实用了，团队都在用"  
> —— 某创业公司技术负责人

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
