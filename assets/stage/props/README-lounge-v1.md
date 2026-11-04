# Student Lounge kit v1

Art-only delivery, Nov 4, 2026 (Codex). Inspired by Rami's private room photographs. Original photos are not included. Claude builds the room in the Break Room's north end and adds the scene to the shop.

Eleven families, fifteen native cells. All production prop PNGs have **opaque exact #FF00FF backgrounds**, the requested twelve colors, hard pixel edges and upper-left cream highlights. No text, school marks, real brands, franchise characters or recognizable faces in the snapshot art. Key magenta before rendering; use nearest-neighbor filtering.

| Family/file stem | Cell | Cells | Role |
| --- | --- | --- | --- |
| lounge_futon | 128x72 | 2 | Solid. 0 plain, 1 burger/hot-dog pillows and white plush. |
| lounge_coffee_table | 88x52 | 1 | Solid table with chess, red book, bottle, napkins; rug outside footprint is cosmetic. |
| lounge_paper_lamp | 24x96 | 2 | Non-solid floor decor. 0 warm, 1 brighter. Preview swaps every 900ms. |
| lounge_desk_run | 224x88 | 1 | Solid, four monitors including beige CRT, cameras/lenses/cables and two pushed-in chairs. |
| lounge_cube_shelf | 176x64 | 1 | Non-solid mounted shelf with original generic toys and camera clutter. |
| lounge_collage_wall | 160x80 | 1 | Non-solid mounted whiteboard, camera doodle, abstract snapshots and tassel. |
| lounge_chalkboard | 64x96 | 1 | Non-solid mounted frame, lightning bolt; no easel or legs. |
| lounge_mic_stand | 24x80 | 1 | Non-solid floor decor, novelty microphone and weighted base. |
| lounge_filing_pumpkins | 36x88 | 1 | Solid tower, blank side board, two painted pumpkins. |
| lounge_posters | 48x64 | 3 | Non-solid mounted. 0 orange/navy, 1 navy/cream, 2 cream/orange. |
| lounge_accent_wall | 256x96 | 1 | Non-solid mounted mustard strip, seamless horizontal repeat. |

Every native sheet is `<stem>-v1.png`; equal horizontal cells, two-pixel edge clearance on isolated sprites. Floor foot anchors are `(width/2,height-3)`, matching the existing prop-kit convention. Mounted pieces use bottom-center at `height-1`. No background cast shadows are baked in. The manifest has the same `assets`/frame/footprint/origin structure as `manifest-wall.json`, with explicit `mount: floor` or `mounted`; exact Lounge widths replace the wall kit's 32px module constraint. It supplies suggested floor footprints for the four solid pieces. Desk collision includes the pushed-in chairs; do not use its monitor silhouette as collision. Claude owns placement and final footprint tuning against the hero.

The lamp's two cells are animation states. The futon's two cells and poster's three cells are variants, not animation. The brighter lamp changes only the shade colors and keeps its silhouette and foot fixed; there is no exterior halo, so it works with Claude's lighting pass.

## Shop scenes

- `assets/ui/lounge-scene-v1.png`: 960x360, native 320x120 at exact 3x.
- `assets/ui/lounge-scene-tall-v1.png`: 600x720, native 200x240 at exact 3x.

Both are opaque twelve-color illustrations with TJ seated raising coffee and Derek holding one charcoal camera on his orange strap. Lower fifth is reserved for calm floor/rug overlays. They are separately composed, aspect-cropped then uniformly sampled, never squeezed. The illustration uses warm wall-color and original room details; the game kit remains modular.

## Review and checks

[Review](review-lounge-v1.html) includes both shop scenes, the exact 2x room/hero check, all native cells and lamp GIF. `lounge-check-v1.png` shows all eleven families, all three posters, both futons and both lamp states, with the 9-to-5er. It is a scale board, not a playable layout.

`batch-lounge.json` stores the full built-in imagegen prompts and selected study paths. `assets/ui/lounge-scene-prompts-v1.json` stores the illustration prompts and cleanup/reframing instructions. Only selected native exports are committed, not generation studies or reference photos. Run `python3 assets/stage/props/validate-lounge-v1.py` from the repo root to verify dimensions, opaque backgrounds, palette, active cells, anchors, lamp invariants, repeat edges and scene exports. Results are in `checks-lounge-v1.json`.

No game code, balance, placement or version changes. Claude integrates after Rami reviews.
