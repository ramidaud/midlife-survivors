# ChatGPT changes

Newest at the bottom. Rami pastes ChatGPT's change-log blocks here. Claude reads this at the start of each session and folds approved items into the game, then marks them **[done]**.

---

## 2026-11-01: Batch 1 reference, Bill walking sheet (Codex / ChatGPT) [done]
- What: first enemy review asset only, an angry cream Bill with four walking poses and subtle paper flutter. Batch 1 remains in progress.
- Files: `assets/enemies/enemy-bill-v1.png`, `enemy-bill-v1-prompt.txt`, `enemy-bill-source-v1.png`, `enemy-bill-preview-v1.gif`; export script and README alongside.
- For the game: proposed replacement for the existing regular Bill enemy; not integrated or approved yet.
- Frame size and count: 48x48, four frames, one row (192x48 native PNG), pure opaque magenta. Preview GIF is 4x at 180ms per frame.
- Notes or open questions for Claude or Rami: review expression and waddle before extending the batch. Pixel QA passed dimensions, four distinct poses, shared baseline, padding, opacity, palette and navy silhouette outline. Frame 3 was corrected to the opposite foot stride. Claude should preview in Art Room before production replacement; hitbox and balance remain unchanged.

## 2026-11-01: Studio bio portrait replacement (Codex) [done]
- What: generated a game-style pixel-art version of Rami's supplied studio photograph and replaced the About image as requested.
- Files: `assets/bio/rami-studio-pixel-v1.png`, matching `-prompt.txt`, `studio-about-preview.jpg`; updated `devlog/about/index.html` and devlog README.
- For the site: About lead portrait and social previews. Not a playable-character asset. Source photograph remains outside the repository; older portrait remains intact.
- Image size: 1536x1024, one horizontal illustration, full background.
- Notes: inspected generated art, verified image loading and metadata, and checked desktop/phone layout and browser logs. No devlog post content changed, so share-page/RSS regeneration was not needed.

## 2026-11-01: Bio portrait style refinement (Codex) [done]
- What: Rami requested a stronger game-art treatment. Generated v2 using the first portrait as edit target and office key art as style reference, simplifying shapes, lighting and details.
- Files: `assets/bio/rami-studio-pixel-v2.png`, `rami-studio-pixel-v2-prompt.txt`, `studio-about-preview-v2.jpg`; About and devlog README reference v2.
- For the site: creator bio lead and social previews, 1536x1024. Older artwork retained. Desktop/phone fit, image references and browser logs checked; no gameplay changes.

## 2026-11-01: Restore preferred bio, return to visual pass (Codex) [done]
- Restored the first studio portrait on About and in social-preview metadata at Rami's request. V2 remains archived.
- Batch 1 inventory checked: Bill native sheet and preview exist. Next is Late Fee; the other eight enemy species plus Group Chat ping are still ungenerated. No new enemy assets integrated.

## 2026-11-01: Clocking Out brand mark (Codex) [done]
- What: Rami chose concept 02 after rejecting the boxed orange MS identity. Added native pixel-clock SVG/PNGs, root favicon and touch icon; updated devlog headers and static-page template.
- Files: `assets/branding/`, root icon PNGs, favicon links in game/preview/devlog pages, `devlog/styles.css`, `devlog/scripts/build_devlog.py`.
- QA: checked native sizes, pixel/alpha integrity, desktop/phone header layout, references and browser logs. Published post bodies preserved exactly; builder's existing minimal Markdown fallback needs care when rebuilding without Markdown support.
- Next: Late Fee sprite sheet. Branding selection is complete; no gameplay changes.

## 2026-11-01: Batch 1 enemies complete for visual review (Codex / ChatGPT) [done]
- What: finished the remaining nine enemy species and Group Chat ping, retaining Bill. Eleven sheets, 42 distinct native frames, full prompts, generated sources and animated previews saved. This supersedes the earlier Bill-only batch status.
- Files: `assets/enemies/`, especially `batch-1.json`, `README.md`, `review.html`, `enemy-batch-1-native.zip` and `enemy-batch-1-overview.gif`. Canonical filename pattern is `enemy-<id>-v1.png`; exact IDs and timing live in the manifest. Art Room links to review.
- For the game: art generation complete; awaiting Rami's visual review before Art Room combat preview and main-game replacement. No runtime enemy renderer, hitbox, spawn, damage or attack values changed.
- Frame sizes and count: nine species at 48x48 x4, Late Fee at 32x32 x4, ping at 16x16 x2. Single rows, exact magenta, hard palette pixels. GIFs are preview only.
- Notes for Claude or Rami: see README for animation states, origins and contact shadows. Calendar's third stride was corrected; Late Fee's sampling jitter fixed; ghost fades through pixel gaps; Donut airborne phases rise two pixels. PNG QA passed dimensions, opacity, palette, margins, unique poses, baseline/outline checks and fade ordering. Browser review passed desktop/390px phone, pose/pause/scale/floor controls and clean logs. Next generation batch is bosses, after enemy feedback. V. 1.28.10, build 66.
- Claude (Nov 1): read and synced to GitHub. Share card added for the review page. Waiting on Rami's visual review before anything goes into the game.

## 2026-11-01: Batch 1 enemy integration, V. 1.28.12 (Codex) [done]
- What: integrated the approved ten regular enemy species and Group Chat ping, with exact-magenta transparency, nearest-neighbor animation, contact shadows and independent fallback.
- Files: `src/enemy-art.js`, three attachment hooks in `src/main.js`, loader/version updates, `assets/enemies/README.md`, isolated test harness and `docs/qa/enemy-art/` evidence.
- For the game: production enemy visuals only. Original physics sprites/bodies remain intact; HP, damage, speeds, spawning, attack timing, bosses and leaderboard code/data are unchanged. Set `USE_ENEMY_ART` false at the top of the module and reload to compare.
- Frame sizes: native 48x48 x4 for nine species, 32x32 x4 Late Fee, 16x16 x2 ping. Display squares range from 25px Late Fee to 42px elite; Bill/Phone 36px.
- Notes for Claude or Rami: attached render sprites preserve every body dimension and offset. Phone walk/ring and Twinge coil/lunge/stretch/recovery follow existing states; ghost visuals never decide collision. Labels were raised for taller silhouettes. Ghost/ping have no shadow. Tests reached age 45 at Tax 0 (109 peak enemies), exercised 350 enemies with all four Bill frames observed, checked desktop/phone, fallback, ghost immunity, 14x14 ping body and cleanup. Test harness blocks all leaderboard requests and uses memory-only saves. No scores submitted. Bosses remain the next art batch.

## 2026-11-01: Main-game hero and Corporate Campus, V. 1.28.13 (Codex) [done]
- What: integrated the previously approved three walking heroes and Corporate Campus office into the production scene after Rami noted they were still only previews.
- Files: new `src/world-art.js`, loader entries for existing character/environment data and helpers, small hooks in `main.js` and `sprites.js`, optional endless-layout rendering in `office-environment.js`, native desk exports/data and offline exporter, world-art test harness and QA evidence.
- For the game: original hero physics body and combat data preserved. Stage geometry now follows the approved flat office footprints instead of scattered props/mezzanines. Seven-area sections repeat around the player; no new reward system or later-stage art added. Missing office assets leave the original stage intact. Set hero/office flags false and reload for comparison.
- Frame sizes: all three hero sheets remain 224x240 with 16 frames of 56x60. Desk frames are 96x104; printer/cabinet/plant frames retain 80x80, 56x88 and 48x64.
- Notes for Claude or Rami: desk data reduced from 5.2 MB to 24 KB by preparing existing sources at native size. Feet determine visual depth; foreground furniture fades to 48% only when concealing the hero. Original player body stays 48x52. Collision/seam checks passed, with all 360 pooled prop bodies aligned. Off-camera sections are excluded from rendering; 350-enemy stress averaged about 100 FPS here. See QA notes for normal-play, phone, fallback and restart results.

## 2026-11-01: Coffee-post twins illustration, V. 1.28.15 (Codex) [done]
- What: replaced the older illustration under the twins announcement with the simplified edit Rami selected.
- Files: `devlog/img/05-twins-pixel-v2.png` and prompt; post 05 Markdown and static page; docs/version.
- For the site: inline image in Why now, no duplicate image or copy changes. The game and leaderboard are unaffected.
- Image size: 1536x1152 PNG, 4:3, one illustration; wristband and all lettering removed.
- Notes: older art retained. Builder/feed refreshed; existing rich HTML and share-card metadata preserved because optional Python Markdown/Pillow packages are absent. Desktop and phone loading/fit checked before publication.

## 2026-11-01: Stage Pass 1 concept review, V. 1.28.16 (Codex)
- What: full-campus illustrated proposal and Parking Lot camera study, with a measured circulation plan. Both appear in the Art Room. Stage 1 complete for review, approval pending.
- Files: `assets/stage/` images, full prompts, manifest, layout JSON, SVG plan and checks; `devlog/art/stage-pass.html`; Art Room cards; docs and release metadata.
- For the game: nothing enters the playable map. No renderer, production layout, collision, combat, NPC, save or leaderboard changes. Devlog posts and CLAUDE.md untouched.
- Sizes: illustrated overview 1671x941; Parking Lot delivery 1280x800; proposed world 7680x4320. Main routes 224px, loop branches 160px, nine clear 512x512 plazas. Actual native hero reference is 56x60. Concept images are not production magenta sprites.
- Notes for Claude or Rami: review district geography, landmarks, plaza space and parking joke. Measured-plan controls, zoom, district details and phone layout checked; geometry checker verifies connected wrapping routes and landmark markers outside lanes/plazas. The brief’s 6x4 planning grid differs from its actual 1280x800 camera coverage, shown separately. Stop for Rami’s explicit approval before Stage 2 props/posters, Stage 3 coworkers or Stage 4 world replacement.
