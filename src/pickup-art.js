// Pickup and projectile art (ChatGPT, Nov 5): swaps the code-drawn pickups and weapon projectiles for real pixel art.
// Each sheet is 32x32 cells, row 0 = idle (row 1 = shine/motion, not used yet). The art is fit into the old texture's
// size, so hitboxes and every setScale() in the game stay exactly the same. A few projectiles get a roomier canvas.
window.PickupArt = (() => {
  const SHEETS = [
    { url: "assets/items/pickups-v1.png", keys: ["gem", "coin401k", "pizza"] },
    { url: "assets/items/pickups-v2.png", keys: ["salad", "chest", "splash"] },
    { url: "assets/weapons/projectiles-v1.png", keys: ["w_remote", "w_floppy", "w_cell", "w_pod", "w_snow"] }
  ];
  // Canvas sizes that change with the art (only plain images, never physics pickups)
  const SIZE = { w_remote: [24, 24], w_snow: [14, 14] };
  const cells = {}; // key -> { img, sx, sy, sw, sh } (sx..sh = the trimmed, non-transparent part of the idle cell)
  let scene = null;

  function trim(img, col) {
    const c = document.createElement("canvas"); c.width = 32; c.height = 32;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, col * 32, 0, 32, 32, 0, 0, 32, 32);
    const px = ctx.getImageData(0, 0, 32, 32).data;
    let x0 = 32, y0 = 32, x1 = -1, y1 = -1;
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if (px[(y * 32 + x) * 4 + 3] > 0) {
      if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y;
    }
    if (x1 < 0) return null;
    return { img, sx: col * 32 + x0, sy: y0, sw: x1 - x0 + 1, sh: y1 - y0 + 1 };
  }

  // Draw a key's art into a canvas context of size w x h (centered, aspect kept). Returns false if no art yet.
  function draw(key, ctx, w, h) {
    const a = cells[key]; if (!a) return false;
    const k = Math.min(w / a.sw, h / a.sh), dw = a.sw * k, dh = a.sh * k;
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(a.img, a.sx, a.sy, a.sw, a.sh, (w - dw) / 2, (h - dh) / 2, dw, dh);
    return true;
  }
  const size = (key, w, h) => SIZE[key] || [w, h];

  // Redraw a texture that was already built from code
  function repaint(key) {
    if (!scene || !scene.textures.exists(key)) return;
    const tex = scene.textures.get(key);
    if (!tex.getContext) return; // not a canvas texture
    const src = tex.getSourceImage();
    const [w, h] = size(key, src.width, src.height);
    if (w !== src.width || h !== src.height) tex.setSize(w, h);
    draw(key, tex.getContext(), w, h); tex.refresh();
  }

  function init(sc) {
    scene = sc;
    const v = window.BUILD ? "?v=" + window.BUILD : "";
    SHEETS.forEach(s => {
      const img = new Image();
      img.onload = () => {
        s.keys.forEach((key, col) => { const t = trim(img, col); if (t) { cells[key] = t; repaint(key); } });
      };
      img.src = s.url + v;
    });
  }
  return { init, draw, size, has: key => !!cells[key] };
})();
