// Desa Kehidupan — render.js
// Menggambar dunia: tanah, air beranimasi, bangunan, ladang, hewan, NPC,
// pemain, taman bermain, dan efek malam/cuaca.
import { TILE, MAP_W, MAP_H, VIEW_W, VIEW_H, SEASONS } from './config.js';
import { seasonOf } from './world.js';
import { cropStage } from './farm.js';

function drawBuilding(ctx, sprites, b, camX, camY) {
  const img = b.kind === 'poor' ? sprites.housePoor : b.kind === 'rich' ? sprites.houseRich : sprites.houseMid;
  ctx.drawImage(img, b.x * TILE - camX, b.y * TILE - camY);
  if (b.id === 'sekolah') {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SEKOLAH', b.x * TILE + 48 - camX, b.y * TILE + 8 - camY);
  }
  if (b.id === 'tokoBenih' || b.id === 'tokoUmum') {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(b.id === 'tokoBenih' ? 'TOKO BENIH' : 'TOKO UMUM', b.x * TILE + 48 - camX, b.y * TILE + 8 - camY);
  }
}

export function drawWorld(ctx, sprites, world, animTime) {
  const camX = world.camera.x;
  const camY = world.camera.y;
  const season = seasonOf(world.day);
  const x0 = Math.max(0, Math.floor(camX / TILE));
  const y0 = Math.max(0, Math.floor(camY / TILE));
  const x1 = Math.min(MAP_W - 1, Math.ceil((camX + VIEW_W) / TILE));
  const y1 = Math.min(MAP_H - 1, Math.ceil((camY + VIEW_H) / TILE));

  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const t = world.terrain[y][x];
      const d = world.decor[y][x];
      const px = x * TILE - camX;
      const py = y * TILE - camY;
      if (t === 'water') {
        ctx.drawImage(Math.floor(animTime * 2) % 2 === 0 ? sprites.water0 : sprites.water1, px, py);
      } else if (t === 'soil') {
        ctx.drawImage(sprites.soil, px, py);
      } else if (t === 'path') {
        ctx.drawImage(sprites.path, px, py);
      } else if (t === 'sand') {
        ctx.drawImage(sprites.sand, px, py);
      } else if (t === 'floor') {
        ctx.drawImage(sprites.floor, px, py);
      } else if (t === 'house') {
        ctx.drawImage(sprites.grass, px, py);
      } else {
        ctx.drawImage(season === 3 ? sprites.grassSnow : season === 1 ? sprites.grassDry : (x + y) % 2 === 0 ? sprites.grass : sprites.grass2, px, py);
      }
      if (d === 'tree') ctx.drawImage(sprites.tree[season], px, py - 16);
      else if (d === 'pine') ctx.drawImage(sprites.pine, px, py - 16);
      else if (d === 'rock') ctx.drawImage(sprites.rock, px, py);
      else if (d === 'flower') ctx.drawImage(sprites.flower, px, py);
      else if (t === 'well') ctx.drawImage(sprites.well, px, py);
    }
  }

  // Petak ladang: tanah + tanaman.
  for (const plot of world.plots) {
    const px = plot.x * TILE - camX;
    const py = plot.y * TILE - camY;
    if (px < -32 || py < -32 || px > VIEW_W || py > VIEW_H) continue;
    ctx.drawImage(plot.state === 'wet' ? sprites.soilWet : sprites.soil, px, py);
    if (plot.crop) {
      const st = cropStage(plot);
      ctx.drawImage(sprites.crop[plot.crop][st], px, py - 4);
    }
  }

  // Titik galian.
  for (const d of world.digSpots) {
    const px = d.x * TILE - camX;
    const py = d.y * TILE - camY;
    ctx.drawImage(sprites.soil, px, py);
    if (d.available) {
      ctx.fillStyle = '#ffd60a';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✦', px + 16, py + 22);
    }
  }

  // Pagar kandang.
  const pen = world.pen;
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 4;
  ctx.strokeRect(pen.x0 * TILE - camX, pen.y0 * TILE - camY, (pen.x1 - pen.x0 + 1) * TILE, (pen.y1 - pen.y0 + 1) * TILE);
  ctx.fillStyle = '#8d6e63';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('KANDANG', pen.x0 * TILE + 4 - camX, pen.y0 * TILE + 12 - camY);

  // Taman bermain: ayunan + perosotan (prosedural).
  drawPlayground(ctx, camX, camY);

  // Bangunan.
  for (const b of world.buildings) drawBuilding(ctx, sprites, b, camX, camY);

  // Rumah besar (setelah dibeli) di samping rumah lama.
  if (world.flags.bigHouse) {
    ctx.drawImage(sprites.houseRich, 8 * TILE - camX, 3 * TILE - camY);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RUMAH BESAR', 9.5 * TILE - camX, 3 * TILE + 10 - camY);
  }

  // Hewan.
  for (const a of world.animals) {
    const px = a.x - camX;
    const py = a.y - camY;
    ctx.drawImage(sprites.animal[a.kind], px - 8, py - 8, 20, 18);
    if (a.sick) {
      ctx.fillStyle = '#e63946';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✚', px, py - 12);
    } else if (a.produceReady) {
      ctx.fillStyle = '#ffd60a';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★', px, py - 12);
    }
  }

  // Anak pemain (balita/anak) di taman atau sekolah.
  drawChild(ctx, sprites, world, camX, camY, animTime);

  // NPC.
  for (const n of world.npcs) {
    const px = n.x - camX;
    const py = n.y - camY;
    const bob = Math.sin(animTime * 2 + n.x) * 1.5;
    ctx.drawImage(sprites.npc[n.id], px - 16, py - 32 + bob, 32, 40);
    if (n.hearts > 0) {
      ctx.fillStyle = '#ff70a6';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('♥'.repeat(n.hearts), px, py - 36 + bob);
    }
  }

  // Pemain.
  const p = world.player;
  const px = p.x - camX;
  const py = p.y - camY;
  const walkBob = p.moving ? Math.abs(Math.sin(animTime * 10)) * 3 : 0;
  // Pelampung pancing + tali saat memancing.
  if (world.fish.active) {
    const dir = p.dir === 'left' ? [-1, 0] : p.dir === 'right' ? [1, 0] : p.dir === 'up' ? [0, -1] : [0, 1];
    let bx = Math.floor(p.x / TILE) + dir[0];
    let by = Math.floor(p.y / TILE) + dir[1];
    if (world.terrain[by] && world.terrain[by][bx] !== 'water') {
      // Cari petak air terdekat di sekitar pemain.
      outer: for (let r = 1; r <= 2; r += 1) {
        for (let dy = -r; dy <= r; dy += 1) {
          for (let dx = -r; dx <= r; dx += 1) {
            const nx = Math.floor(p.x / TILE) + dx;
            const ny = Math.floor(p.y / TILE) + dy;
            if (world.terrain[ny] && world.terrain[ny][nx] === 'water') { bx = nx; by = ny; break outer; }
          }
        }
      }
    }
    const bpx = bx * TILE + 16 - camX;
    const bpy = by * TILE + 16 - camY;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py - 24);
    ctx.lineTo(bpx, bpy);
    ctx.stroke();
    const bob = world.fish.phase === 'bite' ? Math.sin(animTime * 20) * 3 : 0;
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.arc(bpx, bpy + bob, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(bpx, bpy + bob - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    if (world.fish.phase === 'bite') {
      ctx.strokeStyle = '#ffd60a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bpx, bpy, 12 + Math.sin(animTime * 12) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.save();
  if (p.dir === 'left') {
    ctx.translate(px, py);
    ctx.scale(-1, 1);
    ctx.drawImage(sprites.player, -16, -32 - walkBob, 32, 40);
  } else {
    ctx.drawImage(sprites.player, px - 16, py - 32 - walkBob, 32, 40);
  }
  ctx.restore();
  // Bayangan.
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(px, py + 2, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Efek malam & cuaca.
  const hour = world.hour;
  if (hour >= 19 || hour < 7) {
    ctx.fillStyle = `rgba(10,10,50,${hour >= 21 || hour < 7 ? 0.35 : 0.18})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  if (world.weather === 'Hujan' || world.weather === 'Badai') {
    ctx.strokeStyle = 'rgba(174,194,224,0.7)';
    ctx.lineWidth = 1;
    const n = world.weather === 'Badai' ? 60 : 30;
    for (let i = 0; i < n; i += 1) {
      const rx = ((i * 97 + Math.floor(animTime * 900)) % VIEW_W);
      const ry = ((i * 57 + Math.floor(animTime * 1400)) % VIEW_H);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 4, ry + 12);
      ctx.stroke();
    }
  }
}

function drawPlayground(ctx, camX, camY) {
  const ox = 24 * TILE - camX;
  const oy = 22 * TILE - camY;
  // Ayunan.
  ctx.strokeStyle = '#6c757d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox + 6, oy - 28);
  ctx.moveTo(ox + 28, oy);
  ctx.lineTo(ox + 22, oy - 28);
  ctx.moveTo(ox + 6, oy - 28);
  ctx.lineTo(ox + 22, oy - 28);
  ctx.stroke();
  ctx.strokeStyle = '#343a40';
  ctx.beginPath();
  ctx.moveTo(ox + 10, oy - 28);
  ctx.lineTo(ox + 10, oy - 10);
  ctx.moveTo(ox + 18, oy - 28);
  ctx.lineTo(ox + 18, oy - 10);
  ctx.stroke();
  ctx.fillStyle = '#e63946';
  ctx.fillRect(ox + 8, oy - 12, 12, 4);
  // Perosotan.
  ctx.fillStyle = '#2a9d8f';
  ctx.fillRect(ox + 48, oy - 30, 6, 30);
  ctx.fillRect(ox + 48, oy - 30, 26, 6);
  ctx.beginPath();
  ctx.moveTo(ox + 54, oy - 24);
  ctx.lineTo(ox + 74, oy);
  ctx.lineTo(ox + 68, oy);
  ctx.lineTo(ox + 54, oy - 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('TAMAN', ox, oy + 14);
}

function drawChild(ctx, sprites, world, camX, camY, animTime) {
  const p = world.player;
  if (p.childStage < 2) return;
  let cx;
  let cy;
  if (p.childStage === 2) { cx = 25 * TILE; cy = 23 * TILE; }
  else { cx = 21 * TILE; cy = 21 * TILE; }
  const bob = Math.sin(animTime * 3) * 2;
  ctx.drawImage(sprites.baby, cx - camX - 12, cy - camY - 24 + bob, 24, 30);
  ctx.fillStyle = '#fff';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(p.childName, cx - camX, cy - camY - 28 + bob);
}
