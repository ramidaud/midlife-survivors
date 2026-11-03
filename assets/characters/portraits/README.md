# On Break portraits

| Hero | Native sheet | Animated preview | Signature break |
|---|---|---|---|
| The 9-to-5er | [PNG](office-worker-on-break-v1.png) | [GIF](office-worker-on-break-preview-v1.gif) | Sips coffee, exhales, pushes his glasses up |
| The Soccer Dad | [PNG](soccer-dad-on-break-v1.png) | [GIF](soccer-dad-on-break-preview-v1.gif) | Checks his phone, winces at the group chat, pockets it |
| The Grad Student at 45 | [PNG](grad-student-on-break-v1.png) | [GIF](grad-student-on-break-preview-v1.gif) | Opens her notebook, turns a page, taps her pen, nods |

All sheets are **768×336 RGBA**, eight columns by three rows of **96×112** cells. Draw at native size with nearest-neighbor sampling. The pose feet share a fixed baseline at y111. The panel supplies the ground shadow.

| Zero-based row | Columns | Animation | Frame time | Total |
|---:|---|---|---:|---:|
| 0 | 0–5 | Breathe. Blink at column 3. Columns 6 and 7 are transparent. | 220 ms | 1,320 ms |
| 1 | 0–7 | Signature break action, then settle | 140 ms | 1,120 ms |
| 2 | 0–7 | Lower-back stretch. Tiny puff at column 4. | 150 ms | 1,200 ms |

The preview GIFs show two breathing cycles, then the signature break and the stretch, at 2× on navy. For the UI, the first row can loop between occasional single plays of the other rows. All three rows enter from the same neutral pose. The sheets use each hero’s approved v2 palette with opaque ink and transparent negative space.

Built-in imagegen produced the three `*-pose-study-v1.png` references. The native exports use those studies as key poses with palette cleanup, native in-betweens, pinned shoes, and the blink and stretch details drawn on the target grid. [Generation prompts](generation-prompts-v1.json)
