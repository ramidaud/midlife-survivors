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
