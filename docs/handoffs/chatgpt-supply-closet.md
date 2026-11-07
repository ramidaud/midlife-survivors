# ChatGPT handoff: Supply Closet art (Nov 7)

A hidden back hallway between the Server Room and the Executive Wing, opened by a glitchy badge reader. Design: `docs/plans/supply-closet.md`. Match the existing office props in `assets/stage/props/` exactly: same top-down three-quarter view, the same pixel size as `exec_credenza-v1.png`, chunky #171C35 outlines, and the palette in `assets/art-direction/STYLE_GUIDE.md`. Magenta (#FF00FF) background, like the other prop sheets.

## 1. The badge reader and the door
**`closet_badge_reader-v1.png`:** a wall-mounted badge reader, 24×32 per frame, 3 frames.
- **01:** dark, with a red light
- **02:** red light blinking brighter
- **03:** green light

**`closet_floor_plate-v1.png`:** a worn metal floor plate in front of the reader, 48×32. Use slate and outline colors only.

**`closet_door-open-v1.png`:** a plain gray utility door set in an office wall, 4 frames at 64×96.
- **01:** closed, with a small "no entry" pictogram (a symbol, no words)
- **02 to 04:** sliding open into the wall, ending on a dark doorway with a sliver of warm light

The door gets used on both ends of the closet (the Server Room side and the Executive Wing side).

## 2. Closet props: `supply-closet-props-v1.png` plus a manifest JSON
Each prop on its own cell, with its frame size in the manifest (like `manifest-lounge.json`):

| id | What | Rough size |
|---|---|---|
| `closet_shelf_paper` | Metal shelf stacked with paper reams | 96×112 |
| `closet_shelf_toner` | Metal shelf with toner boxes and one sad label maker | 96×112 |
| `closet_lost_found` | Overflowing lost-and-found bin: pens, one shoe, a mug, a lanyard | 64×64 |
| `closet_mop_bucket` | Yellow mop bucket and mop (use coffee orange, no off-palette yellow) | 48×64 |
| `closet_chair` | One dusty office chair, slightly broken | 48×56 |
| `closet_bulb` | A bare hanging lightbulb, 2 frames (on, slightly brighter) | 24×40 |
| `closet_floor` | A seamless 64×64 concrete floor tile, darker than the Lobby vinyl | 64×64 |

No text on any prop. Then a contact sheet and a short README.
