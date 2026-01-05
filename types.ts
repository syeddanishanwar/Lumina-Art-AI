
export interface ArtConfig {
  particleCount: number;
  particleSize: [number, number]; // min, max
  speed: number;
  connectionRadius: number;
  colors: string[];
  background: string;
  gravity: number;
  friction: number;
  vortexStrength: number;
  shapeType: 'circle' | 'square' | 'line';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}
