# 🤖 飞书 Bot 配对指南

**更新时间**: 2026-03-12 23:10  
**状态**: ⏳ 等待配对

---

## 📋 待配对 Bot 列表

### 🌐 web-builder-bot

| 配置项 | 值 |
|--------|-----|
| **Bot 名称** | web-builder-bot |
| **App ID** | cli_a93815398278dceb |
| **绑定 Agent** | web-builder (小筑) |
| **状态** | ⏳ 等待配对 |

---

### 🔍 seo-master-bot

| 配置项 | 值 |
|--------|-----|
| **Bot 名称** | seo-master-bot |
| **App ID** | cli_a9381602a0b89cb1 |
| **绑定 Agent** | seo-master (搜搜) |
| **状态** | ⏳ 等待配对 |

---

### 🏋️ tanis-bot

| 配置项 | 值 |
|--------|-----|
| **Bot 名称** | tanis-bot |
| **App ID** | cli_a93876d7f8b8dccb |
| **绑定 Agent** | tanis (坦尼斯) |
| **状态** | ⏳ 等待配对 |

---

## 🔧 配对流程

### 方法 1: 飞书后台配置（推荐）

#### Step 1: 进入飞书开放平台

访问：https://open.feishu.cn/

#### Step 2: 找到对应应用

- 点击"企业自建应用"
- 找到 `web-builder-bot` / `seo-master-bot` / `tanis-bot`

#### Step 3: 配置机器人

对每个 Bot 执行：

1. **进入应用管理**
   - 点击应用名称
   - 进入"机器人"菜单

2. **配置机器人功能**
   - ✅ 启用机器人
   - ✅ 配置消息接收 URL（如果需要）
   - ✅ 配置事件订阅

3. **配置权限**
   - ✅ 消息读写权限
   - ✅ 群组读写权限
   - ✅ 用户信息读取权限

4. **发布应用**
   - 点击"版本管理与发布"
   - 提交审核（如果需要）
   - 启用应用

---

### 方法 2: 飞书客户端配对

#### Step 1: 在飞书中找到 Bot

- 打开飞书
- 搜索 Bot 名称（web-builder-bot / seo-master-bot / tanis-bot）
- 或者等待 Bot 出现在聊天列表

#### Step 2: 发送第一条消息

- 向 Bot 发送任意消息
- 例如："你好"

#### Step 3: 完成配对

- Bot 会回复配对请求
- 点击配对链接或按钮
- 确认配对

---

## ✅ 验证配对成功

### 测试方法

**向每个 Bot 发送测试消息**：

```
web-builder: "你好，web-builder！"
seo-master: "你好，seo-master！"
tanis: "你好，坦尼斯！"
```

**预期响应**：

- ✅ Bot 回复问候语
- ✅ 表明身份和职责
- ✅ 询问是否需要帮助

---

## ❓ 常见问题

### Q1: Bot 没有回应？

**检查清单**：
- [ ] Gateway 是否运行：`openclaw gateway status`
- [ ] Bot 配置是否正确：检查 App ID 和 Secret
- [ ] bindings 是否配置：检查 openclaw.json
- [ ] 飞书后台是否启用应用
- [ ] 权限是否配置完整

---

### Q2: 提示"Bot 未配对"？

**解决方法**：
1. 在飞书中找到 Bot
2. 发送第一条消息
3. 按提示完成配对流程

---

### Q3: 配置修改后不生效？

**解决方法**：
```bash
# 重启 Gateway
openclaw gateway restart

# 验证状态
openclaw gateway status
```

---

## 📊 当前状态

| Bot | 配置 | 飞书后台 | 配对状态 |
|-----|------|---------|---------|
| web-builder-bot | ✅ | ⏳ 待确认 | ⏳ 等待配对 |
| seo-master-bot | ✅ | ⏳ 待确认 | ⏳ 等待配对 |
| tanis-bot | ✅ | ✅ 已配置 | ⏳ 等待配对 |

---

## 🎯 下一步行动

### Trueman 需要做的：

1. **检查飞书后台**
   - 确认 3 个 Bot 应用已创建
   - 确认 App ID 和 Secret 正确
   - 确认机器人功能已启用

2. **完成配对**
   - 在飞书中向每个 Bot 发送消息
   - 完成配对流程

3. **测试响应**
   - 发送测试消息
   - 确认 Bot 正常响应

---

## 📞 技术支持

如遇到配对问题，请检查：
- 飞书开放平台应用状态
- Gateway 日志：/tmp/openclaw/openclaw-*.log
- 配置文件：~/.openclaw/openclaw.json

---

**准备就绪，等待配对完成！** 🤖

---

**更新时间**: 2026-03-12 23:10  
**状态**: ⏳ 等待飞书后台配置和配对