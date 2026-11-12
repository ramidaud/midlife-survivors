# 9-to-5er native pose review

Rami approved the rebuilt character direction on Nov 11, 2026. This follow-up simplifies the pose for a 56x60 frame before animation.

- `source-generated.png`: built-in imagegen edit of the approved design, retained unchanged.
- `prompt.txt`: full generation prompt.
- `office-worker-native-pose-v1.png`: exact 56x60 nearest-neighbor export.
- `office-worker-native-pose-v1-8x.png`: exact 8x enlargement of the exported pixels.
- `office-worker-native-pose-v1-review.png`: the same export shown at 1x, 2x and 8x, left to right, on slate.
- `native-export-checks.json`: dimensions, visible color count and alpha values.

This is a single review pose. No walk cycle, runtime integration, collision or timing changes. The generated source is not itself an exact integer enlargement. The export samples it without smoothing and does not automatically snap its colors to the palette. A 56x60 file alone does not prove production palette or edge compliance. Review the exact exported pixels before further work.
