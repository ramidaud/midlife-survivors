// Weapon settings. Change a number, reload, and feel the difference.
window.WEAPONS = {
  coffeeSplash: {
    name: "Coffee Splash",
    fireEveryMs: 650,  // brisk auto-fire right from Level 1 so early Bills don't overwhelm you
    speed: 440,        // pixels per second the splash flies
    damage: 1,         // health removed per hit (a fresh Bill has 2 HP, so 2 splashes pay it off)
    range: 480,        // how far it flies before it evaporates, in pixels
    size: 12,
    color: 0x7b4a2a    // coffee brown
  },
  dadJoke: {
    name: "Dad Joke",
    fireEveryMs: 2600, // how often a cringe aura ripples out around you (gives time to read & hear the joke!)
    radius: 110,       // size of the groan circle, in pixels
    damage: 1,         // hits EVERY Bill inside the circle
    color: 0xe6c84f,   // cheesy yellow
    lines: [
      "Hi Hungry, I'm Dad!",
      "Working hard or hardly working?",
      "It's not the heat, it's the humidity!",
      "Didn't scan? Must be free!",
      "Who touched the thermostat?!",
      "I'm not sleeping, I'm resting my eyes!",
      "We're making great time on this drive!",
      "Looks like rain... we really needed this.",
      "Are we paying to air-condition the whole neighborhood?",
      "Let's rock and roll... right after my ibuprofen.",
      "I used to be with 'it', then they changed what 'it' was!",
      "Careful, that's load-bearing drywall!"
    ],
    seniorLines: [
      "In my day, coffee cost a nickel!",
      "Turn that racket down, it's 4:15 PM!",
      "My left knee says a storm's rolling in!",
      "Is this covered by Medicare Part B?",
      "If we leave now, we'll beat the 3 PM dinner rush!",
      "Get off my meticulously edged Bermuda grass!"
    ]
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
