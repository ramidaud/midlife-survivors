// Age 50+ run modifiers (Grok Part 3D, spec: docs/handoffs/grok-modifiers.md). Built Nov 3, 2026.
// After 50, short "life happens" weather patterns roll in: one at a time, a couple per run, announced with a banner.
// Tune weights before strengths. If nobody sees any between 50 and 65, raise chancePerRoll to 0.65 first.
window.RUN_MODIFIER_TUNING = {
  firstEligibleAge: 50,
  rollEveryYears: 2.5,            // Midlife: about 112 s between roll attempts
  chancePerRoll: 0.55,
  heatChanceAddPerBracket: 0.06,  // Tax Bracket makes them more frequent...
  heatIntensityAddPerBracket: 0.05, // ...and Rent Hike a bit tougher
  chanceMin: 0.15, chanceMax: 0.90,
  cooldownYears: 1.5,             // quiet time after one ends
  noRollAfterHurtMs: 3000,
  noRollAfterLevelUpMs: 2500,
  pityFailsBeforeForce: 3,
  firstRollChanceBonus: 0.20,
  exclusivePairs: [["rentHike", "doubleLateFees"]]
};

// effects keys (read through window.modFx(key, default) at the matching spot in the game):
//   waveBias {kind: +weight}   threeAmGhostMsMult   nearMissBandAdd   nearMissXpBase   comboDecayMs
//   magnetMult   rangeMult   billHpMult   packAdd   gemXpMult   pizzaHealMult   pizzaHealAdd   speedMult
//   gossipDamageAdd   gossipHpMult   eliteHpMult   jokeRadiusMult   pushSpeedMult   lateFeeCount
//   overdueAfterMs   spawnDelayMult   plantItemMult
window.RUN_MODIFIER_DEFS = [
  { id: "ghostHour", minAge: 50, weight: 3, durationYears: 2.0, kind: "alert",
    title: "GHOST HOUR", sub: "More 3 AM Thoughts. They linger.",
    effects: { waveBias: { threeAmThought: 4 }, threeAmGhostMsMult: 1.35, nearMissBandAdd: 2 } },
  { id: "readingGlasses", minAge: 50, weight: 2, durationYears: 2.0, kind: "alert",
    title: "READING GLASSES", sub: "Left them upstairs. Magnet feels shorter.",
    effects: { magnetMult: 0.70, rangeMult: 0.90, nearMissXpBase: 0.50 } },
  { id: "rentHike", minAge: 50, weight: 3, durationYears: 2.5, kind: "alert", scales: ["billHpMult"],
    title: "RENT HIKE", sub: "Bills got pricier. Pack it in.",
    effects: { waveBias: { bill: 3 }, billHpMult: 1.25 } },
  { id: "emptyNest", minAge: 52, weight: 2, durationYears: 2.0, kind: "reward",
    title: "EMPTY NEST", sub: "Quieter house. Hungrier hallway.",
    effects: { packAdd: 1, gemXpMult: 1.20, pizzaHealMult: 0.75, comboDecayMs: 3000 } },
  { id: "backSpasm", minAge: 50, weight: 2, durationYears: 2.0, kind: "alert",
    title: "BACK SPASM", sub: "Everything lunges. You move a hair slower.",
    effects: { waveBias: { backTwinge: 4 }, speedMult: 0.92 } },
  { id: "replyAllTax", minAge: 52, weight: 2, durationYears: 2.0, kind: "alert",
    title: "REPLY-ALL TAX", sub: "CC: everyone. Chains hit harder.",
    effects: { waveBias: { officeGossip: 5 }, gossipDamageAdd: 1, eliteHpMult: 1.15, jokeRadiusMult: 1.10, pushSpeedMult: 1.15 } },
  { id: "doubleLateFees", minAge: 50, weight: 3, durationYears: 2.0, kind: "alert",
    title: "PAST DUE", sub: "Unpaid Bills split into four Late Fees.",
    effects: { lateFeeCount: 4, overdueAfterMs: 9000 } },
  { id: "openEnrollment", minAge: 55, weight: 2, durationYears: 1.5, kind: "reward",
    title: "OPEN ENROLLMENT", sub: "Paperwork swarm. Snacks on us.",
    effects: { spawnDelayMult: 0.90, waveBias: { calendarInvite: 2, bill: 1 }, pizzaHealAdd: 1, plantItemMult: 1.5 } }
];
