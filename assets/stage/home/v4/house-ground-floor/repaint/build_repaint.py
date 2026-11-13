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
base.foot_data=bounded_feet
base.build()
# Keep review links and token stylesheet valid at this deeper review location.
shutil.copy2(ROOT/'repaint-plan.json',base.OUT/'generation-plan.json')
review=base.OUT/'review.html'
s=review.read_text().replace('../../../../ui/ms-tokens.css','../../../../../../ui/ms-tokens.css').replace('House ground floor','House-scale repaint').replace('House ground floor','House-scale repaint')
review.write_text(s)

shutil.copy2(ROOT/"README.md",base.OUT/"README.md")

review.write_text(review.read_text().replace('<h2>Rooms in place</h2>','<p><a href="../selected-prompts.json">Selected imagegen prompts</a></p><h2>Rooms in place</h2>'))
