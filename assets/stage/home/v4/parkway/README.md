# Maple Hollow Parkway art review

Six independent painted assets: fairway 512x512, putting green 512x512, flag 32x160, sand trap 256x160, golf cart 144x96, and front-facing north-south road barricade 320x96. Awaiting Rami's art approval. No runtime placement or game code changes.

Open review.html for native 1x comparisons with the complete unscaled 56x60 hero. Links show the fairway between actual v4 lawns, a 2x2 repeat, the separate flag over the cup, and the barricade across the existing street rotated into north-south orientation. Assemblies are review illustrations only.

## Painting and reduction

Original imagegen paintings, prompts, and exact working rasters are retained. Generator dimensions vary despite requested canvas sizes. Each source is normalized to an exact 2x ground or 3x sprite working canvas, then reduced by RGBA block mode and mapped by material into the existing 21-color yard palette. These are painted sources, not code-drawn objects. Ground alpha is normalized opaque using its painted RGB. The green was repainted to remove unwanted surrounding transparency; the earlier study is retained in reference. Cart and barricade paintings fit their requested canvas proportions; flag and sand retain source proportions. Manifest records every source dimension, crop, fit, and reduction.

Grass broad surfaces use #9BAE73 and #6D895B, with #315B4B confined to sparse painted blade marks. Sand uses three pale tones. No broad cyan or blue-green grass fields. Opposite ground edge blocks repeat painted samples; inspect the 2x2 preview when approving. At least three tones are retained per material, with palette and size checks recorded in validation-parkway.json.

Feet lines, foot points, and footprint rectangles use local native pixels. Walk-through art has empty footprints. Flag collision is a tiny base; the green itself remains walk-through. Wall footprints and depth anchors are proposals for later integration, not tested runtime physics.

To reproduce: Python with Pillow and NumPy, place this package as ROOT or run `python build.py`; output is written under deliver/. Source paintings and reference files are inputs. Browser checks use only local review files and do not run the game or send telemetry.
