# Devlog

The build diary at `/devlog/`, styled as HR memos over the office key art.

## Add a post
1. Write `posts/<slug>.md` (casual, Rami's voice). Screenshots go in `img/` and are linked as `img/<file>.jpg`.
2. Add an entry at the top of `posts.js` with `"draft": true`. Keep the JSON style (quoted keys, no trailing commas).
   Optional fields: `cover`, `teaser`, `changes` (list), `nextUp`, `playUrl`.
3. Preview at `devlog/?drafts=1`. When Rami approves, set `"draft": false`.
4. Rebuild the share pages and RSS feed, then commit everything:
   `python3 scripts/build_devlog.py --root . --site-url https://ramidaud.github.io/midlife-survivors/devlog`

## Files
- `index.html`, `styles.css`, `app.js`: the page (list, post view, key-art hotspots)
- `posts.js`: the post list plus `DEVLOG_HOTSPOTS` for the hero
- `<slug>/index.html`, `feed.xml`: generated share pages and RSS (committed so GitHub Pages serves them)
