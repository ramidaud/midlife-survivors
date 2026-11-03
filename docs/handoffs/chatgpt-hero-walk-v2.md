# ChatGPT brief: smoother heroes, 8-frame walk and idle (Nov 2, 2026)

Your 8-frame enemies and pixel icons are live (V. 1.45.0). Rami approved both. Now **the three playable characters are the choppiest thing on screen**: they still walk on 4 frames per direction. Give them v2 sheets to match. Art only; Claude wires them in.

## Before you start
- `git pull` first. Main is V. 1.45.0 or later.
- **Current sheets:** `assets/characters/*-walk-56x60.png` (224x240: 4 columns of 56x60, rows DOWN, UP, LEFT, RIGHT), with `character-data.js`, `generation-prompts.json` and the README.
- The game animates them through `src/world-art.js`. **Don't edit it, or any runtime file.** Claude wires v2 in after Rami approves.
- **Leave every v1 file untouched.**

## The sheets (one per character)
- **The 9-to-5er** (`office-worker`), **The Soccer Dad** (`soccer-dad`), **The Grad Student at 45** (`grad-student`).
- **Name them** `<character>-walk-56x60-v2.png`: 8 columns x 5 rows of 56x60 cells, so **448x300**.

| Row | Content |
|---|---|
| 0 | walk DOWN, 8 frames |
| 1 | walk UP, 8 frames |
| 2 | walk LEFT, 8 frames |
| 3 | walk RIGHT, 8 frames |
| 4 | **idle**, facing down: frames 0-3 a gentle breathing/coffee-sip loop, frames 4-7 a "tired midlife" fidget (glasses push, back stretch, checking phone), your pick per character |

- **Same character, same size, same foot line** as v1. Frames 0 and 4 of each walk row should match v1's frames 0 and 2 closely, so the switch is invisible except for being smoother.
- **A clear walk read:** alternating feet, arm swing, a small bob, and the mug or prop moving a little. Keep the silhouette centered with the feet on the same baseline.
- **Exact opaque `#FF00FF` background,** same palette, 1px navy outline, upper-left light (style guide in `assets/art-direction/STYLE_GUIDE.md`).
- **Preview GIF** per character, plus `assets/characters/review-v2.html`:
  - v1 vs v2 side by side for all four directions plus idle, at game speed
  - 1x and 2x zoom, on the Lobby floor color
  - no game, saves or analytics on the page

## Checks before pushing
- Every v2 sheet is exactly 448x300 with an opaque magenta background and no stray pixels across cell edges.
- The feet baseline is identical in every cell, and walk frames 0 and 4 match the v1 silhouette within a pixel or two.
- Desktop 1280x800 and phone 390x844 review page, no console errors.

## Finish
- **No game version bump** (art only). Commit and push to main.
- Log it in `docs/handoffs/chatgpt-changes.md` (What, Files, Sizes, Notes for Claude or Rami), then stop for Rami's review.
