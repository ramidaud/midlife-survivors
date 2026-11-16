// Inline references, popover style (inspired by hankgreen.com).
// Markup comes from posts written with ^[note]: <button class="sn-ref"> + <span class="sn"> inside .prose.
// Click a number: the note pops in as a card just under that line. Click the X, press Escape,
// or click anywhere else to close. One note open at a time.
(function () {
  function closeAll(except) {
    document.querySelectorAll(".sn.open").forEach(n => {
      if (n === except) return;
      n.classList.remove("open");
      const b = document.querySelector(`.sn-ref[aria-controls="${n.id}"]`);
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  function place(btn, note) {
    const prose = btn.closest(".prose") || document.body;
    const pr = prose.getBoundingClientRect(), br = btn.getBoundingClientRect();
    const width = Math.min(380, pr.width);
    note.style.width = width + "px";
    const left = Math.max(0, Math.min(br.left - pr.left - 40, pr.width - width));
    note.style.left = left + "px";
    note.style.top = (br.bottom - pr.top + 10) + "px";
  }

  // Keep the number on the same line as the word before it (Nov 16, Rami: a "1" wrapped onto its own line).
  // A button is an inline box, so the browser may break the line right before it. We wrap the last word
  // (or a short link) together with the number in a span that never breaks.
  function glue(btn) {
    if (btn.parentNode && btn.parentNode.classList && btn.parentNode.classList.contains("sn-glue")) return;
    const prev = btn.previousSibling, span = document.createElement("span");
    span.className = "sn-glue";
    if (prev && prev.nodeType === 3) {
      const m = prev.textContent.match(/(\S+)$/);
      if (!m) return;
      const tail = prev.splitText(prev.textContent.length - m[1].length);
      btn.parentNode.insertBefore(span, tail);
      span.appendChild(tail);
    } else if (prev && prev.nodeType === 1 && (prev.textContent || "").length <= 30) {
      btn.parentNode.insertBefore(span, prev);
      span.appendChild(prev);
    } else return;
    span.appendChild(btn);
  }

  window.initSidenotes = function (root) {
    root = root || document;
    root.querySelectorAll(".sn-ref").forEach(glue);
    root.querySelectorAll(".sn-ref").forEach(btn => {
      const note = document.getElementById(btn.getAttribute("aria-controls"));
      if (!note || btn.dataset.snReady) return;
      btn.dataset.snReady = "1";
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const open = !note.classList.contains("open");
        closeAll(note);
        if (open) { place(btn, note); note.classList.add("open"); btn.setAttribute("aria-expanded", "true"); const x = note.querySelector(".sn-close"); if (x) x.focus({ preventScroll: true }); }
        else { note.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
      });
      note.addEventListener("click", e => e.stopPropagation());
      const x = note.querySelector(".sn-close");
      if (x) x.addEventListener("click", () => { closeAll(); btn.focus({ preventScroll: true }); });
    });
  };

  // Share pages have no app.js to call initSidenotes, so glue their numbers on load too.
  const glueAll = () => document.querySelectorAll(".sn-ref").forEach(glue);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", glueAll); else glueAll();

  document.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
  window.addEventListener("resize", () => closeAll());
})();
