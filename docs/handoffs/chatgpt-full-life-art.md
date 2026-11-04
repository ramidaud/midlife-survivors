# ChatGPT brief: Full Life bosses and floor pickups (Nov 4, 2026)

Paste everything below the line into ChatGPT.

---

Thanks for the loadout art. It's live in V. 1.91.0 (icons, badges and all nine weapon sprite sets). Please pull first (`git stash && git pull`).

Two gaps left where players still see placeholder art:

1. **Full Life mode (ages 65 to 100) has no boss art of its own.** Its three bosses borrow other bosses' sprites with a color tint, and Father Time at 100 is a code-drawn circle.
2. **The three floor pickups** (Fanny Pack, Energy Drink, PTO Day) are phone emoji inside a dark circle.

**Match these existing references exactly:**
- The boss format and style in `assets/bosses/README.md`: 144x152 frames, foot point (72,148), and opaque #FF00FF background.
- The clock-out goal in `assets/bosses/README-clock-out-goal-v1.md` for Father Time.
- The 56x60 hero (`assets/characters/office-worker-walk-56x60-v2.png`) for scale.

## Part 1: three Full Life bosses

Each sheet is 576x456: 4 columns by 3 rows of 144x152 frames.
- Frames 0-5: walk.
- Frames 6-7: wind-up.
- Frames 8-9: attack.
- Frame 10: hurt.
- Cell 11: blank magenta.

Each boss also gets one ground marker (telegraph decal). Each attack reuses an existing boss move, so the code can follow quickly.

```json
{
  "hoaPresident": {
    "file": "assets/bosses/boss-hoa-president-v1.png",
    "name": "The HOA Board President",
    "look": "a stern retiree in a cardigan vest and lanyard, reading glasses on a chain, clipboard of violations in one hand and a long wooden yardstick in the other",
    "attack": "straight charge (like the Performance Review): wind-up raises the yardstick and squints, attack lunges forward with the yardstick pointed",
    "marker": { "file": "assets/bosses/telegraph-hoa-president-v1.png", "size": "256x128", "what": "a dashed charge lane drawn as a tape measure with tick marks, chevrons pointing right" }
  },
  "retirementBoss": {
    "name": "Mandatory Retirement Audit",
    "file": "assets/bosses/boss-retirement-audit-v1.png",
    "look": "a towering filing cabinet on stubby legs, drawers bursting with forms, a green-visor accountant face on the top drawer, a rubber stamp for a hand",
    "attack": "shockwave (like the 30-Year Mortgage): wind-up lifts the stamp high, attack slams it down and papers burst out",
    "marker": { "file": "assets/bosses/telegraph-retirement-audit-v1.png", "size": "192x128", "what": "broken rings of scattered forms and checkboxes" }
  },
  "pickleballChamp": {
    "name": "The 6 AM Pickleball Champion",
    "file": "assets/bosses/boss-pickleball-champ-v1.png",
    "look": "a wiry, sun-tanned older athlete in a white visor, sweatband, knee brace and bright court shoes, paddle raised, unbelievably energetic",
    "attack": "drifting loops (like the Midlife Crisis V8): wind-up crouches in a ready stance, attack is a sliding lunge with the paddle out",
    "marker": { "file": "assets/bosses/telegraph-pickleball-champ-v1.png", "size": "256x128", "what": "two curved court lines with a small dotted ball trail" }
  }
}
```

## Part 2: Father Time (the finish line at 100)

This is not a fight. Father Time stands still, and you walk into him to shake his hand and win.

Sheet: `assets/bosses/father-time-v1.png`, frames 144x152, in the same layout as the clock-out goal.
- **Row 0:** 6 waiting frames (160 ms each). He leans on a cane, a soft beard sways, and an hourglass on his belt trickles.
- **Row 1:** 6 handshake frames (110 ms each, plays once and holds the last frame). He smiles, extends a hand, and a few warm sparkles appear.

```json
{
  "look": "a kind, very old man in a cream robe with a gold sash, long white beard, wire glasses, wooden cane, an hourglass at his belt. Grandfatherly and proud of you, not spooky",
  "avoid": "skulls, scythes, hoods, anything grim"
}
```

## Part 3: floor pickups (3 items)

Sheet: `assets/items/field-items-v1.png`, 32x32 cells, 3 columns by 2 rows.
- **Row 0:** the item.
- **Row 1:** the same item with a shine.

The game bobs them and adds the glow itself, so draw no circle behind them.

```json
{
  "fannyPack": "a puffy nylon fanny pack in coffee orange with a cream zipper and a teal buckle strap",
  "energyDrink": "a tall slim can, teal and cream with a lightning bolt, a little fizz at the top (no brand, no text)",
  "ptoDay": "a small palm tree in a sand mound with a folded beach chair leaning on it"
}
```

## Rules (same as always)
```json
{
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "style": "crisp 16-bit pixel art, one-pixel navy outline, warm upper-left light, no anti-aliasing",
  "backgrounds": "bosses and markers on exact opaque #FF00FF like the existing boss sheets; pickups transparent with hard alpha",
  "avoid": "text, numbers, logos, real brands, real people's faces"
}
```

## Files and checks
- Write preview GIFs of every animated row and the JSON manifests.
- Make one check image: each boss and Father Time at 1x beside the 56x60 hero and a Bill, plus the three pickups at 2x.
- Commit art and docs only. Push to main and add one line per part to `docs/handoffs/chatgpt-changes.md`. Claude wires everything in.
