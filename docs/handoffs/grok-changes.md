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

## 2026-11-02: Boss attacks spec (Grok) [built: V. 1.34.0, awaiting Rami's phone playtest]
- What: implementation handoff for special attacks on the three Midlife decade bosses (Performance Review charge, 30-Year Mortgage % shockwave rings, Midlife Crisis V8 drift + skid marks). Covers telegraphs, speeds, sizes, damage, cooldowns, phone-fair floors, furniture rules, Close Call / Comfort / modifiers / Dad Joke / i-frame interactions, tuning table, debug force, acceptance tests. Spec only; no gameplay code in this step.
- File: `docs/handoffs/grok-boss-attacks.md`.
- For Claude/Codex: add `src/data/bosses.js` (`BOSS_ATTACK_TUNING` + `BOSS_ATTACKS`), state machine on `boss._atk` in the bills update loop, edge pips for off-screen bosses, keep `hurtPlayer` i-frames, do not farm Close Calls from skid zones, do not widen idle boss hitboxes without Rami (current `ENEMY_SCALE.bossHitbox` is half of texture frame, not half of visual).
- Pending after implementation and Rami phone playtest: mark [done] with version.
- Claude review (Nov 2): spec approved for the next build. One correction to §9.1: the boss body is set in texture-frame units and then scaled by the sprite's 2.3x, so the real hit box is about 74x78 on a ~147x156 Performance Review, which is half the visual as Rami asked. No hitbox change needed.

## 2026-11-02: Weapon roles and balance pass spec (Grok) [built: V. 1.43.0, awaiting Rami playtest]
- What: implementation handoff giving each of the six weapons a distinct role (Coffee primary, Dad Joke crowd burst, Remote seeker, Spreadsheet blender, Podcast lane clearer, "No." space-maker). Current vs proposed tables at rank 1 and max, evolution notes, Dad Joke number check after V. 1.41.0, trap-pick list, rewritten card text, interactions, tests. Spec only; no gameplay code in this step.
- File: `docs/handoffs/grok-weapon-roles-spec.md` (answers `docs/handoffs/grok-weapon-roles.md`).
- For Claude/Codex: tune `src/data/weapons.js` / `upgrades.js` / `meta.js` per the tables (Joke cadence and softer push, Louder Groan cadence scaling, Firm Boundaries damage only on ranks 2 and 4, "No." push up with a cap, Pun Storm evo flinch key). Keep changes data-driven. Do not revert Joke to a long freeze.
- Pending after Rami approval, implementation, and playtest: mark [done] with version.

## 2026-11-02: Art coherence review (Grok)
- What: review only. Strong office look; main gaps are stage identity (hospital/home/social/senior are data, not places), mixed rendering finish (flat rugs, emoji UI vs pixel cast), sparse campus vs dense key art.
- File: `docs/handoffs/grok-art-coherence-review.md` (screenshots stayed on Grok's side).
- Claude note: in the Midlife run the office IS the whole journey by design (promotions are the chapters); stages matter for Full Life. Quick wins queued for Rami to pick.

## 2026-11-03: Healing sustain spec + Interns / Lounge addendum (Grok) [part 1 built: V. 1.61.0 birthdays + Desk Salad; interns and Lounge next]
- What: TJ (401(k) maxed) asked for more ways to heal so runs can go longer. Spec adds birthday milestone heals every 5 years from age 45 (18% max HP, 25% on decades, via `healAmt`) and a Desk Salad elite drop (45% chance, pity every 3, 22% max HP, 14 s wilt, max 2 on ground). **Addendum (Rami + TJ):** roaming Interns deliver snacks/coffee/short buffs on an age-thinned cadence (NAV pathing, phone-fair handoff, flee-on-bump, no deliveries during bosses or Comfort Zone Tax). **Lounge shop:** not a roaming stand; a real Break Room (`breakroom` district, unlocks at the age-45 Campus promotion) counter staffed by an intern. Pause only while browsing at the counter (VS-style, phone-fair) with a one-shot Facilities bubble; visit windows on promotion beats (45/50/55/60) plus optional level bonuses; anti-safe-room rules (timed shutter, enemies still path in, threat closes register, Comfort Zone still arms, loiter pack bias, no passive regen). Shared heal budget skips intern snacks above 75% HP. Pizza, level-up +1, Checkup, Boundaries, revives, and Tax Bracket stay as-is.
- File: `docs/handoffs/grok-healing-spec.md` (answers `docs/handoffs/grok-healing.md`; Interns + Lounge in §8).
- For Claude/Codex: add `src/data/healing.js` and `src/data/interns.js`; extend `PICKUPS.salad` and `INTENSITY.elites.salad*`; hook milestone heal beside the 5-year dividend; elite salad drops; intern delivery AI; Lounge state machine pinned to `START_AREA_LAYOUT` district `breakroom` (not `stages.js`). Do not buff plant pizza to 100%, do not bypass `healAmt`, do not seal Break Room from NAV, do not retune spawns or Tax Bracket in this pass. Roster names stay data-only placeholders until Rami supplies playtester nicknames.
- Pending after Rami approval, implementation, and TJ playtest: mark [done] with version.

- Nov 3: Age 50+ run modifiers (Part 3D) **[done: V. 1.65.0]**. Built as specced: 8 modifiers in src/data/modifiers.js, runtime in src/modifiers.js. Small differences: no vignette or HUD icon art yet (banner + chip only); Rent Hike intensity is 1.25 x (1 + 0.05 per Tax Bracket).
## 2026-11-03: Difficulty curve check after healing (Grok) [spec only]
- What: Rami's post-healing play stats (V. 1.61 to 1.69, n=32) show longer runs (median age ~43 to ~48, minutes ~4 to ~9) but a hard wall at 60 to 61 (11 of 23 deaths), with Group Chat as top last-hit killer. Spec checks the reading against code: Group Chat + Math Homework + Midlife Crisis V8 all debut at age 60; GC avg killer age ~63.4 is mostly eight deaths at 61 plus one overtime at 81; V8 only gets 1 attributed kill (ping last-hits during the boss). Healing looks about right; do not nerf it. Hero and phone gaps are real but confounded with veterans / Grad Student / desktop.
- File: `docs/handoffs/grok-difficulty-curve-spec.md`.
- Proposed (5 small reversible knobs): (A) soft-intro `groupChat` weight 1 at wave minAge 50, cut weight 2 to 1 at 60; (B) V8 `firstAttackDelayMs` 1400 to 2200 and `telegraphMs` 650 to 750; (C) age-40 wave `everyMs` 1150 to 1400; (D) `VIEW.minZoom` 0.75 so phones can zoom out (move VIEW into data); (E) GC `typingMs` 650 to 850, `pingSpeed` 210 to 190. Plus telemetry fields: view_zoom, view_short_px, touch_mode, boss_alive_at_death, pings_hit, age_at_first_group_chat, meta_shop_ranks.
- Targets: Tax 0 new-ish reach 50 / 55 / 65 about 55 to 65% / 30 to 40% / 8 to 12%; overall about 70 to 80% / 45 to 55% / 15 to 20%. Watch 60 to 61 death share fall under ~25%.
- For Claude/Codex: data-only in `enemies.js` / `bosses.js` / VIEW data; do not retune HEALING, salad, interns, Tax Bracket, Bill HP, or V8 spawnAge this pass.
- Pending after Rami approval, implementation, and a fresh stats slice: mark [done] with version.
- [partly done] Claude shipped A, B and E in V. 1.71.1 (Nov 3). C (slower age-40 drip) and D (phone zoom-out) wait for Rami's call; the telemetry columns need his OK for a Supabase change.
