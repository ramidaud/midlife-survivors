# ChatGPT brief: minimap art (Nov 4, 2026)

Paste below the line into ChatGPT.

---

Next feature: a **minimap**. Please pull first (`git stash && git pull`). The minimap is a small map in a HUD corner that fills in as you explore the office. It shows you, the doors (locked or open), chests, the Lounge and the interns. You unlock it by finding the office's **"You Are Here" evacuation map** on a wall. Claude draws the floor plan itself from the level data. This job covers the frame, the icons and the wall poster.

**Match these:** the 32 px UI icon atlas (`assets/ui-icons/icons-v1-alpha.png`), the loadout icons (`assets/ui/loadout-icons-v1.png`) and the wall kit (`assets/stage/props/manifest-wall.json`).

```json
{
  "minimap_frame": {
    "file": "assets/ui/minimap-frame-v1.png",
    "what": "9-slice frame for the corner map, 64x64 source with 16 px corners: a navy clipboard-style panel with a teal border, a tiny cream 'MAP' tab at the top left, and two small screws. The middle is flat #171C35 so the map shows through",
    "also": "a 24x24 'expand' corner button (two diagonal arrows) and a 24x24 'close' (x), same style, in assets/ui/minimap-buttons-v1.png"
  },
  "icons": {
    "file": "assets/ui/minimap-icons-v1.png",
    "cell": "12x12, one row, transparent with hard alpha, readable at 1x on a dark map",
    "order": [
      "you: a cream arrowhead pointing up (Claude rotates it) with a navy outline",
      "door_open: a teal door standing ajar",
      "door_locked: a russet door with a tiny padlock",
      "chest: a little filing box with a coffee-orange lid",
      "lounge: a coffee cup with steam",
      "intern: a small sage person silhouette with a lanyard",
      "boss: a russet skull-free warning triangle with an exclamation bar (no text)",
      "map_found: a folded paper map with a red dot"
    ]
  },
  "evacuation_map_prop": {
    "file": "assets/stage/props/evac-map-v1.png",
    "cell": "48x40, 2 frames (row 0: plain, row 1: a gentle glow on the red 'you are here' dot)",
    "what": "a framed fire-evacuation floor plan hanging on the wall: cream paper, slate room outlines, green exit arrows, a red dot, a little title bar with tick marks (no readable words)",
    "anchor": "hangs on north walls like the wall-kit modules (same light and outline)"
  },
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "style": "crisp 16-bit pixel art, navy outline, warm upper-left light, no anti-aliasing",
  "avoid": "text, numbers, logos"
}
```

**Checks:** one image with the frame at 2x holding a fake map, with every icon on it, plus the poster on a wall strip beside the 9-to-5er. Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`.
