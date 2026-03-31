---
title: index
description: index 页面
---

# IMAP SMTP Email

**技能名**: `imap-smtp-email`  
**作者**: @gzlicanyi  
**下载量**: 24k ⭐ **Stars**: 56  
**版本**: 10  
**来源**: [ClawHub](https://clawhub.ai/gzlicanyi/imap-smtp-email)

---

## 📖 技能介绍

通过 IMAP/SMTP 收发邮件。检查新/未读消息、获取内容、搜索邮箱、标记已读/未读，支持附件。

### 核心功能

- 📧 **邮件接收** - IMAP 协议收取邮件
- 📤 **邮件发送** - SMTP 协议发送邮件
- 📎 **附件支持** - 处理邮件附件
- 🔍 **邮件搜索** - 在邮箱中搜索

---

## 🚀 安装

```bash
clawhub install imap-smtp-email
```

---

## 💡 配置示例

```json
{
  "imap": {
    "host": "imap.gmail.com",
    "port": 993,
    "secure": true
  },
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": true
  }
}
```

---

**最后更新**: 2026-03-16  
**维护**: OpenClaw 中文站
