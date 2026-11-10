// Title screen slideshow (Nov 3). The key art cycles behind the title with a slow push-in and a crossfade.
// Add, remove or reorder slides freely. Images live in assets/title-screen/slides/.
//   focus:  the subject of the picture (x% y%). The crop keeps it in view on every screen,
//           and the slow motion grows from that point.
//   move:   "reveal" starts tight on the subject and pulls back; "push" drifts slowly in toward it
//   pointer: true only for art with the time clock on the left (Punch In points at it)
//   wideOnly: true skips the slide on phones and portrait tablets (art that can't be cropped tall).
//   live:   a folder with a live scene (plate + sprite strips + scene.json, src/live-scene.js). It plays over the still
//           picture; move "still" turns off the slow push-in so the camera never moves.
window.TITLE_ART = {
  holdMs: 9000,   // how long each slide stays up
  fadeMs: 2400,   // crossfade length
  zoom: 1.08,     // how far the motion travels (1 = none). Small and slow reads smoothest
  shuffle: true,  // Nov 8 (Rami): after the first slide, play the rest in a random order (false = the order below)
  // V2 key art (ChatGPT, Nov 3): each scene has a desktop version and a separately drawn portrait version for phones,
  // composed so the cast sits where the title screen's UI leaves room (docs/handoffs/chatgpt-key-art-v2.md).
  //   srcPortrait / focusPortrait: used on phones and portrait tablets. focusTablet: the crop on portrait tablets (700 px+ wide),
  //   which show more of the top and bottom, so the cast needs nudging up to clear Punch In.
  //   stage:  "home" marks Maple Hollow art. When Maple Hollow is picked, those slides lead; otherwise they mix in as a teaser.
  slides: [
    { src: "assets/title-screen/slides/08-group-photo-desktop.jpg", srcPortrait: "assets/title-screen/slides/08-group-photo-portrait-v3.jpg", name: "Group Photo",    focus: "74% 26%", focusPortrait: "50% 62%", focusTablet: "50% 96%", move: "reveal", pointer: false },
    { src: "assets/title-screen/slides/09-reboot-desktop.jpg",      srcPortrait: "assets/title-screen/slides/09-reboot-portrait-v3.jpg",      name: "Off and On Again", focus: "72% 26%", focusPortrait: "50% 62%", focusTablet: "50% 96%", move: "push",   pointer: false },
    { src: "assets/title-screen/slides/10-lounge-desktop.jpg",      srcPortrait: "assets/title-screen/slides/10-lounge-portrait-v3.jpg",      name: "The Lounge",      focus: "72% 26%", focusPortrait: "50% 62%", focusTablet: "50% 96%", move: "reveal", pointer: false },
    { src: "assets/title-screen/slides/11-coffee-run-desktop.jpg",  srcPortrait: "assets/title-screen/slides/11-coffee-run-portrait-v3.jpg",  name: "Coffee Run",      focus: "74% 28%", focusPortrait: "50% 62%", focusTablet: "50% 96%", move: "push",   pointer: false },
    { src: "assets/title-screen/slides/12-happy-50th-desktop.jpg",  srcPortrait: "assets/title-screen/slides/12-happy-50th-portrait-v3.jpg",  name: "Happy 50th",      focus: "74% 26%", focusPortrait: "50% 62%", focusTablet: "50% 96%", move: "reveal", pointer: false },
    // Rami's favorites, back by request (Nov 4). Desktop art only, so phones show a crop around focusPortrait.
    { src: "assets/title-screen/slides/05-promoted.jpg",    name: "Promoted",         focus: "50% 56%", focusPortrait: "45% 55%", move: "reveal", pointer: false },
    { src: "assets/title-screen/slides/06-late-night.jpg",  name: "11:58 PM",         focus: "27% 60%", focusPortrait: "24% 62%", move: "still",  pointer: false, art: "Grok",
      live: "assets/title-screen/live/late-night/play/" }, // a live scene (Nov 7): he breathes, blinks and sips; Bill stomps. No camera motion.
    { src: "assets/title-screen/slides/11-performance-review.jpg", name: "Performance Review", focus: "55% 50%", move: "still", pointer: false, wideOnly: true,
      live: "assets/title-screen/live/performance-review/play/" }, // Nov 8 (Rami): the boss intro as a title slide, title card baked in. Wide screens only (a phone crop cuts the card).
    { src: "assets/title-screen/slides/04-chase.jpg",       name: "The Long Way",     focus: "50% 58%", focusPortrait: "50% 55%", move: "push",   pointer: false },
    { src: "assets/title-screen/slides/02-swarm.jpg",       name: "The Swarm",        focus: "48% 60%", focusPortrait: "50% 62%", move: "reveal", pointer: false },
    // Maple Hollow (Nov 10, ChatGPT/Codex): drawn for the title layout, desktop + portrait.
    { src: "assets/title-screen/slides/13-maple-hollow-desktop.jpg",    srcPortrait: "assets/title-screen/slides/13-maple-hollow-portrait.jpg",    name: "Welcome to Maple Hollow", focus: "72% 26%", focusPortrait: "50% 62%", focusTablet: "50% 96%", move: "reveal", pointer: false, stage: "home" },
    { src: "assets/title-screen/slides/14-not-the-minivan-desktop-v2.jpg", /* v2 Nov 10: four wheels, not six */ srcPortrait: "assets/title-screen/slides/14-not-the-minivan-portrait.jpg", name: "That's Not the Minivan",  focus: "72% 26%", focusPortrait: "50% 62%", focusTablet: "50% 96%", move: "push",   pointer: false, stage: "home" }
  ],
  // V1 slides still retired (Nov 3: the title UI covers their main characters). Move any back into slides[] to reuse it.
  retired: [
    { src: "assets/title-screen/slides/01-lobby.jpg",       name: "8:59 AM",          focus: "9% 42%",  move: "reveal", pointer: true },
    { src: "assets/title-screen/slides/03-panorama.jpg",    name: "Forty to Forever", focus: "19% 66%", move: "push",   pointer: false },
    { src: "assets/title-screen/slides/07-retirement.jpg",  name: "Happy Retirement", focus: "22% 52%", move: "reveal", pointer: false, art: "Grok" }
  ]
};
