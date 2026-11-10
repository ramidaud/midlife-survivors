// Causes of death, grouped by what finished you off. One is picked at random.
// Add your own lines anytime. Keep them warm, never mean.
window.DEATHS = {
  // Maple Hollow (Nov 9)
  lego: ["Stepped on a toy brick in socks. Lay down on the floor. Stayed there.", "A single toy brick. Barefoot. Game over, man."],
  leafPile: ["Buried in leaves you said you'd rake on Saturday.", "The leaves won. They always win in November."],
  gutterClog: ["Climbed the ladder to clear the gutter. Did not clear the gutter.", "The gutter overflowed. So did you."],
  lawnMower: ["The neighbor's mower started at 7 AM. You did not.", "Mowed down by a man who says hi but never waves."],
  taxNotice: ["The property tax went up again. So did your blood pressure.", "Reassessed. Found wanting."],
  // The Gold Watch (Gemini, Nov 3)
  goldWatch: [
    "You spent twenty minutes staring at the clock waiting for 4:59 to turn into 5:00.",
    "The Minute Hand caught you sneaking toward the coat rack at 4:58.",
    "HR engraved your name on the back, but spelled it with two Ys. Try again.",
    "Your timesheet was one minute short of forty hours. Payroll says see you Monday.",
    "A loose gear rolled under your sensible shoes. So close to the retirement cake.",
    "You hit snooze for the ninth time and the morning meeting started without you."
  ],
  bill: [
    "Crushed by a late electric bill.",
    "Buried under 'FINAL NOTICE' envelopes.",
    "Signed out by an autopay failure.",
    "Paper-cut into early retirement by a water bill.",
    "Overwhelmed by a surprise HOA fee.",
    "Read the itemized hospital bill. Didn't recover.",
    "You gave it a solid eight hours, plus a working lunch. The spreadsheets will still be here when you get back."
  ],
  lateFee: [
    "A $35 Late Fee finally emptied your wallet and your stamina.",
    "Forgot to click 'Submit Payment' before midnight.",
    "Compounded into oblivion by overdue charges."
  ],
  spamCall: [
    "Answered a call about your car's extended warranty.",
    "Picked up an unknown number from your own area code.",
    "Cornered by a robocall at dinner time."
  ],
  snackAttack: [
    "Ate four glazed donuts at 11:30 PM and entered a food coma.",
    "Succumbed to a late-night kitchen raid.",
    "Defeated by carbs after 40.",
    "The breakroom decaf pot was mislabeled again. Go home, put your feet up, and start fresh at nine."
  ],
  backTwinge: [
    "Sneezed once at 44. Threw out your entire lower back.",
    "Slept on the wrong pillow and never stood up straight again.",
    "Bent over to pick up a sock. Fatal mistake.",
    "You pulled something reaching for a dropped pen. Take the rest of the afternoon to ice it.",
    "You stood up a little too fast and the third floor won this round. Drink some water before your next run.",
    "Your lower back filed a formal grievance with HR. Grab a heating pad and we will circle back tomorrow."
  ],
  officeGossip: [
    "Someone replied 'Thanks!' to all 400 people and your inbox collapsed.",
    "Dragged into a 47-message passive-aggressive email thread.",
    "CC'd on drama that wasn't even in your department.",
    "You accidentally clicked Reply All and decided it was best to simply go home."
  ],
  performanceReview: [
    "Did not meet expectations in Q3.",
    "Placed on a Performance Improvement Plan.",
    "Asked 'Where do you see yourself in 5 years?' and blanked.",
    "Scheduled for a 'quick sync' with HR and never returned."
  ],
  mortgageRefinance: [
    "Buried under 140 pages of closing disclosures.",
    "Crushed by a 7.8% adjustable interest rate.",
    "Forgot to initial page 83 of the escrow agreement."
  ],
  midlifeCrisis: [
    "Bought a cherry-red convertible you couldn't afford.",
    "Tried to learn skateboarding at 48 without knee pads.",
    "Started a podcast instead of going to therapy."
  ],
  allHands: [
    "Got called on during Q&A. Said \"great question.\" It was not.",
    "Stood in the pie chart. You were the budget cut.",
    "Slide 46 of 47. So close."
  ],
  mathHomework: [
    "Tried to explain long division the way you learned it. Wrong.",
    "Paper-cut by a word problem about two trains.",
    "Spent ninety minutes on one fraction. The fraction won."
  ],
  hoaPresident: [
    "Cited by the HOA for leaving your trash cans out 4 minutes past noon.",
    "Fined into oblivion for painting your mailbox 'Non-Approved Eggshell'.",
    "Measured your grass with a ruler. It was 0.2 inches too tall."
  ],
  retirementBoss: [
    "Fell asleep during your own retirement slideshow.",
    "Forgot your financial advisor's password right at Age 79.",
    "Tried to calculate Required Minimum Distributions without coffee."
  ],
  pickleballChamp: [
    "Dove for a kitchen dink shot in the 6:00 AM Senior Pickleball Finals.",
    "Out-hustled by an 88-year-old named Muriel wearing a visor.",
    "Pulled a hamstring arguing a line call at the Rec Center."
  ],
  threeAmThought: [
    "Lay awake replaying something you said in 2009.",
    "Remembered every unanswered email at once.",
    "Wondered if the stove was off. Forever.",
    "Your reading glasses were on top of your head the entire time. Rest your eyes and try again tomorrow."
  ],
  calendarInvite: [
    "Double-booked, then triple-booked, then flattened.",
    "Ran over by a meeting that could have been an email.",
    "Accepted a recurring 7 AM sync. No end date.",
    "A calendar invite with no agenda finally caught up to you. Clock out and go get a sandwich.",
    "That five-minute quick sync turned into a two-hour workshop. Nobody blames you for lying down."
  ],
  groupChat: [
    "Muted the group chat. It found you anyway.",
    "Buried under 412 thumbs-up reactions.",
    "Someone asked 'who's bringing ice?' and you never recovered.",
    "Your password expired mid-battle and required a special character you have never seen before."
  ],
  mathWorksheet: [
    "Couldn't explain long division the 'new way.'",
    "Show your work. You could not show your work.",
    "Trapped in a word problem about two trains."
  ]
};

// More lines from Rami's design doc (Oct 31). Merged into the lists above.
const MORE_DEATHS = {
  bill: ["Autopay blinked. So did you.", "The envelope said FINAL. It meant it.", "Itemized into the next life."],
  lateFee: ["$35 never looked so athletic.", "Midnight plus one minute: legend status.", "Overdue fees held a reunion on your lawn."],
  spamCall: ["Extended warranty found your soft spot.", "Unknown number. Known outcome.", "Dinner time is peak ambush hour."],
  snackAttack: ["The kitchen light won the staring contest.", "Midnight snack committee overruled you.", "Glaze happened. Momentum did not."],
  backTwinge: ["A polite sneeze. An impolite spine.", "The sock was not worth it. It never is.", "Wrong pillow. Right away, consequences."],
  officeGossip: ["Reply All: the final form of cardio.", "CC'd into a plot you didn't audition for.", "Thread length exceeded life expectancy."],
  threeAmThought: ["2009 called. It brought slides.", "The stove was fine. You were not.", "Inbox zero? Try brain zero."],
  calendarInvite: ["Recurring forever: the silent killer.", "Back-to-back, then flat.", "Accepted on accident. Lived on purpose. Briefly."],
  groupChat: ["Who's bringing ice? History will remember.", "412 reactions. Zero exits.", "Muted in app. Unmuted in fate."],
  mathWorksheet: ["New Math: same kid, new rules, old parent.", "Two trains left. You stayed.", "Showing work required. Work declined."],
  performanceReview: ["Q3 synergy remains undiscussed.", "PIP stood for Please Immediately Panic.", "Five-year plan loading... error."],
  newBoss: ["Booked into a walking one-on-one at noon.", "High-fived into early retirement by a 26-year-old.", "You could not match the synergy of a cold-brew habit."],
  holidayParty: ["Swept away by a runaway accounting conga line.", "Overheated in a three-ply acrylic reindeer sweater.", "Cornered by the punch bowl for forty-five minutes."],
  partyGuest: ["Conga'd into a corner.", "You were the last one on the dance floor.", "Someone started the Electric Slide."],
  theReorg: ["Flattened by a brand-new horizontal org chart.", "Moved into a cross-functional pod with no chairs.", "Lost in a dotted-line reporting loop until five."],
  mortgageRefinance: ["Page 83 wanted an initial. You gave up.", "APR did cardio around you.", "Escrow ate the last hit point."],
  midlifeCrisis: ["Leather jacket: approved. Knees: pending.", "The V8 had a better exit strategy.", "Podcast mic on. Common sense off."],
  allHands: ["Could have been an email.", "Taken offline.", "Muted for the rest of the quarter."],
  mathHomework: ["Showed your work. It was wrong.", "New math: 1. You: 0.", "Grounded until the worksheet is done."],
  hoaPresident: ["Trash cans: 4 minutes late to glory.", "Eggshell was never on the palette.", "The ruler does not negotiate."],
  retirementBoss: ["Password hint: your first pet's Wi-Fi.", "Slideshow outlasted the retiree.", "RMD math without coffee: classified hazard."],
  pickleballChamp: ["Muriel sends her regards. And a visor.", "Dink shot: small ball, big feelings.", "Line call disputed. Hamstring settled it."],
  // Used when an enemy has no lines of its own yet.
  fallback: ["Midlife called. You picked up.", "The actuarial tables were undefeated today.", "Form W-40 filed itself."]
};
Object.keys(MORE_DEATHS).forEach(k => { window.DEATHS[k] = (window.DEATHS[k] || []).concat(MORE_DEATHS[k]); });

// A hero's own last words, used now and then instead of the killer's line (Nov 5).
// The Coldwar Cowboy's are Ben's, from the Bulky Boyz chat.
window.HERO_DEATHS = {
  chance: 0.35,
  coldWarCowboy: [
    "Life is suffering. The Coldwar Cowboy logs off.",
    "\"I'll sleep when I'm dead.\" Well. Goodnight, Cowboy.",
    "Sorry bro. He already has reservations to be eaten by worms.",
    "\"Did I get too good? Are you locking me out?\" Yes. Yes we are.",
    "He doesn't talk to people anymore, so there were no famous last words.",
    "Um, he's a creative. He needed an audience. Try again.",
    "The pain of living on the bleeding edge.",
    "Problem exists between chair and keyboard."
  ]
};
