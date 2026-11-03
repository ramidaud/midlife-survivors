# ChatGPT brief: animated coworkers (Nov 2, 2026)

Your 8-frame heroes are live (V. 1.46.0), and Rami approved them. Now the office's **26 coworkers are the only things that never move.** They're one static placeholder (`coworker_placeholder`, 48x56, three colorways) cropped behind desks. Give the office some life: a small cast of animated, seated coworkers who react a little when you walk past.

## Before you start
- `git pull` first. Main is V. 1.46.0 or later.
- **Current setup:** workers are placed from `data.workers` in `src/data/start-area.js` and drawn in `src/start-area.js` (search `slice_coworker_placeholder` and `isCoworkerPlaceholder`). Each one is cropped by `cropHeight` so the desk hides the lower body, and shows the `coworker_placeholder` caption on approach.
- **This time you may wire it in yourself,** since the coworkers are room art in your files. Keep it visual only.

## The cast (seated, upper body, behind a desk)
- **6 to 8 distinct coworkers,** two or three colorways each. Vary age, build, skin tone, hair and clothes, and keep them warm and recognizable, never mean. Ideas:
  - the person on a headset call who's been on mute for 20 minutes
  - the one eating a sad desk salad
  - the one asleep with their eyes open
  - the intern with three energy drinks
  - the one who's always on the brink of retirement
  - the person furiously typing "per my last email"
- **Each coworker gets a loop of 4 to 8 frames:** typing, sipping, nodding on a call, scrolling, chewing, a slow blink. **Plus a 2 to 4 frame "noticed you" reaction:** looking up, a small wave, a tired thumbs-up, a "hey, quick question" hand raise.
- **Cell size 48x56** (same as now), one row per animation, exact opaque `#FF00FF` background, style guide palette, 1px navy outline, upper-left light. Name the sheets `coworker-<name>-v1.png`, with preview GIFs and `assets/stage/coworkers/review.html`.

## Behavior (visual only)
- **Idle loop** at its own pace. Offset each worker's start frame so the office doesn't move in sync.
- **"Noticed you":** when the hero walks within ~120px, play the reaction once, then return to the loop, with a cooldown of ~6 s per worker. Read the player position the same way your caption code already does.
- **New captions:** give each coworker their own read-on-approach caption, replacing the shared placeholder line. Warm voice, no em dashes. Examples: "Muted for 20 minutes. Still nodding." / "Three energy drinks before 9. Do not ask about the fourth."
- Keep the existing **crop behind the desk,** the depth sort and the visible-prop cap. **Coworkers are not solid and don't affect enemies or spawning.**

## Rules
- **Your files:** `src/start-area.js` (worker drawing and animation only), `src/data/start-area.js`, `assets/`.
- **Don't edit:**
  - `src/main.js`, `src/navigation.js`, `src/world-art.js`, `src/enemy-art.js`
  - `src/promotions.js`, `src/breakables.js`, `src/ui.js`
  - `src/boss-*.js`, `src/juice.js`, `src/sfx.js`, `src/telemetry.js`, `src/leaderboard.js`
  - `CLAUDE.md` and devlog posts
- **Don't touch the spawn code** (`fitsSpawn`, `reachableSpawn`, `resolveSpawn`). Note any pathing oddities in your handoff.
- **Performance:** 26 animated workers must not cost frame rate. Use Phaser sprite animations or a cheap frame step, not per-frame canvas redraws. Re-run the 350-enemy stress test.

## Test before pushing
- Load with `?nostats=1`, or block supabase and goatcounter. Never post test runs.
- Desktop 1280x800 and phone 390x844, no console errors, and no frame-rate drop against V. 1.46.0 in the 350-enemy test.
- Before/after screenshots of the Bullpen and one later room, plus a GIF of a "noticed you" reaction.

## Finish
- Bump `src/data/version.js`, `BUILD` in `src/loader.js` and the cache tag in `index.html`. Commit and push to main.
- Log it in `docs/handoffs/chatgpt-changes.md`, then stop for Rami's review.
