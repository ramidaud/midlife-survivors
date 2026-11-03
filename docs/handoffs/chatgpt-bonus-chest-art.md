# ChatGPT brief: Bonus Chest and payout art (queued after the office layout, Nov 3, 2026)

**Go (Nov 3): the Courtyard Loop is approved.** The Bonus Chest *moment* is live in V. 1.48.0+ with placeholder art (see `src/bonus-chest.js`). Play it once before you draw. This brief is the real art that slots into it. Art only, no game logic.

## The moment (so the art fits)
When you beat a boss and walk over its chest:
1. The game pauses and a card appears: **"BONUS APPROVED"** with an OPEN button.
2. The chest shakes, then opens. Light beams shoot up, one, three or five depending on the boss.
3. Item icons spin up each beam like a slot reel and land on the reward.
4. 401(k) coins fountain out while a counter ticks up, then the screen flashes gold.

Rami's reference is the Vampire Survivors chest opening (he sent screenshots). The goal is the same energy, but office-themed, in our palette and outline style. Don't copy its art.

## Deliverables (`assets/ui/bonus/`)
1. **The chest, 3 tiers**, one per boss, each with closed, shake (2 frames) and open frames on one sheet, at 96x96 per frame:
   - **Tier 1 (Performance Review):** a gift-wrapped "Employee Appreciation" box with a sad curling ribbon
   - **Tier 3 (30-Year Mortgage):** a small office safe with a brass dial
   - **Tier 5 (Midlife Crisis V8):** a big gold-trimmed executive bonus chest with a red velvet inside, as the showiest one
2. **Coins:** an 8-frame spinning 401(k) coin at 16x16 (gold), plus a silver variant and a paper "bonus check" that flutters (4 frames).
3. **Beam:** a 64x256 vertical light-beam strip that tiles or stretches, in gold, plus a lavender variant for evolutions.
4. **The card frame:** a 9-slice panel in our UI style for the "BONUS APPROVED" card, with a cream memo header strip and a corner stamp that says APPROVED.
5. **Retirement screen pieces** (the same system is reused at age 65):
   - a "HAPPY RETIREMENT" title treatment in gold pixel letters
   - a sheet cake
   - a gold watch icon
   - a party streamer strip
6. A **README** listing every file, its frame size and frame order, plus one mockup PNG of the full chest moment at 1280x800.

## Style
- Palette: navy #171C35, teal #3E7775, cream #F2D7A1, coffee orange #EF9347, plus golds.
- 1 px navy outlines, warm light from upper left, crisp pixels, transparent backgrounds.
- It should match the approved hero and enemy sheets.

## Also in this job: one icon fix
- `Reading Glasses` in `assets/ui-icons/` is navy on our navy cards and nearly disappears. Give it a cream or teal frame highlight so it reads on #171C35. Keep the 1 px outline style.

## Rules
- **Your files:** `assets/ui/bonus/` and the one icon in `assets/ui-icons/`. Don't edit `src/`, `index.html` or `CLAUDE.md`.
- No version bump. Commit and push, log it in `docs/handoffs/chatgpt-changes.md`, then stop. Claude wires it in.
