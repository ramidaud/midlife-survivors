// Weapon settings. Change a number, reload, and feel the difference.
window.WEAPONS = {
  coffeeSplash: {
    name: "Coffee Splash",
    fireEveryMs: 1000, // one splash per second. Try 300 for a triple espresso
    speed: 400,        // pixels per second the splash flies
    damage: 1,         // health removed per hit. A Bill has 2, so it takes 2 splashes
    range: 450,        // how far it flies before it evaporates, in pixels
    size: 12,
    color: 0x7b4a2a    // coffee brown
  },
  dadJoke: {
    name: "Dad Joke",
    fireEveryMs: 2200, // how often a cringe aura ripples out around you
    radius: 105,       // size of the groan circle, in pixels
    damage: 1,         // hits EVERY Bill inside the circle
    color: 0xe6c84f,   // cheesy yellow
    lines: ["Hi Hungry, I'm Dad!", "Working hard or hardly working?", "It's a dry heat.", "Must be free!"]
  },
  wordNo: {
    name: 'The Word "No."',
    fireEveryMs: 3200, // how often you put your foot down
    radius: 140,       // reach of the shockwave
    damage: 1,         // damage dealt
    pushPx: 95,        // how far Bills get shoved backward
    color: 0x6fd9c4    // calm boundary teal
  }
};
