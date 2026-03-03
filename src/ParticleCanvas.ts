/**
 * 高性能粒子系统
 * 使用Canvas实现可配置的粒子动画效果，支持背景模式和内嵌模式
 */
import { ParticleCanvasOptions, ParticleCanvasConfig, Particle } from './types';

class ParticleCanvas {
    // 配置对象，存储粒子系统的所有配置参数
    private config: ParticleCanvasConfig;
    // 粒子数组，存储所有粒子对象
    private particles: Particle[];
    // 动画帧ID，用于控制动画的启动和停止
    private animationId: number | null;
    // 动画运行状态标志
    private isRunning: boolean;
    // 上一帧的时间戳，用于计算时间间隔
    private lastTime: number;
    // 当前帧率（FPS）
    private fps: number;
    // 帧间隔时间（毫秒），基于目标帧率计算
    private fpsInterval: number;
    // 上一帧的时间戳，用于动画循环的时间控制
    private then: number;
    // 帧计数器，用于计算FPS
    private frameCount: number;
    // 上一次更新FPS显示的时间戳
    private lastFpsUpdate: number;
    // HTML Canvas元素
    private canvas!: HTMLCanvasElement;
    // Canvas 2D绘图上下文
    private ctx!: CanvasRenderingContext2D;
    // 画布容器元素
    private container!: HTMLElement;
    // 防抖计时器，用于窗口resize事件
    private resizeTimer: number | null;
    // 页面隐藏前的运行状态
    private wasRunningBeforeHide: boolean;

    // 配置参数的最大值常量
    private readonly MAX_PARTICLE_NUMBER = 800;
    private readonly MAX_PARTICLE_SPEED = 3;
    private readonly MAX_PARTICLE_SIZE = 10;
    private readonly MAX_LINK_DISTANCE = 300;
    private readonly MAX_LINE_WIDTH = 5;
    private readonly MAX_LINE_OPACITY = 1;
    private readonly MAX_TRAIL_VALUE = 1;
    private readonly MAX_PARTICLE_BLUR = 5;
    private readonly MAX_TRAIL_INTENSITY = 5;

    // 用于时间增量计算的变量
    private lastFrameTime: number;

    /**
     * 初始化配置
     * @param {ParticleCanvasOptions} options - 配置对象
     */
    constructor(options: ParticleCanvasOptions = {}) {
        // 验证并限制配置参数
        const validatedOptions = this.validateAndLimitOptions(options);

        // 合并默认配置和用户配置
        this.config = {
            // 画布容器：可以是DOM元素或选择器字符串，默认为document.body
            canvasContainer: validatedOptions.canvasContainer || document.body,
            // 是否作为页面背景：true-背景模式，false-内嵌模式，默认为true
            isBackground: validatedOptions.isBackground !== undefined ? validatedOptions.isBackground : true,
            // 画布背景颜色：支持所有CSS颜色格式，默认为深蓝色半透明
            canvasBackgroundColor: validatedOptions.canvasBackgroundColor || 'rgb(10, 10, 25)',
            // 粒子数量：控制画布中粒子的总数，默认为150
            particleNumber: validatedOptions.particleNumber || 150,
            // 粒子速度：控制粒子的运动速度，值越大移动越快，默认为1
            particleSpeed: validatedOptions.particleSpeed || 1,
            // 粒子大小：控制每个粒子的半径大小，默认为3像素
            particleSize: validatedOptions.particleSize || 5,
            // 粒子颜色：支持单色字符串或多色数组，默认为rgba(156, 74, 255, 0.6)
            particleColor: validatedOptions.particleColor || 'rgba(156, 74, 255, 0.6)',
            // 粒子阴影模糊效果：控制粒子阴影的模糊程度，值越大阴影越模糊，默认为2
            particleBlur: validatedOptions.particleBlur !== undefined ? validatedOptions.particleBlur : 2,
            // 连线宽度：控制粒子间连线的粗细，默认为1像素
            lineWidth: validatedOptions.lineWidth || 1,
            // 连线颜色：粒子间连线的颜色，默认为白色#ffffff
            lineColor: validatedOptions.lineColor || '#ffffff',
            // 连线透明度：控制连线的透明程度，0-1之间，默认为0.3
            lineOpacity: validatedOptions.lineOpacity || 0.3,
            // 连接距离：粒子间产生连线的最大距离，默认为120像素
            linkDistance: validatedOptions.linkDistance || 120,
            // 是否显示粒子连线：控制是否绘制粒子间的连线，默认为true
            showLine: validatedOptions.showLine !== undefined ? validatedOptions.showLine : true,
            // 画布尺寸：当isBackground为false时生效，格式为[宽度, 高度]，默认为[800, 600]
            canvasSize: validatedOptions.canvasSize || [800, 600],
            // 是否显示粒子轨迹效果，默认为true
            showTrail: validatedOptions.showTrail !== undefined ? validatedOptions.showTrail : true,
            // 粒子轨迹效果强度，默认为2
            trailIntensity: validatedOptions.trailIntensity || 2
        };

        // 粒子数组
        this.particles = [];
        // 动画相关变量
        this.animationId = null; // 动画帧ID
        this.isRunning = false; // 动画运行状态
        this.lastTime = 0; // 上一帧时间
        this.fps = 60; // 当前帧率
        this.fpsInterval = 1000 / 60; // 帧间隔（毫秒）
        this.then = Date.now(); // 上一帧时间戳
        this.frameCount = 0; // 帧计数器
        this.lastFpsUpdate = Date.now(); // 上次FPS更新时间
        this.resizeTimer = null; // 防抖计时器
        this.wasRunningBeforeHide = false; // 页面隐藏前的运行状态
        this.lastFrameTime = performance.now(); // 初始化时间戳

        // 初始化粒子系统
        this.init();
    }

    /**
     * 验证并限制配置选项，确保参数在合理范围内
     * @param options 用户提供的配置选项
     * @returns 验证后的配置选项
     */
    private validateAndLimitOptions(options: ParticleCanvasOptions): ParticleCanvasOptions {
        const validatedOptions = { ...options };

        // 验证粒子数量
        if (options.particleNumber !== undefined) {
            if (options.particleNumber > this.MAX_PARTICLE_NUMBER) {
                console.warn(`Warning: particleNumber (${options.particleNumber}) exceeds maximum allowed value (${this.MAX_PARTICLE_NUMBER}). Using maximum value instead.`);
                validatedOptions.particleNumber = this.MAX_PARTICLE_NUMBER;
            } else if (options.particleNumber < 1) {
                console.warn(`Warning: particleNumber (${options.particleNumber}) is below minimum value (1). Using default value instead.`);
                validatedOptions.particleNumber = 150;
            }
        }

        // 验证粒子速度
        if (options.particleSpeed !== undefined) {
            if (options.particleSpeed > this.MAX_PARTICLE_SPEED) {
                console.warn(`Warning: particleSpeed (${options.particleSpeed}) exceeds maximum allowed value (${this.MAX_PARTICLE_SPEED}). Using maximum value instead.`);
                validatedOptions.particleSpeed = this.MAX_PARTICLE_SPEED;
            } else if (options.particleSpeed < 0) {
                console.warn(`Warning: particleSpeed (${options.particleSpeed}) is below minimum value (0). Using default value instead.`);
                validatedOptions.particleSpeed = 1;
            }
        }

        // 验证粒子大小
        if (options.particleSize !== undefined) {
            if (options.particleSize > this.MAX_PARTICLE_SIZE) {
                console.warn(`Warning: particleSize (${options.particleSize}) exceeds maximum allowed value (${this.MAX_PARTICLE_SIZE}). Using maximum value instead.`);
                validatedOptions.particleSize = this.MAX_PARTICLE_SIZE;
            } else if (options.particleSize < 1) {
                console.warn(`Warning: particleSize (${options.particleSize}) is below minimum value (1). Using default value instead.`);
                validatedOptions.particleSize = 3;
            }
        }

        // 验证粒子阴影模糊效果
        if (options.particleBlur !== undefined) {
            if (options.particleBlur > this.MAX_PARTICLE_BLUR) {
                console.warn(`Warning: particleBlur (${options.particleBlur}) exceeds maximum allowed value (${this.MAX_PARTICLE_BLUR}). Using maximum value instead.`);
                validatedOptions.particleBlur = this.MAX_PARTICLE_BLUR;
            } else if (options.particleBlur < 0) {
                console.warn(`Warning: particleBlur (${options.particleBlur}) is below minimum value (0). Using default value instead.`);
                validatedOptions.particleBlur = 2;
            }
        }

        // 验证连接距离
        if (options.linkDistance !== undefined) {
            if (options.linkDistance > this.MAX_LINK_DISTANCE) {
                console.warn(`Warning: linkDistance (${options.linkDistance}) exceeds maximum allowed value (${this.MAX_LINK_DISTANCE}). Using maximum value instead.`);
                validatedOptions.linkDistance = this.MAX_LINK_DISTANCE;
            } else if (options.linkDistance < 10) {
                console.warn(`Warning: linkDistance (${options.linkDistance}) is below minimum value (10). Using default value instead.`);
                validatedOptions.linkDistance = 120;
            }
        }

        // 验证连线宽度
        if (options.lineWidth !== undefined) {
            if (options.lineWidth > this.MAX_LINE_WIDTH) {
                console.warn(`Warning: lineWidth (${options.lineWidth}) exceeds maximum allowed value (${this.MAX_LINE_WIDTH}). Using maximum value instead.`);
                validatedOptions.lineWidth = this.MAX_LINE_WIDTH;
            } else if (options.lineWidth < 0) {
                console.warn(`Warning: lineWidth (${options.lineWidth}) is below minimum value (0). Using default value instead.`);
                validatedOptions.lineWidth = 1;
            }
        }

        // 验证连线透明度
        if (options.lineOpacity !== undefined) {
            if (options.lineOpacity > this.MAX_LINE_OPACITY) {
                console.warn(`Warning: lineOpacity (${options.lineOpacity}) exceeds maximum allowed value (${this.MAX_LINE_OPACITY}). Using maximum value instead.`);
                validatedOptions.lineOpacity = this.MAX_LINE_OPACITY;
            } else if (options.lineOpacity < 0) {
                console.warn(`Warning: lineOpacity (${options.lineOpacity}) is below minimum value (0). Using default value instead.`);
                validatedOptions.lineOpacity = 0.3;
            }
        }

        // 验证粒子轨迹效果强度
        if (options.trailIntensity !== undefined) {
            if (options.trailIntensity > this.MAX_TRAIL_INTENSITY) {
                console.warn(`Warning: trailIntensity (${options.trailIntensity}) exceeds maximum allowed value (${this.MAX_TRAIL_INTENSITY}). Using maximum value instead.`);
                validatedOptions.trailIntensity = this.MAX_TRAIL_INTENSITY;
            } else if (options.trailIntensity < 1) {
                console.warn(`Warning: trailIntensity (${options.trailIntensity}) is below minimum value (1). Using default value instead.`);
                validatedOptions.trailIntensity = 2;
            }
        }

        return validatedOptions;
    }

    /**
     * 初始化粒子系统
     * 创建画布、设置容器、创建粒子、绑定事件
     */
    private init(): void {
        // 创建画布元素
        this.canvas = document.createElement('canvas');
        // 获取2D绘图上下文
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = context;

        // 设置画布容器
        if (typeof this.config.canvasContainer === 'string') {
            const container = document.querySelector(this.config.canvasContainer);
            if (!container) {
                throw new Error(`Canvas container not found: ${this.config.canvasContainer}`);
            }
            this.container = container as HTMLElement;
        } else {
            this.container = this.config.canvasContainer;
        }

        // 检查容器是否存在
        if (!this.container) {
            console.error('Canvas container not found');
            return;
        }

        // 将画布添加到容器中
        this.container.appendChild(this.canvas);
        // 设置画布样式和尺寸
        this.setupCanvas();
        // 创建粒子
        this.createParticles();
        // 绑定事件监听器
        this.bindEvents();
    }

    /**
     * 设置画布样式和尺寸
     * 根据配置决定是背景模式还是内嵌模式
     */
    private setupCanvas(): void {
        if (this.config.isBackground) {
            // 背景模式：画布覆盖整个视口，作为页面背景
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.zIndex = '-1'; // 置于底层
            // 设置画布实际像素尺寸
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        } else {
            // 内嵌模式：画布作为页面中的普通元素
            this.canvas.style.display = 'block';
            const [width, height] = this.config.canvasSize;
            // 设置画布尺寸
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
        }
        // 禁用画布的鼠标事件，防止干扰页面交互
        this.canvas.style.pointerEvents = 'none';
    }

    /**
     * 创建粒子数组
     * 根据配置生成指定数量的粒子
     */
    private createParticles(): void {
        this.particles = [];
        // 判断是否使用多色模式
        const isMultiColor = Array.isArray(this.config.particleColor);

        // 创建指定数量的粒子
        for (let i = 0; i < this.config.particleNumber; i++) {
            // 根据颜色模式选择粒子颜色
            let particleColor: string;
            if (isMultiColor) {
                // 多色模式：随机选择颜色
                const colors = this.config.particleColor as string[];
                particleColor = colors[Math.floor(Math.random() * colors.length)];
            } else {
                // 单色模式：使用固定颜色
                particleColor = this.config.particleColor as string;
            }

            // 创建粒子对象
            this.particles.push({
                x: Math.random() * this.canvas.width, // 随机X坐标
                y: Math.random() * this.canvas.height, // 随机Y坐标
                vx: (Math.random() - 0.5) * 2 * this.config.particleSpeed, // X轴速度（-speed到+speed）
                vy: (Math.random() - 0.5) * 2 * this.config.particleSpeed, // Y轴速度
                size: this.config.particleSize, // 粒子大小
                color: particleColor, // 粒子颜色
                originalColor: particleColor, // 原始颜色（备份）
                pulse: 0, // 脉动值（用于脉动动画）
                pulseSpeed: Math.random() * 0.05 + 0.02, // 脉动速度（随机值）
                // 粒子历史位置数组，用于轨迹效果
                trailPositions: []
            });
        }
    }

    /**
     * 更新粒子状态
     * 计算每个粒子的新位置和状态
     * @param deltaTime 时间增量（毫秒）
     */
    private updateParticles(deltaTime: number): void {
        // 时间因子：将deltaTime转换为相对于60fps的比例因子
        // 60fps时，deltaTime约为16.67ms，时间因子为1
        const timeFactor = deltaTime / 16.67;

        for (const particle of this.particles) {
            // 脉动效果：更新脉动值（基于时间因子）
            particle.pulse += particle.pulseSpeed * timeFactor;
            // 脉动值循环（0-2π）
            if (particle.pulse > Math.PI * 2) {
                particle.pulse = 0;
            }

            // 保存当前位置到历史位置
            if (this.config.showTrail) {
                // 添加当前位置到历史
                particle.trailPositions.unshift({ x: particle.x, y: particle.y });

                // 限制历史位置数量
                if (particle.trailPositions.length > this.config.trailIntensity * 10) {
                    particle.trailPositions.length = this.config.trailIntensity * 10;
                }
            }

            // 更新粒子位置：当前位置 + 速度 * 时间因子
            particle.x += particle.vx * timeFactor;
            particle.y += particle.vy * timeFactor;

            // 边界检测：碰到边界时反弹
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // 确保粒子在画布范围内
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        }
    }

    /**
     * 绘制粒子轨迹效果
     * 在粒子后面绘制自然的光影拖尾效果
     */
    private drawTrailEffect(): void {
        if (!this.config.showTrail) return;

        // 保存上下文状态
        this.ctx.save();

        for (const particle of this.particles) {
            // 只有有历史位置时才绘制
            if (particle.trailPositions.length < 2) continue;

            // 创建粒子光影路径
            this.ctx.beginPath();

            // 移动到第一个点（最新位置）
            this.ctx.moveTo(particle.trailPositions[0].x, particle.trailPositions[0].y);

            // 添加路径点
            for (let i = 1; i < particle.trailPositions.length; i++) {
                this.ctx.lineTo(particle.trailPositions[i].x, particle.trailPositions[i].y);
            }

            // 设置线条样式 - 宽度与粒子大小匹配
            const lineWidth = particle.size * 1.2; // 比粒子稍大一点，形成光晕效果
            this.ctx.lineWidth = lineWidth;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            // 创建线性渐变（从当前点到历史点）
            const startPos = particle.trailPositions[0];
            const endPos = particle.trailPositions[particle.trailPositions.length - 1];
            const gradient = this.ctx.createLinearGradient(
                startPos.x, startPos.y,
                endPos.x, endPos.y
            );

            // 计算颜色
            const color = this.parseColor(particle.color);

            // 渐变从完全不透明到完全透明
            const baseAlpha = 0.35; // 降低基础透明度，更加自然
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${baseAlpha})`);
            gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${baseAlpha * 0.6})`);
            gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${baseAlpha * 0.2})`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

            this.ctx.strokeStyle = gradient;
            this.ctx.stroke();
        }

        // 恢复上下文状态
        this.ctx.restore();
    }

    /**
     * 解析颜色字符串为RGB对象
     * @param colorStr 颜色字符串
     * @returns RGB对象
     */
    private parseColor(colorStr: string): { r: number, g: number, b: number, a?: number } {
        // 如果是rgba格式
        if (colorStr.startsWith('rgba')) {
            const rgbaMatch = colorStr.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
            if (rgbaMatch) {
                return {
                    r: parseInt(rgbaMatch[1]),
                    g: parseInt(rgbaMatch[2]),
                    b: parseInt(rgbaMatch[3]),
                    a: parseFloat(rgbaMatch[4])
                };
            }
        }
        // 如果是rgb格式
        else if (colorStr.startsWith('rgb')) {
            const rgbMatch = colorStr.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
            if (rgbMatch) {
                return {
                    r: parseInt(rgbMatch[1]),
                    g: parseInt(rgbMatch[2]),
                    b: parseInt(rgbMatch[3])
                };
            }
        }
        // 如果是十六进制格式
        else if (colorStr.startsWith('#')) {
            // 移除#号
            let hex = colorStr.replace('#', '');

            // 解析RGB值
            let r, g, b;
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            } else {
                // 默认返回白色
                return { r: 255, g: 255, b: 255 };
            }

            return { r, g, b };
        }

        // 默认返回白色
        return { r: 255, g: 255, b: 255 };
    }

    /**
     * 绘制粒子和连线
     * 在画布上渲染粒子系统
     */
    private drawParticles(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let backgroundColor = this.config.canvasBackgroundColor;
        if (backgroundColor.startsWith('rgba')) {
            const rgbaMatch = backgroundColor.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);

            if (rgbaMatch) {
                const r = rgbaMatch[1];
                const g = rgbaMatch[2];
                const b = rgbaMatch[3];
                const a = parseFloat(rgbaMatch[4]);
                if (a < 1) {
                    backgroundColor = `rgb(${r}, ${g}, ${b})`;
                }
            }
        }

        // 绘制背景
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制粒子轨迹效果（在绘制连线和粒子之前）
        this.drawTrailEffect();

        // 绘制粒子间的连线
        if (this.config.showLine) {
            // 遍历所有粒子对
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    // 计算两个粒子之间的距离
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 如果距离小于连接距离，绘制连线
                    if (distance < this.config.linkDistance) {
                        // 根据距离计算连线透明度（越近越不透明）
                        const alpha = this.config.lineOpacity * (1 - distance / this.config.linkDistance);
                        this.ctx.strokeStyle = this.config.lineColor;
                        this.ctx.globalAlpha = alpha; // 设置透明度
                        this.ctx.lineWidth = this.config.lineWidth;

                        // 绘制连线
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        // 绘制粒子
        this.ctx.globalAlpha = 1; // 重置透明度
        for (const particle of this.particles) {
            // 计算脉动大小（基于正弦波）
            const pulseSize = particle.size * (1 + Math.sin(particle.pulse) * 0.2);

            // 设置粒子发光效果（只有当particleBlur大于0时才启用）
            if (this.config.particleBlur > 0) {
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = this.config.particleBlur * 4;
            }

            // 绘制粒子（圆形）
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // 重置阴影效果
            this.ctx.shadowBlur = 0;
        }
    }

    /**
     * 更新FPS计数器
     * 计算并更新当前帧率
     */
    private updateFPS(): void {
        this.frameCount++;
        const now = Date.now();
        const elapsed = now - this.lastFpsUpdate;

        // 每秒更新一次FPS显示
        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
    }

    /**
     * 动画循环
     * 使用requestAnimationFrame实现平滑动画
     */
    private animate(): void {
        if (!this.isRunning) return;

        const now = performance.now();
        const deltaTime = now - this.lastFrameTime;

        // 限制最小和最大时间增量，避免极端情况
        const clampedDeltaTime = Math.min(Math.max(deltaTime, 1), 100); // 限制在1-100ms之间

        // 更新粒子状态（传入时间增量）
        this.updateParticles(clampedDeltaTime);
        this.drawParticles();
        this.updateFPS();

        // 更新上一帧时间戳
        this.lastFrameTime = now;

        // 请求下一帧动画
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * 开始粒子动画
     */
    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.animate();
    }

    /**
     * 暂停粒子动画
     */
    public pause(): void {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * 重置粒子系统
     * 重新创建粒子并开始动画
     */
    public reset(): void {
        // 仅在动画运行时重新开始
        const wasRunning = this.isRunning;
        if (wasRunning) {
            this.pause();
        }

        // 重新创建粒子
        this.createParticles();

        // 如果之前是运行状态，重新开始
        if (wasRunning) {
            this.start();
        } else {
            // 如果之前是暂停状态，只绘制一帧
            this.drawParticles();
        }
    }

    /**
     * 调整画布尺寸
     * 主要用于响应窗口大小变化，优化性能
     */
    public resize(): void {
        if (this.config.isBackground) {
            // 更新画布尺寸
            const oldWidth = this.canvas.width;
            const oldHeight = this.canvas.height;
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            this.canvas.width = newWidth;
            this.canvas.height = newHeight;

            // 如果只是尺寸变化，调整粒子位置而不是重新创建
            if (this.particles.length > 0) {
                // 缩放粒子位置以适应新尺寸
                const scaleX = newWidth / oldWidth;
                const scaleY = newHeight / oldHeight;

                for (const particle of this.particles) {
                    // 缩放粒子位置
                    particle.x *= scaleX;
                    particle.y *= scaleY;

                    // 确保粒子在新画布范围内
                    particle.x = Math.max(0, Math.min(newWidth, particle.x));
                    particle.y = Math.max(0, Math.min(newHeight, particle.y));

                    // 如果粒子靠近边界，调整速度方向
                    if (particle.x <= 0 || particle.x >= newWidth) particle.vx *= -1;
                    if (particle.y <= 0 || particle.y >= newHeight) particle.vy *= -1;

                    // 修复：缩放粒子的历史位置，避免光影效果异常
                    if (this.config.showTrail) {
                        for (let i = 0; i < particle.trailPositions.length; i++) {
                            const pos = particle.trailPositions[i];
                            pos.x *= scaleX;
                            pos.y *= scaleY;
                            
                            // 确保历史位置也在画布范围内
                            pos.x = Math.max(0, Math.min(newWidth, pos.x));
                            pos.y = Math.max(0, Math.min(newHeight, pos.y));
                        }
                    }
                }

                // 立即绘制一帧，避免空白
                this.drawParticles();
            } else {
                // 如果没有粒子，重新创建
                this.createParticles();
                this.drawParticles();
            }
        }
    }

    /**
     * 销毁粒子系统
     * 停止动画并移除画布
     */
    public destroy(): void {
        this.pause();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }

    /**
     * 绑定事件监听器
     */
    private bindEvents(): void {
        // 窗口大小变化时调整画布尺寸（使用防抖）
        window.addEventListener('resize', () => {
            if (this.config.isBackground) {
                // 清除之前的计时器
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }

                // 设置防抖计时器（150毫秒延迟）
                this.resizeTimer = window.setTimeout(() => {
                    this.resize();
                }, 150);
            }
        });

        // 页面可见性变化时处理动画
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 页面隐藏时记录运行状态并暂停动画以节省资源
                this.wasRunningBeforeHide = this.isRunning;
                if (this.isRunning) {
                    this.pause();
                }
            } else {
                // 页面恢复可见时，如果之前是运行状态，重新开始动画
                if (this.wasRunningBeforeHide) {
                    this.start();
                }
                // 重置状态
                this.wasRunningBeforeHide = false;
            }
        });
    }
}

export default ParticleCanvas;