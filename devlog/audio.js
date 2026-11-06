// Audio cards (Nov 6): in a memo, a line like
//   !audio[Title theme · Flow Music](../assets/audio/music/title.mp3)
// becomes a small player in the site's style: one play/pause button, a progress bar you can tap to seek, and the time.
// Only one card plays at a time. RSS and Substack get a plain "Listen" link instead.
window.audioCardHTML = function (label, src) {
  const e = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  return `<figure class="audio-card"><button class="ac-play" type="button" aria-label="Play ${e(label)}"><span class="ac-icon" aria-hidden="true">▶</span></button>` +
    `<div class="ac-meta"><span class="ac-title">${e(label)}</span><div class="ac-bar" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="ac-fill"></span></div>` +
    `<span class="ac-time">0:00</span></div><audio preload="metadata" src="${e(src)}"></audio></figure>`;
};
window.initAudioCards = function (root) {
  const fmt = t => (isFinite(t) ? Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0") : "0:00");
  (root || document).querySelectorAll(".audio-card").forEach(card => {
    if (card.dataset.ready) return; card.dataset.ready = "1";
    const a = card.querySelector("audio"), btn = card.querySelector(".ac-play"), icon = card.querySelector(".ac-icon"),
      bar = card.querySelector(".ac-bar"), fill = card.querySelector(".ac-fill"), time = card.querySelector(".ac-time"),
      label = card.querySelector(".ac-title").textContent;
    const show = () => {
      const pct = a.duration ? (a.currentTime / a.duration) * 100 : 0;
      fill.style.width = pct + "%"; bar.setAttribute("aria-valuenow", Math.round(pct));
      time.textContent = fmt(a.currentTime) + " / " + fmt(a.duration);
    };
    const state = playing => { icon.textContent = playing ? "❚❚" : "▶"; btn.setAttribute("aria-label", (playing ? "Pause " : "Play ") + label); card.classList.toggle("playing", playing); };
    btn.addEventListener("click", () => {
      if (a.paused) { document.querySelectorAll(".audio-card audio").forEach(o => { if (o !== a) o.pause(); }); a.play().catch(() => {}); }
      else a.pause();
    });
    a.addEventListener("play", () => state(true)); a.addEventListener("pause", () => state(false));
    a.addEventListener("ended", () => { state(false); a.currentTime = 0; show(); });
    a.addEventListener("timeupdate", show); a.addEventListener("loadedmetadata", show);
    const seek = x => { const r = bar.getBoundingClientRect(); if (a.duration) { a.currentTime = Math.max(0, Math.min(1, (x - r.left) / r.width)) * a.duration; show(); } };
    bar.addEventListener("click", ev => seek(ev.clientX));
    bar.addEventListener("keydown", ev => {
      if (!a.duration) return;
      if (ev.key === "ArrowRight") a.currentTime = Math.min(a.duration, a.currentTime + 5);
      else if (ev.key === "ArrowLeft") a.currentTime = Math.max(0, a.currentTime - 5);
      else return;
      ev.preventDefault(); show();
    });
  });
};
