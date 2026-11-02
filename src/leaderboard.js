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

// isClear = reached the end of the mode (Retirement or Father Time) and gets that mode's clear bonus.
function computeRunScore(ageReached, startAge, kills, coins, isClear) {
  const L = window.LEADERBOARD || {};
  const years = Math.max(0, ageReached - startAge);
  const m = window.RUN_MODES && window.RUN_MODES[lbMode()];
  const tb = window.getRunTaxBracket ? window.getRunTaxBracket() : 0;
  const taxMult = 1 + tb * ((window.TAX_BRACKET && TAX_BRACKET.perLevel.scoreMult) || 0); // harder bracket, bigger score
  return Math.round((years * (L.pointsPerYear || 1000) + kills * (L.pointsPerKill || 2) +
    coins * (L.pointsPerCoin || 5) + (isClear ? ((m && m.clearBonus) || 0) : 0) +
    (window.NearMiss ? window.NearMiss.score() * (L.pointsPerNearMiss || 1) : 0)) * taxMult); // Close Calls add a little
}

function lbCleanName(raw) {
  return String(raw || "").replace(/[<>"'`\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 16);
}
function lbSavedName() { try { return localStorage.getItem(LB_NAME_KEY) || ""; } catch (e) { return ""; } }
function lbSaveName(n) { try { localStorage.setItem(LB_NAME_KEY, n); } catch (e) {} }

function lbLocalScores() { try { return JSON.parse(localStorage.getItem(LB_LOCAL_KEY) || "[]").filter(r => (r.mode || "full") === lbMode()); } catch (e) { return []; } }
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
  lbAddLocal(entry);
  if (!lbConfigured()) return { online: false, reason: "not-set-up" };
  const L = window.LEADERBOARD;
  try {
    const res = await fetch(`${L.supabaseUrl}/rest/v1/${lbTable()}`, {
      method: "POST", headers: Object.assign(lbHeaders(), { Prefer: "return=minimal" }),
      body: JSON.stringify({ name: entry.name, score: entry.score, age: entry.age, start_age: entry.startAge, character: entry.character, version: entry.version })
    });
    return { online: res.ok, reason: res.ok ? "" : `HTTP ${res.status}` };
  } catch (e) {
    return { online: false, reason: "offline" };
  }
}

// Top scores. Falls back to this device's scores if the online board can't be reached.
async function lbFetchTop() {
  const L = window.LEADERBOARD || {};
  const n = L.fetchLimit || 1000; // grab plenty, then keep each player's best (no top-10 cap)
  if (lbConfigured()) {
    // Nov 2: Rami twice saw "No scores yet" while the server held 70+ scores and logged full replies.
    // So: never use a cached reply, and if a reply comes back empty, ask once more before believing it.
    const url = `${L.supabaseUrl}/rest/v1/${lbTable()}?select=name,score,age,character,version,created_at&order=score.desc&limit=${n}`;
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

// Render the full board (personal bests) into an element. Highlights rows matching `mine` (name + score).
async function lbRenderInto(el, mine) {
  if (!el) return;
  el.innerHTML = `<div class="lb-status">Loading scores…</div>`;
  const { online, rows, empty } = await lbFetchTop();
  const charName = id => {
    const c = (window.CHARACTERS || []).find(x => x.id === id);
    return c ? c.name.replace(/^The /, "") : "";
  };
  const body = rows.length ? rows.map((r, i) => {
    const me = mine && r.name === mine.name && Number(r.score) === Number(mine.score);
    return `<tr class="${me ? "lb-me" : ""}"><td>${i + 1}</td><td>${lbEscape(r.name)}${/ T(\d)$/.test(r.version || "") ? ` <span class="lb-tax">TAX×${(r.version.match(/ T(\d)$/) || [])[1]}</span>` : ""}</td><td>${Number(r.score).toLocaleString()}</td><td>${Number(r.age).toFixed(1)}</td><td>${lbEscape(charName(r.character))}</td></tr>`;
  }).join("") : (empty
    ? `<tr><td colspan="5" class="lb-empty">Couldn't load the scores just now. <button class="lb-retry" type="button">↻ RETRY</button></td></tr>`
    : `<tr><td colspan="5" class="lb-empty">No scores yet. Be the first.</td></tr>`);
  el.innerHTML = `
    <div class="lb-status">${lbMode() === "full" ? "FULL LIFE" : "MIDLIFE"} BOARD · ${online ? "🌐 Online leaderboard" : (lbConfigured() ? "📴 Offline: showing scores from this device" : "📱 Scores on this device (online board not set up yet)")}</div>
    <div class="lb-wrap"><table class="lb-table">
      <thead><tr><th>#</th><th>NAME</th><th>SCORE</th><th>AGE</th><th>AS</th></tr></thead>
      <tbody>${body}</tbody>
    </table></div>`;
  const retry = el.querySelector(".lb-retry");
  if (retry) retry.addEventListener("click", () => lbRenderInto(el, mine));
}

window.computeRunScore = computeRunScore;
window.lbSubmit = lbSubmit;
window.lbRenderInto = lbRenderInto;
window.lbSavedName = lbSavedName;
window.lbSaveName = lbSaveName;
window.lbCleanName = lbCleanName;
window.lbConfigured = lbConfigured;
