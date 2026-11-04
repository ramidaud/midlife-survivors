# ChatGPT brief: final art audit before V2 (Nov 4, 2026)

Paste everything below the line into ChatGPT.

---

Thanks for the v3 phone title art. It's live in V. 1.76.2 and looks sharp. We're about to call this V2, so here's one last pass: an **art audit of the whole game and devlog**. **Please only report this time. Don't change art or code.** I'll pick what becomes the next art jobs.

**Repo:** main branch. **Live:** https://ramidaud.github.io/midlife-survivors/ (add `?nostats=1` so test runs aren't recorded). **Devlog:** /devlog/ and the Art Room at /devlog/art/.

## What to look at
1. **Consistency across everything you've made:** hero walk sheets, On Break portraits, intern and coworker portraits, enemy sheets and mugshots, boss art, the Gold Watch, the kill screen, key art. Flag mismatched pixel scale, outline weight, light direction, or anything off-palette.
2. **Scale between characters:** heroes vs interns vs coworkers vs enemies when they stand side by side in the game.
3. **Placeholders still in the game:** art that's still drawn in code (`src/sprites.js`, canvas textures) or never got a real sheet. One known example: the retirement figure at 65 is still a hooded reaper, even though it's now a friendly "CLOCK OUT HERE" goal.
4. **Missing animation:** anything that should move but doesn't, or loops that read wrong.
5. **Phone readability:** sprites, Spotlight cards and the kill screen at phone size.
6. **File weight:** oversized PNGs that could be JPG or WebP, and art in `assets/` that nothing uses anymore (generation sources, QA checks, retired files). List them; don't delete.

## Return format
Save as `docs/handoffs/chatgpt-final-pass-review.md`, then commit and push that one file:
- A 3-line summary.
- A **top 10**, ranked by how much each one helps players, each with an effort label (S / M / L) and a one-line art job description I could hand back to you.
- Then sections for Consistency, Placeholders, Animation, Phone readability, and File weight. For each finding: what, where (file or screen), and a suggested fix.
- Add a line to `docs/handoffs/chatgpt-changes.md`.
