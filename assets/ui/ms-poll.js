// Midlife Survivors quick poll (Nov 3). One vote per browser, live results as totals only.
// Votes go to Supabase table poll_votes (insert-only); totals come from the poll_results view.
// Usage: <div data-ms-poll="accounts-v1"></div> anywhere, after window.LEADERBOARD is loaded.
window.MSPoll = (() => {
  const POLLS = {
    "accounts-v1": {
      tag: "QUICK POLL",
      question: "If Midlife Survivors had accounts so your progress followed you to every device, would you sign up?",
      options: [
        { id: "email",  label: "Yes, with email (a magic link, no password)" },
        { id: "apple",  label: "Yes, with Sign in with Apple" },
        { id: "google", label: "Yes, with Google" },
        { id: "no",     label: "No thanks, keep it simple" }
      ]
    }
  };
  const esc = t => String(t == null ? "" : t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  function voterId() {
    let v = store.get("ms-voter-id");
    if (!v) { v = Array.from(crypto.getRandomValues(new Uint8Array(12)), b => b.toString(16).padStart(2, "0")).join(""); store.set("ms-voter-id", v); }
    return v;
  }
  function api() {
    const L = window.LEADERBOARD; if (!L || !L.supabaseUrl) return null;
    const h = { apikey: L.supabaseAnonKey, "Content-Type": "application/json" };
    if (!String(L.supabaseAnonKey).startsWith("sb_")) h.Authorization = "Bearer " + L.supabaseAnonKey;
    return { url: L.supabaseUrl, h };
  }
  async function results(id) {
    const A = api(); if (!A) return null;
    try {
      const r = await fetch(`${A.url}/rest/v1/poll_results?poll=eq.${encodeURIComponent(id)}&select=choice,votes`, { headers: A.h, cache: "no-store" });
      if (!r.ok) return null;
      const out = {}; (await r.json()).forEach(x => { out[x.choice] = x.votes; }); return out;
    } catch (e) { return null; }
  }
  async function vote(id, choice) {
    const A = api(); if (!A) return false;
    try {
      const r = await fetch(`${A.url}/rest/v1/poll_votes`, { method: "POST", headers: Object.assign({ Prefer: "return=minimal" }, A.h), body: JSON.stringify({ poll: id, choice, voter: voterId() }) });
      return r.ok || r.status === 409; // 409 = this browser already voted
    } catch (e) { return false; }
  }
  async function render(el) {
    const id = el.dataset.msPoll, P = POLLS[id]; if (!P) return;
    const mine = store.get("ms-poll-" + id);
    el.classList.add("ms-poll");
    if (!mine) {
      el.innerHTML = `<div class="ms-poll-tag">${P.tag}</div><div class="ms-poll-q">${esc(P.question)}</div>
        <div class="ms-poll-opts">${P.options.map(o => `<button type="button" class="ms-poll-opt" data-choice="${o.id}">${esc(o.label)}</button>`).join("")}</div>
        <div class="ms-poll-foot">One vote per browser. Anonymous.</div>`;
      el.querySelectorAll(".ms-poll-opt").forEach(b => b.addEventListener("click", async e => {
        e.stopPropagation();
        el.querySelectorAll(".ms-poll-opt").forEach(x => x.disabled = true);
        b.classList.add("picked");
        const ok = await vote(id, b.dataset.choice);
        if (ok) { store.set("ms-poll-" + id, b.dataset.choice); try { if (typeof window.sfx === "function") window.sfx("pick"); } catch (err) {} render(el); }
        else { el.querySelector(".ms-poll-foot").textContent = "Couldn't reach the poll just now. Try again in a minute."; el.querySelectorAll(".ms-poll-opt").forEach(x => x.disabled = false); b.classList.remove("picked"); }
      }));
      ["pointerdown", "touchstart", "keydown"].forEach(t => el.addEventListener(t, e => e.stopPropagation()));
      return;
    }
    el.innerHTML = `<div class="ms-poll-tag">${P.tag} · RESULTS</div><div class="ms-poll-q">${esc(P.question)}</div><div class="ms-poll-res">Counting votes…</div>`;
    const R = await results(id) || {};
    const total = P.options.reduce((n, o) => n + (R[o.id] || 0), 0);
    el.querySelector(".ms-poll-res").innerHTML = P.options.map(o => {
      const n = R[o.id] || 0, pct = total ? Math.round(n / total * 100) : 0;
      return `<div class="ms-poll-row${o.id === mine ? " mine" : ""}"><div class="ms-poll-lbl">${esc(o.label)}${o.id === mine ? " <b>· your vote</b>" : ""}</div>
        <div class="ms-bar"><div class="ms-fill" style="width:${pct}%"></div></div><div class="ms-poll-n">${pct}%</div></div>`;
    }).join("") + `<div class="ms-poll-foot">${total} vote${total === 1 ? "" : "s"} so far. Thanks for weighing in.</div>`;
  }
  function mountAll(root) { (root || document).querySelectorAll("[data-ms-poll]").forEach(render); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => mountAll()); else mountAll();
  return { mountAll, render, POLLS };
})();
