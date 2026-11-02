# Grok changes

Newest at the bottom. Rami pastes Grok's change-log blocks here. Claude reads this at the start of each session and folds approved items into the game, then marks them **[done]**.

---

## 2026-11-01: Difficulty handoff (Grok) [done: Parts 1 and 2 in V. 1.25.0]
- Full handoff saved as `docs/handoffs/grok-difficulty-2026-11-01.md`.
- Part 2 bugs fixed: boss HP tag, double age damage, Pension/Exec Delegation on Remote/Sheet/Podcast, Podcast pierce, held keys scrolling level-up.
- Part 1 tuning applied as written. Also fixed: shop ranks were applied twice to Remote/Sheet/Podcast damage.
- 3A Tax Bracket [done: V. 1.26.0]. Leaderboard uses option 1 (bracket appended to the version field) to avoid a database change.
- 3B dynamic intensity [done: V. 1.27.0].
- Pending (one at a time, after Rami playtests): 3C near-miss, 3D age-50+ modifiers.

## 2026-11-01: Near-miss rewards spec (Grok Part 3C)
- What: implementation handoff for Close Call / near-miss rewards (definition, anti-farm rules with the V. 1.29.0 flow field, XP + speed burst + combo meter, HUD/SFX, tuning table, telemetry, acceptance tests). Spec only — no gameplay code in this step.
- File: `docs/handoffs/grok-near-miss.md` (replaces the short §3C sketch in `grok-difficulty-2026-11-01.md` as the source of truth for implementers).
- For Claude/Codex: add `src/data/nearMiss.js`, hook the bills/pings update loop, `NAV.hasClearApproach`, HUD meter, and Comfort Zone engagement via `dyn.lastHitAt`. Do not change hitboxes, spawn rates, Tax Bracket, or Comfort Zone Tax numbers.
- Pending after Rami playtests the implementation: mark **[done]** with version; then Part 3D age-50+ modifiers.
