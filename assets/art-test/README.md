# Office art study 01

V. 1.24.1 adds the first office environment detail pass. Visit Accounts jumps to the reference section. Generated printer/cabinet/plant props, seamless 64x64 carpet/wood, floor marks, trim and quiet fluorescent light accents are in `assets/office-environment/` and `src/office-environment.js`. The original layout, 192px crossroads and discovery positions are retained. Other life-stage environments remain unillustrated.

V. 1.23.4 adds all three playable-character walking sheets. Explore As switches characters; the animation gallery compares four directions and pauses with the scene. Native 224x240 sheets (4x4 frames of 56x60) and source prompts are in `assets/characters/`. Walking advances with actual movement; held idle poses and static old-art comparison remain. The preview alone loads `src/character-animation.js` and the embedded sheets.

V. 1.23.1 defaults to the Corporate Campus exploration blockout. Use Layout to return to the original art comparison. Campus is one bounded 1280x896 sample block with four departments, a 192px central crossing, an outer loop, a revealing map and three optional joke discoveries. No combat, rewards, saves or unlocks in this mode. Reset clears the visit/find counters. Layout data lives in `src/data/office-layout.js`, loaded only by the isolated preview, not the main-game loader. Existing plant/cooler sprites and a simple code-drawn printer stand in for final landmark art.

Open `art-test.html` from the project root. It uses the same pinned Phaser 3 CDN as the game and needs an internet connection for that library. No build step. The PNG is embedded in `sheet-data.js` so canvas import also works when opening the page directly from disk.

Controls: WASD/arrows or hold and drag in the office. Coffee fires automatically at one persistent Bill. Switch Current/New art, 1x/2x, pause or reset. No scores or saves are loaded.

The hero, Bill and desk were generated with built-in image generation using the approved key art, then simplified in a second image-generation pass. `office-sprite-sheet-v2.png` is the selected source. The first sheet is retained for comparison. Prompts are saved beside them.

The runtime imports each subject, removes magenta, samples with nearest-neighbor scaling and maps to the style-guide palette. Source crop windows accommodate imperfect generated cell boundaries; this is a prototype atlas, not a finished walking sheet. Final textures have binary alpha and hard edges. Hero: 48x52; Bill: 32x36; desk: 96x104. The hero frame matches the current game. Bill and desk shapes differ from the original art and are labeled in the preview.

Floor and walkway are native 32x32 repeating canvas textures using the guide palette. The floor contains no unique markings or light pools that expose repetition. Desk collisions use a shallow base and objects sort by foot position, so the player can walk behind furniture.

Revision V. 1.20.1: Rami approved the direction but wanted a slightly larger hero and believable desk overlap. The new hero now uses a 56x60 frame (about 15% larger). Desk footprints extend to their back edge on the floor, preventing entry into the furniture and full accidental occlusion. Axis-by-axis collision allows sliding around corners. Bills also respect desk footprints. The comparison retains the original hero size.

Only one pose per character is available. No directional or walking-animation claims. This is an isolated visual test, awaiting feedback before production integration.
