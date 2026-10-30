// Player settings. Change these numbers, reload, and feel the difference.
// This is "data-driven design": the game reads these values instead of having them buried in code.
window.PLAYER = {
  name: "You",
  startingAge: 40,
  retirementAge: 80,  // Main Campaign Goal: Survive from Age 40 to Age 80!
  maxSeniorAge: 100,  // Bonus Senior Rounds: 20 extra years (Age 80 to 100) of Senior Life chaos!
  secondsPerYear: 15, // 15s of active unpaused combat = 1 year (so each Decade is 2m30s, and you can Save & Resume anytime!)
  speed: 230,         // pixels per second
  size: 32,           // width and height of the square, in pixels
  maxHp: 12,          // starting health
  hurtCooldownMs: 750,// brief mercy window after taking a hit
  color: 0xf0a24f     // coffee orange, written as a hex color
};
