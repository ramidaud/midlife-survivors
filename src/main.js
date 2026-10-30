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
// controllers work reliably even when clicking HTML UI buttons!
let padPrev = {}, padNow = {}, padHoldDir = null, padNextRepeatMs = 0;
function readPad(scene) {
  padPrev = padNow;
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
    padNow = {
      connected: true,
      x: Math.abs(sx) > 0.2 ? sx : 0,
      y: Math.abs(sy) > 0.2 ? sy : 0,
      left: pPad.left || sx < -0.55,
      right: pPad.right || sx > 0.55,
      up: pPad.up || sy < -0.55,
      down: pPad.down || sy > 0.55,
      a: pPad.A, b: pPad.B, xBtn: pPad.X, yBtn: pPad.Y,
      start: !!(pPad.buttons && pPad.buttons[9] && pPad.buttons[9].pressed)
    };
    if (window.setGamepadConnectedUI) window.setGamepadConnectedUI(true);
    return;
  }

  if (window.setGamepadConnectedUI) window.setGamepadConnectedUI(true);
  const btn = idx => !!(gp.buttons && gp.buttons[idx] && (gp.buttons[idx].pressed || gp.buttons[idx].value > 0.5));
  const ax0 = (gp.axes && gp.axes[0]) || 0;
  const ax1 = (gp.axes && gp.axes[1]) || 0;
  const ax2 = (gp.axes && gp.axes[2]) || 0;
  const ax3 = (gp.axes && gp.axes[3]) || 0;
  const sx = Math.abs(ax0) >= Math.abs(ax2) ? ax0 : ax2;
  const sy = Math.abs(ax1) >= Math.abs(ax3) ? ax1 : ax3;

  padNow = {
    connected: true,
    x: Math.abs(sx) > 0.22 ? sx : 0,
    y: Math.abs(sy) > 0.22 ? sy : 0,
    up:    btn(12) || sy < -0.55,
    down:  btn(13) || sy >  0.55,
    left:  btn(14) || sx < -0.55,
    right: btn(15) || sx >  0.55,
    a:     btn(0),
    b:     btn(1),
    xBtn:  btn(2),
    yBtn:  btn(3),
    start: btn(9) || btn(8)
  };
  if (padNow.a || padNow.b || padNow.yBtn || padNow.start) unlockAudio();
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
let meta, runCoins = 0;
// "stats" is this run's copy of the numbers. Upgrades change the copy, never the data files,
// so every new run starts fresh.
let stats, spawnTimer, currentWaveIdx = 0, fireTimer, jokeTimer, noTimer, levelUpOpen = false, paused = false, pauseParts = [], pendingLevels = 0, levelMenu = null, restartGame = null;
let titleSeen = false, titleOpen = false, startFromTitle = null;
let hp, lastHurt = -Infinity, hpBar, gameOver = false, startTime = 0;
let runElapsedMs = 0, runStartAge = 40, lastAutoSave = 0, retire80Open = false, retire80Prompted = false;
let touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };

// create() runs ONCE when the game starts: build the world.
function create() {
  // Fresh start (this also runs again when you press "Try again").
  gameOver = false; lastHurt = -Infinity; startTime = this.time.now;
  runElapsedMs = 0; lastAutoSave = 0; retire80Open = false; retire80Prompted = false;
  meta = loadMeta();
  runStartAge = meta.startDecade || PLAYER.startingAge;
  currentAge = runStartAge; bossesSpawned = {}; slowUntil = 0; currentWaveIdx = 0;
  paused = false; pauseParts = [];
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
  levelUpOpen = false; pendingLevels = 0; levelMenu = null; restartGame = null;
  runCoins = 0;
  stats = {
    speed: PLAYER.speed, maxHp: PLAYER.maxHp, cooldownMult: 1,
    fireEveryMs: WEAPONS.coffeeSplash.fireEveryMs, damage: WEAPONS.coffeeSplash.damage,
    range: WEAPONS.coffeeSplash.range, magnetRadius: PICKUPS.wisdomGem.magnetRadius,
    dadJoke: false, jokeEveryMs: WEAPONS.dadJoke.fireEveryMs, jokeRadius: WEAPONS.dadJoke.radius, jokeDamage: WEAPONS.dadJoke.damage,
    wordNo: false, noEveryMs: WEAPONS.wordNo.fireEveryMs, noRadius: WEAPONS.wordNo.radius, noDamage: WEAPONS.wordNo.damage, noPush: WEAPONS.wordNo.pushPx
  };
  applyMetaAndChar();
  // 1. Build pixel-art sprites for every character, enemy, pickup, and the background floor (in src/sprites.js).
  buildSprites(this);

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

  // 4. The camera follows the player, like a photographer tracking a subject.
  this.cameras.main.startFollow(player, true, 0.12, 0.12);

  // 5. Initialize the Chameleon + Corporate Satire HTML/CSS UI overlay (in src/ui.js).
  initGameUI(this);
  hideAllModals();

  const toggleView = () => {
    cycleViewMode(this);
    sfx("pick");
    if (titleOpen) renderTitleModal(this);
    if (paused) renderPauseModal(this, 1);
  };

  // 6. Controls: Unified Keyboard Navigation + Spacebar Pause/Options + Mobile Virtual Touch Joystick.
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys("W,A,S,D");
  window._activeGameScene = this;
  if (!window._globalKeyBound) {
    window._globalKeyBound = true;
    window.addEventListener("keydown", e => {
      const sc = window._activeGameScene;
      if (!sc) return;
      const code = e.code;
      const activeModal = window.menuNav && window.menuNav.getActiveModal();

      // Global Style Switch [V] and Mute [M]
      if (code === "KeyV") {
        e.preventDefault();
        unlockAudio();
        cycleViewMode(sc);
        sfx("pick");
        if (titleOpen) renderTitleModal(sc);
        if (paused) renderPauseModal(sc, 1);
        return;
      }
      if (code === "KeyM") {
        e.preventDefault();
        unlockAudio();
        toggleMute();
        if (typeof syncMuteButtons === "function") syncMuteButtons();
        if (paused) renderPauseModal(sc, 2);
        return;
      }

      // If ANY modal is open (Title, Level-Up, Pause/Options, Age 80 Retirement, or Game Over):
      // Arrow keys & WASD move the highlight, and Space / Enter activates the highlighted option!
      if (activeModal) {
        if (code === "ArrowUp" || code === "KeyW") {
          e.preventDefault(); unlockAudio(); window.menuNav.move("up"); return;
        }
        if (code === "ArrowDown" || code === "KeyS") {
          e.preventDefault(); unlockAudio(); window.menuNav.move("down"); return;
        }
        if (code === "ArrowLeft" || code === "KeyA") {
          e.preventDefault(); unlockAudio(); window.menuNav.move("left"); return;
        }
        if (code === "ArrowRight" || code === "KeyD") {
          e.preventDefault(); unlockAudio(); window.menuNav.move("right"); return;
        }
        if (code === "Space" || code === "Enter" || code === "NumpadEnter") {
          e.preventDefault(); unlockAudio(); window.menuNav.activate(); return;
        }
        if ((code === "Escape" || code === "KeyP") && paused) {
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

      // During active gameplay: Spacebar, P, or Escape opens Pause & Options!
      if (code === "Space" || code === "KeyP" || code === "Escape") {
        e.preventDefault();
        unlockAudio();
        togglePause(sc);
      }
    }, { passive: false });
  }

  this.input.on("pointerdown", p => {
    if (gameOver || levelUpOpen || paused || titleOpen || retire80Open) return;
    touch = { active: true, startX: p.x, startY: p.y, dx: 0, dy: 0 };
    if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
  });
  this.input.on("pointermove", p => {
    if (!touch.active) return;
    touch.dx = p.x - touch.startX;
    touch.dy = p.y - touch.startY;
    if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
  });
  this.input.on("pointerup", () => {
    touch.active = false; touch.dx = touch.dy = 0;
    if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
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
  chests = this.physics.add.group();
  this.physics.add.overlap(player, gems, collectGem);
  this.physics.add.overlap(player, coins, collectCoin);
  this.physics.add.overlap(player, window.pizzas, collectPizza);
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
  runStartAge = meta.startDecade || PLAYER.startingAge;
  currentAge = runStartAge;
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

// You picked up a gold 401(k) Coin: goes straight into your permanent retirement balance!
function collectCoin(p, coin) {
  if (!coin.active) return;
  coin.destroy();
  sfx("coin");
  runCoins += PICKUPS.coin401k.value;
  meta.coins += PICKUPS.coin401k.value;
  saveMeta(meta);
  updateHUD();
}

// You picked up a slice of Leftover Breakroom Pizza (dropped from smashing potted plants): heals +3 HP!
function collectPizza(p, pz) {
  if (!pz.active) return;
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

// Toggle pause (Spacebar, P, Esc, Controller Start, or Mobile Pause Button).
function togglePause(scene) {
  if (gameOver || levelUpOpen || titleOpen || retire80Open) return;
  paused = !paused;
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
  if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(touch);
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

// You walked over a gold Boss Chest: free weapon or upgrade choice!
function collectChest(p, chest) {
  if (!chest.active) return;
  if (chest.tag) chest.tag.destroy();
  chest.destroy();
  pendingLevels++;
  if (!levelUpOpen) showLevelUp(p.scene, "EXECUTIVE BONUS CHEST!", true);
}

function drawXpBar() { updateHUD(); }
function drawHpBar() { updateHUD(); }

// You touched a gem: bank the XP, and level up if the bar is full.
function collectGem(p, gem) {
  if (!gem.active) return;
  gem.destroy();
  sfx("gem");
  xp += PICKUPS.wisdomGem.xp;
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
  const evos = pool.filter(u => u.isEvolution);
  const unlocked = preferWeapons ? pool.filter(u => u.name.startsWith("Unlock:")) : [];
  const priority = evos.concat(unlocked);
  const rest = Phaser.Utils.Array.Shuffle(pool.filter(u => !priority.includes(u)).slice());
  const choices = priority.concat(rest).slice(0, 3);

  const pick = up => {
    sfx("pick");
    if (levelMenu && levelMenu.close) levelMenu.close();
    levelMenu = null;
    window.levelMenu = null;
    up.apply(stats);
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
  if (now - lastHurt < PLAYER.hurtCooldownMs) return; // still in the safe window
  lastHurt = now;
  hp -= (bill.damage || ENEMIES.bill.damage);
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
  if (hp <= 0) showGameOver(scene, bill.kind || "bill", currentAge >= 80);
}

// The Game Over / Victory screen: freeze the world and render the HTML/CSS Exit Interview or AARP Certificate!
function showGameOver(scene, killer, isWin) {
  gameOver = true;
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
  const cause = isWin
    ? Phaser.Utils.Array.GetRandom(currentAge >= 99.5 ? winLines100 : winLines80)
    : Phaser.Utils.Array.GetRandom(DEATHS[killer] || DEATHS.bill);

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
  const sc = bill.scene;
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
    sfx(bill.isBoss ? "bossDefeat" : "billPaid");
    const E = ENEMIES[bill.kind] || ENEMIES.bill;
    burstConfetti(sc, bill.x, bill.y, E.color, bill.isBoss ? 16 : 6);
    if (bill.isBoss) {
      sc.cameras.main.shake(220, 0.012);
      const ch = chests.create(bill.x, bill.y, "chest").setDepth(3);
      ch.tag = sc.add.text(bill.x, bill.y, "BONUS", {
        fontFamily: "monospace", fontSize: "11px", color: "#f5c542"
      }).setOrigin(0.5).setDepth(4);
      for (let i = -2; i <= 2; i++) coins.create(bill.x + i * 10, bill.y + 14, "coin401k").setDepth(3);
    } else if (bill.kind === "officeGossip") {
      // Elite Reply-All Chain drops 3 Wisdom gems, 2 401(k) Coins, AND splits into 2 fast Late Fees!
      for (let i = -1; i <= 1; i++) gems.create(bill.x + i * 10, bill.y, "gem").setDepth(3);
      coins.create(bill.x - 8, bill.y + 10, "coin401k").setDepth(3);
      coins.create(bill.x + 8, bill.y + 10, "coin401k").setDepth(3);
      createEnemy(sc, "lateFee", bill.x - 16, bill.y - 10);
      createEnemy(sc, "lateFee", bill.x + 16, bill.y + 10);
    } else {
      gems.create(bill.x, bill.y, "gem").setDepth(3); // leave a Wisdom gem behind
      if (Math.random() < PICKUPS.coin401k.dropChance) {
        coins.create(bill.x + 10, bill.y, "coin401k").setDepth(3);
      }
    }
    bill.tag.destroy();
    bill.destroy(); // paid in full
  }
}

// A splash landed on a Bill: the splash is used up (unless evolved to Cold Brew, which pierces!), the Bill loses health.
function hitBill(splash, bill) {
  if (!splash.active || !bill.active) return; // already gone this frame
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
    prop.setVisible(false);
    if (prop.body) prop.body.enable = false;

    // Roll plant loot reward: 45% Leftover Pizza (+3 HP), 40% 401(k) Coin, 15% 2x 401(k) Coin + 1 Gem Jackpot!
    const roll = Math.random();
    let popupTxt = "🪙 +401(k)!";
    if (roll < 0.45) {
      window.pizzas.create(prop.x, prop.y, "pizza").setDepth(3);
      popupTxt = "🍕 PIZZA!";
    } else if (roll < 0.85) {
      coins.create(prop.x, prop.y, "coin401k").setDepth(3);
    } else {
      coins.create(prop.x - 8, prop.y, "coin401k").setDepth(3);
      coins.create(prop.x + 8, prop.y, "coin401k").setDepth(3);
      gems.create(prop.x, prop.y - 6, "gem").setDepth(3);
      popupTxt = "🪙 BONUS 401(k)!";
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
let playerSpeech = null;
function showPlayerSpeechBubble(scene, text, color = "#ffe042", holdMs = 2300) {
  if (playerSpeech && playerSpeech.active) playerSpeech.destroy();
  const pt = project3DToPhaserWorld(scene, player.x, (player.elev || 0) + 68, player.y);
  playerSpeech = scene.add.text(pt.x, pt.y - 34, `💬 "${text}"`, {
    fontFamily: "monospace",
    fontSize: "14px",
    fontStyle: "bold",
    color,
    backgroundColor: "#12152aee",
    padding: { x: 10, y: 6 },
    stroke: "#090b14",
    strokeThickness: 3
  }).setOrigin(0.5, 1).setDepth(22);
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
  const pool = (currentAge >= 80 && J.seniorLines) ? J.seniorLines.concat(J.lines) : J.lines;
  const line = Phaser.Utils.Array.GetRandom(pool);
  showPlayerSpeechBubble(scene, line, "#ffe042", 2300);
  if (typeof speakDadJoke === "function") speakDadJoke(line, currentAge >= 80 ? 0.84 : 0.94, 1.05);

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

// Create one enemy of the given kind at (x, y), scaling HP, speed, and Senior Life labels with your Age!
function createEnemy(scene, kind, x, y) {
  const E = ENEMIES[kind];
  const e = bills.create(x, y, E.tex || kind).setDepth(4);
  if (E.tint) e.setTint(E.tint);
  const yrs = Math.max(0, currentAge - 40);
  const hpScale = 1 + Math.floor(yrs / 4) * 0.85 + (currentAge >= 80 ? (currentAge - 80) * 0.3 : 0);
  e.kind = kind;
  e.hp = Math.max(1, Math.round(E.hp * hpScale));
  e.speed = Math.round(E.speed * (1 + Math.min(0.8, yrs * 0.012)));
  e.damage = E.damage + (currentAge >= 80 ? 2 : (currentAge >= 60 ? 1 : 0));
  e.bornAt = runElapsedMs;
  const lbl = (currentAge >= 80 && E.seniorLabel) ? E.seniorLabel : E.label;
  e.tag = scene.add.text(x, y - E.size / 2 - 6, lbl, {
    fontFamily: "monospace", fontSize: "10px", color: currentAge >= 80 ? "#f5c542" : "#e8e9f3"
  }).setOrigin(0.5).setDepth(5);
  return e;
}

// Put one enemy just outside the visible screen, on a random edge, based on the current Age wave.
function spawnBill(scene) {
  if (bills.countActive() >= SPAWNING.maxOnScreen) return;
  const view = scene.cameras.main.worldView; // the rectangle of the world you can currently see
  const m = SPAWNING.offscreenMargin;
  let x, y;
  switch (Phaser.Math.Between(0, 3)) {
    case 0: x = Phaser.Math.Between(view.left, view.right); y = view.top - m; break;    // above
    case 1: x = Phaser.Math.Between(view.left, view.right); y = view.bottom + m; break; // below
    case 2: x = view.left - m; y = Phaser.Math.Between(view.top, view.bottom); break;   // left
    default: x = view.right + m; y = Phaser.Math.Between(view.top, view.bottom);        // right
  }
  const wave = currentWave();
  const totalWeight = wave.mix.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * totalWeight, kind = wave.mix[0][0];
  for (const [k, w] of wave.mix) {
    if ((roll -= w) <= 0) { kind = k; break; }
  }
  createEnemy(scene, kind, x, y);
}

// Spawn a milestone Boss (Ages 45, 52, 60, 70, 80, 90, 100).
function spawnBoss(scene, bossKind) {
  bossesSpawned[bossKind] = true;
  sfx("bossSpawn");
  scene.cameras.main.shake(180, 0.01); // rumble the screen when a Decade Boss arrives!
  const P = ENEMIES[bossKind], view = scene.cameras.main.worldView;
  const x = view.right + SPAWNING.offscreenMargin, y = player.y;
  const boss = bills.create(x, y, P.tex || bossKind).setDepth(4);
  if (P.tint) boss.setTint(P.tint);
  boss.isBoss = true;
  boss.kind = bossKind;
  boss.hp = P.hp;
  boss.speed = P.speed;
  boss.damage = P.damage;
  boss.tag = scene.add.text(x, y - P.size / 2 - 8, `${P.label}:${P.hp}`, {
    fontFamily: "monospace", fontSize: "14px", color: "#f5c542", backgroundColor: "#12152acc", padding: { x: 4, y: 2 }
  }).setOrigin(0.5).setDepth(5);

  showBossToastUI(P.name);
}

// update() runs about 60 TIMES PER SECOND: this is the game loop.
function update(time, delta) {
  readPad(this);
  if (padJust("yBtn")) {
    cycleViewMode(this);
    sfx("pick");
    if (titleOpen) renderTitleModal(this);
    if (paused) renderPauseModal(this, 1);
  }

  // Universal Controller Navigation across ALL menus (Title, Level-Up, Pause/Options, Age 80, Game Over):
  const activeModal = window.menuNav && window.menuNav.getActiveModal();
  if (activeModal) {
    const stepDir = getPadMenuStep(performance.now());
    if (stepDir) window.menuNav.move(stepDir);
    if (padJust("a") || (!paused && padJust("start"))) {
      window.menuNav.activate();
    } else if (paused && (padJust("b") || padJust("start"))) {
      togglePause(this);
    }
  } else {
    // Active gameplay controller shortcuts: Start or B opens Pause & Options
    if (padJust("start") || padJust("b")) togglePause(this);
  }

  if (gameOver || levelUpOpen || paused || titleOpen || retire80Open) {
    renderThreeView(this);
    restore2DSprites();
    return; // freeze while dead, paused, on title, or choosing an upgrade
  }

  // Active-play Age clock: only advances during real gameplay (never while reading level-up cards or paused!).
  runElapsedMs += (delta || 16.6);
  currentAge = runStartAge + (runElapsedMs / 1000) / PLAYER.secondsPerYear;
  updateHUD();
  label.setText(`${PLAYER.name} (${Math.floor(currentAge)})`);

  // Auto-save active run + unlock Decade Checkpoints every 3 seconds of active play!
  if (runElapsedMs - lastAutoSave > 3000) {
    lastAutoSave = runElapsedMs;
    window.persistActiveRun();
  }

  // Milestone Age 80 Retirement Modal: claim Victory or enter the 20 Bonus Senior Rounds (80-100)!
  if (currentAge >= PLAYER.retirementAge && !retire80Prompted) {
    retire80Prompted = true;
    retire80Open = true;
    meta.coins += 15;
    runCoins += 15;
    window.persistActiveRun();
    this.physics.pause();
    this.time.paused = true;
    player.setVelocity(0, 0);
    sfx("levelUp");
    showRetire80Modal(this, () => {
      retire80Open = false;
      hp = stats.maxHp;
      updateHUD();
      touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
      this.physics.resume();
      this.time.paused = false;
    }, () => {
      retire80Open = false;
      showGameOver(this, "theReaper", true);
    });
    return;
  }

  ["performanceReview", "mortgageRefinance", "midlifeCrisis", "hoaPresident", "retirementBoss", "pickleballChamp", "theReaper"].forEach(bk => {
    if (!bossesSpawned[bk] && currentAge >= ENEMIES[bk].spawnAge) spawnBoss(this, bk);
  });

  // Wave schedule: as you pass milestone ages, speed up the spawn timer!
  const wIdx = SPAWNING.waves.reduce((acc, w, i) => currentAge >= w.minAge ? i : acc, 0);
  if (wIdx !== currentWaveIdx) {
    currentWaveIdx = wIdx;
    spawnTimer.reset({ delay: SPAWNING.waves[wIdx].everyMs, loop: true, callback: spawnTimer.callback });
  }
  let x = 0, y = 0;
  if (cursors.left.isDown || keys.A.isDown) x -= 1;
  if (cursors.right.isDown || keys.D.isDown) x += 1;
  if (cursors.up.isDown || keys.W.isDown) y -= 1;
  if (cursors.down.isDown || keys.S.isDown) y += 1;

  // Controller: the d-pad works like arrow keys, the left stick allows gentle movement.
  if (padNow.left) x -= 1;
  if (padNow.right) x += 1;
  if (padNow.up) y -= 1;
  if (padNow.down) y += 1;
  if (padNow.x || padNow.y) { x = padNow.x; y = padNow.y; }

  // Touch: only count a drag longer than 10px, so a tap doesn't move you.
  if (touch.active && Math.hypot(touch.dx, touch.dy) > 10) { x = touch.dx; y = touch.dy; }

  // Normalize so moving diagonally isn't faster than moving straight.
  const len = Math.hypot(x, y);
  if (len > 0) { x /= len; y /= len; }

  const moveSpd = runElapsedMs < slowUntil ? stats.speed * ENEMIES.snackAttack.slowFactor : stats.speed;
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
      playerSpeech.setPosition(sPt.x, sPt.y - 34).setVisible(sPt.visible);
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
  coins.getChildren().forEach(c => {
    if (Phaser.Math.Distance.Between(player.x, player.y, c.x, c.y) < stats.magnetRadius) {
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
      createEnemy(this, "lateFee", bx - 14, by - 10);
      createEnemy(this, "lateFee", bx + 14, by + 10);
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

    // Default behavior (Bills, Late Fees, Snacks, Twinge lunge, Elites, Bosses): steer directly toward you.
    this.physics.moveToObject(bill, player, bill.speed || ENEMIES.bill.speed);
    bill.setFlipX(player.x < bill.x);
    const sz = (ENEMIES[bill.kind] && ENEMIES[bill.kind].size) || 24;
    bill.tag.setPosition(bill.x, bill.y - sz / 2 - 6);
  });

  // Splashes that flew past their range evaporate (we delete them so they don't pile up).
  splashes.getChildren().slice().forEach(s => {
    if (Phaser.Math.Distance.Between(s.startX, s.startY, s.x, s.y) > stats.range) s.destroy();
  });

  // Render the active 3D / Diablo 3/4 view (or restore 2D sprites when in 2D 16-Bit mode)
  renderThreeView(this);
  restore2DSprites();
}

new Phaser.Game(config);
