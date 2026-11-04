#!/usr/bin/env python3
"""
Generate static per-post pages + RSS for the Midlife Survivors devlog.

Usage (from the devlog folder, or pass --root):
  python3 scripts/build_devlog.py
  python3 scripts/build_devlog.py --root /path/to/devlog --site-url https://ramidaud.github.io/midlife-survivors/devlog

Reads posts.js (via a tiny JSON extraction — keep posts.js as a JS array assigned to
window.DEVLOG_POSTS) OR, preferred for CI: also accepts posts.json if present.

For the mockup, posts.js is the source of truth. This script uses a regex to pull
the array and then json.loads after light cleanup. Prefer maintaining a posts.json
export later if the regex gets brittle.

Outputs:
  <slug>/index.html   — static article with Open Graph / Twitter meta
  feed.xml            — RSS 2.0
Skips draft posts unless --include-drafts.
"""
from __future__ import annotations

import argparse, json, re, html, datetime
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    from share_cards import make_post_card  # 1200x630 link-preview cards (needs Pillow)
except Exception:
    make_post_card = None

try:
    import markdown as mdlib
except ImportError:
    mdlib = None


def load_posts(root: Path) -> list[dict]:
    json_path = root / "posts.json"
    if json_path.exists():
        return json.loads(json_path.read_text())
    js = (root / "posts.js").read_text()
    m = re.search(r"window\.DEVLOG_POSTS\s*=\s*(\[[\s\S]*?\]);", js)
    if not m:
        raise SystemExit("Could not find window.DEVLOG_POSTS array in posts.js")
    # JS → JSON: allow trailing commas already absent; bare keys are quoted in our file
    raw = m.group(1)
    # true/false/null are fine for json
    return json.loads(raw)


def md_to_html(text: str) -> str:
    if mdlib:
        return mdlib.markdown(text, extensions=["fenced_code", "tables"])
    # Minimal fallback
    out = []
    for block in text.strip().split("\n\n"):
        if block.startswith("## "):
            out.append(f"<h2>{html.escape(block[3:])}</h2>")
        elif block.startswith("!["):
            m = re.match(r"!\[(.*?)\]\((.*?)\)", block.strip())
            if m:
                alt, src = m.group(1), m.group(2)
                if src.startswith("img/"):
                    src = "../" + src
                out.append(f'<p><img src="{html.escape(src)}" alt="{html.escape(alt)}"></p>')
            else:
                out.append(f"<p>{html.escape(block)}</p>")
        else:
            out.append("<p>" + html.escape(block).replace("\n", "<br>") + "</p>")
    return "\n".join(out)


PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Midlife Survivors Devlog</title>
<meta name="description" content="{description}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Midlife Survivors">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{og_image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{title}">
<meta property="og:url" content="{og_url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og_image}">
<link rel="alternate" type="application/rss+xml" title="Midlife Survivors Devlog" href="../feed.xml">
<link rel="icon" href="../../favicon.png?v=clock-1" type="image/png">
<link rel="apple-touch-icon" href="../../apple-touch-icon.png?v=clock-1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap">
<link rel="stylesheet" href="../../assets/ui/ms-nav.css?v=5">
<link rel="stylesheet" href="../styles.css?v=24">
<script data-goatcounter="https://midlifesurvivors.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</head>
<body>
  <header class="site-header is-compact">
    <a class="brand" href="../">
      <span class="brand-mark" aria-hidden="true"></span>
      <span><span class="brand-title">Midlife Survivors</span></span>
    </a>
    <div class="actions">
      <a class="btn btn-coffee" href="https://ko-fi.com/ramidaud" rel="noopener">☕ <span class="coffee-long">Buy Rami a </span>Coffee</a>
      <a class="btn btn-primary" href="{play}">▶ Play this build</a>
    </div>
  </header>
  <script src="../../assets/ui/ms-nav.js?v=3"></script>
  <div class="wrap">
    <a class="back" href="../">← All memos</a>
    <div class="memo-strip"><span class="re">MEMO · RE:</span> <strong>{title}</strong></div>
    <div class="post-header">
      <h1>{title}</h1>
      <div class="post-meta">
        <time datetime="{date}">{date_fmt}</time>
        {version_pill}{draft_pill}
      </div>
    </div>
    {lead}
    <div class="post-cta">
      <div class="cta-row"><a class="btn btn-primary" href="{play}">▶ Play this build</a><button class="btn btn-share" type="button" onclick="msShare(this)" data-slug="{slug}" data-url="{share_url}" data-title="{title}" data-text="{share_text}">↗ <span class="share-label">Share</span></button></div>
      {changes}
      {next_up}
    </div>
    <article class="post"><div class="prose">{body}</div>
      <div class="signoff"><div class="silk">Filed by Rami.</div>Survived to {version}. Screenshots are from the real game at the time.</div>
      <div class="share-end"><button class="btn btn-share" type="button" onclick="msShare(this)" data-slug="{slug}" data-url="{share_url}" data-title="{title}" data-text="{share_text}">↗ <span class="share-label">Share this memo</span></button></div>
    </article>
  </div>
  <footer class="site-footer">© 2026 Rami Daud. Written by <a href="../about/">Rami Daud</a>. Built with <a href="https://claude.ai" rel="noopener">Claude</a>, <a href="https://gemini.google.com" rel="noopener">Gemini</a>, <a href="https://chatgpt.com" rel="noopener">ChatGPT</a> and <a href="https://grok.com" rel="noopener">Grok</a>. Screenshots and clips are from the actual builds at the time. Enjoying it? <a href="https://ko-fi.com/ramidaud" rel="noopener">Buy Rami a coffee</a> ☕ or <a href="https://discord.gg/E6N9j5tZe" rel="noopener">join the Discord</a></footer>
<script src="../share.js?v=1"></script><script src="../sidenotes.js"></script><script src="../code.js?v=2"></script><script>initSidenotes(document);initCodeCards(document);</script>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--site-url", default="https://ramidaud.github.io/midlife-survivors/devlog")
    ap.add_argument("--include-drafts", action="store_true")
    args = ap.parse_args()
    root: Path = args.root
    posts = load_posts(root)
    if not args.include_drafts:
        posts = [p for p in posts if not p.get("draft")]

    site = args.site_url.rstrip("/")
    items_rss = []

    for p in posts:
        slug = p["slug"]
        md_path = root / "posts" / f"{slug}.md"
        body_md = md_path.read_text() if md_path.exists() else "_Missing memo._"
        raw_md = body_md  # untouched copy for the RSS full-text version (Substack import)
        # Code snippets: ```js src/file.js ... ``` -> code card (same markup as app.js; colors added by code.js)
        cards = []
        def _code(m):
            lang, fname, code = m.group(1), (m.group(2) or "").strip(), m.group(3)
            cards.append('<figure class="code-card"><figcaption>'
                         f'<span class="code-file">{html.escape(fname or lang)}</span><span class="code-lang">{html.escape(lang.upper())}</span>'
                         '<button class="code-copy" type="button">Copy</button></figcaption>'
                         f"<pre><code>{html.escape(code, quote=False)}</code></pre></figure>")
            return f"\n\nCODECARD{len(cards) - 1}\n\n"  # placeholder, swapped back after markdown
        body_md = re.sub(r"^```(\w+)[ \t]*([^\n]*)\n([\s\S]*?)^```[ \t]*$", _code, body_md, flags=re.M)
        # Sidenotes: ^[note] -> numbered margin note (same markup as app.js)
        sn = {"n": 0}
        def _sn(m):
            sn["n"] += 1; n = sn["n"]
            inner = mdlib.markdown(m.group(1))[3:-4] if mdlib else html.escape(m.group(1))
            return (f'<button class="sn-ref" type="button" aria-expanded="false" aria-controls="sn-{n}" aria-label="Note {n}">{n}</button>'
                    f'<span class="sn" id="sn-{n}" role="note"><span class="sn-head"><b>{n}</b><button class="sn-close" type="button" aria-label="Close note">×</button></span><span class="sn-body">{inner}</span></span>')
        body_md = re.sub(r"\^\[([^\]]+)\]", _sn, body_md)
        body = md_to_html(body_md)
        body = re.sub(r"<p>CODECARD(\d+)</p>", lambda m: cards[int(m.group(1))], body)
        body = body.replace('src="img/', 'src="../img/')
        body = re.sub(r' title="compare:[^"]*"', "", body)  # sliders only run on the devlog itself

        title = p["title"]
        desc = p.get("teaser") or title
        cover = p.get("cover") or "img/office-key-art-hero.jpg"
        og_image = f"{site}/{cover}" if not cover.startswith("http") else cover
        card = make_post_card(root.resolve().parent, p) if make_post_card else None
        if card:
            og_image = f"{site}/{card}"
        play = p.get("playUrl") or "https://ramidaud.github.io/midlife-survivors/"
        version = p.get("version") or ""
        date = p["date"]
        date_fmt = datetime.date.fromisoformat(date).strftime("%b %d, %Y")

        changes = ""
        if p.get("changes"):
            lis = "".join(f"<li>{html.escape(c)}</li>" for c in p["changes"])
            changes = f'<div class="changes-box"><h3>What changed</h3><ul>{lis}</ul></div>'
        next_up = ""
        if p.get("nextUp"):
            next_up = f'<div class="next-up"><strong>Next up</strong>{html.escape(p["nextUp"])}</div>'

        version_pill = f'<span class="pill">{html.escape(version)}</span>' if version else ""
        alt = html.escape(p.get("leadAlt") or title)
        note_html = ""
        if p.get("leadNote"):
            note_html = md_to_html(p["leadNote"]).strip()
            note_html = re.sub(r"^<p>|</p>$", "", note_html).replace('href="art/', 'href="../art/')
        cap = (f"<figcaption>{alt}" + (f'<br><span class="lead-note"><b>How this image was made:</b> {note_html}</span>' if note_html else "") + "</figcaption>") if (p.get("leadAlt") or note_html) else ""
        if p.get("leadVideo"):
            lead = (f"""<figure class="post-lead"><div class="lead-loop"><video src="../{html.escape(p["leadVideo"])}" poster="../{html.escape(p.get("cover", ""))}" autoplay muted loop playsinline disablepictureinpicture disableremoteplayback preload="auto" aria-label="{alt}" onclick="this.paused?this.play():this.pause()" onplay="var b=this.nextElementSibling;b.textContent='❚❚';b.setAttribute('aria-label','Pause animation')" onpause="var b=this.nextElementSibling;b.textContent='▶';b.setAttribute('aria-label','Play animation')"></video><button class="loop-btn" type="button" aria-label="Pause animation" onclick="var v=this.previousElementSibling;v.paused?v.play():v.pause()">❚❚</button></div>{cap}</figure>"""
                    + "<script>(function(v){if(v&&matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause();v.nextElementSibling.textContent='▶';v.nextElementSibling.setAttribute('aria-label','Play animation');}})(document.currentScript.previousElementSibling.querySelector('video'))</script>")
        elif p.get("cover"):
            lead = f'<figure class="post-lead"><img src="../{html.escape(p["cover"])}" alt="{alt}">{cap}</figure>'
        else:
            lead = ""
        draft_pill = '<span class="pill draft">DRAFT</span>' if p.get("draft") else ""

        out_dir = root / slug
        out_dir.mkdir(exist_ok=True)
        page = PAGE.format(
            title=html.escape(title),
            description=html.escape(desc),
            og_image=html.escape(og_image),
            og_url=html.escape(f"{site}/{slug}/"),
            slug=html.escape(slug),
            share_url=html.escape(f"{site}/{slug}/"),
            share_text=html.escape(f"Midlife Survivors devlog: {title}"),
            play=html.escape(play),
            date=html.escape(date),
            date_fmt=html.escape(date_fmt),
            version_pill=version_pill,
            lead=lead,
            draft_pill=draft_pill,
            changes=changes,
            next_up=next_up,
            body=body,
            version=html.escape(version or "the next build"),
        )
        (out_dir / "index.html").write_text(page)
        print("wrote", out_dir / "index.html")

        # Full post for RSS readers and Substack's importer (Nov 2: Substack only showed the teaser, so the full
        # post goes in BOTH <description> and <content:encoded>; Substack's importer appears to read <description>).
        # Plain HTML: code cards become <pre>, margin notes become italic asides, images get full URLs.
        fcode = []
        def _fcode(m):
            fcode.append(m.group(3))
            return f"\n\nFEEDCODE{len(fcode) - 1}\n\n"
        fmd = re.sub(r"^```(\w+)[ \t]*([^\n]*)\n([\s\S]*?)^```[ \t]*$", _fcode, raw_md, flags=re.M)
        fmd = re.sub(r"\^\[([^\]]+)\]", lambda m: f" *({m.group(1)})*", fmd)
        fbody = md_to_html(fmd)
        fbody = re.sub(r' title="compare:[^"]*"', "", fbody)
        fbody = re.sub(r"<p>FEEDCODE(\d+)</p>", lambda m: f"<pre><code>{html.escape(fcode[int(m.group(1))], quote=False)}</code></pre>", fbody)
        fbody = re.sub(r'(src|href)="(?!https?:|mailto:|#)(?:\.\./)?', lambda m: f'{m.group(1)}="{site}/', fbody)
        flead = ""
        if p.get("cover"):
            flead = f'<p><img src="{site}/{html.escape(p["cover"])}" alt="{alt}"></p>'
            if note_html:
                flead += "<p><em>How this image was made: " + re.sub(r'href="(?:\.\./)?(?!https?:)', f'href="{site}/', note_html) + "</em></p>"
        fchanges = ""
        if p.get("changes"):
            fchanges = "<h3>What changed</h3><ul>" + "".join(f"<li>{html.escape(c)}</li>" for c in p["changes"]) + "</ul>"
        fnext = f"<p><strong>Next up:</strong> {html.escape(p['nextUp'])}</p>" if p.get("nextUp") else ""
        fplay = f'<p><a href="{html.escape(play)}">Play Midlife Survivors free in your browser</a>' + (f" ({html.escape(version)})" if version else "") + "</p>"
        full = (flead + fbody + fchanges + fnext + fplay).replace("]]>", "]]&gt;")

        items_rss.append(f"""
    <item>
      <title>{html.escape(title)}</title>
      <link>{site}/{slug}/</link>
      <guid>{site}/{slug}/</guid>
      <pubDate>{datetime.date.fromisoformat(date).strftime('%a, %d %b %Y')} 12:00:00 GMT</pubDate>
      <description><![CDATA[{full}]]></description>
      <content:encoded><![CDATA[{full}]]></content:encoded>
    </item>""")

    feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Midlife Survivors Devlog</title>
    <link>{site}/</link>
    <description>HR memos from building Midlife Survivors.</description>
    {''.join(items_rss)}
  </channel>
</rss>
"""
    (root / "feed.xml").write_text(feed)
    print("wrote", root / "feed.xml", f"({len(posts)} posts)")


if __name__ == "__main__":
    main()
