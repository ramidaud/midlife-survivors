/* Isolated design review. No Phaser, game state, storage or network writes. */
(() => {
  'use strict';
  const plan = window.CAMPUS_V2;
  const $ = id => document.getElementById(id);
  let selected = 'lobby';
  const permits = c => (!c.achievement || $('achievement').checked) && (c.minAge == null || Number($('age').value) >= c.minAge);
  function reachable() {
    const seen = new Set(['lobby']);
    let changed = true;
    while (changed) {
      changed = false;
      for (const c of [...plan.connections, ...plan.wrapConnections]) {
        if (!permits(c)) continue;
        if (seen.has(c.fromDistrict) || seen.has(c.toDistrict)) {
          for (const id of [c.fromDistrict, c.toDistrict]) if (!seen.has(id)) {seen.add(id); changed = true;}
        }
      }
    }
    return seen;
  }
  function mode(measured) {
    $('painting').hidden = measured;
    $('blueprint').hidden = !measured;
    $('illustrated').setAttribute('aria-pressed', String(!measured));
    $('measured').setAttribute('aria-pressed', String(measured));
  }
  function details(open) {
    const d = plan.districts.find(d => d.id === selected);
    $('details').replaceChildren();
    const title = document.createElement('strong'); title.textContent = `${d.name} · ${open.has(d.id) ? 'open' : 'locked'}`;
    const shape = document.createElement('p'); shape.textContent = d.shape;
    const landmark = document.createElement('p'); landmark.textContent = `Landmark: ${d.landmark}`;
    const dressing = document.createElement('p'); dressing.textContent = 'Floor stories: ' + plan.combatSpaces.filter(s => s.district === d.id).flatMap(s => s.decor).join(', ') + '.';
    $('details').append(title, shape, landmark, dressing);
  }
  function update() {
    const open = reachable();
    $('accessible').textContent = 'Open: ' + plan.districts.filter(d => open.has(d.id)).map(d => d.name).join(', ');
    const phase = [...plan.schedule.phases].reverse().find(p => p.age <= Number($('age').value));
    $('promotion').textContent = phase.message + ($('achievement').checked ? ' ' + plan.schedule.hidden.message : '');
    document.querySelectorAll('#blueprint .district').forEach(el => el.classList.toggle('locked', !open.has(el.dataset.district)));
    document.querySelectorAll('#blueprint .gate').forEach(el => {
      const c = el.dataset.gate ? plan.connections.find(c => c.id === el.dataset.gate) : plan.wrapConnections.find(c => c.id === el.dataset.wrap);
      el.classList.toggle('open', permits(c));
    });
    document.querySelectorAll('#districts button').forEach(el => { el.classList.toggle('locked', !open.has(el.dataset.id)); el.setAttribute('aria-pressed', String(el.dataset.id === selected)); });
    details(open);
  }
  for (const d of plan.districts) {
    const button = document.createElement('button'); button.textContent = d.name; button.dataset.id = d.id;
    button.onclick = () => {selected = d.id; update();}; $('districts').append(button);
  }
  $('illustrated').onclick = () => mode(false); $('measured').onclick = () => mode(true);
  $('zoom').onchange = () => document.querySelectorAll('.map-content').forEach(el => el.style.width = Number($('zoom').value) * 100 + '%');
  for (const id of ['age','achievement']) $(id).onchange = () => {mode(true); update();};
  $('routes').onchange = () => $('blueprint').classList.toggle('hide-routes', !$('routes').checked);
  const groups = {};
  for (const prop of plan.production.propFamilies) (groups[prop.category] ||= []).push(prop.id.replaceAll('_',' '));
  for (const [group, ids] of Object.entries(groups)) {const p = document.createElement('p'); p.textContent = `${group}: ${ids.join(', ')}`; $('kit').append(p);}
  for (const c of plan.production.captions) {const option = document.createElement('option'); option.value = c.id; option.textContent = c.shortLabel; $('caption').append(option);}
  const caption = () => $('tip').textContent = plan.production.captions.find(c => c.id === $('caption').value).fullLine;
  $('caption').onchange = caption; caption();
  function sprite(id,src,sx,sy,w,h) {
    const img = new Image(); img.onload = () => {
      const ctx = $(id).getContext('2d', {willReadFrequently:true}); ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img,sx,sy,w,h,0,0,w,h);
      const pixels = ctx.getImageData(0,0,w,h);
      for (let i=0;i<pixels.data.length;i+=4) if (pixels.data[i]===255 && pixels.data[i+1]===0 && pixels.data[i+2]===255) pixels.data[i+3]=0;
      ctx.putImageData(pixels,0,0);
    }; img.src = src;
  }
  sprite('hero',window.CHARACTER_SHEETS.officeWorker,56,0,56,60);
  sprite('bill',window.ENEMY_ART_REVIEW.find(e => e.id === 'bill').src,0,0,48,48);
  update();
})();
