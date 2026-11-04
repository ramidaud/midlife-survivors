# Memo 11 cover delivery, Nov 4, 2026 (Codex)

The clubhouse mail room cover is ready for Rami and Claude. Rami's likeness comes from the studio v2 portrait; Memo 8 supplies the pixel-art style, and the current intern/Ben art supplies their identities.

| File in `devlog/img/` | Size | Bytes |
| --- | --- | --- |
| `11-discord-key-art.jpg` | 1600x900 | 386,742 |
| `11-discord-key-art-portrait.jpg` | 1200x1500 | 391,576 |
| `11-discord-key-art-preview-2x.png` | 3200x1800 | lossless preview |

Both JPGs are below 400,000 bytes. They use optimized progressive 4:4:4 JPEG encoding, at quality 80 and 78 respectively. The lossless 2x preview contains only the requested twelve colors and opaque, flat 4x4 logical pixel blocks. JPEG compression necessarily introduces small RGB variations around some edges; there is no interpolated scaling or painted blur.

The source was cropped to an exact 1664x936 rectangle before uniform sampling to an 800x450 logical canvas. The portrait is a 360x450 crop at logical x64, uniformly enlarged to 1200x1500. It focuses on Rami, the courier handoffs and the art delivery; the complete cast and all five channel tags remain in the wide version. No character was squeezed or stretched.

The five channel tags are `#changelog`, `#devlog`, `#stats`, `#art-and-ideas`, `#playtest-notes`; the sticky note reads "everyone's on here?". To honor the explicit rule allowing no other words, the whiteboard joke is an unlabeled arrow between boxes plus a coffee ring. No title is baked into the cover. The upper band and dark lower-left clothing stay quiet for title placement.

[Full imagegen prompts](memo11-key-art-prompts.json) record the initial scene and the targeted correction that added two missing slots and reduced Ben's background scale. [Export checks](memo11-key-art-checks.json) record dimensions, compression, crop geometry and file weights. Generated source studies remain outside the public repo.

The exported JPGs were inspected at desktop 1280x800 and phone 390x844; both load without console errors. This is an art handoff only. Claude can place the cover in Memo 11 when the post is ready; the post, RSS, share-card code and game runtime are unchanged.
