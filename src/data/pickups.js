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
    dropChance: 0.38, // 38% of paid-off Bills also drop a 401(k) Coin! (Elites drop 2, Bosses drop 5)
    size: 16,
    color: 0xf5c542
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
