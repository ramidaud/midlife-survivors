// Spotlight cards (Nov 3): the big animated lower third for key moments (Rami's idea, Style B).
// Copy by Gemini (docs/handoffs/gemini-spotlight-cards.md); Claude picked the funniest option for each.
// line: max ~60 characters. tip: max ~55. Edit freely.
window.SPOTLIGHT = {
  durationMs: 6000,
  bossMs: 3500,       // boss arrival cards (design system A4, Nov 10): short, so the band is gone before the second attack
  bosses: {
    performanceReview: { kicker: "ANNUAL EVALUATION", name: "PERFORMANCE REVIEW", line: "I brought a five-page rubric and a very sharp red pen.",
                         tip: "Sidestep when the clipboard flashes before it charges.", art: "assets/bosses/boss-performance-review-v1.png", edge: "#C45C4B", band: "#874C3B" },
    newBoss:           { kicker: "NEW MANAGEMENT", name: "YOUR NEW BOSS (26)", line: "Hey fam, let's disrupt Q3 and sync on your vibes!",
                         tip: "Step off the arrows, then hit him while he catches his breath.", art: "assets/bosses/boss-new-boss-v1.png", edge: "#BFA8CF", band: "#874C3B" },
    holidayParty:      { kicker: "MANDATORY FESTIVITIES", name: "THE HOLIDAY PARTY", line: "Put on your light-up sweater and join the conga line!",
                         tip: "The conga line protects her. Break it, then hit her. Keep moving under the mistletoe.", art: "assets/bosses/boss-holiday-party-v1.png", edge: "#C45C4B", band: "#874C3B" },
    theReorg:          { kicker: "ORG CHART UPDATE", name: "THE REORG", line: "Good news, you now report to four different pods!",
                         tip: "Watch the arrows, not the desks. Use a Hot Desk as a wall.", art: "assets/bosses/boss-reorg-v1.png", edge: "#526078", band: "#303750" },
    mortgageRefinance: { kicker: "ESCROW CLOSING", name: "30-YEAR MORTGAGE", line: "Initial here, here, and on all forty-two pages below.",
                         tip: "Keep your distance when it slams to dodge shockwaves.", art: "assets/bosses/boss-30-year-mortgage-v1.png", edge: "#EF9347", band: "#874C3B" },
    midlifeCrisis:     { kicker: "TEST DRIVE", name: "MIDLIFE CRISIS V8", line: "Forget the minivan, we are buying t-tops and leather!",
                         tip: "Dodge its wide skid laps and avoid the tire tracks.", art: "assets/bosses/boss-midlife-crisis-v8-v1.png", edge: "#C45C4B", band: "#874C3B" },
    goldWatch:         { kicker: "YEARS OF SERVICE", name: "THE GOLD WATCH", line: "Forty years of watching the clock, now it watches you.",
                         tip: "You can't stop it. Hit it to buy time until 65.", art: "assets/bosses/boss-gold-watch-v1.png", edge: "#D9A441", band: "#874C3B" },
    // Full Life bosses (Nov 4, art by ChatGPT)
    allHands:          { kicker: "MANDATORY", name: "THE QUARTERLY ALL-HANDS", line: "Forty-seven slides. Cameras on. Hold your questions.",
                         tip: "Read the slide on the floor, not the screen.", edge: "#526078", band: "#303750" },
    mathHomework:      { kicker: "DUE TOMORROW", name: "5TH-GRADE MATH HOMEWORK", line: "Show your work. No, the new way. Not how YOU learned it.",
                         tip: "When the dotted lines appear, stand in a gap.", art: "assets/bosses/boss-math-homework-v1.png", edge: "#EF9347", band: "#874C3B" },
    hoaPresident:      { kicker: "BOARD MEETING", name: "THE HOA PRESIDENT", line: "Your mailbox is two inches too festive. We need to talk.",
                         tip: "Sidestep when the yardstick goes up before it charges.", art: "assets/bosses/boss-hoa-president-v1.png", edge: "#EF9347", band: "#874C3B" },
    retirementBoss:    { kicker: "FINAL PAPERWORK", name: "RETIREMENT AUDIT", line: "Please verify every pension statement since 1987.",
                         tip: "Slip through the checkmark gap in each ring of forms.", art: "assets/bosses/boss-retirement-audit-v1.png", edge: "#D3B78D", band: "#874C3B" },
    pickleballChamp:   { kicker: "COURT RESERVED", name: "PICKLEBALL CHAMP", line: "Courts open at six. I've been here since 5:15.",
                         tip: "Watch for the circle, then dodge the sliding lunge.", art: "assets/bosses/boss-pickleball-champ-v1.png", edge: "#83A89A", band: "#874C3B" }
  },
  // Your hero's card at the start of every run. bio = who they are, style = how they play (copy by Gemini, Nov 3).
  hires: {
    officeWorker: { bio: "Two decades in the bullpen. Can spot a Reply-All storm from a mile away.", style: "Balanced all-rounder who starts every shift with a hot Coffee Splash.", kicker: "NOW ONBOARDING", name: "THE 9-TO-5ER", line: "Clocking in at nine sharp and not a minute earlier.", tip: "Balanced all-rounder built for a steady workday." },
    photographer: { bio: "Coaches the under-10s on Saturdays. Trunk is full of folding chairs.", style: "Fast feet and a wide Dad Joke blast built for crowd control.", kicker: "SIDELINE CAPTAIN", name: "THE SOCCER DAD", line: "I brought orange slices and a trunk full of chairs!", tip: "High-stamina hero with strong crowd-control energy." },
    gradStudent:  { bio: "Started grad school at 45. Writes citations between afternoon naps.", style: "Huge gem magnet and faster cooldowns to level up in a hurry.", kicker: "FELLOWSHIP GRANT", name: "THE GRAD STUDENT", line: "Does this count for credit, or is it just exposure?", tip: "Fast-moving hero who levels up skills quickly." },
    coldWarCowboy: { bio: "Started in Kent State J-school IT in 2002. Still kept a box of floppies.", style: "Floppy Disk boomerang, +2 health, and one full system reboot per run.", kicker: "IT SINCE 2002", name: "THE COLDWAR COWBOY", line: "Back in my day, a gig was a gig. Now hand me that disk.", tip: "Floppy Disk boomerang. Once a run, he reboots everything." }
  },
  // Promotions: a coworker announces the new room. cast = which coworker sprite (START_AREA_COWORKERS).
  // Names match the sprites' own names from ChatGPT's cast sheet (Nov 3), with Gemini's departments.
  rooms: {
    breakroom:  { kicker: "PROMOTED", name: "ART FROM PAYROLL", cast: "salad", line: "The decaf pot is fresh and someone brought bagels.", tip: "The Lounge counter opens here after promotions." },
    parking:    { kicker: "GATE OPENED", name: "SAM AT THE FRONT DESK", cast: "retiring", line: "Careful around row B, Dave's idea still has a boot.", tip: "The Parking Lot is open with wide lanes for kiting." },
    server:     { kicker: "PROMOTED", name: "ELI FROM IT", cast: "intern", line: "Please do not unplug the rack with the yellow note.", tip: "Also, stop loitering at the closet badge reader. It is NOT supposed to let you in." },
    conference: { kicker: "MEETING INVITE", name: "NORA IN MARKETING", cast: "email", line: "We have been in Alignment since Tuesday. Grab a pen.", tip: "Conference Rooms are open. Use the side doors to loop." },
    executive:  { kicker: "KEYCARD UPGRADED", name: "JUNE FROM LEGAL", cast: "dozer", line: "Help yourself to a butterscotch from the credenza.", tip: "Explore the Executive Wing for high-value props." },
    wellness:   { kicker: "MANDATORY FUN", name: "MINA IN BENEFITS", cast: "mute", line: "The nap pod is broken, but the herbal tea is free.", tip: "The Wellness Corner is open for a peaceful breather." }
  },
  // First-time tips, once ever. The hero you're playing says it (a line per hero, falling back to "any").
  tips: {
    // Lines per hero by Gemini (Nov 3, docs/handoffs/gemini-tip-lines.md); Claude picked the funniest of two and
    // smoothed contractions. "any" is the fallback for heroes without a line.
    elite:     { topic: "RED-GLOWING ELITES", kicker: "URGENT MEMO", tip: "Red-glowing elites hit harder and drop bonus loot.",
                 lines: { any: "Why is that one glowing red? Nobody put that on my cal.",
                          officeWorker: "That one's glowing red, so I'm billing overtime.",
                          photographer: "Keep your knees bent, that glowing red one has hustle!",
                          gradStudent: "Great, a peer reviewer with a red pen and an attitude.",
                          coldWarCowboy: "Whoa, somebody overclocked that guy way past factory." } },
    chest:     { topic: "BOSS CHESTS", kicker: "BONUS APPROVED", tip: "The boss chest comes to you: upgrades and coins inside.",
                 lines: { any: "Wait, accounting actually signed off on a spot bonus?",
                          officeWorker: "A real bonus, and it's not even a pizza party.",
                          photographer: "Look at that chest, the whole sideline earned this one!",
                          gradStudent: "Actual funding, and I didn't even have to write a paper!",
                          coldWarCowboy: "Hot diggity dog. Better than twenty bucks in an old PC." } },
    evolution: { topic: "EVOLVED WEAPONS", kicker: "PEAK SYNERGY", tip: "Evolved weapons clear swarms much faster than normal.",
                 lines: { any: "Finally, a workflow upgrade that actually saves time.",
                          officeWorker: "Now that's what I call cross-functional synergy.",
                          photographer: "That's varsity-level gear right there. Great hustle!",
                          gradStudent: "Consider that weapon officially defended and published.",
                          coldWarCowboy: "That's like jumping from dial-up straight to a T1 line." } },
    lowHp:     { topic: "LOW HEALTH", kicker: "PTO NEEDED", tip: "Health is low. Smash office props to find healing food.",
                 lines: { any: "My lower back is barking. Is there pizza in the kitchen?",
                          officeWorker: "I'm one minor inconvenience away from using sick leave.",
                          photographer: "Calling a quick timeout, somebody pass the orange slices!",
                          gradStudent: "If I don't find a free bagel soon, I'm dropping this class.",
                          coldWarCowboy: "Life is suffering. And low on RAM. Breakroom, now." } },
    // Rami, Nov 4: TJ and Derek both on the card, shouting together. seenKey is new so everyone sees this version once.
    intern:    { topic: "INTERN DELIVERY", kicker: "SPECIAL DELIVERY", tip: "Catch the interns for a heal and a shield.",
                 duo: ["tj", "derek"], shout: "For my MANAGER!", seenKey: "tip_intern2",
                 lines: { any: "Bless the interns, they remembered my afternoon coffee.",
                          officeWorker: "Bless the interns, they remembered my afternoon coffee.",
                          photographer: "Great pass from the bench, let's go grab that handoff!",
                          gradStudent: "An undergrad with free coffee is my favorite sight on earth.",
                          coldWarCowboy: "Hey, the student worker brought snacks. Let's go say hi." } },
    salad:     { topic: "THE DESK SALAD", kicker: "FRESH GREENS", tip: "Desk Salads heal more than pizza but wilt in 14 seconds.",
                 lines: { any: "A crisp desk salad, and nobody stole it from the fridge.",
                          officeWorker: "A crisp desk salad, and nobody stole it from the fridge.",
                          photographer: "Doctor said more fiber, let's hustle before it wilts!",
                          gradStudent: "Fresh vegetables on my budget? I need to sprint for that!",
                          coldWarCowboy: "A real lunch that didn't come out of a coil machine. Nice." } },
    modifier:  { topic: "AGE 50+ SURPRISES", kicker: "LIFE HAPPENS", tip: "Surprises pass in a few years. The top chip says which.",
                 lines: { any: "I'll just squint at the top bar until this blows over.",
                          officeWorker: "I'll just squint at the top bar until this blows over.",
                          photographer: "Curveball from the ref. Adjust your stance and play on!",
                          gradStudent: "Another surprise fee, and financial aid is already closed.",
                          coldWarCowboy: "System threw a weird pop-up. Give it a minute to clear." } }
  },
  heroNames: { officeWorker: "THE 9-TO-5ER", photographer: "THE SOCCER DAD", gradStudent: "THE GRAD STUDENT", coldWarCowboy: "THE COLDWAR COWBOY" },
  heroSheets: { officeWorker: "office-worker-on-break-v1", photographer: "soccer-dad-on-break-v1", gradStudent: "grad-student-on-break-v1", coldWarCowboy: "cold-war-cowboy-on-break-v3" }
};
