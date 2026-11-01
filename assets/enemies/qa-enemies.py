"""Offline PNG integrity check and file-safe review data export, stdlib only."""
import base64
import json
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PALETTE = {bytes.fromhex(h) for h in '171c35 303750 526078 3e7775 83a89a a88b70 d3b78d f2d7a1 fff0cf 874c3b c45c4b ef9347 e5a995 f1b5bf bfa8cf ff00ff'.split()}
BG = bytes.fromhex('ff00ff')

def decode(path):
    data = path.read_bytes()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    pos, packed = 8, b''
    while pos < len(data):
        count = struct.unpack('>I', data[pos:pos+4])[0]
        kind, chunk = data[pos+4:pos+8], data[pos+8:pos+8+count]
        if kind == b'IHDR':
            w, h, depth, color, _, _, interlace = struct.unpack('>IIBBBBB', chunk)
        if kind == b'IDAT':
            packed += chunk
        pos += count + 12
    assert depth == 8 and color in (2, 6) and interlace == 0
    bpp = 4 if color == 6 else 3
    stride = w*bpp
    raw, previous, rows = zlib.decompress(packed), bytearray(stride), []
    for y in range(h):
        mode = raw[y*(stride+1)]
        row = bytearray(raw[y*(stride+1)+1:(y+1)*(stride+1)])
        for x in range(stride):
            a, b, c = (row[x-bpp] if x >= bpp else 0), previous[x], (previous[x-bpp] if x >= bpp else 0)
            if mode == 1: add = a
            elif mode == 2: add = b
            elif mode == 3: add = (a+b)//2
            elif mode == 4:
                p = a+b-c
                ds = [abs(p-a), abs(p-b), abs(p-c)]
                add = [a,b,c][ds.index(min(ds))]
            else:
                assert mode == 0
                add = 0
            row[x] = (row[x]+add)&255
        rows.append([bytes(row[x:x+3]) for x in range(0,stride,bpp)])
        if bpp == 4: assert all(row[x] == 255 for x in range(3,stride,4)), path
        previous = row
    return w,h,rows

specs = json.loads((ROOT/'batch-1.json').read_text())
review = []
for spec in specs:
    path = ROOT/f"enemy-{spec['id']}-v1.png"
    w,h,rows = decode(path)
    n, count = spec['size'],spec['frames']
    assert (w,h) == (n*count,n), path
    assert set(p for row in rows for p in row) <= PALETTE, path
    frames, counts = [], []
    for f in range(count):
        frame = [row[f*n:(f+1)*n] for row in rows]
        assert all(frame[0][x] == frame[-1][x] == frame[x][0] == frame[x][-1] == BG for x in range(n)), path
        pixels = [(x,y) for y in range(n) for x in range(n) if frame[y][x] != BG]
        assert len(pixels) > 12
        if spec['anchor'] == 'feet':
            lift = 2 if spec['id'] == 'late-night-donut' and f%2 else 0
            assert max(y for x,y in pixels) == n-3-lift, path
        if not (spec['id'] == '3am-thought' and f in (1,2)):
            for x,y in pixels:
                if any(frame[yy][xx] == BG for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]):
                    assert frame[y][x] == bytes.fromhex('171c35'), (path,f,x,y)
        frames.append(b''.join(p for row in frame for p in row))
        counts.append(len(pixels))
    assert len(set(frames)) == count, (path,'duplicate frames')
    if spec['id'] == '3am-thought': assert counts[0] > counts[1] > counts[2] and counts[3] > counts[1]
    for suffix in ['-v1-prompt.txt','-preview-v1.gif','-source-v1.png']:
        assert (ROOT/f"enemy-{spec['id']}{suffix}").is_file()
    review.append(dict(spec,src='data:image/png;base64,'+base64.b64encode(path.read_bytes()).decode()))
    print(f"PASS {spec['id']}: {w}x{h}, {count} unique frames; ink {counts}")
assert len(specs) == 11 and sum(s['frames'] for s in specs) == 42
(ROOT/'review-data.js').write_text('window.ENEMY_ART_REVIEW = '+json.dumps(review,separators=(',',':'))+';\n')
print('PASS 11 sheets, 42 frames; opaque exact palette, magenta, padding and outlines. Review data refreshed.')
