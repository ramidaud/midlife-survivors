# Office finish icon atlas

[Review the icons](review.html) at 16, 32 and 64 px. This package is ready for review and does not wire the new art into the game.

`icons-v1.png` is 256x160, eight columns by five rows, with 32x32 cells and opaque exact magenta outside the ink. Key that color before drawing; use nearest-neighbor sampling. The zero-based row-major indices in `icons-v1.json` use the exact names from UPGRADE_META and the three IDs from CHAR_ICONS. The live map had 31 card keys. Index 31 is a generic fallback and indices 35–39 are reserved. The raised palm belongs to the card named `Unlock: "No."`.

The five working sheets and the corrected office avatar sheet are reference art. Use only the native atlas for integration. Prompts are in `brief-v1.json` and `avatar-correction-prompt.txt`. Export with `swift assets/ui-icons/export-v1.swift assets/ui-icons`; validate against current game metadata with `python3 assets/ui-icons/validate.py`.
