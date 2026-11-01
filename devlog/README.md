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
- `<slug>/index.html`, `feed.xml`: generated share pages and RSS (committed so GitHub Pages serves them)

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
