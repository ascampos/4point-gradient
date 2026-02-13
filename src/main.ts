import * as PIXI from 'pixi.js';
import { FourPointGradient } from './FourPointGradient';

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1a1a1a,
    antialias: true
});

document.getElementById('app')!.appendChild(app.view as HTMLCanvasElement);

// Create gradient matching After Effects reference (tuned positions + blend)
const gradient = new FourPointGradient({
    width: window.innerWidth,
    height: window.innerHeight,
    points: [
        { position: [0.1, 0.1], color: 0xFFFF00 }, // Yellow
        { position: [0.9, 0.1], color: 0x00FF00 }, // Green
        { position: [0.9, 0.9], color: 0x0000FF }, // Blue
        { position: [0.1, 0.9], color: 0xFF00FF }  // Magenta
    ],
    blend: 0.3
});

app.stage.addChild(gradient);

// Handle window resize
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    gradient.resize(window.innerWidth, window.innerHeight);
});

// Console debugging
(window as any).gradient = gradient;
