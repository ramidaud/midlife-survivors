# Midlife Survivors: Game Design (living draft v0.1)

**Pitch:** You're 40. The emails, bills, back twinges and group chats are coming for you, and they will not stop. Survive four decades to **Retirement at Age 80**, plus **20 Bonus Senior Life Rounds (Age 80 to 100)**, armed only with coffee, dad jokes and the word "No."

Status: brainstorm. Everything here is a starting point for Rami to cut, rename and rewrite.

## Grounding furniture (Nov 1, 2026, Codex)
- Rami approved exploration scale but found the floor visually separate and the objects floating. Match each sprite's bottom silhouette with short dark contact shadows plus a quieter southeast cast. Include department landmarks, not just extra scenery props.
- Give chair mats a distinct subdued tone and place them beneath the wheels. Attach small caster scuffs and cables to desk locations. Enrich carpet tufts and wood grain while keeping walkways readable.
- Add a tight hard-pixel foot shadow beneath the player. Keep it and the HP bar attached during paused resets and Visit Accounts. No asset scale, world size, colliders or combat values change.

## Larger office ground pass (Nov 1, 2026, Codex)
- Rami wants stages to feel large and explorable. The office is the first reference: keep the approved character scale while increasing travel distance, route choices and side destinations.
- Brighter muted-blue carpet, a teal welcome rug, quiet tiled service floors, worn chair mats, repairs, coffee rings and paper trails add floor-level identity. Wood routes and cream light pools guide movement. All decorative ground marks remain non-solid.
- The supplied visual handoff recommends enemy sheets, hero integration, brighter environments and a real crowd-pressure preview as separate review steps. This pass covers the office ground request only. Dense-swarm readability and enemy pathing remain unverified; do not integrate Campus into production yet.

## Office environment kit (Nov 1, 2026, Codex)
- Rami asked to work on environments after the walking sheets. First detail pass focuses on Accounts Payable as the reference section, with shared floor language across Campus. Hospital, home, courtyard and resort art remain future work.
- Generated a broken printer, filing cabinet and drooping plant to match the desk family. Native game frames are 80x80, 56x88 and 48x64, with explicit floor footprints and bottom anchors. Decorative floor papers and coffee stains do not block movement.
- Quiet 64x64 carpet and wood patterns repeat on the 32px placement grid. Warm hard-edged light pools and short southeast floor shadows connect the props to upper-left illumination. Department borders remain floor transitions, not collision walls.
- Visit Accounts frames the detailed section. Original Current Art and the small Art Study comparison still work. Native downloads and full generation prompts are saved with the office kit. Next: feedback on warmth, density and readability before extending the environment pass.

## Corporate Campus exploration direction (Oct 31, 2026, Codex)
- Rami requested all three playable-character sheets and a more animated feel. First pass: four directions and four walk poses per direction for the 9-to-5er, Soccer Dad and Grad Student. Native frames are 56x60 with consistent sheet-wide scale and keyed magenta backgrounds.
- The preview's Explore As selector tests each character in the same office. Facing follows movement, walking advances with distance traveled, and blocked/stopped characters hold a pose. A looping gallery compares all directions. Dedicated idle, attack, hurt and victory art remains future work; walking art awaits feedback before main-game replacement.
- Rami approved the exploration spacing and asked to strengthen the indie look. First furniture set: Tidy Perfectionist, Paperwork Avalanche and Lunch at the Keyboard. All three stand together in Accounts Payable and share 96x104 frames, bottom anchors and collision footprints. Other departments use variations that fit their personality.
- A dedicated 2x gallery compares the imported game textures. Next approve the furniture detail level, then build the 9-to-5er's four-direction walking sheet before the other characters. This step does not finish all Accounts Payable scenery.
- Rami chose exploration after comparing Cubicle Commons, The Meeting Loop and Corporate Campus wireframes. Favor recognizable departments joined by wide combat routes over a maze.
- Separate playable blockout in `art-test.html`: Accounts Payable, the Quiet Zone, the Breakroom and the Wellness Corner. The Nov 1 revision grows to 3072x2048, about 5.5 times the old area. A central atrium and records/meeting side wings join the original four departments. A 224px cross, 192px outer loop and 160px branch paths give multiple approaches.
- The small map records explored ground in 128px cells and reveals area names on entry. A coupon, headphones, leftover pizza, lost binder and visitor badge reward optional detours with jokes. These are prototype discoveries with no production stats, unlocks or saved progress.
- Uses the approved hero size and desk overlap rules, existing artwork and simple placeholder landmarks. No combat in Campus mode; Layout > Art Study retains the original comparison and coffee test.
- Next: feedback on navigation, spacing and the urge to explore. Add crowd pressure before deciding on production integration or finished environment art.

## Office art study (Oct 31, 2026, Codex)
- Rami's feedback: direction is good, hero slightly too small, disappearing behind desks feels wrong. Revised study uses a 56x60 hero (about 15% larger). Desks block their full projected floor footprint, preserving natural partial overlap behind their back wall and full visibility in front. Movement slides along corners.
- Floors stay behind all actors at negative map coordinates too. When a desk covers the hero's feet, his health bar moves above his head.
- Rami approved the warm office key art as the style direction: navy shadows, teal partitions, fluorescent cream and the orange coffee mug. Palette and drawing rules live in `assets/art-direction/STYLE_GUIDE.md`.
- An isolated Phaser study in `art-test.html` compares the current art with a generated hero, Bill and workstation over native seamless floor tiles. The main game's Extras menu links to it.
- Test at 1x for gameplay readability, 2x for inspection. Hero keeps the current 48x52 frame; proposed Bill is 32x36 and workstation 96x104. Objects sort by their feet; desks block only their shallow base.
- This is a one-pose visual study, not the full art pass. Get Rami's feedback before walking sheets, additional enemies or production art replacement.


## Locked decisions (Oct 30, after the Antigravity sprint)
- **Run length:** 1 real minute = 1 year. A full life runs 40 to 100, with **Death arriving at 100**. Levels get more intense as you age.
- **Camera:** 2D only. The Diablo and 3D views are parked (`window.ENABLE_3D_VIEWS = false` in `src/view3d.js`).
- **First twist mechanic:** Errands.
- **Official playtest:** GitHub Pages, https://ramidaud.github.io/midlife-survivors/
- **Rami is credited, not a character:** done in V. 1.14.0. The photographer slot became **The Soccer Dad** (same stats); Rami is in the Credits (`src/data/credits.js`).
- **Pace:** slow down, one objective at a time.
---

## 1. The core loop (same spirit as Vampire Survivors)
- **Move only.** Weapons fire on their own.
- **Collect Wisdom** (XP gems) dropped by defeated enemies.
- **Level up, pick 1 of 3** new weapons, passives or upgrades.
- **Combine** a maxed weapon with the right passive to unlock an **evolution**.
- **Survive the decade.** A 30-minute run where every 3 minutes is one year. The clock shows your age instead of a timer.
- **Spend 401(k) Coins** between runs on permanent upgrades.

## 2. The clock: age, not minutes
**Current (V. 1.15.0):** 1 real minute = 1 year, ages 40 to 100, about an hour per full life.

| Real time | Age | What happens |
|---|---|---|
| 0:00 | 40 | Bills start drifting in |
| 5:00 | 45 | Boss: Annual Performance Review |
| 12:00 | 52 | Boss: The 30-Year Mortgage |
| 20:00 | 60 | Boss: The Midlife Crisis V8 |
| 30:00 | 70 | Boss: The HOA Board President |
| 39:12 | 79.2 | Boss: Mandatory Retirement Test |
| 40:00 | 80 | Retirement bonus: +15k and full health, run keeps going |
| 50:00 | 90 | Boss: 6AM Pickleball Champion |
| 60:00 | 100 | Death arrives. Meeting him is the win |

**Rerolls: Sleep On It (Nov 5, Rami):** reaching age 55 in any run earns Middle Management, which unlocks Sleep On It in the 401(k) shop (15k, 30k, 45k; up to 3 rerolls per run). A reroll swaps all three level-up cards for different ones; evolutions stay. Shop items can now be locked behind an achievement (`unlockAchievement` in src/data/meta.js).

**Score pass (Nov 5, Rami):** 1,000 per year + kill points (2 each for the first 400 kills per year of age, then 0.25) + boss bonus (5,000, plus up to 5,000 for a kill within 30 s, fading to 0 at 2 min) + 5 per coin earned (Lounge spending doesn't count against you) + 25,000 for retiring, times the Tax Bracket bonus. Numbers in `src/data/leaderboard.js`.

**Coin balance (Nov 5):** runs now report coins_earned and coins_spent (needs two Supabase columns Rami adds). Target: first run buys 1-2 cheap ranks, a run to 55 buys a mid item, maxing the shop (1,570k) takes 25-35 runs. Candidate fixes once we have data: bigger birthday dividends, a pension payout at 65, fewer coin drops after 55, prices that rise with ranks owned.

**Leaderboards (Nov 4, Rami):** each mode has its own board, and each future stage (Hospital, Home) should get its own too, since stages differ in difficulty. Runs from before V. 2.0 (Midlife ran to 80) are tagged LEGACY, never deleted. Open question: a player's LEGACY best hides their newer runs, because the board shows one row per name; a V2 season tab would fix that.

**Boss defeats (Nov 4, Rami):** slow motion, a white flicker, a topple and fade, confetti, and a boss-specific stamp (EXCEEDS EXPECTATIONS, PAID IN FULL, CRISIS AVERTED, VARIANCE APPROVED, AUDIT PASSED, GAME, SET, MATCH). Words and timing in `BOSS_DOWN` (src/boss-down.js). Regular enemies keep their quick pop.

**Remains (Nov 4, Rami):** defeated enemies leave a small pile of scraps in their color that fades after about 9 seconds; bosses leave a bigger one.

**One boss at a time (Nov 4):** a boss that comes due waits while you are still fighting another one (up to 3 years late), then waits 8 more seconds after the kill so you can open the chest. The Gold Watch never waits. Boss chests always slide to you.

*Original 40-to-50 plan, kept for reference:*
| Real time | Age | What changes |
|---|---|---|
| 0:00 | 40 | Light trickle of emails and notifications |
| 6:00 | 42 | Calendar invites start arriving in packs |
| 12:00 | 44 | First boss: **The Performance Review** |
| 18:00 | 46 | Swarm density doubles. Gray Hairs appear |
| 24:00 | 48 | Boss: **The Mortgage Refinance** |
| 30:00 | 50 | Final boss: **The Midlife Crisis** (arrives in a red convertible) |

## 2b. Rami's Top 10 (the real enemy roster, Oct 30)
These come first. Everything in section 3 is backup material.

| # | Annoyance | Game idea | Type |
|---|---|---|---|
| 1 | **Bills** | Basic swarm grunt. Unpaid ones turn red and split into **Late Fees** | Enemy (grunt) |
| 2 | **Phone calls** | **Spam Likely** phones that ring, then dash at you in a straight line | Enemy (fast) |
| 3 | **Diabetes** | A **Blood Sugar meter**: sweet pickups heal fast but spike it; too high or too low and you slow down. Balance, not punishment | Mechanic |
| 4 | **Fat** | **Snack Attack**: donuts, chips and late-night pizza that chase you. Tempting to grab, costly to eat | Enemy + pickup |
| 5 | **Work drama** | **Office Gossip** cloud that spreads to nearby enemies and makes them tougher; Reply-All Chain elite | Enemy (elite) |
| 6 | **Sleep** | **Energy meter** that drains over the run; **3 AM Thoughts** spawn in "night" waves | Mechanic + enemy |
| 7 | **Aches and pains** | **Back Twinge** lunges from offscreen; **Bad Knee** makes a loud crack and slows you briefly | Enemy |
| 8 | **Death** | Arrives at **age 50** and can't be beaten, just like the Reaper in Vampire Survivors. Surviving to see him is the win | Final event |
| 9 | **Kids' math homework** | **Worksheets** that only take damage if you're carrying the right answer; boss: **New Math** | Enemy + boss |
| 10 | **Errands** | A **To-Do List** that marks spots on the map; finish errands for big rewards while the swarm closes in | Mechanic |

**Notes**
- Death at 50 mirrors Vampire Survivors' 30-minute Reaper, which keeps the game's spirit. The Midlife Crisis can move to age 48 as the last real boss.
- Three of these (Blood Sugar, Energy, Errands) are mechanics, not enemies. That's the fresh twist. Prototype them one at a time after the core loop is fun.

## 3. Content brainstorm

### Enemies in the game now (V. 1.17.0)
| Enemy | From age | How it moves |
|---|---|---|
| Bill | 40 | Chases; splits into 2 Late Fees if ignored 11 s |
| Spam Likely | 42 | Creeps, rings, then dashes in a straight line |
| Calendar Invite | 45 | Locks a direction and charges through |
| Late-Night Donut | 45 | Chases; touching it slows you |
| Back Twinge | 50 | Lunges in bursts, pauses between |
| Reply-All Chain | 50 | Tough elite |
| 3 AM Thought | 50 | Fades into an untouchable ghost, then turns solid |
| Group Chat | 60 | Keeps its distance and fires message pings |
| Math Homework | 60 | Circles you in a shrinking spiral |

Still on the idea list: Bad Knee (cracks and slows you), Push Notifications, Kids' Worksheets you need an "answer" to beat.

### Enemies (original brainstorm)
- **Unread Email**: slow, endless, the basic grunt
- **Push Notification**: fast, fragile, comes in bursts
- **Calendar Invite**: travels in formation, blocks paths
- **Reply-All Chain**: elite; splits into more emails when hit
- **Gray Hair**: tough, slow, never really goes away
- **Back Twinge**: lunges from offscreen
- **Group Chat**: a cloud that pings you constantly
- **Bill**: drops extra 401(k) coins (or steals them?)

### Weapons in the game now (V. 1.18.0)
| Weapon | Type | Evolves with | Into |
|---|---|---|---|
| Coffee Splash | aimed shot | Good Night's Sleep | Cold Brew Concentrate |
| Dad Joke | aura pulse | Reading Glasses | Unhinged Pun Storm |
| "No." | push-back wave | Comfortable Shoes | Healthy Boundaries |
| The TV Remote | boomerang | Comfortable Shoes | Smart TV |
| Spreadsheet | orbit | Reading Glasses | Pivot Table |
| Podcast at 2x | piercing line | Good Night's Sleep | Binge Mode |

### Weapons (original brainstorm)
| Weapon | Behavior (VS equivalent) | Notes |
|---|---|---|
| **Coffee Splash** | Forward cone/whip | Starting weapon |
| **Reading Glasses** | Boomerang | Thrown, comes back |
| **Dad Joke** | Damaging aura | Enemies groan and slow down |
| **"No."** | Knockback wave | Pushes everything away |
| **Spreadsheet** | Orbiting shields | Rows of cells spin around you |
| **The Dog** | Pet that roams and bites | Needs walks |
| **Podcast at 2x** | Piercing projectile | Fires in the direction you face |

### Passives
- **Comfortable Shoes**: move speed
- **Ergonomic Chair**: armor
- **Good Night's Sleep**: cooldown reduction
- **Multivitamin**: max HP
- **Progressive Lenses**: area size
- **Patience**: projectile duration

### Evolutions (weapon + passive)
- Coffee Splash + Good Night's Sleep = **Cold Brew Concentrate**
- Dad Joke + Patience = **Unhinged Pun Storm**
- "No." + Ergonomic Chair = **Healthy Boundaries**
- Spreadsheet + Progressive Lenses = **Pivot Table of Doom**

### Pickups
- **Wisdom gems** (XP)
- **401(k) Coins** (meta currency)
- **Leftover Pizza** (heal)
- **Fanny Pack** (pulls in all gems)
- **Vacation Day** (clears the screen)

### Playable characters (unlocks)
- **The Middle Manager**: starts with Spreadsheet
- **The New Dad**: starts with Coffee Splash, low sleep, huge willpower
- **The Grad Student at 45**: starts with Podcast at 2x, bonus Wisdom
- **The Empty Nester**: starts with The Dog
- **The Freelance Photographer**: starts with a Flash Burst that blinds enemies

## 4. Ideas for a fresh twist (optional experiments)
Pick zero, one or two later. Don't build these before the core loop is fun.
- **Priorities meter:** Family, Health and Career bars. Level-up choices quietly feed one and drain another.
- **Energy:** you slowly get tired. Stand still near a couch pickup to recharge, at the risk of being swarmed.
- **Midlife milestones:** random event cards each "year" (kid's recital, reunion, career change) that change the rules for 60 seconds.
- **Photo mode:** pause and frame the chaos. A nod to Rami's day job, and great for sharing.

## 5. Open questions for Rami
- [x] Which midlife annoyances make you laugh the most? (Answered Oct 30, see section 2b.)
- [ ] How personal should Diabetes and Fat be? Played straight from your experience, or kept broad and silly?
- [ ] Who is the main character? A version of you, or an everyperson?
- [ ] Tone: gentle and relatable, or more chaotic and absurd?
- [ ] What does "winning" at 50 look like? Credits? A party? A nap?
- [x] Art direction (decided Oct 30): Live 3-tier switchable style (`[V]` key):
  1. **Retro Pixel (`2D 16-Bit`)**: SNES / Genesis top-down 16-bit pixel art.
  2. **Stylistic Indie (`Diablo 3/4`)**: Moody isometric 3/4 dungeon crawler (*Hades* / *Diablo* / *Cult of the Lamb* vibe) with dramatic lighting and long shadows.
  3. **AAA 3D (`3D Third-Person`)**: High-fidelity *Fortnite*-style third-person 3D action view (scales up with glTF rigged 3D models, PBR materials, post-processing bloom/SSAO, and dynamic skyboxes).

---

## 6. Unlockable Life Environments & Chapter Challenges (`src/data/stages.js`)
Instead of staying on a single endless office checkerboard, progressing through the decades unlocks **5 distinct Life Environments**, each with its own multi-zone floor architecture, 3D sky palette, enemy themes, and planned interactive challenges:

| Stage & Unlock Age | Environment & Visual Zones | Enemy Swarm Theme | Planned Interactive Challenge (Phase 7) |
|---|---|---|---|
| **1. 🏢 The Open-Plan Office** (Age 40) | Herringbone carpet bays, hardwood hallways, teal breakroom rugs, coffee stains & sticky notes | `BILL`, `LATE!`, `SPAM`, `DONUT`, `OUCH!`, `RE:RE:` | **Q4 Crunch & Breakroom Stashes:** Smash potted ferns for leftover pizza and survive the Performance Review |
| **2. 🏥 St. Deductible Hospital** (Age 44) | Mint/slate terrazzo corridors, red/cyan triage floor stripes, delivery room rugs & medical cross emblems | `CO-PAY`, `DEDUCT!`, `PAGER!`, `JELL-O`, `CRAMP!`, `3AM CRY` | **Birth & 3 AM Sleepless Nights:** Dimmed vision waves during 3 AM feedings; rock the bassinet / reach coffee stations to restore alertness |
| **3. 🏡 Suburban Home & Yard** (Age 50) | Warm oak living room planks, backyard grass, crimson family rug & scattered colorful LEGO bricks | `TUITION`, `LEGO!`, `SCHOOL`, `JUICEBX`, `CARPOOL`, `NEWMATH` | **Parenting & Common Core Homework:** Dodge LEGO-brick floor hazards, complete Carpool Errand zones, and defeat **New Math** |
| **4. 🍻 The Social Courtyard** (Age 60) | Cobblestone patio, cedar bistro deck, warm string-light floor pools & lounge rugs | `SPLIT$`, `FLAKE!`, `TXT-47`, `TAPAS`, `9PM BED`, `DRAMA` | **Navigating Adult Friendships:** Stand inside RSVP Table rings to lock in dinner plans before all 4 friends flake at 6:45 PM; dodge *"Let's Split the Check Evenly"* traps |
| **5. 🌴 Sunset Palms Resort** (Age 80) | Terracotta lanai tiles, white-lined Pickleball Courts & tropical resort borders | `COPAY`, `HOA$`, `SCAM!`, `PRUNE`, `HIP!`, `BINGO` | **Senior Bonus Rounds (80-100):** Survive the 3 PM Early-Bird Buffet rush and defeat the **6 AM Pickleball Champion** |

---

## 7. Universal 4-Device Input & Controls Configuration (`#controls-modal`)
Every action in gameplay and menus is mapped across **Keyboard**, **Mouse**, **Touch**, and **Video Game Controller**, and can be customized at any time from the **Input & Controls Configuration Screen** (accessible from the Title Dossier, Pause & Options menu, Top-Right HUD, and Mobile Dock) with automatic persistence in `localStorage` (`meta.controls`):
- **⌨️ Keyboard:** Live interactive key rebinding (`Click / Press Enter -> Press Any Key`) for Move Up/Down/Left/Right, Pause/Options, Switch Visual Engine (`2D/Diablo/3D`), and Mute Audio, plus an optional toggle to keep Arrow Keys active alongside custom movement keys.
- **🖱️ Mouse:** Configurable Mouse Movement Mode (`Hold Click to Steer`, `Cursor Auto-Follow`, `Click & Drag Stick`, or `UI Menus Only`), Right-Click Action (`Pause/Options`, `Hold to Move`, or `Switch View`), and Scroll Wheel (`Navigate Menus` + `Cycle Visual Engine`).
- **📱 Touch Screen:** Configurable Touch Stick Style (`Floating Stick`, `Fixed Bottom-Left`, `Fixed Bottom-Right` with auto-swapped left dock, or `Touch & Hold Toward Finger`) and Touch Sensitivity (`Normal 10px`, `High 5px`, `Relaxed 18px`).
- **🎮 Video Game Controller:** Live controller button listening (`Press any physical controller button` or `◀▶` to cycle `Btn 0..11`) for Confirm, Pause, Switch View, and Mute, plus Analog Stick Deadzone presets (`15% Sensitive`, `22% Standard`, `35% Anti-Drift`).

---

## 8. Broadcast Lower-Third HUD & Contextual Story/Help Engine (`#hud-lower-third`)
To keep the top 82% of the viewport (and the 3D skyline horizon in Mode 2) completely clear, the HUD sits at the bottom of the screen like a broadcast documentary **Lower Third**:
- **Upper Lip (`#hud-context-bar`):** Displays a live **Context Badge (`#ctx-badge`)**, a second-person **Story Caption (`#ctx-story`)**, and an actionable **In-Game Help Tip (`#ctx-help`)** that react dynamically to on-screen events (Boss arrivals/defeats, low HP, Sugar Crash slowdowns, ringing Spam Calls, uncollected Pizza/Bonus Chests, Mezzanine high ground, Overdue Bill splits, and Life Chapter stories).
- **Main Lower-Third Console (`.lower-third-deck`):**
  1. **Bottom-Left Pod (`.hud-left`):** Employee ID Avatar, Department, Archetype, `LV` badge, side-by-side compact `HP` & `XP` bars, and active Weapon/Passive badges.
  2. **Bottom-Center Pod (`.hud-center`):** Life Chapter & Decade Timeline (`40 -> 80 / 100`) plus a live **On-Screen Situational Radar (`#hud-radar-row`)** showing active threat counts, Boss HP, nearby smashable plants/loot, and the next milestone countdown.
  3. **Bottom-Right Pod (`.hud-right`):** `🪙 401(k)` balance, `💾 SAVED`, `🎮 PAD` indicator, `[V]` Visual Engine switcher, and `⏸ PAUSE`, `🎮 INPUT`, `🔊 MUTE` buttons.

## 9. Version Tracking & Release Notes Dossier (`src/data/version.js` & `#changelog-modal`)
- **Single Source of Truth (`src/data/version.js`):** Defines `window.GAME_VERSION` with `version` (`"1.8.19"`), `displayVersion` (`"V. 1.8.19"`), `lastUpdated` (`"Oct 30, 2026"`), `codename` (`"Broadcast Edition"`), `build` (`19`), and a structured `changelog` list.
- **Visible Across the Game:**
  1. **Title Screen (`#title-modal`):** Displays a pill badge (`🏷️ V. 1.8.19 • Last updated on: Oct 30, 2026`) right below the game logo alongside a **`📜 PATCH NOTES`** button.
  2. **Pause & Options Screen (`#pause-modal`):** Displays `V. 1.8.19 • LAST UPDATED ON: OCT 30, 2026` in the header kicker and includes a **`📜 VERSION & PATCH NOTES`** menu row.
  3. **Lower-Third HUD (`#hud-dept`):** Appends `// V. 1.8.19` to the department header so any gameplay screenshot carries its build number.
  4. **Interactive Patch Notes Modal (`#changelog-modal`):** Lists each build's version badge, date, title, and bulleted highlights with full Keyboard, Mouse, Touch, and Controller navigation.

## 10. World Mythos, Subject Backstories & Scenario Lore (`src/data/lore.js` & `#lore-modal`)
- **The Core Mythos (*Form W-40: "The Great Compounding"*):**
  - At 12:00 AM on your 40th birthday, every human is quietly enrolled in **Form W-40 ("The Great Compounding")** by the Bureau of Actuarial Survival. Every minor responsibility postponed in your 20s and 30s (unopened utility bills, sleeping on a bad mattress, "we should totally grab dinner soon!" texts, and adjustable-rate paperwork) achieves sentient physical form and begins walking toward you.
  - Ordinary geography dissolves into **The Five Bureaus of Adulthood** (Office -> Hospital -> Home -> Social Courtyard -> Sunset Palms Resort), where only the sacred relics of midlife (scalding dark-roast Coffee, weaponized Dad Jokes, and the power of saying "No.") can clear a path to Age 80 Retirement and the Age 80-100 Senior Bonus Era.
- **The Three Playable Subjects (HR Dossiers):**
  1. **Subject #01 (`officeWorker`): ☕ The 9-to-5er (*Arthur "Artie" Pendelton, Age 40*)**
     - *Archetype:* Senior Spreadsheet Wrangler & Breakroom Veteran (`DEPT: CUBICLE OPS`).
     - *Backstory:* Survived twelve corporate restructurings by carrying a manila folder and looking mildly stressed in hallways. On his 40th birthday, the 4th-floor espresso machine achieved singularity and bonded to his right hand.
     - *Signature Relic:* `☕ Hot Coffee Splash` (evolves with `😴 Good Night's Sleep` -> `⚡☕ Cold Brew Concentrate`).
  2. **Subject #02 (`photographer`): 📸 The Senior Photographer (*Rami "The Shutter" D., Age 42*)**
     - *Archetype:* University Visual Storyteller & High-ISO Field Specialist (`DEPT: VISUAL CHRONICLES`).
     - *Backstory:* Spent fifteen years hauling heavy pelican cases across campus quads, lighting portrait setups in three minutes flat, and spotting clean composition lines inside total chaos. Years of coaxing genuine smiles out of nervous deans and freshmen unlocked a weaponized **Dad Joke Aura** that physically blasts back oncoming paperwork.
     - *Signature Relic:* `😂 Dad Joke Aura + ☕ Coffee` (evolves with `👓 Reading Glasses` -> `🌩️😂 Unhinged Pun Storm`).
  3. **Subject #03 (`gradStudent`): 🎓 The Grad Student at 45 (*The Dual-Career Night-Owl, Age 45*)**
     - *Archetype:* Full-Time Professional, Seminar Scholar & Boundary Architect (`DEPT: EMAT NIGHT LAB`).
     - *Backstory:* Decided that working a full-time career wasn't quite intense enough, so they enrolled in graduate school at 45. Powered by late-night creative coding, peer-reviewed PDFs, and zero remaining patience for pointless committee meetings, they mastered the rarest superpower in adult life: looking a calendar invite dead in the eye and saying **"No."**
     - *Signature Relic:* `🛑 The Word "No." + ☕ Coffee` (evolves with `👟 Comfortable Shoes` -> `🛡️🛑 Healthy Boundaries`).
- **In-Game Lore Surfaces:**
  - **Live Subject Bio Strip (`#title-subject-bio`):** Updates dynamically right under the Character Select cards on the Title Screen with the selected Subject's codename, real name, backstory, and quote.
  - **4-Tab Mythos & Lore Archive Modal (`#lore-modal`):** Accessible from the Title Screen (`📖 MYTHOS & LORE`) and Pause Menu (`📖 MYTHOS, SUBJECTS & SCENARIOS`) with tabs for **1. World Mythos**, **2. Subject Dossiers**, **3. Life Scenarios**, and **4. Boss Registry**.

## 11. 401(k) Compound Interest Scaling & 5-Year Survival Dividends (`src/data/pickups.js` & `src/main.js`)
- **6 Compound Interest Yield Tiers (`PICKUPS.coin401k.compoundTiers`):**
  - Instead of a flat `+1k` per coin all run, coin value scales up the longer you survive (`runElapsedMs` or `currentAge`):
    1. **Tier 1 (`0s+ / Age 40+`):** `1x MATCH` (`+1k` per coin, `55%` drop chance)
    2. **Tier 2 (`42s+ / Age 44+`):** `2x VESTED` (`+2k` per coin)
    3. **Tier 3 (`100s+ / Age 50+`):** `3x SENIORITY` (`+3k` per coin)
    4. **Tier 4 (`175s+ / Age 60+`):** `4x EXECUTIVE` (`+4k` per coin)
    5. **Tier 5 (`250s+ / Age 70+`):** `5x COMPOUND` (`+5k` per coin)
    6. **Tier 6 (`320s+ / Age 80+`):** `6x GOLDEN` (`+6k+` per coin)
- **Automatic 5-Year Survival Dividends (`Ages 45, 50, 55, 60, 65, 70, 75, 80...`):**
  - Crossing every 5-year Age mark during active play deposits an automatic scaling dividend (`+6k` at Age 45, `+9k` at Age 50, `+12k` at Age 55, `+16k` at Age 60...) directly into your 401(k) with a floating banner and Lower-Third Ticker notification.
- **High-Value Drops (`bonusMult`):**
  - Potted Plants always drop at least 1 Coin alongside Pizza (`45%`), 2 Coins (`35%`), or a 4-Coin Jackpot (`20%`).
  - Elites drop a `1x` Coin + a `2x` Coin (`bonusMult = 2`), and Bosses drop 5 `2x` Coins plus an immediate `4x` Executive Bonus Dividend when you open their gold Chest!

## 12. Mobile Responsive UI Architecture (Portrait, Landscape & Touch Safe-Areas)
- **Native Viewport & Safe-Area Insets (`index.html`):** Uses `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover` plus `env(safe-area-inset-*)` and dynamic viewport height (`94dvh`) so iOS Safari and Android Chrome render at native CSS pixel dimensions without overlapping notches or home indicator bars.
- **3 Responsive Breakpoints:**
  1. **Touch / Coarse Pointer (`@media (max-width: 900px), (pointer: coarse)`):** Displays the top-right **Mobile Floating Dock (`.mobile-dock`)** with thumb-sized `⏸ PAUSE`, `🎮 INPUT`, `🎥 VIEW`, and `🔊` buttons on all phones and tablets.
  2. **Mobile Portrait (`@media (max-width: 768px)`):** Compacts the Broadcast Lower-Third Console (`<22%` screen height) by placing `.hud-left` (HP/XP/Perks) and `.hud-right` (401k + Yield Pill) side-by-side above the full-width `.hud-center` timeline & radar, keeps the 3 Subject Cards in a compact 3-column row on the Title Dossier, and enables smooth vertical touch scrolling (`touch-action: pan-y`) inside modals.
  3. **Mobile Landscape (`@media (max-height: 520px)`):** Keeps the Broadcast Lower-Third in a single ultra-low-profile horizontal deck so horizontal phone play (`844x390`) preserves maximum vertical arena visibility.

## Lower third (decided Oct 30, built in V. 1.10.0)
- Broadcast-style strip at the bottom: one message at a time, slides in, holds a few seconds, slides out. Max 2 lines, about 10% of screen height.
- Message types, in priority order: alerts (boss, low HP) > errands (pinned while active) > first-time tips (shown once ever, remembered) > chapter cards (each decade) > lore drops (tease only; full text in the pause menu lore archive) > dad joke captions.
- HP stays under the player (may get bigger). XP and age stay on top unless Rami picks the "one slim bottom bar" layout.
- Decided: XP and age stay on top; the lower third is **on demand** (hidden until there is a message); built right away.
- Built so far: alerts, first-time tips, decade chapter cards, dividends. Still to come: errands (with the Errands objective), lore teases, joke captions.
- Words live in `src/data/tips.js` so Rami can edit them.
- Rami's feedback: messages feel helpful and stay up long enough. Wants a hints on/off option for experienced players, and to restyle the strip during art direction.

## Scores and leaderboard (decided Oct 30, built in V. 1.19.0)
- Rami had already shared the game, so: **online leaderboard, no accounts.** Players type a name at Game Over (remembered for next time).
- Score = 1,000 per year survived + 2 per enemy beaten (25 per boss) + 5 per 401(k) coin + 25,000 for meeting Death at 100. Tunable in `src/data/leaderboard.js`.
- Online storage: a free Supabase table (`docs/LEADERBOARD_SETUP.sql`). Anyone can read and add scores; nobody can edit or delete. Fake scores are possible, which is fine for friends; revisit before a public launch.
- Scores are always saved on the device too, so nothing is lost offline.

## Decisions and feedback (Oct 31: Ben's playtest + Rami's design doc)
- **Playtest fixes (Ben):** Quick Retry kills touch input on phones; level-up perks need **tap-to-confirm**; long dad jokes must wrap on small screens; Resume button confuses new players (make Start primary); "escalates quickly, brutal."
- **Dad jokes:** aura pulses silently. A joke is spoken/shown when you unlock or upgrade Dad Joke, plus an occasional bonus joke (max about one per 45-60 s).
- **Difficulty:** soften the first few minutes, then ramp like Vampire Survivors.
- **Core mode becomes a short run** (max about 20 min), with small ways to earn more time at advanced levels. Reaching 100 becomes a special mode unlocked by an achievement. **Decided: core run is 40 to 65 at 45 seconds per year (about 19 minutes).** "Overtime" unlocks add years; Full Life (40 to 100) is unlocked by an achievement.
- **Content:** drop in all jokes and death lines from Rami's design doc, plus additions. Goal: dynamic, not repetitive.
- **New ideas from Rami:** discoverable items (magnet, energy drink with speed + brief invincibility, more), a discoverable map showing items, bosses and moments; accounts so players come back for progression; split work across AI tools (ChatGPT for art via GPT Image, others for writing); push a stronger indie pixel-art look.

## Ideas from Rami's Granola notes (Oct 31)
- **AI layer (future proof of concept):** LLM-generated dialogue so jokes and lines stay fresh; later, LLM character creation where the player enters their age and personal struggles and the game builds tailored challenges.
- **Leaderboard:** show only each player's personal best (no test-run clutter) and remove the top-10 cap (show everyone for now).
- **Version history:** keep a revision log with screenshots and archive every major version.


## Oct 31 (later): devlog and other AI tools
- **Devlog:** a casual blog in Rami's voice about learning to make the game with AI. Lives at `/devlog` on the game site, linked from Extras. Claude drafts from the progress log and screenshots; Rami edits and approves (posts stay `draft: true` until then). One post per milestone.
- **Other AI tools:** ChatGPT (art), Gemini and Grok each have a Project with shared instructions. They end replies with a change-log block that Rami pastes into `docs/handoffs/<tool>-changes.md`. Claude reads these each session and folds approved items into the game.

- **Built (V. 1.21.0):** Midlife mode ends with "Your Retirement Party" at 65 (walk up and clock out). Overtime = "Delayed Retirement" shop item, +5 years per rank, max 80. Full Life unlocks by reaching 65 until achievements replace that. Midlife scores go to the `scores_midlife` table.

- **Decided (Oct 31): progression loop.** A first run should die well before 20 minutes. Enemies scale with the player's level; permanent 401(k) upgrades are how you beat the clock over many runs. All knobs live in `src/data/swarms.js` (INTENSITY), `src/data/pickups.js` (coins) and `src/data/meta.js` (shop).

## Devlog cover direction (Nov 1, 2026, Codex)
- Editorial covers match the warm office key art but remain separate from gameplay screenshots. Landscape 1536x1024, no baked-in text, logos or watermarks, and a calm left third for optional title overlays.
- First cover illustrates the latest office-exploration post, using the approved hero and recognizable paper/phone/donut enemies. Saved in draft post 04; this introduces no gameplay assets or mechanics.

## Decided (Nov 1): one brand for game + devlog
- Palette from `assets/art-direction/STYLE_GUIDE.md`. Fonts: Silkscreen for short labels and headings, Atkinson Hyperlegible for reading text. HR-memo framing ("MEMO · RE:") on menus and posts. Office key art behind the title screen and the devlog hero.
- Game styles live in the "SHARED BRAND" block in `index.html`; devlog styles in `devlog/styles.css`. Change both together.

## Title-screen art candidates (Nov 1, 2026, Codex)
- Three review-only 1920x1080 directions: the swarm as the spectacle around an open center; a continuous office-to-resort life panorama with a dark menu band; and the calm 8:59 lobby with hero/time clock left and enemies behind glass right.
- All use the office key-art palette and full illustrated backgrounds, with no baked text, logos or menu UI. Prompts and PNGs are saved in `assets/title-screen/`.
- The lobby gives centered controls the clearest space. Its 900px center crop removes the desktop hero and most enemies; preserve menu readability first, then consider a separate portrait composition if character visibility matters.
- Await Rami's choice before production title-screen changes.

## Bill enemy reference (Nov 1, 2026, Codex)
- Start the visual handoff with Bill: cream bill-envelope, red stripe without lettering, furrowed brows, gritted teeth, mitten hands and small navy boots, facing down-right.
- Four 48x48 frames form alternate stride / passing / opposite stride / passing, with a small paper flutter. Native sheet is 192x48, pure magenta, shared scale and baseline, palette-mapped with a one-pixel navy silhouette outline.
- Bill is the first review object, not a completed enemy batch. Remaining enemies follow after feedback; existing runtime Bill stays unchanged until approved integration.

## Creator bio art (Nov 1, 2026, Codex)
- Rami requested a pixel-art interpretation of his studio photograph as the new About-page portrait. Preserve the real seated creator and room, using the game's warm cream light, navy shadows and stepped pixel clusters.
- This is editorial creator art, not a playable-character design. The new 1536x1024 versioned PNG also serves as the About social preview; earlier silhouette art stays archived.
- **Decided (Nov 1): tip jar.** Ko-fi at ko-fi.com/ramidaud (0% platform fee on tips). Friendly and never pushy: devlog header/footer/About, game Extras and the Game Over screen only; never during play, never a pop-up.

### Bio style refinement (Nov 1, 2026, Codex)
- Rami wants the creator portrait to share the game's drawn character language, beyond photographic detail broken into pixels. V2 uses broader shapes, navy contours, simplified surfaces and warm cream/teal room lighting, referencing the office key art directly.
- About and social previews now use `assets/bio/rami-studio-pixel-v2.png`. Creator likeness and real studio remain the subject; gameplay characters and balance stay unchanged.

### Preferred bio portrait (Nov 1, 2026, Codex)
- Rami chose the earlier studio portrait over the more simplified revision. About and share metadata use `rami-studio-pixel-v1.png` again. Keep both versions; resume the enemy-art handoff with Late Fee next.

## Clocking Out brand identity (Nov 1, 2026, Codex)
- Rami chose a clock icon instead of the orange boxed MS initials. Use cream face, stepped teal rim, navy hands and one orange hour marker. The game's name stays cream pixel lettering in the devlog header.
- Favicon silhouette is designed at 16x16, rather than reduced from the large concept image. Header SVG and integer-scaled PNG exports share the same geometry. Home-screen export uses navy padding.
- Applies to branding and browser/home-screen icons only. Enemy sprite work resumes with Late Fee next.

## Full enemy art batch (Nov 1, 2026, Codex)
- Batch 1 generation is complete: Bill, Late Fee, Spam Likely, Late-Night Donut, Back Twinge, Reply-All, 3 AM Thought, Calendar Invite, Group Chat and Math Homework, plus Group Chat ping. This replaces the earlier Bill-only delivery status.
- Keep distinct motion personalities: quick receipt scurry, ringing phone, bouncing pastry, coiling bolt, swaying envelope chain, fading ghost, calendar charge, typing bubble and fluttering worksheet.
- Assets remain separate from combat until visual review. The Art Room links to an isolated native-size comparison page. Game logic still controls attack timing, ghost vulnerability and collision; baked art poses do not change those rules. Boss art is a later batch.

## Batch 1 combat integration (Nov 1, 2026, Codex)
- Rami approved the regular-enemy sheets for production. V. 1.28.12 displays all ten species plus ping, retaining the existing canvas art as an independent per-sheet fallback. Bosses remain unchanged.
- Visual sprites follow the original physics objects, preserving collision geometry and every gameplay number. Phone rings only in its ring state; Twinge follows its current lunge/rest timing; ghost fade poses stay within the existing ghost window.
- Keep Late Fee visibly smaller than Bill (25px versus 36px display square). Native pixels use nearest-neighbor sampling. Small shared contact shadows ground the cast, excluding ghost/ping. The comparison switch is `USE_ENEMY_ART` at the top of `src/enemy-art.js`, followed by reload.

## Approved hero and office integration (Nov 1, 2026, Codex)
- V. 1.28.13 brings all three approved walking heroes and the Corporate Campus out of the Art Room and into the main game. Heroes retain 56x60 visual frames and their original 48x52 physics body. Movement distance drives four walking poses in four directions; stopping holds a standing pose.
- The approved 3072x2048 seven-area floor repeats in both directions using a surrounding section pool. This replaces the procedural scattered-office/mezzanine layout with broad connected routes, recognizable departments and native desk/prop art. There are no new discovery rewards or combat modifiers in this pass.
- Furniture collisions use the art preview's ground footprints. Draw order follows the point where feet meet the floor. Foreground desks fade when they would hide the hero; shadows, chair mats and floor wear keep the furniture attached to the ground.
- `USE_HERO_ART` and `USE_OFFICE_ART` at the top of `src/world-art.js` provide reload-based comparisons. Hero loading is independent of office loading; an unavailable office asset keeps the previous stage intact. Hospital, home, courtyard and resort remain future environment kits.

## Editorial twins portrait (Nov 1, 2026, Codex)
Post 05 now uses the simplified 4:3 twins illustration beside the birth announcement. This is personal devlog art, with wristband and lettering removed, not a gameplay asset or new character. Earlier revisions remain archived.

### Stage art direction (Nov 1, Rami)
- The current stage layout feels too plain after the last visual pass. The next stage pass should be **more pixel-art forward, friendly and funny**.
- Lots of variety in objects and setups: different desk personalities, break-room clutter, plants in various states of giving up.
- **Inside jokes hidden in props** (a "Reply All" mug, a "Per my last email" sticky note).
- Rami's jokes (Nov 1): "What the hell is a KPI again?", "Let's put that in the parking lot", corporate slang visualized literally, coworkers at desks / asleep under tables / at the water cooler, "Hang in there" posters, motivational posters gone wrong.
- **The stage should feel massive and explorable, like an old Zelda overworld:** distinct districts with landmarks (Lobby, Bullpen, the literal Parking Lot of ideas, Break Room, Server Room, Executive Wing, Conference Rooms, Supply Closet, Wellness Corner). Full brief: `docs/handoffs/chatgpt-stage-pass.md`.

### Platform goal (Nov 1, Rami)
- Long-term goal: **Steam, then PlayStation and Xbox.** Plan: finish the browser game, launch on Steam in a desktop wrapper, build an audience, then go to consoles, ideally with a publisher who handles the port. Details in ROADMAP.md under "Platforms".

## Stage Pass 1 proposal: Corporate Campus overworld (Nov 1, 2026, Codex)
**Awaiting approval.** Proposed extent is 7680x4320, with Archive / Server / Executive north; Parking Lot / Lobby / Bullpen middle; Wellness / Break Room / Conference south. The bright central Lobby is the start. Districts use recognizable landmarks and literal corporate slang; the Parking Lot is the signature joke.

The measured proposal reserves a 512x512 prop-free plaza in each district, 224px primary routes and 160px branch loops, with matching edge exits for future wrapping. The 6x4 planning panels are 1280x1080; at the actual 1280x800 camera the requested extent is about 6x5.4 views. Illustrated mood maps do not establish pixel-exact footprints.

Stage 1 assets and geometry live under `assets/stage/`; the Art Room links to `devlog/art/stage-pass.html`. No runtime map or collision rules are changed. Rami’s handoff explicitly requires approval after Stage 1; native props/posters, coworkers and implementation remain later stages.
- **Campus structure (Nov 1):** one campus map whose areas unlock as you age, like promotions (Lobby and Bullpen at 40, then Break Room/Parking Lot, Server/Conference, Executive Wing, Wellness, plus a hidden Supply Closet). The later life chapters (Hospital, Home, Courtyard, Resort) remain the separate, menu-picked stages.


## Corporate Campus v2 revision (Nov 1, Codex)
This supersedes the square-grid Stage 1 layout proposal. Parking Lot v1 is the approved visual-density/scale target. World extent remains 7680x4320, but floor polygons differ: L-shaped Lobby, large stepped Bullpen, long service hall, social annex, offset meeting pods and a tiny achievement closet. Thirteen reserves use non-solid tape, rugs, papers, spills and decals. Main routes are 224px, Archive branch 160px.

Promotion schedule remains tunable in `assets/stage/campus-promotions.json`: 40 Lobby/Bullpen, 45 Break/Parking, 50 Server/Conference, 55 Executive, 60 Wellness. Hidden Archive provisionally uses existing `firstCoffee` (Per My Last Email, 50 Bills). Matching gates guard both wrap ends. Proposed door opening releases collision after the final of four frames, with a lower-third message; spawning requires unlocked, reachable floor. These policies are not runtime code yet.

The kit plan has 72 reusable prop families with 2 or 3 variants, nine seamless 64x64 floor families and modular boundaries. Each production instance will have a prop ID, position, variant and floor footprint. Short sign labels are 1 to 3 words on at least 64px props; longer jokes use once-per-run proximity captions in the existing lower third. Every new prop must be compared with the real 56x60 hero and enemy at native size on desktop and a 390px phone. Target: about 120 visible props, off-screen culling, 350 enemies without frame loss. Runtime testing and Stage 2 remain pending v2 review.


## Stage 2A art and gate clearance (Nov 1, Codex)
**V2 approved by Rami.** All gates use a 224px clear aperture, independent of closed blocker thickness. Jambs and open leaves stay outside the complete cross-route span, including the subtle Archive entrance and wrapped seams. The Archive uses ordinary FILES lettering and a protruding lavender binder rather than a loud marker. Claude owns runtime flow-field enemy navigation and locked-area spawn filtering.

First Stage 2 delivery: 13 families and 31 colorways, with three desk personalities, KPI frame, idea Parking Lot car/clamp/sign, entrance components and four posters. Native art is on opaque exact magenta with one-pixel navy silhouettes. Source prompts, proposed floor footprints and an origin are recorded per family. Colorway frames share geometry and are not animation states. Full jokes are data-driven captions; the isolated review simulates reading once, but runtime proximity triggers remain future work.

Review path: assets/stage/props/review.html, linked from the Art Room. Every card includes the real 56x60 hero and 36px Bill at 1x. Gate studies are schematic assembly proposals, not finished door animations. 59 planned families still need completion, including preparing reusable existing art. Runtime map assembly, culling, age-50 and 350-enemy crowd checks remain later work.


## Stage 2B: literal slang and district landmarks (Nov 1, Codex)
The modular kit now has 25 families and 55 colorways. New: Circle Back island, MEH gauge, Low-hanging Fruit tree, Deep Dive pool, Touch Base, Boil the Ocean, Ducks in a Row, wheeled goalposts, Hard Stop and unplugged lamp. Q4 Goals board and fictional employer values wall provide Bullpen/Lobby landmarks. Plants are separate kit components rather than baked into the wall.

New metadata distinguishes floor decor from wall decor. Touch Base stays non-solid on the floor; the gauge is non-solid on a wall; freestanding objects carry proposed small floor footprints. Full captions are supplied for each joke. Color variants preserve water and foliage while changing selected surfaces. A data candidate matches Claude's existing family/caption format without choosing placements or loading anything into the game.

Claude's V. 1.29.0 navigation and V. 1.29.1 first-batch integration are retained. New 2B art is unplaced, and 47 families remain to complete. All proposed gate openings stay 224px clear. The 7680x4320 campus replacement, remaining floor/boundary kit and new-world crowd tests remain later work.

The values-wall footprint uses width 144, back 44 and front 3 after checking its angled base against the hero. Gallery contact shadows follow the lower silhouette rather than a detached rectangle; native PNGs retain no baked shadows.

## Playable start area (V. 1.31.0, Nov 1, Codex)
Rami approved switching from completing the whole kit to a Lobby/Bullpen vertical slice. Both areas open at age 40; only these two district floors exist. Reception, values wall, waiting furniture, vending/lost-and-found, birthday banner, coat rack, varied desk neighborhoods and static coworkers are placed. One duck in the reception tray is visibly out of line. Floor stories are non-solid so the fighting reserves remain open.

The shared connection is broad and open-plan with protected 224px routes; promotion doors remain exactly 224px across. Both age-45 gates stay closed through this slice, with the future age schedule stored as data. The subtle FILES cabinet is a clue only. Claude owns future gate opening and navigation. Other district floors, full coworker animations and map/wrapping features wait for Rami to play. Original balance numbers and Claude's Close Calls, flash banners and telemetry remain intact.


## Combat feel direction (Nov 2, Rami, after playing Nerd Survivors)
- **Obstacles are fine.** Nerd Survivors has plenty to walk around too. The difference: almost everything can be destroyed, and breaking things is where the good loot is.
- **Breakable office:** small props (printers, filing cabinets, vending machines, trash cans, water coolers) smash open for loot. Walls, gates and desks stay solid so the layout still matters. Our potted plants already do this; extend it.
- **Bigger enemies:** regular enemies roughly hero-sized. Bosses much bigger (2 to 3x the hero).
- **Bosses feel different:** each boss gets its own telegraphed attack and visual, not just a bigger chaser.
- **Cleaner, smoother animation:** more frames, plus hit flash, squash and stretch, knockback and death effects.
- Also noted: big crowds early, lots of loot on the floor, persistent battle mess, build icons on screen, a clear death banner.

## Music brief (for Rami's son, Nov 2)
**The vibe:** office music that slowly loses its mind. Early game sounds like hold music or an elevator ride (calm, a little cheesy). As the run goes on and the swarm grows, it picks up drums, speed and attitude until it's a full rock or chiptune freak-out. Midlife: hard, and also kind of great. Rami, Nov 7: "slightly cacophonous but still joyful and energetic," and it has to sit under the sound effects without fighting them.

**Abdel's part (Nov 7):** no formal assignment. He noodles on the keyboard, records whatever he likes, and he and Rami pick together. Someone with real music chops may be needed to shape his ideas into game loops; Memo 13 asks readers for that help.

**Tracks wanted, in priority order:**
1. **Main run loop, calm** (ages 40 to 50): 60 to 90 seconds, loops seamlessly.
2. **Main run loop, intense** (50 to 65): same key and tempo as #1 so the game can crossfade between them.
3. **Boss theme**: 30 to 60 second loop, dramatic but still funny.
4. **Title screen**: 30 to 60 second loop, chill.
5. **Short stings** (2 to 5 seconds, no loop): level up, game over ("you're fired"), retirement win.

**Technical rules:**
- Pick one tempo for tracks 1 and 2 (somewhere around 110 to 130 BPM) and stay in the same key.
- Loops must start and end on the beat with no silence at either end, so they repeat without a hiccup.
- Export as **MP3 (192 kbps)**, plus WAV masters kept safe. MP3 plays everywhere, including iPhones.
- Keep loudness even between tracks; no clipping. Leave a little headroom, since sound effects play on top.
- Under about 3 MB per loop so the game still loads fast on phones.

**Free tools that work well:** GarageBand (Mac/iPad), BeepBox (in the browser, great for chiptune), Bosca Ceoil, LMMS, FamiStudio (NES-style).

**Rules of the road:** everything original. No samples from existing songs. Loops from GarageBand's own library are fine. He gets credited in the game's Credits by name or handle, his choice.

**How it gets into the game:** he sends files (Drive or AirDrop to Rami). Claude adds a music player that swaps tracks by age and boss, with the new music and effects sliders.

## Breakables and boss art candidates (Nov 2, Codex)
Eight small prop families now have candidate intact/cracked/broken states and independent debris. Intact pixels remain unchanged; rubble keeps the full frame/origin and occupies at most one third of the standing height. Big structural props remain outside this art batch. Breaking and loot behavior are still Claude's work.

The three Midlife bosses have candidate native 144x152 art, with six walk/drive poses, two anticipation poses, two attack poses and one hurt pose each. Charge lanes, interest rings and drift tracks are separate centered floor decals. Native art already represents the large boss appearance and should not receive another 2.3x visual multiplier. These assets are awaiting Rami's review and are not integrated into combat.


## Age-45 room slice, Nov 2, 2026 (Codex)
Parking Lot supplies broad fighting lanes and an open center, with car rows, cart bays, curb trees and parked office jokes around them. Break Room is cozier: kitchenette, coffee landmark, fridge notes, communal tables and twenty small-prop placements for the existing loot system. A staff corridor connects the rooms behind the Lobby's age-45 doors. Both age-45 gates and the far age-50 Server/Conference doors remain closed in production; Claude owns promotion opening. Every main route remains at least 224px clear. The next districts wait for Rami's review. No balance settings changed.

## Decided Nov 2: the office is the Midlife journey
- A Midlife run (40 to 65) never leaves the corporate campus. Promotions (45, 50, 55, 60) are the chapters; the rest of life "follows you to work" through enemy labels and a LIFE line at each promotion.
- The five arenas (Office, Hospital, Home, Social Courtyard, Sunset Palms) belong to Full Life (40 to 100), to be built later with the same campus pipeline.

## Decided Nov 2: office layout principles
- Pods, not rows: team pods of 4 to 6 desks with shared partitions and an identity (Accounting, IT, Marketing, HR...). No two neighboring desks identical.
- Zoned floors, one landmark per screen, density gradient (Lobby open, Bullpen denser toward the back), open arenas for swarm fights, 224 px routes.
- Coworkers sit in their chairs at hero scale; a few standing scenes and an ambient walker; all visual only.
- Process: layout plan (two options) approved by Rami before any build.

## Decided Nov 3: big moments, lighting and what comes after the freeze
- **Office layout:** Option B's loop (open commons with pods at the turns) dressed in Option A's look (worn avenue carpet, pods on rugs, seated coworkers). ChatGPT builds it.
- **Feature freeze lifted.** Inspired by Rami's Vampire Survivors session:
  - **Polish, in order:** the Bonus Chest moment, then the Retirement screen, then lighting, then damage numbers.
  - **Bonus Chest moment:** the game pauses on a "BONUS APPROVED" card with an OPEN button. Light beams, a slot-reel spin of item icons, a 401(k) coin fountain, a ticking counter and a gold flash follow. Tiers: Performance Review 1 beam, 30-Year Mortgage 3, Midlife Crisis V8 5.
  - **Retirement screen at 65:** "HAPPY RETIREMENT" in gold, with an itemized payout (Pension, Unused PTO cashed out, Gold watch). Buttons: "Clock Out" and "Come Back as a Consultant" (endless overtime).
  - **Lighting:** a dim office with warm pools under lamps, the vending machine, windows and server racks. A soft light follows the player, pickups glow, and the room gets darker with age.
  - **New content later:** a character sheet with stats, a starting weapon and one quirk per hero; run modifiers (Grok's age 50+ spec, plus Hurry and Hyper style toggles); a "Life Lessons" card deck in the spirit of Arcanas.
- **Decided Nov 3: the Required Reading reward is a character unlock: "The Coldwar Cowboy,"** based on Rami's friend Ben. It unlocks by finishing 10 devlog memos. The look, starting kit and jokes are still to come, from Rami's description of Ben, then a ChatGPT 8-frame hero sheet.
- **Decided Nov 3: elites are a keeper** ("it's so good"), V. 1.49.0.

## Ideas queued Nov 3 (morning)
- **Spotlight cards (Rami):** a bigger lower third that animates in at key moments (boss arrival, new character, room unlocked, key tips) with a sprite and a line or tip. Two mockups: A "Memo Slide" (card slides in bottom left) and B "Spotlight" (dimmed screen, band, big sprite rising, speech bubble). **Decided Nov 3: Style B** (Rami). Build after Gemini's copy.
- **More ways to heal (TJ):** heal a chunk at life milestones and add a rare healthy-food drop (a salad) so long runs can stretch. Spec to come from Grok.
- **Dev console (TJ):** a testing panel behind a URL switch (god mode, give items, jump to an age). Runs with it on never post scores.
- **The Interns (TJ and Rami, Nov 3):** playtesters TJ (and friends) appear as interns at the office instead of playable heroes (heroes start at 40). They roam the map and bring you things: coffee or snacks that heal, short buffs. Once you've leveled up enough, an intern can also act as a pop-up shop for special items, like the Merchant in Vampire Survivors. TJ wants to write his own lines. TJ's add: the shop is a real place, **the Lounge**, where you walk up for snacks and run boosts. Derek is in too. Needs: Grok to fold intern deliveries into the healing spec, ChatGPT for intern sprites, Gemini to polish lines. Not decided yet.
- **Ben, the Coldwar Cowboy (Nov 3, Rami; built V. 1.67.0: Floppy Disk + once-a-run reboot):** works in IT and has a soft spot for days gone by (floppy disks, pagers, rotary phones). He wears a tan cowboy hat and has long wavy hair. He's the Required Reading unlock. Art brief: docs/handoffs/chatgpt-friends-sprites.md. Starting kit and jokes still to come.
- **Spotlight cards built (V. 1.66.0):** Claude picked the funniest of Gemini's two options per card (Rami: "funniest please").
- **Memo 10 = the V. 2 announcement (Rami, Nov 3):** the full before and after across every screen. Memo 09 keeps just the title screen pair.


### 2026-11-04: Derek portrait art correction (Codex)
Derek's On Break camera v2 uses a charcoal body and round highlighted lens matching his walking sheet. His identity, poses, flash, frame timing and shoe line are unchanged. The art is delivered for Claude's reference switch; no mechanics or design rules changed.


## Interns: chase, don't wait (decided Nov 4, Rami)
- TJ and Derek show up on screen with a coffee and run. Catch them for a heal plus a 2-hit shield; they escape after 15 seconds.
- Each catch tosses a treat: coffee (speed), burrito (damage), bundt cake (gem vacuum + XP). Derek usually brings the bundt cake.

## Loadout and play styles (decided Nov 4, built in V. 1.83.0)
- **Rami:** "I want the users to have to make a choice about how they like to play."
- **Slots:** 6 weapons (Coffee is always slot 1) and 6 passives. There are 13 weapons and 11 passives, so a run holds about half.
- **Four styles,** shown as a badge on every card: Healing, Shield, Offense, Defense.
- **New weapons:** Mom's Casserole (Healing), Noise-Cancelling Headphones (Shield), Rolling Office Chair, Reply-All Storm and Sticky Notes (Offense), Out-of-Office Reply and Thermostat Wars (Defense; Thermostat freezes enemies).
- **New passives:** Multivitamin, Meal Prep Sunday (Healing), Cardigan (Shield), Lumbar Support, Fitness Tracker (Defense), Bifocals (Offense).
- **Evolutions:** Potluck, Do Not Disturb, Executive Swivel, Company-Wide Memo, Sabbatical, Wall of Post-its, Polar Vortex.
### 2026-11-04: Friendly age-65 destination art (Codex)
Midlife retirement gets a welcoming punch-clock station with balloons and gifts, with a waiting loop and a one-shot clock-out celebration. This art delivery keeps the existing win interaction and Full Life Father Time unchanged; Claude owns integration.


### 2026-11-04: Continuous wall dressing kit (Codex)
Room-themed wall pieces use32px modules to dress intact256px wall segments. Mounted pieces and floor decals are non-solid; floor-standing wall furniture proposes24px-deep footprints. All art is delivered for placement review, with224px routes and existing doorways preserved during Claude's future integration.


### 2026-11-04: Full coworker world poses (Codex)
The six named room coworkers now have delivered seated working/personal loops and four-direction standing walks with signature idle actions. Chairs and shoes contact fixed floor lines. This is art for the existing ambient coworkers, not a change to navigation, encounters, rewards or spawning; integration follows review.

## Sprint mode (decided Nov 4, built in V. 1.93.0)
- Rami: "like Vampire Survivors' Hyper mode." A toggle on top of Midlife or Full Life, under Mode on the title screen.
- Years pass 2x faster, player and enemies move 25% faster, +50% 401(k) coins. Numbers live in `SPRINT` in `src/data/modes.js`.
- Unlocked by beating the Midlife Crisis V8 (Keep The Sedan). Sprint scores share the leaderboard, marked with ⚡.

## After V. 2.0: minimap and new stages (decided Nov 4, Rami by voice)
- **Minimap:** after you discover the map, a small HUD map fills in as you explore, with you, open and locked doors, chests, the Lounge and nearby interns. Tap or press M for a big paused view. Small and hideable on phones.
- **Stages are picked, not reached:** St. Deductible Hospital and the home neighborhood become stages you choose on the title screen (like Vampire Survivors), each with its own enemies, boss and gimmick, unlocked by an achievement. Midlife runs at the office stay the default. Full Life may chain office, hospital and home later.
- **Platforms order:** Steam, then phone apps (Capacitor wrapper), then consoles.

## New-player pass (Nov 4, from Gemini Argon's review, Rami's picks)
- **Shift briefing:** every run opens with the hero card plus "Today's shift" (the goal), with the clock stopped. Rami kept the hero card for its tone instead of hiding it.
- Level-up cards name evolution partners; interns wear a green ALLY ring; the first-ever title shows only PUNCH IN; Bills wait 14 s (not 11) to split before age 43.

### 2026-11-04: Student Lounge visual kit (Codex, art delivery)
TJ and Derek's Lounge can use the mustard desk wall, crowded camera/monitor workbench, white cubbies, navy food-pillow futon, chess coffee table and photo collage from Rami's real student lounge. `assets/stage/props/manifest-lounge.json` provides eleven modular families and suggested floor footprints; the two opaque shop illustrations reserve the lower fifth for overlays. These are prepared art assets, not a shipped room layout. Promotion timing, prices, boosts and navigation remain Claude's existing systems.

### 2026-11-04: Defeat art prepared (Codex)
Enemy remains use tiny, final-color debris piles with three variants per enemy. Boss knockdowns are static, intact toppled poses with dazed stars; the optional russet plate leaves defeat words to the UI. The art lives in `manifest-remains.json`, `manifest-knockdown.json` and `stamp-plate-v1.json`; this delivery changes no defeat timing, pooling, drops, collisions or game balance.

### 2026-11-05 Wall bonk art (Codex)

The wall impact uses one of three drywall cracks with a slate dent and cream plaster chips. The dizzy effect uses an orange star loop with a cream bird option. The frame indices and suggested cadences live in `assets/bosses/manifest-bonk.json`.

### 2026-11-05 Lounge weapon art (Codex)

Mic Drop falls and bounces before lavender feedback flickers over the resting mic. The sound ring has a clear center so enemies stay visible. Say Cheese uses a right-facing camera with a cream flash and four interchangeable frozen poses. Frame order and preview timings live in `assets/weapons/manifest-lounge-weapons-v1.json`.

### 2026-11-05 Retirement party art (Codex)

The 9-to-5er, TJ, Derek, a clipboard intern, Eli from IT and a party-hat Bill gather around a sheet cake. The tall version rearranges the party into two tiers while keeping the sprites at the same scale. The frame manifest covers both layouts and a still frame for reduced motion.

### 2026-11-05 Hero walk cycle repair (Codex)

Each direction uses eight walk poses at the game's 95 ms cadence. The near leg leads the first contact pose and the far leg leads the second. Arms swing against the legs, and the head and torso dip one pixel on the down beats.

## Coin economy (decided Nov 5, V. 2.8.0)
- Goal: about 25-35 runs to max the 401(k) Shop, and every run (even a quick death) earns something.
- Paycheck per year survived; late-career taper on drops, chests and dividends; shop prices rise 8% per rank owned.
- The taper only affects the bank, never the score. Tuning knobs: `COIN_ECONOMY` in src/data/meta.js.

## The Lounge, two ways (decided Nov 5, V. 2.8.2)
- **Day One cart (hidden in a far corner of the Bullpen or Lobby, first 2 min, found by exploring):** Lounge-only weapons and whole-run perks, bought with banked 401(k) coins. A real start-of-run choice.
- **Break Room counter (after promotions 45-60):** heals and quick buffs only.

### 2026-11-05 Coworker pose cleanup (Codex)

Each coworker has a quiet typing loop, a personal gesture and a small standing breath. The chairs and faces hold steady while the hands move. The standing walks alternate legs and share a local y56 foot line.
## Hustle and Burning the Candle (decided Nov 5, V. 2.9.1, Kevin's idea)
- Midlife in one mechanic: hustling pays early, then costs you. Before 55 movement and exploring raise the paycheck; after 55 nonstop movement fills a candle meter and summons Medical Bills (copays).
- Rule kept from First Day: it punishes overdoing it, never normal dodging. A one-second pause drains the meter.

## Fiscal years and the Corporate Buyout (decided Nov 5, V. 2.9.3, Kevin's idea)
- Each big version starts a fiscal year (season). The board defaults to the current year; all-time stays one tap away.
- The buyout is optional, offered once a year, and pays 50% of shop spending, with a BOUGHT OUT badge on that year's board.

### 2026-11-05 Medical Bill and Lounge Cart art (Codex)

The Medical Bill is a hospital invoice in a pink gown with a clipboard. The Day One Lounge Cart has an orange and cream awning, tip jar, coffee pot and blank chalkboard. Steam rises while it is open, and the awning folds down when it closes.

### 2026-11-05 Pickup and projectile art (Codex)

Pickups use a steady idle pose and a cream shine frame. Projectiles share the same 32px grid, with a turn for the remote and an advancing arc for the podcast wave.

## Business path (Nov 6, 2026, Rami's question: could this pay for a house?)
- **Framing agreed with Rami:** plan finances as if the game earns zero; anything above that is upside.
- **Rough outcomes:** most Steam indies earn under a few thousand dollars; a polished, funny survivors-like might do $20k to $100k; a house-and-car result needs a breakout.
- **Money would come from** Steam first ($100 fee, 30% cut), itch.io for playtests, Ko-fi tips now. Mobile stays parked.
- **In our control:** make it fun first, lean on Rami's marketing strengths (photos, writing, devlog), keep the one-line hook, put a Steam page up months before launch for wishlists.
- **First money milestone:** cover the monthly AI subscriptions. Cost tracker to come once Rami shares plan prices.
- **Domain:** midlifesurvivors.com (Porkbun, $11.81/yr). Guests get a "We're moving" note before the switch.
- Revisit in Phase 6: Steam page, wishlists, trailer, pricing, publisher question.

## Merch (Nov 6, 2026, Rami + Kevin on Discord)
- **Idea:** physical goods from the game's characters as Ko-fi donation incentives. Rami's original thought was 3D-printed figurines; Kevin (who has a single-filament 3D printer and a laser engraver) offered to fabricate.
- **Tiers, as proposed:** keychains, lapel pins, fridge magnets and vinyl stickers first (cheap, flat, easy). Bobbleheads and fidget toys as the stretch tier. Iron-ons for hats and shirts also possible.
- **Why pixel standees before figurines:** the sprites are 48x48 and 56x60 px. At 1 mm per pixel they are keychain-sized, and the chunky pixel look survives single-color printing. True sculpted figurines need art direction locked (Phase 4) or they get reprinted.
- **Source files:** `art/merch/` holds one pack per character (native PNG with transparent background, 8x and 16x nearest-neighbor enlargements, a black silhouette for engraving, and a README with the key palette colors and thin-part warnings). Medical Bill first (the Hustle-meter invoice, Kevin's own idea), regular Bill, then the four heroes.
- **Open:** who covers material and shipping; whether any of this sells. Rami's stance: cart before the horse on purpose, same as the game itself.


### 2026-11-07 Flow scene references (Codex)

The Flow cut-scene kit begins with ten empty office locations in day and night versions. These references use a gentle three-quarter camera, perimeter furnishings and an open middle floor for composited characters. Posters and banners contain no words. The Executive Wing's founder tribute is abstract so the background contains no depicted person. This is art for cut scenes and does not change playable room layouts.

### 2026-11-07 Clean Flow cast references (Codex)

The first character batch pairs a natural full-body pose with an action pose for the four heroes, TJ and Derek. The portraits use cream backgrounds and the original office key-art look. These are cut-scene reference illustrations, with the existing character identities and costumes retained. Playable sprites and gameplay stay unchanged.

## Supply Closet art handoff (Nov 7, 2026, Codex)
The current secret hallway uses the badge-reader glitch between Server Room and Executive Wing. The art kit includes red/blink/green reader states, a slate floor plate, a utility door that slides into its frame, shelves, lost-and-found, mop, chair, bulb and concrete floor. Older cabinet art remains supplemental. This delivery does not alter the hallway logic.

## Performance Review intro art (Nov 7, 2026, Codex)
The four-second introduction uses the original Bullpen day plate, the 9-to-5er at about 35% screen width and the clipboard boss at 60%. Five timed holds show attention, skepticism, a small stomp and a restrained smile. This delivery adds art and a review page, not runtime playback.


## Decided Nov 8, 2026 (Rami)
- **Cut scenes:** no intro before every boss. At most three in a run: one at the start, one in the middle, one at the end. The Performance Review intro lives on as a title screen slide (wide screens only).
- **Easter eggs pay XP:** the first time each easter egg is found in a run, the player gets a free level (`EGG_BONUS` in `src/data/achievements.js`).
- **Office map (Nov 8, Rami):** found again every run (the YOU ARE HERE sign by reception), not once forever. Drawn as an evacuation map: rooms you've found in full, rooms you haven't as dashed outlines, locked rooms with their opening age. `MINIMAP.perRun` in `src/minimap.js`.
- **Errands (Nov 8, first test):** one TO-DO per run at about age 41.5: a floor marker, a map marker, an edge arrow and a 45-second chip. Rewards only (coins, HP or a level); missing it costs nothing. Errands and tuning live in `src/data/errands.js`. Next, if it's fun: more errands per run, errands in later rooms, maybe a small fine for missing one.
- **Stage 2 is Home (Nov 8, Rami, poll 7 to 1):** peak-fall northeastern suburb, enter your own house to unlock more of the stage, strip-mall grocery, LEGO brick hazard, Fifth-Grade Math Homework boss, Mortgage and V8 move here, Lemonade Stand shop, unlocks at 55 in the office. Full plan: `docs/plans/home-stage.md`. Nov 8: named **Maple Hollow**; two satirical neighborhood blocks added in the middle of the map; you get into your own house by finding the spare key.
- **New office bosses (Nov 8, Rami's picks)** to replace the Mortgage and the V8 when they move to Home: **The Reorg** (reshuffles the room: walls slide, desks swap, spawns move), **The Holiday Party** (a conga line in ugly sweaters; mistletoe zones freeze you for an awkward second), **Your New Boss (Age 26)** (fast, energy drinks, every attack comes with a pep talk). Order and ages to be decided. **Nov 8 decisions (Rami, from Grok's spec `docs/handoffs/grok-office-bosses-spec.md`):** Your New Boss at **48** every run, built first. The Reorg and The Holiday Party **take turns** in one slot at **56** for now; once the Mortgage and V8 move to Home, both can run in the office using the freed slots. Mistletoe **slows** you (0.35x for 0.9 s) instead of freezing you. The Reorg brings his own rolling Hot Desks (art prompt in `chatgpt-new-office-bosses.json`).

### Native art review contracts, 2026-11-09 (Codex)
Maple Hollow uses 32px terrain modules and isolated small props; curb and corner tiles are directional transitions. Reunion NPCs use 48px cells. The proposed retro-rendered 9-to-5er is cosmetic only, retaining 56x60 hero cells and the y56 sole line. These local drafts do not change gameplay.

### Home/shop art contracts, 2026-11-09 (Codex)
Six Home house fronts use192x224 cells with porch edge y216. Home enemies use48x48 cells with base y44. Proposed retro skins preserve56x60 hero cells, Dad sole y56 and Student sole y54; these are cosmetic art drafts only. Overtime icons use32px cells, one populated row in a256x64 atlas.

### Lounge cosmetics (decided Nov 9, Rami)
- Cosmetics are bought in the Lounge (cart or counter) with 401(k) coins and last only for the current run. No permanent unlocks.
- First one: Polygon Upgrade (retro 3D skin), 20k. More looks can join the same catalog later.
- Say Cheese gives a slight knockback (28 px) before its freeze.

### Cowboy cosmetic draft, 2026-11-09 (Codex)
The fourth proposed retro-rendered skin preserves the Cowboy v4 identity and56x60 grid, y56 soles and floppy-dust idle. Art only; gameplay and shop integration remain unchanged.

### Maple Hollow step 1 (Nov 9)
- The Home stage is selectable from the title screen settings (LOCATION) once your best age is 55. Same modes, bosses and Overtime events as the office for now; the office crowd follows you home until the home enemies land (step 4).
- Office-only systems stay in the office: promotions and doors, the office map, errands, interns, the Lounge, and the office easter eggs.

### Home three-room art proposal, 2026-11-09 (Codex)
The current interior art mock-up covers living room, kitchen and kid’s room, with a shared hallway. It includes the generic toy-brick hazard and homework desk. Garage interior remains a future option for the V8 pass. These local art drafts do not alter the playable map, unlock rules or boss placement.

### Maple Hollow boss lineup (decided Nov 9, Rami)
- 45 Fifth-Grade Math Homework (new), 48 HOA President, 52 30-Year Mortgage, 56 Holiday Party, 60 Midlife Crisis V8 (out of your garage), 63.5 Gold Watch. Full Life adds the Retirement and Pickleball bosses as in the office.
- Open for later: the office may feel light on bosses; revisit its lineup.

### Home boss and garage art drafts, 2026-11-09 (Codex)
Fifth-Grade Math Homework has native worksheet-monster poses with a paper-plane attack. The garage kit adds an unbranded family minivan, empty car-shaped dust spot and closed/open door modules. These art drafts do not change boss behavior, garage unlock rules or the playable map.

### Fifth-Grade Math Homework (Maple Hollow boss, age 45), built Nov 10
- Move: "Pop Quiz." Wind-up with dotted fan lines, then a fan of paper airplanes (5 lanes). Planes keep flying after he goes back to walking.
- Below half health: 6-lane fan plus a second fan in its gaps, and 3 crumpled pages lobbed onto marked circles around you.
- Stamp "A+ · SEE ME". Achievement "Carried the One" (5k). Numbers: BOSS_ATTACKS.mathHomework.

### The garage (Maple Hollow), built Nov 10
- Fourth room at the end of the hallway. The Midlife Crisis V8 is parked in the empty bay all run, over its dust outline.
- From 59.4 it revs ("vroom...", "VROOM.", "...vrrRRRM"). At 60 it bursts out: from the garage if you're inside, down your driveway if you're outside. The garage doors open.
- Numbers and lines: MAPLE_HOLLOW.garage. Code: src/garage.js.


## 2026-11-10: Maple Hollow art review (Codex)

Maple Hollow ground v2 art contract:832x320 street bands,512px lawns,64x256 driveway, eight64px non-solid decals. Repeat step832 explicitly approved to preserve64px road dash phase. Runtime integration pending review.

### Maple Hollow ground v2 and title slides (Nov 10)
- Ground: street plates A/B (832 repeat), lawn A/B checkerboard, driveway strip, 8 lawn stickers scattered by seed. Config: MAPLE_HOLLOW.ground2 (on: false returns to the v1 tiles).
- Title: slides 13 and 14 carry stage "home". Picking Maple Hollow opens on one and puts both first; otherwise they mix into the shuffle as a teaser.

### Decisions, Nov 10 (Rami, on Grok's Maple v2 + office boss spec)
- Office 60: **The Quarterly All-Hands replaces the V8** (built V2.25.0). The V8 is home-only, bursting out of the garage. Beating either unlocks Sprint.
- Maple v2 upstairs: **a few enemies follow** (walkers within 220 px, max 6, after 1.2 s); bosses always follow.
- Rami's desk: **"Ship It" buff** (weapons 15% faster for 20 s, 90 s cooldown) **plus a free level on the first visit**.
- HOA yard sprinkler: **push only**, no damage.
- Full numbers: docs/handoffs/grok-maple-v2-reply.md.

## 2026-11-10: Maple Hollow v2 art (Codex)

Maple Hollow v2 art contract:416px lots,832x512 streets,64px side paths and yard gate gaps. Printed home dimensions24px/ft,16px walls; existing hero56px projection retained. Single10′11″ ×20′ garage confirmed by Rami. Measured floor canvases416x1392 and416x928; see data maps for inferred undimensioned areas.


## 2026-11-10: Photo-based home interior (Codex)

Home interior identity corrected from Rami’s photo brief: work desk in downstairs dining/window nook; upstairs front room is Abe’s music/cars/games bedroom. Living room has cream L sofas, sim rig, baby swings and mirrored fireplace. Master includes crib and twin bassinet. Private photos are reference-only, never public assets.

### Maple Hollow v2 outside (built Nov 10, V2.26.0)
- Three street plates wide (2,496 px), two rows of three lots. Each lot: house front, a 64 px side path, a fenced backyard behind with a gate in each shared fence.
- North row: the top hedge is solid. South row: steps in the hedge lead up to the street behind.
- Your house sits in the middle of the north row; front door left, garage right. The Lemonade Stand is one house over to the west.
- The old v1 layout stays in the code behind a data switch (`MAPLE_HOLLOW.v2.on`).

### Message pacing (decided Nov 10, design system A6)
- Errands and the Lounge never start during a boss, or within 0.6 years of 45, 50, 55 or 60. Swarm events wait for any boss.
- Milestone birthdays at 50 and 60 are one bottom-bar line: the decade, the cake and the dividend.
- Rewards use the bottom bar only. Flavor lines (LIFE after a promotion) wait for 20 seconds of quiet. First life modifier at 50.8.
- Numbers: `src/data/pacing.js`.

### HUD and camera (decided Nov 10, design system A8)
- The HUD leads with your age (big, coffee orange), with the run clock under it. Empty item slots only appear in the level-up menu.
- The camera keeps the hero at least 48 px tall on screen. On phones this means zoom 0.95 (was 0.75), about 20% less floor visible. Tunable: `VIEW.minHeroPx` in `src/main.js`.
- Phone held sideways: one HUD row, small minimap, short message bar.

### The big house (decided and built Nov 10, V2.28.0)
- Rami: the house should feel like "a substantial part of the stage in terms of scale," not a narrow strip. Of three mock-ups he picked **C, spread out**: Codex's measured floor plan with the rooms 2x wide and 1.5x tall, every piece at its drawn size. The ground floor is 800 x 2,069 px including the garage.
- Walking through the front door animates (shrink and fade into the doorway, screen fade, step through). Planned: the same for the stairs.
- Mood for filling the bigger rooms (step 2c), from Rami's photos: patterned rugs under each sitting area, plants in corners, warm lamps, wall shelves. Photos stay reference only.
- Layout: src/data/house-v2.js, built by tools/build_house_v2.py. Switch: MAPLE_HOLLOW.house2.on.

### Camera and pixels (decided Nov 11, level art audit)
- The camera zooms by whole numbers only. Laptops, MacBooks, iPads and phones use 1; 1440p uses 2; 4K uses 3.
- A 1080p monitor sits between 1 and 2, so Settings has a Camera row there: CLOSE (2, the default for now) or WIDE (1). Rami picks the final default after trying both. `meta.cameraWide`, `viewZoomChoices` in `src/main.js`.
- This replaces the 0.95 phone zoom from A8. The hero is 52 px tall on phones, still above the 48 px floor.
- Pixel-art mode is on for the whole game. Lights and floor shadows stay soft.


### The boundary and world rules (Nov 11, Rami)
- **Decided: trees contain the level.** A solid tree wall on all four sides of Maple Hollow is the ultimate boundary. The player never sees past it (no void, no hedge edge). Live in V2.29.5 with Codex's painted Batch A wall sides (corners pending a redo).
- **Decided (Nov 11): streets end in a cul-de-sac or dead end** where they meet the forest, and a grass strip separates the end houses from the trees.
- **Decided (Nov 11): Maple Hollow's one grass color is the lighter green (#9BAE73).** Yards, lawns and parkways all move to it.
- **Decided (Nov 11): the front door opens with an animation when the key-hunt loot is collected**, and you can walk straight in.
- **Approved Nov 11 (now in CLAUDE.md, "World rules"):** three kinds of object, each with its own look.
  - **Wall:** taller than the hero, full outline, heavy shadow. Never passable. You can walk behind the top part.
  - **Breakable:** hero height or smaller, cream top highlight. Blocks until smashed, then drops loot.
  - **Walk-through:** flat on the ground, no outline, no shadow. Never blocks.
- **Approved:** every gap the player is meant to use is at least 96 px wide, and every yard has two ways out. Backyard gates and hedge steps widened to 96 px in V. 2.29.1 (were 64 and 52).
- **Found:** backyard furniture is painted into the ground picture, so you walk over it and can never pass behind it. Job 3 asks for it as separate sprites.

## Maple Hollow balance (decided Nov 12, Rami)
- Home enemies Gutter Clog and Lawn Mower hit for 1 (was 2). Home gets its own heals: leftover pizza from beaten enemies (2%, 20 s cooldown) and a fridge that restocks every 5 years. Numbers live in `src/data/maple-hollow.js`.

## Maple Hollow full map (decided Nov 12, Rami)
- Areas open by age, using the office's rules for now. Rethink unlocks for the whole game later.
- Each boss gets an arena in its own area: Math Homework at the elementary school (45), HOA President in the Birch Circle cul-de-sac (48), Mortgage at the strip mall bank (52), Holiday Party at the community center (56), V8 on the parkway (60), Gold Watch at the park (63.5).
- A loop road around your block links the areas and gives the swarm a lap to run.
- New area: a busy town square with an arcade, a skate park and a few shops.
- The map should feel BIG.
- The run ends back home on your porch.
- To-scale draft v3b: `docs/plans/home-map-v3.png` (8,384 x 8,448 px, about 6.5 x 10.5 screens; Rami: feels right for 19 minutes).
- Town Square is the center of the map, inside the loop, and opens at 53 (Rami: "where the game will really come together"). Your block moves to the bottom right corner, so the run starts and ends in a corner.
- Built (V2.31.0, Nov 13): the road grid and the loop, with every area still to come as signed woods. Next: build the areas one per sitting, starting with Elementary (44).
- Built (V2.32.0, Nov 13): Elementary opens at 44 (woods clear, playground and soccer field from the yard kit). Math Homework comes out of the playground. School building art: Codex brief `docs/handoffs/codex-elementary.md`; delivered and placed in V2.34.0 (PR #7).
- Built (V2.33.0, Nov 13): Birch Circle opens at 47 (six houses, cul-de-sac, HOA backyards and common). The HOA President comes out in the cul-de-sac.
- Waiting on art (Nov 13): the Strip Mall, Community Center and Town Square need buildings (Codex brief `docs/handoffs/codex-town-buildings.md`). The office parking-lot props were ruled out because their style doesn't match Maple Hollow. Maple Park and the Parkway can be built from the yard kit.
- Built (V2.35.0, Nov 13): Maple Park opens at 62 (pavilion and koi pond, picnic grills, bird-watching corner). The Gold Watch comes out at the pavilion.
- Built (V2.36.0, Nov 13): the Parkway opens at 59 (through road, road out of town closed until Full Life). The V8 stays in your garage next door. Golf course art added to the Codex brief.
- Idea, not decided: in Full Life, stages connect (office, Maple Hollow, hospital, later others) with growing swarms and giant bosses. Claude suggests stages joined by roads rather than one seamless map, and a closed road out of town on Maple Hollow's edge for now. Confirmed: Midlife stays 40 to 65 (about 19 min); Full Life should last at least 30 min (it runs about an hour now).
