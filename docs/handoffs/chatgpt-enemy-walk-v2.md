# ChatGPT brief: smoother enemy animation, 8-frame sheets (Nov 2, 2026)

All the promotion rooms are done (V. 1.43.0). Next is the last open item in Rami's combat feel pass: **"the animations are more smooth and clean in Nerd Survivors."** Every enemy currently walks on **4 frames**. Draw **v2 sheets with 8 frames** so the swarm moves smoothly. This is art only; Claude wires it into the game.

## Before you start
- `git pull` first. Main is V. 1.43.0 or later.
- **Current sheets:** `assets/enemies/enemy-*-v1.png`, with `batch-1.json` and the prompts beside them. They're read by `src/enemy-art.js` (Claude's file, so don't edit it). The `specs` table at the top lists each enemy's file, cell size, frame count and frame timing.
- **Don't edit any runtime files.** Your files are `assets/enemies/` (new v2 files only) and a review page.
- **Leave every v1 file untouched.** The game keeps using v1 until Claude switches it over.

## The sheets
- **One row, 8 equal cells,** same cell size as v1, exact opaque `#FF00FF` background, same palette, outline weight and style bible.
- **Same character, same size, same foot line.** Frames 0 and 4 should match the v1 frames closely, so the switch is invisible except for being smoother. Keep the silhouette centered with the feet on the same baseline in every cell.
- **Name them** `enemy-<name>-v2.png`, plus a preview GIF each.

| Enemy | File stem | Cell | Frame layout (v2) |
|---|---|---|---|
| Bill | bill | 48 | 0-7 walk loop |
| Late Fee | late-fee | 32 | 0-7 fast scurry loop |
| Spam Likely | spam-likely | 48 | **0-3 walk, 4-7 ringing shake** |
| Late-Night Donut | late-night-donut | 48 | 0-7 roll/bounce loop |
| Back Twinge | back-twinge | 48 | **0-3 lunge, 4-7 rest/twitch** |
| Reply All | reply-all | 48 | 0-7 walk loop |
| 3 AM Thought | 3am-thought | 48 | **0-3 solid float, 4-5 fading out, 6-7 ghost** |
| Calendar Invite | calendar-invite | 48 | 0-7 walk loop |
| Group Chat | group-chat | 48 | 0-7 walk loop |
| Math Homework | math-homework | 48 | 0-7 walk loop |
| Group Chat ping | group-chat-ping | 16 | **4 frames** (0-3 pulse), up from 2 |

- **Walk loops** should read at a glance in a crowd: a clear bob, alternating feet or edges, and a tiny squash at each step. No new props, and nothing that changes the outline enough to look like a different enemy.
- **3 AM Thought's ghost frames** must clearly read as "can't be hit," with low contrast and see-through. The fade frames are in between.

## Review page
- Add `assets/enemies/review-v2.html`, showing v1 and v2 side by side.
  - Play each at its game speed (the `specs` timing, halved per frame, since there are twice as many frames).
  - Show 1x and 2x zoom, plus a crowd preview of 30 of one enemy.
- No game, saves, analytics or leaderboard on that page.

## Checks before pushing
- Every v2 sheet is exactly `cell * 8` by `cell` (the ping is `16 * 4` by 16), with an opaque magenta background and no stray pixels outside the cell margins.
- Frames 0 and 4 match v1's silhouette within a pixel or two at the feet.
- Desktop 1280x800 and phone 390x844 review page, no console errors.

## Finish
- **No game version bump** (art only). Commit and push to main.
- Log it in `docs/handoffs/chatgpt-changes.md` (What, Files, Sizes, Notes for Claude or Rami), then stop for Rami's review. After Rami approves, Claude switches `enemy-art.js` to the v2 sheets and adjusts the frame timing.
