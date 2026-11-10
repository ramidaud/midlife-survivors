// The GOTCHA! moment (Nov 4, Rami: "some sort of special on screen moment when you catch the intern...
// something between a spotlight card and the chest notification"). About two seconds:
//   1. slow motion and a flash (Derek's camera, or a warm burst for TJ)
//   2. a compact card stamps in: GOTCHA!, the intern's portrait and their line
//   3. a little slot reel spins through the treats and lands on yours, with its name and buff
// The game keeps running underneath in slow motion, so it never stops a run cold. Reduced motion: no spin, no slow-mo.
window.CatchMoment = (() => {
  let root = null, timers = [], slowed = null;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const still = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function css() {
    if (document.getElementById("catch-css")) return;
    const st = document.createElement("style"), A = window.SPOTLIGHT_ROOT || ""; st.id = "catch-css";
    st.textContent = `
#catch-moment{position:fixed;left:50%;top:max(calc(var(--ms-nav-h,0px) + 14%), var(--ms-hud-b,122px));z-index:46;pointer-events:none;transform:translateX(-50%);width:min(340px,86vw)}
#catch-moment .cm-flash{position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 55%,rgba(255,240,207,.85),rgba(239,147,71,.25) 45%,transparent 70%);animation:cmFlash .45s ease-out forwards}
#catch-moment .cm-card{position:relative;background:none;border:24px solid transparent;border-image:url(${A}assets/ui/gotcha-frame-v1.png) 24 fill / 24px / 0 stretch;image-rendering:pixelated;filter:drop-shadow(6px 6px 0 rgba(0,0,0,.45)) drop-shadow(0 0 18px rgba(239,147,71,.4));padding:0;margin:-8px;animation:cmIn .42s cubic-bezier(.2,1.6,.4,1) both}
#catch-moment.out .cm-card{animation:cmOut .3s ease-in forwards}
#catch-moment .cm-kick{display:inline-block;font:10px Silkscreen,monospace;letter-spacing:.06em;color:#171C35;background:#F2D7A1;padding:3px 7px;border-radius:2px}
#catch-moment .cm-got{width:240px;height:60px;max-width:100%;margin:2px auto 0;background:url(${A}assets/ui/gotcha-wordmark-stamp-v1.png) 0 0/960px 60px no-repeat;image-rendering:pixelated;animation:cmStamp 280ms .1s steps(3,jump-none) both}
#catch-moment .cm-got span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
#catch-moment .cm-whowrap{position:relative;width:96px;height:112px;margin:-6px 0 -4px}
#catch-moment .cm-burst{position:absolute;left:50%;top:50%;width:160px;height:160px;margin:-84px 0 0 -80px;background:url(${A}assets/fx/gotcha-burst-v1.png) 0 0/960px 160px no-repeat;image-rendering:pixelated;animation:cmBurst 360ms .08s steps(5,jump-none) both,cmFade .4s .6s ease-out forwards}
#catch-moment .cm-who.caught{position:relative;width:96px;height:112px;background-size:768px 112px;background-position:0 0;animation:cmCaught .88s steps(8) infinite;filter:none}
#catch-moment .cm-ic{width:64px;height:64px;flex:none;background:url(${A}assets/items/treats-v1.png) 0 0/192px 128px no-repeat;image-rendering:pixelated}
#catch-moment .cm-row{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:end}
#catch-moment .cm-who{width:72px;height:84px;background-repeat:no-repeat;background-size:576px 252px;background-position:0 -84px;image-rendering:pixelated;animation:cmWho .9s steps(8) infinite;filter:drop-shadow(0 0 8px rgba(239,147,71,.5))}
#catch-moment .cm-say{font:700 13px/1.3 'Atkinson Hyperlegible',sans-serif;color:#171C35;background:#FFF0CF;border-radius:6px;padding:7px 9px;margin-bottom:8px;position:relative}
#catch-moment .cm-say::after{content:"";position:absolute;left:-7px;bottom:10px;border:7px solid transparent;border-right-color:#FFF0CF;border-left:0}
#catch-moment .cm-reel{margin-top:8px;display:grid;grid-template-columns:64px 1fr;gap:10px;align-items:center;background:#303750;border:2px solid #3E7775;border-radius:6px;padding:6px 8px}
#catch-moment .cm-win{width:64px;height:64px;overflow:hidden;background:#171C35;border-radius:4px;box-shadow:inset 0 0 0 2px #526078}
#catch-moment .cm-strip{display:flex;flex-direction:column}
#catch-moment .cm-strip img{width:56px;height:56px;image-rendering:pixelated;flex:none}
#catch-moment .cm-res{font:12px/1.35 'Atkinson Hyperlegible',sans-serif;color:#B8C0D4;min-height:34px}
#catch-moment .cm-res b{display:block;font:13px Silkscreen,monospace;color:#F2D7A1;letter-spacing:.04em}
#catch-moment .cm-res.landed b{color:var(--cm-col,#EF9347);animation:cmPop .3s cubic-bezier(.2,1.8,.4,1)}
#catch-moment .cm-win.landed{box-shadow:inset 0 0 0 2px var(--cm-col,#EF9347),0 0 14px var(--cm-col,#EF9347)}
@keyframes cmFlash{from{opacity:1}to{opacity:0}}
@keyframes cmIn{0%{transform:translateY(-14px) scale(.6) rotate(-4deg);opacity:0}100%{transform:none;opacity:1}}
@keyframes cmOut{to{transform:translateY(-10px) scale(.9);opacity:0}}
@keyframes cmStamp{from{background-position-x:0}to{background-position-x:-720px}}
@keyframes cmBurst{from{background-position-x:0}to{background-position-x:-800px}}
@keyframes cmFade{to{opacity:0}}
@keyframes cmCaught{from{background-position-x:0}to{background-position-x:-768px}}
@keyframes cmPop{0%{transform:scale(1.35)}100%{transform:scale(1)}}
@keyframes cmWho{from{background-position-x:0}to{background-position-x:-576px}}
@media (orientation:landscape) and (min-width:761px){#catch-moment{left:calc(50% + 64px);transform:none;top:22%}}
@media (prefers-reduced-motion:reduce){#catch-moment *{animation:none!important}#catch-moment .cm-got{background-position-x:-720px}#catch-moment .cm-burst{display:none}}`;
    document.head.appendChild(st);
  }
  function unslow() { const sc = slowed; slowed = null; if (sc && sc.physics && sc.physics.world) sc.physics.world.timeScale = 1; if (sc && sc.tweens) sc.tweens.timeScale = 1; }
  function clear() { timers.forEach(clearTimeout); timers = []; unslow(); if (root) root.remove(); root = null; }
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  // r: the intern (roster entry), line: what they say, treat: { id, name, text, color }, icons: { id: dataURL }
  function show(scene, r, line, treat, icons, hits) {
    clear(); css();
    const calm = still(), ROOT = window.SPOTLIGHT_ROOT || "";
    // 1. hit-pause: the world slows for a beat (physics and tweens), then eases back
    if (!calm && scene && scene.physics) {
      slowed = scene; scene.physics.world.timeScale = 3; if (scene.tweens) scene.tweens.timeScale = 0.4;
      later(unslow, 650);
      if (scene.cameras && scene.cameras.main) scene.cameras.main.shake(140, 0.004);
    }
    if (typeof sfx === "function") sfx("catch", 0);
    // 2. the card
    const order = ["coffee", "burrito", "bundt"], spin = [];
    for (let i = 0; i < 9; i++) spin.push(order[i % 3]);
    spin.push(treat.id); // the strip ends on your treat
    root = document.createElement("div"); root.id = "catch-moment"; root.setAttribute("role", "status"); root.setAttribute("aria-live", "polite");
    root.setAttribute("aria-label", `Caught ${r.name}. ${treat.name}: ${treat.text}.`);
    root.innerHTML = `${calm ? "" : `<div class="cm-flash"></div>`}<div class="cm-card">
      <span class="cm-kick">INTERN CAUGHT · ${esc(r.name.toUpperCase())}</span>
      <div class="cm-got"><span>GOTCHA!</span></div>
      <div class="cm-row"><div class="cm-whowrap">${calm ? "" : `<div class="cm-burst"></div>`}<div class="cm-who caught" style="background-image:url(${ROOT}assets/characters/portraits/intern-${esc(r.id)}-caught-v1.png)"></div></div><div class="cm-say">${esc(line || "Here you go!")}</div></div>
      <div class="cm-reel"><div class="cm-win"><div class="cm-strip">${spin.map(id => `<div class="cm-ic" style="background-position-x:${-64 * Math.max(0, order.indexOf(id))}px"></div>`).join("")}</div></div>
        <div class="cm-res"><b>SHIELD UP</b>Blocks your next ${hits || 2} hits. And a treat...</div></div></div>`;
    document.body.appendChild(root);
    root.style.setProperty("--cm-col", treat.color || "#EF9347");
    // 3. the reel: spins down and lands on the treat
    const strip = root.querySelector(".cm-strip"), win = root.querySelector(".cm-win"), res = root.querySelector(".cm-res");
    const land = () => {
      win.classList.add("landed"); res.classList.add("landed");
      const last = strip.lastElementChild; if (last) last.style.backgroundPositionY = "-64px"; // the shine row
      res.innerHTML = `<b>${esc(treat.name)}</b>${esc(treat.text.charAt(0).toUpperCase() + treat.text.slice(1))}`;
      if (typeof sfx === "function") sfx("reelLand", 0);
    };
    if (calm) { strip.style.transform = `translateY(${-64 * (spin.length - 1)}px)`; land(); }
    else {
      const total = 64 * (spin.length - 1);
      strip.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-total}px)` }], { duration: 950, delay: 280, easing: "cubic-bezier(.15,.7,.25,1)", fill: "forwards" });
      [320, 400, 480, 570, 670, 780, 900, 1030].forEach(t => later(() => typeof sfx === "function" && sfx("reelTick", 0), t));
      later(land, 1240);
    }
    if (window.__catchHold) return; // tests: keep the card up for a screenshot
    later(() => root && root.classList.add("out"), calm ? 2400 : 2500);
    later(clear, calm ? 2750 : 2850);
  }
  return { show, clear, isShowing: () => !!root };
})();
