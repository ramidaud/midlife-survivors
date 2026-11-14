# Hero idle studies v3

Art for review only. No game files or existing sheets are changed.

Each PNG is **448×60**, eight **56×60** cells in one row, left to right.
Transparent RGBA with binary alpha. No smoothing when enlarging.
Each hero uses only the RGB colors from frame 1 of that hero's current
`../*-walk-56x60-v4.png`. Neutral white balance; no added tint.

| Hero | Action | Visible width × height | Inclusive bounds | Preview |
| --- | --- | --- | --- | --- |
| 9-to-5er | Glasses push | 36×53 | x8–43, y4–56 | [GIF](office-worker-idle-preview-v3.gif) |
| Soccer Dad | Coffee sip | 38×55 | x9–46, y2–56 | [GIF](soccer-dad-idle-preview-v3.gif) |
| Grad Student | Notebook check | 30×53 | x13–42, y4–56 | [GIF](grad-student-idle-preview-v3.gif) |
| Coldwar Cowboy | Hat tip | 31×53 | x12–42, y4–56 | [GIF](cold-war-cowboy-idle-preview-v3.gif) |

Frames 1–4 breathe/blink/rest. Frames 5–8 anticipate, perform the signature
action, hold it and return. The Cowboy keeps his mug while tipping his hat;
Soccer Dad keeps his ball during the sip. Soles end at y56 in every frame.
The walking pose is a geometry reference; the idles stand on both feet.

Suggested review timing: **360, 220, 140, 300, 180, 220, 360, 220 ms**.
GIFs use exact 4× nearest-neighbor enlargement and one fixed hero palette.

The previous three v2 paintings remain unchanged. `sources/` contains the
four new imagegen paintings once each, in 4×2 pose order. Those paintings
are source material, not native sprite sheets. Exported PNGs are the
dimension- and palette-checked deliverables.

[Native comparison](../../../reports/hero-idle-v3/comparison-native.png) ·
[3× comparison](../../../reports/hero-idle-v3/comparison-3x.png) ·
[Measured checks](../../../reports/hero-idle-v3/checks.json) ·
[Prompts](../../../reports/hero-idle-v3/prompts.json) ·
[Exporter](../../../reports/hero-idle-v3/export.py)

The comparison puts walk frame 1 first, then all eight idle frames on the
same foot line. Export from the repo root with
`python reports/hero-idle-v3/export.py` (Pillow and NumPy).

The image model received the enlarged walk frame as its primary reference,
with the previous idle study as a secondary action reference for the three
returning heroes. Export keys the magenta source background, reduces the
painted figures with nearest-neighbor sampling, fits their visible bounds
to the measured reference, and locks colors to that reference's palette.
Material assignments were specified in the prompts and checked visually:
cream paper/shirt, khaki slacks/shorts, orange mug, teal polo, lavender
hoodie, navy blazer and tan hat. Palette snapping is a final constraint,
not the source of those material choices.

These files live under a `study` path, which the current Pages workflow
excludes. No runtime registration, placement, build or version change.
