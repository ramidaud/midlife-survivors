# Maple Hollow v2 play spec + an office-only boss for 60. Grok reply, Nov 10, 2026

**For:** Claude, implementing in `ramidaud/midlife-survivors` after Rami picks what to build
**From:** Grok (attacks, difficulty, balance lane)
**Answers:** `docs/handoffs/grok-maple-v2-and-office-boss.md` (Claude's brief, Nov 10). Saved as `grok-maple-v2-reply.md`, as that brief asks, so it doesn't overwrite the brief itself.
**Repo state read:** `origin/main` at commit `7e14cc6` (Nov 10, 2026, 8:20 AM ET), game version **V. 2.24.4**, build **326**
**Parent docs:** `grok-boss-attacks.md` (format, telegraph floors), `grok-office-bosses-spec.md` (New Boss 48, the 56 rotation), `grok-overtime-plateau-spec.md`, `chatgpt-maple-hollow-v2-scale.md` (the v2 art and layout brief), `docs/handoffs/img/rami-house-floor-plan.png`, `img/rami-desk-setup.jpg`

Spec only. No game code was edited. Numbers are data values meant for `src/data/*.js`. Data keys are suggestions; re-find code symbols by name, since line numbers drift.

---

## 0. What I checked

### Maple Hollow today (v1, live) vs v2 (planned)

| Thing | v1 in code (`src/data/maple-hollow.js`) | v2 (Claude's brief and the ChatGPT art brief) |
|---|---|---|
| Lots | 400 px wide, houses about 172 px wide | **416** px lots, houses about **336** wide, so a **64 px side path** with a gate on one side of each house |
| Street | 192 px road plus two 64 px sidewalks | a **512 px band**: sidewalk 64, parkway 32, **road 320** (a 64 px parking lane on each side, two travel lanes, center dashes), parkway 32, sidewalk 64 |
| Backyards | small props behind the south row | **6 neighbor yards** (416x448) joined by gates, plus Rami's patio as a 7th |
| House | 3 rooms + hallway + garage, all on one floor, built far below the street (y 2440) | **two real floors** from Rami's plan (1 ft = 24 px) with stairs between them |
| Desk | none | Rami's real desk in the upstairs office (second bedroom, 12'7" x 11'2", about 302x268 px) |
| Bosses | `MAPLE_HOLLOW.bosses`: Math Homework 45, HOA 48 (hp x0.35), Mortgage 52, Holiday Party 56, **V8 60 (bursts out of your garage)**, Gold Watch | same lineup |

### Code facts this spec leans on

| Fact | Where | Value |
|---|---|---|
| Hero speed | `PLAYER.speed` | **230** px/s. Claude's brief says "about 190". I couldn't find 190 in code, so the path math below checks both |
| Hero body | Arcade body | about **48x52** (from earlier specs; v2 may change it); v2 draws the hero 56 px tall |
| Spawning | `spawnBill` | a pack off one of the 4 view edges, then `startArea.resolveSpawn` snaps it to the nearest valid floor. On a street map that can drop a pack into a side path or a backyard right next to you |
| Door in and out | `key-hunt.js` `moveTo` | teleports you. Every non-boss enemy more than 900 px away is **deleted**; bosses are moved next to you; the flow field is rebuilt (`NAV.invalidate`) |
| Flow field | `navigation.js` | 32 px cells, a 34-cell radius (about 1,090 px), rebuilt every 180 ms; every walkable cell costs the same |
| Phone view | `VIEW.minZoom` 0.75 | a 390 pt phone sees about **520** world px across its short side. Landscape: the 512 px street band fills the height. Portrait: you see the street plus the house fronts |
| Crowd cap | `INTENSITY.maxOnScreenByAge` | 70 at 40, 120 at 50, 170 at 58, 210 at 65 |
| Telegraph floors | `BOSS_ATTACK_TUNING` | 550 (lines), 650 (rings), 700 (Watch), and the 750 area floor from the office bosses spec |
| Home enemy swaps | `MAPLE_HOLLOW.enemySwap` | Tax Notice, Leaf Pile, Gutter Clog, Lawn Mower (straight charger, 150 px/s) |
| Stage check | `window.isOffice()` | `STAGE_ID !== "home"` |
| Office 60 boss | `RUN_MODES.midlife.bosses` / `full.bosses` | `midlifeCrisis` (V8, hp 200, drift + skids) |
| Sprint unlock | `SPRINT.unlockAchievement` | `"keepTheSedan"` (beat the V8) |

---

## Part 1. Maple Hollow v2 play spec

### 1.1 The wide street: open arena

**How it should feel:** the street is where you kite. The swarm comes **along** the street from its ends, the way traffic does, and only a little from the driveways. The side paths are doors you choose, not holes the swarm falls out of.

**Where spawns come from while you're on the street band:**

| View edge | Weight | Rule |
|---|---:|---|
| Left end of the street | **35** | packs land on the road or sidewalk rows only |
| Right end of the street | **35** | same |
| Top edge | **15** | snapped to the **north sidewalk or a driveway apron**, never into a side path or backyard |
| Bottom edge | **15** | snapped to the **south sidewalk**, the same way |

- **Spawn margin:** never closer than **260 px** to you after snapping. If the snap would land closer, re-roll up to 3 times, then use a street end.
- **Lawn Mowers drive along the street:** 70% of the time their locked direction is within 15 degrees of horizontal. A mower coming straight down a driveway at you is fine once in a while, not every time.
- **Parked cars are cover:** 1 to 2 solid cars per 832 px street plate, footprint about **104x56**, in the parking lanes only. Keep them **160 px or more** apart, and never within **64 px** of a driveway apron, so every side path mouth stays open.
- **Width check:** a 320 px road plus two 32 px parkways gives about **384 px** of open floor even with a car in each parking lane, which is 8 Bills wide. Crossing the whole band takes **2.2 s** at 230 px/s (2.7 s at 190). Wide enough to circle a pack; short enough that the street never feels empty.

### 1.2 Side paths: chokepoints that never trap you

A side path is **64 px** wide. Your body is about 48, leaving 8 px each side. A Bill (about 34 px scaled) fills most of it, so it's **single file**.

**The one-open-end rule:** while you're in a side path, or within **96 px** of either end, **no new spawn can land in that path, its backyard, or within 320 px of its backyard gate.** New packs only come from the street side. So you can always walk out the back; the backyard is the escape hatch.

**Queue caps:**
- At most **6 enemies inside one side path** at a time. A path about 352 px long holds about one enemy per 58 px.
- At most **4 inside one yard-to-yard gate.**
- When a path is full, the flow field treats its cells as blocked for anyone not already inside. The rest wait at the mouth. ("Single file. Wait your turn.")
- Elites count as 2, because a 1.45x elite is 49 px wide.

**Flow field cost:** side-path and gate cells cost **2.0x** a normal cell (needs a per-cell cost; today every cell costs the same). With that, when you're on the street the swarm takes the street, not a shortcut through somebody's petunias. When you're in a backyard, it still comes through the paths, but at most 6 at a time.

**Is 6 fair?** A path holds 6; a strong mid-game build kills a Bill in about 3 hits. Fighting single file is the *reward* for using a chokepoint. It only becomes a trap if the other end closes too, which the one-open-end rule forbids.

**Speed check:** walking a 352 px path takes 1.5 s at 230 px/s (1.9 s at 190). A Lawn Mower (150 px/s, straight line) is the only home enemy that could chase you all the way through quickly. Mowers never path into side paths. They mow the street and leave the yards alone, which is also how real lawn mowers work.

### 1.3 Backyards: the escape loop

- **The loop:** street, side path A, backyards, gate, gate, side path B, street. Two houses apart, it's about **1,250 px** of walking, about 5.4 s at 230 px/s. That's a comfortable kite loop, the home version of circling a cubicle pod.
- **Gates** between yards are **80 px** wide (wider than the side paths, so the yard row feels open), and every shared fence has one.
- **Spawns while you're in the backyard row:**
  - 80% come from the street side **through the side paths**: the pack lands on the street, then walks in.
  - 20% come from the ends of the yard row, only if that end is more than 600 px away.
  - Never inside the yard you're standing in.
- **Backyard crowd cap:** at most **40%** of the current on-screen cap can be in the backyard row at once (about 48 at 50, 68 at 58). The yards are a breather, not a second arena.

### 1.4 Inside the house: do enemies follow you upstairs?

**Yes, a few, after a beat.** Hiding upstairs should feel safer, not like turning the game off.

| Rule | Value | Why |
|---|---|---|
| Who can follow | **Walkers only:** Bill, Tax Notice, Late Fee, Late-Night Donut, Leaf Pile, Back Twinge, 3 AM Thought | they all walk or float |
| Who stays downstairs | Lawn Mower ("can't do stairs"), Calendar Invite (charges in straight lines), Math Homework enemy, Group Chat (stays downstairs pinging into the void), Gutter Clog (it's a gutter) | |
| Who follows | walkers within **220 px** of the stairs when you step on them | "they heard the stairs creak" |
| Delay | **1.2 s** after you reach the top | enough to get off the landing |
| How many | at most **6** followers per trip, nearest first | |
| Leash | followers who can't reach you for **6 s** go back down (or despawn if downstairs is empty) | |
| **Bosses** | always follow, after **2.5 s**. They arrive at the top of the stairs after a **1.0 s** "creak... creak..." marker on the landing | same rule as the front door today: you can't hide from a boss. The V8 included; nobody knows how it does the stairs, and nobody asks |

**Spawns inside the house:**
- **First floor:** new packs come only through doorways: **front entry 40, back door to the patio 40, the garage door 20** (if the garage is open). Floor cap **18**.
- **Second floor:** new packs come only **up the stairs**, at **50%** of the normal rate. Floor cap **12**.
- **"The house noticed you're hiding":** after **20 s** in a row upstairs, the upstairs rate climbs back to 100% over 5 s. It resets when you go down.
- No spawns inside any room you're standing in, and never within 200 px of you.
- Stair and hall widths from the plan: stairs about 3 ft (**72 px**), upstairs hall about 3'6" (**84 px**), doors 2'8" to 3' (**64 to 72 px**). They're all chokepoints like the side paths, and the same queue cap of 6 applies to the stairs.

### 1.5 One reason to visit each backyard

Each yard has **one** thing, on its own timer. A small sparkle on the minimap and at the yard's gate shows when it's ready. Everything is "walk here"; nothing needs a button.

| Yard | The thing | Numbers | Respawn |
|---|---|---|---|
| 1. Young family | **Trampoline**: walk onto it and you bounce for a moment of "nope, airborne." You can't be hurt while airborne, and you land with a small shockwave | airborne **1.2 s**; landing push **80 px** within 90 px, damage **2** | **20 s** |
| 2. Retirees | **Vegetable bed**: a ripe tomato basket, a heal pickup like pizza | heal **3** (through `healAmt()`, so Tax trims it) | **60 s** |
| 3. Grill-master dad | **The grill**: stand within 64 px for **1.0 s** and he hands you a burger: "Grill Master," more damage | **+20% damage for 15 s** | **45 s** |
| 4. Fixer-upper | **Knee-high grass** (2 patches about 160x120): enemies wade, you don't ("you know where the holes are") | enemies at **0.6x** speed inside | always on |
| 5. HOA President | **Koi pond wishing coins**, guarded by a sprinkler. The sprinkler sweeps a telegraphed arc (dashed arc, **750 ms**) every **6 s**. It does 1 damage to you and pushes enemies 60 px | **3 coins** of the current face value | **60 s** |
| 6. Early Halloween | **Candy bowl, "Take ONE"**: an XP burst. Come back before it refills and you get a sign: "...we said ONE." | **8 gems** | **75 s** |
| 7. Your patio | **Fire pit**: a warm circle that heals you while you stand in it | **+1 HP every 3 s** within **80 px**, max **6 HP** per visit | **60 s** after a visit ends |

**Totals and limits:**
- **Healing:** the yard heals together (tomatoes and fire pit) come to about **9 HP per minute** if you visit everything on cooldown. That's below one Desk Salad per minute for a mid-game player (22% of about 20 HP = 4.4), and you have to walk a loop to get it.
- **Tax trims every heal**, as usual.
- **During boss fights:** the trampoline, grill and pond still work. The fire pit and tomatoes pause (new rule, `pauseHealsDuringBoss`), so the yards don't become the boss strategy.

### 1.6 Your desk (upstairs office)

**Recommendation: a "Ship It" buff with a once-per-run gift, not a safe spot.** A safe spot teaches standing still, which is exactly what we just fixed in Overtime.

- **How it works:** walk into the chair spot in front of the desk (**64x48**) and stay **1.0 s**. The monitors flash orange and "PUSH TO PRODUCTION" pops up.
- **Buff, "Hotfix Deployed":** every weapon fires **15% faster** (cooldown x0.85) for **20 s**. Cooldown **90 s** (2 years at 45 s per year).
- **The first visit each run also gives +1 level,** with a little pop: "Someone left a nice comment on the devlog." Same shape as the Easter egg's `EGG_BONUS = { levels: 1 }`.
- **The joke:** the monitors show the game's title screen. The tablet shows your current age and score, live. Gemini is writing 4 desk lines; one pops on each visit.
- **Upstairs pressure still applies,** so a visit is a commitment: up the stairs, 1 s in the chair, and the 6 followers arrive at about the same time.
- **Not a safe spot:** you can be hurt in the chair, and leaving it early cancels with no cooldown spent.

---

## Part 2. The office-only boss for 60

### 2.0 Pick: **The Quarterly All-Hands**

**Why the All-Hands over the IT Migration:**
1. **It's the variety boss.** The All-Hands runs a slide deck, so one boss brings **three** different hazards (bar chart, pie chart, line graph) plus a phase 2 Q&A. That's the most direct answer to "the office feels light on bosses."
2. **It doesn't repeat anyone.** The IT Migration's natural moves ("your files moved," "the system is down") overlap the Reorg (the room changes) and the Mortgage and Watch (gap rings). Its best gag, "have you tried turning it off and on," means switching your weapons off, which takes away the one thing you don't control.
3. **The office story:** at 60 you're the senior person in the room, and the company still makes you sit through the quarterly. Everybody knows this meeting.

**The alternate, The IT Migration (for later):** a tired IT tech wheeling a server rack. "Progress bars" sweep across the floor as lanes with one gap marked "LEGACY" (a gap-line cousin of the Mortgage), and "Reboot" zones dim an area for 1.5 s where enemies freeze but so does your Coffee. Fun, but it overlaps the Reorg and Watch, and needs the most new rules.

### 2.1 How it coexists with the V8: **office gets the All-Hands instead of the V8 at 60**

- The V8 has a better stage now: it bursts out of your own garage in Maple Hollow. Keep it at **home** at 60.
- The office gets the All-Hands at 60. Then each map has its own 60 boss, and the office has 4 bosses home doesn't (Performance Review, New Boss, Reorg, All-Hands).
- **Both at once? No.** The 60 to 61 stretch was the old wall. Two bosses in that window would bring it back.
- **Sprint unlock:** today it's "beat the V8." Office-only players would lose it, so let the All-Hands achievement unlock Sprint too: `SPRINT.unlockAchievements: ["keepTheSedan", "couldBeAnEmail"]` (small code change, since today it's one key).
- **Alternate if Rami misses the V8 in the office:** a 60 rotation like the 56 slot, `bossSlot60: ["allHands", "midlifeCrisis"]`. I'd ship the replacement first.

### 2.2 Attack pattern: "The Deck"

- The presenter walks to a stage spot about 200 px from you, plants at a little podium, and clicks to the next slide.
- A **projector screen** behind him (about 120x72 world px) shows a big, simple icon of the next slide: bars, a pie or a rising line. That's the flavor cue. The **floor decal is the rule.**
- He cycles **Bar Chart, Pie Chart, Line Graph** in shuffled order, never the same one twice in a row.

**1. Bar Chart ("Q3 Results")**
- **4 vertical bars**, each **72 px wide x 300 px tall**, in a row across the view. One is centered on your x position; the gaps between bars are **104 px**.
- **Telegraph:** dashed outlines rising from the floor. **950 ms base, 750 floor** (it's an area attack).
- **Bars go live one at a time, left to right, 150 ms apart,** each for **600 ms.** Damage **2**.
- **Escape:** from the middle of a bar you need 36 + 24 = 60 px sideways: 260 ms at 230 (316 ms at 190). At the 750 floor, after 360 ms of reaction and lag, you have 390 ms. Fair.

**2. Pie Chart ("Budget Breakdown")**
- **12 slices of 30 degrees** around him, out to **240 px.** **4 slices** go live (5 in phase 2), never two side by side.
- **Telegraph:** the live slices fill in with lavender over **950 ms base, 750 floor.** Live for **700 ms.** Damage **2**.
- **Escape:** from the middle of a slice 200 px out, you need 52 + 24 = 76 px: 330 ms at 230 (400 at 190). Or step past 240 px. Fair at the floor for 230; at 190, walking outward is the safer read.
- Unlike the Mortgage, nothing expands. It's a static "where not to stand."

**3. Line Graph ("Up and to the Right")**
- A **28 px thick** line from the bottom-left of the view to the top-right, through a point within 80 px of you.
- **Telegraph:** a dashed line, **800 ms base, 550 floor** (it's a line attack).
- Then the line **draws itself** from the low end at **600 px/s** (with age scaling, about 744 at 60) and stays live for **400 ms** after it reaches the end. Damage **2**.
- **Escape:** step off it sideways: 14 + 24 = 38 px, 165 ms at 230.

**Timing:** first attack **2.0 s** after he's on screen; cooldown **4.2 s** after each slide ends.

### 2.3 Phase 2 (at or below 50% HP): **"Any questions?"**

- Every third slide is replaced by **Q&A.** Two **spotlights** (radius **64**) appear on opposite sides of you, **200 px** away, and follow you at **150 px/s** (65% of your speed; *not* scaled by age or Tax) for **5 s.**
- **Standing in a spotlight for 800 ms in a row = "Called On":** damage **2**, a "So, what do YOU think?" pop, and that spotlight dims for 1.5 s.
- **Keep moving and they never catch you.** It's the purest "reward moving" test in the office, right where the swarm is thickest.
- **No other attack starts during Q&A.**
- Phase 2 also shortens the cooldown to **3.6 s** and gives the Pie Chart a 5th slice.

### 2.4 Numbers

| | All-Hands | V8 (for comparison) |
|---|---:|---:|
| Base HP | **170** (**4.72x** the Performance Review's 36) | 200 (5.56x) |
| Effective HP at 60, Tax 0 | about **2,650** at level 16, **2,940** at level 18, **3,220** at level 20 | about 3,120 / 3,460 / 3,790 |
| Walk speed | **54** px/s (he's in no hurry; he has 47 slides) | 118 |
| Body damage | **2** (+3 for age, so 5) | 3 |
| Attack damage | **2** (5 with age) | 3, skids 1 |
| Target fight | **50 to 70 s** at the Watch spec's "decent build" (40 to 60 DPS) | |

- His HP is below the V8's because he stands still at the podium for every slide, so your weapons hit him about **85%** of the time. The V8 drives around in loops.
- Tax Bracket scaling as usual: HP +12% per bracket, hit damage +0.5, telegraphs -25 ms per bracket down to the floors, speed up to the 1.45 cap. Spotlight speed and the 800 ms dwell never scale.

### 2.5 What makes it readable on a phone
- **One slide at a time,** and the floor decal is the whole danger zone.
- Bars are 300 px tall and the pie is 480 px across, so both fit inside a 520 px phone view. The line graph is clamped to the view.
- The projector icon is big and simple (bars, pie or arrow, no text). Slide titles ("Q3 RESULTS") show in the `flashBanner` the **first time** each slide is used, then never again.
- Spotlights are bright cream circles with a dark edge. They're the only light-colored circles in the office at 60.
- **Swarm thinning, strong,** because 60 to 61 was the old wall: `spawnDelayMult 1.40`, `packSizeMult 0.70`, `maxOnScreenMult 0.70`, `eliteChanceMult 0.7`, `pauseKinds ["groupChat", "mathWorksheet", "calendarInvite"]`, `pauseEvents true`.
  - Group Chat pings and Math Homework spirals are what made 60 unreadable before; they pause while he's alive.

### 2.6 Counterplay tip
"Read the slide on the floor, not the screen: walk out of the dashed shapes, and keep moving when he asks for questions."

### 2.7 Drops and the defeat moment
- **Drops:** a **tier 5 chest**, the same as the V8 slot, plus a guaranteed **Desk Salad** ("the catered sandwich platter").
- **Achievement:** "Could Have Been An Email" (reward **8**), which also unlocks Sprint (see 2.1).
- **Defeat moment:** the projector clicks to a last slide (a big question mark), nobody asks anything, there's **one** slow clap, and the screen goes dark.
  - Knockdown word: "LET'S TAKE THIS OFFLINE."
  - Defeat line: "The meeting ended five minutes early. A miracle."
  - Gemini can write the variants.

### 2.8 Art needed
- A boss sheet in the shared 4x3 format (a presenter with a clicker and a lanyard, a podium on wheels).
- A projector screen prop (3 icon frames plus blank).
- Floor decals: a dashed bar, a pie slice, a dashed line, a spotlight.
- Until it lands: `tex: "performanceReview"` as the fallback, like the other new bosses.

---

## 3. Data objects (suggestions)

### `src/data/maple-hollow.js` (v2 additions)
```js
v2: {
  lotWidth: 416, houseW: 336, sidePathW: 64, gateW: 80,
  street: { band: 512, sidewalk: 64, parkway: 32, road: 320, parkingLane: 64 },
  backyard: { w: 416, h: 448 },
  spawn: {
    streetEdgeWeights: { left: 35, right: 35, top: 15, bottom: 15 }, // top/bottom snap to sidewalks and aprons only
    minPx: 260, rerollTries: 3,
    oneOpenEnd: { nearPathPx: 96, keepGateClearPx: 320 },
    backyardRow: { viaPathsFrac: 0.80, rowEndsFrac: 0.20, rowEndMinPx: 600, capFrac: 0.40 },
    mowerAlongStreetChance: 0.70, mowerAlongStreetDeg: 15
  },
  chokepoints: { pathCap: 6, gateCap: 4, stairsCap: 6, eliteCountsAs: 2, pathCellCost: 2.0 },
  parkedCars: { perPlate: [1, 2], w: 104, h: 56, minGapPx: 160, apronClearPx: 64 },
  house: {
    followKinds: ["bill", "taxNotice", "lateFee", "snackAttack", "leafPile", "backTwinge", "threeAmThought"],
    followNearStairsPx: 220, followDelayMs: 1200, followMax: 6, leashMs: 6000,
    bossFollowDelayMs: 2500, bossArriveMarkerMs: 1000,
    floor1Doors: { entry: 40, backDoor: 40, garage: 20 }, floor1Cap: 18,
    floor2RateMult: 0.5, floor2Cap: 12, hidingAfterMs: 20000, hidingRampMs: 5000, noSpawnNearPx: 200
  },
  yards: {
    youngFamily: { kind: "trampoline", airborneMs: 1200, landPushPx: 80, landRadius: 90, landDamage: 2, cooldownMs: 20000 },
    retirees:    { kind: "tomatoes", heal: 3, respawnMs: 60000 },
    grillDad:    { kind: "grill", standMs: 1000, standPx: 64, damageMult: 1.20, durMs: 15000, cooldownMs: 45000 },
    fixerUpper:  { kind: "tallGrass", patches: 2, w: 160, h: 120, enemySpeedMult: 0.6 },
    hoa:         { kind: "koiPond", coins: 3, respawnMs: 60000, sprinklerEveryMs: 6000, sprinklerTelegraphMs: 750, sprinklerDamage: 1, sprinklerPushPx: 60 },
    halloween:   { kind: "candyBowl", gems: 8, respawnMs: 75000 },
    yourPatio:   { kind: "firePit", radius: 80, healEveryMs: 3000, heal: 1, maxPerVisit: 6, cooldownMs: 60000 },
    pauseHealsDuringBoss: true
  },
  desk: { sitW: 64, sitH: 48, sitMs: 1000, cooldownMult: 0.85, durMs: 20000, cooldownMs: 90000, firstVisit: { levels: 1 } }
}
```

### `src/data/enemies.js` and `src/data/bosses.js`
```js
// enemies.js (+ "allHands" in BOSS_KINDS)
allHands: { name: "The Quarterly All-Hands", label: "Q3", tex: "performanceReview",
            spawnAge: 60, speed: 54, hp: 170, damage: 2, size: 58, color: 0x526078 },

// bosses.js
allHands: {
  style: "deck", bannerTitle: "ALL-HANDS", bannerSub: "Read the slide on the floor. Walk out of the shapes.",
  cooldownMs: 4200, firstAttackDelayMs: 2000, recoverMs: 300, standPx: 200,
  barChart:  { telegraphMs: 950, floor: "area", bars: 4, barW: 72, barH: 300, gapPx: 104, staggerMs: 150, liveMs: 600, damage: 2, title: "Q3 RESULTS" },
  pieChart:  { telegraphMs: 950, floor: "area", slices: 12, armed: 4, radius: 240, liveMs: 700, damage: 2, title: "BUDGET BREAKDOWN" },
  lineGraph: { telegraphMs: 800, floor: "line", halfW: 14, nearPlayerPx: 80, drawSpeed: 600, liveMs: 400, damage: 2, title: "UP AND TO THE RIGHT" },
  phase2: { atHpFrac: 0.5, cooldownMs: 3600, pieArmed: 5, qaEvery: 3,
            qa: { spots: 2, radius: 64, startPx: 200, speed: 150, scaleWithAge: false, durMs: 5000, dwellMs: 800, damage: 2, dimMs: 1500,
                  line: "So, what do YOU think?" } },
  drop: "salad",
  swarm: { spawnDelayMult: 1.40, packSizeMult: 0.70, maxOnScreenMult: 0.70, eliteChanceMult: 0.7,
           pauseKinds: ["groupChat", "mathWorksheet", "calendarInvite"], pauseEvents: true },
  koWord: "LET'S TAKE THIS OFFLINE", defeatLine: "The meeting ended five minutes early. A miracle."
}

// modes.js: office lists swap midlifeCrisis -> allHands (MAPLE_HOLLOW.bosses keeps midlifeCrisis)
// SPRINT.unlockAchievements: ["keepTheSedan", "couldBeAnEmail"]
// pickups.js: PICKUPS.bossChest.tiers.allHands = 5
```

---

## 4. What needs code beyond data
1. **Maple v2 layout builder** (lots, side paths, gates, the 512 px street band, backyards, two floors with stairs). It's in Claude's plan already; this spec just adds numbers.
2. **Stage-aware spawn picker:** edge weights, snapping only to sidewalks and aprons, the 260 px margin, the one-open-end rule, and the backyard-row share and cap.
3. **Per-cell flow-field cost** (side paths and gates at 2.0x) and a **queue cap** that blocks a full chokepoint for newcomers. Today every cell costs the same.
4. **Stairs:** a floor change that brings up to 6 nearby walkers after 1.2 s and bosses after 2.5 s, instead of the door's "delete everything far away." Doorway-only spawns per floor, plus the "hiding" ramp.
5. **Yard objects:** trampoline (airborne safe window plus a landing push), tomatoes, grill (stand timer plus buff), tall grass (enemy-only slow), koi pond plus sprinkler (a telegraphed arc), candy bowl, fire pit (heal aura with a per-visit cap). Plus ready sparkles on the minimap.
6. **The desk:** a sit timer, a weapon-cooldown buff, the first-visit level, and live score on the tablet.
7. **The All-Hands `deck` style** (three slide attacks plus the Q&A spotlights), the projector screen, the office-only boss list swap, and the Sprint unlock list.

## 5. Stats to watch after shipping
- **Maple v2:**
  - deaths in a side path or gate (log `died_in: "path" | "gate" | "street" | "yard" | "floor1" | "floor2"`): target **under 15%** of home deaths
  - time spent upstairs: **under 15%** of home run time
  - median age at death at home within **1 year** of the office
  - each yard's use count (aim for every yard used in at least 30% of home runs that reach 50)
  - desk visits per run
  - phone `slow_frame_pct` not up more than 5 points versus v1
- **All-Hands:**
  - kill rate **55 to 75%** of office runs reaching 60
  - median fight **50 to 70 s**
  - `boss_alive_at_death = allHands` **under 30%** of deaths at 60 to 62 (the V8 was the wall's partner before)
  - the share of office deaths at 60 to 61 not higher than with the V8
  - Q&A "Called On" hits per fight: about **1**
  - Sprint unlocks per week not down after the swap

## 6. Decisions for Rami
1. **Office 60:** the All-Hands *instead of* the V8 (spec default), or a 60 rotation of the two?
2. **Sprint unlock:** OK to also unlock it by beating the All-Hands?
3. **Upstairs:** "a few follow after a beat, bosses always follow" (spec), or upstairs as a true no-spawn breather?
4. **Desk:** the "Ship It" buff plus a first-visit level (spec), or a pure joke spot?
5. **HOA's yard:** the sprinkler does 1 damage to you. Keep that, or make it push-only?

## 7. What I couldn't verify
- **Maple v2 isn't built yet.** All v2 measurements come from Claude's brief and the ChatGPT art brief, not from code or art. Re-check them once Codex's JSON maps land.
- **Hero speed:** the brief says about 190 px/s; `PLAYER.speed` is 230 and I didn't find 190 anywhere. Path and dodge timings are given for both.
- **Hero body** at the v2 56 px drawing height: I used the old 48x52 body.
- **The floor plan's door and stair widths** are my reading of the image at 1 ft = 24 px (stairs about 72 px, hall about 84 px, doors 64 to 72 px).
- **All-Hands fight length** rests on the Watch spec's DPS estimates (40 to 60 for a decent build at 60). Not measured.
- Nothing was playtested.

---

## Claude's check (Nov 10, 8:45 AM)
- **Grok is right about speed:** `PLAYER.speed` is 230. "About 190" in my brief was wrong; use the 230 timings.
- Enemy keys in the spec (`mathWorksheet`, `groupChat`, `snackAttack`, `backTwinge`, `threeAmThought`, `lateFee`, `taxNotice`, `leafPile`) all exist in `src/data/enemies.js`.
- The spec depends on Maple v2 art that hasn't landed yet; layout numbers get re-checked against Codex's JSON maps.
- Open for Rami: the five decisions in section 6.
