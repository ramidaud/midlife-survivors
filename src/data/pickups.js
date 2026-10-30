// Pickups: things enemies drop that you collect.
window.PICKUPS = {
  wisdomGem: {
    name: "Wisdom Gem",
    xp: 1,            // experience points per gem
    size: 10,
    color: 0x5fb3f0,  // light blue
    magnetRadius: 90, // gems this close to you fly into your pocket
    magnetSpeed: 350
  },
  bossChest: {
    name: "Bonus Chest",
    size: 24,
    color: 0xf5c542   // gold chest dropped by bosses; opens a free weapon/upgrade screen
  }
};

// Leveling: how much XP each level needs. Each level asks for a bit more than the last.
window.LEVELING = {
  firstLevelXp: 5,    // gems needed to go from level 1 to 2
  growth: 1.4         // each next level needs 40% more. Try 1.1 for fast leveling
};
