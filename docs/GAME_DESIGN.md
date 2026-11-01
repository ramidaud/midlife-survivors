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
