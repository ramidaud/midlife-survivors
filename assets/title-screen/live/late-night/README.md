# 11:58 PM live title art

The plate and eighteen registered sprite frames are all 1920×1080 PNGs. Place every layer at `(0,0)` with nearest-neighbor sampling. The room plate is opaque RGBA. Sprite backgrounds are transparent, with hard body edges and stepped alpha for steam and Bill's contact shadow.

Open [review.html](review.html) for playback at eight poses per second and a left-40% phone crop. [contact-late-night.png](contact-late-night.png) shows every frame in order. [plate-check.png](plate-check.png) composites frame 01 of each layer.

The source has no visible steam and its Bill has no red stripe. Those requested additions are deliberate differences in the reconstruction. Clock and note lettering remain pixel-identical to the decoded source. The newly exposed chair and floor are repainted.

Generated edits supplied the hidden plate, lifted arm, sipping arm, curl, note corner and Bill header. Unconstrained generation changed unrelated details, so the final frames retain source pixels outside the moving parts. Each animation proceeds from its previous frame. Frame 06 restores pose 04 exactly. No face or outfit is independently regenerated between frames.

- `worker-01..06.png`: rest, breath, blink, lift, sip, return.
- `steam-01..04.png`: rising curl with stepped fade. Hide steam during worker 04–06 because it stays anchored to the resting mug.
- `monitor-01..02.png`: normal screen, then a five-level brightness increase with a faint three-pixel scanline.
- `note-01..02.png`: flat, then curled corner. Frame 02 includes a small opaque local backing patch to hide the old flat corner retained in the plate. Keep that patch when cropping.
- `bill-01..04.png`: planted, left foot up, three-pixel impact, right foot up. The face is reused unchanged.

[changed-pixels-summary.md](changed-pixels-summary.md) lists counts and bounds for every transition. [changed-pixels.json](changed-pixels.json) lists every changed pixel as row spans, including loop transitions. [validation.json](validation.json) records protected-pixel checks and alpha bounds. [prompts.json](prompts.json) contains the built-in imagegen prompts and native edit chains.

Frames are complete layers. Alpha-union bounds cover the complete subject; change-union bounds cover motion only. Claude handles strips, `scene.json` and game integration. No runtime files were changed.
