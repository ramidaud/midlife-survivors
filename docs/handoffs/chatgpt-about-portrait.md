# ChatGPT brief: Rami's About portrait in the game's art style (Nov 4, 2026)

Grok's attempt didn't hold Rami's likeness or the game's style, so ChatGPT takes this one. Paste everything below the line into ChatGPT. If you have a recent real photo of yourself you like, attach it too (keep it out of the repo).

---

Please redraw my About-page portrait so it looks like it belongs inside Midlife Survivors. Another tool tried and lost both my likeness and the game's look, so **likeness first, style second, props last.**

## References (in the repo)
1. **Likeness and setting:** `assets/bio/rami-studio-pixel-v1.png` (the current About portrait of me in my studio). If I attached a photo, use it for my face.
2. **Style to match:** `assets/title-screen/slides/08-group-photo-desktop.jpg` (key art) and the hero portrait sheets in `assets/characters/portraits/` (e.g. `office-worker-on-break-v1.png`). I should look like I could stand next to the four heroes.

## The brief
```json
{
  "subject": {
    "who": "Rami, a photographer and first-time game developer",
    "appearance": "light-skinned Black male, mid-forties, clean-shaven bald head, full dark beard with a little gray at the chin, round thin wire-frame glasses, warm and slightly amused expression",
    "clothing": "black button-up shirt, sleeves rolled to the forearms, loosened tan knit tie",
    "proportions": "same friendly proportions as the game's heroes: slightly larger head, expressive face, readable at small size",
    "likeness_notes": "keep the head shape, beard shape, glasses and skin tone from the reference. Don't lighten or darken the skin, don't add hair on top, don't make the beard short or patchy"
  },
  "style": {
    "look": "crisp 16-bit pixel art like the key art and hero sheets: chunky hard pixel clusters, bold navy outlines, warm lamplight from the upper left",
    "avoid": "smooth painterly shading, anti-aliasing, gradients, a photo look, a 3D look"
  },
  "setting": "my creative studio at night: wooden desk, laptop I'm typing on while glancing at the viewer, a monitor showing a solar eclipse (my space photography), a pro camera with a long lens, an orange coffee mug with steam, headphones, a small studio mic, a bookshelf with a small trophy, trailing plants, warm framed art on the wall",
  "easter_eggs": [
    "a tiny angry paper-bill enemy peeking from behind the laptop on a sticky note",
    "a small framed pixel poster of the four heroes: 9-to-5er with a mug, soccer dad with a ball, grad student with a notebook, cowboy with a floppy disk",
    "a little gold pocket watch on the desk stopped at 5:00"
  ],
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF", "skin tones", "warm wood brown"],
  "composition": "keep the left and right thirds calmer so the wide version crops to a banner",
  "outputs": [
    { "file": "assets/bio/rami-studio-pixel-v2.png", "aspect": "3:2", "framing": "the whole studio scene" },
    { "file": "assets/bio/rami-headshot-pixel-v1.png", "aspect": "1:1", "framing": "chest-up headshot, warm studio glow behind" },
    { "file": "assets/bio/rami-sprite-v1.png", "cell": "96x112", "layout": "8 columns x 3 rows like the hero On Break sheets", "note": "optional bonus: me as a game sprite, idle wave and a camera-flash pose" }
  ],
  "avoid": "any text, letters, logos or watermarks"
}
```

## Before you ship
- **Check the likeness:** put the new headshot next to the reference at the same size. If the beard, glasses or skin tone drifted, fix them before committing.
- **One check image:** the headshot at 2× beside the 9-to-5er portrait, so we can see it matches the cast.
- **Ship it:** pull first (`git stash && git pull`). Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`. Claude will put them on the About page and its share card.
