export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    originalColor: string;
    pulse: number;
    pulseSpeed: number;
    trailPositions: any[];
}
export interface ParticleCanvasOptions {
    canvasContainer?: HTMLElement | string;
    canvasSize?: [number, number];
    canvasBackgroundColor?: string;
    isBackground?: boolean;
    particleNumber?: number;
    particleSpeed?: number;
    particleSize?: number;
    particleColor?: string | string[];
    particleBlur?: number;
    showTrail?: boolean;
    trailIntensity?: number;
    showLine?: boolean;
    lineWidth?: number;
    lineColor?: string;
    lineOpacity?: number;
    linkDistance?: number;
}
export interface ParticleCanvasConfig {
    canvasContainer: HTMLElement | string;
    canvasSize: [number, number];
    canvasBackgroundColor: string;
    isBackground: boolean;
    particleNumber: number;
    particleSpeed: number;
    particleSize: number;
    particleColor: string | string[];
    particleBlur: number;
    showTrail: boolean;
    trailIntensity: number;
    showLine: boolean;
    lineWidth: number;
    lineColor: string;
    lineOpacity: number;
    linkDistance: number;
}
export declare class ParticleCanvas {
    constructor(options?: ParticleCanvasOptions);
    start(): void;
    pause(): void;
    reset(): void;
    resize(): void;
    destroy(): void;
}
