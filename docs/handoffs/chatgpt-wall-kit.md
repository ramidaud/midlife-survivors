# ChatGPT brief: a wall-dressing kit so the office stops feeling empty (Nov 4, 2026)

Paste everything below the line into ChatGPT.

---

The office still feels empty and plain. Rami: "we could line the walls with things rather than a random object every few blocks." Right now each room has a few big props spaced far apart and long stretches of bare wall. **The job: a modular kit of wall-lining pieces and floor details, so Claude can line every wall with continuous, room-themed stuff.** Claude does the placement; you make the pieces.

## How the walls work
- Walls are built from straight segments **256 px long and 32 px thick** (`walls` in `src/data/start-area.js`).
- So every wall piece is a whole number of **32 px modules wide: 32, 64, 96 or 128**. That way Claude can fill a 256 px segment with mixes like 128 + 64 + 64, or 96 + 96 + 64, with no gaps.
- **Wall-mounted pieces** (posters, boards, clocks, vents) hang on the wall face: non-solid, 32 to 64 px tall.
- **Wall-hugging pieces** (shelves, cabinets, counters) stand on the floor against the wall: solid, with a floor footprint 24 px deep.

## Match the existing prop kit exactly
Follow `assets/stage/props/README.md`:
- the shared 17-color palette;
- opaque exact `#FF00FF` background;
- navy silhouette edges, nearest-neighbor export;
- 2 to 3 colorways per family, on an even horizontal grid;
- a `batch-wall.json` with full prompts, plus `validate-props.py`-style checks.

Native scale matches the 56×60 heroes and the sofas, plants and vending machines already in the game. **No readable text in the art**; use icons and abstract bars. Claude can overlay words with the chunky bitmap font when a joke needs them.

## The pieces (about 40 families, grouped by room)
```json
{
  "everywhere": {
    "wall_mounted": ["framed motivational poster (a mountain, a rowing team, an eagle; no words)", "analog wall clock", "fire extinguisher in a wall bracket", "thermostat with a sticky note", "air vent", "power outlet with a tangle of chargers", "light switch plate", "exit sign (green, a running-figure icon)", "cork board with pinned flyers and a lost-cat photo", "framed employee-of-the-month photo", "corner wall plant in a hanging pot"],
    "wall_hugging": ["low bookshelf 64 wide", "tall bookshelf 96 wide", "two-drawer filing cabinet 32", "four-drawer filing cabinet 64 with one drawer stuck open", "supply shelf with paper reams and toner", "recycling bins pair", "coat hooks with a forgotten umbrella", "cardboard box stack (moving day)"]
  },
  "lobby": ["framed company milestone photos in a row", "brochure rack", "visitor sign-in podium", "a big framed aerial photo of the campus"],
  "bullpen": ["long whiteboard with sticky-note clusters 128", "team calendar board", "kudos wall of thank-you cards", "shared printer nook shelf", "birthday card waiting to be signed on a ledge"],
  "breakroom": ["upper cabinets 128", "counter with microwave, kettle and a passive-aggressive note", "fridge-door collage of magnets and photos", "mug rack (every mug different)", "snack shelf", "chore wheel"],
  "server": ["cable trays along the wall top", "patch panel with blinking ports", "wall-mounted fire suppression panel", "warning stripes at the floor edge", "label-maker labels on everything"],
  "conference": ["wall-mounted screen showing a frozen video call", "glass-wall frosting strip", "marker tray with dead markers", "framed quarterly chart that only goes up"],
  "executive": ["wood paneling 128", "framed diplomas pair", "golf trophy shelf", "abstract expensive painting", "a single sad bonsai on a pedestal"],
  "wellness": ["soft mural strip with clouds", "meditation gong", "towel rack", "inspirational wave print", "water-bottle refill station"],
  "parking": ["painted wall stripes", "speed-bump sign (icon)", "bike rack", "EV charger", "security camera"]
}
```

## Floor detail too (non-solid decals, 32 to 128 px)
The floors are also bare. Make a set of scuffs, a coffee-ring stain, a carpet seam strip, a cable cover strip, floor vents, a dropped paperclip pile, tape lines, chair-wheel marks under desks, a muddy-boot trail near the doors and wet-floor-sign spots. Keep them low contrast, so they add texture without competing with enemies.

## Deliver
- **Files:** native sheets in `assets/stage/props/wall/` and `assets/stage/props/floor/`, plus `manifest-wall.json` listing each family's id, module width, height, solid or not, footprint, and which rooms it belongs in.
- **Checks:** one review board per room showing a 256 px wall segment filled three different ways, at 2× next to the 9-to-5er.
- **Ship it:** pull first (`git stash && git pull`). Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`. Claude will write the wall dresser that lines every room.
