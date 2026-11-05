// First-minute teaching (Nov 5): the "move to start" hint, the first kill and the first hit. Settings: src/data/first-minute.js.
window.FirstMinute = (() => {
  const F = () => window.FIRST_MINUTE || {};
  let el = null, lineFreeAt = 0; // teaching lines wait their turn so one never covers the other
  function say(kind, badge, text) {
    const wait = Math.max(0, lineFreeAt - performance.now());
    lineFreeAt = performance.now() + wait + 4400;
    setTimeout(() => { if (window.showLowerThird) showLowerThird(kind, badge, text, 4200); }, wait);
  }
  function hintText() {
    const H = F().hint || {};
    if (window._padUsedThisRun) return H.pad;
    const touch = (navigator.maxTouchPoints || 0) > 0 && window.matchMedia && matchMedia("(pointer: coarse)").matches;
    return touch ? H.touch : H.keys;
  }
  function waiting(scene) {
    if (el || window.briefingOpen) return;
    el = document.createElement("div"); el.id = "move-hint"; el.setAttribute("role", "status");
    el.innerHTML = `<div class="mh-main">${hintText()}</div><div class="mh-sub">${(F().hint || {}).sub || ""}</div>`;
    if (!document.getElementById("move-hint-css")) {
      const st = document.createElement("style"); st.id = "move-hint-css";
      st.textContent = `#move-hint{position:fixed;left:50%;bottom:22%;transform:translateX(-50%);z-index:46;pointer-events:none;text-align:center;
        background:#171C35e6;border:3px solid #F2D7A1;border-radius:8px;padding:10px 16px;max-width:calc(100vw - 32px);animation:mhPulse 1.2s ease-in-out infinite}
        #move-hint .mh-main{font:16px Silkscreen,monospace;color:#F2D7A1;letter-spacing:.5px}
        #move-hint .mh-sub{font:14px "Atkinson Hyperlegible",sans-serif;color:#D3B78D;margin-top:4px}
        @keyframes mhPulse{50%{transform:translateX(-50%) scale(1.05)}}
        @media (prefers-reduced-motion:reduce){#move-hint{animation:none}}`;
      document.head.appendChild(st);
    }
    document.body.appendChild(el);
  }
  function moved() { if (el) { el.remove(); el = null; } }
  function firstKill(scene, bill) {
    const C = F().firstKill || {};
    const t = scene.add.text(bill.x, bill.y - 30, C.pop || "PAID!", { fontFamily: "Silkscreen, monospace", fontSize: "26px", color: "#F2D7A1", stroke: "#171C35", strokeThickness: 6 }).setOrigin(0.5).setDepth(50000);
    scene.tweens.add({ targets: t, y: t.y - 40, scale: { from: 0.6, to: 1.2 }, duration: 500, ease: "Back.Out", onComplete: () => scene.tweens.add({ targets: t, alpha: 0, delay: 500, duration: 300, onComplete: () => t.destroy() }) });
    say("tip", "FIRST DAY", C.line); // "tip" priority, so it queues instead of being dropped
  }
  function firstHurt(scene) {
    scene.cameras.main.flash(180, 196, 92, 75);
    say("alert", "OUCH", (F().firstHurt || {}).line);
  }
  return { waiting, moved, firstKill, firstHurt };
})();
