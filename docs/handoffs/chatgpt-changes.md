# ChatGPT changes

Newest at the bottom. Rami pastes ChatGPT's change-log blocks here. Claude reads this at the start of each session and folds approved items into the game, then marks them **[done]**.

---

## 2026-11-01: Batch 1 reference, Bill walking sheet (Codex / ChatGPT)
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

## 2026-11-01: Batch 1 enemies complete for visual review (Codex / ChatGPT)
- What: finished the remaining nine enemy species and Group Chat ping, retaining Bill. Eleven sheets, 42 distinct native frames, full prompts, generated sources and animated previews saved. This supersedes the earlier Bill-only batch status.
- Files: `assets/enemies/`, especially `batch-1.json`, `README.md`, `review.html`, `enemy-batch-1-native.zip` and `enemy-batch-1-overview.gif`. Canonical filename pattern is `enemy-<id>-v1.png`; exact IDs and timing live in the manifest. Art Room links to review.
- For the game: art generation complete; awaiting Rami's visual review before Art Room combat preview and main-game replacement. No runtime enemy renderer, hitbox, spawn, damage or attack values changed.
- Frame sizes and count: nine species at 48x48 x4, Late Fee at 32x32 x4, ping at 16x16 x2. Single rows, exact magenta, hard palette pixels. GIFs are preview only.
- Notes for Claude or Rami: see README for animation states, origins and contact shadows. Calendar's third stride was corrected; Late Fee's sampling jitter fixed; ghost fades through pixel gaps; Donut airborne phases rise two pixels. PNG QA passed dimensions, opacity, palette, margins, unique poses, baseline/outline checks and fade ordering. Browser review passed desktop/390px phone, pose/pause/scale/floor controls and clean logs. Next generation batch is bosses, after enemy feedback. V. 1.28.10, build 66.
- Claude (Nov 1): read and synced to GitHub. Share card added for the review page. Waiting on Rami's visual review before anything goes into the game.
