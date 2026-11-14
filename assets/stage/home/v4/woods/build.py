"""Export the painted Woods kit and isolated art-review scene. No runtime writes."""
from pathlib import Path
import json, sys, importlib.util, colorsys
sys.dont_write_bytecode=True
import numpy as np
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'deliver'
spec=importlib.util.spec_from_file_location('paint',ROOT.parent/'house-ground-floor/build.py')
paint=importlib.util.module_from_spec(spec);spec.loader.exec_module(paint)
PALETTE=paint.PALETTE
hero=Image.open(ROOT.parent/'house-ground-floor/reference/hero-56x60.png').convert('RGBA')
font=ImageFont.load_default(size=14)
pieces=[]

def material_map(a,p):
    art=paint.palette_map(a,p);out=np.array(art);rgb=a[:,:,:3].astype(float)
    visible=a[:,:,3]>=128
    hi=rgb.max(2);lo=rgb.min(2);sat=(hi-lo)/np.maximum(hi,1)
    lum=rgb.mean(2)
    def tones(mask,indices):
        if not mask.any():return
        low,high=np.quantile(lum[mask],[.20,.80])
        out[mask,:3]=paint.RGB[indices[1]]
        out[mask&(lum<=low),:3]=paint.RGB[indices[0]]
        out[mask&(lum>=high),:3]=paint.RGB[indices[2]]
    if p['id'] in ('twin-stone-i','twin-stone-ii','mossy-rock-cluster'):
        tones(visible&(sat<.30)&(hi>65),[1,2,4])
    if p['id'].startswith('forest-trail'):
        tones(visible&(rgb[:,:,0]>rgb[:,:,1]+5)&(rgb[:,:,1]>rgb[:,:,2]+5)&(hi>85),[15,5,6])
    if p['id']=='tree-evergreen':
        tones(visible&(rgb[:,:,1]>rgb[:,:,0]+5)&(rgb[:,:,2]>rgb[:,:,0]),[19,3,4])
    if p['id']=='tree-birch-yellow':
        yy=np.indices(visible.shape)[0]
        tones(visible&(sat>.48)&(rgb[:,:,1]>rgb[:,:,0]*.63)&(rgb[:,:,0]>rgb[:,:,2]*1.5)&(yy<160),[20,7,8])
    return Image.fromarray(out)

def footprints(p,art):
    l,t,r,b=art.getbbox();line=b-5;w,h=art.size
    if p['id'].startswith('tree-'):return line,[[w//2-18,line-24,36,22]]
    if p['id'].startswith('twin-'):return line,[[l+8,line-30,r-l-16,28]]
    if p['id']=='fallen-log':return line,[[l+6,t+16,r-l-12,b-t-26]]
    if p['id']=='mossy-rock-cluster':return line,[[l+12,t+30,r-l-24,b-t-38]]
    return line,[]

for p in json.loads((ROOT/'plan.json').read_text()):
    id=p['id'];w,h=p['size'];f=4
    source=Image.open(ROOT/'sources'/f'{id}.png').convert('RGBA')
    ground=id.startswith('forest-');sheet=id=='fireflies-loop'
    box=[0,0,source.width,source.height] if ground or sheet else list(source.getchannel('A').point(lambda a:255 if a>=128 else 0).getbbox())
    crop=source.crop(box)
    work=Image.new('RGBA',(w*f,h*f))
    if ground or sheet:
        work=crop.resize(work.size,Image.Resampling.LANCZOS)
        fit=[0,0,*work.size]
    else:
        crop.thumbnail(((w-8)*f,(h-8)*f),Image.Resampling.LANCZOS)
        fit=[(work.width-crop.width)//2,work.height-4*f-crop.height,*crop.size]
        work.alpha_composite(crop,tuple(fit[:2]))
    work.save(OUT/'working'/f'{id}-4x.png')
    a=paint.mode_reduce(work,w,h,f);art=material_map(a,p)
    art.save(OUT/f'{id}-v1.png')
    line,fps=footprints(p,art)
    piece=dict(id=id,file=f'{id}-v1.png',size=[w,h],kind='WALL' if fps else 'WALK-THROUGH',feetLine=line,footPoint=[w//2,line],footprints=fps,renderLayer='overhead' if sheet else 'ground' if ground or not fps else 'object',source=f'../sources/{id}.png',sourceSize=list(source.size),sourceCrop=box,sourceFit=fit,working=f'working/{id}-4x.png',reductionFactor=4,availability={'mode':'Full Life','ageGreaterThan':65})
    display=art
    if sheet:
        frames=[]
        for n in range(4):
            frame=art.crop(((n%2)*32,(n//2)*32,(n%2+1)*32,(n//2+1)*32))
            file=f'frames/fireflies-{n}.png';frame.save(OUT/file);frames.append(file)
        piece.update(frameSize=[32,32],frameFiles=frames,frameOrder=[0,1,2,3],frameDurationMs=200,loop=True,feetLine=31,footPoint=[16,31])
        display=Image.open(OUT/frames[0]).convert('RGBA')
        gif=[]
        palette=[0,0,0]+[v for c in paint.RGB for v in c.tolist()]
        for file in frames:
            rgba=np.array(Image.open(OUT/file));indices=np.zeros((32,32),dtype=np.uint8)
            for i,color in enumerate(paint.RGB):indices[np.all(rgba[:,:,:3]==color,axis=2)&(rgba[:,:,3]>0)]=i+1
            frame=Image.fromarray(indices);frame.putpalette(palette+[0]*(768-len(palette)));gif.append(frame)
        gif[0].save(OUT/'fireflies-preview.gif',save_all=True,append_images=gif[1:],duration=200,loop=0,transparency=0,disposal=2,optimize=False)
    cw=max(360,display.width+100);ch=max(60,display.height)+36
    check=Image.new('RGBA',(cw,ch),PALETTE[8]);d=ImageDraw.Draw(check)
    d.text((8,4),id+' / HERO + ART 1X',font=font,fill=PALETTE[0])
    check.alpha_composite(hero,(8,ch-64));check.alpha_composite(display,(88,ch-display.height-4))
    if id.startswith('tree-'):
        old=Image.open(ROOT.parent/'yard/tree-maple-orange-v4.png').convert('RGBA')
        wide=Image.new('RGBA',(cw+old.width+16,max(ch,old.height+36)),PALETTE[8])
        wide.alpha_composite(check,(0,wide.height-ch));wide.alpha_composite(old,(cw+8,wide.height-old.height-4));check=wide
    piece['comparison1x']=f'checks/{id}-hero-1x.png';check.save(OUT/piece['comparison1x']);pieces.append(piece)

(OUT/'manifest-woods.json').write_text(json.dumps(dict(status='Complete art kit for approval; no runtime placement.',method='Built-in imagegen paintings, normalized 4x working canvases, exact 4x block-mode reduction and explicit material-family mapping. Original source sizes vary and are retained once.',palette=PALETTE,coordinates='Native pixels. feetLine y; footPoint [x,y]; footprints [x,y,w,h]. Tree and stone pictures extend above footprints for walk-behind depth.',stageReferenceSize=[2960,2048],densityTarget='12 solid props per 1024x768 review screen; actual stage layout remains separate.',pieces=pieces),indent=2)+'\n')
library={p['id']:p for p in pieces}

# An isolated material/density review, not a game layout or stage definition.
scene=Image.new('RGBA',(1024,768))
for y in (0,512):
    for x in (0,512):
        tile='forest-trail-straight' if x==0 else 'forest-floor'
        scene.alpha_composite(Image.open(OUT/library[tile]['file']).convert('RGBA'),(x,y))
placements=[('tree-evergreen',12,16),('tree-maple-red',440,8),('tree-birch-yellow',832,16),('tree-evergreen',16,272),('tree-birch-yellow',416,304),('tree-maple-red',848,320),('tree-evergreen',440,560),('tree-maple-red',832,560),('twin-stone-i',600,280),('twin-stone-ii',792,280),('fallen-log',584,552),('mossy-rock-cluster',616,48),('mushroom-ring',656,464)]
for id,x,y in sorted(placements,key=lambda t:t[2]+library[t[0]]['feetLine']):scene.alpha_composite(Image.open(OUT/library[id]['file']).convert('RGBA'),(x,y))
scene.alpha_composite(hero,(228,620))
scene.alpha_composite(Image.open(OUT/'frames/fireflies-2.png').convert('RGBA'),(672,224))
scene.save(OUT/'checks/woods-scene-1x.png')
overlay=scene.copy();draw=ImageDraw.Draw(overlay)
for id,x,y in placements:
    for fx,fy,fw,fh in library[id]['footprints']:draw.rectangle((x+fx,y+fy,x+fx+fw-1,y+fy+fh-1),outline=PALETTE[8])
draw.rectangle((144,0,367,767),outline=PALETTE[4],width=2)
overlay.save(OUT/'checks/woods-footprints-1x.png')
(OUT/'checks/scene-layout.json').write_text(json.dumps({'purpose':'Isolated art review, not runtime placement','size':[1024,768],'mainRoute':[144,0,224,768],'exits':['north','south'],'solidCount':12,'placements':[{'id':id,'x':x,'y':y} for id,x,y in placements]},indent=2)+'\n')
cards=''.join(f'<article><h2>{p["id"]}</h2><p>{p["size"]} · {p["kind"]}</p><img src="{p["comparison1x"]}" alt="Native-size hero comparison for {p["id"]}"></article>' for p in pieces)
(OUT/'review.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Woods art review</title><link rel="stylesheet" href="../../../../../ui/ms-tokens.css"><style>body{background:var(--ms-text);color:var(--ms-surface);font-family:var(--ms-font-read);font-size:var(--ms-body)}article{overflow:auto;margin-block:var(--ms-space-6)}img{max-width:none;image-rendering:pixelated}img[src$=".gif"]{background:var(--ms-bg)}h1,h2{font-family:var(--ms-font-label)}</style><h1>WOODS ART REVIEW</h1><p>Full Life only, past 65. Art approval required before placement. Scroll images sideways on phones to preserve 1x. Trees include the existing orange maple at its native size for comparison.</p><p><a href="manifest-woods.json">Manifest</a> · <a href="checks/export-checks.json">Checks</a> · <a href="../../roads/deliver/review.html">Roads</a></p><article><h2>SCENE AT 1X</h2><p>12 solid props per 1024x768 screen. The 224px route has a north and south exit. This is an isolated art review, not a game layout.</p><img src="checks/woods-scene-1x.png" alt="Woods density review"><p><a href="checks/woods-footprints-1x.png">Footprints and route</a></p></article><article><h2>FIREFLIES</h2><img src="fireflies-preview.gif" width="32" height="32" alt="Four-frame fireflies loop at native size"></article>'+cards+'</html>')
print('Exported',len(pieces),'Woods assets, four firefly frames and native review scene')
