// A tiny sound & retro-groove player. sfx("gem") plays the notes listed in SOUNDS.gem.
// Browsers stay silent until the player presses something, so we "unlock" audio on the first input.
let audioCtx = null, muted = false, musicStep = 0, musicPlaying = false;
const lastPlayed = {}; // so a sound can't play 60 times a second

function unlockAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}
["keydown", "pointerdown", "touchstart"].forEach(ev => window.addEventListener(ev, unlockAudio));

function toggleMute() { muted = !muted; return muted; }

function setMusicPlaying(on) { musicPlaying = on; }

// Background 16-bit synth groove scheduler: ticks every SOUNDS.music.stepMs.
setInterval(() => {
  if (muted || !musicPlaying || !audioCtx || audioCtx.state !== "running" || !SOUNDS.music) return;
  const M = SOUNDS.music, i = musicStep++ % M.bass.length;
  const t = audioCtx.currentTime, dur = (M.stepMs / 1000) * 0.85;
  const bFreq = M.bass[i], lFreq = M.lead[i];
  if (bFreq) {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = "triangle"; o.frequency.value = bFreq;
    g.gain.setValueAtTime(M.volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(t); o.stop(t + dur);
  }
  if (lFreq) {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = "square"; o.frequency.value = lFreq;
    g.gain.setValueAtTime(M.volume * 0.55, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(t); o.stop(t + dur);
  }
}, 165);

function sfx(name, minGapMs = 40) {
  if (muted || !audioCtx || audioCtx.state !== "running" || !SOUNDS[name]) return;
  const now = performance.now();
  if (now - (lastPlayed[name] || 0) < minGapMs) return;
  lastPlayed[name] = now;
  let t = audioCtx.currentTime;
  SOUNDS[name].forEach(([freq, len, wave]) => {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = wave; osc.frequency.value = freq;
    gain.gain.setValueAtTime(SOUNDS.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + len); // fade out so it doesn't click
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t); osc.stop(t + len);
    t += len; // next note starts when this one ends
  });
}
