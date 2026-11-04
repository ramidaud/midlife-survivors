# ChatGPT brief: the Student Lounge (Nov 4, 2026)

Paste below the line into ChatGPT and attach Rami's 8 photos of the real UCM student lounge. The photos are not in the repo, because the walls show real people's pictures.

---

The Lounge in Midlife Survivors is TJ and Derek's spot: after each promotion they open it for about 35 seconds, and you walk up to shop for snacks and run boosts with your 401(k). Right now it's just a counter in the Break Room. I'm attaching photos of the real student lounge at my office, where TJ and Derek actually work. **Please turn it into a pixel-art room kit and one scene illustration, so the Lounge feels like their real place.** Pull first (`git stash && git pull`).

**Match these exactly:** the prop kit format and style in `assets/stage/props/README.md` and `manifest-wall.json` (opaque #FF00FF backgrounds, foot points, footprints), the sofa in `assets/stage/props/sofa-v1.png` for scale, TJ and Derek in `assets/characters/portraits/intern-tj-on-break-v1.png` and `intern-derek-on-break-v2.png`, and the 56x60 hero `assets/characters/office-worker-walk-56x60-v2.png`.

**What makes the room (from the photos):** a mustard-yellow accent wall behind a long white desk run crowded with monitors (one old beige all-in-one), cameras, lenses and tangled cables; a white wall-mounted cube shelf loaded with cameras, toy figurines, plush toys and a water jug; a navy tufted futon with silly food pillows (a burger, a hot dog) and a fluffy white plush; an oval walnut coffee table with a chessboard, a red paperback, a water bottle and napkins; a tall glowing paper floor lamp; a whiteboard with a doodled camera and a wall of snapshots and instant photos; a black chalkboard with a chalk lightning bolt; a giant novelty microphone on a stand; a gray filing tower with two painted pumpkins on top; sports schedule posters in orange and navy.

```json
{
  "part_1_room_kit": {
    "folder": "assets/stage/props/",
    "manifest": "assets/stage/props/manifest-lounge.json (same format as manifest-wall.json; mark each piece solid or not, floor or mounted)",
    "pieces": [
      { "id": "lounge_futon", "frame": "128x72", "variants": 2, "what": "navy tufted futon; variant 1 plain, variant 2 with the burger pillow, hot dog pillow and white fluffy plush", "solid": true },
      { "id": "lounge_coffee_table", "frame": "88x52", "what": "oval walnut coffee table with a chessboard, a red paperback, a water bottle and a napkin stack; a small rug peeking out underneath", "solid": true },
      { "id": "lounge_paper_lamp", "frame": "24x96", "frames": 2, "what": "tall paper lantern floor lamp; frame 2 glows a little brighter (the game swaps them slowly)", "solid": false },
      { "id": "lounge_desk_run", "frame": "224x88", "what": "long white desk with four monitors (one old beige all-in-one), cameras, lenses, a label maker and cables; two office chairs pushed in", "solid": true },
      { "id": "lounge_cube_shelf", "frame": "176x64", "mount": "mounted", "what": "white wall-mounted cube shelf: cameras on top, little figurines, a green blocky plush, a water jug, mugs and tape inside the cubbies", "solid": false },
      { "id": "lounge_collage_wall", "frame": "160x80", "mount": "mounted", "what": "whiteboard with a doodled camera and tally marks, surrounded by snapshots and instant photos (tiny, no recognizable faces) and a black tassel", "solid": false },
      { "id": "lounge_chalkboard", "frame": "64x96", "mount": "mounted", "what": "black chalkboard with a big chalk lightning bolt and chalk sparks (no words)", "solid": false },
      { "id": "lounge_mic_stand", "frame": "24x80", "what": "a giant novelty microphone on a round-base stand", "solid": false },
      { "id": "lounge_filing_pumpkins", "frame": "36x88", "what": "gray filing tower with a small whiteboard on its side and two painted pumpkins on top", "solid": true },
      { "id": "lounge_posters", "frame": "48x64", "variants": 3, "mount": "mounted", "what": "sports schedule posters, orange or navy, with a row of tiny athlete silhouettes and a grid of dots (no logos, no words)", "solid": false },
      { "id": "lounge_accent_wall", "frame": "256x96", "mount": "mounted", "what": "a mustard-yellow wall segment (the palette's #D3B78D and #F2D7A1, warmed) that tiles left to right behind the desk run", "solid": false }
    ]
  },
  "part_2_scene": {
    "files": ["assets/ui/lounge-scene-v1.png (960x360)", "assets/ui/lounge-scene-tall-v1.png (600x720 for phones)"],
    "what": "a cozy pixel illustration of the whole Student Lounge in the late afternoon: the yellow desk wall on the left, the futon and coffee table in front, the collage wall and chalkboard on the right, the paper lamp glowing. TJ sits on the futon raising a coffee, Derek stands photographing something off-screen, in their exact On Break looks. A small open-sign glow on the doorframe. It sits at the top of the Lounge shop window, so keep the bottom 20% calm (floor and rug) for text",
    "background": "opaque, no magenta"
  },
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "style": "crisp 16-bit pixel art, navy outline, warm upper-left light, no anti-aliasing",
  "avoid": "any readable text, real logos or brands (no Kent State marks, no Marvel, no Minecraft, no Five Nights at Freddy's, no Dr Pepper or Mountain Dew), recognizable characters, and real people's faces in the photos on the wall"
}
```

**Checks:** one image with every kit piece at 2x on a floor and wall strip, arranged like the real room beside the 9-to-5er, plus the two scene files. Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`. Claude builds the room in the Break Room's north end and puts the scene at the top of the shop.
