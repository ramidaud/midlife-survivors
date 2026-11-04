// Optional accounts and cloud saves (Nov 4, 2026). Settings: src/data/account.js.
// "Clock in" with an emailed 6-digit code (or Google / Apple once they're switched on) and your employee file
// follows you to any device: coins, shop ranks, unlocks, achievements, your name, settings and a run in progress.
//
// How syncing works, in plain words:
//   - Everything still saves to this device first, exactly like before. Signing in adds a copy in the cloud.
//   - Every save marks the file "dirty". A dirty file is uploaded a few seconds later (or right away when you leave).
//   - When you open the title screen, we check the cloud. If another device saved something newer, we use that.
//   - If BOTH this device and the cloud changed (or this device has its own progress the first time you sign in),
//     we ask which file to keep instead of guessing.
window.Account = (() => {
  const A = () => window.ACCOUNT || {}, L = () => window.LEADERBOARD || {};
  // Hidden from players until setup is done (ACCOUNT.enabled). Add ?accounts=1 to the address to test it early.
  const on = () => !!(A().enabled || /[?&]accounts=1/.test(location.search) || (() => { try { return !!localStorage.getItem("ms-auth"); } catch (e) { return false; } })());
  const SYNC_KEY = "ms-cloud-sync", AUTH_KEY = "ms-auth";
  let sb = null, libPromise = null, session = null, applying = false, pushTimer = null, lastPush = 0, lastPull = 0;
  let ui = { step: "start", email: "", busy: false, msg: "", err: "", conflict: null };

  const readJSON = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sync = () => readJSON(SYNC_KEY, { uid: null, at: null, dirty: false });
  const setSync = patch => writeJSON(SYNC_KEY, Object.assign(sync(), patch));
  const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const signedIn = () => !!(session && session.user);

  // ---------- The supabase-js library (loaded on demand) ----------
  function loadLib() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    if (libPromise) return libPromise;
    libPromise = new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = A().lib; s.async = true;
      s.onload = () => res(); s.onerror = () => { libPromise = null; rej(new Error("Couldn't reach the sign-in service. Check your connection.")); };
      document.head.appendChild(s);
    });
    return libPromise;
  }
  async function client() {
    if (sb) return sb;
    await loadLib();
    sb = window.supabase.createClient(L().supabaseUrl, L().supabaseAnonKey, {
      auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true, storageKey: AUTH_KEY }
    });
    sb.auth.onAuthStateChange((ev, s) => {
      session = s;
      if (ev === "SIGNED_IN") setTimeout(() => pull(true), 0);
      if (ev === "SIGNED_OUT") { render(); refreshTitle(); } // keep the last account id, so signing back in to the same one doesn't ask again
    });
    const { data } = await sb.auth.getSession();
    session = data.session;
    return sb;
  }

  // ---------- What "your file" is ----------
  function localFile() {
    const prefs = {};
    (A().prefKeys || []).forEach(k => { try { const v = localStorage.getItem(k); if (v != null) prefs[k] = v; } catch (e) {} });
    return { meta: { save: readJSON(SAVE_KEY, null), prefs }, run: readJSON(RUN_SAVE_KEY, null) };
  }
  function summary(f) {
    const m = (f && f.meta && f.meta.save) || {};
    return {
      age: Math.floor(m.bestAge || 40), coins: m.coins || 0, shifts: m.runsPlayed || 0,
      ach: Object.keys((m.achievements && m.achievements.unlocked) || {}).length,
      run: f && f.run ? Math.floor(f.run.currentAge || 40) : null
    };
  }
  const hasProgress = f => { const s = summary(f); return s.coins > 0 || s.shifts > 0 || s.age > 40 || s.ach > 0 || s.run != null; };

  function applyFile(row) {
    applying = true;
    try {
      const m = row.meta || {};
      if (m.save) writeJSON(SAVE_KEY, m.save);
      Object.entries(m.prefs || {}).forEach(([k, v]) => { try { localStorage.setItem(k, v); } catch (e) {} });
      if (row.run) writeJSON(RUN_SAVE_KEY, row.run); else { try { localStorage.removeItem(RUN_SAVE_KEY); } catch (e) {} }
      try { meta = loadMeta(); } catch (e) {} // the game's in-memory copy (src/main.js)
    } finally { applying = false; }
    setSync({ uid: session.user.id, at: row.updated_at, dirty: false });
    refreshTitle();
  }

  // ---------- Cloud reads and writes (plain REST calls, so a save can still go out as the page closes) ----------
  const rest = (path, opt) => fetch(`${L().supabaseUrl}/rest/v1/${path}`, Object.assign({}, opt, {
    headers: Object.assign({ apikey: L().supabaseAnonKey, Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" }, (opt && opt.headers) || {})
  }));
  async function fetchRow() {
    const r = await rest(`${A().table}?select=meta,run,updated_at&user_id=eq.${session.user.id}`);
    if (!r.ok) throw new Error(`Cloud save check failed (HTTP ${r.status}).`);
    return (await r.json())[0] || null;
  }
  async function push(opts) {
    if (!signedIn()) return;
    clearTimeout(pushTimer); pushTimer = null; lastPush = Date.now();
    const f = localFile(), body = JSON.stringify({
      user_id: session.user.id, meta: f.meta, run: f.run,
      game_version: (window.GAME_VERSION || {}).displayVersion || "", device: /Mobi|Android|iPhone|iPad/.test(navigator.userAgent) ? "mobile" : "desktop"
    });
    const keepalive = !!(opts && opts.leaving) && body.length < 60000;
    try {
      const r = await rest(`${A().table}?on_conflict=user_id&select=updated_at`, { method: "POST", body, keepalive, headers: { Prefer: "resolution=merge-duplicates,return=representation" } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const row = (await r.json())[0];
      setSync({ uid: session.user.id, at: row ? row.updated_at : sync().at, dirty: false });
      ui.err = "";
    } catch (e) { ui.err = "Couldn't save to the cloud just now. Your file is safe on this device; we'll try again."; }
    render(); refreshTitle();
  }
  function markDirty() {
    if (applying) return;
    setSync({ dirty: true });
    if (!signedIn()) return;
    const wait = Math.max(3000, (A().pushEveryMs || 20000) - (Date.now() - lastPush));
    if (!pushTimer) pushTimer = setTimeout(() => push(), wait);
  }

  // Compare this device with the cloud and do the sensible thing (or ask).
  async function pull(firstTime) {
    if (!signedIn()) return;
    lastPull = Date.now();
    if (!firstTime && typeof titleOpen !== "undefined" && !titleOpen) { if (sync().dirty) push(); return; } // never swap files mid-run
    ui.busy = true; render();
    try {
      const row = await fetchRow(), s = sync(), local = localFile(), sameUser = s.uid === session.user.id;
      ui.busy = false;
      if (!row) { await push(); ui.msg = "Your file is now saved to the cloud."; }
      else if (!sameUser) { // first time this account meets this device
        if (!hasProgress(local)) { applyFile(row); ui.msg = "Welcome back. Your file is on this device now."; }
        else if (!hasProgress(row)) { await push(); ui.msg = "Your file is now saved to the cloud."; }
        else if (JSON.stringify(summary(row)) === JSON.stringify(summary(local))) { setSync({ uid: session.user.id, at: row.updated_at }); if (sync().dirty) await push(); }
        else { ui.conflict = { row, local }; ui.step = "conflict"; open(); }
      } else if (row.updated_at !== s.at && new Date(row.updated_at) > new Date(s.at || 0)) { // another device saved since
        if (!s.dirty) { applyFile(row); ui.msg = "Picked up your latest progress from another device."; }
        else { ui.conflict = { row, local }; ui.step = "conflict"; open(); }
      } else if (s.dirty) await push();
      if (firstTime && ui.step !== "conflict") ui.step = "in";
    } catch (e) { ui.busy = false; ui.err = e.message || "Couldn't reach the cloud."; }
    render(); refreshTitle();
  }

  // ---------- Signing in ----------
  const siteUrl = () => location.origin + location.pathname;
  async function sendCode(email) {
    ui.busy = true; ui.err = ""; render();
    try {
      await client();
      const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: siteUrl() } });
      if (error) throw error;
      ui.email = email; ui.step = "code"; ui.msg = "";
    } catch (e) { ui.err = friendly(e); }
    ui.busy = false; render();
  }
  async function verifyCode(code) {
    ui.busy = true; ui.err = ""; render();
    try {
      const { error } = await sb.auth.verifyOtp({ email: ui.email, token: code, type: "email" });
      if (error) throw error;
      ui.step = "in"; // onAuthStateChange runs the first sync
    } catch (e) { ui.err = friendly(e); }
    ui.busy = false; render();
  }
  async function oauth(provider) {
    ui.busy = true; ui.err = ""; render();
    try {
      await client();
      const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo: siteUrl() } }); // leaves the page and comes back signed in
      if (error) throw error;
    } catch (e) { ui.busy = false; ui.err = friendly(e); render(); }
  }
  async function signOut() {
    if (signedIn()) { const s = sync(); if (s.dirty) await push(); }
    try { await sb.auth.signOut(); } catch (e) {}
    session = null; ui = { step: "start", email: "", busy: false, msg: "Clocked out. Your file stays on this device.", err: "", conflict: null };
    render(); refreshTitle();
  }
  async function deleteCloud() {
    if (!signedIn()) return;
    ui.busy = true; render();
    try { const r = await rest(`${A().table}?user_id=eq.${session.user.id}`, { method: "DELETE" }); if (!r.ok) throw new Error(`HTTP ${r.status}`); } catch (e) { ui.err = "Couldn't delete the cloud copy."; ui.busy = false; render(); return; }
    ui.busy = false;
    await signOut();
    ui.msg = "Your cloud save is deleted and you're clocked out. Your file is still on this device.";
    render();
  }
  function friendly(e) {
    const m = String((e && e.message) || e || "");
    if (/rate limit|security purposes|too many/i.test(m)) return "Too many tries. Wait a minute, then ask for a new code.";
    if (/expired|invalid|otp/i.test(m)) return "That code didn't work. Check the newest email, or ask for a new code.";
    if (/provider is not enabled|unsupported provider/i.test(m)) return "That sign-in option isn't switched on yet.";
    if (/fetch|network|reach/i.test(m)) return "Couldn't reach the sign-in service. Check your connection.";
    return m || "Something went wrong. Try again.";
  }

  // ---------- The badge office (a small modal over the title screen) ----------
  let modal = null;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div"); modal.id = "account-modal"; modal.className = "ui-modal hidden";
    modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-labelledby", "acct-title");
    (document.getElementById("ui-layer") || document.body).appendChild(modal);
    const st = document.createElement("style"); st.textContent = `
#account-modal .acct-card{max-width:440px;width:min(440px,calc(100vw - 32px));text-align:left}
#account-modal .acct-oauth{display:flex;flex-direction:column;gap:8px;margin:12px 0}
#account-modal .acct-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;border-radius:6px;border:2px solid var(--ms-teal,#3E7775);background:rgba(48,55,80,.85);color:var(--ms-white,#FFF0CF);font:700 14px 'Atkinson Hyperlegible',sans-serif;cursor:pointer}
#account-modal .acct-btn.primary{background:var(--ms-coffee,#EF9347);border-color:var(--ms-coffee,#EF9347);color:var(--ms-navy,#171C35)}
#account-modal .acct-btn:hover,#account-modal .acct-btn.nav-focused{outline:3px solid var(--ms-cream,#F2D7A1);outline-offset:2px}
#account-modal .acct-btn[disabled]{opacity:.55;cursor:wait}
#account-modal .acct-or{display:flex;align-items:center;gap:8px;font:9px Silkscreen,monospace;color:var(--ms-muted,#B8C0D4);margin:10px 0 6px;letter-spacing:.05em}
#account-modal .acct-or::before,#account-modal .acct-or::after{content:"";flex:1;height:1px;background:rgba(184,192,212,.3)}
#account-modal label{display:block;font:9px Silkscreen,monospace;color:var(--ms-cream,#F2D7A1);letter-spacing:.05em;margin:8px 0 4px}
#account-modal input{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:6px;border:2px solid var(--ms-teal,#3E7775);background:#171C35;color:#FFF0CF;font:16px 'Atkinson Hyperlegible',sans-serif}
#account-modal input.code{font:22px Silkscreen,monospace;letter-spacing:.35em;text-align:center}
#account-modal input:focus{outline:none;border-color:var(--ms-coffee,#EF9347)}
#account-modal .acct-row{display:flex;gap:8px;margin-top:10px}
#account-modal .acct-row .acct-btn{flex:1}
#account-modal .acct-link{background:none;border:0;color:var(--ms-sage,#83A89A);font:13px 'Atkinson Hyperlegible',sans-serif;text-decoration:underline;cursor:pointer;padding:6px 0}
#account-modal .acct-msg{margin:10px 0 0;padding:8px 10px;border-radius:5px;font-size:13px;background:rgba(131,168,154,.15);color:#FFF0CF}
#account-modal .acct-err{margin:10px 0 0;padding:8px 10px;border-radius:5px;font-size:13px;background:rgba(196,92,75,.2);color:#FFF0CF;border:1px solid #C45C4B}
#account-modal .acct-badge{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;background:#F2D7A1;color:#171C35;border-radius:6px;padding:12px;margin:10px 0}
#account-modal .acct-badge .ph{width:44px;height:52px;background:#171C35;color:#F2D7A1;border-radius:4px;display:flex;align-items:center;justify-content:center;font:26px/1 sans-serif}
#account-modal .acct-badge b{display:block;font:10px Silkscreen,monospace;letter-spacing:.05em}
#account-modal .acct-badge span{font:700 14px 'Atkinson Hyperlegible',sans-serif;word-break:break-all}
#account-modal .acct-badge em{display:block;font:12px 'Atkinson Hyperlegible',sans-serif;font-style:normal;color:#303750}
#account-modal .acct-cmp{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
#account-modal .acct-cmp>div{background:rgba(48,55,80,.85);border:1px solid var(--ms-teal,#3E7775);border-radius:6px;padding:10px;font-size:13px;color:#B8C0D4}
#account-modal .acct-cmp h4{margin:0 0 6px;font:10px Silkscreen,monospace;color:#F2D7A1;letter-spacing:.05em}
#account-modal .acct-cmp p{margin:2px 0}
#account-modal .acct-cmp p b{color:#FFF0CF}
#account-modal .acct-fine{font-size:12px;color:var(--ms-muted,#B8C0D4);margin-top:10px;line-height:1.4}`;
    document.head.appendChild(st);
    // Typing in the boxes must not move the player or the menu cursor.
    modal.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.target.tagName === "INPUT") {
        e.stopPropagation();
        if (e.key === "Enter") { e.preventDefault(); const go = modal.querySelector("[data-acct-enter]"); if (go && !go.disabled) go.dispatchEvent(new Event(window.bindNavItem ? "nav-activate" : "click")); }
      }
    });
    modal.addEventListener("keyup", e => { if (e.target.tagName === "INPUT") e.stopPropagation(); });
    return modal;
  }
  const btn = (act, label, cls, extra) => `<button type="button" class="acct-btn ${cls || ""}" data-acct="${act}"${extra || ""}${ui.busy ? " disabled" : ""}>${label}</button>`;
  const ago = iso => { if (!iso) return "not yet"; const m = Math.round((Date.now() - new Date(iso)) / 60000); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 2880 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} days ago`; };
  function render() {
    if (!modal || modal.classList.contains("hidden")) return;
    const P = A().providers || {}, s = sync();
    let body = "";
    if (ui.step === "conflict" && ui.conflict) {
      const a = summary(ui.conflict.local), b = summary(ui.conflict.row);
      const col = (h, x) => `<div><h4>${h}</h4><p>Oldest age <b>${x.age}</b></p><p>401(k) <b>${x.coins.toLocaleString("en-US")}k</b></p><p>Shifts <b>${x.shifts}</b></p><p>Achievements <b>${x.ach}</b></p><p>Saved run <b>${x.run != null ? "age " + x.run : "none"}</b></p></div>`;
      body = `<div class="modal-kicker">HR // RECORDS CONFLICT</div><h2 class="modal-title" id="acct-title">TWO EMPLOYEE FILES</h2>
        <p class="modal-sub">This device and the cloud both have progress. Which one should we keep? The other one is replaced.</p>
        <div class="acct-cmp">${col("THIS DEVICE", a)}${col("CLOUD (" + esc(ago(ui.conflict.row.updated_at)) + ")", b)}</div>
        <div class="acct-row">${btn("keepLocal", "Keep this device")}${btn("useCloud", "Use the cloud file", "primary")}</div>`;
    } else if (signedIn()) {
      const u = session.user, via = (u.app_metadata && u.app_metadata.provider) || "email";
      body = `<div class="modal-kicker">HR // BADGE OFFICE</div><h2 class="modal-title" id="acct-title">CLOCKED IN</h2>
        <div class="acct-badge"><div class="ph">☁</div><div><b>EMPLOYEE BADGE · ${esc(via.toUpperCase())}</b><span>${esc(u.email || "Signed in")}</span>
          <em>${ui.busy ? "Checking the cloud..." : s.dirty ? "Saving soon..." : "Cloud save: " + esc(ago(s.at))}</em></div></div>
        <p class="modal-sub">Your coins, shop ranks, unlocks, achievements, name, settings and a run in progress follow you to any device where you clock in.</p>
        <div class="acct-row">${btn("syncNow", "Sync now")}${btn("close", "Back to work", "primary", " data-acct-enter")}</div>
        <div class="acct-row">${btn("signOut", "Clock out")}</div>
        <button type="button" class="acct-link" data-acct="deleteCloud">Delete my cloud save</button>`;
    } else if (ui.step === "code") {
      body = `<div class="modal-kicker">HR // BADGE OFFICE</div><h2 class="modal-title" id="acct-title">CHECK YOUR EMAIL</h2>
        <p class="modal-sub">We sent a 6-digit code to <b>${esc(ui.email)}</b>. It can take a minute, and it might land in spam.</p>
        <label for="acct-code">YOUR CODE</label>
        <input id="acct-code" class="code" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="000000">
        <div class="acct-row">${btn("verify", "Clock in", "primary", " data-acct-enter")}</div>
        <div class="acct-row"><button type="button" class="acct-link" data-acct="resend">Send a new code</button><button type="button" class="acct-link" data-acct="restart">Use a different email</button></div>`;
    } else {
      body = `<div class="modal-kicker">HR // BADGE OFFICE</div><h2 class="modal-title" id="acct-title">CLOCK IN</h2>
        <p class="modal-sub">Optional. Save your employee file to the cloud and pick up on any device: coins, shop ranks, unlocks, achievements and a run in progress.</p>
        ${P.google || P.apple ? `<div class="acct-oauth">${P.google ? btn("google", "Continue with Google") : ""}${P.apple ? btn("apple", "Continue with Apple") : ""}</div>${P.email ? `<div class="acct-or">OR GET A CODE BY EMAIL</div>` : ""}` : ""}
        ${P.email ? `<label for="acct-email">EMAIL</label><input id="acct-email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" value="${esc(ui.email)}">
        <div class="acct-row">${btn("send", "Email me a code", "primary", " data-acct-enter")}</div>` : ""}
        <div class="acct-row">${btn("close", "Not now")}</div>
        <p class="acct-fine">We only use your email to sign you in. No newsletters. Your file still saves on this device either way.</p>`;
    }
    modal.innerHTML = `<div class="modal-card acct-card">${body}${ui.msg ? `<div class="acct-msg">${esc(ui.msg)}</div>` : ""}${ui.err ? `<div class="acct-err" role="alert">${esc(ui.err)}</div>` : ""}</div>`;
    modal.querySelectorAll("[data-acct]").forEach((b, i) => {
      const act = b.dataset.acct;
      if (window.bindNavItem) bindNavItem(b, 20 + i, () => onAct(act)); else b.addEventListener("click", () => onAct(act));
    });
    if (window.menuNav) window.menuNav.refresh();
    const inp = modal.querySelector("input");
    if (inp && !ui.busy) setTimeout(() => { try { inp.focus(); } catch (e) {} }, 30);
  }
  function onAct(act) {
    if (typeof sfx === "function") sfx("pick");
    ui.msg = "";
    if (act === "close") return close();
    if (act === "google" || act === "apple") return oauth(act);
    if (act === "send" || act === "resend") {
      const v = act === "resend" ? ui.email : ((modal.querySelector("#acct-email") || {}).value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { ui.err = "That email doesn't look right."; return render(); }
      return sendCode(v);
    }
    if (act === "verify") {
      const c = ((modal.querySelector("#acct-code") || {}).value || "").replace(/\D/g, "");
      if (c.length < 6) { ui.err = "The code is 6 digits."; return render(); }
      return verifyCode(c);
    }
    if (act === "restart") { ui.step = "start"; ui.err = ""; return render(); }
    if (act === "syncNow") return pull(false);
    if (act === "signOut") return signOut();
    if (act === "deleteCloud") { if (ui.confirmDelete) { ui.confirmDelete = false; return deleteCloud(); } ui.confirmDelete = true; ui.err = "Tap \"Delete my cloud save\" again to confirm. Your file on this device stays."; return render(); }
    if (act === "keepLocal") { ui.conflict = null; ui.step = "in"; setSync({ uid: session.user.id, dirty: true }); return push().then(() => { ui.msg = "Kept this device's file and saved it to the cloud."; render(); }); }
    if (act === "useCloud") { const row = ui.conflict.row; ui.conflict = null; ui.step = "in"; applyFile(row); ui.msg = "Using your cloud file."; return render(); }
  }
  function open() {
    ensureModal();
    window.accountModalOpen = true;
    modal.classList.remove("hidden");
    if (!signedIn() && ui.step === "in") ui.step = "start";
    render();
    if (!sb) client().then(() => { if (signedIn() && ui.step === "start") ui.step = "in"; render(); }).catch(e => { ui.err = friendly(e); render(); });
  }
  function close() {
    if (ui.step === "conflict") return; // you have to pick one
    if (modal) modal.classList.add("hidden");
    window.accountModalOpen = false;
    ui.err = ""; ui.msg = ""; ui.confirmDelete = false;
    refreshTitle();
  }
  function refreshTitle() {
    try {
      if (typeof titleOpen !== "undefined" && titleOpen && typeof renderTitleModal === "function" && window.game && !window.accountModalOpen)
        renderTitleModal(game.scene.scenes[0]);
    } catch (e) {}
  }

  // ---------- Hook the game's save functions (src/data/meta.js) so every save marks the file dirty ----------
  ["saveMeta", "saveRunState", "clearRunState"].forEach(fn => {
    const orig = window[fn]; if (typeof orig !== "function") return;
    window[fn] = function () { const r = orig.apply(this, arguments); markDirty(); return r; };
  });
  window.addEventListener("pagehide", () => { if (signedIn() && sync().dirty) push({ leaving: true }); });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && signedIn() && sync().dirty) push({ leaving: true });
    if (document.visibilityState === "visible" && signedIn() && Date.now() - lastPull > 30000) pull(false); // came back from another device
  });

  // ---------- Start up: only load the library if you're signed in or coming back from Google/Apple ----------
  function boot() {
    if (!on()) return;
    let has = false; try { has = !!localStorage.getItem(AUTH_KEY); } catch (e) {}
    const back = /[?&]code=|access_token=|[?&]error=/.test(location.search + location.hash);
    if (!has && !back) return;
    client().then(() => {
      if (back) { // tidy the address bar
        const u = new URL(location.href); ["code", "error", "error_code", "error_description"].forEach(k => u.searchParams.delete(k));
        history.replaceState(null, "", u.pathname + (u.search || "") + (/access_token/.test(u.hash) ? "" : u.hash));
        const err = new URLSearchParams(location.search).get("error_description");
        if (err) { ui.err = err; open(); }
      }
      if (signedIn()) pull(back);
    }).catch(() => {});
  }
  setTimeout(boot, 1200); // after the title screen is up

  return {
    open, close, signedIn, pull,
    // For the title screen badge: a short line about your cloud save
    status: () => {
      if (!on()) return null;
      if (!signedIn()) return { in: false, text: "Keep your file on every device" };
      const s = sync();
      return { in: true, text: s.dirty ? "Saving to the cloud..." : `Cloud save ${ago(s.at)}`, email: session.user.email || "" };
    },
    onTitle: () => { if (signedIn() && Date.now() - lastPull > 30000) pull(false); }
  };
})();
