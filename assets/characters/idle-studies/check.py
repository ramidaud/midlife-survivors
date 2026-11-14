"""Independently inspect serialized PNG/GIF deliverables against current walks."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'deliver'
report = json.loads((OUT / 'validation.json').read_text())
assert report['passed'] and len(report['heroes']) == 4
for hero in report['heroes']:
    walk_path = ROOT / hero['reference']
    assert hashlib.sha256(walk_path.read_bytes()).hexdigest() == hero['referenceSha256']
    walk = np.array(Image.open(walk_path).convert('RGBA'))
    key = (walk[:, :, 0] > 220) & (walk[:, :, 1] < 50) & (walk[:, :, 2] > 220)
    walk[key] = 0
    ref = Image.fromarray(walk[:60, :56])
    palette = set(map(tuple, walk[:, :, :3][walk[:, :, 3] > 0]))
    sheet = Image.open(OUT / hero['file']).convert('RGBA')
    assert sheet.size == (448, 60)
    feet, frames = [], []
    for i in range(8):
        frame = sheet.crop((i*56, 0, (i+1)*56, 60))
        assert frame.getbbox() == ref.getbbox(), (hero['id'], i, 'bounds')
        a = np.array(frame)
        assert set(a[:, :, 3].ravel()).issubset({0,255})
        assert set(map(tuple, a[:, :, :3][a[:, :, 3] > 0])).issubset(palette)
        frames.append(a)
        feet.append(a[43:])
    assert all(np.array_equal(feet[0], foot) for foot in feet)
    assert np.array_equal(frames[0], frames[7]), 'Loop return differs'
    assert not np.array_equal(frames[0][:43], frames[5][:43]), 'Action peak missing'
    gif = Image.open(OUT / (hero['id'] + '-idle-4x.gif'))
    assert gif.n_frames == 8 and gif.size == (224,240)
    for i in range(8):
        gif.seek(i)
        assert gif.info['duration'] == hero['durationsMs'][i]
        decoded = np.array(gif.convert('RGBA'))
        expected = np.repeat(np.repeat(frames[i],4,axis=0),4,axis=1)
        assert np.array_equal(decoded[:,:,3], expected[:,:,3]), (hero['id'], i, 'GIF alpha')
        visible = expected[:,:,3] > 0
        assert np.array_equal(decoded[:,:,:3][visible],expected[:,:,:3][visible]), (hero['id'], i, 'GIF palette')

class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ['src','href'] and value and not value.startswith(('http:','https:','#')):
                assert (OUT / value).is_file(), value
Links().feed((OUT / 'review.html').read_text())
print('PASS: 32 serialized cells match walk frame 1 bounds, y56 soles, exact hero palettes and planted feet; all four 8-frame GIFs match PNGs and timing; review links resolve.')
