# ChatGPT prompt: cover for Memo 17, "Lost in the chaos." Version 2 (Nov 16, 2026)

Start a NEW image (not an edit). Attach `devlog/img/15-key-art.jpg` (style, and me) and `devlog/img/16-key-art.jpg` (my latest face: neat beard, round face, warm expression).

---

Make the cover image for Memo 17 of the Midlife Survivors devlog. The memo is about getting lost in my own game's neighborhood: missing boss fights because I didn't know where to go. Its title is "Lost in the chaos." Match the style of the attached Memo 15 cover exactly, and draw me like the attached Memo 16 cover.

```json
{
  "file": "devlog/img/17-key-art.jpg",
  "size": "1600x900 (16:9), plus a 1200x1500 portrait crop as 17-key-art-portrait.jpg",
  "style": "crisp 16-bit pixel art like the Memo 15 cover, navy outlines, no anti-aliasing, cozy and funny",
  "color": "neutral white balance. No sepia, no golden haze, no film-look tint. Fall colors come from the leaves",
  "camera": "street level, a slightly high three-quarter view, like the Memo 15 cover; me large in frame (about 40% of the image height)",
  "scene": "the middle of a quiet four-way intersection in the fall suburb from Memo 15, with crosswalk stripes under my feet and leaves blowing",
  "me": {
    "who": "the same man as the Memo 16 cover: me",
    "appearance": "round friendly face, neat dark beard with a little gray, thin round glasses, yellow cap, dark hoodie, jeans",
    "pose": "standing dead center, holding a big unfolded paper town map UPSIDE DOWN with both hands, squinting at it, totally confused; a coffee mug balanced on top of my cap"
  },
  "street_sign": "a tall signpost right next to me with four arrow signs pointing in four different directions, and every one of them says the same thing: THIS WAY",
  "the_answer_behind_me": "directly behind me, over my shoulder and clearly visible, a brand-new strip mall glowing warmly with a soft orange outline, as if it just appeared. I am not looking at it",
  "swarm": "a wave of the game's enemies (white paper Bills with angry faces, ringing phones, purple ghosts) just rounding the corner at the right edge, a block away, one Bill holding a tiny MOVING DAY sign",
  "small_jokes": [
    "a small orange game-style arrow marker floating at the very edge of the frame, pointing at the strip mall, that I also don't notice",
    "a squirrel on the signpost looking at the strip mall"
  ],
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "text_allowed": "only THIS WAY on the four arrow signs and MOVING DAY on the tiny sign, in chunky pixel lettering; no other words",
  "avoid": "real brand logos, real store names, real street names, real people other than me, any photo look",
  "composition": "me and the signpost in the center; the glowing strip mall upper left behind me; the swarm entering at the right; keep the bottom 35% to plain road and crosswalk for a two-line title. In the portrait crop, keep me, the sign and the glowing mall all in frame"
}
```

**Ship it:** save over `devlog/img/17-key-art.jpg` and the portrait crop (under 400 KB each), push to main. Claude checks them and swaps them in.
