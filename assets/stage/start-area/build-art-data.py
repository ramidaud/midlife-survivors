from pathlib import Path
import json,base64,hashlib
R=Path(__file__).resolve().parent;L=json.loads((R/'layout.json').read_text());assets={}
for id,s in L['assetSpecs'].items():
 file=(R.parent/'props'/s['file']).resolve();a=dict(s);a['src']='data:image/png;base64,'+base64.b64encode(file.read_bytes()).decode();a['sha256']=hashlib.sha256(file.read_bytes()).hexdigest();assets[id]=a
s=json.loads((R.parent/'props/batch-placeholder.json').read_text())[0];file=R.parent/'props'/s['file'];assets[s['id']]={k:v for k,v in s.items() if k not in ['prompt','source']};assets[s['id']]['src']='data:image/png;base64,'+base64.b64encode(file.read_bytes()).decode()
# Keep the character sheet and gate jamb on the same native import path.
s=next(s for s in json.loads((R.parent/'props/batch-2a.json').read_text()) if s['id']=='gate_keycard');assets[s['id']]={k:v for k,v in s.items() if k not in ['prompt','source']};assets[s['id']]['src']='data:image/png;base64,'+base64.b64encode((R.parent/'props'/s['file']).read_bytes()).decode()
(R/'art-data.js').write_text('window.START_AREA_IMAGES = '+json.dumps(assets,separators=(',',':'))+';\n');(R/'manifest.json').write_text(json.dumps({id:{k:v for k,v in s.items() if k!='src'} for id,s in assets.items()},indent=2)+'\n');print('Embedded',len(assets),'native families for the slice; no source paintings loaded.')

decor={}
for a in json.loads((R.parent/'decor/brief-v1.json').read_text()):
 file=R.parent/'decor'/a['file']
 decor[a['id']]={'frame':a['frame'],'src':'data:image/png;base64,'+base64.b64encode(file.read_bytes()).decode()}
with (R/'art-data.js').open('a') as f:f.write('window.FINISH_DECOR = '+json.dumps(decor,separators=(',',':'))+';\n')
