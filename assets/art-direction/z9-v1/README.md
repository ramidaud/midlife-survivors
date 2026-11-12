# Z9 icon and pickup v1

- `devlog/img/14-z9/z9-icon-v1.png`: 64x64 transparent RGBA.
- `assets/pickups/z9-pickup-v1.png`: 64x32 transparent RGBA sheet, two32x32 cells. Frame0 rest, frame1 glint. Camera pixels match exactly; only9 sparkle pixels change.
- Each production PNG has its full built-in imagegen prompt beside it as `-prompt.txt`.

## Painted pipeline

Original built-in imagegen paintings are preserved in sources/. The image tool returned1254x1254 for the icon and1774x887 for the two-frame pickup study instead of the requested512 and512x256 sizes. Proportional nearest-neighbor fit normalizes the painted subject onto an exact512x512 icon working raster and256x256 rest working raster, with no smoothing. Each is reduced by exactly8 using the most frequent RGBA color in each8x8 block. No sprite is built from code geometry.

Material zones distinguish the camera body, lens, glass and accents. The body retains #303750, #171C35 and #10142A; slate lens rings, a teal glass edge, cream stripe and muted highlight pixels use only the requested palette. Dark silhouette pixels are mapped to navy. Frame1 copies frame0 and adds the explicitly permitted hand-fixed four-point cream glint. Original source frame1 is a pose/glint study only, so it cannot introduce camera drift.

manifest-z9-v1.json records sizes, source normalization, palette, material counts and validation. Hard alpha, exact dimensions and palette checks pass. No coffee orange is present. Human visual checks: tall integrated grip, central hump and ribbed short lens read at native size; no text/logo/strap/shadow on the exported background.

## Review

- z9-check-1x.png and z9-check-4x.png compare the icon, rest and glint against the existing fanny pack and energy drink from assets/items/field-items-v1.png. Current main had no existing assets/pickups sprites, so the actual in-game item atlas is used as reference.
- z9-background-check-4x.png shows the dark camera on navy and cream.
- z9-pickup-preview.gif is a review-only rest650ms / glint150ms loop. Claude decides the in-game timing.

Art and docs only. No Memo14 page markup, game code, version or deployment changes. Not wired in.
