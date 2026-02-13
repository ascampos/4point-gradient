import { FourPointGradient } from './FourPointGradient';
import type { ColorPoint } from './types';

interface Preset {
    name: string;
    points: ColorPoint[];
    blend: number;
}

const presets: Record<string, Preset> = {
    afterEffects: {
        name: 'After Effects',
        points: [
            { position: [0.1, 0.1], color: 0xFFFF00 },
            { position: [0.9, 0.1], color: 0x00FF00 },
            { position: [0.9, 0.9], color: 0x0000FF },
            { position: [0.1, 0.9], color: 0xFF00FF }
        ],
        blend: 0.3
    },
    sunset: {
        name: 'Sunset',
        points: [
            { position: [0.5, 0.1], color: 0xFFA500 },
            { position: [0.9, 0.5], color: 0xFF6B6B },
            { position: [0.5, 0.9], color: 0x4A0E4E },
            { position: [0.1, 0.5], color: 0xFF1493 }
        ],
        blend: 0.7
    },
    ocean: {
        name: 'Ocean',
        points: [
            { position: [0.1, 0.1], color: 0x00CED1 },
            { position: [0.9, 0.1], color: 0x1E90FF },
            { position: [0.9, 0.9], color: 0x000080 },
            { position: [0.1, 0.9], color: 0x4682B4 }
        ],
        blend: 0.4
    },
    fire: {
        name: 'Fire',
        points: [
            { position: [0.5, 0.1], color: 0xFFD700 },
            { position: [0.9, 0.5], color: 0xFF4500 },
            { position: [0.5, 0.9], color: 0x8B0000 },
            { position: [0.1, 0.5], color: 0xFF8C00 }
        ],
        blend: 0.6
    }
};

export class GradientControls {
    private gradient: FourPointGradient;
    private currentPreset: string = 'afterEffects';
    private currentPoints: ColorPoint[];

    constructor(gradient: FourPointGradient) {
        this.gradient = gradient;
        this.currentPoints = [...presets.afterEffects.points];
        this.setupControls();
    }

    private setupControls(): void {
        this.setupBlendControl();
        this.setupPresetButtons();
        this.setupColorControls();
        this.setupPanelToggle();
        this.setupKeyboardShortcuts();
    }

    private setupPanelToggle(): void {
        const panel = document.getElementById('controls-panel');
        const toggleBtn = document.getElementById('panel-toggle');
        const showBtn = document.getElementById('panel-show');
        if (!panel || !toggleBtn || !showBtn) return;

        const toggle = () => {
            const isCollapsed = panel.classList.toggle('collapsed');
            showBtn.classList.toggle('visible', isCollapsed);
        };

        toggleBtn.addEventListener('click', toggle);
        showBtn.addEventListener('click', toggle);
    }

    private setupBlendControl(): void {
        const blendSlider = document.getElementById('blend') as HTMLInputElement;
        const blendDisplay = document.getElementById('blend-display') as HTMLSpanElement;
        if (!blendSlider || !blendDisplay) return;

        blendSlider.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value) / 100;
            this.gradient.setBlend(value);
            blendDisplay.textContent = value.toFixed(2);
        });
    }

    private setupPresetButtons(): void {
        const buttons = document.querySelectorAll('[data-preset]');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const preset = (e.target as HTMLElement).dataset.preset!;
                this.applyPreset(preset);

                buttons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    private setupColorControls(): void {
        const container = document.getElementById('color-controls');
        if (!container) return;

        this.currentPoints.forEach((point, index) => {
            const group = document.createElement('div');
            group.className = 'color-input-group';
            group.innerHTML = `
                <label>Point ${index + 1}</label>
                <input type="color" id="color${index}" value="${this.hexToColorInput(point.color)}" />
            `;

            const colorInput = group.querySelector('input') as HTMLInputElement;
            colorInput.addEventListener('input', (e) => {
                const hex = (e.target as HTMLInputElement).value;
                const color = parseInt(hex.replace('#', ''), 16);
                this.currentPoints[index].color = color;
                this.gradient.setPoint(index, point.position, color);
            });

            container.appendChild(group);
        });
    }

    private setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'h' || e.key === 'H') {
                const panel = document.getElementById('controls-panel');
                const showBtn = document.getElementById('panel-show');
                if (panel && showBtn) {
                    const isCollapsed = panel.classList.toggle('collapsed');
                    showBtn.classList.toggle('visible', isCollapsed);
                }
                return;
            }
            if (e.key >= '1' && e.key <= '4') {
                const presetNames = ['afterEffects', 'sunset', 'ocean', 'fire'];
                const index = parseInt(e.key) - 1;
                if (index < presetNames.length) {
                    this.applyPreset(presetNames[index]);

                    document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
                    document.querySelector(`[data-preset="${presetNames[index]}"]`)?.classList.add('active');
                }
            }
        });
    }

    private applyPreset(presetName: string): void {
        const preset = presets[presetName];
        if (!preset) return;

        this.currentPreset = presetName;
        this.currentPoints = [...preset.points];

        preset.points.forEach((point, index) => {
            this.gradient.setPoint(index, point.position, point.color);
        });
        this.gradient.setBlend(preset.blend);

        const blendSlider = document.getElementById('blend') as HTMLInputElement;
        const blendDisplay = document.getElementById('blend-display') as HTMLSpanElement;
        if (blendSlider && blendDisplay) {
            blendSlider.value = (preset.blend * 100).toString();
            blendDisplay.textContent = preset.blend.toFixed(2);
        }

        preset.points.forEach((point, index) => {
            const colorInput = document.getElementById(`color${index}`) as HTMLInputElement;
            if (colorInput) {
                colorInput.value = this.hexToColorInput(point.color);
            }
        });
    }

    private hexToColorInput(hex: number): string {
        return '#' + hex.toString(16).padStart(6, '0');
    }
}
