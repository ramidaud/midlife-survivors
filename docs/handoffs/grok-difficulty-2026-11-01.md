# Midlife Survivors — Difficulty Handoff for Claude

**For:** Claude (implementation assistant) working in `ramidaud/midlife-survivors`  
**From:** Grok difficulty review (read-only analysis of V. **1.24.0**, commit `431a966`)  
**Date:** 2026-11-01 (America/New_York)  
**Do not apply a blind patch from this doc.** Treat every item as an implementation task. Re-find symbols by **name** first; line numbers below are accurate as of `431a966` and will drift.

---

## Context (read this first)

**Game:** Midlife Survivors — Phaser 3 Vampire Survivors-style browser game. Numbers and content are **data-driven** under `src/data/*`; runtime glue is mostly `src/main.js`, `src/ui.js`, `src/weapons_extra.js`. Official playtest: https://ramidaud.github.io/midlife-survivors/

**Problem:** After the V.1.24.0 difficulty pass, the run length (~19 min Midlife) feels right, but combat is **still too easy**. Skilled players can stand still through early/mid game; bosses melt in ~5–9s; sustain (heals, i-frames, HP cards) outpaces contact damage until ~age 52. Design intent (see `docs/GAME_DESIGN.md`, Oct 31): *a first run should die well before 20 minutes; permanent 401(k) upgrades are how you beat the clock over many runs.*

**Goal:** Players feel **challenged but want to come back** — tension in mid/late Midlife, bosses that are real fights, opt-in heat for veterans — without punishing the first ~90 seconds of onboarding.

### Hard constraints

1. **Keep the first ~90s gentle.** Do **NOT** change:
   - `SPAWNING.waves` age-40 `everyMs: **1150**` in `src/data/enemies.js` (search `gentle first minutes`)
   - Tax Season swarm `minAge: **43**` in `src/data/swarms.js` (`SWARM_EVENTS` id `"taxSeason"`)
2. Prefer **small, focused, data-driven** edits in `src/data/*`. Put formulas in one place when adding new systems (e.g. new `src/data/heat.js` or knobs on `window.INTENSITY`).
3. **Do not break save format.** Career save key `midlife_survivors_save_v1` / `SAVE_KEY` in `src/data/meta.js`. New fields must be optional with defaults in `loadMeta()` so old localStorage keeps working. Do not rename existing rank ids.
4. **Version bump after a playable step** (repo convention in `CLAUDE.md` + `src/data/version.js` header):
   - Bump `GAME_VERSION.version`, `displayVersion`, `lastUpdated`, `build`, prepend a `changelog` entry in `src/data/version.js`
   - Bump `window.BUILD` in `src/loader.js` (currently **48**) so caches refresh
   - New data files must be added to `window.GAME_FILES` in `src/loader.js` (not `index.html`)
   - Short notes in `docs/PROGRESS_LOG.md` / `docs/ROADMAP.md` per standing docs rules
5. **Suggested order:** **Part 2 (bugs) → Part 1 (tuning) → playtest → Part 3 one system at a time.**

---

## Suggested implementation order

1. Part 2 bug fixes (correct behavior before retuning)
2. Part 1 quick tuning + version bump (e.g. **V.1.25.0**)
3. Rami playtests Midlife fresh + with light meta
4. Part 3A Tax Bracket → playtest
5. Part 3B dynamic intensity → playtest
6. Part 3C near-miss → playtest
7. Part 3D age-50+ run modifiers → playtest

---

# Part 1 — Quick tuning changes

Each task: **file**, **anchor** (search string / symbol), **current → new**, **why**.

### 1.1 Enemy HP vs player level

- **File:** `src/data/swarms.js`
- **Anchor:** `window.INTENSITY` → `hpPerLevel`
- **Current:** `0.07`
- **New:** `0.10`
- **Why:** Weapons clear packs in ~1–2s; enemies need to thicken faster as the player levels.

### 1.2 Boss HP vs player level

- **File:** `src/data/swarms.js`
- **Anchor:** `bossHpPerLevel`
- **Current:** `0.15`
- **New:** `0.28`
- **Why:** Boss TTK is ~5–9s; need ~18–25s threat windows.

### 1.3 Boss HP also scales with age (code change)

- **File:** `src/main.js`
- **Anchor:** function `spawnBoss` — line that sets `boss.hp` (currently ~1531):
  ```js
  boss.hp = isEnd ? P.hp : Math.round(P.hp * (1 + Math.max(0, level - 1) * ((window.INTENSITY && window.INTENSITY.bossHpPerLevel) || 0)));
  ```
- **New behavior (non-end bosses only):**
  ```js
  const lvlMult = 1 + Math.max(0, level - 1) * ((window.INTENSITY && window.INTENSITY.bossHpPerLevel) || 0);
  const ageMult = 1 + Math.max(0, currentAge - 40) * ((window.INTENSITY && window.INTENSITY.bossHpPerYear) || 0.10);
  boss.hp = isEnd ? P.hp : Math.round(P.hp * lvlMult * ageMult);
  ```
- **Also add** to `window.INTENSITY` in `src/data/swarms.js`:
  - `bossHpPerYear: 0.10` // +10% boss HP per year past 40
- **Why:** Level-only scaling loses to DPS growth; age keeps Midlife Crisis threatening even on strong builds.
- **Keep** end bosses (`theReaper` / mode end party) on their special path (`isEnd ? P.hp`).

### 1.4 Pack size vs level

- **File:** `src/data/swarms.js`
- **Anchor:** `packPerLevel`
- **Current:** `0.2`
- **New:** `0.35`
- **Why:** Slightly denser groups as you power up (used in `spawnBill` via `I.packPerLevel`).

### 1.5 Spawn rate vs level

- **File:** `src/data/swarms.js`
- **Anchor:** `spawnFasterPerLevel`
- **Current:** `0.02`
- **New:** `0.028`
- **Why:** Applied in the wave delay blend (`lvlSpeed` near spawn timer reset). Still floored at 0.45 of base delay in code — leave that floor alone.

### 1.6 Contact damage by age (earlier mid-ramp)

- **File:** `src/data/swarms.js`
- **Anchor:** `hitDamageByAge`
- **Current:** `[[40, 0], [52, 1], [60, 2]]`
- **New:** `[[40, 0], [48, 1], [55, 2], [62, 3]]`
- **Why:** Hit stays 1 until age 52 (~8+ Midlife minutes). Start +1 around age 48 (~6 min) so standing still stops working sooner. **Do not** add damage at age 40 (onboarding).

### 1.7 Shorter hurt i-frames

- **File:** `src/data/player.js`
- **Anchor:** `window.PLAYER` → `hurtCooldownMs`
- **Current:** `750`
- **New:** `550`
- **Used by:** `hurtPlayer` in `src/main.js` (`now - lastHurt < PLAYER.hurtCooldownMs`)
- **Why:** 750ms + hit 1 ⇒ ~9s facetank on 12 HP. 550ms tightens without making hits unreadable.

### 1.8 Boss base HP

- **File:** `src/data/enemies.js`
- **Anchors:** `ENEMIES.performanceReview.hp`, `mortgageRefinance.hp`, `midlifeCrisis.hp`

| Boss id | spawnAge | Current hp | New hp |
|---|---|---|---|
| `performanceReview` | 45 | **30** | **45** |
| `mortgageRefinance` | 52 | **70** | **110** |
| `midlifeCrisis` | 60 | **130** | **200** |

- Leave Full Life bosses (`hoaPresident`, `retirementBoss`, `pickleballChamp`, `theReaper`) for a later pass unless you mirror the same % bump.

### 1.9 Level-up heal

- **File:** `src/main.js`
- **Anchor:** in `collectGem`, comment `leveling up restores +2 HP!`
  ```js
  hp = Math.min(stats.maxHp, hp + 2);
  ```
- **Current:** `+ 2`
- **New:** `+ 1`
- **Why:** Uncapped heal-on-level is a major sustain leak (~36 HP over a typical Midlife run).

### 1.10 HR Appreciation Snacks max rank

- **File:** `src/data/upgrades.js`
- **Anchor:** id `"hrSnack"` / name `"HR Appreciation Snacks"`
- **Current:** `maxRank: 8` (also `s.maxHp += 2; s.heal = 2`)
- **New:** `maxRank: 3`
- **Why:** Eight snacks = +16 max HP filler. Cap like other sustain cards. Optional follow-up: `s.heal = 1` (not required for first pass).

### 1.11 Pizza heal (world pickup)

- **File:** `src/data/pickups.js`
- **Anchor:** `PICKUPS.pizza.heal`
- **Current:** `3`
- **New:** `2`
- **Consumed by:** plant smash → pizza collect path in `src/main.js` (`PICKUPS.pizza.heal`).

### 1.12 Leftover Friday Pizza card heal

- **File:** `src/data/upgrades.js`
- **Anchor:** id `"leftoverFriday"`
- **Current:** `s.heal = 5`
- **New:** `s.heal = 3`
- **Why:** Matches weaker world pizza; card still vacuums gems/coins via `itemEffect("fannyPack")`.

### 1.13 Decade-start free perk counts

- **File:** `src/data/meta.js`
- **Anchor:** `window.DECADE_CHECKPOINTS` → `bonusLevels`

| age | Current bonusLevels | New |
|---|---|---|
| 40 | 0 | 0 (unchanged) |
| 50 | **2** | **1** |
| 60 | **4** | **2** |
| 70 | **6** | **3** |
| 80 | **8** | **4** |

- **Applied in:** `beginFreshRunAtDecade` in `src/main.js` (loop over `cp.bonusLevels`).
- **Why:** Free perks skip early vulnerability on return runs / Full Life starts.

### 1.14 Healthy Boundaries — heal every other pulse

- **File:** `src/main.js`
- **Anchor:** function `fireWordNo` — block:
  ```js
  if (stats.healthyBoundaries && hp < stats.maxHp) { hp = Math.min(stats.maxHp, hp + 1); drawHpBar(); }
  ```
  (shout text still uses `"NO! (+1 HP)"` when evolved)
- **New behavior:**
  - On evolve / when setting `healthyBoundaries = true`, init `stats.boundariesPulse = 0` (also in run reset where other evo flags clear, ~`stats.healthyBoundaries = false`).
  - Each `fireWordNo` while evolved: `stats.boundariesPulse = (stats.boundariesPulse || 0) + 1`; heal **only when** `stats.boundariesPulse % 2 === 0`.
  - Update shout text so it only shows `+1 HP` on heal pulses (avoid lying UI).
- **Evolve definition stays in** `src/data/upgrades.js` id path that sets `s.healthyBoundaries = true` (Healthy Boundaries evo). Keep knockback/damage fantasy; only nerf the heal rate (~0.4 HP/s → ~0.2 HP/s at default `WEAPONS.wordNo.fireEveryMs` 3200).

### 1.15 After Part 1 — version

Bump to something like **V.1.25.0** / codename e.g. `"Tax Season Prep"`, `BUILD` 49+, changelog bullets summarizing the tuning. Update docs briefly.

---

# Part 2 — Bug fixes (do these before or with Part 1)

### 2.1 Boss HP label shows base HP, not scaled HP

- **File:** `src/main.js`
- **Anchor:** inside `spawnBoss`, tag creation (~1534):
  ```js
  boss.tag = scene.add.text(..., `${label}:${P.hp}`, ...);
  ```
- **Fix:** use scaled `boss.hp` after it is assigned:
  ```js
  `${label}:${boss.hp}`
  ```
- Note: `damageBill` already refreshes boss tags with `bill.hp` (~1142). Only spawn text is wrong.

### 2.2 Double hit-damage path at age 60+

Two independent bonuses stack on contact:

1. **`createEnemy`** (~1415):  
   `e.damage = E.damage + (currentAge >= 80 ? 2 : (currentAge >= 60 ? 1 : 0));`
2. **`hurtPlayer`** (~1036):  
   `hp -= (bill.damage || ...) + Math.round(ageCurve(...hitDamageByAge...) || 0);`

At age 60 with `hitDamageByAge` +2 and createEnemy +1, a 1-damage Bill deals **4**.

- **Fix (pick one source of truth):** Prefer **only** `INTENSITY.hitDamageByAge` in `hurtPlayer`.
  - In `createEnemy`, set `e.damage = E.damage` (remove the age ≥60/80 bump).
  - Bosses already set `boss.damage = P.damage` with no createEnemy bump — keep them consistent via `hitDamageByAge` only.
- After Part 1’s new `hitDamageByAge` curve, re-check age 60 total hit feels intentional (base + curve value only).

### 2.3 “All weapons” damage perks miss Remote / Spreadsheet / Podcast

**A. Meta shop — Roth IRA & Pension**

- **File:** `src/main.js`
- **Anchor:** `applyMetaAndChar` (or equivalent) — `rPen = meta.ranks.pensionPlan`:
  ```js
  stats.damage += rPen;
  stats.jokeDamage += rPen;
  stats.noDamage += rPen;
  ```
- **Shop copy** in `src/data/meta.js` id `"pensionPlan"`: `"+1 starting damage to all weapons"`.
- **Fix:** also apply:
  ```js
  stats.remoteDamage += rPen;
  stats.sheetDamage += rPen;
  stats.podDamage += rPen;
  ```
  (`stats.remoteDamage` / `sheetDamage` / `podDamage` are initialized from `WEAPONS.*` when stats are built.)

**B. Run perk — Executive Delegation**

- **File:** `src/data/upgrades.js`
- **Anchor:** id `"execDelegation"`, name `"Executive Delegation"`
- **Text claims:** `"ALL weapons deal +1 damage..."`
- **Current apply:**  
  `s.damage += 1; s.jokeDamage += 1; s.noDamage += 1; s.cooldownMult *= 0.90;`
- **Fix apply to also:**  
  `s.remoteDamage += 1; s.sheetDamage += 1; s.podDamage += 1;`  
  (`cooldownMult` already speeds Remote/Podcast timers that multiply by `cd` in `weapons_extra.js` — leave that.)

### 2.4 Podcast pierce off-by-one

- **File:** `src/weapons_extra.js`
- **Anchor:** podcast update loop — uses `stats.podPierce` (base from `WEAPONS.podcast.pierce` **3**, meaning “how many enemies one wave passes through” per `src/data/weapons.js` comment).
- **Current logic:**
  ```js
  if (w.hits > stats.podPierce || !b.active || b.ghost) return;
  // ...
  damageBill(b, stats.podDamage); w.hits++;
  // ...
  if (w.life <= 0 || w.hits > stats.podPierce) { w.destroy(); return false; }
  ```
  With `pierce = 3`, the wave can hit **4** enemies (hits 1..4) before `hits > 3`.
- **Fix:** treat pierce as max hits allowed, e.g. before damaging:
  ```js
  if (w.hits >= stats.podPierce || !b.active || b.ghost) return;
  ```
  and destroy when `w.hits >= stats.podPierce` after increment (or `>=` in the filter). Result: pierce 3 ⇒ exactly 3 enemies. Re-test Binge Mode (`podPierce *= 2` on evolve).

### 2.5 Holding movement keys steers the level-up menu

**Symptom:** WASD / arrows (and gamepad d-pad hold) keep moving the perk cursor because:

- Keyboard: `window.addEventListener("keydown", ...)` routes Arrow/WASD to `menuNav.move` whenever `menuNav.getActiveModal()` is set — **browser key-repeat** fires while held (`src/main.js` modal keydown branch).
- Gamepad: `getPadMenuStep` **auto-repeats** after 280ms / every 165ms while held (~lines 100–128), and `update` calls it whenever any modal is active (~1564).

**Fix (recommended):**

1. At start of `showLevelUp` (`src/main.js`):
   - Set `window.menuInputGateUntil = performance.now() + 200` (or 250).
   - Reset `padHoldDir = null` (and optionally `padNextRepeatMs`).
   - Clear or snapshot `window._heldKeys` so currently held move keys don’t count until released and pressed again.
2. In the modal keyboard branch and in `getPadMenuStep` / the `update` menu block: **ignore** navigation if `performance.now() < window.menuInputGateUntil`.
3. Stronger variant: ignore move-nav until the specific key/`pad` direction has seen a **keyup / padJust edge** after the menu opened (fresh press only). Prefer this if 200ms gate still feels wrong with sticky keys.

Do not block number keys `1`/`2`/`3` perk shortcuts longer than the same short gate.

---

# Part 3 — New systems (after Part 1 playtest)

Implement **one at a time**. Prefer new data modules + thin hooks in `main.js` / `ui.js`.

## 3A. Opt-in Tax Bracket (Heat)

Vampire Survivors Curse / Hades Heat style. **Default off.**

### Data shape (suggested new file `src/data/heat.js`, add to `GAME_FILES` before `meta.js`)

```js
window.TAX_BRACKET = {
  maxLevel: 5,
  // Per bracket level, additive stacking from 0 → N
  perLevel: {
    enemyHpMult: 0.12,      // +12% enemy + boss HP per level
    packAdd: 0.25,          // +0.25 pack size per level (round at spawn)
    spawnFaster: 0.03,      // extra multiply into lvlSpeed reduction per level
    hitDamageAdd: 0.5,      // +0.5 contact damage per level (round at hurt)
    healEfficacy: 0.10,     // heals restore 10% less per level (floor at 40% efficacy)
    coinMult: 0.20,         // +20% coins banked per level
    xpMult: 0.10            // +10% gem XP per level
  },
  labels: [
    "W-2", "Itemizing", "Audit Letter", "Underpayment Penalty", "Full Audit"
  ]
};
```

### Save

- In career meta (`loadMeta` defaults): `taxBracket: 0` (0–5).
- **Do not** require a new localStorage key; extend `midlife_survivors_save_v1` JSON with optional `taxBracket`.
- Optional: persist selected bracket into active run snapshot so Resume can’t change mid-run; lock bracket at run start into `runTaxBracket`.

### Combat hooks

- Where enemy HP is scaled (`createEnemy` `hpScale`): multiply by `(1 + bracket * perLevel.enemyHpMult)`.
- Where `boss.hp` is set (`spawnBoss`): same mult (stack with level/age mults).
- `spawnBill` pack size: add `Math.floor(bracket * perLevel.packAdd)` (or round).
- Spawn delay `lvlSpeed`: fold in `bracket * perLevel.spawnFaster` (keep existing 0.45 floor).
- `hurtPlayer`: add `Math.round(bracket * perLevel.hitDamageAdd)` after age curve (or bake into one helper).
- All heal sites (`collectGem` level heal, `stats.heal` apply, pizza, Boundaries): multiply heal by `Math.max(0.4, 1 - bracket * healEfficacy)`.
- Coins: multiply with existing `stats.coinMult` / `bankMult` path in coin collect.
- XP: multiply with existing `stats.xpMult` (Continuing Ed) in `collectGem`.

### UI

- Title / mode row in `renderTitleModal` (`src/ui.js`): control **TAX BRACKET** next to Midlife/Full Life — cycle 0..5 or −/＋ buttons. Show label + short blurb (“Harder enemies, better 401(k) match”).
- HUD optional: small `TAX×N` while bracket > 0.
- Game Over: show bracket used.

### Leaderboard

- Today: Midlife → `scores_midlife`, Full → `scores` (`src/data/modes.js` `table`).
- Options (pick one, document in GAME_DESIGN):
  1. **Simplest:** append bracket to submitted name/metadata if the Supabase row has a notes/meta column; or
  2. **Cleaner:** add `table` suffix / filter field `tax_bracket` and only compare same bracket; or
  3. Separate tables `scores_midlife_b0` … only if you already migrate SQL (`docs/LEADERBOARD_MIDLIFE.sql`).
- Recommend (2) with default bracket 0 rows behaving as today so old scores stay valid.

### Achievements (add to `src/data/achievements.js`)

Examples:

- Clear Midlife at Tax Bracket ≥ 1 / ≥ 3 / ≥ 5 (ids like `auditSurvivor`, `fullAudit`).
- Use existing `on: "clear"` + test `d.mode === "midlife" && d.taxBracket >= N` (pass bracket in clear event payload).

---

## 3B. Dynamic intensity

Lightweight catch-up so safe play gets punished and panic gets a breath.

### Knobs (on `INTENSITY` or `TAX_BRACKET` sibling)

```js
dynamic: {
  noHitBonusAfterMs: 45000,   // no damage taken for 45s
  bonusPackAdd: 2,            // one-shot denser spawn wave
  bonusDurationMs: 20000,     // pressure lingers
  mercyHpFrac: 0.25,          // below 25% max HP
  mercySpawnSlow: 1.15,       // spawn delay * 1.15 while in mercy
  mercyDurationMs: 8000
}
```

### Hooks

- Track `lastPlayerHurtAt` in `hurtPlayer` (already have `lastHurt`).
- In `spawnBill` / spawn delay: if `runElapsedMs - lastHurt > noHitBonusAfterMs`, apply temporary `bonusPackAdd` and maybe flash lower-third `"COMFORT ZONE TAX"`.
- If `hp / maxHp < mercyHpFrac`, apply `mercySpawnSlow` and cancel comfort bonus.
- Reset comfort timer on any hit.

Keep first 90s exempt: only arm dynamic system after `currentAge >= 42` or `runElapsedMs >= 90000`.

---

## 3C. Near-miss (graze) reward

### Behavior

- When an enemy passes within `player.size/2 + enemy.size/2 + grazePx` (e.g. grazePx = 10) **without** triggering `hurtPlayer`, and was closing then leaving, count a graze (cooldown ~300ms per enemy uid).
- Reward: +1 score crumb and/or +0–1 coin frac, tiny floating “CLOSE!” text, light SFX.
- Optional: brief 100ms style flash (not full i-frames).

### Why

Makes dodging feel skillful once Part 1 makes hits matter.

### Implementation note

Prefer a check in the bill chase update near collision, not a second physics collider, to avoid double-hurt bugs.

---

## 3D. Age 50+ random run modifiers

Short mid-run mutators (not full Heat).

### Data shape (e.g. `src/data/modifiers.js`)

```js
window.RUN_MODIFIERS = [
  {
    id: "doubleLateFees",
    name: "Double Late Fees",
    minAge: 50,
    weight: 2,
    durationYears: 3,   // active for ~3 age-years
    badge: "PAST DUE×2",
    text: "Overdue Bills split into twice as many Late Fees.",
    // apply via hooks, not undefined magic
  },
  {
    id: "ghostHour",
    name: "Ghost Hour",
    minAge: 50,
    weight: 2,
    durationYears: 2,
    badge: "3 AM",
    text: "More 3 AM Thoughts; ghosts linger longer.",
  },
  {
    id: "replyAllTax",
    name: "Reply-All Tax",
    minAge: 52,
    weight: 2,
    durationYears: 2,
    badge: "CC: EVERYONE",
    text: "Elite Reply-All Chains spawn more often and hit harder.",
  }
];
```

### Runtime

- At most one modifier at a time; roll when age crosses 50 / 55 / 60 (or on swarm cadence).
- Announce via existing `showLowerThird("alert", ...)`.
- Hook examples:
  - **doubleLateFees:** where Bills split into Late Fees (`createEnemy("lateFee", ...)` pair) spawn **4** instead of 2 while active.
  - **ghostHour:** bias `rollWaveKind` toward `threeAmThought`; optionally stretch `ghostMs` on those enemies.
  - **replyAllTax:** boost `officeGossip` weight in wave mix; `damage += 1` for that kind while active.

Keep modifiers **data-driven** so Rami can edit names/text without touching loop code.

---

# Part 4 — Acceptance criteria / how to verify

### Quantitative targets (Midlife mode, 45 s/year)

| Scenario | Target |
|---|---|
| Boss TTK (typical coffee + 2 weapons, 1 evo by ~55) | **~18–25s** each for Review / Mortgage / Crisis (not under ~12s, not over ~40s) |
| Fresh save, no shop ranks — median death | **~8–12 min** (age ~50–56), should **not** casually clear 65 |
| Light meta (Employer Match ~2, Espresso ~1) | **~14–18 min**; clear possible with good play |
| Deep meta | Can clear Midlife; Tax Bracket ≥3 should still threaten |
| First **90s** | Still teachable; age-40 spawn **1150ms**; no Tax Season before **43** |

### Manual checks

1. Extras → **Reset Progress** (or wipe `midlife_survivors_save_v1`) → Midlife run, try standing still at ~4 min (age ~45): should start taking real pressure after Part 1 (especially once hitDamage kicks at 48).
2. Fight Performance Review with a normal build: HP tag shows **scaled** HP; fight lasts ~20s.
3. Unlock Remote + Spreadsheet + Podcast; buy Pension rank 1; confirm their damage numbers rise (damage popups / kill speed).
4. Take Executive Delegation; confirm Remote/Sheet/Pod damage rise.
5. Podcast base pierce: wave stops after **3** kills (6 after Binge Mode if ×2).
6. Open level-up while holding W/Up: cursor must **not** scroll until a fresh press (or until gate elapses and key is repressed).
7. Old save loads: missing `taxBracket` defaults to 0; shop ranks intact.

### Bots / sims in repo

- There is **no checked-in bot or simulation script** in the tree as of `431a966`. `docs/PROGRESS_LOG.md` (2026-10-31 Difficulty pass) mentions internal bot timings (2.7 / 3.9 / 5.8 min) used for V.1.24.0 — those harnesses are **not** in `scripts/` or `src/`.
- If you add a headless harness later, put it under something like `scripts/intensity_sim.mjs` and document how to run it; do not block Part 1 on that.
- Optional: reuse the Python model from the Grok review outside the repo for spreadsheet sanity checks; in-game feel + Rami playtest are the real gate.

### Regression watchlist

- Coin economy already nerfed (`dropChance: 0.06`, `bankMult: 0.5`) — don’t re-buff while adding Tax Bracket coin mult without playtesting shop pace.
- `Second Opinion` revives and Retirement Party full heal (Full Life) remain strong; Tax Bracket heal efficacy should affect them if bracket > 0.
- Soft start: confirm Tax Season still `minAge: 43` and age-40 `everyMs: 1150`.

---

## Quick reference — current values @ `431a966`

| Symbol | File | Value @ review |
|---|---|---|
| `INTENSITY.hpPerLevel` | `src/data/swarms.js` | `0.07` |
| `INTENSITY.bossHpPerLevel` | `src/data/swarms.js` | `0.15` |
| `INTENSITY.packPerLevel` | `src/data/swarms.js` | `0.2` |
| `INTENSITY.spawnFasterPerLevel` | `src/data/swarms.js` | `0.02` |
| `INTENSITY.hitDamageByAge` | `src/data/swarms.js` | `[[40,0],[52,1],[60,2]]` |
| `PLAYER.hurtCooldownMs` | `src/data/player.js` | `750` |
| `ENEMIES.performanceReview.hp` | `src/data/enemies.js` | `30` |
| `ENEMIES.mortgageRefinance.hp` | `src/data/enemies.js` | `70` |
| `ENEMIES.midlifeCrisis.hp` | `src/data/enemies.js` | `130` |
| Level-up heal | `src/main.js` `collectGem` | `+2` |
| `hrSnack.maxRank` | `src/data/upgrades.js` | `8` |
| `PICKUPS.pizza.heal` | `src/data/pickups.js` | `3` |
| `leftoverFriday` heal | `src/data/upgrades.js` | `5` |
| Decade `bonusLevels` 50/60/70/80 | `src/data/meta.js` | `2/4/6/8` |
| Age-40 `everyMs` | `src/data/enemies.js` | `1150` (**do not change**) |
| Tax Season `minAge` | `src/data/swarms.js` | `43` (**do not change**) |
| `GAME_VERSION` / `BUILD` | `version.js` / `loader.js` | `1.24.0` / `48` |

---

## Out of scope for this handoff

- Art / Corporate Campus integration
- Changing Midlife duration (45 s/year) or end age 65
- Rebalancing Full Life bosses in detail (mirror Part 1 ratios later)
- Reworking magnet / CPA on Retainer (mention only if playtest shows vacuum trivializes positioning)

When in doubt: **data over hardcoding**, **gentle first minute**, **challenging mid-game**, **opt-in pain with opt-in rewards**.
