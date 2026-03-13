# Hook 系统指南

## 什么是 Hook？

Hook 是 OpenClaw 的插件系统，可以在特定事件发生时自动执行代码。

## 已启用 Hook

| Hook | 用途 | 状态 |
|------|------|------|
| 🚀 boot-md | Gateway 启动时运行 BOOT.md | ✅ |
| 📝 command-logger | 记录所有命令事件 | ✅ |
| 💾 session-memory | 保存会话上下文 | ✅ |
| 🧠 self-improvement | 自我改进提醒 | ✅ |

## 启用 Hook

```bash
# 复制 Hook 文件
cp -r ~/.openclaw/skills/self-improving-agent/hooks/openclaw \
    ~/.openclaw/hooks/self-improvement

# 启用 Hook
openclaw hooks enable self-improvement

# 查看状态
openclaw hooks list
```

## 自定义 Hook

### Hook 结构

```
hook-name/
├── HOOK.md           # Hook 说明
├── handler.js        # JavaScript 处理器
└── handler.ts        # TypeScript 处理器（可选）
```

### handler.js 示例

```javascript
const handler = async (event) => {
  // 处理事件
  if (event.type === 'agent' && event.action === 'bootstrap') {
    // 注入提醒
    event.context.bootstrapFiles.push({
      path: 'REMINDER.md',
      content: 'Reminder content...',
      virtual: true
    });
  }
};

module.exports = handler;
```

## Hook 事件类型

- `agent:bootstrap` - Agent 启动时
- `command:exec` - 命令执行时
- `session:create` - 会话创建时
- 等等...
