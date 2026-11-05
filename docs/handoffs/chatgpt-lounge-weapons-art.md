# ChatGPT art brief: Lounge weapons, Mic Drop and Say Cheese (Nov 5)

Two new weapons you can only buy in the Student Lounge (V2.7.6). Claude drew code placeholders; replace them with
sprite sheets in `assets/weapons/`. Art and docs only; Claude wires it in.

Same rules as the loadout pass: the 12-color palette, exact #FF00FF background, native pixels, binary alpha, no text,
no brands, plus a manifest (`manifest-lounge-weapons-v1.json`) and preview GIFs.

1. `mic-drop-v1.png`, 24 x 40 cells
   - Row 0, 6 frames: a stage microphone falling and tipping over (upright, tilting, hitting the floor, small bounce, lying flat, still).
   - Row 1, 4 frames: a short feedback "screech" squiggle above the mic (cartoon sound lines), loopable.
2. `mic-shockwave-v1.png`, 96 x 96 cells, 5 frames: a flat ring of sound waves expanding from the center, lavender and
   cream, thin enough that enemies under it stay readable. Claude scales it to the real radius.
3. `say-cheese-camera-v1.png`, 32 x 24 cells, 4 frames: a chunky retro camera held sideways (lens facing right):
   idle, shutter press, flash burst (cream/white star on the flash), cooldown. Faces right; Claude flips it.
4. `say-cheese-posed-v1.png`, 24 x 24 cells, 4 variants: overlays drawn on frozen enemies, like a tiny peace sign hand,
   a cartoon "blink" eyes bar, a little sparkle and a white camera-flash outline. Comic, never mean.
5. HUD icons, 24 x 24: `icon-mic-drop-v1.png` and `icon-say-cheese-v1.png` (match the existing card icons' weight).

Prompt template:
{
  "subject": "pixel-art stage microphone falling and tipping over, cartoon mic drop, for a comedy office survival game",
  "style": "16-bit pixel art, 1 px navy outline, no anti-aliasing, matches the Midlife Survivors loadout sprites",
  "palette": ["#171C35","#303750","#526078","#3E7775","#83A89A","#D3B78D","#F2D7A1","#FFF0CF","#EF9347","#C45C4B","#BFA8CF","#F1B5BF"],
  "background": "#FF00FF flat",
  "canvas": "24x40 per cell, 6 frames in row 0, 4 frames in row 1",
  "rules": ["no text","no brands or logos","no real camera or mic models","readable at 1x on a phone","binary alpha"]
}
Swap the subject and canvas for each sheet above.
