# Codex brief: Rami's house, inside (Nov 13)

Rami: "The home should be just as detailed as the work we've been creating. It should feel alive, a real home, my home, lots of attention to detail on the walls and correct placement and perspective of the items in the home."

The big house has two floors (`src/data/house-v2.js`). The rooms are the right shape but too empty: the furniture was drawn for rooms half as wide, and almost nothing hangs on the walls. This job repaints the inside of the house at the Maple Hollow v4 standard (the yard kit, the school, the town buildings), room by room, from Rami's photos.

**Reference photos: Rami attaches them to this task directly.** They are not in the repo on purpose (the repo is public and they show his family). Never copy a photo, a person, or any real name, username or license number into the art.

## Rules
- Painted, then reduced by a whole number, at least three tones per material. Never built from code shapes. Match the v4 kit's outline, palette and light.
- **Neutral white balance.** The photos have warm lamps and red and blue LED light; paint every object in plain daylight colors. Glowing things (the LIVE MUSIC neon, the PlayStation-symbol neon, the slatted LED lamp, the traffic light, the electric fireplace, screens) get their own glow in the piece itself, never a color cast over the room.
- **Perspective (this is the part Rami cares about most).** The camera looks down at about three-quarters and faces north, like the yards.
  - **North walls** (the top edge of each room) face the camera: everything hung on them (posters, the painting, the moon print, photo ledges, the mirror, neon signs, shelves, the guitar) is drawn **face-on**, standing on that wall's line, at real height above the floor.
  - **East and west walls** are seen edge-on: furniture against them is drawn from above and slightly from the side (a dresser shows its top and the edge of its drawers, not its front). Things hung on them are thin strips, so put wall art on north walls whenever the photo allows.
  - **South walls** are cut away so we can see in; nothing tall stands against them.
  - Furniture stands on its feet: every piece has a feet line and a footprint (the part you bump into), like `manifest-batch-c.json`. Tall pieces (bookshelves, wardrobes, the fridge) are walls you walk behind; rugs, runners, toys on the floor and cables are walk-through.
- **Size against the 56 x 60 hero:** a three-seat sofa about 192 px wide, a king bed about 176 x 224, a dining chair about 40 px tall, a door about 64 px wide. Compare each piece with the hero at 1x before handing over.
- **Density:** every room should feel lived in. Aim for at least one thing per 128 x 128 of floor along the walls, plus wall decor on every north wall, while keeping a 96 px path through each room and 224 px through the main ones (living room, hall, Abe's room).

## Ground floor (room rects from house-v2.js, in px: x, y, width, height)

### Living room (16, 16, 768 x 345)
From the living-room photos (the real one, IMG_5042, and the styled one):
- **North wall, left to right:** two floating **photo ledges with framed family photos** and warm string lights underneath (faces in the frames are tiny generic silhouettes, never likenesses); the **tile fireplace** with an ornate **silver mirror** above it; a window with **vertical blinds** and olive curtains; the big **wall TV** (galaxy wallpaper on screen) over the **fluted wood media console** with a game console, a soundbar, two VR controllers on charging stands and a purple LED strip.
- **Floor:** a light grey or cream **three-seat sofa** with rust and olive pillows and a knit throw; a **brown leather power recliner** with a green knit throw; a **round fluted wood coffee table** with candles, a remote and a small tray; a large **red and navy Persian-style rug** (walk-through); **pothos and bird-of-paradise plants** in pots; a **drum-shade floor lamp** and an **arched floor lamp**.
- **The racing sim rig:** black cockpit frame with a red-accented seat, steering wheel, pedals and a shifter, with cables trailing to the console (cables walk-through).
- **The twins' corner:** two **baby swings/bouncers** with a pink and a grey elephant plush, next to the fireplace.
- Little life: a snack bag on the floor, a remote on the table, a basket of blankets by the recliner.

### Dining area and desk nook (dining 184, 361, 404 x 322; desk nook 200, 361, 584 x 322)
From the styled dining/desk photo and the hallway photo (IMG_5045):
- **Round wood dining table** with four **cream nailhead chairs**, a woven placemat, a dark vase of red berries and a small domed table lamp in the middle.
- **Rami's corner desk** against the north and east walls: **two floating wood shelves** with vintage cameras, books, a pothos, a framed photo and a glowing globe lamp; **two monitors** (one with an editing timeline, one with a galaxy), a laptop on a stand, speakers, a pen cup and headphones on a stand; a **black mesh office chair**.
- **North wall:** a framed **moon print**; kids' **drawings taped up** near the desk (from the hallway photo).
- **East side:** the **dark console with an electric fireplace** (flames glowing), a lamp, a lantern, a plant and a dark marble sphere on top; above it the big **colorful abstract painting**.
- A patterned rug under the table, an orchid, a ceiling fan (over everything), the vertical-blind window.

### Kitchen (368, 699, 416 x 332)
From the hallway photo: **white cabinets with oak trim** (upper and lower), a **stainless double sink** with a tall faucet, dish soap and a drying rack, a white stove and microwave, the magnet-covered fridge, a cleaning spray bottle, a small appliance or two, and a second **abstract painting leaning** against the wall.

### Entry and hall (entry 16, 1135, 184 x 172; circulation 200, 683, 136 x 624; entry closet 16, 987, 168 x 120)
- The **louvered closet door**; a dark **storage bench with a Wilson basketball** on top and two pairs of shoes under it; a coat hook with a puffy jacket; a light switch and a ceiling vent on the walls.

## Upstairs

### Main bedroom (16, 16, 768 x 403), from IMG_5053
- The **king bed with a tall upholstered nailhead headboard** (curved wood top), white sheets, **rust-orange pillows and duvet**, a grey throw (the bed is made up a little messy; no people).
- **Two dark wood nightstands** with **turned lamps**; on the left one a small sleep machine and a baby bottle; on the right one a **red night light**, a diaper caddy and a water bottle.
- The **wooden crib** beside the bed; the **vertical-blind window** on the north wall; carpet, a water jug and a few socks on the floor.

### The twins' corner (put it in the main bedroom by the window, or the linen room if it fits better), from IMG_5043
- The **double bassinet** (two bassinets in one dark grey frame) by the window, a sound machine, a muslin cloth, baby socks, a bag of supplies, and a daybed with a cream cover.

### Abe's room (180, 951, 604 x 406), from IMG_5046 to IMG_5052
The most detailed room in the house. Everything here is real:
- **North wall (face-on):** the **NASA 60th anniversary poster**; a **game-controller canvas painting** (white controller, red and black splatter); **wooden letter tiles** under the poster (spell **ABE**, Rami's call); the **sunburst acoustic guitar** on a wall hook; the **LIVE MUSIC neon sign** (red, with a music note); a **PlayStation-symbols neon** (triangle, circle, X, square); a **Goodyear-style "TIRE & RUBBER" pennant** (no real logo); a **retro Mars travel poster**; an **Ohio license plate reading MIDLIFE** (never the real plate); a framed photo.
- **Desk (north wall):** black desk with a laptop, a mechanical keyboard, a mouse, a small MIDI keyboard, a mic on a boom arm and studio speakers; a **black mesh gaming chair**; a whiteboard leaning behind it.
- **TV on a black cube shelf** (east side): an *Astronomy* book, game cases, a **Pac-Man-ghost lamp**, a small **robot figure** on the floor; a striped **laundry hamper** overflowing a little.
- **Dresser wall:** a **navy fluted dresser** with a **vintage turntable** (orange record, dust cover) on a **silver stereo receiver**; a **red quatrefoil-shade lamp**; a small white radio; two **supercar posters** above.
- **Tall black cube shelf:** vintage cameras, a baseball in a case, bobbleheads, a small toy car, a picture book, two **little green alien figures in robes** (generic, not a licensed character) on top, and the **slatted wood LED lamp** glowing teal.
- **Closet wall:** bifold closet doors with an **over-the-door basketball hoop** (scoreboard, net), **race medals** hanging on the knob, and the **yellow traffic-light lamp** on the wall.
- **Dark sleigh bed** with a navy duvet and a striped blanket; a window with vertical blinds; carpet with a little blue LED glow under the bed.

### Bathroom, closets, hall (as in house-v2.js)
Keep simple but real: towels on a bar, a bath mat, a shampoo row on the tub, a plant on the tank; in the walk-in closet, clothes on the rack, shoe boxes, a laundry basket.

## Also paint
- **Floors:** dark wood laminate (living, dining, hall, kitchen) and soft beige carpet (upstairs, living-room carpet area), 512 x 512 tiles that tile cleanly.
- **Walls:** warm beige walls with white baseboards and oak door trim, as wall strips for north walls (face-on, about 96 px tall) and thin edge strips for east and west walls; oak doors and frames.

## Delivery
Two PRs, each stopping for Rami's approval: **ground floor first, then upstairs**. In each: the pieces, a manifest with feet lines and footprints, a 1x comparison with the hero, and a **room mock-up per room** showing every piece placed in that room's rect, so Rami can check placement and perspective before anything goes into the game. Claude places the approved pieces.
