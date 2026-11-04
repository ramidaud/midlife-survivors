# Final balance pass before V2 (Grok, report only) - Nov 4, 2026

Checked against **V. 1.76.2** (build 180), commit `a9f7627`. Report only: nothing here is built, and every change below is one number in `src/data/*.js`.

## 3-line summary

1. The 60 to 61 wall is gone. The new bump at 52 to 53 is the Mortgage fight running on top of the full age-50 swarm. The Mortgage itself has killed nobody; its Bills, Group Chats and Donuts do the killing.
2. The Gold Watch looks fair on paper except one thing: once age and phase scaling stack, the Minute Hand tip moves 438 to 605 px/s, which is far faster than the 342 px/s we planned. Trim `sweepDegPerSec`.
3. The big red gem is safe at 150. A real multi-level spike can only happen before about level 9, and the floor rarely holds 150 gems that early. Leave it alone and measure it.

## Checking your reading

- **"60 to 61 wall gone": agree.** 1 death at 60, 0 at 61 (out of 31).
- **"Cluster at 52 to 53 = Mortgage": agree, with a twist.** 9 of 31 deaths (29%) happened at 52 to 53, and the Mortgage was alive for 10 deaths. But it is not in the killer list at all. The killers at that age are the swarm. Nothing thins the swarm during the Mortgage fight (`GoldWatch.duel()` only reacts to `goldWatch`), and Group Chats now arrive around 50.
- **"42 to 47 is a third of runs": it is more than that.** Deaths at 42 to 49 are 14 of 31 (45%). Deaths at 42 to 47 are 12 of 31 (39%).
- **Performance Review lingers.** It was alive for 8 deaths, but only 9 deaths fall between 45 and 49 (and 5 were before it arrived at 42 to 44). So it is alive for nearly every death in its window. At age 45 and level ~8, its HP is 45 x 2.96 x 1.5 = about 200, which takes about 50 s for a weak Coffee-only build.
- **Snack Attack as a top killer: true, but partly borrowed credit.** Its 1.8 s slow sets up hits that other enemies land, and the killer field only records the last hit.
- **Data inconsistency 1:** "Reached 65 = 0", yet one death is at **77 (overtime)**. Overtime starts after 65, so either overtime runs are counted separately or "reached 65" misses Delayed Retirement runs. Worth checking the query.
- **Data inconsistency 2:** the median over all runs (49.6) is not the median death age. The 31 deaths have a median of **52**. 4 runs (35 minus 31) were quits or restarts.
- **Confounding:** hero, device and Tax are tangled up with player skill (Grad Student veterans on desktop, a few players making up most of Tax 5). Tax 5 averaging 50.3 against Tax 0's 49.5 is a selection effect, not proof that Tax 5 is easy. The phone gap narrowing from about 10 years to 3.5 is the real win from the zoom change.

## Top 5 (ranked by impact)

**1. Mortgage HP: `src/data/enemies.js` `mortgageRefinance.hp` 110 -> 85.**
Why: the boss scales by level and age. At 52 and level ~11, effective HP is 110 x 3.8 x 2.2 = about 920, which drops to about 710. That is roughly a 23% shorter overlap with the age-50 swarm (everyMs 380, Group Chat weight 1). Its rings stay exactly the same.
Watch: deaths at 52 to 53 as a share of all deaths falling from 29% toward 15%, `boss_alive_at_death = mortgageRefinance` going down, and median Mortgage fight time.
(Bigger but still small option for later: let the Mortgage use a light version of the Watch's swarm thinning, for example `spawnDelayMult 1.3`. That is a few lines of code to generalize `duel()`, so it is not data-only.)

**2. Minute Hand speed: `src/data/bosses.js` `goldWatch.minuteHand.sweepDegPerSec` 70 -> 55.**
Why: `gold-watch.js` multiplies the sweep by the shared age/Tax scaling (1 + 23.5 x 0.012 = 1.28 at 63.5, capped at 1.45) and then by the phase multiplier. The tip (280 px long) currently moves 438 px/s in phase 1 at Tax 0, 535 px/s in Last Minute, and 605 px/s in Last Minute at Tax 5. The player moves 230 px/s. At 55 the tip moves 344, 420 and 475 px/s. You still cannot outrun it at the tip, but crossing behind the 14 px leading edge stays readable. Hand slow from hits (x0.85 for 400 ms) helps the people who are hitting it.
Watch: `hits_taken` during the Watch, deaths with `boss_alive_at_death = goldWatch`, and phone vs desktop on both.

**3. Performance Review HP: `src/data/enemies.js` `performanceReview.hp` 45 -> 36.**
Why: about 200 effective HP drops to about 160, so a Coffee-only 9-to-5er spends about 10 s less in the 45 to 49 crush. Strong builds will not notice.
Watch: `boss_alive_at_death = performanceReview` (8 now) and deaths at 45 to 49.

**4. 9-to-5er nudge: `src/data/meta.js` `CHARACTERS` officeWorker `apply: s => {}` -> `apply: s => { s.maxHp += 2; }`.**
Why: it is the only hero with no perk at all (Grad Student gets "No." + 1.5x magnet + 0.9 cooldown). Two extra HP is one more mistake allowed in the opening, and it keeps "balanced" true without stealing Coffee's job. Its tagline can stay "Balanced stats."
Watch: 9-to-5er average age (47.3 now) and deaths at 42 to 47 for `character = officeWorker`. Aim for a 2 to 3 year gain, not parity with Grad Student.

**5. Donut slow: `src/data/enemies.js` `snackAttack.slowDurationMs` 1800 -> 1400 (leave `slowFactor` 0.68).**
Why: the Donut has the fastest base speed of the common chasers (96 vs the Bill's 84), and a hit means 1.8 s at 68% speed, which turns one mistake into two. 1.4 s keeps the "SUGAR CRASH" joke and its threat while cutting the chain hits.
Watch: Snack Attack as killer (8 of 31 now) and total `hits_taken` per minute from 45 to 55.

## Answers to the six questions

1. **Mortgage at 52: a spike to smooth, gently.** The boss is fair; the overlap is not. Smallest change: HP 110 -> 85 (top 5, #1). Leave its rings (telegraph 850, gap 70 deg, 135 px/s): nobody is dying to them.
2. **Gold Watch: mostly sane, with one fix.** Telegraphs at 63.5 (age cut -94 ms): minute 706, hour 806, alarm 856, gears 550 (floored). At Tax 5: 581 / 681 / 731 / 550. All are at or above the 550 and 700 floors. Phases are time-based (Overtime after 0.5 years = 22.5 s, Last Minute after 1.1 years = 49.5 s of the 67.5 s fight), and that is fine. Wind-back is gentle. The push decays by x0.88 per frame, so a full 60 px/s shove carries the Watch about 8 px, and the 240 px/s cap carries it about 33 px. It feels like "it flinched" rather than "I'm kiting it". One detail: because the decay is per frame, the shove travels about 40% farther at 57 fps than at 80 fps (a small phone bonus, leave it). The fix is the Minute Hand (top 5, #2). What to watch once people reach 63.5:
   - survival from 63.5 to 65 among runs that reach 63.5 (aim for 60 to 80%)
   - `hits_taken` while the Watch is alive (aim for 3 to 8)
   - deaths with `boss_alive_at_death = goldWatch`
   - wind-back count per fight
   - share of fight time with hands slowed
   - the phase reached at death
   - Delayed Retirement runs: the Watch arrives at `modeEndAge - 1.5` (68.5, 73.5 or 78.5), not 63.5. That is good, but filter for it in the stats.
3. **Big red gem: leave it (cap 150).** Each merge folds at least 26 gems (over the cap plus `gemMergeBatch` 25) into one gem, and its worth keeps growing. XP per level from `LEVELING`: L9 needs 148, L12 needs 381, L14 needs 703, L16 needs 1291. A 200-gem red gem (x1.0 to 1.5 from XP bonuses) gives at most 1 level after about L11, 2 levels around L8 to L9, and 3 or more only below L7, where 150 gems on the floor is rare. Level-ups queue through `pendingLevels` (one menu after another, the world paused), so pacing bends but nothing breaks. Phones are the likelier place for merges (smaller view and magnet coverage), but nothing in the stats records it yet. Add `big_gem_max_worth` and `levels_from_big_gem` before touching the cap. If it ever spikes, the smallest fix is code-light: cap a red gem's worth at about 1.5x your next level.
4. **9-to-5er: one small nudge is worth it** (+2 max HP, top 5 #4). A starter can be plain, but it should not be the hardest way to learn the game.
5. **Snack Attack: pulling its weight, a little over-tuned in the slow.** HP 2 and damage 1 are fine. Trim the slow duration only (top 5, #5).
6. **Other things that look off:**
   - `goldWatch.killBonusCoins` 35 is paid straight into `runCoins` and `meta.coins` in `clockOut`, skipping `bankMult` 0.5, Side Hustle and Tax coinMult, unlike every other coin. It is fine as a flat retirement gift, but the key name says "kill" and the Watch can't be killed. Rename it later if you like (leave the number).
   - `clockOut` fires `achEvent("bossKill", { kind: "goldWatch" })`, so anyone who reaches 65 with the Watch present gets the boss badge. That is fine with the new design, just know the "boss kill" stats will count it.
   - Unclaimed coins and pizza now vanish after 60 s (`FLOOR_LIMITS`, with a 4 s blink). Pizza is a breakable drop, so 60 s is generous. Coins drop at 6% with magnet pull, so this costs little. The Lounge and dividends are unaffected: leave it.
   - `swarms.js` `INTENSITY.maxOnScreenByAge` and the Watch `swarm` mults look consistent. The Watch pausing Group Chat, Math Homework and Calendar Invite is good: leave it.
   - Not in the files: no stat yet for red gem pickups, wind-back count or time with hands slowed. Those need telemetry, not tuning.

## Leave it

- Healing (`HEALING` cake 18/25/22%, Desk Salad 22%, chance 0.45): leave it. Deaths moved later without anyone reaching 65 cheaply.
- Group Chat numbers and its age-50 debut (first seen at 50.0 on average): leave it.
- V8 (1 death at 60): leave it.
- Gem cap 150 and merge batch 25: leave it, measure first.
- Tax Bracket `heat.js`: leave it (the sample is a few veterans).
- Mortgage rings, Gold Watch alarm (gap 75 deg at 12), gears and hour hand: leave it.
- 60 s coin and pizza despawn: leave it.
