// Sound-effect files (Nov 5). Each game sound can use a real recording from assets/audio/sfx/.
// Turn one on by setting on: true once its file is in the folder; until then the code-made beep plays.
// file can be a list of takes: the game rotates between them (never the same one twice in a row).
// vol is 0 to 1. Pitch still varies a little each play (and climbs on kill streaks), so repeats don't sound robotic.
window.SFX_FILES = {
  ver: 6,
  // Nov 5, round 2 (Rami): Mic Drop is just the drop and thud (no feedback squeal); Spam Likely buzzes like a phone on a desk.
  // Mix pass (Nov 5): sounds that happen many times a second (hits, rips, gems, coins) are quiet and capped,
  // so a swarm reads as texture instead of a wall of noise. maxAtOnce = how many copies may overlap.
  maxAtOnce: { hit: 3, billPaid: 3, gem: 2, coin: 2, camera: 1, ring: 1, micDrop: 1, wallBonk: 1 },
  files: {
    hit:        { file: "assets/audio/sfx/sfx-hit.mp3",         vol: 0.16, on: true },  // a weapon lands
    billPaid:   { file: "assets/audio/sfx/sfx-paper-rip.mp3",   vol: 0.18, on: true },  // an enemy is destroyed
    coin:       { file: "assets/audio/sfx/sfx-coin.mp3",        vol: 0.22, on: true },
    gem:        { file: ["assets/audio/sfx/sfx-xp-gem-1.mp3", "assets/audio/sfx/sfx-xp-gem-2.mp3"],      vol: 0.12, on: true },
    hurt:       { file: "assets/audio/sfx/sfx-hurt.mp3",        vol: 0.42, on: true },
    bossSpawn:  { file: ["assets/audio/sfx/sfx-boss-arrive-1.mp3", "assets/audio/sfx/sfx-boss-arrive-2.mp3", "assets/audio/sfx/sfx-boss-arrive-3.mp3", "assets/audio/sfx/sfx-boss-arrive-4.mp3"], vol: 0.45, on: true },
    bossDefeat: { file: ["assets/audio/sfx/sfx-boss-down-1.mp3", "assets/audio/sfx/sfx-boss-down-2.mp3", "assets/audio/sfx/sfx-boss-down-3.mp3", "assets/audio/sfx/sfx-boss-down-4.mp3"],   vol: 0.45, on: true },
    wallBonk:   { file: ["assets/audio/sfx/sfx-wall-bonk-1.mp3", "assets/audio/sfx/sfx-wall-bonk-2.mp3", "assets/audio/sfx/sfx-wall-bonk-3.mp3"],   vol: 0.4, on: true },
    micDrop:    { file: ["assets/audio/sfx/sfx-mic-drop-1.mp3", "assets/audio/sfx/sfx-mic-drop-2.mp3"],    vol: 0.3, on: true },
    camera:     { file: "assets/audio/sfx/sfx-camera.mp3",      vol: 0.22, on: true },
    chestOpen:  { file: "assets/audio/sfx/sfx-chest-open.mp3",  vol: 0.4, on: true },
    ring:       { file: "assets/audio/sfx/sfx-phone-buzz.mp3",  vol: 0.3, on: true }
  }
};
