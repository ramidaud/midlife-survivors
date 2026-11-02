# ChatGPT brief: Stage 2D, the age-45 rooms (Nov 2, 2026)

Rami's playtest: the Lobby and Bullpen feel good early, but **by minute 20 you need a lot more room to roam.** The two age-45 gates (Parking Lot and Break Room) need real rooms behind them. Build both as one slice, the same way you built the Lobby/Bullpen.

## Before you start
- `git pull` first. Main is V. 1.33.1 or later. Since your last slice: bigger enemies (`ENEMY_SCALE`), death/hit effects (`src/juice.js`), the sound pass, a speed pass (start-area floor Graphics are now baked into images at load), plants regrow, and a roundabout pathing fix.
- If Part A/B of `docs/handoffs/chatgpt-breakables-bosses.md` (smashed props, boss art) isn't pushed yet, finish and push that first.
- Same style bible, kit-based (64px floor tiles, modular walls, prop library), data in `src/data/start-area.js` / `assets/stage/start-area/`.
- Don't edit `CLAUDE.md`, devlog posts, `src/navigation.js`, `src/juice.js`, `src/telemetry.js` or `src/sfx.js`. **Claude owns gate opening** (door animation timing, removing the `navExtraBlockers`, the lower-third message). You build the rooms and leave the gates closed with their schedule data intact.

## The rooms
**Parking Lot** (behind `parking-access`, west side, approved Stage 1 concept is the target):
- Big and open: this is the "room to roam" answer. Painted parking lanes, a few rows of cars (use the existing car family, plus 1 or 2 new colorways), cart corrals, light poles, curb islands with a tree.
- Jokes: a reserved spot "EMPLOYEE OF THE MONTH (2014)", a car with a "MY OTHER CAR IS ALSO A HONDA" bumper sticker, a "let's put that in the PARKING LOT" sign on a whiteboard someone actually wheeled out here, a booted car (Dave's).
- Keep wide lanes (224px or more) between car rows so swarms flow.

**Break Room** (behind `break-access`, west side):
- Smaller and cozier than the Parking Lot but still fightable: a kitchenette counter, fridge with a passive-aggressive note, microwave with a line, a round table or two, vending machine, the coffee machine as the landmark.
- Jokes: "PLEASE LABEL YOUR FOOD" sign, a fish smell warning, a sad birthday cake with one slice left, a "Hang in there" cat poster.
- Use the breakable props (vending machine, trash/recycle, water cooler, plant) generously: this is a loot room.

## Rules
- Every doorway and main route stays at least 224px clear. Dressed floors (tape, rugs, stains), not empty beige.
- Solid props join `propGroup` with accurate floor footprints so enemy pathing works automatically. Floor decor is non-solid.
- Keep visible props under 120 per screen.
- Both rooms must connect back through their gates, and the age-50 gates beyond them (Server Room, Conference Rooms) should exist as closed doors on the far side, so the next slice has somewhere to go.
- Read-on-approach captions for the jokes (Gemini Set A in `docs/handoffs/gemini-captions.md` covers many; write the rest in the same voice).

## Test before pushing
- Load with `?nostats=1` (or block supabase and goatcounter). Never post test runs to the leaderboard or the runs table.
- Desktop 1280x800 and phone 390x844, no console errors.
- Temporarily open the gates in a test-only build (do not ship them open) and check: enemies path into and around both rooms, nothing spawns inside walls or cars, 350-enemy stress holds frame rate.
- Ship with gates closed.

## Finish
- Bump `src/data/version.js` and `BUILD` in `src/loader.js`, commit, push to main.
- Log in `docs/handoffs/chatgpt-changes.md` (What, Files, For the game, Sizes, Notes for Claude or Rami). Stop for Rami's review.
