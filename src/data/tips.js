// Lower third messages. Edit the words freely; keep each line short (about 60 characters).
// First-time tips show ONCE EVER (the game remembers), the first time you meet each thing.
window.TIPS = {
  start:       { badge: "TIP", text: "Your weapons fire on their own. Just keep moving.", touchText: "Drag anywhere to walk. Your weapons fire on their own.", skipWhileTeaching: true }, // the FIRST DAY line already says this in runs 1-3
  bill:        { badge: "TIP", text: "Pay off Bills fast before they split into Late Fees.", onSpawn: false }, // off (Nov 7): fired at 1.2 s and stepped on PAID!. The Late Fee tip teaches it at the moment it happens.
  lateFee:     { badge: "TIP", text: "That Bill went overdue and split into Late Fees. Pay Bills off fast." },
  spamCall:    { badge: "TIP", text: "Spam Likely rings before it charges. Step aside." },
  snackAttack: { badge: "TIP", text: "Donuts slow you down if they touch you. Tempting, but no." },
  backTwinge:  { badge: "TIP", text: "Back Twinges lunge in bursts. Move when they pause." },
  officeGossip:{ badge: "TIP", text: "Reply-All Chains are tough. Hit them from a distance." },
  plant:       { badge: "TIP", text: "Potted plants hide pizza and coins. Shoot them open." },
  threeAmThought: { badge: "TIP", text: "3 AM Thoughts fade in and out. Hit them while they're solid." },
  calendarInvite: { badge: "TIP", text: "Calendar Invites charge in a straight line. Sidestep!" },
  groupChat:      { badge: "TIP", text: "Group Chats hang back. Dodge when you see \"typing...\"" },
  closeCall:      { badge: "TIP", text: "CLOSE CALL! Near misses give you XP and a quick burst of speed." },
  mathWorksheet:  { badge: "TIP", text: "Math Homework spirals in close. Break out of the ring!" }
};

// Chapter cards: shown each time you hit a new decade.
window.CHAPTER_CARDS = {
  50: "Your 50s. The knees start talking.",
  60: "Your 60s. Everything costs more, including standing up.",
  70: "Your 70s. You have opinions about lawn care.",
  80: "Your 80s. Bonus years. Make them count.",
  90: "Your 90s. Father Time is checking his watch."
};

// Alerts: short lines for urgent moments.
window.ALERTS = {
  lowHp: "Your back is barking. Find leftover pizza."
};
