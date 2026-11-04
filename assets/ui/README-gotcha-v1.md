# GOTCHA! art handoff

Art only. Claude owns `src/catch-moment.js` integration. Existing portraits stay intact.

| File | Cell and layout | Playback |
| --- | --- | --- |
| `../characters/portraits/intern-tj-caught-v1.png` | 96x112, 8x1 | 110ms, loop |
| `../characters/portraits/intern-derek-caught-v1.png` | 96x112, 8x1 | 110ms, loop |
| `gotcha-wordmark-v1.png` | 160x40 | static |
| `gotcha-wordmark-stamp-v1.png` | 160x40, 4x1 | 70ms, once, hold last |
| `../items/treats-v1.png` | 32x32, 3x2 | row 0 base, row 1 landing shine |
| `gotcha-frame-v1.png` | 96x96 | nine-slice, 24px corners |
| `../fx/gotcha-burst-v1.png` | 128x128, 6x1 | 60ms, once |

Treat columns: coffee, burrito, bundt cake. Transparent backgrounds and binary alpha; use nearest-neighbor. Portrait shoe line is local y111. TJ brakes, laughs and offers coffee; Derek lowers his dark round-lens camera and offers cake. The stamp starts larger/lower contrast, slams, squashes and settles. Its faint pose uses palette colors, not baked partial alpha; runtime opacity can add a fade. No lettering except the wordmark is baked into game art.

Four GIFs preview the caught loops, stamp and burst. `gotcha-check-v1.png` shows three landed treats on assembled 2x cards beside a 390px phone frame, plus a 16px treat reduction enlarged for inspection. `review-gotcha-v1.html` is an isolated responsive art preview and makes no analytics calls. Mockup captions are review labels, not exported textures.

`gotcha-prompts-v1.json` records the imagegen pose studies. Sources stay outside the public repo. Native cleanup normalizes silhouette scale, anchors, palette and alpha; wordmark, stamp, shine and burst exports derive from the generated artwork. No photos, gameplay changes or version bump.
