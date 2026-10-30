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
