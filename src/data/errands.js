// Errands (Nov 8, Fun Pass #11, "first twist"). One errand per run for now, so Rami can feel whether it's fun.
// A TO-DO card pops up, a marker appears on the map and the floor, and an arrow points the way.
// Walk there before the timer runs out for a reward. Missing it costs nothing.
// Edit freely: text is what the card says, at is where you go (map px), room must be open by then,
// place is where it is, in plain words (shown on the card), reward is one of { coins: N } (thousands, like the 401k), { heal: N } (HP), { levels: N }.
window.ERRAND_SETTINGS = {
  on: true,
  perRun: 3,          // how many errands each run (was 1; Nov 9, Rami: "open that up a little more")
  gapSec: 120,        // seconds of quiet after one errand ends before the next can show up
  startAge: 41.5,     // the first errand shows up at this age (about a minute in)
  timeSec: 45,        // seconds to get there
  minDistance: 1100,  // pick an errand at least this far from you, so it's a walk
  reachPx: 80,        // how close counts as "there"
  // Nov 9 (Rami's playtest): every finished errand also pays this, on top of its own reward.
  payoff: {
    clearRadius: 320,   // a shockwave clears regular enemies this close to you (bosses and elites stay)
    xpLevelFrac: 0.5,   // bonus XP: half of what your current level needs
    buffMs: 15000,      // "CHECKED OFF": 15 seconds of...
    damageMult: 1.5,    // ...+50% damage
    xpMult: 1.5         // ...and +50% XP from gems
  }
};

window.ERRANDS = [
  { id: "printing", place: "the printer in the Bullpen",  text: "Pick up your printing before someone reads it.", at: [2318, -870], room: "bullpen", reward: { coins: 40 }, done: "Got it. Nobody saw page 3." },
  { id: "snack", place: "the kitchen counter in the Bullpen",     text: "Grab a snack before the 2:00 meeting.",           at: [3110, 410],  room: "bullpen", reward: { heal: 3 },   done: "Fueled up. The meeting could have been an email." },
  { id: "roadmap", place: "the roadmap whiteboard in the Bullpen",   text: "Update the roadmap whiteboard. Again.",           at: [4040, -480], room: "bullpen", reward: { levels: 1 }, done: "Roadmap updated. Q3 is now Q4." },
  { id: "fruitTree", place: "the fruit tree in the Bullpen", text: "Water the office fruit tree. Nobody else will.",  at: [3090, -290], room: "bullpen", reward: { coins: 40 }, done: "Watered. It looks slightly less disappointed." },
  { id: "water", place: "the water cooler in the Lobby",     text: "Refill your water bottle. Hydration is a lifestyle.", at: [990, -430], room: "lobby", reward: { heal: 3 }, done: "Hydrated. Your doctor would be proud." }
];
