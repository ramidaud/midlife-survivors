# Midlife Survivors: Instructions for any AI agent

**Read `CLAUDE.md` first.** It is the single source of truth for this project: who Rami is, how sessions work, tech decisions, style rules (no em dashes), and the design spirit. Follow it as if it were written for you.

## Differences when you are not Claude (e.g. Antigravity / Gemini)
- **Skip** the steps that only Claude can do: publishing to claude.ai artifacts (the playtest and roadmap pages) and syncing the claude.ai Project. Don't edit `docs/roadmap.html` either; Claude republishes it.
- **Playtest locally instead:** open `index.html` in a browser. It runs straight from the folder with no server or build step.
- **Still keep the docs current** after every finished step: `docs/ROADMAP.md`, `docs/PROGRESS_LOG.md`, `docs/LEARNING_NOTES.md`, `docs/GAME_DESIGN.md`.
- **Bump the version after every finished step:** update `src/data/version.js` (`version`, `displayVersion`, `lastUpdated`, `build`, and prepend a new `changelog` entry) and increment `BUILD` in `src/loader.js`. New code files go in its `GAME_FILES` list (not as `<script>` tags in `index.html`).
- **Tag your log entries** with the tool name, e.g. `## 2026-11-03: Bills chase the player (Antigravity)`, so Claude can catch up, republish the playtest and sync the Project next time.
- **Don't change the rules** in `CLAUDE.md` or the tech decisions (Phaser 3 from cdnjs, no build step) without Rami's OK.
- **ChatGPT, Gemini and Grok** don't edit this folder. Their notes arrive in `docs/handoffs/<tool>-changes.md`.
- **Art preview:** `art-test.html` is shown inside the devlog's Art Room (`devlog/art/`, loaded with `?embed=1`, which hides its eyebrow and nav links). Keep working in `art-test.html`; the devlog page picks up changes automatically.
- **Play stats (V. 1.30.1):** the game sends one anonymous row per run to the Supabase `runs` table and counts visits with GoatCounter (`src/telemetry.js`). **Testing must never send real stats or scores:** open the game with `?nostats=1`, or block `supabase.co` and `goatcounter.com` / `gc.zgo.at` in your test harness. Never post test rows to the leaderboard either.
