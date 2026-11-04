# Fable brief: pre-V2 review (Nov 3, 2026)

Paste everything below the line into a new chat in the Midlife Survivors project, with Fable selected.

---

You're doing a fresh-eyes review of **Midlife Survivors** before we call it V2. It's a Vampire Survivors-style browser game about surviving ages 40 to 65. I'm Rami, a photographer, and this is my first game. Another Claude session has been building it with me, so you're the outside reviewer.

**Repo:** github.com/ramidaud/midlife-survivors (main branch). Live at https://ramidaud.github.io/midlife-survivors/. The devlog is at /devlog/ and the Art Room at /devlog/art/.
**Read first:** CLAUDE.md, docs/ROADMAP.md, and the last few entries of docs/PROGRESS_LOG.md.
**Stack:** Phaser 3.80.1 from cdnjs, plain JS, no build step. Content lives in src/data/*.js.

## Rules
- **Review only. Don't change game code.** Write your findings to `docs/handoffs/fable-review.md`, commit and push that one file. The other session fixes things one at a time after I approve them.
- **Never post test data** to the leaderboard or the runs table. Load the game with `?nostats=1`, or block Supabase in your test browser.
- **Supabase is read-only for you** (SELECT only), and only if a question needs real play numbers.
- Test at phone (390×844), iPad (820×1180 and 1180×820) and desktop (1440×900) sizes.

## What to look at
1. **Performance.** Frame rate late in a run (age 60+, full swarm, Gold Watch on screen), especially on phones. Look at object pooling, texture memory, DOM overlays (the Spotlight cards and lower thirds are HTML on top of the canvas), load time, image sizes in assets/, and anything that leaks across runs.
2. **Art and animation.** Do the sprites, portraits, Spotlight cards, kill screen and title slideshow read clearly at phone size? Flag anything stretched, blurry, misaligned, off-palette, or animating at the wrong speed. (We just found and fixed squashed phone title art, so check proportions.)
3. **UX and UI overview.** The first two minutes for a brand new player on a phone, the title screen, level-up choices, pause and settings, the death and retirement screens, and the devlog and Art Room pages. Where do people get confused, and where are tap targets too small or text too small?
4. **Bugs and rough edges** you notice along the way.

## Return format
In `docs/handoffs/fable-review.md`:
- A **top 10**, ranked by how much each one helps players, with an effort label (S / M / L) for each.
- Then sections for Performance, Art and animation, and UX/UI. For each finding: what you saw, where it is (file or screen), how to reproduce it, and a suggested fix.
- Keep it plain language. I have ADHD, so use short bullets, no em dashes, and a 3-line summary at the top.
- Add a line to `docs/handoffs/fable-changes.md` saying the review is ready.
