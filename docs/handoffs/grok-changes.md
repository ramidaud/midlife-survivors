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
- [done] A, B and E in V. 1.71.1; C and D in V. 1.72.0 (Rami OK, Nov 3). Telemetry fields are coded behind DIFFICULTY_DETAIL in src/telemetry.js; they switch on once Rami runs docs/sql/RUNS_DIFFICULTY.sql.
## 2026-11-03: The Gold Watch final-boss numbers (Grok) [spec only]
- What: Midlife finale boss after the difficulty pass. Giant gold pocket watch ticking down ("Time's up"), spawn age 63.5, base HP 150 (scales with existing bossHpPerLevel / bossHpPerYear / Tax enemyHpMult). Decent ~50 DPS clears in ~45 to 60 s; weak ~8 DPS cannot finish before Retirement Party at 65. Attacks: Minute Hand beam (leading-edge hurt, 70 deg/s, length 280), Hour Hand from 60% HP, Alarm rings with fixed 12 o'clock gap, Loose Gears. Phases Ticking / Overtime / Last Minute. Swarm thins hard during the duel (spawnDelayMult 1.80, pack 0.40, pause Group Chat / Math / Calendar Invite). Still clock out at 65 if it lives (no keepsake); kill earns tier-5 chest, +35 coins, achievement "On The Hour."
- File: `docs/handoffs/grok-gold-watch-spec.md`.
- For Claude/Codex: add `ENEMIES.goldWatch`, `BOSS_ATTACKS.goldWatch`, `minTelegraphMsWatch: 700`, chest tier 5, Midlife bosses list entry. Leading-edge hand damage required for cross-behind. Do not retune HEALING or V8. Respect hurtCooldownMs i-frames and existing Tax HP mult.
- Watch after ship: among runs reaching 63.5, kill rate 40 to 60%; deaths with boss_alive_at_death=goldWatch 25 to 40% of late deaths; median fight 45 to 65 s.
- Pending after Rami approval, art, implementation, and stats: mark [done] with version.
- [done] Built in V. 1.73.0 (Nov 3). Hands are leading-edge only; swarm thins while it's alive; kill = tier-5 chest + 35 coins + Five O'Clock Somewhere + keepsake; still ticking at 65 = retire anyway. Telemetry fields gold_watch_phase_reached / gold_watch_killed not added yet (needs a Supabase column change).
- Update (Nov 3, V. 1.73.1): Rami made the watch unkillable (VS Reaper style). HP and kill tuning no longer apply; hits push it back and slow its hands (wind: pushPerDamage 6, maxPushPerHit 60, maxPushSpeed 240, handSlowMult 0.85, handSlowMs 400). Worth a Grok pass on the wind-back numbers after real runs.
## 2026-11-04: Final balance pass before V2 (Grok) [report only]
- What: report-only review of V. 1.76.2 with the V. 1.72+ stats (35 runs, 11 players). The 60 to 61 wall is gone. The new 52 to 53 bump (29% of deaths) comes from the Mortgage overlapping the age-50 swarm, and the Mortgage itself kills nobody. The Gold Watch Minute Hand tip moves 438 to 605 px/s after age, Tax and phase scaling. The big red gem at cap 150 can only spike levels below about L9.
- File: `docs/handoffs/grok-final-pass-review.md`.
- Top 5 (Rami picks): (1) `mortgageRefinance.hp` 110 to 85; (2) `goldWatch.minuteHand.sweepDegPerSec` 70 to 55; (3) `performanceReview.hp` 45 to 36; (4) 9-to-5er `apply` +2 maxHp; (5) `snackAttack.slowDurationMs` 1800 to 1400.
- Data flags: the overtime death at 77 conflicts with "reached 65 = 0"; the median death age is 52 (49.6 is the median over all runs); 42 to 49 is 45% of deaths, not a third.
- Leave it: healing, Group Chat, V8, gem cap, Tax Bracket, ring and alarm geometry, 60 s despawns.
- Pending: Rami's picks, then mark [done] with version.
- [done] Rami picked all 5; shipped in V. 1.77.0 (Nov 4).


## Nov 4: balance check (V. 2.1)
Checked at V. 2.1.0, commit 50ec8cd. Numbers only, no game code touched. Claude applies whatever Rami picks.

**1. Sprint coins (`src/data/modes.js`, `SPRINT.coinMult`): too strong, mildly.**
- Change: `SPRINT.coinMult` 1.5 -> 1.25.
- Why: spawn waves key off age but spawn delays tick in real time, so Sprint gives about half the kills per run, and coin drops come out around 0.75x per run but 1.5x per minute. The birthday dividends (about 24 coins in a full Midlife run) come twice as fast and pay 1.5x, so they work out to 3x per minute. Overall Sprint farms about 2x to 2.5x the coins per minute of a normal run. At 1.25 it's still the fastest farm (about 1.25x to 2.5x per minute) and still pays for the faster enemies, but a normal run stops looking like a waste of an evening.
- Watch: the share of all 401(k) coins earned in Sprint runs. If it's over about 60% while Sprint is under 40% of runs, trim again.

**2. Full Life bosses (`src/data/enemies.js`): HOA fine, Audit a bit spongy, Pickleball too strong.**
- Boss HP is `hp * (1 + (level-1)*0.28) * (1 + (age-40)*0.10) * (1 + Tax)`. Guessing level 30 / 37 / 45 at ages 70 / 79 / 90, Tax 0: HOA about 7,700 HP, Audit about 16,400, Pickleball about 36,800. For scale, the V8 at 60 and level 20 is about 3,800. At a late build doing 120 to 160 DPS, that's about 60 s, 2 min and almost 4 min of chasing a pickleball paddle.
- Telegraphs: the age cut (4 ms per year) pushes HOA charge (650) and Pickleball drift (700) to the 550 floor, and Audit rings (800) to the 650 rings floor. Attack speed hits the 1.45x cap, so Pickleball drift runs about 536 px/s. Damage is 3 to 4 plus the +3 age bonus, so 6 to 7 per hit on roughly 12 to 30 max HP. That's scary but fair, as long as the fight doesn't last forever.
- `hoaPresident.hp`: leave it (210).
- `retirementBoss.hp` 300 -> 260 (about 14,200 HP, roughly 1.5 min). Three ring waves at the telegraph floor already make it a real test.
- `pickleballChamp.hp` 460 -> 340 (about 27,200 HP, roughly 3 min). A 4-minute fight at 536 px/s is just a long way to lose a good run.
- Damage and telegraphs: leave them.
- Watch: median fight length per boss (aim for 60 to 150 s) and the share of Full Life deaths with each boss alive.

**3. Sticky Notes (`src/data/weapons.js`, `stickyNotes`): too strong.**
- Change: `stickyNotes.damage` 3 -> 2. Keep `count` 2 and `stickMs` 1500, since the sticking is the fun part Rami asked for.
- Why: at base it does 2 notes x 3 damage every 1.5 s, which is about 4 DPS on every enemy in the 50 px pop, plus a 1.5 s freeze (0.9 s on neighbors). Coffee does about 1.5 single-target DPS, Remote about 2, Dad Joke about 0.9 area. Maxed out (4 Bulk Packs plus Post-It Wall), you get 6 notes, 9 damage, a 70 px pop and 2.6 s freezes: about 36 area DPS plus near-permanent crowd control. At 2 damage, base drops to about 2.7 DPS, still the best opener, and max drops to about 32.
- Watch: Sticky pick rate and its share of damage. If it's over 40% of damage in runs that take it, the next knob is the Bulk Pack +1 damage per rank, in loadout.js.

[done] All three applied by Claude in V. 2.1.1 (Sprint coins 1.25, Audit hp 260, Pickleball hp 340, Sticky damage 2).

## Nov 8, 2026: Three new office bosses spec (Grok) [spec only]
Checked at V. 2.11.5 (build 291), commit 86ee92d. No game code touched. Claude applies whatever Rami picks.
- File: `docs/handoffs/grok-office-bosses-spec.md`.
- **Your New Boss (Age 26), age 48, every run.** Dash chain: 2 dashes (3 below half HP), 400 px lanes 88 px wide, 520 px/s, a 650 ms first warning and 600 ms follow-ups (550 floor), winded for 1.1 s after each chain, and a 2 s Sugar Crash every third chain in phase 2. A pep-talk bubble comes with every attack; the lane is the rule. HP 40 (1.11x Review), dash damage 1. Drops a tier 1 chest and a guaranteed Energy Drink.
- **The Holiday Party, slot at 56.** A conga line of 5 to 7 followers (Bill-tough, 34 px apart, the line closes up 500 ms after a dancer drops) plus 2 to 3 mistletoe zones, 56 px radius, 1000 ms warning (new 750 floor), armed for 2.4 s. Freeze: 600 ms stop, no damage for 1.0 s, 2.5 s immunity, no follow-up attack for 1.5 s, and 3 s or more between freezes. Phase 2 adds a short Group Hug lunge. HP 60 (1.67x). Drops a tier 3 chest and a Desk Salad.
- **The Reorg, slot at 56.** He brings his own rolling Hot Desks (3, or 4 in phase 2) and leaves the baked office desks alone. 2 to 3 desks slide 128 to 224 px along one axis at 240 px/s, with ghost outlines and a 1000 ms warning (750 floor). A desk never lands on the player, never leaves a gap between 1 and 95 px, and must never box you in (flood fill to 2 view edges). The flow field rebuilds the moment a slide ends. New Org Chart: all regular spawns come from one corner for 6 s (phase 2: one edge for 8 s, then one hop), with edge markers 1200 ms ahead. HP 65 (1.81x). Drops a tier 3 chest and a Fanny Pack.
- **Ages:** the New Boss at 48 fills the 45 to 52 gap before the age-50 swarm jump, where most players still are. 56 is one "middle management" slot that picks the Reorg or the Party each run, after the 55 cake and Executive Wing promotion and well before the V8 at 60. If both have to run every time: 55.5 and 57.5, but I'd expect the old 60 wall to come back.
- **Every boss gets a swarm-thinning block** (generalize `GoldWatch.duel()`). It pauses Calendar Invites during all three and donuts during the Party. Tax Bracket scaling stays as is.
- Pending: Rami picks rotation vs both, and stop vs slow for the freeze. Hot Desk art is needed. Then build and phone playtest.

## Nov 9, 2026: Overtime plateau spec (Grok) [spec only]
Checked at V. 2.13.3 (build 296), commit 635a667. No game code touched. Claude applies whatever Rami picks.
- File: `docs/handoffs/grok-overtime-plateau-spec.md` (answers `grok-late-game-brief.md`).
- **Found in the code:** in Overtime the Gold Watch isn't at 63.5. It arrives 1.5 years before the end (68.5, 73.5 or 78.5), so the last boss before it is the V8 at 60. With 25 s years its window also shrank from 67.5 s to 37.5 s. Fix: `goldWatch.lateArrivesYearsBeforeEnd: 2.7` (67.5 s) plus late phase thresholds 0.9 and 2.0.
- **Overtime beats (`OVERTIME_BEATS`), one every 50 to 65 s past 64, skipped if the Watch is too close:**
  - **Open Enrollment** at 64 (4 timed errand legs of 10 s each, 450 to 800 px apart, Spam Likely hold music; tier 3 chest and +2,500 score). Comes back as 3-leg Annual Enrollment at 75.8.
  - **Grandkids' Visit** at 66: tag 3 kids running at 150 px/s through the swarm in 20 s; gifts, tier 1 chest, +2,000.
  - **Clean Out Your Desk** at 68.5: pack 8 keepsakes by hand (no magnet) in 15 s before hagglers sell them; tier 3 chest at 6.
  - **HOA President** reused at 70 (runs ending at 80 only).
  - **Reunion** at 70 or 72.5: walk past 8 old coworkers to catch up; tier 1 chest at 6.
- **Workload (`OVERTIME_WORKLOAD`), past 65 in Overtime only:**
  - Every 20 s window checks three signs: health never below 70%, room at or below 35% full, moving at or below 70 px/s. 2 of 3 means coasting.
  - Two coasting windows raise it 1 level, up to 5. It drops at once below 50% health.
  - Per level: spawn delay down to 0.68x, up to +2 pack, +8% enemy HP, +0.5 hit damage (cap +3), more elites. The crowd cap only grows on desktop.
  - Shown as a chip with 5 pips and a 3 s warning before each rise, plus "overtime pay" of +6% score and +4% coins per level.
- **Stats:** new run-row fields (workload max, beats done, post-65 kills/s, damage/min, min health, movement, Watch arrival and kill), plus targets for clear rate, beat completion, quiet gaps and phone frame rate.
- Pending: Rami's calls on Workload opt-in, hit damage per level, HOA reuse, grandkid art and overtime pay. Then build and playtest an Overtime run to 80.

## Nov 10, 2026: Maple Hollow v2 play spec + office boss for 60 (Grok)

Read `origin/main` at `7e14cc6` (V. 2.24.4, build 326). Spec only, no code changed. Full doc: `docs/handoffs/grok-maple-v2-reply.md`; it answers Claude's brief `grok-maple-v2-and-office-boss.md`.

**Maple v2 play:**
- **Street spawns:** left 35 / right 35 / top 15 / bottom 15. Top and bottom snap to sidewalks and aprons only, never closer than 260 px. Mowers drive along the street.
- **Parked cars:** 1 to 2 per plate, 104x56, never blocking a driveway.
- **Side paths (64 px):** one open end always (no spawns behind you within 96 px of a path). Cap 6 per path and 4 per gate, elites count 2. Path cells cost 2.0x, so the swarm prefers the street.
- **Backyards:** the escape loop (about 1,250 px). 80% of spawns come in through the paths; the row cap is 40% of on-screen.
- **Upstairs:** walkers within 220 px follow after 1.2 s, max 6, with a 6 s leash. Bosses follow after 2.5 s, with a 1.0 s creak marker. Floor 2 spawns only via the stairs at 50% rate, cap 12, back to 100% after 20 s of hiding. Floor 1 spawns only via doors (entry 40, back 40, garage 20), cap 18.
- **Yards:** trampoline (1.2 s airborne, 20 s), tomatoes (+3, 60 s), grill (+20% damage for 15 s, 45 s), tall grass (enemies 0.6x), koi coins plus a sprinkler (3 coins, 60 s), candy bowl (8 gems, 75 s), patio fire pit (+1 per 3 s, max 6, 60 s).
- **Desk:** "Push to Production": sit 1 s for 15% faster weapons for 20 s, cooldown 90 s, and +1 level on the first visit. Not a safe spot.

**Office 60 boss: The Quarterly All-Hands, replacing the V8 in the office** (the V8 keeps its garage burst at home):
- **Slides:** Bar Chart (4 bars, 72x300, 950/750 floor), Pie Chart (12 slices, 4 live, 240 px, 950/750), Line Graph ("Up and to the Right", 28 px line, 800/550).
- **Phase 2 at 50% HP:** Q&A spotlights (2, radius 64, 150 px/s, 800 ms dwell = 2 damage).
- **Numbers:** hp 170 (4.72x the Review, below the V8's 200), speed 54, tier 5 chest plus a Desk Salad.
- **Swarm:** strong thinning that pauses Group Chat, Math and Invites.
- **Achievement:** "Could Have Been An Email," which also unlocks Sprint.
- **Alternate:** the IT Migration, kept for later.
