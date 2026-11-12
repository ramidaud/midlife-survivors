# Photos to Gaussian splat to animated reel: a handoff for your AI assistant

From Rami Daud's Midlife Survivors devlog. This is the process I used for my first Gaussian splat test (212 photos, Nov 2026). Give this whole file to Claude or another AI assistant that can run code and read your files, and it can walk you through the same steps.

**Who this is for:** photographers who have never touched 3D. You shoot, the assistant handles most of the software, and you make the creative calls.

---

## Instructions for the assistant

You are helping a photographer turn a set of still photos into a Gaussian splat and a short animated video. Work through the steps below in order. Explain each step in plain language before doing it, and check the result before moving on. Never edit or delete the original photos.

### What the person needs
- A camera and a subject that can hold still (a person, an object, a small scene).
- A computer with a decent GPU. An Apple Silicon Mac works. More memory means more splats.
- Free software: **Brush** (trains the splat), **SuperSplat** (cleans it, runs in a browser), **Blender** (lighting, camera moves, rendering). COLMAP or pycolmap for camera solving.
- Optional: the Blender MCP add-on, so you can drive Blender directly.

Ask what camera, computer and subject they have before starting, and adjust the numbers below to fit.

### Step 1: Shoot
- The easy way: put the camera on burst mode and walk around the subject in three circles (low, eye level, high). An iPhone works too.
- Keep heavy overlap (each frame shares most of its view with the next). 150 to 250 frames is a good first target. More passes beat fewer.
- Locked exposure and focus, fast enough shutter for no blur, even light.
- The subject must not move. Make a contact sheet and flag frames where the subject moved, blinked hard or turned their head. Pull those.

### Step 2: Prep
- Copy the JPEGs into a working folder: `splat_work/images`. Keep EXIF.
- Resize so the long side is about 1920 px on a laptop, or 3840 px on a strong desktop.

### Step 3: Solve the cameras
- Goal: find where the camera was for every frame.
- Use COLMAP or pycolmap: feature extraction, **sequential matching** (frames were shot in order), mapping. Convert the camera model to PINHOLE. The output is `splat_work/sparse/0`.
- If COLMAP crashes on the person's machine (it did on mine, at matching), run pycolmap in a cloud or sandbox environment instead and send the `sparse/0` folder back.
- **Check it:** plot the camera positions from above. They should form a clean ring around the subject. If cameras are missing or scattered, find the bad frames and re-solve.

### Step 4: Train (the person runs Brush)
- Load the `splat_work` folder in Brush.
- Laptop starting point: max splats 3,000k, 30,000 steps, resolution 1920, export every 15,000 steps, export to the same folder.
- Big desktop: 6,000k splats, 50,000 steps.
- It starts as fog and sharpens. That's normal.

### Step 5: Clean (the person runs SuperSplat)
- Open the exported `.ply`. Draw a sphere around the subject, set the selection, invert it, delete. This removes the room and stray floaters.
- Export the cleaned file (for example `export_30000-processed.ply`).

### Step 6: Direct in Blender
- Import the PLY. Level it: fit a plane to the ground and rotate so it's flat. Move the subject to the origin and find which way it faces.
- Remove leftover floaters with a height filter (Geometry Nodes, using world height).
- Grade it like a photo: AgX view transform with a contrast look, light bloom, vignette, animated grain, a little motion blur, a near-black world with a soft horizon glow.
- If you make more than one scene, give each its own copy of the grade and its own camera.

### Step 7: Camera moves
- Ask for the song's BPM. Time moves in beats: frames per beat = fps x 60 / BPM.
- Keyframe the camera path on the beat, aim it with a Track To constraint on an animated target, and mark bars and hits with timeline markers.
- Optional: a "build" shot where the subject appears as dots that sweep in. Use instanced small spheres for the dots.

### Step 8: Text (optional)
- Render a transparent matte of the subject at half resolution so headlines can sit behind it.
- Keep text off the subject's face. Use clear space (often the black area above the head) or a solid plate behind the type.

### Step 9: Check before you call it done
- Test-render key frames and look at them.
- Confirm every scene is at 100% resolution, set to video output, with the right camera and the right grade.
- Hold the clean splat on screen for a beat before any text appears.

---

## Blender 5.x notes (for the assistant)
- The compositor lives at `scene.compositing_node_group` (a CompositorNodeTree with a Group Output node).
- To render a still from a video scene, set `image_settings.media_type = 'IMAGE'` first, then restore `'VIDEO'` (FFMPEG, MPEG4, H264) and the resolution percentage afterward.
- Geometry Nodes modifier inputs: `mod.properties.inputs.Socket_N.value`. After adding an interface socket, reassign `mod.node_group`.
- Splat colors: the DC term of the spherical harmonics shows as about 0.5 + 0.2821 x value.

## What went wrong on my first try
- Not enough passes, and my subject (my son) moved more than the software likes. It still turned out well, so don't let a rough scan stop you.
- My laptop could only handle a fairly low resolution pass. Bigger scans need more memory, or a bigger computer.
- COLMAP crashed on my Mac every time, so the solve ran in the cloud.
- The first reel put the headline across the subject's face. Plan your text space before you design the moves.

## Learn more (for the person)

- A Field Guide to Gaussian Splatting, The New York Times R&D (Spatial Journalism): https://rd.nytimes.com/projects/gaussian-splatting-guide/
- THIS is the Biggest Thing Since CGI, Corridor Crew: https://www.youtube.com/watch?v=X8yRlA7jqEQ

---

Made with Claude. Process by Rami Daud. Share it, change it, tell me what you make: midlifesurvivors.com/devlog
