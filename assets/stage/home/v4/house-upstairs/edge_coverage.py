"""Measure unfilled wall runs from the actual painted bounds, including door gaps."""
def check(room, placed, lookup):
 _,_,w,h=room['rect']
 spans={edge:[] for edge in ('north','east','south','west')}
 for p in placed:
  asset=lookup[p['id']];x,y=p['at']
  left,top,right,bottom=asset.get('visibleBounds',[0,0,*asset['size']])
  left+=x;right+=x;top+=y;bottom+=y
  if top<=48 and bottom>=-128:spans['north'].append([max(0,left),min(w,right),p['id']])
  if right>=w-48:spans['east'].append([max(0,top),min(h,bottom),p['id']])
  if bottom>=h-48:spans['south'].append([max(0,left),min(w,right),p['id']])
  if left<=48:spans['west'].append([max(0,top),min(h,bottom),p['id']])
 for name,edge,lo,hi in room['doors']:spans[edge].append([lo,hi,'door:'+name])
 result={}
 for edge,length in (('north',w),('east',h),('south',w),('west',h)):
  intervals=sorted([lo,hi,id] for lo,hi,id in spans[edge] if hi>lo)
  cursor=0;gaps=[]
  for lo,hi,_ in intervals:
   if lo>cursor:gaps.append([cursor,lo])
   cursor=max(cursor,hi)
  if cursor<length:gaps.append([cursor,length])
  longest=max((hi-lo for lo,hi in gaps),default=0)
  result[edge]=dict(length=length,occupiedRuns=intervals,unfilledRuns=gaps,longestUnfilledRun=longest,passed=longest<=160)
 return dict(passed=all(v['passed'] for v in result.values()),limit=160,edgeBand=48,
             method='Project actual painted bounds of pieces within 48px of an edge. Flat rugs count as furnishing, not collision. Actual door openings are excluded from wall runs.',walls=result)
