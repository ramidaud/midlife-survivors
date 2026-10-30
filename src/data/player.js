// Player settings. Change these numbers, reload, and feel the difference.
// This is "data-driven design": the game reads these values instead of having them buried in code.
window.PLAYER = {
  name: "You",
  startingAge: 40,
  secondsPerYear: 20, // 20 seconds = 1 year of age (so Age 40 to 50 is a fast 3m20s run; set to 180 for a full 30-min run)
  speed: 235,        // pixels per second. Brisk enough to kite crowds around desks and up stairs!
  size: 32,          // width and height of the square, in pixels
  maxHp: 14,         // generous starting health, plus you heal +2 HP on every level-up!
  hurtCooldownMs: 900, // after a hit, you're safe for 0.9s (so a crowd doesn't drain you instantly)
  color: 0xf0a24f    // coffee orange, written as a hex color
};
