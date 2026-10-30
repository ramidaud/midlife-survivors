// A tiny sound player. sfx("gem") plays the notes listed in SOUNDS.gem.
// Browsers stay silent until the player presses something, so we "unlock" audio on the first input.
let audioCtx = null, muted = false;
const lastPlayed = {}; // so a sound can't play 60 times a second

function unlockAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}
["keydown", "pointerdown", "touchstart"].forEach(ev => window.addEventListener(ev, unlockAudio));

function toggleMute() { muted = !muted; return muted; }

function sfx(name, minGapMs = 40) {
  if (muted || !audioCtx || audioCtx.state !== "running") return;
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
