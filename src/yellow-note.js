// The rack with the yellow note (Nov 4, Rami's idea). Eli from IT warns you on his Server Room card:
// "Please do not unplug the rack with the yellow note." So one rack has a sticky note and a cable across the floor.
// Trip over the cable and the power goes out: the office goes dark, red emergency light comes on, and everything
// on screen freezes while it "reboots". Then the lights stutter back. Once per run. Settings: YELLOW_NOTE below.
window.YELLOW_NOTE = {
  rackId: "server_rack-134",   // which rack gets the note (src/data/start-area.js placements)
  blackoutMs: 5200,            // how long the power is out
  rebootMs: 3800,              // how long enemies on screen stay frozen
  tripRadius: 22,              // how close your feet have to get to the cable
  card: { kicker: "OUTAGE", name: "ELI FROM IT", line: "There was a NOTE. It was YELLOW.", tip: "Everything nearby is rebooting. Make it count." },
  // Eli's ticket notes (Nov 5, Ben's IT classics). One is picked at random for the card.
  lines: ["There was a NOTE. It was YELLOW.", "Closing this ticket as an ID10T error.", "Logging it as PEBCAK: problem exists between chair and keyboard.", "There was a NOTE. It was YELLOW."],
  lowerThird: "Who unplugged the rack with the yellow note?!"
};

window.YellowNote = (() => {
  let scene = null, note = null, cable = null, plug = null, spot = null, rack = null, tripped = false;
  function layoutRack() {
    const L = window.START_AREA_LAYOUT; if (!L) return null;
    return (L.placements || []).find(p => p.id === YELLOW_NOTE.rackId) || null;
  }
  function textures(sc) {
    if (!sc.textures.exists("yn_note")) makeCanvasTex(sc, "yn_note", 12, 12, c => {
      c.fillStyle = "#171C35"; c.fillRect(0, 0, 12, 12);          // outline
      c.fillStyle = "#F2D7A1"; c.fillRect(1, 1, 10, 10);          // the sticky note
      c.fillStyle = "#EF9347"; c.fillRect(1, 1, 10, 2);           // sticky strip along the top
      c.fillStyle = "#C45C4B"; c.fillRect(3, 5, 6, 1); c.fillRect(3, 7, 4, 1); // "DO NOT" scribble
    });
    if (!sc.textures.exists("yn_plug")) makeCanvasTex(sc, "yn_plug", 8, 6, c => {
      c.fillStyle = "#171C35"; c.fillRect(0, 0, 8, 6);
      c.fillStyle = "#526078"; c.fillRect(1, 1, 5, 4);
      c.fillStyle = "#F2D7A1"; c.fillRect(6, 1, 2, 1); c.fillRect(6, 4, 2, 1); // prongs
    });
  }
  function init(sc) {
    destroy();
    if (!window.USE_START_AREA) return;
    const r = layoutRack(); if (!r) return;
    scene = sc; rack = r; tripped = false; textures(sc);
    // The cable snakes from the bottom of the rack across the walkway to a floor box.
    const x0 = r.x + 14, y0 = r.y - 4, x1 = r.x + 46, y1 = r.y + 42;
    cable = sc.add.graphics().setDepth(3.45);
    cable.lineStyle(4, 0x171C35, 1).beginPath().moveTo(x0, y0).lineTo(x0 + 6, y0 + 20).lineTo(x1 - 10, y1 - 6).lineTo(x1, y1).strokePath();
    cable.lineStyle(2, 0x303750, 1).beginPath().moveTo(x0, y0).lineTo(x0 + 6, y0 + 20).lineTo(x1 - 10, y1 - 6).lineTo(x1, y1).strokePath();
    cable.fillStyle(0xEF9347, 1).fillRect(x0 + 3, y0 + 14, 6, 3); // a strip of orange tape that did not help
    plug = sc.add.image(x1 + 4, y1, "yn_plug").setScale(2).setDepth(3.46);
    note = sc.add.image(r.x + 12, r.y - 64, "yn_note").setScale(2).setAngle(-6).setDepth(10000);
    spot = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
    sc.events.once("shutdown", () => { note = cable = plug = spot = rack = null; scene = null; }); // the scene cleans up its own objects
  }
  function trip(sc) {
    tripped = true;
    const Y = YELLOW_NOTE, now = runElapsedMs;
    if (typeof sfx === "function") { sfx("bossSpawn"); }
    if (window.Lighting && Lighting.blackout) Lighting.blackout(Y.blackoutMs);
    if (plug) { plug.setPosition(plug.x + 14, plug.y + 8).setAngle(35); } // the plug pops out
    // Everything on screen goes offline for a moment (bosses shrug it off).
    const v = sc.cameras.main.worldView;
    bills.getChildren().forEach(b => {
      if (!b.active || b.isBoss || b.x < v.x || b.x > v.right || b.y < v.y || b.y > v.bottom) return;
      b.cringeUntil = now + Y.rebootMs; b.setVelocity(0, 0);
    });
    if (window.Spotlight && Spotlight.custom) {
      const root = window.SPOTLIGHT_ROOT || "";
      Spotlight.custom(Object.assign({ art: root + "assets/stage/coworkers/portraits/coworker-intern-on-break-v1.png", artType: "hero", edge: "#C45C4B", band: "#303750", ms: 5000 }, Y.card, Y.lines ? { line: Y.lines[Math.floor(Math.random() * Y.lines.length)] } : {}));
    }
    if (window.showLowerThird) window.showLowerThird("alert", "IT", Y.lowerThird, 4200, "POWER OUT");
    if (window.achEvent) window.achEvent("yellowNote");
    if (window.Telemetry && Telemetry.note) Telemetry.note("yellowNote");
  }
  function update(sc) {
    if (!spot || tripped || !player || !player.active) return;
    if (typeof paused !== "undefined" && paused) return;
    const fx = player.x, fy = player.y + player.height / 2; // your feet
    if (Math.abs(fx - spot.x) < 30 && Math.abs(fy - spot.y) < 30 && Math.hypot(fx - spot.x, fy - spot.y) < YELLOW_NOTE.tripRadius + 12) trip(sc);
  }
  // The note sits on the rack, so it sorts with it as you walk past.
  function sync() { if (note && rack && player) note.setDepth(10000 + rack.y - player.y + 1); }
  function destroy() {
    [note, cable, plug].forEach(o => o && o.destroy && o.destroy());
    note = cable = plug = spot = rack = null; scene = null; tripped = false;
  }
  return { init, update, sync, destroy, tripped: () => tripped, spot: () => spot };
})();
