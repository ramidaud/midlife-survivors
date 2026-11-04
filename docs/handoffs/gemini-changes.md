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


## Nov 4: new stage writing (hospital and home)
For the stage builds after the poll. Not in the game yet. Notes from Claude: the home boss reuses the HOA Board President (already a Full Life boss), so it needs its own twist or a new boss; the hospital unlock (Annual Checkup or Second Opinion 3 times) works with items that exist.

```json
{
  "hospital": {
    "blurb": "Fluorescent halls, mystery co-pays, and five-year-old waiting room magazines.",
    "enemies": [
      {
        "name": "Co-Pay",
        "line": "That will be forty dollars before we say hello."
      },
      {
        "name": "Out-of-Network Lab",
        "line": "The clinic is covered, but the microscope is freelance."
      },
      {
        "name": "Paper Gown",
        "line": "Ties in the back and respects zero personal boundaries."
      },
      {
        "name": "Triage Pager",
        "line": "Beeps three times right when you close your eyes."
      },
      {
        "name": "Cafeteria Gelatin",
        "line": "Wobbles menacingly and slows your shoes to a crawl."
      },
      {
        "name": "Blood Pressure Cuff",
        "line": "Squeezes your arm until your pulse hits high score."
      },
      {
        "name": "Clipboard Nurse",
        "line": "Needs your mother's maiden name and three more signatures."
      },
      {
        "name": "Mystery Deductible",
        "line": "Resets every January first just to keep things exciting."
      }
    ],
    "boss": {
      "name": "THE PRIOR AUTHORIZATION",
      "spotlight": "Your claim is pending review by a committee of fax machines.",
      "tip": "Step between the red stamp shockwaves when the gavel drops."
    },
    "gimmick": "Every two minutes, a freshly mopped tile strip appears across the corridor, making your turns slide wider while giving you a brief speed boost.",
    "tips": [
      "Please do not read the 2017 golf magazines. They only lower morale.",
      "The vending machine takes crisp dollar bills from before the millennium.",
      "Your doctor will be right with you. That was forty minutes ago.",
      "Remember to fast for twelve hours before fighting the cholesterol wave.",
      "Hospital coffee counts as both a beverage and a minor stress test.",
      "If the paper on the exam table crinkles, the enemies can hear you."
    ],
    "unlock": {
      "name": "Met Your Deductible",
      "desc": "Use Annual Checkup or Second Opinion 3 times across any runs."
    }
  },
  "home": {
    "blurb": "Cul-de-sac politics, barefoot plastic blocks, and tenth-grade fractions at 9 PM.",
    "enemies": [
      {
        "name": "Plastic Toy Brick",
        "line": "Waits in the shag carpet for an unshod heel."
      },
      {
        "name": "New Math Worksheet",
        "line": "Carry the one? We draw forty little boxes now."
      },
      {
        "name": "Check Engine Light",
        "line": "Glows amber the exact afternoon your warranty expires."
      },
      {
        "name": "Mystery Thermostat",
        "line": "Somebody touched the dial and now your dad senses tingle."
      },
      {
        "name": "Trash Can Rollout",
        "line": "It is 6 AM and the truck is already rumbling."
      },
      {
        "name": "Carpool Minivan",
        "line": "Double-booked for soccer and band on opposite sides of town."
      },
      {
        "name": "Water Heater Knock",
        "line": "Makes a rhythmic thumping noise that sounds like four hundred dollars."
      },
      {
        "name": "Leaf Blower Neighbor",
        "line": "Fires up the two-stroke engine at seven on Saturday."
      }
    ],
    "boss": {
      "name": "THE HOA BOARD PRESIDENT",
      "spotlight": "Your grass is two-tenths of an inch over code, neighbor.",
      "tip": "Sidestep the brass ruler sweep and stay off the cited lawn."
    },
    "gimmick": "Every ninety seconds, the automated lawn sprinklers pop up in alternating yard quadrants, washing away enemy projectiles while slowing anyone caught in the spray.",
    "tips": [
      "Who left the front door open? We are not air-conditioning the whole neighborhood.",
      "Look with your eyes, not with your hands. The garage shelves are fragile.",
      "The recycling goes in the blue bin, flattened, before Tuesday night.",
      "Do not touch the thermostat. Put on a cardigan if you are chilly.",
      "There is perfectly good food at home. Well, mostly condiments and tortillas.",
      "If you hear a strange rattle under the hood, just turn the radio up."
    ],
    "unlock": {
      "name": "Clear of Escrow",
      "desc": "Defeat the 30-Year Mortgage at Age 52 to get the keys to the house."
    }
  }
}
```
