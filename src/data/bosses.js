// Boss special attacks (Grok spec, Nov 2: docs/handoffs/grok-boss-attacks.md). Tweak freely.
// Times in milliseconds, speeds in pixels per second, sizes in pixels.
// One boss at a time (Nov 4, Rami: "the 2nd boss showed up before the 1st one was defeated").
// A boss that's due waits while another boss is still alive, but never more than this many years late.
// The Gold Watch and the retirement clock are tied to the end of the run, so they never wait.
window.BOSS_QUEUE = { maxWaitYears: 3, breatherMs: 8000 }; // breather: after a boss falls, the next one waits 8 s so you can open the chest

window.BOSS_ATTACK_TUNING = {
  // Charging into a wall (Nov 4): bounce back, wobble, then chase again.
  wallBonk: { bounceSpeed: 260, bounceMs: 320, dizzyMs: 850, crackMs: 3500, words: ["BONK!", "OOF!", "THUD!", "WHO PUT A WALL HERE?", "LOAD-BEARING!", "NOT IN THE BUDGET"] },
  minTelegraphMs: 550,          // the warning never gets shorter than this (phones need time to react)
  minTelegraphMsMortgage: 650,  // rings need a beat longer to read the gap
  minTelegraphMsWatch: 700,     // the Gold Watch's Alarm rings (Grok, Nov 3)
  minTelegraphMsArea: 750,      // mistletoe circles and sliding desks (Nov 9): you have to read a shape and find the way out
  minTelegraphMsEdgeMarker: 900, // The Reorg's spawn-side arrows
  ageRefYear: 40,
  telegraphAgeCutPerYear: 4,    // warnings get a little shorter as you age...
  telegraphTaxCutPerBracket: 25,// ...and with each Tax Bracket
  speedAgeAddPerYear: 0.012,    // attacks get a little faster as you age...
  speedTaxAddPerBracket: 0.04,  // ...and with each Tax Bracket
  speedMultCap: 1.45,
  onScreenMargin: 40            // only start an attack when the boss is on screen (this much slack)
};

window.BOSS_ATTACKS = {
  performanceReview: {
    bannerTitle: "REVIEW TIME", bannerSub: "Sidestep the line.",
    telegraphMs: 700, cooldownMs: 4200, firstAttackDelayMs: 1600, recoverMs: 300,
    chargeSpeed: 400, chargeDurationMs: 1100, chargeMaxDist: 560,
    bodyHalfW: 22, bodyHalfH: 28, damage: 2
  },
  // Your New Boss (Age 26), Nov 9: Grok's spec (docs/handoffs/grok-office-bosses-spec.md), pep talks by Gemini.
  // He plants his feet, chugs, then dashes down a lane of arrows. Twice in a row (three times below half health).
  // After a chain he's winded (your chance to hit him). Below half health, every third chain ends in a Sugar Crash.
  newBoss: {
    style: "dashChain", bannerTitle: "QUICK SYNC", bannerSub: "He's dashing. Step off the arrows.",
    telegraphMs: 650, chainTelegraphMs: 600, cooldownMs: 4600, firstAttackDelayMs: 1800,
    dashSpeed: 520, dashMaxDist: 400, dashMaxViewFrac: 0.8, chainCount: 2, laneWidth: 88,
    windedMs: 1100, bodyHalfW: 20, bodyHalfH: 24, damage: 1,
    phase2: { atHpFrac: 0.5, chainCount: 3, dashSpeedMult: 1.10, walkSpeedMult: 1.10, crashEvery: 3, crashMs: 2000 },
    drop: "energyDrink", // he left his spare can
    swarm: { spawnDelayMult: 1.25, packSizeMult: 0.80, maxOnScreenMult: 0.80, eliteChanceMult: 1.0, pauseKinds: ["calendarInvite"], pauseEvents: true },
    pepTalks: ["Let's circle back on your energy!", "Love the hustle, let's pivot faster!", "My dad has that exact cardigan!",
      "Let's double-click on your growth mindset!", "Fail fast, learn faster, keep sprinting!", "I brought oat milk for everyone!",
      "You were born in the nineteen-hundreds?", "Let's disrupt how we dodge projectiles!", "Quick vibe check on Q4 deliverables!",
      "No bad ideas in this brainstorm!", "We are building the plane mid-flight!", "Let's take this energy to eleven!",
      "Have you tried a standing desk?", "We're not a team, we're family!", "Send me a voice note later!",
      "Let's unpack that blocker together, fam!", "Crush those goals and stay hydrated!", "Let's ideate on your posture today!",
      "I booked us a walking one-on-one!", "High fives all around, team!"],
    crashLine: "Sugar crash. Need a minute.",
    bonkWords: ["LOVE THAT ENERGY!", "WE'LL ITERATE!", "GROWTH MOMENT!"]
  },
  // The Holiday Party, Nov 9: Grok's spec section 2, party lines by Gemini. Code: src/holiday-party.js.
  // Mistletoe slows you (Rami's pick) instead of freezing you. You can't be hurt while slowed, or for a beat after.
  holidayParty: {
    style: "conga", bannerTitle: "MISTLETOE", bannerSub: "Break the conga line to get at her.",
    telegraphMs: 1000, cooldownMs: 5200, firstAttackDelayMs: 2000, recoverMs: 300,
    conga: { start: 6, max: 6, joinEveryMs: 5000, spacingPx: 42, crumbEveryPx: 8, waitMs: 500, catchUpMult: 1.6, leaveLineAtPx: 120, guestScale: 0.6 },
    // Nov 9 (Rami: "not sure I even noticed them"): while 3 or more dancers are in line, she takes only a quarter of
    // your damage. Break the line to get at her. The line rebuilds over time, so it's a rhythm: break, punish, repeat.
    shield: { minLine: 3, damageMult: 0.25 },
    mistletoe: { zones: 2, radius: 56, nearMinPx: 160, nearMaxPx: 240, minAngleDeg: 100, edgeGapPx: 64, propClearPx: 48,
                 armedMs: 2400, slowAltMult: 0.35, slowAltMs: 900, safeAfterMs: 400, immuneMs: 2500, noFollowUpMs: 1500,
                 minGapBetweenFreezesMs: 3000, shoveRadius: 120, shovePx: 80,
                 awkwardLines: ["...hi.", "Oh! Hey.", "So... how about this weather.", "We should... not."] },
    phase2: { atHpFrac: 0.5, zones: 3, walkSpeed: 70, congaMax: 8, joinEveryMs: 3500,
              groupHug: { telegraphMs: 700, chargeSpeed: 300, chargeMaxDist: 200, bodyHalfW: 22, bodyHalfH: 26, damage: 1 } },
    drop: "salad", // party platter leftovers
    swarm: { spawnDelayMult: 1.35, packSizeMult: 0.70, maxOnScreenMult: 0.70, eliteChanceMult: 0.6, pauseKinds: ["snackAttack", "calendarInvite"], pauseEvents: true },
    partyLines: ["Join the conga line, accounting is leading!", "My sweater lights up and plays three songs!", "Secret Santa had a strict fifteen-dollar limit!",
      "Someone put ginger ale in the cranberry punch!", "Nobody leave until we take the group photo!", "Is this mug from the supply closet?",
      "Careful, the tinsel on this vest is scratchy!", "Who brought the seven-layer dip from home?", "Grab a paper plate before the shrimp disappears!",
      "HR says the karaoke machine is plugged in!", "I got another scented candle for Secret Santa!", "Hold my antlers, this song is my jam!"]
  },
  // The Reorg, Nov 9: Grok's spec section 3, memo lines by Gemini. Code: src/reorg.js.
  // His own rolling Hot Desks slide around (never onto you, never boxing you in), and New Org Chart sends every
  // new enemy from one side for a few seconds. Neither attack hurts; the swarm coming through the new layout does.
  theReorg: {
    style: "reorg", bannerTitle: "RESTRUCTURING", bannerSub: "Desks are moving. Follow the arrows.",
    cooldownMs: 5000, firstAttackDelayMs: 2200, recoverMs: 300, weights: { restructure: 60, orgChart: 40 },
    hotDesks: { count: 3, bodyW: 96, bodyH: 56, placeMinPx: 180, placeMaxPx: 300, placeTelegraphMs: 900, despawnFadeMs: 600 },
    restructure: { telegraphMs: 1000, moves: 2, slideMinPx: 128, slideMaxPx: 224, slideSpeed: 240,
                   playerMarginPx: 24, stopShortPx: 8, flushOrMinGapPx: 96, gateClearPx: 64, reachEdgesMin: 2, rerollTries: 3 },
    orgChart: { markerLeadMs: 1200, durationMs: 6000, edges: 2 },
    phase2: { atHpFrac: 0.5, hotDeskCount: 4, moves: 3, orgChart: { durationMs: 8000, edges: 1, hopOnce: true } },
    drop: "fannyPack", // everything consolidated
    swarm: { spawnDelayMult: 1.30, packSizeMult: 0.75, maxOnScreenMult: 0.75, eliteChanceMult: 0.8, pauseKinds: ["calendarInvite"], pauseEvents: true },
    memoLines: ["We're flattening the structure. You're the structure.", "Your department is now a cross-functional pod.",
      "Same desk, three new dotted-line managers.", "We are sunsetting Tuesdays to streamline workflow.", "Your new title is fourteen words long.",
      "Nothing is changing except the entire org chart.", "Please welcome yourself to the Agile Tiger Team.", "We combined Payroll and Facilities for synergy.",
      "You now report directly to a shared spreadsheet.", "Consider this a lateral move into the hallway.", "We are right-sizing the breakroom napkin budget.",
      "Your cube has been promoted to an open concept."]
  },
  mortgageRefinance: {
    bannerTitle: "RATE LOCK", bannerSub: "Interest expands. Slip into the % gap.",
    telegraphMs: 850, cooldownMs: 5200, firstAttackDelayMs: 1800, recoverMs: 300,
    ringCount: 2, ringGapMs: 700, expandSpeed: 135, startRadius: 36, maxRadius: 260,
    ringHalfThickness: 16, gapArcDeg: 70, damage: 2
  },
  midlifeCrisis: {
    bannerTitle: "V8 BURNOUT", bannerSub: "Drift loop incoming. Skip the skids.",
    telegraphMs: 750, cooldownMs: 4800, firstAttackDelayMs: 2200, recoverMs: 300, // was 650 / 1400 (Grok, Nov 3: a breath before the first burnout)
    driftSpeed: 340, loopRadius: 130, loopRevs: 1.25,
    skidHalfW: 18, skidHalfL: 26, skidEveryPx: 28, skidLifeMs: 2800, skidDamage: 1,
    bodyHalfW: 24, bodyHalfH: 18, damage: 3
  },
  // Full Life bosses (Nov 4): each reuses one of the three moves above, a little meaner since they show up after 70.
  hoaPresident: {
    style: "charge", bannerTitle: "VIOLATION NOTICE", bannerSub: "Grass is 0.2 inches too tall. Sidestep the yardstick.",
    telegraphMs: 650, cooldownMs: 3800, firstAttackDelayMs: 1600, recoverMs: 300,
    chargeSpeed: 430, chargeDurationMs: 1100, chargeMaxDist: 580,
    bodyHalfW: 22, bodyHalfH: 28, damage: 3,
    swarm: { spawnDelayMult: 1.30, packSizeMult: 0.75, maxOnScreenMult: 0.75, eliteChanceMult: 1.0, pauseKinds: ["calendarInvite"], pauseEvents: true }
  },
  retirementBoss: {
    style: "rings", bannerTitle: "PAPERWORK AUDIT", bannerSub: "Forms fly out in rings. Slip through the checkbox.",
    telegraphMs: 800, cooldownMs: 4800, firstAttackDelayMs: 1800, recoverMs: 300,
    ringCount: 3, ringGapMs: 650, expandSpeed: 145, startRadius: 36, maxRadius: 270,
    ringHalfThickness: 16, gapArcDeg: 66, damage: 3, color: 0xF2D7A1, gapLabel: "✓"
  },
  pickleballChamp: {
    style: "drift", bannerTitle: "6 AM RALLY", bannerSub: "Sliding lunges in loops. Stay off the court lines.",
    telegraphMs: 700, cooldownMs: 4200, firstAttackDelayMs: 2000, recoverMs: 300,
    driftSpeed: 370, loopRadius: 130, loopRevs: 1.25, driftMarker: true, color: 0x83A89A,
    skidHalfW: 18, skidHalfL: 26, skidEveryPx: 28, skidLifeMs: 2400, skidDamage: 1,
    bodyHalfW: 22, bodyHalfH: 22, damage: 3
  }
  ,
  // The Gold Watch (Grok's numbers, Gemini's words, Nov 3). Fight logic in src/gold-watch.js.
  goldWatch: {
    // It can't be beaten (Rami, Nov 3). It arrives 1.5 years before retirement; phases follow the clock.
    firstAttackDelayMs: 2000, recoverMs: 280, holdDistance: 200, arrivesYearsBeforeEnd: 1.5, lateArrivesYearsBeforeEnd: 2.7, latePhaseAfterYears: { overtime: 0.9, lastMinute: 2.0 }, // Overtime: 67.5 s at 25 s years (Nov 9)
    phases: {
      overtime:   { title: "UNPAID OVERTIME", afterYears: 0.5, bannerSub: "The ticking speeds up. Nobody approved this." },
      lastMinute: { title: "THE LAST MINUTE", afterYears: 1.1, bannerSub: "Every second counts now. Almost five o'clock." }
    },
    // Your hits wind it back: each point of damage pushes it this many px/s (capped), and its hands slow for a moment.
    wind: { pushPerDamage: 6, maxPushPerHit: 60, maxPushSpeed: 240, handSlowMult: 0.85, handSlowMs: 400 },
    phase2: { cooldownMult: 0.92, speedMult: 1.08 },
    phase3: { cooldownMult: 0.80, speedMult: 1.22, gearCount: 6 },
    killBonusCoins: 35, // paid when you clock out with it on your heels
    banners: { // shown the first time each attack is used in a run
      minuteHand: ["MINUTE HAND", "Fast sweep around the dial. Keep moving."],
      hourHand:   ["BANKERS' HOURS", "Thick arm swinging wide. Sidestep early."],
      alarm:      ["5 AM ALARM", "No snooze button. Slip out the gap at 12."],
      gears:      ["STRIPPED GEARS", "Bouncing brass incoming. Mind the ricochet."]
    },
    victory: {
      title: "FIVE O'CLOCK", sub: "The hands stop at 5:00. Your time is yours.", kicker: "CLOCKED OUT",
      keepsake: "Gold-plated, engraved by HR, and permanently stopped at 5:00 PM.",
      lines: {
        any: "The hands stopped at five, and my out-of-office is on.",
        officeWorker: "The hands stopped at five, and my out-of-office is on.",
        photographer: "And that's the final whistle, great game everybody!",
        gradStudent: "Does beating the clock count toward my thesis credits?",
        coldWarCowboy: "Blinking 5:00 forever, just like my parents' old VCR."
      },
      stillTicking: "The watch kept ticking, so you clocked out at 65 and left it on HR's desk."
    },
    minuteHand: { telegraphMs: 800, cooldownMs: 5200, handLength: 280, handWidth: 18, leadingEdgeThickness: 14,
                  sweepDegPerSec: 55, sweepDurationMs: 3200 /* was 70: with age and phase scaling the tip outran the plan (Grok final pass, Nov 4) */, damage: 2, weightPhase1: 60, weightPhase2: 35 },
    hourHand:   { telegraphMs: 900, cooldownMs: 7000, handLength: 160, handWidth: 28, leadingEdgeThickness: 18,
                  sweepDegPerSec: 40, sweepDurationMs: 4000, damage: 2, weightPhase2: 25 },
    alarm:      { telegraphMs: 950, cooldownMs: 8000, ringCount: 2, ringGapMs: 750, expandSpeed: 120, startRadius: 40,
                  maxRadius: 280, ringHalfThickness: 16, gapArcDeg: 75, damage: 2, weightPhase2: 25 },
    gears:      { telegraphMs: 600, cooldownMs: 6000, gearCount: 4, gearSpeed: 160, gearSize: 18, gearLifeMs: 4500,
                  damage: 1, weightPhase1: 40, weightPhase2: 15 },
    swarm: { spawnDelayMult: 1.80, packSizeMult: 0.40, maxOnScreenMult: 0.45, eliteChanceMult: 0.35,
             pauseKinds: ["groupChat", "mathWorksheet", "calendarInvite"], pauseEvents: true }
  }

};
