# Playable hero animation v2

The [review page](review-v2.html) shows the four directions and idle side by side on the Lobby floor color. Compare at 1× or 2×, switch the idle action, or pause and step through the poses. The walk loop covers the same 68 world pixels as v1. At the base movement speed of 230 px/s, a loop takes about 296 ms. The GIFs show Down, Up, Left, and Right across the top, with breathing and fidget underneath.

| Character | Runtime ID | Foot line (zero-based) | Fidget |
|---|---|---:|---|
| The 9-to-5er | `officeWorker` | 56 | Pushes his glasses up |
| The Soccer Dad | `photographer` | 56 | Rubs his neck |
| The Grad Student at 45 | `gradStudent` | 54 | Checks her notebook |

The `*-walk-56x60-v2.png` exports are 448×300 with eight 56×60 cells per row. Read rows as Down, Up, Left, Right, Idle. The walk rows use the four v1 poses at columns 0, 2, 4 and 6. The intervening poses redraw the stride, including a small bob and motion in the shoulders and held props. The v1 sources had slightly different contact heights across directions, so the original art moves vertically by at most two pixels to land at the consistent foot line listed above.

Idle columns 0–3 are breathing with a blink. Columns 4–7 are a separate fidget. The review holds each idle pose for 185 ms. The native sheets use the v1 palette and exact opaque magenta. Key out magenta and sample with nearest neighbor when importing. The built-in imagegen pose studies guided the idle stance and gestures. Prompts are in [generation-prompts-v2.json](generation-prompts-v2.json).
