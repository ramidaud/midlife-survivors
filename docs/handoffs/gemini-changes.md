# Gemini changes

Newest at the bottom. Rami pastes Gemini's change-log blocks here. Claude reads this at the start of each session and folds approved items into the game, then marks them **[done]**.

---

## 2026-11-01: District MEMO captions and overheard lines (Gemini)
- What: about 45 captions keyed to the stage brief (landmarks, promotion gates, remaining slang, posters), 36 extra district-flavor captions, and 20 ambient coworker lines (asleep under a desk, water cooler, on a call, microwaving fish).
- File: docs/handoffs/gemini-captions.md
- For the game: a caption library for ChatGPT's remaining Stage 2 props and Stage 3 coworkers. No game code touched.
- Claude review: approved with small edits (no brand names, apostrophes). Existing props keep their current captions.

## 2026-11-02: End-of-run achievement lines, prop smash lines, death lines [achievement lines in V. 1.34.0]
- 32 achievement lines mapped to the real list (coins only; Retirement Plan unlocks Full Life). Saved as window.ACH_END_LINES in src/data/achievements.js. Claude removed the "$" signs (coins show as "3k" in the game).
- 24 prop smash lines and 10 death lines in docs/handoffs/gemini-writing-2.md (printer line 1 now "PC Load Letter, my foot."). Smash lines wait for breakable props.
