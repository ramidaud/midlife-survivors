# Home unlock, three-room interior and hazards v1

Art-only local review drafts. No gameplay, navigation, collision, gate or version edits. Review gallery: `../../art-direction/review-home-unlock-interior-v1.html`.

## Player house

`your-house-v1.png`:384x224, two192x224 cells, closed then open. Porch anchor(96,216); driveway/bike decor extends below the porch toward y222. The open frame is a copy of the closed frame except local door rectangle(67,143,22,45). Exactly649pixels change; everything outside is pixel-identical. Includes a slow two-state unlock GIF and4x sheet check. Navy roof, orange walls, double garage, hoop, bike, leaf wreath, rock, crooked blank mat and kid drawing. No cast shadow.

## Key hunt

`key-hunt-v1.png`:256x64; eight32x32 cells in the top row, lower32px blank magenta. Order: rock, open rock/key, lifted mat, tipped pot, mirror/key, flagged mailbox, tagged key, pinned blank note. Minimum2px padding,4x preview and JSON rectangles.

## Interior

`house-interior-v1.png`:512x384 on a32px module grid. Thirty pieces: eight floors, four walls, eighteen furniture/room details. `house-interior-v1.json` names every exact source rectangle. Larger pieces occupy their own padded blocks;48px sizes leave unused padding in the surrounding64px module allocation. Do not slice the whole atlas as individual32px objects.

Top row first eight cells: oakA/B, checkerA/B, lavender carpetA/B, hall runnerA/B. Second row first four cells: horizontal wall, vertical wall, corner, doorway. Wall pieces and furniture use magenta; floor cells are fully opaque. Compatible oak/carpet edges match; checker uses periodic8px squares, with interior wear onB; runner east/west edges share a carpet band. Native floor seam checks passed.

Living room: sage couch96x48, recliner48x48, coffee table64x32, TV stand64x48, laundry32x32, lamp32x64. Kitchen: sink counter128x48, fridge48x64, stove48x48, round table/chairs96x96, junk drawer32x32, mail32x32. Kid room: dinosaur bed64x96, homework desk64x48, toy chest48x48, beanbag48x48, bookshelf64x48, ceiling-stars32x32.

`house-interior-rooms-preview-v1.png` assembles three rooms with a shared hallway and existing hero sprites for scale. This is an art mock-up, not a playable layout or navigation test. Furniture sizing and readable open space should be reviewed before runtime placement. Garage is outside this interior kit.

## Toy-brick hazard and lemonade shop

`home-hazards-v1.png`:384x128. Five32x32 decals at(x0,32,64,96,128;y0): four scatter densities and a single ouch brick. Open stand rectangle(256,0,64,128), closed stand(320,0,64,128). Remaining space intentionally magenta. Blank pink sign, pitcher, cups, cashbox, striped umbrella; closed table draped with cloth. No people or brand marks. Bricks are generic studded toys.

All four sheets use the exact12-color game palette and opaque#FF00FF key background, nearest-neighbor pixels, no anti-aliasing. Prompts and frame maps sit beside each sheet. `checks-home-unlock-interior-v1.json` records native dimensions, rectangle bounds/non-overlap and localized door change; per-pixel palette/opacity assertions also passed. Saved locally for Rami review, not pushed.
