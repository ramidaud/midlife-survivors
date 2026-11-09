// Errands (Nov 8, Fun Pass #11). Data and tuning: src/data/errands.js.
// One errand pops up as a TO-DO card; a marker sits on the floor and on the office map, an arrow at the
// screen edge points the way, and a chip under the map counts down. Get there in time for a reward.
window.Errands = (() => {
  let active = null, doneCount = 0, nextAt = 0, chip = null, arrow = null;
  const S = () => window.ERRAND_SETTINGS || {};
  const playing = () => typeof gameOver !== "undefined" && !gameOver && typeof titleOpen !== "undefined" && !titleOpen;

  function css() {
    if (document.getElementById("errand-css")) return;
    const st = document.createElement("style"); st.id = "errand-css";
    st.textContent = `
#errand-chip{position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--ms-nav-h,0px) + 128px);z-index:23;display:flex;align-items:center;gap:8px;max-width:min(92vw,420px);
  background:#F2D7A1;color:#171C35;border:2px solid #171C35;border-left:6px solid #EF9347;box-shadow:3px 3px 0 rgba(0,0,0,.45);padding:6px 10px;font:13px/1.25 'Atkinson Hyperlegible',sans-serif;pointer-events:none}
#errand-chip b{font:11px/1 Silkscreen,monospace;letter-spacing:.06em;white-space:nowrap}
#errand-chip .t{font:12px/1 Silkscreen,monospace;margin-left:auto;padding-left:6px;white-space:nowrap}
#errand-chip.low .t{color:#874C3B}
#errand-chip.done{background:#83A89A;border-left-color:#3E7775}
#errand-chip.hidden,#errand-arrow.hidden{display:none}
#errand-arrow{position:fixed;z-index:22;width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-bottom:24px solid #EF9347;filter:drop-shadow(0 0 0 #171C35) drop-shadow(2px 2px 0 rgba(0,0,0,.5));pointer-events:none;transform-origin:50% 60%}
@media (max-width:760px),(orientation:portrait){#errand-chip{top:calc(var(--ms-nav-h,0px) + 236px);left:8px;right:8px;transform:none;max-width:none;font-size:12px;padding:5px 8px}} /* below the corner map on phones */`;
    document.head.appendChild(st);
  }
  function ui() {
    css();
    if (!chip) { chip = document.createElement("div"); chip.id = "errand-chip"; chip.className = "hidden"; chip.setAttribute("role", "status"); document.body.appendChild(chip); }
    if (!arrow) { arrow = document.createElement("div"); arrow.id = "errand-arrow"; arrow.className = "hidden"; document.body.appendChild(arrow); }
  }

  // The floor marker: a clipboard with a checkbox, bobbing, with a pulsing ring.
  function markerTexture(scene) {
    if (scene.textures.exists("errand_mark")) return "errand_mark";
    const t = scene.textures.createCanvas("errand_mark", 24, 30), c = t.getContext();
    c.fillStyle = "#171C35"; c.fillRect(0, 2, 24, 28); c.fillStyle = "#874C3B"; c.fillRect(2, 4, 20, 24);
    c.fillStyle = "#FFF0CF"; c.fillRect(4, 6, 16, 20); c.fillStyle = "#171C35"; c.fillRect(8, 0, 8, 5);
    c.fillStyle = "#171C35"; c.fillRect(6, 9, 6, 6); c.fillStyle = "#FFF0CF"; c.fillRect(7, 10, 4, 4);
    c.fillStyle = "#9aa0b5"; c.fillRect(13, 11, 6, 2); c.fillRect(6, 18, 13, 2); c.fillRect(6, 22, 10, 2);
    t.refresh(); return "errand_mark";
  }
  function place(scene, e) {
    const [x, y] = e.at;
    const ring = scene.add.circle(x, y, 26).setStrokeStyle(3, 0xef9347, 0.9).setDepth(y / 10000 + 2);
    const img = scene.add.image(x, y - 26, markerTexture(scene)).setScale(2).setDepth(y / 10000 + 3);
    scene.tweens.add({ targets: img, y: y - 36, duration: 650, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    scene.tweens.add({ targets: ring, scale: 1.6, alpha: 0, duration: 1100, repeat: -1 });
    return [ring, img];
  }
  function clear() { if (active && active.objs) active.objs.forEach(o => o.destroy()); active = null; if (chip) chip.className = "hidden"; if (arrow) arrow.className = "hidden"; }

  function pick() {
    const open = id => { const lay = window.START_AREA_LAYOUT; const ph = lay && lay.promotions && lay.promotions.phases.find(p => (p.areas || []).includes(id)); return !ph || ph.age <= currentAge; };
    const far = (window.ERRANDS || []).filter(e => open(e.room) && Math.hypot(e.at[0] - player.x, e.at[1] - player.y) >= (S().minDistance || 0));
    const list = far.length ? far : (window.ERRANDS || []).filter(e => open(e.room));
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  }
  function start(scene) {
    const e = pick(); if (!e) return;
    ui();
    active = { e, until: runElapsedMs + (S().timeSec || 45) * 1000, objs: place(scene, e) };
    chip.className = ""; chip.innerHTML = `<b>☐ TO-DO</b><span>${e.text}</span><span class="t"></span>`;
    if (window.showLowerThird) showLowerThird("promo", "TO-DO", e.text + " Follow the arrow.", 4000);
    if (typeof sfx === "function") sfx("pick");
  }
  function rewardText(r) { return r.coins ? `+${r.coins}k` : r.heal ? `+${r.heal} HP` : r.levels ? `+${r.levels} level${r.levels > 1 ? "s" : ""}` : ""; }
  function complete(scene) {
    const e = active.e, r = e.reward || {};
    if (r.coins) { meta.coins += r.coins; runCoins += r.coins; if (window.coinLog) coinLog("errands", r.coins); saveMeta(meta); }
    if (r.heal) { hp = Math.min(stats.maxHp, hp + healAmt(r.heal)); if (typeof drawHpBar === "function") drawHpBar(); }
    if (r.levels) { let need = 0, x = xp, n = xpNeeded; for (let i = 0; i < r.levels; i++) { need += n - x; x = 0; n = Math.round(n * LEVELING.growth + (LEVELING.stepXp || 4)); } addXp(scene, need / (window.catchUpMult ? catchUpMult() : 1)); }
    if (typeof updateHUD === "function") updateHUD();
    if (window.burstConfetti) burstConfetti(scene, e.at[0], e.at[1] - 30, 0x83a89a, 14);
    const pop = scene.add.text(e.at[0], e.at[1] - 70, "✓ " + rewardText(r), { fontFamily: "Silkscreen, monospace", fontSize: "16px", color: "#FFF0CF", stroke: "#171C35", strokeThickness: 4 }).setOrigin(0.5).setDepth(9);
    scene.tweens.add({ targets: pop, y: pop.y - 40, alpha: 0, duration: 1400, onComplete: () => pop.destroy() });
    if (typeof sfx === "function") sfx("levelUp", 0);
    if (window.showLowerThird) showLowerThird("win", "DONE ✓", `${e.done} ${rewardText(r)}`, 3500);
    if (window.Telemetry && Telemetry.event) Telemetry.event("errand-done");
    doneCount++; clear(); if (chip) { chip.className = "done"; chip.innerHTML = `<b>☑ DONE</b><span>${e.text}</span>`; setTimeout(() => { if (chip && chip.className === "done") chip.className = "hidden"; }, 2200); }
  }
  function miss() {
    const e = active.e; clear();
    if (window.showLowerThird) showLowerThird("tip", "TO-DO", "Missed it. It'll still be there tomorrow. Probably.", 3000);
  }
  function aim(scene) { // the arrow at the screen edge, only when the errand is off screen
    const cam = scene.cameras.main, v = cam.worldView, [x, y] = active.e.at;
    if (x > v.x + 30 && x < v.right - 30 && y > v.y + 30 && y < v.bottom - 30) { arrow.className = "hidden"; return; }
    const r = scene.game.canvas.getBoundingClientRect(), sx = r.width / cam.width, sy = r.height / cam.height;
    const cx = v.centerX, cy = v.centerY, ang = Math.atan2(y - cy, x - cx);
    const hw = v.width / 2 - 60 / cam.zoom, hh = v.height / 2 - 90 / cam.zoom; // keep clear of the HUD
    const t = Math.min(Math.abs(hw / Math.cos(ang)), Math.abs(hh / Math.sin(ang)));
    const px = r.left + ((cx + Math.cos(ang) * t) - v.x) * cam.zoom * sx, py = r.top + ((cy + Math.sin(ang) * t) - v.y) * cam.zoom * sy;
    arrow.className = ""; arrow.style.left = (px - 13) + "px"; arrow.style.top = (py - 12) + "px"; arrow.style.transform = `rotate(${ang + Math.PI / 2}rad)`;
  }

  function reset() { clear(); doneCount = 0; nextAt = 0; }
  function update(scene) {
    const C = S(); if (!C.on || typeof player === "undefined" || !player || !player.active) return;
    if (!playing()) { if (chip) chip.className = "hidden"; if (arrow) arrow.className = "hidden"; return; }
    if (!active) {
      if (doneCount >= (C.perRun || 1) || nextAt === -1) return;
      if (currentAge >= (C.startAge || 41.5)) { nextAt = -1; start(scene); }
      return;
    }
    const left = Math.max(0, active.until - runElapsedMs);
    const tEl = chip && chip.querySelector(".t"); if (tEl) { tEl.textContent = Math.ceil(left / 1000) + "s"; chip.classList.toggle("low", left < 10000); }
    if (Math.hypot(player.x - active.e.at[0], player.y - active.e.at[1]) < (C.reachPx || 80)) return complete(scene);
    if (left <= 0) return miss();
    aim(scene);
  }
  return { reset, update, mark: () => active ? { x: active.e.at[0], y: active.e.at[1] } : null, active: () => active };
})();
