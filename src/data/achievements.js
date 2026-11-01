// Achievements (from Rami's design doc). Each one listens for a game event and unlocks once, forever.
// Rewards are 401(k) coins (in thousands). Rename them, change rewards, or add new ones freely.
//   on:    which event it listens for (kill, bossKill, split, evolve, plant, pizzaAfterSlow, death, clear, age, shopMax, swarmSurvived)
//   test:  (data, run, life) => true when earned. run = this run's counters, life = lifetime counters.
window.ACHIEVEMENTS = [
  { id: "firstCoffee",   icon: "📧", name: "Per My Last Email",         desc: "Pay off 50 Bills in one run.",            reward: 3,  on: "kill", test: (d, run) => run.bills >= 50 },
  { id: "overduePro",    icon: "⏰", name: "Past Due Professional",     desc: "Let 10 Bills go overdue and split.",      reward: 2,  on: "split", test: (d, run, life) => life.splits >= 10 },
  { id: "sugarSidestep", icon: "🍩", name: "Stronger Than Glaze",       desc: "Get slowed by a Donut, then eat pizza.",  reward: 2,  on: "pizzaAfterSlow", test: () => true },
  { id: "sockRisk",      icon: "🧦", name: "The Sock Incident",         desc: "Lose a run to a Back Twinge.",            reward: 2,  on: "death", test: d => d.killer === "backTwinge" },
  { id: "replyAll",      icon: "📨", name: "Leave This Thread",         desc: "Beat a Reply-All Chain.",                 reward: 4,  on: "kill", test: d => d.kind === "officeGossip" },
  { id: "solidAdvice",   icon: "🌙", name: "Solid Advice",              desc: "Beat a 3 AM Thought.",                    reward: 3,  on: "kill", test: d => d.kind === "threeAmThought" },
  { id: "declineMeeting",icon: "📅", name: "Could Have Been An Email",  desc: "Beat 20 Calendar Invites in one run.",    reward: 3,  on: "kill", test: (d, run) => (run.kinds.calendarInvite || 0) >= 20 },
  { id: "muteFailed",    icon: "💬", name: "Mute Failed",               desc: "Beat a Group Chat.",                      reward: 3,  on: "kill", test: d => d.kind === "groupChat" },
  { id: "showYourWork",  icon: "📐", name: "Show Your Work",            desc: "Beat Math Homework.",                     reward: 4,  on: "kill", test: d => d.kind === "mathWorksheet" },
  { id: "q3Met",         icon: "📈", name: "Exceeds Expectations",      desc: "Beat the Performance Review.",            reward: 5,  on: "bossKill", test: d => d.kind === "performanceReview" },
  { id: "escrowHero",    icon: "🏠", name: "Initial Here",              desc: "Beat the 30-Year Mortgage.",              reward: 6,  on: "bossKill", test: d => d.kind === "mortgageRefinance" },
  { id: "keepTheSedan",  icon: "🚗", name: "Keep The Sedan",            desc: "Beat the Midlife Crisis V8.",             reward: 8,  on: "bossKill", test: d => d.kind === "midlifeCrisis" },
  { id: "retired",       icon: "🎂", name: "Retirement Plan",           desc: "Reach your Retirement Party in Midlife. Unlocks Full Life.", reward: 10, on: "clear", test: d => d.mode === "midlife" },
  { id: "grassLegal",    icon: "📏", name: "0.2 Inches Legal",          desc: "Beat the HOA Board President.",           reward: 8,  on: "bossKill", test: d => d.kind === "hoaPresident" },
  { id: "vested",        icon: "🪙", name: "Fully Vested",              desc: "Reach age 80.",                           reward: 10, on: "age", test: d => d.age >= 80 },
  { id: "kitchenDink",   icon: "🏓", name: "Kitchen Violation",         desc: "Beat the 6AM Pickleball Champion.",       reward: 12, on: "bossKill", test: d => d.kind === "pickleballChamp" },
  { id: "centenarian",   icon: "🤝", name: "Shake Death's Hand",        desc: "Meet Father Time at 100.",                reward: 25, on: "clear", test: d => d.mode === "full" && d.age >= 99.5 },
  { id: "coldBrewed",    icon: "⚡", name: "Concentrate",               desc: "Evolve Cold Brew Concentrate.",           reward: 5,  on: "evolve", test: d => /Cold Brew/.test(d.name) },
  { id: "punStorm",      icon: "🌩️", name: "Unhinged",                  desc: "Evolve Unhinged Pun Storm.",              reward: 5,  on: "evolve", test: d => /Pun Storm/.test(d.name) },
  { id: "boundaries",    icon: "🛡️", name: "Healthy Boundaries",        desc: "Evolve Healthy Boundaries.",              reward: 5,  on: "evolve", test: d => /Healthy Boundaries/.test(d.name) },
  { id: "smartTv",       icon: "📡", name: "Lost The Remote",           desc: "Evolve the Smart TV.",                    reward: 5,  on: "evolve", test: d => /Smart TV/.test(d.name) },
  { id: "pivot",         icon: "🧮", name: "Pivot Table Of Doom",       desc: "Evolve the Pivot Table.",                 reward: 5,  on: "evolve", test: d => /Pivot Table/.test(d.name) },
  { id: "binge",         icon: "🍿", name: "One More Episode",          desc: "Evolve Binge Mode.",                      reward: 5,  on: "evolve", test: d => /Binge Mode/.test(d.name) },
  { id: "allEvos",       icon: "🧬", name: "Fully Evolved Adult",       desc: "Evolve all 9 evolutions (any runs).",     reward: 20, on: "evolve", test: (d, run, life) => Object.keys(life.evos || {}).length >= 9 },
  { id: "soccerDad",     icon: "⚽", name: "Orange Slice Logistics",    desc: "Reach 50 as The Soccer Dad.",             reward: 5,  on: "age", test: d => d.age >= 50 && d.char === "photographer" },
  { id: "nightOwl",      icon: "🎓", name: "Seminar Survivor",          desc: "Reach 50 as The Grad Student.",           reward: 5,  on: "age", test: d => d.age >= 50 && d.char === "gradStudent" },
  { id: "taxSeason",     icon: "🧾", name: "April Is Coming",           desc: "Survive a Tax Season swarm.",             reward: 3,  on: "swarmSurvived", test: d => d.id === "taxSeason" },
  { id: "plantDad",      icon: "🪴", name: "Breakroom Forager",         desc: "Smash 25 potted plants (any runs).",      reward: 4,  on: "plant", test: (d, run, life) => life.plants >= 25 },
  { id: "auditSurvivor", icon: "🧾", name: "Audit Survivor",            desc: "Reach retirement in Midlife at Tax Bracket 1+.", reward: 10, on: "clear", test: d => d.mode === "midlife" && d.taxBracket >= 1 },
  { id: "auditTrail",    icon: "🗂️", name: "Paper Trail",               desc: "Reach retirement in Midlife at Tax Bracket 3+.", reward: 20, on: "clear", test: d => d.mode === "midlife" && d.taxBracket >= 3 },
  { id: "fullAudit",     icon: "🏛️", name: "Full Audit",                desc: "Reach retirement in Midlife at Tax Bracket 5.",  reward: 40, on: "clear", test: d => d.mode === "midlife" && d.taxBracket >= 5 },
  { id: "shopRat",       icon: "💼", name: "Maxed The Match",           desc: "Max out Employer Match in the shop.",     reward: 5,  on: "shopMax", test: d => d.id === "compoundInterest" }
];
