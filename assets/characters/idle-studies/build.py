"""Prepare painted idle studies against each current walk sheet's first cell.

Art-only exports. No runtime files are loaded or modified.
"""
from pathlib import Path
import colorsys
import hashlib
import json
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'deliver'
OUT.mkdir(exist_ok=True)
PLAN = json.loads((ROOT / 'generation.json').read_text())


def clean(image):
    a = np.array(image.convert('RGBA'))
    magenta = (a[:, :, 0] > 220) & (a[:, :, 1] < 50) & (a[:, :, 2] > 220)
    a[(a[:, :, 3] < 128) | magenta] = 0
    a[a[:, :, 3] >= 128, 3] = 255
    return Image.fromarray(a)


def palette_map(image, palette, hero, offset):
    """Select a material family before choosing its nearest existing shade."""
    families = {
        'dark': ['171c35', '303750'],
        'slate': ['171c35', '303750', '526078', '83a89a'],
        'teal': ['303750', '3e7775', '83a89a'],
        'lavender': ['303750', '526078', 'bfa8cf', 'fff0cf'],
        'cream': ['a88b70', 'd3b78d', 'f2d7a1', 'fff0cf'],
        'coffee': ['874c3b', 'b97a58', 'ef9347', 'f2d7a1'],
        'earth': ['70402f', '874c3b', 'a88b70', 'b97a58', 'c45c4b', 'd3b78d', 'e5a995', 'f2d7a1', 'fff0cf'],
    }
    permitted = set(palette)
    families = {k: np.array([tuple(bytes.fromhex(h)) for h in values if tuple(bytes.fromhex(h)) in permitted]) for k, values in families.items()}
    a = np.array(image)
    colors, inv = np.unique(a.reshape(-1, 4), axis=0, return_inverse=True)
    mapped = colors.copy()
    for i, (r, g, b, alpha) in enumerate(colors):
        if not alpha:
            mapped[i] = 0
            continue
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if v < .24:
            family = 'dark'
        elif .45 < h < .72:
            family = 'slate'
        elif .20 < h <= .45:
            family = 'teal'
        elif .65 < h < .90 and s > .08:
            family = 'lavender'
        elif s < .18:
            family = 'cream' if v > .65 else 'slate'
        elif .055 < h < .12 and s > .60 and v > .72:
            family = 'coffee'
        else:
            family = 'earth'
        candidates = families[family]
        mapped[i, :3] = candidates[np.argmin(((candidates.astype(float) - [r, g, b]) ** 2).sum(axis=1))]
    result = mapped[inv].reshape(a.shape)
    yy, xx = np.indices(a.shape[:2]);xx += offset[0];yy += offset[1]
    # Position identifies the garment as well as its color. Dad's blue-green
    # polo must stay teal; office trousers and Dad's shorts must stay khaki.
    garment_masks = []
    cool = (a[:, :, 1].astype(int) > a[:, :, 0].astype(int) + 5) & (a[:, :, 2] > a[:, :, 0])
    warm = (a[:, :, 0].astype(int) > a[:, :, 1].astype(int) + 5) & (a[:, :, 1] > a[:, :, 2])
    if hero == 'soccer-dad':
        garment_masks.append((cool & (yy >= 23) & (yy <= 36), ['171c35','303750','3e7775','83a89a']))
        garment_masks.append((warm & (yy >= 37) & (yy <= 44) & (xx >= 19) & (xx <= 38), ['70402f','a88b70','d3b78d','f2d7a1']))
    if hero == 'office-worker':
        garment_masks.append((warm & (yy >= 35) & (yy <= 50) & (xx >= 20) & (xx <= 37), ['70402f','a88b70','d3b78d','f2d7a1']))
    for mask, shades in garment_masks:
        shades = np.array([tuple(bytes.fromhex(h)) for h in shades if tuple(bytes.fromhex(h)) in permitted])
        mask &= a[:, :, 3] > 0
        values = a[:, :, :3][mask].astype(float)
        result[mask, :3] = shades[((values[:, None, :] - shades[None, :, :]) ** 2).sum(axis=2).argmin(axis=1)]
    return Image.fromarray(result)


reports = []
for p in PLAN:
    reference_path = ROOT / p['reference']
    reference = clean(Image.open(reference_path).crop((0, 0, 56, 60)))
    bounds = reference.getbbox()
    left, top, right, bottom = bounds
    walk = np.array(clean(Image.open(reference_path)))
    palette = sorted(set(map(tuple, walk[:, :, :3][walk[:, :, 3] > 0])))
    source = Image.open(ROOT / p['source']).convert('RGBA')
    frames, crops = [], []
    for i in range(8):
        col, row = i % 4, i // 4
        cell = clean(source.crop((round(col * source.width / 4), round(row * source.height / 2), round((col + 1) * source.width / 4), round((row + 1) * source.height / 2))))
        box = cell.getbbox()
        crops.append(list(box))
        # User-requested width and height correction is baked into native pixels.
        # No runtime scaling; nearest sampling keeps painted clusters hard-edged.
        fitted = cell.crop(box).resize((right - left, bottom - top), Image.Resampling.NEAREST)
        frame = Image.new('RGBA', (56, 60))
        frame.paste(palette_map(fitted, palette, p['id'], (left,top)), (left, top))
        frames.append(frame)
    # The idle has planted legs. Retain the first painted pose's legs and shoes
    # in every cell rather than allowing sampling variation to make them jitter.
    lower = frames[0].crop((0, 43, 56, 60))
    for frame in frames:
        frame.paste(lower, (0, 43))
    frames[7] = frames[0].copy()
    strip = Image.new('RGBA', (448, 60))
    for i, frame in enumerate(frames):
        strip.paste(frame, (i * 56, 0))
    filename = p['id'] + '-idle-56x60-study.png'
    strip.save(OUT / filename)
    reference.save(OUT / (p['id'] + '-walk-frame1.png'))
    # One fixed GIF palette prevents frame-to-frame color-table flicker.
    gif_palette = [23, 28, 53] + [c for color in palette for c in color]
    gif_palette += [0] * (768 - len(gif_palette))
    gif_frames = []
    for frame in frames:
        a = np.array(frame)
        indices = np.zeros((60, 56), dtype=np.uint8)
        for index, color in enumerate(palette, 1):
            indices[np.all(a[:, :, :3] == color, axis=2) & (a[:, :, 3] > 0)] = index
        gif = Image.fromarray(indices, 'P')
        gif.putpalette(gif_palette)
        gif_frames.append(gif.resize((224, 240), Image.Resampling.NEAREST))
    gif_frames[0].save(OUT / (p['id'] + '-idle-4x.gif'), save_all=True, append_images=gif_frames[1:], duration=p['durationsMs'], loop=0, transparency=0, disposal=2, optimize=False)
    comparison = Image.new('RGBA', (56 * 9, 84), '#526078')
    draw = ImageDraw.Draw(comparison)
    draw.text((2, 2), 'WALK 1', fill='#FFF0CF')
    comparison.alpha_composite(reference, (0, 20))
    draw.line((0, 20 + bottom - 1, comparison.width - 1, 20 + bottom - 1), fill='#83A89A')
    for i, frame in enumerate(frames):
        draw.text(((i + 1) * 56 + 2, 2), f'IDLE {i + 1}', fill='#FFF0CF')
        comparison.alpha_composite(frame, ((i + 1) * 56, 20))
    comparison.save(OUT / (p['id'] + '-comparison-1x.png'))
    comparison.resize((comparison.width * 4, comparison.height * 4), Image.Resampling.NEAREST).save(OUT / (p['id'] + '-comparison-4x.png'))
    report = dict(id=p['id'], action=p['action'], file=filename, cell=[56, 60], grid=[8, 1], frames=8,
                  reference=p['reference'], referenceSha256=hashlib.sha256(reference_path.read_bytes()).hexdigest(),
                  targetBounds=list(bounds), targetWidth=right-left, targetHeight=bottom-top, soleLine=bottom-1,
                  palette=['#' + bytes(color).hex().upper() for color in palette], sourceCrops=crops,
                  durationsMs=p['durationsMs'], frameChecks=[])
    for i, frame in enumerate(frames):
        a = np.array(frame)
        used = set(map(tuple, a[:, :, :3][a[:, :, 3] > 0]))
        report['frameChecks'].append(dict(frame=i+1, bounds=list(frame.getbbox()), matchesWalkBounds=frame.getbbox() == bounds,
                                         offPalette=len(used-set(palette)), binaryAlpha=set(a[:, :, 3].ravel()).issubset({0,255}),
                                         plantedFeet=np.array_equal(a[43:], np.array(frames[0])[43:])))
    report['passed'] = all(c['matchesWalkBounds'] and c['offPalette']==0 and c['binaryAlpha'] and c['plantedFeet'] for c in report['frameChecks'])
    reports.append(report)

(OUT / 'validation.json').write_text(json.dumps(dict(passed=all(p['passed'] for p in reports), heroes=reports), indent=2) + '\n')
assert all(p['passed'] for p in reports), 'Native bounds, palette or planted feet failed'
print('PASS: four heroes, 32 cells, exact walk-frame-1 bounds and sole lines, existing palettes only, planted feet.')

names = {'office-worker':'9-to-5er', 'soccer-dad':'Soccer Dad', 'grad-student':'Grad Student', 'cold-war-cowboy':'Coldwar Cowboy'}
html = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hero idle scale studies</title>
<link rel="stylesheet" href="../../../ui/ms-tokens.css"><style>
body{margin:0;background:var(--ms-bg);color:var(--ms-text);font:var(--ms-body)/1.5 var(--ms-font-read)}main{padding:var(--ms-space-5);max-width:70rem;margin:auto}h1{font-size:var(--ms-headline)}h2{font-size:var(--ms-title)}a{color:var(--ms-text);display:inline-flex;align-items:center;min-height:var(--ms-touch)}article{border-top:var(--ms-border-w) solid var(--ms-line);padding:var(--ms-space-4) 0}figure{margin:0;overflow:auto}img{image-rendering:pixelated}.pair{display:flex;flex-wrap:wrap;gap:var(--ms-space-4)}.pair img{width:224px;height:240px;background:#526078}figcaption{padding:var(--ms-space-2) 0}button{font:inherit;min-height:var(--ms-touch)}
</style><main><h1>Hero idle scale studies</h1><p>Eight frames per hero, 56×60 cells. Walk frame 1 sets each figure’s height, width and sole line. Art review only; nothing placed in the game.</p><p><a href="validation.json">Bounds and palette checks</a> · <a href="../generation.json">Painting directions</a> · <a href="../README.md">Notes</a></p><p>Left: current walk frame 1. Right: new idle at the same exact 4× display scale. The walk pose has a raised foot; the idle keeps both feet planted. The sole line stays y56.</p>'''
for p, report in zip(PLAN, reports):
    id = p['id']
    html += f'''<article><h2>{names[id]}: {p['action']}</h2><p>{report['targetWidth']} px wide × {report['targetHeight']} px tall; sole y{report['soleLine']}. Only colors from this hero’s current walk sheet.</p><div class="pair"><figure><img src="{id}-walk-frame1.png" alt="{names[id]} current walk frame 1"><figcaption>Current walk frame 1</figcaption></figure><figure><img src="{id}-idle-4x.gif" alt="{names[id]} eight-frame {p['action']} loop"><figcaption>New idle loop, exact 4×</figcaption></figure></div><p><a href="{report['file']}">Native 448×60 sheet</a> · <a href="{id}-comparison-4x.png">All eight beside walk frame 1 at 4×</a></p><figure><img src="{id}-comparison-1x.png" alt="All eight idle frames and current walk frame 1, unscaled"><figcaption>Native 1× comparison; horizontal scroll on narrow screens. Sage line marks shoe contact.</figcaption></figure></article>'''
(OUT / 'review.html').write_text(html + '</main></html>')
