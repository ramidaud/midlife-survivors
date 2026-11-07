# Midlife Survivors: live cutscene storyboards

Written Nov 7, 2026. Story and art handoff only. No game-code or runtime-asset changes.

## Source and production rules

Inspected public GitHub HEAD **`17aedf7fc821e569d59243f8edeb0e859ee8dd07`**, **V. 2.10.13, build 271**. References: `docs/handoffs/chatgpt-live-title-scene.md`; `art/flow-kit/README.md`; `art/flow-kit/backgrounds/README.md` and its contact sheet; `art/flow-kit/key-art/clean/README.md` and its contact sheet; the three boss references and June's reference; `src/data/enemies.js`, `bosses.js`, `modes.js`, and `lore.js`.

The newer live-title handoff takes precedence over the older Flow README's video/panning advice:

- Fixed 1920×1080 PNG plate, transparent **full-canvas** PNG pose frames registered to that plate. Claude crops changed regions and builds strips and `scene.json` later. These are storyboards, not a proposed new runtime format.
- Playback is **8 pose slots per second**. Hold or repeat drawings; do not draw eight new frames every second. No camera moves, tweened cutouts, AI video, blur, new glow, or gradients.
- Characters have fixed floor anchors. Only their local pose changes. Edit the previous frame, preserving face, outfit, scale, and all unchanged pixels. Small bobbing is drawn into the pose, never a traveling sprite.
- Keep the chunky pixel look. Backgrounds use a 640×360 logical grid enlarged 3×; clean cast references use a different 2× grid. Fit and clean references onto the scene's chosen grid once with nearest-neighbor sampling, then register every pose identically. Do not alternate differently scaled source portraits as animation.
- Leave the upper band quiet. Put all essential action in the central composition, with the hero around 35% width and the partner around 60%; keep the hero inside the left 40%. Verify portrait/mobile framing before approving art. The late-night source's exact positions and two existing text items are specific to that scene, not assets to transplant into these six.
- **All lettering is stationary and painted into the plate.** Kit room plates have shapes, not words. Optional captions below are copy suggestions only: choose one before final plate delivery, bake it into a reserved wall/banner area, or omit it. No typing, bouncing letters, changing numbers, new sprite labels, or caption reveal animation. Preserve the bosses' existing chart and percent-badge motifs unchanged.
- Each is a **one-shot**. At its stated end, cut to the already-approved gameplay or results flow. Do not loop a promotion, birthday, or retirement award. Reduced motion can hold the final tableau for the same duration.

### Cast continuity and honest art accounting

**Hero means the active selected hero**, not automatically the 9-to-5er. Use these actual clean references under `art/flow-kit/key-art/clean/`:

| Active hero | Reference | Keep through every pose |
|---|---|---|
| The 9-to-5er (`officeWorker`) | `keyart-9to5er.png` | Glasses, loose tie, orange mug |
| Soccer Dad (`photographer`, legacy internal ID) | `keyart-soccer-dad.png` | Cap, polo, shorts; no invented mug required |
| Grad Student (`gradStudent`) | `keyart-grad-student.png` | Bun, glasses, lavender hoodie, textbook |
| Coldwar Cowboy (`coldWarCowboy`) | `keyart-coldwar-cowboy.png` | Hat, blazer, existing cup |

TJ uses `art/flow-kit/key-art/clean/keyart-tj.png`. June uses `art/flow-kit/coworker-june-from-legal.png`. Boss reference filenames are listed per scene. These are **existing reference illustrations, not ready-made transparent scene frames**. June and the bosses have no clean batch-1 counterparts yet. Do not substitute a different character.

Every budget below conservatively counts **every unique final character pose**, including the neutral reference cutout's cleanup/registration, plus each animated prop/effect drawing. Thus these are upper bounds on new drawings, not claims that the kit already contains the needed poses. Static plate work is listed separately, never hidden in the pose count. Blank/hidden effect slots need no drawing. A held frame costs zero additional art.

Budgets are **per selected hero**. Four-hero totals are also shown; shipping all four variants is not a 12-frame-total job. Reuse identical neutral/react/ready drawings between scenes only where lighting, scale, facing, and registration actually match. No such savings are assumed here. Pose labels below are storyboard shorthand, **not new game character IDs or required asset filenames**.

## Priority: fun added versus art needed

| Rank | Scene | Unique pose/effect budget, one hero / all four | Plate reuse and reason |
|---|---|---:|---|
| 1 | Turning 50 | **7 / 19** | Breakroom day plus tiny cake-table paint-over. The birthday fake-out gives a big laugh at a major milestone without effects. |
| 2 | Performance Review | **7 / 16** | Bullpen day unchanged. A boss trying to look taller is immediately readable and cheap. |
| 3 | Retirement at 65 | **7 / 19** | Retirement Party day plus one inert watch. Largest emotional payoff; no crowd or confetti needed. |
| 4 | Executive Wing at 55 | **6 / 15** | Executive Wing day plus candy dish. Cheapest scene and a warm June callback, though a smaller spectacle. |
| 5 | Midlife Crisis | **9 / 18** | Executive Wing day unchanged. A car revving on the good carpet is terrific, but costs the only separate effect layer. |
| 6 | 30-Year Mortgage | **7 / 16** | Conference day unchanged. Strong silhouette joke, but its paperwork squash needs careful cleanup to avoid wobbling the house. |

All six use existing kit compositions. No entirely new room is needed. Caption-bearing plates, the birthday table/cake, retirement watch, and promotion candy dish are **derived plates still to make**, not existing deliverables.

## 1. Turning 50: “That is not another boss”

**Cue:** Reaching age 50. A birthday vignette, not a new reward or combat event. Current Midlife lore opens Server/Conference rooms at 50; this is a brief breakroom celebration, not a claim that the player teleported there.

**Plate:** `art/flow-kit/backgrounds/bg-breakroom-day.png`. **Derived plate required:** add one small stationary side table between the cast with a cake and two unlit ordinary candles; no numeral, steam, or flame. Preserve the room and its existing shapes. Optional caption is also a plate-only addition.

**Cast:** Active Hero + TJ. Two characters, both visible from the first slot.

**Exact unique poses:**
- Hero **H0**: neutral, looking at the cake, own carried object retained. **H1**: one eyebrow raised, shoulders slightly braced. **H2**: shoulders relaxed, broad closed-mouth smile. **H3**: tiny grateful nod, eyes closed; hands and feet unchanged from H2.
- TJ **T0**: usual mug at chest, free hand resting. **T1**: free hand palm-up toward the cake, proud grin; mug stays level. **T2**: same presentation, eyes closed in a delighted smile. No cup slosh.

| Beat | Duration | Pose slots and action |
|---|---:|---|
| Is this paperwork? | 1.0 s | 8 slots: H0 + T0, held. Cake is already visible. |
| The reveal is a gesture | 1.0 s | 8 slots: H1 + T1, held. Hero briefly treats the occasion with boss-level suspicion. |
| Oh, cake | 2.0 s | 16 slots: H2 + T2, held. Let the relieved smile carry the joke. |
| Accept the nice thing | 2.0 s | First 4 slots H3 + T1; remaining 12 H2 + T0. |

**Total:** 6.0 s, 48 slots. **Handoff:** cut after slot 48, before birthday gameplay resumes; no repeated birthday.

**Art budget:** 4 Hero + 3 TJ + 0 animated props/effects = **7**. Four-hero support: 16 + 3 = **19**. One derived plate; cake/candles/table are static plate art.

**Optional caption:** “Fifty. Still plenty of cake ahead.”

## 2. Boss intro: Midlife Crisis

**Cue:** Actual `midlifeCrisis` introduction, nominally age **60**. Boss queuing can delay it; do not trigger independently at the birthday. This is an anticipation gag, not a tutorial for a new attack.

**Plate:** `art/flow-kit/backgrounds/bg-executive-wing-day.png`, **existing plate reused unchanged** if caption omitted. Current lore explicitly puts the V8 on the good carpet in the Executive Wing/Wellness chapter. No road, skid path, or camera chase added.

**Cast:** Active Hero + The Midlife Crisis. Reference: `art/flow-kit/boss-midlife-crisis.png`, the red convertible with eyes, not a human driver.

**Exact unique poses:**
- Hero **H0**: neutral, looking toward the car. **H1**: raised eyebrow, carried object tucked closer if present; Soccer Dad simply folds his free forearm inward. **H2**: small resigned half-smile, feet planted, ready.
- Car **C0**: reference expression, level chassis. **C1**: chassis compressed one logical pixel above fixed tire contact patches, same face. **C2**: chassis rebounds one logical pixel above C0; wheels remain on their anchors. **C3**: C0 body position with one eyebrow cocked higher. Do not redraw or rotate the car.
- Exhaust **E1**: one tiny chunky puff behind the rear bumper. **E2**: same local area, two broken puff clusters. Both stay below the window line and away from the hero. No gradients or expanding full-screen smoke.

| Beat | Duration | Pose slots and action |
|---|---:|---|
| Nice parking | 1.0 s | 8 slots H0 + C0; exhaust hidden. Car is already parked in frame. |
| Indoor horsepower | 1.0 s | 4 slots H1 + C1 + E1, then 4 H1 + C2 + E2. |
| Still considering it? | 1.0 s | 8 slots H1 + C3; exhaust hidden. Hold the eyebrow exchange. |
| Back to business | 1.0 s | 8 slots H2 + C0; exhaust hidden. |

**Total:** 4.0 s, 32 slots. **Handoff:** hard cut after slot 32 to the existing encounter; preserve its existing attack warnings. No cinematic drift or implied collision.

**Art budget:** 3 Hero + 4 Car + 2 Exhaust = **9**. Four-hero support: 12 + 4 + 2 = **18**. No plate paint-over unless using the caption.

**Optional caption:** “The sensible shoes stay on.”

## 3. Boss intro: Performance Review

**Cue:** Actual `performanceReview` introduction, nominally age **45**, subject to the boss queue.

**Plate:** `art/flow-kit/backgrounds/bg-bullpen-day.png`, **existing plate reused unchanged** if caption omitted. Keep the foreground floor open and chart/monitor markings static.

**Cast:** Active Hero + Performance Review. Reference: `art/flow-kit/boss-performance-review.png`, the walking chart clipboard. The old lore calls it a binder; use the kit's actual clipboard silhouette.

**Exact unique poses:**
- Hero **H0**: neutral attention. **H1**: one eyebrow up, head tipped a logical pixel away, own prop unchanged. **H2**: quiet determined smile, chin level.
- Review **R0**: feet planted, original chart and frown. **R1**: elbows out, fists a little higher, trying to look important. **R2**: one foot raised in place, chart and face identical to R1. **R3**: both feet down, knees compressed one logical pixel; chart remains pixel-identical relative to the clipboard body. No added pointer, stamp, or flying pages.

| Beat | Duration | Pose slots and action |
|---|---:|---|
| Formal introduction | 1.0 s | 8 slots H0 + R0. |
| A very important clipboard | 1.0 s | 8 slots H1 + R1. |
| Make an impression | 1.0 s | 4 slots H1 + R2, then 4 H1 + R3. A small in-place stomp, no floor damage. |
| Not intimidated, much | 1.0 s | 8 slots H2 + R0. |

**Total:** 4.0 s, 32 slots. **Handoff:** cut after slot 32 to the encounter, not directly into a cinematic charge. Existing charge telegraph remains authoritative.

**Art budget:** 3 Hero + 4 Review + 0 animated props/effects = **7**. Four-hero support: 12 + 4 = **16**. No plate paint-over unless caption selected.

**Optional caption:** “You brought experience. They brought a clipboard.”

## 4. Boss intro: 30-Year Mortgage

**Cue:** Actual `mortgageRefinance` introduction, nominally age **52**, subject to the boss queue. Use the displayed 30-Year Mortgage identity, not an invented refinance character.

**Plate:** `art/flow-kit/backgrounds/bg-conference-day.png`, **existing plate reused unchanged** if caption omitted. This matches the current lore's Conference Rooms setting. Characters stand on the open foreground floor, not behind the conference table.

**Cast:** Active Hero + The 30-Year Mortgage. Reference: `art/flow-kit/boss-30-year-mortgage.png`.

**Exact unique poses:**
- Hero **H0**: neutral attention. **H1**: eyes widen slightly, gaze drops to the paperwork stack; hands unchanged. **H2**: eyes level again, small determined smile.
- Mortgage **M0**: feet planted, house and percent badge as reference. **M1**: one big shoe raised without moving its floor anchor. **M2**: both shoes down, paper stack compressed one logical pixel; roof and house remain rigid and identical. **M3**: stack returns to M0 height but one paper corner sticks out farther; house, face, and badge unchanged. That corner belongs to this character pose, not a separate animated sheet.

| Beat | Duration | Pose slots and action |
|---|---:|---|
| A modest amount of paperwork | 1.0 s | 8 slots H0 + M0. |
| The fine print has shoes | 1.0 s | 4 slots H1 + M1, then 4 H1 + M2. |
| There is always one more page | 1.0 s | 8 slots H1 + M3. |
| Read the room | 1.0 s | 8 slots H2 + M0. |

**Total:** 4.0 s, 32 slots. **Handoff:** cut after slot 32 to the existing encounter. Do not draw cinematic interest rings or suggest a new safe-gap rule.

**Art budget:** 3 Hero + 4 Mortgage + 0 animated props/effects = **7**. Four-hero support: 12 + 4 = **16**. No plate paint-over unless caption selected.

**Optional caption:** “Home sweet monthly payment.”

## 5. Executive Wing promotion at 55

**Cue:** Age **55** Executive Wing opening/promotion. Current lore confirms this milestone. Candy is a character joke here, not a second healing payout or a new unlock.

**Plate:** `art/flow-kit/backgrounds/bg-executive-wing-day.png`. **Derived plate required:** add a small amber candy dish on the existing right-side credenza. Keep the geometric founder tribute abstract; do not add a portrait or lettering. Dish position and contents stay fixed. This derived plate can also serve the V8 scene if approved, with its extra detail remaining static.

**Cast:** Active Hero + June from Legal. June's clean batch is pending; retain the lavender cardigan and calm expression from her existing kit reference.

**Exact unique poses:**
- Hero **H0**: neutral, taking in the room. **H1**: small impressed eyebrow lift, body upright. **H2**: relaxed grateful smile, own prop retained.
- June **J0**: neutral with hands down. **J1**: one open palm indicating the room, other hand unchanged. **J2**: same open hand turned toward the candy dish; eyes narrow into a friendly knowing smile. No candy flies or changes hands, so no extra prop layer.

| Beat | Duration | Pose slots and action |
|---|---:|---|
| A little more room | 1.0 s | 8 slots H0 + J0. |
| The grand welcome | 1.0 s | 8 slots H1 + J1. |
| The actual perk | 2.0 s | 16 slots H2 + J2. The gesture redirects attention to the candy. |
| You've earned a breather | 2.0 s | 16 slots H2 + J0. |

**Total:** 6.0 s, 48 slots. **Handoff:** cut after slot 48 to the existing room-opening flow. No forced walk through a new door and no invented promotion bonus.

**Art budget:** 3 Hero + 3 June + 0 animated props/effects = **6**. Four-hero support: 12 + 3 = **15**. One derived plate; candy dish is static plate art.

**Optional caption:** “The title is nice. June knows where the candy is.”

## 6. Retirement at 65: “Your time”

**Cue:** Successful **clock-out at the default Midlife retirement age of 65**, not merely touching age 65 while the player still needs to clock out. Overtime can move retirement later; Full Life continues beyond 65. Do not show this as a forced ending in either case. If reused for delayed Midlife retirement, keep the caption age-neutral. This storyboard does not add or change any retirement mechanic.

**Plate:** `art/flow-kit/backgrounds/bg-retirement-party-day.png`. **Derived plate required:** place one small inert gold keepsake watch on the existing party table, hands fixed at **5:00**, no new numerals or inscription. Existing cake, bunting, balloons, and blank banner remain still. The watch is a prop, not a third character or a defeated Gold Watch boss.

**Cast:** Active Hero + June from Legal. No crowd, enemy cameo, or confetti emitter.

**Exact unique poses:**
- Hero **H0**: neutral, a little braced as if expecting another interruption. **H1**: shoulders drop one logical pixel, eyes soften; own carried object stays secure. **H2**: eyes close for a small contented breath, same relaxed shoulders. **H3**: eyes open, warm smile toward June, chin level.
- June **J0**: calm neutral. **J1**: open palm toward the table/watch, gentle smile. **J2**: hand returned to rest, tiny acknowledging nod, eyes closed. No handshake or watch handoff, avoiding extra contact poses.

| Beat | Duration | Pose slots and action |
|---|---:|---|
| Waiting for the catch | 2.0 s | 16 slots H0 + J0. Let the quiet feel different from combat. |
| No catch | 2.0 s | 16 slots H1 + J1. The watch was already present and stopped. |
| A whole breath | 2.0 s | First 4 slots H2 + J1; next 12 H3 + J2. |
| Yours now | 2.0 s | 16 slots H3 + J0. Finish on a clean, happy tableau. |

**Total:** 8.0 s, 64 slots. **Handoff:** cut after slot 64 to the existing successful-retirement/results flow. No automatic replay or claim that the unkillable Watch was killed.

**Art budget:** 4 Hero + 3 June + 0 animated props/effects = **7**. Four-hero support: 16 + 3 = **19**. One derived plate; watch is static plate art.

**Optional caption:** “Your time is yours.”

## Final production checks and outstanding art

- **Timing verified:** birthday 1+1+2+2=6 s; V8 1+1+1+1=4 s; Review 1+1+1+1=4 s; Mortgage 1+1+1+1=4 s; promotion 1+1+2+2=6 s; retirement 2+2+2+2=8 s. Four beats each. Every duration and sub-hold is a multiple of 0.125 s, with 48/32/32/32/48/64 playback slots respectively.
- **Budgets verified:** 7/9/7/7/6/7 unique pose/effect frames per selected hero. Maximum 9, with no hidden animated lettering, candles, mugs, balloons, charts, rings, or watch hands. Full four-hero art totals exceed 12 per scene and must be planned separately.
- **Existing:** all six chosen room-source PNGs/compositions, four clean hero references, clean TJ reference, June reference, and all three boss references. The older kit files remain references, not finished sprite strips.
- **Still needed:** transparent registered pose art for every scene; June/boss cleanup; two V8 exhaust drawings; three small prop-bearing derived plates; any chosen baked-caption versions. No scene-ready sprites or derived plates are claimed to exist.
- **Format readiness:** no missing room or cast identity blocks the writing. The opaque reference backgrounds, mixed source grids, and pending June/boss clean art do block direct runtime use without an art pass. Do not feed these reference portraits straight into the player.
- For the future art delivery, follow the source handoff: `plate.png`, a `plate-check.png` composite with each first pose, full-canvas transparent numbered PNGs, ordered contact sheet, and changed-pixel notes per layer. A neutral plate-check for a newly composed scene approves its composition; it cannot claim identity with a pre-existing combined source image that does not exist.
- This document proposes presentation only. Ages and queue behavior are source facts; gestures, captions, and shot timings are proposals. No new attacks, damage, rewards, unlocks, or character IDs are specified.
