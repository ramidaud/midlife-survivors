# ChatGPT brief: a friendly clock-out goal for age 65 (Nov 4, 2026)

Paste everything below the line into ChatGPT.

---

Thanks for the final art audit and Derek's camera. Both are live in V. 1.79.0. This is the #1 job from your audit: **the retirement goal at 65 still looks like danger.** It's a hooded reaper with a scythe, so new players run away from the thing they're supposed to walk into. The game now labels it "CLOCK OUT HERE ▼" and you can't hurt it, but the art still says "enemy".

## The job
Draw a **friendly clock-out station** the player walks into at 65 to retire. It should read instantly as "the finish line, come here", and it should look nothing like Full Life's Father Time (the reaper stays for the age-100 ending).

```json
{
  "subject": "a retirement punch-clock station: a vintage wall time clock on a wooden pedestal, its hands stopped at 5:00, with a time-card rack beside it holding one golden card sticking out",
  "decor": "three balloons tied to the pedestal (cream, coffee orange, lavender), a small gold ribbon bow on top, a little stack of wrapped gifts at its foot, a framed 'gone fishing' style picture (a fish icon, no letters) leaning against it",
  "glow": "a soft warm halo around the clock face, like it's the brightest thing in the room",
  "mood": "warm, celebratory, a little silly; the office's way of saying 'you made it'",
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "style": "crisp 16-bit pixel art matching the boss sheets and the Gold Watch: hard pixel clusters, navy silhouette outline, warm light from the upper left, no anti-aliasing",
  "avoid": "hoods, scythes, skulls, ghosts, anything spooky; any text, letters or numbers (the clock face uses tick marks only)"
}
```

## Sheet
- **Size:** 144×152 cells, the same as the boss sheets, 6 columns × 2 rows = 864×304. Transparent, hard alpha. The pedestal base sits on local y151.
- **Row 0, "waiting" (6 frames, 160 ms):** balloons bob gently out of step, the golden card wiggles, and the halo breathes.
- **Row 1, "clock out" (6 frames, 110 ms, plays once when you touch it):** the golden card punches into the clock, it goes *ka-chunk*, the balloons pop up and confetti bursts. It ends on a bright held frame.

## Files
- **Write:** `assets/bosses/clock-out-goal-v1.png`, plus preview GIFs of both rows and one check image at 2× beside the 9-to-5er (`assets/characters/office-worker-walk-56x60-v2.png`) and the Gold Watch (`assets/bosses/boss-gold-watch-v1.png`).
- **Pull first** (`git stash && git pull`). Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`. Claude will swap it in for the reaper in Midlife mode.
