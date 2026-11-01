# Office art study 01

Open `art-test.html` from the project root. It uses the same pinned Phaser 3 CDN as the game and needs an internet connection for that library. No build step. The PNG is embedded in `sheet-data.js` so canvas import also works when opening the page directly from disk.

Controls: WASD/arrows or hold and drag in the office. Coffee fires automatically at one persistent Bill. Switch Current/New art, 1x/2x, pause or reset. No scores or saves are loaded.

The hero, Bill and desk were generated with built-in image generation using the approved key art, then simplified in a second image-generation pass. `office-sprite-sheet-v2.png` is the selected source. The first sheet is retained for comparison. Prompts are saved beside them.

The runtime imports each subject, removes magenta, samples with nearest-neighbor scaling and maps to the style-guide palette. Source crop windows accommodate imperfect generated cell boundaries; this is a prototype atlas, not a finished walking sheet. Final textures have binary alpha and hard edges. Hero: 48x52; Bill: 32x36; desk: 96x104. The hero frame matches the current game. Bill and desk shapes differ from the original art and are labeled in the preview.

Floor and walkway are native 32x32 repeating canvas textures using the guide palette. The floor contains no unique markings or light pools that expose repetition. Desk collisions use a shallow base and objects sort by foot position, so the player can walk behind furniture.

Only one pose per character is available. No directional or walking-animation claims. This is an isolated visual test, awaiting feedback before production integration.
