# Level Art Audit (Nov 10, 2026, build V. 2.28.1)

Visual version: https://claude.ai/artifact/GL5erzovbhzYHoJCMkCLQi (images also in `docs/design/audit-shots-level/`)

**Question (Rami):** why don't the levels look as good as the art ChatGPT hands us? Are we saving file size?

**Answer:** file size isn't the cause. Art loses quality at three points: how the screen draws it, how big drawings become small sprites, and how rooms get filled.

**Method:** ran the real game in a test browser at 1280x720, 1920x1080, MacBook 1440x900 @2x and phone 390x844 @3x; visited all eight office rooms and Maple Hollow at age 40 with enemies cleared; compared frames with files in `assets/`.

## Leak 1: display
- **1A HIGH. Retina and phone blur.** The canvas was enlarged by the browser with smoothing. **Fixed V. 2.29.0.**
- **1B HIGH. Fractional camera zoom** (1.5 at 1080p, 1.25 on a MacBook, 0.95 on phones) made uneven pixels. **Fixed V. 2.29.0:** whole numbers only, with a Close/Wide Camera setting where the two differ.
- **1C MEDIUM. `pixelArt` was off in the main game.** 118 of 318 textures were smoothed (pickups, projectiles, every tiled floor, wall, lawn and street). **Fixed V. 2.29.0.**
- **1D MEDIUM. Off-size sprites.** Enemies drawn 48 px, shown 44.8 to 58.8 (Bill 50.4). Late Fee 32 shown 35. Maple yard props, key spots and toy bricks at 1.5x. Gems, coins and splash: 32 px art squeezed to 18 to 20 px with smoothing. Open (sitting 2).

## Leak 2: translation
- **2A HIGH. Shrink plus palette snap.** ChatGPT sources are about 1,254 px with 80k to 180k colors; native sheets have 14 to 17. The 9-to-5er's khaki slacks are coffee orange in the v3 walk sheet; belt, pocket pens and grey temples are gone. Bill's mouth is noise. Desks survive well. Fix: map colors by material, then hand clean-up of the four heroes and Bill. Open (sitting 3).

## Leak 3: composition
- **3A HIGH. Density.** Objects in view from the middle of each office room at 720p, walls and signs included: Lobby 2, Parking 2, Executive 8, Server 9, Break Room 19, Conference 20, Bullpen 22, Wellness 22. Office key art: about 40 in one frame. Open (sitting 6).
- **3B HIGH. Big house stretched, not redrawn.** Rooms 2x wide and 1.5x tall with furniture at drawn size. Kitchen and garage are the emptiest. Roadmap step 2c is the fix. Open (sitting 4).
- **3C MEDIUM. Maple Hollow has no trees and no green.** The kit has no tree asset; the palette has no grass green; yard props are placed by dice roll. Open (sitting 5).
- **3D MEDIUM. Darkness layer** at 40% (age 40) to 63% (age 65) mutes art outside light pools. Open (sitting 6).
- **3E BUG. Green grid past the Maple Hollow map edge.** **Fixed V. 2.29.0.**

## Real limits (for the record)
- Graphics memory: Nov 4 white screen, floors merged into shared tiles (293 MB to 192 MB). Floors only.
- Speed: darkness at half resolution.
- Neither forces the findings above.

## Fix order (one sitting each)
- [x] 1. Crisp pass: 1A, 1B, 1C, 3E (V. 2.29.0, Nov 11)
- [ ] 2. True sizes: 1D
- [ ] 3. Heroes and Bill: 2A
- [ ] 4. Fill the house: 3B (roadmap step 2c)
- [ ] 5. Maple Hollow trees: 3C (new ChatGPT brief, palette greens)
- [ ] 6. Office density and light: 3A, 3D (Lobby and Parking first)

## Known limit of the crisp pass
Windows laptops set to 125% or 150% display scaling can still show slightly uneven pixels, because the browser enlarges the game by a fraction. The full fix is drawing the game at the screen's true pixel count, which costs phone memory. Parked until someone reports it.

## Not checked
- Real devices (MacBook, iPhone, iPad). Rami to confirm.
- Later ages, bosses in motion, weapons, title scenes, upstairs rooms.
- Counts are one view per room, a guide only.
