# Handoff: put Batch 1 enemy art into the game (for ChatGPT / Codex)

Paste everything below the line into ChatGPT (Codex) with the Midlife Survivors folder connected.

---

You're helping Rami Daud with **Midlife Survivors**, a Vampire Survivors-style browser game (Phaser 3.80.1 from cdnjs, no build step). Live: https://ramidaud.github.io/midlife-survivors/

**Read first:** `CLAUDE.md`, `AGENTS.md`, `assets/enemies/README.md`, `assets/enemies/batch-1.json`.

## Goal
Replace the placeholder enemy drawings with the approved Batch 1 animated sprites. **Looks only.** Do not change any gameplay numbers: hitboxes, speed, HP, damage, spawn rates and attack timing all stay exactly as they are.

## How the game draws enemies today
- `src/sprites.js` → `buildSprites(scene)` draws every enemy on a canvas with `makeCanvasTex(scene, "<key>", w, h, ...)`.
- `src/data/enemies.js` lists enemies by key. Bosses use a `tex:` field.
- Game code files load through `src/loader.js` (any new file goes in its file list, not in `index.html`).

## Key mapping (game key → art file)
| Game key | Art file | Frame | Frames | Delay |
|---|---|---|---|---|
| bill | enemy-bill-v1.png | 48 | 4 | 180ms |
| lateFee | enemy-late-fee-v1.png | 32 | 4 | 100ms |
| spamCall | enemy-spam-likely-v1.png | 48 | 4 (0-1 walk, 2-3 ring) | 160ms |
| snackAttack | enemy-late-night-donut-v1.png | 48 | 4 | 150ms |
| backTwinge | enemy-back-twinge-v1.png | 48 | 4 (coil, lunge, stretch, recover) | 140ms |
| officeGossip | enemy-reply-all-v1.png | 48 | 4 | 220ms |
| threeAmThought | enemy-3am-thought-v1.png | 48 | 4 (includes fade poses) | 230ms |
| calendarInvite | enemy-calendar-invite-v1.png | 48 | 4 | 120ms |
| groupChat | enemy-group-chat-v1.png | 48 | 4 | 200ms |
| mathWorksheet | enemy-math-homework-v1.png | 48 | 4 | 170ms |
| ping | enemy-group-chat-ping-v1.png | 16 | 2 | 160ms |

Use the native `enemy-<id>-v1.png` files only (not `-source-` or GIFs).

## Steps
1. **Load the sheets.** Add a small new file, `src/enemy-art.js` (added to the loader list), that loads each sheet, keys out the exact magenta `#FF00FF` to transparent, and registers a Phaser spritesheet plus a looping animation per enemy. The game already keys magenta in `src/art-test.js`, so reuse that approach.
2. **Keep the old art as a fallback.** If a sheet fails to load, the existing canvas texture must still work, so the game never breaks.
3. **Swap the textures.** Enemies use the new texture key and play their animation. Spam Likely plays frames 0-1 while walking and 2-3 only while ringing. Back Twinge lines its poses up with its existing attack states. 3 AM Thought's fade poses are cosmetic only: collision stays controlled by the existing game logic.
4. **Size and crispness.** Scale so each enemy's on-screen size is close to today's (old canvas sizes are in `sprites.js`, roughly 28 to 42 px). Late Fee must stay visibly smaller than Bill. Pixel art must stay crisp (nearest-neighbor, no blur).
5. **Facing.** Flip horizontally to face the player if the current code already flips. Don't add new behavior.
6. **Shadows.** Add a small soft contact shadow under grounded enemies only. No shadow for 3 AM Thought or the ping.
7. **Bosses are not part of this pass.** Leave them alone.
8. **Settings.** Add `window.USE_ENEMY_ART = true` at the top of `src/enemy-art.js` so Rami can switch back to the old look for comparison.

## Test before pushing
- Desktop (1280x800) and phone (390x844): no console errors, enemies animate, sizes look right next to the player.
- Play to at least age 45 at Tax Bracket 0 and confirm the swarm still runs smoothly (no frame drops from hundreds of animated sprites).
- Confirm the leaderboard isn't touched. **Do not post test scores to the live leaderboard.**

## Finish
- Bump `src/data/version.js` (next patch version, one plain-English changelog line) and `BUILD` in `src/loader.js` to match.
- Commit with a clear message and push to `main`.
- Add an entry to `docs/handoffs/chatgpt-changes.md` in the usual format: What, Files, For the game, Frame sizes, Notes for Claude or Rami (include anything that looked off, such as a size that needed tuning).
- Don't edit `CLAUDE.md`, the devlog posts or game balance.
