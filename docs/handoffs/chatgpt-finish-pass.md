# ChatGPT brief: art finish pass (Nov 2, 2026)

**Do this after the 8-frame enemy sheets** (`chatgpt-enemy-walk-v2.md`) are pushed. If those aren't done yet, finish and push them first.

## Why
Grok's art review (`docs/handoffs/grok-art-coherence-review.md`) found the art is strong but the **finish is mixed**: pixel-art characters and props sit next to flat procedural rugs and floor slabs (the big teal "WELCOME" mat, light pools, flat color blocks) and **phone emoji** in the HUD and level-up cards. In Grok's words, it looks like "three decks shuffled into one hand."

Rami agreed with the direction: **in a Midlife run the office is the whole journey.** No new stages or maps. This pass makes everything we already have look like one game.

Style anchors are in `assets/art-direction/STYLE_GUIDE.md`: navy `#171C35`, teal `#3E7775`, cream `#F2D7A1`, coffee orange `#EF9347`, 1px navy outline, upper-left light.

## Part A: pixel floor decor (in your room files)
- Find the flat `Graphics` and `fillRect` floor dressing in `src/start-area.js` and `src/data/start-area.js`. That includes:
  - the Lobby's teal WELCOME rug
  - the warm light-pool rectangles
  - any plain color slabs used as rugs, mats or runners
- **Replace them with native pixel-art decor sheets,** same style bible:
  - stitched rug edges and a tiny fringe
  - 1px navy outline where an edge shows
  - subtle dithering instead of flat fills
  - light pools as soft stepped pixel gradients
- They stay **non-solid floor decor** and keep getting baked into the 1024px floor images.
- **Tone the Lobby/Bullpen cream floor down slightly** toward the guide's low-contrast floor (it reads a bit loud next to the key art). Keep characters readable: check the hero and Bills on the new floor at 1x.
- **Readability check:** the hero shouldn't sink into teal rug plus teal sofa clusters.

## Part B: a denser Bullpen (your room files)
- The key art promises "navy cubicle canyons, CRT stacks, printer vomit." The live Bullpen is sparser.
- **Add density** to the Bullpen (more cubicle rows and partitions, monitor stacks, paper drifts, a jammed printer moment) while keeping every main route **224px clear** and visible props under 120 per screen.
- Keep the atrium/Lobby as the bright "breathing room."
- **Don't touch the spawn code** (`fitsSpawn`, `reachableSpawn`, `resolveSpawn`) or `src/navigation.js`. Note any pathing oddities in your handoff.

## Part C: pixel UI icons (art only; Claude wires them in)
- Draw a **32x32 pixel icon sheet**, one per level-up card plus the three character avatars. The emoji map lives in `UPGRADE_META` and `CHAR_ICONS` at the top of `src/ui.js`; that's 32 cards and 3 characters. Read it but **don't edit `src/ui.js`.**
- Same style bible: 1px navy outline, the coffee-orange accent, readable at 32px and at 16px.
- The flat stop-sign icon for "No." should become a proper pixel icon.
- **Deliver:**
  - `assets/ui-icons/icons-v1.png`, a grid with an exact opaque `#FF00FF` background
  - `assets/ui-icons/icons-v1.json`, mapping each card name (exactly as in `UPGRADE_META`) and each character id to a cell index
  - a review page `assets/ui-icons/review.html`, showing every icon at 1x and 2x next to its card name

## Rules
- **Don't edit:**
  - `CLAUDE.md` and devlog posts
  - `src/main.js`, `src/navigation.js`, `src/ui.js`, `src/promotions.js`, `src/breakables.js`, `src/enemy-art.js`
  - `src/boss-*.js`, `src/juice.js`, `src/sfx.js`, `src/telemetry.js`, `src/leaderboard.js`
- **Your files:**
  - `src/start-area.js` (room building and decor only)
  - `src/data/start-area.js`
  - `assets/`
- Native sheets, exact magenta key, shared palette.

## Test before pushing
- Load with `?nostats=1`, or block supabase and goatcounter. Never post test runs.
- Desktop 1280x800 and phone 390x844, no console errors, no frame-rate drop in the 350-enemy stress test.
- Before/after screenshots of the Lobby, Bullpen and one later room.

## Finish
- Bump `src/data/version.js`, `BUILD` in `src/loader.js` and the cache tag in `index.html` (Parts A and B change the game). Commit and push to main.
- Log it in `docs/handoffs/chatgpt-changes.md`, then stop for Rami's review. Claude wires Part C's icons into the HUD and level-up cards after Rami approves.
