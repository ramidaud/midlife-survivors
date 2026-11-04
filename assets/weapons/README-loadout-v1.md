# Loadout art: native weapon sprites and effects

Art only. Claude integrates the separate icon atlas and native sprites into the existing game. No attack cadence, damage, collisions, runtime files or version numbers are changed.

## Card and HUD atlas

`../ui/loadout-icons-v1.png` is 256x160: eight columns, five rows of 32x32. `../ui/loadout-icons-v1.json` maps every exact card name and weapon HUD id to its index. The brief names 27 cards; indices 27 through 33 supply seven dedicated weapon HUD glyphs, giving the requested 34. Cells 34 through 39 are empty. Existing atlas files remain untouched.

Every icon has a small corner accent for its play style. The four separate badge cells in `../ui/style-badges-v1.png` are 12x12, in Healing, Shield, Offense, Defense order, colored sage, teal, coffee orange and lavender. The icons do not depend on the accent to identify their subject. Labels and the WD-40 upgrade name exist only in metadata/review captions, never in the pixels.

## World sheets and previews

| Sheet | Cell | Grid | Animation |
| --- | --- | --- | --- |
| `casserole-v1.png` | 32x24 | 4x1 | Mom's Spaghetti sauce/steam, 140ms loop |
| `casserole-heat-v1.png` | 128x96 | 4x1 | sparse warm floor shimmer, 140ms loop |
| `phones-bubble-v1.png` | 80x80 | 6x2 | row 0 idle, 120ms loop; row 1 pop, 60ms once |
| `office-chair-v1.png` | 28x30 | 8x1 | eight 45-degree views, 80ms loop |
| `reply-all-v1.png` | 18x14 | 4x1 | flap/spark, 90ms loop |
| `ooo-field-v1.png` | 256x200 | 6x1 | elliptical travel ring, 180ms loop |
| `sticky-note-v1.png` | 16x16 | 4x3 | row 0 cream/pink variants; row 1 stuck/shake, 90ms loop; row 2 pop, 60ms once |
| `cold-snap-v1.png` | 160x160 | 6x1 | expanding frost, 60ms once |
| `frozen-overlay-v1.png` | 40x40 | 1x1 | static ice rim/icicles |

All animated rows have GIF previews on navy. Sticky row 0 contains two static colorways, not an animation; its last two cells are transparent. `manifest-loadout-v1.json` gives all frame and preview metadata. Except for the casserole's brief-specified 140ms, these are proposed art preview timings, not gameplay timing changes. Single-play previews omit the GIF looping extension. Replay by reloading.

Energy effects leave transparent centers so crowds and attacks remain visible. Frost uses cream, warm white and slate; no cyan. All PNG pixels use the requested twelve colors and binary alpha. Physical objects use navy silhouette edges; fields use sparse light-colored curves. Use nearest-neighbor sampling and preserve native aspect ratios. Chair wheels sit on local y29; effects use the center of their cells. Final runtime placement remains Claude's responsibility.

## Review and production

`../ui/review-loadout-v1.html` shows all named icons at 2x, badges, every animated row, and the combined labeled check. `../ui/loadout-check-v1.png` contains all 34 named icons at 2x plus every world family beside the actual 9-to-5er at 2x; the cold-snap panel uses a nearly expanded frame to show its reach.

Built-in imagegen produced the icon, chair-angle and weapon/effect studies. `generation-prompts-loadout-v1.json` keeps the full prompts. Native cleanup removes partial alpha and glow fringes, snaps colors to the palette, normalizes padding, and derives hard-pixel in-betweens and particle expansion from those studies. Generated sources remain outside the public repo; no photos are included. The check report covers dimensions, palette, alpha, active/empty cells, distinct frames, transparent effect coverage and chair anchors.

## Nov 4 rename handled before shipping

The revised brief on main renames Mom's Casserole to **Mom's Spaghetti**. The unlock, Second Helping, Potluck and weapon HUD icons now show spaghetti, and the four world frames use a cream bowl with sauce, noodles, meatballs and steam. Per the brief, filenames and the runtime weapon id stay `casserole`. JSON card names match the updated `LOADOUT_META`. Full updated prompts are preserved.
