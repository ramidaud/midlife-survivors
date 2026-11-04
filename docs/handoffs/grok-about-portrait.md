# Grok brief: Rami's About portrait in the game's art style (Nov 4, 2026)

ChatGPT is out of usage, so Grok makes this one. **Attach two images** so Grok matches the likeness and the style:
1. `assets/bio/rami-studio-pixel-v1.png` (the current About portrait: Rami's likeness and studio)
2. `assets/title-screen/slides/08-group-photo-desktop.jpg` (the game's key art: the style to match)

Then paste the prompt below. Ask for **two images**: a wide scene (3:2) and a square headshot (1:1).

---

## Prompt (paste this)

Redraw the first image, a portrait of a photographer at his desk, in the exact art style of the second image: a cozy 16-bit pixel-art video game scene with chunky, crisp pixel clusters, bold navy outlines, warm lamplight from the upper left, and no anti-aliasing or smooth gradients.

The man is a light-skinned Black male in his mid-forties. He has a clean-shaven bald head, a full dark beard with a little gray at the chin, round thin wire-frame glasses, and a warm, slightly amused expression. He wears a black button-up shirt with the sleeves rolled to the forearms and a loosened tan knit tie. He is drawn with the same friendly proportions as the game's characters in the second image: a slightly larger head, expressive face, readable at small size.

He sits at a wooden desk in his creative studio at night, typing on a laptop and glancing toward the viewer. Around him:
- a monitor showing a solar eclipse (his space photography);
- a professional camera with a long lens on the desk;
- an orange coffee mug with steam;
- headphones and a little studio microphone;
- a shelf of books with a small trophy;
- trailing plants;
- warm framed artwork on the wall behind him.

Add a few game easter eggs: a sticky note with a tiny angry paper-bill character peeking from behind the laptop; a framed pixel poster of the four game heroes (a 9-to-5er with a mug, a soccer dad with a ball, a grad student with a notebook, a cowboy with a floppy disk); and a little gold pocket watch on the desk stopped at 5:00.

Use only this palette: deep navy #171C35, slate #303750, muted blue #526078, teal #3E7775, sage #83A89A, khaki #D3B78D, cream #F2D7A1, warm white #FFF0CF, coffee orange #EF9347, tie red #C45C4B, lavender #BFA8CF, donut pink #F1B5BF, plus skin tones and a warm wood brown.

No text, letters, logos or watermarks anywhere. Keep the left and right thirds a little calmer, so the image can be cropped to a wide banner.

Make two versions: a wide 3:2 scene of the whole studio, and a square 1:1 close-up headshot of him from the chest up, with the warm studio glow behind him.

---

## Same prompt as JSON (for reference or for tools that prefer it)

```json
{
  "task": "redraw image 1 in the exact art style of image 2",
  "style": "cozy 16-bit pixel-art video game scene, chunky crisp pixel clusters, bold navy outlines, warm lamplight from upper left, no anti-aliasing",
  "subject": {
    "who": "Rami, a photographer and first-time game developer",
    "appearance": "light-skinned Black male, mid-forties, clean-shaven bald head, full dark beard with a little gray at the chin, round thin wire-frame glasses, warm slightly amused expression",
    "clothing": "black button-up shirt, sleeves rolled to the forearms, loosened tan knit tie",
    "proportions": "match the game characters in image 2: slightly larger head, expressive face, readable at small size",
    "pose": "seated at a wooden desk typing on a laptop, glancing toward the viewer"
  },
  "setting": "his creative studio at night: monitor showing a solar eclipse, pro camera with a long lens, orange coffee mug with steam, headphones, small studio mic, bookshelf with a small trophy, trailing plants, warm framed art on the wall",
  "easter_eggs": ["tiny angry paper-bill character peeking from behind the laptop on a sticky note", "framed pixel poster of the four heroes: 9-to-5er with a mug, soccer dad with a ball, grad student with a notebook, cowboy with a floppy disk", "little gold pocket watch on the desk stopped at 5:00"],
  "palette": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF", "skin tones", "warm wood brown"],
  "composition": "left and right thirds calmer so it crops to a wide banner",
  "outputs": [{"name": "studio-wide", "aspect": "3:2"}, {"name": "headshot", "aspect": "1:1", "framing": "chest up, warm studio glow behind"}],
  "avoid": "any text, letters, logos, watermarks; smooth painterly shading; realistic photo look"
}
```

## When it's done
Send both images to Claude. Claude will check the palette and crop, save them as `assets/bio/rami-studio-pixel-v2.png` and `assets/bio/rami-headshot-pixel-v1.png`, and put them on the About page and its share card.
