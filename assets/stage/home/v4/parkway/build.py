"""Painted Parkway art preparation. All source artwork comes from imagegen.
Exact 2x/3x working rasters -> block-mode reduction -> material-family palette.
Run with Python, Pillow and NumPy. Output is a fresh deliver/ subdirectory.
"""
from pathlib import Path
from collections import Counter
import colorsys, hashlib, json, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).parent;OUT=ROOT/'deliver'
PLAN=json.loads((ROOT/'generation-plan.json').read_text())
PALETTE=json.loads((ROOT/'reference/palette.json').read_text())['palette']
RGB=np.array([tuple(bytes.fromhex(c[1:])) for c in PALETTE],dtype=np.uint8)
GRASS=[17,18,19]

def mode_reduce(im,w,h,factor):
    a=np.array(im);a[a[:,:,3]==0]=0
    packed=(a[:,:,0].astype(np.uint32)<<24)|(a[:,:,1].astype(np.uint32)<<16)|(a[:,:,2].astype(np.uint32)<<8)|a[:,:,3]
    blocks=np.sort(packed.reshape(h,factor,w,factor).transpose(0,2,1,3).reshape(w*h,factor*factor),axis=1)
    best=blocks[:,0].copy();most=np.zeros(w*h,dtype=np.uint8)
    for i in range(factor*factor):
        count=np.sum(blocks==blocks[:,i,None],axis=1);replace=count>most;best[replace]=blocks[replace,i];most[replace]=count[replace]
    best=best.reshape(h,w)
    return np.stack([(best>>24)&255,(best>>16)&255,(best>>8)&255,best&255],axis=-1).astype(np.uint8)

def palette_map(a,id):
    visible=a[:,:,3]>=128;lum=a[:,:,0]*.2126+a[:,:,1]*.7152+a[:,:,2]*.0722
    if id in ['fairway','putting-green']:
        # Only warm grass families cover broad surfaces; the darkest green is
        # restricted to tiny painted blade marks, never a whole mower stripe.
        hole=visible&(lum<85) if id=='putting-green' else np.zeros_like(visible)
        grass=visible&~hole;pixels=a[:,:,:3].astype(float)
        bright=np.sum((pixels-RGB[17])**2,axis=-1);shade=np.sum((pixels-RGB[18])**2,axis=-1)
        base=grass&(bright<=shade)
        if np.count_nonzero(base)/max(1,np.count_nonzero(grass))<.55:
            cutoff=np.quantile(lum[grass],.40);base=grass&(lum>=cutoff)
        result=np.zeros_like(a);result[grass,:3]=RGB[18];result[base,:3]=RGB[17];result[visible,3]=255
        low=np.quantile(lum[grass],.005);deep=grass&(lum<low)
        result[deep,:3]=RGB[19];result[hole,:3]=RGB[0]
        return Image.fromarray(result)
    if id=='sand-trap':
        # Lightness is interpreted within sand, not across the whole palette.
        ratio=(a[:,:,1].astype(float)-a[:,:,0].astype(float))
        green=visible&(ratio>7)&(a[:,:,1]>a[:,:,2]*1.08)
        sand=visible&~green;low,high=np.quantile(lum[sand],[.12,.88])
        result=np.zeros_like(a);result[sand,:3]=RGB[7];result[sand&(lum<low),:3]=RGB[6];result[sand&(lum>high),:3]=RGB[8]
        result[green,:3]=RGB[17];result[green&(lum<125),:3]=RGB[18];result[visible,3]=255
        return Image.fromarray(result)
    colors,inverse=np.unique(a.reshape(-1,4),axis=0,return_inverse=True);mapped=colors.copy()
    for i,color in enumerate(colors):
        r,g,b,alpha=map(int,color)
        if alpha<128:mapped[i]=0;continue
        hue,sat,value=colorsys.rgb_to_hsv(r/255,g/255,b/255)
        if value<.22:family=[0,1]
        elif .19<hue<.47 and sat>.16:family=[4,17,18,19]
        elif .47<=hue<.59 and sat>.18:family=[1,2,3,4]
        elif .59<=hue<.73 and (value<.78 or sat>.25):family=[0,1,2]
        elif .70<hue<.90 and sat>.12:family=[2,14,8]
        elif hue>.90 and value>.55 and sat<.58:family=[10,12,13,8]
        elif sat<.24 and value<.58:family=[0,1,2,5]
        elif sat<.36 or (value>.72 and sat<.50):family=[5,6,7,8]
        elif hue<.055 or hue>.90:family=[9,10,12,16]
        elif id=='barricade-north-south' and value<.75:family=[5,6,9,15,16]
        elif hue<.19:family=[9,11,15,16,20]
        else:family=[1,2,3,4]
        index=family[int(np.argmin(np.sum((RGB[family].astype(float)-[r,g,b])**2,axis=1)))]
        mapped[i,:3]=RGB[index];mapped[i,3]=255
    return Image.fromarray(mapped[inverse].reshape(a.shape))

def crop_source(im,ground):
    b=im.getchannel('A').point(lambda v:255 if v>=128 else 0).getbbox()
    if not ground:return b
    return [0,0,im.width,im.height]

def foot_data(id,art):
    box=art.getbbox();l,t,r,b=box;w,h=art.size;line=b-4;x=w//2
    if id in ['fairway','putting-green','sand-trap']:return line,[x,line],[]
    if id=='golf-flag':
        a=np.array(art);ys=slice(t+round((b-t)*.55),t+round((b-t)*.80));points=np.where(a[ys,:,3]>0)[1]
        x=int(round(np.median(points))) if points.size else x
        return line,[x,line],[[max(0,x-3),line-4,6,5]]
    if id=='barricade-north-south':return line,[x,line],[[l+2,b-22,r-l-4,18]]
    return line,[x,line],[[l+10,b-30,r-l-20,26]]

def comparison(p,art,hero):
    w,h=art.size;im=Image.new('RGB',(max(420,w+124),max(h,60)+72),'#9BAE73');d=ImageDraw.Draw(im);font=ImageFont.load_default(size=14)
    d.text((12,6),p['id'],font=font,fill='#171C35');d.text((12,28),'HERO 56x60',font=font,fill='#171C35');d.text((112,28),'ART 1X',font=font,fill='#171C35')
    im.paste(hero,(24,im.height-72),hero);im.paste(art,(112,im.height-12-h),art);return im

def cup_point(art):
    a=np.array(art);mask=np.all(a[:,:,:3]==RGB[0],axis=-1)&(a[:,:,3]>0);ys,xs=np.where(mask)
    unseen=set(zip(xs.tolist(),ys.tolist()));components=[]
    while unseen:
        start=unseen.pop();queue=[start];found=[start]
        while queue:
            x,y=queue.pop()
            for neighbor in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                if neighbor in unseen:unseen.remove(neighbor);queue.append(neighbor);found.append(neighbor)
        components.append(found)
    if not components:return None
    largest=max(components,key=len);return [round(sum(x for x,y in largest)/len(largest)),round(sum(y for x,y in largest)/len(largest))]

def build():
    for folder in ['sources','working','checks','reference']:(OUT/folder).mkdir(parents=True,exist_ok=True)
    for f in (ROOT/'reference').iterdir():
        if f.is_file() and not f.name.startswith('._'):shutil.copy2(f,OUT/'reference'/f.name)
    hero=Image.open(ROOT/'reference/hero-56x60.png').convert('RGBA');pieces=[]
    for p in PLAN:
        id=p['id'];source=ROOT/'sources'/f'{id}.png'
        if not source.exists():continue
        w,h=p['size'];factor=p['factor'];im=Image.open(source).convert('RGBA');box=crop_source(im,p['ground']);cut=im.crop(box)
        work=Image.new('RGBA',(w*factor,h*factor))
        if p['ground']:
            pixels=np.array(cut);pixels[:,:,3]=255;cut=Image.fromarray(pixels);fit=[w*factor,h*factor];x=y=0
        elif id in ['golf-cart','barricade-north-south']:
            fit=[(w-6)*factor,(h-6)*factor];x=y=3*factor
        else:
            scale=min((w-6)*factor/cut.width,(h-6)*factor/cut.height);fit=[round(cut.width*scale),round(cut.height*scale)];x=(work.width-fit[0])//2;y=(work.height-fit[1])//2
        work.paste(cut.resize(fit,Image.Resampling.LANCZOS),(x,y))
        if p['ground']:
            work.paste(work.crop((0,0,factor,work.height)),(work.width-factor,0));work.paste(work.crop((0,0,work.width,factor)),(0,work.height-factor))
        working=f'working/{id}-{factor}x.png';work.save(OUT/working);art=palette_map(mode_reduce(work,w,h,factor),id);art.save(OUT/f'{id}-v1.png');shutil.copy2(source,OUT/'sources'/source.name)
        line,point,fp=foot_data(id,art)
        record={'id':id,'file':f'{id}-v1.png','size':[w,h],'kind':p['kind'],'feetLine':line,'footPoint':point,'footprints':fp,
          'visibleBounds':list(art.getbbox()),'source':f'sources/{id}.png','sourceSize':list(im.size),'sourceCrop':list(box),
          'sourceFit':'rectangular painted-ground fit' if p['ground'] else ('requested canvas proportion fit' if id in ['golf-cart','barricade-north-south'] else 'proportional fit'),'fit':[x,y,*fit],
          'working':working,'workingSize':list(work.size),'reductionFactor':factor,
          'alphaPolicy':'opaque repeating ground tile' if p['ground'] else 'binary-alpha transparent sprite',
          'palettePolicy':'Warm grass families only on grass; darkest blade marks under 1%. Sand uses three pale tones. Prop materials selected by HSV family before tone.'}
        if id=='putting-green':record['cupPoint']=cup_point(art);record['flagBakedIn']=False
        if id=='barricade-north-south':record['orientation']='Front-facing horizontal span across vertical north-south road';record['roadWidth']=320
        strip=comparison(p,art,hero);record['comparison1x']=f'checks/{id}-hero-1x.png';strip.save(OUT/record['comparison1x']);record['comparison2x']=f'checks/{id}-hero-2x.png';strip.resize((strip.width*2,strip.height*2),Image.Resampling.NEAREST).save(OUT/record['comparison2x'])
        overlay=Image.new('RGB',(w,h),'#9BAE73');overlay.paste(art,(0,0),art);d=ImageDraw.Draw(overlay)
        for fx,fy,fw,fh in fp:d.rectangle((fx,fy,fx+fw-1,fy+fh-1),outline='#C45C4B',width=2)
        d.line((0,line,w-1,line),fill='#FFF0CF',width=1);cx,cy=point;d.line((cx-3,cy,cx+3,cy),fill='#EF9347',width=1);d.line((cx,cy-3,cx,cy+3),fill='#EF9347',width=1)
        record['footprintPreview']=f'checks/{id}-footprint-1x.png';overlay.save(OUT/record['footprintPreview']);pieces.append(record)
    recipes=assemblies(pieces,hero)
    manifest={'status':'Parkway art review; awaiting approval, not placed','palette':PALETTE,'grassBase':'#9BAE73',
      'method':'Built-in imagegen paintings normalized to exact 2x/3x working rasters, exact RGBA block mode, material-family palette mapping. Native tiles use copied painted edge blocks for repeat joins.',
      'sourceSizeCaveat':'Generated dimensions vary despite requested dimensions; untouched originals and exact normalization crop/fit/working rasters are retained.',
      'heroReference':'Full unscaled 56x60 live office-worker v4 frame, including transparent margins.',
      'coordinates':'Local native pixels: feetLine y; footPoint[x,y]; footprints[x,y,width,height]. Proposed integration metadata, not tested physics.',
      'puttingGreenSizeChoice':'512x512, chosen to match the requested fairway tile; flag is separate.',
      'reviewAssemblies':recipes,'pieces':pieces}
    (OUT/'manifest-parkway.json').write_text(json.dumps(manifest,indent=2)+'\n');validate(pieces);review(pieces);print(f'Built {len(pieces)}/6 Parkway pieces')

def assemblies(pieces,hero):
    lookup={p['id']:p for p in pieces};recipes={};font=ImageFont.load_default(size=14)
    if 'fairway' in lookup:
        fair=Image.open(OUT/lookup['fairway']['file']).convert('RGBA');lawn=Image.open(ROOT/'reference/lawn-a-v4.png').convert('RGBA')
        comparison=Image.new('RGB',(1536,544),'#171C35');d=ImageDraw.Draw(comparison)
        for x,label,art in [(0,'EXISTING LAWN',lawn),(512,'FAIRWAY',fair),(1024,'EXISTING LAWN',lawn)]:d.text((x+12,6),label,font=font,fill='#FFF0CF');comparison.paste(art,(x,32),art)
        comparison.save(OUT/'checks/lawn-fairway-lawn-1x.png')
        repeat=Image.new('RGBA',(1024,1024))
        for x in range(2):
            for y in range(2):repeat.paste(fair,(x*512,y*512))
        repeat.save(OUT/'checks/fairway-repeat-1x.png')
        # Contact board includes all three painted materials at native scale.
        if 'putting-green' in lookup:
            green=Image.open(OUT/lookup['putting-green']['file']).convert('RGBA');mixed=Image.new('RGBA',(1536,1024))
            for x,art in enumerate([lawn,fair,green]):mixed.paste(art,(x*512,0));mixed.paste(art,(x*512,512))
            mixed.save(OUT/'checks/lawn-fairway-green-1x.png')
    if all(id in lookup for id in ['putting-green','golf-flag']):
        green=lookup['putting-green'];flag=lookup['golf-flag'];cup=green['cupPoint']
        if cup:
            position=[cup[0]-flag['footPoint'][0],cup[1]-flag['footPoint'][1]]
            canvas=Image.open(OUT/green['file']).convert('RGBA');canvas.alpha_composite(Image.open(OUT/flag['file']).convert('RGBA'),tuple(position));canvas.save(OUT/'checks/green-with-separate-flag-1x.png')
            recipes['green-with-flag']={'green':'putting-green','flag':'golf-flag','position':position,'cupPoint':cup,'note':'Flag PNG stays independent; only its tiny ground base collides.'}
    if 'barricade-north-south' in lookup:
        street=Image.open(ROOT/'reference/north-south-street-reference.png').convert('RGBA').crop((0,0,512,192));canvas=Image.new('RGBA',(512,640))
        for y in range(0,640,192):canvas.paste(street,(0,y))
        canvas.alpha_composite(Image.open(OUT/lookup['barricade-north-south']['file']).convert('RGBA'),(96,260));canvas.alpha_composite(hero,(228,380));canvas.save(OUT/'checks/barricade-on-north-south-road-1x.png')
        recipes['north-south-road']={'barricadePosition':[96,260],'roadAsphaltBounds':[96,0,320,640],'note':'Review-only assembly of existing painted street. Barrier spans road left-to-right; this does not place it in the game.'}
    return recipes

def validate(pieces):
    checks=[];palette=set(map(tuple,RGB.tolist()))
    for p in pieces:
        art=Image.open(OUT/p['file']).convert('RGBA');a=np.array(art);w,h=p['size'];f=p['reductionFactor'];work=Image.open(OUT/p['working']).convert('RGBA');visible=a[:,:,3]>0;colors=set(map(tuple,a[:,:,:3][visible].tolist()))
        c={'id':p['id'],'size':art.size==(w,h),'factor2or3':f in [2,3],'exactWorkingSize':work.size==(w*f,h*f),
          'approvedPalette':colors.issubset(palette),'atLeastThreeColors':len(colors)>=3,'binaryAlpha':set(a[:,:,3].ravel()).issubset({0,255}),
          'footPointInside':0<=p['footPoint'][0]<w and 0<=p['footPoint'][1]<h,
          'footprintsInside':all(x>=0 and y>=0 and fw>0 and fh>0 and x+fw<=w and y+fh<=h for x,y,fw,fh in p['footprints']),
          'kindFootprints':not p['footprints'] if p['kind']=='WALK-THROUGH' else bool(p['footprints']),
          'exactModeReproducible':np.array_equal(np.array(palette_map(mode_reduce(work,w,h,f),p['id'])),a),'sha256':hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()}
        if p['id'] in ['fairway','putting-green']:
            c['opaqueGround']=bool(np.all(a[:,:,3]==255));c['noBlueGreenGrass']=colors.issubset({tuple(RGB[i]) for i in [0,17,18,19]})
            c['lawnBaseDominates']=float(np.mean(np.all(a[:,:,:3]==RGB[17],axis=-1)))>=.55
            c['deepMarksUnderOnePercent']=float(np.mean(np.all(a[:,:,:3]==RGB[19],axis=-1)))<.01
            c['threeGrassTones']=all(np.any(np.all(a[:,:,:3]==RGB[i],axis=-1)) for i in GRASS)
            c['repeatEdgesMatch']=bool(np.array_equal(a[:,0],a[:,-1]) and np.array_equal(a[0],a[-1]))
        else:c['clearBorder']=bool(not a[0,:,3].any() and not a[-1,:,3].any() and not a[:,0,3].any() and not a[:,-1,3].any())
        if p['id']=='putting-green':c['cupDetected']=p['cupPoint'] is not None
        if p['id']=='barricade-north-south':c['paintedWidthCoversRoad']=p['visibleBounds'][2]-p['visibleBounds'][0]>=300
        checks.append(c)
    report={'complete':len(checks)==6,'expectedPieces':6,'actualPieces':len(checks),'passed':len(checks)==6 and all(value for c in checks for value in c.values() if isinstance(value,bool)),'checks':checks}
    (OUT/'validation-parkway.json').write_text(json.dumps(report,indent=2)+'\n')

def review(pieces):
    css='''body{margin:0;background:var(--ms-bg);color:var(--ms-text);font:var(--ms-body)/1.5 var(--ms-font-read)}main{max-width:calc(var(--ms-space-7)*28);margin:auto;padding:var(--ms-space-5)}h1{font-size:var(--ms-headline)}h2{font-size:var(--ms-title)}article{padding:var(--ms-space-4) 0;border-top:var(--ms-border-w) solid var(--ms-line)}a{color:var(--ms-text);display:inline-flex;align-items:center;min-height:var(--ms-touch)}figure{margin:0;overflow:auto}img{max-width:none;image-rendering:pixelated}'''
    body='''<h1>Maple Hollow Parkway extras</h1><p>Six separate pieces for art approval. Nothing is placed in the game.</p><p>Every comparison shows native 1x art and the full unscaled 56×60 hero. Wide pieces scroll in their own frame; 2x details use crisp whole-number enlargement.</p><p><a href="manifest-parkway.json">Manifest</a> · <a href="validation-parkway.json">Validation</a> · <a href="README.md">Method and notes</a></p><h2>Grass and orientation checks</h2><p><a href="checks/lawn-fairway-lawn-1x.png">Fairway between existing lawns at 1x</a> · <a href="checks/lawn-fairway-green-1x.png">Lawn, fairway and putting green</a> · <a href="checks/fairway-repeat-1x.png">Fairway 2×2 repeat</a></p><p><a href="checks/green-with-separate-flag-1x.png">Green with independent flag</a> · <a href="checks/barricade-on-north-south-road-1x.png">Front barricade across a north-south road</a></p><p>Grass uses warm #9BAE73 and #6D895B for broad surfaces. Deep green is restricted to tiny blade marks, never a broad blue-green stripe. The flag remains its own wall piece; the green has no solid footprint.</p>'''
    for p in pieces:body+=f'''<article><h2>{p['id']}</h2><p>{p['kind']} · {p['size'][0]} × {p['size'][1]} · {p['reductionFactor']}x working painting</p><figure><img src="{p['comparison1x']}" alt="{p['id']} at native size beside unscaled 56 by60 hero"></figure><p><a href="{p['file']}">Sprite PNG</a> · <a href="{p['comparison2x']}">Inspect at 2x</a> · <a href="{p['footprintPreview']}">Footprint overlay</a></p></article>'''
    body+='<p>Review overlays only: red rectangles are proposed solid footprints, cream shows the feet line, orange is the foot point. Runtime placement, collision and depth sorting wait for approval.</p>'
    (OUT/'review.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Parkway art review</title><link rel="stylesheet" href="../../../../ui/ms-tokens.css"><style>'+css+'</style><main>'+body+'</main></html>')

if __name__=='__main__':build()
