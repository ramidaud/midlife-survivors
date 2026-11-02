# Midlife Survivors: Boss Attacks (Performance Review, Mortgage, V8) Handoff

**For:** Claude or Codex implementing in `ramidaud/midlife-survivors`
**From:** Grok (boss attack pass; follows Parts 3C Close Calls and 3D modifiers)
**Date:** 2026-11-02 (America/New_York)
**Repo state when written:** V. **1.33.1** ("Beautiful Chaos"), commit around `a84dcd9`
**Parent docs:** `docs/handoffs/grok-near-miss.md`, `docs/handoffs/grok-modifiers.md`, `docs/handoffs/grok-difficulty-2026-11-01.md`
**Do not apply a blind patch.** Re-find symbols by **name**. Line numbers drift.

---

## Context

**Goal:** Give the three Midlife decade bosses readable, phone-fair special attacks so they are not just bigger Bills that `NAV.steer` at you. Each fight should feel like a midlife set piece: a Performance Review that charges after a clear warning, a Mortgage that expands as % interest rings with a gap, and a Midlife Crisis V8 that drifts loops and leaves skid hazards.

**Why now:** Close Calls, Tax Bracket, Comfort Zone Tax, Dad Joke cringe/push, center `flashBanner`, flow-field furniture, and (specced) age-50+ modifiers are in place. Bosses still use the default chase path in `main.js` (no dedicated attack states). Midlife mode only schedules these three (`RUN_MODES.midlife.bosses`).

**Hard constraints:**

1. Spec only in this step. No gameplay code here.
2. Data-driven: prefer a new **`src/data/bosses.js`** exporting `window.BOSS_ATTACKS` (and shared `window.BOSS_ATTACK_TUNING`), added to `window.GAME_FILES` in `src/loader.js` near `nearMiss.js`. Keep base HP/speed/damage/spawnAge on `ENEMIES[kind]` in `enemies.js`. Do not silently rewrite `ENEMY_SCALE`.
3. Do **not** break save format. Attack state is run-local on the boss sprite.
4. Do **not** change Tax Bracket `perLevel`, Comfort Zone `INTENSITY.dynamic`, Close Call hard caps, or soft-start spawn waves as part of this work. Attacks may *read* heat/age and multiply their own knobs.
5. Keep swarm readability: one boss attack telegraph at a time per boss, limited world text, respect `prefers-reduced-motion` (no extra camera shake on telegraph; rings/skids still draw as static-friendly shapes).
6. Version bump when playable (e.g. **V. 1.34.0**), bump `GAME_VERSION` / build, note ROADMAP.

### Code facts to trust (V. 1.33.1)

| Fact | Where | Value / note |
|---|---|---|
| Hero data size | `PLAYER.size` | **32** (legacy square; labels / some math) |
| Hero physics body | Arcade body on `player` | About **48x52** in practice (Close Call build note in `grok-changes.md`); do not assume 32 for dodge math |
| Hero walk visual | `CharacterArt` frames | **56x60** per frame |
| Hero speed | `PLAYER.speed` | **230** px/s |
| Hurt i-frames | `PLAYER.hurtCooldownMs` | **550** ms (all contact, including new attack volumes) |
| Boss scale | `ENEMY_SCALE` | `boss: 2.3`, `bossHitbox: 0.5` (half of **texture frame**, then `body.setSize`) |
| Boss textures | `src/sprites.js` | Review **64x68**, Mortgage **68x68**, V8 **72x50** |
| Boss visual after scale | frame * 2.3 | Review ~**147x156**, Mortgage ~**156x156**, V8 ~**166x115** (~2.5x hero walk height) |
| Boss data `size` after scale multiply | `enemies.js` loop | Review **120**, Mortgage **138**, V8 **133** (mutated at load) |
| Current boss AI | `main.js` update | Default `chase` / `NAV.steer` only. **No** charge, rings, or skids yet |
| Boss spawn | `spawnBoss` | Off right edge of `worldView`, `NAV.fixSpawn`, toast + lower third |
| Midlife bosses | `modes.js` | `performanceReview` (45), `mortgageRefinance` (52), `midlifeCrisis` (60) |
| Contact damage | `hurtPlayer` | `bill.damage + round(hitDamageByAge) + round(tax("hitDamageAdd"))` |
| `hitDamageByAge` | `INTENSITY` | `[[40,0],[48,1],[55,2],[62,3]]` |
| Dad Joke vs bosses | `fireDadJoke` | Bosses take damage; **ignore** `cringeMs` / `pushSpeed` |
| Close Calls | `NEAR_MISS` | `bossCooldownMs: 1200`; physics **gap** band; caps 6 XP / 10s |
| Modifiers | `grok-modifiers.md` | Spec ready; **`src/data/modifiers.js` not built** as of this pull. Rule already: no modifier rolls while a boss lives |
| Viewport | `VIEW` | `targetShortSide: 640`, `maxZoom: 4`; phones often zoom **1** so world short side ~**360 to 390** px |
| Touch | joystick | deadzone ~5 to 18 px by sensitivity; floating or fixed pads |
| Furniture | colliders + `NAV` | `bills` collide with `propGroup`; steer walks around desks |
| `flashBanner` | `src/ui.js` | `flashBanner(title, sub, kind)`, ~1.9s |

**Tone:** Funny, warm, never mean. Reviews, APR, and sports cars are the joke. No body or health shaming.

**Size conflict to resolve in implementation (open question, see §9):** Rami's brief says bosses are ~**2.5x** hero visual and the hit box is **half the visual**. Current code matches the visual scale roughly (2.3x on ~56 to 60 px hero frames), but `bossHitbox: 0.5` is half the **unscaled texture frame** (~32 to 36 px), which is closer to **~22%** of the drawn sprite, not half. Attack volumes below are authored in absolute px. Contact body can stay as-is for desk navigation; do not widen the body enough to jam between desks without Rami's OK.

---

## 1. Proposed data shape (`src/data/bosses.js`)

Illustrative schema only (do not paste as a silent patch; implement to match):

```js
// Boss special attacks (Grok). Full spec: docs/handoffs/grok-boss-attacks.md
window.BOSS_ATTACK_TUNING = {
  // Phone fairness floors (see §5). Never scale telegraphs below these.
  minTelegraphMs: 550,
  minTelegraphMsMortgage: 650, // ring gap needs a beat longer to read
  touchReactMs: 280,           // human + thumb to stick (design assumption)
  joystickLatencyMs: 80,       // input path / deadzone (design assumption)
  // Shared scaling
  ageRefYear: 40,
  telegraphAgeCutPerYear: 4,   // ms removed per year past 40, before floor
  telegraphTaxCutPerBracket: 25,
  speedAgeAddPerYear: 0.012,   // multiplicative on attack travel speed
  speedTaxAddPerBracket: 0.04,
  speedMultCap: 1.45,
  damageTaxAddPerBracket: 0.5, // added then rounded, stacks with hurtPlayer tax path only if attack uses hurtPlayer
  // Close Calls on attack volumes
  creditBossAttacks: true,
  bossAttackNearMissCooldownMs: 1500,
  creditSkidZones: false,      // lingering hazards never farm Close Calls
  // Debug
  debug: false,                // or ?bossAtkDebug=1
  forceBoss: null              // or ?forceBoss=performanceReview (spawns when age allows / debug menu)
};

window.BOSS_ATTACKS = {
  performanceReview: {
    id: "hrCharge",
    bannerTitle: "REVIEW TIME",
    bannerSub: "They're coming in hot. Sidestep the line.",
    bannerKind: "alert",
    telegraphMs: 700,
    cooldownMs: 4200,
    firstAttackDelayMs: 1600,
    windupTint: 0xff6b7a,
    // Attack
    chargeSpeed: 400,          // px/s along locked aim
    chargeDurationMs: 1100,
    chargeMaxDist: 560,        // stop early if either hits
    bodyHalfW: 22,             // attack hurt width/2 during charge (px)
    bodyHalfH: 28,
    damage: 2,                 // before hitDamageByAge + tax in hurtPlayer
    // Furniture
    passThroughProps: true,    // straight line like Calendar Invite; do not NAV.steer mid-charge
    // Counterplay
    dodgeHint: "Strafe perpendicular to the warning line. Do not outrun the charge head-on."
  },
  mortgageRefinance: {
    id: "aprRing",
    bannerTitle: "RATE LOCK",
    bannerSub: "Interest expands. Slip the % gap.",
    bannerKind: "alert",
    telegraphMs: 850,
    cooldownMs: 5200,
    firstAttackDelayMs: 1800,
    ringCount: 2,
    ringGapMs: 700,            // delay between ring 1 and 2
    expandSpeed: 135,          // px/s radius growth
    startRadius: 36,
    maxRadius: 260,
    ringHalfThickness: 16,     // hurt when |dist - radius| <= this
    gapArcDeg: 70,             // safe wedge
    gapAimJitterDeg: 18,       // randomize gap around "away from player" so it is not always behind you
    label: "%",                // draw a small APR/% mark on the gap
    damage: 2,
    passThroughProps: true,    // geometry hazard; visuals draw over furniture
    dodgeHint: "Rotate into the marked gap, or step out before the ring reaches you."
  },
  midlifeCrisis: {
    id: "v8Drift",
    bannerTitle: "V8 BURNOUT",
    bannerSub: "Drift loop incoming. Skip the skids.",
    bannerKind: "alert",
    telegraphMs: 650,
    cooldownMs: 4800,
    firstAttackDelayMs: 1400,
    driftSpeed: 340,           // px/s along the arc
    loopRadius: 130,
    loopRevs: 1.25,            // how much circle to travel
    skidHalfW: 18,
    skidHalfL: 26,             // each skid stamp
    skidEveryPx: 28,           // drop a stamp this often along the path
    skidLifeMs: 2800,
    skidDamage: 1,             // lighter than a full body check
    bodyHalfW: 24,
    bodyHalfH: 18,
    damage: 3,                 // car body during drift
    passThroughProps: true,    // readable burnouts; do not pin on desks mid-drift
    skidsDrawOverProps: true,  // render above carpet/props; no physics collider on skids
    dodgeHint: "Cut inside the loop or leave the tire tracks. Skids linger."
  }
};
```

Runtime (on boss sprite, run-local):

```js
boss._atk = {
  state: "chase",     // chase | telegraph | attack | recover
  nextAt: 0,          // runElapsedMs
  aimX: 0, aimY: 0,
  aimAngle: 0,
  startedAt: 0,
  rings: [],          // mortgage active rings
  skids: []           // v8 hazard stamps {x,y,ang,dieAt}
};
```

Announce once when the boss first enters telegraph for the fight (not every cooldown):

```js
flashBanner(def.bannerTitle, def.bannerSub, def.bannerKind);
showLowerThird("alert", def.bannerTitle, def.bannerSub, 4500, def.bannerSub);
```

Optional: repeat a quieter lower-third only, no second center flash, if the player died and the same boss is still up (avoid banner fatigue).

---

## 2. Per-boss attacks

Scaling helpers used below:

```
years = max(0, currentAge - BOSS_ATTACK_TUNING.ageRefYear)
taxL  = runTaxBracket                        // 0..5
telegraphMs(base, floor) = max(floor,
  base - years * telegraphAgeCutPerYear - taxL * telegraphTaxCutPerBracket)
speedMult = min(speedMultCap, 1 + years * speedAgeAddPerYear + taxL * speedTaxAddPerBracket)
travelSpeed = round(baseSpeed * speedMult)
```

Damage still flows through `hurtPlayer` so age curve and Tax `hitDamageAdd` apply on top of `def.damage` / `skidDamage`. Do **not** also bake `hitDamageByAge` into the data table.

### 2.1 The Performance Review (`performanceReview`) : straight-line charge

| Field | Value |
|---|---|
| Banner | `REVIEW TIME` / `They're coming in hot. Sidestep the line.` / `alert` |
| Telegraph look | Boss pauses chase, flashes `windupTint`, draws a **coffee-orange warning line** from boss through the locked aim point (player position at telegraph start) out to `chargeMaxDist`. Small chevrons travel along the line. Reduced motion: static line, no chevron tween. |
| Telegraph ms | base **700**, floor **`minTelegraphMs` 550** |
| Attack | Locks angle; moves at **`chargeSpeed` 400** * `speedMult` px/s for up to **1100** ms or **560** px. Hurt box ~**44x56** (`bodyHalfW/H` 22/28) centered on boss. |
| Damage | **2** (+ age + tax via `hurtPlayer`) |
| Cooldown | **4200** ms after recover (recover **300** ms of slowed chase) |
| First delay | **1600** ms after spawn before first telegraph |
| Furniture | **Pass through** props during charge (same honesty as Calendar Invite). Resume `NAV.steer` after. Warning line may draw across desks. |
| Off-screen | If boss center is outside `worldView`, show an edge pip (HR label) along the viewport border aimed at the boss; telegraph line still clamped to visible segment. |
| Counterplay | Strafe **perpendicular** to the line. Head-on kiting fails on purpose. A desk does **not** safely block the charge body (passes through), so do not teach desk-tanking. |
| Close Call | Grazing the charge body (gap band) credits with `bossAttackNearMissCooldownMs` **1500**. |

### 2.2 The 30-Year Mortgage (`mortgageRefinance`) : % interest shockwave rings

| Field | Value |
|---|---|
| Banner | `RATE LOCK` / `Interest expands. Slip the % gap.` / `alert` |
| Telegraph look | Boss plants, purple ring ghost at `startRadius`, **gap wedge** highlighted in cream with a `%` / APR chip. Reduced motion: one static ghost ring + gap tick marks, no pulse. |
| Telegraph ms | base **850**, floor **`minTelegraphMsMortgage` 650** |
| Attack | **2** rings. Each expands at **`expandSpeed` 135** * `speedMult` px/s from **36** to **260** radius. Hurt when distance to boss is within **`ringHalfThickness` 16** of the live radius, **except** inside `gapArcDeg` **70** wedge. Second ring after **700** ms. |
| Damage | **2** (+ age + tax) |
| Cooldown | **5200** ms |
| First delay | **1800** ms |
| Furniture | Rings are **geometry**; visuals draw **over** furniture (`skidsDrawOverProps` equivalent). No prop collision. NAV chase between attacks still avoids desks. |
| Off-screen | Boss should telegraph only if within view inflated by 40 px, else slide/steer on-screen first (prefer), or show edge pip + only start telegraph once on-screen. Rings that would exceed the short phone view stay fair because the gap is aimed using player angle. |
| Counterplay | Move into the **% gap**, or step outward/inward so the thin ring misses you. Standing still in the solid arc is a hit. |
| Close Call | Escaping the ring edge (was in thickness, then safe without hurt) may credit once per ring; cooldown 1500. Gap loitering does not spam credits. |

### 2.3 The Midlife Crisis V8 (`midlifeCrisis`) : drift loops + skid marks

| Field | Value |
|---|---|
| Banner | `V8 BURNOUT` / `Drift loop incoming. Skip the skids.` / `alert` |
| Telegraph look | Short tire-screech SFX, red flash on boss, **ghost arc** showing the planned loop (circle approx radius **130** around a point beside the player). Reduced motion: arc outline only, no screen shake. |
| Telegraph ms | base **650**, floor **550** |
| Attack | Boss steers along the arc at **`driftSpeed` 340** * `speedMult` for **`loopRevs` 1.25** revolutions (path length = `1.25 * 2π * 130` ≈ **1021** px, ~3.0 s at base speed before mult). Body hurt **~48x36**. Every **`skidEveryPx` 28** drops a skid stamp (**36x52**), live **`skidLifeMs` 2800**, damage **1**. |
| Damage | Body **3**, skid **1** (+ age + tax each hit, still gated by i-frames) |
| Cooldown | **4800** ms after drift ends |
| First delay | **1400** ms |
| Furniture | Boss **passes through** props during drift (readable loop). **Skids draw over** furniture; skids are overlays / overlap checks only (no Arcade collider), so they do not shove the player through desks. |
| Off-screen | Choose loop center so most of the arc stays inside an expanded view; if phone-short, shrink `loopRadius` to `min(130, 0.32 * worldShortSide)` (estimate floor **110** on a 360 px short side). Edge pip while off-screen. |
| Counterplay | Cut **inside** the loop or leave the black streaks. Do not camp the tire tracks for gems. |
| Close Call | Body graze during drift: yes, cooldown 1500. **Skid zones: never** (`creditSkidZones: false`). |

---

## 3. Phone fairness math (required)

Assumptions (labeled estimates, not measured telemetry):

- Touch reaction + decide: **`touchReactMs` 280** (estimate)
- Joystick leave-deadzone + start moving: **`joystickLatencyMs` 80** (estimate)
- Budget already baked into floors: `minTelegraphMs` **550** >= 280+80+190 move slice
- Slowest move speed we design for: Back Spasm modifier **0.92** * `PLAYER.speed` **230** = **211.6** px/s (modifiers spec; even if modifiers.js is not built yet, keep this floor)
- Player half-extent for clearance: use physics half-width ~**24** px (48 body), not `PLAYER.size/2`

### 3.1 Charge sidestep

At floor telegraph **550** ms, distance movable = `0.550 * 211.6` ≈ **116** px.

Need to clear: charge half-width **22** + player half-width **24** + safety **20** ≈ **66** px lateral.

**116 > 66**, margin ≈ **50** px. Passes at Back Spasm speed.

At Tax 5 / late age, telegraph still floored at 550; charge speed caps at `400 * 1.45` = **580** px/s. Sidestep still works because counterplay is lateral, not a foot race down the line.

### 3.2 Mortgage gap

Gap chord at radius 120: `2 * 120 * sin(35°)` ≈ **138** px. Player width ~48 fits with ~45 px slack each side if centered.

Time to cross ring thickness 32 (full): `32 / 211.6` ≈ **151** ms. Telegraph floor **650** is for **reading the gap**, not crossing thickness.

### 3.3 V8 skid leave

Skid half-width 18 + player 24 + safety 16 ≈ **58** px. At 211.6 px/s need ≈ **274** ms. Telegraph **550** covers leaving the future arc before stamps drop; after stamps exist, i-frames (**550**) prevent skid tick melt-downs.

### 3.4 Small viewport rules

1. Never start a telegraph while the boss is fully off-screen without an **edge indicator**.
2. Prefer delaying mortgage/V8 telegraph until boss is inside `worldView` expanded by 40 px.
3. Attack FX depth above props, below HUD.
4. Max one floating world label per attack (`%` chip or "PIP").

---

## 4. Interactions

### 4.1 Close Calls

| Volume | Credit? | Cooldown |
|---|---|---|
| Boss body while chasing | Yes (existing) | `bossCooldownMs` **1200** |
| Charge body / ring edge / drift body | Yes if `creditBossAttacks` | **1500** |
| Skid stamps | **No** | n/a |
| Caps | Unchanged | 6 XP / 10s, `xpPerCreditMax` 0.85 |

Grazing must still pass existing closing-speed / approach rules where applicable. Rings: treat expanding radius as "closing" when the ring approaches the player.

### 4.2 Comfort Zone Tax

Boss attack hits go through `hurtPlayer` and already clear `comfortUntil` / set `dyn.lastHitAt`. Successful Close Calls on boss attacks may refresh engagement per existing NearMiss rules. Do not special-case Comfort math beyond that.

### 4.3 Age-50+ modifiers

If/when `modifiers.js` exists: **no modifier rolls while any `isBoss` is active** (already in the modifiers spec). Back Spasm 0.92 speed is the dodge floor used in §3. Reply-All Dad Joke radius buff does not stun bosses (bosses still ignore cringe/push). Empty Nest pack add does not change boss attack tables.

### 4.4 Dad Joke

Keep current behavior: damage applies, **no** stun/push on `isBoss`. Do not disable jokes during telegraphs.

### 4.5 i-frames

All attack overlaps call the same `hurtPlayer` gate (`hurtCooldownMs` **550**). Skids must not bypass it (no separate DPS tick that ignores i-frames).

### 4.6 Tax Bracket and age

Use §2 formulas. Examples at Tax **4**, age **60** (`years=20`):

- `speedMult = min(1.45, 1 + 20*0.012 + 4*0.04) = min(1.45, 1.40) = 1.40`
- Charge speed `400 * 1.40 = 560`
- Telegraph charge `max(550, 700 - 20*4 - 4*25) = max(550, 520) = 550` (hits floor)

---

## 5. Consolidated tuning table

| Knob | Default |
|---|---|
| `minTelegraphMs` | 550 |
| `minTelegraphMsMortgage` | 650 |
| Review `telegraphMs` / `chargeSpeed` / `cooldownMs` | 700 / 400 / 4200 |
| Mortgage `telegraphMs` / `expandSpeed` / `gapArcDeg` / `cooldownMs` | 850 / 135 / 70 / 5200 |
| V8 `telegraphMs` / `driftSpeed` / `loopRadius` / `skidLifeMs` / `cooldownMs` | 650 / 340 / 130 / 2800 / 4800 |
| `speedMultCap` | 1.45 |
| `bossAttackNearMissCooldownMs` | 1500 |
| `creditSkidZones` | false |
| Hero speed reference | 230 (0.92 floor -> 211.6) |
| i-frames | 550 |

---

## 6. Telemetry and debug

- URL `?bossAtkDebug=1` or `BOSS_ATTACK_TUNING.debug`: draw telegraph lines, ring radii, gap wedges, skid AABBs; log attack start/end.
- URL `?forceBoss=performanceReview|mortgageRefinance|midlifeCrisis`: on run start (debug builds / QA), mark other Midlife bosses spawned and force this kind at its `spawnAge` or immediately if `?forceBossNow=1`.
- Counters (Game Over / Telemetry hook): `bossAtkTelegraphs`, `bossAtkHits`, `bossAtkDodges` (credit or no-hit through volume), `bossAtkSkidHits`, `bossAtkNearMissCredits`.

---

## 7. Acceptance tests

1. Each of the three bosses enters `telegraph` then `attack` without stuck states after kill/despawn.
2. Telegraph ms never below floors at age 100 Tax 5 (unit-test the helper).
3. Charge passes through a desk and still hits if the player stands on the line; sidestep with no hurt.
4. Mortgage gap: standing in the wedge takes **0** damage; standing opposite takes damage once per ring (i-frames permitting).
5. V8 leaves skids that expire by `skidLifeMs`; skids never increment NearMiss credits.
6. Dad Joke damages boss during telegraph; boss does not cringe.
7. `hurtCooldownMs` blocks double-hit from body + skid in the same 550 ms window.
8. Off-screen boss shows edge pip before telegraph; on a ~360 px-wide world view, V8 loop radius shrinks per §2.3.
9. Reduced motion: no telegraph shake; rings/arcs still visible.
10. Midlife only: HOA / Retirement / Pickleball unchanged (no attacks required in this pass).

---

## 8. Playtest checklist (estimates labeled)

- [ ] Age 45 Review: first charge readable on phone; deaths to charge feel like "I stayed on the line," not "teleport hit." (estimate: learn in 1 to 2 cycles)
- [ ] Age 52 Mortgage: gap findable in clutter; second ring not a cheap blindside. (estimate: ~50% first-time gap success after one death)
- [ ] Age 60 V8: skids visible on carpet and over desks; camping tracks hurts. (estimate: skid deaths < body drift deaths)
- [ ] Tax 0 vs Tax 5: faster attacks, telegraphs still floored; still fair with joystick on high deadzone.
- [ ] Back Spasm (or 0.92 speed debug): can still sidestep charge (§3.1).
- [ ] Swarm readability: attack FX do not hide Bill tags entirely.
- [ ] Comfort Zone: hitting a ring clears camping bonus as a normal hit.
- [ ] Close Call meter ticks on charge graze, not on skid toes.

---

## 9. Risks and open questions

1. **Hit box vs visual:** Rami half-visual vs current `bossHitbox: 0.5` of frame. Recommend keeping navigation body tight; size **attack volumes** explicitly (this doc). Ask Rami before widening idle contact bodies.
2. **Pass-through vs NAV:** Charges/drifts that ignore desks are honest but fantasy. Alternative (harder): stop charge on prop and cancel with a "blocked" flinch. Default in this spec is pass-through for phone readability.
3. **Skid + i-frames:** Light skid damage may feel like chip noise; if so, raise `skidLifeMs` down or damage to 1 with longer personal skid cooldown.
4. **3D / Diablo view:** Confirm attack overlays in `view3d.js` / world-art paths, not only 2D sprites.
5. **Modifiers not built yet:** Dodge math still reserves 0.92 speed. When modifiers land, re-verify §3 on device.
6. **Senior palette swaps:** HOA/Retirement/Pickleball reuse textures; out of scope unless Rami wants shared attack kits later.

---

## 10. Implementation sketch (for Claude, not a patch)

1. Add `src/data/bosses.js`, register in `loader.js`.
2. In `spawnBoss`, init `boss._atk` and schedule `nextAt`.
3. In the bills update loop, before default `chase`, if `boss.isBoss && BOSS_ATTACKS[boss.kind]`, run a small state machine (telegraph / attack / recover).
4. Implement helpers: `drawTelegraph`, `hurtIfOverlappingAttack`, edge pip UI, skid list tick.
5. Hook NearMiss optional credit path for attack volumes.
6. QA with `?forceBoss=` on phone width.

**Done when:** Each Midlife boss has one readable attack, telegraphs never under the phone floors, skids do not farm Close Calls, furniture rules match this doc, and Rami clears a phone playtest on Tax 0 and Tax 3.
