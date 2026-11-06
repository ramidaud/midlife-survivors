// Share a memo (Nov 4, Rami). Phones open the native share sheet (Messages, Instagram, Mail...).
// Everything else copies the link and says so. The link is the memo's own page, which has a preview card.
window.msShare = async function (btn) {
  const url = btn.dataset.url, title = btn.dataset.title || document.title;
  const text = btn.dataset.text || "";
  try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "share-" + (btn.dataset.slug || ""), title: "Share: " + title, event: true }); } catch (e) {}
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return; }
    catch (e) { if (e && e.name === "AbortError") return; } // they closed the sheet: that's fine
  }
  let ok = false;
  try { await navigator.clipboard.writeText(url); ok = true; } catch (e) {
    const ta = document.createElement("textarea"); ta.value = url; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); try { ok = document.execCommand("copy"); } catch (e2) {} ta.remove();
  }
  const label = btn.querySelector(".share-label") || btn, old = label.textContent;
  label.textContent = ok ? "Link copied" : url;
  btn.classList.add("copied");
  setTimeout(() => { label.textContent = old; btn.classList.remove("copied"); }, 2200);
};

// Desktop social buttons (Nov 6, Rami): next to every Share button, a row of plain links to post the memo.
// Only shown with a mouse (CSS), since phones get the share sheet, which covers every app they have.
window.msShareLinks = function (root) {
  (root || document).querySelectorAll(".btn-share").forEach(btn => {
    const next = btn.nextElementSibling;
    if (next && next.classList.contains("share-links")) return;
    const url = encodeURIComponent(btn.dataset.url || location.href), title = btn.dataset.title || document.title;
    const text = encodeURIComponent(title + (btn.dataset.text ? " " + btn.dataset.text : ""));
    const nets = [
      ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${url}`],
      ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${url}`],
      ["Bluesky", `https://bsky.app/intent/compose?text=${text}%20${url}`],
      ["X", `https://x.com/intent/post?text=${text}&url=${url}`],
      ["Email", `mailto:?subject=${encodeURIComponent(title)}&body=${text}%0A%0A${url}`]
    ];
    const wrap = document.createElement("span");
    wrap.className = "share-links"; wrap.setAttribute("aria-label", "Post this memo");
    wrap.innerHTML = nets.map(([n, h]) => `<a class="btn btn-social" href="${h}"${n === "Email" ? "" : ' target="_blank" rel="noopener"'} data-net="${n}">${n}</a>`).join("");
    wrap.addEventListener("click", e => {
      const a = e.target.closest("a"); if (!a) return;
      try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "share-" + a.dataset.net.toLowerCase() + "-" + (btn.dataset.slug || ""), title: "Share on " + a.dataset.net, event: true }); } catch (err) {}
    });
    btn.after(wrap);
  });
};
document.addEventListener("DOMContentLoaded", () => msShareLinks(document));
