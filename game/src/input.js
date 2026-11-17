// Desa Kehidupan — input.js
// Keyboard + mouse + sentuh. Keyboard dibaca per-frame lewat `held`,
// sedangkan `pressed` hanya hidup satu frame (untuk aksi sekali tekan).
export class Input {
  constructor(canvas) {
    this.held = new Set();
    this.pressed = new Set();
    this.mouse = { x: 0, y: 0, clicked: false, down: false };
    this.touchTarget = null; // {tx, ty} tujuan jalan tap-to-move
    this.onKey = null;
    window.addEventListener('keydown', (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (!e.repeat) {
        this.held.add(k);
        this.pressed.add(k);
        if (this.onKey) this.onKey(k);
      }
    });
    window.addEventListener('keyup', (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      this.held.delete(k);
    });
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (canvas.width / r.width), y: (e.clientY - r.top) * (canvas.height / r.height) };
    };
    canvas.addEventListener('mousedown', (e) => {
      const p = pos(e);
      this.mouse.x = p.x; this.mouse.y = p.y; this.mouse.down = true; this.mouse.clicked = true;
    });
    canvas.addEventListener('mousemove', (e) => {
      const p = pos(e);
      this.mouse.x = p.x; this.mouse.y = p.y;
    });
    window.addEventListener('mouseup', () => { this.mouse.down = false; });
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      const p = pos(t);
      this.mouse.x = p.x; this.mouse.y = p.y; this.mouse.down = true; this.mouse.clicked = true;
    }, { passive: false });
    canvas.addEventListener('touchend', () => { this.mouse.down = false; });
    window.addEventListener('blur', () => { this.held.clear(); });
  }

  endFrame() {
    this.pressed.clear();
    this.mouse.clicked = false;
  }

  isDown(...keys) {
    return keys.some((k) => this.held.has(k));
  }

  wasPressed(...keys) {
    return keys.some((k) => this.pressed.has(k));
  }
}
