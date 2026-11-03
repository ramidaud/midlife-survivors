# Devlog

The build diary at `/devlog/`, styled as HR memos over the office key art.

## Add a post
1. Write `posts/<slug>.md` (casual, Rami's voice). Screenshots go in `img/` and are linked as `img/<file>.jpg`.
2. Add an entry at the top of `posts.js` with `"draft": true`. Keep the JSON style (quoted keys, no trailing commas).
   Optional fields: `cover`, `leadVideo`, `leadAlt`, `teaser`, `changes` (list), `nextUp`, `playUrl`.
   Every memo opens with a lead visual: `leadVideo` (a looping clip) if set, otherwise `cover`. Don't repeat that image in the post body.
3. Preview at `devlog/?drafts=1`. When Rami approves, set `"draft": false`.
4. Rebuild the share pages and RSS feed, then commit everything:
   `python3 scripts/build_devlog.py --root . --site-url https://ramidaud.github.io/midlife-survivors/devlog`

## Files
- `index.html`, `styles.css`, `app.js`: the page (list, post view, key-art hotspots)
- `posts.js`: the post list plus `DEVLOG_HOTSPOTS` for the hero
- `<slug>/index.html`, `feed.xml`: generated share pages and RSS (committed so GitHub Pages serves them). The feed carries each full post (`content:encoded`) so Substack's importer brings in the whole post, not just the teaser.

## Video clips
- Put an MP4 (H.264, under ~3 MB, 10-20 s, no audio) in `img/` and add it to the post's markdown:
  `<video src="img/<file>.mp4" poster="img/<file>.jpg" autoplay muted loop playsinline controls></video>`
- Clips autoplay muted on loop like a GIF, and stay paused for readers who turn on "reduce motion".
- To shrink a phone or screen recording: `ffmpeg -i in.mov -t 15 -an -vf scale=960:-2 -c:v libx264 -crf 26 -preset veryfast -movflags +faststart out.mp4`

## Sidenotes (inline references)
- Write `^[your note]` right after a word or sentence. It becomes a small orange number.
- Click (or tap) the number and the note pops in as a card under that line, like hankgreen.com. X, Escape or a click elsewhere closes it.
- Notes can include links: `^[More on this in [post 1](?post=01-never-made-a-game).]`

## Code snippets
- Write a fenced block with the language and the file it came from:
  ````
  ```js src/data/swarms.js
  hpPerLevel: 0.10, // enemies get 10% tougher per level
  ```
  ````
- It renders as a code card: cream file tab, line numbers, comments highlighted (they carry the "why"), and a Copy button.
- Keep snippets short (under ~15 lines), use real code from the repo, and say in a sentence before or after what changed and why.

## About portrait
- `about/index.html` uses `../../assets/bio/rami-studio-pixel-v1.png` for its lead image and the same versioned PNG in share metadata. Full prompt: `assets/bio/rami-studio-pixel-v1-prompt.txt` at the project root.
- Rami requested this replacement on Nov 1. It is an illustrated portrait of the creator, not a gameplay character. The original supplied photograph stays outside the repository. Prior silhouette art is retained.

## Brand mark
- Clocking Out assets live in `assets/branding/` at the project root. Devlog headers use the same crisp SVG through `styles.css`; root favicon and touch PNGs match its native pixel grid.
- Keep the brand markup and icon/CSS URLs in `scripts/build_devlog.py` synchronized with the main, About and Art Room pages.
- Build note: the Python `markdown` package is optional in the current script, but its minimal fallback changes rich article formatting and escapes sidenote HTML. Check generated diffs before saving on a machine without Markdown support. This brand pass retained the existing published article bodies.

### Enemy review (Nov 1, Codex)
The Art Room links to `../assets/enemies/review.html`, an isolated animation review for all ten enemy species and Group Chat ping. It supports pause, pose selection, scale and floor comparison, with native PNG/GIF/prompt downloads. Batch 1 art generation is complete; main-game integration awaits visual review. No published post content changed in this pass.

## Link previews (share cards)
- Every page has a 1200x630 preview image so links look good in iMessage, Slack, Facebook, LinkedIn and Discord.
- Post cards are made automatically by `build_devlog.py` (saved in `img/share/<slug>.jpg`, built from the post's cover and title). It needs Pillow: `pip install pillow`.
- Cards for the game, devlog home, Art Room, About, enemy review and roadmap live in `assets/share/`. Rebuild them with `python3 devlog/scripts/share_cards.py --root .` after changing their art.

## Coffee-post twins illustration (Nov 1, Codex)
Post 05's Why now section uses `img/05-twins-pixel-v2.png`, Rami's simplified 1536x1152 edit, immediately after the birth announcement. The full edit prompt is alongside it. The earlier `05-twins-pixel.png` is retained. Markdown and the direct static article reference v2; the lead image/share card remain about the coffee button. The builder was run, with existing published HTML preserved against this environment's minimal Markdown fallback.

## Stage Pass concept review (Nov 1, Codex)
The Art Room now shows the two Stage 1 campus concepts and links to `art/stage-pass.html`: nine-district illustration, measured route/plaza plan, zoom, district inspection and Parking Lot camera study. Files and prompts are under `../assets/stage/`. This is approval-stage art only; the walkable preview and production world remain unchanged. No post or RSS content changed.


## Campus overview v2 (Nov 1, Codex)
The Art Room now opens `art/stage-pass-v2.html`: irregular district geometry, promotion-age controls, starting area, hidden Archive, captions and a planned modular kit. Parking Lot v1 remains the approved scale/density target. Original review retained as an archive. Proposal only; no post or runtime world changes.


## Stage 2A props/posters (Nov 1, Codex)
Rami approved campus v2. Art Room links to ../assets/stage/props/review.html with the first 13 prop families and 31 colorways, native hero/enemy scale checks, footprints and 224px gate study. Prompts and manifests live beside the images. Stage 2 is ongoing; runtime pathing/spawn filtering belong to Claude. No post content changed.


## Stage 2B slang and landmarks (Nov 1, Codex)
The same prop gallery now opens on 12 new families and switches between 2A, 2B and all 25. It includes native hero/Bill comparisons and a cumulative 55-colorway manifest. Claude's current-office navigation and 2A integration are preserved; new 2B art remains separate until integration. No posts changed.
