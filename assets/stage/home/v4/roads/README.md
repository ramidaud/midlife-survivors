# Maple Hollow roads: complete review set

Job 1 from `docs/handoffs/codex-roads-and-woods.md`, completed for art approval on Nov 14. Draft PR #13. Open `deliver/review.html` and `deliver/manifest-roads.json`.

Seventeen assets: two 512x832 north-south streets, two compatible 832x512 east-west variants, a 512x512 four-way crossing, four 512x512 T junctions named for their incoming stem, six 80x144 cars (sage, russet and slate, each north/south), a 48x48 manhole and a 64x24 storm drain. Every asset is an RGBA PNG. Rectangular ground plates are opaque; cars and decals have transparent surroundings. No solid objects are painted into the new ground plates.

The existing east-west plates have a narrower painted asphalt region than the stated 320px contract. The new car-free variants give the review set compatible geometry without changing the live plates. Existing assets remain untouched.

## Painted art and exact connections

Sources are built-in imagegen paintings, retained once in `sources/`. They are normalized to working rasters and reduced by whole numbers. `register.py` registers painted strips to the exact band coordinates and reuses upright 16px connection collars. It resamples painted pixels; it does not draw world art from code shapes or rotate plates. Center lines are registered at pixel 256. Asphalt keeps the requested #526078 base with two slate shades (#46536B and #65748B) selected from the source painting's light and dark tones. Grass stays #9BAE73.

All 24 open connections have an exact asphalt interval [96,416), 320px wide, through the entire 16px collar. Closed T sides stay closed. The independent audit measures exported pixel runs, compares corresponding road/parkway/inner-sidewalk collars, checks center-line alignment and verifies three asphalt tones on every ground piece. Regressions distinguish isolated curb pixels from asphalt and detect shifted 319/321px spans. `deliver/checks/connections-native.png` assembles final pieces at 1x.

Cars are walls with proposed body footprints. Roads and decals are walk-through. Feet lines, foot points, footprints, working sizes and native hero comparisons are in the manifest. Source dimensions vary and are recorded. Initial and selected prompts are in `prompts.json`, `final-prompts.json` and `ew-prompts.json`.

## Review and rebuild

Nothing is placed in the game. This is a complete placement kit pending Rami's art approval. The source/working/review package adds no real street, house or neighbor photos. Native PNG inspection and export/link checks pass. Browser local-file navigation was blocked by URL policy, so device browser layout is unverified. No game session, stats or leaderboard operation was used.

With Python, Pillow and NumPy: `python build.py`, then `python audit.py`. Scripts only write this package. Woods is in the sibling `woods/` package in the same PR. Runtime version/build remains unchanged while this art-only review awaits approval.
