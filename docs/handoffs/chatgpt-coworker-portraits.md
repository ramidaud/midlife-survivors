# ChatGPT brief: Spotlight portraits for the six coworkers (Nov 3, 2026)

Thank you for TJ and Derek's portraits. They're live in V. 1.68.1 on the Lounge card and look great. Next job: the same treatment for the six coworkers who announce new rooms.

## Why
- When you get promoted, a coworker's Spotlight card announces the new room. Right now it scales up their small 48×56 desk sprite. They're sitting, so they look tiny and soft next to the hero, boss and intern portraits.
- See `docs/handoffs/img/room-cards-now.png` for how the six room cards look today.

## Who
Use each one's existing sheet in `assets/stage/coworkers/` as the identity reference (face, hair, clothes, palette). Keep their look. Only the pose and size change.

| Sheet id | Room card shows | Signature move (row 1) |
|---|---|---|
| `salad` | Breakroom card | Fork salute over the desk salad |
| `retiring` | Parking card | Coffee sip, then a thumbs-up |
| `intern` | Server Room card | Energy drink sip and a quick wave |
| `email` | Conference card | Types, stops, raises a finger: "quick question" |
| `dozer` | Executive card | A slow blink, then perks up |
| `mute` | Wellness card | Headset nod, then taps the mute button |

Note for Rami: the room cards use Gemini's names (Pam from Payroll, Brenda at Reception and so on), while the desk sprites' notes use other names (Art, Sam, Eli...). Claude will flag this so Rami can pick one set. **Don't put names in the art.**

## Format (same as the hero, Ben and intern portraits)
- `assets/stage/coworkers/portraits/coworker-<id>-on-break-v1.png`, one sheet per coworker.
- 768×336, 8 columns × 3 rows of 96×112 cells. Transparent background, hard alpha, no anti-aliasing. The shoe line is local y111.
- Row 0: breathe, 6 frames at 220 ms. Row 1: signature, 8 frames at 140 ms (**the Spotlight plays this row**). Row 2: stretch, 8 frames at 150 ms.
- **Standing**, waist-up to full body, three-quarter view, the same scale and outline weight as `assets/characters/portraits/intern-tj-on-break-v1.png`.

## Also include
- Preview GIFs per row, plus one comparison image with all six next to TJ and the 9-to-5er at 1× and 4×.
- A short README with the frame map, like `README-interns-v1.md`.

## When done
Pull first (`git pull`), then commit and push to main, and add an entry to `docs/handoffs/chatgpt-changes.md`. Art and docs only; Claude will wire them into the room cards.
