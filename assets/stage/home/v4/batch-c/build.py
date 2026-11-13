"""Art-only postprocessing. Paintings come from built-in imagegen, never code shapes.
Run: python build.py --repo /path/to/Midlife-Survivors
Requires Pillow and NumPy. Sources, specs and reference images are local to this file.
"""
from pathlib import Path
import argparse, json, colorsys, hashlib, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
OUT = ROOT / 'deliver'
APPROVED={'string-light-posts','string-light-strand','cabbage-bed'}
BASELINE=json.loads((ROOT/'reference/first-review-manifest.json').read_text())
BASE_PIECES={p['id']:p for p in BASELINE['pieces']}
APPROVED_HASHES=json.loads((ROOT/'reference/approved-sha256.json').read_text())['files']
PALETTE = json.loads((ROOT/'reference/palette-batch-b.json').read_text())['palette']
RGB = np.array([tuple(bytes.fromhex(c[1:])) for c in PALETTE],dtype=np.uint8)
# id, w, h, kind, yard cell, source rectangle in that 416x448 cell.
SPECS = [
('autumn-shrub-a',80,64,'WALL',0,[10,8,92,74]),
('autumn-shrub-b',88,56,'WALL',2,[291,8,382,67]),
('autumn-shrub-c',80,64,'WALL',5,[5,351,95,431]),
('white-flowers-a',48,48,'WALK-THROUGH',0,[22,210,82,281]),
('white-flowers-b',48,48,'WALK-THROUGH',4,[312,318,383,387]),
('string-light-posts',160,64,'WALL',2,[46,54,204,160]),
('string-light-strand',160,64,'WALK-THROUGH',2,[49,56,201,108]),
('cooler',64,56,'BREAKABLE',2,[37,290,112,356]),
('cornhole-board-a',64,56,'WALK-THROUGH',2,[232,270,306,333]),
('cornhole-board-b',64,56,'WALK-THROUGH',2,[293,296,371,363]),
('tarp-lumber',112,104,'WALL',3,[252,73,389,192]),
('worn-lawn-chair',72,96,'WALL',3,[33,89,143,213]),
('weeds-a',48,64,'WALK-THROUGH',3,[126,88,187,174]),
('weeds-b',48,64,'WALK-THROUGH',3,[227,79,282,163]),
('weeds-c',48,64,'WALK-THROUGH',3,[242,334,301,417]),
('pergola-roof',160,80,'WALK-THROUGH',4,[222,14,389,100]),
('pergola-posts',160,136,'WALL',4,[223,47,393,191]),
('pergola-chair',48,64,'WALL',4,[241,95,286,160]),
('pergola-table',32,48,'WALL',4,[283,104,314,164]),
('boxwood-hedge',88,56,'WALL',4,[81,378,173,436]),
('sheet-ghost-a',128,80,'BREAKABLE',5,[28,160,173,242]),
('sheet-ghost-b',128,80,'BREAKABLE',5,[260,234,400,315]),
('halloween-lamp',40,120,'WALL',5,[33,78,83,201]),
('halloween-bunting',208,48,'WALK-THROUGH',5,[96,45,318,107]),
('fog-machine',56,48,'BREAKABLE',5,[30,281,97,344]),
('fog-puff-small',72,32,'WALK-THROUGH',5,[85,287,161,322]),
('fog-puff-large',112,56,'WALK-THROUGH',5,[73,256,191,324]),
('beach-ball',40,40,'WALK-THROUGH',0,[294,233,343,280]),
('toy-car',56,40,'WALK-THROUGH',0,[87,337,151,386]),
('cabbage-bed',128,80,'WALL',1,[58,240,174,361]),
]
YARDS=['Young family','Retirees','Grill master','Fixer-upper','HOA president','Halloween']

def reduce_mode(im,w,h):
    a=np.array(im,dtype=np.uint8)
    # Pack RGBA; transparent color is normalized before mode so invisible RGB
    # cannot split the background vote. Every output uses one exact 8x8 block.
    a[a[:,:,3]==0]=0
    packed=(a[:,:,0].astype(np.uint32)<<24)|(a[:,:,1].astype(np.uint32)<<16)|(a[:,:,2].astype(np.uint32)<<8)|a[:,:,3]
    blocks=packed.reshape(h,8,w,8).transpose(0,2,1,3).reshape(h*w,64)
    result=np.empty(h*w,dtype=np.uint32)
    for i,b in enumerate(blocks):
        vals,counts=np.unique(b,return_counts=True)
        result[i]=vals[np.argmax(counts)]
    result=result.reshape(h,w)
    return np.stack([(result>>24)&255,(result>>16)&255,(result>>8)&255,result&255],axis=-1).astype(np.uint8)

def material_palette(a,id):
    # Material masks select a palette family FIRST. Color distance only chooses
    # a tone inside that named material family, never across the full palette.
    result=a.copy()
    for color in np.unique(a.reshape(-1,4),axis=0):
        r,g,b,alpha=map(int,color)
        if not alpha: continue
        hue,sat,value=colorsys.rgb_to_hsv(r/255,g/255,b/255)
        if value<.22: family=[0,1]
        elif id.startswith('fog-puff'): family=[4,7,8,14]
        elif .19<hue<.48 and sat>.16: family=[17,18,19]
        elif .48<=hue<.59 and sat>.2: family=[1,2,3,4]
        elif .59<=hue<.73 and value<.7: family=[0,1,2]
        elif .70<hue<.90 and sat>.13: family=[1,2,14]
        elif .90<=hue and value>.55 and sat<.55: family=[10,12,13]
        elif sat<.24 and value<.58: family=[0,1,2,5]
        elif sat<.35 or (value>.72 and sat<.48): family=[5,6,7,8]
        elif id.startswith('sheet-ghost'): family=[5,6,7,8]
        elif hue<.20 or hue>.90:
            if id in ['tarp-lumber','worn-lawn-chair','cabbage-bed','pergola-posts','pergola-roof','pergola-table','pergola-chair','string-light-posts'] and value<.65: family=[5,6,9,15,16]
            else: family=[9,10,11,15,16,20]
        else: family=[0,1,2,4,5,6,7,8]
        options=RGB[family].astype(float)
        idx=family[int(np.argmin(np.sum((options-np.array([r,g,b]))**2,axis=1)))]
        if id.startswith('fog-puff'): idx=14 if alpha<120 else (7 if alpha<235 else 8)
        mask=np.all(a==color,axis=-1)
        result[mask,:3]=RGB[idx]
        if id.startswith('fog-puff'): result[mask,3]=round(alpha*.60)
        else: result[mask,3]=255 if alpha>=128 else 0
    result[result[:,:,3]==0]=0
    return Image.fromarray(result)

def footprint(id,w,h,bounds):
    l,t,r,b=bounds
    if id=='string-light-posts': return [[l+2,b-9,8,7],[r-12,b-9,8,7]]
    if id=='pergola-posts': return [[8,60,9,7],[142,60,9,7],[13,122,9,8],[139,122,9,8]]
    prior=BASE_PIECES[id]
    bl,bt,br,bb=prior['visibleBounds']
    sx=(r-l)/(br-bl);sy=(b-t)/(bb-bt)
    return [[round(l+(x-bl)*sx),round(t+(y-bt)*sy),max(1,round(fw*sx)),max(1,round(fh*sy))]
            for x,y,fw,fh in prior['footprints']]

def panel(old,new,hero):
    width=max(390,old.width+new.width+hero.width+72)
    height=max(old.height,new.height,hero.height)+44
    im=Image.new('RGB',(width,height),'#171C35');d=ImageDraw.Draw(im)
    x=12
    for label,art in [('PAINTED YARD',old),('BATCH C 1X',new),('HERO 48PX',hero)]:
        d.text((x,8),label,fill='#FFF0CF')
        im.paste(art,(x,height-12-art.height),art if art.mode=='RGBA' else None)
        x+=max(art.width,90)+18
    return im

def build(repo):
    for d in ['sources','working-8x','old','checks','reference']: (OUT/d).mkdir(parents=True,exist_ok=True)
    yard_path=repo/'assets/stage/home/v2/backyards-v2.png'
    yard=Image.open(yard_path).convert('RGBA')
    hero=Image.open(repo/'assets/characters/office-worker-walk-56x60-v4.png').convert('RGBA').crop((0,0,56,60))
    # The requested comparison standard is 48px tall. This reference thumbnail
    # is explicitly labeled; exported game art is never rescaled here.
    hero=hero.crop(hero.getbbox());hero=hero.resize((round(hero.width*48/hero.height),48),Image.Resampling.NEAREST)
    hero.save(OUT/'reference/hero-48px.png')
    shutil.copy2(yard_path,OUT/'reference/backyards-v2.png')
    chair=ROOT/'reference/wicker-chair.png'
    if not chair.exists(): chair=ROOT/'reference/batch-b-wicker-chair.png'
    shutil.copy2(chair,OUT/'reference/batch-b-wicker-chair.png')
    shutil.copy2(ROOT/'reference/palette-batch-b.json',OUT/'reference/palette-batch-b.json')
    pieces=[]
    for id,w,h,kind,cell,rect in SPECS:
        source=ROOT/'sources'/f'{id}.png'
        if not source.exists(): continue
        im=Image.open(source).convert('RGBA')
        # Generated alpha can contain near-invisible dust across the canvas.
        # Crop by meaningful coverage, retaining the untouched original source.
        threshold=8 if id.startswith('fog-puff') else 128
        bounds=im.getchannel('A').point(lambda v:255 if v>=threshold else 0).getbbox()
        cut=im.crop(bounds)
        margin=3 if id in APPROVED else 2
        if id in ['string-light-posts','string-light-strand']: margin=2
        scale=min((w-2*margin)*8/cut.width,(h-2*margin)*8/cut.height)
        fit=[round(cut.width*scale),round(cut.height*scale)]
        if id in ['sheet-ghost-a','sheet-ghost-b','toy-car','weeds-a','weeds-b','weeds-c']:
            fit=[(w-2*margin)*8,(h-2*margin)*8]
        fitted=cut.resize(fit,Image.Resampling.LANCZOS)
        working=Image.new('RGBA',(w*8,h*8))
        x=(w*8-fit[0])//2;y=(h*8-fit[1])//2
        if id=='pergola-roof': y=24
        working.paste(fitted,(x,y))
        components=[]
        if id=='pergola-posts':
            # Reposition four isolated PAINTED supports to meet the separate
            # canopy corners. This composes paint, it draws no geometric art.
            working=Image.new('RGBA',(w*8,h*8))
            crops=[[264,95,390,475],[971,95,1102,475],[80,401,264,1122],[1116,401,1298,1122]]
            positions=[[8,8,10,59],[142,8,10,59],[12,62,12,68],[136,62,12,68]]
            for crop,position in zip(crops,positions):
                px,py,pw,ph=position
                component=im.crop(crop)
                component=component.crop(component.getchannel('A').point(lambda v:255 if v>=128 else 0).getbbox())
                component=component.resize((pw*8,ph*8),Image.Resampling.LANCZOS)
                working.paste(component,(px*8,py*8))
                components.append({'sourceCrop':crop,'fitNative':position})
        working.save(OUT/'working-8x'/f'{id}-8x.png')
        final=material_palette(reduce_mode(working,w,h),id)
        final.save(OUT/f'{id}-v4.png')
        shutil.copy2(source,OUT/'sources'/source.name)
        crop=[rect[0]+cell*416,rect[1],rect[2]+cell*416,rect[3]]
        old=yard.crop(crop);old.save(OUT/'old'/f'{id}.png')
        comparison=panel(old,final,hero);comparison.save(OUT/'checks'/f'{id}-1x.png')
        comparison.resize((comparison.width*4,comparison.height*4),Image.Resampling.NEAREST).save(OUT/'checks'/f'{id}-4x.png')
        is_overhead=id in ['pergola-roof','string-light-strand','halloween-bunting']
        native_bounds=final.getbbox()
        p={'id':id,'file':f'{id}-v4.png','size':[w,h],'kind':kind,'footPoint':[w//2,native_bounds[3]-2],
           'visibleBounds':list(native_bounds),
           'footprints':[] if kind=='WALK-THROUGH' else footprint(id,w,h,native_bounds),
           'drawLayer':'overhead' if is_overhead else 'depth-sorted','blocks':kind!='WALK-THROUGH',
           'source':f'sources/{id}.png','sourceSize':list(im.size),'sourceCrop':list(bounds),
           'working':f'working-8x/{id}-8x.png','workingSize':[w*8,h*8],
           'fit':[x,y,*fit],'sourceFit':('silhouette refit in both axes' if id in ['sheet-ghost-a','sheet-ghost-b','toy-car','weeds-a','weeds-b','weeds-c'] else 'proportional fit'), 'palettePolicy':'HSV material masks, nearest tone only within selected material family',
           'oldFile':f'old/{id}.png','referenceYard':YARDS[cell],'referenceCrop':crop,
           'comparison1x':f'checks/{id}-1x.png','comparison4x':f'checks/{id}-4x.png'}
        if is_overhead: p['kindNote']='WALK-THROUGH denotes no floor collision; this is an overhead layer, not a ground decal.'
        if components: p['paintedComponents']=components
        if id.startswith('fog-puff'): p['alphaPolicy']='Generated coverage scaled to 60% opacity for soft mist; RGB mapped to three cream/lavender tones by coverage.'
        pieces.append(p)
    manifest={'status':'Batch C size revision for PR #6; awaiting art approval; not integrated','palette':PALETTE,
       'method':'Built-in imagegen paintings refitted onto exact 8x working canvases; exact 8x8 RGBA block mode; material-family palette mapping. Ghost cloth, weed silhouettes and toy vehicle refitted in both axes; pergola uses four painted support crops.',
       'sourceSizeCaveat':'Generator returns variable raster dimensions. Original paintings and fit rectangles are retained, following approved Batch B normalization.',
       'coordinates':'footPoint [x,y] and footprints [x,y,width,height] are local native pixels; proposed integration metadata, not tested collision bodies.',
       'heroReference':'Office worker live v4 frame, cropped and nearest-resized to exactly 48px tall solely for comparison; live source visible bounds are 36x53.',
       'retireesChair':{'decision':'Reuse Batch B wicker-chair-v4.png; its pink cushions match the painted yard. No replacement painted.',
       'sourceBranch':'codex/level-art-redo-batch-b','sourceFile':'assets/stage/home/v4/batch-b/wicker-chair-v4.png','size':[64,72]},
       'pieces':pieces}
    manifest['assemblies']={
       'pergola':{'size':[160,136],'layersBackToFront':[
           {'id':'pergola-posts','position':[0,0]},
           {'id':'pergola-chair','position':[20,55]},
           {'id':'pergola-chair','position':[92,55]},
           {'id':'pergola-table','position':[64,63]},
           {'id':'pergola-roof','position':[0,0]}],
           'note':'Two chair instances, one table. Keep all furniture footprints; roof has none. Rear/front supports need separate depth sorting at integration.'},
       'string-lights':{'size':[160,64],'layersBackToFront':[
           {'id':'string-light-posts','position':[0,0]},
           {'id':'string-light-strand','position':[0,-15]}],
           'note':'Wire endpoints meet post tops; only two small post bases collide.'},
       'halloween-lamps':{'size':[220,136],'layersBackToFront':[
           {'id':'halloween-lamp','position':[0,16]},
           {'id':'halloween-lamp','position':[180,16]},
           {'id':'halloween-bunting','position':[6,16]}],
           'note':'Two lamp instances; bunting is nonblocking overhead decoration.'}}
    for name,assembly in manifest['assemblies'].items():
        canvas=Image.new('RGBA',tuple(assembly['size']))
        for layer in assembly['layersBackToFront']:
            filename=OUT/f"{layer['id']}-v4.png"
            if filename.exists(): canvas.alpha_composite(Image.open(filename).convert('RGBA'),tuple(layer['position']))
        canvas.save(OUT/'checks'/f'assembled-{name}-1x.png')
        canvas.resize((canvas.width*4,canvas.height*4),Image.Resampling.NEAREST).save(OUT/'checks'/f'assembled-{name}-4x.png')
    manifest['revision']={'brief':'reference/revision-brief.md','approvedUnchanged':sorted(APPROVED),'repainted':['tarp-lumber'],'bunting':'Reuse the earlier painted larger-pennant study at revised size; not the thin-flag version.'}
    shutil.copy2(ROOT/'reference/first-review-manifest.json',OUT/'reference/first-review-manifest.json')
    shutil.copy2(ROOT/'reference/revision-brief.md',OUT/'reference/revision-brief.md')
    (OUT/'manifest-batch-c.json').write_text(json.dumps(manifest,indent=2)+'\n')
    shutil.copy2(ROOT/'reference/approved-sha256.json',OUT/'reference/approved-sha256.json')
    report=[]
    for piece in pieces:
        prior=BASE_PIECES[piece['id']];b=piece['visibleBounds'];o=prior['visibleBounds']
        report.append({'id':piece['id'],'beforeCanvas':prior['size'],'targetCanvas':piece['size'],'beforePaintedSize':[o[2]-o[0],o[3]-o[1]],'revisedPaintedSize':[b[2]-b[0],b[3]-b[1]],'sourceFit':piece['sourceFit'],'footprints':piece['footprints']})
    (OUT/'revision-size-report.json').write_text(json.dumps(report,indent=2)+'\n')
    validate(manifest)
    review(manifest)
    print(f'Built {len(pieces)}/{len(SPECS)} pieces in {OUT}')

def validate(m):
    checks=[]
    palette=set(tuple(c) for c in RGB.tolist())
    for p in m['pieces']:
        im=Image.open(OUT/p['file']).convert('RGBA');a=np.array(im);visible=a[:,:,3]>0
        working=Image.open(OUT/p['working']).convert('RGBA')
        w,h=p['size']
        c={'id':p['id'],'size':im.size==(w,h),'working8x':working.size==(w*8,h*8),
           'palette':set(map(tuple,a[:,:,:3][visible].tolist())).issubset(palette),
           'transparentBorder':bool(np.all(a[0,:,3]==0) and np.all(a[-1,:,3]==0) and np.all(a[:,0,3]==0) and np.all(a[:,-1,3]==0)),
           'footPointInside':0<=p['footPoint'][0]<w and 0<=p['footPoint'][1]<h,
           'footprintsInside':all(x>=0 and y>=0 and fw>0 and fh>0 and x+fw<=w and y+fh<=h for x,y,fw,fh in p['footprints']),
           'nonblockingHasNoFootprints':bool(p['footprints']) if p['blocks'] else not p['footprints'],
           'exactModeReproducible':np.array_equal(np.array(material_palette(reduce_mode(working,w,h),p['id'])),a),
           'approvedWorkingUnchanged':(hashlib.sha256((OUT/p['working']).read_bytes()).hexdigest()==APPROVED_HASHES[p['working']]) if p['id'] in APPROVED else True,
           'approvedUnchanged':(hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()==APPROVED_HASHES[p['file']]) if p['id'] in APPROVED else True,
           'visibleColors':len(set(map(tuple,a[:,:,:3][visible].tolist()))),
           'sha256':hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()}
        checks.append(c)
    (OUT/'validation-batch-c.json').write_text(json.dumps({'expectedPieces':len(SPECS),'actualPieces':len(checks),'complete':len(checks)==len(SPECS),'approvedAssetsUnchanged':all(hashlib.sha256((OUT/f).read_bytes()).hexdigest()==sha for f,sha in APPROVED_HASHES.items()),'checks':checks},indent=2)+'\n')

def review(m):
    cards=[]
    for p in m['pieces']:
        cards.append(f'''<article><h2>{p['id']}</h2><p>{p['kind']} · {p['size'][0]} × {p['size'][1]} · {p['referenceYard']}</p><img class="comparison" src="{p['comparison1x']}" alt="Painted yard subject, Batch C native sprite and 48px hero"><p><a href="{p['comparison4x']}">Inspect at 4x</a> · <a href="{p['file']}">Sprite PNG</a></p></article>''')
    page='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Maple Hollow · Batch C review</title><link rel="stylesheet" href="../../../../ui/ms-tokens.css"><style>body{margin:0;background:var(--ms-navy,#171C35);color:var(--ms-cream,#FFF0CF);font:16px/1.5 system-ui}main{max-width:1100px;margin:auto;padding:24px}h1{font-size:28px}h2{font-size:20px}article{padding:16px 0;border-top:1px solid #526078}a{color:#FFF0CF;display:inline-block;padding:8px 0;min-height:28px}.comparison{display:block;max-width:none;image-rendering:pixelated}article{overflow-x:auto}button{font:inherit;padding:12px;background:#FFF0CF;color:#171C35;border:0}.zoom .comparison{width:auto;transform:none}figure{margin:0;overflow:auto}figure img{image-rendering:pixelated}small{font-size:14px}</style><main><h1>Maple Hollow yard character · Batch C</h1><p>Revised to match the sizes in today’s painted yards. Art approval comes before game placement.</p><p>Approved string lights and cabbage bed are unchanged. Upright pallets, a green tarp and a bucket replace the firewood pile.</p><p>Every strip shows the original yard subject, the new sprite at native 1x, and the hero at 48px tall. The yard crop keeps its original scale and surroundings. Use the 4x links for details.</p><p>WALL: outline and shadow. BREAKABLE: cream top highlight. WALK-THROUGH: no floor collision. Wires, bunting and pergola roof are overhead layers.</p><p><a href="manifest-batch-c.json">Manifest</a> · <a href="validation-batch-c.json">Validation</a> · <a href="README.md">Method and placement notes</a> · <a href="revision-size-report.json">Before and revised sizes</a></p><h2>Retirees: keep Batch B’s pink chair</h2><p>The approved wicker chair already has pink cushions. Reuse it; only the cabbage bed is new.</p><figure><img src="reference/batch-b-wicker-chair.png" alt="Approved pink cushioned wicker chair"></figure>'''+''.join(cards)+'''<p>Footprints are proposed art metadata. Navigation and draw order require Claude’s integration checks after approval.</p></main></html>'''
    style='''body{margin:0;background:var(--ms-bg);color:var(--ms-text);font:var(--ms-body)/1.5 var(--ms-font-read)}main{max-width:calc(var(--ms-space-7)*24);margin:auto;padding:var(--ms-space-5)}h1{font-size:var(--ms-headline)}h2{font-size:var(--ms-title)}article{padding:var(--ms-space-4) 0;border-top:var(--ms-border-w) solid var(--ms-line);overflow-x:auto}a{color:var(--ms-text);display:inline-flex;align-items:center;min-height:var(--ms-touch)}.comparison{display:block;max-width:none;image-rendering:pixelated}figure{margin:0;overflow:auto}img{image-rendering:pixelated}small{font-size:var(--ms-body-s)}'''
    start=page.index('<style>');end=page.index('</style>')
    page=page[:start]+'<style>'+style+'</style>'+page[end+8:]
    assemblies='<h2>Separate layers, assembled at 1x</h2><p>Roof and hanging decorations have no collision. Posts and furniture keep their own footprints.</p>'
    for name in m['assemblies']:
        assemblies+=f'<figure><figcaption>{name}</figcaption><img src="checks/assembled-{name}-1x.png" alt="{name} assembled at native size"><p><a href="checks/assembled-{name}-4x.png">Inspect assembled {name} at 4x</a></p></figure>'
    page=page.replace('<h2>Retirees:',assemblies+'<h2>Retirees:')
    (OUT/'review.html').write_text(page)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--repo',type=Path,required=True)
    args=parser.parse_args();build(args.repo)
