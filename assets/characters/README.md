# Playable character walking sheets, first pass

Three fictional playable characters, generated with built-in image generation from the approved office style. Full prompts: `generation-prompts.json`. Large generated references are retained as `*-walk-v1.png`; these are source illustrations rather than the final pixel grid.

The game-ready sheets are:

- `office-worker-walk-56x60.png`: The 9-to-5er, white short-sleeve shirt, red tie, glasses, khaki slacks and orange mug.
- `soccer-dad-walk-56x60.png`: The Soccer Dad, navy cap, teal polo, khaki shorts, whistle, soccer ball and mug. Internal id `photographer` stays for save compatibility.
- `grad-student-walk-56x60.png`: The Grad Student at 45, lavender hoodie, glasses, grey-streaked bun, notebook, backpack and coffee.

Each native PNG is 224x240 pixels: four columns by four rows of 56x60 frames. Rows are DOWN, UP, LEFT, RIGHT. Columns cycle four walking poses. Background is flat #FF00FF. Every native pixel is opaque; the runtime keys magenta to transparency. At most 17 foreground palette colors plus magenta, no anti-aliased alpha. All 48 frames are populated. QA found four distinct pixel frames in every direction.

The authoring import uses one common crop and scale across an entire sheet, preserving relative frame positions rather than resizing each pose independently. Native sheets are embedded in `character-data.js` for direct-from-disk previews; the main game does not load them yet. `src/character-animation.js` imports the sheets and maps direction/pose to a frame index. No build tool is needed.

In Extras > Art Test, Explore As switches the playable character. Movement chooses facing, steps advance with distance actually traveled, and stopping against furniture holds the standing pose. The gallery loops all three at 8 poses per second with a direction selector. Pause freezes the gallery too. Download links export the same native pixel grid on magenta.

Scope: first walking/turning pass in the separate preview. Idle uses a held passing pose; bespoke idle, attack, hurt and victory sequences have not been drawn. Generated costume/pose consistency should receive Rami's visual approval before production replacement.
