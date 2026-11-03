// Lighting (Nov 3). A dim office with warm pools of light that gets moodier as you age.
// Light sources come from ChatGPT's anchors in START_AREA_LAYOUT.lights (lamps, windows, vending machines,
// server racks, screens). Tweak the numbers freely. enabled: false turns it all off.
window.LIGHTING = {
  enabled: true,
  darkness: 0x0a0e20,                       // the color of the dark (deep navy, never pure black)
  darkByAge: [[40, 0.40], [45, 0.45], [50, 0.50], [55, 0.55], [60, 0.59], [65, 0.63], [80, 0.68]], // how dark it gets (0 = off, 1 = black)
  radiusMult: 1.45,                          // light pools are this much bigger than the anchor radius
  playerRadius: 230,                        // the light that follows you
  playerStrength: 0.92,                     // 1 = fully clears the dark around you
  chestRadius: 120,                         // boss chests glow through the dark
  lightStrength: { lamp: 0.75, window: 0.8, vending: 0.65, server: 0.55, screen: 0.4 },
  glow: { lamp: 0.34, window: 0.26, vending: 0.34, server: 0.3, screen: 0.22 }, // colored glow on top
  flicker: { screen: 0.06, server: 0.05 }, // tiny shimmer on screens and server lights
  replaceFloorMarks: true                   // hide the old gray window and light-pool marks on the floor
};
