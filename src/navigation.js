// Enemy navigation: a "flow field" so swarms walk AROUND furniture and through doorways
// instead of piling up against walls.
//
// How it works (the short version):
//   1. A few times a second, lay a grid of 32px cells over the area around the player.
//   2. Mark every cell covered by furniture (anything in window.propGroup) as blocked.
//   3. Starting at the player's cell, flood outward and write down how many steps each
//      open cell is from the player (Dijkstra, with diagonal steps costing a little more).
//   4. Each enemy looks at its own cell and walks toward the neighbor that is closer to you.
// In wide-open space the field matches a straight line, so enemies just chase you directly
// (same as before). Only when furniture is in the way do they follow the arrows.
//
// The same field also answers "can an enemy actually reach the player from here?", which is
// how spawning avoids desks today and locked promotion gates later (see window.navExtraBlockers).
(function () {
  const NAV = window.NAV = {
    enabled: true,      // set false and reload to compare with the old straight-line chase
    cell: 32,           // grid size in pixels
    radius: 34,         // cells from the player to each edge (34 * 32 = about 1090px, past the spawn ring)
    refreshMs: 180,     // how often the field is rebuilt
    pad: 10,            // furniture is treated as this many pixels bigger, so enemies don't scrape corners
    // true draws the arrows (handy for screenshots and the devlog). Playtesters: add ?navdebug=1 to the URL.
    debug: /[?&]navdebug=1/.test(location.search)
  };

  const SIZE = NAV.radius * 2 + 1;
  const N = SIZE * SIZE;
  const blocked = new Uint8Array(N);
  const dist = new Float32Array(N);
  const heapIdx = new Int32Array(N * 4);
  const heapKey = new Float32Array(N * 4);
  let ox = 0, oy = 0;       // world position of cell (0, 0)
  let ready = false, lastBuild = -1e9, lastPc = -1;
  let debugGfx = null;
  const DIAG = Math.SQRT2;
  const NB = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, DIAG], [1, -1, DIAG], [-1, 1, DIAG], [-1, -1, DIAG]];

  function cellOf(x, y) {
    const cx = Math.floor((x - ox) / NAV.cell), cy = Math.floor((y - oy) / NAV.cell);
    if (cx < 0 || cy < 0 || cx >= SIZE || cy >= SIZE) return -1;
    return cy * SIZE + cx;
  }

  // Mark every cell whose CENTER falls inside a (padded) rectangle.
  function blockRect(x, y, w, h) {
    const c = NAV.cell, p = NAV.pad;
    const x0 = Math.max(0, Math.ceil((x - p - ox - c / 2) / c)), x1 = Math.min(SIZE - 1, Math.floor((x + w + p - ox - c / 2) / c));
    const y0 = Math.max(0, Math.ceil((y - p - oy - c / 2) / c)), y1 = Math.min(SIZE - 1, Math.floor((y + h + p - oy - c / 2) / c));
    for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) blocked[cy * SIZE + cx] = 1;
  }

  function build(player) {
    const c = NAV.cell;
    ox = Math.floor(player.x / c) * c - NAV.radius * c;
    oy = Math.floor(player.y / c) * c - NAV.radius * c;
    blocked.fill(0);
    const left = ox, top = oy, right = ox + SIZE * c, bottom = oy + SIZE * c;
    const g = window.propGroup;
    if (g) g.getChildren().forEach(o => {
      const b = o.body;
      if (!o.active || !b || !b.enable) return;
      if (b.right < left || b.x > right || b.bottom < top || b.y > bottom) return;
      blockRect(b.x, b.y, b.width, b.height);
    });
    (window.navExtraBlockers || []).forEach(r => blockRect(r.x, r.y, r.w, r.h)); // e.g. locked promotion gates

    // Dijkstra flood from the player's cell.
    dist.fill(Infinity);
    const start = NAV.radius * SIZE + NAV.radius;
    blocked[start] = 0; // the player is always standing somewhere reachable
    dist[start] = 0;
    let n = 0;
    const push = (i, k) => { // tiny binary heap
      let j = n++;
      while (j > 0) { const p = (j - 1) >> 1; if (heapKey[p] <= k) break; heapKey[j] = heapKey[p]; heapIdx[j] = heapIdx[p]; j = p; }
      heapKey[j] = k; heapIdx[j] = i;
    };
    const pop = () => {
      const top = heapIdx[0], lastK = heapKey[--n], lastI = heapIdx[n];
      let j = 0;
      while (true) {
        let l = j * 2 + 1; if (l >= n) break;
        if (l + 1 < n && heapKey[l + 1] < heapKey[l]) l++;
        if (heapKey[l] >= lastK) break;
        heapKey[j] = heapKey[l]; heapIdx[j] = heapIdx[l]; j = l;
      }
      heapKey[j] = lastK; heapIdx[j] = lastI;
      return top;
    };
    push(start, 0);
    while (n > 0) {
      const i = pop(), d = dist[i], cx = i % SIZE, cy = (i / SIZE) | 0;
      for (const [dx, dy, cost] of NB) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
        const j = ny * SIZE + nx;
        if (blocked[j]) continue;
        if (dx && dy && (blocked[cy * SIZE + nx] || blocked[ny * SIZE + cx])) continue; // no squeezing past corners
        const nd = d + cost;
        if (nd < dist[j]) { dist[j] = nd; push(j, nd); }
      }
    }
    ready = true;
  }

  // Called once per frame from main.js; rebuilds the field when it's stale.
  NAV.update = function (scene, player, now) {
    if (!NAV.enabled || !player) return;
    const pc = Math.floor(player.x / NAV.cell) * 100003 + Math.floor(player.y / NAV.cell);
    if (now - lastBuild < NAV.refreshMs && pc === lastPc) return;
    if (now - lastBuild < NAV.refreshMs / 3) return; // moving fast: still cap the rebuild rate
    lastBuild = now; lastPc = pc;
    build(player);
    if (NAV.debug) drawDebug(scene);
  };

  // Is the straight line from (x, y) to the player free of furniture? Walks the grid in half-cell steps.
  function lineClear(x, y) {
    const px = ox + NAV.radius * NAV.cell + NAV.cell / 2, py = oy + NAV.radius * NAV.cell + NAV.cell / 2;
    const steps = Math.ceil(Math.hypot(px - x, py - y) / (NAV.cell / 2));
    for (let k = 1; k < steps; k++) {
      const j = cellOf(x + (px - x) * k / steps, y + (py - y) * k / steps);
      if (j >= 0 && blocked[j]) return false;
    }
    return true;
  }
  // Nearly-straight path AND nothing actually in the way. (The old test only compared path length,
  // so an enemy right behind a small prop like the Circle Back roundabout would charge into it.)
  function directOk(i, x, y, px, py) {
    if (dist[i] <= 2) return true;
    const straight = Math.hypot(px - x, py - y) / NAV.cell;
    return dist[i] <= straight * 1.12 + 1.5 && lineClear(x, y);
  }
  // An enemy squeezed against furniture can sit in a "blocked" cell (inside the padding). Point it at the
  // best open neighbor so it slides out and around instead of pushing straight into the prop.
  function escapeCell(i) {
    const cx = i % SIZE, cy = (i / SIZE) | 0;
    let best = -1, bd = Infinity;
    for (let r = 1; r <= 2 && best < 0; r++) {
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
        const j = ny * SIZE + nx;
        if (dist[j] < bd) { bd = dist[j]; best = j; }
      }
    }
    return best;
  }

  // Steer one enemy toward the player at `speed`. Falls back to a straight chase when the
  // field can't help (not built yet, enemy outside it, or nothing in the way).
  NAV.steer = function (scene, e, player, speed) {
    if (!NAV.enabled || !ready) return scene.physics.moveToObject(e, player, speed);
    const i = cellOf(e.x, e.y);
    if (i < 0) return scene.physics.moveToObject(e, player, speed);
    if (!isFinite(dist[i])) {
      const j = blocked[i] ? escapeCell(i) : -1;
      if (j < 0) return scene.physics.moveToObject(e, player, speed);
      const tx = ox + (j % SIZE) * NAV.cell + NAV.cell / 2, ty = oy + ((j / SIZE) | 0) * NAV.cell + NAV.cell / 2;
      const l = Math.hypot(tx - e.x, ty - e.y) || 1;
      return e.setVelocity((tx - e.x) / l * speed, (ty - e.y) / l * speed);
    }
    if (directOk(i, e.x, e.y, player.x, player.y)) return scene.physics.moveToObject(e, player, speed); // clear line: chase directly
    // Blend every downhill neighbor, weighted by how much closer it gets you. Smoother than picking one.
    const cx = i % SIZE, cy = (i / SIZE) | 0, d = dist[i];
    let vx = 0, vy = 0;
    for (const [dx, dy, cost] of NB) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
      const dn = dist[ny * SIZE + nx];
      if (!(dn < d)) continue;
      const w = (d - dn) / cost;
      vx += dx / cost * w; vy += dy / cost * w;
    }
    const len = Math.hypot(vx, vy);
    if (!len) return scene.physics.moveToObject(e, player, speed);
    e.setVelocity(vx / len * speed, vy / len * speed);
  };

  // Is this spot open AND connected to the player? (False outside the field: we can't tell.)
  NAV.reachable = function (x, y) {
    if (!NAV.enabled || !ready) return true;
    const i = cellOf(x, y);
    return i >= 0 && isFinite(dist[i]);
  };

  // Nudge a spawn point to the nearest reachable cell (searching outward a few rings).
  // Keeps enemies from appearing inside desks or behind locked doors.
  NAV.fixSpawn = function (x, y) {
    if (!NAV.enabled || !ready) return [x, y];
    const i = cellOf(x, y);
    if (i < 0) return [x, y];
    if (isFinite(dist[i])) return [x, y];
    const cx = i % SIZE, cy = (i / SIZE) | 0;
    for (let r = 1; r <= 8; r++) {
      let best = -1, bestD = Infinity;
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
        const j = ny * SIZE + nx;
        // prefer the candidate that stays farthest from the player, so spawns stay off-screen
        if (isFinite(dist[j]) && -dist[j] < bestD) { bestD = -dist[j]; best = j; }
      }
      if (best >= 0) return [ox + (best % SIZE) * NAV.cell + NAV.cell / 2, oy + ((best / SIZE) | 0) * NAV.cell + NAV.cell / 2];
    }
    return null; // nowhere sensible nearby: skip this spawn
  };

  // Can an enemy at (x, y) come straight at the player, with nothing in the way? Used by Close Calls,
  // so circling a desk you're hiding behind doesn't count as a dodge. (Same test steer() uses.)
  NAV.hasClearApproach = function (x, y) {
    if (!NAV.enabled || !ready) return true;
    const i = cellOf(x, y);
    if (i < 0 || !isFinite(dist[i])) return true;
    const px = ox + NAV.radius * NAV.cell + NAV.cell / 2, py = oy + NAV.radius * NAV.cell + NAV.cell / 2;
    return directOk(i, x, y, px, py);
  };

  // Is this spot free of furniture and walls? (True outside the field or before it's built: we can't tell.)
  NAV.isOpen = function (x, y) {
    if (!NAV.enabled || !ready) return true;
    const i = cellOf(x, y);
    return i < 0 || !blocked[i];
  };

  NAV.stats = function () {
    let open = 0, reach = 0;
    for (let i = 0; i < N; i++) { if (!blocked[i]) open++; if (isFinite(dist[i])) reach++; }
    return { ready, cells: N, open, reachable: reach, blocked: N - open };
  };

  function drawDebug(scene) {
    if (!debugGfx || !debugGfx.scene) debugGfx = scene.add.graphics().setDepth(60000); // new run = new scene
    debugGfx.clear();
    const c = NAV.cell;
    for (let i = 0; i < N; i++) {
      const x = ox + (i % SIZE) * c, y = oy + ((i / SIZE) | 0) * c;
      if (blocked[i]) { debugGfx.fillStyle(0xc45c4b, 0.25).fillRect(x, y, c, c); continue; }
      if (!isFinite(dist[i]) || (i % 2)) continue;
      const cx = i % SIZE, cy = (i / SIZE) | 0;
      let bx = 0, by = 0, bd = dist[i];
      for (const [dx, dy] of NB) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
        const dn = dist[ny * SIZE + nx];
        if (dn < bd) { bd = dn; bx = dx; by = dy; }
      }
      debugGfx.lineStyle(1, 0xf2d7a1, 0.5).lineBetween(x + c / 2, y + c / 2, x + c / 2 + bx * 10, y + c / 2 + by * 10);
    }
  }
})();
