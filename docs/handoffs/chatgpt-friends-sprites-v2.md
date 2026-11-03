# ChatGPT brief: redo Ben, TJ and Derek (v2) to match the heroes (Nov 3, 2026)

Rami's review of v1: "They don't match the quality of everything else we've been building." He's right. Compare them side by side:
`docs/handoffs/img/friends-v1-vs-heroes.png` shows the 9-to-5er and Grad Student on the left, and v1 Ben, TJ and Derek on the right. Rows are the front walk, the side walk and idle. `docs/handoffs/img/ben-portrait-v1-vs-9to5er.png` shows the On Break portraits.

## What's wrong with v1
1. **No faces.** Ben's hat covers his eyes completely, and TJ's and Derek's faces are flat blocks. The heroes have readable eyes, glasses, eyebrows and an expression at 56×60.
2. **No motion.** The walk barely moves: same stance, legs together, no arm swing, no bob. The heroes stride with legs apart, swing their arms, and bob a pixel.
3. **Boxy, flat shapes.** The v1 bodies are rectangles with one or two tones per material. The heroes use 3 to 4 hue-shifted tones per material, a rim light from the upper left, and round, friendly silhouettes.
4. **Dark on dark.** All three wear near-navy clothing on our navy and slate floors under the new darkness layer, so they disappear. The heroes use warm, light shirts and pants that read against the floor.
5. **Front view.** The heroes are drawn in a three-quarter top-down view (head slightly large, body tilted toward the camera). v1 is a flat front view.

## How to redo them
- **Use the same process as the hero v2 sheets:** built-in image generation for pose studies, using the approved hero sheet as the "exact identity and pixel style reference" (see `assets/characters/generation-prompts-v2.json` and `README-v2.md`), then clean it to native pixels with the v1 hero palette. Don't hand-place rectangles in code.
- **Proportions:** match the 9-to-5er's head size, eye placement, outline weight and three-quarter angle. Put them side by side with him at 1× and 4× before you finish.
- **Walk:** 8 frames per direction like the heroes, with contact and passing poses, arm swing, a 1-pixel bob, and props that move with the hand.
- **Faces:**
  - **Ben:** tilt the hat back or show the eyes under the brim. Make the brim thinner and less wide (it's a felt cowboy hat, not a sombrero). Long wavy hair, round face, a friendly half-smile.
  - **TJ:** the big smile is his thing, so show teeth or a wide grin, glasses with a highlight, the beanie with its little patch.
  - **Derek:** curly hair with texture, a full beard with a jaw shape, glasses with a highlight, a calm, confident look.
- **Readable color:**
  - **Ben:** the dark jacket gets lighter highlights, and the light blue collar and the cream floppy disk stay as accents.
  - **TJ:** the parka gets lighter edge highlights (or goes charcoal instead of navy) with warm khaki pants, so he reads on the floor.
  - **Derek:** a lighter jacket tone or a visible rim light, plus the camera strap and snack bag as bright accents.
- **Idle:**
  - **Ben:** breathing, then he blows on the floppy disk.
  - **TJ:** sips or raises the coffee.
  - **Derek:** raises the camera for a quick shot.
- **Counter pose (TJ and Derek, row 4, columns 0–3):** waving or ringing up, from the waist up, with the face clearly visible.
- **Ben's On Break portrait (96×112):** match the 9-to-5er's portrait for detail and expression. His face has to show.

## Same technical rules as v1
- 448×300 sheets of 56×60 cells: rows Down, Up, Left, Right, Idle (or Counter). The feet line is y56. Transparent, or exact #FF00FF magenta, with no anti-aliasing.
- Ben's portrait: 768×336, 96×112 cells, the same rows and timing as the other portraits.
- Save as **v2** next to v1 (for example `cold-war-cowboy-walk-56x60-v2.png`, `intern-tj-v2.png`, `intern-derek-v2.png`, `portraits/cold-war-cowboy-on-break-v2.png`, `cold-war-cowboy-badge-v2.png`), plus a side-by-side check image with the 9-to-5er.
- Reference photos stay private. Commit and push to main, and log it in `docs/handoffs/chatgpt-changes.md`.
