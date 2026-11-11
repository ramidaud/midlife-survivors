# Codex brief: art direction audit, "every pixel stunning" (Nov 11, 2026)

**From Rami:** "I want every pixel in this game to be stunning and to play well with the sprites and on-screen effects and UI/UX."

**Your job:** tell us how to use the art we have better, and exactly what new art to ask for. Audit the game *in motion*, not just still rooms. End with a request list we can hand to an artist (you, ChatGPT or a person) one item at a time.

Play it: https://midlifesurvivors.com (add `?nostats=1` so test runs don't count). Repo: `ramidaud/midlife-survivors`.

---

## Already known (don't redo these, build on them)
- **Level art audit, Nov 10:** `docs/design/` and the Project doc `LEVEL_ART_AUDIT_2026-11.md`. Display blur, fractional zoom and smoothing are fixed (V2.29.0). Still open: off-size sprites (1D), hero and Bill detail lost in palette reduction (2A), the stretched big house (3B), no trees or green in Maple Hollow (3C), sparse office rooms and a heavy darkness layer (3A, 3D).
- **UI audit and round 2:** `docs/design/ui-audit-2026-11.md`, `docs/design/ui-audit-c3-2026-11.md`. Menus now follow design system v1 (`docs/design/design-system-v1.md`).
- **Rules you must design within** (CLAUDE.md, "One look" and "Pixel rules for the world"):
  - 12-color palette (navy, slate, teal, sage, cream, coffee orange, russet, plus the art colors in the manifests). Coffee orange belongs to the hero's mug, weapons and the one primary button.
  - Whole-number scale only (1x, 2x, 3x). The hero is a 56 px tall sprite. Art is asked for at the size of the space it fills.
  - Crisp edges, no smoothing. Colors mapped by material, not nearest-color.

## What to audit (the parts nobody has checked)
1. **Sprites in motion.** Hero walk cycles (all heroes), enemy walks and hits, the squash on hit, death pops. Frame counts, timing, silhouettes at 56 px, readability against each floor.
2. **Weapons and effects.** Every weapon from level 1 to evolved, at ages 40, 52 and 63. Projectiles, auras, rings, damage numbers, pickups (gems, coins, food), the Reduce flashing version. Do effects read as one family? Do they bury the hero or the enemies?
3. **Bosses.** Arrival card, telegraphs, attacks, knockdown. Do telegraphs read clearly against floors and crowds?
4. **UI over art.** The HUD, chips, headline, ticker, minimap and speech bubbles over a busy late-game frame. Where does UI fight the art, and where could the art carry information instead (for example, a lit floor path instead of an arrow)?
5. **Stages.** Office rooms, Maple Hollow outside, the big house (both floors), title screen slides. What makes the key art feel richer than the game: lighting, clutter, edges, shadows, scale?
6. **Missing art.** Anything still drawn as a placeholder shape, emoji, or a stretched or scaled-down image.

**Sizes to check:** phone 390x844 (at 3x pixels), iPad 820x1180, laptop 1440x900 (at 2x pixels), 1920x1080. The capture scripts in `docs/design/audit-tools/` can take the same shots again.

## What to hand back
1. **Top 10, ranked** by how much each one improves what a player sees in a normal run. For each: one screenshot, what's wrong, the fix, effort (S/M/L), and whether it needs new art or only code.
2. **Art request list.** One row per asset: name, where it's used, **exact pixel size and frame count**, palette notes, what to draw (with a reference to existing art it must match), and priority. Write each one so it can be pasted into an image request. Every AI image request asks for **neutral white balance, no sepia, golden haze or film-look tint**.
3. **Effects style sheet** (one page): the rules every hit, pickup, aura and flash should follow (sizes, colors, how long they last, how many on screen at once), so new effects match automatically.
4. **Quick wins:** changes needing no new art (layer order, shadows, timing, color choices), each small enough to fit one 45 to 90 minute sitting.

Put the report in `docs/design/art-direction-audit-2026-11.md` with screenshots in `docs/design/audit-shots-art/`, and an HTML version if it helps. Don't change game code; we'll pick from your list one sitting at a time.

## Privacy
Rami's home photos stay in `private/` and are never committed. Never draw faces, names, license plates or logos from them.
