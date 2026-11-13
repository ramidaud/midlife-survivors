# Batch C size revision for PR #6

Applied the targets in `reference/revision-brief.md`. All 27 requested revised canvases match the brief. The three approved exports and 8x working rasters remain byte-for-byte identical to commit `402ba0d`; the reused Batch B wicker reference is also unchanged. Fixed hashes are retained in `reference/approved-sha256.json`.

The original full-resolution paintings were fitted onto new exact 8x canvases and reduced again. No reduced PNG was enlarged to make a revised sprite. Ghost cloth, weeds and the toy vehicle use a controlled fit in both axes to fill their requested silhouettes; other single-subject paintings retain proportional fitting. The four pergola support crops were repositioned and resized to align with the revised roof. Each manifest entry records its source fit and working raster.

The tarp subject was repainted with built-in imagegen as two upright leaning pallets, a green tarp and a metal bucket. Its original generated source, full prompt and exact yard crop used as reference are retained. The rejected firewood study is kept only for provenance.

The bunting reuses the earlier painting with larger triangular pennants, refitted to 208x48. The thin-flag painting remains as a study only. Lamp spacing in the assembly now meets the strand endpoints.

Footprints follow the actual painted-size change, not just the empty canvas dimensions. Lamp and support footprints remain at their bases. Roof, hanging decorations, ground extras and fog still have no collision footprints. Runtime navigation and depth sorting remain Claude’s integration work after art approval.

`revision-size-report.json` lists the previous and revised canvas/painted sizes and revised footprints. Every piece has a refreshed native yard-subject/new-art/hero comparison, plus a 4x detail view. The three `checks/revision-comparisons-*-1x.png` sheets collect all 30 native comparisons.
