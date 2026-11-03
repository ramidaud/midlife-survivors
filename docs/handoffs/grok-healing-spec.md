# Grok healing spec: milestones, Desk Salad, and Interns (Nov 3, 2026)

Answers `docs/handoffs/grok-healing.md`, plus the **Interns addendum** (Rami + TJ, Nov 3) and the **Lounge shop** steering (TJ: real Break Room counter, not a roaming stand). Spec only. No gameplay code in this step.
Repo verified at **V. 1.60.0** (`src/data/version.js`, build 141, codename After Hours).

Tone: funny, warm, never mean. Player-facing strings stay short. Every new knob lives in `src/data/*.js`. Heals go through `healAmt()` so Tax Bracket still bites.

### Contents

0. Fact check (user brief vs code)
1. Milestone heals (birthdays)
2. Healthy-food drop (Desk Salad)
3. Balance check (maxed meta, ages 60 to 65)
4. Number tables (current vs proposed)
5. Playtest plan
6. Implementation notes (Codex-friendly)
7. Headline numbers (proposed)
8. Addendum: Interns (deliveries + The Lounge shop + heal budget)

---

## 0. Fact check (user brief vs code)

| Claim | Code truth | Verdict |
| --- | --- | --- |
| Leftover Pizza +2 HP | `PICKUPS.pizza.heal = 2` in `src/data/pickups.js`. Collect uses `healAmt(PICKUPS.pizza.heal)`. | **Match.** Stale comments in `main.js` / `ui.js` / `breakables.js` header still say +3. Fix comments when implementing. |
| Pizza from plants, printers 15%, vending 75%, coolers 35% | `BREAKABLES.props.*.loot.pizza` in `src/data/breakables.js`: printer 0.15, vending_machine 0.75, water_cooler 0.35, **plant 0.45** (not guaranteed). Campus plants also have a parallel loot roll in `main.js` (~45% pizza). | **Mostly match.** Plants are a **45%** roll, not every smash. |
| +1 HP per level up | `main.js` level-up: `healAmt(1)`. Comment says was +2. | **Match.** Stale tip in `ui.js` still says level up +2 HP. |
| Annual Checkup +3 max and +4 HP, 3 ranks | `UPGRADES` id `annualCheckup`, `maxRank: 3`, `maxHp += 3`, `s.heal = 4` (applied via `healAmt` on pick). | **Match.** |
| Healthy Boundaries +1 every other pulse | `WEAPONS.wordNo.healthyHealEvery = 2`, `healthyHealAmt = 1`. Pulse cadence `fireEveryMs: 3200`. | **Match.** Roughly +1 HP per 6.4 s while below max (~9 HP/min if always hurt). |
| Shop revives to half HP | `META_SHOP` `secondOpinion` maxRank 2. On fatal hit: `healAmt(Math.ceil(stats.maxHp / 2))`. | **Match.** |
| Starting max HP 12 | `PLAYER.maxHp = 12`. | **Match.** Employer Match shop adds +2 max HP per rank at run start (up to +12). |
| Core run 40 to 65 at 45 s/year (~19 min) | `RUN_MODES.midlife.secondsPerYear = 45`, endAge 65. `PLAYER.secondsPerYear = 60` is Full Life / default, Midlife overrides. | **Match for Midlife.** Do not use `PLAYER.secondsPerYear` for Midlife math. |
| Tax Bracket: -10% heal per bracket, floor 40% | `TAX_BRACKET.perLevel.healEfficacy = 0.10`. `healAmt`: `n * max(0.4, 1 - tax(...))` with stochastic rounding. | **Match.** |
| Elites 2% at 40 to 14% at 65, red glow, drop 4 gems + 2 coins | `INTENSITY.elites` in `src/data/swarms.js`: `chanceByAge` [[40,0.02]...[65,0.14]], `gems: 4`, `coins: 2`. | **Match.** |
| Retirement at 80 full heal | Full Life only: birthday/retire path sets `hp = stats.maxHp` (not through `healAmt`). Midlife ends ~65. | Brief mentioned it; leave as-is. |

**Files that exist (all present):** `pickups.js`, `player.js`, `swarms.js`, `breakables.js`, `heat.js`, `meta.js`, `upgrades.js`, `weapons.js`, `modes.js`, `enemies.js`. Campus layout lives in `src/data/start-area.js` (`START_AREA_LAYOUT`), not `stages.js`.

**Where new numbers should live:** `src/data/healing.js` (`HEALING`: milestones, salad display helpers, shared budget) and `src/data/interns.js` (`INTERNS`: deliveries + Lounge). Keep pizza heal on `PICKUPS.pizza`. Keep elite salad chance on `INTENSITY.elites`. Keep breakable pizza chances on `BREAKABLES`. Lounge anchor uses district id `breakroom` from `START_AREA_LAYOUT`.

---

## 1. Milestone heals (birthdays)

### Design

Hook the **same 5-year beat** as the 401(k) dividend (`PICKUPS.coin401k.dividendEveryYears = 5`). Ages **45, 50, 55, 60, 65** (and 70+ on Overtime / Full Life using the same table).

Why not every year: yearly cake would erase late-game pressure for a maxed TJ. Why not decades only: TJ asked for milestones that extend runs; every 5 years is ~3m45s apart in Midlife, which feels like a coffee break, not a free win.

### Amount (scales with max HP)

Fracs trimmed in the Interns addendum so deliveries and Lounge pastry fit the heal budget.

| Age | Heal | Notes |
| --- | --- | --- |
| 45, 55 | `max(2, floor(maxHp * 0.18))` | Standard birthday |
| 50, 60 | `max(3, floor(maxHp * 0.25))` | Decade cake |
| 65 (and Midlife clear age) | `max(3, floor(maxHp * 0.22))` | Retirement-adjacent breath |
| 70, 75, 80, ... | Decade → 25%, other multiples of 5 → 18% | Full Life / Overtime |

Always run through **`healAmt()`**. Never exceed `maxHp` (no overheal on milestones).

Examples at Tax Bracket 0:

- Fresh run maxHp 12 → age 45 heals 2; age 50 heals 3.
- Maxed Employer Match (24) → age 45 heals 4; age 50 heals 6.
- Match + 3× Checkup (~33) → age 45 heals 5; age 50 heals 8.

### Banner copy (short)

Use `showLowerThird("reward", ...)` like the dividend.

- Badge: `HAPPY BIRTHDAY`
- Text standard: `The breakroom sprang for cake. +{n} HP.`
- Text decade: `Decade cake. Someone remembered. +{n} HP.`
- Short pip: `+{n} HP`

If already at full HP: toast `Full already. Save some frosting.` and grant **nothing**.

### Data shape (`src/data/healing.js`)

```js
window.HEALING = {
  milestones: {
    everyYears: 5,
    firstAge: 45,
    fracNormal: 0.18,
    fracDecade: 0.25,
    minNormal: 2,
    minDecade: 3,
    bannerBadge: "HAPPY BIRTHDAY",
    bannerNormal: "The breakroom sprang for cake. +{n} HP.",
    bannerDecade: "Decade cake. Someone remembered. +{n} HP.",
    bannerFull: "Full already. Save some frosting."
  },
  budget: {
    skipInternAboveHpFrac: 0.75,
    windowMs: 20000,
    maxBigHealsInWindow: 2
  }
};
```

Implementation note: fire beside the existing dividend block in `main.js`. One function `tryMilestoneHeal(age)`.

---

## 2. Healthy-food drop (working name: Desk Salad)

### Fantasy

Pizza is breakroom grease from furniture. Salad is the rare "I packed lunch" drop from tough coworkers (elites). Same magnet family as pizza so phones never force a suicide detour.

### Who drops it

| Source | Chance | Why |
| --- | --- | --- |
| Elites on death | **45%** base (`INTENSITY.elites.saladChance`) | Trimmed from 55% in addendum so interns fit |
| Pity | Guaranteed if **3** elites died with no salad | Stops dry streaks at 60+ |
| Optional spice (off by default) | `snackAttack` death **0%** (`saladFromDonut`) | Keep off until playtest asks |

Do **not** put salad on every trash mob.

### How it differs from pizza

| | Pizza | Desk Salad |
| --- | --- | --- |
| Source | Breakables | Elites (combat) |
| Heal style | Flat **+2** instant | **% of max HP**: `max(3, floor(maxHp * 0.22))` |
| Overheal | No | No for v1 |
| Lifetime | Until picked | **14 s** then wilt |
| Magnet | Same as gems/pizza | Same + **1.15×** pull speed |
| Size / color | 20, warm red/orange | **24**, sage `0x83A89A` |
| Cap on ground | Soft | **Max 2**; extras become 1 gem |

Always `healAmt()` on collect.

### Data

`PICKUPS.salad` in `pickups.js`:

```js
salad: {
  name: "Desk Salad",
  healFrac: 0.22,
  healMin: 3,
  size: 24,
  color: 0x83A89A,
  lifeMs: 14000,
  magnetSpeedMult: 1.15,
  maxOnGround: 2
}
```

`INTENSITY.elites` additions in `swarms.js`:

```js
saladChance: 0.45,
saladPityEvery: 3,
saladFromDonut: 0.00
```

### Banner / float text

- Float: `SALAD +{n}`
- Optional lower third if heal >= 6: badge `DESK SALAD`, text `Actual vegetables. +{n} HP.`

### Phone fairness

Spawn at elite death, nudge 8 to 16 px toward a NAV-reachable open cell if crowded. Same magnet as pizza. Distinct bowl silhouette. Last 3 s fade before wilt.

---

## 3. Balance check (maxed meta, ages 60 to 65)

### Rough heal budget (Tax Bracket 0, Midlife)

Assume strong TJ: Employer Match 6 (maxHp start 24), often Checkup ranks (maxHp ~30), Healthy Boundaries online.

| Source | Est. HP/min while hurt (60 to 65) | Notes |
| --- | --- | --- |
| Level-ups | ~1.5 to 3 | +1 each |
| Healthy Boundaries | ~0 to 9 | 1 per 6.4 s while below max |
| Pizza (breakables) | ~2 to 6 | Map-dependent |
| Checkup / boosts | Burst only | Not per minute |
| **Proposed milestones** | ~1.2 to 2.0 amortized | 18% / 25% fracs |
| **Proposed salad** (45%) | ~2 to 6 | Elites ~11%+ at 60; pity every 3 |
| **Proposed intern snacks** | ~1 to 3 | Age-thinned; skip if HP high; none in bosses |

**Current total sustain** while trading hits: roughly **6 to 18 HP/min**.

**Incoming:** at 62+, `hitDamageByAge` adds +3; elites add +1. Skilled kiting ~8 to 15 HP/min taken. TJ's pain is dry spells when pizza is across a crowd.

**Proposed combined extra** (milestones + salad + intern snacks): about **+5 to 9 HP/min** in bloody stretches at 60 to 65. Soft cap: **extra sustain should not hold skilled Bracket-0 players above ~70% average HP across 60 to 65**. Interns thin with age; salad carries late combat recovery; birthdays stay rare breaths. Lounge pastry is optional spend with stock limits (not free sustain).

**Shared heal budget:** if HP ≥ `HEALING.budget.skipInternAboveHpFrac` (0.75), intern snacks become buff-only or skip. If two of {birthday, salad, intern snack, Lounge heal buy} landed in the last `windowMs` (20 s), defer the next intern snack.

### Ordered knobs if too easy (turn these first)

1. Intern snack heal / cadence / age thin (`INTERNS.delivery.*`)
2. Lounge: raise heal-item prices or cut stock; shorten open window
3. `HEALING.milestones.fracNormal` 0.18 → **0.12**; `fracDecade` 0.25 → **0.18**
4. `PICKUPS.salad.healFrac` 0.22 → **0.15**; `healMin` 3 → **2**
5. `INTENSITY.elites.saladChance` 0.45 → **0.30**; pity 3 → **4**
6. `PICKUPS.salad.lifeMs` 14000 → **9000**
7. Only then touch pizza or Boundaries

If **too hard** for TJ: raise saladChance or early-age intern cadence before raising milestone fracs.

### Tax Bracket

No special case. Heals use `healAmt`. Buffs are not cut by healEfficacy.

---

## 4. Number tables (current vs proposed)

### Heals and pickups

| Key | Current | Proposed | File |
| --- | --- | --- | --- |
| `PICKUPS.pizza.heal` | 2 | 2 (unchanged) | `pickups.js` |
| `PICKUPS.salad.*` | (none) | see §2 | `pickups.js` |
| Level-up heal | hard-coded `1` | `HEALING.levelUpHeal: 1` | `healing.js` |
| `WEAPONS.wordNo.healthyHealEvery` / `Amt` | 2 / 1 | unchanged | `weapons.js` |
| Annual Checkup | +3 max, heal 4, maxRank 3 | unchanged | `upgrades.js` |
| Second Opinion | half maxHp via `healAmt` | unchanged | `meta.js` |
| `PLAYER.maxHp` | 12 | 12 | `player.js` |
| `TAX_BRACKET.perLevel.healEfficacy` | 0.10 (floor 40%) | unchanged | `heat.js` |
| `HEALING.milestones.*` / `budget.*` | (none) | see §1 | **new** `healing.js` |
| `INTERNS.*` | (none) | see §8 | **new** `interns.js` |

### Breakables (pizza chances): unchanged

printer 0.15, vending 0.75, cooler 0.35, plant 0.45 in `breakables.js`.

### Elites

| Key | Current | Proposed | File |
| --- | --- | --- | --- |
| `INTENSITY.elites.chanceByAge` | 2%→14% | unchanged | `swarms.js` |
| `INTENSITY.elites.gems` / `coins` | 4 / 2 | unchanged | `swarms.js` |
| `INTENSITY.elites.saladChance` | (none) | **0.45** | `swarms.js` |
| `INTENSITY.elites.saladPityEvery` | (none) | **3** | `swarms.js` |

### Modes / clock

`RUN_MODES.midlife.secondsPerYear = 45` for Midlife timing. `PLAYER.secondsPerYear = 60` is Full Life.

---

## 5. Playtest plan

### Setup

1. Midlife, Tax Bracket 0, **401(k) shop maxed** (TJ). Second Opinion ranks 2.
2. Organic 40→55, then `?dev=1` age jump tools for Lounge / late checks.
3. Second run Tax Bracket 3.

### Watch

| Window | Look for |
| --- | --- |
| 40 to 44 | No Lounge yet (Break Room locked). Intern deliveries OK in Lobby/Bullpen. |
| 45 to 55 | Break Room unlock banner; Lounge open windows; first salad feels special; age 45 cake |
| 60 to 65 | Intern snacks rare; salad + pizza carry; Lounge not a safe AFK nest; boss pressure remains |

### "Too easy" signals (any two → turn knobs)

- HP stays **above 70%** for most of a continuous 60→65 segment (excluding 3 s after a birthday).
- Reach 65 without Second Opinion and without a sub-30% HP moment after age 58.
- Death rate in a 5-run TJ Bracket-0 sample drops to **0/5** where before it was ~1 to 2/5.
- More than **3** salads on the ground, or salads ignored because HP is always full.
- Birthday cakes alone recover a full swarm.
- Interns snack more than about once per minute after age 58.
- Player AFKs in the Lounge through a swarm with no threat (anti-safe-room failed).
- Lounge heal stock bought every visit and erases late tension.

### Acceptance checklist (Codex / Claude)

1. `healing.js` and `interns.js` loaded from `index.html`.
2. All milestone, salad, intern snack, and Lounge heal buys call `healAmt`.
3. Ages 45/50/55/60/65 each fire milestone once per crossing.
4. Elite salad + pity; ground cap 2; wilt at `lifeMs`.
5. Magnet pulls salad; phone-fair.
6. Tax Bracket 5: heals clearly smaller.
7. Fix stale +3 pizza / +2 level tips.
8. Dev: force salad, birthday, delivery, Lounge open.
9. No leaderboard formula change required.
10. Playtest notes before marking grok-changes **[done]**.
11. Interns path with `NAV.steer` / `NAV.isOpen`; untargetable; non-blocking; flee on bump.
12. Lounge: counter in `breakroom`; opens on promotion schedule; pause-at-counter rules in §8.2; anti-safe-room tests pass.
13. Heal budget: intern snack skipped at high HP; deferred after recent big heals.

---

## 6. Implementation notes (Codex-friendly)

1. Add `src/data/healing.js` and `src/data/interns.js`; script-tag near `pickups.js` / `items.js`.
2. Milestones: beside dividend age-step in `main.js`.
3. Salad: on elite death next to gem/coin drops; group + magnet + wilt.
4. Interns module `src/interns.js`: delivery AI, Lounge state machine, DOM shop modal.
5. Sprite: procedural intern + counter art until hand pixel lands.
6. Do not change boss HP, spawn rates, or Tax Bracket numbers in this pass.
7. Optional telemetry: `saladPick`, `milestoneHeal`, `internDelivery`, `loungePurchase`.

---

## 7. Headline numbers (proposed, after Interns + Lounge)

- Birthday every **5** years from **45**: heal **18%** max HP (min 2); decades **25%** (min 3); via `healAmt`.
- Desk Salad from elites **45%** (pity every **3**): heal **22%** max HP (min 3); **14 s** lifetime; max **2** on ground.
- **Intern deliveries:** age-thinned snacks/coffee/buffs; skip heal above **75%** HP; none during bosses or Comfort Zone Tax.
- **The Lounge:** Break Room (`breakroom`) counter shop, staffed by an intern; unlocks with the age-**45** Break Room promotion; visit windows tied to promotion beats; pause only while at the counter with a fair bubble (see §8.2).
- Shared soft cap: defer intern snacks if two big heals landed in **20 s**.
- Pizza, level-up +1, Checkup, Boundaries, revives, Tax Bracket: **unchanged**.

---

## 8. Addendum: Interns (deliveries + The Lounge)

Request from Rami and TJ: roaming **interns** (playtesters as office interns in fiction). **Not playable.** They bring snacks, coffee, short buffs, and staff **The Lounge** (the campus Break Room). Warm tone: if a Bill bumps a runner, they yelp and jog off. No gore.

### 8.0 Coin economy facts (grounds Lounge prices)

| Fact | Where |
| --- | --- |
| Face value by age: 1 (40+), 2 (55+), 3 (75+) | `PICKUPS.coin401k.compoundTiers` |
| Banks **half** face value (`bankMult: 0.5`), plus Side Hustle (+15%/rank) and Tax Bracket `coinMult` | `bankCoins()` in `main.js` |
| Regular enemies: **6%** coin drop | `dropChance: 0.06` |
| Elites: **2** coins | `INTENSITY.elites` |
| Collect adds to **both** `runCoins` and `meta.coins` | `collectCoin` |
| Boss chest multipliers (PR×4, Mortgage×10, Midlife Crisis tier5×18) | `PICKUPS.bossChest.coinMultPerTier` |

Rough Midlife purse by the mid 50s for a strong Side Hustle run: about **40 to 150** banked coins. Lounge prices stay **6 to 28** so a visit is a treat, not a wiped 401(k).

Spend rule: deduct from **`meta.coins` and `runCoins`** equally (clamp at 0). No third currency.

### 8.0b Campus location fact (The Lounge)

In `START_AREA_LAYOUT` (`src/data/start-area.js`):

- District id: **`breakroom`**
- Name: **Break Room and Water Cooler**
- Floor material: `kitchen`
- Promotion unlock: age **45** phase: areas `breakroom`, `parking`; message *"You've earned a break. Break Room and Parking Lot access granted."*
- Lobby + Bullpen start open at 40; later unlocks 50 server/conference, 55 executive, 60 wellness.

**Recommendation:** brand the shop fictionally as **The Lounge**, implemented as a staffed **counter hotspot inside `breakroom`**. Do not use a free-roaming merchant stand. If Break Room is still gated (age < 45), Lounge is closed. On maps without start-area (fallback office), skip Lounge or pin a temporary counter to a breakables water-cooler prop; prefer Campus.

Anchor data: `INTERNS.lounge.districtId: "breakroom"` plus optional `counterLocal` offset in layout space (tunable; implementer picks a counter prop near the water cooler once art is inspected).

---

### 8.1 Deliveries (roaming intern with a care package)

Unchanged fantasy from the first addendum draft; numbers below are canonical.

#### Behavior

1. Spawn from a NAV-open edge; **`NAV.steer` toward the player**. Speed `PLAYER.speed * 0.85`.
2. Untargetable, non-blocking (no weapon hits, no XP, walk-through).
3. Handoff within **`handOffRadius` 70**. If player is crowded, wait up to `waitMs` 4000 or **drop parcel** (pizza-like magnet) at a clear cell, then leave.
4. Enemy overlap → flee 0.6 s → despawn with `"Ack! HR paperwork!"` / `"{name}: Nope!"`. No gibs.
5. **Suppressed** while: boss alive, `levelUpOpen`, Lounge browse open, pause/title, or Comfort Zone Tax active (`runElapsedMs < dyn.comfortUntil`).
6. Max **1** delivery intern on map. Path on `NAV.isOpen` only.

#### Cadence (scarcer with age)

| Age band | Mean attempt interval |
| --- | --- |
| 40 to 49 | **55 s** |
| 50 to 57 | **75 s** |
| 58 to 65 | **110 s** |
| 66+ | **140 s** |

`armAfterMs: 45000`. Jitter ±25%.

#### Payload weights

| Id | Weight | Effect |
| --- | --- | --- |
| `snack` | 40 | Heal `max(2, floor(maxHp * 0.12))` via `healAmt` |
| `coffee` | 30 | Speed 1.18× for 8 s |
| `focus` | 15 | Cooldown ×0.88 for 8 s |
| `magnet` | 15 | Magnet ×1.35 for 10 s |

If HP ≥ 0.75: non-heal payloads only.

#### Roster (placeholders until Rami pastes playtester nicknames)

`Intern Casey`, `Intern Jordan`, `Intern Sam`, `Intern Riley`, `Intern Quinn` with titles like Coffee Runner / Snack Scout. **Never hard-code real names in logic;** only `INTERNS.roster`.

---

### 8.2 The Lounge (Break Room counter shop)

Replaces the free-roaming pop-up stand idea. An intern staffs the Break Room counter when the Lounge is **OPEN**.

#### (a) Pause recommendation while browsing

**Pick: hard pause, but only while the player is in the counter browse radius, with a short "Facilities bubble" that shoves non-boss enemies out of a small radius on open.**

Why this and not full VS-anywhere pause or slow-mo:

- **Phone fairness:** mid-run shops on a phone need stable tap targets; slow-mo still lets contact damage sneak through fat-finger lag.
- **VS Merchant precedent:** Vampire Survivors pauses the run while the merchant UI is up. Players already understand that contract.
- **Fairness vs AFK:** pause is allowed **only at the counter** (not anywhere in Break Room). Leaving the radius auto-closes the UI and unpauses. Opening applies `bubblePushRadius` (~160 px) once so you do not pause inside a donut pile. Bosses are never shoved; if a boss is alive, Lounge stays **CLOSED**.
- Slow-mo rejected: harder to tune, worse on low-FPS phones, still punishable by sudden packs.

Implementation flags: sibling to `levelUpOpen`, e.g. `loungeOpen`. Physics pause like level-up. `dyn.lastHitAt` does **not** reset on browse (opening shop is not a "hit"; see anti-safe-room).

#### (b) How often you can visit (grounded in promotions)

**Promotion** here means the existing Campus unlock phases in `START_AREA_LAYOUT.promotions.phases` (age 45 Break Room, 50 Server/Conference, 55 Executive, 60 Wellness), announced via the existing lower-third door message.

| Visit window | When it arms | Open duration | Stock |
| --- | --- | --- | --- |
| Lounge debut | Age **45** Break Room promotion fires (district unlocked) | **35 s** open | Full catalog stock |
| Restock visit | Each later promotion (50, 55, 60) | **30 s** | Fresh stock (Band-Aid still once/run) |
| Level bonus window | Optional: player level hits **8, 12, 16** after Lounge unlocked | **25 s** | Reduced stock (pastry 1, no Quiet Hour) |

Also require: no boss alive, not in Comfort Zone Tax, not already on cooldown.

`INTERNS.lounge.cooldownMs: 90000` after a window ends before another level-bonus window can arm (promotion windows ignore this cooldown once each).

**How the player learns it is open:**

1. Lower third: badge `THE LOUNGE`, text `Break Room counter is open. Intern on register.`
2. Brief map pip / NAV edge hint optional: cream arrow toward `breakroom` for 6 s (`showArrowMs: 6000`).
3. Intern at counter bobs; counter has a small OPEN placard sprite.
4. If player is far, one tip after 8 s: `The Lounge is open in the Break Room.`

#### (c) Anti-safe-room rules (Break Room is not a nest)

All tunable under `INTERNS.lounge.safety`:

1. **Timed shutter:** counter only accepts browse during `openMs`. When the timer ends, placard flips CLOSED; browse forced shut.
2. **Enemies still path in:** do **not** mark Break Room as blocked. `NAV` flow field unchanged; Bills can enter the kitchen. The open window is a risk window, not a fortress.
3. **No passive heal in the room:** standing in `breakroom` never regenerates HP. Only purchased heals / delivery snacks elsewhere.
4. **Enemy proximity closes register:** if ≥ `closeIfEnemiesInRadius` (**3**) enemies within `threatRadius` (**180** px) of the counter, shop UI cannot open (or auto-closes) with line `"Customers only. That means Bills, apparently."`
5. **Comfort Zone Tax:** browsing does **not** count as engagement. If the player camps the Lounge without hits, `dyn.lastHitAt` keeps aging → Comfort Zone Tax can still fire and **forces Lounge closed** for the tax duration (`suppressComfortTax: true` while tax active).
6. **Loitering penalty:** after `loiterMs` (**12000**) inside `breakroom` while Lounge is CLOSED (or after closing), spawn a small pack preference bias toward the player for `loiterPackAdd` (**+2**) for 15 s, or flash `Facilities: no sleeping in the Break Room.` Prefer pack bias (uses existing intensity hooks) over free damage.
7. **Bubble is one-shot:** the Facilities shove on open is once per window, not a permanent clear.
8. **Boss lock:** any live boss → Lounge CLOSED.
9. **Delivery suppress** while `loungeOpen` so snack runners do not stack with shop heals.

#### Catalog (same economy as before; stock per open window)

| Item id | Name | Price | Stock | Effect |
| --- | --- | --- | --- | --- |
| `stalePastry` | Stale Pastry | **6** | 2 | `healAmt(3)` |
| `deskSaladBox` | Desk Salad Box | **12** | 1 | Salad frac heal via `healAmt` |
| `coldBrewCup` | Cold Brew Cup | **10** | 1 | Speed 1.20× / 12 s |
| `loanerBadge` | Loaner Badge | **14** | 1 | Magnet 1.4× / 15 s |
| `quietHour` | Quiet Hour Pass | **22** | 1 | Fodder in 220 px leave; elites/bosses stay |
| `bandAidKit` | Band-Aid Kit | **28** | 1/run | `max(4, floor(maxHp*0.28))` via `healAmt` |

`priceRampAdd: 1` per purchase of that id for the rest of the run.

#### Lounge lines

- Open: `"{name} at The Lounge. Cash only. Emotional support sold out."`
- Buy: `"Receipt is a vibe."`
- Threat close: `"Customers only. That means Bills, apparently."`
- Shutter: `"Break's over. Back to the Bullpen."`
- Leave: `"Stay hydrated. Or don't. I'm hourly."`

---

### 8.3 Integration with milestones + Desk Salad

| Source | Role at 60 to 65 |
| --- | --- |
| Birthday cake | Rare planned breath |
| Desk Salad | Combat recovery from elites |
| Intern snack delivery | Early/mid kindness; thin after 58 |
| Lounge pastry / salad box | Optional coin spend; shuttered windows |
| Pizza / Boundaries / level-up | Baseline unchanged |

Target extra sustain ~**+5 to 9 HP/min** in bloody maxed Bracket-0 stretches without holding average HP above ~70% across 60 to 65.

Trims vs first healing draft: milestone 20/30 → **18/25**; saladChance 55% → **45%**.

---

### 8.4 Data sketch (`src/data/interns.js`)

```js
window.INTERNS = {
  enabled: true,
  roster: [
    { id: "casey", name: "Intern Casey", title: "Coffee Runner" },
    { id: "jordan", name: "Intern Jordan", title: "Snack Scout" },
    { id: "sam", name: "Intern Sam", title: "Badge Temp" },
    { id: "riley", name: "Intern Riley", title: "Meeting Escort" },
    { id: "quinn", name: "Intern Quinn", title: "Snack Scout" }
  ],
  delivery: {
    armAfterMs: 45000,
    maxOnMap: 1,
    speedMult: 0.85,
    handOffRadius: 70,
    waitMs: 4000,
    dropIfCrowded: true,
    cadenceByAge: [[40, 55000], [50, 75000], [58, 110000], [66, 140000]],
    jitterFrac: 0.25,
    suppressBoss: true,
    suppressComfortTax: true,
    suppressLevelUp: true,
    suppressLoungeOpen: true,
    payloads: {
      snack: { weight: 40, healFrac: 0.12, healMin: 2 },
      coffee: { weight: 30, speedMult: 1.18, durMs: 8000 },
      focus: { weight: 15, cooldownMult: 0.88, durMs: 8000 },
      magnet: { weight: 15, magnetMult: 1.35, durMs: 10000 }
    }
  },
  lounge: {
    // Replaces roaming merchant stand.
    districtId: "breakroom",           // START_AREA_LAYOUT district
    displayName: "The Lounge",
    counterLocal: null,                // set to {x,y} in layout space when prop is chosen
    browseRadius: 56,
    openMsPromotion: 35000,
    openMsLevelBonus: 25000,
    cooldownMs: 90000,
    showArrowMs: 6000,
    bubblePushRadius: 160,
    bubblePushSpeed: 220,
    promotionAges: [45, 50, 55, 60],  // match START_AREA_LAYOUT.promotions.phases
    levelBonusAt: [8, 12, 16],
    priceRampAdd: 1,
    safety: {
      threatRadius: 180,
      closeIfEnemiesInRadius: 3,
      loiterMs: 12000,
      loiterPackAdd: 2,
      loiterPackMs: 15000,
      suppressBoss: true,
      suppressComfortTax: true,
      noPassiveRegenInDistrict: true
    },
    catalog: [
      { id: "stalePastry", name: "Stale Pastry", price: 6, stock: 2, healFlat: 3 },
      { id: "deskSaladBox", name: "Desk Salad Box", price: 12, stock: 1, useSaladFrac: true },
      { id: "coldBrewCup", name: "Cold Brew Cup", price: 10, stock: 1, speedMult: 1.20, durMs: 12000 },
      { id: "loanerBadge", name: "Loaner Badge", price: 14, stock: 1, magnetMult: 1.4, durMs: 15000 },
      { id: "quietHour", name: "Quiet Hour Pass", price: 22, stock: 1, clearRadius: 220 },
      { id: "bandAidKit", name: "Band-Aid Kit", price: 28, stock: 1, stockPerRun: 1, healFrac: 0.28, healMin: 4 }
    ]
  }
};
```

---

### 8.5 Acceptance tests (Lounge + interns)

1. Before age 45, Lounge cannot open (Break Room locked).
2. On age-45 promotion, OPEN banner + optional arrow; counter browsable for ~35 s.
3. Browse pauses combat only inside `browseRadius`; leaving radius closes UI.
4. Opening shoves nearby fodder once; bosses untouched; boss alive → cannot open.
5. Three+ enemies in threat radius → cannot browse / auto-close.
6. Comfort Zone Tax active → Lounge closed; camping Break Room can still arm Comfort Zone (`dyn.lastHitAt` unchanged by browsing).
7. Loitering in Break Room while CLOSED eventually adds pack pressure.
8. No HP regen from standing in `breakroom`.
9. Purchases deduct `meta.coins` and `runCoins`; Band-Aid once per run.
10. Delivery intern still flees on bump; suppressed during Lounge browse and bosses.
11. NAV: enemies can path into Break Room during an open window (not a sealed safe room).
