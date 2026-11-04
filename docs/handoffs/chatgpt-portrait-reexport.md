# ChatGPT brief: re-export the five phone title scenes (Nov 3, 2026)

Paste everything below the line into ChatGPT.

---

Thanks for the key art v2. The desktop versions look great on the title screen. The **portrait (phone) versions came out squashed**: every one of the five `*-portrait.jpg` files is about two thirds of its real height. Characters look short and wide, and the Soccer Dad's ball is twice as wide as it is tall. I stretched them back 1.5× as a stopgap (`*-portrait-v2.jpg`), but they're soft, and two of them aren't quite right (Coffee Run and Happy 50th now read slightly tall).

**The job:** redo the five portrait scenes at true proportions. Keep the same compositions you already made. This is a fix, not a redesign.

## Files
- **Read:** `assets/title-screen/slides/08-group-photo-portrait-v2.jpg` through `12-happy-50th-portrait-v2.jpg` (composition reference: where things sit), plus the matching `*-desktop.jpg` files (**proportion reference**: how tall the characters should look).
- **Brief with the cast and style:** `docs/handoffs/chatgpt-key-art-v2.md`. Same palette, same pixel style, no text.
- **Write:** `assets/title-screen/slides/<same name>-portrait-v3.jpg`, at **exactly 1080×1920**, JPG quality about 88.

## The one rule: never resize to a different shape
If your image tool makes 1024×1536 (2:3), **crop the sides first** to 864×1536 (which is 9:16), then scale that up to 1080×1920. Never squeeze or stretch one direction more than the other.

## Layout (same as before)
- **Cast band:** y 600 to 880 of 1920, centered. That's the strip between the logo and the Punch In button on a phone.
- **Above it** (ceiling, wall, windows): quiet, low contrast.
- **Below it** (floor, small details): low contrast, because buttons and tiles sit on top.

## Per-scene notes
- **08 Group Photo, 09 Reboot, 10 The Lounge:** same compositions, just at true proportions.
- **11 Coffee Run:** same composition. Check that the runners aren't narrow or tall-looking.
- **12 Happy 50th:** make the party bigger. On a phone the cast was only about 40 px tall and read as an empty room. Bring the cake table and the guests closer, so the cast fills most of the band's width.

## Before you export, check every file
1. Something round is round: a soccer ball, a clock face, a cake, a coffee cup rim.
2. Put each portrait next to its desktop version. A character's head-to-body proportions should match.
3. The size is exactly 1080×1920.

## Also include
- One check image: all five portraits side by side at 25%, each with its desktop version under it.
- A line in `docs/handoffs/chatgpt-changes.md`.

## When done
Pull first (`git stash && git pull`). Commit art and docs only, then push to main. Claude will switch the title screen to the v3 files.
