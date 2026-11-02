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
