# Difficulty curve check (Grok) - Nov 3, 2026

Answers Rami's post-healing play-stats question. Spec only. No gameplay code in this step.
Repo at write time: **V. 1.70.1** (build 165, "The Cold War Cowboy"), commit `6b8b43d`.

Tone: funny, warm, never mean. Every proposed knob lives in `src/data/*.js` (or a tiny VIEW move into data). Prefer small reversible moves. Heal numbers stay put.

### Contents

0. Verified facts + data critique
1. Answers to the five questions
2. Proposed changes (5)
3. Telemetry to start measuring
4. Watch list after ship
5. Acceptance notes

---

## 0. Verified facts + data critique

### Group Chat (matches the brief)

In `src/data/enemies.js` -> `ENEMIES.groupChat`:

| Key | Value |
| --- | --- |
| speed | 80 |
| hp | 4 |
| damage | 1 |
| keepDistance | 260 |
| fireEveryMs | 2600 |
| typingMs | 650 |
| pingSpeed | 210 |
| pingLifeMs | 3200 |

Behavior in `main.js`: hangs back / circles at `keepDistance`, shows `typing...` for `typingMs`, then fires a ping. Overlap with player calls `hurtPlayer` with `kind: "groupChat"`. Ping damage is the chat's base damage; `hurtPlayer` still adds `INTENSITY.hitDamageByAge` and Tax Bracket `hitDamageAdd`.

### Debut timing (the important bit)

`SPAWNING.waves` in `enemies.js`: **Group Chat and Math Homework first appear at `minAge: 60`**, same beat as **Midlife Crisis V8** (`ENEMIES.midlifeCrisis.spawnAge: 60`). Age 50 mix has neither. So the first time most players meet ranged pings is during the V8 decade boss. That is a stack, not a ramp.

### Other live numbers that matter

| Thing | Where | Value |
| --- | --- | --- |
| Midlife clock | `RUN_MODES.midlife` | 40 to 65, 45 s/year (~19 min) |
| Early wave | `SPAWNING.waves` age 40 | Bills only, `everyMs: 1150` |
| Bill HP | `ENEMIES.bill.hp` | **3** (comment: was 2 until Nov 2) |
| Contact damage steps | `INTENSITY.hitDamageByAge` | +0 at 40, +1 at 48, +2 at 55, +3 at 62 |
| V8 body | `ENEMIES.midlifeCrisis` | speed 118, hp 200, damage 3 |
| V8 attack | `BOSS_ATTACKS.midlifeCrisis` | telegraph 650, cooldown 4800, skidDamage 1, body damage 3 |
| Healing | `HEALING.milestones` | 18% / 25% / 22% fracs (shipped) |
| Salad | `INTENSITY.elites` | saladChance 0.45, pity 3 |
| Interns / Lounge | `INTERNS` | enabled; Lounge in `breakroom` |
| 9-to-5er | `CHARACTERS.officeWorker` | no stat mods; Coffee Splash only |
| Grad Student | `CHARACTERS.gradStudent` | Word No + 1.5x magnet + 0.9 cooldown |
| Phone zoom | `VIEW` in `main.js` | `targetShortSide: 640`, **`Math.max(1, z)` so phones never zoom out below 1x** |
| Telemetry now | `src/telemetry.js` | outcome, killer, ages, duration, level, kills, close_calls, hits_taken, damage_taken, tax_bracket, device (coarse pointer), form/os/browser/screen_size, avg_fps, slow_frame_pct, character, version; GoatCounter milestones 45/50/55/60/65 |

### Critique of the table reading

1. **Healing helped.** Agree on direction. Median age 43.3 to 48.4 and minutes 4.0 to 8.8 is a real lift. Caveat: HP/damage were rescaled between eras, so this is not a clean A/B. Still: people are dying later and playing longer. Keep healing; do not use this pass to nerf cake/salad/interns.

2. **Wall at 60 to 61 is real, and it is a spike.** 11 of 23 deaths sit at 60 or 61 (~48%). That is a cliff, not a gentle final exam. Code agrees: V8 + Group Chat + Math Homework all unlock together at 60.

3. **Group Chat avg killer age 63.4 is not a mid-60s story.** Killer ages are last-hit. Nine GC kills with eight deaths at 61 and one overtime at 81: `(8*61 + 81) / 9 ~= 63.2`. Matches 63.4. So GC is the credit-taker at the wall (and once in Delayed Retirement), not proof of a separate GC plague at 63. V8 only has **1** attributed kill; during the boss fight a ping often lands the finishing blow. Treat this as **overlap + first-time ranged**, not "GC is overtuned in a vacuum."

4. **Opening rough for 9-to-5er and phones: plausible, confounded.** Grad Student brings a shockwave and a huge magnet; 9-to-5er does not. Veterans who clear Tax 5 likely pick Grad on desktop. Phone vs desktop (~10 year gap) lines up with: smaller FOV (phones stuck at 1x zoom see ~390 world px on the short side vs ~640 design target), thumb occlusion, and ranged pings that telegraph off the edge of a tight view. Do not "buff Grad" or "nerf Tax 5." Soften the shared early drip a hair and fix phone view / ping readability.

5. **Small sample and selection effects: agree.** 32 runs / 12 players. Tax 5 avg age 51.9 > Tax 0 avg 45.8 is almost certainly who opts in (veterans), not "harder is easier." Quits (8) pull the overall median down; among deaths alone the median age is **60** (the wall). Only **1/32** reached 65 (~3%). The single age-81 outlier inflates average age more than median.

**Mismatch notes vs the prompt:** Group Chat numbers match. Killer label "Office Gossip" is kind `officeGossip` (display name "Reply-All Chain"). "Reached 65: 1" with avg age 51.8 is consistent once overtime and the wall are in the mix. After-healing death histogram sums to 23. No conflict with stated GC stats.

---

## 1. Answers to the five questions

### 1) Is 60 to 61 a spike to smooth or a fair final exam?

**Spike to smooth.** A final exam is fine; three firsts on the same birthday is not. **Smooth the overlap first:** soft-introduce Group Chat before 60, and cut its weight when V8 lands. Do not gut V8. Do not delete GC. Teach pings on a quiet-ish street, then give them the sports car.

### 2) Ages 40 to 45: smallest change for new 9-to-5ers past 45

Slow the **age-40 Bills-only drip** (`everyMs` 1150 to 1400). Keeps Bill at 3 HP so the tutorial still has teeth; just gives Coffee Splash a beat to breathe. Boring would be free heals or deleting Spam/Donut at 42. Watch: share of `officeWorker` + Tax 0 runs with `age_reached >= 45`.

### 3) Phone vs desktop

Plausible stack: (a) FOV: `viewZoomFor` never goes below 1x, so a ~390 px phone short side shows far less office than a laptop; GC at 260 px keep-away sits near the fog of war. (b) Touch: floating stick + thumb covers the lower third where pings approach. (c) FPS: you already record `avg_fps` / `slow_frame_pct`. (d) Ranged telegraph harder to read on a small view. Start measuring the fields in section 3; ship a min-zoom-out so phones can see closer to ~640 world px, plus a slightly longer typing warning.

### 4) Healing: about right or hiding a problem?

**About right.** It moved the cemetery from the parking lot to the V8 lot. That is the job. Nerfing cake/salad now would hide the 60 stack again under early quits. Leave `HEALING` / salad / interns alone this pass.

### 5) Healthy target curve (~19 min Midlife)

For a Vampire Survivors-shaped run where retirement is a badge, not homework:

| Milestone | Tax 0 + new-ish (mostly 9-to-5er, low meta) | Overall (mixed bracket / hero / veterans) |
| --- | ---: | ---: |
| Reach **50** | **55 to 65%** of runs | **70 to 80%** |
| Reach **55** | **30 to 40%** | **45 to 55%** |
| Reach **65** (clear) | **8 to 12%** | **15 to 20%** |

Today after healing: clear rate ~3% (1/32), and nearly half of deaths slam 60 to 61. Aim to spread those deaths across 55 to 64 and lift clears into the bands above without making Tax 0 a sightseeing tour.

---

## 2. Proposed changes (5, small, reversible)

Do these in order. Stop after 1 to 2 if the next 30-run slice already looks healthy.

### Change A - Soft-intro Group Chat; thin it at the V8 beat

**File:** `src/data/enemies.js` -> `SPAWNING.waves`

| Wave | Current mix bit | Proposed |
| --- | --- | --- |
| `minAge: 50` | no `groupChat` | add `["groupChat", 1]` (keep other weights) |
| `minAge: 60` | `["groupChat", 2]` | `["groupChat", 1]` |

Why: players learn `typing...` to ping for ~5 years of Midlife clock before the sports car. At 60 they meet V8 with half the chat density. Math Homework stays at 60 (one new melee pattern is enough beside the boss).

Watch: GC killer share at ages 60 to 62 down; deaths at 61 down; a few GC deaths appearing in the 55 to 59 band (proof of soft intro).

### Change B - Give V8 one polite breath before the first burnout

**File:** `src/data/bosses.js` -> `BOSS_ATTACKS.midlifeCrisis`

| Key | Current | Proposed |
| --- | --- | --- |
| `firstAttackDelayMs` | 1400 | **2200** |
| `telegraphMs` | 650 | **750** (still above `BOSS_ATTACK_TUNING.minTelegraphMs` 550) |

Why: same spawn age, slightly more read time when the room is already learning pings. Does not move `spawnAge`.

Watch: V8 attributed kills may rise slightly (fairer last-hit); GC kills at 60 to 61 fall; clear rate ticks up.

### Change C - Gentler first 90 seconds for new 9-to-5ers

**File:** `src/data/enemies.js` -> `SPAWNING.waves` age-40 row

| Key | Current | Proposed |
| --- | --- | --- |
| `everyMs` (minAge 40) | 1150 | **1400** |

Leave `ENEMIES.bill.hp` at 3. Leave age 42 mix alone (Spam + Donut still arrive).

Why: smallest shared lever that helps phones and 9-to-5ers without a hero-specific patch.

Watch: fewer deaths at 40 to 43 for `character = officeWorker`; median age for Tax 0 up a couple years; level at death not stuck at 3 to 4.

### Change D - Phone FOV: allow zoom-out below 1x

**File:** move `VIEW` from `main.js` into `src/data/player.js` (or a tiny `src/data/view.js`) and read it from `viewZoomFor`.

| Key | Current | Proposed |
| --- | --- | --- |
| `targetShortSide` | 640 | 640 (unchanged) |
| `maxZoom` | 4 | 4 |
| `minZoom` | hard-coded **1** via `Math.max(1, z)` | **0.75** |

`viewZoomFor`: `return Math.max(VIEW.minZoom, Math.min(VIEW.maxZoom, z))`.

Why: a 390 px short side at 0.75 zoom shows ~520 world px (closer to the 640 target) so a 260 px keep-away chat and its typing tag stay on screen. Desktop 720p+ stays at or above 1x.

Watch: phone `age_reached` gap vs desktop shrinks; no flood of "everything is tiny" feedback (if so, raise minZoom to 0.85).

### Change E - Ping readability (helps phones most, everyone a little)

**File:** `src/data/enemies.js` -> `ENEMIES.groupChat`

| Key | Current | Proposed |
| --- | --- | --- |
| `typingMs` | 650 | **850** |
| `pingSpeed` | 210 | **190** |

Why: longer "typing..." and a slightly slower ping are the VS-friendly telegraph. Stacks with soft intro. Damage, HP, keepDistance unchanged.

Watch: GC kills per run down modestly; time-to-first-GC-hit up; phone deaths to GC down more than desktop.

### Explicit non-changes

- No edits to `HEALING`, salad chances, intern cadence, Lounge prices.
- No Tax Bracket retune.
- No Bill HP revert, no hero stat rewrite, no V8 HP cut, no moving `spawnAge` off 60 this pass.
- No spawn-cap or `hitDamageByAge` edits yet (damage step at 62 is after the observed 61 cliff).

---

## 3. Telemetry to start measuring

Already good: killer, character, tax_bracket, device/form, avg_fps, slow_frame_pct, hits_taken, damage_taken, milestones via GoatCounter.

**Add to the Supabase `runs` row** (and document in `docs/sql/` when columns land):

| Field | Type | Why |
| --- | --- | --- |
| `view_zoom` | float | Zoom at run end (or median over run) |
| `view_short_px` | int | `min(canvas_w, canvas_h)` |
| `touch_mode` | text | `floating` / `fixedLeft` / ... from controls |
| `boss_alive_at_death` | text/null | Boss kind if a decade boss was live on death (separates V8-room GC last-hits) |
| `killer_kind` | text | Stable id (`groupChat`) alongside display name |
| `age_at_first_group_chat` | float/null | When the first GC spawned this run |
| `pings_hit` | int | Times a ping damaged the player |
| `meta_shop_ranks` | int | Sum of 401(k) ranks (veteran vs new) |
| `reached_45` ... `reached_65` | bool | Mirror GoatCounter in the row for easy SQL |

Optional later: `hp_frac_avg_by_decade` is heavy; skip until the wall moves.

---

## 4. Watch list after ship (next ~40 Midlife runs)

1. Deaths at 60 to 61 as a share of all deaths: target **under ~25%** (was ~48%).
2. Clear rate (reached 65): toward **~10%+** overall, without Tax 0 sightseeing.
3. GC as killer still OK as a late threat; should not dominate 60 to 61 alone while `boss_alive_at_death = midlifeCrisis`.
4. `officeWorker` Tax 0: median `age_reached` up; fewer sub-45 deaths.
5. Phone vs desktop median gap: shrink from ~10 years toward ~3 to 5.
6. Healing pickups still feel good; if average HP after 60 is always high and clears explode past 25%, then (and only then) touch salad/milestone knobs.

---

## 5. Acceptance notes (Codex / Claude)

1. Wave edits only in `SPAWNING.waves`; GC soft intro weight 1 at 50; weight 1 at 60.
2. `BOSS_ATTACKS.midlifeCrisis` first delay 2200, telegraph 750; `spawnAge` still 60.
3. Age-40 `everyMs` 1400.
4. `VIEW.minZoom` 0.75 wired through `viewZoomFor`; phones can zoom out.
5. `typingMs` 850, `pingSpeed` 190.
6. No healing/Tax/Bill-HP/hero changes.
7. Telemetry columns can land in a follow-up if SQL is blocked; gameplay tweaks should not wait on every field.
8. Playtest on a real phone short side (~390) and a desktop; confirm typing tag visible at keep-away.

Pending after Rami approval, implementation, and a fresh stats slice: mark the grok-changes entry **[done]** with version.
