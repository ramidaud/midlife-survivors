# ChatGPT art brief: wall bonk crack and dizzy stars (Nov 4)

When a boss charges into a wall (src/boss-attacks.js), Claude draws a placeholder crack and uses text characters for the
dizzy stars. Replace both with small sprite sheets. Art and docs only; Claude wires it in.

Same rules: the 12-color palette, exact #FF00FF background, native pixels, no text, no brands, plus a manifest.

1. `assets/bosses/bonk-crack-v1.png`: 3 variants of a drywall crack, 48 x 48 cells, navy cracks with a few cream plaster
   chips and a small dented center. Reads on cream/tan office walls and on teal walls.
2. `assets/bosses/dizzy-stars-v1.png`: a 6-frame loop, 16 x 16 cells: a cartoon star (orange, cream highlight, navy
   outline) twinkling and turning. Plus 2 cells of a tiny cream bird variant for fun.
3. `assets/bosses/manifest-bonk.json` with frame sizes, variant counts and the star loop speed.

Prompt template:
{
  "subject": "pixel-art drywall crack decal from a cartoon boss crashing into an office wall",
  "style": "16-bit pixel art, 1 px navy outline where needed, no anti-aliasing, matches Midlife Survivors props",
  "palette": ["#171C35","#303750","#526078","#3E7775","#83A89A","#D3B78D","#F2D7A1","#FFF0CF","#EF9347","#C45C4B","#BFA8CF","#F1B5BF"],
  "background": "#FF00FF flat",
  "canvas": "48x48 per cell, 3 variants in a row",
  "rules": ["no text","no brands","comic, not violent","readable at 1x on a phone"]
}
For the stars, swap the subject to "cartoon dizzy star circling a stunned character's head", canvas 16x16, 6 frames.
