# Full Life bosses, Father Time and floor pickups

Art only. Claude wires these into the existing Full Life attacks, finish goal and pickup code. No hitboxes, damage, movement, spawn rules or version numbers changed. Existing Midlife boss art and the age-65 clock-out station remain intact.

[Review](review-full-life-v1.html) includes animated states, literal storage-row previews, ground markers, the 1x hero/Bill comparison and the floor pickups at 2x. [Manifest](manifest-full-life-v1.json) records exact frame ranges, anchors and preview timings. [Full prompts](full-life-prompts-v1.json) record the built-in imagegen studies; the large studies stay outside the public repo.

## Three bosses

| Sheet | Game key | Existing move reference |
| --- | --- | --- |
| `boss-hoa-president-v1.png` | `hoaPresident` | straight charge, like Performance Review |
| `boss-retirement-audit-v1.png` | `retirementBoss` | shockwave, like Mortgage |
| `boss-pickleball-champ-v1.png` | `pickleballChamp` | drifting loops, like V8 |

Each sheet is **576x456**, four columns by three rows of **144x152**. Frames 0-5 walk; 6-7 wind up; 8-9 attack; 10 hurt; 11 completely blank magenta. Draw around native 1x, without multiplying the new sheet by an old procedural-boss enlargement. All use foot point **(72,148)**, normalized origin **(0.5,148/152)**. Do not trim cells. Art stays inside x4 through x139 and y4 through y148, leaving the baseline consistent and outer pixels clear.

All active pixels use the requested twelve-color palette. Background pixels, including the last cell, are exact opaque **#FF00FF**. Navy silhouette edges and nearest-neighbor sampling preserve crisp native pixels. The sheets use one common sampling scale per character, avoiding changing head/body size between frames.

Boss animation preview proposals: walk 140ms, wind-up 180ms, attack 110ms. These are art playback timings only; preserve the existing gameplay attack timing. Hurt is a single pose. Each boss has three state GIFs plus three literal-row GIFs. Storage rows cross animation boundaries: row 1 mixes the last two walk poses with wind-up, and row 2 shows attack/hurt. Those row GIFs are for checking the file, not runtime animation definitions. Blank cell 11 is omitted from the third-row preview. State and row GIFs together give 18 previews.

The HOA retiree has a clipboard, glasses chain and readable yardstick thrust. The cabinet accountant raises a stamp and slams it low with loose forms. The silver-haired athlete has a knee brace and orange shoes, with crouch and sliding-lunge poses. All are fictional characters, with comic surprise rather than injury in the hurt frame.

## Telegraphs

- `telegraph-hoa-president-v1.png`: 256x128 tape-measure lane, ticks and rightward chevrons, no numerals.
- `telegraph-retirement-audit-v1.png`: 192x128 broken ring of forms and checkboxes, no writing.
- `telegraph-pickleball-champ-v1.png`: 256x128 curved court lines and dotted ball trail.

Marker gaps are opaque magenta and need the same keying as the sheets. Use center origins. Art does not define hazard footprints, telegraph duration or damage. The markers have no baked floor shadow.

## Father Time: friendly finish line at 100

`father-time-v1.png` is **864x304**, six columns by two rows of **144x152**. It uses the requested boss foot point **(72,148)**. Its storage layout matches the clock-out station, whose existing foot point is y151; keep this distinction in the runtime origin.

- Waiting: frames 0-5, 160ms, loop. Gentle beard/breathing/blink/hourglass poses, planted lower robe and shoes.
- Handshake: frames 6-11, 110ms, once, hold frame 11. Smile, offer a hand and warm sparkles. Lower robe/shoes stay fixed through the contact sequence.

Two GIFs preview these rows. The handshake GIF omits the looping extension. He is a kind grandfather in a cream robe with a sash, wire glasses, cane and belt hourglass. No hood, skull, scythe, fight state or second person is drawn. The game can animate the player's arrival and trigger the win.

## Floor pickups

`../items/field-items-v1.png` is **96x64**, three columns by two rows of **32x32**. Columns are Fanny Pack, Energy Drink, PTO Day. Row 0 is the base item; row 1 preserves those pixels and adds a cream shine outline. These six cells are static variants, not an animation, so they have no GIF. Their backgrounds are transparent with hard alpha, with no circles, shadows or baked glow. The game supplies bobbing and glow.

`../items/field-items-v1.json` maps the runtime item names to base/shine frames. The shared check shows both variants at 2x. The tiny palm/chair is a compact icon, not an environment prop.

## Checks

Run `python3 assets/bosses/validate-full-life-v1.py` from the repo root to check grids, opaque keys, palette, margins, anchors, distinct active poses, the blank boss cells, fixed Father Time base, pickup alpha/shine and GIF loop flags. GIF frame counts and durations were also inspected with ImageIO. Review labels appear outside art; exported textures contain no letters, numerals or branding.
