"""Executive assembly only. Does not alter navigation or spawning."""
from room_data_2e import CAP

def place_executive(put,placements,workers):
 labels=[];decor=[];walls=[]
 def fixed(prop,x,y,v=0,caption=None,**extra):
  p=put(prop,x,y,v,'Executive / '+prop)
  assert (p['x'],p['y'])==(x,y),('Executive fixture moved',prop,x,y,p)
  p.update(district='executive',**extra)
  if caption:p['caption']=CAP.get(caption,caption)
  return p
 fixed('reception_counter',5728,272,2,'A smaller desk to decide who gets to see the bigger desk.')
 for i,x in enumerate([6080,6240,6400,6560]):fixed('visitor_chair',x,272,i%3,'exec_visitor_chair')
 fixed('executive_desk',7152,480,0,'The standing desk has been seated since the procurement meeting.')
 fixed('exec_credenza',7408,1200,0,'exec_credenza')
 p=put('skyline_window',7152,184,0,'Executive / skyline',wall=True);p.update(district='executive',depthY=193,caption='Corner office energy. The view has better work-life balance than anyone in the room.',readAt=[7152,352])
 p=put('founder_portrait',6960,184,0,'Executive / founder',wall=True);p.update(district='executive',depthY=193,caption=CAP['exec_founder_portrait'],readAt=[6960,352])
 placements.append(dict(id='executive-putting-mat',prop='putting_mat',x=7152,y=864,variant=0,solid=False,depthY=-1000000000+4,district='executive',group='Executive / short game',caption=CAP['exec_putting_mat']))
 for i,(prop,x,y,v) in enumerate([('plant',5464,640,0),('cabinet',5464,800,0),('coat_rack',5464,960,0),('water_cooler',6160,272,1),('plant',6400,1280,0),('cabinet',5920,272,0),('water_cooler',6640,272,1),('coat_rack',6640,1264,1),('plant',5920,1264,0),('cabinet',6240,1280,0),('coat_rack',6560,1264,2),('plant',7472,640,0),('water_cooler',7472,272,1),('plant',6960,1168,0),('coat_rack',6864,1168,1)]):fixed(prop,x,y,v,'exec_ficus_tree' if prop=='plant' else None)
 award=fixed('cabinet',6960,608,0,'exec_award_cabinet')
 placements.append(dict(id='executive-trophy-topper',prop='award_trophy',x=6960,y=540,variant=0,solid=False,depthY=award['y']+2,district='executive',group='Executive / awards',caption=CAP['exec_award_cabinet']))
 fixed('vending_machine',6712,592,2,'The sparkling water has its own cost center. Naturally.')
 fixed('offline_lamp',6712,1104,1,'The lamp has stayed on through seven reorganizations. Nobody has found its switch.')
 fixed('offline_lamp',5984,1280,2,'Warm lighting. Finally, a benefit with measurable results.')
 for i,(id,x,y,text,width,caption,read) in enumerate([('executive-name',5936,176,'CORNER OFFICE',160,'Corner office energy. Please keep your aspirations inside the runner.',[5936,352]),('vision-2030',6464,176,'VISION 2030',128,'VISION 2030. The arrows are confident. The budget is penciled in.',[6464,352]),('award-plaque',6960,580,'AWARDS',64,CAP['exec_award_cabinet'],[6960,672])]):labels.append(dict(id=id,x=x,y=y,text=text,width=width,depthY=193 if y==176 else 612,caption=caption,readAt=read))
 # The left glass wall has a full 224px gap, not a decorative narrow doorway.
 for start,end in [(192,704),(928,1216)]:
  for y in range(start,end,256):walls.append(dict(id='executive-glass-'+str(y),x=6768,y=y,width=16,height=min(256,end-y),axis='y',side='interior',style='glass'))
 decor.extend([dict(kind='rug',x=5728,y=560,width=928,height=448),dict(kind='rug',x=6800,y=560,width=704,height=544),dict(kind='rug',x=5520,y=320,width=1136,height=192),dict(kind='mess',x=5808,y=592,width=736,height=352,count=26,seed=61),dict(kind='mess',x=6848,y=624,width=608,height=448,count=22,seed=62),dict(kind='staff-tape',x=5440,y=656,width=64,height=256)])
 # Office lower loop and door approach, plus the far-end west-facing Wellness throat.
 routes=[dict(id='executive-office-door',x=6544,y=704,width=496,height=224),dict(id='executive-office-front',x=6912,y=704,width=608,height=224),dict(id='executive-office-right',x=7296,y=816,width=224,height=320),dict(id='executive-office-rear',x=6800,y=912,width=720,height=224),dict(id='executive-office-left',x=6800,y=816,width=224,height=320),dict(id='executive-wellness-exit',x=5152,y=1088,width=592,height=224)]
 return dict(labels=labels,floorDecor=decor,walls=walls,protectedRoutes=routes)
