# Stage 2A: props and posters, first batch

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
