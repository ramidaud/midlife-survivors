# Midlife Survivors: Learning Notes

Game-dev ideas you've picked up along the way. One short entry per concept.

## An environment is a stack of layers (Nov 1, 2026, Codex)
The room starts with a quiet floor, then adds light, tiny marks of use, and furniture. Characters sort against furniture by where their feet touch the floor, while health bars stay readable. Our carpet and wood patterns have matching opposite edges, so repeating them does not create a visible border. Keeping floor detail low contrast lets the hero and pickups keep your attention.

`Floor -> light and floor marks -> furniture and people -> health bar`

## Sprite sheets and a walk cycle (Oct 31, 2026, Codex)
A **sprite sheet** is a grid of drawings the game shows one at a time, like a flipbook. Each character now has four directions with four walk poses, packed into 56x60 frames. All frames share one scale so the head and body do not grow between steps. Walking advances only when position changes, so pressing into a desk does not make the feet keep marching.

`Move -> choose direction -> advance walk pose -> stop -> hold pose`

## Prop families: same furniture, different people (Oct 31, 2026, Codex)
Related props can tell different stories while sharing a silhouette, palette and collision area. Our three desks differ through a few large objects: a file tray, leaning paper stacks and a pizza box. Keeping one 96x104 frame and one floor footprint means changing desk art does not change where the hero can walk. Judge the differences at 1x; the 2x gallery helps inspect pixels.

`Shared desk shape + one readable story = a cohesive prop family`

## Level blockouts and exploration loops (Oct 31, 2026, Codex)
A **blockout** is a playable rough layout used to test space before making finished scenery. A landmark helps you remember where you are, while an optional find gives you a reason to take a detour. A loop gives you another way back when a crowd blocks the direct path. We checked that the hero can reach all four departments and all three finds with furniture collisions enabled; swarm pressure comes next.

`Landmark -> detour -> small discovery -> alternate route back`

## Art readability at game size (Oct 31, 2026, Codex)
Follow-up: a tall desk drawing needs a matching footprint on the floor. The first shallow collision area let the hero walk into space occupied by the desk, so the drawing hid him completely. Blocking that floor space while sorting by feet gives believable overlap: `behind = partly covered | beside = blocked | in front = visible`.

There was also a drawing-order bug: walking north put the hero's layer below the floor's layer. Floors now stay below all actors, even at negative map coordinates. The health bar moves above the hero's head while behind a desk instead of appearing through its monitor.

An illustration can have wonderful detail that disappears when squeezed into a tiny sprite. We tested the hero in the same 48x52 frame as the current game, then simplified the source art so the glasses, mug and enemy faces read more clearly. Nearest-neighbor scaling copies hard pixel blocks instead of blending their edges; a fixed palette keeps them visually related.

`Key art -> simpler sprite -> 1x movement test -> feedback`

Use 2x to inspect pixels, but judge gameplay readability at 1x. A sprite's visible height and its collision area can differ: a tall desk blocks your feet at its base while you can walk behind its upper artwork.

---

## How building with Claude works
- **You direct, Claude builds.** Describe what you want to see or feel ("enemies should swarm from the left", "this feels too slow"). Claude writes the code.
- **Play, then react.** Every session ends with a playable link. Your reactions as a player are the most valuable input.
- **Save points.** Each finished step is saved with git, so any mistake can be undone.
- **Numbers live in data files.** Speeds, damage and jokes sit in simple lists you can edit yourself.

## The game loop (Oct 30, Hello Game)
- A game is a program that redraws the screen about **60 times per second**.
- `create()` runs **once** to build the world: the floor, the player, the camera.
- `update()` runs **every frame**: read the keys, decide where things go, move them.
- Everything in Midlife Survivors (enemies chasing, weapons firing, the age clock) will live in that loop.
- Bonus concept: **normalizing** the direction so moving diagonally isn't faster than moving straight.

## Spawning and chasing (Oct 30, Bills)
- **Spawning** means creating a new enemy while the game runs. A **timer** calls the spawn code every 0.9 seconds.
- Bills appear just **outside the camera's view**, so they walk in from the edges instead of popping up in your face.
- A **group** is a bag holding every Bill, so one line of code can move them all.
- **Chasing** is simple: every frame, each Bill points itself at you and moves forward. Do that 60 times a second and it looks like it's hunting you.

## Targeting (Oct 30, Coffee Splash)
- To aim, the game checks the **distance** from you to every Bill and keeps the smallest one. That's the "nearest enemy."
- A **timer** fires the weapon, the same trick used for spawning. You never press attack.
- Each splash remembers where it started, so once it has flown its **range** the game deletes it. Deleting things you no longer need keeps the game fast.

## Collisions and health (Oct 30, splashes hit Bills)
- A **collision check** asks every frame: are these two things touching? Phaser calls this an **overlap**.
- When a splash overlaps a Bill, a function runs: the splash disappears and the Bill loses **HP** (hit points).
- At 0 HP the Bill is deleted. A tiny white **flash** shows the hit landed, a first taste of "game juice."
- Changing `hp` or `damage` in the data files changes how tough the game feels, with no logic edits.

## Taking damage and safe windows (Oct 30, Bills hurt you)
- You have **HP** too. Each Bill touch costs 1, shown by a red **health bar** pinned to the screen.
- After a hit, you get a short **invulnerability window** (0.7 s). Without it, a crowd touching you for one second would hit you 60 times.
- At 0 HP the game **pauses** physics and timers, which freezes everything in place.

## Restarting and resetting (Oct 30, Game Over screen)
- "Try again" reruns `create()`, which rebuilds the world from scratch.
- Values kept **outside** the scene (game over flag, timer start) must be reset at the top of `create()`, or the new run inherits the old one.
- Death jokes live in a data file grouped by **who killed you**, so each future enemy can get its own lines.

## The endless floor trick (Oct 30)
- The carpet is only as big as the screen and stays glued to the camera.
- Each frame, its **pattern slides** by however far the camera moved, so it looks like you're walking across an infinite floor.
- Same idea as cartoon backgrounds scrolling behind a running character. Cheap, and no walls.

## XP and leveling curves (Oct 30, Wisdom gems)
- Enemies drop **pickups** (gems). A **magnet radius** pulls nearby ones in, so collecting feels good without precise steering.
- Each level needs **40% more XP** than the last. That growth is a **curve**: fast early levels feel generous, later ones feel earned.
- Leftover XP carries over to the next level, so nothing is wasted.

## Pausing and run stats (Oct 30, level-up screen)
- **Pausing** = stop the physics (nothing moves) and the clock (no spawns or shots). Unpausing turns both back on.
- Data files are the **recipe**. Each run copies them into **stats**, and upgrades change the copy. That's why a new run starts fresh.
- Upgrades are a plain list in `src/data/upgrades.js`. A new upgrade is one new line.

## Synthesized audio and controllers (Oct 30)
- **Web Audio synth:** Browsers can generate retro tones directly from numbers (frequency in Hz, length in seconds, and wave shape) with zero audio files.
- **Deadzone:** Analog sticks rarely sit at a perfect 0, so ignoring tiny values under `0.2` stops your character from drifting on their own.
- **Just pressed vs. held:** Movement checks if a button is held down every frame, while menus check if a button wasn't pressed last frame and *is* pressed now, so one tap moves one card instead of scrolling 60 times a second.

## Area attacks, knockback, and smart upgrade pools (Oct 30)
- **Area of Effect (AoE):** Instead of flying across the screen, an AoE checks the distance to *every* Bill at once and hits all of them inside `radius`.
- **Knockback vector:** Subtracting your position from the Bill's position gives an arrow pointing straight away from you; dividing by distance makes it length 1, so we can shove the Bill out by an exact number of pixels.
- **Conditional upgrades (`when`):** Filtering the upgrade list before shuffling lets "Unlock: Dad Joke" appear first, and swaps in "Louder Groan" only after you own the weapon.

## Age clock, pausing time, and boss drops (Oct 30)
- **Narrative clock:** Dividing elapsed seconds by `secondsPerYear` turns a plain survival timer into your character's age (40.0 -> 50.0) and triggers events at milestone birthdays.
- **Pausing the clock:** Setting `scene.time.paused = true` stops `this.time.now` from advancing, so pausing the game doesn't advance your age or boss timers while you take a break.
- **Boss reward loop:** A boss is just an enemy in the same physics group with higher `hp`, `size`, and an `isBoss` flag so it drops a gold chest instead of a regular gem.

## Wave schedules and state machines (Oct 30)
- **Wave table:** A simple list of `{ minAge, everyMs, spamChance }` lets the game ramp up swarm density and introduce new enemy types automatically as you age.
- **State machine:** Instead of only chasing, an enemy can switch between states (`creeping` -> `ringing` -> `dashing`).
- **Telegraphed attacks:** Pausing for 0.55s to vibrate and show `"RING!"` before a high-speed dash warns the player so dodging feels fair and skillful.

## Weighted spawns and weapon evolutions (Oct 30)
- **Weighted spawn table:** Giving each enemy a "raffle ticket" count like `[["bill", 4], ["officeGossip", 1]]` lets you mix common grunts and rare elites in one clean list.
- **Weapon evolutions:** Checking `when: s => s.coffeeUp && s.hasSleep && !s.coldBrew` rewards players for pairing a weapon with its matching passive, turning single shots into a 3-way piercing spread.

## Procedural pixel art and walk wobble (Oct 30)
- **String-grid sprites:** An array of strings like `"..SWWbeSSebWWS.."` paired with a color palette lets you paint retro pixel-art sprites directly in code with no `.png` files or server required.
- **Procedural walk animation:** Flipping the sprite horizontally (`setFlipX`) based on movement direction and tilting its angle with `Math.sin(time)` creates an instant walking bounce without needing multi-frame sprite sheets.

## The Vampire Survivors Reaper trick (Oct 30)
- Instead of abruptly cutting to a win screen when the clock hits 50, spawning an unstoppable **Father Time** boss turns the end of the run into a dramatic final moment where *meeting him is the victory*.

## Game juice and step sequencers (Oct 30)
- **Game juice:** Stacking tiny visual reactions—floating damage numbers, a 55ms squash-and-stretch tween, confetti scraps on KO, and short camera shakes—makes hits feel weighty without changing a single gameplay rule.
- **Step sequencer:** A background music groove is just two arrays of frequencies (`bass` and `lead`) stepped through every `165ms` using the same Web Audio oscillators as sound effects.

## Meta-progression and localStorage (Oct 30)
- **Run stats vs. Meta data:** Run `stats` reset every time you press Try Again, while `meta` is saved as a JSON string in `localStorage.setItem("midlife_survivors_save_v1", JSON.stringify(meta))`, surviving browser reloads and tab closes.
- **Compounding fun:** Even a short run where you die at Age 43 still earns 401(k) Coins toward unlocking a new character or permanent rank, so no run ever feels wasted.

## Separating game simulation from camera projection (Oct 30)
- **Model-View separation:** All physics, collisions, timers, and AI still run in 2D (`(x, y)` coordinates in Phaser). The Three.js renderer (`src/view3d.js`) simply reads each entity's `(x, y)` every frame and maps it to 3D space `(x, height, z)`.
- **Camera feel is just math:** The difference between a **Diablo 3/4** dungeon crawler and a **3D Third-Person** shooter is purely camera placement, field-of-view (`38°` narrow isometric vs. `60°` wide chase camera), and lighting (warm close-range point light in dark fog vs. bright sky hemisphere light).

## DPS math, physical barriers, and 2.5D elevation (Oct 30)
- **Kills-per-second vs. Spawns-per-second:** In wave 1, if an enemy takes `2.0s` to kill (`2 HP` at `1 shot/sec`) but spawns every `0.9s`, the screen floods before the player can reach Level 2. Making basic Bills `1 HP` with a `0.65s` starter fire rate lets the player earn early XP and level up in rhythm with the waves.
- **2.5D Elevation (`ent.elev`):** Adding a single `.elev` number (`0` on the floor, `0..42` on the staircase ramp, `42` on the mezzanine deck) lets a 2D physics engine support multi-level platforms, guardrails, and 3D stair climbing across all three camera views!

## HTML/CSS overlay UI and CSS custom properties (Oct 30)
- **DOM UI over WebGL Canvas:** Instead of drawing text and menus inside the game canvas, layering a `<div id="ui-layer">` on top lets you use real Google Fonts, CSS flexbox/grid, `backdrop-filter: blur()`, and smooth CSS transitions while keeping the center 80% of the screen clear (`pointer-events: none`).
- **Chameleon theming with CSS variables:** Changing a single attribute (`#ui-layer[data-theme="0" | "1" | "2"]`) swaps `--font-head`, `--border-col`, `--pod-skew`, and `--hp-grad` across every HUD pod and modal card at once.

## Active-play clocks vs. wall-clock timers and mid-run save states (Oct 30)
- **Active-play time (`runElapsedMs += delta`):** Subtracting `startTime` from `scene.time.now` measures wall-clock time, which keeps ticking while the player is paused or reading Level-Up cards! Accumulating `delta` only when `!paused && !levelUpOpen` guarantees the Age clock and enemy timers (`bornAt`) freeze cleanly whenever a menu is open.
- **Two-tier `localStorage` persistence:** Separating permanent meta-progression (`midlife_survivors_save_v1`: coins, shop ranks, unlocked characters, and Decade Checkpoints) from a mid-run snapshot (`midlife_survivors_run_v1`: current Age, HP, level, and `stats` object) lets players pause, close the browser, and resume their exact run later without losing progress.

## Spatial menu navigation and direct HTML5 Gamepad polling (Oct 30)
- **2D Row/Column Menu Grid (`data-nav-row`):** Tagging every interactive DOM button/card with a `data-nav-row` number lets a single navigation manager (`window.menuNav`) handle `Left/Right` within a row and `Up/Down` between rows across every menu in the game using Arrow keys, WASD, or a controller.
- **Direct `navigator.getGamepads()` vs. canvas focus:** When an HTML UI overlay sits on top of a WebGL canvas, clicking DOM buttons shifts browser focus away from the canvas. Polling `navigator.getGamepads()` directly every frame keeps controller sticks and buttons working seamlessly across menus and gameplay.

## Compound + step XP curves and tiered perk gating (Oct 30)
- **Why pure multiplication (`Math.round(3 * 1.25)`) clusters early level-ups:** Multiplying a small starting number like `3` by `1.25` rounds to `4`, then `5`, then `6`, causing 5 level-up menus to pop up in the first 25 seconds and breaking combat flow. Using `Math.round(xpNeeded * 1.35 + 4)` starting at `8` spaces levels out (`8, 15, 24, 36, 53, 76, 107`) so you get real stretches of gameplay between upgrades.
- **3-Tier Perk Gating (`perkRanks`):** Requiring `coffeeRank >= 2` plus `hasSleep` before `Cold Brew Concentrate` can appear paces weapon evolutions into mid-career (Ages 50-65), while unlocking Senior Tier perks (`Executive Delegation`, `Titanium Knees`) for late-game scaling.

## Hold-then-fade speech bubbles and the Web Speech API (Oct 30)
- **Hold-then-fade + player tracking:** Starting an alpha-0 tween at `t = 0` makes text dim immediately and get left behind when the player walks. Keeping `alpha = 1` until `holdUntil` (`2.3s`) and updating `playerSpeech.setPosition(...)` above the player every frame makes quips effortless to read in motion.
- **Zero-asset voice acting (`window.speechSynthesis`):** `window.speechSynthesis.speak(new SpeechSynthesisUtterance(line))` lets the browser speak any string from `src/data/weapons.js` out loud with customizable `pitch` and `rate`, and zero audio files to download.

## Telephoto isometric lenses vs. wide-angle horizon cameras (Oct 30)
- **The Dolly-Zoom / Telephoto Isometric trick (`FOV 16°` at distance `1500`):** A wide lens (`FOV 38°-60°`) close to the ground creates strong perspective foreshortening. Pulling the camera far back (`(-760, 1060, +760)`) and narrowing the FOV to `16°` flattens perspective into true parallel isometric lines while revealing a wide tactical overview of the arena.
- **Why 3D immersion requires a visible horizon (`FOV 68°` at `y = 68`):** If a 3D camera sits high above the player (`y = 165`) looking down at the floor, the player only sees ground tiles. Dropping the camera down to shoulder height (`y = 68`) and tilting `lookAt` toward the horizon (`y = 34, z = -280`) reveals the 3D sky, glowing sun, clouds, and 3D skyscraper skyline.

## Data-driven world biomes and multi-zone procedural textures (Oct 30)
- **Data-driven stage tables (`src/data/stages.js`):** Putting each environment's unlock age, floor colors, 3D sky/fog hex codes, and enemy label overrides in one array (`window.STAGES`) lets the game transition seamlessly from an Office to a Hospital, a Suburban Home, a Social Courtyard, and a Senior Resort as you age.
- **Breaking up repetition with multi-zone 512x512 textures:** Instead of repeating a 2-tile checkerboard, drawing a corridor walkway band, a feature rug/court zone, and stage landmarks (triage lines, LEGO bricks, string-light pools, pickleball lines) inside a 512x512 canvas makes walking across the world feel like traversing real rooms and yards.

## Input abstraction layers and interactive key/button rebinding (Oct 30)
- **Separating physical inputs from game actions (`meta.controls`):** Instead of hardcoding `if (keys.W.isDown)` inside the movement loop, the game reads from a saved configuration table (`c.keyUp`, `c.padConfirmBtn`, `c.mouseMoveMode`, `c.touchMode`). That lets any key, mouse mode, touch layout, or controller button drive the same normalized `(x, y)` movement vector and menu actions.
- **Live event-capture rebinding (`window.rebindState`):** When a player clicks a binding row in the Input Configuration screen, the UI enters a temporary "listening" state (`window.rebindState = { type: "key", field: "keyUp" }`). The next `keydown` event or Gamepad button press is intercepted, saved to `localStorage`, and immediately reflected on the HUD buttons.

## Broadcast Lower-Third UI & Priority-Driven Contextual Narrative Engines (2026-10-30)
- **Why a Broadcast Lower-Third works so well for 3D & Isometric action games:** In a 3D chase-camera view (`AAA 3D`) or angled isometric view (`Diablo 3/4`), the top of the screen holds the horizon, distant enemies approaching from up-field, and environmental landmarks. Anchoring the HUD at the bottom (`margin-top: auto` inside a flex-column `#ui-layer`) clears the entire upper 82% of the viewport and gives the player a single peripheral eye-line at the bottom of the screen.
- **Priority-Queue Contextual UI (`updateContextAndRadar` + `window.pushContextEvent`):** Instead of showing static help text or forcing players to read a manual, a contextual ticker evaluates game state in priority order every HUD tick:
  1. **Event Triggers (`activeContextOverride`):** Time-stamped events pushed by gameplay actions (`window.pushContextEvent` when a Boss spawns, a Plant drops pizza, or an Overdue Bill splits in two) hold the ticker for a few seconds (`durationMs`).
  2. **Immediate Survival & Loot Checks:** If no override is active, the scanner checks live arrays (`hp <= 34%`, `bossCount > 0`, `chests.length > 0`, `pizzas.length > 0`, `player.slowTimer > 0`, `spamCount > 0`, `player.elev > 15`).
  3. **Ambient Chapter Storytelling (`STAGE_NARRATIVES`):** When the arena is calm, the ticker cycles every 6.5 seconds through story and tactical beats tailored to the active Life Stage (`office`, `hospital`, `home`, `social`, `senior`).

## Semantic Versioning (`Major.Phase.Build`) & Single-Source Build Metadata (2026-10-30)
- **Why games display a Version & Last Updated stamp on the Title Screen:** When playtesting across multiple devices (laptop, phone, GitHub Pages) or sharing a link with friends, browser caching can sometimes make you wonder *"Am I looking at the newest build?"* Putting a prominent **`V. 1.8.19 • Last updated on: Oct 30, 2026`** badge on the Title Screen gives instant visual confirmation.
- **Data-driven version file (`src/data/version.js`):** Storing the version number, date, and patch notes in a single data file (`window.GAME_VERSION`) means the Title Screen, the Pause Menu, the Lower-Third HUD, and the in-game Patch Notes modal all read from one place and never drift out of sync.

## Narrative Design & Data-Driven Worldbuilding (`src/data/lore.js`) (2026-10-30)
- **Why action-roguelikes benefit from a cohesive "Mythos Wrapper":** Even in a fast-paced arcade game where you dodge bills and throw coffee, giving the world a unified rulebook (*Form W-40: The Great Compounding*) turns abstract mechanics into a story. Suddenly, enemies splitting after 11 seconds isn't just a timer, it's compound interest; weapons pairing with passives aren't just stat boosts, they're Midlife Relics awakening.
- **Separating Lore Data (`src/data/lore.js`) from UI Presentation (`#lore-modal`):** By storing character bios, quotes, scenario lore, and boss profiles as plain JavaScript objects in `src/data/lore.js`, we can surface the exact same character backstory in multiple places (the Title Screen Subject Bio strip, the 4-tab Lore Archive modal, and future victory/ending cards) and tweak the writing anytime without touching UI code.

## Compounding Meta-Currency Curves (`window.getCoinYieldInfo`) (2026-10-30)
- **Why flat currency drops feel too slow in a scaling roguelike:** When shop upgrades scale in price (`baseCost * (rank + 1)`, so Rank 4 costs `48k`), a flat `+1k` coin value forces players to grind dozens of short runs. By tying coin value to **survival duration and Age (`1x -> 2x -> 3x -> 4x -> 5x -> 6x`)** plus **5-Year Survival Dividends**, the first 30 seconds stay grounded (`+1k` per coin) while surviving deep into a run snowballs your 401(k) just like real compound interest!

## Mobile Web Game UI Scaling (`viewport`, `dvh`, `pointer: coarse` & `touch-action: pan-y`) (2026-10-30)
- **Why `<meta name="viewport">` is essential for mobile web games:** Without `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, mobile browsers pretend the screen is `980px` wide and shrink all text and buttons down, preventing `@media (max-width: 768px)` from ever triggering.
- **Separating Canvas Touch (`touch-action: none`) from Modal Scroll (`touch-action: pan-y`):** A game canvas needs `touch-action: none` so dragging a virtual thumbstick doesn't scroll the browser window. However, modal cards (`.modal-card`) need `touch-action: pan-y` and `max-height: 94dvh` so players on small phone screens can swipe up and down through shop items and settings.
- **Designing for both Portrait (`max-width: 768px`) and Landscape (`max-height: 520px`):** Phones held vertically are narrow (`~390px` wide), while phones held horizontally are wide (`~844px`) but very short (`~390px` tall). Using both a width media query and a height media query ensures the Broadcast Lower-Third HUD stays under 22% of the screen in either orientation.

## Visual hierarchy in a HUD (Oct 30, Clean Screen)
- A HUD (heads-up display) is the info painted on top of the game. Every pixel it covers is a pixel you can't see danger in.
- Vampire Survivors shows only what you need **while dodging**: XP, time, health. Everything else waits for the pause menu.
- Health sits **under your character** because that's where your eyes already are.
- Same idea as framing a photo: one subject, nothing competing with it at the edges.

## Priority queues (Oct 30, Lower Third)
- Lots of things want to talk at once: bosses, tips, rewards. A **priority queue** decides who goes first.
- Each message gets a number (alert 5, tip 3, reward 1). A bigger number **interrupts** a smaller one; smaller ones **wait in line** or get skipped if they're minor.
- It's how a broadcast producer runs a lower third: breaking news beats the weather crawl.
- "Once ever" tips are remembered in the browser's **localStorage**, a tiny notebook the page keeps between visits.

## Progressive disclosure (Oct 30, Title Screen)
- Show the **one thing most people want first** (pick a character, press Start), and tuck everything else one tap away.
- Same menu items, just layered: Main, then Shop or Extras, with a Back button.
- It's the difference between a camera's shutter button and its settings menu. Both matter, only one gets the big button.

## Layers and z-index (Oct 30, UI test run)
- Every menu is a sheet of glass stacked on the screen. **z-index** is the number that says which sheet is on top.
- When two sheets have the **same number**, the one written later in the code wins. That's why Options opened behind the title screen.
- Fix: give "sub-menus" a higher number than the screen that opens them, so they always land on top.
- Saving settings needs both halves: **write** the value and **read it back** on load. The Tips switch almost forgot itself because the loader didn't know the new setting existed.

## Game time vs. real time (Oct 30, Menu Fixes)
- A timer that uses the **real clock** keeps ticking while you're in a menu. That's why lower third messages vanished before you could read them.
- The fix is a **game-time clock**: count down only while you're actually playing, and hold still when a menu is open.
- Same reason the age clock stops when you pause. Anything the player should see needs to run on game time.

## Display names vs. IDs (Oct 30, Credits)
- Every character has a **display name** (what you see) and an **ID** (what the save file remembers).
- We changed the name to The Soccer Dad but kept the ID `photographer`, so anyone who already unlocked it keeps it.
- Same idea as renaming a photo in Lightroom without breaking the catalog: the label changes, the file reference doesn't.

## Object pooling and the double-move bug (Oct 30, Steady Furniture)
- The office looks endless, but there are only **25 pieces of furniture**. As you walk, the ones behind you get picked up and set down ahead of you. That's called **object pooling**: reuse a few objects instead of creating thousands.
- Bug: we moved a desk, then the physics engine saw "it moved!" and moved it **again** by the same amount. Two cooks, one pot.
- Fix: tell physics this object never moves on its own (`body.moves = false`). It still blocks you; it just doesn't drift.

## Time scale and fast-forward testing (Oct 30, A Full Life)
- The whole game's pace hangs on one number: `secondsPerYear` in `src/data/player.js`. Changing 15 to 60 made every age-based event (bosses, chapters, dividends) four times further apart, with no other edits.
- To test an hour-long run in seconds, the test **fast-forwards the clock** straight to age 80 or 100. Game developers do this constantly; nobody plays the whole hour to check the ending.
- Each frame only counts a capped amount of time, so a laggy moment can't skip you ahead a whole year.

## Difficulty curves and set pieces (Oct 30, Swarms)
- A **difficulty curve** is a graph of "how hard" over time. Ours is a table like `[[40, 1], [60, 3], [90, 6]]`, and the game blends smoothly between the rows, so it never jumps.
- **Set pieces** are designed moments that break the rhythm: a ring of Bills closing in feels different from a steady drip, even with the same enemies.
- Good pacing alternates pressure and relief. The drip builds tension; a swarm spikes it; clearing it feels great.

## Balancing with a test you can repeat (Oct 30, Fight Back)
- "It feels too easy" becomes a number with a **repeatable test**: stand still at age 40 and record enemies on screen and HP lost every few seconds.
- Before: 3 enemies max, 0 HP lost in 40 seconds. After tuning: hit at 12 s, nearly out at 25-30 s.
- Change one or two numbers, rerun the same test, compare. That's how designers tune pacing without guessing.
- Watch out for **hidden links**: stretching years to a minute quietly made enemies 4x slower to toughen up.

## Enemy behaviors (Oct 30, Enemy Variety)
- Every enemy runs the same loop, but each **kind** gets its own little rulebook each frame: chase, charge, orbit, fade.
- **Ranged enemies** change everything: the Group Chat makes standing at a distance unsafe too, so there's no perfect spot to camp.
- Good enemies **telegraph**: "RING!", "typing...", or turning see-through warns you what's coming, so dodging feels fair.

## Weapon archetypes (Oct 30, Three New Weapons)
- Vampire Survivors weapons fall into a few **shapes**: aimed shots, auras, boomerangs, orbits, piercing lines. A new shape changes how you move; a new number on an old shape doesn't.
- **Hit windows:** a boomerang or orbit touches the same enemy many frames in a row. Each one remembers who it hit and waits a moment before hitting them again, or it would shred everything instantly.
- **Evolutions** reward combos: one weapon plus one passive becomes something bigger.

## Talking to a server (Oct 30, Leaderboard)
- GitHub Pages only serves files; it can't remember anything. A shared leaderboard needs a **database** somewhere else. Ours is Supabase.
- The game sends a score with `fetch()` (a web request) and asks for the top 10 the same way.
- The **public key** in the code is safe to share because the database's **rules** only allow reading and adding scores, never editing or deleting.
- If the internet drops, the score is still saved on the device: always have a fallback.


## Press vs. release (Oct 31, Playtest fix pack)
- Every tap is two events: **pointerdown** (finger touches) and **pointerup** (finger lifts).
- The Retry button used to fire on *down*, so the game restarted mid-touch and the new run never saw the finger lift. Steering froze.
- Now touch buttons fire on *up*, like most phone apps. Mouse clicks still fire on down so the desktop feels snappy.
- Same idea protects perks: on phones the first tap only **selects** a card and the second tap **confirms**.


## Modes are just data (Oct 31, Midlife mode)
- The game code didn't fork into two games. `src/data/modes.js` holds two small **rulebooks**: ages, clock speed, bosses, ending, leaderboard table.
- When a run starts, the game looks up the chosen rulebook and every system reads from it.
- Want a 10-minute "Speed Midlife" later? Add one more entry to the list. No new game logic.


## Caching (Oct 31, reload fix)
- Browsers keep copies of web files (a **cache**) so pages load faster. GitHub Pages lets them reuse the page for about 10 minutes.
- Right after an update, a reload could pair an **old page** with **new code**, which didn't match, so the controls broke until a second reload.
- Fix: the page now loads one tiny file, `src/loader.js`, fresh every time, and that file lists every code file with the same build number. Everything always matches.


## Timed effects (Oct 31, items)
- A temporary boost is just a **deadline**: when you grab an Energy Drink, the game writes down "fast until 12 seconds from now."
- Every frame it asks one question: is it before the deadline? If yes, multiply speed. If no, do nothing.
- Because the deadline uses game time, pausing freezes the boost too. No timer can run out while you read a menu.


## Events (Oct 31, achievements)
- Instead of checking 29 achievements everywhere, the game **announces events**: "an enemy was beaten," "a plant was smashed," "a boss went down."
- Each achievement **listens** for one kind of event and runs a tiny test ("was it a 3 AM Thought?").
- Adding an achievement is one line in `src/data/achievements.js`. The game code doesn't change.


## Playtesting with a bot (Oct 31, difficulty pass)
- A **bot** is a tiny script that plays the game: it dodges enemies, walks to gems and picks random perks.
- The test browser **fast-forwards the clock**, so a 5-minute run takes about 2 real minutes. Three bots ran at once: new player, half upgraded, fully upgraded.
- **Scaling with the player:** enemies now get tougher and more numerous as *you* level up. Level-up perks keep you even; permanent shop upgrades put you ahead. That's what makes repeat runs matter.

## Opt-in difficulty (Nov 1, Tax Bracket)
- Games like Vampire Survivors and Hades let veterans **choose** extra pain for extra rewards. New players never see it unless they go looking.
- The bracket is **locked in when the run starts**, so you can't lower it halfway through.
- All the numbers live in one small file, `src/data/heat.js`, and every system reads from it through one helper.

## Wayfinding (Nov 1, larger office, Codex)
A large level needs clues about where to go. **Wayfinding** means using floor materials, landmarks and light to make routes understandable. The atrium rug gives us a home base; wood paths and paper trails suggest destinations. Loops let us return by a different route, while the revealing map remembers where we have been.

`Atrium → wood path → department → outer loop → a different way home`

## Contact shadows (Nov 1, furniture grounding, Codex)
A **contact shadow** is the small dark area where an object meets the floor. A gap between the object and its shadow makes it look airborne. The preview now traces furniture bases so the shadow touches the feet, wheels and pot bottoms. A lighter cast extends toward the lower right, matching the light from the upper left. Chair mats and wear marks provide extra clues about where furniture sits.

`Sprite base → tight contact shadow → lighter cast on the floor`

## Negative space (Nov 1, devlog cover, Codex)
**Negative space** is a calmer part of an image where the eye can rest. Leaving the left third quiet gives a later title room to breathe. Placing the hero and enemies to the right keeps their silhouettes readable without filling the title area with detail.

## Crop-safe composition (Nov 1, title art, Codex)
A wide image loses its sides when cropped for a phone. Keeping the middle calm protects menu readability, but characters placed in the outer thirds can disappear. The lobby crop demonstrates that tradeoff. A separate mobile composition can keep both the story and the controls visible.

## Opposite steps in a walk loop (Nov 1, Bill, Codex)
A four-frame walk needs opposite foot poses so it reads as walking rather than hopping. Frames one and three carry the two strides; the frames between them pass the feet under the body. Keeping one scale and a common foot baseline prevents the sprite from growing or floating between poses. We corrected the generated Bill's repeated third step before exporting it.

`left stride → feet pass → right stride → feet pass → repeat`

## Matching a photograph to a game palette (Nov 1, studio portrait, Codex)
A photograph can join the game's visual world without turning its subject into a game character. Keep the recognizable face, pose and setting, then simplify surfaces into pixel-color clusters. Reusing navy shadows and warm cream highlights ties the portrait to the office art. A versioned image filename also helps the updated page avoid a stale cached portrait.

## Shape language (Nov 1, bio refinement, Codex)
Matching pixel sizes alone does not match an art style. **Shape language** means how an artist simplifies faces, props and shadows into recognizable forms. The revised portrait uses the same bold outlines and broad warm/cool shapes as the office art, with quieter interior detail. This makes it belong to the same world while keeping Rami recognizable.

## Choosing between art revisions (Nov 1, bio comparison, Codex)
A closer style match can still lose qualities we liked in an earlier image. Rami preferred the first studio portrait's likeness and atmosphere. Keeping versioned files made restoring that choice a small reference change instead of regenerating the art.

## Designing at favicon size (Nov 1, Clocking Out, Codex)
A **favicon** is the tiny image in a browser tab. Fine detail disappears there, so we draw the important silhouette at 16x16 first. The 32px version repeats each pixel as a 2x2 block, keeping the edges crisp. Larger versions share that same shape, so the header and browser tab feel related.

`16px original → 32px (2x) → 64px (4x)`

## Animation personality and anchors (Nov 1, enemy batch, Codex)
An **anchor** is the point a sprite stays attached to as its pose changes. Walkers share a foot baseline so they do not jitter above the floor. A bounce deliberately lifts the sprite while its world position stays on the ground. Floating effects use a shared center. Different timing gives each enemy a personality without changing its gameplay speed.

`feet stay put → pose changes → sprite feels grounded`

The enemy review page lets us pause the loop and inspect each pose at the actual game size before connecting it to combat.

## Separating the drawing from the hitbox (Nov 1, enemy integration, Codex)
A **hitbox** is the invisible shape the game checks for collisions. Replacing its texture can accidentally resize that shape. Here, the original enemy keeps its physics body while a separate animated drawing follows it. The drawing can change pose and size without changing which attacks connect.

`unchanged physics body → position / facing / state → animated drawing`

## Sorting by feet (Nov 1, hero and office integration, Codex)
In a three-quarter view, a desk's drawing extends upward from the place it touches the floor. **Drawing order** decides which object appears in front. Comparing the hero's feet with the furniture's floor position lets the hero pass behind a desk naturally. A little transparency on the one desk concealing the hero preserves visibility without changing collisions.

`hero feet above desk base → desk in front`
`hero feet below desk base → hero in front`

## Versioning a published image (Nov 1, twins portrait, Codex)
A new image filename lets a published page load a revision without relying on readers to clear their browser cache. The devlog has both a Markdown source and a static share page; both must reference the same image. Keeping the previous PNG makes reverting the art a small reference change.

## Landmarks, loops and fighting space (Nov 1, Stage Pass, Codex)
A **landmark** lets you recognize an area without opening a map. A **loop** gives you another way out when enemies follow. A clear plaza gives a swarm room to spread out. In the campus proposal, the illustration tests the personality while a separate measured plan checks that those spaces actually connect.

`landmark pocket → clear plaza → two or more routes → next district`


## Promotion gates and reachable floor (V. 1.28.17, Codex)
An unlock list says which rooms you should enter. A reachability check also asks whether you can physically get there without sneaking through a wall gap or wrapping around a gate. We close the proposed door rectangles, then flood outward from the Lobby across the remaining floor. Locked wings must never join that flood, including at opposite map edges.

```text
40: Lobby <--> large Bullpen
45:   + Break Room + Parking
50:   + Server + Conference
55:   + Executive
60:   + Wellness
Secret achievement --> tiny Archive
```

This validates the floor proposal before furniture is placed. Runtime enemies and door animations still need their own implementation and crowd tests.


## Art bounds and clear openings (V. 1.28.18, Codex)
A gate's picture can be wider than its usable doorway. We measure the doorway separately so decorative posts do not silently squeeze a swarm. Both posts stand outside the 224px clear span, and open panels must retract completely out of it. The same separation lets a desk have a small floor footprint while its monitor rises above that footprint.

```text
24px post |<-------- 224px clear -------->| 24px post
          -112                         +112
          no jamb or open leaf inside
```

The manifest carries native image size, foot-point origin and proposed footprint as separate data. Runtime collision and enemy navigation still belong to implementation and testing.

## Flow field (V. 1.29.0)
Instead of every enemy solving its own maze, the game floods outward from the player once and writes "steps to reach you" on every floor cell. Each enemy walks toward a neighbor with a smaller number, so whole swarms pour around desks and through doorways. It rebuilds a few times a second and costs almost nothing per enemy. Bonus: a cell with no number can't reach you, which is how spawning avoids desks and locked rooms.


## Color variants and materials (V. 1.29.2, Codex)
Color variants reuse one shape and floor footprint while changing selected surfaces. A pool can have a different rim while its water stays blue-green, and a tree can have a different pot while its leaves stay green. This creates variety without introducing different collision shapes. The native checker confirms both colorways have exactly the same occupied pixels.

```text
Same shape + same floor footprint
                 |
          two colorways
       |                 |
 rim / pot changes    water / leaves stay
```

## Hit boxes vs. pictures (V. 1.30.0)
The sprite you see, the "size" number in a data file and the physics box that decides damage can all be different. Close Calls first used the 32px size number, but the player's real hit box is 48x52, so "near misses" were actually hits. Measuring between the real hit boxes fixed it. Test against whatever actually decides the outcome.

## Put messages where the eyes are (V. 1.30.2)
In a fast game, players stare at their character. Anything that changes the fight (a boss, a penalty, a power-up) needs to appear close to the action, in two or three big words. Long sentences can live at the edge of the screen for anyone who wants the details. Ben's playtest proved the bottom bar alone was too far away.

## Stuck touches (Nov 1)
A game engine tracks each finger as a "pointer" with a slot. It frees the slot when it hears the finger lift. On iPhone, if the button you tapped disappears mid-tap, the lift message goes to the vanished button and the engine never hears it. The slot stays "held," and once the slots are full, new touches are ignored. Ben guessed it almost exactly: an input layer that wasn't clearing when the store closed.

## Camera zoom (Nov 1)
The game draws the world one pixel per screen pixel, so a bigger monitor just shows more office, with everything tiny. Now the camera zooms in based on screen size, aiming to show about the same amount of office everywhere (roughly 640 pixels across the short side). Zooming in also means you see less around you, so enemies show up closer. Screen size quietly changes difficulty.

## Vertical slice (V. 1.31.0, Codex)
A vertical slice finishes a small playable part of the game all the way through. Our Lobby and Bullpen combine final-sized props, floors, collision, enemies and captions so Rami can judge how they feel together. Testing those two areas catches scale and movement problems before they spread across nine districts. Reusable tiles and prop IDs let us rearrange the slice without painting a new map.

```text
64px tiles + prop IDs + floor footprints
                    |
        playable Lobby and Bullpen
                    |
       Rami plays and gives feedback
                    |
          build the next district
```

## Line of sight (Nov 2)
Enemies take a shortcut and chase you directly when the path is "nearly straight." The old test only compared distances, so a Bill right behind a small roundabout thought the detour was short enough to ignore and walked into it. Now it also traces the straight line across the grid and only charges if no furniture sits on it. Checking "can I actually see you?" is called line of sight.

## Look size vs hit box (Nov 2)
What you see and what you bump into don't have to match. Regular enemies grew in both. Bosses got huge on screen, but their hit box is only half that, so a giant Performance Review can still squeeze between desks instead of jamming. Games fake this all the time; it usually feels fairer when hit boxes are a little smaller than the art.

## Profiling (Nov 2)
Before speeding a game up, measure where each frame's time goes; guesses are usually wrong. A profiler samples what the computer is doing thousands of times a second. Ours showed shadows being redrawn from scratch every frame (now painted once into images), and 120 Hz iPads running all the game logic twice as often as needed. A frame has about 16 milliseconds at 60 fps, so every millisecond counts.

## Juice (Nov 2)
"Juice" is game-dev slang for feedback that makes actions feel good without changing the rules: a white flash on hit, a squash, a little shove, a pop when something dies, a sound that rises in pitch during a streak. None of it changes damage or hit boxes. Players describe juicy games as "satisfying" without knowing why. The pentatonic trick: any notes from a 5-note major scale sound good together, so dozens of overlapping kill sounds become a melody instead of noise.

## Telegraphs (Nov 2)
A telegraph is the warning before an attack: the orange lane before the charge, the ghost ring before the Mortgage fires. Good boss fights are fair because you can see what's coming and react, so the warning has a minimum length (about half a second, enough for a thumb on a phone). Bosses run a tiny state machine: chase, then telegraph, then attack, then recover, then back to chase.

## Anticipation (Nov 2, Codex)
Anticipation is the warning pose before an attack. A clipboard pulling back or a car revving tells the player to move before damage happens. A bold silhouette helps that warning remain visible in a crowded fight. Art supplies the poses; Claude will set the timing and collision after review.

```text
walk / drive  ->  wind-up  ->  attack  ->  recover
                     |
              time to move away
```


## 2026-11-02: A room can be built before its door opens (Codex)
The map and the promotion rule are separate pieces. We can finish a room's floor, furniture and captions while its doorway stays solid. The review page temporarily removes that doorway inside an isolated test game so we can check traffic. The shipped game keeps it closed until Claude connects the age rule.

`Lobby → closed age-45 door → finished room → closed age-50 door → future room`

## Unlocking areas (Nov 2)
A locked door in a game is usually two things: a wall you can't walk through, and an invisible "no entry" zone for enemy pathfinding so they don't try to route through it. Opening the door removes both at once: the door's body is switched off, and its zone is taken out of the list the flow field reads. From then on, enemies can spawn in the new room and follow you there, and the map just got much bigger.

## Guarding the right lines (Nov 2)
`if (thing)` without braces only protects the very next line. The speed pass added a second line under the shadow check, but indentation made it look protected when it wasn't. The 3 AM Thought has no shadow, so that second line tried to read a shadow that didn't exist and crashed. Braces `{ }` make the guard cover every line you meant, no matter how it's indented.

## Background tabs and timers (Nov 2)
When a tab is hidden or the phone is locked, browsers don't stop JavaScript timers, they slow them down to about once a second to save battery. Our music is played by a timer that fires a note every beat, so in the background it kept firing, just slowly: a sad little plink. The fix is to listen for the page becoming hidden and put the whole audio system to sleep (`audioCtx.suspend()`), then wake it when the page is visible again.

## Teleporting through walls (Nov 2)
Physics only stops things that *move* into a wall. If code jumps an object straight to a new spot ("teleporting" it), the physics engine never sees the trip, so it can land on the far side of a thin wall. That's what the "No." shove did: it set each Bill's position 95px away in one jump. The fix is to move in small steps and check each step before taking it, stopping at the first wall. Games call the original problem "tunneling."

## When two good routes cancel out (Nov 2)
Our enemies blend all the "downhill" directions on the route map so they move smoothly. Directly behind a wide desk, the way around the left and the way around the right are equally good, so those two pulls cancel. The only pulls left were the small diagonal ones pointing back up behind the desk, so the enemy walked *away* from you. The fix: compare the blend with the single best step, and if they disagree a lot, trust the best step. Each enemy also picks a favorite side, so a crowd splits around the desk instead of freezing.

## Choreographing a "moment" (Nov 3)
A big moment like the chest opening is really a **timeline**: a list of small events, each scheduled a beat after the last (shake at 0 s, burst at 0.7 s, first beam lands at 1.6 s, the next 0.4 s later, then the counter). The game is **paused** underneath, so the show runs on the clock in the browser, not the game clock. A **SKIP** button just cancels the remaining timers and jumps every piece to its final state. Vampire Survivors does the same thing: the reward is decided the instant you touch the chest. Everything after that is theater.

## Fodder and heavies (Nov 3)
A good swarm mixes **fodder** (enemies that die in one hit, so mowing them down feels powerful) with **heavies** (elites that take many hits and force you to move). If everything is fodder, the crowd stops being a threat. If everything is a heavy, it's a slog. A trick to keep heavies heavy: set their health from the *player's* current damage ("at least 5 hits"), so upgrades still make fodder melt but never trivialize the elites.

## Lighting with a "cut-out" layer (Nov 3)
Game lighting is mostly a trick. We lay one sheet of dark navy over the whole office, then **erase soft holes** in it wherever light comes from: lamps, windows, vending machines, server racks, screens and the hero. Colored **glows** on top, blended to "add" light, give lamps their warm yellow and screens their cool blue. The sheet gets a little darker every year you age, so a run starts bright and ends after hours. One gotcha: the dark sheet has to be drawn **on top of everything in the world** (we sort props by height, so desks sit at depths around 12,000), but under the numbers and flashes you need to read.

## State machine (Nov 3, the Lounge)
The Lounge is always in exactly one state: CLOSED, OPEN or BROWSING. Each frame the game checks a few rules to decide whether to move to another state (a promotion opens it, walking up starts browsing, the timer or a boss closes it). Writing it this way keeps the rules simple and stops weird combinations, like shopping while the counter is closed.

```
CLOSED --promotion + Break Room open--> OPEN --you walk up, no crowd--> BROWSING
  ^                                      |                                 |
  +-----timer ends / boss / tax----------+<-----------BACK TO WORK---------+
```

## Priority queue (Nov 3)
When several things want the same spot on screen, a **priority queue** decides who goes next. Each Spotlight card gets a rank (boss highest, tips lowest) and a time stamp. The game always shows the highest-ranked card first, waits a few seconds between cards so they don't pile up, and throws away cards that have waited too long to still make sense. It's the same idea as a dispatcher at a busy desk: urgent calls jump the line, and stale messages get tossed.

## Caching (Nov 3, Quick Retry)
A **cache** is a place to keep the result of slow work so you don't redo it. The office art starts as compressed pictures that have to be unpacked and cut into pieces, which takes a while. The game kept those pieces after a run, but on Quick Retry it still unpacked every picture again before checking. Now it checks first ("do I already have this piece?") and skips the slow part, so the office rebuild dropped from about 5 seconds to half a second in testing. It's like keeping your camera bag packed between shoots instead of unpacking and repacking it every time.


## 2026-11-04: Checking a camera-only sprite edit (Codex)
A pixel comparison can prove a small art edit stayed small. Derek's v2 portrait changes only the camera masks in 22 frames; every pixel outside those masks and every transparency value matches v1. This keeps the existing poses, expressions and timing safe while one detail is improved.

## Object pooling (Nov 4, damage numbers)
Making a new thing on screen costs time: the game has to build it, draw its picture and later throw it away. Damage numbers used to do that for every single hit, hundreds of times late in a run. A **pool** makes about 40 numbers once and reuses them: when one fades out, it's hidden and waits to be the next "-3". It's like a coffee shop keeping a stack of mugs instead of buying a new mug for every order.

## Scarcity makes choices (Nov 4, the loadout)
- When you can carry everything, picking a card isn't a decision. It's just a delay.
- A **slot limit** (6 weapons, 6 passives) turns every level-up into a trade-off: take the freeze now, or save the slot for a healer?
- Vampire Survivors works the same way. The fun is in the build you commit to, not in owning everything.
- Labels (Healing, Shield, Offense, Defense) help players see what kind of build they're making, so they can lean into a style on purpose.

## 2026-11-04: Floor anchors in animation (Codex)
The clock-out station keeps the same floor anchor in every pose. Its balloons and card can move while the pedestal, gifts and fish frame stay planted, so a celebratory animation does not look like the furniture is sliding.
## Logging in vs. being allowed (Nov 4, accounts)
- **Authentication** is "who are you?" The emailed code proves you own that email, and you get a signed pass (a token).
- **Authorization** is "what can you touch?" Row-level security in Supabase checks the pass on every request: you can only read and write the row with your own ID.
- That's why the game can ship the public key safely. The key opens the front door; the row rules decide which locker is yours.


## 2026-11-04: Modular wall art (Codex)
A shared 32px unit lets differently shaped props fill the same wall length. A 128px cabinet, 64px poster and 64px shelf allocate exactly 256px, while a different mix can fill another segment. Module width is layout space; the smaller floor footprint is what a solid object will actually block.


## 2026-11-04: Comparing characters at native scale (Codex)
An enlarged sheet can hide a size mistake. Comparing each coworker beside the actual hero caught an undersized Nora export before delivery. Uniform scaling and an explicit shoe or chair-wheel line keep different poses at the same world scale without squeezing their proportions.

## Graphics memory (Nov 4)
Every picture the game shows lives in the graphics card's own memory as raw pixels, about 4 bytes each, no matter how small the PNG file was. A 1000 x 1000 floor costs 4 MB there even if the file is 50 KB. When a browser runs short, it can take the graphics away entirely (that was the white screen). Baking the floors into tiles we already had saved about 100 MB.

## Webhooks (Nov 4, Discord posts)
- A **webhook** is a private web address that posts to one Discord channel. Anything that has the address can post there, so it stays in GitHub's locked secrets, never in the code.
- **GitHub Actions** is a robot that runs a script when something happens: a push, a schedule or a button press.
- A robot forgets everything between runs, so it writes down what it already posted in a small **state file**. That's what stops double posts.

## Fog of war (Nov 4)
The minimap starts dark and only shows places you've been near. Under the hood, the office is split into a grid of 128-pixel squares, and every fifth of a second the game marks the squares around you as "seen." When the map draws, it paints the whole floor plan, then keeps only the seen squares, like a stencil. Strategy games call this "fog of war." It turns exploring into a reward, because the map only fills in when you go somewhere new.

### 2026-11-04: Separating a prop's picture from its footprint (Codex)
The Lounge desk picture includes monitors and two chairs, but the floor footprint only describes the space that blocks walking. Wall photos and shelves add visual detail without adding floor collision. Keeping that information in the art manifest lets Claude arrange the room and preserve the walking routes without repainting its furniture.

## Footprints (Nov 4, the Student Lounge)
- A prop's **picture** and its **footprint** are two different boxes. The futon picture is 128 x 72, but only a 116 x 24 strip at its base is solid.
- That's why you can walk "behind" the futon's backrest without hitting an invisible wall: the solid part is just where the legs touch the floor.
- The **foot point** (bottom-center of the picture) is where the prop stands. The game sorts drawing order by that point, so whoever's feet are lower on screen gets drawn in front.

## Draw order, or "who's in front?" (Nov 4, TJ behind the walls)
- In a top-down game, whoever's **feet are lower on the screen** should be drawn in front. The game turns each thing's foot position into a **depth** number every frame: bigger depth = drawn later = in front.
- TJ and Derek had a fixed small depth, so every wall (which uses the foot rule) was drawn over them. Putting them on the same rule fixed it.
- Labels and speech bubbles skip the rule and get a huge depth, so nothing can ever cover them.

### 2026-11-04: A pixel budget keeps floor effects quiet (Codex)
A 32x20 remains cell has 640 possible pixels, but each debris pile uses fewer than 30. That leaves room for the floor to show through when many defeated enemies overlap. The faint thought-wisp uses spaced lavender pixels instead of soft transparency, so it stays crisp after the magenta background is keyed out.

### 2026-11-05 Checking an effect against its backdrop (Codex)

A decal inherits the wall behind it. Navy fissures and cream chips give the bonk two levels of contrast on both tan and teal. Comparing the same sprites at 1× makes it easier to catch branches that disappear at game size.

## Gating, or "earn it first" (Nov 5, Sleep On It)
- **Gating** means a feature exists in the game but stays locked until the player does something. Sprint waits for the V8; Sleep On It waits for age 55.
- It spreads new things across many runs, so a player always has a next goal, and it teaches features one at a time instead of all on the first screen.
- In code it's one line of data: `unlockAchievement: "middleManagement"` on the shop item. The shop reads it and shows a lock until that achievement is earned.

## Saving and loading: allowlists can forget things (Nov 5)
- The save file is a list of named values (coins, ranks, mapFound...). Loading it used a fixed list of names to copy back, called an **allowlist**.
- Anything added later and not put on that list worked fine until a reload, then quietly vanished. That's how the office map "forgot" you found it.
- Fix: copy everything that was saved first, then clean up the important fields. New features now persist without anyone remembering to update the list.

## 2026-11-05 Separate effect layers (Codex)

Mic Drop has three pieces of art: the falling mic, the feedback above it and the ring on the floor. That lets the ring grow to the attack's radius while the mic stays the same size. The ring's empty center keeps enemies readable as it passes over them.

## 2026-11-05 Recompose for a smaller screen (Codex)

The retirement strip has the same guests and animation beats on both screens. Moving the guests into two tiers gives the phone layout more room without shrinking faces or props. Keeping the two loops at the same frame rate also lets the screen choose a layout without changing the celebration's pace.

## Crossfading and loading music on demand (Nov 5, V2.7.9)
- **Crossfade:** when the music changes, the old track fades down while the new one fades up over a few seconds, so there's never a hard cut or silence.
- **Seamless loops:** AI tracks have an intro and an ending, so the game starts the next play 4 seconds before the current one ends and crossfades them.
- **Load on demand:** the game only downloads a song when it's about to need it (the busy track starts downloading while the calm one plays). Phones don't pay for music you never reach.
- **Audio bus:** all music runs through one volume knob (the "music bus"), which is why the music slider and mute still work.

## Animation speed vs. movement speed (Nov 5, V2.7.10, from Paul McKinney)
- The walk used to pick its frame by **distance moved**. Small or uneven moves meant the frames stalled, then jumped, so the hero seemed to glide with blips.
- Now it runs on a **steady clock** (95 ms per frame). A walk cycle reads as a rhythm, and a steady rhythm looks intentional even if the feet slide a little.
- **Pixel reuse:** good pixel animation keeps most pixels identical between frames and moves only what should move. The Sprite Board's CHANGED PIXELS view shows this in red.

## 2026-11-05 A walk needs two different steps (Codex)

A walk loop reads when the foot in front switches sides. Keep the head and shirt on one fixed drawing, then move the feet and arms around it. In the Sprite Board's Changed Pixels view, a body bob shows up as a one-pixel shift across the torso while ordinary steps light up the moving limbs.

## 2026-11-05 Let the pose hold (Codex)

The Sprite Board can highlight every pixel that changed between frames. If a coworker is typing, the red should sit at the hands. Keeping the chair and face still makes the gesture easier to read.

## Spatial navigation (Nov 5, V2.10.0)
- Our menus used numbered rows, so "down" meant "next row number", which didn't always match what's below on screen. That's why the cursor jumped around on the TV.
- Spatial navigation measures where every button actually sits and picks the nearest one in the direction you pressed, the way TV and console menus work. If nothing is that way, the page scrolls instead.
- Bonus: it keeps working when the layout changes (phone vs. iPad vs. TV) with no extra setup.

## 2026-11-05 Transparent sprite edges (Codex)

RGBA stores an alpha value alongside each pixel's color. A fully transparent pixel lets the room show through, and a fully opaque one holds the sprite color. Sticking to those two values and using nearest-neighbor sampling keeps the outlines sharp.

## 2026-11-05 Check a sprite at the size players see (Codex)

The XP gem lives in a 32px cell, but it has to read at 16px on carpet. A cream facet and dark outline survive that reduction. Checking against the actual carpet shows which details still read at play size.

## Reading the swarm by motion (Nov 5)
When hundreds of enemies are on screen, you can't read their faces, but you can read how they move. Giving each enemy type its own path (straight, weaving, dashing, stop-and-go) lets the player tell them apart at a glance, even on a phone. The 3 AM Thought's weave only adds a sideways push on a sine wave, so it still closes in at the same speed. Game designers call this a "motion silhouette."

## Reading list
- **Shovel Knight** by David L. Craddock (Boss Fight Books, 2018). Recommended by Paul McKinney (Nov 2026). How Yacht Club Games built Shovel Knight. [Boss Fight Books](https://bossfightbooks.com/products/shovel-knight-by-david-l-craddock)
- **Teaching the Game** (2nd ed., 2026), edited by Richard Ferdig, Emily Baumgartner and Enrico Gandolfi (Kent State). About 60 real game design courses. Free: https://doi.org/10.17613/2j5eh-p5n15 (digest in the Project: TEACHING_THE_GAME_DIGEST.md)
- **Game Programming for Artists** by Jarryd Huntley and Hanna Brady (CRC Press). Hanna is Damian's wife and a game industry veteran. [Bookshop.org](https://bookshop.org/books/game-programming-for-artists/9781138106130) · Hanna also wrote **Animal Friends Alphabet Book**. [All her books](https://www.goodreads.com/author/list/15932500.Hanna_Brady)
- **Miyamoto's World 1-1 design breakdown** (video), also from Paul: how the first level of Super Mario Bros. teaches you the game without words.

## Caching (Nov 6)
When you visit a website, your browser and the web host both keep a copy of the files so the next visit is faster. That's a **cache**. GitHub Pages tells everyone to keep the main page for 10 minutes, which is why updates seemed slow. The fix is to ask for files at a brand-new address (adding something like `?b=270` to the end): nobody has a copy of that address yet, so they have to fetch the real, current file.


## 2026-11-07: Paired background plates (Codex)

A background plate is a scene without its characters. Keeping the camera and main furniture in place lets the same character performance work in daylight or at night. The Flow set leaves a clear floor for that performance and puts the room's story around its edges.

## 2026-11-07: Identity and style references (Codex)

An identity reference says who the character is, including face, outfit and accessories. A style reference says how to draw them. Keeping those roles separate lets the six Flow cast members share the 9-to-5er's key-art look while retaining their own features.

## Sliding props keep their pixels (Nov 7, 2026, Codex)
A sliding door can reuse one slab while the frame stays fixed. A narrow cell clips the slab as it exits; a wider helper can show the whole translated prop. Keeping the pixels unchanged prevents the furniture from morphing during motion.

## An intro can move without redrawing everything (Nov 7, 2026, Codex)
The Performance Review intro keeps one background and one fixed clipboard face/chart. Its poses edit just the head, arms and feet on a common pixel grid. Registered full-screen layers let playback switch poses without moving the actors around the room.

## Kill rate is the hidden difficulty dial (Nov 7, 2026)
In a survivors game, the swarm is also your XP. Players who stay close to the crowd and kill more level up faster, and their power keeps pace with the swarm. Players who kite at a safe distance kill less, fall behind on levels, and hit a wall in the 50s. That's why "dying more" and "playing safe" can be the same thing.

## Afterimages are cheap "juice" (Nov 7, 2026)
"Juice" is feedback that makes an action feel good without changing the rules. A Close Call already gave a speed burst, but nobody could see it. Three fading copies of the hero, drawn a tenth of a second apart, make the burst visible for almost no cost.

## Rubber banding (Nov 8, 2026)
Racing games quietly speed up the cars in last place so the race stays close. That's called rubber banding. Our catch-up XP is the same idea: if you're behind the level most players have at your age, gems are worth a little more until you catch up. Good players never notice it, and careful players stop hitting a wall in their 50s. The trick is keeping it gentle (a cap of +60%) so it helps without playing the game for you.

## Objectives pull players around the map (Nov 8, 2026)
In a survivors game, the safest move is to circle the edges forever. A small objective (an errand) gives the player a reason to cross the room, which makes them meet the swarm, pick up XP, and actually see the office you built. Good objectives are optional, short, and point the way clearly (marker, map dot, edge arrow), so they feel like a dare rather than a chore.

## Losing the graphics card (WebGL context loss), Nov 8
The game draws with WebGL, which borrows the computer's graphics card. If the browser needs that memory back (too many tabs, a big new character sheet, a phone going to sleep), it can yank it away mid-game and hand it back a moment later. Anything the game painted itself, like the floor and the character sprites, is gone when it comes back, while text quietly redraws. That's why Rami saw names and numbers floating in a dark office. The safe move is to save the run when the graphics leave and reload the page when they return.

## Streaming (only load what's near you), Nov 8
Big games don't keep the whole world in memory. They load the part around the player and let go of the parts far away, which is called streaming. Our office floor used to be painted all at once into 34 big tiles, and Safari on a MacBook ran out of graphics memory. Now the game paints only the tiles near the camera and reuses their canvases as you walk, like laying track just ahead of a moving train.

## Punish windows and locked aim (Nov 9, Your New Boss)
A fair boss gives you a rhythm: dodge, then hit back. Your New Boss locks his aim the moment the arrows appear, so stepping sideways always works, and he never curves to follow you. After his dashes he stands still for about a second (thumbs up, catching his breath). Game designers call that a "punish window": the boss is open, and the player gets rewarded for dodging well. Without it, a fast boss just feels unfair; with it, the fight becomes a little dance.

## Breadcrumb trails (Nov 9, the conga line)
To make dancers follow the Holiday Party's exact path, the leader drops an invisible breadcrumb every 8 pixels as she walks. Each dancer walks toward the crumb a fixed distance behind (dancer 1 at 34 px, dancer 2 at 68 px, and so on), so the whole line snakes around desks the same way she did. When one dancer drops, the ones behind it pause for half a second, then hurry to close the gap. It's the same trick the classic Snake game uses.

## Making a boss matter (Nov 9, the Holiday Party fix)
A boss is memorable when it makes you change how you play. The first Holiday Party just soaked damage, so a strong build melted her without noticing. Now her conga line works like a shield: you have to break the line first, then hit her before it rebuilds. Same art and numbers, but a new rule that turns the fight into a little puzzle.

## Flood fill (Nov 9, The Reorg's "never boxed in" check)
Before The Reorg slides a desk, the game pretends the desk is already in its new spot and lays an invisible grid over the screen. It starts at your square and spreads to every open neighbor, like spilled paint, which is called a flood fill. If the paint can reach at least two edges of the screen through a gap two squares wide, the move is safe. If not, he picks a different desk or a different direction. Paint bucket tools in art apps use the same idea.

## Dynamic difficulty (Nov 9, Workload)
Some games quietly watch how you're doing and adjust. Workload checks three signs every 20 seconds (full health, a quiet room, barely moving), and when you're clearly cruising, it adds a little more work. The key is that it backs off the moment you struggle, and it pays you for the extra effort, so it feels like a promotion, not a punishment. A good rule: show it on screen (the pips) so the player never feels the game cheating behind their back.

## Shooting bullets out of the air (Nov 9, hittable pings)
A game keeps its flying things in groups: your coffee splashes in one bag, enemy pings in another. Collision is just asking "is anything in bag A touching anything in bag B?" The game already asked that for splashes vs. enemies and pings vs. you, so letting you shoot pings down only took one new question: splashes vs. pings. Area weapons like Dad Joke don't fly, so for those the game checks distance instead: any ping inside the circle pops.

## Rewards that feel like rewards (Nov 9, Errand payoff)
A reward only lands if you can feel it in the next few seconds. Coins go into a number you don't watch, so the errand felt flat. The fix stacks three things you notice right away: something you see (a shockwave that empties the room), something you feel (15 s of hitting harder) and something that shows up on the bar (bonus XP). A small timer chip tells you the good part is still on, so you play differently while it lasts.

## Exponential curves run away (Nov 9, Performance Bonus)
Each level needs 35% more XP than the last. That feels great early (levels pop fast) and terrible late: level 25 needs about 2,400 times what level 2 did (roughly 19,000 gems), so the upgrades simply stop. Games fix this with a second, steady drip that doesn't care about the curve. Here it's a timer: go 75 seconds without a level-up and you get a free pick anyway. The curve still decides your level, and the timer makes sure the fun keeps coming.

## A race instead of a fight (Nov 9, Clean Out Your Desk)
Most enemies chase you. The Bargain Hunters chase the keepsakes instead, which turns the screen into a race: every second you spend walking to one item, a hunter is closing in on another. It's the same steering math as a normal enemy, just with a different target. Changing what an enemy wants is one of the cheapest ways to make a familiar sprite feel like a new kind of problem.

### 2026-11-09: Tile seams and terrain families (Codex)
A tile needs matching edge pixels to repeat cleanly. Grass variants share edges with other grass variants; a curb deliberately joins two different materials. A seamless kit therefore includes both repeatable surfaces and directional transition pieces.

### 2026-11-09: Door scale in a modular house kit (Codex)
A house can fit its pixel cell and still look too small beside a hero. The first broad house study had tiny doors, so the source was revised with taller, narrower facades before export. Proportional scaling then preserves the building shapes.

## Friendly sprites don't need to be enemies (Nov 9, the Reunion)
The old coworkers look and move like enemies, but they live outside the enemy group, so nothing makes them hurt you and your weapons ignore them. They borrow the enemies' pathfinding to walk toward you around desks, and the game only asks one question each frame: are you close enough to say hi? Keeping "things that move" separate from "things that fight" is what lets the same tools make both a swarm and a party.

### 2026-11-09: Small prop recognition (Codex)
A beige square held in a hand can read as a cup. A floppy disk needs its dark shutter and label recess visible even at native sprite size. The Cowboy study was corrected before export.

## A new level is mostly new data (Nov 9, Maple Hollow)
The office is described by one big list of numbers: where the floors are, where the walls are, where you start. Pathfinding, enemy spawns, bosses and events all read that list instead of knowing about desks. So the neighborhood didn't need new versions of those systems; it needed a new list (streets, lawns, house footprints) and a small builder that paints it. Swap the list, and the same game plays somewhere else. The few things that really are office-only (promotions, the Lounge, interns) just check which stage you're on.

### 2026-11-09: Stable state changes (Codex)
A generated closed/open pair can shift windows and roof pixels. Copying the closed sprite and replacing only its doorway keeps the building steady when it unlocks. The house pair changes649pixels inside one recorded door rectangle.

## Doors can just be teleports (Nov 9, inside your house)
The inside of your house isn't inside the house sprite at all. It's built far below the neighborhood, out of sight, and the front door simply moves you there (and the mat moves you back). Lots of classic games do this: Zelda's houses and caves are separate little rooms you jump to. The trick is making the jump feel like a door: the camera snaps, enemies that can't follow you give up, and the boss comes along so it isn't a hiding spot.

## Reskinning a system (Nov 9, the Lemonade Stand)
The Lemonade Stand isn't new code. It's the Lounge with a different coat of paint: same shop screen, same buying rules, same "opens after a promotion" timer. The Lounge now asks one question, "are we at home?", and if so it swaps in the stand's art, its menu, its spot on the sidewalk and your kid at the register. Reskinning keeps one system to fix and tune instead of two that slowly drift apart.

### 2026-11-09: Material-aware palette cleanup (Codex)
The closest palette color can turn gray concrete lavender. Mapping the floor material to slate tones keeps it readable as concrete while preserving the game palette. Matching floor edges then removes visible tile borders.

## Empty states (Nov 9, Kevin's age-275 run)
Every menu needs a plan for "there's nothing to show." The perk screen always assumed it would find three cards, so when a maxed build had none left, it opened an empty box and waited forever for a click that couldn't happen. The fix is a guard at the top: if the list is empty, don't open the screen at all, give a reward another way, and keep the game moving. Saved games have the same trap in a different shape: a save can remember "the boss already came" without remembering the boss itself, so the game checks what's really on the field instead of trusting the note.

## Two clocks (Nov 10, the Math Homework boss)
A game can have more than one clock. Phaser keeps its own scene time, but Midlife Survivors runs on "run time," which stops when you pause or pick a perk. The paper balls first used the wrong clock, so the game thought they'd been flying for minutes and they landed the instant they were thrown. The rule: anything that has to line up with something else (a throw and its landing) must read the same clock.

## Hooks (Nov 10, the garage)
The boss code already knew how to spawn the V8; it just picked a spot off the right edge of the screen. Instead of rewriting that, we added a hook: right before a boss appears, the game asks the garage "do you want to choose where this one shows up?" The garage says yes only for the V8 at home and answers "your driveway" or "the garage bay." A hook lets new content change one moment of old code without touching how everything else works.


## 2026-11-10: Maple Hollow art review (Codex)

A repeating road must fit whole dash-and-gap cycles.832px holds13 cycles of64px;800px would shift the center line at each join. Ground v2 uses shared boundary pixels and mixed-variant seam checks.

## Tiles vs. plates (Nov 10, Maple Hollow ground v2)
Small tiles (32 px squares) are flexible but repetitive: shuffle a few squares across a big map and the eye spots the pattern, and every square has to be busy enough to hide the seams, which reads as noise. Plates are big hand-drawn pictures (here 832 x 320, a whole street) that repeat far less often, so they can be calm and carry real details like a chalk sun or a lost mitten. The trade-off is that a plate's details sit in fixed places, so things like curb cuts had to be patched to line up with where the driveways actually are.

## Retry queues (Nov 10, the 500k cap)
When something you send can fail, don't just show an error and forget it: keep it in a small "outbox" and try again later. The leaderboard now does that. A turned-away score waits on your device, gets re-sent next time you open the game, and gives up after three real refusals so a truly bad score can't retry forever. It's the same idea as an email sitting in your outbox until the Wi-Fi comes back.

## Telegraphs (Nov 10, the All-Hands)
A telegraph is the warning before an attack: the dashed shape on the floor that says "this spot is about to hurt." The All-Hands shows the same slide twice, as a big icon on his projector screen (flavor) and as a dashed outline on the floor (the rule). Good telegraphs are readable at a glance, last long enough to react (about 0.75 s for area attacks here), and are honest: the red shape that goes live is exactly the dashed shape you saw.

## 2026-11-10: Maple Hollow v2 art (Codex)

A rendered sprite height and a floor-plan unit are different measurements. Keep the56px hero art, convert known room dimensions to24px per foot, and record inferred partitions separately. Shared edge pixels prove tiles meet; they do not prove a player can navigate the props, which needs a runtime test.


## 2026-11-10: Photo-based home interior (Codex)

Recognizable room art comes from the combination of specific objects and their relationships: the racing rig between sofas and TV, the desk beside the dining window, and the twin bassinet next to the bed. Geometry can stay fixed while modular furniture changes the identity. A public review should show derived game art without loading its private reference photographs.

## Switching a whole map from data (Nov 10, Maple Hollow v2)
The new neighborhood didn't replace the old code. It's a block of numbers in `src/data/maple-hollow.js` (lot width, where each row of houses and streets starts) with an on/off switch. When it's on, those numbers overwrite the old ones before anything is built, and every system that asks "where is the front door?" or "where is the driveway?" gets the new answer for free. Walls you can't see are just invisible rectangles with a solid body, laid along fences and house fronts, with gaps left where the gates are. Flip the switch off and the old town comes back, which makes a big change much less scary.

## Measure, don't guess (Nov 10, design system A1)
Every chip and the minimap used to be placed with a fixed number like "128 px from the top," picked by eye while a hidden 57 px was secretly being added. Remove the hidden part and every guess is wrong at once. Now the game measures where the HUD actually ends, twice a second, and stores it in a CSS variable (a named value the page's styles can read, like `--ms-hud-b`). The minimap and chips are placed from that number, so they land right under the HUD on a phone, an iPad or a laptop, even if the HUD changes size later.

## A message queue (Nov 10, design system A2)
A queue is a line, like at the deli counter. Before, every notice in the game just showed itself, so at age 45 three of them landed in the same second on top of each other. Now there's one gatekeeper (the "router") for the middle of the screen: a notice asks for a turn, and if someone's already there it takes a number and waits. Each waiting notice has a tier (boss warnings 1, to-dos 2, rewards 3) so the important one goes first, and a shelf life so a warning that's 5 seconds late gets thrown out instead of confusing you.

## Shape and color together (Nov 10, design system A3)
The headline plate says what kind of message it is three ways at once: the edge color, a little mark (!, a checkbox, a star) and the label. That's on purpose. About 1 in 12 men can't easily tell red from green, and in the middle of a fight nobody reads carefully anyway. A shape you can recognize from the corner of your eye works for everyone. It's the same reason a stop sign is an octagon and not just red.

## Never cover the danger (Nov 10, design system A4)
A boss intro used to darken the floor for six seconds, right when the boss was drawing its first attack. A dramatic entrance that hides the danger is a trap, not a moment. The rule now is that the floor is sacred: anything with words goes in the plate at the top or the band at the bottom, and the space around the hero stays bright. The drama comes from the band, the name dropping in and the portrait, not from dimming the screen.

## Priority lists (Nov 10, design system A5)
When several things want the same spot, write down who wins, once, as a list: Workload first, then a modifier, then the buff. The code just walks down the list and shows the first one that's switched on; the rest wait. Changing the order later is editing one line, not hunting through four files. It's the same idea as the message queue from A2, but for things that stay on screen instead of popping up.

## Pacing: hold it, merge it, or drop it (Nov 10, design system A6)
A queue (A2) makes messages take turns, but if eight things happen in the same second, a polite line is still eight messages long. Pacing fixes it at the source. Some things are **held** (an errand just doesn't start during a boss or right on your 50th birthday). Some are **merged** (the decade line, the cake and the dividend become one sentence). Some are **dropped** (a reward never needs the big headline; the bottom bar is enough). The rules live in one small data file, so changing "0.6 years" to "1 year" is a one-number edit.

## Thumb zones (Nov 10, design system A7)
On a phone held in portrait, your thumb lives in the bottom third of the screen, and whatever's under it is invisible. Apple and Google both design around this: things you *tap* go where the thumb rests, things you *read* stay out of its way. The bottom bar was 18 px from the edge, right under the joystick thumb, so it now sits 96 px up. Same idea as putting a car's speedometer above the steering wheel instead of behind your hands.

## Visual hierarchy (Nov 10, design system A8)
Every screen has one thing the eye should land on first. In a game about getting older, that's your age, so it's now the biggest, brightest number in the HUD, and the clock (which used to be bigger) sits quietly underneath. Hierarchy is made with size, color and position: the most important thing gets the most of all three. If two things are equally loud, the eye bounces between them and reads neither.

## Components (Nov 10, design system B1)
A component is a part you design once and reuse everywhere, like a LEGO brick. Before, every menu built its own buttons with its own colors and sizes, so nothing matched. Now there's one Button with a few kinds (primary, secondary, quiet) and a few states (focused, pressed, disabled), written once in `assets/ui/ms-parts.css`. When the level-up menu wants a button it says "secondary button" instead of describing one from scratch, and a later fix to the Button fixes it in every menu at once.

## One source of truth (Nov 10, design system B2)
Before, sound settings lived inside the pause menu's own code, and the title had no way to reach them. Now there's one Settings screen and both places open it. A change made from the title shows up in a run and the other way around, because there's only one copy of the screen and one copy of the saved values. When the same thing exists in two places, sooner or later the two copies disagree.

## Reuse pays off (Nov 10, design system B3)
The Row was built in B2 for Settings. B3 used the same part for the Lounge and Lemonade Stand and only added what a shop needs on top: an icon slot and a price tag. That's why this step took less code than the last one, and why B4 (the 401(k) shop) and B8 (leaderboard, credits) will be faster still. Each new screen built from the kit gets cheaper, and they all look like they belong together.

## When everything is orange, nothing is (Nov 10, design system B4)
The old shop had a bright orange BUY button on every upgrade. Nine "press me" buttons in a column all shout at the same volume, so the eye can't tell which one matters. Now the price is a calm cream tag and the whole row is the button. The one orange thing on a screen is a promise: this is the main thing to do here.

## Tab bars (Nov 10, design system B5)
Most phone apps keep their main places in a bar along the bottom (Instagram, Messages, the App Store), because that's where the thumb already is. A menu at the top of a phone takes a stretch to reach and scrolls sideways when it's too long. The title now does the same on phones: five tabs at the bottom, and the site menu hides while you're there. The tabs press the same buttons the tiles already had, so nothing behaves differently, it's just closer.

## Progressive disclosure (Nov 10, design system B6)
Show the few things everyone needs first, and tuck the details one tap away. After a run, everyone wants to know "how did I do?" and "go again?", but only some players want the paycheck math and the next goals. So the score, age and RETRY come first, and the pay stub is a drawer you can open. Nothing was removed; it was just put in the order people ask for it.

## Shells (Nov 10, design system B7)
A shell is the frame a screen sits in: the dark backdrop, the card, the header strip and where the buttons go. The content inside each pop-up stayed the same (the chest still has its art, the account prompt still signs you in), but they all sit in the same frame now. That's most of what makes an app feel like one product instead of five: the same frame, used every time, so your eye knows where the title and the buttons will be before you read anything.

## Aliases and a pixel diff (Nov 10, design system C1)
The devlog had its own color names (--navy, --cream, --teal). Instead of renaming them everywhere, each one now points at the game's token: `--navy: var(--ms-surface)`. That's an alias, a second name for the same thing, so old code keeps working while the real value lives in one file. To prove nothing changed, we screenshotted the old and new pages and compared them pixel by pixel. Only the strip label changed, which was the point. A pixel diff is the cheapest way to show a refactor (a change to how code is organized, not what it does) didn't break anything.

## Re-auditing with the same tool (Nov 10, design system C3)
The best way to know if a redesign worked is to measure it the same way twice. We kept the exact script that took the first 60 screenshots and ran it again, so every "before" has an "after" taken from the same spot in the same moment of the game. It also measures positions (where the map starts, where chips sit), so "better" becomes a number: the phone map moved up from y 115 to y 96. It caught things a quick look misses, like an alert appearing in two places at once.

## Return values (Nov 10, alerts say it once)
The double alert happened because one function shouted into two places without asking whether the first one heard it. The fix was to have the headline answer back: "shown", "queued" or "skipped". That answer is called a return value, what a function hands back to whoever called it. Now the alert code reads the answer and only falls back to the ticker when the headline says "skipped". Small change, but it turns two separate voices into a conversation.

## Generated data (Nov 10, the big house)
The house layout isn't typed by hand. A small script reads Codex's floor plan, stretches the rooms, keeps each piece of furniture its drawn size, cuts every piece out cleanly, and writes the result as a data file the game loads. If we want the rooms wider or a different set of pieces to move together, we change one number or one list in the script and run it again, instead of moving 35 pieces by hand. That's the difference between building a thing and building the machine that builds the thing.

## Two floors, one world (Nov 10, upstairs)
Upstairs isn't stacked on top of downstairs. It's a second floor plan sitting far off to the right in the same world, out of sight. Taking the stairs is really a teleport hidden behind an animation: you hop up the steps, the screen fades, and you're moved to the other floor plan. Games do this all the time (Zelda houses, Pokemon buildings) because it's simpler than real height, and with the fade your brain fills in "I went upstairs."

## Flash budgets (Nov 11, flashing lights)
Accessibility guidelines say a screen shouldn't flash more than 3 times a second. One white flash per kill is fine early on, but with 40 kills a second those flashes add up to a strobe. The fix is a budget: each third of a second, only the first 4 kills get the white pop, and everything after that pops without it. Same idea for the camera: one full-screen flash, then a 0.6 second cooldown. A budget keeps the feel of a hit without letting a crowd turn it into a strobe.

## Whole-number scaling (Nov 11, the crisp pass)
Pixel art is a grid of little squares. Show it at 2x and every square becomes a neat 2 by 2 block. Show it at 1.5x and the screen has to cheat: one square gets 1 screen pixel, the next gets 2, so outlines wobble and glasses go lopsided. Screens with extra-fine pixels (MacBooks, phones) add a second problem: the browser enlarges the whole picture and, unless told otherwise, smooths it like a photo. The fix is two rules: only zoom by whole numbers, and always enlarge with hard edges.

## Painted vs. drawn with code (Nov 11, the art redo)
There are two ways an AI can make a sprite. An image model paints it, the way a person would, and gets shading, texture and character for free, but it can't hit exact pixels, so the picture has to be reduced afterward. A coding agent can place every pixel exactly, but it only thinks in shapes: rectangles, lines, flat fills. Ask it for "exact pixels, no shrinking" and you get a flamingo made of an oval and four sticks. The good pipeline uses both: paint big at a whole-number multiple, reduce cleanly, then fix the few pixels that broke.

## Camera bounds (Nov 11, the tree wall)
The world is bigger than the screen, and the camera is a window that follows the hero. Camera bounds are a rectangle the window is not allowed to leave. The hero can walk right up to the edge of the map, but the window stops early, so you never see the empty space past the art. The tree wall is 192 px thick and the bounds sit at its outside edge. That is why the forest always fills the screen edge and never ends.

## Draw order (Nov 11, the front door)
Everything on screen is drawn in a set order, back to front, like stacking paper cutouts. Each thing has a depth number, and bigger numbers go on top. In this game the depth changes every frame so that whoever stands lower on the screen is drawn in front. The open doorway had a small fixed number, so the house was always stacked on top of it and the door never looked open. The fix was to give the doorway the house's number plus a hair.

## Baked in vs. separate objects (Nov 11, your backyard)
The old backyards were one picture each, with the swing set and the fire pit painted right into the grass. The game had no idea they were there, so you walked straight over them, or hit an invisible wall where nothing was drawn. The rebuilt yard is a plain ground picture plus separate objects. Each object knows where its base is, so it blocks you there and nowhere else, and it can be drawn in front of you or behind you depending on where you stand.

## Palette swap with a mask (Nov 12, one grass color)
Pixel art uses a small set of exact colors, so changing one is a find-and-replace: every pixel that is exactly the old grass green becomes the new one. The catch is that the same green was also used for some house siding, so a blind swap would have repainted houses. A mask fixes that: a rule that says where the swap is allowed (here, everywhere except the house fronts). It is the same idea as a layer mask in Lightroom or Photoshop: the adjustment only lands where the mask says.


## Telegraphing (Nov 12)
A telegraph is the warning before an attack: a wind-up, a glow, a mark on the ground. It turns "that was cheap" into "I should have moved." Father Time used to land on Ben with no warning, so it felt unfair even though the rule (the run ends after 104) was fine. Now a ring shows where he'll land, and Ben's death becomes his own fault, which players accept. Good telegraphs give phones enough time to react, so ours never go under 0.65 seconds.

## Layers that tie (Nov 12, Settings behind the title)
Every pop-up in the game had the same layer number (z-index 30). When two things tie, the browser draws whichever comes later in the page on top, and the title screen comes after Settings. So Settings opened underneath the title, and its DONE button was buried. The fix was to give Settings its proper layer from the design system (the Sheet layer). The lesson: when two things share a layer number, the order in the code quietly decides the winner.

## Balance lives in more than one number (Nov 12, Maple Hollow)
Nobody changed the healing numbers, yet Ben healed less. A new level can shift balance without touching any shared setting: Maple Hollow swapped in tougher enemies and quietly left out the office's healing sources (interns, errands, smashable plants). Difficulty is the sum of what hurts you and what helps you, so a new stage needs both sides checked. Recording which stage each run happens on lets us compare them with real numbers next time.

## Sorting by feet, and things overhead (Nov 12, the yards)
In a top-down game, whoever's feet are lower on the screen is drawn in front. Each yard piece gets a "feet line" (the d number in the yard data): stand above it and the ghost covers you, step below it and you cover the ghost. Overhead things like the pergola roof and the string lights use a trick: their feet line is set just below the posts' feet, so anyone standing under them is drawn underneath. One picture, two answers, depending only on where you stand.

## Corner sliding (Nov 12, the backyards)
Game physics treats the hero as a box. If the box hits the end of a fence even by a few pixels, it stops, and it doesn't care that the opening is right next to it. Most top-down games quietly fix this: when you push into a wall, they peek a few pixels to each side, and if there's room, they nudge you over. You never notice it, you just feel like the doorway "caught" you. Ours peeks up to 28 px each way.

## A save has to hold everything that matters (Nov 12, the key hunt)
A save file is a list of facts the game writes down so it can rebuild the moment later. Anything left off the list gets rebuilt from scratch. The key hunt wasn't on the list, so every resume started a brand-new hunt with a brand-new bonus chest. That turned a small omission into an exploit: quit, resume, collect, repeat.

## Culling: only draw what's on screen (Nov 13, the whole town)
The town is about 7 by 11 screens, but you only ever see one. "Culling" means the game skips drawing anything that isn't near the screen. Ours checks a few times a second and hides any town piece more than 400 px outside the view. Drawing less each frame keeps a big map smooth on phones.
