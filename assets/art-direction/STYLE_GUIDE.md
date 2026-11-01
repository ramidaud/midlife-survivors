# Midlife Survivors: art direction v1

Key art direction approved by Rami, prepared with Codex and built-in image generation. The separate Campus preview tests assets before production replacement.

Warm, funny office survival. Top-down three-quarter view with readable silhouettes, chunky shapes, tired determination, and affectionate everyday absurdity.

## Palette targets

| Role | Hex |
| --- | --- |
| Outline / deepest shadow | #171C35 |
| Shadow slate | #303750 |
| Muted blue | #526078 |
| Office teal | #3E7775 |
| Sage | #83A89A |
| Warm brown | #A88B70 |
| Khaki | #D3B78D |
| Fluorescent cream | #F2D7A1 |
| Warm white | #FFF0CF |
| Dark russet | #874C3B |
| Tie red | #C45C4B |
| Coffee orange | #EF9347 |
| Warm skin | #E5A995 |
| Donut pink | #F1B5BF |
| Sticky-note lavender | #BFA8CF |

These are production targets, not a claim that the generated concept contains only these exact colors.

## Drawing rules

- Outline: 1 logical pixel in #171C35 around silhouettes. Use broken interior lines and two or three shade clusters per material. Avoid pure black.
- Lighting: warm fluorescent light from upper left. Highlights face upper left; stepped navy shadows fall lower right.
- Pixel scale: use 48x52 logical pixels for the first hero study, matching the current game frame, and 32x32 floor tiles. Draw at native resolution, then enlarge only by whole-number nearest-neighbor scaling. A 1024x1024 delivery canvas is packaging, not the sprite's logical resolution.
- Camera: top-down three-quarter view, showing tops and fronts, consistent across characters and props.
- Readability: coffee orange is the hero's focal accent. Keep small props quieter than enemies and the player.
- Current approved hero study: 56x60 after Rami requested a small size increase. Desk family: 96x104 game frames with one bottom anchor and floor footprint. Large silhouette details carry each desk's story; material palette and camera stay consistent.
- Character animation study: shared 56x60 frame, four directions (down, up, left, right) with four walk poses each. Keep one scale for the whole sheet. Step timing follows actual movement, so blocked feet stop. The Grad Student adds #B97A58 and #70402F as warm skin shades within the character palette.
- Office environment patterns repeat in 64x64 units on the 32px placement grid, with matching opposite edges. Keep floor texture low contrast. Use hard rectangular light accents and short stepped southeast scene shadows; exported prop backgrounds stay flat magenta. Illustrated props use the same cream, teal and navy family as the desks.

## Asset delivery rules

- Solid #FF00FF background, no shadow on the background. No blur, anti-aliasing, gradients, text or watermarks unless specifically requested.
- Sprite sheets use an even grid and equal padding. Floor tiles tile seamlessly.
- The key art is a mood and composition reference. Its softer foreground and fine texture are not production sprite rules. Future assets must use consistent hard pixel edges throughout.

Reference: office-key-art-v1.png. Generation prompt: office-key-art-v1-prompt.txt.
