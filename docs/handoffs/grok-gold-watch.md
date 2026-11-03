# Grok brief: The Gold Watch fight numbers (Nov 3, 2026)

**Midlife Survivors: final boss numbers**

Thanks for the difficulty spec. All five changes shipped (V. 1.71.1 to 1.72.0), and the new stats fields are live, including whether a boss was in the room when you died. Next: the numbers for Midlife mode's **final boss, The Gold Watch**.

**The game:** Vampire Survivors-style. You only move; weapons fire on their own. Midlife mode runs from age 40 to 65 at 45 seconds per game year (about 19 minutes). Bosses so far: Performance Review at 45, 30-Year Mortgage at 52, Midlife Crisis V8 at 60. Reaching 65 plays a retirement party (the win). Birthday cake heals at 60 and 65.

**The boss:** a giant gold pocket watch (the retirement gift) that's ticking *down*. The joke is "Time's up." It floats slowly toward the middle of the room. The hands do the damage:
1. **Minute Hand:** a long hand sweeps around the watch like a rotating beam. A faint line and tick marks warn first. You dodge by moving with it or crossing behind it.
2. **Hour Hand:** shorter, thicker, slower. Joins in phase 2.
3. **Alarm:** the bell rings out expanding shockwave rings with a safe gap at 12 o'clock.
4. **Loose Gears:** small gears pop out and bounce around.

Phases by health: **Ticking** (100–60%: minute hand + gears), **Overtime** (60–25%: both hands + alarm), **Last Minute** (under 25%: everything faster, the ticking speeds up). Beating it stops the hands at 5:00 and drops a boss chest.

**For comparison, the current bosses:**

| Boss | Age | HP | Speed | Contact dmg | Attack timing |
|---|---|---|---|---|---|
| Performance Review | 45 | (see enemies.js) | | 2 | charge, telegraph and cooldown in bosses.js |
| 30-Year Mortgage | 52 | 110 | 64 | 2 | 2 rings, telegraph 850 ms, cooldown 5200 ms, rings expand 135 px/s to 260 px, gap 70° |
| Midlife Crisis V8 | 60 | 200 | 118 | 3 | drift loop, telegraph 750 ms, cooldown 4800 ms, first attack after 2200 ms |

Player health and weapon damage at 63 depend on the build. A typical run reaching 60 is about level 20–25 (avg level at death after healing was 12.9 across all ages). Contact damage gets +3 from age 62 (`hitDamageByAge`). The Tax Bracket (0–5) adds difficulty on top.

Current numbers (public repo): enemies https://github.com/ramidaud/midlife-survivors/blob/main/src/data/enemies.js · boss attacks https://github.com/ramidaud/midlife-survivors/blob/main/src/data/bosses.js · healing https://github.com/ramidaud/midlife-survivors/blob/main/src/data/healing.js · Tax Bracket https://github.com/ramidaud/midlife-survivors/blob/main/src/data/heat.js · waves https://github.com/ramidaud/midlife-survivors/blob/main/src/data/swarms.js

**What I need from you:**
1. **Spawn age** (about 63.5?) and **HP**, so a decent build beats it in about 45–60 seconds and a weak build survives to 65 without killing it.
2. **Each attack's numbers:** telegraph ms, cooldown ms, hand length and width in px, sweep speed (deg/s) and sweep angle, ring count, speed, max radius and gap width, gear count, speed and lifetime, damage per hit.
3. **Phase thresholds** and what speeds up in each phase.
4. **Should the normal swarm thin out during the fight** (and by how much), so it's a duel and not another 60–61 wall?
5. **If the watch is still alive at 65:** do you still retire? My proposal: yes (you clocked out), but only beating it earns a keepsake, an achievement and bonus 401(k). Agree, or suggest better.
6. **Tax Bracket scaling** for the fight.
7. **What to watch in the stats** afterward (we now record `boss_alive_at_death`).

Keep it the same style as your last spec: exact numbers, why, and small reversible knobs. Name the file `grok-gold-watch-spec.md`.
