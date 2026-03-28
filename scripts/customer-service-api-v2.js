#!/usr/bin/env node

/**
 * OpenClaw 网站智能客服 API v2
 * 基于真实 Agent 对话 + RAG 检索增强
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { execSync } = require('child_process');

// 配置
const PORT = 3456;
const INDEX_FILE = path.join(__dirname, 'content-index.json');
const SESSIONS_FILE = path.join(__dirname, 'chat-sessions.json');

// 内存中的会话存储
let chatSessions = {};
let contentIndex = null;

/**
 * 加载内容索引
 */
function loadIndex() {
  try {
    if (fs.existsSync(INDEX_FILE)) {
      const data = fs.readFileSync(INDEX_FILE, 'utf-8');
      contentIndex = JSON.parse(data);
      console.log(`✅ 内容索引已加载：${contentIndex.totalDocuments} 篇文档`);
      return true;
    }
  } catch (error) {
    console.error('❌ 加载索引失败:', error.message);
  }
  return false;
}

/**
 * 加载会话数据
 */
function loadSessions() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      chatSessions = JSON.parse(data);
      console.log(`✅ 会话数据已加载：${Object.keys(chatSessions).length} 个会话`);
    }
  } catch (error) {
    console.error('⚠️  加载会话数据失败，使用空会话');
    chatSessions = {};
  }
}

/**
 * 保存会话数据
 */
function saveSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(chatSessions, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ 保存会话数据失败:', error.message);
  }
}

/**
 * RAG 检索：根据问题查找相关文档
 */
function retrieveContext(question, limit = 5) {
  if (!contentIndex) return [];
  
  const questionLower = question.toLowerCase();
  const questionWords = questionLower
    .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  // 计算每篇文档的相关性分数
  const scores = contentIndex.documents.map(doc => {
    let score = 0;
    
    // 标题匹配（高权重）
    const titleLower = doc.title.toLowerCase();
    for (const word of questionWords) {
      if (titleLower.includes(word)) score += 10;
    }
    
    // 关键词匹配
    for (const keyword of doc.keywords) {
      if (questionLower.includes(keyword)) score += 5;
    }
    
    // 子主题匹配
    for (const sub of doc.subTopics) {
      if (sub.toLowerCase().includes(questionLower)) score += 8;
    }
    
    // 内容匹配
    const contentLower = doc.content.toLowerCase();
    for (const word of questionWords) {
      if (contentLower.includes(word)) score += 1;
    }
    
    // 分类权重（tutorials 和 guide 优先级高）
    if (doc.category === 'tutorials' || doc.category === 'guide') {
      score *= 1.2;
    }
    
    return { doc, score };
  });
  
  // 排序并返回 top N
  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.doc);
}

/**
 * 构建 RAG 上下文
 */
function buildContext(results) {
  if (results.length === 0) return '没有找到相关文档内容。';
  
  return results.map((doc, i) => {
    return `【文档 ${i + 1}】${doc.title}
分类：${doc.category}
路径：${doc.url}
内容摘要：
${doc.summary}
---`;
  }).join('\n\n');
}

/**
 * 调用 OpenClaw Agent API
 */
function callAgent(prompt, sessionId = null) {
  try {
    const { spawnSync } = require('child_process');
    
    // 使用 main agent
    const args = ['agent', '--json', '--timeout', '30', '--agent', 'main'];
    
    if (sessionId) {
      args.push('--session-id', sessionId);
    }
    
    args.push('--message', prompt);
    
    console.log(`🤖 调用 Agent (消息长度：${prompt.length})...`);
    
    const result = spawnSync('openclaw', args, {
      encoding: 'utf-8',
      timeout: 30000,
      env: { ...process.env, FORCE_COLOR: '0' },
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    if (result.error) {
      throw result.error;
    }
    
    // 解析 JSON 输出
    let jsonOutput;
    try {
      jsonOutput = JSON.parse(result.stdout);
    } catch (parseError) {
      console.error('❌ JSON 解析失败:', parseError.message);
      console.error('stdout:', result.stdout?.substring(0, 500));
      return null;
    }
    
    // 提取实际消息：result.payloads[0].text
    if (jsonOutput.result && jsonOutput.result.payloads && jsonOutput.result.payloads.length > 0) {
      const message = jsonOutput.result.payloads[0].text;
      return { message };
    }
    
    // 备用：尝试直接返回 message 字段
    if (jsonOutput.message) {
      return jsonOutput;
    }
    
    console.error('❌ 无法从响应中提取消息');
    return null;
  } catch (error) {
    console.error('❌ Agent 调用失败:', error.message);
    return null;
  }
}

/**
 * 创建或获取会话
 */
function getOrCreateSession(sessionId) {
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    chatSessions[sessionId] = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      messages: [],
      lastActiveAt: new Date().toISOString()
    };
  } else if (!chatSessions[sessionId]) {
    chatSessions[sessionId] = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      messages: [],
      lastActiveAt: new Date().toISOString()
    };
  }
  
  return sessionId;
}

/**
 * 添加消息到会话
 */
function addMessage(sessionId, role, content, metadata = {}) {
  if (!chatSessions[sessionId]) return;
  
  chatSessions[sessionId].messages.push({
    role,
    content,
    timestamp: new Date().toISOString(),
    ...metadata
  });
  
  chatSessions[sessionId].lastActiveAt = new Date().toISOString();
  
  // 限制会话历史长度（最多 20 条消息）
  if (chatSessions[sessionId].messages.length > 20) {
    chatSessions[sessionId].messages = chatSessions[sessionId].messages.slice(-20);
  }
  
  saveSessions();
}

/**
 * 获取会话历史
 */
function getSessionHistory(sessionId, limit = 10) {
  if (!chatSessions[sessionId]) return [];
  
  return chatSessions[sessionId].messages.slice(-limit);
}

/**
 * 处理客服请求（核心逻辑）
 */
async function handleCustomerService(question, sessionId = null) {
  console.log(`\n💬 收到问题：${question}`);
  
  // 1. RAG 检索相关文档
  const results = retrieveContext(question);
  console.log(`🔍 检索到 ${results.length} 篇相关文档`);
  
  // 2. 构建带上下文的提示
  const context = buildContext(results);
  
  const systemPrompt = `你是 OpenClaw 网站的智能客服助手。请根据提供的网站内容回答用户问题。

## 回答规则
1. 只基于提供的网站内容回答，不要编造信息
2. 如果内容中没有相关信息，诚实地告诉用户
3. 引用相关文档时提供链接
4. 回答简洁明了，步骤清晰
5. 使用友好的中文语气
6. 如果问题涉及代码或配置，可以提供示例

## 相关网站内容
${context}

## 对话历史
${sessionId ? JSON.stringify(getSessionHistory(sessionId, 5)) : '无历史对话'}

请回答用户的问题：`;

  const fullPrompt = `${systemPrompt}\n\n用户问题：${question}`;
  
  // 3. 调用 Agent
  console.log('🤖 正在生成答案...');
  const agentResult = callAgent(fullPrompt, sessionId);
  
  if (!agentResult || !agentResult.message) {
    return {
      answer: '抱歉，服务暂时不可用，请稍后再试。',
      results: results.map(doc => ({
        title: doc.title,
        link: doc.url
      })),
      sessionId
    };
  }
  
  const answer = agentResult.message;
  console.log('✅ 答案生成完成');
  
  // 4. 保存会话
  if (sessionId) {
    addMessage(sessionId, 'user', question);
    addMessage(sessionId, 'assistant', answer, {
      results: results.map(doc => ({
        title: doc.title,
        link: doc.url
      }))
    });
  }
  
  return {
    answer,
    results: results.map(doc => ({
      title: doc.title,
      link: doc.url
    })),
    sessionId
  };
}

/**
 * HTTP 服务器
 */
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 健康检查
  if (parsedUrl.pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      indexedDocs: contentIndex ? contentIndex.totalDocuments : 0,
      activeSessions: Object.keys(chatSessions).length
    }));
    return;
  }
  
  // 获取会话历史
  if (parsedUrl.pathname === '/api/session' && req.method === 'GET') {
    const sessionId = parsedUrl.searchParams.get('id');
    const limit = parseInt(parsedUrl.searchParams.get('limit') || '10');
    
    const history = getSessionHistory(sessionId, limit);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ history }));
    return;
  }
  
  // 清除会话
  if (parsedUrl.pathname === '/api/session' && req.method === 'DELETE') {
    const sessionId = parsedUrl.searchParams.get('id');
    
    if (sessionId && chatSessions[sessionId]) {
      delete chatSessions[sessionId];
      saveSessions();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '会话不存在' }));
    }
    return;
  }
  
  // 客服 API
  if (parsedUrl.pathname === '/api/customer-service' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { question, sessionId } = JSON.parse(body);
        
        if (!question || typeof question !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '缺少 question 参数' }));
          return;
        }
        
        // 创建或获取会话
        const activeSessionId = getOrCreateSession(sessionId);
        
        const result = await handleCustomerService(question, activeSessionId);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('❌ 处理请求失败:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// 启动服务器
console.log('\n🚀 OpenClaw 智能客服 API v2 启动中...\n');

// 加载索引和会话
if (!loadIndex()) {
  console.log('⚠️  索引文件不存在，运行以下内容索引器：');
  console.log('   node scripts/content-indexer.js\n');
}
loadSessions();

server.listen(PORT, () => {
  console.log(`✅ 客服 API v2 已启动`);
  console.log(`📍 监听端口：${PORT}`);
  console.log(`🌐 访问地址：http://localhost:${PORT}`);
  console.log(`💡 健康检查：http://localhost:${PORT}/health`);
  console.log(`\n按 Ctrl+C 停止服务\n`);
});

// 定期保存会话（每 5 分钟）
setInterval(() => {
  saveSessions();
}, 5 * 60 * 1000);

// 定期重新加载索引（每 10 分钟）
setInterval(() => {
  loadIndex();
}, 10 * 60 * 1000);
