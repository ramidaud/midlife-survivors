# ChatGPT brief: proper in-world poses for the six coworkers (Nov 4, 2026)

Paste everything below the line into ChatGPT.

---

This is #2 from your audit. The six coworkers (**Art, Sam, Eli, Nora, June, Mina**) look great on their Spotlight cards, but in the office they're still **assembled from cropped seated art**: no proper legs, no real chair contact, and nobody moves. Give them native world sprites at the heroes' scale.

## Reference
- **Identity:** each coworker's On Break portrait in `assets/stage/coworkers/portraits/` (`coworker-salad`, `-retiring`, `-intern`, `-email`, `-dozer`, `-mute`) and the names in `src/data/spotlight.js` (`rooms`).
- **Scale and style:** the hero walk sheets, e.g. `assets/characters/office-worker-walk-56x60-v2.png` (56×60 cells, magenta-free transparent, hard alpha).

## Two sheets per coworker
```json
{
  "seated_sheet": {
    "cell": "72x64 (wider than a hero so the office chair fits)",
    "layout": "8 columns x 2 rows = 576x128",
    "row_0": "working at a desk, seen from the front three-quarter: typing, a sip, a sigh, a glance at the phone (8 frames, 180 ms)",
    "row_1": "their personal bit (8 frames, 160 ms): Art eats salad, Sam packs a box, Eli untangles a cable, Nora hits reply-all and winces, June dozes off and jerks awake, Mina talks on mute and realizes it",
    "chair": "a navy office chair drawn into the sprite with clear contact: seat under them, wheels on the floor, feet touching the ground",
    "anchor": "the chair's wheels sit on local y63"
  },
  "standing_sheet": {
    "cell": "56x60, exactly like the heroes",
    "layout": "8 columns x 5 rows = 448x300 (rows: walk down, walk up, walk left, walk right, then idle)",
    "notes": "a short pacing loop so they can wander their room; idle row is their signature fidget at a slower tempo",
    "anchor": "shoes on local y59, the same as the heroes"
  },
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "style": "crisp 16-bit pixel art, navy outline, warm upper-left light, matching the heroes and interns exactly",
  "avoid": "any text or logos, realistic shading, changing their faces or outfits from the portraits"
}
```

## Files
- **Write:** `assets/stage/coworkers/world/coworker-<id>-seated-v1.png` and `coworker-<id>-standing-v1.png` for the six ids, plus preview GIFs of every row.
- **Checks:** one check image showing all six seated and standing at 2× beside the 9-to-5er and TJ.
- **Ship it:** pull first (`git stash && git pull`). Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`. Claude will swap them in for the assembled sprites.
