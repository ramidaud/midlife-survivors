// Dev console (Nov 3, TJ's idea): a testing panel for playtesters.
//
// Turn it on:  add ?dev=1 to the game's address once (it's remembered in this browser).
// Turn it off: add ?dev=0.
// Open/close:  the DEV chip in the top-left corner, or the ` key (left of 1).
//
// Safety: while dev mode is on, scores never post to the leaderboard, play stats are not sent,
// and achievements don't unlock. Coins you earn still go into your local 401(k).
(function () {
  const KEY = "ms-dev-v1";
  const q = location.search;
  try {
    if (/[?&]dev=1/.test(q)) localStorage.setItem(KEY, "1");
    if (/[?&]dev=0/.test(q)) localStorage.removeItem(KEY);
  } catch (e) {}
  let on = false;
  try { on = localStorage.getItem(KEY) === "1"; } catch (e) {}
  if (!on) { window.DEV = { on: false }; return; }

  const DEV = window.DEV = { on: true, god: false, used: false };
  window.TELEMETRY_OFF = true;

  const inRun = () => typeof player !== "undefined" && player && player.scene && !gameOver && !titleOpen;
  const scene = () => player.scene;
  const mark = () => { DEV.used = true; };
  let toastTimer = 0;
  const say = (t) => {
    const el = document.getElementById("dev-toast"); if (!el) return;
    el.textContent = t; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
  };
  const need = (fn) => () => { if (!inRun()) return say("Start a run first"); mark(); fn(); };

  const ACTIONS = {
    god: need(() => { DEV.god = !DEV.god; render(); say(DEV.god ? "God mode ON" : "God mode OFF"); }),
    heal: need(() => { hp = stats.maxHp; drawHpBar(); say("Full health"); }),
    hp5: need(() => { stats.maxHp += 5; hp = stats.maxHp; drawHpBar(); say("+5 max health"); }),
    level: need(() => { showLevelUp(scene()); }),
    clear: need(() => {
      let n = 0;
      bills.getChildren().slice().forEach(b => { if (b.active && !b.isBoss) { damageBill(b, 99999); n++; } });
      say("Cleared " + n + " enemies");
    }),
    salad: need(() => {
      const s = window.pizzas.create(player.x + 90, player.y, "salad").setDepth(3);
      s.isSalad = true; s.dieAt = runElapsedMs + ((PICKUPS.salad && PICKUPS.salad.lifeMs) || 14000);
      say("Desk Salad dropped");
    }),
    intern: need(() => { if (window.Interns) { Interns.forceSpawn(scene()); say("Intern on the way"); } }),
    lounge: need(() => { if (window.Lounge) { Lounge.forceOpen(scene()); const s = Lounge.spot(); player.body.reset(s.x, s.y + 140); say("Lounge open, you're next to it"); } }),
    modGo: need(() => { const v = (document.getElementById("dev-mod") || {}).value; if (window.Modifiers) { Modifiers.forceStart(v); say("Modifier: " + v); } }),
    modStop: need(() => { if (window.Modifiers) { Modifiers.stop(); say("Modifier stopped"); } }),
    nav: () => { if (window.NAV) { NAV.debug = !NAV.debug; render(); say(NAV.debug ? "Route arrows ON" : "Route arrows OFF"); } }
  };
  const jumpTo = (age) => need(() => {
    const target = Math.max(runStartAge, age);
    runElapsedMs = (target - runStartAge) * modeCfg().secondsPerYear * 1000;
    say("Jumped to age " + target);
  });
  const boss = (kind) => need(() => {
    if (!window.ENEMIES || !ENEMIES[kind]) return say("Unknown boss");
    spawnBoss(scene(), kind); say(ENEMIES[kind].name || kind);
  });
  const give = () => need(() => {
    const sel = document.getElementById("dev-up"); if (!sel || !sel.value) return;
    const up = (window.UPGRADES || []).find(u => u.id === sel.value);
    if (!up) return;
    if (up.when && !up.when(stats)) return say("Not available yet (needs its prerequisites)");
    applyUpgrade(up); if (typeof drawHpBar === "function") drawHpBar();
    say("Gave " + up.name); fillUpgrades();
  })();

  function fillUpgrades() {
    const sel = document.getElementById("dev-up"); if (!sel) return;
    const keep = sel.value;
    const list = (window.UPGRADES || []).slice().sort((a, b) => a.name.localeCompare(b.name));
    const ok = u => { try { return inRun() && (!u.when || u.when(stats)); } catch (e) { return false; } };
    sel.innerHTML = '<option value="">Give an upgrade...</option>' + list.map(u =>
      `<option value="${u.id}"${ok(u) ? "" : " disabled"}>${u.name}${u.isEvolution ? " (evolution)" : ""}</option>`).join("");
    if (keep) sel.value = keep;
  }

  function render() {
    const g = document.getElementById("dev-god"); if (g) g.setAttribute("aria-pressed", DEV.god ? "true" : "false");
    const n = document.getElementById("dev-nav"); if (n) n.setAttribute("aria-pressed", window.NAV && NAV.debug ? "true" : "false");
  }

  function build() {
    const css = document.createElement("style");
    css.textContent = `
      #dev-chip{position:fixed;left:8px;bottom:8px;z-index:9000;font:12px Silkscreen,monospace;background:#C45C4B;color:#FFF0CF;border:2px solid #171C35;border-radius:4px;padding:6px 10px;min-height:32px;cursor:pointer;box-shadow:0 3px 0 #171C35}
      #dev-panel{position:fixed;left:8px;bottom:52px;z-index:9000;width:min(300px,calc(100vw - 16px));max-height:calc(100dvh - 70px);overflow:auto;background:#171C35;color:#FFF0CF;border:3px solid #C45C4B;border-radius:8px;box-shadow:0 6px 0 rgba(0,0,0,.4);font:14px "Atkinson Hyperlegible",system-ui,sans-serif;display:none}
      #dev-panel.open{display:block}
      #dev-panel h2{margin:0;padding:8px 12px;background:#F2D7A1;color:#171C35;font:13px Silkscreen,monospace;letter-spacing:.05em;display:flex;justify-content:space-between}
      #dev-panel section{padding:8px 12px;border-bottom:1px solid #303750}
      #dev-panel .lbl{font:11px Silkscreen,monospace;color:#B8C0D4;margin-bottom:6px}
      #dev-panel .row{display:flex;flex-wrap:wrap;gap:6px}
      #dev-panel button{font:12px Silkscreen,monospace;background:transparent;color:#FFF0CF;border:2px solid #3E7775;border-radius:4px;padding:6px 8px;min-height:36px;cursor:pointer}
      #dev-panel button:hover{background:#3E7775}
      #dev-panel button[aria-pressed=true]{background:#EF9347;border-color:#EF9347;color:#171C35}
      #dev-panel select{flex:1;min-width:0;font:14px "Atkinson Hyperlegible",sans-serif;background:#1f2640;color:#FFF0CF;border:2px solid #3E7775;border-radius:4px;min-height:36px}
      #dev-panel .note{font-size:12px;color:#B8C0D4;padding:8px 12px;line-height:1.35}
      #dev-toast{position:fixed;left:64px;bottom:10px;z-index:9001;font:13px Silkscreen,monospace;background:#171C35;color:#FFF0CF;border:2px solid #C45C4B;border-radius:4px;padding:6px 12px;opacity:0;transition:opacity .2s;pointer-events:none}
      #dev-toast.show{opacity:1}`;
    document.head.appendChild(css);
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <button id="dev-chip" type="button" aria-expanded="false" aria-controls="dev-panel">DEV MODE <span style="opacity:.85">· SCORES OFF</span></button>
      <div id="dev-panel" role="dialog" aria-label="Dev console">
        <h2><span>DEV CONSOLE</span><span>\` to close</span></h2>
        <section><div class="lbl">PLAYER</div><div class="row">
          <button id="dev-god" type="button" aria-pressed="false" data-a="god">GOD MODE</button>
          <button type="button" data-a="heal">FULL HP</button>
          <button type="button" data-a="hp5">+5 MAX HP</button>
          <button type="button" data-a="level">LEVEL UP</button>
          <button type="button" data-a="salad">DROP SALAD</button>
          <button type="button" data-a="intern">SEND INTERN</button>
          <button type="button" data-a="lounge">OPEN LOUNGE</button></div></section>
        <section><div class="lbl">GIVE</div><div class="row">
          <select id="dev-up" aria-label="Upgrade to give"></select>
          <button type="button" data-a="give">GIVE</button></div></section>
        <section><div class="lbl">JUMP TO AGE</div><div class="row">
          ${[45, 50, 52, 55, 60, 64].map(a => `<button type="button" data-age="${a}">${a}</button>`).join("")}</div></section>
        <section><div class="lbl">BOSSES AND ENEMIES</div><div class="row">
          <button type="button" data-boss="performanceReview">REVIEW</button>
          <button type="button" data-boss="mortgageRefinance">MORTGAGE</button>
          <button type="button" data-boss="midlifeCrisis">V8</button>
          <button type="button" data-a="clear">CLEAR SCREEN</button></div></section>
        <section><div class="lbl">AGE 50+ MODIFIER</div><div class="row">
          <select id="dev-mod" aria-label="Modifier to start"></select>
          <button type="button" data-a="modGo">START</button>
          <button type="button" data-a="modStop">STOP</button></div></section>
        <section><div class="lbl">PATHING</div><div class="row">
          <button id="dev-nav" type="button" aria-pressed="false" data-a="nav">ROUTE ARROWS</button></div></section>
        <div class="note">Dev mode: scores don't post, stats aren't sent, achievements stay locked. Add ?dev=0 to the address to turn it off.</div>
      </div>
      <div id="dev-toast" role="status" aria-live="polite"></div>`;
    document.body.appendChild(wrap);
    const panel = document.getElementById("dev-panel"), chip = document.getElementById("dev-chip");
    const toggle = () => {
      const open = panel.classList.toggle("open");
      chip.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { fillUpgrades(); render(); const ms = document.getElementById("dev-mod"); if (ms && !ms.options.length) ms.innerHTML = (window.RUN_MODIFIER_DEFS || []).map(m => `<option value="${m.id}">${m.title}</option>`).join(""); }
    };
    chip.addEventListener("click", toggle);
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.a === "give") return give();
      if (b.dataset.a && ACTIONS[b.dataset.a]) return ACTIONS[b.dataset.a]();
      if (b.dataset.age) return jumpTo(+b.dataset.age)();
      if (b.dataset.boss) return boss(b.dataset.boss)();
    });
    // Keep keys typed in the panel (like the arrow keys in the dropdown) away from the game.
    panel.addEventListener("keydown", (e) => { if (e.key !== "`") e.stopPropagation(); });
    window.addEventListener("keydown", (e) => {
      if (e.key === "`" || e.code === "Backquote") { e.preventDefault(); toggle(); }
    }, true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
