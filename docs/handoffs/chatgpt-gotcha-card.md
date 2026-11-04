# ChatGPT brief: art for the GOTCHA! catch moment (Nov 4, 2026)

Paste everything below the line into ChatGPT. Attach a screenshot of the current card if you can (Claude has one in the session).

---

Interns don't walk up with coffee anymore. TJ and Derek now **run away**, and the player chases them. Catching one triggers a 2-second **"GOTCHA!" moment** (live in V. 1.82.0): time slows, the screen flashes, and a compact card stamps in with the intern's portrait, their line, and a little slot reel that spins through three treats and lands on the one they tossed. Right now everything except the portrait is placeholder: CSS boxes, a text "GOTCHA!" and 16×16 treat icons drawn in code. **The job: make it feel like a real game moment.**

## Reference
- **Interns:** `assets/characters/portraits/intern-tj-on-break-v1.png` and `intern-derek-on-break-v2.png` (96×112 cells, 8 columns × 3 rows). TJ is the Coffee Runner (beanie, glasses). Derek is the Snack Scout (beard, glasses, dark camera on a strap).
- **Style:** the boss sheets in `assets/bosses/`, the Gold Watch, and the Spotlight cards. The card code is `src/catch-moment.js`; the treats are in `src/data/interns.js` (`chase.treats`).

## The pieces
```json
{
  "1_caught_poses": {
    "what": "a new 'caught!' row for each intern: busted, laughing, handing over the treat",
    "files": ["assets/characters/portraits/intern-tj-caught-v1.png", "assets/characters/portraits/intern-derek-caught-v1.png"],
    "cell": "96x112, same scale, anchor and outline as their On Break sheets",
    "layout": "8 columns x 1 row = 768x112, 8 frames at 110 ms, loops",
    "tj": "skids to a stop, coffee cup sloshing, beanie knocked crooked, laughs and holds the cup out with both hands",
    "derek": "caught mid-photo, camera flash still glowing, grins sheepishly and holds out a bundt cake on a paper plate",
    "avoid": "fear or pain; this is playful tag between coworkers, not a capture"
  },
  "2_gotcha_wordmark": {
    "what": "a chunky pixel 'GOTCHA!' title, like an arcade KO, slightly tilted, cream letters with a coffee-orange fill, navy outline and a hard russet drop shadow",
    "file": "assets/ui/gotcha-wordmark-v1.png",
    "size": "native about 160x40, transparent, hard alpha (shown at 2x)",
    "extra": "a 4-frame stamp-in sheet (640x40): oversized and faint, slam, small squash, settle"
  },
  "3_treat_icons": {
    "what": "proper 32x32 icons for the three treats, replacing the code-drawn 16x16 ones (they're used on the floor and in the reel)",
    "file": "assets/items/treats-v1.png",
    "layout": "3 columns x 2 rows = 96x64. Row 0: coffee (paper cup, sleeve, steam), burrito (foil-wrapped half), bundt cake (pink glaze, one candle). Row 1: the same three with a cream 'shine' outline for the moment they land in the reel",
    "readability": "each must read at 16x16 on a busy carpet"
  },
  "4_card_frame": {
    "what": "a 9-slice card frame: navy panel, coffee-orange border with pixel corner brackets, a little cream ticket-stub notch on the left edge (it's a 'prize ticket')",
    "file": "assets/ui/gotcha-frame-v1.png",
    "size": "96x96 source with 24 px corners (Claude will 9-slice it with CSS border-image)"
  },
  "5_burst": {
    "what": "a radial burst sprite behind the portrait when the card appears: chunky pixel rays plus confetti bits",
    "file": "assets/fx/gotcha-burst-v1.png",
    "layout": "6 frames of 128x128 = 768x128, 60 ms, plays once",
    "colors": "cream, coffee orange, donut pink, sage confetti"
  },
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "style": "crisp 16-bit pixel art, navy silhouette outline, warm upper-left light, no anti-aliasing, transparent backgrounds with hard alpha",
  "avoid": "any text other than the GOTCHA! wordmark; logos; realistic shading; changing the interns' faces or outfits"
}
```

## Files and checks
- **Write** the files above plus preview GIFs of the caught rows, the stamp-in and the burst.
- **One check image:** the full card mocked up at 2× with the frame, wordmark, a caught pose and the reel landing on each treat, next to a screenshot-sized 390-wide phone frame so we can judge size.
- **Ship it:** pull first (`git stash && git pull`). Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`. Claude will wire it into `src/catch-moment.js`.
