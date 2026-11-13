"""Rebuild separate house-scale review without changing approved PR #10 art."""
from pathlib import Path
import importlib.util,json,shutil
ROOT=Path(__file__).resolve().parent
BASE=ROOT.parent
spec=importlib.util.spec_from_file_location('base_build',BASE/'build.py');base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
base.ROOT=ROOT;base.OUT=ROOT/'deliver';base.PLAN=json.loads((ROOT/'repaint-plan.json').read_text())
shutil.copytree(BASE/'reference',ROOT/'reference',dirs_exist_ok=True)
original_feet=base.foot_data
def bounded_feet(p,art):
 line,point,fps=original_feet(p,art)
 w,h=art.size
 if p["id"]=="fluted-media-console":fps=[[7,7,w-14,h-14]]
 adjusted=[]
 for x,y,fw,fh in fps:
  x=max(0,min(x,w-1));y=max(0,min(y,h-1));adjusted.append([x,y,max(1,min(fw,w-x)),max(1,min(fh,h-y))])
 return line,point,adjusted
base.COPY_SOURCES=False
base.SOURCE_PREFIX="../sources/"
base.foot_data=bounded_feet
original_normalize=base.normalize_source
def proportional_normalize(p,im):
 if p.get('fitMode')!='contain':return original_normalize(p,im)
 from PIL import Image
 w,h=p['size'];f=p['factor'];margin=3*f
 box=list(im.getchannel('A').point(lambda v:255 if v>=128 else 0).getbbox())
 cut=im.crop(box);cut.thumbnail((w*f-2*margin,h*f-2*margin),Image.Resampling.LANCZOS)
 work=Image.new('RGBA',(w*f,h*f));x=(work.width-cut.width)//2;y=work.height-margin-cut.height
 work.paste(cut,(x,y))
 return work,box,[x,y,cut.width,cut.height]
base.normalize_source=proportional_normalize
selected={p['id'] for p in base.PLAN if p.get('fitMode')=='contain'}
base.RETAINED_PIECES=[p for p in json.loads((base.OUT/'manifest-ground-floor.json').read_text())['pieces'] if p['id'] not in selected]
base.build()
# Keep review links and token stylesheet valid at this deeper review location.
shutil.copy2(ROOT/'repaint-plan.json',base.OUT/'generation-plan.json')
review=base.OUT/'review.html'
s=review.read_text().replace('../../../../ui/ms-tokens.css','../../../../../../ui/ms-tokens.css').replace('House ground floor','House-scale repaint').replace('House ground floor','House-scale repaint')
review.write_text(s)

shutil.copy2(ROOT/"README.md",base.OUT/"README.md")

review.write_text(review.read_text().replace('<h2>Rooms in place</h2>','<p><a href="../selected-prompts.json">Selected imagegen prompts</a></p><h2>Rooms in place</h2>'))

review.write_text(review.read_text().replace('<h2>Rooms in place</h2>','<p><a href="../review-fixes-prompts.json">Latest review repaint prompts</a></p><h2>Rooms in place</h2>'))
review.write_text(review.read_text().replace('<h1>House-scale repaint</h1>','<h1>House round-two review</h1><p><strong>Clearance needs review:</strong> the fixed living-room layout has no connected 96 px route between checked doors. Nothing placed in the game.</p><p><a href="../round2-prompts.json">Round-two repaint notes</a> · <a href="../placements-round2.json">Rami’s round-two layout</a> · <a href="route-checks.json">Route checks</a></p>'))
