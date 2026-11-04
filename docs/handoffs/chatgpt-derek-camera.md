# ChatGPT brief: give Derek a real camera on his portrait sheet (Nov 4, 2026)

Paste everything below the line into ChatGPT.

---

Quick fix job. Derek's On Break portrait (`assets/characters/portraits/intern-derek-on-break-v1.png`) is now on two Spotlight cards (the Lounge and the new Intern Delivery card, where he and TJ shout "For my MANAGER!"). The problem: **his camera reads as a plain cream rectangle**, like a box or a coffee cup. Derek is a photographer, so the camera has to be unmistakable.

His walking sheet (`assets/characters/intern-derek-v2.png`) already gets it right: a dark charcoal body with a lens. Match that.

## The job
Redraw **only the camera** on every frame of the portrait sheet. Keep everything else pixel-identical: pose, face, glasses, beard, hair, jacket, orange strap, pants, shoes, frame timing and the shoe line.

## The camera
```json
{
  "subject": "a compact mirrorless camera, the kind a student photojournalist carries",
  "body": "charcoal #303750 with a darker navy #171C35 outline, about 14 x 9 pixels at 1x in the 96x112 cell",
  "lens": "a round lens on the front: dark ring, slate inner ring, one warm white #FFF0CF pixel highlight at the upper left, so it reads as glass",
  "details": "a small raised viewfinder hump on top, one tiny cream shutter button, and the strap attaching at both top corners to his existing orange strap",
  "resting_frames": "camera hangs at his chest, turned slightly so the lens and the round shape show",
  "shooting_frames": "row 1, columns 2 to 4 (where he raises it): camera held up to his face with both hands, lens pointing at the viewer, and the flash sparkle kept where it is now",
  "palette_only": ["#171C35", "#303750", "#526078", "#F2D7A1", "#FFF0CF", "#EF9347"],
  "style": "crisp 16-bit pixel art, hard pixel clusters, no anti-aliasing, warm light from the upper left, matching the rest of the sheet",
  "avoid": "cream or beige camera bodies, square boxes with no lens, any text or logos"
}
```

## Files
- **Read:** `assets/characters/portraits/intern-derek-on-break-v1.png` (the sheet to fix) and `assets/characters/intern-derek-v2.png` (camera reference).
- **Write:** `assets/characters/portraits/intern-derek-on-break-v2.png`, same 768×336 size, 8 columns × 3 rows of 96×112 cells, transparent, hard alpha, shoe line at local y111.
- **Also:** fresh preview GIFs for the three rows, and one check image showing v1 and v2 side by side at 4× on navy.

## When done
Pull first (`git stash && git pull`). Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`. Claude will point the Spotlight cards at v2.
