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
  annualEnrollment: {
    like: "openEnrollment", legs: 3, labels: ["PART A", "PLAN COMPARISON", "PART D"], chestKey: "annualEnrollment", code: "AE",
    bannerTitle: "ANNUAL ENROLLMENT", bannerSub: "Three offices. Same forms as last year.", chipTitle: "ANNUAL ENROLLMENT",
    intro: "Annual enrollment. The forms changed slightly. Visit each office in order."
  }
};
