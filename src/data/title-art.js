// Title screen slideshow (Nov 3). The key art cycles behind the title with a slow push-in and a crossfade.
// Add, remove or reorder slides freely. Images live in assets/title-screen/slides/.
//   focus:  the subject of the picture (x% y%). The crop keeps it in view on every screen,
//           and the slow motion grows from that point.
//   move:   "reveal" starts tight on the subject and pulls back; "push" drifts slowly in toward it
//   pointer: true only for art with the time clock on the left (Punch In points at it)
window.TITLE_ART = {
  holdMs: 9000,   // how long each slide stays up
  fadeMs: 2400,   // crossfade length
  zoom: 1.08,     // how far the motion travels (1 = none). Small and slow reads smoothest
  slides: [
    { src: "assets/title-screen/slides/01-lobby.jpg",       name: "8:59 AM",          focus: "9% 42%",  move: "reveal", pointer: true },
    { src: "assets/title-screen/slides/02-swarm.jpg",       name: "The Swarm",        focus: "48% 60%", move: "reveal", pointer: false },
    { src: "assets/title-screen/slides/03-panorama.jpg",    name: "Forty to Forever", focus: "19% 66%", move: "push",   pointer: false },
    { src: "assets/title-screen/slides/04-chase.jpg",       name: "The Long Way",     focus: "50% 58%", move: "push",   pointer: false },
    { src: "assets/title-screen/slides/05-promoted.jpg",    name: "Promoted",         focus: "50% 56%", move: "reveal", pointer: false },
    { src: "assets/title-screen/slides/06-late-night.jpg",  name: "11:58 PM",         focus: "27% 60%", move: "push",   pointer: false, art: "Grok" },
    { src: "assets/title-screen/slides/07-retirement.jpg",  name: "Happy Retirement", focus: "22% 52%", move: "reveal", pointer: false, art: "Grok" }
  ]
};
