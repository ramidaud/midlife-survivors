# Midlife Survivors: Instructions for any AI agent

**Read `CLAUDE.md` first.** It is the single source of truth for this project: who Rami is, how sessions work, tech decisions, style rules (no em dashes), and the design spirit. Follow it as if it were written for you.

## Differences when you are not Claude (e.g. Antigravity / Gemini)
- **Skip** the steps that only Claude can do: publishing to claude.ai artifacts (the playtest and roadmap pages) and syncing the claude.ai Project. Don't edit `docs/roadmap.html` either; Claude republishes it.
- **Playtest locally instead:** open `index.html` in a browser. It runs straight from the folder with no server or build step.
- **Still keep the docs current** after every finished step: `docs/ROADMAP.md`, `docs/PROGRESS_LOG.md`, `docs/LEARNING_NOTES.md`, `docs/GAME_DESIGN.md`.
- **Bump the version after every finished step:** update `src/data/version.js` (`version`, `displayVersion`, `lastUpdated`, `build`, and prepend a new `changelog` entry) and increment the `?v=` cache-buster query string on the `<script>` tags in `index.html`.
- **Tag your log entries** with the tool name, e.g. `## 2026-11-03: Bills chase the player (Antigravity)`, so Claude can catch up, republish the playtest and sync the Project next time.
- **Don't change the rules** in `CLAUDE.md` or the tech decisions (Phaser 3 from cdnjs, no build step) without Rami's OK.
- **ChatGPT, Gemini and Grok** don't edit this folder. Their notes arrive in `docs/handoffs/<tool>-changes.md`.
