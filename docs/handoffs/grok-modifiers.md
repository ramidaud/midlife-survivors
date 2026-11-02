# Midlife Survivors: Age 50+ Run Modifiers (Part 3D) Handoff

**For:** Claude or Codex implementing in `ramidaud/midlife-survivors`
**From:** Grok (Part 3D of the difficulty plan)
**Date:** 2026-11-01 (America/New_York)
**Repo state when written:** V. **1.30.2** ("Groan Zone"), commit around `1c889f1`
**Parent docs:** `docs/handoffs/grok-difficulty-2026-11-01.md` §3D (short sketch), `docs/handoffs/grok-near-miss.md` (Part 3C, built in V. 1.30.0)
**Do not apply a blind patch.** Re-find symbols by **name**. Line numbers drift.

---

## Context

**Goal:** After age 50, short mid-run "life happens" mutators keep Midlife spicy without being another Tax Bracket. They should feel like affectionate midlife weather: funny, readable, temporary, and fair next to Close Calls, Comfort Zone Tax, and heat.

**Why now:** Parts 1, 2, 3A, 3B, and 3C are live. Close Calls (`src/data/nearMiss.js` + `src/near-miss.js`) reward weaving. Dad Joke now cringe-stuns and pushes (`WEAPONS.dadJoke.cringeMs` / `pushSpeed`, V. 1.30.2). Center flash banners exist (`window.flashBanner(title, sub, kind)`) for mid-fight announcements. Flow-field pathing (`src/navigation.js`) means modifiers must not invent free camping or break `NAV.steer` / `NAV.fixSpawn`.

**Hard constraints:**

1. Keep the soft start alone. Do **not** change age-40 `everyMs: 1150` or Tax Season `minAge: 43`.
2. Data-driven: new file **`src/data/modifiers.js`** exporting `window.RUN_MODIFIER_DEFS` (list) and `window.RUN_MODIFIER_TUNING` (cadence / anti-stack). Add it to `window.GAME_FILES` in `src/loader.js` near `nearMiss.js`.
3. Do **not** break save format. Modifiers are run-local only.
4. Do **not** change Tax Bracket `perLevel` numbers, Comfort Zone `INTENSITY.dynamic` numbers, or Close Call caps (`xpFromNearMissPer10s`, `xpPerCreditMax`) as part of this work. Modifiers may *multiply* those systems while active via clear hooks.
5. Prefer hooks at named sites (`rollWaveKind`, Bill overdue split, `hurtPlayer` move speed, `collectGem` / magnet, `NearMiss` band) over scattering magic numbers in loops.
6. Announce with **`flashBanner(title, sub, kind)`** plus the existing lower third (`showLowerThird`). Title: **three words max**. Kind: `"alert"` for challenges, `"reward"` for double-edged deals (green title styling already exists).
7. Respect `prefers-reduced-motion` (center flash already fades instead of popping; do not add camera shake for modifier start).
8. Version bump when playable (e.g. **V. 1.31.0**), bump `BUILD`, note ROADMAP Part 3D.

### Code facts to trust (V. 1.30.2)

| Fact | Where | Value / note |
|---|---|---|
| Midlife year length | `RUN_MODES.midlife.secondsPerYear` | **45** (use `modeCfg().secondsPerYear`, not `PLAYER.secondsPerYear` which is 60) |
| Age clock | `main.js` | `currentAge = runStartAge + (runElapsedMs/1000) / modeCfg().secondsPerYear` |
| Tax Bracket | `src/data/heat.js` | 0 to 5; `tax("xpMult")` etc. |
| Comfort Zone Tax | `INTENSITY.dynamic` + `dyn` | arms 90s; 45s no-hit -> +2 pack for 20s; hit clears `comfortUntil` |
| Close Calls | `NearMiss` | band via **physics body gap** (not `PLAYER.size` circle); caps 6 XP / 10s; `comfortCountsAsEngaged` |
| Dad Joke | `WEAPONS.dadJoke` | `radius: 130`, `fireEveryMs: 2300`, `cringeMs: 650`, `pushSpeed: 260`; bosses ignore cringe/push |
| `flashBanner` | `src/ui.js` | `flashBanner(title, sub, kind)`, ~1.9s, kinds style title color |
| `hitDamageByAge` | `INTENSITY` | `[[40,0],[48,1],[55,2],[62,3]]` extra contact damage |
| Bill -> Late Fees | overdue split in `main.js` | 2 Late Fees after `overdueAfterMs: 11000` |
| 3 AM Thought cycle | `ENEMIES.threeAmThought` | `solidMs: 1800`, `ghostMs: 1500` |
| Boss flag | `boss.isBoss = true` in `spawnBoss` | use to block rolls while any active boss lives |
| Flow field | `NAV.fixSpawn` / `steer` | keep using; never spawn inside props |

**Tone:** Warm, funny, never mean. Age jokes are about calendars, rent, glasses left upstairs, and reply-all, not bodies or health shaming. "Back Spasm Season" is the familiar "I sneezed wrong" office bit, kept light.

---

## 1. Proposed data shape (`src/data/modifiers.js`)

Illustrative schema only (do not paste as a silent patch; implement to match):

```js
// Age 50+ run modifiers (Grok Part 3D). Full spec: docs/handoffs/grok-modifiers.md
window.RUN_MODIFIER_TUNING = {
  firstEligibleAge: 50,
  rollEveryYears: 2.5,          // Midlife: 2.5 * 45s = 112.5s between roll attempts
  chancePerRoll: 0.55,
  heatChanceAddPerBracket: 0.06, // Tax Bracket adds to chance only (not to spawn soft-start)
  heatIntensityAddPerBracket: 0.05, // scales each def's intensityMult extras (see §4)
  maxActive: 1,
  maxBudget: 3,                 // sum of active budgetCost (with maxActive 1 this is mostly future-proof)
  cooldownYears: 1.5,           // after a modifier ends, wait this many age-years before rolling again
  noRollAfterHurtMs: 3000,
  noRollAfterLevelUpMs: 2500,
  pityFailsBeforeForce: 3,      // after N failed rolls in a row, next eligible roll forces a pick
  firstRollChanceBonus: 0.20,   // extra chance on the first roll of the run after age 50
  debug: false                  // or ?modDebug=1
};

window.RUN_MODIFIER_DEFS = [
  {
    id: "ghostHour",
    name: "Ghost Hour",
    minAge: 50,
    weight: 3,
    durationYears: 2.0,
    budgetCost: 2,
    bannerTitle: "GHOST HOUR",
    bannerSub: "More 3 AM Thoughts. They linger.",
    bannerKind: "alert",
    exclusiveWith: [],
    effects: {
      waveBias: { threeAmThought: 4 },
      threeAmGhostMsMult: 1.35,
      nearMissBandAdd: 2
    }
  }
  // ...remaining defs in §2
];
```

Runtime state (run-local in `main.js` or `src/modifiers.js`):

```js
mod = {
  active: null,          // def id or null
  endsAtAge: 0,
  lastEndedAtAge: -99,
  lastId: null,
  failStreak: 0,
  nextRollAtAge: 50,
  stats: { rolls: 0, hits: 0, byId: {} }
};
```

Convert duration: `durationMs = durationYears * modeCfg().secondsPerYear * 1000` **or** end when `currentAge >= startAge + durationYears` (prefer **age-based end** so pause does not desync flavor).

---

## 2. The modifiers (8)

Each effect list names the hook. Intensity extras from Tax Bracket use `intensity = 1 + runTaxBracket * heatIntensityAddPerBracket` only where noted as "scales".

### 2.1 Ghost Hour (`ghostHour`)

| Field | Value |
|---|---|
| Banner | title `GHOST HOUR` / sub `More 3 AM Thoughts. They linger.` / kind `alert` |
| minAge | 50 |
| weight | 3 |
| durationYears | 2.0 |
| budgetCost | 2 |
| Gameplay | Bias `rollWaveKind` with extra weight **+4** on `threeAmThought`. While active, those enemies use `ghostMs * 1.35` (2250 ms if base 1500). Solid window unchanged so they stay hittable on the same rhythm, just sneak longer. |
| Close Call compensation | `nearMissBandAdd: +2` px while active (still under XP caps). |
| Visual / audio | Soft indigo vignette alpha **0.12** at screen edges (skip if reduced motion: use a static corner icon only). Optional quiet whoosh once on start (`sfx` new id `modGhost` or reuse soft blip). Enemy tag color can tint toward `#9a8cff` for 3 AM only. |
| Flow field | No change. Ghosts still `NAV.steer`; ghost flag already skips hurt/near-miss. |

### 2.2 Reading Glasses (`readingGlasses`)

| Field | Value |
|---|---|
| Banner | title `READING GLASSES` / sub `Left them upstairs. Magnet feels shorter.` / kind `alert` |
| minAge | 50 |
| weight | 2 |
| durationYears | 2.0 |
| budgetCost | 1 |
| Gameplay | `stats.magnetRadius` (and live gem magnet) *= **0.70** while active (floor at 70 px). Coffee splash `stats.range` *= **0.90**. Does **not** change hitboxes or Dad Joke radius. |
| Close Call compensation | Close Call `xpBase` treated as **0.50** while active (still clamped by `xpPerCreditMax` and the 6/10s cap). |
| Visual / audio | Brief cream "blur" ring on the player for 0.3s at start (skip tween if reduced motion). No permanent screen blur (swarm readability). |
| Flow field | Safe. |

### 2.3 Rent Hike (`rentHike`)

| Field | Value |
|---|---|
| Banner | title `RENT HIKE` / sub `Bills got pricier. Pack it in.` / kind `alert` |
| minAge | 50 |
| weight | 3 |
| durationYears | 2.5 |
| budgetCost | 2 |
| Gameplay | While active: new `bill` enemies spawn with HP *= **1.25 * intensity** (round up). Wave bias `bill: +3`. Coin drops from Bills unchanged (economy already tight). |
| Close Call | none required (density creates natural weaves). |
| Visual / audio | Bill labels flash `$↑` once when the modifier starts (one banner only, no per-enemy spam). |
| Flow field | Safe. Exclusive with `doubleLateFees`. |

### 2.4 Empty Nest (`emptyNest`) (double-edged)

| Field | Value |
|---|---|
| Banner | title `EMPTY NEST` / sub `Quieter house. Hungrier hallway.` / kind `reward` |
| minAge | 52 |
| weight | 2 |
| durationYears | 2.0 |
| budgetCost | 2 |
| Gameplay | **Challenge:** `packAdd` flat **+1** to everyday packs (on top of level/tax). **Gift:** Wisdom Gem XP from `collectGem` / `addXp` path *= **1.20** (gems only, not Close Call XP). Pizza heal *= **0.75** via `healAmt` wrapper or pizza collect. |
| Close Call | `comboDecayMs` treated as **3000** while active (slightly kinder streak window). Caps unchanged. |
| Visual / audio | Warm cream banner (reward kind). Tiny empty-frame icon optional in HUD chip. |
| Flow field | Safe. |

### 2.5 Back Spasm Season (`backSpasm`)

| Field | Value |
|---|---|
| Banner | title `BACK SPASM` / sub `Everything lunges. You move a hair slower.` / kind `alert` |
| minAge | 50 |
| weight | 2 |
| durationYears | 2.0 |
| budgetCost | 2 |
| Gameplay | Wave bias `backTwinge: +4`. Player move speed *= **0.92** while active (apply next to donut slow / Energy Drink / Close Call max chain: spasm multiplies the *base* `stats.speed` before buff max, so drinks still help). Dad Joke **unchanged** (cringe still saves you; do not disable push). |
| Close Call | Speed burst still applies via `Math.max` with NearMiss (you can blip out of a lunge). |
| Visual / audio | No red vignette spam. One banner. Optional subtle posture bob disabled under reduced motion. |
| Flow field | Safe. Twinges keep existing lunge AI. |

### 2.6 Reply-All Tax (`replyAllTax`)

| Field | Value |
|---|---|
| Banner | title `REPLY-ALL TAX` / sub `CC: everyone. Chains hit harder.` / kind `alert` |
| minAge | 52 |
| weight | 2 |
| durationYears | 2.0 |
| budgetCost | 2 |
| Gameplay | Wave bias `officeGossip: +5`. While active, `officeGossip` contact uses `damage + 1` (before `hitDamageByAge`, so age curve still adds on top in `hurtPlayer`). Elite HP *= **1.15**. |
| Dad Joke | While active, `jokeRadius` *= **1.10** and `pushSpeed` *= **1.15** (compensation: groan clears a lane). Do not change `cringeMs` (already 650). |
| Close Call | none. |
| Visual / audio | Gossip tags can use a brighter cyan for the duration. |
| Flow field | Safe. Elites must still `NAV.steer` (no phasing through desks). |

### 2.7 Past Due (`doubleLateFees`)

| Field | Value |
|---|---|
| Banner | title `PAST DUE` / sub `Unpaid Bills split into four Late Fees.` / kind `alert` |
| minAge | 50 |
| weight | 3 |
| durationYears | 2.0 |
| budgetCost | 2 |
| Gameplay | Where overdue Bills spawn Late Fees (two `createEnemy("lateFee", ...)` calls), spawn **4** instead of 2 while active. Optionally shorten `overdueAfterMs` to **9000** while active (scales feel, still readable). Late Fee stats otherwise unchanged. |
| Close Call | natural. |
| Visual / audio | Banner only. Avoid four popups. |
| Flow field | Each Late Fee still goes through `createEnemy` -> `NAV.fixSpawn`. Exclusive with `rentHike`. |

### 2.8 Open Enrollment (`openEnrollment`) (double-edged)

| Field | Value |
|---|---|
| Banner | title `OPEN ENROLLMENT` / sub `Paperwork swarm. Snacks on us.` / kind `reward` |
| minAge | 55 |
| weight | 2 |
| durationYears | 1.5 |
| budgetCost | 2 |
| Gameplay | **Challenge:** spawn delay factor *= **0.90** (10% faster spawns; stack with level/tax the same way `lvlSpeed` does, floored at existing 0.45). Wave bias `calendarInvite: +2`, `bill: +1`. **Gift:** plant smash pizza heal **+1** (so base 2 becomes 3) and `ITEM_DROPS.fromPlant` *= **1.5** while active (still limited by `maxOnFloor`). |
| Close Call | none. |
| Visual / audio | Reward-kind banner. |
| Flow field | Calendar charges unchanged; still blocked by props via physics. |

---

## 3. Roll cadence and anti-stack

### 3.1 Cadence (exact)

Verified: Midlife uses **`secondsPerYear = 45`**.

| Knob | Default | Midlife wall-clock |
|---|---|---|
| `firstEligibleAge` | **50** | first roll attempt when `currentAge >= 50` |
| `rollEveryYears` | **2.5** | **112.5 s** between attempts while eligible and idle |
| `chancePerRoll` | **0.55** | base |
| + heat | `+ 0.06 * runTaxBracket` | Tax 5 -> chance **0.85** before clamps |
| Clamp chance | min **0.15**, max **0.90** | |
| `firstRollChanceBonus` | **+0.20** | only the first attempt after crossing 50 |

Age-based scheduler (preferred):

1. On run start: `nextRollAtAge = max(50, runStartAge)` (if starting a decade at 50+, allow first roll after **5 s** grace).
2. When `currentAge >= nextRollAtAge` and gates pass, roll once, then `nextRollAtAge += rollEveryYears` (even on failure).
3. While a modifier is active, **pause** scheduling (`nextRollAtAge` frozen or pushed to `endsAtAge + cooldownYears`).

Full Life uses `secondsPerYear = 60`; still schedule by **age-years** so flavor matches the calendar, not the clock.

### 3.2 Anti-stack rules (all required)

1. **`maxActive: 1`**. Never two at once in v1.
2. **Budget:** `budgetCost` of the pick must be `<= maxBudget` (3). All current defs are 1 to 2.
3. **Cooldown:** after end, no new modifier until `currentAge >= lastEndedAtAge + cooldownYears` (**1.5** years ≈ **67.5 s** Midlife).
4. **No immediate repeat:** exclude `lastId` from the weighted pool.
5. **Mutual exclusion pairs:** `rentHike` <-> `doubleLateFees`. (Both bill-pressure; back-to-back feels samey even with cooldown.)
6. **No roll during boss fights:** if any `bills` child has `active && isBoss`, skip (retry next frame/age tick without burning pity).
7. **No roll right after hurt:** if `scene.time.now - lastHurt < noRollAfterHurtMs` (**3000**), skip.
8. **No roll during / just after level-up:** if `levelUpOpen` or within **2500** ms of menu close, skip.
9. **No roll if Comfort Zone Tax is currently active** (`runElapsedMs < dyn.comfortUntil`): wait it out (see §4). Still advance nothing; do not consume a fail for pity.
10. **Pity / grace:** each *eligible* roll that rolls RNG miss increments `failStreak`. At `pityFailsBeforeForce` (**3**), next eligible roll **forces** a weighted pick (still respecting exclusion and boss gates). Success resets `failStreak`.

Weighted pick: filter defs by `currentAge >= minAge`, not excluded, not exclusive with a hypothetical second (n/a), then `weight` raffle like `rollWaveKind`.

### 3.3 Announce and clear

**On start:**

```js
flashBanner(def.bannerTitle, def.bannerSub, def.bannerKind);
showLowerThird("alert" or "reward", def.bannerTitle, def.bannerSub, 4000, def.bannerSub);
sfx("modStart"); // soft UI blip; add to sounds.js
```

**HUD chip (optional but recommended):** small pill under `#vs-combo` or beside age: Silkscreen text of `bannerTitle`, coffee-orange outline, hidden when none active. Must stay readable in swarms (HTML HUD, not world text).

**On end:** quiet lower-third tip `"Modifier ended."` once; no second center flash (avoid alarm fatigue). Clear all effect hooks.

---

## 4. Interactions

### 4.1 Tax Bracket heat

- **Frequency:** `chance = clamp(chancePerRoll + heatChanceAddPerBracket * runTaxBracket + firstBonus, 0.15, 0.90)`.
- **Intensity:** for effects marked as scaling (Rent Hike bill HP), multiply the extra by `1 + heatIntensityAddPerBracket * runTaxBracket` (**0.05** per level). Example Tax 4: bill HP mult `1.25 * 1.20 = 1.50`.
- Do **not** raise Close Call XP caps via heat.
- Do **not** change `TAX_BRACKET.perLevel` itself.

### 4.2 Comfort Zone Tax

**Avoid double punish.**

While any run modifier is **active**:

- `updateDynamicIntensity` must **not** start a new `comfortUntil` window (treat as `return` early after mercy check, or set a `mod.suspendComfort = true` gate).
- An already-running Comfort Zone Tax may finish; do not hard-clear it on modifier start (player earned that pressure by camping earlier).
- Close Calls still refresh `dyn.lastHitAt` per existing NearMiss rules when comfort is *not* in the active tax window.

When no modifier is active, Comfort Zone behaves exactly as today.

### 4.3 Close Calls

| Modifier | Close Call tweak | Caps |
|---|---|---|
| Ghost Hour | `bandPx + 2` | still 6 XP / 10s, `xpPerCreditMax` 0.85 |
| Reading Glasses | effective `xpBase` 0.50 | same caps |
| Empty Nest | `comboDecayMs` 3000 | same caps |
| Others | none | |

Implement via a tiny reader on `NearMiss` (e.g. `NearMiss.bandBonus()` / pass-through getters) or by having modifiers patch a `window.modHooks` object that `near-miss.js` reads. **Do not** permanently mutate `NEAR_MISS` defaults; clear on modifier end.

### 4.4 Dad Joke (V. 1.30.2)

- Default: modifiers leave `cringeMs` / `pushSpeed` alone.
- **Reply-All Tax** only: temporary `jokeRadius * 1.10`, `pushSpeed * 1.15` while active.
- Back Spasm must **not** disable cringe (that would feel mean and remove the new playtest buff).

### 4.5 `hitDamageByAge`

At 50+ the curve is already climbing ( +1 from 48, +2 from 55). Prefer **spawn bias and HP** over global contact damage. Only **Reply-All Tax** adds +1 damage, and only on `officeGossip`. Do not add a global `hitDamageAdd` from modifiers (Tax Bracket already has `hitDamageAdd`).

---

## 5. Consolidated tuning table

| Key | Default | File |
|---|---|---|
| `firstEligibleAge` | 50 | `modifiers.js` TUNING |
| `rollEveryYears` | 2.5 | TUNING |
| `chancePerRoll` | 0.55 | TUNING |
| `heatChanceAddPerBracket` | 0.06 | TUNING |
| `heatIntensityAddPerBracket` | 0.05 | TUNING |
| `maxActive` | 1 | TUNING |
| `maxBudget` | 3 | TUNING |
| `cooldownYears` | 1.5 | TUNING |
| `noRollAfterHurtMs` | 3000 | TUNING |
| `noRollAfterLevelUpMs` | 2500 | TUNING |
| `pityFailsBeforeForce` | 3 | TUNING |
| `firstRollChanceBonus` | 0.20 | TUNING |
| Ghost Hour durationYears | 2.0 | DEFS |
| Ghost Hour threeAm weight add | +4 | DEFS |
| Ghost Hour ghostMsMult | 1.35 | DEFS |
| Ghost Hour nearMissBandAdd | +2 | DEFS |
| Reading Glasses magnetMult | 0.70 | DEFS |
| Reading Glasses rangeMult | 0.90 | DEFS |
| Reading Glasses nearMiss xpBase | 0.50 | DEFS |
| Rent Hike billHpMult | 1.25 | DEFS |
| Rent Hike bill weight add | +3 | DEFS |
| Empty Nest packAdd | +1 | DEFS |
| Empty Nest gemXpMult | 1.20 | DEFS |
| Empty Nest pizzaHealMult | 0.75 | DEFS |
| Empty Nest comboDecayMs | 3000 | DEFS |
| Back Spasm twinge weight add | +4 | DEFS |
| Back Spasm speedMult | 0.92 | DEFS |
| Reply-All gossip weight add | +5 | DEFS |
| Reply-All gossip damageAdd | +1 | DEFS |
| Reply-All gossip hpMult | 1.15 | DEFS |
| Reply-All jokeRadiusMult | 1.10 | DEFS |
| Reply-All pushSpeedMult | 1.15 | DEFS |
| Past Due lateFeeCount | 4 | DEFS |
| Past Due overdueAfterMs | 9000 | DEFS |
| Open Enrollment spawnDelayMult | 0.90 | DEFS |
| Open Enrollment pizzaHealAdd | +1 | DEFS |
| Open Enrollment plantItemMult | 1.5 | DEFS |

---

## 6. Telemetry and debug

Counters (run-local, console when `RUN_MODIFIER_TUNING.debug` or `?modDebug=1` at Game Over):

```
modStats = {
  rolls, hits, fails, pityForced,
  skippedBoss, skippedHurt, skippedLevelUp, skippedComfort,
  byId: { ghostHour: { started, completed }, ... },
  maxAgeWithMod
}
```

**Force modifier for QA:**

- URL: `?forceMod=ghostHour` starts that id at age 50 (or immediately if already 50+) with full duration, ignoring chance.
- Keyboard (desktop debug only, if `modDebug`): press **M** to force a random eligible modifier, **Shift+M** to clear active.

Do not ship force keys as a player-facing tip.

---

## 7. Acceptance tests and playtest checklist

### 7.1 Tests

1. Age 49.9: no modifier can start. Cross 50: first roll schedules; with `firstRollChanceBonus` it often appears within ~1 roll.
2. Active modifier: second cannot start; `maxActive` holds.
3. End + 1.0 year: still in cooldown; at +1.5 years rolls may resume.
4. `rentHike` then pool excludes `doubleLateFees` and excludes `rentHike` as `lastId`.
5. While Performance Review alive (`isBoss`): no roll; after kill, rolls allowed.
6. Within 3s of a hit: no roll.
7. During Comfort Zone Tax window: no new modifier; after it ends, modifiers can roll.
8. While Ghost Hour active: Comfort Zone Tax does not *start*.
9. `?forceMod=readingGlasses`: magnet visibly shorter; Close Call XP still capped at 6 / 10s even if xpBase is 0.50.
10. Past Due: one overdue Bill produces **4** Late Fees, each pathable (`NAV.fixSpawn` not null).
11. Reply-All Tax: Dad Joke radius/push feel stronger; bosses still ignore cringe.
12. Reduced motion: banner uses fade path; no added shake.
13. Tax Bracket 5: roll chance higher; Rent Hike bills noticeably tankier; soft start at 40 untouched on a fresh run.
14. Old save loads; no throw if `RUN_MODIFIER_DEFS` missing (guard).

### 7.2 Estimated rates (estimates, not measured)

Midlife Tax 0, human play, after age 50, ~15 minutes left to 65 (about 6 roll windows before cooldown math):

| Situation | Est. modifiers seen per Midlife clear attempt | Reasoning |
|---|---|---|
| Tax 0, average RNG | **2 to 3** | 0.55 chance, 2.5-year spacing, 1.5-year cooldown, ~15 age-years |
| Tax 3 to 5 | **3 to 4** | higher chance, pity kicks in less often |
| Always camping (Comfort Tax often up) | **1 to 2** | skips during comfort and bosses |

If players report **zero** modifiers in a full 50 to 65, raise `chancePerRoll` to 0.65 or drop `cooldownYears` to 1.0 before touching effect strength.

### 7.3 Rami feel checklist

- [ ] Banner readable mid-swarm without looking at the bottom bar
- [ ] Each modifier is identifiable within ~3 seconds of play
- [ ] None feel mean or body-shaming
- [ ] Desk camping still does not beat flow-field + Close Call rules
- [ ] Comfort Zone Tax and a modifier never stack as a sudden double storm
- [ ] Dad Joke still shines during Back Spasm / Reply-All
- [ ] Close Call caps still prevent dodge-only leveling

---

## 8. Risks and open questions

1. **Wave bias stacking with swarm events.** A "Donut Drop" event plus Open Enrollment should remain readable; biases apply to the everyday drip (`rollWaveKind`), not necessarily rewrite `SWARM_EVENTS` counts (leave events alone in v1).
2. **Reading Glasses vs Grad Student magnet.** Grad Student starts with a huge magnet; 0.70 still leaves a strong pull. Confirm in playtest.
3. **Age-based vs time-based duration.** Spec picks age-based so Midlife/Full Life stay fair. Confirm Rami likes calendar flavor over real-time.
4. **HUD chip clutter** next to Close Call meter: if busy, keep banner-only.
5. **Open:** Should Full Life after 80 roll a senior-only pool? Defer.
6. **Open:** Second active modifier at Tax 5 only? Defer; keep `maxActive: 1`.
7. **Near-miss build note:** V. 1.30.0 measures the band with **physics body gaps**, not `PLAYER.size` circles, because the player body is larger than `PLAYER.size` 32. This modifiers spec's `nearMissBandAdd` must add to that same gap check in `src/near-miss.js`.

---

## 9. Implementation order

1. Add `src/data/modifiers.js` + loader entry.
2. Runtime module (`src/modifiers.js` or section in `main.js`): schedule, gates, start/end, HUD chip.
3. Hook effects one def at a time (start with Ghost Hour + Past Due).
4. Wire Comfort Zone suspend + Close Call temporary getters.
5. Dad Joke buffs only for Reply-All Tax.
6. Debug force URL + counters.
7. Playtest; tune weights before strengths.
8. Version bump; mark ROADMAP 3D done.

**Done when:** Between ages 50 and 65 a typical Midlife run sees a couple of clear, funny weather patterns, never stacked with Comfort Zone Tax, never breaking flow-field pathing, and never blowing past Close Call XP caps.
