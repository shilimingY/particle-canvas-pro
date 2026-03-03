/**
 * 高性能粒子系统
 * 使用Canvas实现可配置的粒子动画效果，支持背景模式和内嵌模式
 */
import { ParticleCanvasOptions } from './types';
declare class ParticleCanvas {
    private config;
    private particles;
    private animationId;
    private isRunning;
    private lastTime;
    private fps;
    private fpsInterval;
    private then;
    private frameCount;
    private lastFpsUpdate;
    private canvas;
    private ctx;
    private container;
    private resizeTimer;
    private wasRunningBeforeHide;
    private readonly MAX_PARTICLE_NUMBER;
    private readonly MAX_PARTICLE_SPEED;
    private readonly MAX_PARTICLE_SIZE;
    private readonly MAX_LINK_DISTANCE;
    private readonly MAX_LINE_WIDTH;
    private readonly MAX_LINE_OPACITY;
    private readonly MAX_TRAIL_VALUE;
    private readonly MAX_PARTICLE_BLUR;
    private readonly MAX_TRAIL_INTENSITY;
    private lastFrameTime;
    /**
     * 初始化配置
     * @param {ParticleCanvasOptions} options - 配置对象
     */
    constructor(options?: ParticleCanvasOptions);
    /**
     * 验证并限制配置选项，确保参数在合理范围内
     * @param options 用户提供的配置选项
     * @returns 验证后的配置选项
     */
    private validateAndLimitOptions;
    /**
     * 初始化粒子系统
     * 创建画布、设置容器、创建粒子、绑定事件
     */
    private init;
    /**
     * 设置画布样式和尺寸
     * 根据配置决定是背景模式还是内嵌模式
     */
    private setupCanvas;
    /**
     * 创建粒子数组
     * 根据配置生成指定数量的粒子
     */
    private createParticles;
    /**
     * 更新粒子状态
     * 计算每个粒子的新位置和状态
     * @param deltaTime 时间增量（毫秒）
     */
    private updateParticles;
    /**
     * 绘制粒子轨迹效果
     * 在粒子后面绘制自然的光影拖尾效果
     */
    private drawTrailEffect;
    /**
     * 解析颜色字符串为RGB对象
     * @param colorStr 颜色字符串
     * @returns RGB对象
     */
    private parseColor;
    /**
     * 绘制粒子和连线
     * 在画布上渲染粒子系统
     */
    private drawParticles;
    /**
     * 更新FPS计数器
     * 计算并更新当前帧率
     */
    private updateFPS;
    /**
     * 动画循环
     * 使用requestAnimationFrame实现平滑动画
     */
    private animate;
    /**
     * 开始粒子动画
     */
    start(): void;
    /**
     * 暂停粒子动画
     */
    pause(): void;
    /**
     * 重置粒子系统
     * 重新创建粒子并开始动画
     */
    reset(): void;
    /**
     * 调整画布尺寸
     * 主要用于响应窗口大小变化，优化性能
     */
    resize(): void;
    /**
     * 销毁粒子系统
     * 停止动画并移除画布
     */
    destroy(): void;
    /**
     * 绑定事件监听器
     */
    private bindEvents;
}
export default ParticleCanvas;
