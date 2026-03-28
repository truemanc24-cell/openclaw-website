# 如何配置第一个聊天渠道：让 OpenClaw 连接飞书

> **摘要**：本教程详细讲解如何将 OpenClaw 连接到飞书，创建你的第一个智能机器人。从申请开发者账号到成功对话，全程手把手教学，包含常见问题排查。
>
> **学习目标**：
> - 创建飞书开发者账号和应用
> - 配置 OpenClaw 飞书渠道
> - 测试机器人对话
> - 解决常见配置问题

---

## 一、为什么选择飞书？

飞书是企业协作的热门平台，配置 OpenClaw 飞书机器人可以实现：

- 📢 **群聊助手**：自动回答团队问题
- 📅 **日程提醒**：会议通知、待办提醒
- 📊 **数据查询**：自动拉取报表、统计数据
- 🔔 **告警通知**：系统监控、CI/CD 状态
- 🤖 **自动化工作流**：审批、打卡、报表生成

---

## 二、飞书 Bot 创建

### 步骤 1：注册飞书开放平台账号

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 点击右上角「登录」
3. 使用企业飞书账号登录

> ⚠️ **注意**：需要企业管理员权限才能创建应用

### 步骤 2：创建企业应用

1. 进入「企业应用」→「创建应用」
2. 选择应用类型：**机器人**
3. 填写应用信息：
   - **应用名称**：OpenClaw 助手（可自定义）
   - **应用图标**：上传 logo（可选）
   - **应用描述**：AI 智能助手，帮助团队提效

![创建应用](../images/feishu-create-app.png)

4. 点击「创建」

### 步骤 3：获取应用凭证

创建成功后，进入应用管理页面：

1. 点击左侧「凭证与基础信息」
2. 复制以下信息（稍后配置用）：
   - **App ID**：`cli_xxxxxxxxxxxx`
   - **App Secret**：`xxxxxxxxxxxxxxxx`

![获取凭证](../images/feishu-credentials.png)

> 🔒 **安全提示**：App Secret 敏感信息，不要泄露给他人

### 步骤 4：配置机器人功能

1. 点击左侧「机器人」→「机器人设置」
2. 开启「机器人」开关
3. 复制以下信息：
   - **Verification Token**：`xxxxxxxxxxxxxxxx`
   - **Encrypt Key**：`xxxxxxxxxxxxxxxx`

![机器人设置](../images/feishu-bot-settings.png)

4. 配置机器人名称和头像
5. 设置「消息可读」权限

### 步骤 5：配置事件订阅

1. 点击左侧「事件订阅」
2. 开启「启用事件订阅」
3. 配置回调地址：
   ```
   https://your-domain.com/feishu/callback
   ```
   
   > 💡 **本地测试**：可使用 ngrok 等工具暴露本地服务
   ```bash
   # 安装 ngrok
   brew install ngrok
   
   # 暴露本地端口
   ngrok http 18789
   ```

4. 订阅以下事件：
   - ✅ `im.message.receive_v1` - 接收消息
   - ✅ `im.message.read_v1` - 消息已读（可选）

![事件订阅](../images/feishu-events.png)

5. 点击「保存」

### 步骤 6：发布应用

1. 点击左侧「版本管理与发布」
2. 点击「创建版本」
3. 填写版本说明
4. 点击「发布」
5. 等待审核（通常 1-2 个工作日）

> ⚠️ **测试期间**：可将应用添加到测试群组，无需正式发布即可测试

---

## 三、配置 OpenClaw 认证

### 方式一：使用配置向导（推荐）

```bash
# 运行飞书配置向导
openclaw channel add feishu
```

**按提示输入**：
```
? 输入 App ID: cli_xxxxxxxxxxxx
? 输入 App Secret: xxxxxxxxxxxxxxxx
? 输入 Verification Token: xxxxxxxxxxxxxxxx
? 输入 Encrypt Key: xxxxxxxxxxxxxxxx
? 是否启用加密：是
? 回调地址：https://your-domain.com/feishu/callback
```

### 方式二：手动编辑配置文件

```bash
# 编辑配置文件
openclaw config edit
```

**添加飞书配置**：
```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxxxxxxxxxxx",
      "appSecret": "xxxxxxxxxxxxxxxx",
      "verificationToken": "xxxxxxxxxxxxxxxx",
      "encryptKey": "xxxxxxxxxxxxxxxx",
      "encryptionEnabled": true,
      "callbackUrl": "https://your-domain.com/feishu/callback",
      "botName": "OpenClaw 助手"
    }
  }
}
```

### 方式三：使用环境变量（适合部署）

```bash
# 设置环境变量
export OPENCLAW_FEISHU_APP_ID="cli_xxxxxxxxxxxx"
export OPENCLAW_FEISHU_APP_SECRET="xxxxxxxxxxxxxxxx"
export OPENCLAW_FEISHU_VERIFICATION_TOKEN="xxxxxxxxxxxxxxxx"
export OPENCLAW_FEISHU_ENCRYPT_KEY="xxxxxxxxxxxxxxxx"

# 重启网关
openclaw gateway restart
```

---

## 四、测试对话

### 步骤 1：重启网关

配置完成后，重启网关使配置生效：

```bash
# 重启网关
openclaw gateway restart

# 检查状态
openclaw gateway status
```

**预期输出**：
```
Gateway: running
Port: 18789
Channels: feishu (connected)
```

### 步骤 2：将机器人添加到群聊

1. 打开飞书
2. 进入目标群聊
3. 点击右上角「...」→「添加成员」
4. 搜索「OpenClaw 助手」
5. 点击「添加」

### 步骤 3：发送测试消息

在群聊中 @机器人：

```
@OpenClaw 助手 你好，测试一下
```

**预期回复**：
```
你好！我是 OpenClaw 助手，很高兴为你服务。
有什么我可以帮助你的吗？
```

### 步骤 4：验证日志

```bash
# 查看实时日志
openclaw gateway logs --follow

# 查看错误日志
openclaw gateway logs --level error
```

**成功日志示例**：
```
[INFO] Feishu channel connected
[INFO] Message received from user: ou_xxxxx
[INFO] Processing request...
[INFO] Response sent successfully
```

---

## 五、常见问题

### Q1: 机器人无响应

**排查步骤**：

```bash
# 1. 检查网关状态
openclaw gateway status

# 2. 查看飞书通道状态
openclaw channel status feishu

# 3. 检查日志
openclaw gateway logs | grep feishu
```

**可能原因**：
- ❌ 网关未运行 → `openclaw gateway start`
- ❌ 配置错误 → 检查 App ID/Secret
- ❌ 回调地址错误 → 验证飞书开放平台配置
- ❌ 机器人未发布 → 添加到测试群组

### Q2: 回调验证失败

**飞书开放平台提示「回调地址验证失败」**

**解决方案**：
1. 确保回调地址可公网访问
2. 验证服务器响应格式正确
3. 检查 SSL 证书有效

**测试回调**：
```bash
# 使用 curl 测试
curl -X POST https://your-domain.com/feishu/callback \
  -H "Content-Type: application/json" \
  -d '{"challenge": "test123", "type": "url_verification"}'
```

**预期响应**：
```json
{
  "challenge": "test123"
}
```

### Q3: 消息加密错误

**日志提示「解密失败」**

**检查清单**：
- [ ] Encrypt Key 配置正确（无空格）
- [ ] 飞书开放平台加密开关已开启
- [ ] OpenClaw 配置 `encryptionEnabled: true`

**重新生成 Encrypt Key**：
1. 飞书开放平台 → 机器人设置
2. 点击「重新生成」
3. 更新 OpenClaw 配置
4. 重启网关

### Q4: 权限不足

**机器人无法读取群消息**

**解决方案**：
1. 飞书开放平台 → 权限管理
2. 申请以下权限：
   - ✅ 获取用户信息
   - ✅ 发送消息
   - ✅ 读取群消息
3. 提交审核

### Q5: 本地开发如何测试？

**使用 ngrok 暴露本地服务**：

```bash
# 1. 安装 ngrok
brew install ngrok

# 2. 启动 ngrok
ngrok http 18789

# 3. 复制生成的 URL（如：https://abc123.ngrok.io）
# 4. 配置到飞书开放平台回调地址
# 5. 测试完成后关闭 ngrok
```

---

## 六、高级配置

### 多群聊管理

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      // ... 基础配置
      "allowedChatIds": [
        "oc_xxxxxxxxxxxx",  // 群聊 1
        "oc_yyyyyyyyyyyy"   // 群聊 2
      ],
      "blockedChatIds": [
        "oc_zzzzzzzzzzzz"   // 黑名单群聊
      ]
    }
  }
}
```

### 自定义回复前缀

```json
{
  "channels": {
    "feishu": {
      // ... 基础配置
      "mentionOnly": false,      // 是否需要@才响应
      "replyPrefix": "🤖 ",      // 回复前缀
      "maxContextLength": 4000   // 上下文长度
    }
  }
}
```

### 启用日志记录

```bash
# 开启详细日志
openclaw config set logging.level debug

# 查看飞书通道日志
openclaw logs channel feishu --level debug
```

---

## 七、最佳实践

### 安全建议

| 建议 | 说明 |
|------|------|
| 🔒 保护 App Secret | 不要提交到代码仓库 |
| 🔑 定期轮换密钥 | 每 90 天更新一次 |
| 🚫 限制群聊范围 | 只允许特定群聊使用 |
| 📝 记录操作日志 | 审计机器人行为 |

### 性能优化

```json
{
  "channels": {
    "feishu": {
      // ... 基础配置
      "rateLimit": {
        "windowMs": 60000,      // 1 分钟窗口
        "maxRequests": 30       // 最多 30 条消息
      },
      "timeout": 30000,         // 30 秒超时
      "retryAttempts": 3        // 失败重试 3 次
    }
  }
}
```

---

## 八、下一步

配置完成后，可以：

1. 🧠 **配置记忆系统**：让机器人记住对话历史
2. 🛠 **添加技能**：扩展机器人能力
3. 📊 **配置监控**：跟踪机器人使用情况
4. 🔄 **设置自动化**：定时任务、工作流

---

## 快速参考卡

```bash
# 常用命令
openclaw channel add feishu       # 添加飞书通道
openclaw channel status feishu    # 检查通道状态
openclaw gateway restart          # 重启网关
openclaw gateway logs --follow    # 实时日志

# 配置文件位置
~/.openclaw/openclaw.json         # 主配置
```

**飞书开放平台链接**：
- 企业应用：https://open.feishu.cn/app
- 文档中心：https://open.feishu.cn/document/

---

**教程完成时间**：约 20-30 分钟
**难度等级**：⭐⭐ 中级
**前置知识**：完成快速开始指南

> 💡 **提示**：遇到问题先查看日志 `openclaw gateway logs`，90% 的问题都能从日志中找到线索。
