# Midlife Survivors: Weapon Roles and Balance Pass Handoff

**For:** Claude or Codex implementing in `ramidaud/midlife-survivors`
**From:** Grok (weapon roles pass; follows Rami brief `docs/handoffs/grok-weapon-roles.md`)
**Date:** 2026-11-02 (America/New_York)
**Repo state when written:** V. **1.42.0** ("HR Says Relax"), commit around `e880043`
**Parent docs:** `docs/handoffs/grok-weapon-roles.md` (brief), `docs/handoffs/grok-near-miss.md`, `docs/handoffs/grok-boss-attacks.md`, `docs/handoffs/grok-modifiers.md`
**Do not apply a blind patch.** Re-find symbols by **name**. Line numbers drift. Spec only: no gameplay code in this step.

---

## Context

**Goal:** Give each of the six weapons a distinct job so level-up choices feel honest. Dad Joke and "No." used to overlap as small defensive rings. Claude's V. **1.41.0** punchline pass already pushed Dad Joke into attack territory (damage **2**, flinch **220** ms, soft push **90**). This handoff locks roles for all six, tunes numbers so those roles hold at rank 1 and at max rank, rewrites trap-pick card text, and keeps every change a knob in `src/data/*.js`.

**Why now:** Rami asked how Joke differed from "No." Bills are **HP 3** and early spawns are denser, so a fuzzy "both rings push" kit makes the start swingy and hides trap picks. Midlife runs are about **19 minutes** (40 to 65 at **45** s/year). Power fantasy still belongs in the 60s, not a trivial first five minutes.

**Hard constraints:**

1. Spec only. Do not edit runtime while ChatGPT owns rooms and Claude owns code merges.
2. Every proposed change is a number (or short string) in `src/data/weapons.js`, `src/data/upgrades.js`, and/or `src/data/meta.js`. No new combat systems unless called out. Optional new keys are named below; prefer editing existing keys first.
3. Do **not** change Tax Bracket `perLevel`, Comfort Zone `INTENSITY.dynamic`, Close Call caps, spawn soft-start constants, or boss attack tables as part of this work.
4. Keep Dad Joke as the **offensive crowd pulse** from V. 1.41.0. Do **not** revert to the long freeze or invent a vulnerability multiplier unless playtest proves the attack role fails. (An earlier freeze-plus-vuln sketch is superseded by the brief and by live code.)
5. Keep "No." as the **personal-space / sustain** tool.
6. Voice: warm, never mean. **No em dashes** anywhere in this doc, especially player-facing card text.
7. Version bump when playable (e.g. **V. 1.43.0**), changelog note, ROADMAP tick.

### Code facts to trust (V. 1.42.0)

| Fact | Where | Value / note |
|---|---|---|
| Six weapons | `WEAPONS` in `weapons.js` | Coffee Splash, Dad Joke, TV Remote, Spreadsheet, Podcast at 2x, The Word "No." |
| Dad Joke (live) | `WEAPONS.dadJoke` | `fireEveryMs: 2300`, `radius: 130`, `damage: 2`, `cringeMs: 220`, `pushSpeed: 90`, `blast` visual |
| "No." (live) | `WEAPONS.wordNo` | `fireEveryMs: 3200`, `radius: 140`, `damage: 1`, `pushPx: 95` |
| Louder Groan x4 | `upgrades.js` | each rank: `jokeRadius * 1.25`, `jokeDamage + 1` (no cadence change) |
| Firm Boundaries x4 | `upgrades.js` | each rank: `noRadius * 1.22`, `noPush * 1.3`, `noDamage + 1` |
| Pun Storm | evo | `jokeRadius * 1.45`, `jokeDamage + 2`, `jokeEveryMs * 0.58`; needs Joke rank 2+ and Glasses |
| Healthy Boundaries | evo | `noRadius * 1.4`, `noPush * 1.75`, `noDamage + 2`; heal **+1 every other** pulse (`boundariesPulse % 2`); needs No. rank 2+ and Shoes |
| Bosses | `fireDadJoke` | take damage; **ignore** cringe and push |
| Shove | `shoveEnemy` | stepped push; stops at NAV walls / floor edge (V. 1.39.2) |
| Bill HP | `ENEMIES.bill.hp` | **3** |
| Characters | `meta.js` | Soccer Dad starts Dad Joke (+25% joke radius, +12% speed); Grad Student starts "No." (+magnet, cooldown *0.9) |
| Extra weapons | `weapons_extra.js` | Remote boomerang both ways; Sheet orbit hit window **450** ms; Podcast pierce count; Binge Mode fires **3** angles in code |
| Boss attacks | `BossAttacks` / `bosses.js` | built V. 1.34.0+ |
| Modifiers | `modifiers.js` | **not built** yet (spec queued) |

---

## 1. Roles (one-line pitch + design intent)

| Weapon | Player-facing pitch | Design intent (lane) |
|---|---|---|
| Coffee Splash | "Your everyday aim. Pays Bills one splash at a time." | **Single-target primary DPS** with auto-aim. Baseline TTK setter. |
| Dad Joke | "A punchline blast. Crowd takes the hit; they only flinch." | **Close crowd burst / AoE attack.** Damage first, tiny flinch for readability, almost no shove. |
| The TV Remote | "Thrown out, comes home, clips them twice." | **Mid-range seeker.** Boomerang multi-hit on a timer. |
| Spreadsheet | "Cells orbit you and shred what hugs you." | **Bodyguard blender / area denial at melee.** |
| Podcast at 2x | "A piercing wave the way you are facing." | **Lane clearer.** Forward pierce for packs and hallways. |
| The Word "No." | "Make space. Shove the swarm, keep yourself upright." | **Space-maker / sustain.** Big displace, low damage, heal on evolution. |

**Overlap check after V. 1.41.0:** Joke and No. are both rings, but jobs differ (burst damage vs shove). Remaining risk: Firm Boundaries still stacks **+1 damage per rank**, so max-rank "No." creeps into Joke's DPS lane. Section 3 trims that. Spreadsheet vs Joke both punish point-blank; Sheet is continuous contact, Joke is a pulse. Keep both.

---

## 2. Current vs proposed balance tables

DPS notes use **one target** unless marked AoE. Crowd line assumes N enemies inside the ring or pierce count. Cadence ignores `cooldownMult` / Good Night's Sleep / Exec Delegation unless noted. Math uses integer ms after `Math.round` the same way upgrades do.

### 2.1 Coffee Splash (`WEAPONS.coffeeSplash` + Extra Shot / Dark Roast / Long Pour)

| | Rank 1 (base) CURRENT | Rank 1 PROPOSED | Max ranks CURRENT (4 Extra + 4 Dark + 3 Long, no evo) | Max ranks PROPOSED |
|---|---|---|---|---|
| Cadence | 650 ms | **650** (keep) | Extra Shot: 650*0.82^4 = **294** ms | **294** (keep) |
| Range | 480 | **480** | 480*1.25^3 = **938** | **938** |
| Damage | 1 | **1** | 1+4 = **5** | **5** |
| Single-target DPS | 1/0.65 = **1.54**/s | **1.54** | 5/0.294 = **17.0**/s | **17.0** |
| Control | none | none | none | none |

**Keys:** `fireEveryMs`, `damage`, `range`, `speed` in `weapons.js`. Upgrade multipliers stay in `upgrades.js` (`extraShot` 0.82, `darkRoast` +1, `longPour` 1.25).

**Cold Brew** (evo, separate): still +1 damage, fire *0.78, three angles, pierce **3** hardcoded in `fireCoffee`. Proposed: move pierce to `WEAPONS.coffeeSplash.coldBrewPierce: 3` (new key, same value). Spread half-angle: add `coldBrewSpreadRad: 0.22`.

**Role fit:** Keep as primary. No number change required for the role pass; honesty is in card text (see rewritten text section).

### 2.2 Dad Joke (`WEAPONS.dadJoke` + Louder Groan)

| | Rank 1 CURRENT | Rank 1 PROPOSED | Louder x4 CURRENT | Louder x4 PROPOSED | + Pun Storm CURRENT | + Pun Storm PROPOSED |
|---|---|---|---|---|---|---|
| Cadence | 2300 | **2200** | 2300 (Louder ignores cadence) | 2200*0.92^4 = **1575** | *0.58 from old path = **1334** | round(1575*0.58)=**914** |
| Radius | 130 | **130** | 130*1.25^4 = **317** | 130*1.20^4 = **270** | *1.45 = **460** | *1.45 = **392** |
| Damage | 2 | **2** | 2+4 = **6** | **6** | +2 = **8** | **8** |
| Flinch | 220 ms | **240** | 220 | **240** | 220 | **`cringeMsEvo: 320`** when Pun Storm is on |
| Push | 90 | **70** | 90 | **70** | 90 | **70** |
| Per-target DPS | 2/2.3 = **0.87**/s | 2/2.2 = **0.91**/s | 6/2.3 = **2.61**/s | 6/1.575 = **3.81**/s | 8/1.334 = **6.00**/s | 8/0.914 = **8.75**/s |
| AoE example (5 in ring) | **4.35**/s summed | **4.55** | **13.0** | **19.0** | **30.0** | **43.8** |
| Flinch uptime | 220/2300 = **9.6%** | 240/2200 = **10.9%** | 9.6% | 240/1575 = **15.2%** | 16.5% | 320/914 = **35%** (evo only) |

**Key edits:**

- `weapons.js` `dadJoke.fireEveryMs`: 2300 -> **2200**
- `dadJoke.cringeMs`: 220 -> **240**
- `dadJoke.pushSpeed`: 90 -> **70**
- `dadJoke.cringeMsEvo`: **320** (new; `fireDadJoke` uses it when `stats.punStorm`)
- `upgrades.js` `louderGroan.apply`: radius factor **1.20** (was 1.25); keep +1 damage; add `s.jokeEveryMs = Math.max(1000, Math.round(s.jokeEveryMs * 0.92))`
- Pun Storm apply: keep radius/damage/cadence mults; flinch reads `cringeMsEvo` in `fireDadJoke`

**Soccer Dad** start (`meta.js`): keep `jokeRadius * 1.25`. Update tagline from "aura" to punchline language.

### 2.3 The Word "No." (`WEAPONS.wordNo` + Firm Boundaries)

| | Rank 1 CURRENT | Rank 1 PROPOSED | Firm x4 CURRENT | Firm x4 PROPOSED | + Healthy Boundaries CURRENT | + Healthy PROPOSED |
|---|---|---|---|---|---|---|
| Cadence | 3200 | **3200** | 3200 | **3200** | 3200 | **3200** |
| Radius | 140 | **140** | 140*1.22^4 = **310** | **310** | *1.4 = **434** | **434** |
| Push | 95 | **110** | 95*1.3^4 = **271** | 110*1.35^4 = **366** | *1.75 = **474** | *1.75 then cap **`noPushCap: 520`** |
| Damage | 1 | **1** | 1+4 = **5** | 1+2 = **3** (dmg only on ranks 2 and 4) | +2 = **7** | +2 = **5** |
| Heal | none | none | none | none | +1 every other pulse (~6.4 s) | same via `healthyHealEvery: 2`, `healthyHealAmt: 1` |
| Per-target DPS | 0.31/s | 0.31/s | 1.56/s | 0.94/s | 2.19/s | 1.56/s |

**Key edits:**

- `weapons.js` `wordNo.pushPx`: 95 -> **110**
- add `noPushCap: 520`, `healthyHealEvery: 2`, `healthyHealAmt: 1`
- `firmBoundaries.apply`: radius *1.22; push *1.35; `if (rank === 2 || rank === 4) noDamage += 1`
- `fireWordNo`: heal and push cap read the new keys

### 2.4 The TV Remote (`WEAPONS.remote` + Universal Remote)

| | Rank 1 CURRENT = PROPOSED | Max Universal CURRENT = PROPOSED | + Smart TV |
|---|---|---|---|
| Cadence | 1900 | 1900 | *0.7 = **1330** |
| Range | 300 | 300*1.15^4 = **526** | 526 |
| Damage | 2 | 2+4 = **6** | +2 = **8** |
| Count | 1 | 3 (adds on ranks 2 and 4) | max(count,3) = **3** |
| Rough DPS / remote (2 hits if both ways connect) | 2*2/1.9 = **2.11**/s | 2*6/1.9 = **6.32**/s | 2*8/1.33 = **12.0**/s per remote |

**Optional anti-trap:** on Universal ranks **1 and 3**, also `remoteEveryMs = Math.round(remoteEveryMs * 0.95)`.

### 2.5 Spreadsheet (`WEAPONS.spreadsheet` + More Columns)

| | Rank 1 CURRENT = PROPOSED | More Columns x4 | + Pivot Table |
|---|---|---|---|
| Cells | 2 | 6 | max 8 |
| Orbit radius | 78 | 78*1.1^4 = **114** | *1.2 = **137** |
| Damage | 1 | 5 | 7 |
| Spin | 3.2 rad/s proposed **3.4** | 3.4 | 3.4 |
| Hit window | 450 ms | same | same |
| Rough DPS / cell if glued | ~1/0.45 = **2.2**/s | **11.1**/s | **15.6**/s |

**Keys:** `spinPerSec` 3.2 -> **3.4**. Optional `hitWindowMs: 450` moved from magic number in `weapons_extra.js`.

### 2.6 Podcast at 2x (`WEAPONS.podcast` + Playback Speed)

| | Rank 1 CURRENT = PROPOSED | Playback x4 | + Binge Mode |
|---|---|---|---|
| Cadence | 1400 | 1400*0.85^4 = **731** | 731 |
| Damage | 2 | 6 | 7 |
| Pierce | 3 | 7 | *2 = **14** |
| Waves | 1 | 1 | **3** angles (already in code) |
| Life / speed | 1300 ms / 480 | same | same |
| Rough DPS if pierce fills | up to 3*2/1.4 = **4.3**/s | 7*6/0.731 = **57**/s theoretical | x3 waves (per-wave pierce) |

**Proposed:** card text honesty; add `bingeSpreadRad: 0.3` matching code. No cadence change.

---

## 3. Evolutions (all six)

| Evolution | Unlock | Current effect | Fits new role? | Proposed |
|---|---|---|---|---|
| Cold Brew Concentrate | Coffee rank 2+ and Sleep | 3 piercing shots, +1 dmg, fire *0.78 | Yes (primary becomes spray) | Expose `coldBrewPierce` / `coldBrewSpreadRad`. Text already good. |
| Unhinged Pun Storm | Joke rank 2+ and Glasses | Giant faster ring, +2 dmg | Yes (attack payoff) | Keep mults; add evo flinch **320** ms via `cringeMsEvo`. Rewrite text to say blast, not a stun build. |
| Healthy Boundaries | No. rank 2+ and Shoes | Bigger shove, +2 dmg, heal every other pulse | Yes (sustain payoff) | Cap push; heal keys; text must say **every other** pulse. |
| Smart TV | Remote rank 2+ and Shoes | 3 remotes, +2 dmg, *0.7 cadence | Yes | Keep. Optional odd-rank Universal cadence crumb. |
| Pivot Table | Sheet rank 2+ and Glasses | 8 cells, +2 dmg, radius *1.2 | Yes | Keep. |
| Binge Mode | Podcast rank 2+ and Sleep | 3 waves, pierce *2, +1 dmg | Yes | Keep. Card text already matches code. |

Unlock `when` predicates stay as they are.

---

## 4. Dad Joke numbers check (post V. 1.41.0)

**Question from the brief:** is 2 damage every 2.3 s in a 130 px circle right for an attack weapon at ages 40 to 45?

**Findings:**

1. **TTK vs Bill HP 3:** one pulse leaves a Bill at 1 HP. Coffee (1.54 DPS) finishes it. Healthy: Joke is crowd tax, not a replacement primary. Keep damage **2** at rank 1.
2. **Old 28% uptime math is obsolete.** That was `650/2300`. Live flinch uptime is **~10%**. That matches "flinch, not freeze." Proposed **240/2200 ~ 11%**. Pun Storm may rise to ~35% flinch uptime as the evo fantasy, still not a perma-stun.
3. **Push vs freeze:** `pushSpeed` 90 (proposed **70**) is a stagger, not a relocate. `shoveEnemy` on "No." owns real displacement. Soft Joke push should not fling enemies out of Coffee aim.
4. **Interaction with "No.":** If both fire, No. shove can move a flinching enemy. Acceptable: space-maker wins displacement. Do not chain Joke push upward again.
5. **Bosses:** Still ignore flinch/push; take full `jokeDamage`. Correct for Performance Review / Mortgage / V8 readability.
6. **Phone readability:** Punchline blast VFX sell the attack. Flinch at 220 can be easy to miss in a swarm; **240** plus the blast is enough. Do not return to 650.
7. **Louder Groan:** Scaling only radius and damage made late Joke a silent nuke on a slow timer. Adding **0.92 cadence per rank** makes "louder" mean more punchlines. Radius factor **1.20** (was 1.25) keeps the ring from covering half the phone before Pun Storm.
8. **Ages 40 to 45:** With denser packs and HP 3, AoE 2 every 2.2 s is meaningful without deleting the soft start. Do not buff rank-1 damage to 3.

**Recommendation:** adopt the proposed Joke table. Skip `cringeVulnMult` unless a later playtest shows Joke damage still feels invisible next to Coffee. The brief's attack direction wins over the older freeze-plus-vuln sketch.

---

## 5. Trap-pick list (and fixes)

| Card / pattern | Why it traps | Fix numbers | Honest level-up text |
|---|---|---|---|
| Firm Boundaries as a damage stack | Card reads like a DPS ring; stacks to +4 dmg and shadows Dad Joke | Dmg only on ranks 2 and 4; push *1.35; base pushPx 110 | '"No." reaches farther and shoves harder. Ranks 2 and 4 also add +1 damage.' |
| Louder Groan sold as crowd control | Players still remember the long stun; cadence never improved | Cadence *0.92 per rank; radius *1.20; +1 dmg | "Dad Joke blasts 8% sooner, hits a wider crowd, and deals +1 damage." |
| Long Pour without Dark Roast | Extra range does not fix 3-HP Bills; looks safe, slow TTK stays | No number change; text honesty | "Coffee flies 25% farther. Same strength; better reach." |
| Unlock "No." only for damage | After Joke exists, taking No. for chips is weak; its job is space | pushPx 110; Firm damage trim | "A teal shockwave that shoves enemies back. Light damage, real space." |
| Podcast while standing still | Waves use last facing; camping shoots a dead lane | No number change; text | "Fires the way you are facing and passes through crowds. Keep moving to aim." |
| Universal Remote ranks 1 and 3 | Feel like filler beside ranks that add remotes | Optional `remoteEveryMs * 0.95` on ranks 1 and 3 | "Remote deals +1 damage and flies 15% farther. Ranks 2 and 4 throw an extra remote. Odd ranks also throw a bit sooner." |
| Reading Glasses under early swarm pressure | Magnet is not survival; easy to greed | No combat nerf; tip via text | "Gems and coins pull in from 35% farther. Nice quality of life, not a shield." |
| Dual-max Joke damage and No. damage | Two AoE DPS rings | No. damage trim above | (covered by Firm text) |

---

## 6. Rewritten player-facing text (no em dashes)

Apply these `text` / tagline strings in `upgrades.js` / `meta.js`:

- `unlockJoke`: "A punchline blast hits everything around you every couple of seconds."
- `louderGroan`: "Dad Joke blasts 8% sooner, hits a wider crowd, and deals +1 damage."
- `unlockNo`: "A teal shockwave that shoves enemies back. Light damage, real space."
- `firmBoundaries`: '"No." reaches farther and shoves harder. Ranks 2 and 4 also add +1 damage.'
- `longPour`: "Coffee flies 25% farther. Same strength; better reach."
- `unlockPodcast`: "Fires the way you are facing and passes through crowds. Keep moving to aim."
- `universalRemote`: "Remote deals +1 damage and flies 15% farther. Ranks 2 and 4 throw an extra remote." (add odd-rank clause if cadence crumb ships)
- `evoPunStorm`: "Dad Joke Lv 2+ and Glasses: huge rapid punchline blasts, +2 damage, longer flinch."
- `evoBoundaries`: '"No." Lv 2+ and Shoes: much bigger shove, +2 damage, and heal +1 HP on every other pulse.'
- Soccer Dad `tagline`: "Starts with Dad Joke punchline blast, 25% wider blast, and faster feet."
- Grad Student `tagline`: 'Starts with "No." shockwave, a huge gem magnet, and slightly faster weapons.'

Keep other card strings unless they gain an em dash in editing.

---

## 7. Interactions

### Close Calls
Joke flinch and No. shove can create separation that helps or spoils a graze. Do **not** special-case NearMiss. Soft Joke push (70) reduces accidental flings out of the band. Caps unchanged.

### Tax Bracket
Higher enemy HP makes AoE pulse weapons feel better and single-target worse until ranks land. Do not multiply weapon damage by tax. Players pay with build choices; heat already pays coins/XP.

### Bosses / boss attacks
Bosses ignore Joke flinch/push. Weapon roles still apply chips during telegraphs. Do not stun through Performance Review charge or V8 drift. Healthy Boundaries heal remains player-side only.

### Age-50+ modifiers (when built)
Reply-All Tax temporarily buffing Joke radius/push should honor the **attack** identity (radius yes, push stay modest). Back Spasm slowing the player makes Podcast facing and Remote aim more important; no weapon table change here. Reading Glasses **modifier** (magnet shrink) is different from the Reading Glasses **passive** card; keep names distinct in UI copy when modifiers land.

---

## 8. Acceptance tests

1. Rank-1 Dad Joke deals **2** to each non-ghost enemy in radius and applies flinch about **240** ms; bosses take damage only.
2. Rank-1 "No." push distance is about **110** before walls; damage **1**.
3. After four Louder Groan ranks from a clean Joke unlock, cadence is **1575** ms (+/-1 from rounding), radius **270**, damage **6**.
4. After four Firm Boundaries ranks, damage is **3** (not 5); push is higher than today's 271.
5. Pun Storm flinch uses **320** ms; Healthy Boundaries heal triggers on even `boundariesPulse` only.
6. Binge Mode still spawns three podcast images.
7. Card strings in the rewritten text section contain no em dash characters (`rg` for unicode dashes on `src/data/upgrades.js` and `src/data/meta.js`).
8. Soccer Dad still starts with Joke; Grad Student with No.

---

## 9. Playtest checklist (estimates labeled)

- [ ] Ages 40 to 45 as 9-to-5er: Coffee alone still clears early Bills; first Joke unlock feels like a crowd tax, not a second shove. (estimate: deaths to contact drop about 10 to 20% after Joke unlock, not a trivial stroll)
- [ ] Soccer Dad: punchline readable on phone; flinch visible in a 5-Bill clump. (estimate: players describe it as "damage" not "stun")
- [ ] Grad Student: "No." creates walkable holes; not a DPS race with Joke. (estimate: shove used before heal evo)
- [ ] Max Louder vs max Firm in the same run: Joke clearly leads AoE damage; No. clearly leads displacement. (estimate: No. kill share under 25% of Joke)
- [ ] Pun Storm + Cold Brew at about age 60: power fantasy without deleting Mortgage telegraph readability.
- [ ] Tax 3: roles still hold; no need for weapon heat multipliers.
- [ ] Trap cards: Long Pour text stops "I thought this hit harder" comments. (estimate: qualitative)

---

## 10. Risks and open questions

1. **Pun Storm cadence ~914 ms with 8 damage** may be too strong in Midlife 60s after this Louder cadence buff. If so, raise Pun Storm factor from 0.58 to **0.64** before shipping.
2. **noPushCap 520** may feel low after Healthy *1.75 on the new Firm curve; tune cap after one phone session.
3. **Hardcoded Cold Brew pierce / Binge spread / Sheet hit window** should move into `weapons.js` when touched; values stay the same.
4. **Character tagline "aura"** is stale on origin; update with this pass.
5. **Vulnerability multiplier** intentionally deferred; revisit only if Joke damage still feels invisible.
6. Brief asked whether Louder should scale damage faster: **no** (+1 per rank stays); scale **cadence** instead so the attack role breathes.

---

## 11. Implementation sketch (for Claude, not a patch)

1. Edit `src/data/weapons.js` numbers and new keys listed above.
2. Edit `src/data/upgrades.js` applies + `text` fields; `meta.js` taglines.
3. Tiny read-site updates in `fireDadJoke` / `fireWordNo` / `weapons_extra.js` only where new keys are read (cringe evo, heal every, push cap, optional hitWindowMs).
4. Do not retune spawns, heat, or bosses here.
5. Playtest on phone Tax 0 and Tax 3.

**Done when:** Each weapon has a sentence players can repeat, Joke and No. no longer compete for the same job, card text matches the math, and Rami clears one Midlife run on Soccer Dad and one on Grad Student.
