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
