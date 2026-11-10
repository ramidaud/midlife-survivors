import re, html, os
S=os.path.dirname(__file__); D="../"
md=open(D+"design-system-v1.md").read()
def inline(t):
    t=html.escape(t,quote=False); t=re.sub(r"\*\*(.+?)\*\*",r"<b>\1</b>",t); t=re.sub(r"`(.+?)`",r"<code>\1</code>",t); return t
def tables(section):
    a=md.index(section); b=md.find("\n## ",a+5); chunk=md[a:b if b>0 else None]; out=[]; cur=[]
    for ln in chunk.split("\n")+[""]:
        if ln.startswith("|"): cur.append(ln)
        elif cur:
            rows=[[c.strip() for c in r.strip().strip("|").split("|")] for r in cur if not re.match(r"^\|[\s\-|]+\|$",r)]
            h="<div class='tw'><table><thead><tr>"+"".join(f"<th>{inline(c)}</th>" for c in rows[0])+"</tr></thead><tbody>"
            for r in rows[1:]:
                cells=[]
                for c in r:
                    if c in("S","M","L"): cells.append(f"<td><span class='tag {c.lower()}'>{c}</span></td>")
                    else: cells.append(f"<td>{inline(c)}</td>")
                h+="<tr>"+"".join(cells)+"</tr>"
            out.append(h+"</tbody></table></div>"); cur=[]
    return out
T7=tables("## 7. Mapping"); T8=tables("## 8. Recommendations"); T9=tables("## 9. Migration plan"); T32=tables("### 3.2 The queue"); T4=tables("## 4. Size classes"); T6=tables("## 6. Voice for UI")
HUD=lambda cls="",age="AGE 45",t="03:47": f'''<div class="xp"><i></i></div><div class="hud {cls}"><div class="l"><span class="stat"><i></i>641k</span><span class="stat q">SCORE 3,017</span><span class="slots"><i></i><i></i><i></i></span></div><div class="age"><b>{age}</b><span>{t}</span></div><div class="r"><span class="rb"><i class="pz"></i></span><span class="rb"><i class="sp"></i></span></div></div>'''
def fit(w,h,inner,bg):
    return f'<div class="fit" data-w="{w}" data-h="{h}" style="aspect-ratio:{w}/{h}"><div class="mk" style="width:{w}px;height:{h}px;background-image:url({bg})">{inner}</div></div>'
BAND='<div class="band" style="bottom:{b}px"><img src="mock/boss.png" alt=""><div><span class="k">ANNUAL EVALUATION</span><div class="nm">PERFORMANCE REVIEW</div><div class="tp">Sidestep when the clipboard flashes.</div></div></div>'
m_hud_ph=fit(390,844,HUD()+'<div class="bossm" style="top:108px"><span>PERFORMANCE REVIEW</span><div><i></i></div></div>'+BAND.format(b=96),"mock/boss-phone.jpg")
m_hud_dk=fit(1440,900,'<div class="wide">'+HUD()+'<div class="bossm" style="top:112px;left:420px;right:420px"><span>PERFORMANCE REVIEW</span><div><i></i></div></div><div class="mmap">BULLPEN</div>'+BAND.format(b=28)+'</div>',"mock/boss-desk.jpg")
badges=lambda: "".join(f'<div class="bdg{" sel" if i==0 else ""}"><img src="mock/{f}.png" alt=""><span>{n}</span></div>' for i,(f,n) in enumerate([("hero","9-to-5er"),("dad","Soccer Dad"),("grad","Grad Student"),("cowboy","Cowboy")]))
shiftrow='<div class="row"><span class="ic"></span><span><span class="t">Today\'s shift</span><br><span class="d">The Office · Midlife, 40 to 65 · Tax 0</span></span><span class="val">CHANGE ›</span></div>'
m_title_ph=fit(390,844,f'''<div class="tshade"></div><div class="tstack"><div><span class="strip"><span class="re">HR · RE:</span><strong>Surviving 40 to 65</strong></span></div>
<div class="logo"><span>MIDLIFE</span><span>SURVIVORS</span></div><p class="tag2">Survive from 40 to 65. Retirement is waiting.</p>
<button class="btn pri block big">PUNCH IN</button>{shiftrow}<div class="bdgs">{badges()}</div></div>
<div class="tabbar"><span class="on"><i></i>PLAY</span><span><i></i>SHOP</span><span><i></i>RECORDS</span><span><i></i>DEVLOG</span><span><i></i>SETTINGS</span></div>''',"mock/title-portrait.jpg")
m_title_dk=fit(1440,900,f'''<div class="wide"><div class="tnav"><b>MIDLIFE SURVIVORS</b><span>SHOP</span><span>RECORDS</span><span>DEVLOG</span><span>ART ROOM</span><span>SETTINGS</span></div><div class="tside"></div>
<div class="tcol"><div><span class="strip"><span class="re">HR · RE:</span><strong>Surviving 40 to 65</strong></span></div>
<div class="logo"><span>MIDLIFE</span><span>SURVIVORS</span></div><p class="tag2">Survive from 40 to 65. Retirement is waiting.</p>
<button class="btn pri block big">PUNCH IN</button>{shiftrow}<div class="bdgs">{badges()}</div><p class="last">Last shift: you reached 58.4 before the 30-Year Mortgage got you.</p></div>
<div class="card memo tmemo"><div class="kick">DEVLOG · MEMO 13</div><h5>Music is one of the most important side characters.</h5><p>Why music matters to me, the school run with Abe, and the songs that are the game.</p><span class="btn" style="margin-top:12px;border-color:#171C35;color:#171C35">READ IT</span></div></div>''',"mock/title-desk.jpg")
# two homes diagrams
home_alarm=fit(390,844,HUD()+'''<div style="position:absolute;left:16px;right:16px;top:108px"><div class="plate"><span class="mark">!</span><div><div class="k">Tax season</div><div class="ln">A wall of bills from the east. Pick a gap.</div></div></div></div>
<div class="zone floor" style="top:200px;height:440px">The floor<br>nothing covers it</div>
<div style="position:absolute;left:16px;right:16px;bottom:96px"><div class="toast"><span class="lb">Tip</span><span class="tx">Elites drop bigger gems. Circle back.</span></div></div>
<div class="zone thumb" style="bottom:8px;height:80px">thumb</div>''',"mock/boss-phone.jpg")
home_rest=fit(390,844,HUD()+'''<div style="position:absolute;left:16px;right:16px;top:108px;display:flex;gap:6px"><span class="chip"><i class="bx"></i>Printer · Bullpen <b>40s</b></span><span class="chip mod">Glasses <b>1:32</b></span></div>
<div class="mmap ph">BULLPEN</div>
<div class="zone floor" style="top:250px;height:390px">The floor</div>
<div class="zone thumb" style="bottom:8px;height:80px">thumb</div>''',"mock/boss-phone.jpg")
P=lambda s: open(os.path.join(S,s)).read()
page=P("page.html")
for k,v in dict(M_HUD_PH=m_hud_ph,M_HUD_DK=m_hud_dk,M_TITLE_PH=m_title_ph,M_TITLE_DK=m_title_dk,HOME_ALARM=home_alarm,HOME_REST=home_rest,T32=T32[0],T4B=T4[1],T6=T6[0],T7A=T7[0],T7B=T7[1],T8=T8[0],T9A=T9[0],T9B=T9[1],T9C=T9[2]).items():
    assert "{{"+k+"}}" in page,k; page=page.replace("{{"+k+"}}",v)
assert "{{" not in page, re.findall(r"\{\{\w+\}\}",page)
out=f'''<title>Midlife Survivors Design System</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Silkscreen:wght@400;700&display=swap">
<style>{P("ds.css")}{P("mock.css")}</style>
{page}
<script>{P("page.js")}</script>
'''
open(D+"design-system-v1.html","w").write(out.encode("ascii","xmlcharrefreplace").decode()); print(len(out))
