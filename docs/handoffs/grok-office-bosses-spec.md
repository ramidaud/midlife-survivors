# Three new office bosses: The Reorg, The Holiday Party, Your New Boss (Age 26). Grok spec, Nov 8, 2026

**For:** Claude, implementing in `ramidaud/midlife-survivors` after Rami picks what to build
**From:** Grok (attacks, difficulty, balance lane)
**Repo state read:** `origin/main` at commit `86ee92d` (Nov 8, 2026, 11:33 PM ET), game version **V. 2.11.5**, build **291**
**Parent docs:** `docs/handoffs/grok-boss-attacks.md` (format and shared rules), `docs/handoffs/grok-gold-watch-spec.md` (duel thinning), `docs/handoffs/new-bosses-and-home-jobs.md` (the brief), `docs/handoffs/chatgpt-new-office-bosses.json` (sprite sheets and telegraph decals)

Spec only. No game code was edited. Every number below is a data value meant for `src/data/*.js`. Data keys are suggestions; re-find code symbols by name, since line numbers drift.

---

## 0. What I checked, and the house rules these specs follow

### Code facts (V. 2.11.5)

| Fact | Where | Value |
|---|---|---|
| Hero speed | `PLAYER.speed` | **230** px/s |
| Hero hit body | Arcade body | about **48x52** (Close Call notes) |
| Hurt safe window | `PLAYER.hurtCooldownMs` | **550** ms, applies to every boss hit (`hurtPlayer`) |
| Starting health | `PLAYER.maxHp` | **12** |
| Extra hit damage by age | `INTENSITY.hitDamageByAge` | +0 at 40, **+1 at 48**, **+2 at 55**, +3 at 62 |
| Boss HP at spawn | `spawnBoss` in `main.js` | `hp * (1 + (level-1)*0.28) * (1 + (age-40)*0.10) * (1 + Tax enemyHpMult)` |
| Tax Bracket | `heat.js` `perLevel` | +12% enemy and boss HP, +0.5 hit damage per bracket |
| Telegraph floors | `BOSS_ATTACK_TUNING` | `minTelegraphMs` **550**, `minTelegraphMsMortgage` **650**, `minTelegraphMsWatch` **700** |
| Telegraph and speed scaling | `BOSS_ATTACK_TUNING` | telegraph -4 ms per year past 40 and -25 ms per bracket, never below the floor; attack speed +1.2% per year, +4% per bracket, capped at 1.45x |
| Wall bonk | `BOSS_ATTACK_TUNING.wallBonk` | bounce 260 px/s for 320 ms, dizzy **850** ms |
| Boss queue | `BOSS_QUEUE` | one boss at a time, **8 s** breather after a kill, a waiting boss is never more than **3 years** late |
| Midlife bosses | `RUN_MODES.midlife.bosses` + `ENEMIES` | Performance Review **45** (hp 36), Mortgage **52** (hp 85), V8 **60** (hp 200), Gold Watch **63.5** (hp 150) |
| Full Life extras | `ENEMIES` | HOA 70 (210), Audit 79.2 (260), Pickleball 90 (340) |
| Attack styles | `src/boss-attacks.js` | `charge`, `rings`, `drift`; furniture is ignored during an attack, walls are not (bonk) |
| Swarm thinning | `BOSS_ATTACKS.goldWatch.swarm` via `GoldWatch.duel()` | **Gold Watch only** today. Other bosses fight on top of the full swarm |
| Boss chest | `PICKUPS.bossChest.tiers` | PR 1, Mortgage 3, V8 5, Watch 5; payout = coin face x 4 / 10 / 18 |
| Coin face | `coin401k.compoundTiers` | 1 until 55, **2 from 55** |
| Birthday cake | `HEALING.milestones` | 45 and 55 (18%), 50 and 60 (25%), 65 (22%) |
| Promotions | `START_AREA_LAYOUT.promotions` | doors open at 45, 50, **55 (Executive Wing)**, 60 (Wellness); `PROMOTIONS.openUpToAge` 60 |
| Desks | `src/start-area.js` | baked into floor art as static bodies in `propGroup`; invisible blockers fill pod gaps of 72 px or less (Nov 7, Rami got wedged) |
| Flow field | `src/navigation.js` | 32 px cells, rebuilt every **180** ms from `propGroup` plus `navExtraBlockers` |
| Spawning | `spawnBill` | packs appear just off one of the 4 view edges, picked at random each tick |
| Status effects | `main.js` | only one: Late-Night Donut slow, `slowFactor` 0.68 for 1400 ms. No freeze or root exists yet |
| Field items | `FIELD_ITEMS` | Fanny Pack, **Energy Drink** (35% faster, hits blocked while moving, 12 s), PTO Day (clears everything except bosses) |
| Phone view | `VIEW` | `targetShortSide` 640, `minZoom` **0.75**. A 390 pt wide phone sees about **520** world px across its short side |
| Swarm at the new ages | `SPAWNING.waves` | 45 adds Calendar Invites (straight chargers), **50 is the big jump** (everyMs 380, elites, Group Chat) |

### Where players die
Rami says about 50 on average. The latest numbers in the repo agree: the Nov 4 pass had a median of **49.6** over all runs and **52** over deaths only, phones average about **46**, and very few runs reach 65. I did not pull fresh telemetry for this spec.

### Rules shared by all three bosses
1. **One warning at a time.** Each boss shows one telegraph at a time, and nothing it does starts while a swarm event is spawning, a promotion door is opening, or a chest or level-up screen is up.
2. **Telegraphs never go below their floor.** The New Boss uses the existing 550 floor. The two area attacks (mistletoe, sliding desks) get a new **750** floor, because a phone player has to read a shape and find an exit, not just sidestep a line.
3. **Never trap the player.** No attack can leave you boxed in, pinned against a wall, or stunned while something is already swinging at you.
4. **Damage goes through `hurtPlayer`**, so the 550 ms safe window, armor, Fitness Tracker dodge, shields and the Energy Drink still work.
5. **Swarm thinning for every boss, not just the Watch.** Generalize `GoldWatch.duel()` into a check for "is any living boss carrying a `swarm` block" and use the same keys. This is a small code change; the numbers are per boss below.
6. **Tax Bracket: keep it as is.** HP +12% per bracket, hit damage +0.5, telegraph -25 ms per bracket down to the floor, attack speed +4% per bracket up to the 1.45 cap. The freeze length, zone count, desk count and dash count never scale with Tax.
7. **Reduced motion:** no shake on any telegraph. Shapes still draw, and pep-talk bubbles appear without bouncing.

### HP targets and the DPS guess behind them
The Performance Review at 45 has 36 base HP. At level 8 that is about **160** effective HP, about 25 to 40 seconds for a typical build. The Mortgage at 52 and level 11 is about **710**.

Level guesses: about **9 to 10 at 48** and **12 to 14 at 56**. DPS guesses on a boss: **6 to 9 at 48**, **10 to 16 at 56**. These are estimates from earlier passes, not measured.

| Boss | Base HP | x Performance Review (36) | Effective HP at spawn, Tax 0 | Target fight |
|---|---:|---:|---|---|
| Your New Boss (48) | **40** | **1.11x** | about 235 (L9) to 255 (L10) | 30 to 50 s |
| The Holiday Party (56) | **60** | **1.67x** | about 635 (L12) to 725 (L14) | 50 to 75 s |
| The Reorg (56) | **65** | **1.81x** | about 690 (L12) to 785 (L14) | 50 to 75 s |

At Tax 5 these grow by 60% (New Boss about 405 at L10, Reorg about 1,180 at L13). That is the same rule every other boss follows.

---

## 1. Your New Boss (Age 26)

*Half your age, twice your energy, and he thinks a fax is a type of podcast.* `game_key: newBoss`. A dash boss.

### Attack pattern: "Quick Sync" dash chain
- He walks after you at a jog. When he's on screen and his cooldown is up, he plants his feet, chugs (frame 6), crushes the can and does finger guns (frame 7), then dashes in a straight line (frames 8 and 9).
- **Phase 1:** a chain of **2 dashes**. After the first dash he stops, aims at where you are **now** (no leading or prediction), shows a new lane and dashes again.
- **Phase 2, "Second Can"** (at or below 50% HP): a chain of **3 dashes**, dash speed x1.10, walk speed x1.10. Every third chain ends in a **Sugar Crash**: he sits down for 2.0 s and you can hit him freely.
- After every chain he is **winded for 1.1 s** (thumbs up, frame 9) and stands still. That's your damage window.
- A dash that hits a wall uses the existing wall bonk (bounce, 850 ms dizzy, stars). His bonk word list could have "LOVE THAT ENERGY!" added.
- Contact while he's walking deals his normal body damage. Dash hits deal dash damage. Both go through the 550 ms safe window, so a 3-dash chain can hit you at most 3 times.

### Telegraph shape and timing
- **Shape:** the chevron dash lane from `telegraph-new-boss-v1.png` (coffee-orange chevrons, cream starburst at the end), laid from his feet to the dash end point. The lane is **88 px wide** (his 40 px dash body plus your 48 px body), so the drawn lane is the real danger zone.
- **Pep talk:** a speech bubble pops up above his head when each telegraph starts. Every attack gets one line (Gemini is writing 20 of them, under 8 words). The bubble is the *flavor* cue; the lane is the *rule*. Players never need to read the text to dodge.
- **First dash in a chain:** 650 ms base. That's about 618 ms at 48, and it hits the 550 floor around Tax 3.
- **Each follow-up dash:** 600 ms base, which reaches the 550 floor almost immediately. Never shorter.
- **First attack:** 1.8 s after he arrives on screen. **Cooldown:** 4.6 s from the end of the winded window.

### Speed
| Thing | Value | vs hero (230) |
|---|---:|---|
| Walk | **100** px/s (110 in phase 2; Sprint x1.25 applies) | 43% |
| Dash | **520** px/s base, about 570 at 48 with age scaling, 674 at Tax 5 | 2.3x to 2.9x |
| Dash length | **400** px, clamped to 80% of the view's short side (about 416 on a phone) | |

Dash speed doesn't change dodge difficulty. The aim locks when the telegraph starts, so all that matters is having time to step out of the lane. From the middle of the lane you need **44 px** sideways, which is **190 ms** at 230 px/s. At the 550 floor, after about 280 ms to react and 80 ms of joystick lag, you still have 190 ms to move. That's tight but fair at the floor, and comfortable at 618 ms.

### HP, damage
- `ENEMIES.newBoss`: hp **40** (1.11x Performance Review), speed **100**, body damage **1**, size 52 before boss scale.
- Dash damage **1**. With the +1 age bonus at 48, a dash or bump costs 2 HP.
- He's out of reach during dashes (Coffee aims at the nearest enemy), so his real damage uptime is about 70 to 80%. That's why his HP is only a little above the Review's.

### What makes it readable on a phone
- One lane on screen at a time, and the lane is the whole hurt box. No hidden width.
- The lane fits on a 520 px phone view: 400 px long, clamped to 80% of the short side.
- The pep bubble is one line, 12 px Silkscreen, cream with an orange border, kept inside the view and above the lower third. It shows during the telegraph and the dash, then fades 300 ms later.
- While he's alive, pause Calendar Invite spawns. They're straight chargers too, and two kinds of straight lines at once would be unreadable.

### Counterplay tip
"Step sideways off the arrows, then turn around and hit him while he's catching his breath."

### Swarm thinning while he's alive (light)
`spawnDelayMult 1.25`, `packSizeMult 0.80`, `maxOnScreenMult 0.80`, `eliteChanceMult 1.0`, `pauseKinds ["calendarInvite"]`, `pauseEvents true` (in particular no Back-to-Back wall at 48).

---

## 2. The Holiday Party

*The coworker who leads the conga line and will not let you leave.* `game_key: holidayParty`. The leader plus a line of ugly-sweater coworkers, plus mistletoe.

### The conga line
- **The leader** chases you slowly with the normal flow field (walk **62** px/s). He sways 12 px side to side for looks, but his hit box stays on the path.
- **Followers** (`ENEMIES.partyGuest`) walk on the leader's breadcrumb trail, recorded every 8 px, **34 px apart**. They copy his path exactly, so they go around desks the same way he did. Turn off their prop collisions while they're in line so they can't snag.
- **Count:** starts with **5**. One more joins every **8 s** in phase 1 (up to 5). In phase 2 one joins every **4 s**, up to **7**. Each join gets a little "+1" pop at the end of the line.
- **Followers are normal enemies with Bill numbers:** hp **3**, scaled like any enemy (about 16 at 56, level 13), contact damage **1** (3 at 56 with the age bonus), drop a gem. They count toward the screen cap. They don't hold the line together; they're just in it.
- **Breaking the line:** killing a follower, or knocking one out with a Dad Joke or "No." push, opens a gap. The followers behind it wait **500 ms** ("hey, wait up!"), then catch up at **1.6x** the leader's speed (about 99 px/s). That gap is a doorway you can walk through. A pushed-out dancer becomes a normal wanderer at Bill speed. PTO Day clears every follower, which is a fair and funny reward.
- **Bodies only, no extra damage.** The line hurts because it's a moving wall, not because it has its own attack.

### Attack pattern: "Mistletoe"
- He points his punch cup at you (frame 6), crouches with the mistletoe swinging (frame 7), and mistletoe circles appear on the floor.
- **Zones:** **2** in phase 1, **3** in phase 2. The first one is centered where you're standing, so you have to move. The others land 160 to 240 px from you, at least 100 degrees apart.
- **Zone radius: 56 px** (a 112 px circle; the 192x128 decal scaled to fit).
- **Placement rules:**
  - The edges of two zones are always at least **64 px** apart, so there's always a gap wider than you are.
  - A zone never touches a desk, a wall or a door (it skips any cell within 48 px of a blocked flow-field cell), so you can't get pinned between mistletoe and furniture.
  - A zone never covers a boss chest, salad or field item.
- **Armed time:** **2.4 s** after the telegraph, then it fades.

### The freeze: "Awkward Pause"
Walking into an armed zone (your body touching the 56 px circle):
- **You're stuck for 600 ms.** Movement input is ignored and your hero does the awkward pose with a "...hi" bubble.
- **You can't be hurt during that time or for 400 ms after (1.0 s total).** The freeze costs time and position, not health.
- **Personal space:** at the moment you freeze, regular enemies within **120 px** get a gentle 80 px shove ("excuse me"), using the existing shove. Bosses and conga followers don't move.
- The zone that caught you **pops**, and you're immune to mistletoe for **2.5 s**.
- **No follow-up:** none of his attacks can *start* until **1.5 s** after the freeze ends.
- **Never twice in a row:** at most one freeze every 3 s, no matter what.
- If you're already slowed by a donut, the slow timer pauses during the freeze and resumes after. They don't stack.
- An active Energy Drink makes you immune to mistletoe (you're too wired to stop).
- Accessibility or fallback knob: `freezeMode: "slow"` turns the freeze into **0.35x speed for 900 ms** instead of a full stop, with the same safe window. Use it if playtests say the stop feels bad on phones.

**Why 600 ms:** that's long enough to feel awkward and lose your spot, and shorter than one Late-Night Donut slow (1400 ms). It's also only slightly longer than the 550 ms safe window that already follows every hit. One input means a full second of no control would be too much; 0.6 s plus guaranteed safety is the "awkward second" with the cruelty taken out.

### Phase 2, "Last Song" (at or below 50% HP)
3 zones, leader walk **70** px/s, up to 7 followers, and a new alternate attack, **Group Hug**: a short lunge using the existing `charge` move. **700 ms** telegraph (550 floor), **300** px/s, **200** px long, damage **1**, the same lane-style warning in pink and lavender. In phase 2 he alternates Mistletoe and Group Hug, and the 1.5 s no-follow-up rule still applies.

### Telegraph shape and timing
- **Mistletoe:** dashed lavender and pink ring outlines grow to full size over the telegraph, with the mistletoe decal fading in, then they turn **solid** when armed. Dashed means coming; solid means live. **1000 ms base** (about 936 at 56), new floor **750 ms**.
- **Escape math:** from the center of a zone you have to move 56 + 24 = 80 px, which is 350 ms at 230 px/s. At 936 ms you have about 580 ms to spare. At the 750 floor, about 390 ms. Comfortable.
- **First attack:** 2.0 s after he's on screen. **Cooldown:** 5.2 s.

### Speed
Leader **62** px/s (70 in phase 2), followers match him, catch-up **99** px/s, Group Hug **300** px/s with age scaling (about 358 at 56). All slower than you except the short hug.

### HP, damage
- `ENEMIES.holidayParty`: hp **60** (1.67x Performance Review), speed 62, body damage **2**, size 56 before boss scale.
- Followers soak some Coffee shots (Coffee aims at the nearest enemy), which is why the leader's HP is below the Reorg's at the same age.

### What makes it readable on a phone
- A thin 2 px tinsel strand links the dancers, so the line reads as **one object** and not seven separate enemies. Only the leader gets an HP tag; followers have no name tag.
- At most 3 circles at once, each 112 px across on a 520 px view, with one shape language: dashed then solid.
- Pause **Late-Night Donut** spawns while he's alive, so a slow can't lead straight into mistletoe. Pause Calendar Invites so the Group Hug lane is the only straight line.

### Counterplay tip
"Never stand still when mistletoe drops, and pop a dancer to open a door in the line."

### Swarm thinning while he's alive (medium)
`spawnDelayMult 1.35`, `packSizeMult 0.70`, `maxOnScreenMult 0.70`, `eliteChanceMult 0.6`, `pauseKinds ["snackAttack", "calendarInvite"]`, `pauseEvents true`.

---

## 3. The Reorg

*A cheerful consultant with a whiteboard, here to rearrange everything.* `game_key: theReorg`.

### The fairness decision: bring new desks, don't move the old ones
**Don't slide the office's own desks.** They're baked into the floor art, they have seated coworkers and chair mats, and the gap blockers added on Nov 7 exist because a 72 px gap already wedged Rami once. Moving them means seams in the art, hidden pinch points and a flow field that can't trust its own furniture.

Instead, **The Reorg brings his own furniture:** **Hot Desks**, rolling desks on casters (a new prop, about 96x56 body). He rolls them in when he arrives and slides them around during the fight. When he goes down, they lose collision right away and roll off or fade over 600 ms. The room "goes back to normal," and nobody stays stuck.

### Attack 1, "Restructure": desks slide
- **Arrival:** he places **3** Hot Desks 180 to 300 px from you, each with its own 900 ms ghost outline first. Phase 2 adds a 4th.
- **Restructure:** he spins the whiteboard (frame 6), raises the marker (frame 7), slashes an arrow (frame 8) and finishes with a ta-da (frame 9). Then **2** desks (3 in phase 2) slide **in a straight line along one axis** (no diagonals), **128 to 224 px**, all at the same time.
- **Slide speed:** **240** px/s, *not* scaled by age or Tax. A desk is terrain, so it should always move at the same readable pace.
- **Never on the player:** at telegraph time, a destination can't overlap your body plus a 24 px margin. If you walk into a desk's path during the slide, it **stops 8 px short of you**. It doesn't push, crush or hurt you.
- **No new pinch points:** a desk either ends flush against another solid or leaves a gap of **96 px or more**. Never anything in between, since gaps of 72 px or less are exactly what wedged you in Marketing. It also never ends inside a door, a gate (plus 64 px) or a wall.
- **Never boxed in:** before committing the moves, flood-fill the flow field from your cell with the desks at their destinations. You must still reach **at least two different view edges** through a corridor at least **2 cells (64 px) wide**. If not, re-roll the move (up to 3 tries), otherwise skip that desk.
- **Rebuild the flow field the moment the slide ends.** Add something like `NAV.invalidate()` that resets `lastBuild`, so enemies don't spend 180 ms walking toward a desk that moved.
- Hot Desks block enemies too. Using them as cover is the intended reward for reading the room.

### Attack 2, "New Org Chart": spawn points move
- Right now every pack appears just off a random edge of the view. For **6 s**, the org chart sends **all regular spawns** to one corner: two adjacent edges picked at random. Phase 2 uses **one edge for 8 s**, which then hops once to the opposite edge with a fresh 900 ms marker.
- **Routing only.** No extra enemies or bigger packs; the same swarm just comes from a known direction.
- Swarm events are already paused during his fight, so nothing else changes spawn sides at the same time.

### Attack choice and timing
- Weighted pick: Restructure **60**, New Org Chart **40**. Never the same attack 3 times in a row.
- **Restructure telegraph:** a ghost outline at each destination (the dashed rectangles from `telegraph-reorg-v1.png`) plus an orange arrow along each desk's slide path. **1000 ms base** (about 936 at 56), new floor **750 ms**.
- **Org Chart telegraph:** orange chevrons on the chosen screen edges, drawn on the HUD so they're always on screen, **1200 ms** before the first rerouted spawn (floor **900**).
- **First attack:** 2.2 s after he's on screen. **Cooldown:** 5.0 s.
- **During the telegraph and the slide (about 1.8 s), he stands still at his whiteboard.** That's his damage window.

### Speed
Walk **58** px/s (slowest boss; he's pushing a whiteboard), desks **240** px/s, slides take 0.5 to 0.9 s.

### HP, damage
- `ENEMIES.theReorg`: hp **65** (1.81x Performance Review), speed 58, body damage **2**, size 58 before boss scale.
- **Neither attack deals damage directly.** Desks never hurt; the danger is the swarm coming through the new layout from a new direction. That makes him the most "fair" boss on paper and the most likely to catch players who don't look at the arrows.

### What makes it readable on a phone
- A desk is a big thing to watch: 96 px on a 520 px view. Ghost outline plus arrow is a familiar "furniture moving" picture.
- Spawn-side markers live on the HUD layer, at the screen edges, so they never scroll off.
- At most 3 sliding desks and 2 edge markers at once. No text required; the banner shows only the first time.
- No slide starts while a promotion door is animating, and Hot Desks keep 64 px clear of every gate.

### Counterplay tip
"Watch the arrows, not the desks: move away from the side the org chart lights up, and use a Hot Desk as a wall."

### Swarm thinning while he's alive (medium)
`spawnDelayMult 1.30`, `packSizeMult 0.75`, `maxOnScreenMult 0.75`, `eliteChanceMult 0.8`, `pauseKinds ["calendarInvite"]` (straight chargers and moving desks don't mix), `pauseEvents true`.

---

## 4. Ages

### Recommendation
| Age | Boss | Status |
|---:|---|---|
| 45 | Performance Review | existing |
| **48** | **Your New Boss (Age 26)** | new, every run |
| 52 | 30-Year Mortgage | existing |
| **56** | **The Reorg *or* The Holiday Party** | new, one per run (a "middle management" slot) |
| 60 | Midlife Crisis V8 | existing |
| 63.5 | Gold Watch | existing |

**Why 48 for the New Boss:**
- It fills the biggest early gap (45 to 52) and sits **before** the age-50 jump in the swarm. A 30 to 50 s fight usually ends around 49, which leaves about a year before 50.
- Most players (median around 50) will meet him, so the boss most people see is the cheapest, clearest and funniest one: one lane, one rule.
- The Review usually falls by about 46. With the 8 s breather, 48 rarely queues behind it.
- It lands on the +1 hit damage step at 48, which is why his base damage is 1 and not 2.

**Why 56 for the other two:**
- Halfway between the Mortgage (52, fights often run to about 54) and the V8 (60, the old 60 to 61 wall), with about 2 to 3 years of quiet on each side.
- It follows the **55 birthday cake** (18% heal) and the **Executive Wing promotion at 55**, so the story beat is "you got promoted, and now there's a consultant." 56 rather than 55 keeps the promotion banner, the cake banner and a boss spotlight from landing in the same second.
- These two are the more complex fights (room changes, freezes), so only players who already got past the Mortgage see them.

**Why rotate them instead of running both:**
- Midlife already has 4 bosses in 25 years. Adding all three puts 5 boss fights in 15 years (45 to 60). With an 8 s breather and 50 to 75 s fights, nearly every year from 52 to 60 would have a boss in it, and the 60 to 61 wall would come back.
- A rotating slot also gives a roguelite reason to replay ("which one did I get?"). Optional: weight the Holiday Party 3 to 1 in December.
- Implementation: something like `RUN_MODES.midlife.bossSlots: [{ age: 56, pick: ["theReorg", "holidayParty"] }]`, resolved once at run start. That's a small code change, not just data.

**If Rami wants both every run anyway:** Holiday Party at **55.5**, Reorg at **57.5**. Expect more deaths at 56 to 59 and a bigger V8 queue, and watch the 58 to 61 death share closely. I'd ship the rotation first.

**Full Life:** use the same ages. It runs 60 s per year instead of 45, so every gap is a third longer.

---

## 5. Drops

Each new boss uses the existing systems: a chest tier, the 5 boss coins every boss already drops, one **guaranteed** field pickup that fits the joke, and an achievement in the same coin range as the others.

| Boss | Chest tier | Guaranteed pickup | Achievement (names are placeholders for Gemini) |
|---|---:|---|---|
| Your New Boss (48) | **1** (like the Review) | **Energy Drink** field item: "He left his spare can." 35% faster and hit-proof while moving for 12 s, right before the age-50 swarm. | "Circle Back Later": beat Your New Boss. Reward **6** |
| The Holiday Party (56) | **3** | **Desk Salad** ("party platter leftovers"), 22% of max HP, min 3, through `healAmt` so Tax trims it. The freeze fight earns a heal. | "Left Before The Slideshow": beat The Holiday Party. Reward **8** |
| The Reorg (56) | **3** | **Fanny Pack** ("everything consolidated"): every gem and coin on screen comes to you. | "Org Chart Survivor": beat The Reorg. Reward **8** |

- Chest coins: at 48 coin face is 1, so tier 1 pays 4 before banking. At 56 face is 2, so tier 3 pays 20 before banking, the same as a late Mortgage. Both slot-56 bosses pay the same, so the rotation is fair.
- A guaranteed pickup skips its normal random chance, but still respects `ITEM_DROPS.maxOnFloor` and salad `maxOnGround`. If the floor is full, convert it to 3 gems, the way extra salads already do.
- Keepsake or lore entries: optional and cosmetic. No new reward systems.
- Data note: the boss's energy drink is flavor. Don't reuse the `energyDrink` key for boss tuning; that key is the player's field item.

---

## 6. Data objects (suggestions, copy and adjust)

### `src/data/enemies.js`
```js
newBoss: {
  name: "Your New Boss (Age 26)", label: "MGR", tex: "performanceReview", // fallback until ChatGPT's sheet lands
  spawnAge: 48, speed: 100, hp: 40, damage: 1, size: 52, color: 0xBFA8CF
},
holidayParty: {
  name: "The Holiday Party", label: "PARTY", tex: "mortgageRefinance",
  spawnAge: 56, speed: 62, hp: 60, damage: 2, size: 56, color: 0xC45C4B
},
partyGuest: { // conga follower, a regular enemy (not in BOSS_KINDS)
  name: "Conga Coworker", label: "", speed: 62, hp: 3, damage: 1, size: 24, color: 0x83A89A
},
theReorg: {
  name: "The Reorg", label: "ORG", tex: "performanceReview",
  spawnAge: 56, speed: 58, hp: 65, damage: 2, size: 58, color: 0x526078
},
// and add "newBoss", "holidayParty", "theReorg" to window.BOSS_KINDS
```

### `src/data/bosses.js`
```js
// BOSS_ATTACK_TUNING additions
minTelegraphMsArea: 750,        // mistletoe zones and sliding desks: read a shape, find the exit
minTelegraphMsEdgeMarker: 900,  // Reorg spawn-side markers

// BOSS_ATTACKS additions
newBoss: {
  style: "dashChain", bannerTitle: "QUICK SYNC", bannerSub: "He's dashing. Step off the arrows.",
  telegraphMs: 650, chainTelegraphMs: 600, cooldownMs: 4600, firstAttackDelayMs: 1800,
  dashSpeed: 520, dashMaxDist: 400, dashMaxViewFrac: 0.8, chainCount: 2,
  windedMs: 1100, bodyHalfW: 20, bodyHalfH: 24, damage: 1,
  pepTalk: true, pepBubbleFadeMs: 300, // lines from Gemini, one per telegraph
  phase2: { atHpFrac: 0.5, chainCount: 3, dashSpeedMult: 1.10, walkSpeedMult: 1.10, crashEvery: 3, crashMs: 2000 },
  swarm: { spawnDelayMult: 1.25, packSizeMult: 0.80, maxOnScreenMult: 0.80, eliteChanceMult: 1.0, pauseKinds: ["calendarInvite"], pauseEvents: true }
},
holidayParty: {
  style: "conga", bannerTitle: "MISTLETOE", bannerSub: "Don't stop under the mistletoe.",
  telegraphMs: 1000, cooldownMs: 5200, firstAttackDelayMs: 2000, recoverMs: 300,
  conga: { start: 5, max: 5, joinEveryMs: 8000, spacingPx: 34, crumbEveryPx: 8, swayPx: 12, waitMs: 500, catchUpMult: 1.6 },
  mistletoe: { zones: 2, radius: 56, nearMinPx: 160, nearMaxPx: 240, minAngleDeg: 100, edgeGapPx: 64,
               propClearPx: 48, armedMs: 2400, freezeMs: 600, safeAfterMs: 400, immuneMs: 2500,
               noFollowUpMs: 1500, minGapBetweenFreezesMs: 3000, shoveRadius: 120, shovePx: 80,
               freezeMode: "stop", slowAltMult: 0.35, slowAltMs: 900 },
  phase2: { atHpFrac: 0.5, zones: 3, walkSpeed: 70, congaMax: 7, joinEveryMs: 4000,
            groupHug: { telegraphMs: 700, chargeSpeed: 300, chargeMaxDist: 200, bodyHalfW: 22, bodyHalfH: 26, damage: 1 } },
  swarm: { spawnDelayMult: 1.35, packSizeMult: 0.70, maxOnScreenMult: 0.70, eliteChanceMult: 0.6, pauseKinds: ["snackAttack", "calendarInvite"], pauseEvents: true }
},
theReorg: {
  style: "reorg", bannerTitle: "RESTRUCTURING", bannerSub: "Desks are moving. Follow the arrows.",
  cooldownMs: 5000, firstAttackDelayMs: 2200, recoverMs: 300, weights: { restructure: 60, orgChart: 40 },
  hotDesks: { count: 3, bodyW: 96, bodyH: 56, placeMinPx: 180, placeMaxPx: 300, placeTelegraphMs: 900, despawnFadeMs: 600 },
  restructure: { telegraphMs: 1000, moves: 2, slideMinPx: 128, slideMaxPx: 224, slideSpeed: 240, scaleWithAge: false,
                 playerMarginPx: 24, stopShortPx: 8, flushOrMinGapPx: 96, gateClearPx: 64,
                 reachEdgesMin: 2, corridorCellsMin: 2, rerollTries: 3 },
  orgChart: { markerLeadMs: 1200, durationMs: 6000, edges: 2 },
  phase2: { atHpFrac: 0.5, hotDeskCount: 4, moves: 3, orgChart: { durationMs: 8000, edges: 1, hopOnce: true } },
  swarm: { spawnDelayMult: 1.30, packSizeMult: 0.75, maxOnScreenMult: 0.75, eliteChanceMult: 0.8, pauseKinds: ["calendarInvite"], pauseEvents: true }
}
```

### `src/data/pickups.js`
```js
tiers: { ..., newBoss: 1, holidayParty: 3, theReorg: 3 }
```

### Banner copy
Placeholders, shown once per run like the others; Gemini owns the final lines: QUICK SYNC / "He's dashing. Step off the arrows." · MISTLETOE / "Don't stop under the mistletoe." · RESTRUCTURING / "Desks are moving. Follow the arrows."

---

## 7. Interactions
- **Close Calls:** dash lanes and the Group Hug count as boss attacks for Close Calls (with the existing 1.2 s boss cooldown). Mistletoe zones and Hot Desks never count, the same rule as V8 skids. Conga followers count as regular enemies.
- **Dad Joke:** damages all three bosses, which ignore the push as usual. It *does* push conga followers, and a pushed one leaves the line (see section 2).
- **Run modifiers:** none roll while a boss lives, already true.
- **Comfort Zone Tax:** a freeze isn't a hit, so it doesn't end Comfort Zone. Any real hit still does.
- **Interns and Lounge:** follow the existing boss rules.
- **Sprint:** walk speeds get the 1.25x enemy multiplier through `spawnBoss`. Attack speeds don't, but your speed also goes up 1.25x, so dodge math holds. Freeze length and desk slide speed stay the same.
- **Phones zoomed to 0.75:** every telegraph above fits inside a 520 px short side.

---

## 8. Stats to watch after shipping
For runs that reach each boss's spawn age, over the next 40 or so:

| Metric | Target |
|---|---|
| New Boss kill rate | **80%** or higher; median fight **30 to 50 s** |
| Holiday Party and Reorg kill rate | **60 to 75%** each; median fight **50 to 75 s**; within 10 points of each other (it's a coin flip which one you get) |
| Deaths with `boss_alive_at_death = newBoss` | under **15%** of deaths at 48 to 50 |
| Deaths at 48 to 50 as a share of all deaths | not up more than about 5 points from today |
| Median age at death, Tax 0 | not down more than **1 year** |
| Mistletoe freezes per Party fight | **1 to 3** on average |
| Deaths within 2 s after a freeze ends | under **10%** of Party deaths (add `party_freeze_deaths`) |
| Reorg unstick events (player overlapping a desk after a slide) | **0** (add `reorg_unstick`; any hit is a bug) |
| Average dash hits per New Boss chain | under **0.8** |
| Phone vs desktop kill-rate gap per boss | under **15** points |

Add if easy: `boss_fight_ms` per boss and `boss_slot_56` (which one the run got).

---

## 9. Knob order (small and reversible)
If a fight feels wrong, change one knob at a time, in this order:
1. **New Boss too hard:** `chainCount` 2 -> 1 in phase 1, then `windedMs` 1100 -> 1400. Too easy: `phase2.crashEvery` 3 -> 0 (no crash).
2. **Party too hard:** `freezeMs` 600 -> 450, then `freezeMode: "slow"`, then `zones` 2 -> 1 in phase 1. Too easy: `armedMs` 2400 -> 3000.
3. **Reorg too hard:** `orgChart.durationMs` 6000 -> 4500, then `restructure.moves` 2 -> 1. Too easy: `orgChart.edges` 2 -> 1 in phase 1.
4. **Any of them too long:** base HP down 10%. Too short: up 10%.
5. **Last resort:** move the age. Don't touch Tax Bracket, `bossHpPerLevel`, `bossHpPerYear` or the telegraph floors.

---

## 10. Acceptance notes
1. All three go chase -> telegraph -> attack -> recover with no stuck states, including when they die or leave mid-attack.
2. Helper test: no telegraph goes below 550 (dash), 750 (zones, desks) or 900 (edge markers) at age 65, Tax 5.
3. A dash aim is locked at telegraph start. Standing 50 px off the lane center takes no damage.
4. Mistletoe: a freeze never lasts more than 600 ms, no damage lands for 1.0 s from its start, and no new attack starts within 1.5 s of it ending. Two freezes are never less than 3 s apart.
5. Zones never overlap each other, a desk or a door, and the first zone always has a 64 px or wider exit.
6. A Hot Desk never stops overlapping the player, never leaves a gap between 1 and 95 px, and the flood fill always reaches 2 view edges. Force-test with `?forceBoss=theReorg` in the tightest room (Marketing pods).
7. When the Reorg dies, Hot Desks stop colliding right away and the flow field rebuilds the same frame.
8. While any of the three lives, its paused kinds don't spawn and swarm events don't fire. Normal spawning resumes on the next tick after it dies, and existing enemies aren't deleted.
9. Reduced motion: no telegraph shake, the pep bubble doesn't bounce, and every shape still draws.
10. The Gold Watch, HOA, Audit and Pickleball are unchanged.

---

## Rami's answers (Nov 8)
1. Take turns at 56 for now; both once the Mortgage and V8 move to Home.
2. Slow, not stop: `freezeMode: "slow"`.
3. Hot Desk prompt added to `chatgpt-new-office-bosses.json`.
4. Build order: Your New Boss first.

## 11. Open questions for Rami
1. Rotation slot at 56, or both bosses every run (55.5 and 57.5)?
2. Freeze as a 600 ms full stop (spec default) or the 0.35x slow?
3. Hot Desks need new art (a desk on casters, a 96x56 footprint). It isn't in `chatgpt-new-office-bosses.json` yet.
4. Generalizing swarm thinning from the Gold Watch to all bosses would also apply to the existing three if they get `swarm` blocks. That's not part of this spec; their numbers stay as they are.
