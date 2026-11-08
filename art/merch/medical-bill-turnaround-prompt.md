# ChatGPT prompt: Medical Bill turnaround (for Kevin's Meshy agent and a bobblehead)

Why: Kevin's Meshy template works best with front, side and back views at the same scale. The game only has Medical Bill walking at 48x48, so this is new art. Attach `assets/enemies/medical-bill-v1.png` to the request so the face and colors match.

Paste the style header, then the JSON.

```
STYLE: Midlife Survivors style bible. Solid flat magenta background #FF00FF, no shadow or gradient on it. Hard pixel edges, no anti-aliasing, blur, gradients or glow. Neutral white balance, no sepia or film tint. No text unless the prompt asks. Draw at the stated logical size, then enlarge only by whole numbers with nearest-neighbor. Sheets are an even grid, frames left to right, equal padding, every frame filled.
```

```json
{
  "asset": "medical-bill-turnaround-v1",
  "purpose": "reference sheet for a 3D model and bobblehead; a modeler and an image-to-3D tool will build from it, so every view must line up exactly",
  "character": {
    "name": "Medical Bill",
    "description": "A crumpled tan invoice with a face, wrapped in a pink hospital gown. The paper body is the head: dog-eared top corners, a few faint printed lines across the forehead, narrow angry eyes and a small smirk. The gown is soft pink with a red cross on the chest and ties in a small bow at the back. Stubby dark-navy arms and legs. The right hand holds a small tan clipboard. Dark-navy slipper feet.",
    "palette": {
      "paper": "#F2D7A1",
      "paper_shadow": "#D9B97E",
      "outline_and_limbs": "#171C35",
      "gown": "#F1B5BF",
      "gown_shadow": "#D98FA0",
      "cross": "#C45C4B"
    },
    "match_this": "assets/enemies/medical-bill-v1.png frame 1 (attached). Same face, same gown, same proportions. Do not redesign."
  },
  "proportions": {
    "head": "the paper body is 60 percent of total height",
    "limbs": "arms and legs at least 6 pixels thick so they survive 3D printing",
    "base": "a small round navy disc under the feet, 40 percent of body width, flat bottom, same in every view"
  },
  "pose": "standing straight, facing the camera in the front view, arms slightly away from the body (not touching it), clipboard held out to the side so it reads in profile, feet planted on the base, identical expression in every view",
  "views": ["front", "left side", "back", "right side", "three-quarter front"],
  "layout": {
    "logical_frame": "96x112 pixels per view",
    "frames": 5,
    "rows": 1,
    "padding": "equal, every frame filled",
    "alignment": "base bottom edge on the same pixel row in every view; body height identical in every view; the character centered in each frame"
  },
  "output": {
    "file": "assets/characters/merch/medical-bill-turnaround-v1.png",
    "scale": "draw at logical size, also deliver a 4x nearest-neighbor enlargement",
    "also": "save this prompt next to it as medical-bill-turnaround-v1-prompt.txt"
  },
  "avoid": ["anti-aliasing", "gradients", "drop shadows", "readable text or numbers", "changing the face between views", "rounder or cuter proportions than the sprite", "thin limbs under 6 pixels", "sepia or warm color cast"]
}
```

After it lands: Claude strips the magenta, checks the five views share a baseline, and packages it in `art/merch/` for Kevin.
