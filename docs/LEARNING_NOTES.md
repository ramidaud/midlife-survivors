# Midlife Survivors: Learning Notes

Game-dev ideas you've picked up along the way. One short entry per concept.

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
