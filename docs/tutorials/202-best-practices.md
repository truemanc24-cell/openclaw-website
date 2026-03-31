---
title: 202 best practices
description: 202 best practices 页面
---

# OpenClaw 最佳实践 10 条

> **学习目标**: 掌握 OpenClaw 生产环境部署和日常使用的核心最佳实践，提升系统稳定性和安全性

**适用场景**: 生产环境部署、团队协作、长期运维

**预计阅读时间**: 12 分钟

---

## 前言

这些最佳实践来自 OpenClaw 社区的集体经验，涵盖安全、性能、可维护性和故障恢复四个方面。遵循这些建议可以避免 90% 的常见问题。

---

## 1️⃣ 始终备份配置文件

**原则**: 修改任何配置前必须先备份

**为什么重要**:
- 配置错误可能导致 Gateway 无法启动
- 渠道认证信息丢失需要重新配对
- 自定义 Agent 配置难以恢复

**操作方法**:

```bash
# 创建带时间戳的备份
cp ~/.openclaw/openclaw.json \
   ~/.openclaw/$(date +%Y-%m-%d_%H%M)_openclaw.json.backup

# 或使用自动备份脚本
openclaw backup create

# 定期备份（添加到 crontab）
0 2 * * * cp ~/.openclaw/openclaw.json ~/Backups/openclaw-$(date +\%Y\%m\%d).json
```

**备份清单**:
- [ ] `~/.openclaw/openclaw.json` - 主配置
- [ ] `~/.openclaw/agents/*/agent/` - Agent 配置
- [ ] `~/.openclaw/channels/` - 渠道会话数据
- [ ] `~/.openclaw/skills/` - 自定义技能

**恢复测试**: 每季度至少测试一次备份恢复流程

---

## 2️⃣ 使用环境变量管理敏感信息

**原则**: 永远不要将 API Key、Token 等敏感信息硬编码在配置文件中

**错误做法**:
```json
// ❌ 不要这样做
{
  "providers": {
    "openai": {
      "apiKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
    }
  }
}
```

**正确做法**:
```bash
# 1. 设置环境变量
export OPENCLAW_OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
export OPENCLAW_WHATSAPP_TOKEN="eyJhbGciOiJIUzI1NiIs..."

# 2. 添加到 shell 配置文件（~/.zshrc 或 ~/.bashrc）
echo 'export OPENCLAW_OPENAI_API_KEY="sk-xxx"' >> ~/.zshrc
source ~/.zshrc

# 3. 在配置中引用
{
  "providers": {
    "openai": {
      "apiKey": "${OPENCLAW_OPENAI_API_KEY}"
    }
  }
}
```

**进阶：使用 .env 文件**:
```bash
# ~/.openclaw/.env
OPENCLAW_OPENAI_API_KEY=sk-xxx
OPENCLAW_WHATSAPP_TOKEN=eyJhbGciOiJIUzI1NiIs...
OPENCLAW_TELEGRAM_BOT_TOKEN=bot123456:ABCdef...

# 设置文件权限（仅所有者可读）
chmod 600 ~/.openclaw/.env

# 在配置中加载
{
  "envFile": "~/.openclaw/.env"
}
```

**安全建议**:
- 使用密码管理器存储敏感信息
- 定期轮换 API Key
- 不在版本控制中提交 `.env` 文件

---

## 3️⃣ 实施最小权限原则

**原则**: 只授予必要的权限，限制访问范围

**配置示例**:

```json
{
  "channels": {
    "whatsapp": {
      // 只允许特定号码发送消息
      "allowFrom": ["+8613800138000", "+8613900139000"],
      
      // 群组中需要 @ 提及才响应
      "groups": {
        "*": {
          "requireMention": true,
          "allowedGroups": ["group-id-1", "group-id-2"]
        }
      }
    },
    "telegram": {
      // 只响应特定聊天
      "allowedChats": ["-1001234567890", "@mychannel"]
    }
  },
  "messages": {
    // 群组消息需要匹配特定模式
    "groupChat": {
      "mentionPatterns": ["@openclaw", "@bot"],
      "requireApproval": true
    }
  }
}
```

**权限分级建议**:

| 环境 | 允许来源 | 群组权限 | 媒体上传 |
|------|---------|---------|---------|
| 开发 | 自己 | 开放 | 允许 |
| 测试 | 团队成员 | 需提及 | 限制 |
| 生产 | 白名单 | 需审批 | 禁止 |

---

## 4️⃣ 启用日志轮转和归档

**原则**: 避免日志文件无限增长，保留足够的历史用于排查

**问题**: 默认日志可能占用数 GB 空间

**解决方案**:

```bash
# 1. 配置日志轮转（logrotate）
sudo nano /etc/logrotate.d/openclaw

# 添加以下内容：
~/.openclaw/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 trueman staff
}

# 2. 在配置中限制日志大小
{
  "logging": {
    "maxFileSize": "10MB",
    "maxFiles": 10,
    "level": "info"
  }
}

# 3. 定期清理旧日志
find ~/.openclaw/logs -name "*.log" -mtime +30 -delete
```

**日志保留策略**:
- **开发环境**: 保留 7 天
- **测试环境**: 保留 14 天
- **生产环境**: 保留 30 天 + 月度归档

---

## 5️⃣ 使用守护进程模式运行

**原则**: 生产环境永远不要在前台运行 Gateway

**错误做法**:
```bash
# ❌ 不要这样做（Ctrl+C 会停止服务）
openclaw gateway --port 18789
```

**正确做法**:

```bash
# 方法 1：使用内置守护进程（推荐）
openclaw gateway install --daemon

# 验证安装
openclaw gateway status

# 管理命令
openclaw gateway start
openclaw gateway stop
openclaw gateway restart

# 方法 2：使用 systemd（Linux）
sudo systemctl enable openclaw
sudo systemctl start openclaw

# 方法 3：使用 launchd（macOS）
# 配置文件位置：~/Library/LaunchAgents/ai.openclaw.gateway.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

**监控守护进程**:
```bash
# 检查运行状态
ps aux | grep openclaw

# 查看系统服务状态
# macOS
launchctl list | grep openclaw
# Linux
systemctl status openclaw

# 设置自动重启
# 在配置中添加：
{
  "gateway": {
    "autoRestart": true,
    "restartDelay": 5000
  }
}
```

---

## 6️⃣ 实施健康检查和监控

**原则**: 主动发现问题，而不是被动响应

**基础健康检查**:

```bash
# 创建健康检查脚本
cat > ~/scripts/openclaw-health.sh << 'EOF'
#!/bin/bash

# 检查 Gateway 状态
if ! openclaw gateway status > /dev/null 2>&1; then
    echo "❌ Gateway 未运行"
    openclaw gateway start
    exit 1
fi

# 检查渠道连接
channels=$(openclaw channels status --json | jq -r '.channels[] | select(.status != "connected") | .name')
if [ -n "$channels" ]; then
    echo "❌ 渠道未连接：$channels"
    exit 1
fi

# 检查磁盘空间
usage=$(df -h ~/.openclaw | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$usage" -gt 80 ]; then
    echo "⚠️  磁盘使用率超过 80%: ${usage}%"
fi

echo "✅ 所有检查通过"
exit 0
EOF

chmod +x ~/scripts/openclaw-health.sh

# 添加到 crontab（每 5 分钟检查一次）
*/5 * * * * ~/scripts/openclaw-health.sh >> ~/logs/openclaw-health.log 2>&1
```

**高级监控指标**:

```bash
# 监控关键指标
openclaw metrics --export prometheus > /var/prometheus/openclaw.metrics

# 监控项目：
# - Gateway 正常运行时间
# - 消息发送成功率
# - 渠道连接状态
# - API 调用次数
# - 内存使用量
# - 磁盘使用量
```

**告警配置**:
- Gateway 停机 > 5 分钟 → 发送通知
- 消息失败率 > 10% → 发送警告
- 磁盘使用率 > 85% → 发送警告

---

## 7️⃣ 版本管理和升级策略

**原则**: 有计划地升级，避免生产环境中断

**升级流程**:

```bash
# 1. 检查当前版本
openclaw --version

# 2. 查看更新日志
openclaw changelog

# 3. 备份配置（必须！）
openclaw backup create

# 4. 在测试环境验证
# 先在非生产环境升级测试

# 5. 执行升级
npm install -g openclaw@latest

# 6. 验证升级
openclaw --version
openclaw health

# 7. 回滚计划（如需要）
npm install -g openclaw@<previous-version>
```

**版本策略**:
- **开发环境**: 跟随最新版本（每周检查）
- **测试环境**: 滞后 1-2 个版本（每月检查）
- **生产环境**: 使用 LTS 版本（每季度检查）

**订阅更新通知**:
```bash
# 关注 GitHub Release
# https://github.com/openclaw/openclaw/releases

# 或设置自动检查
openclaw update check --notify
```

---

## 8️⃣ 优化性能配置

**原则**: 根据实际负载调整配置参数

**内存优化**:

```json
{
  "gateway": {
    "maxMemory": "512MB",
    "gcInterval": 300000
  },
  "agents": {
    "maxConcurrent": 5,
    "sessionTimeout": 3600000
  }
}
```

**性能调优参数**:

| 参数 | 默认值 | 推荐值（生产） | 说明 |
|------|--------|--------------|------|
| `maxConcurrent` | 10 | 5 | 最大并发 Agent 数 |
| `sessionTimeout` | 1800000 | 3600000 | 会话超时时间（ms） |
| `messageQueueSize` | 100 | 500 | 消息队列大小 |
| `rateLimitPerMinute` | 60 | 30 | 每分钟消息限制 |

**监控性能**:
```bash
# 查看资源使用
openclaw metrics --resource

# 分析性能瓶颈
openclaw profile --duration 60

# 优化建议
openclaw optimize --suggest
```

---

## 9️⃣ 建立故障恢复流程

**原则**: 预设应急预案，缩短恢复时间

**故障恢复清单**:

```markdown
## Gateway 无法启动
1. 检查日志：`openclaw logs --tail 100`
2. 验证配置：`openclaw config validate`
3. 检查端口：`lsof -i :18789`
4. 恢复备份配置
5. 重启服务

## 渠道连接丢失
1. 检查网络连通性
2. 重新登录渠道：`openclaw channels login <channel>`
3. 验证认证信息
4. 检查渠道 API 状态

## 消息发送失败
1. 检查发送者权限
2. 验证渠道状态
3. 查看错误日志
4. 检查速率限制

## 性能下降
1. 检查资源使用率
2. 清理旧日志和缓存
3. 重启 Gateway
4. 调整并发参数
```

**灾难恢复**:

```bash
# 完整恢复流程
# 1. 停止服务
openclaw gateway stop

# 2. 备份当前状态（用于分析）
tar -czf ~/openclaw-issue-$(date +%Y%m%d).tar.gz \
    ~/.openclaw/openclaw.json \
    ~/.openclaw/logs/

# 3. 恢复备份配置
cp ~/Backups/openclaw-20260329.json ~/.openclaw/openclaw.json

# 4. 清除缓存
rm -rf ~/.openclaw/cache/*

# 5. 重启服务
openclaw gateway start

# 6. 验证功能
openclaw health
```

---

## 🔟 文档化和知识沉淀

**原则**: 记录配置变更和运维经验

**文档模板**:

```markdown
# OpenClaw 运维日志

## 配置变更记录

### 2026-03-29
- 添加 WhatsApp 白名单号码：+8613800138000
- 调整速率限制：60 → 30 条/分钟
- 原因：防止频繁发送触发限制

### 2026-03-15
- 升级 OpenClaw：v1.2.0 → v1.3.0
- 新增渠道：Telegram
- 性能优化：调整 maxConcurrent 参数

## 已知问题

### 问题：WhatsApp 夜间掉线
- 现象：每天凌晨 3 点连接断开
- 原因：WhatsApp 服务器维护
- 解决：设置自动重连

## 联系人

- 管理员：Trueman
- 备份管理员：待指定
- 紧急联系：Discord #ops 频道
```

**文档位置**:
- 配置变更：`~/.openclaw/CHANGELOG.md`
- 运维手册：`~/Docs/OpenClaw-Operations.md`
- 故障记录：`~/.openclaw/INCIDENTS.md`

**知识共享**:
- 在团队内部分享运维经验
- 将解决方案贡献给社区
- 定期回顾和更新文档

---

## 快速检查清单

**部署前检查**:
- [ ] 配置文件已备份
- [ ] 敏感信息使用环境变量
- [ ] 权限配置符合最小权限原则
- [ ] 日志轮转已配置
- [ ] 守护进程已安装

**日常运维检查**:
- [ ] Gateway 运行正常
- [ ] 渠道连接正常
- [ ] 磁盘空间充足
- [ ] 日志无异常错误
- [ ] 性能指标正常

**定期维护（每月）**:
- [ ] 检查并应用安全更新
- [ ] 清理旧日志和缓存
- [ ] 测试备份恢复流程
- [ ] 审查权限配置
- [ ] 更新运维文档

---

## 总结

遵循这 10 条最佳实践可以：
- ✅ 减少 90% 的配置错误
- ✅ 缩短 70% 的故障恢复时间
- ✅ 提升系统稳定性和安全性
- ✅ 降低运维复杂度

**记住**: 最好的实践是适合你团队实践的实践。定期回顾和调整这些建议，使其符合你的具体需求。

---

**最后更新**: 2026-03-29  
**维护者**: OpenClaw 社区  
**贡献**: 欢迎在 GitHub 提交你的最佳实践案例


---

## 📚 相关内容

- [核心概念](/tutorials/103-core-concepts)
- [配置教程](/tutorials/03-configuration)
- [技能市场](/skills/)
- [故障排查](/tutorials/201-troubleshooting-guide)
- [最佳实践](/concepts/features)
