<template>
  <div id="particles-container" class="particles-container">
    <!-- 动态光源层 -->
    <div class="light-sources">
      <div class="light-orb light-orb-1"></div>
      <div class="light-orb light-orb-2"></div>
      <div class="light-orb light-orb-3"></div>
      <div class="light-beam light-beam-1"></div>
      <div class="light-beam light-beam-2"></div>
    </div>
    <div id="tsparticles" class="tsparticles"></div>
    <!-- 发光粒子层 -->
    <canvas id="glow-canvas" class="glow-canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

let tsParticles = null
let animationFrameId = null
let canvas = null
let ctx = null
let glowParticles = []
let mouseX = 0
let mouseY = 0

// 光源位置
const lightSources = ref([
  { x: 0.2, y: 0.3, vx: 0.0003, vy: 0.0002, color: '0, 217, 255', size: 0.3 },
  { x: 0.8, y: 0.7, vx: -0.0002, vy: 0.0003, color: '123, 44, 191', size: 0.25 },
  { x: 0.5, y: 0.5, vx: 0.0001, vy: -0.0002, color: '0, 255, 136', size: 0.2 }
])

onMounted(async () => {
  // 动态加载 tsparticles
  const { loadFull } = await import('@tsparticles/slim')
  tsParticles = await loadFull()
  
  // 初始化发光粒子画布
  canvas = document.getElementById('glow-canvas')
  if (canvas) {
    ctx = canvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    initGlowParticles()
    animateGlowParticles()
  }
  
  await tsParticles.load('tsparticles', {
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 0.6
          }
        },
        bubble: {
          distance: 250,
          duration: 1.5,
          opacity: 0.9,
          size: 30,
          speed: 2.5
        }
      }
    },
    particles: {
      color: {
        value: ['#00d9ff', '#00ff88', '#7b2cbf', '#ff006e', '#3a86ff', '#ff006e']
      },
      links: {
        color: '#00d9ff',
        distance: 180,
        enable: true,
        opacity: 0.4,
        width: 1.2,
        triangles: {
          enable: true,
          opacity: 0.15
        }
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce'
        },
        random: true,
        speed: 2,
        straight: false,
        attract: {
          enable: true,
          rotate: {
            x: 1,
            y: 1
          }
        }
      },
      number: {
        density: {
          enable: true,
          area: 700
        },
        value: 100
      },
      opacity: {
        value: {
          min: 0.2,
          max: 0.9
        },
        animation: {
          enable: true,
          speed: 1.5,
          minimumValue: 0.2,
          sync: false
        }
      },
      shape: {
        type: ['circle', 'edge']
      },
      size: {
        value: {
          min: 2,
          max: 6
        },
        animation: {
          enable: true,
          speed: 3,
          minimumValue: 1,
          sync: false
        }
      },
      shadow: {
        enable: true,
        blur: 10,
        color: {
          value: '#00d9ff'
        }
      },
      rotate: {
        value: {
          min: 0,
          max: 360
        },
        animation: {
          enable: true,
          speed: 1,
          sync: false
        }
      }
    },
    detectRetina: true,
    background: {
      color: 'transparent'
    },
    glow: {
      enable: true,
      color: {
        value: '#00d9ff'
      },
      strength: 8
    }
  })
  
  // 启动光源移动动画
  animateLightSources()
})

function resizeCanvas() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function handleMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  
  // 添加鼠标追踪粒子
  if (glowParticles.length < 150) {
    for (let i = 0; i < 3; i++) {
      glowParticles.push({
        x: mouseX + (Math.random() - 0.5) * 50,
        y: mouseY + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 2,
        life: 1,
        decay: 0.015 + Math.random() * 0.01,
        color: `hsla(${Math.random() * 60 + 180}, 100%, 60%,`
      })
    }
  }
}

function initGlowParticles() {
  // 初始化一些发光粒子
  for (let i = 0; i < 50; i++) {
    glowParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 4 + 1,
      life: 1,
      decay: 0.005 + Math.random() * 0.01,
      color: `hsla(${Math.random() * 60 + 180}, 100%, 60%,`
    })
  }
}

function animateGlowParticles() {
  if (!ctx || !canvas) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalCompositeOperation = 'lighter'
  
  // 更新和绘制粒子
  for (let i = glowParticles.length - 1; i >= 0; i--) {
    const p = glowParticles[i]
    p.x += p.vx
    p.y += p.vy
    p.life -= p.decay
    p.size *= 0.995
    
    if (p.life <= 0 || p.size < 0.5) {
      glowParticles.splice(i, 1)
      continue
    }
    
    // 绘制发光粒子
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
    gradient.addColorStop(0, `${p.color} ${p.life * 0.8})`)
    gradient.addColorStop(0.5, `${p.color} ${p.life * 0.4})`)
    gradient.addColorStop(1, `${p.color} 0)`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // 绘制光源之间的连接线
  lightSources.value.forEach((source, i) => {
    const x1 = source.x * canvas.width
    const y1 = source.y * canvas.height
    
    lightSources.value.forEach((source2, j) => {
      if (j > i) {
        const x2 = source2.x * canvas.width
        const y2 = source2.y * canvas.height
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        
        if (dist < canvas.width * 0.6) {
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          gradient.addColorStop(0, `rgba(${source.color}, ${0.15 * (1 - dist / (canvas.width * 0.6))})`)
          gradient.addColorStop(1, `rgba(${source2.color}, ${0.15 * (1 - dist / (canvas.width * 0.6))})`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    })
  })
  
  animationFrameId = requestAnimationFrame(animateGlowParticles)
}

function animateLightSources() {
  // 移动光源
  lightSources.value.forEach(source => {
    source.x += source.vx
    source.y += source.vy
    
    // 边界检测
    if (source.x < 0.1 || source.x > 0.9) source.vx *= -1
    if (source.y < 0.1 || source.y > 0.9) source.vy *= -1
  })
  
  // 更新 CSS 变量
  if (typeof document !== 'undefined') {
    lightSources.value.forEach((source, i) => {
      document.documentElement.style.setProperty(`--light-${i + 1}-x`, `${source.x * 100}%`)
      document.documentElement.style.setProperty(`--light-${i + 1}-y`, `${source.y * 100}%`)
    })
  }
  
  requestAnimationFrame(animateLightSources)
}

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (tsParticles && tsParticles.destroy) {
    tsParticles.destroy()
  }
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.tsparticles {
  width: 100%;
  height: 100%;
}

/* 动态光源层 */
.light-sources {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* 发光球体 */
.light-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: orbPulse 6s ease-in-out infinite;
  mix-blend-mode: screen;
}

.light-orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 217, 255, 0.4) 0%, transparent 70%);
  left: var(--light-1-x, 20%);
  top: var(--light-1-y, 30%);
  animation-delay: 0s;
}

.light-orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(123, 44, 191, 0.4) 0%, transparent 70%);
  left: var(--light-2-x, 80%);
  top: var(--light-2-y, 70%);
  animation-delay: 2s;
}

.light-orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 255, 136, 0.3) 0%, transparent 70%);
  left: var(--light-3-x, 50%);
  top: var(--light-3-y, 50%);
  animation-delay: 4s;
}

@keyframes orbPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

/* 光束效果 */
.light-beam {
  position: absolute;
  background: linear-gradient(
    180deg,
    rgba(0, 217, 255, 0.15) 0%,
    rgba(0, 217, 255, 0.05) 50%,
    transparent 100%
  );
  width: 2px;
  height: 100%;
  animation: beamShimmer 4s ease-in-out infinite;
}

.light-beam-1 {
  left: 25%;
  animation-delay: 0s;
}

.light-beam-2 {
  left: 75%;
  background: linear-gradient(
    180deg,
    rgba(123, 44, 191, 0.15) 0%,
    rgba(123, 44, 191, 0.05) 50%,
    transparent 100%
  );
  animation-delay: 2s;
}

@keyframes beamShimmer {
  0%, 100% {
    opacity: 0.3;
    transform: scaleY(0.8);
  }
  50% {
    opacity: 0.8;
    transform: scaleY(1.1);
  }
}

/* 发光画布 */
.glow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: screen;
}
</style>
