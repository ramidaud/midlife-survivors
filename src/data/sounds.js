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
  gem:      [[1200, 0.04, "sine"], [1600, 0.06, "sine"]],
  hurt:     [[140, 0.15, "sawtooth"]],
  levelUp:  [[523, 0.08, "square"], [659, 0.08, "square"], [784, 0.08, "square"], [1047, 0.18, "square"]],
  pick:     [[784, 0.06, "triangle"], [1047, 0.10, "triangle"]],
  move:     [[600, 0.03, "triangle"]],                                 // moving between menu choices
  ring:     [[980, 0.05, "square"], [1240, 0.05, "square"]],           // Spam Likely phone ring
  overdue:  [[300, 0.06, "sawtooth"], [420, 0.08, "sawtooth"]],        // Bill splits into Late Fees
  bossSpawn:[[220, 0.14, "sawtooth"], [165, 0.24, "sawtooth"]],        // ominous HR arrival
  bossDefeat:[[523, 0.08, "square"], [659, 0.08, "square"], [784, 0.08, "square"], [1047, 0.22, "square"]]
};
