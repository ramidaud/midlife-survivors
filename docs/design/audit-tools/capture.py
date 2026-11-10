import sys, json, os, time
sys.path.insert(0,"./audit-work")
from harness import *
sizes = sys.argv[1].split(",") if len(sys.argv)>1 else ["phone"]
only=None
SESS = sys.argv[2] if len(sys.argv)>2 else "ABCDEF"
SC="const sc = window._activeGameScene || game.scene.scenes[0];"
RECTS = """()=>{const sel=['#center-flash','#lt-strip','#errand-chip','#errand-arrow','#errand-buff','#keyhunt-chip','#otb-chip','#workload-chip','#minimap','#spotlight','.vs-hud','#sound-nudge','#shift-briefing','#catch-card','#mod-chip','.mod-chip','#modifier-chip'];const o={};
 sel.forEach(s=>{const e=document.querySelector(s); if(!e) return; const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); if(r.width&&cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>0.05) o[s]=[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)];});
 // any fixed element in the top band not listed
 return o;}"""
SEED = """()=>{ meta.coins=640; meta.runsPlayed=14; meta.bestAge=66.2; meta.bestScore=48210; meta.fullLifeUnlocked=true; meta.unlockedDecades=[40,50,60];
 meta.unlockedChars=Object.assign({},meta.unlockedChars,{officeWorker:true}); CHARACTERS.slice(0,3).forEach(c=>meta.unlockedChars[c.id]=true);
 META_SHOP.slice(0,4).forEach((it,i)=>{meta.ranks[it.id]=Math.min(it.maxRank,[2,1,3,1][i]);});
 meta.achievements=meta.achievements||{unlocked:{},life:{splits:0,plants:0,evos:{}}}; (window.ACHIEVEMENTS||[]).slice(0,9).forEach(a=>meta.achievements.unlocked[a.id]=1);
 meta.lastRun={age:58.4,score:31250,killer:'30-Year Mortgage',win:false,char:'officeWorker',at:Date.now()-86400000,form:'desktop'};
 meta.played={desktop:9,phone:5}; saveMeta(meta); localStorage.setItem("ms-acct-prompt","never"); return Object.keys(meta).length; }"""
log=[]
def tap(pg,sel):
    box=pg.evaluate("(s)=>{const e=document.querySelector(s); if(!e) return null; e.scrollIntoView({block:'center'}); const b=e.getBoundingClientRect(); return [b.left+b.width/2,b.top+b.height/2];}",sel)
    if not box: raise Exception("no element "+sel)
    pg.wait_for_timeout(150); pg.mouse.click(box[0],box[1])
def run(size):
    out=S+"/shots/"+size; os.makedirs(out,exist_ok=True); rects={}
    with sync_playwright() as p:
        b=launch(p)
        def page(c):
            pg=c.new_page(); pg.set_default_navigation_timeout(120000)
            pg.on("pageerror", lambda e: log.append(size+" PAGEERR "+str(e)[:200]))
            return pg
        def shot(pg,name,js=None,wait=600,full=False,rect=False):
            if only and not any(name.startswith(o) for o in only): 
                # still run js to keep state consistent
                pass
            try:
                if js: pg.evaluate("()=>{"+SC+js+"}")
                pg.wait_for_timeout(wait)
                pg.screenshot(path=out+"/"+name+".jpg",type="jpeg",quality=78,full_page=full)
                if rect: rects[name]=pg.evaluate(RECTS)
            except Exception as e:
                log.append("%s %s ERR %s"%(size,name,str(e)[:300]))
        def ev(pg,js,wait=200):
            try:
                r=pg.evaluate("()=>{"+SC+js+"}"); pg.wait_for_timeout(wait); return r
            except Exception as e:
                log.append("%s EV ERR %s :: %s"%(size,js[:60],str(e)[:200]))
        HEAL="try{hp=stats.maxHp;drawHpBar();}catch(e){}"
        # ---------- Session A: brand-new player
        if 'A' in SESS:
          c=ctx_for(b,size); pg=page(c)
          pg.goto(BASE+"/index.html?nostats=1",wait_until="load"); pg.wait_for_timeout(7000)
          shot(pg,"a01-title-first-visit")
          ev(pg,"window.titleNewOpen=true; renderTitleModal(sc);",500)
          shot(pg,"a02-title-whats-new-pop")
          ev(pg,"window.titleNewOpen=false; markVersionSeen(); renderTitleModal(sc);")
          try: tap(pg,"#title-clockin-btn")
          except Exception as e: log.append(size+" click punch A "+str(e)[:120])
          shot(pg,"a03-shift-briefing-first-run",wait=1600,rect=True)
          ev(pg,"endShiftBriefing();",400)
          shot(pg,"a04-move-to-start-hint",wait=900,rect=True)
          c.close()
        # ---------- Session B: returning player, menus
        if 'B' in SESS:
          c=ctx_for(b,size); pg=page(c)
          pg.goto(BASE+"/index.html?nostats=1",wait_until="load"); pg.wait_for_timeout(5000)
          ev(pg,"return ("+SEED+")();"); ev(pg,"markVersionSeen();")
          pg.reload(wait_until="load"); pg.wait_for_timeout(7000)
          shot(pg,"b01-title-returning")
          shot(pg,"b02-title-returning-scrolled","const m=document.getElementById('title-modal'); const s=[m,...m.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+40&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)); if(s) s.scrollTop=s.scrollHeight; else window.scrollTo(0,9999);",700)
          ev(pg,"window.titleSettingsOpen=true; renderTitleModal(sc);",500)
          shot(pg,"b03-title-shift-settings-open","const e=document.querySelector('.tp-settings'); if(e) e.scrollIntoView({block:'center'});",600)
          ev(pg,"window.titleSettingsOpen=false; renderTitleModal(sc);")
          for i,(v,nm) in enumerate([("shop","401k-shop"),("extras","extras"),("achievements","achievements"),("leaders","leaderboard"),("credits","credits")]):
              shot(pg,"b%02d-%s"%(4+i,nm),"window.titleView='%s'; renderTitleModal(sc);"%v,1200 if v!="leaders" else 3500)
          ev(pg,"window.titleView='main'; renderTitleModal(sc);")
          shot(pg,"b09-options","openControlsModal(sc);",900)
          shot(pg,"b10-options-scrolled","const m=[...document.querySelectorAll('.ui-modal:not(.hidden) *')].find(e=>e.scrollHeight>e.clientHeight+40&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)); if(m) m.scrollTop=m.clientHeight*0.9;",600)
          ev(pg,"closeControlsModal(sc);")
          shot(pg,"b11-whats-new-changelog","openChangelogModal(sc);",900)
          ev(pg,"closeChangelogModal(sc);")
          shot(pg,"b12-lore-archive","openLoreModal(sc);",900)
          ev(pg,"closeLoreModal(sc);")
          shot(pg,"b13-account-save-prompt","if(window.Account&&Account.open) Account.open();",1200)
          ev(pg,"document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); const x=document.querySelector('#acct-modal .acct-x,#account-modal button,[data-acct-close]'); if(x) x.click();")
          pg.reload(wait_until="load"); pg.wait_for_timeout(6000)
          shot(pg,"b14-moved-note","if(window.MovedNote) MovedNote.show();",900)
          c.close()
        # ---------- Session C: in a run
        if 'C' in SESS:
          CLEAR="pendingLevels=0; try{ if(levelMenu&&levelMenu.close) levelMenu.close(); }catch(e){} levelMenu=null; window.levelMenu=null; levelUpOpen=false; document.getElementById('levelup-modal').classList.add('hidden'); try{ if(BonusChest.isOpen()) BonusChest.abandon(); }catch(e){} if(!paused){ sc.physics.resume(); sc.time.paused=false; }"
          NOXP="xpNeeded=1e12; xp=0;"
          KILL="bills.getChildren().slice().forEach(b=>{ if(b.active&&!b.isBoss) damageBill(b,99999); });"
          QUIET="try{Spotlight.reset();}catch(e){} try{ltHide();}catch(e){} try{CatchMoment.clear();}catch(e){}"
          c=ctx_for(b,size); pg=page(c)
          pg.goto(BASE+"/index.html?nostats=1",wait_until="load"); pg.wait_for_timeout(5000)
          ev(pg,"return ("+SEED+")();"); ev(pg,"markVersionSeen();")
          pg.reload(wait_until="load"); pg.wait_for_timeout(7000)
          try: tap(pg,"#title-clockin-btn")
          except Exception as e: log.append(size+" click punch C "+str(e)[:120])
          shot(pg,"c01-shift-briefing-hire-card",wait=1700,rect=True)
          ev(pg,"endShiftBriefing(); window.DEV=window.DEV||{}; DEV.god=true;",300)
          pg.keyboard.down("d"); pg.wait_for_timeout(1200); pg.keyboard.up("d")
          pg.keyboard.down("s"); pg.wait_for_timeout(2500); pg.keyboard.up("s")
          pg.wait_for_timeout(5000)
          shot(pg,"c02-hud-early-run",HEAL+QUIET,900,rect=True)
          if SIZES[size][2]:
              try:
                  w,h,_=SIZES[size]; cdp=c.new_cdp_session(pg)
                  cdp.send("Input.dispatchTouchEvent",{"type":"touchStart","touchPoints":[{"x":w*0.5,"y":h*0.78}]}); pg.wait_for_timeout(120)
                  cdp.send("Input.dispatchTouchEvent",{"type":"touchMove","touchPoints":[{"x":w*0.5+34,"y":h*0.78-26}]}); pg.wait_for_timeout(500)
                  pg.screenshot(path=out+"/c02b-touch-joystick.jpg",type="jpeg",quality=78)
                  cdp.send("Input.dispatchTouchEvent",{"type":"touchEnd","touchPoints":[]})
              except Exception as e: log.append(size+" joystick "+str(e)[:150])
          shot(pg,"c03-lower-third",QUIET+"showLowerThird('tip','TIP','Elites drop bigger gems. Circle back for them.',6000);",1300,rect=True)
          ev(pg,QUIET,900)
          shot(pg,"c04-center-flash","flashBanner('TAX SEASON','A wall of bills from the east. Pick a gap.','alert');",450,rect=True)
          pg.wait_for_timeout(2200)
          ev(pg,"UPGRADES.filter(u=>!u.isEvolution&&!u.isConsumable&&(!u.when||u.when(stats))).slice(0,3).forEach(u=>{try{applyUpgrade(u);}catch(e){}}); updateHUD();",300)
          shot(pg,"c05-level-up",HEAL+"pendingLevels=1; showLevelUp(sc);",1200)
          ev(pg,CLEAR+NOXP,400)
          shot(pg,"c06-pause",HEAL+"togglePause(sc);",1000)
          pg.keyboard.press("ArrowDown"); pg.wait_for_timeout(250); pg.keyboard.press("ArrowDown")
          shot(pg,"c06b-pause-controller-focus",None,500)
          shot(pg,"c07-pause-scrolled","const m=[...document.querySelectorAll('.ui-modal:not(.hidden) *')].find(e=>e.scrollHeight>e.clientHeight+40&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)); if(m) m.scrollTop=m.scrollHeight;",500)
          ev(pg,"togglePause(sc);",500)
          ev(pg,"meta.mapFound=true; MINIMAP.perRun=false; try{Minimap.sync();}catch(e){}",1200)
          shot(pg,"c08a-hud-with-minimap",HEAL+QUIET,700,rect=True)
          shot(pg,"c08-minimap-big","Minimap.openBig();",1000)
          ev(pg,"Minimap.closeBig();",500)
          shot(pg,"c09-speech-bubble-world-text",HEAL+QUIET+"showPlayerSpeechBubble(sc,\"I'm reading a book on anti-gravity. Can't put it down.\"); for(let i=0;i<5;i++) popDamageNumber(sc, player.x-70+i*35, player.y-40-(i%2)*24, 12+i*9, i==2);",500,rect=True)
          # errand
          ev(pg,HEAL+QUIET+"runElapsedMs = msAtAge(42.0);",1300)
          shot(pg,"c10-errand-start",HEAL,300,rect=True)
          shot(pg,"c11-errand-chip-and-arrow",HEAL+QUIET,3600,rect=True)
          shot(pg,"c11b-errand-chip-over-level-up",HEAL+"pendingLevels=1; showLevelUp(sc);",1100,rect=True)
          ev(pg,CLEAR,400)
          ev(pg,"const m=Errands.mark(); if(m){ player.body.reset(m.x,m.y);} ",700)
          shot(pg,"c12-errand-done-buff-chip",HEAL,900,rect=True)
          ev(pg,QUIET+"ERRAND_SETTINGS.on=false;",3500); ev(pg,QUIET+CLEAR,300)
          # modifier
          shot(pg,"c13-modifier-start",HEAL+"Modifiers.forceStart('readingGlasses');",500,rect=True)
          ev(pg,CLEAR+QUIET,200)
          shot(pg,"c14-modifier-chip",HEAL,4200,rect=True)
          ev(pg,CLEAR+QUIET+"Errands.reset(); ERRAND_SETTINGS.on=false;",300)
          shot(pg,"c15-catch-card-gotcha",HEAL+"const r=INTERNS.roster[0]; CatchMoment.show(sc, r, (r.lines||['Here you go!'])[0], {id:'coffee',name:'COFFEE RUN',text:'Fire faster for 20 seconds.',color:'#EF9347'}, {}, 2);",1000,rect=True)
          pg.wait_for_timeout(2600)
          ev(pg,CLEAR+QUIET+"Modifiers.stop();",600)
          shot(pg,"c16-spotlight-room-promotion",HEAL+"Spotlight.room('breakroom'); showLowerThird('promo','PROMOTED','Senior Associate. New rooms are open.',5000);",1600,rect=True)
          ev(pg,QUIET,700)
          shot(pg,"c17-spotlight-tip",HEAL+"Spotlight.resetSeen(); Spotlight.tip('elite');",1600,rect=True)
          ev(pg,QUIET+CLEAR+KILL,700)
          # boss arrival
          shot(pg,"c18-boss-arrival-card",HEAL+"spawnBoss(sc,'performanceReview');",900,rect=True)
          shot(pg,"c19-boss-card-plus-first-attack",HEAL,1500,rect=True)
          shot(pg,"c20-boss-card-flash-lower-third",HEAL+"showLowerThird('alert','TAX SEASON','A wall of bills from the east. Pick a gap.',4500);",700,rect=True)
          pg.wait_for_timeout(4500)
          shot(pg,"c21-boss-fight-hud",HEAL+CLEAR,400,rect=True)
          shot(pg,"c22-boss-down",HEAL+"bills.getChildren().slice().forEach(b=>{ if(b.active&&b.isBoss) damageBill(b,9999999); });",1000,rect=True)
          pg.wait_for_timeout(3000); ev(pg,CLEAR+QUIET,300)
          shot(pg,"c23-bonus-chest",HEAL+"chests.getChildren().slice().forEach(c=>{ if(c.tag) c.tag.destroy(); c.destroy(); }); const rewards=rollChestRewards(3); pauseForMenu(sc); BonusChest.open({scene:sc,tier:3,rewards,coins:120,bossName:'The Performance Review',reelIcons:Phaser.Utils.Array.Shuffle(UPGRADES.slice()).slice(0,12).map(u=>chestIcon(u))},()=>{levelUpOpen=false; sc.physics.resume(); sc.time.paused=false;});",1600)
          shot(pg,"c24-bonus-chest-opened","BonusChest.press();",4500)
          ev(pg,"for(let i=0;i<8;i++){ try{ if(BonusChest.isOpen()) BonusChest.press(); }catch(e){} }",1500)
          ev(pg,CLEAR+QUIET,500)
          # lounge
          shot(pg,"c25-lounge-open-card",HEAL+"Lounge.forceOpen(sc);",1600,rect=True)
          ev(pg,QUIET+"const s=Lounge.spot(); player.body.reset(s.x,s.y+60);",600)
          pg.keyboard.down("w"); pg.wait_for_timeout(900); pg.keyboard.up("w")
          shot(pg,"c26-lounge-shop",HEAL,1200)
          try: tap(pg,"#lg-leave")
          except Exception as e: log.append(size+" lg-leave "+str(e)[:100])
          ev(pg,"const s=Lounge.spot(); player.body.reset(s.x,s.y+520);"+CLEAR+QUIET,600)
          # overtime: workload + beat
          shot(pg,"c27-workload-chip",HEAL+"Workload.debugSet(3);",1500,rect=True)
          ev(pg,CLEAR+QUIET,300)
          shot(pg,"c28-overtime-beat-chip",HEAL+"OvertimeBeats.debugStart(sc,'grandkids');",1800,rect=True)
          ev(pg,CLEAR,200)
          shot(pg,"c29-overtime-stack",HEAL+"Modifiers.forceStart('rentHike');",3200,rect=True)
          ev(pg,"OvertimeBeats.reset(); Modifiers.stop();"+CLEAR+QUIET,500)
          shot(pg,"c30-boss-toast",HEAL+"showBossToastUI('THE 30-YEAR MORTGAGE','Rates only go up.');",700,rect=True)
          pg.wait_for_timeout(3400); ev(pg,CLEAR+QUIET,200)
          shot(pg,"c31-perf-bonus",HEAL+"pendingLevels=1; showLevelUp(sc,'PERFORMANCE BONUS!');",1200)
          ev(pg,CLEAR,300)
          shot(pg,"c32-retire-at-80-choice","showRetire80Modal(sc,()=>{},()=>{});",1000)
          ev(pg,"document.getElementById('retire80-modal').classList.add('hidden'); sc.physics.resume(); sc.time.paused=false;"+CLEAR+QUIET,300)
          # the real 45 pile-up, untouched: jump to just before 45 and let the game run
          ev(pg,KILL+QUIET+"try{Workload.reset();}catch(e){} Errands.reset(); ERRAND_SETTINGS.on=true; runElapsedMs = msAtAge(44.4);",2500)
          ev(pg,QUIET+CLEAR+"runElapsedMs = msAtAge(44.975);",100)
          shot(pg,"c40-age-45-pileup-1",None,1600,rect=True)
          shot(pg,"c41-age-45-pileup-2",None,1500,rect=True)
          shot(pg,"c42-age-45-pileup-3",None,1800,rect=True)
          shot(pg,"c43-age-45-pileup-4",None,2500,rect=True)
          ev(pg,"bills.getChildren().slice().forEach(b=>{ if(b.active) damageBill(b,9999999); });",3500)
          ev(pg,CLEAR+QUIET+"DEV.god=false;",400)
          shot(pg,"c33-game-over",HEAL+"showGameOver(sc,'mortgageRefinance',false);",3000)
          shot(pg,"c34-game-over-scrolled","const m=[...document.querySelectorAll('.ui-modal:not(.hidden), .ui-modal:not(.hidden) *')].find(e=>e.scrollHeight>e.clientHeight+40&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)); if(m) m.scrollTop=m.scrollHeight;",700)
          c.close()
        # ---------- Session D: home stage
        if 'D' in SESS:
          c=ctx_for(b,size); pg=page(c)
          pg.goto(BASE+"/index.html?nostats=1&home=1",wait_until="load"); pg.wait_for_timeout(5000)
          ev(pg,"return ("+SEED+")();"); ev(pg,"markVersionSeen();")
          pg.reload(wait_until="load"); pg.wait_for_timeout(7000)
          ev(pg,"window.titleSettingsOpen=true; renderTitleModal(sc);",500)
          try:
              tap(pg,"[data-loc=home]"); pg.wait_for_timeout(5000)
          except Exception as e: log.append(size+" loc home "+str(e)[:160])
          shot(pg,"d01-title-maple-hollow","window.titleSettingsOpen=false; renderTitleModal(sc);",1500)
          try: tap(pg,"#title-clockin-btn")
          except Exception as e: log.append(size+" click punch D "+str(e)[:120])
          pg.wait_for_timeout(1500); ev(pg,"endShiftBriefing(); window.DEV=window.DEV||{}; DEV.god=true;",300)
          pg.keyboard.down("s"); pg.wait_for_timeout(1300); pg.keyboard.up("s")
          pg.wait_for_timeout(3500)
          shot(pg,"d02-maple-hollow-hud",HEAL+QUIET+NOXP,800,rect=True)
          ev(pg,"runElapsedMs = msAtAge(40.6);",1500)
          ev(pg,QUIET+"const k=KeyHunt.state(); if(k){ player.body.reset(k.door.x,k.door.y+75);} ",300)
          pg.keyboard.down("w"); pg.wait_for_timeout(700); pg.keyboard.up("w")
          shot(pg,"d03-key-hunt-chip",HEAL,1300,rect=True)
          ev(pg,QUIET+"Lounge.forceOpen(sc); const s=Lounge.spot(); player.body.reset(s.x,s.y+60);",500)
          pg.keyboard.down("w"); pg.wait_for_timeout(900); pg.keyboard.up("w")
          shot(pg,"d04-lemonade-stand",HEAL+QUIET,1200)
          c.close()
        # ---------- Session F: the win
        if 'F' in SESS:
          c=ctx_for(b,size); pg=page(c)
          pg.goto(BASE+"/index.html?nostats=1",wait_until="load"); pg.wait_for_timeout(5000)
          ev(pg,"return ("+SEED+")();"); ev(pg,"markVersionSeen();")
          pg.reload(wait_until="load"); pg.wait_for_timeout(7000)
          try: tap(pg,"#title-clockin-btn")
          except Exception as e: log.append(size+" click punch F "+str(e)[:120])
          pg.wait_for_timeout(1500); ev(pg,"endShiftBriefing(); window.DEV=window.DEV||{}; DEV.god=true;",300)
          pg.keyboard.down("s"); pg.wait_for_timeout(1300); pg.keyboard.up("s")
          ev(pg,NOXP+"UPGRADES.filter(u=>!u.isEvolution&&!u.isConsumable&&(!u.when||u.when(stats))).slice(0,5).forEach(u=>{try{applyUpgrade(u);}catch(e){}});",2000)
          shot(pg,"d05-retirement-win-screen","DEV.god=false; runElapsedMs = msAtAge(65.0); currentAge=65; showGameOver(sc,null,true);",3500)
          shot(pg,"d06-retirement-scrolled","const m=[...document.querySelectorAll('.ui-modal:not(.hidden), .ui-modal:not(.hidden) *')].find(e=>e.scrollHeight>e.clientHeight+40&&/(auto|scroll)/.test(getComputedStyle(e).overflowY)); if(m) m.scrollTop=m.scrollHeight;",700)
          c.close()
        # ---------- Session E: the website
        if 'E' in SESS:
          c=ctx_for(b,size); pg=page(c)
          for nm,url in [("e01-devlog-index","/devlog/"),("e02-devlog-memo","/devlog/13-side-characters/"),("e03-art-room","/devlog/art/"),("e04-about","/devlog/about/")]:
              try:
                  pg.goto(BASE+url,wait_until="load"); pg.wait_for_timeout(2500)
                  pg.screenshot(path=out+"/"+nm+".jpg",type="jpeg",quality=78)
                  pg.evaluate("window.scrollTo(0, window.innerHeight*1.4)"); pg.wait_for_timeout(900)
                  pg.screenshot(path=out+"/"+nm+"-scrolled.jpg",type="jpeg",quality=78)
              except Exception as e: log.append("%s %s ERR %s"%(size,nm,str(e)[:200]))
          c.close()
        b.close()
    json.dump(rects,open(out+"/rects.json","w"),indent=1)
for s in sizes:
    t=time.time(); run(s); print(s,"done",round(time.time()-t),"s")
print("\n".join(log))
