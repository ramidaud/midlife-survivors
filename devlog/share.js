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
