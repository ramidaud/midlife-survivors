// Stage props from ChatGPT's Stage 2A batch, placed into the CURRENT office while the big
// campus overworld is still being drawn. Change positions or captions here; no code needed.
//
// files:  native sprite sheets in assets/stage/props (frames side by side are COLORWAYS, not animation)
// place:  [x, y, family, colorway] in office-layout pixels; x, y is where the prop's feet touch the floor
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
    gate_hidden_cabinet: { file: 'gate_hidden_cabinet-v1.png', frame: [96, 112], frames: 2, solid: true, footprint: { width: 80, back: 32, front: 4 } }
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
    gate_hidden_cabinet: 'FILES. A lavender binder is sticking out. That seems worth a closer look.'
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
    [1392, 60, 'hang_cat_high', 1]
  ]
};
