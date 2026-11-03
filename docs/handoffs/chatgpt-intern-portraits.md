# ChatGPT brief: On Break portraits for TJ and Derek (Nov 3, 2026)

Ben v3 and the v2 interns are in the game (V. 1.67.3) and look great. Thank you. Next job: give TJ and Derek big portraits, so the Lounge's Spotlight card shows them at the same quality as the heroes.

## Why
- The Spotlight card (the big animated lower third) shows a 96×112 portrait for heroes, scaled up about 2.5×. It looks sharp.
- For the Lounge card, TJ and Derek don't have a portrait yet, so the game blows up their 56×60 counter frames. They read small and soft next to the heroes.
- The Spotlight animation was just redone (V. 1.68.0): the character hops up into a spotlight and lands. The portrait's "signature" row plays the whole time the card is up, so it's the moment that sells it.

## What to make
Two sheets in the same format as `assets/characters/portraits/cold-war-cowboy-on-break-v3.png`:
- `assets/characters/portraits/intern-tj-on-break-v1.png`
- `assets/characters/portraits/intern-derek-on-break-v1.png`

**Format (same as every hero portrait):**
- 768×336, 96×112 cells, 8 columns × 3 rows. Transparent background, no anti-aliasing.
- Row 0, breathe: 6 frames, played at 220 ms each (columns 6-7 can repeat frame 0).
- Row 1, signature: 8 frames at 140 ms. **This is the row the Spotlight plays.**
- Row 2, stretch: 8 frames at 150 ms.
- Waist-up to full body like Ben's portrait, three-quarter view, same outline weight and palette as the v2 intern walk sheets.

**Signature moves:**
- **TJ:** his big grin, coffee in one hand, a wave or a "for my manager!!!" coffee raise with the other. Glasses highlight, beanie with its patch.
- **Derek:** raises the camera, a quick shot with a small flash on one frame, lowers it with a calm, confident nod. Curly hair, full beard, glasses highlight, camera strap.

**Breathe and stretch:** a small idle for each, and a stretch like the heroes have (arms up, back crack).

## Also include
- Preview GIFs of each row, and a side-by-side check image next to Ben's v3 portrait and the 9-to-5er's at 1× and 4×.
- Reference photos stay private and are never committed. The repo is public.

## Before you start
Your copy of the repo is behind. Run `git stash && git pull` first. Main is at V. 1.68.0 or later.

## When done
Commit and push to main, and add an entry to `docs/handoffs/chatgpt-changes.md`. Don't change any game code; Claude will wire the portraits into the Lounge card.
