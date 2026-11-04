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
    hp: 3,           // three splashes to pay off (was 2 until Nov 2: Rami never got touched early)
    damage: 1,
    size: 24,
    color: 0x6fbf73,
    overdueAfterMs: 11000, // leave a Bill unpaid for 11 seconds and it splits into 2 fast Late Fees!
    overdueEarlyMs: 14000, overdueEarlyUntilAge: 43 // a grace period for the first few years (Gemini Argon, Nov 4: beginners died at 41.5 to Late Fees)
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
    slowDurationMs: 1400, // was 1800: one donut hit no longer sets up two more (Grok final pass, Nov 4)
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
    seniorLabel: "RUMOR",
    isElite: true,
    speed: 75,
    hp: 7,
    damage: 2,
    size: 34,
    color: 0x4fb8e0
  },

  // ---- New enemies (Objective 9): each one moves in its own way ----
  threeAmThought: {
    name: "3 AM Thought",
    label: "3AM",
    seniorLabel: "4:12AM",
    speed: 72,
    hp: 3,
    damage: 1,
    size: 28,
    color: 0x9a8cff,
    solidMs: 1800,     // solid: can hurt you and be hit
    ghostMs: 1500,     // ghost: see-through, can't hurt you or be hit, sneaks closer faster
    ghostSpeed: 125
  },
  calendarInvite: {
    name: "Calendar Invite",
    label: "MTG",
    seniorLabel: "BINGO",
    speed: 165,        // charges straight across in the direction it locked when it appeared
    hp: 2,
    damage: 1,
    size: 26,
    color: 0x5aa0ff
  },
  groupChat: {
    name: "Group Chat",
    label: "87 NEW",
    seniorLabel: "FWD:FWD",
    speed: 80,
    hp: 4,
    damage: 1,
    size: 30,
    color: 0x6fd98c,
    keepDistance: 260, // hangs back this far away
    fireEveryMs: 2600, // sends a message ping this often
    typingMs: 850,     // shows "typing..." this long before each ping (your warning). Was 650 (Grok, Nov 3)
    pingSpeed: 190,    // was 210 (Grok, Nov 3)
    pingLifeMs: 3200
  },
  mathWorksheet: {
    name: "Math Homework",
    label: "2+2=?",
    seniorLabel: "SUDOKU",
    speed: 260,        // max speed while spiraling
    hp: 7,
    damage: 2,
    size: 30,
    color: 0xf2f2e6,
    spinPerSec: 1.6,   // how fast it circles you (radians per second)
    closeInPerSec: 34  // how fast the circle shrinks (pixels per second)
  },

  // ---- Decade Bosses (Age 45, 52, 60, 70, 80, plus Senior Bosses at 90 and 100!) ----
  performanceReview: {
    name: "The Performance Review",
    label: "HR",
    tex: "performanceReview",
    spawnAge: 45,
    speed: 68,
    hp: 36, // was 45: less time stuck in the 45-49 crush (Grok final pass, Nov 4)
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
    hp: 85, // was 110: shorter overlap with the age-50 swarm (Grok final pass, Nov 4)
    damage: 2,
    size: 60,
    color: 0x8c6fd9
  },
  // Midlife mode's final boss (Nov 3; numbers by Grok, docs/handoffs/grok-gold-watch-spec.md). Fight logic: src/gold-watch.js
  goldWatch: {
    name: "The Gold Watch",
    label: "TIME",
    seniorLabel: "TIME",
    tex: "goldWatch",
    spawnAge: 63.5,
    speed: 48,
    hp: 150,
    damage: 2,
    size: 64,
    color: 0xd9a441
  },
  midlifeCrisis: {
    name: "The Midlife Crisis V8",
    label: "V8",
    tex: "midlifeCrisis",
    spawnAge: 60,
    speed: 118,
    hp: 200,
    damage: 3,
    size: 58,
    color: 0xff2e4c
  },
  hoaPresident: {
    name: "The HOA Board President", // drawn by ChatGPT (Nov 4): assets/bosses/boss-hoa-president-v1.png; tex is the fallback
    label: "HOA",
    tex: "performanceReview",
    spawnAge: 70,
    speed: 82,
    hp: 210,
    damage: 3,
    size: 56,
    color: 0xf5c542
  },
  retirementBoss: {
    name: "Mandatory Retirement Audit", // matches the lore archive (Gemini final pass)
    label: "80!",
    tex: "mortgageRefinance",
    spawnAge: 79.2,
    speed: 78,
    hp: 260, // Grok Nov 4: was 300 (about 1.5 min fight)
    damage: 4,
    size: 62,
    color: 0x6be2ff
  },
  pickleballChamp: {
    name: "The 6 AM Pickleball Champion",
    label: "90!",
    tex: "midlifeCrisis",
    spawnAge: 90,
    speed: 132,
    hp: 340, // Grok Nov 4: was 460 (a 4-minute chase was too long)
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
// How big enemies look and how big their hit boxes are (Nov 2, after Rami played Nerd Survivors).
// Regular enemies were about half the hero's height, and bosses were barely bigger than the hero.
// 1 = original size. Bosses keep a smaller hit box than they look, so they don't jam between desks.
window.ENEMY_SCALE = { regular: 1.4, boss: 2.3, bossHitbox: 0.5 };
// Name tags (FLAKE!, TAPAS, 9PM BED...) turn into a wall of tiny text when the screen fills up (Fable review #7).
// Past this many enemies, regular enemies hide their tags. Bosses, elites and the Group Chat's "typing..." always keep theirs.
window.ENEMY_TAGS = { hideOverPhone: 25, hideOverDesktop: 60 };
window.BOSS_KINDS = ["performanceReview", "mortgageRefinance", "midlifeCrisis", "goldWatch", "hoaPresident", "retirementBoss", "pickleballChamp", "theReaper"];
for (const [kind, E] of Object.entries(window.ENEMIES)) {
  E.scale = window.BOSS_KINDS.includes(kind) ? window.ENEMY_SCALE.boss : window.ENEMY_SCALE.regular;
  E.size = Math.round(E.size * E.scale); // labels, weapon reach and Close Calls read this
}

window.SPAWNING = {
  everyMs: 1050,
  maxOnScreen: 75,
  offscreenMargin: 70,
  waves: [
    { minAge: 40, everyMs: 1400, mix: [["bill", 10]] }, // was 1150 (Grok, Nov 3: a gentler first minute for new players; Rami OK) // still gentle (Ben: "brutal"), but not empty (Rami, Nov 2: "too easy up front")
    { minAge: 42, everyMs: 820,  mix: [["bill", 7], ["spamCall", 3], ["snackAttack", 1]] }, // donuts show up earlier
    { minAge: 43.5, everyMs: 700, mix: [["bill", 6], ["spamCall", 3], ["snackAttack", 2]] },
    { minAge: 45, everyMs: 520,  mix: [["bill", 5], ["spamCall", 3], ["snackAttack", 2], ["calendarInvite", 2]] },
    { minAge: 50, everyMs: 380,  mix: [["bill", 4], ["spamCall", 2], ["snackAttack", 2], ["backTwinge", 2], ["officeGossip", 1], ["calendarInvite", 2], ["threeAmThought", 2], ["groupChat", 1]] }, // Group Chat soft intro (Grok, Nov 3)
    { minAge: 60, everyMs: 320,  mix: [["bill", 3], ["spamCall", 3], ["snackAttack", 2], ["backTwinge", 3], ["officeGossip", 2], ["calendarInvite", 2], ["threeAmThought", 2], ["groupChat", 1], ["mathWorksheet", 1]] }, // fewer chats while the V8 is in (Grok, Nov 3: the 60-61 wall)
    { minAge: 70, everyMs: 280,  mix: [["bill", 2], ["spamCall", 3], ["snackAttack", 3], ["backTwinge", 4], ["officeGossip", 3], ["calendarInvite", 2], ["threeAmThought", 3], ["groupChat", 2], ["mathWorksheet", 2]] },
    // BONUS 20 SENIOR ROUNDS (Age 80 to 100): Fast, chaotic Golden Years!
    { minAge: 80, everyMs: 240,  mix: [["bill", 2], ["spamCall", 4], ["snackAttack", 3], ["backTwinge", 5], ["officeGossip", 4], ["calendarInvite", 2], ["threeAmThought", 4], ["groupChat", 3], ["mathWorksheet", 2]] },
    { minAge: 90, everyMs: 200,  mix: [["spamCall", 4], ["snackAttack", 4], ["backTwinge", 6], ["officeGossip", 5], ["threeAmThought", 5], ["groupChat", 3], ["mathWorksheet", 3]] }
  ]
};
