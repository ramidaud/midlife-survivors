# Fable review: Midlife Survivors before V2

Reviewed Nov 3, 2026 against V. 1.73.3 (commit 94f3c8e). Review only; no game code was changed.

**Summary**
- The game is in good shape for V2: it holds 58 to 60 fps on most phones (real play data), the art reads well, and the title, level-up and pause screens are clean. The weak spots are the late-game CPU budget (damage-number text objects, uncapped gems, per-frame HUD rewrites, a hidden 3D canvas) and a few phone-only UX snags.
- Biggest wins for players: Quick Retry buried two screens down on the phone death screen, a navy-only title for the first 3 to 8 seconds, and the age-60 label clutter.
- Everything below has a file or screen, a way to reproduce it, and a suggested fix sized S, M or L.

How I tested: read the whole src/ tree, measured a local copy in a headless browser (object counts, texture memory, CPU per frame), played the live build in a browser on a Mac at 390x844, 820x1180, 1180x820 and 1440x900 with `?nostats=1&dev=1`, read the runs table (SELECT only) for real frame rates, and checked the devlog and Art Room pages.

Real play numbers (runs table, last 3 days, 289 runs): desktop averages 79 fps; phones average 58 fps with about 4 percent slow frames. Phone runs that reached the 50s and 60s show the tail: minimum 26 to 28 fps and up to 13 percent slow frames. So most phones are fine and a minority struggle late. The fixes below target that tail.

---

## Top 10 (ranked by how much each helps players)

1. **Quick Retry is two screens down on the phone death screen.** (S) Death screen, phone. The name box, Post Score and the whole leaderboard come first; Retry and Shop are below them. Move Retry (and Post Score) above the leaderboard, or pin a Retry bar to the bottom of the modal on phones.
2. **Damage numbers and floating labels create a new Text object per hit.** (M) `src/main.js` popDamageNumber (line 1402) and the same pattern for coins, pizza, salad, "NO!", "HA!" and near-miss popups. Each one rasterizes a canvas and uploads a GPU texture, then destroys it 460 ms later. At age 60 I measured 200+ Text objects alive at once. Pool about 40 Text objects (or one BitmapText font) and cap new numbers per frame.
3. **Gems, coins and pizza never expire and are never merged.** (S) `src/main.js` gems.create (lines 966, 1462, 1480), spawnCoin. In a run where I skipped ahead, 238 gems and 70 coins sat on the floor, each a live physics body checked every frame. Cap gems at about 150 (merge the farthest into one big gem, the Vampire Survivors trick) and give coins and pizza a 30 s lifetime like field items already have.
4. **The title shows a navy screen with buttons for 3 to 8 seconds before the key art appears.** (S) `src/ui.js` TitleSlides.start runs only after Phaser and all 68 scripts have booted and create() has run, then the first slide fades in over 2.4 s. Seen at every size. Make the first slide appear instantly (no fade for slide 0) and put the first slide's image as a plain CSS background in index.html so it starts downloading at first paint. A tiny blurred placeholder would hide the download too.
5. **A hidden three.js canvas and a second WebGL context exist on every phone.** (S) `src/view3d.js` line 587: applyViewMode calls initThreeOverlay even with ENABLE_3D_VIEWS false. On the live site I found a `#three-overlay` canvas at 780x1688 (2x DPR) with display:none, plus shadow maps and a 32-building skyline nobody sees. index.html line 1560 also downloads three.min.js (about 600 KB) on every visit. Return early when 3D is off and load three.js only if a 3D mode is picked. Also set `transparent: false` in the Phaser config (main.js line 9) since the see-through canvas only existed for this overlay.
6. **The HUD rewrites about 20 DOM nodes every frame.** (S) `src/main.js` line 2089 calls updateHUD() inside update(); `src/ui.js` updateHUDNow (1049) and updateCleanHUD (1111) then set textContent, style.width and innerHTML (the avatar icon is re-parsed every frame). Remove the per-frame call (every value change already calls updateHUD) and compare with the last written string before writing.
7. **Enemy name tags turn the age-60 screen into a wall of text on phones.** (S) `src/main.js` line 1827 gives every enemy a Text tag; at zoom 0.75 on a 390 px screen those are about 7 px tall and overlap each other (FLAKE!, TAPAS, 9PM BED, MTG). Hide tags for regular enemies on phones (or when more than 60 are alive) and keep them for elites, bosses and "typing...". This also removes about 170 texture binds per frame.
8. **Level-up, pause and chest menus keep the whole scene rendering and blur it.** (M) `index.html` line 438 `.ui-modal { backdrop-filter: blur(5px) }` blurs a canvas that keeps repainting; the postupdate handlers (lighting, enemy art sync, depth loops) all keep running while paused. 20 to 40 level-ups per run. Drop the backdrop-filter (the 78 percent navy already darkens the game) and early-return the postupdate handlers while a menu is up.
9. **The baked office floor is 38 render textures of 1024x1024, rebuilt every run.** (M) `src/start-area.js` lines 541 to 553. That is about 150 MB of GPU texture memory (I measured 282 MB total resident) and it is removed and re-baked on every Retry. Older iPhones drop the WebGL context around 256 to 384 MB. Keep the baked tiles across restarts when `textures.exists(key)`, skip tiles with no floor, and consider baking at half scale.
10. **Phones see a "What's new" pop-up and a poll on their very first visit.** (S) `src/ui.js` titleNewVisible (691) returns true whenever no version has been seen, so a brand-new player's first title screen has a "New in V. 1.73.3" pill and then the accounts poll. Only show "What's new" when a previous version was seen; delay the poll until after the first run.

---

## Performance

### Where the late-game time goes
- Measured on a local copy at phone size, age 60, 160 to 170 enemies: about 1,700 display objects (980 Images, 350 Sprites, 200 Text, 37 Graphics, 32 TileSprites), 170 MB JS heap, 282 MB of texture memory. Scene update median 11 ms, 95th percentile 37 ms; with the Gold Watch on screen median 23 ms, 95th percentile 53 ms (this box has no GPU, so treat ratios, not absolutes).
- On a Mac at the phone viewport the same scene ran at the 70 fps cap. The runs table shows most phones at 58 to 60 fps with a minority dropping to 26 to 30 fps late. The items below are the per-frame costs that add up on the slow ones.
- Code paths that run every frame and scale with enemy count: `NAV.steer` per enemy walks a line of cells (`src/navigation.js` 157 to 168), `weapons_extra.js` hitEnemiesNear scans every enemy for every orbiting cell and remote (8 cells x 200 enemies), `enemy-art.js` sync (75 to 137) does a third full pass with string keys, and Modifiers, Lounge, Interns and GoldWatch each scan the enemy list again for "is a boss alive" (modifiers.js 50, lounge.js 31, interns.js 60, gold-watch.js 230). Fix: keep one `activeBoss` reference set in spawnBoss/damageBill, and a spatial hash of enemies rebuilt once per frame that all weapons share. (M)

### Pooling and churn
- Text per hit: see Top 2. Also `burstConfetti` (`src/main.js` 1416) makes 8 to 22 rectangles plus tweens per kill. A single ParticleEmitter with a 4 px square texture does the same job batched. (S)
- `splashes.create`, `bills.create`, gems, coins and pings allocate a fresh Sprite each time instead of `group.get()` reuse. Enemies also get a Text tag and an art sprite plus shadow each spawn. Switching to `get()` with `maxSize` and a free list for tags removes most allocation churn. (M)
- Elite glows are a separate `scene.add.ellipse` with ADD blending per elite (`src/enemy-art.js` 98). Each one breaks the sprite batch. Use one soft-circle texture image instead of a Shape. (S)

### Depth and physics
- Every prop gets `setDepth(10000 + prop.y - player.y)` and `setAlpha` every frame (`src/world-art.js` 166 to 174), then `src/start-area.js` 557 sets depth again on about 700 items. Because depth is relative to the player, the whole display list re-sorts every frame the player moves. Use absolute y (`10000 + y`) so static props never change depth, and only setAlpha when the "behind" state flips. (S)
- About 450 walls and desks are dynamic physics bodies marked immovable (`src/sprites.js` 857 `physics.add.group({ immovable: true })`). They are re-inserted into Arcade's tree every step and collide with the player and all bills. A StaticGroup is built once. (M)
- `this.physics.add.collider(bills, bills)` at 200 enemies plus 7 overlap pairs is probably the largest single CPU item late. The gem cap (Top 3) and static props shrink it the most. (M)

### Lighting
- `src/lighting.js` update runs on postupdate every frame, also while paused: clear, full-screen fill, then one `rt.erase` per visible light (15 to 30 blend switches). Pass an array of brushes to a single erase call, render the darkness texture at half resolution and scale it 2x, and skip the redraw when the camera has not moved. (M)
- The 130 glow images are never culled (Phaser does not frustum-cull); toggle `visible` with the same pad test already in the loop. (S)

### DOM overlays
- HUD per frame: Top 6.
- Touch joystick: `src/ui.js` updateTouchJoystickUI (568 to 618) reads `offsetHeight` (forced layout) then writes left/top every frame in fixed modes and on every pointermove in floating mode. Position with one `transform: translate3d` and cache the lower-third height on resize. (S)
- Spotlight cards: `src/spotlight.js` line 35 puts `filter: drop-shadow(0 0 14px)` on a sprite that animates every frame (hero steps, boss bob), plus a full-screen `.sp-flash` with mix-blend-mode and a `.sp-dim` gradient. For the 5 to 7 s a card is up, that re-rasterizes the filter each frame while the game runs underneath. Bake the glow into the portrait PNGs or put a static blurred div behind the sprite. (S)
- Title: `index.html` 1187 `tpPunch` animates box-shadow blur forever; animate an opacity on a pseudo-element with a fixed shadow instead. (S)
- `index.html` has no `<!doctype html>`, so the page renders in quirks mode. Not a perf bug on its own, but it changes percent-height and dvh behavior and some engines skip fast paths. Add `<!doctype html><html lang="en">` and re-check the four sizes. (S)

### Load time (first visit on a phone)
- Before the title is usable: about 5.0 MB on a phone, 5.5 MB on desktop. Breakdown: 2.03 MB of game code in 68 files (895 KB of that is base64 PNG data inside `assets/stage/start-area/art-data.js`, `assets/characters/character-data.js` and the desk and environment data files), 1.2 MB Phaser, 0.6 MB three.js, 1.1 MB of title images, plus fonts.
- Quick wins: drop three.js (0.6 MB, Top 5); convert the two kill-screen banners from opaque PNG to JPG or WebP (`assets/ui/kill-screen/exit-interview-banner-desktop-v1.png` 606 KB and `-phone-v1.png` 477 KB, about 0.9 MB saved for maybe 100 KB); re-encode the five desktop title slides (454 to 942 KB each; quality 75 WebP would roughly halve them); remove `assets/title-screen/title-bg-lobby.jpg` (360 KB) from the `#title-modal` CSS since the slideshow always covers it. (S each)
- Google Fonts: index.html asks for 6 families. Bungee and Cinzel only exist for the parked 3D themes, and Press Start 2P and Chakra Petch are only fallbacks after Silkscreen and Atkinson. Trim to Silkscreen + Atkinson and preload their two WOFF2 files. (S)
- 68 script requests with `?v=174` means every BUILD bump refetches everything. A no-tooling fix is a shell step that concatenates `GAME_FILES` into one `dist/game.js` for the live site, and moving the base64 PNGs out of art-data.js into real PNG files so the browser caches and decodes them as images. (M, and this is a tooling decision for Rami)
- `assets/characters/character-data.js` (88 KB) still ships the v1 hero sheets as base64 even though HERO_ART_VERSION is 2 and the v2 PNGs load too. (S)

### Leaks across runs
- Mostly clean: the postupdate handlers, scale resize for zoom, lighting and enemy art all remove themselves on shutdown.
- `src/main.js` line 331 `this.scale.on("resize", size => floor.setSize(...))` is added in every create() and never removed, so each Retry adds a closure that fires on every resize. Add the same `events.once("shutdown", ...)` pattern used at line 399. (S)
- `Spotlight.newRun()` runs only from the title (`src/main.js` 1072), not on Quick Retry, so a room or Lounge card queued in the previous run can appear at the start of the next one, and the per-run tip counter carries over. Call it from create(). (S)
- `src/sprites.js` makeCanvasTex removes and recreates about 29 canvas textures on every create(), and the 66 base64 images in art-data.js are decoded and palette-quantized again on every restart (`src/world-art.js` propTexture). Guard with `textures.exists` like the sheet loaders already do. (S)
- Heap stayed flat (168 to 174 MB) across two runs in my test, so no growing leak showed up.

### Dead weight in the repo (not a player issue)
- 195 files over 300 KB under assets/ are never referenced by the game or devlog: about 291 MB of the 321 MB folder (generation sources, QA checks, retired slides, `assets/art-direction` byte-for-byte copies of the title PNGs, `assets/desks/desk-data.js` at 5.5 MB). Fine on GitHub Pages, painful for clones and any desktop packaging. Worth a cleanup pass or an `assets-source/` folder outside the Pages tree before Steam work. (M)

---

## Art and animation

- **Phone sprites are drawn at 0.75x with antialiasing, then upscaled by the browser.** `src/main.js` config has no `pixelArt: true`; the Phaser canvas renders at 1 CSS pixel (390x844 on a 3x phone, confirmed on the live site) with the camera at zoom 0.75, and the canvas has `image-rendering: auto`. So every 56x60 sprite is drawn at 42x45 with bilinear filtering, then stretched 2 to 3x. Pixel art stays soft at the exact size where it needs to be crisp. Options: set `pixelArt: true` (nearest filtering, roundPixels), and on phones render at 2x with `resolution`/zoom 1.5 instead of 0.75 so sprites land on whole device pixels. Test the fill-rate cost on an older phone first. (M)
- **In-canvas text uses the browser monospace font.** "You (40)", enemy tags, damage numbers, "+5 HP" and boss HP tags all use `fontFamily: "monospace"` while every HTML surface uses Silkscreen and Atkinson. It is the one place the "one look" rule is broken, and it is on screen the whole run. A Silkscreen BitmapText font (one atlas) fixes both the look and the texture churn in Top 2 and Top 7. (M)
- **Off-palette yellow on the chest card and death screen.** The Bonus Approved card's title, OPEN and CASH IT IN buttons and the SCORE number on the death and retirement screens use a bright gold yellow, not the devlog palette (cream `#F2D7A1` and coffee `#EF9347`). The legacy `--accent: #ffe042` and `--xp-grad` blues in `index.html` lines 48 to 60 still leak into these. (S)
- **APPROVED stamp covers the headline on phones.** Chest result screen at 390 px: the stamp sits over "BONUS APPROVED" and the first line of the subtitle. Move the stamp to the top-right corner of the safe or shrink it under 700 px. (S)
- **Title art at the two iPad sizes:** portrait (820x1180) uses the portrait v2 crops, and the cast lands exactly under PUNCH IN and the settings chip (Coffee Run and Group Photo). The phone layout avoids this because the button sits lower. Nudge `focusPortrait` for those two slides on tablets, or raise the art. (S)
- **Portrait v2 proportions:** 08, 09 and 10 match the desktop scenes. 11 Coffee Run and 12 Happy 50th read slightly tall (my gradient check puts them 15 to 23 percent off the desktop ratio, and the figures look narrow by eye). Happy 50th's cast is also tiny at phone size, about 40 px tall, so it reads as a room, not a party. Both could use a tighter crop or a re-generation at the right ratio. (M, ChatGPT job)
- **Lounge sign is unreadable on phones.** "THE LOUNGE · OPENS AFTER PROMOTIONS" is about 6 px tall at zoom 0.75, and it keeps saying "opens after promotions" while the Lounge is open. Swap the texture when the counter opens and make it two lines at a readable size. (S)
- **Retirement reaper reads as an enemy.** At 65 the clock-out figure is a hooded reaper labeled "RETIREMENT:9999" (an HP-style tag) while the lower third says "walk up and clock out". New players will run away from it. Give it a non-HP label ("CLOCK OUT HERE"), a friendly arrow like the Lounge, and no boss-style HP number. (S)
- **Animation speeds:** consistent. Enemy v2 sheets run at half the v1 frame time for 8 frames (same cycle length), hero on-break rows run at 140 to 150 ms per frame on both the pause tile and the Spotlight card. One nit: Spotlight loops the hero's signature break (coffee sip) forever, while the pause tile breathes between them. Looping the breathe row on the card and playing the break once would match. (S)
- **Spotlight cards** read clearly at all four sizes, including the six coworkers and the bosses. The boss beam in red and the hop-and-puff land well. On phones the Gold Watch card's typed line runs long ("The hands stopped at five, and my out-of-office...") and sits tight against the card's bottom edge at 390 px; worth checking that the full line fits once typed, and capping it at two lines if not. (S)
- **Kill screen** reads well: slumped hero, gloating mugshot, "Taken out by X at 61.1". On phones the banner art sits under the sticky nav when the modal opens scrolled, so the top of the office is hidden. Add top padding equal to the nav height on the game-over modal. (S)
- **Title slideshow** at desktop and iPad landscape: the blurred side fill (`.ts-slide::before`, `blur(26px)`) is a full-viewport filter animating behind a 12.6 s push. It looks good; just know it costs on iPad landscape. The title page also runs `msTitlePan` (40 s background animation) under it. (no action needed, noted for Steam Deck testing)
- Sprite sheets all divide cleanly by their frame sizes (checked all 115), no stretched sheets, no broken references, and `assets/share/game.jpg` is a correct 1200x630.

---

## UX and UI

### First two minutes on a phone (new player)
- Title: PUNCH IN is above the fold and obvious. Good. The character row, employee file and devlog tile below are fine as a scroll.
- Noise on first visit: "New in V. 1.73.3" pill (Top 10), then the poll pill. A brand-new player has no context for either.
- Start: the hero Spotlight card ("THE 9-TO-5ER", bio and play style) fills the lower third while the first "TIP: your weapons fire on their own" waits behind it. The card is lovely, but the one thing a new player needs in the first 10 seconds is "just move". Suggest showing the "keep moving" tip first (or inside the hero card as the play-style line) and the bio on the second run.
- Joystick: floating stick works and the first swipe moves the hero. No on-screen hint says "drag anywhere to move"; the start tip says "keep moving" without saying how. Add "Drag anywhere to walk" to the start tip on touch devices. (S)
- The lobby is well lit at 40 and the swarm builds slowly. The two-tap confirm on perk cards ("TAP TO SELECT" then "TAP AGAIN TO PICK") is clear.

### Title screen
- Phone nav bar buttons are 30 px tall (Title Screen, Devlog, Art Room, About, Discord, Coffee, hide). The settings chip is 30 px, READ THE DEVLOG is 28 px. Apple's minimum is 44 px. Give nav buttons `min-height: 40px` on `(pointer: coarse)`. (S)
- The settings chip "⚙ MIDLIFE · 40-65 · TAX 0 ▼" is 11 px Silkscreen; the opened panel explains modes well. Fine.
- "Today's employee ... Balanced stats. Starts with Coffee Splash." runs onto the next line at 390 px and 820 px and reads as two unrelated lines. Put the description under the name on its own line. (S)
- Employee file tile says "1/38 achievements" and the Cold War Cowboy says "READ 10 MEMOS": both good hooks. The nudge line changes per visit, nice touch.

### Options
- On phones the Options panel opens with the keyboard bindings (Move Up W, Move Down S...) and the touch settings sit at the bottom. Reorder by device: touch first on coarse pointers, keyboard first otherwise. (S)
- "Switch View (2D/3D)" key, "Switch 2D/3D View" controller button and "Mouse Wheel View (cycles 2D/3D)" are still listed even though 3D is parked. Hide them while `ENABLE_3D_VIEWS` is false. (S)
- Game Tips toggle lives in the pause menu only; a new player who turned it off by accident will not find it in Options. Mirror it there. (S)

### Extras
- Lists five stages (St. Deductible Hospital Age 44+, Suburban Home, Social Courtyard, Sunset Palms) as locked. None exist yet, so the game promises content it does not have. Hide the list until a second stage ships, or label them "coming someday". (S)
- Reset Progress is tap-twice with no dialog (good) but sits in the same visual style as Lore and Credits. A red outline would keep thumbs away from it. (S)

### Level-up
- Reads well at all sizes. Hint text "Tap a card, then tap again to pick it" is 12 px on phones; fine.
- Taps are ignored for 450 ms after the menu opens (`src/ui.js` openedAt guard). That is right for a steering finger, but the first deliberate tap in that window gives no feedback, so players tap again and the second tap arms instead of picks. A brief disabled look (cards fade in over 300 ms) would explain the pause. (S)

### Pause ("On Break")
- Tiles, loadout and the hero portrait are clear on all sizes. RESUME SHIFT is the default focus. Good.
- The pause tile hero and the "This shift" numbers are the best-looking menu in the game. No changes.

### Death screen (HR Exit Interview)
- Retry below the fold: Top 1. On phones the order is banner, cause of death, stats, next goals, score, name, POST SCORE, full leaderboard, then QUICK RETRY and SHOP and the keyboard hints.
- "QUICK RETRY (SPACE / ENTER / A)" and the footer "◀▶ / ▲▼ Arrow / D-Pad / Mouse" show keyboard and controller hints on a touch phone. Hide the key hints when `isTouchUI`. (S)
- The leaderboard's AS column wraps "Grad Student at 45" to two lines in every row on phones. Shorten to the hero's short name or drop the column under 420 px. (S)
- In dev mode the POST SCORE button still shows even though dev runs never post (lbSubmit returns reason "dev"). Hide it or label it "scores off" so testers are not confused. (S, dev only)

### Retirement (65)
- The moment itself stacks four messages at once on a phone: the red "URGENT CALENDAR REMINDER" banner over the HUD (it covers the year bar and timer), the SIDE-STEP near-miss chip on top of that, the FIVE O'CLOCK Spotlight card, and the lower third "Retirement is here. Walk up and clock out". Hold the lower third and the near-miss chip while the Spotlight is up, and move the alert banner below the HUD. (S)
- The reaper label: see Art.
- The party screen reads well. On phones the streamers and banner are half under the sticky nav for the same reason as the kill screen.

### Spotlight and lower-third pairing
- The pairs are mostly gone, but the LIFE line after a promotion (`src/promotions.js` 39, 12 s delay) still lands under the Lounge card, and alerts (modifiers, Facilities) go out immediately by design and overlap boss cards. Suggest holding everything except boss-attack alerts while a card is showing, and queuing the LIFE line until the card hides. (S)

### Devlog and Art Room
- Devlog home on phone is strong: memo card, cast chips, Newest-first toggle, featured memo, compact older memos. The cast chip row (BILL, SPAM LIKELY...) above the toggle shows names only on phones while the sprites load; a fixed-height placeholder would stop the jump when they arrive. (S)
- Art Room on phone: the key art box is an empty navy rectangle for 3 to 5 s until the 500 KB slide arrives (no placeholder), then the slideshow runs. Add a low-res placeholder or the blurred thumbnail. (S)
- Art Room sprite cards, filters and the live Spotlight demo work at phone size; the before and after sliders are the best part of the page.
- About and the share pages were not reviewed in depth.

---

## Bugs and rough edges
- `src/main.js` 2089: updateHUD() every frame (Top 6).
- `src/main.js` 331: scale resize listener added per run and never removed.
- `src/main.js` 1072 vs create(): Spotlight.newRun() skipped on Quick Retry.
- `src/view3d.js` 587: three.js overlay initialized with 3D off (Top 5).
- `index.html` line 1: no doctype, quirks mode.
- `index.html` 1067: `title-bg-lobby.jpg` loads behind the slideshow on every visit.
- Options still lists 2D/3D bindings; Extras lists stages that do not exist.
- "What's new" shows on a first-ever visit.
- Chest card: APPROVED stamp covers the title on phones.
- Lounge sign keeps saying "opens after promotions" while open.
- Comfort Zone Tax start paints one fully opaque sage-green frame across the whole screen (seen at age 60 on the Mac). If that is the screen flash at depth 50000, cap its alpha at about 0.5 so it reads as a flash, not a glitch.
- Dev console: jumping to an age spawns every boss due before it on top of the player at once (REVIEW, MORTGAGE, V8 and the Watch all in one spot at 64). Harmless for players, confusing for testers; spawn only the latest boss on a jump.

## What I did not find
- No console errors on the live site at any of the four sizes.
- No broken asset references; every file the game asks for exists.
- No growing memory leak across two back-to-back runs.
- No stretched sprite sheets; every sheet divides cleanly by its frame size.
