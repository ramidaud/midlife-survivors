# ChatGPT art brief: coworker cleanup (Nov 5)

Feedback from Paul McKinney (art director): "The coworkers are exploding with pixels every frame. The bosses ...
read that way [retro]. Much less jarring." The Sprite Board (`tools/sprites.html`) confirms it on two counts.
Art and docs only; Claude wires it in.

## The numbers (measured by Claude)
| Sheet | Changed pixels per frame | See-through holes per frame |
|---|---|---|
| Seated "working" loops (row 0) | 30-46% | 43-95 px |
| Standing idle loops (row 4) | 46-74% | 34-99 px |
| For comparison: 9-to-5er v3 walk | 37% (a full walk) | 12 px |
| For comparison: Performance Review boss | 69% (a full walk) | 2 px |

A seated typing loop should change under 10% of its pixels (hands, a screen flicker, maybe a blink).
A standing idle should be a calm breath: under 12%.

## Files (all six coworkers: dozer, email, intern, mute, retiring, salad)
- `assets/stage/coworkers/world/coworker-<id>-seated-v1.png` (576x128: eight 72x64 cells; row 0 working at 180 ms, row 1 personal bit at 160 ms)
- `assets/stage/coworkers/world/coworker-<id>-standing-v1.png` (448x300: eight 56x60 cells; rows down, up, left, right walks, row 4 idle at 240 ms)

Deliver as `-v2` next to the old files, same sizes and layout, plus preview GIFs at the game timings above.

## Rules
1. **Fill the holes.** No transparent pixels inside a body, face, hair, clothing or chair. Real gaps (between an arm and
   the torso, between chair spokes) are fine. Check on the Sprite Board's MAGENTA backdrop: magenta should only show
   around the outside of the silhouette and through intended gaps.
2. **Reuse pixels.** Pick one key pose per row and keep everything pixel-identical across frames except what's meant
   to move. Seated working: hands and the screen glow. Personal bit: the one gesture (sip, stretch, phone). Idle: a
   1 px breath on the chest and shoulders, maybe a blink. No re-drawn shading that shimmers; no chair shading that changes.
3. **Keep each character.** Same faces, outfits, palette (the 12 colors), proportions and foot lines (seated chair
   base at the same y, standing shoes at local y56). Exact #FF00FF background, nearest-neighbor, binary alpha.
4. **Walk rows** (standing rows 0-3): apply the hero fix too, legs alternate (contact near leg, down, pass, up,
   contact far leg, down, pass, up), arms opposite, head steady except a 1 px bob.

## How to check
Open `tools/sprites.html`, pick COWORKERS:
- **CHANGED PIXELS** view: seated working should show red only on the hands and screen; idle mostly dark.
- **MAGENTA** backdrop: no magenta specks inside the characters.
- **ALL CARDS → WORKING / IDLE** sets every coworker at once for a side-by-side.
Report the before/after changed-pixel counts (the card shows "N px changed").
