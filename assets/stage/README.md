# Corporate Campus Stage Pass: Stage 1

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
