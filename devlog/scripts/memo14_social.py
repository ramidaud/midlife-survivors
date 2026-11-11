#!/usr/bin/env python3
"""Memo 14 social kit (Nov 11): 5-slide 4:5 carousel, a beat-cut 9:16 Reel, and a 3-frame Story.

The live scene here is the splat itself: a vertical cut of the Blender screen recording where the
view circles Abe and the sweep line turns him into dots. Music: the game's own "title" track.

Run from the repo root:  python3 devlog/scripts/memo14_social.py --src /path/to/sources
--src holds the large source files that stay out of the repo:
  vert_orbit_src.mp4             1080x1920 vertical cut of the Blender recording (orbit, then dots)
  1_contact_sheet_to_abdel.jpg   the 212 frames fading into Abe (1536x1024)
Writes devlog/img/social/14-carousel-1..5.jpg, 14-reel.mp4, 14-reel-cover.jpg,
14-story-1.jpg, 14-story-2.mp4, 14-story-3.jpg. Needs Pillow, numpy and ffmpeg.
"""
from __future__ import annotations
import math, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "devlog/scripts"))
import share_cards as sc  # noqa: E402
import memo13_social as m13  # noqa: E402  (reuses ease, back, kinetic, stamp, fill_crop, scrim)

NAVY, CREAM, WARM, COFFEE, TEAL = sc.NAVY, sc.CREAM, sc.WARM, sc.COFFEE, sc.TEAL
SAGE = (131, 168, 154)
silk, body = sc._fonts(ROOT)
OUT = ROOT / "devlog/img/social"
IMG = ROOT / "devlog/img"
SRC = Path(sys.argv[sys.argv.index("--src") + 1]) if "--src" in sys.argv else Path.home() / "m14"
RW, RH, FPS = 1080, 1920, 30
TRACK = ROOT / "assets/audio/music/title.mp3"
N_ORBIT, N_DOTS = 240, 94  # frames in vert_orbit_src.mp4: the orbit, then the dot change + hold
ease, back, kinetic, stamp, fill_crop, scrim = m13.ease, m13.back, m13.kinetic, m13.stamp, m13.fill_crop, m13.scrim


class Clip:
    """Reads vert_orbit_src.mp4 forward, one frame at a time (it's too big to hold in memory)."""
    def __init__(self, path: Path):
        self.p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(path), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                  stdout=subprocess.PIPE)
        self.i, self.cur = -1, None

    def get(self, n: int) -> Image.Image:
        while self.i < n:
            buf = self.p.stdout.read(RW * RH * 3)
            if len(buf) < RW * RH * 3:
                break
            self.cur = Image.frombytes("RGB", (RW, RH), buf); self.i += 1
        return self.cur.copy()


def achievement_card(d, x, y, w, k):
    """The game's achievement toast, drawn big: cream card, coffee edge, a small camera icon."""
    s = back(k / 0.45)
    h = 200
    off = int((1 - min(1, s)) * -260)
    d.rectangle([x + 8, y + off + 8, x + w + 8, y + off + h + 8], fill=(10, 13, 28, 200))
    d.rectangle([x, y + off, x + w, y + off + h], fill=CREAM)
    d.rectangle([x, y + off, x + 14, y + off + h], fill=COFFEE)
    cx, cy = x + 100, y + off + h // 2  # pixel camera icon
    d.rectangle([cx - 46, cy - 26, cx + 46, cy + 34], fill=NAVY)
    d.rectangle([cx - 18, cy - 40, cx + 18, cy - 26], fill=NAVY)
    d.ellipse([cx - 22, cy - 16, cx + 22, cy + 28], fill=TEAL)
    d.ellipse([cx - 10, cy - 4, cx + 10, cy + 16], fill=NAVY)
    d.rectangle([cx + 26, cy - 20, cx + 38, cy - 12], fill=CREAM)
    d.text((x + 180, y + off + 40), "ACHIEVEMENT", font=silk(44), fill=COFFEE)
    d.text((x + 180, y + off + 98), "UNLOCKED  +3K", font=silk(38), fill=NAVY)


# ---------------- Carousel ----------------
def carousel():
    sheet = Image.open(SRC / "1_contact_sheet_to_abdel.jpg").convert("RGB")
    ring = Image.open(IMG / "14-camera-ring.jpg").convert("RGB")
    dots = Image.open(IMG / "14-dot-build.jpg").convert("RGB")
    key = Image.open(IMG / "14-key-art.jpg").convert("RGB")
    front = Clip(SRC / "vert_orbit_src.mp4").get(105)  # Abe facing the camera mid-orbit
    slides = [
        ("MEMO 14 · 1/5", key, "Achievement Unlocked: Gaussian Splatting.",
         "212 photos of my son, a 3D scene I can fly a camera through, and a prompt so you can try it.", "READ IT + PLAY FREE"),
        ("MEMO 14 · 2/5", sheet, "212 photos, 54 seconds",
         "Abdel stood still (mostly) while I walked circles around him with my camera.", "MEMO 14"),
        ("MEMO 14 · 3/5", ring, "Where the camera was for every frame",
         "Two loops at two heights, solved from the photos. Abe sits in the middle.", "MEMO 14"),
        ("MEMO 14 · 4/5", dots, "It all felt like photography",
         "I chose the subject, I took the photos, I processed them, and I edited the reel. AI taught me the process.", "MEMO 14"),
        ("MEMO 14 · 5/5", front, "Just do it",
         "Grab your camera, put it on burst mode, walk three circles. The prompt is in the memo. You can even use an iPhone.", "READ IT: LINK IN BIO"),
    ]
    for i, (strip, art, title, cap, foot) in enumerate(slides, 1):
        sc.make_slide(ROOT, OUT / f"14-carousel-{i}.jpg", strip, art, title, cap, footer_left=foot)
    print("carousel: 5 slides")


# ---------------- Reel ----------------
def beat_grid():
    m13.TRACK = TRACK
    return m13.beat_grid()


def reel():
    spb, first = beat_grid()
    print(f"beat {spb:.3f}s ({60 / spb:.1f} bpm), first at {first:.2f}s")
    B = lambda n: first + n * spb
    A0, B0, C0, D0, E0, END = 0, 5, 10, 21, 27, 33
    dur = B(END) + 0.2
    sheet = Image.open(SRC / "1_contact_sheet_to_abdel.jpg").convert("RGB")
    clip = Clip(SRC / "vert_orbit_src.mp4")
    blurred = None
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{RW}x{RH}", "-r", str(FPS), "-i", "-",
           "-ss", "0", "-i", str(TRACK), "-t", f"{dur:.2f}", "-map", "0:v", "-map", "1:a",
           "-af", f"afade=t=in:d=0.3,afade=t=out:st={dur - 1.2:.2f}:d=1.2",
           "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
           "-movflags", "+faststart", str(OUT / "14-reel.mp4")]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    total = int(dur * FPS); cover = None
    for fi in range(total):
        t = fi / FPS
        beat = (t - first) / spb
        bp = beat - math.floor(beat)
        if beat < B0:  # A: the achievement toast over the 212 frames
            k = max(0, t) / B(B0)
            im = fill_crop(sheet, 0.18, 0.40 + 0.10 * k, 1.05 + 0.10 * ease(k))
            im = Image.blend(im, Image.new("RGB", (RW, RH), NAVY), 0.35)
            d = ImageDraw.Draw(im, "RGBA")
            achievement_card(d, 70, 360, 940, t)
            kinetic(d, "GAUSSIAN SPLATTING.".split(), t - spb * 1.5, 70, 700, 940, silk(104), 0.25, CREAM)
            if t > spb * 3:
                a = int(255 * ease((t - spb * 3) / 0.4))
                d.text((70, 980), "My first 3D scene, from photos.", font=body(50), fill=(*WARM, a))
        elif beat < C0:  # B: pan from the photos to Abe
            k = (t - B(B0)) / (B(C0) - B(B0))
            im = fill_crop(sheet, 0.15 + 0.50 * ease(k), 0.50, 1.05)
            scrim(im, 0.42)
            d = ImageDraw.Draw(im, "RGBA")
            stamp(d, "MEMO 14 · RE:", 70, 300)
            end = kinetic(d, "212 PHOTOS OF MY SON.".split(), t - B(B0), 70, 1240, 940, silk(84), 0.2, CREAM)
            if t - B(B0) > spb * 2:
                a = int(255 * ease((t - B(B0) - spb * 2) / 0.4))
                d.text((70, end + 14), "He held still. Mostly.", font=body(48), fill=(*WARM, a))
        elif beat < D0:  # C: the orbit in Blender
            k = (t - B(C0)) / (B(D0) - B(C0))
            im = clip.get(int(k * (N_ORBIT - 1)))
            top = Image.new("L", (1, RH))
            for y in range(RH):
                top.putpixel((0, y), int(230 * max(0, 1 - y / (RH * 0.36))))
            im.paste(Image.new("RGB", (RW, RH), NAVY), (0, 0), top.resize((RW, RH)))
            d = ImageDraw.Draw(im, "RGBA")
            kinetic(d, "A 3D SCENE I CAN FLY A CAMERA THROUGH.".split(), t - B(C0), 70, 300, 940, silk(70), 0.2, CREAM)
        elif beat < E0:  # D: the sweep turns him into dots
            k = (t - B(D0)) / (B(E0) - B(D0))
            im = clip.get(N_ORBIT + int(k * (N_DOTS - 1)))
            top = Image.new("L", (1, RH))
            for y in range(RH):
                top.putpixel((0, y), int(230 * max(0, 1 - y / (RH * 0.36))))
            im.paste(Image.new("RGB", (RW, RH), NAVY), (0, 0), top.resize((RW, RH)))
            d = ImageDraw.Draw(im, "RGBA")
            kinetic(d, "IT ALL FELT LIKE PHOTOGRAPHY.".split(), t - B(D0), 70, 300, 940, silk(76), 0.2, COFFEE)
        else:  # E: the ask, over the dots
            k = t - B(E0)
            if blurred is None:
                last = clip.get(N_ORBIT + N_DOTS - 1)
                blurred = Image.blend(last.filter(ImageFilter.GaussianBlur(10)), Image.new("RGB", (RW, RH), NAVY), 0.62)
            im = blurred.copy()
            d = ImageDraw.Draw(im, "RGBA")
            sz = back(k / 0.4)
            d.text((RW // 2, 620), "TRY IT", font=silk(int(130 * max(0.2, sz))), fill=COFFEE, anchor="mm")
            d.text((RW // 2, 770), "YOURSELF", font=silk(int(110 * max(0.2, sz))), fill=COFFEE, anchor="mm")
            if k > spb:
                a = int(255 * ease((k - spb) / 0.4))
                for j, ln in enumerate(["Burst mode. Three circles.", "The prompt is in Memo 14."]):
                    d.text((RW // 2, 930 + j * 70), ln, font=body(52), fill=(*WARM, a), anchor="mm")
            if k > spb * 2.5:
                a = int(255 * ease((k - spb * 2.5) / 0.4))
                d.text((RW // 2, 1240), "MEMO 14 · READ + PLAY FREE", font=silk(34), fill=(*CREAM, a), anchor="mm")
                d.text((RW // 2, 1310), "midlifesurvivors.com", font=body(52), fill=(*COFFEE, a), anchor="mm")
        d = ImageDraw.Draw(im, "RGBA")
        for cut in (B0, C0, D0, E0):
            dt = t - B(cut)
            if 0 <= dt < 0.12:
                d.rectangle([0, 0, RW, RH], fill=(*WARM, int(140 * (1 - dt / 0.12))))
        if 0 <= bp < 0.08 and beat >= 0:
            d.rectangle([0, 0, RW, 10], fill=COFFEE)
        if beat >= A0 + 4 and cover is None:
            cover = im.copy()
        ff.stdin.write(im.tobytes())
    ff.stdin.close(); ff.wait()
    (cover or im).save(OUT / "14-reel-cover.jpg", quality=90)
    print(f"reel: {dur:.1f}s, {total} frames")


# ---------------- Story (3 frames) ----------------
def story():
    key = Image.open(IMG / "14-key-art.jpg").convert("RGB")
    # 1. New memo
    im = Image.new("RGB", (RW, RH), NAVY); d = ImageDraw.Draw(im, "RGBA")
    stamp(d, "NEW MEMO", 70, 300, 34)
    a = key.resize((RW, round(RW * key.height / key.width)), Image.LANCZOS); im.paste(a, (0, 470))
    d.rectangle([0, 470 + a.height, RW, 476 + a.height], fill=COFFEE)
    y = 540 + a.height
    for ln in ["ACHIEVEMENT", "UNLOCKED:", "GAUSSIAN", "SPLATTING."]:
        d.text((70, y), ln, font=silk(84), fill=CREAM); y += 100
    d.text((70, y + 30), "Memo 14 of the Midlife Survivors devlog", font=body(44), fill=WARM)
    im.save(OUT / "14-story-1.jpg", quality=90)
    # 2. The orbit, 8 seconds, with a small stamp
    clip = Clip(SRC / "vert_orbit_src.mp4")
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{RW}x{RH}", "-r", str(FPS), "-i", "-",
           "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUT / "14-story-2.mp4")]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = 8 * FPS
    for fi in range(n):
        im = clip.get(int(fi / (n - 1) * (N_ORBIT + N_DOTS - 1)))
        d = ImageDraw.Draw(im, "RGBA")
        stamp(d, "212 PHOTOS OF ABE", 70, 300, 30)
        ff.stdin.write(im.tobytes())
    ff.stdin.close(); ff.wait()
    # 3. Try it yourself, with room in the middle for a link sticker
    last = Clip(SRC / "vert_orbit_src.mp4").get(N_ORBIT + N_DOTS - 1)
    im = Image.blend(last.filter(ImageFilter.GaussianBlur(10)), Image.new("RGB", (RW, RH), NAVY), 0.62)
    d = ImageDraw.Draw(im, "RGBA")
    d.text((RW // 2, 520), "TRY IT", font=silk(130), fill=COFFEE, anchor="mm")
    d.text((RW // 2, 670), "YOURSELF", font=silk(110), fill=COFFEE, anchor="mm")
    d.text((RW // 2, 800), "The prompt is in Memo 14.", font=body(52), fill=WARM, anchor="mm")
    d.rectangle([190, 980, 890, 1160], outline=(*CREAM, 120), width=4)
    d.text((RW // 2, 1070), "link sticker here", font=body(36), fill=(*CREAM, 140), anchor="mm")
    im.save(OUT / "14-story-3.jpg", quality=90)
    print("story: 3 frames")


if __name__ == "__main__":
    carousel()
    if "--no-reel" not in sys.argv:
        reel()
    story()
