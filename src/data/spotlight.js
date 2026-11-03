// Spotlight cards (Nov 3): the big animated lower third for key moments (Rami's idea, Style B).
// Copy by Gemini (docs/handoffs/gemini-spotlight-cards.md); Claude picked the funniest option for each.
// line: max ~60 characters. tip: max ~55. Edit freely.
window.SPOTLIGHT = {
  durationMs: 6000,
  bosses: {
    performanceReview: { kicker: "ANNUAL EVALUATION", name: "PERFORMANCE REVIEW", line: "I brought a five-page rubric and a very sharp red pen.",
                         tip: "Sidestep when the clipboard flashes before it charges.", art: "assets/bosses/boss-performance-review-v1.png", edge: "#C45C4B", band: "#874C3B" },
    mortgageRefinance: { kicker: "ESCROW CLOSING", name: "30-YEAR MORTGAGE", line: "Initial here, here, and on all forty-two pages below.",
                         tip: "Keep your distance when it slams to dodge shockwaves.", art: "assets/bosses/boss-30-year-mortgage-v1.png", edge: "#EF9347", band: "#874C3B" },
    midlifeCrisis:     { kicker: "TEST DRIVE", name: "MIDLIFE CRISIS V8", line: "Forget the minivan, we are buying t-tops and leather!",
                         tip: "Dodge its wide skid laps and avoid the tire tracks.", art: "assets/bosses/boss-midlife-crisis-v8-v1.png", edge: "#C45C4B", band: "#874C3B" }
  },
  // Your hero's card at the start of every run. bio = who they are, style = how they play (placeholders by Claude; Gemini is polishing).
  hires: {
    officeWorker: { bio: "Twenty years at the same desk. Knows which stapler actually works.", style: "Balanced all-rounder. Starts with Coffee Splash.", kicker: "NOW ONBOARDING", name: "THE 9-TO-5ER", line: "Clocking in at nine sharp and not a minute earlier.", tip: "Balanced all-rounder built for a steady workday." },
    photographer: { bio: "Coaches the under-10s on Saturdays. Brings the chairs and the pep talks.", style: "Fast feet and a wide Dad Joke blast for crowd control.", kicker: "SIDELINE CAPTAIN", name: "THE SOCCER DAD", line: "I brought orange slices and a trunk full of chairs!", tip: "High-stamina hero with strong crowd-control energy." },
    gradStudent:  { bio: "Went back for a master's at 45. Sleeps between office hours.", style: "Huge gem magnet and quicker weapons. Levels up fast.", kicker: "FELLOWSHIP GRANT", name: "THE GRAD STUDENT", line: "Does this count for credit, or is it just exposure?", tip: "Fast-moving hero who levels up skills quickly." },
    coldWarCowboy: { bio: "In IT since 2002, back when the journalism school ran on floppies. He kept a box.", style: "Floppy Disk boomerang and +2 health. Once a run, he reboots everything.", kicker: "IT SINCE 2002", name: "THE COLD WAR COWBOY", line: "Back in my day, a gig was a gig. Now hand me that disk.", tip: "Floppy Disk boomerang. Once a run, he reboots everything." }
  },
  // Promotions: a coworker announces the new room. cast = which coworker sprite (START_AREA_COWORKERS).
  // Names match the sprites' own names from ChatGPT's cast sheet (Nov 3), with Gemini's departments.
  rooms: {
    breakroom:  { kicker: "PROMOTED", name: "ART FROM PAYROLL", cast: "salad", line: "The decaf pot is fresh and someone brought bagels.", tip: "The Lounge counter opens here after promotions." },
    parking:    { kicker: "GATE OPENED", name: "SAM AT THE FRONT DESK", cast: "retiring", line: "Careful around row B, Dave's idea still has a boot.", tip: "The Parking Lot is open with wide lanes for kiting." },
    server:     { kicker: "PROMOTED", name: "ELI FROM IT", cast: "intern", line: "Please do not unplug the rack with the yellow note.", tip: "The Server Room is now open. Watch the narrow aisles." },
    conference: { kicker: "MEETING INVITE", name: "NORA IN MARKETING", cast: "email", line: "We have been in Alignment since Tuesday. Grab a pen.", tip: "Conference Rooms are open. Use the side doors to loop." },
    executive:  { kicker: "KEYCARD UPGRADED", name: "JUNE FROM LEGAL", cast: "dozer", line: "Help yourself to a butterscotch from the credenza.", tip: "Explore the Executive Wing for high-value props." },
    wellness:   { kicker: "MANDATORY FUN", name: "MINA IN BENEFITS", cast: "mute", line: "The nap pod is broken, but the herbal tea is free.", tip: "The Wellness Corner is open for a peaceful breather." }
  },
  // First-time tips, once ever. The hero you're playing says it (a line per hero, falling back to "any").
  tips: {
    elite:     { kicker: "URGENT MEMO", tip: "Red-glowing elites hit harder and drop bonus loot.",
                 lines: { any: "Why is that one glowing red? Nobody put that on my cal.", photographer: "That big red one means business. Keep your knees bent!" } },
    chest:     { kicker: "BONUS APPROVED", tip: "Walk over the boss chest to claim upgrades and coins.",
                 lines: { any: "Wait, accounting actually signed off on a spot bonus?", gradStudent: "Actual funding! I am buying groceries with brand names!" } },
    evolution: { kicker: "SKILL EVOLVED", tip: "Evolved weapons clear swarms much faster than normal.",
                 lines: { any: "Finally, a workflow upgrade that actually saves time.", photographer: "Now we are cooking with gas! Look at that thing go!" } },
    lowHp:     { kicker: "PTO NEEDED", tip: "Health is low. Smash office props to find healing food.",
                 lines: { any: "My lower back is barking. Is there pizza in the kitchen?", gradStudent: "I am running on fumes and lukewarm vending machine tea." } }
  },
  heroNames: { officeWorker: "THE 9-TO-5ER", photographer: "THE SOCCER DAD", gradStudent: "THE GRAD STUDENT", coldWarCowboy: "THE COLD WAR COWBOY" },
  heroSheets: { officeWorker: "office-worker-on-break-v1", photographer: "soccer-dad-on-break-v1", gradStudent: "grad-student-on-break-v1", coldWarCowboy: "cold-war-cowboy-on-break-v3" }
};
