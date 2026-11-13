# Round-two living-room corrections

Seven repaints follow docs/handoffs/codex-house-fixes-round2.md. Earlier art is approved; these corrections are ready for review. No game integration or version change.

Final native canvases: TV 92x120, love seat 276x90, matched lamp tables 84x108 each, tufted recliner 120x90, east-facing rig 180x132, pale coffee table 186x42 and cream-blanket basket 56x28. Original paintings are proportionally contained without stretching on exact 3x working canvases, then block-reduced and mapped by material. round2-prompts.json records the selected paintings.

The living view uses placements-round2.json at 1x with no rotations. The repainted TV replaces the editor’s old scale/rotate/flip workaround and anchors at [676,-124] above the east console. The basket follows the written brief at [112,168], between the west sofa and coffee table, rather than the saved editor coordinate. All other living coordinates are preserved. Other rooms and 49 unchanged assets retain their approved exports exactly.

**96 px route check FAILS for the fixed living layout.** There are clear pockets, but no connected 96x96 square route between checked door openings. The review records this result instead of moving furniture to claim clearance. Do not integrate until the layout is resolved. The existing laundry-closet exception also remains explicit; the other three rooms retain their passing checks.

Open deliver/review.html for native hero comparisons, the exact 3x living view, footprints and route-checks.json. deliver/mockups/living-footprints-3x.png is also available. Browser verification and screenshots are in reports/house-round2 at repository root. Nothing launches the game or sends telemetry.

The builder retains unchanged assets and rooms from the committed deliver package. It rebuilds the seven selected pieces and living view. Rebuild with Python, Pillow and NumPy: python build_repaint.py; then run test_routes.py and audit_review.py. Audit success validates the artifacts and truthful failure reporting; it does not mean the living route passes.

Only repaint/sources contains the selected source paintings. The exporter does not duplicate it under deliver. Private photos are excluded. Paintings use neutral white balance with no people, names or readable personal text.
