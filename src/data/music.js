// Music tracks (Nov 5): made by Rami in Google Flow Music (Lyria 3.5), trimmed and evened out by Claude.
// Mix pass (Nov 5, Rami: "seriously overwhelming"): in-run music sits well under the effects.
// Tweak freely: vol (0 to 1), the ages where the office music changes, and fade times in seconds.
// To try a different take, swap the file and keep the name. The code-made groove plays if a file can't load.
window.MUSIC = {
  ver: 2,
  tracks: {
    title:  { file: "assets/audio/music/title.mp3",          vol: 0.45 },
    calm:   { file: "assets/audio/music/office-1-calm.mp3",  vol: 0.28 },  // ages 40 to 49
    busy:   { file: "assets/audio/music/office-2-busy.mp3",  vol: 0.28 },  // ages 50 to 57
    chaos:  { file: "assets/audio/music/office-3-chaos.mp3", vol: 0.3 },  // 58 and up: the power-fantasy years
    boss:   { file: "assets/audio/music/boss.mp3",           vol: 0.32 },   // while a birthday boss is on screen
    lounge: { file: "assets/audio/music/lounge.mp3",         vol: 0.32 },   // Student Lounge open
    retire: { file: "assets/audio/music/retire-party.mp3",   vol: 0.45 }   // the HAPPY RETIREMENT screen
  },
  stings: {
    levelUp:  { file: "assets/audio/sting/level-up.mp3",  vol: 0.35, minGapMs: 20000 }, // at most every 20 s; the beep covers the rest
    gameOver: { file: "assets/audio/sting/game-over.mp3", vol: 0.6 }
  },
  office: { busyAt: 50, chaosAt: 58 },
  switchFade: 2.5,   // seconds to crossfade when the music changes (a boss arrives, you turn 50)
  loopOverlap: 4,    // seconds the end of a track overlaps the start of its next play, so the loop never gaps
  pauseLevel: 0.3,   // music volume while paused or picking a level-up card
  stingDuck: 0.5    // music volume under a sting
};
