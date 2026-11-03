# Grok brief: more ways to heal (Nov 3, 2026)

Playtester TJ (maxed the 401(k) shop): "easier ways to regain health... maybe at life milestones or certain enemies like a salad bring back a portion of your health, so runs can be extended."

## What heals today
| Source | Amount | How often |
|---|---|---|
| Leftover Breakroom Pizza | +2 HP | Drops from smashed plants, printers (15%), vending machines (75%), water coolers (35%) |
| Level up | +1 HP | Every level |
| Annual Checkup perk | +3 max HP and +4 HP | Up to 3 ranks |
| Healthy Boundaries ("No." evolution) | +1 HP | Every other pulse |
| Revive (shop) | Back to half HP | Per purchased revive |
| Retirement at 80 (Full Life only) | Full HP | Once |

- Starting max HP is **12**. The core run is ages 40 to 65 at 45 seconds a year (about 19 minutes).
- The Tax Bracket difficulty cuts all healing by 10% per bracket (never below 40%). Every heal goes through `healAmt()`.
- Elites (bigger red-glow enemies, 2% of spawns at 40 rising to 14% at 65) drop 4 gems and 2 coins.

## What we need from you (spec only, no code)
1. **Milestone heals.** Should birthdays (every 5 years? decades only?) restore health? How much, and should it scale with max HP?
2. **A healthy-food drop** (TJ's salad idea). Who drops it (elites only? a rare chance from any enemy?), how much it heals, and how it differs from pizza. A funny name list is Gemini's job later, so just give it a working name.
3. **Balance check.** Make sure a strong player still feels pressure by 60 to 65. Say what you'd change if healing gets too easy (caps, cooldowns, Tax Bracket interaction).
4. **Numbers in tables** with current vs proposed, plus where each number lives (`src/data/pickups.js`, `src/data/player.js`, `src/data/swarms.js`, `src/data/breakables.js`).
5. A short **test plan**: what to watch in a playtest, and what "too easy" looks like.

## Rules
- Keep it data-driven: new numbers go in `src/data/*.js`, not in game logic.
- Warm, recognizable humor, never mean.
- Return one Markdown handoff (`docs/handoffs/grok-healing-spec.md`) plus a short change-log block for `docs/handoffs/grok-changes.md`.

## Addendum (Nov 3, 9 AM): the Interns
Rami and TJ want **interns** (playtesters as office interns, not playable) who roam the map and bring the player things. Please include them in the spec:
- **Deliveries:** an intern walks over with coffee or a snack (heal) or a short buff. How often, how much, and do they get scarcer with age?
- **Pop-up shop:** after enough levels, an intern can sell special items mid-run for coins, like the Merchant in Vampire Survivors. What's for sale, prices, and when it unlocks.
- How this works alongside milestone heals and the salad drop, so the healing total stays fair.
