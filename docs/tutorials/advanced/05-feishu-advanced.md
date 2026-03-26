---
title: 飞书机器人深度配置 - 打造企业级智能助手 | OpenClaw 教程
description: 学完这个教程，你将能够配置企业级飞书机器人。包含权限管理、事件订阅、消息格式、应用发布全流程。20 分钟掌握企业集成，附完整配置模板。
keywords:
  - 飞书机器人
  - 企业级配置
  - OpenClaw 教程
  - 飞书集成
  - 事件订阅
  - 智能客服
lastUpdated: 2026-03-24
contributors:
  - Trueman
---

# 飞书机器人深度配置：打造企业级智能助手

> 📅 更新时间：2026-03-22  
> ⏰ 阅读时长：20 分钟  
> 💡 难度：进阶

---

## 写在前面

飞书（Feishu/Lark）是现代企业常用的协作平台，如果能够将 OpenClaw 与飞书深度集成，就能让企业成员通过飞书直接与 AI 助手对话，实现智能客服、知识问答、自动化流程等能力。

本文将深入讲解飞书机器人的高级配置，包括权限管理、事件订阅、消息格式自定义、企业应用发布等，让你的飞书机器人真正成为企业级智能助手！

---

## 一、飞书机器人基础回顾

### 1.1 快速入门

如果你还没有配置飞书机器人，先看看基础步骤：

```bash
# 方式一：向导模式（推荐）
openclaw onboard

# 方式二：手动添加
openclaw channels add
# 选择 Feishu
# 输入 App ID 和 App Secret
```

### 1.2 基础配置结构

配置完成后，`~/.claw/openclaw.json` 中会有：

```json5
{
  channels: {
    feishu: {
      enabled: true,
      dmPolicy: "pairing",  // 配对模式
      accounts: {
        main: {
          appId: "cli_xxx",
          appSecret: "xxx",
          botName: "AI 助手"
        }
      }
    }
  }
}
```

---

## 二、高级权限配置

### 2.1 权限体系概述

飞书有完善的权限体系，理解它才能配置出强大的机器人：

| 权限类型 | 说明 | 需要的权限 |
|----------|------|------------|
| **读取消息** | 接收用户消息 | `im:message:readonly` |
| **发送消息** | 回复用户 | `im:message:send_as_bot` |
| **读取文件** | 处理上传的附件 | `aily:file:read` |
| **写入文件** | 生成文件回复 | `aily:file:write` |
| **管理群组** | 群聊管理 | `im:chat.access_event:bot_p2p_chat` |

### 2.2 完整权限配置

在飞书开放平台，需要配置的权限列表：

```json
{
  "scopes": {
    "tenant": [
      // 消息相关
      "im:message",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      
      // 群组相关
      "im:chat.members:bot_access",
      "im:chat.access_event:bot_p2p_chat:read",
      
      // 文件相关
      "aily:file:read",
      "aily:file:write",
      "im:resource",
      
      // 应用相关
      "application:application:self_manage",
      "application:bot.menu:write",
      
      // 通讯录
      "contact:user.employee_id:readonly",
      
      // 其他
      "cardkit:card:read",
      "cardkit:card:write"
    ],
    "user": [
      "aily:file:read",
      "aily:file:write",
      "im:chat.access_event:bot_p2p_chat:read"
    ]
  }
}
```

### 2.3 按需精简权限

如果你只需要基础对话功能，可以精简：

```json
{
  "scopes": {
    "tenant": [
      "im:message",
      "im:message:send_as_bot"
    ]
  }
}
```

---

## 三、事件订阅详解

### 3.1 什么是事件订阅？

事件订阅让机器人能够**实时响应**飞书中的各种事件：

| 事件类型 | 说明 | 用途 |
|----------|------|------|
| `im.message.receive_v1` | 收到消息 | 核心：接收并回复消息 |
| `im.message.group_at_bot_v1` | 群聊@机器人 | 群聊场景 |
| `im.message.p2p_chat_created_v1` | 创建私聊 | 首次对话 |
| `contact.user.created_v1` | 新用户注册 | 用户管理 |
| `approval.created_v1` | 审批创建 | 审批自动化 |

### 3.2 配置事件订阅

**步骤 1：进入事件订阅配置**

在飞书开放平台 → 你的应用 → 开发配置 → 事件订阅

**步骤 2：添加事件**

需要订阅的关键事件：

```
✓ im.message.receive_v1      # 接收消息（必须）
✓ im.message.group_at_bot_v1 # 群聊@（可选）
✓ im.p2p_chat.created_v1    # 私聊创建（可选）
```

**步骤 3：配置回调地址**

需要填写你的服务器地址：

```
回调地址：https://your-domain.com/webhooks/feishu
```

**如果是本地开发**，使用内网穿透：

```bash
# 使用 ngrok
ngrok http 18789

# 或者使用 openclaw 内置的远程访问
openclaw gateway remote enable
```

### 3.3 事件处理示例

在 OpenClaw 中处理收到的消息：

```javascript
// 消息事件处理
feishu.on('message', async (event) => {
  const { message_id, chat_id, sender_id, content } = event.message;
  
  console.log('收到消息：', {
    message_id,
    chat_id,
    sender_id,
    content
  });
  
  // 这里可以让 AI 处理消息
  const response = await ai.process(content);
  
  // 回复消息
  await feishu.reply(message_id, response);
});
```

---

## 四、消息格式深度定制

### 4.1 基础消息类型

飞书支持多种消息格式：

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| `text` | 纯文本 | 简单回复 |
| `post` | 富文本 | 复杂布局 |
| `image` | 图片 | 可视化内容 |
| `file` | 文件 | 文档分享 |
| `interactive` | 卡片消息 | 交互表单 |

### 4.2 纯文本消息

```javascript
await feishu.sendMessage({
  chat_id: "oc_xxx",
  message: {
    msg_type: "text",
    content: {
      text: "你好！我是 AI 助手，有什么可以帮你的？"
    }
  }
});
```

### 4.3 富文本消息（post）

```javascript
await feishu.sendMessage({
  chat_id: "oc_xxx",
  message: {
    msg_type: "post",
    content: {
      post: {
        zh_cn: {
          title: "📊 今日数据报告",
          content: [
            [
              {
                tag: "text",
                text: "📈 访问量："
              },
              {
                tag: "text",
                text: "1,234",
                style: { bold: true, color: "blue" }
              }
            ],
            [
              {
                tag: "text",
                text: "💰 收入："
              },
              {
                tag: "text",
                text: "¥5,678",
                style: { bold: true, color: "green" }
              }
            ],
            [
              {
                tag: "at",
                user_id: "all"
              }
            ]
          ]
        }
      }
    }
  }
});
```

### 4.4 卡片消息（interactive）

卡片消息是最强大的格式，支持按钮、表单等交互：

```javascript
const card = {
  config: {
    wide_screen_mode: true
  },
  header: {
    title: {
      tag: "plain_text",
      content: "🎯 选择操作"
    },
    template: "blue"
  },
  elements: [
    {
      tag: "div",
      text: {
        tag: "plain_text",
        content: "请选择一个操作："
      }
    },
    {
      tag: "action",
      actions: [
        {
          tag: "button",
          text: {
            tag: "plain_text",
            content: "📊 查看报表"
          },
          type: "primary",
          value: { action: "view_report" }
        },
        {
          tag: "button",
          text: {
            tag: "plain_text",
            content: "⚙️ 系统设置"
          },
          type: "default",
          value: { action: "settings" }
        }
      ]
    },
    {
      tag: "div",
      text: {
        tag: "plain_text",
        content: "---",
        style: { color: "grey" }
      }
    },
    {
      tag: "action",
      actions: [
        {
          tag: "button",
          text: {
            tag: "plain_text",
            content: "❌ 关闭"
          },
          type: "danger",
          value: { action: "close" }
        }
      ]
    }
  ]
};

await feishu.sendMessage({
  chat_id: "oc_xxx",
  message: {
    msg_type: "interactive",
    card: JSON.stringify(card)
  }
});
```

### 4.5 带输入的卡片

```javascript
const inputCard = {
  header: {
    title: {
      tag: "plain_text",
      content: "📝 反馈表单"
    }
  },
  elements: [
    {
      tag: "div",
      text: {
        tag: "plain_text",
        content: "请填写以下信息："
      }
    },
    {
      tag: "input",
      label: "姓名",
      element: {
        tag: "plain_text_input",
        placeholder: {
          tag: "plain_text",
          content: "请输入姓名"
        }
      }
    },
    {
      tag: "input",
      label: "评分",
      element: {
        tag: "radio_button",
        options: [
          { text: { tag: "plain_text", content: "⭐" }, value: "1" },
          { text: { tag: "plain_text", content: "⭐⭐" }, value: "2" },
          { text: { tag: "plain_text", content: "⭐⭐⭐" }, value: "3" },
          { text: { tag: "plain_text", content: "⭐⭐⭐⭐" }, value: "4" },
          { text: { tag: "plain_text", content: "⭐⭐⭐⭐⭐" }, value: "5" }
        ]
      }
    },
    {
      tag: "input",
      label: "反馈内容",
      element: {
        tag: "textarea",
        placeholder: {
          tag: "plain_text",
          content: "请输入您的反馈..."
        }
      }
    },
    {
      tag: "action",
      actions: [
        {
          tag: "button",
          text: {
            tag: "plain_text",
            content: "提交反馈"
          },
          type: "primary",
          action: {
            method: "submit",
            cards_url: "https://your-server.com/feedback"
          }
        }
      ]
    }
  ]
};
```

---

## 五、企业应用发布

### 5.1 发布流程

飞书应用发布流程：

```
开发测试 → 申请发布 → 企业管理员审核 → 发布成功
```

**步骤 1：创建应用版本**

在飞书开放平台 → 版本管理 → 创建新版本

```
版本号：1.0.0
版本描述：初始版本，包含基础对话功能
```

**步骤 2：提交审核**

```
审核类型：☑ 企业内部
☑ 可在应用目录上架
```

**步骤 3：等待审核**

- 企业内部应用：通常自动通过
- 公开应用：需要飞书官方审核

### 5.2 配置可见范围

发布后，可以配置谁能看见和使用：

```json
{
  "app_visible_scope": {
    "department_ids": ["D001", "D002"],
    "user_ids": ["ou_xxx", "ou_yyy"],
    "group_ids": ["G001"]
  }
}
```

### 5.3 可见性设置

在 OpenClaw 中也可以配置：

```json5
{
  channels: {
    feishu: {
      dmPolicy: "allowlist",  // 白名单模式
      allowFrom: [
        "ou_xxx1",  // 用户 ID
        "ou_xxx2"
      ],
      // 或者
      allowFromDepartment: ["D001"]
    }
  }
}
```

---

## 六、高级功能实战

### 6.1 场景一：智能客服

**需求**：用户咨询问题，AI 自动回复

**配置**：
```json5
{
  channels: {
    feishu: {
      dmPolicy: "pairing"
    }
  },
  
  // 配置知识库（可选）
  knowledge: {
    enabled: true,
    sources: [
      "~/docs/faq.md",
      "~/docs/product-info.md"
    ]
  }
}
```

**工作流程**：
```
用户发送消息
    ↓
飞书事件回调
    ↓
OpenClaw 接收消息
    ↓
AI 处理（可结合知识库）
    ↓
生成回复
    ↓
发送消息给用户
```

### 6.2 场景二：群聊助手

**需求**：在群聊中 @机器人 来获取信息

**配置**：
```json5
{
  channels: {
    feishu: {
      // 启用群聊功能
      groupPolicy: "allowlist",
      // 或者
      groupPolicy: "all"
    }
  }
}
```

**使用方式**：
```
群聊中：
用户：@AI助手 帮我查一下今天天气

机器人：（自动回复天气信息）
```

### 6.3 场景三：审批自动化

**需求**：收到审批请求时自动处理

**配置事件订阅**：
```json
{
  "event": "approval.created_v1"
}
```

**处理代码**：
```javascript
feishu.on('approval.created', async (event) => {
  const { approval_id, applicant, type } = event;
  
  // AI 审批
  const decision = await ai.approve({
    type,
    applicant,
    approval_id
  });
  
  // 提交审批结果
  await feishu.approve({
    approval_id,
    comment: decision.reason,
    result: decision.approved ? "agree" : "reject"
  });
});
```

### 6.4 场景四：定时报告

**需求**：每天早上自动发送日报

**配置 Cron**：
```json5
{
  automation: {
    cron: [
      {
        schedule: "0 9 * * 1-5",  // 工作日早上 9 点
        task: "daily-report",
        handler: "scripts/daily-report.js"
      }
    ]
  }
}
```

**报告脚本**：
```javascript
// scripts/daily-report.js
async function dailyReport() {
  // 获取数据
  const stats = await getDailyStats();
  
  // 生成报告卡片
  const card = {
    header: {
      title: { tag: "plain_text", content: "📊 每日数据报告" },
      template: "blue"
    },
    elements: [
      { tag: "div", text: { tag: "plain_text", content: `新增用户：${stats.newUsers}` }},
      { tag: "div", text: { tag: "plain_text", content: `活跃用户：${stats.activeUsers}` }},
      { tag: "div", text: { tag: "plain_text", content: `收入：¥${stats.revenue}` }}
    ]
  };
  
  // 发送到群组
  await feishu.sendToGroup("daily-report-group", card);
}
```

---

## 七、最佳实践

### 7.1 安全建议

1. **保护 App Secret**
   - 不要提交到代码仓库
   - 使用环境变量
   
2. **验证消息来源**
   ```javascript
   // 验证签名
   function verifySignature(signature, timestamp, body) {
     // 飞书签名验证逻辑
   }
   ```

3. **限制机器人权限**
   - 只申请需要的权限
   - 定期审查权限使用

### 7.2 性能优化

1. **消息限流**
   ```javascript
   // 避免过快发送
   const messageQueue = [];
   setInterval(() => {
     if (messageQueue.length > 0) {
       sendMessage(messageQueue.shift());
     }
   }, 100);  // 每秒最多 10 条
   ```

2. **缓存会话**
   ```javascript
   // 避免重复处理
   const processedMessages = new Set();
   
   function processMessage(messageId) {
     if (processedMessages.has(messageId)) {
       return; // 已处理
     }
     processedMessages.add(messageId);
     // 处理...
   }
   ```

### 7.3 错误处理

```javascript
feishu.on('error', async (error) => {
  console.error('飞书机器人错误：', error);
  
  // 记录错误
  logger.error({
    type: 'feishu_error',
    error: error.message,
    stack: error.stack,
    timestamp: new Date()
  });
  
  // 尝试恢复
  if (error.code === 'rate_limit') {
    await sleep(5000);  // 等待后重试
  }
});
```

---

## 八、故障排查

### 问题 1：消息收不到

**检查清单**：
```bash
# 1. 检查 Gateway 状态
openclaw gateway status

# 2. 检查飞书配置
openclaw channels status --channel feishu

# 3. 查看日志
openclaw logs --follow | grep -i feishu
```

**常见原因**：
- Gateway 未启动
- App Secret 错误
- 事件订阅未正确配置

### 问题 2：消息发不出去

**检查清单**：
- [ ] 有发送消息权限？
- [ ] Chat ID 正确？
- [ ] 消息格式正确？

### 问题 3：回调地址验证失败

**解决方案**：
```bash
# 使用内网穿透
ngrok http 18789

# 或使用 openclaw remote
openclaw gateway remote enable
```

---

## 总结

飞书机器人是 OpenClaw 连接企业协作的重要渠道：

1. ✅ **事件驱动**：实时响应飞书中的各种事件
2. ✅ **丰富消息**：支持文本、富文本、卡片等多种格式
3. ✅ **企业级**：完善的权限和发布体系
4. ✅ **可扩展**：可以开发各种自动化场景

**下一步**：
- 完成基础的飞书配置
- 尝试发送卡片消息
- 开发自己的自动化流程

---

> 📍 **相关文档**
> - [飞书渠道配置](/docs/channels/feishu.md)
> - [事件订阅配置](/docs/automation/webhook.md)
> - [消息格式参考](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)

---

*[配图：飞书开放平台配置界面]*
*[配图：卡片消息示例]*
*[配图：企业应用发布流程]*

---

## 结构化数据（SEO）

<!--
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "飞书机器人深度配置 - 打造企业级智能助手",
  "description": "学完这个教程，你将能够配置企业级飞书机器人。包含权限管理、事件订阅、消息格式、应用发布全流程。",
  "image": "https://opc-web-five.vercel.app/images/feishu-advanced.jpg",
  "author": {
    "@type": "Person",
    "name": "Trueman",
    "url": "https://opc-web-five.vercel.app/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "OpenClaw 中文技术网",
    "logo": {
      "@type": "ImageObject",
      "url": "https://opc-web-five.vercel.app/logo.png"
    }
  },
  "datePublished": "2026-03-22",
  "dateModified": "2026-03-24",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://opc-web-five.vercel.app/tutorials/advanced/feishu-advanced"
  },
  "articleSection": "教程",
  "keywords": ["飞书机器人", "企业级配置", "飞书集成", "智能客服"],
  "wordCount": "5000",
  "timeRequired": "PT20M",
  "difficulty": "Intermediate",
  "educationalLevel": "Intermediate",
  "learningResourceType": "Tutorial"
}
</script>
-->