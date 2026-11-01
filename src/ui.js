// "Chameleon + Corporate Satire" HTML/CSS UI & Universal Menu Navigation Manager (`src/ui.js`).
// Supports full Keyboard Arrow/WASD + Space/Enter navigation, Game Controller D-Pad/Stick navigation,
// and Mobile Touch Controls (Floating Action Dock + On-Screen Virtual Touch Joystick).

const UPGRADE_META = {
  "Unlock: The TV Remote":         { icon: "📺", tag: "NEW WEAPON",      rarity: "unlock" },
  "Universal Remote":              { icon: "🔁", tag: "CHANNEL SURF",    rarity: "common" },
  "Unlock: Spreadsheet":           { icon: "📊", tag: "NEW WEAPON",      rarity: "unlock" },
  "More Columns":                  { icon: "➕", tag: "CELL FORMAT",     rarity: "common" },
  "Unlock: Podcast at 2x":         { icon: "🎧", tag: "NEW WEAPON",      rarity: "unlock" },
  "Playback Speed":                { icon: "⏩", tag: "SPEED LISTEN",    rarity: "common" },
  "EVOLVE: Smart TV":              { icon: "📡", tag: "✨ EVOLUTION",   rarity: "evo" },
  "EVOLVE: Pivot Table":           { icon: "🧮", tag: "✨ EVOLUTION",   rarity: "evo" },
  "EVOLVE: Binge Mode":            { icon: "🍿", tag: "✨ EVOLUTION",   rarity: "evo" },
  "Extra Shot":                    { icon: "☕", tag: "CAFFEINE PERK",   rarity: "common" },
  "Dark Roast":                    { icon: "🫘", tag: "ESPRESSO GRADE",  rarity: "common" },
  "Long Pour":                     { icon: "🥤", tag: "RANGE MEMO",      rarity: "common" },
  "Unlock: Dad Joke":              { icon: "😂", tag: "NEW WEAPON",      rarity: "unlock" },
  "Louder Groan":                  { icon: "📢", tag: "CRINGE AMP",      rarity: "common" },
  'Unlock: "No."':                 { icon: "🛑", tag: "NEW WEAPON",      rarity: "unlock" },
  "Firm Boundaries":               { icon: "🚧", tag: "HR POLICY",       rarity: "common" },
  "Comfortable Shoes":             { icon: "👟", tag: "ORTHOTIC PERK",   rarity: "passive" },
  "Good Night's Sleep":            { icon: "😴", tag: "RARE MIRACLE",    rarity: "passive" },
  "Annual Checkup":                { icon: "🩺", tag: "COPAY HEAL",      rarity: "passive" },
  "Reading Glasses":               { icon: "👓", tag: "2.0x MAGNIFIER",  rarity: "passive" },
  "Executive Delegation":          { icon: "📊", tag: "SENIOR TIER",     rarity: "unlock" },
  "Titanium Knees":                { icon: "🦿", tag: "BIONIC PERK",     rarity: "passive" },
  "EVOLVE: Cold Brew Concentrate": { icon: "⚡☕", tag: "✨ EVOLUTION",   rarity: "evo" },
  "EVOLVE: Unhinged Pun Storm":    { icon: "🌩️😂", tag: "✨ EVOLUTION",   rarity: "evo" },
  "EVOLVE: Healthy Boundaries":    { icon: "🛡️🛑", tag: "✨ EVOLUTION",   rarity: "evo" }
};

const CHAR_ICONS = {
  officeWorker: "☕",
  photographer: "⚽", // The Soccer Dad
  gradStudent: "🎓"
};

const THEME_LABELS = [
  "CORP-OS v1.98 // 16-BIT PIXEL",
  "SANCTUARY HR // DIABLO 3/4",
  "MIDLIFE ROYALE // AAA 3D"
];

const VIEW_SHORT_NAMES = [
  "👾 16-Bit Retro",
  "🕯️ Diablo 3/4 Indie",
  "🚀 Fortnite AAA 3D"
];

let uiScene = null;

window.rebindState = null;
window.controlsModalOpen = false;
window.changelogModalOpen = false;
window.loreModalOpen = false;
let currentLoreTab = "mythos";
let gamepadConnectedFlag = false;

function getVersionInfo() {
  return window.GAME_VERSION || {
    version: "1.8.20",
    displayVersion: "V. 1.8.20",
    lastUpdated: "Oct 30, 2026",
    codename: "Mythos & Lore Edition",
    build: 20,
    changelog: []
  };
}

// ============================================================================
// UNIVERSAL MENU FOCUS & NAVIGATION MANAGER (`window.menuNav`)
// Lets players arrow through EVERY modal with Arrow Keys, WASD, Mouse, Touch, or Controller!
// ============================================================================
window.menuNav = {
  focusedEl: null,

  getActiveModal() {
    const order = ["lore-modal", "changelog-modal", "controls-modal", "levelup-modal", "pause-modal", "retire80-modal", "gameover-modal", "title-modal"];
    for (const id of order) {
      const el = document.getElementById(id);
      if (el && !el.classList.contains("hidden")) return el;
    }
    return null;
  },

  getRows(modal) {
    if (!modal) return [];
    const items = Array.from(modal.querySelectorAll(".nav-item:not([disabled])"));
    const rowMap = new Map();
    items.forEach(el => {
      const r = Number(el.dataset.navRow || 0);
      if (!rowMap.has(r)) rowMap.set(r, []);
      rowMap.get(r).push(el);
    });
    return Array.from(rowMap.keys()).sort((a, b) => a - b).map(k => rowMap.get(k));
  },

  focus(el, playSound = false) {
    const modal = this.getActiveModal();
    if (!modal || !el) return;
    document.querySelectorAll(".nav-focused").forEach(n => n.classList.remove("nav-focused")); // clear stale highlights in closed menus too
    this.focusedEl = el;
    el.classList.add("nav-focused");
    if (el.classList.contains("perk-card")) {
      modal.querySelectorAll(".perk-card").forEach((c, idx) => {
        const isMatch = c === el;
        c.classList.toggle("selected", isMatch);
        if (isMatch && window.levelMenu) window.levelMenu.sel = idx;
      });
    }
    try { el.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (e) {}
    if (playSound) sfx("move");
  },

  refresh(defaultSelector) {
    const modal = this.getActiveModal();
    if (!modal) { this.focusedEl = null; return; }
    const all = Array.from(modal.querySelectorAll(".nav-item:not([disabled])"));
    if (!all.length) { this.focusedEl = null; return; }
    let target = null;
    if (defaultSelector) target = modal.querySelector(defaultSelector);
    if (!target || target.disabled) {
      target = modal.querySelector(".nav-default:not([disabled])") || all[0];
    }
    this.focus(target, false);
  },

  move(dir) {
    const modal = this.getActiveModal();
    if (!modal) return false;
    const rows = this.getRows(modal);
    if (!rows.length) return false;

    let rIdx = 0, cIdx = 0, found = false;
    for (let r = 0; r < rows.length; r++) {
      const c = rows[r].indexOf(this.focusedEl);
      if (c !== -1) { rIdx = r; cIdx = c; found = true; break; }
    }
    if (!found) {
      this.focus(rows[0][0], true);
      return true;
    }

    // Special horizontal adjustment when on Pause/Options cycler rows (Camera Style / Audio)
    if ((dir === "left" || dir === "right") && this.focusedEl && this.focusedEl.dataset.optCycle) {
      this.activate(dir);
      return true;
    }

    if (dir === "left" || dir === "right") {
      const row = rows[rIdx];
      if (row.length > 1) {
        const step = dir === "left" ? -1 : 1;
        const nextC = (cIdx + step + row.length) % row.length;
        this.focus(row[nextC], true);
      } else if (rows.length > 1) {
        // Single-item row: Left/Right steps to previous/next row for effortless 1D arrowing
        const step = dir === "left" ? -1 : 1;
        const nextR = (rIdx + step + rows.length) % rows.length;
        this.focus(rows[nextR][0], true);
      }
      return true;
    }

    if (dir === "up" || dir === "down") {
      if (rows.length > 1) {
        const step = dir === "up" ? -1 : 1;
        const nextR = (rIdx + step + rows.length) % rows.length;
        const targetRow = rows[nextR];
        const nextC = Math.min(cIdx, targetRow.length - 1);
        this.focus(targetRow[nextC], true);
      } else {
        // Only 1 row (e.g., 3 horizontal Perk Cards or 2 Game Over buttons): Up/Down also steps through items!
        const row = rows[0];
        const step = dir === "up" ? -1 : 1;
        const nextC = (cIdx + step + row.length) % row.length;
        this.focus(row[nextC], true);
      }
      return true;
    }
    return false;
  },

  activate(dirHint) {
    const modal = this.getActiveModal();
    if (!modal) return false;
    if (!this.focusedEl || !modal.contains(this.focusedEl)) {
      this.refresh();
    }
    if (!this.focusedEl) return false;
    this.focusedEl.dataset.dirHint = dirHint || "";
    this.focusedEl.dispatchEvent(new Event("nav-activate", { bubbles: true }));
    return true;
  }
};

function bindNavItem(el, row, onActivate, isDefault = false) {
  if (!el) return;
  el.classList.add("nav-item");
  el.dataset.navRow = String(row);
  if (isDefault) el.classList.add("nav-default");
  el.addEventListener("pointermove", e => {
    if (e.pointerType === "mouse" && window.menuNav.focusedEl !== el) window.menuNav.focus(el, false);
  });
  el.addEventListener("pointerdown", e => {
    e.stopPropagation();
    unlockAudio();
    window.menuNav.focus(el, false);
    onActivate(e);
  });
  el.addEventListener("nav-activate", e => {
    unlockAudio();
    onActivate(e);
  });
}

function initGameUI(scene) {
  uiScene = scene;
  const root = document.getElementById("ui-layer");
  if (!root) return;

  root.innerHTML = `
    <!-- TOP-CENTER OUTLOOK BOSS / CHAPTER CALENDAR ALERT TOAST (Only visible briefly on alerts) -->
    <div class="boss-toast hidden" id="boss-toast">
      <div class="toast-icon">📅</div>
      <div class="toast-body">
        <div class="toast-sub" id="boss-toast-sub">URGENT CALENDAR REMINDER // MANDATORY ATTENDANCE</div>
        <div class="toast-title" id="boss-toast-title">BOSS APPROACHING!</div>
      </div>
    </div>

    <!-- ON-SCREEN VIRTUAL TOUCH JOYSTICK (Floating or Fixed Above Lower-Third) -->
    <div class="touch-joystick hidden" id="touch-joystick">
      <div class="touch-knob" id="touch-knob"></div>
    </div>

    <!-- MOUSE / DIRECT-TOUCH STEERING TARGET RETICLE -->
    <div class="pointer-target hidden" id="pointer-target"></div>

    <!-- FLOATING MOBILE QUICK-ACTION DOCK (Top corner on mobile screens) -->
    <div class="mobile-dock" id="mobile-dock">
      <button class="mob-fab" id="mob-pause-btn" title="Pause & Options">⏸ PAUSE</button>
      <button class="mob-fab" id="mob-controls-btn" title="Input & Controls">🎮 INPUT</button>
      <button class="mob-fab" id="mob-view-btn" title="Switch 2D / Diablo / 3D">🎥 VIEW</button>
      <button class="mob-fab" id="mob-mute-btn" title="Toggle Sound">🔊</button>
    </div>

    <!-- LOWER THIRD: on-demand message strip (alerts, tips, chapter cards, rewards) -->
    <div class="lt-strip" id="lt-strip" role="status" aria-live="polite">
      <div class="lt-badge" id="lt-badge">TIP</div>
      <div class="lt-body"><div class="lt-text" id="lt-text"></div></div>
    </div>

    <!-- CLEAN SCREEN HUD (Objective 1): XP bar, age, coins, loadout, pause/mute -->
    <div class="vs-hud hidden" id="vs-hud">
      <div class="vs-xp"><div class="vs-xp-fill" id="vs-xp-fill"></div><span class="vs-lv" id="vs-lv">LV 1</span></div>
      <div class="vs-row">
        <div class="vs-left">
          <div class="vs-coins" id="vs-coins">🪙 0k</div>
          <div class="vs-loadout" id="vs-loadout"></div>
        </div>
        <div class="vs-center">
          <div class="vs-age" id="vs-age">AGE 40</div>
          <div class="vs-year" title="Progress through this year"><div class="vs-year-fill" id="vs-year-fill"></div></div>
        </div>
        <div class="vs-right">
          <button class="vs-btn" id="vs-pause-btn" aria-label="Pause">⏸</button>
          <button class="vs-btn" id="vs-mute-btn" aria-label="Mute">🔊</button>
        </div>
      </div>
    </div>

    <!-- =======================================================================
         BROADCAST LOWER-THIRD HUD CONSOLE (Anchored at Bottom of Screen)
         1. Upper Lip: Live Contextual Story & In-Game Help Ticker
         2. Main Deck: Employee Vitals | Life Chapter & On-Screen Radar | 401(k) & Controls
         ======================================================================= -->
    <div class="hud-lower-third" id="hud-lower-third">
      <!-- Upper Lip: Contextual Story & In-Game Help Ticker -->
      <div class="context-ticker" id="hud-context-bar">
        <div class="ctx-left">
          <span class="ctx-badge" id="ctx-badge">📖 CHAPTER 1 // OFFICE</span>
          <span class="ctx-story" id="ctx-story">"40.0 and caffeinated: the fluorescent lights hum as the Q1 bills start drifting toward your desk."</span>
        </div>
        <div class="ctx-help" id="ctx-help">💡 TIP: Weapons fire automatically! Steer around furniture and crack open green Potted Plants for Pizza (+3 HP) & 401(k) Coins.</div>
      </div>

      <!-- Main Lower-Third 3-Module Console -->
      <div class="lower-third-deck">
        <!-- Module 1: Bottom-Left Employee ID, Vitals & Loadout -->
        <div class="hud-pod hud-left">
          <div class="id-header">
            <div class="id-avatar" id="hud-avatar">☕</div>
            <div class="id-titles">
              <div class="id-dept" id="hud-dept">CORP-OS v1.98</div>
              <div class="id-name" id="hud-charname">The 9-to-5er</div>
            </div>
            <div class="id-lv" id="hud-lv">LV 1</div>
          </div>
          <div class="bars-compact-grid">
            <div class="bar-row">
              <span class="bar-label">HP</span>
              <div class="bar-track hp-track">
                <div class="bar-fill hp-fill" id="hud-hp-fill" style="width:100%"></div>
                <span class="bar-text" id="hud-hp-text">12 / 12</span>
              </div>
            </div>
            <div class="bar-row">
              <span class="bar-label">XP</span>
              <div class="bar-track xp-track">
                <div class="bar-fill xp-fill" id="hud-xp-fill" style="width:0%"></div>
                <span class="bar-text" id="hud-xp-text">0 / 8</span>
              </div>
            </div>
          </div>
          <div class="loadout-row" id="hud-loadout"></div>
        </div>

        <!-- Module 2: Bottom-Center Life Chapter Timeline & On-Screen Situational Radar -->
        <div class="hud-pod hud-center">
          <div class="timeline-header">
            <span class="timeline-title" id="hud-timeline-title">CAREER TIMELINE (GOAL: AGE 80)</span>
            <span class="timeline-age" id="hud-age">AGE 40.0</span>
          </div>
          <div class="timeline-track" id="hud-timeline-track">
            <div class="timeline-fill" id="hud-age-fill" style="width:0%"></div>
            <div class="milestone" style="left:0%"><span>40</span></div>
            <div class="milestone boss-pip" style="left:25%" title="Age 50: Silver Fox Era"><span>50 🦊</span></div>
            <div class="milestone boss-pip" style="left:50%" title="Age 60: Midlife Crisis V8"><span>60 🏎️</span></div>
            <div class="milestone boss-pip" style="left:75%" title="Age 70: HOA President"><span>70 🏡</span></div>
            <div class="milestone win-pip" style="left:100%" title="Age 80: Retirement Goal (+Bonus 80-100!)"><span>80 🏆</span></div>
          </div>
          <div class="radar-row" id="hud-radar-row">
            <span id="hud-radar-threats">👀 ON SCREEN: 0 Threats</span>
            <span id="hud-radar-next">🎯 NEXT MILESTONE: Age 45.0 (Performance Review)</span>
          </div>
        </div>

        <!-- Module 3: Bottom-Right 401(k) Ticker, Visual Engine Switcher & Utility Controls -->
        <div class="hud-pod hud-right">
          <div class="coin-pill">
            <span class="save-dot" id="hud-pad-dot" style="display:none;color:#6fbf73;margin-right:4px;">🎮 PAD</span>
            <span class="save-dot" id="hud-save-dot" title="Progress Auto-Saved to Browser!">💾 SAVED</span>
            <span class="coin-icon">🪙</span>
            <span class="coin-label">401(k):</span>
            <span class="coin-val" id="hud-coins">0k</span>
            <span class="perk-badge" id="hud-yield-pill" title="Compound Interest Tier: the longer you survive, the more each 401(k) Coin is worth!" style="margin-left:3px;color:#8ff094;border-color:rgba(111,191,115,0.5);">📈 1x MATCH</span>
          </div>
          <div class="style-pill" id="hud-style-pill" title="Press V or tap to switch visual engine!">
            <span class="style-key" id="hud-view-key">[V]</span>
            <button class="style-opt" data-idx="0">16-BIT</button>
            <button class="style-opt" data-idx="1">DIABLO 3/4</button>
            <button class="style-opt" data-idx="2">AAA 3D</button>
          </div>
          <div class="util-btns">
            <button class="util-btn" id="hud-pause-btn" title="Pause / Options">⏸ PAUSE [Space]</button>
            <button class="util-btn" id="hud-controls-btn" title="Configure Keyboard, Mouse, Touch & Controller">🎮 INPUT</button>
            <button class="util-btn" id="hud-mute-btn" title="Mute Audio">🔊 [M]</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL 1: LEVEL-UP / HR PERK VOUCHER (3 Collectible Cards) -->
    <div class="ui-modal hidden" id="levelup-modal">
      <div class="modal-card levelup-box">
        <div class="modal-kicker" id="lv-kicker">HR BENEFITS DEPARTMENT // FORM W-40</div>
        <h2 class="modal-title" id="lv-title">LEVEL UP! SELECT ONE PERK VOUCHER</h2>
        <div class="modal-sub">Use <b>Arrow Keys / WASD</b> + <b>Space/Enter</b>, <b>Mouse Click</b>, <b>Controller D-Pad + A</b>, or <b>Tap</b>!</div>
        <div class="perk-cards-grid" id="lv-cards"></div>
      </div>
    </div>

    <!-- MODAL 2: PAUSE & OPTIONS OVERLAY (Spacebar / P / Esc / Start / Tap Pause) -->
    <div class="ui-modal hidden" id="pause-modal"></div>

    <!-- MODAL 2B: INPUT & CONTROLS CONFIGURATION OVERLAY (Keyboard, Mouse, Touch, Controller) -->
    <div class="ui-modal hidden" id="controls-modal"></div>

    <!-- MODAL 2C: VERSION HISTORY & RELEASE NOTES OVERLAY -->
    <div class="ui-modal hidden" id="changelog-modal"></div>

    <!-- MODAL 2D: MYTHOS, SUBJECTS & SCENARIOS LORE ARCHIVE OVERLAY -->
    <div class="ui-modal hidden" id="lore-modal"></div>

    <!-- MODAL 3: AGE 80 RETIREMENT MILESTONE (Retire or Enter 80-100 Senior Bonus Rounds!) -->
    <div class="ui-modal hidden" id="retire80-modal">
      <div class="modal-card win-box">
        <div class="modal-kicker">🎉 MILESTONE UNLOCKED // +15k 401(k) BONUS AWARDED!</div>
        <h2 class="modal-title">HAPPY 80th! YOU REACHED FULL RETIREMENT!</h2>
        <p class="gameover-cause">You survived 40 years of Bills, HR Reviews, Mortgages, and the HOA! Do you want to retire in peace, or push into the <b>20 Bonus Senior Life Rounds (Age 80 to 100)</b> against Early-Bird Buffets, Sciatica, and 6AM Pickleball Champions?</p>
        <div class="gameover-actions">
          <button class="cta-btn" id="retire80-senior-btn">🔥 ENTER BONUS SENIOR ROUNDS (AGE 80 -> 100!)</button>
          <button class="cta-btn secondary-btn" id="retire80-claim-btn">🏖️ RETIRE AT 80 & CLAIM VICTORY</button>
        </div>
        <div class="nav-hint-bar">
          <span><b>▲▼◀▶</b> Arrow / D-Pad / Mouse: Select</span>
          <span><b>Space / Enter / Click / A</b>: Confirm</span>
        </div>
      </div>
    </div>

    <!-- MODAL 4: TITLE SCREEN (Executive Dossier, Save/Resume & 401(k) Shop) -->
    <div class="ui-modal hidden" id="title-modal"></div>

    <!-- MODAL 5: GAME OVER / RETIREMENT VICTORY CERTIFICATE -->
    <div class="ui-modal hidden" id="gameover-modal"></div>
  `;

  root.querySelectorAll(".style-opt").forEach(btn => {
    btn.addEventListener("pointerdown", e => {
      e.stopPropagation();
      unlockAudio();
      window.viewModeIdx = Number(btn.dataset.idx);
      applyViewMode(uiScene);
      sfx("pick");
      if (titleOpen) renderTitleModal(uiScene);
      if (paused) renderPauseModal(uiScene);
    });
  });

  const doPauseToggle = e => {
    e.stopPropagation();
    unlockAudio();
    togglePause(uiScene);
  };
  const doControlsOpen = e => {
    e.stopPropagation();
    unlockAudio();
    sfx("pick");
    if (!paused && !titleOpen && !gameOver && !levelUpOpen && !retire80Open) {
      togglePause(uiScene);
    }
    openControlsModal(uiScene);
  };
  const doMuteToggle = e => {
    e.stopPropagation();
    unlockAudio();
    toggleMute();
    syncMuteButtons();
    if (paused) renderPauseModal(uiScene);
  };
  const doViewCycle = e => {
    e.stopPropagation();
    unlockAudio();
    cycleViewMode(uiScene);
    sfx("pick");
    if (titleOpen) renderTitleModal(uiScene);
    if (paused) renderPauseModal(uiScene);
  };

  document.getElementById("hud-pause-btn").addEventListener("pointerdown", doPauseToggle);
  document.getElementById("mob-pause-btn").addEventListener("pointerdown", doPauseToggle);
  document.getElementById("hud-controls-btn").addEventListener("pointerdown", doControlsOpen);
  document.getElementById("mob-controls-btn").addEventListener("pointerdown", doControlsOpen);
  document.getElementById("hud-mute-btn").addEventListener("pointerdown", doMuteToggle);
  document.getElementById("mob-mute-btn").addEventListener("pointerdown", doMuteToggle);
  document.getElementById("mob-view-btn").addEventListener("pointerdown", doViewCycle);
  document.getElementById("vs-pause-btn").addEventListener("pointerdown", doPauseToggle);
  document.getElementById("vs-mute-btn").addEventListener("pointerdown", doMuteToggle);

  window.syncUITheme();
  syncControlHUDHints();
}

function getControlsConfig() {
  if (typeof meta !== "undefined" && meta && meta.controls) {
    return meta.controls;
  }
  return Object.assign({}, window.DEFAULT_CONTROLS || {});
}

function syncControlHUDHints() {
  const c = getControlsConfig();
  const fmt = window.formatKeyCode || (k => k);
  const pauseBtn = document.getElementById("hud-pause-btn");
  const viewKey = document.getElementById("hud-view-key");
  if (pauseBtn) pauseBtn.textContent = `⏸ PAUSE [${fmt(c.keyPause || "Space")}]`;
  if (viewKey) viewKey.textContent = `[${fmt(c.keyView || "KeyV")}]`;
  syncMuteButtons();
  const dock = document.getElementById("mobile-dock");
  if (dock) dock.classList.toggle("dock-left", c.touchMode === "fixedRight");
  if (window.updateTouchJoystickUI) window.updateTouchJoystickUI(typeof touch !== "undefined" ? touch : null);
}

function syncMuteButtons() {
  const muted = isMuted();
  const c = getControlsConfig();
  const fmt = window.formatKeyCode || (k => k);
  const mKey = fmt(c.keyMute || "KeyM");
  const hb = document.getElementById("hud-mute-btn");
  const mb = document.getElementById("mob-mute-btn");
  if (hb) hb.textContent = muted ? `🔇 [${mKey}]` : `🔊 [${mKey}]`;
  if (mb) mb.textContent = muted ? "🔇" : "🔊";
  const vb = document.getElementById("vs-mute-btn");
  if (vb) vb.textContent = muted ? "🔇" : "🔊";
}

window.setGamepadConnectedUI = function(connected) {
  const changed = gamepadConnectedFlag !== !!connected;
  gamepadConnectedFlag = !!connected;
  const dot = document.getElementById("hud-pad-dot");
  if (dot) dot.style.display = connected ? "inline" : "none";
  if (changed && window.controlsModalOpen && uiScene) {
    renderControlsModal(uiScene);
  }
};

window.updatePointerTargetUI = function(pt) {
  const el = document.getElementById("pointer-target");
  if (!el) return;
  if (!pt || !pt.active) {
    el.classList.add("hidden");
    return;
  }
  el.classList.remove("hidden");
  el.style.left = `${pt.x}px`;
  el.style.top = `${pt.y}px`;
};

window.updateTouchJoystickUI = function(touch) {
  const joy = document.getElementById("touch-joystick");
  const knob = document.getElementById("touch-knob");
  if (!joy || !knob) return;
  const c = getControlsConfig();
  const isFixed = c.touchMode === "fixedLeft" || c.touchMode === "fixedRight";
  const inActivePlay = !(typeof gameOver !== "undefined" && (gameOver || levelUpOpen || paused || titleOpen || retire80Open || window.controlsModalOpen || window.changelogModalOpen || window.loreModalOpen));

  if (c.touchMode === "directTouch") {
    joy.classList.add("hidden");
    return;
  }

  if (isFixed && inActivePlay) {
    joy.classList.remove("hidden");
    joy.classList.add("fixed-pad");
    joy.style.top = "auto";
    const ltEl = document.getElementById("hud-lower-third");
    const ltH = (ltEl && ltEl.offsetHeight) ? ltEl.offsetHeight : 0;
    joy.style.bottom = `calc(${ltH + 28}px + env(safe-area-inset-bottom, 0px))`;
    if (c.touchMode === "fixedLeft") {
      joy.style.left = "16px";
      joy.style.right = "auto";
    } else {
      joy.style.right = "16px";
      joy.style.left = "auto";
    }
    const maxR = 32;
    const dx = (touch && touch.active) ? touch.dx : 0;
    const dy = (touch && touch.active) ? touch.dy : 0;
    const dist = Math.hypot(dx, dy);
    const clamp = dist > maxR ? maxR / dist : 1;
    knob.style.transform = `translate(${dx * clamp}px, ${dy * clamp}px)`;
    return;
  }

  joy.classList.remove("fixed-pad");
  joy.style.bottom = "auto";
  joy.style.right = "auto";
  if (!touch || !touch.active) {
    joy.classList.add("hidden");
    return;
  }
  joy.classList.remove("hidden");
  joy.style.left = `${touch.startX}px`;
  joy.style.top = `${touch.startY}px`;
  const maxR = 32;
  const dist = Math.hypot(touch.dx, touch.dy);
  const clamp = dist > maxR ? maxR / dist : 1;
  knob.style.transform = `translate(${touch.dx * clamp}px, ${touch.dy * clamp}px)`;
};

// ============================================================================
// CONTEXTUAL STORYTELLING & IN-GAME HELP ENGINE (Broadcast Lower-Third)
// Reacts live to on-screen threats, loot, bosses, health, and life chapters!
// ============================================================================
let activeContextOverride = null; // { badge, story, help, mood, untilMs }

// ============================================================================
// LOWER THIRD (Oct 30): one message at a time, slides in, holds, slides out.
// Higher priority interrupts lower. Low-priority messages are dropped if busy.
// ============================================================================
const LT_PRIORITY = { alert: 5, win: 4, errand: 4, tip: 3, chapter: 2, reward: 1, lore: 1, joke: 0 };
const ltState = { current: null, queue: [], remaining: 0, gap: 0 };

function ltMenuOpen() {
  return (typeof titleOpen !== "undefined" && titleOpen) || (typeof paused !== "undefined" && paused) ||
    (typeof levelUpOpen !== "undefined" && levelUpOpen) || (typeof gameOver !== "undefined" && gameOver) ||
    (typeof retire80Open !== "undefined" && retire80Open) || window.controlsModalOpen || window.loreModalOpen || window.changelogModalOpen;
}

function ltShowNow(msg) {
  const el = document.getElementById("lt-strip");
  if (!el) return;
  ltState.current = msg;
  ltState.remaining = msg.ms;
  el.dataset.kind = msg.kind;
  document.getElementById("lt-badge").textContent = msg.badge;
  document.getElementById("lt-text").textContent = msg.text;
  if (!ltMenuOpen()) el.classList.add("show");
}

function ltHide() {
  const el = document.getElementById("lt-strip");
  if (el) el.classList.remove("show");
  ltState.current = null;
  if (ltState.queue.length) ltState.gap = 450; // short gap so messages don't blur together
}

// One clock for the strip: counts down only while you're actually playing.
setInterval(() => {
  const el = document.getElementById("lt-strip");
  if (!el) return;
  if (ltMenuOpen()) { el.classList.remove("show"); return; }   // hold the message while a menu is up
  if (ltState.current) {
    el.classList.add("show");
    ltState.remaining -= 100;
    if (ltState.remaining <= 0) ltHide();
  } else if (ltState.queue.length) {
    ltState.gap -= 100;
    if (ltState.gap <= 0) ltShowNow(ltState.queue.shift());
  }
}, 100);

window.showLowerThird = function(kind, badge, text, ms = 4500) {
  const msg = { kind, badge, text, ms, p: LT_PRIORITY[kind] ?? 1 };
  const cur = ltState.current;
  if (!cur) return ltShowNow(msg);
  if (msg.p > cur.p) return ltShowNow(msg);          // more urgent: take over
  if (msg.p <= 1) return;                              // rewards and lore: skip if busy
  ltState.queue.push(msg);
  ltState.queue.sort((a, b) => b.p - a.p);
  if (ltState.queue.length > 3) ltState.queue.length = 3;
};

// First-time tips: shown once ever, remembered in this browser.
let tipsSeen = {};
try { tipsSeen = JSON.parse(localStorage.getItem("ms-tips-seen-v1") || "{}"); } catch (e) {}
// Game Tips switch (Pause menu): experienced players can turn first-time tips off.
// Alerts, chapter cards and rewards still show; only the TIP messages are affected.
window.tipsEnabled = function() {
  return !(typeof meta !== "undefined" && meta && meta.tipsOff);
};
window.setTipsEnabled = function(on) {
  if (typeof meta === "undefined" || !meta) return;
  meta.tipsOff = !on;
  if (typeof saveMeta === "function") saveMeta(meta);
};

window.firstTimeTip = function(key) {
  const t = window.TIPS && window.TIPS[key];
  if (!t || tipsSeen[key] || !window.tipsEnabled()) return;
  tipsSeen[key] = true;
  try { localStorage.setItem("ms-tips-seen-v1", JSON.stringify(tipsSeen)); } catch (e) {}
  window.showLowerThird("tip", t.badge || "TIP", t.text, 5000);
};
window.resetTips = function() {
  tipsSeen = {};
  try { localStorage.removeItem("ms-tips-seen-v1"); } catch (e) {}
};

// Older code still calls pushContextEvent(badge, text, help, mood, ms). Route it into the lower third.
window.pushContextEvent = function(badge, story, help, mood = "normal", durationMs = 4200) {
  const kind = mood === "urgent" ? "alert" : mood === "win" ? "win" : mood === "chapter" ? "chapter" : "reward";
  window.showLowerThird(kind, badge, String(story).replace(/^"|"$/g, ""), durationMs);
};

const STAGE_NARRATIVES = {
  office: [
    {
      badge: "📖 CHAPTER 1 // OFFICE",
      story: '"40 and caffeinated: the fluorescent lights hum as the Q1 utility bills drift toward your cubicle."',
      help: "💡 TIP: You attack automatically! Just steer around desks and collect blue Wisdom Gems to level up."
    },
    {
      badge: "📖 CORPORATE SURVIVAL",
      story: '"Someone left half a box of breakroom donuts by the printer, and your inbox just hit 412 unread."',
      help: "💡 TIP: Shoot green Potted Plants to crack them open for Leftover Pizza (+3 HP) and 401(k) Gold Coins!"
    },
    {
      badge: "📖 SYNERGY & EVOLUTIONS",
      story: '"Your coffee mug is practically welded to your hand as the afternoon meetings close in."',
      help: "💡 TIP: Upgrade any Weapon to Rank 2+ and pair it with its matching Passive perk to unlock a Gold Evolution!"
    }
  ],
  hospital: [
    {
      badge: "📖 CHAPTER 2 // HOSPITAL",
      story: '"3:14 AM in the maternity wing: the heart monitor beeps while itemized co-pays roll down the hallway."',
      help: "💡 TIP: Purple Pager/Spam alerts pause and vibrate before rocketing in a straight line. Sidestep when they ring!"
    },
    {
      badge: "📖 SLEEPLESS NIGHTS",
      story: '"You have not slept four consecutive hours since Tuesday, and hospital Jell-O is everywhere."',
      help: "💡 TIP: Pink Jell-O / Donut enemies briefly slow your feet on contact. Unlock Dad Joke or 'No.' to push swarms back!"
    }
  ],
  home: [
    {
      badge: "📖 CHAPTER 3 // SUBURBIA",
      story: '"Saturday morning in the living room: barefoot LEGO bricks on the rug and a minivan carpool waiting outside."',
      help: "💡 TIP: Climb the 6-step Mezzanine stairs in Diablo or 3D mode to funnel chasing swarms into narrow choke points!"
    },
    {
      badge: "📖 HOMEOWNERSHIP",
      story: '"The water heater is making a brand-new knocking sound right as Common Core math homework begins."',
      help: "💡 TIP: Every 401(k) Coin you pick up is permanently banked in your browser save for the 401(k) Retirement Shop!"
    }
  ],
  social: [
    {
      badge: "📖 CHAPTER 4 // FRIENDSHIPS",
      story: '"47 unread messages in the group chat trying to pick a restaurant before everyone gets sleepy at 9:00 PM."',
      help: "💡 TIP: Large Reply-All / Drama Elites drop 3 Gems + 2 Coins when defeated, but split into 2 fast Late Fees!"
    },
    {
      badge: "📖 THE GROUP TAB",
      story: '"Someone ordered truffle tapas for the table and just suggested splitting the check evenly."',
      help: "💡 TIP: Press [V] or scroll the Mouse Wheel anytime to switch live between 16-Bit Retro, Diablo 3/4, and AAA 3D!"
    }
  ],
  senior: [
    {
      badge: "📖 CHAPTER 5 // RESORT 80+",
      story: '"Welcome to Sunset Palms! The 3:00 PM Early-Bird Buffet is open and the Pickleball courts are ruthless."',
      help: "💡 TIP: Survive the 20 Bonus Senior Rounds from Age 80 to Age 100 to claim the Centenarian Legend title!"
    },
    {
      badge: "📖 GOLDEN YEARS",
      story: '"Your knees predict rain three days in advance, and the HOA Board is measuring lawn heights with a ruler."',
      help: "💡 TIP: Look for Senior-tier perks like Executive Delegation and Titanium Knees to overpower late-game swarms!"
    }
  ]
};

const MILESTONE_LIST = [
  { age: 45, name: "Annual Performance Review" },
  { age: 50, name: "Decade Checkpoint (Age 50)" },
  { age: 52, name: "Adjustable-Rate Mortgage" },
  { age: 60, name: "Midlife Crisis V8 Boss" },
  { age: 70, name: "HOA Board President" },
  { age: 80, name: "Full Retirement Boss" },
  { age: 90, name: "6 AM Pickleball Champion" },
  { age: 100, name: "Centenarian Victory (Age 100)" }
];

function updateContextAndRadar() {
  const tickerEl = document.getElementById("hud-context-bar");
  const badgeEl  = document.getElementById("ctx-badge");
  const storyEl  = document.getElementById("ctx-story");
  const helpEl   = document.getElementById("ctx-help");
  const radarThreatsEl = document.getElementById("hud-radar-threats");
  const radarNextEl    = document.getElementById("hud-radar-next");
  if (!tickerEl || !badgeEl || !storyEl || !helpEl || typeof stats === "undefined" || !stats) return;

  // 1. Scan live on-screen entities for the Situational Radar & Contextual Alerts
  let activeEnemies = 0;
  let activeBoss = null;
  let ringingSpam = false;
  let eliteNear = false;
  let twingeNear = false;
  if (typeof bills !== "undefined" && bills && bills.getChildren) {
    const list = bills.getChildren();
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (!b || !b.active) continue;
      activeEnemies++;
      if (b.isBoss) activeBoss = b;
      if (b.kind === "spamCall" && b.state === "ringing") ringingSpam = true;
      if (b.kind === "officeGossip") eliteNear = true;
      if (b.kind === "backTwinge") twingeNear = true;
    }
  }

  let chestCount = (typeof chests !== "undefined" && chests && chests.countActive) ? chests.countActive() : 0;
  let pizzaCount = (window.pizzas && window.pizzas.countActive) ? window.pizzas.countActive() : 0;
  let nearbyPlants = 0;
  if (typeof stageProps !== "undefined" && stageProps && typeof player !== "undefined" && player) {
    for (let i = 0; i < stageProps.length; i++) {
      const p = stageProps[i];
      if (p && p.visible && p.propKind === "prop_plant") {
        const d = Math.hypot(p.x - player.x, p.y - player.y);
        if (d < 340) nearbyPlants++;
      }
    }
  }

  // Update the Center Lower-Third Situational Radar Row
  if (radarThreatsEl) {
    const parts = [`👀 ON SCREEN: <b>${activeEnemies}</b> ${activeEnemies === 1 ? "Threat" : "Threats"}`];
    if (activeBoss) {
      const bCfg = (typeof ENEMIES !== "undefined" && ENEMIES[activeBoss.kind]) || { label: "BOSS" };
      parts.push(`🚨 <b>${bCfg.label} (${activeBoss.hp} HP)</b>`);
    }
    if (chestCount > 0) parts.push(`🎁 <b>${chestCount} Bonus Chest!</b>`);
    else if (pizzaCount > 0) parts.push(`🍕 <b>${pizzaCount} Pizza Slice!</b>`);
    else if (nearbyPlants > 0) parts.push(`🪴 <b>${nearbyPlants} Potted ${nearbyPlants === 1 ? "Plant" : "Plants"}</b>`);
    radarThreatsEl.innerHTML = parts.join(" &bull; ");
  }

  if (radarNextEl) {
    const nextM = MILESTONE_LIST.find(m => m.age > currentAge) || MILESTONE_LIST[MILESTONE_LIST.length - 1];
    const yrsLeft = Math.max(0, nextM.age - currentAge).toFixed(1);
    radarNextEl.innerHTML = activeBoss
      ? `⚔️ BOSS ACTIVE: <b>Defeat ${(ENEMIES[activeBoss.kind] && ENEMIES[activeBoss.kind].name) || "Boss"}!</b>`
      : `🎯 NEXT: <b>Age ${nextM.age} ${nextM.name}</b> (${yrsLeft} yrs)`;
  }

  // 2. Determine the highest-priority Contextual Story & Help message
  const now = performance.now();
  let chosen = null;

  if (activeContextOverride && now < activeContextOverride.untilMs) {
    chosen = activeContextOverride;
  } else {
    activeContextOverride = null;
  }

  if (!chosen) {
    if (hp <= Math.max(3, Math.floor(stats.maxHp * 0.34))) {
      chosen = {
        badge: "🩺 VITALITY LOW",
        story: `"HP is down to ${Math.max(0, hp)}/${stats.maxHp}! Your lower back is barking and your energy is fading fast."`,
        help: "💡 HELP: Crack open green Potted Plants for Leftover Pizza (+3 HP) or collect blue Gems to level up (+2 HP)!",
        mood: "urgent"
      };
    } else if (activeBoss) {
      const bInfo = (typeof ENEMIES !== "undefined" && ENEMIES[activeBoss.kind]) || { name: "Decade Boss", hp: activeBoss.hp };
      chosen = {
        badge: "🚨 BOSS ON FLOOR",
        story: `"${bInfo.name} (${activeBoss.hp} HP remaining) is pursuing you across the floor!"`,
        help: "💡 HELP: Keep kiting in wide circles around desks! Defeating a Boss drops a gold Executive Bonus Chest + 5 Coins.",
        mood: "urgent"
      };
    } else if (chestCount > 0) {
      chosen = {
        badge: "🎁 BONUS CHEST READY",
        story: '"An uncollected gold Executive Bonus Chest is gleaming on the floor nearby!"',
        help: "💡 HELP: Walk right over the gold BONUS chest to claim an instant free Weapon or Perk upgrade!",
        mood: "loot"
      };
    } else if (pizzaCount > 0 && hp < stats.maxHp) {
      chosen = {
        badge: "🍕 PIZZA ON FLOOR",
        story: '"Someone left a warm slice of breakroom pepperoni pizza out in the open!"',
        help: "💡 HELP: Walk near the Pizza slice to magnetize it and heal +3 HP immediately!",
        mood: "loot"
      };
    } else if (typeof slowUntil !== "undefined" && typeof runElapsedMs !== "undefined" && runElapsedMs < slowUntil) {
      chosen = {
        badge: "🍩 SUGAR CRASH",
        story: '"That frosted breakroom snack spiked your blood sugar and slowed your stride."',
        help: "💡 HELP: Movement speed is temporarily reduced! Hug furniture corners to block chasing Bills until the crash clears.",
        mood: "urgent"
      };
    } else if (ringingSpam) {
      chosen = {
        badge: "📞 SPAM CALL RINGING",
        story: '"An Extended Auto Warranty robocall is vibrating on the floor and locking onto your position!"',
        help: "💡 HELP: Step sideways now! Once a purple Spam Call finishes ringing, it rockets forward in a straight line.",
        mood: "urgent"
      };
    } else if (typeof player !== "undefined" && player && (player.elev || 0) > 15) {
      chosen = {
        badge: "🪜 MEZZANINE HIGH GROUND",
        story: '"You climbed the stairs onto the raised Mezzanine deck overlooking the arena floor."',
        help: "💡 HELP: Use the staircase choke point to bunch enemies together so Coffee Splash and Dad Joke hit the whole pack!",
        mood: "loot"
      };
    } else if (eliteNear) {
      chosen = {
        badge: "📨 ELITE THREAT NEARBY",
        story: '"A tanky Reply-All thread with 24 people CC\'d is lumbering toward your position."',
        help: "💡 HELP: Reply-All Elites drop 3 Gems + 2 Coins when paid off, but watch out: they split into 2 fast Late Fees!",
        mood: "normal"
      };
    } else if (twingeNear) {
      chosen = {
        badge: "⚡ SCIATICA TWINGE",
        story: '"A sudden orange lower-back spasm is lunging and resting across the floor."',
        help: "💡 HELP: Orange Twinges lunge fast for 0.55s then pause for 0.45s. Strike while they pause to catch their breath!",
        mood: "normal"
      };
    } else {
      // Rotate smoothly through the active Life Stage's story & help beats every 8.5 seconds
      const stObj = (typeof getActiveStage === "function") ? getActiveStage(currentAge, meta) : null;
      const stId = (stObj && stObj.id) || "office";
      const pool = STAGE_NARRATIVES[stId] || STAGE_NARRATIVES.office;
      const idx = Math.floor((typeof runElapsedMs !== "undefined" ? runElapsedMs : now) / 8500) % pool.length;
      chosen = Object.assign({ mood: "normal" }, pool[idx]);
    }
  }

  tickerEl.classList.toggle("ctx-urgent", chosen.mood === "urgent");
  tickerEl.classList.toggle("ctx-loot", chosen.mood === "loot");
  if (badgeEl.textContent !== chosen.badge) badgeEl.textContent = chosen.badge;
  if (storyEl.textContent !== chosen.story) storyEl.textContent = chosen.story;
  if (helpEl.textContent !== chosen.help)   helpEl.textContent = chosen.help;
}

window.syncUITheme = function() {
  const root = document.getElementById("ui-layer");
  if (!root) return;
  const idx = window.viewModeIdx || 0;
  root.dataset.theme = String(idx);
  const dept = document.getElementById("hud-dept");
  const ver = getVersionInfo();
  if (dept) dept.textContent = `${THEME_LABELS[idx] || THEME_LABELS[0]} // ${ver.displayVersion}`;
  root.querySelectorAll(".style-opt").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.idx) === idx);
  });
};

function updateHUD() {
  const hpFill = document.getElementById("hud-hp-fill");
  if (!hpFill || !stats || !meta) return;

  const ch = CHARACTERS.find(c => c.id === meta.selectedChar) || CHARACTERS[0];
  document.getElementById("hud-avatar").textContent = CHAR_ICONS[ch.id] || "☕";
  document.getElementById("hud-charname").textContent = ch.name;
  document.getElementById("hud-lv").textContent = `LV ${level}`;

  const hpPct = Math.max(0, Math.min(100, (hp / stats.maxHp) * 100));
  hpFill.style.width = `${hpPct}%`;
  document.getElementById("hud-hp-text").textContent = `${Math.max(0, hp)} / ${stats.maxHp} HP`;

  const xpPct = Math.max(0, Math.min(100, (xp / xpNeeded) * 100));
  document.getElementById("hud-xp-fill").style.width = `${xpPct}%`;
  document.getElementById("hud-xp-text").textContent = `${xp} / ${xpNeeded} XP`;

  document.getElementById("hud-age").textContent = `AGE ${currentAge.toFixed(1)}`;
  const tlTitle = document.getElementById("hud-timeline-title");
  const curStage = (typeof getActiveStage === "function") ? getActiveStage(currentAge, meta) : null;
  const stagePrefix = curStage ? `${curStage.name.toUpperCase()} // ` : "";
  if (currentAge < 80) {
    tlTitle.textContent = `${stagePrefix}${curStage ? curStage.chapter : "GOAL: AGE 80"}`;
    const agePct = Math.max(0, Math.min(100, ((currentAge - 40) / 40) * 100));
    document.getElementById("hud-age-fill").style.width = `${agePct}%`;
  } else {
    tlTitle.textContent = `🌴 SUNSET PALMS // 🔥 SENIOR BONUS (80 -> 100!)`;
    const senPct = Math.max(0, Math.min(100, ((currentAge - 80) / 20) * 100));
    document.getElementById("hud-age-fill").style.width = `${senPct}%`;
  }

  document.getElementById("hud-coins").textContent = `${meta.coins}k`;
  const yieldEl = document.getElementById("hud-yield-pill");
  if (yieldEl && typeof window.getCoinYieldInfo === "function") {
    const yld = window.getCoinYieldInfo();
    yieldEl.textContent = `📈 ${yld.label} (+${yld.value}k/🪙)`;
  }
  syncMuteButtons();

  const badges = [];
  badges.push(`<span class="perk-badge" title="Coffee Splash">${stats.coldBrew ? "⚡☕ Cold Brew" : "☕ Coffee"}</span>`);
  if (stats.dadJoke) badges.push(`<span class="perk-badge" title="Dad Joke">${stats.punStorm ? "🌩️😂 Pun Storm" : "😂 Dad Joke"}</span>`);
  if (stats.wordNo)  badges.push(`<span class="perk-badge" title="The Word No">${stats.healthyBoundaries ? "🛡️🛑 Boundaries" : '🛑 "No."'}</span>`);
  if (stats.hasShoes)   badges.push(`<span class="perk-badge passive">👟</span>`);
  if (stats.hasSleep)   badges.push(`<span class="perk-badge passive">😴</span>`);
  if (stats.hasGlasses) badges.push(`<span class="perk-badge passive">👓</span>`);
  const loadoutEl = document.getElementById("hud-loadout");
  const html = badges.join("");
  updateCleanHUD();
  if (loadoutEl.dataset.prev !== html) {
    loadoutEl.innerHTML = html;
    loadoutEl.dataset.prev = html;
  }

}

// Clean screen HUD: only the essentials, Vampire Survivors-style.
function updateCleanHUD() {
  const hudEl = document.getElementById("vs-hud");
  if (!hudEl || !stats || !meta) return;
  hudEl.classList.toggle("hidden", !!(titleOpen || gameOver));
  const xpPct = Math.max(0, Math.min(100, (xp / xpNeeded) * 100));
  document.getElementById("vs-xp-fill").style.width = `${xpPct}%`;
  document.getElementById("vs-lv").textContent = `LV ${level}`;
  document.getElementById("vs-age").textContent = `AGE ${Math.floor(currentAge)}`;
  const yearPct = Math.max(0, Math.min(100, (currentAge - Math.floor(currentAge)) * 100));
  document.getElementById("vs-year-fill").style.width = `${yearPct}%`;
  document.getElementById("vs-coins").textContent = `🪙 ${meta.coins}k`;
  const icons = [stats.coldBrew ? "⚡" : "☕"];
  if (stats.dadJoke) icons.push(stats.punStorm ? "🌩️" : "😂");
  if (stats.wordNo) icons.push(stats.healthyBoundaries ? "🛡️" : "🛑");
  if (stats.remote) icons.push(stats.smartTv ? "📡" : "📺");
  if (stats.sheet) icons.push(stats.pivotTable ? "🧮" : "📊");
  if (stats.podcast) icons.push(stats.bingeMode ? "🍿" : "🎧");
  if (stats.hasShoes) icons.push("👟");
  if (stats.hasSleep) icons.push("😴");
  if (stats.hasGlasses) icons.push("👓");
  const lo = document.getElementById("vs-loadout");
  const loHtml = icons.map(i => `<span>${i}</span>`).join("");
  if (lo.dataset.prev !== loHtml) { lo.innerHTML = loHtml; lo.dataset.prev = loHtml; }
}
window.updateCleanHUD = updateCleanHUD;

function showBossToastUI(bossName, customSub) {
  const toast = document.getElementById("boss-toast");
  const title = document.getElementById("boss-toast-title");
  const sub = document.getElementById("boss-toast-sub");
  if (!toast || !title) return;
  if (sub) sub.textContent = customSub || "URGENT CALENDAR REMINDER // MANDATORY ATTENDANCE";
  title.textContent = `${bossName.toUpperCase()}!`;
  toast.classList.remove("hidden");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add("hidden"), 3400);
}

// Render & show/hide the PAUSE & OPTIONS Modal (`Space` / `P` / `Esc` / `Start` / `⏸ PAUSE`)
function setPauseModalVisible(vis) {
  const el = document.getElementById("pause-modal");
  if (!el) return;
  el.classList.toggle("hidden", !vis);
  if (vis) {
    renderPauseModal(uiScene);
  }
}

function renderPauseModal(scene, keepRowIdx) {
  const modal = document.getElementById("pause-modal");
  if (!modal) return;
  const vIdx = window.viewModeIdx || 0;
  const muted = isMuted();
  const voiced = typeof isVoiceEnabled === "function" ? isVoiceEnabled() : true;
  const verInfo = getVersionInfo();

  modal.innerHTML = `
    <div class="modal-card pause-box">
      <div class="modal-kicker">✓ AUTO-SAVED // ${verInfo.displayVersion} • LAST UPDATED ON: ${verInfo.lastUpdated.toUpperCase()}</div>
      <h2 class="modal-title">PAUSE & OPTIONS</h2>
      <p class="modal-sub">Age ${currentAge.toFixed(1)} | Level ${level} | HP ${Math.max(0, hp)}/${stats ? stats.maxHp : 12} | 401(k): ${meta ? meta.coins : 0}k</p>
      <div class="options-list">
        <button class="opt-btn primary-opt" id="pause-resume-btn">▶ RESUME SHIFT (Space / Esc / A)</button>
        <button class="opt-btn" id="pause-controls-btn">
          <span>🎮 INPUT & CONTROLS CONFIG</span>
          <span class="opt-val">KEYS / MOUSE / TOUCH / PAD ▶</span>
        </button>
        <button class="opt-btn" id="pause-style-btn" data-opt-cycle="1">
          <span>💡 GAME TIPS</span>
          <span class="opt-val">◀ ${window.tipsEnabled() ? "ON" : "OFF"} ▶</span>
        </button>
        <button class="opt-btn" id="pause-audio-btn" data-opt-cycle="1">
          <span>🔊 SOUND & MUSIC</span>
          <span class="opt-val">◀ ${muted ? "MUTED 🔇" : "ON 🔊"} ▶</span>
        </button>
        <button class="opt-btn" id="pause-voice-btn" data-opt-cycle="1">
          <span>🗣️ DAD JOKE VOICE</span>
          <span class="opt-val">◀ ${voiced ? "SPOKEN 🗣️" : "TEXT ONLY 💬"} ▶</span>
        </button>
        <button class="opt-btn" id="pause-savequit-btn">
          <span>💾 SAVE & EXIT TO TITLE</span>
          <span class="opt-val">RESUME LATER</span>
        </button>
        <button class="opt-btn" id="pause-restart-btn">
          <span>🔄 START FRESH RUN</span>
          <span class="opt-val">AGE ${meta ? (meta.startDecade || 40) : 40}</span>
        </button>
      </div>
      <div class="nav-hint-bar">
        <span><b>▲▼</b> Arrow / D-Pad / Mouse: Navigate</span>
        <span><b>◀▶ / Space / Enter / A</b>: Select or Toggle</span>
        <span><b>Esc / B / Start</b>: Resume</span>
      </div>
    </div>
  `;

  bindNavItem(document.getElementById("pause-resume-btn"), 0, () => {
    sfx("pick");
    togglePause(scene);
  }, keepRowIdx === undefined || keepRowIdx === 0);

  bindNavItem(document.getElementById("pause-controls-btn"), 1, () => {
    sfx("pick");
    openControlsModal(scene);
  }, keepRowIdx === 1);

  bindNavItem(document.getElementById("pause-style-btn"), 2, () => {
    // Row 2 is now the Game Tips switch (the Visual Engine row went away while 3D is parked).
    window.setTipsEnabled(!window.tipsEnabled());
    sfx("pick");
    renderPauseModal(scene, 2);
  }, keepRowIdx === 2);

  bindNavItem(document.getElementById("pause-audio-btn"), 3, () => {
    toggleMute();
    syncMuteButtons();
    sfx("pick");
    renderPauseModal(scene, 3);
  }, keepRowIdx === 3);

  bindNavItem(document.getElementById("pause-voice-btn"), 4, () => {
    if (typeof toggleVoice === "function") toggleVoice();
    sfx("pick");
    renderPauseModal(scene, 4);
  }, keepRowIdx === 4);

  bindNavItem(document.getElementById("pause-lore-btn"), 5, () => {
    sfx("pick");
    openLoreModal(scene);
  }, keepRowIdx === 5);

  bindNavItem(document.getElementById("pause-changelog-btn"), 6, () => {
    sfx("pick");
    openChangelogModal(scene);
  }, keepRowIdx === 6);

  bindNavItem(document.getElementById("pause-savequit-btn"), 7, () => {
    sfx("pick");
    if (window.persistActiveRun) window.persistActiveRun();
    setPauseModalVisible(false);
    paused = false;
    titleSeen = false;
    scene.scene.restart();
  }, keepRowIdx === 7);

  bindNavItem(document.getElementById("pause-restart-btn"), 8, () => {
    sfx("pick");
    clearRunState();
    setPauseModalVisible(false);
    paused = false;
    scene.scene.restart();
  }, keepRowIdx === 8);

  window.menuNav.refresh();
}

// ============================================================================
// VERSION TRACKING & PATCH NOTES MODAL (`#changelog-modal`)
// ============================================================================
function openChangelogModal(scene) {
  window.changelogModalOpen = true;
  const modal = document.getElementById("changelog-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderChangelogModal(scene || uiScene);
}

function closeChangelogModal(scene) {
  window.changelogModalOpen = false;
  const modal = document.getElementById("changelog-modal");
  if (modal) modal.classList.add("hidden");
  const sc = scene || uiScene;
  if (titleOpen) {
    renderTitleModal(sc, "#title-changelog-btn");
  } else if (paused) {
    renderPauseModal(sc, 6);
  } else {
    window.menuNav.refresh();
  }
}

// ============================================================================
// MYTHOS, SUBJECT DOSSIERS & SCENARIO LORE ARCHIVE MODAL (`#lore-modal`)
// ============================================================================
function openLoreModal(scene, tab) {
  window.loreModalOpen = true;
  if (tab) currentLoreTab = tab;
  const modal = document.getElementById("lore-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderLoreModal(scene || uiScene, currentLoreTab);
}

function closeLoreModal(scene) {
  window.loreModalOpen = false;
  const modal = document.getElementById("lore-modal");
  if (modal) modal.classList.add("hidden");
  const sc = scene || uiScene;
  if (titleOpen) {
    renderTitleModal(sc, "#title-lore-btn");
  } else if (paused) {
    renderPauseModal(sc, 5);
  } else {
    window.menuNav.refresh();
  }
}

function renderLoreModal(scene, tab, keepSelector) {
  const modal = document.getElementById("lore-modal");
  if (!modal) return;
  currentLoreTab = tab || currentLoreTab || "mythos";
  const lore = window.GAME_LORE || {};
  let contentHtml = "";

  if (currentLoreTab === "mythos") {
    const wm = lore.worldMythos || { title: "THE GREAT COMPOUNDING", subtitle: "", chapters: [] };
    contentHtml = (wm.chapters || []).map(ch => `
      <div class="lore-card">
        <div class="lore-card-head">
          <span class="lore-card-code">FORM W-40 // WORLD MYTHOS</span>
        </div>
        <div class="lore-card-title">${ch.heading}</div>
        <div class="lore-card-body">${ch.body}</div>
      </div>
    `).join("");
  } else if (currentLoreTab === "subjects") {
    const subjMap = lore.subjects || {};
    contentHtml = Object.keys(subjMap).map(k => {
      const s = subjMap[k];
      return `
        <div class="lore-card">
          <div class="lore-card-head">
            <span class="lore-card-code">${s.code}</span>
            <span class="changelog-date">${s.realName}</span>
          </div>
          <div class="lore-card-title">${s.icon} ${s.name} (${s.archetype})</div>
          <div class="lore-card-body">${s.backstory}</div>
          <div class="lore-card-meta">⚔️ SIGNATURE RELIC: ${s.relic}</div>
          <div class="lore-card-meta" style="color:#5fb3f0;">🎯 TACTICAL EDGE: ${s.edge}</div>
          <div class="lore-card-quote">${s.quote}</div>
        </div>
      `;
    }).join("");
  } else if (currentLoreTab === "scenarios") {
    const scList = lore.scenarios || [];
    contentHtml = scList.map(sc => {
      const mList = (sc.manifestations || []).map(m => `<li>${m}</li>`).join("");
      return `
        <div class="lore-card">
          <div class="lore-card-head">
            <span class="lore-card-code">${sc.code}</span>
            <span class="changelog-date">${sc.subtitle}</span>
          </div>
          <div class="lore-card-title">${sc.name}</div>
          <div class="lore-card-body">${sc.lore}</div>
          <ul class="changelog-notes">${mList}</ul>
          <div class="lore-card-meta">💡 SURVIVAL NOTE: ${sc.survivalTip}</div>
        </div>
      `;
    }).join("");
  } else if (currentLoreTab === "bosses") {
    const bList = lore.bosses || [];
    contentHtml = bList.map(b => `
      <div class="lore-card">
        <div class="lore-card-head">
          <span class="lore-card-code">MILESTONE NEMESIS // ${b.age}</span>
          <span class="changelog-date">${b.stage}</span>
        </div>
        <div class="lore-card-title">${b.name}</div>
        <div class="lore-card-body">${b.lore}</div>
      </div>
    `).join("");
  }

  modal.innerHTML = `
    <div class="modal-card lore-box">
      <div class="modal-kicker">BUREAU OF ACTUARIAL SURVIVAL // FORM W-40 ARCHIVE</div>
      <h2 class="modal-title">📖 MYTHOS, SUBJECTS & SCENARIOS</h2>
      <p class="modal-sub">Explore the origin of <b>The Great Compounding</b>, the 3 Playable Subjects, and the 5 Life Scenarios.</p>
      <div class="lore-tabs">
        <button class="lore-tab-btn ${currentLoreTab === "mythos" ? "active" : ""}" data-ltab="mythos">🌐 1. WORLD MYTHOS</button>
        <button class="lore-tab-btn ${currentLoreTab === "subjects" ? "active" : ""}" data-ltab="subjects">🪪 2. SUBJECT DOSSIERS</button>
        <button class="lore-tab-btn ${currentLoreTab === "scenarios" ? "active" : ""}" data-ltab="scenarios">🗺️ 3. LIFE SCENARIOS</button>
        <button class="lore-tab-btn ${currentLoreTab === "bosses" ? "active" : ""}" data-ltab="bosses">👹 4. BOSS REGISTRY</button>
      </div>
      <div class="lore-content">${contentHtml}</div>
      <button class="cta-btn" id="lore-close-btn">✓ BACK TO MENU (Space / Enter / Esc / A)</button>
      <div class="nav-hint-bar">
        <span><b>◀▶ / ▲▼</b> Arrow / D-Pad / Mouse: Switch Lore Tab</span>
        <span><b>Space / Enter / Esc / A / B</b>: Select or Close</span>
      </div>
    </div>
  `;

  modal.querySelectorAll("[data-ltab]").forEach(btn => {
    const t = btn.dataset.ltab;
    bindNavItem(btn, 0, () => {
      sfx("pick");
      renderLoreModal(scene, t, `[data-ltab="${t}"]`);
    });
  });

  bindNavItem(document.getElementById("lore-close-btn"), 1, () => {
    sfx("pick");
    closeLoreModal(scene);
  }, !keepSelector);

  window.menuNav.refresh(keepSelector || "#lore-close-btn");
}

function renderChangelogModal(scene) {
  const modal = document.getElementById("changelog-modal");
  if (!modal) return;
  const verInfo = getVersionInfo();
  const entriesHtml = (verInfo.changelog || []).map((entry, idx) => {
    const notesHtml = (entry.highlights || []).map(h => `<li>${h}</li>`).join("");
    return `
      <div class="changelog-entry ${idx === 0 ? "latest" : ""}">
        <div class="changelog-header">
          <span class="changelog-ver">${entry.ver}${idx === 0 ? " // CURRENT BUILD" : ""}</span>
          <span class="changelog-date">Last updated on: ${entry.date}</span>
        </div>
        <div class="changelog-title">${entry.title}</div>
        <ul class="changelog-notes">${notesHtml}</ul>
      </div>
    `;
  }).join("");

  modal.innerHTML = `
    <div class="modal-card changelog-box">
      <div class="modal-kicker">OFFICIAL BUILD LOG // ${verInfo.displayVersion} (${verInfo.codename.toUpperCase()})</div>
      <h2 class="modal-title">📜 VERSION HISTORY & PATCH NOTES</h2>
      <p class="modal-sub">Current Version: <b>${verInfo.displayVersion}</b> &bull; Last updated on: <b>${verInfo.lastUpdated}</b> (Build #${verInfo.build})</p>
      <div class="changelog-list">${entriesHtml}</div>
      <button class="cta-btn" id="changelog-close-btn">✓ BACK TO MENU (Space / Enter / Esc / A)</button>
      <div class="nav-hint-bar">
        <span><b>Space / Enter / Esc / Click / A / B</b>: Close Patch Notes</span>
      </div>
    </div>
  `;

  bindNavItem(document.getElementById("changelog-close-btn"), 0, () => {
    sfx("pick");
    closeChangelogModal(scene);
  }, true);

  window.menuNav.refresh("#changelog-close-btn");
}

// ============================================================================
// INPUT & CONTROLS CONFIGURATION MODAL (Keyboard, Mouse, Touch, Controller)
// ============================================================================
const MOUSE_MOVE_MODES = [
  { id: "holdFollow",   label: "🖱️ Hold Click to Steer" },
  { id: "cursorFollow", label: "🎯 Cursor Auto-Follow" },
  { id: "clickDrag",    label: "✋ Click & Drag Stick" },
  { id: "off",          label: "🚫 UI Menus Only" }
];

const MOUSE_RCLICK_MODES = [
  { id: "pause", label: "⏸ Pause / Options" },
  { id: "move",  label: "🏃 Hold to Move" },
  { id: "view",  label: "🎥 Switch View" }
];

const TOUCH_MODES = [
  { id: "floating",    label: "🕹️ Floating Stick" },
  { id: "fixedLeft",   label: "👈 Fixed Bottom-Left" },
  { id: "fixedRight",  label: "👉 Fixed Bottom-Right" },
  { id: "directTouch", label: "👆 Touch & Hold Follow" }
];

const TOUCH_SENS_MODES = [
  { id: "normal", label: "👌 Normal (10px)" },
  { id: "high",   label: "⚡ High (5px)" },
  { id: "low",    label: "🛡️ Relaxed (18px)" }
];

const PAD_DEADZONE_MODES = [
  { val: 0.22, label: "22% Standard" },
  { val: 0.15, label: "15% Sensitive" },
  { val: 0.35, label: "35% Anti-Drift" }
];

function openControlsModal(scene) {
  window.rebindState = null;
  window.controlsModalOpen = true;
  const modal = document.getElementById("controls-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderControlsModal(scene || uiScene);
}

function closeControlsModal(scene) {
  window.rebindState = null;
  window.controlsModalOpen = false;
  const modal = document.getElementById("controls-modal");
  if (modal) modal.classList.add("hidden");
  syncControlHUDHints();
  const sc = scene || uiScene;
  if (titleOpen) {
    renderTitleModal(sc, "#title-controls-btn");
  } else if (paused) {
    renderPauseModal(sc, 1);
  } else {
    window.menuNav.refresh();
  }
}

function renderControlsModal(scene, keepSelector) {
  const modal = document.getElementById("controls-modal");
  if (!modal) return;
  if (meta && !meta.controls) {
    meta.controls = Object.assign({}, window.DEFAULT_CONTROLS);
  }
  const c = getControlsConfig();
  const fmtKey = window.formatKeyCode || (k => k);
  const fmtPad = window.formatPadButton || (b => `Btn ${b}`);
  const reb = window.rebindState;

  const keyBtnLabel = (field, fallback) => {
    if (reb && reb.type === "key" && reb.field === field) {
      return "🔴 PRESS ANY KEY... (ESC)";
    }
    return fmtKey(c[field] || fallback);
  };

  const padBtnLabel = (field, fallback) => {
    if (reb && reb.type === "pad" && reb.field === field) {
      return "🔴 PRESS PAD BTN... (◀▶)";
    }
    return `◀ ${fmtPad(c[field] !== undefined ? c[field] : fallback)} ▶`;
  };

  const mMode = MOUSE_MOVE_MODES.find(m => m.id === c.mouseMoveMode) || MOUSE_MOVE_MODES[0];
  const rMode = MOUSE_RCLICK_MODES.find(m => m.id === c.mouseRightClick) || MOUSE_RCLICK_MODES[0];
  const tMode = TOUCH_MODES.find(m => m.id === c.touchMode) || TOUCH_MODES[0];
  const tSens = TOUCH_SENS_MODES.find(m => m.id === c.touchSensitivity) || TOUCH_SENS_MODES[0];
  const pDead = PAD_DEADZONE_MODES.find(m => Math.abs(m.val - Number(c.padDeadzone || 0.22)) < 0.03) || PAD_DEADZONE_MODES[0];

  modal.innerHTML = `
    <div class="modal-card controls-box">
      <div class="modal-kicker">ALL 4 INPUT DEVICES ACTIVE // AUTO-SAVED TO LOCALSTORAGE</div>
      <h2 class="modal-title">🎮 INPUT & CONTROLS CONFIGURATION</h2>
      <div class="device-status-bar">
        <span class="device-pill ready">⌨️ KEYBOARD: READY</span>
        <span class="device-pill ready">🖱️ MOUSE: READY</span>
        <span class="device-pill ready">📱 TOUCH: READY</span>
        <span class="device-pill ${gamepadConnectedFlag ? "ready" : ""}">🎮 CONTROLLER: ${gamepadConnectedFlag ? "CONNECTED" : "PLUG & PLAY"}</span>
      </div>

      <div class="controls-grid">
        <!-- SECTION 1: KEYBOARD MAPPING -->
        <div class="ctrl-section">
          <div class="ctrl-sec-title">⌨️ KEYBOARD BINDINGS (CLICK TO REBIND)</div>
          <div class="ctrl-rows">
            <button class="ctrl-btn ${reb && reb.field === "keyUp" ? "listening" : ""}" id="ctrl-keyUp">
              <span>Move Up</span><span class="ctrl-val">${keyBtnLabel("keyUp", "KeyW")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyDown" ? "listening" : ""}" id="ctrl-keyDown">
              <span>Move Down</span><span class="ctrl-val">${keyBtnLabel("keyDown", "KeyS")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyLeft" ? "listening" : ""}" id="ctrl-keyLeft">
              <span>Move Left</span><span class="ctrl-val">${keyBtnLabel("keyLeft", "KeyA")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyRight" ? "listening" : ""}" id="ctrl-keyRight">
              <span>Move Right</span><span class="ctrl-val">${keyBtnLabel("keyRight", "KeyD")}</span>
            </button>
            <button class="ctrl-btn" id="ctrl-arrowMove" data-opt-cycle="1">
              <span>Arrow Keys Move</span><span class="ctrl-val">◀ ${c.arrowMove !== false ? "ON (WASD + ▲▼◀▶)" : "CUSTOM ONLY"} ▶</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyPause" ? "listening" : ""}" id="ctrl-keyPause">
              <span>Pause / Options</span><span class="ctrl-val">${keyBtnLabel("keyPause", "Space")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyView" ? "listening" : ""}" id="ctrl-keyView">
              <span>Switch View (2D/3D)</span><span class="ctrl-val">${keyBtnLabel("keyView", "KeyV")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyMute" ? "listening" : ""}" id="ctrl-keyMute">
              <span>Mute Audio</span><span class="ctrl-val">${keyBtnLabel("keyMute", "KeyM")}</span>
            </button>
          </div>
        </div>

        <!-- SECTION 2: GAME CONTROLLER + MOUSE + TOUCH -->
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="ctrl-section">
            <div class="ctrl-sec-title">🎮 VIDEO GAME CONTROLLER (PRESS OR ◀▶)</div>
            <div class="ctrl-rows">
              <button class="ctrl-btn ${reb && reb.field === "padConfirmBtn" ? "listening" : ""}" id="ctrl-padConfirmBtn" data-opt-cycle="1">
                <span>Confirm / Select</span><span class="ctrl-val">${padBtnLabel("padConfirmBtn", 0)}</span>
              </button>
              <button class="ctrl-btn ${reb && reb.field === "padPauseBtn" ? "listening" : ""}" id="ctrl-padPauseBtn" data-opt-cycle="1">
                <span>Pause / Options</span><span class="ctrl-val">${padBtnLabel("padPauseBtn", 9)}</span>
              </button>
              <button class="ctrl-btn ${reb && reb.field === "padViewBtn" ? "listening" : ""}" id="ctrl-padViewBtn" data-opt-cycle="1">
                <span>Switch 2D/3D View</span><span class="ctrl-val">${padBtnLabel("padViewBtn", 3)}</span>
              </button>
              <button class="ctrl-btn ${reb && reb.field === "padMuteBtn" ? "listening" : ""}" id="ctrl-padMuteBtn" data-opt-cycle="1">
                <span>Mute Audio</span><span class="ctrl-val">${padBtnLabel("padMuteBtn", 2)}</span>
              </button>
              <button class="ctrl-btn" id="ctrl-padDeadzone" data-opt-cycle="1">
                <span>Stick Deadzone</span><span class="ctrl-val">◀ ${pDead.label} ▶</span>
              </button>
            </div>
          </div>

          <div class="ctrl-section">
            <div class="ctrl-sec-title">🖱️ MOUSE & 📱 TOUCH CONFIGURATION</div>
            <div class="ctrl-rows">
              <button class="ctrl-btn" id="ctrl-mouseMoveMode" data-opt-cycle="1">
                <span>Mouse Movement</span><span class="ctrl-val">◀ ${mMode.label} ▶</span>
              </button>
              <button class="ctrl-btn" id="ctrl-mouseRightClick" data-opt-cycle="1">
                <span>Mouse Right-Click</span><span class="ctrl-val">◀ ${rMode.label} ▶</span>
              </button>
              <button class="ctrl-btn" id="ctrl-mouseWheelView" data-opt-cycle="1">
                <span>Mouse Wheel View</span><span class="ctrl-val">◀ ${c.mouseWheelView !== false ? "ON (Cycles 2D/3D)" : "OFF"} ▶</span>
              </button>
              <button class="ctrl-btn" id="ctrl-touchMode" data-opt-cycle="1">
                <span>Touch Stick Mode</span><span class="ctrl-val">◀ ${tMode.label} ▶</span>
              </button>
              <button class="ctrl-btn" id="ctrl-touchSensitivity" data-opt-cycle="1">
                <span>Touch Sensitivity</span><span class="ctrl-val">◀ ${tSens.label} ▶</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="controls-actions">
        <button class="cta-btn" id="ctrl-done-btn">✓ SAVE & RETURN (Esc / B)</button>
        <button class="cta-btn secondary-btn" id="ctrl-reset-btn">🔄 RESET CONTROLS TO DEFAULTS</button>
      </div>
      <div class="nav-hint-bar">
        <span><b>▲▼◀▶</b> Arrow / D-Pad / Mouse: Select</span>
        <span><b>Enter / Space / Click / A</b>: Rebind or Cycle</span>
        <span><b>Esc / B</b>: Save & Return</span>
      </div>
    </div>
  `;

  const bindKeyRebind = (field, rowIdx) => {
    const el = document.getElementById(`ctrl-${field}`);
    bindNavItem(el, rowIdx, () => {
      sfx("pick");
      if (window.rebindState && window.rebindState.field === field) {
        window.rebindState = null;
      } else {
        window.rebindState = { type: "key", field, selector: `#ctrl-${field}` };
      }
      renderControlsModal(scene, `#ctrl-${field}`);
    });
  };

  bindKeyRebind("keyUp", 0);
  bindKeyRebind("keyDown", 1);
  bindKeyRebind("keyLeft", 2);
  bindKeyRebind("keyRight", 3);

  bindNavItem(document.getElementById("ctrl-arrowMove"), 4, () => {
    window.rebindState = null;
    c.arrowMove = c.arrowMove === false ? true : false;
    saveMeta(meta);
    sfx("pick");
    renderControlsModal(scene, "#ctrl-arrowMove");
  });

  bindKeyRebind("keyPause", 5);
  bindKeyRebind("keyView", 6);
  bindKeyRebind("keyMute", 7);

  const bindPadRebindOrCycle = (field, fallback, rowIdx) => {
    const el = document.getElementById(`ctrl-${field}`);
    bindNavItem(el, rowIdx, () => {
      const dir = el.dataset.dirHint;
      sfx("pick");
      if (dir === "left" || dir === "right") {
        window.rebindState = null;
        const cur = c[field] !== undefined ? Number(c[field]) : fallback;
        const step = dir === "left" ? -1 : 1;
        c[field] = (cur + step + 12) % 12;
        saveMeta(meta);
        renderControlsModal(scene, `#ctrl-${field}`);
        return;
      }
      if (window.rebindState && window.rebindState.field === field) {
        // Clicking/activating a second time cycles to the next button if you don't have a pad plugged in
        window.rebindState = null;
        const cur = c[field] !== undefined ? Number(c[field]) : fallback;
        c[field] = (cur + 1) % 12;
        saveMeta(meta);
      } else {
        window.rebindState = { type: "pad", field, selector: `#ctrl-${field}` };
      }
      renderControlsModal(scene, `#ctrl-${field}`);
    });
  };

  bindPadRebindOrCycle("padConfirmBtn", 0, 8);
  bindPadRebindOrCycle("padPauseBtn", 9, 9);
  bindPadRebindOrCycle("padViewBtn", 3, 10);
  bindPadRebindOrCycle("padMuteBtn", 2, 11);

  bindNavItem(document.getElementById("ctrl-padDeadzone"), 12, () => {
    window.rebindState = null;
    const dir = document.getElementById("ctrl-padDeadzone").dataset.dirHint;
    const step = dir === "left" ? -1 : 1;
    const idx = PAD_DEADZONE_MODES.findIndex(m => Math.abs(m.val - Number(c.padDeadzone || 0.22)) < 0.03);
    const next = (Math.max(0, idx) + step + PAD_DEADZONE_MODES.length) % PAD_DEADZONE_MODES.length;
    c.padDeadzone = PAD_DEADZONE_MODES[next].val;
    saveMeta(meta);
    sfx("pick");
    renderControlsModal(scene, "#ctrl-padDeadzone");
  });

  const bindListCycle = (id, list, field, rowIdx) => {
    const el = document.getElementById(id);
    bindNavItem(el, rowIdx, () => {
      window.rebindState = null;
      const dir = el.dataset.dirHint;
      const step = dir === "left" ? -1 : 1;
      const idx = list.findIndex(m => m.id === c[field]);
      const next = (Math.max(0, idx) + step + list.length) % list.length;
      c[field] = list[next].id;
      saveMeta(meta);
      syncControlHUDHints();
      sfx("pick");
      renderControlsModal(scene, `#${id}`);
    });
  };

  bindListCycle("ctrl-mouseMoveMode", MOUSE_MOVE_MODES, "mouseMoveMode", 13);
  bindListCycle("ctrl-mouseRightClick", MOUSE_RCLICK_MODES, "mouseRightClick", 14);

  bindNavItem(document.getElementById("ctrl-mouseWheelView"), 15, () => {
    window.rebindState = null;
    c.mouseWheelView = c.mouseWheelView === false ? true : false;
    saveMeta(meta);
    sfx("pick");
    renderControlsModal(scene, "#ctrl-mouseWheelView");
  });

  bindListCycle("ctrl-touchMode", TOUCH_MODES, "touchMode", 16);
  bindListCycle("ctrl-touchSensitivity", TOUCH_SENS_MODES, "touchSensitivity", 17);

  bindNavItem(document.getElementById("ctrl-done-btn"), 18, () => {
    sfx("pick");
    closeControlsModal(scene);
  }, !keepSelector);

  bindNavItem(document.getElementById("ctrl-reset-btn"), 18, () => {
    window.rebindState = null;
    meta.controls = Object.assign({}, window.DEFAULT_CONTROLS);
    saveMeta(meta);
    syncControlHUDHints();
    sfx("levelUp");
    renderControlsModal(scene, "#ctrl-reset-btn");
  }, false);

  window.menuNav.refresh(keepSelector || "#ctrl-done-btn");
}

function showRetire80Modal(scene, onContinueSenior, onClaimWin) {
  const modal = document.getElementById("retire80-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const senBtn = document.getElementById("retire80-senior-btn");
  const clmBtn = document.getElementById("retire80-claim-btn");
  // Clone to clear old listeners cleanly
  const senClean = senBtn.cloneNode(true);
  const clmClean = clmBtn.cloneNode(true);
  senBtn.replaceWith(senClean);
  clmBtn.replaceWith(clmClean);

  bindNavItem(senClean, 0, () => {
    sfx("pick");
    modal.classList.add("hidden");
    onContinueSenior();
  }, true);

  bindNavItem(clmClean, 1, () => {
    sfx("pick");
    modal.classList.add("hidden");
    onClaimWin();
  }, false);

  window.menuNav.refresh();
}

function renderLevelUpModal(choices, customTitle, onPick) {
  const modal = document.getElementById("levelup-modal");
  const title = document.getElementById("lv-title");
  const kicker = document.getElementById("lv-kicker");
  const grid = document.getElementById("lv-cards");
  if (!modal || !grid) return;

  kicker.textContent = customTitle ? "EXECUTIVE BONUS // TAX-FREE REWARD" : `HR BENEFITS DEPT // PROMOTION LEVEL ${level - pendingLevels + 1}`;
  title.textContent = customTitle || "SELECT YOUR MIDLIFE PERK";
  grid.innerHTML = "";

  const cardEls = choices.map((up, i) => {
    const info = UPGRADE_META[up.name] || { icon: "⭐", tag: "PERK VOUCHER", rarity: "common" };
    const curRank = (stats && stats.perkRanks && up.id) ? (stats.perkRanks[up.id] || 0) : 0;
    const rankLabel = (up.maxRank && up.maxRank > 1 && up.maxRank < 50)
      ? `${info.tag} // RANK ${curRank + 1}/${up.maxRank}`
      : info.tag;
    const card = document.createElement("div");
    card.className = `perk-card rarity-${info.rarity}`;
    card.innerHTML = `
      <div class="perk-ribbon">${rankLabel}</div>
      <div class="perk-icon">${info.icon}</div>
      <div class="perk-name">${up.name}</div>
      <div class="perk-desc">${up.text}</div>
      <div class="perk-key">PRESS [${i + 1}] / SPACE</div>
    `;
    bindNavItem(card, 0, () => {
      modal.classList.add("hidden");
      onPick(up);
    }, i === 0);
    grid.appendChild(card);
    return card;
  });

  function highlightCard(idx) {
    const target = cardEls[idx];
    if (target) window.menuNav.focus(target, false);
  }

  modal.classList.remove("hidden");
  window.menuNav.refresh();

  return {
    highlight: highlightCard,
    close: () => modal.classList.add("hidden")
  };
}

// Render the Title Screen ("Executive Dossier, Save/Resume & 401(k) Portal")
function renderTitleModal(scene, preserveFocusSelector) {
  const modal = document.getElementById("title-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const savedRun = loadRunState();

  const charCardsHtml = CHARACTERS.map(ch => {
    const owned = !!meta.unlockedChars[ch.id];
    const sel = meta.selectedChar === ch.id;
    const status = sel ? "✓ ACTIVE" : (owned ? "SELECT" : `🔒 ${ch.cost}k`);
    return `
      <div class="dossier-char ${sel ? "selected" : ""} ${owned ? "owned" : "locked"}" data-char="${ch.id}">
        <div class="char-emoji">${CHAR_ICONS[ch.id] || "☕"}</div>
        <div class="char-title">${ch.name}</div>
        <div class="char-desc">${ch.tagline}</div>
        <div class="char-badge">${status}</div>
      </div>
    `;
  }).join("");

  const unlockedDecs = meta.unlockedDecades || [40];
  const decadeBtnsHtml = DECADE_CHECKPOINTS.map(dc => {
    const isUnlocked = unlockedDecs.includes(dc.age);
    const isSel = (meta.startDecade || 40) === dc.age;
    return `
      <button class="t-style-btn ${isSel ? "active" : ""}" data-dec="${dc.age}" ${isUnlocked ? "" : "disabled style='opacity:0.4;cursor:not-allowed'"} title="${dc.name}">
        ${isUnlocked ? "🔓" : "🔒"} Age ${dc.age} ${dc.bonusLevels ? `(+${dc.bonusLevels} Perks)` : ""}
      </button>
    `;
  }).join("");

  const bestAge = meta.bestAge || 40;
  const selStage = meta.selectedStage || "auto";
  const stageBtnsHtml = `<button class="t-style-btn ${selStage === "auto" ? "active" : ""}" data-stage="auto" title="Automatically transitions through Office -> Hospital -> Home -> Social Courtyard -> Senior Resort as you age!">🔄 Auto-Progress</button>` +
    (window.STAGES || []).map(st => {
      const isUnlocked = bestAge >= st.unlockAge || unlockedDecs.includes(st.unlockAge);
      const isSel = selStage === st.id;
      return `
        <button class="t-style-btn ${isSel ? "active" : ""}" data-stage="${st.id}" ${isUnlocked ? "" : "disabled style='opacity:0.4;cursor:not-allowed'"} title="${st.tagline}">
          ${isUnlocked ? st.name : `🔒 ${st.name} (Age ${st.unlockAge}+)`}
        </button>
      `;
    }).join("");

  const shopRowsHtml = META_SHOP.map(item => {
    const rank = meta.ranks[item.id] || 0;
    const maxed = rank >= item.maxRank;
    const cost = item.baseCost * (rank + 1);
    const canBuy = !maxed && meta.coins >= cost;
    return `
      <div class="shop-row ${maxed ? "maxed" : ""} ${canBuy ? "affordable" : ""}" data-shop="${item.id}">
        <div class="shop-info">
          <span class="shop-name">${item.name}</span>
          <span class="shop-pips">${"■".repeat(rank)}${"□".repeat(item.maxRank - rank)}</span>
          <span class="shop-desc">${item.desc}</span>
        </div>
        <button class="shop-buy-btn" tabindex="-1">${maxed ? "MAXED" : `BUY ${cost}k`}</button>
      </div>
    `;
  }).join("");

  const resumeBannerHtml = savedRun ? `
    <button class="cta-btn resume-saved-btn" id="title-resume-btn" style="background:#52bf6a;margin-bottom:6px;">
      💾 RESUME SAVED RUN (Age ${Number(savedRun.currentAge).toFixed(1)} | Level ${savedRun.level} | HP ${savedRun.hp}/${savedRun.stats.maxHp})
    </button>
  ` : "";

  const verInfo = getVersionInfo();
  const activeSubj = (window.GAME_LORE && window.GAME_LORE.subjects && window.GAME_LORE.subjects[meta.selectedChar])
    || (window.GAME_LORE && window.GAME_LORE.subjects && window.GAME_LORE.subjects.officeWorker)
    || null;
  const subjectBioHtml = activeSubj ? `
    <div class="subject-bio-strip" id="title-subject-bio">
      <div class="subject-bio-head">
        <span class="subject-bio-code">${activeSubj.code} // ${activeSubj.archetype.toUpperCase()}</span>
        <span class="subject-bio-real">${activeSubj.icon} ${activeSubj.realName}</span>
      </div>
      <div>${activeSubj.backstory}</div>
      <div class="subject-bio-quote">${activeSubj.quote}</div>
    </div>
  ` : "";

  // Title screen views (Oct 30): "main" = pick a character + start; "shop" and "extras" sit behind buttons.
  if (window.titleViewNext) { window.titleView = window.titleViewNext; window.titleViewNext = null; }
  const view = window.titleView || "main";
  const startAge = meta.startDecade || 40;
  const backBtn = `<button class="t-style-btn title-back-btn" id="title-back-btn">◀ BACK</button>`;
  let bodyHtml = "";
  if (view === "shop") {
    bodyHtml = `
      <div class="title-subhead">🪙 401(k) SHOP <span class="title-subnote">Permanent upgrades. You have <b>${meta.coins}k</b>.</span></div>
      <div class="shop-list">${shopRowsHtml}</div>
      <div class="title-secondary">${backBtn}</div>`;
  } else if (view === "leaders") {
    bodyHtml = `
      <div class="title-subhead">🏆 LEADERBOARD</div>
      <div id="title-leaderboard"></div>
      <div class="title-secondary">${backBtn}</div>`;
  } else if (view === "credits") {
    const C = window.CREDITS || { title: "CREDITS", sections: [], closing: "" };
    const secs = C.sections.map(sec => `
      <div class="credit-sec">
        <div class="credit-role">${sec.role}</div>
        ${sec.names.map(n => `<div class="credit-name">${n}</div>`).join("")}
      </div>`).join("");
    bodyHtml = `
      <div class="title-subhead">🎬 ${C.title}</div>
      <div class="credits-list">${secs}</div>
      <div class="credit-closing">${C.closing}</div>
      <div class="title-secondary">${backBtn}</div>`;
  } else if (view === "extras") {
    bodyHtml = `
      <div class="title-subhead">✨ EXTRAS</div>
      <div class="title-style-switcher"><span>START AT:</span>${decadeBtnsHtml}</div>
      <div class="title-style-switcher" style="margin-top:6px;"><span>LOCATION:</span>${stageBtnsHtml}</div>
      <div class="title-secondary">
        <button class="t-style-btn" id="title-lore-btn">📖 LORE</button>
        <button class="t-style-btn" id="title-changelog-btn">📜 PATCH NOTES</button>
        <button class="t-style-btn" id="title-credits-btn">🎬 CREDITS</button>
        <button class="t-style-btn" id="title-art-test-btn">🎨 ART TEST</button>
        ${backBtn}
      </div>`;
  } else {
    bodyHtml = `
      <div class="title-meta-line">🏅 Best: age ${Math.floor(meta.bestAge || 40)} &nbsp;·&nbsp; 🪙 ${meta.coins}k saved</div>
      <div class="dossier-chars-grid">${charCardsHtml}</div>
      <div class="title-footer">
        ${resumeBannerHtml}
        <button class="cta-btn clock-in-btn" id="title-clockin-btn">☕ START${startAge !== 40 ? ` AT AGE ${startAge}` : ""}</button>
      </div>
      <div class="title-secondary">
        <button class="t-style-btn" id="title-shop-btn">🪙 401(k) SHOP</button>
        <button class="t-style-btn" id="title-controls-btn">⚙️ OPTIONS</button>
        <button class="t-style-btn" id="title-extras-btn">✨ EXTRAS</button>
        <button class="t-style-btn" id="title-leaders-btn">🏆 LEADERBOARD</button>
      </div>`;
  }

  modal.innerHTML = `
    <div class="modal-card title-box title-clean" data-view="${view}">
      <h1 class="game-logo">MIDLIFE SURVIVORS</h1>
      <p class="game-tagline">Survive from 40 to 100. Death is patient.</p>
      ${bodyHtml}
      <div class="title-version">${verInfo.displayVersion}</div>
    </div>
  `;

  const goView = v => { window.titleView = v; sfx("pick"); renderTitleModal(scene); };
  const shopBtn = document.getElementById("title-shop-btn");
  if (shopBtn) bindNavItem(shopBtn, 10, () => goView("shop"));
  const extrasBtn = document.getElementById("title-extras-btn");
  if (extrasBtn) bindNavItem(extrasBtn, 10, () => goView("extras"));
  const leadersBtn = document.getElementById("title-leaders-btn");
  if (leadersBtn) bindNavItem(leadersBtn, 10, () => goView("leaders"));
  if (view === "leaders" && window.lbRenderInto) window.lbRenderInto(document.getElementById("title-leaderboard"), null);
  const creditsBtn = document.getElementById("title-credits-btn");
  if (creditsBtn) bindNavItem(creditsBtn, 10, () => goView("credits"));
  const artTestBtn = document.getElementById("title-art-test-btn");
  if (artTestBtn) bindNavItem(artTestBtn, 10, () => { window.location.href = "art-test.html"; });
  const backEl = document.getElementById("title-back-btn");
  if (backEl) bindNavItem(backEl, 10, () => goView(view === "credits" ? "extras" : "main"), view !== "main");

  // Row 0: Character Cards
  modal.querySelectorAll(".dossier-char").forEach(el => {
    const chId = el.dataset.char;
    bindNavItem(el, 0, () => {
      const ch = CHARACTERS.find(c => c.id === chId);
      if (!ch) return;
      if (meta.unlockedChars[ch.id]) {
        meta.selectedChar = ch.id; saveMeta(meta); sfx("pick");
        renderTitleModal(scene, `[data-char="${chId}"]`); updateHUD();
      } else if (meta.coins >= ch.cost) {
        meta.coins -= ch.cost; meta.unlockedChars[ch.id] = true; meta.selectedChar = ch.id;
        saveMeta(meta); sfx("levelUp");
        renderTitleModal(scene, `[data-char="${chId}"]`); updateHUD();
      } else {
        sfx("hurt");
      }
    });
  });

  // Row 1: Decade Checkpoints
  modal.querySelectorAll("[data-dec]").forEach(btn => {
    if (btn.disabled) return;
    const d = Number(btn.dataset.dec);
    bindNavItem(btn, 1, () => {
      if ((meta.unlockedDecades || [40]).includes(d)) {
        meta.startDecade = d;
        saveMeta(meta);
        sfx("pick");
        renderTitleModal(scene, `[data-dec="${d}"]`);
      }
    });
  });

  // Row 2: Life Stage / Environment Selector
  modal.querySelectorAll("[data-stage]").forEach(btn => {
    if (btn.disabled) return;
    const stId = btn.dataset.stage;
    bindNavItem(btn, 2, () => {
      meta.selectedStage = stId;
      saveMeta(meta);
      sfx("pick");
      renderTitleModal(scene, `[data-stage="${stId}"]`);
      updateHUD();
    });
  });

  // Rows 3..6: 401(k) Shop Upgrades
  modal.querySelectorAll(".shop-row").forEach((el, idx) => {
    const shopId = el.dataset.shop;
    bindNavItem(el, 3 + idx, () => {
      const item = META_SHOP.find(it => it.id === shopId);
      if (!item) return;
      const rank = meta.ranks[item.id] || 0;
      const cost = item.baseCost * (rank + 1);
      if (rank < item.maxRank && meta.coins >= cost) {
        meta.coins -= cost; meta.ranks[item.id] = rank + 1;
        saveMeta(meta); sfx("billPaid");
        renderTitleModal(scene, `[data-shop="${shopId}"]`); updateHUD();
      } else {
        sfx("hurt");
      }
    });
  });

  // Row 7: Visual Style Switcher + Input & Controls Config Button
  modal.querySelectorAll("[data-v]").forEach(btn => {
    const v = Number(btn.dataset.v);
    bindNavItem(btn, 7, () => {
      window.viewModeIdx = v;
      applyViewMode(scene);
      sfx("pick");
      renderTitleModal(scene, `[data-v="${v}"]`);
    });
  });

  const titleCtrlBtn = document.getElementById("title-controls-btn");
  if (titleCtrlBtn) {
    bindNavItem(titleCtrlBtn, 10, () => {
      sfx("pick");
      openControlsModal(scene);
    });
  }

  const titleLoreBtn = document.getElementById("title-lore-btn");
  if (titleLoreBtn) {
    bindNavItem(titleLoreBtn, 7, () => {
      sfx("pick");
      openLoreModal(scene, "mythos");
    });
  }

  const titleChangelogBtn = document.getElementById("title-changelog-btn");
  if (titleChangelogBtn) {
    bindNavItem(titleChangelogBtn, 7, () => {
      sfx("pick");
      openChangelogModal(scene);
    });
  }

  // Row 8: Resume Saved Run (if present)
  const resumeBtn = document.getElementById("title-resume-btn");
  if (resumeBtn) {
    bindNavItem(resumeBtn, 8, () => {
      if (window.resumeSavedRunFromTitle) window.resumeSavedRunFromTitle();
    }, true);
  }

  // Row 9: Clock In / Start New Run (Default focus if no saved run)
  const clockBtn = document.getElementById("title-clockin-btn");
  bindNavItem(clockBtn, 9, () => {
    if (startFromTitle) startFromTitle();
  }, !resumeBtn && view === "main");

  window.menuNav.refresh(preserveFocusSelector);
}

function hideTitleModal() {
  window.titleView = "main";
  const modal = document.getElementById("title-modal");
  if (modal) modal.classList.add("hidden");
}

function renderGameOverModal(scene, cause, isWin) {
  const modal = document.getElementById("gameover-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const isCentennial = isWin && currentAge >= 99.5;
  const runScore = window.computeRunScore ? window.computeRunScore(currentAge, runStartAge, runKills, runCoins, isCentennial) : 0;
  const headline = isCentennial
    ? "👑 CENTENNIAL LEGEND! YOU REACHED AGE 100!"
    : (isWin ? "🏆 HAPPY 80th! YOU SURVIVED TO RETIREMENT!" : "📋 BURNOUT! SHIFT ENDED");

  modal.innerHTML = `
    <div class="modal-card gameover-box ${isWin ? "win-box" : "loss-box"}">
      <div class="modal-kicker">${isWin ? "OFFICIAL RETIREMENT & PENSION CERTIFICATE" : "HR EXIT INTERVIEW // PROGRESS SAVED"}</div>
      <h2 class="modal-title">${headline}</h2>
      <p class="gameover-cause">"${cause}"</p>
      <div class="gameover-stats">
        <div class="stat-pill"><span>REACHED AGE</span><b>${currentAge.toFixed(1)} (Best: ${(meta.bestAge || currentAge).toFixed(1)})</b></div>
        <div class="stat-pill"><span>SENIORITY</span><b>Level ${level}</b></div>
        <div class="stat-pill"><span>401(k) SAVED</span><b>+${runCoins}k (Bank: ${meta.coins}k)</b></div>
      </div>
      <div class="score-panel">
        <div class="score-big">SCORE <b>${runScore.toLocaleString()}</b></div>
        <div class="score-break">${Math.max(0, currentAge - runStartAge).toFixed(1)} years · ${runKills} beaten · ${runCoins}k saved</div>
        <form class="score-form" id="score-form" autocomplete="off">
          <input id="score-name" maxlength="16" placeholder="Your name" value="${(window.lbSavedName ? window.lbSavedName() : "").replace(/"/g, "")}" aria-label="Your name for the leaderboard">
          <button type="submit" class="cta-btn score-post-btn" id="score-post-btn">🏆 POST SCORE</button>
        </form>
        <div class="score-msg" id="score-msg"></div>
        <div id="go-leaderboard"></div>
      </div>
      <div class="gameover-actions">
        <button class="cta-btn" id="go-retry-btn">🔄 QUICK RETRY (Space / Enter / A)</button>
        <button class="cta-btn secondary-btn" id="go-shop-btn">🪙 401(k) SHOP</button>
      </div>
      <div class="nav-hint-bar">
        <span><b>◀▶ / ▲▼</b> Arrow / D-Pad / Mouse: Switch Option</span>
        <span><b>Space / Enter / Click / A</b>: Confirm</span>
      </div>
    </div>
  `;

  // Leaderboard: type a name, post once per run. Typing must not trigger game shortcuts (WASD, M, Space).
  const nameInput = document.getElementById("score-name");
  const scoreForm = document.getElementById("score-form");
  const scoreMsg = document.getElementById("score-msg");
  ["keydown", "keyup", "keypress"].forEach(t => nameInput.addEventListener(t, e => e.stopPropagation()));
  nameInput.addEventListener("pointerdown", e => e.stopPropagation());
  let posted = false;
  scoreForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (posted) return;
    const name = window.lbCleanName(nameInput.value);
    if (!name) { scoreMsg.textContent = "Type a name first."; nameInput.focus(); return; }
    posted = true;
    window.lbSaveName(name);
    nameInput.blur();
    document.getElementById("score-post-btn").disabled = true;
    scoreMsg.textContent = "Posting…";
    const entry = { name, score: runScore, age: +currentAge.toFixed(2), startAge: runStartAge, character: meta.selectedChar, version: (getVersionInfo().version || "") };
    const res = await window.lbSubmit(entry);
    scoreMsg.textContent = res.online ? "Posted to the online leaderboard!" : (window.lbConfigured() ? "Couldn't reach the online board. Saved on this device." : "Saved on this device.");
    sfx("levelUp");
    window.lbRenderInto(document.getElementById("go-leaderboard"), entry);
  });
  document.getElementById("score-post-btn").addEventListener("pointerdown", e => e.stopPropagation());
  window.lbRenderInto(document.getElementById("go-leaderboard"), null);

  bindNavItem(document.getElementById("go-retry-btn"), 0, () => {
    sfx("pick");
    modal.classList.add("hidden");
    scene.scene.restart();
  }, true);

  bindNavItem(document.getElementById("go-shop-btn"), 0, () => {
    sfx("pick");
    modal.classList.add("hidden");
    titleSeen = false;
    window.titleViewNext = "shop"; // land on the Shop view, not the main title
    scene.scene.restart();
  }, false);

  window.menuNav.refresh();
}

function hideAllModals() {
  window.rebindState = null;
  window.controlsModalOpen = false;
  window.changelogModalOpen = false;
  window.loreModalOpen = false;
  ["lore-modal", "changelog-modal", "controls-modal", "levelup-modal", "pause-modal", "retire80-modal", "title-modal", "gameover-modal"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}
