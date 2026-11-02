// Close Calls (near-miss rewards). Designed by Grok (Part 3C), built by Claude in V. 1.30.0.
// Full spec: docs/handoffs/grok-near-miss.md. Every number here is safe to tweak.
//
// A near miss: an enemy that is moving toward you passes within `bandPx` pixels of touching you,
// and you don't get hit. You must be moving, or the enemy must have a clear path to you, so
// hiding behind a desk while enemies circle doesn't count.
window.NEAR_MISS = {
  enabled: true,
  bandPx: 14,              // how close (beyond touching) counts as "close"
  pingSize: 14,            // Group Chat message pings
  minClosingSpeed: 40,     // px/s the enemy must be moving toward you
  minPlayerSpeed: 40,      // px/s; moving at least this fast always counts as a real dodge
  armAfterMs: 20000,       // no Close Calls in the first 20 seconds
  cooldownMs: 450,         // per enemy
  bossCooldownMs: 1200,
  pingCooldownMs: 300,

  // Rewards
  xpBase: 0.40,            // a Wisdom Gem is 1.0
  xpPerCreditMax: 0.85,
  xpFromNearMissPer10s: 6, // hard cap, so dodging never beats collecting gems
  speedBurstMult: 1.10,
  speedBurstMs: 350,
  comboDecayMs: 2500,      // streak ends if you go this long without a Close Call
  comboTiers: [3, 6, 10, 15],
  comboXpMult: [1.0, 1.15, 1.3, 1.5, 1.5],
  comboLabels: ["CLOSE", "CLOSE CALL", "SIDE-STEP", "OUT OF OFFICE", "PERFORMANCE EXCEEDED"],
  scorePerCredit: 1,
  tier3ScoreBonus: 5,
  tier4ScoreBonus: 10,
  comfortCountsAsEngaged: true, // near misses keep the Comfort Zone Tax away (you're clearly not camping)
  creditGroupChatBody: false,

  // Feedback
  maxPopupsPerSec: 4,
  shakeDurationMs: 55,
  shakeIntensity: 0.0025,
  shakeCooldownMs: 180,
  debug: false,            // true (or ?nmDebug=1) draws the rings and logs a summary at Game Over
  lines: [
    "CLOSE CALL!",
    "Almost clocked in.",
    "Declined the meeting.",
    "Left it on read.",
    "Not today, autopay.",
    "Sidestepped Q3.",
    "Paper cut averted.",
    "Out of office (0.2s).",
    "Calendar: Declined.",
    "Muted and walked away.",
    "HR saw nothing.",
    "That one had your name on it.",
    "Survived the hallway.",
    "Reply-All dodged."
  ]
};
