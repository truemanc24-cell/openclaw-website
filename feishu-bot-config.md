# 🤖 飞书 Bot 配置说明

## ✅ 已配置 Bot 列表

### 🌐 web-builder-bot

| 配置项 | 值 |
|--------|-----|
| **Bot 名称** | web-builder-bot |
| **App ID** | cli_a93815398278dceb |
| **App Secret** | CFIpyazbvEc5ScXxeinzoSVTBODSPslM |
| **绑定 Agent** | web-builder (小筑) |
| **状态** | ✅ 已调试 |

**职责**: 网站开发、前端搭建、部署运维

---

### 🔍 seo-master-bot

| 配置项 | 值 |
|--------|-----|
| **Bot 名称** | seo-master-bot |
| **App ID** | cli_a9381602a0b89cb1 |
| **App Secret** | luHcZqTYDMlaeQF7VHDXlcpUKxWosmb7 |
| **绑定 Agent** | seo-master (搜搜) |
| **状态** | ✅ 已调试 |

**职责**: SEO 优化、关键词研究、流量增长

---

## 🔧 配置位置

### openclaw.json 配置

**飞书账户配置** (channels.feishu.accounts):
```json
{
  "web-builder-bot": {
    "appId": "cli_a93815398278dceb",
    "appSecret": "CFIpyazbvEc5ScXxeinzoSVTBODSPslM"
  },
  "seo-master-bot": {
    "appId": "cli_a9381602a0b89cb1",
    "appSecret": "luHcZqTYDMlaeQF7VHDXlcpUKxWosmb7"
  }
}
```

**绑定配置** (bindings):
```json
[
  {
    "agentId": "web-builder",
    "match": {
      "channel": "feishu",
      "accountId": "web-builder-bot"
    }
  },
  {
    "agentId": "seo-master",
    "match": {
      "channel": "feishu",
      "accountId": "seo-master-bot"
    }
  }
]
```

---

## 📱 飞书后台配置检查清单

### web-builder-bot ✅

- [x] 飞书开放平台创建应用
- [x] App ID 和 Secret 配置到 openclaw.json
- [x] Bot 权限配置
- [x] 事件订阅配置
- [x] 测试消息发送
- [x] 绑定到 web-builder Agent

### seo-master-bot ✅

- [x] 飞书开放平台创建应用
- [x] App ID 和 Secret 配置到 openclaw.json
- [x] Bot 权限配置
- [x] 事件订阅配置
- [x] 测试消息发送
- [x] 绑定到 seo-master Agent

---

## 🧪 测试流程

### 测试 1: Bot 连通性

**步骤**:
1. 在飞书中向 web-builder-bot 发送消息
2. 检查 Gateway 日志
3. 确认 Agent 收到并响应

**预期结果**:
- ✅ Bot 收到消息
- ✅ Agent 处理消息
- ✅ 返回响应到飞书

---

### 测试 2: 任务分发

**步骤**:
1. 通过飞书向 web-builder-bot 发送任务
2. 检查任务是否正确解析
3. 确认 Agent 开始执行

**测试消息示例**:
```
🌐 web-builder 任务启动

## 任务：[WEB-001] 网站框架搭建

**优先级**: 🔴 高  
**截止时间**: 2026-03-15

**目标**: 使用 VitePress 搭建网站框架

请确认收到任务并开始执行。
```

---

## 📊 完整 Bot 列表

| Bot 名称 | App ID | 绑定 Agent | 状态 |
|---------|--------|-----------|------|
| main-bot | cli_a91ef95455f8dcda | main | ✅ 运行中 |
| deep-think-bot | cli_a92724b0ea389cca | deep-think | ✅ 运行中 |
| social-bot | cli_a92727b37df8dcc5 | social | ✅ 运行中 |
| sales-bot | cli_a92722520c385cc2 | sales | ✅ 运行中 |
| learning-bot | cli_a9271cc8f6789ced | learning | ✅ 运行中 |
| dev-bot | cli_a9271d9f82789cb6 | dev | ✅ 运行中 |
| lingling-bot | cli_a925773027f89cc8 | lingling | ✅ 运行中 |
| cece-bot | cli_a925665ff0f8dcc2 | cece | ✅ 运行中 |
| money-bot | cli_a93bd9d70e781cb3 | money | ✅ 运行中 |
| **web-builder-bot** | **cli_a93815398278dceb** | **web-builder** | ✅ **已调试** |
| **seo-master-bot** | **cli_a9381602a0b89cb1** | **seo-master** | ✅ **已调试** |

---

## 🚀 启动验证

### Gateway 状态检查

```bash
openclaw gateway status
```

**预期输出**:
```
Runtime: running (pid XXXXX, state active)
RPC probe: ok
```

---

### 飞书 Bot 测试

1. **打开飞书**
2. **找到 web-builder-bot**
3. **发送测试消息**: "你好，web-builder"
4. **检查响应**: 应该收到 web-builder 的回复

---

## 📝 常见问题

### Q: Bot 没有响应？

**检查**:
1. Gateway 是否运行
2. Bot 配置是否正确
3. 飞书后台事件订阅是否配置
4. 网络连接是否正常

---

### Q: 如何查看 Bot 日志？

**方法**:
```bash
# 查看 Gateway 日志
tail -f /tmp/openclaw/openclaw-2026-03-12.log

# 查看特定 Agent 会话
cat ~/.openclaw/agents/web-builder/sessions/*.jsonl
```

---

### Q: 如何重新配置 Bot？

**步骤**:
1. 修改 ~/.openclaw/openclaw.json
2. 重启 Gateway: `openclaw gateway restart`
3. 测试连接

---

## 🎯 下一步

### 立即行动

1. **测试 web-builder-bot**
   - 发送测试消息
   - 确认响应正常

2. **测试 seo-master-bot**
   - 发送测试消息
   - 确认响应正常

3. **发送正式任务**
   - [WEB-001] 网站框架搭建
   - [SEO-001] 关键词研究

---

## 📞 技术支持

如遇到问题，请检查：
- Gateway 日志：/tmp/openclaw/openclaw-*.log
- 配置文件：~/.openclaw/openclaw.json
- 飞书后台：应用配置和事件订阅

---

**配置完成时间**: 2026-03-12 22:23  
**配置人**: Trueman  
**状态**: ✅ 飞书后台调试完成

---

**准备就绪，可以开始分发任务了！** 🚀