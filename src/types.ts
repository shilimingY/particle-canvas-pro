// 粒子对象接口
export interface Particle {
  x: number; // 粒子在画布上的水平坐标位置
  y: number; // 粒子在画布上的垂直坐标位置
  vx: number; // 粒子在水平方向上的运动速度
  vy: number; // 粒子在垂直方向上的运动速度
  size: number; // 粒子的半径大小
  color: string; // 粒子当前显示的颜色
  originalColor: string; // 粒子的原始颜色
  pulse: number; // 脉动值，用于控制粒子大小的周期性变化
  pulseSpeed: number; // 脉动速度，控制脉动变化的快慢
  trailPositions: any[], // 是否显示粒子运动轨迹
}

// 配置选项接口（用户可配置的参数）
export interface ParticleCanvasOptions {
  canvasContainer?: HTMLElement | string; // 画布容器元素或选择器
  canvasSize?: [number, number]; // 画布尺寸，格式为[宽度, 高度]（仅内嵌模式有效）
  canvasBackgroundColor?: string; // 画布背景颜色，支持CSS颜色格式
  isBackground?: boolean; // 是否作为页面背景，true-背景模式，false-内嵌模式
  particleNumber?: number; // 粒子数量，控制画布中粒子的总数（取值范围：1-800）
  particleSpeed?: number; // 粒子运动速度，值越大移动越快（取值范围：0-3）
  particleSize?: number; // 粒子大小，控制每个粒子的半径（取值范围：1-10像素）
  particleColor?: string | string[]; // 粒子颜色，支持单色字符串或多色数组
  particleBlur?: number; // 粒子阴影模糊效果强度（取值范围：0-5）
  showTrail?: boolean, // 是否显示粒子轨迹效果
  trailIntensity?: number // 粒子轨迹效果强度
  showLine?: boolean; // 是否显示连线，控制是否绘制粒子间的连接线
  lineWidth?: number; // 连线宽度，控制粒子间连线的粗细（取值范围：0-5像素）
  lineColor?: string; // 连线颜色，粒子间连线的颜色
  lineOpacity?: number; // 连线透明度（取值范围：0-1，0为完全透明，1为完全不透明）
  linkDistance?: number; // 连接距离，粒子间产生连线的最大距离（取值范围：10-300像素）
}

// 内部配置接口（系统内部使用的完整配置）
export interface ParticleCanvasConfig {
  canvasContainer: HTMLElement | string; // 画布容器元素或选择器，必填参数
  canvasSize: [number, number]; // 画布尺寸，格式为[宽度, 高度]（仅内嵌模式有效）
  canvasBackgroundColor: string; // 画布背景颜色，支持CSS颜色格式
  isBackground: boolean; // 是否作为页面背景，true-背景模式，false-内嵌模式
  particleNumber: number; // 粒子数量，控制画布中粒子的总数（取值范围：1-800）
  particleSpeed: number; // 粒子运动速度，值越大移动越快（取值范围：0-3）
  particleSize: number; // 粒子大小，控制每个粒子的半径（取值范围：1-10像素）
  particleColor: string | string[]; // 粒子颜色，支持单色字符串或多色数组
  particleBlur: number; // 粒子阴影模糊效果强度（取值范围：0-5）
  showTrail: boolean, // 是否显示粒子轨迹效果
  trailIntensity: number // 粒子轨迹效果强度
  showLine: boolean; // 是否显示连线，控制是否绘制粒子间的连接线
  lineWidth: number; // 连线宽度，控制粒子间连线的粗细（取值范围：0-5像素）
  lineColor: string; // 连线颜色，粒子间连线的颜色
  lineOpacity: number; // 连线透明度（取值范围：0-1，0为完全透明，1为完全不透明）
  linkDistance: number; // 连接距离，粒子间产生连线的最大距离（取值范围：10-300像素）
}

// ParticleCanvas 类声明
export declare class ParticleCanvas {
  constructor(options?: ParticleCanvasOptions);
  start(): void;
  stop(): void;
  reset(): void;
  resize(): void;
  destroy(): void;
}