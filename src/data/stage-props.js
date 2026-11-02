// Stage props from ChatGPT's Stage 2A and 2B batches, placed into the CURRENT office while the big
// campus overworld is still being drawn. Change positions or captions here; no code needed.
//
// files:  native sprite sheets in assets/stage/props (frames side by side are COLORWAYS, not animation)
// place:  [x, y, family, colorway] in office-layout pixels; x, y is where the prop's feet touch the floor
// flat:   lies on the floor (drawn under everyone, never blocks)
// caption: shown once per run in the lower third when you walk close ("read on approach")
window.USE_STAGE_PROPS = true;
window.STAGE_PROPS = {
  families: {
    desk_sticky_notes: { file: 'desk_sticky_notes-v1.png', frame: [96, 104], frames: 3, desk: 'sticky' },
    desk_family_photo: { file: 'desk_family_photo-v1.png', frame: [96, 104], frames: 3, desk: 'family' },
    desk_2009:         { file: 'desk_2009-v1.png',         frame: [96, 104], frames: 3, desk: 'y2009' },
    kpi_frame:     { file: 'kpi_frame-v1.png',     frame: [80, 96],  frames: 2, solid: false },
    hang_cat_high: { file: 'hang_cat_high-v1.png', frame: [80, 96],  frames: 2, solid: false },
    hang_branch:   { file: 'hang_branch-v1.png',   frame: [80, 96],  frames: 2, solid: false },
    opportunity:   { file: 'opportunity-v1.png',   frame: [80, 96],  frames: 2, solid: false },
    perseverance:  { file: 'perseverance-v1.png',  frame: [80, 96],  frames: 2, solid: false },
    car_compact:   { file: 'car_compact-v1.png',   frame: [144, 112], frames: 3, solid: true, footprint: { width: 118, back: 56, front: 6 } },
    wheel_boot:    { file: 'wheel_boot-v1.png',    frame: [48, 40],  frames: 3, solid: true, footprint: { width: 32, back: 12, front: 3 } },
    sign_plate:    { file: 'sign_plate-v1.png',    frame: [80, 48],  frames: 2, solid: true, footprint: { width: 56, back: 8, front: 3 } },
    gate_hidden_cabinet: { file: 'gate_hidden_cabinet-v1.png', frame: [96, 112], frames: 2, solid: true, footprint: { width: 80, back: 32, front: 4 } },
    // Stage 2B: corporate slang, taken literally
    roundabout: {file: "roundabout-v1.png", frame: [128, 96], frames: 2, solid: true, footprint: {width: 92, back: 30, front: 4}},
    gauge: {file: "gauge-v1.png", frame: [112, 96], frames: 2, solid: false},
    fruit_tree: {file: "fruit_tree-v1.png", frame: [72, 104], frames: 2, solid: true, footprint: {width: 40, back: 20, front: 4}},
    kiddie_pool: {file: "kiddie_pool-v1.png", frame: [112, 80], frames: 2, solid: true, footprint: {width: 88, back: 28, front: 4}},
    baseball_base: {file: "baseball_base-v1.png", frame: [48, 32], frames: 2, solid: false, flat: true},
    ocean_pot: {file: "ocean_pot-v1.png", frame: [72, 72], frames: 2, solid: true, footprint: {width: 48, back: 20, front: 4}},
    duck_row: {file: "duck_row-v1.png", frame: [96, 48], frames: 2, solid: true, footprint: {width: 76, back: 14, front: 3}},
    goal_dollies: {file: "goal_dollies-v1.png", frame: [128, 104], frames: 2, solid: true, footprint: {width: 100, back: 26, front: 4}},
    hard_stop: {file: "hard_stop-v1.png", frame: [64, 96], frames: 2, solid: true, footprint: {width: 32, back: 14, front: 3}},
    offline_lamp: {file: "offline_lamp-v1.png", frame: [64, 88], frames: 2, solid: true, footprint: {width: 38, back: 15, front: 3}}
  },
  captions: {
    desk_sticky_notes: 'There is a monitor under there. According to the last status meeting.',
    desk_family_photo: 'The family photo is the only meeting worth being on time for.',
    desk_2009: 'The desk calendar says 2009. The software budget agrees.',
    kpi_frame: 'What the hell is a KPI again?',
    hang_cat_high: 'Hang in there. The cat still has two paws on the branch.',
    hang_branch: 'Hang in there. The cat has taken PTO.',
    opportunity: 'OPPORTUNITY: Please use the door that has been bricked up.',
    perseverance: 'PERSEVERANCE: The printer has been jammed since Tuesday.',
    car_compact: 'Rebrand? Park it here. We will circle back next quarter.',
    wheel_boot: "Dave's idea is going nowhere. Facilities made it official.",
    sign_plate: 'Rebrand? Another great idea, safely parked.',
    gate_hidden_cabinet: 'FILES. A lavender binder is sticking out. That seems worth a closer look.',
    roundabout: "Circle back. This meeting has its own traffic pattern.",
    gauge: "Move the needle. The needle has requested a follow-up meeting.",
    fruit_tree: "Low-hanging fruit. Finally, a deliverable within reach.",
    kiddie_pool: "Deep dive. Please mind the three inches of water.",
    baseball_base: "Touch base. This could also have been an email.",
    ocean_pot: "Boil the ocean. The kitchenette budget was approved.",
    duck_row: "Ducks in a row. One has concerns about the agenda.",
    goal_dollies: "Move the goalposts. Now with locking casters.",
    hard_stop: "Hard stop. The meeting has negotiated an extension.",
    offline_lamp: "Let's take this offline. Facilities already unplugged it."
  },
  place: [
    // Accounts Payable: the printer poster, next to the paperwork skyline
    [-460, -580, 'perseverance', 0],
    // The Quiet Zone: the KPI frame nobody can explain
    [980, -236, 'kpi_frame', 0],
    // The Breakroom: hang-in-there cat, and Dave's idea, booted
    [-590, 300, 'hang_cat_high', 0],
    [-704, 540, 'car_compact', 2],
    [-760, 548, 'wheel_boot', 0],
    // Wellness Corner: the cat has taken PTO; a parked rebrand
    [818, 300, 'hang_branch', 0],
    [704, 420, 'sign_plate', 0],
    [704, 548, 'car_compact', 0],
    // Accounts Payable: a bricked-up opportunity by the exit
    [-460, -250, 'opportunity', 0],
    // Records Annex: the FILES cabinet with the lavender binder sticking out (next to the lost binder find)
    [-1408, 240, 'gate_hidden_cabinet', 0],
    // Meeting Wing: the cat, a little higher up
    [1392, 60, 'hang_cat_high', 1],
    // --- Stage 2B: slang taken literally ---
    // A traffic island where the north hallway meets the center aisle
    [0, -790, 'roundabout', 0],
    // Touch base: on the floor right where every run starts
    [120, 150, 'baseball_base', 0],
    // Breakroom: the kitchenette is boiling the ocean; the ducks are mostly in a row; one low-hanging fruit
    [-850, 430, 'ocean_pot', 0],
    [-704, 385, 'duck_row', 0],
    [-500, 470, 'fruit_tree', 0],
    // Wellness Corner: deep dive (three inches of water)
    [860, 470, 'kiddie_pool', 0],
    // Quiet Zone: the lamp has been taken offline; someone moved the goalposts
    [960, -420, 'offline_lamp', 0],
    [600, -232, 'goal_dollies', 0],
    // Meeting Wing: hard stop, and the needle that will not move
    [1420, -130, 'hard_stop', 0],
    [1400, 280, 'gauge', 0]
  ]
};
