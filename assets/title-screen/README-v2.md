# Title-screen scenes 08–12

Desktop exports are 1920×1080. Portrait exports are 1080×1920 and use separate compositions. The review PNGs overlay the corresponding viewport guide at 50% opacity. The guides include the old background and UI, so use the clean JPGs to judge the artwork itself.

| Scene | Desktop | Portrait |
|---|---|---|
| Group Photo | [Art](slides/08-group-photo-desktop.jpg) · [Guide check](qa-v2/08-group-photo-desktop-check.png) | [Art](slides/08-group-photo-portrait.jpg) · [Guide check](qa-v2/08-group-photo-portrait-check.png) |
| Turn It Off and On Again | [Art](slides/09-reboot-desktop.jpg) · [Guide check](qa-v2/09-reboot-desktop-check.png) | [Art](slides/09-reboot-portrait.jpg) · [Guide check](qa-v2/09-reboot-portrait-check.png) |
| The Lounge Is Open | [Art](slides/10-lounge-desktop.jpg) · [Guide check](qa-v2/10-lounge-desktop-check.png) | [Art](slides/10-lounge-portrait.jpg) · [Guide check](qa-v2/10-lounge-portrait-check.png) |
| Coffee Run | [Art](slides/11-coffee-run-desktop.jpg) · [Guide check](qa-v2/11-coffee-run-desktop-check.png) | [Art](slides/11-coffee-run-portrait.jpg) · [Guide check](qa-v2/11-coffee-run-portrait-check.png) |
| Happy 50th | [Art](slides/12-happy-50th-desktop.jpg) · [Guide check](qa-v2/12-happy-50th-desktop-check.png) | [Art](slides/12-happy-50th-portrait.jpg) · [Guide check](qa-v2/12-happy-50th-portrait-check.png) |

The production inputs in `prompts-v2/` record the built-in imagegen prompt and the references for each composition. The desktop guides reserve x47–97%, y9–43%. The phone guides reserve x4–96%, y31–46%.

Several imagegen renders needed framing adjustments at export. The action was fitted to the green band and the surrounding architecture was expanded to fill the canvas. Group Photo also trims stray enemy cameos at the edges. The portrait Reboot includes the three other heroes beside Ben. The palette guided generation, so the JPGs use related shades and are not indexed to twelve exact colors.

For integration, use the portrait JPGs on narrow screens and the desktop JPGs on wide screens. Keep the viewport alignment used in the checks and verify the live crop at both sizes.
