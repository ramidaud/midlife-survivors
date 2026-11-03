// Sound effects, made from pure tones in code (no audio files yet; real sounds come in Phase 4).
// Each sound is a short list of notes: [frequency in Hz, length in seconds, wave shape].
// Lower Hz = deeper. Wave shapes: "sine" (soft), "square" (retro), "triangle" (mellow), "sawtooth" (buzzy).
window.SOUNDS = {
  volume: 0.25,  // 0 = silent, 1 = loud. Press M in game to mute
  shoot:    [[520, 0.05, "triangle"]],
  dadJoke:  [[340, 0.07, "sawtooth"], [260, 0.11, "sawtooth"]],        // "wah-wah" groan
  wordNo:   [[180, 0.09, "square"], [360, 0.08, "triangle"]],          // firm thump
  hit:      [[220, 0.04, "square"]],
  billPaid: [[880, 0.06, "square"], [1320, 0.10, "square"]],          // "cha-ching"
  coin:     [[1047, 0.05, "sine"], [1568, 0.09, "sine"]],             // 401(k) gold coin clink
  gem:      [[1200, 0.04, "sine"], [1600, 0.06, "sine"]],
  nearMiss: [[880, 0.03, "sine"], [1320, 0.05, "sine"]],              // Close Call: a soft quick "whoosh-blip"
  hurt:     [[140, 0.15, "sawtooth"]],
  levelUp:  [[523, 0.08, "square"], [659, 0.08, "square"], [784, 0.08, "square"], [1047, 0.18, "square"]],
  pick:     [[784, 0.06, "triangle"], [1047, 0.10, "triangle"]],
  move:     [[600, 0.03, "triangle"]],                                 // moving between menu choices
  uiHover:  [[1320, 0.018, "sine"]],                                   // the softest tick: hovering a menu option (Nov 3)
  ring:     [[980, 0.05, "square"], [1240, 0.05, "square"]],           // Spam Likely phone ring
  overdue:  [[300, 0.06, "sawtooth"], [420, 0.08, "sawtooth"]],        // Bill splits into Late Fees
  bossSpawn:[[220, 0.14, "sawtooth"], [165, 0.24, "sawtooth"]],        // ominous HR arrival
  bossDefeat:[[523, 0.08, "square"], [659, 0.08, "square"], [784, 0.08, "square"], [1047, 0.22, "square"]],

  // Retro 16-bit synthwave/chiptune background groove (16-step loop, in Hz; 0 = rest).
  music: {
    volume: 0.065,     // gentle background level so SFX still pop on top
    stepMs: 165,       // tempo (~180 eighth-notes per minute)
    bass: [110, 110, 220, 110,  131, 131, 262, 131,  147, 147, 294, 147,  165, 147, 131, 98],
    lead: [440, 0,   523, 659,  587, 0,   523, 440,  587, 0,   659, 784,  659, 587, 523, 0]
  }
};

// Variety for each sound (Nov 2, "beautiful chaos"). Tweak freely:
//   vary   = random pitch wobble (0.1 = up to 10% up or down) so repeats never sound identical
//   ladder = fast repeats climb a happy 5-note scale (kills and gems in a streak make a little melody)
//   noise  = [length s, filter Hz, loudness, filter type] a short noise layer: paper rips, thuds, whooshes
//   gain   = louder/quieter than the master volume; important = always plays even in huge fights
window.SOUND_VARY = {
  maxVoices: 28, // how many sound effects can overlap before small ones get skipped
  shoot:    { vary: 0.10, gain: 0.6 },
  hit:      { vary: 0.18, gain: 0.8, noise: [0.035, 2400, 0.5] },               // paper smack
  billPaid: { ladder: true, ladderMs: 420, ladderMax: 12, noise: [0.07, 3200, 0.35, "highpass"] }, // cha-ching + paper rip, climbing in streaks
  gem:      { ladder: true, ladderMs: 300, ladderMax: 14, gain: 0.7 },
  coin:     { vary: 0.03, ladder: true, ladderMs: 350, ladderMax: 9 },
  hurt:     { vary: 0.08, important: true, noise: [0.12, 300, 0.8, "lowpass"] },  // a thud you feel
  nearMiss: { vary: 0.06, noise: [0.09, 1800, 0.4, "bandpass"] },              // whoosh
  dadJoke:  { vary: 0.05 },
  wordNo:   { vary: 0.08, noise: [0.06, 500, 0.6, "lowpass"] },
  overdue:  { vary: 0.06 },
  ring:     { vary: 0.04 },
  levelUp:  { vary: 0, important: true },
  bossSpawn:{ vary: 0, important: true, noise: [0.4, 200, 0.7, "lowpass"] },
  bossDefeat:{ vary: 0, important: true, noise: [0.3, 1500, 0.5, "bandpass"] },
  pick:     { vary: 0, important: true },
  move:     { vary: 0, important: true, gain: 0.55 },
  uiHover:  { vary: 0.04, gain: 0.22 }
};
