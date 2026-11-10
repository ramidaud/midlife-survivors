// The minimap (Nov 4, Rami: "once they discover the map, an interactive HUD version that shows where you are,
// with indicators for open doors and collectibles"). Plan: docs/ROADMAP.md "Game plan after V. 2.0".
//  - Find the "YOU ARE HERE" evacuation map in the Lobby once, and the minimap is yours for every run after.
//  - A small corner map follows you and fills in as you explore (fog of war: rooms stay dark until you've been near them).
//  - Tap it (or press M) for the whole office, paused. Doors, chests, the Lounge, interns and bosses are marked.
// The floor plan is drawn from the level data (src/data/start-area.js), so it always matches the real office.
window.MINIMAP = {
  poster: { x: 190, y: -440 },  // the evacuation map stand, in the Lobby near where you start
  findRadius: 70,                // walk this close to pick it up
  revealRadius: 640,             // how far you "see" for the map while exploring (world px). Walking into a room reveals all of it.
  cell: 128,                     // (old fog grid size; the map now reveals whole floor pieces)
  miniWorldWidth: 2600,          // how much of the office the small map shows across
  perRun: true,                  // Nov 8 (Rami): find the map again every run (false = find it once, keep it forever)
  colors: { floor: "#5E6F92", floorDim: "#303750", unknown: "#3E4A66", wall: "#171C35", you: "#FFF0CF", doorOpen: "#83A89A", doorLocked: "#C45C4B",
    chest: "#EF9347", lounge: "#F2D7A1", intern: "#83A89A", boss: "#C45C4B", frame: "#3E7775", bg: "#171C35" }
};

window.Minimap = (() => {
  const C = MINIMAP.colors;
  let base = null, baseScale = 0, fog = null, fogCtx = null, cols = 0, rows = 0, B = null;
  let poster = null, posterScene = null, nextReveal = 0, nextDraw = 0, bigOpen = false, el = null, big = null, lastAngle = -Math.PI / 2;
  let runFound = false; // found in this run (MINIMAP.perRun)
  const has = () => MINIMAP.perRun ? runFound : !!(typeof meta !== "undefined" && meta && meta.mapFound);
  // ChatGPT's art (Nov 4): 9-slice frame, expand/close buttons, 12 px markers, and the YOU ARE HERE sign
  const ART = { frame: "assets/ui/minimap-frame-v1.png", buttons: "assets/ui/minimap-buttons-v1.png", icons: "assets/ui/minimap-icons-v1.png", sign: "assets/stage/props/evac-map-v1.png" };
  const ICON = { you: 0, doorOpen: 1, doorLocked: 2, chest: 3, lounge: 4, intern: 5, boss: 6, map: 7 };
  const icons = new Image(); let iconsOk = false; icons.onload = () => { iconsOk = true; }; icons.src = ART.icons + "?v=" + (window.BUILD || 1);
  let signAsked = false, signWaitUntil = 0;
  const L = () => window.START_AREA_LAYOUT;

  // ---------- the floor plan, drawn once ----------
  function buildBase() {
    const lay = L(); if (!lay || !lay.bounds) return false;
    B = lay.bounds; baseScale = 0.12; // a 7456 px wide office becomes a ~900 px wide picture
    base = document.createElement("canvas"); base.width = Math.ceil(B.width * baseScale); base.height = Math.ceil(B.height * baseScale);
    const c = base.getContext("2d"), s = baseScale, X = x => (x - B.x) * s, Y = y => (y - B.y) * s;
    c.fillStyle = C.floor;
    for (const f of lay.floors || []) c.fillRect(X(f.x), Y(f.y), f.width * s, f.height * s);
    c.fillStyle = C.wall;
    for (const w of lay.walls || []) c.fillRect(X(w.x), Y(w.y), Math.max(2, w.width * s), Math.max(2, w.height * s));
    // room names, small, for the big view
    c.font = "bold 13px Silkscreen, monospace"; c.textAlign = "center"; c.fillStyle = "rgba(255,240,207,.55)";
    for (const d of lay.districts || []) {
      const xs = d.polygon.map(p => p[0]), ys = d.polygon.map(p => p[1]);
      c.fillText(d.name.replace(/ and .*/, "").toUpperCase(), X((Math.min(...xs) + Math.max(...xs)) / 2), Y((Math.min(...ys) + Math.max(...ys)) / 2));
    }
    cols = Math.ceil(B.width / MINIMAP.cell); rows = Math.ceil(B.height / MINIMAP.cell);
    fog = document.createElement("canvas"); fog.width = cols; fog.height = rows; fogCtx = fog.getContext("2d", { willReadFrequently: true });
    // Nov 8 redesign: the map reveals whole floor pieces and rooms, drawn crisp like an evacuation map.
    floors = (lay.floors || []).map((f, i) => ({ i, x: f.x, y: f.y, w: f.width, h: f.height, d: f.district }));
    rooms = (lay.districts || []).map(d => {
      const xs = d.polygon.map(p => p[0]), ys = d.polygon.map(p => p[1]);
      const ph = ((lay.promotions && lay.promotions.phases) || []).find(p => (p.areas || []).includes(d.id));
      return { id: d.id, name: d.name.replace(/ and .*/, ""), poly: d.polygon, cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2, age: ph ? ph.age : 40 };
    });
    walls = (lay.walls || []).map(w => ({ x: w.x, y: w.y, w: w.width, h: w.height }));
    furn = (lay.placements || []).map(pl => { const sp = (lay.assetSpecs || {})[pl.prop], fp = sp && sp.footprint; if (!fp || !fp.width) return null;
      const h = Math.max(24, (fp.back || 0) + (fp.front || 0)); return { x: pl.x - fp.width / 2, y: pl.y - (fp.back || h / 2), w: fp.width, h }; }).filter(Boolean);
    return true;
  }
  let floors = [], rooms = [], walls = [], furn = [], seenFloor = new Set(), seenRoom = new Set(), seenWalls = [];
  const inPoly = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const roomAt = (x, y) => rooms.find(r => inPoly(x, y, r.poly));
  function refreshWalls() { // walls that touch anything you've seen
    const seen = floors.filter(f => seenFloor.has(f.i)), m = 40;
    seenWalls = walls.filter(w => seen.some(f => w.x < f.x + f.w + m && w.x + w.w > f.x - m && w.y < f.y + f.h + m && w.y + w.h > f.y - m));
  }
  function exploredBox() {
    if (seenFloor.size) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const f of floors) if (seenFloor.has(f.i)) { x0 = Math.min(x0, f.x); y0 = Math.min(y0, f.y); x1 = Math.max(x1, f.x + f.w); y1 = Math.max(y1, f.y + f.h); } return { x0, y0, x1, y1 }; }
    if (!fogCtx) return null;
    const d = fogCtx.getImageData(0, 0, cols, rows).data; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (d[(y * cols + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null; const g = MINIMAP.cell;
    return { x0: B.x + x0 * g, y0: B.y + y0 * g, x1: B.x + (x1 + 1) * g, y1: B.y + (y1 + 1) * g };
  }
  function resetFog() { if (fogCtx) fogCtx.clearRect(0, 0, cols, rows); seenFloor = new Set(); seenRoom = new Set(); seenWalls = []; }
  function reveal(x, y) {
    if (!fogCtx) return;
    const R = MINIMAP.revealRadius, room = roomAt(x, y); let added = false;
    if (room && !seenRoom.has(room.id)) { seenRoom.add(room.id); added = true; }
    for (const f of floors) {
      if (seenFloor.has(f.i)) continue;
      const dx = Math.max(f.x - x, 0, x - (f.x + f.w)), dy = Math.max(f.y - y, 0, y - (f.y + f.h));
      const fr = f.d && rooms.find(r => r.id === f.d), locked = fr && fr.age > (typeof currentAge !== "undefined" ? currentAge : 40);
      // nearby floor shows up, but not through a locked door: those rooms stay a dashed outline until they open
      if ((room && f.d === room.id) || (!locked && Math.hypot(dx, dy) < R)) { seenFloor.add(f.i); if (f.d) seenRoom.add(f.d); added = true; }
    }
    if (added) refreshWalls();
    const g = MINIMAP.cell, r = MINIMAP.revealRadius / g, cx = (x - B.x) / g, cy = (y - B.y) / g;
    fogCtx.fillStyle = "#fff"; fogCtx.beginPath(); fogCtx.arc(cx, cy, r, 0, Math.PI * 2); fogCtx.fill();
  }

  // ---------- the evacuation map you find ----------
  function posterTexture(scene) {
    if (scene.textures.exists("evac_map")) return "evac_map"; // ChatGPT's sign (2 frames of 48x64: plain, glowing dot)
    if (scene.textures.exists("evac_map_code")) return "evac_map_code";
    const t = scene.textures.createCanvas("evac_map_code", 48, 64), c = t.getContext();
    c.fillStyle = "#171C35"; c.fillRect(22, 30, 4, 34); c.fillRect(14, 60, 20, 4); // the stand
    c.fillRect(0, 0, 48, 36); c.fillStyle = "#F2D7A1"; c.fillRect(2, 2, 44, 32); // the frame and paper
    c.fillStyle = "#3E7775"; c.fillRect(2, 2, 44, 6);                          // title bar
    c.fillStyle = "#526078"; [[6, 12, 14, 8], [24, 12, 18, 8], [6, 23, 22, 8], [32, 23, 10, 8]].forEach(r => c.fillRect(...r)); // rooms
    c.fillStyle = "#83A89A"; c.fillRect(28, 21, 8, 2); c.fillRect(20, 31, 2, 2);  // exit arrows
    c.fillStyle = "#C45C4B"; c.fillRect(16, 26, 4, 4);                          // you are here
    t.refresh(); return "evac_map_code";
  }
  function placePoster(scene) {
    if (poster || has() || !L()) return;
    const P = MINIMAP.poster;
    const key = posterTexture(scene);
    poster = scene.add.sprite(P.x, P.y, key, 0).setOrigin(0.5, 1).setScale(key === "evac_map" ? 2 : 1.4).setDepth(P.y / 10000 + 3);
    if (key === "evac_map") poster.blink = scene.time.addEvent({ delay: 650, loop: true, callback: () => { if (poster && poster.active) poster.setFrame(poster.frame.name === 0 ? 1 : 0); } });
    poster.label = scene.add.text(P.x, P.y - 146, "YOU ARE HERE", { fontFamily: "Silkscreen, monospace", fontSize: "11px", color: "#FFF0CF", backgroundColor: "#171C35", padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(poster.depth + 0.01);
    scene.tweens.add({ targets: poster.label, y: poster.label.y - 6, duration: 700, yoyo: true, repeat: -1, ease: "Sine.InOut" });
    posterScene = scene;
  }
  function removePoster() { if (poster) { if (poster.blink) poster.blink.remove(); if (poster.label) poster.label.destroy(); poster.destroy(); } poster = null; }
  function find(scene) {
    const firstEver = !meta.mapFound;
    runFound = true; meta.mapFound = true; if (typeof saveMeta === "function") saveMeta(meta);
    if (poster && window.burstConfetti) burstConfetti(scene, poster.x, poster.y - 60, 0xf2d7a1, 12);
    removePoster();
    if (window.flashBanner) flashBanner("MAP", "FOUND THE OFFICE MAP", "reward");
    if (window.showLowerThird) showLowerThird("promo", "MAP", firstEver ? "You found the office map. It fills in as you explore. Tap it, or press M, to see the whole floor." : "Grabbed the office map. Tap it, or press M, for the whole floor.", firstEver ? 6000 : 3000);
    if (typeof sfx === "function") sfx("levelUp", 0);
    if (firstEver && window.Telemetry && Telemetry.event) Telemetry.event("map-found");
    mountMini(); nextDraw = 0;
  }

  // ---------- the HUD map ----------
  function css() {
    if (document.getElementById("minimap-css")) return;
    const st = document.createElement("style"); st.id = "minimap-css";
    st.textContent = `
#minimap{position:fixed;right:10px;top:calc(var(--ms-nav-h,0px) + var(--ms-mm-top,91px));z-index:24;width:232px;height:184px;box-sizing:border-box;border:16px solid transparent;border-image:url(${ART.frame}) 16 fill / 16px stretch;image-rendering:pixelated;filter:drop-shadow(3px 3px 0 rgba(0,0,0,.45));cursor:pointer;touch-action:manipulation}
#minimap canvas{position:absolute;inset:0;width:100%;height:100%;display:block;image-rendering:pixelated}
#minimap .mm-room{position:absolute;left:50%;bottom:-27px;transform:translateX(-50%);white-space:nowrap;font:11px/1 Silkscreen,monospace;letter-spacing:.06em;color:#171C35;background:#F2D7A1;border:2px solid #171C35;border-left:5px solid #EF9347;padding:4px 8px 3px;box-shadow:2px 2px 0 rgba(0,0,0,.45);pointer-events:none}
#minimap.mm-min .mm-room{display:none}
#minimap .mm-btn{position:absolute;top:-14px;width:24px;height:24px;border:0;padding:0;cursor:pointer;background:url(${ART.buttons}) 0 0/48px 24px no-repeat;image-rendering:pixelated;z-index:2}
#minimap .mm-big{right:14px}
#minimap .mm-hide{right:-12px;background-position:-24px 0}
#minimap.mm-min{width:84px;height:40px;cursor:pointer}
#minimap.mm-min canvas,#minimap.mm-min .mm-btn{display:none}
#minimap.mm-min::after{content:"MAP ▸";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:12px/1 Silkscreen,monospace;letter-spacing:.06em;color:#171C35;background:#F2D7A1;border-left:5px solid #EF9347} /* Nov 9: a minimized map now says MAP, so it's clearly a button */
#minimap.hidden{display:none}
@media (max-width:760px),(orientation:portrait){#minimap{width:172px;height:136px;top:calc(var(--ms-nav-h,0px) + var(--ms-mm-top,108px));right:6px;border-width:12px;border-image-width:12px}#minimap .mm-room{font-size:10px;bottom:-24px;padding:3px 6px 2px}#minimap .mm-btn{top:-11px}#minimap .mm-hide{right:-9px}#minimap .mm-big{right:13px}}
#minimap-modal{position:fixed;inset:0;z-index:60;background:rgba(10,12,24,.88);display:flex;align-items:center;justify-content:center;padding:14px}
#minimap-modal.hidden{display:none}
#minimap-modal .mmb{position:relative;width:min(960px,96vw);max-height:92vh;background:${C.bg};border:2px solid ${C.frame};border-radius:8px;padding:12px;box-shadow:6px 6px 0 rgba(0,0,0,.5);display:flex;flex-direction:column;gap:8px}
#minimap-modal .mmb-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
#minimap-modal .mmb-title{font:12px Silkscreen,monospace;letter-spacing:.08em;color:#171C35;background:#F2D7A1;padding:3px 8px;border-radius:2px}
#minimap-modal canvas{width:100%;height:auto;max-height:70vh;object-fit:contain;display:block;border-radius:4px}
#minimap-modal .mmb-legend{display:flex;flex-wrap:wrap;gap:6px 14px;font:13px 'Atkinson Hyperlegible',sans-serif;color:#B8C0D4}
#minimap-modal .mmb-legend i.mm-ic{display:inline-block;width:24px;height:24px;margin-right:5px;vertical-align:-7px;background:url(${ART.icons}) 0 0/192px 24px no-repeat;image-rendering:pixelated}
#minimap-modal button.mmb-x{font:12px Silkscreen,monospace;color:#171C35;background:#EF9347;border:0;border-radius:3px;padding:8px 12px;cursor:pointer}`;
    document.head.appendChild(st);
  }
  function mountMini() {
    css();
    if (!el) {
      el = document.createElement("div"); el.id = "minimap"; el.setAttribute("role", "button"); el.setAttribute("aria-label", "Office map. Tap to open the whole floor.");
      el.innerHTML = `<canvas width="400" height="304"></canvas><div class="mm-room" aria-hidden="true">LOBBY</div><button type="button" class="mm-btn mm-big" aria-label="Open the whole map"></button><button type="button" class="mm-btn mm-hide" aria-label="Hide the map"></button>`;
      document.body.appendChild(el);
      setInterval(syncMini, 250); // the game loop stops while paused, so check on our own
      el.addEventListener("pointerdown", e => {
        e.stopPropagation(); e.preventDefault();
        if (e.target.classList.contains("mm-hide")) { meta.minimapSmall = true; saveMeta(meta); syncMini(); return; }
        if (el.classList.contains("mm-min")) { meta.minimapSmall = false; saveMeta(meta); syncMini(); return; }
        openBig();
      });
    }
    syncMini();
  }
  function syncMini() {
    if (!el) return;
    const inRun = typeof titleOpen !== "undefined" && !titleOpen && typeof gameOver !== "undefined" && !gameOver;
    const menu = (typeof paused !== "undefined" && paused) || bigOpen; // Nov 9: don't sit on top of the pause menu
    el.classList.toggle("hidden", !has() || !inRun || menu);
    el.classList.toggle("mm-min", !!meta.minimapSmall);
  }

  // ---------- drawing ----------
  function draw(cv, cx, cy, worldW, whole) {
    const ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    if (!base) return;
    // which part of the office: the whole floor, or a window around you
    let vx, vy, vw, vh;
    if (whole) { // the big map frames the part you've explored (plus a margin), so it isn't a speck on a huge canvas
      const box = exploredBox(); const pad = 700;
      let x0 = box ? box.x0 - pad : B.x, y0 = box ? box.y0 - pad : B.y, x1 = box ? box.x1 + pad : B.x + B.width, y1 = box ? box.y1 + pad : B.y + B.height;
      vw = Math.max(x1 - x0, 3000); vh = Math.max(y1 - y0, 2000); const k = Math.max(vw / W, vh / H); const cxw = (x0 + x1) / 2, cyw = (y0 + y1) / 2;
      vw = W * k; vh = H * k; vx = cxw - vw / 2; vy = cyw - vh / 2;
    }
    else { vw = worldW; vh = worldW * H / W; vx = cx - vw / 2; vy = cy - vh / 2; }
    const s = W / vw, X = x => (x - vx) * s, Y = y => (y - vy) * s;
    // Nov 8 redesign (Rami: "too simple, reads very small"): an evacuation-map look, crisp, with rooms you
    // haven't found yet as faint dashed outlines (a lock and the age if they open later).
    ctx.imageSmoothingEnabled = false;
    const R = v => Math.round(v);
    const age = typeof currentAge !== "undefined" ? currentAge : 40;
    for (const r of rooms) {
      if (seenRoom.has(r.id)) continue;
      ctx.beginPath(); r.poly.forEach(([x, y], i) => i ? ctx.lineTo(R(X(x)), R(Y(y))) : ctx.moveTo(R(X(x)), R(Y(y)))); ctx.closePath();
      ctx.fillStyle = "rgba(62,74,102,.28)"; ctx.fill();
      ctx.setLineDash([4 * (whole ? 2 : 1), 4 * (whole ? 2 : 1)]); ctx.strokeStyle = C.unknown; ctx.lineWidth = whole ? 2 : 1.5; ctx.stroke(); ctx.setLineDash([]);
      const locked = r.age > age;
      ctx.font = `${whole ? 15 : 11}px Silkscreen, monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = locked ? "rgba(196,92,75,.85)" : "rgba(242,215,161,.6)";
      ctx.fillText(locked ? `AGE ${r.age}` : "?", R(X(r.cx)), R(Y(r.cy)));
    }
    ctx.fillStyle = C.floor;
    for (const f of floors) if (seenFloor.has(f.i)) ctx.fillRect(R(X(f.x)), R(Y(f.y)), Math.max(1, R(f.w * s)), Math.max(1, R(f.h * s)));
    const inSeen = (x, y) => floors.some(f => seenFloor.has(f.i) && x >= f.x && x <= f.x + f.w && y >= f.y && y <= f.y + f.h);
    ctx.fillStyle = "#47567A"; // desks, couches and cabinets, like the furniture blocks on a real evacuation map
    for (const o of furn) if (inSeen(o.x + o.w / 2, o.y + o.h / 2)) ctx.fillRect(R(X(o.x)), R(Y(o.y)), Math.max(2, R(o.w * s)), Math.max(2, R(o.h * s)));
    const wt = whole ? 3 : 2.5; ctx.fillStyle = "#E8DCC0"; // walls in cream line art, so the rooms read at a glance
    for (const w of seenWalls) ctx.fillRect(R(X(w.x)), R(Y(w.y)), Math.max(wt, R(w.w * s)), Math.max(wt, R(w.h * s)));
    if (whole) { // names of the rooms you've found
      ctx.font = "15px Silkscreen, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const r of rooms) if (seenRoom.has(r.id)) { const t = r.name.toUpperCase(), tw = ctx.measureText(t).width; ctx.fillStyle = "rgba(23,28,53,.75)"; ctx.fillRect(R(X(r.cx) - tw / 2 - 6), R(Y(r.cy) - 11), R(tw + 12), 22); ctx.fillStyle = "#F2D7A1"; ctx.fillText(t, R(X(r.cx)), R(Y(r.cy)) + 1); }
    }
    const seen = (x, y) => floors.some(f => seenFloor.has(f.i) && x >= f.x - 80 && x <= f.x + f.w + 80 && y >= f.y - 80 && y <= f.y + f.h + 80);
    const icon = (i, x, y, size) => { ctx.imageSmoothingEnabled = false; const s2 = Math.round(size); ctx.drawImage(icons, i * 12, 0, 12, 12, Math.round(X(x) - s2 / 2), Math.round(Y(y) - s2 / 2), s2, s2); };
    const isz = whole ? 26 : 22; // 12 px art at about 2x on the canvas
    const dot = (x, y, r, col, ic) => { if (iconsOk && ic !== undefined) return icon(ic, x, y, isz); ctx.fillStyle = "#171C35"; ctx.beginPath(); ctx.arc(X(x), Y(y), r + 1.5, 0, 7); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X(x), Y(y), r, 0, 7); ctx.fill(); };
    const k = whole ? 1.6 : 1;
    // doors: green once your promotion opened them, red while locked (shown once you've seen them)
    for (const g of window.START_AREA_GATES || []) {
      const gx = g.x + (g.width || 128) / 2, gy = g.y + (g.height || 224) / 2; if (!seen(gx, gy)) continue;
      if (iconsOk) icon(g.opened ? ICON.doorOpen : ICON.doorLocked, gx, gy, isz);
      else { ctx.fillStyle = "#171C35"; ctx.fillRect(X(gx) - 4 * k, Y(gy) - 4 * k, 8 * k, 8 * k); ctx.fillStyle = g.opened ? C.doorOpen : C.doorLocked; ctx.fillRect(X(gx) - 3 * k, Y(gy) - 3 * k, 6 * k, 6 * k); }
      if (whole && !g.opened) { ctx.font = "13px Silkscreen, monospace"; ctx.fillStyle = "#F2D7A1"; ctx.textAlign = "center"; ctx.fillText("AGE " + g.age, X(gx), Y(gy) - 16); }
    }
    if (window.Lounge && Lounge.spot && Lounge.isOpen && Lounge.isOpen()) { const p = Lounge.spot(); if (p && seen(p.x, p.y)) dot(p.x, p.y, 3.5 * k, C.lounge, ICON.lounge); }
    if (typeof chests !== "undefined" && chests && chests.getChildren) chests.getChildren().forEach(o => { if (o.active) dot(o.x, o.y, 3 * k, C.chest, ICON.chest); });
    const em = window.Errands && Errands.mark && Errands.mark(); if (em) dot(em.x, em.y, 4.5 * k, "#EF9347", ICON.map); // the TO-DO errand, always shown
    const it = window.Interns && Interns.active && Interns.active(); if (it && it.o && it.o.active) dot(it.o.x, it.o.y, 3 * k, C.intern, ICON.intern);
    if (typeof bills !== "undefined" && bills && bills.getChildren) bills.getChildren().forEach(b => { if (b.active && b.isBoss && !b.clockOut) dot(b.x, b.y, 4 * k, C.boss, ICON.boss); });
    // you: an arrow pointing the way you're walking
    if (typeof player !== "undefined" && player && player.body) {
      const v = player.body.velocity; if (Math.hypot(v.x, v.y) > 10) lastAngle = Math.atan2(v.y, v.x);
      const px = X(player.x), py = Y(player.y), r = 6 * k;
      if (iconsOk) { const sz = isz + 4; ctx.save(); ctx.translate(Math.round(px), Math.round(py)); ctx.rotate(lastAngle + Math.PI / 2); ctx.imageSmoothingEnabled = false; ctx.drawImage(icons, 0, 0, 12, 12, -sz / 2, -sz / 2, sz, sz); ctx.restore(); return; }
      ctx.save(); ctx.translate(px, py); ctx.rotate(lastAngle + Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * 0.75, r * 0.8); ctx.lineTo(0, r * 0.35); ctx.lineTo(-r * 0.75, r * 0.8); ctx.closePath();
      ctx.fillStyle = C.you; ctx.strokeStyle = "#171C35"; ctx.lineWidth = 2; ctx.stroke(); ctx.fill(); ctx.restore();
    }
  }

  // ---------- the big map (paused) ----------
  function openBig() {
    const sc = window._activeGameScene; if (!sc || !has() || bigOpen) return;
    if (typeof levelUpOpen !== "undefined" && levelUpOpen) return;
    if (typeof paused !== "undefined" && paused) return;
    css();
    if (!big) {
      big = document.createElement("div"); big.id = "minimap-modal"; big.className = "hidden"; big.setAttribute("role", "dialog"); big.setAttribute("aria-label", "Office map");
      big.innerHTML = `<div class="mmb"><div class="mmb-head"><span class="mmb-title">OFFICE MAP · YOU ARE HERE</span><button type="button" class="mmb-x nav-item" data-nav-idx="0">CLOSE [M]</button></div>
        <canvas width="1200" height="810"></canvas>
        <div class="mmb-legend"><span><i class="mm-ic" style="background-position:-0px 0"></i>You</span><span><i class="mm-ic" style="background-position:-24px 0"></i>Open door</span><span><i class="mm-ic" style="background-position:-48px 0"></i>Locked (opens at that age)</span><span><i class="mm-ic" style="background-position:-72px 0"></i>Chest</span><span><i class="mm-ic" style="background-position:-96px 0"></i>Lounge</span><span><i class="mm-ic" style="background-position:-120px 0"></i>Intern</span><span><i class="mm-ic" style="background-position:-144px 0"></i>Boss</span><span style="opacity:.8">Dark areas: not explored yet</span></div></div>`;
      document.body.appendChild(big);
      big.addEventListener("pointerdown", e => { if (e.target === big || e.target.classList.contains("mmb-x")) { e.preventDefault(); closeBig(); } });
      big.querySelector(".mmb-x").addEventListener("nav-activate", closeBig);
    }
    bigOpen = true; window.minimapOpen = true;
    sc.physics.pause(); sc.time.paused = true;
    big.classList.remove("hidden");
    draw(big.querySelector("canvas"), 0, 0, 0, true);
    if (window.menuNav && menuNav.refresh) try { menuNav.refresh(".mmb-x"); } catch (e) {}
    if (typeof sfx === "function") sfx("pick");
  }
  function closeBig() {
    if (!bigOpen) return;
    bigOpen = false; window.minimapOpen = false;
    if (big) big.classList.add("hidden");
    const sc = window._activeGameScene;
    const hold = (typeof paused !== "undefined" && paused) || (typeof levelUpOpen !== "undefined" && levelUpOpen) || (typeof gameOver !== "undefined" && gameOver);
    if (sc && !hold) { sc.physics.resume(); sc.time.paused = false; }
    if (typeof sfx === "function") sfx("pick");
  }

  // ---------- run hooks ----------
  function reset() {
    if (MINIMAP.perRun) runFound = false;
    closeBig(); removePoster(); posterScene = null; nextReveal = 0; nextDraw = 0;
    if (!base) buildBase(); resetFog();
  }
  function update(scene, now) {
    if (!base && !buildBase()) return;
    if (typeof player === "undefined" || !player || !player.active) return;
    if (!has()) {
      if (!signAsked && window.ArtSheets) { signAsked = true; signWaitUntil = now + 3000; ArtSheets.load(scene, "evac_map", ART.sign, 48, 64); }
      const signReady = scene.textures.exists("evac_map") || now > signWaitUntil; // wait a moment for the real sign, then fall back
      if (signReady && (!poster || posterScene !== scene || !poster.active)) { poster = null; if (window.START_AREA_GATES && START_AREA_GATES.length) placePoster(scene); }
      if (poster && Math.hypot(player.x - poster.x, player.y - (poster.y - 20)) < MINIMAP.findRadius) find(scene);
    }
    if (now >= nextReveal) { nextReveal = now + 200; reveal(player.x, player.y); } // exploring counts even before you find the map
    if (!has()) return;
    if (!el) mountMini();
    if (now >= nextDraw) {
      nextDraw = now + 120; syncMini();
      if (!el.classList.contains("mm-min") && !el.classList.contains("hidden")) {
        draw(el.querySelector("canvas"), player.x, player.y, MINIMAP.miniWorldWidth, false);
        const r = roomAt(player.x, player.y), tab = el.querySelector(".mm-room"), name = r ? r.name.toUpperCase() : "HALLWAY";
        if (tab && tab.textContent !== name) tab.textContent = name;
      }
    }
  }
  // M opens and closes the big map; Escape closes it. A controller's B closes it too (checked in update).
  window.addEventListener("keydown", e => {
    if (window.rebindState || (typeof titleOpen !== "undefined" && titleOpen)) return;
    if (e.code === "Escape" && bigOpen) { e.preventDefault(); e.stopPropagation(); closeBig(); return; }
    if (e.code === "KeyM" && !e.repeat && onKey("KeyM")) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  setInterval(syncMini, 500); // hide the corner map on the title screen and after a run ends
  function onKey(code) { if (code !== "KeyM" || !has()) return false; if (bigOpen) closeBig(); else openBig(); return true; }
  function padCheck() { if (bigOpen && typeof padJust === "function" && (padJust("b") || padJust("start") || padJust("a") || padJust("yBtn") || padJust("select"))) closeBig(); }
  return { padCheck, reset, update, openBig, closeBig, onKey, isOpen: () => bigOpen, sync: syncMini, has };
})();
