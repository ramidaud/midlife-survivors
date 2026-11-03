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
