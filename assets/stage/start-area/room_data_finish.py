"""Finish pass: append office density, leaving existing fixtures and gates intact."""
def place_finish(put,placements,workers,specs,occupied,valid,foot,overlap,rectcells,walk,protected):
 before=len(placements);desks=[];panels=[];stacks=[];paper=[]
 # Desk banks frame the clear fighting reserve. Candidate bays are checked against protected aisles.
 candidates=[(x,y) for y in [1856,2176,2384,2528,2896,3152,1504] for x in range(4896,7297,160)]
 candidates.sort(key=lambda q:min((q[0]-x)**2+(q[1]-y)**2 for x,y in [(4976,1856),(5872,1856),(4976,2384),(5872,2384),(6544,2944)]))
 styles=['desk_paperwork','desk_sticky_notes','desk_2009','desk_family_photo','desk_lunch','desk_tidy']
 for x,y in candidates:
  if len(desks)>=24:break
  if any(p['prop'].startswith('desk_') and abs(p['x']-x)<144 and abs(p['y']-y)<152 for p in placements):continue
  id=styles[len(desks)%len(styles)]
  if not valid(specs[id],x,y):continue
  p=put(id,x,y,len(desks)%specs[id]['variants'],'Bullpen / finish desk bank');p['district']='bullpen';desks.append(p)
 # Cubicle panels are attached at the back of desks, with a measured floor union.
 all_desks=[p for p in placements if p['prop'].startswith('desk_')]
 for host in desks+all_desks:
  if len(panels)>=32:break
  if any(p.get('host')==host['id'] for p in panels):continue
  x,y=host['x'],host['y']-64;s=specs['cubicle_panel'];r=foot(s,x,y)
  if not rectcells(r)<=walk or rectcells(r)&protected:continue
  h=foot(specs[host['prop']],host['x'],host['y'])
  others=[q for q in occupied if q!=h]
  if any(overlap(r,q,8) for q in others):continue
  p=dict(id='finish-panel-'+str(len(panels)),prop='cubicle_panel',x=x,y=y,variant=len(panels)%3,district='bullpen',group='Bullpen / cubicle canyons',host=host['id'])
  placements.append(p);occupied.append(r);panels.append(p)
 for i,host in enumerate(desks):
  if i%3==1:workers.append(dict(id='finish-worker-'+str(i),host=host['id'],x=host['x']-8,y=host['y']-68,variant=i%3,cropHeight=34,depthY=host['y']-1))
 hosted={w['host'] for w in workers}
 for host in desks+all_desks:
  if len(stacks)>=14:break
  if host['id'] in hosted or any(p.get('host')==host['id'] for p in stacks):continue
  p=dict(id='finish-crt-'+str(len(stacks)),prop='crt_stack',x=host['x']+16,y=host['y']-52,variant=len(stacks)%3,solid=False,mount='tabletop',depthY=host['y']+3,district='bullpen',group='Bullpen / monitor escalation',host=host['id'])
  placements.append(p);stacks.append(p)
 # Floor papers never create obstacles. They survive the printer's eventual collapse.
 for i,(x,y) in enumerate([(5032,1984),(5512,2208),(5712,1920),(5328,2288),(5136,2112),(5760,2480),(6456,2320),(6736,2560),(6976,2160),(6080,2656),(4912,2864),(5648,2960),(6048,2616),(6072,2632),(5200,3280)]):
  p=dict(id='finish-paper-'+str(i),prop='paper_drift',x=x,y=y,variant=i%3,solid=False,depthY=-1000000000+4,district='bullpen',group='Bullpen / paper drift',alpha=.54)
  placements.append(p);paper.append(p)
 for p in placements:
  if p['prop']=='printer' and p.get('group') in ['Print queue','South cove']:p['caption']='PC LOAD LETTER. It has been expressing itself since the last driver update.'
 return dict(newDesks=len(desks),newWorkers=sum(i%3==1 for i in range(len(desks))),cubiclePanels=len(panels),monitorStacks=len(stacks),paperDrifts=len(paper),newProps=len(placements)-before)
