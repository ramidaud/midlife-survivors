// Promotion gates (Nov 2): doors that open as you age. The rooms and closed doors come from the start-area slice
// (ChatGPT); this opens the ones whose rooms are built, with a short "promotion" message.
// To open later doors once their rooms exist, raise PROMOTIONS.openUpToAge.
window.PROMOTIONS = {
  openUpToAge: 60, rollUpMs: 450,
  // "Life follows you to work" (Nov 2): a second line after each promotion, saying what came in with you.
  lifeLines: {
    45: "Life followed you to work: hospital co-pays and 3 AM pager calls are in the building now.",
    50: "Life followed you to work: tuition, carpool and the kids' new math found the server racks.",
    55: "Life followed you to work: your retirement calculator and both knees made it to the corner office.",
    60: "Life followed you to work: the group chat RSVP'd to the Wellness Corner. Three of them already canceled."
  }
};

window.Promotions = (() => {
  let nextCheck = 0, announced = {};
  function reset() { nextCheck = 0; announced = {}; }
  function update(scene, now) {
    if (now < nextCheck) return; nextCheck = now + 250;
    const gates = window.START_AREA_GATES; if (!gates || !gates.length) return;
    const phases = (window.START_AREA_LAYOUT && START_AREA_LAYOUT.promotions && START_AREA_LAYOUT.promotions.phases) || [];
    for (const g of gates) {
      if (g.opened || g.age > PROMOTIONS.openUpToAge || currentAge < g.age) continue;
      open(scene, g);
      if (!announced[g.age]) {
        announced[g.age] = true;
        const ph = phases.find(p => p.age === g.age);
        const quiet = runElapsedMs < 2000; // a resumed run past 45: open silently
        // The big flash shows right away. The sentence uses "promo" (same priority as tips), so it
        // waits its turn behind a boss arrival (the Performance Review shows up at 45) or the AGE card instead of being dropped.
        // Spotlight card (Nov 3): a coworker announces the first new room. Falls back to the old banner + lower third.
        const spot = !quiet && window.Spotlight && ph && ph.areas && Spotlight.room(ph.areas[0]);
        if (!quiet && !spot && window.flashBanner) window.flashBanner("PROMOTED", "PROMOTED · NEW ROOMS OPEN", "reward");
        if (!quiet && window.showLowerThird) {
          if (spot) setTimeout(() => window.showLowerThird("promo", "PROMOTED", (ph && ph.message) || "New areas unlocked.", 5000), 6500);
          else window.showLowerThird("promo", "PROMOTED", (ph && ph.message) || "New areas unlocked.", 5000);
        }
        const life = PROMOTIONS.lifeLines && PROMOTIONS.lifeLines[g.age];
        if (!quiet && life && window.showLowerThird) setTimeout(() => window.showLowerThird("promo", "LIFE", life, 5500), spot ? 12000 : 0);
        if (!quiet) sfx("levelUp", 0);
      }
    }
  }
  function open(scene, g) {
    g.opened = true; g.closed = false;
    const list = window.navExtraBlockers || [], i = list.indexOf(g.rect);
    if (i >= 0) list.splice(i, 1); // enemies can path (and spawn) through now
    const o = g.object;
    if (!o || !o.active) return;
    if (o.body) o.body.enable = false;
    const sy = o.scaleY;
    scene.tweens.add({ targets: o, scaleY: sy * 0.06, alpha: 0.25, duration: PROMOTIONS.rollUpMs, ease: "Quad.In",
      onComplete: () => { if (o.active) o.setVisible(false); } }); // the door rolls up like a garage door
    if (window.burstConfetti) burstConfetti(scene, o.x, o.y - 110, 0xf2d7a1, 10);
  }
  return { update, reset };
})();
