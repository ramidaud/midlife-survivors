# ChatGPT brief: Ben, TJ and Derek as pixel characters (Nov 3, 2026)

Three of Rami's friends are joining the game. Rami will attach a reference photo of each in the chat. **Don't commit the photos to the repo** (it's public). Use them only as reference for likeness: hair, glasses, hat and outfit. Keep it friendly and recognizable, never a caricature.

Match the existing cast exactly: same palette (navy #171C35 outline, cream #F2D7A1, teal #3E7775, sage #83A89A, coffee #EF9347, russet #874C3B), same proportions and pixel density as `assets/characters/*-walk-56x60-v2.png`, and the same light from the upper left.

## 1. Ben: "The Cold War Cowboy" (new playable hero)
Unlocked by reading 10 devlog memos (Required Reading). **He works in IT and has a soft spot for days gone by**: beige computers, floppy disks, rotary phones, pagers, cassette tapes.

Deliver:
- **Walk + idle sheet**, 56x60 cells, the same layout as the other heroes (8-frame walk in 4 directions, plus idle). File: `assets/characters/cold-war-cowboy-walk-56x60-v1.png`
- **On Break portrait sheet**, 96x112 cells, 768x336, the same rows as the others (row 0 breathe, 6 frames at 220 ms; row 1 signature, 8 frames at 140 ms; row 2 stretch, 8 frames at 150 ms). His signature: blowing dust off a floppy disk, or tipping his hat while a pager buzzes. File: `assets/characters/portraits/cold-war-cowboy-on-break-v1.png`
- A 32x32 **badge icon** for the title screen ID cards.

```json
{
  "subject": "Ben, 'The Cold War Cowboy', office IT guy who loves old tech",
  "style": "16-bit pixel art game sprite, matches Midlife Survivors cast, navy outline, limited warm palette, top-left light",
  "physical": {
    "skin": "fair, light peach",
    "face": "round face, clean-shaven, friendly half-smile, light eyes",
    "hair": "long wavy dark brown hair falling past the ears to the collar",
    "headwear": "tan felt cowboy hat with a wide curled brim, pinched crown and a small pin on the band",
    "build": "average build"
  },
  "outfit": "dark charcoal jacket over a light blue collared shirt, IT lanyard and badge, dark jeans, brown boots",
  "props": ["beige 3.5-inch floppy disk", "clip-on pager", "coiled phone cord on his shoulder"],
  "mood": "easygoing, nostalgic, a little mischievous",
  "avoid": ["brand logos", "realistic shading", "caricature features", "weapons"]
}
```

## 2. TJ and Derek: the Interns (not playable)
They walk over with coffee and snacks, and one of them runs the Lounge counter in the Break Room. Right now they're placeholder figures drawn in code (`src/interns.js`).

Deliver for each:
- **Walk sheet**, 8 frames in 4 directions, at hero scale (56x60 cells). They're carrying a coffee cup or a snack bag.
- **Counter pose**, 4 frames standing behind a counter, waving or ringing up an order (56x60).
- Files: `assets/characters/intern-tj-v1.png`, `assets/characters/intern-derek-v1.png`, plus a README frame map.

```json
{
  "subject": "TJ, a cheerful office intern who brings coffee",
  "style": "16-bit pixel art game sprite, matches Midlife Survivors cast, navy outline, top-left light",
  "physical": {
    "skin": "deep brown",
    "face": "big warm smile, short goatee, thin dark rectangular glasses",
    "hair": "short, under a charcoal gray knit beanie with a small cream patch",
    "build": "average build"
  },
  "outfit": "black hooded winter parka with chest pockets and a round patch, khaki pants, intern lanyard and badge",
  "props": ["paper coffee cup with a lid", "small paper snack bag"],
  "mood": "upbeat, eager, a little chaotic",
  "avoid": ["brand logos", "caricature features"]
}
```

```json
{
  "subject": "Derek, a calm office intern who also takes photos",
  "style": "16-bit pixel art game sprite, matches Midlife Survivors cast, navy outline, top-left light",
  "physical": {
    "skin": "light, warm",
    "face": "full short dark beard, black rectangular glasses, steady confident look",
    "hair": "short dark curly hair",
    "build": "average build"
  },
  "outfit": "black zip-up jacket, dark pants, intern lanyard and badge",
  "props": ["small black mirrorless camera on a strap", "snack bag or coffee cup"],
  "mood": "chill, dry humor",
  "avoid": ["brand logos", "caricature features"]
}
```

## Checks before you push
- Transparent backgrounds (no magenta), crisp pixels, no anti-aliasing.
- Same feet line as the other heroes, so they don't float.
- Preview GIFs plus a README with the frame map. Art only: Claude wires them into the game.
- Log it in `docs/handoffs/chatgpt-changes.md`.
