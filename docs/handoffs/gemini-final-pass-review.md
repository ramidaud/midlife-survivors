# Gemini Final Copy Review before V2 (Nov 4, 2026)

## 3-Line Summary
1. **The voice is warm, deadpan, and cohesive across all 17 files**, with zero em dashes anywhere in the repo and every hero, coworker (Art, Sam, Eli, Nora, June, Mina), and intern (TJ, Derek) sounding distinct.
2. **The biggest player-facing fixes are a few missing/mismatched data strings:** 6 newer achievements lack end-of-run summary lines in `window.ACH_END_LINES`, the `"All 9 evolutions"` achievement checks for 9 evolutions when only 6 exist in `upgrades.js`, and `lore.js` has outdated boss HP numbers and lacks an entry for **The Gold Watch**.
3. **A quick polish pass on consistency and rules** will clean up two real brand names (`Band-Aid`, `LEGO`), unify `"The Grad Student at 45"` across `spotlight.js` and `achievements.js`, trim a couple of 62–72 character lines in `tips.js` and `upgrades.js`, and soften four older `"Died / to death"` strings in `deaths.js`.

---

## Top 10 Fixes (Ranked by Player Impact)

### 1. Six Newer Achievements Are Missing End-of-Run Summary Lines (`src/data/achievements.js`)
- **Problem:** `fiveOClock`, `keepReceipt`, `hybridSchedule`, `remoteWorker`, `pluggedIn`, and `requiredReading` are in `window.ACHIEVEMENTS`, but missing from `window.ACH_END_LINES`, so earning them on the Game Over screen shows no next-run message.
- **Suggested Additions to `window.ACH_END_LINES`:**
  - `fiveOClock`: `"You clocked out at 5:00 with the Gold Watch ticking on your heels. Take 12k in 401(k) coins to the shop and enjoy your evening."`
  - `keepReceipt`: `"You clocked out at 65 without letting the Gold Watch land a single hit. Bank a spotless 20k in 401(k) coins for the shop."`
  - `hybridSchedule`: `"You finished shifts on two different devices. IT approved your stipends for 5k in 401(k) coins to spend in the shop."`
  - `remoteWorker`: `"You finished runs on a phone, a tablet, and a computer. Collect 10k in 401(k) coins for the shop as a true work-from-anywhere pro."`
  - `pluggedIn`: `"You finished a run with a game controller and saved your wrists. Put 5k in 401(k) coins toward your next shop upgrade."`
  - `requiredReading`: `"You read 10 devlog memos all the way to the bottom. Enjoy 10k in 401(k) coins for the shop, plus The Coldwar Cowboy is now unlocked."`

### 2. "Fully Evolved Adult" Achievement Says "All 9 Evolutions" When Only 6 Exist (`src/data/achievements.js`)
- **Current Text:** `desc: "Evolve all 9 evolutions (any runs)."` (`allEvos` in `achievements.js`, plus `"You evolved all nine evolutions..."` in `ACH_END_LINES`).
- **Problem:** `src/data/upgrades.js` has 6 evolutions (`evoSmartTv`, `evoPivotTable`, `evoBingeMode`, `evoColdBrew`, `evoPunStorm`, `evoBoundaries`)—plus even counting the Coldwar Cowboy's Zip Drive (`lore.js`), players will wonder what the missing evolutions are.
- **Suggested Text:** `desc: "Evolve all 6 weapon evolutions (any runs)."` (And in `ACH_END_LINES`: `"You evolved all six weapon evolutions across your career. Take a massive 20k in 401(k) coins to the shop as a fully evolved adult."`)

### 3. Hero Name Consistency: `"THE GRAD STUDENT"` vs. `"The Grad Student at 45"` (`src/data/spotlight.js` & `src/data/achievements.js`)
- **Current Text:**
  - `spotlight.js` (`hires.gradStudent.name` & `heroNames.gradStudent`): `"THE GRAD STUDENT"` (16 chars)
  - `achievements.js` (`nightOwl.desc` & `ACH_END_LINES.nightOwl`): `"Reach 50 as The Grad Student."`
- **Problem:** Brief specifies canonical hero name is **The Grad Student at 45** (`meta.js` and `lore.js` use `"The Grad Student at 45"`, while `spotlight.js` and `achievements.js` drop `"at 45"`). Note: `"THE GRAD STUDENT AT 45"` is 22 chars (2 chars over the 20-char Silkscreen cap on Spotlight cards).
- **Suggested Fix:**
  - In `achievements.js`: Change `nightOwl.desc` to `"Reach 50 as The Grad Student at 45."` and `ACH_END_LINES.nightOwl` to `"You reached age 50 as The Grad Student at 45 on instant ramen and sheer willpower. Your stipend adds 5k in 401(k) coins for the shop."`
  - In `spotlight.js`: Either keep `"THE GRAD STUDENT"` to fit the 20-char Silkscreen cap or use `"GRAD STUDENT AT 45"` (18 chars).

### 4. Brand Names in `interns.js` (`"Band-Aid Kit"`) and `lore.js` (`"LEGO"`)
- **Current Text:**
  - `src/data/interns.js`: `{ id: "bandAidKit", name: "Band-Aid Kit", ... }`
  - `src/data/lore.js`: `"The Cul-de-Sac Crucible & LEGO Minefield"`, `"barefoot LEGO bricks"`, `"[LEGO!] Barefoot Plastic Caltrops."`
- **Problem:** Band-Aid and LEGO are registered trademarks (and the rules avoid real brand names; note TJ's `"Chipotle"` line in `interns.js` is untouched per instructions).
- **Suggested Text:**
  - `interns.js` Option 1: `"First-Aid Kit"` · Option 2: `"Breakroom First-Aid"`
  - `lore.js` Option 1: `"Plastic Toy Brick Minefield"` / `"barefoot plastic building bricks"` / `"[BRICK!] Barefoot Plastic Caltrops"` · Option 2: `"Toy Block Minefield"` / `"barefoot plastic blocks"`

### 5. `lore.js` Boss Registry Is Missing **The Gold Watch** and Lists Old Boss HP Numbers (`src/data/lore.js`)
- **Current Text:**
  - `GAME_LORE.bosses` lists Performance Review (`30-HP`), 30-Year Adjustable Mortgage (`70-HP`), Midlife Crisis V8 (`130 HP`), HOA Board President (`210 HP`), Mandatory Retirement Audit (`300-HP`), 6:00 AM Pickleball Champion (`420-HP`), Father Time, and has no entry for **The Gold Watch** (Age 63.5).
- **Problem:** `enemies.js` has `performanceReview` at `45 HP`, `mortgageRefinance` at `110 HP`, `midlifeCrisis` at `200 HP`, `pickleballChamp` at `460 HP`, and `goldWatch` at Age 63.5 (`150 HP`). Also boss names differ slightly (`"The Annual Performance Review"` vs `"The Performance Review"`, `"The 30-Year Adjustable Mortgage"` vs `"The 30-Year Mortgage"`).
- **Suggested Fix:** Update `GAME_LORE.bosses` names/HP to match `enemies.js`, and insert The Gold Watch at `AGE 63.5`:
  - `age: "AGE 63.5", name: "⌚ The Gold Watch", stage: "🏢 Every Open District", lore: "A giant gold retirement gift that shows up 18 months early and ticks down toward 5:00 PM. You cannot stop time, only wind it back with every hit until you clock out at 65."`

### 6. Unclear Modifier Subtitles in `modifiers.js` (`"RENT HIKE"` and `"EMPTY NEST"`)
- **Current Text:**
  - `rentHike`: `title: "RENT HIKE", sub: "Bills got pricier. Pack it in."` (Effects: more Bills spawn and Bills have +25% HP).
  - `emptyNest`: `title: "EMPTY NEST", sub: "Quieter house. Hungrier hallway."` (Effects: +20% Gem XP, +1 pack size, Pizza heals 25% less).
- **Problem:** During fast gameplay, a new player can't tell what `"Pack it in"` or `"Quieter house. Hungrier hallway."` actually changes mechanically.
- **Suggested Text (<= 45 chars):**
  - `rentHike` Option 1: `"More Bills spawn, and they take more hits."` (42 chars) · Option 2: `"Tougher Bills and more of them. Hang on."` (40 chars)
  - `emptyNest` Option 1: `"Gems give +20% XP, but pizza heals less."` (40 chars) · Option 2: `"Bigger swarms and +20% XP. Pizza heals less."` (44 chars)

### 7. Vague Odd/Even Rank Phrasing on `"Universal Remote"` and `"Firm Boundaries"` (`src/data/upgrades.js`)
- **Current Text:**
  - `universalRemote`: `"Remote deals +1 damage and flies 15% farther. Ranks 2 and 4 throw an extra remote. Odd ranks also throw a bit sooner."` (117 chars)
  - `firmBoundaries`: `'"No." reaches farther and shoves harder. Ranks 2 and 4 also add +1 damage.'` (74 chars)
- **Problem:** `"Universal Remote"` is nearly twice as long as every other upgrade card on a phone screen, and players don't always know ahead of time whether they are picking an odd or even rank.
- **Suggested Text:**
  - `universalRemote`: `"+1 damage, +15% range, faster throws, and +1 remote at Ranks 2 & 4."` (67 chars)
  - `firmBoundaries`: `'"No." reaches 22% farther, shoves harder, and adds +1 damage at Ranks 2 & 4.'` (76 chars)

### 8. Four Older Lines in `deaths.js` and `tips.js` Use Literal `"Died / Death"` Words
- **Current Text:**
  - `deaths.js` (`bill`): `"Died of autopay failure."` and `"Paper-cut to death by a water bill."`
  - `deaths.js` (`lateFee`): `"Nickeled and dimed to death by a $35 Late Fee."`
  - `tips.js` (`CHAPTER_CARDS[90]`): `"Your 90s. Death is getting impatient."`
- **Problem:** All newer passes avoid literal death words (`"died"`, `"to death"`, `"Death is getting impatient"`) so the tone stays warm and never morbid.
- **Suggested Text:**
  - `deaths.js` (`bill` #1) Option 1: `"Autopay expired along with your debit card."` · Option 2: `"Signed out by an unexpected autopay failure."`
  - `deaths.js` (`bill` #2) Option 1: `"Paper-cut into early retirement by a water bill."` · Option 2: `"Taken down by a sharp envelope on the water bill."`
  - `deaths.js` (`lateFee` #1) Option 1: `"Nickeled and dimed into taking the afternoon off by a $35 Late Fee."` · Option 2: `"A $35 Late Fee finally emptied your wallet and your stamina."`
  - `tips.js` (`CHAPTER_CARDS[90]`) Option 1: `"Your 90s. Father Time is checking his watch."` (44 chars) · Option 2: `"Your 90s. Every candle on the cake is a workout."` (48 chars)

### 9. Repeated Jokes Across Files (Reply-All, Reading Glasses, Bagels/Coffee)
- **Current Text:**
  - **Reply-All in `deaths.js` (`officeGossip`):** Has both `"Accidentally hit 'Reply All' to the entire company."` AND `"You accidentally clicked Reply All and decided it was best to simply go home."` right in the same 4-line array.
  - **Reading Glasses in `deaths.js` (`threeAmThought`) vs `title-copy.js`:** Both use the `"Your reading glasses were on top of your head / on your desk the whole time"` joke. Also, finding reading glasses on your head fits `mathWorksheet` or `bill` better than `threeAmThought`.
- **Suggested Fix for `deaths.js` (`officeGossip` #1):**
  - Keep `"You accidentally clicked Reply All and decided it was best to simply go home."` and replace `"Accidentally hit 'Reply All' to the entire company."` with:
    - Option 1: `"Someone replied 'Thanks!' to all 400 people and your inbox collapsed."`
    - Option 2: `"Buried under nineteen 'Please remove me from this list' replies."`

### 10. Lower-Third Tips Over 60 Characters on Phone Screens (`src/data/tips.js`)
- **Current Text:**
  - `tips.js` (`bill`): `"Bills chase you. Pay them off fast or they split into Late Fees."` (64 chars)
  - `tips.js` (`threeAmThought`): `"3 AM Thoughts fade in and out. Hit them while they're solid."` (60 chars)
  - `tips.js` (`calendarInvite`): `"Calendar Invites charge in a straight line. Step out of the way."` (64 chars)
  - `tips.js` (`groupChat`): `"The Group Chat keeps its distance. Watch for \"typing...\" then dodge."` (68 chars)
  - `tips.js` (`mathWorksheet`): `"Math Homework circles you closer and closer. Break out early."` (61 chars)
- **Problem:** The comment at the top of `tips.js` notes `keep each line short (about 60 characters)` for phone lower-thirds, and `groupChat`, `bill`, and `calendarInvite` push past 60.
- **Suggested Trims (All <= 55 chars):**
  - `bill`: `"Pay off Bills fast before they split into Late Fees."` (52 chars)
  - `calendarInvite`: `"Calendar Invites charge in a straight line. Sidestep!"` (53 chars)
  - `groupChat`: `"Group Chats hang back. Dodge when you see \"typing...\""` (53 chars)
  - `mathWorksheet`: `"Math Homework spirals in close. Break out of the ring!"` (54 chars)

---

## Full Audit Table: Everything Else

| File | Current Text | Problem | Suggested Text (2 Options for Jokes) |
| :--- | :--- | :--- | :--- |
| `src/data/spotlight.js` | `name: "SAM AT THE FRONT DESK"` (21 chars) | 1 character over the 20-char Silkscreen `Name` cap. | `SAM AT RECEPTION` (16 chars) or `SAM AT FRONT DESK` (17 chars) |
| `src/data/bosses.js` | `hourHand: ["BANKERS' HOURS", ...]` | Good apostrophe, just verify Silkscreen pixel font renders `'` cleanly in caps banners. | Keep `"BANKERS' HOURS"` or `"BANKERS HOURS"` if Silkscreen adds extra kerning around `'`. |
| `src/data/bosses.js` | `victory.lines.any` & `victory.lines.officeWorker`: both are `"The hands stopped at five, and my out-of-office is on."` | Not a bug, just an opportunity to have a distinct fallback in `any` if another hero is ever added. | Option 1 (`any`): `"Five o'clock on the dot. See you all on Monday, Never."` (54 chars)<br>Option 2: Keep identical to `officeWorker`. |
| `src/data/enemies.js` | `officeGossip.seniorLabel: "BINGO"` and `calendarInvite.seniorLabel: "BINGO"` | Both enemies share the exact same `"BINGO"` senior tag in Ages 80–100. | Change `officeGossip.seniorLabel` to `"RUMOR"` or `"CHAIN"`, and keep `"BINGO"` on `calendarInvite`. |
| `src/data/enemies.js` | `retirementBoss.name: "Mandatory Retirement Test"` (`enemies.js`) vs `"The Mandatory Retirement Audit"` (`lore.js`) | Slight boss name mismatch between `enemies.js` and `lore.js` (and no achievement exists for beating the Age 80 boss specifically, since `vested` triggers on reaching age 80). | Unify both to `"The Mandatory Retirement Audit"` (or `"The Retirement Audit"`). |
| `src/data/enemies.js` | `pickleballChamp.name: "6AM Pickleball Champion (Senior Boss)"` | The parenthetical `(Senior Boss)` makes the name 37 chars long if displayed in UI banners; also `6AM` in `enemies.js`/`achievements.js` vs `6:00 AM` in `lore.js`/`deaths.js`. | `"The 6 AM Pickleball Champion"` (28 chars) and standardize `"6 AM"` across files. |
| `src/data/deaths.js` | `bill`: `"You gave it a solid eight hours, plus a working lunch. The spreadsheets will still be here when you get back."` (109 chars) | Much longer than the other `bill` lines (which are 25–45 chars) and doesn't specifically mention a Bill. | Option 1: `"You worked through lunch to pay the electric bill, and the bill still won."` (74 chars)<br>Option 2: Move this line to `fallback` so it shows as a general work-shift sendoff. |
| `src/data/deaths.js` | `snackAttack`: `"The breakroom decaf pot was mislabeled again. Go home, put your feet up, and start fresh at nine."` (98 chars) | Placed under `snackAttack` (which is the Late-Night Donut enemy), though the joke is about decaf coffee rather than donuts. | Option 1: `"That pink-frosted donut had extra glaze on the floor. Rest your feet until nine."` (80 chars)<br>Option 2: Keep as warm breakroom flavor. |
| `src/data/deaths.js` | `groupChat`: `"Your password expired mid-battle and required a special character you have never seen before."` (94 chars) | Placed under `groupChat`, though password expiration is more of an IT/general office hazard than a group chat ping. | Option 1: `"Forty-seven people replied 'Sounds good!' while you were trying to mute the thread."` (84 chars)<br>Option 2: Move the password line to `fallback`. |
| `src/data/deaths.js` | `backTwinge`: `"Sneezes once at 44. Threw out entire lower back."` | Mixes present tense (`"Sneezes"`) with past tense (`"Threw"`). | `"Sneezed once at 44. Threw out your entire lower back."` |
| `src/data/deaths.js` | `midlifeCrisis`: `"Started a podcast instead of going to therapy."` | Slightly punchier/sharper than the rest of the warm dad-humor lines (though still funny). | Option 1: Keep as-is (classic meme).<br>Option 2: `"Bought three studio microphones for a history podcast you recorded one episode of."` |
| `src/data/lore.js` | `scenarios[2].survivalTip`: `"Reaching Age 50 permanently unlocks the Age 50 Decade Checkpoint (+2 free starting perks on future runs)!"` | Factual mismatch with `src/data/meta.js`: in `DECADE_CHECKPOINTS`, Age 50 gives `bonusLevels: 1` (`+1` free starting perk), while Age 60 gives `bonusLevels: 2`. | Change `"+2 free starting perks"` to `"+1 free starting perk"` in `lore.js`. |
| `src/data/lore.js` | `coldWarCowboy.relic`: `"💾 Floppy Disk (a boomerang; evolves into the Zip Drive)"` | `upgrades.js` doesn't currently have a `Zip Drive` evolution card (it uses `unlockRemote` / `evoSmartTv` on `s.remote = true`). Players reading the Lore Archive might look for a Zip Drive card. | Either add a quick note `"💾 Floppy Disk & TV Remote (evolves with Comfortable Shoes -> Smart TV)"` or keep if Zip Drive is an upcoming card! |
| `src/data/meta.js` | `CHARACTERS[3].apply`: `s.remote = true; s.floppy = true;` | In `meta.js`, The Coldwar Cowboy's tagline says `"Starts with the Floppy Disk"`, while in `upgrades.js` the weapon upgrades are named `"Universal Remote"` and `"EVOLVE: Smart TV"`. | In `meta.js` tagline or `upgrades.js`, consider mentioning `"Starts with the Floppy Disk (scales with Remote upgrades)."` so new players know to pick `Universal Remote` when playing Ben. |
| `src/data/upgrades.js` | `evoColdBrew.text`: `"Coffee Lv 2+ & Sleep: Fires 3 piercing espresso shots in a spread!"` | Uses shorthand `"Sleep"` and `"Glasses"` / `"Shoes"` in evolution cards, whereas the passive cards are named `"Good Night's Sleep"`, `"Reading Glasses"`, and `"Comfortable Shoes"`. | Clear enough as shorthand to save space; optionally capitalize `"Good Night's Sleep"` (already used on `evoBingeMode`). |

