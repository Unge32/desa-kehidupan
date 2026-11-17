// Desa Kehidupan — ui.js
// Antarmuka: HUD (emas, hari/musim/cuaca, jam, lapar/haus/energi/sehat),
// layar judul, menang, kalah, dialog, toko, tas, jeda, dan bantuan.
import { TILE, VIEW_W, VIEW_H, SEASON_NAMES, CROPS, FESTIVALS, SHOP } from './config.js';
import { seasonOf, festivalOf, scoreOf } from './world.js';
import { itemName, sellableItems, sellItem, sellAll, buyItem } from './economy.js';

const SEED_KEYS = ['lobak', 'wortel', 'tomat', 'gandum', 'labu'];

export function createUI() {
  return {
    mode: 'title',
    dialog: null,
    dialogQueue: [],
    shopTab: 'benih',
    shopSel: 0,
    invSel: 0,
    seedSel: 0,
    buttons: [],
    helpPage: 0,
  };
}

export function showDialog(ui, text) {
  ui.dialogQueue.push(text);
  if (!ui.dialog) ui.dialog = ui.dialogQueue.shift();
  ui.mode = 'dialog';
}

export function advanceDialog(ui) {
  if (ui.dialogQueue.length > 0) {
    ui.dialog = ui.dialogQueue.shift();
  } else {
    ui.dialog = null;
    ui.mode = 'playing';
  }
}

function bar(ctx, x, y, w, h, frac, color, label) {
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * Math.max(0, Math.min(1, frac)), h);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(label, x + w + 6, y + h - 2);
}

export function drawHUD(ctx, world, ui) {
  const p = world.player;
  const season = seasonOf(world.day);
  // Panel atas.
  ctx.fillStyle = 'rgba(20,30,20,0.72)';
  ctx.fillRect(0, 0, VIEW_W, 52);
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`🪙 ${world.gold.toLocaleString('id-ID')}G`, 14, 24);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px monospace';
  const hh = String(Math.floor(world.hour)).padStart(2, '0');
  const mm = String(Math.floor(world.minute)).padStart(2, '0');
  ctx.fillText(`Hari ${world.day}/28  •  ${SEASON_NAMES[season]}  •  ${world.weather}  •  ${hh}:${mm}`, 14, 44);
  // Festival hari ini.
  const fest = festivalOf(world.day);
  if (fest) {
    ctx.fillStyle = '#ff70a6';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`🎉 ${fest.name} hari ini!`, 560, 24);
  }
  // Kebutuhan.
  bar(ctx, 900, 8, 110, 12, p.hunger / 100, '#e76f51', 'Lapar');
  bar(ctx, 900, 26, 110, 12, p.thirst / 100, '#2a9dcc', 'Haus');
  bar(ctx, 1110, 8, 90, 12, p.energy / 100, '#e9c46a', 'Energi');
  bar(ctx, 1110, 26, 90, 12, p.health / 100, '#e63946', 'Sehat');
  // Benih terpilih.
  const seed = SEED_KEYS[ui.seedSel];
  const crop = CROPS[seed];
  ctx.fillStyle = 'rgba(20,30,20,0.72)';
  ctx.fillRect(0, 52, 300, 26);
  ctx.fillStyle = '#fff';
  ctx.font = '13px monospace';
  ctx.fillText(`Benih: ${crop.name} (${world.inventory[`benih_${seed}`] || 0})  [1-5 ganti]`, 14, 70);
  if (p.married) {
    ctx.fillStyle = '#ff70a6';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`💍 Menikah dengan Rani`, 320, 70);
  }
  // Tombol sentuh.
  ui.buttons = [];
  touchBtn(ctx, ui, 1120, 640, 150, 56, 'AKSI (E)', 'action');
  touchBtn(ctx, ui, 950, 640, 150, 56, 'PANCING (F)', 'fish');
  touchBtn(ctx, ui, 780, 640, 150, 56, 'TAS (I)', 'inventory');
  touchBtn(ctx, ui, 610, 640, 150, 56, 'TOKO (B)', 'shop');
  // Pesan singkat.
  if (world.message && world.messageTimer > 0) {
    ctx.fillStyle = 'rgba(20,30,20,0.85)';
    const w = Math.min(900, ctx.measureText(world.message).width + 32);
    ctx.fillRect((VIEW_W - w) / 2, 88, w, 34);
    ctx.fillStyle = '#fff';
    ctx.font = '15px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(world.message, VIEW_W / 2, 111);
  }
  // Ikon memancing.
  if (world.fish.active) {
    ctx.fillStyle = 'rgba(20,30,20,0.85)';
    ctx.fillRect(VIEW_W / 2 - 180, 140, 360, 60);
    ctx.fillStyle = world.fish.phase === 'bite' ? '#ffd60a' : '#fff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(world.fish.phase === 'bite' ? '❗ TARIK SEKARANG! (F)' : '🎣 Menunggu ikan...', VIEW_W / 2, 178);
  }
}

function touchBtn(ctx, ui, x, y, w, h, label, action) {
  ctx.fillStyle = 'rgba(20,30,20,0.6)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + h / 2 + 5);
  ui.buttons.push({ x, y, w, h, action });
}

export function drawTitle(ctx, world, ui) {
  ctx.fillStyle = '#1b4332';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // Langit + bukit piksel sederhana.
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(0, 0, VIEW_W, 380);
  ctx.fillStyle = '#ffd60a';
  ctx.beginPath();
  ctx.arc(1080, 90, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5dbb63';
  ctx.fillRect(0, 380, VIEW_W, 340);
  ctx.fillStyle = '#2f9e44';
  ctx.fillRect(0, 380, VIEW_W, 10);
  // Rumah-rumah kecil.
  for (let i = 0; i < 5; i += 1) {
    const x = 120 + i * 220;
    ctx.fillStyle = '#e0a458';
    ctx.fillRect(x, 300, 90, 80);
    ctx.fillStyle = '#bc4749';
    ctx.beginPath();
    ctx.moveTo(x - 10, 300);
    ctx.lineTo(x + 45, 250);
    ctx.lineTo(x + 100, 300);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5a3520';
    ctx.fillRect(x + 35, 330, 20, 50);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 64px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DESA KEHIDUPAN', VIEW_W / 2, 180);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('Berkebun • Memancing • Menambang • Beternak • Berkeluarga', VIEW_W / 2, 228);
  ctx.font = '17px monospace';
  ctx.fillText('Tujuan: beli RUMAH BESAR (50.000G) sebelum akhir Tahun 1 (28 hari).', VIEW_W / 2, 268);
  ctx.fillText('WASD/Arrows jalan • E aksi • F mancing • I tas • B toko • P jeda', VIEW_W / 2, 300);
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 24px monospace';
  ctx.fillText('▶  Tekan ENTER untuk mulai  (klik juga bisa)', VIEW_W / 2, 380);
  ctx.fillStyle = '#fff';
  ctx.font = '15px monospace';
  ctx.fillText('H untuk bantuan • M untuk suara', VIEW_W / 2, 420);
  ctx.font = '13px monospace';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Game orisinal — seni & suara prosedural, tanpa aset berhak cipta.', VIEW_W / 2, 690);
  ui.buttons = [{ x: VIEW_W / 2 - 260, y: 340, w: 520, h: 60, action: 'start' }];
}

export function drawWin(ctx, world) {
  ctx.fillStyle = 'rgba(20,60,30,0.92)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 56px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 MENANG! 🏆', VIEW_W / 2, 170);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('Kamu membeli RUMAH BESAR dan menjadi legenda Desa Kehidupan!', VIEW_W / 2, 230);
  ctx.font = '18px monospace';
  ctx.fillText(`Skor akhir: ${scoreOf(world).toLocaleString('id-ID')}`, VIEW_W / 2, 290);
  ctx.fillText(`Emas: ${world.gold.toLocaleString('id-ID')}G  •  Panen: ${world.stats.harvested}  •  Ikan: ${world.stats.fishCaught}  •  Permata: ${world.stats.gemsFound}`, VIEW_W / 2, 330);
  ctx.fillText(`Hari selesai: ${world.day}/28  •  Menikah: ${world.player.married ? 'Ya 💍' : 'Belum'}  •  Anak: ${world.player.childStage > 0 ? world.player.childName : '-'}`, VIEW_W / 2, 365);
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('Tekan ENTER untuk bermain lagi', VIEW_W / 2, 450);
}

export function drawLose(ctx, world) {
  ctx.fillStyle = 'rgba(40,20,20,0.92)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 56px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TAHUN BERAKHIR', VIEW_W / 2, 170);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('Tahun 1 berlalu dan Rumah Besar belum terbeli...', VIEW_W / 2, 230);
  ctx.font = '18px monospace';
  ctx.fillText(`Skor akhir: ${scoreOf(world).toLocaleString('id-ID')}`, VIEW_W / 2, 290);
  ctx.fillText(`Emas: ${world.gold.toLocaleString('id-ID')}G dari 50.000G  •  Panen: ${world.stats.harvested}  •  Ikan: ${world.stats.fishCaught}`, VIEW_W / 2, 330);
  ctx.fillText('Tips: gali berlian di hutan, mancing di danau, dan jual panen di Festival Panen (harga 2x).', VIEW_W / 2, 370);
  ctx.fillStyle = '#ffd60a';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('Tekan ENTER untuk mencoba lagi', VIEW_W / 2, 450);
}

export function drawDialog(ctx, ui) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#fff8e7';
  ctx.fillRect(140, 480, 1000, 150);
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 4;
  ctx.strokeRect(140, 480, 1000, 150);
  ctx.fillStyle = '#222';
  ctx.font = '17px monospace';
  ctx.textAlign = 'left';
  wrapText(ctx, ui.dialog || '', 165, 515, 950, 24);
  ctx.fillStyle = '#888';
  ctx.font = '14px monospace';
  ctx.fillText('Enter / klik untuk lanjut', 165, 615);
  ui.buttons = [{ x: 140, y: 480, w: 1000, h: 150, action: 'dialogNext' }];
}

export function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}

const SHOP_TABS = ['benih', 'makanan', 'hewan', 'obat', 'rumah', 'lain'];
const SHOP_TAB_NAMES = { benih: 'Benih', makanan: 'Makanan', hewan: 'Hewan', obat: 'Obat', rumah: 'Rumah', lain: 'Lainnya' };

export function drawShop(ctx, world, ui) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#fff8e7';
  ctx.fillRect(240, 70, 800, 560);
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 4;
  ctx.strokeRect(240, 70, 800, 560);
  ctx.fillStyle = '#222';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`🛒 PASAR DESA  —  Emas: ${world.gold.toLocaleString('id-ID')}G`, 270, 110);
  ui.buttons = [];
  // Tab.
  SHOP_TABS.forEach((tab, i) => {
    const x = 270 + i * 125;
    const y = 130;
    ctx.fillStyle = ui.shopTab === tab ? '#ffd60a' : '#ddd';
    ctx.fillRect(x, y, 115, 32);
    ctx.fillStyle = '#222';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(SHOP_TAB_NAMES[tab], x + 57, y + 21);
    ui.buttons.push({ x, y, w: 115, h: 32, action: `shopTab:${tab}` });
  });
  // Daftar barang.
  const items = SHOP[ui.shopTab];
  items.forEach((item, i) => {
    const y = 185 + i * 62;
    const sel = ui.shopSel === i;
    ctx.fillStyle = sel ? '#ffe8a3' : '#fff';
    ctx.fillRect(270, y, 740, 54);
    ctx.strokeStyle = sel ? '#e76f51' : '#ccc';
    ctx.strokeRect(270, y, 740, 54);
    ctx.fillStyle = '#222';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.name}  —  ${item.price.toLocaleString('id-ID')}G`, 285, y + 22);
    ctx.font = '13px monospace';
    ctx.fillStyle = '#555';
    ctx.fillText(item.desc, 285, y + 42);
    ctx.fillStyle = '#2a9d8f';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('BELI [Enter]', 995, y + 30);
    ui.buttons.push({ x: 270, y, w: 740, h: 54, action: `buy:${item.id}` });
  });
  ctx.fillStyle = '#888';
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('↑↓ pilih • Enter beli • Esc / B tutup', 270, 610);
  ui.buttons.push({ x: 240, y: 70, w: 800, h: 30, action: 'close' });
}

export function drawInventory(ctx, world, ui) {
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#fff8e7';
  ctx.fillRect(240, 70, 800, 560);
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 4;
  ctx.strokeRect(240, 70, 800, 560);
  ctx.fillStyle = '#222';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`🎒 TAS  —  Emas: ${world.gold.toLocaleString('id-ID')}G`, 270, 110);
  ui.buttons = [];
  const entries = Object.entries(world.inventory).filter(([, n]) => n > 0);
  if (entries.length === 0) {
    ctx.font = '16px monospace';
    ctx.fillText('Tas kosong.', 270, 170);
  }
  entries.forEach(([id, n], i) => {
    const y = 140 + i * 40;
    if (y > 540) return;
    const sel = ui.invSel === i;
    ctx.fillStyle = sel ? '#ffe8a3' : '#fff';
    ctx.fillRect(270, y, 740, 34);
    ctx.fillStyle = '#222';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    const price = sellableItems(world).find((s) => s.id === id);
    ctx.fillText(`${itemName(id)}  x${n}${price ? `   (jual ${price.price}G)` : ''}`, 285, y + 23);
    ui.buttons.push({ x: 270, y, w: 740, h: 34, action: `invSel:${i}` });
  });
  const y = 560;
  ctx.fillStyle = '#2a9d8f';
  ctx.fillRect(270, y, 230, 40);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('JUAL SEMUA (J)', 385, y + 26);
  ui.buttons.push({ x: 270, y, w: 230, h: 40, action: 'sellAll' });
  ctx.fillStyle = '#e07a5f';
  ctx.fillRect(520, y, 230, 40);
  ctx.fillStyle = '#fff';
  ctx.fillText('PAKAI / MAKAN (Enter)', 635, y + 26);
  ui.buttons.push({ x: 520, y, w: 230, h: 40, action: 'useSelected' });
  ctx.fillStyle = '#888';
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('↑↓ pilih • Enter pakai/makan • J jual semua • Esc / I tutup', 270, 620);
}

export function drawPause(ctx, world) {
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 44px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⏸ JEDA', VIEW_W / 2, 200);
  ctx.font = '18px monospace';
  ctx.fillText(`Hari ${world.day}/28 — ${SEASON_NAMES[seasonOf(world.day)]} — ${world.weather}`, VIEW_W / 2, 250);
  ctx.fillText(`Emas ${world.gold.toLocaleString('id-ID')}G • Skor ${scoreOf(world).toLocaleString('id-ID')}`, VIEW_W / 2, 285);
  ctx.fillText('P / Esc lanjut • H bantuan • Enter mulai ulang dari awal', VIEW_W / 2, 330);
}

export function drawHelp(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#fff8e7';
  ctx.fillRect(180, 60, 920, 600);
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 4;
  ctx.strokeRect(180, 60, 920, 600);
  ctx.fillStyle = '#222';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('📖 CARA BERMAIN', 210, 105);
  ctx.font = '15px monospace';
  const lines = [
    'TUJUAN: Beli RUMAH BESAR (50.000G) sebelum akhir Tahun 1 (28 hari).',
    '',
    '🌱 BERTANI: tekan E di petak ladang untuk cangkul → tanam benih',
    '   (pilih benih 1-5) → siram tiap hari → panen saat matang.',
    '🎣 MANCING: berdiri di tepi air, tekan F, tarik saat muncul "!"',
    '⛏️ MENAMBANG: tekan E di titik ✦ di hutan. Berlian = 2.000G!',
    '🐄 TERNAK: beli hewan di pasar, beri pakan, ambil telur/susu.',
    '   Hewan sakit? Beri Obat Hewan.',
    '🛒 PASAR: tekan B di dekat toko / pasar. Jual hasil panen di tas (I).',
    '💬 WARGA: tekan E dekat warga untuk mengobrol (+hati). Beri bunga',
    '   untuk Rani. Hati penuh + cincin = menikah, lalu punya anak!',
    '🎉 FESTIVAL: tiap hari ke-7 musim, di alun-alun. Panen di Festival',
    '   Panen harganya 2x lipat!',
    '🍞 MAKAN/MINUM: lapar & haus turun tiap jam. Makan dari tas (I),',
    '   minum di sumur/danau. Sehat 0 = pingsan, kehilangan 10% emas.',
    '😴 TIDUR: tekan E di depan rumahmu untuk tidur ke hari berikut.',
    '🌦️ CUACA: hujan menyiram tanamanmu. Musim dingin tanaman lambat.',
    '',
    'Kontrol: WASD/Arrows jalan • E aksi • F mancing • I tas • B toko',
    '1-5 pilih benih • P jeda • M suara • H bantuan • Enter mulai/ulang',
  ];
  lines.forEach((l, i) => ctx.fillText(l, 210, 140 + i * 22));
  ctx.fillStyle = '#888';
  ctx.font = '14px monospace';
  ctx.fillText('H / Esc / klik untuk menutup', 210, 640);
}
