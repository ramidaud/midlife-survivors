# ChatGPT brief: Stage 2G, the Wellness Corner (Nov 2, 2026)

The Executive Wing is live, and its door opens at 55 (V. 1.41.0). Last room for the Midlife run (ages 40 to 65): build the **Wellness Corner** behind your closed `wellness-executive` door (age 60). After this, every promotion in a Midlife run leads somewhere. Same slice approach as Stage 2D to 2F.

## Before you start
- `git pull` first. Main is V. 1.41.0 or later. Since your last push:
  - Claude opened the age-55 door (`PROMOTIONS.openUpToAge = 55`).
  - Claude fixed your desk-detour pathing note. Enemies behind wide furniture used to cancel out and walk backward, and now they pick a side. Thanks for flagging it.
  - Claude reworked Dad Joke into a punchline blast and added leaderboard retries.
- **Pathing is Claude's.** Don't edit `src/navigation.js` or the spawn code in `src/start-area.js` (`fitsSpawn`, `reachableSpawn`, `resolveSpawn`). Note any oddities in your handoff, like last time; that note found a real bug.
- **Don't edit:**
  - `CLAUDE.md` and devlog posts
  - `src/main.js`, `src/navigation.js`, `src/promotions.js`, `src/breakables.js`
  - `src/boss-attacks.js`, `src/boss-art.js`, `src/enemy-art.js`
  - `src/juice.js`, `src/sfx.js`, `src/ui.js`, `src/telemetry.js`, `src/leaderboard.js`
- **Your files:** `src/start-area.js` (room building only), `src/data/start-area.js`, `src/data/breakables.js` (new entries only), `assets/`.

## The room
**Wellness Corner** ("HR Says Relax")
- Softer and calmer than the rest of the office: warm light, a cork floor or soft carpet, plants everywhere, a pale lavender or sage accent.
- The corporate idea of self-care, gently funny:
  - a SAD lamp
  - a zen fountain
  - yoga mats
  - a massage chair
  - a puzzle table stuck at 80%
  - a felt quiet pod
  - a broken nap pod
  - a "MANDATORY FUN" banner
- Landmark: the massage chair or the quiet pod, your pick.
- Gemini captions (`docs/handoffs/gemini-captions.md`, Wellness section and Set A):
  - `wellness_massage_chair`
  - `wellness_zen_fountain`
  - `wellness_sad_lamp`
  - `wellness_yoga_mats`
  - `wellness_puzzle_table`
  - `wellness_quiet_pod`
  - `wellness_sad_yoga_mat`
  - `wellness_mandatory_fun`
  - `wellness_nap_pod_broken`
- Write two or three new ones in the same voice, with no em dashes (ideas: a "Step Challenge" leaderboard nobody updates, a bowl of fruit that's mostly bananas, a meditation app QR code that's expired).
- **Boss space:** the V8 Midlife Crisis arrives at 60, the same moment this door opens, so fights will spill in here. Leave a ~600px charge lane and room for the 130px drift loop, like the Executive Wing.
- **Breakables:** plants are the obvious loot here. Use the plant, water cooler and trash families generously, and the lost and found too (someone's forgotten yoga block).

## The boundary you flagged
Your Stage 2E note: the Conference approach corridor ends 16px from the proposed Wellness west edge. **Fit Wellness inside its district so the public Conference corridor keeps its full 224px.** Don't narrow it.

## Rules
- Every doorway and main route stays at least 224px clear. Dress the floors; no empty floor.
- Solid props join `propGroup` with accurate floor footprints. Floor decor stays non-solid and gets baked into the floor images.
- Keep visible props under 120 per screen. Match the style bible, native sheets and magenta key.
- **No new closed door is needed.** Midlife ends at 65 with the Retirement Party, so this is the last promotion room for now.

## Test before pushing
- Load with `?nostats=1`, or block supabase and goatcounter. Never post test runs to the leaderboard or the runs table.
- Desktop 1280x800 and phone 390x844, no console errors. `?navdebug=1` now shows solid cells in red if that helps.
- In a test-only build, open the age-60 door and check:
  - the player can walk Lobby → Parking → Server → Executive → Wellness
  - enemies follow you in
  - nothing spawns inside walls or furniture
  - the 350-enemy stress test holds frame rate
- **Ship the age-60 door CLOSED** (`openUpToAge` stays 55).

## Finish
- Bump `src/data/version.js`, `BUILD` in `src/loader.js` and the cache tag in `index.html`. Commit and push to main.
- Log it in `docs/handoffs/chatgpt-changes.md` (What, Files, For the game, Sizes, Notes for Claude or Rami), including any pathing oddities. Then stop for Rami's review.
