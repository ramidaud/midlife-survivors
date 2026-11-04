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

## 2026-11-03: Spotlight card copy (Bosses, New Hires, Promotions & First-Time Tips)
- **What:** Wrote 2 options each (34 cards total) for the mid-action Spotlight card system requested in `docs/handoffs/gemini-spotlight-copy.md`.
- **Files:**
  - `docs/handoffs/gemini-spotlight-copy.md` (fulfilled via Spotlight tables)
  - `docs/handoffs/gemini-changes.md` (updated)
- **For the game:**
  - **Bosses (3 x 2 options):** `Performance Review` (age 45, clipboard flash + line charge), `30-Year Mortgage` (age 52, shockwaves), `Midlife Crisis V8` (age 60, skid laps + skid marks).
  - **New Hires (3 x 2 options):** `The 9-to-5er`, `The Soccer Dad`, `The Grad Student`.
  - **Rooms Opening / Promotions (6 x 2 options):** Named coworkers (`Dave from IT`, `Pam from Payroll`, `Gary from Facilities`, `Linda from Ops`, `Arthur on Floor 4`, `Toby from HR`, etc.) announcing `Break Room`, `Parking Lot`, `Server Room`, `Conference Rooms`, `Executive Wing`, and `Wellness Corner`.
  - **Key First-Time Tips (4 x 2 options):** `First Elite` (red glow, hits harder, drops loot), `First Boss Chest` (`BONUS APPROVED`), `First Evolution`, and `Low Health`.
- **Sizes & Guardrails Verified:**
  - `Kicker`: 2 to 3 words, Silkscreen caps.
  - `Name`: Silkscreen caps, <= 20 characters.
  - `Line`: Spoken in character, <= 60 characters.
  - `Tip`: Plain and actionable, <= 55 characters.
  - Tone: Warm, recognizable midlife humor; never mean; zero brand names; zero em dashes.
- Saved as docs/handoffs/gemini-spotlight-cards.md. Build after healing, retirement and age 50+ modifiers (Rami, Nov 3).

## 2026-11-04: Final V2 copy audit
- Review: docs/handoffs/gemini-final-pass-review.md
- [done] Bugs + polish shipped in V. 1.77.0 (Nov 4). Skipped: Sam's card name length (fits as is), the decaf/password line moves, and the Grad Student Spotlight name (kept short to fit).
