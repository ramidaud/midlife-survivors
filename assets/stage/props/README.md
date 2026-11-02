# Stage 2 modular prop kit

Latest: **Stage 2C adds eight families and 24 colorways. Total: 33 families, 79 colorways.** The start-area kit is playable; 39 planned families for later areas wait for feedback. The gallery opens on 2C; use Batch to review earlier batches or all 33. Every card compares native art with the actual 56x60 hero and 36px Bill on desktop and a 390px phone.

## Batch 2B: literal slang and landmarks

| Family | Native frame | Collision role |
| --- | --- | --- |
| roundabout | 128x96 | solid footprint |
| gauge | 112x96 | non-solid wall |
| fruit_tree | 72x104 | solid footprint |
| kiddie_pool | 112x80 | solid footprint |
| baseball_base | 48x32 | non-solid floor |
| ocean_pot | 72x72 | solid footprint |
| duck_row | 96x48 | solid footprint |
| goal_dollies | 128x104 | solid footprint |
| hard_stop | 64x96 | solid footprint |
| offline_lamp | 64x88 | solid footprint |
| goals_board | 160x136 | solid footprint |
| giant_logo | 160x144 | solid footprint |

Each has two colorways on an even horizontal grid, plus individual frame PNGs. Colorways are not animations. Root kit IDs remain unchanged, so future map instances can reuse them. The company-values wall is a fictional employer's landmark, not a replacement game logo. Its source v2 removes attached plants so they can be assembled separately from the reusable library.

`manifest.json` indexes both batches. `manifest-2b.json` describes this batch; historical `manifest-2a.json` is retained. Full built-in-imagegen prompts are in `batch-2b.json`, with the focused wall edit in `wall-refinement-prompt.txt`. Sources are versioned, native art has opaque #FF00FF and hard shared-palette edges. Selected paint/container surfaces vary while water and foliage keep their material colors.

```sh
swift -module-cache-path /private/tmp/midlife-bio-swift-cache assets/stage/props/export-native.swift "$PWD/assets/stage/props" batch-2b.json
python3 assets/stage/props/build-review-data.py
python3 assets/stage/props/validate-props.py
python3 assets/stage/props/validate-props.py manifest-2b.json
```

These are optional authoring checks, not a game build step. `checks.json` covers all 79 frames, `checks-2b.json` covers the 24 slang frames and `checks-2c.json` covers the 24 new essentials. Both also check the unchanged 224px gate contracts. The older exporter defaults to the 2A brief when no batch argument is supplied.

## Integration ownership

Claude shipped flow-field navigation in V. 1.29.0 and first-batch props/captions in the current office in V. 1.29.1. The gallery authoring script reads the current family registry to document which art is registered, without editing it. Existing 2A native PNGs remain byte-identical in this pass. The new 2B families are not registered or placed by this art delivery.

`integration-2b.json` is an unloaded data candidate shaped like the existing stage-props.js family/caption lists. It has no chosen placements. Solid objects include proposed floor footprints for future propGroup bodies; Touch Base is non-solid floor decor, the MEH gauge is non-solid wall art. Neither should create a floor blocker. Claude owns navigation, locked-area spawn filtering and runtime integration. No main.js, navigation.js, world renderer, stage-props.js, balance, save or leaderboard edits are part of 2B.

All gate clearances remain 224px, with jambs outside that span. No new gate artwork or geometry is introduced in this batch. Desktop/phone and native QA evidence lives under docs/qa/stage-pass-2b/. New-world crowd testing, modular boundaries/floors, remaining posters/furniture/slang and district assembly remain later deliveries.


The values-wall footprint uses width 144, back 44 and front 3 after checking its angled base against the hero. Gallery contact shadows follow the lower silhouette rather than a detached rectangle; native PNGs retain no baked shadows.

## Batch 2A delivery record

### First batch

Rami approved campus v2 on Nov 1. This starts Stage 2 with **13 of the planned 72 families**, delivered in **31 colorways**. Stage 2 as a whole is still in progress. Existing tidy, paperwork and lunch desks remain reusable; they were not regenerated.

Open `review.html`, also linked from the Art Room. It works directly from disk or through a local server. Each card puts the actual native prop beside the 56x60 hero and the Bill at its 36px game display size. Controls: category, colorway, 1x/2x/4x pixel scale, carpet/wood/navy, footprint guide and once-only caption preview. Phone zoom stays inside each canvas scroller. Canvas labels and scene layers are review UI, not pixels baked into the PNG.

## Delivered families

| Family | Native frame | Colorways | Purpose |
| --- | --- | --- | --- |
| desk_sticky_notes | 96x104 | 3 | Monitor almost buried in notes |
| desk_family_photo | 96x104 | 3 | Family photo, school drawing, plant |
| desk_2009 | 96x104 | 3 | Old calendar, telephone and CRT |
| kpi_frame | 80x96 | 2 | Short KPIs header, full joke in caption |
| car_compact | 144x112 | 3 | Cream, teal and russet parked rebrand |
| wheel_boot | 48x40 | 3 | Dave's idea is going nowhere |
| gate_keycard | 24x96 | 2 | Modular jamb, outside doorway |
| gate_hidden_cabinet | 96x112 | 2 | FILES label and protruding lavender binder |
| hang_cat_high | 80x96 | 2 | Cat still hanging on |
| hang_branch | 80x96 | 2 | Cat has taken PTO |
| opportunity | 80x96 | 2 | Bricked-up door |
| perseverance | 80x96 | 2 | Paper-jammed printer |
| sign_plate | 80x48 | 2 | REBRAND? parking label |

For each family, `<id>-v1.png` is an equal-cell horizontal colorway sheet. Frames are **not animation poses**. Individual `<id>-variant-N-v1.png` exports match the sheet cells exactly. Sources remain in `*-source-v*.png`. Use native exports for integration, not sources. `manifest-2a.json` documents sizes, origin, proposed floor footprint, solid/decor status, district, frame count, caption, shadows and hash. The root campus manifest points to it.

## Generation and native preparation

Built-in imagegen generated one object per image using the approved Parking Lot and existing desk as style references. `batch-2a.json` records every full prompt. `car-refinement-prompt.txt` records the targeted flat-color cleanup; its v2 source is selected, v1 retained. Native preparation uses nearest-neighbor sampling, the shared 17-color production palette, opaque exact #FF00FF, a one-pixel navy silhouette and controlled palette substitutions for 2 or 3 colorways. No floor or background shadow is baked into the exports.

Optional authoring commands, not a required game build:

```sh
swift -module-cache-path /private/tmp/midlife-bio-swift-cache assets/stage/props/export-native.swift "$PWD/assets/stage/props"
python3 assets/stage/props/build-review-data.py
python3 assets/stage/props/validate-props.py
```

After editing the root plan, run its authoring/check scripts as documented in the parent README. The gallery embeds native art for file-safe use. Existing floor textures and native hero/enemy references are reused unchanged.

## Gate contract and ownership

**Every gate has a full 224px clear opening**, including the hidden Archive and wrapped seams. The closed blocker may be thin along the travel direction; its cross-route span is 224px. `gate-clearance.json` identifies all 16 physical openings. Jambs sit outside local [-112,112]; retracted leaves and collision footprints must leave that whole span clear. The gallery's schematic assembly demonstrates closed/open space using native jamb/cabinet components. It is not a finished four-frame door sheet or runtime collision implementation. Other facing assemblies and final door panels remain later work.

The Archive clue is a modest FILES plate and lavender binder, with no glow or large key icon. Runtime flow-field enemy navigation and locked-area spawn filtering belong to Claude. No runtime pathing, spawning, world rendering, combat, save or leaderboard files are touched by this batch. Floor footprints are proposed art metadata, not newly active collisions.

## Checks and remaining work

`checks-2a.json` validates all 31 native frames: dimensions, palette, opacity, flat magenta margins, one-pixel navy boundary, equal masks, unique colorways and individual/sheet parity. All 16 opening contracts pass 224px width/jamb checks. Browser QA covers desktop 1280x800 and phone 390x844; evidence is in `docs/qa/stage-pass-2a/`.

59 families still need completion, including preparing reusable existing assets, remaining slang, furniture, landmarks, posters and boundary kit. Floor families and district assembly remain pending. Coworker animation is Stage 3. The 120-visible-prop and 350-enemy runtime tests wait for actual world integration; no age-50 run with these props is claimed.

## Stage 2C and start-area slice (V. 1.31.0, Codex)

Eight new essentials (24 colorways) bring the planned kit to 33 families and 79 colorways. Reception counter, vending machine, sofa, lost-and-found, cooler, birthday banner, bins and coat rack are now placed in the playable Lobby/Bullpen. A separate 48x56 static coworker sheet has three colorways; it is not one of the 72 planned prop families. The corrected duck source has four ducks in line and a fifth clearly forward and turned toward the viewer. Source v1 remains archived.

See `batch-2c.json`, `manifest-2c.json`, `batch-placeholder.json` and `../start-area/README.md`. Review defaults to 2C and still compares every new prop to the real hero and Bill at 1x. Magenta removal, shadows and captions happen at runtime. The other 39 planned families and other districts wait for Rami's slice feedback.
