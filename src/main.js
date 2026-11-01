// Midlife Survivors
// A square you can move around, and Bills that come for you.

const WORLD_SIZE = 4000; // no longer a wall: the floor is endless now (kept for reference)

const config = {
  type: Phaser.AUTO,
  parent: "game",
  transparent: true, // allows the underlying Three.js 3D / Diablo canvas to show through in 3D modes!
  scale: { mode: Phaser.Scale.RESIZE, width: window.innerWidth, height: window.innerHeight },
  physics: { default: "arcade" },
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
let meta, runCoins = 0, runKills = 0; // runKills feeds the leaderboard score
// "stats" is this run's copy of the numbers. Upgrades change the copy, never the data files,
// so every new run starts fresh.
let stats, spawnTimer, currentWaveIdx = 0, fireTimer, jokeTimer, noTimer, levelUpOpen = false, paused = false, pauseParts = [], pendingLevels = 0, levelMenu = null, restartGame = null;
let titleSeen = false, titleOpen = false, startFromTitle = null;
let ltDecadeShown = null, ltLowHpWarned = false; // lower third trackers
let nextSwarmAt = null; // when the next swarm event fires (game time)
let pings = null;       // Group Chat message pings
let hp, lastHurt = -Infinity, hpBar, gameOver = false, startTime = 0;
let runElapsedMs = 0, runStartAge = 40, lastAutoSave = 0, retire80Open = false, retire80Prompted = false, currentStageId = "office", lastDividendAge = 40;
let touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0, isTouch: false, curX: 0, curY: 0 };
let mouseState = { leftDown: false, rightDown: false, x: 0, y: 0, activeCursor: false, overUI: false };
window._heldKeys = window._heldKeys || new Set();
let lastWheelMs = 0;

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
window.getRunEndMs = () => (modeEndAge() - runStartAge) * modeCfg().secondsPerYear * 1000; // when the ending arrives, in run time
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
  gameOver = false; lastHurt = -Infinity; startTime = this.time.now;
  runElapsedMs = 0; lastAutoSave = 0; retire80Open = false; retire80Prompted = false;
  meta = loadMeta();
  runMode = pickRunMode();
  runStartAge = modeStartAge();
  currentAge = runStartAge; lastDividendAge = Math.floor(runStartAge / 5) * 5;
  bossesSpawned = {}; slowUntil = 0; currentWaveIdx = 0;
  paused = false; pauseParts = [];
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0, isTouch: false, curX: 0, curY: 0 };
  mouseState = { leftDown: false, rightDown: false, x: window.innerWidth / 2, y: window.innerHeight / 2, activeCursor: false, overUI: false };
  window._heldKeys.clear();
  levelUpOpen = false; pendingLevels = 0; levelMenu = null; restartGame = null;
  runCoins = 0; runKills = 0; lastJokeToldAt = 0;
  buffs = { speedUntil: 0, speedMult: 1, damageUntil: 0, damageMult: 1, vacuumUntil: 0 };
  runAch = { bills: 0, kinds: {}, newly: [], lastAge: 40 };
  coinFrac = 0; xpFrac = 0;
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
  buildWeaponSprites(this); // TV Remote, Spreadsheet cells, Podcast waves
  initExtraWeapons(this);

  // 2. The stage: an open-plan office floor (carpet, wood hallway, breakroom rug) plus scattered office props!
  floor = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "floor")
    .setOrigin(0).setScrollFactor(0);
  this.scale.on("resize", size => floor.setSize(size.width, size.height));
  stageProps = spawnStageProps(this);

  // 3. The player. No walls anymore: the world goes on forever.
  player = this.physics.add.sprite(0, 0, "player").setDepth(5);
  label = this.add.text(0, 0, `${PLAYER.name} (${PLAYER.startingAge})`, {
    fontFamily: "monospace", fontSize: "14px", color: "#e8e9f3"
  }).setOrigin(0.5, 1).setDepth(6);

  // 3b. Clean screen HUD: a small HP bar that rides under the player (Vampire Survivors style),
  //     redrawn after every frame. The top HUD (age, XP) also refreshes here about 10x a second.
  const hpBar = this.add.graphics().setDepth(7);
  ltDecadeShown = null; ltLowHpWarned = false; nextSwarmAt = null;
  let hudTick = 0;
  const onPostUpdate = (t, dt) => {
    hpBar.clear();
    const vsHud = document.getElementById("vs-hud");
    if (vsHud) vsHud.classList.toggle("hidden", !!(titleOpen || gameOver)); // no HUD peeking behind title or Game Over
    if (!player || !stats || titleOpen) return;
    const w = 44, h = 6;
    const x = player.x - w / 2, y = player.y + player.displayHeight / 2 + 4;
    const pct = Phaser.Math.Clamp(hp / stats.maxHp, 0, 1);
    hpBar.fillStyle(0x0a0c18, 0.9).fillRect(x - 1, y - 1, w + 2, h + 2);
    hpBar.fillStyle(pct > 0.35 ? 0xd9383a : 0xff2d2d, 1).fillRect(x, y, w * pct, h);
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
      if (hpPct <= 0.3 && !ltLowHpWarned) { ltLowHpWarned = true; window.showLowerThird("alert", "LOW HP", (window.ALERTS && window.ALERTS.lowHp) || "Low health!", 4000); }
      if (hpPct > 0.6) ltLowHpWarned = false;
    }
    hudTick += dt;
    if (hudTick > 100 && typeof updateCleanHUD === "function") { hudTick = 0; updateCleanHUD(); }
  };
  this.events.on("postupdate", onPostUpdate);
  this.events.once("shutdown", () => this.events.off("postupdate", onPostUpdate)); // no duplicates after a restart

  // 4. The camera follows the player, like a photographer tracking a subject.
  this.cameras.main.startFollow(player, true, 0.12, 0.12);

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
    hurtPlayer(p, { kind: "groupChat", damage: ping.damage || 1 });
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
  stats.hasShoes = false; stats.hasSleep = false; stats.hasGlasses = false;
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

  const ch = CHARACTERS.find(c => c.id === meta.selectedChar) || CHARACTERS[0];
  ch.apply(stats);
  hp = stats.maxHp;
}

// Start a brand-new run at the selected Decade Checkpoint (40, 50, 60, 70, or 80) with starter upgrades!
function beginFreshRunAtDecade(scene) {
  clearRunState();
  applyMetaAndChar();
  runMode = pickRunMode();
  runStartAge = modeStartAge();
  currentAge = runStartAge;
  lastDividendAge = Math.floor(runStartAge / 5) * 5;
  runElapsedMs = 0;
  lastAutoSave = 0;
  retire80Prompted = runStartAge >= 80;
  bossesSpawned = {};
  ["performanceReview", "mortgageRefinance", "midlifeCrisis", "hoaPresident", "retirementBoss", "pickleballChamp", "theReaper"].forEach(bk => {
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

// You picked up a slice of Leftover Breakroom Pizza (dropped from smashing potted plants): heals +3 HP!
// Coins: only part of a coin's face value reaches the bank (PICKUPS.coin401k.bankMult), boosted by Side Hustle.
// Fractions add up over the run instead of being lost.
let coinFrac = 0, xpFrac = 0;
function bankCoins(v) {
  coinFrac += v * ((PICKUPS.coin401k && PICKUPS.coin401k.bankMult) || 1) * ((stats && stats.coinMult) || 1);
  const whole = Math.floor(coinFrac); coinFrac -= whole; return whole;
}

// ---------- Achievements (src/data/achievements.js) ----------
let runAch = { bills: 0, kinds: {}, newly: [], lastAge: 40 };
window.getNewAchievements = () => runAch.newly;
window.achEvent = (on, d = {}) => {
  if (!meta || !window.ACHIEVEMENTS) return;
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
    runAch.newly.push(def);
    sfx("levelUp");
    if (window.showLowerThird) window.showLowerThird("win", "ACHIEVED", `${def.icon} ${def.name}: ${def.desc} +${def.reward}k`, 4500);
  });
  if (changed) saveMeta(meta);
};

// ---------- Discoverable items + timed boosts ----------
let buffs = { speedUntil: 0, speedMult: 1, damageUntil: 0, damageMult: 1, vacuumUntil: 0 };

window.startBuff = (type, mult, durMs, label) => {
  buffs[type + "Until"] = runElapsedMs + durMs;
  buffs[type + "Mult"] = mult;
  if (window.showLowerThird) window.showLowerThird("reward", label, `${type === "speed" ? "Faster feet" : "Extra damage"} for ${Math.round(durMs / 1000)} seconds.`, 3500);
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
  const it = window.fieldItems.create(x, y, itemTexture(scene, kind)).setDepth(3);
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
  if (!quiet && window.showLowerThird) window.showLowerThird("reward", FIELD_ITEMS[kind].name.toUpperCase(), FIELD_ITEMS[kind].text, 4000);
};

function collectFieldItem(p, it) {
  if (!it.active) return;
  const kind = it.kind;
  if (it.glowRing) it.glowRing.destroy();
  it.destroy();
  sfx("levelUp");
  window.itemEffect(kind, false);
}

function collectPizza(p, pz) {
  if (!pz.active) return;
  if (slowUntil > 0 && runElapsedMs - slowUntil < 8000) window.achEvent("pizzaAfterSlow"); // donut, then pizza
  pz.destroy();
  sfx("levelUp");
  hp = Math.min(stats.maxHp, hp + PICKUPS.pizza.heal);
  updateHUD();
  const pt = project3DToPhaserWorld(p.scene, p.x, 42, p.y);
  const txt = p.scene.add.text(pt.x, pt.y - 18, `+${PICKUPS.pizza.heal} HP (PIZZA!)`, {
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

// You walked over a gold Boss Chest: free weapon or upgrade choice + Executive Bonus 401(k) Dividend!
function collectChest(p, chest) {
  if (!chest.active) return;
  if (chest.tag) chest.tag.destroy();
  chest.destroy();
  const execBonus = window.getCoinYieldInfo().value * 4;
  runCoins += execBonus;
  meta.coins += execBonus;
  saveMeta(meta);
  updateHUD();
  pendingLevels++;
  if (!levelUpOpen) showLevelUp(p.scene, `EXECUTIVE BONUS CHEST! (+${execBonus}k 401k)`, true);
}

function drawXpBar() { updateHUD(); }
function drawHpBar() { updateHUD(); }

// You touched a gem: bank the XP, and level up if the bar is full.
function collectGem(p, gem) {
  if (!gem.active) return;
  gem.destroy();
  sfx("gem");
  xpFrac += PICKUPS.wisdomGem.xp * (stats.xpMult || 1); // Continuing Ed adds a little to every gem
  xp += Math.floor(xpFrac); xpFrac -= Math.floor(xpFrac);
  while (xp >= xpNeeded) {
    xp -= xpNeeded;
    level++;
    xpNeeded = Math.round(xpNeeded * LEVELING.growth + (LEVELING.stepXp || 4));
    pendingLevels++;
    hp = Math.min(stats.maxHp, hp + 2); // leveling up restores +2 HP!
  }
  updateHUD();
  if (pendingLevels > 0 && !levelUpOpen) showLevelUp(p.scene);
}

// The level-up screen: pause the world and offer 3 vertical Perk Cards in the HTML/CSS overlay!
function showLevelUp(scene, customTitle, preferWeapons) {
  levelUpOpen = true;
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
    const jokeBefore = [stats.dadJoke, stats.jokeRadius, stats.jokeDamage, stats.jokeEveryMs].join();
    up.apply(stats);
    if (up.isEvolution) window.achEvent("evolve", { name: up.name });
    if (stats.dadJoke && jokeBefore !== [stats.dadJoke, stats.jokeRadius, stats.jokeDamage, stats.jokeEveryMs].join()) stats.jokeAnnounce = true;
    if (stats.heal) { hp = Math.min(stats.maxHp, hp + stats.heal); stats.heal = 0; }
    const cd = stats.cooldownMult;
    fireTimer.reset({ delay: Math.round(stats.fireEveryMs * cd), loop: true, callback: fireTimer.callback });
    jokeTimer.reset({ delay: Math.round(stats.jokeEveryMs * cd), loop: true, callback: jokeTimer.callback });
    noTimer.reset({   delay: Math.round(stats.noEveryMs   * cd), loop: true, callback: noTimer.callback });
    updateHUD();
    touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
    pendingLevels--;
    levelUpOpen = false;
    scene.physics.resume();
    scene.time.paused = false;
    if (pendingLevels > 0) showLevelUp(scene);
  };

  const uiCtrl = renderLevelUpModal(choices, customTitle, pick);
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
  if (bill.kind === "theReaper") { showGameOver(scene, "theReaper", true); return; } // Reaching Age 100 = CENTENARIAN VICTORY!
  if (bill.ghost) return; // a faded 3 AM Thought can't touch you
  if (now - lastHurt < PLAYER.hurtCooldownMs) return; // still in the safe window
  lastHurt = now;
  hp -= (bill.damage || ENEMIES.bill.damage) + Math.round(ageCurve((window.INTENSITY || {}).hitDamageByAge, currentAge) || 0);
  if (bill.kind === "snackAttack") {
    slowUntil = runElapsedMs + ENEMIES.snackAttack.slowDurationMs;
    const isSenior = currentAge >= 80;
    const msg = scene.add.text(p.x, p.y - 30, isSenior ? "3 PM DINNER NAP!" : "SUGAR CRASH!", {
      fontFamily: "monospace", fontSize: "12px", color: "#f078b8"
    }).setOrigin(0.5);
    scene.tweens.add({ targets: msg, y: msg.y - 22, alpha: 0, duration: 700, onComplete: () => msg.destroy() });
  }
  sfx("hurt");
  scene.cameras.main.shake(120, 0.009); // screen shake when you take contact damage!
  drawHpBar();
  p.setTintFill(0xe0564f); // flash red
  scene.time.delayedCall(100, () => p.clearTint());
  if (hp <= 0 && stats.revives > 0) { // Second Opinion (401k shop): get back up once
    stats.revives--; hp = Math.ceil(stats.maxHp / 2); drawHpBar(); lastHurt = now + 1500;
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
  if (isWin) window.achEvent("clear", { mode: runMode, age: currentAge });
  else window.achEvent("death", { killer });
  clearRunState();
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

  renderGameOverModal(scene, cause, isWin);
}

// Pop a floating damage number above an enemy that drifts up and fades out.
function popDamageNumber(sc, x, y, amount) {
  const big = amount >= 2;
  const pt = project3DToPhaserWorld(sc, x, 34, y);
  const txt = sc.add.text(pt.x + Phaser.Math.Between(-8, 8), pt.y - 14, `-${amount}`, {
    fontFamily: "monospace", fontSize: big ? "16px" : "13px", fontStyle: "bold",
    color: big ? "#ffe042" : "#ffffff", stroke: "#12152a", strokeThickness: 3
  }).setOrigin(0.5).setDepth(15);
  sc.tweens.add({
    targets: txt, y: txt.y - 26, alpha: 0, scale: big ? 1.25 : 1,
    duration: 460, ease: "Cubic.easeOut", onComplete: () => txt.destroy()
  });
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
  bill.hp -= amount;
  popDamageNumber(sc, bill.x, bill.y, amount);
  if (bill.hp > 0) {
    sfx("hit");
    if (bill.isBoss) bill.tag.setText(`${ENEMIES[bill.kind].label}:${bill.hp}`);
    bill.setTintFill(0xffffff); // quick white flash so you can see the hit
    // Quick squash-and-stretch punch on hit!
    sc.tweens.add({ targets: bill, scaleX: 1.22, scaleY: 0.82, duration: 55, yoyo: true });
    sc.time.delayedCall(60, () => { if (bill.active) bill.clearTint(); });
  } else {
    runKills += bill.isBoss ? 25 : 1; // bosses count extra toward your score
    window.achEvent(bill.isBoss ? "bossKill" : "kill", { kind: bill.kind });
    sfx(bill.isBoss ? "bossDefeat" : "billPaid");
    const E = ENEMIES[bill.kind] || ENEMIES.bill;
    burstConfetti(sc, bill.x, bill.y, E.color, bill.isBoss ? 16 : 6);
    if (bill.isBoss) {
      sc.cameras.main.shake(220, 0.012);
      const ch = chests.create(bill.x, bill.y, "chest").setDepth(3);
      ch.tag = sc.add.text(bill.x, bill.y, "BONUS", {
        fontFamily: "monospace", fontSize: "11px", color: "#f5c542"
      }).setOrigin(0.5).setDepth(4);
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

// Smashable Potted Office Plants ("prop_plant")! Crack them open for Leftover Pizza (+3 HP), 401(k) Coins, or Bonus Gems!
function damagePlant(prop, amount) {
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

    if (Math.random() < ITEM_DROPS.fromPlant) spawnFieldItem(sc, prop.x, prop.y + 14);
    // Roll plant loot reward: 45% Leftover Pizza (+3 HP) + 1 Coin, 35% 2x 401(k) Coins, 20% 3x Coins + 1 Gem Jackpot!
    const roll = Math.random();
    let popupTxt = "🪙 +401(k)!";
    if (roll < 0.45) {
      window.pizzas.create(prop.x - 6, prop.y, "pizza").setDepth(3);
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

function hitProp(splash, prop) {
  if (!splash.active || !prop.visible || prop.propKind !== "prop_plant") return;
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

function fireDadJoke(scene) {
  if (!stats.dadJoke) return;
  sfx("dadJoke");
  const J = WEAPONS.dadJoke, r = stats.jokeRadius;
  if (window.viewModeIdx > 0) {
    spawn3DRing(player.x, player.y, r, J.color);
  } else {
    const ring = scene.add.circle(player.x, player.y, 12, J.color, 0.25).setStrokeStyle(3, J.color);
    scene.tweens.add({ targets: ring, radius: r, alpha: 0, duration: 380, onComplete: () => ring.destroy() });
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
    if (Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y) <= r) {
      damageBill(bill, stats.jokeDamage);
    }
  });
  if (stageProps) {
    stageProps.forEach(p => {
      if (p.visible && p.propKind === "prop_plant" && Phaser.Math.Distance.Between(player.x, player.y, p.x, p.y) <= r) {
        damagePlant(p, stats.jokeDamage);
      }
    });
  }
}

// Weapon 3: The Word "No." A teal shockwave shoves nearby Bills away and damages them (and smashes plants!).
function fireWordNo(scene) {
  if (!stats.wordNo) return;
  sfx("wordNo");
  const N = WEAPONS.wordNo, r = stats.noRadius;
  if (window.viewModeIdx > 0) {
    spawn3DRing(player.x, player.y, r, N.color);
  } else {
    const wave = scene.add.circle(player.x, player.y, 16, N.color, 0.18).setStrokeStyle(4, N.color);
    scene.tweens.add({ targets: wave, radius: r, alpha: 0, duration: 320, onComplete: () => wave.destroy() });
  }
  const pt = project3DToPhaserWorld(scene, player.x, 54, player.y);
  const shout = scene.add.text(pt.x, pt.y - 28, stats.healthyBoundaries ? "NO! (+1 HP)" : "NO.", {
    fontFamily: "monospace", fontSize: "16px", color: "#6fd9c4"
  }).setOrigin(0.5).setDepth(16);
  scene.tweens.add({ targets: shout, y: shout.y - 20, alpha: 0, duration: 500, onComplete: () => shout.destroy() });
  if (stats.healthyBoundaries && hp < stats.maxHp) { hp = Math.min(stats.maxHp, hp + 1); drawHpBar(); }

  bills.getChildren().slice().forEach(bill => {
    const d = Phaser.Math.Distance.Between(player.x, player.y, bill.x, bill.y);
    if (d <= r && d > 0) {
      const dx = (bill.x - player.x) / d, dy = (bill.y - player.y) / d; // direction away from you
      bill.x += dx * stats.noPush; bill.y += dy * stats.noPush;
      const sz = (ENEMIES[bill.kind] && ENEMIES[bill.kind].size) || 24;
      bill.tag.setPosition(bill.x, bill.y - sz / 2 - 6);
      damageBill(bill, stats.noDamage);
    }
  });
  if (stageProps) {
    stageProps.forEach(p => {
      if (p.visible && p.propKind === "prop_plant" && Phaser.Math.Distance.Between(player.x, player.y, p.x, p.y) <= r) {
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
  if (stageProps) {
    let bestPlant = null, plantDist = 210;
    stageProps.forEach(p => {
      if (p.visible && p.propKind === "prop_plant") {
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
  if (window.firstTimeTip) window.firstTimeTip(kind);
  const E = ENEMIES[kind];
  const e = bills.create(x, y, E.tex || kind).setDepth(4);
  if (E.tint) e.setTint(E.tint);
  const yrs = Math.max(0, currentAge - 40);
  const perYear = (window.INTENSITY && window.INTENSITY.hpPerYear) || 0.09;
  const lvlScale = 1 + Math.max(0, level - 1) * ((window.INTENSITY && window.INTENSITY.hpPerLevel) || 0); // the stronger you get, the tougher they get
  const hpScale = (1 + yrs * perYear + (currentAge >= 80 ? (currentAge - 80) * 0.3 : 0)) * lvlScale; // smooth toughness ramp
  e.kind = kind;
  e.hp = Math.max(1, Math.round(E.hp * hpScale));
  e.speed = Math.round(E.speed * (1 + Math.min(0.8, yrs * 0.012)));
  e.damage = E.damage + (currentAge >= 80 ? 2 : (currentAge >= 60 ? 1 : 0));
  e.bornAt = runElapsedMs;
  const st = (typeof getActiveStage === "function") ? getActiveStage(currentAge, meta) : null;
  const lbl = (currentAge >= 80 && E.seniorLabel)
    ? E.seniorLabel
    : ((st && st.labels && st.labels[kind]) ? st.labels[kind] : E.label);
  e.tag = scene.add.text(x, y - E.size / 2 - 6, lbl, {
    fontFamily: "monospace", fontSize: "10px", color: currentAge >= 80 ? "#f5c542" : "#e8e9f3"
  }).setOrigin(0.5).setDepth(5);
  return e;
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
  const totalWeight = wave.mix.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * totalWeight, kind = wave.mix[0][0];
  for (const [k, w] of wave.mix) {
    if ((roll -= w) <= 0) { kind = k; break; }
  }
  return kind;
}

// The everyday drip: a small PACK of enemies just outside the screen. Packs get bigger each decade.
function spawnBill(scene) {
  const I = window.INTENSITY || {};
  const cap = Math.round(ageCurve(I.maxOnScreenByAge, currentAge) || SPAWNING.maxOnScreen);
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
  const pack = Math.max(1, Math.round(ageCurve(I.packSizeByAge, currentAge) || 1)) + Math.floor(Math.max(0, level - 1) * (I.packPerLevel || 0)); // stronger you = bigger crowds
  for (let i = 0; i < pack && bills.countActive() < cap; i++) {
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
  const x = view.right + SPAWNING.offscreenMargin, y = player.y;
  const boss = bills.create(x, y, P.tex || bossKind).setDepth(4);
  const isEnd = bossKind === "theReaper", m = modeCfg();
  const label = (isEnd && m.endBossLabel) || P.label, bossName = (isEnd && m.endBossName) || P.name;
  if (P.tint) boss.setTint(P.tint);
  boss.isBoss = true;
  boss.kind = bossKind;
  boss.hp = isEnd ? P.hp : Math.round(P.hp * (1 + Math.max(0, level - 1) * ((window.INTENSITY && window.INTENSITY.bossHpPerLevel) || 0)));
  boss.speed = P.speed;
  boss.damage = P.damage;
  boss.tag = scene.add.text(x, y - P.size / 2 - 8, `${label}:${P.hp}`, {
    fontFamily: "monospace", fontSize: "14px", color: "#f5c542", backgroundColor: "#12152acc", padding: { x: 4, y: 2 }
  }).setOrigin(0.5).setDepth(5);

  showBossToastUI(bossName);
  if (window.pushContextEvent) {
    if (isEnd && m.endBossLabel) window.showLowerThird("win", `AGE ${Math.round(modeEndAge())}`, m.endText, 7000);
    else if (isEnd) window.showLowerThird("win", "AGE 100", "Death has arrived. Walk up and shake his hand.", 7000);
    else window.showLowerThird("alert", "BOSS", `${P.name} just walked in. Keep moving in wide circles.`, 5500);
  }
}

// update() runs about 60 TIMES PER SECOND: this is the game loop.
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
    const stepDir = getPadMenuStep(performance.now());
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
    }
  } else {
    // Active gameplay controller shortcuts: Start or B opens Pause & Options
    if (padJust("start") || padJust("b")) togglePause(this);
  }

  if (gameOver || levelUpOpen || paused || titleOpen || retire80Open || window.controlsModalOpen || window.changelogModalOpen || window.loreModalOpen) {
    renderThreeView(this);
    restore2DSprites();
    return; // freeze while dead, paused, on title, or choosing an upgrade
  }
  updateExtraWeapons(this, delta); // TV Remote, Spreadsheet, Podcast (src/weapons_extra.js)

  // Active-play Age clock: only advances during real gameplay (never while reading level-up cards or paused!).
  runElapsedMs += (delta || 16.6);
  currentAge = runStartAge + (runElapsedMs / 1000) / modeCfg().secondsPerYear; // 45 s/year in Midlife, 60 in Full Life
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
    if (window.pushContextEvent) {
      window.showLowerThird("reward", "401(k)", `Age ${lastDividendAge} dividend: +${divBonus}k deposited.`, 3800);
    }
  }

  updateHUD();
  label.setText(`${PLAYER.name} (${Math.floor(currentAge)})`);

  // Check if we progressed into a new Life Stage / Environment (Office -> Hospital -> Home -> Social -> Resort)!
  if (typeof getActiveStage === "function") {
    const activeStage = getActiveStage(currentAge, meta);
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
    if (!bossesSpawned[bk] && currentAge >= ENEMIES[bk].spawnAge) spawnBoss(this, bk);
  });
  if (!bossesSpawned.theReaper && currentAge >= modeEndAge()) spawnBoss(this, "theReaper");

  // Wave schedule: as you pass milestone ages, speed up the spawn timer!
  const wIdx = SPAWNING.waves.reduce((acc, w, i) => currentAge >= w.minAge ? i : acc, 0);
  // Smooth ramp: blend toward the NEXT wave's speed as you age, instead of jumping in big steps.
  const nextW = SPAWNING.waves[Math.min(wIdx + 1, SPAWNING.waves.length - 1)], curW = SPAWNING.waves[wIdx];
  const span = Math.max(1, nextW.minAge - curW.minAge);
  const blend = nextW === curW ? 0 : Phaser.Math.Clamp((currentAge - curW.minAge) / span, 0, 1);
  const lvlSpeed = Math.max(0.45, 1 - Math.max(0, level - 1) * ((window.INTENSITY && window.INTENSITY.spawnFasterPerLevel) || 0));
  const wantDelay = Math.round((curW.everyMs + (nextW.everyMs - curW.everyMs) * blend) * lvlSpeed);
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

  const buffSpd = runElapsedMs < buffs.speedUntil ? buffs.speedMult : 1; // Energy Drink / Standing Desk
  const moveSpd = (runElapsedMs < slowUntil ? stats.speed * ENEMIES.snackAttack.slowFactor : stats.speed) * buffSpd;
  player.setVelocity(x * moveSpd, y * moveSpd);
  if (x !== 0) player.setFlipX(x < 0); // face left or right
  player.setAngle((x !== 0 || y !== 0) ? Math.sin(this.time.now / 55) * 7 : 0); // jaunty walk wobble
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

  // Magnet: gems and 401(k) coins close to you fly toward you.
  const W = PICKUPS.wisdomGem;
  gems.getChildren().forEach(gem => {
    if (Phaser.Math.Distance.Between(player.x, player.y, gem.x, gem.y) < stats.magnetRadius) {
      this.physics.moveToObject(gem, player, W.magnetSpeed);
    }
  });
  const vacuum = runElapsedMs < buffs.vacuumUntil; // Fanny Pack: pull from anywhere
  if (vacuum) gems.getChildren().forEach(g => this.physics.moveToObject(g, player, W.magnetSpeed * 1.6));
  // Items on the floor expire after a while.
  if (window.fieldItems) window.fieldItems.getChildren().slice().forEach(it => { if (runElapsedMs > it.expireAt) { if (it.glowRing) it.glowRing.destroy(); it.destroy(); } else if (it.glowRing) it.glowRing.setPosition(it.x, it.y); });
  coins.getChildren().forEach(c => {
    if (vacuum || Phaser.Math.Distance.Between(player.x, player.y, c.x, c.y) < stats.magnetRadius) {
      this.physics.moveToObject(c, player, W.magnetSpeed);
    }
  });
  if (window.pizzas) {
    window.pizzas.getChildren().forEach(pz => {
      if (Phaser.Math.Distance.Between(player.x, player.y, pz.x, pz.y) < stats.magnetRadius) {
        this.physics.moveToObject(pz, player, W.magnetSpeed);
      }
    });
  }

  // Every frame, update each enemy according to its behavior (state machine).
  const now = runElapsedMs;
  bills.getChildren().slice().forEach(bill => {
    if (!bill.active) return;
    const ageMs = now - (bill.bornAt || now);

    // 1. Unpaid Bills turn red and split into two fast Late Fees after 9 seconds!
    if (bill.kind === "bill" && ageMs > ENEMIES.bill.overdueAfterMs) {
      sfx("overdue");
      const bx = bill.x, by = bill.y;
      bill.tag.destroy(); bill.destroy();
      window.achEvent("split");
      createEnemy(this, "lateFee", bx - 14, by - 10);
      createEnemy(this, "lateFee", bx + 14, by + 10);
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
      const T = ENEMIES.threeAmThought, cyc = T.solidMs + T.ghostMs;
      const ghost = (ageMs % cyc) >= T.solidMs;
      if (ghost !== !!bill.ghost) {
        bill.ghost = ghost;
        bill.setAlpha(ghost ? 0.25 : 1);
        bill.tag.setAlpha(ghost ? 0.3 : 1);
      }
      this.physics.moveToObject(bill, player, ghost ? T.ghostSpeed : bill.speed);
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
      if (d > G.keepDistance + 40) this.physics.moveToObject(bill, player, bill.speed);
      else if (d < G.keepDistance - 40) bill.setVelocity(Math.cos(a) * bill.speed, Math.sin(a) * bill.speed); // back away
      else bill.setVelocity(-Math.sin(a) * bill.speed * 0.8, Math.cos(a) * bill.speed * 0.8);                // circle you
      if (!bill.nextPing) bill.nextPing = now + G.fireEveryMs * (0.5 + Math.random() * 0.5);
      if (!bill.typing && now >= bill.nextPing - G.typingMs) { bill.typing = true; bill.tag.setText("typing...").setColor("#8ff0a8"); }
      if (now >= bill.nextPing) {
        bill.typing = false; bill.nextPing = now + G.fireEveryMs;
        bill.tag.setText(currentAge >= 80 && G.seniorLabel ? G.seniorLabel : G.label).setColor("#e8e9f3");
        const pa = Phaser.Math.Angle.Between(bill.x, bill.y, player.x, player.y);
        const ping = pings.create(bill.x, bill.y, "ping").setDepth(6);
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

    // Default behavior (Bills, Late Fees, Snacks, Twinge lunge, Elites, Bosses): steer directly toward you.
    this.physics.moveToObject(bill, player, bill.speed || ENEMIES.bill.speed);
    bill.setFlipX(player.x < bill.x);
    const sz = (ENEMIES[bill.kind] && ENEMIES[bill.kind].size) || 24;
    bill.tag.setPosition(bill.x, bill.y - sz / 2 - 6);
  });

  // Old message pings fade away.
  if (pings) pings.getChildren().slice().forEach(pg => { if (now >= pg.dieAt) pg.destroy(); });

  // Splashes that flew past their range evaporate (we delete them so they don't pile up).
  splashes.getChildren().slice().forEach(s => {
    if (Phaser.Math.Distance.Between(s.startX, s.startY, s.x, s.y) > stats.range) s.destroy();
  });

  // Render the active 3D / Diablo 3/4 view (or restore 2D sprites when in 2D 16-Bit mode)
  renderThreeView(this);
  restore2DSprites();
}

window.game = new Phaser.Game(config);
