# Gemini Argon: new-player review (Nov 4, V. 2.1)

Sent by Rami (he used Gemini Argon instead of Fable for this one). Claude's notes and Rami's picks go at the bottom.

## Nov 4: new-player review (V. 2.1)

### 1. Where a new player gets confused or lost (worst first)
1. **Title screen overload before Run 1:** A brand-new player with 0 coins and 1 unlocked hero sees the 401(k) Shop, Character Select, Decade Checkpoints, Tax Bracket (Heat), Lore Archive, and Stage switches before they even know how the game moves. It feels like a spreadsheet before the fun starts.
2. **Weapon evolution prerequisites are hidden until it's too late:** Level-up cards don't tell a beginner that *Coffee Splash* needs *Good Night's Sleep* (or *Dad Joke* needs *Reading Glasses*) until they already stumble into Rank 2+ AND the matching passive. First-timers pick random passives and wonder why they never see an evolution.
3. **Intern deliveries (TJ and Derek) look like enemies at first:** At 45 seconds in, a new character walks toward the player. Because everything else walking toward you hurts you, new players instinctually run *away* from TJ/Derek until the swarm scares the intern off.
4. **Locked promotion gates vs. open paths:** In the first run, the campus feels big, and walking into a locked promotion gate (`AUTHORIZED PERSONNEL`, `EXECUTIVES ONLY`) without knowing doors open automatically at Ages 45/50/55 can make a player think they need to find a physical keycard on the floor.
5. **Boss Chests vs. Floor Items:** Boss chests require walking over them to trigger a multi-upgrade, while floor items (Fanny Pack, PTO Day) fire instantly on touch. On a phone screen, when a chest drops inside a crowd of Bills, it's hard to tell if touching it will pause the game or leave you vulnerable.

### 2. Where and why they die early (and is the first 2 minutes fair?)
- **First 60 seconds (Ages 40–42): Fair, almost a little slow on damage.** Bills have `hp: 3`, which means starting Coffee Splash takes three hits to clear a single Bill. If a new player keeps walking in one direction instead of circling, 4–5 Bills go unpaid for 11 seconds and split into 8–10 fast `Late Fees` (`speed: 125`). **First common death: Age 41.5 to `Late Fee` splits.**
- **Minute 1 to 2 (Ages 42–45): The Donut + Spam Call combo.** At Age 42, `everyMs` drops sharply from `1400` to `820`, and both `Spam Likely` (`dashSpeed: 275`) and `Late-Night Donut` (`slowFactor: 0.68`) enter at the same time. A first-timer touches one pink Donut on a narrow phone screen, loses 32% move speed, and immediately eats a Spam Call dash + the Age 45 `Performance Review` boss charge (`chargeSpeed: 400`, `damage: 2`). **Second common death: Age 45.2 to `Performance Review` right after getting glazed by a Donut.**

### 3. Screen noise that should wait until Run 2 or 3
- **Tax Bracket (Heat) selector & Decade Checkpoint picker:** Useless on Run 1 (you haven't unlocked Age 50 or beaten the game yet). Hide both until `runsPlayed >= 1` or Age 50 is reached.
- **Hero Spotlight card at 0:00 + Tip Banner at 0:02:** Starting a very first run triggers the 6-second Hero Spotlight card (`NOW ONBOARDING`) right as `window.TIPS.start` (`"Your weapons fire on their own..."`) and the first Bills arrive. On a 390px phone window, the lower third is covered for the entire opening wave.
- **Enemy labels (`$`, `FEE`, `TEL`, `YUM`) + Damage numbers + Lower-third tips + Smashable prop lines:** When a player shoots a plant near 10 Bills while a first-time tip plays, four different text systems compete on a phone screen.

### 4. Five concrete fixes (smallest first)

1. **Drop starting `bill.hp` from `3` to `2` solely between Ages 40 and 42 (or raise `overdueAfterMs` from `11000` to `14000` before Age 43).**
   - *What the player notices:* Their starting Coffee Splash actually finishes off early Bills before they split into Late Fees, so the first 60 seconds teaches aiming and gem collection instead of punishing kiting mistakes.
2. **Add `"Pairs with: [Weapon]"` to the three core Passive cards in `src/data/upgrades.js`.**
   - *What the player notices:* When *Good Night's Sleep*, *Reading Glasses*, or *Comfortable Shoes* pops up, a 3-word note (` Evolves Coffee & Podcast`) tells a beginner why that passive matters without needing a wiki.
3. **Hide Tax Bracket, Decade Checkpoints, and locked Modes on the Title Screen when `runsPlayed === 0`.**
   - *What the player notices:* First launch has one big, friendly **"CLOCK IN (START RUN)"** button. After their first death, the 401(k) Shop and progression options reveal themselves naturally.
4. **Skip the Hero Onboarding Spotlight card on `runsPlayed === 0` (or delay it until after the first level-up).**
   - *What the player notices:* On Run 1, the screen stays 100% clear for the first 15 seconds so they only see their character, the first Bills, and `"Your weapons fire on their own. Just keep moving."`
5. **Put a friendly green `[SNACK!]` or `[ALLY]` badge (or pulsing green floor ring) under TJ and Derek.**
   - *What the player notices:* Even before reading the Spotlight tip, players immediately read green = friendly pickup and walk *toward* the intern instead of kiting away from them.
---
**Rami's picks (Nov 4):** all of them, except hiding the hero card. He likes its tone, so it became a shift briefing that plays before the clock starts. [done] in V. 2.2: briefing, "Evolves with" notes, ALLY ring on interns, simpler first title screen, 14 s Bill grace before 43.
