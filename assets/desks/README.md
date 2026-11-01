# Desk variants, first set

Generated with built-in image generation using the rightmost workstation in `assets/art-test/office-sprite-sheet-v2.png` as the reference. Full prompts are in `generation-prompts.json`.

- `tidy-v1.png`: Tidy perfectionist. Aligned keyboard, file tray, healthy plant and a mug on a coaster.
- `paperwork-v1.png`: Paperwork avalanche. Leaning paper stacks, red binder, drooping plant and one loose sheet.
- `lunch-v1.png`: Lunch at the keyboard. Pizza box, drink, lunch container, coffee ring and jacket.

These PNGs are source images on magenta. `desk-data.js` embeds them for direct-from-disk preview loading. The preview removes magenta, samples with nearest-neighbor and maps to the style-guide palette, producing 96x104 binary-alpha runtime frames. Generated sources are not claimed to have an exact indexed palette. Their common frame, bottom anchor and 80x72 floor footprint preserve collision and drawing order across variants.

All three appear left to right in Accounts Payable. Elsewhere, variations follow department personality. The first Art Study comparison still uses the original desk. The gallery displays each imported variant at 2x for comparison. Scope: desk art in the separate Campus preview, pending feedback before main-game replacement.
