// Live scenes (Nov 7 test): a still background plate plus small sprite strips that swap poses a few times a second.
// The plate holds every bit of lettering, so text never moves or warps. Sprites only move in whole pixels.
// scene.json: { w, h, fps, frames, plate, layers: [{ id, sheet, x, y, fw, fh, seq: [[pose, dx, dy] | null, ...] }] }
// Used by the title slideshow (TitleSlides in src/ui.js) for slides with live: <folder>. Test page: tools/live-scene.html.
window.LiveScene = (() => {
  function loadImg(src) {
    return new Promise((ok, bad) => { const im = new Image(); im.onload = () => ok(im); im.onerror = bad; im.src = src; });
  }
  async function create(canvas, base, opts = {}) {
    const v = window.BUILD ? "?v=" + window.BUILD : "";
    const S = await (await fetch(base + "scene.json" + v)).json();
    const [plate, ...sheets] = await Promise.all([loadImg(base + S.plate + v), ...S.layers.map(l => loadImg(base + l.sheet + v))]);
    canvas.width = S.w; canvas.height = S.h;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    let frame = 0, timer = null, last = null, stats = { draws: 0, ms: 0, px: 0 };
    // Where a layer sits on a given frame (null = hidden this frame).
    const rect = (L, n) => { const s = L.seq[n % L.seq.length]; return s ? { x: L.x + s[1], y: L.y + s[2], w: L.fw, h: L.fh, pose: s[0] } : null; };
    function drawFull(n) {
      ctx.drawImage(plate, 0, 0);
      S.layers.forEach((L, i) => { const r = rect(L, n); if (r) ctx.drawImage(sheets[i], r.pose * L.fw, 0, L.fw, L.fh, r.x, r.y, r.w, r.h); });
    }
    // Only repaint the boxes that change: old position + new position of each layer, then every layer that touches them.
    function drawDirty(n, prev) {
      const t0 = performance.now(), boxes = [];
      S.layers.forEach(L => { [rect(L, prev), rect(L, n)].forEach(r => r && boxes.push(r)); });
      if (!boxes.length) return;
      // Small scenes: one union box is simpler and still cheap. Repaint each box separately to keep the area small.
      ctx.save();
      ctx.beginPath(); boxes.forEach(b => ctx.rect(b.x - 1, b.y - 1, b.w + 2, b.h + 2)); ctx.clip();
      drawFull(n);
      ctx.restore();
      stats.draws++; stats.ms += performance.now() - t0; stats.px += S.layers.reduce((a, L) => { const r = rect(L, n); return a + (r ? r.w * r.h : 0); }, 0);
      if (opts.showBoxes) { ctx.strokeStyle = "#EF9347"; ctx.lineWidth = 2; boxes.forEach(b => ctx.strokeRect(b.x, b.y, b.w, b.h)); }
    }
    function tick() {
      const prev = frame; frame = (frame + 1) % S.frames;
      if (opts.showBoxes) { drawFull(frame); drawDirty(frame, frame); } // debug view: clean redraw so outlines don't pile up
      else drawDirty(frame, prev);
    }
    function play() {
      if (timer || opts.still) return;
      timer = setInterval(() => { if (!document.hidden) tick(); }, 1000 / S.fps);
    }
    function pause() { clearInterval(timer); timer = null; }
    drawFull(0);
    if (!opts.still) play();
    return {
      scene: S, play, pause,
      playing: () => !!timer,
      still(on) { opts.still = on; if (on) { pause(); frame = 0; drawFull(0); } else play(); },
      boxes(on) { opts.showBoxes = on; drawFull(frame); },
      stats: () => ({ ...stats, avgMs: stats.draws ? stats.ms / stats.draws : 0, avgPx: stats.draws ? stats.px / stats.draws : 0 })
    };
  }
  return { create };
})();
