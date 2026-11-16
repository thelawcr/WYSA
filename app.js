(() => {
const $ = s => document.querySelector(s);
const CATS = [
  {id:'food', n:'Comida', e:'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2.5 1.5-3.5 4-3.5 7 0 2 1 3 3.5 3', c:'#ff9f43', k:'out'},
  {id:'trans', n:'Transporte', e:'M5 4h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM4 11h16M8 20v-3M16 20v-3M8 14h.01M16 14h.01', c:'#54a0ff', k:'out'},
  {id:'home', n:'Casa', e:'M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6', c:'#a29bfe', k:'out'},
  {id:'fun', n:'Ocio', e:'M4 5h16v14H4zM10 9l5 3-5 3z', c:'#ff6b8b', k:'out'},
  {id:'health', n:'Salud', e:'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z', c:'#1dd1a1', k:'out'},
  {id:'shop', n:'Compras', e:'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2', c:'#feca57', k:'out'},
  {id:'bills', n:'Servicios', e:'M13 2L5 14h6l-1 8 8-12h-6z', c:'#48dbfb', k:'out'},
  {id:'other', n:'Otros', e:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18', c:'#c8d6e5', k:'out'},
  {id:'salary', n:'Salario', e:'M4 8h16v11H4zM9 8V5h6v3M4 13h16', c:'#5ef2c0', k:'in'},
  {id:'extra', n:'Extra', e:'M4 11h16v9H4zM3 8h18v3H3zM12 8v12M12 8c-3 0-4-4-1.5-4S12 8 12 8zM12 8c3 0 4-4 1.5-4S12 8 12 8z', c:'#7bed9f', k:'in'},
  {id:'sale', n:'Ventas', e:'M3 12V4h8l10 10-8 8zM7.5 8h.01', c:'#55efc4', k:'in'},
  {id:'oin', n:'Otros', e:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18', c:'#c8d6e5', k:'in'},
];
const ic = (c, col) => `<svg viewBox="0 0 24 24" style="stroke:${col||c.c}"><path d="${c.e}"/></svg>`;
const SYM = {CRC:'₡',USD:'$',EUR:'€',MXN:'$',COP:'$',GTQ:'Q'};
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let tx = load('wysa_tx', []);
let cur = load('wysa_cur', 'CRC');
let range = 'day', type = 'out', catId = null;

const fmt = n => {
  try { return new Intl.NumberFormat('es-CR', {style:'currency', currency:cur, maximumFractionDigits: cur==='CRC'||cur==='COP'?0:2}).format(n); }
  catch { return SYM[cur] + n.toFixed(2); }
};
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
const cat = id => CATS.find(c => c.id === id) || CATS[7];
const esc = s => s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

function inRange(date) {
  const d = new Date(date + 'T00:00:00'), n = new Date(); n.setHours(0,0,0,0);
  const diff = Math.round((n - d) / 864e5);
  if (range === 'day') return diff === 0;
  if (range === 'week') return diff >= 0 && diff < 7;
  return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
}
function dayLabel(date) {
  const diff = Math.round((new Date(today()+'T00:00:00') - new Date(date+'T00:00:00')) / 864e5);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return new Date(date+'T00:00:00').toLocaleDateString('es', {weekday:'long', day:'numeric', month:'short'});
}

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
function tween(el, to) {
  const from = el._v ?? 0; el._v = to;
  if (reduce || from === to) { el.textContent = fmt(to); return; }
  const t0 = performance.now(), dur = 700;
  cancelAnimationFrame(el._raf);
  const step = now => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt(from + (to - from) * e);
    if (p < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}
let seen = new Set();
function render() {
  const inc = tx.filter(t => t.type==='in').reduce((a,t)=>a+t.amount,0);
  const out = tx.filter(t => t.type==='out').reduce((a,t)=>a+t.amount,0);
  tween($('#balance'), inc - out);
  tween($('#totIn'), inc);
  tween($('#totOut'), out);
  $('#curSym').textContent = SYM[cur];
  const h = new Date().getHours();
  $('#greeting').textContent = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';

  // resumen por categoría
  const spent = tx.filter(t => t.type==='out' && inRange(t.date));
  const total = spent.reduce((a,t)=>a+t.amount,0);
  tween($('#spent'), total);
  const by = {};
  spent.forEach(t => by[t.cat] = (by[t.cat]||0) + t.amount);
  const rows = Object.entries(by).sort((a,b)=>b[1]-a[1]);
  $('#bars').innerHTML = rows.length ? rows.map(([id,v]) => {
    const c = cat(id);
    return `<div class="bar"><div class="l"><span><span class="dot" style="background:${c.c}"></span>${c.n}</span><span>${fmt(v)}</span></div>
      <div class="t"><div class="f" data-w="${v/total*100}" style="width:0;background:${c.c}"></div></div></div>`;
  }).join('') : '<div class="empty">Sin gastos en este periodo</div>';
  requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll('.bar .f').forEach(f => f.style.width = f.dataset.w + '%')));

  // lista
  const sorted = [...tx].sort((a,b) => b.date.localeCompare(a.date) || b.id - a.id);
  let html = '', last = '', n = 0; const now = new Set();
  sorted.forEach(t => {
    if (t.date !== last) { html += `<div class="day">${dayLabel(t.date)}</div>`; last = t.date; }
    const c = cat(t.cat);
    now.add(t.id); const fresh = !seen.has(t.id);
    html += `<div class="item glass${fresh ? ' enter' : ''}" style="--i:${fresh ? n++ : 0}"><div class="ico" style="background:linear-gradient(135deg,${c.c}40,${c.c}12);box-shadow:inset 0 1px 0 rgba(255,255,255,.25)">${ic(c)}</div>
      <div class="m"><b>${c.n}</b><span>${esc(t.note||'')}</span></div>
      <div class="a ${t.type}">${t.type==='in'?'+':'−'}${fmt(t.amount)}</div>
      <button class="del" data-id="${t.id}" aria-label="Eliminar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`;
  });
  seen = now;
  $('#list').innerHTML = html || '<div class="empty">Aún no hay movimientos.<br>Toca + para agregar el primero.</div>';
}

function renderCats() {
  const list = CATS.filter(c => c.k === type);
  if (!list.find(c => c.id === catId)) catId = list[0].id;
  $('#cats').innerHTML = list.map(c =>
    `<button type="button" class="cat ${c.id===catId?'on':''}" data-c="${c.id}"><i>${ic(c)}</i>${c.n}</button>`).join('');
}

const ymd = off => { const d = new Date(); d.setDate(d.getDate() - off); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
function syncDate() {
  const v = $("#date").value, t = ymd(0), y = ymd(1);
  document.querySelectorAll("#dates .chip[data-d]").forEach(c => c.classList.toggle("on", v === ymd(+c.dataset.d)));
  const other = v && v !== t && v !== y;
  $("#pick").classList.toggle("on", other);
  $("#pickLbl").textContent = other ? new Date(v + "T00:00:00").toLocaleDateString("es", {day:"numeric", month:"short"}) : "Otra fecha";
}
$("#date").max = ymd(0);
$("#dates").onclick = e => { const b = e.target.closest("[data-d]"); if (b) { $("#date").value = ymd(+b.dataset.d); syncDate(); } };
$("#date").onchange = syncDate;
const open = el => el.classList.add('open');
const close = el => el.classList.remove('open');

$('#fab').onclick = () => { $('#date').value = today(); syncDate(); $('#amount').value=''; $('#note').value=''; renderCats(); open($('#sheet')); setTimeout(()=>$('#amount').focus(), 350); };
$('#btnSettings').onclick = () => { $('#currency').value = cur; open($('#settings')); };
document.querySelectorAll('[data-close]').forEach(s => s.onclick = () => close(s.parentElement));
$('#cats').onclick = e => { const b = e.target.closest('.cat'); if (b) { catId = b.dataset.c; renderCats(); } };
$('#type').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  type = b.dataset.t; catId = null;
  document.querySelectorAll('#type button').forEach(x => x.classList.toggle('on', x === b));
  renderCats();
};
$('#range').onclick = e => {
  const b = e.target.closest('button'); if (!b) return;
  range = b.dataset.r;
  document.querySelectorAll('#range button').forEach(x => x.classList.toggle('on', x === b));
  render();
};
$('#form').onsubmit = e => {
  e.preventDefault();
  const amount = parseFloat($('#amount').value.replace(',', '.'));
  if (!(amount > 0)) return $('#amount').focus();
  tx.push({id: Date.now(), type, cat: catId, amount, note: $('#note').value.trim(), date: $('#date').value || today()});
  save('wysa_tx', tx); render(); close($('#sheet'));
};
$('#list').onclick = e => {
  const b = e.target.closest('.del'); if (!b) return;
  const row = b.closest(".item"), id = +b.dataset.id;
  const done = () => { tx = tx.filter(t => t.id !== id); save("wysa_tx", tx); render(); };
  if (reduce) return done();
  row.classList.add("leave"); setTimeout(done, 320);
};
$('#currency').onchange = e => { cur = e.target.value; save('wysa_cur', cur); render(); };
$('#btnClear').onclick = () => { if (confirm('¿Borrar todos los movimientos? No se puede deshacer.')) { tx = []; save('wysa_tx', tx); render(); close($('#settings')); } };

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
