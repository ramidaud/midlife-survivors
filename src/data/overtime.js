// Overtime (Nov 9): what happens past 65 when "Delayed Retirement" pushes the end to 70, 75 or 80.
// Grok's spec: docs/handoffs/grok-overtime-plateau-spec.md. Rami's calls: Workload on for everyone in Overtime,
// +0.3 hit damage per level (not 0.5), and the HOA President visits runs that go to 80.
//
// WORKLOAD: past 65 in Overtime only. Every 20 s the game checks three signs you're coasting:
//   health never under 70%, the room at most 35% full, and you moving 70 px/s or slower.
//   Two of three, two windows in a row: Workload goes up a level (a pip blinks 3 s first). Up to 5.
//   It drops one level the moment health falls under 50% (two under 30%), and after 3 busy windows.
window.OVERTIME_WORKLOAD = {
  on: true, modes: ["midlife"], fromAge: 65, needsOvertime: true,
  windowMs: 20000, coastSignsNeeded: 2, hpFloorFrac: 0.70, crowdFrac: 0.35, moveSpeed: 70,
  riseAfterWindows: 2, fallAfterWindows: 3, dropAtHpFrac: 0.50, dropTwoAtHpFrac: 0.30, dropCooldownMs: 10000,
  holdAfterChangeMs: 15000, holdFirstMs: 15000, warnMs: 3000, blendMs: 6000, maxLevel: 5,
  perLevel: {
    spawnDelayMult: [1, 0.92, 0.85, 0.79, 0.73, 0.68], // enemies come faster (eased in over 6 s)
    packAdd:        [0, 0, 1, 1, 2, 2],                // bigger groups
    enemyHpMult: 0.08,        // +8% enemy health per level (never bosses)
    hitDamageAdd: 0.3,        // Rami: start gentle (Grok suggested 0.5). Rounded when you get hit.
    eliteChanceAdd: 0.015,    // more named elites (which also means more Desk Salads)
    maxOnScreenMultDesktop: 0.04, maxOnScreenMultPhone: 0, // phones never get a bigger crowd
    scoreMult: 0.06, coinMult: 0.04 // "overtime pay": +6% score and +4% coins per level
  },
  caps: { minSpawnDelayFrac: 0.30, hitDamageAdd: 3 },
  upLines: ["You make it look easy, so they gave you more.", "Great news: your workload has been right-sized up.",
    "Since you're not busy, could you take this too?", "Someone noticed you're thriving. Uh oh."],
  downLines: ["Take a breath. Your pay stays.", "Workload eased. Someone else can take that one.", "Delegated. Nicely done."]
};

// Overtime-only bosses in Midlife: they only come if the Gold Watch is far enough away.
window.OVERTIME_BOSSES = {
  hoaPresident: { minYearsBeforeWatch: 3.0 } // age 70, so only in runs that go to 80 (Watch at 77.3)
};

// OVERTIME BEATS (Nov 9): little events between 64 and 80, only in Overtime runs. Built so far: Open Enrollment
// and Annual Enrollment. Grandkids' Visit, Clean Out Your Desk and the Reunion come next (see Grok's spec).
// A beat skips itself if the Gold Watch is due within minYearsBeforeWatch, and waits up to a year for a boss.
window.OVERTIME_BEATS = {
  on: true, needsOvertime: true, waitForBossYears: 1, holdSwarmEventsMs: 10000,
  schedule: [
    { age: 64.0, id: "openEnrollment",   minYearsBeforeWatch: 1.0 },
    { age: 66.0, id: "grandkids",        minYearsBeforeWatch: 1.0 },
    { age: 68.5, id: "cleanOutDesk",     minYearsBeforeWatch: 1.0 },
    { age: 72.5, id: "grandkids2",       minYearsBeforeWatch: 1.0 }, // until the Reunion is built, the 72.5 slot is Grandkids II
    { age: 75.8, id: "annualEnrollment", minYearsBeforeWatch: 1.0 }
  ],
  // "Your Medicare window is open. Please visit four different offices, in order."
  openEnrollment: {
    legs: 4, labels: ["PART A", "PART B", "PART C", "PART D"], legSec: 10, legMinPx: 450, legMaxPx: 800, reachPx: 80, leadMs: 1500,
    spamSwapFrac: 0.30,   // hold music: 30% of regular spawns become Spam Likely calls while it runs
    legCoinsPerFace: 5, legGems: 6, chestKey: "openEnrollment", scoreBonus: 2500, code: "OE",
    bannerTitle: "OPEN ENROLLMENT", bannerSub: "Four offices. Ten seconds each. Go.", badge: "MEDICARE", chipTitle: "OPEN ENROLLMENT",
    intro: "Your Medicare window is open. Visit each office in order. Follow the purple arrow.",
    doneLine: "Enrolled. Your card is in the mail. +2,500 score and a bonus chest.",
    missLine: "You're on hold. We'll call you back."
  },
  // "The grandkids stopped by the office. They want to play tag. You're it."
  // They run from you at 65% of your speed, through the swarm (enemies ignore them). Kid sprites: small interns for now.
  grandkids: {
    kids: 3, windowSec: 20, leadMs: 1200, speed: 150, keepMinPx: 260, keepMaxPx: 420, swayHz: 0.8, tagPx: 44, kidScale: 0.72,
    gifts: { drawingGems: 6, cookieHeal: 3, coinPerFace: 4 }, chestKey: "grandkids", scoreBonus: 2000, code: "GK",
    doneLine: "You tagged them all. +2,000 score and a bonus chest.", missLine: "They had to go. See you at Thanksgiving!"
  },
  grandkids2: { like: "grandkids", kids: 5, code: "GK2", intro: "The whole crew is here this time. Tag all five before they get bored." },
  // "Twenty-five years of desk. One cardboard box. Bargain hunters incoming." (Grok's spec 1.3, ChatGPT's icons)
  // Your keepsakes fly out across the floor. Walk over them to pack them; magnets don't work ("some things you carry
  // by hand"). Bargain Hunters race you to them. 15 seconds.
  cleanOutDesk: {
    windowSec: 15, flyMs: 1000, leadMs: 1200, minPx: 200, maxPx: 500, gapPx: 96, packPx: 40,
    hagglerEveryMs: 2500, hagglerReachPx: 22, scale: 1.5,
    perItemGems: 3, perItemCoinFace: 1, chestAt: 6, chestKey: "cleanOutDesk", scoreBonus: 2000, code: "CD",
    items: [ // frame order in assets/ui/keepsakes-v1.png
      { id: "stapler", name: "THE STAPLER" }, { id: "mug", name: "WORLD'S OKAYEST MUG" }, { id: "photo", name: "FAMILY PHOTO" },
      { id: "granola", name: "EMERGENCY GRANOLA" }, { id: "cactus", name: "DESK CACTUS" }, { id: "pen", name: "THE GOOD PEN" },
      { id: "bands", name: "RUBBER BAND BALL" }, { id: "coupon", name: "2009 COUPON" }
    ],
    bannerTitle: "DOWNSIZING", bannerSub: "Pack your keepsakes before the bargain hunters do.",
    intro: "Twenty-five years of desk. One cardboard box. Walk over your keepsakes to pack them. Bargain hunters incoming.",
    soldLines: ["SOLD! 50¢", "SOLD! 25¢", "SOLD AS IS!", "SOLD! NO RETURNS"],
    doneLine: "Every last thing. +2,000 score and the box.", boxLine: "Packed enough to fill the box. Bonus chest!",
    missLine: "The rest went in the yard sale. That's OK. You kept what mattered."
  },
  annualEnrollment: {
    like: "openEnrollment", legs: 3, labels: ["PART A", "PLAN COMPARISON", "PART D"], chestKey: "annualEnrollment", code: "AE",
    bannerTitle: "ANNUAL ENROLLMENT", bannerSub: "Three offices. Same forms as last year.", chipTitle: "ANNUAL ENROLLMENT",
    intro: "Annual enrollment. The forms changed slightly. Visit each office in order."
  }
};
