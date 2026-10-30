// "Chameleon + Corporate Satire" HTML/CSS UI Manager (`src/ui.js`).
// Combines Option A (morphs live between Retro 16-Bit, Diablo 3/4 Indie, and Fortnite AAA when you press [V])
// with Option C (satirical Corporate / Adulting OS: Employee ID badge, Decade Timeline, Perk Vouchers, Outlook Boss Alerts).

const UPGRADE_META = {
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
  "EVOLVE: Cold Brew Concentrate": { icon: "⚡☕", tag: "✨ EVOLUTION",   rarity: "evo" },
  "EVOLVE: Unhinged Pun Storm":    { icon: "🌩️😂", tag: "✨ EVOLUTION",   rarity: "evo" },
  "EVOLVE: Healthy Boundaries":    { icon: "🛡️🛑", tag: "✨ EVOLUTION",   rarity: "evo" }
};

const CHAR_ICONS = {
  nineToFiver: "☕",
  photographer: "📸",
  gradStudent: "🎓"
};

const THEME_LABELS = [
  "CORP-OS v1.98 // 16-BIT PIXEL",
  "SANCTUARY HR // DIABLO 3/4",
  "MIDLIFE ROYALE // AAA 3D"
];

let uiScene = null;

function initGameUI(scene) {
  uiScene = scene;
  const root = document.getElementById("ui-layer");
  if (!root) return;

  root.innerHTML = `
    <!-- TOP HUD BAR (3 Peripheral Zones) -->
    <div class="hud-top">
      <!-- Zone 1: Top-Left Employee ID & Vitality Pod -->
      <div class="hud-pod hud-left">
        <div class="id-header">
          <div class="id-avatar" id="hud-avatar">☕</div>
          <div class="id-titles">
            <div class="id-dept" id="hud-dept">CORP-OS v1.98</div>
            <div class="id-name" id="hud-charname">The 9-to-5er</div>
          </div>
          <div class="id-lv" id="hud-lv">LV 1</div>
        </div>
        <div class="bar-row">
          <span class="bar-label">HP</span>
          <div class="bar-track hp-track">
            <div class="bar-fill hp-fill" id="hud-hp-fill" style="width:100%"></div>
            <span class="bar-text" id="hud-hp-text">14 / 14</span>
          </div>
        </div>
        <div class="bar-row">
          <span class="bar-label">XP</span>
          <div class="bar-track xp-track">
            <div class="bar-fill xp-fill" id="hud-xp-fill" style="width:0%"></div>
            <span class="bar-text" id="hud-xp-text">0 / 3</span>
          </div>
        </div>
        <div class="loadout-row" id="hud-loadout"></div>
      </div>

      <!-- Zone 2: Top-Center Decade Timeline (Age 40 -> 50) -->
      <div class="hud-pod hud-center">
        <div class="timeline-header">
          <span class="timeline-title">DECADE SURVIVAL TIMELINE</span>
          <span class="timeline-age" id="hud-age">AGE 40.0</span>
        </div>
        <div class="timeline-track">
          <div class="timeline-fill" id="hud-age-fill" style="width:0%"></div>
          <div class="milestone" style="left:0%"><span>40</span></div>
          <div class="milestone boss-pip" style="left:20%" title="Age 42: Performance Review"><span>42 📋</span></div>
          <div class="milestone boss-pip" style="left:50%" title="Age 45: Mortgage Refinance"><span>45 🏦</span></div>
          <div class="milestone boss-pip" style="left:80%" title="Age 48: Midlife Crisis"><span>48 🏎️</span></div>
          <div class="milestone win-pip" style="left:100%" title="Age 50: AARP Victory!"><span>50 🏆</span></div>
        </div>
      </div>

      <!-- Zone 3: Top-Right 401(k) Ticker & 3-Way Camera Switcher -->
      <div class="hud-pod hud-right">
        <div class="coin-pill">
          <span class="coin-icon">🪙</span>
          <span class="coin-label">401(k):</span>
          <span class="coin-val" id="hud-coins">0k</span>
        </div>
        <div class="style-pill" id="hud-style-pill" title="Press V or click to switch visual engine!">
          <span class="style-key">[V]</span>
          <button class="style-opt" data-idx="0">16-BIT</button>
          <button class="style-opt" data-idx="1">DIABLO 3/4</button>
          <button class="style-opt" data-idx="2">AAA 3D</button>
        </div>
        <div class="util-btns">
          <button class="util-btn" id="hud-pause-btn" title="Pause (P / Esc)">⏸ [P]</button>
          <button class="util-btn" id="hud-mute-btn" title="Mute Audio (M)">🔊 [M]</button>
        </div>
      </div>
    </div>

    <!-- OUTLOOK-STYLE BOSS CALENDAR ALERT TOAST -->
    <div class="boss-toast hidden" id="boss-toast">
      <div class="toast-icon">📅</div>
      <div class="toast-body">
        <div class="toast-sub">URGENT CALENDAR REMINDER // MANDATORY ATTENDANCE</div>
        <div class="toast-title" id="boss-toast-title">BOSS APPROACHING!</div>
      </div>
    </div>

    <!-- MODAL 1: LEVEL-UP / HR PERK VOUCHER (3 Vertical Collectible Cards) -->
    <div class="ui-modal hidden" id="levelup-modal">
      <div class="modal-card levelup-box">
        <div class="modal-kicker" id="lv-kicker">HR BENEFITS DEPARTMENT // FORM W-40</div>
        <h2 class="modal-title" id="lv-title">LEVEL UP! SELECT ONE PERK VOUCHER</h2>
        <div class="modal-sub">Click a card, press <b>1 / 2 / 3</b>, or use Controller D-Pad + <b>A</b></div>
        <div class="perk-cards-grid" id="lv-cards"></div>
      </div>
    </div>

    <!-- MODAL 2: PAUSE OVERLAY -->
    <div class="ui-modal hidden" id="pause-modal">
      <div class="modal-card pause-box">
        <div class="modal-kicker">OUT OF OFFICE AUTO-REPLY</div>
        <h2 class="modal-title">ON BREAK (PAUSED)</h2>
        <p class="modal-sub">Take a breath, stretch your lower back, and hydrate.</p>
        <button class="cta-btn" id="pause-resume-btn">RESUME SHIFT (P / Esc / Start)</button>
      </div>
    </div>

    <!-- MODAL 3: TITLE SCREEN (Executive Dossier & 401(k) Shop) -->
    <div class="ui-modal hidden" id="title-modal"></div>

    <!-- MODAL 4: GAME OVER / RETIREMENT VICTORY CERTIFICATE -->
    <div class="ui-modal hidden" id="gameover-modal"></div>
  `;

  // Wire top-right style buttons
  root.querySelectorAll(".style-opt").forEach(btn => {
    btn.addEventListener("pointerdown", e => {
      e.stopPropagation();
      unlockAudio();
      window.viewModeIdx = Number(btn.dataset.idx);
      applyViewMode(uiScene);
      sfx("pick");
      if (titleOpen) renderTitleModal(uiScene);
    });
  });

  document.getElementById("hud-pause-btn").addEventListener("pointerdown", e => {
    e.stopPropagation(); unlockAudio(); togglePause(uiScene);
  });
  document.getElementById("hud-mute-btn").addEventListener("pointerdown", e => {
    e.stopPropagation(); unlockAudio(); toggleMute();
    document.getElementById("hud-mute-btn").textContent = isMuted() ? "🔇 [M]" : "🔊 [M]";
  });
  document.getElementById("pause-resume-btn").addEventListener("pointerdown", e => {
    e.stopPropagation(); unlockAudio(); togglePause(uiScene);
  });

  window.syncUITheme();
}

// Switch the entire UI theme between 0 (Retro 16-Bit), 1 (Diablo 3/4 Indie), and 2 (Fortnite AAA)!
window.syncUITheme = function() {
  const root = document.getElementById("ui-layer");
  if (!root) return;
  const idx = window.viewModeIdx || 0;
  root.dataset.theme = String(idx);
  const dept = document.getElementById("hud-dept");
  if (dept) dept.textContent = THEME_LABELS[idx] || THEME_LABELS[0];
  root.querySelectorAll(".style-opt").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.idx) === idx);
  });
};

// Update the live HUD every frame (or whenever stats/HP/XP/Age change)
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
  const agePct = Math.max(0, Math.min(100, ((currentAge - 40) / 10) * 100));
  document.getElementById("hud-age-fill").style.width = `${agePct}%`;

  document.getElementById("hud-coins").textContent = `${meta.coins}k`;

  // Render active weapons & passives badges
  const badges = [];
  badges.push(`<span class="perk-badge" title="Coffee Splash">${stats.coldBrew ? "⚡☕ Cold Brew" : "☕ Coffee"}</span>`);
  if (stats.dadJoke) badges.push(`<span class="perk-badge" title="Dad Joke">${stats.punStorm ? "🌩️😂 Pun Storm" : "😂 Dad Joke"}</span>`);
  if (stats.wordNo)  badges.push(`<span class="perk-badge" title="The Word No">${stats.healthyBoundaries ? "🛡️🛑 Boundaries" : '🛑 "No."'}</span>`);
  if (stats.hasShoes)   badges.push(`<span class="perk-badge passive">👟</span>`);
  if (stats.hasSleep)   badges.push(`<span class="perk-badge passive">😴</span>`);
  if (stats.hasGlasses) badges.push(`<span class="perk-badge passive">👓</span>`);
  const loadoutEl = document.getElementById("hud-loadout");
  const html = badges.join("");
  if (loadoutEl.dataset.prev !== html) {
    loadoutEl.innerHTML = html;
    loadoutEl.dataset.prev = html;
  }
}

// Show Outlook-style calendar reminder banner when a Boss spawns
function showBossToastUI(bossName) {
  const toast = document.getElementById("boss-toast");
  const title = document.getElementById("boss-toast-title");
  if (!toast || !title) return;
  title.textContent = `MANDATORY MEETING: ${bossName.toUpperCase()}!`;
  toast.classList.remove("hidden");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add("hidden"), 3200);
}

// Show/hide Pause modal
function setPauseModalVisible(vis) {
  const el = document.getElementById("pause-modal");
  if (el) el.classList.toggle("hidden", !vis);
}

// Show the 3-card vertical Level-Up screen!
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
    const card = document.createElement("div");
    card.className = `perk-card rarity-${info.rarity}`;
    card.innerHTML = `
      <div class="perk-ribbon">${info.tag}</div>
      <div class="perk-icon">${info.icon}</div>
      <div class="perk-name">${up.name}</div>
      <div class="perk-desc">${up.text}</div>
      <div class="perk-key">PRESS [${i + 1}]</div>
    `;
    card.addEventListener("pointerenter", () => highlightCard(i));
    card.addEventListener("pointerdown", e => {
      e.stopPropagation();
      unlockAudio();
      modal.classList.add("hidden");
      onPick(up);
    });
    grid.appendChild(card);
    return card;
  });

  function highlightCard(idx) {
    if (levelMenu) levelMenu.sel = idx;
    cardEls.forEach((el, j) => el.classList.toggle("selected", j === idx));
  }

  modal.classList.remove("hidden");
  return {
    highlight: highlightCard,
    close: () => modal.classList.add("hidden")
  };
}

// Render the Title Screen ("Executive Dossier & 401(k) Portal")
function renderTitleModal(scene) {
  const modal = document.getElementById("title-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const charCardsHtml = CHARACTERS.map(ch => {
    const owned = !!meta.unlockedChars[ch.id];
    const sel = meta.selectedChar === ch.id;
    const status = sel ? "✓ ACTIVE ARCHETYPE" : (owned ? "CLICK TO SELECT" : `🔒 UNLOCK (${ch.cost}k)`);
    return `
      <div class="dossier-char ${sel ? "selected" : ""} ${owned ? "owned" : "locked"}" data-char="${ch.id}">
        <div class="char-emoji">${CHAR_ICONS[ch.id] || "☕"}</div>
        <div class="char-title">${ch.name}</div>
        <div class="char-desc">${ch.tagline}</div>
        <div class="char-badge">${status}</div>
      </div>
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
        <button class="shop-buy-btn">${maxed ? "MAXED OUT" : `INVEST ${cost}k`}</button>
      </div>
    `;
  }).join("");

  modal.innerHTML = `
    <div class="modal-card title-box">
      <div class="title-top-banner">
        <span class="dossier-stamp">CONFIDENTIAL // FORM 40-50</span>
        <span class="dossier-balance">🪙 401(k) Portfolio: <b>${meta.coins} Coins</b></span>
      </div>
      <h1 class="game-logo">MIDLIFE SURVIVORS</h1>
      <p class="game-tagline">Dodge Bills, Smash Office Ferns for Leftover Pizza, Climb Mezzanines & Survive from Age 40 to 50!</p>

      <div class="section-label">1. SELECT YOUR EMPLOYEE ARCHETYPE</div>
      <div class="dossier-chars-grid">${charCardsHtml}</div>

      <div class="section-label">2. 401(k) PERMANENT RETIREMENT UPGRADES</div>
      <div class="shop-list">${shopRowsHtml}</div>

      <div class="title-footer">
        <div class="title-style-switcher">
          <span>VISUAL ENGINE [V]:</span>
          <button class="t-style-btn ${window.viewModeIdx === 0 ? "active" : ""}" data-v="0">👾 16-Bit Retro</button>
          <button class="t-style-btn ${window.viewModeIdx === 1 ? "active" : ""}" data-v="1">🕯️ Diablo 3/4 Indie</button>
          <button class="t-style-btn ${window.viewModeIdx === 2 ? "active" : ""}" data-v="2">🚀 Fortnite AAA 3D</button>
        </div>
        <button class="cta-btn clock-in-btn" id="title-clockin-btn">☕ CLOCK IN FOR YOUR 40s (Space / Start)</button>
      </div>
    </div>
  `;

  modal.querySelectorAll(".dossier-char").forEach(el => {
    el.addEventListener("pointerdown", e => {
      e.stopPropagation();
      unlockAudio();
      const ch = CHARACTERS.find(c => c.id === el.dataset.char);
      if (!ch) return;
      if (meta.unlockedChars[ch.id]) {
        meta.selectedChar = ch.id; saveMeta(meta); sfx("pick"); renderTitleModal(scene); updateHUD();
      } else if (meta.coins >= ch.cost) {
        meta.coins -= ch.cost; meta.unlockedChars[ch.id] = true; meta.selectedChar = ch.id;
        saveMeta(meta); sfx("levelUp"); renderTitleModal(scene); updateHUD();
      } else {
        sfx("hurt");
      }
    });
  });

  modal.querySelectorAll(".shop-row").forEach(el => {
    el.addEventListener("pointerdown", e => {
      e.stopPropagation();
      unlockAudio();
      const item = META_SHOP.find(it => it.id === el.dataset.shop);
      if (!item) return;
      const rank = meta.ranks[item.id] || 0;
      const cost = item.baseCost * (rank + 1);
      if (rank < item.maxRank && meta.coins >= cost) {
        meta.coins -= cost; meta.ranks[item.id] = rank + 1;
        saveMeta(meta); sfx("billPaid"); renderTitleModal(scene); updateHUD();
      } else {
        sfx("hurt");
      }
    });
  });

  modal.querySelectorAll(".t-style-btn").forEach(btn => {
    btn.addEventListener("pointerdown", e => {
      e.stopPropagation();
      unlockAudio();
      window.viewModeIdx = Number(btn.dataset.v);
      applyViewMode(scene);
      sfx("pick");
      renderTitleModal(scene);
    });
  });

  document.getElementById("title-clockin-btn").addEventListener("pointerdown", e => {
    e.stopPropagation();
    if (startFromTitle) startFromTitle();
  });
}

function hideTitleModal() {
  const modal = document.getElementById("title-modal");
  if (modal) modal.classList.add("hidden");
}

// Render Game Over ("Exit Interview") or Age 50 Victory ("AARP Certificate")
function renderGameOverModal(scene, cause, isWin) {
  const modal = document.getElementById("gameover-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  modal.innerHTML = `
    <div class="modal-card gameover-box ${isWin ? "win-box" : "loss-box"}">
      <div class="modal-kicker">${isWin ? "OFFICIAL AARP RETIREMENT CERTIFICATE" : "HR EXIT INTERVIEW // INCIDENT REPORT"}</div>
      <h2 class="modal-title">${isWin ? "🏆 YOU SURVIVED YOUR 40s!" : "📋 BURNOUT! SHIFT ENDED"}</h2>
      <p class="gameover-cause">"${cause}"</p>
      <div class="gameover-stats">
        <div class="stat-pill"><span>FINAL AGE</span><b>${currentAge.toFixed(1)}</b></div>
        <div class="stat-pill"><span>SENIORITY</span><b>Level ${level}</b></div>
        <div class="stat-pill"><span>RUN 401(k)</span><b>+${runCoins}k (Total: ${meta.coins}k)</b></div>
      </div>
      <div class="gameover-actions">
        <button class="cta-btn" id="go-retry-btn">🔄 CLOCK BACK IN (Space / A)</button>
        <button class="cta-btn secondary-btn" id="go-shop-btn">🪙 VISIT 401(k) SHOP & DOSSIER</button>
      </div>
    </div>
  `;

  document.getElementById("go-retry-btn").addEventListener("pointerdown", e => {
    e.stopPropagation();
    modal.classList.add("hidden");
    scene.scene.restart();
  });
  document.getElementById("go-shop-btn").addEventListener("pointerdown", e => {
    e.stopPropagation();
    modal.classList.add("hidden");
    titleSeen = false;
    scene.scene.restart();
  });
}

function hideAllModals() {
  ["levelup-modal", "pause-modal", "title-modal", "gameover-modal"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}
