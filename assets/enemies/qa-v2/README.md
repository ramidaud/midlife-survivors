# Enemy v2 art review checks, Nov2, 2026

The review is a standalone canvas page. It loads no game, saves, analytics or leaderboard. Desktop uses a 1280x800 review viewport; phone uses 390x844. viewport.html provides those exact iframe dimensions for reproducible checks, independent of the parent browser window.

- All 22 native images load: eleven untouched v1 sheets and eleven new v2 sheets. Diagnostics confirm 84 distinct v2 poses are visited during playback, including full special-state atlases.
- Desktop and phone show v1/v2 side by side. At 2x the individual 48px poses fit inside their fixed inspection panels; the 640px crowd canvases scroll inside their containers. Page width remains 1280 or 390 respectively, with no horizontal page overflow.
- Pause, resume, restart, next-pose stepping, manual pose inspection, floor selection and foot/center guides are exercised. The ping's final fourth pose is selectable.
- All eleven species can populate the crowd selector. Each comparison draws 30 copies per view. Every v2 frame delay is exactly half its v1 counterpart, and both views move along identical paths with matching phase offsets.
- Spam walk/ring, Back Twinge lunge/rest and ghost solid/fade/ghost/full-atlas options are checked separately. The ghost's last two native poses are visibly see-through after exact-magenta keying.
- Browser error arrays are empty. No external resources or Phaser/game runtime are loaded. Direct browser console checks also show no errors. This is an art preview, not a game performance or balance test.

Pixel/GIF checks are in ../checks-v2.json. They cover 11 sheets/84 unique poses, correct native dimensions, opaque exact palette/magenta, clear cell margins, navy contours on solid poses, old foot/contact positions, pixel-exact key poses, decreasing ghost ink density, GIF frame counts and exact total loop periods. The hash snapshot verifies every pre-existing enemy-folder file remains unchanged. No runtime or version file is edited.

Evidence: *-all-poses.json and *-final.json record loaded images, visited poses, viewport sizes and errors. *-controls.json and *-zoom.json capture paused stepping and contained 2x canvases. crowd-selections.json checks all 11 crowd choices and timing. Screenshots show desktop/phone comparisons and special-state inspection.

Fresh final desktop and phone loads have clean browser console logs, saved in console-final.json. An earlier iterative wrapper reload logged a MutationObserver setup error; neither the review nor the wrapper uses MutationObserver, and it does not recur in those fresh final loads. The review's own error arrays remain empty.
