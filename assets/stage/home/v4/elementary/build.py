"""Elementary art preparation, never geometric sprite construction.
Original imagegen paintings -> exact 2x/3x working canvas -> block mode -> material palette.
Run with Python + Pillow + NumPy. Output goes to deliver/, separate from reviewed exports.
"""
from pathlib import Path
import colorsys, hashlib, json, shutil
from collections import Counter
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).parent
OUT=ROOT/'deliver'
PALETTE=json.loads((ROOT/'reference/palette.json').read_text())['palette']
RGB=np.array([tuple(bytes.fromhex(c[1:])) for c in PALETTE],dtype=np.uint8)
SPECS=[
 ('school-front',1100,560,2,'WALL'),('flagpole',48,256,3,'WALL'),
 ('school-sign',256,128,3,'WALL'),('pickup-lane',512,1024,2,'WALK-THROUGH'),
 ('minivan-a',80,144,3,'WALL'),('minivan-b',80,144,3,'WALL'),('pickup-suv',80,144,3,'WALL'),
 ('playground-slide',192,160,3,'WALL'),('monkey-bars',224,128,3,'WALL'),
 ('merry-go-round',160,128,3,'WALL'),('four-square',256,256,3,'WALK-THROUGH'),
 ('hopscotch',96,320,3,'WALK-THROUGH'),('usa-map',320,224,3,'WALK-THROUGH'),
 ('bike-rack',160,80,3,'WALL'),('lost-and-found',64,64,3,'BREAKABLE')]
DECALS={'four-square','hopscotch','usa-map'}

def block_mode(im,w,h,factor):
    a=np.array(im,dtype=np.uint8);a[a[:,:,3]==0]=0
    packed=(a[:,:,0].astype(np.uint32)<<24)|(a[:,:,1].astype(np.uint32)<<16)|(a[:,:,2].astype(np.uint32)<<8)|a[:,:,3]
    blocks=np.sort(packed.reshape(h,factor,w,factor).transpose(0,2,1,3).reshape(w*h,factor*factor),axis=1)
    best=blocks[:,0].copy();most=np.zeros(w*h,dtype=np.uint8)
    for i in range(factor*factor):
        candidate=blocks[:,i];count=np.sum(blocks==candidate[:,None],axis=1)
        update=count>most;best[update]=candidate[update];most[update]=count[update]
    best=best.reshape(h,w)
    return np.stack([(best>>24)&255,(best>>16)&255,(best>>8)&255,best&255],axis=-1).astype(np.uint8)

def material_map(a,id):
    colors,inverse=np.unique(a.reshape(-1,4),axis=0,return_inverse=True)
    mapped=colors.copy()
    for i,(r,g,b,alpha) in enumerate(colors):
        r,g,b,alpha=map(int,(r,g,b,alpha))
        if alpha<128: mapped[i]=0;continue
        hue,sat,value=colorsys.rgb_to_hsv(r/255,g/255,b/255)
        if id=='pickup-lane' and value<.65 and (sat<.4 or .53<hue<.76): family=[0,1,2]
        elif value<.22: family=[0,1]
        elif .19<hue<.47 and sat>.16: family=[4,17,18,19]
        elif .47<=hue<.59 and sat>.18: family=[1,2,3,4]
        elif .59<=hue<.73 and (value<.78 or sat>.25): family=[0,1,2]
        elif .70<hue<.90 and sat>.12: family=[2,14,8]
        elif hue>.90 and value>.55 and sat<.58: family=[10,12,13,8]
        elif sat<.24 and value<.58: family=[0,1,2,5]
        elif sat<.36 or (value>.72 and sat<.5): family=[5,6,7,8]
        elif hue<.055 or hue>.90: family=[9,10,12,16]
        elif hue<.19:
            if id in ['school-front','school-sign','bike-rack'] and value<.68: family=[5,6,9,15,16]
            else: family=[9,11,15,16,20]
        else: family=[1,2,3,4]
        # These are paint-only decals, never dark outlined raised objects.
        if id in DECALS and any(c in family for c in [0,1]): family=[5,6,7,8]
        options=RGB[family].astype(float)
        index=family[int(np.argmin(np.sum((options-[r,g,b])**2,axis=1)))]
        mapped[i,:3]=RGB[index];mapped[i,3]=255
    result=mapped[inverse].reshape(a.shape)
    if id=='pickup-lane':
        # Any dark generated edge is asphalt, never a raised tile outline.
        yy,xx=np.indices(result.shape[:2]);edge=(yy<5)|(yy>=result.shape[0]-5)|(xx<5)|(xx>=result.shape[1]-5)
        ink=np.all(result[:,:,:3]==RGB[0],axis=-1)|np.all(result[:,:,:3]==RGB[1],axis=-1)
        result[edge&ink&(result[:,:,3]>0),:3]=RGB[2]
    return Image.fromarray(result)

def footprints(id,bounds):
    l,t,r,b=bounds;w=r-l;h=b-t
    if id in DECALS or id=='pickup-lane': return []
    if id=='flagpole':return [[max(l,18),b-12,12,8]]
    if id=='school-front':return [[l+14,b-92,w-28,88]]
    if id in ['minivan-a','minivan-b','pickup-suv']:
        return [[l+6,t+12,w-12,h-22]]
    if id=='monkey-bars':return [[l+8,b-round(h*.36)-4,w-16,round(h*.36)]]
    if id=='merry-go-round':return [[l+round(w*.12),b-round(h*.34)-4,w-2*round(w*.12),round(h*.34)]]
    inset=max(4,round(w*.06));height=max(8,round(h*.17))
    return [[l+inset,b-height-4,w-2*inset,height]]

def comparison(id,art,hero):
    width=max(400,art.width+hero.width+64);height=max(art.height,hero.height)+72
    panel=Image.new('RGB',(width,height),'#526078' if id in DECALS else '#9BAE73');draw=ImageDraw.Draw(panel)
    font=ImageFont.load_default(size=14)
    draw.text((12,6),id,fill='#FFF0CF' if id in DECALS else '#171C35',font=font)
    draw.text((12,28),'ART 1X',fill='#FFF0CF' if id in DECALS else '#171C35',font=font)
    draw.text((art.width+36,28),'HERO 56x60',fill='#FFF0CF' if id in DECALS else '#171C35',font=font)
    panel.paste(art,(12,height-12-art.height),art)
    panel.paste(hero,(art.width+36,height-12-hero.height),hero)
    return panel

def build():
    for d in ['working','sources','checks','reference']:(OUT/d).mkdir(parents=True,exist_ok=True)
    for f in (ROOT/'reference').iterdir():
        if f.is_file() and not f.name.startswith('._') and f.name!='manifest-batch-b.json':shutil.copy2(f,OUT/'reference'/f.name)
    hero=Image.open(ROOT/'reference/hero-56x60.png').convert('RGBA')
    pieces=[]
    for id,w,h,factor,kind in SPECS:
        source=ROOT/'sources'/f'{id}.png'
        if not source.exists():continue
        im=Image.open(source).convert('RGBA')
        bounds=im.getchannel('A').point(lambda v:255 if v>=128 else 0).getbbox()
        cut=im.crop(bounds);margin=2 if id in DECALS or id=='pickup-lane' else 3
        scale=min((w-margin*2)*factor/cut.width,(h-margin*2)*factor/cut.height)
        fit=[round(cut.width*scale),round(cut.height*scale)]
        if id=='pickup-lane':fit=[(w-4)*factor,(h-4)*factor]
        work=Image.new('RGBA',(w*factor,h*factor));x=(work.width-fit[0])//2;y=(work.height-fit[1])//2
        work.paste(cut.resize(fit,Image.Resampling.LANCZOS),(x,y))
        working=f'working/{id}-{factor}x.png';work.save(OUT/working)
        art=material_map(block_mode(work,w,h,factor),id);art.save(OUT/f'{id}-v1.png')
        shutil.copy2(source,OUT/'sources'/source.name)
        bbox=art.getbbox();line=bbox[3]-4
        strip=comparison(id,art,hero);strip.save(OUT/'checks'/f'{id}-hero-1x.png')
        strip.resize((strip.width*2,strip.height*2),Image.Resampling.NEAREST).save(OUT/'checks'/f'{id}-hero-2x.png')
        p={'id':id,'file':f'{id}-v1.png','size':[w,h],'kind':kind,'feetLine':line,
           'footPoint':[w//2,line],'footprints':footprints(id,bbox),'visibleBounds':list(bbox),
           'source':f'sources/{id}.png','sourceSize':list(im.size),'sourceCrop':list(bounds),
           'working':working,'workingSize':list(work.size),'reductionFactor':factor,'fit':[x,y,*fit],
           'sourceFit':'exact rectangular ground-plate fit' if id=='pickup-lane' else 'proportional fit',
           'palettePolicy':'Named HSV material masks; nearest tone only inside the selected material family.',
           'comparison1x':f'checks/{id}-hero-1x.png','comparison2x':f'checks/{id}-hero-2x.png'}
        if id=='school-front':
            p['integrationNote']='Solid only at the lower facade base; upper roof/facade sort behind the hero. Sign plate is blank for game text.'
            p['blankTextArea']=[430,241,240,32]
        if id=='school-sign':p['blankTextArea']=[44,26,168,51]
        if id in ['minivan-a','minivan-b','pickup-suv']:p['integrationNote']='Top-down vehicle: footprint follows the car ground projection, not just its rear bumper.'
        if id=='pickup-lane':p['integrationNote']='Painted ground only; vehicles are separate. No collision. Asphalt base uses the street material palette.'
        overlay=Image.new('RGB',(w,h),'#526078' if id in DECALS else '#9BAE73');overlay.paste(art,(0,0),art)
        annotate=ImageDraw.Draw(overlay)
        for fx,fy,fw,fh in p['footprints']:annotate.rectangle((fx,fy,fx+fw-1,fy+fh-1),outline='#C45C4B',width=2)
        annotate.line((0,line,w-1,line),fill='#FFF0CF',width=1)
        cx,cy=p['footPoint'];annotate.line((cx-3,cy,cx+3,cy),fill='#EF9347',width=1);annotate.line((cx,cy-3,cx,cy+3),fill='#EF9347',width=1)
        p['footprintPreview']=f'checks/{id}-footprint-1x.png';overlay.save(OUT/p['footprintPreview'])
        pieces.append(p)
    manifest={'status':'Elementary art review, not integrated','palette':PALETTE,
      'method':'Built-in imagegen paintings normalized to exact 2x or 3x working canvases, exact factor-by-factor RGBA block mode, then deliberate material-family palette mapping. Proportional sprite fits; pickup-lane ground rectangle fits its width and height independently.',
      'sourceSizeCaveat':'Generator source dimensions vary despite requested 2x/3x dimensions. Untouched generated rasters and normalization fit are retained; every final pixel comes from one exact working-raster block.',
      'coordinates':'Native local pixels: feetLine is y, footPoint is [x,y], footprints are [x,y,width,height]. Proposed art metadata, not tested physics.',
      'heroReference':'Full unscaled 56x60 live office-worker v4 frame, including transparent cell margins.',
      'placementNote':'Requested 512x1024 pickup lane is taller than the approximate y150..950 reservation. Keep native size and extend placement into available ground; Claude places after art approval.',
      'pieces':pieces}
    manifest['reviewAssemblies']={'pickup-queue':{'size':[512,1024],
       'layers':[{'id':'pickup-lane','position':[0,0]},{'id':'minivan-a','position':[304,330]},
                 {'id':'minivan-b','position':[304,550]},{'id':'pickup-suv','position':[304,770]}],
       'note':'Native-size review only. Cars stay independent; the left side remains wider than the 224px route target. This is not a runtime placement recipe.'}}
    if all((OUT/f'{id}-v1.png').exists() for id in ['pickup-lane','minivan-a','minivan-b','pickup-suv']):
        queue=Image.new('RGBA',(512,1024))
        for layer in manifest['reviewAssemblies']['pickup-queue']['layers']:
            queue.alpha_composite(Image.open(OUT/f"{layer['id']}-v1.png").convert('RGBA'),tuple(layer['position']))
        queue.save(OUT/'checks/pickup-queue-1x.png')
    if (OUT/'pickup-lane-v1.png').exists():
        street=Image.open(ROOT/'reference/street-wide-v4-a.png').convert('RGBA').crop((200,140,380,240))
        lane=Image.open(OUT/'pickup-lane-v1.png').convert('RGBA').crop((30,530,210,630))
        report={}
        for label,patch in [('existingStreet',street),('newLane',lane)]:
            common=Counter(c[:3] for c in patch.getdata() if c[3]).most_common(3)
            report[label]={'dominantRGB':list(common[0][0]),'topColors':[[list(rgb),count] for rgb,count in common]}
        report['sameDominantAsphalt']=report['existingStreet']['dominantRGB']==report['newLane']['dominantRGB']==[82,96,120]
        (OUT/'checks/asphalt-material.json').write_text(json.dumps(report,indent=2)+'\n')
        material=Image.new('RGB',(412,146),'#171C35');d=ImageDraw.Draw(material);font=ImageFont.load_default(size=14)
        d.text((12,8),'EXISTING STREET',font=font,fill='#FFF0CF');d.text((220,8),'NEW PICKUP LANE',font=font,fill='#FFF0CF')
        material.paste(street,(12,34),street);material.paste(lane,(220,34),lane);material.save(OUT/'checks/asphalt-material-1x.png')
    (OUT/'manifest-elementary.json').write_text(json.dumps(manifest,indent=2)+'\n')
    validate(manifest);review(manifest)
    print(f'Built {len(pieces)}/{len(SPECS)} Elementary pieces')

def validate(manifest):
    palette=set(map(tuple,RGB.tolist()));checks=[]
    for p in manifest['pieces']:
        a=np.array(Image.open(OUT/p['file']).convert('RGBA'));w,h=p['size'];factor=p['reductionFactor']
        work=Image.open(OUT/p['working']).convert('RGBA');colors=set(map(tuple,a[:,:,:3][a[:,:,3]>0].tolist()))
        checks.append({'id':p['id'],'size':a.shape[:2]==(h,w),'exactWorkingSize':work.size==(w*factor,h*factor),
         'factorAllowed':factor in [2,3],'approvedPalette':colors.issubset(palette),'atLeastThreeColors':len(colors)>=3,
         'binaryAlpha':set(a[:,:,3].ravel()).issubset({0,255}),
         'clearBorder':bool(not a[0,:,3].any() and not a[-1,:,3].any() and not a[:,0,3].any() and not a[:,-1,3].any()),
         'footPointInside':0<=p['footPoint'][0]<w and 0<=p['footPoint'][1]<h,
         'footprintsInside':all(x>=0 and y>=0 and fw>0 and fh>0 and x+fw<=w and y+fh<=h for x,y,fw,fh in p['footprints']),
         'kindFootprints':not p['footprints'] if p['kind']=='WALK-THROUGH' else bool(p['footprints']),
         'decalNoDarkInk':not ({tuple(RGB[0]),tuple(RGB[1])}&colors) if p['id'] in DECALS else True,
         'exactModeReproducible':np.array_equal(np.array(material_map(block_mode(work,w,h,factor),p['id'])),a),
         'visibleColors':len(colors),'sha256':hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()})
    (OUT/'validation-elementary.json').write_text(json.dumps({'complete':len(checks)==len(SPECS),'expectedPieces':len(SPECS),'actualPieces':len(checks),'checks':checks},indent=2)+'\n')

def review(manifest):
    cards=''
    for p in manifest['pieces']:
        cards+=f'''<article><h2>{p['id']}</h2><p>{p['kind']} · {p['size'][0]} × {p['size'][1]} · {p['reductionFactor']}x working painting</p><figure><img src="{p['comparison1x']}" alt="{p['id']} at native size beside an unscaled 56 by 60 pixel hero"></figure><p><a href="{p['file']}">Sprite PNG</a> · <a href="{p['comparison2x']}">Inspect at 2x</a> · <a href="{p['footprintPreview']}">Footprint overlay</a></p></article>'''
    css='''body{margin:0;background:var(--ms-bg);color:var(--ms-text);font:var(--ms-body)/1.5 var(--ms-font-read)}main{max-width:calc(var(--ms-space-7)*28);margin:auto;padding:var(--ms-space-5)}h1{font-size:var(--ms-headline)}h2{font-size:var(--ms-title)}article{padding:var(--ms-space-4) 0;border-top:var(--ms-border-w) solid var(--ms-line)}a{color:var(--ms-text);display:inline-flex;align-items:center;min-height:var(--ms-touch)}figure{margin:0;overflow:auto}img{max-width:none;image-rendering:pixelated}.context{display:flex;gap:var(--ms-space-5);align-items:end;overflow:auto}'''
    page='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Maple Hollow Elementary art review</title><link rel="stylesheet" href="../../../../ui/ms-tokens.css"><style>'''+css+'''</style><main><h1>Maple Hollow Elementary</h1><p>School art for Rami’s approval. Claude places it afterward.</p><p>Every comparison uses the full unscaled 56×60 hero frame and native 1x art. Wide pieces scroll inside their own frame. The 2x links enlarge by a whole number with crisp edges.</p><p><a href="manifest-elementary.json">Manifest</a> · <a href="validation-elementary.json">Validation</a> · <a href="README.md">Method and placement notes</a></p><h2>Existing yard-kit style</h2><div class="context"><img src="reference/swing-set-v4.png" alt="Existing v4 swing set"><img src="reference/adirondack-chair-v4.png" alt="Existing v4 chair"><img src="reference/hero-56x60.png" alt="Full 56x60 hero frame"></div><p>School subjects are new; these are style and scale references, not older versions of the same objects.</p>'''+cards+'''<p>Footprint overlays: red rectangles are collision proposals, cream is the feet line, orange marks the foot point. These annotations exist only in review images.</p><p>All footprints are art proposals. Runtime navigation, placement and depth sorting wait for approval and Claude’s integration.</p></main></html>'''
    page=page.replace('<h2>Existing yard-kit style</h2>', '<p><a href="checks/pickup-queue-1x.png">Pickup queue at 1x</a> · <a href="checks/asphalt-material-1x.png">Street and lane material at 1x</a></p><h2>Existing yard-kit style</h2>')
    (OUT/'review.html').write_text(page)

if __name__=='__main__':build()
