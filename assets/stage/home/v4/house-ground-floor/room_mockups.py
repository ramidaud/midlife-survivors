from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json
FONT=ImageFont.load_default(size=14)
# Coordinates are existing HOUSE_V2 world pixels. Each anchor is a feet point,
# except top-left placements for floor decals and an explicit side-door strip.
RECIPE=[
('photo-ledges',[128,2]),('tile-fireplace',[296,52]),('ornate-silver-mirror',[296,-14]),('window-olive-curtains',[444,12]),('galaxy-wall-tv',[688,4]),('fluted-media-console',[688,52]),('cream-sofa',[60,330]),('leather-recliner',[728,240]),('round-coffee-table',[248,312]),('persian-living-rug',[44,164],'top-left'),('potted-pothos',[44,96]),('bird-of-paradise',[220,64]),('drum-floor-lamp',[40,64]),('arched-floor-lamp',[752,136]),('racing-sim-rig',[644,328]),('sim-cables',[596,156],'top-left'),('baby-swing-pink',[276,120]),('baby-swing-grey',[328,120]),('blanket-basket',[744,318]),('snack-bag',[240,316],'top-left'),
('round-dining-table',[344,580]),('dining-chair-north',[344,500]),('dining-chair-south',[344,634]),('dining-chair-east',[438,574]),('dining-chair-west',[250,574]),('dining-rug',[240,472],'top-left'),('corner-computer-desk',[652,468]),('camera-book-shelves',[600,351]),('window-blinds-east',[768,365],'top-left'),('mesh-office-chair',[644,540]),('moon-print',[480,355]),('kids-drawings',[744,355]),('electric-console-east',[752,628]),('abstract-wall-painting',[392,355]),('potted-orchid',[204,444]),('ceiling-fan',[488,540]),
('white-oak-sink-counter',[480,743]),('white-oak-upper-cabinets',[464,659]),('stove-microwave',[608,748]),('magnet-fridge',[744,764]),('kitchen-counter-west',[400,928]),('kitchen-counter-east',[752,932]),('leaning-abstract-painting',[692,743]),('kitchen-runner',[544,792],'top-left'),
('storage-bench-west',[52,1260]),('shoe-pairs',[44,1274],'top-left'),('coat-hooks-jacket',[132,1135]),('light-switch',[324,700]),('ceiling-vent',[266,740]),('oak-door-north',[496,1323]),('oak-door-north',[560,1323]),('oak-door-side',[0,1139],'top-left'),('louvered-closet-door-side',[184,995],'top-left')]
PATHS=[{'room':'living-patio-connector','rect':[92,16,96,164],'width':96,'note':'Clear connector from actual 120px patio opening.'},{'room':'living-main-connector','rect':[140,132,340,96],'width':96,'note':'Joins patio connector to central 224px route.'},{'room':'living','rect':[368,16,224,345],'width':224,'note':'Main clear route inside living room.'},{'room':'dining-desk-shared','rect':[480,488,104,195],'width':104,'note':'Route between dining table and desk.'},{'room':'kitchen','rect':[440,784,224,247],'width':224,'note':'Central kitchen aisle, narrows at north work area.'},{'room':'circulation','rect':[200,683,136,624],'width':136,'note':'Entire existing hall kept clear.224px would need a layout change.'},{'room':'entry','rect':[88,1135,112,172],'width':112,'note':'Clear of west storage bench.'}]
def tile(canvas,texture,rect):
 x,y,w,h=rect
 if w<=0 or h<=0:return
 panel=Image.new('RGBA',(w,h))
 for yy in range(0,h,texture.height):
  for xx in range(0,w,texture.width):panel.paste(texture,(xx,yy))
 canvas.alpha_composite(panel,(x,y))
def build(root,out,pieces,hero):
 lookup={p['id']:p for p in pieces};layout=json.loads((root/'reference/house-layout.json').read_text());pad=144;W,H=layout['size'];canvas=Image.new('RGBA',(W,H+pad),'#171C35');placed=[]
 def art(id):return Image.open(out/lookup[id]['file']).convert('RGBA') if id in lookup else None
 wood=art('dark-wood-floor');carpet=art('beige-carpet')
 if wood:
  for b in layout['base']:x,y,w,h=b['rect'];tile(canvas,wood,(x,y+pad,w,h))
 if carpet:tile(canvas,carpet,(32,140+pad,320,205))
 floor_base=canvas.copy();wall=art('north-wall-strip');side=art('side-wall-strip')
 # Shared dining/desk room has one common north wall, not duplicate overlapping walls.
 north_runs=[(16,16,768)]
 if wall:
  for x,y,width in north_runs:
   tile(canvas,wall.crop((0,0,wall.width,32)),(x,y+pad-128,width,32));tile(canvas,wall,(x,y+pad-96,width,96))
 if side:
  for x,y,w,h in layout['walls']:
   if w==16:tile(canvas,side,(x,y+pad,w,h))
 # Context-only legacy rooms use existing game sprites, never attached photos.
 legacy=[]
 atlas_path=root/'reference/existing-floor1-atlas.png'
 if atlas_path.exists():
  atlas=Image.open(atlas_path).convert('RGBA')
  for p in layout['pieces']:
   if p['room'] not in ['half-bath','garage','laundry-closet']:continue
   x,y,w,h=layout['frames'][p['key']];piece=atlas.crop((x,y,x+w,y+h));at=p['at'];canvas.alpha_composite(piece,(at[0],at[1]+pad));legacy.append({'id':p['id'],'at':at,'room':p['room'],'note':'Existing game art retained for context, not repainted in this brief.'})
  x,y,w,h=layout['frames']['stairs'];stairs=atlas.crop((x,y,x+w,y+h));canvas.alpha_composite(stairs,(52,400+pad));legacy.append({'id':'stairs','at':[52,400],'room':'stairs','note':'Existing game art.'})
 for item in RECIPE:
  id,anchor=item[:2];p=lookup.get(id)
  if not p:continue
  top_left=item[2]=='top-left' if len(item)>2 else False;at=anchor if top_left else [anchor[0]-p['footPoint'][0],anchor[1]-p['footPoint'][1]]
  view_room=('garage' if id=='oak-door-north' else 'entry' if id=='oak-door-side' else 'entry-closet' if id=='louvered-closet-door-side' else 'circulation' if id in ['light-switch','ceiling-vent'] else p['room'])
  placed.append({'viewRoom':view_room,'id':id,'at':at,'anchor':anchor,'kind':p['kind'],'layer':p['renderLayer'],'room':p['room'],'footprints':[[at[0]+x,at[1]+y,w,h] for x,y,w,h in p['footprints']]})
 def order(item):
  if item['layer']=='ground':return (0,item['at'][1])
  if item['layer']=='wall-mounted':return (1,item['anchor'][1])
  if item['layer']=='over-everything':return (3,item['anchor'][1])
  return (2,item['anchor'][1])
 for item in sorted(placed,key=order):canvas.alpha_composite(art(item['id']),(item['at'][0],item['at'][1]+pad))
 # Hero is only the game's existing character, never a person painted from the photos.
 for x,y in [(448,252),(492,588),(572,928),(240,1180)]:canvas.alpha_composite(hero,(x,y+pad))
 canvas.save(out/'mockups/whole-ground-floor-1x.png')
 overlay=canvas.convert('RGB');d=ImageDraw.Draw(overlay)
 for path in PATHS:
  x,y,w,h=path['rect'];d.rectangle((x,y+pad,x+w-1,y+h+pad-1),outline='#83A89A',width=2);d.text((x+3,y+pad+3),str(path['width'])+'px clear',font=FONT,fill='#FFF0CF')
 for item in placed:
  for x,y,w,h in item['footprints']:d.rectangle((x,y+pad,x+w-1,y+h+pad-1),outline='#C45C4B',width=2)
 overlay.save(out/'mockups/whole-ground-floor-footprints-1x.png')
 contexts=[('living',[16,16,768,345],'New living-room pieces. The central 224px route stays clear.'),('dining-desk-shared',[184,361,600,322],'Shared space. Dining and desk rects overlap in the live layout.'),('dining',[184,361,404,322],'Dining crop of the shared room.'),('downstairs-desk-nook',[200,361,584,322],'Desk-nook crop of the same shared room.'),('kitchen',[368,699,416,332],'North appliances face camera; east/west worktops show their tops and narrow front edges.'),('entry',[16,1135,184,172],'West bench leaves a 112px route. Basketball and shoes have no names or branding.'),('entry-closet',[16,987,168,120],'Louvered door uses the thin side-wall version at the actual east-wall opening.'),('circulation',[200,683,136,624],'The complete136px hall stays clear. A224px target cannot fit this rect.'),('half-bath',[16,699,168,272],'Existing game fixtures shown for context. Not repainted by this room brief.'),('breakfast-nook',[200,1055,464,252],'Existing extra area shown for context; no photo-directed furnishing assigned by the brief.'),('laundry-closet',[680,1055,104,136],'Existing laundry appliance retained for context.'),('stairs',[16,361,144,322],'Existing stair art retained for context.'),('garage',[252,1323,532,724],'Existing garage pieces retained for context, plus new oak double-door study at the actual inner opening.')]
 views=[]
 for id,rect,note in contexts:
  x,y,w,h=rect;top=max(0,y+pad-128);box=(max(0,x-16),top,min(W,x+w+16),min(H+pad,y+pad+h+16))
  local=floor_base.copy()
  wx,wy,ww=(184,361,600) if id in ['dining','downstairs-desk-nook','dining-desk-shared'] else (x,y,w)
  if wall:
   tile(local,wall.crop((0,0,wall.width,32)),(wx,wy+pad-128,ww,32));tile(local,wall,(wx,wy+pad-96,ww,96))
  if side:
   if x>=16:tile(local,side,(x-16,y+pad,16,h))
   if x+w<W:tile(local,side,(x+w,y+pad,16,h))
  allowed={'dining','desk'} if id in ['dining','downstairs-desk-nook','dining-desk-shared'] else {id}
  for old in legacy:
   if old['room'] not in allowed:continue
   frame='stairs' if old['id']=='stairs' else next(pp['key'] for pp in layout['pieces'] if pp['id']==old['id']);ax,ay,aw,ah=layout['frames'][frame];piece=atlas.crop((ax,ay,ax+aw,ay+ah));px,py=old['at'];local.alpha_composite(piece,(px,py+pad))
  for item in sorted(placed,key=order):
   if item['viewRoom'] in allowed:local.alpha_composite(art(item['id']),(item['at'][0],item['at'][1]+pad))
  hero_positions={'living':(448,252),'dining-desk-shared':(492,588),'dining':(492,588),'downstairs-desk-nook':(492,588),'kitchen':(572,928),'entry':(112,1210),'circulation':(240,1180)}
  if id in hero_positions:px,py=hero_positions[id];local.alpha_composite(hero,(px,py+pad))
  local_overlay=local.convert('RGB');draw=ImageDraw.Draw(local_overlay)
  for path in PATHS:
   if path['room']!=id and not (id=='living' and path['room'].startswith('living-')) and not (id in ['dining','downstairs-desk-nook'] and path['room']=='dining-desk-shared'):continue
   px,py,pw,ph=path['rect'];draw.rectangle((px,py+pad,px+pw-1,py+ph+pad-1),outline='#83A89A',width=2)
  for item in placed:
   if item['viewRoom'] not in allowed:continue
   for fx,fy,fw,fh in item['footprints']:draw.rectangle((fx,fy+pad,fx+fw-1,fy+fh+pad-1),outline='#C45C4B',width=2)
  im=local.crop(box);ov=local_overlay.crop(box)
  # Header is outside the room art, preserving unscaled native pixels.
  label=f'{id}: floor rect {rect} / 1x'
  def caption(image):
   dst=Image.new('RGB',(max(650,image.width),image.height+32),'#171C35');dst.paste(image,(0,32));ImageDraw.Draw(dst).text((8,8),label,font=FONT,fill='#FFF0CF');return dst
  file=f'mockups/{id}-1x.png';check=f'mockups/{id}-footprints-1x.png';caption(im.convert('RGB')).save(out/file);caption(ov).save(out/check);views.append({'id':id,'rect':rect,'file':file,'overlay':check,'note':note})
 views.insert(0,{'id':'whole-ground-floor','rect':[0,0,W,H],'file':'mockups/whole-ground-floor-1x.png','overlay':'mockups/whole-ground-floor-footprints-1x.png','note':'Full ground floor in existing HOUSE_V2 coordinates. New pieces in the named rooms; legacy ancillary rooms retained for context. No runtime integration.'})
 # Quantify route and room containment using proposed footprints, not visual alpha.
 intersections=[]
 for path in PATHS:
  x,y,w,h=path['rect']
  for item in placed:
   for fx,fy,fw,fh in item['footprints']:
    if max(x,fx)<min(x+w,fx+fw) and max(y,fy)<min(y+h,fy+fh):intersections.append({'path':path['room'],'piece':item['id'],'footprint':[fx,fy,fw,fh]})
 result={'coordinateSpace':'Existing HOUSE_V2 native world pixels. Per-room views are authoritative, independently composited to avoid adjacent-room north-wall overhang. Full-floor overview is a coordinate/context study. North-wall overhang above floor edge is intentional.','views':views,'placements':placed,'legacyContext':legacy,'paths':PATHS,'pathIntersections':intersections,'unplacedPieces':[p['id'] for p in pieces if p['id'] not in [x['id'] for x in placed] and p['room']!='shell']}
 (out/'mockups/room-layout.json').write_text(json.dumps(result,indent=2)+'\n')
 if wood:
  repeat=Image.new('RGBA',(1024,1024));tile(repeat,wood,(0,0,1024,1024));repeat.save(out/'checks/dark-wood-floor-repeat-1x.png')
 if carpet:
  repeat=Image.new('RGBA',(1024,1024));tile(repeat,carpet,(0,0,1024,1024));repeat.save(out/'checks/beige-carpet-repeat-1x.png')

