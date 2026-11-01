# Title-screen concepts, v1

Generated with built-in imagegen from Rami's three distinct briefs. The repeated 8:59 lobby brief was treated as one concept. Full prompts are alongside each PNG. These are menu background illustrations, not sprite exports; full environment backgrounds replace the magenta sprite rule.

| PNG | Direction | Menu space |
| --- | --- | --- |
| 01-swarm-v1.png | Absurd power fantasy, hero low center, enemies around the borders | Open lit carpet in the upper middle |
| 02-midlife-panorama-v1.png | Continuous office, hospital, home and resort with the hero aging along the path | Dark horizontal middle band |
| 03-eight-fifty-nine-lobby-v1.png | Calm before the swarm: punch clock left, gathering enemies behind glass right | Quiet middle 40 percent |

All final images are exactly 1920x1080. The generation service returned 1672x941 sources; `export-title-art.swift` exports to the requested dimensions using nearest-neighbor sampling and no antialiasing. The original generated files remain in Codex's generated-image store. No smooth resize was applied.

`03-lobby-center-crop-preview.png` is the exact middle 900x1080 crop (x=510..1410). It demonstrates a clear portrait menu area; the hero and most enemies intentionally remain in the outer desktop thirds and disappear in this crop. A separate mobile composition may be needed if the characters must stay visible.

Art-direction preference: the lobby gives the menu the most breathing room; the swarm has the most energy; the panorama tells the whole-life story. Selection is pending Rami's feedback. These assets are not wired into the production title screen.
