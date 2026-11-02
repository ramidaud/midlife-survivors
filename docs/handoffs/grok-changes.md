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

## 2026-11-01: Near-miss rewards spec (Grok Part 3C) [built: V. 1.30.0, awaiting Rami's playtest]
- What: implementation handoff for Close Call / near-miss rewards (definition, anti-farm rules with the V. 1.29.0 flow field, XP + speed burst + combo meter, HUD/SFX, tuning table, telemetry, acceptance tests). Spec only: no gameplay code in this step.
- File: `docs/handoffs/grok-near-miss.md` (replaces the short §3C sketch in `grok-difficulty-2026-11-01.md` as the source of truth for implementers).
- For Claude/Codex: add `src/data/nearMiss.js`, hook the bills/pings update loop, `NAV.hasClearApproach`, HUD meter, and Comfort Zone engagement via `dyn.lastHitAt`. Do not change hitboxes, spawn rates, Tax Bracket, or Comfort Zone Tax numbers.
- Pending after Rami playtests the implementation: mark **[done]** with version; then Part 3D age-50+ modifiers.
- Claude (V. 1.30.0): built as specced in `src/data/nearMiss.js` + `src/near-miss.js`, with hooks in main.js (scan, hurt reset, speed max, shared addXp), `NAV.hasClearApproach`, HUD meter, score term and a `nearMiss` sound. One deviation: the band is measured between the real physics hit boxes, not `PLAYER.size`, because the player's body is 48x52 (not 32). With the 32px circle model, "near misses" were actually hits. Tests: pass at gap 6-7 gives 1 credit, a far pass gives 0, a hit gives 0 and resets the streak, 12 in a row reaches tier 3 with the +5 bonus, and XP caps at exactly 6 per 10s. A desk blocks `hasClearApproach`.

## 2026-11-01: Age 50+ run modifiers spec (Grok Part 3D)
- What: implementation handoff for short mid-run modifiers after age 50 (Ghost Hour, Reading Glasses, Rent Hike, Empty Nest, Back Spasm, Reply-All Tax, Past Due, Open Enrollment). Covers roll cadence, anti-stack rules, Tax Bracket / Comfort Zone / Close Call / Dad Joke interactions, flashBanner copy, tuning table, debug force, acceptance tests. Spec only; no gameplay code in this step.
- File: `docs/handoffs/grok-modifiers.md` (expands the short §3D sketch in `grok-difficulty-2026-11-01.md`).
- For Claude/Codex: add `src/data/modifiers.js` (`RUN_MODIFIER_TUNING` + `RUN_MODIFIER_DEFS`), schedule by age-years using Midlife `secondsPerYear = 45`, announce with `flashBanner(title, sub, kind)`, suspend new Comfort Zone Tax while a modifier is active, keep Close Call XP caps, do not break flow-field spawning.
- Pending after implementation and Rami playtest: mark [done] with version.
