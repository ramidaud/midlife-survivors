# Derek's camera correction, v2

[Native sheet](intern-derek-on-break-v2.png) replaces only the cream camera on Derek's v1 On Break portrait. The new charcoal body, round slate lens, upper-left glass highlight, viewfinder and tiny shutter match his walking-sheet camera. Existing hands, orange strap and flash are preserved.

| Row | Columns | Timing | Preview |
|---:|---|---|---|
| 0 | 0-5, then repeat | 220 ms/frame | [Breathe](intern-derek-on-break-breathe-v2.gif) |
| 1 | 0-7, then repeat | 140 ms/frame | [Signature](intern-derek-on-break-signature-v2.gif) |
| 2 | 0-7, then repeat | 150 ms/frame | [Stretch](intern-derek-on-break-stretch-v2.gif) |

The sheet remains **768x336**, eight columns by three rows of **96x112**. Row 0 columns 6-7 remain empty. Transparent PNG, hard alpha, original local y111 shoe line. Use nearest-neighbor sampling. The preview GIFs are 4x on navy and loop indefinitely.

[V1/v2 comparison at exact 4x](intern-derek-camera-v1-v2-check-4x.png), 1536x1344: each pair is v1 on the left and v2 on the right. Read across, then down: neutral `(0,0)`, lift `(1,1)`, flash `(1,2)`, face-level `(1,3)`, stretch `(2,3)`, recovery `(2,7)`. Coordinates are zero-based `(row,column)`.

## For Claude

Change the portrait reference to `assets/characters/portraits/intern-derek-on-break-v2.png` when approved. No new frame map, dimensions, timings or UI sizing. This delivery does not edit `src/data/interns.js` or either Spotlight card. Every v1 file remains intact.

## Production and checks

- Built-in imagegen supplied a camera-detail reference using Derek's v1 portrait and v2 walking sheet. The final detail was cleaned to the native grid and composited through individually measured camera masks, rather than regenerating the person. [Prompt](intern-derek-camera-v2-prompt.txt).
- Native camera footprints follow the existing poses, approximately 12-14 pixels wide and 11-12 high including the viewfinder. Only navy `#171C35`, charcoal `#303750`, slate `#526078`, cream `#F2D7A1`, warm white `#FFF0CF` and orange `#EF9347` were introduced inside those masks.
- Independent decoded-PNG comparison: **2,491 changed pixels across 22 occupied frames; zero changes outside camera masks; zero alpha changes**. Original skin colors and existing orange pixels are unchanged everywhere. Face, hair, glasses, jacket outside the camera, pants, shoes, flash and empty cells remain identical. The edit's local y range is 56-88, well above the shoe line.
- Original v1 PNG is byte-identical to the committed source. Its SHA-256 is `f58ff96bdee4a8ae678de671b9efb4fb9d128fea52fd487f67e6f84dec9c4c22`.
- V2 PNG SHA-256: `1d6ee6d6a7765111d353cb59125e2ca5a6f576119e94e90cf4ce2f04a4960cc8`.
- All GIF frames decode; frame counts are 6/8/8 and delays are 220/140/150 ms. Native sheet and enlarged comparison inspected; preview loading checked in 390x844 and 1280x800 browser viewports. Generated reference remains an authoring study outside the public repo; no reference photographs are included.
