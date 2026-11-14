"""Export painted road proposals. Does not write runtime assets or send telemetry."""
from pathlib import Path
import sys, json, importlib.util
sys.dont_write_bytecode = True
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).resolve().parent
OUT = ROOT/'deliver'
spec = importlib.util.spec_from_file_location('paint', ROOT.parent/'house-ground-floor/build.py')
paint = importlib.util.module_from_spec(spec)
spec.loader.exec_module(paint)
hero = Image.open(ROOT.parent/'house-ground-floor/reference/hero-56x60.png').convert('RGBA')
font = ImageFont.load_default()
pieces = []
for p in json.loads((ROOT/'plan.json').read_text()):
    source = Image.open(ROOT/'sources'/f"{p['id']}.png").convert('RGBA')
    w,h = p['size']; factor = 2 if w >= 512 else 4
    if p['id'].startswith('car-') or p['id'] in ('manhole','storm-drain'):
        box = source.getchannel('A').point(lambda a:255 if a>=128 else 0).getbbox()
        crop = source.crop(box)
        crop.thumbnail(((w-8)*factor,(h-8)*factor),Image.Resampling.LANCZOS)
        work = Image.new('RGBA',(w*factor,h*factor))
        work.alpha_composite(crop,((work.width-crop.width)//2,(work.height-crop.height)//2))
    else:
        box = (0,0,source.width,source.height)
        work = source.resize((w*factor,h*factor),Image.Resampling.LANCZOS)
    work.save(OUT/'working'/f"{p['id']}-{factor}x.png")
    art = paint.palette_map(paint.mode_reduce(work,w,h,factor),p)
    art.save(OUT/f"{p['id']}-v1.png")
    car = p['id'].startswith('car-')
    feet = art.getbbox()[3]-1
    piece = dict(p,file=f"{p['id']}-v1.png",kind='WALL' if car else 'WALK-THROUGH',feetLine=feet,footPoint=[w//2,feet],footprints=[[8,10,64,124]] if car else [],renderLayer='object' if car else 'ground',source=f"../sources/{p['id']}.png",sourceSize=list(source.size),sourceCrop=list(box),reductionFactor=factor,working=f"working/{p['id']}-{factor}x.png")
    comparison = Image.new('RGBA',(w+104,max(h,60)+32), '#FFF0CF')
    comparison.alpha_composite(art,(96,28))
    comparison.alpha_composite(hero,(8,comparison.height-60))
    ImageDraw.Draw(comparison).text((8,6),'HERO 1X / '+p['id'],fill='#171C35',font=font)
    piece['comparison1x'] = f"checks/{p['id']}-hero-1x.png"
    comparison.save(OUT/piece['comparison1x'])
    pieces.append(piece)
manifest = dict(status='Art proposals, awaiting approval. No runtime placement.',method='Built-in imagegen paintings fitted to exact 2x ground or 4x object working rasters, whole-number block-mode reduction, material-family palette mapping. Original painting dimensions vary and are recorded.',coordinates='Native pixels. Feet line y, foot point [x,y], footprints [x,y,width,height]. Proposed car footprints require runtime review.',pieces=pieces)
(OUT/'manifest-roads.json').write_text(json.dumps(manifest,indent=2)+'\n')
cards = ''.join(f'<article><h2>{p["id"]}</h2><p>{p["size"]} · {p["kind"]}</p><img src="{p["comparison1x"]}" width="{p["size"][0]+104}" alt="{p["id"]} at native size beside hero"></article>' for p in pieces)
(OUT/'review.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Maple Hollow road art review</title><link rel="stylesheet" href="../../../../../ui/ms-tokens.css"><style>body{background:var(--ms-text);color:var(--ms-surface);font-family:var(--ms-font-read)}article{overflow:auto;border-top:solid var(--ms-line);margin-block:var(--ms-space-6)}img{max-width:none;image-rendering:pixelated}p{font-size:var(--ms-body)}</style><h1>Roads: native art review</h1><p><strong>Connection widths remain unresolved. Art proposals only, not ready for placement.</strong> See <a href="checks/export-checks.json">the export and edge report</a>. Export PASS does not certify road seams.</p><p>Approval required. Each image is shown at 1x beside the 56x60 hero. On phones, scroll sideways to preserve native scale. Proposed footprints are in the manifest. Roads contain no solid props.</p><p>Compare asphalt, curb and light direction with <a href="../../street/street-wide-v4-a.png">the approved east-west plate</a>. Review each junction orientation and seam before placement.</p>'+cards+'</html>')
print('Exported',len(pieces),'pieces')
