// Midlife Survivors universal navigation (Nov 3, Rami: "one unified experience").
// Load it on any page (game or devlog). It builds the same bar everywhere: on devlog pages it takes over the
// existing <header class="site-header">; in the game it adds one at the top. The ▲ button tucks it away
// (remembered per browser) and a MENU tab brings it back. During an actual run the game hides it completely.
(function () {
  const me = document.currentScript;
  const root = new URL("../../", me ? me.src : location.href); // the site root (where index.html for the game lives)
  const u = p => new URL(p, root).href;
  const HIDE_KEY = "ms-nav-hidden";
  const path = location.pathname;
  const section = /\/devlog\/art\//.test(path) ? "art" : /\/devlog\/about\//.test(path) ? "about" : /\/devlog\//.test(path) ? "memos" : "play";
  const inGame = section === "play";

  const links = [
    { id: "play",  label: "▶ Title Screen", href: u("./"), cls: "primary" },
    { id: "memos", label: "📝 Devlog", href: u("devlog/") },
    { id: "art",   label: "Art Room", href: u("devlog/art/") },
    { id: "about", label: "About",   href: u("devlog/about/") },
    { id: "discord", label: "💬 Discord", href: "https://discord.gg/E6N9j5tZe", ext: true },
    { id: "coffee", label: '☕ <span class="ms-nav-long">Buy Rami a </span>Coffee', href: "https://ko-fi.com/ramidaud", cls: "coffee", ext: true }
  ];
  const linkHtml = links.map(l => `<a class="ms-nav-btn ${l.cls || ""}" href="${l.href}"${l.ext ? ' target="_blank" rel="noopener"' : ""}${l.id === section ? ' aria-current="page"' : ""}>${l.label}</a>`).join("");

  let header = document.querySelector("header.site-header");
  const adopted = !!header;
  if (!header) { header = document.createElement("header"); document.body.insertBefore(header, document.body.firstChild); }
  const wasCompact = header.classList.contains("is-compact");
  header.className = "ms-nav" + (wasCompact ? " is-compact" : "") + (inGame ? " ms-fixed" : "");
  if (!header.id) header.id = "site-header";
  header.setAttribute("aria-label", "Site navigation");
  header.style.setProperty("--ms-nav-mark", `url("${u("assets/branding/clock-mark-v1.svg")}")`);
  header.innerHTML = `
    <a class="ms-nav-brand" id="brand-home" href="${inGame ? u("./") : u("devlog/")}">
      <span class="ms-nav-mark" aria-hidden="true"></span>
      <span><span class="ms-nav-title">Midlife Survivors</span><span class="ms-nav-sub">${inGame ? "The game" : "Devlog · Internal memos"}</span></span>
    </a>
    <nav class="ms-nav-links">${linkHtml}<button class="ms-nav-btn hide" type="button" aria-label="Hide the menu bar" title="Hide the menu bar">▲</button></nav>`;

  const tab = document.createElement("button");
  tab.className = "ms-nav-tab"; tab.type = "button"; tab.textContent = "▼ MENU"; tab.setAttribute("aria-label", "Show the menu bar");
  document.body.appendChild(tab);

  function measure() {
    const h = header.hidden ? 0 : Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--ms-nav-h", h + "px");
  }
  function setHidden(h, save) {
    header.hidden = h; tab.hidden = !h;
    if (save) { try { localStorage.setItem(HIDE_KEY, h ? "1" : "0"); } catch (e) {} }
    measure();
    window.dispatchEvent(new Event("ms-nav-change"));
  }
  // Soft menu sounds in the game (the devlog stays silent)
  const tick = n => { try { if (inGame && typeof window.sfx === "function") window.sfx(n); } catch (e) {} };
  header.querySelectorAll(".ms-nav-btn, .ms-nav-brand").forEach(a => {
    a.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") tick("uiHover"); });
    a.addEventListener("click", () => tick("pick"));
  });
  header.querySelector(".hide").addEventListener("click", () => setHidden(true, true));
  tab.addEventListener("click", () => setHidden(false, true));
  // Taps in the bar shouldn't reach the game underneath (steering, menus)
  ["pointerdown", "touchstart"].forEach(ev => { header.addEventListener(ev, e => e.stopPropagation()); tab.addEventListener(ev, e => e.stopPropagation()); });
  let hidden = false; try { hidden = localStorage.getItem(HIDE_KEY) === "1"; } catch (e) {}
  setHidden(hidden, false);
  window.addEventListener("resize", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.MSNav = { setHidden, measure, adopted };

  // Controller support on the site pages (Nov 5, Rami: "once I go to the devlog it loses all control").
  // D-pad or left stick moves between links and buttons by where they sit on screen; with nothing further that way it
  // scrolls the page. A opens, B goes back (or to the game). The game has its own controller code, so this is off there.
  if (!inGame && navigator.getGamepads) {
    const st = document.createElement("style");
    st.textContent = `.ms-pad-focus{outline:3px solid #EF9347!important;outline-offset:3px;border-radius:4px}`;
    document.head.appendChild(st);
    let focused = null, prev = {}, holdDir = null, nextAt = 0;
    const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden" && el.getAttribute("aria-current") !== "page"; };
    const items = () => Array.from(document.querySelectorAll("a[href], button:not([disabled]), [tabindex='0']")).filter(visible);
    const setFocus = el => { if (focused) focused.classList.remove("ms-pad-focus"); focused = el; if (!el) return; el.classList.add("ms-pad-focus"); try { el.focus({ preventScroll: true }); } catch (e) {} el.scrollIntoView({ block: "nearest", behavior: "smooth" }); };
    const onScreen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
    function move(dir) {
      const list = items();
      if (!focused || !list.includes(focused) || !onScreen(focused)) { // start from the first thing in view
        const first = list.find(onScreen); if (first) { setFocus(first); return; }
      }
      const horiz = dir === "left" || dir === "right", sign = (dir === "right" || dir === "down") ? 1 : -1;
      if (focused) {
        const a = focused.getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2;
        let best = null, bestS = Infinity;
        for (const el of list) {
          if (el === focused) continue;
          const b = el.getBoundingClientRect(), bx = b.left + b.width / 2, by = b.top + b.height / 2;
          const main = horiz ? (bx - ax) * sign : (by - ay) * sign; if (main <= 4) continue;
          if (!horiz && Math.abs(by - ay) > innerHeight * 0.6) continue; // far below: scroll to it instead of leaping
          const side = horiz ? Math.abs(by - ay) : Math.abs(bx - ax);
          const sc = main + side * 2; if (sc < bestS) { bestS = sc; best = el; }
        }
        if (best) { setFocus(best); return; }
      }
      if (!horiz) window.scrollBy({ top: sign * innerHeight * 0.45, behavior: "smooth" });
    }
    function poll() {
      const gp = Array.from(navigator.getGamepads() || []).find(g => g && g.connected);
      if (gp) {
        const b = i => !!(gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.5));
        const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
        const now = performance.now();
        const dir = b(12) || ay < -0.55 ? "up" : b(13) || ay > 0.55 ? "down" : b(14) || ax < -0.55 ? "left" : b(15) || ax > 0.55 ? "right" : null;
        if (!dir) holdDir = null;
        else if (dir !== holdDir) { holdDir = dir; nextAt = now + 300; move(dir); }
        else if (now >= nextAt) { nextAt = now + 150; move(dir); }
        const ry = gp.axes[3] || 0; if (Math.abs(ry) > 0.3) window.scrollBy({ top: ry * 18 }); // right stick: free scroll
        const A = b(0), B = b(1);
        if (A && !prev.A && focused) focused.click();
        if (B && !prev.B) { if (history.length > 1) history.back(); else location.href = u("./"); }
        prev = { A, B };
      }
      requestAnimationFrame(poll);
    }
    window.addEventListener("gamepadconnected", () => { if (!focused) move("down"); });
    requestAnimationFrame(poll);
  }
})();
