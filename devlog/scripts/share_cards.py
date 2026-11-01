#!/usr/bin/env python3
"""Share cards: the preview image people see when a Midlife Survivors link is pasted
into iMessage, Slack, Facebook, LinkedIn, Discord or X.

Every card is 1200x630 (the size those apps expect), a full-bleed crop of the page's art
with a navy band, a kicker line and the title in Silkscreen.

Run on its own:   python3 devlog/scripts/share_cards.py --root .
build_devlog.py also calls make_post_card() for each post, so new posts get a card automatically.
Needs Pillow (pip install pillow). Without it, pages fall back to the plain cover image.
"""
from __future__ import annotations
import argparse
from pathlib import Path

W, H = 1200, 630
NAVY, CREAM, WARM, COFFEE, TEAL = (23, 28, 53), (242, 215, 161), (255, 240, 207), (239, 147, 71), (62, 119, 117)

# Fixed (non-post) pages: output name, source art, kicker, title, subtitle.
PAGES = [
    ("game", "assets/title-screen/title-bg-lobby.jpg", "FREE TO PLAY IN YOUR BROWSER", "MIDLIFE SURVIVORS", "Survive from 40 to 65. Your coffee fires on its own."),
    ("devlog", "devlog/img/office-key-art-hero.jpg", "DEVLOG · INTERNAL MEMOS", "MAKING MIDLIFE SURVIVORS", "A photographer builds his first video game with AI."),
    ("art-room", "assets/title-screen/02-midlife-panorama-v1.png", "DEVLOG · THE ART ROOM", "WALK THE NEW OFFICE", "The newest art, before it reaches the game."),
    ("about", "assets/bio/rami-studio-pixel-v1.png", "DEVLOG · ABOUT", "RAMI DAUD", "Photographer. First-time game developer."),
    ("enemies", "@sprites", "ART REVIEW · BATCH 1", "MEET THE SWARM", "Bills, Spam Likely, the 3 AM Thought and friends."),
    ("roadmap", "devlog/img/office-key-art-hero.jpg", "PROJECT TRACKER", "THE ROADMAP", "What's done, what's next, and what's parked."),
]


def _fonts(root: Path):
    from PIL import ImageFont
    f = root / "assets/branding/fonts"
    silk = lambda s: ImageFont.truetype(str(f / "Silkscreen-Regular.ttf"), s)
    body = lambda s: ImageFont.truetype(str(f / "atkinson-hyperlegible-latin-700-normal.woff"), s)
    return silk, body


def _fit_lines(draw, text, font_fn, sizes, max_w, max_lines):
    """Pick the largest size where the text wraps into max_lines within max_w."""
    for s in sizes:
        font = font_fn(s)
        words, lines, cur = text.split(), [], ""
        for w in words:
            trial = (cur + " " + w).strip()
            if draw.textlength(trial, font=font) <= max_w:
                cur = trial
            else:
                lines.append(cur); cur = w
        lines.append(cur)
        if len(lines) <= max_lines:
            return font, lines
    return font, lines[:max_lines]


def _sprite_lineup(root: Path):
    """Five enemies from the Batch 1 sheets, first frame, enlarged 4x on navy."""
    from PIL import Image
    ids = ["bill", "spam-likely", "3am-thought", "late-night-donut", "calendar-invite"]
    im = Image.new("RGB", (W, H), NAVY)
    x = 40
    for i in ids:
        f = root / f"assets/enemies/enemy-{i}-v1.png"
        if not f.exists():
            return None
        sheet = Image.open(f).convert("RGBA")
        fr = sheet.crop((0, 0, sheet.height, sheet.height))
        px = fr.load()
        for yy in range(fr.height):
            for xx in range(fr.width):
                if px[xx, yy][:3] == (255, 0, 255):
                    px[xx, yy] = (0, 0, 0, 0)
        fr = fr.resize((fr.width * 4, fr.height * 4), Image.NEAREST)
        im.paste(fr, (x, 125), fr)
        x += 232
    return im


def make_card(root: Path, src: str, out: Path, kicker: str, title: str, subtitle: str = "") -> bool:
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return False
    if src == "@sprites":
        im = _sprite_lineup(root)
        if im is None:
            return False
    else:
        srcp = root / src
        if not srcp.exists():
            return False
        im = Image.open(srcp).convert("RGB")
    # Cover-crop to 1200x630. Pixel art gets nearest-neighbor so it stays crisp when enlarged.
    scale = max(W / im.width, H / im.height)
    pixel = im.width <= 800
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.NEAREST if pixel else Image.LANCZOS)
    left, top = (im.width - W) // 2, max(0, (im.height - H) // 3)
    im = im.crop((left, top, left + W, top + H))

    silk, body = _fonts(root)
    d = ImageDraw.Draw(im, "RGBA")
    title_font, lines = _fit_lines(d, title.upper(), silk, [64, 56, 48, 42, 36], W - 120, 2)
    band_h = 70 + len(lines) * (title_font.size + 8) + (44 if subtitle else 0)
    # Soft fade into a solid navy band at the bottom.
    for i in range(60):
        d.rectangle([0, H - band_h - 60 + i, W, H - band_h - 59 + i], fill=NAVY + (int(230 * i / 60),))
    d.rectangle([0, H - band_h, W, H], fill=NAVY + (235,))
    d.rectangle([0, H - 8, W, H], fill=COFFEE)  # thin coffee stripe, same as the memo strips

    y = H - band_h + 18
    d.text((60, y), kicker.upper(), font=silk(22), fill=COFFEE)
    y += 38
    for ln in lines:
        d.text((60, y), ln, font=title_font, fill=CREAM)
        y += title_font.size + 8
    if subtitle:
        _, sub = _fit_lines(d, subtitle, body, [28], W - 120, 1)
        d.text((60, y + 2), sub[0], font=body(28), fill=WARM)

    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, "JPEG", quality=86, optimize=True, progressive=True)
    return True


def make_post_card(root: Path, post: dict) -> str | None:
    """Card for one devlog post. Returns the path relative to devlog/, or None."""
    cover = post.get("cover") or "img/office-key-art-hero.jpg"
    rel = f"img/share/{post['slug']}.jpg"
    num = post["slug"].split("-")[0]
    kicker = f"DEVLOG · MEMO {num}" if num.isdigit() else "DEVLOG"
    ok = make_card(root, f"devlog/{cover}", root / "devlog" / rel, kicker, post["title"], post.get("version", ""))
    return rel if ok else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    a = ap.parse_args()
    root = Path(a.root).resolve()
    for name, src, kicker, title, sub in PAGES:
        out = root / "assets/share" / f"{name}.jpg"
        print(("made " if make_card(root, src, out, kicker, title, sub) else "SKIPPED ") + str(out.relative_to(root)))


if __name__ == "__main__":
    main()
