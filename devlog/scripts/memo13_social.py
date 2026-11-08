#!/usr/bin/env python3
"""Memo 13 social kit (Nov 7): a 5-slide 4:5 carousel and a beat-cut 9:16 Reel.

The Reel is more dynamic than Memo 12's (which cut between still slides): the key art pans and
pushes in, the headline lands word by word, song cards drop in on the beat, the live 11:58 PM
title scene plays, and it ends on the ask. Music: the game's own "office-3-chaos" track.

Run from the repo root:  python3 devlog/scripts/memo13_social.py
Writes devlog/img/social/13-carousel-1..5.jpg, 13-reel.mp4 and 13-reel-cover.jpg.
Needs Pillow, numpy and ffmpeg.
"""
from __future__ import annotations
import json, math, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "devlog/scripts"))
import share_cards as sc  # noqa: E402

NAVY, CREAM, WARM, COFFEE, TEAL = sc.NAVY, sc.CREAM, sc.WARM, sc.COFFEE, sc.TEAL
SAGE, SLATE = (131, 168, 154), (48, 55, 80)
silk, body = sc._fonts(ROOT)
OUT = ROOT / "devlog/img/social"
ART = Image.open(ROOT / "devlog/img/13-key-art.jpg").convert("RGB")  # 1536x1024
SONGS = [
    ("My Madness", "David Byrne & Ghost Train Orchestra"),
    ("Paradise", "Harachan"),
    ("Appreciatecha", "Nick Shoulders"),
    ("The Ones", "Tune-Yards"),
    ("Freaking Out", "Michigander"),
    ("The Future Is a Foreign Land", "Ghost"),
    ("Drowning in Your Heart", "Michael Kiwanuka"),
    ("Once Around the Block", "Badly Drawn Boy"),
]


def late_night_frame(n: int) -> Image.Image:
    """One frame of the live 11:58 PM title scene, composited from its plate and sprite strips."""
    base = ROOT / "assets/title-screen/live/late-night/play"
    S = json.loads((base / "scene.json").read_text())
    im = Image.open(base / S["plate"]).convert("RGBA")
    for L in S["layers"]:
        st = L["seq"][n % S["frames"]]
        if not st:
            continue
        sheet = Image.open(base / L["sheet"]).convert("RGBA")
        fr = sheet.crop((st[0] * L["fw"], 0, (st[0] + 1) * L["fw"], L["fh"]))
        im.alpha_composite(fr, (L["x"] + st[1], L["y"] + st[2]))
    return im.convert("RGB")


def playlist_panel(w: int, h: int, upto: int = len(SONGS), hot: int = -1, pop: float = 1.0) -> Image.Image:
    """The playlist as a stack of pixel cards. `upto` cards shown; card `hot` is highlighted and pops in."""
    im = Image.new("RGB", (w, h), (30, 36, 64))
    d = ImageDraw.Draw(im, "RGBA")
    rows = len(SONGS)
    gap = 10
    ch = (h - 40 - gap * (rows - 1)) // rows
    for i, (t, a) in enumerate(SONGS[:upto]):
        y = 20 + i * (ch + gap)
        x = 40
        off = 0
        if i == hot:
            off = int((1 - pop) * 140)
        hl = i == hot
        d.rectangle([x + off, y, w - 40 + off, y + ch], fill=(COFFEE if hl else (23, 28, 53)), outline=(TEAL if not hl else CREAM), width=3)
        d.text((x + 22 + off, y + ch // 2), f"{i + 1:02d}", font=silk(max(18, ch // 3)), fill=(NAVY if hl else SAGE), anchor="lm")
        tf = body(max(20, int(ch * 0.42)))
        d.text((x + 90 + off, y + ch * 0.36), t, font=tf, fill=(NAVY if hl else WARM), anchor="lm")
        d.text((x + 90 + off, y + ch * 0.74), a, font=body(max(14, int(ch * 0.26))), fill=((40, 30, 30) if hl else (184, 192, 212)), anchor="lm")
    return im


# ---------------- Carousel (1080x1350, same style as Memo 12) ----------------
def carousel():
    art_abe = ART.crop((820, 180, 1536, 1000))
    art_dash = ART.crop((470, 330, 1110, 760))
    slides = [
        ("MEMO 13 · 1/5", ART, "Music is one of the most important side characters.",
         "The school run with Abe, the songs that are the game, and an ask for help with its music.", False, "READ IT + PLAY FREE"),
        ("MEMO 13 · 2/5", art_abe, "Every morning, and again on the way home",
         "Abe taught himself to read music. Guitar, keyboard, and now clarinet in the school band.", False, "MEMO 13"),
        ("MEMO 13 · 3/5", playlist_panel(1000, 600), "Some of these songs are the game",
         "The Midlife Survivors playlist, on Apple Music and Spotify.", True, "PLAYLIST: LINK IN BIO"),
        ("MEMO 13 · 4/5", late_night_frame(0), "Meanwhile, in the game",
         "Close Calls leave afterimages, a quieter first minute, and the 11:58 PM title screen is alive.", False, "PLAY FREE: LINK IN BIO"),
        ("MEMO 13 · 5/5", art_dash, "I know what I like. Not sure how to get there.",
         "Know music? I'd love help finding the game's sound. Come say hi on Discord.", False, "READ IT: LINK IN BIO"),
    ]
    for i, (strip, art, title, cap, contain, foot) in enumerate(slides, 1):
        sc.make_slide(ROOT, OUT / f"13-carousel-{i}.jpg", strip, art, title, cap, footer_left=foot, contain=contain)
    print("carousel: 5 slides")


# ---------------- Reel (1080x1920, 30 fps, cut to the beat) ----------------
RW, RH, FPS = 1080, 1920, 30
TRACK = ROOT / "assets/audio/music/office-3-chaos.mp3"


def beat_grid():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(TRACK), "-t", "40", "-ac", "1", "-ar", "11025", "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(float)
    hop = 256; n = len(x) // hop; fr = 11025 / hop
    e = np.array([np.sum(x[i * hop:(i + 1) * hop] ** 2) for i in range(n)])
    on = np.maximum(0, np.diff(np.log(e + 1)))
    ac = np.correlate(on - on.mean(), on - on.mean(), "full")[len(on) - 1:]
    lo, hi = int(fr * 60 / 180), int(fr * 60 / 70)
    lag = lo + int(np.argmax(ac[lo:hi]))
    best = max(range(lag), key=lambda p: on[p::lag].sum())
    return lag / fr, best / fr  # seconds per beat, first beat


def ease(t):
    t = min(1, max(0, t)); return 1 - (1 - t) ** 3


def back(t):
    t = min(1, max(0, t)); c = 1.7; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2


def fill_crop(img, cx, cy, zoom):
    """9:16 window over img centered at (cx, cy) in 0..1, zoom >= 1."""
    W, H = img.size
    h = H / zoom; w = h * RW / RH
    if w > W: w = W; h = w * RH / RW
    l = min(max(cx * W - w / 2, 0), W - w); t = min(max(cy * H - h / 2, 0), H - h)
    return img.resize((RW, RH), Image.LANCZOS, box=(l, t, l + w, t + h))


def note(d, x, y, s, col):
    s = max(2, int(s))
    d.rectangle([x, y + 3 * s, x + 2 * s, y + 5 * s], fill=col)        # head
    d.rectangle([x + 2 * s - s // 1, y - 3 * s, x + 2 * s, y + 4 * s], fill=col)  # stem
    d.rectangle([x + 2 * s, y - 3 * s, x + 4 * s, y - 2 * s], fill=col)  # flag


def scrim(im, top=0.45):
    g = Image.new("L", (1, RH))
    for y in range(RH):
        g.putpixel((0, y), int(255 * min(1, max(0, (y / RH - top) / (1 - top))) ** 0.55 * 0.95))
    im.paste(Image.new("RGB", (RW, RH), NAVY), (0, 0), g.resize((RW, RH)))


def kinetic(d, words, t, x, y, maxw, font, per, col=WARM):
    """Words land one at a time (every `per` seconds) with a small drop."""
    cx, cy, lh = x, y, font.size + 14
    for i, w in enumerate(words):
        wl = d.textlength(w + " ", font=font)
        if cx + wl - x > maxw:
            cx = x; cy += lh
        k = (t - i * per) / 0.18
        if k > 0:
            dy = int((1 - ease(k)) * -40)
            a = int(255 * ease(k))
            d.text((cx + 4, cy + dy + 4), w, font=font, fill=(*NAVY, a))
            d.text((cx, cy + dy), w, font=font, fill=(*col, a))
        cx += wl
    return cy + lh


def stamp(d, text, x, y, size=30):
    f = silk(size); w = d.textlength(text, font=f)
    d.rectangle([x, y, x + w + 36, y + size + 24], fill=CREAM)
    d.rectangle([x, y, x + 8, y + size + 24], fill=COFFEE)
    d.text((x + 22, y + 12), text, font=f, fill=NAVY)


def reel():
    spb, first = beat_grid()
    print(f"beat {spb:.3f}s ({60 / spb:.1f} bpm), first at {first:.2f}s")
    B = lambda n: first + n * spb
    # Sections, in beats from the first beat.
    A0, B0, C0, D0, E0, END = 0, 4, 8, 17, 22, 27
    dur = B(END) + 0.2
    blurred = fill_crop(ART, 0.5, 0.5, 1.0).filter(ImageFilter.GaussianBlur(18))
    blurred = Image.blend(blurred, Image.new("RGB", (RW, RH), NAVY), 0.55)
    scene = [late_night_frame(i) for i in range(64)]
    rng = np.random.default_rng(13)
    notes = [(rng.uniform(80, 1000), rng.uniform(0, 1), rng.uniform(4, 8), rng.uniform(0.6, 1.2)) for _ in range(14)]
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{RW}x{RH}", "-r", str(FPS), "-i", "-",
           "-ss", "0", "-i", str(TRACK), "-t", f"{dur:.2f}", "-map", "0:v", "-map", "1:a",
           "-af", f"afade=t=in:d=0.3,afade=t=out:st={dur - 1.2:.2f}:d=1.2",
           "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
           "-movflags", "+faststart", str(OUT / "13-reel.mp4")]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    total = int(dur * FPS); cover = None
    for fi in range(total):
        t = fi / FPS
        beat = (t - first) / spb
        bp = beat - math.floor(beat)  # 0 right on a beat
        if beat < B0:  # A: push in on the car, headline lands word by word
            k = max(0, t) / B(B0)
            im = fill_crop(ART, 0.30 + 0.08 * k, 0.48, 1.0 + 0.18 * ease(k))
            scrim(im, 0.36)
            d = ImageDraw.Draw(im, "RGBA")
            for (x, ph, s, sp) in notes:
                y = RH * 0.62 - ((t * sp * 0.25 + ph) % 1) * RH * 0.5
                note(d, int(x), int(y), s, (*CREAM, 200))
            stamp(d, "MEMO 13 · RE:", 70, 300)
            kinetic(d, "MUSIC IS ONE OF THE MOST IMPORTANT SIDE CHARACTERS.".split(), t - 0.15, 70, 1230, 900, silk(76), 0.2, CREAM)
        elif beat < C0:  # B: pan across to Abe
            k = (t - B(B0)) / (B(C0) - B(B0))
            im = fill_crop(ART, 0.40 + 0.40 * ease(k), 0.45, 1.25 + 0.05 * math.sin(k * 3))
            scrim(im, 0.5)
            d = ImageDraw.Draw(im, "RGBA")
            end = kinetic(d, "EVERY MORNING, AND AGAIN ON THE WAY HOME.".split(), t - B(B0), 70, 1230, 900, silk(70), 0.18, CREAM)
            if t - B(B0) > spb * 1.5:
                a = int(255 * ease((t - B(B0) - spb * 1.5) / 0.4))
                d.text((70, end + 10), "Abe taught himself to read music.", font=body(44), fill=(*WARM, a))
        elif beat < D0:  # C: the playlist, one card per beat
            n = int(beat - C0)  # cards shown so far (0-based index of newest)
            im = blurred.copy()
            d = ImageDraw.Draw(im, "RGBA")
            stamp(d, "THE PLAYLIST", 70, 290, 28)
            d.text((70, 380), "SOME OF THESE SONGS", font=silk(58), fill=CREAM)
            d.text((70, 450), "ARE THE GAME", font=silk(58), fill=COFFEE)
            pop = back(bp / 0.35) if n < len(SONGS) else 1
            panel = playlist_panel(960, 960, upto=min(n + 1, len(SONGS)), hot=min(n, len(SONGS) - 1), pop=pop)
            im.paste(panel, (60, 560))
            d.text((70, 1560), "On Apple Music + Spotify", font=body(40), fill=WARM)
        elif beat < E0:  # D: the live title scene, framed on the worker
            k = (t - B(D0)) / (B(E0) - B(D0))
            fr = scene[int((t - B(D0)) * 8) % 64]
            im = fill_crop(fr, 0.27, 0.55, 1.0 + 0.10 * k)
            scrim(im, 0.5)
            d = ImageDraw.Draw(im, "RGBA")
            stamp(d, "MEANWHILE, IN THE GAME", 70, 300, 28)
            end = kinetic(d, "THE 11:58 PM TITLE SCREEN IS ALIVE.".split(), t - B(D0), 70, 1230, 900, silk(68), 0.18, CREAM)
            if t - B(D0) > spb * 2:
                a = int(255 * ease((t - B(D0) - spb * 2) / 0.4))
                d.text((70, end + 16), "Plus Close Call afterimages and a calmer first minute.", font=body(38), fill=(*WARM, a))
        else:  # E: the ask
            k = t - B(E0)
            im = Image.new("RGB", (RW, RH), NAVY)
            d = ImageDraw.Draw(im, "RGBA")
            for (x, ph, s, sp) in notes:
                y = RH - ((t * sp * 0.2 + ph) % 1) * RH
                note(d, int(x), int(y), s * 1.3, (*TEAL, 150))
            sz = back(k / 0.4)
            f = silk(int(118 * max(0.2, sz)))
            d.text((RW // 2, 640), "KNOW MUSIC?", font=f, fill=COFFEE, anchor="mm")
            if k > spb:
                a = int(255 * ease((k - spb) / 0.4))
                d.text((RW // 2, 780), "Help me find the game's sound.", font=body(50), fill=(*WARM, a), anchor="mm")
            if k > spb * 2:
                a = int(255 * ease((k - spb * 2) / 0.4))
                small = ART.resize((760, 507), Image.LANCZOS)
                im.paste(small, (160, 900))
                d = ImageDraw.Draw(im, "RGBA")
                d.rectangle([160, 900, 920, 1407], outline=TEAL, width=4)
                if a < 255:
                    d.rectangle([160, 900, 920, 1407], fill=(*NAVY, 255 - a))
            if k > spb * 3:
                a = int(255 * ease((k - spb * 3) / 0.4))
                d.text((RW // 2, 1480), "MEMO 13 · READ + PLAY FREE", font=silk(34), fill=(*CREAM, a), anchor="mm")
                d.text((RW // 2, 1545), "midlifesurvivors.com", font=body(46), fill=(*COFFEE, a), anchor="mm")
        # A quick flash on each section cut, and a tiny bump on every beat.
        d = ImageDraw.Draw(im, "RGBA")
        for cut in (B0, C0, D0, E0):
            dt = t - B(cut)
            if 0 <= dt < 0.12:
                d.rectangle([0, 0, RW, RH], fill=(*WARM, int(150 * (1 - dt / 0.12))))
        if 0 <= bp < 0.08 and beat >= 0:
            d.rectangle([0, 0, RW, 10], fill=COFFEE)
        if beat >= A0 + 3.5 and cover is None:
            cover = im.copy()
        ff.stdin.write(im.tobytes())
    ff.stdin.close(); ff.wait()
    (cover or im).save(OUT / "13-reel-cover.jpg", quality=90)
    print(f"reel: {dur:.1f}s, {total} frames")


if __name__ == "__main__":
    carousel()
    if "--no-reel" not in sys.argv:
        reel()
