# Clock-out station, Midlife age 65

[Native sheet](clock-out-goal-v1.png) · [Waiting GIF](clock-out-goal-waiting-v1.gif) · [Clock-out GIF](clock-out-goal-clock-out-v1.gif) · [2x size check](clock-out-goal-size-check-v1.png)

A welcoming retirement punch clock, with cream/orange/lavender balloons, a golden card, bow, presents and a fish picture. There are no words, numbers or enemy features. The minute hand points up and the hour hand points down-right: five o'clock. The stepped warm halo uses solid palette pixels, not partial alpha or blur.

| Row | Frames | Time | Playback |
|---:|---|---:|---|
| 0 | 0-5 | 160 ms/frame | Waiting loop: balloons and card move, halo breathes. |
| 1 | 6-11 | 110 ms/frame | Play once on arrival; card punches, balloons rise, confetti appears. Hold frame 11. |

Sheet **864x304**, six columns by two rows of **144x152**. Transparent hard alpha. Foot point **(72,151)**, normalized origin **(0.5,151/152)**. Nearest-neighbor sampling. The lower pedestal, gifts and fish frame stay planted across all twelve poses. The once-only GIF deliberately stops on the final pose; it is not a repeating waiting preview.

The size check is exactly 2x: station, Gold Watch, 9-to-5er. Their declared floor anchors share a baseline; the watch's existing artwork floats above its floor point. The station is tall because of the balloons, with a compact pedestal the hero can approach.

## For Claude

Use only for the friendly Midlife retirement goal at 65. Keep Full Life's Father Time/reaper separate. This is an art-only delivery: it does not replace a texture key, change a hitbox or wire the contact animation. The existing clock-out label stays a UI overlay, never baked into this image.

[Generation prompt](clock-out-goal-prompts-v1.json) records the built-in imagegen study and native cleanup. Uniform sampling preserves proportions; static carpentry and the stopped dial were locked before adding the hard-pixel halo. [Pixel checks](clock-out-goal-checks-v1.json) confirm dimensions, twelve distinct frames, the requested twelve-color palette, binary alpha and local y151 contact in every pose. Native art and the hero/watch comparison were visually inspected.
