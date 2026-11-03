# Gemini brief: first-time tip lines for every hero (Nov 3, 2026)

Thanks for the Spotlight copy. It's in the game, and every card now has a big animated portrait. This job is small: **lines for the first-time tip cards**, so every hero has a voice.

## How tip cards work
The first time something happens (an elite shows up, a boss chest drops), a Spotlight card plays. The hero **you're playing** says one line in a speech bubble, and a plain tip sits under it. Each tip plays once ever per player.

Right now most tips only have a generic line plus one hero's line, and the newest hero has none. See `src/data/spotlight.js`, the `tips` section.

## The four heroes (keep their voices distinct)
- **The 9-to-5er** (`officeWorker`): tired, dry, polite. Lives on coffee and calendar invites. Mild office sarcasm.
- **The Soccer Dad** (`photographer`): coach energy, upbeat, sideline pep talks, orange slices and folding chairs.
- **The Grad Student at 45** (`gradStudent`): back in school at 45, broke, overcommitted, academic jokes (citations, office hours, funding).
- **The Cold War Cowboy** (`coldWarCowboy`): Rami's real friend Ben, in IT since 2002. Nostalgic for old tech (floppy disks, dial-up, CRT monitors, LAN parties) and laid-back. His move is "Have you tried turning it off and on again?" Affectionate, never grumpy.

## What we need
**A. One line per hero for the four existing tips** (16 lines):
| Tip key | When it plays | Plain tip (keep or improve) |
|---|---|---|
| `elite` | First red-glowing elite | Red-glowing elites hit harder and drop bonus loot. |
| `chest` | First boss chest | Walk over the boss chest to claim upgrades and coins. |
| `evolution` | First evolved weapon | Evolved weapons clear swarms much faster than normal. |
| `lowHp` | First time at 30% health | Health is low. Smash office props to find healing food. |

**B. Three new tips**, each with a kicker, a plain tip and one line per hero (3 × 6 = 18 pieces):
| Tip key | When it plays | What the player should learn |
|---|---|---|
| `intern` | First time TJ or Derek walks over with a delivery | Interns bring snacks, coffee or boosts. Meet them halfway; enemies scare them off. |
| `salad` | First Desk Salad drop (elites drop it) | It heals more than pizza but wilts in 14 seconds, so go get it. |
| `modifier` | First age-50+ "life happens" surprise (Rent Hike, Reading Glasses...) | Surprises last a couple of years, then pass. The chip at the top says which one is active. |

## Rules
- **Line:** 60 characters max, spoken by the hero, one sentence, no em dashes.
- **Kicker:** 2–3 words in caps style, like the existing ones ("URGENT MEMO", "BONUS APPROVED", "PTO NEEDED").
- **Tip:** 55 characters max, plain and useful.
- Warm, recognizable midlife humor, never mean. No real brand names. Don't write lines for TJ or Derek (they wrote their own).
- Give **two options** for each line so Claude can pick the funniest, like last time.

## Return format
Reply in this shape so Claude can paste it into `src/data/spotlight.js`:
```js
tips: {
  elite: { kicker: "URGENT MEMO", tip: "...",
           lines: { officeWorker: ["option 1", "option 2"], photographer: [...], gradStudent: [...], coldWarCowboy: [...] } },
  chest: { ... }, evolution: { ... }, lowHp: { ... },
  intern: { ... }, salad: { ... }, modifier: { ... }
}
```
Save it as `docs/handoffs/gemini-tip-lines-reply.md` (or paste it to Rami) and log it in `docs/handoffs/gemini-changes.md` if you keep one.
