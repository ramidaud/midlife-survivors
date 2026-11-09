# Stage 2: Home (design, Nov 8, Rami)

The players picked it: the devlog poll went **Home 7, Hospital 1**.

## The place (Rami's words)
- A suburban, tree-lined, northeastern community in **peak fall**. Wide streets, varying styles of homes.
- **One home is yours, and you can enter it.** Going inside unlocks a new part of the stage.
- Maybe a **grocery store in a strip mall**.
- It should feel **bigger and more cohesive** than the office: designed as one place, beautiful, but not too far from the style of the best parts of the office stage.

## Unlock
- **Reach 55 in the office.** The Home stage then shows on the title screen's stage picker.

## Enemies and hazards
- **LEGO brick floor hazard** (Rami: "great").
- **Boss: Fifth-Grade Math Homework.** Your kid needs your help, and the math is not the math you learned.
- **Moving in from the office:** the 30-Year Mortgage and the Midlife Crisis V8 (they fit the driveway better than the office).

## The shop
- **The Lemonade Stand** replaces the Lounge: a kid's stand on the sidewalk where you buy boosts.

## Open questions
- How does going into your house work: a door that opens at an age, a key you find, or an errand?
- What's inside: kitchen, garage, the kid's room?
- Office replacements for the Mortgage and the V8: Rami picked The Reorg, The Holiday Party and Your New Boss (Age 26) (see GAME_DESIGN).
- The rest of the enemy list (HOA notices, leaf piles, the neighbor's leaf blower, school pickup line...).

## Build plan (each one sitting, each ends playable)
1. **Stage picker on the title screen** (Office, plus a locked Home card that unlocks at 55) and a bare-bones neighborhood you can walk around in, with placeholder art.
2. **Art direction:** a ChatGPT style board for the neighborhood (peak fall, neutral color, no sepia), then a prop and tile kit.
3. **Your house:** the door, and the inside area it unlocks.
4. **Enemies, the LEGO hazard, and the Lemonade Stand.**
5. **The Fifth-Grade Math Homework boss,** plus the Mortgage and the V8 moving in.

## Reference Rami shared (Nov 8): "keep this in the back of your head for the next level"
- `docs/plans/reference/twin-stones-forest.png`: a top-down pixel forest in peak fall (red, orange and evergreen trees, mushrooms, fireflies, mossy rocks and a fallen log). A spot called "THE TWIN STONES" with two stone markers (I and II) and a "0% · TWO STONES" progress bar. Small framed minimap in the corner.
- Not a decision yet. Fits the fall, tree-lined look he described for Home.

## Decisions (Nov 8, Rami)
- **Name: Maple Hollow.**
- **Layout v2** (`docs/plans/home-map.png`): three columns. Your street and your house on the left, **two neighborhood blocks in the middle** (Elm Court opens at 40, Birch Circle with a cul-de-sac at 50), the strip mall, school and woods on the right. Rami: "cute, funny, satirical details" in the neighbor homes (draft list of 12 on the map).
- **Getting inside your house: a key.** You're locked out. The spare key is hidden somewhere (under the fake rock, with a neighbor, in the minivan), and finding it opens the front door. Probably built on the errand system.
- Order (street, house, mall, school, woods) is fine.

## Style board v1 (Nov 9, ChatGPT): `assets/art-direction/home-style-board-v1.png`
- **Approved as the direction:** peak fall without a sepia cast, four distinct houses (slate colonial, your coffee-orange house with the hoop, bike and two-car garage, the brick split-level, the sage cape cod), a lemonade stand with a blank pink sign, and all 12 props underneath.
- **For the next art pass:**
  - The houses are drawn front-on while the street is top-down. That's fine for a walkable yard (like the office walls), but the real stage needs separate pieces: house fronts, yards, driveways and street tiles that line up on one grid.
  - Add the satirical neighbor details from the map (the boat that never moves, the deflated yard ghosts, the for-sale sign, the delivery box tower, and so on).
  - The toy bricks should stay generic (no brand look).
