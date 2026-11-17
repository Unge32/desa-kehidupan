[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/Unge32/desa-kehidupan/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/Unge32/desa-kehidupan/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

Entry for [make.fun's "Make the best game" bounty](https://make.fun/bounty/best-game-01) ($1,000 in USDC).

# Desa Kehidupan

Simulasi hidup desa pixel ala game PS2: berkebun, memancing, menambang
berlian, beternak, berdagang di pasar, dan berkeluarga — semua dalam satu
desa yang hidup dengan 4 musim, cuaca, festival, dan waktu real-time.

Seorang petani muda mewarisi ladang di Desa Kehidupan. Tujuannya: beli
RUMAH BESAR (50.000G) sebelum akhir Tahun 1 (28 hari: 4 musim x 7 hari).
Sepanjang jalan: tanam dan panen, gali berlian di hutan, mancing di danau
dan laut, pelihara ayam, kambing, sapi dan kerbau, jaga lapar/haus/energi,
berteman dengan 8 warga desa, pacaran, menikah, punya anak yang tumbuh,
sekolah, dan bermain di taman.

## How to play

Serve the `game/` folder with any static server (for example
`python3 -m http.server` inside `game/`) and open `index.html` in a
desktop browser. No build step, no network requests, no libraries — all
art and sound are procedural.

- **Move:** `WASD` / arrow keys, or tap-to-move on touch.
- **E:** context action — cangkul, tanam, siram, panen, gali, bicara,
  beri makan hewan, minum, tidur (di depan rumah).
- **F:** memancing di tepi air (tarik saat muncul "❗").
- **G:** beri hadiah ke warga terdekat. **R:** lamar (hati penuh + cincin).
- **1–5:** pilih benih. **B:** toko/pasar. **I:** tas (pakai/makan/jual).
- **P:** jeda. **H:** bantuan. **M:** suara. **Enter:** mulai / ulang.
- **Goal:** beli Rumah Besar sebelum hari ke-28 habis. Kehabisan waktu =
  game over. Sehat 0 = pingsan (kehilangan 10% emas, lanjut hari berikut).

## Screenshots

Deterministic scenes for the entry: `?shot=start|play|fish|win|end&seed=N`
stages the scene, renders it twice and sets `window.__shotReady`.

## Entry

`main.ts` (Node 22, standard library only) copies `game/` and
`screenshots/` to `/output` and writes `/output/dossier.json` with the
vendored make.fun library (`vendor/makefun-game.ts`).
