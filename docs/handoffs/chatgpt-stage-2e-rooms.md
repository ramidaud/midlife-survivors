# ChatGPT brief: Stage 2E, the age-50 rooms (Nov 2, 2026)

The Parking Lot and Break Room are live, and their doors open at 45 (V. 1.37.0). Next: build the **Server Room** (behind `server-return`, off the Parking Lot) and the **Conference Rooms** (behind `conference-return`, off the Break Room), so the age-50 promotion has somewhere to go. Same slice approach as Stage 2C and 2D.

## Before you start
- `git pull` first. Main is V. 1.37.0 or later.
- **What's live now (don't break it):**
  - **Promotion doors.** `src/promotions.js` opens any gate with `age <= PROMOTIONS.openUpToAge` (currently 45). It removes the gate's `rect` from `navExtraBlockers`, turns off the gate body, and rolls the door up. Keep each gate's `record.rect` as the same object you push into `navExtraBlockers`, because that's how it gets removed.
  - **Smashable props.** `src/breakables.js` tags any `propGroup` body whose `sliceMeta.prop` is a family in `src/data/breakables.js`: printer, cabinet, vending_machine, trash_recycle, water_cooler, lost_found, coat_rack, plant. Use those families generously; they're loot.
  - **Bosses at full size.** Bosses are about 144x152 with attacks. The Mortgage boss (age 52) and V8 (age 60) will be fought in these rooms, so leave open space for a charge lane, a 260px ring and a 130px drift loop.
- **Don't edit:** `CLAUDE.md`, devlog posts, `src/main.js`, `src/navigation.js`, `src/promotions.js`, `src/breakables.js`, `src/boss-attacks.js`, `src/boss-art.js`, `src/juice.js`, `src/sfx.js` or `src/telemetry.js`.
- **Your files:** `src/start-area.js`, `src/data/start-area.js`, `assets/`. When you're done, tell me which `openUpToAge` value to set. I flip it myself.

## The rooms
**Server Room** ("Take It Offline")
- Cool blue lighting and humming rows of server racks with blinking lights. Lay the rack aisles out as lanes the swarm can flow through: 224px or wider, and not a maze.
- Landmark: a cable waterfall (the color-coded wiring from 2014).
- Gemini captions to use (Set A in `docs/handoffs/gemini-captions.md`):
  - `server_rack_blinking`
  - `server_taken_offline`
  - `server_crash_cart`
  - `slang_unplugged_lamp`
  - `slang_boil_ocean`
  - Reuse the existing ocean pot and offline lamp props here.
- Breakables: printers, trash cans and a crash cart (a new family if you have time).

**Conference Rooms** ("Synergy", "Bandwidth", "Alignment")
- Three glass-walled rooms off one wide hallway. Each room has a long table with chairs and a door gap of 224px or more.
- Jokes:
  - a whiteboard with a half-erased roadmap
  - a speakerphone shaped like a starfish
  - a "This meeting could have been an email" sign
  - one room permanently "BOOKED"
- Gemini captions to use:
  - `conf_room_synergy`
  - `conf_room_bandwidth`
  - `conf_room_alignment`
  - `conf_nine_hour_meeting`
  - `slang_hard_stop`
  - `slang_touch_base`
  - `slang_move_goalposts`
  - Reuse the existing STOP sign, touch base and goalposts props.
- Leave the main hallway roomy enough for the Mortgage's 260px rings.

**Far side:** put one closed **age-55 door** (Executive Wing) at the far end of either room, with the same gate format, so the next slice has a target.

## Rules
- Every doorway and main route stays at least 224px clear. Dress the floors (tape, carpet tiles, cable covers, coffee rings); no empty beige.
- Solid props join `propGroup` with accurate floor footprints. Floor decor stays non-solid and gets baked into the floor images like before.
- Keep visible props under 120 per screen. Match the existing style bible, native sheets and magenta key.
- Read-on-approach captions for the jokes. Write any missing ones in the same voice, with no em dashes.

## Test before pushing
- Load with `?nostats=1`, or block supabase and goatcounter. Never post test runs to the leaderboard or the runs table.
- Desktop 1280x800 and phone 390x844, no console errors.
- In a test-only build, open the age-45 and age-50 doors and check:
  - the player can walk Lobby → Parking → Server Room and Lobby → Break Room → Conference
  - enemies path into all of them
  - nothing spawns inside racks, tables or walls
  - the 350-enemy stress test holds frame rate
- **Ship the age-50 and age-55 doors CLOSED** (`openUpToAge` stays 45).

## Finish
- Bump `src/data/version.js`, `BUILD` in `src/loader.js` and the cache tag in `index.html`. Commit and push to main.
- Log it in `docs/handoffs/chatgpt-changes.md` (What, Files, For the game, Sizes, Notes for Claude or Rami). Then stop for Rami's review.
