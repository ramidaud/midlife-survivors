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
    color: 0xf5c542   // gold chest dropped by bosses; opens a free weapon/upgrade screen
  },
  coin401k: {
    name: "401(k) Coin",
    value: 1,
    dropChance: 0.55,        // 55% base drop chance from regular Bills (scales up to 75% as you age!)
    size: 16,
    color: 0xf5c542,
    // Compound Interest Tiers: the longer you survive in a run, the more each 401(k) Coin is worth!
    compoundTiers: [
      { minSeconds: 0,   minAge: 40, value: 1, label: "1x MATCH" },
      { minSeconds: 42,  minAge: 44, value: 2, label: "2x VESTED" },
      { minSeconds: 100, minAge: 50, value: 3, label: "3x SENIORITY" },
      { minSeconds: 175, minAge: 60, value: 4, label: "4x EXECUTIVE" },
      { minSeconds: 250, minAge: 70, value: 5, label: "5x COMPOUND" },
      { minSeconds: 320, minAge: 80, value: 6, label: "6x GOLDEN" }
    ],
    // Every 5 years of Age survived in a run awards a scaling Compound Dividend bonus!
    dividendEveryYears: 5,
    dividendBase: 3          // +3k at Age 45, +5k at 50, +7k at 55, +9k at 60, +11k at 65...
  },
  pizza: {
    name: "Leftover Breakroom Pizza",
    heal: 3,          // restores +3 HP when you smash a potted office plant!
    size: 20,
    color: 0xff6b4a
  }
};

// Leveling: how much XP each level needs.
// Scales smoothly across the 40->80 playthrough (`xpNeeded = Math.round(xpNeeded * growth + stepXp)`)
// so you get 20-60 seconds of uninterrupted gameplay between level-up screens!
window.LEVELING = {
  firstLevelXp: 8,    // 8 gems for Level 2 (lets you play ~15s before the first menu)
  growth: 1.35,       // 35% compound scaling per level
  stepXp: 4           // +4 flat gem step per level (8 -> 15 -> 24 -> 36 -> 53 -> 76 -> 107...)
};
