# ChatGPT prompt: key art for Memo 12, "Somewhere to put it." (Nov 6, 2026)

Paste below the line into ChatGPT. Attach Rami's desk photo (IMG_4960), `assets/bio/rami-studio-pixel-v2.png` (likeness), and `devlog/img/11-discord-key-art.jpg` (style).

---

Make the cover image for Memo 12 of the Midlife Survivors devlog. The memo is about building the game late at night at home, with help from friends, a coworker and a stranger. Its title is "Somewhere to put it." Base the scene on the attached photo of my desk, and match the style of the attached Memo 11 key art exactly.

```json
{
  "file": "devlog/img/12-key-art.jpg",
  "size": "1600x900 (16:9), plus a 1200x1500 portrait crop as 12-key-art-portrait.jpg",
  "style": "crisp 16-bit pixel art like the Midlife Survivors key art, navy outlines, no anti-aliasing, cozy and a little funny",
  "lighting": "a dark room late at night; the only light is the cool glow of the screens and one warm amber desk lamp on the right, like the photo",
  "scene": "My home desk from the photo: a wide curved monitor on the left, a second monitor on the right, a laptop in the middle, an iPad on a stand at the lower left, a full-size keyboard, a red game controller, a steel travel tumbler, a mic on a boom arm, headphones hanging on a stand, cables. Kids' crayon drawings taped to the wall above the monitors (a red race car, a colorful jellyfish).",
  "screens": {
    "left_monitor": "MORE CODE than the photo: tall columns of colorful JavaScript in a dark editor (keywords in teal, strings in coffee orange, comments in sage). Legible fake lines like 'function weave(thought) {', 'if (!nameOk(name)) return;', 'paycheck += 3;', '// 3 AM Thoughts drift side to side'",
    "right_monitor": "the game mid-run: the office floor, a crowd of white Bills marching in straight lines and purple 3 AM Thoughts drawing wavy paths toward the little hero",
    "laptop": "a chat window with a few friendly message bubbles and a tiny flame reaction (no app logo)",
    "ipad": "the cream MIDLIFE SURVIVORS memo-style devlog page"
  },
  "rami": {
    "appearance": "olive-skinned Palestinian male, early forties, clean-shaven bald head, full dark beard with a little gray at the chin, round thin wire-frame glasses",
    "clothing": "dark hoodie, comfortable and late-night",
    "pose": "seated in a desk chair, seen three-quarter from behind on the left, one hand on the mouse, leaning toward the code with a tired but happy half smile; the screen glow lights his face and glasses",
    "likeness_notes": "match the attached studio portrait: head shape, beard, glasses and skin tone. No hair on top"
  },
  "small_jokes": [
    "a sticky note on the monitor bezel: 'HR flagged that name'",
    "a second sticky note: 'holistic AND chaotic'",
    "a tiny purple 3 AM Thought peeking over the top of the right monitor",
    "a stack of empty coffee cups next to the tumbler",
    "a wall clock reading 12:21"
  ],
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "text_allowed": "only the fake code lines, the two sticky notes and MIDLIFE SURVIVORS on the iPad, in chunky pixel lettering; no other words",
  "avoid": "real brand logos (no Apple logo on the laptop, no car brand on the drawing, no Discord or GitHub marks), real people other than me, real app UI",
  "composition": "keep the top 18% and bottom-left corner calm for the memo title overlay; Rami left third, the two monitors filling the center and right"
}
```

**Ship it:** pull first, commit the two JPGs (under 400 KB each) and a 2x preview, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`.
