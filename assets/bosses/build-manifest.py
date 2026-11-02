"""Optional art manifest authoring. No game configuration is changed."""
from pathlib import Path
import json,hashlib
R=Path(__file__).resolve().parent
brief=json.loads((R/'brief.json').read_text());markers={a['id']:a for a in json.loads((R/'marker-brief.json').read_text())}
assets=[]
for b in brief:
 id=b['id'];a={k:v for k,v in b.items() if k not in ['prompt','subject']}
 a.update(file='boss-'+id+'-v1.png',source='sources/'+id+'-source-v1.png',frame=[144,152],columns=4,rows=3,frameCount=11,blankCells=[11],footPoint=[72,148],origin=[.5,148/152],minimumPadding=4,drawSize=[144,152],facing='down three-quarter; mirror as needed',colorways=1,animationTiming='review proposals only, not attack logic',animations={'walk':{'frames':list(range(6)),'delay':180 if id=='30-year-mortgage' else 110 if id=='midlife-crisis-v8' else 140,'loop':True},'windup':{'frames':[6,7],'delay':220,'loop':False},'attack':{'frames':[8,9],'delay':130,'loop':False},'hurt':{'frames':[10],'delay':160,'loop':False}},marker={'file':'telegraph-'+id+'-v1.png','source':'sources/'+id+'-telegraph-source-v1.png','frame':markers[id]['frame'],'origin':[.5,.5],'solid':False,'rotation':'charge points right; rotate decal as needed'},integrationNote='Native draw size already replaces the old approximately 2.3x art. Do not multiply these 144x152 frames by 2.3 again. Claude owns bodies, attack timing and marker collision.',sha256=hashlib.sha256((R/('boss-'+id+'-v1.png')).read_bytes()).hexdigest())
 if (R/('sources/'+id+'-attack-source-v2.png')).exists():a['attackCorrection']='sources/'+id+'-attack-source-v2.png'
 if id=='30-year-mortgage':a['walkCorrection']={'source':'sources/30-year-mortgage-walk-source-v2.png','frames':[4,5],'reason':'Weight-bearing and passing poses complete the right-foot half.'}
 if id=='performance-review':a['walkSourceOrder']=[0,1,3,2,4,5]
 assets.append(a)
M=dict(status='art-only-awaiting-rami-review',generation='built-in imagegen',bosses=3,poseFrames=33,telegraphs=3,background='#FF00FF',palette=json.loads((R.parent/'breakables/manifest.json').read_text())['palette'],assets=assets,gameCodeChanged=False)
(R/'manifest.json').write_text(json.dumps(M,indent=2)+'\n');print('Authored three boss animation manifests; no runtime integration.')
