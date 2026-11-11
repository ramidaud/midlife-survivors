# Step 0: painted eight-piece review

Only the eight samples requested in `docs/handoffs/codex-level-art-redo.md`. Nothing integrated, no runtime/version changes. Existing art is untouched. No new gold is proposed or used.

Open `review.html` for old/new comparisons at actual 1× and 4×, plus rejected-v3 comparisons where available. `checks/sample-contact-sheet.png` shows all eight; the Bill uses frame 0 there. Bill has eight 48×48 frames and a 110 ms preview. Lawn is 128×128, fully opaque and seamless. Other samples are transparent RGBA with binary alpha.

## Painted pipeline and tool limitation

Eight separate built-in imagegen requests produced the source paintings in `sources/`. The tool did **not** honor requested raster dimensions. Those originals are retained unchanged and their dimensions are recorded in `manifest.json`. Subjects are cropped to their keyed silhouette, fitted proportionally with nearest-neighbor onto an exact 8× canvas, and then reduced by the mode of each 8×8 RGBA block. This is disclosed rather than claiming the model painted at the exact requested dimensions. No subject is assembled from code geometry.

Color mapping uses material families (slate, teal, greens, pink, paper, warm wood), then light/mid/shadow choices within those families. The approved 20-color palette is recorded in the manifest. Tiny final repairs add two gnome eye pixels, three separated Bill teeth and slate highlights on existing wire-leg pixels. The lawn repeats the first edge row/column at the last edge to remove the seam without smoothing its interior.

## Comparison provenance

Flamingo, gnome, mailbox and bin use exact 32×32 crops from the painted v1 atlas. Their rejected 48×48 v3 counterparts are also included. Maple uses the rejected native 160×192 v3 tree, since there is no older standalone tree for that slot. Lawn uses a native crop of painted lawn-v2-a, with rejected v3 available too. Bicycle uses the rejected 80×64 house-fill bike. Bill uses the shaded enemy-bill-v2. These old references are never enlarged to disguise size differences at 1×.

## Checks and status

`validation.json`: exact requested final dimensions, approved palette, binary alpha, matching lawn edges. Source/working stages and saved prompts are included. Native and 4× comparisons were inspected; all review images loaded and controls were checked in the browser. Requested viewport overrides did not match the browser's reported dimensions, so desktop/phone layout checks are not claimed. No game playtest is claimed. Rami reviews this sample before any full kit continues.
