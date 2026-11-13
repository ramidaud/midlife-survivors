"""Prepare painted Town Buildings assets. No world artwork is drawn by code.
Run: python prepare.py. Requires Pillow and NumPy. Outputs a fresh deliver/ folder.
"""
import os
from build import *

def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()

def footprints(id,box):
    l,t,r,b=box;w=r-l;h=b-t
    if id in FLOORS or id in OVERHEAD:return []
    if id=='mall-light-pole':return [[32-8,b-14,16,10]]
    if 'car-' in id:return [[l+5,t+11,w-10,h-20]]
    if 'food-truck' in id:return [[l+7,t+14,w-14,h-26]]
    if id=='community-hall':return [[l+14,b-92,w-28,88]]
    if id.endswith('-front'):
        depth=max(24,round(h*.14));return [[l+10,b-depth-4,w-20,depth]]
    if id=='mall-curb-island':return [[l+round(w*.14),b-round(h*.20)-4,round(w*.72),round(h*.20)]]
    if id=='mall-cart-corral':return [[l+8,b-round(h*.36)-4,w-16,round(h*.36)]]
    if id=='square-fountain':return [[l+round(w*.10),b-round(h*.35)-4,round(w*.8),round(h*.35)]]
    if id=='community-bounce-house':return [[l+12,b-round(h*.35)-4,w-24,round(h*.35)]]
    if id=='square-grind-rail':return [[l+8,b-18,w-16,14]]
    depth=max(8,round(h*.20));inset=max(4,round(w*.06))
    return [[l+inset,b-depth-4,w-2*inset,depth]]

def comparison(p,art,hero):
    width=max(420,art.width+124);height=max(art.height,60)+72
    bg='#526078' if p['id'] in ASPHALT else '#9BAE73'
    im=Image.new('RGB',(width,height),bg);d=ImageDraw.Draw(im);font=ImageFont.load_default(size=14)
    ink='#FFF0CF' if p['id'] in ASPHALT else '#171C35'
    d.text((12,6),p['id'],fill=ink,font=font);d.text((12,28),'HERO 56x60',fill=ink,font=font);d.text((112,28),'ART 1X',fill=ink,font=font)
    im.paste(hero,(24,height-12-60),hero);im.paste(art,(112,height-12-art.height),art)
    return im

def paint_crop(im,is_floor):
    bounds=im.getchannel('A').point(lambda v:255 if v>=128 else 0).getbbox()
    if not is_floor:return bounds
    l,t,r,b=bounds
    # Rectangular tiles use an opaque interior of the GENERATED PAINTING.
    # No procedural filling or generated geometry is substituted for paint.
    for fraction in [.025,.04,.06,.08,.10,.14,.18]:
        dx=max(2,round((r-l)*fraction));dy=max(2,round((b-t)*fraction))
        candidate=[l+dx,t+dy,r-dx,b-dy]
        if float((np.array(im.crop(candidate))[:,:,3]<128).mean())<=.001:return candidate
    raise ValueError('Ground painting lacks a clean opaque rectangle; repaint required')

def render_paint(p):
    id=p['id'];w,h=p['size'];factor=p['factor']
    original=Image.open(ROOT/'sources'/f'{id}.png').convert('RGBA')
    crop=paint_crop(original,id in FLOORS)
    if id=='square-brick-plaza':crop=[58,42,1196,1212] # Five horizontal and fourteen vertical painted bond periods.
    cut=original.crop(crop)
    cleanup=0
    if id in FLOORS:
        pixels=np.array(cut);bad=pixels[:,:,3]<128;cleanup=int(bad.sum())
        for attempt in range(8):
            if not bad.any():break
            for axis,delta in [(0,1),(0,-1),(1,1),(1,-1)]:
                neighbor=np.roll(pixels,delta,axis=axis);valid=np.roll(~bad,delta,axis=axis)
                if axis==0:valid[0 if delta==1 else -1,:]=False
                else:valid[:,0 if delta==1 else -1]=False
                repair=bad&valid;pixels[repair]=neighbor[repair];bad[repair]=False
        if bad.any():raise ValueError('Ground alpha repair exceeds sparse pixel cleanup')
        pixels[:,:,3]=255
        cut=Image.fromarray(pixels)
    repeated=p['method']=='repeat-six-painted-modules'
    mw,mh=p['moduleSize'] if repeated else [w,h]
    work=Image.new('RGBA',(mw*factor,mh*factor))
    if id in FLOORS:
        fit=[mw*factor,mh*factor];x=y=0
    elif repeated:
        fit=[mw*factor,(mh-4)*factor];x=0;y=2*factor
    else:
        scale=min((mw-6)*factor/cut.width,(mh-6)*factor/cut.height)
        fit=[round(cut.width*scale),round(cut.height*scale)]
        if id=='square-grind-rail':fit=[(mw-6)*factor,(mh-6)*factor]
        x=(work.width-fit[0])//2;y=(work.height-fit[1])//2
        if id.endswith('-front') or id=='community-hall':y=work.height-fit[1]-3*factor
    work.paste(cut.resize(fit,Image.Resampling.LANCZOS),(x,y))
    if id in FLOORS and not repeated:
        work.paste(work.crop((0,0,factor,work.height)),(work.width-factor,0))
        work.paste(work.crop((0,0,work.width,factor)),(0,work.height-factor))
    repeat_info={}
    if repeated:
        # Join copies of a painted module, retaining an identical painted end
        # column at both ends. This copies paint, not code-made pattern lines.
        work.paste(work.crop((0,0,factor,work.height)),(work.width-factor,0))
        module_file=f'working/{id}-module-{factor}x.png';work.save(OUT/module_file)
        module=work;work=Image.new('RGBA',(w*factor,h*factor))
        for n in range(6):work.paste(module,(n*module.width,0))
        repeat_info={'repeatCount':6,'moduleSize':[mw,mh],'moduleWorking':module_file,
                     'moduleWorkingSize':list(module.size),'joinMethod':'Repeat painted module; first painted pixel column copied to last before reduction.'}
    working=f'working/{id}-{factor}x.png';work.save(OUT/working)
    art=material_map(block_mode(work,w,h,factor),id)
    art.save(OUT/f'{id}-v1.png');shutil.copy2(ROOT/'sources'/f'{id}.png',OUT/'sources'/f'{id}.png')
    box=art.getbbox();line=box[3]-4
    return art,{'id':id,'group':p['group'],'file':f'{id}-v1.png','size':[w,h],'kind':p['kind'],
        'feetLine':line,'footPoint':[w//2,line],'footprints':footprints(id,box),'visibleBounds':list(box),
        'renderLayer':'overhead' if id in OVERHEAD else ('ground' if id in FLOORS else 'depth-sorted'),
        'alphaPolicy':'opaque ground rectangle' if id in FLOORS else ('transparent overhead strip with repeat ends' if repeated else 'binary-alpha transparent sprite'),
        'productionMethod':'painted then reduced','source':f'sources/{id}.png','sourceSize':list(original.size),'sourceCrop':list(crop),
        'sourceFit':'rectangular painted ground fit' if id in FLOORS else ('painted repeat module fit' if repeated else ('rail silhouette refit in both axes' if id=='square-grind-rail' else 'proportional fit')),
        'sourceAlphaCleanup':{'pixels':cleanup,'method':'Copy adjacent painted pixels into at most0.1% sparse alpha pinholes; normalize opaque ground coverage.'},
        'fit':[x,y,*fit],'working':working,'workingSize':list(work.size),'reductionFactor':factor,
        'palettePolicy':('Cool concrete family #303750/#526078/#83A89A; low/high4% painted luminance marks retained.' if id=='square-concrete-pad' else 'Material family first; nearest tone only inside selected family.'),**repeat_info}

def reuse_paint(id,from_id):
    path=ROOT/'reused'/f'{from_id}.png';art=Image.open(path).convert('RGBA')
    filename=f'{id}-v1.png';shutil.copy2(path,OUT/filename)
    old=next(p for p in json.loads((ROOT/'reference/reused-manifest.json').read_text()) if p['id']==from_id)
    box=art.getbbox();return art,{'id':id,'group':'community-center','file':filename,'size':list(art.size),'kind':old['kind'],
        'feetLine':old['footPoint'][1],'footPoint':old['footPoint'],'footprints':old['footprints'],'visibleBounds':list(box),
        'renderLayer':'overhead' if id in OVERHEAD else 'depth-sorted','alphaPolicy':'approved native alpha retained',
        'productionMethod':'approved-native-reuse','reductionFactor':None,
        'reusedFrom':f'assets/stage/home/v4/yard/{from_id}-v4.png','approvedSha256':digest(path)}

def save_checks(p,art,hero):
    strip=comparison(p,art,hero);p['comparison1x']=f"checks/{p['id']}-hero-1x.png";strip.save(OUT/p['comparison1x'])
    p['comparison2x']=f"checks/{p['id']}-hero-2x.png";strip.resize((strip.width*2,strip.height*2),Image.Resampling.NEAREST).save(OUT/p['comparison2x'])
    overlay=Image.new('RGB',tuple(p['size']),'#9BAE73');overlay.paste(art,(0,0),art);d=ImageDraw.Draw(overlay)
    for x,y,w,h in p['footprints']:d.rectangle((x,y,x+w-1,y+h-1),outline='#C45C4B',width=2)
    y=p['feetLine'];d.line((0,y,overlay.width-1,y),fill='#FFF0CF',width=1);x,y=p['footPoint']
    d.line((x-3,y,x+3,y),fill='#EF9347',width=1);d.line((x,y-3,x,y+3),fill='#EF9347',width=1)
    p['footprintPreview']=f"checks/{p['id']}-footprint-1x.png";overlay.save(OUT/p['footprintPreview'])

def validate(pieces):
    palette=set(map(tuple,RGB.tolist()));checks=[]
    for p in pieces:
        im=Image.open(OUT/p['file']).convert('RGBA');a=np.array(im);w,h=p['size'];visible=a[:,:,3]>0
        colors=set(map(tuple,a[:,:,:3][visible].tolist()))
        item={'id':p['id'],'nativeSize':im.size==(w,h),'approvedPalette':colors.issubset(palette),
          'atLeastThreeColors':len(colors)>=3,'binaryAlpha':set(a[:,:,3].ravel()).issubset({0,255}),
          'footPointInside':0<=p['footPoint'][0]<w and 0<=p['footPoint'][1]<h,
          'footprintsInside':all(x>=0 and y>=0 and fw>0 and fh>0 and x+fw<=w and y+fh<=h for x,y,fw,fh in p['footprints']),
          'kindFootprints':not p['footprints'] if p['kind']=='WALK-THROUGH' else bool(p['footprints']),
          'visibleColors':len(colors),'sha256':digest(OUT/p['file'])}
        if p['kind']=='BREAKABLE':
            l,t,r,b=p['visibleBounds'];upper=a[t:t+max(1,round((b-t)*.35)),:,:3]
            item['breakableCreamAtTop']=bool(np.any(np.all(upper==RGB[7],axis=-1)|np.all(upper==RGB[8],axis=-1)))
        if p['productionMethod']=='approved-native-reuse':item['approvedReuseIdentical']=digest(OUT/p['file'])==p['approvedSha256']
        else:
            factor=p['reductionFactor'];work=Image.open(OUT/p['working']).convert('RGBA')
            item['factor2or3']=factor in [2,3];item['exactWorkingSize']=work.size==(w*factor,h*factor)
            item['exactModeReproducible']=np.array_equal(np.array(material_map(block_mode(work,w,h,factor),p['id'])),a)
        if p['id'] in FLOORS:
            item['opaqueGround']=bool(np.all(a[:,:,3]==255))
            item['repeatEdgeColumnsMatch']=np.array_equal(a[:,0],a[:,-1])
            if not p.get('repeatCount'):item['repeatEdgeRowsMatch']=np.array_equal(a[0],a[-1])
        elif p.get('repeatCount'):item['clearTopBottom']=bool(not a[0,:,3].any() and not a[-1,:,3].any())
        else:item['clearBorder']=bool(not a[0,:,3].any() and not a[-1,:,3].any() and not a[:,0,3].any() and not a[:,-1,3].any())
        checks.append(item)
    report={'expectedPieces':len(PLAN)+len(REUSE),'actualPieces':len(pieces),'complete':len(pieces)==len(PLAN)+len(REUSE),
      'newPaintings':sum(p['productionMethod']=='painted then reduced' for p in pieces),'approvedReuses':sum(p['productionMethod']=='approved-native-reuse' for p in pieces),'checks':checks}
    (OUT/'validation-town-buildings.json').write_text(json.dumps(report,indent=2)+'\n')

def assemblies(pieces):
    lookup={p['id']:p for p in pieces};recipes={}
    fronts=['mall-grocery-front','mall-bank-front','mall-pizza-front','mall-pharmacy-front','mall-dry-cleaner-front']
    if all(id in lookup for id in fronts+['mall-walkway-ground','mall-walkway-canopy']):
        canvas=Image.new('RGBA',(2496,560));layers=[]
        for i,id in enumerate(fronts):layers.append({'id':id,'position':[i*416,0]})
        layers.extend([{'id':'mall-walkway-ground','position':[0,384]}])
        for layer in layers:canvas.alpha_composite(Image.open(OUT/lookup[layer['id']]['file']).convert('RGBA'),tuple(layer['position']))
        canvas.save(OUT/'checks/mall-row-1x.png')
        covered=canvas.copy();covered.alpha_composite(Image.open(OUT/lookup['mall-walkway-canopy']['file']).convert('RGBA'),(0,240));covered.save(OUT/'checks/mall-row-canopy-1x.png')
        recipes['mall-row']={'size':[2496,560],'layers':layers,'note':'Native art assembly only. Five shops occupy2080px; remaining416px is available for an exit/alley when Claude places the row. Canopy is separate overhead art and has no floor collision; alternate covered study uses offset[0,240]. Claude determines final roof placement/visibility.'}
    squares=['square-arcade-front','square-coffee-front','square-hardware-front']
    if all(id in lookup for id in squares):
        canvas=Image.new('RGBA',(1664,448));x=0;layers=[]
        for id in squares:
            art=Image.open(OUT/lookup[id]['file']).convert('RGBA');y=448-art.height;canvas.alpha_composite(art,(x,y));layers.append({'id':id,'position':[x,y]});x+=art.width
        canvas.save(OUT/'checks/square-fronts-1x.png');recipes['square-fronts']={'size':[1664,448],'layers':layers,'note':'Native art assembly, not runtime placement.'}
    if all(id in lookup for id in ['community-light-posts','community-light-strand']):
        canvas=Image.open(OUT/lookup['community-light-posts']['file']).convert('RGBA');canvas.alpha_composite(Image.open(OUT/lookup['community-light-strand']['file']).convert('RGBA'),(0,-15));canvas.save(OUT/'checks/community-lights-1x.png')
    for id in FLOORS:
        if id not in lookup or id=='mall-walkway-ground':continue
        art=Image.open(OUT/lookup[id]['file']).convert('RGBA');repeat=Image.new('RGBA',(art.width*2,art.height*2))
        for x in range(2):
            for y in range(2):repeat.paste(art,(x*art.width,y*art.height))
        repeat.save(OUT/f'checks/{id}-repeat-1x.png')
    return recipes

def review(pieces):
    css='''body{margin:0;background:var(--ms-bg);color:var(--ms-text);font:var(--ms-body)/1.5 var(--ms-font-read)}main{max-width:calc(var(--ms-space-7)*28);margin:auto;padding:var(--ms-space-5)}h1{font-size:var(--ms-headline)}h2{font-size:var(--ms-title)}h3{font-size:var(--ms-body-l)}article{padding:var(--ms-space-4) 0;border-top:var(--ms-border-w) solid var(--ms-line)}a{color:var(--ms-text);display:inline-flex;align-items:center;min-height:var(--ms-touch)}figure{margin:0;overflow:auto}img{max-width:none;image-rendering:pixelated}.context{display:flex;gap:var(--ms-space-5);align-items:end;overflow:auto}'''
    body='''<h1>Maple Hollow Town Buildings</h1><p>One art batch: Strip Mall, Town Square, Community Center. Rami reviews the art before Claude places it.</p><p>Every comparison shows the full unscaled 56×60 hero and native 1x art. Wide images scroll within their own frame. The 2x links use crisp whole-number enlargement.</p><p><a href="manifest-town-buildings.json">Manifest</a> · <a href="validation-town-buildings.json">Validation</a> · <a href="README.md">Method and placement notes</a></p><nav>'''
    for group in GROUPS:body+=f'<a href="#{group}">{GROUP_LABELS[group]}</a> · '
    body+='''</nav><h2>Existing v4 references</h2><div class="context"><img src="reference/house-front-v4.png" alt="Existing v4 house front"><img src="reference/adirondack-chair-v4.png" alt="Existing v4 chair"><img src="reference/hero-56x60.png" alt="Unscaled hero frame"></div><p>These are style references; the town buildings are new subjects. Sign plates are blank for game text.</p>'''
    for group in GROUPS:
        body+=f'<section id="{group}"><h2>{GROUP_LABELS[group]}</h2>'
        if group=='strip-mall':body+='<p><a href="checks/mall-row-1x.png">Storefront row and paving at 1x</a> · <a href="checks/mall-row-canopy-1x.png">Separate canopy overlay study</a></p>'
        if group=='town-square':body+='<p><a href="checks/square-fronts-1x.png">Town Square fronts at 1x</a></p>'
        if group=='community-center':body+='<p>The cooler and separate light layers reuse approved yard art unchanged. Table and barricade PNGs can be instanced to make the plural party pieces.</p><p><a href="checks/community-lights-1x.png">Approved light layers assembled</a></p>'
        for p in [p for p in pieces if p['group']==group]:
            note='Approved native reuse' if p['productionMethod']=='approved-native-reuse' else f"{p['reductionFactor']}x working raster"
            if p['id'] in OVERHEAD:note+=' · overhead, never blocks'
            body+=f'''<article><h3>{p['id']}</h3><p>{p['kind']} · {p['size'][0]} × {p['size'][1]} · {note}</p><figure><img src="{p['comparison1x']}" alt="{p['id']} beside native 56 by 60 hero"></figure><p><a href="{p['file']}">Sprite PNG</a> · <a href="{p['comparison2x']}">Inspect at 2x</a> · <a href="{p['footprintPreview']}">Footprint overlay</a>'''
            if p['id'] in FLOORS and p['id']!='mall-walkway-ground':body+=f' · <a href="checks/{p["id"]}-repeat-1x.png">2×2 native repeat</a>'
            body+='</p></article>'
        body+='</section>'
    body+='<p>Overlay annotations: red rectangles propose solid footprints, cream shows the feet line, orange marks the foot point. The marks are never added to the exported sprite. Ground plates are opaque; isolated objects and overhead layers retain transparency. Runtime routes and depth sorting await integration.</p>'
    (OUT/'review.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Town Buildings art review</title><link rel="stylesheet" href="'+TOKENS_HREF+'"><style>'+css+'</style><main>'+body+'</main></html>')

# Token stylesheet path relative to wherever review.html is written (deliver/ adds a level).
TOKENS_HREF=os.path.relpath(Path(__file__).resolve().parents[4]/'ui'/'ms-tokens.css',OUT.resolve())

def main():
    for folder in ['sources','working','checks','reference']:(OUT/folder).mkdir(parents=True,exist_ok=True)
    for f in (ROOT/'reference').iterdir():
        if f.is_file() and not f.name.startswith('._'):shutil.copy2(f,OUT/'reference'/f.name)
    hero=Image.open(ROOT/'reference/hero-56x60.png').convert('RGBA');pieces=[]
    for p in PLAN:
        if not (ROOT/'sources'/f"{p['id']}.png").exists():continue
        art,record=render_paint(p);save_checks(record,art,hero);pieces.append(record)
    for id,from_id in REUSE.items():
        art,record=reuse_paint(id,from_id);save_checks(record,art,hero);pieces.append(record)
    recipes=assemblies(pieces)
    manifest={'status':'Town Buildings art review; not integrated','palette':PALETTE,'order':GROUPS,
       'method':'New paintings normalized to exact2x/3x working rasters, exact RGBA block mode and material-family palette mapping. Two walkway strips repeat six painted416px modules. Three approved native yard sprites reused unchanged.',
       'sourceSizeCaveat':'Generator source dimensions vary despite requested2x/3x sizes. Original rasters, actual dimensions, crops, fits and working sizes are retained.',
       'coordinates':'Local native pixels: feetLine is y; footPoint[x,y]; footprint[x,y,width,height]. Proposed art metadata, not tested runtime physics.',
       'heroReference':'Full unscaled56x60 live office-worker v4 frame, including transparent cell margins.',
       'groundAlphaNote':'Rectangular repeated ground plates intentionally cover their full footprint; isolated sprites/overhead art have transparent backgrounds.',
       'reviewAssemblies':recipes,'pieces':pieces}
    (OUT/'manifest-town-buildings.json').write_text(json.dumps(manifest,indent=2)+'\n');validate(pieces);review(pieces)
    print(f'Built {len(pieces)}/{len(PLAN)+len(REUSE)} Town Buildings pieces')

if __name__=='__main__':main()
