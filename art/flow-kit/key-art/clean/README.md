# Clean Flow cast, batch 1

Four heroes plus TJ and Derek, two illustrations each. Every portrait is a full-body 1024×1024 opaque PNG on exact flat cream `#F2D7A1`. Use the main portrait as the character-builder reference and its `-pose2` sibling as an additional angle or gesture.

Open [the review page](review.html) to compare the supplied identities with both new poses. [The contact sheet](contact-sheet-characters-batch-1.png) shows all twelve illustrations together. Labels live only on the review artifacts, never in the character PNGs.

The original 9-to-5er key-art crop supplies the illustration style. The matching `art/flow-kit/` image supplies each identity, including outfit colors, face, glasses and carried objects. Derek stands with a dark lens camera on its orange strap. Ben keeps brown hair, visible eyes, stubble and his tired half-smirk. His alternate was revised to preserve the large head and short body.

Built-in imagegen created the characters and alternate poses one at a time. Transparent generated cutouts were fitted without stretching onto cream, with hard-alpha edges and a 512×512 logical grid enlarged 2× using nearest-neighbor sampling. The style guide's palette is a set of illustration targets. Material and skin shading from the generated art is retained, rather than reduced to a restricted runtime sprite palette. No raw photos were used or added.

- [Manifest](manifest-characters-batch-1.json) lists identities, files and alternate gestures.
- [Final prompts](generation-prompts-batch-1.json) records the built-in generation and revision prompts.
- [Validation](validation-characters-batch-1.json) checks dimensions, opacity, exact cream borders, clipping margins and repeated 2× pixels.

This is the first six-character batch for review. June, the enemies and the bosses are still pending. No runtime files or version changed.
