// Real music player (Nov 5): plays Rami's Flow Music tracks through the music volume slider.
// Every quarter second it asks "what should be playing?" (title, office by age, boss, lounge, retirement)
// and crossfades when the answer changes. Tracks download only when first needed.
window.Music = (() => {
  const M = window.MUSIC || { tracks: {}, stings: {} };
  const buf = {}, loading = {}, failed = {};
  let master = null, cur = null, ending = null, duckUntil = 0;
  const lastSting = {};
  const ctx = () => (typeof audioCtx !== "undefined" && audioCtx && audioCtx.state === "running") ? audioCtx : null;
  function setup(c) {
    if (master) return;
    master = c.createGain(); master.gain.value = 1;
    master.connect((typeof musicBus !== "undefined" && musicBus) || c.destination);
  }
  function load(name, def) {
    if (!def || buf[name] || loading[name] || failed[name]) return;
    const c = ctx(); if (!c) return;
    loading[name] = fetch(def.file + "?v=" + (M.ver || 1))
      .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(a => new Promise((res, rej) => c.decodeAudioData(a, res, rej)))
      .then(b => { buf[name] = b; })
      .catch(() => { failed[name] = true; })
      .finally(() => { delete loading[name]; });
  }
  // One play of a track, fading in over `fade` seconds.
  function seg(c, name, when, fade) {
    const s = c.createBufferSource(), g = c.createGain(), v = M.tracks[name].vol ?? 1;
    s.buffer = buf[name]; s.connect(g).connect(master);
    g.gain.setValueAtTime(0.0001, when); g.gain.exponentialRampToValueAtTime(v, when + Math.max(0.05, fade));
    s.start(when);
    return { s, g, start: when };
  }
  function fadeOut(c, sg, at, fade) {
    try {
      sg.g.gain.cancelScheduledValues(at); sg.g.gain.setValueAtTime(Math.max(0.0001, sg.g.gain.value), at);
      sg.g.gain.exponentialRampToValueAtTime(0.0001, at + fade); sg.s.stop(at + fade + 0.1);
    } catch (e) {}
  }
  function desired() {
    if (ending) return ending;
    if (typeof titleOpen !== "undefined" && titleOpen) return "title";
    if (typeof gameOver !== "undefined" && gameOver) return null;
    const lg = document.getElementById("lounge-modal");
    if (lg && lg.offsetParent !== null) return "lounge";
    try { if (bills.getChildren().some(o => o.active && o.isBoss && !o.clockOut && !o.ghost)) return "boss"; } catch (e) {}
    const age = typeof currentAge === "number" ? currentAge : 40;
    return age >= M.office.chaosAt ? "chaos" : age >= M.office.busyAt ? "busy" : "calm";
  }
  function tick() {
    const c = ctx(); if (!c) return;
    setup(c);
    for (const k in M.stings) load("s_" + k, M.stings[k]);
    const want = (typeof getSoundStyle === "function" && getSoundStyle() === "classic") ? null : desired();
    if (want) load(want, M.tracks[want]);
    if (want === "calm") load("busy", M.tracks.busy); // get the next one ready early
    // overall level: muted, hidden tab, paused, or under a sting
    const off = typeof muted !== "undefined" && muted;
    const paused = typeof musicPlaying !== "undefined" && !musicPlaying && !ending && !(typeof titleOpen !== "undefined" && titleOpen);
    let level = off || document.hidden ? 0 : paused ? M.pauseLevel : 1;
    if (c.currentTime < duckUntil) level = Math.min(level, M.stingDuck);
    master.gain.setTargetAtTime(level, c.currentTime, 0.15);
    // switch tracks
    const now = c.currentTime;
    if ((cur ? cur.name : null) !== want) {
      if (want && !buf[want]) { if (!failed[want]) return; } // still downloading: keep what's playing
      if (cur) { cur.segs.forEach(sg => fadeOut(c, sg, now, M.switchFade)); cur = null; }
      if (want && buf[want]) { const sg = seg(c, want, now + 0.05, M.switchFade); cur = { name: want, segs: [sg], nextAt: sg.start + buf[want].duration - M.loopOverlap }; }
      return;
    }
    // loop: start the next play before this one ends and overlap them
    if (cur && now >= cur.nextAt - 0.4) {
      const at = Math.max(now + 0.05, cur.nextAt), old = cur.segs[cur.segs.length - 1];
      const sg = seg(c, cur.name, at, M.loopOverlap);
      fadeOut(c, old, at, M.loopOverlap);
      cur.segs = [sg]; cur.nextAt = at + buf[cur.name].duration - M.loopOverlap;
    }
  }
  setInterval(tick, 250);
  // A short one-shot (level-up, game over). Returns false if it isn't ready, so the old beep can play instead.
  function sting(name) {
    const c = ctx(), b = buf["s_" + name];
    if (typeof getSoundStyle === "function" && getSoundStyle() === "classic") return false;
    if (!c || !b || (typeof muted !== "undefined" && muted)) return false;
    const gap = M.stings[name].minGapMs || 0, nowMs = performance.now();
    if (gap && nowMs - (lastSting[name] || -1e9) < gap) return false;
    lastSting[name] = nowMs;
    setup(c);
    const s = c.createBufferSource(), g = c.createGain();
    s.buffer = b; g.gain.value = (M.stings[name].vol ?? 1);
    s.connect(g).connect((typeof musicBus !== "undefined" && musicBus) || c.destination);
    s.start(); duckUntil = c.currentTime + b.duration;
    return true;
  }
  return {
    sting,
    end(win) { ending = win ? "retire" : null; if (!win) sting("gameOver"); },
    reset() { ending = null; },
    covering: () => !!(cur && buf[cur.name]), // a real track is playing, so the code-made groove stays quiet
    now: () => cur ? cur.name : null
  };
})();
