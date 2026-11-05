// Bonus Chest moment (Nov 3, after Rami's Vampire Survivors session).
// Beat a boss, walk over its chest: the game pauses on a "BONUS APPROVED" card. Press OPEN and the chest shakes,
// light beams shoot up (1, 3 or 5 by boss), item icons spin up each beam like a slot reel and land on your rewards,
// 401(k) coins fountain out while the counter ticks up, and the screen flashes gold.
// main.js picks and applies the rewards; this file only puts on the show. Placeholder art until ChatGPT's chest sheets land.
window.BonusChest = (() => {
  let modal = null, state = null;
  const reduceMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function texUrl(scene, key) {
    try { if (scene && scene.textures.exists(key)) return scene.textures.getBase64(key); } catch (e) {}
    return "";
  }

  function ensureDom() {
    if (modal) return modal;
    const style = document.createElement("style");
    style.textContent = `
      #bonus-modal { z-index: 34; background: rgba(8,10,22,.82); }
      .bonus-card { position: relative; width: min(460px, 94vw); max-height: 94dvh; overflow-x: hidden; overflow-y: auto;
        background: #171C35; border: 3px solid #EF9347; border-radius: 10px; padding: 14px 14px 16px;
        box-shadow: 0 0 0 2px #3E7775, 6px 6px 0 #0b0e1d, 0 0 40px rgba(239,147,71,.3); text-align: center; color: #FFF0CF;
        font-family: "Atkinson Hyperlegible", system-ui, sans-serif; }
      .bonus-memo { background: #F2D7A1; color: #171C35; margin: -14px -14px 10px; padding: 8px 12px; border-left: 4px solid #EF9347;
        font-family: "Silkscreen", monospace; font-size: 10px; letter-spacing: .06em; font-weight: 400; display: flex; justify-content: space-between; gap: 8px; }
      .bonus-memo b { color: #874C3B; }
      .bonus-title { font-family: "Silkscreen", monospace; font-size: clamp(22px, 6vw, 30px); font-weight: 700; color: #EF9347; letter-spacing: .04em;
        text-shadow: 2px 2px 0 #171C35, 0 0 14px rgba(239,147,71,.6); margin: 2px 0 2px; }
      .bonus-sub { font-size: 13px; color: #B8C0D4; min-height: 18px; }
      .bonus-stage { position: relative; height: min(300px, 40dvh); margin: 8px 0 4px; }
      @media (max-height: 760px), (max-width: 480px) { .bonus-stage { height: min(240px, 32dvh); } .bonus-list li { padding: 3px 6px; } .bonus-list { margin: 4px 0 8px; } }
      .bonus-beams { position: absolute; left: 50%; bottom: 46px; width: 0; height: 100%; }
      .bonus-beam { position: absolute; bottom: 0; left: -27px; width: 54px; height: 0; transform-origin: 50% 100%;
        background: linear-gradient(to top, rgba(255,226,120,.95), rgba(239,147,71,.55) 60%, rgba(239,147,71,0));
        border-radius: 27px 27px 4px 4px; overflow: hidden; transition: height .45s cubic-bezier(.2,.9,.3,1.2);
        box-shadow: 0 0 22px rgba(255,214,90,.55); }
      .bonus-beam.evo { background: linear-gradient(to top, rgba(214,170,255,.95), rgba(191,168,207,.6) 60%, rgba(191,168,207,0)); box-shadow: 0 0 22px rgba(200,150,255,.6); }
      .bonus-stage.up .bonus-beam { height: calc(100% - 10px); }
      .bonus-reel { position: absolute; left: 0; right: 0; top: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; }
      .bonus-reel.spin { animation: bonusReel .35s linear infinite; }
      @keyframes bonusReel { from { transform: translateY(-46px); } to { transform: translateY(0); } }
      .bonus-reel .ri { width: 40px; height: 40px; display: grid; place-items: center; font-size: 28px; opacity: .85; filter: blur(.4px); }
      .bonus-reel .ri img, .bonus-land img { width: 40px; height: 40px; image-rendering: pixelated; }
      .bonus-land { position: absolute; left: 50%; top: 18px; width: 48px; height: 48px; margin-left: -24px; display: grid; place-items: center;
        font-size: 32px; border-radius: 50%; background: radial-gradient(circle, #fff6c8 0, #f5a742 55%, rgba(245,167,66,0) 72%);
        transform: scale(0); transition: transform .3s cubic-bezier(.3,1.6,.5,1); }
      .bonus-beam.landed .bonus-land { transform: scale(1.15); }
      .bonus-beam.landed .bonus-reel { display: none; }
      .bonus-land::after { content: ""; position: absolute; inset: -14px; border-radius: 50%; border: 3px solid #fff3b0; opacity: 0; }
      .bonus-beam.landed .bonus-land::after { animation: bonusRing .5s ease-out; }
      @keyframes bonusRing { from { transform: scale(.4); opacity: 1; } to { transform: scale(1.6); opacity: 0; } }
      .bonus-chest { position: absolute; left: 50%; bottom: 0; width: 102px; height: 90px; margin-left: -51px;
        background: center/contain no-repeat; image-rendering: pixelated; animation: bonusBob 1.4s ease-in-out infinite; z-index: 2; }
      .bonus-chest.emoji { background: none; font-size: 72px; line-height: 90px; }
      @keyframes bonusBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      .bonus-chest.shake { animation: bonusShake .09s linear infinite; }
      @keyframes bonusShake { 0% { transform: translate(-3px,0) rotate(-3deg); } 50% { transform: translate(3px,-2px) rotate(3deg); } 100% { transform: translate(-3px,0) rotate(-3deg); } }
      .bonus-chest.open { animation: bonusPop .35s ease-out forwards; filter: brightness(1.35) drop-shadow(0 0 14px #F2D7A1); }
      @keyframes bonusPop { 0% { transform: scale(1); } 40% { transform: scale(1.25, .85); } 100% { transform: scale(1.08); } }
      .bonus-coin { position: absolute; left: 50%; bottom: 40px; width: 18px; height: 18px; margin-left: -9px; z-index: 3;
        background: center/contain no-repeat; image-rendering: pixelated; pointer-events: none;
        animation: bonusCoin var(--t, 1s) cubic-bezier(.2,.6,.4,1) forwards; }
      @keyframes bonusCoin {
        0% { transform: translate(0,0) rotate(0); opacity: 1; }
        45% { transform: translate(calc(var(--dx) * .6), var(--dy)) rotate(200deg); opacity: 1; }
        100% { transform: translate(var(--dx), 140px) rotate(420deg); opacity: 0; } }
      .bonus-total { font-family: "Silkscreen", monospace; font-size: clamp(26px, 7vw, 38px); font-weight: 700; color: #FFF0CF; letter-spacing: .02em; margin: 2px 0; }
      .bonus-total small { font-size: 14px; color: #EF9347; margin-left: 4px; }
      .bonus-total.done { color: #EF9347; text-shadow: 0 0 12px rgba(239,147,71,.7); }
      .bonus-list { list-style: none; margin: 6px 0 10px; padding: 0; text-align: left; font-family: system-ui, sans-serif; font-size: 13px; }
      .bonus-list li { display: grid; grid-template-columns: 34px 1fr; gap: 10px; align-items: center; padding: 5px 6px; border-top: 1px solid #303750;
        opacity: 0; transform: translateY(6px); transition: opacity .25s, transform .25s; }
      .bonus-list li.show { opacity: 1; transform: none; }
      .bonus-list li .li-ic { width: 34px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 20px; overflow: visible; }
      .bonus-list li .li-ic > * { transform: scale(.7); transform-origin: center; flex: none; }
      .bonus-land > * { max-width: 40px; max-height: 40px; }
      .bonus-list li b { color: #FFF0CF; } .bonus-list li span { color: #83A89A; font-size: 11px; letter-spacing: .05em; margin-left: 6px; }
      .bonus-list li.evo span { color: #BFA8CF; }
      .bonus-btn { font: 400 16px "Silkscreen", monospace; letter-spacing: .08em; padding: 12px 28px; min-width: 180px; border-radius: 8px;
        border: 3px solid #171C35; background: #EF9347; color: #171C35; cursor: pointer; box-shadow: 0 4px 0 #874C3B; }
      .bonus-btn.nav-focused, .bonus-btn:hover { background: #EF9347; outline: 3px solid #FFF0CF; outline-offset: 2px; }
      .bonus-btn.skip { background: #303750; color: #B8C0D4; box-shadow: none; font-size: 13px; padding: 8px 18px; min-width: 0; }
      .bonus-flash { position: fixed; inset: 0; z-index: 40; pointer-events: none; background: radial-gradient(circle, #FFF0CF, #EF9347 60%, rgba(239,147,71,.6));
        opacity: 0; transition: opacity .5s ease-out; }
      .bonus-flash.on { opacity: .85; transition: none; }
      /* ChatGPT's Bonus Approved art pack (assets/ui/bonus/, Nov 3) */
      .bonus-card.art { background: #171C35; border: 24px solid transparent; padding: 0 6px 6px;
        border-image: url(assets/ui/bonus/card-9slice-v1.png) 12 fill / 24px / 0 stretch; image-rendering: pixelated; box-shadow: 6px 6px 0 rgba(0,0,0,.45); }
      .bonus-card.art .bonus-memo { margin: -6px -6px 10px; }
      .bonus-stamp { position: absolute; top: 34px; right: 4px; width: 124px; height: 44px; background: url(assets/ui/bonus/approved-stamp-v1.png) center/contain no-repeat;
        image-rendering: pixelated; transform: rotate(8deg) scale(0); transition: transform .35s cubic-bezier(.3,1.7,.5,1); z-index: 4; }
      .bonus-card.stamped .bonus-stamp { transform: rotate(8deg) scale(1); }
      /* The stamp sits on the card's top-right corner instead of over the headline (Fable review) */
      .bonus-card.art .bonus-stamp { top: -20px; right: -12px; width: 100px; height: 36px; }
      .bonus-chest.sheet { width: 144px; height: 144px; margin-left: -72px; bottom: -8px; background-repeat: no-repeat; background-size: 400% 100%;
        background-position: 0% 0; image-rendering: pixelated; }
      .bonus-chest.sheet.shake { animation: bonusShakeSheet .18s steps(1) infinite; }
      @keyframes bonusShakeSheet { 0% { background-position: 33.333% 0; } 50% { background-position: 66.667% 0; } }
      .bonus-chest.sheet.open { background-position: 100% 0; animation: bonusPop .35s ease-out forwards; filter: drop-shadow(0 0 16px #F2D7A1); }
      .bonus-beam.art { width: 64px; left: -32px; border-radius: 0; box-shadow: none;
        background: url(assets/ui/bonus/beam-gold-v1.png) center bottom / 64px auto repeat-y; image-rendering: pixelated; }
      .bonus-beam.art.evo { background-image: url(assets/ui/bonus/beam-lavender-v1.png); }
      .bonus-coin.sheet { width: 24px; height: 24px; margin-left: -12px; background-size: 800% 100% !important; background-repeat: no-repeat; image-rendering: pixelated;
        animation: bonusCoin var(--t, 1s) cubic-bezier(.2,.6,.4,1) forwards, bonusSpin .5s steps(8) infinite; }
      .bonus-coin.check { width: 48px; height: 24px; margin-left: -24px; background-size: 400% 100% !important; animation: bonusCoin var(--t, 1s) cubic-bezier(.2,.6,.4,1) forwards, bonusFlutter .4s steps(4) infinite; }
      @keyframes bonusSpin { from { background-position-x: 0%; } to { background-position-x: 114.29%; } }
      @keyframes bonusFlutter { from { background-position-x: 0%; } to { background-position-x: 133.33%; } }
      @media (min-width: 700px) and (pointer: coarse) { .bonus-card { width: min(560px, 80vw); } .bonus-stage { height: min(360px, 36dvh); } .bonus-list { font-size: 16px; } }
      @media (prefers-reduced-motion: reduce) {
        .bonus-chest, .bonus-chest.shake, .bonus-reel.spin { animation: none; }
        .bonus-coin { display: none; }
      }`;
    document.head.appendChild(style);
    modal = document.createElement("div");
    modal.className = "ui-modal hidden";
    modal.id = "bonus-modal";
    modal.innerHTML = `
      <div class="bonus-card art" role="dialog" aria-labelledby="bonus-title"><div class="bonus-stamp" aria-hidden="true"></div>
        <div class="bonus-memo"><span>FORM 401-K</span><b id="bonus-tier">TIER 1</b></div>
        <div class="bonus-title" id="bonus-title">BONUS APPROVED</div>
        <div class="bonus-sub" id="bonus-sub"></div>
        <div class="bonus-stage" id="bonus-stage">
          <div class="bonus-beams" id="bonus-beams"></div>
          <div class="bonus-chest" id="bonus-chest"></div>
        </div>
        <div class="bonus-total" id="bonus-total" hidden>0<small>k 401(k)</small></div>
        <ul class="bonus-list" id="bonus-list"></ul>
        <button class="bonus-btn" id="bonus-btn" type="button">OPEN</button>
      </div>`;
    const host = document.getElementById("levelup-modal");
    (host && host.parentNode ? host.parentNode : document.body).appendChild(modal);
    const flash = document.createElement("div");
    flash.className = "bonus-flash"; flash.id = "bonus-flash";
    document.body.appendChild(flash);
    window.BonusChest._btn = modal.querySelector("#bonus-btn");
    // One button does everything: OPEN, then SKIP while it plays, then CASH IT IN.
    if (window.bindNavItem) bindNavItem(window.BonusChest._btn, 0, () => press(), true);
    else window.BonusChest._btn.addEventListener("click", () => press());
    return modal;
  }

  const $ = id => modal.querySelector("#" + id);
  const later = (ms, fn) => { const t = setTimeout(fn, state && state.fast ? 0 : ms); if (state) state.timers.push(t); return t; };

  function open(opts, onDone) {
    ensureDom();
    const { scene, tier, rewards, coins, bossName, reelIcons } = opts;
    state = { phase: "closed", rewards, coins, tier, onDone, timers: [], fast: reduceMotion(), scene, reelIcons: reelIcons || [] };
    $("bonus-tier").textContent = `TIER ${tier} · ${rewards.length} ITEM${rewards.length === 1 ? "" : "S"}`;
    $("bonus-title").textContent = "BONUS APPROVED";
    $("bonus-sub").textContent = bossName ? `You outlasted ${bossName}. HR signed off on it.` : "HR signed off on it.";
    $("bonus-beams").innerHTML = "";
    $("bonus-list").innerHTML = "";
    $("bonus-stage").classList.remove("up");
    const tot = $("bonus-total"); tot.hidden = true; tot.classList.remove("done"); tot.firstChild.textContent = "0";
    const chest = $("bonus-chest");
    chest.className = "bonus-chest";
    const sheet = `ASSETchest-tier-${tier >= 5 ? 5 : tier >= 3 ? 3 : 1}-v1.png`.replace("ASSET", "assets/ui/bonus/");
    chest.classList.add("sheet"); chest.style.backgroundImage = `url(${sheet})`; chest.textContent = "";
    modal.querySelector(".bonus-card").classList.remove("stamped");
    const btn = window.BonusChest._btn;
    btn.textContent = "OPEN"; btn.className = "bonus-btn";
    modal.classList.remove("hidden");
    if (window.menuNav) window.menuNav.refresh();
    if (window.menuNav) window.menuNav.focus(btn, false);
    sfx("levelUp");
  }

  function press() {
    if (!state) return;
    if (state.phase === "closed") return play();
    if (state.phase === "playing") return skip();
    if (state.phase === "done") return close();
  }

  function setBtn(text, skipStyle) {
    const btn = window.BonusChest._btn;
    btn.textContent = text;
    btn.classList.toggle("skip", !!skipStyle);
  }

  function play() {
    state.phase = "playing";
    setBtn("SKIP", true);
    const chest = $("bonus-chest");
    chest.classList.add("shake");
    sfx("ring");
    later(260, () => sfx("ring"));
    later(700, () => burst());
  }

  function burst() {
    const { rewards, tier } = state;
    const chest = $("bonus-chest");
    chest.classList.remove("shake"); chest.classList.add("open");
    flash(tier >= 5 ? 1 : 0.55);
    sfx("bossDefeat");
    $("bonus-sub").textContent = tier >= 5 ? "THE BIG ONE. Corporate is crying." : (tier >= 3 ? "Multiple line items. Somebody in Finance is sweating." : "One line item. It's not nothing.");
    // Beams fan out like a V: 1 straight up, 3 or 5 spread across.
    const n = rewards.length, spread = n >= 5 ? 15 : 19;
    const beams = $("bonus-beams");
    beams.innerHTML = rewards.map((r, i) => {
      const ang = (i - (n - 1) / 2) * spread;
      const filler = Array.from({ length: 8 }, (_, k) => `<div class="ri">${state.reelIcons[(i * 3 + k) % Math.max(1, state.reelIcons.length)] || "⭐"}</div>`).join("");
      return `<div class="bonus-beam art${r.evo ? " evo" : ""}" style="transform: rotate(${ang}deg)"><div class="bonus-reel spin">${filler}${filler}</div><div class="bonus-land" style="transform-origin:center">${r.icon}</div></div>`;
    }).join("");
    // counter-rotate the landed icons so they sit upright
    beams.querySelectorAll(".bonus-beam").forEach((b, i) => {
      const ang = (i - (n - 1) / 2) * spread;
      b.querySelector(".bonus-land").style.rotate = `${-ang}deg`;
    });
    requestAnimationFrame(() => $("bonus-stage").classList.add("up"));
    fountain(10 + tier * 8);
    // Land each beam one after another, center first.
    const order = rewards.map((_, i) => i).sort((a, b) => Math.abs(a - (n - 1) / 2) - Math.abs(b - (n - 1) / 2));
    order.forEach((idx, k) => later(900 + k * 380, () => land(idx)));
    later(900 + n * 380 + 200, () => countUp());
  }

  function land(idx) {
    const b = $("bonus-beams").children[idx];
    if (!b || b.classList.contains("landed")) return;
    b.classList.add("landed");
    sfx("pick");
    const r = state.rewards[idx];
    const li = document.createElement("li");
    if (r.evo) li.className = "evo";
    li.innerHTML = `<span class="li-ic">${r.icon}</span><div><b>${r.name}</b><span>${r.label}</span></div>`;
    $("bonus-list").appendChild(li);
    requestAnimationFrame(() => li.classList.add("show"));
  }

  function countUp() {
    const tot = $("bonus-total");
    tot.hidden = false;
    const target = state.coins, start = performance.now(), dur = state.fast ? 0 : 1300;
    let lastTick = 0;
    const step = now => {
      if (!state) return;
      const k = dur ? Math.min(1, (now - start) / dur) : 1;
      const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
      tot.firstChild.textContent = v.toLocaleString("en-US");
      if (now - lastTick > 90 && k < 1) { sfx("coin"); lastTick = now; }
      if (k < 1) state.raf = requestAnimationFrame(step);
      else finish();
    };
    state.raf = requestAnimationFrame(step);
  }

  function finish() {
    if (!state || state.phase === "done") return;
    state.phase = "done";
    $("bonus-total").classList.add("done");
    modal.querySelector(".bonus-card").classList.add("stamped"); // APPROVED stamp thunks down
    sfx("wordNo");
    if (state.tier >= 5) flash(0.7);
    setBtn("CASH IT IN", false);
    if (window.menuNav) window.menuNav.focus(window.BonusChest._btn, false);
  }

  // Skip: jump straight to the end state.
  function skip() {
    state.fast = true;
    state.timers.forEach(clearTimeout); state.timers = [];
    if (state.raf) cancelAnimationFrame(state.raf);
    if (!$("bonus-beams").children.length) burst();
    state.rewards.forEach((_, i) => land(i));
    const tot = $("bonus-total"); tot.hidden = false;
    tot.firstChild.textContent = state.coins.toLocaleString("en-US");
    finish();
  }

  function fountain(count) {
    if (state.fast) return;
    const stage = $("bonus-stage");
    for (let i = 0; i < count; i++) {
      later(i * 28, () => {
        const c = document.createElement("div");
        const roll = Math.random(); // mostly gold 401(k) coins, some silver, the odd fluttering bonus check
        const kind = roll < 0.12 ? "check" : roll < 0.32 ? "silver" : "gold";
        c.className = "bonus-coin sheet" + (kind === "check" ? " check" : "");
        c.style.backgroundImage = `url(assets/ui/bonus/${kind === "check" ? "bonus-check-v1.png" : kind === "silver" ? "coin-silver-v1.png" : "coin-gold-v1.png"})`;
        c.style.animationDelay = `0s, ${-Math.random() * 0.5}s`;
        const dx = (Math.random() * 2 - 1) * 190, dy = -(90 + Math.random() * 170);
        c.style.setProperty("--dx", dx + "px"); c.style.setProperty("--dy", dy + "px");
        c.style.setProperty("--t", (0.9 + Math.random() * 0.6) + "s");
        stage.appendChild(c);
        c.addEventListener("animationend", e => { if (e.animationName === "bonusCoin") c.remove(); });
        if (i % 4 === 0) sfx("coin");
      });
    }
  }

  function flash(strength) {
    const f = document.getElementById("bonus-flash");
    if (!f || reduceMotion()) return;
    f.style.setProperty("opacity", "");
    f.classList.add("on");
    f.style.opacity = String(strength);
    requestAnimationFrame(() => requestAnimationFrame(() => { f.classList.remove("on"); f.style.opacity = "0"; }));
  }

  function close() {
    if (!state) return;
    const done = state.onDone;
    state.timers.forEach(clearTimeout);
    if (state.raf) cancelAnimationFrame(state.raf);
    state = null;
    modal.classList.add("hidden");
    modal.querySelectorAll(".bonus-coin").forEach(c => c.remove());
    sfx("pick");
    if (done) done();
  }

  // Safety net (Nov 4): forget a chest screen that isn't actually showing (a new run, or a menu that closed over it).
  function abandon() {
    if (!state) return;
    state.timers.forEach(clearTimeout); if (state.raf) cancelAnimationFrame(state.raf);
    state = null; if (modal) modal.classList.add("hidden");
  }
  const visible = () => !!(modal && !modal.classList.contains("hidden"));
  return { open, press, abandon, visible, isOpen: () => !!state };
})();
