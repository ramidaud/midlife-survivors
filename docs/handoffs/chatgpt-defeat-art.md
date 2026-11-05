# ChatGPT art brief: defeat remains and boss knockdowns (Nov 4)

Rami wants enemies to leave something behind when they fall, and bosses to get a proper "down" moment.
Right now Claude draws both in code: white scraps tinted the enemy's color (src/remains.js) and a copy of the boss's
hurt frame that tips over (src/boss-down.js). Replace those placeholders with real art. Art and docs only; Claude wires it in.

Same rules as every kit: the 12-color devlog palette, exact #FF00FF magenta background, native pixels, no text baked in,
no real brands, PNG sheets plus a manifest. Phone readability matters most (390 px wide screen).

## 1. Remains sheet (10 enemies x 3 variants)
- File: `assets/enemies/remains-v1.png`, cells 32 x 20, one row per enemy, 3 variants per row. Flat on the floor, seen from above at the game's angle, no shadows.
- Under 30 visible pixels of detail each: these sit on the floor for 9 seconds and fade, and there can be 60 at once.
- Rows, in this order:
  1. bill: torn bill scraps, one with a faint "paid" check mark shape
  2. lateFee: a ripped red penalty stub and confetti-sized red bits
  3. spamCall: a cracked phone case and two tiny screen shards
  4. snackAttack (Late-Night Donut): crumbs and pink sprinkles
  5. backTwinge: a flattened heat patch and a loose bandage
  6. officeGossip (Reply-All Chain): crumpled printouts with arrow lines
  7. threeAmThought: a faint lavender wisp puddle, half transparent look (no real alpha, use dither)
  8. calendarInvite: a torn calendar page corner
  9. groupChat: popped speech-bubble pieces
  10. mathWorksheet: shredded graph paper with an eraser crumb
- Manifest: `assets/enemies/manifest-remains.json` with each row's enemy id and a suggested tint of none (art is final color).

## 2. Boss knockdown frames (7 bosses)
- One extra cell per boss, 144 x 152 to match the existing boss sheets: the boss flat on its back or face-down, dazed, with a swirl of tiny stars or birds over it. Comic, never gory.
- Bosses: performanceReview, mortgageRefinance, midlifeCrisis, goldWatch, hoaPresident, retirementBoss, pickleballChamp.
- File: `assets/bosses/boss-knockdown-v1.png`, one row of 7 cells in that order, feet/ground line at y = 148.

## 3. Stamp plate (optional, nice to have)
- A rubber-stamp ink frame for the defeat words (EXCEEDS EXPECTATIONS, PAID IN FULL...): `assets/ui/stamp-plate-v1.png`, 9-slice, 48 x 24 with 8 px corners, russet ink on transparent (magenta), slightly uneven edges like a real stamp. Claude puts the text on top.

## Prompt template (per image)
```json
{
  "subject": "pixel-art floor debris left behind by a defeated office-life enemy",
  "style": "16-bit top-down pixel art, chunky 1 px navy outline, no anti-aliasing, matches Midlife Survivors enemy sheets",
  "palette": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "background": "#FF00FF flat, no gradient",
  "canvas": "32x20 per cell, 3 cells per row",
  "row_contents": "<one enemy's debris, three variations>",
  "rules": ["no text", "no brands", "no shadows", "reads at 1x on a phone"]
}
```
For knockdowns, swap subject to "the <boss> knocked flat and dazed, comic", canvas 144x152, and describe the boss from its existing sheet.
