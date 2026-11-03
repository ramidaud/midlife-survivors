# ChatGPT brief: "On Break" portrait animations (queued after room lights, Nov 3, 2026)

The pause screen now has an **On Break** tile showing your hero idling. Right now it's the 56x60 in-game sprite blown up 3x, which looks chunky and only has one fidget. Rami wants higher-fidelity animations made for UI tiles. They'll also be reused on the title screen's "Today's shift" tile and the game over screen.

## Deliverables (`assets/characters/portraits/`)
For **each hero** (the 9-to-5er, the Soccer Dad, the Grad Student at 45), one sheet at **96x112 cells**, a three-quarter front view, feet on the bottom row, transparent background:
1. **Breathe (6 frames):** relaxed, shoulders rise and fall, a blink on frame 4. This loops most of the time.
2. **Break action (8 frames), different per hero:**
   - 9-to-5er: sips coffee, sighs, pushes his glasses up
   - Soccer Dad: checks his phone, winces at the group chat, puts it away
   - Grad Student: flips a notebook page, taps the pen, nods
3. **Stretch (8 frames):** a big lower-back stretch with a tiny "crack" puff on frame 5, then back to neutral.

Sheet layout: 8 columns x 3 rows (breathe uses columns 0-5), so 768x336. Add one GIF per hero and a README with frame timings (suggested: breathe 220 ms, action 140 ms, stretch 150 ms).

## Style
- Same character design, palette and 1 px navy outline as the approved v2 hero sheets (`assets/characters/*-walk-56x60-v2.png`), just about twice the detail. Faces need to read at 96 px.
- Warm light from upper left. No ground shadow (the tile draws one).
- No text, no props cut off at the cell edges.

## Rules
- **Your files:** `assets/characters/portraits/` only. Don't edit `src/`, `index.html` or `CLAUDE.md`.
- No version bump. Commit and push, log it in `docs/handoffs/chatgpt-changes.md`, then stop. Claude wires them into the pause, title and game over tiles.
