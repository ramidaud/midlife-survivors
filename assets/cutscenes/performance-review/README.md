# Performance Review intro art

Three 9-to-5er poses and four Performance Review poses, each a transparent hard-alpha 1920×1080 PNG. `plate.png` is a byte-for-byte copy of the approved Bullpen day background. [Composite](plate-check.png), [contact sheet](contact-sheet.png) and [four-second playback](review.html).

Place every layer at (0,0), with nearest-neighbor sampling. The reference figures were fitted once to a three-screen-pixel logical grid. Hero feet sit near x672, boss feet near x1152, floor baseline y875. Hero visible height is 432px. Hero is mirrored to face right; boss faces left. No captions, shadows, effects or game code were added.

Use the five holds in [manifest.json](manifest.json): 1000 ms hero01/review01, 1000 ms hero02/review02, 500 ms hero02/review03, 500 ms hero02/review04, 1000 ms hero03/review01.

Each pose edits the previous one with reused pixels. Hero changes are confined to the head. Clipboard face and chart are pixel-identical across all four frames. Arms move outward/up, one foot lifts, then returns for a small knee bend. The approved portrait supplies the hero's restrained smile. [Edit record](prompts.json) and [checks](validation.json). Claude owns runtime integration.
