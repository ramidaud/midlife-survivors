"""One grass color for Maple Hollow (V2.29.11, Nov 12).

Rami picked #9BAE73 as the one grass color (Nov 11). The v2 street band, the house frames' side strips,
your side path and Codex's street-end caps were painted with the old grass base #83A89A. This remaps
that material on purpose (Pixel rules: colors by material), only where it is grass:

  old grass base  #83A89A -> #9BAE73 (new base)
  grass tufts     #3E7775 -> #6D895B (the lawns' shade tone), only when touching grass

The house siding also uses #83A89A, so in house frames only the strips outside the facade change.
Usage: python3 tools/maple_one_green.py <dir with Codex batch-b street ends>
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "assets/stage/home"
OLD, NEW, TUFT, SHADE = (0x83, 0xA8, 0x9A), (0x9B, 0xAE, 0x73), (0x3E, 0x77, 0x75), (0x6D, 0x89, 0x5B)


def remap(im, keep=lambda x, y: False):
    im = im.convert("RGBA")
    src, out = im.load(), im.copy()
    px = out.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            if keep(x, y):
                continue
            p = src[x, y]
            if p[3] == 0:
                continue
            if p[:3] == OLD:
                px[x, y] = NEW + (p[3],)
            elif p[:3] == TUFT and any(
                0 <= x + dx < w and 0 <= y + dy < h and src[x + dx, y + dy][:3] == OLD and not keep(x + dx, y + dy)
                for dx in (-1, 0, 1) for dy in (-1, 0, 1)):
                px[x, y] = SHADE + (p[3],)
    return out


def main(batch_b):
    batch_b = Path(batch_b)
    for k in "ab":
        remap(Image.open(ROOT / f"v2/street-wide-v2-{k}.png")).save(ROOT / f"v4/street/street-wide-v4-{k}.png")
    for side in ("left", "right"):
        remap(Image.open(batch_b / f"street-end-{side}-v4.png")).save(ROOT / f"v4/street/street-end-{side}-v4.png")
        Image.open(batch_b / f"street-end-{side}-barricade-v4.png").save(ROOT / f"v4/street/street-end-{side}-barricade-v4.png")
    for k in "ab":
        Image.open(batch_b / f"lawn-{k}-v4.png").save(ROOT / f"v4/ground/lawn-{k}-v4.png")
    # house frames: 416 px cells, facade at x 8..344, y 16..368 keeps its paint (siding uses the old grass color)
    facade = lambda x, y: 8 <= x % 416 < 344 and 16 <= y < 368
    remap(Image.open(ROOT / "v2/houses-v2.png"), facade).save(ROOT / "v4/ground/houses-v4.png")
    remap(Image.open(ROOT / "v2/your-house-v2.png"), lambda x, y: x < 336).save(ROOT / "v4/ground/your-house-v4.png")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "/tmp")
