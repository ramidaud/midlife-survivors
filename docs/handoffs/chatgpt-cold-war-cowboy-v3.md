# Cold War Cowboy v3 integration

Rami approved the compact sprite concept with chestnut waves, a more mature face, a subtle jaw shadow and a half-lidded sideways glance. The art is ready for integration.

| Asset | Path | Frame map |
|---|---|---|
| Walk and idle | `assets/characters/cold-war-cowboy-walk-56x60-v3.png` | 448×300, 56×60 cells, eight columns. Rows 0–3 Down, Up, Left, Right. Row 4 columns 0–3 breathe/blink, 4–7 floppy fidget. Foot line y56. |
| On Break | `assets/characters/portraits/cold-war-cowboy-on-break-v3.png` | 768×336, 96×112 cells. Row 0 six breathing poses at 220 ms, then two empty cells. Row 1 eight floppy dust poses at 140 ms. Row 2 eight stretch poses at 150 ms. Foot line y111. |
| Title badge | `assets/characters/cold-war-cowboy-badge-v3.png` | 32×32 transparent PNG. |
| Review | `assets/characters/cold-war-cowboy-v3-comparison.png` | 9-to-5er, Ben v2 and Ben v3 on slate at 4×. Walk, idle and On Break GIFs sit beside their sheets. |

The built-in imagegen studies used Rami's approved chunky Ben concept as the identity reference and the existing Ben sheets as the exact frame and layout references. The prompts specified chestnut waves, a mature jaw, half-lidded eyes, a scuffed hat, slate jacket and a beige floppy disk. The native exports use the 9-to-5er palette, hard transparency and aligned foot lines.

## Paste into Claude

> Integrate Rami's approved Cold War Cowboy v3 art from this workspace. Use the v3 walk, On Break and title badge paths in `docs/handoffs/chatgpt-cold-war-cowboy-v3.md`. Change only Ben's asset references, including walk loading in `src/world-art.js`, badge and On Break in `src/ui.js`, and Spotlight portrait display and preload in `src/spotlight.js`. Preserve the existing frame maps, timing, nearest-neighbor filtering, memo unlock, abilities and other characters. Check all four walk directions, both idle loops, the title badge, the pause portrait and Spotlight at desktop and phone sizes with `?nostats=1`. Follow the normal version and cache bump for the integration.
