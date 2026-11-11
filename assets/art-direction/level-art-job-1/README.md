# Job 1: native hero and Bill repaint

Job 1 art package, approved by Rami for publishing to main. Art only, not wired into the game. Production started from `62c6b89`; publication is based on the latest main. Other art batches are outside this package.

[Open the animated comparison](review.html?nostats=1). This is an art-only copy of the existing Sprite Board with before/after pairs. Select IDLE or FIDGET, then CHANGED PIXELS. Original `tools/sprites.html` and its catalog are unchanged.

## Exports

| Character | Native PNG | Largest idle-row transition, before → after |
|---|---|---|
| office-worker-walk-56x60-v4.png | `/assets/characters/office-worker-walk-56x60-v4.png` | 540 → 124 px (3.69% of cell) |
| soccer-dad-walk-56x60-v4.png | `/assets/characters/soccer-dad-walk-56x60-v4.png` | 607 → 129 px (3.84% of cell) |
| grad-student-walk-56x60-v4.png | `/assets/characters/grad-student-walk-56x60-v4.png` | 471 → 93 px (2.77% of cell) |
| cold-war-cowboy-walk-56x60-v5.png | `/assets/characters/cold-war-cowboy-walk-56x60-v5.png` | 922 → 168 px (5.00% of cell) |
| enemy-bill-v3.png | `/assets/enemies/enemy-bill-v3.png` | Walk sheet only |

## Checks

- All 168 frames retain exactly the source foreground mask, with zero changed occupied pixels. Feet, silhouette and frame order are unchanged.
- Four 448×300 hero sheets, one 384×48 Bill sheet. RGBA, alpha exclusively 0/255, no magenta or off-palette foreground colors.
- Idle-row comparisons include frame 7 → 0. Separate breathing and fidget wraparounds also pass ≤168 changed pixels, 5% of a 56×60 cell. This percentage is cell area, not opaque body area.
- Timings preserved: heroes walk 95 ms, breathe 320 ms, fidget 170 ms; Bill walk 90 ms.
- Native material colors assigned explicitly. Generated pose study was a visual guide only. No generated image was shrunk into the native sheets.
- Checked normal and CHANGED PIXELS modes in the art-only Sprite Board copy. No game run or telemetry submission.

## Review images

`cleaned-poses-4x.png`: five columns (9-to-5er, Soccer Dad, Grad Student, Cowboy, Bill), direction/idle rows.

`check-0-4x.png` through `check-4-4x.png`: left = source, middle = repaint, right = the real source 56×60 9-to-5er as a scale comparison. Hero checks show all four directions and idle.

Each native PNG has a neighboring JSON manifest and `-prompt.json` record. Per-frame bounds, foot points and lower-four-row visible contact footprints are provided. These footprints describe the art and do not replace gameplay hitboxes.

## Review notes

The original alpha masks include silhouette movement and a few irregular edge pixels. Those are intentionally retained. Interior idle colors are held steady to reduce flicker; the Cowboy’s fidget is at the 168-pixel ceiling. Please review his face, disk gesture and darker denim in motion before integration.

No source sheets overwritten. No runtime files or version numbers changed. This package contains only Job 1 sheets, manifests, prompt records and review artifacts.
