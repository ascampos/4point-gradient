import * as PIXI from 'pixi.js';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';
import type { GradientOptions, RGBArray } from './types';

export class FourPointGradient extends PIXI.Mesh<PIXI.Shader> {
    private _gradientWidth: number;
    private _gradientHeight: number;

    constructor(options: GradientOptions = {}) {
        const {
            width = 800,
            height = 600,
            points = [
                { position: [0.2, 0.2], color: 0xFFFF00 }, // Yellow - top left
                { position: [0.8, 0.2], color: 0x00FF00 }, // Green - top right
                { position: [0.8, 0.8], color: 0x0000FF }, // Blue - bottom right
                { position: [0.2, 0.8], color: 0xFF00FF }  // Magenta - bottom left
            ],
            blend = 0.5
        } = options;

        // Create geometry (simple quad)
        const geometry = new PIXI.Geometry()
            .addAttribute('aVertexPosition', [
                0, 0,
                width, 0,
                width, height,
                0, height
            ], 2)
            .addIndex([0, 1, 2, 0, 2, 3]);

        // Create shader
        const shader = PIXI.Shader.from(vertexShader, fragmentShader, {
            u_resolution: [width, height],
            u_point1: points[0].position,
            u_point2: points[1].position,
            u_point3: points[2].position,
            u_point4: points[3].position,
            u_color1: hexToRGB(points[0].color),
            u_color2: hexToRGB(points[1].color),
            u_color3: hexToRGB(points[2].color),
            u_color4: hexToRGB(points[3].color),
            u_blend: blend
        });

        super(geometry, shader);

        this._gradientWidth = width;
        this._gradientHeight = height;
    }

    // Setters for dynamic updates
    setPoint(index: number, position: [number, number], color?: number): void {
        if (index < 0 || index > 3) {
            throw new Error('Point index must be between 0 and 3');
        }

        this.shader.uniforms[`u_point${index + 1}`] = position;
        if (color !== undefined) {
            this.shader.uniforms[`u_color${index + 1}`] = hexToRGB(color);
        }
    }

    setBlend(value: number): void {
        this.shader.uniforms.u_blend = Math.max(0, Math.min(1, value));
    }

    resize(width: number, height: number): void {
        this._gradientWidth = width;
        this._gradientHeight = height;
        this.shader.uniforms.u_resolution = [width, height];

        // Update geometry
        const buffer = this.geometry.getBuffer('aVertexPosition');
        if (buffer) {
            buffer.update([
                0, 0,
                width, 0,
                width, height,
                0, height
            ]);
        }
    }

    get gradientWidth(): number {
        return this._gradientWidth;
    }

    get gradientHeight(): number {
        return this._gradientHeight;
    }
}

// Helper: Convert hex color to normalized RGB array
function hexToRGB(hex: number): RGBArray {
    return [
        ((hex >> 16) & 255) / 255,
        ((hex >> 8) & 255) / 255,
        (hex & 255) / 255
    ];
}
