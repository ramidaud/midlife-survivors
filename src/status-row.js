// The status row (design system A5, Nov 10). One home for the little chips during a run, right under the HUD:
// at most ONE objective chip (where to go: Overtime beat, key hunt, errand) and ONE status chip (what's on you:
// Workload, a modifier, the Checked Off buff). The chips are still made by their own files; this file just
// collects them into one row, picks who shows, and gives them one look (spec 5.7: the Chip).
//   Phone: under the HUD in the column beside the corner map (full width before you find the map).
//   iPad and desktop: centered under the age bar, 560 px at most.
window.StatusRow = (() => {
  const OBJECTIVE = ["otb-chip", "keyhunt-chip", "errand-chip"];   // first visible one wins
  const STATUS = ["workload-chip", "mod-chip", "errand-buff"];     // danger first, then the modifier, then the buff
  let row = null;

  function css() {
    if (document.getElementById("status-row-css")) return;
    const st = document.createElement("style"); st.id = "status-row-css";
    const ids = OBJECTIVE.concat(STATUS).map(id => "#status-row #" + id);
    st.textContent = `
#status-row{position:fixed;z-index:var(--ms-z-status,20);left:50%;transform:translateX(-50%);top:calc(var(--ms-nav-h,0px) + var(--ms-hud-b,122px));
  width:min(560px,calc(100vw - 2 * (232px + 10px + var(--ms-space-4,16px))));display:flex;flex-direction:column;align-items:center;gap:var(--ms-space-2,8px);pointer-events:none}
${ids.join(",")}{position:static!important;transform:none!important;left:auto!important;right:auto!important;top:auto!important;margin:0!important;max-width:100%!important;
  box-sizing:border-box;min-height:28px;border-radius:var(--ms-radius-s,2px)!important;box-shadow:var(--ms-shadow-card)!important;background:var(--ms-plate)!important;
  color:var(--ms-text)!important;border:var(--ms-border-w,2px) solid var(--chip-edge)!important;border-left-width:6px!important;padding:4px 10px!important}
/* objective chips: cream edge, label in pixel caps, the sentence in the reading font */
#status-row #errand-chip,#status-row #keyhunt-chip,#status-row #otb-chip{--chip-edge:var(--ms-paper);width:100%;font:600 var(--ms-body-s,14px)/1.3 var(--ms-font-read)!important}
#status-row #errand-chip b,#status-row #keyhunt-chip b,#status-row #otb-chip b{color:var(--ms-paper);font:var(--ms-label-s,11px)/1 var(--ms-font-label)}
#status-row #errand-chip .t,#status-row #otb-chip .t{color:var(--ms-paper);font:var(--ms-label-m,13px)/1 var(--ms-font-label);font-variant-numeric:tabular-nums}
#status-row #errand-chip.low .t,#status-row #otb-chip.low .t{color:var(--ms-accent);animation:sr-blink 1s steps(2) infinite}
#status-row #errand-chip.done{--chip-edge:var(--ms-ok)}
#status-row #otb-chip{--chip-edge:var(--ms-paper)}
/* status chips: a noun and a number, edge by kind (modifier coffee, buff sage, Workload danger) */
#status-row #mod-chip,#status-row #workload-chip,#status-row #errand-buff{font:var(--ms-label-s,11px)/1.2 var(--ms-font-label)!important;letter-spacing:var(--ms-label-track);display:flex;align-items:center}
#status-row #mod-chip{--chip-edge:var(--ms-accent);color:var(--ms-paper)!important}
#status-row #errand-buff{--chip-edge:var(--ms-ok)}
#status-row #errand-buff b{color:var(--ms-text)}
#status-row #workload-chip{--chip-edge:var(--ms-danger)}
#status-row .sr-wait{display:none!important}
@keyframes sr-blink{50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){#status-row .low .t{animation:none!important}}
/* centered, but never under the corner map (172 wide on portrait screens, 232 elsewhere) */
@media (max-width:760px),(orientation:portrait){#status-row{width:min(560px,calc(100vw - 2 * (172px + 6px + var(--ms-space-4,16px))))}}
@media (max-height:499px){#status-row{width:min(560px,calc(100vw - 2 * (136px + 10px + var(--ms-space-4,16px))))}} /* sideways phone: the small map (A8) */
/* phone: beside the corner map (full width before you find it); it steps aside while a headline is up */
@media (max-width:599px){#status-row{width:auto;left:var(--ms-space-2,8px);right:var(--ms-space-2,8px);transform:none;
    top:calc(var(--ms-nav-h,0px) + max(var(--ms-hud-b,122px), var(--ms-hud-left-b,118px)))} /* under the loadout slots too */
  #status-row.mm-up{right:calc(172px + 6px + var(--ms-space-2,8px));align-items:stretch} /* beside the corner map (172 wide, 6 from the edge) */
  html.ms-headline #status-row{visibility:hidden}
  #status-row #errand-chip,#status-row #keyhunt-chip,#status-row #otb-chip{flex-wrap:wrap;row-gap:2px}
  #status-row #errand-chip>span:not(.t),#status-row #keyhunt-chip>span:not(.t),#status-row #otb-chip>span:not(.t){order:3;flex-basis:100%}}
html.ms-sheet #status-row{visibility:hidden}`;
    document.head.appendChild(st);
  }
  const shown = el => !!el && !el.classList.contains("hidden") && el.style.display !== "none";

  function sync() {
    if (!row) { css(); row = document.createElement("div"); row.id = "status-row"; row.setAttribute("role", "status"); document.body.appendChild(row); }
    // collect the chips (each file makes its own the first time it's needed)
    OBJECTIVE.concat(STATUS).forEach(id => { const el = document.getElementById(id); if (el && el.parentNode !== row) row.appendChild(el); });
    const pick = list => { let won = false; list.forEach(id => { const el = document.getElementById(id); if (!el) return;
      const on = shown(el) && !won; if (on) won = true; el.classList.toggle("sr-wait", !on && shown(el)); }); };
    pick(OBJECTIVE); pick(STATUS);
    // objective first, then status
    OBJECTIVE.concat(STATUS).forEach(id => { const el = document.getElementById(id); if (el) row.appendChild(el); });
    const mm = document.getElementById("minimap");
    row.classList.toggle("mm-up", !!mm && !mm.classList.contains("hidden") && getComputedStyle(mm).display !== "none");
  }
  // reorder only when something changed, so chips don't flicker
  let lastKey = "";
  setInterval(() => {
    const key = OBJECTIVE.concat(STATUS).map(id => { const el = document.getElementById(id); return el ? (shown(el) ? 1 : 0) + (el.parentNode && el.parentNode.id === "status-row" ? "r" : "") : "-"; }).join("") +
      (document.getElementById("minimap") ? document.getElementById("minimap").className : "");
    if (key !== lastKey) { lastKey = key; sync(); }
  }, 150);
  return { sync };
})();
