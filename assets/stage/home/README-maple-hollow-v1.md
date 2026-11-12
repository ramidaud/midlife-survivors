# Maple Hollow native tile and prop kit v1

Review draft, art only. `maple-hollow-tiles-props-v1.png` is 256x192: 8 columns x 6 rows of 32x32. `-3x.png` is an exact nearest-neighbor 768x576 export. Rows 0-2 are opaque terrain; rows 3-5 are props on exact opaque #FF00FF with at least two clear pixels on each side. Twelve-color game palette.

The manifest lists all 48 cells. Grass, solid paving and asphalt variants share exact one-pixel edge profiles within their compatible families; 122 ordered pair checks passed horizontally and vertically. Curbs, corners and driveway edges are directional transitions and must be placed with matching terrain on each side. These are not arbitrary interchangeable terrain types. The six-by-six tiling check shows lawn, sidewalk, curb/drain and road. The mowed stripes and overgrowth are intentionally visibly patterned.

No game placement, collision or lighting changes. Review at native size before Claude assembles the neighborhood. The separately generated Maple Hollow boards remain concept references.
