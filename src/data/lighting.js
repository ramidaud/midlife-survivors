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
  replaceFloorMarks: true,                  // hide the old gray window and light-pool marks on the floor

  // Pass 2 (Nov 3): every room gets light from the things in it that would glow.
  // Any prop listed here becomes a light source automatically (skipped if a hand-placed anchor is already close).
  //   r: size of the pool   color: the light's tint   kind: which strength/glow numbers it uses   dy: nudge up or down
  propLights: {
    parking_light:        { r: 170, color: 0xffa64d, kind: "street", dy: 30 },  // sodium street lamps
    wellness_sad_lamp:    { r: 120, color: 0xe8f4ff, kind: "sad" },             // the SAD lamp: bright and cool
    wellness_zen_fountain:{ r: 70,  color: 0x5fd3c8, kind: "aquarium" },
    wellness_quiet_pod:   { r: 70,  color: 0xbfa8cf, kind: "soft" },
    wellness_nap_pod:     { r: 60,  color: 0xbfa8cf, kind: "soft" },
    offline_lamp:         { r: 80,  color: 0xffd08a, kind: "lamp" },
    vending_machine:      { r: 70,  color: 0x9fd8ff, kind: "vending" },
    water_cooler:         { r: 40,  color: 0x9fd8ff, kind: "soft" },
    kitchen_counter:      { r: 90,  color: 0xffd9a0, kind: "lamp" },             // under-cabinet lights
    coffee_cart:          { r: 50,  color: 0xff6a4a, kind: "soft" },             // the red power dot
    conference_table:     { r: 170, color: 0xeef6ff, kind: "ceiling" },          // fluorescent panels overhead
    executive_desk:       { r: 90,  color: 0x9fe0a0, kind: "lamp" },             // green banker's lamp
    skyline_window:       { r: 150, color: 0x9fb8ff, kind: "window" },
    award_trophy:         { r: 60,  color: 0xffd36a, kind: "soft" },
    reception_counter:    { r: 110, color: 0xffe2b0, kind: "lamp" },
    printer:              { r: 34,  color: 0x7cff9a, kind: "screen" }
  },
  propLightSkip: 70,                         // don't add a prop light within this many pixels of an existing one
  // New kinds: how much each clears the dark, and how strong its colored glow is
  extraKinds: {
    street:   { strength: 0.85, glow: 0.5,  flicker: 0.02 },
    ceiling:  { strength: 0.8,  glow: 0.14, flicker: 0 },
    sad:      { strength: 0.95, glow: 0.3,  flicker: 0 },
    aquarium: { strength: 0.6,  glow: 0.3,  flicker: 0.05 },
    soft:     { strength: 0.45, glow: 0.22, flicker: 0 }
  },
  // Each room has its own mood. Multiplies the darkness (below 1 = brighter, above 1 = darker).
  // It eases between rooms as you walk, so the change feels like stepping through a door.
  roomMood: { lobby: 0.8, bullpen: 1.0, breakroom: 0.9, conference: 0.95, executive: 0.9, wellness: 0.75, server: 1.25, parking: 1.45 },
  moodEase: 0.04,                            // how fast the mood changes as you cross rooms (0 to 1)
  // Once in a while a fluorescent panel in a meeting room sputters, the way they do at 4:55 PM
  ceilingSputter: { every: [9000, 20000], length: 900 },

  // Speed (Fable review, Nov 4): the darkness is drawn at this fraction of screen resolution, then scaled up.
  // It's soft anyway, so half size looks the same and is 4x fewer pixels.
  darkScale: 0.5,

  // Pass 3 (Nov 4, Rami: "can we get all?"): light from the action itself.
  //   flashes: quick lights that fade out (r = radius in px, r1 = grows to this radius, ms = how long)
  //   follow:  lights that stick to an enemy or boss while it's alive (pulse = how much it breathes, 0 to 1)
  //   strength: how much it clears the dark (0 to 1)   glow: how strong the colored light on the floor is
  dynamic: {
    maxFlashes: 12,        // at most this many quick lights at once (the oldest gives way)
    maxFollow: 10,         // at most this many enemy/boss lights at once (the closest win)
    flashes: {
      coffeeHit:   { r: 34,  color: 0xffb060, strength: 0.5,  glow: 0.35, ms: 170 },              // a coffee splash lands
      wordNo:      { r: 40,  r1: 1.1, color: 0xfff0cf, strength: 0.75, glow: 0.4, ms: 380 },      // "No." (r1 = times the shockwave radius)
      dadJoke:     { r: 1.0, color: 0xffe08a, strength: 0.6,  glow: 0.45, ms: 280 },              // Dad Joke (r = times the joke radius)
      cameraFlash: { r: 120, color: 0xffffff, strength: 1.0,  glow: 0.75, ms: 170 },              // Derek's camera
      levelUp:     { r: 80,  r1: 260, color: 0xfff0cf, strength: 0.85, glow: 0.35, ms: 750 },     // a level-up
      lootDrop:    { r: 70,  color: 0xffd36a, strength: 0.75, glow: 0.55, ms: 600 },              // a boss chest lands
      saladDrop:   { r: 50,  color: 0x9fe0a0, strength: 0.6,  glow: 0.45, ms: 450 }               // a Desk Salad lands
    },
    follow: {
      spamCall:    { r: 40,  color: 0x9fd8ff, strength: 0.45, glow: 0.35, pulse: 0.3, periodMs: 700 },   // the phone screen
      groupChat:   { r: 50,  color: 0x8ff0a8, strength: 0.55, glow: 0.45, onlyTyping: true },           // glows while "typing..."
      elite:       { r: 50,  color: 0xff5a4a, strength: 0.35, glow: 0.3,  pulse: 0.2, periodMs: 900 },   // red halo
      bigGem:      { r: 36,  color: 0xc45c4b, strength: 0.45, glow: 0.4,  pulse: 0.3, periodMs: 600 },   // the merged red gem
      boss:        { r: 90,  color: 0xffe2b0, strength: 0.55, glow: 0.22 },                              // any boss
      goldWatch:   { r: 140, color: 0xffd36a, strength: 0.7,  glow: 0.45, pulse: 0.35 },                 // pulses faster as 65 gets closer
      headlights:  { r: 70,  color: 0xfff6d8, strength: 0.9,  glow: 0.35, ahead: 85, spread: 18 }        // the V8's two headlights
    }
  }
};
