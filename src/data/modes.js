// Run modes. "midlife" is the main game: ages 40 to 65 in about 19 minutes.
// "full" is the original whole life (40 to 100, about an hour), unlocked by reaching 65 once.
// Tweak ages, clock speed, bosses and leaderboard tables here.
window.RUN_MODES = {
  midlife: {
    id: "midlife",
    name: "Midlife",
    blurb: "Ages 40 to 65. About 19 minutes.",
    startAge: 40,
    endAge: 65,              // Retirement arrives here (Overtime in the shop pushes it back)
    secondsPerYear: 45,      // 45 real seconds = 1 year
    bosses: ["performanceReview", "mortgageRefinance", "midlifeCrisis", "goldWatch"],
    overtimeYearsPerRank: 5, // each "Delayed Retirement" rank adds 5 years (65 -> 70 -> 75 -> 80)
    endBossLabel: "RETIREMENT",
    endBossName: "Your Retirement Party",
    endText: "Retirement is here. Walk up and clock out for good.",
    table: "scores_midlife", // its own online leaderboard
    clearBonus: 8000         // score bonus for reaching retirement
  },
  full: {
    id: "full",
    name: "Full Life",
    blurb: "Ages 40 to 100. About an hour, with save and resume.",
    startAge: null,          // uses the START AT age picked in Extras
    endAge: 100,
    secondsPerYear: 60,
    bosses: ["performanceReview", "mortgageRefinance", "midlifeCrisis", "hoaPresident", "retirementBoss", "pickleballChamp"],
    endBossLabel: null,      // Father Time, as before
    table: "scores",
    clearBonus: 25000,
    unlockText: "Earn the Retirement Plan achievement to unlock"
  }
};

// Unlocked by the "Retirement Plan" achievement (older saves that already reached 65 keep it too).
window.isFullLifeUnlocked = m => !!(m && ((m.achievements && m.achievements.unlocked && m.achievements.unlocked.retired) || m.fullLifeUnlocked || (m.bestAge || 40) >= 65));

// SPRINT (Nov 4, Rami: "like Vampire Survivors' Hyper mode"). A toggle on top of either mode.
// Years pass faster, everyone moves faster, and the 401(k) pays more. Unlocked by beating the Midlife Crisis V8.
window.SPRINT = {
  name: "Sprint",
  yearsMult: 2,       // years pass this much faster (Midlife to 65 in about 10 minutes)
  playerSpeedMult: 1.25,
  enemySpeedMult: 1.25,
  coinMult: 1.25,     // +25% 401(k) coins (Grok, Nov 4: 1.5 made Sprint the only way to farm)
  unlockAchievement: "keepTheSedan",
  unlockText: "Beat the Midlife Crisis V8 to unlock Sprint.",
  blurb: "Years pass 2x faster. Everyone moves 25% faster. +25% 401(k) coins."
};
window.isSprintUnlocked = m => !!(m && m.achievements && m.achievements.unlocked && m.achievements.unlocked[SPRINT.unlockAchievement]);
