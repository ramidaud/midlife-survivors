// Boss special attacks (Grok spec, Nov 2: docs/handoffs/grok-boss-attacks.md). Tweak freely.
// Times in milliseconds, speeds in pixels per second, sizes in pixels.
window.BOSS_ATTACK_TUNING = {
  minTelegraphMs: 550,          // the warning never gets shorter than this (phones need time to react)
  minTelegraphMsMortgage: 650,  // rings need a beat longer to read the gap
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
    telegraphMs: 650, cooldownMs: 4800, firstAttackDelayMs: 1400, recoverMs: 300,
    driftSpeed: 340, loopRadius: 130, loopRevs: 1.25,
    skidHalfW: 18, skidHalfL: 26, skidEveryPx: 28, skidLifeMs: 2800, skidDamage: 1,
    bodyHalfW: 24, bodyHalfH: 18, damage: 3
  }
};
