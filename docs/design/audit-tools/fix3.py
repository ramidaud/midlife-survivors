import sys, json, os
sys.path.insert(0,"./audit-work")
from harness import *
src=open(S+"/capture.py").read()
SEED=src.split('SEED = """')[1].split('"""')[0]; RECTS=src.split('RECTS = """')[1].split('"""')[0]
SC="const sc = window._activeGameScene || game.scene.scenes[0];"
HEAL="try{hp=stats.maxHp;drawHpBar();}catch(e){}"
CLEAR="pendingLevels=0; try{ if(levelMenu&&levelMenu.close) levelMenu.close(); }catch(e){} levelMenu=null; window.levelMenu=null; levelUpOpen=false; document.getElementById('levelup-modal').classList.add('hidden'); try{ if(BonusChest.isOpen()) BonusChest.abandon(); }catch(e){} if(!paused){ sc.physics.resume(); sc.time.paused=false; }"
KILL="bills.getChildren().slice().forEach(b=>{ if(b.active&&!b.isBoss) damageBill(b,99999); });"
KILLALL="bills.getChildren().slice().forEach(b=>{ if(b.active) damageBill(b,9999999); });"
QUIET="try{Spotlight.newRun();}catch(e){} try{ltHide();}catch(e){} try{CatchMoment.clear();}catch(e){}"
SPOT="()=>window.Spotlight&&Spotlight.isShowing()"
log=[]
for size in sys.argv[1].split(","):
    out=S+"/shots/"+size; rects=json.load(open(out+"/rects.json")) if os.path.exists(out+"/rects.json") else {}
    with sync_playwright() as p:
        b=launch(p)
        def ev(js,wait=200):
            try: r=pg.evaluate("()=>{"+SC+js+"}"); pg.wait_for_timeout(wait); return r
            except Exception as e: log.append(size+" EV "+js[:50]+" :: "+str(e)[:160])
        def waitf(cond,ms=9000):
            try: pg.wait_for_function(cond,timeout=ms); return True
            except Exception as e: log.append(size+" WAIT "+cond[:60]); return False
        def shot(name,js=None,wait=500,rect=True):
            if js: ev(js,0)
            pg.wait_for_timeout(wait)
            pg.screenshot(path=out+"/"+name+".jpg",type="jpeg",quality=78)
            if rect:
                try: rects[name]=pg.evaluate(RECTS)
                except Exception: pass
        def start(home=False):
            global pg
            c=ctx_for(b,size); pg=c.new_page(); pg.set_default_navigation_timeout(120000)
            pg.on("pageerror", lambda e: log.append(size+" PAGEERR "+str(e)[:160]))
            pg.goto(BASE+"/index.html?nostats=1"+("&home=1" if home else ""),wait_until="load"); pg.wait_for_timeout(5000)
            pg.evaluate("()=>{"+SC+"return ("+SEED+")();}"); pg.evaluate("()=>markVersionSeen()")
            pg.reload(wait_until="load"); pg.wait_for_timeout(7000)
            if home:
                ev("window.titleSettingsOpen=true; renderTitleModal(sc);",500)
                pg.mouse.click(*pg.evaluate("()=>{const e=document.querySelector('[data-loc=home]'); e.scrollIntoView({block:'center'}); const b=e.getBoundingClientRect(); return [b.left+b.width/2,b.top+b.height/2];}")); pg.wait_for_timeout(5000)
                ev("window.titleSettingsOpen=false; renderTitleModal(sc);",800)
            pg.mouse.click(*pg.evaluate("()=>{const e=document.getElementById('title-clockin-btn'); e.scrollIntoView({block:'center'}); const b=e.getBoundingClientRect(); return [b.left+b.width/2,b.top+b.height/2];}"))
            waitf("()=>window.briefingOpen",8000); pg.wait_for_timeout(900)
            return c
        # ---- office
        c=start()
        ev("endShiftBriefing(); window.DEV=window.DEV||{}; DEV.god=true; xpNeeded=1e12; ERRAND_SETTINGS.on=false; meta.mapFound=true; MINIMAP.perRun=false; window._te=window.tipsEnabled; window.tipsEnabled=()=>false;",300)
        pg.keyboard.down("d"); pg.wait_for_timeout(1200); pg.keyboard.up("d"); pg.keyboard.down("s"); pg.wait_for_timeout(2500); pg.keyboard.up("s")
        ev("runElapsedMs = msAtAge(42.0); try{Minimap.sync();}catch(e){}",2500); ev(QUIET+CLEAR,500)

        ev("window.firstTimeTip=()=>false; window._slt=window.showLowerThird; window.showLowerThird=()=>{}; ltHide();"+KILL,2500)
        for i in range(4): ev("ltHide();"+CLEAR,700)
        ok=pg.evaluate("()=>{const e=document.getElementById('lt-strip'); return [e.className, getComputedStyle(e).opacity];}"); log.append(size+" lt "+str(ok))
        ev(HEAL+"window.tipsEnabled=window._te; Spotlight.resetSeen(); Spotlight.newRun(); Spotlight.tip('elite');",0); waitf(SPOT,25000); shot("c17-spotlight-tip",None,1500)
        c.close()
        b.close()
    json.dump(rects,open(out+"/rects.json","w"),indent=1); print(size,"fixed")
print("\n".join(log))
