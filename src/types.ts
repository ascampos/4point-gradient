export interface ColorPoint {
    position: [number, number]; // Normalized coordinates [0-1, 0-1]
    color: number;               // Hex color (e.g., 0xFFFF00)
}

export interface GradientOptions {
    width?: number;
    height?: number;
    points?: ColorPoint[];
    blend?: number; // 0.0 to 1.0
}

export type RGBArray = [number, number, number]; // Normalized [0-1, 0-1, 0-1]
