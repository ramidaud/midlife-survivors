"""Check export integrity and report painted connection geometry independently."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'deliver'
data=json.loads((OUT/'manifest-roads.json').read_text())
reports=[]
for p in data['pieces']:
    im=Image.open(OUT/p['file']); a=np.array(im)
    assert im.mode=='RGBA' and list(im.size)==p['size'],p['id']
    assert set(np.unique(a[:,:,3])) <= {0,255},p['id']
    work=Image.open(OUT/p['working']);f=p['reductionFactor']
    assert work.size==(im.width*f,im.height*f)
    for key in ('source','comparison1x'):
        assert (OUT/p[key]).is_file(),(p['id'],key)
    for x,y,w,h in p['footprints']:
        assert 0<=x<x+w<=im.width and 0<=y<y+h<=im.height
    report={'id':p['id'],'exportPass':True}
    if im.width==512:
        assert np.all(a[:,:,3]==255),p['id']
        # Asphalt is blue-gray; use several rows to avoid individual painted dashes.
        rgb=a[:,:,:3].astype(int)
        road=np.all(rgb==[82,96,120],axis=2)
        edges={'north':road[:4].mean(0)>.5,'south':road[-4:].mean(0)>.5,'west':road[:,:4].mean(1)>.5,'east':road[:,-4:].mean(1)>.5}
        openings={}
        for side,mask in edges.items():
            positions=np.flatnonzero(mask)
            if len(positions)>100:
                groups=np.split(positions,np.flatnonzero(np.diff(positions)>8)+1)
                positions=max(groups,key=len)
                lo,hi=int(positions[0]),int(positions[-1])+1
                openings[side]={'range':[lo,hi],'span':hi-lo,'offsetsFrom320pxBand':[lo-96,hi-416]}
        report['paintedOpenings']=openings
        report['exact320pxConnections']=all(v['range']==[96,416] for v in openings.values())
    reports.append(report)
result={'exportChecksPass':True,'connectionStatus':'Measured proposals. Exact alignment is separate from export integrity and needs approval/correction before runtime placement.','pieces':reports,'browser':'Local file navigation blocked by browser URL policy. No alternate browser route attempted. Native image inspection performed; device browser layout unverified.'}
(OUT/'checks/export-checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
