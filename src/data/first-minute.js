// First-minute pass (Nov 5). Data showed 39% of first runs ended before 42, often after 12-15 hits in under 40 seconds:
// people standing still. Following Miyamoto's 1-1, the game teaches the one input before anything can hurt you.
window.FIRST_MINUTE = {
  teachRuns: 3,        // teacher Bills, the first-kill and first-hit lines: a player's first 3 runs
  gentleMs: 20000,     // for the first 20 s of the clock, Bills come one or two at a time, from where you're headed
  gentleMax: 2,
  hint: { touch: "DRAG ANYWHERE TO MOVE", keys: "WASD OR ARROWS TO MOVE", pad: "LEFT STICK TO MOVE", sub: "The clock starts when you do." },
  firstKill: { pop: "PAID!", line: "Your coffee fires on its own. Your only job: keep moving." },
  firstHurt: { line: "Bills hurt on contact. Keep moving and let the coffee do the work." }
};
