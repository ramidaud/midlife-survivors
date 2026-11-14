# Maple Hollow roads, art review

Job 1 from `docs/handoffs/codex-roads-and-woods.md`. Built-in imagegen paintings, exported by whole-number reduction. Open `deliver/review.html` and `deliver/manifest-roads.json`.

Fifteen proposals: two 512x832 north-south streets, a 512x512 four-way crossing, four 512x512 T junctions named for the incoming stem, six 80x144 cars (sage, russet, slate; north and south), a 48x48 manhole and a 64x24 storm drain. Every image is an RGBA PNG. Ground plates fill their rectangle; cars and decals preserve transparent surroundings. No rotation is used to create alternate light directions.

Cars are walls with proposed body footprints; roads and decals are walk-through. Every piece has feet-line/foot-point metadata and a native 56x60 hero comparison. Ground sources fit exact 2x working canvases, objects fit exact 4x working canvases, then block-mode reduction and the existing material-family palette map. Original generator sizes vary and are retained once under `sources/`. No world art is drawn from code shapes.

## Approval limits

These are art proposals, not runtime replacements. Exact 320px asphalt openings and seamless curb connections are NOT yet certified. Painted edge widths vary. `deliver/checks/export-checks.json` reports estimated base-asphalt spans separately from export integrity; linework and crosswalks can split that estimate. Do not interpret export PASS as a seam PASS. Art approval must precede placement, and the road connection geometry must be resolved before integration.

The local-file browser preview was blocked by browser URL policy. PNGs were inspected directly; phone/iPad/desktop browser layout remains unverified. No game session, telemetry or leaderboard operation was used. No live assets, atlases or runtime version changed while approval is pending.

Rebuild with Python plus Pillow/NumPy: `python build.py`, then `python audit.py`. These scripts only write this package. `prompts.json` records initial passes; `final-prompts.json` records selected T-junction edits and selected object prompts. The Woods waits for road art approval, per the brief.
