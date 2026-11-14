"""Export painted idle studies to measured walk-frame geometry; no art drawing.

Run from the repository root with Pillow and NumPy installed.
"""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets/characters/idle-study-v3'
REPORT = ROOT / 'reports/hero-idle-v3'
HEROES = ['office-worker', 'soccer-dad', 'grad-student', 'cold-war-cowboy']
ACTIONS = ['glasses push', 'coffee sip', 'notebook check', 'hat tip']


def keyed(im):
    a = np.array(im.convert('RGBA'))
    # Key both exact walk magenta and the near-magenta source-painting backdrop.
    bg = (a[:, :, 0] > 190) & (a[:, :, 2] > 180) & (a[:, :, 1] < 110)
    a[bg] = 0
    return Image.fromarray(a)


def export():
    checks = {}
    comparison = Image.new('RGB', (56 * 9, 84 * 4), '#ececec')
    draw = ImageDraw.Draw(comparison)
    for row, (hero, action) in enumerate(zip(HEROES, ACTIONS)):
        refpath = ROOT / f'assets/characters/{hero}-walk-56x60-v4.png'
        ref = keyed(Image.open(refpath).crop((0, 0, 56, 60)))
        box = ref.getbbox()
        x0, y0, x1, y1 = box
        refa = np.array(ref)
        palette = np.unique(refa[refa[:, :, 3] != 0, :3], axis=0)
        source = Image.open(OUT / f'sources/{hero}.png').convert('RGBA')
        frames = []
        frame_checks = []
        for i in range(8):
            cx, cy = i % 4, i // 4
            tile = keyed(source.crop((round(cx * source.width / 4),
                                      round(cy * source.height / 2),
                                      round((cx + 1) * source.width / 4),
                                      round((cy + 1) * source.height / 2))))
            figure = tile.crop(tile.getbbox()).resize((x1-x0, y1-y0), Image.Resampling.NEAREST)
            a = np.array(figure)
            rgb = a[:, :, :3].astype(np.int32)
            dist = ((rgb[:, :, None, :] - palette.astype(np.int32)[None, None, :, :]) ** 2).sum(axis=3)
            a[:, :, :3] = palette[dist.argmin(axis=2)]
            a[a[:, :, 3] == 0] = 0
            a[:, :, 3] = np.where(a[:, :, 3] > 0, 255, 0)
            frame = Image.new('RGBA', (56, 60))
            frame.paste(Image.fromarray(a), (x0, y0))
            frames.append(frame)
            frame_checks.append({'frame': i+1, 'bounds': list(frame.getbbox()),
                                 'sole_y': frame.getbbox()[3]-1})
        sheet = Image.new('RGBA', (448, 60))
        for i, frame in enumerate(frames):
            sheet.paste(frame, (i*56, 0))
        sheet.save(OUT / f'{hero}-idle-56x60-v3.png')
        # One fixed GIF palette for the entire animation, transparent index 0.
        gif_palette = [0, 0, 0] + palette.flatten().tolist()
        gif_palette += [0] * (768-len(gif_palette))
        gif_frames = []
        for frame in frames:
            a = np.array(frame)
            indices = np.zeros((60, 56), dtype=np.uint8)
            for n, color in enumerate(palette):
                indices[(a[:, :, :3] == color).all(axis=2) & (a[:, :, 3] == 255)] = n+1
            g = Image.fromarray(indices).convert('P')
            g.putpalette(gif_palette)
            gif_frames.append(g.resize((224, 240), Image.Resampling.NEAREST))
        durations = [360, 220, 140, 300, 180, 220, 360, 220]
        gif_frames[0].save(OUT / f'{hero}-idle-preview-v3.gif', save_all=True,
                           append_images=gif_frames[1:], duration=durations,
                           loop=0, transparency=0, disposal=2, optimize=False)
        draw.text((0, row*84+2), f'{hero}: walk 1 | idle 1-8', fill='#171c35')
        for i, frame in enumerate([ref] + frames):
            comparison.paste(frame, (i*56, row*84+20), frame)
            draw.line((i*56, row*84+77, (i+1)*56-1, row*84+77), fill='#3e7775')
        output = np.array(sheet)
        colors = set(map(tuple, output[output[:, :, 3] != 0, :3]))
        assert colors <= set(map(tuple, palette))
        assert all(f.getbbox() == box for f in frames)
        assert set(np.unique(output[:, :, 3])) <= {0, 255}
        gif = Image.open(OUT / f'{hero}-idle-preview-v3.gif')
        assert gif.n_frames == 8
        for i, frame in enumerate(frames):
            gif.seek(i)
            decoded = np.array(gif.convert('RGBA'))
            expected = np.array(frame.resize((224, 240), Image.Resampling.NEAREST))
            assert np.array_equal(decoded[:, :, 3], expected[:, :, 3])
            assert np.array_equal(decoded[decoded[:, :, 3] == 255],
                                  expected[expected[:, :, 3] == 255])
            assert gif.info['duration'] == durations[i]
        checks[hero] = {'action': action, 'reference': str(refpath.relative_to(ROOT)),
                       'reference_sha256': hashlib.sha256(refpath.read_bytes()).hexdigest(),
                       'reference_bounds': list(box), 'width': x1-x0, 'height': y1-y0,
                       'sheet_size': list(sheet.size), 'frames': frame_checks,
                       'palette': palette.tolist(),
                       'new_colors': 0, 'binary_alpha': True, 'gif_frames': 8,
                       'gif_pixels_match_native_4x': True,
                       'frame_durations_ms': durations,
                       'distinct_frames': len({f.tobytes() for f in frames})}
    comparison.save(REPORT / 'comparison-native.png')
    comparison.resize((1512, 1008), Image.Resampling.NEAREST).save(REPORT / 'comparison-3x.png')
    (REPORT / 'checks.json').write_text(json.dumps(checks, indent=2) + '\n')
    print(json.dumps({h: {'bounds': c['reference_bounds'], 'new_colors': c['new_colors'],
                          'distinct_frames': c['distinct_frames']} for h,c in checks.items()}, indent=2))


if __name__ == '__main__':
    export()
