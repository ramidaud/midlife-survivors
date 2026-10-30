// Life Stages & Environments (`src/data/stages.js`).
// Defines the unlockable worlds and life chapters as you progress through Midlife Survivors:
//   1. Corporate Office (Career & Bills)
//   2. Hospital & Delivery Wing (Birth, Medical Deductibles & 3 AM Feedings)
//   3. Suburban Home & Backyard (Parenting, LEGO Minefields, Kids' Homework & Mortgages)
//   4. The Social Bistro & Patio (Navigating Adult Friendships, Group Chats & Flaky Plans)
//   5. Sunset Palms Senior Resort (Ages 80-100: Pickleball Courts, HOA & Early-Bird Buffets)

window.STAGES = [
  {
    id: "office",
    name: "🏢 The Open-Plan Office",
    chapter: "CAREER & CUBICLES",
    unlockAge: 40,
    tagline: "Fluorescent lights, endless spreadsheets, and lukewarm breakroom coffee.",
    floorPrimary: "#242c4c",
    floorSecondary: "#1c223b",
    floorAccent: "#8a5a36",
    rugColor: "#1f5c6e",
    sky3d: 0x1e2f66,
    fog3d: 0x283c7a,
    diabloBg: 0x07060d,
    labels: {
      bill: "BILL", lateFee: "LATE!", spamCall: "SPAM",
      snackAttack: "DONUT", backTwinge: "OUCH!", officeGossip: "RE:RE:"
    },
    challenges: ["Survive the Q4 Performance Review", "Smash Potted Ferns for Breakroom Pizza"]
  },
  {
    id: "hospital",
    name: "🏥 St. Deductible Hospital",
    chapter: "BIRTH & SLEEPLESS NIGHTS",
    unlockAge: 44,
    tagline: "The Delivery Wing! Out-of-network copays, 3 AM feedings, and pager alarms.",
    floorPrimary: "#233d47",
    floorSecondary: "#1b313a",
    floorAccent: "#388e9c",
    rugColor: "#2b6e5e",
    sky3d: 0x16384c,
    fog3d: 0x1e4b63,
    diabloBg: 0x061014,
    labels: {
      bill: "CO-PAY", lateFee: "DEDUCT!", spamCall: "PAGER!",
      snackAttack: "JELL-O", backTwinge: "CRAMP!", officeGossip: "3AM CRY"
    },
    challenges: ["Delivery Room Dash", "Survive 3 AM Sleep Deprivation Waves"]
  },
  {
    id: "home",
    name: "🏡 Suburban Home & Yard",
    chapter: "PARENTING & HOMEOWNERSHIP",
    unlockAge: 50,
    tagline: "Oak floors, backyard grass, stray LEGO bricks, carpools, and New Math homework.",
    floorPrimary: "#3d2e22",
    floorSecondary: "#26472b",
    floorAccent: "#6e4f35",
    rugColor: "#7a283b",
    sky3d: 0x2b4c7e,
    fog3d: 0x3b629b,
    diabloBg: 0x0c0906,
    labels: {
      bill: "TUITION", lateFee: "LEGO!", spamCall: "SCHOOL",
      snackAttack: "JUICEBX", backTwinge: "CARPOOL", officeGossip: "NEWMATH"
    },
    challenges: ["Step Around the LEGO Minefield", "Survive Common Core Math Homework"]
  },
  {
    id: "social",
    name: "🍻 The Social Courtyard",
    chapter: "NAVIGATING FRIENDSHIPS",
    unlockAge: 60,
    tagline: "Trying to schedule one dinner with 4 adult friends who all cancel at 6:45 PM.",
    floorPrimary: "#38243d",
    floorSecondary: "#2a1b2e",
    floorAccent: "#9c6b3b",
    rugColor: "#5e2b4c",
    sky3d: 0x381e54,
    fog3d: 0x4c286e,
    diabloBg: 0x110614,
    labels: {
      bill: "SPLIT$", lateFee: "FLAKE!", spamCall: "TXT-47",
      snackAttack: "TAPAS", backTwinge: "9PM BED", officeGossip: "DRAMA"
    },
    challenges: ["Keep the Group Chat Alive", "Escape the 'Let's Split the Check Evenly' Trap"]
  },
  {
    id: "senior",
    name: "🌴 Sunset Palms Resort",
    chapter: "SENIOR BONUS ROUNDS (80-100)",
    unlockAge: 80,
    tagline: "Terracotta lanais, 6 AM pickleball courts, HOA patrols, and 3 PM Early-Bird Buffets.",
    floorPrimary: "#473228",
    floorSecondary: "#24473e",
    floorAccent: "#c28d42",
    rugColor: "#28667a",
    sky3d: 0x4a2c59,
    fog3d: 0x6e4266,
    diabloBg: 0x120a06,
    labels: {
      bill: "COPAY", lateFee: "HOA$", spamCall: "SCAM!",
      snackAttack: "PRUNE", backTwinge: "HIP!", officeGossip: "BINGO"
    },
    challenges: ["Defeat the 6 AM Pickleball Champion", "Reach Age 100 Centenarian Legend"]
  }
];

// Pick the active Stage based on player preference (`meta.selectedStage`) or automatic Age progression!
window.getActiveStage = function(age, metaObj) {
  if (metaObj && metaObj.selectedStage && metaObj.selectedStage !== "auto") {
    const found = window.STAGES.find(s => s.id === metaObj.selectedStage);
    if (found) return found;
  }
  let cur = window.STAGES[0];
  for (const st of window.STAGES) {
    if (age >= st.unlockAge) cur = st;
  }
  return cur;
};
