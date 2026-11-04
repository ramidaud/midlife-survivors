# Gemini brief: final copy pass before V2 (Nov 4, 2026)

Paste everything below the line into Gemini and attach these files: `src/data/spotlight.js`, `src/data/deaths.js`, `src/data/achievements.js`, `src/data/tips.js`, `src/data/lore.js`, `src/data/meta.js`, `src/data/upgrades.js`, `src/data/interns.js`, `src/data/modifiers.js`, `src/data/title-copy.js`, `src/data/enemies.js`, `src/data/bosses.js`.

---

Thanks for the Spotlight copy, the tip lines and the Gold Watch lines. They're all in the game. We're about to call this V2, so here's one last pass over **every line a player reads**. **Please only report this time.** I'll pick what to change.

## What to look for
1. **Voice:** warm, recognizable midlife humor, never mean. Flag anything that punches down or feels cranky.
2. **Repeats:** the same joke or phrasing used twice (death lines, tips, achievements).
3. **Consistency:** names spelled the same everywhere:
   - **Heroes:** The 9-to-5er, The Soccer Dad, The Grad Student at 45, **The Coldwar Cowboy** (one word, Ben's preference).
   - **Interns:** TJ and Derek.
   - **Coworkers:** Art, Sam, Eli, Nora, June, Mina.
   - **Bosses:** the Performance Review, the 30-Year Mortgage, the Midlife Crisis V8, the Gold Watch.
4. **Fit on a phone:** Spotlight lines 60 characters max, tips 55 max, achievement names short enough for one line. Flag anything longer.
5. **Clarity:** can a new player tell what an upgrade, modifier or achievement actually does? Flag vague ones.
6. **Typos, grammar, em dashes** (we don't use em dashes anywhere), and real brand names (we avoid them).
7. **Gaps:** any hero missing a line another hero has, or a tip that never got a line.
8. **Don't rewrite** TJ's and Derek's lines; they wrote their own.

## Return format
Save as `docs/handoffs/gemini-final-pass-review.md` (or paste it to Rami):
- A 3-line summary.
- A **top 10**, ranked by how much each fix helps players.
- Then one table for everything else: **file · current text · problem · suggested text**. Give two options when it's a joke.
