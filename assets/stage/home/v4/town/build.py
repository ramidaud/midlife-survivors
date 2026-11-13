from pathlib import Path
from collections import Counter
import colorsys, hashlib, json, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).parent
OUT=ROOT/'deliver'
PLAN=json.loads((ROOT/'generation-plan.json').read_text())
PALETTE=json.loads((ROOT/'reference/palette.json').read_text())['palette']
RGB=np.array([tuple(bytes.fromhex(c[1:])) for c in PALETTE],dtype=np.uint8)
ASPHALT={'mall-parking-stalls','mall-drive-aisle'}
FLOORS=ASPHALT|{'mall-walkway-ground','square-brick-plaza','square-concrete-pad'}
NO_INK=set()
OVERHEAD={'mall-walkway-canopy','community-light-strand'}
GROUPS=['strip-mall','town-square','community-center']
GROUP_LABELS={'strip-mall':'Strip Mall','town-square':'Town Square','community-center':'Community Center'}
REUSE={'community-light-posts':'string-light-posts','community-light-strand':'string-light-strand','community-cooler':'cooler'}

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
    if id=='square-concrete-pad':
        # Restrict this material to cool concrete tones; preserve the painted
        # low/high marks rather than turning neutral gray into warm stone.
        lum=a[:,:,0]*.2126+a[:,:,1]*.7152+a[:,:,2]*.0722
        visible=a[:,:,3]>=128;low,high=np.quantile(lum[visible],[.04,.96])
        result=np.zeros_like(a);result[visible,:3]=RGB[2];result[visible,3]=255
        result[visible&(lum<low),:3]=RGB[1];result[visible&(lum>high),:3]=RGB[4]
        return Image.fromarray(result)
    colors,inverse=np.unique(a.reshape(-1,4),axis=0,return_inverse=True)
    mapped=colors.copy()
    for i,(r,g,b,alpha) in enumerate(colors):
        r,g,b,alpha=map(int,(r,g,b,alpha))
        if alpha<128: mapped[i]=0;continue
        hue,sat,value=colorsys.rgb_to_hsv(r/255,g/255,b/255)
        if id in ASPHALT and value<.65 and (sat<.4 or .53<hue<.76): family=[0,1,2]
        elif value<.22: family=[0,1]
        elif .19<hue<.47 and sat>.16: family=[4,17,18,19]
        elif .47<=hue<.59 and sat>.18: family=[1,2,3,4]
        elif .59<=hue<.73 and (value<.78 or sat>.25): family=[0,1,2]
        elif .70<hue<.90 and sat>.12: family=[2,14,8]
        elif hue>.90 and value>.55 and sat<.58: family=[10,12,13,8]
        elif sat<.24 and value<.58: family=[0,1,2,5]
        elif sat<.36 or (value>.72 and sat<.5): family=[5,6,7,8]
        elif id=='square-brick-plaza' and (hue<.19 or hue>.9):family=[9,10,12,16]
        elif hue<.055 or hue>.90: family=[9,10,12,16]
        elif hue<.19:
            if id in ['square-bench','community-potluck-table','community-barricade'] and value<.68: family=[5,6,9,15,16]
            else: family=[9,11,15,16,20]
        else: family=[1,2,3,4]
        # These are paint-only decals, never dark outlined raised objects.
        if id in NO_INK and any(c in family for c in [0,1]): family=[5,6,7,8]
        options=RGB[family].astype(float)
        index=family[int(np.argmin(np.sum((options-[r,g,b])**2,axis=1)))]
        mapped[i,:3]=RGB[index];mapped[i,3]=255
    result=mapped[inverse].reshape(a.shape)
    if id in ['mall-runaway-cart','mall-trash-can']:
        # Map existing upper metal glints to the cream breakable cue.
        visible=a[:,:,3]>=128;rows=np.where(visible)[0];top=int(rows.min());bottom=int(rows.max())+1
        yy=np.indices(visible.shape)[0];lum=a[:,:,0]*.2126+a[:,:,1]*.7152+a[:,:,2]*.0722
        glint=visible&(yy<top+round((bottom-top)*.35))&(lum>.38)
        result[glint,:3]=RGB[6];result[glint&(lum>.48),:3]=RGB[7];result[glint&(lum>.65),:3]=RGB[8]
    if id in ASPHALT:
        # Any dark generated edge is asphalt, never a raised tile outline.
        yy,xx=np.indices(result.shape[:2]);edge=(yy<5)|(yy>=result.shape[0]-5)|(xx<5)|(xx>=result.shape[1]-5)
        ink=np.all(result[:,:,:3]==RGB[0],axis=-1)|np.all(result[:,:,:3]==RGB[1],axis=-1)
        result[edge&ink&(result[:,:,3]>0),:3]=RGB[2]
    return Image.fromarray(result)
