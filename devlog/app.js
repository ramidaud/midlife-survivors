(function () {
  const params = new URLSearchParams(location.search);
  const showDrafts = params.has("drafts");
  const posts = (window.DEVLOG_POSTS || []).filter(p => showDrafts || !p.draft);
  const hotspots = window.DEVLOG_HOTSPOTS || [];

  const homeView = document.getElementById("home-view");
  const postView = document.getElementById("post-view");
  const listMain = document.getElementById("list-main");
  const postMain = document.getElementById("post-main");
  const header = document.getElementById("site-header");
  const tipEl = document.getElementById("live-tip");
  const brandHome = document.getElementById("brand-home");

  const fmt = d => new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]
  ));
  const draftQ = showDrafts ? "&drafts=1" : "";
  const draftOnly = showDrafts ? "?drafts=1" : "./";

  brandHome.href = draftOnly === "./" ? "./" : "./?drafts=1";

  function coverUrl(p) {
    return p.cover || "img/office-key-art-hero-960.jpg";
  }

  // Reading order (Nov 3): "new" = newest first (get caught up), "old" = from the start (follow along).
  // Remembered per reader. Read memos get a check mark.
  const SORT_KEY = "devlog-sort", READ_KEY = "devlog-read";
  let sortMode = "new";
  try { sortMode = localStorage.getItem(SORT_KEY) === "old" ? "old" : "new"; } catch (e) {}
  let readSet = new Set();
  try { readSet = new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]")); } catch (e) {}
  function markRead(slug) {
    readSet.add(slug);
    try { localStorage.setItem(READ_KEY, JSON.stringify([...readSet])); } catch (e) {}
  }
  const memoNo = p => { const m = /^(\d+)/.exec(p.slug); return m ? +m[1] : posts.length - posts.indexOf(p); };
  const two = n => String(n).padStart(2, "0");
  const ordered = () => sortMode === "old" ? posts.slice().reverse() : posts.slice();
  const readMark = p => readSet.has(p.slug) ? `<span class="read-mark" title="You read this one">✓ Read</span>` : "";
  function sortToggle() {
    return `<div class="sort-toggle" role="group" aria-label="Reading order">
      <button type="button" data-sort="new" aria-pressed="${sortMode === "new"}">Newest first</button>
      <button type="button" data-sort="old" aria-pressed="${sortMode === "old"}">From the start</button>
    </div>`;
  }
  let currentSlug = null;
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-sort]");
    if (!b) return;
    sortMode = b.dataset.sort === "old" ? "old" : "new";
    try { localStorage.setItem(SORT_KEY, sortMode); } catch (e2) {}
    if (currentSlug) renderSeries(currentSlug); else renderList();
  });

  function renderList() {
    currentSlug = null;
    header.classList.remove("is-compact");
    homeView.hidden = false;
    postView.hidden = true;
    document.title = "Midlife Survivors Devlog";
    if (!posts.length) {
      listMain.innerHTML = `<p class="empty">No filed memos yet. Pass <code>?drafts=1</code> to preview drafts.</p>`;
      return;
    }
    // The first memo in reading order gets the spotlight: the newest one, or memo 01 when reading from the start.
    const fromStart = sortMode === "old";
    const [lead, ...rest] = ordered();
    const changes = (lead.changes || []).slice(0, 4).map(c => `<li>${esc(c)}</li>`).join("");
    const unread = posts.filter(p => !readSet.has(p.slug)).length;
    listMain.innerHTML = `
      <div class="list-head">
        <div class="section-label">${fromStart ? "Start here" : "Latest memo"}</div>
        ${sortToggle()}
      </div>
      <p class="sort-hint">${fromStart
        ? `Reading the whole story in order, ${posts.length} memos. Switch to <b>Newest first</b> to get caught up.`
        : `Just here for the latest? Start below. Want the whole story? Switch to <b>From the start</b>.`}
        ${readSet.size ? ` <span class="read-count">${posts.length - unread} of ${posts.length} read.</span>` : ""}</p>
      <a class="feature" href="?post=${esc(lead.slug)}${draftQ}">
        <div class="feature-cover" style="background-image:url('${esc(coverUrl(lead))}')" role="img" aria-label="${esc(lead.leadAlt || "")}">
          <span class="feature-badge">${fromStart ? "MEMO 01 · START HERE" : "NEW MEMO"}</span>
        </div>
        <div class="feature-body">
          <div class="card-meta">
            <span class="memo-num">MEMO ${two(memoNo(lead))}</span>
            <time class="stamp" data-slug="${esc(lead.slug)}" datetime="${esc(lead.date)}">${fmt(lead.date)}</time>
            ${lead.version ? `<span class="pill">${esc(lead.version)}</span>` : ""}
            ${lead.draft ? `<span class="pill draft">DRAFT</span>` : ""}
            ${readMark(lead)}
          </div>
          <h2 class="feature-title">${esc(lead.title)}</h2>
          <p class="card-teaser">${esc(lead.teaser || "")}</p>
          ${changes ? `<ul class="feature-changes">${changes}</ul>` : ""}
          <span class="btn btn-primary feature-cta">${fromStart ? "Start the story →" : "Read the memo →"}</span>
        </div>
      </a>
      ${rest.length ? `<div class="section-label earlier-label">${fromStart ? "Then, in order" : "Filed earlier"}</div>` : ""}
      <ul class="card-list">${rest.map(p => `
      <li>
        <a class="card${readSet.has(p.slug) ? " is-read" : ""}" href="?post=${esc(p.slug)}${draftQ}">
          <div class="card-cover" style="background-image:url('${esc(coverUrl(p))}')" role="img" aria-label=""><span class="card-num">${two(memoNo(p))}</span></div>
          <div class="card-body">
            <div class="card-meta">
              <time class="stamp" data-slug="${esc(p.slug)}" datetime="${esc(p.date)}">${fmt(p.date)}</time>
              ${p.version ? `<span class="pill">${esc(p.version)}</span>` : ""}
              ${p.draft ? `<span class="pill draft">DRAFT</span>` : ""}
              ${readMark(p)}
            </div>
            <h2 class="card-title">${esc(p.title)}</h2>
            <p class="card-teaser">${esc(p.teaser || "Open memo for the full debrief.")}</p>
          </div>
        </a>
      </li>`).join("")}</ul>`;
    if (window.DevlogHome) window.DevlogHome.stampPosts();
  }

  // Post sidebar: every memo in reading order, with "you are here" and check marks.
  function renderSeries(slug) {
    const el = document.getElementById("post-series");
    if (!el) return;
    const readN = posts.filter(p => readSet.has(p.slug)).length;
    el.innerHTML = `
      <div class="side-eyebrow">The whole story · ${posts.length} memos</div>
      ${sortToggle()}
      <div class="series-progress" aria-label="${readN} of ${posts.length} read"><span style="width:${Math.round(readN / posts.length * 100)}%"></span></div>
      <div class="series-count">${readN} of ${posts.length} read</div>
      <ol class="series">${ordered().map(p => {
        const here = p.slug === slug, read = readSet.has(p.slug);
        return `<li class="${here ? "here" : ""}${read ? " read" : ""}">
          <a href="?post=${esc(p.slug)}${draftQ}"${here ? ` aria-current="page"` : ""}>
            <span class="s-no">${two(memoNo(p))}</span>
            <span class="s-title">${esc(p.title)}${here ? `<em>You are here</em>` : ""}</span>
            <span class="s-mark" aria-hidden="true">${read && !here ? "✓" : ""}</span>
          </a></li>`;
      }).join("")}</ol>`;
  }

  function neighbors(slug) {
    const i = posts.findIndex(p => p.slug === slug);
    return { prev: i < posts.length - 1 ? posts[i + 1] : null, next: i > 0 ? posts[i - 1] : null, i };
  }

  // "What happened before" and "What's next" cards at the end of every memo.
  function sequel(post, prev, next) {
    const card = (p, dir) => `
      <a class="sequel-card ${dir}" href="?post=${esc(p.slug)}${draftQ}">
        <span class="sequel-eyebrow">${dir === "prev" ? "← What happened before" : "What's next →"} · Memo ${two(memoNo(p))}</span>
        <span class="sequel-cover" style="background-image:url('${esc(coverUrl(p))}')" aria-hidden="true"></span>
        <span class="sequel-title">${esc(p.title)}</span>
        <span class="sequel-teaser">${esc(p.teaser || "")}</span>
        ${readMark(p)}
      </a>`;
    const start = `
      <div class="sequel-card prev is-start">
        <span class="sequel-eyebrow">Where it started</span>
        <span class="sequel-title">This is memo 01. Nothing before it but a photographer and a blank folder.</span>
        <a class="btn btn-ghost" href="${draftOnly}">See all memos</a>
      </div>`;
    const soon = `
      <div class="sequel-card next is-soon">
        <span class="sequel-eyebrow">What's next · Memo ${two(memoNo(post) + 1)} <b class="pill">IN PROGRESS</b></span>
        <span class="sequel-title">${esc(post.nextUp || "The next memo is being built right now.")}</span>
        <span class="sequel-teaser">You're all caught up. Get the next one when it's filed:</span>
        <span class="todos">
          <a class="todo" href="https://ramidaud.substack.com" rel="noopener">Substack (email)</a>
          <a class="todo" href="feed.xml">RSS</a>
          <a class="todo" href="https://discord.gg/E6N9j5tZe" rel="noopener">Discord</a>
        </span>
      </div>`;
    return `<nav class="sequel" aria-label="Previous and next memos">${prev ? card(prev, "prev") : start}${next ? card(next, "next") : soon}</nav>`;
  }

  // Thin orange bar across the top showing how far into the memo you are.
  const progressBar = document.querySelector("#read-progress span");
  function updateProgress() {
    if (!progressBar || postView.hidden) return;
    const art = postMain.querySelector("article.post");
    if (!art) return;
    const r = art.getBoundingClientRect();
    const total = r.height - window.innerHeight * 0.6;
    const pct = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    progressBar.style.width = (pct * 100).toFixed(1) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  async function renderPost(slug) {
    const post = posts.find(p => p.slug === slug);
    if (!post) { renderList(); return; }
    currentSlug = slug;
    header.classList.add("is-compact");
    homeView.hidden = true;
    postView.hidden = false;
    document.title = post.title + " · Midlife Survivors Devlog";
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "/devlog/" + slug + "/", title: post.title }); } catch (e) {} // count post views

    let md = "_Couldn't load this memo._";
    try {
      const r = await fetch(`posts/${post.slug}.md?t=${Date.now()}`); // always the latest text
      if (r.ok) md = await r.text();
    } catch (e) {}

    // Rewrite relative img/ paths that already include img/ in markdown
    // Code snippets: ```js src/file.js ... ``` becomes a code card with a file tab (styled by code.js + styles.css).
    const codeCards = [];
    md = md.replace(/^```(\w+)[ \t]*([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm, (m, lang, file, body) => {
      codeCards.push(`<figure class="code-card"><figcaption><span class="code-file">${esc(file.trim() || lang)}</span><span class="code-lang">${esc(lang.toUpperCase())}</span><button class="code-copy" type="button">Copy</button></figcaption><pre><code>${esc(body)}</code></pre></figure>`);
      return `\n\nCODECARD${codeCards.length - 1}\n\n`; // placeholder, swapped back after markdown
    });
    // Sidenotes: write ^[a note] in the markdown. It becomes a small orange number;
    // the note sits in the margin on wide screens and opens under the line when tapped on phones.
    let snCount = 0;
    md = md.replace(/\^\[([^\]]+)\]/g, (m, note) => {
      snCount++;
      const inner = window.marked ? marked.parseInline(note) : esc(note);
      return `<button class="sn-ref" type="button" aria-expanded="false" aria-controls="sn-${snCount}" aria-label="Note ${snCount}">${snCount}</button><span class="sn" id="sn-${snCount}" role="note"><span class="sn-head"><b>${snCount}</b><button class="sn-close" type="button" aria-label="Close note">×</button></span><span class="sn-body">${inner}</span></span>`;
    });
    let html = window.marked
      ? marked.parse(md, { gfm: true })
      : `<pre>${esc(md)}</pre>`;
    html = html.replace(/<p>CODECARD(\d+)<\/p>/g, (m, i) => codeCards[+i] || "");

    const { prev, next } = neighbors(post.slug);
    const play = post.playUrl || "https://ramidaud.github.io/midlife-survivors/";
    const changes = Array.isArray(post.changes) && post.changes.length
      ? `<div class="changes-box"><h3>What changed</h3><ul>${post.changes.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>`
      : "";
    // Optional leadNote (markdown): how the lead image was made (tool + prompt). Shows as a margin note marker.
    const leadNote = post.leadNote
      ? `<button class="sn-ref sn-art" type="button" aria-expanded="false" aria-controls="sn-lead" aria-label="How this image was made">ART</button><span class="sn" id="sn-lead" role="note"><span class="sn-head"><b>ART</b><button class="sn-close" type="button" aria-label="Close note">×</button></span><span class="sn-body">${window.marked ? marked.parseInline(post.leadNote) : esc(post.leadNote)}</span></span>`
      : "";
    // Every memo opens with a strong visual: a looping gameplay clip if there is one, otherwise the cover.
    const leadSrc = post.leadVideo || post.cover || "";
    const lead = post.leadVideo
      ? `<figure class="post-lead"><video src="${esc(post.leadVideo)}" poster="${esc(post.cover || "")}" autoplay muted loop playsinline controls aria-label="${esc(post.leadAlt || post.title)}"></video>${post.leadAlt ? `<figcaption>${esc(post.leadAlt)}</figcaption>` : ""}</figure>`
      : (post.cover ? `<figure class="post-lead"><img src="${esc(post.cover)}" alt="${esc(post.leadAlt || post.title)}">${post.leadAlt || post.leadNote ? `<figcaption>${esc(post.leadAlt || "")}${leadNote}</figcaption>` : ""}</figure>` : "");
    const nextUp = post.nextUp
      ? `<div class="next-up"><strong>Next up</strong>${esc(post.nextUp)}</div>`
      : "";

    postMain.innerHTML = `
      <a class="back" href="${draftOnly}">← All memos</a>
      <div class="memo-strip">
        <span class="re">MEMO · RE:</span>
        <strong>${esc(post.title)}</strong>
      </div>
      <div class="post-header">
        <h1>${esc(post.title)}</h1>
        <div class="post-meta">
          <span class="memo-num">MEMO ${two(memoNo(post))} <i>of ${two(posts.length)}</i></span>
          <time class="stamp" data-slug="${esc(post.slug)}" datetime="${esc(post.date)}">${fmt(post.date)}</time>
          ${!next ? `<span class="pill new">LATEST</span>` : ""}
          ${post.version ? `<span class="pill">${esc(post.version)}</span>` : ""}
          ${post.draft ? `<span class="pill draft">DRAFT</span>` : ""}
        </div>
      </div>
      ${lead}
      <div class="post-cta">
        <div><a class="btn btn-primary" href="${esc(play)}">▶ Play this build</a></div>
        ${changes}
        ${nextUp}
      </div>
      <article class="post">
        <div class="prose">${html}</div>
        <div class="signoff">
          <div class="silk">Filed by Rami.</div>
          Survived to ${esc(post.version || "the next build")}. Screenshots are from the real game at the time.
        </div>
      </article>
      ${sequel(post, prev, next)}`;
    // Respect "reduce motion": clips stay paused until the reader presses play.
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".post-lead video, .prose video").forEach(v => { v.removeAttribute("autoplay"); v.pause(); });
    }
    markRead(post.slug);
    renderSeries(post.slug);
    if (window.DevlogHome) { window.DevlogHome.stampPosts(); window.DevlogHome.postBuilds(post.slug); }
    if (window.initSidenotes) initSidenotes(postMain);
    if (window.initCodeCards) initCodeCards(postMain);
    window.scrollTo(0, 0);
    updateProgress();
  }

  /* —— Key-art hotspots —— */
  let openId = null;

  function closeTip() {
    openId = null;
    tipEl.hidden = true;
    tipEl.classList.remove("is-open");
    tipEl.innerHTML = "";
    document.querySelectorAll(".hotspot, .hotspot-chip").forEach(el => el.classList.remove("is-open"));
  }

  function tipHtml(h) {
    const link = h.post ? `<a href="?post=${esc(h.post)}${draftQ}">Related memo →</a>` : "";
    return `<div class="ht-label">${esc(h.label)}</div>
      <p class="ht-joke">“${esc(h.joke)}”</p>
      <p class="ht-tip">${esc(h.tip || "")}</p>${link}`;
  }

  function placeTipForHotspot(h, anchorEl) {
    tipEl.innerHTML = tipHtml(h);
    tipEl.hidden = false;
    tipEl.classList.add("is-open");
    tipEl.style.position = "fixed";
    const pad = 12;
    tipEl.style.left = "0px";
    tipEl.style.top = "0px";
    const tw = tipEl.offsetWidth || 240;
    const th = tipEl.offsetHeight || 140;
    const hero = document.querySelector(".hero");
    const heroRect = hero ? hero.getBoundingClientRect() : null;
    let left, top;
    // Prefer % coords on the hero so layout races can't pin the tip to 0,0
    if (heroRect && heroRect.width > 40) {
      const cx = heroRect.left + (h.x / 100) * heroRect.width;
      const cy = heroRect.top + (h.y / 100) * heroRect.height;
      left = cx + 18;
      top = cy - 10;
      if (left + tw > window.innerWidth - pad) left = cx - tw - 18;
    } else {
      const r = anchorEl.getBoundingClientRect();
      left = r.right + 10;
      top = r.top;
      if (left + tw > window.innerWidth - pad) left = r.left - tw - 10;
    }
    if (left < pad) left = pad;
    if (top + th > window.innerHeight - pad) top = window.innerHeight - th - pad;
    if (top < pad) top = pad;
    tipEl.style.left = left + "px";
    tipEl.style.top = top + "px";
  }

  function openHotspot(h, anchorEl) {
    if (openId === h.id) { closeTip(); return; }
    openId = h.id;
    document.querySelectorAll(".hotspot, .hotspot-chip").forEach(el => {
      el.classList.toggle("is-open", el.dataset.id === h.id);
    });
    placeTipForHotspot(h, anchorEl);
  }

  function buildHotspots() {
    const layer = document.getElementById("hotspot-layer");
    const strip = document.getElementById("hotspot-strip");
    if (!layer || !strip) return;
    layer.innerHTML = hotspots.map(h => `
      <button type="button" class="hotspot" data-id="${esc(h.id)}"
        style="left:${h.x}%;top:${h.y}%;width:${Math.max(28, (h.w || 8) * 0.9)}px;height:${Math.max(28, (h.h || 8) * 0.9)}px"
        aria-label="${esc(h.label)}" title="${esc(h.label)}"></button>`).join("");
    strip.innerHTML = hotspots.map(h =>
      `<button type="button" class="hotspot-chip" data-id="${esc(h.id)}">${esc(h.label)}</button>`
    ).join("");

    const onActivate = (id, el) => {
      const h = hotspots.find(x => x.id === id);
      if (h) openHotspot(h, el);
    };
    layer.querySelectorAll(".hotspot").forEach(btn => {
      btn.addEventListener("click", e => { e.stopPropagation(); onActivate(btn.dataset.id, btn); });
    });
    strip.querySelectorAll(".hotspot-chip").forEach(btn => {
      btn.addEventListener("click", e => { e.stopPropagation(); onActivate(btn.dataset.id, btn); });
    });
  }

  document.addEventListener("click", e => {
    if (!tipEl.contains(e.target) && !e.target.closest(".hotspot, .hotspot-chip")) closeTip();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeTip(); });
  window.addEventListener("resize", () => { if (openId) closeTip(); });

  // Support ?hotspot= for screenshotting tooltip state
  function mountPinnedTip(h) {
    // Guaranteed on-art tip card (also used for screenshots). Absolute inside .hero.
    let pin = document.getElementById("pinned-tip");
    if (!pin) {
      pin = document.createElement("div");
      pin.id = "pinned-tip";
      pin.className = "hotspot-tip is-open";
      pin.style.position = "absolute";
      pin.style.zIndex = "20";
      pin.style.display = "block";
      document.querySelector(".hero").appendChild(pin);
    }
    pin.innerHTML = tipHtml(h);
    pin.hidden = false;
    const left = Math.min(72, Math.max(4, h.x + 3));
    const top = Math.min(70, Math.max(8, h.y - 6));
    // Prefer left of hotspot if near right edge
    if (h.x > 70) {
      pin.style.left = "auto";
      pin.style.right = (100 - h.x + 3) + "%";
    } else {
      pin.style.left = left + "%";
      pin.style.right = "auto";
    }
    pin.style.top = top + "%";
    tipEl.hidden = true; // avoid duplicate floating tip in shot mode
  }

  function maybeAutoOpen() {
    const id = params.get("hotspot");
    if (!id) return;
    const btn = document.querySelector('.hotspot[data-id="' + id + '"]') ||
      document.querySelector('.hotspot-chip[data-id="' + id + '"]');
    const h = hotspots.find(x => x.id === id);
    if (!h) return;
    if (params.has("hotspotShot") || params.has("hotspot")) {
      mountPinnedTip(h);
      document.querySelectorAll(".hotspot, .hotspot-chip").forEach(el => {
        el.classList.toggle("is-open", el.dataset.id === h.id);
      });
      openId = h.id;
    }
    if (btn && !params.has("hotspotShot")) openHotspot(h, btn);
  }

  async function route() {
    const slug = params.get("post");
    if (slug) await renderPost(slug);
    else renderList();
  }

  buildHotspots();
  route();
  // Wait for CSS/layout (and fonts) so % hotspot coords resolve before placing the tip.
  const afterLayout = () => {
    maybeAutoOpen();
  };
  if (document.readyState === "complete") {
    requestAnimationFrame(() => requestAnimationFrame(afterLayout));
  } else {
    window.addEventListener("load", () => requestAnimationFrame(afterLayout));
  }
})();
