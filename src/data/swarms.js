// Intensity curve + swarm events (Objective 8). Tweak these numbers to change how hard each decade feels.

// The everyday drip of enemies, smoothed between the waves in enemies.js.
window.INTENSITY = {
  packSizeByAge: [[40, 1], [43, 1], [47, 2], [55, 3], [70, 4], [85, 5], [95, 6]], // enemies per spawn tick, they arrive as a little group
  hpPerYear: 0.09,          // enemies get 9% tougher every year you age (smooth, no big jumps)
  hpPerLevel: 0.10,         // ...and 10% tougher for every level YOU gain, so perks alone can't make you untouchable
  bossHpPerLevel: 0.28,     // bosses scale with your level too (they used to stay the same and melt)
  bossHpPerYear: 0.10,      // ...and +10% boss HP per year past 40 (Grok review, Nov 1)
  swarmGrowthPerYear: 0.035, // swarms get 3.5% bigger for every year past their first appearance
  maxOnScreenByAge: [[40, 70], [50, 120], [58, 170], [65, 210], [100, 250]], // crowd limit grows as you age
  packPerLevel: 0.35,       // +1 enemy per spawn group for about every 3 levels you gain
  spawnFasterPerLevel: 0.028, // spawns come 2.8% faster per level you gain (down to 45% of the normal delay)
  hitDamageByAge: [[40, 0], [48, 1], [55, 2], [62, 3]], // extra damage every enemy deals on contact as you age
  eventEveryMsByAge: [[40, 80000], [60, 60000], [80, 45000], [100, 35000]] // time between swarm events
};

// Swarm events: set pieces announced in the lower third.
// pattern: "ring" = surrounds you and closes in, "wall" = a line sweeping in from one side, "pack" = a tight clump from one direction
window.SWARM_EVENTS = [
  { id: "taxSeason",   minAge: 43, weight: 3, pattern: "ring", kind: "bill",         count: 14, badge: "TAX SEASON",  text: "You're surrounded by Bills. Pick a gap and push through." },
  { id: "robocalls",   minAge: 46, weight: 3, pattern: "wall", kind: "spamCall",     count: 12, badge: "ROBOCALLS",   text: "A wall of Spam Likely incoming. Dodge sideways." },
  { id: "donutDrop",   minAge: 50, weight: 2, pattern: "pack", kind: "snackAttack",  count: 14, badge: "DONUT DROP",  text: "Someone brought donuts. Do not touch the donuts." },
  { id: "lateFeeRush", minAge: 55, weight: 2, pattern: "wall", kind: "lateFee",      count: 16, badge: "PAST DUE",    text: "A rush of Late Fees. Small, fast, everywhere." },
  { id: "replyAll",    minAge: 58, weight: 2, pattern: "ring", kind: "officeGossip", count: 8,  badge: "REPLY ALL",   text: "The whole office hit Reply All. Keep your distance." },
  { id: "backOut",     minAge: 65, weight: 2, pattern: "ring", kind: "backTwinge",   count: 12, badge: "THREW OUT BACK", text: "Back Twinges from every side. Move when they pause." },
  { id: "backToBack",  minAge: 48, weight: 2, pattern: "wall", kind: "calendarInvite", count: 14, badge: "BACK-TO-BACK", text: "Back-to-back meetings charging through. Find the gap." },
  { id: "insomnia",    minAge: 54, weight: 2, pattern: "ring", kind: "threeAmThought", count: 12, badge: "3 AM",        text: "Can't sleep. Every thought at once. Hit them when they're solid." },
  { id: "homework",    minAge: 62, weight: 2, pattern: "ring", kind: "mathWorksheet",  count: 8,  badge: "HOMEWORK",    text: "Math Homework is circling. Break out before it closes in." },
  { id: "allAtOnce",   minAge: 80, weight: 2, pattern: "ring", kind: "mixed",        count: 26, badge: "EVERYTHING",  text: "Everything, all at once. Welcome to your 80s." }
];
