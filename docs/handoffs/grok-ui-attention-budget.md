# Grok brief: the in-run attention budget (feeds the UI/UX design pass, Nov 10, 2026)

Rami: "It's hard to tell where I should be looking." Before the design system is written, count what actually competes
for the player's eyes during a run. Read the code; numbers in tables, no code changes.

1. **Inventory every in-run message trigger:** `flashBanner`, `showLowerThird`, spotlight cards (`src/spotlight.js`), errand chips and buffs (`src/errands.js`), tips (`src/data/tips.js`), boss toasts, pop-up world text (`pop`, `popPing`), level-up and Performance Bonus menus, chests, catch moments, the Lounge, the minimap pings, speech bubbles. For each: file, what triggers it, where on screen it appears, how long it stays, whether it pauses the game, and whether it can overlap others.
2. **Message density by age:** for a typical office run and a Maple Hollow run, estimate how many messages per minute at 40-45, 50-55, 60-65, and 80+. Mark the worst minutes (e.g. a boss intro, a level-up and an errand landing together).
3. **Collisions:** list the pairs that can be on screen at the same time and the screen regions they share (top banner vs. lower third vs. HUD vs. center).
4. **Device check:** which ones cover the player or the action on a phone (390x844) vs. desktop.
5. **Recommend an attention budget:** max messages on screen at once, a priority order, a queue rule, what should be demoted to a quiet HUD change, and what deserves a full pause. Numbers please.

Reply in `docs/handoffs/grok-ui-attention-budget-reply.md`. The design lead (a separate chat) will use it.
