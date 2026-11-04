# Animated office coworkers

[Review the cast](review.html) at 1× or 2×. The gallery uses the same 34px crop as the game. Each GIF shows one idle cycle followed by a reaction. [Eli’s wave](coworker-intern-preview-v1.gif) is an example.

The six 192×224 sheets contain four columns and four rows of 48×56 cells. Rows 0 and 1 hold the first colorway’s idle and reaction. Rows 2 and 3 hold the second colorway’s idle and reaction. Each row has four poses on an opaque magenta background, with the visible drawing contained in the upper 34 pixels.

`cast-v1.json` owns the captions and frame times. The layout builder assigns a cast member, colorway, and starting phase to each of the 30 existing seats. The room renderer switches texture frames only on visible workers. Entering the 120px circle plays a reaction once, then a fresh entry can trigger it after six seconds. The caption uses the existing one-time approach memo system.

The built-in imagegen studies and their prompts are saved alongside the native files. The Swift exporter keys, resizes and inks the studies on the native pixel grid. To rebuild:

```sh
swift assets/stage/coworkers/export-v1.swift assets/stage/coworkers
python3 assets/stage/start-area/build-layout.py
python3 assets/stage/start-area/build-art-data.py
python3 assets/stage/coworkers/validate.py
```

`qa/` contains before and after captures in the Bullpen and Conference Rooms, plus the matched 350-enemy runs. Tests ran in desktop and phone-sized viewports on the same machine with stats disabled. The measured mean was 96.3 to 97.4 FPS at 1280×800 and 97.1 to 97.5 FPS at 390×844. Both viewport measurements came from the same desktop browser.


## Native world poses (Nov 4, art only)
[New complete bodies and chairs](world/README.md) provide seated and standing sheets for the six room coworkers, with [animation review](world/review.html) and a hero/TJ scale check. These are pending runtime integration; the historical sheets above stay unchanged.
