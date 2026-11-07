# Flow key-art kit (Nov 6)

Crops of the characters who already appear in finished key art. Use these for trailers, reels and devlog covers, not for in-game cut scenes. In Flow, save them as "(key art)" versions, for example "The 9-to-5er (key art)".

## What's here
| File | From | Note |
|---|---|---|
| 9to5er-keyart.png | Office key art (the original) | The best one. Full body, coffee splash, mid-run. |
| bill-keyart.png | Office key art | This Bill is a plain white page with pink cheeks. The in-game Bill has a red stripe. Pick one look for videos and stick with it. |
| spam-likely-keyart.png | Office key art | The ringing phone. |
| late-night-donut-keyart.png | Office key art | Pink frosting, sprinkles, smug grin. |
| tj-keyart.png | Discord key art | Darker, warmer palette than the office art. |
| derek-keyart.png | Discord key art | Crouched with the camera, partly cut off. |

**Missing:** Soccer Dad, Grad Student, Coldwar Cowboy, June from Legal, 3 AM Thought, Group Chat, Calendar Invite, and all the bosses. None of them have key art yet.

## Making the missing ones in ChatGPT
Make them one at a time. Attach two images: the character's pixel image from `../` (for who they are) and `9to5er-keyart.png` (for the look). Then paste this, swapping in the character:

```json
{
  "task": "Key-art character portrait for a video reference sheet",
  "character": "Soccer Dad: tan man in his 40s, short graying beard, navy baseball cap, green polo with a yellow stripe, orange shorts, sneakers. Relaxed, a little proud.",
  "match": "Draw this exact character from the first image, in the style of the second image",
  "style": "detailed pixel-art illustration, chunky dark outlines, warm muted office palette, soft lighting, same detail level as the 9-to-5er key art",
  "pose": "full body, standing three-quarter view, natural relaxed pose, whole figure in frame with space around it",
  "background": "plain flat light cream background, no scenery, no props unless they are part of the character",
  "size": "1024x1024",
  "notes": "no text, no logos, one character only"
}
```

Plain backgrounds matter: Flow learns the character, not the office behind them. If any of the crops here (with their busy backgrounds) give you trouble in Flow, remake that character with this prompt too.
