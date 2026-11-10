import os, re
from playwright.sync_api import sync_playwright
S="./audit-work"
V=S+"/vendor/node_modules"
BASE="http://localhost:8765"
SIZES={"phone":(390,844,True),"ipadp":(820,1180,True),"ipadl":(1180,820,True),"desk":(1440,900,False)}
def fontcss():
    out=""
    for fam,pkg,vars_ in [("Silkscreen","silkscreen",[(400,"normal"),(700,"normal")]),("Atkinson Hyperlegible","atkinson-hyperlegible",[(400,"normal"),(700,"normal"),(400,"italic")])]:
        for w,st in vars_:
            out+="@font-face{font-family:'%s';font-style:%s;font-weight:%d;src:url(https://fonts.gstatic.com/local/%s-latin-%d-%s.woff2) format('woff2');}\n"%(fam,st,w,pkg,w,st)
    return out
def install_routes(ctx, blocked=None):
    def route(r):
        u=r.request.url
        if u.startswith(BASE): return r.continue_()
        if "phaser" in u and "cdnjs" in u: return r.fulfill(path=V+"/phaser/dist/phaser.min.js",content_type="application/javascript")
        if "marked" in u and "cdnjs" in u: return r.fulfill(path=V+"/marked/marked.min.js",content_type="application/javascript")
        if "fonts.googleapis.com" in u: return r.fulfill(body=fontcss(),content_type="text/css")
        m=re.search(r"fonts.gstatic.com/local/((silkscreen|atkinson-hyperlegible)-.*\.woff2)",u)
        if m:
            pkg=m.group(2)
            return r.fulfill(path=V+"/@fontsource/%s/files/%s"%(pkg,m.group(1)),content_type="font/woff2",headers={"access-control-allow-origin":"*"})
        if blocked is not None: blocked.append(u[:90])
        return r.abort()
    ctx.route("**/*", route)
def launch(p):
    return p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist","--autoplay-policy=no-user-gesture-required","--mute-audio"])
def ctx_for(b, size, storage=None):
    w,h,touch=SIZES[size]
    c=b.new_context(viewport={"width":w,"height":h},device_scale_factor=1,has_touch=touch,is_mobile=(size=="phone"),
        user_agent=("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" if size=="phone" else None))
    install_routes(c)
    if storage: c.add_init_script(storage)
    return c
