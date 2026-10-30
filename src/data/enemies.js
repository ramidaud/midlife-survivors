// Enemy settings. Each enemy is one entry. Tweak the numbers, reload, and feel it.
window.ENEMIES = {
  // ---- Regular Swarm (6 types, including 1 Elite) ----
  bill: {
    name: "Bill",
    label: "$",        // drawn on the enemy so you can tell what it is
    speed: 74,         // relaxed early-game speed so you can kite and collect gems
    hp: 1,             // 1 splash of coffee pays off a regular Bill right at Level 1!
    damage: 1,         // how much health it takes from you on contact
    size: 24,
    color: 0x6fbf73,   // money green
    overdueAfterMs: 14000 // leave a Bill unpaid for 14 seconds and it splits into 2 Late Fees!
  },
  lateFee: {
    name: "Late Fee",
    label: "FEE",
    speed: 110,        // faster and angrier than a regular Bill, but easy to outrun
    hp: 1,             // fragile: 1 splash clears it
    damage: 1,
    size: 18,
    color: 0xe0564f    // urgent red
  },
  spamCall: {
    name: "Spam Likely",
    label: "TEL",
    speed: 52,         // creeps onto the screen first...
    dashSpeed: 245,    // ...then RINGS and rockets in a straight line!
    ringAfterMs: 1600, // how long it creeps before ringing
    ringPauseMs: 750,  // stands still vibrating for 0.75s so you have plenty of time to sidestep
    hp: 2,
    damage: 1,
    size: 22,
    color: 0xb06ff0    // annoying notification purple
  },
  snackAttack: {
    name: "Late-Night Donut",
    label: "YUM",
    speed: 88,         // tempting frosted donut chasing you
    hp: 2,             // takes 2 splashes at base damage
    damage: 1,         // hurts your waistline AND slows you down briefly on contact
    slowFactor: 0.72,  // mild 28% slow during a sugar crash
    slowDurationMs: 1500,
    size: 24,
    color: 0xf078b8    // pink frosting
  },
  backTwinge: {
    name: "Back Twinge",
    label: "OUCH",
    speed: 170,        // lunges in short bursts
    lungeMs: 500,      // bursts forward for 0.50s...
    restMs: 550,       // ...then freezes for 0.55s (spasm -> pause -> spasm)
    hp: 2,
    damage: 1,
    size: 20,
    color: 0xf09c42    // sharp warning orange
  },
  officeGossip: {
    name: "Reply-All Chain",
    label: "CC:",
    isElite: true,     // ELITE enemy: tough, drops 3 Wisdom gems + 2 Coins!
    speed: 70,
    hp: 6,
    damage: 1,
    size: 34,
    color: 0x4fb8e0    // corporate inbox blue
  },

  // ---- The 3 Decade Bosses ----
  performanceReview: {
    name: "The Performance Review",
    label: "HR",
    spawnAge: 42,      // First boss at Age 42
    speed: 62,
    hp: 18,
    damage: 1,
    size: 52,
    color: 0xd94f6a    // crimson
  },
  mortgageRefinance: {
    name: "The Mortgage Refinance",
    label: "APR",
    spawnAge: 45,      // Second boss at Age 45
    speed: 58,         // heavy and steady
    hp: 34,            // paperwork tank, scaled for mid-run upgrades
    damage: 2,
    size: 60,
    color: 0x8c6fd9    // deep bank purple
  },
  midlifeCrisis: {
    name: "The Midlife Crisis",
    label: "V8",
    spawnAge: 48,      // Final boss at Age 48: arrives in a red sports convertible!
    speed: 108,        // fast, but slower than your upgraded character
    hp: 50,
    damage: 2,
    size: 58,
    color: 0xff2e4c    // sports-car red
  },
  theReaper: {
    name: "Father Time (The Big 5-0)",
    label: "50",
    spawnAge: 50,      // Arrives at Age 50! Like the Vampire Survivors Reaper, surviving to see him is the WIN!
    speed: 255,        // faster than the player
    hp: 9999,          // unstoppable
    damage: 99,        // one touch triggers the Age 50 Victory screen!
    size: 64,
    color: 0xf5c542
  }
};

// Wave schedule tied to your Age. Each wave lists weighted enemy types to spawn.
window.SPAWNING = {
  everyMs: 1250,
  maxOnScreen: 55,
  offscreenMargin: 70,
  waves: [
    { minAge: 40, everyMs: 1250, mix: [["bill", 10]] },
    { minAge: 41, everyMs: 1050, mix: [["bill", 8], ["spamCall", 2]] },
    { minAge: 43, everyMs: 880,  mix: [["bill", 6], ["spamCall", 2], ["snackAttack", 2]] },
    { minAge: 44, everyMs: 740,  mix: [["bill", 5], ["spamCall", 2], ["snackAttack", 2], ["backTwinge", 2], ["officeGossip", 1]] },
    { minAge: 46, everyMs: 620,  mix: [["bill", 4], ["spamCall", 2], ["snackAttack", 2], ["backTwinge", 2], ["officeGossip", 2]] }
  ]
};
