# Z9 v2: native reduction cleanup

The approved paintings and all v1 files are unchanged. No new image generation was used for v2. Production files:

- `devlog/img/14-z9/z9-icon-v2.png`:64x64, transparent hard-alpha RGBA.
- `assets/pickups/z9-pickup-v2.png`:64x32 sheet containing two32x32 cells, rest then glint.
- Each has a matching full `-v2-prompt.txt`, retaining the original image-generation prompt and the v2 cleanup instructions.

## What changed

The same512px icon and256px pickup working paintings are reduced by exact8x8 RGBA block mode and mapped by material. Native cleanup removes isolated body/grip flecks and tiny material islands, retaining three connected body tones. This is a reduction/cleanup pass on approved painted art, not a geometric redraw or new painting.

The top and left silhouette get a one-pixel rim in #526078 with a short #B8C0D4 crest. The actual grip stripe in each painting is restored as a continuous two-pixel-thick #F2D7A1 band. The icon retains #10142A/#171C35/#303750 body panels. The pickup uses the next lighter body ramp #171C35/#303750/#526078 and suppresses the tiny shoulder/control highlights to prioritize the body, hump, lens and stripe.

Glint copies the rest camera exactly and changes only9 cream sparkle pixels. Review GIF timing is650ms rest /150ms glint, not a runtime change.

## Review and validation

`z9-before-after-10142A-1x.png` and `-4x.png` compare v1/v2 against the actual card background. Equivalent `171C35` boards check the second navy. Four-times previews use nearest-neighbor enlargement. Inspect the material panels, rim, lens rings, stripe and pickup silhouette by eye.

`manifest-z9-v2.json` records material counts, rim/stripe information, native sizes, palette and binary-alpha checks. Both body ramps have three populated tones. V1 assets and approved working/source paintings are hash-checked unchanged. No orange, logos, text, code, Memo14 markup, version or balance changes.

The v1 source-size limitation remains documented there: imagegen returned larger rasters, which were proportionally normalized onto the512/256 working canvases. V2 uses those exact approved working canvases without further resampling.
