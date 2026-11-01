// Tax Bracket: opt-in extra difficulty for veterans (like Vampire Survivors' Curse or Hades' Heat).
// Pick it on the title screen. 0 = off (default). Each level stacks everything in perLevel.
// From Grok's difficulty review, Part 3A (Nov 1).
window.TAX_BRACKET = {
  maxLevel: 5,
  perLevel: {
    enemyHpMult: 0.12,   // +12% enemy and boss HP per bracket
    packAdd: 0.25,       // +0.25 enemies per spawn group per bracket (rounded down)
    spawnFaster: 0.03,   // spawns 3% faster per bracket
    hitDamageAdd: 0.5,   // +0.5 contact damage per bracket (rounded)
    healEfficacy: 0.10,  // heals restore 10% less per bracket (never below 40%)
    coinMult: 0.20,      // +20% 401(k) coins per bracket
    xpMult: 0.10,        // +10% XP per bracket
    scoreMult: 0.15      // +15% leaderboard score per bracket
  },
  labels: ["Standard Deduction", "W-2", "Itemizing", "Audit Letter", "Underpayment Penalty", "Full Audit"]
};
