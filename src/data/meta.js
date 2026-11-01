// Meta-progression & Full Save State System (`src/data/meta.js`):
// 1. Permanent Career Save (`midlife_survivors_save_v1`): 401(k) Coins, shop ranks, unlocked characters,
//    Career Best Age, and Unlocked Decade Checkpoints (40, 50, 60, 70, 80 Senior Mode!).
// 2. Live Mid-Run Save State (`midlife_survivors_active_run_v1`): Auto-saves your exact Age, Level, HP,
//    and upgrades so you can close the browser or take a break and Resume Run anytime!

window.META_SHOP = [
  { id: "compoundInterest", name: "Employer Match",    desc: "+2 max HP at start of run",         baseCost: 5,  maxRank: 6 },
  { id: "espressoMachine",  name: "Home Espresso",     desc: "+10% starting move & fire speed",   baseCost: 6,  maxRank: 6 },
  { id: "taxWriteOff",      name: "CPA on Retainer",   desc: "+25% starting gem magnet range",    baseCost: 5,  maxRank: 5 },
  { id: "pensionPlan",      name: "Roth IRA & Pension", desc: "+1 starting damage to all weapons", baseCost: 12, maxRank: 4 },
  { id: "delayedRetirement", name: "Delayed Retirement", desc: "Overtime: Midlife runs last 5 more years", baseCost: 20, maxRank: 3 }
];

window.CHARACTERS = [
  {
    id: "officeWorker",
    name: "The 9-to-5er",
    tagline: "Balanced stats. Starts with Coffee Splash.",
    cost: 0,
    apply: s => {}
  },
  {
    id: "photographer", // internal id kept so existing saves and unlocks still work; shown as The Soccer Dad
    name: "The Soccer Dad",
    tagline: "Starts with Dad Joke aura + 25% wider range & faster feet.",
    cost: 10,
    apply: s => { s.dadJoke = true; s.jokeRadius = Math.round(s.jokeRadius * 1.25); s.speed = Math.round(s.speed * 1.12); }
  },
  {
    id: "gradStudent",
    name: "The Grad Student at 45",
    tagline: 'Starts with "No." shockwave + huge Wisdom gem magnet.',
    cost: 15,
    apply: s => { s.wordNo = true; s.magnetRadius = Math.round(s.magnetRadius * 1.5); s.cooldownMult *= 0.9; }
  }
];

window.DECADE_CHECKPOINTS = [
  { age: 40, name: "Age 40: The Grind Begins",    bonusLevels: 0 },
  { age: 50, name: "Age 50: Silver Fox Era",      bonusLevels: 2 },
  { age: 60, name: "Age 60: Empty Nest Decade",   bonusLevels: 4 },
  { age: 70, name: "Age 70: HOA Battleground",    bonusLevels: 6 },
  { age: 80, name: "Age 80: The Bonus Years", bonusLevels: 8 }
];

// Default Cross-Device Input Configuration (Keyboard, Mouse, Touch & Game Controller)
window.DEFAULT_CONTROLS = {
  // 1. Keyboard bindings (Event.code strings)
  keyUp: "KeyW",
  keyDown: "KeyS",
  keyLeft: "KeyA",
  keyRight: "KeyD",
  keyPause: "Space",
  keyView: "KeyV",
  keyMute: "KeyM",
  arrowMove: true,            // Arrow keys also move player alongside custom keys

  // 2. Mouse controls
  mouseMoveMode: "holdFollow", // "holdFollow" | "cursorFollow" | "clickDrag" | "off"
  mouseRightClick: "pause",    // "pause" | "move" | "view"
  mouseWheelView: true,        // Mouse wheel cycles Visual Engine during gameplay

  // 3. Touch controls
  touchMode: "floating",       // "floating" | "fixedLeft" | "fixedRight" | "directTouch"
  touchSensitivity: "normal",  // "high" (5px) | "normal" (10px) | "low" (18px)

  // 4. Video Game Controller (HTML5 Gamepad API standard button indices)
  padConfirmBtn: 0,            // 0 = A / Cross
  padPauseBtn: 9,              // 9 = Start / Options
  padViewBtn: 3,               // 3 = Y / Triangle
  padMuteBtn: 2,               // 2 = X / Square
  padDeadzone: 0.22            // 0.15 | 0.22 | 0.35
};

window.formatKeyCode = function(code) {
  if (!code) return "NONE";
  if (code.startsWith("Key")) return code.slice(3).toUpperCase();
  if (code.startsWith("Digit")) return code.slice(5);
  if (code.startsWith("Numpad")) return "NUM " + code.slice(6).toUpperCase();
  const map = {
    Space: "SPACE",
    Escape: "ESC",
    Enter: "ENTER",
    Tab: "TAB",
    ShiftLeft: "L-SHIFT",
    ShiftRight: "R-SHIFT",
    ControlLeft: "L-CTRL",
    ControlRight: "R-CTRL",
    AltLeft: "L-ALT",
    AltRight: "R-ALT",
    ArrowUp: "▲ UP",
    ArrowDown: "▼ DOWN",
    ArrowLeft: "◀ LEFT",
    ArrowRight: "▶ RIGHT",
    Backspace: "BACKSPACE"
  };
  return map[code] || code.toUpperCase();
};

window.PAD_BUTTON_NAMES = {
  0: "A / Cross (Btn 0)",
  1: "B / Circle (Btn 1)",
  2: "X / Square (Btn 2)",
  3: "Y / Triangle (Btn 3)",
  4: "LB / L1 (Btn 4)",
  5: "RB / R1 (Btn 5)",
  6: "LT / L2 (Btn 6)",
  7: "RT / R2 (Btn 7)",
  8: "Select / Share (Btn 8)",
  9: "Start / Options (Btn 9)",
  10: "L3 Stick (Btn 10)",
  11: "R3 Stick (Btn 11)"
};

window.formatPadButton = function(idx) {
  return window.PAD_BUTTON_NAMES[idx] || `Button ${idx}`;
};

// Default Accessibility Configuration (Saved in localStorage)
window.DEFAULT_ACCESSIBILITY = {
  textScale: "normal",       // "normal" (100%) | "large" (115%) | "xl" (130%)
  highContrast: false,       // High-contrast solid dark panels + clean sans-serif display font
  colorblindMode: "none",    // "none" | "highVis" | "deuteranopia" | "tritanopia"
  screenShake: 1.0,          // 1.0 (100% Full) | 0.5 (50% Gentle) | 0.0 (OFF - No Shake/Flash)
  gameSpeed: 1.0,            // 1.0 (100% Normal) | 0.85 (85% Relaxed) | 0.7 (70% Story) | 0.5 (50% Slow-Mo)
  autoMagnet: "standard",    // "standard" | "wide" (2x Range) | "auto" (Full-Screen Auto-Collect)
  largeCaptions: false       // Enlarged Dad Joke speech bubbles + visual audio alerts
};

const SAVE_KEY = "midlife_survivors_save_v1";
const RUN_SAVE_KEY = "midlife_survivors_active_run_v1";

function loadMeta() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        coins: parsed.coins || 0,
        ranks: parsed.ranks || {},
        unlockedChars: parsed.unlockedChars || { officeWorker: true },
        selectedChar: parsed.selectedChar || "officeWorker",
        bestAge: parsed.bestAge || 40.0,
        unlockedDecades: parsed.unlockedDecades || [40],
        startDecade: parsed.startDecade || 40,
        selectedStage: parsed.selectedStage || "auto",
        tipsOff: !!parsed.tipsOff, // Game Tips switch in the Pause menu
        runMode: parsed.runMode || "midlife",      // "midlife" (40-65) or "full" (40-100)
        fullLifeUnlocked: !!parsed.fullLifeUnlocked,
        achievements: Object.assign({ unlocked: {}, life: { splits: 0, plants: 0, evos: {} } }, parsed.achievements || {}),
        controls: Object.assign({}, window.DEFAULT_CONTROLS, parsed.controls || {}),
        accessibility: Object.assign({}, window.DEFAULT_ACCESSIBILITY, parsed.accessibility || {})
      };
    }
  } catch (e) {}
  return {
    coins: 0,
    ranks: {},
    unlockedChars: { officeWorker: true },
    selectedChar: "officeWorker",
    bestAge: 40.0,
    unlockedDecades: [40],
    startDecade: 40,
    selectedStage: "auto",
    runMode: "midlife",
    fullLifeUnlocked: false,
    achievements: { unlocked: {}, life: { splits: 0, plants: 0, evos: {} } },
    controls: Object.assign({}, window.DEFAULT_CONTROLS),
    accessibility: Object.assign({}, window.DEFAULT_ACCESSIBILITY)
  };
}

function saveMeta(meta) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(meta)); } catch (e) {}
}

function saveRunState(runData) {
  try { localStorage.setItem(RUN_SAVE_KEY, JSON.stringify(runData)); } catch (e) {}
}

function loadRunState() {
  try {
    const raw = localStorage.getItem(RUN_SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearRunState() {
  try { localStorage.removeItem(RUN_SAVE_KEY); } catch (e) {}
}
