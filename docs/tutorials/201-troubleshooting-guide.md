---
title: 201 troubleshooting guide
description: 201 troubleshooting guide 页面
---

# OpenClaw 常见错误排查指南

> **学习目标**: 快速定位和解决 OpenClaw 使用中的常见问题，减少故障排查时间

**适用场景**: Gateway 启动失败、渠道连接问题、消息发送失败、控制面板无法访问

**预计阅读时间**: 15 分钟

---

## 一、Gateway 启动问题

### 1.1 端口已被占用

**错误现象**:
```
Error: listen EADDRINUSE: address already in use :::18789
```

**原因**: 默认端口 18789 已被其他进程占用（通常是之前未正确关闭的 Gateway）

**解决方案**:

```bash
# 方法 1：查找并终止占用端口的进程
lsof -i :18789
kill -9 <PID>

# 方法 2：使用不同端口启动
openclaw gateway --port 18790

# 方法 3：重启 Gateway 服务
openclaw gateway restart
```

**预防措施**: 始终使用 `openclaw gateway stop` 关闭服务，避免直接 Ctrl+C 终止

---

### 1.2 配置文件语法错误

**错误现象**:
```
Error parsing config: Unexpected token } in JSON at position 245
```

**原因**: `~/.openclaw/openclaw.json` 文件格式错误

**解决方案**:

```bash
# 1. 备份当前配置
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak

# 2. 使用 JSON 验证工具检查
cat ~/.openclaw/openclaw.json | python3 -m json.tool

# 3. 如有错误，编辑修复
code ~/.openclaw/openclaw.json

# 4. 恢复默认配置（极端情况）
openclaw config init
```

**常见错误**:
- 缺少逗号 `,` 分隔字段
- 使用了中文标点符号
- 注释格式错误（JSON 不支持注释）

---

### 1.3 Node 版本不兼容

**错误现象**:
```
Error: Unsupported Node version. Required: 22.16+ or 24+
Current: v18.17.0
```

**解决方案**:

```bash
# 检查当前版本
node --version
npm --version

# 使用 nvm 升级（推荐）
nvm install 22
nvm use 22
nvm alias default 22

# 重新安装 OpenClaw
npm install -g openclaw@latest

# 验证安装
openclaw --version
```

**版本要求**:
- **推荐**: Node 24.x
- **最低**: Node 22.16+
- **不支持**: Node 18 及以下

---

## 二、渠道连接问题

### 2.1 WhatsApp 扫码失败

**错误现象**:
- 二维码不显示
- 扫码后连接超时
- 反复显示二维码

**解决方案**:

```bash
# 1. 清除旧的会话数据
rm -rf ~/.openclaw/channels/whatsapp/*

# 2. 重新登录
openclaw channels login whatsapp

# 3. 检查网络连通性
ping api.whatsapp.com

# 4. 使用代理（如需要）
export HTTPS_PROXY=http://proxy.example.com:8080
openclaw channels login whatsapp
```

**注意事项**:
- 确保 WhatsApp 账号未被限制
- 扫码后 60 秒内完成配对
- 企业账号可能需要额外验证

---

### 2.2 Telegram Bot 无响应

**错误现象**:
- Bot Token 配置正确但收不到消息
- 消息发送失败

**检查清单**:

```bash
# 1. 验证 Bot Token
openclaw channels status telegram

# 2. 检查 Bot 隐私设置
# 在 Telegram 中发送 /setprivacy 给 @BotFather
# 确保 "Group Privacy" 设置为 Disabled

# 3. 验证 Webhook（如使用）
openclaw channels webhook telegram --check

# 4. 查看日志
openclaw logs --channel telegram --tail 100
```

**常见配置错误**:
```json
// ❌ 错误：缺少 bot 前缀
"token": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"

// ✅ 正确
"token": "bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
```

---

### 2.3 Discord 连接中断

**错误现象**:
- Bot 频繁掉线
- 消息延迟严重

**解决方案**:

```bash
# 1. 检查 Bot 权限
# 确保 Bot 有以下权限：
# - Send Messages
# - Read Message History
# - Use Slash Commands

# 2. 更新 Intents 配置
# 在 Discord Developer Portal 启用：
# - MESSAGE CONTENT INTENT
# - SERVER MEMBERS INTENT

# 3. 重新邀请 Bot
# 使用最新授权 URL
https://discord.com/api/oauth2/authorize?client_id=<CLIENT_ID>&permissions=8&scope=bot
```

---

## 三、消息发送失败

### 3.1 权限拒绝

**错误现象**:
```
Error: Message sending failed: Permission denied
Target user not in allowFrom list
```

**原因**: 发送者不在白名单中

**解决方案**:

```json
// ~/.openclaw/openclaw.json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+8613800138000", "+8613900139000"]
    }
  }
}
```

```bash
# 重新加载配置
openclaw gateway reload
```

**调试命令**:
```bash
# 查看当前允许的发送者
openclaw config get channels.whatsapp.allowFrom

# 临时允许所有（仅测试用）
openclaw config set channels.whatsapp.allowFrom "*"
```

---

### 3.2 消息格式错误

**错误现象**:
- 图片/文件发送失败
- 媒体消息显示为空白

**解决方案**:

```bash
# 1. 检查文件大小限制
# WhatsApp: 最大 64MB
# Telegram: 最大 50MB (Bot API)
# Discord: 最大 25MB (免费账号)

# 2. 验证文件路径
ls -la /path/to/file.jpg

# 3. 使用正确的发送命令
openclaw message send \
  --target +8613800138000 \
  --message "测试图片" \
  --media /path/to/image.jpg \
  --caption "这是图片说明"
```

**支持格式**:
| 类型 | 支持格式 | 最大大小 |
|------|---------|---------|
| 图片 | JPG, PNG, GIF, WebP | 64MB |
| 音频 | MP3, OGG, WAV | 16MB |
| 文档 | PDF, DOC, TXT, ZIP | 64MB |
| 视频 | MP4, MOV, AVI | 64MB |

---

### 3.3 速率限制

**错误现象**:
```
Error: Rate limit exceeded. Retry after 60 seconds
```

**原因**: 短时间内发送过多消息

**解决方案**:

```bash
# 1. 查看当前速率限制状态
openclaw status --rate-limit

# 2. 添加发送延迟
openclaw message send --target +8613800138000 --message "Msg 1"
sleep 2
openclaw message send --target +8613800138000 --message "Msg 2"

# 3. 批量发送时使用队列
openclaw message batch --file messages.txt --delay 2000
```

**建议限制**:
- WhatsApp: 1 条/秒
- Telegram: 30 条/分钟
- Discord: 5 条/秒（每频道）

---

## 四、控制面板问题

### 4.1 无法访问 Dashboard

**错误现象**:
- 浏览器显示 "无法连接"
- 页面加载超时

**排查步骤**:

```bash
# 1. 确认 Gateway 正在运行
openclaw gateway status

# 2. 检查监听端口
lsof -i :18789

# 3. 测试本地访问
curl http://127.0.0.1:18789/

# 4. 检查防火墙设置
sudo lsof -i -n -P | grep 18789

# 5. 查看 Gateway 日志
openclaw logs --tail 50
```

**远程访问配置**:
```json
{
  "gateway": {
    "host": "0.0.0.0",
    "port": 18789,
    "allowOrigins": ["https://your-domain.com"]
  }
}
```

---

### 4.2 认证失败

**错误现象**:
- Dashboard 提示 "Invalid credentials"
- 无法登录

**解决方案**:

```bash
# 1. 重置管理员密码
openclaw auth reset-admin

# 2. 清除浏览器缓存
# Ctrl+Shift+Delete (Chrome/Firefox)
# Cmd+Shift+Delete (Safari)

# 3. 检查 Token 有效期
openclaw auth status

# 4. 重新生成 Token
openclaw auth refresh
```

---

## 五、日志分析

### 5.1 查看日志

```bash
# 实时查看日志
openclaw logs --follow

# 查看最近 100 行
openclaw logs --tail 100

# 按级别过滤
openclaw logs --level error

# 按渠道过滤
openclaw logs --channel whatsapp

# 导出日志
openclaw logs --output openclaw-debug.log
```

### 5.2 日志级别说明

| 级别 | 说明 | 使用场景 |
|------|------|---------|
| ERROR | 严重错误 | 功能失效，需要立即处理 |
| WARN | 警告 | 可能影响性能，但不影响核心功能 |
| INFO | 信息 | 正常操作日志 |
| DEBUG | 调试 | 详细调试信息，排查问题时使用 |

### 5.3 常见错误日志解读

```
[ERROR] Channel whatsapp: Connection lost
→ 检查网络连接和 WhatsApp 会话状态

[WARN] Rate limit approaching for telegram
→ 减少发送频率，添加延迟

[ERROR] Config validation failed: Missing required field 'token'
→ 检查配置文件是否完整

[INFO] Gateway started on port 18789
→ 正常启动，无需处理
```

---

## 六、高级调试

### 6.1 启用调试模式

```bash
# 设置调试环境变量
export OPENCLAW_DEBUG=true
export OPENCLAW_LOG_LEVEL=debug

# 重启 Gateway
openclaw gateway restart

# 查看详细日志
openclaw logs --level debug --follow
```

### 6.2 健康检查

```bash
# 运行完整健康检查
openclaw health

# 检查各项状态
openclaw status
openclaw channels status
openclaw nodes status
```

### 6.3 重置配置

```bash
# 备份当前配置
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d_%H%M%S)

# 重置为默认配置
openclaw config reset

# 重新配置
openclaw onboard
```

---

## 七、获取帮助

### 7.1 自助资源

- **官方文档**: https://docs.openclaw.ai
- **GitHub Issues**: https://github.com/openclaw/openclaw/issues
- **Discord 社区**: https://discord.gg/clawd

### 7.2 提交问题报告

**必须包含的信息**:
```markdown
1. OpenClaw 版本：`openclaw --version`
2. Node 版本：`node --version`
3. 操作系统：`uname -a`
4. 错误日志：`openclaw logs --tail 100`
5. 复现步骤：详细描述如何触发问题
6. 预期行为：应该发生什么
7. 实际行为：实际发生了什么
```

### 7.3 紧急联系

对于生产环境的关键问题：
1. 首先查看 [GitHub Issues](https://github.com/openclaw/openclaw/issues) 是否有已知问题
2. 在 Discord 社区 #help 频道提问
3. 提交详细的 Issue 报告

---

## 快速参考卡片

```bash
# Gateway 管理
openclaw gateway status    # 查看状态
openclaw gateway restart   # 重启
openclaw gateway stop      # 停止

# 日志查看
openclaw logs --follow     # 实时日志
openclaw logs --tail 100   # 最近 100 行

# 渠道诊断
openclaw channels status   # 渠道状态
openclaw channels login    # 重新登录

# 配置检查
openclaw config get        # 查看配置
openclaw health            # 健康检查
```

---

**最后更新**: 2026-03-29  
**维护者**: OpenClaw 社区  
**反馈**: 在 GitHub 提交 Issue 或加入 Discord 社区讨论


---

## 📚 相关内容

- [常见问题](/tutorials/201-troubleshooting-guide#常见问题)
- [配置检查](/tutorials/03-configuration)
- [安装验证](/tutorials/02-installation)
- [日志查看](/guide/configuration)
- [寻求帮助](/contact)
