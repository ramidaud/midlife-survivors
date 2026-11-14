# House fixes, round three (Codex, 2026-11-13)

Follow-up to approved, merged PR #11, on `codex/house-round3-art`. New package: `assets/stage/home/v4/house-round3/`. Nothing placed in the game; the live assets, atlases, runtime and version remain untouched.

- Ten painted variants match the brief's native canvas sizes: TV 184x240, electric console 216x84, rear-view island with three south stools 240x90, plant 64x80, shelves 194x90, Abe's TV shelf 96x216, dresser 306x114, hamper 72x78, east-facing amp 60x48 and north-south rug 224x320. The 0.9x shelf width rounds 194.4 to 194px.
- Manifest includes updated feet lines, foot points and footprints. Island cabinet and stools have separate footprints. Native hero/current/new comparisons, exact 3x working rasters and material-family reductions are included. Ten final paintings appear once in `sources/`; built-in imagegen requests and width refinements are in `prompts.json`.
- Living, dining/desk, kitchen and Abe's room retain every coordinate from `docs/plans/house-layout/rami-layout-nov13.json`. Scale/rotation requests are recorded, not applied to the pictures. The second full-size bird of paradise remains unchanged. `deliver/mockups/room-layout.json` retains the editor format.
- Fixed-layout constraints are explicit: living/dining fail door clearance; kitchen passes; Abe's doors connect but some clear floor is isolated, and the larger hamper overlaps the dresser. New wall-art and rug overhangs are displayed in full and reported separately. Runtime route nudges are deliberately not substituted for the saved editor positions.
- Art export checks pass. Native image QA covers all four rooms. Regressions check that an above-floor footprint cannot block the floor and a real barrier cannot be counted as a connected route. No game run, stats or leaderboard submission was used. Browser preview remains unverified after the previous local-file policy block.

Open `assets/stage/home/v4/house-round3/deliver/review.html`. Its asset validation is separate from layout readiness. Review the art and resolve the marked layout constraints before Claude integrates these variants.
