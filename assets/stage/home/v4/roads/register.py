"""Register painted source strips to the tile contract; no world shapes are drawn.

All output pixels are resampled from the imagegen paintings. The 16px connection
collars reuse upright painted strips, never rotated artwork. This separates the
painter's approximate geometry from the exact dimensions needed by a tile atlas.
"""
from PIL import Image
import numpy as np

ASPHALT = [[70,83,107],[82,96,120],[101,116,139]]
COLLAR = 16
TARGET = [0,96,256,416,512]

def lane_center(im,side='west'):
    a=np.array(im)
    strip=a[:,:64] if side=='west' else a[:,-64:]
    cream=(strip[:,:,0]>200)&(strip[:,:,1]>170)&(strip[:,:,2]>100)
    yy=np.nonzero(cream[220:290])[0]+220
    return int(np.median(yy)) if len(yy) else 256

def slices(im, xs, ys, tx, ty):
    out=Image.new('RGBA',(tx[-1],ty[-1]))
    for j in range(len(ys)-1):
        for i in range(len(xs)-1):
            crop=im.crop((xs[i],ys[j],xs[i+1],ys[j+1]))
            crop=crop.resize((tx[i+1]-tx[i],ty[j+1]-ty[j]),Image.Resampling.NEAREST)
            out.paste(crop,(tx[i],ty[j]))
    return out

def source_native(root,id,paint):
    source=Image.open(root/'sources'/f'{id}.png').convert('RGBA')
    w=832 if id.startswith('street-ew-') else 512
    h=832 if id.startswith('street-ns-') else 512
    work=source.resize((w*2,h*2),Image.Resampling.LANCZOS)
    raw=paint.mode_reduce(work,w,h,2)
    mapped=np.array(paint.palette_map(raw,{'id':id}))
    rgb=raw[:,:,:3].astype(float)
    material=(np.linalg.norm(rgb-[82,96,120],axis=2)<32)&(raw[:,:,3]>0)
    luminance=rgb.mean(2)
    low,high=np.quantile(luminance[material],[.02,.98])
    mapped[material,:3]=ASPHALT[1]
    mapped[material&(luminance<low),:3]=ASPHALT[0]
    mapped[material&(luminance>high),:3]=ASPHALT[2]
    return Image.fromarray(mapped)

def register(root,paint):
    a=source_native(root,'street-ns-a',paint)
    a=slices(a,[0,60,100,412,452,512],[0,832],[0,64,96,416,448,512],[0,832])
    b=source_native(root,'street-ns-b',paint)
    b=slices(b,[0,68,111,402,446,512],[0,832],[0,64,96,416,448,512],[0,832])
    cross=source_native(root,'crossing-four-way',paint)
    cross=slices(cross,[0,97,256,416,512],[0,107,lane_center(cross),408,512],TARGET,TARGET)
    # Collars come from complete painted bands, including curbs, grass and paving.
    def align_lines(strip):
        rows=np.array(strip); result=[]
        cream=(rows[:,:,0]>200)&(rows[:,:,1]>170)&(rows[:,:,2]>100)
        xx=np.nonzero(cream[:,220:290])[1]+220
        center=int(np.median(xx)) if len(xx) else 256
        for row in rows:
            mask=np.any(np.all(row[None,:,:3]==np.array(ASPHALT)[:,None,:],axis=2),axis=0)
            lo=128;hi=385
            assert mask[128] and mask[384]
            while lo>0 and mask[lo-1]:lo-=1
            while hi<512 and mask[hi]:hi+=1
            line=Image.fromarray(row[None,:,:])
            result.append(np.array(slices(line,[0,lo,center,hi,512],[0,1],TARGET,[0,1]))[0])
        return Image.fromarray(np.stack(result))
    ns=align_lines(a.crop((0,0,512,COLLAR)))
    ew=align_lines(cross.crop((0,0,COLLAR,512)).transpose(Image.Transpose.TRANSPOSE)).transpose(Image.Transpose.TRANSPOSE)
    # Corresponding sides share a band and shade orientation, not a rotation.
    paintings={'street-ns-a':a,'street-ns-b':b,'crossing-four-way':cross}
    for d in ('north','south','east','west'):
        im=source_native(root,'junction-t-'+d,paint)
        paintings['junction-t-'+d]=slices(im,[0,97,256,416,512],[0,107,lane_center(im,'east' if d=='east' else 'west'),408,512],TARGET,TARGET)
    openings={
        'street-ns-a':['north','south'],'street-ns-b':['north','south'],
        'crossing-four-way':['north','south','east','west'],
        'junction-t-north':['north','east','west'],
        'junction-t-south':['south','east','west'],
        'junction-t-east':['east','north','south'],
        'junction-t-west':['west','north','south']}
    for variant in ('a','b'):
        id='street-ew-'+variant
        im=source_native(root,id,paint)
        rgb=np.array(im)[:,:16,:3].transpose(1,0,2)
        spans=[]
        for row in rgb:
            mask=np.any(np.all(row[None,:,:]==np.array(ASPHALT)[:,None,:],axis=2),axis=0)
            lo=128;hi=385
            while lo>0 and mask[lo-1]:lo-=1
            while hi<512 and mask[hi]:hi+=1
            spans.append((lo,hi))
        lo,hi=np.median(spans,axis=0).astype(int).tolist()
        paintings[id]=slices(im,[0,832],[0,64,lo,lane_center(im),hi,448,512],[0,832],[0,64,96,256,416,448,512])
        openings[id]=['east','west']
    for id,im in paintings.items():
        for side in openings[id]:
            if side=='north':im.paste(ns,(0,0))
            if side=='south':im.paste(ns,(0,im.height-COLLAR))
            if side=='west':im.paste(ew,(0,0))
            if side=='east':im.paste(ew,(im.width-COLLAR,0))
    return paintings,openings
