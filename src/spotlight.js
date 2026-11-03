// Spotlight cards (Nov 3, Style B): a big animated lower third for key moments.
// A beam opens, a slanted band wipes in, a big sprite hops up at the bottom left, the name drops in letter by letter,
// the character's line types itself, and a tip slides up under it.
// It doesn't pause the game and you can tap it away. Copy lives in src/data/spotlight.js.
// Usage: Spotlight.boss(kind), Spotlight.room(areaId), Spotlight.hire(heroId), Spotlight.tip(key)  (tips: once ever)
window.Spotlight = (() => {
  const S = () => window.SPOTLIGHT || {};
  const ROOT = window.SPOTLIGHT_ROOT || ""; // the Art Room page lives two folders down and sets this to "../../"
  let root = null, queue = [], showing = null, hideTimer = 0;
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem("ms-spotlight-seen-v1") || "{}"); } catch (e) {}
  const remember = k => { seen[k] = 1; try { localStorage.setItem("ms-spotlight-seen-v1", JSON.stringify(seen)); } catch (e) {} };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function css() {
    if (document.getElementById("spotlight-css")) return;
    const st = document.createElement("style"); st.id = "spotlight-css";
    // v2 animation (Nov 3): a light beam opens, the band wipes in behind a bright edge, the sprite hops up with
    // squash and stretch and lands in a puff, the kicker stamps, the name's letters drop in one by one, the line
    // types itself, and a shine sweeps the band. Transforms and opacity only (plus one clip-path), so it stays smooth.
    st.textContent = `
#spotlight{position:fixed;inset:0;z-index:9;pointer-events:none;overflow:hidden;--s:1;--lift:0px;--L:max(12px,4vw)}
#spotlight .sp-dim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(23,28,53,0) 40%,rgba(23,28,53,.72) 85%);animation:spFade .3s ease-out both}
#spotlight .sp-bar{position:absolute;left:0;right:0;height:44px;background:#171C35}
#spotlight .sp-bar.t{top:0;animation:spBarT .35s cubic-bezier(.16,1,.3,1) both}#spotlight .sp-bar.b{bottom:0;animation:spBarB .35s cubic-bezier(.16,1,.3,1) both}
#spotlight .sp-flash{position:absolute;inset:0;background:#C45C4B;mix-blend-mode:screen;animation:spFlash .5s .3s ease-out both}
#spotlight .sp-beam{position:absolute;top:0;left:calc(var(--L) + var(--aw) * -.3);width:calc(var(--aw) * 1.6);bottom:calc(60px * var(--s) + var(--lift));background:linear-gradient(180deg,rgba(255,240,207,0),rgba(255,240,207,.16) 60%,rgba(255,240,207,.3));clip-path:polygon(43% 0,57% 0,100% 100%,0 100%);transform-origin:50% 0;animation:spBeam .5s .05s cubic-bezier(.16,1,.3,1) both}
#spotlight.boss .sp-beam{background:linear-gradient(180deg,rgba(196,92,75,0),rgba(196,92,75,.22) 60%,rgba(239,147,71,.35))}
#spotlight .sp-glow{position:absolute;left:calc(var(--L) + var(--aw) * -.1);width:calc(var(--aw) * 1.2);bottom:calc(52px * var(--s) + var(--lift));height:calc(34px * var(--s));background:radial-gradient(closest-side,rgba(255,240,207,.55),rgba(255,240,207,0));animation:spGlow .5s .1s ease-out both}
#spotlight .sp-band{position:absolute;left:-40px;right:-40px;bottom:calc(76px * var(--s) + var(--lift));height:calc(138px * var(--s));border-top:6px solid var(--edge);border-bottom:6px solid var(--edge);background:var(--band);box-shadow:0 0 0 4px #171C35;overflow:hidden;transform:skewY(-4deg);animation:spWipe .5s .12s cubic-bezier(.16,1,.3,1) both}
#spotlight .sp-edgebar{position:absolute;inset:0;animation:spEdge .5s .12s cubic-bezier(.16,1,.3,1) both}
#spotlight .sp-edgebar::after{content:"";position:absolute;right:0;top:0;bottom:0;width:22px;background:linear-gradient(90deg,rgba(255,240,207,0),#FFF0CF)}
#spotlight .sp-glint{position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,240,207,.28) 47%,rgba(255,240,207,.08) 52%,transparent 56%);animation:spGlint .9s 1.25s ease-in-out both}
#spotlight .sp-artwrap{position:absolute;left:var(--L);bottom:calc(66px * var(--s) + var(--lift));transform-origin:50% 100%;will-change:transform;animation:spPop .62s .24s cubic-bezier(.25,.8,.35,1) both}
#spotlight .sp-art{image-rendering:pixelated;filter:drop-shadow(0 0 14px var(--edge))}
#spotlight .sp-art.boss{width:calc(144px * var(--a));height:calc(152px * var(--a));background-size:calc(576px * var(--a)) calc(456px * var(--a));background-position:0 0;animation:spBob 1.6s 1s ease-in-out infinite}
#spotlight .sp-art.hero{width:calc(96px * var(--a));height:calc(112px * var(--a));background-size:calc(768px * var(--a)) calc(336px * var(--a));background-position:0 calc(-112px * var(--a));animation:spHero 1.12s steps(8) infinite}
#spotlight .sp-art.cast{width:calc(48px * var(--a));height:calc(56px * var(--a));background-size:calc(192px * var(--a)) calc(224px * var(--a));background-position:0 0;animation:spCast .9s steps(4) infinite}
#spotlight .sp-art.intern{width:calc(56px * var(--a));height:calc(60px * var(--a));background-size:calc(448px * var(--a)) calc(300px * var(--a));background-position:0 calc(-240px * var(--a));animation:spIntern .74s steps(4) infinite}
#spotlight .sp-puff{position:absolute;left:calc(var(--L) + var(--aw) * .5);bottom:calc(66px * var(--s) + var(--lift))}
#spotlight .sp-puff i{position:absolute;left:-4px;bottom:0;width:calc(8px * var(--s));height:calc(8px * var(--s));background:#FFF0CF;opacity:0;animation:spPuff .5s .66s cubic-bezier(.16,1,.3,1) forwards}
#spotlight .sp-text{position:absolute;left:calc(var(--L) + var(--artw) + 18px);right:max(16px,4vw);bottom:calc(98px * var(--s) + var(--lift));display:flex;flex-direction:column;gap:6px}
#spotlight .sp-kick{align-self:flex-start;font:calc(13px * var(--s)) Silkscreen,monospace;letter-spacing:.1em;color:#171C35;background:#F2D7A1;padding:3px 9px;animation:spStamp .34s .36s cubic-bezier(.2,1.4,.4,1) both}
#spotlight .sp-name{font:700 calc(44px * var(--s))/1 Silkscreen,monospace;color:#FFF0CF;text-shadow:4px 4px 0 #171C35}
#spotlight .sp-name .w{display:inline-block;white-space:nowrap}
#spotlight .sp-name i{font-style:normal;display:inline-block;animation:spDrop .42s calc(.46s + var(--i) * 28ms) cubic-bezier(.3,1.6,.5,1) both}
#spotlight .sp-bio{font:600 calc(16px * var(--s))/1.3 "Atkinson Hyperlegible",system-ui,sans-serif;color:#E9DCC0;max-width:46em;animation:spUp .4s calc(var(--sayAt) - .1s) cubic-bezier(.16,1,.3,1) both}
#spotlight .sp-say{position:absolute;left:calc(var(--L) + var(--artw) * .6);bottom:calc(232px * var(--s) + var(--lift));max-width:min(560px,calc(100vw - 32px));background:#FFF0CF;color:#171C35;border:4px solid #171C35;border-radius:10px;padding:12px 16px;box-shadow:6px 6px 0 rgba(23,28,53,.6);font:700 calc(20px * var(--s))/1.3 "Atkinson Hyperlegible",system-ui,sans-serif;transform-origin:0 100%;animation:spSay .36s var(--sayAt) cubic-bezier(.2,1.5,.4,1) both;pointer-events:auto;cursor:pointer}
#spotlight .sp-say::after{content:"";position:absolute;left:22px;bottom:-14px;border:10px solid transparent;border-top:12px solid #171C35;border-bottom:0}
#spotlight .sp-say i{font-style:normal;animation:spType .01s calc(var(--sayAt) + .18s + var(--c) * 22ms) both}
#spotlight .sp-tip{position:absolute;left:calc(var(--L) + var(--artw) + 18px);right:max(16px,4vw);bottom:calc(30px * var(--s) + var(--lift));display:flex;gap:10px;align-items:center;animation:spUp .4s var(--tipAt) cubic-bezier(.16,1,.3,1) both}
#spotlight .sp-tip span:first-child{flex:none;font:11px Silkscreen,monospace;background:#3E7775;color:#FFF0CF;padding:4px 8px;border-radius:3px}
#spotlight .sp-tip span:last-child{font:600 calc(15px * var(--s)) "Atkinson Hyperlegible",system-ui,sans-serif;color:#FFF0CF;background:rgba(23,28,53,.92);border:2px solid #3E7775;border-radius:6px;padding:6px 10px}
#spotlight.out .sp-band{animation:spWipeOut .34s cubic-bezier(.7,0,.84,0) both}
#spotlight.out .sp-artwrap{animation:spSink .3s cubic-bezier(.7,0,.84,0) both}
#spotlight.out .sp-text,#spotlight.out .sp-say,#spotlight.out .sp-tip{animation:spLeave .24s ease-in both}
#spotlight.out .sp-dim,#spotlight.out .sp-beam,#spotlight.out .sp-glow,#spotlight.out .sp-bar,#spotlight.out .sp-puff{animation:spGone .3s ease-in both}
@media (orientation:portrait),(max-width:760px){
 #spotlight{--s:.62;--lift:86px}
 #spotlight .sp-text{left:calc(var(--L) + var(--aw) * .72);right:max(12px,4vw);text-align:right;align-items:flex-end}
 #spotlight .sp-kick{align-self:flex-end}
 #spotlight .sp-tip{left:var(--L);right:max(12px,4vw);justify-content:flex-end}
 #spotlight .sp-say{left:auto;right:max(12px,4vw);max-width:62vw;bottom:calc(250px * var(--s) + var(--lift))}
 #spotlight .sp-name{font-size:24px}
 #spotlight .sp-bio{font-size:12px;max-width:none}
 #spotlight.has-bio .sp-band{bottom:calc(96px * var(--s) + var(--lift));height:calc(210px * var(--s))}
 #spotlight.has-bio .sp-text{bottom:calc(122px * var(--s) + var(--lift))}
 #spotlight.has-bio .sp-say{bottom:calc(350px * var(--s) + var(--lift))}
 #spotlight.has-bio .sp-artwrap,#spotlight.has-bio .sp-puff{bottom:calc(86px * var(--s) + var(--lift))}
 #spotlight.has-bio .sp-tip{bottom:calc(20px * var(--s) + var(--lift))}
}
@media (orientation:portrait) and (min-width:600px){#spotlight{--s:.9;--lift:96px}#spotlight .sp-name{font-size:36px}#spotlight .sp-bio{font-size:16px}#spotlight .sp-text{left:calc(var(--L) + var(--aw) * .9)}}
@keyframes spFade{from{opacity:0}to{opacity:1}}
@keyframes spGone{to{opacity:0}}
@keyframes spBarT{from{transform:translateY(-100%)}to{transform:none}}
@keyframes spBarB{from{transform:translateY(100%)}to{transform:none}}
@keyframes spFlash{0%{opacity:0}20%{opacity:.55}100%{opacity:0}}
@keyframes spBeam{0%{opacity:0;transform:scaleX(.15)}60%{opacity:1}100%{opacity:1;transform:none}}
@keyframes spGlow{from{opacity:0;transform:scaleX(.3)}to{opacity:1;transform:none}}
@keyframes spWipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes spEdge{0%{transform:translateX(-100%);opacity:1}80%{opacity:1}100%{transform:none;opacity:0}}
@keyframes spGlint{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
@keyframes spWipeOut{from{clip-path:inset(0 0 0 0)}to{clip-path:inset(0 0 0 100%)}}
@keyframes spPop{0%{opacity:0;transform:translateY(70%) scale(.85,1.15)}25%{opacity:1}55%{transform:translateY(-7%) scale(.95,1.07)}75%{transform:translateY(0) scale(1.1,.9)}88%{transform:scale(.97,1.03)}100%{transform:none}}
@keyframes spSink{to{transform:translateY(115%) scale(.9,1.1)}}
@keyframes spPuff{0%{opacity:1;transform:none}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.3)}}
@keyframes spBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes spHero{from{background-position-x:0}to{background-position-x:calc(-768px * var(--a))}}
@keyframes spCast{from{background-position-x:0}to{background-position-x:calc(-192px * var(--a))}}
@keyframes spIntern{from{background-position-x:0}to{background-position-x:calc(-224px * var(--a))}}
@keyframes spStamp{0%{opacity:0;transform:scale(1.9) rotate(-8deg)}60%{opacity:1;transform:scale(.92) rotate(1deg)}100%{transform:none}}
@keyframes spDrop{0%{opacity:0;transform:translateY(-.9em) rotate(-10deg)}60%{opacity:1}100%{transform:none}}
@keyframes spSay{from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}}
@keyframes spType{from{opacity:0}to{opacity:1}}
@keyframes spUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes spLeave{to{opacity:0;transform:translateX(-24px)}}
@media (prefers-reduced-motion:reduce){#spotlight *,#spotlight *::after{animation:none!important}#spotlight.out{opacity:0}#spotlight .sp-flash,#spotlight .sp-edgebar,#spotlight .sp-glint,#spotlight .sp-puff{display:none}}`;
    document.head.appendChild(st);
  }

  function menuOpen() {
    return ["levelup-modal", "bonus-modal", "lounge-modal", "pause-modal", "gameover-modal", "title-modal", "retire80-modal"]
      .some(id => { const el = document.getElementById(id); return el && !el.classList.contains("hidden"); });
  }

  function render(c) {
    css();
    if (!root) { root = document.createElement("div"); root.id = "spotlight"; root.setAttribute("role", "status"); root.setAttribute("aria-live", "polite"); document.body.appendChild(root); }
    const portrait = matchMedia("(orientation:portrait),(max-width:760px)").matches;
    const big = portrait && innerWidth >= 600;
    const a = c.artType === "intern" ? (big ? 3.4 : portrait ? 2.5 : 4) : c.artType === "boss" ? (big ? 1.6 : portrait ? 1.15 : 1.9) : c.artType === "hero" ? (big ? 2.1 : portrait ? 1.5 : 2.5) : (big ? 3.8 : portrait ? 2.8 : 4.6);
    const artW = c.artType === "intern" ? 56 * a : c.artType === "boss" ? 144 * a : c.artType === "hero" ? 96 * a : 48 * a;
    root.className = (c.boss ? "boss" : "") + (c.bio ? " has-bio" : "");
    root.style.setProperty("--a", a);
    root.style.setProperty("--aw", artW + "px");
    root.style.setProperty("--artw", (portrait ? 0 : artW) + "px");
    root.style.setProperty("--edge", c.edge || "#3E7775");
    root.style.setProperty("--band", c.band || "#303750");
    // Letters of the name drop in one by one; words stay together so long names wrap cleanly.
    let li = 0;
    const nameHtml = String(c.name || "").split(" ").map(w => `<span class="w">${[...w].map(ch => `<i style="--i:${li++}">${esc(ch)}</i>`).join("")}</span>`).join(" ");
    // The line types itself after the bubble pops, a bit after the name lands.
    const sayAt = Math.min(1.3, .55 + li * .028);
    let ci = 0;
    const sayHtml = String(c.line || "").split(" ").map(w => [...w].map(ch => `<i style="--c:${ci++}">${esc(ch)}</i>`).join("")).join(" ");
    root.style.setProperty("--sayAt", sayAt.toFixed(2) + "s");
    root.style.setProperty("--tipAt", Math.max(1.15, sayAt + .3).toFixed(2) + "s");
    const puff = [[-46, -10], [-30, 14], [-12, 22], [12, 22], [30, 14], [46, -10]].map(([x, y]) => `<i style="--dx:${x}px;--dy:${-y}px"></i>`).join("");
    const artStyle = c.art ? `background-image:url(${JSON.stringify(c.art).slice(1, -1)})` : "";
    root.innerHTML = `
      <div class="sp-dim"></div>
      ${c.boss ? `<div class="sp-bar t"></div><div class="sp-bar b"></div><div class="sp-flash"></div>` : ""}
      ${c.art ? `<div class="sp-beam"></div><div class="sp-glow"></div>` : ""}
      <div class="sp-band"><div class="sp-edgebar"></div><div class="sp-glint"></div></div>
      ${c.art ? `<div class="sp-artwrap"><div class="sp-art ${c.artType}" style="${artStyle}"></div></div><div class="sp-puff">${puff}</div>` : ""}
      <div class="sp-say" title="Tap to dismiss" aria-label="${esc(c.line)}"><span aria-hidden="true">${sayHtml}</span></div>
      <div class="sp-text"><span class="sp-kick">${esc(c.kicker)}</span><span class="sp-name" aria-label="${esc(c.name)}"><span aria-hidden="true">${nameHtml}</span></span>${c.bio ? `<span class="sp-bio">${esc(c.bio)}</span>` : ""}</div>
      ${c.tip ? `<div class="sp-tip"><span>${esc(c.tipLabel || "TIP")}</span><span>${esc(c.tip)}</span></div>` : ""}`;
    root.querySelector(".sp-say").addEventListener("pointerdown", e => { e.stopPropagation(); hide(); });
    if (typeof sfx === "function") sfx(c.boss ? "bossSpawn" : "pick");
  }

  // Pacing (Nov 3, Rami: "they come in real hot one after another"). Age 45 used to stack a boss, a promotion,
  // the Lounge and a tip back to back. Now:
  //   - cards keep a breather between them (gapMs), except a boss, which cuts in right away
  //   - a boss bumps whatever lower card is up, and the bumped card is dropped, not replayed
  //   - each card waits only so long (maxWaitMs); if it's stale by then it's skipped
  //   - the Lounge card shows once per run, and not right after a room card (that card's tip already points there)
  const PRI = { boss: 3, hire: 2, room: 1, lounge: 1, tip: 0 };
  const PACE = { gapMs: 15000, maxWaitMs: { hire: 20000, room: 40000, lounge: 15000, tip: 20000, boss: 15000 } };
  let lastHiddenAt = -1e9, lastShownKind = null, run = { lounge: false, lastRoomAt: -1e9 };

  function hide() {
    clearTimeout(hideTimer);
    if (!root || !showing) return;
    root.classList.add("out");
    const r = root;
    setTimeout(() => { if (!showing) { r.innerHTML = ""; r.className = ""; } }, 380);
    showing = null;
    lastHiddenAt = performance.now();
  }

  function show(card) {
    card.at = performance.now();
    card.kind = card.kind || "tip";
    // A promotion and a boss often land in the same second (age 45). The room card waits a beat, so if a boss is
    // coming, the boss goes first and the room card follows after the breather instead of being cut off.
    if (card.kind === "room") card.notBefore = card.at + 2500;
    if (card.kind === "lounge") {
      const roomNear = card.at - run.lastRoomAt < 45000 || queue.some(c => c.kind === "room") || (showing && showing.kind === "room");
      if (run.lounge || roomNear) return; // once a run, and never next to a room card
      run.lounge = true;
    }
    queue = queue.filter(c => c.kind !== card.kind || card.kind === "boss"); // newest of each kind wins
    queue.push(card);
    queue.sort((a, b) => (PRI[b.kind] || 0) - (PRI[a.kind] || 0) || a.at - b.at);
  }

  // Check every 250 ms. A menu opening hides the current card.
  setInterval(() => {
    const now = performance.now();
    if (showing && menuOpen()) { hide(); return; }
    queue = queue.filter(c => now - c.at < (PACE.maxWaitMs[c.kind] || 20000)); // stale cards are skipped
    const ready = queue.filter(c => !c.notBefore || c.notBefore <= now);
    if (!ready.length || menuOpen()) return;
    const next = ready[0];
    if (showing) {
      if (next.kind === "boss" && showing.kind !== "boss") { hide(); } // a boss cuts in
      return;
    }
    if (next.kind !== "boss" && now - lastHiddenAt < PACE.gapMs) return; // breather between cards
    showing = next; queue = queue.filter(c => c !== next);
    if (showing.seenKey) remember(showing.seenKey); // once-ever cards count as seen only when they actually show
    if (showing.kind === "room") run.lastRoomAt = now;
    render(showing);
    hideTimer = setTimeout(hide, showing.ms || S().durationMs || 6000);
  }, 250);

  // Boss and coworker sheets use a magenta key color; the game's loaded textures are already cleaned,
  // so borrow those (as an image URL, cached) and fall back to the file if the texture isn't ready.
  const urlCache = {};
  function texUrl(key, fallback) {
    if (urlCache[key]) return urlCache[key];
    try {
      const sc = window._activeGameScene;
      if (sc && sc.textures.exists(key)) {
        const src = sc.textures.get(key).getSourceImage();
        if (src && src.toDataURL) return (urlCache[key] = src.toDataURL());
        if (src) { const c = document.createElement("canvas"); c.width = src.width; c.height = src.height; c.getContext("2d").drawImage(src, 0, 0); return (urlCache[key] = c.toDataURL()); }
      }
    } catch (e) {}
    return fallback;
  }
  // Warm up the hero portrait sheets so the sprite rises with the card instead of popping in late.
  setTimeout(() => { Object.values(S().heroSheets || {}).forEach(slug => { const im = new Image(); im.src = `${ROOT}assets/characters/portraits/${slug}.png`; }); ((window.INTERNS || {}).roster || []).forEach(r => { if (r.portrait) { const im = new Image(); im.src = ROOT + r.portrait; } }); Object.values(S().rooms || {}).forEach(R => { if (R.cast) { const im = new Image(); im.src = `${ROOT}assets/stage/coworkers/portraits/coworker-${R.cast}-on-break-v1.png`; } }); }, 3000);
  const heroId = () => (typeof meta !== "undefined" && meta && meta.selectedChar) || "officeWorker";
  const heroArt = id => `${ROOT}assets/characters/portraits/${(S().heroSheets || {})[id] || "office-worker-on-break-v1"}.png`;

  return {
    boss(kind) {
      const B = (S().bosses || {})[kind]; if (!B) return false;
      show({ kind: "boss", boss: true, kicker: B.kicker, name: B.name, line: B.line, tip: B.tip, art: texUrl("bossart_" + kind, B.art), artType: "boss", edge: B.edge, band: B.band });
      return true;
    },
    room(area) {
      const R = (S().rooms || {})[area]; if (!R) return false;
      const cw = (window.START_AREA_COWORKERS || {})[R.cast];
      // Standing On Break portrait (ChatGPT, Nov 3; same 96x112 format as the heroes). Falls back to the desk sprite.
      const portrait = R.cast ? `${ROOT}assets/stage/coworkers/portraits/coworker-${R.cast}-on-break-v1.png` : null;
      show({ kind: "room", kicker: R.kicker, name: R.name, line: R.line, tip: R.tip, art: portrait || texUrl("slice_coworker_" + R.cast, cw && cw.src), artType: portrait ? "hero" : "cast", edge: "#83A89A", band: "#3E7775" });
      return true;
    },
    lounge(r) {
      const line = (r.lines || [])[Math.floor(Math.random() * (r.lines || []).length)] || "Cash only.";
      show({ kind: "lounge", kicker: "NOW OPEN", name: "THE LOUNGE", line: r.name + ": " + line, tip: "Follow the arrow to the Break Room counter.",
             // On Break portrait (same 96x112 format as the heroes, by ChatGPT); falls back to the counter sprite.
             art: (r.portrait ? ROOT + r.portrait : null) || ((window._activeGameScene && _activeGameScene.textures.exists("intern2_" + r.id)) ? r.sheet : null), artType: r.portrait ? "hero" : "intern", edge: "#EF9347", band: "#3E7775", ms: 5000 });
      return true;
    },
    hire(id) {
      // Every run opens with your hero's card (Rami, Nov 3): who they are and how they play.
      const H = (S().hires || {})[id]; if (!H) return false;
      show({ kind: "hire", kicker: H.kicker, name: H.name, bio: H.bio, line: H.line, tip: H.style || H.tip, tipLabel: H.style ? "PLAY STYLE" : "TIP", art: heroArt(id), artType: "hero", edge: "#BFA8CF", band: "#303750", ms: H.bio ? 7500 : 5000 });
      return true;
    },
    tip(key) {
      const T = (S().tips || {})[key]; if (!T || seen["tip_" + key]) return false;
      if (window.tipsEnabled && !window.tipsEnabled()) return false;
      const id = heroId();
      show({ seenKey: "tip_" + key, kind: "tip", kicker: T.kicker, name: (S().heroNames || {})[id] || "YOU", line: (T.lines || {})[id] || (T.lines || {}).any, tip: T.tip, art: heroArt(id), artType: "hero", edge: "#EF9347", band: "#303750", ms: 5000 });
      return true;
    },
    hide, texUrl, isShowing: () => !!showing, reset: () => { queue = []; hide(); }, newRun: () => { queue = []; hide(); lastHiddenAt = -1e9; run = { lounge: false, lastRoomAt: -1e9 }; }, resetSeen: () => { seen = {}; try { localStorage.removeItem("ms-spotlight-seen-v1"); } catch (e) {} }
  };
})();
