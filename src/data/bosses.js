// Boss special attacks (Grok spec, Nov 2: docs/handoffs/grok-boss-attacks.md). Tweak freely.
// Times in milliseconds, speeds in pixels per second, sizes in pixels.
window.BOSS_ATTACK_TUNING = {
  // Charging into a wall (Nov 4): bounce back, wobble, then chase again.
  wallBonk: { bounceSpeed: 260, bounceMs: 320, dizzyMs: 700, words: ["BONK!", "OOF!", "THUD!", "WHO PUT A WALL HERE?"] },
  minTelegraphMs: 550,          // the warning never gets shorter than this (phones need time to react)
  minTelegraphMsMortgage: 650,  // rings need a beat longer to read the gap
  minTelegraphMsWatch: 700,     // the Gold Watch's Alarm rings (Grok, Nov 3)
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
  }
  ,
  // The Gold Watch (Grok's numbers, Gemini's words, Nov 3). Fight logic in src/gold-watch.js.
  goldWatch: {
    // It can't be beaten (Rami, Nov 3). It arrives 1.5 years before retirement; phases follow the clock.
    firstAttackDelayMs: 2000, recoverMs: 280, holdDistance: 200, arrivesYearsBeforeEnd: 1.5,
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
