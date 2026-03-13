# OpenClaw 官方网站

OpenClaw 强大的 AI 助手平台官方文档网站。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览生产版本
npm run docs:preview
```

## 部署

本网站已配置 Vercel 自动部署。

### 手动部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

## 项目结构

```
.
├── docs/
│   ├── .vitepress/
│   │   └── config.mjs    # VitePress 配置
│   ├── guide/            # 文档页面
│   │   ├── introduction.md
│   │   ├── getting-started.md
│   │   └── configuration.md
│   ├── index.md          # 首页
│   └── about.md          # 关于页
├── package.json
├── vercel.json           # Vercel 部署配置
└── README.md
```

## 许可证

MIT
