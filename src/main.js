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

// ---- Game controller helpers ----
// Phaser tells us which buttons are held down RIGHT NOW. For menus we want "just pressed"
// (one tap = one action), so we remember last frame's buttons and compare.
let padPrev = {}, padNow = {};
function readPad(scene) {
  const pad = scene.input.gamepad && scene.input.gamepad.total ? scene.input.gamepad.getPad(0) : null;
  padPrev = padNow;
  if (!pad) { padNow = {}; return; }
  const sx = pad.leftStick.x, sy = pad.leftStick.y;
  padNow = {
    x: Math.abs(sx) > 0.2 ? sx : 0, y: Math.abs(sy) > 0.2 ? sy : 0, // ignore tiny stick drift
    left: pad.left, right: pad.right,
    up: pad.up || sy < -0.6, down: pad.down || sy > 0.6,
    a: pad.A, yBtn: pad.Y, start: pad.buttons[9] && pad.buttons[9].pressed
  };
  if (pad.A || pad.Y) unlockAudio();
}
const padJust = name => padNow[name] && !padPrev[name];

let player, label, keys, cursors, bills, splashes, floor, stageProps, gems, coins, chests, hudText, viewBtn;
let xp = 0, level = 1, xpNeeded = 0, xpBar, levelText, currentAge = 40, bossesSpawned = {}, slowUntil = 0;
let meta, runCoins = 0;
// "stats" is this run's copy of the numbers. Upgrades change the copy, never the data files,
// so every new run starts fresh.
let stats, spawnTimer, currentWaveIdx = 0, fireTimer, jokeTimer, noTimer, levelUpOpen = false, paused = false, pauseParts = [], pendingLevels = 0, levelMenu = null, restartGame = null;
let titleSeen = false, titleOpen = false, startFromTitle = null;
let hp, lastHurt = -Infinity, hpBar, gameOver = false, startTime = 0;
let touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };

// create() runs ONCE when the game starts: build the world.
function create() {
  // Fresh start (this also runs again when you press "Try again").
  gameOver = false; lastHurt = -Infinity; startTime = this.time.now;
  currentAge = PLAYER.startingAge; bossesSpawned = {}; slowUntil = 0; currentWaveIdx = 0;
  paused = false; pauseParts = [];
  touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
  levelUpOpen = false; pendingLevels = 0; levelMenu = null; restartGame = null;
  meta = loadMeta();
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
  };

  // 6. Controls: keyboard plus a "drag anywhere" joystick for phones.
  cursors = this.input.keyboard.createCursorKeys();
  keys = this.input.keyboard.addKeys("W,A,S,D");
  this.input.keyboard.on("keydown-M", () => {
    toggleMute();
    const mb = document.getElementById("hud-mute-btn");
    if (mb) mb.textContent = isMuted() ? "🔇 [M]" : "🔊 [M]";
  });
  this.input.keyboard.on("keydown-V", () => toggleView());
  this.input.keyboard.on("keydown-P", () => togglePause(this));
  this.input.keyboard.on("keydown-ESC", () => togglePause(this));
  this.input.on("pointerdown", p => { touch = { active: true, startX: p.x, startY: p.y, dx: 0, dy: 0 }; });
  this.input.on("pointermove", p => {
    if (!touch.active) return;
    touch.dx = p.x - touch.startX;
    touch.dy = p.y - touch.startY;
  });
  this.input.on("pointerup", () => { touch.active = false; touch.dx = touch.dy = 0; });

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

  // 12. Title screen on first load ("Clock In"), or start the music right away on "Try again".
  if (!titleSeen) {
    showTitleScreen(this);
  } else {
    setMusicPlaying(true);
  }
}

// Apply permanent 401(k) shop ranks and the chosen character's starting perks to `stats`.
function applyMetaAndChar() {
  stats.speed = PLAYER.speed; stats.maxHp = PLAYER.maxHp; stats.cooldownMult = 1;
  stats.fireEveryMs = WEAPONS.coffeeSplash.fireEveryMs; stats.damage = WEAPONS.coffeeSplash.damage;
  stats.range = WEAPONS.coffeeSplash.range; stats.magnetRadius = PICKUPS.wisdomGem.magnetRadius;
  stats.dadJoke = false; stats.jokeEveryMs = WEAPONS.dadJoke.fireEveryMs; stats.jokeRadius = WEAPONS.dadJoke.radius; stats.jokeDamage = WEAPONS.dadJoke.damage;
  stats.wordNo = false; stats.noEveryMs = WEAPONS.wordNo.fireEveryMs; stats.noRadius = WEAPONS.wordNo.radius; stats.noDamage = WEAPONS.wordNo.damage; stats.noPush = WEAPONS.wordNo.pushPx;

  const rMatch = meta.ranks.compoundInterest || 0;
  const rEsp   = meta.ranks.espressoMachine || 0;
  const rCpa   = meta.ranks.taxWriteOff || 0;
  stats.maxHp += rMatch * 2;
  stats.speed = Math.round(stats.speed * (1 + rEsp * 0.10));
  stats.cooldownMult *= Math.pow(0.92, rEsp);
  stats.magnetRadius = Math.round(stats.magnetRadius * (1 + rCpa * 0.25));

  const ch = CHARACTERS.find(c => c.id === meta.selectedChar) || CHARACTERS[0];
  ch.apply(stats);
  hp = stats.maxHp;
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

// The Title Screen: renders the HTML/CSS Executive Dossier, Character Select, and 401(k) Shop!
function showTitleScreen(scene) {
  titleOpen = true;
  setMusicPlaying(false);
  scene.physics.pause();
  scene.time.paused = true;

  renderTitleModal(scene);

  startFromTitle = () => {
    if (!titleOpen) return;
    unlockAudio();
    sfx("pick");
    titleOpen = false;
    titleSeen = true;
    startFromTitle = null;
    hideTitleModal();
    applyMetaAndChar();
    updateHUD();
    const cd = stats.cooldownMult;
    fireTimer.reset({ delay: Math.round(stats.fireEveryMs * cd), loop: true, callback: fireTimer.callback });
    jokeTimer.reset({ delay: Math.round(stats.jokeEveryMs * cd), loop: true, callback: jokeTimer.callback });
    noTimer.reset({   delay: Math.round(stats.noEveryMs   * cd), loop: true, callback: noTimer.callback });
    touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
    startTime = scene.time.now;
    scene.physics.resume();
    scene.time.paused = false;
    setMusicPlaying(true);
  };

  scene.input.keyboard.once("keydown-SPACE", () => startFromTitle && startFromTitle());
  scene.input.keyboard.once("keydown-ENTER", () => startFromTitle && startFromTitle());
}

// Toggle pause (P, Esc, or controller Start button).
function togglePause(scene) {
  if (gameOver || levelUpOpen || titleOpen) return;
  paused = !paused;
  setMusicPlaying(!paused);
  setPauseModalVisible(paused);
  if (paused) {
    scene.physics.pause();
    scene.time.paused = true;
    player.setVelocity(0, 0);
  } else {
    touch = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
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
    xpNeeded = Math.round(xpNeeded * LEVELING.growth);
    pendingLevels++;
    hp = Math.min(stats.maxHp, hp + 2); // leveling up restores +2 HP!
  }
  updateHUD();
  if (pendingLevels > 0 && !levelUpOpen) showLevelUp(p.scene);
}

// The level-up screen: pause the world and offer 3 vertical Perk Cards in the HTML/CSS overlay!
function showLevelUp(scene, customTitle, preferWeapons) {
  levelUpOpen = true;
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
    up.apply(stats);
    if (stats.heal) { hp = Math.min(stats.maxHp, hp + stats.heal); stats.heal = 0; }
    const cd = stats.cooldownMult;
    fireTimer.reset({ delay: Math.round(stats.fireEveryMs * cd), loop: true, callback: fireTimer.callback });
    jokeTimer.reset({ delay: Math.round(stats.jokeEveryMs * cd), loop: true, callback: jokeTimer.callback });
    noTimer.reset({   delay: Math.round(stats.noEveryMs   * cd), loop: true, callback: noTimer.callback });
    updateHUD();
    scene.input.keyboard.off("keydown", onKey);
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
  levelMenu.highlight(0);
  sfx("levelUp");

  const onKey = e => { const n = Number(e.key); if (n >= 1 && n <= choices.length) pick(choices[n - 1]); };
  scene.input.keyboard.on("keydown", onKey);
}

// An enemy (Bill, Snack, Twinge, Elite, or Boss) touched you.
function hurtPlayer(p, bill) {
  const scene = p.scene, now = scene.time.now;
  if (gameOver) return;
  if (bill.kind === "theReaper") { showGameOver(scene, "theReaper", true); return; } // Reaching Age 50 = YOU WIN!
  if (now - lastHurt < PLAYER.hurtCooldownMs) return; // still in the safe window
  lastHurt = now;
  hp -= (bill.damage || ENEMIES.bill.damage);
  if (bill.kind === "snackAttack") {
    slowUntil = now + ENEMIES.snackAttack.slowDurationMs;
    const msg = scene.add.text(p.x, p.y - 30, "SUGAR CRASH!", {
      fontFamily: "monospace", fontSize: "12px", color: "#f078b8"
    }).setOrigin(0.5);
    scene.tweens.add({ targets: msg, y: msg.y - 22, alpha: 0, duration: 700, onComplete: () => msg.destroy() });
  }
  sfx("hurt");
  scene.cameras.main.shake(120, 0.009); // screen shake when you take contact damage!
  drawHpBar();
  p.setTintFill(0xe0564f); // flash red
  scene.time.delayedCall(100, () => p.clearTint());
  if (hp <= 0) showGameOver(scene, bill.kind || "bill", currentAge >= 50);
}

// The Game Over / Victory screen: freeze the world and render the HTML/CSS Exit Interview or AARP Certificate!
function showGameOver(scene, killer, isWin) {
  gameOver = true;
  setMusicPlaying(false);
  restartGame = () => { hideAllModals(); scene.scene.restart(); };
  scene.physics.pause();
  const winLines = [
    "HAPPY 50th! You survived the entire decade, earned AARP eligibility, and unlocked the 4:30 PM Early Bird Special!",
    "YOU MADE IT TO 50! Your back hurts, your inbox has 14,000 unread emails, and you have never felt more at peace.",
    "THE BIG FIVE-OH! Father Time showed up, handed you a pair of New Balance sneakers, and let you take a nap."
  ];
  const cause = isWin
    ? Phaser.Utils.Array.GetRandom(winLines)
    : Phaser.Utils.Array.GetRandom(DEATHS[killer] || DEATHS.bill);

  renderGameOverModal(scene, cause, isWin);
  scene.input.keyboard.once("keydown-SPACE", () => { hideAllModals(); scene.scene.restart(); });
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

    // Roll plant loot reward: 38% Leftover Pizza (+3 HP), 40% 401(k) Coin + Gem, 22% Bonus Gem Jackpot!
    const roll = Math.random();
    let popupTxt = "🪙 +401(k)!";
    if (roll < 0.38) {
      window.pizzas.create(prop.x, prop.y, "pizza").setDepth(3);
      popupTxt = "🍕 PIZZA!";
    } else if (roll < 0.78) {
      coins.create(prop.x - 6, prop.y, "coin401k").setDepth(3);
      gems.create(prop.x + 6, prop.y, "gem").setDepth(3);
    } else {
      for (let i = -1; i <= 1; i++) gems.create(prop.x + i * 10, prop.y - 4, "gem").setDepth(3);
      coins.create(prop.x, prop.y + 8, "coin401k").setDepth(3);
      popupTxt = "💎 BONUS STASH!";
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

// Weapon 2: Dad Joke. A yellow ring ripples out and damages every Bill (and Potted Plant!) inside it.
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
  const line = Phaser.Utils.Array.GetRandom(J.lines);
  const pt = project3DToPhaserWorld(scene, player.x, 54, player.y);
  const quip = scene.add.text(pt.x, pt.y - 28, line, {
    fontFamily: "monospace", fontSize: "12px", color: "#e6c84f"
  }).setOrigin(0.5).setDepth(16);
  scene.tweens.add({ targets: quip, y: quip.y - 24, alpha: 0, duration: 750, onComplete: () => quip.destroy() });

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

// Create one enemy of the given kind at (x, y).
function createEnemy(scene, kind, x, y) {
  const E = ENEMIES[kind];
  const e = bills.create(x, y, kind).setDepth(4);
  e.kind = kind;
  e.hp = E.hp;
  e.speed = E.speed;
  e.damage = E.damage;
  e.bornAt = scene.time.now;
  e.tag = scene.add.text(x, y - E.size / 2 - 6, E.label, {
    fontFamily: "monospace", fontSize: "10px", color: "#e8e9f3"
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

// Spawn a milestone Boss ("performanceReview" at 42, "mortgageRefinance" at 45, "midlifeCrisis" at 48).
function spawnBoss(scene, bossKind) {
  bossesSpawned[bossKind] = true;
  sfx("bossSpawn");
  scene.cameras.main.shake(180, 0.01); // rumble the screen when a Decade Boss arrives!
  const P = ENEMIES[bossKind], view = scene.cameras.main.worldView;
  const x = view.right + SPAWNING.offscreenMargin, y = player.y;
  const boss = bills.create(x, y, bossKind).setDepth(4);
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
function update() {
  readPad(this);
  if (padJust("yBtn")) {
    cycleViewMode(this);
    sfx("pick");
    if (titleOpen) renderTitleModal(this);
  }

  // Controller in menus: up/down/left/right to choose a Perk Card, A to pick. A or Start to try again.
  if (levelMenu) {
    if (padJust("up") || padJust("down") || padJust("left") || padJust("right")) {
      const step = (padJust("up") || padJust("left")) ? -1 : 1;
      levelMenu.highlight((levelMenu.sel + step + levelMenu.count) % levelMenu.count);
      sfx("move");
    }
    if (padJust("a")) levelMenu.pickSelected();
  }
  if (titleOpen && startFromTitle && (padJust("a") || padJust("start"))) startFromTitle();
  if (gameOver && restartGame && (padJust("a") || padJust("start"))) restartGame();
  if (!gameOver && !levelUpOpen && !titleOpen && padJust("start")) togglePause(this);

  if (gameOver || levelUpOpen || paused || titleOpen) {
    renderThreeView(this);
    restore2DSprites();
    return; // freeze while dead, paused, on title, or choosing an upgrade
  }

  // Age clock: every PLAYER.secondsPerYear seconds adds 1 year to your age.
  const elapsedSec = (this.time.now - startTime) / 1000;
  currentAge = PLAYER.startingAge + elapsedSec / PLAYER.secondsPerYear;
  updateHUD();
  label.setText(`${PLAYER.name} (${Math.floor(currentAge)})`);
  ["performanceReview", "mortgageRefinance", "midlifeCrisis", "theReaper"].forEach(bk => {
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

  const moveSpd = this.time.now < slowUntil ? stats.speed * ENEMIES.snackAttack.slowFactor : stats.speed;
  player.setVelocity(x * moveSpd, y * moveSpd);
  if (x !== 0) player.setFlipX(x < 0); // face left or right
  player.setAngle((x !== 0 || y !== 0) ? Math.sin(this.time.now / 55) * 7 : 0); // jaunty walk wobble
  label.setPosition(player.x, player.y - PLAYER.size / 2 - 4);

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
  const now = this.time.now;
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
          bill.tag.setText(SC.label);
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
