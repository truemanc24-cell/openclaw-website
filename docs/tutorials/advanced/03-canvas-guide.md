# Canvas 使用指南：实时渲染与交互的艺术

> 📅 更新时间：2026-03-22  
> ⏰ 阅读时长：15 分钟  
> 💡 难度：进阶

---

## 写在前面

想象一下：AI 不仅能回答文字，还能直接给你展示一个网页、一张图表、甚至一个可交互的界面——这就是 Canvas 的魅力。

Canvas 是 OpenClaw 最强大的可视化能力之一，它让 AI 能够实时渲染内容，让你在对话中就能看到结果。

本文将带你全面了解 Canvas，从基础概念到实战应用，让你真正体验「对话即开发」的魅力！

---

## 一、Canvas 是什么？

### 1.1 概念解释

**Canvas**（画布）是 OpenClaw 提供的一种实时内容渲染能力。当你与 Agent 交流时，Agent 可以将渲染后的网页、图表、界面直接展示给你。

### 1.2 Canvas 的能力

| 能力 | 说明 | 示例 |
|------|------|------|
| **实时渲染** | AI 生成的代码立即渲染 | 网页、图表 |
| **交互操作** | 支持点击、输入等交互 | 表单、按钮 |
| **双向通信** | 你的操作可传回给 AI | 填表、选择 |
| **媒体展示** | 支持图片、视频展示 | 图表、动画 |

### 1.3 Canvas vs 传统方式

| 对比项 | 传统方式 | Canvas 方式 |
|--------|----------|--------------|
| 代码展示 | 给你代码你自己跑 | 直接渲染看效果 |
| 调试 | 复制到本地运行 | 边改边看 |
| 交互 | 无 | 支持点击输入 |
| 反馈 | 文字描述 | 实时可视化 |

---

## 二、Canvas 架构解析

### 2.1 技术原理

```
用户 → Gateway → Agent → Canvas Engine → 渲染 → 用户浏览器
```

1. **Agent 生成内容**：AI 思考并生成 HTML/CSS/JS 代码
2. **Canvas 引擎**：接收代码并创建渲染环境
3. **实时渲染**：代码立即在画布中显示
4. **用户交互**：用户的操作通过 WebSocket 传回 Agent

### 2.2 Canvas 类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| **HTML** | 渲染 HTML 内容 | 网页、表单 |
| **图表** | 数据可视化 | 折线图、饼图 |
| **代码编辑器** | 代码实时预览 | 开发调试 |
| **媒体** | 图片/视频展示 | 视觉内容 |

### 2.3 Canvas 会话

每个 Canvas 会话都是独立的：

```
~/.openclaw/agents/<agentId>/sessions/<sessionId>/canvas/
├── index.html      # 渲染的 HTML
├── scripts/        # JavaScript 脚本
└── assets/         # 静态资源
```

---

## 三、创建 Canvas 会话

### 3.1 基础命令

```bash
# 启动一个 Canvas 会话
openclaw canvas start

# 查看当前 Canvas 状态
openclaw canvas status

# 关闭 Canvas 会话
openclaw canvas close
```

### 3.2 通过 Control UI 使用

最简单的方式是通过 Control UI：

```bash
# 打开 Control UI（包含 Canvas）
openclaw dashboard
```

然后在浏览器中访问 `http://127.0.0.1:18789/canvas`，你将看到 Canvas 界面。

### 3.3 代码驱动方式

Agent 可以通过工具调用直接操作 Canvas：

```javascript
// 创建 Canvas
await canvas.create({
  type: 'html',
  title: '我的网页'
});

// 推送内容
await canvas.push({
  content: '<h1>Hello Canvas!</h1>'
});

// 注入 JavaScript
await canvas.evaluate({
  javaScript: 'document.body.style.background = "blue";'
});
```

---

## 四、实时渲染内容

### 4.1 HTML 渲染

最基础的 Canvas 用法是渲染 HTML：

```javascript
// Agent 可以这样渲染内容
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { color: #333; }
    .tag {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎯 OpenClaw Canvas</h1>
    <p>这是一个实时渲染的 Canvas 页面！</p>
    <div class="tag">实时渲染</div>
    <div class="tag">交互式</div>
    <div class="tag">AI 生成</div>
  </div>
</body>
</html>
`;

await canvas.push({ content: html });
```

### 4.2 图表渲染

Canvas 特别适合展示数据图表：

```javascript
const chartHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { padding: 2rem; }
    .chart-container {
      max-width: 600px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="chart-container">
    <canvas id="myChart"></canvas>
  </div>
  <script>
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['周一', '周二', '周三', '周四', '周五'],
        datasets: [{
          label: '任务完成数',
          data: [12, 19, 15, 25, 22],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  </script>
</body>
</html>
`;

await canvas.push({ content: chartHtml });
```

### 4.3 表单交互

Canvas 支持完整的表单交互：

```javascript
const formHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; padding: 2rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input, select, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }
    button {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <h2>📝 用户反馈表单</h2>
  <form id="feedbackForm">
    <div class="form-group">
      <label>姓名</label>
      <input type="text" name="name" required>
    </div>
    <div class="form-group">
      <label>满意度</label>
      <select name="satisfaction">
        <option value="5">非常满意</option>
        <option value="4">满意</option>
        <option value="3">一般</option>
        <option value="2">不满意</option>
        <option value="1">非常不满意</option>
      </select>
    </div>
    <div class="form-group">
      <label>反馈内容</label>
      <textarea name="feedback" rows="4"></textarea>
    </div>
    <button type="submit">提交反馈</button>
  </form>
  <script>
    document.getElementById('feedbackForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      // 发送到 Canvas 回调
      window.canvasCallback(JSON.stringify(data));
    });
  </script>
</body>
</html>
`;

await canvas.push({ content: formHtml });
```

---

## 五、交互式操作

### 5.1 事件回调

用户的操作可以通过回调传回给 Agent：

```javascript
// 监听 Canvas 事件
canvas.on('form-submit', async (data) => {
  // 处理用户提交的表单数据
  console.log('收到表单数据：', data);
  
  // 可以根据数据生成新的 Canvas 内容
  await canvas.push({
    content: `<div class="result">感谢您的反馈：${data.name}</div>`
  });
});

canvas.on('button-click', async (action) => {
  console.log('用户点击了按钮：', action);
});

canvas.on('selection-change', async (selection) => {
  console.log('用户选择改变了：', selection);
});
```

### 5.2 双向通信示例

完整的交互流程：

```javascript
// 1. Agent 推送一个选择菜单
await canvas.push({
  content: `
    <div class="menu">
      <h3>请选择一个选项：</h3>
      <button data-action="option-a">选项 A</button>
      <button data-action="option-b">选项 B</button>
      <button data-action="option-c">选项 C</button>
    </div>
    <script>
      document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          window.canvasCallback({
            action: 'selection',
            value: btn.dataset.action
          });
        });
      });
    </script>
  `
});

// 2. 用户点击按钮
// 3. 事件传回 Agent
canvas.on('selection', async (data) => {
  // 4. Agent 处理并响应
  const response = await processSelection(data.value);
  
  // 5. 更新 Canvas 内容
  await canvas.push({
    content: `<div class="response">你选择了：${data.value}<br>结果：${response}</div>`
  });
});
```

### 5.3 实时更新

Canvas 支持实时更新内容：

```javascript
// 定时更新（适合时钟、计数器等）
await canvas.evaluate({
  javaScript: `
    setInterval(() => {
      document.getElementById('clock').textContent = new Date().toLocaleTimeString();
    }, 1000);
  `
});

// 响应式更新
await canvas.push({
  content: `
    <div id="counter">0</div>
    <button onclick="increment()">+1</button>
    <script>
      let count = 0;
      function increment() {
        count++;
        document.getElementById('counter').textContent = count;
        window.canvasCallback({ action: 'count', value: count });
      }
    </script>
  `
});
```

---

## 六、应用案例

### 案例一：数据仪表盘

```javascript
// 生成一个实时更新的数据仪表盘
const dashboardHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      background: #0f172a;
      color: white;
      padding: 1.5rem;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .card {
      background: #1e293b;
      border-radius: 12px;
      padding: 1.25rem;
    }
    .card h4 { color: #94a3b8; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .card .value { font-size: 2rem; font-weight: 700; }
    .card .change { font-size: 0.875rem; }
    .change.positive { color: #22c55e; }
    .change.negative { color: #ef4444; }
    .chart-card { grid-column: span 2; }
    .chart-card.large { grid-column: span 4; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 实时数据仪表盘</h1>
    <div id="clock"></div>
  </div>
  
  <div class="grid">
    <div class="card">
      <h4>总用户数</h4>
      <div class="value">12,847</div>
      <div class="change positive">↑ 12.5%</div>
    </div>
    <div class="card">
      <h4>活跃用户</h4>
      <div class="value">3,291</div>
      <div class="change positive">↑ 8.2%</div>
    </div>
    <div class="card">
      <h4>总收入</h4>
      <div class="value">¥84.2K</div>
      <div class="change positive">↑ 23.1%</div>
    </div>
    <div class="card">
      <h4>转化率</h4>
      <div class="value">3.24%</div>
      <div class="change negative">↓ 1.1%</div>
    </div>
  </div>
  
  <div class="grid">
    <div class="card chart-card large">
      <canvas id="trendChart"></canvas>
    </div>
  </div>
  
  <script>
    // 时钟
    setInterval(() => {
      document.getElementById('clock').textContent = new Date().toLocaleTimeString();
    }, 1000);
    
    // 图表
    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
          label: '用户增长',
          data: [1200, 1900, 3000, 5000, 4800, 6000],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
        }
      }
    });
  </script>
</body>
</html>
`;

await canvas.push({ content: dashboardHtml });
```

### 案例二：代码编辑器

```javascript
const editorHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; display: flex; height: 100vh; font-family: system-ui; }
    .editor { flex: 1; display: flex; flex-direction: column; }
    .toolbar { 
      background: #1e1e1e; 
      padding: 0.5rem; 
      display: flex; 
      gap: 0.5rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-run { background: #22c55e; color: white; }
    .btn-clear { background: #6b7280; color: white; }
    textarea {
      flex: 1;
      background: #1e1e1e;
      color: #d4d4d4;
      border: none;
      padding: 1rem;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 14px;
      resize: none;
    }
    .output {
      height: 200px;
      background: #0d0d0d;
      color: #22c55e;
      padding: 1rem;
      font-family: monospace;
      overflow: auto;
    }
  </style>
</head>
<body>
  <div class="editor">
    <div class="toolbar">
      <button class="btn-run" onclick="runCode()">▶ 运行</button>
      <button class="btn-clear" onclick="clearOutput()">🗑️ 清空</button>
      <span style="color: #666; padding: 0.5rem;">JavaScript 编辑器</span>
    </div>
    <textarea id="code" placeholder="在这里输入 JavaScript 代码...">
// 尝试输入一些代码并点击运行
function greet(name) {
  return \`你好，\${name}！\`;
}

console.log(greet('OpenClaw'));
</textarea>
    <div class="output" id="output"></div>
  </div>
  <script>
    function runCode() {
      const code = document.getElementById('code').value;
      const output = document.getElementById('output');
      
      // 重写 console.log
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(a => String(a)).join(' '));
      };
      
      try {
        eval(code);
        output.textContent = logs.join('\\n') || '（无输出）';
      } catch (e) {
        output.textContent = '错误：' + e.message;
      }
      
      console.log = originalLog;
    }
    
    function clearOutput() {
      document.getElementById('output').textContent = '';
    }
  </script>
</body>
</html>
`;

await canvas.push({ content: editorHtml });
```

### 案例三：任务看板

```javascript
const kanbanHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui; padding: 1.5rem; background: #f8fafc; }
    h1 { margin-bottom: 1.5rem; }
    .board { display: flex; gap: 1rem; overflow-x: auto; }
    .column {
      min-width: 280px;
      background: #f1f5f9;
      border-radius: 8px;
      padding: 1rem;
    }
    .column-header {
      font-weight: 600;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
    }
    .count { 
      background: #cbd5e1; 
      padding: 0.125rem 0.5rem; 
      border-radius: 9999px;
      font-size: 0.875rem;
    }
    .card {
      background: white;
      border-radius: 6px;
      padding: 0.75rem;
      margin-bottom: 0.75rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      cursor: pointer;
    }
    .card:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .card-title { font-weight: 500; margin-bottom: 0.25rem; }
    .card-tag {
      display: inline-block;
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
    }
  </style>
</head>
<body>
  <h1>📋 任务看板</h1>
  <div class="board">
    <div class="column">
      <div class="column-header">
        待处理 <span class="count">3</span>
      </div>
      <div class="card">
        <div class="card-title">完成用户文档</div>
        <span class="card-tag">文档</span>
      </div>
      <div class="card">
        <div class="card-title">修复登录 Bug</div>
        <span class="card-tag">Bug</span>
      </div>
      <div class="card">
        <div class="card-title">优化数据库查询</div>
        <span class="card-tag">性能</span>
      </div>
    </div>
    <div class="column">
      <div class="column-header">
        进行中 <span class="count">2</span>
      </div>
      <div class="card">
        <div class="card-title">开发新功能</div>
        <span class="card-tag">功能</span>
      </div>
      <div class="card">
        <div class="card-title">集成支付接口</div>
        <span class="card-tag">后端</span>
      </div>
    </div>
    <div class="column">
      <div class="column-header">
        已完成 <span class="count">5</span>
      </div>
      <div class="card">
        <div class="card-title">用户调研</div>
        <span class="card-tag">产品</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

await canvas.push({ content: kanbanHtml });
```

---

## 七、最佳实践

### 7.1 性能优化

1. **控制更新频率**：避免频繁推送内容
2. **合理使用脚本**：复杂的 JavaScript 会影响性能
3. **懒加载**：大资源使用延迟加载

### 7.2 用户体验

1. **加载提示**：复杂内容添加加载状态
2. **错误处理**：展示友好的错误信息
3. **响应式设计**：适配不同屏幕尺寸

### 7.3 调试技巧

```bash
# 查看 Canvas 日志
openclaw logs --follow | grep -i canvas

# 调试 JavaScript
# 在推送的 HTML 中添加：
<script>
  window.onerror = (msg, url, line) => {
    console.error('Canvas Error:', msg, 'at line', line);
    window.canvasCallback({ error: msg, line });
  };
</script>
```

---

## 总结

Canvas 是 OpenClaw 最强大的可视化能力：

1. ✅ **实时渲染**：代码立即变成可见页面
2. ✅ **交互丰富**：支持表单、按钮、图表等
3. ✅ **双向通信**：用户操作可传回给 AI
4. ✅ **应用广泛**：仪表盘、编辑器、看板都能做

**下一步**：
- 尝试在 Control UI 中使用 Canvas
- 让 Agent 为你生成一个数据仪表盘
- 创建一个交互式表单

---

> 📍 **相关文档**
> - [Canvas CLI 命令](/docs/cli/canvas.md)
> - [Control UI 使用指南](/docs/web/control-ui.md)
> - [Web 工具详解](/docs/tools/browser.md)

---

*[配图：Canvas 界面截图 - 展示实时渲染效果]*
*[配图：数据仪表盘示例 - 展示图表渲染]*
*[配图：代码编辑器示例 - 展示交互功能]*