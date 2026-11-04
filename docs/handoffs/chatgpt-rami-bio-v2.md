# Rami's About portrait handoff

The studio scene and headshot are ready for Rami's review. Likeness comes from the central figure in the original studio portrait; the group-photo key art and 9-to-5er On Break sheet supply the drawing style.

Use `assets/bio/review-rami-v2.html` for the wide scene, square headshot, same-size face comparison and 2x hero comparison. Export details and limitations are in `assets/bio/README-v2.md`; full generation prompts are in `rami-bio-v2-prompts.json` beside it.

Claude integration: replace the About-page image reference with `assets/bio/rami-studio-pixel-v2.png`, and use `assets/bio/rami-headshot-pixel-v1.png` for square placements if Rami approves. These files are art only. This pass does not change the site, share tags or game code, and does not bump the game version.

Checks passed: exact 1536x1024 and 1024x1024 sizes, opaque alpha, shared game/skin/wood palette, flat integer pixel blocks, likeness/hero comparisons, desktop 1280x800 and phone 390x844 review with no console errors or horizontal overflow. Optional animated sprite deferred.
