# Midlife Survivors: Progress Log

Newest entries at the bottom. Each work session and weekly check-in adds one entry.

---

## 2026-10-30: Project kickoff
- Set up the project folder, CLAUDE.md (instructions for Claude), GAME_DESIGN.md, ROADMAP.md, LEARNING_NOTES.md.
- Decisions: browser-first with Phaser 3, placeholder art until it's fun, weekly Sunday evening check-ins, 3-5 hours a week.
- Next: Rami answers the open questions in GAME_DESIGN.md; then build "Hello game" (a movable square).

## 2026-10-30: Workflow rules added
- Standing rule: update every project doc and the roadmap page at the end of each session.
- Standing rule: flag "Instruction check" moments before changing CLAUDE.md (end of Phase 0, new tooling, git, art direction, platform, schedule changes, repeated feedback).

## 2026-10-30: Top 10 annoyances + save rule
- Rami's Top 10 (bills, phone calls, diabetes, fat, work drama, sleep, aches and pains, death, kids' math homework, errands) mapped to enemies and mechanics in GAME_DESIGN.md section 2b.
- Idea: Death arrives at age 50 and can't be beaten, like the Vampire Survivors Reaper.
- Rule change (approved): save docs after every finished step; "wrap up" triggers a full save and recap.
- Next: build "Hello game" (a movable square).

## 2026-10-30: Hello Game built
- Built a movable square ("You (40)") on an endless office-carpet floor with a following camera. Controls: WASD, arrow keys, or drag on a phone.
- Published as the "Midlife Survivors Playtest" artifact. Tested in a headless browser first; fixed one garbled symbol.
- First data file: `src/data/player.js` (speed, size, color).
- Concept learned: the game loop.
- Next: Rami plays on laptop and phone; then Phase 1 starts with Bills chasing the player.

## 2026-10-30: Ready for other tools
- Added AGENTS.md so Google Antigravity (or any agent) follows CLAUDE.md. Non-Claude sessions tag their log entries with the tool name; Claude republishes the playtest and syncs the Project when Rami returns.

## 2026-10-30: Bills chase the player (Antigravity)
- Green "$" Bills now appear just past a random edge of the screen every 0.9 seconds and walk toward the player. They bump into each other, so they form a crowd instead of one blob.
- New data file: `src/data/enemies.js` (Bill speed, size, color) plus `SPAWNING` (how often, max on screen, offscreen margin).
- Bills can't hurt you yet; contact damage comes in a later step.
- Note: the roadmap said "Unread Emails" for this step; switched to Bills to match Rami's Top 10 and the last log entry.
- Concept learned: spawning and chasing.
- Next: Coffee Splash fires automatically. Claude: republish the playtest and sync the Project.

## 2026-10-30: Phase 0 done + Coffee Splash fires (Antigravity)
- Rami confirmed the playtest works on his phone. Phase 0 is complete; now in Phase 1.
- Coffee Splash: every second a brown drop flies from the player toward the nearest Bill and evaporates after 450px. It doesn't hit anything yet; damage is the next step.
- New data file: `src/data/weapons.js` (fire rate, speed, range, size, color).
- Concept learned: targeting (finding the nearest enemy).
- Next: splashes hit Bills and Bills disappear; then contact damage. Claude: republish the playtest, sync the Project, and run the end-of-Phase-0 Instruction check.

## 2026-10-30: Splashes hit Bills (Antigravity)
- Rami: auto-targeting feels good.
- Coffee splashes now hit Bills. Each hit flashes the Bill white and removes 1 health; Bills have 2, so two splashes pay one off and it disappears.
- New numbers: `hp` in `enemies.js`, `damage` in `weapons.js`.
- Concept learned: collisions (overlap) and health points.
- Next: Bills hurt the player on contact (player health), then the Game Over screen.

## 2026-10-30: Textbook started (Antigravity)
- Rami: early enemy pace feels just right. Session pace and teaching amount feel right (end-of-Phase-0 Instruction check: yes).
- Rami asked for more visual aids, "like a textbook." Created `docs/TEXTBOOK.md`: one chapter per concept with diagrams (Mermaid flowcharts, sketches, tables). Chapters 1-6 cover everything built so far.
- Proposed CLAUDE.md change (awaiting Rami's OK): add a textbook chapter with at least one diagram after every step.
- Rami approved: Claude/agents may update the textbook as we go, and visual aids must appear **in the chat replies**, not only in the document. Added to CLAUDE.md step 5 (approved by Rami).

## 2026-10-30: Bills hurt the player (Antigravity)
- Player now has 10 HP and a red health bar under the AGE text. Each Bill touch costs 1 HP, then a 0.7 s safe window (invulnerability) so crowds don't melt you instantly. Red flash on hit.
- At 0 HP the game freezes with a temporary "Out of steam. Reload to try again." message.
- New numbers: `maxHp`, `hurtCooldownMs` in `player.js`; `damage` in `enemies.js`.
- Concept learned: player health and invulnerability windows. Textbook Chapter 7 added.
- Next: real Game Over screen with a funny cause of death and a restart button.

## 2026-10-30: Game Over screen (Antigravity)
- Rami lasted a couple of minutes; difficulty felt good.
- Game Over screen: dark overlay, "GAME OVER", a random cause of death, survival time, and a "Try again" button (click, tap, or Space) that restarts the run.
- New data file: `src/data/deaths.js`, death jokes grouped by killer (6 Bill lines). Rami can add his own.
- Concept learned: restarting a scene and resetting state. Textbook Chapter 8 added.
- Next: remaining Phase 1 item is the endless floor (player currently stops at the 4000px world edge).

## 2026-10-30: Endless floor (Antigravity)
- Removed the 4000px world walls. The floor is now a screen-sized tile sprite pinned to the camera whose pattern scrolls with the camera, so the carpet never ends.
- All Phase 1 build items are done. Remaining open line in Phase 1 is an empty placeholder checkbox.
- Concept learned: scrolling a texture instead of building a huge world. Textbook Chapter 9 added.
- Next: Phase 2, starting with Wisdom gems dropping from Bills. Claude: republish the playtest, update the roadmap page, sync the Project.

## 2026-10-30: Wisdom gems and XP (Antigravity)
- Phase 2 started. Paid-off Bills drop blue Wisdom gems. Gems within 90px get magnet-pulled to the player. Each gem is 1 XP.
- Blue XP bar with "LV" under the health bar. Level 2 needs 5 gems, each next level 40% more. A floating "LEVEL UP!" plays for now.
- New data file: `src/data/pickups.js` (gem XP, magnet radius/speed, leveling curve).
- Concept learned: XP curves. Textbook Chapter 10 added.
- Next: level-up screen with 3 choices (pauses the game).

## 2026-10-30: Level-up screen (Antigravity)
- When the XP bar fills, the game pauses (physics + timers) and shows 3 random upgrade cards. Pick by click, tap, or keys 1/2/3. Multiple level-ups queue up.
- 6 upgrades in new `src/data/upgrades.js`: Extra Shot, Dark Roast, Long Pour, New Sneakers, Annual Checkup, Reading Glasses.
- Code change: the game now copies data numbers into a per-run `stats` object; upgrades edit `stats`, so restarts are clean.
- Concept learned: pausing, and data (recipe) vs. run stats (copy). Textbook Chapter 11 added.
- Next: a second weapon (roadmap: 3 weapons and 2 passives).

## 2026-10-30: Audio cues and controller support (Antigravity)
- Added synthesized retro sound effects using the browser's Web Audio API (`src/sfx.js` and `src/data/sounds.js`): shoot, hit, billPaid ("cha-ching"), gem pickup, hurt, levelUp fanfare, menu move/pick, and gameOver. Press M to mute.
- Added full gamepad support (Xbox, PlayStation, Switch Pro, etc.): left stick (with 0.2 deadzone) or D-pad to move, D-pad/stick + A button to pick level-up cards, and A or Start to restart on Game Over.
- Concept learned: synthesized audio, stick deadzones, and "just pressed" vs. "held" buttons. Textbook Chapter 12 added.
- Next: 2nd and 3rd weapons + 2 passives so the level-up choices create a real power fantasy.

## 2026-10-30: 3 weapons and 2 passives (Antigravity)
- Added Weapon 2 (**Dad Joke**): expanding yellow cringe ring every 2.2s that damages all Bills inside it and floats a random dad joke ("Hi Hungry, I'm Dad!").
- Added Weapon 3 (**The Word "No."**): expanding teal shockwave every 3.2s that damages nearby Bills and shoves them 95px away from the player.
- Added Passives (**Comfortable Shoes** +15% move speed, **Good Night's Sleep** 15% faster firing across all weapons, plus Annual Checkup and Reading Glasses).
- Upgrades now support a `when(stats)` filter so you unlock a weapon first, and its power-ups ("Louder Groan", "Firm Boundaries") only enter the pool once unlocked.
- Concept learned: Area-of-Effect (AoE), radial knockback vectors, and conditional upgrade pools. Textbook Chapter 13 added.
- Next: Age clock (40 to 50) replaces the static "AGE 40" text to finish Phase 2.

## 2026-10-30: Age clock, Pause, and First Boss (Antigravity)
- Removed the Game Over sound cue as requested.
- Added **Pause** (`P`, `Esc`, or controller `Start` button): freezes physics and timers and shows a `PAUSED` overlay.
- Added the **Age Clock**: you now age continuously from 40 upward (`secondsPerYear: 20` in `player.js` for brisk playtesting), shown in the HUD (`AGE 41.3`), on your player label, and on the Game Over screen (`Reached Age 42.4`). That finishes Phase 2!
- Added our first boss, **The Performance Review** (`HR:30` in `enemies.js`): arrives at Age 42 (40 seconds in) with a warning banner and ominous sound, 30 HP, 2 contact damage, and its own HR death jokes in `deaths.js`.
- Defeating the boss drops a gold **BONUS Chest** (`pickups.js`) that opens a `BOSS BONUS!` screen prioritizing any locked weapons first.
- Concept learned: converting game time into narrative milestones (Age) and boss reward loops. Textbook Chapter 14 added.
- Next: Phase 3 enemy variety and wave schedule (e.g. Spam Likely phone calls, Unpaid Bills splitting into Late Fees).

## 2026-10-30: Wave schedule, Late Fees, and Spam Likely calls (Antigravity)
- Added **Wave Schedule tied to Age** (`SPAWNING.waves` in `enemies.js`): spawn rate accelerates from 900ms at Age 40 down to 440ms by Age 45, automatically resetting `spawnTimer` as you pass each birthday.
- Added **Late Fees** (`FEE`): any Bill left unpaid for 9 seconds turns overdue and splits into 2 fast red Late Fees (`speed: 135`).
- Added **Spam Likely** phone calls (`TEL`): starting at Age 41, purple phones creep in for 1.4s, stop and vibrate with a `"RING!"` warning for 0.55s while locking onto your position, then dash in a straight line at `310 px/s`.
- Added custom death lines for both `lateFee` and `spamCall` in `deaths.js`, plus `ring` and `overdue` synth sounds in `sounds.js`.
- Concept learned: wave tables and enemy state machines (telegraphed attacks). Textbook Chapter 15 added.
- Next: more enemy types (e.g. Back Twinge, Office Gossip elite), the other two bosses (Mortgage Refinance at 46, Midlife Crisis at 48), and Weapon Evolutions!

## 2026-10-30: 6 enemy types + Elite, all 3 Bosses, and 3 Evolutions (Antigravity)
- Expanded enemy roster to **6 regular types** in `enemies.js`:
  1. **Bill** (`$`): splits into 2 Late Fees if unpaid for 9s.
  2. **Late Fee** (`FEE`): fast red overdue slip.
  3. **Spam Likely** (`TEL`): creeps, vibrates `"RING!"`, then rockets in a straight line.
  4. **Late-Night Donut** (`YUM`): pink frosted donut that inflicts a 2-second `"SUGAR CRASH!"` slow (35% slower movement) on contact.
  5. **Back Twinge** (`OUCH`): sharp orange triangle that lunges at `200 px/s` in spasms (0.55s lunge, 0.45s rest).
  6. **Reply-All Chain** (`CC:`, **Elite**): 8 HP corporate-blue box with white trim; drops **3 Wisdom gems** and splits into 2 Late Fees when defeated.
- Added the remaining **Decade Bosses**: **The Mortgage Refinance** (`APR:55` at Age 45) and **The Midlife Crisis** (`V8:80` at Age 48, fast sports-car red), each dropping a gold Bonus Chest.
- Added **3 Weapon Evolutions** in `upgrades.js`:
  - **Cold Brew Concentrate** (Upgraded Coffee + Good Night's Sleep): fires a 3-shot spread that pierces through 3 enemies each!
  - **Unhinged Pun Storm** (Upgraded Dad Joke + Reading Glasses): 50% larger ring, nearly double speed, +2 damage.
  - **Healthy Boundaries** (Upgraded "No." + Comfortable Shoes): huge shockwave that shoves twice as far and heals 1 HP every time it fires.
- Concept learned: weighted raffle-ticket spawn tables and synergy/evolution recipes. Textbook Chapter 16 added.
- Next: Win screen / Death at Age 50 to complete Phase 3!

## 2026-10-30: Pixel-art sprites and textured background (Antigravity)
- Created `src/sprites.js` with `makePixelArt()` and `buildSprites()` so every character, enemy, boss, weapon projectile, pickup, and the background floor has a custom pixel-art sprite with zero external image files.
- Sprites added:
  - **Background (`floor`):** 128x128 woven office carpet tile with alternating quadrants, fiber speckles, grout seams, and a subtle coffee-ring stain.
  - **Player (`player`):** midlife hero with salt-and-pepper temples, glasses, white shirt, red tie, slacks, and an orange coffee mug in hand, plus directional facing (`setFlipX`) and a jaunty walk wobble.
  - **Enemies:** Green dollar-bill envelope (`bill`), red exclamation notice (`lateFee`), glowing smartphone (`spamCall`), pink sprinkled donut (`snackAttack`), electric lightning bolt (`backTwinge`), and unread-badge inbox envelope (`officeGossip`).
  - **Bosses:** Giant HR frowny clipboard (`performanceReview`), columned purple bank (`mortgageRefinance`), and cherry-red sports convertible (`midlifeCrisis`).
  - **Objects:** Steaming coffee drop (`splash`), faceted crystal (`gem`), and gold treasure chest (`chest`).
- Concept learned: procedural pixel-art grids (`makePixelArt`) and procedural walk wobble. Textbook Chapter 17 added.
- Next: Win screen / Death at Age 50 to complete Phase 3!

## 2026-10-30: Upgraded sprites to 16-bit SNES/Genesis style (Antigravity)
- Upgraded `src/sprites.js` from flat 8-bit grids to high-fidelity 16-bit Canvas 2D sprites (`makeCanvasTex`) with gradients, dark outlines, specular highlights, drop shadows, and fine details:
  - **Floor (`floor`):** beveled 128x128 carpet tiles with cross-hatch weave, coffee stain, and a tilted yellow sticky note.
  - **Player (`player`):** 40x44 shaded RPG hero with chestnut hair, silver-gray midlife temples, reflective glasses, red power tie, slacks, and a steaming orange coffee mug.
  - **Enemies & Bosses:** 3D glazed donut with donut hole and rainbow sprinkles, metallic purple smartphone with glass reflection, shaded dollar bill with `$` medallion, crimson PAST DUE envelope, stacked corporate inbox with `"99"` unread badge, glowing lightning bolt, giant HR clipboard, columned marble & gold bank (`%`), and a cherry-red convertible sports car with mag wheels and racing stripe.

## 2026-10-30: High-detail 16-bit sprites + Open-plan Office Stage with Scenery Props (Antigravity)
- Upgraded the stage in `src/sprites.js` to a **512x512 multi-zone open-plan office floor** featuring herringbone carpet tiles, a warm wood-plank hallway with brass transition strips, a teal-and-gold breakroom rug, brass floor outlets, scattered memos, sticky notes, and double coffee stains.
- Added **infinite-scrolling office scenery props** (`spawnStageProps` / `updateStageProps`): cubicle workstations with glowing dual spreadsheet monitors, keyboards, rolling chairs, and yellow pads (`prop_desk`), potted monstera ferns (`prop_plant`), and 5-gallon bottled watercoolers (`prop_cooler`) placed deterministically around the world as you walk.
- Added finer 16-bit character details: player now wears a charcoal-blue blazer over a white dress shirt, red silk tie, clip-on Employee ID badge, gold nose-bridge glasses with eye catchlights, swooping hair lock with silver-gray temples, and curls of steam rising from the mug; enemies have expressive details (angry glowing eyes on Late Fees, vibrating ring arcs on Spam Calls, 8-point nerve bursts on Back Twinges, 3-deep cascading envelopes on Reply-All Chains, and bucket seats + rear wing + red brake calipers on the Midlife Crisis convertible).

## 2026-10-30: Published to GitHub & GitHub Pages (Antigravity)
- Initialized git repository, committed the project, and pushed to `https://github.com/ramidaud/midlife-survivors`.
- Enabled GitHub Pages so friends can play directly at `https://ramidaud.github.io/midlife-survivors/` on laptop, phone, or controller.

## 2026-10-30: Age 50 Win Screen & Father Time — Phase 3 Complete! (Antigravity)
- Approved CLAUDE.md rule update: every finished step now commits to git and pushes to `origin main` so the GitHub Pages link stays live.
- Added **Father Time (`theReaper`)** at **Age 50.0** (`enemies.js` & 16-bit hooded scythe sprite in `sprites.js`): arrives when you turn 50 and triggers the gold **"YOU SURVIVED YOUR 40s!"** Win Screen with celebratory 50th-birthday jokes.
- **Phase 3 is now complete!** Moving into Phase 4 (Feel and look: damage numbers, screen shake, title screen).

## 2026-10-30: Phase 4 Complete — Game Juice, Retro Groove & Title Screen! (Antigravity)
- Added **Combat Juice** in `main.js`:
  - **Floating damage numbers** (`popDamageNumber`): pops `-1` (white) or `-2+` (big gold) that drifts upward and fades out.
  - **Squash-and-stretch punch** on enemy hits (`scaleX: 1.22, scaleY: 0.82` yoyo tween).
  - **Shredded paper / confetti bursts** (`burstConfetti`) when Bills and Bosses are defeated.
  - **Screen shake** (`cameras.main.shake`) when taking contact damage, when a Decade Boss arrives, and when a Boss goes down.
- Added a **16-bit Chiptune Background Groove** (`SOUNDS.music` in `sounds.js` + sequencer in `sfx.js`): 16-step triangle bassline + square-wave lead melody that plays during runs, pauses when paused or on Game Over, and mutes with `M`.
- Added the **Title Screen** (`showTitleScreen`): displays the *MIDLIFE SURVIVORS* logo, a 16-bit sprite showcase lineup, and a **"CLOCK IN"** button (Click, Space, Enter, or Controller A/Start) that unlocks browser audio right at the start.
- **Phase 4 is now 100% complete!** Next: Phase 5 (401(k) Coins, permanent upgrade shop, `localStorage` save data, and unlockable characters).

## 2026-10-30: Phase 5 Complete — 401(k) Coins, Permanent Shop, Save Data & 3 Characters! (Antigravity)
- Created `src/data/meta.js` with `META_SHOP`, `CHARACTERS`, and `localStorage` persistence (`loadMeta` / `saveMeta`).
- Added **401(k) Gold Coins** (`coin401k` in `pickups.js` + 16-bit embossed `"k"` coin sprite in `sprites.js`): 35% drop chance from Bills, 2 from Elites, 5 from Bosses.
- Upgraded the **Title Screen** and **Game Over Screen**:
  - Game Over now shows `401(k): +X (Total: Y)` and a **"401(k) Shop"** button alongside **"Try again"**.
  - Title Screen now includes **Character Selection** (**The 9-to-5er**, **The Senior Photographer**, and **The Grad Student at 45**) and the **401(k) Permanent Upgrade Shop** (**Employer Match**, **Home Espresso**, **CPA on Retainer**).
- **Phase 5 is now 100% complete!** Moving into Phase 6 (Share it & playtest with friends).

## 2026-10-30: Live 3-Way Camera Style Switcher (`2D 16-Bit`, `Diablo 3/4`, `3D Third-Person`)! (Antigravity)
- Added `three.min.js` (`r128`) and created `src/view3d.js` so players can press **`V`** (or click **`[V] Style: ...`** in the top-right HUD, on the Title Screen, or press **`Y`** on a controller) at any time to cycle live between three visual styles:
  1. **`2D 16-Bit`**: Classic top-down 16-bit Phaser pixel-art view.
  2. **`Diablo 3/4`**: Moody 45-degree isometric dungeon-crawler view (`FOV 38`) with dark atmospheric fog, warm golden player torchlight, and long real-time directional shadows.
  3. **`3D Third-Person`**: Over-the-shoulder 3D action camera (`FOV 60`, "Fortnite meets Vampire Survivors") looking across the 3D arena with sky lighting, horizon fog, 3D hero/enemy/boss models, and 3D expanding shockwave rings.
- Kept all game logic, physics, collisions, and UI menus in Phaser while projecting 3D coordinates (`project3DToPhaserWorld`) so floating damage numbers and enemy tags track above their 3D models.

## 2026-10-30: Pacing Rebalance, Solid Furniture Barriers & Climbable Mezzanine Platforms! (Antigravity)
- **Fixed Early-Game Difficulty & Progression Pacing:**
  - Lowered basic `bill` HP from `2` to `1` (`overdueAfterMs` extended from `9s` to `14s`) and boosted starting `coffeeSplash` fire rate (`650ms` vs. `1000ms`) so 1 splash of coffee pays off a Bill right at Level 1.
  - Smoothed the XP curve (`firstLevelXp: 3`, `growth: 1.25`), increased `magnetRadius` (`120px`), raised starting `maxHp` to `14` (`hurtCooldownMs: 900`), and added a **`+2 HP` heal on every level-up**.
  - Tuned wave intervals (`1250ms` down to `620ms`) and Boss HP (`18 / 34 / 50`) so upgrades stay ahead of the crowd.
- **Solid Office Furniture Barriers:**
  - Converted `stageProps` (`prop_desk`, `prop_plant`, `prop_cooler`) into immovable Arcade Physics bodies (`window.propGroup`) with colliders on both `player` and `bills`, plus distinct 3D meshes in `view3d.js`.
- **Climbable Mezzanine Platforms & Stairs (`prop_platform`):**
  - Added raised **Mezzanine Platforms (`height = 42`)** with **6-step staircases** on their left side and **brass guardrails** on their top, right, and bottom ledges.
  - In **2D 16-Bit Mode**, platforms render as detailed pixel-art mezzanines with stairs and handrails; in **Diablo 3/4** and **3D Third-Person Modes**, they render as 3D multi-step staircases, columns, and raised decks that physically lift the player, enemies, pickups, and camera as you climb!

## 2026-10-30: Chameleon + Corporate Satire HTML/CSS UI & Smashable Potted Plants! (Antigravity)
- Created `src/ui.js` and styled `#ui-layer` in `index.html` using **Interface In Game** design principles (Option A + Option C):
  - **Chameleon Theme Engine (`data-theme="0" | "1" | "2"`):** Pressing **`[V]`** morphs the entire UI typography, borders, and colors between **`2D 16-Bit` (`Press Start 2P`, pixel bevels, `"CORP-OS v1.98"`)**, **`Diablo 3/4` (`Cinzel`, obsidian & antique gold filigree, `"SANCTUARY HR"`)**, and **`AAA 3D` (`Bungee`, skewed Frosted Glass neon pods, `"MIDLIFE ROYALE"`)**.
  - **Peripheral 3-Zone HUD:** Top-Left Employee ID & Vitality Pod (`HP`, `XP`, active perk badges), Top-Center **Decade Survival Timeline (`Age 40 -> 50`)** with Boss milestone pips (`42 📋`, `45 🏦`, `48 🏎️`, `50 🏆`), and Top-Right 401(k) Ticker + 3-Way Camera Pill.
  - **3 Vertical Collectible Perk Cards (`#levelup-modal`)**, **Outlook-Style Boss Calendar Toast (`#boss-toast`)**, **Executive Dossier Title Screen (`#title-modal`)**, and **HR Exit Interview / AARP Certificate (`#gameover-modal`)**.
- **Smashable Potted Office Plants (`prop_plant`) + Leftover Breakroom Pizza (`pizza`):**
  - Potted plants can now be cracked open in 2 hits (`damagePlant` via Coffee Splash, Dad Joke, or "No.") to drop **Leftover Breakroom Pizza** (`+3 HP` heal!), **401(k) Gold Coins**, or a **3-Gem Bonus Stash**!

## 2026-10-30: Age 40-to-80 Campaign, 20 Bonus Senior Rounds (80-100) & Mid-Run Save State! (Antigravity)
- **Fixed Pause-Time Age Clock Bug (`runElapsedMs`):**
  - Previously, `currentAge` was calculated from `(this.time.now - startTime) / 1000`. Because `this.time.now` keeps ticking during level-up menus and pause screens, reading upgrade cards caused the player's age to jump to 50.8 in ~40 seconds!
  - Replaced `this.time.now - startTime` with an active-play accumulator `runElapsedMs += delta` that only advances during live gameplay, and increased `secondsPerYear` from `10` to `15` (`10 minutes` of active play from Age 40 to 80, plus `5 minutes` for Ages 80 to 100).
- **Expanded Campaign to Age 80 + 20 Bonus Senior Life Rounds (Age 80 to 100):**
  - **Age 40 -> 80 (Working Decades):** Battle **The Performance Review (Age 45)**, **The Mortgage Refinance (Age 52)**, **The Midlife Crisis (Age 60)**, **The HOA President (Age 70)**, and **The Mandatory Retirement Audit (Age 80)**.
  - **Age 80 Retirement Modal (`#retire80-modal`):** Reaching Age 80 awards `+15` bonus 401(k) Coins and lets you either **Retire with Honor at 80** or enter the **20 Bonus Senior Rounds (Age 80 to 100)**!
  - **Senior Life Mode (80-100):** Enemy labels transform into hilarious senior-life scenarios (**Medicare Copays (`COPAY`)**, **HOA Special Assessments (`HOA$`)**, **Grandkid Gift-Card Scams (`SCAM!`)**, **3 PM Early-Bird Buffets (`PRUNE`)**, **Sciatica & Hip Spasms (`HIP!`)**, and **Bingo Hall Drama (`BINGO`)**), culminating in **The 6 AM Pickleball Champion (Age 90)** and **Father Time (Age 100)**.
  - **Dynamic Enemy Scaling:** Enemy HP (`hpScale`), speed, and contact damage scale up every 4 years so late-game waves challenge your evolved weapons.
- **Mid-Run Save State & Decade Checkpoints (`src/data/meta.js`):**
  - Active runs auto-save every 3 seconds (`midlife_survivors_run_v1` in `localStorage`) and via the **`💾 SAVE & EXIT TO DOSSIER`** button in the Pause Menu.
  - Added **`💾 RESUME SAVED RUN`** on the Title Screen so players can close the browser tab and pick up right where they left off (same Age, Level, HP, and upgrades).
  - Reaching **Age 50, 60, 70, or 80** permanently unlocks **Decade Checkpoints** on the Title Screen (starting with `+3 / +6 / +9 / +12` bonus starter upgrades), plus a new **Pension Plan (`+1` starting weapon damage)** upgrade in the 401(k) Shop!

## 2026-10-30: Universal Menu Navigation, Spacebar Pause & Options, Native Gamepad Fix & Mobile Touch Controls! (Antigravity)
- **Universal Menu Navigation (`window.menuNav` in `src/ui.js`):**
  - Added 2D row/column focus navigation (`.nav-focused` golden highlight ring) across **every modal** (`#title-modal`, `#levelup-modal`, `#pause-modal`, `#retire80-modal`, `#gameover-modal`).
  - Players can now arrow through Characters, Decade Checkpoints, 401(k) Shop upgrades, Camera Styles, Level-Up Perk Cards, and Pause Options using **Arrow Keys (`▲▼◀▶`)**, **`WASD`**, or **Controller D-Pad / Left Stick**, and press **`Space` / `Enter` / Controller `A`** to select.
- **Spacebar Pause & Options Screen (`#pause-modal`):**
  - Pressing **`Spacebar`** (or `P`, `Esc`, Controller `Start`/`B`, or tapping **`⏸ PAUSE`**) during gameplay now opens the full **Pause & Options Screen**, where you can arrow through:
    1. **▶ Resume Shift**
    2. **🎥 Visual Engine (`16-Bit Retro` / `Diablo 3/4 Indie` / `Fortnite AAA 3D`)**
    3. **🔊 Sound & Music (`ON` / `MUTED`)**
    4. **💾 Save & Exit to Dossier**
    5. **🔄 Start Fresh Run**
- **Fixed Controller Support via Direct HTML5 Gamepad API (`navigator.getGamepads()`):**
  - Replaced Phaser-only `scene.input.gamepad` polling in `readPad()` with direct `navigator.getGamepads()` polling so Xbox, PlayStation, Switch Pro, and Bluetooth controllers stay responsive even after clicking HTML overlay buttons, with auto-repeat stepping (`getPadMenuStep`) and a live **`🎮 PAD`** indicator in the HUD.
- **Mobile Touch Controls (`#mobile-dock` + `#touch-joystick`):**
  - Added a thumb-friendly floating **Mobile Quick-Action Dock** (`⏸ PAUSE`, `🎥 VIEW`, `🔊`) at the bottom-right, an on-screen **Virtual Touch Joystick** ring and knob (`#touch-joystick`) when dragging on touchscreens, and responsive mobile HUD/modal layouts.

## 2026-10-30: Scaled XP Curve & Tiered Perk Ranks Across the Playthrough! (Antigravity)
- **Fixed Rapid Level-Up Interruptions (`src/data/pickups.js` & `src/main.js`):**
  - Previously, `firstLevelXp: 3` with `Math.round(xpNeeded * 1.25)` produced tiny gem requirements (`3, 4, 5, 6, 8, 10`), and smashed potted plants dropped up to 3 XP gems, interrupting gameplay every 4-6 seconds with a Level-Up modal.
  - Updated `LEVELING` to `firstLevelXp: 8`, `growth: 1.35`, and `stepXp: 4` (`xpNeeded = Math.round(xpNeeded * 1.35 + 4)` -> `8, 15, 24, 36, 53, 76, 107...`), giving 20-60 seconds of uninterrupted action between level-ups!
  - Changed potted plant loot (`damagePlant`) to focus on **Leftover Pizza (`+3 HP`, 45%)** and **401(k) Gold Coins (`1-2k`, 55%)** so smashing plants rewards you without triggering unexpected Level-Up screens.
- **3-Tier Perk Rank Scaling (`src/data/upgrades.js` & `src/ui.js`):**
  - Added `maxRank` caps (`RANK 1/4 -> 4/4` displayed on each Perk Card ribbon) and weapon rank tracking (`coffeeRank`, `jokeRank`, `noRank`).
  - **Tier 1 (Early 40s):** Unlock core weapons (`Dad Joke`, `"No."`), passives (`Comfortable Shoes`, `Good Night's Sleep`, `Reading Glasses`), and build weapon ranks (`Rank 1 -> 2+`).
  - **Tier 2 (Mid-Career 50s/60s):** **Weapon Evolutions** (`Cold Brew Concentrate`, `Unhinged Pun Storm`, `Healthy Boundaries`) now require **Weapon Rank 2+ AND its matching Passive**, arriving in mid-career instead of the first 30 seconds.
  - **Tier 3 (Late-Career & Senior Rounds):** Added **Executive Delegation** (`+1` damage & `10%` fire rate to ALL weapons, 4 ranks) and **Titanium Knees** (`+4 Max HP`, `+4` heal, `+10%` speed, 3 ranks) that unlock once your core build is underway!

## 2026-10-30: Spoken Dad Jokes (Web Speech API) & Character-Following Speech Bubble! (Antigravity)
- **Readable Character-Following Speech Bubble (`showPlayerSpeechBubble` in `src/main.js`):**
  - Replaced the old `0.75s` fading text (which got left behind as you walked) with a bold `14px` dark-and-gold comic speech pill (`💬 "..."`) that **tracks right above your character's head every frame** as you move across all 3 camera views (`2D 16-Bit`, `Diablo 3/4`, and `AAA 3D`).
  - Stays at **100% full brightness for 2.3 seconds** before fading out over `0.55s` (**2.85 seconds total**, nearly 4x longer!).
- **Spoken Dad Jokes Out Loud (`speakDadJoke` in `src/sfx.js`):**
  - Uses the browser's built-in **Web Speech API (`window.speechSynthesis`)** so your character literally speaks the Dad Joke out loud when `fireDadJoke` triggers (with a slightly deeper senior voice pitch once you enter the Age 80-100 Senior Bonus Rounds!).
  - Expanded `WEAPONS.dadJoke.lines` to 12 midlife jokes plus 6 `seniorLines` in `src/data/weapons.js`, and added a **`🗣️ DAD JOKE VOICE: ◀ SPOKEN 🗣️ / TEXT ONLY 💬 ▶`** toggle in the **Pause & Options Screen** (`src/ui.js`).

## 2026-10-30: True Isometric Tactical Overview (Mode 1) vs. Immersive 3D World & Skyline (Mode 2)! (Antigravity)
- **Why Modes 2 & 3 Looked Too Similar Previously:**
  - Previously, both `Diablo 3/4` (`FOV 38°` at `y = 420`) and `3D Third-Person` (`FOV 60°` at `y = 165`) looked down from mid-altitude onto the same floor texture with no visible horizon, making their scale and camera angle look nearly identical.
- **Locked in Mode 1 (`Diablo 3/4` — True Isometric Tactical Overview in `src/view3d.js`):**
  - **16-Degree Telephoto Isometric Lens (`FOV 16°` from `(-760, 1060, +760)`):** Compresses perspective distortion so parallel lines stay parallel like a true isometric tabletop diorama, showing a wide tactical battlefield overview of multiple mezzanines and incoming swarms.
  - **Obsidian Sanctuary Floor & Flaming Corner Braziers (`floorTexDiablo`):** Swaps the floor to dark obsidian flagstones with warm ember grout lines, flickering player torchlight, and 4 flaming torch braziers atop every mezzanine platform.
- **Locked in Mode 2 (`AAA 3D` — Low Over-the-Shoulder Immersive 3D Environment in `src/view3d.js`):**
  - **68-Degree Low Chase Camera (`FOV 68°` at `(0, 68, +142)` looking out toward `(0, 34, -280)`):** Drops the camera right behind the hero's shoulder (`1.22x` hero scale with animated 3D walking legs `legL`/`legR`) so the upper third of the screen opens up into a deep 3D horizon!
  - **360-Degree 3D City Skyline, Sunset Sun & Floating Clouds (`build3DHorizonEnvironment`):** Surrounds the 3D arena with 32 distant 3D corporate skyscrapers with neon rooftop trims, a glowing golden-hour horizon sun disk, 14 drifting 3D clouds, and tall 3D cubicle privacy walls.

## 2026-10-30: Unlockable Life Environments (`src/data/stages.js`) & Phase 7 Expansion Plan! (Antigravity)
- **Created `src/data/stages.js` with 5 Unlockable Life Environments:**
  1. **🏢 The Open-Plan Office (Age 40):** Career & Cubicles (`BILL`, `LATE!`, `SPAM`, `RE:RE:`).
  2. **🏥 St. Deductible Hospital (Age 44):** Birth, Medical Bills & Sleepless Nights (`CO-PAY`, `DEDUCT!`, `PAGER!`, `3AM CRY`).
  3. **🏡 Suburban Home & Yard (Age 50):** Parenting, LEGO Minefields, Carpools & Homework (`TUITION`, `LEGO!`, `CARPOOL`, `NEWMATH`).
  4. **🍻 The Social Courtyard (Age 60):** Navigating Adult Friendships & Flaky Group Chats (`SPLIT$`, `FLAKE!`, `TXT-47`, `DRAMA`).
  5. **🌴 Sunset Palms Resort (Age 80):** Senior Bonus Rounds (`COPAY`, `HOA$`, `SCAM!`, `BINGO`).
- **Replaced the Simple 3D/Diablo Checkerboard with 512x512 Multi-Zone Procedural Floors (`makeFloorTexture` in `src/view3d.js`):**
  - Each stage now renders a 3-zone architectural floor (main tiles + walkway corridor with brass strips + feature zone with stage-specific details like hospital triage stripes & medical crosses, scattered LEGO bricks on the living room rug, warm patio string-light pools, or white-lined pickleball courts!).
- **Dynamic Mid-Run Biome Transitions & Title Screen Environment Selector:**
  - In `Auto-Progress` mode, reaching Ages 44, 50, 60, and 80 seamlessly transitions the floor architecture, 3D sky/fog palette, HUD timeline header, and enemy tags with a celebratory **New Life Chapter Toast**; or players can lock in any unlocked environment right on the Title Dossier!
  - Added **Phase 7** to `docs/ROADMAP.md` and Section 6 to `docs/GAME_DESIGN.md` detailing the interactive mechanics planned for each stage.

## 2026-10-30: Full 4-Device Input Mapping (Keyboard, Mouse, Touch, Controller) & Input Configuration Screen! (Antigravity)
- **Built the Input & Controls Configuration Screen (`#controls-modal` in `src/ui.js` & `src/data/meta.js`):**
  - Accessible anytime from the **Title Dossier (`🎮 INPUT & CONTROLS`)**, **Pause & Options Screen (`🎮 INPUT & CONTROLS CONFIG`)**, **Top-Right HUD (`🎮 INPUT`)**, and **Mobile Dock (`🎮 INPUT`)**.
  - Displays live connection status badges for all 4 input devices (`⌨️ KEYBOARD: READY`, `🖱️ MOUSE: READY`, `📱 TOUCH: READY`, `🎮 CONTROLLER: CONNECTED / PLUG & PLAY`) and persists all custom bindings and preferences in `localStorage` (`meta.controls`).
- **Mapped All 4 Input Devices for Gameplay & Menus (`src/main.js` & `src/ui.js`):**
  1. **⌨️ Keyboard:** Live interactive key listening (`window.rebindState.type === "key"`) lets you click/press Enter on any action (`Move Up/Down/Left/Right`, `Pause/Options`, `Switch View`, `Mute Audio`) and press any key on your keyboard to rebind it, with HUD badges (`⏸ PAUSE [KEY]`, `[KEY]`, `🔊 [KEY]`) updating automatically.
  2. **🖱️ Mouse:** Added full desktop mouse movement and button mapping: **Hold Click to Steer** (`holdFollow` ARPG mode with an on-screen `#pointer-target` reticle), **Cursor Auto-Follow** (`cursorFollow` hands-free mode), **Click & Drag Stick** (`clickDrag`), **Right-Click Action** (`Pause/Options`, `Hold to Move`, or `Switch View`), and **Mouse Wheel** (scrolls menu focus or cycles `16-Bit` / `Diablo 3/4` / `AAA 3D` in gameplay).
  3. **📱 Touch Screen:** Added **4 Touch Stick Modes** (`Floating Stick`, `Fixed Bottom-Left Stick`, `Fixed Bottom-Right Stick` with automatic left-side action dock swap, and `Touch & Hold Toward Finger`) plus **3 Touch Sensitivity presets** (`Normal 10px`, `High 5px`, `Relaxed 18px`).
  4. **🎮 Video Game Controller:** Added live controller button listening (`window.rebindState.type === "pad"` captures any physical button `0..11` pressed on an Xbox, PlayStation, Switch, or Bluetooth controller, or cycles with `◀▶`) for `Confirm`, `Pause`, `Switch View`, and `Mute`, plus configurable **Analog Stick Deadzone** (`15%`, `22%`, `35%`).

## 2026-10-30: Broadcast Lower-Third HUD & Live Contextual Story/Help Ticker! (Antigravity)
- **Relocated the HUD to a Bottom Broadcast Lower-Third Console (`#hud-lower-third` in `index.html` & `src/ui.js`):**
  - Moved the entire gameplay HUD to the bottom of the screen (`margin-top: auto; width: min(1220px, 98vw)`), keeping the upper 82% of the viewport and the 3D skyscraper skyline, sunset sun, and action arena completely unobstructed.
  - Designed a 2-tier broadcast lower-third architecture:
    1. **Upper Lip (Live Contextual Story & In-Game Help Ticker `#hud-context-bar`):** Displays a dynamic category badge (`#ctx-badge`: `🚨 BOSS ALERT`, `🚨 CRITICAL`, `🎁 BONUS LOOT`, `🍕 RECOVERY`, `🍩 HAZARD`, `⛰️ HIGH GROUND`, `📖 CHAPTER`), a narrative storytelling beat (`#ctx-story`), and a yellow actionable tactical tip (`#ctx-help`).
    2. **Main Deck (3-Module Lower-Third Console `.lower-third-deck`):**
       - **Left Module (`hud-left`):** Employee Avatar Badge + Compact side-by-side `HP` & `XP` bars (`.bars-compact-grid`) + Active Perks Strip (`#hud-perks`).
       - **Center Module (`hud-center`):** Life Timeline (`AGE 40.0` to `AGE 100.0`) + **`👀 ON SCREEN` Situational Radar (`#hud-radar-row`)** showing live enemy counts, nearby hazards, uncollected loot, and the next milestone countdown.
       - **Right Module (`hud-right`):** Career Score (`SAVED`), Debt Paid (`PAID`), Combo Badge, Action Controls (`⏸ PAUSE`, `🎮 INPUT`, `🔊`), and 3-Mode View Switcher (`16-Bit` / `Diablo 3/4` / `AAA 3D`).
- **Built the Contextual Storytelling & In-Game Help Engine (`updateContextAndRadar` & `window.pushContextEvent` in `src/ui.js` & `src/main.js`):**
  - Continuously scans on-screen entities (`bills`, `chests`, `window.pizzas`, `stageProps`, `hp`, `player.elev`) to surface real-time help for whatever is happening on screen right now, and rotates through chapter-specific narrative & help beats (`STAGE_NARRATIVES`) for all 5 Life Stages (`office`, `hospital`, `home`, `social`, `senior`).
  - Hooked instant event overrides (`window.pushContextEvent`) into Boss arrivals, Boss defeats, Potted Plant loot drops, Overdue Bill splits, and New Life Chapter transitions.

## 2026-10-30: Version Tracking Stamp (`V. 1.8.19`) & Interactive Patch Notes Dossier! (Antigravity)
- **Created `src/data/version.js` (`window.GAME_VERSION`):**
  - Tracks `version` (`"1.8.19"`), `displayVersion` (`"V. 1.8.19"`), `lastUpdated` (`"Oct 30, 2026"`), `codename` (`"Broadcast Edition"`), `build` (`19`), and a chronological `changelog` array of recent updates.
- **Added Version & Last Updated Stamp to Title Screen, Pause Menu & Lower-Third HUD (`src/ui.js` & `index.html`):**
  - **Title Screen (`.version-stamp-bar`):** Displays `🏷️ V. 1.8.19 • Last updated on: Oct 30, 2026` right below the game tagline alongside a clickable / controller-navigable **`📜 PATCH NOTES`** button (`#title-changelog-btn`).
  - **Pause & Options Screen (`#pause-modal`):** Shows the version and last updated date in the top kicker and adds a **`📜 VERSION & PATCH NOTES`** option row (`#pause-changelog-btn`).
  - **Lower-Third HUD (`#hud-dept`):** Appends `// V. 1.8.19` to the department readout so screenshots always show the exact build.
  - **Release Notes & Version History Modal (`#changelog-modal`):** Displays all recent versions, dates, titles, and bulleted highlights, navigable with Keyboard, Mouse, Touch, and Game Controller.

## 2026-10-30: World Mythos, Subject Backstories & Scenario Lore Archive (`V. 1.8.20`)! (Antigravity)
- **Created `src/data/lore.js` (`window.GAME_LORE`):**
  - Wrote the foundational **World Mythos (*Form W-40: "The Great Compounding"*)** explaining how postponed responsibilities achieve sentient form at midnight on your 40th birthday and pull you into **The Five Bureaus of Adulthood**.
  - Authored full **Subject Dossiers** for all 3 playable characters:
    1. **☕ Subject #01 (The 9-to-5er / *Arthur "Artie" Pendelton*):** Senior Spreadsheet Wrangler bonded to a sentient 4th-floor espresso machine.
    2. **📸 Subject #02 (The Senior Photographer / *Rami "The Shutter" D.*):** University Visual Storyteller whose 15 years of campus shoots unlocked a weaponized Dad Joke Aura.
    3. **🎓 Subject #03 (The Grad Student at 45 / *The Dual-Career Night-Owl*):** Full-time professional & EMAT seminar scholar who mastered the boundary-shattering power of saying `"No."`
  - Authored full **Scenario Lore & Manifestation Guides** for all 5 Life Chapters (`🏢 Office`, `🏥 Hospital`, `🏡 Suburban Home`, `🍻 Social Courtyard`, `🌴 Sunset Palms Resort`) plus the **7-Boss Milestone Registry** (Ages 45 to 100).
- **Built the Interactive 4-Tab Mythos & Lore Archive Modal (`#lore-modal`) & Title Subject Bio Strip (`src/ui.js`, `index.html`):**
  - Added a **`📖 MYTHOS & LORE`** button on the Title Dossier and Pause Screen that opens `#lore-modal` with 4 navigable tabs (`🌐 World Mythos`, `🪪 Subject Dossiers`, `🗺️ Life Scenarios`, `👹 Boss Registry`).
  - Added `#title-subject-bio` right under the 3 Character Cards on the Title Screen so selecting a character displays their codename, real name, origin story, and signature quote live.
  - Bumped version to **`V. 1.8.20`** (`src/data/version.js` & `?v=18` in `index.html`).

## 2026-10-30: 401(k) Compound Interest Scaling & 5-Year Survival Dividends (`V. 1.8.21`)! (Antigravity)
- **Built the 6-Tier Compound Interest Coin System (`src/data/pickups.js` & `window.getCoinYieldInfo` in `src/main.js`):**
  - Coins now grow in value the longer you stay alive in a run: **`+1k` (`1x MATCH` at Age 40)** -> **`+2k` (`2x VESTED` at 42s / Age 44)** -> **`+3k` (`3x SENIORITY` at 100s / Age 50)** -> **`+4k` (`4x EXECUTIVE` at 175s / Age 60)** -> **`+5k` (`5x COMPOUND` at 250s / Age 70)** -> **`+6k+` (`6x GOLDEN` at 320s / Age 80+)**.
  - Raised base coin drop rate from `38%` to `55%` (scaling up to `78%` with Age), added `2x` double-value coins (`bonusMult = 2`) to Elites, Bosses, and Plant Jackpots, and made Potted Plants always drop at least 1 Coin even when dropping Pizza!
- **Added 5-Year Automatic Survival Dividends & Live HUD Yield Badge (`#hud-yield-pill` in `src/ui.js`):**
  - Every 5 years of Age survived (`45, 50, 55, 60, 65, 70, 75, 80...`) automatically deposits a scaling **401(k) Compound Dividend** (`+6k`, `+9k`, `+12k`, `+16k`...) with a golden floating banner and Lower-Third Contextual Ticker alert.
  - Added `#hud-yield-pill` (`📈 1x MATCH (+1k/🪙)` -> `📈 6x GOLDEN (+6k/🪙)`) in the Bottom-Right HUD pod and bumped the build to **`V. 1.8.21`** (`?v=19`).

## 2026-10-30: Full Mobile UI Scaling (Portrait, Landscape & Touch Safe-Areas `V. 1.8.22`)! (Antigravity)
- **Added Native Mobile Viewport Meta Tag & Safe-Area Insets (`index.html`):**
  - Added `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">` so iOS Safari and Android Chrome render at true device width instead of shrinking a 980px desktop layout.
  - Added `env(safe-area-inset-top/bottom/left/right)` and `94dvh` modal sizing so phone notches and home bars never clip the HUD or menus.
- **Built 3 Mobile Breakpoints + Touch-Scrollable Modals (`index.html` & `src/ui.js`):**
  - **Coarse Pointer & Tablet (`@media (max-width: 900px), (pointer: coarse)`):** Automatically shows the top `.mobile-dock` (`⏸ PAUSE`, `🎮 INPUT`, `🎥 VIEW`, `🔊`) on all touch devices.
  - **Mobile Portrait (`@media (max-width: 768px)`):** Compacts the Broadcast Lower-Third Console (`<22%` screen height) with `.hud-left` and `.hud-right` side-by-side above a sleek full-width `.hud-center` timeline/radar, keeps the 3 Subject Cards in a compact 3-column row on the Title Screen, and enables `touch-action: pan-y` on `.modal-card` so tall menus swipe-scroll smoothly on mobile.
  - **Mobile Landscape (`@media (max-height: 520px)`):** Keeps the Lower-Third in a single low-profile horizontal row for horizontal phones (`844x390`), and dynamically positions fixed virtual thumbsticks `12px` above `#hud-lower-third.offsetHeight`.
  - Bumped version to **`V. 1.8.22`** (`src/data/version.js` & `?v=20` in `index.html`).

## 2026-10-30: Claude review after the Antigravity sprint (Claude)
- Played the build at desktop and phone sizes: runs with no errors. Phases 1-5 working, plus 3 camera views, 5 stages, ages 40-100, 13 enemy/boss types, controller support.
- Biggest issues: UI clutter (HUD covers about a quarter of the screen, the title screen is a long form), scope sprawl (3 render engines, 1,600+ and 1,900-line code files), and the Top 10 mechanics (Blood Sugar, Energy, Errands) aren't built yet.
- Recommendation: feature freeze, then a "fun pass" on the core loop and a minimal Vampire Survivors-style HUD before new art.
- Open decisions: run length and age span, one camera view or three, which link is the official playtest (GitHub Pages vs claude.ai).

## 2026-10-30: Decisions locked (Claude)
- 1 minute per year, Death at 100, more intense levels. 2D only. Errands is the first twist. GitHub Pages is the official playtest. Rami credited, not a character. One objective at a time.
- New "Fun Pass" list at the top of ROADMAP.md (7 objectives, in order).

## 2026-10-30: Objective 1 done, Clean Screen HUD (V. 1.9.0) (Claude)
- Hid the bottom lower-third console and mobile dock. New top HUD: full-width XP bar with level, big AGE number with a thin year-progress bar, coins and weapon icons top-left, pause and mute top-right.
- HP bar now rides under the player, drawn every frame.
- Parked the 3D views: `window.ENABLE_3D_VIEWS = false`, V key and title buttons no longer switch away from 2D.
- Tested in a headless browser at laptop and phone sizes: no errors.
- Next objective: Title screen (pick a character, then start).

## 2026-10-30: Clean Screen feedback + lower third plan (Claude)
- Rami: the clean screen feels much better, and age and XP read at a glance. He misses having info along the bottom.
- Proposed a broadcast-style lower third (one message at a time: alerts, errands, tips, chapter cards, lore, joke captions). Added to GAME_DESIGN.md and the roadmap, waiting on 3 layout answers.

## 2026-10-30: Objective 2 done, Lower Third (V. 1.10.0) (Claude)
- Rami's answers: keep XP and age on top, lower third on demand, build it now.
- New strip at the bottom slides in for boss alerts, low HP, first-time tips (once ever), decade chapter cards and dividends. One message at a time, urgent ones jump the line.
- Words live in `src/data/tips.js`. Plant loot no longer spams the strip.
- HP bar under the player is bigger. Fixed a restart error left over from the sprint.
- Next objective: Title screen.

## 2026-10-30: Objective 3 done, Title Screen (V. 1.11.0) (Claude)
- Rami on the lower third: helpful, readable. Wants a hints on/off option (now objective 4) and to restyle it later.
- Title screen is now: logo, best age and coins, 3 character cards, a big Start button.
- 401(k) Shop, Options and Extras (start age, location, lore, patch notes) each open their own view with a Back button.
- Tested at laptop and phone sizes; Enter starts a run from a fresh load.
- Next objective: hints toggle in Options.

## 2026-10-30: Objective 4 done, Game Tips switch (V. 1.12.0) + UI test run (Claude)
- Pause menu now has GAME TIPS on/off (replaces the Visual Engine row). Saved between visits.
- Ran a scripted playthrough of every menu at laptop and phone sizes: title, shop, extras, options, pause, level-up, game over, retry, save and quit, resume, age 80.
- No crashes. Found 7 menu problems, biggest: Options, Lore and Patch Notes open behind the title screen. Listed as objective 5, "Menu fixes."
- Next objective: Menu fixes.

## 2026-10-30: Objective 5 done, Menu Fixes (V. 1.13.0) (Claude)
- Fixed 6 of the 7 test-run issues. The 7th (death joke mismatch) was a false alarm: "surprise HOA fee" is a Bill joke.
- Options, Lore and Patch Notes now sit on a higher layer than the title screen. Mouse hover only moves the highlight when the mouse actually moves.
- Game Over's shop button lands on the shop; lower third holds its message while menus are open; pause menu opens on Resume and dropped to 7 rows.
- Reran the full playthrough plus a level-up check at laptop and phone sizes: all fixed, no errors.
- Next objective: Credits, not cameo.

## 2026-10-30: Objective 6 done, Credits not cameo (V. 1.14.0) (Claude)
- "The Senior Photographer" (lore name "Rami 'The Shutter' D.") is now **The Soccer Dad**, same stats and icon ⚽. Internal id unchanged so old saves keep the unlock.
- Grad Student lore no longer mentions EMAT or creative coding.
- New Credits screen in Title > Extras; words live in `src/data/credits.js`.
- Tested: no mention of Rami left in the game outside the Credits; old save loads and plays.
- Next objective: Run length (1 minute per year, Death at 100).

## 2026-10-30: Bug fix, steady furniture (V. 1.14.1) (Claude)
- Rami spotted desks, plants and watercoolers flickering and changing positions.
- Measured it: in a 14-second walk, furniture jumped 10 times and blinked 125 times.
- Cause 1: when furniture was recycled to a new spot, the physics engine applied the move a second time. Fix: furniture bodies no longer "move" on their own.
- Cause 2: furniture near a mezzanine blinked depending on which platforms were loaded. Fix: platform positions come from one formula.
- After: 0 jumps, 0 blinks, desks still block you. Next objective unchanged: Run length.

## 2026-10-30: Objective 7 done, A Full Life (V. 1.15.0) (Claude)
- Rami: furniture feels much more solid after the fix.
- 1 real minute = 1 year (was 15 seconds). A full life, 40 to 100, is about an hour.
- Age 80 no longer stops the game: +15k and full health pay out automatically with a lower third card.
- Death at 100 is the only win; dying earlier is a regular Game Over. Death gets his own arrival message.
- Tested by fast-forwarding to 80, 85 and 100: no stop screen at 80, normal Game Over at 85, victory on meeting Death. Next objective: Intensity curve.

## 2026-10-30: Objective 8 done, Swarms (V. 1.16.0) (Claude)
- Rami: the hour-long run feels decent. Wants more weapons, better spawning, more enemy variety, and a bigger, funnier, more detailed pixel-art background. Added as objectives 9-12 (spawning done now).
- Enemies now come in packs (1 at 40 up to 6 in your 90s); spawn speed ramps every year; crowd limit grows from 60 to 200.
- 7 swarm events with lower third announcements (Tax Season ring, Robocall wall, Donut Drop pack, and more). Settings in `src/data/swarms.js`.
- Measured: about 50 enemies per minute at 40, 170 at 50, 500 at 65, 1,100 at 85. No errors.
- Next objective: Enemy variety (Rami can reorder).

## 2026-10-30: Balance pass, Fight Back (V. 1.16.1) (Claude)
- Rami: swarms feel good but not challenging; you could stand still and kill everything early on.
- Measured standing still at 40 for 40 game-seconds: max 3 enemies on screen, 0 HP lost. Cause: toughness was tuned for 15-second years, and Bills died in one hit.
- Changes: Bills 2 HP, faster spawns at every age, packs grow sooner, smooth +9% toughness per year, swarms grow with age, first swarm at 41.
- After: standing still, first hit at about 12 s and you're nearly out of HP around 25-30 s. Moving is now required.
- Next objective unchanged: Enemy variety.

## 2026-10-30: Objective 9 done, Enemy Variety (V. 1.17.0) (Claude)
- Rami: the balance pass feels better; revisit difficulty once more enemies and weapons are in.
- 4 new enemies, each with its own movement: 3 AM Thought (ghosts in and out), Calendar Invite (straight-line charge), Group Chat (ranged "typing..." pings), Math Homework (shrinking spiral). Reused unused pixel art from the sprint.
- 3 new swarms (Back-to-Back, 3 AM, Homework), plus tips and death jokes for each new enemy.
- Note: this session restarted mid-build; the first attempt's unsaved work was reviewed, tested and finished rather than redone.
- Tested each behavior plus natural spawns at 63: all present, no errors. Next objective: More weapons.

## 2026-10-30: Objective 10 done, Three New Weapons (V. 1.18.0) (Claude)
- The TV Remote (boomerang), Spreadsheet (orbiting cells), Podcast at 2x (piercing line in your walking direction). Each has an unlock card, a 4-rank upgrade, and an evolution: Smart TV, Pivot Table, Binge Mode.
- New code lives in its own file, `src/weapons_extra.js`; numbers in `src/data/weapons.js`.
- Tested: all three deal damage, evolutions unlock with the right passives, pausing freezes them, retry clears them, no errors.
- Rami asked about scores and a leaderboard (names vs. accounts). Added as a new objective, waiting on his choice.

## 2026-10-30: Scores + Leaderboard (V. 1.19.0) (Claude)
- Rami has already shared the game with people, so he chose an online board (option B), no accounts.
- Game Over now shows a score, a name box (remembered) and the top 10. New Leaderboard button on the title screen.
- Online storage is Supabase; setup SQL in `docs/LEADERBOARD_SETUP.sql`. Until Rami pastes in his project URL and key, scores save on the device.
- Tested with a stand-in database at laptop and phone sizes: posting works, your row is highlighted, typing a name doesn't trigger game keys. No errors.
- Waiting on: Rami's Supabase URL + publishable key.

## 2026-10-30: Online leaderboard connected (V. 1.19.1) (Claude)
- Rami created the Supabase project and sent the Project URL and publishable key; both added to `src/data/leaderboard.js`.
- The secret/service key was never needed or shared.
- Checked from a real browser against the live database (read only, no test rows added).

## 2026-10-31: Planning session (Claude)
- Ben's playtest + Rami's design doc reviewed; decisions recorded in GAME_DESIGN.md. Core run decided: ages 40 to 65 at 45 s/year.
- Granola notes added: AI dialogue/character layer (future), personal-best leaderboard with no cap, version archive with screenshots.
- New CLAUDE.md rule (approved): keep usage light, about 2-3 build sessions a week.
- Next: Playtest fix pack.


## 2026-10-31: Playtest fix pack (V. 1.20.0) (Claude)
- Fixed Ben's phone bugs: steering works after Retry, and perks need a second tap to confirm.
- Dad Joke speaks on unlock or upgrade plus a bonus joke about every 50 seconds; bubbles wrap and sit higher.
- Softer first two minutes, slower coins, Start as the main button, plain perk labels, leaderboard shows personal bests with no cap.
- New: devlog page (link in Extras; first post is a hidden draft for Rami to edit) and `docs/handoffs/` for ChatGPT, Gemini and Grok notes.
- Next: Core 19-minute run (ages 40 to 65).
## 2026-10-31: Office art study, V. 1.19.2 (Codex)
- Rami approved the warm office key art and asked for a small playable art test before replacing production sprites.
- Added an isolated Current/New comparison: generated hero, Bill and workstation, native seamless floor, automatic coffee and keyboard/pointer movement. Extras > Art Test opens it.
- Simplified the generated sheet after the first size check. The hero keeps the current 48x52 frame; the Bill and desk have labeled proposed sizes. These are single poses, not walking animations.
- Checked desktop and 390x844 phone layout, comparison controls, 1x/2x, pause, movement and Extras navigation. Fixed canvas sizing during resize; JavaScript syntax and diff checks pass.
- Next: Rami's feedback on readability and character size before more assets or production replacement. Main gameplay art remains the current set.

## 2026-10-31: Hero scale and believable desks, V. 1.20.1 (Codex)
- Rami liked the direction and requested a slightly larger hero and believable overlap behind desks. Hero frame increased to 56x60, about 15% larger.
- Corrected desk floor footprints, added sliding at corners, and kept Bills out of desks too.
- Fixed a second disappearance cause: the floor drew over actors north of map Y=0. Health bar moves above the hero when his feet are behind furniture.
- Checked the behind-desk case in the browser and collision boundaries in a focused movement test. These changes apply to the separate art study.

## 2026-10-31: Midlife mode (V. 1.21.0) (Claude)
- New main mode: ages 40 to 65 at 45 seconds per year (about 19 minutes). Three bosses, then a Retirement Party ending.
- Full Life (40 to 100) stays and unlocks when you reach 65 (a stand-in until achievements exist).
- Overtime: "Delayed Retirement" in the 401(k) Shop adds 5 years per rank, up to 80.
- Separate leaderboards per mode. Rami needs to run `docs/LEADERBOARD_MIDLIFE.sql` once in Supabase.
- Next: Content drop + discoverable items.


## 2026-10-31: Reload fix (V. 1.21.1) (Claude)
- Rami: controls sometimes didn't work until a second reload. Couldn't reproduce locally; cause was a cached old page mixing with new code right after updates.
- Game code now loads through `src/loader.js`, fetched fresh on every visit. Version bumps now change `BUILD` there instead of `?v=` tags.


## 2026-10-31: Content drop + items (V. 1.22.0) (Claude)
- Floor items: Fanny Pack, Energy Drink, PTO Day. They drop from smashed plants (22%) and rarely from enemies.
- Boost cards (Leftover Friday Pizza, PTO Day, Fanny Pack, Standing Desk, Focus Block, HR Snacks) fill in when regular perks run out. Annual Checkup capped at 3.
- Dad Joke uses stage-specific jokes from Rami's design doc; weak lines retired. 50+ new death lines plus a fallback.
- Next: Achievements (one unlocks Full Life).


## 2026-10-31: Achievements (V. 1.23.0) (Claude)
- 29 achievements from Rami's design doc, each paying 401(k) coins. Extras > Achievements shows them; new ones pop in the lower third and on Game Over.
- Full Life now unlocks with "Retirement Plan" (reach the Retirement Party). Old saves that already reached 65 keep it.
- Cosmetic rewards from the doc (hats, bubble skins, titles) became coins for now; revisit after the art pass.
- Next: Art pass with GPT Image assets (waiting on Rami's art), or Discoverable map.

## 2026-10-31: Corporate Campus blockout, V. 1.23.1 (Codex)
- Rami chose exploration and Corporate Campus after reviewing three office wireframes. Kept wide routes and recognizable departments.
- Extras > Art Test now opens a bounded campus sample: Accounts Payable, Quiet Zone, Breakroom and Wellness, with a revealing map and three optional joke discoveries. Layout returns to the original art study.
- Existing approved hero/desk art and placeholder landmarks test movement before finished scenery. Campus has no combat, saved progress or production rewards.
- Walked all four departments and collected all three finds in the browser; checked route reachability with hero clearance, reset, layout switching, pointer steering and phone sizing. Syntax and diff checks pass.
- Next: Rami judges navigation and spacing, then test crowd pressure before main-game integration.
## 2026-10-31: Timer and live score (V. 1.23.2) (Claude)
- Rami asked for a running timer and a score tally. Timer sits top center above AGE and turns red in the last minute before the ending.
- Live score counts up in the top left, using the same formula as the leaderboard.

## 2026-10-31: Three desk personalities, V. 1.23.3 (Codex)
- Rami approved the exploration layout and asked to tie the indie art together. Generated Tidy Perfectionist, Paperwork Avalanche and Lunch at the Keyboard using the existing workstation reference.
- All three appear in Accounts Payable, with suitable variations in the other departments. Added 2x close-ups, stacked on phones, for direct comparison.
- Runtime import removes magenta, limits colors and uses hard nearest-neighbor sampling. All desk variants share a 96x104 game frame and existing collision rules. Sources and full prompts saved in `assets/desks/`.
- Checked game-size readability, front collision, route clearance and phone gallery layout; browser had no errors. Scope stays in the separate art test.
- Next: feedback on detail and personality, then the 9-to-5er's walking sheet. The rest of Accounts Payable scenery is still pending.

## 2026-10-31: Three playable walking sheets, V. 1.23.4 (Codex)
- Rami requested all playable-character sheets and more animation. Generated four-direction walking sheets for the 9-to-5er, Soccer Dad and Grad Student, with distinct silhouettes and consistent office styling.
- Added Explore As, movement-driven animation, a direction-comparison gallery, frame pause and native-sheet downloads to the separate preview. Dedicated idle/combat poses remain future work.
- Exported 48 populated native frames: exact 4x4 grids of 56x60, flat magenta backgrounds and at most 17 foreground colors. Kept large source images and full prompts alongside them.
- Checked native PNG grids/palettes, direction-to-frame mapping, all character switches, turns, pause and phone layout. Browser showed no errors. Saved a devlog draft for Rami to review.
- Next: judge the walking rhythm and costumes before drawing idle, attack or hit reactions and integrating production art.

## 2026-10-31: Difficulty pass (V. 1.24.0) (Claude)
- Rami: 19 minutes feels right, but it's far too easy; at 4 minutes he could stand still. A first run shouldn't get near 20 minutes.
- Measured with bots: weapons out-killed the spawns, and coins scaled with kills (5,766k in one run). Fixed with player-level scaling (enemy HP, crowd size, spawn speed), bosses that scale, harder hits after 52, and flat rare coins.
- Shop deepened: higher prices plus Continuing Ed, Side Hustle and Second Opinion. Extras > Reset Progress for a true fresh start.
- Bot results after: new 2.7 min, half upgraded 3.9, fully upgraded 5.8 (people should last 2-3x longer than the bot).

## 2026-11-01: First office environment pass, V. 1.24.1 (Codex)
- Rami asked to work on environments. Started with Accounts Payable as the reference section, using the approved desk and character style.
- Added generated printer, filing cabinet and drooping plant; seamless carpet/wood; material trim, low north-wall detail, small floor stories, warm light accents and stepped scene shadows. Visit Accounts frames the section directly.
- Native props have flat magenta backgrounds and explicit floor footprints. The central routes and discoveries remain reachable; extra props hide without invisible collisions in Current Art.
- Checked native dimensions/palette, exact opposite tile edges, cabinet approach/readability, art switching, phone layout and browser errors. Other life-stage environments remain future work.
- Next: Rami judges the warmth and detail density before extending the kit to other departments or the hospital. Devlog draft saved for review.

## 2026-11-01: Grok difficulty handoff, Parts 1 and 2 (V. 1.25.0) (Claude)
- Applied Grok's review: tougher level scaling, bosses that scale with age and level (higher base HP), harder hits from 48, shorter hurt window, less healing, fewer free perks at decade starts.
- Fixed 5 bugs from the review plus one found while testing (shop damage applied twice to the newer weapons).
- Bot check: new 2:16, light meta 1:42, max meta 3:32. Bots are weak; human runs on 1.23 lasted about 3-4x the bot.
- Next: Rami playtests fresh and with light meta; then Part 3A Tax Bracket.

## 2026-11-01: Tax Bracket (V. 1.26.0) (Claude)
- Grok Part 3A: opt-in difficulty 0 to 5 on the title screen (Standard Deduction to Full Audit), locked in when a run starts.
- Each bracket: +12% enemy/boss HP, bigger crowds, faster spawns, harder hits, weaker heals; in return +20% coins, +10% XP, +15% score.
- Leaderboard shows a TAX badge (stored in the version field, no database change). Three new achievements for retiring at brackets 1, 3 and 5.
- Next: Rami playtests 1.25/1.26; then Grok Part 3B dynamic intensity.

## 2026-11-01: Comfort Zone Tax (V. 1.27.0) (Claude)
- Grok Part 3B: 45 s without a hit triggers the Comfort Zone Tax (+2 enemies per spawn group for 20 s, announced in the lower third). Any hit ends it.
- Below 25% HP, spawns slow 15% for at least 8 s. Both stay off for the first 90 s. Knobs in `INTENSITY.dynamic`.
- Next: Grok Part 3C near-miss rewards.
- Rami playtest (Nov 1, 1:04 AM): "feels really good, much more like Vampire Survivors." Difficulty direction confirmed.

## 2026-11-01: The long way to coffee, V. 1.27.1 (Codex)
- Rami asked for ground detail and large, explorable stages. Expanded the separate office preview from 1280x896 to 3072x2048 (5.5x area), with seven areas, connected loops, records and meeting wings, and five finds.
- Added brighter carpet, welcome rug, chair mats, worn paths, repair patches, coffee rings, paper trails and cream light pools. The map now reveals ground as you walk, with a camera-view outline.
- Walked atrium to Accounts to Records and collected two finds. A 32px navigation check reached all seven areas and five finds with inflated furniture footprints. Checked phone layout, comparison toggles, JavaScript syntax and browser logs. Carpet edges match exactly.
- Read Rami's visual handoff. Real swarm readability, crowd pathing and production integration remain pending; no production combat values changed. Next: feedback on exploration and floor brightness, then a separate crowd-pressure preview.

## 2026-11-01: Feet on the floor, V. 1.27.2 (Codex)
- Rami approved the larger world but said the floor felt separate and objects floated. Found invisible same-color chair mats and generic shadow bars; department landmarks had no fitted contact shadows.
- Added per-texture contact contours, short southeast casts, under-desk shade, contrasting mats beneath wheels, caster wear and cables. Carpet tufts and wood grain now have small pixel clusters. Added the player's foot shadow.
- Fixed stale HP-bar placement and facing after paused resets/Visit Accounts. No hitboxes, movement rules, stage dimensions or production balance changed.
- Checked 1x at 1280x800 and phone 390x844, new/current art toggles, movement and paused repositioning. Browser logs clean; both exported 64x64 tiles remain opaque with exact matching opposite edges. Next: Rami judges whether objects feel seated on the ground before crowd testing.

## 2026-11-01: Devlog redesign (Claude)
- Ported the devlog mockup from the redesign handoff: HR-memo styling, key-art hero with clickable enemy hotspots (chips on phones), cover cards, What changed / Next up boxes, prev/next.
- Static share pages per post (with preview images for social links) and an RSS feed, generated by `devlog/scripts/build_devlog.py`.
- Posts 1-4 stay public (Rami had already approved them). Email and Discord show "coming soon".
- Devlog: video clip support (post 4 has a 15-second bot-recorded gameplay clip) and a new footer crediting Claude, Gemini, ChatGPT and Grok with links.
- Devlog: every memo now opens with a lead visual (clip or cover); post 4's video moved to the top. New About page (personnel file) linked from the header and footer. Restored Codex's draft post "I took the long way to coffee" that the redesign had dropped.

## 2026-11-01: Office devlog cover, V. 1.27.3 (Codex)
- Rami supplied a devlog-cover brief with open scene/enemy placeholders. Used the latest office-exploration post: the 9-to-5er taking the long way to coffee, followed by Bills, a purple spam phone and a donut.
- Generated one 1536x1024 landscape cover in the approved pixel-art palette. Left third stays calm for a future title overlay; no title or logo is baked in.
- Saved the PNG and full prompt, and assigned it to draft post 04 with alt text identifying it as an illustration. The post remains unpublished. Verified image dimensions and inspected composition.

## 2026-11-01: One Office (V. 1.28.0) (Claude)
- Rami asked for the devlog and game to feel like one unit. Shared brand layer: style-guide palette, Silkscreen labels and Atkinson Hyperlegible text in both; cream "MEMO · RE:" strips on every game menu; teal replaces the off-palette blue.
- Title screen now sits on the office key art (scanlines, slow pan, off for reduce-motion), matching the devlog hero.
- Links: Devlog on the title's main row (same tab), Art Test renamed Art Preview, devlog hero has a Play button, Art Preview links to the devlog. Shared pixel "MS" favicon and a share-preview image for the game link.
- Audited all menus (title, shop, extras, achievements, leaderboard, options, level-up, pause, game over) at laptop and phone sizes.
- Devlog: inline references (inspired by hankgreen.com). Write ^[note] in a post; clicking the superscript number pops a card under the line with a quick animation. Two examples in post 4.
- Devlog: inline notes added to posts 1-3 (game loop, sprite sheets, why photographers keep backgrounds quiet, and more). Rami's pixel-art bio portrait now heads the About page and is its share image.
- Devlog: the art preview now lives inside the devlog as the Art Room (`devlog/art/`, header link; game Extras > Art Room goes there). "← All memos" is now a large button. V. 1.28.1.

## 2026-11-01: Three title-screen directions, V. 1.28.1 (Codex)
- Rami supplied swarm, midlife panorama and 8:59 lobby briefs. The identical repeated lobby briefs were treated as one concept.
- Generated all three with built-in imagegen, saved full prompts, and exported exact 1920x1080 PNGs with nearest-neighbor sampling. Kept menu space clear and no title/UI baked into the art.
- Inspected the images and exported the lobby's exact 900x1080 central crop. It preserves menu space but loses the hero from the left third; a separate mobile composition may be needed.
- Assets are review-only, not integrated into the title screen. Preferred menu composition is the lobby; next step is Rami's selection. No gameplay values changed.
- Title art: reviewed ChatGPT's three concepts. 03 "8:59 Lobby" is now the title background (calm carpet center for the menu; hero clocking in left, swarm at the glass right). 02 "Panorama" became the devlog's Art Room banner, styled as a taped sticky note above the memos. 01 "Swarm" kept for a future loading or game-over screen. V. 1.28.2.
- Devlog Art Room: key art gallery (office key art, three title concepts, the long-way cover) with click-to-enlarge, arrow keys and captions, above the walkable preview.
- Devlog: code snippet cards (file tab, line numbers, highlighted comments, Copy button). Real snippets added to all four posts: first movement code, data files, walk-by-distance, office layout jokes, difficulty dials and the Comfort Zone Tax.
- Visual pass: full ChatGPT handoff written (`docs/handoffs/chatgpt-visual-pass.md`): setup, style bible, what's done, delivery specs, prompts for 10 enemies + projectile, 4 Midlife bosses, 7 pickups, weapons and evolutions, hero extra poses, perk/shop/achievement icon sheets, stage kits, QA checklist and change-log format.

## 2026-11-01: Bill walking-sheet reference, V. 1.28.3 (Codex)
- Read the visual-pass handoff and reviewed a short local run. Started Batch 1 with its first object, Bill, as the style/scale reference for the remaining enemies.
- Generated four poses, then corrected the repeated third-frame foot pose with a targeted imagegen edit. Exported a native 192x48 sheet (four 48x48 cells) plus a 4x review GIF, source and full prompts.
- Pixel QA passed: four distinct frames, shared y45 baseline, clear padding, exact magenta, opaque pixels, project palette and one-pixel navy silhouette outline. Inspected the looping preview.
- Batch 1 is still in progress. Await Bill feedback before generating the remaining enemies. No new art integrated into production or Art Room; no gameplay values changed. Handoff notes saved for Claude.

## 2026-11-01: Studio bio portrait, V. 1.28.4 (Codex)
- Rami supplied a studio photograph and requested a game-style version replacing the bio image. Generated a 1536x1024 pixel-art portrait preserving his seated likeness, glasses, beard, dark shirt/tie and creative workspace.
- Replaced the About lead image, Open Graph image and Twitter preview with a new versioned PNG. Added accurate alt text; retained the older silhouette asset. The source photograph was not added to the repository.
- Checked the image loads at its native dimensions, the local desktop page, phone 390x844 layout with no horizontal overflow, and clean browser logs. Saved page proof and full generation prompt.
- Bio-only update. Bill feedback and remaining enemy-art work stay pending; no gameplay or character design changed.
- Ko-fi tip jar (https://ko-fi.com/ramidaud): devlog header button (cream, never louder than Play), footer line on every devlog page, About page link, game Extras button and a friendly line on Game Over. V. 1.28.5.

## 2026-11-01: Stronger game-style bio portrait, V. 1.28.6 (Codex)
- Rami asked for the studio portrait to look more like the game. Used the first portrait as the edit target and the approved office key art as an explicit style reference.
- Generated v2 with broader color clusters, stronger navy contours, simplified props, warmer cream/teal lighting and a more illustrated face while retaining Rami's likeness and studio. Kept v1 intact.
- Updated the About lead and share images to the new versioned PNG. Checked desktop rendering, exact 1536x1024 dimensions, phone fit without overflow and clean browser logs. Saved the complete edit prompt and page proof.
- Moved Buy the Dev a Coffee from Extras to the main menu (cream button next to Devlog). V. 1.28.7.


## 2026-11-01: Restore preferred bio portrait, V. 1.28.8 (Codex)
- Rami preferred the first studio portrait. Restored v1 on the About page and its social-preview metadata; both revisions remain saved.
- Returning to the visual handoff. Only Bill's walking sheet is generated from Batch 1; nine enemy sheets and the Group Chat projectile remain. Next object is Late Fee.
- No additional portrait generation or enemy integration in this step. Remaining handoff batches cover bosses, pickups, weapons, extra hero poses, icons and later stage kits.
- Verified the restored image loads, lead/share references use v1, phone layout has no overflow, and browser logs are clean.

## 2026-11-01: Clocking Out identity, V. 1.28.9 (Codex)
- Rami disliked the orange MS mark/favicon and selected clock concept 02. Built a native 16px pixel clock with cream face, teal rim, navy hands and orange accent.
- Replaced the root favicon and home-screen icon, removed boxed initials in all devlog headers, updated the static-post template, and refreshed icon/CSS URLs. Phone headers keep the mark and game name on one row above navigation.
- Checked 16/32/64/180px exports, hard alpha and exact 2x pixel blocks, reference paths, desktop/phone layouts without overflow and clean browser logs. Published article bodies are unchanged.
- The devlog rebuild exposed its pre-existing minimal Markdown fallback changing rich article formatting in this environment. Preserved the published article bodies and applied only branding/reference changes; documented the generator limitation. No gameplay values changed.

## 2026-11-01: Enemy batch complete for review, V. 1.28.10 (Codex)
- Finished all nine remaining regular enemy species plus Group Chat ping. Together with Bill: 11 native sheets and 42 distinct frames, with sources, prompts, loops and a download bundle.
- Built an animated comparison page linked from the Art Room. Pause, step poses, compare floors and inspect at native scale. Main-game combat still uses its existing renderer pending visual review.
- Corrected Calendar's opposite stride and Late Fee's foot jitter; preserved ghost fade gaps and added a two-pixel lift to Donut's airborne poses. Kept palette, opaque magenta, clear margins and hard outlines.
- Pixel checks passed for every sheet; desktop/phone review passed loading, controls, overflow and browser logs. Updated handoff and learning notes. Bosses remain the next separate art batch.

## 2026-11-01: Link previews and the coffee post, V. 1.28.11
- Synced Codex's finished Batch 1 enemy art (10 enemies plus the chat ping) to GitHub. It still needs Rami's review before it goes in the game.
- Every shareable page now has a 1200x630 preview card: game, devlog, each post, About, Art Room, enemy review and roadmap. Post cards build themselves.
- Drafted post 05, "There's a coffee button now. It feels weird." Waiting on Rami's OK.

## 2026-11-01: Approved enemy art in combat, V. 1.28.12 (Codex)
- Integrated all ten Batch 1 enemy species and ping. Exact magenta becomes transparent; nearest-neighbor frames retain hard edges. Missing sheets fall back independently, and the top-of-file flag restores original art on reload.
- Kept original physics sprites and attached a separate animated visual layer. Every collision box/offset and all combat data remain unchanged. Phone ringing, Twinge lunges and ghost fades follow existing states; bosses are untouched.
- Added small shared contact shadows except for ghost/ping. Tuned Late Fee to 25px versus Bill's 36px and moved labels above taller drawings. Pauses, enemy destruction and restarts cleanly manage the art layer.
- Tax Bracket 0 run reached age 45 with 109 peak enemies and no errors. A 350-enemy animation/AI stress scene averaged about 99 FPS. Desktop/phone, state selection, missing-sheet fallback, toggle and cleanup checks passed; isolated tests used memory-only saves and blocked leaderboard traffic. See QA evidence for exact scope and measurements.

## 2026-11-01: Devlog publication and usage update
- Published post 05, "There's a coffee button now. It feels weird." Codex's "long way to coffee" post is still a draft.
- Published Codex's office-expansion post as post 06, retitled "The office got bigger. Somebody lost a binder." No drafts left.
- Rami moved to the Claude Max plan. CLAUDE.md usage rule updated: normal sessions, full laptop/phone tests. Enemy art integration handed to ChatGPT.
- Added a pixel-art version of the twins photo to post 05 (hospital wristband hidden).


## 2026-11-01: Hero and Corporate Campus in the main game, V. 1.28.13 (Codex)
- Rami pointed out that the approved hero and office were still confined to the Art Room. Integrated all three four-direction walking sheets and the seven-area Corporate Campus into normal play.
- Office sections repeat through a nine-section pool, keeping exploration open-ended. Desk variants, printer/cabinet/plant art, carpets, wood routes, chair mats, wear, paper trails and contact shadows now appear in combat. The old mezzanines are replaced by the approved ground-floor layout.
- Kept the player's original 48x52 collision body and all combat settings. Furniture uses the preview's floor footprints; feet control drawing order, and foreground furniture fades only when it conceals the hero.
- Exported the existing desk sources to native PNGs, reducing the main-game desk data from 5.2 MB to 24 KB. Distant sections are excluded from rendering while retaining their world state. Desktop stress with 350 enemies averaged about 100 FPS.
- Movement, desk collision, occlusion and section-seam checks passed. Phone, normal-play, fallback and restart evidence is saved under `docs/qa/world-art/`. No leaderboard test scores were submitted.

## 2026-11-01: Discord community, V. 1.28.14
- Discord is live (discord.gg/E6N9j5tZe): linked in the devlog follow boxes, footers, About page, coffee post and the game's Extras. V. 1.28.14.


## 2026-11-01: Simplified twins portrait in coffee post, V. 1.28.15 (Codex)
- Replaced the older twins illustration after the birth announcement in post 05's Why now section with Rami's simplified pixel-art revision. The previous image remains saved.
- Added a versioned 1536x1152 PNG and its full built-in-imagegen edit prompt. Updated Markdown and static article references, retaining descriptive alt text and the article's existing copy.
- Ran the devlog builder and refreshed the feed. This environment lacks the optional Markdown/Pillow packages, so preserved published HTML formatting and share-card metadata while applying the intended image-reference change. Desktop/phone image loading, fit and browser checks completed.
- Platform goal set: Steam, then PlayStation and Xbox (roadmap section added). Stage art pass added to Next up: funnier, more props, inside jokes.
- Added a one-screen link page at /links/ (Play, Devlog, Discord, Coffee) for Instagram, Threads and QR codes.
- Wrote the ChatGPT stage pass brief from Rami's jokes: a Zelda-style overworld with nine districts, literal corporate slang props, ambient coworkers and posters gone wrong. Overworld mockup first, for Rami's approval.

## 2026-11-01: Stage Pass 1, Parked Ideas, V. 1.28.16 (Codex)
- Followed Rami’s Stage Pass handoff through Stage 1 only. Created a full-campus concept and a Parking Lot camera study with parked-idea cars, Dave’s wheel clamp and corporate-slang vignettes. Added both to the Art Room.
- Authored a separate measured 7680x4320 proposal: nine districts, connected wrapping routes, 224px main lanes, 160px side loops and nine reserved 512x512 plazas. Kept the brief’s world size while showing its 6x4 planning grid separately from the real 1280x800 camera.
- Review page supports district inspection, illustration/plan switching, measurements and zoom. Saved prompts, sources, manifest and geometry checks. Corrected illustration scale before delivery; concept paintings remain separate from precise collision planning.
- Stage 1 review checks cover desktop/phone loading, controls and layout. Production world, collisions, combat, leaderboard and posts are unchanged. Stop here for Rami’s approval before props/posters, coworker sheets or overworld implementation.
- Stage structure: one campus with areas that unlock as you age ("promotions"). Added to the stage pass addendum, with an overview v2 before Stage 2.


## 2026-11-01: Campus v2, promotion gates and production plan, V. 1.28.17 (Codex)
- Revised the overview after Claude's review confirmed by Rami: unequal floor shapes, bigger Bullpen, tiny hidden Archive, dressed fighting spaces and hallway story bays. Kept the approved Parking Lot image unchanged.
- Added an isolated Art Room review with age and achievement controls, exact measured plan, caption previews and native hero/enemy references. About 7.6 desktop camera areas of starting floor before prop placement.
- Saved tunable promotion/door/spawn policies and a 72-family modular kit plan with variants, seamless tile contract and readable signs. Assets and runtime behaviors remain planned, not generated or implemented.
- Physical floor checks passed 18 promotion-boundary/achievement cases including wrapping, without locked-floor leaks. Desktop and 390px phone checks passed with clean logs and contained zoom. Runtime crowd/performance tests remain future work.
- Stop for v2 review before Stage 2. No live world, balance, save, leaderboard, post or CLAUDE.md changes.


## 2026-11-01: Stage 2A props and posters, V. 1.28.18 (Codex)
- Rami approved campus v2 and asked to begin Stage 2. Recorded full 224px clear openings for every gate, including Archive/seam gates, with jambs outside the route. Runtime navigation and locked-area spawning remain Claude's work.
- Generated 13 families: three new desk personalities, KPI frame, parked compact car, wheel clamp, keycard jamb, subtle FILES cabinet, four posters and REBRAND? sign. Delivered 31 quiet colorways on exact-magenta native grids; existing desk art was not regenerated.
- Added an isolated review with real 56x60 hero and 36px Bill comparisons, palette/footprint controls, once-only caption demo and open/closed gate studies. Sources, full prompts, manifest and optional native exporter are saved under assets/stage/props.
- Native checks passed palette, opacity, margins, one-pixel outlines, unique variants and matching masks; 16 gate contracts keep 224px spans. Desktop and 390px phone review passed, including contained zoom and all 13 native canvas widths. No runtime world, pathing, balance, saves, leaderboard or posts changed.
- Stage 2 remains in progress. Next batch: remaining slang props and district landmarks, reusing existing furniture. No new-world age-50 or 350-enemy run is claimed before integration.

## 2026-11-01: Enemies walk around furniture, V. 1.29.0
- New flow-field navigation: swarms route around desks and through doorways instead of sticking to walls.
- Test: 12 donuts behind a desk reached the player 0 times with the old chase, and most arrived within 2 seconds with the new one. 350 enemies steer in about 0.2ms per frame.
- Enemies no longer spawn inside furniture, and areas that can't reach the player (future locked promotion gates) are skipped.
- ChatGPT started Stage 2: the first 13 prop families and posters, with full-width gate doorways.

## 2026-11-01: First joke props in the office, V. 1.29.1
- ChatGPT's first 13 prop families now appear in the current office: sticky-note, 2009 and family-photo desks, Hang in There posters, the KPI sign, OPPORTUNITY and PERSEVERANCE posters, two parked cars (one REBRAND, one booted "Dave's idea"), and the FILES cabinet by the lost binder.
- New "read on approach" captions: walking up to a joke shows the full line as a MEMO in the lower third, once per run.
- Positions and captions live in `src/data/stage-props.js`, so they're easy to move or rewrite.


## 2026-11-01: Literal office slang and landmarks, V. 1.29.2 (Codex)
- Continued Stage 2 with 12 new families: ten literal corporate-slang props and the Q4 Goals/company-values landmarks. Added 24 colorways, bringing the kit to 25 families and 55 colorways. Sources and full prompts are saved.
- Expanded the existing review with batch/category filters, real hero/Bill comparisons, floor-versus-wall decor roles and caption previews. Kept water/foliage colors consistent across variants; removed attached plants from the wall so the kit stays reusable.
- Pulled Claude's V. 1.29.0 navigation and V. 1.29.1 first-batch integration before release. Preserved all existing native PNGs and runtime logic. New family/caption candidate is asset data only, with placements still empty.
- Native checks pass all 55 frames and unchanged 224px gate contracts. Desktop/phone review checks are recorded under QA. No new-world performance result is claimed before integration.
- Stage 2 remains in progress: 47 planned families still need completion, including existing-art preparation. Next: break-room furniture, ambient clutter and the remaining posters.
- Placed 10 of ChatGPT's Stage 2B slang props in the current office: roundabout, MEH gauge, fruit tree, kiddie pool, ocean pot, ducks, goalposts, STOP sign, offline lamp, and Touch Base at the start. The Q4 Goals board and values wall are saved for the new Bullpen and Lobby.

## 2026-11-01: Close Calls (near-miss rewards), V. 1.30.0
- Built Grok's Part 3C: dodging an enemy that's coming at you earns a little XP, a speed blip, score and a streak meter (CLOSE CALL, SIDE-STEP, OUT OF OFFICE, PERFORMANCE EXCEEDED). A hit breaks the streak.
- Anti-cheat: you must be moving, or the enemy must have a clear path (no desk camping). XP caps at 6 per 10 seconds.
- Caught a design gap in testing: the player's real hit box is 48x52, not 32, so the ring is now measured between the real hit boxes.
- Saved Gemini's caption library (districts, gates, posters, coworker lines) for ChatGPT's remaining props.

## 2026-11-01: Play stats, V. 1.30.1
- Leaderboard check (named players only): Midlife had 45 runs from 14 players, Full Life 13 runs from 4 players, since Oct 31.
- GoatCounter visit counts on the game, devlog, posts, About, Art Room and links page, plus game events (run start, died, cleared, reached 45/50/55/60/65).
- One anonymous row per run in a new Supabase `runs` table: length, age, score, character, killer, device, version, Close Calls. The table only accepts new rows; Rami reads it in the dashboard (docs/sql/STATS_QUERIES.sql).
- Privacy note added to the About page. Agents must test with `?nostats=1`.

## 2026-11-01: Playtest fixes from Ben and T.J., V. 1.30.2
- Dad Joke buff: enemies in the circle stop to groan (0.65s) and stagger back; radius 110 to 130, every 2.3s instead of 2.6s. Bosses only take damage.
- New center flash banner for bosses, the Comfort Zone Tax and power-ups (short words near the player); the full sentence still goes to the bottom bar.
- Lost-controls-after-shop: couldn't reproduce in 5 paths (mouse, keyboard, buying, resume). Added a full input reset at every run start. Waiting on Ben's exact steps and browser.
- Music: wakes iPhone "interrupted" audio, plays with the ringer on silent (iOS 17+), and retries when you return to the tab.

## 2026-11-01: Controller pass and pause "Right now", V. 1.30.3
- Drove the whole game with a simulated controller: title, pause, level-up, Game Over, Shop and back all work. Found and fixed one gap: B (and Escape) didn't back out of title sub-pages like the Shop.
- Pause menu now lists what's affecting the run right now, with time left.
- Ben's lost-controls bug: still can't reproduce (also tried Pause > Save & Exit > Shop > Resume). The Shop B-button trap is a strong suspect if he used a controller.
- Drafted devlog post 07 (office jokes, smarter enemies, Close Calls, playtester fixes).
- Saved Grok's Part 3D spec (8 age-50+ run modifiers: Ghost Hour, Reading Glasses, Rent Hike, Empty Nest, Back Spasm, Reply-All Tax, Past Due, Open Enrollment). Not built yet.
- Balance bot check on V. 1.30.3: fresh-save kite bot died at 41.7, 41.8 and 42.3 (before: 42.3 to 43.0). Not easier; slightly harder, likely furniture snagging the naive bot. Real numbers will come from the runs table.
- Published devlog post 7 ("My office got jokes. Then my enemies got smarter."). Rami: Close Calls feel good after a few runs.

## 2026-11-01 (late): Ben's iPhone touch bug fixed (V. 1.30.4)
- Ben: iPhone 13, Safari. Touch steering died after the 401(k) Shop.
- Cause: on iPhone, the finger-lift goes to the menu button that just got replaced, so Phaser never hears it and thinks a finger is still down. Its touch slots fill up and new touches get ignored.
- Fix: every new touch frees any "held" slot the browser says isn't really touching. Reproduced in a test before the fix (moved 0) and after (moved 226).

## 2026-11-01 (late): Shop refund and big-screen zoom (V. 1.30.5)
- 401(k) Shop: REFUND ALL returns every coin spent so players can try a different build (two taps to confirm).
- Big screens zoom the camera in (720p laptop 1x to 1.25x, 1080p 1.5x, 1440p 2.25x, 4K 3.25x). Phones unchanged.
- Side effect to watch: on big monitors enemies now appear closer, so desktop is a bit harder than before (closer to phone).
- Rami: still a little too easy for him, but OK with it for now.

## 2026-11-01: Lobby/Bullpen start-area slice, V. 1.31.0 (Codex)
- Saved the prior work on stage-2c-wip, updated main and merged cleanly. Claude's navigation, Close Calls, controller fixes, banners and telemetry were preserved, including the concurrent iPhone touch, shop-refund and camera-zoom fixes.
- Finished eight start-area prop families and three static coworker colorways. One duck is clearly out of line; reception, desk neighborhoods, hallway clutter and floor stories are now playable.
- Lobby and Bullpen open at 40. Both age-45 doors stay closed for this slice, span the full 224px route and register navigation blockers. Future promotions remain tunable data.
- Added bounded-floor spawn validation, footprint/connectivity checks, culling and isolated desktop/phone QA. No test scores or analytics submitted. Enemy and combat balance tables unchanged.
- Next: Rami plays these two areas before other districts. Claude should review the saved Circle Back corner-hesitation trace and own future gate opening.

## 2026-11-02: Reviewed ChatGPT's Lobby and Bullpen (V. 1.31.0), fixed the roundabout snag (V. 1.31.1)
- ChatGPT shipped the first real slice: Lobby and Bullpen, 35 varied desks, 18 seated coworkers, hallway jokes, two closed age-45 gates.
- Review: merge clean, my touch/shop/zoom fixes intact, no errors on desktop or phone. The whole run now happens in these two rooms until more districts exist.
- Fixed the "Circle Back hesitation": enemies right behind a small prop charged straight into it. Pathing now checks for a clear line, and enemies squeezed against furniture slide out. Test: 2 of 5 stuck before, 0 of 5 after.
- Test bot dies at 41.3 to 42.3 in the new rooms (about the same as before).

## 2026-11-02: Bigger enemies (V. 1.32.0)
- Regular enemies 1.4x bigger (hit boxes too). Bosses 2.3x, with a hit box half that so they still fit between desks.
- One dial to tweak: `ENEMY_SCALE` at the bottom of `src/data/enemies.js`.
- Tests: desktop and phone clean; roundabout route still 5 of 5; test bot dies around 41.3 (same range as before).
- Wrote ChatGPT's next brief: smashed versions of office props, and big boss art for the three Midlife bosses.

## 2026-11-02: Speed pass (V. 1.32.1)
- Rami: laggy on iPad. Profiled 250 to 400 enemies.
- Fixes: floor shadows baked into 4 images (were redrawn every frame), frame cap for 120 Hz screens, HUD batched to once per frame, fewer full re-sorts of the scene, a 3D leftover no longer touches every sprite each frame.
- Game logic at 400 enemies went from about 14 ms to 11 ms per frame here. Biggest remaining cost is Phaser's enemy-vs-enemy bumping, which is what makes swarms look like swarms.

## 2026-11-02: Tougher start, plants regrow (V. 1.32.2)
- Rami: never touched early, ran out of pizza plants.
- Bills now 3 HP (was 2); donuts arrive at 42 (was 45); a small extra ramp at 43.5. Test bot now dies at 41.0 to 41.6 (was 41.3 to 42.3).
- Smashed plants grow back after 75 seconds (not while you're standing on them).
- Rami's new wish list logged in the roadmap: more room by minute 20, death and hit effects, movement polish, sound sliders, end-of-run achievements summary, his son making the music.

## 2026-11-02: Beautiful Chaos (V. 1.33.0)
- Kills flash, squash and pop with a shockwave ring; hits squash the sprite and shove the enemy back; dust puffs at your feet. Tunable in `JUICE` (src/juice.js).
- Sound: every effect wobbles in pitch, some get a noise layer (paper rip, thud, whoosh), kill and gem streaks climb a pentatonic scale, a compressor glues big fights together, and a voice cap keeps it from turning to mush. Tunable in `SOUND_VARY` (src/data/sounds.js).
- Pause menu: separate Music and Effects volume (saved per browser).
- Play stats now log hits and damage taken per run. Device and smoothness fields are ready but switched off until docs/sql/RUNS_DEVICE.sql is run.
- Device details and smoothness (avg fps, slow frames) now recorded per run (V. 1.33.1).
- Supabase connector linked. First live read: 22 runs from 9 players in the last day, average 4.6 minutes, average age 46.1, nobody has retired yet. Top killers: Bills, Spam Likely, Late Fees.
- New daily scheduled task "Midlife Survivors morning stats" (7:27 AM, read-only Supabase queries, push notification).
- Next ChatGPT job written: Stage 2D Parking Lot and Break Room (docs/handoffs/chatgpt-stage-2d-rooms.md). Gemini pass 2 saved; achievement lines need a redo against the real list.
- Grok boss-attack spec saved (charge, % rings with a gap, V8 drift with skid marks). Approved to build next session.
- End-of-run summary on Game Over (earned achievements with Gemini's lines, shop tip, next goals) and 10 new death lines (V. 1.33.2). CLAUDE.md: Supabase read-freely / ask-before-change rule added (Rami approved).

## 2026-11-02: Boss attacks (V. 1.34.0)
- Built Grok's spec: Performance Review charge (orange lane), Mortgage % rings with a safe gap, V8 drift loop with skid marks. Data in src/data/bosses.js, logic in src/boss-attacks.js.
- Warnings never drop under 0.55 s (0.65 s for rings); attacks pass through furniture; all hits use the normal safe window.
- Tests (desktop and phone): each boss cycles warning, attack, recovery, chase. Standing still gets hit; sidestepping the charge, using the gap and leaving the loop avoid it.
- Not built yet from the spec: off-screen edge arrows (bosses only attack once on screen instead), Close Call credit for grazing attacks.


## 2026-11-02: Breakable props and big boss art ready for review (Codex)
- Finished Part A first: eight prop families, every existing colorway, unchanged intact pixels, cracked/broken states and six debris pieces per color. Total: 54 state frames and 108 debris cells.
- Finished Part B: Performance Review, 30-Year Mortgage and Midlife Crisis V8, each with six walk, two wind-up, two attack and one hurt pose, plus a separate floor marker.
- Sources, full prompts, native exports, manifests and an isolated 1x/2x animated review are saved under assets/breakables and assets/bosses. Checked at 1280x800 and 390x844 beside the real-size hero and Bill.
- Art only, awaiting Rami. No runtime registration, game code, stats, balance or version change in this art delivery. Claude owns breaking, loot and attacks.
- Reviewed ChatGPT Part A (breakable prop states, 8 families) and Part B (3 Midlife boss sets, 144x152 native, wind-up/attack/hurt poses, ground markers). Art only; game code untouched; my boss attacks preserved. Stage 2D rooms not pushed yet. Awaiting Rami's art approval before wiring in.

## 2026-11-02: Smash the printer (V. 1.35.0)
- Rami approved ChatGPT's breakable and boss art. Eight prop types now crack at half health, then break into a walk-over pile with debris, loot and a Gemini joke; they rebuild after 90 s. Numbers in src/data/breakables.js.
- Bosses use the new 144x152 art with walk, wind-up, attack and hurt poses; the Performance Review and Mortgage show ChatGPT's floor markers during the warning.
- Tests: desktop and phone, intact to cracked to broken works, enemies can walk over rubble, boss attacks unchanged, touch fix still holds.
- ChatGPT's Stage 2D rooms are still unsaved on the Mac; it was asked to pull, finish and push.


## 2026-11-02: Parking Lot and Break Room (Codex, V. 1.36.0)
- Built both age-45 rooms with wide parking lanes, 27 cars, tree islands, coffee/kitchen landmarks, birthday corner and twenty small breakable-prop placements.
- Eight new prop families, 23 colorways and two extra car paints. Original Lobby/Bullpen fixtures and coworkers stay unchanged; longer jokes use approach captions.
- All four gates ship closed, including the far age-50 doors. Routes retain 224px clearance. Claude's new breakable/boss integration was pulled and preserved before delivery.
- Desktop and 390x844 game-frame checks cover closed-room births, doorway routing, native scale and 350-enemy stress. Isolated review blocks analytics and Supabase. See assets/stage/start-area/qa for scope and evidence.

## 2026-11-02: Promoted at 45 (V. 1.37.0)
- Reviewed ChatGPT's Stage 2D (V. 1.36.0): Parking Lot and Break Room, 8 new prop families, 27 cars, four closed doors; my runtime files untouched.
- Built the door opening: at 45 the two doors roll up with a PROMOTED banner, their no-entry zones come out of enemy pathing, and the rooms join the fight. The age-50 doors stay shut until those rooms exist (PROMOTIONS.openUpToAge in src/promotions.js).
- Tests: desktop and phone, the player walks into the Parking Lot, and a Bill spawned in the Lobby followed through the door from about 1,000 px away to within 134 px.
- Leaderboard scare at 6:43: data was intact the whole time (67 scores); most likely a page loaded mid-deploy.
- Wrote ChatGPT brief for Stage 2E (Server Room + Conference Rooms behind the age-50 doors, plus a closed age-55 Executive Wing door).

## 2026-11-02: Stage 2E reviewed, age-50 crash fixed (V. 1.38.1)
- Reviewed ChatGPT's V. 1.38.0: Server Room (19 racks, cable waterfall) and three glass Conference Rooms behind the age-50 doors, closed Executive door at 55. My runtime files untouched.
- Fixed a real crash ChatGPT spotted: at age 50 the first 3 AM Thought (no shadow) broke enemy drawing. It came from my own speed pass; one missing pair of braces.
- Tests: desktop and phone at age 50 with ghosts on screen, no errors. A test-only switch to 50 opens the Server and Conference doors and keeps Executive shut; all rooms reachable.
- Doors at 50 stay closed until Rami approves the rooms (one setting: openUpToAge 50).

## 2026-11-02: Promoted again at 50 (V. 1.39.0)
- Rami approved Stage 2E. At age 50 the Server Room and Conference doors roll up; the Executive Wing (55) stays locked.
- Promotion messages now wait their turn instead of getting dropped when a boss or the AGE card is on screen. The big center PROMOTED flash always shows.
- Tests: doors open on their own at 50 on desktop and phone, all new rooms reachable, no errors.

## 2026-11-02: Music sleeps in the background (V. 1.39.1)
- Rami: music kept plinking slowly after closing the game or locking the phone. Browsers slow hidden timers instead of stopping them, so the music loop kept going. Audio now suspends when the page is hidden and wakes on return.
- Derek and T.J. reported odd enemy pathing (a single-file line along a wall, enemies drifting away). A bot playtest at 1280x800 didn't reproduce it: 94 to 97% of enemies chase normally. Asked for device, version and where it happened.
- Wrote ChatGPT brief for Stage 2F: the Executive Wing behind the age-55 door (room for the V8 boss at 60), a closed age-60 Wellness door, and crash cart smash art. Pathing files are off-limits while Claude debugs.

## 2026-11-02: Enemies stuck behind walls, fixed (V. 1.39.2)
- Derek (laptop, 1.39.1, Lobby bottom right): enemies lined up along a wall and backed away when he got close.
- Cause: the "No." shockwave teleported Bills 95px straight away from you without checking for walls, so near the dark block it popped them through the thin wall. Trapped inside, they lined up along it. Reproduced: 4 of 8 Bills stuck inside the wall, still stuck 4 seconds later.
- Fix: shoves (the "No." and hit knockback) now move in small steps and stop at walls, furniture and floor edges. Any enemy that still ends up off the floor for 2 seconds is put back on a reachable spot. Same test after: 0 stuck.
- Checked: age-50 test, promotion doors, bot playtests on desktop and phone, no errors.

## 2026-11-02: Rami's recording, pathing debug switch (V. 1.39.3)
- Rami's 10-second recording (1.39.1, level 1, Lobby under the "Hang in there" poster): Bills and Late Fees bunch in a column about 250px away, facing him but not arriving.
- Couldn't reproduce on 1.39.1 or 1.39.2 at his exact spot and screen size, with any starting character, standing still or walking. No solid object is there.
- Added a playtester switch: put ?navdebug=1 on the game link to see the spots enemies treat as solid (red), so the next recording shows what's blocking them.

## 2026-11-02: Executive Wing reviewed, "running away" fixed, leaderboard retry (V. 1.40.2)
- Reviewed ChatGPT's Stage 2F (V. 1.40.0): Executive Wing behind the age-55 door (wood panels, leather chairs, corner office, putting mat, awards case), closed age-60 Wellness door, crash cart now smashable. Code changes stayed in its own files. Doors still closed until Rami approves.
- ChatGPT flagged a Bill stuck behind the big desk. Root cause, and likely Derek's "they run away": directly behind something wide, "around the left" and "around the right" are equally short, their pulls cancel, and the leftover pointed straight back, away from the player. Enemies now take the single best step when the blend disagrees with it, and each has a favorite side for ties. Desk test: never arrived before, now 3.75 s.
- Leaderboard showed "No scores yet" again while the server held 77 scores and sent all of them. Board now skips cached replies, retries once if a reply comes back empty, and shows a Retry button instead of "No scores yet."
- Added NAV.inspect (debug helper) next to ?navdebug=1.

## 2026-11-02: Promoted at 55, Dad Joke becomes an attack (V. 1.41.0)
- Rami approved the Executive Wing: the age-55 door now opens (Wellness at 60 stays closed).
- Rami: make Dad Joke "more of an attack weapon with a more apparent visual effect." Damage 1 to 2, freeze 0.65 s to a 0.22 s flinch, lighter stagger. New punchline blast: yellow flash, thick shockwave, 12 rays, flying "HA!"/"GROAN"/"BA-DUM-TSS", tiny screen bump.
- Test: two blasts cleared 10 of 12 Bills circling the player, desktop and phone, no errors. Dad Joke now hits; "No." stays the personal-space tool.
- Wrote ChatGPT brief for Stage 2G: Wellness Corner behind the age-60 door, the last promotion room in a Midlife run.
- Wrote Grok brief: weapon roles and balance pass (spec only), prompted by Rami asking how Dad Joke and "No." differ.

## 2026-11-02: Wellness Corner reviewed (ChatGPT V. 1.42.0)
- ChatGPT built "HR Says Relax" behind the age-60 door: massage chair, quiet pod, lighthouse puzzle, SAD lamp, yoga mats, broken nap pod, zen fountain, MANDATORY FUN, 19 breakables. The door moved beside the Conference corridor (Rami approved); the old opening is sealed.
- My checks: code changes stayed in ChatGPT's files. Test-open at 60 on desktop and phone: every landmark reachable, a Bill followed from Conference through the door in ~10 s. Closed: zero enemies inside before 60.
- Awaiting Rami's approval to open it (openUpToAge 60). That completes every promotion door in a Midlife run.

## 2026-11-02: Promoted at 60, the office is complete (V. 1.42.1)
- Rami approved the Wellness Corner; openUpToAge is now 60. Every promotion door in a Midlife run (45, 50, 55, 60) opens into a finished room.
- Test: door shut at 59.9, open at 60.0, desktop and phone, no errors.
- Grok delivered the weapon roles spec (docs/handoffs/grok-weapon-roles-spec.md). Claude checked its numbers against live code: all match. Awaiting Rami approval to build.

## 2026-11-02: Weapon roles pass (V. 1.43.0)
- Rami approved Grok's spec; built it as data changes. Dad Joke: blast every 2.2 s, softer push, Louder Groan now 8% faster per rank (radius x1.20). "No.": shove 110 (cap 520), Firm Boundaries adds damage only on ranks 2 and 4. Pun Storm flinch 320 ms. Spreadsheet spin 3.4, Remote odd ranks throw 5% sooner. Card text and character taglines rewritten.
- Grok's acceptance math checks out in-game: max Louder 1576 ms / 269 px / 6 dmg; max Firm 3 dmg / 366 px shove; max Universal Remote 3 throws.
- Bot playtest: 0.7% of enemies off track, no errors. Watch Pun Storm in the 60s; Grok's fallback is 0.58 to 0.64.
- Wrote ChatGPT brief: 8-frame v2 enemy sheets for smoother animation (art only; Claude wires them in after Rami approves).
- Devlog RSS feed now includes each full post (text, images, What changed, Next up, play link) so Substack imports the whole post instead of just the teaser.
- Saved Grok's art coherence review (docs/handoffs/grok-art-coherence-review.md).
- Rami agreed: in a Midlife run the office is the whole journey (stages belong to Full Life). Wrote ChatGPT finish-pass brief (pixel floor decor, denser Bullpen, pixel UI icon sheet), queued after the 8-frame enemies. Claude to do the lore/chapter-line rewrite.

## 2026-11-02: Life follows you to work (V. 1.43.1)
- Rami agreed with the direction from Grok's art review: in a Midlife run the office is the whole journey. Lore chapter 2 rewritten to say so; the five arenas are now Full Life chapters. Scenario codes say which room each life chapter "follows you to"; bosses list the room you actually fight them in. Removed a stale Mezzanine tip from the 3D era.
- Each promotion now adds a LIFE line (45 hospital co-pays, 50 tuition and carpool, 55 retirement calculator and knees, 60 the group chat).
- Found while testing: interrupted messages were thrown away and the queue only held 3. Now interrupted messages go back in line, the queue holds 5, and promotions rank with tips.

## 2026-11-02: Reviewed ChatGPT's 8-frame enemies and office finish (V. 1.44.0)
- 8-frame enemy sheets: all 11 are the right size; special layouts correct (Spam Likely walk then ring, Back Twinge lunge then rest, 3 AM Thought fade to see-through ghost). Not wired in yet.
- Office finish (live in 1.44.0): stitched WELCOME rug, softer floor, Bullpen filled with CRT cubicle rows and paper drifts. My checks: bot playtest 1.5% off track, Bullpen spots 0 to 1% walking away, age-50 test clean on desktop and phone.
- Pixel icon atlas: 31 cards + 3 characters + fallback; every level-up card has an icon. Not wired in yet.

## 2026-11-02: 8-frame enemies and pixel icons wired in (V. 1.45.0)
- Rami approved. enemy-art.js now loads the v2 sheets (8 frames at half the time each, same overall speed); Spam Likely walk 0-3 / ring 4-7, Back Twinge lunge 0-3 / rest 4-7, 3 AM Thought solid 0-3 / fade 4-5 / ghost 6-7. ENEMY_ART_VERSION = 1 switches back.
- Pixel icons on level-up cards (64px), HUD avatar and character picker, from a transparent copy of ChatGPT's atlas (src/data/ui-icons.js). USE_PIXEL_ICONS = false switches back to emoji.
- Tests: desktop and phone, no errors, v2 frames in use, all three cards and the avatar show pixel icons.
- Wrote ChatGPT brief: 8-frame hero walk + idle sheets for all three characters (art only; Claude wires in after Rami approves).
- Reviewed ChatGPT's 8-frame hero sheets (1878c5d): all three 448x300, v1 files untouched, one foot line per character (walk and idle), on-model in all directions; idle fidgets: glasses push, neck rub, notebook check. Awaiting Rami's approval to wire in.

## 2026-11-02: 8-frame heroes wired in (V. 1.46.0)
- Rami approved. world-art.js loads the v2 sheets: 8-frame walks (a step every 8.5 px), breathing loop when standing, a fidget every 7 s. HERO_ART_VERSION = 1 switches back; tuning in window.HERO_ANIM.
- Test: all three characters use all 8 walk frames plus breathing and fidget frames, no errors.
- Wrote ChatGPT brief: animated coworkers (6-8 seated characters, idle loops, "noticed you" reactions, own captions); ChatGPT may wire this one itself since it is room art in its files.

## 2026-11-02: Animated coworkers reviewed (ChatGPT V. 1.47.0)
- Six seated coworkers (dozer, email, intern, mute, retiring, salad), two colorways each, fill the 30 seats with staggered idle loops, a 4-frame "noticed you" reaction within 120 px (6 s cooldown) and their own captions.
- My checks: only ChatGPT's room files changed, spawn code untouched; idle and reaction frames play on desktop and phone, no errors. Bot run: no enemies walking away; the "unreachable" count was enemies pressed against the closed Parking door next to the player.

## 2026-11-02: Office layout redo, step 1 (plan)
- Rami: animated coworkers look "slapped on", office "very repetitive and poorly laid out." Claude's zoomed-out captures: coworkers float behind partitions at head size with empty chairs in front; one desk module stamped ~40 times on a flat navy floor; no pods, zones or landmarks; Lobby mostly empty.
- Agreed approach: plan first, then build. Wrote ChatGPT brief for two layout options (A/B) with plan images, a mood frame each and a README; pods with team identities, personal desks, zoned floors, one landmark per screen, coworkers seated in chairs at hero scale plus a few standing scenes.
- Substack (set up in another chat): "Midlife Survivors Devlog" is its own Substack section (sender "Midlife Survivors"), 7 imported posts, a "Play Midlife Survivors" nav link. A weekly Sunday 6:38 pm task drafts a devlog post as a Gmail draft, using the GitHub Pages devlog and its RSS feed as the source (first run Nov 8). Keep feed.xml full-text.

## 2026-11-02: Devlog post 08 drafted
- "I got promoted four times before lunch." (draft): promotions and six new rooms, breakables and boss attacks, Derek and T.J.'s "they ran away" bug (tunneling + cancel-out), weapon roles, 8-frame animation and coworkers, next up the layout plan. Six screenshots from today's tests.
- Draft only: not in the RSS feed, so the Sunday Substack task won't pick it up until Rami approves.
- CLAUDE.md: added the Substack line to the Devlog section (Rami said yes).
- Published devlog post 08 (Rami: publish now, not Sunday). It is first in the feed for a same-day Substack import.
- Post 08 cover is now the new key art (PROMOTED door, made in ChatGPT image gen by Rami). Single-post feed-08.xml rebuilt with it for the Substack import.
- Substack flagged post 08 as fully AI-written. Decided: disclose with a "How I make this" statement (no detector dodging), and from post 09 build posts from Rami's voice memo + a short interview so his words lead. Added to CLAUDE.md and devlog/README.md.

## 2026-11-03: Devlog home redesign
- Newest memo is a big featured card; older memos are compact cards. Every card shows the exact filing time from git history.
- New sidebar (stacks under the posts on phones): a build clock (95 builds in 3 days 12 h, builds per day, last 8 versions with times), anonymous play stats, the live Midlife leaderboard and follow links (now including Substack).
- Data comes from devlog/data/stats.json (devlog/scripts/build_stats.py). Lead images can carry an ART margin note (tool + prompt) via leadNote in posts.js.
- Post 08 opening changed to "Last night my game was two rooms and a locked door."
- ChatGPT layout plans in (ecf2bd8): A "Main Avenue" (straight route, printer apron, east arena) and B "Courtyard Loop" (loop around an open commons, pods at the turns). Claude recommends B's loop layout with A's look. Waiting on Rami.

## 2026-11-03: Devlog post pages v2
- Post pages match the new home: a sidebar with every memo in order ("You are here", check marks for memos you've read, a read-progress bar), "Behind this memo" build stats (builds in this memo, builds since) and the live leaderboard.
- Each post shows its memo number and exact filing time, plus a thin reading-progress bar along the top.
- The end of every post has "What happened before" and "What's next" cards. The latest memo's "What's next" shows the nextUp line and follow links.
- New reading-order toggle on the home page and every post: **Newest first** (catch up) or **From the start** (memo 01 gets the spotlight). It remembers each reader's choice.

## 2026-11-03: Bonus Chest moment (V. 1.48.0) and devlog polish
- Boss chests are a real moment now: a BONUS APPROVED card, then OPEN, beams, slot-reel rewards, a coin fountain, a ticking counter and a gold flash. They pay 1, 3 or 5 rewards by boss (Performance Review, Mortgage, V8). SKIP jumps to the end.
- Rewards apply automatically instead of opening a pick-one menu. The first beam prefers an evolution or a new weapon. Placeholder chest art until ChatGPT's sheets land.
- Devlog: screened key-art background with a soft pixel texture, a pop-up hint bubble on the reading-order toggle, a real header for the memo list ("The whole story, in order." / "What just shipped.") with a short technical subhead, and the nav now says "Memos".
- Fixed the devlog leaderboard: an extra `_` in the request address made the database reject every request.

## 2026-11-03: Your employee file + Required Reading (V. 1.48.1)
- The devlog has a "Your employee file" card on the home page and every post: best Midlife score, oldest age, 401(k) balance and achievements, read from the game's save in the same browser. Nothing is sent anywhere.
- A memo counts as read only when you scroll to the end, and a small toast says "Memo finished, 3 of 10."
- Finish 10 memos, then clock in: the **Required Reading** achievement unlocks (+10k 401(k)). Only 8 memos are out, so the first unlock lands with memo 10.

## 2026-11-03: Elite enemies (V. 1.49.0)
- Rami: "every enemy is basically the same strength," so crowds melt in one hit. Added elites: a share of spawns comes in bigger, slower, in a red glow, with names (FINAL NOTICE, SCAM LIKELY, THE DOZEN, SCIATICA, ALL-HANDS, FAMILY CHAT, REPLY ALL, FINAL EXAM).
- Elite HP is 5x normal and never fewer than 5 hits of your coffee, so they stay tough as you power up. Each drops 4 gems and 2 coins.
- The elite share grows with age (2% at 40, 8% at 48, 11% at 55, 14% at 65). All tunable in `INTENSITY.elites` in `src/data/swarms.js`.

## 2026-11-03: Courtyard Loop approved, brand + device pass 1 (V. 1.50.1)
- Rami approved ChatGPT's Courtyard Loop (V. 1.50.0). Notes for later: the gray window marks read as boxes (lighting replaces them), and the open floors need non-solid dressing.
- Started making the whole game match the devlog. Audited every screen on desktop, iPad portrait and landscape, and iPhone.
- Fixed: phone level-up cards (text was squeezed and the button ran off screen), off-palette blue card borders and typewriter names, the chest card's Courier font, and tiny menus on iPad. The level-up hint is now short and device-aware.
- Next in the pass: HUD, pause menu, game over, title, shop and the lower-third messages.

## 2026-11-03: Brand pass 2, one progress bar everywhere (V. 1.50.2)
- New shared bar component, `assets/ui/ms-bar.css`, loaded by both the devlog and the game: a navy frame, teal ring, bevel, pixel segments and a glowing fill. It's about 10px on phones, 13px on iPad and 16px on desktop.
- The devlog reading bar is now that fat bar, docked right under the sticky navigation on every device.
- In the game, the XP, year and hero health bars use the same look (health is drawn to match, red to coffee, and pulses when low).
- HUD and lower-third messages moved to Silkscreen and Atkinson in palette colors, with larger text and buttons on iPad.

## 2026-11-03: Poster title screen (V. 1.51.0) + bigger devlog reading bar
- New title screen built around the key art. The logo sits over the ceiling, and a glowing PUNCH IN points at the time clock the 9-to-5er is using, with the swarm visible at the glass doors.
- Character pick is a row of ID badges. Mode and Tax Bracket live in a small settings chip.
- The latest devlog memo is pinned on the title screen (cover, title, link), with the build count and "updated X ago". It reads the devlog's own files, so new posts appear automatically.
- Layouts for desktop, iPad (both orientations) and phone. Keyboard focus starts on Punch In.
- Devlog reading bar: now tracks the whole page from the first scroll, is twice as thick, and celebrates at the end (a shine sweep plus "✓ MEMO FINISHED").
- Title slideshow (V. 1.51.1): five key art pieces crossfade with a slow push-in, about 9 s each. The Punch In pointer only shows on the lobby slide (the one with the time clock). Slides, crops and timing live in `src/data/title-art.js`. Images were converted to light JPGs.
- Title tiles (V. 1.52.0): the bottom of the title is a bento row on desktop and iPad landscape. "Your employee file" (welcome or welcome back, the last shift, oldest age, best score, 401(k), achievements, shifts worked) sits beside the crew badges and the devlog memo. The phone layout keeps its stack. The save now records `runsPlayed`, `bestScore` and `lastRun`.
- Universal nav (V. 1.52.1): `assets/ui/ms-nav.js` + `.css` builds one bar on the game, the devlog, posts, Art Room, About and the share pages, with the same links and the current page highlighted. ▲ hides it (remembered per browser) and the MENU tab brings it back. It's hidden during actual play and returns on pause and game over. Phones get one row that scrolls sideways.
- Hybrid Schedule (V. 1.53.0): the save counts runs per device type (phone, tablet, desktop) and controller runs. New achievements: Hybrid Schedule, Remote Worker and Plugged In. The employee file tile shows one personal nudge per visit, based on your history (another device, a controller, devlog memos read, the Discord).
- V. 1.54.0: ChatGPT's Bonus Approved art is wired in (three chest tiers with shake and open frames, pixel beams, gold and silver coins and checks, a 9-slice card, an APPROVED stamp), plus the brighter Reading Glasses icon. Punch In moved into a "Today's shift" tile on wide screens. Grok's 11:58 PM and Happy Retirement slides were added. Gemini's welcome-back, device and Discord lines live in `src/data/title-copy.js`. The nav also stays hidden during level-ups and chests.
- Pause menu as tiles (V. 1.54.1), titled "On Break": Resume, Save & Exit and Start Fresh across the top, then This shift (age, health and XP on the shared bar, time, kills, 401(k), active effects), Your loadout (weapons and perks with levels) and Settings. Two columns on iPad, stacked on phones. Keyboard focus starts on Resume.
- V. 1.56.0 polish: smoother slideshow (no pixel crawl, the outgoing slide holds its framing, a 2.4 s fade, gentler zoom). Landscape gets a top-left masthead with the art lifted above the tiles, and ultrawide shows the whole picture with blurred sides. The pause screen shows your hero idling beside the title. Shop, Extras, Leaderboard, Achievements, Credits and Options use tile panels. Soft hover ticks in menus and the nav. The nav says "Devlog". The "One look" rules were added to CLAUDE.md.

## 2026-11-03: Lighting (V. 1.57.0, "After Hours")
- New `src/lighting.js` plus settings in `src/data/lighting.js`. A navy darkness layer covers the office, with soft light holes erased at ChatGPT's 63 anchors (lamps, windows, vending, servers, screens), around the hero and around boss chests.
- Additive colored glows: warm lamps, cool screens and servers, with a tiny shimmer on screens.
- It darkens with age: 40% at 40, 55% at 55, 63% at 65 (tuned after the first pass was too faint to see).
- The old gray window marks and light-pool patches are switched off (`replaceFloorMarks`). Damage numbers sit above the dark so they stay readable.
- V. 1.57.1: title sub-views (Shop, Extras, Leaderboard, Achievements, Credits) open as a panel above the employee file, shift and devlog tiles, with the slideshow running behind. The tiles fold (auto on screens under 900px tall). Options docks at the top. The pause hero got its own tile at 3x with the game's real idle timing (slow breathing, then one fidget) instead of a constant fidget. The pixel cursors moved into the shared nav stylesheet, so they work in the game, gameplay and the devlog.
- V. 1.57.2: Post Score works with a controller. It's in the D-pad menu above Quick Retry, and with no saved name it offers office-name badges ("Dave from IT 42"). New **quick poll** on accounts (email magic link, Apple, Google, or no thanks) on the devlog home and post sidebars and in the game's Extras, plus a title nudge. One vote per browser, live totals. Rami approved a new Supabase table `poll_votes` (insert-only for the public key) and view `poll_results` (totals only). The anon role sees 0 individual rows.

## Nov 3, 2026 (3 AM): V. 1.58.0 and a new About page
- Shop perks each have a picture now, plus four greyed "Classified Benefit" mystery slots.
- Shop, Leaderboard and Options open at full length (no inner scroll); the tiles fold into buttons under them. On the main title the tiles sit at the bottom again.
- The accounts poll pops up on the title screen (corner card on desktop, a "One quick question" pill on phones) until you vote or close it. The nav's Play button now says Title Screen.
- About page redesign: poster hero with the pixel portrait, live dev and playtest stats (from the devlog stats file), and link tiles to ramidaud.com, Substack, Discord and Ko-fi.
- ChatGPT delivered the On Break portrait sheets for all three heroes (next: wire them into the pause tile).
- V. 1.58.1: ChatGPT's On Break portraits now play on the pause screen (breathe, then the hero's signature break or a back stretch). About tagline now reads "exploring midlife."
- V. 1.59.0: lighting pass 2 (glowing props light themselves, per-room moods, a sputtering meeting-room panel); phone Shop layout fix (no overlap, no overflow); iPhone audio wake-up. About page got Instagram, Threads, LinkedIn and Rami's live leaderboard record (#4 at 87,293).
- V. 1.59.1: iPhone audio mixes with your music or podcast by default (new Your music setting on the pause screen: Keep playing or Game only).
- V. 1.59.2: fixed TJ's "force field" bug. The enemy route map kept the last run's clock, so on a second run without a refresh it froze where you died and enemies steered away. Same fix for smashable-prop tagging and dust puffs. Unit test confirms the map rebuilds around you in run 2.
- TJ playtest notes (Nov 3 morning): likes the unified design and the "last run" tile. Asked for easier ways to heal (milestone heals, a salad-type drop) and a dev/cheat console for testing. Both queued.
- Rami idea: big "Spotlight" lower thirds (sprite + line or tip) for bosses, new characters and room unlocks. Two mockup styles made for him to pick from.
- V. 1.60.0: dev console for playtesters (TJ's idea). Add ?dev=1 once, then tap DEV or press `: god mode, full HP, any upgrade, jump to an age, call a boss, clear the screen, route arrows. Dev runs never post scores or stats, and achievements stay locked. ?dev=0 turns it off.
- Rami picked **Style B (Spotlight)** for the big lower thirds. Copy brief out to Gemini; build after the copy lands.
- Muse (Meta's agent) joins as the social feedback reader for Facebook and Instagram posts.
- V. 1.60.1: dev mode shows a "DEV MODE · SCORES OFF" badge on every screen. Dev runs were already blocked from the leaderboard.
- New idea from TJ and Rami: **the Interns**, playtesters as office interns who bring heals and buffs and later run a pop-up shop. Added to the Grok healing brief.
- Grok's healing spec landed (birthdays, Desk Salad, Interns, the Lounge). Building it in three steps.
- V. 1.61.0 "Birthday Cake", step 1: at 45, 50, 55, 60 and 65 you get cake (18 to 25% of max health) with the dividend. Elites drop a Desk Salad 45% of the time (guaranteed every 3rd), worth 22% of max health, and it wilts after 14 s. Old pizza and level-up tips corrected. Dev console has a DROP SALAD button.
- TJ sent his intern lines (saved in docs/handoffs/intern-lines.md). Derek's are still coming.
- V. 1.61.1: Derek froze after a boss chest (his run was V. 1.60.1, stuck at 4:22, age 45.8). I couldn't reproduce it, so I added a safety net: if the run stays paused with no menu showing, the game restores the menu or unpauses within 2 s and logs an anonymous "stuck" event so we can find the cause. A chest you touch during a level-up now waits on the floor. Fixed the title settings chip going blank when opened (navy on navy).
- V. 1.62.0 "The Interns" (healing step 2): TJ and Derek walk over with a snack (12% heal), coffee (speed), focus (+15% damage) or a gem run, about once a minute early and every 2 minutes late. No heals above 75% health, none during bosses or the Comfort Zone Tax. Bills scare them off; if you're mobbed they leave it on the floor. Placeholder pixel art; TJ's own lines, placeholder lines for Derek. Dev console: SEND INTERN.
- V. 1.63.0 "The Lounge" (healing step 3): after each promotion (45, 50, 55, 60) an intern runs the Break Room counter for 35 s. Walk up and the game pauses while you shop (6 items, 6k to 28k from your 401(k), prices go up 1k each time you buy one). Crowds close the register, bosses and the Comfort Zone Tax keep it shut, and loitering in the closed Break Room brings company. Dev console: OPEN LOUNGE.
- Title screen now says "You're playing V. x" under the logo, with a "what's new" bubble that shows once per version (tap the line to see it again).
- V. 1.63.1: Credits updated with the AI crew (Claude, ChatGPT/Codex, Grok, Gemini, Muse, Antigravity), the six playtesters, the two interns, fonts and Ko-fi supporters. Edit `src/data/credits.js` to change anything.
- V. 1.64.0 "Happy Retirement": retiring at 65 shows ChatGPT's party art on the win screen (banner, streamers, confetti, cake, swinging gold watch) plus a gift line. "What's new" is now a pop-up in the poll's spot (corner card on wide screens, pill on phones; the poll waits until it's closed). Its styles ship with the code, because Rami's phone showed it unstyled from cached CSS. Fixed the pause menu's Start Fresh label saying age 50 in Midlife.
- V. 1.65.0 "Life Happens": Grok's age 50+ run modifiers (8 of them: Ghost Hour, Reading Glasses, Rent Hike, Empty Nest, Back Spasm, Reply-All Tax, Past Due, Open Enrollment). One at a time, rolled every 2.5 age-years after 50, with a banner and a small chip at the top. They never start during a boss, right after a hit or level-up, or during the Comfort Zone Tax, and the Comfort Zone Tax can't start while one is active. Fast-forward test: Rent Hike at 50.3, Reply-All Tax at 54.8. Dev console can start or stop any of them; ?forceMod=ghostHour for QA.
- V. 1.66.0 "Spotlight": Style B Spotlight cards for boss arrivals, room unlocks (a coworker announces it), the first shift as each hero, and first-time tips (elite, chest, evolution, low health). They don't pause the game, they wait for menus, and you can tap them away. Placeholder interns now match TJ and Derek's looks (beanie and glasses; curly hair, beard and glasses).
- ChatGPT brief for Ben (Cold War Cowboy, IT, loves old tech), TJ and Derek sprites, with JSON prompts: docs/handoffs/chatgpt-friends-sprites.md. The photos stay out of the repo.
- V. 1.66.1: ChatGPT's hand-placed room lights shipped (14 new: exit signs, Lobby elevators, OUR VALUES, Parking Lot headlights and dome light, Synergy projector, Break Room fridge). 112 lights total. Pulled from Rami's local folder because Codex hadn't pushed.
- V. 1.67.0 "The Cold War Cowboy": Ben is a playable hero (unlocked by Required Reading; players who already earned it get him on load). Floppy Disk boomerang (the Remote's cards read Floppy Disk, Double Density and Zip Drive while you play him), +2 max HP, and once a run at a quarter health he reboots: clears nearby small fry and heals 40%. ChatGPT's art for his walk, badge and On Break portrait, plus TJ and Derek's walk and counter sheets. Hero badges are now 2 by 2.
- Devlog Memo 09 "My friends work here now." drafted from Rami's interview answers (draft, not public yet): TJ's bug, the interns and the Lounge, Ben as the Cold War Cowboy, Spotlight cards, and one unified experience. Four new screenshots.
- Memo 09 now opens with a clip of Ben's Spotlight card (still a draft; Rami is happy with the writing). V. 1.67.1 preloads hero portraits so Spotlight sprites don't pop in late.
- Rami isn't happy with the v1 sprites for Ben, TJ and Derek ("they don't match the quality"). Redo brief with a side-by-side comparison: docs/handoffs/chatgpt-friends-sprites-v2.md.
- V. 1.67.2: TJ couldn't find the Lounge. Now a Spotlight card announces it, the arrow stays up the whole time it's open, it stays open 50 s instead of 35, and the Break Room counter has a "THE LOUNGE · OPENS AFTER PROMOTIONS" sign while it's closed.
- Plan (Rami): Memo 10 announces **V. 2** with the full before and after set (title, pause, HUD, level-up, devlog). "Before" shots come from the V. 1.47 build (commit abbcdd9^), run locally.

### Nov 3 (afternoon): new friend art in, Spotlight animation v2 drafted
- V. 1.67.3 is live: ChatGPT's redrawn Ben (v3) and TJ and Derek (v2) are in the game. Checked all four walk directions, idle, badge, On Break portrait, Spotlight and the interns on desktop and phone.
- Drafted a smoother, punchier Spotlight animation: a light beam opens, the band wipes in behind a bright edge, the sprite hops up and lands in a puff, the name drops in letter by letter, the line types itself, and a shine sweeps the band. Proper exit too.
- New recording method: the browser's animations and the game are frozen and stepped 1/30 of a second at a time, so clips come out perfectly smooth.
- Waiting on Rami's OK before the new animation ships (it's shared code, so it changes every card at once).

### Nov 3 (afternoon, cont.): Spotlight v2 shipped (V. 1.68.0)
- Rami said "ship it": every Spotlight card now uses the new animation (beam, wipe, hop and puff, letter drop, typed line, proper exit). Boss cards get a red beam. Checked boss and room cards at desktop, iPad and phone.
- Memo 09: the lead clip is now the new smooth Ben recording, and the crew-badges and Lounge screenshots were retaken with the new friend art.
- Next for ChatGPT: big On Break portraits for TJ and Derek so the Lounge card matches the heroes (docs/handoffs/chatgpt-intern-portraits.md).
- Devlog clips now play like GIFs: no video player bar. Tap the clip or the small pause button to stop it. People who turn on "reduce motion" see it paused.
- V. 1.68.1: the Lounge card shows ChatGPT's new On Break portraits (TJ raises his coffee, Derek snaps a photo). On phones, long names on Spotlight cards now wrap beside the sprite instead of covering it. Checked all 16 cards on desktop and phone.
- Memo 09's title before/after images were remade at true proportions with the real fonts (the phone one was squished).
- Memo 09 published.
- V. 1.68.2: Derek couldn't pick up the Mortgage chest (1.68.0, several runs). Couldn't reproduce here, so chests now slide to you when you're close and open on touch, and the game logs a "chest-blocked" stat if something still stops one.
- Next ChatGPT job: standing Spotlight portraits for the six room coworkers (docs/handoffs/chatgpt-coworker-portraits.md).
- V. 1.68.3: room cards now use the coworkers' own names from ChatGPT's cast sheet (Art, Sam, Eli, Nora, June, Mina) with Gemini's departments, so the name matches the person on the card.
- V. 1.68.4: Derek's own intern lines replace the placeholders ("Unc" included).
- V. 1.69.0: the six room coworkers appear as ChatGPT's big standing portraits on their Spotlight cards. Every Spotlight card now has a full-size animated portrait. Checked all six on desktop and phone.
- V. 1.69.1: the title screen's devlog note shows a one-line summary of the newest memo (new optional `blurb` field in posts.js), and the "What's new" pop-up appears right away instead of after a 1.2-second pause that restarted on every redraw.
- Wrote ChatGPT's key art v2 brief: five new title scenes with the new cast, each in a desktop and a portrait version composed around where the title screen's UI sits (docs/handoffs/chatgpt-key-art-v2.md, with zone guides).
- V. 1.69.2: Spotlight pacing. A 12-second breather between cards, bosses cut in, stale cards are skipped, the Lounge card shows once a run (never right after a room card), and once-ever tips only count as seen when they actually appear.
- V. 1.70.0: ChatGPT's five new title scenes (Group Photo, Off and On Again, The Lounge, Coffee Run, Happy 50th) replace the old slides. Phones and portrait tablets get the separately drawn tall versions. Checked on desktop, 1080p, iPad both ways and phone. The old slides are parked in `retired` in src/data/title-art.js.
- Briefs written: Gemini (first-time tip lines for all four heroes, plus intern, salad and modifier tips) and Grok (difficulty check from 32 post-healing runs: median death moved from 43 to 48; a wall at 60-61 with the Group Chat as top killer; phones about 10 years shorter than desktop).
- V. 1.70.1: your hero's Spotlight card now opens every run with a one-line bio and a play-style line (placeholders until Gemini's copy). Pacing tightened again: 15 s between cards, a boss goes before a same-moment promotion card, the Lounge card never sits next to a room card, and ordinary banners at the bottom wait while a Spotlight card is up (that was the "pairs").
- V. 1.71.0: Gemini's copy is in. Every hero has a line for every first-time tip (Ben included), three new first-time tips (first intern delivery, first Desk Salad, first age-50+ surprise), and new bios and play styles on the hero cards.
- V. 1.71.1: Grok's difficulty check. The age 60-61 wall (about half of recent deaths) came from three firsts on one birthday: the V8 boss, Group Chats and Math Homework. Shipped three of Grok's five fixes: Group Chats soft-intro at 50 and thin out at 60, their pings telegraph longer and fly slower, and the V8 waits longer before its first skid. Holding the slower age-40 start (it conflicts with Rami's Nov 2 "too easy up front") and the phone zoom-out for Rami's call.
- V. 1.72.0: the death screen is now the HR Exit Interview: ChatGPT's defeated hero slumps in a chair while the killer's mugshot gloats ("Taken out by Spam Likely at 43.2"), and Retry plays the hero's shake-off. Also Grok's last two fixes (Rami OK): phones zoom out to 75% to see more of the office, and Bills arrive a little slower at 40.
- Grok's new stats fields are coded but switched off. They need one SQL script run in Supabase (docs/sql/RUNS_DIFFICULTY.sql); Claude's attempt to apply it was blocked by a safety check, so Rami runs it.
- V. 1.72.1: Rami ran RUNS_DIFFICULTY.sql; the new stats fields are on (zoom, screen size, touch layout, boss in the room at death, first Group Chat age, pings that hit, shop ranks). Checked the row shape locally without sending anything.
- V. 1.72.2: new Art Room (the whole cast animated from the real sheets with filter chips, the key art slideshow, a live Spotlight demo, before/after sliders; the old page is now the Workshop). About page opens with "About the game", and Rami's links sit beside his bio. Menu bar is the same height everywhere (the devlog home's was 7 px taller). Refreshed the public play stats (274 runs, 44 players).
- V. 1.73.0: the final boss, The Gold Watch (age 63.5, Midlife). Minute Hand and Hour Hand sweeps (only the leading edge hurts), a 5 AM Alarm with a safe gap at 12, bouncing gears, and three phases (Ticking, Unpaid Overtime, The Last Minute). The office thins out during the duel. Beat it: hands stop at 5:00, tier-5 chest, +35 401(k), "Five O'Clock Somewhere" and a keepsake at the retirement party. Still ticking at 65: you clock out anyway. Grok's numbers, Gemini's words, ChatGPT's art. Dev console has a WATCH button for testing.
- V. 1.73.1: the Gold Watch can't be beaten (Rami's call, like VS's Reaper). Hits wind it back (push + slower hands), it arrives 1.5 years before retirement, phases follow the clock, and reaching 65 stops the hands at 5:00 with the chest, bonus and keepsake. New "Keep The Receipt" badge for clocking out untouched.
- V. 1.73.2: Rami saw his hero's card 3-4 times a run. Those repeats were the first-time tip cards, which showed his hero's name and portrait. Now only the opening card names your hero; tip cards name the topic ("INTERN DELIVERY"), show the hero a size smaller, and max out at two per run.

## 2026-11-03 (evening): V. 1.73.3, title art un-squished on phones
- Rami spotted squished title art on his iPhone. The phone versions of all five key art scenes came from ChatGPT squashed to about 2/3 height (a round soccer ball measured 2:1).
- Stretched each one back by 1.5× and cropped so the cast stays where it was (new `*-portrait-v2.jpg` files; originals kept).
- Moved the portrait crop down a little so the cast clears Punch In on a portrait iPad. Phones are unaffected by that change.

## 2026-11-03 (evening): Memo 09 sliders + Fable brief
- Memo 09's title screen before/afters are now swipe sliders on the devlog, like the Art Room. RSS, Substack and share pages keep the combined image.
- Any post can use it: give the markdown image a title of `compare: img/before.jpg | img/after.jpg`.
- Wrote `docs/handoffs/fable-final-pass.md`, a review-only brief (performance, art, UX) for a fresh-eyes pass before V2.

## 2026-11-03 (night): V. 1.74.0, Fable review Batch A
- Fable (fresh-eyes review) found no blockers for V2; findings are in `docs/handoffs/fable-review.md`. Rami picked Batch A (player-facing quick wins) then Batch B (cheap speed fixes).
- Phones: Quick Retry and Shop are pinned to the bottom of the exit interview, above the leaderboard.
- Title art paints at first load (a static copy of slide 1 in the page, no fade). The hidden lobby image behind the slideshow is gone (-360 KB).
- First-time players skip What's New and the poll. At 65 the finish line reads CLOCK OUT HERE, can't be hit, and alerts wait for the Five O'Clock card (only LOW HP cuts in).

## 2026-11-03 (night): V. 1.75.0, Fable review Batch B (speed)
- three.js (the parked 3D engine) no longer downloads or starts, and the game canvas is opaque now: 600 KB less and one less graphics context on phones.
- The HUD only writes what changed (about 11 writes a second instead of ~20 every frame). Gems over 150 merge into a big red gem; unclaimed coins and pizza blink out after a minute (`FLOOR_LIMITS` in src/data/pickups.js).
- Fixed two Retry leaks (resize listener, leftover Spotlight cards).
- Found while testing: after Quick Retry the old placeholder room shows for ~2 s while the office rebuilds. It was already in the live build; it's Fable #9.

## 2026-11-03 (late): V. 1.75.1, Quick Retry goes straight to the office
- On Retry the office re-unpacked all its art before checking if it already had it; that was ~90% of the rebuild. Now it checks first: rebuild went from ~5.3 s to ~0.5 s in the test browser.
- On Retry the view stays blank until the office is ready, then fades in (0.2 s), so the old placeholder room never shows. 3 s safety net.
- New concept: caching (LEARNING_NOTES and a TEXTBOOK chapter).

## 2026-11-03 (late): V. 1.76.0, Fable review Batch C (phone clarity)
- Crowded screens hide regular enemy name tags (25+ on phones, 60+ on bigger screens; `ENEMY_TAGS` in src/data/enemies.js). Bosses, elites and "typing..." keep theirs.
- Nav buttons are 40 px tall on touch screens. Options puts touch first on phones and hides the parked 3D controls; Extras hides stages that don't exist; Reset Progress has a red outline.
- Sent ChatGPT a brief to redo the five phone title scenes at true proportions (`docs/handoffs/chatgpt-portrait-reexport.md`).

## 2026-11-04: Share button on memos
- Every memo has a Share button next to "Play this build" and a "Share this memo" button after the sign-off, in the devlog and on each memo's own page.
- Phones open the native share sheet; computers copy the link and say "Link copied". The link is the memo's own page, so it shows the preview card.
- Each share is counted in GoatCounter as an event (`share-<memo>`), so you can see which memos get passed around.

## 2026-11-04: "Coldwar Cowboy" (V. 1.76.1)
- Ben prefers "Coldwar Cowboy" (one word). Renamed it everywhere players and readers see it: game, Spotlight card, lore, achievements, patch notes, devlog, Art Room, About and the feed.
- Internal IDs and file names (`coldWarCowboy`, `cold-war-cowboy-*.png`) stay as they are, and old log entries keep the old spelling as history.

## 2026-11-04: V. 1.76.2, sharp phone title art
- ChatGPT redrew the five phone title scenes at true 1080×1920 proportions (`*-portrait-v3.jpg`). Checked them against the desktop art; the Happy 50th party is much bigger now.
- Phones and portrait iPads crop differently, so tablets got their own setting (`focusTablet` in title-art.js). The cast now clears Punch In on both.

## 2026-11-04: V. 1.77.0, Grok and Gemini final passes
- Grok (balance, all 5 picked): Mortgage HP 110→85, Performance Review 45→36, Gold Watch minute hand 70→55°/s, donut slow 1.8→1.4 s, 9-to-5er +2 max HP.
- Gemini (copy, bugs + polish): "Fully Evolved Adult" was impossible (needed 9 of 6 evolutions), now fixed. Added 6 missing end-screen lines, a Gold Watch lore entry, dropped stale boss HP from the lore, removed two brand names, trimmed long tips, clarified two modifiers and the Universal Remote card, refreshed a few death lines.
- Reviews saved in `docs/handoffs/grok-final-pass-review.md` and `gemini-final-pass-review.md`. ChatGPT's art audit is still pending.

## 2026-11-04: V. 1.77.1, "For my MANAGER!"
- The Intern Delivery Spotlight card now shows TJ and Derek side by side, shouting "For my MANAGER!" together (Rami's idea; TJ already had the line).
- Spotlight cards can now show two portraits (`duo` in the tips data). The card has a new seen key, so everyone sees it once.

## 2026-11-04: V. 1.78.0, dynamic lighting + the yellow note
- Lighting pass 3: weapon flashes, enemy glows, boss lights (V8 headlights, a Gold Watch that pulses faster near 65), Derek's camera flash, level-up bloom, loot glow. Presets in `LIGHTING.dynamic` (src/data/lighting.js). Capped at 12 flashes + 10 follow lights.
- Fable's lighting speed fix rode along: darkness at half resolution, one batched draw, off-screen glows hidden, no redraws while a menu is open.
- The rack with the yellow note (src/yellow-note.js): trip its cable in the Server Room for a blackout, red emergency light, enemies on screen freeze while they "reboot", and Eli's card. Once per run, new achievement.
- Bug found along the way: one-off Spotlight cards (FIVE O'CLOCK at 65) counted as tips and could be dropped after two tips. Now they're "event" cards that always show.
- Derek's 579,444 run was rejected by an old 500,000 cap on the leaderboard table. SQL to raise it (and add his score) is in docs/sql/SCORES_CAP_5M.sql, waiting on Rami.

## 2026-11-04: About page redesign
- New order: the game, then a compact live dashboard attached to it, then the personnel file, then a one-line privacy note.
- The dashboard has three small panels (the build, the playtest, Rami's record), a builds-per-day mini chart, a phone/desktop/tablet split bar and the top causes of death. On desktop it's about 280 px tall, down from a full block.
- Personnel file: portrait beside the name, chips and bio, with the links as one row of pills (duplicate Play/Devlog links removed).
- Also confirmed: the leaderboard cap is now 5,000,000 and Derek's 579,444 is on the board.

## 2026-11-04: Derek camera detail correction (Codex)
- Delivered v2 On Break art with a dark camera and readable round lens, plus three preview loops and a 4x comparison.
- Pixel checks preserve everything outside the camera masks, including hands, strap, flash and feet. V1 stays intact.
- Art only, awaiting Claude's portrait-reference switch. Frame map and timing stay the same; no game version bump.

## 2026-11-04: V. 1.79.0, employee file feed + Art Room fixes
- The employee file tile is a small feed: STATUS (last shift, something you can afford), NEWS (this version) and TO-DO (achievement nudges), mixed three to a page with MORE to page through.
- Achievements are one tap from the title: the "x/39 achievements" stat opens the list, and Back returns to the title.
- Derek's portrait v2 (ChatGPT, a real camera) is on his Spotlight cards.
- Art Room (ChatGPT audit R2/R3): the cast filter hides cards again, and the Spotlight sprite no longer picks up the page's .hero styles (no more doubled, stretched portrait or dark box).

## 2026-11-04 (overnight): V. 1.79.1 and 1.80.0, polish + feel
- 1.79.1 polish: title art and kill-screen banners about 3.5 MB lighter (no visible change), four unused fonts dropped, the last off-palette yellows moved to cream/coffee, chest stamp moved to the card corner, tall menus fit under the nav, a bigger Lounge sign, and a "Drag anywhere to walk" first tip on phones.
- 1.80.0: damage numbers in a Silkscreen bitmap font from a pool of 40 (max 6 new per frame), and boss Spotlight cards play their six walk frames.
- Memo 10 (V2 announcement) draft scaffold: five V. 1.47 vs V2 before/after slider pairs (title, gameplay, level-up, pause, death; desktop and phone) in devlog/img/10-*, with [RAMI: ...] spots for your words. Hidden until you publish (draft: true, not in the feed).

## 2026-11-04 (night): V. 1.81.0, chase the interns
- Rami's idea: interns appear on screen with a coffee and run (flee mode on the navigation map, so they go around desks). Catch them for a heal plus a 2-hit shield (20 s); they escape after 15 s, and ease off to taunt you if you fall far behind.
- Every catch tosses a treat with a short premium buff: coffee (+30% speed), burrito (+30% damage), bundt cake (gem vacuum, +50% XP). Derek favors the bundt cake.
- Settings: `INTERNS.mode` and `INTERNS.chase` in src/data/interns.js (`mode: "deliver"` brings back the old hand-off).

## Nov 4, 2026 (late): GOTCHA! catch moment (V. 1.82.0)
- Catching TJ or Derek now slows time for a beat, flashes the screen and stamps in a GOTCHA! card with their portrait and line.
- A mini slot reel spins through coffee, burrito and bundt cake and lands on your treat, with its buff spelled out.
- New sounds: a catch jingle, reel ticks and a landing ding. About 2 seconds, never a full pause.
- On laptops the card sits beside the player so you can still see the action. Tested on phone, iPad and desktop.
- Art brief for ChatGPT written (caught poses, GOTCHA! wordmark, treat icons, card frame, burst).

## Nov 4, 2026 (later): Loadout expansion (V. 1.83.0)
- Seven new weapons (Casserole, Headphones, Office Chair, Reply-All, Out-of-Office, Sticky Notes, Thermostat Wars with freezing) and six new passives, each weapon with its own evolution.
- Slots: 6 weapons and 6 passives, so a run can only hold about half of everything. Rami's goal: make players choose how they like to play.
- Every card has a style badge (Healing, Shield, Offense, Defense). The level-up screen shows your slots and what your build leans toward; the HUD shows filled and empty slots.
- Tested on phone, iPad and desktop, including every evolution. ChatGPT art brief written for icons and in-world sprites.

## Nov 4, 2026 (morning): Ben's "damage for no reason" (V. 1.83.1)
- Ben's 6:27 am run (phone, V. 1.83.0) died to Group Chat at 52 with 195 pings landing on him. The play-stats table pointed right at it.
- Cause: on a phone the Group Chat's 260 px "hang back" distance was exactly the edge of the screen, so it shot from out of sight. The Back Spasm banner was a coincidence.
- Fix: Group Chats keep closer on small screens and only fire while on screen. A "PING! GROUP CHAT" label shows what hit you.

## 2026-11-04: Friendly retirement goal art (Codex)
- Drew a welcoming age-65 punch clock with balloons, presents and a golden card, replacing the reaper imagery for this proposed Midlife-only asset.
- Delivered twelve native poses, two previews and a real-size hero/watch check. The base stays planted and the hands stay at five.
- Art only; Claude still wires it in. Full Life Father Time and gameplay files are untouched.
## Nov 4, 2026 (morning): Accounts groundwork (V. 1.84.0)
- Rami chose email code + Google + Apple, syncing progress and a run in progress. Poll so far: Email 4, Google 2, Apple 1, No 1.
- New Supabase table `player_saves` (Rami OK'd): each signed-in player can only read and write their own row.
- Built the "Clock in" badge on the employee file and the Badge Office screen (email code, signed-in badge, a "two employee files" chooser when this device and the cloud disagree). Tested sign-in, upload, pull from another device and the conflict chooser with a fake server.
- Hidden until Rami finishes `docs/handoffs/accounts-setup.md` (URL settings, code in the email template, an email sender for real players, Google and Apple keys). Test with `?accounts=1`.


## 2026-11-04: Wall and floor kit delivered (Codex)
- Made 60 wall families and ten floor details in three colorways, covering every listed room and the shared office utilities.
- Added modular metadata, nine 2x wall assembly boards, quiet floor preview and native catalog/review. All 210 cells pass pixel/module/seam checks.
- Art only. Claude places pieces and preserves clear routes; no room geometry, spawning or gameplay files changed.


## 2026-11-04: Native coworker bodies and chairs (Codex)
- Finished six seated sheets and six full-body walk/idle sheets, with each room coworker's personal action.
- Added 42 row previews and a 2x comparison against the existing hero and TJ. Corrected Nora's export scale during review.
- Pixel/anchor/pose and GIF checks pass; desktop and phone review pages work. Art only, ready for Rami and Claude to review and integrate.
- Later Nov 4: Rami tested email sign-in (works, via link until SMTP is set up). Set up Google sign-in: Google Cloud project "Midlife Survivors", published, client created, Supabase Google provider on. Added Privacy and Terms pages for Google's branding page. Game button switched on (V. 1.84.3).

## 2026-11-04: Rami's studio redraw (Codex)
- Redrew the studio scene and square headshot using the original face as the likeness reference and the cast as the style reference.
- Added face/hero comparisons, native pixel/palette checks, prompts and a responsive art review. Desktop and phone checks pass.
- Art only, ready for Rami's review; Claude handles the About-page swap. Optional sprite deferred.
- Google sign-in tested by Rami and working. Accounts are live for everyone (V. 1.85.0): Clock in with Google; email sign-in stays hidden until an email sender is set up.

## Nov 4, 2026 (morning): Friendly clock-out at 65 (V. 1.86.0)
- ChatGPT's retirement punch clock replaces the reaper in Midlife mode. It appears near you, stands still with balloons bobbing, and plays its punch-the-card animation when you walk in.
- You can't be hurt while clocking out; the retirement certificate follows. Father Time stays for Full Life at 100.
- Rami's new studio portrait is on the About page and its share card.

## Nov 4, 2026 (morning): Coworkers with real bodies (V. 1.87.0)
- Swapped ChatGPT's native coworker sheets in for the old cropped-portrait sprites: proper chairs, legs and shoes.
- Seated coworkers loop their work poses and do their personal bit every 12 to 22 seconds or when you walk by.
- Water-cooler and counter people stand and walk with direction-facing strides. Checked on laptop and phone.
- Next: the wall dresser (its own session).

## Nov 4, 2026 (morning): The wall dresser (V. 1.88.0)
- New `src/wall-dresser.js` lines every room's visible walls with ChatGPT's wall kit: about 300 pieces, room-themed, seeded so the office looks the same each run.
- Furniture (shelves, cabinets, counters) only goes where it can't narrow a route, doorway or existing prop; otherwise a framed piece hangs there instead.
- Faint floor details (scuffs, coffee rings, tape) are baked into the floor, so they cost nothing per frame.
- Rami's desktop save didn't reach his phone: the play-stats logs showed the desktop's Google sign-in stopped halfway (before accounts went live, the return trip wasn't recognized). Fixed; Rami needs to Clock in once on the desktop and pick "Keep this device".
## 2026-11-04: GOTCHA! catch artwork (Codex)
- Finished playful caught portraits for TJ and Derek, with the dark camera kept readable.
- Added the arcade wordmark/stamp, ticket frame, treat/shine icons and confetti burst, with previews and a phone comparison.
- Native pixel and animation checks pass. Art only, ready for Claude to wire in.
- V. 1.88.1: a "Save your file?" sign-in card now pops up on the title screen for players with progress who aren't signed in (Rami: the badge got buried on iPhone). Not now waits 2 days; No thanks is forever. Retired the accounts poll.

## Nov 4, 2026 (morning): GOTCHA! art, Mom's Spaghetti, intern card every run (V. 1.89.0)
- ChatGPT's GOTCHA! art is live: prize-ticket frame, stamp-in wordmark, burst, TJ/Derek caught loops, treat icons in the reel and on the floor.
- Rami renamed Mom's Casserole to Mom's Spaghetti (new bowl placeholder; ChatGPT's loadout brief updated).
- The interns' Special Delivery card was a once-ever tip, so Rami hadn't seen it in ages. It now shows with the first intern of every run.
- V. 1.89.1: bosses charging into a wall (Performance Review, Midlife Crisis V8) now bounce off with a BONK!, wobble for about a second (hurt pose, no damage), then chase again. Desks still don't stop them. Rami's catch.

## Nov 4, 2026 (morning): Loadout is your call (V. 1.90.0)
- Chests only upgrade or evolve what you carry; no new weapons or passives from chests (Rami: the loadout should be a decision).
- Level-ups that offer a new item get a Skip button above the cards (+2 HP).
- The Lounge card was almost always skipped (it was dropped next to a promotion card). It now waits its turn and shows TJ and Derek together.
- Fixed a false "two employee files" prompt: two cloud saves could finish out of order. Identical files no longer ask.

## 2026-11-04: Expanded loadout artwork (Codex)
- Finished 27 named card icons and seven dedicated HUD icons, plus the four play-style badges.
- Made nine weapon/effect families, including a full chair spin, hollow protection/travel rings and frost in cream/slate. Ten row previews and hero-size checks included.
- Updated the food art and names to Mom's Spaghetti from the revised V. 1.89.0 brief. Native art/GIF checks and desktop/phone review pass. Art only, ready for Claude; no balance or game code changed.

## Nov 4, 2026 (morning): White screen after a level-up (V. 1.90.1)
- Rami's game went white mid-run and the title stayed grey: the browser dropped the WebGL graphics ("context lost"), usually from graphics-memory pressure.
- Now the run saves instantly, a "The office lights flickered" card offers a reload, and the event is counted in play stats so we can see how often it happens.
- Measured: about 290 MB of textures in a run, half of it the baked floor tiles (pre-existing). Trimming that is a good next performance job.
- ChatGPT's loadout art (icons, weapon sprites and effects, spaghetti) has landed; wiring it in is next.

## Nov 4, 2026 (afternoon): Loadout art in, lighter floors (V. 1.91.0)
- ChatGPT's loadout art is live: real icons on the cards and HUD slots (old weapons too), new style badges, and animated sprites for spaghetti, headphones, chair, reply-all, out-of-office, sticky notes, the cold snap and frozen enemies.
- Each office floor kept its own full-size picture in graphics memory. They're now baked into the shared floor tiles: about 293 MB down to 192 MB.
- Rami saw the title load oddly in Safari; waiting on a screenshot. The memory trim may already help.

## Nov 4, 2026: Discord posts
- Rami's Discord now gets posts automatically through three webhooks, kept as GitHub secrets.
- #changelog: one roundup each evening. #devlog: a post when a memo is published, skipping any with [RAMI: ...] placeholders. #stats: a totals-only summary each morning.
- The morning stats task now saves that summary to the repo, and GitHub posts it. The full report still comes to Rami in Claude.
- Tested against a fake Discord, then live. The first stats post and three test posts ran successfully.

## Nov 4, 2026: Title screen scroll fix (V. 1.91.1)
- In a short Safari window, scrolling up on the title snapped back down. Each wheel or trackpad tick was also moving the menu highlight, and the highlight pulled the page back to itself.
- Now the wheel just scrolls when a menu is taller than the window, and hovering with the mouse never scrolls the page.
- V. 1.91.2: the title also opened scrolled down to Punch In (the starting highlight pulled the page to it). It now opens at the top.

## Nov 4, 2026: Discord history backfill
- Posted the whole changelog to #changelog, grouped by day, plus all 9 published memos to #devlog, oldest first.
- It's a one-time run. It won't repeat, and the daily roundup picks up from here.

## Nov 4, 2026: Art gallery for Discord
- Made four share boards from the real game art: the cast, the bosses, the enemies and every office prop.
- GitHub can now post them, plus the five title scenes, to #art-and-ideas (one time each). It waits on Rami adding that channel's webhook as a GitHub secret.
- The gallery is posted to #art-and-ideas. From now on, new art posts itself: adding an entry to the art list and pushing it is enough. No manual step for Rami.
- Memo 11 (Discord) interview answers saved; key art prompt for ChatGPT written.

## 2026-11-04: Full Life and pickup art (Codex)
- Finished the three Full Life bosses with distinct walk, warning, attack and hurt poses, plus matching floor markers.
- Drew a welcoming Father Time with a planted stance and handshake finish, and real floor pickup icons with shine variants.
- Native palette/key/anchor and 20 GIF checks pass. Added manifests, prompts, hero/Bill size board and desktop/phone art review. Art only, ready for Claude and Rami.

## 2026-11-04: Memo 11 mail-bot clubhouse cover (Codex)
- Made the Discord memo cover with Rami, the interns, Ben and friendly couriers sorting updates into five wooden channel cubbies.
- Delivered the wide JPG, a proportional portrait crop and a lossless 2x preview. Both JPGs are under 400 KB.
- Face, labels, palette, crop and desktop/phone checks complete; prompts and export notes saved. Art only, ready for Rami and Claude.

## Nov 4, 2026: Memo 10 filled in, favorite scenes back (V. 1.91.3)
- Rami's interview answers are in Memo 10 (still a draft), plus his five favorite key art scenes, the GOTCHA! catch and Clock in with Google. The range is now V. 1.68 to 1.91.
- Promoted, 11:58 PM, The Long Way and The Swarm are back in the title slideshow (nine scenes) and the Art Room, by Rami's request.

## Nov 4, 2026: iPad size fix and lighter memo layout (V. 1.91.4)
- iPad Safari sometimes kept an old screen size after rotating, so the office filled only part of the screen. The game now re-checks a moment later and every second.
- Memo layout: back-to-back sliders become one tabbed "Then and now" box, "side" pictures sit beside the text, long change lists fold, and any picture opens full size with a tap. Memo 10 uses all of it.

## 2026-11-04: Memo 10, the game coming to life (Codex)
- Made the quiet 3 a.m. living-room cover: Rami, sleeping twins and six tiny cast members stepping out of his laptop.
- Delivered a wide JPG, proportional portrait crop and lossless 2x preview; both JPGs are under 400 KB.
- Likeness, clock, allowed text, native pixels and desktop/phone views checked. Art only, ready for Rami and Claude; the draft is untouched.

## Nov 4, 2026: Full Life bosses and Father Time (V. 1.92.0)
- The HOA President, Retirement Audit and Pickleball Champ use ChatGPT's art, each with its own attack (a charge, rings of forms, sliding loops), plus Spotlight cards.
- Father Time at 100 now waits for you like the clock-out station and shakes your hand. Floor pickups use real pixel art.
- Memo 10 has its key art cover (3 a.m. on the couch with the twins) and fresh screenshots from V. 1.91.4.
- V. 1.92.1: Sticky Notes barely stuck to anything (notes landed randomly around you). Now two notes drop in front of incoming enemies, hold longer, and catch neighbors; in a test, 12 of 14 enemies got stuck in 10 seconds.

## Nov 4, 2026: Sprint mode (V. 1.93.0)
- New Sprint toggle (Rami's Hyper mode idea): years 2x faster, everyone 25% faster, +50% coins. Unlocked by beating the Midlife Crisis V8.
- Same leaderboard, with a ⚡ by Sprint scores. Tested: Midlife takes about 9.4 minutes with Sprint on.
- Memo 10, "This is starting to feel real.", is published (V. 1.68 to 1.93), with a short section on Full Life bosses and Sprint added at the end.

## Nov 4, 2026: V. 2.0
- Rami called it: the game is officially V. 2.0 ("Version Two"), matching Memo 10. It's playable start to finish, has a hero and a mode to unlock, and the art is mostly in.
- From here, updates count up from 2.0 (2.0.1 for fixes, 2.1 for new features).

## Nov 4, 2026 (afternoon): Game plan and Memo 11 draft
- Rami's voice-call plans are in the roadmap: a minimap HUD first, then the hospital and home neighborhood as pickable stages, then iOS and Android apps (before consoles).
- Memo 11, "If that's where community is, that's where I want to be.", is drafted from Rami's voice answers, with his Discord screenshots and ChatGPT's mail-room cover.

## Nov 4, 2026: Memo 11 gallery, new poll (V. 2.0.1)
- Memo 11's four Discord screenshots now sit in one tidy grid of same-size tiles (tap for full size), instead of four pictures of different sizes down the side.
- The accounts poll is retired. New quick poll on the devlog and in Extras: which stage first, the hospital or the home neighborhood?
- Memo 11, "If that's where community is, that's where I want to be.", is published, with a nudge to vote in the new stage poll.

## Nov 4, 2026: The office map (V. 2.1)
- Find the YOU ARE HERE sign by reception once, and a minimap rides in the corner of every run after.
- It fills in as you explore (fog of war), shows doors open or locked, chests, the Lounge, interns and bosses. Tap it or press M for the big paused view.
- Placeholder art for now; ChatGPT has the brief for the frame, icons and the sign. Memo 11 social drafts written.
- Rami sent photos of the real UCM student lounge. ChatGPT brief written: a room kit (futon, coffee table with chess, paper lamp, yellow desk wall, cube shelf, collage wall) and a scene for the top of the Lounge shop.

## 2026-11-04: Minimap art delivery (Codex)
- Finished the clipboard nine-slice, expand/close buttons, eight tiny markers and the two-state standing evacuation map.
- Added prompts, manifest, native/2x hero check, sign GIF, responsive review and asset validator. Exact sizes, twelve-color palette, hard alpha, flat panel center, slice rails and fixed sign foot pass.
- Desktop and 390px phone art previews load cleanly. Art/docs only; Claude wires the minimap assets into the live feature.

## Nov 4, 2026 (evening): Agent reports folded in (V. 2.1.1)
- The office map uses ChatGPT's real art: clipboard frame, pixel markers and a YOU ARE HERE sign with a blinking dot.
- Grok's balance check applied: Sprint coins +25% (was +50%), Sticky Notes damage 2 (was 3), Retirement Audit and Pickleball Champ have less health.
- Gemini Argon's new-player review and Gemini's stage writing are saved in the handoffs for Rami to pick from.

## Nov 4, 2026: Friendlier first shift (V. 2.2)
- From Gemini Argon's new-player review: a shift briefing before the clock starts (hero card plus today's goal, tap to clock in).
- Level-up cards name evolution partners, TJ and Derek wear a green ALLY ring, the very first title shows only PUNCH IN, and Bills wait a bit longer before splitting early on.

## 2026-11-04: Student Lounge room kit and shop scenes (Codex)
- Delivered 11 modular prop families in 15 cells, plus wide/phone shop illustrations of TJ and Derek's room, interpreted from Rami's attached photos without committing the photos.
- Added floor footprints, foot anchors, variant/animation map, full prompts, lamp GIF, native 2x hero check, validator and responsive review.
- Palette, exact magenta, grids, anchors, wall tiling and 3x scene exports pass. Desktop/phone previews load cleanly. Claude owns room/shop integration; art and docs only.

## 2026-11-04: V. 2.3, the Student Lounge and a faster-feeling Sprint clock
- ChatGPT's Student Lounge kit is in the Break Room: futons, paper lamps (they flicker), a mic stand and coffee table on the big rug, the desk run and pumpkin cabinet beside it, and the collage wall, posters and camera shelf behind the coffee cart.
- The furniture is solid and sits inside the walking loop, so no hallway got narrower.
- The Lounge shop opens on the new lounge illustration (wide on laptop, tall on phone).
- Sprint's HUD clock now runs at 2x with a lightning bolt and an orange tick. Sprint was already locked behind beating the V8 and hidden on a first run.

## 2026-11-04: V. 2.3.1, clearer evolution badges
- Rami got "Mom's Spaghetti evolutions" before the weapon and nothing spawned. It was the Meal Prep Sunday passive: its badge said "Evolves Mom's Spaghetti."
- Badges now say "Pairs with ..." on both the weapon and the passive. The real Potluck evolution still needs the spaghetti at Lv 2 plus Meal Prep, and bowls drop fine.

## 2026-11-04: V. 2.3.2, one boss at a time
- Rami: the Mortgage showed up before the Performance Review died, and the chest never appeared.
- Bosses now queue: the next one waits while another is alive (up to 3 years late), plus 8 seconds after a kill. Tunable in `BOSS_QUEUE` (src/data/bosses.js). The Gold Watch never waits.
- The chest had dropped off screen where the boss died. Boss chests now always slide to you.

## 2026-11-04: V. 2.3.3, the chest that wouldn't open
- Rami: the boss chest followed him but never opened. My 2.3.2 slide used a fixed speed (about 300 px/s), and a fast hero who keeps moving outruns it, so it trailed just behind.
- The chest now always moves 160 px/s faster than you and opens within 56 px. Tested at 368 px/s, nonstop running: caught and opened in about 1.5 s.

## 2026-11-04: V. 2.3.4, pairing hints on upgrade cards
- Rami asked whether Ben's Floppy Disk evolves. It does (Zip Drive: 2 Double Density + Comfortable Shoes), but starting heroes never see an Unlock card, so they never got the hint.
- Every weapon upgrade card now says "Pairs with ..." and shows a check mark if you already have that passive.
- Chest safety net: a chest screen that's marked open but isn't showing gets cleared, and it's reset every new run. The chest tip now says the chest comes to you.

## 2026-11-04: V. 2.4, remains and draw order
- Rami's idea: defeated enemies leave scraps in their color that fade after about 9 s (bosses leave a bigger pile). Capped at 60 so phones stay smooth. Tunable in `REMAINS` (src/remains.js).
- Rami: TJ and Derek kept vanishing behind walls. They sat on a fixed low layer; now they sort by their feet like enemies and props. Their tags, the Lounge sign, register tag and arrow are lifted above everything.

## 2026-11-04: V. 2.5, boss defeats
- Rami: a boss froze on screen after defeat. Its drawn picture was being rebuilt for one more frame after the boss was gone, leaving an orphan copy. Fixed with a guard.
- New boss defeat: slow motion, white flicker, topple with dust, fade, three confetti bursts and a stamp per boss. The chest waits 2 s so you see it.
- Regular enemies keep their small pop plus the new remains; a full cinematic for every enemy would be too much in a 300-enemy swarm.

## 2026-11-04: V. 2.5.1, LEGACY tags on the leaderboard
- Rami asked whether today's changes tanked scores. They didn't: runs to the same age and Tax Bracket score the same as before (about 55-67k at age 62, Tax 0-1).
- The board's top spots are age-80 runs from before V. 2.0 (Midlife used to go to 80) plus Tax 5 runs (+75%). Rami chose to tag pre-2.0 runs LEGACY in the game and on the devlog sidebar. Nothing deleted.

## 2026-11-04: V. 2.5.2, comic wall bonks and a gentler "No." on bosses
- Wall bonks: splat and jiggle, a wall crack, circling stars, a pop-in word (two new ones).
- "No." shoved bosses as far as Bills (up to 520 px). Now bosses get 12% of the shove (`bossPushMult` in src/data/weapons.js). Dad Joke and the freezes already went easy on bosses.
- Art requests for remains and boss knockdowns handed to ChatGPT (docs/handoffs/chatgpt-defeat-art.md).

## 2026-11-04: Native defeat art delivery (Codex)
- Delivered 30 sparse enemy-remains variants, seven comic boss knockdowns and the optional blank russet stamp plate.
- Included key/index manifests, JSON generation prompts, 1x/2x hero scale boards, responsive review and validator. No original sheets changed.
- Dimensions, twelve-color palette, opaque magenta, remains budget/distinctness, y148 ground line and stamp stretch edges pass. Desktop and 390px phone art previews are clean; no gameplay or stats runs were made. Claude integrates.

## 2026-11-04: V. 2.6, defeat art wired in
- ChatGPT delivered remains for 10 enemies (3 variants each), seven boss knockdown poses and a stamp plate.
- Enemies now leave their own debris (the tinted scraps stay as the fallback). Bosses flicker, then drop into their knockdown pose with a dust thud, lie there about 1.3 s, and fade. The defeat words sit in the stamp plate, above the boss.

## 2026-11-04: V. 2.6.1, iPhone bottom gap
- Rami saw a gap at the bottom of his iPhone. My iPad resize safety net sized the game to `window.innerHeight`, which iPhone Safari can report shorter than the screen. It now measures the full-screen game box.

## 2026-11-05 Wall bonk art (Codex)

- Exported three native drywall cracks, a six-frame dizzy star loop and a two-frame bird option.
- Checked the crack variants at 1× on tan and teal and included the frame timings and magenta key in the manifest.

## 2026-11-05: V. 2.7, Sleep On It (rerolls)
- Rami asked for a reroll you unlock with effort. Reach 55 in any run (Middle Management achievement) to unlock Sleep On It in the 401(k) shop; each of 3 ranks adds one reroll per run.
- The level-up screen shows a 💤 SLEEP ON IT button next to Skip; it deals three different cards and keeps evolutions.
- Shop items can now be locked behind achievements, shown with a lock and how to earn it.

## 2026-11-05: V. 2.7.1, controller reaches the whole title screen
- Rami couldn't reach everything with a controller. Menu navigation only looked inside the open window, so the top bar (Devlog, Art Room, Discord...) was out of reach, and the Extras poll buttons never joined navigation.
- The top bar is now the top row on the title screen, and poll options join as soon as they appear. Mouse and touch behave as before.

## 2026-11-05: V. 2.7.2, shop badge and a save bug
- The 401(k) Shop button shows NEW for items unlocked since your last visit, otherwise a count of affordable upgrades.
- Found while building it: the save loader kept a fixed list of fields, so newer ones (map found, minimap size, Sprint switch, Gold Watch keepsake) were dropped on every reload. It now keeps everything saved.

## 2026-11-05: V. 2.7.3, score pass, coin tracking, bonk art
- Score (Rami: "all of the above"): boss bonus with a quick-kill extra, retirement bonus 8k to 25k, kill points capped at 400 per year of age, Lounge spending no longer costs score.
- Runs now send coins earned and spent. The database columns still need adding (Rami runs one SQL line); until then the game resends runs without them, so no stats are lost.
- ChatGPT's bonk art is in (cracks, stars, bird). Fixed: north-wall charges stalled without a bonk because physics stopped bosses ~30 px before the bonk check's wall line.

## 2026-11-05: V. 2.7.4, Energy Drink shield
- Rami: the Energy Drink should give a strong shield while you run around. Now every hit is blocked while you keep moving during the drink's 12 seconds; standing still drops it. Cyan aura, TOO WIRED! pops.

## 2026-11-05: V. 2.7.5, Ben's lines and New Hire Orientation
- From the Bulky Boyz chat (Rami's PDF): Ben's dad jokes join Dad Joke when playing the Coldwar Cowboy, 8 Cowboy last words on the death screen, ID10T/PEBCAK notes for Eli from IT. Only PG lines; health, politics and crude bits left out.
- Ben's feedback noted: shop maxes out too fast (matches the coin plan), more cards make favorites harder to find (rerolls help), loved losing the jarring Grim Reaper ending.
- Morning report: 64% of first-ever runs ended before 45. New Hire Orientation: first 2 runs get +2 max HP and 2-HP Bills until 43, explained on the shift briefing.

## Nov 5, 2026: V2.7.6 Lounge-only weapons
- **Mic Drop** (45 coins): drops the mic every 9 s, the screech stuns everything nearby. Encore card upgrades it.
- **Say Cheese** (40 coins): camera flash cone in the direction you face, freezes what's in the shot. Burst Mode adds a double flash.
- Bosses only slow down from both (same rule as the No and the Thermostat).
- The Lounge says "HANDS FULL" if your six weapon slots are taken. Placeholder sprites until ChatGPT's art lands.

## 2026-11-05 Lounge weapon art (Codex)

- Finished the Mic Drop fall, feedback and shockwave, plus the Say Cheese flash and four frozen poses.
- Checked the two 24px HUD icons and the world effects at 1×. The manifest and animated previews are ready for Claude.

## Nov 5, 2026: V2.7.7 Retirement sounds + Lounge weapon art
- Rami retired at 80 (score 201k) and heard hits still playing behind the end screen. Now the end screen hushes all game sounds; menu clicks still work.
- Retiring plays a fanfare, then a slow original "victory lap" tune loops under the screen.
- ChatGPT's Mic Drop and Say Cheese art is in: tip-over mic, feedback squiggle, shockwave ring, camera flash frames, pose stickers and HUD icons.
- Next idea from Rami: a retirement party animation with coworkers celebrating (needs art).

## 2026-11-05 Retirement party strip (Codex)

- Delivered a wide and a phone layout of six cheering guests around the retirement cake, with eight frames per loop.
- Checked both at native size, including the falling confetti, party horns and Eli's streamer pop. Claude handles the win-screen placement.

## Nov 5, 2026: V2.7.8 Retirement party crowd
- ChatGPT's party animation is on the HAPPY RETIREMENT screen: six guests cheering around the cake.
- Wide strip on laptops, two-row version on phones; still frame when "reduce motion" is on.

## Nov 5, 2026: V2.7.9 Real music
- Rami made 17 takes in Google Flow Music. Claude picked one per slot, evened the volume and stripped the embedded cover images (about 14 MB total).
- Music follows the game: title theme, office calm/busy/chaos by age (50 and 58), boss music while a boss is up, Lounge groove, retirement party.
- Level-up and game-over stings come from Rami's tracks. The old code groove stays as a backup if a file can't load.
- Takes and volumes live in `src/data/music.js`, so swapping a take is a one-line change.

## Nov 5, 2026: V2.7.10 Paul's review: steady walk + Sprite Board
- Paul McKinney (art director, UCM) reviewed the game: the hero glides, legs don't alternate, pixels pop in idle loops. He recommended *Shovel Knight* (Boss Fight Books) and Miyamoto's 1-1 video.
- Walk frames now play on a steady 95 ms clock instead of by distance moved.
- New Sprite Board (`tools/sprites.html`): all 57 animated sheets at game speed, nearest-neighbor, with onion skin and a CHANGED PIXELS view. It confirmed the legs never swap in side and back walks.
- ChatGPT brief out for walk rows that alternate (`docs/handoffs/chatgpt-walk-cycle-fix.md`). A full hero polish round is planned near the end.

## 2026-11-05 Hero walk cycle repair (Codex)

- Rebuilt all 16 directional walks so each leg takes a turn leading and the arms swing against the stride.
- Reused the head and shirt pixels with a one-pixel dip on the down beats. The Sprite Board confirms the movement stays on the limbs between dips.
- Saved the original idle rows in the new sheets and included previews. Claude wires the updated art into the game.

## Nov 5, 2026: V2.7.11 New hero walk cycles
- ChatGPT redrew all four heroes' walks from Paul's notes: legs alternate in every direction, arms swing opposite, 1 px bob, heads steady.
- Wired into the game and the Sprite Board. Paired with V2.7.10's steady 95 ms clock.

## Nov 5, 2026: V2.7.12 Sound-effect loader
- Rami picked the order: sound effects, coin balance, first-minute pass, new stages.
- Each game sound can now use a file from `assets/audio/sfx/` (list in `src/data/sfx-files.js`); missing files keep the old beep.
- New sound slots: wall bonk, Mic Drop, Say Cheese camera, bonus chest. Waiting on Rami's ElevenLabs files.

## Nov 5, 2026: V2.7.13 Real sound effects
- Rami made 20 takes in ElevenLabs. Claude picked one per sound by how fast it hits, trimmed the silence, evened the volume and shortened the ones that repeat often.
- Ten are live: paper rip, XP gem, hurt, boss arrive, boss down, wall bonk, Mic Drop, camera, chest, phone ring.
- Hit and coin added in V2.7.14, so all 12 effects are real recordings.
- V2.7.15 (Rami's idea): sounds with several takes rotate between them, never the same one twice in a row (boss arrive and boss down have 4 takes, wall bonk 3, Mic Drop and XP gem 2).

## Nov 5, 2026: V2.7.16 Coin ledger (balance step B, part 1)
- Data: maxing the whole shop costs 1,560 coins, regulars hit 36 ranks in 11-40 runs, and a run to 63 earned 1,195 (77% of the shop). Rami's retire-at-80 run earned 15,113.
- Coins come all at once late in a run; runs that end before 45 earn about 1.
- Added a coin ledger (by source) on the end screen in dev mode to find what pays out late. Balance proposal sent to Rami for approval.

## Nov 5, 2026: V2.8.0 New coin economy (step B)
- Rami OK'd the four-part fix. Paycheck: 3k per year survived, shown on the end screen.
- Late coins taper from 55 (5% a year, floor 30%); the leaderboard still counts the full amount.
- Lifestyle inflation: +8% per rank owned. Maxing the shop goes from about 1,560 to about 4,900 coins; refunds return everything.
- All numbers live in `COIN_ECONOMY` (src/data/meta.js). Tune after Rami's dev-mode ledger run.

## Nov 5, 2026: V2.8.1 Mix pass + Classic Beeps
- Rami: the new audio is "seriously overwhelming". Music dropped to about a third of its volume; constant sounds (hits, rips, gems, coins) are quieter and capped at 2-3 overlapping copies.
- Level-up fanfare at most every 20 s. New Pause > Sound style: STUDIO or CLASSIC BEEPS (the original sounds).
- Lounge plan approved: a Lobby pop-up cart for the first 60 s (Lounge weapons + run perks); Break Room counter keeps heals and buffs.

## Nov 5, 2026: V2.8.2 Day One Lounge cart
- For the first minute of every fresh run, a Lounge cart parks in the Lobby next to where you start.
- Sells Mic Drop and Say Cheese (while you still have free slots) plus two whole-run perks: Ergonomic Cushion (+2 max HP) and Good Beans (+8% speed).
- The Break Room counter after promotions now sells only heals and quick buffs. Settings in `INTERNS.lounge.cart`.
- V2.8.3: Mic Drop trimmed to the drop and thud (no squeal); Spam Likely's ring replaced with a soft phone-on-desk buzz.
- V2.8.4: level-up fanfare cut to about 1 s; new Break Room counter item Emergency Contact (60k): one extra revive this run (stacks with Second Opinion).
- V2.8.5: Emergency Contact moved to the Day One cart at 100k (Rami).

## Nov 5, 2026: V2.9.0 First Day (step C, the first-minute pass)
- Data: 39% of first runs ended before 42, often 12-15 hits in under 40 s (people standing still), mostly on phones. Runs 4+: only 7%.
- The shift clock waits for your first step, with a device-aware move hint. Teacher Bills (first 3 runs, first 20 s) come one or two at a time from ahead.
- First kill: big PAID! plus "your coffee fires on its own"; first hit: "keep moving". The cart hides when you can't afford anything.
- Settings in `src/data/first-minute.js`. Success check: first-run "dead before 42" from about 35% to under 15%.
- Also: Sprite Board got Paul's magenta/green/any-color backdrops and all-cards pose buttons. Magenta exposed see-through holes in the coworker sprites.

## 2026-11-05 Coworker pixel cleanup (Codex)

- Filled the see-through spots and steadied the faces, outfits and chairs of the six office coworkers.
- Working stays below 5% changed pixels and standing idle below 4% on every transition. All four walks now alternate feet.
- Added v2 sheets, previews and before/after counts for Claude's integration.
## Nov 5, 2026: V2.9.1 Hustle Bonus + Burning the Candle (Kevin's idea)
- Kevin (Discord, Rami's high-school friend): income tied to hustle, then the script flips at 55-60 with "medical bills from all those energy drinks".
- Before 55: distance walked and office areas visited add a Hustle Bonus to the paycheck (cap 60k).
- From 55: nonstop movement fills a candle meter under your health (about 45 s), standing still drains it fast; full = a tougher pink Medical Bill whose hit costs a 5k copay. Energy Drinks add a big chunk.
- Settings in `src/data/hustle.js`. Next: fiscal-year seasons with an optional Corporate Buyout.
- V2.9.2: ChatGPT's coworker cleanup wired in. Measured: working loops 30-46% → about 2% changed pixels, idles 46-74% → under 1.1%, holes → 0.

## Nov 5, 2026: V2.9.3 Fiscal-year seasons + Corporate Buyout (Kevin's idea)
- The board shows the current fiscal year by default (FY2 = from Nov 4, Version Two), with a SHOW ALL-TIME toggle. No database change: it filters by date.
- Once per fiscal year, players with shop ranks get an optional Corporate Buyout memo: ranks cashed out at 50% of what they spent, plus a BOUGHT OUT tag on that year's board. The cursor starts on KEEP.
- New fiscal year = add a line to `SEASONS` in src/data/leaderboard.js (plan: Fiscal Year 3 with Version 3.0).
- V2.9.4: fixed magenta boxes behind the coworkers (v2 sheets had a solid magenta background). Sheets converted to transparent, and the coworker loader now keys magenta itself.

## Nov 5, 2026: V2.9.5 Hidden Lounge cart + buyout once per account
- Rami: the buyout memo showed on every signed-in device. It now waits for the cloud save first (up to 20 s), and a memo open on one device closes itself when you answer on another.
- Rami: he'd already shopped at the cart before its card appeared. The cart now hides in one of six far corners of the Bullpen or Lobby (at least 1,200 px from the start), open for the first 2 minutes, with no arrow.
- Its spotlight card: "SOMEWHERE ON THIS FLOOR · THE LOUNGE CART. Start exploring! TJ parked a cart of treats you can only get in the first 2 minutes of your shift." The Break Room counter keeps its own card.

## Nov 5, 2026: V2.9.6 Playtest fixes from Rami's voice memo (iPad + controller on the TV)
- Cart: Lobby spots only, checked reachable (one old spot was in the locked manager's office).
- Spotlight cards now wait for message banners too, and the cart skips its banner. Second Opinion freezes the moment with BACK ON YOUR FEET instead of a late banner.
- Bonus Approved card keeps a fixed size; the Mortgage ring's "%" in a gray box is now a clear SAFE tag that never gets left behind; Desk Salads pop out with a label.
- Spam calls: soft two-note marimba chime in A. iPad + controller: a TAP TO TURN ON SOUND button when audio is still off.
- Next: the controller pass (title order, shop grid, scrolling end screen and pages, shortcuts, map button). Design notes: Mortgage and Midlife Crisis may fit the neighborhood stage better.

## Nov 5, 2026: V2.10.0 Controller pass
- Menus use spatial navigation: a direction goes to whatever is visually that way; nothing there scrolls the page. Fixes the title jumping, PUNCH IN reach (now the starting spot), the shop grid (past Second Opinion) and scrolling the Shift Ended screen.
- Y on the title screen opens the 401(k) Shop (it used to redraw the menu for the parked 3D views). Select opens the office map in a run (it used to double as Pause).
- Devlog, Art Room and About pages work with a controller (D-pad/stick moves, right stick scrolls, A opens, B goes back). The current page's tab looks pressed in and is skipped.
- Big screens and 4K TVs skip the blurred menu backdrop (likely cause of the laggy feel when mirrored to the TV).

## 2026-11-05 Medical Bill and Lounge Cart art (Codex)

- Drew a hospital invoice in a pink gown with a clipboard and a compact HUD icon.
- Drew a rolling cart with an orange striped awning, a steam loop and four closing poses.
- Checked the transparent RGBA sheets and preview timing. Claude wires the assets in.
- V2.10.1: ChatGPT's Medical Bill (gown, 8-frame walk) and Lounge Cart (steam loop at 2x, awning folds when it closes) wired in. Transparent PNGs this time, no magenta issues.

## Nov 5, 2026 (evening): traffic stats and the "this is me" switch (V2.10.2)
- Read the first GoatCounter week: 206 game visits, about 2 in 3 started a run, half reached 45. Most players are on iPhones. The Taiwan traffic is Ben.
- New `?me=1` link: turns off GoatCounter for that browser and shows the device's player ID so Rami's runs can be left out of the stats (`docs/stats-exclude.md`). `?me=0` undoes it.
- Art audit: about 11 code-drawn pieces left in the office (XP gem, 401(k) coin, pizza, Desk Salad, boss chest, coffee splash and 5 weapon projectiles). The ChatGPT brief is ready.
- Decided no "read to the end" event for the devlog.

## 2026-11-05 Pickups and projectiles (Codex)

- Drew six office pickups and five projectiles with matching shine or motion frames.
- Checked the gem at 16 px on office carpet and verified exact RGBA transparency and palette across all three sheets.

## Nov 5, 2026 (night): pickup and projectile art (V2.10.3)
- ChatGPT's three new sheets are in the game: XP gem, 401(k) coin, pizza, Desk Salad, boss chest, coffee splash, and the Remote, Floppy, Spreadsheet, Podcast and Thermostat projectiles.
- The art drops into the old sizes, so hitboxes and balance didn't change. The Remote and snowflake got a little more room.
- The shine/motion row isn't animated yet. That's an easy follow-up if the idle art feels flat.
- Stats: Rami's Mac, iPad and iPhone are on the exclude list (94 of 473 runs were his).

## Nov 5, 2026 (late): 3 AM Thoughts weave (V2.10.4)
- Tip from a Facebook commenter: enemies should move differently so you can tell them apart by motion when 200 are on screen.
- 3 AM Thoughts now drift side to side (about 18 px each way, a bit under one swing per second) while Bills march straight in.
- The drift is only sideways, so they reach you just as fast as before. Tune it with `weaveHz` and `weavePx` in `src/data/enemies.js`.

## Nov 5, 2026 (late): leaderboard name filter (V2.10.5)
- Kevin's tip on Discord: the leaderboard needs a language filter before it gets popular.
- Swears, slurs and hate terms are blocked at Post Score ("HR flagged that name"). Number swaps like 5h1t and stretched spellings are caught. Mild pun names like Semore Butts are allowed (Rami's call).
- With Rami's OK, Supabase now refuses blocked names on both leaderboard tables too, so posting straight to the database won't work. All existing names passed.
- If a bad name ever gets through, the board and devlog show "Anonymous Retiree" instead. The word lists are in `src/data/name-filter.js`. Changing them also needs the database copy updated.

## Nov 6, 2026: Memo 12 published, devlog upgrades
- Published Memo 12, "Restless. Also, who's actually playing?": a stranger's tip, Paul's review, Kevin's ideas, the first soundtrack, and a reading list.
- The devlog got audio players, book covers, pixel drop caps, desktop social buttons, an Apple Music playlist card, and "What changed" moved to the side column on every memo.
- The Sprite Board now has the site's top bar and links back to the Art Room.
- Every memo gets a 4:5 social image automatically. Memo 12 also has a 5-slide carousel (two animated) and a 16-second Reel.

## Nov 6, 2026 (evening): our own address, midlifesurvivors.com (V2.10.7)
- Rami bought midlifesurvivors.com at Porkbun ($11.81 a year, same price to renew) and pointed it at GitHub Pages (four A records plus a www CNAME).
- Before switching, guests on the old address now see a "We're moving" note asking them to clock in, because progress saved only on a device can't follow the move. Signed-in players lose nothing.
- Supabase sign-in now accepts the new address, so Google sign-in will land in the right place.
- Still to do on switch day: set the custom domain in GitHub's Pages settings, turn on HTTPS, change Supabase's Site URL, and point devlog links at the new address.

## Nov 6, 2026 (evening): Kevin's visibility notes (V2.10.8)
- Pizza and Desk Salad are about 40% bigger, with a soft glow and a slow "breathe," so heals pop on high-resolution laptops.
- Group Chat shots are bigger (22 px, was 14) with a pulsing orange ring. Their hitbox didn't change.
- Still on Kevin's list: an "Active effects" list in the pause menu, a real butterscotch in the Executive Wing, and an original instant-message sound for pings.

## Nov 6, 2026 (night): midlifesurvivors.com is live (V2.10.9)
- The site now deploys with our own GitHub workflow (faster, smaller upload) and lives at midlifesurvivors.com. Old links forward automatically.
- Devlog, feed, share cards and Discord links point to the new address. RSS item IDs stay on the old one so readers don't see repeats.
- Rami's call on saves: guests start fresh (browsers keep saves per address). A one-time "WE MOVED" note on the title screen explains it, apologizes, and offers Clock in for signed-in players.

## Nov 6, 2026: V2.10.10, active effects in the pause menu
- Kevin's idea: the pause menu's RIGHT NOW list now shows the current life event (Ghost Hour, Rent Hike, Reply-All Tax...), what it does, and years left.
- The event tag on the HUD now hides when any menu is open, so it no longer covers the pause title.
- Next from Kevin's list: the Executive Wing butterscotch, then an original instant-message ping.

## Nov 6, 2026: V2.10.11, June's butterscotch
- Kevin's idea: a candy dish (ChatGPT art) now sits on the Executive Wing credenza, right where June from Legal said it would be.
- Walk up to it for +3 HP and a rotating line from June. It looks empty for a year (45 seconds), then restocks.
- The credenza's caption now mentions "the good butterscotch."
- Message ping: Rami didn't like the ElevenLabs takes; three code-made pings are out for him to pick from.

## Nov 6, 2026: V2.10.12, updates show up faster
- Rami noticed updates took 10+ minutes to appear. The deploy itself only takes about a minute; GitHub Pages lets browsers keep the main page for 10 minutes.
- The game code was already fetched fresh, but the page itself (layout and styles) could be stale. Now the page checks itself against the fresh code and reloads once if it's out of date.
- Claude now waits for the deploy to finish before saying an update is live.


## Nov 6, 2026: Flow character kit
- Rami wants animated cut scenes (title screen and in-game) made in Google Flow, using its character builder for consistency.
- Built `art/flow-kit/`: one clean, crisp reference image per main character (4 heroes, June, TJ, Derek, 4 enemies, 3 bosses), plus a description for each and a first title-loop prompt. Copied to Rami's Mac.

## Nov 6, 2026 (late): merch side quest with Kevin
- Rami floated 3D-printed character figurines as a Ko-fi incentive on Discord. Kevin offered his single-filament printer and laser engraver, and asked for full-resolution sprites (Bill first).
- Claude pulled the sprites from the Mac, keyed out the magenta background (the game strips it at load, so the sheets still have it), and built merch packs in `art/merch/`: Medical Bill (the one Kevin asked for; it is a separate enemy from regular Bill, caught by Rami), Bill, plus the 9-to-5er, Soccer Dad, Grad Student and Cold War Cowboy. Each has native, 8x, 16x, silhouette and a README with palette and thin-part notes.
- Decided: keychains, magnets and stickers first; figurines later. Merch to-dos added to ROADMAP, idea logged in GAME_DESIGN.
- Concept for Rami: a 3D printer needs a mesh (STL or 3MF), and the easy path for pixel art is a voxel standee where every pixel becomes a cube. Nothing generated yet; Kevin is handling the modeling.


## 2026-11-07: Empty Flow backgrounds (Codex)
- Created day and night reference plates for ten office locations, twenty 1920×1080 PNGs in total. Clear middle floors leave space for characters in Flow.
- Added the contact sheet, prompts, manifest and review page under `art/flow-kit/backgrounds/`. All image checks and desktop, phone and tablet preview checks passed.
- Background set ready for Rami's review. Character portraits wait until that review. No game changes or version bump.

## 2026-11-07: First clean Flow cast batch (Codex)
- Delivered twelve illustrations for the four heroes, TJ and Derek, with two poses each on flat cream. The contact sheet and identity comparisons are ready for Rami's review.
- Fixed the two night-floor color issues and added orange headers to the Server Room note in both lighting versions, following Claude's review.
- Character and background exports passed native checks and desktop, phone and tablet review checks. June, enemies and bosses wait for the next batch. No game changes.

## Nov 7, 2026: live-scene test page (plan step 1)
- Rami approved the live-scene plan: still background plates with the lettering painted in, plus small sprite strips that swap poses, instead of AI video or moving cutouts.
- Step 1 is a standalone test page (tools/live-scene.html) playing Grok's chase prototype in that format. No game code changed.
- Result: 522 KB for the whole scene versus 1.45 MB for the 4-second MP4, about 0.1 ms to draw each pose change, and reduced motion shows one still picture.
- Reviewed ChatGPT's first six clean portraits: approved.

## Nov 7, 2026: buttons feel like buttons
- Rami asked for hover and click states on the devlog's Read the memo button and the nav bar.
- Buttons now sit on a dark raised edge, lift 1 pixel and brighten on hover, and press down when clicked. The Read the memo button reacts when you hover anywhere on its memo card.
- Turned off for people who have reduced motion on.

## Nov 7, 2026: V2.10.14, desk gaps, buzz, easter-egg achievements
- Rami got wedged between two Marketing desks. The gaps between pod desks were 56 px and the hero is 48 px wide, so you could squeeze in and get pinned. All 10 gaps are now blocked.
- Spam Likely buzzes again (Rami: the chime was "not as bad as the ringing, not as good as the vibration").
- New achievements for easter eggs: Help Yourself (June's butterscotch) and Caught In The Act (catch TJ or Derek). The yellow note already had one.

## Nov 7, 2026: V2.10.15, Early Bird Special
- Rami wants achievements for all the easter eggs except the Seymore Butts name.
- Added Early Bird Special: buy anything from the Day One cart.
- The Supply Closet hidden room is only planned in the map data, not built. It needs its own design and art before it can have an achievement.
- V2.10.16: the Game Over screen has a Back to Title Screen button under Quick Retry and the 401(k) Shop (Rami's request).
- Supply Closet designed (docs/plans/supply-closet.md): opens at 50 Bills paid in a run, sits between the Lobby and Server Room behind the FILES cabinet, and rolls a random supply each run (chest, nap spot or stash). ChatGPT art handoff written.
- Supply Closet changed (Rami): it's a secret back hallway from the Server Room to the Executive Wing, opened by a new easter egg: stand at a glitchy badge reader for 5 seconds without getting hit.

## Nov 7, 2026: V2.10.17, Supply Closet step 1
- The secret back hallway is in: from the Server Room's east wall (just below the OFFLINE rack) to the Executive Wing's west wall.
- Stand on the plate by the blinking badge reader for 5 seconds without getting hit and both doors slide open. Getting hit starts the timer over. First time ever: "Please Don't Tell IT" (5k).
- Eli from IT's card at 50 now ends with the hint. Placeholder doors, reader and decor until ChatGPT's art arrives. No enemies spawn inside.
- Next: step 2, the random supply (chest, nap spot or stash).

## Nov 7, 2026: V2.10.18, Supply Closet step 2
- When the closet opens, it rolls one supply for the run: a small bonus chest, a nap spot (stand still inside to heal 1 HP every 2 seconds), or a stash (3 coins and a Leftover Pizza).
- Each one gets its own lower-third line a few seconds after "Badge accepted."
- The dev console has an OPEN CLOSET button for testing.

## 2026-11-07: Live title layers and Supply Closet art (Codex)
Saved the registered 11:58 PM title plate, eighteen animation frames and contact/check files. Finished Supply Closet props and the updated badge-reader/utility-door entrance, with previews and manifest. Art only; integration remains with Claude.

## Nov 7, 2026: V2.10.19, Supply Closet art
- ChatGPT's closet kit is in: sliding utility doors at both ends, the blinking badge reader and floor plate, two shelves, a chair, the lost-and-found bin, a mop bucket, three flickering bulbs and a concrete floor.
- The closet's front wall is now a low knee wall so the narrow hallway floor stays visible.
- Props have MEMO captions when you walk by. The old drawn shapes are still the fallback if the art fails to load.

## Nov 7, 2026: 11:58 PM title scene on the test page
- ChatGPT's late-night art is built into the live-scene format: an empty-room plate plus five layers (worker, steam, monitor, note, Bill), 8 poses a second, an 8-second loop.
- 500 KB for the whole scene, versus 843 KB for the AI video, and about 0.1 ms per pose change. The clock and the note never move.
- Try it at midlifesurvivors.com/tools/live-scene.html. It is not on the real title screen yet; that is plan step 3 once Rami has watched it.
- Rami OKed two things for the planned Part-Time Job stage: he can be its playable hero (CLAUDE.md updated), and real Apple lore and inside jokes are welcome (names, logos and exact product designs stay genericized).

## Nov 7, 2026: V2.10.20, the 11:58 PM title scene is live
- Rami watched the test page and OKed it. The 11:58 PM slide on the real title screen now plays the live scene: breathing, blinking, sipping, steam, monitor flicker, the note corner and Bill stomping.
- That slide no longer does the slow push-in, so the camera holds still. The scene pauses when the slide fades out or a run starts, and reduced motion keeps it a still picture.
- New engine file src/live-scene.js (shared with the test page). Scene files live in assets/title-screen/live/late-night/play/.

## 2026-11-07: Flow batch 2 and boss-intro art (Codex)
- Finished June, six enemies and three bosses, two clean portraits each.
- Built the seven registered Performance Review intro layers on the unchanged Bullpen day plate.
- Both review pages passed desktop, phone and both tablet orientations; native checks passed. Runtime integration remains with Claude.

## Nov 7, 2026: Performance Review cut scene on the test page; portrait batch 2
- ChatGPT delivered the 7 Performance Review frames. Built into the live-scene format: 297 KB, 4 seconds, on the test page (tools/live-scene.html, third button). Not in the game yet.
- Portrait batch 2 (June, all enemies, all three bosses, two poses each) is in. The whole Flow cast now has clean portraits.

## Nov 7, 2026: Close Call visuals, quieter first minute, stats check (V. 2.10.21)
- From Grok's playtest: Close Calls now leave a short trail of afterimages, the popup is bigger, and the first one ever explains itself.
- The opening is quieter: the "weapons fire on their own" tip no longer repeats the first-day line, and the Bill tip is folded into the Late Fee tip (shown when a Bill actually splits).
- Stats (read only): Rami's runs average about 210 kills per in-game year after 55; other players about 490, Ben about 720. Lower kill rate means lower level (16 vs 20 to 25) by the 50s, which is where Rami's runs fall apart.
- Cut scene test: the review frame with the loose shoe is skipped, and phone view now letterboxes instead of cropping.
- Deploys failed three times (GitHub Pages stops at 10 minutes, whatever the setting says). The upload now skips about 42 MB of art source folders no page loads, and the next deploy went through.

## Nov 7, 2026: loadout in run stats, cut scene beats (V. 2.10.22)
- Rami OKed a "build" column: run stats now send the weapons and passives held at the end. The game sends it now; the database column still needs adding (one SQL line, Rami runs it or approves it), and runs save fine without it.
- Cut scene test page: 7 extra beats you can switch on and off (title card, printer, monitor flicker, clipboard stamp, stomp dust and shake, sweat drop, caption). All drawn in code, no new art.

## Nov 7, 2026: Memo 13 drafted, the music memo
- Interviewed Rami by voice on a drive to Costco. Memo 13 ("Music is one of the most important side characters.") is drafted in his words: David Byrne's My Madness as the opener, the school run with Abe, seven songs from the Apple Music playlist with a story each, and an open ask for help with the game's soundtrack.
- It's a draft (`devlog/?drafts=1`) until ChatGPT's cover comes back (the school run, prompt in `devlog/art/prompts/13-key-art-chatgpt.txt`) and Rami gives it a final read.
- Corrected Rami's description in every art brief: olive-skinned Palestinian male, bald. The old briefs had it wrong.
- New to-dos: Spotify playlist, an Abdel-tracks option, Ben's note on the original music, and a Paradise-style Instagram reel.
- Memo 13 cover is in: ChatGPT's school-run scene (seen from the back seat, left-hand drive this time).
- Each song in Memo 13 now has Apple's own mini player under its paragraph (album art plus a preview), 8 in all. Nothing copied into the repo. Nick Shoulders' song title corrected to "Appreciatecha".
- Memo 13: the Paradise music video (YouTube, privacy-friendly embed) now sits under the Paradise player.

## Nov 7, 2026 (evening): Darvin's notes on Memo 13
- Darvin liked the reading bar, the song players, the citations and the people; disliked "The X" headers, the AI sepia cast and too much text around the memo.
- Headers now use Rami's own lines. Memo pages keep only "What changed", "Next up" and the follow links; everything else stays on the devlog home page.
- The cover's yellow haze is cooled by hand. Future ChatGPT art asks for neutral color (docs/handoffs/chatgpt-art-notes.md).
- New: a "Your to-do list" on the roadmap page and in ROADMAP.md.
- Rami preferred the full side column, so it's back. On computers, each side card now sits dim and lights up on mouse-over (phones and tablets show it normally).

## Nov 7, 2026 (night): memo page redesign, every memo
- Headline now sits once, on the key art, which runs across both columns with a slow drift and a navy fade. No more repeated title strip.
- The memo and the side column start on the same line, below the art, with room under the nav.
- Reading type: shorter lines (62 characters), 19px text, a bigger first paragraph, section headers with an orange bar.
- Song players and videos sit centered in their own darker card with a small LISTEN or WATCH label.
- The Spotify playlist link is in Memo 13 and the side playlist card. Share pages got the same hero.
- Depth: on laptops the memo sits raised with a soft shadow, and the side column sits recessed below it.
- **Memo 13 published** (Nov 7, Rami's OK).
- Memo 13 social kit: a 5-slide carousel and a 20-second Reel cut to the beat of the game's chaos track (moving art, word-by-word headline, playlist cards on the beat, the live 11:58 PM scene, the ask).

## Nov 8, 2026: Meshy proof of concept
- Kevin took the merch sprites and ran them through Meshy Pro's "Storybook" template with no extra prompting. The Medical Bill model (`art/merch/3d/Meshy_Med_Bill.glb`, 685k faces, 4K texture) reads as the character: crumpled bill head, pink gown with the red cross, clipboard, bow on the back. Rounder and more Disney than the game, but a very strong first pass.
- Kevin then had Meshy's agent build a reusable template, "sixteen-bit-to-voxel-3d": a GPT image step that reinterprets the sprite as an isometric voxel concept, then Meshy's Smart Topology to mesh it at ~3,000 faces. He thinks four source views and more style rules would get it close. Kevin offered his Meshy credits and login so Rami can learn the tool; Rami wants to collab on it.
- Claude checked the GLB: one mesh, not watertight (normal for AI meshes; needs a Blender or Meshy remesh pass before printing), about 1.4 x 1.9 x 1.0 units. The 4K texture is a fragmented atlas, so painting it by hand is impractical; retexturing from the sprite palette is the better route.
- Rami's reaction: "I did not expect it to be that good." Next: get it closer to the pixel feel, try it in Blender.


## Nov 8, 2026: catch-up XP (V. 2.10.23)
- Rami added the `build` column, so run stats now record each player's final loadout.
- Catch-up XP: when you're 2+ levels behind the typical level for your age (from real runs), gems give +12% per extra level behind, up to +60%. At 59 and level 15 that's +50%; on pace, nothing changes.
- All the numbers live in `LEVELING.catchUp` in `src/data/pickups.js` (set `on: false` to turn it off).

## Nov 8, 2026: evolution hints, Group Chat pop (V. 2.10.24)
- Rami's two runs on 2.10.23: the 50s feel good; near 60 still feels insane. His build data showed why: six weapons, three with their passive in place, only Coffee evolved.
- Level-up cards now say "UNLOCKS AN EVOLUTION" (and glow) when that pick triggers one, or "1 MORE PICK TO EVOLVE" when it's close. The game tests each card on a copy of your stats to find out.
- Group Chat pings play their own soft message pop (Rami picked C) instead of the phone buzz.

## Nov 8, 2026: easter egg XP, Performance Review title slide (V. 2.10.25)
- Rami: the evolution badge "def. helps."
- Easter eggs now give a free level the first time each one is found in a run (yellow note, butterscotch, caught intern, Day One cart, Supply Closet). The amount lives in `EGG_BONUS` in `src/data/achievements.js`.
- Decided: no cut scene before every boss. At most three in the game (start, middle, end). The Performance Review intro became a live title slide instead, title card baked in, cast moved up so the title panels don't cover it. Laptops and wide tablets only.
- Title screen slides now play in random order after the Group Photo opener (reshuffled each time through, no repeats back to back). `shuffle: false` in `src/data/title-art.js` restores the fixed order. (V. 2.10.26)

## Nov 8, 2026: the office map, fixed (V. 2.10.27)
- Rami: the map felt broken, and the "finding the map" moment was gone. Both true: finding it was once-per-save, and the map drew as a blurry gray blob.
- Now you grab the YOU ARE HERE sign every run. The map is drawn like an evacuation map: whole rooms reveal as you enter, cream walls, furniture blocks, room names, dashed outlines for rooms you haven't found, locked rooms marked with their age.
- The corner map is about 40% bigger (desktop and phone), with a tag underneath naming the room you're in.

## Nov 8, 2026: Weekly check-in
- Big week: V. 2.10.20 to 2.10.27 (live title scenes, Supply Closet, Close Call visuals, catch-up XP, evolution hints, easter egg XP, the office map rebuilt), Memo 13 published with the first full social kit, and the memo page redesign.
- Last 7 days (Rami's runs left out): 453 runs from 81 players, half on phones. Average death age 50; 39% reach 50, 17% reach 60, 5% reach 65. Bills and Late Fees are still the top killers (162 of the deaths).
- Next up, per the Fun Pass order: Errands.

## Nov 8, 2026: the first Errand (V. 2.11.0)
- Fun Pass #11 is in: about a minute into a run, a TO-DO card gives one errand (pick up your printing, grab a snack, update the roadmap whiteboard, water the fruit tree, refill your water bottle).
- A bobbing clipboard marks the spot, an orange arrow at the screen edge points the way, it shows on the map, and a cream chip counts down 45 seconds. Get there for coins, HP or a free level. Missing it costs nothing.
- Rami writes the errands and jokes in `src/data/errands.js`.

## Nov 8, 2026 (evening): errand fixes, Home stage designed (V. 2.11.1)
- Rami: the map "looks great"; the errand wasn't clear, and on his second run it never showed. Errands now name the place, say it's a 45-second bonus, float a TO-DO HERE tag, and wait for menus to close before starting.
- Home stage designed with Rami (players voted Home 7 to 1): a peak-fall northeastern suburb, your own house to enter, a strip-mall grocery, LEGO hazards, a Fifth-Grade Math Homework boss, the Mortgage and V8 moving in, a Lemonade Stand shop, unlocked by reaching 55. Plan: `docs/plans/home-stage.md`.

## Nov 8, 2026 (night): boss chests hardened (V. 2.11.2)
- Rami's last run: no chest after the first two bosses, and no "SURVIVED" message. Couldn't reproduce (both bosses dropped chests in tests), but found the SURVIVED line was behind a switch that never turned on, so nobody ever saw it. Fixed.
- Boss chests are now set up before any effects run, and a ready chest that hasn't reached you in 12 seconds opens wherever it is.
- Game errors now count in GoatCounter as `js-error-<file>-<line>` (nothing personal), so the next mystery bug leaves a trail.
- Rami picked three new office bosses: The Reorg, The Holiday Party, Your New Boss (Age 26).

## 2026-11-08 (late): V2.11.3, the dark office fix
- Rami resumed a save with a different character and the office went dark: no floor or sprites, only names, numbers and the HP bar.
- Likely cause: the browser briefly took the graphics card away from the game (WebGL "context lost") and then gave it back. Text redraws itself, but the floor and character sheets come back blank. The game already showed a "lights flickered" reload card on loss, but removed it on restore, leaving the broken screen.
- Fix: the reload card now stays up after restore ("The lights are back. The office needs a reload."). The run is saved at the moment of loss, so reloading continues it. Both events now send telemetry so we can count how often it happens.
- Also fixed: the errand chip and orange arrow lingered on the game over screen.

## 2026-11-08 (night): V2.11.4, a lighter office
- Rami's details: MacBook, Safari, the "lights flickered" box came 5-10 seconds before the dark screen, and reloading went dark right away. So Safari was running out of graphics memory every time that run loaded.
- The office floor was painted as 34 big tiles all held at once (about 135 MB). Now only the 5-7 tiles near the camera are painted (10 at most), and the rest repaint as you walk. Screenshots match the old floor exactly.
- A saved run now remembers its hero. Picking someone else on the title screen sets up your next new run, with a note saying so (Rami: players shouldn't switch mid-run).
- The backup "old stage" (shown when the new office fails to build) now sends a telemetry event, so we can see how often it happens.

## 2026-11-08 (late night): V2.11.5, fewer sign-in pop-ups
- Rami: the Google sign-in box showed up about every third visit, and once after he was already signed in.
- The account data showed no new sign-ins since Nov 7, so he was being asked while signed in somewhere (most likely a different browser on the same Mac; each browser keeps its own sign-in).
- Now the box never pops up on a browser that has signed in before. "Not now" lasts a week instead of 2 days. The title badge still lets anyone sign in anytime.
- www.midlifesurvivors.com now forwards to midlifesurvivors.com, so sign-ins and saves live at one address.

## 2026-11-08 (late night): art for the new bosses and Maple Hollow
- Wrote ChatGPT sprite prompts for The Reorg, The Holiday Party and Your New Boss (Age 26), plus jobs for Grok, Gemini and Muse.
- **The Reorg and The Holiday Party art are in** (`assets/bosses/boss-reorg-v1.png`): passed all checks; Claude removed two stray foot fragments. Not wired into the game yet.
- Home stage is now **Maple Hollow**. Map v2 adds two neighborhood blocks with satirical neighbor jokes, and you get into your house by finding the spare key.
- Gemini's boss lines, spotlight cards, death lines and 20 Home captions are saved for when those pieces get built.
- Grok's boss spec is in. Rami's calls: New Boss at 48 (build first), Reorg and Party take turns at 56 for now, and mistletoe slows instead of freezing.
- All three new boss sheets are in (Reorg, Holiday Party, New Boss); Hot Desk art still to come.

## 2026-11-09 (just after midnight): V2.12.0, Your New Boss (Age 26)
- Synced Rami's Desktop folder with GitHub. It was Codex's git copy, 60 updates behind. All local work is saved on a backup branch, and the 61 local edits were put back.
- New boss at 48: dash chain down a lane of ChatGPT's chevrons (aim locks when the arrows appear), winded window after, 3 dashes and a sugar crash below half health. Gemini's pep talks pop up with each dash (not the first one, where the banner explains the rule).
- Drops a bonus chest and his spare Energy Drink; new achievement "Circle Back Later". The swarm thins during his fight (any boss can now have a swarm block, not just the Gold Watch).
- Tested at laptop and phone sizes: full fight, phase 2, crash, drops, no errors. The Mortgage and the V8 still attack normally.

## 2026-11-09 (early morning): V2.13.0, The Holiday Party and the age-56 slot
- New "middle management" slot at 56: The Holiday Party and The Reorg take turns, one per run (saved with the run). Until the Reorg is built, it's always the Party.
- The Holiday Party: a slow leader with a conga line of 5 small dancers (7 below half health) that follow her exact path; pop one and the ones behind wait, then catch up. Mistletoe circles warn for about 1 s, then arm for 2.4 s; getting caught slows you to 35% for 0.9 s with no damage (Rami's pick). Group Hug lunge below half health.
- Zones never land on walls, doors or furniture (90 placements tested, 0 on furniture). Big chest, a Desk Salad, achievement "Left Before The Slideshow", Gemini's party lines.
- Tested on laptop and phone: line, slow, safe window, phase 2, drops, no errors.

## 2026-11-09 (1:30 AM): V2.13.1, late-run clutter fixes from Rami's phone run
- Rami's run reached 77.6 (Full Life) and beat both new bosses (Circle Back Later, Left Before The Slideshow).
- His screenshots showed the big DESK SALAD banner over the middle of the screen the whole late game (it fired on every salad). Now the center banner shows the same reward at most once a minute; the lower third still reports each one.
- The corner map looked empty: it was minimized (the hide button sits next to pause/sound on phones). The minimized map now reads "MAP ▸", and the map hides under the pause menu.
- Parked for a readability pass: late-game crowd labels and the big white death puffs wash out the screen.

## 2026-11-09 (1:40 AM): Rami's playtest notes on the new bosses and Full Life
- Your New Boss at 48: "good".
- The Holiday Party at 56: "not sure I even noticed them". With a strong build she and her tiny dancers melted before the mistletoe mattered.
- Full Life: "essentially invincible from 65 on", "basically not moving", a long boss-free gap up to 76, "too long with not much variety". He loves the power fantasy but it plateaus.

## 2026-11-09 (2 AM, Rami asleep): V2.13.2, the Holiday Party fix
- The conga line now protects her: with 3+ dancers in line she takes 25% damage (tinsel ring with party bulbs, 🛡 on her tag, "BREAK THE LINE!" pops when you hit her). "LINE BROKEN!" when it drops below 3.
- Dancers are bigger (0.6 scale), sturdier (8 base HP), start at 6, and rejoin every 5 s (3.5 s below half health, up to 8). She arrives with a confetti burst; the banner and spotlight tip now explain the line.
- Tested on laptop and phone: shielded hit 25 of 100, open hit 100, line rebuilds; no errors.
- Rami will think about the Full Life plateau options (new 65-80 content, enemies that keep up with strong builds, shorter late years, or late decades at Home).

## 2026-11-09 (8 AM): V2.13.3, Overtime goes faster
- Correction: Rami's 77.6 plateau run was **Midlife with Overtime**, not Full Life. Midlife's last boss is the Gold Watch at 63.5, so 65 to 80 had about 11 minutes with no bosses. 12 of 444 Midlife runs reached 75 in two weeks.
- Overtime years past 65 now take 25 s instead of 45 (65 to 80 is about 6 minutes). The swarm escalates by age, so the late game also gets busier. Age math is piecewise (`ageAtMs` / `msAtAge`), tested both ways.
- Wrote `docs/handoffs/grok-late-game-brief.md` for the bigger fixes: Overtime events or a boss for 65 to 80, and pressure that keeps up with very strong builds.

## 2026-11-09 (morning): V2.14.0, The Reorg
- The Reorg now shares the age-56 slot with the Holiday Party (about 50/50 per run).
- He rolls in 3 Hot Desks (4 below half health, ChatGPT's sprite), never touching the office's own desks. Restructure: ghost outlines and arrows, then 2 or 3 desks slide 128 to 224 px; a desk never lands on you, never leaves a 3 to 95 px pinch, stays on screen, and a flood-fill check makes sure you can still reach two screen edges. A desk stops short if you step in its path. Pathfinding rebuilds the moment slides end.
- New Org Chart: "NEW ORG CHART" arrows on the screen edges 1.2 s ahead, then every new enemy comes from that corner for 6 s (one edge then the opposite in phase 2).
- Big chest, Fanny Pack, achievement "Org Chart Survivor", Gemini's memo lines. Tested on laptop and phone: 0 desk-on-hero overlaps, desks roll away on defeat, markers clear.

## 2026-11-09 (morning): V2.15.0, Overtime part 1 (Grok's spec, Rami's calls)
- Rami's calls: Workload on for everyone in Overtime, +0.3 hit damage per level (not 0.5), the HOA President at 70 in runs to 80, and build the Watch fix + HOA + Workload first.
- Gold Watch in Overtime now arrives 2.7 years before the end (77.3 in a run to 80), so its fight is 67.5 s again. Runs ending at 65 are unchanged (63.5). Full Life unchanged.
- HOA President visits Midlife runs to 80 at age 70, with swarm thinning.
- Workload (src/workload.js, numbers in src/data/overtime.js): past 65 in Overtime, two coasting windows raise it a level (pip blinks first), up to 5; drops when health falls. Faster/tougher enemies, +0.3 hit damage per level, more elites, bigger crowd on desktop only, and overtime pay (+6% score, +4% coins per level). Tested: rises when idle at full health, effects correct, drops at 40% health.
- Next from the spec: the retirement events (Open Enrollment, Grandkids' Visit, Clean Out Your Desk, Reunion), one per session.

## 2026-11-09 (morning): V2.15.1, Open Enrollment (first Overtime event)
- New event scheduler for Overtime (src/overtime-beats.js). First event: Open Enrollment at 64 in Overtime runs. Visit 4 offices (Part A to D) in order, 10 s each, picked 450 to 800 px apart in different rooms on reachable floor. Lavender marker, chip and edge arrow; 30% of spawns become Spam Likely ("hold music"); swarm events wait while it runs.
- Each office: 5x coin face + 6 gems. All four: big bonus chest, +2,500 score, achievement "Initial Enrollment Period". Miss one: "You're on hold." No penalty. Annual Enrollment (3 offices) at 75.8 in runs to 80.
- Tested: starts at 64 in a run to 80, not in a run ending at 65; all 4 legs complete on laptop and phone; chest and score land.
- ChatGPT's Maple Hollow boards: style board v1 and the six-neighbors board, both approved.

## 2026-11-09 (10 AM): V2.15.2, the Grandkids' Visit
- Overtime event at 66 (and a 5-kid repeat at 72.5 in runs to 80, filling the Reunion's slot until it's built): 3 grandkids run from you at 65% of your speed through the swarm, keeping 260 to 420 px away. Tag each for a gift (gems, a cookie heal, or a lucky coin). All of them: bonus chest, +2,000 score, achievement "World's Okayest Grandparent". 20 s, no penalty for missing.
- Placeholder art: small tinted interns with a pink ring, pink glow and a big heart, because the dark intern coats read poorly in a crowd. Prompt for real grandkid sprites: docs/handoffs/chatgpt-grandkids-sprites.json.
- Tested on laptop and phone: kids keep their distance while you stand still, all 3 tagged, score and chest land.

## 2026-11-09 (noon): V2.15.3, Boss bite (from Rami's Granola playtest notes)
- Rami's 11 AM run: age 80, 410,762 points (leaderboard top is 451,240). Notes: New Boss too easy with a lame defeat, pings should be hittable, errands should buff and clear, XP stalls late, Lounge closed, HOA lady and the car belong at home, coffee table, phone vibration sound, controller screenshot. Fix order is in ROADMAP.
- Your New Boss: 40 to 64 HP, 4.6 s to 3.8 s between dash chains.
- Boss defeats: the New Boss, Holiday Party and Reorg now fall in their own crash pose with a last line and their own stamp (MEETING ADJOURNED, PARTY'S OVER, POSITION ELIMINATED). The New Boss spills energy drinks, his phone and lanyard.
- Weapons now pop Group Chat pings: coffee splashes, Dad Joke, "No." and any hit within 40 px of a ping ("LEFT ON READ"). Tested on laptop and phone.

## 2026-11-09 (12:15 PM): V2.15.4, real grandkids
- ChatGPT's three grandkid sheets are in (pink rain jacket, lavender hoodie with paper airplane, sage overalls). Same 56x60 layout as the interns, shown at native size, no tint. The art loads at 60 so it's ready by 66.
- Pink ring, glow and heart stay. The 5-kid repeat at 72.5 cycles the three kids. Tested on laptop and phone: all three tagged, score and chest land.

## 2026-11-09 (12:30 PM): V2.15.5, Errand payoff
- Answer to Rami's question: only 1 of 5 errands gave XP before (the roadmap one). Now every errand also gives bonus XP (half a level), a shockwave that clears regular enemies within 320 px, and 15 s of CHECKED OFF (+50% damage, +50% gem XP) with a timer chip. Numbers live in src/data/errands.js.
- Up to 3 errands per run (was 1), 2 minutes apart, no repeats. Tested on laptop and phone: 9 and 15 enemies cleared, buff on, second errand arrives after the gap.
- ChatGPT's keepsake icons for Clean Out Your Desk saved at native 32 px (assets/ui/keepsakes-v1.png).

## 2026-11-09 (12:45 PM): V2.16.0, Performance Bonus (late-game picks)
- Rami's note: XP slows so much late that the upgrades stop, and "when you're this overpowered, you get more perks."
- New src/perf-bonus.js: after 55, 75 s with no level-up hands you a free card pick with a bonus title (Performance Bonus, Spot Bonus, Employee of the Month...). Each Overtime Workload pip cuts the wait by 10 s, never under 35 s. Doesn't change your level number. Numbers in src/data/pickups.js (LEVELING.performanceBonus).
- A resumed save or a time jump restarts the clock, so it can't fire instantly. Tested on laptop and phone: fires once, menu opens, no stacking.

## 2026-11-09 (1 PM): V2.17.0, Clean Out Your Desk
- Overtime event at 68.5 (Grok's spec 1.3, ChatGPT's keepsake icons): 8 keepsakes arc out and land 200 to 500 px away (70% of that on phones), at least 96 px apart. Walk over them to pack (no magnet). The 15 s clock starts when the first one lands.
- Bargain Hunters ("50¢", tinted Late Fee for now) spawn every 2.5 s at the screen edge and walk to the nearest keepsake; reaching it sells it (+1 coin). They're killable and leave when the event ends.
- Each packed: 3 gems + coins. 6+: bonus chest. All 8: +2,000 score and the achievement "Box of Memories". Tested on laptop and phone (8/8 and 7/8 runs).

## 2026-11-09 (2 PM): V2.17.1, ChatGPT's art batch (5 kits)
- All five kits arrived: Bargain Hunter, knockdown poses for the three new bosses, the Reunion cast (4 old coworkers with walk and wave), the Maple Hollow tile and prop kit, and the "retro 3D" 9-to-5er skin.
- In the game now: the Bargain Hunter sheet (8 frames, replaces the tinted Late Fee) and the three knockdown poses. The event chip also hides while a level-up menu is open.
- Saved for their builds: the Reunion cast (next Overtime event), Maple Hollow kit (home stage), retro skin (Lounge cosmetics).

## 2026-11-09 (3 PM): Home and Lounge art drafts (ChatGPT + Codex), approved and saved
- Six Maple Hollow house fronts, four home-stage enemies (Leaf Pile, Gutter Clog, Lawn Mower, Property Tax Notice), retro 3D skins for the Soccer Dad and the Grad Student, and an 8-icon Overtime UI kit.
- Reviewed and saved to the repo (art only, no game changes yet). With the 9-to-5er, all three heroes now have a retro skin for a future Lounge cosmetics shop.

## 2026-11-09 (3:30 PM): V2.17.2, maxed boss chests fixed (Derek's report)
- Derek, Full Life: "I didn't get anything from the Boss Chests." His run (V2.16.0, Grad Student, level 29, cleared 100) had everything maxed, so each chest slot paid a "Signing Bonus" of 3 coin faces, cut to 30% by the late-career taper. A tier 5 chest looked empty.
- Now each maxed slot is an uncapped Seniority perk (+6% damage, or Max HP and a heal). Numbers in src/data/pickups.js (bossChest.seniority). Reproduced and tested with a maxed loadout.

## 2026-11-09 (4 PM): V2.17.3, Lounge cosmetics + Say Cheese nudge (Rami's calls)
- Rami's calls: Say Cheese knocks back "only slightly"; Lounge cosmetics are bought in the Lounge and last only for the run you're playing.
- Polygon Upgrade (20k, once per run) at the Lounge cart and the Break Room counter swaps in the retro 3D sheet for the 9-to-5er, Soccer Dad or Grad Student (sold out for the Cowboy, who has no skin yet). Saved with the run, so it survives a resume. Purely cosmetic.
- Say Cheese: 28 px push away from you, then the freeze (WEAPONS.sayCheese.knockbackPx).

## 2026-11-09 (4:30 PM): V2.18.0, the Reunion
- Overtime event (Grok's spec 1.5, ChatGPT's cast): 8 old coworkers (4 sheet rows x 2 names) form a ring up to 420 px out and walk in at 60 px/s along the pathfinding. Friendly, no contact damage. Pass within 64 px to catch up: their line, 3 gems, a wave and they leave. 20 s.
- 6+: tier 1 chest and +1,500 score. All 8: achievement "Reply All, In Person". Name-tag icon from the new UI kit floats over each head, with a sage ring at their feet.
- Schedule: Reunion at 70 when the Watch is under 3 years away (no HOA that run), otherwise at 72.5; if it ran at 70, 72.5 is Grandkids II. Tested on laptop: 8/8 caught, score and chest land.

## 2026-11-09 (4:45 PM): V2.18.1, Cowboy retro skin
- ChatGPT/Codex's Cold War Cowboy retro 3D sheet is in; the Lounge's Polygon Upgrade now works for all four heroes. Codex's notes folded into the docs.

## 2026-11-09 (5 PM): V2.18.2, polish (screenshot button, phone thump)
- Screenshot: Y on a controller / V on a keyboard during a run (the old 3D-view binding, which was parked). Saves the game view with an age + site stamp; phones use the share sheet. Shown as "Screenshot (in a run)" in Controls and rebindable. New file src/screenshot.js.
- Spam Likely ring: two synthesized bass thumps (sine 140 to 46 Hz) with a low rattle, replacing the buzz recording. Tunable in SOUND_VARY.ring.kick (src/data/sounds.js).
- Coffee table near Derek: asked Rami which table he meant before moving anything.

## 2026-11-09 (5:15 PM): V2.18.3, coffee cart on the lounge rug
- Rami's call: the "coffee table" was the coffee cart (the Lounge counter where Derek stands). Moved it from the north wall (-1792, -48) onto the Break Room lounge rug at (-1610, 590), right of the red coffee table and below the mic stand. The shop spot in front of it is still reachable. Tested on laptop and phone.

## 2026-11-09 (6:30 PM): V2.19.0, Maple Hollow step 1 (the neighborhood is walkable)
- New stage, built alongside the office without changing it: src/data/maple-hollow.js (layout as numbers) and src/maple-hollow.js (builder). Two streets with sidewalks, lawns, 12 house fronts (6 per row, ChatGPT's houses), driveways, manholes and seeded yard props from the tile kit. Outdoor daylight (no office darkness).
- It swaps its own layout into START_AREA_LAYOUT, so pathfinding, spawns, Overtime events and bosses work there. Office-only systems (promotions, office map, errands, interns, Lounge, yellow note, butterscotch, supply closet) are off at home for now.
- Title screen settings: LOCATION (The Office / Maple Hollow, unlocks at best age 55; ?home=1 for testing). Picking rebuilds the world behind the title. Saved runs remember their stage and switch back on resume.
- Tested: Maple Hollow on laptop and phone with a full swarm; office regression (New Boss defeat, errands) unchanged.

## 2026-11-09 (7 PM): V2.19.1, Maple Hollow step 3a: locked out
- New src/key-hunt.js (numbers and lines in MAPLE_HOLLOW.keyHunt): at 40.4, eight "?" spots around the block (rock, mat, pot, mailbox); the key is at a random one, never the one nearest your door. Wrong spots get a joke line. With the key, your door (orange ring) opens: tier 3 chest, heal half, +1,500 score, achievement "Under The Fake Rock".
- Placeholder props drawn in code until ChatGPT's key-hunt sheet and your-house front arrive. The inside (three rooms, Rami's default) is step 3b.
- Tested on laptop and phone: locked warning, key found, door opens and pays out.

## 2026-11-09 (7:45 PM): V2.20.0, Maple Hollow step 3b: inside your house
- ChatGPT's four kits are in the repo: your house (closed/open door), key-hunt props, the three-room interior kit, and the LEGO/Lemonade Stand hazards (saved for step 4). Codex's notes folded in.
- Your house replaces the split-level on your lot; the door art swaps to open when you unlock it. Key-hunt spots use the real props (the fake rock flips open).
- Inside: three rooms (living room, kitchen, kid's room) over a hallway, built below the neighborhood (MAPLE_HOLLOW.interior). Walls and big furniture are solid. Walk into the open door to go in, step on the front mat to go out; far-away enemies clock out and bosses come along. Fridge: heal 4, once per run. Garage stays for the V8 pass (Rami).
- Tested on laptop and phone: in, fridge, out.

## 2026-11-09 (8:30 PM): V2.21.0, Maple Hollow step 4: home enemies, toy bricks, Lemonade Stand
- Four home enemies from ChatGPT's sheet (cut into one file each): Leaf Pile, Gutter Clog (slow, tough), the neighbor's Lawn Mower (fast) and Property Tax Notice. At home, office spawns swap to them some of the time (MAPLE_HOLLOW.enemySwap), with their own death lines.
- Toy-brick floor (src/home-hazards.js, MAPLE_HOLLOW.lego): 5 patches in the kid's room and 5 on the lawns; 1 hit plus a 0.7 s limp, 3 s cooldown per patch. Easter-egg achievement "Barefoot Parenting".
- Lemonade Stand: the Lounge at home (same shop screen), on the sidewalk by your house, run by your kid. Opens at the start of a home run (2 min) and at 45/50/55/60. Menu in INTERNS.lounge.stand (lemonades, cookie, bracelet, quiet-time coupon, Polygon Upgrade, Emergency Contact).
- Tested on laptop: stand opens and the shop works, a brick hit lands, all four enemies spawn with art.

## 2026-11-09 (9 PM): V2.21.1, Kevin's 1%er run (side quest)
- Kevin (Discord, V2.17) idled a Full Life run to age 213: he never walked into Father Time, and Sticky Notes plus the new "any hit near a ping pops it" rule made him untouchable.
- The finish line (punch clock / Father Time) now waits 1 year, then walks to you (70 px/s + 90 per extra year, max 320) and arrives at 4 years. Numbers in FINISH_LINE (src/data/bosses.js). Tested: waits, walks, run ends.
- Pings: removed the "any hit within 40 px pops a ping" rule; only coffee splashes, Dad Joke and "No." pop them now.
- GitHub Pages deploy of V2.21.0 timed out twice on GitHub's side (syncing files); retried with this push.

## 2026-11-09 (9:30 PM): V2.21.2, Maple Hollow boss lineup (Rami: "line up looks good")
- Home lineup in MAPLE_HOLLOW.bosses: 45 Fifth-Grade Math Homework (Performance Review stands in until built), 48 HOA President (HP x0.35, built for 70), 52 Mortgage, 56 Holiday Party (no coin flip at home), 60 Midlife Crisis V8, then the Gold Watch (Midlife) or Retirement/Pickleball (Full Life). Office lineup unchanged.
- Rami's note for later: check the office doesn't feel light on bosses now that the Mortgage and the V8 also live at home.
- Waiting on ChatGPT: the Math Homework boss sheet and the garage interior (V8 bursts out of it).

## 2026-11-09 (11:59 PM): V2.21.3, Kevin's age-275 fixes
- A fully maxed build could open the Performance Bonus menu with zero cards and freeze the game. An empty pick now skips the menu and grants a Seniority perk with a banner.
- A save resumed past the finish line had "end boss spawned" set but no punch clock, so the run never ended. If you're half a year past the end with no clock-out boss on the field, it spawns again.
- ChatGPT/Codex art landed in the repo: the Math Homework boss (walk, wind-up, paper-airplane attack, hurt, plus extras) and the 20-piece garage kit. Not wired in yet.

## 2026-11-10 (12:40 AM): V2.22.0, the Fifth-Grade Math Homework boss
- Maple Hollow's 45 boss is real now (the Performance Review stand-in is retired at home). Art by ChatGPT/Codex.
- "Pop Quiz": he stops and scribbles while dotted lines fan out, then throws paper airplanes down the lines. Stand in a gap.
- Below half health: a second fan in the gaps of the first, plus three crumpled pages lobbed onto red circles near you.
- Spotlight card, stamp ("A+ · SEE ME"), last words, deaths and a "Carried the One" achievement. Next: the garage and the V8 at 60.

## 2026-11-10 (1:15 AM): V2.23.0, the garage and the V8
- A fourth room at the end of the hallway, built from ChatGPT/Codex's garage kit: minivan, workbench, bins, mower, bike, mini-fridge, garage doors.
- The V8 sits parked over a car-shaped dust outline all run. From 59.4 it revs ("vroom...") and the car shudders.
- At 60 it bursts out of the garage if you're inside, or down your driveway if you're on the street. Doors swing open; after you beat it, a line about the dust outline.
- Maple Hollow step 5 is done. Next: Rami plays a home run to 60 and checks how the homework boss and the garage feel.

## 2026-11-10 (2:50 AM): V2.24.0, Maple Hollow ground v2 and title art
- Rami didn't like the grass, road and sidewalk. ChatGPT/Codex redrew them as big plates in the houses' style: street bands (832 wide, two variants), two lawns, a driveway, eight lawn stickers.
- The plates' own curb cuts get patched over, and new ones are stamped where each driveway really meets the sidewalk.
- Two new title slides (Welcome to Maple Hollow, That's Not the Minivan), desktop and phone. Maple Hollow players open on them; office players see them mixed in as a teaser.

- 6:45 AM, V2.24.1: Rami spotted six wheels on the V8 in title slide 14. ChatGPT fixed the desktop version (the phone version was fine); renamed to -v2 so browsers skip the cached copy.

- 7:45 AM, V2.24.2: the title-screen to-do follows the stage. Home says "Finish the Fifth-Grade Math Homework at 45" (then a garage hint at 60 once it is beaten), and the welcome line says "You're home."

## 2026-11-10 (8:10 AM): V2.24.3, the 500k cap
- Rami's 500k+ Maple Hollow score bounced: the 40-to-65 board (scores_midlife) still had a 500,000 cap. With his OK, raised it to 5,000,000 (same as Full Life).
- Scores the board turns away now wait on the device and are re-sent next time the game opens (3 tries). A one-time rescue re-sends old 40-to-65 scores over 500k, so Rami's run will post.
- Rami's next: replay the office to judge whether it feels light on bosses.
- 8:03 AM: the 40-to-65 board also capped age at 81; Rami cleared at 82.5 (Overtime + finish line). With his OK, raised to 101 (same as Full Life). His 509,188 run posts on his next refresh via the retry.
- 8:12 AM, V2.24.4: the retry spent its 3 tries on the age limit a minute before it was raised. A second one-time rescue re-queues 40-to-65 scores over 500k or past age 81.
- 8:08 AM: confirmed. Rami's 509,188 (age 82.5) posted and is #1 on the 40-to-65 board. The rescue also found an older 406,219 run (age 84, V2.21.2) that had bounced, now #7.
- 8:35 AM: UI/UX audit approved. Handed to a separate chat (Rami: Fable 5.2) with docs/handoffs/fable-uiux-audit-brief.md: audit + design system spec only, no game code.

## 2026-11-10 (9:20 AM): V2.25.0, The Quarterly All-Hands
- Rami's calls on Grok's spec: All-Hands replaces the V8 in the office at 60, Sprint also unlocks from it, a few enemies follow you upstairs, the desk gives a buff plus a free level, the HOA sprinkler only pushes.
- Built the All-Hands from Grok's numbers: podium + projector screen, Bar Chart, Pie Chart, Line Graph, and a phase-2 Q&A with two following spotlights. Stand-in shape until his art lands.
- Gemini's voice pass and Grok's spec are saved in docs/handoffs with fact-checks. Maple v2 art is with ChatGPT; Rami runs the Fable UI/UX audit after that.

## 2026-11-10 (9:10 AM): Maple Hollow v2 art draft (ChatGPT/Codex), house photos
- Codex delivered the v2 kit locally: six bigger houses, your townhouse, wide streets with parked cars, seven connected backyards, both measured floors, the desk. Not in the game yet.
- Rami sent 17 photos of his home. The repo is public, so photos live only in `private/home-photos/` on his Mac (gitignored), never in git. The photo with family asleep was left out.
- Next: an interior revision from the photos (desk is downstairs in the dining nook; upstairs neon room), then wiring v2 into the game.
- 9:13 AM: the upstairs neon room is Abe's room (noted in the interior brief).

## 2026-11-10 (9:50 AM): interior v3 from photos, attention budget
- Codex redrew both floors from Rami's photos (desk downstairs, Abe's neon room upstairs, galley kitchen, sim rig, bassinets). Photos stayed private; only pixel-art props went into assets.
- Grok's attention budget is in: about 110 messages + 31 pausing menus per office run, worst at 44.5 and 49.5; proposes 1 headline + 1 ticker, quiet windows around telegraphs, merges and holds. Seven decisions for Rami.
- All three helper replies (Gemini voice + UI references, Grok attention budget) are in, so the Fable UI/UX audit can start.

## 2026-11-10 (10:40 AM): V2.26.0, Maple Hollow v2 outside
- The neighborhood is rebuilt at twice the scale from Codex's v2 art: six bigger houses, your real townhouse, a wide street with parked cars.
- Each house has a side path to its backyard, and the yards connect through gates; hedges keep you from walking off the top of the map.
- The key hunt and garage use your new front door and driveway. The Lemonade Stand moved one house over (it sat on your driveway and opened its menu every time you walked out).
- Next: the two-floor inside from the v3 art (desk downstairs, Abe's room upstairs).

## 2026-11-10 (2:25 PM): UI/UX audit and design system spec (design lead chat, no game code)
- Audit done: every screen photographed at phone, iPad (both ways) and desktop. Main finding: each message picked its own spot and nothing decides who talks.
- Rami said yes to all 8 open decisions. The phone banner goes in a slot right under the HUD, and the minimap steps aside for it.
- Design system v1 is ready for review: two homes for in-run words (alarms up top, story at the bottom), eight parts, three screen sizes, one orange button per screen.
- Also in `docs/design/`: wireframes for 11 screens, two before/after mockups, and a 19-sitting migration plan that starts with in-run messages. Rami also said yes to a boss health bar and a phone bottom bar.
- Still open: the new "One look" text for CLAUDE.md. Two quick fixes are waiting in step A1 (everything in a run sits 57 px low; chips draw over level-ups).
- 2:22 PM: Rami approved the design system and the new "One look" text. The build session starts at step A1 and makes the CLAUDE.md edit there.

## 2026-11-10 (2:45 PM): V2.26.1, design system step A1
- Rami approved the design system (Fable chat). A1 is in: a shared tokens file (`assets/ui/ms-tokens.css`) that nothing reads yet, so nothing looks different.
- The 57 px bug is fixed the safe way: the game measures where the HUD really ends and puts the minimap and chips there. Zeroing it alone made the minimap cover the age on phones.
- Chips, arrows and the minimap now hide while a level-up, chest, shop, pause or big map is open.
- CLAUDE.md "One look" replaced with the design system text. The Project instructions on claude.ai need the same paste.

## 2026-11-10 (3:40 PM): V2.26.2, design system step A2
- One message router now guards the middle of the screen: center flashes, Spotlight cards and the GOTCHA card take turns, one at a time.
- Most important first (a boss card beats a reward), 1.2 s breather between them, stale ones are skipped, no repeats within a minute. The clock holds while a menu is open.
- Tested: two flashes 200 ms apart (the second waits), a catch during a boss card (it waits), and the real age-45 pile-up (three alarms now arrive one by one).
- Same look as before. A3 moves the headline under the HUD.

## 2026-11-10 (4:05 PM): V2.26.3, design system step A3
- The center flash is now the headline plate: a solid navy plate right under the HUD, so it reads on any floor and stays off the hero's space.
- Three kinds, each with its own edge and mark: danger (red !), to-do (cream checkbox), reward (orange star). To-dos and Overtime beats use the new to-do kind.
- On phones the minimap and chips step aside while a headline is up. First step built only from the new tokens.

## 2026-11-10 (4:35 PM): V2.26.4, design system step A4
- Boss arrival cards: 3.5 seconds, no floor dim, no red flash or letterbox bars. You can see the first attack being drawn while the card is up.
- Phones get the compact band (name + dodge tip), no speech bubble.
- The boss's first-attack notice is skipped while its card is up. Tested all 10 bosses on a phone: card gone by about 3.9 s, before the second attack.

## 2026-11-10 (5:20 PM): V2.26.5, design system step A5
- One status row under the HUD: at most one thing to do (Overtime beat, key hunt or errand) and one thing on you (Workload, modifier or buff). The others wait their turn.
- The chips share one look: navy plate, edge color by kind, readable text. The to-do chip now just says where to go and the time left.
- Phones: the row sits beside the minimap and under the loadout slots, so everything ends by about 245 px and the hero keeps the middle.
- GitHub Pages timed out three times on V2.26.4 (their side); this push redeploys everything.

## 2026-11-10 (6:10 PM): V2.26.6, design system step A6
- Holds: errands and the Lounge wait for no boss and 0.6 years clear of 45, 50, 55, 60. Swarm events wait for any boss. The numbers live in `src/data/pacing.js`.
- Merges: turning 50 or 60 is one bottom-bar line (decade, cake, dividend). Rewards stay in the bottom bar. The promotion's LIFE line waits for 20 s of quiet.
- First life modifier at 50.8. Only danger can cut in on the bottom bar, and it pauses while a Spotlight band is up.
- Tested ages 45 and 50 on a phone: never more than one headline and one bottom line; one birthday line at 50.

## 2026-11-10 (6:50 PM): V2.26.7, design system step A7
- The bottom message bar is 96 px higher on touch phones, so a thumb on the joystick doesn't cover it. Phones get 16 px text and up to three lines so the whole sentence fits.
- Bottom bar labels by kind: red ! for danger, cream for to-dos and chapters, orange for rewards, sage for tips.
- One speech-bubble style (cream paper, navy reading text) for Dad Jokes, interns and boss last words. The Dad Joke bubble now floats above furniture.
- At most 6 pickup pop-ups (+HP, coins, DODGED!) float at once (`src/world-text.js`).

## 2026-11-10 (7:30 PM): V2.26.8, design system step A8 (Part A done)
- HUD: your age is the big number with the clock under it; pause and sound are 44 px; empty slots only show in the level-up menu. All sizes come from the tokens.
- Phones: the camera sits a little closer (zoom 0.75 to 0.95) so the hero is never under 48 px tall. You see about 20% less floor; one number (`VIEW.minHeroPx` in main.js) to tune after Rami plays.
- Phone sideways: one HUD row, small minimap, short message bar.
- Part A ("where should I be looking") is done. Next: Rami's phone playtest, then Part B (menus).

## 2026-11-10 (8:05 PM): V2.26.9, design system step B1
- New shared parts file (`assets/ui/ms-parts.css`): the Button (one orange primary per screen, outline secondaries, focus ring) and the Sheet's memo-strip header, bottom action bar and legend.
- Level-up and Performance Bonus: SKIP and REROLL on the left, one orange PICK on the right that names the selected card. Cards are still the tap targets.
- Controller: A picks, X rerolls, Y skips (X is still mute everywhere else). Keyboard R rerolls. A small legend shows only for a controller or keyboard.

## 2026-11-10 (8:45 PM): V2.27.0, design system step B2
- One Settings screen (Sound, Game, Controls), the same one from the pause menu and from the title (the old OPTIONS button, now SETTINGS). Sound settings used to live only in pause.
- Pause is calmer: RESUME (the one orange button), Settings, Save & exit, Start over, and the run summary.
- New Row part (`ms-parts.css`): title, help line and a value on the right, the whole row is the tap target. B3 reuses it for the Lounge.
- On phones, the title's SETTINGS button is still below the fold; B5 (title screen) moves it.

## 2026-11-10 (9:20 PM): V2.27.1, design system step B3
- The Lounge and the Lemonade Stand are now a Sheet of Rows: icon, name, one help line, a price tag. The whole row is the button (64 px or taller).
- Items you can't buy show why with a lock (too pricey, sold out); owned items get a check. Your 401(k) balance is in the header.
- One column on phones, two on iPad and desktop. BACK TO WORK is the one orange button.

## 2026-11-10 (9:50 PM): V2.27.2, design system step B4
- The 401(k) Shop shows YOUR 401(K) big at the top, then one Row per upgrade (icon, name, level pips, effect, price tag).
- Nine orange BUY buttons are gone: the whole row buys. Maxed rows get a check, locked rows say how to unlock.
- Phone: balance plus six upgrades visible without scrolling (the spec asked for three).

## 2026-11-10 (10:25 PM): V2.27.3, design system step B5
- Title: PUNCH IN is the only orange fill on phone, iPad and desktop (the nav's current-page button, TO-DO labels, the shift tile and the poll pill stopped being orange).
- The shift chip under PUNCH IN names your stage: "SHIFT The Office · Midlife 40-65 · Tax 0".
- Phones: a bottom tab bar (Shop, Scores, Extras, Settings, Devlog) replaces the site's top nav on the title. Settings is no longer below the fold.

## 2026-11-10 (11:00 PM): V2.27.4, design system step B6
- Game over and retirement are now Moments: a short picture, the headline, then SCORE and AGE big, side by side.
- RETRY (the one orange button) sits right under them with Shop and Title; POST SCORE is an outline button below.
- The pay stub (stat pills, paycheck, goals, score breakdown) folds into a drawer. Score, age and RETRY fit without scrolling on phone, iPad and desktop.

## 2026-11-10 (11:40 PM): V2.27.5, design system step B7
- The bonus chest, retire at 80, the account prompt, the We Moved note and the shift briefing now share one shell: solid scrim, one card style, the memo strip header, one orange button each.
- Retire at 80 is a plain choice: KEEP GOING (20 bonus years) or RETIRE (claim the win at 80).
- Every small header now follows one pattern: DEPARTMENT · RE: Subject.

## 2026-11-10 (7:30 PM): V2.27.6 and V2.27.7, design system C1 and C2
- Rami skipped ahead to Part C; B8 (achievements, leaderboard, credits, extras, lore) is still open.
- C1: the devlog and the top bar now read their colors and fonts from the game's tokens file. A pixel diff of four devlog pages at phone and desktop showed only one change: the "MEMO · RE:" label on cream strips is navy instead of teal.
- C2: the Controls screen was rewritten in plain words (no "BTN 9" or "LOCALSTORAGE"), buttons say DONE, RESET ALL, BACK and CLOSE, and old patch notes lost their developer talk. A scan of 14 menus at phone and desktop found none left.
- GitHub's deploy hiccupped on C1 (it couldn't find its own upload); the C2 deploy carried both.

## 2026-11-10 (9:30 PM): design system C3, the audit rerun
- Reran the Nov 10 audit capture on V2.27.7 and compared it shot by shot with the first one.
- Six of the top 10 are retired: one home per message type, nothing over menus, chips beside the map, no 57 px drop, no floor dim during bosses, one orange button per screen.
- Still open: an alert shows twice (headline and ticker), the B8 screens are old style, the iPad nav overlaps itself, and the old CSS is still underneath (the style counts didn't drop).
- Report and before/after sheets: docs/design/ui-audit-c3-2026-11.md.

## 2026-11-10 (10:30 PM): V2.27.8 and V2.27.9, alerts once and B8
- Alerts (TAX SEASON, RENT HIKE, LOW HP) now show once, in the headline under the HUD, with the full sentence. The ticker only gets one if the headline can't.
- B8: Extras, Achievements, Scores, Credits, Patch notes and Lore all open with the same strip, title and help line. No repeated logo, and no reading text under 14 px at phone, iPad or desktop.
- Extras is a list of Rows now; Reset progress still asks twice.
- That finishes Parts A, B and C of the design system migration. Left from the audit: the iPad nav overlap and an old-CSS cleanup.

## 2026-11-10 (11:45 PM): V2.28.0, the big house (Maple v2 step 2a)
- Rami wanted the house to feel like a real part of the stage, not a narrow strip. He picked option C: Codex's real floor plan with the rooms twice as wide, furniture at its drawn size.
- The whole ground floor is in: living room, the desk by the window, galley kitchen, half bath, laundry, entry and the garage with the minivan (the V8 still waits there for 60).
- Walking through the front door animates now, in and out, and nothing can hit you mid-doorway.
- A baby gate blocks the stairs until upstairs (step 2b). Step 2c fills the bigger rooms using Rami's cozy photos as the mood: rugs, plants, lamps, shelves.

## 2026-11-10 (11:45 PM): V2.28.1, upstairs (Maple v2 step 2b)
- Upstairs is in: Abe's room (bed, music desk, guitar, TV, posters, hoop closet), the main bedroom with the crib and twin bassinet, the walk-in, the bath and the hall.
- Walk onto the stairs to climb: a few hops, a fade, and you come out on the other floor. Tested both ways.
- The toy bricks moved to Abe's room (the test stepped on one and earned Barefoot Parenting).
- Still to confirm in a real browser: walkers near the stairs following you. Rami asked why it was slow: each headless test runs the game at about 10 fps, so one house walk-through takes 6 to 8 minutes.

## 2026-11-11 (12:30 AM): V2.28.2, flashing lights
- Kevin on Discord: an epilepsy warning is worth adding before a bigger audience, since maxed-out middle management makes the screen strobe. Rami: "I'll add it in sooner than later."
- The first time you open the game, a Health and safety sheet warns about flashing lights, with a Reduce flashing switch and GOT IT. It shows once per device.
- Reduce flashing (Settings > Game, or automatic with the device's Reduce Motion): no full-screen flashes, no white kill pops or rings, no boss knockdown flicker, a soft red tint when you're hurt instead of a solid red flash, shakes at about a third.
- For everyone: one full-screen flash per 0.6 seconds at most, and only 4 enemies per third of a second get the white death pop. The rest still squash and pop. The Gold Watch and Holiday Party blinks slowed to about 2 a second.
- Tested headless at phone and desktop sizes: the warning shows once, the switch saves, no errors. Not yet felt in a real late run.
- Found along the way (already in V2.28.1): the Settings sheet draws behind the title tiles on desktop. Logged for later.

## 2026-11-11 (12:45 AM): Level art audit and V2.29.0, the crisp pass
- Rami asked why the levels don't look like ChatGPT's art. Audit found three leaks: the screen smears it, the shrink changes it, and the rooms are thin. File size isn't the cause. Report: docs/design/level-art-audit-2026-11.md.
- Crisp pass shipped: hard edges on Retina screens and phones, whole-number camera zoom, pixel-art mode on for everything (lights stay soft), and the green grid past Maple Hollow's edge is gone.
- New Camera setting on big monitors: CLOSE (default) or WIDE. Rami wasn't sure which, so he can try both and pick the default.
- Rami said yes to "Pixel rules for the world" in CLAUDE.md.
- Tested at laptop, 1080p, MacBook and phone sizes in both stages. Not yet seen on a real device.

## 2026-11-11 (12:50 AM): art direction audit brief for Codex
- Rami: "I want every pixel in this game to be stunning and to play well with the sprites and on-screen effects and UI/UX."
- Wrote a Codex brief that builds on the level art audit instead of repeating it: sprites in motion, weapons and effects, bosses, UI over art, stages, and a ready-to-send art request list with exact sizes.
- Applied the V2.28.2 flashing patch from another session. A second session shipped V2.29.0 (the crisp pass) at the same time as this one built the same fix; this session's copy is kept on the branch backup/pixel-rules-dup. One session at a time from here.

## 2026-11-11 (1:00 AM): Codex brief for the level art pass
- Rami: "let's do it." Wrote docs/handoffs/codex-level-art-pass.md: three art jobs in order (heroes and Bill clean-up, big house fill, Maple Hollow trees and greens), each with sizes and a JSON request.
- Sitting 2 (true sprite sizes) needs no new art, so Claude builds it while Codex draws.
- Rami pasted the Pixel rules into the Project instructions.


## 2026-11-11 (1:45 AM): the boundary, backyards and world rules
- Rami: trees should contain the level, backyards are hard to get around, and we need rules for what's passable, breakable or a real barrier.
- Found why the yards feel bad: gates are 64 px and the hedge steps 52 px for a 48 px wide hero, and all the yard furniture is painted into the ground, so you walk over it.
- Tree boundary is decided and added to Codex's Job 3, along with yard furniture as separate sprites. The three-kinds rule (wall, breakable, walk-through) and 96 px gaps are proposed, waiting on Rami.
- Looked at how other pixel art games handle scene and sprite; notes are in the chat and feed the rules.

## 2026-11-11 (6:30 AM): V2.29.1, wider gates; world rules approved
- Rami said yes to the world rules (wall, breakable, walk-through; 96 px gaps; two exits; trees contain the level). They're in CLAUDE.md.
- Backyard quick fix: gates between yards and the hedge steps are 96 px wide (were 64 and 52). Tested: the hero walks through both, and the fence still blocks above and below the gap.
- The drawn gates are still 64 px, so the opening is a little wider than it looks until Codex's Job 3 art.
- Codex finished Job 1 (heroes and Bill) on Rami's Mac. Not in the repo yet, so not reviewed.

## 2026-11-11 (8:30 AM): V2.29.2, repainted heroes; art redo
- Codex delivered all three jobs. Rami: the heroes' greens are fine, but the flamingo, gnome, mailbox and bins are "major steps backwards."
- Cause: Claude's brief said "draw at native size, nothing shrunk," so Codex built the final sprites from code shapes instead of painting them. Flat fills, no shading.
- Kept: the four hero sheets (recolors of the existing sprites; khaki slacks are back). Live in V2.29.2, checked in the game for all four heroes.
- Rejected: Bill's flat repaint (third try asked for), the house fill and the outdoor kit. PR #1 stays unmerged. The outdoor kit also skipped the tree wall and the separate yard furniture.
- New rule (Rami's yes): world art is painted, then reduced by a whole number. New brief asks Codex for a sample of eight pieces first.

## 2026-11-11 (10:00 AM): V2.29.3, painted Bill; sample approved
- Codex's sample of eight (painted at 8x, reduced by 8) came back in PR #2. Rami approved it.
- The new Bill from that sample is live. Same size, same hitbox, same eight walk frames, so nothing about how he plays changed.
- Checked in the game at laptop and phone sizes with no errors.
- Two notes for the next batch: the lawn shows a repeat grid when tiled, and Bill's mouth reads a little blocky (fine for now).
- Next: Codex paints Batch A (tree wall and trees), then Batch B (yard furniture as its own sprites).

## Nov 11, 2026: Memo 14 drafted, "It all felt like photography"
- A sidequest memo: Rami's first Gaussian splat (212 photos of Abdel on the Z9), built from his own answers. Memo 14 now; "how I write these memos" moves to 15.
- Lead visual is a 20-second, 1.7 MB orbit of the floating grass patch, rendered in Blender from the splat, with Abdel in the right third so the title sits clear.
- New optional `sideCard` field shows the camera settings in the right column, using the What changed card style. The Instagram reel is embedded, and the handoff file is hosted at `devlog/files/`.
- Found that a link inside a sidenote breaks it; README corrected. Draft stays hidden until Rami's OK.
- Memo 14 cover (Rami's ask): the lead loop is now a speed-ramped screen recording of the orbit inside Blender (viewport, camera gizmo, outliner, timeline), 11 s and 2.4 MB, ramping from real speed to about 2.6x and back so it loops cleanly. Captured frame by frame from Blender's own window.
- The still for cards and link previews is the clean island, cropped to 16:9. New optional `leadPoster` field so a loop's first frame can differ from the cover.
- Rami's correction: the orbit should be of Abe. New lead loop: the Blender view circles Abe (the world turns behind him), then the sweep line turns him into dots and it settles there. 10.8 s, 2.7 MB.
- Rami picked the Memo 14 title: "Achievement Unlocked: Gaussian Splatting." ("It all felt like photography" stays as a section header.)

## Nov 11, 2026: Gaussian Splatting achievement (V2.29.4)
- Rami said yes: finishing Memo 14 on the devlog unlocks "Gaussian Splatting" (+3k) the next time you clock in, like Required Reading.
- Any memo can carry its own achievement now (`unlocks` in posts.js), and the "memo finished" toast names it.
- Tested on laptop and phone sizes: unlocks on the next run, Required Reading stays locked, no errors.
- Memo 14 social kit for Rami's review: 5-slide carousel, a 20 s Reel on the game's title track (achievement card, the 212 photos, the Blender orbit of Abe, the dots, the ask), a 3-frame Story and captions (docs/social/14-posts.md). The Reel and Story videos are too big for the repo (51 MB and 38 MB); they live on Rami's Mac in the shoot's social folder. Publish waits on his OK.
- **Memo 14 published** (Nov 11, Rami's OK). Share page, feed and one-post feed built; the handoff link uses the full address so it works on the share page too.

## 2026-11-11 (12:30 PM): V2.29.5, the tree wall
- Reviewed Codex's Batch A. Trees, pines, shrubs and the four wall sides are approved. The corners go back: their trees are twice the size of the sides and the joins are hard lines.
- The forest now rings Maple Hollow on all four sides. The camera stops at the outside of the trees, so the dark gap below the town never shows.
- The hero stops 40 px in from the edge so he doesn't vanish under the leaves. The corners use plain side pieces until the redo arrives.
- Rami approved one new color in Codex's chat: autumn gold #D8AD4A.
- Not done: the new single trees and shrubs. The yards' trees are painted into the yard pictures, so they wait for Batch B.

## 2026-11-11 (1:00 PM): V2.29.6, forest corners
- Codex repainted the four corners at the same tree size as the sides, with ragged inner edges. Approved and live.
- Each strip starts at a corner, so that join is clean. The far end of each side is cut mid-strip because the town isn't a whole number of strips long. It shows as a faint line at three corners (worst at the bottom right).
- Fix if it bothers Rami: two short filler pieces from Codex (704 px for top and bottom, 128 px for the sides).
- Batch A is finished. Next is Batch B.

## 2026-11-11 (1:30 PM): V2.29.7, breathing room
- Rami played the tree wall. The forest edge was too tight by the end houses, and players could get stuck.
- Cause: the solid edge I added left 32 px beside the last house's side path. The hero is 48 px wide.
- Fix: a 136 px grass strip on the left and right ends of town, between the houses and the forest. 96 px of it is walkable.
- Rami's other notes: the streets should end in a cul-de-sac or dead end, and the front door should open on its own after the key hunt.

## 2026-11-11 (2:00 PM): V2.29.8, the front door
- Rami: after the key hunt you had to walk away from the door and come back to get inside. Confusing.
- Now the door stays shut until you take the bonus chest, then swings open with a "COME IN" sign. Walk at it and you're in. Standing still on the steps won't pull you inside.
- Found on the way: the open doorway was drawn underneath the house, so the door never looked open. Fixed.
- Tested at laptop and phone sizes: stand still (stays out), take the chest, walk in (goes in).

## 2026-11-11: Memo 14 gets a 3D Abe you can spin
- Rami asked for the splat inside the article. Memo 14 now has an "Explore in 3D" card: tap it and drag to spin Abe around.
- The scan was slimmed from 609k to 350k splats (about 5 MB) so it loads on a phone, and it only loads when you tap.
- The link preview, cover and social image now show Abe facing the camera instead of his back.
- Tested at laptop and phone sizes; live at midlifesurvivors.com.

## 2026-11-11 (2:15 PM): V2.29.9, door timing
- Rami never saw the door open. The swing started the moment the chest was picked up, so it played behind the bonus screen.
- Now it waits for the bonus screen to close, pauses about half a second, then swings over 0.8 seconds (was 0.4).
- Rami posted the Memo 14 social kit and loves the 3D viewer.

## 2026-11-11 (2:45 PM): Batch B review
- Codex's Batch B (PR #4, 79 pieces) is in. The props that failed last time (flamingo, gnome, mailbox, bins) are now painted and read well. All 21 furniture pieces pass.
- Sent back: the two lawns (only two flat greens, camouflage look, a few straight cut lines), the side-on fence pieces and corners (painted at an angle, so they can't stack into a straight run).
- The yard plates use two different grass colors. Rami needs to pick one.
- The cul-de-sac piece wasn't in the batch.
- Nothing wired into the game yet.

## 2026-11-11 (3:15 PM): V2.29.10, your backyard rebuilt
- Rami picked the lighter green as Maple Hollow's one grass color.
- Codex added two painted street ends with barricades. They pass review and join the street cleanly.
- Your backyard is the first rebuilt yard: a plain ground picture, with the soccer goal, fire pit, chair and maple tree as separate objects that block at their base.
- Tested: the lane between the side gates is clear, the goal, pit and trunk block, and the tree fades when you stand behind it.
- It looks greener than everything around it until the lawns and the other yards switch over.

## 2026-11-11 (4:00 PM): Batch B approved
- Codex's fixes pass: the lawns have three tones and no blobs or cut lines, every ground piece shares the lighter green, and the sprinkler and key read clearly.
- The side-on fences now stack into a straight line and meet the corners. They are thin (6 px), which is true to the view but reads light next to the front-on fence.
- The two lawn tiles are close to identical, so a small flower repeats every 512 px. Minor.
- All of Batch A and Batch B is approved. What's left is wiring: eleven yards, the street ends, and the green lawns.

## 2026-11-11: Z9 camera art ready (Codex)
- Painted64px icon and32px rest/glint pickup with transparent backgrounds and full prompts.
- Native-size comparisons, material palette and hard-alpha checks pass. Art only, ready for review.

## 2026-11-11: Z9 reduction cleanup (Codex)
- Kept the approved paintings and cleaned native icon/pickup pixels for v2.
- Added the upper-left rim, stronger cream stripe and lighter pickup; checked both navy backgrounds at1x and4x.
- Art and docs only. Branch codex/z9-icon, stop for PR review.
- Codex's Z9 icon v2 (PR #5, rim light, cleaner panels, cream stripe) is on Memo 14's Camera settings card. The 32 px pickup is saved for later. Side cards can now carry an icon (`icon` in posts.js). Rami: the icon now sits in an inventory slot beside the card title (his pick over the corner placement).

## 2026-11-11 (9:30 PM): wrap up, and a note on chats
- Memo 14 is done: 3D viewer, front-facing preview, resource links and the Z9 card are all live.
- Rami: long chats slow down, and several chats at once collide. Proposed: one building chat per objective, a fresh chat for the next one, side chats only for non-code work, and a docs/NOW.md status file. Waiting on his yes before changing CLAUDE.md.
- Next: Maple Hollow lawns and street ends (Batch B wiring), in a new chat.

## 2026-11-12 (12:45 PM): V2.29.11, street ends and one green
- Both streets now curve into Codex's painted dead end, with a striped barricade that blocks you (tested both sides).
- Only the curved part of each end is used, and the street's own art runs out to meet it. The grass strip at each end of town grew from 136 to 232 px to make room.
- The lawns, the street's grass strips and the strips beside each house are now the lighter green. House siding painted the same old green was left alone.
- Known nit: a 3 px jog in the curb where each curve starts (Codex's caps sit a few pixels off the street's rows). The five old backyards stay darker until they're rebuilt.


## 2026-11-12: V. 2.29.12, Ben's missing scores (Claude)
- Ben's Full Life scores hadn't posted for two weeks. Cause: the Full Life board only accepted ages up to 101, and runs keep going past Father Time (Ben reached 103; one run in the stats reached 144). The game tried 3 times, then dropped them.
- Fix: age limit raised to 200 on both boards (Rami's OK, applied in Supabase; `docs/sql/SCORES_AGE_CAP_200.sql`), plus a one-time re-send of Full Life scores past 101 saved on each device.
- Ben also lost points after resuming a crashed run at 95. The autosave didn't keep Lounge spending, taper coins, kills or the Close Calls score. It does now.
- Full playtest notes: claude/PLAYTEST_BEN_2026-11-12.md in the Project.

## 2026-11-12: V. 2.29.13, Father Time plays fair (Claude)
- Ben: "He was chasing me all over and I was doing a fine time outrunning him. Then he teleported! Landed right on my head." Past FINISH_LINE.forceYears the finish line snapped onto the player every frame with no warning.
- Now: a heads-up half a year before ("He's done walking. Soon he jumps to you."), then a ring on the ground where you stand. He lands there 1.3 s later (a little shorter each year, never under 0.65 s), chases for 1.6 s, then marks again. Numbers in `src/data/bosses.js` (FINISH_LINE).
- Tested headless in Midlife at 69: warning fires, ring draws in token colors, a dodge makes him land 300 px away, standing still still clocks you out. No errors.

## 2026-11-12: V. 2.29.14, clear leaderboard tabs (Claude)
- Ben read the Full Life board as "all time." The board only showed your current mode, with a small toggle.
- Now: MIDLIFE / FULL LIFE tabs (with the age range) and FISCAL YEAR 2 / ALL-TIME tabs, plus one plain line ("Full Life runs (ages 40 to 100), every version since launch, each player's best run."). Viewing a board never changes where your scores post. After a run, the board opens on your run's mode.
- Built from the Button part (selected = raised + paper border). Checked at 390x844 and 1280x800 with touch and keyboard; no errors.

## 2026-11-12: V. 2.29.15, Settings closes from the title (Claude)
- Ben couldn't close Settings on the desktop browser. Cause: every pop-up shared one layer (z-index 30), and the title screen comes later in the page, so its tiles and bottom bar covered the Settings sheet and its DONE button. Only Esc worked.
- Fix: Settings and Controls use the Sheet layer token (--ms-z-sheet), and Settings now comes before Controls in the page so Controls (opened from Settings) lands on top.
- Tested DONE, Controls and Esc at 1280x800, 1920x1080, 1024x768, 768x1024 and 390x844. No errors.
- Follow-up: BUILD in `src/loader.js` and PAGE_BUILD in `index.html` were still 362 after V. 2.29.12 to 2.29.15, so some browsers could keep old cached code. Both are now 366, so every player gets today's fixes.

## 2026-11-12: V. 2.29.16, Maple Hollow evened out (Claude)
- Ben: "I get hit harder and heal less." Cause: Maple Hollow swaps in Gutter Clogs and Lawn Mowers (2 damage each) and has no interns, errands or office plants, so it had about half the office's heals.
- Rami chose all of it: both home enemies now hit for 1, beaten enemies at home sometimes drop leftover pizza (2%, at most one per 20 s), and the fridge restocks every 5 years.
- Play stats now record the stage (new `stage` column in `runs`, Rami's OK), so office vs. home can be compared with numbers.
- Tested at home: damage values, a forced snack drop and its cooldown, no errors.

## 2026-11-12: yard rebuild planned, not started (Claude)
- Rami: the backyard is fine, and every yard has to keep its character.
- Side-by-side check: Batch B's plain grounds and props cover young family and retirees well, but the grill master (string lights, cooler, cornhole), fixer-upper (tarp pile, weeds), HOA (pergola, hedges) and Halloween (ghosts, lamp posts, bunting, fog) would lose their signature pieces, and every yard would lose its orange autumn shrubs.
- Wrote the Codex Batch C brief for just those pieces (`docs/handoffs/codex-yard-character-pieces.md`). The rebuild waits for it.
- Balance stays as V2.29.16 for now; Rami will retune once the map is laid out.

## 2026-11-12: Batch C review (PR #6) (Claude)
- Codex delivered 30 painted pieces. String lights and the cabbage bed pass; the Batch B wicker chair is reused for the retirees.
- Most other pieces came out at 30 to 60% of the size of the same subject in today's yards (my brief's sizes were too small). Sent back to re-fit at today's sizes; the tarp pile gets repainted as leaning pallets with a tarp.
- Revision brief: `docs/handoffs/codex-yard-character-pieces-revision.md`. Yard rebuild still waits.

## 2026-11-12: V. 2.30.0, every yard rebuilt (Claude)
- Batch C approved (ghosts whitened and fog turned lavender by remapping their own colors). Batch B and C pieces copied into `assets/stage/home/v4/yard/`.
- All eleven neighbor yards now draw a plain ground plate plus separate pieces, laid out per theme in `tools/maple_yards.py` (it refuses any solid piece in the gate lane or the path back to the house). Fence posts and autumn shrubs frame every yard, yours too.
- Standing pieces sort by their feet with the hero; roofs, lights and bunting draw above you.
- Tested: all six themes in game, ghost in front of and behind the hero, and both gate lanes walk end to end. No errors.
