# The Gold Watch v1

[Size check](gold-watch-size-check-v1.png). The watch, V8 and 9-to-5er share the ground line at 1× on top and 2× below.

[Boss sheet](boss-gold-watch-v1.png) is 576×456 with four columns and three rows of 144×152 cells, indexed in row-major order. Key out exact #FF00FF and use nearest-neighbor sampling. Set the origin to (72, 148) in cell coordinates. The art floats above that point. Draw the shadow at the floor in game.

| Frames | Pose | Preview |
|---|---|---|
| 0–5 | Float, tick and chain swing | [GIF](gold-watch-float-preview-v1.gif) |
| 6–7 | Crown wind-up and glow | [Wind-up through hurt GIF](gold-watch-attack-preview-v1.gif) |
| 8–9 | Hands thrust and alarm rings | Same preview |
| 10 | Cracked glass and squint | Same preview |
| 11 | Stopped at five, eyes closed | [Hurt to stopped GIF](gold-watch-stopped-preview-v1.gif) |

| Extra | Dimensions | Integration |
|---|---|---|
| [Minute hand](gold-watch-minute-hand-v1.png) | 32×192 | Upward-pointing texture. Rotate from bottom center, normalized origin (0.5, 1). |
| [Hour hand](gold-watch-hour-hand-v1.png) | 48×128 | Same origin, shorter and thicker. |
| [Gear](gold-watch-gear-v1.png) | 96×24 | Four 24×24 cells, center origin. [Preview](gold-watch-gear-preview-v1.gif) |
| [Telegraph](telegraph-gold-watch-v1.png) | 256×128 | Centered floor decal, gap at 12 o'clock. Adjust warning opacity in game. |
| [Mugshot](../enemies/mugshots/gold-watch-mugshot-v1.png) | 384×96 | Four 96×96 cells at 200 ms. [Preview](../enemies/mugshots/gold-watch-mugshot-preview-v1.gif) |
| [Keepsake](../ui/kill-screen/gold-watch-keepsake-v1.png) | 64×64 | Watch stopped at five on a velvet box. |

The extras use native binary transparency. The GIF cadence is for review, except for the 200 ms mugshot loop specified in the brief. Use the fight plan for gameplay timing.

Built-in imagegen used the V8 for boss layout and pixel density, the retirement watch for gold materials, the V8 floor marker for the decal, and Bill's mugshot for the close-up pose format. The prompt set covered the 12 boss poses, two upright hands, four gear angles, a broken oval clock decal, four mugshot poses and a stopped watch on velvet. Native exports retain hard pixel edges.
