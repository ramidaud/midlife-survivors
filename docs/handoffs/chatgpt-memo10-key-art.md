# ChatGPT prompt: key art for Memo 10, "This is starting to feel real." (Nov 4, 2026)

Paste below the line into ChatGPT. Attach `assets/bio/rami-studio-pixel-v2.png` (Rami's likeness), `devlog/img/08-promoted-key-art.jpg` (style), and `assets/share/discord/cast-v1.jpg` (the cast).

---

Make the cover image for Memo 10 of the Midlife Survivors devlog, "This is starting to feel real." Rami built version two of his game on paternity leave with newborn twins, between 3 a.m. feedings. He grew up making GeoCities websites and wants the internet to feel like people's passions again. The game is starting to feel real, and like a part of him is coming to life in it. Match the style of the attached Memo 8 key art exactly.

```json
{
  "file": "devlog/img/10-key-art.jpg",
  "size": "1600x900 (16:9), plus a 1200x1500 portrait crop as 10-key-art-portrait.jpg",
  "style": "crisp 16-bit pixel art like the Midlife Survivors key art, navy outlines, cozy and warm, no anti-aliasing",
  "scene": "3 a.m. in a dark, quiet living room. The only light is a laptop on the coffee table and a small warm lamp. A double bassinet sits beside the couch with two sleeping newborns in soft swaddles (one sage, one cream), tiny and peaceful. On the laptop screen the game's title screen glows, and the cast is stepping out of it at pixel size onto the coffee table: the 9-to-5er raising his coffee mug, the Soccer Dad, the Grad Student, the Coldwar Cowboy tipping his hat, and interns TJ and Derek, with Derek snapping a photo of the twins. A tiny Gold Watch peeks out from behind the laptop.",
  "rami": {
    "appearance": "olive-skinned Palestinian male, mid-forties, clean-shaven bald head, full dark beard with a little gray at the chin, round thin wire-frame glasses",
    "clothing": "soft gray hoodie with a burp cloth over one shoulder, sweatpants, socks",
    "pose": "sitting on the couch, holding a baby bottle in one hand while the other hand rests on the laptop trackpad, smiling quietly at the little characters, tired but happy",
    "likeness_notes": "match the attached studio portrait: head shape, beard, glasses and skin tone. No hair on top"
  },
  "small_details": [
    "a wall clock reading 3:00",
    "on a shelf, an old beige CRT monitor showing a tiny retro homepage with a construction-sign GIF and a visitor counter, a nod to his GeoCities days (no real logos)",
    "a mug that says 'DAD' in pixel letters",
    "a sticky note on the laptop: 'V2'"
  ],
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "lighting": "cool navy room, warm orange laptop and lamp glow on Rami's face and the cast, soft moonlight through a window",
  "text_allowed": "only 'DAD', 'V2' and the clock numbers",
  "avoid": "real brand logos (no GeoCities logo), real baby faces, anything that looks like a stock photo",
  "composition": "keep the top 18% calm for the memo title overlay; Rami left third, laptop and cast center, bassinet right"
}
```

**Ship it:** pull first, commit the two JPGs (under 400 KB each) and a 2x preview, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`.
