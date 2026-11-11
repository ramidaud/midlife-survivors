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
  // The toggle carries its own hint bubble, pointing at the button you're NOT on.
  const TIP_KEY = "devlog-sort-tip-off";
  function sortToggle() {
    const tip = sortMode === "old"
      ? `<b>Catching up?</b> Switch to Newest first.`
      : `<b>New here?</b> Start from the beginning.`;
    return `<div class="sort-wrap">
      <div class="sort-toggle" role="group" aria-label="Reading order">
        <button type="button" data-sort="new" aria-pressed="${sortMode === "new"}">Newest first</button>
        <button type="button" data-sort="old" aria-pressed="${sortMode === "old"}">From the start</button>
      </div>
      <div class="sort-tip ${sortMode === "old" ? "point-left" : "point-right"}" role="note">${tip}<button type="button" class="sort-tip-x" aria-label="Hide this tip">×</button></div>
    </div>`;
  }
  // Pop the bubble for a few seconds after the list renders, unless the reader closed it before.
  function popSortTip(root) {
    let off = false;
    try { off = localStorage.getItem(TIP_KEY) === "1"; } catch (e) {}
    root.querySelectorAll(".sort-wrap").forEach(w => {
      if (off) { w.classList.add("tip-off"); return; }
      setTimeout(() => w.classList.add("tip-show"), 500);
      setTimeout(() => w.classList.remove("tip-show"), 6500);
    });
  }
  document.addEventListener("click", e => {
    if (!e.target.closest(".sort-tip-x")) return;
    try { localStorage.setItem(TIP_KEY, "1"); } catch (e2) {}
    document.querySelectorAll(".sort-wrap").forEach(w => { w.classList.remove("tip-show"); w.classList.add("tip-off"); });
  });
  let currentSlug = null;

  // "Your employee file": this reader's own numbers. The game and the devlog share one web address,
  // so we can read the game's save in this browser. Nothing is sent anywhere.
  const READ_GOAL = 10;
  function readJSON(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function renderStats() {
    const els = document.querySelectorAll(".your-file");
    if (!els.length) return;
    const meta = readJSON("midlife_survivors_save_v1", null);
    const scores = readJSON("ms-local-scores-v1", []).filter(r => (r.mode || "full") === "midlife");
    let name = ""; try { name = localStorage.getItem("ms-player-name") || ""; } catch (e) {}
    const best = scores.length ? Math.max(...scores.map(r => r.score || 0)) : 0;
    const bestAge = meta && meta.bestAge && meta.bestAge > 40 ? Number(meta.bestAge).toFixed(1) : "";
    const ach = meta && meta.achievements && meta.achievements.unlocked ? Object.keys(meta.achievements.unlocked).length : 0;
    const coins = meta ? Math.round(meta.coins || 0) : 0;
    const readN = readSet.size, pct = Math.min(100, Math.round(readN / READ_GOAL * 100));
    const unlocked = meta && meta.achievements && meta.achievements.unlocked && meta.achievements.unlocked.requiredReading;
    const played = !!(meta && (bestAge || best || coins));
    const goalLine = unlocked ? `<b>Required Reading</b> is yours. Thanks for reading the fine print.`
      : readN >= READ_GOAL ? `<b>Unlocked!</b> Clock in to claim <b>Required Reading</b> (+10k 401(k)).`
      : `Finish ${READ_GOAL} memos to unlock <b>Required Reading</b> in the game.${posts.length < READ_GOAL ? ` ${posts.length} are out so far, more on the way.` : ""}`;
    const html = `
      <div class="side-eyebrow">Your employee file</div>
      <div class="file-name">${played ? esc(name || "Unnamed employee") : "New hire"}<span>${played ? "Personnel record, this browser" : "No runs on file yet"}</span></div>
      ${played ? `<div class="stat-grid">
        <div><strong>${best ? best.toLocaleString("en-US") : "–"}</strong><span>best score${best ? "" : " (submit one!)"}</span></div>
        <div><strong>${bestAge || "40"}</strong><span>oldest age</span></div>
        <div><strong>${coins.toLocaleString("en-US")}k</strong><span>401(k) balance</span></div>
        <div><strong>${ach}</strong><span>achievements</span></div>
      </div>` : `<a class="btn btn-primary side-play" href="../">▶ Clock in for your first run</a>`}
      <div class="mini-head">Memos finished · ${readN} of ${READ_GOAL}</div>
      <div class="series-progress goal"><span style="width:${pct}%"></span></div>
      <p class="file-goal">${goalLine}</p>
      <p class="side-foot">Saved in this browser only. A memo counts when you scroll to the end.</p>`;
    els.forEach(el => { el.innerHTML = html; });
  }
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
    // Version range across the series, e.g. "V. 0.1" to "1.47", from each memo's version label.
    const verParts = v => String(v || "").replace(/^V\.\s*/, "").split(/\s+to\s+/);
    const firstVer = "V. " + (verParts(posts[posts.length - 1].version)[0] || "0.1");
    const lastVer = (verParts(posts[0].version).slice(-1)[0] || "");
    listMain.innerHTML = `
      <header class="list-intro">
        <div class="list-intro-top">
          <span class="list-intro-eyebrow">${fromStart ? "Start here" : "Latest memo"}</span>
          ${sortToggle()}
        </div>
        <h2 class="list-intro-title">${fromStart ? "The whole story, in order." : "What just shipped."}</h2>
        <p class="list-intro-sub">${fromStart
          ? `Memo 01 to ${two(posts.length)}, ${esc(firstVer)} to ${esc(lastVer)}. A first game in Phaser 3, built in public with AI, one playable build at a time.`
          : `${esc(lead.version || "")}. Each memo is a playable build, with the code, art and bugs behind it.`}</p>
        <div class="list-intro-meta">
          <span>${posts.length} memos</span>
          ${readSet.size ? `<span class="read-count">${posts.length - unread} of ${posts.length} read</span>` : ""}
        </div>
      </header>
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
      ${rest.length ? `<div class="section-label earlier-label">${fromStart ? "Then, in order" : "Earlier memos"}</div>` : ""}
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
    popSortTip(listMain);
    renderStats();
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
    // Dock the bar right under the sticky header, whatever height the header is on this device.
    const hb = header.getBoundingClientRect().bottom;
    document.documentElement.style.setProperty("--hdr-h", Math.max(0, Math.round(hb)) + "px");
    // Whole page, from the very first scroll (Rami, Nov 3), not just the article body.
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 1;
    progressBar.style.width = (pct * 100).toFixed(1) + "%";
    const bar = progressBar.parentElement, isDone = pct >= 0.995;
    if (isDone && !bar.classList.contains("done")) { bar.classList.remove("celebrate"); void bar.offsetWidth; bar.classList.add("celebrate"); }
    bar.classList.toggle("done", isDone);
    // Reaching the end of a memo counts it as read (feeds the Required Reading bonus in the game).
    if (pct >= 0.97 && currentSlug && !readSet.has(currentSlug)) {
      markRead(currentSlug);
      renderSeries(currentSlug);
      renderStats();
      finishedToast();
    }
  }
  function finishedToast() {
    const n = readSet.size, goal = READ_GOAL;
    const t = document.createElement("div");
    t.className = "read-toast";
    t.setAttribute("role", "status");
    t.innerHTML = n >= goal
      ? `<b>✓ Memo finished.</b> ${n} read. <em>Required Reading unlocked:</em> clock in to claim it.`
      : `<b>✓ Memo finished.</b> ${n} of ${goal} toward <em>Required Reading</em>.`;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 4200);
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
      codeCards.push(`<figure class="code-card lang-${esc(lang.toLowerCase())}"><figcaption><span class="code-file">${esc(file.trim() || lang)}</span><span class="code-lang">${esc(lang.toUpperCase())}</span><button class="code-copy" type="button">Copy</button></figcaption><pre><code>${esc(body)}</code></pre></figure>`);
      return `\n\nCODECARD${codeCards.length - 1}\n\n`; // placeholder, swapped back after markdown
    });
    // Audio cards: !audio[Label](path/to/file.mp3) on its own line becomes a play/pause player (audio.js).
    md = md.replace(/^!audio\[([^\]]+)\]\(([^)\s]+)\)[ \t]*$/gm, (m, label, src) => {
      codeCards.push(window.audioCardHTML ? audioCardHTML(label, src) : `<p><a href="${esc(src)}">▶ ${esc(label)}</a></p>`);
      return `\n\nCODECARD${codeCards.length - 1}\n\n`;
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
    // Drop cap: wrap just the first letter of the first paragraph (so "I've" gets a big I, not "I'")
    html = html.replace(/<p>([A-Za-z])/, '<p><span class="dropcap" aria-hidden="true">$1</span><span class="sr-only">$1</span>');
    // Before/after sliders: an image whose title is "compare: img/before.jpg | img/after.jpg" becomes a swipe slider here.
    // RSS, Substack and share pages keep the plain combined image, since email can't run a slider.
    // An optional third part names the tab when several sliders sit together: "compare: a.jpg | b.jpg | Title screen".
    html = html.replace(/<p>\s*<img src="([^"]*)" alt="([^"]*)" title="compare:\s*([^"|]+?)\s*\|\s*([^"|]+?)\s*(?:\|\s*([^"]+?)\s*)?">\s*<\/p>/g, (m, src, alt, a, b, label) =>
      `<figure class="ba-post" data-full="${src}" data-label="${esc(label || "")}"><div class="ba" style="--cut:50%">` +
      `<img class="ba-a" src="${a}" alt="Before. ${alt}"><div class="ba-b"><img src="${b}" alt=""></div>` +
      `<span class="ba-lab l">BEFORE</span><span class="ba-lab r">AFTER</span><div class="ba-handle" aria-hidden="true"></div>` +
      `<input type="range" min="0" max="100" value="50" step="0.5" aria-label="Drag to compare before and after"></div>` +
      `<figcaption class="ba-cap">Drag the slider to compare.</figcaption></figure>`);
    // Sliders that sit back to back become one "Then and now" box with tabs, so a memo isn't a wall of screenshots (Nov 4).
    let tabSet = 0;
    html = html.replace(/(?:<figure class="ba-post"[\s\S]*?<\/figure>\s*){2,}/g, block => {
      const figs = block.match(/<figure class="ba-post"[\s\S]*?<\/figure>/g), id = "bt" + (tabSet++);
      const chips = figs.map((f, i) => { const l = (f.match(/data-label="([^"]*)"/) || [])[1] || `View ${i + 1}`;
        return `<button type="button" role="tab" class="bt-chip" aria-selected="${i === 0}" aria-controls="${id}-${i}">${l}</button>`; }).join("");
      return `<div class="ba-tabs"><div class="bt-head"><span class="bt-title">THEN AND NOW</span><div class="bt-chips" role="tablist">${chips}</div></div>` +
        figs.map((f, i) => f.replace('<figure class="ba-post"', `<figure class="ba-post" role="tabpanel" id="${id}-${i}"${i ? " hidden" : ""}`)).join("") + `</div>`;
    });
    // Screenshots marked "gallery: Label" that sit together become one tidy grid of same-size tiles (tap for full size).
    html = html.replace(/(?:<p>\s*<img [^>]*title="gallery:[^"]*">\s*<\/p>\s*){2,}/g, block =>
      `<div class="shot-grid">` + block.replace(/<p>\s*(<img [^>]*?) title="gallery:\s*([^"]*)">\s*<\/p>\s*/g,
        (m, img, label) => `<figure class="shot"><div class="shot-frame">${img}></div><figcaption>${label}</figcaption></figure>`) + `</div>`);
    // Image size hints in the markdown title: "side" sits beside the text on wide screens, "small" stays modest.
    html = html.replace(/<p>\s*(<img [^>]*?) title="(side|small|book)">\s*<\/p>/g, (m, img, kind) => `<figure class="fig ${kind}">${img}></figure>`);

    const { prev, next } = neighbors(post.slug);
    const play = post.playUrl || "https://midlifesurvivors.com/";
    // What changed + Next up live in the right column (Nov 6, Rami's rule for every memo), so the memo itself starts right
    // under the cover. On phones the column stacks below the memo.
    const changes = Array.isArray(post.changes) && post.changes.length
      ? `<div class="changes-box"><h3>What changed</h3><ul>${post.changes.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>`
      : "";
    // Optional leadNote (markdown): how the lead image was made (tool + prompt). Shows as a margin note marker.
    const leadNote = post.leadNote
      ? `<button class="sn-ref sn-art" type="button" aria-expanded="false" aria-controls="sn-lead" aria-label="How this image was made">ART</button><span class="sn" id="sn-lead" role="note"><span class="sn-head"><b>ART</b><button class="sn-close" type="button" aria-label="Close note">×</button></span><span class="sn-body">${window.marked ? marked.parseInline(post.leadNote) : esc(post.leadNote)}</span></span>`
      : "";
    // Memo hero (Nov 7, Rami + Darvin): the headline sits on the key art, across both columns, so it isn't
    // repeated in a strip and again below. The art slowly drifts (off with reduced motion).
    const media = post.leadVideo
      ? `<div class="lead-loop"><video src="${esc(post.leadVideo)}" poster="${esc(post.leadPoster || post.cover || "")}" autoplay muted loop playsinline disablepictureinpicture disableremoteplayback preload="auto" aria-label="${esc(post.leadAlt || post.title)}" onclick="this.paused?this.play():this.pause()" onplay="var b=this.nextElementSibling;b.textContent='❚❚';b.setAttribute('aria-label','Pause animation')" onpause="var b=this.nextElementSibling;b.textContent='▶';b.setAttribute('aria-label','Play animation')"></video><button class="loop-btn" type="button" aria-label="Pause animation" onclick="var v=this.previousElementSibling;v.paused?v.play():v.pause()">❚❚</button></div>`
      : (post.cover ? `<img src="${esc(post.cover)}" alt="${esc(post.leadAlt || post.title)}">` : "");
    const nextUp = post.nextUp
      ? `<div class="next-up"><strong>Next up</strong>${esc(post.nextUp)}</div>`
      : "";
    // Optional sideCard (Nov 11, Memo 14): a small facts card in the right column, styled like What changed.
    // posts.js: "sideCard": {"title": "Camera settings", "rows": [["Camera", "Nikon Z9"], ...]}
    const sc = post.sideCard;
    const sideCard = sc && Array.isArray(sc.rows) && sc.rows.length
      ? `<div class="changes-box side-facts"><h3>${esc(sc.title || "Details")}</h3><ul>${sc.rows.map(r => `<li><b>${esc(r[0])}:</b> ${esc(r[1])}</li>`).join("")}</ul></div>`
      : "";

    const shareBtn = label => `<button class="btn btn-share" type="button" onclick="msShare(this)" data-slug="${esc(post.slug)}" data-url="https://midlifesurvivors.com/devlog/${esc(post.slug)}/" data-title="${esc(post.title)}" data-text="${esc("Midlife Survivors devlog, Memo " + two(memoNo(post)) + ": " + post.title)}">↗ <span class="share-label">${label}</span></button>`;
    const postTop = document.getElementById("post-top");
    if (postTop) postTop.innerHTML = `
      <a class="back" href="${draftOnly}">← All memos</a>
      <header class="memo-hero${media ? "" : " no-art"}" style="--focus:${esc(post.leadFocus || "50% 45%")}">
        ${media ? `<div class="mh-art">${media}</div>` : ""}
        <div class="mh-text">
          <div class="mh-stamp">MEMO ${two(memoNo(post))} · RE:</div>
          <h1>${esc(post.title)}</h1>
          <div class="post-meta">
            <time class="stamp" data-slug="${esc(post.slug)}" datetime="${esc(post.date)}">${fmt(post.date)}</time>
            ${!next ? `<span class="pill new">LATEST</span>` : ""}
            ${post.version ? `<span class="pill">${esc(post.version)}</span>` : ""}
            ${post.draft ? `<span class="pill draft">DRAFT</span>` : ""}
          </div>
        </div>
      </header>
      <div class="mh-under">
        <p class="mh-cap">${esc(post.leadAlt || "")}${leadNote}</p>
        <div class="cta-row"><a class="btn btn-primary" href="${esc(play)}">▶ Play this build</a>${shareBtn("Share")}</div>
      </div>`;

    postMain.innerHTML = `
      <article class="post">
        <div class="prose">${html}</div>
        <div class="signoff">
          <div class="silk">Filed by Rami.</div>
          Survived to ${esc(post.version || "the next build")}. Screenshots are from the real game at the time.
        </div>
        <div class="share-end"><button class="btn btn-share" type="button" onclick="msShare(this)" data-slug="${esc(post.slug)}" data-url="https://midlifesurvivors.com/devlog/${esc(post.slug)}/" data-title="${esc(post.title)}" data-text="${esc("Midlife Survivors devlog, Memo " + two(memoNo(post)) + ": " + post.title)}">↗ <span class="share-label">Share this memo</span></button></div>
      </article>
      ${sequel(post, prev, next)}`;
    // Lead clips play like a GIF; respect reduced motion by starting paused.
    const lv = document.querySelector("#post-top .lead-loop video");
    if (lv && matchMedia("(prefers-reduced-motion: reduce)").matches) { lv.removeAttribute("autoplay"); lv.pause(); lv.nextElementSibling.textContent = "▶"; lv.nextElementSibling.setAttribute("aria-label", "Play animation"); }
    // Respect "reduce motion": clips stay paused until the reader presses play.
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".memo-hero video, .prose video").forEach(v => { v.removeAttribute("autoplay"); v.pause(); });
    }
    postMain.querySelectorAll(".ba-tabs").forEach(box => {
      const chips = [...box.querySelectorAll(".bt-chip")], panels = [...box.querySelectorAll(".ba-post")];
      chips.forEach((c, i) => c.addEventListener("click", () => {
        chips.forEach((x, j) => x.setAttribute("aria-selected", String(j === i))); panels.forEach((p, j) => { p.hidden = j !== i; });
      }));
    });
    // Tap a picture to see it full size.
    postMain.querySelectorAll(".prose img:not(.ba img)").forEach(im => {
      im.classList.add("zoomable");
      im.addEventListener("click", () => {
        const o = document.createElement("div"); o.className = "img-zoom"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", im.alt || "Image");
        o.innerHTML = `<img src="${im.currentSrc || im.src}" alt="${esc(im.alt || "")}"><button type="button" aria-label="Close">×</button>`;
        const close = () => { o.remove(); document.removeEventListener("keydown", key); }, key = e => { if (e.key === "Escape") close(); };
        o.addEventListener("click", close); document.addEventListener("keydown", key); document.body.appendChild(o);
      });
    });
    postMain.querySelectorAll(".ba-post .ba").forEach(ba => {
      const r = ba.querySelector("input"), set = () => ba.style.setProperty("--cut", r.value + "%");
      r.addEventListener("input", set); set();
    });
    renderSeries(post.slug);
    renderStats();
    if (window.DevlogHome) { window.DevlogHome.stampPosts(); window.DevlogHome.postBuilds(post.slug); }
    if (window.initSidenotes) { initSidenotes(postMain); if (postTop) initSidenotes(postTop); }
    if (window.initCodeCards) initCodeCards(postMain);
    if (window.initAudioCards) initAudioCards(postMain);
    if (window.msShareLinks) { msShareLinks(postMain); if (postTop) msShareLinks(postTop); }
    const facts = document.getElementById("post-facts");
    if (facts) { facts.innerHTML = changes + sideCard + nextUp; facts.hidden = !(changes || sideCard || nextUp); }
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
