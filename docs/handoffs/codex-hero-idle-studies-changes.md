# Hero idle scale studies (Codex, 2026-11-14)

Ready for art review. Nothing placed in the game; no version/build change. Existing walk sheets and v2 source studies are untouched.

Review: `assets/characters/idle-studies/deliver/review.html`.

| Hero | Native sheet in that deliver folder | Action | Visible width × height | Sole |
| --- | --- | --- | --- | --- |
| 9-to-5er | office-worker-idle-56x60-study.png | Glasses push | 36×53 | y56 |
| Soccer Dad | soccer-dad-idle-56x60-study.png | Coffee sip | 38×55 | y56 |
| Grad Student | grad-student-idle-56x60-study.png | Notebook check | 30×53 | y56 |
| Coldwar Cowboy | cold-war-cowboy-idle-56x60-study.png | Floppy disk check | 31×53 | y56 |

Each PNG is 448×60, eight 56×60 cells ordered left to right. Reference is the top-left cell, frame 1, of that hero’s current `assets/characters/*-walk-56x60-v4.png`. Cowboy’s magenta background is keyed out for measurement; his original sheet is untouched.

Every native frame has exact reference bounds and shoe-contact line. First painted pose’s lower legs/shoes stay fixed, and frame 8 returns to frame 1. Material families are reduced only to each hero’s existing walk palette; GIFs have fixed palettes. Paintings use neutral white balance. Sources and directions retained under `assets/characters/idle-studies/`.

Preview durations: 400, 200, 160, 400, 160, 240, 180, 400 ms. These are review proposals only. The 4× GIFs and native/4× comparisons sit beside the strips. `validation.json` records reference hashes, every frame’s bounds, palette checks and foot stability.

Validation: `python assets/characters/idle-studies/build.py` and `python assets/characters/idle-studies/check.py` pass. The independent checker rereads all 32 exported cells, verifies exact bounds and palettes, and decodes all four eight-frame GIFs to compare pixels and timing. Browser at 1280×900 and 390×844 loads 12 images, with no broken images or page overflow. Screenshots and reproducible browser check: `reports/hero-idle-studies/`.

Next: Rami reviews the four loops and comparisons. Claude integrates only after approval, using the normal runtime version/cache workflow.
