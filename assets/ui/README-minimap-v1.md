# Minimap art v1

Art-only delivery, Nov 4, 2026 (Codex). Claude draws the actual floor plan from level data and wires discovery, rotation, fog and markers. No runtime changes or version bump.

| File | Grid | Integration |
| --- | --- | --- |
| minimap-frame-v1.png | 64x64 | Nine-slice, 16px corners on all sides. Center x16..47/y16..47 is exact opaque #171C35. Draw map inside the panel, above its fill. |
| minimap-buttons-v1.png | 2x1 of 24x24 | 0 expand, 1 close. |
| minimap-icons-v1.png | 8x1 of 12x12 | 0 you, 1 door_open, 2 door_locked, 3 chest, 4 lounge, 5 intern, 6 boss, 7 map_found. |
| ../stage/props/evac-map-v1.png | 2x1 of 48x64 | 0 plain, 1 dot glow. Base foot (24,63); silhouette 45px tall, shoulder height beside a 56x60 hero. Suggested cosmetic preview delay 650ms. |

All four production PNGs use the twelve requested colors, transparent backgrounds and hard alpha. The sign is supplied transparent for direct use, with no magenta keying required. No cast shadows. Only the sign's red-dot neighborhood changes between frames. Glow is a stepped coffee-orange/pink highlight, not blurred alpha. The MAP tab is the brief's explicit text exception; other art contains no words or numbers.

Use nearest-neighbor sampling. Player arrow points up; rotate around the cell center. Marker icons have one-pixel padding and are designed for 1x. The warning is a triangle, never a skull. The sign's floor plan is illustrative, not a route map.

[Review page](review-minimap-v1.html) shows native icons, enlarged icons, the 2x fake-map/hero check and sign animation. `minimap-mock-v1.png` and `minimap-check-v1.png` are QA images only. Do not load them in the game. `../stage/props/evac-map-v1.gif` is a preview only.

Built-in imagegen created the four studies, followed by native nearest-neighbor extraction, palette cleanup and pixel refinements. Full prompts are in [minimap-prompts-v1.json](minimap-prompts-v1.json). Machine-readable sizes and indices are in [minimap-manifest-v1.json](minimap-manifest-v1.json); checks in `checks-minimap-v1.json`.
