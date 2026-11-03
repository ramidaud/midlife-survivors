# ChatGPT brief: build the new Lobby and Bullpen (Nov 3, 2026)

**Rami's verdict on your two plans:** build **Option B's loop** (the open commons with pods at the turns) **in Option A's look** (worn avenue carpet bands, pods on their own rugs, seated coworkers). Thank you for the plans. They were exactly what he needed to decide.

## What to build
- **Layout: Option B.** Use `assets/stage/layout-plan/plan-geometry.json` for B as the source of truth for positions and clearances:
  - the 704x656 commons as the main fight
  - the 400x416 south apron beside the glass office
  - pods at the turns of the loop
- **From Option A, bring over the look:**
  - worn lighter carpet bands along the main routes (B's tread around the commons becomes A-style worn bands)
  - each pod sits on its own team-colored rug
  - stepped window light instead of gray boxes
  - A's jammed printer and paper trail can replace B's printer if it reads better
- **Pods and identity:** Accounting, IT, Marketing and HR, with the accents from your README. Assign accents in desk order so neighbors differ. Mix desk types (cubicle, L-desk, standing, one empty last-day desk with a box, the glass manager's office).
- **Landmarks:** one per screen, as in your B table (reception logo, cooler chat, adding machine, HR candy bowl, dying office tree, printer, glass office, kitchenette, whiteboard "parking lot for ideas").
- **Coworkers seated in their chairs:** use the seated redraw at 44 to 52 world px head-to-shoe. Draw order: partition, then chair and coworker, then worktop over the thighs, so they sit *in* the chair, not behind a wall. Keep the existing idle reactions (typing, napping, looking up when you pass).
- **Standing scenes:** two at the cooler, one fighting the printer, one phone pacer, one slow mug walker. Visual only: not solid, and no effect on enemies or spawning.

## One extra for Claude: light anchors
Claude is adding **lighting** right after this (a dim office with warm light pools). Please add a `lights` list to the layout data, one entry per light source you place:
```js
lights: [ { x, y, r, color, kind } ]   // kind: "lamp", "window", "vending", "server", "screen"
```
- **Lamps:** desk lamps in the pods and reception.
- **Windows:** the stepped window shapes, with a rough rectangle in place of a radius if easier.
- **Vending, server racks and CRT glow** where they exist.
- You don't draw the lighting. Just mark where the light comes from. A warm 0xffd9a0 is fine for lamps, a cool 0x9fd8ff for screens and servers.

## Gameplay rules (unchanged)
- Every main route keeps **224 px clear**. The commons and south apron stay open floor where the swarm can surround you.
- Room outlines, hero spawn, doors, the age-45 gates and the later promotion rooms stay exactly where they are.
- Desks, partitions, chairs and large fixtures are solid. Decoration and standing people are not.

## Rules
- **Your files:** `src/data/start-area.js`, `src/start-area.js` (layout, drawing, coworkers), `assets/`.
- **Don't edit:**
  - `src/main.js`, `src/navigation.js`, `src/world-art.js`, `src/enemy-art.js`
  - `src/promotions.js`, `src/breakables.js`, `src/ui.js`
  - `src/boss-*.js`, `src/juice.js`, `src/sfx.js`, `src/telemetry.js`, `src/leaderboard.js`
  - `CLAUDE.md` and devlog posts
- **Don't touch the spawn code** (`fitsSpawn`, `reachableSpawn`, `resolveSpawn`). If a new solid shape traps spawns or pathing, note it in your handoff and Claude will fix it.
- **Performance:** no frame-rate drop against V. 1.47.0 in the 350-enemy stress test. Bake static floor and furniture into textures where you can; animate only the people.

## Test before pushing
- Load with `?nostats=1`, or block supabase and goatcounter. Never post test runs.
- Desktop 1280x800 and phone 390x844, with no console errors.
- **Pathing check:** let a swarm chase you around the full loop in both directions, and behind the glass office. Nobody should get stuck or walk away from you.
- **Screenshots:**
  - before and after of the Lobby arrival, the commons and the south apron
  - one zoomed-out capture of the whole area
  - a close crop of two seated coworkers next to the hero

## Finish
- Bump `src/data/version.js`, `BUILD` in `src/loader.js` and the cache tag in `index.html`. Commit and push to main.
- Log it in `docs/handoffs/chatgpt-changes.md`, then stop for Rami's review.
