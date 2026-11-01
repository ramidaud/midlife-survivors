# Office environment kit, first detail pass

The first detailed section is Accounts Payable in the separate Campus art preview. Visit Accounts frames it directly. The Nov 1 expansion uses a 3072x2048 floor, seven areas, five finds, 224px central routes, 192px outer loops and 160px branch paths. Other departments reuse the floor language and selected props; this does not finish the hospital, home, courtyard or resort.

## Illustrated assets

Generated with built-in image generation using `assets/desks/tidy-v1.png` as the style reference. Full prompts: `generation-prompts.json`. Large generated sources are `printer-v1.png`, `cabinet-v1.png` and `plant-v1.png`.

Game-ready native props, all on opaque flat #FF00FF backgrounds with hard palette-mapped edges:

| File | Frame | Floor footprint |
| --- | --- | --- |
| printer-native.png | 80x80 | width 48, back 26, front 4 |
| cabinet-native.png | 56x88 | width 38, back 40, front 4 |
| plant-native.png | 48x64 | width 24, back 15, front 3 |

The preview keys magenta to transparency. Background shadows are not part of the sprites. Short stepped shadows are drawn separately on the floor, following the upper-left light direction. Props sort by their floor contact point; the cabinet's deeper footprint keeps the hero from walking into its projected volume.

## Floors and environment layers

`carpet-native.png` and `wood-native.png` are opaque 64x64 repeating patterns on the existing 32px placement grid. Their opposite edges match exactly. Native geometric drawing keeps them seamless; generated images provide the illustrated props. The floor is intentionally quieter than characters and pickups. The expanded preview lightens carpet to #526078 with restrained darker texture and retains seamless matching borders.

`src/office-environment.js` creates carpet, wood and breakroom vinyl textures, material trim, low north-wall trim, recessed window lights, small floor papers/notes/coffee stains and gentle hard-edged light pools. The warm/cool balance and restrained placement tie the office to the key art. These floor-level accents do not add collision obstacles.

The expanded layout adds a central welcome rug, worn chair mats, repair patches, coffee rings, paper trails and rectangular cream light pools. These remain non-solid scenery. The map reveals 128px ground cells as the hero explores. `preview-large-floor.jpg` shows the first expanded ground at 1x. `preview-ground-contact.jpg` shows the subsequent grounding revision: fitted contact contours for all furniture and department landmarks, short southeast casts, under-desk shade, visible chair mats, caster wear and attached cables. Carpet tufts and wood grain use small pixel clusters. Shadows are scene geometry, never baked onto magenta exports.

Native props are embedded in `environment-data.js` for direct-from-disk loading. The main game does not load this kit yet. Current Art hides the new environment overlay and extra props, allowing comparison; Layout returns to the original small art study. Native downloads are also available in the environment gallery.
