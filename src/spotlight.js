// Spotlight cards (Nov 3, Style B): a big animated lower third for key moments.
// A slanted band sweeps in, a big sprite rises from the bottom left, the character says one line, and a tip sits under it.
// It doesn't pause the game and you can tap it away. Copy lives in src/data/spotlight.js.
// Usage: Spotlight.boss(kind), Spotlight.room(areaId), Spotlight.hire(heroId), Spotlight.tip(key)  (tips: once ever)
window.Spotlight = (() => {
  const S = () => window.SPOTLIGHT || {};
  let root = null, queue = [], showing = null, hideTimer = 0;
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem("ms-spotlight-seen-v1") || "{}"); } catch (e) {}
  const remember = k => { seen[k] = 1; try { localStorage.setItem("ms-spotlight-seen-v1", JSON.stringify(seen)); } catch (e) {} };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function css() {
    if (document.getElementById("spotlight-css")) return;
    const st = document.createElement("style"); st.id = "spotlight-css";
    st.textContent = `
#spotlight{position:fixed;inset:0;z-index:9;pointer-events:none;overflow:hidden;--s:1}
#spotlight .sp-dim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(23,28,53,0) 45%,rgba(23,28,53,.7) 85%);animation:spFade .3s ease-out both}
#spotlight .sp-bar{position:absolute;left:0;right:0;height:44px;background:#171C35}
#spotlight .sp-bar.t{top:0;animation:spBarT .35s ease-out both}#spotlight .sp-bar.b{bottom:0;animation:spBarB .35s ease-out both}
#spotlight .sp-flash{position:absolute;inset:0;background:#C45C4B;mix-blend-mode:screen;animation:spFlash .5s .25s ease-out both}
#spotlight .sp-band{position:absolute;left:-40px;right:-40px;bottom:calc(76px * var(--s));height:calc(138px * var(--s));border-top:6px solid var(--edge);border-bottom:6px solid var(--edge);background:var(--band);box-shadow:0 0 0 4px #171C35;animation:spBand .4s .1s cubic-bezier(.2,1,.3,1) both}
#spotlight .sp-art{position:absolute;left:max(12px,4vw);bottom:calc(66px * var(--s));image-rendering:pixelated;filter:drop-shadow(0 0 14px var(--edge));animation:spRise .55s .25s cubic-bezier(.2,1.5,.4,1) both}
#spotlight .sp-art.boss{width:calc(144px * var(--a));height:calc(152px * var(--a));background-size:calc(576px * var(--a)) calc(456px * var(--a));background-position:0 0;animation:spRise .55s .25s cubic-bezier(.2,1.5,.4,1) both,spBob 1.6s 1s ease-in-out infinite}
#spotlight .sp-art.hero{width:calc(96px * var(--a));height:calc(112px * var(--a));background-size:calc(768px * var(--a)) calc(336px * var(--a));background-position:0 calc(-112px * var(--a));animation:spRise .55s .25s cubic-bezier(.2,1.5,.4,1) both,spHero 1.12s steps(8) infinite}
#spotlight .sp-art.cast{width:calc(48px * var(--a));height:calc(56px * var(--a));background-size:calc(192px * var(--a)) calc(224px * var(--a));background-position:0 0;animation:spRise .55s .25s cubic-bezier(.2,1.5,.4,1) both,spCast .9s steps(4) infinite}
#spotlight .sp-text{position:absolute;left:calc(max(12px,4vw) + var(--artw) + 18px);right:max(16px,4vw);bottom:calc(98px * var(--s));display:flex;flex-direction:column;gap:6px;animation:spName .45s .4s cubic-bezier(.2,1.3,.4,1) both}
#spotlight .sp-kick{align-self:flex-start;font:calc(13px * var(--s)) Silkscreen,monospace;letter-spacing:.1em;color:#171C35;background:#F2D7A1;padding:3px 9px}
#spotlight .sp-name{font:700 calc(44px * var(--s))/1 Silkscreen,monospace;color:#FFF0CF;text-shadow:4px 4px 0 #171C35;overflow-wrap:anywhere}
#spotlight .sp-say{position:absolute;left:calc(max(12px,4vw) + var(--artw) * .6);bottom:calc(232px * var(--s));max-width:min(560px,calc(100vw - 32px));background:#FFF0CF;color:#171C35;border:4px solid #171C35;border-radius:10px;padding:12px 16px;box-shadow:6px 6px 0 rgba(23,28,53,.6);font:700 calc(20px * var(--s))/1.3 "Atkinson Hyperlegible",system-ui,sans-serif;transform-origin:left bottom;animation:spSay .35s .75s cubic-bezier(.2,1.5,.4,1) both;pointer-events:auto;cursor:pointer}
#spotlight .sp-tip{position:absolute;left:calc(max(12px,4vw) + var(--artw) + 18px);right:max(16px,4vw);bottom:calc(30px * var(--s));display:flex;gap:10px;align-items:center;justify-self:start;animation:spFade .4s 1s ease-out both}
#spotlight .sp-tip span:first-child{flex:none;font:11px Silkscreen,monospace;background:#3E7775;color:#FFF0CF;padding:4px 8px;border-radius:3px}
#spotlight .sp-tip span:last-child{font:600 calc(15px * var(--s)) "Atkinson Hyperlegible",system-ui,sans-serif;color:#FFF0CF;background:rgba(23,28,53,.92);border:2px solid #3E7775;border-radius:6px;padding:6px 10px}
#spotlight.out{animation:spOut .35s ease-in both}
@media (orientation:portrait),(max-width:760px){
 #spotlight{--s:.62;--lift:86px}
 #spotlight .sp-band{bottom:calc(76px * var(--s) + var(--lift))}
 #spotlight .sp-art{bottom:calc(66px * var(--s) + var(--lift))}
 #spotlight .sp-text{bottom:calc(98px * var(--s) + var(--lift))}
 #spotlight .sp-tip{bottom:calc(30px * var(--s) + var(--lift))}
 #spotlight .sp-text{left:max(12px,4vw);right:max(12px,4vw);text-align:right;align-items:flex-end}
 #spotlight .sp-kick{align-self:flex-end}
 #spotlight .sp-tip{left:max(12px,4vw);right:max(12px,4vw);justify-content:flex-end}
 #spotlight .sp-say{left:auto;right:max(12px,4vw);max-width:62vw;bottom:calc(250px * var(--s) + var(--lift))}
 #spotlight .sp-name{font-size:24px}
}
@media (orientation:portrait) and (min-width:600px){#spotlight{--s:.9;--lift:96px}#spotlight .sp-name{font-size:36px}}
@keyframes spFade{from{opacity:0}to{opacity:1}}
@keyframes spBarT{from{transform:translateY(-100%)}to{transform:none}}
@keyframes spBarB{from{transform:translateY(100%)}to{transform:none}}
@keyframes spFlash{0%{opacity:0}20%{opacity:.55}100%{opacity:0}}
@keyframes spBand{from{transform:skewY(-4deg) translateX(110%)}to{transform:skewY(-4deg)}}
@keyframes spRise{from{transform:translateY(120%)}to{transform:none}}
@keyframes spBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes spHero{from{background-position-x:0}to{background-position-x:calc(-768px * var(--a))}}
@keyframes spCast{from{background-position-x:0}to{background-position-x:calc(-192px * var(--a))}}
@keyframes spName{from{transform:translateX(80px);opacity:0}to{transform:none;opacity:1}}
@keyframes spSay{from{transform:scale(.4);opacity:0}to{transform:none;opacity:1}}
@keyframes spOut{to{opacity:0;transform:translateY(20px)}}
@media (prefers-reduced-motion:reduce){#spotlight *{animation-duration:.01s!important;animation-iteration-count:1!important}#spotlight .sp-flash{display:none}}`;
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
    const a = c.artType === "boss" ? (big ? 1.6 : portrait ? 1.15 : 1.9) : c.artType === "hero" ? (big ? 2.1 : portrait ? 1.5 : 2.5) : (big ? 3.8 : portrait ? 2.8 : 4.6);
    const artW = c.artType === "boss" ? 144 * a : c.artType === "hero" ? 96 * a : 48 * a;
    root.className = "";
    root.style.setProperty("--a", a);
    root.style.setProperty("--artw", (portrait ? 0 : artW) + "px");
    root.style.setProperty("--edge", c.edge || "#3E7775");
    root.style.setProperty("--band", c.band || "#303750");
    const artStyle = c.art ? `background-image:url(${JSON.stringify(c.art).slice(1, -1)})` : "";
    root.innerHTML = `
      <div class="sp-dim"></div>
      ${c.boss ? `<div class="sp-bar t"></div><div class="sp-bar b"></div><div class="sp-flash"></div>` : ""}
      <div class="sp-band"></div>
      ${c.art ? `<div class="sp-art ${c.artType}" style="${artStyle}"></div>` : ""}
      <div class="sp-say" title="Tap to dismiss">${esc(c.line)}</div>
      <div class="sp-text"><span class="sp-kick">${esc(c.kicker)}</span><span class="sp-name">${esc(c.name)}</span></div>
      ${c.tip ? `<div class="sp-tip"><span>TIP</span><span>${esc(c.tip)}</span></div>` : ""}`;
    root.querySelector(".sp-say").addEventListener("pointerdown", e => { e.stopPropagation(); hide(); });
    if (typeof sfx === "function") sfx(c.boss ? "bossSpawn" : "pick");
  }

  function hide() {
    clearTimeout(hideTimer);
    if (!root || !showing) return;
    root.classList.add("out");
    const r = root;
    setTimeout(() => { if (!showing) r.innerHTML = ""; }, 380);
    showing = null;
  }

  function show(card) {
    queue.push(card);
    if (queue.length > 3) queue.splice(1, queue.length - 3); // keep it short during busy moments
  }

  // Check every 250 ms: show the next card when no menu is up; a menu opening hides the current one.
  setInterval(() => {
    if (showing && menuOpen()) { hide(); return; }
    if (showing || !queue.length || menuOpen()) return;
    showing = queue.shift();
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
  const heroId = () => (typeof meta !== "undefined" && meta && meta.selectedChar) || "officeWorker";
  const heroArt = id => `assets/characters/portraits/${(S().heroSheets || {})[id] || "office-worker"}-on-break-v1.png`;

  return {
    boss(kind) {
      const B = (S().bosses || {})[kind]; if (!B) return false;
      show({ boss: true, kicker: B.kicker, name: B.name, line: B.line, tip: B.tip, art: texUrl("bossart_" + kind, B.art), artType: "boss", edge: B.edge, band: B.band });
      return true;
    },
    room(area) {
      const R = (S().rooms || {})[area]; if (!R) return false;
      const cw = (window.START_AREA_COWORKERS || {})[R.cast];
      show({ kicker: R.kicker, name: R.name, line: R.line, tip: R.tip, art: texUrl("slice_coworker_" + R.cast, cw && cw.src), artType: "cast", edge: "#83A89A", band: "#3E7775" });
      return true;
    },
    hire(id) {
      const H = (S().hires || {})[id]; if (!H || seen["hire_" + id]) return false;
      remember("hire_" + id);
      show({ kicker: H.kicker, name: H.name, line: H.line, tip: H.tip, art: heroArt(id), artType: "hero", edge: "#BFA8CF", band: "#303750", ms: 5000 });
      return true;
    },
    tip(key) {
      const T = (S().tips || {})[key]; if (!T || seen["tip_" + key]) return false;
      if (window.tipsEnabled && !window.tipsEnabled()) return false;
      remember("tip_" + key);
      const id = heroId();
      show({ kicker: T.kicker, name: (S().heroNames || {})[id] || "YOU", line: (T.lines || {})[id] || (T.lines || {}).any, tip: T.tip, art: heroArt(id), artType: "hero", edge: "#EF9347", band: "#303750", ms: 5000 });
      return true;
    },
    hide, reset: () => { queue = []; hide(); }, resetSeen: () => { seen = {}; try { localStorage.removeItem("ms-spotlight-seen-v1"); } catch (e) {} }
  };
})();
