# Friends sprites v2

[Compare with the 9-to-5er](friends-v2-vs-9to5er.png). Columns show the 9-to-5er, Ben, TJ and Derek. The top left shows native 1× pixels. The larger panels repeat the same Down, Right and resting poses at 4× on slate.

| Character | Native sheet | Animation preview |
|---|---|---|
| Ben, The Cold War Cowboy | [Walk and idle](cold-war-cowboy-walk-56x60-v2.png) | [GIF](cold-war-cowboy-walk-56x60-v2-preview.gif) |
| TJ | [Walk, counter and idle](intern-tj-v2.png) | [GIF](intern-tj-v2-preview.gif) |
| Derek | [Walk, counter and idle](intern-derek-v2.png) | [GIF](intern-derek-v2-preview.gif) |
| Ben, On Break | [Portrait poses](portraits/cold-war-cowboy-on-break-v2.png) | [GIF](portraits/cold-war-cowboy-on-break-preview-v2.gif) |

Ben's [32×32 badge](cold-war-cowboy-badge-v2.png) uses his new face and hat.

The 448×300 sheets have eight 56×60 cells per row, with opaque palette pixels and transparent padding. Use nearest-neighbor sampling and align shoes at local y56. Walk rows 0–3 face Down, Up, Left, Right. Play all eight columns over the existing 68 px cycle.

| Row 4 | Columns 0–3 | Columns 4–7 |
|---|---|---|
| Ben | Breathing and blink | Raises his floppy and blows off dust |
| TJ | Waves over the Lounge counter | Takes a sip |
| Derek | Reaches to ring up the order | Raises his camera |

The intern counter poses include legs so the existing counter can occlude them. The idle actions occupy the four previously unused cells.

Ben's portrait is 768×336, with 96×112 cells and y111 shoe contact. Row 0 has six breathing poses at 220 ms each and two empty cells. Row 1 has eight floppy dust poses at 140 ms each. Row 2 has eight stretch poses at 150 ms each.

Built-in imagegen prompt set used the 9-to-5er v2 walk sheet as the exact pixel style, proportions, three-quarter angle and stride reference. The three walk studies asked for eight poses per direction, alternating contacts and passes, arm swing, a one-pixel bob, an upper-left rim and three to four shades per material. Ben's prompt specified a thin, tilted hat brim and visible eyes. TJ's specified a warm toothy grin, reflected glasses, lighter parka edges and khaki. Derek's specified textured curls, a shaped beard, glasses catchlights and a bright camera strap. A separate Ben study also referenced the existing 9-to-5er On Break sheet and followed its three animation rows. Native cleanup keyed out the backdrop, aligned each pose and snapped every opaque pixel to the approved 9-to-5er palette.
