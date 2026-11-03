# Ben, TJ and Derek

| Character | Walk and secondary poses | Preview | Extra |
|---|---|---|---|
| Ben, The Cold War Cowboy | [PNG](cold-war-cowboy-walk-56x60-v1.png) | [GIF](cold-war-cowboy-walk-56x60-v1-preview.gif) | [32×32 title card badge](cold-war-cowboy-badge-v1.png) |
| TJ | [PNG](intern-tj-v1.png) | [GIF](intern-tj-v1-preview.gif) | Coffee delivery and counter wave |
| Derek | [PNG](intern-derek-v1.png) | [GIF](intern-derek-v1-preview.gif) | Snack delivery, camera strap and register tap |

The three sheets are **448×300 RGBA** with eight columns of **56×60** cells, indexed from zero. The shoe contact line is **y56** within each cell, matching the 9-to-5er and Soccer Dad. Use nearest-neighbor sampling with native alpha. These PNGs can be registered directly as spritesheets.

| Row | Columns | Poses |
|---:|---|---|
| 0 | 0–7 | Down walk |
| 1 | 0–7 | Up walk |
| 2 | 0–7 | Left walk |
| 3 | 0–7 | Right walk |
| 4, Ben | 0–3 / 4–7 | Breathing and blink / examines the floppy |
| 4, TJ and Derek | 0–3 | Front-facing counter action, drawn as a full sprite for the counter to occlude |
| 4, TJ and Derek | 4–7 | Empty |

The walk cycle matches the existing 68 px travel cycle, about **296 ms** at 230 px/s. Suggested idle and counter hold is **185 ms** per cell. The walk GIFs show Down, Up, Left and Right across the top, with idle or counter below. GIFs use a warm matte for legibility.

Ben's [On Break sheet](portraits/cold-war-cowboy-on-break-v1.png) and [preview](portraits/cold-war-cowboy-on-break-preview-v1.gif) use **96×112** cells on a **768×336** RGBA sheet. Shoe contact is **y111**.

| Row | Columns | Poses | Time per cell |
|---:|---|---|---:|
| 0 | 0–5 | Breath and blink, loop | 220 ms |
| 1 | 0–7 | Raises the floppy, blows off dust, lowers it | 140 ms |
| 2 | 0–7 | Stretches both arms, then settles | 150 ms |

Row 0 columns 6–7 are empty. Ben's planned unlock is ten devlog memos. Claude owns the unlock, delivery and Lounge hooks.
