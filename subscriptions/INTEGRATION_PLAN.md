# OpenClaw 网站订阅系统集成方案

## 📧 选择的邮件订阅服务商：ConvertKit（免费版）

### 选择理由

| 对比项 | ConvertKit | Buttondown |
|--------|-----------|------------|
| 免费用户上限 | 10,000 订阅者 | 100 订阅者 |
| 表单数量 | 无限 | 有限 |
| 着陆页 | 包含 | 需付费 |
| 自动邮件 | 包含 | 需付费 |
| 长期扩展性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

**结论**: ConvertKit 免费版完全满足当前需求，且支持未来增长到 10,000 用户。

---

## 🚀 实施步骤

### 步骤 1: 创建 ConvertKit 账户

1. 访问 https://kit.com/
2. 点击 "Get Started Free"
3. 填写基本信息（无需信用卡）
4. 验证邮箱

### 步骤 2: 创建订阅表单

1. 登录 ConvertKit 后，进入 **Grow** → **Landing Pages & Forms**
2. 点击 **Create New** → **Form**
3. 选择模板或从头开始
4. 配置表单字段：
   - Email（必需）
   - Name（可选）
5. 自定义样式以匹配 OpenClaw 品牌
6. 保存并获取嵌入代码

### 步骤 3: 配置欢迎邮件

1. 进入 **Automate** → **Sequences**
2. 点击 **Create Sequence**
3. 命名为 "Welcome Sequence"
4. 添加第一封邮件：
   - 主题：欢迎订阅 OpenClaw！
   - 内容：感谢 + 价值说明 + 下一步指引
5. 设置触发条件：订阅后立即发送

### 步骤 4: 集成到 VitePress 网站

将表单嵌入代码添加到以下位置：
- `docs/.vitepress/theme/components/SubscribeForm.vue`
- `docs/index.md`（首页）
- `docs/about.md`（关于页面）

### 步骤 5: 测试订阅流程

1. 使用测试邮箱订阅
2. 验证欢迎邮件送达
3. 检查 ConvertKit 后台数据
4. 测试取消订阅流程

---

## 📁 交付物清单

- [x] 本集成文档
- [ ] 订阅表单嵌入代码（待 ConvertKit 账户创建后生成）
- [ ] 欢迎邮件模板（待 ConvertKit 账户创建后配置）
- [ ] 测试报告

---

## 🔗 相关资源

- ConvertKit 文档：https://kit.com/help
- 表单嵌入指南：https://kit.com/help/articles/360003139554-Embed-a-Form
- 自动化设置：https://kit.com/help/articles/360003139514-Create-an-Automation

---

**创建日期**: 2026-03-14  
**状态**: 待实施（需要创建 ConvertKit 账户）
