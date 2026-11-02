# ChatGPT brief: Stage 2F, the Executive Wing (Nov 2, 2026)

The Server Room and Conference Rooms are live, and their doors open at 50 (V. 1.39.1). Next: build the **Executive Wing** behind your closed `executive-return` door (age 55, off the Server Room), plus a closed **age-60 Wellness Corner door** on its far side. One small extra: give the crash cart its smash art. Same slice approach as Stage 2D and 2E.

## Before you start
- `git pull` first. Main is V. 1.39.1 or later. Since your last push:
  - Claude opened the age-50 doors (`PROMOTIONS.openUpToAge = 50`).
  - Claude fixed the enemy-art shadow crash you found.
  - Claude made the PROMOTED message queue properly and made the music sleep when the page is hidden.
- **Claude is debugging enemy pathing right now** (a playtester saw enemies queue single file along a wall). Please don't edit `src/navigation.js` or the spawn code in `src/start-area.js` (`fitsSpawn`, `reachableSpawn`, `resolveSpawn`). If you spot a pathing problem in your tests, write it in your handoff notes instead of fixing it.
- **Don't edit:**
  - `CLAUDE.md` and devlog posts
  - `src/main.js`, `src/navigation.js`, `src/promotions.js`, `src/breakables.js`
  - `src/boss-attacks.js`, `src/boss-art.js`, `src/enemy-art.js`
  - `src/juice.js`, `src/sfx.js`, `src/ui.js`, `src/telemetry.js`
- **Your files:**
  - `src/start-area.js` (room building only)
  - `src/data/start-area.js`
  - `src/data/breakables.js` (crash cart entry only)
  - `assets/`

## The room
**Executive Wing** ("Corner Office Energy")
- Quieter and richer than the rest of the office: deep carpet, wood paneling, warm lamps, a glass-walled corner office with a skyline window.
- A wide executive hallway with a reception desk and a row of visitor chairs.
- Landmark: the corner office, with an oversized desk and the putting mat in front of it.
- Jokes and props (Gemini captions in `docs/handoffs/gemini-captions.md`, Executive Wing section):
  - `exec_credenza`
  - `exec_putting_mat`
  - `exec_founder_portrait`
  - `exec_ficus_tree`
  - `exec_visitor_chair`
  - `exec_award_cabinet`
  - Write a few new captions in the same voice, with no em dashes (ideas: a "Vision 2030" plaque, a standing desk nobody stands at, a mini fridge of sparkling water).
- **Boss space:** the V8 Midlife Crisis boss arrives at 60, which is after this door opens, so this room is where you'll fight it. Leave one long open lane (about 600px) for its charge and room for its 130px drift loop.
- Breakables: plants, cabinets, the water cooler and coat racks, used generously. The award cabinet can reuse the cabinet family.

**Far side:** one closed **age-60 door** (Wellness Corner), with the same gate format. Remember your own note: the Conference approach corridor ends 16px from the proposed Wellness west edge. Don't narrow that 224px corridor.

## Crash cart smash art (small)
- Give `server_crash_cart` the same treatment as the Part A breakables:
  - three damage states (intact, cracked, broken) per colorway
  - six 16x16 debris cells per colorway
  - same frame size and origin, exact magenta key
- Add a `crash_cart` entry to `src/data/breakables.js` matching the existing ones (hp, size, rows, loot), with two or three smash lines in the house voice.
- Claude's breakables scan picks up any family listed there automatically. Tell me if it doesn't.

## Rules
- Every doorway and main route stays at least 224px clear. Dress the floors (carpet runners, rug, a coffee ring on the good wood); no empty floor.
- Solid props join `propGroup` with accurate floor footprints. Floor decor stays non-solid and gets baked into the floor images.
- Keep visible props under 120 per screen. Match the style bible, native sheets and magenta key.

## Test before pushing
- Load with `?nostats=1`, or block supabase and goatcounter. Never post test runs to the leaderboard or the runs table.
- Desktop 1280x800 and phone 390x844, no console errors.
- In a test-only build, open the age-55 door and check:
  - the player can walk Lobby → Parking → Server Room → Executive Wing
  - enemies follow you in
  - nothing spawns inside walls or furniture
  - the 350-enemy stress test holds frame rate
- **Ship the age-55 and age-60 doors CLOSED** (`openUpToAge` stays 50).

## Finish
- Bump `src/data/version.js`, `BUILD` in `src/loader.js` and the cache tag in `index.html`. Commit and push to main.
- Log it in `docs/handoffs/chatgpt-changes.md` (What, Files, For the game, Sizes, Notes for Claude or Rami), including any pathing oddities you noticed. Then stop for Rami's review.
