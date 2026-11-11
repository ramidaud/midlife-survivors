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
  "EVOLVE: Healthy Boundaries":    { icon: "🛡️🛑", tag: "✨ EVOLUTION",   rarity: "evo" },
  "Leftover Friday Pizza":         { icon: "🍕", tag: "BOOST", rarity: "boost" },
  "PTO Day":                       { icon: "🌴", tag: "BOOST", rarity: "boost" },
  "Fanny Pack":                    { icon: "👝", tag: "BOOST", rarity: "boost" },
  "Standing Desk":                 { icon: "🧍", tag: "BOOST", rarity: "boost" },
  "Focus Block":                   { icon: "📅", tag: "BOOST", rarity: "boost" },
  "HR Appreciation Snacks":        { icon: "🥨", tag: "BOOST", rarity: "boost" }
};

if (window.LOADOUT_META) Object.assign(UPGRADE_META, window.LOADOUT_META); // the loadout-expansion cards (src/data/loadout.js)

// ---------- Loadout styles and slots (Nov 4) ----------
// A tiny pixel glyph for each play style: a plus (Healing), a shield (Shield), a lightning bolt (Offense), a brick wall (Defense).
const STYLE_GLYPHS = {
  healing: ["..##..", "..##..", "######", "######", "..##..", "..##.."],
  shield:  ["######", "#....#", "#.##.#", "#.##.#", ".#..#.", "..##.."],
  offense: ["...##.", "..##..", ".#####", "#####.", "..##..", ".##..."],
  defense: ["###.##", "......", "#.####", "......", "###.##", "......"]
};
function styleGlyph(cat, px) {
  const B = window.LOADOUT_ICONS && LOADOUT_ICONS.badges, bi = B && B.map[cat];
  if (window.USE_PIXEL_ICONS && bi !== undefined) { // ChatGPT's 12 px badges (Nov 4); px 2 = 12 px, the art's own size
    const s = 6 * (px || 2);
    return `<span class="style-glyph" style="display:inline-block;width:${s}px;height:${s}px;background:url(${B.image}?v=${window.BUILD || 1}) -${bi * s}px 0/${B.columns * s}px ${s}px;image-rendering:pixelated" aria-hidden="true"></span>`;
  }
  const g = STYLE_GLYPHS[cat]; if (!g) return "";
  const p = px || 2, rects = [];
  g.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === "#") rects.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`); }));
  return `<svg class="style-glyph" width="${6 * p}" height="${6 * p}" viewBox="0 0 6 6" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true">${rects.join("")}</svg>`;
}
window.styleGlyph = styleGlyph;
function ensureLoadoutCss() {
  if (document.getElementById("loadout-css")) return;
  const st = document.createElement("style"); st.id = "loadout-css";
  st.textContent = `
.perk-card{position:relative}
.perk-card[data-style]::before{content:"";position:absolute;left:6px;right:6px;top:0;height:4px;border-radius:0 0 3px 3px;background:var(--sc)}
.perk-style{position:absolute;top:-10px;right:8px;display:inline-flex;align-items:center;gap:4px;padding:3px 6px 3px 5px;border-radius:3px;background:var(--sc);color:var(--sink);font:9px/1 Silkscreen,monospace;letter-spacing:.05em;box-shadow:2px 2px 0 rgba(0,0,0,.45);z-index:2}
.perk-card:hover .perk-style,.perk-card.selected .perk-style{transform:translateY(-2px) rotate(-2deg)}
.perk-style .style-glyph{display:block}
.lo-build{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px 14px;margin:0 0 14px}
.lo-row{display:flex;align-items:center;gap:4px}
.lo-row b{font:9px Silkscreen,monospace;color:var(--ms-muted,#B8C0D4);letter-spacing:.05em;margin-right:3px}
.lo-slot .px-icon{display:block}
.lo-slot{position:relative;width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;font-size:15px;line-height:1;background:rgba(23,28,53,.88);border:1px solid rgba(131,168,154,.35);border-radius:4px;box-shadow:inset 0 -3px 0 var(--sc,transparent)}
.lo-slot.empty{border-style:dashed;border-color:rgba(184,192,212,.28);background:rgba(23,28,53,.4)}
.lo-slot.evo{border-color:#EF9347;box-shadow:inset 0 -3px 0 var(--sc,transparent),0 0 6px rgba(239,147,71,.6)}
.lo-tally{display:flex;gap:6px}
.lo-tally span{display:inline-flex;align-items:center;gap:3px;font:9px Silkscreen,monospace;color:var(--sc)}
.vs-hud .vs-loadout{flex-direction:column;align-items:flex-start;gap:3px}
.vs-hud .vs-loadout .lo-row{gap:3px}
.vs-hud .vs-loadout .lo-slot{width:22px;height:22px;font-size:13px;padding:0}
.vs-hud .vs-loadout .lo-slot.empty{opacity:.55}
@media (max-width:760px){.vs-hud .vs-loadout .lo-slot{width:18px;height:18px;font-size:11px;border-radius:3px}.vs-hud .vs-loadout .lo-row{gap:2px}.perk-cards-grid{gap:14px!important}.perk-style{top:-8px;font-size:8px}.lo-slot{width:22px;height:22px;font-size:13px}.lo-build{gap:5px 10px;margin-bottom:12px}}`;
  document.head.appendChild(st);
}
// Your 6 weapon slots and 6 passive slots, filled or empty, each underlined in its style color.
function loadoutSlotsHtml(opts) {
  const L = window.LOADOUT; if (!L || !stats) return "";
  const h = L.held(stats), o = opts || {};
  const slot = (it, evo) => `<span class="lo-slot${evo ? " evo" : ""}" style="--sc:${L.cats[it.cat].color}" title="${L.cats[it.cat].label}">${slotIcon(it, evo, o.labels ? 22 : 16)}</span>`;
  const empty = n => Array.from({ length: Math.max(0, n) }, () => `<span class="lo-slot empty"></span>`).join("");
  const wpn = h.weapons.map(w => slot(w, w.evo && w.evo(stats))).join("") + empty(L.weaponSlots - h.weapons.length);
  const pas = h.passives.map(p => slot(p, false)).join("") + empty(L.passiveSlots - h.passives.length);
  let tally = "";
  if (o.tally) {
    const n = {}; h.weapons.concat(h.passives).forEach(it => { n[it.cat] = (n[it.cat] || 0) + 1; });
    tally = `<div class="lo-tally">${Object.keys(L.cats).filter(c => n[c]).map(c => `<span style="--sc:${L.cats[c].color}">${styleGlyph(c, 2)}${n[c]}</span>`).join("")}</div>`;
  }
  return `<div class="lo-row">${o.labels ? "<b>WEAPONS</b>" : ""}${wpn}</div><div class="lo-row">${o.labels ? "<b>PASSIVES</b>" : ""}${pas}</div>${tally}`;
}
window.loadoutSlotsHtml = loadoutSlotsHtml;

// Pixel icon from the ChatGPT atlases (src/data/ui-icons.js), or the emoji if there isn't one.
// size: displayed pixels (the atlases are 32px per icon; whole-number multiples stay crisp).
function atlasIcon(I, idx, size) {
  const s = size || 32, col = idx % I.columns, row = Math.floor(idx / I.columns);
  return `<span class="px-icon" style="width:${s}px;height:${s}px;background-image:url(${I.image}?v=${window.BUILD || 1});` +
    `background-size:${I.columns * s}px ${I.rows * s}px;background-position:-${col * s}px -${row * s}px" role="img" aria-label=""></span>`;
}
// Single-image icons (ChatGPT, Nov 5): Lounge weapons. Keyed by weapon id (HUD) and card name (level-up cards).
const SOLO_ICONS = { micDrop: "assets/weapons/icon-mic-drop-v1-alpha.png", sayCheese: "assets/weapons/icon-say-cheese-v1-alpha.png" };
const SOLO_CARDS = { "Unlock: Mic Drop": "micDrop", "Encore": "micDrop", "Unlock: Say Cheese": "sayCheese", "Burst Mode": "sayCheese" };
const soloIcon = (id, size) => { const s = size || 32; return `<img class="px-icon" src="${SOLO_ICONS[id]}?v=${window.BUILD || 1}" width="${s}" height="${s}" style="image-rendering:pixelated" alt="">`; };
function pixelIcon(kind, id, emoji, size) {
  if (kind === "card" && SOLO_CARDS[id] && window.USE_PIXEL_ICONS) return soloIcon(SOLO_CARDS[id], size);
  if (kind === "char" && id === "coldWarCowboy") { const s = size || 32; return `<img class="px-icon" src="assets/characters/cold-war-cowboy-badge-v3.png?v=${window.BUILD || 1}" width="${s}" height="${s}" style="image-rendering:pixelated" alt="">`; }
  const I = window.UI_ICONS, L = window.LOADOUT_ICONS;
  if (!window.USE_PIXEL_ICONS || !I) return emoji;
  if (kind !== "char" && I.cards[id] === undefined && L && L.cards[id] !== undefined) return atlasIcon(L, L.cards[id], size); // loadout expansion cards
  const idx = kind === "char" ? I.characters[id] : (I.cards[id] ?? (emoji ? undefined : I.fallback));
  if (idx === undefined) return emoji;
  return atlasIcon(I, idx, size);
}
// "Pairs with" notes on level-up cards (Gemini Argon review, Nov 4): which passive evolves which weapon.
// Matches the evolution rules in src/data/upgrades.js and src/data/loadout.js. Add a line here with each new evolution.
const EVO_PAIRS = [
  ["comfyShoes", "unlockRemote", "TV Remote"], ["comfyShoes", "unlockNo", '"No."'], ["comfyShoes", "unlockChair", "Office Chair"],
  ["readingGlasses", "unlockSheet", "Spreadsheet"], ["readingGlasses", "unlockJoke", "Dad Joke"],
  ["goodSleep", "unlockPodcast", "Podcast"], ["goodSleep", null, "Coffee Splash"],
  ["mealPrep", "unlockCasserole", "Mom's Spaghetti"], ["cardigan", "unlockPhones", "Headphones"], ["bifocals", "unlockReplyAll", "Reply-All"],
  ["lumbar", "unlockOoo", "Out-of-Office"], ["fitnessTracker", "unlockSticky", "Sticky Notes"], ["multivitamin", "unlockThermo", "Thermostat Wars"]
];
// Weapon upgrade cards get the hint too (Nov 4, Rami: Ben starts with the Floppy Disk, so he never saw its Unlock card).
const EVO_UPGRADE_PASSIVE = {
  extraShot: "goodSleep", darkRoast: "goodSleep", longPour: "goodSleep", louderGroan: "readingGlasses", firmBoundaries: "comfyShoes",
  universalRemote: "comfyShoes", moreColumns: "readingGlasses", playbackSpeed: "goodSleep", secondHelping: "mealPrep", activeNoise: "cardigan",
  wd40: "comfyShoes", ccEveryone: "bifocals", extendedLeave: "lumbar", bulkPack: "fitnessTracker", crankAc: "multivitamin"
};
function evoPairNote(up) {
  if (!up || up.isEvolution) return "";
  const passiveId = EVO_UPGRADE_PASSIVE[up.id];
  if (passiveId) {
    const pas = (window.UPGRADES || []).find(u => u.id === passiveId);
    const have = typeof stats !== "undefined" && stats && typeof getRank === "function" && getRank(stats, passiveId) > 0;
    return pas ? "Pairs with " + pas.name + (have ? " ✓" : "") : "";
  }
  const asPassive = EVO_PAIRS.filter(p => p[0] === up.id).map(p => p[2]);
  // Nov 4 (Rami): "Evolves Mom's Spaghetti" on Meal Prep read like the card WAS the spaghetti. Say "pairs with" instead.
  if (asPassive.length) return "Pairs with " + asPassive.join(", ");
  const asWeapon = EVO_PAIRS.find(p => p[1] === up.id);
  if (asWeapon) { const pas = (window.UPGRADES || []).find(u => u.id === asWeapon[0]); return pas ? "Pairs with " + pas.name : ""; }
  return "";
}

// "Evolves next" notes (Nov 8, Rami picked A): try the card on a copy of your stats and see whether it
// unlocks an evolution now, or would after one more pick of the same card. Teaches "level your weapons
// and evolve them" instead of filling all six slots with weak ones. Boosts and evolutions are skipped.
function evoNextNote(up) {
  try {
    if (!up || up.isEvolution || up.isConsumable || typeof stats === "undefined" || !stats || !up.apply) return "";
    const evos = (window.UPGRADES || []).filter(u => u.isEvolution && u.when);
    const ready = s => new Set(evos.filter(u => { try { return u.when(s); } catch (e) { return false; } }).map(u => u.id));
    const copy = s => { let c; try { c = structuredClone(s); } catch (e) { c = Object.assign({}, s); } c.perkRanks = Object.assign({}, s.perkRanks || {}); return c; };
    const before = ready(stats);
    const once = copy(stats); up.apply(once);
    const now = evos.find(u => ready(once).has(u.id) && !before.has(u.id));
    if (now) return { soon: false, name: now.name.replace(/^EVOLVE:\s*/, "") };
    if (up.when && !up.when(once)) return "";
    const twice = copy(once); up.apply(twice);
    const later = evos.find(u => ready(twice).has(u.id) && !before.has(u.id));
    return later ? { soon: true, name: later.name.replace(/^EVOLVE:\s*/, "") } : "";
  } catch (e) { return ""; }
}

// HUD and build-screen slot icons: which atlas card stands for each loadout item (and its evolution).
const SLOT_CARDS = {
  coffee: ["Extra Shot", "EVOLVE: Cold Brew Concentrate"], dadJoke: ["Unlock: Dad Joke", "EVOLVE: Unhinged Pun Storm"],
  wordNo: ['Unlock: "No."', "EVOLVE: Healthy Boundaries"], remote: ["Unlock: The TV Remote", "EVOLVE: Smart TV"],
  sheet: ["Unlock: Spreadsheet", "EVOLVE: Pivot Table"], podcast: ["Unlock: Podcast at 2x", "EVOLVE: Binge Mode"],
  casserole: [null, "EVOLVE: Potluck"], headphones: [null, "EVOLVE: Do Not Disturb"], officeChair: [null, "EVOLVE: Executive Swivel"],
  replyAll: [null, "EVOLVE: Company-Wide Memo"], outOfOffice: [null, "EVOLVE: Sabbatical"], stickyNotes: [null, "EVOLVE: Wall of Post-its"],
  thermostat: [null, "EVOLVE: Polar Vortex"],
  comfyShoes: ["Comfortable Shoes"], goodSleep: ["Good Night's Sleep"], readingGlasses: ["Reading Glasses"], titaniumKnees: ["Titanium Knees"],
  execDelegation: ["Executive Delegation"], multivitamin: ["Multivitamin"], mealPrep: ["Meal Prep Sunday"], cardigan: ["Cardigan"],
  lumbar: ["Lumbar Support"], fitnessTracker: ["Fitness Tracker"], bifocals: ["Bifocals"]
};
function slotIcon(it, evo, size) {
  const emoji = evo ? it.evoIcon : it.icon, L = window.LOADOUT_ICONS;
  if (!window.USE_PIXEL_ICONS) return emoji;
  if (SOLO_ICONS[it.id]) return soloIcon(it.id, size);
  if (!evo && L && L.hud[it.id] !== undefined) return atlasIcon(L, L.hud[it.id], size); // the new weapons' framed HUD tiles
  const name = (SLOT_CARDS[it.id] || [])[evo ? 1 : 0];
  return name ? pixelIcon("card", name, emoji, size) : emoji;
}
window.pixelIcon = pixelIcon;

// Ben's boomerang is a Floppy Disk, so the Remote's cards are renamed while you play him (Nov 3).
function heroWord(t) {
  if (!t || typeof stats === "undefined" || !stats || !stats.floppy) return t;
  return String(t).replace(/The TV Remote/g, "The Floppy Disk").replace(/TV Remote/g, "Floppy Disk").replace(/Smart TV/g, "Zip Drive")
    .replace(/Universal Remote/g, "Double Density").replace(/remotes/g, "disks").replace(/Remote/g, "Floppy").replace(/remote/g, "disk");
}
window.heroWord = heroWord;

const CHAR_ICONS = {
  officeWorker: "☕",
  photographer: "⚽", // The Soccer Dad
  gradStudent: "🎓",
  coldWarCowboy: "🤠"
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
    const order = ["account-modal", "lore-modal", "changelog-modal", "controls-modal", "settings-modal", "bonus-modal", "lounge-modal", "levelup-modal", "pause-modal", "retire80-modal", "gameover-modal", "title-modal"];
    for (const id of order) {
      const el = document.getElementById(id);
      if (el && !el.classList.contains("hidden")) return el;
    }
    return null;
  },

  getRows(modal) {
    if (!modal) return [];
    const items = Array.from(modal.querySelectorAll(".nav-item:not([disabled])"));
    // The title screen also reaches the site's top bar (Nov 5, Rami: "you can't fully navigate the title screen with a controller").
    if (modal.id === "title-modal") document.querySelectorAll(".ms-nav .nav-item:not([disabled])").forEach(el => { if (el.offsetParent !== null) items.push(el); });
    const rowMap = new Map();
    items.forEach(el => {
      const r = Number(el.dataset.navRow || 0);
      if (!rowMap.has(r)) rowMap.set(r, []);
      rowMap.get(r).push(el);
    });
    return Array.from(rowMap.keys()).sort((a, b) => a - b).map(k => rowMap.get(k));
  },

  focus(el, playSound = false, noScroll = false) {
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
        if (isMatch) { const pk = document.getElementById("lv-pick"), nm = c.querySelector(".perk-name"); // B1: PICK names the card you're on
          if (pk && nm && !pk.disabled) pk.querySelector(".ms-btn-sub").textContent = nm.textContent.replace(/^Unlock:\s*/, "").trim(); }
      });
    }
    if (!noScroll) try { el.scrollIntoView({ block: "nearest", inline: "nearest" }); } catch (e) {} // mouse hover never scrolls (Nov 4)
    if (playSound) sfx("move");
  },

  refresh(defaultSelector, noScroll) {
    const modal = this.getActiveModal();
    if (!modal) { this.focusedEl = null; return; }
    const all = Array.from(modal.querySelectorAll(".nav-item:not([disabled])"));
    if (!all.length) { this.focusedEl = null; return; }
    let target = null;
    if (defaultSelector) target = modal.querySelector(defaultSelector);
    if (!target || target.disabled) {
      target = modal.querySelector(".nav-default:not([disabled])") || all[0];
    }
    this.focus(target, false, noScroll);
  },

  // Spatial menu movement (Nov 5 controller pass; Rami on iPad + TV: the cursor "jumps around", PUNCH IN is hard to
  // reach, the shop only goes left/right and the Shift Ended screen won't scroll). A direction now moves to whatever is
  // visually that way on screen; if nothing is, the page scrolls instead. Left/Right on a setting row still cycles it.
  navItems(modal) {
    const items = Array.from(modal.querySelectorAll(".nav-item:not([disabled])"));
    if (modal.id === "title-modal") document.querySelectorAll(".ms-nav .nav-item:not([disabled])").forEach(el => items.push(el));
    return items.filter(el => { if (el.offsetParent === null || el.getAttribute("aria-current") === "page") return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  },
  scrollerFor(el, modal) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 4) return n;
      if (n === modal) break;
    }
    return modal.scrollHeight > modal.clientHeight + 4 ? modal : null;
  },
  move(dir) {
    const modal = this.getActiveModal();
    if (!modal) return false;
    const items = this.navItems(modal);
    if (!items.length) return false;
    const cur = this.focusedEl && items.includes(this.focusedEl) ? this.focusedEl : null;
    if (!cur) { this.focus(modal.querySelector(".nav-default:not([disabled])") || items[0], true); return true; }

    if ((dir === "left" || dir === "right") && cur.dataset.optCycle) { this.activate(dir); return true; } // setting rows cycle

    const a = cur.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
    const horiz = dir === "left" || dir === "right", sign = (dir === "right" || dir === "down") ? 1 : -1;
    let best = null, bestScore = Infinity;
    for (const el of items) {
      if (el === cur) continue;
      const b = el.getBoundingClientRect(), bx = b.left + b.width / 2, by = b.top + b.height / 2;
      const main = horiz ? (bx - ax) * sign : (by - ay) * sign;          // how far in the pressed direction
      const edgeGap = horiz ? (sign > 0 ? b.left - a.right : a.left - b.right) : (sign > 0 ? b.top - a.bottom : a.top - b.bottom);
      if (main <= 4 || edgeGap < -Math.min(a.height, b.height) * 0.5) continue; // not actually that way
      if (horiz && Math.abs(by - ay) > Math.max(a.height, b.height) * 1.2) continue; // sideways means roughly the same line
      const side = horiz ? Math.abs(by - ay) : Math.abs(bx - ax);         // how far off to the side
      const overlap = horiz ? !(b.bottom < a.top || b.top > a.bottom) : !(b.right < a.left || b.left > a.right);
      const score = Math.max(0, edgeGap) + side * (overlap ? 0.3 : 2.2);
      if (score < bestScore) { bestScore = score; best = el; }
    }
    if (best) { this.focus(best, true); return true; }
    // Nothing that way: scroll the page/panel instead (reaches the art at the top of Shift Ended, long lists, etc.)
    if (!horiz) {
      const sc = this.scrollerFor(cur, modal);
      if (sc) sc.scrollBy({ top: sign * sc.clientHeight * 0.45, behavior: "smooth" });
    }
    return true;
  },

  activate(dirHint) {
    const modal = this.getActiveModal();
    if (!modal) return false;
    if (!this.focusedEl || (!modal.contains(this.focusedEl) && !(modal.id === "title-modal" && this.focusedEl.closest(".ms-nav")))) {
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
    if (e.pointerType === "mouse" && window.menuNav.focusedEl !== el) { window.menuNav.focus(el, false, true); try { sfx("uiHover"); } catch (err) {} }
  });
  // Mouse clicks act right away. Touch taps act when the finger LIFTS (pointerup), so a restart
  // never happens mid-touch (that broke touch steering after Retry) and a stray touch can slide off to cancel.
  el.addEventListener("pointerdown", e => {
    e.stopPropagation();
    unlockAudio();
    if (e.pointerType === "mouse") { window.menuNav.focus(el, false, true); onActivate(e); return; }
    el._pressId = e.pointerId;
    window.menuNav.focus(el, false);
  });
  el.addEventListener("pointerup", e => {
    if (e.pointerType === "mouse" || el._pressId !== e.pointerId) return;
    e.stopPropagation();
    el._pressId = null;
    onActivate(e);
  });
  el.addEventListener("pointercancel", () => { el._pressId = null; });
  el.addEventListener("pointerleave", e => { if (e.pointerType !== "mouse") el._pressId = null; });
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
    <!-- Center flash: big, short notices for things that change the fight (boss, Comfort Zone Tax, buffs). -->
    <div class="center-flash hidden" id="center-flash" role="status" aria-live="polite"><div class="cf-text"><div class="cf-title"></div><div class="cf-sub"></div></div></div>
    <div class="vs-hud hidden" id="vs-hud">
      <div class="vs-xp ms-bar"><div class="vs-xp-fill ms-fill" id="vs-xp-fill"></div><span class="vs-lv" id="vs-lv">LV 1</span></div>
      <div class="vs-row">
        <div class="vs-left">
          <div class="vs-score" id="vs-score">SCORE 0</div>
          <div class="vs-coins" id="vs-coins">🪙 0k</div>
          <div class="vs-loadout" id="vs-loadout"></div>
        </div>
        <div class="vs-center">
          <div class="vs-age" id="vs-age">AGE 40</div>
          <div class="vs-timer" id="vs-timer">00:00</div>
          <div class="vs-year ms-bar year" title="Progress through this year"><div class="vs-year-fill ms-fill" id="vs-year-fill"></div></div>
          <div class="vs-combo hidden" id="vs-combo" aria-live="off"></div>
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
        <div class="ctx-help" id="ctx-help">💡 TIP: Weapons fire automatically! Steer around furniture and crack open green Potted Plants for Pizza (+2 HP) & 401(k) Coins.</div>
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
    <div class="ui-modal hidden ms-sheet-host" id="settings-modal"></div>

    <!-- MODAL 2C: VERSION HISTORY & RELEASE NOTES OVERLAY -->
    <div class="ui-modal hidden" id="changelog-modal"></div>

    <!-- MODAL 2D: MYTHOS, SUBJECTS & SCENARIOS LORE ARCHIVE OVERLAY -->
    <div class="ui-modal hidden" id="lore-modal"></div>

    <!-- MODAL 3: AGE 80 RETIREMENT MILESTONE (Retire or Enter 80-100 Senior Bonus Rounds!) -->
    <div class="ui-modal hidden ms-sheet-host" id="retire80-modal">
      <div class="modal-card ms-shell ms-moment">
        <div class="ms-sheet-strip">HR · RE: <b>Age 80. +15k bonus</b></div>
        <h2 class="modal-title">HAPPY 80TH</h2>
        <p class="gameover-cause">You survived 40 years of Bills, HR Reviews, Mortgages, and the HOA! Do you want to retire in peace, or push into the <b>20 Bonus Senior Life Rounds (Age 80 to 100)</b> against Early-Bird Buffets, Sciatica, and 6AM Pickleball Champions?</p>
        <div class="ms-shell-actions">
          <button type="button" class="ms-btn secondary" id="retire80-claim-btn"><span class="ms-btn-label">RETIRE</span><span class="ms-btn-sub">Claim the win at 80</span></button>
          <button type="button" class="ms-btn primary" id="retire80-senior-btn"><span class="ms-btn-label">KEEP GOING</span><span class="ms-btn-sub">20 bonus years, 80 to 100</span></button>
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
  hudSetText("hud-mute-btn", muted ? `🔇 [${mKey}]` : `🔊 [${mKey}]`); // runs every frame with the HUD: only writes on change
  hudSetText("mob-mute-btn", muted ? "🔇" : "🔊");
  hudSetText("vs-mute-btn", muted ? "🔇" : "🔊");
}

window.setGamepadConnectedUI = function(connected) {
  const changed = gamepadConnectedFlag !== !!connected;
  if (!changed) return; // called every frame: only touch the page when it changes
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
const LT_PRIORITY = { alert: 5, win: 4, errand: 4, tip: 3, chapter: 2, promo: 3, reward: 1, lore: 1, joke: 0 };
const ltState = { current: null, queue: [], remaining: 0, gap: 0 };
window._ltState = ltState; // for tests

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
  if (window.Spotlight && Spotlight.isShowing && Spotlight.isShowing()) { el.classList.remove("show"); return; } // A6: the band borrows the ticker's spot; the line waits
  if (ltState.current) {
    el.classList.add("show");
    ltState.remaining -= 100;
    if (ltState.remaining <= 0) ltHide();
  } else if (ltState.queue.length) {
    ltState.gap -= 100;
    if (ltState.gap <= 0) ltShowNow(ltState.queue.shift());
  }
}, 100);

// The headline plate (design system A3): short alarms right under the HUD, on a solid backing.
// (It used to sit in the middle of the floor; the full sentence still goes to the bottom bar.)
let cfTimer = null, cfShowing = false;
function flashBannerNow(title, sub, kind) {
  const el = document.getElementById("center-flash");
  if (!el) return;
  el.querySelector(".cf-title").textContent = title;
  el.querySelector(".cf-sub").textContent = sub || "";
  el.dataset.kind = kind || "alert";
  el.classList.remove("hidden", "cf-go"); void el.offsetWidth; el.classList.add("cf-go");
  clearTimeout(cfTimer); cfShowing = true; document.documentElement.classList.add("ms-headline");
  cfTimer = setTimeout(() => { el.classList.add("hidden"); cfShowing = false; document.documentElement.classList.remove("ms-headline"); MsgRouter.headlineDone(); }, 2400);
}
function flashBannerCut() { // something bigger took the middle of the screen: end the flash now
  const el = document.getElementById("center-flash");
  clearTimeout(cfTimer); if (el) el.classList.add("hidden"); cfShowing = false; document.documentElement.classList.remove("ms-headline");
}

// Design system A2 (Nov 10): the message router. One HEADLINE at a time in the middle (center flash, Spotlight
// card, catch card), one TICKER at a time at the bottom (the lower third, which already queues itself).
// Anything that wants the headline asks here first. Rules (spec section 3.2):
//   - no cutting in: a new headline waits for the one on screen, it never replaces it
//   - 1.2 s gap between headlines; the same headline at most once a minute
//   - waiting has a shelf life: alarms 4 s, objectives 10 s, rewards 8 s, then they're dropped
//   - the clock only runs while you're playing (a level-up or pause holds the line)
window.MsgRouter = (() => {
  const TIER = { alert: 1, objective: 2, promo: 2, reward: 3 };          // lower number = more important
  const SHELF = { 1: 4000, 2: 10000, 3: 8000 };
  const GAP = 1200, REPEAT = 60000;
  let queue = [], lastEnd = -1e9, lastSaid = {}, activeMs = 0, lastTick = performance.now();
  const busy = except => (except !== "flash" && cfShowing) ||
    (except !== "spotlight" && !!(window.Spotlight && Spotlight.isShowing && Spotlight.isShowing())) ||
    (except !== "catch" && !!(window.CatchMoment && CatchMoment.isShowing && CatchMoment.isShowing()));
  function flash(title, sub, kind, opts) {
    // A6: rewards never take the headline; every reward already has its line in the bottom ticker
    if (kind === "reward" && (window.MSG_PACING || {}).rewardsInTickerOnly !== false) return;
    // A4: a boss's first-attack banner is skipped while its arrival card is up; the card already says how to dodge
    if (opts && opts.bossFirst && window.Spotlight && Spotlight.bossUp && Spotlight.bossUp()) return;
    const key = title + "|" + (sub || ""), t = TIER[kind] || 2;
    if (activeMs - (lastSaid[key] ?? -1e9) < REPEAT) return;            // said this a moment ago
    if (queue.some(m => m.key === key)) return;
    if (!busy() && activeMs - lastEnd >= GAP && !ltMenuOpen()) { lastSaid[key] = activeMs; return flashBannerNow(title, sub, kind); }
    queue.push({ key, title, sub, kind, t, at: activeMs });
    queue.sort((a, b) => a.t - b.t || a.at - b.at);
    if (queue.length > 4) queue.length = 4;
  }
  setInterval(() => {
    const now = performance.now(), dt = now - lastTick; lastTick = now;
    if (ltMenuOpen()) return;                                           // a menu holds the line; nobody goes stale
    activeMs += dt;
    queue = queue.filter(m => activeMs - m.at < SHELF[m.t]);
    if (!queue.length || busy() || activeMs - lastEnd < GAP) return;
    // a more important Spotlight card is waiting (a boss is tier 1): it goes first
    const cardTier = window.Spotlight && Spotlight.waitingTier ? Spotlight.waitingTier() : 9;
    if (cardTier < queue[0].t) return;
    const m = queue.shift(); lastSaid[m.key] = activeMs; flashBannerNow(m.title, m.sub, m.kind);
  }, 100);
  return {
    flash,
    busy,                                     // busy("spotlight") = is anything ELSE holding the headline?
    // Spotlight asks this too: keep the breather, and let alarms or objectives that were already waiting go first
    blocked(who, tier) { return busy(who) || activeMs - lastEnd < GAP || queue.some(m => m.t <= (tier || 2)); },
    headlineDone() { lastEnd = activeMs; },   // the Spotlight and catch card call this when they leave
    cutFlash() { if (cfShowing) { flashBannerCut(); lastEnd = activeMs - GAP; } },
    waiting: () => queue.map(m => m.title),
    reset() { queue = []; lastSaid = {}; lastEnd = -1e9; flashBannerCut(); }
  };
})();
window.flashBanner = function(title, sub, kind, opts) { MsgRouter.flash(title, sub, kind, opts); };

// Design system A6: holds. Errands, the Lounge and swarm events ask here before they start.
window.Pacing = {
  P: () => window.MSG_PACING || {},
  bossUp: () => typeof bills !== "undefined" && !!bills && bills.getChildren().some(b => b.active && b.isBoss),
  nearMilestone() { const P = this.P(); if (typeof currentAge === "undefined") return false;
    return (P.milestoneAges || []).some(m => Math.abs(currentAge - m) < (P.clearYears || 0)); },
  clearForErrand() { const P = this.P(); return !(P.holdErrandsForBoss && this.bossUp()) && !this.nearMilestone(); },
  clearForLounge() { const P = this.P(); return !(P.holdLoungeForBoss && this.bossUp()) && !this.nearMilestone(); },
  holdSwarm() { return !!(this.P().holdSwarmsForBoss && this.bossUp()); },
  // Flavor lines (tier 4): only after a stretch of quiet, never during a boss, dropped if late. Run clock, so menus don't count.
  flavor(badge, text, ms) {
    const P = this.P(), start = typeof runElapsedMs !== "undefined" ? runElapsedMs : 0;
    let quietSince = start;
    const iv = setInterval(() => {
      if (typeof runElapsedMs === "undefined" || (typeof gameOver !== "undefined" && gameOver) || runElapsedMs < start) return clearInterval(iv); // run ended or restarted
      const busy = (window._ltState && _ltState.current) || this.bossUp() || (window.MsgRouter && MsgRouter.busy());
      if (busy) quietSince = runElapsedMs;
      if (runElapsedMs - start > (P.flavorMaxWaitMs || 90000)) return clearInterval(iv);
      if (runElapsedMs - quietSince >= (P.flavorQuietMs || 20000)) { clearInterval(iv); window.showLowerThird("lore", badge, text, ms); }
    }, 500);
  }
};

// Title screen version line and the "what's new" bubble (Nov 3).
// The bubble shows the newest changelog entry's teaser (or its first highlight) once per version.
function seenVersion() { try { return localStorage.getItem("ms-seen-version") || ""; } catch (e) { return ""; } }
function markVersionSeen() { try { localStorage.setItem("ms-seen-version", (window.GAME_VERSION || {}).version || ""); } catch (e) {} }
function titleNewVisible() {
  if (window.titleNewOpen !== undefined) return !!window.titleNewOpen;
  // A brand-new player (no runs yet) has nothing to compare against, so they skip "What's new" and start
  // counting from this version (Fable review #10). The version chip still opens it on request.
  if (!(typeof meta !== "undefined" && meta && meta.runsPlayed > 0)) { if (!seenVersion()) markVersionSeen(); return false; }
  return seenVersion() !== ((window.GAME_VERSION || {}).version || "");
}
function titleVersionHtml(verInfo) {
  const V = window.GAME_VERSION || {}, latest = (V.changelog || [])[0] || {};
  const teaser = latest.teaser || (latest.highlights || [])[0] || "";
  const open = titleNewVisible() && teaser;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  return `<div class="tp-ver">
      <button type="button" class="tp-ver-btn" id="title-ver-btn" aria-expanded="${open ? "true" : "false"}" aria-controls="tp-new-pop">You're playing <b>${esc(verInfo.displayVersion || V.displayVersion || "")}</b> <span class="tp-ver-new">✨ WHAT'S NEW</span></button>
    </div>`;
}

// "What's new" pop-up (Nov 3, Rami): same family as the poll pop-up. Corner card on wide screens,
// a pill that opens into a bottom sheet on phones. Shows once per version; the version chip reopens it.
// Its few extra styles are injected here so they arrive with the code even if the page's CSS is cached.
function titleNewPop() {
  const V = window.GAME_VERSION || {}, latest = (V.changelog || [])[0] || {};
  const teaser = latest.teaser || (latest.highlights || [])[0] || "";
  if (!teaser || !titleNewVisible()) return "";
  if (!document.getElementById("tp-new-css")) {
    const css = document.createElement("style"); css.id = "tp-new-css";
    css.textContent = `
      .tp-new-pop { border-color: var(--ms-teal, #3E7775) !important; }
      .tp-new-pop { animation-delay: .35s !important; }
      .tp-new-pop.shown:not(.open) { animation: none !important; }
      .tp-new-pop.shown.open { animation-delay: 0s !important; animation-duration: .25s !important; }
      .tp-new-pop .tp-new-head { font: 11px Silkscreen, monospace; letter-spacing: .06em; color: #171C35; background: #F2D7A1; display: inline-block; padding: 3px 8px; border-radius: 3px; margin: 0 26px 8px 0; }
      .tp-new-pop .tp-new-body { font: 600 14px/1.4 "Atkinson Hyperlegible", system-ui, sans-serif; color: #FFF0CF; margin: 0 0 10px; }
      .tp-new-pop .tp-new-all { font: 12px Silkscreen, monospace; background: transparent; color: #83A89A; border: 2px solid #3E7775; border-radius: 4px; padding: 6px 10px; min-height: 36px; cursor: pointer; }
      .tp-new-pop .tp-new-all:hover { border-color: #F2D7A1; color: #F2D7A1; }
      @media (orientation: portrait), (max-width: 760px) { .tp-new-pop:not(.open) { background: #3E7775 !important; } .tp-new-pop:not(.open) .tp-poll-pill { color: #FFF0CF !important; } }
      #ui-layer .tp-ver-btn { font-family: Silkscreen, monospace; font-size: 12px; letter-spacing: .04em; color: #F2D7A1; background: rgba(23,28,53,0.88); border: 2px solid #3E7775; border-radius: 4px; padding: 6px 10px; min-height: 36px; cursor: pointer; }
      #ui-layer .tp-ver-btn b { color: #EF9347; }
      #ui-layer .tp-ver-btn .tp-ver-new { color: #83A89A; margin-left: 4px; }`;
    document.head.appendChild(css);
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  // It used to wait 1.2 s before sliding in, and every title redraw (like tapping the version chip) restarted that wait.
  // Now: a short wait the first time, and no replay after that (Rami, Nov 3: "very slow to pop up").
  const popAnim = window._newPopShown ? " shown" : "";
  window._newPopShown = true;
  return `<aside class="tp-poll-pop tp-new-pop${window.titleNewOpen === true ? " open" : ""}${popAnim}" id="tp-new-pop" aria-label="What's new">
    <button type="button" class="tp-poll-x" id="tp-new-x" aria-label="Close what's new">×</button>
    <button type="button" class="tp-poll-pill">✨ New in ${esc(V.displayVersion || "")}</button>
    <div class="tp-new-head">NEW IN ${esc(V.displayVersion || "")}</div>
    <p class="tp-new-body">${esc(teaser)}</p>
    <button type="button" class="tp-new-all" id="tp-new-all">SEE ALL CHANGES</button>
  </aside>`;
}

const ltFlashAt = {};
window.showLowerThird = function(kind, badge, text, ms = 4500, short, _waited) {
  // While a Spotlight card is up, ordinary messages wait their turn instead of stacking under it (Nov 3, Rami:
  // "the cards still show up in pairs"). Alerts wait too now (Fable review: four messages stacked at 65);
  // only LOW HP goes out right away, because it can save the run. Gives up after ~15 s.
  if (badge !== "LOW HP" && badge !== "SECOND OPINION" && window.Spotlight && Spotlight.isShowing && Spotlight.isShowing() && (_waited || 0) < 15000) {
    setTimeout(() => window.showLowerThird(kind, badge, text, ms, short, (_waited || 0) + 500), 500);
    return;
  }
  // Nov 9 (Rami's late-game screenshots: DESK SALAD over the middle of the screen the whole time): the big
  // center banner shows a reward at most once a minute. The lower third still says it every time.
  const flashKey = kind + ":" + badge, tNow = performance.now();
  if ((kind === "alert" || kind === "reward") && window.flashBanner && !(kind === "reward" && tNow - (ltFlashAt[flashKey] || -1e9) < 60000)) { ltFlashAt[flashKey] = tNow; window.flashBanner(badge, short, kind); }
  const msg = { kind, badge, text, ms, p: LT_PRIORITY[kind] ?? 1 };
  const cur = ltState.current;
  if (!cur) return ltShowNow(msg);
  if (msg.p > cur.p && kind === "alert") {          // only danger takes over (design system A6: no cutting in); the rest wait in line...
    if (cur.p >= 2 && !cur.requeued) {                // ...and put the interrupted message back in line (Nov 2: promotions got lost)
      ltState.queue.unshift(Object.assign({}, cur, { requeued: true, ms: Math.max(2500, ltState.remaining) }));
      ltState.queue.sort((a, b) => b.p - a.p);
      if (ltState.queue.length > 5) ltState.queue.length = 5;
    }
    return ltShowNow(msg);
  }
  if (msg.p <= 1) return;                              // rewards and lore: skip if busy
  ltState.queue.push(msg);
  ltState.queue.sort((a, b) => b.p - a.p);
  if (ltState.queue.length > 5) ltState.queue.length = 5; // room for a promotion + its LIFE line during busy moments
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
  if (t.skipWhileTeaching && window.teach && window.teach.on) return; // the teaching runs already said it another way (Nov 7)
  const touch = window.matchMedia && matchMedia("(pointer: coarse)").matches; // phones get the "how to move" version (Fable review)
  window.showLowerThird("tip", t.badge || "TIP", (touch && t.touchText) || t.text, 5000);
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
      help: "💡 TIP: Shoot green Potted Plants to crack them open for Leftover Pizza (+2 HP) and 401(k) Gold Coins!"
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
      help: "💡 TIP: Press V during a run to save a screenshot of the chaos."
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
        help: "💡 HELP: Crack open green Potted Plants for Leftover Pizza (+2 HP) or collect blue Gems to level up (+1 HP)!",
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
        help: "💡 HELP: Walk near the Pizza slice to magnetize it and heal +2 HP immediately!",
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

// Speed (Nov 2): updateHUD gets called for every gem, coin and hit, sometimes dozens of times a frame.
// Batch those into one page update per frame.
let hudQueued = false;
function updateHUD() {
  if (hudQueued) return;
  hudQueued = true;
  requestAnimationFrame(() => { hudQueued = false; updateHUDNow(); });
}
// The HUD refreshes every frame (timer, score, year bar), but most values don't change from one frame to the next.
// These only touch the page when the value is new, so a quiet frame writes nothing (Fable review #6).
function hudSetText(id, v) { const el = document.getElementById(id); if (el && el._hv !== v) { el.textContent = v; el._hv = v; } }
function hudSetWidth(id, v) {
  if (typeof v === "number") v = v + "%";
  v = v.replace(/^(-?\d+\.\d)\d*%$/, "$1%"); // a tenth of a percent is plenty
  const el = document.getElementById(id); if (el && el._hw !== v) { el.style.width = v; el._hw = v; }
}
function updateHUDNow() {
  const hpFill = document.getElementById("hud-hp-fill");
  if (!hpFill || !stats || !meta) return;

  const ch = CHARACTERS.find(c => c.id === meta.selectedChar) || CHARACTERS[0];
  const av = document.getElementById("hud-avatar");
  if (av && av._hv !== ch.id) { av.innerHTML = pixelIcon("char", ch.id, CHAR_ICONS[ch.id] || "☕", 24); av._hv = ch.id; } // only when the hero changes
  hudSetText("hud-charname", ch.name);
  hudSetText("hud-lv", `LV ${level}`);

  const hpPct = Math.max(0, Math.min(100, (hp / stats.maxHp) * 100));
  hudSetWidth("hud-hp-fill", `${hpPct}%`);
  hudSetText("hud-hp-text", `${Math.max(0, hp)} / ${stats.maxHp} HP`);

  const xpPct = Math.max(0, Math.min(100, (xp / xpNeeded) * 100));
  hudSetWidth("hud-xp-fill", `${xpPct}%`);
  hudSetText("hud-xp-text", `${xp} / ${xpNeeded} XP`);

  hudSetText("hud-age", `AGE ${currentAge.toFixed(1)}`);
  const tlTitle = document.getElementById("hud-timeline-title");
  const curStage = (typeof getActiveStage === "function") ? getActiveStage(currentAge, meta) : null;
  const stagePrefix = curStage ? `${curStage.name.toUpperCase()} // ` : "";
  if (currentAge < 80) {
    hudSetText("hud-timeline-title", `${stagePrefix}${curStage ? curStage.chapter : "GOAL: AGE 80"}`);
    const agePct = Math.max(0, Math.min(100, ((currentAge - 40) / 40) * 100));
    hudSetWidth("hud-age-fill", `${agePct}%`);
  } else {
    hudSetText("hud-timeline-title", `🌴 SUNSET PALMS // 🔥 SENIOR BONUS (80 -> 100!)`);
    const senPct = Math.max(0, Math.min(100, ((currentAge - 80) / 20) * 100));
    hudSetWidth("hud-age-fill", `${senPct}%`);
  }

  hudSetText("hud-coins", `${meta.coins}k`);
  const yieldEl = document.getElementById("hud-yield-pill");
  if (yieldEl && typeof window.getCoinYieldInfo === "function") {
    const yld = window.getCoinYieldInfo();
    hudSetText("hud-yield-pill", `📈 ${yld.label} (+${yld.value}k/🪙)`);
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
  hudSetWidth("vs-xp-fill", `${xpPct}%`);
  hudSetText("vs-lv", `LV ${level}`);
  hudSetText("vs-age", `AGE ${Math.floor(currentAge)}`);
  const yearPct = Math.max(0, Math.min(100, (currentAge - Math.floor(currentAge)) * 100));
  hudSetWidth("vs-year-fill", `${yearPct}%`);
  hudSetText("vs-coins", `🪙 ${meta.coins}k`);
  // Run timer (game time, so it stops while paused) and the live score.
  const mmss = ms => { const t = Math.max(0, Math.floor(ms / 1000)); return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
  const timerEl = document.getElementById("vs-timer");
  const endMs = window.getRunEndMs ? window.getRunEndMs() : 0;
  // Sprint (Nov 4, Rami: "it should feel like it"): the shift clock runs at the years' speed, 2x, and turns orange with a bolt.
  const sprinting = window.isSprintRun && isSprintRun() && window.SPRINT;
  hudSetText("vs-timer", (sprinting ? "⚡" : "") + mmss(runElapsedMs * (sprinting ? SPRINT.yearsMult : 1)));
  if (timerEl) timerEl.classList.toggle("vs-timer-sprint", !!sprinting);
  const ttl = endMs ? `${mmss(endMs - runElapsedMs)} until the end of this life` : "";
  if (timerEl.title !== ttl) timerEl.title = ttl;
  timerEl.classList.toggle("vs-timer-final", !!endMs && endMs - runElapsedMs < 60000);
  const comboEl = document.getElementById("vs-combo"); // Close Call streak meter
  if (comboEl && window.NearMiss) {
    const c = window.NearMiss.hud();
    comboEl.classList.toggle("hidden", !c);
    if (c) { hudSetText("vs-combo", c.text); if (comboEl.dataset.tier !== String(c.tier)) comboEl.dataset.tier = c.tier; }
  }
  const tbNow = window.getRunTaxBracket ? window.getRunTaxBracket() : 0;
  if (window.computeRunScore) hudSetText("vs-score", `SCORE ${window.computeRunScore(currentAge, runStartAge, runKills, runCoins, false).toLocaleString()}${tbNow ? ` · TAX×${tbNow}` : ""}`);
  // Loadout slots (Nov 4): 6 weapons and 6 passives, each underlined in its style color; empty slots are dashed.
  ensureLoadoutCss();
  const lo = document.getElementById("vs-loadout");
  let loHtml = loadoutSlotsHtml();
  if (stats.floppy) loHtml = loHtml.replace("📺", "💾").replace("📡", "💾");
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

// "Right now": everything temporarily changing the run, readable at your own pace while paused.
// (Playtest: the mid-run notices go by too fast to read.)
function activeEffectsHtml() {
  if (typeof runElapsedMs === "undefined") return "";
  const t = runElapsedMs, left = until => `${Math.max(1, Math.ceil((until - t) / 1000))}s left`;
  const rows = [];
  // Age 50+ "life happens" modifiers (Ghost Hour, Rent Hike...) with their plain-English line (Nov 6, Kevin asked)
  const md = window.Modifiers && Modifiers.active && Modifiers.active();
  if (md) {
    const yrs = Modifiers.endsAtAge && typeof currentAge !== "undefined" ? Math.max(0.1, Modifiers.endsAtAge() - currentAge) : 0;
    const name = md.title.toLowerCase().replace(/(^|[\s-])\S/g, c => c.toUpperCase()).replace(/\b(Am|Pm)\b/g, m => m.toUpperCase());
    rows.push([md.kind === "reward" ? "🎁" : "⚠️", name, md.sub, yrs ? `${yrs.toFixed(1)} yrs left` : "for now"]);
  }
  if (typeof dyn !== "undefined" && dyn.comfortUntil > t) rows.push(["😤", "Comfort Zone Tax", "More enemies, because you got comfortable", left(dyn.comfortUntil)]);
  if (typeof dyn !== "undefined" && dyn.mercyUntil > t) rows.push(["🫶", "Breather", "Fewer enemies while your HP is low", left(dyn.mercyUntil)]);
  if (typeof buffs !== "undefined" && buffs.speedUntil > t) rows.push(["🥤", "Faster feet", `${Math.round((buffs.speedMult - 1) * 100)}% faster`, left(buffs.speedUntil)]);
  if (typeof buffs !== "undefined" && buffs.drinkShieldUntil > t) rows.push(["🛡️", "Too wired to hit", "Shielded while you keep moving", left(buffs.drinkShieldUntil)]);
  if (typeof buffs !== "undefined" && buffs.xpUntil > t) rows.push(["🍰", "Office party", `${Math.round((buffs.xpMult - 1) * 100)}% more XP`, left(buffs.xpUntil)]);
  if (typeof shield !== "undefined" && shield.hits > 0 && shield.until > t) rows.push(["🛡️", "Intern shield", `blocks ${shield.hits} more hit${shield.hits === 1 ? "" : "s"}`, left(shield.until)]);
  if (typeof buffs !== "undefined" && buffs.damageUntil > t) rows.push(["💪", "Extra damage", `${Math.round((buffs.damageMult - 1) * 100)}% more damage`, left(buffs.damageUntil)]);
  if (typeof slowUntil !== "undefined" && slowUntil > t) rows.push(["🍩", "Sugar crash", "You're slower for a bit", left(slowUntil)]);
  const nm = window.NearMiss && window.NearMiss.hud();
  if (nm && nm.tier >= 0) rows.push(["⚡", "Close Call streak", nm.text, "dodge to keep it"]);
  const tb = typeof runTaxBracket !== "undefined" ? runTaxBracket : 0;
  if (window.isSprintRun && window.isSprintRun()) rows.push(["⚡", "Sprint", "Years pass 2x faster, everyone moves faster, +25% coins", "all run"]);
  if (tb > 0) rows.push(["📈", `Tax Bracket ${tb}`, ((window.TAX_BRACKET && TAX_BRACKET.labels && TAX_BRACKET.labels[tb]) || "") + ": tougher enemies, bigger rewards", "all run"]);
  const body = rows.length
    ? rows.map(([i, name, what, time]) => `<li><span class="ae-ico">${i}</span><span class="ae-txt"><b>${name}</b> ${what}</span><span class="ae-time">${time}</span></li>`).join("")
    : `<li class="ae-none">Nothing special. Just regular midlife.</li>`;
  return `<div class="active-effects"><div class="ae-head">RIGHT NOW</div><ul>${body}</ul></div>`;
}

// A little 10-block volume meter, e.g. ■■■■■■■□□□ 70%
function volBar(v) { const n = Math.round(v * 10); return `${"■".repeat(n)}${"□".repeat(10 - n)} ${Math.round(v * 100)}%`; }
// The selected hero, idling on the pause screen (breathing, then a fidget): row 5 of the 8x5 hero sheet.
// On Break portraits (ChatGPT, Nov 3): 96x112 cells. Row 0 breathes (6 frames), row 1 is the hero's
// signature break, row 2 is a stretch. We breathe a few times, then play one of the other two, and repeat.
// Full file names (without .png). Ben uses his v3 art (Nov 3).
const BREAK_SHEETS = { officeWorker: "office-worker-on-break-v1", photographer: "soccer-dad-on-break-v1", gradStudent: "grad-student-on-break-v1", coldWarCowboy: "cold-war-cowboy-on-break-v3" };
function pauseHeroHtml() {
  const id = meta && meta.selectedChar, slug = BREAK_SHEETS[id];
  if (slug) {
    setTimeout(startBreakPortraits, 0);
    return `<canvas class="pause-hero break-portrait" width="96" height="112" data-sheet="assets/characters/portraits/${slug}.png" aria-hidden="true"></canvas>`;
  }
  try { // older fallback: the walk sheet's idle row
    const sc = window.game && game.scene.scenes[0], key = "walk2_" + id;
    window._heroSheetUrls = window._heroSheetUrls || {};
    if (!window._heroSheetUrls[id] && sc && sc.textures.exists(key)) window._heroSheetUrls[id] = sc.textures.get(key).getSourceImage().toDataURL("image/png");
    const url = window._heroSheetUrls[id];
    return url ? `<div class="pause-hero" style="background-image:url(${url})" aria-hidden="true"></div>` : "";
  } catch (e) { return ""; }
}
function startBreakPortraits() {
  document.querySelectorAll("canvas.break-portrait:not([data-on])").forEach(cv => {
    cv.dataset.on = "1";
    const img = new Image(), ctx = cv.getContext("2d");
    const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ROWS = [{ n: 6, ms: 220 }, { n: 8, ms: 140 }, { n: 8, ms: 150 }];
    let queue = [], next = 1;
    const plan = () => { queue = []; for (let b = 0; b < 3; b++) for (let f = 0; f < 6; f++) queue.push([0, f]);
      for (let f = 0; f < ROWS[next].n; f++) queue.push([next, f]); next = next === 1 ? 2 : 1; };
    const draw = (r, f) => { ctx.clearRect(0, 0, 96, 112); ctx.imageSmoothingEnabled = false; ctx.drawImage(img, f * 96, r * 112, 96, 112, 0, 0, 96, 112); };
    const tick = () => {
      if (!cv.isConnected) return;
      if (!queue.length) plan();
      const [r, f] = queue.shift(); draw(r, f);
      setTimeout(tick, ROWS[r].ms);
    };
    img.onload = () => { if (still) draw(0, 0); else tick(); };
    img.src = cv.dataset.sheet;
  });
}

function renderPauseModal(scene, keepRowIdx) {
  const modal = document.getElementById("pause-modal");
  if (!modal) return;
  const vIdx = window.viewModeIdx || 0;
  const muted = isMuted();
  const voiced = typeof isVoiceEnabled === "function" ? isVoiceEnabled() : true;
  const verInfo = getVersionInfo();

  // Tiles layout (Nov 3): actions first, then This shift / Your loadout / Settings.
  const maxHp = stats ? stats.maxHp : 12, hpNow = Math.max(0, hp);
  const hpPct = Math.round(Math.min(1, hpNow / maxHp) * 100), xpPct = xpNeeded ? Math.round(Math.min(1, xp / xpNeeded) * 100) : 0;
  const mins = Math.floor((runElapsedMs || 0) / 60000), secs = Math.floor(((runElapsedMs || 0) % 60000) / 1000);
  const ranks = (stats && stats.perkRanks) || {};
  const loadout = Object.keys(ranks).map(id => {
    const u = (window.UPGRADES || []).find(x => x.id === id);
    if (!u || u.isConsumable) return "";
    const info = (typeof UPGRADE_META !== "undefined" && UPGRADE_META[u.name]) || { icon: "⭐" };
    const icon = window.pixelIcon ? pixelIcon("card", u.name, info.icon, 32) : info.icon;
    const max = u.maxRank && u.maxRank < 50 ? u.maxRank : 0;
    const evo = u.isEvolution || info.rarity === "evo";
    return `<li class="${evo ? "evo" : ""}"><span class="pl-ic">${icon}</span><span class="pl-nm">${u.name.replace(/^Unlock: /, "")}</span><span class="pl-rk">${evo ? "EVO" : max ? `${ranks[id]}/${max}` : `×${ranks[id]}`}</span></li>`;
  }).join("");
  modal.innerHTML = `
    <div class="modal-card pause-box pause-tiles">
      <div class="modal-kicker">SAVED · ${verInfo.displayVersion}</div>
      <h2 class="modal-title">ON BREAK</h2>
      <p class="modal-sub">The swarm will wait. It always does.</p>
      <div class="pause-actions ms-pause-actions">
        <button class="ms-btn primary pa-resume" id="pause-resume-btn"><span class="ms-btn-label">RESUME</span><span class="ms-btn-sub">Back to work</span></button>
        <button class="ms-btn secondary" id="pause-settings-btn"><span class="ms-btn-label">SETTINGS</span><span class="ms-btn-sub">Sound, tips, controls</span></button>
        <button class="ms-btn secondary" id="pause-savequit-btn"><span class="ms-btn-label">SAVE &amp; EXIT</span><span class="ms-btn-sub">Pick it up later</span></button>
        <button class="ms-btn secondary" id="pause-restart-btn"><span class="ms-btn-label">START OVER</span><span class="ms-btn-sub">Back to age ${typeof modeStartAge === "function" ? modeStartAge() : 40}</span></button>
      </div>
      <div class="pause-grid ${pauseHeroHtml() ? "with-hero" : ""}">
        ${pauseHeroHtml() ? `<section class="pause-tile pt-hero">
          <div class="pt-tag">ON BREAK</div>
          ${pauseHeroHtml()}
          <div><div class="pt-hero-name">${(CHARACTERS.find(c => c.id === meta.selectedChar) || CHARACTERS[0]).name}</div>
          <div class="pt-hero-note">Stretching. Checking the 401(k). Not checking email.</div></div>
        </section>` : ""}
        <section class="pause-tile pt-shift">
          <div class="pt-tag">THIS SHIFT</div>
          <div class="pt-big"><b>${currentAge.toFixed(1)}</b><span>years old · level ${level}</span></div>
          <div class="pt-bar-row"><span>Health</span><div class="ms-bar hp${hpPct <= 35 ? " low" : ""}"><div class="ms-fill" style="width:${hpPct}%"></div></div><b>${hpNow}/${maxHp}</b></div>
          <div class="pt-bar-row"><span>Next level</span><div class="ms-bar"><div class="ms-fill" style="width:${xpPct}%"></div></div><b>${xpPct}%</b></div>
          <div class="pt-stats">
            <div><b>${mins}:${String(secs).padStart(2, "0")}</b><span>on the clock</span></div>
            <div><b>${(typeof runKills !== "undefined" ? runKills : 0).toLocaleString("en-US")}</b><span>paid off</span></div>
            <div><b>${typeof runCoins !== "undefined" ? runCoins : 0}k</b><span>401(k) this run</span></div>
            <div><b>${meta ? meta.coins : 0}k</b><span>banked</span></div>
          </div>
          ${activeEffectsHtml()}
        </section>
        <section class="pause-tile pt-loadout">
          <div class="pt-tag">YOUR LOADOUT</div>
          ${loadout ? `<ul class="pause-loadout">${loadout}</ul>` : `<p class="pt-empty">Just you and your coffee so far. Level up to pick perks.</p>`}
        </section>
      </div>
      <div class="ms-legend"><span><kbd>Esc</kbd><kbd>B</kbd><kbd>Start</kbd>Resume</span></div>
    </div>
  `;

  bindNavItem(document.getElementById("pause-resume-btn"), 0, () => {
    sfx("pick");
    togglePause(scene);
  }, keepRowIdx === undefined || keepRowIdx === 0);

  bindNavItem(document.getElementById("pause-settings-btn"), 0, () => { sfx("pick"); openSettingsModal(scene); }, keepRowIdx === 1); // B2

  bindNavItem(document.getElementById("pause-savequit-btn"), 0, () => {
    sfx("pick");
    if (window.persistActiveRun) window.persistActiveRun();
    setPauseModalVisible(false);
    paused = false;
    titleSeen = false;
    scene.scene.restart();
  }, false);

  bindNavItem(document.getElementById("pause-restart-btn"), 0, () => {
    sfx("pick");
    clearRunState();
    setPauseModalVisible(false);
    paused = false;
    scene.scene.restart();
  }, false);

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
      <button class="cta-btn" id="lore-close-btn">BACK</button>
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
      <button class="cta-btn" id="changelog-close-btn">BACK</button>
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
  { id: "holdFollow",   label: "Hold click to steer" },
  { id: "cursorFollow", label: "Follow the cursor" },
  { id: "clickDrag",    label: "Drag like a stick" },
  { id: "off",          label: "Menus only" }
];

const MOUSE_RCLICK_MODES = [
  { id: "pause", label: "Pause" },
  { id: "move",  label: "Hold to move" },
  { id: "view",  label: "Switch view" }
];

const TOUCH_MODES = [
  { id: "floating",    label: "Floating stick" },
  { id: "fixedLeft",   label: "Fixed, bottom left" },
  { id: "fixedRight",  label: "Fixed, bottom right" },
  { id: "directTouch", label: "Touch and hold" }
];

const TOUCH_SENS_MODES = [
  { id: "normal", label: "Normal" },
  { id: "high",   label: "Quick" },
  { id: "low",    label: "Relaxed" }
];

const PAD_DEADZONE_MODES = [
  { val: 0.22, label: "Standard" },
  { val: 0.15, label: "Sensitive" },
  { val: 0.35, label: "Stops stick drift" }
];

// ============================================================================
// SETTINGS (design system B2, Nov 10): one sheet with Sound, Game and Controls, opened from Pause and from the title.
// ============================================================================
function openSettingsModal(scene) {
  window.settingsModalOpen = true;
  const m = document.getElementById("settings-modal"); if (!m) return;
  m.classList.remove("hidden");
  renderSettingsModal(scene || uiScene);
}
function closeSettingsModal(scene) {
  window.settingsModalOpen = false;
  const m = document.getElementById("settings-modal"); if (m) { m.classList.add("hidden"); m.innerHTML = ""; }
  const sc = scene || uiScene;
  if (titleOpen) renderTitleModal(sc, "#title-controls-btn");
  else if (paused) renderPauseModal(sc, 1);
  else window.menuNav.refresh();
}
function renderSettingsModal(scene, keepId) {
  const m = document.getElementById("settings-modal"); if (!m) return;
  const muted = isMuted(), voiced = typeof isVoiceEnabled === "function" ? isVoiceEnabled() : true;
  const meter = v => `<span class="ms-meter" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<i class="${i < Math.round(v * 10) ? "on" : ""}"></i>`).join("")}</span>`;
  const row = (id, title, sub, val, cls, cycle) => `<button type="button" class="ms-row" id="${id}"${cycle ? ' data-opt-cycle="1"' : ""}>
      <span><span class="ms-row-title">${title}</span>${sub ? `<span class="ms-row-sub">${sub}</span>` : ""}</span><span class="ms-row-val ${cls || ""}">${val}</span></button>`;
  const pct = v => Math.round(v * 100) + "%";
  const session = typeof hasAudioSession === "function" && hasAudioSession();
  m.innerHTML = `
    <div class="modal-card ms-sheet settings-sheet" role="dialog" aria-label="Settings">
      <div class="ms-sheet-strip">HR · RE: <b>Settings</b></div>
      <h2 class="ms-sheet-title">SETTINGS</h2>
      <p class="ms-sheet-help">Saved on this device.</p>
      <div class="ms-section-head">Sound</div>
      <div class="ms-rows">
        ${row("set-sound", "Sound", "Everything at once", muted ? "OFF" : "ON", muted ? "off" : "on", true)}
        ${row("set-music", "Music", "◀ ▶ to change", pct(getVolume("music")) + meter(getVolume("music")), "", true)}
        ${row("set-sfx", "Effects", "◀ ▶ to change", pct(getVolume("sfx")) + meter(getVolume("sfx")), "", true)}
        ${row("set-style", "Sound style", "How the game's noises sound", typeof getSoundStyle === "function" && getSoundStyle() === "classic" ? "CLASSIC BEEPS" : "STUDIO", "", true)}
        ${session ? row("set-mix", "Your music", "Keep a podcast or playlist going", getAudioMix() === "mix" ? "KEEP PLAYING" : "GAME ONLY", "", true) : ""}
        ${row("set-voice", "Dad Joke voice", "Read the jokes out loud", voiced ? "SPOKEN" : "TEXT ONLY", "", true)}
      </div>
      <div class="ms-section-head">Game</div>
      <div class="ms-rows">
        ${row("set-tips", "Game tips", "First-time hints during a run", window.tipsEnabled() ? "ON" : "OFF", window.tipsEnabled() ? "on" : "off", true)}
      </div>
      <div class="ms-section-head">Controls</div>
      <div class="ms-rows">
        ${row("set-controls", "Controls", "Keyboard, touch and controller", "›", "")}
      </div>
      <div class="ms-sheet-actions"><div class="ms-left"></div>
        <button type="button" class="ms-btn primary" id="set-done"><span class="ms-btn-label">DONE</span></button></div>
      <div class="ms-legend"><span><kbd>◀</kbd><kbd>▶</kbd>Change</span><span><kbd>Esc</kbd><kbd>B</kbd>Back</span></div>
    </div>`;
  const again = id => renderSettingsModal(scene, id);
  const bind = (id, rowN, fn) => { const el = document.getElementById(id); if (el) bindNavItem(el, rowN, () => fn(el), keepId ? keepId === id : rowN === 0); };
  bind("set-sound", 0, () => { toggleMute(); if (typeof syncMuteButtons === "function") syncMuteButtons(); sfx("pick"); again("set-sound"); });
  [["set-music", "music", 1], ["set-sfx", "sfx", 2]].forEach(([id, which, n]) => bind(id, n, el => {
    const dir = el.dataset.dirHint, cur = getVolume(which);
    let v = Math.round((dir === "left" ? cur - 0.1 : cur + 0.1) * 10) / 10;
    if (!dir && cur >= 0.999) v = 0; // a tap past full wraps to off
    setVolume(which, Math.max(0, Math.min(1, v)));
    if (which === "sfx") sfx("billPaid", 0); else sfx("pick");
    again(id);
  }));
  bind("set-style", 3, () => { toggleSoundStyle(); sfx("billPaid", 0); again("set-style"); });
  bind("set-mix", 4, () => { toggleAudioMix(); sfx("pick"); again("set-mix"); });
  bind("set-voice", 5, () => { if (typeof toggleVoice === "function") toggleVoice(); sfx("pick"); again("set-voice"); });
  bind("set-tips", 6, () => { window.setTipsEnabled(!window.tipsEnabled()); sfx("pick"); again("set-tips"); });
  bind("set-controls", 7, () => { sfx("pick"); openControlsModal(scene); });
  bind("set-done", 8, () => { sfx("pick"); closeSettingsModal(scene); });
  window.menuNav.refresh();
}
window.openSettingsModal = openSettingsModal; window.closeSettingsModal = closeSettingsModal;

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
  if (window.settingsModalOpen) {
    renderSettingsModal(sc, "set-controls");   // B2: Controls lives inside Settings now
  } else if (titleOpen) {
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
  const fmtPad = window.formatPadButton || (b => `Button ${b}`);
  const reb = window.rebindState;

  const keyBtnLabel = (field, fallback) => {
    if (reb && reb.type === "key" && reb.field === field) {
      return "Press a key now";
    }
    return fmtKey(c[field] || fallback);
  };

  const padBtnLabel = (field, fallback) => {
    if (reb && reb.type === "pad" && reb.field === field) {
      return "Press a button now";
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
      <div class="ms-sheet-strip">IT · RE: <b>Your controls</b></div>
      <h2 class="modal-title">CONTROLS</h2>
      <p class="modal-sub ctrl-help">Pick a row, then press the new key or button. Changes save on this device.</p>
      <div class="device-status-bar">
        <span class="device-pill ready">KEYBOARD</span>
        <span class="device-pill ready">MOUSE</span>
        <span class="device-pill ready">TOUCH</span>
        <span class="device-pill ${gamepadConnectedFlag ? "ready" : ""}">${gamepadConnectedFlag ? "CONTROLLER" : "NO CONTROLLER YET"}</span>
      </div>

      <div class="controls-grid">
        <!-- SECTION 1: KEYBOARD MAPPING -->
        <div class="ctrl-section">
          <div class="ctrl-sec-title">KEYBOARD</div>
          <div class="ctrl-rows">
            <button class="ctrl-btn ${reb && reb.field === "keyUp" ? "listening" : ""}" id="ctrl-keyUp">
              <span>Move up</span><span class="ctrl-val">${keyBtnLabel("keyUp", "KeyW")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyDown" ? "listening" : ""}" id="ctrl-keyDown">
              <span>Move down</span><span class="ctrl-val">${keyBtnLabel("keyDown", "KeyS")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyLeft" ? "listening" : ""}" id="ctrl-keyLeft">
              <span>Move left</span><span class="ctrl-val">${keyBtnLabel("keyLeft", "KeyA")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyRight" ? "listening" : ""}" id="ctrl-keyRight">
              <span>Move right</span><span class="ctrl-val">${keyBtnLabel("keyRight", "KeyD")}</span>
            </button>
            <button class="ctrl-btn" id="ctrl-arrowMove" data-opt-cycle="1">
              <span>Arrow keys move too</span><span class="ctrl-val">◀ ${c.arrowMove !== false ? "ON" : "OFF"} ▶</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyPause" ? "listening" : ""}" id="ctrl-keyPause">
              <span>Pause</span><span class="ctrl-val">${keyBtnLabel("keyPause", "Space")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyView" ? "listening" : ""}" id="ctrl-keyView">
              <span>${window.ENABLE_3D_VIEWS ? "Switch View (2D/3D)" : "Screenshot"}</span><span class="ctrl-val">${keyBtnLabel("keyView", "KeyV")}</span>
            </button>
            <button class="ctrl-btn ${reb && reb.field === "keyMute" ? "listening" : ""}" id="ctrl-keyMute">
              <span>Mute</span><span class="ctrl-val">${keyBtnLabel("keyMute", "KeyM")}</span>
            </button>
          </div>
        </div>

        <!-- SECTION 2: GAME CONTROLLER + MOUSE + TOUCH -->
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="ctrl-section">
            <div class="ctrl-sec-title">CONTROLLER</div>
            <div class="ctrl-rows">
              <button class="ctrl-btn ${reb && reb.field === "padConfirmBtn" ? "listening" : ""}" id="ctrl-padConfirmBtn" data-opt-cycle="1">
                <span>Confirm</span><span class="ctrl-val">${padBtnLabel("padConfirmBtn", 0)}</span>
              </button>
              <button class="ctrl-btn ${reb && reb.field === "padPauseBtn" ? "listening" : ""}" id="ctrl-padPauseBtn" data-opt-cycle="1">
                <span>Pause</span><span class="ctrl-val">${padBtnLabel("padPauseBtn", 9)}</span>
              </button>
              <button class="ctrl-btn ${reb && reb.field === "padViewBtn" ? "listening" : ""}" id="ctrl-padViewBtn" data-opt-cycle="1">
                <span>${window.ENABLE_3D_VIEWS ? "Switch 2D/3D View" : "Screenshot"}</span><span class="ctrl-val">${padBtnLabel("padViewBtn", 3)}</span>
              </button><!-- 3D is parked, so its bindings stay hidden (Fable review) -->
              <button class="ctrl-btn ${reb && reb.field === "padMuteBtn" ? "listening" : ""}" id="ctrl-padMuteBtn" data-opt-cycle="1">
                <span>Mute</span><span class="ctrl-val">${padBtnLabel("padMuteBtn", 2)}</span>
              </button>
              <button class="ctrl-btn" id="ctrl-padDeadzone" data-opt-cycle="1">
                <span>Stick dead zone</span><span class="ctrl-val">◀ ${pDead.label} ▶</span>
              </button>
            </div>
          </div>

          <div class="ctrl-section">
            <div class="ctrl-sec-title" id="ctrl-touch-title">MOUSE AND TOUCH</div>
            <div class="ctrl-rows">
              <button class="ctrl-btn" id="ctrl-mouseMoveMode" data-opt-cycle="1">
                <span>Mouse movement</span><span class="ctrl-val">◀ ${mMode.label} ▶</span>
              </button>
              <button class="ctrl-btn" id="ctrl-mouseRightClick" data-opt-cycle="1">
                <span>Right-click</span><span class="ctrl-val">◀ ${rMode.label} ▶</span>
              </button>
${window.ENABLE_3D_VIEWS ? `
              <button class="ctrl-btn" id="ctrl-mouseWheelView" data-opt-cycle="1">
                <span>Mouse Wheel View</span><span class="ctrl-val">◀ ${c.mouseWheelView !== false ? "ON (Cycles 2D/3D)" : "OFF"} ▶</span>
              </button>
` : ""}<!-- 3D is parked, so its bindings stay hidden (Fable review) -->
              <button class="ctrl-btn" id="ctrl-touchMode" data-opt-cycle="1">
                <span>Touch stick</span><span class="ctrl-val">◀ ${tMode.label} ▶</span>
              </button>
              <button class="ctrl-btn" id="ctrl-touchSensitivity" data-opt-cycle="1">
                <span>Touch sensitivity</span><span class="ctrl-val">◀ ${tSens.label} ▶</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="controls-actions">
        <button class="cta-btn" id="ctrl-done-btn">DONE</button>
        <button class="cta-btn secondary-btn" id="ctrl-reset-btn">RESET ALL</button>
      </div>
      <div class="nav-hint-bar">
        <span><b>Arrows / D-pad</b> move</span>
        <span><b>Enter / A</b> change</span>
        <span><b>Esc / B</b> done</span>
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

function renderLevelUpModal(choices, customTitle, onPick, skip, reroll) {
  const modal = document.getElementById("levelup-modal");
  const title = document.getElementById("lv-title");
  const kicker = document.getElementById("lv-kicker");
  const grid = document.getElementById("lv-cards");
  if (!modal || !grid) return;

  // B1 (design system): the Sheet header is a memo strip, one naming pattern: DEPARTMENT · RE: Subject
  kicker.className = "modal-kicker ms-sheet-strip";
  kicker.innerHTML = customTitle ? "PAYROLL · RE: <b>Performance bonus</b>" : `HR · RE: <b>Promotion level ${level - pendingLevels + 1}</b>`;
  title.textContent = customTitle || "SELECT YOUR MIDLIFE PERK";
  grid.innerHTML = "";
  ensureLoadoutCss();
  let build = document.getElementById("lv-build");
  if (!build) { build = document.createElement("div"); build.id = "lv-build"; build.className = "lo-build"; grid.parentNode.insertBefore(build, grid); }
  build.innerHTML = loadoutSlotsHtml({ labels: true, tally: true });
  const openedAt = performance.now();
  const isTouchUI = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  let armed = null;

  const cardEls = choices.map((up, i) => {
    const info = UPGRADE_META[up.name] || { icon: "⭐", tag: "PERK VOUCHER", rarity: "common" };
    const curRank = (stats && stats.perkRanks && up.id) ? (stats.perkRanks[up.id] || 0) : 0;
    // Plain labels a new player can read at a glance (from Rami's design doc).
    const plain = up.isEvolution || info.rarity === "evo" ? "EVOLUTION"
      : up.name.startsWith("Unlock:") ? "NEW WEAPON"
      : (up.isConsumable || up.name === "Annual Checkup") ? "BOOST"
      : info.rarity === "passive" ? "PASSIVE" : "UPGRADE";
    const LO = window.LOADOUT, cat = LO && LO.catOf(up), kind = LO && LO.kindOf(up), held = LO && stats ? LO.held(stats) : null;
    const newSlot = held && ((kind === "weapon" && plain === "NEW WEAPON") ? `SLOT ${held.weapons.length + 1} OF ${LO.weaponSlots}`
      : (kind === "passive" && curRank === 0) ? `SLOT ${held.passives.length + 1} OF ${LO.passiveSlots}` : "");
    const rankLabel = newSlot ? `${plain === "NEW WEAPON" ? plain : "NEW PASSIVE"} · ${newSlot}`
      : (!up.isConsumable && up.maxRank && up.maxRank > 1 && up.maxRank < 50)
      ? `${plain} · LEVEL ${curRank + 1} OF ${up.maxRank}`
      : plain;
    const evoNext = evoNextNote(up);
    const card = document.createElement("div");
    card.className = `perk-card rarity-${info.rarity}${evoNext && !evoNext.soon ? " evo-next" : ""}`;
    const sty = cat && LO.cats[cat];
    if (sty) { card.dataset.style = cat; card.style.setProperty("--sc", sty.color); card.style.setProperty("--sink", sty.ink); }
    card.innerHTML = `
      ${sty ? `<div class="perk-style">${styleGlyph(cat, 2)}${sty.label}</div>` : ""}
      <div class="perk-ribbon">${rankLabel}</div>
      <div class="perk-icon">${pixelIcon("card", up.name, info.icon, 64)}</div>
      <div class="perk-name">${heroWord(up.name)}</div>
      <div class="perk-desc">${evoNext ? `<span class="perk-evo${evoNext.soon ? " soon" : ""}">${evoNext.soon ? "1 MORE PICK TO EVOLVE" : "✨ UNLOCKS AN EVOLUTION"}<b>${heroWord(evoNext.name)}</b></span>` : ""}${heroWord(up.text)}${!evoNext && evoPairNote(up) ? `<span class="perk-pair">${heroWord(evoPairNote(up))}</span>` : ""}</div>
      <div class="perk-key">${isTouchUI ? "TAP TO SELECT" : `${i + 1}`}</div>
    `;
    bindNavItem(card, 0, e => {
      // Ignore taps in the first moment after the menu appears, so a finger that was steering doesn't grab a perk.
      if (performance.now() - openedAt < 450) return;
      // Touch: first tap selects, second tap on the same card confirms.
      const pt = e && e.pointerType;
      if (pt && pt !== "mouse" && armed !== card) {
        cardEls.forEach(c => { c.classList.remove("armed"); c.querySelector(".perk-key").textContent = "TAP TO SELECT"; });
        armed = card; card.classList.add("armed");
        card.querySelector(".perk-key").textContent = "TAP AGAIN OR PICK";
        window.menuNav.focus(card, false, true);
        if (pickEl) { pickEl.disabled = false; pickEl.classList.remove("disabled"); pickEl.querySelector(".ms-btn-sub").textContent = heroWord(up.name).replace(/<[^>]+>/g, "").replace(/^Unlock:\s*/, ""); }
        sfx("move");
        return;
      }
      modal.classList.add("hidden");
      onPick(up);
    }, i === 0);
    grid.appendChild(card);
    return card;
  });

  // Design system B1: the Sheet's action bar, pinned at the bottom. Secondaries on the left (SKIP, REROLL),
  // the one primary on the right (PICK = the selected card). Plain verbs; the joke goes in the line underneath.
  ["lv-actions", "lv-skip", "lv-reroll", "lv-legend"].forEach(id => { const o = document.getElementById(id); if (o) o.remove(); });
  const actions = document.createElement("div"); actions.id = "lv-actions"; actions.className = "ms-sheet-actions";
  actions.innerHTML = `<div class="ms-left"></div>`;
  grid.parentNode.insertBefore(actions, grid.nextSibling);
  const left = actions.querySelector(".ms-left");
  const btn = (id, cls, label, sub) => { const b = document.createElement("button"); b.type = "button"; b.id = id; b.className = "ms-btn " + cls;
    b.innerHTML = `<span class="ms-btn-label">${label}</span><span class="ms-btn-sub">${sub}</span>`; return b; };
  const done = () => { modal.classList.add("hidden"); actions.remove(); const lg = document.getElementById("lv-legend"); if (lg) lg.remove(); };
  // SKIP (only when a choice would add something new to your loadout)
  const anyNew = window.LOADOUT && choices.some(up => { const k = LOADOUT.kindOf(up); return (k === "weapon" && up.name.startsWith("Unlock:")) || (k === "passive" && !((stats.perkRanks || {})[up.id] > 0)); });
  let skipEl = null, rerollEl = null, pickEl = null;
  const doSkip = () => { if (!skipEl || performance.now() - openedAt < 450) return false; done(); onPick(skip); return true; };
  const doReroll = () => { if (!rerollEl || performance.now() - openedAt < 450) return false; actions.remove(); reroll.go(); return true; };
  if (skip && anyNew) {
    skipEl = btn("lv-skip", "secondary", "SKIP", "Keep my loadout. Heal 2 HP.");
    left.appendChild(skipEl); bindNavItem(skipEl, 1, doSkip);
  }
  // REROLL (Sleep On It, Nov 5): new cards. Charges come from the 401(k) shop, unlocked at age 55.
  if (reroll && reroll.left > 0) {
    rerollEl = btn("lv-reroll", "secondary", "REROLL", `Sleep on it. ${reroll.left} left.`);
    left.appendChild(rerollEl); bindNavItem(rerollEl, 1, doReroll);
  }
  // PICK: confirms the selected card. On touch it waits until you've tapped one.
  const selected = () => armed || cardEls.find(c => c.classList.contains("selected")) || (isTouchUI ? null : cardEls[0]);
  const doPick = () => { const c = selected(); if (!c || performance.now() - openedAt < 450) return false; done(); onPick(choices[cardEls.indexOf(c)]); return true; };
  pickEl = btn("lv-pick", "primary", "PICK", isTouchUI ? "Tap a card first" : "The selected card");
  if (isTouchUI) { pickEl.disabled = true; pickEl.classList.add("disabled"); }
  actions.appendChild(pickEl); bindNavItem(pickEl, 1, doPick);
  // Footer legend: only for a controller or a keyboard
  const padOn = !!(navigator.getGamepads && Array.from(navigator.getGamepads() || []).some(g => g && g.connected));
  if (padOn || !isTouchUI) {
    const lg = document.createElement("div"); lg.id = "lv-legend"; lg.className = "ms-legend";
    lg.innerHTML = padOn ? `<span><kbd>A</kbd>Pick</span>${rerollEl ? "<span><kbd>X</kbd>Reroll</span>" : ""}${skipEl ? "<span><kbd>Y</kbd>Skip</span>" : ""}`
      : `<span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd>Pick</span><span><kbd>Enter</kbd>Confirm</span>${rerollEl ? "<span><kbd>R</kbd>Reroll</span>" : ""}`;
    actions.parentNode.insertBefore(lg, actions.nextSibling);
  }

  function highlightCard(idx) {
    const target = cardEls[idx];
    if (target) window.menuNav.focus(target, false);
  }

  // Short, device-appropriate hint instead of listing every input method.
  const sub = modal.querySelector(".modal-sub");
  if (sub) sub.innerHTML = isTouchUI ? "Tap a card, then tap PICK." : "Choose one card."; // B1: the keys live in the legend
  modal.classList.remove("hidden");
  window.menuNav.refresh();

  return {
    highlight: highlightCard,
    close: () => modal.classList.add("hidden"),
    reroll: doReroll,   // controller X, keyboard R
    skip: doSkip        // controller Y
  };
}

// Shop button badge (Nov 5, Rami): "NEW" when an item unlocked since you last opened the shop,
// otherwise how many upgrades you can afford right now. Nothing when there's nothing to do.
function shopBadgeInfo(m) {
  const open = (window.META_SHOP || []).filter(it => !(window.shopItemLocked && shopItemLocked(it, m)));
  const seen = (m && m.shopSeen) || [];
  const fresh = open.filter(it => it.unlockAchievement && !seen.includes(it.id));
  const afford = open.filter(it => { const r = (m.ranks && m.ranks[it.id]) || 0; return r < it.maxRank && (m.coins || 0) >= shopPrice(it, m); });
  return { fresh, afford };
}
function shopBadgeHtml(m) {
  if (!m) return "";
  const { fresh, afford } = shopBadgeInfo(m);
  if (fresh.length) return ` <span class="shop-badge new" title="${fresh.map(f => f.name).join(", ")} unlocked">NEW</span>`;
  if (afford.length) return ` <span class="shop-badge" title="You can afford ${afford.length} upgrade${afford.length > 1 ? "s" : ""}">${afford.length}</span>`;
  return "";
}
function markShopSeen(m) {
  const { fresh } = shopBadgeInfo(m);
  if (!fresh.length) return;
  m.shopSeen = ((m.shopSeen) || []).concat(fresh.map(f => f.id));
  if (typeof saveMeta === "function") saveMeta(m);
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
    const status = sel ? "✓ ACTIVE" : (owned ? "SELECT" : ch.unlock ? `🔒 ${ch.lockedLabel || "LOCKED"}` : `🔒 ${ch.cost}k`);
    return `
      <div class="dossier-char ${sel ? "selected" : ""} ${owned ? "owned" : "locked"}" data-char="${ch.id}">
        <div class="char-emoji">${pixelIcon("char", ch.id, CHAR_ICONS[ch.id] || "☕", 64)}</div>
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

  // Coins spent so far in the 401(k) Shop (rank r of an item cost baseCost x (1 + 2 + ... + r)).
  // Plus the extra paid to "lifestyle inflation" since Nov 5 (meta.shopInflationPaid), so a refund gives back everything.
  const shopSpent = META_SHOP.reduce((sum, item) => { const r = meta.ranks[item.id] || 0; return sum + item.baseCost * r * (r + 1) / 2; }, 0) + (meta.shopInflationPaid || 0);
  const shopRowsHtml = META_SHOP.map(item => {
    const rank = meta.ranks[item.id] || 0;
    const locked = window.shopItemLocked && shopItemLocked(item, meta);
    const maxed = rank >= item.maxRank;
    const cost = shopPrice(item, meta);
    const canBuy = !locked && !maxed && meta.coins >= cost;
    // Design system B4: one Row per upgrade. The whole row buys; the tag on the right says the price, MAXED or why it's locked.
    const state = locked ? "locked" : maxed ? "done" : canBuy ? "" : "short";
    return `
      <button type="button" class="ms-row shop-r ${state}" data-shop="${item.id}" ${locked || maxed ? 'aria-disabled="true"' : ""}>
        <span class="shop-r-ic" aria-hidden="true">${locked ? "" : (item.icon || "🪙")}</span>
        <span><span class="ms-row-title">${item.name}</span>
          <span class="shop-r-pips" aria-label="Level ${rank} of ${item.maxRank}">${Array.from({ length: item.maxRank }, (_, i) => `<i class="${i < rank ? "on" : ""}"></i>`).join("")}</span>
          <span class="ms-row-sub">${locked ? (item.lockedDesc || "Locked.") : item.desc}</span></span>
        <span class="shop-r-tag">${locked ? "LOCKED" : maxed ? "MAXED" : `${cost}k`}</span>
      </button>
    `;
  }).join("");

  // Start is the big button. A saved run is a smaller "continue" link under it, so new players aren't confused.
  const resumeBannerHtml = savedRun ? `
    <button class="t-style-btn resume-saved-btn" id="title-resume-btn" style="width:100%;margin-top:6px;">
      ↩ Continue saved run (age ${Math.floor(Number(savedRun.currentAge))}, level ${savedRun.level})
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
  const fullOk = window.isFullLifeUnlocked && isFullLifeUnlocked(meta);
  const curMode = (meta.runMode === "full" && fullOk) ? "full" : "midlife";
  const startAge = curMode === "full" ? (meta.startDecade || 40) : 40; // START AT only applies to Full Life
  const TB = window.TAX_BRACKET, tb = meta.taxBracket || 0;
  const sprintOk = !!(window.SPRINT && window.isSprintUnlocked && isSprintUnlocked(meta)), sprintOn = sprintOk && !!meta.sprint;
  const firstShift = !(meta.runsPlayed > 0); // Gemini Argon (Nov 4): a brand-new player sees just PUNCH IN; Mode and Tax show after the first run
  // Nov 9: LOCATION picker. The Office, or Maple Hollow once your best age reaches 55. Picking rebuilds the world behind the title.
  const homeOk = !!(window.homeUnlocked && homeUnlocked(meta)), here = window.STAGE_ID || "office";
  const locationRowHtml = window.MAPLE_HOLLOW ? `
      <div class="title-style-switcher title-location-row"><span>LOCATION:</span>
        <button class="t-style-btn ${here === "office" ? "active" : ""}" data-loc="office" title="The office. Where it all started.">🏢 THE OFFICE</button>
        <button class="t-style-btn ${here === "home" ? "active" : ""}" data-loc="home" ${homeOk ? "" : "disabled style='opacity:0.45;cursor:not-allowed'"} title="${MAPLE_HOLLOW.tagline}">${homeOk ? "🍁 MAPLE HOLLOW" : `🔒 MAPLE HOLLOW (AGE ${MAPLE_HOLLOW.unlockAge})`}</button>
      </div>
      <div class="title-mode-blurb">${here === "home" ? MAPLE_HOLLOW.tagline + " Early build: the neighborhood is here; its own enemies, the shop and your house come next." : homeOk ? "New: Maple Hollow, the neighborhood stage." : `Reach age ${MAPLE_HOLLOW.unlockAge} in a run to unlock Maple Hollow.`}</div>` : "";
  const modeRowHtml = locationRowHtml + `
      <div class="title-style-switcher title-mode-row"><span>MODE:</span>
        <button class="t-style-btn ${curMode === "midlife" ? "active" : ""}" data-mode="midlife" title="${RUN_MODES.midlife.blurb}">🗂️ MIDLIFE · 40-65</button>
        <button class="t-style-btn ${curMode === "full" ? "active" : ""}" data-mode="full" ${fullOk ? "" : "disabled style='opacity:0.45;cursor:not-allowed'"} title="${fullOk ? RUN_MODES.full.blurb : RUN_MODES.full.unlockText}">${fullOk ? "🕰️" : "🔒"} FULL LIFE · 40-100</button>
      </div>
      <div class="title-mode-blurb">${curMode === "full" ? RUN_MODES.full.blurb : RUN_MODES.midlife.blurb}${sprintOn ? " Half that with Sprint." : ""}${fullOk ? "" : " Full Life unlocks with the Retirement Plan achievement."}</div>
      <div class="title-style-switcher title-sprint-row"><span>SPRINT:</span>
        <button class="t-style-btn ${sprintOn ? "active" : ""}" data-sprint="toggle" ${sprintOk ? "" : "disabled style='opacity:0.45;cursor:not-allowed'"} title="${sprintOk ? SPRINT.blurb : SPRINT.unlockText}" aria-pressed="${sprintOn}">${sprintOk ? (sprintOn ? "⚡ ON" : "OFF") : "🔒 LOCKED"}</button>
      </div>
      <div class="title-mode-blurb">${sprintOk ? SPRINT.blurb : SPRINT.unlockText}</div>
      <div class="title-style-switcher title-tax-row"><span>TAX BRACKET:</span>
        <button class="t-style-btn" data-tax="-1" ${tb <= 0 ? "disabled style='opacity:0.4'" : ""} aria-label="Lower tax bracket">−</button>
        <b class="tax-val ${tb > 0 ? "on" : ""}">${tb} · ${TB.labels[tb]}</b>
        <button class="t-style-btn" data-tax="1" ${tb >= TB.maxLevel ? "disabled style='opacity:0.4'" : ""} aria-label="Raise tax bracket">+</button>
      </div>
      <div class="title-mode-blurb">${tb > 0 ? `Enemies +${Math.round(tb * TB.perLevel.enemyHpMult * 100)}% HP, hit harder, heals weaker. Coins +${Math.round(tb * TB.perLevel.coinMult * 100)}%, XP +${Math.round(tb * TB.perLevel.xpMult * 100)}%, score +${Math.round(tb * TB.perLevel.scoreMult * 100)}%.` : "Optional: raise it for harder runs and bigger rewards."}</div>`;
  const backBtn = `<button class="t-style-btn title-back-btn" id="title-back-btn">◀ BACK</button>`;
  // The bottom tiles (your file, today's shift, devlog memo) show on every title view. In the shop, extras and
  // other panels they can fold away (auto-folded when the screen is short). The panel opens above them.
  const selChAll = CHARACTERS.find(c => c.id === meta.selectedChar) || CHARACTERS[0];
  if (window.titleBandFolded == null || window._titleBandView !== view) {
    window._titleBandView = view;
    window.titleBandFolded = view !== "main"; // panels get the room: the tiles fold into buttons (Rami, Nov 3)
  }
  const bandFold = view !== "main" && window.titleBandFolded;
  const bandHtml = `<div class="tp-band-wrap${bandFold ? " folded" : ""}">
      ${view !== "main" ? `<button class="t-style-btn tp-band-toggle" id="tp-band-toggle" aria-expanded="${!bandFold}">${bandFold ? "▴ SHOW YOUR TILES" : "▾ FOLD YOUR TILES"}</button>` : ""}
      <div class="tp-band">
        ${titleFileTile()}
        <section class="tp-tile tp-crew" aria-label="Today's shift: pick your employee and punch in">
          <div class="tp-tile-tag tp-shift-tag">TODAY'S SHIFT</div>
          <div class="tp-label">Today's employee <b>${selChAll.name}</b> <span>${selChAll.tagline}</span></div>
          <div class="dossier-chars-grid tp-badges">${charCardsHtml}</div>
          <div class="tp-punch-slot"></div>
        </section>
        <aside class="tp-memo" id="title-memo" aria-label="Latest from the devlog">
          <div class="tp-memo-tag">DEVLOG · NEW MEMO</div>
          <div class="tp-memo-body"><div class="tp-memo-title">Build notes from the dev.</div></div>
          <button class="t-style-btn tp-memo-btn" id="title-devlog-btn">📝 READ THE DEVLOG</button>
          <div class="tp-memo-foot" id="title-memo-foot">${verInfo.displayVersion}</div>
        </aside>
        <div class="title-secondary tp-links">
          <button class="t-style-btn" id="title-shop-btn">🪙 401(k) SHOP${shopBadgeHtml(meta)}</button>
          <button class="t-style-btn" id="title-controls-btn">⚙️ SETTINGS</button>
          <button class="t-style-btn" id="title-extras-btn">✨ EXTRAS</button>
          <button class="t-style-btn" id="title-leaders-btn">🏆 LEADERBOARD</button>
          <button class="t-style-btn t-coffee-btn" id="title-coffee-btn">☕ BUY THE DEV A COFFEE</button>
        </div>
      </div>
`;
  const bandTail = `</div>`;
  // Design system B5 (approved Nov 10): on phones a bottom bar replaces the site's top nav while you're on the title.
  const tabBar = `<nav class="tp-tabbar" id="tp-tabbar" aria-label="Title menu">
      ${[["shop", "title-shop-btn", "Shop", "🪙"], ["leaders", "title-leaders-btn", "Scores", "🏆"], ["extras", "title-extras-btn", "Extras", "✨"], ["settings", "title-controls-btn", "Settings", "⚙️"], ["devlog", "title-devlog-btn", "Devlog", "📝"]]
        .map(([v, target, label, ic]) => `<button type="button" class="tp-tab${view === v ? " on" : ""}" data-tab-target="${target}"><span class="tp-tab-ic" aria-hidden="true">${ic}</span><span class="tp-tab-l">${label}</span></button>`).join("")}
    </nav>`;
  let bodyHtml = "";
  if (view === "shop") {
    markShopSeen(meta); // opening the shop clears the NEW tag
    bodyHtml = `
      <div class="shop-head">
        <div class="shop-bal"><span>YOUR 401(K)</span><b>${meta.coins}k</b></div>
        <p class="ms-sheet-help">Permanent upgrades. They carry into every run. Tap one to buy it.</p>
      </div>
      <div class="ms-rows shop-rows">${shopRowsHtml}${(window.SHOP_COMING_SOON || []).map(c => `
        <div class="ms-row shop-r locked shop-mystery" aria-label="Coming soon">
          <span class="shop-r-ic" aria-hidden="true">?</span>
          <span><span class="ms-row-title">Classified benefit</span><span class="ms-row-sub">${c.hint}</span></span>
          <span class="shop-r-tag">SOON</span>
        </div>`).join("")}</div>
      ${shopSpent > 0 ? `<div class="shop-refund-note">Changed your mind? Get back every coin you've spent (${shopSpent}k) and buy different upgrades.</div>` : ""}
      <div class="title-secondary">${shopSpent > 0 ? `<button class="t-style-btn shop-refund-btn" id="shop-refund-btn">↺ REFUND ALL (${shopSpent}k)</button>` : ""}${backBtn}</div>`;
  } else if (view === "leaders") {
    bodyHtml = `
      <div class="title-subhead">🏆 LEADERBOARD</div>
      <div id="title-leaderboard"></div>
      <div class="title-secondary">${backBtn}</div>`;
  } else if (view === "achievements") {
    const got = (meta.achievements && meta.achievements.unlocked) || {};
    const list = window.ACHIEVEMENTS || [];
    const n = list.filter(a => got[a.id]).length;
    bodyHtml = `
      <div class="title-subhead">🏅 ACHIEVEMENTS · ${n} of ${list.length}</div>
      <div class="ach-grid">${list.map(a => `
        <div class="ach-tile ${got[a.id] ? "got" : "locked"}">
          <div class="ach-icon">${got[a.id] ? a.icon : "🔒"}</div>
          <div class="ach-name">${a.name}</div>
          <div class="ach-desc">${a.desc}</div>
          <div class="ach-reward">${got[a.id] ? "✓ EARNED" : `+${a.reward}k`}</div>
        </div>`).join("")}</div>
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
      <div class="title-poll-tile" data-ms-poll="stage-first-v1"></div>
      <div class="title-style-switcher"><span>START AT (FULL LIFE):</span>${decadeBtnsHtml}</div>
      ${window.SHOW_STAGE_PICKER ? `<div class="title-style-switcher" style="margin-top:6px;"><span>LOCATION:</span>${stageBtnsHtml}</div>` : ""}<!-- hidden until a second stage exists (Fable review) -->
      <div class="title-secondary">
        <button class="t-style-btn" id="title-lore-btn">📖 LORE</button>
        <button class="t-style-btn" id="title-changelog-btn">📜 PATCH NOTES</button>
        <button class="t-style-btn" id="title-credits-btn">🎬 CREDITS</button>
        <button class="t-style-btn" id="title-ach-btn">🏅 ACHIEVEMENTS</button>
        <button class="t-style-btn" id="title-discord-btn">💬 DISCORD</button>
        <button class="t-style-btn danger-btn" id="title-reset-btn">🗑️ RESET PROGRESS</button>
        <button class="t-style-btn" id="title-art-test-btn">🎨 ART ROOM</button>
        ${backBtn}
      </div>`;
  } else {
    // Poster title (Nov 3): the key art is the hero. Punch In sits by the time clock, the swarm stays visible,
    // the character pick is a row of ID badges, and a pinned memo makes this the front door to the devlog.
    const selCh = CHARACTERS.find(c => c.id === meta.selectedChar) || CHARACTERS[0];
    const settingsOpen = !!window.titleSettingsOpen;
    bodyHtml = `
      <div class="tp-brand">
        <div class="memo-strip"><span class="re">INTERNAL MEMO · RE:</span><strong>${curMode === "full" ? "Surviving 40 to 100" : "Surviving 40 to 65"}</strong></div>
        <h1 class="game-logo tp-logo"><span>MIDLIFE</span><span>SURVIVORS</span></h1>
        <p class="game-tagline">${curMode === "full" ? "Survive from 40 to 100. Death is patient." : "Survive from 40 to 65. Retirement is waiting."}</p>
        ${titleVersionHtml(verInfo)}
      </div>
      <div class="tp-punch">
        <button class="cta-btn clock-in-btn" id="title-clockin-btn"><span class="tp-punch-ico" aria-hidden="true">⏱</span> PUNCH IN${startAge !== 40 ? ` AT ${startAge}` : ""}</button>
        ${resumeBannerHtml}
${firstShift ? "" : `<button class="t-style-btn tp-settings-chip ${settingsOpen ? "active" : ""}" id="title-settings-btn" aria-expanded="${settingsOpen}"><span class="tp-chip-k">SHIFT</span> <b>${here === "home" ? "Maple Hollow" : "The Office"}</b> · ${curMode === "full" ? "Full Life 40-100" : "Midlife 40-65"}${sprintOn ? " · Sprint" : ""} · Tax ${tb} ${settingsOpen ? "▴" : "▾"}</button>`}
        ${settingsOpen && !firstShift ? `<div class="tp-settings">${modeRowHtml}</div>` : ""}
      </div>
      ${bandHtml}${bandTail}`;
  }

  modal.dataset.view = view;
  document.documentElement.classList.add("ms-title"); window._msTitle = true; // B5 (the game loop clears it when a run starts)
  modal.innerHTML = view === "main" ? `
    <div class="title-poster" data-view="main">${bodyHtml}${titleNewPop() || titlePollPop()}</div>${tabBar}
  ` : `
    <div class="title-poster sub-view" data-view="${view}">
    <div class="modal-card title-box title-clean tp-panel" data-view="${view}">
      <div class="memo-strip"><span class="re">INTERNAL MEMO · RE:</span><strong>${({ main: "Surviving 40 to 65", shop: "Your 401(k)", extras: "Extras", achievements: "Performance record", leaders: "Leaderboard", credits: "Credits" })[view] || "Surviving 40 to 65"}</strong></div>
      <h1 class="game-logo">MIDLIFE SURVIVORS</h1>
      <p class="game-tagline">${curMode === "full" ? "Survive from 40 to 100. Death is patient." : "Survive from 40 to 65. Retirement is waiting."}</p>
      ${bodyHtml}
      <div class="title-version">${verInfo.displayVersion}</div>
    </div>
    ${bandHtml}${bandTail}
    </div>${tabBar}
  `;
  fillTitleMemo();
  // B5: the phone tab bar presses the same buttons the tiles have (one action, two doors)
  modal.querySelectorAll(".tp-tab").forEach(t => t.addEventListener("click", e => { e.stopPropagation(); const el = document.getElementById(t.dataset.tabTarget);
    if (el) { sfx("pick"); el.dispatchEvent(new Event("nav-activate", { bubbles: true })); } }));
  if (window.MSPoll) MSPoll.mountAll(modal);
  if (view === "main") placeTitlePunch();
  if (window.TitleSlides) TitleSlides.start(); // the art keeps playing behind every title panel
  const bandToggle = document.getElementById("tp-band-toggle");
  if (bandToggle) bindNavItem(bandToggle, 98, () => { window.titleBandFolded = !window.titleBandFolded; sfx("pick"); renderTitleModal(scene, "#tp-band-toggle"); });
  requestAnimationFrame(() => { const bw = modal.querySelector(".tp-band-wrap"); document.documentElement.style.setProperty("--tp-band-h", (bw ? bw.offsetHeight : 0) + "px"); });
  // Version line + "what's new" bubble (Nov 3, Rami): shows once per version, tap the line to see it again.
  const verBtn = document.getElementById("title-ver-btn");
  if (verBtn) bindNavItem(verBtn, 7, () => { window.titleNewOpen = !titleNewVisible(); if (!window.titleNewOpen) markVersionSeen(); sfx("pick"); renderTitleModal(scene, "#title-ver-btn"); });
  const newPop = document.getElementById("tp-new-pop");
  if (newPop) {
    newPop.querySelector(".tp-poll-pill").addEventListener("click", () => newPop.classList.add("open"));
    document.getElementById("tp-new-x").addEventListener("click", e => { e.stopPropagation(); window.titleNewOpen = false; markVersionSeen(); sfx("pick"); renderTitleModal(scene); });
    document.getElementById("tp-new-all").addEventListener("click", e => { e.stopPropagation(); window.titleNewOpen = false; markVersionSeen(); sfx("pick"); renderTitleModal(scene); openChangelogModal(scene); });
  }
  const settingsBtn = document.getElementById("title-settings-btn");
  if (settingsBtn) bindNavItem(settingsBtn, 9.5, () => { window.titleSettingsOpen = !window.titleSettingsOpen; sfx("pick"); renderTitleModal(scene, "#title-settings-btn"); });

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
  const achBtn = document.getElementById("title-ach-btn");
  if (achBtn) bindNavItem(achBtn, 10, () => { window.titleBackTo = "extras"; goView("achievements"); });
  // Employee file: the achievements stat and the feed's buttons (Nov 4). Back from achievements returns to the title.
  const acctBtn = document.getElementById("title-acct");
  if (acctBtn) bindNavItem(acctBtn, 8.7, () => { sfx("pick"); Account.open(); });
  if (window.Account) Account.onTitle();
  const fileAch = document.getElementById("title-file-ach");
  if (fileAch) bindNavItem(fileAch, 8.5, () => { window.titleBackTo = "main"; goView("achievements"); });
  document.querySelectorAll("[data-file-go]").forEach(b => bindNavItem(b, 8.4, () => {
    const g = b.dataset.fileGo;
    if (g === "whatsnew") { window.titleNewOpen = true; sfx("pick"); renderTitleModal(scene); return; }
    if (g === "achievements") window.titleBackTo = "main";
    goView(g);
  }));
  const fmore = document.getElementById("tp-fmore");
  if (fmore) bindNavItem(fmore, 8.6, () => {
    const ul = document.querySelector(".tp-feed"); if (!ul) return;
    const n = +ul.dataset.pages, pg = (+ul.dataset.page + 1) % n; ul.dataset.page = pg;
    ul.querySelectorAll(".tp-fi").forEach(li => { li.hidden = +li.dataset.pg !== pg; });
    fmore.querySelector("span").textContent = `${pg + 1}/${n}`; sfx("pick");
  });
  // Ko-fi tip jar: opens in a new tab so the game stays put
  const coffeeBtn = document.getElementById("title-coffee-btn");
  if (coffeeBtn) bindNavItem(coffeeBtn, 10, () => { window.open("https://ko-fi.com/ramidaud", "_blank", "noopener"); });
  // Discord community: new tab, same as the coffee button
  const discordBtn = document.getElementById("title-discord-btn");
  if (discordBtn) bindNavItem(discordBtn, 10, () => { window.open("https://discord.gg/E6N9j5tZe", "_blank", "noopener"); });
  // Reset Progress: tap twice (no pop-up dialogs). Clears coins, shop, unlocks and achievements; keeps your leaderboard name.
  const resetBtn = document.getElementById("title-reset-btn");
  if (resetBtn) bindNavItem(resetBtn, 10, () => {
    if (!resetBtn.dataset.armed) { resetBtn.dataset.armed = "1"; resetBtn.textContent = "⚠️ TAP AGAIN TO ERASE EVERYTHING"; sfx("move"); return; }
    try { localStorage.removeItem("midlife_survivors_save_v1"); localStorage.removeItem("midlife_survivors_active_run_v1"); } catch (e) {}
    location.reload();
  });
  const devlogBtn = document.getElementById("title-devlog-btn");
  if (devlogBtn) bindNavItem(devlogBtn, 12, () => { window.location.href = devlogBtn.onclickTarget || "devlog/"; }); // same tab: the devlog's Play button brings you right back
  const artTestBtn = document.getElementById("title-art-test-btn");
  if (artTestBtn) bindNavItem(artTestBtn, 10, () => { window.location.href = "devlog/art/"; });
  const refundBtn = document.getElementById("shop-refund-btn");
  if (refundBtn) bindNavItem(refundBtn, 98, () => {
    if (!refundBtn.dataset.armed) { refundBtn.dataset.armed = "1"; refundBtn.textContent = `TAP AGAIN TO REFUND ${shopSpent}k`; sfx("move"); return; }
    meta.coins += shopSpent;
    META_SHOP.forEach(item => { meta.ranks[item.id] = 0; }); meta.shopInflationPaid = 0;
    saveMeta(meta); sfx("billPaid");
    renderTitleModal(scene, ".shop-r"); updateHUD();
  });
  const backEl = document.getElementById("title-back-btn");
  // Top bar links (Devlog, Art Room, Discord...) sit above everything as row -1. Bound once; the bar outlives re-renders.
  document.querySelectorAll(".ms-nav a, .ms-nav button").forEach(el => { if (!el.classList.contains("nav-item") && el.getAttribute("aria-current") !== "page") bindNavItem(el, -1, e => { if (e && e.type === "nav-activate") el.click(); }); }); // mouse and touch keep their normal click
  if (backEl) bindNavItem(backEl, 99, () => goView(view === "credits" ? "extras" : view === "achievements" ? (window.titleBackTo || "extras") : "main"), view !== "main" && view !== "shop"); // the Shop starts on its first item

  // Row 0: Character Cards
  modal.querySelectorAll(".dossier-char").forEach(el => {
    const chId = el.dataset.char;
    bindNavItem(el, 11, () => {
      const ch = CHARACTERS.find(c => c.id === chId);
      if (!ch) return;
      if (meta.unlockedChars[ch.id]) {
        meta.selectedChar = ch.id; saveMeta(meta); sfx("pick");
        renderTitleModal(scene, `[data-char="${chId}"]`); updateHUD();
        { const sr = loadRunState(); if (sr && sr.char && sr.char !== ch.id && window.showLowerThird) { const o = CHARACTERS.find(c => c.id === sr.char);
          window.showLowerThird("tip", "SAVED RUN", `${ch.name} is ready for your next new run. Your saved run stays with ${o ? o.name : "its hero"}.`, 4500); } }
      } else if (ch.unlock) {
        sfx("hurt"); // achievement unlock only (Ben: finish 10 devlog memos)
        if (window.showLowerThird) window.showLowerThird("tip", "LOCKED", "Finish 10 devlog memos to unlock The Coldwar Cowboy.", 3500);
      } else if (meta.coins >= ch.cost) {
        meta.coins -= ch.cost; meta.unlockedChars[ch.id] = true; meta.selectedChar = ch.id;
        saveMeta(meta); sfx("levelUp");
        renderTitleModal(scene, `[data-char="${chId}"]`); updateHUD();
      } else {
        sfx("hurt");
      }
    });
  });

  // Sprint on/off (unlocked by beating the Midlife Crisis V8)
  modal.querySelectorAll("[data-sprint]").forEach(btn => {
    if (btn.disabled) return;
    bindNavItem(btn, 9.6, () => { meta.sprint = !meta.sprint; saveMeta(meta); sfx("pick"); renderTitleModal(scene, "[data-sprint]"); });
  });

  // Row 7: Tax Bracket − / +
  modal.querySelectorAll("[data-tax]").forEach(btn => {
    if (btn.disabled) return;
    bindNavItem(btn, 9.7, () => {
      meta.taxBracket = Math.max(0, Math.min(TAX_BRACKET.maxLevel, (meta.taxBracket || 0) + Number(btn.dataset.tax)));
      saveMeta(meta); sfx("pick");
      renderTitleModal(scene, `[data-tax="${btn.dataset.tax}"]`);
    });
  });

  // Row 6: Mode picker (Midlife or Full Life)
  modal.querySelectorAll("[data-loc]").forEach(btn => {
    if (btn.disabled) return;
    bindNavItem(btn, 9.5, () => {
      const loc = btn.dataset.loc;
      sfx("pick");
      if (loc === (window.STAGE_ID || "office")) return;
      meta.stage = loc; saveMeta(meta);
      hideTitleModal(); scene.scene.restart(); // rebuild the world; the title comes back on top of the new place
    });
  });
  modal.querySelectorAll("[data-mode]").forEach(btn => {
    if (btn.disabled) return;
    bindNavItem(btn, 9.6, () => {
      meta.runMode = btn.dataset.mode;
      saveMeta(meta);
      if (window.refreshRunMode) window.refreshRunMode();
      sfx("pick");
      renderTitleModal(scene, `[data-mode="${btn.dataset.mode}"]`);
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
  const shopCols = matchMedia("(min-width:1024px)").matches ? 3 : matchMedia("(min-width:600px)").matches ? 2 : 1;
  modal.querySelectorAll(".shop-r:not(.shop-mystery)").forEach((el, idx) => {
    const shopId = el.dataset.shop;
    if (idx === 0 && view === "shop") el.classList.add("nav-default");
    bindNavItem(el, 3 + Math.floor(idx / shopCols), () => {
      const item = META_SHOP.find(it => it.id === shopId);
      if (!item) return;
      const rank = meta.ranks[item.id] || 0;
      const cost = shopPrice(item, meta);
      if (!(window.shopItemLocked && shopItemLocked(item, meta)) && rank < item.maxRank && meta.coins >= cost) {
        meta.coins -= cost; meta.shopInflationPaid = (meta.shopInflationPaid || 0) + Math.max(0, cost - item.baseCost * (rank + 1)); meta.ranks[item.id] = rank + 1;
        if (rank + 1 >= item.maxRank && window.achEvent) window.achEvent("shopMax", { id: item.id });
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
      openSettingsModal(scene); // B2: one Settings sheet (Controls is a row inside it)
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
  // A link ending in #changelog (the devlog's "full list") opens the patch notes once, right on the title screen.
  if (location.hash === "#changelog" && !window.__changelogLinked) { window.__changelogLinked = true; setTimeout(() => openChangelogModal(scene), 250); }

  // Row 8: Resume Saved Run (if present)
  const resumeBtn = document.getElementById("title-resume-btn");
  if (resumeBtn) {
    bindNavItem(resumeBtn, 9, () => { // row 9: sits under Start
      if (window.resumeSavedRunFromTitle) window.resumeSavedRunFromTitle();
    }, false);
  }

  // Row 9: Clock In / Start New Run (Default focus if no saved run)
  const clockBtn = document.getElementById("title-clockin-btn");
  bindNavItem(clockBtn, 8, () => {
    if (startFromTitle) startFromTitle();
  }, view === "main");

  window.menuNav.refresh(preserveFocusSelector, !preserveFocusSelector); // a fresh title render keeps your scroll spot (Nov 4: it jumped to Punch In)
}

// A nudge that fits YOUR history: try another device, plug in a controller, read the devlog, join the Discord.
// Picks one at random from the ones that apply, so it changes from visit to visit.
function titleNudge(returning) {
  if (!returning) return [];
  const P = meta.played || {}, got = (meta.achievements && meta.achievements.unlocked) || {};
  const touchDev = navigator.maxTouchPoints > 1, shortSide = Math.min(screen.width, screen.height);
  const here = !touchDev ? "desktop" : shortSide >= 700 ? "tablet" : "phone";
  const forms = ["phone", "tablet", "desktop"].filter(k => P[k]);
  const name = { phone: "your phone", tablet: "a tablet", desktop: "a laptop or desktop" };
  let read = 0; try { read = JSON.parse(localStorage.getItem("devlog-read") || "[]").length; } catch (e) {}
  const out = [];
  if (!got.hybridSchedule && forms.length === 1) {
    const D = (window.TITLE_COPY && TITLE_COPY.device) || {}, pk = a => a && a.length ? a[Math.floor(Math.random() * a.length)] : "";
    out.push(forms[0] === "desktop" ? `📱 ${pk(D.tryPhone) || "Take the office with you. Finish a run on your phone."} <b>Hybrid Schedule</b> (+5k).`
      : `🖥 ${pk(D.tryBigScreen) || "Big screen, bigger swarms. Play a run on a computer."} <b>Hybrid Schedule</b> (+5k).`);
  }
  if (!got.remoteWorker && forms.length === 2) {
    const missing = ["phone", "tablet", "desktop"].find(k => !P[k]);
    out.push(`🌐 <b>Remote Worker:</b> one more to go. Finish a run on ${name[missing]} (+10k).`);
  }
  if (!got.pluggedIn && here !== "phone") { const D = (window.TITLE_COPY && TITLE_COPY.device) || {}; const l = (D.tryController || [])[Math.floor(Math.random() * ((D.tryController || []).length || 1))];
    out.push(`🎮 ${l || "Got a controller? Xbox, PlayStation and Switch pads all work."} One run unlocks <b>Plugged In</b> (+5k).`); }
  if (read < 10) out.push(`📚 <b>${read} of 10</b> devlog memos read toward <b>Required Reading</b>. <a href="devlog/" class="tp-nudge-link">Open the devlog</a>`);
  if ((meta.bestAge || 40) >= 50) out.push(`🏆 <b>Age ${Math.floor(meta.bestAge)} is worth bragging about.</b> Post it in the <a href="https://discord.gg/E6N9j5tZe" target="_blank" rel="noopener" class="tp-nudge-link">Discord</a> and see who beats it.`);
  else out.push(`💬 <b>Stuck before 50?</b> The <a href="https://discord.gg/E6N9j5tZe" target="_blank" rel="noopener" class="tp-nudge-link">Discord</a> has tips from people who made it.`);
  // The accounts poll is retired now that accounts are live (Nov 4). Signed-out players get a nudge instead.
  if (window.Account && Account.status() && !Account.signedIn()) out.push(`☁ <b>Play on more than one device?</b> Clock in (bottom of your file) and your progress follows you.`);
  const DC = (window.TITLE_COPY && TITLE_COPY.discord) || [];
  if (DC.length) out.push(`💬 ${DC[Math.floor(Math.random() * DC.length)]} <a href="https://discord.gg/E6N9j5tZe" target="_blank" rel="noopener" class="tp-nudge-link">Join the Discord</a>`);
  return out; // to-dos for the employee file feed (titleFileTile)
}

// On wide screens, Punch In lives in the "Today's shift" tile, front and center. On phones it floats over the art.
function placeTitlePunch() {
  const punch = document.querySelector(".tp-punch"), slot = document.querySelector(".tp-punch-slot"), poster = document.querySelector(".title-poster");
  if (!punch || !slot || !poster) return;
  const wide = window.matchMedia && matchMedia("(orientation: landscape) and (min-width: 761px)").matches;
  if (wide && punch.parentElement !== slot) slot.appendChild(punch);
  else if (!wide && punch.parentElement === slot) poster.insertBefore(punch, poster.querySelector(".tp-band"));
  poster.classList.toggle("punch-in-tile", wide);
}
window.addEventListener("resize", () => { if (document.querySelector(".tp-punch")) placeTitlePunch(); });

// The quick poll as a small pop-up on the main title, until you vote or close it for this visit.
function titlePollPop() {
  let voted = null, closed = null;
  try { voted = localStorage.getItem("ms-poll-accounts-v1"); closed = sessionStorage.getItem("ms-poll-pop-closed"); } catch (e) {}
  // The poll waits until after a first run, so a new player's first title screen is just the game (Fable review #10).
  return ""; // retired Nov 4: accounts are live, and the Clock in prompt (src/account.js) replaced the poll
  if (voted || closed || !window.MSPoll || !(typeof meta !== "undefined" && meta && meta.runsPlayed > 0)) return "";
  return `<aside class="tp-poll-pop" id="tp-poll-pop" aria-label="Quick poll">
    <button type="button" class="tp-poll-x" aria-label="Close the poll" onclick="try{sessionStorage.setItem('ms-poll-pop-closed','1')}catch(e){};this.parentElement.remove()">×</button>
    <button type="button" class="tp-poll-pill" onclick="this.parentElement.classList.add('open')">📊 One quick question</button>
    <div data-ms-poll="accounts-v1"></div></aside>`;
}

// "Your file" tile on the title screen: welcome (back) message + your numbers.
function titleFileTile() {
  const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let name = ""; try { name = localStorage.getItem("ms-player-name") || ""; } catch (e) {}
  const runs = meta.runsPlayed || 0, last = meta.lastRun;
  const returning = runs > 0 || (meta.bestAge || 40) > 40.5 || meta.coins > 0;
  let localBest = 0; try { localBest = Math.max(0, ...JSON.parse(localStorage.getItem("ms-local-scores-v1") || "[]").map(r => r.score || 0)); } catch (e) {}
  const best = Math.max(meta.bestScore || 0, localBest);
  const got = Object.keys((meta.achievements && meta.achievements.unlocked) || {}).length, all = (window.ACHIEVEMENTS || []).length;
  const ago = last && last.at ? (() => { const m = Math.round((Date.now() - last.at) / 60000); return m < 60 ? `${Math.max(1, m)} min ago` : m < 2880 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} days ago`; })() : "";
  const head = returning ? `Welcome back${name ? `, ${esc(name)}` : ""}.` : "Welcome, new hire.";
  const C = window.TITLE_COPY || {}, pick = a => a && a.length ? a[Math.floor(Math.random() * a.length)] : "";
  const line = !returning ? (window.STAGE_ID === "home" ? "You're home. You only move. Everything else is automatic." : "Your first shift starts at 8:59. You only move. Everything else is automatic.")
    : (pick(C.welcomeBack) || "Good to see you again. The Bills missed you.");
  const lastLine = returning && last ? (last.win ? `Last shift (${ago}): retired at ${last.age}. Show-off.` : `Last shift (${ago}): reached ${last.age} before ${esc(last.killer || "life")} got you.`) : "";
  // The feed (Nov 4, Rami: "to-dos mixed with news and status things"): status first, then news, then to-dos.
  const feed = [];
  if (lastLine) feed.push({ t: "status", h: lastLine });
  const cheap = (window.META_SHOP || []).map(it => { const r = (meta.ranks && meta.ranks[it.id]) || 0; return { it, r, cost: shopPrice(it, meta) }; })
    .filter(x => !(window.shopItemLocked && shopItemLocked(x.it, meta)) && x.r < x.it.maxRank && x.cost <= (meta.coins || 0)).sort((a, b) => a.cost - b.cost)[0];
  if (returning && cheap) feed.push({ t: "status", h: `💰 You can afford <b>${esc(cheap.it.name)}</b>${cheap.r ? ` rank ${cheap.r + 1}` : ""} (${cheap.cost}k).`, go: "shop", cta: "Open the shop" });
  const V = window.GAME_VERSION || {}, latest = (V.changelog || [])[0] || {};
  if (returning && latest.teaser) feed.push({ t: "news", h: `<b>${esc(latest.ver || V.displayVersion || "")}:</b> ${esc(latest.teaser)}`, go: "whatsnew", cta: "What's new" });
  if (returning && got < all) feed.push({ t: "todo", h: `🏅 <b>${got} of ${all}</b> achievements earned.`, go: "achievements", cta: "See them all" });
  titleNudge(returning).forEach(h => feed.push({ t: "todo", h }));
  // Nov 10 (Rami's OK): the first to-do follows the stage. At home the 45 boss is the Math Homework, and the V8 waits in the garage.
  const atHome = window.STAGE_ID === "home", gotA = (meta.achievements && meta.achievements.unlocked) || {};
  if (atHome) feed.push({ t: "todo", h: !gotA.carryTheOne ? "✏️ Finish the <b>Fifth-Grade Math Homework</b> at 45. Show your work." : "🚗 Something in your garage turns over at <b>60</b>. Be ready." });
  else if (!returning) feed.push({ t: "todo", h: "📋 Survive your first <b>Performance Review</b> at 45." });
  // Mix them so every page has a bit of each: status, news, to-do, status, news, to-do...
  { const by = { status: [], news: [], todo: [] }; feed.forEach(f => by[f.t].push(f)); feed.length = 0;
    while (by.status.length || by.news.length || by.todo.length) ["status", "news", "todo"].forEach(k => { if (by[k].length) feed.push(by[k].shift()); }); }
  const acct = window.Account ? Account.status() : null; // optional cloud save (src/account.js)
  const TAG = { todo: "TO-DO", news: "NEWS", status: "STATUS" };
  const per = 3, pages = Math.max(1, Math.ceil(feed.length / per));
  const feedHtml = feed.length ? `<ul class="tp-feed" data-page="0" data-pages="${pages}">${feed.map((f, i) => `<li class="tp-fi ${f.t}" data-pg="${Math.floor(i / per)}"${i >= per ? " hidden" : ""}><span class="tp-ft">${TAG[f.t]}</span><span class="tp-fx">${f.h}${f.go ? ` <button type="button" class="tp-fgo" data-file-go="${f.go}">${f.cta} ▸</button>` : ""}</span></li>`).join("")}</ul>
          ${pages > 1 ? `<button type="button" class="tp-fmore" id="tp-fmore">MORE ▸ <span>1/${pages}</span></button>` : ""}` : "";
  return `
        <section class="tp-tile tp-file" aria-label="Your employee file">
          <div class="tp-tile-tag">YOUR EMPLOYEE FILE</div>
          <div class="tp-welcome">${head}</div>
          <p class="tp-welcome-sub">${esc(line)}</p>
          ${feedHtml}
          <div class="tp-stats">
            <div><b>${Math.floor(meta.bestAge || 40)}</b><span>oldest age</span></div>
            <div><b>${best ? best.toLocaleString("en-US") : "–"}</b><span>best score</span></div>
            <div><b>${(meta.coins || 0).toLocaleString("en-US")}k</b><span>401(k)</span></div>
            <button type="button" class="tp-stat-btn" id="title-file-ach" aria-label="Achievements: ${got} of ${all}. Open the list"><b>${got}/${all}</b><span>achievements ▸</span></button>
          </div>
          ${runs ? `<div class="tp-file-foot">${runs} shift${runs === 1 ? "" : "s"} worked</div>` : ""}
          ${acct ? `<button type="button" class="tp-acct${acct.in ? " in" : ""}" id="title-acct"><span class="tp-acct-ic">☁</span><span><b>${acct.in ? "CLOCKED IN" : "CLOCK IN"}</b> ${esc(acct.text)}</span><span class="tp-acct-go">▸</span></button>` : ""}
        </section>`;
}

// The pinned devlog memo on the title screen: latest post + build clock, read from the devlog's own files.
function fillTitleMemo() {
  const draw = () => {
    const el = document.getElementById("title-memo");
    const posts = (window.DEVLOG_POSTS || []).filter(p => !p.draft);
    if (!el || !posts.length) return;
    const p = posts[0];
    const esc = t => String(t || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const no = (/^(\d+)/.exec(p.slug) || [])[1] || posts.length;
    const body = el.querySelector(".tp-memo-body");
    if (body) body.innerHTML = `
      ${p.cover ? `<img class="tp-memo-cover" src="devlog/${esc(p.cover)}" alt="">` : ""}
      <div class="tp-memo-no">MEMO ${String(no).padStart(2, "0")} · ${esc(p.version || "")}</div>
      <div class="tp-memo-title">${esc(p.title)}</div>
      ${(p.blurb || p.teaser) ? `<p class="tp-memo-sum">${esc(p.blurb || p.teaser)}</p>` : ""}`;
    // A short summary under the title fills the note (Rami, Nov 3). Styled here so it arrives even if index.html is cached.
    if (!document.getElementById("tp-memo-css")) {
      const st = document.createElement("style"); st.id = "tp-memo-css";
      st.textContent = `.tp-memo-title{margin-bottom:6px!important}.tp-memo-sum{margin:0 0 12px;font:500 13.5px/1.45 "Atkinson Hyperlegible",system-ui,sans-serif;color:#303750}
        .tp-memo{display:flex;flex-direction:column}.tp-memo-body{flex:1}`;
      document.head.appendChild(st);
    }
    const btn = document.getElementById("title-devlog-btn");
    if (btn) btn.onclickTarget = `devlog/?post=${p.slug}`;
  };
  if (window.DEVLOG_POSTS) draw();
  else if (!window._devlogPostsLoading) {
    window._devlogPostsLoading = true;
    const sc = document.createElement("script");
    sc.src = "devlog/posts.js?t=" + Date.now();
    sc.onload = draw;
    document.head.appendChild(sc);
  }
  // Build clock: how many playable builds, and how fresh the latest is.
  if (!window._devlogStats) {
    fetch("devlog/data/stats.json?t=" + Date.now(), { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(d => { window._devlogStats = d; footer(); }).catch(() => {});
  } else footer();
  function footer() {
    const f = document.getElementById("title-memo-foot"), d = window._devlogStats;
    if (!f || !d || !d.builds || !d.builds.length) return;
    const last = new Date(d.builds[d.builds.length - 1].at), mins = Math.max(1, Math.round((Date.now() - last) / 60000));
    const ago = mins < 60 ? `${mins} min ago` : mins < 2880 ? `${Math.round(mins / 60)} h ago` : `${Math.round(mins / 1440)} days ago`;
    f.innerHTML = `${getVersionInfo().displayVersion} · <b>${d.builds.length}</b> builds · updated ${ago}`;
  }
}

// Title slideshow (src/data/title-art.js): crossfading key art with a slow push-in, behind the poster title.
// It sits outside the title menu so re-rendering the menu (picking a hero, opening settings) never restarts it.
window.TitleSlides = (() => {
  let root = null, idx = 0, timer = null, running = false;
  const phone = () => window.matchMedia && matchMedia("(orientation: portrait), (max-width: 760px)").matches;
  const still = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function build() {
    const A = window.TITLE_ART; if (!A || !A.slides.length) return null;
    if (phone() && A.slides.some(sl => sl.wideOnly)) A.slides = A.slides.filter(sl => !sl.wideOnly); // wide-only art stays off tall screens
    const host = document.getElementById("title-modal"); if (!host || !host.parentNode) return null;
    root = document.createElement("div");
    root.id = "title-slides"; root.setAttribute("aria-hidden", "true");
    root.style.setProperty("--ts-fade", A.fadeMs + "ms");
    root.style.setProperty("--ts-run", (A.holdMs + A.fadeMs * 2) + "ms");
    root.style.setProperty("--ts-zoom", A.zoom);
    root.innerHTML = A.slides.map((sl, i) => `<div class="ts-slide" data-i="${i}" data-move="${sl.move || "push"}"><div class="ts-img"></div></div>`).join("");
    host.parentNode.insertBefore(root, host);
    return root;
  }
  function paint(i) {
    const A = window.TITLE_ART, sl = A.slides[i], el = root.children[i], img = el.firstElementChild;
    // Phones and portrait tablets get the tall version of the scene when there is one (key art v2).
    const tall = phone() && sl.srcPortrait, src = tall ? sl.srcPortrait : sl.src;
    if (el.dataset.src !== src) { el.dataset.src = src; el.style.setProperty("--ts-src", `url("${src}")`); img.style.backgroundImage = `url("${src}")`; }
    const tablet = tall && window.innerWidth >= 700;
    const focus = (tablet && sl.focusTablet) || (tall && sl.focusPortrait) || sl.focus || "50% 50%";
    // Screens wider than the art show the whole picture, with a soft blurred copy filling the sides.
    const ultra = window.innerWidth / window.innerHeight > 1.9;
    el.classList.toggle("ultra", ultra);
    img.style.backgroundPosition = ultra ? "50% 50%" : focus;  // keep the subject in the crop on every screen
    if (sl.live && window.LiveScene) { // live scene: a canvas over the still picture, cropped the same way
      let cv = img.querySelector("canvas.ts-live");
      if (!cv) { cv = document.createElement("canvas"); cv.className = "ts-live"; img.appendChild(cv); }
      cv.style.objectPosition = ultra ? "50% 50%" : focus;
    }
    img.style.transformOrigin = focus;                          // and grow the motion out of that same point
    // Punch In only points at the time clock when the time clock is in the picture.
    const modal = document.getElementById("title-modal");
    if (modal) modal.dataset.pointer = sl.pointer ? "1" : "0";
    return el;
  }
  // Live scenes start when their slide shows and pause once it has faded out.
  const lives = {};
  function liveOn(i) {
    const sl = window.TITLE_ART.slides[i], el = root.children[i], cv = el.querySelector("canvas.ts-live");
    if (!sl.live || !cv || !window.LiveScene) return;
    if (!lives[i]) lives[i] = LiveScene.create(cv, sl.live, { still: still() }).catch(e => { console.warn("Live title scene skipped: " + e.message); return null; });
    else lives[i].then(s => s && !still() && s.play());
  }
  function liveOff(i, delay) {
    if (!lives[i]) return;
    setTimeout(() => { if (!root.children[i].classList.contains("on")) lives[i].then(s => s && s.pause()); }, delay || 0);
  }
  function show(i) {
    // The slide on its way out keeps its current framing while it fades, so nothing snaps.
    [...root.children].forEach(c => {
      if (!c.classList.contains("on")) return;
      const im = c.firstElementChild;
      im.style.transform = getComputedStyle(im).transform;
      c.classList.remove("on"); c.classList.add("leaving");
      liveOff([...root.children].indexOf(c), (window.TITLE_ART.fadeMs || 1800) + 100);
      setTimeout(() => { c.classList.remove("leaving"); im.style.transform = ""; }, (window.TITLE_ART.fadeMs || 1800) + 80);
    });
    const el = paint(i);
    el.classList.remove("leaving"); el.firstElementChild.style.transform = "";
    void el.offsetWidth; el.classList.add("on");
    liveOn(i);
    // warm up the next picture so the fade never shows a blank
    const n = (i + 1) % root.children.length, nx = window.TITLE_ART.slides[n];
    if (!root.children[n].dataset.src) { const im = new Image(); im.src = (phone() && nx.srcPortrait) || nx.src; }
  }
  let first = true, lastStage = "office";
  const homeLead = () => window.STAGE_ID === "home" || (typeof meta !== "undefined" && meta.stage === "home" && typeof homeUnlocked === "function" && homeUnlocked(meta));
  const homeIdx = () => window.TITLE_ART.slides.map((s, i) => s.stage === "home" ? i : -1).filter(i => i >= 0);
  function dropPre() { const pre = document.getElementById("title-slides-pre"); if (pre) pre.remove(); }
  function start() {
    if (!root && !build()) { dropPre(); return; }
    root.hidden = false;
    if (running) return;
    running = true;
    if (first) {
      // The very first slide appears with no fade, on top of the static copy index.html already painted (Fable review #4).
      first = false;
      const h = homeLead() ? homeIdx() : [];
      if (h.length) { // Nov 10: Maple Hollow players open on their town. The office pre-paint stays up until it has loaded.
        idx = h[Math.floor(Math.random() * h.length)];
        const sl = window.TITLE_ART.slides[idx], im = new Image(); let done = false;
        const go = () => { if (done) return; done = true; const el = root.children[idx]; el.classList.add("instant"); show(idx); requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.remove("instant"); dropPre(); })); };
        im.onload = im.onerror = go; setTimeout(go, 1500); im.src = (phone() && sl.srcPortrait) || sl.src;
      } else {
        const el = root.children[idx]; el.classList.add("instant");
        show(idx);
        requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.remove("instant"); dropPre(); }));
      }
    } else {
      // Nov 10: just switched to Maple Hollow? Open on one of its slides.
      if (homeLead() && lastStage !== "home") { const h = homeIdx(); if (h.length) idx = h[Math.floor(Math.random() * h.length)]; }
      show(idx);
    }
    lastStage = homeLead() ? "home" : "office";
    const A = window.TITLE_ART;
    // Random order (Nov 8, Rami): the first slide stays put (index.html pre-paints it so the screen is never blank),
    // then the rest play shuffled, reshuffled every time through, never the same slide twice in a row.
    const shuffled = except => { const o = A.slides.map((_, i) => i).filter(i => i !== except); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; };
    let order = A.shuffle === false ? null : shuffled(idx);
    if (order && homeLead()) order = homeIdx().filter(i => i !== idx).concat(order.filter(i => !homeIdx().includes(i))); // Maple Hollow art leads
    if (A.slides.length > 1) timer = setInterval(() => {
      if (!order) idx = (idx + 1) % A.slides.length;
      else { if (!order.length) { order = shuffled(idx); order.push(idx); } idx = order.shift(); }
      show(idx);
    }, A.holdMs + A.fadeMs);
  }
  function stop() {
    dropPre();
    Object.keys(lives).forEach(k => lives[k].then(sc => sc && sc.pause()));
    if (timer) clearInterval(timer); timer = null; running = false;
    if (root) root.hidden = true;
  }
  return { start, stop, still };
})();

function hideTitleModal() {
  if (window.TitleSlides) TitleSlides.stop();
  window.titleView = "main";
  const modal = document.getElementById("title-modal");
  if (modal) modal.classList.add("hidden");
}

// End-of-run summary (Nov 2): what you earned this run, what it means for the next one, and what to chase next.
function runSummaryHtml() {
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fresh = (window.getNewAchievements && window.getNewAchievements()) || [];
  const lines = window.ACH_END_LINES || {};
  const got = (meta && meta.achievements && meta.achievements.unlocked) || {};
  const next = (window.ACHIEVEMENTS || []).filter(a => !got[a.id]).slice(0, 2);
  const shop = (window.META_SHOP || []).map(it => { const r = (meta.ranks && meta.ranks[it.id]) || 0; return { it, r, cost: shopPrice(it, meta) }; })
    .filter(x => !(window.shopItemLocked && shopItemLocked(x.it, meta)) && x.r < x.it.maxRank && meta.coins >= x.cost).sort((a, b) => a.cost - b.cost)[0];
  if (!fresh.length && !next.length && !shop) return "";
  return `<div class="run-summary">
    ${window.lastPaycheck ? `<div class="rs-tip">💼 <b>Paycheck:</b> +${window.lastPaycheck}k in your 401(k) for the years you put in.${window.lastHustle && lastHustle.coins ? ` <b>Hustle Bonus:</b> +${lastHustle.coins}k (${lastHustle.areas} area${lastHustle.areas === 1 ? "" : "s"} explored, ${Math.round(lastHustle.dist / 1000)}k steps).` : ""}</div>` : ""}
    ${window.DEV && window.DEV.on && window.coinLedger ? `<div class="rs-next"><b>DEV · COINS BY SOURCE:</b> ${Object.entries(window.coinLedger).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${esc(k)} ${Math.round(v)}k`).join(" · ") || "none"}</div>` : ""}
    ${fresh.length ? `<div class="rs-head">🏅 EARNED THIS RUN</div>${fresh.map(a => `
      <div class="rs-ach"><div class="rs-name">${a.icon} ${esc(a.name)} <span class="rs-coins">+${a.reward}k</span></div>
      <div class="rs-line">${esc(lines[a.id] || a.desc)}</div></div>`).join("")}` : ""}
    ${shop ? `<div class="rs-tip">🪙 You can afford <b>${esc(shop.it.name)}</b> (${shop.cost}k) in the 401(k) Shop: ${esc(shop.it.desc)}.</div>` : ""}
    ${next.length ? `<div class="rs-next"><b>NEXT GOALS:</b> ${next.map(a => `${a.icon} ${esc(a.desc)} <span class="rs-coins">+${a.reward}k</span>`).join(" · ")}</div>` : ""}
  </div>`;
}
// The retirement party (Nov 3): ChatGPT's art (assets/ui/bonus) across the top of the win screen.
function retirementPartyHtml(isCentennial) {
  const A = "assets/ui/bonus/";
  const bits = Array.from({ length: 18 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 6) * 0.35}s;--c:${["#EF9347", "#F2D7A1", "#83A89A", "#BFA8CF", "#C45C4B"][i % 5]}"></i>`).join("");
  return `<div class="rt-party" aria-hidden="true">
      <div class="rt-streamer" style="background-image:url(${A}retirement-streamer-v1.png)"></div>
      <div class="rt-confetti">${bits}</div>
      <div class="rt-row">
        <img class="rt-cake" src="${A}retirement-cake-v1.png" alt="">
        <img class="rt-title" src="${A}retirement-title-v1.png" alt="">
        <img class="rt-watch" src="${A}retirement-watch-v1.png" alt="">
      </div>
    </div>
    <div class="rt-crowd" aria-hidden="true"></div>
    <p class="rt-gifts">${isCentennial
      ? "A hundred candles. The fire marshal has questions. The gold watch is now an heirloom."
      : "From everyone at the office: a sheet cake, a gold watch, and a card that Accounting signed twice."}</p>${goldWatchRetireHtml()}`;
}
// The Gold Watch at the party: the keepsake if you stopped it, a wry line if it was still ticking (Nov 3).
function goldWatchRetireHtml() {
  const V = (window.BOSS_ATTACKS && BOSS_ATTACKS.goldWatch && BOSS_ATTACKS.goldWatch.victory) || {};
  if (window.goldWatchBeat) return `<p class="rt-gifts" style="display:flex;align-items:center;gap:10px;justify-content:center"><img src="assets/ui/kill-screen/gold-watch-keepsake-v1.png" alt="" width="48" height="48" style="image-rendering:pixelated">${V.keepsake || ""}</p>`;
  if (window.goldWatchSeen && V.stillTicking) return `<p class="rt-gifts">${V.stillTicking}</p>`;
  return "";
}

// The HR Exit Interview scene (Nov 3, art by ChatGPT): your hero slumps in a chair on the left, whatever got you
// gloats on the right, over an empty HR office. Retry plays the hero's shake-off before the restart.
const KO_HERO = { officeWorker: "office-worker", photographer: "soccer-dad", gradStudent: "grad-student", coldWarCowboy: "cold-war-cowboy" };
const KO_MUG = { goldWatch: "gold-watch", bill: "bill", groupChat: "group-chat", groupChatPing: "group-chat", lateFee: "late-fee", spamCall: "spam-likely", snackAttack: "late-night-donut",
  threeAmThought: "3am-thought", officeGossip: "reply-all", calendarInvite: "calendar-invite", backTwinge: "back-twinge" };
function koSceneHtml(killer) {
  if (!document.getElementById("ko-css")) {
    const st = document.createElement("style"); st.id = "ko-css";
    st.textContent = `
      .ko-scene { position: relative; margin: -4px -4px 12px; height: clamp(200px, 26vw, 300px); border: 2px solid #171C35; border-radius: 6px; overflow: hidden;
        background: #303750 var(--ko-banner) center / cover no-repeat; image-rendering: pixelated; box-shadow: inset 0 -60px 60px -30px rgba(23,28,53,.85); }
      .ko-hero, .ko-mug { position: absolute; bottom: 30px; image-rendering: pixelated; background-repeat: no-repeat; }
      .ko-hero { left: 10%; width: calc(96px * var(--k)); height: calc(112px * var(--k)); background-size: calc(768px * var(--k)) calc(336px * var(--k));
        animation: koSlump .96s steps(7) forwards, koIdle 1.32s steps(6) 1.1s infinite; }
      .ko-hero.up { animation: koUp 1.12s steps(7) forwards; }
      .ko-mug { right: 10%; width: calc(96px * var(--k)); height: calc(96px * var(--k)); background-size: calc(384px * var(--k)) calc(96px * var(--k));
        animation: koIn .45s .5s cubic-bezier(.2,1.5,.4,1) both, koMug .8s steps(4) infinite; }
      .ko-mug.boss { width: calc(144px * var(--k) * .8); height: calc(152px * var(--k) * .8); background-size: calc(576px * var(--k) * .8) calc(456px * var(--k) * .8); animation: koIn .45s .5s cubic-bezier(.2,1.5,.4,1) both; }
      .ko-cap { position: absolute; left: 0; right: 0; bottom: 6px; text-align: center; font: 700 15px/1.2 "Atkinson Hyperlegible", system-ui, sans-serif; color: #FFF0CF; text-shadow: 0 2px 0 #171C35; }
      .ko-cap b { color: #EF9347; }
      @keyframes koSlump { from { background-position: 0 0; } to { background-position: calc(-672px * var(--k)) 0; } }
      @keyframes koIdle { from { background-position: 0 calc(-112px * var(--k)); } to { background-position: calc(-576px * var(--k)) calc(-112px * var(--k)); } }
      @keyframes koUp { from { background-position: 0 calc(-224px * var(--k)); } to { background-position: calc(-672px * var(--k)) calc(-224px * var(--k)); } }
      @keyframes koMug { from { background-position-x: 0; } to { background-position-x: calc(-384px * var(--k)); } }
      @keyframes koIn { from { opacity: 0; transform: translateY(20px) scale(.7); } to { opacity: 1; transform: none; } }
      @media (orientation: portrait), (max-width: 760px) { .ko-scene { height: 200px; } .ko-hero { left: 6%; } .ko-mug { right: 6%; } .ko-cap { font-size: 13px; } }
      @media (prefers-reduced-motion: reduce) { .ko-hero { animation: none; background-position: calc(-672px * var(--k)) 0; } .ko-mug { animation: none; } }`;
    document.head.appendChild(st);
  }
  const phone = matchMedia("(orientation: portrait), (max-width: 760px)").matches;
  const k = phone ? 1.35 : (innerWidth > 1100 ? 2 : 1.6);
  const hero = KO_HERO[meta.selectedChar] || "office-worker";
  const E = (typeof ENEMIES !== "undefined" && ENEMIES[killer]) || null;
  const who = E ? E.name : "the daily grind";
  const isBoss = !!(E && window.BossArt && ["performanceReview", "mortgageRefinance", "midlifeCrisis"].includes(killer));
  const mug = KO_MUG[killer] ? `<div class="ko-mug" style="background-image:url(assets/enemies/mugshots/${KO_MUG[killer]}-mugshot-v1.png)"></div>`
    : isBoss ? `<div class="ko-mug boss" style="background-image:url(${window.Spotlight && Spotlight.texUrl ? Spotlight.texUrl("bossart_" + killer, "") : ""})"></div>` : "";
  const banner = `assets/ui/kill-screen/exit-interview-banner-${phone ? "phone" : "desktop"}-v1.jpg`;
  return `<div class="ko-scene" style="--k:${k};--ko-banner:url(${banner})" aria-hidden="true">
      <div class="ko-hero" id="ko-hero" style="background-image:url(assets/characters/portraits/${hero}-defeated-v1.png)"></div>
      ${mug}
      <div class="ko-cap">Taken out by <b>${who}</b> at ${currentAge.toFixed(1)}</div>
    </div>`;
}

function renderGameOverModal(scene, cause, isWin, killer) {
  const modal = document.getElementById("gameover-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const mode = window.getRunMode ? window.getRunMode() : "midlife";
  const isCentennial = isWin && currentAge >= 99.5;
  const runScore = window.computeRunScore ? window.computeRunScore(currentAge, runStartAge, runKills, runCoins, isWin) : 0;
  const headline = isCentennial
    ? "👑 CENTENNIAL LEGEND! YOU REACHED AGE 100!"
    : (isWin ? (mode === "midlife" ? `🏆 RETIRED AT ${Math.round(currentAge)}!${window.justUnlockedFull ? " FULL LIFE UNLOCKED" : ""}` : "🏆 YOU SURVIVED TO RETIREMENT!") : "📋 BURNOUT! SHIFT ENDED");

  // Design system B6 (Nov 10): game over and retirement are Moments. Order: a short picture, the headline,
  // SCORE and AGE big, then RETRY (the one orange button) with Shop and Title, then posting your score.
  // The pay stub (paycheck, goals, the stat pills, the score breakdown) folds into a drawer.
  const touchUI = window.matchMedia && matchMedia("(pointer: coarse)").matches;
  const plainHead = isCentennial ? "AGE 100. A LEGEND." : isWin ? (mode === "midlife" ? `RETIRED AT ${Math.round(currentAge)}` : "YOU MADE IT TO RETIREMENT") : "SHIFT ENDED";
  const strip = isWin ? `HR · RE: <b>Your retirement</b>` : `HR · RE: <b>Exit interview</b>`;
  modal.innerHTML = `
    <div class="modal-card gameover-box mo-box ${isWin ? "win-box" : "loss-box"}">
      <div class="mo-art">${isWin ? retirementPartyHtml(isCentennial) : koSceneHtml(killer)}</div>
      <div class="ms-sheet-strip mo-strip">${strip}</div>
      <h2 class="mo-title">${plainHead}</h2>
      ${isWin && window.justUnlockedFull ? `<div class="mo-unlock">Full Life unlocked</div>` : ""}
      <p class="mo-cause">${cause}</p>
      <div class="mo-numbers">
        <div class="mo-num mo-score"><span>SCORE</span><b>${runScore.toLocaleString()}</b></div>
        <div class="mo-num mo-age"><span>AGE</span><b>${currentAge.toFixed(1)}</b><small>Best ${(meta.bestAge || currentAge).toFixed(1)}</small></div>
      </div>
      <div class="ms-sheet-actions mo-actions gameover-actions">
        <div class="ms-left">
          <button type="button" class="ms-btn secondary" id="go-shop-btn"><span class="ms-btn-label">SHOP</span><span class="ms-btn-sub">${meta.coins}k to spend</span></button>
          <button type="button" class="ms-btn secondary go-title-btn" id="go-title-btn"><span class="ms-btn-label">TITLE</span><span class="ms-btn-sub">Change your shift</span></button>
        </div>
        <button type="button" class="ms-btn primary" id="go-retry-btn"><span class="ms-btn-label">RETRY</span><span class="ms-btn-sub">${isWin ? "Do it all again" : "Back on the clock"}</span></button>
      </div>
      ${touchUI ? "" : `<div class="ms-legend"><span><kbd>Space</kbd><kbd>Enter</kbd><kbd>A</kbd>Retry</span></div>`}
      <div class="mo-post score-panel">
        <form class="score-form" id="score-form" autocomplete="off">
          <input id="score-name" maxlength="16" placeholder="Your name" value="${(window.lbSavedName ? window.lbSavedName() : "").replace(/"/g, "")}" aria-label="Your name for the leaderboard">
          <button type="submit" class="ms-btn secondary score-post-btn" id="score-post-btn"><span class="ms-btn-label">POST SCORE</span></button>
        </form>
        <div class="score-names hidden" id="score-names" aria-label="Pick a name"></div>
        <div class="score-msg" id="score-msg"></div>
      </div>
      <details class="mo-stub">
        <summary><span class="ms-row-title">Pay stub</span><span class="ms-row-sub">+${runCoins}k saved · level ${level} · ${runKills} beaten</span></summary>
        <div class="mo-stub-body">
          <div class="gameover-stats">
            <div class="stat-pill"><span>REACHED AGE</span><b>${currentAge.toFixed(1)} (Best: ${(meta.bestAge || currentAge).toFixed(1)})</b></div>
            <div class="stat-pill"><span>SENIORITY</span><b>Level ${level}</b></div>
            <div class="stat-pill"><span>401(k) SAVED</span><b>+${runCoins}k (Bank: ${meta.coins}k)</b></div>
          </div>
          ${runSummaryHtml()}
          <div class="score-break">${Math.max(0, currentAge - runStartAge).toFixed(1)} years · ${runKills} beaten · ${runCoins}k saved${window.getRunTaxBracket && window.getRunTaxBracket() ? ` · Tax Bracket ${window.getRunTaxBracket()}` : ""}</div>
        </div>
      </details>
      <div class="score-panel go-board"><div id="go-leaderboard"></div></div>
      <div class="go-coffee">Midlife Survivors is free. If it made you laugh, <a href="https://ko-fi.com/ramidaud" target="_blank" rel="noopener">buy the developer a coffee</a>.</div>
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
    if (window.lbNameOk && !window.lbNameOk(name)) { scoreMsg.textContent = "HR flagged that name. Try another one."; nameInput.select(); return; }
    posted = true;
    window.lbSaveName(name);
    nameInput.blur();
    document.getElementById("score-post-btn").disabled = true;
    scoreMsg.textContent = "Posting…";
    const entry = { name, score: runScore, age: +currentAge.toFixed(2), startAge: runStartAge, character: meta.selectedChar, version: (getVersionInfo().version || "") + (window.SEASONS && meta.boughtOut === SEASONS.current().id ? " B" : "") + (window.isSprintRun && window.isSprintRun() ? " S" : "") + (window.getRunTaxBracket && window.getRunTaxBracket() ? ` T${window.getRunTaxBracket()}` : "") }; // " S" = Sprint (shown as ⚡ on the board)
    const res = await window.lbSubmit(entry);
    // An HTTP 400 means the board answered but turned the score down (Nov 4: Derek's 579,444 hit an old 500,000 cap), so don't call that "couldn't reach".
    scoreMsg.textContent = res.reason === "dev" ? "Dev mode is on, so this score wasn't posted." : res.online ? "Posted to the online leaderboard!"
      : /^HTTP 4/.test(res.reason || "") ? "The online board couldn't accept this score yet. It's saved on this device, and Rami's been told."
      : (window.lbConfigured() ? "Couldn't reach the online board. Saved on this device." : "Saved on this device.");
    sfx("levelUp");
    window.lbRenderInto(document.getElementById("go-leaderboard"), entry);
  });
  document.getElementById("score-post-btn").addEventListener("pointerdown", e => e.stopPropagation());
  window.lbRenderInto(document.getElementById("go-leaderboard"), null);

  // Controllers can't type, so Post Score is part of the D-pad menu (Nov 3, Rami). With no name saved,
  // it offers office-name badges to pick from. Keyboard players can still type their own.
  const postBtn = document.getElementById("score-post-btn"), namesEl = document.getElementById("score-names");
  const submitScore = () => { if (scoreForm.requestSubmit) scoreForm.requestSubmit(); else scoreForm.dispatchEvent(new Event("submit", { cancelable: true })); };
  bindNavItem(postBtn, -1, e => {
    if (e && e.pointerType === "mouse") return; // a mouse click submits the form by itself
    if (posted) return;
    if (window.lbCleanName(nameInput.value)) { submitScore(); return; }
    const pool = ["Dave from IT", "Deb in HR", "Regional Mgr", "Coffee Ninja", "Gary 2.0", "Night Shift", "Reply All", "PTO Pat", "Spreadsheet Sue", "Cubicle King"];
    const pick = Phaser.Utils.Array.Shuffle(pool.slice()).slice(0, 4).map(n => `${n} ${Phaser.Math.Between(10, 99)}`);
    namesEl.innerHTML = `<div class="score-names-head">Pick a name badge (or type one with a keyboard):</div>` +
      pick.map(n => `<button type="button" class="t-style-btn score-name-chip" data-name="${n}">🪪 ${n}</button>`).join("");
    namesEl.classList.remove("hidden");
    namesEl.querySelectorAll(".score-name-chip").forEach((chip, i) => bindNavItem(chip, -2, () => {
      nameInput.value = chip.dataset.name; namesEl.classList.add("hidden"); sfx("pick"); submitScore();
      window.menuNav.refresh("#go-retry-btn");
    }, i === 0));
    sfx("move");
    window.menuNav.refresh(".score-name-chip");
  }, false);

  let retrying = false;
  bindNavItem(document.getElementById("go-retry-btn"), 0, () => {
    if (retrying) return;
    sfx("pick");
    // The hero gets back up and dusts off first (0.7 s), unless reduced motion is on.
    const hero = document.getElementById("ko-hero");
    const go = () => { modal.classList.add("hidden"); scene.scene.restart(); };
    if (hero && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) { retrying = true; hero.classList.add("up"); setTimeout(go, 700); }
    else go();
  }, true);

  bindNavItem(document.getElementById("go-shop-btn"), 0, () => {
    sfx("pick");
    modal.classList.add("hidden");
    titleSeen = false;
    window.titleViewNext = "shop"; // land on the Shop view, not the main title
    scene.scene.restart();
  }, false);

  // Back to the title screen (Nov 7, Rami): same as the Shop button, but lands on the main title.
  bindNavItem(document.getElementById("go-title-btn"), 1, () => {
    sfx("pick");
    modal.classList.add("hidden");
    titleSeen = false;
    window.titleViewNext = "main";
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

// Polls draw their buttons after a moment (assets/ui/ms-poll.js); hook them into controller navigation when they appear (Nov 5).
document.addEventListener("ms-poll-rendered", e => {
  const el = e.detail && e.detail.el; if (!el || !el.closest(".ui-modal, #title-modal")) return;
  el.querySelectorAll(".ms-poll-opt").forEach(b => { if (!b.classList.contains("nav-item")) bindNavItem(b, 0.5, ev => { if (ev && ev.type === "nav-activate") b.click(); }); });
  if (window.menuNav && window.menuNav.focusedEl && !document.contains(window.menuNav.focusedEl)) window.menuNav.refresh();
});
