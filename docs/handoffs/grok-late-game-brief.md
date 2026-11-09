# Grok job: the late-game plateau (Nov 9)

Paste into Grok:

> I'm building Midlife Survivors, a free Vampire Survivors-style browser game about ages 40 to 65 (repo: ramidaud/midlife-survivors, read `src/data/*.js`). Midlife mode runs 45 s per year; the shop's "Delayed Retirement" (Overtime) pushes the end past 65, up to 80. As of V. 2.13.3, Overtime years past 65 take 25 s instead of 45.
>
> **The problem.** From Rami's own run (reached 77.6, Tax Bracket 2, level 25): "essentially invincible from 65 on", "basically not moving with little else happening", "a long gap between the last boss and 76", "I love the power fantasy but it was too long with not much variety". The last Midlife boss is the Gold Watch at 63.5. In the last 14 days, 16 of 444 Midlife runs reached 65 and 12 reached 75 (Rami's own runs excluded).
>
> Please write a spec in your usual format (`docs/handoffs/grok-boss-attacks.md` style, checked against the current code) for:
> 1. **Overtime content between 65 and 80:** 2 or 3 new events or a boss that fit the retirement years (ideas: a grandkids' visit, a Medicare enrollment maze, downsizing the house, a reunion). For each: what happens, when, how it's telegraphed, what it drops. Keep the "one input: move" rule.
> 2. **Threat that keeps pace with very strong builds:** a measured way (e.g. kills per second, damage taken per minute) to notice "this player is unbeatable" and raise pressure past 65 only, so new players aren't hurt. Numbers and data keys, a cap, and how it shows on screen so it feels fair.
> 3. **Stats to watch** after shipping.
>
> No game code edits; spec only, like before.
