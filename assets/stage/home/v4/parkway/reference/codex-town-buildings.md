# Codex brief: Maple Hollow town buildings (Nov 13)

Three areas of the full Maple Hollow map (`docs/plans/home-map-v3.png`) need buildings before they can open. They're signed woods in game right now. One batch, three sets.

## Rules (CLAUDE.md, "Pixel rules" and "World rules")
- Painted, then reduced: paint at 2x or 3x the final size and reduce by that number, keeping at least three tones per material. Never built from code shapes.
- Match the v4 yard kit and the v4 house fronts (`assets/stage/home/v4/`): same style, palette, outline and light direction. Peak fall. Neutral white balance, no sepia, golden haze or film-look tint.
- Each piece is its own transparent PNG with a feet line and a solid footprint in a manifest, like `assets/stage/home/v4/yard/manifest-batch-c.json`.
- Walls (taller than the hero): full dark outline, heavy shadow. Breakables (hero height or smaller): cream highlight on top. Walk-through decals: no outline, no shadow.
- No brand names or logos. Signs are blank plates; the game adds the text.
- Compare each piece with the 56x60 hero at real size before handing it over.

## 1. Strip Mall (opens at 50; the Mortgage boss comes out of the bank at 52)
Area: 2496 x 2752 px.
- **Storefront row** (walls, front-on like the house fronts, about 416 x 384 each): grocery store, **bank** (columns, a night-deposit slot, a blank sign), pizza place, pharmacy, dry cleaner. They sit side by side along the top of the area.
- **Covered walkway** in front of the stores (walk-through), 2496 x 96.
- **Parking lot surface** (walk-through), a 512 x 512 tile in the street asphalt with painted stall lines, plus a drive-aisle tile with arrows.
- **Cars parked top-down** in the style of the cars in `street-wide-v4-a.png` (walls), four colors, about 80 x 144.
- **Cart corral with carts** (wall), **a runaway cart** (breakable), **parking lot light pole** (wall), **curb island with a tree** (wall), **trash can** (breakable).

## 2. Community Center (opens at 55; the Holiday Party boss fights you in the hall at 56)
Area: 2496 x 2752 px.
- **The hall** (wall, front-on), about 1100 x 560: a one-story brick community center with double doors, a bulletin board, and a blank sign plate.
- **Block party street pieces**: folding tables with a plastic tablecloth and a casserole (walls), a bounce house (wall), sawhorse barricades (walls), string lights on posts (over, like the yard string lights), a cooler (breakable).

## 3. Town Square (opens at 53, the center of the map: "where the game will really come together")
Area: 2496 x 2752 px.
- **Arcade** front (wall), about 832 x 448, with neon-ish signs (blank) and a game cabinet visible in the window.
- **Two shop fronts** (walls), about 416 x 384: a coffee shop and a hardware store.
- **Fountain plaza**: a round fountain (wall), about 384 x 320, and a brick plaza tile (walk-through), 512 x 512.
- **Skate park**: a quarter pipe (wall), a grind rail (wall), a concrete pad tile (walk-through).
- **Food trucks** (walls, top-down or front-on to match), two, about 160 x 288.
- **Park benches** and **planters** (walls, small).

## Order
Strip Mall first (its boss comes earliest after the square opens), then Town Square, then the Community Center.

## 4. The Parkway extras (added Nov 13)
- **Golf course edge** (walk-through ground): a fairway tile with mower stripes, 512 x 512, and a putting green with a flag (the flag is a wall, about 32 x 160).
- **Sand trap** (walk-through), about 256 x 160, and a **golf cart** (wall), about 144 x 96.
- **A barricade for a north-south road** (wall), about 320 x 96: sawhorses across the road, seen from the front. The current barricades only fit east-west streets.

## Notes from placing PR #8 (Nov 13)
- **Brick plaza:** the herringbone bricks read about the size of the hero, so a big plaza looks loud, and faint seams show where tiles meet. A finer, seamless brick (bricks about a third the size) would let Town Square use more plaza.
