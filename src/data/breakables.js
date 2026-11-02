// Smashable office props (Nov 2). Art: assets/breakables (ChatGPT). Lines: Gemini (docs/handoffs/gemini-writing-2.md).
// hp = hits to break (cracked at half). regrowMs = how long until it's back in one piece.
// loot: pizza = chance of Leftover Pizza (+3 HP), coins = how many 401(k) coins, gems = Wisdom gems, item = chance of a field item.
window.BREAKABLES = {
  regrowMs: 90000,
  linesEveryMs: 7000,  // at most one smash joke this often, so it never spams the bottom of the screen
  props: {
    printer:         { hp: 6, w: 80, h: 80,  rows: 1, loot: { pizza: 0.15, coins: 2, gems: 3 } },
    cabinet:         { hp: 6, w: 56, h: 88,  rows: 1, loot: { coins: 3, gems: 1 } },
    vending_machine: { hp: 8, w: 80, h: 128, rows: 3, loot: { pizza: 0.75, coins: 2 } },
    trash_recycle:   { hp: 3, w: 64, h: 64,  rows: 3, loot: { coins: 1, gems: 1 } },
    water_cooler:    { hp: 5, w: 64, h: 104, rows: 3, loot: { pizza: 0.35, coins: 1, gems: 2 } },
    lost_found:      { hp: 5, w: 80, h: 72,  rows: 3, loot: { item: 0.6, coins: 1 } },
    coat_rack:       { hp: 3, w: 64, h: 112, rows: 3, loot: { coins: 1, item: 0.2 } },
    crash_cart:      { hp: 6, w: 96, h: 112, rows: 3, loot: { coins: 2, gems: 3, item: 0.2 } },
    plant:           { hp: 2, w: 48, h: 64,  rows: 1, loot: { pizza: 0.45, coins: 1, gems: 1 } }
  },
  lines: {
    printer: ["PC Load Letter, my foot. Oh look, a warm bagel.", "That was for Tuesday. And also for every Tuesday since 2016.", "The magenta cartridge was full the whole time. You knew it."],
    cabinet: ["Seven years of receipts, finally set free. Tax season can wait.", "The bottom drawer was only stuck because of an old pair of sneakers.", "Everything labeled MISC has officially been resolved."],
    vending_machine: ["The spiral finally let go of the pretzels from 2022. You earned these.", "No more smoothing out crumpled dollar bills on the edge of your pants.", "B4 was stuck for a month. Consider this a public service."],
    trash_recycle: ["Mostly crumpled drafts of polite emails and one very good coupon.", "Three cold coffee cups and a stress ball that still has some squeeze left.", "Recycling is on Thursdays, but today is about survival."],
    water_cooler: ["It made one last majestic glug before going down. Stay hydrated.", "Five gallons of spring water and zero small talk. A clean break.", "The little paper cone cups are everywhere. Watch your step."],
    lost_found: ["Fourteen left gloves, three prescription reading glasses, and a decent umbrella.", "So that is where your good fleece vest went two winters ago.", "Nobody ever claims the Tupperware lids. Take one for luck."],
    coat_rack: ["Built to hold four jackets, bravely carrying nineteen since November.", "It wobbled with dignity for years. Grab the scarf and keep moving.", "Someone left a cough drop in that cardigan pocket. Today is your day."],
    crash_cart: ["The cloud is down. So is the cart. At least the loot is local.", "Forty pounds of monitor and one very brave caster.", "It finally found a resolution everyone can agree on."],
    plant: ["Turns out the ficus was plastic all along. You can stop feeling guilty now.", "Just potting soil, pebbles, and forty years of leftover coffee splashes.", "It survived three office moves and a fluorescent light shortage. Rest easy, little guy."]
  }
};
