// Meta-progression & Full Save State System (`src/data/meta.js`):
// 1. Permanent Career Save (`midlife_survivors_save_v1`): 401(k) Coins, shop ranks, unlocked characters,
//    Career Best Age, and Unlocked Decade Checkpoints (40, 50, 60, 70, 80 Senior Mode!).
// 2. Live Mid-Run Save State (`midlife_survivors_active_run_v1`): Auto-saves your exact Age, Level, HP,
//    and upgrades so you can close the browser or take a break and Resume Run anytime!

window.META_SHOP = [
  { id: "compoundInterest", name: "Employer Match",    desc: "+2 max HP at start of run",         baseCost: 5,  maxRank: 6 },
  { id: "espressoMachine",  name: "Home Espresso",     desc: "+10% starting move & fire speed",   baseCost: 6,  maxRank: 6 },
  { id: "taxWriteOff",      name: "CPA on Retainer",   desc: "+25% starting gem magnet range",    baseCost: 5,  maxRank: 5 },
  { id: "pensionPlan",      name: "Roth IRA & Pension", desc: "+1 starting damage to all weapons", baseCost: 12, maxRank: 4 }
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
    id: "photographer",
    name: "The Senior Photographer",
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
  { age: 80, name: "Age 80: Senior Bonus Rounds", bonusLevels: 8 }
];

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
        startDecade: parsed.startDecade || 40
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
    startDecade: 40
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
