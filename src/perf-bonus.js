// Performance Bonus (Nov 9, Rami's playtest: "I'm earning XP so slowly at this point, I'm not doing any more upgrades.
// Maybe when you're this overpowered, you get more perks."). Late in a run each level needs thousands of gems, so the
// picks dry up right when you're strongest. Past the age in LEVELING.performanceBonus, if a long stretch goes by with
// no level-up, the company hands you a free pick. It comes faster while Overtime Workload is up (you're clearly crushing it).
// It doesn't raise your level number; it's a bonus card pick. Numbers: src/data/pickups.js.
window.PerfBonus = (() => {
  const P = () => (window.LEVELING && LEVELING.performanceBonus) || {};
  let lastLevel = null, lastAt = 0, given = 0, seenAt = 0;
  const TITLES = ["PERFORMANCE BONUS!", "SPOT BONUS!", "EMPLOYEE OF THE MONTH!", "RETENTION BONUS!", "YOU'VE EARNED A PERK!"];
  function wait() {
    const C = P(), wl = window.Workload ? Workload.level() : 0;
    return Math.max(C.minSec || 35, (C.droughtSec || 75) - wl * (C.perWorkloadSec || 10)) * 1000;
  }
  function update(scene) {
    const C = P();
    if (!C.on || typeof level === "undefined" || typeof runElapsedMs === "undefined") return;
    const jumped = runElapsedMs - seenAt > 5000 || runElapsedMs < seenAt; seenAt = runElapsedMs; // a resumed save or a skip in time: start the clock fresh
    if (jumped || lastLevel === null || level !== lastLevel) { lastLevel = level; lastAt = runElapsedMs; return; } // a real level-up resets the clock
    if (typeof currentAge === "undefined" || currentAge < (C.fromAge || 55)) { lastAt = runElapsedMs; return; }
    if ((typeof levelUpOpen !== "undefined" && levelUpOpen) || (typeof paused !== "undefined" && paused) || pendingLevels > 0) { lastAt = Math.max(lastAt, runElapsedMs - wait() + 3000); return; }
    if (C.maxPerRun && given >= C.maxPerRun) return;
    if (runElapsedMs - lastAt < wait()) return;
    lastAt = runElapsedMs; given++;
    window.runPerfBonuses = given;
    if (window.Telemetry && Telemetry.event && given === 1) Telemetry.event("perf-bonus");
    if (window.burstConfetti) burstConfetti(scene, player.x, player.y - 30, 0xEF9347, 14);
    pendingLevels++;
    showLevelUp(scene, Phaser.Utils.Array.GetRandom(TITLES));
  }
  function reset() { lastLevel = null; lastAt = 0; given = 0; seenAt = 0; window.runPerfBonuses = 0; }
  return { update, reset, next: () => Math.max(0, wait() - (runElapsedMs - lastAt)), given: () => given };
})();
