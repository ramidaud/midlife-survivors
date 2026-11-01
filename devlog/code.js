// Code snippets in devlog posts: light syntax colors, line numbers and a Copy button.
// Posts write fenced blocks with a file name:   ```js src/data/swarms.js
// The renderer turns those into <figure class="code-card"> (app.js and scripts/build_devlog.py).
(function () {
  const KW = /^(const|let|var|function|return|if|else|for|while|new|true|false|null|undefined|this|window)$/;
  const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  // Tiny tokenizer: comments, strings, numbers, keywords. Comments are the "why", so they stand out most.
  function highlight(src) {
    const re = /(\/\/[^\n]*|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
    let out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      if (m[1]) out += `<span class="tk-c">${esc(m[1])}</span>`;
      else if (m[2]) out += `<span class="tk-s">${esc(m[2])}</span>`;
      else if (m[3]) out += `<span class="tk-n">${m[3]}</span>`;
      else out += KW.test(m[4]) ? `<span class="tk-k">${m[4]}</span>` : esc(m[4]);
      last = re.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  window.initCodeCards = function (root) {
    (root || document).querySelectorAll(".code-card").forEach(card => {
      if (card.dataset.ready) return;
      card.dataset.ready = "1";
      const code = card.querySelector("code");
      const raw = code.textContent.replace(/\n$/, "");
      code.innerHTML = highlight(raw).split("\n").map(l => `<span class="ln">${l || " "}</span>`).join("");
      const btn = card.querySelector(".code-copy");
      if (btn) btn.addEventListener("click", () => {
        const done = () => { btn.textContent = "Copied"; setTimeout(() => (btn.textContent = "Copy"), 1400); };
        if (navigator.clipboard) navigator.clipboard.writeText(raw).then(done, done); else done();
      });
    });
  };
})();
