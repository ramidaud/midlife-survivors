"""Apply the imagegen oak repaint only inside the existing tabletop material mask."""
from collections import deque
import json, hashlib
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def build(root, out, base):
 old_path=base/'repaint/deliver/round-coffee-table-v1.png'
 old=Image.open(old_path).convert('RGBA');a=np.array(old);h,w=a.shape[:2]
 source=root/'sources/coffee-table-oak.png';paint=Image.open(source).convert('RGBA')
 box=paint.getchannel('A').point(lambda a:255 if a>=128 else 0).getbbox();cut=paint.crop(box)
 cut.thumbnail(((w-6)*3,(h-6)*3),Image.Resampling.LANCZOS)
 work=Image.new('RGBA',(w*3,h*3));fit=[(w*3-cut.width)//2,h*3-6-cut.height,*cut.size];work.alpha_composite(cut,tuple(fit[:2]))
 work.save(out/'working/coffee-table-oak-painting-3x.png')
 # The original light tabletop is one connected cream material region. Small
 # enclosed candle interiors stay separate and retain their original pixels.
 palette=json.loads((base/'reference/palette.json').read_text())
 cream=[tuple(bytes.fromhex(palette[i][1:])) for i in (5,6,7,8)]
 eligible=(a[:,:,3]>0)&np.any(np.stack([np.all(a[:,:,:3]==c,axis=2) for c in cream]),axis=0)
 seen=np.zeros((h,w),bool);regions=[]
 for sy,sx in zip(*np.where(eligible)):
  if seen[sy,sx]:continue
  seen[sy,sx]=True;q=deque([(int(sx),int(sy))]);region=[]
  while q:
   x,y=q.popleft();region.append((x,y))
   for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
    if 0<=nx<w and 0<=ny<h and eligible[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((nx,ny))
  regions.append(region)
 mask=np.zeros((h,w),bool)
 for x,y in max(regions,key=len):mask[y,x]=True
 # Sample only the painted oak region, excluding the props in the source.
 # Fitting is proportional; no source silhouette or runtime size is stretched.
 b=np.array(work.resize((w,h),Image.Resampling.BOX));lum=b[:,:,:3].mean(2)
 values=lum[mask];low,high=np.quantile(values,[.25,.75])
 oak=[tuple(bytes.fromhex(palette[i][1:])) for i in (5,6,7)]
 final=a.copy();final[mask,:3]=oak[1];final[mask&(lum<low),:3]=oak[0];final[mask&(lum>=high),:3]=oak[2]
 art=Image.fromarray(final);art.save(out/'coffee-table-oak-v1.png')
 # The existing silhouette, outline, dark base and every prop pixel are fixed.
 assert np.array_equal(a[:,:,3],final[:,:,3])
 assert np.array_equal(a[~mask],final[~mask])
 assert len(set(map(tuple,final[mask,:3])))==3
 old_manifest=json.loads((base/'repaint/deliver/manifest-ground-floor.json').read_text())
 original=next(p for p in old_manifest['pieces'] if p['id']=='round-coffee-table')
 record={key:original[key] for key in ('size','kind','renderLayer','feetLine','footPoint','footprints')}
 record.update(id='coffee-table-oak',file='coffee-table-oak-v1.png',source='../sources/coffee-table-oak.png',sourceSize=list(paint.size),sourceCrop=list(box),sourceFit=fit,working='working/coffee-table-oak-painting-3x.png',comparison1x='checks/coffee-table-oak-hero-1x.png',previousArt='../../house-ground-floor/repaint/deliver/round-coffee-table-v1.png',method='Built-in imagegen oak repaint, composited through the largest connected existing cream-material region. All other original pixels retained exactly.',sameSize=art.size==old.size,sameFootprints=record['footprints']==original['footprints'],sameAlpha=True,propsAndBaseUnchanged=True,threeOakTones=True,sha256=hashlib.sha256((out/'coffee-table-oak-v1.png').read_bytes()).hexdigest())
 (out/'coffee-table-manifest.json').write_text(json.dumps(record,indent=2)+'\n')
 hero=Image.open(base/'reference/hero-56x60.png').convert('RGBA');preview=Image.new('RGBA',(520,116),palette[6]);d=ImageDraw.Draw(preview);font=ImageFont.load_default(size=14)
 d.text((8,4),'HERO 1X / BEFORE / LIGHT OAK 1X',font=font,fill=palette[0]);preview.alpha_composite(hero,(8,48));preview.alpha_composite(old,(76,66));preview.alpha_composite(art,(286,66));preview.save(out/record['comparison1x'])
 return record
