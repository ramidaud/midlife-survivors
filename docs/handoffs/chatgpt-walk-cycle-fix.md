# ChatGPT art brief: hero walk cycles that actually alternate (Nov 5)

Feedback from Paul McKinney (art director, Rami's colleague): the heroes "glide with the occasional blip".
Claude checked the 9-to-5er sheet: in the right-facing row the near (orange) leg is in front in 7 of 8 frames, so the
far leg never swings forward. Up and left rows have the same problem. Down reads OK.

Claude has already fixed the code side (V. 2.7.10): walk frames now play on a steady 95 ms clock, not by distance.
Art and docs only; Claude wires it in.

## What to redraw
For each hero sheet (448x300, eight 56x60 cells per row, rows Down, Up, Left, Right, then the idle row untouched):
- `assets/characters/office-worker-walk-56x60-v2.png`
- `assets/characters/soccer-dad-walk-56x60-v2.png`
- `assets/characters/grad-student-walk-56x60-v2.png`
- `assets/characters/cold-war-cowboy-walk-56x60-v3.png`

Deliver as `-v3` (Cowboy `-v4`) next to the old files, with preview GIFs at 95 ms per frame.

## Walk cycle rules (8 frames)
1. Contact (near leg forward), 2. Down, 3. Passing, 4. Up, 5. Contact (FAR leg forward), 6. Down, 7. Passing, 8. Up.
- Legs must swap: frames 5-8 mirror frames 1-4 with the other leg leading. Arms swing opposite the legs.
- A 1 px body bob on Down frames, nothing else in the head moves.
- **Reuse pixels.** Head, hair, glasses and shirt stay pixel-identical between frames except for the bob. No re-drawn
  shading that flickers. Paul's note: pixels popping in and out everywhere reads as noise, not motion.
- Shoes land at local y56 in every frame. Same palette, same proportions, exact #FF00FF background.

## How to check
Open `tools/sprites.html` (the Sprite Board), pick HEROES, and switch to CHANGED PIXELS. Today each walk frame changes
600-800 pixels. A clean cycle should mostly light up the legs and arms, with the head dark.

## Later (not this pass)
Paul also suggested a polish round near the end with the heroes drawn natively at game size, and calmer seated
coworker idles (the receptionist's chair shading flickers). Rami will schedule that separately.
