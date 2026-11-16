# ChatGPT prompt: cover for Memo 15, "I wanted it to feel like home." (Nov 16, 2026)

Paste below the line into ChatGPT. Attach `devlog/img/13-key-art.jpg` (style and the 9-to-5er) and `devlog/img/15-street.jpg` (our house as it looks in the game: the orange two-story in the middle, garage on the right).

Before you paste, fill in the one blank in "abe" below (or delete his line to leave him out).

---

Make the cover image for Memo 15 of the Midlife Survivors devlog. The memo is about putting my real house into the game's neighborhood stage, Maple Hollow. Its title is "I wanted it to feel like home." Match the style of the attached Memo 13 key art exactly, and base the house on the attached game screenshot.

```json
{
  "file": "devlog/img/15-key-art.jpg",
  "size": "1600x900 (16:9), plus a 1200x1500 portrait crop as 15-key-art-portrait.jpg",
  "style": "crisp 16-bit pixel art like the Midlife Survivors key art, navy outlines, no anti-aliasing, cozy and a little funny",
  "color": "neutral white balance. No sepia, no golden haze, no film-look tint. Fall colors come from the leaves themselves, not from a warm filter",
  "lighting": "late afternoon in peak fall, clear sky, soft shadows to the lower right; warm lamp light in a few windows",
  "scene": "a suburban street in a small college town. Our house fills the center: a two-story house with orange siding, white trim, a dark shingle roof, a front door on the left with a wreath, and a white two-car garage door on the right. A fake rock by the front step with a brass key just peeking out from under it",
  "hero": {
    "who": "the 9-to-5er from the attached key art: the game's office-worker hero",
    "appearance": "same face, glasses, hair and outfit as in the attached key art; holding his coffee mug",
    "pose": "standing on the front step with his hand on the door, looking back over his shoulder at the street with a tired but relieved half smile"
  },
  "abe": {
    "who": "my son Abe, waving from his upstairs bedroom window at the front of the house",
    "appearance": "FILL IN: age, hair, skin tone, shirt",
    "notes": "small in frame, framed by the window, a guitar and a music poster just visible in the room behind him"
  },
  "swarm": "coming up the street from the lower right: a loose crowd of the game's enemies (white paper Bills with angry faces, ringing phones, purple 3 AM Thoughts), still a block away",
  "small_jokes": [
    "a kid's lemonade stand by the curb two houses down, with a handwritten CASH ONLY sign",
    "a rake leaning on the fence next to a leaf pile that is clearly about to be kicked over",
    "one leaf pile with eyes"
  ],
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "text_allowed": "only CASH ONLY on the lemonade sign, in chunky pixel lettering; no other words",
  "avoid": "real brand logos, real street signs, real people's faces other than the hero and Abe, any photo look",
  "composition": "keep the top 18% and bottom-left corner calm for the memo title overlay; the house centered, the hero at the door, the swarm entering lower right"
}
```

**Ship it:** save as `devlog/img/15-key-art.jpg` and the portrait crop (under 400 KB each). Claude swaps it in as the memo's cover.
