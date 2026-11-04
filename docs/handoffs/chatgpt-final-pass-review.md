# Final art audit before V2 (Codex, Nov 4, 2026)

The current heroes, interns, portraits, enemy walks, Gold Watch and v3 phone title scenes form a coherent, recognizable cast; keep them.
The largest remaining gaps are the unfriendly retirement goal, assembled coworker bodies, procedural combat/loot art and the unfinished Full Life boss cast.
Fix presentation bugs and export weight separately from drawing jobs: the Art Room currently misrepresents good portraits, and most asset-folder weight is authoring history rather than game downloads.

## Scope and evidence

- Read-only audit. No art, game code, balance, version or published post edits.
- Started from main at `a9f7627`, V. 1.76.2/build 180. Main advanced during the review; pulled through `abc63a3`, V. 1.77.1/build 182, and checked the relevant changes. The new intern duo card and renamed Mandatory Retirement Audit are accounted for below.
- Inspected live gameplay/title/UI, the devlog, About and Art Room; used desktop 1280x800 and phone 390x844 browser viewports. Gameplay URLs used `?nostats=1&dev=1`. No leaderboard score was submitted.
- Played early combat and inspected a dev-jumped age-64 scene with bosses, plus the phone HR Exit Interview. Age jumping creates an artificial boss pileup; it is not evidence about normal encounter balance. This was an art audit, not a full survival, navigation or performance certification.
- Compared the six current hero/intern walk sheets on one native grid, all twelve current On Break portraits, the defeated/mugshot check and the Gold Watch/V8/hero check. Traced runtime texture selection to distinguish active placeholders from intentional fallbacks. Full Life's later bosses were verified in source, not played to age 100.
- File sizes below are logical on-disk sizes, rounded in MiB. Asset totals are not initial page-transfer measurements. Temporary inspection boards stayed outside the repo.

## Top 10, ranked by player benefit

S = small, focused fix; M = a small asset family or several coordinated sheets; L = a substantial new cast/kit. Ranking includes two delivery/presentation jobs that need Claude's integration rather than fresh illustration.

| Rank | Effort | Finding | One-line next job |
|---:|:---:|---|---|
| 1 | M | Retirement still looks like danger | Draw a friendly native clock-out destination with a welcoming idle/arrival loop for Midlife's age-65 goal, visibly distinct from Full Life's Father Time. |
| 2 | M | World coworkers are still assembled from cropped seated art | Draw native seated and standing workplace poses for the six coworkers, including proper legs, chair contact and a short directional pacing loop, at the heroes' pixel scale. |
| 3 | S | Derek's portrait camera looks like a cream box | Complete the already-written `chatgpt-derek-camera.md` camera-only v2 fix, preserving the rest of his portrait pixels and timing. |
| 4 | M | Weapons/VFX belong to the older visual system | Make a coordinated native pixel set for Coffee Splash, Remote, Spreadsheet and Podcast, plus matching Dad Joke/No. impact accents, keeping their gameplay dimensions and warning clarity. |
| 5 | M | Floor loot does not match its polished reward UI | Make readable world chest, gem, pizza, salad and intern delivery-parcel sprites using the bonus-chest and icon palettes, with restrained idle cues. |
| 6 | L | Full Life's three later bosses have borrowed identities | Draw distinct HOA President, Mandatory Retirement Audit and 6 AM Pickleball Champion sheets/telegraphs instead of tinted early-boss drawings. |
| 7 | M | New desk architecture is plainer than nearby native props | Turn the Courtyard Loop's reception, straight/L/standing desks and core partitions into a small modular native kit matching the sofas and prop library. |
| 8 | S | Art Room filters and Spotlight previews misrender | Claude presentation fix: honor hidden cast cards and isolate the Spotlight sprite class from the devlog hero styles; verify desktop and phone without regenerating portraits. |
| 9 | M | Three Midlife bosses lack dedicated killer mugshots | Make four-frame smug 96x96 mugshots for Review, Mortgage and V8, matching the regular killers and Gold Watch. |
| 10 | S | Large opaque illustrations and review history inflate delivery/storage | Prepare visually checked web exports for active opaque illustrations and an archive inventory for retired/source/QA files, preserving native transparent sprite PNGs. |

## Consistency

### C1. The cast now matches; avoid another wholesale redraw

- **What:** The 9-to-5er, Soccer Dad, Grad Student, Ben v3, TJ v2 and Derek v2 share small color clusters, navy silhouettes, warm highlights and readable faces. The On Break cast also belongs together. Ben's brown hair, hat and less eager expression now read; TJ's smile reads; Derek's glasses and orange strap read.
- **Where:** `assets/characters/*-walk-56x60-v2.png`, `cold-war-cowboy-walk-56x60-v3.png`, `intern-*-v2.png`, current `assets/characters/portraits/` and `assets/stage/coworkers/portraits/` sheets.
- **Suggested fix:** Keep these as the production reference. Fix individual props/poses below rather than changing proportions or adding finer realistic shading.

### C2. Shared cell size is working, but coworker construction is a separate problem

- **What:** In the first down-walk frame, hero/intern visible heights are approximately 51-55 native pixels; five end at local y56 and the Grad Student at y54 in that pose. This is not the old oversized-hat/tiny-face problem. Bill's display square is 50.4px and Late Fee's 35px before camera zoom, intentionally keeping Late Fee smaller. The bosses use native 144x152 cells rather than the old 2.3x art multiplier.
- **Where:** `src/world-art.js`, `src/interns.js`, `src/enemy-art.js`, `src/data/enemies.js`, `src/boss-art.js`.
- **Suggested fix:** Preserve current hero/intern scale. Assess planted frames across a full cycle before adjusting the Grad Student; one lifted-foot pose is not proof of floating. Replace the coworker assembly described in P2, not everyone's size.

### C3. Derek's portrait loses his defining object

- **What:** The bright cream rectangle at his chest reads as a box/cup, while his walking sheet has a dark camera and lens. The new V. 1.77.1 duo card gives that mismatch more exposure.
- **Where:** `assets/characters/portraits/intern-derek-on-break-v1.png`; compare `assets/characters/intern-derek-v2.png`.
- **Suggested fix:** Follow `docs/handoffs/chatgpt-derek-camera.md`, already on main. Charcoal body, round highlighted lens, viewfinder and existing orange strap. This audit does not start that separate job.

### C4. Broad cream furniture planes contrast with the textured native kit

- **What:** Reception and workstation surfaces use long flat bands and repeated small monitor/paper shapes, whereas adjacent sofas, round tables, plants and breakables have richer material clusters and more rounded silhouettes. The Lobby desktop view makes the difference particularly clear. The revised loop itself does not need another layout redesign.
- **Where:** `src/start-area.js` functions `workstation` and `partition`; `src/data/start-area.js` office-loop placement data. Compare the current native furniture in `assets/stage/props/`.
- **Suggested fix:** Replace only the rendered furniture surfaces with modular native pieces. Keep footprints, clear aisles, desk variety, coworkers and lighting anchors intact. Add restrained wear and material shading, not all-over texture noise.

### C5. Material outlines are less consistent than character outlines

- **What:** Current character art holds together. The obvious outliers are the curved/gradient procedural reaper and weapons, which use fractional canvas strokes, system-font microtext and colors outside the warm cast palette. Saturated warning colors are useful gameplay signals and are not automatically palette mistakes.
- **Where:** `src/sprites.js` reaper/splash and `src/weapons_extra.js` remote, cell and podcast textures.
- **Suggested fix:** Use native clusters and navy edging on physical objects. Reserve the brightest warning hues for dangerous attacks; don't recolor warnings just to meet a six-color list.

### C6. Ground contact and light direction need a small integration pass

- **What:** Hero and grounded regular enemies explicitly receive contact shadows. Native intern rendering has no equivalent added shadow; its old fallback has one painted in. `BossArt.sync` also adds no contact shadow for the grounded Review/Mortgage/V8. Boss movement flips the complete sheet, including its highlight side. This is a source-confirmed inconsistency, not a request to bake large shadows into every frame.
- **Where:** `src/interns.js`, `src/boss-art.js`; compare `src/world-art.js` and `src/enemy-art.js`.
- **Suggested fix:** Review a shared floor-shadow treatment for grounded actors and a soft floor projection for the floating watch. Keep ghosts/pings ungrounded. If mirrored lighting becomes conspicuous, supply facing-specific boss art later; do not block V2 on subtle mirrored highlights.

### C7. Title art and devlog illustrations are a different scale on purpose

- **What:** The current v3 phone scenes retain normal character proportions and a quiet menu area; Happy 50th is no longer just a tiny party in an empty room. The studio bio and historical devlog imagery are more illustrative than gameplay, but their palette connects them. Historical screenshots legitimately show earlier art.
- **Where:** `src/data/title-art.js` active slides 08-12; `assets/title-screen/slides/*-portrait-v3.jpg`; `devlog/about/`; older memo images and Workshop studies.
- **Suggested fix:** Keep current title compositions and preserve historical post screenshots. Do not convert covers into 56px sprites or treat archived concept art as a live mismatch. No repeat of the portrait stretching fix is needed.

## Placeholders

### P1. The friendly finish line still carries a scythe

- **What:** Midlife uses the `theReaper` finish entity with friendly clock-out messaging, but its texture remains the old hooded, glowing-eyed reaper with a scythe and gradient robe.
- **Where:** `src/sprites.js` texture `theReaper`; `src/main.js` `spawnBoss` and end-age spawning; `src/data/modes.js` Midlife retirement labels.
- **Suggested fix:** A friendly time clock/retirement host or clearly welcoming exit beacon, with readable feet/arrival point. Separate visual selection by mode so Full Life can retain a Father Time identity. This is the strongest remaining tone mismatch.

### P2. Coworkers' world bodies are partially procedural

- **What:** `officePersonTexture` copies a 48x34 upper-body crop into a 54x39 seated or 54x36 standing area, then paints legs/shoes and scene props. Those unequal resampling ratios and generic limbs explain why world coworkers can feel assembled despite their good standing UI portraits.
- **Where:** `src/start-area.js` `officePersonTexture`, worker seats and standing scenes; source identities in `assets/stage/coworkers/coworker-*-v1.png`.
- **Suggested fix:** Author complete native seated/standing sheets with visible chair placement, bent knees and real hand-to-desk contact. Use these identities and the current portraits as references. Preserve footprints and positions.

### P3. World rewards still use the early canvas art

- **What:** The chest on the floor still uses the 34x30 `chest` canvas texture, while opening it uses the new tiered PNGs. Gems, coffee splash, salad and pizza are also active canvas textures. The UI icons are not replacements for these world entities.
- **Where:** `src/sprites.js` textures `chest`, `gem`, `splash`, `salad`, `pizza`; `src/main.js` reward creation; `src/gold-watch.js` chest creation; compare `src/bonus-chest.js` and `assets/ui/bonus/`.
- **Suggested fix:** A compact world-loot sheet with consistent silhouettes, low floor shadows and restrained sparkle. Reuse the approved bonus-chest identity without downscaling the entire popup illustration into an unreadable blob.

### P4. An intern's dropped parcel uses the old person texture

- **What:** `dropParcel` creates a pickup with `intern.key + "_0"`, the procedural intern-person texture made by `texture`, rather than a bag or package. With native interns visible, this fallback can still surface as an odd little person-shaped pickup.
- **Where:** `src/interns.js` `texture`, `spawn`, `dropParcel`. Verified by source; not reproduced as a natural floor drop during this audit.
- **Suggested fix:** Give delivery parcels their own coffee/snack-bag art and texture key. Claude integration change required; keep payload and pickup behavior unchanged.

### P5. Later Full Life bosses have no dedicated art

- **What:** HOA uses `performanceReview` tinted yellow, Mandatory Retirement Audit uses `mortgageRefinance` tinted cyan, and Pickleball Champion uses `midlifeCrisis` tinted green. `BossArt` registers only Review, Mortgage, V8 and Gold Watch, so the later aliases retain their old canvas drawings. A car-shaped pickleball champion is an identity problem, not just a shading difference.
- **Where:** `src/data/enemies.js` `hoaPresident`, `retirementBoss`, `pickleballChamp`; `src/boss-art.js` `FILES`; Full Life schedule in `src/data/modes.js`.
- **Suggested fix:** Three distinct native boss families and matching telegraphs. Include Full Life Father Time in a later dedicated finish-line pass. These are secondary to Midlife's age-65 fix because fewer players see them.

### P6. Not every canvas call is a missing-art bug

- **What:** Hero, regular-enemy, original office and intern placeholder generators remain as fallbacks. Current runtime mapping selects hero v2/Ben v3, intern v2, enemy v2 and the four native bosses. Magenta in an authored sheet is correctly keyed out at load time. The real bonus chest UI is already integrated.
- **Where:** `src/sprites.js`, `src/world-art.js`, `src/enemy-art.js`, `src/art-sheets.js`, `src/bonus-chest.js`.
- **Suggested fix:** Keep working fallbacks. Inventory replacements by active texture path, not by counting `makeCanvasTex` occurrences. Do not schedule another complete hero/enemy batch.

## Animation

### A1. Current hero and enemy motion is present

- **What:** Hero movement uses eight-frame directional walks and idle/fidget states. Interns use eight-frame directions. Spam Likely separates walk/ring frames, Back Twinge follows its existing lunge/rest phases, and 3 AM Thought's visual fade follows the collision-controlled ghost window. These are not missing animation jobs.
- **Where:** `src/world-art.js`, `src/interns.js`, `src/enemy-art.js`; current v2/v3 sheets.
- **Suggested fix:** Retain timings and special frame mappings. Judge special enemies in their actual state machine, not as one continuous eight-frame preview.

### A2. Standing pacing is a sideways flip with in-place gestures

- **What:** `updateStanding` moves people along a route, flips them on return and loops four frames. Those frames come from the assembled workplace sheet, not a full directional walking cycle; pacing can read as sliding while gesturing.
- **Where:** `src/start-area.js` `updateStanding` and `officePersonTexture`.
- **Suggested fix:** Include a short true stride in the coworker job, plus separate stationary conversation/read/phone poses. Keep subtle actions offset so every desk does not move together.

### A3. Boss Spotlight cards bob a still frame

- **What:** Boss sheets have six walk/float frames and attack states, but Spotlight's `.sp-art.boss` only uses frame zero and `spBob`. The Art Room boss cards do expose the sheet poses, so the missing motion is in the presentation, not the supplied art.
- **Where:** `src/spotlight.js`; existing `assets/bosses/boss-*-v1.png`.
- **Suggested fix:** Claude can animate an appropriate existing walk/wind-up range within the card. No new sheet required. Keep the Gold Watch's stopped frame reserved for its victory moment; that frame is already used in `src/gold-watch.js`.

### A4. Boss defeat presentation has a different standard from regular killers

- **What:** The nine regular killer mugshots and Gold Watch have a dedicated four-frame gloat. Review, Mortgage and V8 instead display a static frame from the world boss atlas on the kill screen. The remaining later bosses have no native `bossart_` atlas for that fallback.
- **Where:** `src/ui.js` `KO_MUG`, `koSceneHtml` and `.ko-mug.boss`; `assets/enemies/mugshots/`.
- **Suggested fix:** Make the three Midlife mugshots first; include later killer portraits with their new Full Life art. Match the existing friendly-smug tone, not injury or menace.

## Phone readability

### R1. Keep the current title, icon and death-screen successes

- **What:** At 390x844, the actual Late Fee HR Exit Interview shows a readable seated hero, recognizable killer and legible caption. The scene fits without character overlap. Perk icons, including Reading Glasses, read on navy. Current phone title art has corrected proportions. The longer summary/leaderboard can scroll; it is not an illustration that needs shrinking.
- **Where:** Live title, perk modal and death screen; `src/ui.js`; `assets/ui-icons/`; current v3 title files.
- **Suggested fix:** No broad replacement. Continue checking phone output at 1x rather than approving only enlarged sprite sheets. Preserve the dark screen treatment behind icons and portraits.

### R2. Art Room Spotlight portraits expose multiple rows

- **What:** Reproduced with Lounge opens at 390x844: TJ and Derek each appear twice vertically, with a dark rectangular block. The portrait element computes to 144x320 rather than the intended 144x168. The devlog `.hero` minimum height overrides the sprite element's height; the background is repeating and shows another atlas row. This is an Art Room stylesheet collision, not two characters drawn into the asset. It is separate from the intentional new TJ/Derek duo card.
- **Where:** `devlog/styles.css` `.hero` and phone `min-height:320px`; `src/spotlight.js` `.sp-art.hero`; live `/devlog/art/` Spotlight demo.
- **Suggested fix:** Claude should scope/rename the conflicting class or reset the sprite's inherited box styles, enforce the intended dimensions and disable background repetition. Recheck hero, coworker and Lounge demos at desktop/phone sizes. Do not repaint the sheets.

### R3. Art Room cast filters do not hide the other cards

- **What:** Reproduced: selecting Coworkers updates the chip, but heroes and interns remain visible. Their DOM `hidden` property is true while computed display is still `flex`, because `.cc { display:flex }` overrides hidden presentation. On a phone this turns a six-card filter into a very long misleading list.
- **Where:** `devlog/art/index.html` `.cc` and `filter(g)`.
- **Suggested fix:** Honor `[hidden]` explicitly in the gallery. This is a small presentation fix for Claude, not a new art batch.

### R4. Boss warnings and scenery compete at small size

- **What:** In the dev-jumped phone scene, labels, warning arcs, Spotlight art and patterned rugs compete for attention. Because jumping spawned an artificial set of overlapping encounters, this does not establish that a normal run is too cluttered. Small desk props and floor gags naturally read as texture before their captions are read.
- **Where:** Phone combat; `src/boss-art.js` markers, `src/spotlight.js`, floor decor in `src/data/start-area.js`.
- **Suggested fix:** Validate future VFX against a normal single-boss phone encounter. Keep dangerous edges high contrast, floor wear matte, decorative rugs quieter than attack decals, and long jokes in approach captions. Do not add detail to every open carpet patch.

### R5. Workshop enemy preview shows the retired cycle

- **What:** The Art Room's Enemy review link goes to `assets/enemies/review.html`, which previews/downloads v1 four-frame sheets. That is legitimate history under The Workshop, but its description does not say v1 and there is no adjacent current v2 link. The current Art Room rogues section also omits the Gold Watch mugshot.
- **Where:** `devlog/art/index.html` Workshop links and `MUG` map; `assets/enemies/review-v2.html`; `assets/enemies/mugshots/gold-watch-mugshot-v1.png`.
- **Suggested fix:** Label the historic review and offer the current v2 comparison alongside it; add the existing watch mugshot if the rogues section is meant to be complete. Keep historical studies available.

## File weight

### W1. Separate repository history from player download cost

- **What:** `assets/` contains 1,244 files totaling **311.99 MiB**. Stage is about 134.88 MiB, title-screen 52.45 MiB, enemies 31.70 MiB, characters 17.50 MiB and bosses 14.41 MiB. A filename-based set of 136 source/study PNGs accounts for **180.14 MiB**. These categories describe storage and overlap other directory totals; they are not additive savings or proof that a page downloads everything.
- **Where:** `assets/`, especially high-resolution generation sources and review folders.
- **Suggested fix:** Make a runtime/review/archive manifest before moving anything. Do not bulk-delete v1s or sources from a public URL tree. Historic review links, export scripts and handoffs still use many of them.

### W2. Active opaque illustrations are the useful export targets

| File / set | Approximate size | Status and suggested fix |
|---|---:|---|
| `assets/bio/rami-studio-pixel-v1.png` | 1.74 MiB | Active About image. Trial a lossless WebP or visually checked high-quality JPEG/WebP, retaining the original as master. |
| `devlog/img/05-twins-pixel-v2.png` | 1.92 MiB | Active coffee-post illustration. Same export opportunity; preserve the approved simplified faces and hard edges. No post changes in this audit. |
| Five active `assets/title-screen/slides/*-portrait-v3.jpg` | 0.43-0.91 MiB each | Already JPEG. Do not recompress blindly after the sharpness fix; compare an alternate web format at phone size first. Happy 50th is the largest, about 929 KiB. |
| Native `assets/enemies/enemy-bill-v2.png` | 6.5 KiB | Keep PNG/transparency and exact pixels. Not a worthwhile JPEG target. |
| Native `assets/bosses/boss-gold-watch-v1.png` | 45.6 KiB | Keep PNG and magenta-key contract. Large canvas dimensions do not mean a large file. |

### W3. Exact duplicate retired key art

- **What:** The following pairs are byte-identical: `01-swarm-v1.png` (3.81 MiB), `02-midlife-panorama-v1.png` (3.39 MiB), `03-eight-fifty-nine-lobby-v1.png` (3.04 MiB), each duplicated under both `assets/title-screen/` and `assets/art-direction/`. One set is approximately **10.24 MiB**.
- **Where:** Those two directories; retired slide definitions and old review pages/docs.
- **Suggested fix:** Inventory referring pages, choose one archival master per image and migrate links in a separate cleanup job. They are retired from the active slideshow, not necessarily unused by the site.

### W4. Retired and review-only candidates, listed without deleting

| Candidate | Approximate size | Why it is a candidate / caveat |
|---|---:|---|
| Ten slides 08-12 `*-portrait.jpg` and `*-portrait-v2.jpg` | 5.17 MiB total | Superseded by v3 in active title data. Keep historical comparisons or archive with updated links. |
| `assets/title-screen/qa-v2/` | 24.80 MiB | Guide/check images, not gameplay backgrounds. Keep review evidence separate from runtime delivery. |
| `assets/title-screen/qa-v3/` | 2.30 MiB | Current comparison evidence, not required for the title to render. Retain or archive deliberately. |
| `assets/bio/rami-studio-pixel-v2.png` | 1.57 MiB | Rejected bio variant; About references v1. No current HTML/JS/CSS literal reference found. Docs/history may still need it. |
| `assets/stage/layout-plan/` | 4.87 MiB | Superseded planning options, useful as development history rather than runtime art. |
| `assets/stage/*source*.png`, prop sources, coworker `*-study-v1.png`, enemy `*-source-v1/v2.png`, boss `*-source-*.png`, portrait pose studies | Part of the 180.14 MiB source/study set | Authoring inputs. Presence of an export/review reference does not make them gameplay dependencies, but moving them requires checking those references. |
| 97 GIFs under `assets/` | 6.16 MiB total | Preview/review delivery, not Phaser animation frames. Archive or lazy-load selectively; do not replace sheets with GIFs. |
| `assets/desks/desk-data.js` | 5.24 MiB | Not in production `GAME_FILES`; still loaded by `art-test.html`. Historic high-resolution embedded art, not safe to call globally unused. |
| `assets/art-test/sheet-data.js` | 1.72 MiB | Also still loaded by `art-test.html`. Review-only embedded data. |

### W5. Do not mistake loaded fallback data for dead files

- **What:** Production still lists `assets/characters/character-data.js`, `assets/desks/desk-native-data.js`, `assets/office-environment/environment-data.js` and `assets/stage/start-area/art-data.js`. Together they are about **0.88 MiB**, including 783.5 KiB of start-area art data. The older title background JPEG is also still used by `links/index.html`.
- **Where:** `src/loader.js` `GAME_FILES`; `links/index.html`; dynamic native-sheet paths in the renderers.
- **Suggested fix:** Only investigate removal after dependency/fallback testing. No definitive delete list can be inferred from filename age or a literal-string search alone. This audit leaves every asset intact.

## Suggested sequence after Rami chooses jobs

Start with the friendly clock-out goal and Derek's already-scoped camera correction. Have Claude repair the Art Room display separately so it is trustworthy for approvals. Then review one native coworker/desk vignette at real phone size before expanding those families. Weapons and floor loot are the next broad visual gains; Full Life bosses can follow without reopening the successful hero/title work.
