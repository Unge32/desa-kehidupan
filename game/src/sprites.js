// Desa Kehidupan — sprites.js
// Semua seni game digambar prosedural di canvas offscreen (pixel art 16x16 /
// 32x32), tanpa file gambar eksternal. buildSprites() mengembalikan kamus
// canvas yang siap digambar dengan drawImage.
function cv(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

// Gambar dari peta string: tiap karakter = 1 piksel.
function fromMap(rows, palette) {
  const h = rows.length;
  const w = rows[0].length;
  const c = cv(w, h);
  const ctx = c.getContext('2d');
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const ch = rows[y][x];
      if (ch === '.' || !palette[ch]) continue;
      px(ctx, x, y, 1, 1, palette[ch]);
    }
  }
  return c;
}

function personSprite(skin, hair, shirt, pants, dress) {
  const rows = [
    '....hhhhhh......',
    '...hhhhhhhh.....',
    '...hhsssshh.....',
    '...hssssssh.....',
    '....ssssss......',
    '.....ssSSs......',
    '....sssssss.....',
    '..ssssssssss....',
    '..sSSSSSSSSs....',
    '..sSssssssSs....',
    '...SSSSSSSS.....',
    '...SSSSSSSS.....',
    '....SSSSSS......',
    '....pppppp......',
    '....ppp.ppp.....',
    '....ppp.ppp.....',
    '....ppp.ppp.....',
    '....ppp.ppp.....',
    '....bb...bb.....',
    '....bb...bb.....',
  ];
  return fromMap(rows, {
    h: hair, s: skin, S: shirt, p: dress ? shirt : pants, b: '#3b2f2f',
  });
}

function animalSprite(kind) {
  if (kind === 'ayam') {
    return fromMap([
      '......rr........',
      '.....rrrr.......',
      '.....wwrr.......',
      '.....wwww.......',
      '....wwwwww......',
      '....wwwwww......',
      '...wwwwwwww.....',
      '...wwwwwwww.....',
      '....wwwwww......',
      '.....wwww.......',
      '.....ww.........',
      '.....yy.........',
      '....yy.yy.......',
    ], { r: '#d62828', w: '#f8f9fa', y: '#ffb703' });
  }
  if (kind === 'kambing') {
    return fromMap([
      '...hh......hh...',
      '...hh......hh...',
      '...wwwwwwwwww...',
      '...wwwwwwwwww...',
      '...wwwwwwwwww...',
      '..wwwwwwwwwwww..',
      '..wwwwwwwwwwww..',
      '..ww.wwwwww.ww..',
      '..ww.wwwwww.ww..',
      '..w...wwww...w..',
      '..w...wwww...w..',
      '..w...wwww...w..',
    ], { w: '#e9ecef', h: '#6c757d' });
  }
  if (kind === 'sapi') {
    return fromMap([
      '...pp......pp...',
      '...pp......pp...',
      '..wwwwwwwwwwww..',
      '..wwwwwwwwwwww..',
      '..wwkkwwwwwwww..',
      '..wwwwwwwwwwww..',
      '..wwwwwwwwwwww..',
      '..ww.wwwwww.ww..',
      '..ww.wwwwww.ww..',
      '..w...wwww...w..',
      '..w...wwww...w..',
      '..w...wwww...w..',
    ], { w: '#fff3e0', p: '#ffb4a2', k: '#343a40' });
  }
  // kerbau
  return fromMap([
    '..kk........kk..',
    '..kkk......kkk..',
    '...kkkkkkkkkk...',
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '..kkkkkkkkkkkk..',
    '..kk.kkkkkk.kk..',
    '..kk.kkkkkk.kk..',
    '..k...kkkk...k..',
    '..k...kkkk...k..',
    '..k...kkkk...k..',
  ], { k: '#495057' });
}

function treeSprite(season) {
  const c = cv(32, 48);
  const ctx = c.getContext('2d');
  px(ctx, 14, 30, 4, 18, '#6b4226');
  px(ctx, 12, 34, 8, 4, '#5a3520');
  const leaf = ['#2f9e44', '#e9c46a', '#e76f51', '#f8f9fa'][season];
  const dark = ['#26703a', '#c9a227', '#c1502e', '#dee2e6'][season];
  const blobs = [[8, 6, 16, 12], [4, 14, 12, 10], [16, 14, 12, 10], [10, 2, 12, 8], [6, 22, 20, 8]];
  for (const [x, y, w, h] of blobs) px(ctx, x, y, w, h, leaf);
  px(ctx, 10, 10, 4, 4, dark);
  px(ctx, 20, 18, 4, 4, dark);
  return c;
}

function pineSprite() {
  const c = cv(32, 48);
  const ctx = c.getContext('2d');
  px(ctx, 14, 38, 4, 10, '#6b4226');
  px(ctx, 8, 30, 16, 10, '#1b4332');
  px(ctx, 10, 20, 12, 10, '#2d6a4f');
  px(ctx, 12, 10, 8, 10, '#40916c');
  px(ctx, 14, 2, 4, 8, '#52b788');
  return c;
}

function houseSprite(kind) {
  // 96x96 (3x3 petak): miskin = kayu kecil, sedang = bata, kaya = besar berteras.
  const c = cv(96, 96);
  const ctx = c.getContext('2d');
  const wall = kind === 'miskin' ? '#a98467' : kind === 'sedang' ? '#e0a458' : '#f4d35e';
  const roof = kind === 'miskin' ? '#7f4f24' : kind === 'sedang' ? '#bc4749' : '#386641';
  const trim = kind === 'kaya' ? '#ffffff' : '#6c757d';
  // Atap
  px(ctx, 4, 8, 88, 10, roof);
  px(ctx, 10, 18, 76, 8, roof);
  px(ctx, 16, 26, 64, 8, roof);
  // Dinding
  px(ctx, 12, 34, 72, 52, wall);
  px(ctx, 12, 34, 72, 4, trim);
  px(ctx, 12, 82, 72, 4, trim);
  // Pintu
  px(ctx, 42, 58, 12, 28, '#5a3520');
  px(ctx, 50, 70, 2, 2, '#ffd60a');
  // Jendela
  px(ctx, 20, 46, 12, 12, '#a8dadc');
  px(ctx, 64, 46, 12, 12, '#a8dadc');
  px(ctx, 20, 46, 12, 2, trim);
  px(ctx, 64, 46, 12, 2, trim);
  if (kind === 'kaya') {
    px(ctx, 8, 86, 80, 6, '#8d6e63'); // teras
    px(ctx, 16, 40, 4, 4, '#ffd60a');
    px(ctx, 76, 40, 4, 4, '#ffd60a');
  }
  if (kind === 'miskin') {
    px(ctx, 12, 34, 72, 52, 'rgba(0,0,0,0.12)');
    px(ctx, 60, 60, 10, 8, '#6b4226'); // tambalan kayu
  }
  return c;
}

function tileSprite(kind, frame) {
  const c = cv(32, 32);
  const ctx = c.getContext('2d');
  if (kind === 'grass') {
    px(ctx, 0, 0, 32, 32, '#5dbb63');
    px(ctx, 4, 6, 2, 4, '#4da34f');
    px(ctx, 20, 12, 2, 4, '#4da34f');
    px(ctx, 12, 24, 2, 4, '#4da34f');
    px(ctx, 26, 26, 2, 3, '#79cf7e');
    if (frame === 1) { px(ctx, 8, 18, 2, 3, '#79cf7e'); px(ctx, 24, 4, 2, 3, '#4da34f'); }
  } else if (kind === 'grassDry') {
    px(ctx, 0, 0, 32, 32, '#c9a227');
    px(ctx, 4, 6, 2, 4, '#a9871f');
    px(ctx, 20, 12, 2, 4, '#a9871f');
  } else if (kind === 'grassSnow') {
    px(ctx, 0, 0, 32, 32, '#eef4f7');
    px(ctx, 4, 6, 2, 2, '#cfe0ea');
    px(ctx, 20, 12, 2, 2, '#cfe0ea');
  } else if (kind === 'path') {
    px(ctx, 0, 0, 32, 32, '#d9b380');
    px(ctx, 3, 4, 8, 5, '#c89f6b');
    px(ctx, 16, 10, 9, 5, '#c89f6b');
    px(ctx, 6, 20, 8, 5, '#c89f6b');
    px(ctx, 20, 22, 8, 5, '#c89f6b');
  } else if (kind === 'sand') {
    px(ctx, 0, 0, 32, 32, '#f2d8a7');
    px(ctx, 6, 8, 3, 2, '#e3c48f');
    px(ctx, 22, 18, 3, 2, '#e3c48f');
    px(ctx, 12, 26, 3, 2, '#e3c48f');
  } else if (kind === 'water') {
    px(ctx, 0, 0, 32, 32, '#2a9dcc');
    const off = frame === 1 ? 4 : 0;
    px(ctx, 2 + off, 8, 10, 2, '#7fd4f0');
    px(ctx, 18 - off, 18, 10, 2, '#7fd4f0');
    px(ctx, 8, 26, 8, 2, '#57b8dd');
  } else if (kind === 'soil') {
    px(ctx, 0, 0, 32, 32, '#7a5230');
    px(ctx, 3, 5, 6, 4, '#6b4226');
    px(ctx, 18, 12, 6, 4, '#6b4226');
    px(ctx, 8, 22, 6, 4, '#8a5f3a');
  } else if (kind === 'soilWet') {
    px(ctx, 0, 0, 32, 32, '#4e3421');
    px(ctx, 3, 5, 6, 4, '#3e2818');
    px(ctx, 18, 12, 6, 4, '#3e2818');
    px(ctx, 8, 22, 6, 4, '#5d4030');
  } else if (kind === 'floor') {
    px(ctx, 0, 0, 32, 32, '#b08968');
    px(ctx, 0, 0, 32, 2, '#8a6a4f');
    px(ctx, 0, 15, 32, 2, '#8a6a4f');
  } else if (kind === 'flower') {
    px(ctx, 0, 0, 32, 32, '#5dbb63');
    px(ctx, 14, 10, 2, 12, '#2f9e44');
    px(ctx, 11, 8, 8, 8, '#ff70a6');
    px(ctx, 14, 11, 2, 2, '#ffd60a');
  } else if (kind === 'rock') {
    px(ctx, 0, 0, 32, 32, '#5dbb63');
    px(ctx, 6, 10, 20, 16, '#8d99ae');
    px(ctx, 10, 6, 12, 8, '#a9b4c4');
    px(ctx, 10, 14, 6, 4, '#6c757d');
  } else if (kind === 'well') {
    px(ctx, 0, 0, 32, 32, '#5dbb63');
    px(ctx, 6, 8, 20, 18, '#8d6e63');
    px(ctx, 10, 12, 12, 10, '#1b263b');
    px(ctx, 4, 4, 24, 4, '#bc4749');
    px(ctx, 6, 4, 2, 8, '#6b4226');
    px(ctx, 24, 4, 2, 8, '#6b4226');
  } else if (kind === 'stall') {
    px(ctx, 0, 0, 32, 32, '#d9b380');
    px(ctx, 2, 12, 28, 14, '#8d6e63');
    px(ctx, 2, 12, 28, 3, '#f4d35e');
    px(ctx, 0, 2, 32, 8, '#e63946');
    px(ctx, 0, 2, 32, 2, '#f4f4f4');
    px(ctx, 8, 16, 4, 4, '#ff8c1a');
    px(ctx, 18, 16, 4, 4, '#e63946');
  }
  return c;
}

function cropSprite(color, stage) {
  const c = cv(32, 32);
  const ctx = c.getContext('2d');
  if (stage === 0) {
    px(ctx, 14, 14, 4, 8, '#3fae4a');
    px(ctx, 10, 10, 4, 4, '#57cc5e');
    px(ctx, 18, 10, 4, 4, '#57cc5e');
  } else if (stage === 1) {
    px(ctx, 14, 8, 4, 16, '#2f9e44');
    px(ctx, 8, 6, 6, 6, '#3fae4a');
    px(ctx, 18, 6, 6, 6, '#3fae4a');
    px(ctx, 10, 16, 4, 6, '#57cc5e');
    px(ctx, 18, 16, 4, 6, '#57cc5e');
  } else {
    px(ctx, 14, 6, 4, 14, '#2f9e44');
    px(ctx, 8, 4, 6, 6, '#3fae4a');
    px(ctx, 18, 4, 6, 6, '#3fae4a');
    px(ctx, 10, 18, 12, 10, color);
    px(ctx, 12, 20, 4, 4, '#ffffff');
    px(ctx, 18, 24, 3, 3, '#ffffff');
  }
  return c;
}

function itemSprite(kind) {
  const maps = {
    benih: [['....gggg........', '...gggggg.......', '...gggggg.......', '..gggggggg......', '..gggggggg......', '..gggggggg......', '..gggggggg......', '..gggggggg......', '...gggggg.......', '...gggggg.......', '....gggg........', '................']],
    telur: [['.....wwww.......', '....wwwwww......', '...wwwwwwww.....', '...wwwwwwww.....', '...wwwwwwww.....', '...wwwwwwww.....', '....wwwwww......', '.....wwww.......']],
    susu: [['....wwww........', '....wwww........', '...wwwwww.......', '...wwwwww.......', '...wwwwww.......', '...wwwwww.......', '...wwwwww.......', '....wwww........']],
    ikan: [['....oooo........', '...oooooo.......', '..oooooooo......', '..oooooooooo....', '...oooooo.......', '....oooo........']],
    berlian: [['...cccccccc.....', '..cccccccccc....', '..cccccccccc....', '...cccccccc.....', '....cccccc......', '.....cccc.......']],
    roti: [['...bbbbbb.......', '..bbbbbbbb......', '..bbbbbbbb......', '..bbbbbbbb......', '...bbbbbb.......']],
    bunga: [['....pppp........', '...pppppp.......', '....pppp........', '.....gg.........', '.....gg.........', '....gggg........']],
    cincin: [['.....yyyy.......', '....y..y.......', '....y..y.......', '.....yy........', '...yyyyyy.......', '..yyyyyyyy......']],
    obat: [['....rrrr........', '...rrrrrr.......', '...rwwwwr.......', '...rwwwwr.......', '...rrrrrr.......', '....rrrr........']],
  };
  const pal = { g: '#8d6e63', w: '#f8f9fa', o: '#ff8c1a', c: '#7fd4f0', b: '#d9a05b', p: '#ff70a6', y: '#ffd60a', r: '#e63946' };
  const rows = maps[kind] || maps.benih;
  return fromMap(rows, pal);
}

export function buildSprites() {
  const s = {};
  s.grass = tileSprite('grass', 0);
  s.grass2 = tileSprite('grass', 1);
  s.grassDry = tileSprite('grassDry', 0);
  s.grassSnow = tileSprite('grassSnow', 0);
  s.path = tileSprite('path', 0);
  s.sand = tileSprite('sand', 0);
  s.water0 = tileSprite('water', 0);
  s.water1 = tileSprite('water', 1);
  s.soil = tileSprite('soil', 0);
  s.soilWet = tileSprite('soilWet', 0);
  s.floor = tileSprite('floor', 0);
  s.flower = tileSprite('flower', 0);
  s.rock = tileSprite('rock', 0);
  s.well = tileSprite('well', 0);
  s.stall = tileSprite('stall', 0);
  s.tree = [0, 1, 2, 3].map((i) => treeSprite(i));
  s.pine = pineSprite();
  s.housePoor = houseSprite('miskin');
  s.houseMid = houseSprite('sedang');
  s.houseRich = houseSprite('kaya');
  s.player = personSprite('#f1c27d', '#2b2d42', '#2a9d8f', '#3b3b6d', false);
  s.playerGirl = personSprite('#f1c27d', '#6d3b2d', '#e07a5f', '#3b3b6d', true);
  s.npc = {
    tani: personSprite('#e0ac69', '#e9ecef', '#8d6e63', '#4a4e69', false),
    sari: personSprite('#f1c27d', '#22223b', '#e07a5f', '#3b3b6d', true),
    rani: personSprite('#ffdbac', '#6d3b2d', '#f4a7b9', '#3b3b6d', true),
    dimas: personSprite('#f1c27d', '#1d3557', '#3d5a80', '#22223b', false),
    murni: personSprite('#e0ac69', '#e9ecef', '#9c6644', '#4a4e69', true),
    budi: personSprite('#c68642', '#22223b', '#2a9d8f', '#22223b', false),
    kiki: personSprite('#ffdbac', '#22223b', '#f4d35e', '#3b3b6d', false),
    rt: personSprite('#f1c27d', '#343a40', '#5a189a', '#22223b', false),
  };
  s.baby = personSprite('#ffdbac', '#6d3b2d', '#a8dadc', '#3b3b6d', false);
  s.animal = {
    ayam: animalSprite('ayam'),
    kambing: animalSprite('kambing'),
    sapi: animalSprite('sapi'),
    kerbau: animalSprite('kerbau'),
  };
  s.crop = {};
  for (const [id, c] of Object.entries({
    lobak: '#ff5a4e', wortel: '#ff8c1a', tomat: '#e63946', gandum: '#e9c46a', labu: '#f4842b',
  })) s.crop[id] = [0, 1, 2].map((st) => cropSprite(c, st));
  s.item = {
    benih: itemSprite('benih'), telur: itemSprite('telur'), susu: itemSprite('susu'),
    ikan: itemSprite('ikan'), berlian: itemSprite('berlian'), roti: itemSprite('roti'),
    bunga: itemSprite('bunga'), cincin: itemSprite('cincin'), obat: itemSprite('obat'),
  };
  return s;
}
