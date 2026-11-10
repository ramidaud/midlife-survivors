# Garage interior kit v1

Local art-only review draft. `garage-interior-v1.png`:384x256,12x8 grid of32px modules. Exact rectangle map in `garage-interior-v1.json`; use named rectangles for larger props, not a uniform32px slice of every object. `-check.png` is3x nearest-neighbor. `garage-room-preview-v1.png` is a640x448 art/scale mock-up, not a playable map or collision specification.

Twenty pieces: five32px floors, three32px walls, ten furniture/decal pieces, two door states. Floors: concreteA/B, oil stain, tire marks, painted parking corner. Walls: pegboard horizontal, vertical panel, corner. Props: workbench96x48, tools64x48, minivan96x160, dust outline96x160, bins64x64, mower48x48, sad-face box32x32, dartboard32x32, fridge32x48, bike48x32. Garage-door closed/open strips each128x32.

The minivan is a fictional beige family car, seen from above. The car-shaped dust outline is a non-solid decal, with magenta through its empty center. The room mock-up shows one occupied bay and one empty bay, closed/open door examples and the existing hero for scale. V8 spawn/burst behavior, actual doorway clearance and navigation remain for Claude.

Floor tones were mapped specifically to cool slate concrete, avoiding the lavender cast from unrestricted nearest-palette mapping. Concrete variants share exact common edge pixels, so they repeat without dark tile borders. Door studies were corrected to low wall modules before sampling. Wall panel rotated to form the vertical module. No texture stretching on the car or furniture.

All props use exact opaque#FF00FF behind them; floor cells are fully opaque. Twelve-color game palette, crisp native pixels, no text/brands/vehicle makes or cast shadows. Dimensions, per-pixel palette/opacity, floor seams and rectangle bounds/non-overlap checked. No runtime, version or balance changes. Saved locally for review, not pushed.
