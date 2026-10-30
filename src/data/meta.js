// Meta-progression: 401(k) Coins, permanent upgrades, unlockable characters, and localStorage save data.
// Everything here persists in your browser even after you close the tab!

window.META_SHOP = [
  { id: "compoundInterest", name: "Employer Match",   desc: "+2 max HP at start of run",       baseCost: 5,  maxRank: 5 },
  { id: "espressoMachine",  name: "Home Espresso",    desc: "+10% starting move & fire speed", baseCost: 6,  maxRank: 5 },
  { id: "taxWriteOff",      name: "CPA on Retainer",  desc: "+25% starting gem magnet range",  baseCost: 5,  maxRank: 4 }
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

const SAVE_KEY = "midlife_survivors_save_v1";

function loadMeta() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        coins: parsed.coins || 0,
        ranks: parsed.ranks || {},
        unlockedChars: parsed.unlockedChars || { officeWorker: true },
        selectedChar: parsed.selectedChar || "officeWorker"
      };
    }
  } catch (e) {}
  return { coins: 0, ranks: {}, unlockedChars: { officeWorker: true }, selectedChar: "officeWorker" };
}

function saveMeta(meta) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(meta)); } catch (e) {}
}
