# 9-to-5er pose v2: glasses and color cleanup

**Approved as-is by Rami on Nov 12, 2026.** Delivered as art and supporting documentation on `codex/office-worker-pose`. No animation or runtime integration is included.

## Three detail fixes approved by Rami, Nov 11

Updated the same native, 8x and review filenames. The pocket now has two 1x3 teal pens with no red marks, the two shadow pixels under the nose are skin color, and the mug has a one-pixel-thick outer handle. Exactly 18 native pixels changed, with zero changes outside those areas. All other pixels, dimensions and colors are preserved. `before-detail-fixes.png` retains the approved starting pose; `detail-fixes-checks.json` records the exact pixel diff and enlargement verification. The exporter includes the three fixed coordinate patches, so re-exporting retains them.

Built-in imagegen was used for the edit study (`detail-fixes-prompt.txt`). Its broader regenerated result was not substituted for the native pose. The final export enforces the requested changes on the existing grid so unrelated pixels remain identical. Original generated sources stay unchanged.

Single-pose art review. Built-in imagegen revised the glasses and simplified shading from the approved character direction. Production export is exactly 56x60 with binary alpha and 13 approved colors. No animation or game integration.

- `office-worker-native-pose-v2.png`: native transparent sprite.
- `office-worker-native-pose-v2-8x.png`: exact integer 8x enlargement.
- `office-worker-native-pose-v2-review.png`: actual size, 2x and 8x, left to right, on slate.
- `source-generated.png` and `prompt.txt`: unmodified generated source and complete prompt.
- `raw-sampled*`: intermediate nearest-neighbor samples, retained for comparison; these are not the palette-cleaned deliverables.
- `native-export-checks.json`: dimensions, palette, alpha and material-region counts.
- `export-native.cjs`: reproducible dependency-free PNG export. Run `node export-native.cjs <this-directory>`.

The source generator still returned high-resolution art with gradients. The export samples it onto the native grid without smoothing, chooses material families using explicit spatial and color rules, and selects a shade only within those families. This is not unrestricted nearest-palette snapping. Hair uses brown, skin uses the skin family, trousers use khaki, glasses use navy, pens use teal, and mug uses coffee orange. Alpha is thresholded at 128.

Technical checks establish size, palette and hard alpha only. They do not establish visual approval or animation quality. At this size the lenses are tiny and facial detail is deliberately limited. Rami reviews the native pose before more frames are made. No original asset was overwritten; no runtime or version changed.
