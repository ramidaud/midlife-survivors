# House-scale repaint review

Ready for art review, pending Rami's approval. This package follows docs/handoffs/codex-house-repaint.md and Rami's saved room layouts. Earlier PR #10 artwork remains intact one folder above. No runtime placement.

Rebuild using Python with Pillow and NumPy:

    python build_repaint.py

The build creates deliver/ with native painted reductions, comparisons against the full unchanged 56x60 hero, room views at 3x nearest-neighbor, and footprint overlays. selected-prompts.json records the imagegen requests and cleanup edits. repaint-plan.json records final native dimensions and viewpoint instructions. placements.json preserves Rami's room-relative layout intent. room_mockups.py records grid snapping and spacing adjustments explicitly.

Scale is measured against the hero. Native furniture dimensions aim for the approved 1.4x house scale, bounded by the kind of object: sitting and work surfaces at or below hero height, low objects under 30px, tall objects around 100px. A long north-south footprint, flat rug, or wall print can occupy more screen depth without representing a tall physical object. Coffee table is 1.2x in width and low in height. Paintings are normalized to exact 3x canvases before reproducible whole-number reduction, with no runtime stretch or rotation.

Route checks flood-fill positions where an entire 96x96 square fits between proposed footprints. Reaching two room boundaries demonstrates local clearance only; actual door connectivity and depth sorting still need runtime testing after art approval. Green dots in overlays show clear square centers, not a painted game path.

Only sources/ beside this README contains selected source paintings. The exporter points its manifest to ../sources/ and does not create deliver/sources. Source photos are not included. Paintings use the existing public v4 style reference, neutral white balance, no people, names or personal text. Superseded paintings are excluded from the review.

## Review limits and fit decisions

- The four main room mock-ups have connected 96px square routes at their existing door/open boundaries. The entry bench is a compact 56x48 repaint, fitted below the door rather than across its opening.
- Rami's latest direction fixes the bassinets in the northwest corner at [0,0], between the raised photo shelves and the sofa shifted south to [0,64]. They are repainted as two compact sleeping bassinets, not car seats. The patio approach stays connected at 96px.
- Four dining chairs face the table; their asset names indicate facing direction rather than their side of the table. Rugs are ground decals with no backing or collision.
- The 104x136 laundry closet retains its washer/dryer. A full 96px square cannot fit inside with that appliance. Its basket is accessed from outside; this is an explicit existing-space exception, not a passing through-room route.
- Native room PNGs are visually inspected. Browser file-URL preview is unavailable in this environment, so responsive browser layout was not rerun. The art review does not launch the game or send telemetry.

Run test_routes.py for the 95px/96px/dead-end tests, then audit_review.py after rebuilding to audit the exports. No runtime integration or version change. Claude places approved art later.

## Latest review corrections

Upright rig faces the east-wall TV; one connected floor cable pair runs from its right edge to the media console. Coffee table has a pale top and visible props. Dining chair tucks at the standing desk, the plant sits left of the abstract painting, and kids' drawings form a wall-mounted row beneath it. The kitchen is repainted as one detailed set: visible fridge magnets/handles, cabinet doors/drawers, and props on worktops, with only the north double sink. The central aisle remains open. Exact requests are in review-fixes-prompts.json.
