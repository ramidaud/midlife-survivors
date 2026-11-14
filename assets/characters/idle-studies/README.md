# Hero idle scale studies

Art review only. Nothing is loaded into the game; existing walk sheets and v2 studies are untouched.

Open [the review](deliver/review.html). Each hero has an eight-frame, 448×60 transparent PNG strip with 56×60 cells, a looping 4× GIF and native/4× comparisons beside current walk frame 1.

| Hero | Action | Visible width × height | Sole line |
| --- | --- | --- | --- |
| 9-to-5er | Glasses push | 36×53 | y56 |
| Soccer Dad | Coffee sip | 38×55 | y56 |
| Grad Student | Notebook check | 30×53 | y56 |
| Coldwar Cowboy | Floppy disk check | 31×53 | y56 |

Coordinates use zero-based native pixels. Bounds are measured from the first top-left 56×60 cell of each `../*-walk-56x60-v4.png`. The Cowboy reference has an opaque magenta key background; it is excluded from measurement and palette extraction without modifying the original file. Other references use their existing alpha.

Built-in imagegen repainted four 4×2 pose studies using the current walk references, neutral white balance and the requested actions. The original paintings are in `sources/`; directions and source IDs are in `generation.json`. Preparation crops each painted pose, corrects its visible width and height to the requested reference bounds at native resolution, and places it on the exact reference foot line. There is no runtime scaling. Nearest sampling retains hard pixel clusters. Material families are selected before choosing shades from that hero’s existing walk palette; Dad’s polo stays teal and shorts/trousers stay khaki.

The first painted pose’s lower legs/shoes are held steady in all frames, and the final frame returns to the first rest pose for a clean loop. The walk reference itself has one raised foot; the idle has both feet planted. Each GIF uses a single fixed color table, with no new visible colors.

Frame order: rest, inhale, blink, rest, action begins, action peak, action releases, return to rest. Preview durations: 400, 200, 160, 400, 160, 240, 180, 400 ms. Timings are review proposals, not runtime changes.

Rebuild with `python assets/characters/idle-studies/build.py`; verify exported strips, GIFs, bounds, alpha, palettes and planted feet with `python assets/characters/idle-studies/check.py`. Python, Pillow and NumPy are required. `deliver/validation.json` records every cell and the reference SHA-256 hashes.
