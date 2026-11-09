// Pickups: things enemies drop that you collect.
window.PICKUPS = {
  wisdomGem: {
    name: "Wisdom Gem",
    xp: 1,            // experience points per gem
    size: 10,
    color: 0x5fb3f0,  // light blue
    magnetRadius: 110, // gems this close to you fly into your pocket
    magnetSpeed: 380
  },
  bossChest: {
    name: "Bonus Chest",
    size: 24,
    color: 0xf5c542,  // gold chest dropped by bosses; opens the Bonus Chest moment
    // How many rewards (light beams) each boss's chest pays out. Any boss not listed pays 3.
    tiers: { supplyCloset: 1, performanceReview: 1, newBoss: 1, holidayParty: 3, theReorg: 3, mortgageRefinance: 3, midlifeCrisis: 5, goldWatch: 5, hoaPresident: 3, retirementBoss: 5, pickleballChamp: 5 },
    defaultTier: 3,
    coinMultPerTier: { 1: 4, 3: 10, 5: 18 } // 401(k) payout = coin value x this
  },
  coin401k: {
    name: "401(k) Coin",
    value: 1,
    bankMult: 0.5,           // half of each coin's value reaches your bank (Oct 31: runs were paying far too much)
    dropChance: 0.06,        // 6% of regular enemies drop a coin (was 55%, then 30%: strong runs paid millions)
    size: 16,
    color: 0xf5c542,
    // Compound Interest Tiers: the longer you survive in a run, the more each 401(k) Coin is worth!
    compoundTiers: [         // coin value by age (kept small: coins now pay roughly by time survived, not by kill count)
      { minSeconds: 0, minAge: 40, value: 1, label: "1x MATCH" },
      { minSeconds: 0, minAge: 55, value: 2, label: "2x VESTED" },
      { minSeconds: 0, minAge: 75, value: 3, label: "3x GOLDEN" }
    ],
    // Every 5 years of Age survived in a run awards a scaling Compound Dividend bonus!
    dividendEveryYears: 5,
    dividendBase: 3          // +3k at Age 45, +5k at 50, +7k at 55, +9k at 60, +11k at 65...
  },
  pizza: {
    name: "Leftover Breakroom Pizza",
    heal: 2,          // +2 HP; drops from smashed plants, printers, vending machines and coolers
    size: 20,
    color: 0xff6b4a
  },
  // Desk Salad (Nov 3, Grok's healing spec): the rare "I packed lunch" drop from elites.
  salad: {
    name: "Desk Salad",
    healFrac: 0.22,          // 22% of max health...
    healMin: 3,              // ...and never less than 3
    lifeMs: 14000,           // wilts after 14 s (fades for the last 3 s)
    fadeMs: 3000,
    magnetSpeedMult: 1.15,   // pulled in a little faster than pizza
    maxOnGround: 2           // extras turn into a gem instead
  }
};

// Leveling: how much XP each level needs.
// Scales smoothly across the 40->80 playthrough (`xpNeeded = Math.round(xpNeeded * growth + stepXp)`)
// so you get 20-60 seconds of uninterrupted gameplay between level-up screens!
// How much loot can sit on the floor (Fable review #3, Nov 3). Hundreds of untouched gems and coins
// were each a live physics object checked every frame, which slowed older phones late in a run.
window.FLOOR_LIMITS = {
  gemCap: 150,          // more gems than this on the floor and the farthest ones merge...
  gemMergeBatch: 25,    // ...all at once (plus this many extra for headroom), into one big red gem worth all of them (the Vampire Survivors trick)
  bigGemScale: 1.7,     // how big the big gem looks
  coinLifeMs: 60000,    // a 401(k) coin nobody picks up disappears after a minute
  pizzaLifeMs: 60000,   // same for leftover pizza (Desk Salad keeps its own 14 s wilt)
  blinkMs: 4000         // they blink for the last few seconds so you can still grab them
};

window.LEVELING = {
  firstLevelXp: 8,    // 8 gems for Level 2 (lets you play ~15s before the first menu)
  growth: 1.35,       // 35% compound scaling per level
  stepXp: 4,          // +4 flat gem step per level (8 -> 15 -> 24 -> 36 -> 53 -> 76 -> 107...)
  // Catch-up XP (Nov 7 stats, Rami's pick): if you're behind the level most players have at your age,
  // gems give a bit more until you catch up. Careful players who kite the edges stop falling behind in the 50s.
  // byAge comes from real runs: [age, typical level]. Set on: false to turn it off.
  catchUp: {
    on: true,
    byAge: [[40, 1], [41, 3], [43, 6], [45, 9], [50, 12], [55, 17], [60, 21], [65, 24], [75, 26], [100, 30]],
    startBehind: 2,     // no boost until you're 2+ levels behind
    perLevel: 0.12,     // then +12% XP for each level behind past that
    max: 0.6            // never more than +60%
  }
};
