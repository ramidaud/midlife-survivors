# ChatGPT handoff: Supply Closet art (Nov 7)

A hidden room off the Lobby, opened by a filing cabinet that slides aside. Design: `docs/plans/supply-closet.md`. Match the existing office props in `assets/stage/props/` exactly: same top-down three-quarter view, the same pixel size as `gate_hidden_cabinet-v1.png`, chunky #171C35 outlines, and the palette in `assets/art-direction/STYLE_GUIDE.md`. Magenta (#FF00FF) background, like the other prop sheets.

## 1. The cabinet door: `gate_hidden_cabinet-open-v1.png`
- 4 frames side by side, each 96×112, the same size as the existing cabinet frames.
- Start from frame 0 of `gate_hidden_cabinet-v1.png` (the teal one with the lavender binder).
- **01:** closed, as it is now.
- **02:** the cabinet slid about a quarter of its width to the right, with a dark gap showing on the left.
- **03:** halfway open.
- **04:** fully open: a dark doorway with a sliver of warm closet light. The cabinet now sits to the right.
- The cabinet itself never changes shape or color; it only slides.

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
