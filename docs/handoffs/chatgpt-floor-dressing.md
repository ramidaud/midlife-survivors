# ChatGPT brief: floor dressing for the Courtyard Loop (Nov 3, 2026)

Rami approved the Courtyard Loop (V. 1.50.0). It reads well, but the open floors (the commons, the Bullpen aisles and the Lobby past reception) are flat and empty. This pass makes them feel lived in **without adding anything solid**. The open floor is the combat space and has to stay open.

## What to add (all non-solid decals, drawn under enemies and the hero)
- **Worn paths:** lighter carpet wear where people actually walk (the loop, the cooler, the printer, reception), stronger near doors.
- **Stains and history:** coffee rings, one big spill with a "CAUTION WET FLOOR" sign (decal only), a rug corner flipped up.
- **Office drift:** loose papers, a sticky-note trail, a fallen pen cup, cable runs taped to the floor between pods, a rolling chair pushed out into the aisle (decal, not solid).
- **The commons:** break up the plain green rectangle. A big faded company logo inlay or a compass-rose carpet pattern, a few chairs dragged in for an "all-hands", a forgotten pizza box.
- **The Lobby:** a long runner rug from the doors to reception, wet footprints, a dropped visitor badge, a lost umbrella.
- **Jokes:** two or three small readable gags in the house voice, such as tape outlining where the old printer used to be, or a sticky note that says "MOVE YOUR CAR -HR".

## Rules
- **Not solid.** No new collision, no changes to navigation, spawns, walls or gates. Decals sit on the floor layer only.
- **Readability first.** Enemies and pickups must stay easy to see. Keep decals low contrast and darker than the props, and never brighter than a gem.
- **Lighting is coming next** from Claude, using your `lights` list. Keep the decals matte, with no baked-in glow.
- **Performance:** bake decals into the floor texture or one static layer. No per-frame drawing. No frame-rate drop against V. 1.54.x in the 350-enemy test.
- **Your files:** `src/data/start-area.js`, `src/start-area.js` (floor drawing only), `assets/stage/`. Don't edit the other `src/` files, `CLAUDE.md` or devlog posts.

## Test and finish
- `?nostats=1`, desktop 1280x800 and phone 390x844, no console errors.
- Before and after shots of the commons, the Bullpen aisle and the Lobby runner.
- Bump `src/data/version.js`, `BUILD` in `src/loader.js` and the loader cache tag in `index.html`. Commit and push, log it in `docs/handoffs/chatgpt-changes.md`, then stop for Rami's review.
