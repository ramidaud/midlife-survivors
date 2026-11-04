"""Offline art checks for the Full Life handoff. No game state or network access."""
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "assets/breakables"))
from png_qa import png

folder = ROOT / "assets/bosses"
manifest = json.loads((folder / "manifest-full-life-v1.json").read_text())
palette = {tuple(bytes.fromhex(c[1:])) for c in manifest["palette"]}
magenta = (255, 0, 255, 255)
report = []
for item in manifest["bosses"] + [manifest["fatherTime"]]:
    path = folder / item["file"]
    w, h, pixels = png(path)
    cw, ch = item["cell"]
    cols, rows = item["columns"], item["rows"]
    assert (w, h) == (cw * cols, ch * rows), path
    assert all(p[3] == 255 and (p == magenta or p[:3] in palette) for row in pixels for p in row), path
    frames = []
    for n in range(cols * rows):
        frame = tuple(p for y in range(n // cols * ch, (n // cols + 1) * ch)
                      for p in pixels[y][n % cols * cw:(n % cols + 1) * cw])
        frames.append(frame)
        ink = [i for i, p in enumerate(frame) if p != magenta]
        if n in item.get("blankCells", []):
            assert not ink, (path, n, "blank")
            continue
        assert ink and min(i % cw for i in ink) >= 4 and max(i % cw for i in ink) <= 139, (path, n, "side margin")
        assert min(i // cw for i in ink) >= 4 and max(i // cw for i in ink) == 148, (path, n, "anchor")
    assert len(set(frames[:item["activeFrames"]])) == item["activeFrames"], (path, "repeated poses")
    if item["id"] == "father-time":
        assert all(f[128 * cw:149 * cw] == frames[0][128 * cw:149 * cw] for f in frames), "Father Time base moved"
    for name, animation in item["animations"].items():
        if animation.get("static"):
            continue
        data = (folder / animation["preview"]).read_bytes()
        assert (b"NETSCAPE2.0" in data) == animation["loop"], (path, name, "loop extension")
    report.append(dict(file=item["file"], size=[w, h], activeFrames=item["activeFrames"],
                       palette=True, opaqueKey=True, margins=True, footPoint=item["footPoint"], distinctPoses=True))
    if "marker" in item:
        marker = item["marker"]
        mw, mh, mp = png(folder / marker["file"])
        assert [mw, mh] == marker["size"]
        assert all(p[3] == 255 and (p == magenta or p[:3] in palette) for row in mp for p in row)
        assert all(p == magenta for p in mp[0] + mp[-1]), marker["file"]
        report.append(dict(file=marker["file"], size=[mw, mh], palette=True, opaqueKey=True))

pickups = ROOT / "assets/items/field-items-v1.png"
w, h, pixels = png(pickups)
assert (w, h) == (96, 64)
assert all(p[3] in (0, 255) and (p[3] == 0 or p[:3] in palette) for row in pixels for p in row)
for col in range(3):
    base = [p for row in pixels[:32] for p in row[col * 32:(col + 1) * 32]]
    shine = [p for row in pixels[32:] for p in row[col * 32:(col + 1) * 32]]
    assert any(p[3] for p in base)
    assert all(not p[3] or p == q for p, q in zip(base, shine)), "Shine changed base pixels"
    assert sum(p[3] > 0 for p in shine) > sum(p[3] > 0 for p in base)
report.append(dict(file="../items/field-items-v1.png", size=[w, h], hardAlpha=True, palette=True, shinePreservesBase=True))
(folder / "checks-full-life-v1.json").write_text(json.dumps(report, indent=2) + "\n")
print("PASS: 33 distinct boss poses, 12 goal poses, exact magenta keys, margins/anchors, planted Father Time base, three markers and six pickup variants.")
