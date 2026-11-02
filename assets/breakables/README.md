# Breakable office props, Part A

The original eight families were integrated by Claude. Stage 2F adds crash-cart damage art and its data entry; existing break logic and the eight existing configurations are unchanged. Built-in imagegen supplied the new damage art; Swift export produces the native PNGs. Original intact assets are never overwritten.

Open [the shared review](review.html) for all props and the Part B bosses. The page works directly from disk and over HTTP, has 1x/2x controls, all colorways, a debris preview, boss animation/state/frame controls and native hero/Bill comparisons. It loads no game code, analytics, saves or leaderboard.

## Native sheets

| Prop | Frame | Colorways | Intact source |
| --- | --- | --- | --- |
| printer | 80x80 | 1 | ../office-environment/printer-native.png |
| cabinet | 56x88 | 1 | ../office-environment/cabinet-native.png |
| vending_machine | 80x128 | 3 | ../stage/props/vending_machine-v1.png |
| trash_recycle | 64x64 | 3 | ../stage/props/trash_recycle-v1.png |
| water_cooler | 64x104 | 3 | ../stage/props/water_cooler-v1.png |
| lost_found | 80x72 | 3 | ../stage/props/lost_found-v1.png |
| coat_rack | 64x112 | 3 | ../stage/props/coat_rack-v1.png |
| plant | 48x64 | 1 | ../office-environment/plant-native.png |
| crash_cart | 96x112 | 3 | ../stage/props/server_crash_cart-v1.png |

`<id>-states-v1.png` has **three columns: intact, cracked, broken**, and one row per existing colorway. This is 21 colorways and 63 state frames. Each row's intact frame is pixel-for-pixel identical to the current native source. The image origin remains bottom-center of the original full frame; each damage state ends on the intact frame's last occupied row. Do not trim the empty space above rubble when importing it.

`<id>-debris-v1.png` has **six columns of 16x16 cells**, with the same colorway rows. This is 126 debris cells. Treat these as independent particles, not a six-frame animation. Proposed particle origin is center. Optional individual cracked/broken PNGs are included for inspection.

Broken occupied height is at most one third of intact occupied height. The printer keeps a native 3x5-pixel `PC LOAD LETTER` LCD joke. The cabinet spills a lavender binder, the vending machine releases one snack, and the cooler leaves a puddle and paper cup. The coat stays brown in every damage state.

All native PNGs have opaque exact #FF00FF backgrounds, hard palette pixels, navy outlines and no baked ground shadows. Remove only exact magenta on import. The shared 17-color palette is in manifest.json. Damage silhouettes and debris masks are shared across colorway rows.

## Prompts and reproduction

Full prompts, intended frame sizes and source references: `brief.json`. Selected generated sources: `sources/`. The coat's selected source is v2, with its recoloring prompt in `coat-correction-prompt.txt`; the earlier source remains archived. Built-in tool output was copied into this project. No API/CLI image generation was used.

Optional authoring commands, not a game build step:

```sh
swift -module-cache-path /private/tmp/midlife-art-swift-cache assets/breakables/export-native.swift "$PWD/assets/breakables"
python3 assets/breakables/validate.py
python3 assets/breakables/build-review.py
```

The exporter uses nearest-neighbor sampling, palette normalization, a one-native-pixel navy silhouette and the current controlled colorway maps. It copies intact pixels without resampling. Printer lettering is fitted as a native bitmap LCD at export so the requested line stays readable. The manifest and embedded review package are authoring outputs, not runtime registrations.

## Integration stays with Claude

Use the full unchanged frame and existing prop origin for all three states. Keep solid geometry until the intended breaking transition, then remove collision for the rubble and emit independent debris. Loot, health, breaking, particle motion and persistence are not implemented here. Walls, gates, desks, reception, sofas, goals board, values wall and roundabout have no damage sheets in this delivery.

See checks.json for pixel QA and qa/ for desktop/phone review evidence. Wait for Rami's approval before runtime integration.

## Stage 2F crash cart

`brief-crash-cart.json` records the full built-in edit prompt. `crash_cart-states-v1.png` is 288x336, with intact/cracked/broken columns and three colorway rows. `crash_cart-debris-v1.png` is 96x48, with six independent 16x16 particles per row. Intact frames exactly match the original art and all states keep its bottom-center origin and full 96x112 frame.

The assembly renders `server_crash_cart` and aliases its scan metadata to `crash_cart`, with `artProp` retaining the source ID. This lets the existing automatic breakable scan find the new data entry without editing runtime breakables.js. Browser checks confirm automatic registration, both damage transitions, disabled collision and three gem drops, with no position/origin/frame-size jump. Existing eight families were not re-exported. To reproduce only this addition, pass `brief-crash-cart.json` as the exporter's second argument.
