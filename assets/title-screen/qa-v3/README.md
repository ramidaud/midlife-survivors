# Phone title art v3 check

[Five portrait and desktop pairs](portrait-v3-desktop-check.png). Both versions are displayed at exactly 25%. Portraits occupy the top row, with their matching desktop images directly below. Left to right, Group Photo, Reboot, The Lounge, Coffee Run and Happy 50th.

The v3 repair used built-in imagegen with the v2 portraits for composition and desktop art for proportions. Foreground action and the quiet office were prepared separately so the cast could be placed without distorting either axis. The final JPGs are 1080×1920 at quality 0.88, using nearest-neighbor sampling.

| Scene | Background crop | Uniform background scale | Uniform action scale |
|---|---|---:|---:|
| Group Photo | 936×1664 | 1.153846154 | 0.399429387 |
| Reboot | 900×1600 | 1.2 | 0.428134557 |
| The Lounge | 792×1408 | 1.363636364 | 0.573294704 |
| Coffee Run | 936×1664 | 1.153846154 | 0.419161677 |
| Happy 50th | 936×1664 | 1.153846154 | 0.518979834 |

Each listed scalar is applied equally to horizontal and vertical coordinates. Background crops are exact 9:16 rectangles. Group Photo, Reboot and Coffee Run fit their action into y600–880. The Lounge awning extends above the character band and Happy 50th's table and chair legs extend below it. The birthday group spans approximately 879 px of the 1080 px width.

The proportion review uses Group Photo's ball, Reboot's floppy hub, the Lounge coins and cup rims, Coffee Run's donut, and the birthday guests and cake beside their desktop references. The cup rims and cake retain the expected perspective.
