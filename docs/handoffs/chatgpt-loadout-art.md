# ChatGPT brief: art for the loadout expansion (Nov 4, 2026)

Paste everything below the line into ChatGPT. Attach `lo-phone-lvl.png` and `evo-play.png` (Claude's screenshots of the placeholder art) if you have them.

---

V. 1.83.0 doubles the loadout: **7 new weapons and 6 new passives**, and you can only carry 6 of each. Every item has a play style shown as a colored badge: **Healing** (sage `#83A89A`), **Shield** (teal `#3E7775`), **Offense** (coffee orange `#EF9347`), **Defense** (lavender `#BFA8CF`). Right now the new items use emoji on the cards and tiny code-drawn sprites in the world. **The job: real icons for the cards and HUD, and real in-world sprites and effects.**

## Reference
- **Card icon atlas:** the existing 32 px atlas in `src/data/ui-icons.js` (`UI_ICONS`, cards are keyed by card name). Match its style, outline and scale exactly.
- **World scale:** the heroes (`assets/characters/office-worker-walk-56x60-v2.png`) and the weapon sprites in `src/weapons_extra.js` (the remote and floppy disk).
- **Code:** the cards are in `src/data/loadout.js`; the weapons run in `src/weapons_more.js`.

## 1. Card and HUD icons (34 icons, 32×32 each)
Add them to the card atlas as a new sheet, `assets/ui/loadout-icons-v1.png`, **8 columns**, with a JSON map from card name to cell index. The style badge color goes on a small corner accent only, so the icon still reads on its own.

```json
{
  "weapons": {
    "Unlock: Mom's Spaghetti": "a cream bowl heaped with spaghetti, red sauce and two meatballs, steam rising, a fork twirled in (renamed from Mom's Casserole on Nov 4)",
    "Second Helping": "a pasta server lifting a big tangle of noodles",
    "EVOLVE: Potluck": "two spaghetti bowls on a checkered tablecloth with a little name card",
    "Unlock: Noise-Cancelling Headphones": "chunky over-ear headphones with a soft teal bubble around them",
    "Active Noise Cancelling": "a slider knob turned all the way up",
    "EVOLVE: Do Not Disturb": "headphones plus a door hanger with a crescent moon (no text)",
    "Unlock: Rolling Office Chair": "a navy mesh office chair on five wheels, slightly tilted like it's rolling",
    "WD-40 the Wheels": "a spray can with a red straw and a little squirt",
    "EVOLVE: Executive Swivel": "a big leather executive chair spinning, motion lines",
    "Unlock: Reply-All Storm": "an envelope crackling with orange lightning",
    "CC Everyone": "three tiny envelopes fanning out from one",
    "EVOLVE: Company-Wide Memo": "a megaphone shooting a stream of envelopes",
    "Unlock: Out-of-Office Reply": "a laptop with an airplane and a palm tree on the screen",
    "Extended Leave": "a desk calendar with many days crossed out",
    "EVOLVE: Sabbatical": "a beach chair and umbrella with a laptop closed in the sand",
    "Unlock: Sticky Notes": "a square pad of cream sticky notes with one curling up",
    "Bulk Pack": "a stack of sticky-note pads in a shrink wrap",
    "EVOLVE: Wall of Post-its": "a grid of notes in a ring, like a planning wall",
    "Unlock: Thermostat Wars": "a wall thermostat dial cranked to cold with frost on the edges",
    "Crank It to 62": "a hand turning the dial, frost puff",
    "EVOLVE: Polar Vortex": "a swirling snow cyclone over a tiny office desk"
  },
  "passives": {
    "Multivitamin": "a big chalky vitamin with a weekly pill organizer behind it",
    "Meal Prep Sunday": "three stacked meal-prep containers with rice, greens and chicken",
    "Cardigan": "a cozy knit cardigan with leather elbow patches",
    "Lumbar Support": "a curved lumbar pillow strapped to a chair back",
    "Fitness Tracker": "a wrist band with a small screen showing a step bar (no numbers)",
    "Bifocals": "half-moon bifocal glasses with a gold chain, one lens sparkling"
  },
  "style_badges": {
    "file": "assets/ui/style-badges-v1.png",
    "what": "4 tiny badge glyphs, 12x12 each, in a row: Healing (plus sign), Shield (shield), Offense (lightning bolt), Defense (brick wall). Solid shape plus a navy outline, so Claude can tint or place them on the colored chips"
  }
}
```

## 2. In-world sprites and effects (replacing the code-drawn ones)
```json
{
  "casserole_dish": { "file": "assets/weapons/casserole-v1.png", "cell": "32x24", "frames": "4 (a bowl of Mom's Spaghetti: sauce bubbling, steam rising), 140 ms. The weapon is now Mom's Spaghetti; keep the file name" },
  "casserole_zone": { "file": "assets/weapons/casserole-heat-v1.png", "cell": "128x96 ellipse", "frames": "4 (heat shimmer, warm orange and cream, mostly transparent)" },
  "headphone_bubble": { "file": "assets/weapons/phones-bubble-v1.png", "cell": "80x80", "frames": "row 0: idle shimmer 6 frames; row 1: pop burst 6 frames (plays once)" },
  "office_chair": { "file": "assets/weapons/office-chair-v1.png", "cell": "28x30", "frames": "8 (spinning one full turn)" },
  "reply_all_email": { "file": "assets/weapons/reply-all-v1.png", "cell": "18x14", "frames": "4 (envelope flapping, a spark at the tip)" },
  "out_of_office_field": { "file": "assets/weapons/ooo-field-v1.png", "cell": "a ring, 256x200", "frames": "6 (slowly rotating dashed lavender ring with tiny palm and airplane icons riding it)" },
  "sticky_note": { "file": "assets/weapons/sticky-note-v1.png", "cell": "16x16", "frames": "row 0: lying flat (2 colorways: cream, donut pink); row 1: stuck and shaking 4 frames; row 2: pop 4 frames" },
  "cold_snap": { "file": "assets/weapons/cold-snap-v1.png", "cell": "160x160", "frames": "6 (frost ring bursting outward with snowflakes), plays once" },
  "frozen_overlay": { "file": "assets/weapons/frozen-overlay-v1.png", "cell": "40x40", "frames": "1 (a thin ice crust and two icicles that sit over a frozen enemy)" }
}
```

## Rules
```json
{
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "ice": "use cream, warm white, muted blue and slate for frost. No bright cyan",
  "style": "crisp 16-bit pixel art, navy silhouette outline, warm upper-left light, no anti-aliasing, transparent with hard alpha",
  "avoid": "any text, numbers or logos (the thermostat and fitness tracker use tick marks and bars only); real brand names"
}
```

## Files and checks
- **Write** the sheets above, preview GIFs of every animated row, and the JSON icon map.
- **One check image:** all 34 icons at 2× in a grid with their names underneath, plus each world sprite at 2× next to the 9-to-5er.
- **Ship it:** pull first (`git stash && git pull`). Commit art and docs only, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`. Claude will wire it into `src/weapons_more.js` and the icon atlas.
