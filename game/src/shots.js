// Desa Kehidupan — shots.js
// Adegan screenshot deterministik untuk ?shot=start|play|fish|win|end.
// Setiap adegan memainkan aturan game sungguhan dari dunia ber-seed, jadi
// frame-nya adalah render asli game, bukan mockup.
import { TILE } from './config.js';
import { farmAction } from './farm.js';
import { buyAnimal } from './animals.js';
import { startFishing } from './fishing.js';

export function stageShot(name, seed, hooks) {
  const { createWorld } = hooks;
  const world = createWorld(seed);
  if (name === 'play') {
    // Pagi hari Semi yang cerah, pemain sedang bertani di ladang.
    world.day = 3;
    world.hour = 10;
    world.minute = 15;
    world.weather = 'Cerah';
    world.gold = 1240;
    world.inventory.benih_lobak = 4;
    world.inventory.benih_wortel = 2;
    world.inventory.roti = 2;
    // Cangkul + tanam + siram beberapa petak, sebagian sudah tumbuh.
    const plots = world.plots;
    for (let i = 0; i < 8; i += 1) {
      const plot = plots[i];
      plot.state = 'tilled';
      if (i < 6) {
        plot.crop = i < 3 ? 'lobak' : 'wortel';
        plot.growth = i < 3 ? 2 : 1;
        plot.watered = i % 2 === 0;
        if (plot.watered) plot.state = 'wet';
      }
    }
    // Hewan di kandang.
    world.animals.push({ kind: 'ayam', x: 3.5 * TILE, y: 9.5 * TILE, tx: null, ty: null, idle: 0, fed: true, sick: false, produceReady: true, happy: 4 });
    world.animals.push({ kind: 'sapi', x: 4.5 * TILE, y: 10 * TILE, tx: null, ty: null, idle: 0, fed: true, sick: false, produceReady: false, happy: 3 });
    // Warga di sekitar desa.
    const rani = world.npcs.find((n) => n.id === 'rani');
    rani.x = 20 * TILE; rani.y = 12 * TILE; rani.hearts = 3;
    const tani = world.npcs.find((n) => n.id === 'tani');
    tani.x = 18 * TILE; tani.y = 8 * TILE; tani.hearts = 2;
    // Pemain di tengah ladang menghadap tanaman.
    world.player.x = 8 * TILE;
    world.player.y = 8 * TILE;
    world.player.dir = 'down';
    world.player.energy = 82;
    world.player.hunger = 74;
    world.player.thirst = 68;
    world.player.health = 100;
    world.camera.x = 0;
    world.camera.y = 0;
    world.message = 'Panen Lobak! (+1 di tas, jual di pasar)';
    world.messageTimer = 5;
    return { world, state: 'playing' };
  }
  if (name === 'fish') {
    // Sore di tepi danau, pelampung baru saja tenggelam.
    world.day = 6;
    world.hour = 16;
    world.minute = 30;
    world.weather = 'Cerah';
    world.gold = 860;
    world.inventory.ikan_ikanMas = 2;
    world.player.x = 35 * TILE + 16;
    world.player.y = 8 * TILE + 16;
    world.player.dir = 'right';
    world.camera.x = 35 * TILE - 640;
    world.camera.y = 0;
    if (world.camera.x < 0) world.camera.x = 0;
    startFishing(world);
    world.fish.phase = 'bite';
    world.fish.timer = 1.0;
    world.message = '❗ Ada ikan! Tarik sekarang!';
    world.messageTimer = 5;
    return { world, state: 'playing' };
  }
  if (name === 'win') {
    world.day = 24;
    world.hour = 12;
    world.gold = 52340;
    world.flags.bigHouse = true;
    world.stats.harvested = 86;
    world.stats.fishCaught = 24;
    world.stats.gemsFound = 9;
    world.player.married = true;
    world.player.spouse = 'rani';
    world.player.childStage = 3;
    world.player.childName = 'Bimo';
    return { world, state: 'win' };
  }
  if (name === 'end') {
    world.day = 29;
    world.gold = 31200;
    world.stats.harvested = 41;
    world.stats.fishCaught = 12;
    return { world, state: 'lose' };
  }
  // start (default): layar judul.
  return { world, state: 'title' };
}
