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
        # errand
        ev(HEAL+"ERRAND_SETTINGS.on=true;",0); waitf("()=>Errands.active()",8000)
        shot("c10-errand-start",HEAL,500)
        ev(QUIET,3200); ev(QUIET,300); shot("c11-errand-chip-and-arrow",HEAL,400)
        ev(HEAL+"pendingLevels=1; showLevelUp(sc);",0); waitf("()=>!document.getElementById('levelup-modal').classList.contains('hidden')"); shot("c11b-errand-chip-over-level-up",None,900)
        ev(CLEAR,400)
        ev("const m=Errands.mark(); if(m){ player.body.reset(m.x,m.y);}",0); waitf("()=>{const e=document.getElementById('errand-buff'); return e&&!e.classList.contains('hidden');}",6000)
        ev("ERRAND_SETTINGS.on=false; try{Spotlight.newRun();}catch(e){}",600); shot("c12-errand-done-buff-chip",HEAL,300)
        ev(QUIET,3000); ev(QUIET+CLEAR,300)
        # modifier
        ev(HEAL+"Modifiers.forceStart('readingGlasses');",0); waitf("()=>{const e=document.getElementById('center-flash'); return e&&getComputedStyle(e).opacity>0.5&&e.getBoundingClientRect().width>0;}",4000)
        shot("c13-modifier-start",None,250)
        pg.wait_for_timeout(3600); ev(QUIET+CLEAR,700); shot("c14-modifier-chip",HEAL,200)
        ev("Modifiers.stop(); const e=document.getElementById('errand-buff'); if(e) e.className='hidden';"+QUIET,400)
        # room / tip
        ev(QUIET+CLEAR+KILL,600)
        ev(HEAL+"Spotlight.room('breakroom');",0); waitf(SPOT); ev("showLowerThird('promo','PROMOTED','Senior Associate. New rooms are open.',5000);",0); shot("c16-spotlight-room-promotion",None,1500)
        ev(QUIET,600)
        ev(HEAL+"window.tipsEnabled=window._te; Spotlight.resetSeen(); Spotlight.newRun(); Spotlight.tip('elite');",0); waitf(SPOT); shot("c17-spotlight-tip",None,1500); ev("window.tipsEnabled=()=>false;",0)
        ev(QUIET+CLEAR+KILL,600)
        # boss
        ev(HEAL+"spawnBoss(sc,'performanceReview');",0); waitf(SPOT); shot("c18-boss-arrival-card",None,700)
        waitf("()=>{const e=document.getElementById('center-flash'); return e&&getComputedStyle(e).opacity>0.5&&e.getBoundingClientRect().width>0;}",9000)
        shot("c19-boss-card-plus-first-attack",HEAL,250)
        ev(HEAL+"flashBanner('REVIEW TIME','Sidestep the line.','alert'); showLowerThird('alert','TAX SEASON','A wall of bills from the east. Pick a gap.',6000);",0)
        waitf("()=>{const e=document.getElementById('lt-strip'); return e&&getComputedStyle(e).opacity>0.5&&e.getBoundingClientRect().width>0;}",16000)
        ev("if(!Spotlight.isShowing()){ Spotlight.boss('performanceReview'); } flashBanner('REVIEW TIME','Sidestep the line.','alert');",0)
        shot("c20-boss-card-flash-lower-third",HEAL,600)
        ev("Spotlight.newRun();"+CLEAR,2500)
        shot("c21-boss-fight-hud",HEAL,300)
        ev(HEAL+"bills.getChildren().slice().forEach(b=>{ if(b.active&&b.isBoss) damageBill(b,9999999); });",0); shot("c22-boss-down",None,1100)
        pg.wait_for_timeout(3000); ev(CLEAR+QUIET+"chests.getChildren().slice().forEach(c=>{ if(c.tag) c.tag.destroy(); c.destroy(); });",400)
        # lounge
        ev(HEAL+KILL+"Lounge.forceOpen(sc);",0); waitf(SPOT,9000); shot("c25-lounge-open-card",None,1400)
        ev(QUIET+KILL+"const s=Lounge.spot(); player.body.reset(s.x,s.y+30);",0)
        ok=waitf("()=>{const m=document.getElementById('lounge-modal'); return m&&!m.classList.contains('hidden');}",7000)
        if not ok:
            ev(KILL+"const s=Lounge.spot(); player.body.reset(s.x,s.y+50);",0); pg.keyboard.down("w"); pg.wait_for_timeout(1500); pg.keyboard.up("w")
            waitf("()=>{const m=document.getElementById('lounge-modal'); return m&&!m.classList.contains('hidden');}",5000)
        shot("c26-lounge-shop",None,900,rect=False)
        try:
            pg.mouse.click(*pg.evaluate("()=>{const e=document.getElementById('lg-leave'); e.scrollIntoView({block:'center'}); const b=e.getBoundingClientRect(); return [b.left+b.width/2,b.top+b.height/2];}"))
        except Exception as e: log.append(size+" leave "+str(e)[:80])
        pg.wait_for_timeout(600); ev("const s=Lounge.spot(); player.body.reset(s.x,s.y+520);"+CLEAR+QUIET,500)
        # overtime beat + stack
        ev(HEAL+KILL+"OvertimeBeats.debugStart(sc,'grandkids');",0); waitf("()=>{const e=document.getElementById('otb-chip'); return e&&!e.classList.contains('hidden')&&e.getBoundingClientRect().width>0;}",8000)
        ev("try{Spotlight.newRun();}catch(e){}",1200); shot("c28-overtime-beat-chip",HEAL,300)
        ev(HEAL+"Modifiers.forceStart('rentHike');",3800); ev("try{Spotlight.newRun();}catch(e){}"+CLEAR,600); shot("c29-overtime-stack",HEAL,200)
        c.close()
        # ---- home
        try:
            c=start(home=True)
            ev("endShiftBriefing(); window.DEV=window.DEV||{}; DEV.god=true; xpNeeded=1e12; window.tipsEnabled=()=>false;",300)
            pg.keyboard.down("s"); pg.wait_for_timeout(1300); pg.keyboard.up("s"); pg.wait_for_timeout(2500)
            ev(QUIET,500); shot("d02-maple-hollow-hud",HEAL,500)
            ev("runElapsedMs = msAtAge(40.6);",0); waitf("()=>KeyHunt.state()",8000)
            ev("const k=KeyHunt.state(); if(k){ player.body.reset(k.door.x+10,k.door.y+110);} ",0)
            waitf("()=>{const e=document.getElementById('keyhunt-chip'); return e&&!e.classList.contains('hidden')&&e.getBoundingClientRect().width>0;}",8000)
            pg.wait_for_timeout(900); shot("d03-key-hunt-chip",HEAL,300)
            ev(QUIET+KILL+"Lounge.forceOpen(sc); const s=Lounge.spot(); player.body.reset(s.x,s.y+30);",0)
            ok=waitf("()=>{const m=document.getElementById('lounge-modal'); return m&&!m.classList.contains('hidden');}",7000)
            if not ok:
                ev(KILL+"const s=Lounge.spot(); player.body.reset(s.x,s.y+50);",0); pg.keyboard.down("w"); pg.wait_for_timeout(1500); pg.keyboard.up("w"); pg.wait_for_timeout(1200)
            ev("try{Spotlight.newRun(); ltHide();}catch(e){}",500); shot("d04-lemonade-stand",None,600,rect=False)
            c.close()
        except Exception as e: log.append(size+" HOME "+str(e)[:200])
        b.close()
    json.dump(rects,open(out+"/rects.json","w"),indent=1); print(size,"fixed")
print("\n".join(log))
