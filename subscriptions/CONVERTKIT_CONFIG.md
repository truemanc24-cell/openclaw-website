# ConvertKit 配置

## API Credentials
- **API Key**: `H8sk9galK-gQVtYKHdzjQw`
- **API Secret**: _(待填写)_

## 配置步骤

### 1. 获取 API Secret
1. 登录 ConvertKit
2. 进入 Settings → Advanced
3. 复制 API Secret
4. 更新此文件

### 2. 环境变量（Vercel）
在 Vercel 项目设置中添加：
```
CONVERTKIT_API_KEY=H8sk9galK-gQVtYKHdzjQw
CONVERTKIT_API_SECRET=<your-secret>
CONVERTKIT_FORM_ID=<your-form-id>
```

### 3. 前端集成
- 表单组件：`subscriptions/SubscribeForm.vue`
- 嵌入代码：`subscriptions/EMBED_CODE.html`

## 待办
- [ ] 获取 API Secret
- [ ] 创建 ConvertKit 表单
- [ ] 获取 Form ID
- [ ] 配置 Vercel 环境变量
- [ ] 测试订阅功能

---
**创建时间**: 2026-03-14 11:59
**API Key 已配置**: ✅
