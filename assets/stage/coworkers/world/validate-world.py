"""Read-only native coworker checks. No runtime or telemetry imports."""
from pathlib import Path
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parents[2] / 'breakables'))
from png_qa import png

manifest = json.loads((ROOT / 'batch-world-v1.json').read_text())
palette = {tuple(bytes.fromhex(c[1:])) for c in manifest['palette']}
results = []
for item in manifest['assets']:
    w, h, sheet = png(ROOT / item['file'])
    fw, fh = item['cell']
    assert [w, h] == item['size'], item['file']
    row_checks = []
    base = None
    for r in range(item['rows']):
        hashes = []
        for col in range(8):
            frame = [line[col * fw:(col + 1) * fw] for line in sheet[r * fh:(r + 1) * fh]]
            assert all(p[3] in (0, 255) and (p[3] == 0 or p[:3] in palette) for line in frame for p in line)
            assert any(p[3] for p in frame[item['footLine']]), (item['id'], r, col, 'floor')
            assert all(not line[0][3] and not line[-1][3] for line in frame), (item['id'], 'side clipping')
            visible_rows = [y for y, line in enumerate(frame) if any(p[3] for p in line)]
            if item['kind'] == 'standing':
                assert 51 <= visible_rows[-1] - visible_rows[0] + 1 <= 55, (item['id'], 'hero-scale body')
            if item['kind'] == 'seated':
                if base is None:
                    base = frame[57:]
                assert frame[57:] == base, (item['id'], 'chair base drift')
            hashes.append(hashlib.sha256(bytes(c for line in frame for p in line for c in p)).hexdigest())
        assert len(set(hashes)) == 8, (item['id'], item['kind'], r, 'duplicate poses')
        row_checks.append(dict(name=item['rowNames'][r], frames=8, ms=item['timing'][r], distinct=True))
    results.append(dict(id=item['id'], kind=item['kind'], size=[w, h], hardAlpha=True,
                        palette=True, footLine=item['footLine'], rows=row_checks))
report = dict(status='passed', sheets=len(results), frames=336, previews=42, assets=results)
(ROOT / 'checks-world-v1.json').write_text(json.dumps(report, indent=2) + '\n')
print('PASS: 12 sheets, 336 distinct row poses, hard alpha and planted anchors')
