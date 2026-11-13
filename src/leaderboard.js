// Scores + online leaderboard. No accounts: players type a name at Game Over.
// Talks to Supabase with plain fetch() calls, so there's no build step or library.
// If the online board isn't set up or the internet is down, scores are kept on this device.

const LB_LOCAL_KEY = "ms-local-scores-v1";
const LB_NAME_KEY = "ms-player-name";

function lbConfigured() {
  const L = window.LEADERBOARD || {};
  return !!(L.supabaseUrl && L.supabaseAnonKey);
}

// Each mode has its own board (Midlife and Full Life scores aren't comparable).
function lbMode() { return (window.getRunMode && window.getRunMode()) || "midlife"; }
function lbTable() { const m = window.RUN_MODES && window.RUN_MODES[lbMode()]; return (m && m.table) || (window.LEADERBOARD || {}).table; }
// Nov 12 (Ben read the Full Life board as "all time"): the board you LOOK at can differ from the mode you play.
// Tabs on the board set window.lbBoardMode; scores you post still go to your run's own board (lbTable above).
function lbView() { const v = window.lbBoardMode; return (v && window.RUN_MODES && RUN_MODES[v]) ? v : lbMode(); }
function lbViewTable() { const m = window.RUN_MODES && window.RUN_MODES[lbView()]; return (m && m.table) || (window.LEADERBOARD || {}).table; }

// isClear = reached the end of the mode (Retirement or Father Time) and gets that mode's clear bonus.
function computeRunScore(ageReached, startAge, kills, coins, isClear) {
  const L = window.LEADERBOARD || {};
  const years = Math.max(0, ageReached - startAge);
  const m = window.RUN_MODES && window.RUN_MODES[lbMode()];
  const tb = window.getRunTaxBracket ? window.getRunTaxBracket() : 0;
  const taxMult = 1 + tb * ((window.TAX_BRACKET && TAX_BRACKET.perLevel.scoreMult) || 0); // harder bracket, bigger score
  const st = typeof stats !== "undefined" && stats ? stats : null;
  // Nov 5: kills level off late in each year (stats.killPts), bosses add a bonus (stats.bossPts), and Lounge spending no longer costs score.
  const killPts = st && st.killPts != null ? st.killPts : kills * (L.pointsPerKill || 2);
  const bossPts = (st && st.bossPts) || 0;
  const coinsEarned = coins + (window.runCoinsSpent || 0) + (window.runCoinsTapered || 0); // the late-career taper doesn't cost score
  return Math.round((years * (L.pointsPerYear || 1000) + killPts + bossPts +
    coinsEarned * (L.pointsPerCoin || 5) + (isClear ? ((m && m.clearBonus) || 0) : 0) +
    (window.NearMiss ? window.NearMiss.score() * (L.pointsPerNearMiss || 1) : 0)) * taxMult); // Close Calls add a little
}

function lbCleanName(raw) {
  return String(raw || "").replace(/[<>"'`\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 16);
}
function lbNameOk(raw) { return window.nameOk ? window.nameOk(raw) : true; } // src/data/name-filter.js
function lbShownName(name) { return lbNameOk(name) ? name : ((window.NAME_FILTER && NAME_FILTER.replacement) || "Anonymous"); }

function lbSavedName() { try { return localStorage.getItem(LB_NAME_KEY) || ""; } catch (e) { return ""; } }
function lbSaveName(n) { try { localStorage.setItem(LB_NAME_KEY, n); } catch (e) {} }

function lbLocalScores() { try { return JSON.parse(localStorage.getItem(LB_LOCAL_KEY) || "[]").filter(r => (r.mode || "full") === lbView()); } catch (e) { return []; } }
function lbAllLocal() { try { return JSON.parse(localStorage.getItem(LB_LOCAL_KEY) || "[]"); } catch (e) { return []; } }
function lbAddLocal(entry) {
  const list = lbAllLocal().concat([Object.assign({ mode: lbMode() }, entry)]).sort((a, b) => b.score - a.score).slice(0, 50);
  try { localStorage.setItem(LB_LOCAL_KEY, JSON.stringify(list)); } catch (e) {}
  return list;
}

function lbHeaders() {
  const L = window.LEADERBOARD, k = L.supabaseAnonKey;
  const h = { apikey: k, "Content-Type": "application/json" };
  // Older "anon" keys are JWTs and also go in Authorization. Newer "sb_publishable_..." keys only go in apikey.
  if (!String(k).startsWith("sb_")) h.Authorization = `Bearer ${k}`;
  return h;
}

// Post a score. Always saved on this device too. Resolves to { online: true|false }.
async function lbSubmit(entry) {
  if (window.DEV && window.DEV.on) return { online: false, reason: "dev" }; // dev console runs never post
  lbAddLocal(entry);
  if (!lbConfigured()) return { online: false, reason: "not-set-up" };
  const res = await lbPost(entry, lbTable());
  if (!res.online) lbQueue(entry, lbTable()); // Nov 10: try again later instead of losing it
  return res;
}
async function lbPost(entry, table) {
  const L = window.LEADERBOARD;
  try {
    const res = await fetch(`${L.supabaseUrl}/rest/v1/${table}`, {
      method: "POST", headers: Object.assign(lbHeaders(), { Prefer: "return=minimal" }),
      body: JSON.stringify({ name: entry.name, score: entry.score, age: entry.age, start_age: entry.startAge, character: entry.character, version: entry.version })
    });
    return { online: res.ok, reason: res.ok ? "" : `HTTP ${res.status}` };
  } catch (e) {
    return { online: false, reason: "offline" };
  }
}

// ---- Scores the board turned away get another try (Nov 10) ----
// Rami's 500k+ Maple Hollow run bounced off an old 500,000 cap on the 40-to-65 board. The cap is 5,000,000 now, and any
// score that didn't post waits here and is re-sent the next time the game opens (up to 3 tries; offline doesn't count).
const LB_PENDING_KEY = "ms-lb-pending-v1";
function lbPending() { try { return JSON.parse(localStorage.getItem(LB_PENDING_KEY) || "[]"); } catch (e) { return []; } }
function lbSetPending(list) { try { localStorage.setItem(LB_PENDING_KEY, JSON.stringify(list.slice(-10))); } catch (e) {} }
function lbQueue(entry, table) {
  if (!table || !entry || !entry.name) return;
  const list = lbPending(); if (list.some(p => p.e.name === entry.name && p.e.score === entry.score)) return;
  list.push({ e: { name: entry.name, score: entry.score, age: entry.age, startAge: entry.startAge, character: entry.character, version: entry.version }, table, tries: 0 });
  lbSetPending(list);
}
async function lbRetryPending() {
  if (!lbConfigured() || (window.DEV && window.DEV.on) || window.TELEMETRY_OFF || /[?&]nostats=1/.test(location.search)) return;
  // One-time rescue: 40-to-65 scores over the old cap were saved on this device but never posted, so queue them now.
  try {
    // v2 (Nov 10, 8:10 AM): the board also capped age at 81 (now 101). Rami's 82.5 run used up its 3 tries before that
    // was fixed, so this pass re-queues 40-to-65 scores over the old score OR age limits.
    if (!localStorage.getItem("ms-lb-rescue-nov10b")) {
      localStorage.setItem("ms-lb-rescue-nov10b", "1");
      const t = window.RUN_MODES && RUN_MODES.midlife && RUN_MODES.midlife.table;
      if (t) lbAllLocal().filter(r => (r.mode || "midlife") === "midlife" && (r.score > 500000 || r.age > 81) && r.name && r.startAge != null).forEach(r => lbQueue(r, t));
    }
    // v3 (Nov 12, Ben's 103): the Full Life board capped age at 101, but runs keep going past Father Time.
    // Those scores bounced 3 times and were dropped. Re-queue Full Life scores past 101 once the cap is raised.
    if (!localStorage.getItem("ms-lb-rescue-nov12")) {
      localStorage.setItem("ms-lb-rescue-nov12", "1");
      const t = window.RUN_MODES && RUN_MODES.full && RUN_MODES.full.table;
      if (t) lbAllLocal().filter(r => r.mode === "full" && r.age > 101 && r.age <= 200 && r.name && r.startAge != null).forEach(r => lbQueue(r, t));
    }
  } catch (e) {}
  const keep = [];
  for (const p of lbPending()) {
    const res = await lbPost(p.e, p.table);
    if (res.online) continue;
    if (res.reason !== "offline") p.tries = (p.tries || 0) + 1;
    if (p.tries < 3) keep.push(p);
  }
  lbSetPending(keep);
}
window.lbRetryPending = lbRetryPending;
setTimeout(() => { lbRetryPending(); }, 6000); // quietly, a few seconds after the game opens

// Top scores. Falls back to this device's scores if the online board can't be reached.
async function lbFetchTop() {
  const L = window.LEADERBOARD || {};
  const n = L.fetchLimit || 1000; // grab plenty, then keep each player's best (no top-10 cap)
  if (lbConfigured()) {
    // Nov 2: Rami twice saw "No scores yet" while the server held 70+ scores and logged full replies.
    // So: never use a cached reply, and if a reply comes back empty, ask once more before believing it.
    const season = window.SEASONS && window.lbScope !== "all" ? SEASONS.current() : null; // this fiscal year only, unless ALL-TIME
    const url = `${L.supabaseUrl}/rest/v1/${lbViewTable()}?select=name,score,age,character,version,created_at&order=score.desc&limit=${n}${season ? `&created_at=gte.${season.start}` : ""}`;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url + (attempt ? `&_r=${Date.now()}` : ""), { headers: lbHeaders(), cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length) return { online: true, rows: lbBestPerName(data) };
          if (attempt) return { online: true, rows: [], empty: true };
        }
      } catch (e) {}
      await new Promise(r => setTimeout(r, 1200));
    }
  }
  return { online: false, rows: lbBestPerName(lbLocalScores()) };
}

// One row per player: their personal best. Rows arrive sorted by score, so the first time we see a name is their best.
function lbBestPerName(rows) {
  const seen = new Set();
  return rows.filter(r => {
    const key = String(r.name || "").trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

function lbEscape(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// The board's header (Nov 12): which board (Midlife or Full Life) and which time span, as two pairs of tabs,
// plus one plain sentence saying exactly what the list shows.
function lbHeader() {
  const M = window.RUN_MODES || {}, view = lbView(), all = window.lbScope === "all";
  const ages = id => { const m = M[id] || {}; return `Ages ${m.startAge || 40} to ${m.endAge || (id === "full" ? 100 : 65)}`; };
  const tab = (attr, val, label, sub, on) =>
    `<button type="button" class="ms-btn lb-tab${on ? " on" : ""}" ${attr}="${val}" aria-pressed="${on}"><span class="ms-btn-label">${label}</span>${sub ? `<span class="ms-btn-sub">${sub}</span>` : ""}</button>`;
  const season = window.SEASONS ? SEASONS.current() : null;
  const boards = ["midlife", "full"].filter(id => M[id]).map(id => tab("data-lb-board", id, id === "full" ? "FULL LIFE" : "MIDLIFE", ages(id), id === view)).join("");
  const scopes = season ? tab("data-lb-scope", "season", lbEscape(season.name.toUpperCase()), "", !all) + tab("data-lb-scope", "all", "ALL-TIME", "", all) : "";
  const since = season ? new Date(season.start + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
  const span = !season ? "" : all ? "every version since launch" : `${season.name} only (since ${since})`;
  const what = `${view === "full" ? "Full Life" : "Midlife"} runs (${ages(view).toLowerCase()}), ${span ? span + ", " : ""}each player's best run.`;
  return `<div class="lb-tabs" role="group" aria-label="Which board">${boards}</div>` +
    (scopes ? `<div class="lb-tabs lb-tabs-scope" role="group" aria-label="Which years">${scopes}</div>` : "") +
    `<p class="lb-what">${what}</p>`;
}

// Render the full board (personal bests) into an element. Highlights rows matching `mine` (name + score).
async function lbRenderInto(el, mine) {
  if (!el) return;
  if (mine) window.lbBoardMode = null; // after a run, open on the board your score went to
  el.innerHTML = `<div class="lb-status">Loading scores…</div>`;
  const { online, rows, empty } = await lbFetchTop();
  const charName = id => {
    const c = (window.CHARACTERS || []).find(x => x.id === id);
    return c ? c.name.replace(/^The /, "") : "";
  };
  // LEGACY (Nov 4, Rami): runs from before V. 2.0, when Midlife still ran to 80. They stay on the board, marked.
  const legacy = r => /^1\./.test(String(r.version || ""));
  const anyLegacy = rows.some(legacy);
  const body = rows.length ? rows.map((r, i) => {
    const me = mine && r.name === mine.name && Number(r.score) === Number(mine.score);
    return `<tr class="${me ? "lb-me" : ""}"><td>${i + 1}</td><td>${lbEscape(lbShownName(r.name))}${legacy(r) ? ` <span class="lb-legacy" title="Played before V. 2.0, when Midlife ran to age 80">LEGACY</span>` : ""}${/ B( |$)/.test(r.version || "") ? ` <span class="lb-legacy lb-buyout" title="Took the Corporate Buyout this fiscal year">BOUGHT OUT</span>` : ""}${/ S( T\d)?$/.test(r.version || "") ? ` <span class="lb-tax" title="Sprint">⚡</span>` : ""}${/ T(\d)$/.test(r.version || "") ? ` <span class="lb-tax">TAX×${(r.version.match(/ T(\d)$/) || [])[1]}</span>` : ""}</td><td>${Number(r.score).toLocaleString()}</td><td>${Number(r.age).toFixed(1)}</td><td>${lbEscape(charName(r.character))}</td></tr>`;
  }).join("") : (empty
    ? `<tr><td colspan="5" class="lb-empty">Couldn't load the scores just now. <button class="lb-retry" type="button">↻ RETRY</button></td></tr>`
    : `<tr><td colspan="5" class="lb-empty">No scores yet. Be the first.</td></tr>`);
  el.innerHTML = `
    ${lbHeader()}
    <div class="lb-status">${online ? "Online leaderboard" : (lbConfigured() ? "Offline: showing scores from this device" : "Scores on this device (online board not set up yet)")}</div>
    <div class="lb-wrap"><table class="lb-table">
      <thead><tr><th>#</th><th>NAME</th><th>SCORE</th><th>AGE</th><th>AS</th></tr></thead>
      <tbody>${body}</tbody>
    </table></div>${anyLegacy ? `<div class="lb-note"><span class="lb-legacy">LEGACY</span> Played before V. 2.0, when a Midlife run could go to age 80. Today it ends at 65.</div>` : ""}`;
  // Tabs work with mouse, touch, keyboard and controller (bindNavItem joins them to menu navigation).
  const bind = (b, row, fn) => window.bindNavItem ? bindNavItem(b, row, fn) : b.addEventListener("click", fn);
  el.querySelectorAll("[data-lb-board]").forEach(b => bind(b, 9.1, () => {
    if (lbView() === b.dataset.lbBoard) return; window.lbBoardMode = b.dataset.lbBoard; lbRenderInto(el, null);
  }));
  el.querySelectorAll("[data-lb-scope]").forEach(b => bind(b, 9.2, () => {
    const want = b.dataset.lbScope; if ((window.lbScope === "all" ? "all" : "season") === want) return;
    window.lbScope = want; lbRenderInto(el, mine);
  }));
  const retry = el.querySelector(".lb-retry");
  if (retry) retry.addEventListener("click", () => lbRenderInto(el, mine));
}

window.computeRunScore = computeRunScore;
window.lbSubmit = lbSubmit;
window.lbRenderInto = lbRenderInto;
window.lbSavedName = lbSavedName;
window.lbSaveName = lbSaveName;
window.lbCleanName = lbCleanName;
window.lbNameOk = lbNameOk;
window.lbShownName = lbShownName;
window.lbConfigured = lbConfigured;
