# The in-run attention budget: every message, how often, what collides, and a limit. Grok reply, Nov 10, 2026

**For:** the design lead writing `docs/design/design-system-v1.md` (Fable's UI/UX pass), and Claude for the build
**From:** Grok (attacks, difficulty, balance lane)
**Answers:** `docs/handoffs/grok-ui-attention-budget.md` (Claude's brief, Nov 10). Saved in the repo as `grok-ui-attention-budget-reply.md`, the name the brief asks for, so it doesn't overwrite the brief.
**Repo state read:** `origin/main` at commit `1d8fc72` (Nov 10, 2026, 9:07 AM ET), game version **V. 2.25.0** ("Version Two"), build **327**
**Rami's question:** "It's hard to tell where I should be looking."

Spec only. No game code was edited. Numbers are data values meant for `src/data/*.js`. Code symbols are named so they can be re-found; line numbers drift.

**The short answer:**
- **How much is on screen:** a typical office run from 40 to 65 puts about **110 messages** on screen, plus about **31 pausing menus**. That's **5.8 to 7.7 messages a minute** from 45 on, and **8.5 to 12** a minute in Overtime.
- **Busiest minute:** the one starting at **44.5**, with about **15 messages in 60 s**.
- **Worst collision:** every boss's intro card is still up when its first attack's banner and first telegraph land.
- **The fix:** **1 headline + 1 ticker at a time**, a **quiet window around telegraphs**, four merges and a handful of demotions. In the model that cuts total messages by about **29%**, and messages that start during a telegraph by about **90%**.

---

## 0. How I counted

- **The inventory** is from a grep of every in-run text source in `src/` and `index.html`: `flashBanner`, `showLowerThird`, `firstTimeTip`, `pushContextEvent`, `Spotlight.*`, `showBossToastUI`, every `add.text(` call, and every `position:fixed` in-run element.
- **Frequencies** come from a Monte Carlo script over the data tables, 600 runs per case: `/workspace/midlife/sim/attention-sim.js`.
  - Run it with `node attention-sim.js 600` for the current game, or `node attention-sim.js 600 budget` for the proposal.
  - It replays the real queue rules: the lower third's priorities, interrupt, drop and 5-message queue; the Spotlight's priorities, 15 s gap and boss cut-in; the lower third waiting up to 15 s behind a card; and the single center-flash slot.
- **What the model takes from the code:** boss ages, the first-attack delay and cooldown for each boss, promotion ages (45/50/55/60), errand rules (3 per run, from 41.5, 120 s gap), cakes and dividends every 5 years, chapter lines each decade, swarm event spacing (80 s, down to 60 s at 60), the modifier roll rules, intern spacing by age, the Overtime beat schedule, Workload windows, and the Spotlight and lower-third rules.
- **What I assumed** (everything the code can't tell me):
  - fight lengths
  - errand success (80%, done in 15 to 40 s)
  - intern chases (30%)
  - Comfort Zone Tax odds per minute (0.12 before 50, rising to 0.45 past 65)
  - level-up timing taken from the `LEVELING.catchUp.byAge` "typical level" table
  - a Gold Watch arriving 2.7 years before 80 in Overtime
- **Screen positions** come from the CSS for a 390x844 phone (portrait) and a desktop. I did **not** render them. Fable's Playwright audit will measure the real boxes.

---

## 1. Inventory of every in-run message

**Screen regions used below:**
- **TOP HUD:** XP bar, age and timer, score and coins, loadout.
- **CHIPS:** the top-center chip stack.
- **CENTER-HIGH:** the center flash at 30% height, and the catch card at 14%.
- **WORLD:** Phaser text that moves with the hero and enemies.
- **BOTTOM:** the Spotlight band and the lower third.
- **MODAL:** a menu that pauses the game.

**Phone geometry, from the CSS:**
- The hero sits at about y 422 of 844.
- Most boss telegraphs reach about 260 world px from the hero, so they fill **y 225 to 620** on a phone.

### 1a. Overlays (DOM)

| # | Message | Code | Where (desktop / phone) | Size | Lasts | Trigger | Priority rule | Pauses? |
|---|---|---|---|---|---|---|---|---|
| 1 | **Center flash** | `ui.js` `flashBanner` | 50% wide, **30% height**, z-index **60** (above menus at 30) / phone y about 228 to 278 | title 16 to 34 px + sub 12 to 16 px | **1.9 s** | 22 direct calls (see below), plus every `alert` lower third, plus `reward` ones (each badge at most once a minute) | **none**: one slot, the newest call wins (`clearTimeout`) | no |
| 2 | **Lower third** | `ui.js` `showLowerThird` | bottom center, 18 px + safe area, `min(720px, 100vw - 32px)`, z 12 / phone y about 732 to 792 | 1 to 2 lines, 16 px (14 on phone) | 2.2 to 7 s (default 4.5) | 89 call sites in 28 files | `LT_PRIORITY`: alert 5, win 4, errand 4, tip 3, promo 3, chapter 2, reward 1, lore 1, joke 0. Higher interrupts; reward and lore are dropped when busy; queue of 5; 450 ms gap. Waits up to 15 s for a Spotlight card (except LOW HP and SECOND OPINION) | no (holds while a menu is open) |
| 3 | **Spotlight card** | `spotlight.js` | full-screen layer, z 9: 44 px letterbox bars top and bottom, a dark gradient over the **lower 60%** (up to 72%), a 138 px band (phone x0.62, lifted 86 px, so y about 625 to 711), a speech bubble above it (phone up to about y 530), and a tip line | big | **6 s** (special cards 5 to 6.5 s) | **boss** (every boss, every run), **hire** (every run start), **room** (each promotion), **lounge** (once a run), **tip** (first time ever, at most 2 a run), **event** (the yellow note, Gold Watch clock-out) | `PRI` boss 3, event 3, hire 2, room 1, lounge 1, tip 0. A **15 s gap** between non-boss cards; a card waits for a lower third to finish; bosses and events cut in | no (tap to dismiss) |
| 4 | Boss toast | `ui.js` `showBossToastUI` | top center, `margin-top 84px` | big | 3.4 s | only if a boss has no Spotlight entry, or on a stage change. Both are **effectively dormant** now (the start-area maps pin `STAGES[0]`) | none | no |
| 5 | **Catch card (GOTCHA!)** | `catch-moment.js` | phone: top **14%**, `min(340px, 86vw)` wide, z 46 / desktop landscape: 50% + 64 px, top 22% | card + slot reel | about 2 s, in slow motion | catching a running intern | none | slow motion |
| 6 | Errand chip + arrow | `errands.js` | top center **128 px** / phone full width at **236 px**; arrow at the screen edge | 1 line | up to 45 s countdown | 3 a run, from 41.5, 120 s after each ends. **Doesn't wait for bosses** | none | no |
| 7 | "Checked off" buff chip | `errands.js` | left 12, top 118 (no phone rule) | small | 15 s | errand done | none | no |
| 8 | Modifier chip | `modifiers.js` | top center **112 px** (**no phone rule**) | 1 line | 2 to 2.5 years (90 to 112 s) | a modifier rolls (50+) | one modifier at a time | no |
| 9 | Workload chip | `workload.js` | top center 100 / phone **92** | pips | always on past 65 in Overtime | Overtime | none | no |
| 10 | Key hunt chip | `key-hunt.js` | same slot as the errand chip | 1 line | until found | Maple Hollow | none | no |
| 11 | Overtime beat chip + arrow | `overtime-beats.js` | same slot as the errand chip | 1 line | 10 to 20 s windows | 64, 66, 68.5, 70/72.5, 75.8 | the scheduler skips a beat near a boss or the Watch | no |
| 12 | Minimap + room label | `minimap.js` | top right 232x184 / phone 172x136 at 58 px (x about 212 to 384, label to about y 218) | | always | | | no |
| 13 | Reorg edge arrows | `reorg.js` | screen edges, z 21 | 12 px | during the Reorg | boss | | no |
| 14 | "Move to start" hint | `first-minute.js` | bottom 22% | | until your first step | the first 3 runs | | no |
| 15 | Sound nudge | `sfx.js` | top center, 70 px, z 70 | button | until tapped | audio blocked | | no |
| 16 | Shift briefing | `main.js` | top 15%, card | card | until dismissed | run start | | **yes** |
| 17 | Level-up / Performance Bonus | `main.js` `showLevelUp`, `perf-bonus.js` | modal | full | until you pick | about **23** level-ups a Midlife run, plus a free pick after 75 s without one, from 55 | queue (`pendingLevels`) | **yes** |
| 18 | Bonus chest | `bonus-chest.js` | modal | full | until OPEN | each boss chest, the spare-key door, beat rewards | | **yes** |
| 19 | Lounge / Lemonade Stand | `lounge.js` | modal | full | while browsing | after each office promotion (35 s window), at home from the start | | **yes** |
| 20 | Minimap big view | `minimap.js` | modal, z 60 | full | until closed | tap / M | | yes |

**The 22 direct `flashBanner` calls:**
- **Boss first attacks** (`announced`, one per boss, every fight): Review, New Boss, Mortgage, V8 and HOA via `boss-attacks.js`; the Party, Reorg, Math Homework and All-Hands via their own files; plus the Gold Watch phases and its "FIVE O'CLOCK"
- **Phase 2:** Math Homework and the All-Hands ("ANY QUESTIONS?"), plus the All-Hands' first use of each slide
- **Modifiers** (`modifiers.js`, which then *also* calls an alert lower third, so the same flash fires twice)
- **Errand start** ("TO-DO")
- **Overtime beats:** enrollment, grandkids, downsizing, reunion
- **One-offs:** "MAP", "REBOOTED", and "PROMOTED" (only when no room card shows)

### 1b. World text (Phaser, near the hero)

| Message | Code | Anchor | Lasts | Rate cap |
|---|---|---|---|---|
| Damage numbers | `main.js` `popDamageNumber` | the hit point | 460 ms | **6 per frame** (`DMG.perFrame`) |
| Close Call popups and combo labels | `near-miss.js` | 44 px above the hero | short | **4 per second** (`NEAR_MISS.maxPopupsPerSec`) |
| Dad Joke speech bubble | `main.js` `showPlayerSpeechBubble` | 52 px above the hero, up to 280 px wide | **2.3 s** | one at a time, each cast |
| "HA!" words, "NO!" shout, "PING! GROUP CHAT", "LEFT ON READ", "DODGED!", "BLOCKED!", "SUGAR CRASH!" | `main.js` | 28 to 58 px above the hero | 0.6 to 1.5 s | none |
| Pickups: "+2 HP (PIZZA!)", Desk Salad, coins "+Nk", plant "JACKPOT" | `main.js` | the item | about 1.5 s | none |
| **Dividend and cake** ("AGE 50 DIVIDEND", "+5 HP") | `main.js` update loop | 26 and 48 px above the hero | 1.5 to 1.6 s | every 5 years, **together with a reward lower third and a center flash: the same news three times** |
| Name tags: elites, "BONUS" chest, boss "NAME:HP", "CLOCK OUT HERE" | `main.js` | above the body | persistent | |
| Boss extras: bonk words, dizzy stars, the New Boss pep bubble, gap "SAFE" labels, Party "+1" and awkward lines | `boss-attacks.js`, `holiday-party.js` | at the boss | 0.6 to 2 s | |
| Intern float text, home pops, beat labels | `interns.js`, `key-hunt.js`, `garage.js`, `overtime-beats.js` (10 texts) | the object | short | |

**What sends lower thirds**, by call-site count:
- `overtime-beats.js` 16
- `main.js` 21
- `lounge.js` 6
- `promotions.js` 3, `errands.js` 3, `hustle.js` 3, `key-hunt.js` 4, `supply-closet.js` 3, `modifiers.js` 2
- 1 or 2 each in about 15 more files

**The live lower-third messages, by kind:**
- **Alerts:** swarm events, Comfort Zone Tax, LOW HP, Medical Bill, the garage burst, "CALLED ON", Lounge threat and loiter, Facilities, the IT blackout, the boss fallback, Father Time / clock out
- **Wins:** achievements, secret found, seniority, IT Support, Second Opinion, SURVIVED, errand DONE, beat results, HOME, Retired
- **Promos:** PROMOTED, LIFE, the Lounge, Lemonade, TO-DO, locked out, beat intros, MAP
- **Tips:** first-time tips, INTERN (once a session), Doctor's Orders, heart rate, back to normal, missed errand, screenshot saved
- **Rewards:** cake/dividend, treats, salad, field buffs, Workload eased, spare key, June's butterscotch, Supply Closet
- **Chapter:** AGE 50, 60, 70, 80
- **Lore:** memo captions, "SMASHED" lines, Lounge chatter

---

## 2. How often, by age (simulated)

"Messages" means a center flash, a lower third, a Spotlight card or a catch card starting. Chips and world text aren't counted. Menus are counted separately.

### Office, Midlife (40 to 65), current rules

| Ages | Minutes | Messages / min | Pausing menus / min | Messages starting **during a boss telegraph** | Center flashes **cut off** by another | Seconds with a card **and** a flash up | Seconds with 3 or more surfaces at once | Lower thirds shown 5 s or more late |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 40 to 45 | 3.75 | **3.3** | 2.0 | 0.0 | 0.0 | 0.0 | 5.2 | 0.0 |
| 45 to 50 | 3.75 | **7.2** | 1.5 | **4.0** | 1.3 | **5.8** | 12.2 | 3.0 |
| 50 to 55 | 3.75 | **7.7** | 1.7 | 1.3 | **2.6** | 2.1 | **17.1** | **4.5** |
| 55 to 60 | 3.75 | **5.8** | 1.5 | 1.3 | 1.2 | 1.9 | 7.4 | 1.6 |
| 60 to 65 | 3.75 | **6.5** | 1.5 | **4.0** | 1.2 | **6.0** | 10.2 | 1.7 |

### Office with Overtime to 80

| Ages | Minutes | Messages / min | Menus / min | During a telegraph | Flashes cut off |
|---|---:|---:|---:|---:|---:|
| 60 to 65 | 3.75 | 7.8 | 1.5 | 2.9 | 1.5 |
| 65 to 70 | 2.08 | **10.4** | 1.1 | 0.0 | 0.9 |
| 70 to 75 | 2.08 | **11.8** | 1.6 | 1.6 | 2.2 |
| 75 to 80 | 2.08 | **8.6** | 0.9 | 1.4 | 0.9 |

### Maple Hollow, Midlife

| Ages | Messages / min | During a telegraph | Flashes cut off |
|---|---:|---:|---:|
| 40 to 45 | 3.3 | 0.0 | 0.1 |
| 45 to 50 | **3.7** (no promotions or errands at home) | 2.7 | 1.0 |
| 50 to 55 | 6.1 | 1.2 | 2.6 |
| 55 to 60 | 4.7 | 1.3 | 1.2 |
| 60 to 65 | 6.2 | 2.7 | 2.3 |

### Per run and per player type
- **Office, 40 to 65:** about **110 messages** and **31 pausing menus** (about 23 level-ups, 5 chests, the shift briefing, Performance Bonus picks, Lounge visits).
- **A new player's run** adds about 0.4 to 0.8 a minute: first-time tips, achievements on every first boss kill, and the intern intro.

### The worst minutes (mean messages in the 60 s that start at that age)

| Start age | Office | Home | What lands together |
|---|---:|---:|---|
| **44.5** | **15.4** | 7.4 | errand #2 (TO-DO line + flash + chip), a level-up, then at 45: Review card, cake line + flash, promotion card, PROMOTED, a swarm event (the Review doesn't pause events), LIFE, errand DONE, Review down stamp, Lounge card + line, chest |
| **49.5** | **14.7** | 8.9 | errand #3, cake + dividend, **AGE 50** chapter, promotion card + PROMOTED + LIFE, **first modifier roll at 50** (flash + alert line + flash again), Lounge |
| 59.5 | 10.9 | **11.8** (58.5 to 59.5) | cake, AGE 60, promotion, the All-Hands card and its slide banners / at home: V8 tease, garage alert, V8 card |
| 67.5 to 70 | 13.2 | | Grandkids, Clean Out Your Desk, Workload changes, swarm events every 50 s, HOA at 70 |

**One sample office run, 44.5 to 46.5:**
- 44.79: TO-DO (line, flash, chip)
- 44.87: level-up
- 45.00: Review card, CAKE line (+ flash), promotion card queued
- 45.04: Review's first attack
- 45.15: PROMOTED
- 45.22: TAX SEASON swarm
- 45.27: LIFE
- 45.43: errand DONE
- 45.69: boss down
- 45.70: Lounge card + line
- 45.77: chest

That's **12 messages in about 45 seconds**, during the run's first boss.

---

## 3. What collides

Ordered by how much it hurts "where should I be looking."

| # | Pair | Region | How often | Why it matters |
|---|---|---|---|---|
| C1 | **Boss Spotlight card (6 s)** + that boss's **first-attack flash** (1.6 to 2.2 s after spawn) + **the first telegraph** | BOTTOM + CENTER-HIGH + WORLD | **every boss, every run** (about 6 seconds of card plus flash per boss bucket) | The card dims the lower 60% of the screen and puts a speech bubble 40 to 120 px below the hero, right where the first dashed shape appears. Three things ask for your eyes at once, and the danger is the dimmed one. |
| C2 | Center flash **cuts off** center flash | CENTER-HIGH | 1 to 2.6 per 5 years | One slot, the newest wins. The modifier fires the same flash twice. A swarm alert can erase a boss's "how to dodge" banner 1 s in. |
| C3 | Swarm event or Comfort Zone Tax (alert line + flash) **during the Review, Mortgage or V8** | CENTER-HIGH + BOTTOM | most runs at 45, 52, 60 (home) | Those three bosses have no `swarm.pauseEvents`, so "pick a gap" lands on top of a telegraph. |
| C4 | **Lower third held behind a card**, then shown late | BOTTOM | 1.6 to 4.5 per 5 years arrive 5 s or more late | "A wall of Spam Likely incoming" shows up after the wall arrived. |
| C5 | **Errand starts during a boss**, or right on a milestone | CHIPS + BOTTOM + CENTER-HIGH | errand #2 lands at about 44.6 to 45.6 in most runs | Errands only wait for menus, not for bosses or promotions. A "walk across the map in 45 s" request during the first boss is a trap. |
| C6 | Center flash (y about 228 to 278) over the **phone errand / key hunt / beat chip** (y 236 to 262) | CENTER-HIGH vs CHIPS | every phone errand while a flash is up | The same pixels. On a phone the objective timer disappears under the banner. |
| C7 | **Workload chip (phone 92 px) vs modifier chip (112 px, no phone rule)** | CHIPS | Overtime past 65 while a modifier runs | 20 px apart with chips about 24 px tall: they overlap. Both also run toward the minimap (x 212 to 384) if they're over 180 px wide. *Widths not measured.* |
| C8 | **Catch card (phone top 14%, 335 px wide)** over the modifier and workload chips, the left half of the minimap and the "checked off" chip | CENTER-HIGH vs CHIPS + HUD | every intern catch | Short (2 s), and in slow motion, so it's the least harmful. |
| C9 | **Center flash above menus** (z 60 vs 30) | CENTER-HIGH over MODAL | when a flash fires just before a level-up or chest | For up to 1.9 s the banner covers the cards you're choosing from. |
| C10 | Cake + dividend: **3 copies** (world text 2x, reward line, flash) | WORLD + BOTTOM + CENTER-HIGH | every 5 years | The same news three times, always on a milestone that already has a promotion or a boss. |
| C11 | Lower third under the **floating joystick thumb** | BOTTOM | every phone message | The strip sits at y 732 to 792, where most thumbs rest. |
| C12 | World text near the hero: Close Call popups (4/s), Dad Joke bubble (2.3 s, 280 px), damage numbers (6/frame) | WORLD | constant past 55 | It's on the hero, so it doesn't pull your eyes away, but it hides enemy bodies within about 60 px of you during exactly the moments Close Calls reward. |
| C13 | Sound nudge (top 70 px, z 70) over the phone workload chip | CHIPS | until tapped | minor |

**Device check:**

| | Phone 390x844 (portrait, sees about 520 world px across) | Desktop 1440x900 |
|---|---|---|
| Covers the hero or the action | **Spotlight dim and bubble** (C1), **center flash** inside the telegraph band (y 228 to 278 vs 225 to 620), the Dad Joke bubble | the Spotlight bubble sits 230 px above the band, away from the hero; the flash sits about 180 px above the hero, outside most telegraphs |
| Covers HUD or objectives | flash vs objective chip (C6), workload vs modifier chips (C7), catch card (C8), sound nudge (C13) | the "checked off" chip at left 12 / top 118 near the score column (*not measured*) |
| Covers controls | lower third under the thumb (C11) | none |

---

## 4. The attention budget (proposal)

### 4.1 The limit
- **At most 1 headline + 1 ticker at the same time.**
  - **Headline slot:** the center flash, the Spotlight card, the catch card and the boss-down stamp share one slot. One of them at a time.
  - **Ticker slot:** the lower third, one message at a time (as today).
  - **Status row:** at most **1 objective chip** (errand / key hunt / beat) **+ 1 status chip** (modifier / workload / comfort tax), drawn as one row, never stacked.
- **On a phone, while a boss is alive or a swarm event is in its first 4 s: 1 message total.** The ticker waits behind the headline, and the status row hides while a headline is up.
- **Density targets:**
  - **at most 4 messages a minute** on average
  - **at most 6 in any 60 s**
  - **at least 40% of every minute with no headline or ticker**

### 4.2 Priority tiers (highest first)

| Tier | What | Rule |
|---|---|---|
| **T0 Danger** | telegraph decals, LOW HP, "SAFE" gap labels | No text slot at all. Danger lives in the world. **Nothing may start on top of it** (4.4). |
| **T1 Threat** | boss arrival, swarm event start, Comfort Zone Tax, modifier start, the garage burst, Father Time / clock out | may replace a lower-tier headline; waits at most **4 s**, then is dropped (a late threat warning is wrong information) |
| **T2 Objective** | errand start/done/miss, Overtime beat start/result, key hunt, promotion (new rooms) | queue; stale after **10 s** |
| **T3 Reward** | cake/dividend, treats, salad, buffs, achievements, IT Support, Second Opinion, Workload eased, Lounge open | **ticker only, never a headline**; stale after **8 s** |
| **T4 Flavor** | chapter lines, LIFE lines, memos, "SMASHED", Lounge chatter, "back to normal", first-time tips after run 3 | ticker only, only when nothing has shown for **20 s**, and never while a boss is alive; otherwise dropped |

**Mapping to today's code:** `LT_PRIORITY` becomes alert = T1, win/errand/promo = T2, reward = T3, chapter/lore/joke/tip = T4. Exception: first-time tips stay T2 in a player's first 3 runs (`teach.on`).

### 4.3 Queue, drop and merge rules
1. **No more cutting off.** A headline never replaces an equal or higher tier. It waits, and drops after its stale time. Today the newest flash simply wins.
2. **The ticker queue** shrinks from 5 to **3**, and is sorted by tier, then by age.
3. **Merges** (one moment, one message):
   - **Milestone age:** the cake + dividend + chapter line become **one ticker**: "AGE 50. The knees start talking. +5 HP cake, +12k dividend." World text stays; no flash.
   - **Promotion:** the room card + PROMOTED + LIFE become **the room card plus one ticker** (LIFE folds into the PROMOTED line or is dropped).
   - **Modifier:** **one** flash (remove the second call), then the chip. The line becomes optional.
   - **Boss intro:** the Spotlight card **is** the first-attack explanation. While the card is up, the boss's `bannerTitle` / `bannerSub` flash is **skipped**; the card's tip line already says how to dodge.
4. **Demotions to a quiet HUD change** (no headline, no ticker):
   - reward flashes (cake, buffs, salad) become a HUD pulse plus world text
   - Workload up and down become a chip pip blink, plus the existing 3 s warning
   - "back to normal" becomes a chip fade
   - "Comfort Zone Tax" becomes a status chip ("MORE ENEMIES 20s") plus a T1 headline only the first time each run
   - the errand "TO-DO" flash becomes the chip plus ticker only
5. **Holds:**
   - Errands and Lounge openings wait until **no boss is alive** and the age is more than **0.6 years** from a milestone (45, 50, 55, 60).
   - Swarm events and Comfort Zone Tax wait while **any** boss is alive. Today the Review, Mortgage and V8 don't pause them.

### 4.4 Quiet windows
- **Around telegraphs:**
  - No headline or ticker may **start** from when a boss enters `telegraph` until **300 ms after** its attack ends.
  - Waiting T1 messages start right after. T2 to T4 messages wait up to 8 s, then follow their stale rules.
  - LOW HP is exempt (it's T0 and already goes through).
- **Boss card length:** 6 s down to **3.5 s** during runs (`SPOTLIGHT.bossMsInRun`), so it's gone before the second attack. Tap to dismiss stays.
- **Gaps:**
  - at least **1.2 s** between headlines
  - **800 ms** between tickers (today 450)
  - the same message key at most **once per 60 s** for every headline kind except T1 (today only rewards have this)

### 4.5 Phone-specific limits (coarse pointer or portrait)
- 1 message total while a boss is alive or a swarm event starts (4.1).
- **The center flash moves to 18% height on phones** (between the HUD and the minimap bottom), clear of the telegraph band. The status row hides while it's up, so C6 and C7 can't happen.
- The Spotlight during a boss uses the **compact band**: no dim gradient, no speech bubble, only the name and the tip, 3.5 s. The full version stays for hire, room and lounge cards, which never show during a boss.
- The modifier chip joins the status row (phone top 236, replacing the separate 112 px slot).
- **The lower third lifts above the thumb zone** (bottom + 96 px) while a touch is held. Or Fable picks a side.
- World text: Close Call popups capped at **2 a second**, damage numbers at **4 per frame**, and the Dad Joke bubble at **200 px wide** and 1.8 s.

### 4.6 What deserves a full pause (and what doesn't)
- **Pause:** level-up, Performance Bonus, chest, the Lounge shop, the shift briefing, the big map. These already pause. Keep them, and **don't add more.**
- **Should not pause:** the Spotlight, the catch card, boss down, beats, errands. They work as headlines, with slow motion at most.
- **One change to consider:** while a boss is alive, **hold the bonus chest's pop-up** until the boss queue's 8 s breather. The chest already waits 2 s after the kill. If another boss (or the Watch) is due within 8 s, the chest waits for the next quiet moment.

### 4.7 What the model says the budget does

| Office 40 to 65 | Today | With the budget |
|---|---:|---:|
| Messages per run | **110** | **78** (about 29% fewer) |
| Messages / min at 45 to 50 and 60 to 65 | 7.2 / 6.5 | **4.9 / 4.9** |
| Messages starting during a telegraph (45 to 50 / 60 to 65) | 4.0 / 4.0 | **0.3 / 0.5** |
| Flashes cut off by another | 1.2 to 2.6 per bucket | **0** |
| Seconds with a card and a flash together (45 to 50) | 5.8 | **0.0** |
| Busiest minute | 15.4 (44.5) | **10.7** (49.5) |

**What the budget doesn't fix yet:**
- **49.5 to 50.5 is still the busiest minute.** It's the cake, the promotion, the first modifier roll and an errand landing together. Fix it in data: `RUN_MODIFIER_TUNING.firstEligibleAge` 50 → **50.8**.
- **Overtime 65 to 75 stays at about 9 messages a minute** in the model. Fix:
  - demote Workload to a chip-only change (4.3)
  - give beats a T2 headline but no extra ticker until the result
  - the model doesn't include those two yet, so the real effect should be larger

---

## 5. Data keys (suggestions)

**New file `src/data/ui.js`.** It needs an entry in `src/loader.js` before `ui.js`.
```js
window.UI_BUDGET = {
  on: true,
  slots: { headline: 1, ticker: 1, statusRow: { objective: 1, status: 1 } },
  phone: { oneMessageWhileBoss: true, oneMessageSwarmStartMs: 4000, flashTopPct: 18, hideStatusUnderHeadline: true,
           compactBossCard: true, liftTickerWhileTouchPx: 96, nearMissPopupsPerSec: 2, dmgPerFrame: 4, jokeBubbleMaxW: 200, jokeBubbleMs: 1800 },
  tiers: { alert: 1, boss: 1, win: 2, errand: 2, promo: 2, reward: 3, chapter: 4, lore: 4, joke: 4, tip: 4 },
  teachTipsTier: 2,                       // first 3 runs
  staleMs: { 1: 4000, 2: 10000, 3: 8000, 4: 0 },
  rewardsAsHeadline: false,
  flavorNeedsQuietMs: 20000, flavorDuringBoss: false,
  tickerQueueMax: 3,                      // was 5
  gapMs: { headline: 1200, ticker: 800 }, // ticker was 450
  sameKeyMs: 60000,                       // was rewards only
  quiet: { duringTelegraph: true, afterAttackMs: 300, holdLowerTiersMaxMs: 8000, exempt: ["LOW HP", "SECOND OPINION"] },
  merges: { milestoneOneLine: true, promotionOneLine: true, modifierOneFlash: true, bossCardIsFirstBanner: true },
  holds: { errandsWaitForBoss: true, milestoneAvoidYears: 0.6, eventsWaitForAnyBoss: true, chestWaitsForBossQueue: true },
  density: { perMinAvg: 4, perWindow60s: 6, quietFracMin: 0.40 } // for the dev overlay and tests, not enforced
};
```

**Edits to existing tables (all small, all reversible):**

| Key | Now | Proposed | Why |
|---|---|---|---|
| `SPOTLIGHT.bossMsInRun` (new) | 6000 (`durationMs`) | **3500** | gone before the second attack (C1) |
| `RUN_MODIFIER_TUNING.firstEligibleAge` | 50 | **50.8** | moves the first roll off the 50 pile-up |
| `ERRAND_SETTINGS.startAge` | 41.5 | **41.5** (unchanged) | with the holds, errand #2 slides past the 45 pile-up |
| `ERRAND_SETTINGS.gapSec` | 120 | **120** | unchanged; the hold does the work |
| `BOSS_ATTACKS.performanceReview/mortgageRefinance/midlifeCrisis.swarm.pauseEvents` | (no swarm block) | `true` | stops C3. *Check that a swarm block with only `pauseEvents` keeps the other multipliers at 1.* |
| `NEAR_MISS.maxPopupsPerSec` | 4 | 4 desktop, **2 phone** (via `UI_BUDGET.phone`) | C12 |
| `OVERTIME_WORKLOAD` lines | a ticker on every change | chip only (`UI_BUDGET.tiers` puts Workload at T4) | Overtime density |

---

## 6. What needs code beyond data
1. **One message router** in `ui.js`. Everything calls it: `flashBanner`, `showLowerThird`, `Spotlight.*` and `CatchMoment.show`. It owns the headline and ticker slots, tiers, stale times, gaps, same-key limits and the phone 1-message rule. Today there are two separate queues (lower third and Spotlight) and one unqueued slot (flash).
2. **A telegraph signal** the router can read: `window.BossAttacks.dangerActive()` is true while any boss is in `telegraph` or `attack`, and for 300 ms after.
3. **The merges:**
   - milestone line (`main.js` dividend block plus `CHAPTER_CARDS`)
   - promotion line (`promotions.js`)
   - a single modifier flash (`modifiers.js`)
   - skip `announced` banners while a boss card shows (`boss-attacks.js`, `reorg.js`, `holiday-party.js`, `math-homework.js`, `gold-watch.js`)
4. **Holds:** errands (`errands.js` `update`), the Lounge opening (already waits for bosses; add the milestone gap), swarm events during any boss (`maybeRunSwarmEvent`), and the chest pop-up after the boss queue.
5. **Phone layout:**
   - the flash at 18%
   - a single status row (errand, key hunt, beat, modifier, workload, comfort tax)
   - the compact boss card
   - lifting the ticker while a touch is held
   - world-text caps
6. **A dev overlay** (`dev-console.js`): live headline / ticker / status occupancy and a 60 s message count, to check the density targets in playtests.
7. **Telemetry** (`Telemetry.event`): `ui_msg` with `{ tier, slot, waitedMs, dropped, duringDanger }`, sampled at 10%. It's only useful if we want to check the targets in real runs.

---

## 7. Acceptance tests
Playwright with `?nostats=1`, network to Supabase and GoatCounter blocked, the dev console for spawning, at 390x844 and 1440x900:

1. **Boss intro:** spawn each boss. Neither the center flash nor the ticker is visible while the boss card is up. The card is gone by 3.6 s. The first telegraph's decal area isn't covered by any DOM element with opacity above 0.3 (phone: no dim gradient).
2. **No cut-offs:** fire `flashBanner` twice 200 ms apart. The second shows **after** the first ends plus 1.2 s, or is dropped if older than its stale time. It never replaces the first.
3. **Telegraph quiet window:** with a boss in `telegraph`, call `showLowerThird("reward", ...)`. It doesn't appear until 300 ms after the attack ends. `"LOW HP"` appears at once.
4. **One-at-a-time:** across a scripted 45.0 to 46.0 office timeline (Review + promotion + cake + swarm + errand), at most 1 headline and 1 ticker are ever visible at once (phone: 1 total while the Review is alive).
5. **Merges:** at 50.0, exactly one ticker mentions the cake, the dividend and "Your 50s". There's no reward flash, and one modifier flash at most if a modifier rolls (it can't before 50.8).
6. **Holds:** with a boss alive, no errand starts. Errands never start within 0.6 years of 45, 50, 55 or 60.
7. **Phone layout:** at 390x844, the center flash, the status row, the minimap and the HUD have **no overlapping boxes** (measure the `getBoundingClientRect` of `#center-flash`, `#errand-chip`, `#keyhunt-chip`, `#otb-chip`, the modifier chip, `#workload-chip`, `#minimap` and `.vs-hud` children).
8. **Density:** a full scripted office run (dev console, invincible, auto-move) has at most **6 messages in any 60 s** and an average of **4 a minute or less**. Log the worst window.
9. **Menus:** no center flash is visible above an open level-up or chest (z-order, or the flash waits).
10. **Nothing lost that matters:** every T1 message either shows within 4 s or is logged as dropped. Every promotion shows its room card.

---

## 8. Decisions for Rami
1. **The limit:** "1 headline + 1 ticker, and only 1 on a phone during a boss" (spec), or stricter (1 total, always)?
2. **The boss card:** shorten it to 3.5 s with a compact phone version (spec), or keep 6 s and delay the boss's first attack until it's gone? The second option changes fights; I'd keep fights as they are.
3. **Rewards never take the center:** are cake, buffs and salad OK as ticker plus world text only?
4. **Errands:** hold them during bosses and off milestone ages (spec)? It means errand #2 usually lands around 46 instead of 45.
5. **Swarm events during the Review, Mortgage and V8:** pause them like the other bosses do (spec)? It makes those three fights a little easier.
6. **The first modifier at 50.8 instead of 50?**
7. **Phone flash at 18% height?** Fable may prefer another home; the rule is "outside the telegraph band and never over the status row."

---

## 9. What I couldn't verify
- **Nothing was rendered.** Every screen position comes from the CSS rules (`index.html`, the injected styles in each file). Chip widths, the HUD row heights, and the real phone safe areas need Fable's Playwright pass.
- **Frequencies are a model**, not telemetry:
  - fight lengths, errand success and speed, intern chase odds and Comfort Zone Tax odds are assumptions
  - level-up timing comes from `LEVELING.catchUp.byAge` (the typical level by age from real runs), not a gem simulation
  - the Overtime Gold Watch age (2.7 years before the end) is from my earlier spec; the code comment says about 77.3 for an 80 run
- **Achievement lines** only show in the model's "new player" case (once-ever unlocks). Real veterans see far fewer.
- **The Spotlight boss card is up for every boss.** That's true while every boss has a `SPOTLIGHT.bosses` entry (all of them do, including the All-Hands without art). It isn't "once ever."
- **Errands at home:** I read that they only run in the office (their rooms don't exist at home), but didn't run it.
- **`swarm: { pauseEvents: true }` alone** on the Review, Mortgage and V8: I didn't check whether a partial swarm block defaults its other multipliers to 1.
- The model doesn't time menus. Menus freeze both the game clock and the lower-third clock, so message order holds but real seconds stretch.

---

## Claude's note (Nov 10, 9:50 AM)
- Spot-checked: `modifiers.js` calls `flashBanner` directly (line 64), and there are about 80 `showLowerThird(` calls in `src/*.js` (Grok counted 89 including subfolders and other surfaces). Consistent with the inventory.
- Rami's 7 decisions (section 8) are still open; the design lead should treat the spec's defaults as proposals until he answers.
