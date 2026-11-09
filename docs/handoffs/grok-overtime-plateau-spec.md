# Overtime (65 to 80): new beats and a Workload that keeps up with strong builds. Grok spec, Nov 9, 2026

**For:** Claude, implementing in `ramidaud/midlife-survivors` after Rami picks what to build
**From:** Grok (attacks, difficulty, balance lane)
**Repo state read:** `origin/main` at commit `635a667` (Nov 9, 2026, 8:02 AM ET), game version **V. 2.13.3**, build **296**
**Answers:** `docs/handoffs/grok-late-game-brief.md`
**Parent docs:** `docs/handoffs/grok-boss-attacks.md` (format, telegraph floors), `docs/handoffs/grok-gold-watch-spec.md` (the Watch window), `docs/handoffs/grok-office-bosses-spec.md`, `src/data/errands.js` (the errand UI these beats reuse)

Spec only. No game code was edited. Numbers are data values meant for `src/data/*.js`. Data keys are suggestions; re-find code symbols by name, since line numbers drift.

---

## Context

**Goal:** Make Overtime (Delayed Retirement, 65 up to 80) feel like a victory lap with things to do, not a screensaver. Keep the power fantasy. Add a beat every 2 to 2.5 Overtime years (50 to 65 s) that pays you for moving. Add gentle pressure that turns on only when a run is clearly coasting, and only past 65.

**Rami's run (from the runs table, row of Nov 9, 1:30 AM ET):** Midlife, phone, V. 2.13.0, Tax 2, level 25, died at **77.6** to Spam Likely, **31,216 kills** in 28 min (18.5 per second), **1,063 hits** and **5,856 damage taken**. So "invincible" doesn't mean nothing hits him. It means healing outruns a lot of damage. That changes what we measure (section 2).

### Code facts (V. 2.13.3)

| Fact | Where | Value / note |
|---|---|---|
| Overtime | `META` shop `delayedRetirement` | +5 years per rank, max 3 ranks, so the run ends at 70, 75 or 80 |
| Late years | `RUN_MODES.midlife.lateFromAge` / `lateSecondsPerYear` | **25 s** per year past 65 (45 before); `ageAtMs` / `msAtAge` in `main.js` |
| 65 to 80 run time | | 15 years x 25 s = **375 s** (about 6.25 min) |
| **Gold Watch arrival** | `GoldWatch.arrivalAge()` | `modeEndAge() - arrivesYearsBeforeEnd (1.5)`. **In Overtime the Watch is NOT at 63.5.** It moves to 68.5, 73.5 or **78.5** |
| Watch phases | `BOSS_ATTACKS.goldWatch.phases` | `afterYears` 0.5 and 1.1, measured in years |
| Last boss before the Watch in Overtime | `RUN_MODES.midlife.bosses` | V8 at **60** |
| Boss queue | `BOSS_QUEUE` | one boss at a time, 8 s breather, max 3 years late; the Watch never waits |
| Boss HP | `spawnBoss` | `hp * (1 + (level-1)*0.28) * (1 + (age-40)*0.10) * (1 + Tax)` |
| Hit damage by age | `INTENSITY.hitDamageByAge` | `[[40,0],[48,1],[55,2],[62,3]]`. **Flat from 62 on**, while armor (Lumbar Support), regen and shields keep growing |
| Spawns past 65 | `SPAWNING.waves` | 70: everyMs 280; 80: 240. `packSizeByAge` 4 at 70; `maxOnScreenByAge` 210 at 65, 250 at 100; elites 14% at 65, 18% at 80 |
| Swarm events | `SWARM_EVENTS` | only one new one past 65 (`backOut` at 65), then `allAtOnce` at 80; one every 60 s at 60, 45 s at 80 |
| Cakes and dividends | `HEALING.milestones` | 65 (22%), 70 (25%), 75 (18%), 80 (25%), plus a dividend each time |
| Coin face | `coin401k.compoundTiers` | 2 from 55, **3 from 75** |
| Full Life bosses | `ENEMIES` | HOA President 70 (hp 210, charge, art and telegraph done), Audit 79.2, Pickleball 90. Not in Midlife |
| Errands | `src/errands.js`, `ERRAND_SETTINGS` | TO-DO card, floor marker, edge arrow, countdown chip, rewards `{coins}`, `{heal}`, `{levels}`. One per run today |
| Swarm thinning | `GoldWatch.duel()` | any living boss with a `swarm` block |
| Chest when everything's maxed | `rollChestRewards` | "Signing Bonus" cash (coin face x 3) |
| Telemetry | `src/telemetry.js` | one `runs` row per run (age, level, kills, hits, damage, tax, boss alive at death, build...) plus GoatCounter `Telemetry.event(name)` |

### What the stats say (runs table, read-only, last 14 days, Midlife, runs over 30 s)

| Ended at | Runs | Players | Avg level | Kills/s | Damage/min | Hits/min |
|---|---:|---:|---:|---:|---:|---:|
| 45 to 55 | 174 | 44 | 12.3 | 4.9 | 13.2 | 4.8 |
| 55 to 65 | 69 | 26 | 18.8 | 11.9 | 24.7 | 6.5 |
| 75+ | 15 | 9 | 24.0 | 17.6 | 102 | 24.5 |

- **Most 75+ runs clear 80.** 12 of 15 cleared and 3 died. Damage taken per minute is about **8x** the 45 to 55 band, and they still clear.
- **Caveats:**
  - These rows include Rami's runs. I can't tell which player IDs are his.
  - Many 75+ rows are from V. 1.x, before the V2 balance work.
  - They're whole-run averages, not post-65 slices.
  - My filters differ from the brief's 444 / 16 / 12 count, so treat these as direction, not targets.

### Hard constraints
1. One input: move. Everything below is about where you walk.
2. Nothing here changes the game **before 65**, except one Overtime-only beat at 64 that fills the slot the Watch leaves when it moves (section 1.1).
3. Telegraph floors stay: 550 ms (lines), 650 (rings), 700 (Watch), 750 (areas). Any new floor marker gets at least **1.0 s** of warning, since these are optional objectives, not dodges.
4. No save-format break. Workload and beats are run-local.
5. Phones: no new screen-filling text. Beats use the existing errand chip, edge arrow and lower third. Don't raise the crowd cap on phones (see `slow_frame_pct` in section 3).

---

## 1. Overtime beats (65 to 80)

### 1.0 The schedule

A new data list, `OVERTIME_BEATS`. A beat only fires when the run has Overtime (`modeEndAge() > 65`) and when there's enough time left before the Watch arrives (`minYearsBeforeWatch`). Beats wait while a boss is alive, the same way bosses queue, for up to 1 year, then they're skipped. Random swarm events are held for 10 s before and after a beat, so the two never overlap.

**First, move the Watch by seconds, not years.** With 25 s years, "1.5 years before the end" is only **37.5 s**, down from 67.5. At 78.5, level 25, Tax 2, the Watch has about 7,000 HP, which takes about 186 DPS to finish in time. It used to need about 100. Set the Overtime arrival to **2.7 years before the end** (67.5 s at 25 s per year), and scale its phase thresholds the same way (**0.9** and **2.0** years). That gives Overtime players back the 67.5 s Watch fight from the Watch spec.

| Age | Beat | Ends at 70 (Watch 67.3) | Ends at 75 (Watch 72.3) | Ends at 80 (Watch 77.3) |
|---:|---|:-:|:-:|:-:|
| 60 | V8 (existing) | yes | yes | yes |
| **64.0** | **Open Enrollment** (Medicare maze) | yes | yes | yes |
| 65.0 | cake + dividend (existing) | yes | yes | yes |
| **66.0** | **Grandkids' Visit** | yes | yes | yes |
| **68.5** | **Clean Out Your Desk** (downsizing) | skipped (Watch) | yes | yes |
| **70.0** | **HOA President** (existing boss), or **Reunion** if the Watch is less than 3 years away | | Reunion | HOA |
| 70.0 | cake (existing) | | yes | yes |
| **72.5** | **Reunion** (or Grandkids II if the Reunion already ran) | | skipped (Watch) | Reunion |
| 75.0 | cake (existing) | | | yes |
| **75.8** | **Annual Enrollment** (3-leg Open Enrollment) | | | yes |
| end - 2.7 | Gold Watch | 67.3 | 72.3 | 77.3 |

**Longest quiet stretch past 64, at 80:** about **62.5 s** (66 to 68.5, 68.5 to 70, 72.5 to 75.8 with the 75 cake in the middle). Today it's 60 to 78.5, about 9.4 minutes.

**Why 64 for the first beat:** Medicare enrollment opens three months before your 65th birthday, which is about as on-the-nose as this game gets. In Overtime runs the Watch no longer fills 60 to 65, so without this beat that stretch would be 4.4 quiet minutes.

### 1.1 Open Enrollment (64.0) and Annual Enrollment (75.8)

*"Your Medicare window is open. Please visit four different offices, in order."*

**What happens**
- A chain of 4 checkpoints, labeled **Part A, Part B, Part C, Part D** (3 legs for Annual Enrollment: Part A, then a "plan comparison," then Part D). It's built on the errand system: a TO-DO card, a floor marker, an edge arrow and a countdown chip.
- You only see one checkpoint at a time. Reaching it (`reachPx` 80) shows the next one.
- Each checkpoint is picked **450 to 800 px** walking distance from the last, in an open room (`NAV.reachable` and `startArea.contains`). Never the same room twice in a row, so the chain sends you through the campus like a real benefits maze.
- **Time per leg: 10 s.** A straight 800 px walk is 3.5 s at 230 px/s, about 7 s around walls. That's doable while weaving, but you can't stand still and make it.
- **"Your call is important to us":** while the chain runs, 30% of regular spawns are swapped for **Spam Likely** (hold music). It's a mix swap, not extra enemies.
- **Missing a leg ends the chain** with no penalty: "You're on hold. We'll call you back." You keep what you already earned. Warm, never mean.

**Telegraph:** the TO-DO card and a `flashBanner` ("OPEN ENROLLMENT", "Four offices. Ten seconds each. Go."). The first leg's timer starts **1.5 s** after the card appears. Each new marker drops with a 1.0 s ring pulse, and the edge arrow appears the same frame.

**Drops**
- **Each leg:** coins equal to **5 x the coin face** (10 at 64), plus a gem burst of 6 gems.
- **All 4 legs:** a **tier 3 chest** ("Your card arrived in the mail") and **+2,500 score**.
- **Annual Enrollment, all 3 legs:** a tier 3 chest and +2,500 score.
- Achievement: "Initial Enrollment Period" (reward 8 coins).

### 1.2 Grandkids' Visit (66.0; Grandkids II at 72.5 when the Reunion has already run)

*"The grandkids stopped by the office. They want to play tag. You're it."*

**What happens**
- **3 grandkids** run in (5 in Grandkids II). They're friendly little sprites, *not* enemies: not in the `bills` group, can't be hurt, and nothing targets them.
- **They play tag:** each one runs away from you at **150 px/s** (65% of your 230) in wobbly arcs (sideways sway 18 px at 0.8 Hz, the same feel as a 3 AM Thought). They try to stay **260 to 420 px** from you, keep to open floor and steer around desks with the flow field.
- **Touching one** (body overlap) = "Got you!" They hand you a gift and run off waving.
- **Window: 20 s,** then any you didn't tag leave: "See you at Thanksgiving!" No penalty.
- **The challenge is the crowd.** Kids happily run *through* the swarm (enemies ignore them), so catching one means weaving into a crowd you'd usually just stand in.
- **Sprint:** kid speed x1.25, the same as you.

**Telegraph:** a pink heart pip at the screen edge where each kid will enter, **1.2 s** before they appear, plus a lower third: "GRANDKIDS", "Tag all three before they get bored." Each kid has a small pink heart over its head while it's catchable, so they're easy to spot in a crowd on a phone. Off-screen kids get a small edge arrow in the errand style.

**Drops (one gift per kid, rolled):**
- **Crayon drawing:** a 6-gem burst.
- **Cookie:** heal 3 through `healAmt`.
- **"Grandpa's lucky coin":** coins equal to 4 x the coin face.
- **Tag all of them:** a **tier 1 chest** and **+2,000 score**, plus the achievement "World's Okayest Grandparent" (reward 8).

**Art:** small kid sprites. Until real art exists, the interns or the coworker cast at a smaller scale can stand in.

### 1.3 Clean Out Your Desk (68.5): downsizing

*"Twenty-five years of desk. One cardboard box. Bargain hunters incoming."*

**What happens**
- Your desk drawer bursts: **8 keepsakes** fly out in short arcs and land **200 to 500 px** from you, on open floor, at least 96 px apart. They are: stapler, "World's Okayest Employee" mug, framed family photo, the emergency granola bar, a cactus, the good pen, a rubber band ball, and a 2009 coupon.
- **Walk over them to pack them** (pickup radius 40). **Magnets don't work on keepsakes** ("some things you carry by hand"). Fanny Pack doesn't pull them either. That's the whole point: you have to go get them.
- **Window: 15 s.**
- **Bargain Hunters:** a new kind, `haggler` ("50¢" tag, Late Fee art with a cream tint), speed **150**, hp 1, damage 1. One spawns at a screen edge every **2.5 s** and walks to the nearest keepsake you haven't packed. If it gets there first, that keepsake is **sold** ("SOLD! 50¢") and you get 1 coin as consolation. Haggles are a race, not a fight. Killing hagglers is fine too.

**Telegraph:** a sparkle arc as each keepsake flies out (1.0 s from burst to landing, and you can't pick one up mid-air). A lower third: "DOWNSIZING", "Pack your keepsakes before the bargain hunters do." The chip counts packed items: "PACKED 3/8 · 11s".

**Drops**
- **Each keepsake packed:** a 3-gem burst and coins equal to 1 x the coin face.
- **6 or more:** a **tier 3 chest** ("the box").
- **All 8:** +2,000 score and the achievement "Box of Memories" (reward 8).
- Optional: the collected keepsakes show up on the run summary, as a little box with icons.

### 1.4 The HOA President (70.0, runs ending at 80 only)

The cheapest real boss in the game: art, telegraph, charge attack and achievement are all already built for Full Life. A retired office worker's next boss is the HOA, which is honestly realistic.

- **When:** age 70, only if the Watch is **3 or more years** away. In practice that's only runs ending at 80 (Watch at 77.3). Otherwise the 70 slot becomes the Reunion.
- **Numbers:** use the existing `ENEMIES.hoaPresident` (hp 210, speed 82, damage 3) and `BOSS_ATTACKS.hoaPresident` (charge, 650 ms telegraph, floor 550) unchanged.
  - At level 25, Tax 2, age 70: 210 x 7.72 x 4.0 x 1.24, about **8,000 HP**.
  - At the 120 to 160 DPS from my Nov 4 late-build estimate, that's about **50 to 67 s**, which fits the 62.5 s gap.
- **Add a swarm block** like the other bosses: `spawnDelayMult 1.30`, `packSizeMult 0.75`, `maxOnScreenMult 0.75`, `pauseKinds ["calendarInvite"]`, `pauseEvents true`.
- **Drops:** the existing tier 3 chest and the "0.2 Inches Legal" achievement.
- **Needs code:** the HOA's `spawnAge` 70 is shared with Full Life. Midlife will fire it from `OVERTIME_BEATS`, not `RUN_MODES.midlife.bosses`, so Full Life is unaffected.

### 1.5 The Reunion (70.0 or 72.5), the light one

*"Your old coworkers are all here. You will have to say hi to every single one."*

Cheap, because it reuses the swarm event ring pattern and the Close Call measuring code.

**What happens**
- **8 Old Coworkers** spawn in a ring, using the Reply-All Chain elite art with a sage tint and a "REMEMBER ME?" tag.
- **They're friendly:** no contact damage, and they close in slowly at **60 px/s**.
- **Walking past one** within the Close Call band (no touching needed) **catches up** with them: a little "Bob! How are the kids?" pop, a 3-gem burst, and they wave and leave.
- **Window: 20 s.** Coworkers you didn't catch up with drift off: "We should get lunch sometime." No penalty.
- Regular spawns keep going, so you're weaving through the swarm to reach your friends.

**Telegraph:** the existing swarm-event lower third ("REUNION", "Say hi to everyone before they leave"), and the ring forms just off screen like Tax Season does.

**Drops:** catch up with **6 or more** for a tier 1 chest and +1,500 score. All 8 gets the achievement "Reply All, In Person" (reward 6).

### 1.6 Rules shared by all beats
- **One beat at a time,** and never while a boss's telegraph is up. Beats wait for a boss for up to 1 year, then skip.
- **Beat markers and objects never land** in a wall, a desk, a locked room, the Supply Closet, or within 96 px of a boss.
- **Beats don't hurt you.** The only new enemy is the haggler (damage 1). The danger is the swarm you walk through.
- **Workload** (section 2) holds steady during a beat, and its spawn bonus is halved during a beat or a boss.
- **Reduced motion:** markers pulse in alpha only; kids and coworkers still move.
- **Telemetry:** `Telemetry.event("ot-<beat>-start")`, `"-done"` and `"-miss"`, plus the run row fields in section 3.

---

## 2. Workload: pressure that keeps up with strong builds

### 2.1 What to measure
Past 65 only, and only in Overtime runs, every **20 s window** checks three signs of coasting:

| Sign | Data key | Threshold | Why this one |
|---|---|---|---|
| Health never dipped | `hpFloorFrac` | health never below **70%** of max during the window | "invincible" means healing outruns damage. Rami took about 210 damage per minute and still coasted, so damage taken alone can't tell |
| Room is clear | `crowdFrac` | average enemies on screen at or below **35%** of the current crowd cap | "little else happening" |
| Barely moving | `moveSpeed` | average speed at or below **70 px/s** (30% of base) | "basically not moving" |

**A window counts as coasting when at least 2 of the 3 signs are true.** I'm skipping kills per second as a trigger, since it mostly tracks how fast things spawn at that age. Record it for the stats instead.

### 2.2 Levels
- **Workload level 0 to 5,** shown as 5 pips.
- **Going up:** 2 coasting windows in a row (40 s) raise it by 1. At most one rise per 40 s, so reaching 5 from 65 takes at least 200 s (8 Overtime years).
- **Going down:**
  - Health below **50%** drops it by 1 right away (at most once per 10 s).
  - Health below **30%** drops it by 2.
  - 3 windows in a row that aren't coasting drop it by 1.
- **Holds** (no rise and no fall checks) during a beat, a boss, a level-up or chest screen, the first 15 s after 65, and the 15 s after any level change.

### 2.3 What each level does (past 65 only; stacks with Tax and age, applied through one `workFx(key)` helper like `tax()`)

| Key | Per level | At 5 (cap) | Note |
|---|---|---|---|
| `spawnDelayMult` | 1, 0.92, 0.85, 0.79, 0.73, **0.68** | 0.68 | blended in over **6 s**, so there's no sudden wall |
| `packAdd` | +1 at levels 2 and 4 | **+2** | |
| `enemyHpMult` | +0.08 per level | **+40%** | |
| `hitDamageAdd` | +0.5 per level, rounded in `hurtPlayer` | **+2.5** (about +3) | this is the one that beats sustain: age damage stops at +3 from 62 on |
| `eliteChanceAdd` | +0.015 per level | **+7.5 points** | more elites means more Desk Salads, a self-correcting reward |
| `maxOnScreenMult` | desktop +4% per level; **phones 0** | desktop **+20%** | phones are already near their frame budget at 210 to 250 |

**Floors and caps:**
- Total spawn delay (wave x level x Tax x Workload) never goes below **0.30** of the wave's base.
- Workload's hit damage never adds more than **+3**.
- Workload never touches telegraph times, boss HP or beat timers.

**The reward, "overtime pay":** each level adds **+6% score** and **+4% 401(k) coins** from regular drops, up to **+30% score** and **+20% coins** at 5. Coins go through `bankCoins` and the taper, so it isn't a farm (watch it in section 3). This makes Workload feel earned instead of punishing.

### 2.4 How it shows on screen
- **A small chip under the age:** "WORKLOAD ▮▮▮▯▯ · +18% PAY" in Silkscreen at 11 px, cream on navy. It only appears once the level reaches 1. On phones it shares the errand chip's row and hides while an errand chip is up.
- **Before every raise:** the chip's next pip blinks for **3 s**, then the lower third reads "WORKLOAD UP", "You make it look easy, so they gave you more." Rotate a few gentle lines, never insulting (Gemini can write 6).
- **On a drop:** "WORKLOAD EASED", "Take a breath. Your pay stays." The pay bonus drops along with the level, but nothing already earned is taken back.
- **Pause screen:** one line explains it: "Past 65, the office adds work when you're cruising. More pay per level."
- **Reduced motion:** the pip fills without blinking.

### 2.5 Who's protected
- Before 65: never on.
- No Overtime rank: the run ends at 65, so it never turns on.
- A struggling Overtime run never meets 2 of the 3 signs (health dips, a busy room) and stays at 0.
- The drop rules pull it down as soon as health falls below 50%.
- **Full Life:** off by default (`modes: ["midlife"]`). Turn it on later if the Full Life plateau shows up in the stats.

---

## 3. Stats to watch after shipping

**New run-row fields** (need a SQL file like `RUNS_DIFFICULTY.sql`, run once by Rami):
- `end_age_target` (70, 75 or 80)
- `workload_max`, `workload_secs_at_5`
- `ot_beats` (a short string like "OE4,GK3,DESK7,HOA,RE6,AE3")
- `kps_after_65`, `dmg_per_min_after_65`, `min_hp_frac_after_65`, `move_px_s_after_65`, `move_px_s_55_65`
- `watch_arrival_age`, `watch_killed`

**GoatCounter events:** `ot-*` as in 1.6, plus `workload-<n>` on each first rise per run.

Targets, over the next 30 or so Overtime runs that reach 66 (Rami's player IDs excluded once known):

| Metric | Target |
|---|---|
| Overtime runs reaching their end age | **60 to 80%** (today about 80% of 75+ runs clear; it should still feel winnable) |
| Median `workload_max` among runs that clear | **2 to 4**; time at level 5 under **20%** of Overtime time |
| Deaths within 30 s after a Workload rise | under **25%** of Overtime deaths |
| `move_px_s_after_65` vs `move_px_s_55_65` | not lower (today Rami says he stopped moving); target **120 px/s or more** after 65 |
| Longest gap after 60 with no boss, beat or cake | **75 s or less** (log it in the run row as `max_quiet_secs_after_60`) |
| Open Enrollment, all 4 legs | **45 to 70%** |
| Grandkids, all tagged | **50 to 75%** |
| Clean Out Your Desk, 6 or more packed | **50 to 70%** |
| Reunion, 6 or more | **60 to 80%** |
| Watch kill rate in Overtime with the 67.5 s window | **40 to 60%** (the same target as the Watch spec) |
| Phone `slow_frame_pct` in Overtime runs | not up more than **5 points** |
| Share of 401(k) coins earned past 65 | not up more than **15%** relative to before (overtime pay isn't a farm) |
| Quit rate during Overtime | going down |

---

## 4. Data objects (suggestions; a new `src/data/overtime.js` is cleanest, registered in `loader.js`)

```js
window.OVERTIME_BEATS = {
  on: true, needsOvertime: true, waitForBossYears: 1, holdSwarmEventsMs: 10000,
  schedule: [
    { age: 64.0, id: "openEnrollment",   minYearsBeforeWatch: 1.0 },
    { age: 66.0, id: "grandkids",        minYearsBeforeWatch: 1.0 },
    { age: 68.5, id: "cleanOutDesk",     minYearsBeforeWatch: 1.0 },
    { age: 70.0, pick: ["hoaPresident", "reunion"], firstThatFits: true },
    { age: 72.5, pick: ["reunion", "grandkids2"], firstUnused: true },
    { age: 75.8, id: "annualEnrollment", minYearsBeforeWatch: 1.0 }
  ],
  openEnrollment:   { legs: 4, legSec: 10, legMinPx: 450, legMaxPx: 800, reachPx: 80, leadMs: 1500, markerPulseMs: 1000,
                      spamSwapFrac: 0.30, legCoinsPerFace: 5, legGems: 6, chestTier: 3, scoreBonus: 2500 },
  annualEnrollment: { like: "openEnrollment", legs: 3 },
  grandkids:        { kids: 3, windowSec: 20, speed: 150, keepMinPx: 260, keepMaxPx: 420, swayPx: 18, swayHz: 0.8,
                      pipLeadMs: 1200, gifts: { drawingGems: 6, cookieHeal: 3, coinPerFace: 4 }, chestTier: 1, scoreBonus: 2000 },
  grandkids2:       { like: "grandkids", kids: 5 },
  cleanOutDesk:     { items: 8, minPx: 200, maxPx: 500, spacingPx: 96, windowSec: 15, pickupPx: 40, magnet: false, landMs: 1000,
                      hagglerEveryMs: 2500, gemsEach: 3, coinPerFaceEach: 1, chestAt: 6, chestTier: 3, scoreAll: 2000 },
  hoaPresident:     { minYearsBeforeWatch: 3.0 },
  reunion:          { coworkers: 8, speed: 60, windowSec: 20, gemsEach: 3, chestAt: 6, chestTier: 1, scoreBonus: 1500, minYearsBeforeWatch: 1.0 }
};

window.OVERTIME_WORKLOAD = {
  on: true, modes: ["midlife"], fromAge: 65, needsOvertime: true,
  windowMs: 20000, coastSignsNeeded: 2, hpFloorFrac: 0.70, crowdFrac: 0.35, moveSpeed: 70,
  riseAfterWindows: 2, fallAfterWindows: 3, dropAtHpFrac: 0.50, dropTwoAtHpFrac: 0.30, dropCooldownMs: 10000,
  holdAfterChangeMs: 15000, holdFirstMs: 15000, warnMs: 3000, blendMs: 6000, maxLevel: 5,
  perLevel: {
    spawnDelayMult: [1, 0.92, 0.85, 0.79, 0.73, 0.68],
    packAdd:        [0, 0, 1, 1, 2, 2],
    enemyHpMult: 0.08, hitDamageAdd: 0.5, eliteChanceAdd: 0.015,
    maxOnScreenMultDesktop: 0.04, maxOnScreenMultPhone: 0,
    scoreMult: 0.06, coinMult: 0.04
  },
  caps: { minSpawnDelayFrac: 0.30, hitDamageAdd: 3 },
  duringBeatOrBossSpawnFrac: 0.5
};

// ENEMIES addition
haggler: { name: "Bargain Hunter", label: "50¢", tex: "lateFee", speed: 150, hp: 1, damage: 1, size: 18, color: 0xD3B78D },

// BOSS_ATTACKS.goldWatch additions (Overtime only; the 63.5 Midlife timing is unchanged)
lateArrivesYearsBeforeEnd: 2.7,                // 67.5 s at 25 s per year, the same window as a 65 finish
latePhaseAfterYears: { overtime: 0.9, lastMinute: 2.0 },

// BOSS_ATTACKS.hoaPresident addition (used when it appears as an Overtime beat)
swarm: { spawnDelayMult: 1.30, packSizeMult: 0.75, maxOnScreenMult: 0.75, eliteChanceMult: 1.0, pauseKinds: ["calendarInvite"], pauseEvents: true }
```

---

## 5. What needs code beyond data
1. **A beat scheduler** (`OVERTIME_BEATS.schedule`): Watch-relative skips, waiting for bosses, holding swarm events.
2. **A multi-leg errand** with per-leg timers and markers, plus a spawn mix swap for Open Enrollment. Errands are one-per-run and single-leg today.
3. **Grandkid and coworker "friendly" actors:** not enemies, flee or approach steering, tag detection. Reunion catch-ups reuse Close Call distance.
4. **Keepsake pickups that ignore magnets**, plus the haggler's "go to the nearest keepsake" target.
5. **A Workload tracker** (windows, signs, levels), a `workFx()` helper wired into the same spots as `tax()`, plus the chip and lower-third lines.
6. **Gold Watch late arrival and phase thresholds** for Overtime (`arrivalAge` and `phaseOf` read the new keys when `modeEndAge() > 65`).
7. **The HOA as an Overtime beat** in Midlife (not through `RUN_MODES.midlife.bosses`), with its new swarm block.
8. **Telemetry:** the new run-row fields (a SQL file for Rami) and the `ot-*` / `workload-*` events.
9. **Art:** grandkid sprites (placeholders allowed), 8 keepsake icons, a haggler tint. Everything else reuses existing art.

## 6. Knob order (small, reversible)
1. **Overtime still too easy:** lower `hpFloorFrac` 0.70 -> 0.60 (Workload turns on sooner), then raise `hitDamageAdd` 0.5 -> 0.75 per level. **Too hard:** `maxLevel` 5 -> 3, then `hitDamageAdd` 0.5 -> 0.3.
2. **Beats too hard to finish:** Open Enrollment `legSec` 10 -> 12, Grandkids `speed` 150 -> 135, Desk `hagglerEveryMs` 2500 -> 3500. **Too easy:** reverse those.
3. **Still feels empty:** add Grandkids II at 74 for runs ending at 80, before adding any new content.
4. **Overtime coins too generous:** `coinMult` 0.04 -> 0.02 per level first.
5. Leave Tax Bracket, `hitDamageByAge` and the telegraph floors alone.

## 7. Acceptance notes
1. A run with no Overtime ranks: no beats, no Workload, and the Watch at 63.5, exactly as V. 2.13.3.
2. Ending at 70, 75 and 80, the schedule matches the table in 1.0, and no beat overlaps the Watch.
3. Every beat object lands on reachable open floor (test 90 placements, like the mistletoe test).
4. Workload stays at 0 for a run that dips below 70% health or keeps the room busy, rises to 5 for an AFK god-build test (`?dev` god mode plus standing still), and drops right away when health falls below 50%.
5. Spawn delay never goes below 0.30 of the wave base, and phones never get a bigger crowd cap.
6. Watch window in Overtime is 67.5 s, give or take one frame.
7. Reduced motion: no blinking pips, and markers pulse in alpha only.

## 8. Open questions for Rami
1. **Workload: on for everyone in Overtime (spec default), or an opt-in toggle?** A toggle is softer, but the players it's for might never switch it on.
2. **Hit damage per level:** this is the lever that actually counters sustain, and the one most likely to cause frustrating deaths. +0.5 per level (spec) or start at +0.3?
3. **HOA in Midlife Overtime:** OK to reuse the Full Life boss, or should Midlife save it for Full Life?
4. **Grandkids art:** new sprites, or reuse the interns for now?
5. **Overtime pay** (+20% coins at Workload 5): fine, or score only?
6. **Full Life:** also turn Workload on past 65 there, once Midlife numbers look right?
