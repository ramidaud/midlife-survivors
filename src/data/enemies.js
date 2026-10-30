// Enemy settings & Full Life Wave Schedule (Age 40 -> 80 Main Goal, plus Age 80 -> 100 Bonus Senior Rounds!).
// Note: Base HP and Speed below are for Age 40; `createEnemy` in `main.js` scales HP, Speed, and Damage
// upward every few years so later decades require real builds, evolutions, and 401(k) upgrades!

window.ENEMIES = {
  // ---- Regular Swarm (6 types, including 1 Elite) ----
  bill: {
    name: "Bill",
    label: "$",
    seniorLabel: "COPAY",
    speed: 84,
    hp: 1,
    damage: 1,
    size: 24,
    color: 0x6fbf73,
    overdueAfterMs: 11000 // leave a Bill unpaid for 11 seconds and it splits into 2 fast Late Fees!
  },
  lateFee: {
    name: "Late Fee",
    label: "FEE",
    seniorLabel: "HOA$",
    speed: 125,
    hp: 1,
    damage: 1,
    size: 18,
    color: 0xe0564f
  },
  spamCall: {
    name: "Spam Likely",
    label: "TEL",
    seniorLabel: "SCAM!",
    speed: 56,
    dashSpeed: 275,
    ringAfterMs: 1450,
    ringPauseMs: 620,
    hp: 2,
    damage: 1,
    size: 22,
    color: 0xb06ff0
  },
  snackAttack: {
    name: "Late-Night Donut",
    label: "YUM",
    seniorLabel: "PRUNE",
    speed: 96,
    hp: 2,
    damage: 1,
    slowFactor: 0.68,
    slowDurationMs: 1800,
    size: 24,
    color: 0xf078b8
  },
  backTwinge: {
    name: "Back Twinge",
    label: "OUCH",
    seniorLabel: "HIP!",
    speed: 188,
    lungeMs: 520,
    restMs: 480,
    hp: 2,
    damage: 1,
    size: 20,
    color: 0xf09c42
  },
  officeGossip: {
    name: "Reply-All Chain",
    label: "CC:",
    seniorLabel: "BINGO",
    isElite: true,
    speed: 75,
    hp: 7,
    damage: 2,
    size: 34,
    color: 0x4fb8e0
  },

  // ---- Decade Bosses (Age 45, 52, 60, 70, 80, plus Senior Bosses at 90 and 100!) ----
  performanceReview: {
    name: "The Performance Review",
    label: "HR",
    tex: "performanceReview",
    spawnAge: 45,
    speed: 68,
    hp: 30,
    damage: 2,
    size: 52,
    color: 0xd94f6a
  },
  mortgageRefinance: {
    name: "The 30-Year Mortgage",
    label: "APR",
    tex: "mortgageRefinance",
    spawnAge: 52,
    speed: 64,
    hp: 70,
    damage: 2,
    size: 60,
    color: 0x8c6fd9
  },
  midlifeCrisis: {
    name: "The Midlife Crisis V8",
    label: "V8",
    tex: "midlifeCrisis",
    spawnAge: 60,
    speed: 118,
    hp: 130,
    damage: 3,
    size: 58,
    color: 0xff2e4c
  },
  hoaPresident: {
    name: "The HOA Board President",
    label: "HOA",
    tex: "performanceReview",
    tint: 0xffe042,
    spawnAge: 70,
    speed: 82,
    hp: 210,
    damage: 3,
    size: 56,
    color: 0xf5c542
  },
  retirementBoss: {
    name: "Mandatory Retirement Test",
    label: "80!",
    tex: "mortgageRefinance",
    tint: 0x6be2ff,
    spawnAge: 79.2,
    speed: 78,
    hp: 300,
    damage: 4,
    size: 62,
    color: 0x6be2ff
  },
  pickleballChamp: {
    name: "6AM Pickleball Champion (Senior Boss)",
    label: "90!",
    tex: "midlifeCrisis",
    tint: 0x6fbf73,
    spawnAge: 90,
    speed: 132,
    hp: 460,
    damage: 4,
    size: 60,
    color: 0x6fbf73
  },
  theReaper: {
    name: "Father Time (The Big 1-0-0!)",
    label: "100",
    tex: "theReaper",
    spawnAge: 100,
    speed: 260,
    hp: 9999,
    damage: 99,
    size: 64,
    color: 0xf5c542
  }
};

// Wave schedule tied to your Age (from 40 to 80, plus the 80-100 Senior Bonus Rounds!).
window.SPAWNING = {
  everyMs: 1050,
  maxOnScreen: 75,
  offscreenMargin: 70,
  waves: [
    { minAge: 40, everyMs: 1050, mix: [["bill", 10]] },
    { minAge: 42, everyMs: 880,  mix: [["bill", 7], ["spamCall", 3]] },
    { minAge: 45, everyMs: 740,  mix: [["bill", 5], ["spamCall", 3], ["snackAttack", 2]] },
    { minAge: 50, everyMs: 620,  mix: [["bill", 4], ["spamCall", 2], ["snackAttack", 2], ["backTwinge", 2], ["officeGossip", 1]] },
    { minAge: 60, everyMs: 500,  mix: [["bill", 3], ["spamCall", 3], ["snackAttack", 2], ["backTwinge", 3], ["officeGossip", 2]] },
    { minAge: 70, everyMs: 410,  mix: [["bill", 2], ["spamCall", 3], ["snackAttack", 3], ["backTwinge", 4], ["officeGossip", 3]] },
    // BONUS 20 SENIOR ROUNDS (Age 80 to 100): Fast, chaotic Golden Years!
    { minAge: 80, everyMs: 330,  mix: [["bill", 2], ["spamCall", 4], ["snackAttack", 3], ["backTwinge", 5], ["officeGossip", 4]] },
    { minAge: 90, everyMs: 270,  mix: [["spamCall", 4], ["snackAttack", 4], ["backTwinge", 6], ["officeGossip", 5]] }
  ]
};
