"""Check export integrity and report painted connection geometry independently."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'deliver'
data=json.loads((OUT/'manifest-roads.json').read_text())
assert len(data['pieces'])==17
def asphalt_mask(rgb):
    return np.any(np.all(rgb[None,...,:3]==np.array([[70,83,107],[82,96,120],[101,116,139]])[:,None,None,:],axis=-1),axis=0)
def asphalt_span(line):
    assert line[128] and line[384]
    lo=128;hi=385
    while lo>0 and line[lo-1]:lo-=1
    while hi<len(line) and line[hi]:hi+=1
    return [lo,hi]
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
    if 'connections' in p:
        assert np.all(a[:,:,3]==255),p['id']
        # Probe continuous asphalt adjacent to each curb, excluding isolated curb
        # pixels that happen to share the asphalt palette color.
        rgb=a[:,:,:3].astype(int)
        road=asphalt_mask(rgb)
        collars={'north':road[:16,:], 'south':road[-16:,:],
                 'west':road[:,:16].T, 'east':road[:,-16:].T}
        if p['id'].startswith('street-ns-'): expected={'north','south'}
        elif p['id'].startswith('street-ew-'): expected={'east','west'}
        elif p['id']=='crossing-four-way': expected={'north','south','east','west'}
        else:
            stem=p['id'].split('-')[-1]
            expected={stem}|({'east','west'} if stem in ('north','south') else {'north','south'})
        assert set(p['connections'])==expected,p['id']
        openings={}
        for side,lines in collars.items():
            if side not in expected:
                assert np.mean(lines[:,128]&lines[:,384])<.5,(p['id'],side,'closed side has road')
                continue
            spans=[]
            for line in lines:
                assert line[128] and line[384],(p['id'],side,'asphalt probes')
                lo,hi=asphalt_span(line)
                assert [lo,hi]==[96,416],(p['id'],side,lo,hi)
                spans.append([lo,hi])
            openings[side]={'range':[96,416],'span':320,'collarDepth':16,'rowsChecked':len(spans)}
        report['paintedOpenings']=openings
        report['exact320pxConnections']=True
        colors={tuple(c) for c in np.unique(a[:,:,:3].reshape(-1,3),axis=0)}
        assert all(tuple(c) in colors for c in [[70,83,107],[82,96,120],[101,116,139]]),p['id']
        report['asphaltTones']=3
        for side in expected:
            strip={'north':a[:16,220:290], 'south':a[-16:,220:290],
                   'west':a[220:290,:16], 'east':a[220:290,-16:]}[side]
            cream=(strip[:,:,0]>200)&(strip[:,:,1]>170)&(strip[:,:,2]>100)
            positions=np.nonzero(cream)[1 if side in ('north','south') else 0]+220
            assert len(positions) and abs(float(np.median(positions))-256)<=1,(p['id'],side,'lane center')
        report['centerLinesAligned']=True
    reports.append(report)
# Compare actual pixels across shared connection collars, including parkways and
# inner sidewalks, not just manifest declarations.
reference_ns=np.array(Image.open(OUT/'street-ns-a-v1.png'))[:16,64:448]
reference_ew=np.array(Image.open(OUT/'crossing-four-way-v1.png'))[64:448,:16]
for p in data['pieces']:
    if 'connections' not in p: continue
    a=np.array(Image.open(OUT/p['file']))
    for side in p['connections']:
        collar={'north':a[:16,64:448],'south':a[-16:,64:448],
                'west':a[64:448,:16],'east':a[64:448,-16:]}[side]
        expected=reference_ns if side in ('north','south') else reference_ew
        assert np.array_equal(collar,expected),(p['id'],side,'collar pixels differ')
# Regression: palette-colored curb pixels must not widen the road, while a
# shifted real edge must fail the 320px contract.
probe=asphalt_mask(np.array(Image.open(OUT/'street-ns-a-v1.png'))[:1,:,:3])[0]
assert asphalt_span(probe)==[96,416]
curb=probe.copy();curb[91]=True;assert asphalt_span(curb)==[96,416]
wide=probe.copy();wide[95]=True;assert asphalt_span(wide)==[95,416]
narrow=probe.copy();narrow[96]=False;assert asphalt_span(narrow)==[97,416]
result={'regressionsPass':True,'exportChecksPass'  :True,'connectionStatus':'PASS: every open connection has a 320px asphalt span through its full 16px collar; closed sides stay closed.','openConnectionCount':sum(len(p.get('paintedOpenings',{})) for p in reports),'pieces':reports,'browser':'Local file navigation blocked by browser URL policy. No alternate browser route attempted. Native image inspection performed; device browser layout unverified.'}
(OUT/'checks/export-checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
