// Devlog home sidebar (Nov 3): build clock, play stats and the live leaderboard, plus exact timestamps on posts.
// Data: data/stats.json (built by scripts/build_stats.py from git history + an aggregate play-stats snapshot)
// and the live Midlife leaderboard from Supabase (read only, same public key the game uses).
window.DevlogHome = (() => {
  let stats = null;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const tz = { timeZone: "America/New_York" };
  const day = d => d.toLocaleDateString("en-US", { ...tz, month: "short", day: "numeric" });
  const time = d => d.toLocaleTimeString("en-US", { ...tz, hour: "numeric", minute: "2-digit" });
  const n = x => Number(x).toLocaleString("en-US");
  function ago(d) {
    const m = Math.max(0, (Date.now() - d) / 60000);
    if (m < 60) return Math.round(m) + " min ago";
    if (m < 48 * 60) return Math.round(m / 60) + " h ago";
    return Math.round(m / 1440) + " days ago";
  }
  function span(a, b) {
    const h = (b - a) / 3600000, d = Math.floor(h / 24), r = Math.round(h - d * 24);
    return d ? `${d} day${d > 1 ? "s" : ""} ${r} h` : `${Math.round(h)} h`;
  }

  // "Nov 2 · 11:23 PM" on every post card.
  function stampPosts() {
    if (!stats) return;
    document.querySelectorAll("time.stamp[data-slug]").forEach(el => {
      const at = stats.posts[el.dataset.slug];
      if (!at) return;
      const d = new Date(at);
      el.textContent = `${day(d)} · ${time(d)}`;
      el.setAttribute("datetime", at);
      el.title = "Filed " + d.toLocaleString("en-US", tz) + " (Eastern)";
    });
  }

  function buildClock() {
    const el = document.getElementById("build-clock");
    const b = stats.builds;
    if (!el || !b.length) return;
    const first = new Date(stats.firstCommit), last = new Date(b[b.length - 1].at);
    const last24 = b.filter(x => Date.now() - new Date(x.at) < 864e5).length;
    // builds per day, for the little bar chart
    const perDay = {};
    b.forEach(x => { const k = day(new Date(x.at)); perDay[k] = (perDay[k] || 0) + 1; });
    const days = Object.entries(perDay), max = Math.max(...days.map(d => d[1]));
    const bars = days.map(([k, v]) => `<div class="bar" title="${esc(k)}: ${v} builds"><span style="height:${Math.max(6, v / max * 100)}%"></span><em>${v}</em><small>${esc(k)}</small></div>`).join("");
    const recent = b.slice(-8).reverse().map(x => {
      const d = new Date(x.at);
      return `<li><span class="tl-time">${esc(day(d))}<b>${esc(time(d))}</b></span><span class="tl-v">V. ${esc(x.v)}</span><span class="tl-note">${esc(x.title || x.note)}</span></li>`;
    }).join("");
    el.innerHTML = `
      <div class="side-eyebrow">Build clock</div>
      <div class="big-stat"><strong>${b.length}</strong><span>playable builds in ${esc(span(first, last))}</span></div>
      <div class="side-row"><span>Latest</span><b>V. ${esc(b[b.length - 1].v)} · ${esc(ago(last))}</b></div>
      <div class="side-row"><span>Last 24 hours</span><b>${last24} builds</b></div>
      <div class="bars" aria-label="Builds per day">${bars}</div>
      <ol class="timeline">${recent}</ol>
      <p class="side-foot">Every version pushed to the live game, timed from the git history. Eastern time.</p>`;
  }

  function playStats() {
    const el = document.getElementById("play-stats");
    const p = stats.play;
    if (!el) return;
    if (!p || !p.runs) { el.innerHTML = `<div class="side-eyebrow">From the playtest floor</div><p class="side-loading">Stats coming soon.</p>`; return; }
    const killers = (p.topKillers || []).map(([k, v]) => `<li><span>${esc(k)}</span><b>${n(v)}</b></li>`).join("");
    el.innerHTML = `
      <div class="side-eyebrow">From the playtest floor</div>
      <div class="stat-grid">
        <div><strong>${n(p.runs)}</strong><span>runs</span></div>
        <div><strong>${n(p.players)}</strong><span>players</span></div>
        <div><strong>${esc(p.bestAge)}</strong><span>oldest age reached</span></div>
        <div><strong>${n(Math.round(p.enemiesDefeated / 1000))}k</strong><span>enemies defeated</span></div>
      </div>
      <div class="side-row"><span>Average run</span><b>${esc(p.avgMinutes)} min, to age ${esc(p.avgAge)}</b></div>
      <div class="side-row"><span>Close calls</span><b>${n(p.closeCalls)}</b></div>
      <div class="mini-head">What gets people</div>
      <ul class="mini-list">${killers}</ul>
      <p class="side-foot">Anonymous totals since the first tracked run, ${esc(day(new Date(p.firstRun)))}. Updated ${esc(day(new Date(p.asOf)))}.</p>`;
  }

  async function board() {
    const el = document.getElementById("side-board");
    const L = window.LEADERBOARD;
    if (!el || !L || !L.supabaseUrl) return;
    const headers = { apikey: L.supabaseAnonKey };
    if (!String(L.supabaseAnonKey).startsWith("sb_")) headers.Authorization = "Bearer " + L.supabaseAnonKey;
    let rows = null;
    for (let i = 0; i < 2 && !(rows && rows.length); i++) {
      try {
        const r = await fetch(`${L.supabaseUrl}/rest/v1/scores_midlife?select=name,score,age&order=score.desc&limit=200&_=${Date.now()}`, { headers, cache: "no-store" });
        if (r.ok) rows = await r.json();
      } catch (e) {}
    }
    if (!rows || !rows.length) { el.innerHTML = `<div class="side-eyebrow">Leaderboard · Midlife run</div><p class="side-loading">Couldn't load the scores just now.</p>`; return; }
    const seen = new Set(), top = rows.filter(r => { const k = String(r.name || "").trim().toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 10);
    el.innerHTML = `
      <div class="side-eyebrow">Leaderboard · Midlife run <span class="live-dot" title="Live">LIVE</span></div>
      <ol class="board">${top.map((r, i) => `<li><span class="rk">${i + 1}</span><span class="nm">${esc(r.name)}</span><span class="sc">${n(r.score)}</span><span class="ag">${Number(r.age).toFixed(1)}</span></li>`).join("")}</ol>
      <a class="btn btn-primary side-play" href="../">▶ Beat these scores</a>`;
  }

  async function init() {
    try {
      const r = await fetch("data/stats.json?_=" + Date.now(), { cache: "no-store" });
      if (r.ok) stats = await r.json();
    } catch (e) {}
    if (stats) { stampPosts(); buildClock(); playStats(); }
    board();
  }
  init();
  return { stampPosts };
})();
