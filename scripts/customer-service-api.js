#!/usr/bin/env node

/**
 * OpenClaw 网站客服 API
 * 基于网站内容提供智能问答服务
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// 配置
const PORT = 3456;
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const API_KEY = process.env.DASHSCOPE_API_KEY || 'sk-sp-ed5990848e954e25b9a022beac6dfb61';

// 知识库缓存
let knowledgeBase = [];

/**
 * 加载网站文档内容
 */
function loadDocuments() {
  console.log('📚 加载网站文档...');
  knowledgeBase = [];
  
  const dirs = ['tutorials', 'guide', 'start', 'skills', 'concepts'];
  
  for (const dir of dirs) {
    const dirPath = path.join(DOCS_DIR, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = walkDir(dirPath);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative(DOCS_DIR, file);
        const urlPath = '/' + relativePath.replace('.md', '.html');
        
        // 提取标题和关键词
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');
        
        // 提取前 500 字作为摘要
        const summary = content.replace(/^#\s+.+$/m, '').trim().substring(0, 500);
        
        knowledgeBase.push({
          title,
          path: relativePath,
          url: urlPath,
          content: content.substring(0, 2000), // 保存前 2000 字用于检索
          summary,
          category: dir
        });
        
        console.log(`  ✓ ${relativePath}`);
      }
    }
  }
  
  console.log(`✅ 加载完成，共 ${knowledgeBase.length} 篇文档\n`);
}

/**
 * 遍历目录
 */
function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      results.push(filePath);
    }
  }
  
  return results;
}

/**
 * 搜索相关文档
 */
function searchDocuments(query, limit = 3) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/[\s,，]+/).filter(w => w.length > 1);
  
  const scores = knowledgeBase.map(doc => {
    let score = 0;
    const contentLower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();
    
    // 标题匹配（权重高）
    for (const word of queryWords) {
      if (titleLower.includes(word)) {
        score += 10;
      }
      if (contentLower.includes(word)) {
        score += 1;
      }
    }
    
    return { doc, score };
  });
  
  // 按分数排序
  scores.sort((a, b) => b.score - a.score);
  
  // 返回前 N 个
  return scores.filter(s => s.score > 0).slice(0, limit).map(s => s.doc);
}

/**
 * 调用大模型生成答案
 */
async function generateAnswer(question, context) {
  const prompt = `你是一个 OpenClaw 网站的智能客服助手。请根据以下网站内容回答用户的问题。

## 相关网站内容
${context}

## 用户问题
${question}

## 回答要求
1. 用中文回答
2. 简洁明了，步骤清晰
3. 如果内容中有代码示例，可以引用
4. 如果找不到相关信息，诚实地告诉用户
5. 回答长度控制在 200 字以内

请回答：`;

  try {
    // 使用 OpenClaw 内置的模型调用（通过 exec 调用 openclaw 命令）
    const { execSync } = require('child_process');
    
    const result = execSync(`openclaw ask "请根据以下内容回答用户问题：\n\n${context}\n\n问题：${query}" --model bailian/qwen3.5-plus --max-tokens 500`, {
      encoding: 'utf-8',
      timeout: 10000
    });
    
    return result.trim();
  } catch (error) {
    console.error('❌ 调用大模型失败:', error.message);
    return null;
  }
}

/**
 * 处理客服请求
 */
async function handleCustomerService(query) {
  console.log(`\n💬 收到问题：${query}`);
  
  // 1. 搜索相关文档
  const results = searchDocuments(query);
  console.log(`🔍 找到 ${results.length} 篇相关文档`);
  
  if (results.length === 0) {
    return {
      answer: '抱歉，我暂时没有找到相关的内容。你可以：\n\n1. 换个问法试试\n2. 查看完整文档：/guide/\n3. 提交 GitHub Issue\n4. 加入 Discord 社区求助',
      results: []
    };
  }
  
  // 2. 构建上下文
  const context = results.map((doc, i) => {
    return `### 文档 ${i + 1}: ${doc.title}\n${doc.content}\n`;
  }).join('\n---\n\n');
  
  // 3. 生成答案
  console.log('🤖 正在生成答案...');
  const answer = await generateAnswer(query, context);
  
  if (!answer) {
    return {
      answer: '抱歉，生成答案时遇到错误。请稍后再试。',
      results: results.map(doc => ({
        title: doc.title,
        link: doc.url
      }))
    };
  }
  
  console.log('✅ 答案生成完成');
  
  return {
    answer,
    results: results.map(doc => ({
      title: doc.title,
      link: doc.url
    }))
  };
}

/**
 * HTTP 服务器
 */
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  
  // CORS 允许跨域
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
    res.end(JSON.stringify({ status: 'ok', docs: knowledgeBase.length }));
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
        const { question } = JSON.parse(body);
        
        if (!question || typeof question !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '缺少 question 参数' }));
          return;
        }
        
        const result = await handleCustomerService(question);
        
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
console.log('\n🚀 OpenClaw 客服 API 启动中...\n');
loadDocuments();

server.listen(PORT, () => {
  console.log(`✅ 客服 API 已启动`);
  console.log(`📍 监听端口：${PORT}`);
  console.log(`🌐 访问地址：http://localhost:${PORT}`);
  console.log(`💡 健康检查：http://localhost:${PORT}/health`);
  console.log(`\n按 Ctrl+C 停止服务\n`);
});

// 监听文件变化（简单实现：每 5 分钟重新加载）
setInterval(() => {
  loadDocuments();
}, 5 * 60 * 1000);
