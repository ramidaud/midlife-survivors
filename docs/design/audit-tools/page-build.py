import sys, os, html, shutil, json
sys.path.insert(0, os.path.dirname(__file__))
from data import GROUPS, TOP10
S="./audit-work"
REPO="/home/claude/midlife-survivors"; OUT=REPO+"/docs/design"; SH=OUT+"/audit-shots"
SZ=[("phone","Phone","390 x 844"),("ipadp","iPad portrait","820 x 1180"),("ipadl","iPad landscape","1180 x 820"),("desk","Desktop","1440 x 900")]
DIM={"phone":(390,844),"ipadp":(820,1180),"ipadl":(1180,820),"desk":(1440,900)}
from PIL import Image
os.makedirs(SH,exist_ok=True)
names={}; n=0; missing=[]
for g in GROUPS:
    for s in g[3]:
        names[s[0]]=s[1]
        for z,_,_ in SZ:
            src=f"{S}/shots/{z}/{s[2]}.jpg"; os.makedirs(f"{SH}/{z}",exist_ok=True)
            if not os.path.exists(src): missing.append(src); continue
            im=Image.open(src).convert("RGB"); im.save(f"{SH}/{z}/{s[2]}.jpg","JPEG",quality=70,optimize=True,progressive=True); n+=1
e=html.escape
H=300
def strip(s):
    out=[]
    for z,label,dim in SZ:
        w,h=DIM[z]; tw=round(w*H/h)
        if not os.path.exists(f"{SH}/{z}/{s[2]}.jpg"):
            out.append(f'<figure class="shot"><div class="none" style="width:{tw}px;height:{H}px">No touch controls on {label.lower()}</div><figcaption>{label} <span>{dim}</span></figcaption></figure>'); continue
        out.append(f'<figure class="shot"><button type="button" class="zoom" data-src="audit-shots/{z}/{s[2]}.jpg" data-cap="{e(s[1])} · {label}" aria-label="Enlarge {e(s[1])}, {label}"><img loading="lazy" src="audit-shots/{z}/{s[2]}.jpg" width="{tw}" height="{H}" alt="{e(s[1])} on {label.lower()}"></button><figcaption>{label} <span>{dim}</span></figcaption></figure>')
    return "".join(out)
total=sum(len(g[3]) for g in GROUPS)
sec=[]; i=0
for gid,gt,gsub,items in GROUPS:
    rows=[]
    for s in items:
        i+=1
        rows.append(f'''<article class="surface" id="s-{s[0]}">
<header><span class="num">{i:02d}</span><h3>{e(s[1])}</h3></header>
<div class="strip" tabindex="0" role="group" aria-label="{e(s[1])} at four sizes">{strip(s)}</div>
<dl class="notes"><div><dt>Look</dt><dd>{e(s[3])}</dd></div><div><dt>Attention</dt><dd>{e(s[4])}</dd></div><div><dt>Device fit</dt><dd>{e(s[5])}</dd></div></dl>
</article>''')
    sec.append(f'<section class="group" id="g-{gid}"><div class="ghead"><h2>{e(gt)}</h2><p>{e(gsub)}</p></div>{"".join(rows)}</section>')
nav="".join(f'<a href="#g-{g[0]}">{e(g[1])}</a>' for g in GROUPS)+'<a class="hot" href="#top10">Top 10</a>'
top=[]
for k,(t,body,refs) in enumerate(TOP10,1):
    links=" ".join(f'<a href="#s-{r}">{e(names[r])}</a>' for r in refs)
    top.append(f'<li><span class="rank">{k}</span><div><h3>{e(t)}</h3><p>{e(body)}</p><p class="see">See: {links}</p></div></li>')
CSS=open(os.path.dirname(__file__)+"/page.css").read(); JS=open(os.path.dirname(__file__)+"/page.js").read()
BODY=open(os.path.dirname(__file__)+"/intro.html").read()
page=f'''<title>Midlife Survivors UI Audit</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Silkscreen:wght@400;700&display=swap">
<style>{CSS}</style>
<div class="wrap">
{BODY.replace("{{TOTAL}}",str(total)).replace("{{SHOTS}}",str(n))}
<nav class="jump" aria-label="Sections">{nav}</nav>
{"".join(sec)}
<section class="top10" id="top10"><div class="ghead"><h2>Top 10 problems</h2><p>Ranked by how much each one hurts "where should I be looking"</p></div><ol>{"".join(top)}</ol></section>
{open(os.path.dirname(__file__)+"/outro.html").read()}
</div>
<dialog id="lb" aria-label="Enlarged screenshot"><form method="dialog"><button class="x" aria-label="Close">CLOSE</button></form><div class="lbscroll"><img id="lbimg" alt=""></div><p id="lbcap"></p></dialog>
<script>{JS}</script>
'''
open(OUT+"/ui-audit-2026-11.html","w").write(page.encode("ascii","xmlcharrefreplace").decode())
print("surfaces",total,"shots",n,"missing",missing[:8], "bytes", sum(os.path.getsize(os.path.join(d,f)) for d,_,fs in os.walk(SH) for f in fs)//1024,"KB")
# markdown
md=[open(os.path.dirname(__file__)+"/intro.md").read().replace("{{TOTAL}}",str(total)).replace("{{SHOTS}}",str(n))]
i=0
for gid,gt,gsub,items in GROUPS:
    md.append(f"\n## {gt}\n")
    for s in items:
        i+=1
        md.append(f"### {i:02d}. {s[1]}\nShots: `audit-shots/<size>/{s[2]}.jpg` (phone, ipadp, ipadl, desk)\n- **Look:** {s[3]}\n- **Attention:** {s[4]}\n- **Device fit:** {s[5]}\n")
md.append("\n## Top 10 problems\nRanked by how much each one hurts \"where should I be looking.\"\n")
for k,(t,body,refs) in enumerate(TOP10,1):
    md.append(f"{k}. **{t}** {body} *See: {', '.join(names[r] for r in refs)}.*")
md.append(open(os.path.dirname(__file__)+"/outro.md").read())
open(OUT+"/ui-audit-2026-11.md","w").write("\n".join(md)+"\n")
json.dump([f"audit-shots/{z}/{s[2]}.jpg" for g in GROUPS for s in g[3] for z,_,_ in SZ if os.path.exists(f"{SH}/{z}/{s[2]}.jpg")],open(S+"/build/files.json","w"))
