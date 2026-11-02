# Grok brief: weapon roles and balance pass (Nov 2, 2026)

**Deliver a spec, not code.** Write your answer to `docs/handoffs/grok-weapon-roles-spec.md` (or paste it back to Rami), plus a dated entry in `docs/handoffs/grok-changes.md`. Claude builds it after Rami approves. Please don't edit game files; ChatGPT is building a room right now, and Claude owns runtime code.

## Why now
- Rami asked whether Dad Joke was defensive or offensive, and how it differed from "No." They overlapped: both were small circles around you.
- Claude just made Dad Joke an attack (V. 1.41.0): damage 1 to 2, a 0.22 s flinch instead of a 0.65 s freeze, and a big punchline blast.
- That makes it a good moment to check that all six weapons have **distinct jobs** and none is a trap pick.

## Read first
- `src/data/weapons.js`: all six weapons and their numbers.
  - Coffee Splash
  - Dad Joke
  - The TV Remote (boomerang)
  - Spreadsheet (orbit)
  - Podcast at 2x (piercing line)
  - The Word "No." (shove)
- `src/data/upgrades.js`: level-up cards, ranks, and the six evolutions.
  - Smart TV
  - Pivot Table
  - Binge Mode
  - Cold Brew Concentrate
  - Unhinged Pun Storm
  - Healthy Boundaries
- `src/data/enemies.js`: enemy HP and speed by age, and the wave table.
- `src/data/meta.js`: starting characters. The Soccer Dad starts with Dad Joke, and the Grad Student starts with "No."
- `docs/GAME_DESIGN.md`: design spirit. Swarms build slowly, then become absurd, and you're a power fantasy by your 60s.

## What we want back
1. **A role for each weapon** in one line, e.g. "Spreadsheet = close-range blender." Flag any two that still overlap.
2. **A balance table:** current vs. proposed numbers for each weapon at rank 1 and max rank (damage, fire rate, reach, special). Rough damage-per-second against a crowd is a plus.
3. **Evolutions:** does each one feel like a real payoff? Suggest one change for any that's just "bigger numbers."
4. **Dad Joke check:** is 2 damage every 2.3 s in a 130px circle right for an attack weapon at ages 40 to 45? Should Louder Groan scale damage faster?
5. **"No." identity:** keep it as the personal-space tool. Does the 3.2 s timer and 95px shove feel right next to Dad Joke now?
6. **A trap-pick list:** any card a smart player should never take, and how to fix it.
7. **Keep it tunable:** every change should be a number in `src/data/*.js`, with no new systems unless one clearly earns it.

## Constraints
- **Midlife run:** ages 40 to 65 at 45 s per year, about 19 minutes. Level-ups offer 3 choices.
- **Recent playtests** said the start felt too easy, and Claude made Bills tougher (HP 3) with faster early spawns. Don't make the first 5 minutes trivial again.
- **Voice:** warm, never mean, no em dashes in any player-facing text.

## Also waiting on you (no action needed)
- Your age 50+ run modifiers spec (`grok-modifiers.md`) is approved and queued. Claude will build it after the Wellness Corner lands.
