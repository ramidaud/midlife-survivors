# Office finish review

Use [the isolated review](review-finish.html?nostats=1) from the local server or GitHub Pages. Lobby, Bullpen, Executive and Printer jam give repeatable camera positions. **Hero + Bill** places both sprites on the WELCOME rug with the camera at 1x. **Explore** allows real movement with regular spawning disabled. **350 Bullpen** runs six seconds of real swarm actors in the same space for both versions.

Add `&phase=before` for the original art and layout, or `&desktop=1` / `&phone=1` for the measured viewports. The review uses memory-only saves, disables telemetry and blocks analytics/leaderboard requests. The four before snapshots and their review loader are isolated fixtures. They are never imported by the game.

The six 96x96 pixel patches use 32px corners and repeatable center and edge sections. The two floor tiles are 64x64 and loop on both axes. All color studies, prompts, native PNGs and the Swift exporter are in [decor](../decor/). The keyed native images are embedded in the normal art data for local play, with no extra runtime requests. The rugs, mats, light pools and paper drifts stay non-solid and bake into the existing 1024px render textures.

Bullpen additions are in `room_data_finish.py`; the layout compiler checks exact prop footprints against protected cells. Floor polygons, route rectangles, all six gates and their promotion behavior carry over. To reproduce:

```sh
python3 assets/stage/start-area/build-layout.py
python3 assets/stage/start-area/build-art-data.py
python3 assets/stage/start-area/validate-layout.py
```

[Icon review](../../ui-icons/review.html) is a separate, art-only deliverable.
