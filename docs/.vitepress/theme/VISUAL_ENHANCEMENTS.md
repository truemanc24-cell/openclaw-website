# 视觉增强功能说明

## 🎨 已实现的功能

### 1. 粒子背景效果 (ParticleBackground.vue)

使用 **tsParticles** 库创建的动态粒子系统：

- **多彩粒子**: 青色 (#00d9ff)、绿色 (#00ff88)、紫色 (#7b2cbf)、粉色 (#ff006e)
- **交互效果**: 鼠标悬停时产生气泡效果
- **动态连线**: 粒子之间自动连接，形成科技感网络
- **自动动画**: 粒子大小和透明度渐变动画

#### 使用方式
```vue
<ParticleBackground />
```

### 2. 科技布局组件 (TechLayout.vue)

完整的科技感页面布局，包含：

#### 视觉元素
- ✅ **动态渐变背景**: 15 秒循环的深色渐变
- ✅ **光效层**: 三个径向渐变光晕，8 秒脉冲动画
- ✅ **网格背景**: 50px 间距的科技感网格
- ✅ **粒子容器**: 支持嵌入粒子效果

#### 页脚功能
- ✅ **二维码预留位**: 虚线框占位符，带悬停效果
- ✅ **社交链接**: GitHub 链接，带光晕效果
- ✅ **响应式设计**: 移动端自动调整为单列布局

#### 使用方式
```vue
<TechLayout>
  <template #particles>
    <ParticleBackground />
  </template>
  
  <!-- 页面内容 -->
  <div class="content">
    ...
  </div>
</TechLayout>
```

### 3. 主题样式

#### vars.css - 主题变量
- 赛博朋克配色方案
- 光晕效果变量
- 渐变预设
- 动画关键帧

#### base.css - 基础增强
- 导航栏毛玻璃效果
- Hero 区域渐变文字
- 按钮光效动画
- 卡片悬停效果
- 代码块增强
- 滚动条美化

## 📱 添加微信二维码

### 方法一：使用 TechLayout 组件

1. **准备二维码图片**
   - 格式：PNG 或 JPG
   - 建议尺寸：200x200px 或更大
   - 放置位置：`docs/public/wechat-qr.png`

2. **在组件中引用**
```vue
<TechLayout>
  <template #particles>
    <ParticleBackground />
  </template>
  
  <!-- 页面内容 -->
  <Content />
</TechLayout>
```

3. **通过 ref 设置二维码**
```vue
<script setup>
import { ref, onMounted } from 'vue'
import TechLayout from './components/TechLayout.vue'

const techLayout = ref(null)

onMounted(() => {
  // 设置二维码图片路径
  techLayout.value?.setQRCode('/wechat-qr.png')
})
</script>

<template>
  <TechLayout ref="techLayout">
    <ParticleBackground />
    <Content />
  </TechLayout>
</template>
```

### 方法二：直接修改组件默认值

编辑 `docs/.vitepress/theme/components/TechLayout.vue`:

```javascript
// 修改第 78-79 行
const showQRPlaceholder = ref(false) // 改为 false
const qrImage = ref('/wechat-qr.png') // 填入图片路径
```

## 🎯 自定义建议

### 调整粒子效果
编辑 `ParticleBackground.vue` 中的配置：

```javascript
particles: {
  number: {
    value: 80  // 粒子数量，建议 50-150
  },
  size: {
    value: { min: 1, max: 5 }  // 粒子大小范围
  },
  move: {
    speed: 1.5  // 移动速度，建议 0.5-3
  }
}
```

### 修改配色方案
编辑 `styles/vars.css`:

```css
:root {
  --vp-c-brand: #00d9ff;      /* 主色调 */
  --vp-c-accent: #00ff88;     /* 强调色 */
  --vp-c-purple: #7b2cbf;     /* 紫色 */
  --vp-c-pink: #ff006e;       /* 粉色 */
}
```

### 调整光效强度
编辑 `TechLayout.vue`:

```css
.glow-effect {
  background: 
    radial-gradient(circle at 20% 30%, rgba(0, 217, 255, 0.08) 0%, transparent 50%),
    /* 调整透明度值 (0.01-0.2) 来控制光效强度 */
}
```

## 📦 依赖包

已安装的包：
- `tsparticles-slim@2.12.0` - 轻量级粒子库

> ⚠️ **注意**: npm 警告显示 tsparticles v3 已更改包名结构，但 v2 版本仍可正常使用。如需升级到 v3，请使用 `@tsparticles/basic` 等新包名。

## 🚀 测试效果

启动开发服务器查看效果：

```bash
cd ~/Desktop/Mark/2026-03-12_OpenClaw_Website
npm run docs:dev
```

访问 http://localhost:5173 查看网站。

## 📝 待办事项

- [ ] 用户提供微信二维码图片路径
- [ ] 将二维码图片放入 `docs/public/` 目录
- [ ] 在 TechLayout 中配置真实二维码
- [ ] 测试移动端显示效果
- [ ] 根据需要调整粒子密度和颜色

---

**最后更新**: 2026-03-17 22:30
**版本**: 1.0.0
