// Memo layout behaviors for the static share pages (devlog/<slug>/index.html). The devlog app (app.js) does the same.
// Before/after sliders, "Then and now" tabs, and tap a picture to see it full size.
window.initPostLayout = root => {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  root.querySelectorAll(".ba-post .ba").forEach(ba => {
    const r = ba.querySelector("input"), set = () => ba.style.setProperty("--cut", r.value + "%");
    r.addEventListener("input", set); set();
  });
  root.querySelectorAll(".ba-tabs").forEach(box => {
    const chips = [...box.querySelectorAll(".bt-chip")], panels = [...box.querySelectorAll(".ba-post")];
    chips.forEach((c, i) => c.addEventListener("click", () => {
      chips.forEach((x, j) => x.setAttribute("aria-selected", String(j === i))); panels.forEach((p, j) => { p.hidden = j !== i; });
    }));
  });
  root.querySelectorAll(".prose img:not(.ba img)").forEach(im => {
    im.classList.add("zoomable");
    im.addEventListener("click", () => {
      const o = document.createElement("div"); o.className = "img-zoom"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", im.alt || "Image");
      o.innerHTML = `<img src="${im.currentSrc || im.src}" alt="${esc(im.alt || "")}"><button type="button" aria-label="Close">×</button>`;
      const close = () => { o.remove(); document.removeEventListener("keydown", key); }, key = e => { if (e.key === "Escape") close(); };
      o.addEventListener("click", close); document.addEventListener("keydown", key); document.body.appendChild(o);
    });
  });
};
