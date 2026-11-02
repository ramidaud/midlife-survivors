# ChatGPT brief: breakable props and big bosses (Nov 2, 2026)

Rami played Nerd Survivors and wants two things from it: **almost every small object can be smashed for loot**, and **bosses that are huge and look distinct**. Claude handles all the code (breaking, loot drops, boss attacks). This brief is **art only**.

## Before you start
- `git pull` first. Main is at V. 1.32.0 or later. Enemies are now 1.4x and bosses 2.3x (`ENEMY_SCALE` in `src/data/enemies.js`).
- Same style bible as Stage 2 (native pixel sheets, shared palette, magenta key, outlines, colorway parity).
- Don't edit game code, `CLAUDE.md` or devlog posts. Put art and review pages under `assets/`, then log in `docs/handoffs/chatgpt-changes.md`.

## Part A: smashed props (do this first)
Each breakable prop gets **3 states in one sheet, same frame size and origin as the existing native sheet**:
1. **Intact** (the current frame, unchanged)
2. **Cracked** (shown after the first hit: dents, a crack, papers sticking out)
3. **Broken** (a low pile of rubble on the floor, about a third of the height, flat enough to walk over)

Plus a small **debris burst**: 4 to 6 tiny pieces, 8x8 to 16x16 each, in the prop's colors (paper scraps, plastic shards, a spring). Claude animates them flying out.

Props, in priority order (all colorways each):
1. printer
2. cabinet (filing)
3. vending_machine
4. trash_recycle
5. water_cooler
6. lost_found
7. coat_rack
8. plant (existing potted plant; current crack art can be replaced)

**Stay solid, don't make broken states:** walls, gates, desks, reception counter, sofas, goals board, the values wall, roundabout. Rami wants the layout to still matter.

Humor: the broken state should be a little funny. The vending machine drops one stuck snack, the water cooler leaves a puddle with a paper cup, the filing cabinet spills one lavender binder (the Archive clue), and the printer shows "PC LOAD LETTER."

## Part B: big boss art (the 3 Midlife bosses)
Bosses now show at about **2.3x their old 64x68 size** (around 150 px tall, 2.5x the 56x60 hero). Draw them natively at **about 144x152** so they stay crisp, not as an upscale.

For each boss: a **walk cycle (6 frames)**, a **wind-up pose (2 frames)** that clearly warns "attack coming", an **attack pose (2 frames)**, and a **hurt flash frame**. The attacks themselves get coded later from a Grok spec. These are the planned moves, so the poses fit:

| Boss | Appears | Planned attack | Wind-up | Attack pose |
|---|---|---|---|---|
| The Performance Review (clipboard/report card with a bar chart) | first boss | Charges in a straight line | Pulls back, chart bars flash red | Lunging forward, papers flying |
| The 30-Year Mortgage (heavy contract or house) | second boss | Slow shockwave rings ("compounding interest") | Stamps down, % signs glow | Ground slam, ring of numbers |
| The Midlife Crisis V8 (red sports car) | third boss | Fast drift loops, leaves skid marks | Revving, exhaust puffs | Sliding sideways, tires smoking |

Also deliver **one telegraph ground marker per boss** (where the attack will land), for example a red dashed lane for the charge, a % ring for the shockwave and tire-track arcs for the drift. Keep them semi-flat floor decals, 128 to 256 px.

## Review page and checks
- Review page like `assets/enemies/review.html`: every prop in all 3 states next to the 56x60 hero at 1x and 2x, and each boss animating next to the hero and a Bill at real game size (Bill is now about 50 px wide).
- Run your usual palette, magenta, margin, outline and colorway-parity checks.
- Desktop 1280x800 and phone 390x844 for the review page.
- Commit, push, and log it in `docs/handoffs/chatgpt-changes.md` (What, Files, For the game, Sizes, Notes for Claude or Rami). **Stop after Part A + Part B** for Rami's review.
