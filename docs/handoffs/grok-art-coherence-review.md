# Midlife Survivors: Art Coherence Review

For Rami. Review only. No code was changed for this pass. Repo checked at V1.43.0. Screenshots and this note live under `/workspace/midlife/` (outside the git repo).

Style guide anchors used: navy `#171C35`, teal `#3E7775`, cream `#F2D7A1`, coffee orange `#EF9347`, 1px outline, upper-left light.

Contact sheet: `/workspace/midlife/art-review/contact-sheet.png`

---

## Honest overall verdict

Your worry is fair, and it is mostly about **stage identity**, not about whether the office art is good. The Corporate Campus, title key art, hero walk sheets, and enemy cast are already a strong, readable office comedy look that mostly follows the style guide. What does not hold yet is the promised life journey. Hospital, Home, Social, and Senior are real data chapters (names, floor tint numbers, enemy label swaps), but in normal play the world stays the same office campus, so the stages do not read as different places. That gap between the roadmap story and what the eye sees is the coherence problem.

---

## What I looked at

- `assets/art-direction/STYLE_GUIDE.md` and key art (`office-key-art-v1`, lobby, swarm, panorama)
- `src/data/stages.js` (office, hospital, home, social, senior)
- World art / start-area campus, procedural floor in `sprites.js`, `view3d.js` (3D parked)
- Live captures via local `http.server` + headless Chromium (Phaser camera snapshots + full-page HUD shots)
- Art Study page `art-test.html`

### Capture notes

| Shot | Path |
| --- | --- |
| Title | `art-review/00-title-landing.png` |
| Art Test campus | `art-review/01-art-test-campus.png` |
| Office campus in play | `art-review/20-stage-office-campus.png` |
| Play + HUD | `art-review/41-play-hud-fullpage.png` |
| Level-up | `art-review/42-levelup-or-play-fullpage.png` |
| Forced stage label variants | `art-review/30-stage-*-nocampus.png` |
| Contact sheet | `art-review/contact-sheet.png` |
| Key art refs | `art-review/refs/` |

**Could not capture as distinct environments:** Hospital, Home, Social, and Senior as unique rooms. With Corporate Campus active, `main.js` forces `STAGES[0]` (office). Even when stage data was forced for labels (CO-PAY, TUITION, LEGO!, etc.), the floor plan stayed Central Atrium / campus props. **3D / Diablo view modes** were not captured: `ENABLE_3D_VIEWS = false` (parked Oct 30). Fallback procedural-only office without campus was attempted; campus art still dominated the forced-stage frames we kept.

---

## What is working

1. **Office key art and title screen are on-model.** Navy / cream / teal / coffee orange, upper-left light, tired hero with the mug as the orange accent. Title underlay and key art feel like the same photographer’s set.
2. **Hero and enemy pixel cast read well.** 1px navy outlines, chunky silhouettes, coffee mug as the focal accent. Bills, spam phones, donuts, and late fees stay funny and readable on the cream campus floor (see `41-play-hud-fullpage.png`).
3. **Campus prop kit is coherent with itself.** Reception “PLEASE WAIT”, Values wall, teal sofas, wilted plants, CRT desks share material language with the style guide.
4. **UI chrome matches the brand.** Level-up “HR Benefits Dept” card (`42-levelup-or-play-fullpage.png`) uses navy panels, cream type, orange CTAs. It feels like the same company as the title memo.
5. **Art Test / Campus preview is the right process.** `art-test.html` already treats the campus as a study before production replacement. That is the right place to keep clamping palette and scale.

---

## Top issues (by impact)

### 1. Life stages are a story in data, not a place on screen (highest impact)

`stages.js` promises five chapters: Open-Plan Office, St. Deductible Hospital, Suburban Home, Social Courtyard, Sunset Palms. In play, Corporate Campus locks the active stage to office (`main.js` around the `startArea ? STAGES[0]` branch). Floor tints for hospital/home/social/senior exist, but they only apply on the old procedural floor path, which campus replaces.

Evidence: `30-stage-home-nocampus.png` still shows **CENTRAL ATRIUM**, soccer goal, office posters, while enemy labels say **TUITION / LEGO! / SCHOOL**. Same room, different nametags. Stages do not read as a life journey. They read as one office with witty rename stickers.

### 2. Rendering styles are mixed without a shared “finish”

In one frame you get:

- Hand pixel props and characters (campus desks, hero, enemies)
- Procedural / vector floors and big flat rugs (“WELCOME” teal slab, atrium carpet)
- DOM HUD with clean sans UI type and emoji badges (coffee cup avatar, perk chips)
- Level-up cards that mix pixel icons (TV Remote, stethoscope) with a flat geometric “No.” stop sign

Evidence: `20-stage-office-campus.png` and `42-levelup-or-play-fullpage.png`. None of these are bad alone. Together they feel like three decks shuffled into one hand.

### 3. Stage floor colors drift from the style guide family

Stage primary floors in data (`#242c4c`, `#233d47`, `#3d2e22`, `#38243d`, `#473228`) are darker, cooler/browner cousins of navy, not the cream / teal campus floors players actually see. Sampled play frames are dominated by warm cream wood (`#CCB484` range) and teal rugs, which *do* sit near the guide, while the unused stage primaries would push each chapter into a different temperature without sharing the cream/teal “Midlife” spine.

Also: campus wood floors are lighter and higher contrast than the guide’s “low contrast floor texture” note. Fine for readability; slightly loud next to key art’s navy tile mood.

### 4. Scale and density wobble between hero, furniture, and floor

Hero sits in a 56x60-ish family. Desks and reception pieces are large story props. Enemies are smaller iconic props with floating text labels. Floor tile scale on campus wood reads finer than the 32px placement grid described in the guide. In atrium shots the hero can look a bit small against desks and a bit large against Bills, depending on the cluster (`41-play-hud-fullpage.png`). Not broken, but not locked.

### 5. Key art promises a denser, moodier office than the live campus

`refs/office-key-art.png` is navy cubicle canyons, CRT stacks, printer vomit, chase energy. Live campus is a brighter atrium with sparse landmark props and a lot of open cream floor. Same cast, different set lighting. Players who love the share image may feel the in-game office is a quieter, emptier cousin.

---

## Other coherence notes (lower rank)

- **Outline / lighting:** Pixel cast is mostly consistent (upper-left, 1px navy). Flat UI slabs and procedural rugs skip that finish.
- **Emoji:** Heavy in UI and stage *names* (building emoji in `stages.js`, coffee emoji in HUD/title). World combat sprites are mostly real pixel art now, which is good. Emoji is the UI accent layer, not the enemy layer.
- **Transitions:** Age gates open campus districts (promotions), but there is no art “chapter card” or palette shift when life stage would change. Soft gameplay transition, zero scenic transition.
- **Readability:** Hero and enemies are generally fine on cream floors. Watch teal rug + teal sofa stacking (hero can sink a bit). Dark navy void outside the cross hallways frames the playable floor well.
- **3D modes:** Parked. Good call until 2D stage identity is solved; bringing them back now would multiply the mix-of-styles problem.

---

## Prioritized fix plan

Keep changes tunable in data where you already do (stage records, tint tables, prop kits). Funny and warm, never mean.

### Quick wins (days)

1. **Palette clamp table in data.** One shared Midlife spine: navy, teal, cream, coffee orange. Per stage: spine + **one** accent only (hospital = cold monitor cyan, home = warm oak, social = wine/lavender, senior = terracotta). Drive floor tint, rug, and fog from that table. Kill one-off hexes that leave the family.
2. **Shared floor and lighting treatment.** Whether campus or fallback, apply the same low-contrast floor recipe and upper-left light / SE stepped shadow helper so every chapter shares a finish. Campus wood: slightly desaturate toward khaki/cream guide values.
3. **Outline pass on non-pixel layers.** Flat rugs, WELCOME slabs, and geometric weapon icons either get a 1px navy edge treatment or are replaced with pixel frames so they match props.
4. **Replace remaining emoji focal points in combat-adjacent UI** with the tiny pixel icons you already have for weapons/perks (keep emoji only in toast/joke copy if you want the laugh).

### Medium (a per-stage kit with shared rules)

For each stage, ship a **kit** in data:

- `basePalette` (spine)
- `accent` (one hue)
- `signatureProps[3]` (hospital: triage desk, bassinet, waiting chairs; home: couch, LEGO spill, homework table; social: bistro table, patio heater, group-chat phone plinth; senior: pickleball net, early-bird buffet, HOA notice)
- `labelSet` (already exists)
- `floorRecipe` (tile + rug)

Rule of thumb: **same camera, same outline, same hero scale; only accent + three props + labels change.** That is enough for a photographer’s eye to read “new chapter” without building five full campuses.

Also: stop forcing `STAGES[0]` forever once a kit exists, or show a short “chapter title card” over the same campus when age crosses unlocks so the journey is felt even before full art lands.

### Longer-term

1. True chapter maps (or modular wings) for hospital / home / social / senior that reuse the campus pipeline (districts, gates, prop atlas).
2. Bring key-art density into the starting bullpen (more cubicle repetition, darker navy floors in work zones, keep atrium as the bright “breathing room”).
3. Only then revisit 3D / Diablo view modes, reusing the same stage kits so perspective changes do not invent a second art language.
4. Automated art lint: screenshot sample dominant colors per stage vs the clamp table (you already have Art Test; extend it).

---

## Suggested first three fixes (if you only do three)

1. **Admit on-screen that stages are chapters, then show it:** chapter title card + accent wash at unlock ages, fed from `stages.js`.
2. **Per-stage kit data** (spine + one accent + three signature props) and swap props/labels/tint together.
3. **Floor/lighting unify pass** so campus and any fallback share one finish; clamp wood cream toward the guide.

---

## Paths for the parent report

Most telling shots:

- `/workspace/midlife/art-review/contact-sheet.png`
- `/workspace/midlife/art-review/41-play-hud-fullpage.png` (live campus + HUD + enemies)
- `/workspace/midlife/art-review/30-stage-home-nocampus.png` (same atrium, home labels: proof stages are nametags today)
- `/workspace/midlife/art-review/42-levelup-or-play-fullpage.png` (UI vs world)
- `/workspace/midlife/art-review/refs/office-key-art.png` (key art vs in-game density)

This review file: `/workspace/midlife/Midlife_Survivors_Art_Coherence_Review.md`
