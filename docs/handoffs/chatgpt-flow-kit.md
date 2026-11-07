# ChatGPT handoff: clean Flow kits (Nov 6)

Rami is making animated cut scenes in Google Flow. Flow's character builder needs one clean image per character, and scenes need empty backgrounds. Please make two sets. Read `assets/art-direction/STYLE_GUIDE.md` first and use its palette.

## Rules for everything
- No text, no logos, no UI, no watermarks.
- Exact match to the existing characters. Don't redesign outfits, colors or proportions.
- Save as PNG, named exactly as listed, into the folders below.
- Make a contact sheet of each set when done so Rami can review in one glance.

## Set 1: key-art character portraits
Folder: `art/flow-kit/key-art/clean/`

**For identity,** use the matching image in `art/flow-kit/` (for example `hero-soccer-dad.png`). **For style,** use `art/flow-kit/key-art/9to5er-keyart.png`, which matches the original office key art.

Every portrait:
- 1024x1024
- full body, three-quarter view, natural pose
- one character only
- **plain flat cream background (#F2D7A1),** with no floor shadow except a soft oval under the feet

| File | Character |
|---|---|
| keyart-9to5er.png | The 9-to-5er (redraw the existing key-art version on a clean background) |
| keyart-soccer-dad.png | Soccer Dad |
| keyart-grad-student.png | Grad Student |
| keyart-coldwar-cowboy.png | Coldwar Cowboy |
| keyart-june-from-legal.png | June from Legal |
| keyart-tj.png | TJ |
| keyart-derek.png | Derek (standing, camera on its orange strap) |
| keyart-bill.png | Bill. **Use the in-game look with the red stripe** (unless Rami says otherwise) |
| keyart-3am-thought.png | 3 AM Thought |
| keyart-group-chat.png | Group Chat |
| keyart-calendar-invite.png | Calendar Invite |
| keyart-spam-likely.png | Spam Likely |
| keyart-late-night-donut.png | Late-Night Donut |
| keyart-midlife-crisis.png | The Midlife Crisis (red convertible) |
| keyart-performance-review.png | Performance Review |
| keyart-30-year-mortgage.png | The 30-Year Mortgage |

**Two looks per character, if possible:** add a second file with `-pose2` on the end, showing the same character in a different action pose (running, attacking, or celebrating). Two angles help Flow keep them consistent.

## Set 2: empty background scenes
Folder: `art/flow-kit/backgrounds/`

Same painted key-art style as `assets/art-direction/office-key-art-v1.png`, but **with no characters, enemies or creatures anywhere.**

Every background:
- 1920x1080
- side-on or gentle three-quarter view
- an open, clear floor area in the middle third for characters to walk through
- **two versions of each:** `-day` and `-night`

| File | Place |
|---|---|
| bg-lobby | Office lobby: reception desk, glass doors, a big wall clock, potted plants |
| bg-bullpen | Rows of cubicles, CRT monitors, sticky notes, a jammed printer |
| bg-breakroom | Break room: coffee machine, fridge covered in notes, vending machine, round table |
| bg-conference | Conference room: long table, whiteboard full of arrows, sad projector |
| bg-server-room | Server racks with blinking lights, a cable waterfall, one rack with a yellow sticky note |
| bg-executive-wing | Executive office: skyline window, credenza with crystal triangles and a candy dish, putting mat, founder portrait |
| bg-wellness-corner | Yoga mats, nap pod, zen fountain, a SAD lamp, motivational banner |
| bg-parking-lot | Office parking lot at the curb, light poles, a cart corral, one compact car |
| bg-student-lounge | Campus student lounge: couches, a snack counter, posters, backpacks |
| bg-retirement-party | The office decorated for a retirement party: banner (no lettering), cake, balloons, streamers |

## Claude's review of the background set (Nov 7)
Approved. The set is consistent, has no people in it, and leaves clear walkways. Go ahead with Set 1 (characters). Two small fixes when you have a minute:
- **bg-lobby-night:** the floor turned solid russet red. At night it should be the same cream tile dimmed to slate blue, with maybe one warm pool of light from the desk lamp. (Your palette step probably snapped the dimmed cream to russet.) Check **bg-executive-wing-night** and **bg-retirement-party-night** for the same orange smear on the floor.
- **bg-server-room (both):** the sticky note reads as a cream square. Add a coffee-orange (#EF9347) strip across its top, like the in-game note, so it reads as "the yellow note."
