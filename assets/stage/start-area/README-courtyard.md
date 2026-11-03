# Courtyard Loop review

[Open the isolated review](review-courtyard.html?nostats=1). **Lobby arrival**, **Commons**, and **South apron** use the same camera positions in both versions. **Seated coworkers** centers the Accounting bay. **Overview** shows the whole start area. Add `&phase=before` for the archived V. 1.47.0 layout and room renderer, and `&desktop=1` or `&phone=1` for the measured viewports. The review uses in-memory saves and disables stats.

The Option B loop and cross-aisle keep the measured 224 px spans. The 704×656 commons and 400×416 south apron are open. The 224 px aisle on the north side of the glass office rejoins the loop on either side. The two age-45 gate records, later rooms, outer walls and player spawn use their original coordinates.

Accounting, HR, IT and Marketing share low partitions, with 18 pod desks, one manager desk and reception. Each worktop bakes its own accents into the desk image. The fifteen occupied chairs have solid floor footprints. The seated redraws reuse the cast's animated faces and hands and add legs at a 50 px head-to-shoe scale. The renderer draws chair, coworker and apron in that order within each desk cluster. Coworkers keep their idle and approach reaction timers. Five ambient people make up the four standing scenes. The phone caller and mug walker move within their authored paths.

The Option A look uses muted worn bands, team-colored woven rugs, stepped window marks and a trail of loose printer pages. Static floor dressing uses the existing 1024 px texture bake. Each furniture assembly uses one static texture so the foreground can still sort around the player. The later lighting pass can read `START_AREA_LAYOUT.lights`. Each record is a local world coordinate with radius, numeric RGB, and a `lamp`, `window`, `vending`, `server` or `screen` kind.

The room data is generated from [Option B's measured plan](../layout-plan/plan-geometry.json) by `room_data_layout.py`. Run `python3 assets/stage/start-area/build-layout.py` and `python3 assets/stage/start-area/validate-courtyard.py` to rebuild and check the footprint clearances. Review captures and reports are in [qa-courtyard](qa-courtyard/).
