// Corporate Buyout (Nov 5, Kevin's idea). Once per fiscal year (window.SEASONS), a player with 401(k) Shop ranks is
// offered a choice: cash out every rank for a share of what they spent and start the year level with everyone
// (plus a BOUGHT OUT tag on this year's board), or keep everything. Nothing happens without a tap.
window.Buyout = (() => {
  function spent(m) {
    return (window.META_SHOP || []).reduce((s, it) => { const r = (m.ranks && m.ranks[it.id]) || 0; return s + it.baseCost * r * (r + 1) / 2; }, 0) + (m.shopInflationPaid || 0);
  }
  function ranksOwned(m) { return Object.values(m.ranks || {}).reduce((a, b) => a + (b || 0), 0); }
  function maybeOffer() {
    const S = window.SEASONS, m = typeof meta !== "undefined" ? meta : window.meta;
    if (!S || !m || document.getElementById("buyout-modal")) return;
    const season = S.current();
    if (m.seasonSeen === season.id) return;
    if (ranksOwned(m) === 0) { m.seasonSeen = season.id; saveMeta(m); return; } // nothing to buy out
    const pay = Math.round(spent(m) * (S.buyoutRate || 0.5));
    const el = document.createElement("div"); el.id = "buyout-modal"; el.className = "ui-modal"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Corporate Buyout");
    el.innerHTML = `<div class="bo-card"><div class="bo-head">MEMO · RE: CORPORATE BUYOUT</div>
      <p class="bo-lead"><b>${season.name}</b> has started. Corporate is offering everyone a fresh start.</p>
      <p>Cash out your <b>${ranksOwned(m)} shop ranks</b> for <b>+${pay}k</b> in your 401(k), start the year level with everyone, and wear a <span class="lb-legacy lb-buyout">BOUGHT OUT</span> tag on this year's board.</p>
      <p class="bo-small">Or keep everything you've built. Your call, and it's only asked once a fiscal year.</p>
      <div class="bo-btns"><button type="button" class="bo-btn bo-take">TAKE THE BUYOUT (+${pay}k)</button><button type="button" class="bo-btn bo-keep">KEEP MY RANKS</button></div></div>`;
    if (!document.getElementById("buyout-css")) {
      const st = document.createElement("style"); st.id = "buyout-css";
      st.textContent = `#buyout-modal{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;background:#0b0e1fcc}
        #buyout-modal .bo-card{width:min(460px,100%);background:#171C35;border:3px solid #F2D7A1;border-radius:8px;color:#FFF0CF;font:15px/1.45 "Atkinson Hyperlegible",sans-serif;overflow:hidden}
        #buyout-modal .bo-head{background:#F2D7A1;color:#171C35;font:13px Silkscreen,monospace;padding:8px 14px}
        #buyout-modal p{margin:10px 14px}#buyout-modal .bo-small{color:#D3B78D;font-size:13px}
        #buyout-modal .bo-btns{display:grid;gap:8px;padding:6px 14px 14px}
        #buyout-modal .bo-btn{font:12px Silkscreen,monospace;min-height:44px;border-radius:6px;cursor:pointer;border:2px solid #3E7775;background:#1f2640;color:#FFF0CF}
        #buyout-modal .bo-take{background:#EF9347;color:#171C35;border-color:#EF9347}`;
      document.head.appendChild(st);
    }
    (document.getElementById("ui-layer") || document.body).appendChild(el);
    const close = () => { m.seasonSeen = season.id; saveMeta(m); el.remove(); if (window.menuNav) menuNav.refresh(); if (typeof renderTitleModal === "function" && window._activeGameScene && titleOpen) renderTitleModal(window._activeGameScene); };
    const take = () => {
      (window.META_SHOP || []).forEach(it => { m.ranks[it.id] = 0; }); m.shopInflationPaid = 0;
      m.coins = (m.coins || 0) + pay; m.boughtOut = season.id;
      if (typeof sfx === "function") sfx("coin");
      close();
    };
    const keep = () => { if (typeof sfx === "function") sfx("pick"); close(); };
    const tb = el.querySelector(".bo-take"), kb = el.querySelector(".bo-keep");
    if (window.bindNavItem) { bindNavItem(tb, 0, take); bindNavItem(kb, 1, keep, true); // the cursor starts on KEEP so a stray press never wipes the shop } else { tb.onclick = take; kb.onclick = keep; }
    if (window.menuNav) menuNav.refresh();
  }
  return { maybeOffer, spent };
})();
