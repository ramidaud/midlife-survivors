# ChatGPT brief: light every room (Nov 3, 2026)

Your floor pass is approved. Thank you, the compass inlay and the wet floor sign are perfect.

Claude shipped **lighting** in V. 1.57.0 (`src/lighting.js`, settings in `src/data/lighting.js`). A navy darkness layer covers the office, deepening with age (40% at 40, 63% at 65). Soft light pools are cut out at every entry in `START_AREA_LAYOUT.lights`, plus colored additive glows. Play a run to 50 or so and walk through every room first.

## The problem
Your 63 anchors cover the Bullpen (25) and the Server Room (20) well. The rest are nearly dark:

| Room | Anchors now |
|---|---|
| Parking Lot | **0** |
| Conference Rooms | 1 |
| Wellness Corner | 2 |
| Executive Wing | 3 |
| Lobby | 4 |
| Break Room | 6 |

## What to add (data only, in the same `lights` list: `{ x, y, r, color, kind }`)
- **Lobby:** pendant lights over reception, the elevator call lights, a glow from the OUR VALUES sign.
- **Parking Lot:** tall sodium street lamps (warm orange, large r), the exit sign, the V8's headlights during its fight area, the booted car's dome light.
- **Break Room:** the fridge light, the microwave, the coffee machine's red power dot, the vending machines you already have.
- **Conference Rooms:** ceiling panels (cool white, large r) and the projector beam, with one dark room that has its blinds closed.
- **Executive Wing:** the desk banker's lamp (green glass, warm), an aquarium (teal), a lit trophy shelf.
- **Wellness Corner:** the SAD lamp (bright cool white, large r), a salt lamp (soft pink-orange), the quiet pod's soft glow.
- New `kind` values are fine (for example `street`, `ceiling`, `aquarium`, `sad`). Claude will add their strength and glow settings. List any new kinds in your handoff.

## Optional: per-room mood
Add `lightAmbient` to any district in `districts[]` as a multiplier on the darkness: `0.7` = brighter (Lobby, Wellness), `1.25` = darker (Parking Lot at night, the Server Room). Claude wires it in.

## Rules
- **Data only:** `src/data/start-area.js` (the `lights` list and optional `lightAmbient`). Don't edit `src/lighting.js`, `src/data/lighting.js` or other `src/` files.
- Keep anchors on real light sources you drew, never floating in empty floor.
- Test with `?nostats=1` at desktop 1280x800 and phone 390x844. Capture each room at about age 50, before and after.
- Bump `src/data/version.js`, `BUILD` in `src/loader.js` and the loader cache tag in `index.html`. Commit and push, log it in `docs/handoffs/chatgpt-changes.md`, then stop for Rami's review.

## Update (Nov 3, V. 1.59.0, Claude)
Claude added automatic prop lights (`propLights` in `src/data/lighting.js`): street lamps, SAD lamps, vending machines, coolers, conference tables, the executive desk and more now light themselves, and `roomMood` sets each room's darkness. Per-room `lightAmbient` is no longer needed. What's still worth hand-placing: things that aren't props (exit signs, elevator call lights, the OUR VALUES sign, the V8's headlights, the booted car's dome light, the projector beam, the fridge light).
