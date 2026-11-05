// Midlife Survivors
// A square you can move around, and Bills that come for you.

const WORLD_SIZE = 4000; // no longer a wall: the floor is endless now (kept for reference)

const config = {
  type: Phaser.AUTO,
  parent: "game",
  transparent: !!window.ENABLE_3D_VIEWS, // see-through only for the parked 3D overlay; an opaque canvas is cheaper to composite (Fable review #5)
  scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
  physics: { default: "arcade" },
  fps: { limit: 70 }, // 120 Hz iPads and monitors would run all game logic twice as often; this caps them near 60. (70, not 60, so 60 Hz screens never skip a frame.) Nov 2
  input: { gamepad: true }, // listen for game controllers (Xbox, PlayStation, Switch Pro, etc.)
  scene: { create, update }
};

// ---- Game controller helpers (Direct HTML5 Gamepad API + Phaser fallback) ----
// Reads directly from navigator.getGamepads() so Xbox, PlayStation, Switch Pro, and Bluetooth
// controllers work reliably even when clicking HTML UI buttons, and supports live button rebinding!
let padPrev = {}, padNow = {}, padHoldDir = null, padNextRepeatMs = 0;
function readPad(scene) {
  padPrev = padNow;
  const c = (typeof meta !== "undefined" && meta && meta.controls) ? meta.controls : (window.DEFAULT_CONTROLS || {});
  const deadzone = Number(c.padDeadzone || 0.22);

  let gp = null;
  if (navigator.getGamepads) {
    const list = navigator.getGamepads();
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].connected) { gp = list[i]; break; }
    }
    if (gp && !window._padUsedThisRun && ((gp.buttons || []).some(b => b && b.pressed) || (gp.axes || []).some(a => Math.abs(a) > 0.5))) window._padUsedThisRun = true; // counts toward Plugged In
  }
  if (!gp) {
    const pPad = scene && scene.input && scene.input.gamepad && scene.input.gamepad.total
      ? scene.input.gamepad.getPad(0) : null;
    if (!pPad) {
      padNow = {};
      if (window.setGamepadConnectedUI) window.setGamepadConnectedUI(false);
      return;
    }
    const sx = pPad.leftStick ? pPad.leftStick.x : 0;
    const sy = pPad.leftStick ? pPad.leftStick.y : 0;
    const pBtn = idx => !!(pPad.buttons && pPad.buttons[idx] && pPad.buttons[idx].pressed);
    const rawBtns = [];
    for (let b = 0; b < 16; b++) rawBtns[b] = pBtn(b);
    padNow = {
      connected: true,
      rawBtns,
      x: Math.abs(sx) > deadzone ? sx : 0,
      y: Math.abs(sy) > deadzone ? sy : 0,
      left: pPad.left || sx < -0.55,
      right: pPad.right || sx > 0.55,
      up: pPad.up || sy < -0.55,
      down: pPad.down || sy > 0.55,
      a: pBtn(c.padConfirmBtn !== undefined ? c.padConfirmBtn : 0),
      b: pBtn(1),
      xBtn: pBtn(c.padMuteBtn !== undefined ? c.padMuteBtn : 2),
      yBtn: pBtn(c.padViewBtn !== undefined ? c.padViewBtn : 3),
      start: pBtn(c.padPauseBtn !== undefined ? c.padPauseBtn : 9) || pBtn(8)
    };
    if (window.setGamepadConnectedUI) window.setGamepadConnectedUI(true);
    return;
  }

  if (window.setGamepadConnectedUI) window.setGamepadConnectedUI(true);
  const btn = idx => !!(gp.buttons && gp.buttons[idx] && (gp.buttons[idx].pressed || gp.buttons[idx].value > 0.5));
  const rawBtns = [];
  for (let b = 0; b < 16; b++) rawBtns[b] = btn(b);

  // Live Controller Button Rebinding inside the Input & Controls Modal!
  if (window.rebindState && window.rebindState.type === "pad") {
    for (let b = 0; b < 12; b++) {
      if (rawBtns[b] && !(padPrev.rawBtns && padPrev.rawBtns[b])) {
        const sel = window.rebindState.selector;
        if (meta && meta.controls) {
          meta.controls[window.rebindState.field] = b;
          saveMeta(meta);
        }
        window.rebindState = null;
        unlockAudio();
        sfx("pick");
        if (typeof renderControlsModal === "function") renderControlsModal(scene, sel);
        padNow = { connected: true, rawBtns };
        return;
      }
    }
  }

  const ax0 = (gp.axes && gp.axes[0]) || 0;
  const ax1 = (gp.axes && gp.axes[1]) || 0;
  const ax2 = (gp.axes && gp.axes[2]) || 0;
  const ax3 = (gp.axes && gp.axes[3]) || 0;
  const sx = Math.abs(ax0) >= Math.abs(ax2) ? ax0 : ax2;
  const sy = Math.abs(ax1) >= Math.abs(ax3) ? ax1 : ax3;

  padNow = {
    connected: true,
    rawBtns,
    x: Math.abs(sx) > deadzone ? sx : 0,
    y: Math.abs(sy) > deadzone ? sy : 0,
    up:    btn(12) || sy < -0.55,
    down:  btn(13) || sy >  0.55,
    left:  btn(14) || sx < -0.55,
    right: btn(15) || sx >  0.55,
    a:     btn(c.padConfirmBtn !== undefined ? c.padConfirmBtn : 0),
    b:     btn(1),
    xBtn:  btn(c.padMuteBtn !== undefined ? c.padMuteBtn : 2),
    yBtn:  btn(c.padViewBtn !== undefined ? c.padViewBtn : 3),
    start: btn(c.padPauseBtn !== undefined ? c.padPauseBtn : 9) || btn(8)
  };
  if (padNow.a || padNow.b || padNow.xBtn || padNow.yBtn || padNow.start) unlockAudio();
}
const padJust = name => !!(padNow[name] && !padPrev[name]);

// Returns "up" | "down" | "left" | "right" | null for menu navigation (with auto-repeat when held).
function getPadMenuStep(nowMs) {
  const curDir = padNow.up ? "up" : (padNow.down ? "down" : (padNow.left ? "left" : (padNow.right ? "right" : null)));
  if (!curDir) {
    padHoldDir = null;
    return null;
  }
  if (curDir !== padHoldDir) {
    padHoldDir = curDir;
    padNextRepeatMs = nowMs + 280;
    return curDir;
  }
  if (nowMs >= padNextRepeatMs) {
    padNextRepeatMs = nowMs + 165;
    return curDir;
  }
  return null;
}

let player, label, keys, cursors, bills, splashes, floor, stageProps, gems, coins, chests, hudText, viewBtn;
let xp = 0, level = 1, xpNeeded = 0, xpBar, levelText, currentAge = 40, bossesSpawned = {}, slowUntil = 0;
let meta, runCoins = 0, runKills = 0, runHits = 0, runDamageTaken = 0; // runKills feeds the leaderboard score
// "stats" is this run's copy of the numbers. Upgrades change the copy, never the data files,
// so every new run starts fresh.
let stats, spawnTimer, currentWaveIdx = 0, fireTimer, jokeTimer, noTimer, levelUpOpen = false, paused = false, pauseParts = [], pendingLevels = 0, levelMenu = null, restartGame = null;
let titleSeen = false, titleOpen = false, startFromTitle = null;
let ltDecadeShown = null, ltLowHpWarned = false; // lower third trackers
let nextSwarmAt = null; // when the next swarm event fires (game time)
let strayRescues = 0;   // enemies put back on the floor after getting stuck off it (see the stray check)
window.getStrayRescues = () => strayRescues;
let pings = null;       // Group Chat message pings
let hp, lastHurt = -Infinity, hpBar, gameOver = false, startTime = 0;
let saladDry = 0;
let runElapsedMs = 0, runStartAge = 40, lastAutoSave = 0, retire80Open = false, retire80Prompted = false, currentStageId = "office", lastDividendAge = 40;
let touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0, isTouch: false, curX: 0, curY: 0 };
let mouseState = { leftDown: false, rightDown: false, x: 0, y: 0, activeCursor: false, overUI: false };
window._heldKeys = window._heldKeys || new Set();
let lastWheelMs = 0;

// ---------- Dynamic intensity (INTENSITY.dynamic in src/data/swarms.js) ----------
let dyn = { lastHitAt: 0, comfortUntil: 0, mercyUntil: 0 };
function updateDynamicIntensity() {
  const D = window.INTENSITY && INTENSITY.dynamic;
  if (!D || runElapsedMs < D.armAfterMs || !stats) return;
  if (hp / stats.maxHp < D.mercyHpFrac) { dyn.mercyUntil = runElapsedMs + D.mercyDurationMs; dyn.comfortUntil = 0; return; }
  if (window.Modifiers && Modifiers.active()) return; // a modifier is already making life interesting: no Comfort Zone Tax on top
  if (bossesSpawned.theReaper || currentAge >= modeEndAge() - 0.3) return; // the run is wrapping up: no tax at the finish line (Fable review)
  if (runElapsedMs >= dyn.comfortUntil && runElapsedMs > dyn.mercyUntil && runElapsedMs - Math.max(dyn.lastHitAt, D.armAfterMs - D.noHitBonusAfterMs) > D.noHitBonusAfterMs) {
    dyn.comfortUntil = runElapsedMs + D.bonusDurationMs;
    dyn.lastHitAt = runElapsedMs + D.bonusDurationMs; // the next tax needs another 45 s of no hits after this one
    if (window.showLowerThird) window.showLowerThird("alert", "COMFORT ZONE TAX", "Too comfortable. More of everything for 20 seconds.", 4000, "MORE ENEMIES · 20s");
  }
}
// Start every run with clean controls: nothing "stuck" from menus, the name box or a previous run.
// (Playtest report: no control input after visiting the 401(k) Shop and returning to the game.)
// iPhone bug (Ben M, iPhone 13 Safari): tapping a menu button that gets replaced (Shop, Back) sends the finger-lift
// to the removed button, so Phaser never hears it and keeps that touch "held" forever. With its touch slots full,
// the game ignores every new touch. This frees any Phaser touch slot whose finger isn't really on the glass.
function releaseStaleTouches(liveIds) {
  const mgr = window.game && window.game.input;
  if (!mgr || !mgr.pointers) return;
  for (const ptr of mgr.pointers) {
    if (ptr.id === 0 || !ptr.active) continue; // slot 0 is the mouse
    if (liveIds && liveIds.has(ptr.identifier)) continue;
    ptr.active = false; ptr.isDown = false; ptr.primaryDown = false; ptr.buttons = 0; ptr.identifier = 0;
  }
}
// Every new touch: anything Phaser thinks is held that the browser doesn't list as touching is stale.
window.addEventListener("touchstart", e => {
  const live = new Set();
  for (const t of e.touches) if (!Array.from(e.changedTouches).some(c => c.identifier === t.identifier)) live.add(t.identifier);
  releaseStaleTouches(live);
}, { capture: true, passive: true });
// How far to zoom the camera: aim to show about VIEW.targetShortSide pixels of office across the short side of the
// screen, in quarter steps. 720p laptop = 1x, 1080p = 1.5x, 1440p = 2.25x, 4K = 3.25x.
// Phones may zoom out to minZoom so they see more of the office (Grok, Nov 3: phone runs ended ~10 years earlier;
// at 1x a phone only showed about 390 px of floor). If things look too tiny, raise minZoom to 0.85.
const VIEW = { targetShortSide: 640, maxZoom: 4, minZoom: 0.75 };
function viewZoomFor(w, h) {
  const z = Math.floor((Math.min(w, h) / VIEW.targetShortSide) * 4) / 4;
  return Math.max(VIEW.minZoom, Math.min(VIEW.maxZoom, z));
}
window.viewZoomFor = viewZoomFor;
function resetInputState(scene) {
  releaseStaleTouches(null);
  try { const a = document.activeElement; if (a && a !== document.body && a.blur) a.blur(); } catch (e) {}
  window._heldKeys.clear();
  window.menuHeldAtOpen = new Set();
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0, isTouch: false, curX: 0, curY: 0 };
  mouseState.leftDown = false; mouseState.rightDown = false;
  if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
  if (scene && scene.input) {
    scene.input.enabled = true;
    if (scene.input.keyboard) { scene.input.keyboard.enabled = true; scene.input.keyboard.resetKeys(); }
  }
  window._activeGameScene = scene || window._activeGameScene;
}
const dynPackAdd = () => (runElapsedMs < dyn.comfortUntil ? ((INTENSITY.dynamic || {}).bonusPackAdd || 0) : 0);
const dynSpawnMult = () => (runElapsedMs < dyn.mercyUntil ? ((INTENSITY.dynamic || {}).mercySpawnSlow || 1) : 1);

// ---------- Tax Bracket (src/data/heat.js): locked in when the run starts ----------
let runTaxBracket = 0;
let runSprint = false; // Sprint (src/data/modes.js): set when a run starts, kept on resume
function tax(key) { return runTaxBracket * ((window.TAX_BRACKET && TAX_BRACKET.perLevel[key]) || 0); }
// Every heal goes through here so the Tax Bracket can trim it (fractions round randomly so small heals still matter).
function healAmt(n) {
  const v = n * Math.max(0.4, 1 - tax("healEfficacy"));
  return Math.floor(v) + (Math.random() < v - Math.floor(v) ? 1 : 0);
}
window.getRunTaxBracket = () => runTaxBracket;

// ---------- Run modes (src/data/modes.js) ----------
let runMode = "midlife";
function modeCfg() { return RUN_MODES[runMode] || RUN_MODES.midlife; }
function pickRunMode() { return (meta.runMode === "full" && isFullLifeUnlocked(meta)) ? "full" : "midlife"; }
function modeStartAge() { return modeCfg().startAge || meta.startDecade || PLAYER.startingAge; }
// When the run ends: Midlife ends at 65 plus any Overtime bought in the shop; Full Life at 100.
function modeEndAge() {
  const m = modeCfg();
  if (m.id !== "midlife") return m.endAge;
  return m.endAge + ((meta.ranks && meta.ranks.delayedRetirement) || 0) * m.overtimeYearsPerRank;
}
window.getRunMode = () => runMode;
function secsPerYear() { return modeCfg().secondsPerYear / (runSprint && window.SPRINT ? SPRINT.yearsMult : 1); } // Sprint makes the years fly
window.secsPerYear = secsPerYear;
window.isSprintRun = () => runSprint;
window.getRunEndMs = () => (modeEndAge() - runStartAge) * secsPerYear() * 1000; // when the ending arrives, in run time
window.refreshRunMode = () => { runMode = pickRunMode(); runStartAge = modeStartAge(); currentAge = runStartAge; };

// Calculate current 401(k) Coin value & drop chance based on how long you have survived and your Age!
window.getCoinYieldInfo = function() {
  const C = (typeof PICKUPS !== "undefined" && PICKUPS.coin401k) ? PICKUPS.coin401k : { value: 1, dropChance: 0.55 };
  const secs = (runElapsedMs || 0) / 1000;
  const age = currentAge || 40;
  let val = C.value || 1;
  let label = "1x MATCH";
  const tiers = C.compoundTiers || [];
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (age >= t.minAge) { // by age only (seconds made coins pile up too fast early on)
      val = t.value;
      label = t.label;
    }
  }
  // Extra endurance bonus if you survive more than 3.5 minutes in a single continuous run
  const streakBonus = 0; // removed Oct 31: it made long runs pay out too much
  val += streakBonus;
  const dropChance = C.dropChance || 0.06; // flat: coins track time survived, not kill count
  return { value: val, label: streakBonus > 0 ? `${val}x COMPOUND` : label, dropChance };
};

function spawnCoin(x, y, bonusMult = 1) {
  if (!coins) return null;
  const c = coins.create(x, y, "coin401k").setDepth(3);
  c.bonusMult = bonusMult;
  c.dieAt = runElapsedMs + ((window.FLOOR_LIMITS && FLOOR_LIMITS.coinLifeMs) || 60000);
  const yld = window.getCoinYieldInfo().value * bonusMult;
  if (bonusMult >= 2 || yld >= 4) {
    c.setScale(1.22);
    c.setTint(0xffdf4f);
  } else if (yld >= 2) {
    c.setScale(1.1);
  }
  return c;
}

// create() runs ONCE when the game starts: build the world.
function create() {
  // Fresh start (this also runs again when you press "Try again").
  gameOver = false; lastHurt = -Infinity; startTime = this.time.now; window.clockingOut = false;
  runElapsedMs = 0; window.lastBossDownMs = null; if (window.BonusChest && BonusChest.abandon) BonusChest.abandon(); if (window.Remains) Remains.reset(); if (window.BossDown) BossDown.reset(); if (this.physics && this.physics.world) this.physics.world.timeScale = 1; lastAutoSave = 0; retire80Open = false; retire80Prompted = false;
  saladDry = 0; // elites since the last Desk Salad (pity counter)
  if (window.Interns) Interns.reset(); // interns start fresh each run
  if (window.CatchMoment) CatchMoment.clear(); // no GOTCHA card (or slow motion) carried into a new run
  if (window.Lounge) Lounge.reset();   // the Break Room counter (src/lounge.js)
  if (window.Modifiers) Modifiers.reset(); // age 50+ run modifiers (src/modifiers.js)
  meta = loadMeta();
  runMode = pickRunMode();
  runTaxBracket = meta.taxBracket || 0;
  runSprint = !!(meta.sprint && window.isSprintUnlocked && isSprintUnlocked(meta));
  runStartAge = modeStartAge();
  currentAge = runStartAge; lastDividendAge = Math.floor(runStartAge / 5) * 5;
  this._dmgPool = []; this._dmgFrame = -1; // damage-number pool: the last run's objects are gone after a restart
  if (window.Spotlight && Spotlight.newRun) Spotlight.newRun(); // Quick Retry too: no cards or tip counts carried over from the last run (Fable review)
  bossesSpawned = {}; slowUntil = 0; currentWaveIdx = 0; window.goldWatchBeat = false; window.goldWatchSeen = false;
  paused = false; pauseParts = [];
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0, isTouch: false, curX: 0, curY: 0 };
  mouseState = { leftDown: false, rightDown: false, x: window.innerWidth / 2, y: window.innerHeight / 2, activeCursor: false, overUI: false };
  window._heldKeys.clear();
  levelUpOpen = false; pendingLevels = 0; levelMenu = null; restartGame = null;
  if (window.Promotions) Promotions.reset();
  if (window.Minimap) Minimap.reset();     // the office map: fog resets each run (src/minimap.js)
  runCoins = 0; runKills = 0; runHits = 0; runDamageTaken = 0; lastJokeToldAt = 0;
  buffs = { speedUntil: 0, speedMult: 1, damageUntil: 0, damageMult: 1, vacuumUntil: 0, xpUntil: 0, xpMult: 1 };
  shield = { hits: 0, until: 0, flashAt: -1e9, ring: null };
  runAch = { bills: 0, kinds: {}, newly: [], lastAge: 40 };
  window._padUsedThisRun = false;
  // Devlog memos finished in this browser (the devlog saves them under "devlog-read"): Required Reading achievement.
  try { const readN = JSON.parse(localStorage.getItem("devlog-read") || "[]").length; if (readN) setTimeout(() => window.achEvent("devlog", { read: readN }), 1500); } catch (e) {}
  dyn = { lastHitAt: 0, comfortUntil: 0, mercyUntil: 0 };
  coinFrac = 0; xpFrac = 0;
  if (window.NearMiss) window.NearMiss.reset(); // Close Call streak starts fresh every run
  stats = {
    speed: PLAYER.speed, maxHp: PLAYER.maxHp, cooldownMult: 1,
    fireEveryMs: WEAPONS.coffeeSplash.fireEveryMs, damage: WEAPONS.coffeeSplash.damage,
    range: WEAPONS.coffeeSplash.range, magnetRadius: PICKUPS.wisdomGem.magnetRadius,
    dadJoke: false, jokeEveryMs: WEAPONS.dadJoke.fireEveryMs, jokeRadius: WEAPONS.dadJoke.radius, jokeDamage: WEAPONS.dadJoke.damage,
    wordNo: false, noEveryMs: WEAPONS.wordNo.fireEveryMs, noRadius: WEAPONS.wordNo.radius, noDamage: WEAPONS.wordNo.damage, noPush: WEAPONS.wordNo.pushPx,
    // New weapon types (src/weapons_extra.js)
    remote: false, remoteEveryMs: WEAPONS.remote.fireEveryMs, remoteRange: WEAPONS.remote.range, remoteDamage: WEAPONS.remote.damage, remoteCount: 1,
    sheet: false, sheetCount: WEAPONS.spreadsheet.count, sheetRadius: WEAPONS.spreadsheet.radius, sheetDamage: WEAPONS.spreadsheet.damage,
    podcast: false, podEveryMs: WEAPONS.podcast.fireEveryMs, podDamage: WEAPONS.podcast.damage, podPierce: WEAPONS.podcast.pierce
  };
  applyMetaAndChar();
  // 1. Build pixel-art sprites for every character, enemy, pickup, and the background floor (in src/sprites.js).
  buildSprites(this);
  if (window.Breakables) Breakables.preload(this); // smashable prop art (assets/breakables)
  if (window.BossArt) BossArt.preload(this);       // big boss art (assets/bosses)
  if (window.Remains && Remains.preload) Remains.preload(this);   // floor debris (assets/enemies/remains-v1.png)
  if (window.BossDown && BossDown.preload) BossDown.preload(this); // knockdown poses and the stamp plate
  if (window.GoldWatch) GoldWatch.preload(this);   // the Gold Watch's hands and gears
  if (window.Interns && Interns.preload) Interns.preload(this); // TJ and Derek (assets/characters/intern-*.png)
  EnemyArt.init(this, () => runElapsedMs);
  buildWeaponSprites(this); // TV Remote, Spreadsheet cells, Podcast waves
  initExtraWeapons(this);
  if (window.ArtSheets) ArtSheets.load(this, "field_items", "assets/items/field-items-v1.png", 32, 32); // Fanny Pack, Energy Drink, PTO Day (row 1: shine)
  if (window.MoreWeapons) MoreWeapons.init(this); // casserole, headphones, chair, reply-all, out-of-office, sticky notes, thermostat

  // 2. The stage: an open-plan office floor (carpet, wood hallway, breakroom rug) plus scattered office props!
  floor = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "floor")
    .setOrigin(0).setScrollFactor(0);
  const fitFloor = size => floor.setSize(size.width, size.height);
  this.scale.on("resize", fitFloor);
  this.events.once("shutdown", () => this.scale.off("resize", fitFloor)); // one listener per run, not one more per Retry (Fable review)
  stageProps = spawnStageProps(this);

  // 3. The player. No walls anymore: the world goes on forever.
  player = this.physics.add.sprite(0, 0, "player").setDepth(5);
  label = this.add.text(0, 0, `${PLAYER.name} (${PLAYER.startingAge})`, {
    fontFamily: "monospace", fontSize: "14px", color: "#e8e9f3"
  }).setOrigin(0.5, 1).setDepth(6);

  // 3b. Clean screen HUD: a small HP bar that rides under the player (Vampire Survivors style),
  //     redrawn after every frame. The top HUD (age, XP) also refreshes here about 10x a second.
  const hpBar = this.add.graphics().setDepth(7);
  WorldArt.init(this, {player, floor, props:stageProps, label, hpBar, clock:()=>runElapsedMs, enemies:()=>bills});
  if (window.Lighting) Lighting.init(this, { player, chests: () => chests, age: () => currentAge, clock: () => runElapsedMs }); // src/lighting.js
  if (window.YellowNote) YellowNote.init(this); // the rack with the yellow note (src/yellow-note.js)
  ltDecadeShown = null; ltLowHpWarned = false; nextSwarmAt = null;
  let hudTick = 0;
  const onPostUpdate = (t, dt) => {
    hpBar.clear();
    const vsHud = document.getElementById("vs-hud");
    if (vsHud) vsHud.classList.toggle("hidden", !!(titleOpen || gameOver)); // no HUD peeking behind title or Game Over
    { const playing = !titleOpen && !gameOver && !paused; // the universal nav hides during a run (level-ups and chests included)
      if (playing !== window._msPlaying) { window._msPlaying = playing; document.documentElement.classList.toggle("ms-playing", playing); } }
    if (!player || !stats || titleOpen) return;
    // Health bar under the hero, drawn like the shared ms-bar (navy frame, teal ring, bevel, pixel segments).
    const w = 52, h = 8;
    const x = Math.round(player.x - w / 2), y = Math.round(player.y + player.displayHeight / 2 + 4);
    const pct = Phaser.Math.Clamp(hp / stats.maxHp, 0, 1);
    const low = pct <= 0.35, pulse = low ? 0.55 + 0.45 * Math.sin(runElapsedMs / 110) : 1;
    hpBar.fillStyle(0x3E7775, 0.95).fillRect(x - 3, y - 3, w + 6, h + 6);   // teal ring
    hpBar.fillStyle(0x171C35, 1).fillRect(x - 2, y - 2, w + 4, h + 4);      // navy frame
    hpBar.fillStyle(0x0d1124, 1).fillRect(x, y, w, h);                      // track
    const fw = Math.round(w * pct);
    if (fw > 0) {
      hpBar.fillStyle(0xC45C4B, pulse).fillRect(x, y, fw, h);                // fill
      hpBar.fillStyle(0xEF9347, pulse).fillRect(x + Math.max(0, fw - Math.min(fw, 10)), y, Math.min(fw, 10), h); // warm leading edge
      hpBar.fillStyle(0xFFF0CF, 0.45 * pulse).fillRect(x, y, fw, 2);         // bevel highlight
      hpBar.fillStyle(0x000000, 0.2).fillRect(x, y + h - 2, fw, 2);          // bevel shade
    }
    hpBar.fillStyle(0x171C35, 0.6);
    for (let sx = x + 10; sx < x + w; sx += 10) hpBar.fillRect(sx, y, 2, h);  // pixel segments
    // Lower third triggers (cheap checks, every frame)
    if (!gameOver && window.showLowerThird) {
      if (runElapsedMs > 1500) window.firstTimeTip("start");
      if (runElapsedMs > 25000) window.firstTimeTip("plant");
      const decade = Math.floor(currentAge / 10) * 10;
      if (ltDecadeShown === null) ltDecadeShown = decade;
      if (decade > ltDecadeShown) {
        ltDecadeShown = decade;
        const line = window.CHAPTER_CARDS && window.CHAPTER_CARDS[decade];
        if (line) window.showLowerThird("chapter", `AGE ${decade}`, line, 5000);
      }
      const hpPct = hp / stats.maxHp;
      if (hpPct <= 0.3 && !ltLowHpWarned) { ltLowHpWarned = true; if (!(window.Spotlight && Spotlight.tip("lowHp"))) window.showLowerThird("alert", "LOW HP", (window.ALERTS && window.ALERTS.lowHp) || "Low health!", 4000); }
      if (hpPct > 0.6) ltLowHpWarned = false;
    }
    hudTick += dt;
    if (hudTick > 100 && typeof updateCleanHUD === "function") { hudTick = 0; updateCleanHUD(); }
  };
  this.events.on("postupdate", onPostUpdate);
  this.events.once("shutdown", () => this.events.off("postupdate", onPostUpdate)); // no duplicates after a restart

  // 4. The camera follows the player, like a photographer tracking a subject.
  this.cameras.main.startFollow(player, true, 0.12, 0.12);
  // Big screens zoom in so the office and sprites aren't tiny (Rami on a 4K monitor). Phones and laptops stay at 1x.
  // Zooming the browser shrinks the page, so this adjusts itself instead of doubling up.
  const fitZoom = () => this.cameras.main.setZoom(viewZoomFor(this.scale.width, this.scale.height));
  fitZoom();
  this.scale.on("resize", fitZoom);
  this.events.once("shutdown", () => this.scale.off("resize", fitZoom));

  // 5. Initialize the Chameleon + Corporate Satire HTML/CSS UI overlay (in src/ui.js).
  initGameUI(this);
  hideAllModals();

  // 6. Controls: Full Keyboard, Mouse, Touch & Video Game Controller Mapping + Live Rebinding!
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys("W,A,S,D");
  window._activeGameScene = this;
  if (!window._globalKeyBound) {
    window._globalKeyBound = true;

    window.addEventListener("keyup", e => {
      window._heldKeys.delete(e.code);
      if (window.menuHeldAtOpen) window.menuHeldAtOpen.delete(e.code); // released, so the next press can steer the menu
    });
    window.addEventListener("blur", () => {
      window._heldKeys.clear();
      mouseState.leftDown = false;
      mouseState.rightDown = false;
    });

    // Mouse Right-Click (contextmenu) handler for Pause, Move, or Switch View
    window.addEventListener("contextmenu", e => {
      e.preventDefault();
      const sc = window._activeGameScene;
      if (!sc) return;
      unlockAudio();
      const c = (meta && meta.controls) ? meta.controls : (window.DEFAULT_CONTROLS || {});
      if (window.loreModalOpen) {
        sfx("pick");
        closeLoreModal(sc);
        return;
      }
      if (window.changelogModalOpen) {
        sfx("pick");
        closeChangelogModal(sc);
        return;
      }
      if (window.controlsModalOpen) {
        sfx("pick");
        closeControlsModal(sc);
        return;
      }
      if (paused) {
        sfx("pick");
        togglePause(sc);
        return;
      }
      if (gameOver || levelUpOpen || titleOpen || retire80Open) return;
      if (c.mouseRightClick === "pause") {
        togglePause(sc);
      } else if (c.mouseRightClick === "view") {
        cycleViewMode(sc);
        sfx("pick");
      }
    });

    // Mouse Wheel handler: navigates open menus OR cycles Visual Engine in gameplay
    window.addEventListener("wheel", e => {
      const sc = window._activeGameScene;
      if (!sc) return;
      const now = performance.now();
      if (now - lastWheelMs < 220) return;
      const activeModal = window.menuNav && window.menuNav.getActiveModal();
      if (activeModal) {
        // If the menu is taller than the window, the wheel (or a trackpad swipe) just scrolls it.
        // Nov 4: on a short Safari window each tick also jumped the menu focus, which yanked the page back down.
        for (let el = e.target; el && el !== document.body; el = el.parentElement) {
          if (el.scrollHeight > el.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) return;
          if (el === activeModal) break;
        }
        lastWheelMs = now;
        window.menuNav.move(e.deltaY > 0 ? "down" : "up");
        return;
      }
      const c = (meta && meta.controls) ? meta.controls : (window.DEFAULT_CONTROLS || {});
      if (c.mouseWheelView !== false && !gameOver && !paused && !titleOpen && !levelUpOpen && !retire80Open) {
        lastWheelMs = now;
        unlockAudio();
        cycleViewMode(sc);
        sfx("pick");
      }
    }, { passive: true });

    // Track mouse button up/move globally so dragging outside canvas never sticks
    window.addEventListener("pointermove", e => {
      if (e.pointerType === "mouse") {
        mouseState.x = e.clientX;
        mouseState.y = e.clientY;
        mouseState.activeCursor = true;
        const tgt = e.target;
        mouseState.overUI = !!(tgt && tgt.closest && (tgt.closest(".hud-pod") || tgt.closest(".mobile-dock") || tgt.closest(".ui-modal")));
      }
    });
    window.addEventListener("pointerup", e => {
      if (e.pointerType === "mouse") {
        if (e.button === 0) mouseState.leftDown = false;
        if (e.button === 2) mouseState.rightDown = false;
      }
    });

    window.addEventListener("keydown", e => {
      const sc = window._activeGameScene;
      if (!sc) return;
      const code = e.code;
      window._heldKeys.add(code);
      const c = (meta && meta.controls) ? meta.controls : (window.DEFAULT_CONTROLS || {});

      // 1. Live Interactive Key Rebinding in the Input & Controls Modal!
      if (window.rebindState && window.rebindState.type === "key") {
        e.preventDefault();
        unlockAudio();
        const sel = window.rebindState.selector;
        if (code === "Escape") {
          window.rebindState = null;
          sfx("move");
          renderControlsModal(sc, sel);
          return;
        }
        c[window.rebindState.field] = code;
        saveMeta(meta);
        window.rebindState = null;
        if (typeof syncControlHUDHints === "function") syncControlHUDHints();
        sfx("pick");
        renderControlsModal(sc, sel);
        return;
      }

      const activeModal = window.menuNav && window.menuNav.getActiveModal();

      // 2. Global Style Switch (Default [V]) and Mute (Default [M])
      if (code === (c.keyView || "KeyV")) {
        e.preventDefault();
        unlockAudio();
        cycleViewMode(sc);
        sfx("pick");
        if (window.controlsModalOpen) renderControlsModal(sc);
        else if (titleOpen) renderTitleModal(sc);
        else if (paused) renderPauseModal(sc, 2);
        return;
      }
      if (code === (c.keyMute || "KeyM")) {
        e.preventDefault();
        unlockAudio();
        toggleMute();
        if (typeof syncMuteButtons === "function") syncMuteButtons();
        if (paused && !window.controlsModalOpen) renderPauseModal(sc, 3);
        return;
      }

      // 3. If ANY modal is open (Controls Config, Title, Level-Up, Pause/Options, Age 80, or Game Over):
      if (activeModal) {
        if (levelUpOpen && (performance.now() < (window.menuInputGateUntil || 0) || (window.menuHeldAtOpen && window.menuHeldAtOpen.has(code)))) { e.preventDefault(); return; }
        if (code === "ArrowUp" || code === (c.keyUp || "KeyW")) {
          e.preventDefault(); unlockAudio(); window.menuNav.move("up"); return;
        }
        if (code === "ArrowDown" || code === (c.keyDown || "KeyS")) {
          e.preventDefault(); unlockAudio(); window.menuNav.move("down"); return;
        }
        if (code === "ArrowLeft" || code === (c.keyLeft || "KeyA")) {
          e.preventDefault(); unlockAudio(); window.menuNav.move("left"); return;
        }
        if (code === "ArrowRight" || code === (c.keyRight || "KeyD")) {
          e.preventDefault(); unlockAudio(); window.menuNav.move("right"); return;
        }
        if (code === "Escape") {
          e.preventDefault();
          unlockAudio();
          if (window.loreModalOpen) {
            sfx("pick");
            closeLoreModal(sc);
          } else if (window.changelogModalOpen) {
            sfx("pick");
            closeChangelogModal(sc);
          } else if (window.controlsModalOpen) {
            sfx("pick");
            closeControlsModal(sc);
          } else if (paused) {
            togglePause(sc);
          } else if (titleBackAvailable()) {
            titleBack(); // Shop, Extras, Leaderboard...: Escape goes back to the main title
          }
          return;
        }
        if (code === "Space" || code === "Enter" || code === "NumpadEnter") {
          e.preventDefault(); unlockAudio(); window.menuNav.activate(); return;
        }
        if ((code === "KeyP" || code === (c.keyPause || "Space")) && paused && !window.controlsModalOpen) {
          e.preventDefault(); unlockAudio(); togglePause(sc); return;
        }
        if (levelUpOpen && window.levelMenu && (e.key === "1" || e.key === "2" || e.key === "3")) {
          e.preventDefault();
          unlockAudio();
          const idx = Number(e.key) - 1;
          if (idx < window.levelMenu.count) {
            window.levelMenu.highlight(idx);
            window.menuNav.activate();
          }
          return;
        }
        return;
      }

      // 4. During active gameplay: Custom Pause key, Spacebar, P, or Escape opens Pause & Options!
      if (code === (c.keyPause || "Space") || code === "Space" || code === "KeyP" || code === "Escape") {
        e.preventDefault();
        unlockAudio();
        togglePause(sc);
      }
    }, { passive: false });
  }

  this.input.on("pointerdown", p => {
    if (gameOver || levelUpOpen || paused || titleOpen || retire80Open || window.controlsModalOpen) return;
    const c = (meta && meta.controls) ? meta.controls : (window.DEFAULT_CONTROLS || {});
    const isTouch = !!(p.wasTouch || (p.event && p.event.pointerType === "touch"));

    if (!isTouch) {
      mouseState.x = p.x;
      mouseState.y = p.y;
      const btn = p.event ? p.event.button : 0;
      if (btn === 2) {
        mouseState.rightDown = true;
        return;
      }
      mouseState.leftDown = true;
      if (c.mouseMoveMode === "clickDrag") {
        touch = { active: true, startX: p.x, startY: p.y, dx: 0, dy: 0, isTouch: false, curX: p.x, curY: p.y };
        if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
      }
      return;
    }

    // Touch screen input (`floating`, `fixedLeft`, `fixedRight`, or `directTouch`)
    let startX = p.x, startY = p.y;
    if (c.touchMode === "fixedLeft") {
      startX = 70;
      startY = window.innerHeight - 70;
    } else if (c.touchMode === "fixedRight") {
      startX = window.innerWidth - 70;
      startY = window.innerHeight - 70;
    }
    touch = {
      active: true,
      startX,
      startY,
      dx: (c.touchMode === "fixedLeft" || c.touchMode === "fixedRight") ? (p.x - startX) : 0,
      dy: (c.touchMode === "fixedLeft" || c.touchMode === "fixedRight") ? (p.y - startY) : 0,
      isTouch: true,
      curX: p.x,
      curY: p.y
    };
    if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
  });

  this.input.on("pointermove", p => {
    const isTouch = !!(p.wasTouch || (p.event && p.event.pointerType === "touch"));
    if (!isTouch) {
      mouseState.x = p.x;
      mouseState.y = p.y;
      mouseState.activeCursor = true;
    }
    if (!touch.active) return;
    touch.curX = p.x;
    touch.curY = p.y;
    touch.dx = p.x - touch.startX;
    touch.dy = p.y - touch.startY;
    if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
  });

  this.input.on("pointerup", p => {
    const isTouch = !!(p && (p.wasTouch || (p.event && p.event.pointerType === "touch")));
    if (!isTouch) {
      mouseState.leftDown = false;
      mouseState.rightDown = false;
    }
    touch.active = false; touch.dx = touch.dy = 0;
    if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
    if (window.updatePointerTargetUI) window.updatePointerTargetUI(null);
  });

  // 7. Enemies. A "group" is a bag that holds every Bill so we can move them all at once.
  bills = this.physics.add.group();
  // Bills bump into each other instead of stacking into one blob. That makes a swarm.
  this.physics.add.collider(bills, bills);
  // Office furniture props (desks, plants, watercoolers) are solid physical barriers!
  if (window.propGroup) {
    this.physics.add.collider(player, window.propGroup);
    this.physics.add.collider(bills, window.propGroup);
  }
  updateStageProps(this, stageProps);
  // A timer that calls spawnBill over and over, speeding up as you age through SPAWNING.waves.
  spawnTimer = this.time.addEvent({ delay: SPAWNING.everyMs, loop: true, callback: () => spawnBill(this) });

  // 8. Weapons. Everything fires by itself on a timer. You never press "attack".
  splashes = this.physics.add.group();
  fireTimer = this.time.addEvent({ delay: stats.fireEveryMs, loop: true, callback: () => fireCoffee(this) });
  jokeTimer = this.time.addEvent({ delay: stats.jokeEveryMs, loop: true, callback: () => fireDadJoke(this) });
  noTimer   = this.time.addEvent({ delay: stats.noEveryMs,   loop: true, callback: () => fireWordNo(this) });

  // 9. Collisions. "overlap" asks the physics engine: are these two things touching?
  // If a splash touches a Bill, run hitBill. If a splash touches a Potted Plant, crack it open for loot!
  this.physics.add.overlap(splashes, bills, hitBill);
  // Group Chat message pings (the first enemy that shoots at you)
  pings = this.physics.add.group();
  this.physics.add.overlap(player, pings, (p, ping) => {
    if (!ping.active) return;
    ping.destroy();
    const hpBefore = hp;
    hurtPlayer(p, { kind: "groupChat", damage: ping.damage || 1 });
    if (hp < hpBefore) { // say what hit you
      const t = p.scene.add.text(p.x, p.y - 58, "PING! GROUP CHAT", { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#8ff0a8", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(50002);
      p.scene.tweens.add({ targets: t, y: t.y - 20, alpha: 0, duration: 900, onComplete: () => t.destroy() });
    } if (window.Telemetry && Telemetry.note) Telemetry.note("ping");
  });
  if (window.propGroup) {
    this.physics.add.overlap(splashes, window.propGroup, hitProp);
  }

  // 10. Your health. Touching a Bill costs health, with a short safe window after each hit.
  hp = stats.maxHp;
  this.physics.add.overlap(player, bills, hurtPlayer);

  // 11. Wisdom gems, 401(k) Coins, Leftover Pizza heals, boss chests, and experience (XP).
  xp = 0; level = 1; xpNeeded = LEVELING.firstLevelXp;
  gems = this.physics.add.group();
  coins = this.physics.add.group();
  window.pizzas = this.physics.add.group();
  window.fieldItems = this.physics.add.group(); // Fanny Pack, Energy Drink, PTO Day (src/data/items.js)
  chests = this.physics.add.group();
  this.physics.add.overlap(player, gems, collectGem);
  this.physics.add.overlap(player, coins, collectCoin);
  this.physics.add.overlap(player, window.pizzas, collectPizza);
  this.physics.add.overlap(player, window.fieldItems, collectFieldItem);
  this.physics.add.overlap(player, chests, collectChest);
  updateHUD();

  // Apply the active camera/graphics style (2D 16-Bit, Diablo 3/4, or 3D Third-Person)
  applyViewMode(this);

  // 12. Title screen on first load ("Clock In"), or start a fresh run at the chosen Decade Checkpoint on "Try again".
  if (!titleSeen) {
    showTitleScreen(this);
  } else {
    beginFreshRunAtDecade(this);
    resetInputState(this);
    if (window.Telemetry) window.Telemetry.runStarted(false);
    setMusicPlaying(true);
  }
}

// Persist the active run state + unlock Decade Checkpoints (40, 50, 60, 70, 80) in localStorage!
window.persistActiveRun = () => {
  if (gameOver || titleOpen) return;
  meta.bestAge = Math.max(meta.bestAge || 40, currentAge);
  [40, 50, 60, 70, 80].forEach(dec => {
    if (currentAge >= dec && !meta.unlockedDecades.includes(dec)) {
      meta.unlockedDecades.push(dec);
    }
  });
  saveMeta(meta);
  saveRunState({
    currentAge,
    runStartAge,
    runElapsedMs,
    hp,
    level,
    xp,
    xpNeeded,
    runCoins,
    bossesSpawned,
    retire80Prompted,
    runMode,
    runTaxBracket,
    runSprint,
    stats
  });
};

// Apply permanent 401(k) shop ranks and the chosen character's starting perks to `stats`.
function applyMetaAndChar() {
  stats.speed = PLAYER.speed; stats.maxHp = PLAYER.maxHp; stats.cooldownMult = 1;
  stats.fireEveryMs = WEAPONS.coffeeSplash.fireEveryMs; stats.damage = WEAPONS.coffeeSplash.damage;
  stats.range = WEAPONS.coffeeSplash.range; stats.magnetRadius = PICKUPS.wisdomGem.magnetRadius;
  stats.dadJoke = false; stats.jokeEveryMs = WEAPONS.dadJoke.fireEveryMs; stats.jokeRadius = WEAPONS.dadJoke.radius; stats.jokeDamage = WEAPONS.dadJoke.damage;
  stats.wordNo = false; stats.noEveryMs = WEAPONS.wordNo.fireEveryMs; stats.noRadius = WEAPONS.wordNo.radius; stats.noDamage = WEAPONS.wordNo.damage; stats.noPush = WEAPONS.wordNo.pushPx;
  stats.coffeeUp = false; stats.jokeUp = false; stats.noUp = false;
  stats.hasShoes = false; stats.hasSleep = false; stats.hasGlasses = false; stats.boundariesPulse = 0;
  stats.remoteDamage = WEAPONS.remote.damage; stats.sheetDamage = WEAPONS.spreadsheet.damage; stats.podDamage = WEAPONS.podcast.damage; // reset before shop ranks apply
  stats.coldBrew = false; stats.punStorm = false; stats.healthyBoundaries = false;
  stats.coffeeRank = 0; stats.jokeRank = 0; stats.noRank = 0;
  stats.perkRanks = {};

  const rMatch = meta.ranks.compoundInterest || 0;
  const rEsp   = meta.ranks.espressoMachine || 0;
  const rCpa   = meta.ranks.taxWriteOff || 0;
  const rPen   = meta.ranks.pensionPlan || 0;
  stats.maxHp += rMatch * 2;
  stats.speed = Math.round(stats.speed * (1 + rEsp * 0.10));
  stats.cooldownMult *= Math.pow(0.92, rEsp);
  stats.magnetRadius = Math.round(stats.magnetRadius * (1 + rCpa * 0.25));
  stats.damage += rPen;
  stats.xpMult = 1 + (meta.ranks.continuingEd || 0) * 0.08;
  stats.coinMult = 1 + (meta.ranks.sideHustle || 0) * 0.15;
  stats.revives = meta.ranks.secondOpinion || 0; // one comeback per rank
  stats.jokeDamage += rPen;
  stats.noDamage += rPen;
  stats.remoteDamage += rPen; stats.sheetDamage += rPen; stats.podDamage += rPen; // "all weapons" means all six
  if (window.loadoutResetStats) loadoutResetStats(stats, rPen); // the seven loadout-expansion weapons and six passives (src/data/loadout.js)

  const ch = CHARACTERS.find(c => c.id === meta.selectedChar) || CHARACTERS[0];
  ch.apply(stats);
  hp = stats.maxHp;
}

// Start a brand-new run at the selected Decade Checkpoint (40, 50, 60, 70, or 80) with starter upgrades!
function beginFreshRunAtDecade(scene) {
  clearRunState();
  applyMetaAndChar();
  runMode = pickRunMode();
  runTaxBracket = meta.taxBracket || 0;
  runSprint = !!(meta.sprint && window.isSprintUnlocked && isSprintUnlocked(meta));
  runStartAge = modeStartAge();
  currentAge = runStartAge;
  lastDividendAge = Math.floor(runStartAge / 5) * 5;
  runElapsedMs = 0;
  lastAutoSave = 0;
  retire80Prompted = runStartAge >= 80;
  bossesSpawned = {};
  ["performanceReview", "mortgageRefinance", "midlifeCrisis", "goldWatch", "hoaPresident", "retirementBoss", "pickleballChamp", "theReaper"].forEach(bk => {
    if (ENEMIES[bk] && ENEMIES[bk].spawnAge < runStartAge) bossesSpawned[bk] = true;
  });

  // Grant starter levels/upgrades when starting at a later Decade Checkpoint (50, 60, 70, 80)!
  const cp = (typeof DECADE_CHECKPOINTS !== "undefined") && DECADE_CHECKPOINTS.find(d => d.age === runStartAge);
  if (cp && cp.bonusLevels > 0) {
    for (let i = 0; i < cp.bonusLevels; i++) {
      level++;
      const pool = UPGRADES.filter(u => !u.when || u.when(stats));
      if (pool.length) {
        const up = Phaser.Utils.Array.GetRandom(pool);
        up.apply(stats);
      }
    }
    xpNeeded = Math.round(LEVELING.firstLevelXp + cp.bonusLevels * 6);
    hp = stats.maxHp;
  }

  const cd = stats.cooldownMult;
  fireTimer.reset({ delay: Math.round(stats.fireEveryMs * cd), loop: true, callback: fireTimer.callback });
  jokeTimer.reset({ delay: Math.round(stats.jokeEveryMs * cd), loop: true, callback: jokeTimer.callback });
  noTimer.reset({   delay: Math.round(stats.noEveryMs   * cd), loop: true, callback: noTimer.callback });
  updateHUD();
}

// You picked up a gold 401(k) Coin: scales with your Compound Yield Tier the longer you survive!
function collectCoin(p, coin) {
  if (!coin.active) return;
  const mult = coin.bonusMult || 1;
  coin.destroy();
  sfx("coin");
  const yld = window.getCoinYieldInfo();
  const gain = bankCoins(yld.value * mult);
  runCoins += gain;
  meta.coins += gain;
  saveMeta(meta);
  updateHUD();
  const pt = project3DToPhaserWorld(p.scene, p.x, 38, p.y);
  const txt = p.scene.add.text(pt.x + Phaser.Math.Between(-6, 6), pt.y - 16, `+${gain}k 🪙`, {
    fontFamily: "monospace",
    fontSize: gain >= 3 ? "13px" : "11px",
    fontStyle: "bold",
    color: gain >= 3 ? "#ffe042" : "#f5c542",
    stroke: "#12152a",
    strokeThickness: 3
  }).setOrigin(0.5).setDepth(16);
  p.scene.tweens.add({ targets: txt, y: txt.y - 22, alpha: 0, duration: 520, onComplete: () => txt.destroy() });
}

// You picked up a slice of Leftover Breakroom Pizza (dropped from smashing potted plants): heals +2 HP!
// Coins: only part of a coin's face value reaches the bank (PICKUPS.coin401k.bankMult), boosted by Side Hustle.
// Fractions add up over the run instead of being lost.
let coinFrac = 0, xpFrac = 0;
function bankCoins(v) {
  coinFrac += v * ((PICKUPS.coin401k && PICKUPS.coin401k.bankMult) || 1) * ((stats && stats.coinMult) || 1) * (1 + tax("coinMult")) * (runSprint && window.SPRINT ? SPRINT.coinMult : 1);
  const whole = Math.floor(coinFrac); coinFrac -= whole; return whole;
}

// ---------- Achievements (src/data/achievements.js) ----------
let runAch = { bills: 0, kinds: {}, newly: [], lastAge: 40 };
window.getNewAchievements = () => runAch.newly;
window.achEvent = (on, d = {}) => {
  if (!meta || !window.ACHIEVEMENTS) return;
  if (window.DEV && window.DEV.on) return; // dev console: no achievements while testing
  const A = meta.achievements || (meta.achievements = { unlocked: {}, life: {} });
  const life = A.life || (A.life = {});
  life.evos = life.evos || {};
  // Keep the counters some achievements need.
  if (on === "kill") { runAch.kinds[d.kind] = (runAch.kinds[d.kind] || 0) + 1; if (d.kind === "bill") runAch.bills++; }
  if (on === "split") life.splits = (life.splits || 0) + 1;
  if (on === "plant") life.plants = (life.plants || 0) + 1;
  if (on === "evolve") life.evos[d.name] = 1;
  d.char = meta.selectedChar;
  let changed = on === "split" || on === "plant" || on === "evolve";
  ACHIEVEMENTS.forEach(def => {
    if (def.on !== on || A.unlocked[def.id]) return;
    let ok = false; try { ok = def.test(d, runAch, life); } catch (e) {}
    if (!ok) return;
    A.unlocked[def.id] = Date.now();
    meta.coins += def.reward; changed = true;
      if (def.id === "requiredReading") { meta.unlockedChars = meta.unlockedChars || {}; meta.unlockedChars.coldWarCowboy = true; if (window.showLowerThird) window.showLowerThird("win", "NEW HIRE", "The Coldwar Cowboy is unlocked. Pick him on the title screen.", 6000); }
    runAch.newly.push(def);
    sfx("levelUp");
    if (window.showLowerThird) window.showLowerThird("win", "ACHIEVED", `${def.icon} ${def.name}: ${def.desc} +${def.reward}k`, 4500);
  });
  if (changed) saveMeta(meta);
};

// ---------- Discoverable items + timed boosts ----------
let buffs = { speedUntil: 0, speedMult: 1, damageUntil: 0, damageMult: 1, vacuumUntil: 0, xpUntil: 0, xpMult: 1 };
// Shield from catching an intern (Nov 4): blocks the next few hits until it runs out. Drawn as a ring around you.
let shield = { hits: 0, until: 0, flashAt: -1e9, ring: null };
window.giveShield = (scene, hits, ms) => {
  shield.hits = Math.max(shield.hits, hits); shield.until = runElapsedMs + ms;
  if (!shield.ring || !shield.ring.active) shield.ring = scene.add.graphics().setDepth(5.5);
};
function drawShield() {
  const g = shield.ring; if (!g || !g.active) return;
  g.clear();
  const left = shield.until - runElapsedMs;
  if (shield.hits <= 0 || left <= 0) { shield.hits = 0; g.destroy(); shield.ring = null; return; }
  const blink = left < 3000 && Math.floor(left / 160) % 2 === 0, hit = runElapsedMs - shield.flashAt < 180;
  if (blink) return;
  const r = 30 + Math.sin(runElapsedMs / 220) * 2, cy = player.y + 4;
  g.fillStyle(0x83A89A, hit ? 0.35 : 0.12).fillEllipse(player.x, cy, r * 2.2, r * 1.9);
  g.lineStyle(hit ? 4 : 2, hit ? 0xFFF0CF : 0x83A89A, 0.9).strokeEllipse(player.x, cy, r * 2.2, r * 1.9);
  for (let i = 0; i < shield.hits; i++) g.fillStyle(0xFFF0CF, 1).fillRect(player.x - 7 + i * 10, cy - r * 0.95 - 10, 6, 6); // one pip per hit left
}

window.startBuff = (type, mult, durMs, label) => {
  buffs[type + "Until"] = runElapsedMs + durMs;
  buffs[type + "Mult"] = mult;
  if (window.showLowerThird) window.showLowerThird("reward", label, `${type === "speed" ? "Faster feet" : "Extra damage"} for ${Math.round(durMs / 1000)} seconds.`, 3500, `${type === "speed" ? "FASTER" : "MORE DAMAGE"} · ${Math.round(durMs / 1000)}s`);
};

function itemTexture(scene, kind) {
  const key = "item_" + kind, I = FIELD_ITEMS[kind];
  if (!scene.textures.exists(key)) {
    makeCanvasTex(scene, key, 34, 34, ctx => {
      ctx.fillStyle = "rgba(18,21,42,0.85)"; ctx.beginPath(); ctx.arc(17, 17, 16, 0, Math.PI * 2); ctx.fill();
      ctx.font = "22px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(I.emoji, 17, 19);
    });
  }
  return key;
}

function spawnFieldItem(scene, x, y, kind) {
  if (!window.fieldItems || window.fieldItems.countActive() >= ITEM_DROPS.maxOnFloor) return;
  if (!kind) {
    const kinds = Object.keys(FIELD_ITEMS), total = kinds.reduce((a, k) => a + FIELD_ITEMS[k].weight, 0);
    let r = Math.random() * total; kind = kinds.find(k => (r -= FIELD_ITEMS[k].weight) < 0) || kinds[0];
  }
  const FI = { fannyPack: 0, energyDrink: 1, ptoDay: 2 }, art = scene.textures.exists("field_items") && FI[kind] !== undefined; // ChatGPT's pickups (Nov 4)
  const it = (art ? window.fieldItems.create(x, y, "field_items", FI[kind]) : window.fieldItems.create(x, y, itemTexture(scene, kind))).setDepth(3);
  if (art) { const f0 = FI[kind]; it.shineEv = scene.time.addEvent({ delay: 900, loop: true, callback: () => { if (it.active) it.setFrame(it.frame.name === f0 ? f0 + 3 : f0); } }); it.once("destroy", () => it.shineEv && it.shineEv.remove()); }
  it.kind = kind; it.expireAt = runElapsedMs + ITEM_DROPS.lifeMs;
  it.glowRing = scene.add.circle(x, y, 20).setStrokeStyle(2, FIELD_ITEMS[kind].glow, 0.9).setDepth(2);
  scene.tweens.add({ targets: it.glowRing, scale: { from: 0.8, to: 1.25 }, alpha: { from: 1, to: 0.3 }, yoyo: true, repeat: -1, duration: 600 });
  scene.tweens.add({ targets: it, y: y - 4, yoyo: true, repeat: -1, duration: 700, ease: "Sine.easeInOut" });
}

// What each item does. quiet = triggered from a level-up card (the card already explained it).
window.itemEffect = (kind, quiet) => {
  const sc = player && player.scene; if (!sc) return;
  if (kind === "fannyPack") buffs.vacuumUntil = runElapsedMs + 2500;
  if (kind === "energyDrink") { buffs.speedUntil = runElapsedMs + FIELD_ITEMS.energyDrink.durMs; buffs.speedMult = FIELD_ITEMS.energyDrink.speedMult; }
  if (kind === "ptoDay") {
    sc.cameras.main.flash(250, 120, 220, 160);
    bills.getChildren().slice().forEach(b => { if (b.active && !b.isBoss) { b.ghost = false; damageBill(b, 9999); } });
  }
  if (!quiet && window.showLowerThird) window.showLowerThird("reward", FIELD_ITEMS[kind].name.toUpperCase(), FIELD_ITEMS[kind].text, 4000, FIELD_ITEMS[kind].short || "");
};

function collectFieldItem(p, it) {
  if (!it.active) return;
  const kind = it.kind;
  if (it.glowRing) it.glowRing.destroy();
  it.destroy();
  sfx("levelUp");
  window.itemEffect(kind, false);
}

// Desk Salad (Nov 3): elites sometimes drop one. It heals a share of your max health and wilts after a while.
function maybeDropSalad(sc, x, y, EL) {
  const S = PICKUPS.salad; if (!S || !window.pizzas || !EL.saladChance) return;
  saladDry++;
  if (!(Math.random() < EL.saladChance || saladDry >= (EL.saladPityEvery || 3))) return;
  saladDry = 0;
  const onGround = window.pizzas.getChildren().filter(o => o.active && o.isSalad).length;
  if (onGround >= (S.maxOnGround || 2)) { gems.create(x, y, "gem").setDepth(3); return; }
  const s = window.pizzas.create(x, y, "salad").setDepth(3);
  s.isSalad = true; s.dieAt = runElapsedMs + (S.lifeMs || 14000);
  if (window.Lighting) Lighting.fx("saladDrop", x, y);
  if (window.Spotlight) Spotlight.tip("salad"); // first Desk Salad ever
}
function saladHealAmount() {
  const S = PICKUPS.salad;
  return Math.max(S.healMin || 3, Math.floor(stats.maxHp * (S.healFrac || 0.22)));
}

// Birthday cake (Nov 3): every 5 years from 45, a heal that scales with your max health.
function milestoneHealAmount(age) {
  const M = window.HEALING && HEALING.milestones;
  if (!M || age < M.firstAge || age % M.everyYears) return 0;
  if (age === M.endAge) return Math.max(M.minDecade, Math.floor(stats.maxHp * M.fracEnd));
  if (age % 10 === 0) return Math.max(M.minDecade, Math.floor(stats.maxHp * M.fracDecade));
  return Math.max(M.minNormal, Math.floor(stats.maxHp * M.fracNormal));
}

function collectPizza(p, pz) {
  if (!pz.active) return;
  if (pz.collectAt && runElapsedMs < pz.collectAt) return; // a tossed intern treat lands first, so you see it
  if (pz.isParcel) { if (window.Interns) Interns.collectParcel(p.scene, pz); else pz.destroy(); return; } // an intern left it for you
  if (pz.isSalad) {
    pz.destroy();
    sfx("levelUp");
    const sHeal = healAmt(Math.round(saladHealAmount() * (stats.foodMult || 1))); // Meal Prep Sunday
    hp = Math.min(stats.maxHp, hp + sHeal);
    updateHUD(); if (typeof drawHpBar === "function") drawHpBar();
    const sp = project3DToPhaserWorld(p.scene, p.x, 42, p.y);
    const st = p.scene.add.text(sp.x, sp.y - 18, `+${sHeal} HP (SALAD!)`, {
      fontFamily: "monospace", fontSize: "13px", fontStyle: "bold", color: "#83A89A", stroke: "#12152a", strokeThickness: 3
    }).setOrigin(0.5).setDepth(16);
    p.scene.tweens.add({ targets: st, y: st.y - 24, alpha: 0, duration: 700, onComplete: () => st.destroy() });
    if (sHeal >= 6 && window.showLowerThird) window.showLowerThird("reward", "DESK SALAD", `Actual vegetables. +${sHeal} HP.`, 3200);
    return;
  }
  if (slowUntil > 0 && runElapsedMs - slowUntil < 8000) window.achEvent("pizzaAfterSlow"); // donut, then pizza
  pz.destroy();
  sfx("levelUp");
  const pzHeal = healAmt(Math.max(1, Math.round((PICKUPS.pizza.heal + (window.modFx ? modFx("pizzaHealAdd", 0) : 0)) * (window.modFx ? modFx("pizzaHealMult", 1) : 1) * (stats.foodMult || 1))));
  hp = Math.min(stats.maxHp, hp + pzHeal);
  updateHUD();
  const pt = project3DToPhaserWorld(p.scene, p.x, 42, p.y);
  const txt = p.scene.add.text(pt.x, pt.y - 18, `+${pzHeal} HP (PIZZA!)`, {
    fontFamily: "monospace", fontSize: "13px", fontStyle: "bold", color: "#6fbf73", stroke: "#12152a", strokeThickness: 3
  }).setOrigin(0.5).setDepth(16);
  p.scene.tweens.add({ targets: txt, y: txt.y - 24, alpha: 0, duration: 600, onComplete: () => txt.destroy() });
}

// The Title Screen: renders the HTML/CSS Executive Dossier, Character Select, Decade Checkpoints, and 401(k) Shop!
function showTitleScreen(scene) {
  titleOpen = true;
  setMusicPlaying(false);
  scene.physics.pause();
  scene.time.paused = true;

  renderTitleModal(scene);
  { const tm = document.getElementById("title-modal"); if (tm) tm.scrollTop = 0; } // open at the top on short windows

  window.resumeSavedRunFromTitle = () => {
    const saved = loadRunState();
    if (!titleOpen || !saved) return;
    unlockAudio();
    sfx("pick");
    titleOpen = false;
    titleSeen = true;
    startFromTitle = null;
    hideTitleModal();

    currentAge = saved.currentAge || 40;
    runStartAge = saved.runStartAge || 40;
    runMode = saved.runMode || "full"; // runs saved before modes existed were Full Life runs
    runTaxBracket = saved.runTaxBracket || 0; // resuming keeps the bracket you started with
    runSprint = !!saved.runSprint;
    lastDividendAge = Math.floor(currentAge / 5) * 5;
    runElapsedMs = saved.runElapsedMs || 0;
    lastAutoSave = runElapsedMs;
    level = saved.level || 1;
    xp = saved.xp || 0;
    xpNeeded = saved.xpNeeded || LEVELING.firstLevelXp;
    runCoins = saved.runCoins || 0;
    bossesSpawned = saved.bossesSpawned || {};
    retire80Prompted = !!saved.retire80Prompted;
    if (saved.stats) Object.assign(stats, saved.stats);
    hp = Math.min(stats.maxHp, saved.hp || stats.maxHp);

    const cd = stats.cooldownMult;
    fireTimer.reset({ delay: Math.round(stats.fireEveryMs * cd), loop: true, callback: fireTimer.callback });
    jokeTimer.reset({ delay: Math.round(stats.jokeEveryMs * cd), loop: true, callback: jokeTimer.callback });
    noTimer.reset({   delay: Math.round(stats.noEveryMs   * cd), loop: true, callback: noTimer.callback });
    updateHUD();
    touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
    scene.physics.resume();
    scene.time.paused = false;
    setMusicPlaying(true);
    resetInputState(scene);
    if (window.Telemetry) window.Telemetry.runStarted(true);
  };

  startFromTitle = () => {
    if (!titleOpen) return;
    unlockAudio();
    sfx("pick");
    titleOpen = false;
    titleSeen = true;
    startFromTitle = null;
    hideTitleModal();
    beginFreshRunAtDecade(scene);
    startShiftBriefing(scene); // your hero's card plus today's shift, before the clock starts (Rami, Nov 4)
    resetInputState(scene);
    if (window.Telemetry) window.Telemetry.runStarted(false); // anonymous play stats (src/telemetry.js)
    touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
    if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
    startTime = scene.time.now;
    scene.physics.resume();
    scene.time.paused = false;
    setMusicPlaying(true);
  };
}

// Toggle pause (Spacebar, P, Esc, Right-Click, Controller Start, or Mobile Pause Button).
function togglePause(scene) {
  if (gameOver || levelUpOpen || titleOpen || retire80Open) return;
  if (window.controlsModalOpen && typeof closeControlsModal === "function") {
    closeControlsModal(scene);
  }
  paused = !paused;
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0, isTouch: false, curX: 0, curY: 0 };
  mouseState.leftDown = false;
  mouseState.rightDown = false;
  if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
  if (window.updatePointerTargetUI) window.updatePointerTargetUI(null);
  setMusicPlaying(!paused);
  setPauseModalVisible(paused);
  if (paused) {
    window.persistActiveRun();
    scene.physics.pause();
    scene.time.paused = true;
    player.setVelocity(0, 0);
  } else {
    scene.physics.resume();
    scene.time.paused = false;
  }
}

// You walked over a gold Boss Chest: the Bonus Chest moment (src/bonus-chest.js).
// The chest pays 1, 3 or 5 rewards depending on the boss, applied right away, plus a 401(k) payout.
function collectChest(p, chest) {
  if (!chest.active) return;
  if (chest.readyAt && runElapsedMs < chest.readyAt) return; // the boss is still going down
  if (levelUpOpen || (window.BonusChest && BonusChest.isOpen())) return; // another menu is up: the chest waits on the floor
  if (chest.tag) chest.tag.destroy();
  const scene = p.scene;
  const C = PICKUPS.bossChest;
  const tier = (C.tiers && C.tiers[chest.bossKind]) || C.defaultTier || 3;
  const bossName = (ENEMIES[chest.bossKind] && ENEMIES[chest.bossKind].name) || "";
  chest.destroy();
  const payout = window.getCoinYieldInfo().value * ((C.coinMultPerTier && C.coinMultPerTier[tier]) || tier * 4);
  runCoins += payout;
  meta.coins += payout;
  saveMeta(meta);
  const rewards = rollChestRewards(tier);
  updateHUD();
  if (!window.BonusChest) { pendingLevels++; if (!levelUpOpen) showLevelUp(scene, `EXECUTIVE BONUS CHEST! (+${payout}k 401k)`, true); return; }
  pauseForMenu(scene);
  const reelIcons = Phaser.Utils.Array.Shuffle(UPGRADES.slice()).slice(0, 12).map(u => chestIcon(u));
  window.BonusChest.open({ scene, tier, rewards, coins: payout, bossName, reelIcons }, () => {
    levelUpOpen = false;
    touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
    scene.physics.resume();
    scene.time.paused = false;
    if (pendingLevels > 0) showLevelUp(scene);
  });
}

// Stuck-pause watchdog (Nov 3, Derek: "game froze after getting the chest post HR boss").
// If the run is paused but no menu is showing for 2 checks in a row, put the menu back or unpause.
// It also records which flags were stuck (as an anonymous "stuck-..." play-stats event) so we can find the cause.
const PAUSE_MENUS = ["shift-briefing", "minimap-modal", "levelup-modal", "bonus-modal", "lounge-modal", "pause-modal", "retire80-modal", "gameover-modal", "title-modal", "controls-modal", "changelog-modal", "lore-modal"];
let stuckChecks = 0;
setInterval(() => {
  const sc = window._activeGameScene;
  if (!sc || !sc.physics || !sc.physics.world || typeof player === "undefined" || !player || !player.scene) return;
  if (titleOpen || gameOver || paused || retire80Open || document.hidden) { stuckChecks = 0; return; }
  const frozen = sc.physics.world.isPaused || sc.time.paused || levelUpOpen;
  const menuUp = PAUSE_MENUS.some(id => { const el = document.getElementById(id); return el && !el.classList.contains("hidden"); });
  if (!frozen || menuUp) { stuckChecks = 0; return; }
  if (++stuckChecks < 2) return;
  stuckChecks = 0;
  const flags = [levelUpOpen && "lvl", sc.physics.world.isPaused && "phys", sc.time.paused && "time", window.BonusChest && BonusChest.isOpen() && "chest", pendingLevels > 0 && "pend"].filter(Boolean).join("-");
  if (window.Telemetry && Telemetry.event) Telemetry.event("stuck-" + (flags || "none"));
  console.warn("[watchdog] run was paused with no menu showing:", flags);
  if (window.BonusChest && BonusChest.isOpen()) { const m = document.getElementById("bonus-modal"); if (m) { m.classList.remove("hidden"); return; } }
  if (pendingLevels > 0) { levelUpOpen = false; showLevelUp(sc); return; }
  levelUpOpen = false;
  sc.physics.resume();
  sc.time.paused = false;
}, 1000);

// Pause the run for a menu the same way the level-up screen does.
function pauseForMenu(scene) {
  levelUpOpen = true;
  window.menuInputGateUntil = performance.now() + 250;
  window.menuHeldAtOpen = new Set(window._heldKeys || []);
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
  if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
  scene.physics.pause();
  scene.time.paused = true;
  player.setVelocity(0, 0);
}

function chestIcon(up) {
  const info = (typeof UPGRADE_META !== "undefined" && UPGRADE_META[up.name]) || { icon: "⭐" };
  return window.pixelIcon ? pixelIcon("card", up.name, info.icon, 40) : info.icon;
}

// Pick and apply this chest's rewards one at a time (so ranks and evolutions update between picks).
// First beam: an evolution if one is ready, else a new weapon, else anything. Fallback when everything is maxed: a cash bonus.
function rollChestRewards(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    // Chests only upgrade what you already carry (Nov 4, Rami: "the loadout should be a decision the player makes").
    // No new weapons and no new passives; evolutions are fine, since they grow from your own picks.
    const L = window.LOADOUT;
    const isNewItem = u => u.name.startsWith("Unlock:") || (L && L.kindOf(u) === "passive" && !((stats.perkRanks || {})[u.id] > 0));
    const pool = UPGRADES.filter(u => !u.isConsumable && (!u.when || u.when(stats)) && !isNewItem(u));
    const evos = pool.filter(u => u.isEvolution);
    let up = null;
    if (evos.length) up = Phaser.Utils.Array.GetRandom(evos);
    else if (pool.length) up = Phaser.Utils.Array.GetRandom(pool);
    if (!up) {
      const bonus = window.getCoinYieldInfo().value * 3;
      runCoins += bonus; meta.coins += bonus; saveMeta(meta);
      out.push({ name: `Signing Bonus +${bonus}k`, label: "EVERYTHING'S MAXED", text: "", icon: "💰", evo: false });
      continue;
    }
    const info = (typeof UPGRADE_META !== "undefined" && UPGRADE_META[up.name]) || {};
    const plain = up.isEvolution || info.rarity === "evo" ? "EVOLUTION" : up.name.startsWith("Unlock:") ? "NEW WEAPON" : info.rarity === "passive" ? "PASSIVE" : "UPGRADE";
    applyUpgrade(up);
    out.push({ name: window.heroWord ? heroWord(up.name) : up.name, label: plain, text: window.heroWord ? heroWord(up.text || "") : (up.text || ""), icon: chestIcon(up), evo: plain === "EVOLUTION" });
  }
  return out;
}

// Apply one upgrade card and restart the weapon timers (shared by level-ups and chests).
function applyUpgrade(up) {
  const jokeBefore = [stats.dadJoke, stats.jokeRadius, stats.jokeDamage, stats.jokeEveryMs].join();
  up.apply(stats);
  if (up.isEvolution) { window.achEvent("evolve", { name: up.name }); if (window.Spotlight) Spotlight.tip("evolution"); }
  if (stats.dadJoke && jokeBefore !== [stats.dadJoke, stats.jokeRadius, stats.jokeDamage, stats.jokeEveryMs].join()) stats.jokeAnnounce = true;
  if (stats.heal) { hp = Math.min(stats.maxHp, hp + healAmt(stats.heal)); stats.heal = 0; }
  const cd = stats.cooldownMult;
  fireTimer.reset({ delay: Math.round(stats.fireEveryMs * cd), loop: true, callback: fireTimer.callback });
  jokeTimer.reset({ delay: Math.round(stats.jokeEveryMs * cd), loop: true, callback: jokeTimer.callback });
  noTimer.reset({   delay: Math.round(stats.noEveryMs   * cd), loop: true, callback: noTimer.callback });
  updateHUD();
}

function drawXpBar() { updateHUD(); }
function drawHpBar() { updateHUD(); }

// You touched a gem: bank the XP, and level up if the bar is full.
// Too many gems on the floor: fold the farthest ones into one big red gem worth all of them (Fable review #3).
let gemCapNextAt = 0;
function capFloorGems(scene) {
  const L = window.FLOOR_LIMITS; if (!L || !gems || !player) return;
  const list = gems.getChildren().filter(g => g.active);
  if (list.length <= L.gemCap) return;
  const far = g => (g.x - player.x) * (g.x - player.x) + (g.y - player.y) * (g.y - player.y);
  let big = list.find(g => g.isBig);
  const pool = list.filter(g => g !== big).sort((a, b) => far(b) - far(a)).slice(0, list.length - L.gemCap + L.gemMergeBatch); // everything over the cap, plus some headroom
  if (!pool.length) return;
  if (!big) {
    big = gems.create(pool[0].x, pool[0].y, "gem").setDepth(3).setScale(L.bigGemScale || 1.7).setTint(0xC45C4B);
    big.isBig = true; big.worth = 0;
    if (window.Lighting) Lighting.follow(big, "bigGem");
  }
  pool.forEach(g => { big.worth += g.worth || 1; g.destroy(); });
}
function collectGem(p, gem) {
  if (!gem.active) return;
  const worth = gem.worth || 1; // a merged big gem counts as every gem that went into it
  gem.destroy();
  sfx("gem");
  addXp(p.scene, worth * (runElapsedMs < buffs.xpUntil ? buffs.xpMult : 1) * PICKUPS.wisdomGem.xp * (stats.xpMult || 1) * (1 + tax("xpMult")) * (window.modFx ? modFx("gemXpMult", 1) : 1)); // Continuing Ed + Tax Bracket (+ Empty Nest) add to every gem
}

// Add XP (fractions carry over) and open the level-up screen if you earned one. Gems and Close Calls both use this.
function addXp(scene, amount) {
  xpFrac += amount;
  xp += Math.floor(xpFrac); xpFrac -= Math.floor(xpFrac);
  if (xp >= xpNeeded && window.Lighting) Lighting.fx("levelUp", player.x, player.y, { follow: player }); // a warm bloom (it plays out after you pick)
  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level++;
    xpNeeded = Math.round(xpNeeded * LEVELING.growth + (LEVELING.stepXp || 4));
    pendingLevels++;
    hp = Math.min(stats.maxHp, hp + healAmt(1)); // leveling up restores +1 HP (was +2: too much healing)
  }
  updateHUD();
  if (pendingLevels > 0 && !levelUpOpen) showLevelUp(scene);
}
window.addXp = addXp;

// The level-up screen: pause the world and offer 3 vertical Perk Cards in the HTML/CSS overlay!
function showLevelUp(scene, customTitle, preferWeapons) {
  levelUpOpen = true;
  // Keys/stick you were holding to walk shouldn't scroll the perk cards. Ignore them until released and pressed again.
  window.menuInputGateUntil = performance.now() + 200;
  window.menuHeldAtOpen = new Set(window._heldKeys || []);
  padHoldDir = padNow.up ? "up" : (padNow.down ? "down" : (padNow.left ? "left" : (padNow.right ? "right" : null)));
  padNextRepeatMs = Infinity; // a held direction won't repeat until you let go
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
  if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
  scene.physics.pause();
  scene.time.paused = true;
  player.setVelocity(0, 0);

  const pool = UPGRADES.filter(u => !u.when || u.when(stats));
  const boosts = Phaser.Utils.Array.Shuffle(pool.filter(u => u.isConsumable));
  const regular = pool.filter(u => !u.isConsumable);
  const evos = regular.filter(u => u.isEvolution);
  const unlocked = preferWeapons ? regular.filter(u => u.name.startsWith("Unlock:")) : [];
  const priority = evos.concat(unlocked);
  const rest = Phaser.Utils.Array.Shuffle(regular.filter(u => !priority.includes(u)).slice());
  let choices = priority.concat(rest).slice(0, 3);
  // Boosts fill empty slots when regular cards run out, and after 50 one sometimes takes the third slot.
  while (choices.length < 3 && boosts.length) choices.push(boosts.shift());
  if (choices.length === 3 && boosts.length && !choices.some(c => c.isConsumable) && currentAge >= 50 && Math.random() < 0.3) choices[2] = boosts.shift();

  const pick = up => {
    sfx("pick");
    if (levelMenu && levelMenu.close) levelMenu.close();
    levelMenu = null;
    window.levelMenu = null;
    applyUpgrade(up);
    touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
    pendingLevels--;
    levelUpOpen = false;
    scene.physics.resume();
    scene.time.paused = false;
    if (pendingLevels > 0) showLevelUp(scene);
  };

  // Skip (Nov 4): with only 6 slots, you may not want any of the three. Skipping heals a little instead.
  const SKIP = { id: "skipPerk", name: "Skip", isSkip: true, text: "Keep your loadout as it is. Heal 2 HP instead.", apply: s => { s.heal = 2; } };
  const uiCtrl = renderLevelUpModal(choices, customTitle, pick, SKIP);
  levelMenu = {
    sel: 0,
    count: choices.length,
    highlight: idx => uiCtrl && uiCtrl.highlight(idx),
    close: () => uiCtrl && uiCtrl.close(),
    pickSelected: () => pick(choices[levelMenu.sel])
  };
  window.levelMenu = levelMenu;
  levelMenu.highlight(0);
  sfx("levelUp");
}

// An enemy (Bill, Snack, Twinge, Elite, or Boss) touched you.
function hurtPlayer(p, bill) {
  const scene = p.scene, now = scene.time.now;
  if (gameOver) return;
  if (bill.clockOut) { // you reached the punch clock at 65: punch the golden card, confetti, then retirement
    if (!bill.punchAt) {
      bill.punchAt = runElapsedMs; window.clockingOut = true; p.setVelocity(0, 0);
      sfx("catch"); scene.cameras.main.flash(260, 255, 240, 207);
      [0, 180, 360].forEach(t => scene.time.delayedCall(t, () => burstConfetti(scene, bill.x + Phaser.Math.Between(-30, 30), bill.y - 40, 0xEF9347, 18)));
      if (window.Lighting) Lighting.fx("levelUp", bill.x, bill.y);
      if (bill.tag) bill.tag.setText(bill.kind === "theReaper" && !modeCfg().endBossLabel ? "HAPPY 100TH!" : "CLOCKED OUT!");
      scene.time.delayedCall(760, () => { if (!gameOver) showGameOver(scene, "theReaper", true); });
    }
    return;
  }
  if (window.clockingOut) return; // nothing can hurt you while you punch out
  if (window.DEV && DEV.god && bill.kind !== "theReaper") return; // dev console god mode
  if (bill.kind === "theReaper") { showGameOver(scene, "theReaper", true); return; } // Reaching Age 100 = CENTENARIAN VICTORY!
  if (bill.ghost) return; // a faded 3 AM Thought can't touch you
  if (now - lastHurt < PLAYER.hurtCooldownMs) return; // still in the safe window
  lastHurt = now;
  if (stats.dodge && Math.random() < stats.dodge) { // Fitness Tracker: sidestep the hit
    const t = scene.add.text(p.x, p.y - 44, Phaser.Utils.Array.GetRandom(["DODGED!", "10,000 STEPS!", "NOT TODAY!"]), { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#BFA8CF", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(50002);
    scene.tweens.add({ targets: t, y: t.y - 22, alpha: 0, duration: 700, onComplete: () => t.destroy() });
    return;
  }
  if (shield.hits > 0 && runElapsedMs < shield.until) { // a shield soaks the hit (interns, Headphones, Cardigan)
    shield.hits--; shield.flashAt = runElapsedMs; sfx("wordNo");
    if (window.MoreWeapons) MoreWeapons.onBlock(scene, p); // the Headphones pop
    const t = scene.add.text(p.x, p.y - 44, shield.hits ? "BLOCKED!" : "SHIELD BROKE!", { fontFamily: "Silkscreen, monospace", fontSize: "12px", color: "#83A89A", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(50002);
    scene.tweens.add({ targets: t, y: t.y - 22, alpha: 0, duration: 700, onComplete: () => t.destroy() });
    return;
  }
  dyn.lastHitAt = runElapsedMs; dyn.comfortUntil = 0; // any hit ends the Comfort Zone Tax
  { const dmg = (bill.damage || ENEMIES.bill.damage) + Math.round(ageCurve((window.INTENSITY || {}).hitDamageByAge, currentAge) || 0) + Math.round(tax("hitDamageAdd"));
    const dmg2 = Math.max(1, dmg - (stats.armor || 0)); // Lumbar Support
    hp -= dmg2; runHits++; runDamageTaken += dmg2; } // runHits/runDamageTaken go to the play-stats table
  if (bill.kind === "snackAttack") {
    slowUntil = runElapsedMs + ENEMIES.snackAttack.slowDurationMs;
    const isSenior = currentAge >= 80;
    const msg = scene.add.text(p.x, p.y - 30, isSenior ? "3 PM DINNER NAP!" : "SUGAR CRASH!", {
      fontFamily: "monospace", fontSize: "12px", color: "#f078b8"
    }).setOrigin(0.5);
    scene.tweens.add({ targets: msg, y: msg.y - 22, alpha: 0, duration: 700, onComplete: () => msg.destroy() });
  }
  sfx("hurt");
  if (window.NearMiss) window.NearMiss.onHurt(); // a real hit breaks the Close Call streak
  scene.cameras.main.shake(120, 0.009); // screen shake when you take contact damage!
  drawHpBar();
  p.setTintFill(0xe0564f); // flash red
  scene.time.delayedCall(100, () => p.clearTint());
  // Ben's quirk (Nov 3): once a run, when health drops to a quarter, he power-cycles everything.
  if (stats.reboot && hp > 0 && hp <= stats.maxHp * 0.25) {
    stats.reboot = false;
    hp = Math.min(stats.maxHp, hp + healAmt(Math.ceil(stats.maxHp * 0.4))); drawHpBar(); lastHurt = now + 1200;
    scene.cameras.main.flash(300, 230, 230, 255);
    bills.getChildren().slice().forEach(b => { if (b.active && !b.isBoss && !b.elite && Phaser.Math.Distance.Between(b.x, b.y, p.x, p.y) < 320) { b.ghost = false; damageBill(b, 99999); } });
    if (window.flashBanner) window.flashBanner("REBOOTED", "HAVE YOU TRIED TURNING IT OFF AND ON AGAIN?", "reward");
    if (window.showLowerThird) window.showLowerThird("win", "IT SUPPORT", "Have you tried turning it off and on again? Screen cleared, 40% health back. Once per run.", 4500);
    sfx("levelUp");
    return;
  }
  if (hp <= 0 && stats.revives > 0) { // Second Opinion (401k shop): get back up once
    stats.revives--; hp = Math.max(1, healAmt(Math.ceil(stats.maxHp / 2))); drawHpBar(); lastHurt = now + 1500;
    if (window.itemEffect) window.itemEffect("ptoDay", true);
    if (window.showLowerThird) window.showLowerThird("win", "SECOND OPINION", "The second doctor says you're fine. Back on your feet with half HP.", 4500);
    return;
  }
  if (hp <= 0) showGameOver(scene, bill.kind || "bill", false); // dying is never a win; only meeting Death at 100 is
}

// The Game Over / Victory screen: freeze the world and render the HTML/CSS Exit Interview or AARP Certificate!
function showGameOver(scene, killer, isWin) {
  gameOver = true;
  window.justUnlockedFull = isWin && runMode === "midlife" && !isFullLifeUnlocked(meta);
  if (isWin) window.achEvent("clear", { mode: runMode, age: currentAge, taxBracket: runTaxBracket });
  else window.achEvent("death", { killer });
  if (window.NearMiss) window.NearMiss.logSummary();
  if (window.Telemetry) window.Telemetry.runEnded(isWin, killer);
  clearRunState();
  // Remember the last shift for the title screen's welcome-back tile.
  try {
    const sc = window.computeRunScore ? window.computeRunScore(currentAge, runStartAge, runKills, runCoins, isWin) : 0;
    meta.runsPlayed = (meta.runsPlayed || 0) + 1;
    meta.bestScore = Math.max(meta.bestScore || 0, sc);
    // Which kind of device and input this run used (title-screen nudges + Hybrid Schedule achievements)
    const touchDev = navigator.maxTouchPoints > 1, shortSide = Math.min(screen.width, screen.height);
    const form = !touchDev ? "desktop" : shortSide >= 700 ? "tablet" : "phone";
    meta.played = meta.played || {};
    meta.played[form] = (meta.played[form] || 0) + 1;
    if (window._padUsedThisRun) meta.played.controller = (meta.played.controller || 0) + 1;
    meta.lastRun = { age: +currentAge.toFixed(1), score: sc, killer: isWin ? null : ((ENEMIES[killer] && ENEMIES[killer].name) || killer), win: !!isWin, char: meta.selectedChar, at: Date.now(), form };
    window.achEvent("devices", Object.assign({}, meta.played)); // a copy: achEvent tags its data with the hero
  } catch (e) {}
  meta.bestAge = Math.max(meta.bestAge || 40, currentAge);
  [40, 50, 60, 70, 80].forEach(dec => {
    if (currentAge >= dec && !meta.unlockedDecades.includes(dec)) {
      meta.unlockedDecades.push(dec);
    }
  });
  saveMeta(meta);
  setMusicPlaying(false);
  restartGame = () => { hideAllModals(); scene.scene.restart(); };
  scene.physics.pause();
  const winLines80 = [
    "HAPPY RETIREMENT AT 80! Your 401(k) finally vested, your mortgage is paid off, and you unlocked the 3:00 PM Early Bird Buffet!",
    "YOU MADE IT TO 80! Four decades of corporate buzzwords, HOA fines, and back spasms defeated. Time to nap on the porch!",
    "AGE 80 ACHIEVED! You outlasted the mandatory return-to-office memos and earned a lifetime supply of orthopedic slip-ons."
  ];
  const winLines100 = [
    "CENTENARIAN LEGEND (AGE 100)! You conquered the 6 AM Pickleball League, outlived the HOA Board, and Father Time asked for your autograph!",
    "HAPPY 100th BIRTHDAY! You beat all 20 Bonus Senior Rounds, mastered the 3 PM dinner rush, and achieved immortality!",
    "THE BIG 1-0-0! Not even Medicare Part D Copays or the 6 AM Pickleball Champion could slow you down."
  ];
  const winLinesRetire = [
    `RETIRED AT ${Math.round(currentAge)}! You outlasted the Performance Review, the Mortgage and a red convertible. The cake says "Good Luck" in blue icing.`,
    `CLOCKED OUT FOR GOOD AT ${Math.round(currentAge)}! Your coworkers signed a card. Most of them spelled your name right.`,
    `YOU MADE IT TO ${Math.round(currentAge)}! Gold watch, sheet cake, and a speech from someone in HR you've never met.`
  ];
  if (isWin && runMode === "midlife") { meta.fullLifeUnlocked = true; saveMeta(meta); }
  const cause = isWin
    ? Phaser.Utils.Array.GetRandom(runMode === "midlife" ? winLinesRetire : (currentAge >= 99.5 ? winLines100 : winLines80))
    : Phaser.Utils.Array.GetRandom(DEATHS[killer] || DEATHS.fallback);

  renderGameOverModal(scene, cause, isWin, killer);
}

// Pop a floating damage number above an enemy that drifts up and fades out.
// Damage numbers (Nov 4, Fable review #2): one bitmap font in the game's pixel font (Silkscreen) and a pool of
// about 40 reusable numbers, instead of a brand-new text texture for every hit. At most 6 new numbers per frame.
const DMG = { pool: 40, perFrame: 6, font: "ms_dmgfont", chars: "-0123456789+" };
function dmgFontReady(sc) {
  if (sc.cache.bitmapFont.exists(DMG.font)) return true;
  if (!(document.fonts && document.fonts.check && document.fonts.check("16px Silkscreen"))) return false; // wait for the pixel font
  const cw = 15, ch = 20, key = DMG.font + "_tex";
  if (!sc.textures.exists(key)) {
    const t = sc.textures.createCanvas(key, cw * DMG.chars.length, ch), c = t.getContext();
    c.font = "16px Silkscreen"; c.textAlign = "center"; c.textBaseline = "middle"; c.lineJoin = "round";
    [...DMG.chars].forEach((g, i) => { const x = i * cw + cw / 2, y = ch / 2 + 1;
      c.lineWidth = 4; c.strokeStyle = "#171C35"; c.strokeText(g, x, y); c.fillStyle = "#FFF0CF"; c.fillText(g, x, y); });
    t.refresh(); t.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
  sc.cache.bitmapFont.add(DMG.font, Phaser.GameObjects.RetroFont.Parse(sc, { image: key, width: cw, height: ch, chars: DMG.chars, charsPerRow: DMG.chars.length, "spacing.x": 0, "spacing.y": 0, "offset.x": 0, "offset.y": 0 }));
  return true;
}
function popDamageNumber(sc, x, y, amount, crit) {
  const big = amount >= 2;
  const pt = project3DToPhaserWorld(sc, x, 34, y);
  const frame = sc.game.loop.frame;
  if (sc._dmgFrame !== frame) { sc._dmgFrame = frame; sc._dmgCount = 0; }
  if (++sc._dmgCount > DMG.perFrame) return; // a huge swarm hit at once: skip the extras
  if (!dmgFontReady(sc)) { // fallback until the pixel font has loaded
    const txt = sc.add.text(pt.x + Phaser.Math.Between(-8, 8), pt.y - 14, `-${amount}`, { fontFamily: "monospace", fontSize: big ? "16px" : "13px", fontStyle: "bold", color: big ? "#EF9347" : "#FFF0CF", stroke: "#171C35", strokeThickness: 3 }).setOrigin(0.5).setDepth(49500);
    sc.tweens.add({ targets: txt, y: txt.y - 26, alpha: 0, duration: 460, ease: "Cubic.easeOut", onComplete: () => txt.destroy() });
    return;
  }
  const pool = sc._dmgPool || (sc._dmgPool = []);
  let t = pool.find(o => !o.visible);
  if (!t) {
    if (pool.length >= DMG.pool) return; // every number is still on screen: skip this one
    t = sc.add.bitmapText(0, 0, DMG.font, "", 20).setOrigin(0.5).setDepth(49500); // above the lighting so numbers stay readable
    pool.push(t);
  }
  sc.tweens.killTweensOf(t);
  t.setText(`-${amount}`).setPosition(pt.x + Phaser.Math.Between(-8, 8), pt.y - 14).setAlpha(1).setVisible(true)
    .setScale(crit ? 1.3 : big ? 1 : 0.8).setTint(crit ? 0xC45C4B : big ? 0xEF9347 : 0xffffff);
  sc.tweens.add({ targets: t, y: t.y - 26, alpha: 0, scale: crit ? 1.7 : big ? 1.25 : 0.8, duration: 460, ease: "Cubic.easeOut", onComplete: () => t.setVisible(false) });
}

// Burst shredded paper / confetti scraps when an enemy is paid off or defeated!
function burstConfetti(sc, x, y, baseColor, count = 6) {
  const cols = [baseColor || 0x6fbf73, 0xffffff, 0xf5c542];
  for (let i = 0; i < count; i++) {
    const ang = (Math.PI * 2 * i) / count + Phaser.Math.FloatBetween(-0.3, 0.3);
    const dist = Phaser.Math.Between(18, 38);
    const scrap = sc.add.rectangle(x, y, 5, 3, cols[i % cols.length]).setDepth(14);
    sc.tweens.add({
      targets: scrap,
      x: x + Math.cos(ang) * dist,
      y: y + Math.sin(ang) * dist,
      angle: Phaser.Math.Between(-180, 180),
      alpha: 0,
      duration: 360,
      onComplete: () => scrap.destroy()
    });
  }
}

// Apply damage to one enemy (shared by all weapons so gems, chests, flashes and sounds always match).
function damageBill(bill, amount) {
  if (!bill.active) return;
  if (bill.ghost) return; // faded 3 AM Thoughts ignore auras too
  const sc = bill.scene;
  if (runElapsedMs < buffs.damageUntil) amount = Math.ceil(amount * buffs.damageMult); // Focus Block
  let crit = false;
  if (stats.crit && Math.random() < stats.crit) { amount *= 2; crit = true; } // Bifocals
  // The Gold Watch can't be beaten, only wound back: hits push it away and slow its hands (Rami, Nov 3).
  if (bill.kind === "goldWatch" && window.GoldWatch) { GoldWatch.wind(sc, bill, amount, player); if (window.Juice) Juice.hit(sc, bill, player, runElapsedMs); return; }
  if (bill.kind === "theReaper") return; // the finish line can't be hurt; walk into it
  bill.hp -= amount;
  popDamageNumber(sc, bill.x, bill.y, amount, crit);
  if (bill.hp > 0) {
    sfx("hit");
    if (bill.isBoss) bill.tag.setText(`${ENEMIES[bill.kind].label}:${bill.hp}`);
    bill.setTintFill(0xffffff); // quick white flash so you can see the hit
    // Squash-and-stretch on the drawn sprite plus a small shove (src/juice.js). The hit box never changes size.
    if (window.Juice) Juice.hit(sc, bill, player, runElapsedMs);
    sc.time.delayedCall(60, () => { if (bill.active) bill.clearTint(); });
  } else {
    runKills += bill.isBoss ? 25 : 1; // bosses count extra toward your score
    window.achEvent(bill.isBoss ? "bossKill" : "kill", { kind: bill.kind });
    sfx(bill.isBoss ? "bossDefeat" : "billPaid");
    const E = ENEMIES[bill.kind] || ENEMIES.bill;
    if (bill.isBoss && window.BossDown) BossDown.play(sc, bill, E.color); // the big, slow-motion boss defeat (src/boss-down.js)
    else if (window.Juice) Juice.death(sc, bill); // flash, squash and pop
    if (window.Remains && !bill.clockOut) Remains.add(sc, bill.x, bill.y, E.color, bill.isBoss, bill.kind); // a little pile of scraps that fades (src/remains.js)
    burstConfetti(sc, bill.x, bill.y, E.color, bill.isBoss ? 16 : 8);
    if (bill.elite) { // the jackpot
      const EL = INTENSITY.elites;
      sc.cameras.main.shake(90, 0.004);
      burstConfetti(sc, bill.x, bill.y, 0xff7a5c, 14);
      for (let i = 0; i < EL.gems; i++) gems.create(bill.x + Phaser.Math.Between(-18, 18), bill.y + Phaser.Math.Between(-14, 14), "gem").setDepth(3);
      for (let i = 0; i < EL.coins; i++) spawnCoin(bill.x + (i - 0.5) * 14, bill.y + 12, 1);
      maybeDropSalad(sc, bill.x, bill.y - 10, EL);
    }
    if (bill.isBoss) {
      window.lastBossDownMs = runElapsedMs; // the next boss gives you a breather to open the chest (BOSS_QUEUE.breatherMs)
      sc.cameras.main.shake(220, 0.012);
      const ch = chests.create(bill.x, bill.y, "chest").setDepth(3);
      if (window.Lighting) Lighting.fx("lootDrop", bill.x, bill.y);
      ch.bossKind = bill.kind; // decides how many rewards the chest pays (PICKUPS.bossChest.tiers)
      ch.readyAt = runElapsedMs + ((window.BOSS_DOWN && BOSS_DOWN.chestDelayMs) || 2000); // let the defeat animation play before the chest comes to you
      if (window.Spotlight) Spotlight.tip("chest"); // first boss chest ever
      ch.tag = sc.add.text(bill.x, bill.y, "BONUS", {
        fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#EF9347", stroke: "#171C35", strokeThickness: 3
      }).setOrigin(0.5, 1.6).setDepth(4);
      for (let i = -2; i <= 2; i++) spawnCoin(bill.x + i * 10, bill.y + 14, 2);
      if (window.pushContextEvent) {
        window.showLowerThird("win", "SURVIVED", `You outlasted ${E.name}. Grab the gold chest.`, 5000);
      }
    } else if (bill.kind === "officeGossip") {
      // Elite Reply-All Chain drops 3 Wisdom gems, 2 401(k) Coins (one 2x value!), AND splits into 2 fast Late Fees!
      for (let i = -1; i <= 1; i++) gems.create(bill.x + i * 10, bill.y, "gem").setDepth(3);
      spawnCoin(bill.x - 8, bill.y + 10, 1);
      spawnCoin(bill.x + 8, bill.y + 10, 2);
      createEnemy(sc, "lateFee", bill.x - 16, bill.y - 10);
      createEnemy(sc, "lateFee", bill.x + 16, bill.y + 10);
    } else {
      gems.create(bill.x, bill.y, "gem").setDepth(3); // leave a Wisdom gem behind
      if (Math.random() < ITEM_DROPS.fromEnemy) spawnFieldItem(sc, bill.x, bill.y + 12); // rare item drop
      const yld = window.getCoinYieldInfo();
      if (Math.random() < yld.dropChance) {
        spawnCoin(bill.x + 10, bill.y, 1);
      }
    }
    bill.tag.destroy();
    bill.destroy(); // paid in full
  }
}

// A splash landed on a Bill: the splash is used up (unless evolved to Cold Brew, which pierces!), the Bill loses health.
function hitBill(splash, bill) {
  if (!splash.active || !bill.active) return; // already gone this frame
  if (bill.ghost) return; // splashes pass right through a faded 3 AM Thought
  if (window.Lighting) Lighting.fx("coffeeHit", bill.x, bill.y); // a warm splash of light where it lands
  if (splash.pierce) {
    if (splash.hitSet.has(bill)) return; // already pierced this enemy
    splash.hitSet.add(bill);
    splash.pierce--;
    if (splash.pierce <= 0) splash.destroy();
  } else {
    splash.destroy();
  }
  damageBill(bill, stats.damage);
}

const PLANT_REGROW_MS = 75000; // a smashed plant grows back after 75 seconds
// Smashable Potted Office Plants ("prop_plant")! Crack them open for Leftover Pizza (+2 HP), 401(k) Coins, or Bonus Gems!
function damagePlant(prop, amount) {
  if (prop && prop.brk && window.Breakables) { Breakables.damage(prop.scene, prop, amount, runElapsedMs); return; } // printers, cabinets... (src/breakables.js)
  if (!prop || !prop.visible || prop.propKind !== "prop_plant") return;
  const sc = prop.scene;
  prop.hp = (prop.hp || 2) - amount;
  if (prop.hp > 0) {
    sfx("hit");
    prop.setTintFill(0xffffff);
    sc.tweens.add({ targets: prop, scaleX: 1.18, scaleY: 0.85, duration: 55, yoyo: true });
    sc.time.delayedCall(60, () => { if (prop.active) prop.clearTint(); });
  } else {
    sfx("billPaid");
    burstConfetti(sc, prop.x, prop.y, 0x52bf6a, 10);
    if (prop.cellKey) window.smashedPlants.add(prop.cellKey);
    window.achEvent("plant");
    prop.setVisible(false);
    if (prop.body) prop.body.enable = false;
    // Plants grow back after a while, so a long run never runs out of pizza (Rami, Nov 2).
    const baseSX = prop.scaleX, baseSY = prop.scaleY;
    const regrow = () => {
      if (!prop.active || prop.visible || gameOver) return;
      if (Phaser.Math.Distance.Between(prop.x, prop.y, player.x, player.y) < 90) { sc.time.delayedCall(3000, regrow); return; } // not on top of you
      prop.hp = 2; prop.setVisible(true).setScale(baseSX * 0.2, baseSY * 0.2); prop.clearTint();
      if (prop.body) { prop.body.enable = true; prop.body.updateFromGameObject && prop.body.updateFromGameObject(); }
      if (prop.cellKey) window.smashedPlants.delete(prop.cellKey);
      sc.tweens.add({ targets: prop, scaleX: baseSX, scaleY: baseSY, duration: 420, ease: "Back.Out" });
    };
    sc.time.delayedCall(PLANT_REGROW_MS, regrow);

    if (Math.random() < ITEM_DROPS.fromPlant * (window.modFx ? modFx("plantItemMult", 1) : 1)) spawnFieldItem(sc, prop.x, prop.y + 14);
    // Roll plant loot reward: 45% Leftover Pizza (+2 HP) + 1 Coin, 35% 2x 401(k) Coins, 20% 3x Coins + 1 Gem Jackpot!
    const roll = Math.random();
    let popupTxt = "🪙 +401(k)!";
    if (roll < 0.45) {
      { const pz = window.pizzas.create(prop.x - 6, prop.y, "pizza").setDepth(3); pz.dieAt = runElapsedMs + ((window.FLOOR_LIMITS && FLOOR_LIMITS.pizzaLifeMs) || 60000); }
      spawnCoin(prop.x + 10, prop.y, 1);
      popupTxt = "🍕 PIZZA + 🪙!";
      if (window.pushContextEvent) {
        /* plant loot: floating popup only (lower third stays quiet) */
      }
    } else if (roll < 0.80) {
      spawnCoin(prop.x - 6, prop.y, 1);
      spawnCoin(prop.x + 6, prop.y, 1);
      popupTxt = "🪙 2x 401(k)!";
      if (window.pushContextEvent) {
        /* plant loot: floating popup only (lower third stays quiet) */
      }
    } else {
      spawnCoin(prop.x - 10, prop.y, 1);
      spawnCoin(prop.x, prop.y + 4, 2);
      spawnCoin(prop.x + 10, prop.y, 1);
      gems.create(prop.x, prop.y - 8, "gem").setDepth(3);
      popupTxt = "🎰 401(k) JACKPOT!";
      if (window.pushContextEvent) {
        /* plant loot: floating popup only (lower third stays quiet) */
      }
    }
    const pt = project3DToPhaserWorld(sc, prop.x, 32, prop.y);
    const msg = sc.add.text(pt.x, pt.y - 12, popupTxt, {
      fontFamily: "monospace", fontSize: "12px", fontStyle: "bold", color: "#ffe042", stroke: "#12152a", strokeThickness: 3
    }).setOrigin(0.5).setDepth(16);
    sc.tweens.add({ targets: msg, y: msg.y - 22, alpha: 0, duration: 650, onComplete: () => msg.destroy() });
  }
}

// Anything you can smash: potted plants, plus printers, cabinets, vending machines... once their art has loaded.
const isSmashable = p => window.Breakables ? Breakables.isSmashable(p) : !!(p && p.visible && p.propKind === "prop_plant");
function smashTargets() {
  const list = stageProps ? stageProps.slice() : [];
  if (window.propGroup) window.propGroup.getChildren().forEach(p => { if (p.brk && !list.includes(p)) list.push(p); });
  return list;
}
function hitProp(splash, prop) {
  if (!splash.active || !isSmashable(prop)) return;
  splash.destroy();
  damagePlant(prop, stats.damage);
}

// Weapon 2: Dad Joke. A yellow ring ripples out, your character speaks a Dad Joke out loud,
// and a comic speech bubble follows above your head for ~2.8 seconds so you can read it easily!
let playerSpeech = null, lastJokeToldAt = 0;
function showPlayerSpeechBubble(scene, text, color = "#ffe042", holdMs = 2300) {
  if (playerSpeech && playerSpeech.active) playerSpeech.destroy();
  const pt = project3DToPhaserWorld(scene, player.x, (player.elev || 0) + 68, player.y);
  playerSpeech = scene.add.text(pt.x, pt.y - 52, `💬 "${text}"`, {
    fontFamily: "monospace",
    fontSize: "15px",
    align: "center",
    wordWrap: { width: Math.min(280, scene.scale.width - 40), useAdvancedWrap: true },
    fontStyle: "bold",
    color,
    backgroundColor: "#12152aee",
    padding: { x: 10, y: 6 },
    stroke: "#090b14",
    strokeThickness: 3
  }).setOrigin(0.5, 1).setDepth(60);
  playerSpeech.holdUntil = runElapsedMs + holdMs;
  playerSpeech.fadeEnd = runElapsedMs + holdMs + 550;
  scene.tweens.add({ targets: playerSpeech, scaleX: { from: 0.85, to: 1 }, scaleY: { from: 0.85, to: 1 }, duration: 140, ease: "Back.easeOut" });
}

// The Dad Joke's punchline blast (Nov 2): a quick yellow flash, a thick shockwave, rays bursting out and a few
// "HA!"s flying off. All visual: damage is handled in fireDadJoke.
function punchlineBlast(scene, x, y, r, J) {
  const B = J.blast || {}, col = J.color, depth = (player.depth || 5) + 0.5;
  const flash = scene.add.circle(x, y, r * 0.35, 0xfff3b0, 0.55).setDepth(depth - 0.2);
  scene.tweens.add({ targets: flash, radius: r, alpha: 0, duration: 200, ease: "Quad.Out", onComplete: () => flash.destroy() });
  const ring = scene.add.circle(x, y, 14).setStrokeStyle(9, col, 1).setDepth(depth);
  scene.tweens.add({ targets: ring, radius: r, alpha: 0, duration: 420, ease: "Cubic.Out", onComplete: () => ring.destroy() });
  const rays = scene.add.graphics().setDepth(depth);
  const n = B.rays || 12, off = Math.random() * Math.PI;
  const prog = { t: 0 };
  scene.tweens.add({ targets: prog, t: 1, duration: 280, ease: "Quad.Out",
    onUpdate: () => {
      rays.clear().lineStyle(5, col, 1 - prog.t * 0.8);
      for (let i = 0; i < n; i++) {
        const a = off + i / n * Math.PI * 2, r0 = r * (0.25 + 0.6 * prog.t), r1 = r * (0.5 + 0.55 * prog.t);
        rays.lineBetween(x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a) * r1, y + Math.sin(a) * r1);
      }
    },
    onComplete: () => rays.destroy() });
  const words = B.words || ["HA!"];
  for (let i = 0; i < (B.has || 3); i++) {
    const a = Math.random() * Math.PI * 2, w = Phaser.Utils.Array.GetRandom(words);
    const t = scene.add.text(x, y - 10, w, { fontFamily: "monospace", fontSize: w.length > 4 ? "13px" : "18px", fontStyle: "bold",
      color: "#ffe042", stroke: "#3a2a00", strokeThickness: 4 }).setOrigin(0.5).setDepth(depth + 1).setAngle(Phaser.Math.Between(-18, 18));
    scene.tweens.add({ targets: t, x: x + Math.cos(a) * r * 0.9, y: y + Math.sin(a) * r * 0.9 - 14, alpha: 0, scale: 1.25,
      duration: 650, ease: "Quad.Out", onComplete: () => t.destroy() });
  }
  if (B.shake) scene.cameras.main.shake(80, B.shake);
}

function fireDadJoke(scene) {
  if (!stats.dadJoke) return;
  sfx("dadJoke");
  const J = WEAPONS.dadJoke, r = stats.jokeRadius * (window.modFx ? modFx("jokeRadiusMult", 1) : 1); // Reply-All Tax gives the groan more reach
  if (window.Lighting) Lighting.fx("dadJoke", player.x, player.y, { scale: r, follow: player });
  if (window.viewModeIdx > 0) {
    spawn3DRing(player.x, player.y, r, J.color);
  } else {
    punchlineBlast(scene, player.x, player.y, r, J);
  }
  // Prefer jokes for the stage you're in (office, hospital, home...), mixed with a few all-purpose ones.
  const stJ = (typeof getActiveStage === "function") ? getActiveStage(currentAge, meta) : null;
  const stagePool = (stJ && J.linesByStage && J.linesByStage[stJ.id]) || [];
  const base = (currentAge >= 80 && J.seniorLines) ? J.seniorLines.concat(J.lines) : J.lines;
  const pool = stagePool.length && Math.random() < 0.75 ? stagePool : base;
  // The groan ring hits every time, but the joke itself is only told now and then:
  // right after you unlock or upgrade Dad Joke, plus an occasional bonus joke (WEAPONS.dadJoke.bonusEveryMs).
  const bonusDue = runElapsedMs - lastJokeToldAt >= (J.bonusEveryMs || 50000);
  if (stats.jokeAnnounce || bonusDue) {
    stats.jokeAnnounce = false;
    lastJokeToldAt = runElapsedMs;
    const line = Phaser.Utils.Array.GetRandom(pool);
    showPlayerSpeechBubble(scene, line, "#ffe042", 3400);
    if (typeof speakDadJoke === "function") speakDadJoke(line, currentAge >= 80 ? 0.84 : 0.94, 1.05);
  }

  bills.getChildren().slice().forEach(bill => {
    const d = Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y);
    if (d <= r) {
      // The groan: everyone in range stops to cringe for a moment and staggers back (bosses just take the damage).
      if (!bill.isBoss && d > 0) {
        bill.cringeUntil = runElapsedMs + ((stats.punStorm && J.cringeMsEvo) || J.cringeMs || 0);
        const push = (J.pushSpeed || 0) * (window.modFx ? modFx("pushSpeedMult", 1) : 1);
        bill.setVelocity((bill.x - player.x) / d * push, (bill.y - player.y) / d * push);
      }
      damageBill(bill, stats.jokeDamage);
    }
  });
  if (stageProps || window.propGroup) {
    smashTargets().forEach(p => {
      if (isSmashable(p) && Phaser.Math.Distance.Between(player.x, player.y, p.x, p.y) <= r) {
        damagePlant(p, stats.jokeDamage);
      }
    });
  }
}

// Shove an enemy along (dx, dy) by up to `dist` px, in small steps, stopping before a wall, furniture or
// the edge of the floor. (Nov 2, Derek's bug: the "No." shove used to teleport Bills straight through thin
// walls into the dark unbuilt areas, where they lined up along the wall and couldn't reach you.)
function shoveEnemy(e, dx, dy, dist) {
  const sa = e.scene && e.scene.worldArt && e.scene.worldArt.startArea;
  let moved = 0;
  while (moved < dist) {
    const s = Math.min(8, dist - moved), nx = e.x + dx * s, ny = e.y + dy * s;
    if ((window.NAV && !NAV.isOpen(nx, ny)) || (sa && sa.contains && !sa.contains(nx, ny))) break;
    e.x = nx; e.y = ny; moved += s;
  }
  return moved;
}
window.shoveEnemy = shoveEnemy;

// Weapon 3: The Word "No." A teal shockwave shoves nearby Bills away and damages them (and smashes plants!).
function fireWordNo(scene) {
  if (!stats.wordNo) return;
  sfx("wordNo");
  const N = WEAPONS.wordNo, r = stats.noRadius;
  if (window.Lighting) Lighting.fx("wordNo", player.x, player.y, { scale: r, follow: player }); // a bright ring pushes the dark back
  if (window.viewModeIdx > 0) {
    spawn3DRing(player.x, player.y, r, N.color);
  } else {
    const wave = scene.add.circle(player.x, player.y, 16, N.color, 0.18).setStrokeStyle(4, N.color);
    scene.tweens.add({ targets: wave, radius: r, alpha: 0, duration: 320, onComplete: () => wave.destroy() });
  }
  const pt = project3DToPhaserWorld(scene, player.x, 54, player.y);
  // Healthy Boundaries heals on every OTHER pulse now (was every pulse).
  if (stats.healthyBoundaries) stats.boundariesPulse = (stats.boundariesPulse || 0) + 1;
  const healPulse = stats.healthyBoundaries && stats.boundariesPulse % (N.healthyHealEvery || 2) === 0 && hp < stats.maxHp;
  const shout = scene.add.text(pt.x, pt.y - 28, healPulse ? "NO! (+1 HP)" : (stats.healthyBoundaries ? "NO!" : "NO."), {
    fontFamily: "monospace", fontSize: "16px", color: "#6fd9c4"
  }).setOrigin(0.5).setDepth(16);
  scene.tweens.add({ targets: shout, y: shout.y - 20, alpha: 0, duration: 500, onComplete: () => shout.destroy() });
  if (healPulse) { hp = Math.min(stats.maxHp, hp + healAmt(N.healthyHealAmt || 1)); drawHpBar(); }

  bills.getChildren().slice().forEach(bill => {
    const d = Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y);
    if (d <= r && d > 0) {
      const dx = (bill.x - player.x) / d, dy = (bill.y - player.y) / d; // direction away from you
      shoveEnemy(bill, dx, dy, Math.min(stats.noPush, N.noPushCap || Infinity) * (bill.isBoss ? (N.bossPushMult ?? 0.12) : 1)); // bosses barely budge
      const sz = (ENEMIES[bill.kind] && ENEMIES[bill.kind].size) || 24;
      bill.tag.setPosition(bill.x, bill.y - sz / 2 - 6);
      damageBill(bill, stats.noDamage);
    }
  });
  if (stageProps || window.propGroup) {
    smashTargets().forEach(p => {
      if (isSmashable(p) && Phaser.Math.Distance.Between(player.x, player.y, p.x, p.y) <= r) {
        damagePlant(p, stats.noDamage);
      }
    });
  }
}

// Find the Bill closest to the player (or a nearby Potted Plant if no Bill is close!).
function nearestBill() {
  let best = null, bestDist = Infinity;
  bills.getChildren().forEach(bill => {
    const d = Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y);
    if (d < bestDist) { best = bill; bestDist = d; }
  });
  if (best && bestDist <= 250) return best;
  if (stageProps || window.propGroup) {
    let bestPlant = null, plantDist = 210;
    smashTargets().forEach(p => {
      if (isSmashable(p)) {
        const d = Phaser.Math.Distance.Between(player.x, player.y, p.x, p.y);
        if (d < plantDist) { bestPlant = p; plantDist = d; }
      }
    });
    if (bestPlant) return bestPlant;
  }
  return best;
}

// Throw one splash of coffee at the nearest Bill (or a 3-shot piercing spread once evolved to Cold Brew!).
function fireCoffee(scene) {
  const target = nearestBill();
  if (!target) return; // nothing to aim at, save the coffee
  const C = WEAPONS.coffeeSplash;
  const baseAng = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
  const angles = stats.coldBrew ? [baseAng - 0.22, baseAng, baseAng + 0.22] : [baseAng];
  angles.forEach(ang => {
    const s = splashes.create(player.x, player.y, "splash").setDepth(4);
    s.startX = player.x; s.startY = player.y; // remember where it started, to measure range
    if (stats.coldBrew) { s.pierce = 3; s.hitSet = new Set(); s.setTint(0xf0a24f); }
    s.setVelocity(Math.cos(ang) * C.speed, Math.sin(ang) * C.speed);
  });
  sfx("shoot");
}

// Pick the active wave entry from SPAWNING.waves for your current age.
function currentWave() {
  let w = SPAWNING.waves[0];
  SPAWNING.waves.forEach(entry => { if (currentAge >= entry.minAge) w = entry; });
  return w;
}

// Create one enemy of the given kind at (x, y), scaling HP, speed, and Life Stage labels with your Age!
function createEnemy(scene, kind, x, y) {
  if (kind === "groupChat" && window.Telemetry && Telemetry.note) Telemetry.note("groupChat");
  if (window.NAV) { // never spawn inside a desk or somewhere that can't reach you (like behind a locked door)
    const spot = window.NAV.fixSpawn(x, y);
    if (!spot) return null;
    [x, y] = spot;
  }
  if (scene.worldArt && scene.worldArt.startArea) {
    const spot = scene.worldArt.startArea.resolveSpawn(x, y);
    if (!spot) return null;
    [x, y] = spot;
  }
  if (window.firstTimeTip) window.firstTimeTip(kind);
  const E = ENEMIES[kind];
  const e = bills.create(x, y, E.tex || kind).setDepth(4).setScale(E.scale || 1); // hit box grows with the scale too
  scene.enemyArt.attach(e, kind);
  if (E.tint) e.setTint(E.tint);
  const yrs = Math.max(0, currentAge - 40);
  const perYear = (window.INTENSITY && window.INTENSITY.hpPerYear) || 0.09;
  const lvlScale = 1 + Math.max(0, level - 1) * ((window.INTENSITY && window.INTENSITY.hpPerLevel) || 0); // the stronger you get, the tougher they get
  const hpScale = (1 + yrs * perYear + (currentAge >= 80 ? (currentAge - 80) * 0.3 : 0)) * lvlScale; // smooth toughness ramp
  e.kind = kind;
  e.hp = Math.max(1, Math.round(E.hp * hpScale * (1 + tax("enemyHpMult"))));
  e.speed = Math.round(E.speed * (1 + Math.min(0.8, yrs * 0.012)) * (runSprint && window.SPRINT ? SPRINT.enemySpeedMult : 1));
  if (window.modFx) { // age 50+ modifiers: Rent Hike (Bills), Reply-All Tax (Gossip)
    if (kind === "bill") e.hp = Math.ceil(e.hp * modFx("billHpMult", 1));
    if (kind === "officeGossip") e.hp = Math.ceil(e.hp * modFx("gossipHpMult", 1));
  }
  e.damage = E.damage + (kind === "officeGossip" && window.modFx ? modFx("gossipDamageAdd", 0) : 0); // age bonus comes only from INTENSITY.hitDamageByAge (in hurtPlayer), so it can't stack twice
  e.bornAt = runElapsedMs;
  const st = (typeof getActiveStage === "function") ? getActiveStage(currentAge, meta) : null;
  const lbl = (currentAge >= 80 && E.seniorLabel)
    ? E.seniorLabel
    : ((st && st.labels && st.labels[kind]) ? st.labels[kind] : E.label);
  e.tag = scene.add.text(x, y - E.size / 2 - 6, lbl, {
    fontFamily: "monospace", fontSize: "10px", color: currentAge >= 80 ? "#f5c542" : "#e8e9f3"
  }).setOrigin(0.5).setDepth(5);
  if (window.Lighting && (kind === "spamCall" || kind === "groupChat")) Lighting.follow(e, kind); // phone screens glow; the Group Chat lights up while typing
  const EL = window.INTENSITY && INTENSITY.elites;
  const duelE = window.GoldWatch ? GoldWatch.duel() : null;
  if (EL && EL.names[kind] && Math.random() < ageCurve(EL.chanceByAge, currentAge) * ((duelE && duelE.eliteChanceMult) || 1)) makeElite(e, E, EL);
  return e;
}

// Turn a fresh enemy into an elite: bigger, tougher (always several hits), slower, labeled in red.
function makeElite(e, E, EL) {
  e.elite = true;
  if (window.Lighting) Lighting.follow(e, "elite"); // red halo
  if (window.Spotlight) Spotlight.tip("elite"); // first elite ever
  e.eliteScale = EL.scale;
  e.setScale((E.scale || 1) * EL.scale);
  e.hp = Math.max(Math.round(e.hp * EL.hpMult * (window.modFx ? modFx("eliteHpMult", 1) : 1)), Math.ceil((stats.damage || 1) * EL.minHits));
  e.maxHp = e.hp;
  e.speed = Math.round(e.speed * EL.speedMult);
  e.damage = (e.damage || 1) + (EL.damageAdd || 0);
  if (e.tag) e.tag.setText(EL.names[e.kind]).setColor("#ff8a6b").setFontStyle("bold").setFontSize(11).setStroke("#2a0d0d", 3);
}

// Put one enemy just outside the visible screen, on a random edge, based on the current Age wave.
// Read a value off an age table like [[40, 1], [60, 3]], blending smoothly between rows.
function ageCurve(table, age) {
  if (!table || !table.length) return 0;
  if (age <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [a1, v1] = table[i], [a0, v0] = table[i - 1];
    if (age <= a1) return v0 + (v1 - v0) * ((age - a0) / (a1 - a0));
  }
  return table[table.length - 1][1];
}

// Pick an enemy type from the current wave's raffle tickets.
function rollWaveKind() {
  const wave = currentWave();
  // Age 50+ modifiers can tilt the everyday mix (src/modifiers.js), e.g. Ghost Hour adds more 3 AM Thoughts.
  const bias = window.modFx ? modFx("waveBias", null) : null;
  let mix = bias ? wave.mix.map(([k, w]) => [k, w + (bias[k] || 0)]).concat(Object.keys(bias).filter(k => !wave.mix.some(([m]) => m === k) && ENEMIES[k]).map(k => [k, bias[k]])) : wave.mix;
  const duelS = window.GoldWatch ? GoldWatch.duel() : null; // no Group Chats, Math Homework or Calendar Invites during the Gold Watch fight
  if (duelS && duelS.pauseKinds) { const kept = mix.filter(([k]) => !duelS.pauseKinds.includes(k)); if (kept.length) mix = kept; }
  const totalWeight = mix.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * totalWeight, kind = mix[0][0];
  for (const [k, w] of mix) {
    if ((roll -= w) <= 0) { kind = k; break; }
  }
  return kind;
}

// The everyday drip: a small PACK of enemies just outside the screen. Packs get bigger each decade.
function spawnBill(scene) {
  const I = window.INTENSITY || {};
  const duelS = window.GoldWatch ? GoldWatch.duel() : null;
  const cap = Math.round((ageCurve(I.maxOnScreenByAge, currentAge) || SPAWNING.maxOnScreen) * ((duelS && duelS.maxOnScreenMult) || 1));
  if (bills.countActive() >= cap) return;
  const view = scene.cameras.main.worldView; // the rectangle of the world you can currently see
  const m = window.viewModeIdx === 1 ? 220 : SPAWNING.offscreenMargin;
  let x, y;
  switch (Phaser.Math.Between(0, 3)) {
    case 0: x = Phaser.Math.Between(view.left, view.right); y = view.top - m; break;    // above
    case 1: x = Phaser.Math.Between(view.left, view.right); y = view.bottom + m; break; // below
    case 2: x = view.left - m; y = Phaser.Math.Between(view.top, view.bottom); break;   // left
    default: x = view.right + m; y = Phaser.Math.Between(view.top, view.bottom);        // right
  }
  const pack = Math.max(1, Math.round(ageCurve(I.packSizeByAge, currentAge) || 1)) + Math.floor(Math.max(0, level - 1) * (I.packPerLevel || 0)) + Math.floor(tax("packAdd")) + dynPackAdd() + (window.modFx ? modFx("packAdd", 0) : 0); // stronger you = bigger crowds
  const packN = duelS ? Math.max(1, Math.round(pack * (duelS.packSizeMult || 1))) : pack;
  for (let i = 0; i < packN && bills.countActive() < cap; i++) {
    createEnemy(scene, rollWaveKind(), x + Phaser.Math.Between(-50, 50), y + Phaser.Math.Between(-50, 50));
  }
}

// Swarm events: set-piece formations (ring, wall, pack), announced in the lower third.
function spawnSwarm(scene, ev) {
  const view = scene.cameras.main.worldView;
  const m = SPAWNING.offscreenMargin + 20;
  const kindFor = () => ev.kind === "mixed" ? rollWaveKind() : ev.kind;
  const growth = (window.INTENSITY && window.INTENSITY.swarmGrowthPerYear) || 0;
  ev = Object.assign({}, ev, { count: Math.round(ev.count * (1 + Math.max(0, currentAge - ev.minAge) * growth)) });
  const spots = [];
  if (ev.pattern === "ring") {
    const r = Math.hypot(view.width, view.height) / 2 + m;
    for (let i = 0; i < ev.count; i++) {
      const a = (i / ev.count) * Math.PI * 2;
      spots.push([player.x + Math.cos(a) * r, player.y + Math.sin(a) * r]);
    }
  } else if (ev.pattern === "wall") {
    const side = Phaser.Math.Between(0, 3);
    for (let i = 0; i < ev.count; i++) {
      const t = (i + 0.5) / ev.count;
      if (side === 0) spots.push([view.left + t * view.width, view.top - m]);
      else if (side === 1) spots.push([view.left + t * view.width, view.bottom + m]);
      else if (side === 2) spots.push([view.left - m, view.top + t * view.height]);
      else spots.push([view.right + m, view.top + t * view.height]);
    }
  } else { // pack
    const a = Math.random() * Math.PI * 2, r = Math.hypot(view.width, view.height) / 2 + m;
    const cx = player.x + Math.cos(a) * r, cy = player.y + Math.sin(a) * r;
    for (let i = 0; i < ev.count; i++) spots.push([cx + Phaser.Math.Between(-80, 80), cy + Phaser.Math.Between(-80, 80)]);
  }
  spots.forEach(([sx, sy]) => createEnemy(scene, kindFor(), sx, sy));
  if (window.showLowerThird) window.showLowerThird("alert", ev.badge, ev.text, 4500);
  sfx("bossSpawn");
  scene.time.delayedCall(20000, () => { if (!gameOver && hp > 0) window.achEvent("swarmSurvived", { id: ev.id }); }); // survived it
}

function maybeRunSwarmEvent(scene) {
  const I = window.INTENSITY || {};
  const gap = ageCurve(I.eventEveryMsByAge, currentAge) || 60000;
  if (nextSwarmAt === null) nextSwarmAt = runElapsedMs + gap;
  if (runElapsedMs < nextSwarmAt) return;
  nextSwarmAt = runElapsedMs + gap;
  const pool = (window.SWARM_EVENTS || []).filter(ev => currentAge >= ev.minAge && ENEMIES[ev.kind] || (ev.kind === "mixed" && currentAge >= ev.minAge));
  if (!pool.length) return;
  { const duelS = window.GoldWatch ? GoldWatch.duel() : null; if (duelS && duelS.pauseEvents) return; } // no set pieces during the Gold Watch fight
  const total = pool.reduce((s, ev) => s + ev.weight, 0);
  let roll = Math.random() * total, pick = pool[0];
  for (const ev of pool) { if ((roll -= ev.weight) <= 0) { pick = ev; break; } }
  spawnSwarm(scene, pick);
}

// Spawn a milestone Boss (Ages 45, 52, 60, 70, 80, 90, 100).
function spawnBoss(scene, bossKind) {
  bossesSpawned[bossKind] = true;
  sfx("bossSpawn");
  scene.cameras.main.shake(180, 0.01); // rumble the screen when a Decade Boss arrives!
  const P = ENEMIES[bossKind], view = scene.cameras.main.worldView;
  let x = view.right + SPAWNING.offscreenMargin, y = player.y;
  if (window.NAV) { const spot = window.NAV.fixSpawn(x, y); if (spot) [x, y] = spot; } // bosses still always arrive
  if (scene.worldArt && scene.worldArt.startArea) {
    const spot = scene.worldArt.startArea.resolveSpawn(x, y);
    if (spot) [x, y] = spot;
  }
  const boss = bills.create(x, y, P.tex || bossKind).setDepth(4).setScale(P.scale || 1);
  { // big to look at, smaller to bump into (so a huge boss can still get between desks)
    const hb = (window.ENEMY_SCALE && ENEMY_SCALE.bossHitbox) || 1, fw = boss.frame.width, fh = boss.frame.height;
    boss.body.setSize(fw * hb, fh * hb, true);
  }
  const isEnd = bossKind === "theReaper", m = modeCfg();
  const label = (isEnd && m.endBossLabel) || P.label, bossName = (isEnd && m.endBossName) || P.name;
  if (P.tint) boss.setTint(P.tint);
  boss.isBoss = true;
  boss.kind = bossKind;
  if (bossKind === "goldWatch") window.goldWatchSeen = true;
  if (window.Lighting) Lighting.follow(boss, bossKind === "goldWatch" ? "goldWatch" : bossKind === "midlifeCrisis" ? "headlights" : "boss");
  const lvlMult = 1 + Math.max(0, level - 1) * ((window.INTENSITY && window.INTENSITY.bossHpPerLevel) || 0);
  const ageMult = 1 + Math.max(0, currentAge - 40) * ((window.INTENSITY && window.INTENSITY.bossHpPerYear) || 0.10);
  boss.hp = isEnd ? P.hp : Math.round(P.hp * lvlMult * ageMult * (1 + tax("enemyHpMult"))); // bosses scale with your level AND your age
  boss.hpMax = boss.hp; // phases (Gold Watch) read health as a fraction
  boss.speed = P.speed * (runSprint && window.SPRINT ? SPRINT.enemySpeedMult : 1);
  boss.damage = P.damage;
  if (isEnd) { // the finish waits near you instead of chasing you: the punch clock at 65, Father Time at 100 (ChatGPT art, Nov 4)
    boss.clockOut = true; boss.speed = 0; boss.body.setImmovable(true); boss.body.pushable = false;
    const a0 = Math.random() * Math.PI * 2;
    for (let i = 0; i < 8; i++) { // a clear, reachable spot about 200 px away, so it's on screen
      const a = a0 + i * Math.PI / 4;
      let sx = player.x + Math.cos(a) * 200, sy = player.y + Math.sin(a) * 160;
      if (window.NAV) { const s2 = window.NAV.fixSpawn(sx, sy); if (!s2) continue; [sx, sy] = s2; }
      if (scene.worldArt && scene.worldArt.startArea && !scene.worldArt.startArea.contains(sx, sy)) continue;
      x = sx; y = sy; break;
    }
    boss.body.reset(x, y);
  }
  // The end of the run (retirement at 65, Father Time at 100) is a goal, not an enemy: a friendly label and no HP number (Fable review).
  boss.tag = isEnd
    ? scene.add.text(x, boss.clockOut ? y - 100 : y - P.size / 2 - 10, m.endBossLabel ? "CLOCK OUT HERE ▼" : "SHAKE HIS HAND ▼", {
        fontFamily: "Silkscreen, monospace", fontSize: "13px", color: "#171C35", backgroundColor: "#F2D7A1", padding: { x: 6, y: 3 }
      }).setOrigin(0.5).setDepth(5)
    : scene.add.text(x, y - P.size / 2 - 8, bossKind === "goldWatch" ? label : `${label}:${boss.hp}`, { // show the scaled HP, not the base
        fontFamily: "monospace", fontSize: "14px", color: "#f5c542", backgroundColor: "#12152acc", padding: { x: 4, y: 2 }
      }).setOrigin(0.5).setDepth(5);
  if (isEnd && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches))
    scene.tweens.add({ targets: boss.tag, scale: 1.08, duration: 520, yoyo: true, repeat: -1, ease: "Sine.easeInOut" }); // a gentle pulse says "come here"

  const spot = !isEnd && window.Spotlight && Spotlight.boss(bossKind); // big Spotlight card replaces the toast + lower third
  if (!spot && !isEnd) showBossToastUI(bossName); // the ending has its own card and lower third, so no red "calendar reminder" on top
  if (window.pushContextEvent && !spot) {
    if (isEnd && m.endBossLabel) window.showLowerThird("win", `AGE ${Math.round(modeEndAge())}`, m.endText, 7000);
    else if (isEnd) window.showLowerThird("win", "AGE 100", "Father Time is here. Walk up and shake his hand.", 7000);
    else window.showLowerThird("alert", "BOSS", `${P.name} just walked in. Keep moving in wide circles.`, 5500, P.name.toUpperCase());
  }
}

// update() runs about 60 TIMES PER SECOND: this is the game loop.
// Title sub-pages (Shop, Extras, Leaderboard, Credits...) have a Back button. B / Escape press it for you.
function titleBackAvailable() { return titleOpen && !window.controlsModalOpen && !!document.getElementById("title-back-btn"); }
function titleBack() {
  const bb = document.getElementById("title-back-btn");
  if (bb) bb.dispatchEvent(new Event("nav-activate", { bubbles: true }));
}

function update(time, delta) {
  readPad(this);
  if (padJust("yBtn")) {
    cycleViewMode(this);
    sfx("pick");
    if (window.controlsModalOpen) renderControlsModal(this);
    else if (titleOpen) renderTitleModal(this);
    else if (paused) renderPauseModal(this, 2);
  }
  if (padJust("xBtn")) {
    toggleMute();
    if (typeof syncMuteButtons === "function") syncMuteButtons();
    sfx("pick");
    if (paused && !window.controlsModalOpen) renderPauseModal(this, 3);
  }

  // Universal Controller Navigation across ALL menus (Controls Config, Title, Level-Up, Pause/Options, Age 80, Game Over):
  const activeModal = window.menuNav && window.menuNav.getActiveModal();
  if (activeModal) {
    const stepDir = performance.now() < (window.menuInputGateUntil || 0) ? null : getPadMenuStep(performance.now());
    if (stepDir) window.menuNav.move(stepDir);
    if (padJust("a") || (!paused && !window.controlsModalOpen && !window.changelogModalOpen && !window.loreModalOpen && padJust("start"))) {
      window.menuNav.activate();
    } else if (window.loreModalOpen && (padJust("b") || padJust("start"))) {
      sfx("pick");
      closeLoreModal(this);
    } else if (window.changelogModalOpen && (padJust("b") || padJust("start"))) {
      sfx("pick");
      closeChangelogModal(this);
    } else if (window.controlsModalOpen && (padJust("b") || padJust("start"))) {
      sfx("pick");
      closeControlsModal(this);
    } else if (paused && (padJust("b") || padJust("start"))) {
      togglePause(this);
    } else if (window.accountModalOpen && padJust("b")) {
      if (window.Account) Account.close(); // the badge office (src/account.js)
    } else if (titleBackAvailable() && padJust("b")) {
      titleBack(); // controller B backs out of the Shop, Extras, Leaderboard and other title pages
    }
  } else {
    // Active gameplay controller shortcuts: Start or B opens Pause & Options
    if ((padJust("start") || padJust("b")) && !window.minimapOpen) togglePause(this);
  }

  if (window.minimapOpen) { if (window.Minimap) Minimap.padCheck(); return; } // the big office map is open (src/minimap.js)
  if (window.briefingOpen) { if (padJust("a") || padJust("start") || padJust("b")) endShiftBriefing(); return; } // the shift briefing before a run
  if (gameOver || levelUpOpen || paused || titleOpen || retire80Open || window.controlsModalOpen || window.changelogModalOpen || window.loreModalOpen) {
    renderThreeView(this);
    restore2DSprites();
    return; // freeze while dead, paused, on title, or choosing an upgrade
  }
  updateExtraWeapons(this, delta); // TV Remote, Spreadsheet, Podcast (src/weapons_extra.js)
  if (window.MoreWeapons) MoreWeapons.update(this, delta); // the loadout-expansion weapons (src/weapons_more.js)

  // Active-play Age clock: only advances during real gameplay (never while reading level-up cards or paused!).
  runElapsedMs += (delta || 16.6);
  currentAge = runStartAge + (runElapsedMs / 1000) / secsPerYear(); // 45 s/year in Midlife, 60 in Full Life
  if (Math.floor(currentAge) > runAch.lastAge) { runAch.lastAge = Math.floor(currentAge); window.achEvent("age", { age: currentAge }); }

  // 5-Year 401(k) Compound Interest Dividend! The longer you survive, the larger your automatic dividend payout!
  const nextDivAge = lastDividendAge + 5;
  if (currentAge >= nextDivAge) {
    lastDividendAge = Math.floor(currentAge / 5) * 5;
    const stepNum = Math.max(1, Math.round((lastDividendAge - 40) / 5));
    const yld = window.getCoinYieldInfo();
    const divBonus = bankCoins(2 + stepNum * 2 + yld.value); // birthday dividend, scaled like every other coin
    runCoins += divBonus;
    meta.coins += divBonus;
    saveMeta(meta);
    sfx("coin");
    const pt = project3DToPhaserWorld(this, player.x, 56, player.y);
    const dMsg = this.add.text(pt.x, pt.y - 26, `📈 AGE ${lastDividendAge} DIVIDEND: +${divBonus}k 401(k)!`, {
      fontFamily: "monospace", fontSize: "13px", fontStyle: "bold", color: "#ffe042", backgroundColor: "#12152aee",
      padding: { x: 8, y: 4 }, stroke: "#090b14", strokeThickness: 3
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: dMsg, y: dMsg.y - 28, alpha: 0, duration: 1500, onComplete: () => dMsg.destroy() });
    // Birthday cake rides along with the dividend (Nov 3). One card for both, so neither gets skipped.
    const cake = milestoneHealAmount(lastDividendAge);
    let cakeHeal = 0;
    if (cake && hp < stats.maxHp) {
      cakeHeal = Math.min(stats.maxHp - hp, healAmt(cake));
      hp += cakeHeal; if (typeof drawHpBar === "function") drawHpBar();
      const ck = this.add.text(pt.x, pt.y - 48, `🎂 +${cakeHeal} HP`, {
        fontFamily: "monospace", fontSize: "13px", fontStyle: "bold", color: "#83A89A", stroke: "#12152a", strokeThickness: 3
      }).setOrigin(0.5).setDepth(20);
      this.tweens.add({ targets: ck, y: ck.y - 28, alpha: 0, duration: 1600, onComplete: () => ck.destroy() });
    }
    if (cake && window.showLowerThird) {
      const M = HEALING.milestones;
      const line = cakeHeal ? (lastDividendAge % 10 === 0 ? M.bannerDecade : M.bannerNormal).replace("{n}", cakeHeal) : M.bannerFull;
      window.showLowerThird("reward", M.bannerBadge, `${line} Plus a +${divBonus}k dividend.`, 4200);
    } else if (window.pushContextEvent) {
      window.showLowerThird("reward", "401(k)", `Age ${lastDividendAge} dividend: +${divBonus}k deposited.`, 3800);
    }
  }

  updateHUD();
  label.setText(`${PLAYER.name} (${Math.floor(currentAge)})`);

  // Check if we progressed into a new Life Stage / Environment (Office -> Hospital -> Home -> Social -> Resort)!
  if (typeof getActiveStage === "function") {
    const activeStage = this.worldArt && this.worldArt.startArea ? STAGES[0] : getActiveStage(currentAge, meta);
    if (activeStage && activeStage.id !== currentStageId) {
      const prevId = currentStageId;
      currentStageId = activeStage.id;
      const stageTints = { office: 0xffffff, hospital: 0xd4f7ff, home: 0xffe8c8, social: 0xf5d4ff, senior: 0xfff0b8 };
      if (floor) floor.setTint(stageTints[currentStageId] || 0xffffff);
      if (runElapsedMs > 500 && prevId) {
        showBossToastUI(`${activeStage.name}`, `NEW LIFE CHAPTER UNLOCKED // ${activeStage.chapter}`);
        if (window.pushContextEvent) {
          window.showLowerThird("chapter", "NEW PLACE", `${activeStage.name}. ${activeStage.tagline}`, 5200);
        }
      }
    }
  }

  // Auto-save active run + unlock Decade Checkpoints every 3 seconds of active play!
  if (runElapsedMs - lastAutoSave > 3000) {
    lastAutoSave = runElapsedMs;
    window.persistActiveRun();
  }

  // Age 80 Retirement: the bonus pays out automatically and the run keeps going (no more stop screen).
  // The only finish line is Death at 100.
  if (runMode === "full" && currentAge >= PLAYER.retirementAge && !retire80Prompted) {
    retire80Prompted = true;
    meta.coins += 15;
    runCoins += 15;
    hp = stats.maxHp; // a retirement party heals you up
    updateHUD();
    window.persistActiveRun();
    sfx("levelUp");
    if (window.showLowerThird) window.showLowerThird("win", "RETIRED", "Age 80: +15k bonus and full health. Death arrives at 100.", 5500);
  }

  // Bosses for this mode, then the ending: Retirement at 65 (Midlife) or Father Time at 100 (Full Life).
  modeCfg().bosses.forEach(bk => {
    // The Gold Watch always arrives 1.5 years before you retire (so Delayed Retirement moves it too).
    const at = bk === "goldWatch" && window.GoldWatch ? GoldWatch.arrivalAge() : ENEMIES[bk].spawnAge;
    if (bossesSpawned[bk] || currentAge < at) return;
    // One boss at a time: wait for the one you're fighting (src/data/bosses.js, BOSS_QUEUE), up to a few years.
    const Q = window.BOSS_QUEUE || {};
    const busy = bk !== "goldWatch" && (bills.getChildren().some(o => o.active && o.isBoss && !o.clockOut)
      || (window.lastBossDownMs != null && runElapsedMs - lastBossDownMs < (Q.breatherMs || 8000)));
    if (busy && currentAge < at + (Q.maxWaitYears || 3)) return;
    spawnBoss(this, bk);
  });
  if (!bossesSpawned.theReaper && currentAge >= modeEndAge()) {
    if (window.GoldWatch) GoldWatch.clockOut(this); // 5:00: the watch stops on its own when you retire
    spawnBoss(this, "theReaper");
  }

  // Wave schedule: as you pass milestone ages, speed up the spawn timer!
  const wIdx = SPAWNING.waves.reduce((acc, w, i) => currentAge >= w.minAge ? i : acc, 0);
  // Smooth ramp: blend toward the NEXT wave's speed as you age, instead of jumping in big steps.
  const nextW = SPAWNING.waves[Math.min(wIdx + 1, SPAWNING.waves.length - 1)], curW = SPAWNING.waves[wIdx];
  const span = Math.max(1, nextW.minAge - curW.minAge);
  const blend = nextW === curW ? 0 : Phaser.Math.Clamp((currentAge - curW.minAge) / span, 0, 1);
  const lvlSpeed = Math.max(0.45, 1 - Math.max(0, level - 1) * ((window.INTENSITY && window.INTENSITY.spawnFasterPerLevel) || 0) - tax("spawnFaster"));
  updateDynamicIntensity();
  const duelS = window.GoldWatch ? GoldWatch.duel() : null; // the Gold Watch fight thins the swarm
  const wantDelay = Math.round((curW.everyMs + (nextW.everyMs - curW.everyMs) * blend) * lvlSpeed * dynSpawnMult() * (window.modFx ? modFx("spawnDelayMult", 1) : 1) * ((duelS && duelS.spawnDelayMult) || 1));
  if (wIdx !== currentWaveIdx || Math.abs(spawnTimer.delay - wantDelay) > wantDelay * 0.04) {
    currentWaveIdx = wIdx;
    spawnTimer.reset({ delay: wantDelay, loop: true, callback: spawnTimer.callback });
  }
  maybeRunSwarmEvent(this);

  // =========================================================================
  // UNIFIED 4-DEVICE MOVEMENT (Keyboard + Controller + Touch + Mouse)
  // =========================================================================
  const c = (meta && meta.controls) ? meta.controls : (window.DEFAULT_CONTROLS || {});
  const held = window._heldKeys;
  const useArrows = c.arrowMove !== false;
  let x = 0, y = 0;

  // 1. Keyboard: Custom bound keys + optional Arrow Keys
  if (held.has(c.keyLeft || "KeyA") || (useArrows && (cursors.left.isDown || held.has("ArrowLeft")))) x -= 1;
  if (held.has(c.keyRight || "KeyD") || (useArrows && (cursors.right.isDown || held.has("ArrowRight")))) x += 1;
  if (held.has(c.keyUp || "KeyW") || (useArrows && (cursors.up.isDown || held.has("ArrowUp")))) y -= 1;
  if (held.has(c.keyDown || "KeyS") || (useArrows && (cursors.down.isDown || held.has("ArrowDown")))) y += 1;

  // 2. Video Game Controller: D-Pad + Analog Stick (with configurable deadzone)
  if (padNow.left) x -= 1;
  if (padNow.right) x += 1;
  if (padNow.up) y -= 1;
  if (padNow.down) y += 1;
  if (padNow.x || padNow.y) { x = padNow.x; y = padNow.y; }

  // 3. Touch & 4. Mouse Steering
  let pointerTarget = null;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const sensDeadzone = c.touchSensitivity === "high" ? 5 : (c.touchSensitivity === "low" ? 18 : 10);

  if (touch.active && touch.isTouch) {
    if (c.touchMode === "directTouch") {
      const dx = touch.curX - centerX;
      const dy = touch.curY - centerY;
      if (Math.hypot(dx, dy) > 14) {
        x = dx; y = dy;
        pointerTarget = { active: true, x: touch.curX, y: touch.curY };
      }
    } else if (Math.hypot(touch.dx, touch.dy) > sensDeadzone) {
      x = touch.dx; y = touch.dy;
    }
  } else {
    // Mouse Movement Modes (`holdFollow`, `cursorFollow`, `clickDrag`, or Right-Click Move)
    const isMouseHoldMove = (c.mouseMoveMode === "holdFollow" && mouseState.leftDown) ||
                            (c.mouseRightClick === "move" && mouseState.rightDown);
    if (isMouseHoldMove) {
      const dx = mouseState.x - centerX;
      const dy = mouseState.y - centerY;
      if (Math.hypot(dx, dy) > 14) {
        x = dx; y = dy;
        pointerTarget = { active: true, x: mouseState.x, y: mouseState.y };
      }
    } else if (c.mouseMoveMode === "cursorFollow" && mouseState.activeCursor && !mouseState.overUI && x === 0 && y === 0) {
      const dx = mouseState.x - centerX;
      const dy = mouseState.y - centerY;
      if (Math.hypot(dx, dy) > 28) {
        x = dx; y = dy;
        pointerTarget = { active: true, x: mouseState.x, y: mouseState.y };
      }
    } else if (c.mouseMoveMode === "clickDrag" && touch.active && Math.hypot(touch.dx, touch.dy) > sensDeadzone) {
      x = touch.dx; y = touch.dy;
    }
  }
  if (window.updatePointerTargetUI) window.updatePointerTargetUI(pointerTarget);
  if (window.updateTouchJoystickUI && (c.touchMode === "fixedLeft" || c.touchMode === "fixedRight")) {
    window.updateTouchJoystickUI(touch);
  }

  // Normalize so moving diagonally isn't faster than moving straight.
  const len = Math.hypot(x, y);
  if (len > 0) { x /= len; y /= len; }

  const buffSpd = Math.max(runElapsedMs < buffs.speedUntil ? buffs.speedMult : 1, window.NearMiss ? window.NearMiss.speedMult() : 1); // Energy Drink / Standing Desk, or a Close Call blip (never both stacked)
  const baseSpd = stats.speed * (window.modFx ? modFx("speedMult", 1) : 1) * (runSprint && window.SPRINT ? SPRINT.playerSpeedMult : 1); // Back Spasm slows the base, drinks still help
  const moveSpd = (runElapsedMs < slowUntil ? baseSpd * ENEMIES.snackAttack.slowFactor : baseSpd) * buffSpd;
  player.setVelocity(x * moveSpd, y * moveSpd);
  if (x !== 0) player.setFlipX(x < 0); // face left or right
  player.setAngle((x !== 0 || y !== 0) ? Math.sin(this.time.now / 55) * 7 : 0); // jaunty walk wobble
  if (window.Juice) Juice.step(this, player, len > 0, runElapsedMs, this.worldArt && this.worldArt.hero); // dust puffs
  label.setPosition(player.x, player.y - PLAYER.size / 2 - 4);

  // Keep the Dad Joke speech bubble anchored right above the character's head as you move!
  if (playerSpeech && playerSpeech.active) {
    if (runElapsedMs >= playerSpeech.fadeEnd) {
      playerSpeech.destroy();
      playerSpeech = null;
    } else {
      const sPt = project3DToPhaserWorld(this, player.x, (player.elev || 0) + 68, player.y);
      playerSpeech.setPosition(sPt.x, sPt.y - 52).setVisible(sPt.visible);
      if (runElapsedMs > playerSpeech.holdUntil) {
        const rem = (playerSpeech.fadeEnd - runElapsedMs) / (playerSpeech.fadeEnd - playerSpeech.holdUntil);
        playerSpeech.setAlpha(Math.max(0, rem));
      } else {
        playerSpeech.setAlpha(1);
      }
    }
  }

  // Slide the carpet pattern and recycle office furniture around the camera so the stage feels alive.
  floor.tilePositionX = this.cameras.main.scrollX;
  floor.tilePositionY = this.cameras.main.scrollY;
  updateStageProps(this, stageProps);

  // Floor limits (src/data/pickups.js FLOOR_LIMITS): once a second, merge the farthest gems if there are too many.
  if (runElapsedMs >= gemCapNextAt || runElapsedMs < gemCapNextAt - 2000) { gemCapNextAt = runElapsedMs + 1000; capFloorGems(this); }
  // Magnet: gems and 401(k) coins close to you fly toward you.
  const W = PICKUPS.wisdomGem;
  const magM = window.modFx ? modFx("magnetMult", 1) : 1; // Reading Glasses: shorter pull, never under 70 px
  const magR = magM < 1 ? Math.max(70, stats.magnetRadius * magM) : stats.magnetRadius;
  gems.getChildren().forEach(gem => {
    if (Phaser.Math.Distance.Between(player.x, player.y, gem.x, gem.y) < magR) {
      this.physics.moveToObject(gem, player, W.magnetSpeed);
    }
  });
  const vacuum = runElapsedMs < buffs.vacuumUntil; // Fanny Pack: pull from anywhere
  if (vacuum) gems.getChildren().forEach(g => this.physics.moveToObject(g, player, W.magnetSpeed * 1.6));
  // Items on the floor expire after a while.
  if (window.fieldItems) window.fieldItems.getChildren().slice().forEach(it => { if (runElapsedMs > it.expireAt) { if (it.glowRing) it.glowRing.destroy(); it.destroy(); } else if (it.glowRing) it.glowRing.setPosition(it.x, it.y); });
  coins.getChildren().slice().forEach(c => {
    if (c.dieAt) { // unclaimed coins blink, then disappear (FLOOR_LIMITS)
      const left = c.dieAt - runElapsedMs, blink = (window.FLOOR_LIMITS && FLOOR_LIMITS.blinkMs) || 4000;
      if (left <= 0) { c.destroy(); return; }
      if (left < blink) c.setAlpha(0.35 + 0.65 * (Math.floor(left / 150) % 2)); else if (c.alpha !== 1) c.setAlpha(1);
    }
    if (vacuum || Phaser.Math.Distance.Between(player.x, player.y, c.x, c.y) < magR) {
      this.physics.moveToObject(c, player, W.magnetSpeed);
    }
  });
  if (window.pizzas) {
    window.pizzas.getChildren().forEach(pz => {
      if (pz.dieAt) { // Desk Salad wilts (and intern parcels go stale): fades for the last few seconds, then it's gone
        const left = pz.dieAt - runElapsedMs, fade = (PICKUPS.salad && PICKUPS.salad.fadeMs) || 3000;
        if (left <= 0) { pz.destroy(); return; }
        pz.setAlpha(left < fade ? 0.35 + 0.65 * (Math.floor(left / 150) % 2) : 1);
      }
      if ((!pz.collectAt || runElapsedMs >= pz.collectAt) && Phaser.Math.Distance.Between(player.x, player.y, pz.x, pz.y) < magR) {
        this.physics.moveToObject(pz, player, W.magnetSpeed * (pz.isSalad ? ((PICKUPS.salad && PICKUPS.salad.magnetSpeedMult) || 1) : 1));
      }
    });
  }

  // Boss chests (Nov 3, Derek: "I can't pick up the mortgage chest"): they slide to you once you're close,
  // and touching one opens it even if the physics overlap missed. If something blocks it, log why (play stats).
  chests.getChildren().slice().forEach(ch => {
    if (!ch.active) return;
    if (ch.readyAt && runElapsedMs < ch.readyAt) { ch.setVelocity(0, 0); if (ch.tag) ch.tag.setPosition(ch.x, ch.y); return; }
    const d = Phaser.Math.Distance.Between(player.x, player.y, ch.x, ch.y);
    // Nov 4 (Rami: "the spotlight card showed up but I didn't get a chest"): a boss can die off screen, so the chest always comes to you.
    // Always faster than you (Nov 4, Rami: "it follows me, I just don't get it"): a fixed speed lost to a fast hero who kept moving.
    const runSpeed = (player.body && player.body.speed) || 0;
    this.physics.moveToObject(ch, player, Math.max(W.magnetSpeed * (d < Math.max(magR, 150) ? 0.8 : 0.55), runSpeed + 160));
    if (ch.tag) ch.tag.setPosition(ch.x, ch.y);
    if (d < 56) {
      // A chest screen that says it's open but isn't on screen while you're playing is stale: let it go.
      if (!levelUpOpen && window.BonusChest && BonusChest.isOpen() && BonusChest.visible && !BonusChest.visible()) BonusChest.abandon();
      const blocked = levelUpOpen || (window.BonusChest && BonusChest.isOpen());
      if (!blocked) collectChest(player, ch);
      else if (!ch.blockLogged && (ch.blockedSince = ch.blockedSince || runElapsedMs) && runElapsedMs - ch.blockedSince > 4000) {
        ch.blockLogged = true;
        const flags = [levelUpOpen && "lvl", window.BonusChest && BonusChest.isOpen() && "chest", ch.bossKind].filter(Boolean).join("-");
        if (window.Telemetry && Telemetry.event) Telemetry.event("chest-blocked-" + flags);
      }
    }
  });

  // Every frame, update each enemy according to its behavior (state machine).
  const now = runElapsedMs;
  if (window.NAV) window.NAV.update(this, player, now); // rebuild the "walk around furniture" map a few times a second
  if (window.Breakables) Breakables.scan(this, now);     // tag newly built props that can be smashed
  if (window.Promotions) Promotions.update(this, now);   // open promotion doors as you age
  if (window.Minimap) Minimap.update(this, now);         // find the office map, then it fills in as you explore
  if (window.Interns) Interns.update(this, now);         // TJ and Derek bring you things (src/interns.js)
  if (window.Lounge) Lounge.update(this, now);           // the Lounge counter opens after promotions
  if (window.Modifiers) Modifiers.update(this, now);     // age 50+ "life happens" modifiers
  if (window.YellowNote) { YellowNote.update(this); YellowNote.sync(); } // don't unplug the rack with the yellow note
  drawShield();
  const startArea = this.worldArt && this.worldArt.startArea;
  const chase = (e, spd) => window.NAV ? window.NAV.steer(this, e, player, spd) : this.physics.moveToObject(e, player, spd);
  const TG = window.ENEMY_TAGS || {}, smallView = this.cameras.main.zoom < 0.9 || window.innerWidth < 760;
  const crowdTags = bills.countActive() > (smallView ? (TG.hideOverPhone || 25) : (TG.hideOverDesktop || 60));
  bills.getChildren().slice().forEach(bill => {
    if (!bill.active) return;
    if (bill.tag) { const want = !crowdTags || bill.isBoss || bill.elite || bill.typing; if (bill.tag.visible !== want) bill.tag.setVisible(want); }
    const ageMs = now - (bill.bornAt || now);

    // Stray check (once a second): an enemy that ended up off the floor (behind a wall, in a dark unbuilt
    // area) for two checks in a row gets put back on a reachable floor spot, off-screen.
    if (startArea && now >= (bill.strayCheckAt || 0)) {
      bill.strayCheckAt = now + 1000;
      if (startArea.contains(bill.x, bill.y)) bill.strays = 0;
      else if ((bill.strays = (bill.strays || 0) + 1) >= 2) {
        const spot = startArea.resolveSpawn(bill.x, bill.y);
        if (spot) { bill.body.reset(spot[0], spot[1]); bill.strays = 0; strayRescues++; }
      }
    }

    // Bosses with a special attack (src/boss-attacks.js) steer themselves while warning or attacking.
    if (bill.isBoss && window.BossAttacks && window.BossAttacks.update(this, bill, player, now)) {
      if (bill.tag) bill.tag.setPosition(bill.x, bill.y - ((ENEMIES[bill.kind] && ENEMIES[bill.kind].size) || 24) / 2 - 8);
      return;
    }

    // 0. Groaning at a Dad Joke: stagger back and stand there for a moment, then carry on.
    if (bill.cringeUntil && now < bill.cringeUntil) {
      bill.setVelocity(bill.body.velocity.x * 0.9, bill.body.velocity.y * 0.9);
      if (bill.tag) bill.tag.setPosition(bill.x, bill.y - ((ENEMIES[bill.kind] && ENEMIES[bill.kind].size) || 24) / 2 - 6);
      return;
    }

    // 1. Unpaid Bills turn red and split into two fast Late Fees after 9 seconds!
    const overdue = currentAge < (ENEMIES.bill.overdueEarlyUntilAge || 0) ? (ENEMIES.bill.overdueEarlyMs || ENEMIES.bill.overdueAfterMs) : ENEMIES.bill.overdueAfterMs;
    if (bill.kind === "bill" && ageMs > (window.modFx ? modFx("overdueAfterMs", overdue) : overdue)) {
      sfx("overdue");
      const bx = bill.x, by = bill.y;
      bill.tag.destroy(); bill.destroy();
      window.achEvent("split");
      createEnemy(this, "lateFee", bx - 14, by - 10);
      createEnemy(this, "lateFee", bx + 14, by + 10);
      if (window.modFx && modFx("lateFeeCount", 2) > 2) { createEnemy(this, "lateFee", bx - 14, by + 14); createEnemy(this, "lateFee", bx + 14, by - 14); } // Past Due
      if (window.pushContextEvent) {
        /* first Late Fee triggers a one-time tip via createEnemy */
      }
      return;
    }

    // 2. Spam Likely phone calls: creep in -> vibrate "RING!" -> rocket in a straight line!
    if (bill.kind === "spamCall") {
      const SC = ENEMIES.spamCall;
      if (!bill.state && ageMs > SC.ringAfterMs) {
        bill.state = "ringing";
        bill.ringEnd = now + SC.ringPauseMs;
        bill.setVelocity(0, 0);
        bill.tag.setText("RING!").setColor("#ffffff");
        sfx("ring");
        const ang = Phaser.Math.Angle.Between(bill.x, bill.y, player.x, player.y);
        bill.dashVx = Math.cos(ang) * SC.dashSpeed;
        bill.dashVy = Math.sin(ang) * SC.dashSpeed;
      } else if (bill.state === "ringing") {
        bill.tag.setPosition(bill.x + Phaser.Math.Between(-3, 3), bill.y - SC.size / 2 - 8);
        if (now >= bill.ringEnd) {
          bill.state = "dashing";
          bill.tag.setText(currentAge >= 80 && SC.seniorLabel ? SC.seniorLabel : SC.label);
        }
        return;
      } else if (bill.state === "dashing") {
        bill.setVelocity(bill.dashVx, bill.dashVy);
        bill.tag.setPosition(bill.x, bill.y - SC.size / 2 - 6);
        if (Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y) > 950) {
          bill.tag.destroy(); bill.destroy(); // missed you and flew off into the void
        }
        return;
      }
    }

    // 3. Back Twinge: lunges fast for 0.55s, then pauses for 0.45s (spasm -> rest -> spasm).
    if (bill.kind === "backTwinge") {
      const BT = ENEMIES.backTwinge, cycle = BT.lungeMs + BT.restMs;
      if (ageMs % cycle > BT.lungeMs) {
        bill.setVelocity(0, 0);
        bill.tag.setPosition(bill.x, bill.y - BT.size / 2 - 6);
        return;
      }
    }

    // 4. 3 AM Thought: solid for a bit, then fades into a ghost that can't hurt you or be hit, and sneaks closer.
    if (bill.kind === "threeAmThought") {
      const T = ENEMIES.threeAmThought, cyc = T.solidMs + T.ghostMs * (window.modFx ? modFx("threeAmGhostMsMult", 1) : 1);
      const ghost = (ageMs % cyc) >= T.solidMs;
      if (ghost !== !!bill.ghost) {
        bill.ghost = ghost;
        bill.setAlpha(ghost ? 0.25 : 1);
        bill.tag.setAlpha(ghost ? 0.3 : 1);
      }
      chase(bill, ghost ? T.ghostSpeed : bill.speed);
      bill.tag.setPosition(bill.x, bill.y - T.size / 2 - 6);
      return;
    }

    // 5. Calendar Invite: locks a direction when it appears and charges straight across. Never turns.
    if (bill.kind === "calendarInvite") {
      if (bill.lockVx === undefined) {
        const a = Phaser.Math.Angle.Between(bill.x, bill.y, player.x, player.y);
        bill.lockVx = Math.cos(a) * bill.speed; bill.lockVy = Math.sin(a) * bill.speed;
      }
      bill.setVelocity(bill.lockVx, bill.lockVy);
      bill.tag.setPosition(bill.x, bill.y - ENEMIES.calendarInvite.size / 2 - 6);
      if (Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y) > 1100) { bill.tag.destroy(); bill.destroy(); }
      return;
    }

    // 6. Group Chat: hangs back at a distance, shows "typing...", then fires a message ping at you.
    if (bill.kind === "groupChat") {
      const G = ENEMIES.groupChat;
      const d = Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y);
      const a = Phaser.Math.Angle.Between(player.x, player.y, bill.x, bill.y);
      // Stay where you can see it (Nov 4, Ben: "I just start taking damage for no apparent reason"). On a phone the
      // old 260 px distance parked Group Chats just past the screen edge, so pings came out of nowhere.
      const cam = this.cameras.main, halfView = Math.min(cam.width, cam.height) / 2 / cam.zoom;
      const keep = Math.max(150, Math.min(G.keepDistance, halfView * 0.72));
      if (d > keep + 40) chase(bill, bill.speed);
      else if (d < keep - 40) bill.setVelocity(Math.cos(a) * bill.speed, Math.sin(a) * bill.speed); // back away
      else bill.setVelocity(-Math.sin(a) * bill.speed * 0.8, Math.cos(a) * bill.speed * 0.8);                // circle you
      if (!bill.nextPing) bill.nextPing = now + G.fireEveryMs * (0.5 + Math.random() * 0.5);
      if (!bill.typing && now >= bill.nextPing - G.typingMs) { bill.typing = true; bill.tag.setText("typing...").setColor("#8ff0a8"); }
      const v = cam.worldView, onScreen = bill.x > v.x + 10 && bill.x < v.right - 10 && bill.y > v.y + 10 && bill.y < v.bottom - 10;
      if (now >= bill.nextPing && !onScreen) bill.nextPing = now + 300; // only fire from where you can see it
      else if (now >= bill.nextPing) {
        bill.typing = false; bill.nextPing = now + G.fireEveryMs;
        bill.tag.setText(currentAge >= 80 && G.seniorLabel ? G.seniorLabel : G.label).setColor("#e8e9f3");
        const pa = Phaser.Math.Angle.Between(bill.x, bill.y, player.x, player.y);
        const ping = pings.create(bill.x, bill.y, "ping").setDepth(6);
        this.enemyArt.attach(ping, "ping");
        ping.setVelocity(Math.cos(pa) * G.pingSpeed, Math.sin(pa) * G.pingSpeed);
        ping.dieAt = now + G.pingLifeMs; ping.damage = bill.damage;
        sfx("ring");
      }
      bill.setFlipX(player.x < bill.x);
      bill.tag.setPosition(bill.x, bill.y - G.size / 2 - 6);
      return;
    }

    // 7. Math Homework: circles you in a shrinking spiral.
    if (bill.kind === "mathWorksheet") {
      const MW = ENEMIES.mathWorksheet, dt = Math.min(delta, 50) / 1000;
      if (bill.orbitR === undefined) {
        bill.orbitR = Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y);
        bill.orbitA = Phaser.Math.Angle.Between(player.x, player.y, bill.x, bill.y);
        bill.spinDir = Math.random() < 0.5 ? -1 : 1;
      }
      bill.orbitR = Math.max(0, bill.orbitR - MW.closeInPerSec * dt);
      bill.orbitA += MW.spinPerSec * dt * bill.spinDir;
      const tx = player.x + Math.cos(bill.orbitA) * bill.orbitR, ty = player.y + Math.sin(bill.orbitA) * bill.orbitR;
      let vx = (tx - bill.x) * 5, vy = (ty - bill.y) * 5;
      const sp = Math.hypot(vx, vy); if (sp > bill.speed) { vx *= bill.speed / sp; vy *= bill.speed / sp; }
      bill.setVelocity(vx, vy);
      bill.tag.setPosition(bill.x, bill.y - MW.size / 2 - 6);
      return;
    }

    // Default behavior (Bills, Late Fees, Snacks, Twinge lunge, Elites, Bosses): head for you, walking around furniture.
    if (bill.clockOut) bill.setVelocity(0, 0); // the punch clock waits for you
    else chase(bill, bill.speed || ENEMIES.bill.speed);
    bill.setFlipX(player.x < bill.x);
    const sz = (ENEMIES[bill.kind] && ENEMIES[bill.kind].size) || 24;
    bill.tag.setPosition(bill.x, bill.clockOut ? bill.y - 100 : bill.y - sz / 2 - 6);
  });

  if (window.MoreWeapons) MoreWeapons.post(this); // Out-of-Office slows and Thermostat freezes, after everyone has moved

  // Close Calls: reward enemies (and pings) that nearly got you.
  if (window.NearMiss) window.NearMiss.scan(this, player, bills, pings);
  if (window.Telemetry) window.Telemetry.tick(); // "reached age 50" style milestones for the visitor stats

  // Old message pings fade away.
  if (pings) pings.getChildren().slice().forEach(pg => { if (now >= pg.dieAt) pg.destroy(); });

  // Splashes that flew past their range evaporate (we delete them so they don't pile up).
  splashes.getChildren().slice().forEach(s => {
    if (Phaser.Math.Distance.Between(s.startX, s.startY, s.x, s.y) > stats.range * (window.modFx ? modFx("rangeMult", 1) : 1)) s.destroy();
  });

  // Render the active 3D / Diablo 3/4 view (or restore 2D sprites when in 2D 16-Bit mode)
  renderThreeView(this);
  restore2DSprites();
}

// The shift briefing (Nov 4). Rami liked the hero card's tone but it covered the first wave (Gemini Argon's review),
// so now it plays BEFORE the clock starts: the hero card plus a "today's shift" strip. Tap, click or press any key to clock in.
function startShiftBriefing(scene) {
  if (!window.Spotlight) return;
  if (Spotlight.newRun) Spotlight.newRun();
  Spotlight.hire(meta.selectedChar);
  window.briefingOpen = true;
  scene.physics.pause(); scene.time.paused = true;
  const m = modeCfg(), sprint = typeof runSprint !== "undefined" && runSprint;
  const goal = m.endBossLabel ? "Survive to " + modeEndAge() + " and clock out." : "Make it all the way to " + modeEndAge() + ".";
  const el = document.createElement("div"); el.id = "shift-briefing"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Today's shift");
  el.innerHTML = `<div class="sb-card"><span class="sb-kick">TODAY'S SHIFT</span><p class="sb-goal">${goal}${sprint ? " ⚡ Sprint: the years fly by." : ""}</p><p class="sb-how">Everything fires on its own. Just keep moving.</p><span class="sb-go">${(window.matchMedia && matchMedia("(pointer:coarse)").matches) ? "TAP ANYWHERE TO CLOCK IN" : "PRESS ANY KEY TO CLOCK IN"}</span></div>`;
  if (!document.getElementById("shift-briefing-css")) {
    const st = document.createElement("style"); st.id = "shift-briefing-css";
    st.textContent = `#shift-briefing{position:fixed;left:0;right:0;top:calc(var(--ms-nav-h,0px) + 15%);z-index:47;display:flex;justify-content:center;padding:0 16px;pointer-events:none}
#shift-briefing .sb-card{max-width:440px;width:100%;background:#FFF0CF;color:#171C35;border:3px solid #171C35;border-radius:6px;box-shadow:5px 5px 0 rgba(0,0,0,.45);padding:12px 14px;text-align:center;animation:sbIn .35s cubic-bezier(.2,1.5,.4,1) both}
#shift-briefing .sb-kick{display:inline-block;font:10px Silkscreen,monospace;letter-spacing:.1em;background:#171C35;color:#F2D7A1;padding:3px 8px;border-radius:2px}
#shift-briefing .sb-goal{font:700 18px/1.25 'Atkinson Hyperlegible',sans-serif;margin:8px 0 2px}
@media (max-width:760px){#shift-briefing{top:calc(var(--ms-nav-h,0px) + 12%)}#shift-briefing .sb-card{padding:9px 12px}#shift-briefing .sb-goal{font-size:16px;margin-top:6px}#shift-briefing .sb-how{font-size:13px;margin-bottom:6px}}
#shift-briefing .sb-how{font:14px/1.3 'Atkinson Hyperlegible',sans-serif;margin:0 0 8px;color:#303750}
#shift-briefing .sb-go{display:inline-block;font:11px Silkscreen,monospace;letter-spacing:.06em;color:#171C35;background:#EF9347;padding:6px 10px;border-radius:3px;animation:sbPulse 1.1s ease-in-out infinite}
@keyframes sbIn{from{transform:translateY(-12px) scale(.9);opacity:0}to{transform:none;opacity:1}}
@keyframes sbPulse{50%{transform:scale(1.05)}}
@media (prefers-reduced-motion:reduce){#shift-briefing *{animation:none!important}}`;
    document.head.appendChild(st);
  }
  document.body.appendChild(el);
  const t0 = performance.now();
  const go = e => { if (performance.now() - t0 < 500) return; if (e && e.preventDefault) e.preventDefault(); endShiftBriefing(); }; // a short grace so the PUNCH IN tap doesn't skip it
  window._briefingEnd = () => { window.removeEventListener("pointerdown", go, true); window.removeEventListener("keydown", go, true); clearTimeout(window._briefingTimer); };
  window.addEventListener("pointerdown", go, true); window.addEventListener("keydown", go, true);
  window._briefingTimer = setTimeout(endShiftBriefing, 9000); // starts on its own if nobody taps
}
function endShiftBriefing() {
  if (!window.briefingOpen) return;
  window.briefingOpen = false;
  if (window._briefingEnd) window._briefingEnd();
  const el = document.getElementById("shift-briefing"); if (el) el.remove();
  if (window.Spotlight && Spotlight.isShowing && Spotlight.isShowing()) Spotlight.hide();
  const sc = window._activeGameScene;
  if (sc && !paused && !levelUpOpen && !gameOver && !titleOpen) { sc.physics.resume(); sc.time.paused = false; }
  resetInputState(sc || undefined);
  if (typeof sfx === "function") sfx("pick");
}

window.game = new Phaser.Game(config);

// iPad Safari sometimes reports the old window size when you rotate or the toolbars move (Nov 4, Rami: the office
// only filled three quarters of the screen). Check again a moment later, and keep a slow watch in case it still drifts.
(() => {
  const fix = () => {
    const g = window.game; if (!g || !g.scale || !g.isBooted) return;
    const w = window.innerWidth, h = window.innerHeight;
    const off = () => Math.abs(g.scale.width - w) > 1 || Math.abs(g.scale.height - h) > 1;
    if (off()) g.scale.refresh(); // re-measure the page
    if (off()) g.scale.resize(w, h); // still wrong: size it to the window ourselves
    const cv = g.canvas; if (cv && (Math.abs(cv.clientWidth - g.scale.width) > 1 || Math.abs(cv.clientHeight - g.scale.height) > 1)) g.scale.refresh();
    g.scene.getScenes(true).forEach(sc => { const c = sc.cameras && sc.cameras.main; if (c && (c.width !== g.scale.width || c.height !== g.scale.height)) c.setSize(g.scale.width, g.scale.height); });
  };
  const soon = () => [120, 500, 1200].forEach(ms => setTimeout(fix, ms));
  window.addEventListener("orientationchange", soon);
  window.addEventListener("resize", soon);
  if (window.visualViewport) visualViewport.addEventListener("resize", soon);
  setInterval(fix, 1000);
})();

// The graphics card dropped the game (Nov 4, Rami: a white screen right after a level-up, then a grey title screen).
// Browsers can take WebGL away when the computer is short on graphics memory ("context lost"). Phaser can't always
// get it back, so save the run and offer a one-tap reload instead of leaving a blank screen.
(() => {
  const hook = () => {
    const cv = window.game && game.canvas; if (!cv) return setTimeout(hook, 500);
    cv.addEventListener("webglcontextlost", e => {
      e.preventDefault(); // asks the browser to hand the context back if it can
      try { if (!titleOpen && !gameOver && window.persistActiveRun) window.persistActiveRun(); } catch (err) {}
      try { if (window.Telemetry && Telemetry.event) Telemetry.event("webgl-context-lost"); } catch (err) {}
      if (document.getElementById("ctx-lost")) return;
      const d = document.createElement("div"); d.id = "ctx-lost"; d.setAttribute("role", "alertdialog");
      d.style.cssText = "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(23,28,53,.94);padding:16px";
      d.innerHTML = `<div style="max-width:420px;background:#171C35;border:3px solid #EF9347;border-radius:8px;padding:20px;color:#FFF0CF;font:16px/1.45 'Atkinson Hyperlegible',sans-serif;text-align:left;box-shadow:6px 6px 0 rgba(0,0,0,.45)">
        <div style="display:inline-block;font:10px Silkscreen,monospace;letter-spacing:.06em;color:#171C35;background:#F2D7A1;padding:3px 7px;border-radius:2px">FACILITIES // POWER BLIP</div>
        <h2 style="font:700 24px 'Atkinson Hyperlegible',sans-serif;margin:10px 0 6px">The office lights flickered.</h2>
        <p style="margin:0 0 14px;color:#B8C0D4">Your computer's graphics took a coffee break, so the game went blank. Your run is saved. Reload and pick up where you left off with <b style="color:#FFF0CF">Continue saved run</b>.</p>
        <button type="button" id="ctx-reload" style="width:100%;min-height:48px;border:0;border-radius:6px;background:#EF9347;color:#171C35;font:14px Silkscreen,monospace;letter-spacing:.05em;cursor:pointer">RELOAD THE GAME</button>
        <p style="margin:12px 0 0;font-size:13px;color:#83A89A">Happens a lot? Close a few browser tabs, then reload.</p></div>`;
      document.body.appendChild(d);
      d.querySelector("#ctx-reload").addEventListener("click", () => location.reload());
    }, false);
    cv.addEventListener("webglcontextrestored", () => { const d = document.getElementById("ctx-lost"); if (d) d.remove(); }, false);
  };
  hook();
})();
