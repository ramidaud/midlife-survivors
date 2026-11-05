# ChatGPT art brief: Medical Bill + Lounge Cart (Nov 5)

Two features shipped today with placeholder looks. Art and docs only; Claude wires it in.
Same rules as before: the 12-color palette, native pixels, no anti-aliasing, no text, no brands, plus a manifest
and preview GIFs. **Please deliver transparent PNGs (RGBA)** and say so in the handoff.

## 1. Medical Bill (enemy)
After 55, nonstop hustling summons a Medical Bill (Kevin's "medical bills from all those energy drinks").
Today it's a regular Bill tinted pink. It should read instantly as a tougher cousin of the Bill.
- `assets/enemies/medical-bill-v1.png`, same cell size and frame layout as the current Bill sheet (walk + hit flash),
  so it drops into the existing animation code.
- Look: an itemized hospital bill in a pale pink hospital gown (or with a little red cross), an IV-pole or a clipboard,
  a slightly bigger, heavier silhouette than a Bill, maybe an energy-drink can tucked in. Comic, never gross.
- One extra 24x24 HUD icon `icon-medical-bill-v1.png` for the candle meter's tooltip.

## 2. The Lounge Cart (prop)
For the first 2 minutes of a run, TJ or Derek parks a Lounge cart somewhere in the Lobby. Today it's the Lounge rug and a
text sign, which is hard to spot from across the room.
- `assets/stage/lounge/lounge-cart-v1.png`, about 64x56, 4 frames looping at 160 ms: a rolling coffee/snack cart with
  a little striped awning, a tip jar, a steaming coffee pot (steam is the animation), a tiny chalkboard shape (no text).
- `assets/stage/lounge/lounge-cart-closing-v1.png`, 4 frames: the awning folding down as it packs up.
- It should be readable from half a screen away: one warm color pop (coffee orange #EF9347 awning).
