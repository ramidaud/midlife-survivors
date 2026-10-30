// Pickups: things enemies drop that you collect.
window.PICKUPS = {
  wisdomGem: {
    name: "Wisdom Gem",
    xp: 1,            // experience points per gem
    size: 10,
    color: 0x5fb3f0,  // light blue
    magnetRadius: 120, // gems this close to you fly into your pocket
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
    dropChance: 0.40, // 40% of paid-off Bills also drop a 401(k) Coin! (Elites drop 2, Bosses drop 5)
    size: 16,
    color: 0xf5c542
  }
};

// Leveling: how much XP each level needs. Each level asks for a bit more than the last.
window.LEVELING = {
  firstLevelXp: 3,    // only 3 gems needed for your first level-up!
  growth: 1.25        // smooth 25% curve so your upgrades keep pace with the waves
};
