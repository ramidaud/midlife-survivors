# ChatGPT brief: title-screen key art v2, five scenes with the new cast (Nov 3, 2026)

Thanks for the coworker portraits. They're live on the room cards in V. 1.69.0. Next job: new key art for the title screen slideshow, because the current slides weren't drawn for the title layout we ended up with.

## The problem
The title screen covers most of the picture:
- **Desktop:** the title sits top-left, and the tiles (employee file, today's shift, devlog note) cover the **bottom 56%**. The main characters in the current art (the 9-to-5er at the punch clock, the hero in the swarm) end up hidden behind the title or the tiles.
- **Phone:** the screen is tall, so it only shows a narrow middle slice of a wide image, and the tiles cover everything below Punch In.

Look at these two guides first. **Green is the only place where the main characters stay visible.**
- `docs/handoffs/img/title-zones-desktop.png`: hero zone is **x 47–97%, y 9–43%** of the screen (top right).
- `docs/handoffs/img/title-zones-phone.png`: hero zone is **y 31–46%**, nearly full width (the band between the title and Punch In).

## So: two versions of every scene
1. **Desktop:** 1920×1080. The main action sits in the **upper right** (about x 950–1850, y 100–470). The left third and the bottom half are environment only (floor, furniture, soft background clutter, small enemies). They can be busy but should be lower contrast, because UI sits on top of them.
2. **Portrait:** 1080×1920, the same scene **recomposed** (not a crop). The main action sits in the band **y 600–880**, centered. Above it (y 0–580): ceiling, wall or windows, kept quiet. Below it (y 900–1920): floor and small details, lower contrast.

## Style (same as the existing slides)
Crisp handmade 16-bit pixel art, top-down three-quarter view, the game's palette only: cream #F2D7A1, navy #171C35, slate #303750, muted blue #526078, teal #3E7775, sage #83A89A, khaki #D3B78D, coffee orange #EF9347, warm white #FFF0CF, tie red #C45C4B, lavender #BFA8CF, donut pink #F1B5BF. Warm upper-left light, contact shadows, hard pixel clusters, no anti-aliasing. **No text, letters, numbers or logos anywhere.** Paper marks are abstract bars. Warm and funny, never mean.

## Cast reference (use the repo sheets as the identity reference)
- **The 9-to-5er** (`assets/characters/portraits/office-worker-on-break-v1.png`): middle-aged man, black rectangular glasses, messy brown hair graying at the temples, white short-sleeve shirt, loose red tie, khaki slacks, brown loafers, orange coffee mug.
- **The Soccer Dad** (`soccer-dad-on-break-v1.png`): ball cap, short beard, teal polo, shorts, soccer ball under one arm.
- **The Grad Student at 45** (`grad-student-on-break-v1.png`): woman with brown hair in a top bun, round glasses, lavender cardigan, notebook.
- **The Cold War Cowboy (Ben)** (`cold-war-cowboy-on-break-v3.png`): tan felt cowboy hat tipped back, long wavy brown hair, friendly half-smile, navy blazer over a light blue collar, ID badge, brown pants, cream floppy disk.
- **TJ, intern** (`intern-tj-on-break-v1.png`): young Black man, big toothy grin, glasses, gray beanie with a small patch, black parka, khaki pants, takeaway coffee cup.
- **Derek, intern** (`intern-derek-on-break-v1.png`): young man, dark curly hair, full beard, glasses, dark jacket, camera on a bright strap.
- **Coworkers** (`assets/stage/coworkers/portraits/`): Art (salad), Sam (retiring), Eli (intern), Nora (email), June (dozer), Mina (mute). Use their sheets as-is.
- **Enemies:** angry paper Bills, Spam Likely phones, donuts, Late Fees, emails. **Bosses:** the Performance Review (clipboard), the 30-Year Mortgage (angry house), the Midlife Crisis V8 (red convertible).

## The five scenes
Fill in each JSON as the prompt (one image per request), once for desktop and once for portrait.

### 08 · Group Photo
```json
{
  "scene": "Office group photo in the bullpen. Derek crouches in the foreground with his camera raised, and the flash pops in one bright cream starburst. The four heroes pose together: the 9-to-5er raising his mug, the Soccer Dad with the ball on his hip, the Grad Student holding up her notebook, and the Cold War Cowboy tipping his hat. TJ squeezes in at the edge with a coffee tray. One angry paper Bill photobombs from behind a cubicle wall.",
  "focus": "the posed group and the flash",
  "mood": "proud, a little chaotic, the calm before the swarm",
  "quiet_areas": "desk islands and carpet outside the hero zone; a few tiny Bills peeking in at the far edges",
  "lighting": "warm fluorescent from the upper left, flash glow on faces"
}
```

### 09 · Turn It Off and On Again
```json
{
  "scene": "The Server Room. The Cold War Cowboy stands at a big wall power switch, hand on the lever, hat tipped back, mid-reboot. A cream floppy disk spins through the air like a boomerang. All around him the swarm of Bills, emails and Spam Likely phones freezes mid-leap, outlined in a pale teal 'powering down' glow. The racks' status lights blink back on in a wave from left to right.",
  "focus": "Ben at the switch and the frozen swarm right around him",
  "mood": "deadpan hero moment, the IT guy saves the day",
  "quiet_areas": "dark rack aisles with low-detail blinking lights",
  "lighting": "cool teal rack glow plus one warm overhead light on Ben"
}
```

### 10 · The Lounge Is Open
```json
{
  "scene": "The Break Room counter with a small striped awning. TJ works the register with a huge grin, holding up a coffee. Derek restocks a shelf of snacks behind him. The 9-to-5er and the Grad Student wait in line, coins in hand. Outside the window, the swarm presses its angry paper faces against the glass, waiting.",
  "focus": "the counter, TJ and the line",
  "mood": "a cozy break in the middle of a bad day",
  "quiet_areas": "fridge, coffee cart, tables and the window wall",
  "lighting": "warm pendant light over the counter, cooler window light"
}
```

### 11 · Coffee Run
```json
{
  "scene": "TJ and Derek sprint across the bullpen. TJ balances a tray of four coffees, and Derek clutches a snack bag and his camera. A crowd of Bills, Late Fees and a donut chase them, close behind. Ahead of them, the Soccer Dad waves them in like a coach, and the Cold War Cowboy holds a door open.",
  "focus": "the two interns mid-stride and the chase right behind them",
  "mood": "slapstick action, motion and speed",
  "quiet_areas": "rows of desks and chairs streaming past in the background",
  "lighting": "even office light with a warm patch where they're running to"
}
```

### 12 · Happy 50th
```json
{
  "scene": "A surprise office birthday. The coworkers Art, Sam, Eli, Nora, June and Mina gather around a sheet cake with a big cream frosting swirl and lit candles, wearing party hats and cheering. The 9-to-5er looks shocked and touched, mug in hand. Through the window behind them, the Midlife Crisis V8 revs in the parking lot, headlights on, waiting its turn.",
  "focus": "the coworkers, the cake and the hero",
  "mood": "warm and funny: midlife is hard and also kind of great",
  "quiet_areas": "conference table, streamers and balloons, the parking lot through the window",
  "lighting": "candle glow on faces, headlight glare through the window"
}
```

## Files
- `assets/title-screen/slides/08-group-photo-desktop.jpg` and `08-group-photo-portrait.jpg`, and the same pattern for `09-reboot`, `10-lounge`, `11-coffee-run` and `12-happy-50th` (JPG, quality about 88, exact sizes).
- **A check image per scene:** each version with the matching zone guide laid over it at 50% opacity, so you can confirm the cast stays in the green zone. Save them as `assets/title-screen/qa-v2/<name>-check.png`.
- Put the prompts in `assets/title-screen/prompts-v2/`.

## When done
Pull first (`git pull`). Commit art, prompts and docs only, push to main, and log it in `docs/handoffs/chatgpt-changes.md`. Claude will add the slides to `src/data/title-art.js`, add phone support for the portrait versions, and retire the old slides that don't fit.
