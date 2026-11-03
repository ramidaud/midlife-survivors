"""Verify native coworker assets and their authored seat assignments."""
from pathlib import Path
import json
import sys

directory = Path(__file__).resolve().parent
sys.path.insert(0, str(directory.parents[1] / 'breakables'))
from png_qa import png

cast = json.loads((directory / 'cast-v1.json').read_text())
layout = json.loads((directory.parent / 'start-area/layout.json').read_text())
palette = {
    tuple(bytes.fromhex(value)) + (255,)
    for value in '171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf b97a58 70402f ff00ff'.split()
}
key = (255, 0, 255, 255)
navy = (23, 28, 53, 255)
assert 6 <= len(cast) <= 8
assert len({entry['caption'] for entry in cast}) == len(cast)
for entry in cast:
    identifier = entry['id']
    width, height, rows = png(directory / f'coworker-{identifier}-v1.png')
    assert (width, height) == (192, 224)
    frames = []
    for index in range(16):
        x, y = index % 4 * 48, index // 4 * 56
        frame = tuple(tuple(row[x:x + 48]) for row in rows[y:y + 56])
        ink = {(x, y) for y, row in enumerate(frame) for x, color in enumerate(row) if color != key}
        assert len(ink) > 100
        for x, y in ink:
            assert 0 < x < 47 and 0 < y < 34
            assert frame[y][x] in palette
            if any((x + dx, y + dy) not in ink for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1))):
                assert frame[y][x] == navy
        frames.append(frame)
    for start in (0, 4, 8, 12):
        assert len(set(frames[start:start + 4])) == 4
    assert all(frames[i] != frames[i + 8] for i in range(8))
    assigned = [seat for seat in layout['workers'] if seat['cast'] == identifier]
    assert {seat['colorway'] for seat in assigned} == {0, 1}
    assert all(seat['cropHeight'] == 34 for seat in assigned)
    assert len({seat['phase'] for seat in assigned}) == len(assigned)
    print(f'{entry["name"]}: 16 distinct animation cells across two colorways, {len(assigned)} seats.')
