#!/usr/bin/env node

/**
 * OpenClaw 网站内容索引器
 * 用于 RAG 检索增强
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const INDEX_FILE = path.join(__dirname, 'content-index.json');

/**
 * 遍历目录获取所有 markdown 文件
 */
function walkDir(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    if (file.startsWith('.')) continue;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath, baseDir));
    } else if (file.endsWith('.md')) {
      const relativePath = path.relative(baseDir, filePath);
      results.push({
        fullPath: filePath,
        relativePath,
        url: '/' + relativePath.replace('.md', '.html'),
        category: relativePath.split('/')[0]
      });
    }
  }
  
  return results;
}

/**
 * 提取文档的关键信息
 */
function extractDocumentInfo(filePath, relativePath, category) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
  
  // 提取所有二级标题作为子主题
  const headings = content.match(/^##\s+(.+)$/gm) || [];
  const subTopics = headings.map(h => h.replace(/^##\s+/, ''));
  
  // 提取前 1000 字作为摘要
  const summary = content
    .replace(/^#\s+.+$/m, '')
    .replace(/^##\s+.+$/gm, '')
    .trim()
    .substring(0, 1000);
  
  // 提取关键词（简单的词频统计）
  const words = content
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  const wordFreq = {};
  words.forEach(w => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });
  
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
  
  return {
    title,
    path: relativePath,
    url,
    category,
    content: content.substring(0, 3000), // 保存前 3000 字
    summary,
    subTopics,
    keywords,
    wordCount: content.length,
    indexedAt: new Date().toISOString()
  };
}

/**
 * 构建索引
 */
function buildIndex() {
  console.log('📚 开始构建网站内容索引...\n');
  
  const dirs = ['tutorials', 'guide', 'start', 'skills', 'concepts', 'tools', 'news'];
  const documents = [];
  
  for (const dir of dirs) {
    const dirPath = path.join(DOCS_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  跳过不存在的目录：${dir}`);
      continue;
    }
    
    console.log(`📁 扫描目录：${dir}`);
    const files = walkDir(dirPath, DOCS_DIR);
    
    for (const file of files) {
      try {
        const doc = extractDocumentInfo(file.fullPath, file.relativePath, file.category);
        documents.push(doc);
        console.log(`  ✓ ${file.relativePath}`);
      } catch (error) {
        console.error(`  ✗ 处理失败：${file.relativePath} - ${error.message}`);
      }
    }
  }
  
  // 保存索引
  const index = {
    version: '1.0',
    builtAt: new Date().toISOString(),
    totalDocuments: documents.length,
    categories: [...new Set(documents.map(d => d.category))],
    documents
  };
  
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
  
  console.log(`\n✅ 索引构建完成！`);
  console.log(`📊 文档总数：${documents.length}`);
  console.log(`📁 分类：${index.categories.join(', ')}`);
  console.log(`💾 索引文件：${INDEX_FILE}\n`);
  
  return index;
}

// 如果直接运行脚本
if (require.main === module) {
  buildIndex();
}

module.exports = { buildIndex, INDEX_FILE };
