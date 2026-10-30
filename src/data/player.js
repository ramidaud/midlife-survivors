// Player settings. Change these numbers, reload, and feel the difference.
// This is "data-driven design": the game reads these values instead of having them buried in code.
window.PLAYER = {
  name: "You",
  startingAge: 40,
  retirementAge: 80,  // Age 80: retirement bonus pays out automatically. The run keeps going.
  maxSeniorAge: 100,  // Age 100: Death arrives. Meeting him is the win.
  secondsPerYear: 60, // 1 real minute of play = 1 year. A full life (40 to 100) is about an hour. Save & Resume anytime.
  speed: 230,         // pixels per second
  size: 32,           // width and height of the square, in pixels
  maxHp: 12,          // starting health
  hurtCooldownMs: 750,// brief mercy window after taking a hit
  color: 0xf0a24f     // coffee orange, written as a hex color
};
