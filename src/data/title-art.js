// Title screen slideshow (Nov 3). The key art cycles behind the title with a slow push-in and a crossfade.
// Add, remove or reorder slides freely. Images live in assets/title-screen/slides/.
//   pos:       which part of the picture stays in view on wide screens (CSS background-position)
//   phonePos:  the same for phones and iPad portrait, where the picture is cropped hard
//   pointer:   true only for art with the time clock on the left (Punch In points at it)
//   drift:     direction of the slow push-in: "left", "right", "up", "down" or "in"
window.TITLE_ART = {
  holdMs: 9000,   // how long each slide stays up
  fadeMs: 1800,   // crossfade length
  zoom: 1.07,     // how far the push-in goes (1 = none)
  slides: [
    { src: "assets/title-screen/slides/01-lobby.jpg",     name: "8:59 AM",          pos: "50% 50%", phonePos: "14% 50%", pointer: true,  drift: "right" },
    { src: "assets/title-screen/slides/02-swarm.jpg",     name: "The Swarm",        pos: "50% 60%", phonePos: "46% 62%", pointer: false, drift: "in" },
    { src: "assets/title-screen/slides/03-panorama.jpg",  name: "Forty to Forever", pos: "50% 55%", phonePos: "30% 70%", pointer: false, drift: "left" },
    { src: "assets/title-screen/slides/04-chase.jpg",     name: "The Long Way",     pos: "50% 45%", phonePos: "48% 50%", pointer: false, drift: "up" },
    { src: "assets/title-screen/slides/05-promoted.jpg",  name: "Promoted",         pos: "50% 62%", phonePos: "50% 62%", pointer: false, drift: "down" },
    { src: "assets/title-screen/slides/06-late-night.jpg", name: "11:58 PM",        pos: "50% 60%", phonePos: "18% 60%", pointer: false, drift: "right", art: "Grok" },
    { src: "assets/title-screen/slides/07-retirement.jpg", name: "Happy Retirement", pos: "50% 50%", phonePos: "16% 50%", pointer: false, drift: "left", art: "Grok" }
  ]
};
