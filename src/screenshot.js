// Screenshot button (Nov 9, Rami's playtest: "keybind a screenshot button on the controller").
// Y on a controller (or V on a keyboard) during a run saves what's on screen, with a small age and site stamp.
// Computers download a PNG; phones and tablets open the share sheet when they can.
window.takeScreenshot = (scene) => {
  if (!scene || !scene.game || !scene.game.renderer || window.__shotBusy) return;
  window.__shotBusy = true; setTimeout(() => { window.__shotBusy = false; }, 800);
  const age = typeof currentAge === "number" ? Math.floor(currentAge) : 40;
  if (typeof sfx === "function") sfx("camera", 0);
  const fl = document.createElement("div");
  fl.style.cssText = "position:fixed;inset:0;background:#FFF0CF;opacity:.75;z-index:99;pointer-events:none;transition:opacity .25s";
  document.body.appendChild(fl); requestAnimationFrame(() => { fl.style.opacity = "0"; }); setTimeout(() => fl.remove(), 300);
  scene.game.renderer.snapshot(img => {
    try {
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const g = c.getContext("2d"); g.drawImage(img, 0, 0);
      const s = Math.max(1, Math.round(c.width / 900)), label = `MIDLIFE SURVIVORS · AGE ${age} · MIDLIFESURVIVORS.COM`;
      g.font = `${11 * s}px Silkscreen, monospace`; const w = g.measureText(label).width + 16 * s, h = 22 * s;
      g.fillStyle = "rgba(23,28,53,.85)"; g.fillRect(c.width - w - 10 * s, c.height - h - 10 * s, w, h);
      g.fillStyle = "#F2D7A1"; g.textBaseline = "middle"; g.fillText(label, c.width - w - 2 * s, c.height - h / 2 - 10 * s);
      c.toBlob(blob => {
        if (!blob) return;
        const name = `midlife-survivors-age-${age}.png`, file = new File([blob], name, { type: "image/png" });
        const touchy = Math.min(window.innerWidth, window.innerHeight) < 820 && navigator.canShare && navigator.canShare({ files: [file] });
        if (touchy) { navigator.share({ files: [file], title: "Midlife Survivors" }).catch(() => {}); }
        else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
        if (window.showLowerThird) showLowerThird("tip", "📸 SAVED", "Screenshot saved. Show someone your midlife.", 2200);
      }, "image/png");
    } catch (e) { console.warn("Screenshot failed", e); }
  });
};
