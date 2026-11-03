// Objective 10: three new weapon TYPES (boomerang, orbit, piercing line).
// Numbers live in src/data/weapons.js (WEAPONS.remote / .spreadsheet / .podcast).
// Everything runs on game time inside update(), so pausing freezes it automatically.

let extraW = null; // per-run state: flying remotes, orbiting cells, podcast waves, cooldown clocks

// ---------- Pixel art ----------
function buildWeaponSprites(scene) {
  // TV REMOTE (14x28): black remote with a red power button and rubber buttons
  makeCanvasTex(scene, "w_remote", 14, 28, ctx => {
    ctx.fillStyle = "#05060c"; rrect(ctx, 0, 0, 14, 28, 4); ctx.fill();
    ctx.fillStyle = "#2b2f3d"; rrect(ctx, 1, 1, 12, 26, 3); ctx.fill();
    ctx.fillStyle = "#ff3b4e"; ctx.beginPath(); ctx.arc(7, 5, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#9aa6c8";
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) ctx.fillRect(2.5 + c * 3.3, 10 + r * 3.6, 2.2, 2.2);
    ctx.fillStyle = "#6be2ff"; ctx.fillRect(4, 24, 6, 1.5);
  });
  // FLOPPY DISK (16x16, Nov 3): Ben's take on the boomerang. Navy 3.5-inch disk, silver shutter, cream label.
  makeCanvasTex(scene, "w_floppy", 16, 16, ctx => {
    const px = (c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    px("#171C35", 0, 0, 16, 16); px("#303750", 1, 1, 14, 14);
    px("#B8C0D4", 4, 1, 8, 5); px("#526078", 9, 2, 2, 3);
    px("#F2D7A1", 3, 8, 10, 7); px("#EF9347", 3, 8, 10, 1); px("#874C3B", 5, 11, 6, 1); px("#874C3B", 5, 13, 4, 1);
  });
  // SPREADSHEET CELL (22x16): a green cell with gridlines and "=SUM"
  makeCanvasTex(scene, "w_cell", 22, 16, ctx => {
    ctx.fillStyle = "#0b3d1f"; ctx.fillRect(0, 0, 22, 16);
    ctx.fillStyle = "#1f8f4e"; ctx.fillRect(1, 1, 20, 14);
    ctx.fillStyle = "#c6f5d6"; ctx.fillRect(1, 1, 20, 4);
    ctx.fillStyle = "#0b3d1f"; ctx.fillRect(11, 1, 1, 14); ctx.fillRect(1, 5, 20, 1); ctx.fillRect(1, 10, 20, 1);
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 5px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("=SUM", 11, 13);
  });
  // PODCAST WAVE (26x26): purple headphones with sound arcs
  makeCanvasTex(scene, "w_pod", 26, 26, ctx => {
    ctx.strokeStyle = "rgba(190,140,255,0.9)"; ctx.lineWidth = 2;
    [8, 11].forEach(r => { ctx.beginPath(); ctx.arc(13, 13, r, -0.9, 0.9); ctx.stroke(); });
    ctx.strokeStyle = "#3b1f6b"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(9, 12, 6, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = "#b98cff"; rrect(ctx, 2, 11, 4, 7, 2); ctx.fill(); rrect(ctx, 12, 11, 4, 7, 2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 6px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("2x", 9, 22);
  });
}

// ---------- Per-run setup ----------
function initExtraWeapons(scene) {
  extraW = { remotes: [], cells: [], pods: [], nextRemote: 0, nextPod: 0, cellAngle: 0, faceX: 1, faceY: 0, hitLog: new Map() };
}

// A projectile can only hit the same enemy once per short window (so piercing/boomerang shots don't shred in one frame).
function canHit(proj, bill, windowMs) {
  const key = proj.uid + ":" + (bill.uid || (bill.uid = Math.random().toString(36).slice(2)));
  const last = extraW.hitLog.get(key) || -Infinity;
  if (runElapsedMs - last < windowMs) return false;
  extraW.hitLog.set(key, runElapsedMs);
  return true;
}

function hitEnemiesNear(proj, radius, damage, windowMs) {
  bills.getChildren().slice().forEach(b => {
    if (!b.active || b.ghost) return;
    if (Phaser.Math.Distance.Between(proj.x, proj.y, b.x, b.y) <= radius + ((ENEMIES[b.kind] && ENEMIES[b.kind].size) || 24) / 2) {
      if (canHit(proj, b, windowMs)) damageBill(b, damage);
    }
  });
}

let projUid = 0;

// ---------- Every frame ----------
function updateExtraWeapons(scene, delta) {
  if (!extraW || !stats || !player) return;
  const dt = Math.min(delta, 50) / 1000, now = runElapsedMs, cd = stats.cooldownMult || 1;
  const vx = player.body ? player.body.velocity.x : 0, vy = player.body ? player.body.velocity.y : 0;
  if (Math.hypot(vx, vy) > 10) { const l = Math.hypot(vx, vy); extraW.faceX = vx / l; extraW.faceY = vy / l; }

  // 1. TV REMOTE (boomerang): thrown at the nearest enemy, flies out, comes back. Hits both ways.
  if (stats.remote) {
    const R = WEAPONS.remote;
    if (now >= extraW.nextRemote) {
      extraW.nextRemote = now + stats.remoteEveryMs * cd;
      const target = nearestBill();
      const base = target ? Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y) : Math.atan2(extraW.faceY, extraW.faceX);
      const n = stats.remoteCount;
      for (let i = 0; i < n; i++) {
        const a = base + (i - (n - 1) / 2) * 0.35;
        const s = scene.add.image(player.x, player.y, stats.floppy ? "w_floppy" : "w_remote").setDepth(6).setScale((stats.floppy ? 1.5 : 1) * (stats.smartTv ? 1.4 : 1));
        s.uid = "r" + (projUid++); s.ang = a; s.dist = 0; s.out = true;
        extraW.remotes.push(s);
      }
      sfx("shoot");
    }
    extraW.remotes = extraW.remotes.filter(s => {
      const range = stats.remoteRange, speed = R.speed;
      if (s.out) { s.dist += speed * dt; if (s.dist >= range) s.out = false; }
      else { s.dist -= speed * 1.15 * dt; }
      if (!s.out && s.dist <= 0) { s.destroy(); return false; }
      s.setPosition(player.x + Math.cos(s.ang) * s.dist, player.y + Math.sin(s.ang) * s.dist);
      s.rotation += 14 * dt;
      hitEnemiesNear(s, stats.smartTv ? 18 : 12, stats.remoteDamage, 350);
      return true;
    });
  }

  // 2. SPREADSHEET (orbit): cells circle you and damage on contact.
  if (stats.sheet) {
    const want = stats.sheetCount;
    while (extraW.cells.length < want) {
      const c = scene.add.image(player.x, player.y, "w_cell").setDepth(6);
      c.uid = "c" + (projUid++); extraW.cells.push(c);
    }
    while (extraW.cells.length > want) extraW.cells.pop().destroy();
    extraW.cellAngle += WEAPONS.spreadsheet.spinPerSec * dt;
    extraW.cells.forEach((c, i) => {
      const a = extraW.cellAngle + (i / want) * Math.PI * 2;
      c.setPosition(player.x + Math.cos(a) * stats.sheetRadius, player.y + Math.sin(a) * stats.sheetRadius);
      c.setScale(stats.pivotTable ? 1.35 : 1);
      hitEnemiesNear(c, stats.pivotTable ? 16 : 11, stats.sheetDamage, 450);
    });
  }

  // 3. PODCAST AT 2x (piercing line): fires the way you're walking and keeps going through crowds.
  if (stats.podcast) {
    const P = WEAPONS.podcast;
    if (now >= extraW.nextPod) {
      extraW.nextPod = now + stats.podEveryMs * cd;
      const base = Math.atan2(extraW.faceY, extraW.faceX);
      const angles = stats.bingeMode ? [base - 0.3, base, base + 0.3] : [base];
      angles.forEach(a => {
        const w = scene.add.image(player.x, player.y, "w_pod").setDepth(6).setRotation(a);
        w.uid = "p" + (projUid++); w.vx = Math.cos(a) * P.speed; w.vy = Math.sin(a) * P.speed;
        w.life = P.lifeMs; w.hits = 0;
        extraW.pods.push(w);
      });
      sfx("shoot");
    }
    extraW.pods = extraW.pods.filter(w => {
      w.x += w.vx * dt; w.y += w.vy * dt; w.life -= dt * 1000;
      bills.getChildren().slice().forEach(b => {
        if (w.hits >= stats.podPierce || !b.active || b.ghost) return; // pierce 3 = exactly 3 enemies
        if (Phaser.Math.Distance.Between(w.x, w.y, b.x, b.y) <= 14 + ((ENEMIES[b.kind] && ENEMIES[b.kind].size) || 24) / 2 && canHit(w, b, 10000)) {
          damageBill(b, stats.podDamage); w.hits++;
        }
      });
      if (w.life <= 0 || w.hits >= stats.podPierce) { w.destroy(); return false; }
      return true;
    });
  }

  // Keep the hit log small.
  if (extraW.hitLog.size > 4000) extraW.hitLog.clear();
}
