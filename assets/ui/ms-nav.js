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
})();
