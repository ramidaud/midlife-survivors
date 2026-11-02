// Anonymous play stats, so Rami can see how long people play, how far they get and what gets them.
//
// Two pieces:
//   1. GoatCounter (loaded in index.html): counts visits, plus a few game events ("run-start", "reached-50").
//      No cookies, nothing personal.
//   2. One row per run in the Supabase "runs" table: run length, age reached, score, character, what killed
//      you, phone or desktop, game version. No names. A random ID per browser lets us count unique players.
//      The table only accepts new rows; nobody can read it from the game (Rami reads it in the Supabase dashboard).
// Set window.TELEMETRY_OFF = true (or add ?nostats=1 to the URL) to send nothing.
window.Telemetry = (() => {
  const off = () => window.TELEMETRY_OFF || /[?&]nostats=1/.test(location.search);
  let run = null; // { startedAt, startAge, resumed, reported }

  function playerId() {
    try {
      let id = localStorage.getItem("ms-player-id");
      if (!id) { id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); localStorage.setItem("ms-player-id", id); }
      return id;
    } catch (e) { return "no-storage"; }
  }
  const device = () => (window.matchMedia && matchMedia("(pointer: coarse)").matches ? "phone" : "desktop");
  // Coarse device details (no fingerprinting): phone/tablet/desktop, OS family, browser family, screen size
  // rounded to 100 px, and how smooth the game ran. Only sent once the runs table has these columns.
  const DEVICE_DETAIL = false; // flip to true after running docs/sql/RUNS_DEVICE.sql
  function deviceDetail() {
    const ua = navigator.userAgent || "", touch = navigator.maxTouchPoints > 1;
    const os = /iPhone|iPod/.test(ua) ? "iOS" : (/iPad/.test(ua) || (/Macintosh/.test(ua) && touch)) ? "iPadOS" : /Android/.test(ua) ? "Android"
      : /CrOS/.test(ua) ? "ChromeOS" : /Windows/.test(ua) ? "Windows" : /Macintosh/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "other";
    const browser = /Edg\//.test(ua) ? "Edge" : /SamsungBrowser/.test(ua) ? "Samsung" : /Firefox|FxiOS/.test(ua) ? "Firefox"
      : /CriOS|Chrome/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : "other";
    const w = Math.round(screen.width / 100) * 100, h = Math.round(screen.height / 100) * 100, short = Math.min(screen.width, screen.height);
    const form = !touch ? "desktop" : short >= 700 ? "tablet" : "phone";
    return { form, os, browser, screen_size: `${w}x${h}` };
  }
  // Frame rate while playing: average fps and the share of slow frames (under 40 fps).
  let fpsFrames = 0, fpsSlow = 0, fpsTime = 0, fpsLast = 0;
  (function fpsLoop(t) {
    if (run && !run.reported && typeof gameOver !== "undefined" && !gameOver && !(typeof paused !== "undefined" && paused) && fpsLast) {
      const dt = t - fpsLast; if (dt < 500) { fpsFrames++; fpsTime += dt; if (dt > 25) fpsSlow++; }
    }
    fpsLast = t; requestAnimationFrame(fpsLoop);
  })(0);

  // GoatCounter event (silently skipped if the script didn't load or is blocked)
  function event(name) {
    if (off()) return;
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "game/" + name, title: name, event: true }); } catch (e) {}
  }

  function send(outcome, killer) {
    if (off() || !run || run.reported) return;
    run.reported = true;
    const L = window.LEADERBOARD || {};
    if (!L.supabaseUrl || !L.supabaseAnonKey) return;
    let score = 0;
    try { score = window.computeRunScore ? window.computeRunScore(currentAge, runStartAge, runKills, runCoins, outcome === "cleared") : 0; } catch (e) {}
    const row = {
      player_id: playerId(),
      mode: String(typeof runMode !== "undefined" ? runMode : "").slice(0, 16),
      character: String((typeof meta !== "undefined" && meta && meta.selectedChar) || "").slice(0, 32),
      outcome,
      killer: killer ? String(killer).slice(0, 40) : null,
      start_age: Math.round(run.startAge * 10) / 10,
      age_reached: Math.round((typeof currentAge !== "undefined" ? currentAge : 0) * 10) / 10,
      duration_sec: Math.max(0, Math.round(((typeof runElapsedMs !== "undefined" ? runElapsedMs : 0) - run.startMs) / 1000)),
      score: Math.round(score) || 0,
      level: typeof level !== "undefined" ? level : null,
      kills: typeof runKills !== "undefined" ? runKills : null,
      close_calls: window.NearMiss ? window.NearMiss.getStats().credits : null,
      hits_taken: typeof runHits !== "undefined" ? runHits : null,
      damage_taken: typeof runDamageTaken !== "undefined" ? runDamageTaken : null,
      tax_bracket: typeof runTaxBracket !== "undefined" ? runTaxBracket : 0,
      device: device(),
      resumed: !!run.resumed,
      version: String((window.GAME_VERSION && GAME_VERSION.displayVersion) || "").slice(0, 24)
    };
    if (DEVICE_DETAIL) Object.assign(row, deviceDetail(), {
      avg_fps: fpsTime ? Math.round(1000 * fpsFrames / fpsTime) : null,
      slow_frame_pct: fpsFrames ? Math.round(100 * fpsSlow / fpsFrames) : null
    });
    try {
      fetch(`${L.supabaseUrl}/rest/v1/runs`, {
        method: "POST", keepalive: true, // keepalive lets it finish even if the tab is closing
        headers: { apikey: L.supabaseAnonKey, Authorization: `Bearer ${L.supabaseAnonKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(row)
      }).catch(() => {});
    } catch (e) {}
  }

  // A run began (fresh or resumed). If the previous run never finished (Retry from pause, etc.), log it first.
  function runStarted(resumed) {
    if (run && !run.reported) send("restarted");
    fpsFrames = 0; fpsSlow = 0; fpsTime = 0;
    run = { startMs: typeof runElapsedMs !== "undefined" ? runElapsedMs : 0, startAge: typeof currentAge !== "undefined" ? currentAge : 40, resumed: !!resumed, reported: false, milestones: {} };
    event(resumed ? "run-resume" : "run-start");
  }

  // Died, or reached the end of this life.
  function runEnded(isWin, killer) {
    if (!run) return;
    event(isWin ? "run-cleared" : "run-died");
    send(isWin ? "cleared" : "died", killer);
  }

  // Called now and then from the game loop: one event the first time a run passes 45, 50, 55, 60, 65.
  function tick() {
    if (!run || run.reported || typeof currentAge === "undefined") return;
    for (const age of [45, 50, 55, 60, 65]) {
      if (currentAge >= age && !run.milestones[age]) { run.milestones[age] = true; event("reached-" + age); }
    }
  }

  // Closing the tab or switching away for good mid-run counts as quitting.
  window.addEventListener("pagehide", () => {
    if (run && !run.reported && typeof gameOver !== "undefined" && !gameOver) send("quit");
  });

  return { runStarted, runEnded, tick, event };
})();
