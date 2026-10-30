// A tiny sound, retro-groove & character voice player (`src/sfx.js`).
// sfx("gem") plays the notes listed in SOUNDS.gem, and speakDadJoke(line) speaks the Dad Joke out loud!
let audioCtx = null, muted = false, voiceEnabled = true, musicStep = 0, musicPlaying = false;
const lastPlayed = {}; // so a sound can't play 60 times a second
let lastSpokenAt = 0;

function unlockAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  if (window.speechSynthesis && window.speechSynthesis.getVoices) {
    window.speechSynthesis.getVoices();
  }
}
["keydown", "pointerdown", "touchstart"].forEach(ev => window.addEventListener(ev, unlockAudio));

function toggleMute() {
  muted = !muted;
  if (muted && window.speechSynthesis) window.speechSynthesis.cancel();
  return muted;
}
function isMuted() { return muted; }

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  if (!voiceEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
  return voiceEnabled;
}
function isVoiceEnabled() { return voiceEnabled; }

function setMusicPlaying(on) {
  musicPlaying = on;
  if (!on && window.speechSynthesis) window.speechSynthesis.cancel();
}

// Speak a Dad Joke (or "NO!") out loud using the browser's built-in Web Speech API!
function speakDadJoke(text, pitch = 0.94, rate = 1.06) {
  if (muted || !voiceEnabled || !window.speechSynthesis) return;
  const now = performance.now();
  // Don't interrupt a joke currently being spoken, and keep at least a 2.2s gap between spoken jokes
  if (window.speechSynthesis.speaking || now - lastSpokenAt < 2200) return;
  lastSpokenAt = now;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    const enVoice = voices.find(v => /en(-|_)(US|GB|AU|CA)/i.test(v.lang) && /Daniel|Alex|Fred|Aaron|Arthur|Google US English|Reed|Rocko/i.test(v.name))
      || voices.find(v => /^en/i.test(v.lang));
    if (enVoice) utter.voice = enVoice;
    utter.pitch = pitch;
    utter.rate = rate;
    utter.volume = 0.95;
    window.speechSynthesis.speak(utter);
  } catch (e) {}
}

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
