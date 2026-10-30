// High-detail 16-bit SNES/GBA-style sprite & stage art generator (zero external files).
// Draws rich multi-layered sprites AND a full open-plan office stage (parquet hallways, rugs,
// cubicle workstations with dual monitors, potted plants, watercoolers, and photocopy machines).

function makeCanvasTex(scene, key, w, h, drawFn) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, w, h);
  const ctx = tex.getContext();
  drawFn(ctx, w, h);
  tex.refresh();
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function buildSprites(scene) {
  // =========================================================================
  // 1. RICH STAGE TILE (512x512): An open-plan office floor with:
  //    - herringbone carpet tiles,
  //    - a warm wood-plank walkway (horizontal & vertical crossroads),
  //    - a decorative breakroom area rug,
  //    - power floor outlets, scattered memos, sticky notes & coffee rings.
  // =========================================================================
  makeCanvasTex(scene, "floor", 512, 512, (ctx) => {
    // Base carpet grid (64x64 tiles with alternating weave direction)
    for (let ty = 0; ty < 512; ty += 64) {
      for (let tx = 0; tx < 512; tx += 64) {
        const alt = ((tx / 64) + (ty / 64)) % 2 === 0;
        ctx.fillStyle = alt ? "#1c223b" : "#212845";
        ctx.fillRect(tx, ty, 64, 64);

        // Fine herringbone carpet texture
        ctx.fillStyle = alt ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.08)";
        for (let y = 0; y < 64; y += 4) {
          for (let x = (y % 8 === 0 ? 0 : 2); x < 64; x += 4) {
            ctx.fillRect(tx + x, ty + y, 2, 2);
          }
        }
        // Subtle tile seam + bevel
        ctx.strokeStyle = "rgba(10,13,26,0.55)";
        ctx.lineWidth = 1;
        ctx.strokeRect(tx + 0.5, ty + 0.5, 63, 63);
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        ctx.fillRect(tx + 1, ty + 1, 62, 1);
      }
    }

    // Horizontal warm wood-plank hallway across the middle (y = 208..304)
    const wy = 216, wh = 80;
    ctx.fillStyle = "#121526";
    ctx.fillRect(0, wy - 4, 512, wh + 8); // dark brass/rubber transition strip
    ctx.fillStyle = "#8c6d46";
    ctx.fillRect(0, wy - 2, 512, 2);
    ctx.fillRect(0, wy + wh, 512, 2);

    const plankColors = ["#3b2b20", "#453225", "#36261c", "#4d382a"];
    for (let py = wy; py < wy + wh; py += 16) {
      let xOff = (py * 3) % 64;
      for (let px = -xOff; px < 512; px += 64) {
        ctx.fillStyle = plankColors[((px + py) / 16 | 0) % plankColors.length];
        ctx.fillRect(px, py, 64, 16);
        // Wood grain lines
        ctx.fillStyle = "rgba(255,220,180,0.06)";
        ctx.fillRect(px + 4, py + 4, 52, 1);
        ctx.fillRect(px + 10, py + 10, 44, 1);
        ctx.strokeStyle = "rgba(20,12,8,0.6)";
        ctx.strokeRect(px + 0.5, tyOrZero(py) + 0.5, 63, 15);
      }
    }
    function tyOrZero(v) { return v; }

    // Decorative teal/gold breakroom rug in top-left quadrant
    const rx = 56, ry = 48, rw = 144, rh = 112;
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    rrect(ctx, rx + 3, ry + 4, rw, rh, 6); ctx.fill();
    ctx.fillStyle = "#264e5a";
    rrect(ctx, rx, ry, rw, rh, 6); ctx.fill();
    ctx.strokeStyle = "#d9a74a"; ctx.lineWidth = 3;
    ctx.strokeRect(rx + 6, ry + 6, rw - 12, rh - 12);
    ctx.strokeStyle = "#4fa8b8"; ctx.lineWidth = 1;
    ctx.strokeRect(rx + 12, ry + 12, rw - 24, rh - 24);
    // Rug center diamond motif
    ctx.fillStyle = "#336978";
    ctx.beginPath();
    ctx.moveTo(rx + rw / 2, ry + 22);
    ctx.lineTo(rx + rw - 28, ry + rh / 2);
    ctx.lineTo(rx + rw / 2, ry + rh - 22);
    ctx.lineTo(rx + 28, ry + rh / 2);
    ctx.closePath(); ctx.fill();

    // Brass floor outlet plate in bottom-right
    ctx.fillStyle = "#8c7038"; rrect(ctx, 380, 390, 22, 16, 3); ctx.fill();
    ctx.fillStyle = "#c9a65b"; rrect(ctx, 382, 392, 18, 12, 2); ctx.fill();
    ctx.fillStyle = "#2b2210"; ctx.fillRect(386, 396, 3, 4); ctx.fillRect(393, 396, 3, 4);

    // Scattered papers, sticky notes & coffee rings for lived-in midlife office feel
    const papers = [[340, 90, 0.25, "#e8edf5"], [352, 98, -0.15, "#dce3f0"], [120, 380, -0.3, "#e8edf5"]];
    papers.forEach(([px, py, ang, col]) => {
      ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
      ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.fillRect(-7, -9, 16, 20);
      ctx.fillStyle = col; ctx.fillRect(-8, -10, 16, 20);
      ctx.fillStyle = "#7a88a8";
      for (let ly = -6; ly <= 6; ly += 3) ctx.fillRect(-5, ly, 10, 1);
      ctx.restore();
    });
    // Sticky notes
    [[290, 240, -0.2, "#f5d75b"], [440, 340, 0.35, "#f078b8"], [95, 250, 0.12, "#6fd9c4"]].forEach(([sx, sy, a, c]) => {
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(a);
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(-5, -5, 11, 11);
      ctx.fillStyle = c; ctx.fillRect(-6, -6, 10, 10);
      ctx.restore();
    });
    // Double coffee stain ring
    ctx.strokeStyle = "rgba(85, 50, 30, 0.32)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(420, 140, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(425, 144, 8, 0, Math.PI * 2); ctx.stroke();
  });

  // =========================================================================
  // 2. STAGE PROPS (scenery scattered around the office world):
  //    - prop_desk: Cubicle desk with glowing dual monitors, keyboard, mug & chair
  //    - prop_plant: Lush potted office fern in a terracotta planter
  //    - prop_cooler: Blue bottled watercooler with paper cups
  //    - prop_copier: Office printer/copier with paper tray & green ready light
  // =========================================================================
  makeCanvasTex(scene, "prop_desk", 96, 68, (ctx) => {
    // Drop shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)"; rrect(ctx, 6, 10, 86, 54, 8); ctx.fill();
    // Rolling ergonomic chair behind desk
    ctx.fillStyle = "#16192b"; ctx.beginPath(); ctx.arc(48, 54, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2d3559"; rrect(ctx, 36, 44, 24, 14, 6); ctx.fill();
    ctx.fillStyle = "#414d80"; rrect(ctx, 38, 52, 20, 7, 4); ctx.fill();
    // Cubicle partition wall (top edge)
    ctx.fillStyle = "#1a2038"; rrect(ctx, 4, 4, 88, 12, 3); ctx.fill();
    ctx.fillStyle = "#3d4a75"; rrect(ctx, 6, 6, 84, 8, 2); ctx.fill();
    // Warm oak desk surface with bevel
    ctx.fillStyle = "#2b1c12"; rrect(ctx, 6, 14, 84, 34, 4); ctx.fill();
    const oakG = ctx.createLinearGradient(8, 15, 88, 46);
    oakG.addColorStop(0, "#b8824c"); oakG.addColorStop(0.5, "#966536"); oakG.addColorStop(1, "#6e4722");
    ctx.fillStyle = oakG; rrect(ctx, 8, 16, 80, 30, 3); ctx.fill();
    // Dual widescreen monitors with blue spreadsheet glow
    [[16, 12], [50, 12]].forEach(([mx, my]) => {
      ctx.fillStyle = "#121524"; rrect(ctx, mx, my, 28, 16, 2); ctx.fill();
      const scr = ctx.createLinearGradient(mx, my, mx + 26, my + 14);
      scr.addColorStop(0, "#7ce0ff"); scr.addColorStop(1, "#2978b8");
      ctx.fillStyle = scr; ctx.fillRect(mx + 2, my + 2, 24, 11);
      // Tiny spreadsheet bars on screen
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillRect(mx + 4, my + 4, 12, 2); ctx.fillRect(mx + 4, my + 8, 18, 2);
      // Monitor stand
      ctx.fillStyle = "#252b45"; ctx.fillRect(mx + 11, my + 15, 6, 4);
    });
    // Keyboard & mouse
    ctx.fillStyle = "#232840"; rrect(ctx, 32, 33, 24, 8, 2); ctx.fill();
    ctx.fillStyle = "#5c6894";
    for (let kx = 34; kx < 54; kx += 3) { ctx.fillRect(kx, 35, 2, 1.5); ctx.fillRect(kx, 38, 2, 1.5); }
    ctx.fillStyle = "#232840"; rrect(ctx, 60, 34, 5, 7, 2); ctx.fill();
    // Desk lamp glow & yellow pad
    ctx.fillStyle = "#f5e378"; ctx.fillRect(12, 32, 11, 12);
    ctx.fillStyle = "rgba(124, 224, 255, 0.14)";
    ctx.beginPath(); ctx.arc(46, 28, 34, 0, Math.PI * 2); ctx.fill();
  });

  makeCanvasTex(scene, "prop_plant", 48, 52, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath(); ctx.ellipse(24, 45, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Terracotta pot with rim
    const potG = ctx.createLinearGradient(12, 28, 36, 46);
    potG.addColorStop(0, "#e07a4f"); potG.addColorStop(0.6, "#b3522b"); potG.addColorStop(1, "#6e2e14");
    ctx.fillStyle = "#2b1106"; rrect(ctx, 12, 28, 24, 18, 3); ctx.fill();
    ctx.fillStyle = potG; rrect(ctx, 13, 29, 22, 16, 2); ctx.fill();
    ctx.fillStyle = "#d96b3f"; rrect(ctx, 10, 26, 28, 5, 2); ctx.fill();
    // Lush layered monstera/fern leaves
    const leaves = [
      [24, 24, -14, 8, 6, "#245932"], [24, 24, 14, 8, 6, "#245932"],
      [24, 22, -10, 18, 7, "#368549"], [24, 22, 11, 18, 7, "#368549"],
      [24, 20, -4, 6, 7, "#52bf6a"], [24, 20, 6, 7, 7, "#52bf6a"],
      [24, 16, 0, 12, 6, "#7be691"]
    ];
    leaves.forEach(([cx, cy, dx, dy, rad, col]) => {
      ctx.fillStyle = "#112b18";
      ctx.beginPath(); ctx.arc(cx + dx, dy, rad + 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(cx + dx, dy, rad, 0, Math.PI * 2); ctx.fill();
    });
  });

  makeCanvasTex(scene, "prop_cooler", 40, 60, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath(); ctx.ellipse(20, 55, 13, 4, 0, 0, Math.PI * 2); ctx.fill();
    // White dispenser cabinet
    ctx.fillStyle = "#182036"; rrect(ctx, 9, 24, 22, 31, 3); ctx.fill();
    const cabG = ctx.createLinearGradient(10, 25, 30, 54);
    cabG.addColorStop(0, "#ffffff"); cabG.addColorStop(0.7, "#cfd8eb"); cabG.addColorStop(1, "#8f9bb8");
    ctx.fillStyle = cabG; rrect(ctx, 10, 25, 20, 29, 2); ctx.fill();
    // Recessed tap niche + red (hot) and blue (cold) spigots
    ctx.fillStyle = "#28324e"; rrect(ctx, 13, 30, 14, 10, 2); ctx.fill();
    ctx.fillStyle = "#ff4255"; ctx.fillRect(15, 32, 3, 4);
    ctx.fillStyle = "#42a8f5"; ctx.fillRect(22, 32, 3, 4);
    // Translucent 5-gallon water jug on top with air bubble & water line
    ctx.fillStyle = "#10375c"; rrect(ctx, 11, 4, 18, 21, 5); ctx.fill();
    const jugG = ctx.createLinearGradient(12, 5, 28, 24);
    jugG.addColorStop(0, "#b8f2ff"); jugG.addColorStop(0.45, "#4cb8f5"); jugG.addColorStop(1, "#1e6bb8");
    ctx.fillStyle = jugG; rrect(ctx, 12, 5, 16, 19, 4); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillRect(14, 7, 3, 14);
    ctx.beginPath(); ctx.arc(22, 9, 2, 0, Math.PI * 2); ctx.fill();
  });

  // =========================================================================
  // 3. PLAYER ("You", 48x52): Detailed 16-bit character — expressive face,
  //    3D hair locks + silver temples, tortoiseshell/metal glasses, jacket over
  //    dress shirt, red tie, ID lanyard badge, and steaming mug!
  // =========================================================================
  makeCanvasTex(scene, "player", 48, 52, (ctx) => {
    // Ground shadow
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.beginPath(); ctx.ellipse(23, 47, 15, 4.5, 0, 0, Math.PI * 2); ctx.fill();

    // Boots / Comfortable Sneakers (white sole + navy suede)
    ctx.fillStyle = "#0e111f";
    rrect(ctx, 12, 41, 10, 6, 3); ctx.fill();
    rrect(ctx, 24, 41, 10, 6, 3); ctx.fill();
    ctx.fillStyle = "#e8edf7";
    ctx.fillRect(13, 45, 8, 2); ctx.fillRect(25, 45, 8, 2);
    ctx.fillStyle = "#3b4d7a";
    ctx.fillRect(13, 42, 7, 3); ctx.fillRect(25, 42, 7, 3);

    // Chinos / Slacks with center crease
    ctx.fillStyle = "#14192b";
    ctx.fillRect(13, 32, 9, 10); ctx.fillRect(24, 32, 9, 10);
    const pantG = ctx.createLinearGradient(13, 32, 33, 42);
    pantG.addColorStop(0, "#3b4b75"); pantG.addColorStop(1, "#222c4a");
    ctx.fillStyle = pantG;
    ctx.fillRect(14, 32, 7, 9); ctx.fillRect(25, 32, 7, 9);

    // Blazer / Cardigan + Dress Shirt + Red Tie + Office ID Badge
    ctx.fillStyle = "#0e1221";
    rrect(ctx, 9, 19, 28, 15, 5); ctx.fill();
    // White dress shirt center
    const shG = ctx.createLinearGradient(16, 20, 30, 33);
    shG.addColorStop(0, "#ffffff"); shG.addColorStop(1, "#c5d0e6");
    ctx.fillStyle = shG;
    rrect(ctx, 15, 20, 16, 13, 2); ctx.fill();
    // Open charcoal-blue blazer sides
    const blzG = ctx.createLinearGradient(10, 20, 36, 34);
    blzG.addColorStop(0, "#3d4c73"); blzG.addColorStop(1, "#1f2740");
    ctx.fillStyle = blzG;
    rrect(ctx, 10, 20, 7, 13, 3); ctx.fill();
    rrect(ctx, 29, 20, 7, 13, 3); ctx.fill();
    // Red silk tie with knot
    ctx.fillStyle = "#801520";
    ctx.beginPath(); ctx.moveTo(21, 20); ctx.lineTo(25, 20); ctx.lineTo(26, 30); ctx.lineTo(23, 33); ctx.lineTo(20, 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f03e4f";
    ctx.fillRect(22, 21, 2, 9);
    // Clip-on Employee ID Badge on left lapel
    ctx.fillStyle = "#ffffff"; ctx.fillRect(11, 25, 4, 5);
    ctx.fillStyle = "#42a8f5"; ctx.fillRect(12, 26, 2, 2);
    // Belt & gold buckle
    ctx.fillStyle = "#181c2e"; ctx.fillRect(12, 32, 22, 2);
    ctx.fillStyle = "#f5c542"; ctx.fillRect(21, 32, 4, 2);

    // Left arm & hand
    ctx.fillStyle = "#2d3959"; rrect(ctx, 6, 21, 5, 10, 2.5); ctx.fill();
    ctx.fillStyle = "#f2be96"; ctx.beginPath(); ctx.arc(8.5, 31, 2.6, 0, Math.PI * 2); ctx.fill();

    // Right arm & Steaming "#1 DAD" Orange Coffee Mug
    ctx.fillStyle = "#2d3959"; rrect(ctx, 35, 21, 5, 8, 2.5); ctx.fill();
    ctx.fillStyle = "#f2be96"; ctx.beginPath(); ctx.arc(37.5, 28, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#121524"; rrect(ctx, 35, 21, 11, 12, 2.5); ctx.fill();
    const mugG = ctx.createLinearGradient(36, 22, 45, 32);
    mugG.addColorStop(0, "#ffb566"); mugG.addColorStop(0.5, "#f08526"); mugG.addColorStop(1, "#9e4b0a");
    ctx.fillStyle = mugG; rrect(ctx, 36, 22, 9, 10, 2); ctx.fill();
    ctx.fillStyle = "#3b1c06"; ctx.fillRect(37, 22, 7, 2); // dark roast rim
    ctx.fillStyle = "#ffffff"; ctx.fillRect(37, 25, 2, 5); // gloss highlight
    ctx.strokeStyle = "#f08526"; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(45, 27, 2.5, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    // Curling steam wisps
    ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(39, 19); ctx.quadraticCurveTo(37, 16, 40, 13);
    ctx.moveTo(43, 19); ctx.quadraticCurveTo(41, 16, 44, 13);
    ctx.stroke();

    // Head with warm 16-bit portrait shading, ears & jawline
    ctx.fillStyle = "#0e1221";
    rrect(ctx, 11, 3, 24, 18, 7); ctx.fill();
    // Ears
    ctx.fillStyle = "#d99b72";
    ctx.beginPath(); ctx.arc(11, 13, 2.5, 0, Math.PI * 2); ctx.arc(35, 13, 2.5, 0, Math.PI * 2); ctx.fill();
    const faceG = ctx.createRadialGradient(21, 10, 2, 23, 12, 13);
    faceG.addColorStop(0, "#ffe4c9"); faceG.addColorStop(0.65, "#f2bc94"); faceG.addColorStop(1, "#c4835a");
    ctx.fillStyle = faceG;
    rrect(ctx, 12, 4, 22, 16, 6); ctx.fill();

    // Layered Hair with volume & distinguished silver-gray temples
    ctx.fillStyle = "#1f140d";
    rrect(ctx, 11, 2, 24, 8, 5); ctx.fill();
    const hairG = ctx.createLinearGradient(12, 2, 34, 9);
    hairG.addColorStop(0, "#664631"); hairG.addColorStop(0.5, "#422c1e"); hairG.addColorStop(1, "#291a11");
    ctx.fillStyle = hairG;
    rrect(ctx, 12, 3, 22, 6, 4); ctx.fill();
    // Swooping front hair lock
    ctx.beginPath(); ctx.moveTo(15, 8); ctx.quadraticCurveTo(23, 11, 31, 8); ctx.fill();
    // Silver-gray midlife sideburns/temples
    ctx.fillStyle = "#dce5f5";
    ctx.fillRect(11, 7, 3, 5); ctx.fillRect(32, 7, 3, 5);

    // Expressive eyebrows
    ctx.fillStyle = "#2b1c12";
    ctx.fillRect(15, 9, 6, 1.5); ctx.fillRect(25, 9, 6, 1.5);

    // Detailed Glasses (dark frames, gold bridge, cyan anti-glare reflection, pupils)
    ctx.fillStyle = "#141829";
    rrect(ctx, 13, 10, 9, 6, 1.5); ctx.fill();
    rrect(ctx, 24, 10, 9, 6, 1.5); ctx.fill();
    ctx.fillStyle = "#f5c542"; ctx.fillRect(22, 12, 2, 1.5); // gold nose bridge
    ctx.fillStyle = "#8cd6ff";
    ctx.fillRect(14, 11, 7, 4); ctx.fillRect(25, 11, 7, 4);
    ctx.fillStyle = "#141829"; // pupils
    ctx.fillRect(18, 12, 2.2, 2.5); ctx.fillRect(29, 12, 2.2, 2.5);
    ctx.fillStyle = "#ffffff"; // eye catchlights
    ctx.fillRect(14.5, 11.2, 2.5, 1.2); ctx.fillRect(25.5, 11.2, 2.5, 1.2);

    // 5-o'clock shadow stubble & determined half-smile
    ctx.fillStyle = "rgba(65, 50, 48, 0.25)";
    rrect(ctx, 14, 15.5, 18, 4, 2); ctx.fill();
    ctx.fillStyle = "#7a3b2e";
    ctx.fillRect(19, 17, 8, 1.5);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(20, 17, 5, 1);
  });

  // =========================================================================
  // 4. ENEMIES & BOSSES (with higher detail, character faces/icons & 16-bit polish)
  // =========================================================================
  // BILL ($): 36x26 Winged Dollar-Bill Monster with shifty eyes & gold seal
  makeCanvasTex(scene, "bill", 36, 26, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.35)"; rrect(ctx, 3, 5, 30, 19, 3); ctx.fill();
    ctx.fillStyle = "#112b16"; rrect(ctx, 2, 3, 30, 19, 3); ctx.fill();
    const g = ctx.createLinearGradient(3, 4, 31, 21);
    g.addColorStop(0, "#b2f5b5"); g.addColorStop(0.5, "#5ec264"); g.addColorStop(1, "#2d6e32");
    ctx.fillStyle = g; rrect(ctx, 3, 4, 28, 17, 2); ctx.fill();
    ctx.strokeStyle = "#1b4a20"; ctx.lineWidth = 1.5; ctx.strokeRect(5, 6, 24, 13);
    // Serial-number lines & corner numerals
    ctx.fillStyle = "#1b4a20";
    ctx.fillRect(6, 7, 3, 2); ctx.fillRect(25, 7, 3, 2);
    ctx.fillRect(6, 16, 3, 2); ctx.fillRect(25, 16, 3, 2);
    // Center portrait oval with "$" and mischievous eyes
    ctx.fillStyle = "#245929";
    ctx.beginPath(); ctx.ellipse(17, 12.5, 6, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f2fff2";
    ctx.font = "bold 11px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("$", 17, 13);
  });

  // LATE FEE (FEE): 30x24 Angry Crimson "FINAL NOTICE" Envelope with wax seal & fangs
  makeCanvasTex(scene, "lateFee", 30, 24, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.35)"; rrect(ctx, 3, 4, 24, 18, 2); ctx.fill();
    ctx.fillStyle = "#36080d"; rrect(ctx, 2, 2, 24, 18, 2); ctx.fill();
    const g = ctx.createLinearGradient(3, 3, 25, 19);
    g.addColorStop(0, "#ff8a82"); g.addColorStop(0.5, "#e63e35"); g.addColorStop(1, "#8c140e");
    ctx.fillStyle = g; rrect(ctx, 3, 3, 22, 16, 2); ctx.fill();
    // Envelope V-flap
    ctx.strokeStyle = "#4d0b08"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(3, 4); ctx.lineTo(14, 12); ctx.lineTo(25, 4); ctx.stroke();
    // Angry glowing yellow eyes under the flap
    ctx.fillStyle = "#ffe042";
    ctx.beginPath(); ctx.moveTo(7, 9); ctx.lineTo(11, 11); ctx.lineTo(7, 12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(21, 9); ctx.lineTo(17, 11); ctx.lineTo(21, 12); ctx.fill();
    // Gold "!" seal
    ctx.fillStyle = "#ffe042"; ctx.beginPath(); ctx.arc(14, 14, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#36080d"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("!", 14, 14.5);
  });

  // SPAM LIKELY (TEL): 30x36 Vibrating Smartphone with Caller-ID Skull/Alert & Ring Waves
  makeCanvasTex(scene, "spamCall", 30, 36, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.38)"; rrect(ctx, 5, 5, 20, 29, 4); ctx.fill();
    // Vibrating sound-wave arcs on sides
    ctx.strokeStyle = "#d99bff"; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(5, 16, 3, Math.PI * 0.7, Math.PI * 1.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(25, 16, 3, -Math.PI * 0.3, Math.PI * 0.3); ctx.stroke();
    // Metallic phone casing
    ctx.fillStyle = "#170c29"; rrect(ctx, 5, 3, 20, 29, 4); ctx.fill();
    const bodyG = ctx.createLinearGradient(6, 4, 24, 31);
    bodyG.addColorStop(0, "#dfb3ff"); bodyG.addColorStop(0.5, "#9652e0"); bodyG.addColorStop(1, "#451b78");
    ctx.fillStyle = bodyG; rrect(ctx, 6, 4, 18, 27, 3); ctx.fill();
    // Illuminated OLED screen
    ctx.fillStyle = "#120824"; rrect(ctx, 7.5, 7, 15, 20, 1.5); ctx.fill();
    // Red pulsing caller alert + handset icon
    ctx.fillStyle = "#ff384c"; ctx.beginPath(); ctx.arc(15, 14, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("?", 15, 14.5);
    // Accept / Decline buttons
    ctx.fillStyle = "#4ce668"; ctx.beginPath(); ctx.arc(11, 23, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff384c"; ctx.beginPath(); ctx.arc(19, 23, 2, 0, Math.PI * 2); ctx.fill();
    // Specular screen reflection
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath(); ctx.moveTo(8, 8); ctx.lineTo(15, 8); ctx.lineTo(8, 16); ctx.closePath(); ctx.fill();
  });

  // LATE-NIGHT DONUT (YUM): 34x34 Glossy Bakery Donut with Wavy Icing Drips & Sprinkles
  makeCanvasTex(scene, "snackAttack", 34, 34, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath(); ctx.arc(18, 19, 13.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#3d2006";
    ctx.beginPath(); ctx.arc(17, 17, 14, 0, Math.PI * 2); ctx.fill();
    const doughG = ctx.createRadialGradient(13, 12, 3, 17, 17, 14);
    doughG.addColorStop(0, "#ffe0a3"); doughG.addColorStop(0.65, "#d98f38"); doughG.addColorStop(1, "#804c12");
    ctx.fillStyle = doughG;
    ctx.beginPath(); ctx.arc(17, 17, 13, 0, Math.PI * 2); ctx.fill();
    // Scalloped pink icing
    const iceG = ctx.createRadialGradient(13, 12, 2, 17, 17, 12);
    iceG.addColorStop(0, "#ffc7e5"); iceG.addColorStop(0.55, "#f257a6"); iceG.addColorStop(1, "#9e1e60");
    ctx.fillStyle = iceG;
    ctx.beginPath(); ctx.arc(17, 16.5, 11, 0, Math.PI * 2); ctx.fill();
    // Punch center hole
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(17, 17, 4.2, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "#4d2808"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(17, 17, 4.5, 0, Math.PI * 2); ctx.stroke();
    // Gloss arc + multi-angle rainbow sprinkles
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(17, 17, 8.5, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
    [[10, 10, 0.3, "#ffe042"], [21, 9, -0.4, "#5ce8ff"], [24, 16, 0.2, "#ffffff"],
     [10, 21, -0.3, "#6bff7a"], [21, 22, 0.5, "#ffe042"], [16, 8, 0, "#ff99c8"], [8, 15, 0.6, "#5ce8ff"]].forEach(([x, y, a, c]) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      ctx.fillStyle = c; rrect(ctx, -2, -1, 4, 2, 1); ctx.fill();
      ctx.restore();
    });
  });

  // BACK TWINGE (OUCH): 32x32 Crackling Nerve-Pain Burst with Lightning Spikes
  makeCanvasTex(scene, "backTwinge", 32, 32, (ctx) => {
    const glow = ctx.createRadialGradient(16, 16, 2, 16, 16, 15);
    glow.addColorStop(0, "rgba(255,230,80,0.7)"); glow.addColorStop(1, "rgba(255,80,0,0)");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(16, 16, 15, 0, Math.PI * 2); ctx.fill();
    // 8-point jagged pain star + lightning bolt center
    ctx.fillStyle = "#591800";
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? 14 : 6;
      const a = (i * Math.PI) / 8;
      ctx[i === 0 ? "moveTo" : "lineTo"](16 + Math.cos(a) * r, 16 + Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
    const starG = ctx.createRadialGradient(16, 16, 1, 16, 16, 13);
    starG.addColorStop(0, "#ffffff"); starG.addColorStop(0.45, "#ffe842"); starG.addColorStop(1, "#ff4800");
    ctx.fillStyle = starG;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? 12.5 : 5;
      const a = (i * Math.PI) / 8;
      ctx[i === 0 ? "moveTo" : "lineTo"](16 + Math.cos(a) * r, 16 + Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
  });

  // REPLY-ALL CHAIN (CC: Elite): 42x34 Overflowing Corporate Inbox Stack with "99+" Badge
  makeCanvasTex(scene, "officeGossip", 42, 34, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.4)"; rrect(ctx, 4, 8, 35, 24, 3); ctx.fill();
    // 3 cascading envelopes
    [[2, 8, "#255380"], [4, 6, "#3b78b0"], [7, 4, "#ffffff"]].forEach(([ex, ey, tint], idx) => {
      ctx.fillStyle = "#0e2238"; rrect(ctx, ex, ey, 29, 20, 3); ctx.fill();
      const eg = ctx.createLinearGradient(ex, ey, ex + 28, ey + 19);
      eg.addColorStop(0, idx === 2 ? "#ffffff" : "#b3d9ff");
      eg.addColorStop(1, idx === 2 ? "#8cc4ff" : tint);
      ctx.fillStyle = eg; rrect(ctx, ex + 1, ey + 1, 27, 18, 2); ctx.fill();
      ctx.strokeStyle = "#1d4975"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ex + 1, ey + 2); ctx.lineTo(ex + 14.5, ey + 12); ctx.lineTo(ex + 28, ey + 2); ctx.stroke();
    });
    // Glowing red "99+" badge
    ctx.fillStyle = "#3b070e"; ctx.beginPath(); ctx.arc(34, 8, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff2e44"; ctx.beginPath(); ctx.arc(34, 8, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("99+", 34, 8.5);
  });

  // BOSS 1, 2, 3, SPLASH, GEM, CHEST (keep crisp 16-bit polish)
  makeCanvasTex(scene, "performanceReview", 64, 68, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.45)"; rrect(ctx, 8, 9, 50, 56, 6); ctx.fill();
    ctx.fillStyle = "#24060c"; rrect(ctx, 6, 6, 52, 56, 6); ctx.fill();
    const boardG = ctx.createLinearGradient(8, 8, 56, 60);
    boardG.addColorStop(0, "#f0667d"); boardG.addColorStop(0.5, "#bd2843"); boardG.addColorStop(1, "#660e20");
    ctx.fillStyle = boardG; rrect(ctx, 8, 8, 48, 52, 5); ctx.fill();
    ctx.strokeStyle = "#f5c542"; ctx.lineWidth = 2.2; ctx.strokeRect(9.5, 9.5, 45, 49);
    // White evaluation form with grid lines
    ctx.fillStyle = "#faf5f7"; rrect(ctx, 13, 15, 38, 40, 2); ctx.fill();
    ctx.fillStyle = "#d9c5cc";
    for (let y = 20; y < 52; y += 6) ctx.fillRect(16, y, 32, 1);
    // Gold clip
    const clipG = ctx.createLinearGradient(20, 2, 44, 14);
    clipG.addColorStop(0, "#fff2a6"); clipG.addColorStop(0.5, "#f5c542"); clipG.addColorStop(1, "#8c650e");
    ctx.fillStyle = clipG; rrect(ctx, 20, 2, 24, 11, 3); ctx.fill();
    // Fierce HR glare + plunging red bar chart + big "F" stamp
    ctx.fillStyle = "#24060c";
    ctx.fillRect(19, 23, 7, 5); ctx.fillRect(38, 23, 7, 5);
    ctx.fillStyle = "#ff2e44";
    ctx.fillRect(21, 24, 3, 3); ctx.fillRect(40, 24, 3, 3);
    ctx.strokeStyle = "#8c1127"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(17, 19); ctx.lineTo(27, 23); ctx.moveTo(47, 19); ctx.lineTo(37, 23); ctx.stroke();
    // Plunging chart bars
    [[18, 36, 12, "#5ec264"], [26, 40, 8, "#f5c542"], [34, 44, 4, "#ff384c"], [42, 46, 2, "#ff384c"]].forEach(([bx, by, bh, c]) => {
      ctx.fillStyle = c; ctx.fillRect(bx, by, 5, bh);
    });
  });

  makeCanvasTex(scene, "mortgageRefinance", 68, 68, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.45)"; rrect(ctx, 6, 14, 58, 52, 4); ctx.fill();
    ctx.fillStyle = "#1c0e36"; ctx.fillRect(8, 24, 52, 36);
    // 4 Fluted Marble Columns
    [10, 23, 37, 50].forEach(px => {
      const pilG = ctx.createLinearGradient(px, 24, px + 8, 24);
      pilG.addColorStop(0, "#ffffff"); pilG.addColorStop(0.5, "#cbb8f0"); pilG.addColorStop(1, "#634799");
      ctx.fillStyle = pilG; ctx.fillRect(px, 25, 8, 33);
      ctx.fillStyle = "#f5c542"; ctx.fillRect(px - 1, 24, 10, 3); ctx.fillRect(px - 1, 56, 10, 3);
    });
    // Pediment roof
    ctx.fillStyle = "#140929";
    ctx.beginPath(); ctx.moveTo(3, 25); ctx.lineTo(34, 3); ctx.lineTo(65, 25); ctx.closePath(); ctx.fill();
    const roofG = ctx.createLinearGradient(6, 5, 62, 24);
    roofG.addColorStop(0, "#a882f2"); roofG.addColorStop(1, "#492c85");
    ctx.fillStyle = roofG;
    ctx.beginPath(); ctx.moveTo(6, 24); ctx.lineTo(34, 5); ctx.lineTo(62, 24); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#f5c542"; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.fillStyle = "#ffe066"; ctx.font = "bold 11px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("APR", 34, 17);
    ctx.fillStyle = "#8c73bf"; ctx.fillRect(6, 58, 56, 4);
    ctx.fillStyle = "#f5c542"; ctx.fillRect(4, 62, 60, 3);
  });

  makeCanvasTex(scene, "midlifeCrisis", 72, 50, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath(); ctx.ellipse(36, 43, 32, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    // Tan leather bucket seats + windshield
    ctx.fillStyle = "#b8743b"; rrect(ctx, 32, 9, 10, 10, 3); ctx.fill();
    const winG = ctx.createLinearGradient(18, 6, 38, 19);
    winG.addColorStop(0, "#e6f9ff"); winG.addColorStop(0.5, "#6bc2f0"); winG.addColorStop(1, "#1e4b6e");
    ctx.fillStyle = winG;
    ctx.beginPath(); ctx.moveTo(18, 19); ctx.lineTo(26, 7); ctx.lineTo(36, 7); ctx.lineTo(38, 19); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#141829"; ctx.lineWidth = 2; ctx.stroke();
    // Aerodynamic sports car body + rear spoiler wing
    ctx.fillStyle = "#2b0309";
    ctx.beginPath(); ctx.moveTo(58, 16); ctx.lineTo(68, 10); ctx.lineTo(70, 14); ctx.lineTo(62, 18); ctx.fill();
    rrect(ctx, 2, 16, 66, 21, 7); ctx.fill();
    const carG = ctx.createLinearGradient(4, 17, 66, 36);
    carG.addColorStop(0, "#ff8593"); carG.addColorStop(0.35, "#ff1e38"); carG.addColorStop(0.8, "#ad071b"); carG.addColorStop(1, "#59000a");
    ctx.fillStyle = carG; rrect(ctx, 4, 17, 62, 19, 6); ctx.fill();
    // Twin gold racing stripes + headlight beam
    ctx.fillStyle = "#ffe042"; ctx.fillRect(5, 24, 60, 2.5); ctx.fillRect(5, 28, 60, 1.5);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(9, 19, 25, 1.5);
    ctx.fillStyle = "#fff799"; rrect(ctx, 4, 20, 5, 6, 1.5); ctx.fill();
    // Alloy wheels with red brake calipers
    [18, 54].forEach(wx => {
      ctx.fillStyle = "#10121c"; ctx.beginPath(); ctx.arc(wx, 37, 8.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ff1e38"; ctx.beginPath(); ctx.arc(wx + 2, 36, 5, 0, Math.PI); ctx.fill();
      ctx.fillStyle = "#d8e0f0"; ctx.beginPath(); ctx.arc(wx, 37, 4.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f5c542"; ctx.beginPath(); ctx.arc(wx, 37, 2, 0, Math.PI * 2); ctx.fill();
    });
  });

  makeCanvasTex(scene, "splash", 18, 18, (ctx) => {
    ctx.fillStyle = "#261207"; ctx.beginPath(); ctx.arc(9, 9, 7, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(7, 6, 1, 9, 9, 6.5);
    g.addColorStop(0, "#f5be8a"); g.addColorStop(0.5, "#8c522b"); g.addColorStop(1, "#42200a");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(9, 9, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(7, 6.5, 1.6, 0, Math.PI * 2); ctx.fill();
  });

  makeCanvasTex(scene, "gem", 20, 20, (ctx) => {
    ctx.fillStyle = "#0a223b";
    ctx.beginPath(); ctx.moveTo(10, 1); ctx.lineTo(19, 10); ctx.lineTo(10, 19); ctx.lineTo(1, 10); ctx.closePath(); ctx.fill();
    const g = ctx.createLinearGradient(2, 2, 18, 18);
    g.addColorStop(0, "#c4f5ff"); g.addColorStop(0.5, "#3da5f5"); g.addColorStop(1, "#164b8a");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(10, 2.5); ctx.lineTo(17.5, 10); ctx.lineTo(10, 17.5); ctx.lineTo(2.5, 10); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ebfcff";
    ctx.beginPath(); ctx.moveTo(10, 5.5); ctx.lineTo(14, 10); ctx.lineTo(10, 14.5); ctx.lineTo(6, 10); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.fillRect(7, 5, 2.5, 2.5);
  });

  makeCanvasTex(scene, "chest", 34, 30, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.42)"; rrect(ctx, 2, 6, 30, 23, 4); ctx.fill();
    ctx.fillStyle = "#241206"; rrect(ctx, 2, 3, 30, 23, 4); ctx.fill();
    const woodG = ctx.createLinearGradient(4, 5, 30, 25);
    woodG.addColorStop(0, "#c2732d"); woodG.addColorStop(0.5, "#804312"); woodG.addColorStop(1, "#452005");
    ctx.fillStyle = woodG; rrect(ctx, 3, 4, 28, 21, 3); ctx.fill();
    const goldG = ctx.createLinearGradient(3, 4, 31, 25);
    goldG.addColorStop(0, "#fff2a6"); goldG.addColorStop(0.5, "#f5bd26"); goldG.addColorStop(1, "#996b0a");
    ctx.fillStyle = goldG;
    ctx.fillRect(3, 4, 28, 3.5); ctx.fillRect(3, 13, 28, 3.5);
    ctx.fillRect(6, 4, 4, 21); ctx.fillRect(24, 4, 4, 21);
    rrect(ctx, 13, 11, 8, 8, 2); ctx.fill();
    ctx.fillStyle = "#241206";
    ctx.beginPath(); ctx.arc(17, 14, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(16.2, 14, 1.6, 3.5);
  });

  // 15. FATHER TIME / THE REAPER AT AGE 50: Hooded 16-bit figure with golden hourglass & scythe!
  makeCanvasTex(scene, "theReaper", 68, 68, (ctx) => {
    ctx.fillStyle = "rgba(245, 197, 66, 0.22)";
    ctx.beginPath(); ctx.arc(34, 34, 30, 0, Math.PI * 2); ctx.fill();
    // Curved silver scythe blade + wooden shaft
    ctx.strokeStyle = "#8c6230"; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(52, 12); ctx.lineTo(44, 60); ctx.stroke();
    const bladeG = ctx.createLinearGradient(16, 6, 54, 18);
    bladeG.addColorStop(0, "#ffffff"); bladeG.addColorStop(0.6, "#a8c4e0"); bladeG.addColorStop(1, "#4a6280");
    ctx.fillStyle = bladeG;
    ctx.beginPath(); ctx.moveTo(52, 14); ctx.quadraticCurveTo(26, 2, 12, 18); ctx.quadraticCurveTo(30, 12, 50, 20); ctx.closePath(); ctx.fill();
    // Dark velvet robe & hood
    ctx.fillStyle = "#0b0d17";
    ctx.beginPath(); ctx.moveTo(34, 10); ctx.lineTo(52, 58); ctx.lineTo(16, 58); ctx.closePath(); ctx.fill();
    const robeG = ctx.createLinearGradient(20, 12, 48, 58);
    robeG.addColorStop(0, "#3b2d54"); robeG.addColorStop(0.5, "#1f1730"); robeG.addColorStop(1, "#0d0917");
    ctx.fillStyle = robeG;
    ctx.beginPath(); ctx.moveTo(34, 12); ctx.lineTo(49, 56); ctx.lineTo(19, 56); ctx.closePath(); ctx.fill();
    // Gold trim & glowing eyes inside hood
    ctx.strokeStyle = "#f5c542"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(34, 12); ctx.lineTo(49, 56); ctx.lineTo(19, 56); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = "#08060d"; ctx.beginPath(); ctx.arc(34, 24, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffe042";
    ctx.fillRect(30, 23, 3, 2.5); ctx.fillRect(36, 23, 3, 2.5);
  });

  // 16. 401(k) GOLD COIN: Shiny 16-bit embossed retirement coin!
  makeCanvasTex(scene, "coin401k", 18, 18, (ctx) => {
    ctx.fillStyle = "#3b2504";
    ctx.beginPath(); ctx.arc(9, 9, 8, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(6, 6, 1, 9, 9, 7.5);
    g.addColorStop(0, "#fff8b8"); g.addColorStop(0.55, "#f5bd26"); g.addColorStop(1, "#996508");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(9, 9, 7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#b3770c"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(9, 9, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#593804"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("k", 9, 9.5);
  });

  // 17. RAISED MEZZANINE PLATFORM + STAIRS ("prop_platform", 220x150):
  //     Left side (x = 2..64): 6-step pixel-art staircase with brass stair nosings & handrails.
  //     Right side (x = 64..214): Raised VIP executive deck with cliff wall below & brass guardrails!
  makeCanvasTex(scene, "prop_platform", 220, 150, (ctx) => {
    // Deep drop shadow under raised platform & stairs
    ctx.fillStyle = "rgba(0,0,0,0.48)";
    rrect(ctx, 64, 14, 152, 132, 6); ctx.fill();
    rrect(ctx, 4, 34, 64, 90, 4); ctx.fill();

    // Front cliff wall of the raised deck (shows elevation thickness in 16-bit top-down view!)
    const wallG = ctx.createLinearGradient(64, 120, 64, 142);
    wallG.addColorStop(0, "#2c3559"); wallG.addColorStop(1, "#14192e");
    ctx.fillStyle = wallG;
    rrect(ctx, 62, 118, 150, 24, 4); ctx.fill();
    // Vertical architectural pillar ribs along the cliff face
    [72, 112, 152, 196].forEach(px => {
      ctx.fillStyle = "#3f4c7a"; ctx.fillRect(px, 120, 8, 21);
      ctx.fillStyle = "#f5c542"; ctx.fillRect(px - 1, 138, 10, 3);
    });

    // Raised Mezzanine Deck floor (x = 62..212, y = 10..124)
    ctx.fillStyle = "#181d33";
    rrect(ctx, 62, 10, 150, 114, 5); ctx.fill();
    const deckG = ctx.createLinearGradient(64, 12, 210, 122);
    deckG.addColorStop(0, "#384673"); deckG.addColorStop(0.5, "#2c375c"); deckG.addColorStop(1, "#222b4a");
    ctx.fillStyle = deckG;
    rrect(ctx, 64, 12, 146, 110, 4); ctx.fill();

    // Parquet tile grid & subtle VIP inlay on the raised deck
    ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1;
    for (let tx = 68; tx < 206; tx += 22) {
      for (let ty = 16; ty < 118; ty += 22) {
        ctx.strokeRect(tx + 0.5, ty + 0.5, 21, 21);
      }
    }
    ctx.strokeStyle = "rgba(245, 197, 66, 0.35)"; ctx.lineWidth = 2;
    ctx.strokeRect(76, 24, 122, 86);
    ctx.fillStyle = "rgba(245, 197, 66, 0.55)";
    ctx.font = "bold 10px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("MEZZANINE LV.2", 137, 67);

    // 6-Step Staircase on the Left (x = 4..64, y = 33..117) leading up to the deck!
    const stepW = 10, stairY = 33, stairH = 84;
    for (let i = 0; i < 6; i++) {
      const sx = 4 + i * stepW;
      const shade = 42 + i * 9;
      ctx.fillStyle = `rgb(${shade}, ${shade + 10}, ${shade + 34})`;
      ctx.fillRect(sx, stairY, stepW, stairH);
      // Brass non-slip stair nosing strip on each step edge
      ctx.fillStyle = "#d9a74a";
      ctx.fillRect(sx + stepW - 2, stairY + 2, 2, stairH - 4);
      // Step riser shadow
      ctx.fillStyle = "rgba(10, 13, 26, 0.65)";
      ctx.fillRect(sx, stairY, 1.5, stairH);
    }
    // "UP ▶" arrow on stairs
    ctx.fillStyle = "#ffe042";
    ctx.font = "bold 9px monospace";
    ctx.fillText("STAIRS ▶", 34, 75);

    // Stair handrails (top and bottom of the staircase)
    ctx.fillStyle = "#996b0a";
    ctx.fillRect(2, stairY - 4, 64, 5);
    ctx.fillRect(2, stairY + stairH - 1, 64, 5);
    ctx.fillStyle = "#ffe066";
    ctx.fillRect(3, stairY - 3, 62, 2);
    ctx.fillRect(3, stairY + stairH, 62, 2);

    // Brass Guardrails around the Top, Right, and Bottom edges of the raised deck
    // (Leaves the Left staircase opening at y = 33..117 open to walk through!)
    ctx.fillStyle = "#8c620a";
    ctx.fillRect(62, 8, 150, 6);    // Top rail
    ctx.fillRect(206, 8, 6, 118);   // Right rail
    ctx.fillRect(62, 120, 150, 6);  // Bottom rail
    ctx.fillRect(62, 8, 6, 26);     // Left-top corner post above stairs
    ctx.fillRect(62, 116, 6, 10);   // Left-bottom corner post below stairs
    ctx.fillStyle = "#ffe066";
    ctx.fillRect(64, 9, 146, 2.5);
    ctx.fillRect(207, 10, 2.5, 114);
    ctx.fillRect(64, 121, 146, 2.5);
  });

  // 18. LEFTOVER BREAKROOM PIZZA ("pizza", 24x24): Melty cheese slice with pepperoni & golden crust!
  makeCanvasTex(scene, "pizza", 24, 24, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath(); ctx.moveTo(4, 7); ctx.lineTo(20, 4); ctx.lineTo(13, 22); ctx.closePath(); ctx.fill();
    // Golden baked crust rim
    ctx.fillStyle = "#3d1e05";
    ctx.beginPath(); ctx.moveTo(2, 6); ctx.lineTo(20, 2); ctx.lineTo(12, 21); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#d98b38";
    ctx.beginPath(); ctx.moveTo(3, 6.5); ctx.lineTo(19, 3); ctx.lineTo(18, 6.5); ctx.lineTo(4, 9.5); ctx.closePath(); ctx.fill();
    // Melted mozzarella triangle
    const chG = ctx.createLinearGradient(5, 7, 14, 19);
    chG.addColorStop(0, "#fff085"); chG.addColorStop(1, "#f2b829");
    ctx.fillStyle = chG;
    ctx.beginPath(); ctx.moveTo(4.5, 8.5); ctx.lineTo(17.5, 5.5); ctx.lineTo(12, 19.5); ctx.closePath(); ctx.fill();
    // Crispy pepperoni slices
    [[9, 9.5], [14, 8.5], [11.5, 14]].forEach(([px, py]) => {
      ctx.fillStyle = "#80111a"; ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e63544"; ctx.beginPath(); ctx.arc(px - 0.3, py - 0.3, 1.9, 0, Math.PI * 2); ctx.fill();
    });
  });
}

// Spawn infinite-scrolling office scenery (cubicle desks, potted plants, watercoolers)
// as SOLID PHYSICAL BARRIERS that you and the Bills must navigate around, plus
// Raised Mezzanine Platforms with Stairs that change your elevation!
const STAGE_GRID = 420;
const PLAT_GRID = 760;
window.stagePlatforms = [];
window.smashedPlants = new Set();

function applyPropBodySize(p, k) {
  if (!p.body) return;
  if (k === "prop_desk") {
    p.body.setSize(76, 36).setOffset(10, 16);
  } else if (k === "prop_plant") {
    p.body.setSize(28, 24).setOffset(10, 22);
  } else {
    p.body.setSize(26, 28).setOffset(7, 24);
  }
}

function spawnStageProps(scene) {
  const props = [];
  window.smashedPlants = new Set();
  window.propGroup = scene.physics.add.group({ immovable: true, allowGravity: false });
  const kinds = ["prop_desk", "prop_plant", "prop_cooler", "prop_plant", "prop_desk"];
  for (let gx = -2; gx <= 2; gx++) {
    for (let gy = -2; gy <= 2; gy++) {
      const k = kinds[Math.abs(gx * 7 + gy * 13) % kinds.length];
      const s = window.propGroup.create(gx * STAGE_GRID + 140, gy * STAGE_GRID + 140, k).setDepth(2);
      s.setImmovable(true);
      // Furniture is placed by code, never moved by physics. Without this, the physics engine
      // re-applied every reposition a second time, so desks and plants teleported and flickered.
      s.body.moves = false;
      applyPropBodySize(s, k);
      s.gx = gx; s.gy = gy;
      props.push(s);
    }
  }

  // Spawn 9 Raised Mezzanine Platforms with Stairs (3x3 grid around camera)
  window.stagePlatforms = [];
  for (let px = -1; px <= 1; px++) {
    for (let py = -1; py <= 1; py++) {
      const plat = scene.add.image(px * PLAT_GRID + 260, py * PLAT_GRID - 180, "prop_platform").setDepth(1);
      window.stagePlatforms.push(plat);
    }
  }
  return props;
}

// Where the mezzanine platform for platform-cell (px, py) sits. Same answer every time.
function platformPos(px, py) {
  const ph = Math.abs(px * 2654435761 + py * 805459861) % 100;
  return { x: px * PLAT_GRID + 260 + ((ph % 50) - 25), y: py * PLAT_GRID - 160 + (((ph * 7) % 50) - 25) };
}

function nearAnyPlatform(wx, wy) {
  const pcx = Math.round(wx / PLAT_GRID), pcy = Math.round(wy / PLAT_GRID);
  for (let px = pcx - 1; px <= pcx + 1; px++) {
    for (let py = pcy - 1; py <= pcy + 1; py++) {
      const pl = platformPos(px, py);
      if (Math.abs(wx - pl.x) < 175 && Math.abs(wy - pl.y) < 130) return true;
    }
  }
  return false;
}

// Reposition scenery props & platforms onto whichever grid cells are currently around the camera.
function updateStageProps(scene, props) {
  if (!props) return;
  const cx = Math.round(player.x / STAGE_GRID), cy = Math.round(player.y / STAGE_GRID);
  const kinds = ["prop_desk", "prop_plant", "prop_cooler", "prop_plant", "prop_desk"];

  // First update Mezzanine Platforms on PLAT_GRID
  const pcx = Math.round(player.x / PLAT_GRID), pcy = Math.round(player.y / PLAT_GRID);
  let pIdx = 0;
  for (let px = pcx - 1; px <= pcx + 1; px++) {
    for (let py = pcy - 1; py <= pcy + 1; py++) {
      const plat = window.stagePlatforms[pIdx++];
      if (!plat) continue;
      const { x: wx, y: wy } = platformPos(px, py);
      plat.setPosition(wx, wy).setAlpha(window.viewModeIdx === 0 ? 1 : 0);
      plat.worldX = wx; plat.worldY = wy;
    }
  }

  // Next update Office Barrier Props (and keep them clear of Mezzanine Platforms!)
  let idx = 0;
  for (let gx = cx - 2; gx <= cx + 2; gx++) {
    for (let gy = cy - 2; gy <= cy + 2; gy++) {
      const p = props[idx++];
      if (!p) continue;
      const h = Math.abs(gx * 374761393 + gy * 668265263) % 100;
      const ox = ((h * 17) % 140) - 70, oy = ((h * 31) % 140) - 70;
      const wx = gx * STAGE_GRID + 180 + ox, wy = gy * STAGE_GRID + 180 + oy;
      const nearPlat = nearAnyPlatform(wx, wy);
      const cellKey = `${gx},${gy}`;
      if ((gx === 0 && gy === 0) || h < 34 || nearPlat || window.smashedPlants.has(cellKey)) {
        p.setVisible(false);
        if (p.body) p.body.enable = false;
      } else {
        const k = kinds[h % kinds.length];
        p.propKind = k;
        if (p.cellKey !== cellKey) {
          p.cellKey = cellKey;
          p.hp = k === "prop_plant" ? 2 : 9999; // Potted plants can be smashed in 2 hits for loot!
        }
        if (p.texture.key !== k) p.setTexture(k);
        p.setPosition(wx, wy).setVisible(true).setAlpha(window.viewModeIdx === 0 ? 1 : 0);
        if (p.body) {
          p.body.enable = true;
          applyPropBodySize(p, k);
          p.body.updateFromGameObject();
        }
      }
    }
  }

  // Update elevation & stair/guardrail physics for Player, Bills, Gems, Coins, and Splashes!
  updateElevationAndPlatforms(scene);
}

// Compute elevation (0 on floor, 0..42 on stairs, 42 on mezzanine deck) and enforce guardrail ledges!
function resolveEntityPlatform(ent, enforceWalls) {
  if (!ent || !ent.active) return;
  const prevElev = ent.elev || 0;
  let newElev = 0;

  for (let i = 0; i < window.stagePlatforms.length; i++) {
    const pl = window.stagePlatforms[i];
    if (!pl) continue;
    const rx = ent.x - pl.worldX; // -110 .. +110
    const ry = ent.y - pl.worldY; // -75  .. +75

    // Check if entity is within the platform + staircase bounding box
    if (rx >= -108 && rx <= 104 && ry >= -66 && ry <= 66) {
      if (rx < -46) {
        // Left side: 6-Step Staircase corridor (ry in -42 .. +42)
        if (ry >= -42 && ry <= 42) {
          const t = Phaser.Math.Clamp((rx + 108) / 62, 0, 1);
          newElev = Math.max(newElev, Math.round(t * 42));
        } else if (enforceWalls) {
          // Guardrail alongside the stairs
          ent.y = pl.worldY + (ry < 0 ? -43 : 43);
        }
      } else {
        // Right side: Raised Mezzanine Deck (rx in -46 .. +104, ry in -66 .. +66)
        if (!enforceWalls || prevElev >= 18) {
          // Already climbed the stairs (or is a projectile/pickup): on the high ground!
          newElev = 42;
          if (enforceWalls) {
            // Keep inside the top, bottom, and right brass guardrails!
            if (ry < -56) ent.y = pl.worldY - 56;
            if (ry >  56) ent.y = pl.worldY + 56;
            if (rx >  94) ent.x = pl.worldX + 94;
          }
        } else {
          // Ground-level entity walked into the outer cliff wall of the platform: block them!
          const dTop = Math.abs(ry - (-66));
          const dBot = Math.abs(ry - 66);
          const dRight = Math.abs(rx - 104);
          const dLeft = Math.abs(rx - (-46));
          const m = Math.min(dTop, dBot, dRight, dLeft);
          if (m === dTop) ent.y = pl.worldY - 67;
          else if (m === dBot) ent.y = pl.worldY + 67;
          else if (m === dRight) ent.x = pl.worldX + 105;
          else ent.x = pl.worldX - 47;
        }
      }
    }
  }
  ent.elev = newElev;
  // In 2D Retro Mode, give a subtle perspective scale lift when standing on the Mezzanine!
  if (window.viewModeIdx === 0 && enforceWalls) {
    ent.setScale(1 + newElev / 260);
  }
}

function updateElevationAndPlatforms(scene) {
  // Groups can be mid-teardown for one frame during a restart, so skip any that are already cleared.
  const kids = g => (g && g.children) ? g.getChildren() : [];
  if (player && player.active) resolveEntityPlatform(player, true);
  kids(bills).forEach(b => resolveEntityPlatform(b, true));
  kids(gems).forEach(g => resolveEntityPlatform(g, false));
  kids(coins).forEach(c => resolveEntityPlatform(c, false));
  kids(window.pizzas).forEach(pz => resolveEntityPlatform(pz, false));
  kids(chests).forEach(ch => resolveEntityPlatform(ch, false));
  kids(splashes).forEach(s => resolveEntityPlatform(s, false));
}
