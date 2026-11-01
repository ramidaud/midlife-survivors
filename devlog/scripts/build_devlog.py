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
<meta property="og:site_name" content="Midlife Survivors Devlog">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{og_image}">
<meta property="og:url" content="{og_url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og_image}">
<link rel="alternate" type="application/rss+xml" title="Midlife Survivors Devlog" href="../feed.xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap">
<link rel="stylesheet" href="../styles.css">
</head>
<body>
  <header class="site-header is-compact">
    <a class="brand" href="../">
      <span class="brand-mark" aria-hidden="true">MS</span>
      <span><span class="brand-title">Midlife Survivors</span></span>
    </a>
    <div class="actions">
      <a class="btn btn-primary" href="{play}">▶ Play this build</a>
    </div>
  </header>
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
      <div><a class="btn btn-primary" href="{play}">▶ Play this build</a></div>
      {changes}
      {next_up}
    </div>
    <article class="post"><div class="prose">{body}</div>
      <div class="signoff"><div class="silk">Filed by Rami.</div>Survived to {version}. Screenshots are from the real game at the time.</div>
    </article>
  </div>
  <footer class="site-footer">© 2026 <a href="../about/">Rami Daud</a>. Written by <a href="../about/">Rami Daud</a>. Built with <a href="https://claude.ai" rel="noopener">Claude</a>, <a href="https://gemini.google.com" rel="noopener">Gemini</a>, <a href="https://chatgpt.com" rel="noopener">ChatGPT</a> and <a href="https://grok.com" rel="noopener">Grok</a>. Screenshots and clips are from the actual builds at the time.</footer>
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
        body = md_to_html(body_md)
        body = body.replace('src="img/', 'src="../img/')

        title = p["title"]
        desc = p.get("teaser") or title
        cover = p.get("cover") or "img/office-key-art-hero.jpg"
        og_image = f"{site}/{cover}" if not cover.startswith("http") else cover
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
        cap = f"<figcaption>{alt}</figcaption>" if p.get("leadAlt") else ""
        if p.get("leadVideo"):
            lead = f'<figure class="post-lead"><video src="../{html.escape(p["leadVideo"])}" poster="../{html.escape(p.get("cover", ""))}" autoplay muted loop playsinline controls aria-label="{alt}"></video>{cap}</figure>'
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

        items_rss.append(f"""
    <item>
      <title>{html.escape(title)}</title>
      <link>{site}/{slug}/</link>
      <guid>{site}/{slug}/</guid>
      <pubDate>{datetime.date.fromisoformat(date).strftime('%a, %d %b %Y')} 12:00:00 GMT</pubDate>
      <description>{html.escape(desc)}</description>
    </item>""")

    feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
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
