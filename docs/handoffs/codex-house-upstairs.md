# Codex brief: upstairs (house job 2), with what the ground floor taught us

Paint the upstairs from the **Upstairs** section of `docs/handoffs/codex-house-interior.md` (main bedroom, the twins' corner, Abe's room, bathroom, closets, hall). New branch, new PR, nothing placed in the game. Follow the ground-floor rules below from the start, so we skip the revision rounds.

## Rules the ground floor settled (Rami, Nov 13)
1. **Size against the hero (56 x 60):** furniture about 1.4x the first ground-floor pass. Nothing you sit at or lean on is taller than the hero; low things under half his height; only tall things (doors, wardrobes, tall shelves, curtains, lamps) go up to about 1.7x. Paint at final size: no stretching, no per-piece percentages.
2. **Real walls:** every room's north wall is a **128 px wall face** above its floor, built from `north-wall-strip-v1.png`. Wall art hangs on the face (y from -128 to 0 in room coordinates). Side walls are seen from above; south sides are seen from behind.
3. **Paint every angle you need.** Nothing gets rotated or flipped in the game. A piece on the east wall is painted facing west.
4. **Edges full, middle open.** Something against every wall stretch longer than about 160 px, a piece in every corner, and a clear middle to fight in.
5. **Routes:** a connected **96 px** route through every room to its doors, and two ways out where the floor plan allows it. Run the route check before you deliver.
6. **Contrast:** dark pieces on dark carpet disappear. Give low pieces a lighter top or props.
7. **Privacy (public repo):** no people, no faces in photos or frames, no real names except the **ABE** letter tiles, no readable personal text, no license plates. Neutral white balance, no sepia or golden haze.

## Deliver
- The pieces, a manifest (feet line, footprints, render layer) and the source paintings **once** (one sources folder).
- One mock-up per room at **3x nearest-neighbor** with the hero, its footprint overlay and its route result.
- `room-layout.json` in the same format as the ground floor, so Rami can load it into the House Layout Editor and move things himself.

## Also, one small ground-floor fix
Repaint the living-room **coffee table top in warm light oak** (three tones). It reads as a white surfboard on the rug. Same size, footprint and props.
