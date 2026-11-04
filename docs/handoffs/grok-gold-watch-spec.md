# The Gold Watch (Midlife final boss) - Grok spec, Nov 3, 2026

Spec only. No gameplay code in this step.
Repo at write time: **V. 1.72.1** (build 169, "The Cold War Cowboy"), commit `7b0070b`.

Tone: funny, warm, never mean. Every knob in `src/data/*.js`. Phone-fair telegraphs respect `BOSS_ATTACK_TUNING.minTelegraphMs` (550) and the mortgage ring floor (650). Style matches `docs/handoffs/grok-boss-attacks.md`: data on `ENEMIES.goldWatch` + `BOSS_ATTACKS.goldWatch`, shared tuning, Spotlight + lower third, one telegraph at a time.

### Contents

0. Verified comparisons, DPS math, mismatches
1. Spawn age and HP
2. Attacks (numbers + phone math)
3. Phases
4. Swarm thinning (duel rules)
5. Still alive at 65 / Delayed Retirement / rewards
6. Tax Bracket
7. Stats to watch
8. Data objects (copy-paste)
9. Knob order (too hard / too easy)
10. Acceptance notes

---

## 0. Verified comparisons, DPS math, mismatches

### Live boss baselines (`src/data/enemies.js` + `bosses.js`)

| Boss | spawnAge | HP | speed | dmg | Attack notes (live) |
| --- | ---: | ---: | ---: | ---: | --- |
| Performance Review | 45 | 45 | 68 | 2 | charge; telegraph 700, cd 4200, first 1600 |
| 30-Year Mortgage | 52 | 110 | 64 | 2 | 2 rings, telegraph 850, cd 5200, expand 135 to 260, gap 70 deg |
| Midlife Crisis V8 | 60 | 200 | 118 | 3 | telegraph **750**, cd 4800, firstAttack **2200** (shipped; matches difficulty spec) |

User-stated comparisons match the repo on PR / Mortgage / V8 body stats and on the shipped V8 telegraph / first-delay. No mismatches there.

### Scaling that will hit the Watch

From `spawnBoss` in `main.js`:

`hp = round(baseHp * (1 + (level-1)*bossHpPerLevel) * (1 + (age-40)*bossHpPerYear) * (1 + tax(enemyHpMult)))`

Live: `bossHpPerLevel = 0.28`, `bossHpPerYear = 0.10`, `TAX_BRACKET.perLevel.enemyHpMult = 0.12`.

Contact: `hurtPlayer` adds `INTENSITY.hitDamageByAge` (+3 from age 62) + Tax `hitDamageAdd`. `PLAYER.hurtCooldownMs = 550`.

Cake: age 60 decade 25%, age 65 end 22% via `HEALING` (still fires on the dividend beat during the fight).

Midlife end: `RUN_MODES.midlife.endAge = 65`, 45 s/year. Retirement Party uses the `theReaper` spawn at `modeEndAge()` with Midlife rename. Delayed Retirement adds 5 years per shop rank to end age. **No swarm thinning exists today while a boss is alive** (spawns keep dripping). Gold Watch should add duel rules (section 4).

Boss chest: `PICKUPS.bossChest.tiers` + `coinMultPerTier` (1:4, 3:10, 5:18). Payout `coinValue * mult` then normal bank rules (`bankMult` 0.5, Side Hustle, Tax coinMult). Coin face at 55+ is **2** until 75.

### DPS estimate (single-target on a big boss)

Assumptions: Midlife age ~63, player stays in range most of the fight, Dad Joke damages bosses but does not stun/push them (live behavior), Coffee aims at nearest (boss usually wins), Spreadsheet needs the boss near orbit.

**Weak build** (level ~14 to 16, Coffee + maybe Dad Joke / one unlock, light meta):

- Coffee: damage ~2 to 3, fireEvery ~500 to 650 ms -> ~4 to 6 DPS
- Dad Joke: ~2 / 2.2 s -> ~0.9 (when boss in radius)
- Misc trickle -> ~1
- **Effective ~6 to 10 DPS** (use **8** for TTK)

**Decent build** (level ~18 to 22, Cold Brew or strong Coffee ranks, Remote and/or Podcast, Joke or No., some meta Espresso/Pension):

- Coffee Cold Brew path: damage ~5 to 8, fireEvery ~230 to 350 ms -> ~20 to 30 DPS alone
- Remote (out + back): ~4 to 8
- Podcast / Spreadsheet / Joke / No. together: ~6 to 12
- **Effective ~40 to 60 DPS** (use **50** for TTK)

Weapons that hit the Watch well: Coffee (primary), Remote (boomerang both ways), Podcast (pierce), Spreadsheet (if you hug mid-range), Dad Joke (damage yes). Word No. is mostly spacing. Bosses ignore Joke shove.

Player speed baseline **230** px/s (Comfortable Shoes / Espresso / Titanium Knees can push ~300 to 380; phone-fair math uses 230).

Typical max HP near 63: ~18 to 28 for a mid meta run (12 base + Employer Match + Checkups / Knees); cake at 60 already landed.

---

## 1. Spawn age and HP

### Spawn age: **63.5**

| Option | Window to age 65 | Verdict |
| --- | --- | --- |
| 63.0 | 90 s | Too much spare time; weak builds start finishing |
| **63.5** | **67.5 s** | Fits 45 to 60 s decent kill with ~10 s margin; weak cannot finish |
| 64.0 | 45 s | Decent often races the party; feels mean on phone |

**Pick 63.5.** Justification: decent TTK target 45 to 60 s sits inside a 67.5 s window; weak TTK (see HP) stays above 67.5 s so they meet Retirement Party with the Watch still alive. Birthday cake at 65 can still save a bloody clear. V8 at 60 has already taught skids; soft-intro GC from 50 has taught pings; the Watch is the gold sticker, not a third tutorial.

`ENEMIES.goldWatch.spawnAge = 63.5`. Add `"goldWatch"` to `RUN_MODES.midlife.bosses` (and Full Life list after V8 if you want it there later; Midlife-only is fine for v1).

### Base HP: **150**

Effective HP examples (Tax 0):

| Level | ageMult (63.5) | lvlMult | Effective HP | TTK at 50 DPS | TTK at 8 DPS |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 14 | 3.35 | 4.64 | ~2330 | ~47 s | **~291 s** |
| 18 | 3.35 | 5.76 | ~2890 | **~58 s** | ~361 s |
| 22 | 3.35 | 6.88 | ~3460 | ~69 s | ~432 s |

Level 18 to 20 at ~50 DPS lands in the **45 to 60 s** band. Level 22 melts slower because `bossHpPerLevel` taxes strong runs (same rule as V8). Weak 8 DPS never clears in 67.5 s. Tax Bracket multiplies further (section 6).

Body: speed **48** (lazy float toward arena center / player), damage **2**, size **64**, label `5:00`, name `The Gold Watch`.

Chest tier: **5** (same as V8) in `PICKUPS.bossChest.tiers.goldWatch = 5`.

---

## 2. Attacks (numbers + phone math)

Shared: one attack telegraph at a time. Edge pip if off-screen. `onScreenMargin: 40`. Hands pivot around the Watch center. **Minute / Hour damage is leading-edge only** (a thin slab on the forward face of the hand, not the full rectangle), so crossing behind after the edge passes is safe. i-frames: `hurtCooldownMs` 550.

### Phone-fair tip speed vs player

Player speed 230 px/s. Tangential tip speed = `length * degPerSec * pi/180`.

| Hand | length | deg/s | Tip speed | Vs player 230 |
| --- | ---: | ---: | ---: | --- |
| Minute | 280 | 70 | ~342 px/s | Outrun by cutting inside r < ~188 px, or cross behind the leading edge |
| Hour | 160 | 40 | ~112 px/s | Comfortably outrunnable even at the tip |

Crossing the minute beam: leading-edge thickness 14 px; at 150 px/s lateral close, dwell ~90 ms << 550 ms i-frames. Viable.

Age/Tax telegraph shrink still floors at `minTelegraphMs` 550 (hands) and **`minTelegraphMsWatch: 700`** for Alarm rings (new floor beside mortgage 650).

### 2.1 Minute Hand (`minuteHand`)

| Key | Value |
| --- | --- |
| telegraphMs | **800** |
| cooldownMs | **5200** |
| firstAttackDelayMs | **2000** |
| handLength | **280** |
| handWidth | **18** (visual) |
| leadingEdgeThickness | **14** (hurt box) |
| sweepDegPerSec | **70** |
| sweepArcDeg | **360** (full rotations until cooldown ends the attack after `sweepDurationMs`) |
| sweepDurationMs | **3200** |
| damage | **2** |
| telegraph look | Faint gold radial line + tick marks along the future arc; reduced motion: static line |

Dodge: move with the sweep at mid radius, duck inside, or cross behind the leading edge.

### 2.2 Hour Hand (`hourHand`) - phase 2+

| Key | Value |
| --- | --- |
| telegraphMs | **900** |
| cooldownMs | **7000** |
| handLength | **160** |
| handWidth | **28** |
| leadingEdgeThickness | **18** |
| sweepDegPerSec | **40** |
| sweepDurationMs | **4000** |
| damage | **2** |
| note | Opposite side of minute when both active (startAngle offset **180** deg) so the safe lane is readable |

### 2.3 Alarm (`alarm`) - phase 2+ (Mortgage cousin, gap fixed at 12 o'clock)

| Key | Value |
| --- | --- |
| telegraphMs | **950** (floor `minTelegraphMsWatch` 700) |
| cooldownMs | **8000** |
| ringCount | **2** |
| ringGapMs | **750** |
| expandSpeed | **120** |
| startRadius | **40** |
| maxRadius | **280** |
| ringHalfThickness | **16** |
| gapArcDeg | **75** |
| gapAnchor | **12 o'clock** (world up, not aimed at player; readable silhouette of a clock) |
| damage | **2** |

At expand 120 px/s, 75 deg gap arc length at r=200 is ~262 px of safe mouth; player crosses easily in the telegraph window.

### 2.4 Loose Gears (`gears`) - all phases

| Key | Value |
| --- | --- |
| telegraphMs | **600** |
| cooldownMs | **6000** |
| firstDelayInPhase | **1200** after phase enter (also usable as filler between hands) |
| gearCount | **4** (phase 3: **6** via `lastMinute.gearCount`) |
| gearSpeed | **160** |
| gearSize | **18** |
| gearLifeMs | **4500** |
| bounce | true (world / prop bounce; no player knockback) |
| damage | **1** |

### Contact

Body bump damage **2** (+ age/Tax add). Watch floats; it does not charge like HR.

### Attack picker (suggested weights)

Phase 1: minuteHand 60, gears 40.
Phase 2: minuteHand 35, hourHand 25, alarm 25, gears 15.
Phase 3: same weights; apply `lastMinute` speed/cooldown mults.

---

## 3. Phase thresholds

| Phase | HP frac | Name | Kit | Speed-ups |
| --- | --- | --- | --- | --- |
| 1 | 1.00 to 0.60 | **TICKING** | Minute Hand + Gears | baseline |
| 2 | 0.60 to 0.25 | **OVERTIME** | + Hour Hand + Alarm | `phase2.cooldownMult: 0.92`, sweep/expand `speedMult: 1.08` |
| 3 | under 0.25 | **LAST MINUTE** | Everything | `phase3.cooldownMult: 0.80`, `speedMult: 1.22`, gearCount 6, tick SFX interval `tickMs: 280` (from 500), banner once |

Hands freeze at **5:00** on death (visual win beat) before chest drops. Phase banners once each: short, warm.

---

## 4. Swarm thinning during the fight

Goal: a duel with light office weather, not another 60 to 61 wall.

While `goldWatch` is alive (`boss_alive_at_death` path already exists):

| Knob | Value | Why |
| --- | --- | --- |
| `swarm.spawnDelayMult` | **1.80** | Spawns ~44% less often |
| `swarm.packSizeMult` | **0.40** | Smaller packs |
| `swarm.maxOnScreenMult` | **0.45** | Crowd cap softens |
| `swarm.pauseKinds` | `["groupChat", "mathWorksheet", "calendarInvite"]` | No ping spirals / charges stealing the silhouette |
| `swarm.pauseEvents` | **true** | No Tax Season style set pieces |
| `swarm.eliteChanceMult` | **0.35** | Fewer salad bribes mid-duel (cake at 65 still ok) |

When the Watch dies or despawns at retirement, restore normal swarm on the next spawn tick. Do **not** delete existing fodder instantly (no Quiet Hour free clear); let them thin naturally.

Intern deliveries: suppress while Watch alive (same as other bosses / Lounge rules). Lounge can stay closed (`suppressBoss` already).

---

## 5. Still alive at 65 / Delayed Retirement / rewards

**Agree with Rami's proposal, with two polish bits.**

1. **Clocking out still wins the run.** At `modeEndAge()`, Retirement Party still spawns. Walking up clears Midlife (`retired` achievement / Full Life unlock) even if the Watch lives. Line: *"You clocked out. The Watch is still ticking in the gift bag."* Despawn or inert the Watch when the party is collected (no post-clear fight).

2. **Only a kill earns the keepsake suite:**
   - Achievement e.g. `goldWatchBeat` "On The Hour" (reward **12** coins, in line with other boss badges).
   - Keepsake flag on meta (title flair / Spotlight sticker; implementer picks light presentation).
   - Bonus 401(k): **+35** coins through `bankCoins(35)` equivalent after kill (before Side Hustle / Tax coinMult stacking as with other grants). Grounding: V8 tier-5 chest at face 2 pays `2 * 18 = 36` pre-bank (~18 after `bankMult` 0.5). Flat +35 banked-style grant is "HR bought the nice watch" without doubling the chest. Chest itself still drops (tier 5) on kill as usual.

3. **Delayed Retirement:** keep `spawnAge: 63.5` fixed. Overtime (end 70 / 75 / 80) simply gives more calendar time to finish the duel after a failed first try. If you walk into the Retirement Party while the Watch lives, you still clear; the keepsake stays locked until a future run kills it. Do not hard-require the kill to retire.

4. Defeat visual: hands snap to **5:00**, tick stops, chest drops. Defeat line: *"Hands at 5:00. You made it."*

---

## 6. Tax Bracket scaling

Use the **existing** heat hooks; do not invent a second HP curve.

| Bracket | enemyHpMult total | Example eff. HP at L18 base 150 | hitDamageAdd (rounded in hurt) | Notes |
| ---: | ---: | ---: | ---: | --- |
| 0 | 0% | ~2890 | 0 | baseline |
| 1 | +12% | ~3240 | +0.5 -> 1 often | |
| 2 | +24% | ~3580 | +1 | |
| 3 | +36% | ~3930 | +1 or 2 | |
| 4 | +48% | ~4280 | +2 | |
| 5 | +60% | ~4620 | +2 or 3 | Full Audit duel |

Also live: spawnFaster / packAdd still apply but section 4 mults sit on top (duel first). Telegraph age/Tax cuts still floor at 550 / 700. Attack `speedMult` from `BOSS_ATTACK_TUNING` caps at 1.45 as today.

Optional Watch-only (only if Tax 5 melts phone players after ship): `goldWatch.taxCooldownMultPerBracket: -0.02` clamped so cooldowns never drop below 70% of base. **Default off** (`0`); prefer HP via heat.js alone first.

---

## 7. Stats to watch after ship

Existing: `boss_alive_at_death`, killer, age_reached, character, tax_bracket, device, pings_hit, view_zoom.

**Targets** among Midlife runs that reach spawn age (>= 63.5), next ~40 qualified runs:

| Metric | Target |
| --- | --- |
| Kill rate (Watch died before clear/death) | **40 to 60%** |
| Deaths with `boss_alive_at_death = goldWatch` | **25 to 40%** of deaths past 63 (not 60%+) |
| Clears with Watch still alive (clocked out, no keepsake) | **20 to 35%** of clears (badge of survival, not failure) |
| Clears with Watch kill | the rest of clears; rising with meta |
| Median fight duration (spawn to kill) | **45 to 65 s** |
| Phone kill rate within ~10 points of desktop among spawn-reachers | gap ok if <15 points |

Add if easy: `gold_watch_phase_reached` (1/2/3), `gold_watch_killed` bool on the runs row.

---

## 8. Data objects (copy-paste)

### `ENEMIES.goldWatch` in `src/data/enemies.js`

```js
goldWatch: {
  name: "The Gold Watch",
  label: "5:00",
  seniorLabel: "5:00",
  tex: "goldWatch",          // art TBD; placeholder ok
  spawnAge: 63.5,
  speed: 48,
  hp: 150,
  damage: 2,
  size: 64,
  color: 0xf5c542,
  scale: 1
}
```

Also: push `"goldWatch"` into `BOSS_KINDS` and `RUN_MODES.midlife.bosses`. `PICKUPS.bossChest.tiers.goldWatch = 5`.

### `BOSS_ATTACK_TUNING` additions

```js
minTelegraphMsWatch: 700,   // Alarm rings; hands still use minTelegraphMs 550
```

### `BOSS_ATTACKS.goldWatch`

```js
goldWatch: {
  bannerTitle: "TIME'S UP",
  bannerSub: "Dodge the hands. Gap at 12.",
  firstAttackDelayMs: 2000,
  recoverMs: 280,
  // Phase HP fracs (enter when hp/hpMax crosses below)
  phases: {
    ticking:    { id: "ticking",    name: "TICKING",     enterFrac: 1.00, bannerSub: "Minute Hand on the move." },
    overtime:   { id: "overtime",   name: "OVERTIME",    enterFrac: 0.60, bannerSub: "Hour Hand punched in. Alarm's live." },
    lastMinute: { id: "lastMinute", name: "LAST MINUTE", enterFrac: 0.25, bannerSub: "Everything faster. Breathe." }
  },
  phase2: { cooldownMult: 0.92, speedMult: 1.08 },
  phase3: { cooldownMult: 0.80, speedMult: 1.22, gearCount: 6, tickMs: 280 },
  tickMs: 500,                 // ambient tick SFX while alive
  defeatHandsAt: "5:00",
  killBonusCoins: 35,          // banked via same path as other grants
  minuteHand: {
    telegraphMs: 800, cooldownMs: 5200,
    handLength: 280, handWidth: 18, leadingEdgeThickness: 14,
    sweepDegPerSec: 70, sweepDurationMs: 3200, sweepArcDeg: 360,
    damage: 2, weightPhase1: 60, weightPhase2: 35
  },
  hourHand: {
    telegraphMs: 900, cooldownMs: 7000,
    handLength: 160, handWidth: 28, leadingEdgeThickness: 18,
    sweepDegPerSec: 40, sweepDurationMs: 4000,
    startAngleOffsetDeg: 180,
    damage: 2, weightPhase2: 25
  },
  alarm: {
    telegraphMs: 950, cooldownMs: 8000,
    ringCount: 2, ringGapMs: 750,
    expandSpeed: 120, startRadius: 40, maxRadius: 280,
    ringHalfThickness: 16, gapArcDeg: 75,
    gapAnchor: "twelve",       // fixed 12 o'clock
    damage: 2, weightPhase2: 25
  },
  gears: {
    telegraphMs: 600, cooldownMs: 6000,
    gearCount: 4, gearSpeed: 160, gearSize: 18, gearLifeMs: 4500,
    damage: 1, weightPhase1: 40, weightPhase2: 15
  },
  swarm: {
    spawnDelayMult: 1.80,
    packSizeMult: 0.40,
    maxOnScreenMult: 0.45,
    eliteChanceMult: 0.35,
    pauseKinds: ["groupChat", "mathWorksheet", "calendarInvite"],
    pauseEvents: true
  }
}
```

### Player-facing strings (short)

| Moment | Copy |
| --- | --- |
| Spotlight / toast | The Gold Watch |
| Banner | TIME'S UP / Dodge the hands. Gap at 12. |
| Phase 2 | OVERTIME / Hour Hand punched in. Alarm's live. |
| Phase 3 | LAST MINUTE / Everything faster. Breathe. |
| Defeat | Hands at 5:00. You made it. |
| Clocked out with Watch alive | You clocked out. The Watch is still ticking in the gift bag. |
| Lower third on spawn | HR sent a retirement gift. It is counting down. |

Achievement: **On The Hour** - "Stop The Gold Watch at 5:00." reward 12.

---

## 9. Knob order (small, reversible)

**Too hard** (turn in order):

1. `swarm.packSizeMult` 0.40 -> 0.30; raise `spawnDelayMult` 1.80 -> 2.10
2. `minuteHand.sweepDegPerSec` 70 -> 60; `leadingEdgeThickness` 14 -> 12
3. `phase3.speedMult` 1.22 -> 1.12; `cooldownMult` 0.80 -> 0.88
4. Base `hp` 150 -> 130
5. Alarm `expandSpeed` 120 -> 105; `gapArcDeg` 75 -> 90
6. Only then cut body/hand damage 2 -> 1

**Too easy:**

1. Base `hp` 150 -> 175
2. `minuteHand.sweepDegPerSec` 70 -> 80
3. `swarm.packSizeMult` 0.40 -> 0.55; re-allow `calendarInvite`
4. `phase3.speedMult` 1.22 -> 1.30
5. Alarm `gapArcDeg` 75 -> 60

Do not touch `HEALING` cake or V8 numbers in this pass.

---

## 10. Acceptance notes (Codex / Claude)

1. Spawn once at 63.5 in Midlife; Spotlight or boss toast; HP uses existing level/age/Tax formula.
2. Leading-edge-only hand damage; crossing behind works; telegraphs never under floors.
3. Phases trip once at 60% / 25% with banners; Last Minute speeds attacks and ticks.
4. Swarm mults + pauseKinds while alive; restore after death/despawn.
5. Kill: hands to 5:00, tier-5 chest, +35 coin grant, achievement. Clear at endAge without kill: retirement success, no keepsake, watch line fires.
6. Dad Joke damages, no stun. Close Calls: no credit from standing in hand telegraphs (same spirit as skid rules).
7. `?forceBoss=goldWatch` for QA. Phone playtest short side ~390: Alarm gap readable, minute tip outrunnable by cutting in.
8. Add to `boss_alive_at_death` kind set.

Pending after Rami approval, art, implementation, and a stats slice: mark the grok-changes entry **[done]** with version.
