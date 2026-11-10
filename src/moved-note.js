// "We moved" note (Nov 6, Rami): the game moved from ramidaud.github.io/midlife-survivors to midlifesurvivors.com.
// Browsers keep saves per address, so guests start fresh here while signed-in players get their file from the cloud.
// The title screen says so once per browser, until the end of the year. Leaderboard scores live online, so they made the move.
window.MovedNote = (() => {
  const NOTE = {
    host: "midlifesurvivors.com",
    until: "2027-01-01",                 // stop showing after this date
    seenKey: "ms-moved-note-seen-v1",
    kicker: "FACILITIES · RE: <b>We moved</b>", // B7: one strip pattern
    title: "WE MOVED",
    body: "Welcome to <b>midlifesurvivors.com</b>, the office's new address. If you played as a guest before the move, your coins, shop ranks and medals stayed behind at the old address. Sorry about that, and thank you for playing. Your leaderboard scores made the move.",
    signedOut: "Were you signed in before? Clock in and your file comes right back.",
  };
  let el = null;
  const seen = () => { try { return localStorage.getItem(NOTE.seenKey) === "1"; } catch (e) { return true; } };
  const markSeen = () => { try { localStorage.setItem(NOTE.seenKey, "1"); } catch (e) {} };
  function close() { if (el) el.remove(); el = null; window.movedNoteOpen = false; markSeen(); }
  function show() {
    if (el) return;
    const signedIn = window.Account && Account.signedIn && Account.signedIn();
    el = document.createElement("div");
    el.id = "moved-note"; el.className = "ui-modal ms-sheet-host";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "moved-title");
    el.innerHTML = `<style>
#moved-note .mv-card{max-width:440px;width:min(440px,calc(100vw - 32px));text-align:left}
#moved-note .mv-row{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
#moved-note .mv-btn{flex:1;min-width:140px;padding:12px;border-radius:6px;border:2px solid #3E7775;background:rgba(48,55,80,.85);color:#FFF0CF;font:13px/1.2 "Silkscreen",monospace;cursor:pointer}
#moved-note .mv-btn.primary{background:#EF9347;border-color:#EF9347;color:#171C35}
#moved-note .mv-btn:focus-visible,#moved-note .mv-btn:hover{outline:2px solid #FFF0CF;outline-offset:2px}
</style>
<div class="modal-card mv-card ms-shell">
  <div class="ms-sheet-strip">${NOTE.kicker}</div>
  <h2 class="modal-title" id="moved-title">${NOTE.title}</h2>
  <p class="modal-sub">${NOTE.body}</p>
  ${signedIn ? "" : `<p class="modal-sub">${NOTE.signedOut}</p>`}
  <div class="mv-row ms-shell-actions">
    ${signedIn ? "" : `<button type="button" class="ms-btn secondary mv-btn" data-mv="clockin"><span class="ms-btn-label">CLOCK IN</span><span class="ms-btn-sub">Keep your file everywhere</span></button>`}
    <button type="button" class="ms-btn primary mv-btn" data-mv="ok"><span class="ms-btn-label">GOT IT</span></button>
  </div>
</div>`;
    (document.getElementById("ui-layer") || document.body).appendChild(el);
    window.movedNoteOpen = true;
    el.querySelector('[data-mv="ok"]').addEventListener("click", close);
    const ci = el.querySelector('[data-mv="clockin"]');
    if (ci) ci.addEventListener("click", () => { close(); if (window.Account && Account.open) Account.open(); });
    el.addEventListener("keydown", e => { if (e.key === "Escape") { e.stopPropagation(); close(); } });
    setTimeout(() => { const b = el && el.querySelector('[data-mv="ok"]'); if (b) b.focus(); }, 50);
  }
  function maybeShow(tries = 0) {
    if (location.hostname !== NOTE.host && !/[?&]movednote=1/.test(location.search)) return;
    if (seen() && !/[?&]movednote=1/.test(location.search)) return;
    if (new Date() >= new Date(NOTE.until)) return;
    const onTitle = typeof titleOpen !== "undefined" && titleOpen && document.querySelector(".title-poster");
    const busy = window.accountModalOpen || window.changelogModalOpen || window.controlsModalOpen || window.loreModalOpen;
    if (!onTitle || busy) { if (tries < 20) setTimeout(() => maybeShow(tries + 1), 1000); return; }
    show();
  }
  setTimeout(maybeShow, 1800); // after the title screen is up and the account check has run
  return { show, close };
})();
