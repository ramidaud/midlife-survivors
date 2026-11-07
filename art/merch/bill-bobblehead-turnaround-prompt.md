# ChatGPT prompt: Bill bobblehead turnaround (for Kevin's 3D work)

Why this exists: Kevin offered to try a bobblehead. A modeler needs the same character from the front, side and back, drawn at the same scale and in the same pose. The game only has Bill walking at 48x48, so this is new art. Keep the game's style so the figurine matches the screen.

Paste the shared style header first (same one as every other art request), then the JSON.

```
STYLE: Midlife Survivors style bible. Solid flat magenta background #FF00FF, no shadow or gradient on it. Hard pixel edges, no anti-aliasing, blur, gradients or glow. No text unless the prompt asks. Draw at the stated logical size, then enlarge only by whole numbers with nearest-neighbor. Sheets are an even grid, frames left to right, equal padding, every frame filled.
```

```json
{
  "asset": "medical-bill-bobblehead-turnaround-v1",
  "purpose": "reference sheet for a 3D printed bobblehead; a modeler will build from it, so every view must line up",
  "character": {
    "name": "Bill (Medical Bill)",
    "description": "A crumpled, cream-colored medical bill with stubby dark-navy arms and legs, a single red stripe across the top like a letterhead band, angry squinting eyes, a small frowning mouth, and faint smudged numbers printed on his belly. Paper edges are slightly torn and dog-eared. He is a walking invoice who is mad at you.",
    "palette": {
      "paper": "#FFF0CF",
      "outline_and_limbs": "#171C35",
      "stripe": "#C45C4B",
      "shading": "#F2D7A1",
      "limb_highlight": "#526078"
    },
    "match_this": "assets/enemies/enemy-bill-v2.png frame 1 (attach it). Same face, same stripe, same proportions."
  },
  "bobblehead_proportions": {
    "head": "the whole paper body is the head; make it 65 percent of total height",
    "base": "a small round navy base, 40 percent of body width, flat bottom",
    "neck": "a short visible gap between body and base where the spring would go",
    "limbs": "arms and legs at least 6 pixels thick so they survive printing"
  },
  "pose": "standing straight, arms slightly out from the body (not touching it), feet planted on the base, same expression in every view",
  "views": ["front", "left side", "back", "right side", "three-quarter front"],
  "layout": {
    "logical_frame": "96x112 pixels per view",
    "frames": 5,
    "rows": 1,
    "padding": "equal, every frame filled",
    "alignment": "base bottom edge on the same pixel row in every view; body height identical in every view"
  },
  "output": {
    "file": "assets/characters/merch/medical-bill-bobblehead-turnaround-v1.png",
    "scale": "draw at logical size, deliver a 4x nearest-neighbor enlargement too",
    "also": "save this prompt next to it as -prompt.txt"
  },
  "avoid": ["anti-aliasing", "gradients", "drop shadows", "text or numbers that are readable", "changing Bill's face between views", "thin limbs under 6 pixels"]
}
```

After it lands: Claude strips the magenta, checks that the five views line up on the same baseline, and packages it in `art/merch/` for Kevin.
