# House ground floor art review

Painted assets for the ground-floor rooms named in the house-interior brief: living room, shared dining and desk nook, kitchen, entry and hall. Nothing is integrated into the game. Upstairs waits for approval.

Open review.html for room mock-ups, individual native 1x comparisons with the complete unscaled 56x60 hero, and footprint overlays. Room views retain the existing HOUSE_V2 floor rectangles. The per-room views are authoritative; each is independently composed so a neighboring room's tall north-wall art does not cover its floor. The full-floor image is a coordinate/context study.

## Privacy

The ten attached house photos were used only as private art references. No attached photo or photo crop is included in this package, its comparisons, source paintings, or mock-ups. References committed here are existing game art and public layout/brief data. The new paintings omit people, faces, likenesses, names, usernames, license numbers, and branding. Framed pictures use abstract art or landscapes. Screens and notes contain generic marks rather than identifying text. The basketball is unbranded.

## Placement and perspective

- North-wall art faces the camera. The sofa was repainted for the west wall, with its 192px length running north-south and seating facing east toward the TV. The east console and kitchen side counters show broad tops and narrow front edges. The dining window and entry closet door have separate thin side-wall views.
- Dining and the downstairs desk nook overlap in the current layout. A combined mock-up shows the shared arrangement; individual crops show both named rectangles. The desk's final native fit is 240x128, enlarged from its initial 200x112 painting request to suit the 584px nook. Source and fit records are retained.
- Footprint overlays reserve 224px through the living room, 96px connectors from its actual patio opening, 104px through the shared dining/desk room, a 224px central kitchen aisle, and 112px in the entry. The hall is only 136px wide in the current layout and remains fully clear. A224px hall would require a separately approved layout change.
- The main double sink stays on the north counter. Side counters have appliances or cleaning supplies and clear worktops.
- Existing half-bath, stairs, laundry, breakfast nook and garage are shown for context. Their existing fixtures are not repainted by this photo-directed room brief. New oak door studies use the actual inner garage opening and front-entry wall. No upstairs art is included.

Feet lines and footprint rectangles are proposed integration metadata in native pixels. Wall-mounted decor, overhead pieces and floor decals have no solid footprint. Collision behavior and depth sorting must be tested during later integration by Claude, after art approval. The existing game hero is used for scale; it is not a person painted from the photos.

## Painting and reduction

Built-in imagegen produced the paintings. Generated raster sizes vary despite requested dimensions. Every selected original is retained under sources/, normalized onto an exact 2x ground/wall or 3x sprite working canvas, then reduced by exact RGBA block mode and mapped by material into the existing 21-color v4 palette. Source dimensions, crop and fit rectangles, working canvases and factors are recorded in the manifest. No world objects are drawn from code shapes. Mock-ups composite these painted pieces at 1x.

White cloth/cabinet materials use cream tones, wood uses brown tones, foliage uses the approved greens, and the mirror uses silver/slate tones. Floor tones are interpreted within their own material families. Floors and repeatable wall textures are opaque; isolated sprites and decals use transparent binary alpha. The side-wall texture is cropped from its painted central strip before normalization. Bare floor textures were repainted without furniture. Floor repeat previews are in checks/.

The public generation-plan.json records initial selected prompts and descriptive reference roles without private photo paths. revision-prompts.json records the sofa perspective, side window, bare-floor and side-counter corrections. Rejected studies stay outside the package. build.py and room_mockups.py reproduce working rasters, reductions, comparisons and composition from the public package using Python, Pillow and NumPy; output goes into deliver/.

Validation covers exact sizes, approved colors, retained tonal variation, alpha, reproducible reduction, bounded metadata, complete placements and reserved route intersections. Browser review checks use local files only; the game and telemetry are not run.

## Claude review revision, November 13 (Codex)

- Four dining chairs repainted and fitted to 36x46 canvases with exactly 40px visible height beside the unchanged 56x60 hero.
- Laminate repainted with fine straight planks, targeting 16-24px widths; grain highlights reduced further during material mapping to preserve subtlety and the original brown family.
- Living rug now sits directly on laminate. Mesh chair moved up to the desk. Garage uses its original concrete ground tile, never laminate.
- Five new painted pieces: lamp table by the sofa, twins' toy bin, shoe rack, plant cluster (used in both rooms), laundry basket. Living and shared dining/desk exceed one placed piece per 128x128 of room area; central reserved routes stay clear.
- All 61 assets pass reproducible size, palette, alpha and metadata checks; no footprint intersects reserved routes. Native room PNGs inspected directly. Browser preview was blocked by its local-file URL policy; browser layout checks were not rerun.
- Built-in imagegen prompts are in review-revision-prompts.json. Approval pending. No runtime placement, version bump or upstairs work.
