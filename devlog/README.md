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
