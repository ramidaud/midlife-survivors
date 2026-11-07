// June from Legal's butterscotch (Nov 6, Kevin's idea). Her Executive Wing card says
// "Help yourself to a butterscotch from the credenza." Now you can: a candy dish sits on the credenza,
// and walking up to it heals you a little. It restocks once a year (45 seconds). Settings: BUTTERSCOTCH below.
window.BUTTERSCOTCH = {
  credenzaId: "exec_credenza-193", // which credenza gets the dish (src/data/start-area.js placements)
  heal: 3,                         // HP per butterscotch (Leftover Pizza is 2)
  restockMs: 45000,                // one year of game time before the dish refills
  reach: 58,                       // how close your feet need to get to the dish, in pixels
  scale: 0.5,                      // the dish art is 54x50; this draws it about the size of the old mint bowl
  // The lower-third lines. The first one plays the first time; after that they rotate.
  lines: [
    "Told you. Help yourself.",
    "Take two. Nobody is counting. (Legal is counting.)",
    "Those have been in there since the merger.",
    "That one was the last gold one. Hope it was worth it.",
    "Unwrapping it in a meeting is a power move."
  ]
};

window.Butterscotch = (() => {
  let dish = null, cred = null, readyAt = 0, taken = 0, scene = null;
  const KEY = "candy_dish";
  function layoutCredenza() {
    const L = window.START_AREA_LAYOUT; if (!L) return null;
    return (L.placements || []).find(p => p.id === BUTTERSCOTCH.credenzaId) || null;
  }
  function place(sc) {
    if (!cred || dish || !sc.textures.exists(KEY)) return;
    // The credenza art is 160x96, drawn from its bottom center. Its mint bowl sits at about (+41, -56).
    dish = sc.add.image(cred.x + 41, cred.y - 54, KEY).setOrigin(0.5, 1).setScale(BUTTERSCOTCH.scale);
    sync();
  }
  function init(sc) {
    destroy();
    if (!window.USE_START_AREA) return;
    cred = layoutCredenza(); if (!cred) return;
    scene = sc; readyAt = 0; taken = 0;
    if (sc.textures.exists(KEY)) place(sc);
    else {
      const root = window.SPOTLIGHT_ROOT || "";
      sc.load.image(KEY, root + "assets/stage/props/candy-dish-v1.png" + (window.BUILD ? "?v=" + window.BUILD : ""));
      sc.load.once("complete", () => { if (scene === sc) place(sc); });
      sc.load.start();
    }
    sc.events.once("shutdown", () => { dish = cred = null; scene = null; });
  }
  function eat(sc) {
    const B = BUTTERSCOTCH;
    readyAt = runElapsedMs + B.restockMs; taken++;
    const amt = typeof healAmt === "function" ? healAmt(B.heal) : B.heal;
    hp = Math.min(stats.maxHp, hp + amt);
    if (typeof updateHUD === "function") updateHUD();
    if (typeof drawHpBar === "function") drawHpBar();
    if (typeof sfx === "function") sfx("levelUp");
    const t = sc.add.text(dish.x, dish.y - 30, `+${amt} HP (BUTTERSCOTCH)`, {
      fontFamily: "monospace", fontSize: "13px", fontStyle: "bold", color: "#EF9347", stroke: "#12152a", strokeThickness: 3
    }).setOrigin(0.5).setDepth(100000);
    sc.tweens.add({ targets: t, y: t.y - 24, alpha: 0, duration: 800, onComplete: () => t.destroy() });
    const line = taken === 1 ? B.lines[0] : B.lines[1 + ((taken - 2) % (B.lines.length - 1))];
    if (window.showLowerThird) window.showLowerThird("reward", "JUNE FROM LEGAL", line, 3600, "BUTTERSCOTCH");
    dish.setAlpha(0.45); // empty dish until it restocks
    if (window.Telemetry && Telemetry.note) Telemetry.note("butterscotch");
    if (window.achEvent) window.achEvent("butterscotch");
  }
  function update(sc) {
    if (!dish || !player || !player.active) return;
    if (typeof paused !== "undefined" && paused) return;
    if (readyAt && runElapsedMs >= readyAt) { readyAt = 0; dish.setAlpha(1); }
    if (readyAt) return;
    const fx = player.x, fy = player.y + player.height / 2; // your feet
    const dx = fx - dish.x, dy = fy - (dish.y - 6);
    if (Math.abs(dx) < BUTTERSCOTCH.reach && Math.abs(dy) < BUTTERSCOTCH.reach && Math.hypot(dx, dy) < BUTTERSCOTCH.reach) eat(sc);
  }
  // The dish sits on the credenza, so it sorts just in front of it as you walk around.
  function sync() { if (dish && cred && player) dish.setDepth(10000 + cred.y - player.y + 1); }
  function destroy() { if (dish && dish.destroy) dish.destroy(); dish = cred = null; scene = null; readyAt = 0; taken = 0; }
  return { init, update, sync, destroy, ready: () => !!dish && !readyAt, spot: () => dish && { x: dish.x, y: dish.y } };
})();
