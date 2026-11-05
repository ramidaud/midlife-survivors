// Sound-effect files (Nov 5). Each game sound can use a real recording from assets/audio/sfx/.
// Turn one on by setting on: true once its file is in the folder; until then the code-made beep plays.
// vol is 0 to 1. Pitch still varies a little each play (and climbs on kill streaks), so repeats don't sound robotic.
window.SFX_FILES = {
  ver: 1,
  files: {
    hit:        { file: "assets/audio/sfx/sfx-hit.mp3",         vol: 0.5, on: false },  // a weapon lands
    billPaid:   { file: "assets/audio/sfx/sfx-paper-rip.mp3",   vol: 0.5, on: false },  // an enemy is destroyed
    coin:       { file: "assets/audio/sfx/sfx-coin.mp3",        vol: 0.5, on: false },
    gem:        { file: "assets/audio/sfx/sfx-xp-gem.mp3",      vol: 0.35, on: false },
    hurt:       { file: "assets/audio/sfx/sfx-hurt.mp3",        vol: 0.7, on: false },
    bossSpawn:  { file: "assets/audio/sfx/sfx-boss-arrive.mp3", vol: 0.8, on: false },
    bossDefeat: { file: "assets/audio/sfx/sfx-boss-down.mp3",   vol: 0.8, on: false },
    wallBonk:   { file: "assets/audio/sfx/sfx-wall-bonk.mp3",   vol: 0.8, on: false },
    micDrop:    { file: "assets/audio/sfx/sfx-mic-drop.mp3",    vol: 0.7, on: false },
    camera:     { file: "assets/audio/sfx/sfx-camera.mp3",      vol: 0.6, on: false },
    chestOpen:  { file: "assets/audio/sfx/sfx-chest-open.mp3",  vol: 0.7, on: false },
    ring:       { file: "assets/audio/sfx/sfx-phone-ring.mp3",  vol: 0.6, on: false }
  }
};
