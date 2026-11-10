# Maple Hollow v2: local art review

All ten requested PNGs are native RGBA with hard alpha and the twelve-color game palette. Existing files remain untouched. This set is not committed, pushed or wired into the game.

| File | Native size | Contract |
|---|---:|---|
| houses-v2.png |2496x384| Six416x384 cells,336x352 facades,64px right-side routes |
| your-house-v2.png |400x400| Left entry, right single garage,64px side-route band |
| street-wide-v2-a/b.png |832x512 each| Two416px lots, matching horizontal edge columns |
| backyards-v2.png |2496x448| Six416x448 cells with64px-high side gate gaps |
| your-backyard-v2.png |416x448| Patio, fire pit, two chairs, soccer goal |
| interior-floor1-v2.png |416x1392| Measured first floor, single garage |
| interior-floor2-v2.png |416x928| Measured upstairs, front bedroom as office |
| rami-desk-v2.png |240x140| Curved monitor, second monitor, laptop, tablet, peripherals |
| rami-desk-wall-v2.png |240x96| Crayon drawings and lamp accent |

## Scale and placement

Floor-plan distances use24px per foot, with16px walls. Dimensioned rooms retain their printed sizes: living384x230; dining206x212; garage262x480; master384x266; office302x268. The floor canvases are taller than the rough brief estimates to accommodate these distances. Rami confirmed the actual garage is10′11″ x20′ and single-car; the minivan is the only parked vehicle inside.

The hero keeps the supplied56px projected render height. Printed plan distances, sprite elevation and the requested street band dimensions should not be mistaken for a literal engineering projection. Undimensioned halls, closets and bath partitions are inferred from the plan. Diagonal walls/door swings are rectangular approximations, explicitly recorded in the floor JSONs.

Neighbors use416px cells. The player house uses a400px canvas placed at x16 within a416px lot:336px facade plus64px right side-route. Its240px garage bay band includes the jambs. Neighbors have the clear right strip at localx352..415. Open hinge art sits outside that strip.

Street bands repeat at832px. Top aprons are64px wide at x288 and704, extending through sidewalk/parkway into the curb lip. Cross-section:64 sidewalk +32 parkway +320 road +32 parkway +64 sidewalk. Dashes32on/32off, phase16. Left/right columns are identical across both variants. Parked cars are illustrative dressing in the plate, not separate runtime objects.

Backyards share exact boundary colors. Gate gaps are at localy224..287 on both sides, and the bottom-right64px square joins the house side route. Keep the same lot order as the house atlas. The six-yard seam check shows them side by side. Baked furniture and fences still need Claude's collision work; these illustrations do not certify a playable path around every object.

## Interior assembly and checks

Floor JSONs list every painted wall, door opening, room rectangle, rendered furniture rectangle and floor footprint. Door/wall overlap and bounds checks pass. Drawn floor/wall geometry uses those same rectangles. New generated upstairs furnishings and the real-desk study are combined with the existing modular house/garage furniture. Flat plank floors replace the noisy old wood tile. The extra furniture-study PNG is traceability art, not a runtime dependency.

`checks-maple-v2.json` records sizes, palette and alpha checks. Street A/B/A and all-six-yard seam images are included. `block-mockup-v2.png` shows three native lots, backyards, the wide street and the actual56x60 hero. Review `review.html` for all assets at fit/native sizes, including390px phone previews.

No game code, version bump, navigation, spawning, light anchors or collisions were changed. Claude handles integration after Rami's review. Reference photos are not copied into this delivery.
