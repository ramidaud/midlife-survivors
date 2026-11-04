"""Read-only wall/floor PNG checks; writes checks-wall.json. No game imports."""
from pathlib import Path
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parents[1] / 'breakables'))
from png_qa import png

manifest = json.loads((ROOT / 'manifest-wall.json').read_text())
palette = {tuple(bytes.fromhex(c[1:])) + (255,) for c in manifest['palette']}
key = (255, 0, 255, 255)
navy = (23, 28, 53, 255)
results = []
for item in manifest['assets']:
    fw, fh = item['frame']
    assert fw in (32, 64, 96, 128) and fw == item['moduleWidth']
    assert item['variants'] == 3
    assert item['solid'] == (item['mount'] == 'hugging')
    assert item['footprint']['depth'] == (24 if item['solid'] else 0)
    if item['mount'] == 'mounted':
        assert 32 <= fh <= 64
    w, h, sheet = png(ROOT / item['file'])
    assert (w, h) == (fw * 3, fh), item['id']
    masks, hashes = [], []
    for v in range(3):
        frame = [row[v * fw:(v + 1) * fw] for row in sheet]
        colors = {p for row in frame for p in row}
        assert colors <= palette | {key}, item['id']
        assert all(p[3] == 255 for row in frame for p in row)
        assert all(p == key for p in frame[0] + frame[-1]), item['id']
        if not item['repeatX']:
            assert all(row[0] == row[-1] == key for row in frame)
        else:
            assert all(row[0] == row[-1] for row in frame), item['id']
        mask = {(x, y) for y, row in enumerate(frame) for x, p in enumerate(row) if p != key}
        assert mask, item['id']
        for x, y in mask:
            neighbors = [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]
            if item['repeatX']:
                neighbors = [(a % fw, b) for a, b in neighbors]
            if any(n not in mask for n in neighbors):
                assert frame[y][x] == navy, (item['id'], 'silhouette')
        masks.append(mask)
        hashes.append(hashlib.sha256(bytes(c for row in frame for p in row for c in p)).hexdigest())
    assert masks[0] == masks[1] == masks[2], item['id']
    assert len(set(hashes)) == 3, (item['id'], 'duplicate colorway')
    results.append(dict(id=item['id'], palette=True, magenta=True, navyOutline=True,
                        identicalVariantMasks=True, uniqueColorways=True, repeatX=item['repeatX']))
report = dict(status='passed', families=len(results), colorways=len(results) * 3,
              module=32, solidDepth=24, runtimePlacementTested=False, assets=results)
(ROOT / 'checks-wall.json').write_text(json.dumps(report, indent=2) + '\n')
print('PASS:', len(results), 'families,', len(results) * 3, 'colorways')
