# Supply Closet art

The seven prop families are packed into `supply-closet-props-v1.png`. [Manifest](manifest-supply-closet-v1.json) gives each frame rectangle, native size, anchor and proposed footprint. The bulb has two frames at 400 ms. The concrete tile repeats in both directions, with identical opposite edges. All art uses opaque exact magenta, hard pixels and the office palette.

`gate_hidden_cabinet-open-v1.png` has four 96×112 frames at 250 ms. Frame 01 is pixel-identical to the teal cabinet's source frame. It slides by 0, 24, 48 and 96 pixels, without any recoloring or shape changes.

The original cabinet nearly fills its 96px cell, so a fully open cabinet must leave that cell. `gate_hidden_cabinet-open-wide-v1.png` supplies optional 192×112 cells that show the whole cabinet on the right. Both versions use the same pixels and motion.

[Contact sheet](contact-supply-closet-v1.png), three GIF previews, [checks](checks-supply-closet-v1.json) and [prompts](prompts-supply-closet-v1.json) are included. New props have no lettering. The reused cabinet retains its original small markings.

The newer design places the secret hallway between the Server Room and Executive Wing. No runtime, navigation, gate, spawn or balance files were changed. Claude handles placement and wiring.

## Current badge-reader entrance

The updated Nov 7 brief replaces the cabinet entrance with `closet_badge_reader-v1.png` (three 24×32 frames: red, brighter red, green), `closet_floor_plate-v1.png` (48×32, slate/navy only) and `closet_door-open-v1.png` (four 64×96 frames, closed to open at 180 ms, hold last). Loop only the reader's first two frames at 400 ms while locked. Reader green is a state, not a loop frame. Door is usable at both hallway ends. Cabinet files are supplemental legacy-brief art, not the current entrance.
