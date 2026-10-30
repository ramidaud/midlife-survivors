// Enemy settings. Each enemy is one entry. Tweak the numbers, reload, and feel it.
window.ENEMIES = {
  // ---- Regular Swarm (6 types, including 1 Elite) ----
  bill: {
    name: "Bill",
    label: "$",        // drawn on the enemy so you can tell what it is
    speed: 90,         // pixels per second. The player is 220, so you can outrun them (for now)
    hp: 2,             // health: how many points of damage it takes to pay this Bill off
    damage: 1,         // how much health it takes from you on contact
    size: 24,
    color: 0x6fbf73,   // money green
    overdueAfterMs: 9000 // leave a Bill unpaid for 9 seconds and it splits into 2 Late Fees!
  },
  lateFee: {
    name: "Late Fee",
    label: "FEE",
    speed: 135,        // faster and angrier than a regular Bill
    hp: 1,             // fragile: 1 splash clears it
    damage: 1,
    size: 18,
    color: 0xe0564f    // urgent red
  },
  spamCall: {
    name: "Spam Likely",
    label: "TEL",
    speed: 55,         // creeps onto the screen first...
    dashSpeed: 310,    // ...then RINGS and rockets in a straight line!
    ringAfterMs: 1400, // how long it creeps before ringing
    ringPauseMs: 550,  // stands still vibrating for 0.55s so you can dodge
    hp: 2,
    damage: 1,
    size: 22,
    color: 0xb06ff0    // annoying notification purple
  },
  snackAttack: {
    name: "Late-Night Donut",
    label: "YUM",
    speed: 105,        // tempting frosted donut chasing you
    hp: 3,             // a bit doughy
    damage: 1,         // hurts your waistline AND slows you down for 2s on contact!
    slowFactor: 0.65,  // 35% slower movement during a sugar crash
    slowDurationMs: 2000,
    size: 24,
    color: 0xf078b8    // pink frosting
  },
  backTwinge: {
    name: "Back Twinge",
    label: "OUCH",
    speed: 200,        // lunges fast!
    lungeMs: 550,      // bursts forward for 0.55s...
    restMs: 450,       // ...then freezes for 0.45s (spasm -> pause -> spasm)
    hp: 2,
    damage: 1,
    size: 20,
    color: 0xf09c42    // sharp warning orange
  },
  officeGossip: {
    name: "Reply-All Chain",
    label: "CC:",
    isElite: true,     // ELITE enemy: tough, drops 3 Wisdom gems, and splits into 3 mini-rumors when defeated!
    speed: 78,
    hp: 8,
    damage: 1,
    size: 34,
    color: 0x4fb8e0    // corporate inbox blue
  },

  // ---- The 3 Decade Bosses ----
  performanceReview: {
    name: "The Performance Review",
    label: "HR",
    spawnAge: 42,      // First boss at Age 42
    speed: 72,
    hp: 30,
    damage: 2,
    size: 52,
    color: 0xd94f6a    // crimson
  },
  mortgageRefinance: {
    name: "The Mortgage Refinance",
    label: "APR",
    spawnAge: 45,      // Second boss at Age 45
    speed: 65,         // heavy and unstoppable
    hp: 55,            // massive paperwork tank
    damage: 2,
    size: 60,
    color: 0x8c6fd9    // deep bank purple
  },
  midlifeCrisis: {
    name: "The Midlife Crisis",
    label: "V8",
    spawnAge: 48,      // Final boss at Age 48: arrives in a red sports convertible!
    speed: 130,        // fast!
    hp: 80,
    damage: 3,
    size: 58,
    color: 0xff2e4c    // sports-car red
  }
};

// Wave schedule tied to your Age. Each wave lists weighted enemy types to spawn.
window.SPAWNING = {
  everyMs: 900,
  maxOnScreen: 80,
  offscreenMargin: 70,
  waves: [
    { minAge: 40, everyMs: 900, mix: [["bill", 10]] },
    { minAge: 41, everyMs: 760, mix: [["bill", 7], ["spamCall", 3]] },
    { minAge: 43, everyMs: 640, mix: [["bill", 5], ["spamCall", 3], ["snackAttack", 2]] },
    { minAge: 44, everyMs: 540, mix: [["bill", 4], ["spamCall", 2], ["snackAttack", 2], ["backTwinge", 2], ["officeGossip", 1]] },
    { minAge: 46, everyMs: 440, mix: [["bill", 3], ["spamCall", 3], ["snackAttack", 2], ["backTwinge", 3], ["officeGossip", 2]] }
  ]
};
