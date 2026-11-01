# Corporate Campus Stage Pass: v2 overview

Status: **v2 ready for Rami's review before Stage 2**. Parking Lot close-up v1 is approved as the density, joke and scale target and remains unchanged. The old nine-square overview is superseded. The playable game is unchanged.

Open `devlog/art/stage-pass-v2.html` through the Art Room. Switch to the measured plan and try ages 40, 45, 50, 55 and 60 plus the achievement toggle. Illustration is a mood reference with compressed corridors; exact proposed geometry lives in the measured SVG and JSON.

## Current proposal
- `campus-overview-v2.png`: 1672x941 concept, using the approved Parking Lot and exact layout guide as references. Full prompt retained.
- `campus-layout-v2.json`: unequal district polygons, 13 non-solid dressed combat reserves, clearance loops, connector bays and gate bodies. Lobby and Bullpen begin open. Archive is a tiny hidden L-shaped closet.
- `campus-promotions.json`: tunable age schedule, proposed four-frame door opening, lower-third messages and reachable-floor-only spawning. The Archive provisionally uses the existing `firstCoffee` achievement. None is loaded by the game.
- `campus-kit-plan.json`: 72 planned prop families, two or three variants each, nine seamless 64x64 floor families, six modular boundaries and 15 caption records. Per-instance positions, variants and collision footprints come after native-size review in Stage 2. Production never uses the painted overview as a map.
- `campus-plan-v2.svg` and `campus-plan-v2-data.js`: exact static plan and file-safe browser data. The review demonstrates real 56x60 hero and 36px displayed Bill references. New prop comparisons remain a Stage 2 requirement at desktop and 390px phone width.
- `campus-manifest.json`: current asset dimensions, status and hashes. Parking Lot remains byte-identical to the approved image.

## Reproduce checks
Run `python3 assets/stage/build-campus-v2.py`, then `python3 assets/stage/validate-campus-v2.py`. These are optional authoring/check tools, not a game build requirement. The validator rasterizes physical floor and closed gates at 16px and tests 18 age/achievement cases including toroidal seams. It also checks non-overlapping districts, dressed reserves, kit count/variants and caption contracts. See `campus-v2-checks.json` and `docs/qa/stage-pass-v2/`.

Starting reachable floor is 7,749,632 pixels, about 7.57 desktop camera areas **before furniture placement**. Three differently shaped starting combat reserves remain clear of solids. Main routes are 224px and the tiny Archive branch is 160px. Matching wrap gates at both endpoints prevent locked-wing shortcuts.

Runtime targets remain at most about 120 visible props, off-screen culling and smooth play with 350 enemies. No runtime performance, age-50 pathfinding or new prop readability result is claimed yet. Door opening animation, spawn filtering and proximity captions are specified, not implemented. Wait for v2 approval before Stage 2 props/posters, then coworkers, then runtime integration.

## Archived v1 documentation

# Original Stage 1

Status: **awaiting Rami’s approval**. This is the illustrated overworld proposal and Parking Lot camera study requested in the Stage Pass handoff. Nothing in the production world renderer, collision layout, combat, saves or leaderboard has changed.

Open `devlog/art/stage-pass.html` or use the new Stage Pass section at the top of the Art Room. Both illustrations are visible there. The full review adds a measured-plan switch, district inspection, route/plaza measurements, planning-grid overlay, downloadable geometry and an actual 56x60 native hero reference.

## Deliverables
- `campus-overview-v1.png`: illustrated overview with all nine districts and recognizable landmarks, 1671x941.
- `parking-lot-closeup-v1.png`: 1280x800 camera-study illustration. The generated source is retained separately. Export uses nearest-neighbor sampling.
- Corresponding `-v1-prompt.txt` files include the original built-in-imagegen prompt and focused scale correction. Office key art was the style reference. Original generated outputs remain in the generation archive.
- `campus-layout-concept.json`: authored 7680x4320 world geometry, nine district centers, nine reserved 512x512 plazas, 224px primary routes, 160px loop branches, landmark footprint markers and the Parking Lot camera box.
- `campus-plan.svg`: measured plan; its blocks are labeled landmark placeholders, not finished sprite art.
- `campus-manifest.json`: the two review assets, actual pixel sizes, district, non-solid concept status and hashes. Future stages extend this manifest with native production props and animations.

The six-by-four planning grid uses 1280x1080 panels to preserve the brief’s requested 7680x4320 extent. A real 1280x800 game camera covers about 6x5.4 views, not exactly four vertical screens. The plan shows that camera separately. The world area is about 5.27 times the current 3072x2048 repeating section.

## Layout direction
North: Archive / Server Room / Executive Wing. Middle: Parking Lot / Lobby start / Bullpen. South: Wellness / Break Room / Conference Rooms. Every district opens onto the primary cross routes and has a 160px branch loop. Matching openings reach opposite world edges for eventual wrapping. The Parking Lot roundabout and all landmark footprint markers sit outside the reserved fighting space and routes.

The illustrations show mood and landmark ideas. They do not guarantee pixel-exact clearances or final object scale, and they are not screenshots of a running game. The measured geometry is the proposal’s scale reference. In Stage 2, finished props will be sized against the native hero and assigned approved footprints.

Concept illustrations have full floor backgrounds and illustrative contact/light cues. They are not production magenta sprites or seamless floor textures. Future runtime assets retain the existing palette, hard pixels, exact #FF00FF key, code shadows, floor-footprint collisions and foot-point depth rules.

## Checks and approval boundary
Run `python3 assets/stage/validate-concept.py` to validate dimensions, all nine reserved plazas, marker separation from routes/plazas, and connected wrapping routes on a 16px grid. It refreshes the manifest and `layout-checks.json`. This checks proposal geometry, not runtime crowd pathfinding.

Stage 1 ends here. Review the district arrangement, plaza sizes, visual variety and Parking Lot joke. Stage 2 props/posters, Stage 3 coworkers and Stage 4 world replacement require Rami’s approval. The user’s handoff explicitly says to stop after Stage 1. No age-50 game test is claimed; those tests apply to later implementation stages.
