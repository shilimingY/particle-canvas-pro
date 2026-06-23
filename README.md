# particle-canvas-pro

`particle-canvas-pro` 是一款轻量高效的粒子动画库，基于 Canvas 现代化高性能粒子动画系统，可无缝集成到各类web应用中，作为背景或独立可视化元素，为你的网页带来沉浸式动态背景与视觉特效。

# 核心优势

✨ 高性能渲染：基于 `requestAnimationFrame` 实现帧同步动画，自动适配屏幕刷新率，兼顾流畅度与性能开销；

💡 智能资源调度：监听页面可见性变化，切换标签 / 最小化窗口时自动暂停动画、停止帧请求，避免后台无意义的 CPU/GPU 消耗；页面恢复可见时自动恢复动画状态，兼顾体验与资源节省，适配多标签页场景；

🎨 双模式适配：支持全屏背景模式（覆盖视口）和内嵌元素模式（自定义尺寸），适配不同业务场景，带来沉浸式体验；

🔧 多维度配置：粒子数量、速度、大小、颜色等参数均可自定义配置，并支持单色 / 多色粒子；

🔄 实时交互控制：支持即时启动、暂停和销毁等操作，且实现动态FPS监控；

🌈 炫酷视觉效果：内置轨迹效果、粒子脉动、连线交互等多种特效；

📱 响应式适配：全屏背景模式下，可以自动响应窗口大小变化，无需手动调整；

# 安装

```bash
# 通过 npm 安装
npm i particle-canvas-pro -S

# 通过 yarn 安装
yarn add particle-canvas-pro

# 通过 CDN 引入
<script src="https://unpkg.com/particle-canvas-pro@latest/dist/bundle.js"></script>
```

# 快速开始

只需几行代码即可接入粒子动效，轻松提升页面视觉层次感。

## 基础使用

### 全屏背景模式

```javascript
import ParticleCanvasPro from 'particle-canvas-pro';

// 创建粒子动画实例
const particleSystem = new ParticleCanvasPro({
  isBackground: true,          // 全屏背景模式，默认模式
  particleNumber: 150,         // 粒子数量
  particleColor: '#9c4aff',    // 粒子颜色
  lineColor: '#ffffff',        // 连线颜色
  trailValue: 0.2             // 轨迹效果
});

// 启动动画
particleSystem.start();
```

### 内嵌模式（自定义容器）

```javascript
import ParticleCanvasPro from 'particle-canvas-pro';

// 在指定容器中创建粒子画布
const particleSystem = new ParticleCanvasPro({
  canvasContainer: '#particle-container',  // 容器选择器
  isBackground: false,      // 非背景模式
  canvasSize: [800, 600],   // 画布尺寸
  particleNumber: 200,
  showLinkLine: true,
  linkDistance: 150
});

// 启动动画
particleSystem.start();
```

# 参数配置

| 参数名                  | 说明                                  | 类型                      | 取值范围                     | 默认值                     |
|------------------------|---------------------------------------|--------------------------|-----------------------------|---------------------------|
| canvasContainer        | 画布容器元素或选择器                    | `string` / `HTMLElement` | -                           | `document.body`           |
| canvasBackgroundColor  | 画布背景颜色                           | `string`                 | -                           | `rgb(10, 10, 25)`     |
| canvasSize             | 画布尺寸（非背景模式）                  | `[number, number]`       | -                           | [800, 600]                |
| isBackground           | 是否作为页面背景                       | `boolean`                | `true` / `false`            | `true`                    |
| particleNumber         | 粒子数量                               | `number`                 | 1-800                       | 150                       |
| particleSpeed          | 粒子运动速度                           | `number`                 | 0-3                       | 1                         |
| particleSize           | 粒子大小（像素）                       | `number`                 | 1-10                        | 5                         |
| particleColor          | 粒子颜色（单色或多色）                  | `string` / `string[]`    | -                           | `rgba(156, 74, 255, 0.6)` |
| showTrail              | 是否显示粒子轨迹效果                    |  `boolean`                |  `true` / `false`          | `true`                     |
| trailIntensity         | 粒子轨迹效果强度                        |  `number`                |  0-5                        | 2                          |
| showLine               | 是否显示粒子连线                        | `boolean`                | `true` / `false`            | `true`                    |
| lineWidth              | 连线宽度（像素）                       | `number`                 | 0-5                           | 1                        |
| lineColor              | 连线颜色                               | `string`                 | -                           | `#ffffff`                 |
| lineOpacity            | 连线透明度                             | `number`                 | 0-1                         | 0.3                       |
| linkDistance           | 连线距离（像素）                       | `number`                 | 10-300                      | 120                       |

<br>

# 实例方法

| 方法名    | 说明                                  |
|-----------|--------------------------------------|
| start()   | 启动粒子动画                          |
| stop()   | 暂停粒子动画                          |
| reset()   | 重置粒子位置和状态，重新启动动画        |
| destroy() | 销毁粒子动画，移除画布元素              |

<br>

# 构建配置
### 该粒子动画库支持多种模块格式：

- ES Module (dist/bundle.esm.js)
- CommonJS (dist/bundle.cjs.js)
- UMD (dist/bundle.js)

> ❤️ 喜欢这个插件？  
> 如果你觉得它靠谱又省心，**点个 [⭐ Star](https://github.com/shilimingY/particle-canvas-pro) 收藏** 就是最大的鼓励！  ☕️✨