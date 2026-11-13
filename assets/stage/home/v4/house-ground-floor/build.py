from pathlib import Path
import colorsys,hashlib,json,shutil
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).parent;OUT=ROOT/'deliver'
PLAN=json.loads((ROOT/'generation-plan.json').read_text())
PALETTE=json.loads((ROOT/'reference/palette.json').read_text())
RGB=np.array([tuple(bytes.fromhex(c[1:])) for c in PALETTE],dtype=np.uint8)
FONT=ImageFont.load_default(size=14)
def mode_reduce(im,w,h,f):
 a=np.array(im);a[a[:,:,3]==0]=0
 packed=(a[:,:,0].astype(np.uint32)<<24)|(a[:,:,1].astype(np.uint32)<<16)|(a[:,:,2].astype(np.uint32)<<8)|a[:,:,3]
 blocks=np.sort(packed.reshape(h,f,w,f).transpose(0,2,1,3).reshape(w*h,f*f),axis=1)
 best=blocks[:,0].copy();most=np.zeros(w*h,dtype=np.uint8)
 for i in range(f*f):
  n=np.sum(blocks==blocks[:,i,None],axis=1);yes=n>most;best[yes]=blocks[yes,i];most[yes]=n[yes]
 best=best.reshape(h,w)
 return np.stack([(best>>24)&255,(best>>16)&255,(best>>8)&255,best&255],axis=-1).astype(np.uint8)
def palette_map(a,p):
 if p['id'] in ['dark-wood-floor','beige-carpet']:
  lum=a[:,:,0]*.2126+a[:,:,1]*.7152+a[:,:,2]*.0722;result=np.zeros_like(a);result[:,:,3]=255
  if p['id']=='dark-wood-floor':
   low,high=np.quantile(lum,[.85,.997]);result[:,:,:3]=RGB[16];result[lum>=low,:3]=RGB[9];result[lum>=high,:3]=RGB[15]
  else:
   low,high=np.quantile(lum,[.10,.95]);result[:,:,:3]=RGB[6];result[lum<low,:3]=RGB[5];result[lum>=high,:3]=RGB[7]
  return Image.fromarray(result)
 if p['id']=='north-wall-strip':
  rgb=a[:,:,:3].astype(float);lum=rgb.mean(2);white=(rgb.min(2)>190)&((rgb.max(2)-rgb.min(2))<45);wall=~white
  result=np.zeros_like(a);result[:,:,3]=255;result[:,:,:3]=RGB[6];low,high=np.quantile(lum[wall],[.005,.995]);result[wall&(lum<low),:3]=RGB[5];result[wall&(lum>high),:3]=RGB[7]
  if white.any():
   lo,hi=np.quantile(lum[white],[.20,.80]);result[white,:3]=RGB[7];result[white&(lum<=lo),:3]=RGB[6];result[white&(lum>=hi),:3]=RGB[8]
  return Image.fromarray(result)
 colors,inverse=np.unique(a.reshape(-1,4),axis=0,return_inverse=True);mapped=colors.copy();id=p['id']
 for i,color in enumerate(colors):
  r,g,b,alpha=map(int,color)
  if alpha<128:mapped[i]=0;continue
  hue,sat,value=colorsys.rgb_to_hsv(r/255,g/255,b/255)
  if id.startswith('fireflies'):family=[6,7,8,20]
  elif id.startswith('forest-trail') and .055<hue<.17 and sat>.25:family=[5,6,7,16]
  elif id=='ornate-silver-mirror' and max(r,g,b)-min(r,g,b)<85 and value>.22:family=[1,2,4,8]
  elif value<.19:family=[0,1]
  elif id in ['manhole','storm-drain']:family=[0,1,2,4,8]
  elif g>r+3 and g>b+10 and .16<hue<.48:family=[17,18,19]
  elif .47<=hue<.59 and sat>.18:family=[1,2,3,4]
  elif .55<=hue<.75 and (value<.80 or sat>.22):family=[0,1,2]
  elif .70<hue<.90 and sat>.14:family=[1,2,14]
  elif hue>.90 and value>.55 and sat<.58:family=[10,12,13,8]
  elif sat<.24 and value<.58:family=[0,1,2,5]
  elif sat<.36 or (value>.72 and sat<.50):family=[5,6,7,8]
  elif hue<.055 or hue>.90:family=[9,10,12,16]
  elif hue<.19:family=[5,6,9,15,16,20]
  else:family=[1,2,3,4]
  idx=family[int(np.argmin(np.sum((RGB[family].astype(float)-[r,g,b])**2,axis=1)))];mapped[i,:3]=RGB[idx];mapped[i,3]=255
 result=mapped[inverse].reshape(a.shape)
 if id=='cream-sofa':
  rgb=a[:,:,:3].astype(float);olive=(rgb[:,:,1]>rgb[:,:,0]*.94)&(rgb[:,:,1]>rgb[:,:,2]*1.4)&(rgb[:,:,0]>rgb[:,:,2]*1.15)&(a[:,:,3]>=128)
  lum=rgb.mean(2);low,high=np.quantile(lum[olive],[.20,.70]);result[olive,:3]=RGB[18];result[olive&(lum<low),:3]=RGB[19];result[olive&(lum>=high),:3]=RGB[17]
 if id=='fireflies-loop':
  # Tonal interpretation stays within the painted glow, preserving its silhouette.
  for yy in range(2):
   for xx in range(2):
    region=a[yy*32:(yy+1)*32,xx*32:(xx+1)*32];target=result[yy*32:(yy+1)*32,xx*32:(xx+1)*32];visible=region[:,:,3]>=128;lum=region[:,:,:3].mean(2)
    low,high=np.quantile(lum[visible],[.35,.80]);target[visible,:3]=RGB[7];target[visible&(lum<=low),:3]=RGB[20];target[visible&(lum>=high),:3]=RGB[8]
 if id.startswith('forest-'):

  # Preserve painted grass marks while using the approved lawn base broadly.
  rgb=a[:,:,:3].astype(float);grass=(rgb[:,:,1]>rgb[:,:,0]+3)&(rgb[:,:,1]>rgb[:,:,2]+10)&(a[:,:,3]>=128)
  lum=rgb[:,:,0]*.2126+rgb[:,:,1]*.7152+rgb[:,:,2]*.0722
  low,base=np.quantile(lum[grass],[.02,.30]);result[grass,:3]=RGB[17];result[grass&(lum<base),:3]=RGB[18];result[grass&(lum<low),:3]=RGB[19]
 return Image.fromarray(result)


def normalize_source(p,im):
 w,h=p['size'];f=p['factor'];opaque=p['ground'] or p['id'] in ['north-wall-strip','side-wall-strip']
 box=[0,0,im.width,im.height] if opaque else list(im.getchannel('A').point(lambda v:255 if v>=128 else 0).getbbox())
 if p['id']=='side-wall-strip':
  data=np.array(im);mask=(data[:,:,:3].min(2)<230)&((data[:,:,:3].max(2).astype(float)-data[:,:,:3].min(2))>18);ys,xs=np.where(mask[im.height//10:im.height*9//10]);box=[int(xs.min()),im.height//10,int(xs.max()+1),im.height*9//10]

 cut=im.crop(box);work=Image.new('RGBA',(w*f,h*f));margin=0 if opaque else 3
 if opaque:
  a=np.array(cut);a[:,:,3]=255;cut=Image.fromarray(a)
 fit=[margin*f,margin*f,(w-2*margin)*f,(h-2*margin)*f];work.paste(cut.resize(tuple(fit[2:]),Image.Resampling.LANCZOS),tuple(fit[:2]))
 return work,box,fit
def foot_data(p,art):
 id=p['id'];w,h=art.size;l,t,r,b=art.getbbox();line=b-4;x=(l+r)//2
 if p['kind']!='WALL':return line,[x,line],[]
 if id in ['drum-floor-lamp','arched-floor-lamp']:
  a=np.array(art);xs=np.where(a[max(t,b-10):b,:,3]>0)[1];x=int(np.median(xs));fp=[max(0,x-6),b-12,12,8]
 elif id in ['potted-pothos','potted-orchid','bird-of-paradise']:fp=[max(0,x-10),b-18,20,14]
 elif id in ['storage-bench-west','electric-console-east','kitchen-counter-east','kitchen-counter-west']:fp=[l+4,t+8,r-l-8,b-t-16]
 elif id=='corner-computer-desk':return line,[x,line],[[l+6,b-38,r-l-12,34],[r-42,t+28,36,b-t-34]]
 elif id=='cream-sofa':fp=[l+6,t+12,r-l-12,b-t-20]
 elif id=='leather-recliner':fp=[l+8,b-54,r-l-16,50]
 elif id=='racing-sim-rig':fp=[l+6,t+30,r-l-12,b-t-34]
 elif id in ['round-coffee-table','round-dining-table']:fp=[l+8,b-40,r-l-16,36]
 elif id=='leaning-abstract-painting':fp=[l+6,b-9,r-l-12,5]
 elif id in ['magnet-fridge','stove-microwave']:fp=[l+5,b-38,r-l-10,34]
 else:fp=[l+4,b-28,r-l-8,24]
 return line,[x,line],[fp]
def comparison(p,art,hero):
 old=Image.open(ROOT/'reference'/(p['oldReference']+'.png')).convert('RGBA');w,h=art.size;H=max(h,old.height,60)+92
 out=Image.new('RGB',(max(650,128+w+32+old.width+160),H),'#D3B78D');d=ImageDraw.Draw(out)
 for xy,text in [((12,8),p['id']),((12,34),'HERO 56x60'),((128,34),'NEW ART 1X'),((128+w+32,34),'EXISTING HOUSE KIT 1X')]:d.text(xy,text,font=FONT,fill='#171C35')
 baseline=H-12
 for im,xy in [(hero,(24,baseline-60)),(art,(128,baseline-h)),(old,(128+w+32,baseline-old.height))]:out.paste(im,xy,im)
 return out
def build():
 for folder in ['sources','working','checks','reference','mockups']:
  if folder!='sources' or globals().get('COPY_SOURCES',True):(OUT/folder).mkdir(parents=True,exist_ok=True)
 # Only existing game art and public layout data are copied. Private photos never enter deliver/.
 for source in (ROOT/'reference').iterdir():
  if source.is_file() and not source.name.endswith('-3x.png'):shutil.copy2(source,OUT/'reference'/source.name)
 hero=Image.open(ROOT/'reference/hero-56x60.png').convert('RGBA');pieces=[]
 retained={p['id']:p for p in globals().get('RETAINED_PIECES',[])}
 for p in PLAN:
  if p['id'] in retained:
   pieces.append(retained[p['id']]);continue
  source=ROOT/'sources'/f"{p['id']}.png"
  if not source.exists():continue
  im=Image.open(source).convert('RGBA');work,box,fit=normalize_source(p,im);w,h=p['size'];f=p['factor'];working=f"working/{p['id']}-{f}x.png";work.save(OUT/working)
  art=palette_map(mode_reduce(work,w,h,f),p);file=p['id']+'-v1.png';art.save(OUT/file);shutil.copy2(source,OUT/'sources'/source.name) if globals().get('COPY_SOURCES',True) else None;line,point,fp=foot_data(p,art)
  kind='WALL' if p['kind']=='WALL' else 'WALK-THROUGH';layer='wall-mounted' if p['kind']=='WALL-DECOR' else 'over-everything' if p['kind']=='OVER' else 'ground' if p['kind'] in ['GROUND','WALK-THROUGH'] else 'furniture'
  record={'id':p['id'],'file':file,'room':p['room'],'size':[w,h],'kind':kind,'renderLayer':layer,'feetLine':line,'footPoint':point,'footprints':fp,'visibleBounds':list(art.getbbox()),'source':globals().get('SOURCE_PREFIX','sources/')+source.name,'sourceSize':list(im.size),'sourceCrop':box,'sourceFit':fit,'working':working,'workingSize':list(work.size),'reductionFactor':f,'referenceRoles':p['referenceRoles'],'oldReference':'reference/'+p['oldReference']+'.png','comparison1x':f"checks/{p['id']}-hero-reference-1x.png",'footprintPreview':f"checks/{p['id']}-footprint-1x.png"}
  if 'fitNote' in p:record['fitNote']=p['fitNote']
  comparison(p,art,hero).save(OUT/record['comparison1x']);overlay=Image.new('RGB',(w,h),'#D3B78D');overlay.paste(art,(0,0),art);d=ImageDraw.Draw(overlay)
  for x,y,fw,fh in fp:d.rectangle((x,y,x+fw-1,y+fh-1),outline='#C45C4B',width=2)
  d.line((0,line,w-1,line),fill='#FFF0CF');x,y=point;d.line((x-3,y,x+3,y),fill='#EF9347');d.line((x,y-3,x,y+3),fill='#EF9347');overlay.save(OUT/record['footprintPreview']);pieces.append(record)
 manifest={'status':'Ground floor art review, awaiting approval. No runtime placement. Upstairs deferred.','privacy':'Private attached house photos are reference-only and excluded from this package, including all comparisons and mockups. New paintings contain no people or identifying text; framed pictures are nonfigurative art/landscapes.','method':'Built-in imagegen paintings normalized to exact 2x/3x working canvases, exact RGBA block mode, then material-family palette mapping. Generator dimensions vary; originals, source fit and exact working files retained. No code-built world shapes.','palette':PALETTE,'heroReference':'Complete unscaled 56x60 live office-worker v4 frame including transparent margins.','layoutSource':'src/data/house-v2.js at750b81a; art-only placement proposals, not runtime changes.','coordinates':'Native pixels: feetLine y; footPoint[x,y]; footprints[x,y,width,height]. Proposed anchors and collision rectangles, not runtime-tested. Wall decorations and overhead pieces have empty collision footprints.','layoutNotes':['Dining and downstairs desk nook overlap in current HOUSE_V2 and are staged as one shared room with individual crops.','Circulation is only 136px wide. It remains fully clear; the 224px target would require a separately approved layout change.','North-wall art may overhang north of the floor rect; floor footprints remain inside. Side cabinets show top and narrow front edge. South walls are cut away.'],'pieces':pieces}
 (OUT/'manifest-ground-floor.json').write_text(json.dumps(manifest,indent=2)+'\n');validate(pieces);mockups(pieces,hero);review(pieces);print('Built',len(pieces),'of',len(PLAN),'pieces')
def validate(pieces):
 checks=[];palette=set(map(tuple,RGB.tolist()))
 for p in pieces:
  art=Image.open(OUT/p['file']).convert('RGBA');a=np.array(art);w,h=art.size;colors=set(map(tuple,a[:,:,:3][a[:,:,3]>0].tolist()));plan=next(x for x in PLAN if x['id']==p['id']);work=Image.open(OUT/p['working']).convert('RGBA');f=p['reductionFactor']
  c={'id':p['id'],'size':[w,h]==p['size'],'exactWorking':list(work.size)==[w*f,h*f],'integerFactor':f in [2,3],'palette':colors.issubset(palette),'threeColors':len(colors)>=3,'binaryAlpha':set(a[:,:,3].ravel()).issubset({0,255}),'boundedFeet':0<=p['footPoint'][0]<w and 0<=p['footPoint'][1]<h,'boundedFootprints':all(x>=0 and y>=0 and fw>0 and fh>0 and x+fw<=w and y+fh<=h for x,y,fw,fh in p['footprints']),'kindFootprints':bool(p['footprints']) if p['kind']=='WALL' else not p['footprints'],'exactReduction':np.array_equal(np.array(palette_map(mode_reduce(work,w,h,f),plan)),a),'sha256':hashlib.sha256((OUT/p['file']).read_bytes()).hexdigest()}
  if plan['ground']:c['opaqueGround']=bool(np.all(a[:,:,3]==255))
  material_groups={
   'cream-sofa':{'cream cloth':[5,6,7,8],'olive cloth':[17,18,19],'rust cloth':[9,10,12,15,16]},
   'window-olive-curtains':{'cream blinds':[5,6,7,8],'olive curtains':[17,18,19]},
   'potted-pothos':{'foliage':[17,18,19]},'bird-of-paradise':{'foliage':[17,18,19]},
   'dark-wood-floor':{'wood':[9,15,16]},'beige-carpet':{'carpet':[5,6,7]},
   'white-oak-sink-counter':{'white cabinetry':[5,6,7,8],'oak trim':[5,6,9,15,16]},
   'kitchen-counter-west':{'white cabinetry':[5,6,7,8],'oak trim':[5,6,9,15,16]},
   'kitchen-counter-east':{'white cabinetry':[5,6,7,8],'oak trim':[5,6,9,15,16]},
   'stove-microwave':{'white enamel':[5,6,7,8]},'magnet-fridge':{'white enamel':[5,6,7,8]},
   'ornate-silver-mirror':{'silver':[1,2,4,8]},'round-dining-table':{'wood':[5,6,9,15,16]},
   'round-coffee-table':{'wood':[5,6,9,15,16]},'corner-computer-desk':{'wood':[5,6,9,15,16]},
   'fluted-media-console':{'wood':[5,6,9,15,16]},'camera-book-shelves':{'wood':[5,6,9,15,16]},
  }.get(p['id'],{})
  c['materialToneCounts']={name:sum(tuple(RGB[i]) in colors for i in indices) for name,indices in material_groups.items()}
  c['majorMaterialsThreeTones']=all(count>=3 for count in c['materialToneCounts'].values())
  checks.append(c)
 (OUT/'validation-ground-floor.json').write_text(json.dumps({'expectedPieces':len(PLAN),'actualPieces':len(pieces),'passed':len(pieces)==len(PLAN) and all(v for c in checks for v in c.values() if isinstance(v,bool)),'checks':checks},indent=2)+'\n')
def mockups(pieces,hero):
 # Separate module keeps room composition recipes distinct from artwork preparation.
 import importlib.util
 spec=importlib.util.spec_from_file_location('rooms',ROOT/'room_mockups.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);mod.build(ROOT,OUT,pieces,hero)
def review(pieces):
 style='body{margin:0;background:var(--ms-bg);color:var(--ms-text);font:var(--ms-body)/1.5 var(--ms-font-read)}main{padding:var(--ms-space-5)}h1{font-size:var(--ms-headline)}h2{font-size:var(--ms-title)}a{color:var(--ms-text);display:inline-flex;align-items:center;min-height:var(--ms-touch)}figure{margin:0;overflow:auto}img{max-width:none;image-rendering:pixelated}article{padding:var(--ms-space-4) 0;border-top:var(--ms-border-w) solid var(--ms-line)}'
 body='<h1>House ground floor</h1><p>Art approval only. Photos remain private and are excluded from this package. Nothing is placed in the game. Upstairs follows after approval.</p><p><a href="manifest-ground-floor.json">Manifest</a> · <a href="validation-ground-floor.json">Validation</a> · <a href="README.md">Notes</a> · <a href="generation-plan.json">Painting prompts</a></p><h2>Rooms in place</h2>'
 if (OUT/'mockups/room-layout.json').exists():
  rooms=json.loads((OUT/'mockups/room-layout.json').read_text())
  body+='<p>The dining and desk rectangles overlap, so their main mock-up shows a shared room. Native art and the 56x60 hero stay at 1x. North-wall art extends above the floor rect. The 136px hall remains clear; a 224px hall needs a layout change.</p>'
  for room in rooms['views']:
   if room['id']=='whole-ground-floor':
    body+='<p><a href="mockups/whole-ground-floor-1x.png">Full ground floor at 1x</a> · <a href="mockups/whole-ground-floor-footprints-1x.png">Full-floor footprints</a></p>';continue
   body+=f'<article><h2>{room["id"]}</h2><p>{room["note"]}</p><figure><img src="{room["file"]}" alt="{room["id"]} room at native size"></figure><p><a href="{room["overlay"]}">Footprints and path overlay</a></p></article>'
 body+='<h2>Every piece at 1x</h2>'
 for p in pieces:body+=f'<article><h2>{p["id"]}</h2><p>{p["size"][0]} x {p["size"][1]} · {p["kind"]} · {p["renderLayer"]}</p><figure><img src="{p["comparison1x"]}" alt="{p["id"]} beside the full 56 by60 hero and existing game art"></figure><p><a href="{p["file"]}">Native PNG</a> · <a href="{p["footprintPreview"]}">Feet and footprint overlay</a></p></article>'
 (OUT/'review.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>House ground floor art review</title><link rel="stylesheet" href="../../../../ui/ms-tokens.css"><style>'+style+'</style><main>'+body+'</main></html>')
if __name__=='__main__':build()

