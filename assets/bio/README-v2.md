# Rami's studio portrait, second pass

Art only. Claude can switch the About page and share image after Rami reviews it. The existing v1 and all game/site code remain untouched. This job explicitly replaces the older file already named `rami-studio-pixel-v2.png`.

## Deliverables

- `rami-studio-pixel-v2.png`: 1536x1024, 3:2 studio scene, 384x256 logical pixels enlarged 4x.
- `rami-headshot-pixel-v1.png`: 1024x1024, square chest-up portrait, 128x128 logical pixels enlarged 8x.
- `rami-likeness-check-v2.png`: existing studio face at left, new headshot face at right, at comparable face size with original proportions preserved.
- `rami-hero-check-2x-v1.png`: headshot at 2x logical pixels beside the first 96x112 On Break hero cell at 2x.
- `rami-studio-review-v2.png`: compact studio preview.
- `review-rami-v2.html`: responsive art-only review, with the comparisons labeled outside the art.
- `rami-bio-v2-prompts.json`: final prompts and export method. Built-in image generation, followed by native pixel cleanup and integer enlargement.

## Likeness and style

The central man in `rami-studio-pixel-v1.png` is the likeness source, not the large portrait hanging on that image's wall. Kept the bald rounded head, thin round glasses, full beard, warm brown skin, black rolled-sleeve shirt and loose tan tie. The newer pose glances toward the viewer with a small amused smile.

Both exports use the twelve requested game colors plus eight skin/wood colors: `#5F3C3B`, `#874C3B`, `#A76548`, `#BF7B56`, `#D99467`, `#EBA777`, `#F3BF8B`, `#B1815E`. All pixels are opaque. The enlarged logical pixels are flat blocks, with no interpolated edges, dithering or gradient shading.

The studio contains the eclipse display, long camera lens, coffee, headphones, mic, books, trophy, plants, framed hero group, Bill and stopped watch. Small prop details are secondary to the face. The framed heroes are small decorative cameos, not character-sheet replacements. For a wide banner, keep the crop centered on the face and upper torso; crop rather than stretch.

The optional animated Rami sprite is deferred. These two About-page images are the scope of this pass; no playable character or animation has been added.
