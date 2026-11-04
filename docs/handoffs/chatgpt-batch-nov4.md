# ChatGPT: one combined brief (Nov 4, 2026)

Everything still open for ChatGPT in one paste. It replaces sending `chatgpt-gotcha-card.md` and `chatgpt-loadout-art.md` separately (both stay in the repo with full detail). Not included: the Lounge (waits on Rami's photo of the student lounge).

---

Thanks for the clock-out goal, wall kit, coworker poses and my studio portrait. The clock-out goal is live in V. 1.86.0, and the portrait is on the About page. Two jobs are left. Please pull first (`git stash && git pull`), since the game changed a lot today (V. 1.81 to 1.86).

**Read these two briefs in the repo. They have the full specs, file names, sizes and frame timings:**
1. `docs/handoffs/chatgpt-gotcha-card.md`: the GOTCHA! moment when you catch an intern (live in V. 1.82, with placeholder art in `src/catch-moment.js`).
2. `docs/handoffs/chatgpt-loadout-art.md`: 34 card/HUD icons and 9 in-world weapon sprites and effects for the loadout expansion (live in V. 1.83, with emoji and code-drawn placeholders in `src/weapons_more.js` and `src/data/loadout.js`).

**Do them in this order** (the smaller job first, so it can ship sooner). Commit each part as soon as it's done:

```json
{
  "part_1_gotcha_card": {
    "caught_poses": "TJ and Derek 'caught!' rows, 96x112 cells, 8 frames, same scale and anchor as their On Break sheets",
    "wordmark": "chunky pixel 'GOTCHA!' (cream letters, coffee-orange fill, navy outline, russet drop shadow), plus a 4-frame stamp-in",
    "treat_icons": "32x32 coffee, burrito and bundt cake, plus a shine row (also used on the floor)",
    "card_frame": "9-slice prize-ticket frame, 96x96 source, 24 px corners",
    "burst": "6-frame pixel ray-and-confetti burst behind the portrait"
  },
  "part_2_loadout": {
    "card_icons": "34 icons at 32x32 on an 8-column sheet with a JSON name-to-cell map: 7 new weapons, their 7 upgrades, 7 evolutions, 6 new passives, plus the 4 style badges (plus sign, shield, lightning bolt, brick wall at 12x12)",
    "world_sprites": "spaghetti bowl (file still casserole-v1.png) and heat zone, headphone bubble and pop, rolling office chair (8-frame spin), reply-all envelope, out-of-office ring, sticky note (flat, stuck, pop), cold snap burst, frozen overlay",
    "style_colors": { "healing": "#83A89A", "shield": "#3E7775", "offense": "#EF9347", "defense": "#BFA8CF" }
  },
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "ice": "frost uses cream, warm white, muted blue and slate. No bright cyan",
  "style": "crisp 16-bit pixel art, navy silhouette outline, warm upper-left light, no anti-aliasing, transparent with hard alpha",
  "avoid": "text other than the GOTCHA! wordmark, numbers, logos, real brands, changing TJ's or Derek's faces or outfits"
}
```

**Checks and shipping (same as always):**
- Preview GIFs of every animated row.
- One check image per part: the GOTCHA! card mocked up at 2× beside a 390-wide phone frame, and all 34 icons at 2× with their names, plus each world sprite next to the 9-to-5er.
- Commit art and docs only, push to main, and add one line per part to `docs/handoffs/chatgpt-changes.md`. Claude wires everything in.
