# Memo 10 cover delivery, Nov 4, 2026 (Codex)

The 3 a.m. living-room cover is ready for Rami and Claude. Rami's studio v2 portrait supplies the likeness, Memo 8 the drawing style, and the cast share board the six miniature character identities. The two sleeping newborns are generic fictional pixel illustrations; no real baby photograph or likeness was used.

| File in `devlog/img/` | Size | Bytes |
| --- | --- | --- |
| `10-key-art.jpg` | 1600x900 | 393,301 |
| `10-key-art-portrait.jpg` | 1200x1500 | 378,333 |
| `10-key-art-preview-2x.png` | 3200x1800 | lossless preview |

Both JPGs are below 400,000 bytes. Optimized progressive 4:4:4 JPEG encoding uses quality 82 and 80. The lossless 2x preview contains only the requested twelve colors, with opaque flat 4x4 logical pixel blocks. JPEG encoding introduces small color variations at some edges; scaling uses nearest-neighbor throughout.

The source is cropped to an exact 1664x936 rectangle before uniform sampling to an 800x450 logical canvas. The portrait is a 360x450 crop at logical x120, uniformly enlarged to 1200x1500. It focuses on Rami, the bottle, laptop and emerging game. The wide composition retains both twins, all six cast members, the retro CRT and the tiny Gold Watch. The portrait is a true crop, not a stretched version or a separate scene.

The wall clock reads 3:00 with its minute hand up and hour hand right. The only other lettering is `DAD` on the mug and `V2` on the laptop note. The CRT uses a construction-barrier icon and blank counter tiles, respecting the restricted-text rule. There are no logos or baked memo-title words. The upper band remains calm for a later title overlay.

[Full imagegen prompts](memo10-key-art-prompts.json) include the initial scene and the targeted correction that cleared title space, made the laptop base/hand contact readable and reduced the Gold Watch. [Export checks](memo10-key-art-checks.json) record crop geometry, dimensions, compression and file weights. Large generated studies stay outside the public repo.

The JPGs were inspected in desktop 1280x800 and phone 390x844 browser views, with no console errors. This delivery changes art and docs only. The Memo 10 draft, its publication state, RSS, share-card code and game runtime remain unchanged; Claude can place the approved cover.
