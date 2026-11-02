# Midlife Survivors — Near-Miss Rewards (Part 3C) Handoff

**For:** Claude or Codex implementing in `ramidaud/midlife-survivors`  
**From:** Grok (Part 3C of the difficulty plan)  
**Date:** 2026-11-01 (America/New_York)  
**Repo state when written:** V. **1.29.3** (“Circle Back”), commit around `7a27d60` (flow-field navigation landed in V. **1.29.0** `c1eae6c`)  
**Parent doc:** `docs/handoffs/grok-difficulty-2026-11-01.md` §3C (original one-paragraph sketch — this file replaces it as the implementation spec)  
**Do not apply a blind patch.** Re-find symbols by **name**. Line numbers drift.

---

## Context

**Goal:** Reward skilled dodging once contact damage matters (Parts 1–2 + Tax Bracket + Comfort Zone Tax are live). A near miss should feel like a tiny win — XP crumb, short speed tick, “Close Call” streak — without undoing the difficulty pass.

**Why rewrite §3C now:** V. 1.29.0 added `src/navigation.js` flow-field steering. Enemies walk **around** furniture (`NAV.steer`) and no longer pile into desks. Standing behind a cubicle is no longer a free safe pocket; enemies path around and re-approach. The old “graze when close” sketch would farm endlessly if a Bill orbits a desk next to a camping player. This spec adds **threat + anti-farm** rules that use the flow field.

**Hard constraints (unchanged from the difficulty handoff):**

1. Keep the first ~90s gentle on **spawns** (`SPAWNING.waves` age-40 `everyMs: 1150`; Tax Season `minAge: 43`). Near-miss may arm earlier than 90s (see tuning) because it only rewards movement skill — it must not change those spawn constants.
2. Data-driven: new knobs live in **`src/data/nearMiss.js`** as `window.NEAR_MISS`. Add that file to `window.GAME_FILES` in `src/loader.js` (near `heat.js`).
3. Do **not** break save format (`midlife_survivors_save_v1`). Near-miss is run-local only — no meta fields required.
4. Do **not** change hitboxes, `PLAYER.hurtCooldownMs`, spawn rates, Tax Bracket, or Comfort Zone Tax numbers as part of this work.
5. Prefer a **manual distance check** in the enemy update loop (near where `NAV.steer` / chase runs), **not** a second physics collider — avoids double-hurt bugs with `this.physics.add.overlap(player, bills, hurtPlayer)`.
6. Version bump when playable (e.g. **V. 1.30.0**), bump `window.BUILD`, short notes in `docs/PROGRESS_LOG.md` / `docs/ROADMAP.md` (mark Part 3C done).

### Code facts to trust (as of V. 1.29.3)

| Fact | Where | Value / note |
|---|---|---|
| Player display size | `PLAYER.size` in `src/data/player.js` | **32** px |
| Player speed | `PLAYER.speed` | **230** px/s |
| Hurt i-frames | `PLAYER.hurtCooldownMs` | **550** ms |
| Hurt entry | `hurtPlayer` in `src/main.js` | early-out if `now - lastHurt < PLAYER.hurtCooldownMs`; ghosts skipped |
| Contact hurt | `overlap(player, bills, hurtPlayer)` | Phaser body overlap (not an explicit circle). Graze uses a **data-size circle model** for tunability — see below |
| Enemy “size” | `ENEMIES[kind].size` in `src/data/enemies.js` | Bill **24**, Late Fee **18**, Spam **22**, Donut **24**, … bosses **52–64** |
| Group Chat projectile | `pings` group; tex `"ping"` 14×14 | `hurtPlayer(p, { kind: "groupChat", damage })` on overlap |
| Flow field | `src/navigation.js` → `window.NAV` | `cell: 32`, `pad: 10`, `refreshMs: 180`, `steer`, `reachable`, `fixSpawn`, `debug` |
| Clear-line heuristic already in steer | `NAV.steer` | if `dist[i] <= 2` or `dist[i] <= straight * 1.12 + 1.5` → straight chase |
| Comfort Zone Tax | `INTENSITY.dynamic` + `dyn` in `main.js` | arms after **90s**; **45s** no-hit → +2 pack for **20s**; any real hit sets `dyn.lastHitAt` and clears `comfortUntil` |
| Tax Bracket | `src/data/heat.js` | `xpMult: 0.10` per level (gems already use `1 + tax("xpMult")`) |
| XP pipeline | `collectGem` | fractional via `xpFrac`; gem = `PICKUPS.wisdomGem.xp` (**1**) × `stats.xpMult` × `(1 + tax("xpMult"))` |
| Level curve | `LEVELING` in `pickups.js` | `firstLevelXp: 8`, `growth: 1.35`, `stepXp: 4` |
| Speed buffs | `buffs.speedUntil` / `buffs.speedMult` | Energy Drink: **1.35×** for **12s** (`FIELD_ITEMS.energyDrink`) |
| Move apply | update loop | `moveSpd = (donut-slowed or stats.speed) * buffSpd` |
| Score | `computeRunScore` in `src/leaderboard.js` | `years*1000 + kills*2 + coins*5` × tax scoreMult — **no** near-miss term yet |
| Combo today | — | **None.** Old coin “streakBonus” removed Oct 31 (`streakBonus = 0`) |
| Midlife clock | `RUN_MODES.midlife.secondsPerYear` | **45** s/year (use `modeCfg().secondsPerYear`, not `PLAYER.secondsPerYear` which is 60) |
| Reduced motion | mostly CSS for title/lower-third | Game JS has **no** shared `prefers-reduced-motion` helper yet — add a tiny one for shake/flash |

---

## 1. Definition of a near miss

### 1.1 Distance band (edge-to-edge, px)

Use a **circle model from data sizes** (independent of Phaser body quirks) so Claude can tune one table:

```
playerHitR = PLAYER.size / 2                          // 16
enemyHitR  = sizeOf(target) / 2                       // ENEMIES[kind].size/2, or ping → 7
contactDist = playerHitR + enemyHitR                  // centers would be "touching"
centerDist  = hypot(player.x - target.x, player.y - target.y)

NEAR MISS when:
  contactDist < centerDist <= contactDist + NEAR_MISS.bandPx
```

Default **`bandPx: 14`**.  
Example Bill: contact at 16+12=**28**; graze ring is **(28, 42]** px center-to-center.  
Example Late Fee: contact **25**; graze **(25, 39]**.  
Example Performance Review (size 52): contact **42**; graze **(42, 56]**.

**Leaving the band:** credit fires once when the target was inside the band on a prior sample **and** this frame `centerDist` is increasing (or the target leaves the outer edge), after the threat checks below. Do **not** credit every frame while loitering in the ring.

Suggested state on each eligible target (enemy sprite or ping):

```js
target._nm = { prevDist: null, lastCreditAt: -1e9, wasInBand: false };
```

### 1.2 What counts

| Target | Counts? | Notes |
|---|---|---|
| Regular swarm (`bill`, `lateFee`, `spamCall`, `snackAttack`, `backTwinge`, `officeGossip`, `calendarInvite`, `threeAmThought`, `mathWorksheet`) | **Yes** | Skip if `bill.ghost` (3 AM Thought fade) — same rule as `hurtPlayer` |
| Elites that contact-hurt | **Yes** | Same band formula |
| Bosses (`performanceReview`, `mortgageRefinance`, `midlifeCrisis`, Full Life bosses, end party) | **Yes** | Same band; longer per-target cooldown (see tuning) |
| `theReaper` | **No** | Instant end / special — do not graze |
| Group Chat **pings** (`pings` group) | **Yes** | Treat `sizeOf(ping) = NEAR_MISS.pingSize` (default **14**). Credit when the ping skims the band and is destroyed or leaves without calling `hurtPlayer` |
| Group Chat **body** hanging back | **No** (default) | The body rarely contact-hurts; rewarding orbit camping is wrong. Optional later flag `creditGroupChatBody: false` |
| Player weapons / own projectiles | **No** | |

### 1.3 Threatening (closing) requirement

A target only counts if it was **closing** on the player while inside (or entering) the band:

```
closingSpeed = (prevDist - centerDist) / dtSec   // px/s, positive = approaching
require closingSpeed >= NEAR_MISS.minClosingSpeed   // default 40
```

Also require the target’s velocity (if any) not be trivially zero for >200ms while “in band” (idle / stuck). Flow-field enemies that are pathing should have non-zero velocity from `NAV.steer` / `setVelocity`.

**Do not credit** if `prevDist` is null (first frame we saw them).

### 1.4 Anti-farm vs furniture (flow field)

**Problem:** With V. 1.29.0, enemies path around desks and re-enter the graze ring repeatedly. A player hugging a corner can farm rings without ever being in danger if we only test distance.

**Rule — credit only if BOTH threat checks pass, AND at least one of:**

1. **Clear line of approach** to the player, **or**
2. **Player is moving** (engaged dodge).

#### Clear line of approach

Reuse the spirit of `NAV.steer`’s clear-line test. Prefer exposing a small helper on `NAV` (keeps pathing knowledge in one file):

```js
// Suggested addition to src/navigation.js (implementer writes it):
NAV.hasClearApproach = function (x, y, player) {
  // true when the flow distance is close to the straight-line distance in cells
  // (same constants as steer: dist[i] <= 2 || dist[i] <= straight * 1.12 + 1.5)
};
```

Optional stronger LOS: walk cells from enemy → player on the NAV grid; if any `blocked[i]`, no clear approach. The steer heuristic is enough for v1 if LOS sampling is costly.

If `NAV.enabled === false` or field not `ready`, treat clear approach as **true** (fallback = old open-floor game).

#### Player moving

```
playerSpeed = hypot(player.body.velocity.x, player.body.velocity.y)  // or last move vector
moving = playerSpeed >= NEAR_MISS.minPlayerSpeed   // default 40 px/s (~17% of base 230)
```

**Reasoning:** If you’re strafing through a pack, furniture may briefly break “clear approach” even though the dodge was real — movement unlocks credit. If you’re standing still, only enemies with a clear shot at you can graze-credit — no desk-orbit farming.

### 1.5 No credit while hurt / i-frames / menus

Skip the entire near-miss pass when any of:

- `gameOver`, `paused`, `levelUpOpen`, `titleOpen`, `retire80Open`
- `now - lastHurt < PLAYER.hurtCooldownMs` (includes the post-Second-Opinion extended window where `lastHurt` is pushed ahead)
- `runElapsedMs < NEAR_MISS.armAfterMs`

A frame that **calls** `hurtPlayer` successfully must **not** also award a near miss from that same target (damage wins). Reset combo on successful hurt (see §2.3).

### 1.6 Per-target cooldown

After a credit on target T:

- Regular / elite: `NEAR_MISS.cooldownMs` (**450**)
- Boss: `NEAR_MISS.bossCooldownMs` (**1200**)
- Ping: `NEAR_MISS.pingCooldownMs` (**300**) — pings are short-lived; still stop multi-credit if one skims for several frames

Key cooldown by object identity (`WeakMap` or `target._nm.lastCreditAt`). Do **not** use a global-only cooldown (that would starve real multi-enemy weaves); use a **popup rate cap** instead (§3.4).

---

## 2. Rewards

### 2.1 Small XP bonus

On each credited near miss:

```
xpGain = NEAR_MISS.xpBase                     // 0.40
       * comboXpMult(streak)                  // 1.0 / 1.15 / 1.3 / 1.5 by tier
       * (stats.xpMult || 1)                  // Continuing Ed — same as gems
       * (1 + tax("xpMult"));                 // Tax Bracket — same as gems

xpFrac += xpGain;
xp += Math.floor(xpFrac); xpFrac -= Math.floor(xpFrac);
// then the existing while (xp >= xpNeeded) level-up loop
```

**Caps (do not skip):**

| Cap | Default | Why |
|---|---|---|
| `xpPerCreditMax` | **0.85** | After combo mult, clamp one credit |
| `xpFromNearMissPer10s` | **6** | Rolling window; ~36 XP/min hard ceiling from near misses alone |
| `xpFromNearMissPerRunSoft` | none required | Optional log-only |

At Midlife mid-game, gems still dominate XP. 0.4 XP ≈ 40% of one Wisdom Gem — weaves feel good, AFK orbits cannot level you.

### 2.2 Short speed burst

On credit:

```
buffs.nearMissUntil = runElapsedMs + NEAR_MISS.speedBurstMs;  // 350
buffs.nearMissMult  = NEAR_MISS.speedBurstMult;               // 1.10
```

In the existing move line (where `buffSpd` is computed from Energy Drink):

```
buffSpd = max(
  runElapsedMs < buffs.speedUntil ? buffs.speedMult : 1,
  runElapsedMs < buffs.nearMissUntil ? buffs.nearMissMult : 1
);
```

**Do not multiply** Energy Drink × near-miss (take **max**). Near-miss burst is a blink, not a second Energy Drink. Donut `slowUntil` still applies first (sugar crash remains scary).

### 2.3 Close Call combo meter

Run-local state (reset on new run / load run):

```js
nmCombo = { streak: 0, tier: 0, expireAt: 0 };
```

On credit:

1. If `runElapsedMs > nmCombo.expireAt` → `streak = 0` (decay already happened).
2. `streak += 1`
3. `nmCombo.expireAt = runElapsedMs + NEAR_MISS.comboDecayMs` (**2500**)
4. Recompute tier from thresholds: **3 / 6 / 10 / 15** → tiers 1–4
5. On successful `hurtPlayer` damage (after i-frame check passes and HP is reduced): **`streak = 0`, `tier = 0`, `expireAt = 0`** and flash the HUD meter red once.

| Tier | Streak | Label (HUD) | `comboXpMult` | Extra |
|---|---|---|---|---|
| 0 | 1–2 | (hidden or “CLOSE”) | 1.00 | — |
| 1 | 3–5 | CLOSE CALL ×N | 1.15 | — |
| 2 | 6–9 | SIDE-STEP ×N | 1.30 | refresh speed burst duration +100ms once per entry |
| 3 | 10–14 | OUT OF OFFICE ×N | 1.50 | +`NEAR_MISS.tier3ScoreBonus` (**5**) score points |
| 4 | 15+ | PERFORMANCE EXCEEDED ×N | 1.50 (cap) | +`NEAR_MISS.tier4ScoreBonus` (**10**) once when first reaching 15; streak can keep climbing for juice but XP mult stays capped |

Decay: if no new credit by `expireAt`, set streak/tier to 0 (smooth HUD fade, no punishment beyond losing the meter).

### 2.4 Score crumbs

Add run counter `runNearMissScore` (integer). Each credit: `+= NEAR_MISS.scorePerCredit` (**1**). Tier bonuses add the amounts above.

Extend `computeRunScore` (keep DB schema unchanged — score is computed client-side):

```js
// add optional 6th arg or read window.getRunNearMissScore?.() || 0
+ nearMissScore * (L.pointsPerNearMiss || 1)
```

Default **1 point per near-miss score unit**. At ~20–40 credits in a good Midlife minute mid-game, that’s ~20–40 score vs ~1000/year — flavor, not a leaderboard exploit. Tax Bracket `scoreMult` already wraps the total.

### 2.5 Interaction: Tax Bracket

- XP: use existing `tax("xpMult")` (**+10% per bracket**) — no new heat field required for v1.
- Optional later: `NEAR_MISS.heatXpExtraPerBracket: 0` (reserved).
- Speed / band / cooldowns: **unchanged** by heat (heat already densifies swarms → more natural near-miss opportunities).
- Score: existing `scoreMult` applies via `computeRunScore`.

### 2.6 Interaction: Comfort Zone Tax

**Design intent:** Near misses mean you are **engaged**, not camping.

On each credited near miss:

```js
if (runElapsedMs >= dyn.comfortUntil) {
  dyn.lastHitAt = runElapsedMs; // postpones the next 45s "no-hit" Comfort Zone Tax
}
// Do NOT clear dyn.comfortUntil if a tax is already active —
// the tax is a temporary punishment wave; dodging during it is fine and still rewards.
```

Do **not** treat near miss as a real hit for mercy HP / damage / `lastHurt`.

### 2.7 Interaction: age-50+ modifiers (Part 3D, not built yet)

No code dependency. When 3D lands:

- Modifiers must **not** disable near-miss.
- Optional: `ghostHour` could add `+2` to `bandPx` while active (spookier weaves). Leave as an open question; do not implement in 3C.

---

## 3. On-screen feedback

### 3.1 Floating popup lines (~12)

Pick randomly (avoid repeating the last line). Style like existing floaters (`SUGAR CRASH!`, coin popups): monospace, cream/orange, rise + fade ~700ms.

```js
NEAR_MISS.lines = [
  "CLOSE CALL!",
  "Almost clocked in.",
  "Declined the meeting.",
  "Left it on read.",
  "Not today, autopay.",
  "Sidestepped Q3.",
  "Paper cut averted.",
  "Out of office (0.2s).",
  "Calendar: Declined.",
  "Muted and walked away.",
  "HR saw nothing.",
  "That one had your name on it.",
  "Survived the hallway.",
  "Reply-All dodged."
];
```

At combo tier ≥ 1, prefix or replace with `CLOSE CALL ×{streak}` more often (60% chance) so the meter and popup agree.

### 3.2 Combo meter in the HUD

Add a compact element under the clean top HUD (`#vs-hud` in `src/ui.js`) or beside the age/timer row:

- Hidden when `streak === 0`
- Shows `CLOSE ×N` in Silkscreen / existing HUD font, coffee-orange `#EF9347` fill
- Tier ≥ 3: cream pulse (CSS only; disabled under reduced motion)
- Update from `updateCleanHUD` (~10 Hz already) or immediately on credit

Keep it small — must not cover the player. Prefer **top HUD**, not world-anchored, so swarms stay readable.

### 3.3 SFX + flash

- New sound id `nearMiss` in `src/data/sounds.js` — short soft whoosh (e.g. two quick sine blips ascending, quieter than `coin`). Wire through existing `sfx("nearMiss")`.
- Optional: 1-frame cream tint on player (**not** the red hurt tint); skip if reduced motion.
- **Do not** grant i-frames.

### 3.4 Screen shake budget

Hurt uses `cameras.main.shake(120, 0.009)`. Near miss:

```
shake(55, 0.0025)   // only if !prefersReducedMotion()
```

Cap: at most one near-miss shake every **180ms**.

### 3.5 Popup rate cap (swarm readability)

```
NEAR_MISS.maxPopupsPerSec = 4
```

If over cap: still grant XP/speed/combo **silently** (or only refresh the HUD meter number) — never spawn a 5th floater that frame. Prefer merging into `CLOSE ×N` on the meter.

### 3.6 Reduced motion

```js
function prefersReducedMotion() {
  return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
}
```

When true: no shake, no player flash, no CSS pulse on the meter; popups may remain as instant text without tween (or a 200ms opacity fade only). Pan/pulse elsewhere already handled in CSS for title/devlog.

---

## 4. Tuning table (single source of truth)

**New file:** `src/data/nearMiss.js` → `window.NEAR_MISS`

| Key | Default | Unit | Lives in |
|---|---|---|---|
| `bandPx` | `14` | px edge-to-edge beyond contact | `nearMiss.js` |
| `pingSize` | `14` | px (Group Chat ping) | `nearMiss.js` |
| `minClosingSpeed` | `40` | px/s | `nearMiss.js` |
| `minPlayerSpeed` | `40` | px/s | `nearMiss.js` |
| `armAfterMs` | `20000` | ms | `nearMiss.js` |
| `cooldownMs` | `450` | ms / regular enemy | `nearMiss.js` |
| `bossCooldownMs` | `1200` | ms | `nearMiss.js` |
| `pingCooldownMs` | `300` | ms | `nearMiss.js` |
| `xpBase` | `0.40` | XP | `nearMiss.js` |
| `xpPerCreditMax` | `0.85` | XP | `nearMiss.js` |
| `xpFromNearMissPer10s` | `6` | XP / 10s rolling | `nearMiss.js` |
| `speedBurstMult` | `1.10` | × move | `nearMiss.js` |
| `speedBurstMs` | `350` | ms | `nearMiss.js` |
| `comboDecayMs` | `2500` | ms | `nearMiss.js` |
| `comboTiers` | `[3,6,10,15]` | streak thresholds | `nearMiss.js` |
| `comboXpMult` | `[1, 1.15, 1.3, 1.5, 1.5]` | by tier 0–4 | `nearMiss.js` |
| `scorePerCredit` | `1` | score units | `nearMiss.js` |
| `tier3ScoreBonus` | `5` | score units | `nearMiss.js` |
| `tier4ScoreBonus` | `10` | score units | `nearMiss.js` |
| `maxPopupsPerSec` | `4` | count | `nearMiss.js` |
| `shakeDurationMs` | `55` | ms | `nearMiss.js` |
| `shakeIntensity` | `0.0025` | Phaser shake | `nearMiss.js` |
| `shakeCooldownMs` | `180` | ms | `nearMiss.js` |
| `debug` | `false` | bool | `nearMiss.js` |
| `lines` | (array above) | strings | `nearMiss.js` |
| `creditGroupChatBody` | `false` | bool | `nearMiss.js` |
| `comfortCountsAsEngaged` | `true` | bool — updates `dyn.lastHitAt` | `nearMiss.js` |

**Hooks (runtime, not data):**

| Hook | File |
|---|---|
| Per-frame scan of `bills` + `pings` | `src/main.js` update (near chase / after `NAV.update`) |
| `NAV.hasClearApproach` (new) | `src/navigation.js` |
| Hurt resets combo | end of successful path in `hurtPlayer` |
| HUD meter | `updateCleanHUD` in `src/ui.js` + markup in `#vs-hud` |
| Score term | `computeRunScore` in `src/leaderboard.js` |
| SFX | `src/data/sounds.js` + `sfx()` |
| Load order | `src/loader.js` `GAME_FILES` |

Suggested skeleton for `src/data/nearMiss.js`:

```js
// Close Call / near-miss rewards (Grok Part 3C). All tunables in one place.
window.NEAR_MISS = {
  bandPx: 14,
  pingSize: 14,
  minClosingSpeed: 40,
  minPlayerSpeed: 40,
  armAfterMs: 20000,
  cooldownMs: 450,
  bossCooldownMs: 1200,
  pingCooldownMs: 300,
  xpBase: 0.40,
  xpPerCreditMax: 0.85,
  xpFromNearMissPer10s: 6,
  speedBurstMult: 1.10,
  speedBurstMs: 350,
  comboDecayMs: 2500,
  comboTiers: [3, 6, 10, 15],
  comboXpMult: [1.0, 1.15, 1.3, 1.5, 1.5],
  scorePerCredit: 1,
  tier3ScoreBonus: 5,
  tier4ScoreBonus: 10,
  maxPopupsPerSec: 4,
  shakeDurationMs: 55,
  shakeIntensity: 0.0025,
  shakeCooldownMs: 180,
  debug: false,
  creditGroupChatBody: false,
  comfortCountsAsEngaged: true,
  lines: [ /* see §3.1 */ ]
};
```

---

## 5. Telemetry / debug

### 5.1 Counters (run-local, log on Game Over / pause extras optional)

```
nmStats = {
  credits: 0,
  rejectedIframes: 0,
  rejectedNotClosing: 0,
  rejectedNoApproach: 0,   // failed clear-approach AND not moving
  rejectedCooldown: 0,
  rejectedXpCap: 0,
  xpGranted: 0,
  maxStreak: 0,
  pingCredits: 0,
  bossCredits: 0
}
```

Print a one-line summary in the browser console when the run ends if `NEAR_MISS.debug` or `?nmDebug=1`.

### 5.2 Debug overlay

When `NEAR_MISS.debug === true` (or `NAV.debug` already on):

- Draw a ring around the player at `playerHitR` (navy) and `playerHitR + bandPx` (orange, alpha 0.35).
- For each nearby enemy in band: small tick mark; green if would credit this frame, red if rejected (with reason letter: C=closing, A=approach, I=i-frame, D=cooldown).
- Do not draw for every enemy on screen — only those within `contactDist + bandPx + 40`.

Reuse `graphics` depth high enough to see over carpet, below HUD HTML.

---

## 6. Acceptance tests & playtest checklist

### 6.1 Automated / manual unit checks

1. Stand still in open floor, Bill approaches and contacts → **hurt**, combo **0**, no near-miss on that Bill for `cooldownMs`.
2. Strafe so Bill passes through the band without overlap → **one** credit, popup ≤1, XP increases by ~0.4×mult, speed tick audible/visible.
3. Loiter in the band beside a Bill that is not closing → **no** credit (`minClosingSpeed`).
4. Stand still behind a desk while a Bill pathing around stays in the ring with **no** clear approach → **no** credit.
5. Same as (4) but player strafes → credits allowed if closing + band.
6. During `hurtCooldownMs` after a hit → **no** credits.
7. Ghost 3 AM Thought → **no** credits while `ghost`.
8. Ping skims past → at most one ping credit; ping that hits still hurts and **resets combo**.
9. Spam 10 enemies through the band in 0.5s → ≤ **4** popups; XP still granted within cap.
10. `prefers-reduced-motion: reduce` → no shake / no flash.
11. Tax Bracket 5 → XP from near miss ~1.5× bracket-0 (5 × 10%), same as gem math.
12. 45s no hits but constant near misses after arm → Comfort Zone Tax **does not** fire (`dyn.lastHitAt` keeps refreshing). Pause near misses for 45s+ → tax **does** fire (after `armAfterMs` of dynamic intensity).
13. Old save loads; run starts; no throw if `NEAR_MISS` missing (guard with defaults).

### 6.2 Expected rates (estimates — not measured)

Assumptions: Midlife, Tax Bracket 0, human play, flow field on, after `armAfterMs`. Swarm density from `INTENSITY` / waves.

| Situation | Est. credits / min | Reasoning |
|---|---|---|
| Age ~42–45, learning, light movement | **4–10** | Sparse packs (`packSize` ~1, slow waves); few weaves |
| Age ~50–55, active strafing, Tax 0 | **18–35** | Packs 2–3, more kinds; skill expression peak for teaching the meter |
| Age ~60–65, dense, Tax 0 | **25–45** | More bodies but more hits too; cooldowns + XP cap bind the top |
| Tax Bracket 3–5, age 55+ | **30–55** | Denser spawns → more band crossings; XP still capped per 10s |
| Camping a desk corner, little movement | **0–3** | Anti-farm rules should starve this |

If playtest shows **>60/min** sustained at Tax 0 age 50, raise `cooldownMs` or shrink `bandPx` by 2 before touching XP.  
If skilled players report **never** seeing the meter, loosen `minClosingSpeed` to 25 or `bandPx` to 16 — do **not** remove the clear-approach/moving gate.

### 6.3 Feel checklist (Rami)

- [ ] First near miss before age ~43 feels readable and funny, not spammy  
- [ ] Combo meter visible on phone and desktop without covering the hero  
- [ ] Getting hit clearly “breaks the streak”  
- [ ] Comfort Zone Tax still appears if you truly camp without dodging  
- [ ] Boss weaves feel rewarding but not required to kill the boss  
- [ ] Does not make standing still with orbiting weapons the optimal XP farm  

---

## 7. Risks & open questions

1. **Body vs data-size mismatch.** Hurt uses Phaser overlap; graze uses `PLAYER.size` / `ENEMIES.size`. If art swap changes display size without updating `ENEMIES.size`, the band will feel wrong. **Mitigation:** keep sizes in sync; debug rings on during art integration.
2. **Perf.** Scanning all `bills` each frame is fine at `maxOnScreen` ~70–250 if the check is cheap (hypot + a few flags). Do not allocate per frame; reuse `_nm` on the sprite.
3. **NAV helper.** Adding `NAV.hasClearApproach` is the cleanest place; alternatively duplicate the steer math in main (worse). Prefer one helper.
4. **Score inflation.** Keep `pointsPerNearMiss` at 1 unless leaderboards feel wrong.
5. **Open:** Should Calendar Invite (straight charge) use a wider band? Probably not for v1.
6. **Open:** Credit when **you** weave through a stationary elite? Closing-speed rule says no — good (no farming asleep enemies). Confirm in playtest.
7. **Open:** Part 3D `ghostHour` band bump — defer.
8. **Surprise / contradiction vs older docs:** Midlife timing is **`RUN_MODES.midlife.secondsPerYear = 45`**, while `PLAYER.secondsPerYear = 60` and some design prose still mix the two. Rate estimates above use Midlife’s 45. Original §3C suggested grazePx **10** and score/coin crumbs only — this spec prefers **14** px band + **XP/speed/combo** because coins were heavily nerfed and a combo teaches the dodge loop better than fractional coins.

---

## 8. Implementation order

1. Add `src/data/nearMiss.js` + loader entry.  
2. Add `NAV.hasClearApproach` (+ optional debug draw shared with `NEAR_MISS.debug`).  
3. Wire scan + rewards + combo reset in `hurtPlayer`.  
4. HUD meter + popups + sfx + shake + reduced-motion guard.  
5. Score term in `computeRunScore`.  
6. Comfort Zone `dyn.lastHitAt` engagement hook behind `comfortCountsAsEngaged`.  
7. Playtest checklist; tune `bandPx` / `cooldownMs` only.  
8. Version bump + ROADMAP Part 3C checkbox.

**Done when:** Rami can feel a Close Call streak in a normal Midlife run, desk-camping does not farm XP, Comfort Zone Tax still punishes true AFK, and Tax Bracket / gem XP math stay coherent.
