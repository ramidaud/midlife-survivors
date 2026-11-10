import sys, json, os
sys.path.insert(0,"./audit-work")
from harness import *
SEED=open(S+"/capture.py").read().split('SEED = """')[1].split('"""')[0]
RECTS=open(S+"/capture.py").read().split('RECTS = """')[1].split('"""')[0]
SC="const sc = window._activeGameScene || game.scene.scenes[0];"
res={}
for size in sys.argv[1].split(","):
    out=S+"/shots/"+size
    with sync_playwright() as p:
        b=launch(p); c=ctx_for(b,size); pg=c.new_page(); pg.set_default_navigation_timeout(120000)
        pg.goto(BASE+"/index.html?nostats=1",wait_until="load"); pg.wait_for_timeout(5000)
        pg.evaluate("()=>{"+SC+"return ("+SEED+")();}"); pg.evaluate("()=>markVersionSeen()")
        pg.reload(wait_until="load"); pg.wait_for_timeout(7000)
        r={}
        r["nav_title"]=pg.evaluate("()=>({navh:getComputedStyle(document.documentElement).getPropertyValue('--ms-nav-h'), hdr:(()=>{const e=document.getElementById('site-header'); if(!e) return null; const b=e.getBoundingClientRect(); return [b.top,b.height,getComputedStyle(e).display,getComputedStyle(e).visibility,getComputedStyle(e).transform];})()})")
        pg.mouse.click(*pg.evaluate("()=>{const b=document.getElementById(\"title-clockin-btn\").getBoundingClientRect(); return [b.left+b.width/2,b.top+b.height/2];}")); pg.wait_for_timeout(1500)
        pg.evaluate("()=>{endShiftBriefing(); window.DEV=window.DEV||{}; DEV.god=true; xpNeeded=1e12;}")
        pg.keyboard.down("s"); pg.wait_for_timeout(1300); pg.keyboard.up("s"); pg.wait_for_timeout(2500)
        r["nav_run"]=pg.evaluate("()=>({navh:getComputedStyle(document.documentElement).getPropertyValue('--ms-nav-h'), hdr:(()=>{const e=document.getElementById('site-header'); if(!e) return null; const b=e.getBoundingClientRect(); return [b.top,b.height,getComputedStyle(e).display,getComputedStyle(e).visibility,getComputedStyle(e).transform];})(), hud:[...document.querySelectorAll('.vs-hud *')].filter(e=>e.children.length==0&&e.getClientRects().length&&e.textContent.trim()).slice(0,40).map(e=>[e.id||e.className, e.textContent.trim().slice(0,18), getComputedStyle(e).fontSize, Math.round(e.getBoundingClientRect().left), Math.round(e.getBoundingClientRect().top)]), btn:['hud-pause-btn','hud-mute-btn','vs-pause','vs-sound'].map(i=>{const e=document.getElementById(i); if(!e) return null; const b=e.getBoundingClientRect(); return [i,Math.round(b.width),Math.round(b.height)];}), tap:[...document.querySelectorAll('.vs-hud button')].map(e=>{const b=e.getBoundingClientRect(); return [e.id,Math.round(b.width),Math.round(b.height)];}) })")
        pg.evaluate("()=>{ try{ audioCtx.suspend(); }catch(e){} try{Spotlight.reset(); ltHide();}catch(e){} }"); pg.wait_for_timeout(1800)
        pg.screenshot(path=out+"/c02c-sound-nudge.jpg",type="jpeg",quality=78)
        pg.evaluate("()=>{ try{ audioCtx.resume(); }catch(e){} const e=document.getElementById('sound-nudge'); if(e) e.remove(); }")
        pg.evaluate("()=>{"+SC+"ERRAND_SETTINGS.on=false; meta.mapFound=true; MINIMAP.perRun=false; runElapsedMs = msAtAge(66.3); }"); pg.wait_for_timeout(2500)
        pg.evaluate("()=>{"+SC+"bills.getChildren().slice().forEach(b=>{ if(b.active) damageBill(b,9999999); }); try{Spotlight.reset(); ltHide();}catch(e){} pendingLevels=0; Workload.debugSet(3); Modifiers.forceStart('rentHike'); }"); pg.wait_for_timeout(4000)
        pg.evaluate("()=>{ try{Spotlight.reset();}catch(e){} }"); pg.wait_for_timeout(600)
        pg.screenshot(path=out+"/c27-workload-chip.jpg",type="jpeg",quality=78)
        r["workload"]=pg.evaluate(RECTS)
        res[size]=r; b.close()
json.dump(res,open(S+"/supp-%s.json"%sys.argv[1].replace(",","_"),"w"),indent=1); print(json.dumps(res)[:3000])
