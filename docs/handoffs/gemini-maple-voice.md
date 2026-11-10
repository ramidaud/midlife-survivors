# Gemini brief: Maple Hollow voice + one-voice copy audit (Nov 10, 2026)

## 1. Maple Hollow writing
Warm, recognizable, never mean (see `docs/GAME_DESIGN.md`). Please write:
- A name and a one-line personality for each of the six neighbors: young family, retirees, grill-master dad, fixer-upper, HOA President (already a boss), early-Halloween house.
- 3 short "yard gag" pop-ups per neighbor, shown when you cut through their backyard (max 40 characters each).
- 6 tip lines for the home stage (max 70 characters): spare key under the rock, Lemonade Stand, toy bricks, the garage at 60, the Math Homework at 45, crossing yards.
- 4 lines for Rami's desk in his upstairs office (what the game says when you walk up to it).

## 2. One-voice copy audit
The game's memos, tips, spotlights, errands, messages and banners were written at different times. Read
`src/data/spotlight.js`, `src/data/errands.js`, `src/data/tips.js` (or the tip file), `src/data/deaths.js`, and the title
screen copy, then list: lines that break voice, places that say the same thing differently, and a short style guide
(sentence length, when to use caps, emoji or not, how to address the player). This feeds a UI/UX design pass.

Reply in `docs/handoffs/gemini-changes.md` or a new `gemini-maple-voice-reply.md`.
