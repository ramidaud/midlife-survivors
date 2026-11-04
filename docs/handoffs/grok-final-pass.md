# Grok brief: final balance pass before V2 (Nov 4, 2026)

Paste everything below the line into Grok and attach these files: `src/data/bosses.js`, `src/data/enemies.js`, `src/data/swarms.js`, `src/data/healing.js`, `src/data/pickups.js`, `src/data/heat.js`, `src/data/modifiers.js`.

---

Thanks for the difficulty spec. All five changes (A to E) shipped in V. 1.72, and your Gold Watch numbers are in too. We're about to call this V2, so here's one last balance check with the newest play data. **Please only report this time.** I'll pick what to change.

## What changed since your last look
- **The Gold Watch** (final boss) arrives at 63.5 and can't be killed. Hits wind it back (push it away, slow its hands). Reach 65 and you clock out. Numbers are in `BOSS_ATTACKS.goldWatch` in bosses.js.
- **Gem cap (V. 1.75):** over 150 gems on the floor, the farthest ones merge into one big red gem worth all of them, so picking it up can give several levels at once. Unclaimed coins and pizza now disappear after 60 s. See `FLOOR_LIMITS` in pickups.js.
- **Quick Retry** is faster and the death screen is easier to use on phones, so expect more short runs in a row.

## The data (Midlife mode starting at 40, anonymous play stats, pulled Nov 4)
| Era | Runs | Players | Died | Reached 65 | Median age | Avg age | Avg minutes | Avg level | Avg fps |
|---|---|---|---|---|---|---|---|---|---|
| Before your fixes (V. 1.61 to 1.71) | 49 | 14 | 35 | 1 | 44.1 | 49.8 | 7.3 | 11.4 | 65 |
| After your fixes (V. 1.72+) | 35 | 11 | 31 | 0 | 49.6 | 50.7 | 8.1 | 12.7 | 69 |

**Age at death, after (31 deaths):** 42: 2 · 43: 1 · 44: 2 · 45: 1 · 46: 2 · 47: 4 · 48: 1 · 49: 1 · 51: 1 · **52: 6 · 53: 3** · 56: 1 · 60: 1 · 62: 2 · 63: 1 · 64: 1 · 77: 1 (overtime)

**Boss alive when they died:** 30-Year Mortgage 10 · Performance Review 8 · Midlife Crisis V8 3 · none 10

**Killers:** Bill 8 · Group Chat 8 · Snack Attack 8 · Spam Call 2 · one each: Back Twinge, Calendar Invite, Late Fee, Math Worksheet, 3 AM Thought

**By hero:** Grad Student 15 runs, avg 53.3 · Soccer Dad 10, avg 50.3 · 9-to-5er 10, avg 47.3
**By device:** desktop 18 runs, avg 52.5, 80 fps · phone 17 runs, avg 48.9, 57 fps (the gap was about 10 years before; now about 3.5)
**By Tax Bracket:** 0: 19 runs, avg 49.5 · 5: 10 runs, avg 50.3 · 1, 2 and 4: 2 runs each
**Group Chat:** first shows up at age 50.0 on average.

Small sample: 35 runs from 11 players, and a few players make up most of the Tax 5 runs. Nobody has seen the Gold Watch in a real run yet.

## Our reading (check it)
1. The 60 to 61 wall is gone. Only 1 death at 60 now.
2. A new cluster at **52 to 53** lines up with the 30-Year Mortgage boss (it arrives at 52 and was alive in 10 deaths).
3. The early game (42 to 47) is still where a third of runs end, mostly the 9-to-5er.
4. Snack Attack has caught up with Bill and the Group Chat as a top killer.

## Questions
1. **The Mortgage at 52:** fair mid-run exam, or a spike to smooth? If smooth, what's the smallest change?
2. **Gold Watch:** with no real runs yet, do the wind-back and phase numbers look sane on paper? What should we watch in the stats once people reach 63.5?
3. **Big red gem:** could merging 50+ gems into one pickup make a level spike that breaks pacing? Is 150 a good cap?
4. **The 9-to-5er's opening:** still the weakest hero. Is that fine for a starter, or worth one small nudge?
5. **Snack Attack:** is it pulling its weight as a threat, or over-tuned?
6. **Anything else** in the attached files that looks off to you.

## Return format
Save as `docs/handoffs/grok-final-pass-review.md` (or paste it to Rami):
- A 3-line summary.
- A **top 5**, ranked by impact, each with the exact number to change, why, and what to watch in the stats afterward. Keep each change small and reversible.
- Mark anything you'd leave alone with "leave it".
