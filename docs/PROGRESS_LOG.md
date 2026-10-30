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
