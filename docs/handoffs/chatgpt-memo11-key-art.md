# ChatGPT prompt: key art for Memo 11, "the game got a Discord" (Nov 4, 2026)

Paste below the line into ChatGPT. Attach `assets/bio/rami-studio-pixel-v2.png` (Rami's pixel portrait from the About page), `devlog/img/08-promoted-key-art.jpg` for style, and a screenshot of the Discord channel list.

---

Make the cover image for Memo 11 of the Midlife Survivors devlog. The memo is about how Rami, who admits he still doesn't quite "get" Discord, set up a server for his game and had it post its own updates. Every evening and morning, little robot couriers drop the changelog, devlog and stats into their channels. Match the style of the attached Memo 8 key art exactly.

```json
{
  "file": "devlog/img/11-discord-key-art.jpg",
  "size": "1600x900 (16:9), plus a 1200x1500 portrait crop as 11-discord-key-art-portrait.jpg",
  "style": "crisp 16-bit pixel art like the Midlife Survivors key art, navy outlines, warm upper-left lamp light, cozy and funny, no anti-aliasing",
  "scene": "Late evening in the office mail room, rebuilt as a tiny community clubhouse. A wall of cubby mail slots is labeled with pixel channel tags: #changelog, #devlog, #stats, #art-and-ideas, #playtest-notes. Three small pixel mail-bot couriers (boxy, friendly, antenna lights) zip along a conveyor belt, each dropping a glowing envelope into a slot: a build-notes envelope into #changelog, a memo with a photo into #devlog, a little bar-chart card into #stats. A fourth bot carries a framed painting toward #art-and-ideas.",
  "rami": {
    "appearance": "light-skinned Black male, mid-forties, clean-shaven bald head, full dark beard with a little gray at the chin, round thin wire-frame glasses",
    "clothing": "black button-up shirt, sleeves rolled to the forearms, loosened tan knit tie",
    "pose": "standing at the left holding a coffee mug, one eyebrow raised and head tilted, looking at the busy bots with an amused 'I don't fully get this, but it's working' smile",
    "likeness_notes": "match the attached studio portrait: head shape, beard, glasses and skin tone. No hair on top"
  },
  "cast": "On the right, peeking in from a doorway: TJ (gray beanie, glasses, black parka) giving a thumbs up and Derek (dark curly hair, beard, glasses, camera on a strap) taking a photo of the bots. In the back, Ben's Coldwar Cowboy (cowboy hat, denim jacket) leans on the cubbies reading a stats card.",
  "small_jokes": ["a sticky note on the cubbies: 'everyone's on here?'", "a tiny bot wearing a party hat over the #changelog slot", "a whiteboard with a hand-drawn arrow from 'GitHub' to 'Discord' and a coffee ring"],
  "palette_only": ["#171C35", "#303750", "#526078", "#3E7775", "#83A89A", "#D3B78D", "#F2D7A1", "#FFF0CF", "#EF9347", "#C45C4B", "#BFA8CF", "#F1B5BF"],
  "text_allowed": "only the short channel tags and the sticky-note line, in chunky pixel lettering; no other words",
  "avoid": "the real Discord logo, mascot or brand colors (no blurple), real app UI, other company logos",
  "composition": "keep the top 18% and bottom-left corner calm for the memo title overlay; Rami left third, bots and cubbies center, interns right"
}
```

**Ship it:** pull first, commit the two JPGs (under 400 KB each) and a 2x preview, push to main, and add a line to `docs/handoffs/chatgpt-changes.md`.
