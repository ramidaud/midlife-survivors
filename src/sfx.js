// A tiny sound, retro-groove & character voice player (`src/sfx.js`).
// sfx("gem") plays the notes listed in SOUNDS.gem, and speakDadJoke(line) speaks the Dad Joke out loud!
let audioCtx = null, muted = false, voiceEnabled = true, musicStep = 0, musicPlaying = false;
const lastPlayed = {}; // so a sound can't play 60 times a second
let lastSpokenAt = 0;

// Separate volume for music and sound effects (0 to 1), saved in this browser.
const audioVol = (() => { try { return Object.assign({ music: 0.8, sfx: 1 }, JSON.parse(localStorage.getItem("ms-audio-vol") || "{}")); } catch (e) { return { music: 0.8, sfx: 1 }; } })();
let sfxBus = null, musicBus = null, noiseBuf = null, liveVoices = 0;
function setupBuses() {
  if (sfxBus || !audioCtx) return;
  // A compressor glues lots of overlapping sounds together, so a big fight sounds full instead of clipping.
  const comp = audioCtx.createDynamicsCompressor();
  comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
  comp.connect(audioCtx.destination);
  sfxBus = audioCtx.createGain(); sfxBus.connect(comp);
  musicBus = audioCtx.createGain(); musicBus.connect(audioCtx.destination);
  applyVolumes();
  // Half a second of white noise, reused for paper rips, thuds and whooshes.
  noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate / 2, audioCtx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}
function applyVolumes() {
  if (sfxBus) sfxBus.gain.value = audioVol.sfx;
  if (musicBus) musicBus.gain.value = audioVol.music;
}
function getVolume(which) { return audioVol[which]; }
function setVolume(which, v) {
  audioVol[which] = Math.max(0, Math.min(1, Math.round(v * 100) / 100));
  try { localStorage.setItem("ms-audio-vol", JSON.stringify(audioVol)); } catch (e) {}
  applyVolumes();
}

// iPhone audio mode (Nov 3, Rami: "the game audio shouldn't end other audio playing").
//   "mix":  the game plays on top of your podcast or music (iOS calls this "ambient"; the ringer switch can silence it)
//   "solo": the game takes over the speaker and plays even with the ringer on silent ("playback")
let audioMix = (() => { try { return localStorage.getItem("ms-audio-mix") || "mix"; } catch (e) { return "mix"; } })();
function applyAudioSession() {
  try { const want = audioMix === "solo" ? "playback" : "ambient"; if (navigator.audioSession && navigator.audioSession.type !== want) navigator.audioSession.type = want; } catch (e) {}
}
function hasAudioSession() { return !!navigator.audioSession; }
function getAudioMix() { return audioMix; }
function toggleAudioMix() {
  audioMix = audioMix === "mix" ? "solo" : "mix";
  try { localStorage.setItem("ms-audio-mix", audioMix); } catch (e) {}
  applyAudioSession();
}
applyAudioSession();
function unlockAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  setupBuses();
  // iPhones use an "interrupted" state (calls, Siri, app switching), not just "suspended": wake it either way.
  if (audioCtx.state !== "running" && audioCtx.state !== "closed") {
    audioCtx.resume().catch(() => {});
    // Old iPhone trick: starting a tiny silent sound inside the tap is what really wakes Safari's audio.
    try { const b = audioCtx.createBuffer(1, 1, 22050), s = audioCtx.createBufferSource(); s.buffer = b; s.connect(audioCtx.destination); s.start(0); } catch (e) {}
  }
  applyAudioSession();
  if (window.speechSynthesis && window.speechSynthesis.getVoices) {
    window.speechSynthesis.getVoices();
  }
}
["keydown", "pointerdown", "touchstart", "touchend", "click"].forEach(ev => window.addEventListener(ev, unlockAudio));
// Leaving the tab, closing the app or locking the phone: put all audio to sleep. (Rami, Nov 2: the music kept
// plinking slowly in the background, because browsers slow down hidden timers instead of stopping them.)
// Coming back wakes it again.
function sleepAudio() {
  if (audioCtx && audioCtx.state === "running") audioCtx.suspend().catch(() => {});
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return sleepAudio();
  if (audioCtx && audioCtx.state !== "running" && audioCtx.state !== "closed") audioCtx.resume().catch(() => {});
});
window.addEventListener("pagehide", sleepAudio);

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

// End screen hush (Nov 5, Rami: cut the hits still sounding behind the retirement screen).
// While a run's end screen is up, only menu sounds and the ending fanfare play. musicTrack picks which tune loops.
let endHush = false, musicTrack = "music", musicTick = 0;
const HUSH_OK = new Set(["pick", "move", "uiHover", "retireFanfare"]);
function setEndHush(on) { endHush = !!on; }
function setMusicTrack(name) { if (musicTrack !== name) { musicTrack = name; musicStep = 0; musicTick = 0; } }
function setMusicPlaying(on) {
  musicPlaying = on;
  if (on && audioCtx && audioCtx.state !== "running" && audioCtx.state !== "closed") audioCtx.resume().catch(() => {}); // a run starting is a good moment to wake the audio
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
  const M = SOUNDS[musicTrack] || SOUNDS.music;
  if (muted || !musicPlaying || document.hidden || !audioCtx || audioCtx.state !== "running" || !M) return;
  if (window.Music && Music.covering()) return; // Rami's real tracks are playing
  if (musicTick++ % (M.every || 1)) return; // slower tunes skip ticks (every: 2 = half speed)
  const i = musicStep++ % M.bass.length;
  const t = audioCtx.currentTime, dur = (165 * (M.every || 1) / 1000) * 0.85;
  const bFreq = M.bass[i], lFreq = M.lead[i];
  if (bFreq) {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = "triangle"; o.frequency.value = bFreq;
    g.gain.setValueAtTime(M.volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(musicBus || audioCtx.destination);
    o.start(t); o.stop(t + dur);
  }
  if (lFreq) {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = "square"; o.frequency.value = lFreq;
    g.gain.setValueAtTime(M.volume * 0.55, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(musicBus || audioCtx.destination);
    o.start(t); o.stop(t + dur);
  }
}, 165);

// Sound effects with variety (Nov 2, "beautiful chaos"): every play is slightly different in pitch,
// some sounds get a noise layer (paper rip, thud), and kills climb a happy scale when they come fast.
const PENTA = [1, 1.125, 1.25, 1.5, 1.667]; // major pentatonic: any mix of these notes sounds good together
const ladders = {}; // kill/gem streaks: how far up the scale we are
function sfx(name, minGapMs = 40) {
  if (muted || !audioCtx || audioCtx.state !== "running" || !SOUNDS[name]) return;
  if (endHush && !HUSH_OK.has(name)) return;
  setupBuses();
  const now = performance.now();
  if (now - (lastPlayed[name] || 0) < minGapMs) return;
  const V = (window.SOUND_VARY && SOUND_VARY[name]) || {};
  if (liveVoices > (SOUND_VARY && SOUND_VARY.maxVoices || 28) && !V.important) return; // too much at once: skip the small stuff
  lastPlayed[name] = now;
  let mult = 1 + (Math.random() * 2 - 1) * (V.vary != null ? V.vary : 0.04);
  if (V.ladder) { // fast streaks climb the scale, a pause starts it over
    const L = ladders[name] || (ladders[name] = { step: 0, at: 0 });
    L.step = now - L.at < (V.ladderMs || 450) ? L.step + 1 : 0; L.at = now;
    const st = Math.min(L.step, (V.ladderMax || 10));
    mult = PENTA[st % 5] * Math.pow(2, Math.floor(st / 5)) * (1 + (Math.random() * 2 - 1) * 0.01);
  }
  const vol = SOUNDS.volume * (V.gain || 1);
  let t = audioCtx.currentTime + 0.001, end = t;
  SOUNDS[name].forEach(([freq, len, wave]) => {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = wave; osc.frequency.value = freq * mult;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.004); // tiny fade-in: no clicks
    gain.gain.exponentialRampToValueAtTime(0.001, t + len);
    osc.connect(gain).connect(sfxBus);
    osc.start(t); osc.stop(t + len + 0.01);
    t += len; end = t;
  });
  if (V.noise && noiseBuf) { // a short filtered noise burst layered on top
    const [nLen, nFreq, nGain, nType] = V.noise;
    const src = audioCtx.createBufferSource(), f = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
    src.buffer = noiseBuf; src.playbackRate.value = 0.8 + Math.random() * 0.4;
    f.type = nType || "bandpass"; f.frequency.value = nFreq * (0.85 + Math.random() * 0.3); f.Q.value = 1.2;
    const t0 = audioCtx.currentTime + 0.001;
    g.gain.setValueAtTime(vol * nGain, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + nLen);
    src.connect(f).connect(g).connect(sfxBus); src.start(t0); src.stop(t0 + nLen + 0.01);
  }
  liveVoices++;
  setTimeout(() => { liveVoices--; }, (end - audioCtx.currentTime) * 1000 + 30);
}
