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

  window.initSidenotes = function (root) {
    root = root || document;
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

  document.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
  window.addEventListener("resize", () => closeAll());
})();
