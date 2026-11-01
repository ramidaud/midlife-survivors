// One office blockout. Coordinates are world pixels; 32 pixels = one floor tile.
// Landmarks and discoveries test exploration only, not production item rewards.
window.OFFICE_LAYOUT = {
  name: 'Corporate Campus', width: 1280, height: 896,
  spawn: [0, 38], laneWidth: 192,
  departments: [
    { id: 'accounts', name: 'ACCOUNTS PAYABLE', x: -336, y: -232, color: 0x526078,
      landmark: 'The paperwork skyline', joke: 'Every pile has been marked urgent since 2009.',
      desks: [[-430, -254], [-310, -254]], prop: 'prop_copier', propAt: [-485, -305] },
    { id: 'quiet', name: 'THE QUIET ZONE', x: 336, y: -232, color: 0x3e7775,
      landmark: 'The loudest printer in the building', joke: 'Quiet hours begin as soon as this finishes printing.',
      desks: [[250, -254], [370, -254]], prop: 'prop_copier', propAt: [485, -305] },
    { id: 'breakroom', name: 'THE BREAKROOM', x: -336, y: 232, color: 0xa88b70,
      landmark: 'Friday leftovers', joke: 'The pizza is communal. The mug absolutely is not.',
      desks: [[-430, 210], [-310, 210]], prop: 'prop_cooler', propAt: [-485, 165] },
    { id: 'wellness', name: 'WELLNESS CORNER', x: 336, y: 232, color: 0x83a89a,
      landmark: 'The emotional-support fern', joke: 'The plant has also declined the optional wellness seminar.',
      desks: [[250, 210], [370, 210]], prop: 'prop_plant', propAt: [485, 165] }
  ],
  discoveries: [
    { id: 'coupon', name: 'The ancient coupon', x: -485, y: -160, glyph: '%',
      note: 'Ten percent off. Expired before your last promotion.' },
    { id: 'headphones', name: 'Noise-canceling headphones', x: 485, y: -160, glyph: '♪',
      note: 'You can still see the reply-all notifications. Small victories.' },
    { id: 'pizza', name: 'Leftover Friday pizza', x: -485, y: 320, glyph: '△',
      note: 'A little cold, a little mysterious, still the best meeting today.' }
  ]
};
