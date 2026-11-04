"""Offline art QA. Run from the repository root; reads PNGs and GIF headers only."""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "assets/breakables"))
from png_qa import png

manifest = json.loads((ROOT / "assets/weapons/manifest-loadout-v1.json").read_text())
palette = {tuple(bytes.fromhex(c[1:])) for c in manifest["palette"]}
atlas = json.loads((ROOT / "assets/ui/loadout-icons-v1.json").read_text())
assert len(atlas["cards"]) == 27 and len(atlas["hud"]) == 7
meta = (ROOT / "src/data/loadout.js").read_text().split("window.LOADOUT_META =")[1].split("\n};")[0]
assert set(atlas["cards"]) == set(re.findall(r'  "([^"]+)"\s*:', meta)), "Card map differs from current LOADOUT_META"
assert set(atlas["allNames"].values()) == set(range(34))
jobs = [
    ("assets/ui/loadout-icons-v1.png", [32, 32], 8, 5, set(range(34, 40))),
    ("assets/ui/style-badges-v1.png", [12, 12], 4, 1, set()),
] + [
    ("assets/weapons/" + a["file"], a["cell"], a["columns"], a["rows"], set(a.get("unusedCells", [])))
    for a in manifest["sprites"]
]
report = []
for file, cell, cols, rows, unused in jobs:
    cw, ch = cell
    w, h, pixels = png(ROOT / file)
    assert (w, h) == (cw * cols, ch * rows), file
    colors = {p for row in pixels for p in row}
    assert all(p[3] in (0, 255) and (not p[3] or p[:3] in palette) for p in colors), file
    frames, coverage = [], []
    for n in range(cols * rows):
        frame = tuple(p for y in range(n // cols * ch, (n // cols + 1) * ch)
                      for p in pixels[y][n % cols * cw:(n % cols + 1) * cw])
        frames.append(frame)
        occupied = sum(p[3] > 0 for p in frame)
        coverage.append(round(occupied / (cw * ch), 4))
        assert (occupied == 0) == (n in unused), (file, n)
        if "office-chair" in file:
            assert any(p[3] for p in frame[-cw:]), (file, n, "wheel line")
    if file.startswith("assets/weapons/"):
        item = next(a for a in manifest["sprites"] if a["file"] == Path(file).name)
        for animation in item["animations"]:
            if animation.get("staticVariants"):
                continue
            row = animation["row"]
            active = frames[row * cols:row * cols + animation["frames"]]
            assert len(set(active)) == animation["frames"], (file, animation["name"])
            gif = (ROOT / "assets/weapons" / animation["preview"]).read_bytes()
            assert (b"NETSCAPE2.0" in gif) == animation["loop"], animation["preview"]
    if any(s in file for s in ("casserole-heat", "phones-bubble", "ooo-field", "cold-snap", "frozen-overlay")):
        assert max(coverage) < 0.4, (file, "field covers too much", coverage)
    report.append(dict(file=file, size=[w, h], cell=cell, grid=[cols, rows],
                       palette=True, hardAlpha=True,
                       uniqueFramesPerRow=[len(set(frames[r * cols:(r + 1) * cols])) for r in range(rows)],
                       opaqueFractionPerCell=coverage))
(ROOT / "assets/ui/checks-loadout-v1.json").write_text(json.dumps(report, indent=2) + "\n")
print("PASS: 34 icons, four badges, nine world families; native dimensions/palette/alpha, distinct animation frames, anchors and GIF loop flags.")
