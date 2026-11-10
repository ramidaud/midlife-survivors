import html, os
S=os.path.dirname(__file__); D="../"
e=html.escape
# region: (n, x, y, w, h, kind[, label])   all in % of the frame.  n=0: unlabeled backdrop
SCREENS=[
("title","Title screen","One primary. The art gets the room. The same order of parts on every device.",
 [("Key art","Rotating title art. Decoration only, never a tap target.","—"),
  ("Strip, logo, tagline","Memo strip, logo in display-l, one line.","—"),
  ("PUNCH IN","The one primary. Starts the run.","Thumb zone on phones. A or Enter."),
  ("Today's shift","A Row showing stage and mode. Opens a small sheet: location, mode, sprint, tax.","Tap. Down, then A."),
  ("Employee cards","Four tile Cards. Selected has the coffee border.","Tap. Left and right."),
  ("Bottom bar / top nav","Shop, Records, Devlog, Settings. Bottom bar on phones, top nav elsewhere.","Tap. Bumpers (LB/RB)."),
  ("Devlog memo","Memo Card on paper. On phones it lives in the Devlog tab.","Tap opens the memo."),
  ("Toast slot","What's New, welcome back. One at a time, leaves on its own.","Tap to open, or ignore.")],
 {"phone":[(1,0,0,100,48,"art"),(2,4,40,92,13,"box"),(3,4,55,92,8,"pri"),(4,4,65,92,7,"box"),(5,4,74,92,9,"box"),(8,4,84.5,92,5.5,"dash"),(6,0,92,100,8,"bar")],
  "ipad":[(6,0,0,100,5,"bar"),(1,0,5,100,45,"art"),(2,6,38,60,12,"box"),(3,6,53,42,7,"pri"),(4,6,62,42,6,"box"),(5,6,70,42,12,"box"),(7,54,53,40,29,"paper"),(8,54,86,40,6,"dash")],
  "desk":[(6,0,0,100,6,"bar"),(1,0,6,100,94,"art"),(2,4,14,30,22,"box"),(3,4,40,30,9,"pri"),(4,4,51,30,8,"box"),(5,4,61,30,14,"box"),(7,70,62,26,30,"paper"),(8,70,10,26,8,"dash")]}),
("shop","401(k) shop","A Sheet with Rows. The balance leads. No orange buttons in the list.",
 [("Header","Memo strip (HR · RE: Your 401(k)) and a title.","—"),
  ("Balance","Your coins as the hero number, display-s.","—"),
  ("Rows","Icon, name, rank pips, effect line, price tag. Coffee price means you can afford it.","Tap a row to buy. A on a focused row."),
  ("Locked rows","Dimmed, with a lock mark and how to unlock.","Focusable, so the reason can be read."),
  ("Action bar","BACK (secondary). REFUND ALL (danger, asks twice).","B or Esc goes back."),
  ("Legend","Controller and key hints. Hidden on touch.","—")],
 {"phone":[(1,4,6,58,9,"box"),(2,64,6,32,9,"sel"),(3,4,17,92,53,"box","Rows · 1 column"),(4,4,71,92,12,"dim"),(5,0,85,100,9,"bar"),(6,0,94,100,6,"dash")],
  "ipad":[(0,0,0,100,100,"scrim"),(0,10,12,80,77,"sheet"),(1,12,14,50,8,"box"),(2,64,14,24,8,"sel"),(3,12,24,76,40,"box","Rows · 2 columns"),(4,12,65,76,10,"dim"),(5,12,77,76,7,"bar"),(6,12,85,76,3,"dash")],
  "desk":[(0,0,0,100,100,"scrim"),(0,14,10,72,81,"sheet"),(1,16,13,44,10,"box"),(2,62,13,22,10,"sel"),(3,16,26,68,38,"box","Rows · 3 columns"),(4,16,65,68,10,"dim"),(5,16,77,68,8,"bar"),(6,16,86,68,3.5,"dash")]}),
("leaders","Leaderboard","A Sheet with Rows. Your own best is pinned so you never scroll to find yourself.",
 [("Header","Memo strip and title.","—"),
  ("Board switch","This year / All-time. Two secondary buttons, one selected.","Tap. Left and right."),
  ("Your best","Your own Row, pinned, coffee border.","—"),
  ("Rows","Rank, name, score, age, in tabular figures. Empty state: \"No scores yet. Punch in and set one.\"","Scroll. Up and down."),
  ("Action bar","BACK (secondary).","B or Esc.")],
 {"phone":[(1,4,6,92,9,"box"),(2,4,16,92,6,"box"),(3,4,24,92,8,"sel"),(4,4,33,92,50,"box"),(5,0,86,100,9,"bar")],
  "ipad":[(0,0,0,100,100,"scrim"),(0,10,14,80,72,"sheet"),(1,12,16,76,8,"box"),(2,12,25,40,5,"box"),(3,12,31,76,7,"sel"),(4,12,39,76,36,"box"),(5,12,77,76,7,"bar")],
  "desk":[(0,0,0,100,100,"scrim"),(0,20,10,60,80,"sheet"),(1,22,13,56,10,"box"),(2,22,24,26,6,"box"),(3,22,31,56,8,"sel"),(4,22,40,56,36,"box"),(5,22,78,56,9,"bar")]}),
("settings","Settings (today's Options, plus the settings inside Pause)","One place for sound, game and controls. Reached from the title and from Pause.",
 [("Header","Memo strip and title.","—"),
  ("Sections","Sound, Game, Controls. Tabs on phones and tablets, a list on wide screens.","Tap. Bumpers switch section."),
  ("Rows","One setting per Row with a switch, stepper or value. Plain names (\"Confirm: A\").","Tap. Left and right change a value."),
  ("Controls","Shows the input you are using now: touch, keys or controller.","A on a Row rebinds it."),
  ("Action bar","DONE (primary). RESET TO DEFAULTS (danger, asks twice).","B or Esc saves and closes."),
  ("Legend","Controller and key hints. Hidden on touch.","—")],
 {"phone":[(1,4,6,92,8,"box"),(2,4,15,92,6,"box","Sections · tabs"),(3,4,22,92,38,"box"),(4,4,61,92,22,"box"),(5,0,85,100,9,"pribar"),(6,0,94,100,6,"dash")],
  "ipad":[(0,0,0,100,100,"scrim"),(0,10,12,80,76,"sheet"),(1,12,14,76,7,"box"),(2,12,22,76,5,"box","Sections · tabs"),(3,12,28,37,44,"box"),(4,51,28,37,44,"box"),(5,12,74,76,7,"pribar"),(6,12,82,76,4,"dash")],
  "desk":[(0,0,0,100,100,"scrim"),(0,14,10,72,81,"sheet"),(1,16,13,68,9,"box"),(2,16,24,16,50,"box","Sections · list"),(3,34,24,24,50,"box"),(4,60,24,24,50,"box"),(5,16,76,68,8,"pribar"),(6,16,85,68,4,"dash")]}),
("levelup","Level-up","A Sheet with three choice Cards. One primary. The card is the tap target.",
 [("Header","Memo strip and PICK A PERK.","—"),
  ("Your loadout","Slots for what you own. The only place empty slots are shown.","—"),
  ("Choice cards","Icon, name, one line, a pairs-with tag. Selected has the coffee border.","Tap selects, tap again picks. Stick moves, A picks."),
  ("Action bar","SKIP and REROLL (secondary), PICK (primary).","Thumb zone. X rerolls, Y skips."),
  ("Legend","A pick, X reroll, Y skip. Hidden on touch.","—"),
  ("The game, dimmed","Solid scrim. Chips, ticker and minimap are hidden.","—")],
 {"phone":[(6,0,0,100,14,"scrim"),(0,0,14,100,86,"sheet"),(1,4,16,92,8,"box"),(2,4,25,92,6,"box"),(3,4,33,92,15,"sel"),(3,4,49,92,15,"box"),(3,4,65,92,15,"box"),(4,0,83,100,10,"pribar"),(5,0,94,100,6,"dash")],
  "ipad":[(6,0,0,100,100,"scrim"),(0,10,22,80,57,"sheet"),(1,13,24,74,7,"box"),(2,13,32,74,5,"box"),(3,13,39,23.5,26,"sel"),(3,38.2,39,23.5,26,"box"),(3,63.5,39,23.5,26,"box"),(4,13,67,74,6,"pribar"),(5,13,74,74,3.5,"dash")],
  "desk":[(6,0,0,100,100,"scrim"),(0,22,14,56,73,"sheet"),(1,24,17,52,9,"box"),(2,24,27,52,7,"box"),(3,24,36,16.5,34,"sel"),(3,41.7,36,16.5,34,"box"),(3,59.5,36,16.5,34,"box"),(4,24,72,52,8,"pribar"),(5,24,81,52,4,"dash")]}),
("pause","Pause","Resume, a short summary, three rows. Settings moved to their own sheet.",
 [("Header","Memo strip and ON BREAK.","—"),
  ("RESUME","The one primary.","Thumb zone. A, Start or Space."),
  ("Run summary","Age, level, time, loadout. Folds away.","Tap to fold."),
  ("Rows","Settings. Save and exit. Start over (danger, asks twice).","Tap. Up and down, A."),
  ("Legend","Hidden on touch.","—"),
  ("The game, dimmed","Solid scrim. The site nav stays hidden.","—")],
 {"phone":[(6,0,0,100,20,"scrim"),(0,0,20,100,80,"sheet"),(1,4,22,92,9,"box"),(3,4,33,92,22,"box"),(4,4,57,92,24,"box"),(2,4,83,92,10,"pri"),(5,0,94,100,6,"dash")],
  "ipad":[(6,0,0,100,100,"scrim"),(0,20,22,60,60,"sheet"),(1,22,24,56,7,"box"),(3,22,32,56,16,"box"),(4,22,49,56,18,"box"),(2,22,69,56,7,"pri"),(5,22,77,56,3.5,"dash")],
  "desk":[(6,0,0,100,100,"scrim"),(0,30,16,40,71,"sheet"),(1,32,19,36,10,"box"),(3,32,31,36,18,"box"),(4,32,51,36,20,"box"),(2,32,73,36,8,"pri"),(5,32,82,36,4,"dash")]}),
("gameover","Game over (and retirement)","A full-screen Moment. The numbers you would brag about come first.",
 [("Scene art","The defeat scene, or the retirement party on a win.","—"),
  ("Headline","The cause line in headline size, and the joke under it.","—"),
  ("Hero numbers","Age reached and score in display-l. A NEW BEST tag when earned.","—"),
  ("RETRY","The one primary.","Thumb zone. A or Enter."),
  ("Secondary","SHOP (says what you can afford now) and TITLE.","Tap. Left and right."),
  ("Pay stub","Rows, folded by default: paycheck, bonuses, earned, next goals.","Tap to unfold."),
  ("Post score","A Row with your remembered name and a secondary POST.","Tap. X posts.")],
 {"phone":[(1,0,0,100,26,"art"),(2,4,27,92,11,"box"),(3,4,39,92,13,"sel"),(6,4,53,92,9,"box"),(7,4,63,92,7,"box"),(5,4,72,92,7,"box"),(4,4,81,92,10,"pri")],
  "ipad":[(1,0,0,100,34,"art"),(2,12,36,76,9,"box"),(3,12,46,76,11,"sel"),(6,12,58,76,10,"box"),(7,12,69,76,6,"box"),(4,12,78,37,8,"pri"),(5,51,78,37,8,"box")],
  "desk":[(1,0,0,50,100,"art"),(2,54,10,40,14,"box"),(3,54,26,40,16,"sel"),(6,54,44,40,14,"box"),(7,54,60,40,8,"box"),(4,54,72,19,11,"pri"),(5,75,72,19,11,"box")]}),
("hud","In-run HUD and message slots","Two homes for words. The middle belongs to the game.",
 [("XP meter","Full width, 6 px.","—"),
  ("Coins, score, slots","Stat parts. Only the slots you own.","—"),
  ("Age and timer","The age is the hero number. Timer under it.","—"),
  ("Pause, sound","Round buttons, 44 px.","Tap. Start pauses."),
  ("HEADLINE slot","Rung 4. Alarms: swarm, modifier, errand start, GOTCHA. At rest it shows 6 and 7.","Never needs a tap."),
  ("Status row","Rung 2. One objective chip and one status chip, one row.","—"),
  ("Minimap","Steps aside on phones while a headline is up.","Tap, or M, opens the big map."),
  ("THE FLOOR","Rung 0. Telegraphs, numbers, name tags. Nothing covers it during a boss.","Move."),
  ("TICKER slot","Rung 3. Tips, rewards, promoted. The spotlight band uses this home too.","—"),
  ("Thumb zone","The floating joystick. The ticker sits above it.","Drag to move.")],
 {"phone":[(1,0,0,100,1.4,"pri"),(2,2,2.4,32,8.5,"box"),(3,36,2.4,28,7,"sel"),(4,72,2.4,26,6,"box"),(5,3,12,94,9,"dash"),(6,5,13,58,3.4,"box"),(7,68,22.5,28,11.5,"box"),(8,6,37,88,40,"floor"),(9,4,80,92,6.5,"dash"),(10,20,88.5,60,10,"thumb")],
  "ipad":[(1,0,0,100,1,"pri"),(2,2,2,22,7,"box"),(3,40,2,20,6,"sel"),(4,86,2,12,4.5,"box"),(5,16,10,58,6,"dash"),(6,19,10.8,36,2.6,"box"),(7,76,10,22,12,"box"),(8,10,30,80,44,"floor"),(9,11,90,78,5,"dash"),(10,30,78,40,9,"thumb")],
  "desk":[(1,0,0,100,1.4,"pri"),(2,9,3,18,9,"box"),(3,43,3,14,8,"sel"),(4,84,3,7,6,"box"),(5,30,13,40,8,"dash"),(6,33,14.5,24,4,"box"),(7,75,13,16,20,"box"),(8,20,36,60,40,"floor"),(9,25,88,50,8,"dash")]}),
("boss","A boss arrives","One message. The band says who it is and how to dodge, then gets out of the way.",
 [("HUD","Unchanged.","—"),
  ("Boss meter","Name and health under the HUD for the whole fight.","—"),
  ("THE FLOOR","The first telegraph is visible the whole time. No dim.","Move."),
  ("BAND","Rung 4, 3.5 s. Portrait, name, one dodge tip. Compact on phones.","Tap or A dismisses early."),
  ("Status row, minimap","Hidden on phones while the band is up. They stay on bigger screens.","—"),
  ("Ticker","Waits. The band is using its home.","—")],
 {"phone":[(1,0,0,100,11,"box"),(2,4,12.5,92,3.5,"box"),(5,4,17,92,7,"dash","5 hidden"),(3,6,30,88,44,"floor"),(4,0,77.5,100,11,"band"),(0,20,90,60,8,"thumb","Thumb zone")],
  "ipad":[(1,0,0,100,9,"box"),(2,25,10,50,2.6,"box"),(5,76,10,22,12,"box"),(3,10,28,80,46,"floor"),(4,0,82,100,11,"band")],
  "desk":[(1,9,0,82,11,"box"),(2,30,13,40,4,"box"),(5,75,13,16,20,"box"),(3,20,36,60,38,"floor"),(4,0,80,100,15,"band")]}),
("memo","Devlog memo page","Already the best-scaling page. It moves onto the tokens and keeps its layout.",
 [("Top nav","Brand and links. A menu button on phones.","Tap."),
  ("Cover art","Full width on phones, inside the column elsewhere.","—"),
  ("Strip and headline","MEMO NN · RE:, the headline, date and version chips.","—"),
  ("Body","body size, 65 characters wide at most, pixel drop cap.","Scroll."),
  ("Side column","What changed, Next up. Below the memo on phones.","—"),
  ("Actions","PLAY THIS BUILD (primary), SHARE (secondary).","Tap."),
  ("Other memos","Previous and next as Rows.","Tap.")],
 {"phone":[(1,0,0,100,6,"bar"),(2,0,6,100,24,"art"),(3,4,31,92,13,"paper"),(6,4,45,92,6,"pri"),(4,4,53,92,26,"box"),(5,4,80,92,10,"box"),(7,4,91,92,7,"box")],
  "ipad":[(1,0,0,100,5,"bar"),(2,8,7,84,28,"art"),(3,8,36,84,10,"paper"),(6,8,47,40,5,"pri"),(4,8,54,54,36,"box"),(5,65,54,27,24,"box"),(7,8,92,84,6,"box")],
  "desk":[(1,0,0,100,7,"bar"),(2,18,9,44,36,"art"),(3,18,46,44,14,"paper"),(6,18,62,20,7,"pri"),(4,18,71,44,27,"box"),(5,66,9,18,40,"box"),(7,66,52,18,20,"box")]}),
("art","Art Room","Cards and chips from the same kit. The live scene gets the room.",
 [("Top nav","Brand and links.","Tap."),
  ("Strip, title, intro","Memo strip, a title, one line.","—"),
  ("Filter chips","Heroes, Coworkers, Enemies, Bosses, Stages.","Tap. Left and right."),
  ("Live scene","The office, animated. Still with reduce motion on.","—"),
  ("Character cards","Portrait, name, one line, pose chips.","Tap a pose chip to play it."),
  ("PLAY THE GAME","The one primary.","Tap.")],
 {"phone":[(1,0,0,100,6,"bar"),(2,4,7,92,11,"paper"),(3,4,19,92,5,"box"),(4,4,25,92,24,"art"),(5,4,50,92,18,"box"),(5,4,69,92,18,"box"),(6,4,89,92,7,"pri")],
  "ipad":[(1,0,0,100,5,"bar"),(2,6,7,88,8,"paper"),(3,6,16,88,4,"box"),(4,6,21,88,30,"art"),(5,6,53,43,36,"box"),(5,51,53,43,36,"box"),(6,6,91,40,5,"pri")],
  "desk":[(1,0,0,100,7,"bar"),(2,6,9,40,13,"paper"),(3,6,24,40,6,"box"),(6,6,32,18,8,"pri"),(4,50,9,44,44,"art"),(5,6,56,28,38,"box"),(5,36,56,28,38,"box"),(5,66,56,28,38,"box")]}),
]
DEV=[("phone","Phone",390,844),("ipad","iPad",820,1180),("desk","Desktop",1440,900)]
H=400
def frame(key,label,w,h,regs,legend):
    fw=round(w*H/h); out=[]
    for r in regs:
        n,x,y,rw,rh,kind=r[:6]; name=r[6] if len(r)>6 else (legend[n-1][0] if n else "")
        pw,ph=fw*rw/100,H*rh/100
        show=name if (pw>=64 and ph>=15) else ""
        lab=f'<b>{n}</b>' if n else ""
        if len(r)>6 and r[6][0].isdigit(): lab=""; show=r[6]
        tiny=" tiny" if ph<12 else ""
        out.append(f'<div class="r {kind}{tiny}" style="left:{x}%;top:{y}%;width:{rw}%;height:{rh}%">{lab}{("<span>"+e(show)+"</span>") if show else ""}</div>')
    return f'<figure class="dev"><div class="fr" style="width:{fw}px;height:{H}px">{"".join(out)}</div><figcaption>{label} <span>{w} x {h}</span></figcaption></figure>'
secs=[]
for sid,title,sub,legend,sizes in SCREENS:
    frames="".join(frame(k,l,w,h,sizes[k],legend) for k,l,w,h in DEV)
    rows="".join(f'<tr><td class="n"><b>{i}</b></td><td><b>{e(a)}</b></td><td>{e(b)}</td><td>{e(c)}</td></tr>' for i,(a,b,c) in enumerate(legend,1))
    secs.append(f'<section class="scr" id="w-{sid}"><div class="shead"><h2>{e(title)}</h2><p>{e(sub)}</p></div><div class="devs" tabindex="0" role="group" aria-label="{e(title)} wireframes">{frames}</div><div class="tw"><table><thead><tr><th></th><th>Region</th><th>What goes there</th><th>Thumb or controller</th></tr></thead><tbody>{rows}</tbody></table></div></section>')
nav="".join(f'<a href="#w-{s[0]}">{e(s[1].split(" (")[0])}</a>' for s in SCREENS)
CSS=open(S+"/wf.css").read()
page=f'''<title>Midlife Survivors Wireframes</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Silkscreen:wght@400;700&display=swap">
<style>{CSS}</style>
<div class="wrap">
<header><div><span class="strip"><span class="re">DESIGN · RE:</span><strong>Where everything goes</strong></span></div>
<h1>Midlife Survivors wireframes, v1</h1>
<p class="lede">Gray-box layouts for 11 key screens at phone, iPad and desktop. No final art. Every region is numbered, and the table under each screen says what goes there and what your thumb or controller does.</p>
<div class="key"><span><i class="r pri"></i>The one primary button</span><span><i class="r sel"></i>Selected, or a hero number</span><span><i class="r box"></i>A part (row, card, strip)</span><span><i class="r dash"></i>A slot that is empty at rest</span><span><i class="r floor"></i>The floor: never covered</span><span><i class="r art"></i>Art</span><span><i class="r paper"></i>Memo paper</span><span><i class="r band"></i>Spotlight band</span><span><i class="r scrim"></i>The game, dimmed</span></div>
</header>
<nav class="jump" aria-label="Screens">{nav}</nav>
{"".join(secs)}
<p class="foot">Wireframes v1, Nov 10, 2026. They follow design-system-v1.md. Positions are proportional, not pixel-exact. Phone landscape follows the "short" rules in the spec and is not drawn here.</p>
</div>'''
open(D+"wireframes-v1.html","w").write(page.encode("ascii","xmlcharrefreplace").decode()); print(len(page), len(SCREENS))
