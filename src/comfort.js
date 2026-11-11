// Photosensitivity: one switch for flashing, a cap on how often the screen can flash, and a first-visit warning. (Nov 11)
// Kevin's playtest note: "an epilepsy warning might be worth considering... the screen [is] strobing pretty frequently"
// at high levels. Two layers:
//   1. Always on, for everyone: full-screen flashes are capped (one every 600 ms at most) and white kill pops are
//      budgeted (see JUICE.whitePopsPerBeat), so a maxed-out fight can't strobe faster than about 3 times a second.
//   2. "Reduce flashing" in Settings > Game (or the device's Reduce Motion setting): no full-screen flashes,
//      no white kill pops or rings, no boss flicker, softer hurt tint, gentler shakes.
// Anywhere in the game, ask window.reduceFlashing() before a flash, blink or strobe.
window.COMFORT = {
  storageKey: "ms-reduce-flashing",     // "1" = on, "0" = off, missing = follow the device setting
  warnedKey: "ms-flash-warning-seen",
  cameraFlashGapMs: 600,                // at most one full-screen flash in this window, even with the switch off
  calmShakeScale: 0.35                  // shakes are this strong when reduce flashing is on
};

(function () {
  const C = window.COMFORT;
  const deviceCalm = () => { try { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; } };
  const stored = () => { try { return localStorage.getItem(C.storageKey); } catch (e) { return null; } };

  window.reduceFlashing = function () {
    const s = stored();
    if (s === "1") return true;
    if (s === "0") return false;
    return deviceCalm();
  };
  window.setReduceFlashing = function (on) {
    try { localStorage.setItem(C.storageKey, on ? "1" : "0"); } catch (e) {}
    syncClass();
  };
  function syncClass() { document.documentElement.classList.toggle("ms-calm", window.reduceFlashing()); }
  syncClass();

  // CSS flashes that only listened to the device setting now also listen to the in-game switch.
  const css = document.createElement("style");
  css.textContent = `
html.ms-calm #spotlight .sp-flash, html.ms-calm #spotlight .sp-glint, html.ms-calm #catch-moment .cm-burst,
html.ms-calm .rt-confetti { display: none !important; }
html.ms-calm .center-flash, html.ms-calm .reorg-edge i, html.ms-calm .vs-combo, html.ms-calm .ms-bar.low > .ms-fill,
html.ms-calm #status-row .low .t, html.ms-calm .shop-badge.new { animation: none !important; }
#comfort-modal .comfort-card { max-width: 520px; width: min(520px, calc(100vw - 32px)); text-align: left; }
#comfort-modal .comfort-body { font: 16px/1.45 'Atkinson Hyperlegible', sans-serif; color: var(--ms-white); margin: 0 0 var(--ms-s3, 12px); }
#comfort-modal .comfort-body b { color: var(--ms-cream); }`;
  document.head.appendChild(css);

  // Patch Phaser's camera once, so every flash and shake in the game goes through the same rules.
  function patchPhaser() {
    const Cam = window.Phaser && Phaser.Cameras && Phaser.Cameras.Scene2D && Phaser.Cameras.Scene2D.Camera;
    if (!Cam || Cam.prototype._comfortPatched) return;
    const flash = Cam.prototype.flash, shake = Cam.prototype.shake;
    let lastFlash = -1e9;
    Cam.prototype.flash = function (duration, r, g, b, force, cb, ctx) {
      if (window.reduceFlashing()) return this;
      const now = performance.now();
      if (now - lastFlash < C.cameraFlashGapMs) return this;
      lastFlash = now;
      return flash.call(this, duration, r, g, b, force, cb, ctx);
    };
    Cam.prototype.shake = function (duration, intensity, force, cb, ctx) {
      if (window.reduceFlashing() && intensity != null) {
        const k = C.calmShakeScale;
        intensity = typeof intensity === "number" ? intensity * k : { x: intensity.x * k, y: intensity.y * k };
      }
      return shake.call(this, duration, intensity, force, cb, ctx);
    };
    Cam.prototype._comfortPatched = true;
  }
  patchPhaser();

  // ---------- First-visit warning (a small sheet over the title) ----------
  let modal = null;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div"); modal.id = "comfort-modal"; modal.className = "ui-modal hidden ms-sheet-host";
    modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-labelledby", "comfort-title");
    (document.getElementById("ui-layer") || document.body).appendChild(modal);
    return modal;
  }
  function render(onDone) {
    const m = ensureModal(), calm = window.reduceFlashing();
    m.innerHTML = `
    <div class="modal-card ms-sheet comfort-card">
      <div class="ms-sheet-strip">HR · RE: <b>Health and safety</b></div>
      <h2 class="ms-sheet-title" id="comfort-title">FLASHING LIGHTS</h2>
      <p class="comfort-body">This game has <b>flashing lights and fast-moving effects</b>, and they get busier the longer you survive. A small number of people may have a seizure when they see certain lights or patterns, even with no history of epilepsy.</p>
      <p class="comfort-body">If you feel dizzy, see things twitch or get a headache, <b>stop playing</b> and take a break. You can turn flashing down now, or any time in Settings.</p>
      <div class="ms-rows">
        <button type="button" class="ms-row" id="comfort-toggle" data-opt-cycle="1">
          <span><span class="ms-row-title">Reduce flashing</span><span class="ms-row-sub">No screen flashes, softer hits and shakes</span></span>
          <span class="ms-row-val ${calm ? "on" : "off"}">${calm ? "ON" : "OFF"}</span></button>
      </div>
      <div class="ms-sheet-actions"><div class="ms-left"></div>
        <button type="button" class="ms-btn primary" id="comfort-ok"><span class="ms-btn-label">GOT IT</span></button></div>
    </div>`;
    const bind = (id, row, fn, def) => {
      const el = document.getElementById(id); if (!el) return;
      if (typeof bindNavItem === "function") bindNavItem(el, row, fn, def);
      else el.addEventListener("click", fn);
    };
    bind("comfort-toggle", 0, () => { window.setReduceFlashing(!window.reduceFlashing()); try { sfx("pick"); } catch (e) {} render(onDone); }, false);
    bind("comfort-ok", 1, () => {
      try { localStorage.setItem(C.warnedKey, "1"); } catch (e) {}
      try { sfx("pick"); } catch (e) {}
      m.classList.add("hidden"); m.innerHTML = ""; window.comfortModalOpen = false;
      if (window.menuNav) window.menuNav.refresh();
      if (onDone) onDone();
    }, true);
    if (window.menuNav) window.menuNav.refresh();
  }
  function show(onDone) {
    ensureModal().classList.remove("hidden"); window.comfortModalOpen = true;
    render(onDone);
  }
  function maybeWarn(onDone) {
    let seen = false; try { seen = localStorage.getItem(C.warnedKey) === "1"; } catch (e) {}
    if (seen) { if (onDone) onDone(); return false; }
    show(onDone); return true;
  }
  window.Comfort = { maybeWarn, show, patchPhaser };
})();
